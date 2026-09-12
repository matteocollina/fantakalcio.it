---
title: "Un loop di feedback “chiuso” con Chrome DevTools: far debuggare l’agente sul runtime (non sui file)"
subtitle: "Con source map, console e Network, l’agente osserva l’app mentre gira, riproduce l’errore e risale al punto giusto del codice per correggerlo davvero."
description: "Per ottenere correzioni affidabili da un coding agent, conviene spostare il focus dal “cerca in questi file” al “riproduci il bug nel runtime”. Con Chrome DevTools per agenti l’assistente può aprire una vera istanza di Chrome, eseguire un flusso end-to-end (es. signup), raccogliere console log e richieste di rete, usare le source map per risalire ai sorgenti corretti e chiudere il cerchio con una fix verificata."
publishedAt: 2026-07-07
tags: ["chrome-devtools","debugging-runtime","source-map","network-panel","coding-agent"]
---
Nel debugging frontend c’è un dettaglio che fa la differenza tra una correzione “plausibile” e una correzione **vera**: dove guardiamo per capire cosa sta succedendo.

Molti flussi con agenti di coding partono da richieste del tipo: “apri quel file e controlla quella funzione”. È un approccio familiare, ma spesso inefficace quando il problema emerge **solo a runtime**: una validazione che scatta in modo inatteso, una richiesta di rete che fallisce, un errore in console che compare dopo una certa sequenza di azioni.

Un’alternativa più solida è ribaltare la prospettiva: **non chiedere all’agente di leggere file, chiedergli di osservare l’app in esecuzione**. Questo crea un *closed feedback loop*: l’agente riproduce il bug, raccoglie segnali diagnostici, risale alla causa e verifica la correzione ripetendo lo scenario.

## Dal “cerca nei file” al “guarda il runtime”
L’idea è semplice: invece di guidare l’agente verso un punto del repository (“controlla `SignupForm.tsx`”), lo si guida verso un **comportamento** (“vai su `/sign-up`, prova a registrarti con queste credenziali e sistema l’errore”).

Quando l’agente ha accesso a Chrome DevTools, può:

- aprire l’app in una **vera istanza di Chrome**;
- eseguire lo scenario end-to-end (click, input, submit);
- catturare **errori in console**, stack trace e warning;
- osservare richieste nel **Network panel** (status code, payload, response, timing);
- e soprattutto sfruttare le **source map** per collegare ciò che accade nel browser al file sorgente corretto.

Questo ultimo punto è cruciale: anche se l’agente parte dal runtime, non resta “bloccato” sul codice buildato o minificato. Le source map gli consentono di **risalire comunque ai sorgenti** e proporre una patch mirata.

## Un prompt orientato al bug (esempio concreto)
Un prompt efficace in questo approccio non nomina file o componenti: descrive un percorso riproducibile e un risultato atteso.

Esempio:

- vai su `http://localhost/sign-up`
- prova a registrarti con username `test` e password `1234`
- riproduci l’errore
- individua la causa usando console e rete
- applica la fix e verifica che la registrazione funzioni

È un prompt “operativo”: dice *cosa fare* e *come verificare*.

## Perché questo approccio funziona meglio
### 1) Riduce le ipotesi
Quando si lavora solo sui file, l’agente tende a inferire molto: “forse la validazione è qui”, “forse la chiamata è sbagliata”. Guardando il runtime, invece, l’errore lascia tracce: stack trace, response body, header, redirect, CORS, ecc.

### 2) Unisce segnali diversi in un’unica diagnosi
Un errore di signup può nascere da punti diversi:

- UI: validazione client che blocca il submit;
- rete: endpoint errato o payload non conforme;
- auth/session: cookie, CSRF, redirect;
- build/config: variabili d’ambiente sbagliate.

Console e Network, letti insieme, aiutano a evitare fix parziali (es. “aggiungo un `try/catch`”) che mascherano il sintomo senza risolvere la causa.

### 3) La fix si valida dentro lo stesso loop
Il vantaggio di un loop “chiuso” è che non finisce con la patch: finisce con una **ripetizione dello scenario**. Se dopo la modifica il flusso di registrazione passa, hai una confidenza molto più alta che la correzione sia reale e non solo coerente a livello di codice.

## Implicazione pratica: progettare prompt verificabili
Se vuoi sfruttare davvero un agente con DevTools, scrivi prompt con queste caratteristiche:

- **Percorso preciso** (URL, pagina, sequenza di azioni);
- **Dati di input** (credenziali, valori dei campi, condizioni); 
- **Criterio di successo** (cosa significa “funziona”: redirect, messaggio, status 200, cookie creato);
- **Richiesta esplicita di evidenze** (console + network) prima di cambiare codice.

## Sintesi
Un agente che “legge il codice” può aiutare; un agente che **osserva l’app mentre gira** e usa DevTools può chiudere un ciclo completo: riproduzione → diagnosi → patch → verifica. Spostare il focus dal repository al runtime, sfruttando source map, console e Network, è spesso il modo più rapido e affidabile per arrivare a una fix corretta—specialmente sui bug che emergono solo nell’esperienza reale dell’utente.
