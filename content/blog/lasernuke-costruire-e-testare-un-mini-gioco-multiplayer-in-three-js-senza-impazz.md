---
title: "LaserNuke: costruire (e testare) un mini‑gioco multiplayer in Three.js senza impazzire"
subtitle: "Dalla meccanica “anticipation” al caos del game state: cosa funziona, cosa si rompe e come progettare gli strumenti giusti per iterare velocemente."
description: "Un esperimento di gioco browser‑based in Three.js: una meccanica semplice ma skill‑based, multiplayer fino a 5–6 giocatori, leaderboard, chat e un pannello interno di tuning per controllare bloom, terreno e look & feel. Il lato interessante non è solo la grafica synthwave, ma tutto ciò che emerge quando smetti di testare da solo: sincronizzazione, host authority, gestione delle disconnessioni, stato bloccato e debugging in produzione."
publishedAt: 2026-06-02
tags: ["three.js","multiplayer realtime","sincronizzazione stato","debugging live","pannello di tuning","bloom postprocessing"]
---
## Un gioco piccolo è il modo più rapido per scoprire i problemi grandi

Quando costruisci un gioco browser‑based con **Three.js** puoi convincerti abbastanza in fretta che “se gira in locale, allora è fatto”. Poi apri le porte a più giocatori e iniziano a emergere le parti davvero difficili: **stato condiviso**, **sincronizzazione**, **disconnessioni**, **regole di punteggio** e tutta quella serie di dettagli che in single player non esistono.

LaserNuke nasce proprio come esperimento: un gioco non troppo complesso, con un loop chiaro, ma abbastanza “reale” da richiedere **lobby, round, scoreboard e strumenti di tuning**.

## La meccanica: un “anticipation game” con finestra temporale fissa

Il gameplay è volutamente essenziale:

- c’è un **target** su un terreno/scene che **ruota**
- quando premi *fire* non “colpisci subito”: il colpo viene risolto **dopo ~3 secondi**
- devi quindi **anticipare** dove sarà il target allo scadere della finestra
- il punteggio dipende dalla **distanza** dal target (con una soglia: per esempio, punti solo se sei entro ~500 ft)

È una scelta intelligente per un prototipo:

- elimina gran parte della complessità di fisica e collisioni
- rende il gioco skill‑based senza richiedere controlli complessi
- evidenzia subito i problemi di sincronizzazione: se due client “vedono” rotazioni o tempi diversi, i risultati diventano incomprensibili

## Multiplayer leggero: lobby aperte, partite brevi, leaderboard

Il multiplayer è pensato per partire in fretta:

- **open lobby** (join immediato)
- fino a **5–6 giocatori**
- **ready/unready**
- round multipli con leaderboard
- chat in‑game minimale
- login opzionale (Google o email) per **persistenza delle statistiche**

Questa combinazione è tipica dei giochi “da browser”: onboarding velocissimo e complessità spostata sul backend di stato.

## Il primo muro: quando un giocatore lascia a partita iniziata

Il bug più istruttivo emerso durante i test multi‑utente è il classico:

> se l’utente che “pilota” la partita esce (o si disconnette) a match avviato, il countdown e il passaggio di round **si bloccano**.

È un problema di **authority** e di **ownership del game loop**.

### Perché succede

Se il sistema è costruito in modo che:

- un client specifico “guida” il timer (host)
- gli altri client si limitano a seguire

…all’uscita dell’host non c’è più nessuno che faccia avanzare lo stato globale.

### Come lo risolvi davvero (non con una toppa)

Hai due strade solide:

1. **Server authoritative**: timer, stato round e risoluzione colpi vivono sul server. I client inviano input/time-stamp, il server decide.
2. **Host migration**: se l’host esce, eleggi un nuovo host in modo deterministico e trasferisci la responsabilità del countdown.

La prima è più robusta (e spesso più semplice da ragionare), la seconda è più economica ma introduce edge case.

## Il secondo muro: “vedo esplosioni qui, ma i risultati sono altrove”

Un’altra classe di problemi è più subdola: i giocatori riportano (o tu osservi) che:

- l’esplosione sembra avvenire vicino al target
- ma a fine round la distanza calcolata è enorme

Questo può derivare da:

