---
title: "Chrome DevTools 148–150: agent, AI Assistance e nuove utility per debugging e accessibilità"
subtitle: "DevTools for Agents 1.0, pannello AI più operativo, APCA per il contrasto, strumenti WebMCP e piccole migliorie che accelerano il lavoro quotidiano."
description: "Panoramica delle novità introdotte tra Chrome DevTools 148–150: DevTools for Agents arriva alla 1.0 con audit Lighthouse integrati e debugging di estensioni; AI Assistance diventa più concreta con widget e accesso diretto a Lighthouse; arrivano miglioramenti per speculative loads, Network, contrasto APCA, Accessibility Tree, WebMCP e suggerimenti CSS assistiti."
publishedAt: 2026-06-25
tags: ["DevTools for Agents","AI Assistance","Lighthouse audit","Contrasto APCA","WebMCP","Debug CSS"]
---
Tra le versioni 148 e 150, Chrome DevTools porta un pacchetto di aggiornamenti che ruota attorno a tre assi: flussi “agentici” più maturi, un pannello di assistenza AI più orientato all’azione e una serie di miglioramenti mirati per performance, accessibilità e produttività.

Di seguito, le novità più utili da conoscere (e da provare subito) se lavori ogni giorno con DevTools.

## DevTools for Agents 1.0: workflow più affidabili (e verificabili)
Chrome DevTools for Agents raggiunge la **prima release stabile (1.0)**, e il salto di qualità è soprattutto nella **capacità di chiudere il ciclo di feedback**: l’agente non deve “immaginare” l’effetto dei cambiamenti, perché può osservare e verificare direttamente in un browser reale.

### Lighthouse dentro il flusso di lavoro dell’agente
La novità più pratica è la possibilità per gli agenti di eseguire **audit completi Lighthouse** direttamente nel loro workflow. Questo serve a intercettare e correggere:
- regressioni di **accessibilità**
- problemi **SEO**
- violazioni delle **best practice**

Per la performance, restano disponibili gli strumenti più specializzati (ad esempio i tracing), ma il punto è chiaro: con Lighthouse integrato diventa più semplice automatizzare controlli “da checklist” che spesso si saltano nelle iterazioni rapide.

### Una categoria Lighthouse pensata per l’agentic browsing
DevTools for Agents supporta anche una nuova categoria di audit legata all’**agentic browsing**, con verifiche su:
- tool WebMCP
- accessibilità per agenti
- presenza di un potenziale file **LLMS.txt**

### Debug anche delle estensioni Chrome
Un’aggiunta interessante: l’agente può ora **debuggare estensioni**, ispezionando pagine e script specifici a runtime. Per chi lavora su architetture di estensioni non banali (content script, service worker, pagine di opzioni, ecc.) è un abilitatore notevole.

### Tool custom esposti dalla pagina (JavaScript) e riconosciuti dall’agente
Pagine e framework possono esporre **strumenti custom basati su JavaScript** disponibili a runtime. DevTools for Agents li rileva e li rende utilizzabili, permettendo un debugging più diretto di comportamenti complessi (soprattutto quando l’osservabilità “standard” non basta).

## Modern Web Guidance: baseline e feature moderne senza sorprese
Accanto agli strumenti, entra in gioco anche una guida operativa: **Modern Web Guidance**, un set di competenze “verificate” pensate per aiutare gli agenti a costruire soluzioni usando le funzionalità più moderne della piattaforma web, **rispettando il baseline target**.

Se stai sperimentando coding agent nel team, questo tipo di riferimento riduce ambiguità del tipo: “possiamo usare questa API in produzione?”

## AI Assistance: risposte più concise, widget in chat e Lighthouse integrato
Il pannello di **AI Assistance** viene ripensato per essere più operativo: l’obiettivo non è solo avere testo in chat, ma **collegare direttamente suggerimenti e dati dentro DevTools**.

