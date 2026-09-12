---
title: "Kubernetes Operator con Kubebuilder: best practice per evitare conflitti, retry inutili e reconciliation infinite"
subtitle: "Quando più controller toccano la stessa Custom Resource, la concorrenza diventa un problema reale: ecco come gestirla in modo robusto e scalabile."
description: "Scrivere operator Kubernetes “che funzionano” è relativamente semplice. Scrivere operator che reggono carico, parallelismo e aggiornamenti concorrenti lo è molto meno. In questo articolo vediamo le best practice più importanti in Kubebuilder per gestire più controller, prevenire conflitti di aggiornamento (resourceVersion), implementare retry efficienti ed evitare loop infiniti di reconciliation. Il tutto usando un caso concreto: un autoscaler custom che aggiorna un NodePool CR per far creare nuove VM a un controller dedicato."
publishedAt: 2026-07-31
tags: ["kubebuilder","operator-pattern","resourceversion","controller-runtime","reconciliation"]
---
## Il problema vero degli Operator: la concorrenza sugli aggiornamenti

Nel mondo reale raramente hai **un solo controller** che gestisce “la sua” risorsa in modo isolato. Appena introduci:

- più controller nello stesso progetto (o nello stesso manager),
- controller che **scrivono su risorse altrui**,
- azioni lente (creare VM, registrare nodi, provisioning…),

inizi a scontrarti con un tema inevitabile: **gli aggiornamenti concorrenti della stessa Custom Resource (CR)**.

Per capire bene cosa succede, servono due concetti chiave di Kubernetes:

- **`metadata.generation`**: aumenta *solo* quando cambia la **spec**.
- **`metadata.resourceVersion`**: cambia *a ogni* modifica dell’oggetto (spec, status, label, annotation… tutto).

Questa distinzione è cruciale perché i conflitti che ti esplodono addosso in fase di update dipendono quasi sempre da `resourceVersion`, non da `generation`.

### Generation vs resourceVersion in pratica

- Se modifichi `spec.targetNodes`, cambia **generation** e cambia **resourceVersion**.
- Se aggiungi una label o un’annotation, **non** cambia generation, ma cambia **resourceVersion**.

In altre parole: **qualsiasi write** su un oggetto produce una nuova `resourceVersion`. E Kubernetes usa proprio quel valore per proteggerti dall’aggiornare “una copia vecchia” dell’oggetto.

## Scenario tipico: NodePool + Autoscaler, due controller e una CR condivisa

Immagina un operator che gestisce un CRD `NodePool`:

- `spec.targetNodes`: quanti nodi vuoi.
- `status.scaleOperation`: `inactive | active` per indicare se è in corso una scalata.

Il controller `NodePoolReconciler`:

1. legge `spec.targetNodes`,
2. crea VM nel cloud,
3. registra i nodi nel cluster,
4. aggiorna lo status (da `active` a `inactive`).

Poi aggiungi un secondo CRD `Autoscaler`, con un suo controller, che periodicamente:

- scansiona alcuni namespace,
- trova Pod Pending *per CPU/memoria*,
- **incrementa `spec.targetNodes` del NodePool** per innescare la creazione di nuove VM.

Quindi hai:

- Controller A (NodePool): scrive soprattutto su `status` e talvolta su spec.
- Controller B (Autoscaler): scrive su `spec` del NodePool.

Ed è qui che iniziano i guai.

## Il conflitto classico: update su una copia “stale” (resourceVersion mismatch)

La sequenza tipica è:

1. Il controller NodePool inizia a riconciliare leggendo il NodePool a `resourceVersion = 1` e fa caching in memoria.
2. Nel frattempo l’autoscaler aggiorna `spec.targetNodes` (es. da 1 a 2): l’oggetto in etcd diventa `resourceVersion = 2`.
3. Il NodePool controller termina il provisioning e prova ad aggiornare lo status usando **la copia vecchia** (rv=1).
4. Kubernetes rifiuta la write con un **409 Conflict** (“the object has been modified; please apply your changes to the latest version”).

