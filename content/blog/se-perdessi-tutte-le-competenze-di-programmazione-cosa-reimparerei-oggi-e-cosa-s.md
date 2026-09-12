---
title: "Se perdessi tutte le competenze di programmazione: cosa reimparerei oggi (e cosa smetterei di studiare)"
subtitle: "Una roadmap essenziale per ripartire nel frontend moderno, puntando su fondamentali e strumenti che hanno davvero un ROI."
description: "Se dovessi ricostruire da zero le mie competenze di programmazione, investirei prima nei concetti su cui si appoggia qualunque stack: come funziona un computer, cosa sono controllo di flusso, memoria, file system e quali astrazioni stiamo usando davvero. Molto meno tempo andrebbe invece speso su configurazioni manuali e tooling “di contorno” che oggi è in gran parte automatizzato. Ecco su cosa mi concentrerei nel 2026 per tornare produttivo velocemente nel frontend."
publishedAt: 2026-04-29
tags: ["fondamentali-informatica","javascript-moderno","tooling-frontend","bundler-e-build","roadmap-frontend"]
---
Capita di sentirsi sommersi: framework, librerie, tool di build, configurazioni, “best practice” che cambiano ogni stagione. Se dovessi ripartire da zero **oggi**, con la stessa capacità di ragionare e imparare ma senza alcuna memoria tecnica di programmazione, imposterei una strategia molto semplice:

1. **ricostruire i fondamentali che non scadono**
2. **imparare il minimo necessario per essere produttivo**
3. **evitare di investire tempo in competenze che il tooling moderno ha reso marginali**

Di seguito la mia roadmap ragionata, pensata per chi fa (o vuole fare) frontend.

---

## 1) Prima di tutto: capire “come funziona un computer” (quanto basta)
Non serve diventare ingegneri dei sistemi operativi, ma una base di informatica pratica alza drasticamente la qualità del codice e la velocità con cui si imparano nuove tecnologie.

### Concetti che reimparerei subito
- **Controllo di flusso**: `if/else`, cicli, short-circuit, guard clause. Non perché siano “basilari”, ma perché sono la grammatica di qualunque programma.
- **Stato e memoria (in senso pratico)**: cosa significa *salvare* un valore, come cambia nel tempo, differenza tra dati effimeri (RAM) e persistenti.
- **Persistenza e file system**: cosa vuol dire leggere/scrivere, percorsi, permessi, formati. Anche nel frontend, dove spesso “non tocchi il disco”, la persistenza esiste (storage del browser, cache, DB via API).
- **Input/Output**: ogni app è un ciclo continuo di input (eventi, rete, file) e output (UI, rete, log). Comprendere questo modello rende più naturale progettare.

Questa categoria è il classico “imparalo una volta, ti serve per sempre”.

---

## 2) Un linguaggio, ma imparato bene: JavaScript (e un po’ di TypeScript)
Per ripartire nel frontend moderno sceglierei **JavaScript** come base, con un’introduzione presto a **TypeScript**.

### Cosa conta davvero
- **Tipi e coercioni in JS**: ti evitano bug sottili.
- **Funzioni e scope**: closure, `this` (quanto basta), moduli ES.
- **Asincronia**: `Promise`, `async/await`, gestione errori, concetti di concorrenza “da frontend” (non parallellismo, ma orchestrazione di I/O).
- **Manipolazione dati**: array/object, immutabilità pragmatica, map/reduce/filter senza estremismi.

TypeScript lo introdurrei presto perché accelera il feedback e migliora la comunicazione nel team, ma senza trasformarlo in un esercizio accademico: l’obiettivo è **scrivere UI affidabili** e **integrare API** con meno sorprese.

---

## 3) Il browser come piattaforma: DOM, eventi, rete, performance
Il frontend non è “un framework”: è **il browser**. Se capisci la piattaforma, i framework diventano intercambiabili.

Le aree che reimparerei:
- **DOM e rendering**: cosa succede quando cambi lo stato e la UI si aggiorna.
- **Event loop (a livello intuitivo)**: microtask vs task *quanto basta* per non impazzire con timing e race condition.
- **Rete**: `fetch`, CORS, caching, status code, retry/backoff, gestione errori realistica.
- **Performance fondamentali**: payload, lazy loading, immagini, misure base (TTFB, LCP, CLS). Non serve diventare ossessionati: serve sapere dove guardare.

---

## 4) Cosa NON reimparerei più come priorità: configurazioni “a mano” del tooling
Una delle differenze più nette rispetto a qualche anno fa è che molte competenze di build/configurazione hanno un ritorno sempre più basso.

Esempio tipico: passare settimane a padroneggiare ogni dettaglio di configurazioni complesse (storicamente: bundler e pipeline) **non è più un investimento che ripaga subito** per la maggior parte dei progetti.

### Come mi comporterei oggi
- imparerei **i concetti** (cosa fanno bundler, transpiler, minifier, tree-shaking)
- ma eviterei di mettere al centro **la configurazione manuale** se lo stack offre preset solidi

In pratica: voglio sapere *cosa* succede e *quando* intervenire, non trasformare il build system nel mio prodotto principale.

---

## 5) Un criterio guida: massimizzare il ROI dell’apprendimento
Se stai ripartendo, ogni ora spesa deve aumentare la tua capacità di:
- capire errori e bug
- leggere codice altrui
- consegnare feature
- adattarti a nuovi strumenti

Per questo darei priorità a:
- fondamentali (controllo di flusso, dati, I/O)
- piattaforma (browser)
- asincronia
- debug (DevTools, log, stack trace)

E ridurrei l’investimento iniziale su:
- configurazioni rare e altamente specifiche
- micro-ottimizzazioni premature
- “mode” del momento non sostenute dai fondamentali

---

## Checklist pratica (minimalista) per ripartire in 30 giorni
Se vuoi una traccia molto operativa:

1. **Settimana 1**: JS moderno + controllo di flusso + funzioni + moduli
2. **Settimana 2**: asincronia + rete (`fetch`, error handling) + JSON
3. **Settimana 3**: DOM + eventi + stato UI + basi di performance
4. **Settimana 4**: TypeScript base + una piccola app completa (API → UI) + debug sistematico

Obiettivo: arrivare a costruire una mini-app credibile senza dipendere da configurazioni esoteriche.

---

## Conclusione
Se perdessi tutte le conoscenze di programmazione, non rincorrerei subito tool e configurazioni. Ripartirei dai **meccanismi** che governano i sistemi: controllo di flusso, memoria/stato, I/O e persistenza, più la piattaforma browser.

Il tooling moderno è un acceleratore: ottimo, ma non deve diventare il pilastro del tuo apprendimento. I pilastri sono altrove—e una volta solidi, tutto il resto si rimette in piedi molto più in fretta.