### Walkthrough con widget (non solo markdown)
Invece di una conversazione fatta solo di testo, i nuovi walkthrough possono renderizzare **widget specializzati** direttamente nel pannello: ad esempio per **Core Web Vitals**, breakdown dell’**LCP** e altri indicatori. Un dettaglio utile: con un click su “reveal” si arriva alla **fonte dati** dentro DevTools, riducendo il rischio di “consigli generici”.

### Accesso diretto a Lighthouse per analisi mirate
AI Assistance può usare Lighthouse per un’analisi più completa e poi produrre indicazioni più puntuali su accessibilità e performance, basate su evidenze reali raccolte sulla pagina.

### “Copy to Coding Agent”: portare l’investigazione nel codice
Quando hai finito l’analisi, puoi trasferire i risultati al tuo agente di coding con **Copy to Coding Agent**:
- copiando la conversazione “verbatim”, oppure
- generando un **prompt riassuntivo** pronto per un task operativo

Questo è uno dei passaggi più sensati per trasformare DevTools da strumento di investigazione a ponte verso la remediation.

## Aggiornamenti di produttività: piccoli dettagli, grande impatto
Tra 148 e 150 arrivano anche diverse migliorie “da tutti i giorni”.

### Speculative loads: filtri più pratici
Nel pannello **Application** è possibile filtrare le **speculation rules** usando tag o chiavi come **URL** e **status**. Utile quando stai validando strategie di prerender/prefetch e vuoi isolare rapidamente cosa sta succedendo.

### Network: colonna opzionale “request number”
Nel pannello **Network** compare una colonna opzionale con il **numero della richiesta** (ordine cronologico assoluto di avvio). È sortable: un’aggiunta piccola, ma molto comoda quando devi ricostruire sequenze reali in pagine con molte richieste concorrenti.

## Accessibilità: APCA esce dall’“experimental” e migliora l’analisi del contrasto
L’**APCA contrast calculator** esce dalla fase sperimentale. APCA (Accessible Perceptual Contrast Algorithm) sostituisce le linee guida AA/AAA “classiche” con un modello percettivo più adatto ai display moderni.

Se vuoi usarlo come default:
**Settings → Preferences → Elements → Enable APCA contrast guidelines**

Sempre lato accessibilità, il toggle dell’**Accessibility Tree** viene spostato: da pulsante flottante a controllo dedicato nella sidebar della tab **Accessibility** dentro **Elements**. Meno “nascosto”, più coerente.

## WebMCP: strumenti di debugging per tool esposti agli agenti
WebMCP è una proposta di standard che permette ai siti di esporre tool specializzati direttamente agli agenti AI in visita. DevTools introduce strumenti dedicati (ancora sperimentali) per debuggarli dentro **Application**, in una nuova sezione **WebMCP**.

Qui puoi:
- vedere la lista dei tool definiti
- tracciare invocazioni dell’agente in tempo reale
- eseguire manualmente i tool per verificare output in sicurezza

Per provarli servono flag sperimentali:
- abilitare il supporto DevTools WebMCP
- abilitare i flag di testing WebMCP

## Suggerimenti di codice per CSS: assistenza “smart” nello Styles pane
Quando modifichi CSS nello **Styles** tab, arrivano suggerimenti assistiti utili per valori complessi (gradienti, ombre, ecc.). Si attivano in:
**DevTools Settings → AI innovations**

Non è una feature “core”, ma può ridurre l’attrito nelle iterazioni visive dove spesso si perde tempo su sintassi e combinazioni.

## Sintesi: cosa cambia davvero nel lavoro quotidiano
Queste release rendono DevTools più “chiudiciclo”: dall’analisi (AI Assistance con dati e widget) alla verifica (Lighthouse integrato anche nei flussi agentici) fino al passaggio all’azione (Copy to Coding Agent). In parallelo, migliorano aspetti pratici—Network ordering, filtri, contrasto APCA—che incidono direttamente sul tempo speso a diagnosticare e correggere.

L’implicazione più concreta è questa: se stai adottando agenti nel workflow, ora hai più strumenti per farli lavorare con evidenze reali e guardrail misurabili, riducendo iterazioni “a tentativi” e regressioni difficili da notare.