Questa non è un’eccezione “rara”: con operazioni lente + controller multipli è *normale*.

## Best practice 1: separa spec e status (e usa la subresource `status`)

Prima regola: se la tua CRD lo consente, abilita e usa lo **status subresource**.

- **Spec**: desiderio dell’utente (o di un altro controller che si comporta da “utente”).
- **Status**: osservazioni del controller.

In Kubebuilder questo significa progettare bene l’API e poi, nel reconciler, aggiornare lo status con:

- `r.Status().Update(ctx, obj)`

così da non “toccare” la spec accidentalmente.

Questo non elimina i conflitti, ma riduce drasticamente i casi in cui i controller si pestano i piedi.

## Best practice 2: gestisci i Conflict in modo esplicito (retry solo quando serve)

Quando scrivi su Kubernetes devi assumere che **il Conflict sia un caso normale**.

Strategia robusta:

1. tenti l’update,
2. se ricevi `apierrors.IsConflict(err)`:
   - fai `Get()` dell’oggetto aggiornato,
   - ri-applichi *solo* la tua modifica (tipicamente su status),
   - ritenti l’update.

Importante: non fare retry “ciechi” su qualsiasi errore. Un retry infinito su errori permanenti (es. validazione, permessi, quota) peggiora la situazione.

## Best practice 3: evita loop infiniti di reconciliation (status che causa eventi)

Ogni update di un oggetto può generare eventi che ri-attivano la reconciliation.

Due trappole comuni:

- aggiorni lo status a ogni reconcile anche se non cambia nulla;
- scrivi campi “rumorosi” (timestamp, contatori non necessari) che cambiano sempre.

Rimedio:

- aggiorna lo status **solo se è cambiato davvero** (confronto strutturale o campi specifici);
- evita di usare lo status come “log”; usa event/metriche.

Questo riduce carico sul controller, su apiserver e soprattutto evita che la tua logica diventi una macchina da reconcile continua.

## Best practice 4: più controller sì, ma con confini chiari (e parallelismo controllato)

Avere più controller nello stesso progetto è spesso corretto (e ti dà parallelismo), ma devi chiarire:

- chi è **owner** di quali campi,
- quali risorse un controller può aggiornare,
- come gestire gli “handoff” (es. autoscaler aggiorna spec, nodepool controller esegue e aggiorna status).

Se due controller aggiornano frequentemente la stessa risorsa, l’effetto collaterale è inevitabile: più update → più resourceVersion → più conflict → più reconcile.

In questi casi è spesso meglio:

- far scrivere l’autoscaler su **una risorsa dedicata** (es. `ScaleRequest`) e lasciare che il controller NodePool sia l’unico a mutare `NodePool.spec`, oppure
- introdurre un campo “requested” separato e far sì che solo uno dei due controller lo trasformi in “desired state” effettivo.

## Best practice 5: usa `generation` per capire *cosa* è cambiato (non per evitare conflict)

`generation` è utilissima per distinguere:

- una reconcile dovuta a cambi spec (nuovo desiderio),
- da una reconcile dovuta a cambi di metadata/status.

Pattern comune:

- salvare in status un `observedGeneration`,
- quando `metadata.generation` > `status.observedGeneration`, sai che c’è un nuovo desiderio da processare.

Questo ti aiuta a non ripetere lavoro costoso quando in realtà è cambiato solo altro (es. una label).

## Sintesi: operator scalabili = update disciplinati

Quando inizi a far collaborare più controller, la qualità dell’operator dipende soprattutto da come gestisci gli aggiornamenti:

- `resourceVersion` cambia sempre: i conflict sono normali, vanno gestiti.
- separa spec e status e scrivi sullo status in modo minimale.
- evita update “rumorosi” che innescano reconcile senza valore.
- definisci confini chiari tra controller: chi scrive cosa, e perché.

Il salto di qualità non è “scrivere un reconciler che crea risorse”, ma costruire un sistema che resta stabile sotto carico e concorrenza. In Kubernetes, questo significa soprattutto: **scrivere meno, scrivere meglio, e fare retry solo quando ha senso**.
