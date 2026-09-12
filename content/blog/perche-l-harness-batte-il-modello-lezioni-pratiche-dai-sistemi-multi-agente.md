---
title: "Perché l’“harness” batte il modello: lezioni pratiche dai sistemi multi‑agente"
subtitle: "Architettura, ruoli e disciplina del contesto: come spendere meno token e ottenere risultati più affidabili"
description: "Quando si costruiscono sistemi AI per scrivere codice, il modello conta. Ma conta di più il modo in cui lo incastri in un harness: ruoli separati, contesto controllato, workflow di merge e test. Un esperimento di ricostruzione di SQLite in Rust mostra che con lo stesso obiettivo puoi passare da decine di migliaia di dollari a poche centinaia, semplicemente cambiando orchestrazione e combinazione planner/worker."
publishedAt: 2026-07-22
tags: ["agenti-swarm","orchestrazione-llm","planner-worker","merge-conflicts","specifiche-tecniche","economia-token"]
---
Negli ultimi mesi è diventato evidente un punto che molti team frontend (e non solo) stanno imparando sulla propria pelle: **il modello “più forte” non ti salva da un’architettura debole**. Puoi avere un LLM di fascia altissima, ma se lo inserisci in un flusso di lavoro confuso—contesto che cresce senza controllo, ruoli mischiati, merge continui e test gestiti male—bruci token, tempo e qualità.

Il contrario è ancora più interessante: **un harness ben progettato riesce a spremere risultati sorprendenti anche da modelli più economici**, soprattutto quando li fai lavorare con ruoli chiari.

## Harness: cos’è davvero (e perché è più importante del modello)
Con “harness” non si intende un prompt più lungo o due regole in più. Un harness è l’insieme di:

- **orchestrazione dei ruoli** (chi pianifica, chi esegue, chi valida);
- **struttura del contesto** (cosa vede ogni agente e quanto spesso viene aggiornato);
- **workflow di integrazione** (branching, merge, gestione conflitti);
- **ciclo di test** (feedback rapido e automatico, gating delle modifiche);
- **strategie anti-deriva** (limitare il “vagare” dell’agente fuori obiettivo).

In pratica: è la differenza tra “un modello che scrive codice” e **un sistema ingegnerizzato che produce software**.

## Il problema dei single-agent: drift e saturazione del contesto
Un agente singolo che deve portare avanti un progetto grande tende a fallire per motivi molto concreti:

- **Deve tenere in mente sia la visione d’insieme sia i dettagli locali**.
- Anche con finestre di contesto enormi, **il costo cognitivo di “portarsi dietro tutto”** cresce.
- Col tempo, l’agente può:
  - perdere il quadro generale e ottimizzare la cosa sbagliata;
  - restare troppo alto di livello e produrre implementazioni deboli;
  - introdurre incoerenze, regressioni e bug difficili da tracciare.

Questa è la radice della “deriva”: non è (solo) un limite del modello, è un limite del *processo*.

## Swarm con albero: separare contesto e responsabilità
Un approccio multi‑agente efficace usa una metafora molto semplice: **albero e foglie**.

- In alto c’è un **planner**: mantiene la visione d’insieme, scompone in passi, definisce criteri di accettazione.
- In basso ci sono i **worker**: prendono task piccoli e li implementano.

La regola che cambia tutto è disciplinare:

- **il planner non implementa** → non si “riempie” di dettagli low‑level e resta lucido sul design;
- **il worker non pianifica** → non si perde in architetture, si concentra su un compito ben definito.

Questa divisione riduce drasticamente la necessità che un singolo agente “cammini tutto l’albero” portandosi dietro ogni antenato, ogni decisione e ogni vincolo.

## Economia dei modelli: planner costoso, worker economico
Una delle conseguenze più pratiche di questo schema è che puoi usare:

- un **modello frontier** (più caro) per *pianificare*;
- uno o più **modelli più economici** per *eseguire*.

Il risultato è controintuitivo per chi è abituato a “scalare” comprando solo il modello migliore: **il costo totale può crollare** senza perdere qualità, perché l’esecuzione è la parte più token‑intensiva.

