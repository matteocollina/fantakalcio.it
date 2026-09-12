---
title: "NPM e l’illusione della fiducia: cosa ci insegna l’ultimo worm nella supply chain"
subtitle: "Quando la compromissione non passa dagli account dei maintainer, ma dai workflow di release e dai token “validi”"
description: "Un recente worm ha colpito pacchetti molto usati nel mondo JavaScript e ha iniziato a propagarsi anche altrove. Il punto non è solo “npm è insicuro”: è l’intersezione tra script d’installazione eseguibili, pipeline CI/CD troppo permissive e un modello di fiducia che non regge agli attacchi moderni. Vediamo cosa è successo a livello concettuale e quali contromisure concrete adottare subito nei progetti frontend."
publishedAt: 2026-05-14
tags: ["supply-chain","npm-scripts","github-actions","oidc-token","SLSA-provenance","ci-cd-hardening"]
---
Negli ultimi anni ci siamo abituati a leggere di dipendenze compromesse, typosquatting, takeover di pacchetti. Ma l’ondata più preoccupante è quella in cui l’attacco non si limita a “pubblicare una versione malevola”: **si inserisce nella catena di rilascio** e sfrutta i nostri stessi meccanismi di fiducia.

L’idea chiave è semplice e inquietante: se un aggressore riesce a far eseguire codice nella tua pipeline, può arrivare a pubblicare artefatti **con credenziali e attestazioni apparentemente legittime**. E se quel codice poi, installandosi, ruba altre credenziali e si propaga da solo, entriamo nel territorio dei worm da supply chain.

In questo articolo metto ordine nei concetti tecnici che contano davvero per chi sviluppa frontend e gestisce build e release.

---

## 1) Perché un worm in ecosistemi come npm è devastante

Il problema non è solo “ci sono tanti pacchetti”, ma **come** i pacchetti vengono installati e quali capacità hanno in fase di installazione.

### Gli script di installazione sono esecuzione di codice (a tutti gli effetti)

Nel mondo Node.js, un pacchetto può definire script come `postinstall`, `preinstall`, `prepare`, ecc. In pratica:

- quando fai `npm install`, **stai autorizzando l’esecuzione di JavaScript** sul tuo computer o sul runner CI;
- quel JavaScript può:
  - invocare comandi di shell,
  - leggere/scrivere file,
  - aprire connessioni di rete,
  - avviare processi secondari,
  - cercare variabili d’ambiente e token.

Questa è una feature utile (build di binari, setup, download di asset), ma è anche una **superficie d’attacco enorme**: basta compromettere un pacchetto molto diffuso, e l’installazione diventa il veicolo perfetto.

### Il bersaglio vero sono le credenziali della CI

Se l’installazione malevola avviene su un developer laptop è grave; se avviene in CI è spesso peggio:

- in CI sono presenti token (GitHub, npm, cloud provider, registry privati);
- i runner hanno accesso a repository e permessi di pubblicazione;
- l’ambiente è “automatizzato”, quindi l’attacco può essere ripetibile, silenzioso e veloce.

---

## 2) Il salto di qualità: pubblicare pacchetti malevoli con pipeline “ufficiali”

Una delle evoluzioni più significative è quando l’attaccante non ruba (necessariamente) l’account del maintainer. Invece:

- entra nel **workflow di release**;
- ottiene token temporanei tramite meccanismi di identità (OIDC);
- usa quei token per far risultare la pubblicazione come proveniente dalla pipeline corretta.

### OIDC e attestazioni: non bastano se il workflow è bucabile

OIDC in GitHub Actions è spesso usato per evitare secret statici e ottenere credenziali temporanee. Le attestazioni di provenienza (es. SLSA) mirano a dire: “questo artefatto è stato costruito da questo workflow, in questo modo”.

Il punto però è che **la provenienza è vera rispetto al workflow**, non rispetto alla tua intenzione. Se l’attaccante riesce a far eseguire passaggi malevoli *dentro* il workflow, può produrre:

- pacchetti compromessi;
- firmati/attestati come se fossero “ufficiali”.

È un cambio di paradigma: la verifica non fallisce perché è falsificata, ma perché **stai attestando un processo che è stato manipolato**.

