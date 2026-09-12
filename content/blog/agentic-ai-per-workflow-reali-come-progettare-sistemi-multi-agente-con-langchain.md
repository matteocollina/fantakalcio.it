---
title: "Agentic AI per workflow reali: come progettare sistemi multi-agente con LangChain e LangGraph"
subtitle: "Dai prompt “one-shot” a processi orchestrati: stato, tool, memoria, RAG, HITL e deployment production-ready"
description: "Una guida editoriale (con taglio pratico) a cosa rende davvero “agentico” un sistema basato su LLM e come si struttura un’architettura moderna con LangChain + LangGraph: orchestrazione a grafo, esecuzioni sequenziali/parallele/condizionali, validazione con Pydantic, memoria e persistenza, RAG, controlli human-in-the-loop, osservabilità e deployment su AWS/Render. Con esempi di progetti tipici: chatbot agentico, planner multi-agente e content automation."
publishedAt: 2026-07-30
tags: ["LangGraph","LangChain","workflow multi-agente","Pydantic validation","RAG e memoria","human-in-the-loop"]
---
Negli ultimi anni abbiamo costruito tante applicazioni “LLM-based” con uno schema piuttosto lineare: **prompt → modello → risposta**. Funziona bene per Q&A, riassunti, traduzioni, generazione di testo e una parte di automazioni leggere. Ma appena il problema diventa *operativo* (più passi, dipendenze, strumenti esterni, stato da mantenere, controlli e rollback), quel modello inizia a scricchiolare.

L’**Agentic AI** nasce proprio per colmare questo gap: non è “un LLM più bravo”, ma un modo diverso di costruire software attorno agli LLM, dove l’output non è soltanto testo, bensì **azioni** eseguite dentro un workflow governato.

## Cos’è davvero un sistema agentico
Un agente è un sistema che:

- riceve un **obiettivo** (goal) dall’utente;
- lo trasforma in **piano di lavoro** (planning);
- esegue **azioni** (tool use) in più step;
- mantiene **stato e memoria**;
- si **adatta** ai risultati intermedi (reflection / decision making);
- chiede input umano **solo quando serve** (human-in-the-loop).

La differenza pratica rispetto a una classica chat è che un agente non si limita a “spiegare come fare”, ma **fa**: interroga API, scrive file, consulta un database, esegue ricerche, valida dati, prepara output strutturati, e coordina più sub-attività.

## Perché il classico approccio “prompt → risposta” non basta
Un LLM isolato ha limiti noti:

- **knowledge cutoff**: non conosce eventi o dati recenti se non integrati via retrieval;
- **assenza di stato**: senza una memoria esplicita, ogni turno è fragile o costoso (ricontestualizzazione);
- **nessun controllo del flusso**: non esistono rami condizionali affidabili, loop, retry e parallelizzazione;
- **tooling non governato**: chiamare strumenti esterni richiede vincoli, validazioni, gestione errori;
- **osservabilità e debug** difficili: se il comportamento cambia, serve tracciare cosa è successo davvero.

I sistemi agentici affrontano questi problemi con architetture in cui l’LLM è solo un componente di un processo più ampio.

## Agentic behaviors: i mattoni fondamentali
Quando si progetta un agente, i comportamenti “agentici” tipici sono:

1. **Reasoning / Decision making**: scegliere il prossimo step in base allo stato.
2. **Planning**: scomporre l’obiettivo in task ordinati e verificabili.
3. **Tool use**: eseguire azioni tramite strumenti (API, DB, search, codice).
4. **Memory**: distinguere tra contesto di sessione e persistenza a lungo termine.
5. **Reflection & monitoring**: controllare qualità/completezza, gestire errori, correggere rotta.
6. **Human feedback (HITL)**: inserire gate di approvazione o richieste di chiarimento.

Questi elementi, combinati, trasformano una chat in un **workflow automatizzato**.

## LangChain + LangGraph: ruoli distinti
Quando si parla di stack moderno per agenti in Python, una combinazione ricorrente è:

- **LangChain** come “toolbox”: modelli, prompt template, loader, strumenti, integrazioni utilitarie.
- **LangGraph** come orchestratore: definisce il workflow come un **grafo di nodi** con **stato**, **edge** (anche condizionali), cicli, parallelismo e persistenza.

In pratica: **LangChain ti aiuta a costruire i pezzi**, LangGraph ti aiuta a **dirigere l’esecuzione** dei pezzi.

## L’idea chiave di LangGraph: workflow a grafo con stato
Un workflow agentico serio raramente è una pipeline lineare. Serve:

- uno **State** centralizzato (che trasporta input, risultati intermedi, errori, decisioni);
- **Nodes** che eseguono step specifici (es. “estrai entità”, “chiama API voli”, “valida output”, “scrivi risposta”);
- **Edges** che definiscono le transizioni;
- **Conditional edges** per diramazioni (es. se manca un’informazione → chiedi all’utente; altrimenti → continua);
- **Start/End nodes** e una compilazione del grafo.

Questa struttura rende il comportamento più **deterministico, debuggabile e testabile**.

### Sequenziale, parallelo, condizionale (e iterativo)
LangGraph permette pattern tipici:

- **Sequential**: step in ordine (A → B → C).
- **Parallel**: fan-out/fan-in (es. raccogli info da più fonti in parallelo e poi aggrega).
- **Conditional**: rami basati su stato/decisione.
- **Iterative**: loop controllati (retry, refinement, “finché non soddisfa una condizione”).

Sono esattamente le strutture che mancano in un agente costruito solo “a prompt”.

## Validazione: perché Pydantic è un alleato (non un dettaglio)
Quando un agente deve produrre **output strutturati** (JSON, record, piani, parametri per strumenti), la validazione diventa essenziale.

Con **Pydantic** puoi:

- definire schemi chiari (tipi, campi obbligatori, vincoli);
- rigettare output malformati;
- normalizzare e rendere affidabili i dati prima di chiamare tool esterni.

In produzione, la differenza tra “sembra un JSON” e “è validato e coerente” è enorme, soprattutto quando l’output guida azioni reali.

## Async e parallelismo: il pezzo nascosto delle app agentiche
Molti workflow agentici fanno I/O continuo: API, DB, vector store, scraping/ricerche, servizi esterni. Senza **asincronia** si finisce con agenti lenti e costosi.

Impostare bene l’async in Python (e ragionare su concorrenza e limiti) serve per:

- eseguire task in parallelo;
- ridurre la latenza end-to-end;
- gestire timeout, retry e circuit breaker in modo sensato.

## Memoria: breve termine, persistenza e “vera” conversazione
Un chatbot agentico utile deve distinguere:

- **short-term memory**: la chat corrente, turni recenti, contesto immediato;
- **long-term memory**: preferenze utente, storico, dati persistenti.

In più, in ambienti reali è spesso necessario:

- **streaming** della risposta (UX migliore);
- **chat persistence** su database;
- gestione della conversazione come stato, non come “prompt enorme”.

## RAG negli agenti: quando il retrieval diventa un tool
La Retrieval-Augmented Generation non è alternativa agli agenti: spesso è un **tool** dentro il loro toolbox.

Tipico pattern:

1. l’agente capisce che gli manca informazione;
2. esegue retrieval su vector DB;
3. integra le evidenze;
4. decide il prossimo step.

Con integrazione a database vettoriali (es. Chroma o equivalenti) puoi sbloccare casi d’uso come documentazione interna, knowledge base aziendale, policy, manuali, cataloghi.

## Human-in-the-loop: controlli, approvazioni e sicurezza operativa
Inserire un essere umano “nel loop” non è un ripiego: è un requisito.

HITL serve per:

- approvazioni prima di azioni irreversibili (invio email, modifica DB, acquisti);
- richieste di chiarimento su input ambiguo;
- controllo qualità su output sensibili.

In LangGraph questo di solito si traduce in nodi di **gate** e transizioni condizionali basate su feedback.

## Osservabilità e debug: tracing e monitoring fin dall’inizio
Gli agenti non sono facili da debuggare “a sensazione”. Serve tracing: chiamate LLM, prompt effettivi, tool invocati, stato prima/dopo ogni nodo, tempi e errori.

Strumenti di tracing (es. LangSmith) aiutano a:

- capire perché un agente ha scelto un ramo;
- individuare loop indesiderati;
- misurare costi e latenza;
- riprodurre run problematiche.

## Production grade: dal prototipo al servizio
Un agente che funziona in locale non è ancora un prodotto. Il pacchetto “production-ready” include quasi sempre:

- containerizzazione **Docker**;
- API backend (spesso **FastAPI**);
- database (PostgreSQL / SQLAlchemy) e gestione migrazioni;
- gestione sicura di secret ed **environment variables**;
- logging strutturato;
- CI/CD (GitHub Actions o equivalente);
- deployment (AWS o piattaforme come Render) con attenzione a scaling e osservabilità.

## Tre progetti tipici che mettono insieme tutto
Per rendere concreti i concetti, ecco tre archetipi di applicazioni agentiche molto comuni:

1. **Chatbot agentico end-to-end**
   - stato + memoria persistente
   - tool integration
   - RAG
   - HITL per approvazioni
   - tracing e deployment

2. **“ChatGPT-like” custom per dominio specifico**
   - workflow governato
   - vector DB (es. Chroma)
   - backend FastAPI
   - database relazionale per utenti/sessioni

3. **Planner multi-agente (es. trip planner)**
   - più agenti specializzati (ricerca, budget, itinerario, prenotazioni)
   - esecuzioni parallele e aggregazione
   - richieste di input mirate all’utente

## Sintesi: come pensare “agentico” da frontend/dev di prodotto
La svolta non è “mettere un LLM nell’app”, ma **progettare un processo**:

- definisci lo **stato** che vuoi controllare;
- scomponi in **nodi** piccoli e testabili;
- usa **Pydantic** per rendere affidabili gli output;
- integra **tool** e **RAG** come componenti governati;
- inserisci **HITL** dove il rischio è reale;
- metti **tracing e deployment** sul tavolo da subito.

L’implicazione pratica è chiara: gli agenti diventano davvero utili quando smettiamo di trattarli come “chat intelligenti” e iniziamo a considerarli **workflow engine con un LLM al centro**, orchestrati e osservabili come qualsiasi sistema software serio.