In un confronto tra combinazioni diverse, l’assetto “frontier come planner + economico come worker” è riuscito a ottenere **gli stessi esiti funzionali** con una spesa in token **ordine di grandezza più bassa** rispetto all’uso del frontier sia come planner sia come worker.

## Qualità operativa: meno conflitti, meno codice, più controllo
Un harness maturo non si vede solo dal punteggio finale, ma da metriche operative che chiunque faccia engineering riconosce:

### 1) Merge conflicts come sintomo di caos
Se il tuo swarm genera una valanga di conflitti, non è “un problema Git”: è un segnale che stai facendo lavorare gli agenti in modo troppo sovrapposto, senza confini chiari.

Un harness migliore tende a:

- ridurre la concorrenza su file/aree comuni;
- imporre un ordine di integrazione;
- far emergere prima le incompatibilità.

### 2) Linee di codice non = progresso
Un altro pattern: **meno codice prodotto** può significare un processo più pulito.

Se il sistema risolve lo stesso compito con molte meno linee, spesso vuol dire:

- meno duplicazioni;
- meno “re-implementazioni creative” inutili;
- migliore riuso e aderenza a librerie/primitive già disponibili;
- meno churn (scrivo, riscrivo, ristrutturo in loop).

Non è una regola assoluta—talvolta più codice è “più correttezza”—ma in scenari agentici un’enorme produzione di codice è spesso un campanello d’allarme.

## “La spec è il nuovo prompt”: il cambio di unità di lavoro
C’è un’idea che vale oro per chi lavora in team (e per chi costruisce prodotti): **l’unità di lavoro si sta spostando**.

- Autocomplete → unità: la singola riga.
- Modelli “classici” → unità: blocco o funzione.
- Agenti → unità: file/feature.
- Swarm → unità: **specifica**.

Con gli swarm, ciò che fai a monte diventa decisivo: **una spec ben scritta è un moltiplicatore di qualità**. Non serve che sia infinita; serve che sia verificabile:

- requisiti funzionali chiari;
- vincoli (API, performance, compatibilità);
- criteri di accettazione (test, casi limite);
- definizione di “done” non ambigua.

## Implicazioni pratiche per chi fa frontend (anche se l’esempio è “backendissimo”)
Ricostruire un database sembra lontano dal frontend, ma le lezioni sono identiche per:

- refactor di un design system;
- migrazione da Redux a Zustand / da Vue a React / da CSR a SSR;
- riscrittura di un’app con routing, auth, caching, i18n;
- automazione di test E2E e regressioni UI.

Se oggi stai sperimentando agenti per generare codice, la priorità non è inseguire sempre il modello più nuovo: è **costruire un harness che impedisca il caos**.

## Una checklist concreta per un harness che regge
Se vuoi rendere l’approccio ripetibile, questi punti sono una base solida:

1. **Separazione ruoli**: planner ≠ implementer ≠ reviewer.
2. **Task piccoli e verificabili** per i worker (scope stretto, file/area delimitata).
3. **Test come gate**: nessun merge senza test mirati che falliscono prima e passano dopo.
4. **Strategia di branch**: minimizza lavoro concorrente sugli stessi file.
5. **Memory controllata**: contesto aggiornato solo con artefatti utili (decisioni, API, contratti), non con log e rumore.
6. **Metriche operative**: conflitti, churn, LOC, tempo per green build, tasso di regressioni.

## Sintesi: spendi tempo sull’harness, non solo sul modello
Il messaggio finale è semplice e molto “ingegneristico”: **l’architettura del processo batte la potenza bruta**.

Un modello frontier può essere la scelta giusta—soprattutto per pianificare e prendere decisioni—ma la differenza tra un esperimento costoso e un sistema produttivo sta nella disciplina del tuo harness: ruoli separati, contesto controllato, integrazione ordinata e test che guidano ogni passo.

In un mondo dove la capacità di generare codice è ormai una commodity, il vantaggio competitivo si sposta su ciò che molti sottovalutano: **come organizzi il lavoro degli agenti** e come trasformi una spec in software verificabile, senza bruciare budget e senza perdere il controllo del progetto.