---

## 3) L’anello debole tipico: workflow GitHub Actions troppo permissivi

Nelle compromissioni moderne ricorrono due ingredienti:

1. **workflow design fragile** (permessi eccessivi, trust implicito);
2. **cache poisoning / esfiltrazione** (cache riutilizzate in modo pericoloso, step che espongono token).

### Il caso classico: `pull_request_target` usato senza blindatura

Molti team usano `pull_request_target` per comodità, perché consente di eseguire workflow con contesto del branch base (spesso `main`). Ma è una lama a doppio taglio:

- può avere permessi più alti;
- può accedere a secret del repository;
- può essere sfruttato da PR provenienti da fork se non si adottano guardrail rigorosi.

In generale, se non sai esattamente perché ti serve `pull_request_target`, quasi certamente **non ti serve**.

---

## 4) Perché questi attacchi si propagano: il modello “worm”

Un worm da supply chain fa una cosa in più rispetto al malware “tradizionale”: **si replica**.

Schema tipico:

1. viene installato (magari tramite uno script di installazione);
2. ruba credenziali utili (token GitHub, npm, variabili CI);
3. usa quelle credenziali per:
   - pubblicare nuove versioni compromesse,
   - contaminare altri pacchetti,
   - entrare in altri repository/pipeline;
4. ripete il ciclo.

Il risultato è una diffusione a rete: non è più “un pacchetto colpito”, ma una catena di maintainers e pipeline che diventano vettori.

---

## 5) Contromisure pratiche (da applicare nei progetti frontend)

Non esiste un singolo interruttore “sicurezza ON”, ma ci sono scelte che riducono drasticamente il rischio.

### A) Disabilita gli script di installazione quando puoi

- In CI, valuta `npm ci --ignore-scripts` (o equivalente) **per i job dove non servono**.
- Se ti servono (es. build di moduli nativi), isolali in step dedicati, con permessi minimi e senza token esposti.

Trade-off: alcune dipendenze si aspettano davvero quegli script. Ma proprio per questo è utile rendere esplicito *dove* e *perché* li abiliti.

### B) Blocca le dipendenze e riduci la variabilità

- Usa lockfile e aggiornamenti controllati.
- Evita upgrade automatici “a sorpresa” su range troppo larghi.
- In CI, preferisci `npm ci` a `npm install`.

### C) Hardening GitHub Actions

- Preferisci `pull_request` a `pull_request_target`.
- Se devi usare `pull_request_target`, applica regole rigide:
  - non eseguire codice della PR senza validazione,
  - non fare checkout del branch della PR con permessi elevati,
  - separa i job che richiedono secret.
- Minimizza `permissions:` del workflow (principio del least privilege).
- Non esporre token a step non indispensabili (né via env, né via log).

### D) Riduci i “segreti utili” disponibili durante l’install

- Non rendere disponibili token di publish npm nei job che fanno solo test/build.
- Separa pipeline di test e pipeline di release.
- Usa ambienti protetti e approvazioni manuali per i job di pubblicazione.

### E) Osservabilità: devi accorgertene in fretta

- Alert su pubblicazioni anomale (nuove versioni non pianificate, orari insoliti).
- Scansione delle dipendenze con strumenti che rilevino comportamenti sospetti (es. richieste di rete in postinstall, esecuzioni di child process, drop di file).

---

## 6) La lezione scomoda: non è solo “npm è brutto”

È facile trasformare tutto in una sentenza su npm o sulla cultura delle dipendenze. Ma la realtà è più precisa:

- **l’esecuzione automatica di codice in install** è un acceleratore d’attacco;
- **la CI/CD è diventata l’obiettivo principale** perché contiene le chiavi del regno;
- **gli standard di provenienza aiutano**, ma non salvano un workflow progettato con assunzioni di fiducia sbagliate.

Se lavori nel frontend moderno, non puoi eliminare del tutto il rischio, ma puoi rendere la compromissione molto più costosa e meno probabile: meno permessi, meno segreti esposti, meno script eseguiti “per default”, più separazione tra test e release.

In un ecosistema dove installare una dipendenza equivale spesso a eseguire codice, la sicurezza non è una checklist: è una proprietà del processo.
