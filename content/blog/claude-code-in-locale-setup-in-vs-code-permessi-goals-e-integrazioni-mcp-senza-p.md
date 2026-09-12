---
title: "Claude Code in locale: setup in VS Code, permessi, Goals e integrazioni MCP (senza perdersi nei dettagli)"
subtitle: "Una guida pratica per frontend dev: dall’installazione alla gestione dei task autonomi, con attenzione a sicurezza, struttura progetto e workflow Git."
description: "Claude Code può lavorare direttamente dentro la tua repo: crea e modifica file, pianifica refactor, esegue comandi e si collega a tool esterni via MCP. In questo articolo vediamo come impostarlo in VS Code, come ragionare su permessi e modalità operative, e come organizzare un workflow pulito per progetti frontend con Git e deploy."
publishedAt: 2026-08-05
tags: ["claude-code","vs-code-setup","mcp-protocollo","autonomous-goals","permessi-cli","workflow-git"]
---
## Perché Claude Code cambia il modo di lavorare (anche sul frontend)

A differenza di un assistente “in chat”, **Claude Code vive nel tuo progetto**: vede la struttura dei file, crea/modifica sorgenti, può eseguire comandi e aiutarti a portare avanti task completi.

Per un team o un singolo frontend dev significa soprattutto:

- generare rapidamente boilerplate e feature slice (componenti, hook, route, test)
- fare refactor guidati e consistenti (rinomina, estrazione componenti, migrazioni)
- automatizzare operazioni ripetitive (lint/fix, aggiornamenti dipendenze, scaffolding)
- collegarsi a strumenti esterni (issue tracker, chat, CI) tramite **MCP**

Il punto chiave è impostare **bene l’ambiente** e capire **i permessi**: è lì che si decide se diventa un acceleratore o una fonte di caos.

---

## Installazione: la base minima per partire

Claude Code si installa in locale tramite i comandi indicati nella documentazione ufficiale. L’approccio consigliato è l’installazione “nativa” per il tuo sistema operativo.

Dopo l’installazione, hai tre modi tipici per usarlo:

1. **App desktop**: comoda, ma meno flessibile e con meno controllo.
2. **Solo terminale**: potente, ma con meno visibilità sui file e sul contesto del progetto.
3. **IDE (consigliato)**: unisce terminale + file explorer + diff, quindi è il miglior compromesso per sviluppo quotidiano.

Nella pratica, per chi fa frontend la terza opzione è la più naturale.

---

## Setup in VS Code: workflow pulito e ripetibile

### 1) Crea (o apri) una cartella di progetto
In VS Code:

- **File → Open Folder…**
- scegli/crea una cartella (es. `my-app`)

Questo passaggio è più importante di quanto sembri: Claude Code opera **nel contesto della directory** aperta, quindi la qualità del risultato dipende anche dall’ordine del progetto (monorepo, app singola, workspace, ecc.).

### 2) Apri il terminale integrato
In VS Code puoi aprire il terminale dal pannello o via scorciatoia (spesso `Ctrl + \`` / backtick).

Avere terminale e file explorer nello stesso posto ti permette di:

- vedere subito i file creati/modificati
- controllare diff e cronologia
- evitare di “perdere” modifiche in cartelle sbagliate

### 3) Avvia una sessione
Nel terminale, l’avvio è diretto:

```bash
claude
```

Da qui puoi dare istruzioni e far lavorare Claude Code sul filesystem del progetto.

---

## Un esempio concreto: creare file dentro la repo

Una verifica rapida (utile per assicurarti che stai operando nella directory corretta) è chiedere di creare un file di esempio.

In pochi secondi dovresti vedere:

- il nuovo file comparire nell’explorer
- il contenuto scritto dentro

Se i file finiscono “da un’altra parte”, quasi sempre è perché:

- non hai aperto la cartella giusta in VS Code
- il terminale non è posizionato nella directory corretta

---

## Riprendere e chiudere sessioni: controllo del contesto

Nello sviluppo reale capita di interrompere e riprendere. Claude Code supporta la ripresa di sessioni recenti:

- chiusura: tipicamente con `Ctrl + C` (o chiudendo la sessione dal terminale)
- ripresa: comando slash dedicato, ad esempio:

```text
/resume
```

Questo è utile quando:

- stavi facendo un refactor a step e vuoi continuare coerentemente
- vuoi recuperare una strategia o un piano senza rispiegare tutto

---

## Modalità e permessi: la parte che ti salva da disastri

Quando un tool può **modificare file ed eseguire comandi**, la domanda non è “se” impostare i permessi, ma “come”. Claude Code lavora con modalità che cambiano il grado di autonomia.

### Plan mode (pianificazione)
- analizza il progetto
- propone un piano
- **non** modifica file e **non** esegue comandi

È perfetta per:

- refactor grossi
- code review
- migrazioni (es. da CRA a Vite, da JS a TS)
- architetture (routing, state management, design system)

### Accept edits (modifiche controllate)
- può creare/modificare file
- per l’esecuzione di comandi può richiedere conferme

Buona per:

- implementazioni guidate
- cambiamenti incrementali con check manuale

### Auto mode (autonomia ragionata)
- può applicare modifiche
- può eseguire comandi con un livello di valutazione/filtri di sicurezza

Utile per:

- cicli rapidi “modifica → lint → test → fix”
- scaffolding di feature (componenti + test + story)

### Bypass permissions (massima libertà)
- modifiche automatiche
- esecuzione comandi senza restrizioni

Ha senso **solo** in ambienti isolati (sandbox, container, VM, repo usa-e-getta). Su una macchina di lavoro con credenziali e accessi reali è una scelta rischiosa.

**Regola pratica per frontend:**
- usa **Plan** per le decisioni architetturali
- usa **Accept edits** per PR “pulite”
- usa **Auto** per task ripetitivi
- evita **Bypass** a meno che tu non sia in un ambiente sacrificabile

---

## Goals: task autonomi, ma con obiettivi chiari

Quando si parla di “autonomous tasks”, la differenza la fa come scrivi l’obiettivo.

Un buon *goal* per un progetto frontend non è “aggiungi la feature X”, ma qualcosa del tipo:

- “Aggiungi una nuova route `/settings` con layout esistente, form validato, test e aggiornamento navbar”
- “Migra i componenti `Button` e `Input` a varianti, aggiorna tutte le occorrenze e assicurati che i test passino”

Più l’obiettivo è:

- verificabile (test, build, lint)
- confinato (cartelle, pattern, convenzioni)
- compatibile con la tua architettura

…più l’autonomia produce risultati utili e meno rumore.

---

## MCP (Model Context Protocol): collegare tool esterni senza impazzire

MCP serve a connettere Claude Code a strumenti remoti o locali (CLI e servizi) in modo strutturato.

Tradotto in workflow:

- puoi integrare tool che già usi (issue tracking, comunicazione, automazioni)
- puoi far eseguire operazioni “di contesto” oltre la repo (ad esempio recuperare dettagli di un ticket o sincronizzare informazioni)

Il valore per un frontend dev è soprattutto nella **riduzione dei passaggi manuali**: meno copia-incolla tra tool, più continuità tra specifica e implementazione.

---

## Git e deploy: l’ultimo miglio conta

Quando Claude Code tocca file e comandi, il tuo paracadute è sempre lo stesso:

- commit piccoli e frequenti
- diff chiari
- branch per feature

Se il progetto deve arrivare in produzione, tratta l’autonomia come un acceleratore di esecuzione, non come un sostituto del controllo:

- fai passare lint e test
- verifica build e bundle
- controlla regressioni UI (anche solo con screenshot/preview)

---

## Sintesi finale: come usarlo davvero bene nel quotidiano

Claude Code dà il meglio quando lavori in un ambiente ben definito: **progetto aperto correttamente in VS Code, permessi scelti con criterio, obiettivi scritti in modo verificabile**, e Git come rete di sicurezza.

Se lo imposti così, diventa un compagno operativo credibile: non “magia”, ma un sistema che ti fa risparmiare tempo su scaffolding, refactor e iterazioni, lasciandoti più energia per le decisioni architetturali e la qualità del prodotto.
