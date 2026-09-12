---
title: "Eve: agent “a file system” su Vercel, tra canali, tool e valutazioni automatiche"
subtitle: "Un framework dichiarativo per portare agenti in produzione: struttura a cartelle, integrazioni dati, human-in-the-loop ed eval come test suite."
description: "Eve propone un’idea molto frontend-friendly: costruire agenti in modo dichiarativo, organizzandoli come file e cartelle, con canali di conversazione (CLI, HTTP, Slack e oltre), tool/connection per integrare dati e azioni, e un sistema di eval per misurare la qualità mentre l’agente evolve. Vediamo come si compone un’app Eve, come si collega a fonti esterne (OpenAPI o database), come si gestiscono approvazioni per operazioni rischiose e come si impostano eval deterministiche o “LLM-as-judge” per iterare con più sicurezza."
publishedAt: 2026-07-20
tags: ["framework agenti","integrazione OpenAPI","Slack bot aziendali","human-in-the-loop","eval LLM-as-judge","Vercel AI Gateway"]
---
Costruire un agente utile non è (solo) una questione di prompt. Appena provi a metterlo “dentro” un flusso di lavoro reale emergono sempre gli stessi bisogmi: autenticazione, canali di accesso (chat interna, API, strumenti aziendali), integrazione dati, osservabilità, guardrail per le azioni, e un modo ripetibile per capire se stai migliorando o peggiorando.

Eve nasce esattamente con questo obiettivo: rendere **la costruzione e la distribuzione di agenti** un’attività concreta e “operativa”, più simile a mantenere un servizio che a giocare con un playground.

Di seguito una panoramica pratica dei concetti che contano per chi sviluppa prodotti e integrazioni.

---

## 1) Un agente come file system: struttura dichiarativa
La scelta più interessante di Eve è anche la più semplice da spiegare: **l’agente vive nel repository come insieme di file**.

Quando inizializzi un progetto, ti ritrovi subito una directory dedicata (tipicamente `agent/`). L’idea è che un agente possa essere, al minimo, **un file di istruzioni**. Da lì in poi aggiungi capacità in modo incrementale, “montando” componenti (tool, connessioni, canali) come faresti con qualsiasi altra feature.

Questa impostazione ha un vantaggio enorme per un team:

- tutto è versionabile (Git), reviewabile e tracciabile;
- l’agente diventa un artefatto del prodotto, non un set di prompt sparsi;
- il deploy non è una procedura speciale: è un deploy come gli altri.

---

## 2) Autenticazione e modello: AI Gateway e provider esterni
Per parlare con un modello serve autenticazione. In un setup tipico, puoi collegarti a un provider tramite chiavi proprie oppure passare da un gateway.

Un flusso comune è quello di:

- collegare il progetto a un workspace/team;
- creare (o associare) un progetto in cloud;
- far sì che l’ambiente locale sia configurato per invocare il modello con le credenziali corrette.

Il punto non è tanto “qual è il provider”, ma il fatto che questa parte venga trattata come **configurazione di progetto**, non come codice custom da riscrivere ogni volta.

---

## 3) I “channels”: lo strato di interazione (CLI, HTTP, Slack…)
In Eve il concetto di **channel** è centrale: rappresenta il modo in cui utenti o sistemi “parlano” con l’agente.

Perché è importante? Perché un agente in azienda raramente vive solo in una chat web: lo vuoi su Slack/Teams, dietro un endpoint HTTP, in un workflow automatizzato, o persino su una superficie realtime.

Un channel non è solo trasporto: spesso decide anche **presentazione e UX**. Ad esempio, su Slack ha senso mostrare indicatori di stato (es. “thinking…”) o rendere leggibili i passaggi principali (tool call, step significativi) senza costringerti a ricostruire una UI da zero.

### Distribuzione rapida
Un aspetto pratico: una volta connesso un channel (es. Slack) la pubblicazione diventa molto veloce—modifichi i file dell’agente, ridistribuisci e in pochi secondi lo trovi aggiornato nel canale.

---

## 4) Osservabilità “out of the box”: run, tool call e debug
Gli agenti falliscono. Non “se”, ma “quando”: un tool che va in errore, una chiamata a un servizio esterno che time-outa, un parsing che rompe.

Per questo la parte di **osservabilità** è fondamentale:

- ogni messaggio/interaction produce una *run*;
- puoi ispezionare cosa è successo step-by-step;
- quando un tool call fallisce, hai contesto per capire dove e perché.

In pratica, diventa un’esperienza molto più simile a debuggare un servizio backend che a indovinare cosa abbia fatto un modello.

---

## 5) Dati e integrazioni: “connections” e “tools”
Un agente senza dati è un giocattolo. Eve distingue due concetti:

- **Tool**: un’azione/operazione esposta all’agente (mapping 1:1: input → esecuzione → output).
- **Connection**: un tipo particolare di tool, pensato per connettere in modo più standardizzato a sorgenti esterne (es. tramite specifiche OpenAPI).

### Esempio: collegare una OpenAPI
Un caso didattico è integrare una specifica OpenAPI (meteo, catalogo prodotti, CRM, ecc.). Una volta definita la connection, l’agente può usarla immediatamente per:

- cercare dati propedeutici (es. coordinate);
- invocare endpoint;
- comporre una risposta con dati aggiornati.

La parte interessante è che il framework tratta questo come capacità “di primo livello”: non è una collezione di fetch sparsi, ma un’integrazione che entra nel set di strumenti dell’agente.

### Esempio: tool custom per MongoDB (NoSQL)
Quando invece vuoi un datastore non “impacchettabile” via OpenAPI (o vuoi controllo totale), costruisci tool custom.

Un pattern pragmatico è separare:

- `query`: operazioni in lettura;
- `mutate`: operazioni in scrittura.

Perché separarle? Perché la scrittura è rischiosa. E qui entra una feature chiave.

---

## 6) Human-in-the-loop: approvazioni per operazioni sensibili
Un agente che può scrivere su un database, aprire ticket o inviare messaggi a clienti non dovrebbe farlo “in autonomia” senza guardrail.

Un approccio molto pulito è:

- lasciare `query` sempre eseguibile;
- richiedere **approvazione umana** per `mutate`.

Così puoi progettare tool che non verranno mai eseguiti se non dopo un passaggio esplicito di conferma, mantenendo l’esperienza coerente nei diversi canali (terminal, Slack, ecc.).

Questo è uno dei punti che distingue un esperimento da un agente “da produzione”.

---

## 7) Realtime e WebSocket: canali più “nativi”
Quando il requisito è realtime (voice, streaming, presenza, co-editing), HTTP non basta. Eve tratta anche canali più avanzati come primitivi da implementare: l’idea è che tu possa costruire un channel WebSocket per:

- ricevere eventi in tempo reale;
- fare debounce/aggregazione dei messaggi;
- gestire sessioni.

Non significa che sostituisca ogni prodotto specializzato (connector marketplace, voice stack, ecc.), ma il modello è: **i mattoni di base ci sono** e puoi integrarli senza cambiare paradigma.

---

## 8) Migliorare nel tempo: eval come test suite dell’agente
Il problema più sottovalutato sugli agenti è la regressione: cambi due righe di istruzioni e improvvisamente il bot “perde colpi” su casi che prima funzionavano.

Eve affronta questo con una feature di primo livello: **eval**.

L’idea è molto semplice: invece di testare a mano (“provo tre prompt e vedo”), scrivi eval che simulano interazioni e controllano l’output.

### Due modalità tipiche
- **Check deterministici**: ad esempio “la risposta deve contenere ‘New York City’”.
- **LLM-as-judge**: un valutatore basato su modello che controlla significato/aderenza semantica, utile quando non puoi ridurre tutto a string matching.

C’è un dettaglio importante: l’eval diventa anche il modo in cui puoi costruire una pipeline di qualità, e potenzialmente esportarla verso provider esterni specializzati in valutazione.

---

## Sintesi e implicazione pratica
Eve spinge una direzione chiara: **agenti come artefatti software completi**, non come prompt. File system dichiarativo, canali come superfici di prodotto, tool/connection per integrare dati reali, approvazioni per azioni rischiose, osservabilità per debuggare, e eval per misurare la qualità con disciplina.

Se stai pensando a un agente “da mettere davvero in mano a un team” (supporto, sales ops, internal tooling, automazioni), la domanda utile non è “risponde bene?”, ma: *posso distribuirlo, osservarlo, controllarlo e testarlo come faccio con qualsiasi altra parte della mia piattaforma?* Con questa lente, la struttura a cartelle, i canali e le eval non sono dettagli: sono la differenza tra demo e prodotto.
