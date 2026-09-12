---
title: "WebMCP: progettare strumenti “agent-friendly” e debuggarli in Chrome DevTools"
subtitle: "Dall’API imperativa alle annotazioni nei form: come esporre tool strutturati per browser agent e verificarli passo passo."
description: "WebMCP è una proposta di standard (ancora sperimentale) per esporre strumenti strutturati che un agente nel browser può invocare in modo affidabile. In questo articolo vediamo come costruire tool WebMCP con API imperativa o dichiarativa, come abilitarne il supporto in Chrome e come ispezionarli, invocarli e debuggarli in DevTools, incluso il flusso con DevTools for Agents."
publishedAt: 2026-07-21
tags: ["WebMCP","Chrome DevTools","browser agent","tooling agentico","debugging strumenti"]
---
WebMCP è una proposta di standard web pensata per un’esigenza molto concreta: dare agli agenti nel browser un modo **strutturato, dichiarativo e verificabile** per interagire con le funzionalità di una pagina. Invece di “indovinare” cosa cliccare o quale campo compilare, un agente può invocare **tool espliciti** esposti dal sito, con **nome**, **descrizione** e **schema di input**.

Il punto interessante, per chi costruisce frontend complessi, è che WebMCP sposta una parte dell’integrazione “agentica” dal livello di UI automation al livello di **API di pagina**: meno fragilità, più controllo e più possibilità di debug.

> Nota pratica: WebMCP è ancora sperimentale, e anche l’esperienza di debug lo è. Vale la pena trattarlo come un’area in evoluzione.

---

## Abilitare WebMCP in Chrome (modalità sperimentale)
Per iniziare a sperimentare servono due attivazioni in `chrome://flags`:

- **DevTools WebMCP support** (abilita le UI di ispezione in DevTools)
- **WebMCP testing flags** (abilita le funzionalità di test/sperimentazione)

Dopo averle abilitate e riavviato Chrome, le pagine che espongono tool WebMCP diventano ispezionabili e invocabili direttamente da DevTools.

---

## Due modi per definire tool WebMCP: imperativo vs dichiarativo
WebMCP permette di esporre tool in due stili, con obiettivi diversi.

### 1) API imperativa: tool definiti in JavaScript
Con l’approccio imperativo definisci tool come funzioni “richiamabili” dall’agente. È il caso giusto quando il tool deve:

- orchestrare logiche non banali (stato, navigazione, side effect)
- comporre più azioni UI in un’unica operazione atomica
- fornire parametri ricchi e validabili (grazie allo schema)

Il pattern tipico prevede la registrazione di un tool tramite qualcosa come `modelContext.registerTool(...)`, fornendo:

- **tool name**
- **description**
- **input schema** (che descrive i parametri attesi)

Esempio d’uso concettuale: in una dashboard “smart home”, un tool potrebbe occuparsi di **riorganizzare componenti DOM** (spostare card da pagine dedicate a una dashboard principale) senza che l’agente debba capire il layout o la struttura delle classi CSS.

In parallelo, esistono anche metodi per **scoprire ed eseguire tool disponibili** (es. “get tools”) in modo asincrono all’interno del documento: utile per integrazioni dinamiche o per ambienti in cui tool e contesto cambiano per route.

### 2) API dichiarativa: trasformare un form HTML in un tool
L’approccio dichiarativo è interessante perché riduce la frizione: parti da un normale `<form>` e lo “annoti” per farlo diventare un tool.

- Sul `form` indichi **nome** e **scopo** del tool
- I campi del form diventano **parametri**
- Il browser traduce queste annotazioni in un tool invocabile dall’agente, allineato agli strumenti imperativi

In più, puoi scegliere se:

- richiedere l’invio manuale (l’utente conferma esplicitamente)
- abilitare l’**auto submit**: quando il modello invoca il tool, la submission (e l’eventuale navigazione) viene triggerata automaticamente

Questo modello è particolarmente adatto per flussi come prenotazioni, richieste di contatto, checkout guidati o qualsiasi scenario già “form-centrico”.

---

## Perché WebMCP cambia la UX degli agenti nel browser
Un browser agent (ad esempio integrato nel browser) può:

1. capire *quali* azioni sono permesse (tool discovery)
2. sapere *come* invocarle (schema + parametri)
3. eseguirle in modo più robusto rispetto a click e selettori fragili

Un esempio tipico è una configurazione prodotto: invece di navigare tra menu e toggle, un tool tipo `updateCarConfiguration` può esporre parametri strutturati (colore, illuminazione, tecnologia comfort, ecc.), lasciando all’agente un compito più “API-driven” e meno “DOM-driven”.

---

## Debug dei tool WebMCP in Chrome DevTools
Come per il resto dell’applicazione, anche i tool WebMCP possono essere **ispezionati, testati e debuggati**.

### Dove si trovano
Su una pagina che espone tool WebMCP:

1. apri **DevTools**
2. vai nel pannello **Application**
3. nella parte bassa trovi l’elenco dei **tool disponibili**

### Cosa puoi ispezionare
Selezionando un tool, nella sidebar dei dettagli puoi vedere:

- **nome** e **descrizione** (come li “legge” un agente)
- **parametri disponibili** (derivati dallo schema)

### Come invocarli (test manuale)
Dalla stessa sidebar puoi invocare il tool:

- aggiungi/edita valori dei parametri (UI con “plus” e campo di input)
- per alcuni parametri compare un **dropdown** con le opzioni inferite dallo schema
- premi **Run tool**

Appena esegui:

- compare una riga di **invocation** con stato, input e output
- cliccando l’invocazione puoi ispezionare in dettaglio gli oggetti di input/output

Questo workflow è prezioso per:

- verificare che lo **schema** sia davvero utilizzabile
- controllare output e errori senza dover “passare” da un agente esterno
- riprodurre rapidamente casi limite (parametri mancanti, combinazioni non valide, ecc.)

---

## Test via DevTools for Agents (quando il tuo coding agent diventa browser agent)
C’è un secondo livello di sperimentazione: usare **DevTools for Agents**, che permette di dare a un agente accesso a strumenti del browser.

Dopo aver installato e configurato DevTools for Agents, puoi:

- abilitare una configurazione sperimentale per **WebMCP support**
- ottenere due capacità aggiuntive:
  - **list WebMCP tools**
  - **execute WebMCP tool**

### Attenzione: priorità degli strumenti
DevTools for Agents espone anche altri strumenti di interazione con la pagina. Di conseguenza l’agente potrebbe preferire tool “generici” invece dei tuoi tool WebMCP.

Se vuoi verificare davvero la qualità dei tool che hai progettato, conviene dare istruzioni esplicite, ad esempio: “crea una prenotazione … **usando il tool WebMCP**”.

---

## Implicazioni pratiche per chi fa frontend
WebMCP introduce un modo per progettare esperienze “agentiche” con lo stesso rigore con cui progettiamo API e contratti:

- **tool come interfacce stabili** (meno dipendenza dal DOM)
- **schema come contratto** (più prevedibilità, testabilità e validazione)
- **DevTools come ambiente di QA** (invocazioni riproducibili, input/output ispezionabili)

In questa fase sperimentale il consiglio è pragmatico: partire da 1–2 tool ad alto impatto (prenotazione, configurazione, checkout, riorganizzazione dashboard), curare descrizioni e schema, e usare DevTools per far emergere subito ambiguità e casi limite. Se il tool è facile da invocare e da debuggare per te, di solito lo sarà anche per un agente.
