---
title: "Perché sto scegliendo Pi (e come lo sto configurando) al posto dei “coding agent” monolitici"
subtitle: "Un harness minimale, estendibile e davvero controllabile: modelli locali o in abbonamento, sessioni “versionate”, comandi rapidi e contesto di progetto."
description: "Pi è un agent harness da terminale che punta su minimalismo e personalizzazione: pochi tool di base (file + bash), gestione delle sessioni con branching, scelta rapida dei modelli, contesto persistente tramite agent.md e un sistema di “skills” installabili. In questo articolo vediamo come partire, come evitare frizioni comuni e quali funzioni cambiano davvero il flusso di lavoro frontend."
publishedAt: 2026-06-23
tags: ["agent da terminale","gestione sessioni LLM","modelli locali","prompt engineering","skills personalizzate"]
---
Negli ultimi mesi gli “agent per codice” sono diventati sempre più ambiziosi: integrazioni ovunque, modalità di pianificazione, sub-agent, checklist automatiche, workflow preconfezionati. Comodo… finché non ti accorgi che stai lavorando **dentro** lo strumento invece che con lo strumento.

Pi va nella direzione opposta: è un *agent harness* estremamente minimale, pensato per essere **plasmato** sul tuo modo di lavorare. E proprio questa scelta architetturale (pochi mattoni, ben combinabili) è ciò che lo rende interessante per chi fa frontend e vive tra repository, terminale, bundler, test e refactor rapidi.

Di seguito trovi una panoramica pratica di ciò che conta davvero: installazione, collegamento dei modelli, comandi che migliorano il daily workflow e i punti in cui Pi “stacca” dai tool più pesanti.

---

## Cos’è Pi, in una frase
Pi è un’interfaccia da terminale per lavorare con modelli LLM come agent, con un set di tool essenziale (leggere/modificare file ed eseguire comandi bash) e con un focus forte su **sessioni, scorciatoie e personalizzazione**.

La differenza chiave rispetto a harness più “tutto incluso” è che Pi parte volutamente scarno: niente integrazioni preinstallate, niente modalità “plan”, niente to-do list automatica, niente sottosistemi complessi. Se ti servono funzionalità extra, le aggiungi tu.

---

## Installazione e avvio
L’installazione è pensata per essere diretta via npm.

Una volta installato, l’avvio è immediato: lanci `pi` nel terminale e ti ritrovi in una UI testuale con:

- area di input per i prompt
- una serie di **slash command** per gestire configurazioni, sessioni e tooling

Il primo ostacolo tipico è che all’inizio non hai alcun modello configurato: al primo prompt riceverai un errore che ti chiede di impostare un provider.

---

## Collegare un modello: abbonamento o API key (o locale)
Pi supporta più modalità di accesso ai modelli:

- **Provider in abbonamento** (es. login tramite servizi che già usi)
- **API key**
- **Modelli locali** (se hai già un setup locale)

Una volta effettuato l’accesso a un provider, il passaggio operativo successivo è scegliere il modello attivo:

- comando di selezione modello (es. `/model`)
- test rapido con un prompt semplice per verificare che risponda correttamente

Per chi fa frontend, il valore qui è evidente: puoi alternare un modello “cheap & fast” per tasks ripetitivi (rinomina, refactor, scaffolding) e un modello più capace per debugging complesso o analisi architetturali.

---

## Perché il minimalismo di Pi è un vantaggio (non una mancanza)
Pi include di base soltanto:

1. lettura file
2. modifica file
3. comandi bash

Sembra poco, ma nella pratica è già il 90% di ciò che ti serve in un progetto:

- leggere componenti/route/config (`vite.config`, `tsconfig`, `eslint`, ecc.)
- modificare file con patch mirate
- lanciare test, lint, build, typecheck

E per il resto? In un ambiente dev reale, moltissime “integrazioni” che altri tool vendono come feature sono già eseguibili via CLI (git incluso). Il punto non è avere mille bottoni, ma avere un flusso **coerente e prevedibile**.

---

## Comandi fondamentali che migliorano subito il workflow
### 1) Nuova sessione pulita
Quando vuoi azzerare il contesto e ripartire:

- comando per creare una sessione nuova (es. `/new`)

Utile quando passi da “debug di un bug CSS” a “refactor di un hook React” senza trascinarti dietro conversazioni vecchie.

### 2) Referenziare file con autocomplete
Puoi inserire file nel prompt usando `@` con autocomplete dei file del progetto.

Questo riduce drasticamente la frizione rispetto al copia-incolla e, soprattutto, ti costringe a una buona abitudine: **ancorare le richieste al codice reale**.

### 3) Eseguire comandi shell: `!` e `!!`
Pi distingue molto bene tra comando “visibile al modello” e comando “solo per te”:

- `!comando` esegue il comando e **invia l’output al modello**
- `!!comando` esegue il comando ma **non invia nulla al modello**

È una differenza enorme per privacy e controllo.

Esempi pratici:

