---
title: "Una singola PR può compromettere la tua supply chain: anatomia di un attacco al registry npm (e come ridurre i rischi)"
subtitle: "Quando CI, cache e permessi “comodi” si combinano: come un workflow mal configurato può trasformarsi in una catena di infezioni tra pacchetti."
description: "Un recente attacco alla supply chain JavaScript ha mostrato quanto sia sottile il confine tra automazione sicura e compromissione su larga scala. In poche ore, un meccanismo pensato per rafforzare la pubblicazione dei pacchetti è stato aggirato sfruttando trigger di GitHub Actions, cache condivise e propagazione “worm-like” via token npm. Vediamo cosa è successo a livello tecnico e quali contromisure concrete possono adottare maintainer e team frontend."
publishedAt: 2026-05-14
tags: ["supply-chain-npm","github-actions-sicurezza","pnpm-hardening","trusted-publishing","token-npm"]
---
## Il problema non è “npm”: è l’automazione quando diventa un punto d’appoggio
Negli ultimi anni abbiamo spinto (giustamente) verso pipeline sempre più automatiche: merge → build → publish. Il punto è che **la CI non è solo un esecutore**, è un *ambiente privilegiato* che spesso ha accesso a:

- credenziali temporanee (token di publish, OIDC assertions, secret di deploy)
- cache riutilizzate tra job
- permessi su repository e organization

Quando queste tre cose si allineano male, l’attaccante non ha bisogno di rubare password o fare phishing: gli basta **far fare alla tua pipeline ciò che già sa fare**.

## Come funziona (in teoria) una pubblicazione “trusted”
Molti progetti oggi pubblicano su npm tramite un flusso che evita token statici nel repository:

1. un workflow parte (ad esempio dopo merge su `main`)
2. GitHub attesta “chi” sta eseguendo il workflow (repo, branch, workflow) con una dichiarazione firmata
3. npm verifica l’attestazione contro una allow-list
4. se tutto combacia, npm rilascia un **token di publish a vita breve**

È un modello forte: anche se qualcuno ti ruba un token “dopo”, scade presto. E soprattutto riduce la superficie tipica (segreti long-lived).

## Dove si è aperta la falla: trigger e contesto dei permessi
Il punto critico non è stato il publish in sé, ma **il modo in cui si avviava il workflow**.

### `pull_request_target`: potente, ma pericoloso
Quando un workflow usa il trigger `pull_request_target`, GitHub Actions lo esegue:

- nel **contesto del repository “target”** (quello principale)
- con **permessi e token del repo principale**
- anche se la PR arriva da un **fork**

Questa configurazione ha casi d’uso legittimi (ad esempio gestire label, commenti o automazioni che richiedono permessi elevati), ma è una delle opzioni più facili da trasformare in un escalation path se:

- si esegue codice controllabile dall’esterno
- o si tocca uno spazio condiviso (come cache/artefatti)

## L’attacco: avvelenare la cache oggi, pubblicare domani
La dinamica che rende questo tipo di attacco così insidioso è la separazione temporale:

1. l’attaccante crea una PR da un fork
2. la PR fa partire il workflow (anche se poi viene chiusa rapidamente)
3. il workflow, girando con privilegi “alti”, consente di **scrivere un file malevolo nella cache condivisa della CI**
4. ore dopo, un’azione del tutto normale (merge su `main`) avvia il workflow di release
5. il job di release riusa la cache… e **innesca il payload**

Da lì il malware può:

- leggere token temporanei presenti durante la publish
- pubblicare versioni compromesse di molti pacchetti in rapida sequenza

Il risultato pratico: **pacchetti “ufficiali” e firmati** escono dal canale normale di pubblicazione, con tutte le apparenze di una release legittima.

## Perché l’impatto si propaga: la supply chain come moltiplicatore
La parte più distruttiva di un incidente del genere non è solo la compromissione iniziale, ma la capacità di trasformarsi in un “worm”:

