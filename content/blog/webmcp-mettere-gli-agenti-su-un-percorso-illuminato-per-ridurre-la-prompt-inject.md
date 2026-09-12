---
title: "WebMCP: mettere gli agenti su un “percorso illuminato” per ridurre la prompt injection sul web"
subtitle: "Dalla lettura “a vista” del DOM alle tool call esplicite: un cambio di modello che migliora affidabilità e sicurezza."
description: "WebMCP propone un modo standard per esporre strumenti agli agenti direttamente dalle pagine web, con sintassi dichiarativa in HTML o imperativa in JavaScript. L’obiettivo è spostare gli agenti dalla raccolta opportunistica di informazioni (DOM scraping, accessibility tree, screenshot) verso interazioni intenzionali e confinabili, riducendo la superficie d’attacco di prompt injection e “agent trap” nascoste in contenuti effimeri o user-generated."
publishedAt: 2026-06-16
tags: ["WebMCP","prompt injection","sicurezza agenti","tool calling","contenuti UGC"]
---
Negli ultimi mesi è diventato evidente un problema: chiediamo sempre più spesso agli agenti di “capire” una pagina web, ma i metodi con cui la interpretano oggi sono spesso fragili e, soprattutto, esposti ad attacchi.

Molti agenti recuperano contesto **scrapando il DOM**, leggendo l’**accessibility tree** o addirittura analizzando **screenshot**. Questa modalità “a vista” funziona finché la pagina è benigna, ma apre la porta a una famiglia di vulnerabilità note come **prompt injection**: istruzioni nascoste nel contenuto che inducono l’agente a comportarsi in modo non desiderato.

In questo scenario si inserisce **WebMCP**, uno standard pensato per fornire agli agenti un modo più esplicito (e più controllabile) di interagire con il web.

## Cos’è WebMCP, in pratica
WebMCP punta a diventare un livello “di base” per esperienze agentiche sul web: invece di costringere un agente a ricostruire intenzioni e dati osservando tutta la pagina, il sito **espone degli strumenti (tools)** che l’agente può invocare.

Un aspetto interessante è che WebMCP offre due modalità di integrazione:

- **Sintassi dichiarativa**: si possono **annotare porzioni di HTML** per rendere esplicito cosa è rilevante per un agente.
- **Sintassi imperativa**: si può aggiungere la logica via **JavaScript**, esponendo strumenti richiamabili programmaticamente.

Il punto non è “aggiungere API in più”, ma cambiare modello: l’agente non è più costretto a inferire tutto dal rendering; viene guidato verso un set di operazioni che **lo sviluppatore intende supportare**.

## Perché aiuta contro la prompt injection
Se un agente ottiene contesto leggendo *tutto* (DOM, albero accessibilità, immagini), può imbattersi in contenuti che non sono pensati per lui:

- istruzioni inserite in testi apparentemente innocui;
- contenuti effimeri (banner, tooltip, sezioni nascoste);
- metadati o descrizioni “furbe” infilate dove l’agente arriva prima dell’utente.

Questa è la logica delle cosiddette **agent trap**: il web diventa un campo minato dove un agente può essere “convinto” a seguire istruzioni che l’utente non ha mai approvato.

Le **tool call via WebMCP** spostano invece l’agente su un **percorso intenzionale e confinato**: ciò che legge e ciò che può fare passa attraverso strumenti esplicitamente esposti. In altre parole, il sito gli offre una strada “ben illuminata” e riduce la necessità di esplorare aree ambigue.

## Un esempio tipico: UGC e siti di recensioni
Uno scenario concreto è quello dei siti con **contenuti generati dagli utenti (UGC)**, ad esempio una pagina di recensioni.

Se chiunque può caricare testo o immagini, diventa realistico che qualcuno inserisca in un’immagine (o nel suo contesto) una prompt injection: una frase o un pattern pensato per essere letto dall’agente, non dall’utente.

Con WebMCP, l’idea è poter esporre strumenti con **vincoli espliciti**, ad esempio:

- un tool di lettura con **hint “read-only”**, che consenta all’agente di acquisire informazioni senza eseguire azioni;
- un set di strumenti separato per operazioni “impattanti” (azioni, acquisti, invii), invocabile solo in condizioni più controllate.

## Verso un’architettura a due percorsi
Un’evoluzione naturale di questo approccio è una **separazione netta** tra:

1. **Percorso di lettura**: recupero contenuti e contesto in modo confinato, senza side effect.
2. **Percorso di azione**: chiamate che possono modificare stato o produrre effetti reali, soggette a policy più rigide.

Pensare in questi termini aiuta a progettare interfacce agentiche più sicure: prima si “capisce”, poi si agisce, e le due fasi non devono condividere lo stesso canale permissivo.

## Stato attuale e implicazioni per chi sviluppa frontend
WebMCP è in fase di sperimentazione (tramite programmi di prova) e si sta lavorando per arrivare a una disponibilità più ampia. Anche senza entrare nei dettagli di implementazione, il messaggio per chi costruisce prodotti web è già chiaro:

- se vuoi che un agente interagisca col tuo sito, **non affidarti alla lettura opportunistica del DOM** come unico canale;
- progetta un’interazione **intenzionale**: cosa può leggere? cosa può fare? in quali condizioni?
- tratta l’UGC come superficie d’attacco anche “per gli agenti”, non solo per gli utenti.

## Sintesi
WebMCP propone un cambio di paradigma: dagli agenti che “scrutano” il web come un utente (ma con più probabilità di farsi ingannare), agli agenti che seguono strumenti espliciti e confinati. È un approccio che riduce la superficie di prompt injection e rende più chiaro il contratto tra pagina, utente e agente.

Se stiamo andando verso un web dove gli agenti diventano un canale primario di interazione, standardizzare **cosa** un agente può fare e **come** può farlo non è solo un’ottimizzazione: è un requisito di sicurezza.