- `!npm test` se vuoi che l’agent interpreti il fallimento e proponga fix
- `!!ls` o `!!cat .env` se stai solo ispezionando qualcosa che non deve finire nel contesto

### 4) Switch rapido tra modelli e “thinking mode”
Pi permette di:

- ciclare tra modelli con shortcut (avanti/indietro)
- cambiare la modalità di “pensiero” (es. da minimal a high)

Questo si traduce in una cosa concreta: **non devi scegliere un unico modello “per tutto”**. Puoi cambiare marcia in base al task.

#### Limitare i modelli nel ciclo (scoped models)
Se hai molti modelli disponibili, ciclare tra tutti è rumoroso.

Pi consente di “scopare” (limitare) la lista ai modelli che vuoi alternare: selezioni 2–3 modelli e lo switch diventa immediato e sensato.

---

## Gestione sessioni: la funzione che fa davvero la differenza
Molti strumenti trattano la chat come un flusso lineare. Pi, invece, mette al centro la sessione come oggetto *navigabile*.

### Vedere info della sessione
C’è un comando per ispezionare i dettagli della sessione corrente: messaggi, token, storage, e anche costi se stai usando un modello a pagamento.

### Riprendere sessioni precedenti
Con un comando di resume puoi saltare tra sessioni passate e riprendere un contesto senza ricostruirlo.

### Tree view e branching della conversazione
La parte più potente è la vista ad albero: puoi tornare a un punto precedente della conversazione e creare un ramo alternativo.

È perfetto quando:

- il prompt era quasi giusto ma non del tutto
- vuoi provare due strategie di refactor
- vuoi confrontare due approcci (es. “soluzione TypeScript stricter” vs “fix minimo”) senza perdere lo storico

### Clone vs Fork (due concetti diversi)
- **Clone**: duplica la sessione nello stato attuale
- **Fork**: crea una nuova sessione partendo da un punto precedente scelto

Sono strumenti da “version control” applicati alla conversazione: incredibilmente utili in debugging e sperimentazione.

### Compact: ridurre contesto
Quando una sessione diventa lunga, hai un comando per compattare e ridurre il consumo di contesto.

---

## Contesto di progetto: `agent.md` e system prompt minimale
Pi carica automaticamente un file `agent.md` se presente.

Questo file è perfetto per mettere:

- stack e convenzioni (React + TS, ESLint rules, styling approach)
- struttura cartelle
- linee guida (accessibilità, naming, patterns)
- obiettivi del progetto

Puoi avere:

- un `agent.md` **per progetto**
- oppure un contesto “globale” nella home (se vuoi uno standard personale)

Inoltre è possibile sovrascrivere il system prompt con un file dedicato, ma il sistema di base è volutamente minimale: spesso non serve toccarlo.

---

## Skills: estendere Pi senza trasformarlo in un mostro
Pi supporta “skills” installabili (locali al progetto o globali). Se sono presenti, vengono rilevate automaticamente.

L’idea è semplice: invece di avere 50 feature sempre attive, installi solo ciò che ti serve (ad esempio una skill per documentazione, scaffolding, analisi del codice, ecc.). L’invocazione è tipicamente del tipo:

- `/skill <nome-skill> ...`

Questa impostazione è coerente con la filosofia di Pi: **base piccola, estensioni mirate**.

---

## Controllo dell’esecuzione: interrompere e accodare comandi
Due dettagli che sembrano minori e invece impattano tantissimo l’uso quotidiano:

- puoi **abortire** l’esecuzione in corso (utile se sta prendendo una direzione sbagliata)
- puoi inviare un messaggio tipo “stop” mentre sta lavorando: verrà recepito appena finisce le tool call correnti

E soprattutto:

- `Enter` tende a interrompere il prima possibile
- una combinazione tipo `Alt+Enter` permette di **accodare** un comando da eseguire *dopo* che l’agent ha finito ciò che stava facendo (es. “quando hai finito di leggere i file, riassumi”)

Questo rende l’interazione molto più simile a un workflow da terminale evoluto, non a una chat.

---

## In pratica: quando Pi conviene davvero
Pi brilla se vuoi:

- un agent da terminale **controllabile**
- alternare velocemente modelli (anche locali) per ottimizzare costi/latency
- sessioni “versionate” con branching per esplorare soluzioni
- contesto di progetto dichiarativo (`agent.md`)
- estensioni selettive via skills

Se invece cerchi un prodotto con tutto preconfigurato e una “modalità autopilota” ricca di feature pronte, Pi potrebbe sembrarti troppo essenziale.

---

## Sintesi conclusiva
Pi punta su una scelta netta: meno magia, più leve. Il risultato è un agent harness che si inserisce bene nel flusso di lavoro frontend reale (repo + CLI + test + refactor), mantenendo **separazione** tra ciò che vuoi condividere col modello e ciò che deve restare locale, e offrendo una gestione delle sessioni che somiglia più a un controllo versione che a una chat lineare.

Se l’obiettivo è avere un assistente che si adatta al tuo progetto (e non il contrario), partire da un nucleo minimale e costruire solo ciò che serve è spesso la strategia più sostenibile.
