---
title: "WebMCP in pratica: un “adapter” per far parlare gli agenti AI con le web app (senza DOM scraping)"
subtitle: "Dalla prenotazione viaggi ai test E2E: strumenti registrati con schema, scoperta automatica e flussi più robusti in linguaggio naturale."
description: "WebMCP può essere visto come un livello di adattamento standardizzato tra agenti AI e applicazioni web. Invece di affidarsi a DOM scraping e simulazioni fragili dei flussi utente, espone “tool” descritti da nome, descrizione e schema, rendendoli scopribili e invocabili dagli agenti quando serve. Questo approccio è interessante sia per semplificare journey complessi (es. prenotazioni internazionali con regole su visti, transiti e bagagli) sia per rendere i test UI meno flaky, definendo i casi in linguaggio naturale e riducendo la manutenzione."
publishedAt: 2026-07-20
tags: ["WebMCP","agenti AI","testing E2E","schema tools","prenotazioni viaggi"]
---
Nel frontend moderno stiamo assistendo a un cambio di paradigma: non si tratta più solo di automatizzare clic e compilazioni, ma di permettere a un agente di *capire* cosa può fare un’applicazione e di *interagire* con essa in modo affidabile.

In questo contesto, WebMCP (Web Model Context Protocol) è particolarmente interessante perché può essere interpretato come un **adapter standard** tra agenti AI e web app. L’idea di fondo è semplice: invece di lasciare l’agente a “indovinare” come muoversi nell’interfaccia, gli si offre un set di capacità esplicite, strutturate e scopribili.

## Il problema: automazione come guesswork
Chiunque abbia messo mano a un’automazione UI conosce bene i sintomi:

- dipendenza da **selettori DOM** che cambiano (e test che diventano flaky),
- simulazioni di flusso utente fragili, basate su dettagli implementativi,
- scraping e inferenza “a tentativi” per capire cosa fare dopo.

Il punto non è che queste tecniche siano sempre sbagliate, ma che spesso fanno affidamento su **segnali instabili**. Appena cambia un attributo, un layout o una gerarchia di componenti, l’automazione si rompe.

## Cos’è WebMCP: un adapter per esporre tool all’agente
WebMCP si presta a un approccio diverso: **l’app registra i propri strumenti (tool)** tramite un’interfaccia di contesto del modello.

In pratica, lo sviluppatore descrive ciascun tool con:

- **nome**
- **descrizione**
- **schema** (il contratto: input/output attesi)

A quel punto, l’agente può:

1. **scoprire** quali tool sono disponibili,
2. **scegliere** il tool giusto quando serve,
3. **invocarlo** rispettando uno schema, quindi con una semantica stabile.

È qui che avviene la svolta: invece di “capire” l’app guardando il DOM, l’agente interagisce con **capacità dichiarate**.

## Impatto sul frontend: meno fragilità, più semantica
Dal punto di vista di chi costruisce prodotti web, questo significa spostare l’integrazione da:

- *UI come superficie da imitare* (clic, selettori, timing)

verso:

- *UI come insieme di azioni e intenti* (prenota, calcola prezzo, verifica regole, recupera opzioni).

Il risultato potenziale è un’interazione più robusta: se cambi la UI ma mantieni lo stesso tool contract, l’agente non deve “reimparare” tutto.

## Caso d’uso 1: journey complessi (prenotazioni internazionali)
Un esempio classico di complessità è la prenotazione di un volo internazionale: entrano in gioco vincoli e regole che vanno oltre la semplice selezione di una tratta.

- requisiti di **visto**
- regole di **transito**
- policy su **bagagli** e restrizioni

Orchestrare questi aspetti “a occhio” tramite scraping e navigazione dell’interfaccia è oneroso e soggetto a errori. Con un approccio tool-based, invece, l’app può esporre azioni mirate (es. validazione vincoli, recupero regole, suggerimento opzioni) e l’agente può comporre un flusso più naturale, riducendo la complessità percepita dall’utente.

## Caso d’uso 2: test E2E meno flaky, più espressivi
Un altro ambito dove un adapter standard fa la differenza è il testing.

Molti test E2E oggi dipendono da:

- selettori fragili,
- attese temporali,
- micro-dettagli del rendering.

Se invece si riesce a descrivere i casi di test in modo più vicino all’intento (“prenota un volo A/R con bagaglio in stiva”, “verifica che una tratta con transito X richieda Y”), l’automazione può diventare:

- **più mantenibile** (meno refactoring quando cambia il layout),
- **più leggibile** (casi in linguaggio naturale/intent-driven),
- **più resiliente** (meno accoppiamento al DOM).

Non è magia: serve comunque progettare bene i tool e i contratti. Ma sposta l’investimento dove rende di più: sulla semantica del prodotto, non sui dettagli della UI.

## Come pensarla in ottica architetturale
Per un team frontend, l’adozione di un modello “tool + schema” suggerisce alcune buone pratiche:

- **Definire azioni stabili**: nominare i tool in modo coerente e orientato al dominio (non ai componenti).
- **Curare lo schema**: contratti chiari riducono ambiguità e regressioni.
- **Separare UI e capability**: la UI può evolvere, le capability restano.

In sostanza, è una forma di API-izzazione dell’esperienza: non si espongono endpoint “tecnici”, ma azioni di prodotto.

## Sintesi e implicazione pratica
WebMCP è interessante perché propone un modo pragmatico per ridurre il “guesswork” nell’automazione e nell’interazione agente–app: **meno scraping e simulazioni fragili**, più **tool dichiarati** con **schema** e **scoperta**.

Se state lavorando su flussi ad alta complessità (checkout articolati, configuratori, prenotazioni, onboarding con molte regole) o se i vostri test E2E soffrono di flakiness cronica, vale la pena ragionare in questi termini: quali intenti di dominio possono diventare tool stabili? Rendere esplicite quelle capacità spesso è il primo passo per un prodotto più semplice da usare, più facile da testare e meno costoso da mantenere nel tempo.