- chi installa il pacchetto compromesso esegue codice malevolo (spesso tramite script di install)
- quel codice cerca **segreti locali** (token npm, credenziali CI, token GitHub)
- se trova token di publish, può **rilasciare nuove versioni compromesse** anche su progetti terzi

In altre parole: un singolo progetto “grosso” diventa un vettore che contagia maintainers e organizzazioni collegate, che a loro volta diventano amplificatori.

## Il dettaglio più sottovalutato: persistenza nell’ambiente di sviluppo
Un attacco moderno non si accontenta di colpire una build. Punta alla persistenza:

- esecuzione al momento dell’installazione delle dipendenze
- reinfezione quando riapri l’editor o l’ambiente di lavoro
- processi in background che verificano la validità dei token rubati

Questo cambia completamente la risposta all’incidente: non basta “rimuovere la dipendenza” o fare rollback. Potresti dover trattare la macchina come compromessa.

## Cosa puoi fare *oggi* (anche se non sei un maintainer famoso)
Non esiste la protezione perfetta, ma puoi alzare parecchio l’asticella con contromisure pratiche.

### 1) Blocca l’adozione immediata di release freschissime
Una misura sorprendentemente efficace è introdurre un *ritardo* tra pubblicazione e install.

- molte campagne malevole vengono individuate e rimosse rapidamente
- un “min release age” di 24h elimina una grossa fetta di rischio opportunistico

Se usi pnpm, questa strategia è particolarmente accessibile perché può essere integrata nel flusso standard di installazione.

### 2) Rifiuta dipendenze “esotiche” fuori registry
Le dipendenze transitive dovrebbero arrivare da un registry (npm, registry aziendale, ecc.).

Permettere sub-deps che puntano a:

- tarball su URL arbitrari
- repository git esterni

è un canale elegante per far passare payload senza i controlli tipici del registry.

Bloccare queste dipendenze riduce una classe intera di tecniche di smuggling.

### 3) Disinnesca gli script di installazione per default
Gran parte del malware nell’ecosistema npm passa da:

- `postinstall`
- `preinstall`
- `install`

L’idea migliore è semplice: **non eseguire script automaticamente**, a meno che tu non abbia esplicitamente approvato i pacchetti che li richiedono.

Questo non elimina ogni rischio (un payload può vivere anche altrove), ma taglia una via di esecuzione molto comune.

## Checklist per maintainer: hardening di GitHub Actions in 30 minuti
Se mantieni librerie (anche piccole), questi punti valgono oro:

1. **Evita `pull_request_target`** a meno che tu non sappia esattamente perché ti serve.
2. Se lo usi, **non eseguire codice della PR** e non usare checkout che portano dentro contenuti controllabili dall’esterno.
3. Riduci i permessi del `GITHUB_TOKEN` con `permissions:` (principio del minimo privilegio).
4. Proteggi cache e artefatti:
   - separa le cache per trust boundary
   - usa chiavi di cache che non permettano collisioni/poisoning
   - evita di ripristinare cache in job che gestiscono credenziali di publish
5. Metti guardrail sulla release:
   - branch protection
   - required reviews
   - ambienti protetti per job di publish
   - approvazione manuale per step sensibili se il progetto è critico

## Una conclusione scomoda: la “security by default” va costruita attorno alla CI
Questo tipo di incidente non nasce da una singola svista, ma da un pattern:

- workflow troppo permissivi
- confini di fiducia poco chiari (fork vs repo principale)
- cache riutilizzate senza isolamento
- esecuzione automatica di script in fase di install

La buona notizia è che molte mitigazioni sono *noiose* ma efficaci: rallentare l’adozione delle release, bloccare sub-deps fuori registry, approvare gli script, isolare le cache e ridurre privilegi.

Se lavori nel frontend, la supply chain è parte del runtime: trattala con la stessa cura con cui tratti autenticazione, CORS e gestione delle chiavi.