- **desync di tempo** (il “3 secondi” non è lo stesso per tutti)
- **desync di rotazione** (velocità/seed non condivisi correttamente)
- differenza tra **stato renderizzato** e **stato usato per calcolare il punteggio**
- unità/coordinate non coerenti (spazi diversi: world vs local, o offset non applicati)

### Pattern consigliato

Per un gioco come questo, la ricetta che evita discussioni infinite è:

- il server definisce per ogni round: `seed`, `startTime`, `angularSpeed`, `targetSpawnParams`
- i client derivano la traiettoria in modo deterministico
- il server valida la risoluzione (o almeno la distanza finale) usando lo stesso modello

Anche se vuoi un approccio “leggero”, almeno **il tempo di inizio round** deve essere comune e affidabile.

## Strumenti interni: un pannello di tuning è una feature, non un lusso

La parte più “da prodotto” del progetto è il pannello di impostazioni interno, organizzato in gruppi espandibili, per controllare praticamente tutto:

- parametri del terreno (ampiezza, frequenza, warp)
- parametri scena/postprocessing (ad esempio **bloom strength** e **bloom radius**)
- look & feel generale
- possibilità di “bake” e distribuire le modifiche

Questa scelta cambia il ritmo di sviluppo:

- non ricompili per ogni micro‑variazione estetica
- puoi fare test A/B immediati
- puoi correggere difetti evidenti (es. bloom eccessivo, UI troppo “lavata”) in pochi secondi

### Nota front-end importante: UI “lavata” e stati di errore

Quando una UI passa improvvisamente a colori sbagliati o troppo chiari dopo refresh, spesso non è “solo CSS”: può essere un **fallback state** dovuto a:

- asset non caricati
- parametri non inizializzati
- ordine di inizializzazione diverso dopo hard refresh

Se hai un pannello di tuning, aggiungi anche:

- un indicatore esplicito di **config valida/non valida**
- log sintetico degli ultimi errori (non solo console)

## UX: la regola dei 500 ft è chiara… ma poco leggibile

Una soglia di punteggio (tipo “punti solo entro 500 ft”) è ok, però va resa visibile:

- disegna un **anello/perimetro** attorno al target
- mostra un feedback immediato “fuori soglia”
- considera una curva di punteggio continua (anche minima) per evitare round “a zero” per tutti

Nei multiplayer casual, troppi round senza punti sembrano bug anche quando non lo sono.

## Il vero stack non è solo Three.js

Dire “è Three.js e backend” è vero ma incompleto: la difficoltà sta nelle discipline che devi coprire contemporaneamente:

- **grafica realtime** (camera, postprocessing, performance)
- **stato multiplayer** (lobby, ready, countdown, round transitions)
- **resilienza** (disconnect, reconnection, host leaving)
- **tooling** (tuning panel, bake, rollout rapido)
- **design delle regole** (punteggio, leggibilità, onboarding)

Un prototipo del genere funziona solo se hai almeno un’infarinatura su tutti questi strati.

## Checklist pratica per evitare i bug più dolorosi

Se stai costruendo qualcosa di simile, questa lista ti risparmia molte ore:

1. **Round state machine server-side**: `LOBBY -> COUNTDOWN -> ACTIVE -> RESOLVE -> SCORE -> NEXT`
2. Ogni round ha un **id** e un **timestamp di inizio** condiviso
3. Input dei client con `clientTime`, ma risoluzione con `serverTime`
4. Disconnessione: se un player esce, la partita continua; se era “host”, non deve cambiare nulla
5. UI: sempre mostrare **stato corrente** e cosa manca (es. “in attesa di 2 ready”)
6. Debug: log eventi di round (inizio/fine, seed, speed) e mismatch di calcolo (client vs server)

## Conclusione

Un mini‑gioco in Three.js può sembrare “solo grafica”, ma appena aggiungi multiplayer scopri che il cuore del lavoro è **engineering dello stato** e **strumenti per iterare**. La lezione più utile è questa: *non aspettare il “prodotto finito” per testare in reale multi‑utente*. Fallo presto, perché i bug che emergono (host authority, countdown bloccati, desync visivo/logico) non li vedi in locale — e spesso determinano l’architettura, non solo i dettagli.
