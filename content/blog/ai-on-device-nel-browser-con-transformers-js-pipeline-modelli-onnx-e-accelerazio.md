---
title: "AI on-device nel browser con Transformers.js: pipeline, modelli ONNX e accelerazione con WebGPU"
subtitle: "Esecuzione locale di NLP, audio e visione: meno latenza, più privacy, integrazione frontend più semplice"
description: "Eseguire modelli di machine learning direttamente nel browser non è più una demo “carina”: per molte feature è la scelta migliore. Vediamo come funziona l’approccio di Transformers.js (Hugging Face): pipeline ad alto livello, modelli in formato ONNX e runtime intercambiabili (CPU/WebGPU), con esempi di use case reali come trascrizione audio e rimozione sfondo."
publishedAt: 2026-09-07
tags: ["transformers.js","webgpu","onnx-runtime-web","pipeline-ml","ai-on-device","hugging-face"]
---
Negli ultimi anni abbiamo visto crescere l’idea che “AI = chatbot”. In realtà, per un frontend developer, l’AI più utile spesso è quella invisibile: feature rapide, locali e integrate nell’esperienza utente. E oggi molte di queste possono girare **direttamente nel browser**, senza server.

Pensiamo a casi concreti:
- **Rimozione dello sfondo** da un’immagine caricata dall’utente.
- **Trascrizione audio** in tempo reale o quasi.
- **Embeddings testuali** per ricerca semantica e deduplica.
- **Classificazione** di testo/immagini per tagging, moderation, triage UI.
- **Depth estimation** o altre trasformazioni visive “assistite”.

Quando queste cose avvengono on-device, cambiano i compromessi: **meno latenza**, spesso **meno costi**, e soprattutto **più privacy** (i dati non devono uscire dal dispositivo).

## Perché on-device nel browser può essere più veloce (anche quando i modelli non sono “tiny”)
Il punto non è solo “GPU vs CPU”. È il *round trip*.

Per task che lavorano su input piccoli e frequenti (es. finestre audio di poche decine di millisecondi), inviare continuamente frammenti al server significa pagare:
- overhead di rete (anche su connessioni buone),
- jitter e variabilità,
- serializzazione/deserializzazione,
- code lato backend.

In questi scenari, un’inferenza locale che richiede pochi millisecondi può risultare più reattiva di qualsiasi chiamata API. Il browser diventa un runtime di inferenza “abbastanza buono” per tantissime feature.

## Transformers.js: l’idea chiave è l’API a pipeline
Transformers.js nasce con un obiettivo molto pratico: portare nel mondo JavaScript un modo **coerente** di usare modelli ML senza costringere chi sviluppa UI a ragionare in termini di tensori.

Sotto il cofano, un modello ML tipicamente:
1. prende in input un **tensore** (array di numeri con una certa forma),
2. esegue la computazione,
3. restituisce un **tensore**.

Ma un frontend developer non vuole “impacchettare numeri”. Vuole passare:
- testo,
- immagini,
- audio,
- (a volte) strutture più ricche.

La **pipeline** serve proprio a questo: incapsula una sequenza di passaggi che, in modo ripetibile, trasformano input “umani” in tensori e viceversa.

### Cosa c’è dentro una pipeline
Una pipeline non è solo “chiama il modello”. Tipicamente comprende:
- **pre-processing** (tokenizzazione, resizing, normalizzazione, framing audio…),
- **inference** (esecuzione del/i modello/i),
- **post-processing** (decoding, soglie, NMS, formattazione output…).

In alcuni casi la pipeline gestisce anche architetture a più stadi, ad esempio modelli **encoder-decoder** che eseguono più componenti in sequenza.

Risultato: un’API più vicina ai bisogni di prodotto. Tu specifichi *il task*, scegli un modello compatibile, passi l’input e ottieni l’output già pronto.

## Modelli: ONNX come formato, runtime come motore
Un aspetto fondamentale dell’ecosistema è la separazione tra:
- **formato del modello** (ONNX),
- **runtime** che esegue quel grafo computazionale.

### ONNX in breve
ONNX (Open Neural Network Exchange) è un formato che descrive:
- il **grafo** delle operazioni (la computazione),
- i **pesi** (weights), spesso nello stesso pacchetto o in file separati per modelli grandi.

