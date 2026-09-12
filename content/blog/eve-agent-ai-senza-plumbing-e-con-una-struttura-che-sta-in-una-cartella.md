---
title: "eve: agent AI senza “plumbing” (e con una struttura che sta in una cartella)"
subtitle: "Canali, connessioni, schedule, skill e tool: la parte noiosa diventa infrastruttura riusabile, mentre tu ti concentri sul comportamento dell’agente."
description: "Costruire un agente utile non significa solo scrivere prompt e tool: significa gestire canali (Slack/Teams/SMS), credenziali, job schedulati, approvazioni umane, retry e osservabilità. eve propone un approccio “directory-first”: una struttura standard che separa chiaramente canali, connessioni, schedule, skill e tool, con esecuzione isolata, workflow checkpointati e gate di approvazione integrati. Risultato: meno scaffolding ripetuto e più tempo sul prodotto."
publishedAt: 2026-08-03
tags: ["agenti-ai","vercel-workflows","sandbox-esecuzione","mcp-openapi","approvazione-humans-in-the-loop","osservabilita-costi"]
---
Costruire un agente AI “vero” (quello che lavora in produzione, non una demo in locale) raramente fallisce per il prompt. Fallisce perché prima ancora di rispondere al primo utente bisogna mettere in piedi una quantità di infrastruttura ripetitiva: canali di ingresso, autenticazione verso servizi esterni, runtime sicuro, job schedulati, gestione dei crash e — soprattutto quando si parla di denaro — un flusso di approvazione umana.

Il punto è che tutto questo *non è* il tuo agente. È lo scaffolding che ogni agente finisce per richiedere.

## Il problema: lo “scaffolding” che ti porti dietro per sempre
Immagina un classico agente di supporto:

- risponde ai clienti (in Slack, Discord, Teams…)
- consulta l’account e lo stato di fatturazione
- esegue rimborsi quando dovuti
- invia un riepilogo ogni mattina

Sembra lineare, finché non provi a implementarlo davvero. Prima della prima risposta devi tipicamente affrontare:

- un’integrazione Slack completa (token, signing secret, webhooks, gestione eventi)
- autenticazione verso il provider di billing (e gestione credenziali in modo sicuro)
- un ambiente di esecuzione affidabile dove far girare tool e logica
- uno scheduler (cron) per i riepiloghi
- resilienza: cosa succede se “si rompe” a metà conversazione?
- human-in-the-loop: nessun rimborso dovrebbe partire senza una revisione/approvazione

Questa parte è costosa, ripetitiva e tende a moltiplicarsi team per team e agente per agente.

## L’idea di eve: l’agente come una directory standard
eve ribalta l’approccio: invece di costruire ogni volta il plumbing, ti dà una struttura standard dove lo scaffolding è già previsto e il tuo lavoro si concentra su *cosa* deve fare l’agente.

In pratica l’agente diventa una cartella con:

- `instruction.md` alla root
- cinque directory:
  - `channels/`
  - `connections/`
  - `schedules/`
  - `skills/`
  - `tools/`

La scelta è interessante anche per chi fa frontend e piattaforme: è un design “config-as-code” leggibile, versionabile, reviewabile via PR e con confini chiari tra responsabilità.

## Cosa fa ogni cartella (con esempi concreti)
### 1) `channels/`: dove gli utenti parlano con l’agente
Qui definisci i punti di contatto. In uno scenario Slack, l’integrazione può essere ridotta a un singolo file, senza dover gestire a mano token, segreti di firma o codice webhook.

E la cosa più pratica è l’estendibilità: aggiungere un nuovo canale (Discord, Teams, Telegram, SMS) segue lo stesso pattern — “un file per canale” — invece di un progetto separato con convenzioni diverse.

### 2) `connections/`: integrazioni e credenziali, senza esporle al modello
Le connessioni incapsulano l’accesso a servizi esterni (billing, CRM, ticketing) tramite interfacce come MCP o OpenAPI. Il vantaggio chiave è la separazione tra:

- **modello/contesto conversazionale**
- **credenziali e chiamate reali**

In altre parole: il modello non “vede” segreti, token o chiavi. È un dettaglio architetturale che riduce la superficie d’attacco e rende più sostenibile la compliance.

