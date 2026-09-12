---
title: "Progettare un’app “phygital”: quando UI, computer vision e proiezione diventano un unico prodotto"
subtitle: "Un caso interessante: un sistema domestico che traccia le biglie in tempo reale, proietta overlay sul tavolo e costruisce training, replay e community attorno ai dati."
description: "Cosa succede quando un’interfaccia non vive solo nello schermo, ma anche nello spazio fisico? In questo articolo guardiamo da vicino l’architettura di un prodotto che unisce camera, proiettore e PC per riconoscere le biglie, proiettare feedback sul tavolo e trasformare sessioni di allenamento in dati, replay e contenuti condivisibili. Un ottimo spunto per chi fa frontend e deve ragionare su UI complesse, editor visuali, profili multipli, telemetria e sincronizzazione tra mondo reale e digitale."
publishedAt: 2026-07-29
tags: ["ui-dati-e-statistiche","editor-visuale","computer-vision-per-ui","replay-e-telemetria","multiplayer-asincrono","proiezione-interattiva"]
---
Nel frontend parliamo spesso di “esperienze”: dashboard, editor, feed, chat, analytics. Di solito però restano confinate nello schermo. Esistono prodotti in cui l’interfaccia è letteralmente **una parte dell’ambiente fisico**: una camera osserva un tavolo, un proiettore disegna overlay sul panno, e un’app coordina tutto in tempo reale.

Questo tipo di software è un ottimo laboratorio mentale per chi progetta UI complesse: obbliga a pensare a **latenza, feedback immediato, flussi di training**, ma anche a community, profili, condivisione e “dati come prodotto”.

Di seguito raccolgo i concetti più utili dal punto di vista di design e architettura dell’esperienza.

---

## 1) L’interfaccia non è solo UI: è una pipeline in tempo reale
Un sistema “tavolo + camera + proiettore + PC” impone un’idea chiave: la UI è il risultato di una pipeline.

- **Input**: rilevamento delle biglie e degli eventi (posizioni, urti, imbucate, fallo, ecc.)
- **Processing**: interpretazione dello stato della sessione (drill, punteggio, zone, regole)
- **Output**: overlay proiettati sul tavolo + UI classica su schermo (dashboard, liste, replay)

Per un frontend engineer il parallelismo è immediato: come una SPA reagisce a eventi e aggiorna lo stato, qui lo stato arriva dal mondo fisico e dev’essere tradotto in feedback **comprensibile e immediato**.

**Implicazione pratica**: la parte “visual” (overlay, shader, indicatori, traiettorie) non può essere un abbellimento: è una componente funzionale. Ogni elemento proiettato deve rispondere alla domanda: *cosa devo fare adesso e come sto andando?*

---

## 2) Dashboard come hub: feed, sessioni, drill e social in un’unica IA
L’home non è un menu: è un hub con più flussi paralleli.

- **Community feed** per clip e discussioni
- **Accesso rapido ai drill recenti** (locali e della community)
- **Attività recente** e contenuti “latest”
- **Sezione “online”** per invitare altre persone

Qui la cosa interessante non è la presenza del feed in sé, ma la scelta di posizionarlo accanto a strumenti “seri” (drill e analisi). È un modo concreto per tenere insieme due bisogni:

1. allenarsi (utilità)
2. rimanere ingaggiati e confrontarsi (motivazione)

**Lezione da portare nel frontend**: quando un prodotto ha una componente “tool” e una “community”, l’architettura dell’informazione deve evitare due estremi:
- social separato che sembra un altro mondo
- tool ipertecnico senza contesto o continuità

---

## 3) Profili multipli: UX semplice, dati separati (tipo “Netflix”)
Un dettaglio apparentemente banale ma decisivo: **profili locali multipli**.

- più persone usano lo stesso tavolo/sistema
- ogni profilo mantiene le proprie statistiche
- il cambio profilo cambia l’intero contesto dei dati

Dal punto di vista dell’implementazione, è una scelta che influenza tutto:
- scoping dei dati (sessioni, record, miglioramenti)
- autorizzazioni e privacy (cosa condividi e cosa no)
- UI state management (tutto deve reagire al “current profile”)

**Regola pratica**: se esistono profili, vanno trattati come un *root state* dell’app. Non un filtro applicato dopo.

---

## 4) Drill come “contenuto”: locale + community + versionabilità
La sezione drill è separata in due mondi:
- **drill locali** (scaricati sul PC)
- **drill della community** (creati e condivisi da altri)

Questa è una scelta molto potente perché trasforma i drill in un oggetto di prodotto simile a:
- preset
- template
- “mod”

Con un extra: i drill non sono solo definizioni statiche, ma **generano telemetria** (punti, riuscite, errori, progressione).

**Spunto frontend**: quando un utente può creare/duplicare/modificare oggetti “giocabili”, conviene progettare l’ecosistema come piattaforma:
- modello dati dei drill
- metadati (autore, difficoltà, tag)
- compatibilità/versioni
- condivisione e discovery

---

## 5) Editor: 2D + 3D e “capture layout” dal mondo reale
Un editor ben progettato riduce l’attrito tra l’idea (“voglio allenare questo colpo”) e la realtà (“posizionare tutto a mano è noioso”).

