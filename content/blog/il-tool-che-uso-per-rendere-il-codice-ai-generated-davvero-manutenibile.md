---
title: "Il tool che uso per rendere il codice “AI-generated” davvero manutenibile"
subtitle: "Duplicazioni, dead code e file ingestibili: una CLI gratuita (stile ESLint) che ti dà metriche, refactoring targets e integrazione in editor/CI."
description: "Quando l’AI scrive codice, spesso lo fa funzionare… ma non sempre lo fa “bene” per chi dovrà mantenerlo. In questo articolo vediamo come individuare e ridurre duplicazioni, dead code, export inutilizzati e complessità eccessiva usando un tool gratuito da riga di comando con output leggibile anche dalle automazioni (JSON), estensione VS Code e integrazione CI."
publishedAt: 2026-06-02
tags: ["duplicazione-codice","dead-code","complessita-ciclomatica","refactoring-targets","integrazione-ci"]
---
## Il problema reale dell’AI: codice che funziona, ma che invecchia malissimo

Se usi spesso strumenti di generazione/assistenza al codice, avrai notato un pattern ricorrente: l’AI tende a ottimizzare per “far andare la feature adesso”, non per la manutenibilità tra tre mesi.

I sintomi tipici sono quasi sempre questi:

- **Duplicazione aggressiva**: blocchi identici copiati in più punti (a volte nello stesso file), perché è il modo più veloce per arrivare al risultato.
- **File enormi**: moduli da centinaia di righe dove convivono logica, utility e varianti, spesso con funzioni lunghissime.
- **Dead code**: pezzi di implementazione lasciati lì dopo un refactor o un cambio di direzione (file non più raggiungibili, funzioni mai chiamate, export inutilizzati).
- **Complessità crescente**: funzioni che accumulano `if`, `switch`, nested loop e casi speciali finché leggere e testare diventa costoso.

Il punto non è “l’AI scrive codice brutto”: è che **questi problemi sono difficili da individuare a occhio**, e diventano rapidamente debito tecnico. Servono guardrail automatici.

## Una CLI gratuita “stile ESLint” (ma orientata a maintainability)

Esiste un tool da riga di comando completamente gratuito che si usa in modo simile a ESLint, ma è focalizzato su ciò che tipicamente peggiora nei progetti (soprattutto quando c’è molta generazione automatica):

- **dead code** (file irraggiungibili, export non usati, dipendenze inutilizzate)
- **duplicazioni** (blocchi uguali e “famiglie” di cloni)
- **complessità** (dimensione funzioni, complessità ciclomatica, carico cognitivo)
- **health score** per file
- **hotspot** basati su cronologia Git
- **refactoring targets** (priorità d’intervento: “massimo ritorno al minimo sforzo”)

In più ha due caratteristiche cruciali per workflow moderni:

1. **Output JSON**: perfetto per automazioni e agenti.
2. **Integrazione editor e CI**: feedback continuo, non solo a fine sprint.

## Avvio rapido nel progetto

L’approccio migliore è partire “wide” per vedere lo stato generale, poi restringere l’analisi.

Esegui il tool via `npx` direttamente nella repo:

```bash
npx <tool>
```

Al primo run, la cosa interessante è che può **auto-rilevare plugin/integrazioni comuni** (framework, build tool, stack diffusi) e proporti una configurazione iniziale sensata.

## Cosa guardare per primo: Dead code

La sezione *dead code* è quella che spesso dà risultati immediati:

- **File non raggiungibili da nessun entry point**: tipico residuo di feature rimosse.
- **Unused exports**: funzioni/variabili esportate “per sicurezza” ma mai importate.
- **Tipi esportati e non usati** (in TypeScript): rumore che rende l’API del modulo meno chiara.
- **Dipendenze inutilizzate**: utile anche per distinguere dipendenze che dovrebbero stare in `devDependencies`.

Questo tipo di cleanup ha un vantaggio enorme: **riduce superficie del codice** senza cambiare comportamento.

### Autofix quando possibile

Per alcune categorie (quelle più meccaniche) è disponibile un comando di fix automatico:

```bash
npx <tool> fix
```

Non aspettarti “refactor magici”, ma è ottimo per togliere attrito su problemi banali e ripetitivi.

## La sezione più impattante: Duplicazione

Se c’è una cosa che l’AI introduce con facilità, è la duplicazione. Non solo “due righe uguali”: spesso sono **decine o centinaia di righe replicate**, magari con variazioni minime.

