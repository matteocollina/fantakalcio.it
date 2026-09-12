---
title: "Agentic AI su Vercel: architettura pratica per agenti che “fanno cose” (non solo chat)"
subtitle: "Gateway multi‑modello, streaming + job in background, toolchain con sandbox e CLI: una blueprint concreta per portare l’AI in produzione."
description: "Costruire un agente utile in un contesto enterprise significa andare oltre la generazione di testo: serve contesto, strumenti, capacità di esecuzione e un’architettura che regga in produzione. Vediamo una blueprint moderna basata su Next.js, Vercel AI SDK, AI Gateway e sandbox con filesystem/CLI per far lavorare davvero gli agenti su task complessi (con routing tra modelli, streaming UI e processi lunghi in background)."
publishedAt: 2026-05-06
tags: ["Vercel AI Gateway","Vercel AI SDK","Next.js App Router","sandbox e CLI","routing multi-modello"]
---
Nel 2026 parlare di “agentic AI” in ambito frontend non significa più aggiungere una chat a un’app. Significa progettare un sistema che **capisca il contesto**, **scelga il modello giusto**, **usi strumenti reali** (API, ricerca, generazione documenti, deploy) e **porti a termine attività** che possono durare da pochi secondi a diverse decine di minuti.

Quello che segue è una blueprint concreta, pensata per chi costruisce prodotti con Next.js e vuole portare in produzione agenti affidabili: non solo risposte “plausibili”, ma output verificabili e azioni ripetibili.

---

## Il problema reale: naturalezza per gli utenti, produttività per i builder
In contesti enterprise (CRM, ERP, piattaforme interne), i bisogni si dividono spesso in due:

1. **Business user**: vuole interrogare il sistema con linguaggio naturale (“cosa sta succedendo con questi clienti?”, “creami un report”, “riassumimi questa riunione”).
2. **Builder/Configurator**: vuole accelerare attività tecniche (“crea un flow”, “genera una struttura di progetto”, “prepara una deploy con best practice”).

Il punto critico è che un LLM “generico” può darti una risposta, ma raramente produce qualcosa di **production-ready** senza:

- contesto dell’istanza/progetto
- vincoli e best practice
- strumenti per validare e applicare le modifiche

Da qui deriva l’architettura: l’agente deve avere **memoria di progetto**, **tooling**, e spesso anche un **ambiente di esecuzione controllato**.

---

## Una high-level architecture a 3 livelli
Una separazione pulita aiuta a scalare team e complessità.

### 1) UI: Next.js come “agentic frontend”
In alto c’è un’app **Next.js** (tipicamente App Router) che gestisce:

- conversazione
- gestione contesti/progetti
- upload di artefatti (note di riunione, documenti, requisiti)
- rendering di output strutturati (card, checklist, piani, diagrammi)

Qui lo streaming è fondamentale: l’utente vuole vedere progressi, non un loader infinito.

### 2) Orchestrazione: Vercel AI SDK per loop agentico e tool calling
Lo strato centrale è il controller: l’agent loop, le tool, la strategia di chiamata modelli.

Con un SDK agentico moderno ottieni:

- astrazione multi-provider
- streaming server→client
- tool calling strutturato
- scaffolding per gestire passaggi iterativi (piano → azioni → verifica)

In pratica, lo SDK diventa la “spina dorsale” che evita di reinventare ogni volta routing, parsing, streaming e gestione tool.

### 3) Modelli: AI Gateway per non rimanere bloccati su un vendor
Lo strato AI non dovrebbe essere un vincolo. In produzione, **non esiste un unico modello migliore**:

- richieste semplici → modello veloce/economico
- richieste complesse → modello più capace
- task specifici → modelli diversi per qualità/costo/latency

Un gateway ti consente di:

- standardizzare autenticazione e invocazioni
- cambiare modello senza refactor pesanti
- implementare routing interno basato sul tipo di domanda

---

## Routing multi‑modello: un classificatore vale più di mille discussioni
Una delle mosse più pragmatiche è introdurre un **classifier** a monte:

- “È solo una risposta breve?”
- “Serve ragionamento complesso?”
- “Dobbiamo generare un piano di lavoro?”
- “Dobbiamo eseguire tool e validare un ambiente?”

Da lì puoi decidere:

- modello A per chat leggera
- modello B per generazione strutturata (piani, user story)
- modello C per task critici (deploy, refactor, migrazioni)

Risultato: risposte più rapide quando possibile, e qualità quando necessario—senza pagare sempre il costo massimo.

---

## Streaming e background jobs: la UX “moderna” richiede entrambe
Molti agent-first product iniziano con lo streaming: ottimo per task che finiscono in 10–60 secondi.

Ma appena entri in scenari complessi (generazione di un intero sito, provisioning di risorse, pipeline di build/deploy, analisi e validazioni multiple), hai bisogno di:

- **processi in background** persistenti
- stato consultabile e riprendibile
- output incrementali (log, step completati, artefatti generati)

L’idea chiave è offrire **un’unica esperienza UI**, ma con due modalità operative:

- **streaming** per interazione immediata
- **background** quando il task supera i limiti di una singola request/response

Questo cambia completamente la robustezza percepita del prodotto.

---

## Tooling: l’agente deve avere “mani”, non solo “voce”
Un agente utile è un agente che sa fare azioni.

Una toolchain tipica, costruita nel tempo, include categorie come:

- **document generation** (specifiche, piani, report)
- **search/retrieval** (knowledge base, documentazione, artefatti del progetto)
- **story management** (user story, acceptance criteria)
- **integrazioni** (API di terze parti)
- **azioni su piattaforme** (query, validazioni, deploy)

Il salto di qualità avviene quando ogni tool produce output controllabile: non solo testo, ma risultati verificabili (es. check di precondizioni, elenco oggetti trovati, diff di file, ecc.).

---

## Sandbox + filesystem + CLI: la componente che rende l’agente “operativo”
Per i task tecnici, l’LLM ragiona meglio quando può operare su artefatti reali:

- file
- cartelle
- comandi CLI
- output di toolchain

Un ambiente sandbox (isolato) con filesystem permette all’agente di:

1. autenticarsi verso l’ambiente target
2. generare/modificare file
3. eseguire comandi (build, validate, deploy)
4. usare l’output dei comandi come feedback nel loop agentico

Questo pattern è particolarmente potente quando il lavoro passa da “spiegami come fare” a “fallo davvero”: il modello non si limita a descrivere passaggi, ma li **esegue** e **corregge** in base ai risultati.

---

## Integrazione con generatori di codice: quando il contesto è il vero moltiplicatore
Un generatore di UI o codice è molto più utile se riceve:

- contesto di progetto
- vincoli della piattaforma
- oggetti già presenti
- naming convention e standard interni

Il punto non è “generare React”, ma sfruttare il generatore come **atto finale** di una pipeline agentica: prima raccolgo e valido il contesto, poi genero codice coerente con l’ambiente.

---

## Quattro lezioni pratiche da portarsi a casa
1. **Usa un gateway**: smetti di cercare “il modello perfetto” e inizia a usare “il modello giusto per quel task”.
2. **Lo streaming è l’inizio, non la fine**: in produzione servono anche job lunghi in background.
3. **Le sandbox sono decisive**: filesystem + CLI trasformano un assistente in un esecutore.
4. **Scegli una piattaforma che ti tolga lavoro infrastrutturale**: l’obiettivo è consegnare feature e qualità, non mantenere plumbing.

---

## Una UI agentica che funziona: contesti, strumenti, input ricchi
Dal punto di vista frontend, una UX efficace tende ad avere:

- **progetti/contesti** selezionabili (per “caricare” memoria e vincoli)
- **pannello conversazione** centrale
- **tool disponibili** visibili e tracciabili
- **ingest di contesto** (file, note, requisiti, oggetti di dominio)

Questo riduce drasticamente l’ambiguità: l’agente non “indovina” ciò che serve, ma riceve input strutturati e può chiedere chiarimenti mirati.

---

## Conclusione
Se stai costruendo un prodotto agentico su Next.js, il punto non è aggiungere un LLM: è progettare un sistema con **routing**, **strumenti**, **ambienti di esecuzione**, e una UX che supporti **sia l’immediatezza dello streaming** sia **la solidità dei processi lunghi**.

Questa blueprint (Next.js + AI SDK + AI Gateway + sandbox) è un ottimo riferimento perché sposta l’AI dalla dimensione “conversazionale” a quella “operativa”: meno demo, più produzione.
