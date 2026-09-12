---
title: "Eve: un modo “convention over configuration” per costruire e far girare AI agent in TypeScript (anche con modelli locali)"
subtitle: "Struttura di progetto rigida, tooling in TS, sandbox su filesystem e connettori OpenAI-compatibili: la ricetta per agent riproducibili e deployabili senza impazzire."
description: "Eve è un framework per creare AI agent in TypeScript seguendo una struttura di progetto convenzionale: tools, skills e canali vengono rilevati automaticamente, mentre tu ti concentri sulla logica. In questo articolo vediamo il modello mentale di Eve, perché semplifica bootstrap, trasporto e osservabilità, e come si integra bene con runtime locali tipo Ollama (OpenAI-compatible) per prototipi offline e costi zero di API. Chiudiamo con un esempio pratico: un agent “coach” che genera un piano di esercizi a partire da un dataset JSON e da un obiettivo (es. mal di schiena)."
publishedAt: 2026-07-02
tags: ["ai agent","TypeScript tools","Ollama","modelli locali","prompting strutturato","framework agent"]
---
## Perché un framework per agent, oggi
Costruire un AI agent “serio” non è difficile solo per il prompt. Il lavoro vero sta nel contorno:

- **trasporto** (HTTP, streaming, ecc.)
- **struttura** del progetto e discovery dei componenti
- **strumentazione** (log, tracing, osservabilità)
- **gestione dello stato** e della memoria conversazionale
- **integrazione dei tool** (funzioni, filesystem, chiamate esterne)

Eve nasce per togliere attrito da questi punti, imponendo una struttura chiara e offrendo un runtime pensato per agent. L’idea è semplice: *tu scrivi logica e istruzioni; il framework si occupa di farla girare in modo coerente*.

## Eve in una frase: convention over configuration
Il cuore di Eve è un approccio “**convention over configuration**”. Invece di descrivere tutto a mano in un file di config, segui una struttura standard (cartelle e file con nomi noti) e Eve:

- rileva automaticamente tools/skills/channels
- li rende disponibili all’agent
- gestisce parte dell’infrastruttura necessaria a esporre l’agent e interagirci

Questo taglia tempo su bootstrap e wiring, e soprattutto riduce la variabilità tra progetti: quando apri un repository Eve, *sai già dove guardare*.

## I concetti chiave: Tools, Prompt, Sandbox, Channels
Anche senza entrare in dettaglio su ogni cartella, ci sono quattro concetti utili per capire come “pensa” Eve.

### 1) Tools: funzioni TypeScript, non magia
I **tools** sono logica scritta in TypeScript/JavaScript: funzioni che l’agent può invocare per fare lavoro deterministico.

Esempi tipici:
- filtrare un dataset
- validare input
- generare un piano in formato strutturato
- leggere/scrivere file

Il vantaggio è enorme: invece di chiedere al modello di “fare calcoli” o “ricordare dati”, sposti il lavoro nei tools e lasci al modello orchestrazione e linguaggio.

### 2) System prompt e istruzioni
Eve ti spinge a formalizzare bene le istruzioni: *cosa deve fare l’agent, con quali limiti, e con quale stile d’output*.

Qui conviene essere pragmatici:
- definisci lo **scopo** (es. piano di allenamento)
- definisci i **vincoli** (es. solo esercizi da dataset, durata massima, focus su specifici muscoli)
- definisci un **output strutturato** (es. JSON) quando devi consumare la risposta in UI

### 3) Sandbox: un filesystem “di lavoro” per l’agent
Un’idea molto utile è la **sandbox**: una directory in cui l’agent può interagire con file e dati.

È perfetta per:
- dataset locali (JSON, CSV)
- cache di risultati
- file temporanei

In pratica diventa uno spazio controllato dove l’agent può “operare” senza dipendere da risorse esterne.

### 4) Channels: come parli con l’agent
I **channels** sono il modo in cui interagisci con l’agent (ad esempio via HTTP). Questo aspetto è importante perché ti permette di trattare l’agent come un servizio:

- in locale per prototipi
- in rete privata (LAN) per uso personale
- deployato su infrastruttura cloud quando serve

## Modelli locali: perché hanno senso (e come si incastrano)
Per prototipi e strumenti personali, usare un modello locale è spesso la scelta più sensata:

- **zero API key**
- **costi prevedibili** (solo compute)
- **privacy** migliore (dati che restano in locale)

Runtime come **Ollama** sono comodi perché offrono un server locale con compatibilità **OpenAI protocol**: molti framework (Eve incluso, tramite connettori compatibili) possono collegarsi senza adattamenti complessi.

### Una nota su “E4B”, dimensione e affidabilità
Quando scegli un modello “piccolo” (2B–4B parametri effettivi), ottieni velocità e facilità d’esecuzione, ma paghi in:

- **affidabilità dell’output strutturato** (JSON che si rompe, campi mancanti)
- **robustezza** nel seguire istruzioni complesse

Per questo è strategico spostare più logica possibile nei **tools** e chiedere al modello soprattutto decisioni e composizione.

## Un caso d’uso concreto: un “local coach” che crea un workout plan da un dataset JSON
Un esempio pratico e molto realistico: un agent che, dato un problema (es. *"mi fa male la schiena"*), crea un piano usando **solo** esercizi presenti in un dataset locale.

### Ingredienti
- un dataset di esercizi in JSON con campi come:
  - nome
  - livello
  - attrezzatura
  - muscoli primari/secondari
  - istruzioni
  - categoria
- una sandbox che contiene il file JSON
- tools TypeScript per:
  - caricare e indicizzare gli esercizi
  - filtrare per muscoli/attrezzatura/livello
  - comporre un piano settimanale o giornaliero

### Perché questa architettura funziona
- Il dataset è **offline**: niente dipendenze esterne.
- Il modello non deve “inventarsi” esercizi: seleziona tra opzioni reali.
- Il piano può essere emesso in **formato consumabile dalla UI** (JSON), mentre la UI può renderizzare anche descrizioni “umane”.

### Attenzione: salute e responsabilità
Quando il dominio tocca dolore o riabilitazione, conviene impostare nel prompt un perimetro chiaro:
- niente diagnosi
- suggerimenti generici e prudenti
- invito a consultare uno specialista se ci sono segnali d’allarme

Non è un dettaglio: migliora sia la qualità sia la sicurezza del prodotto.

## E React / React Native dove entrano?
È utile separare i piani:

- **Eve come server-side runtime**: l’uso più naturale. Lo esponi via HTTP e ci parli da una web app o da un’app mobile.
- **On-device** (React Native): teoricamente possibile, ma spesso complicato da dipendenze Node e dalla necessità di far girare un LLM affidabile sul device. Nella pratica è più robusto trattare l’agent come servizio (anche solo in LAN) e consumarlo dall’app.

## Sintesi e implicazione pratica
Eve è interessante perché riduce l’agent a una cosa concreta: **una codebase TypeScript con una struttura standard**, dei **tools** chiari e un canale di comunicazione ben definito. Il “trucco” non è delegare tutto al modello, ma costruire un perimetro solido attorno al modello.

Se vuoi un primo progetto che dia valore subito, l’approccio *dataset locale + tools + output strutturato* è quello che regge meglio anche con modelli piccoli: poche allucinazioni, più determinismo, e un’integrazione frontend molto più pulita.
