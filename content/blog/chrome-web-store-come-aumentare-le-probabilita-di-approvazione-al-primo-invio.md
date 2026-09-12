---
title: "Chrome Web Store: come aumentare le probabilità di approvazione al primo invio"
subtitle: "Pulizia del pacchetto, niente codice “morto” e zero file superflui: i controlli partono da qui."
description: "Per evitare rifiuti in fase di review sul Chrome Web Store, cura due aspetti spesso sottovalutati: rimuovere codice che non verrà mai eseguito ma contiene pattern vietati (es. eval) e tagliare tutto ciò che non serve davvero nel pacchetto (es. node_modules). Una submission più piccola e pulita passa più facilmente e velocemente."
publishedAt: 2026-07-22
tags: ["chrome web store","estensioni chrome","policy sicurezza","bundle produzione","pulizia repository"]
---
Pubblicare un’estensione sul Chrome Web Store non è solo una questione di funzionalità: la fase di review guarda con attenzione anche *com’è fatto* il pacchetto che invii. Due cause di rifiuto (o di review più lunga e approfondita) ricorrono spesso e sono sorprendentemente evitabili: **codice morto con costrutti vietati** e **file inutili inclusi nel pacchetto**.

## 1) Il codice morto può far fallire la review
Una trappola comune è lasciare nel progetto porzioni di codice che **non vengono mai eseguite** (feature rimosse, fallback mai raggiunti, vecchi esperimenti), ma che contengono pattern non ammessi o sospetti.

Esempio tipico: un ramo di codice irraggiungibile che contiene una chiamata a `eval`. Anche se “tanto non gira”, **la presenza stessa di `eval` nel sorgente** può violare le policy o attivare controlli automatici e portare al rifiuto.

### Cosa fare in pratica
- **Rimuovi davvero** il codice che non serve più, non limitarti a commentarlo.
- Evita di spedire funzioni di debug, prototipi e fallback legacy.
- Se usi un bundler/minifier, verifica l’output finale: la tree-shaking aiuta, ma non è una garanzia assoluta se hai configurazioni conservative o side effects non dichiarati.

L’obiettivo è semplice: nel pacchetto deve esserci solo ciò che è necessario e conforme, senza “scheletri nell’armadio” che possano essere interpretati come comportamento rischioso.

## 2) Elimina i file superflui (soprattutto `node_modules`)
L’altra causa frequente è l’inclusione di intere directory non destinate alla runtime dell’estensione. Il caso più eclatante: **spedire `node_modules`** anche quando l’estensione usa un bundler e in produzione gira esclusivamente su file generati (ad esempio nella cartella `dist/`).

Questo crea tre problemi concreti:
- **Aumenti inutilmente la dimensione** del pacchetto.
- **Aumenti la superficie di controllo**: più file = più probabilità che qualcosa faccia scattare verifiche.
- **Allunghi la review**: un upload “gonfio” tende a richiedere più ispezioni.

### Cosa includere (regola pratica)
- File effettivamente caricati dall’estensione: script, service worker, pagine HTML, CSS, immagini, font.
- `manifest.json` e assets necessari.
- Output di build *pulito* (es. `dist/`), non l’intero progetto di sviluppo.

### Cosa escludere (quasi sempre)
- `node_modules/`
- file di test, fixture, storybook, demo non usate
- sorgenti non necessari se distribuisci solo output compilato (dipende dalla tua strategia, ma evita duplicazioni inutili)
- config e tooling non richiesti a runtime

## Una checklist rapida prima dell’upload
- **Search “pattern rischiosi”** nel progetto (es. `eval`) e rimuovi anche le occorrenze in codice non usato.
- **Controlla il pacchetto finale**: cosa finisce davvero nello zip che carichi.
- **Riduci all’essenziale**: se un file non serve a far funzionare l’estensione, non deve esserci.

## Sintesi
Per aumentare le probabilità di approvazione al primo invio, tratta la submission come un artefatto di produzione: **niente codice morto**, soprattutto se contiene costrutti vietati o sospetti, e **niente file superflui**, con attenzione particolare a `node_modules`. Un pacchetto minimale e coerente non è solo più professionale: è anche più semplice da revisionare e meno incline a rifiuti evitabili.