### 3) `tools/`: codice eseguibile, isolato
I tool sono funzioni (ad esempio in TypeScript) per operazioni come “recupera account”, “calcola credito”, “verifica piano”. L’esecuzione avviene in un ambiente isolato (sandbox), così che il codice abbia confini più chiari e si limiti ciò che può fare in caso di input malevolo o bug.

Per chi sviluppa prodotti: è un modo pulito per trasformare “azioni” in primitive affidabili, testabili e osservabili.

### 4) `schedules/`: automazioni e cron senza infrastruttura ad hoc
Il riepilogo del mattino è un classico: serve un cron, un job runner, deploy separati, logging.

Con uno schema a schedule, questa automazione può diventare persino un file Markdown con una cron expression in testa, e una volta deployata diventa un job schedulato in produzione.

### 5) `skills/`: policy e procedure che entrano in contesto solo quando servono
Le “skill” sono istruzioni operative, policy e procedure (spesso lunghe) che l’agente deve seguire: rimborsi, eccezioni, regole di escalation.

Invece di trascinarsi tutte le policy in ogni turno di chat, l’approccio è caricare in contesto solo la skill rilevante quando la conversazione la richiede.

Effetto pratico:

- contesti più leggeri
- meno token sprecati
- minore rischio di confusione tra regole
- comportamento più coerente perché la procedura giusta è “attivata” al momento giusto

## Human-in-the-loop integrato: rimborsi con “Approve/Deny”
Quando l’agente può compiere azioni sensibili (es. rimborsi), non basta dire “chiedi conferma”: serve un *gate tecnico*.

Nel modello proposto, l’azione di rimborso è **gated**: se l’utente chiede un refund in Slack, l’agente non procede automaticamente. Si ferma nel thread e presenta un’azione esplicita di approvazione/negazione (pulsanti). Solo dopo l’approvazione il tool viene eseguito davvero.

Questa è una differenza sostanziale tra “assistente” e “agente”:

- l’assistente suggerisce
- l’agente agisce, ma con guardrail robusti

## Resilienza: workflow checkpointati turno per turno
Le conversazioni reali non sono lineari: timeout, errori di rete, approvazioni che arrivano dopo minuti o ore, tool che falliscono.

Ogni turno può essere gestito come workflow con checkpoint. Se qualcosa si interrompe a metà, non devi ricostruire manualmente lo stato: il flusso riparte dal punto giusto, anche se l’approvazione arriva molto dopo.

Per un team prodotto questo si traduce in meno “edge case” da rincorrere e meno codice di orchestrazione.

## Osservabilità: run, token e costi come parte del ciclo di vita
Un tema spesso sottovalutato: gli agenti non si “monitorano” solo con log generici. Serve tracciare:

- trigger dell’esecuzione
- turni e passaggi
- token in/out
- costo per run

Avere questa telemetria a portata di mano rende possibile ottimizzare prompt/skill e prendere decisioni di prodotto basate sui numeri (ad esempio: quali canali costano di più, quali richieste generano più tool call, dove conviene introdurre caching o regole).

## Implicazione pratica: spostare lo sforzo dal plumbing al comportamento
La promessa, in sostanza, è questa: ciò che oggi costruisci da zero per ogni agente (canali, auth, cron, retry, approvazioni, osservabilità) diventa un set di primitive standard.

Questo cambia la traiettoria del lavoro:

- meno progetti “satellite” per far funzionare un agente
- meno codice di integrazione ripetuto
- più tempo su skill, tool e qualità delle risposte
- rollout più rapido su nuovi canali e nuovi use case

## Sintesi
Se stai valutando un agente AI per supporto, operations o workflow interni, il punto non è “quale modello usare”, ma come rendere affidabili integrazioni, azioni e runtime. Un approccio directory-first come quello di eve mette ordine: separa i canali dalle connessioni, i tool dalle policy, gli schedule dalle conversazioni. E soprattutto introduce guardrail concreti (approvazioni, sandbox, checkpoint, osservabilità) che fanno la differenza tra prototipo e produzione.

Quando lo scaffolding smette di essere un progetto a sé, costruire agenti diventa un’attività di prodotto: si itera sul comportamento, non sulla tubatura.
