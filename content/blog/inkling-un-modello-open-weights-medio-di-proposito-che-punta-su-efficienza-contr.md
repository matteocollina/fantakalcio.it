---
title: "Inkling: un modello open weights “medio” (di proposito) che punta su efficienza, controllo e specializzazione"
subtitle: "MoE da 970B parametri totali, Apache license, contesto enorme e un’idea chiave: non vincere in classifica, ma diventare il miglior modello per il tuo caso d’uso."
description: "Inkling è un nuovo modello open weights addestrato da zero con un’impostazione insolita: invece di inseguire la vetta dei benchmark, mette al centro l’efficienza operativa e la possibilità di trasformarlo rapidamente in uno specialista. Vediamo cosa significa davvero: MoE con 41B parametri attivi per token, “thinking effort” per modulare costo/qualità, input multimodale nativo (pixel e audio grezzi), training orientato all’affidabilità (epistemics) e una strategia prodotto che scommette sul fine-tuning gestito."
publishedAt: 2026-07-20
tags: ["modelli open-weights","mixture-of-experts","fine-tuning","benchmark LLM","efficienza inferenza","multimodale"]
---
Negli ultimi anni siamo diventati ossessionati dalle classifiche: chi è “il migliore” sui benchmark, chi ha più parametri, chi domina in coding o reasoning. Inkling va in un’altra direzione, più interessante per chi costruisce prodotti: accetta di non essere il numero uno assoluto e prova a diventare **una base solida, economica e controllabile** da trasformare in uno specialista.

Il risultato è un modello **open weights** addestrato da zero, pubblicato con **licenza Apache** (quindi davvero permissiva per uso e integrazione), e progettato con scelte tecniche che puntano a un obiettivo pragmatico: *ridurre il costo per risposta mantenendo buone prestazioni quando serve*.

## Architettura: 970B parametri, ma non “accesi” tutti insieme
Inkling è un **Mixture of Experts (MoE)**: in totale dichiara **970 miliardi** di parametri, ma a ogni token ne attiva solo una piccola parte.

- **Parametri totali:** 970B
- **Parametri attivi per token:** ~41B

Questa è la chiave MoE: invece di far lavorare sempre l’intero “cervello”, un router instrada ogni token verso un sottoinsieme di “esperti” specializzati. In pratica:

- ottieni **capacità complessiva** da modello molto grande,
- ma paghi **compute** più vicino a un modello più piccolo (almeno lato attivazioni).

Per chi serve modelli in produzione, questo trade-off è spesso più importante della prestazione pura su un singolo benchmark.

## Dati e contesto: addestramento multimodale e finestra enorme
Inkling è stato pre-addestrato su una quantità imponente di dati multimodali:

- **45 trilioni di token** tra testo, immagini e audio
- **contesto fino a 1 milione di token**

La finestra di contesto non è solo un numero da marketing: abilita flussi di lavoro in cui il modello può “vivere” dentro documentazioni, log lunghi, codebase estese o conversazioni operative senza dover continuamente riassumere.

## Input multimodale “diretto”: pixel e audio senza encoder separati
Una scelta tecnica distintiva riguarda la multimodalità. In molti sistemi, immagini e audio vengono prima passati attraverso **encoder dedicati** che trasformano tutto in token “linguistici”, poi il modello principale ragiona su quei token.

Inkling punta a saltare questo passaggio e a processare **pixel e audio grezzi** direttamente.

Per chi sviluppa interfacce e agenti multimodali, il vantaggio potenziale è una pipeline concettualmente più semplice (meno componenti esterni da orchestrare), anche se resta da capire quanto questa scelta impatti su:

- latenza reale,
- qualità su task specifici,
- costi di serving.

## Prestazioni: non domina i benchmark (ed è parte del messaggio)
Se guardiamo le prestazioni “da classifica”, Inkling si colloca **a metà gruppo** rispetto ai modelli più forti del momento (sia proprietari sia open). E il punto, qui, è che non sta cercando di vincere a tutti i costi.

Questa posizione “media” diventa credibile quando la strategia non è: *fare il modello più intelligente del mondo*, ma *fare il modello più utile e sostenibile da mettere in produzione e specializzare*.