Il report tipicamente ti indica:

- i **file coinvolti**
- le **linee esatte** duplicate
- cluster tipo **clone families** (stessa logica copiata in più varianti)

È qui che si guadagna davvero in maintainability:

- estrai una funzione
- introduci un helper condiviso
- crea un componente
- normalizza una pipeline

Ridurre duplicazione significa anche **ridurre bug futuri**: un fix fatto in un posto non deve essere ricordato in altri tre.

## Complessità: capire dove il codice è “troppo”

La complessità non è morale, è costo.

Il tool evidenzia almeno tre dimensioni utili:

1. **Funzioni troppo lunghe**: quando inizi a vedere funzioni da centinaia (o migliaia) di righe, non è un “edge case”. È un segnale.
2. **Complessità ciclomatica**: quante diramazioni ha la funzione (ogni `if`, ternario, `switch` aumenta il conteggio). Tante branch = test più difficili, regressioni più probabili.
3. **Carico cognitivo**: quanto è difficile leggere/seguire il flusso (nested `if`, loop annidati, early return sparsi, ecc.).

C’è anche uno score che combina complessità e copertura test (utile per capire se le parti rischiose sono *almeno* protette da test).

## File health score e hotspot: priorità guidate dai dati

Due sezioni sono perfette per decidere **dove investire tempo**:

- **File health score**: una valutazione che tiene conto di complessità, dead code e “peso” del file nella rete di import/export.
- **Hotspot**: incrocia i dati con la **storia Git** per capire quali file cambiano più spesso. Un file complesso che cambia continuamente è la combinazione peggiore.

Se devi convincere un team (o te stesso) a fare refactor, questi numeri aiutano a motivare la scelta.

## Refactoring targets: massimo ROI

Invece di un report infinito, questa sezione prova a rispondere alla domanda pratica:

> “Se ho un’ora oggi, dove ottengo il miglior miglioramento?”

Ti propone target ordinati, tipicamente basati su rimozione dead code e riduzione della complessità nei punti più critici.

## Esecuzione mirata: solo ciò che ti serve

Dopo il primo run globale, ha senso concentrarsi su una singola categoria per volta.

Esempi tipici:

```bash
npx <tool> dead-code
npx <tool> health
```

Questo è comodo anche per introdurre regole gradualmente: prima pulisci dead code, poi affronti duplicazione, poi complessità.

## Dentro l’editor: estensione VS Code

La CLI è perfetta per avere una fotografia del progetto, ma durante lo sviluppo serve feedback immediato.

Con l’estensione per VS Code ottieni:

- pannello laterale con le stesse sezioni del report
- evidenziazione direttamente nel codice (duplicazioni, finding, ecc.)
- navigazione rapida tra i problemi

È la differenza tra “lo scoprirò a fine settimana” e “lo sistemo mentre ci sono dentro”.

## Output JSON e automazioni: la chiave per workflow con agenti

Per far lavorare bene automazioni e agenti, l’output deve essere strutturato.

È disponibile un formato JSON:

```bash
npx <tool> --json
```

Questo abilita pattern utilissimi, per esempio:

- fai implementare una feature
- poi fai rieseguire il tool
- e chiedi di correggere duplicazioni/dead code/complessità introdotte

Non è solo “linting”: è un ciclo di miglioramento guidato da segnali oggettivi.

## In CI: bloccare regressioni prima che entrino in main

L’ultimo miglio è la CI. L’idea è semplice:

- ogni push / pull request esegue l’analisi
- il report può essere pubblicato come commento (Markdown) o come check
- se superi certe soglie, la pipeline fallisce

In pratica: **anche se qualcuno (umano o AI) introduce duplicazione e dead code**, non arriva indisturbata in produzione.

## Come lo userei davvero, nel day-by-day

Se dovessi sintetizzare un flusso “realistico”:

1. **Run globale** all’inizio (baseline).
2. **Pulizia dead code** (alto impatto, basso rischio).
3. **Riduzione duplicazioni** nelle aree che cambiano spesso.
4. **Taglio complessità** sui veri hotspot.
5. **CI attiva** con regole progressive (non serve partire severissimi).

L’AI è veloce. Questo tipo di tool è quello che ti permette di mantenere la velocità senza pagare interessi di debito tecnico ogni settimana.