Qui emergono due feature interessanti:

### a) Costruzione in 3D
La possibilità di visualizzare in 3D aiuta a capire geometrie e posizionamenti prima ancora di provarli sul tavolo.

### b) Cattura del layout reale
La funzione di “capture table layout” riconosce le biglie presenti e ricostruisce automaticamente lo schema per creare un drill a partire da una situazione reale.

**Lezione di prodotto**: l’editor non deve essere solo potente, deve essere anche un *acceleratore*. Le funzioni di import/capture spesso valgono più di decine di opzioni.

---

## 6) Analisi sessione: replay navigabile per singolo tiro
Ogni drill o modalità genera sessioni con statistiche e, opzionalmente, video.

Il punto UI notevole è la navigazione:
- elenco dei tiri
- click su un tiro → salti al momento esatto
- possibilità di condividere la sessione e ricevere feedback

Questo avvicina l’esperienza a un pattern tipico dei tool professionali:
- timeline
- marker
- deep link “a un evento”

**Spunto frontend**: se hai eventi numerosi e ripetibili (tiri, step, tentativi), la UI dovrebbe permettere il *random access*, non solo playback lineare.

---

## 7) Overlay funzionali: zone, traiettorie, shader e feedback immediato
Sul tavolo vengono proiettati elementi che guidano l’allenamento:
- zone di atterraggio
- obiettivi (target)
- suggerimenti di traiettoria della biglia battente (neutral/stun/draw, varianti)
- modalità visuali (shader)

Qui vale una regola da UI real-time: **feedback rapido e binario**.
- hai centrato la zona? punto / fallimento / ripeti
- hai “bloccato” la linea (modalità difesa/snooker)? percentuale e validazione

Quando la UI deve “allenare”, non può essere ambigua.

---

## 8) Instant replay con zoom e slow motion: fiducia nel sistema
L’instant replay con controlli di zoom e slow motion non è solo “cool”: è una feature di fiducia.

- riduce discussioni sugli eventi (tocchi, rimbalzi)
- rende verificabile ciò che il sistema ha interpretato
- migliora la qualità dei contenuti condivisi

**Pattern generale**: quando automatizzi il giudizio (tracking/AI/regole), dai sempre all’utente un modo per **ricontrollare** con facilità.

---

## 9) Modalità training che cambiano il modello mentale
Due esempi di modalità mostrano bene come cambia l’esperienza:

### Instant Recall
Salva uno snapshot del layout dopo ogni tiro e permette di tornare indietro a uno stato precedente.

È un concetto quasi “git per il mondo fisico”: invece di accettare l’errore e ripartire, puoi ripetere la stessa situazione senza trucchi (niente adesivi, niente appunti manuali).

### Target Pool
Associa un obiettivo a una buca, assegna punti e consente di ripetere lo stesso layout per iterare.

**Implicazione per chi progetta UI**: la ripetibilità è un moltiplicatore di valore. Se rendi facile ripetere lo stesso scenario, l’utente percepisce miglioramento e progresso in modo più netto.

---

## 10) Multiplayer via internet: sincronizzare regole, non solo chat
Il multiplayer online qui è interessante perché non è solo “giocare”: è anche
- sfidarsi su drill
- condividere layout
- confrontare statistiche e risultati

Questo sposta il focus dalla simulazione (difficile) alla comparabilità (utile): entrambi fanno lo stesso esercizio nel proprio ambiente, ma il sistema standardizza regole e scoring.

**Idea da riusare**: “multiplayer asincrono” basato su oggetti condivisi (layout, drill, sessioni) spesso scala meglio ed è più robusto di una modalità in tempo reale.

---

## 11) Hardware configurabile: un prodotto che deve guidare l’installazione
Quando un’app dipende da camera e proiettore, la UX non finisce nel software.

La presenza di un configuratore 3D per determinare compatibilità e posizionamento (camera/proiettore) è una scelta che riduce drasticamente:
- installazioni fallite
- frustrazione iniziale
- richieste di supporto

Dal punto di vista del prodotto, è “onboarding fisico”. Dal punto di vista del frontend, è un editor/visualizzatore con vincoli: distanze, angoli, copertura, risoluzione.

---

## Sintesi: cosa imparare per i nostri prodotti frontend
Un sistema di questo tipo mette in luce una serie di principi riutilizzabili anche in app più “classiche”:

1. **Dati → replay → miglioramento**: non basta misurare; serve navigare e confrontare nel tempo.
2. **Editor come acceleratore**: importa/cattura vale più di mille opzioni.
3. **Feedback immediato e verificabile**: replay, zoom, slow motion costruiscono fiducia.
4. **Contenuti come piattaforma**: drill/layout/sessioni diventano oggetti condivisibili e versionabili.
5. **Onboarding guidato**: quando l’ambiente conta, l’app deve aiutare a “montare” l’esperienza.

In pratica: progettare UI che escono dallo schermo rende più evidente ciò che spesso dimentichiamo anche nelle dashboard tradizionali—la UI migliore non è quella più ricca, ma quella che rende **l’azione successiva ovvia** e il progresso **misurabile, ripetibile e condivisibile**.