Il vantaggio è l’interoperabilità: tanti modelli possono essere convertiti o esportati in ONNX e poi eseguiti da runtime differenti.

### Runtime intercambiabili
Nel mondo ONNX, il runtime è ciò che implementa “come” eseguire le operazioni su un backend specifico:
- CPU,
- GPU (via WebGPU nel browser),
- e in contesti non-browser anche backend come CUDA o DirectML.

Questa separazione è preziosa perché permette di mantenere **lo stesso modello** e cambiare **solo il motore** in base al dispositivo e al contesto di esecuzione.

## Non tutti i modelli ONNX sono “plug and play”
Un punto spesso sottovalutato: avere un file ONNX non garantisce che sia immediatamente usabile.

Per funzionare bene in un’API ad alto livello servono due tipi di compatibilità:
1. **Operazioni supportate dal runtime** (non tutte le op sono disponibili o performanti su ogni backend).
2. **Architettura supportata dalla libreria** (pre/post-processing, mapping input/output, tokenizzazione, ecc.).

In pratica:
- se prendi un’architettura già supportata e la **fine-tuni** (stessi strati, pesi diversi), di solito l’integrazione è lineare;
- se l’architettura è nuova o “atipica”, può essere necessario estendere il supporto oppure costruire una pipeline personalizzata usando componenti più granulari.

## CPU o WebGPU? Una regola semplice (con qualche eccezione)
La domanda “meglio CPU o GPU?” è meno banale di quanto sembri. A volte capita che la GPU non sia molto più veloce, specialmente quando:
- il modello è piccolo,
- l’overhead di trasferimento dati domina,
- alcune operazioni non sono ottimizzate sul backend scelto,
- la pipeline fa molto lavoro lato CPU (pre/post-processing) e poco in inferenza.

Una regola pratica per il browser:
- **CPU**: ottima per modelli piccoli/medi, task sporadici, o quando vuoi ridurre complessità e variabilità.
- **WebGPU**: conviene quando fai inferenze più pesanti, batch, o flussi continui dove ammortizzi il setup e la compilazione degli shader.

L’approccio migliore non è ideologico: è **misurare** con il tuo input reale (dimensione immagini, durata audio, lingua, device target) e decidere.

## Use case “da prodotto”, non da demo
Ecco dove l’on-device nel browser brilla davvero:

### 1) Trascrizione audio a bassa latenza
Se stai analizzando audio a finestre (streaming o quasi), l’elaborazione locale evita che ogni frammento debba attraversare la rete. È un pattern ideale per:
- note vocali,
- sottotitoli live,
- comandi vocali.

### 2) Background removal e strumenti di editing
Per upload di immagini (avatar, prodotti, documenti), la rimozione sfondo on-device:
- riduce costi e tempi server,
- evita di inviare immagini sensibili,
- migliora la percezione di “instant tooling”.

### 3) Embeddings e similarità nel client
Gli embeddings testuali abilitano:
- ricerca semantica locale su piccoli dataset,
- suggerimenti,
- clustering leggero,
- deduplica.

Non serve sempre una vector DB remota: per dataset client-side o temporanei può bastare l’on-device.

## Implicazione per chi fa frontend: l’AI diventa una dipendenza UI
Il passaggio interessante è culturale: l’AI non è più un servizio remoto “magico”, ma una **libreria** che entra nella tua architettura frontend.

Questo porta vantaggi ma anche responsabilità:
- gestione del peso dei modelli (download, caching, progressive loading),
- scelte di runtime (CPU/WebGPU),
- UX: fallback, stati di caricamento, degradazione elegante.

## Sintesi e conclusione
Eseguire ML nel browser con Transformers.js significa avere un’astrazione adatta al frontend: **pipeline** che nasconde tensori, **ONNX** come formato portabile, e **runtime** intercambiabili per sfruttare CPU o WebGPU.

La parte davvero utile non è “fare l’LLM in tab”: è costruire feature concrete (trascrizione, visione, embeddings) con latenza bassa, più privacy e meno dipendenza dalla rete. La pratica consigliata è semplice: scegli un task, prototipa con una pipeline, misura CPU vs WebGPU sui device reali e poi ottimizza dove serve. In molti prodotti, l’AI on-device non è solo possibile: è la scelta più sensata.