## Il vero interruttore: “thinking effort” come manopola costo/qualità
Il concetto più orientato al prodotto è una manopola chiamata **thinking effort**: invece di avere un comportamento fisso, puoi modulare quanto il modello “spende” in ragionamento.

- **thinking effort basso:** risposte più rapide ed economiche
- **thinking effort alto:** ragionamento più profondo, migliore su task difficili

Per sistemi ad agenti eseguiti **milioni di volte al giorno**, questa è una leva enorme: non vuoi sempre il massimo livello di ragionamento; vuoi **allocarlo dove serve**.

Dal punto di vista di chi costruisce UI/UX e flussi, questo si traduce in un pattern molto pratico:

- effort basso per autocompletamenti, suggerimenti UI, classificazioni veloci
- effort alto per azioni critiche: refactor, pianificazione multi-step, debugging complesso

## Fine-tuning come prodotto: da “mid” a specialista
La scommessa implicita è chiara: offrire un modello base “abbastanza buono” e poi monetizzare il percorso che lo trasforma in **specialista**.

In altre parole, il valore non è nel modello generico che “sa un po’ di tutto”, ma nel modello che **distrugge il tuo problema specifico**:

- dominio verticale (finanza, legale, supporto tecnico)
- toolchain aziendale
- stile e policy interne
- conoscenza operativa (procedure, runbook, incident response)

Per il frontend questo conta più di quanto sembri: i prodotti moderni stanno integrando LLM non come chatbot, ma come **motore di funzionalità** (search semantica, assistenza contestuale, generazione di contenuti, agenti che operano su CMS/backoffice). Uno specialista ben addestrato riduce errori, allucinazioni e costi.

## Epistemics: addestrare l’onestà operativa (sapere quando non sai)
Un altro tassello importante è l’attenzione a quella che viene chiamata **epistemics**: premiare il modello quando **ammette incertezza** invece di inventare risposte con sicurezza.

Questa caratteristica è spesso sottovalutata, ma è fondamentale nei prodotti:

- un modello che “ci prova” sempre può danneggiare utenti e fiducia
- un modello che sa dire “non ho abbastanza informazioni” abilita UX migliori

Esempi pratici lato interfaccia:

- mostrare stati di confidenza e richieste di chiarimento
- fallback automatici (es. ricerca documentale) quando l’incertezza è alta
- gating delle azioni pericolose (pagamenti, modifiche irreversibili) con conferme

## Un effetto collaterale curioso: ottimizzare troppo i token
Una nota interessante riguarda il comportamento dopo moltissimi round di reinforcement learning: il modello tende a **tagliare parole** e a comprimere l’“inner monologue” per risparmiare token, degenerando verso uno stile telegrafico.

È un promemoria utile: quando ottimizzi aggressivamente per costo/efficienza, puoi introdurre drift stilistici o comportamenti inattesi. Chi porta LLM in produzione dovrebbe prevedere:

- controlli di qualità sul linguaggio generato,
- regressioni su tone of voice,
- guardrail e post-processing dove serve.

## Implicazione pratica: smettere di scegliere “il migliore” e scegliere “il più gestibile”
Inkling mette sul tavolo una tesi che vale anche al di fuori del singolo modello: nella maggior parte dei prodotti non vince il modello con il punteggio più alto, ma quello che ti permette di controllare tre variabili chiave:

1. **Costo per task** (e non per singola risposta)
2. **Affidabilità** (ammettere incertezza, ridurre allucinazioni, policy)
3. **Specializzazione** (fine-tuning mirato, tool-use, dati proprietari)

### Sintesi
- MoE: enorme sulla carta, efficiente nell’uso reale per token.
- Multimodale “diretto”: pixel e audio senza pipeline tradizionali a encoder separati.
- Manopola di ragionamento: *thinking effort* come controllo economico/qualitativo.
- Focus sull’affidabilità: epistemics e comportamento più prudente.
- Strategia: modello base open e specializzazione come vantaggio competitivo.

### Conclusione
La lezione non è che serva un altro modello “gigante”. La lezione è che, per costruire software reale, spesso conviene partire da una base aperta e sufficientemente capace, e investire su controlli, efficienza e fine-tuning. È lì che un LLM smette di essere una demo e diventa una feature di prodotto.
