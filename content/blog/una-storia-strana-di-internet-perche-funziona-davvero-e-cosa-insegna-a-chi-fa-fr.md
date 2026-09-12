---
title: "Una storia (strana) di Internet: perché funziona davvero e cosa insegna a chi fa frontend"
subtitle: "Dallo “sneakernet” ai pacchetti, dal Web blu sottolineato alle web app: una linea del tempo utile per capire le scelte tecniche di oggi."
description: "Ripercorriamo le svolte che hanno reso Internet e il Web ciò che sono: packet switching, TCP/IP, DNS, HTML/HTTP/URL, la guerra dei browser, Ajax e mobile. Non per nostalgia, ma per leggere meglio i compromessi moderni: performance, affidabilità, indirizzamento, compatibilità e UX."
publishedAt: 2026-07-01
tags: ["TCP-IP","DNS","HTTP-HTML","guerra-dei-browser","Ajax","performance-web"]
---
Internet è pieno di paradossi: nasce per sopravvivere a guasti catastrofici, ma oggi può essere messo in ginocchio da un banner di consenso cookie che blocca il rendering. Ripercorrere alcune tappe chiave della sua evoluzione aiuta a capire *perché* certe cose sono fatte in un modo e non in un altro—e perché, lato frontend, performance e resilienza non sono optional ma conseguenze dirette del design originale della rete.

## Prima della rete: quando “trasferire dati” significava guidare
Per molto tempo i computer sono stati isole. Se volevi spostare dati da una macchina all’altra, spesso lo facevi con supporti fisici: nastri magnetici, floppy, dischi. Era il cosiddetto **“sneakernet”**: la rete più veloce era letteralmente una persona che camminava (o guidava) portando il dato in tasca.

Sembra preistoria, ma fissa un punto importante: **comunicare è più difficile che calcolare**. Ed è la comunicazione—non la potenza di calcolo—ad aver determinato le architetture che usiamo ancora.

## Circuit switching vs packet switching: l’idea che ha reso possibile Internet
Le reti telefoniche tradizionali funzionavano (e in parte funzionano) con **circuit switching**: due estremi “prenotano” un canale dedicato end-to-end per tutta la durata della conversazione. Se un collegamento nella catena si rompe, la comunicazione cade.

Per una rete che deve rimanere operativa anche in condizioni difficili, questo modello è fragile. La svolta concettuale è stata il **packet switching**:

- il messaggio viene **spezzato in pacchetti**;
- ogni pacchetto porta un **indirizzo di destinazione**;
- i pacchetti possono attraversare la rete **seguendo percorsi diversi**;
- a destinazione vengono **riordinati e ricomposti**.

Questo approccio è incredibilmente moderno: è *tollerante ai guasti*, scala bene, e soprattutto non richiede che la rete sia perfetta. Richiede invece che gli endpoint e i protocolli gestiscano la complessità.

Per chi fa frontend, qui c’è un’analogia utile: **il Web non è una chiamata “in tempo reale” dedicata**. È una successione di richieste, ritardi, retry, cache, perdita di pacchetti, riconnessioni. La UX deve convivere con l’inaffidabilità di base.

## TCP/IP: il momento in cui le reti smettono di essere “solitarie”
Avere una rete funzionante non basta se resta un ecosistema chiuso. La vera nascita di Internet avviene quando emerge un linguaggio comune per far parlare reti diverse: **TCP/IP**.

- **IP** si occupa dell’**indirizzamento**: ogni macchina (o più spesso ogni interfaccia) ha un numero, e i pacchetti sanno dove andare.
- **TCP** gestisce l’**affidabilità**: spezza i dati, li numera, ritrasmette se mancano, garantisce l’ordine.

Questa divisione dei compiti è uno dei motivi per cui il Web può essere “best effort” e comunque usabile: l’affidabilità non è nella rete, è nello stack.

## DNS: l’usabilità che sblocca la rete
Gli indirizzi numerici sono ottimi per le macchine e pessimi per gli umani. Il **Domain Name System** risolve il problema trasformando nomi leggibili (es. `example.com`) in indirizzi IP.

Per il frontend, DNS è spesso “invisibile” finché non diventa un collo di bottiglia. Ma impatta:

- **TTFB** (risoluzione DNS + handshake + risposta)
- strategie di **preconnect / dns-prefetch**
- architetture multi-dominio (CDN, asset separati, third-party)

Quando una pagina sembra lenta “prima ancora di iniziare”, a volte non è JavaScript: è la catena di risoluzione e connessione.

## Il Web: HTML, HTTP, URL e l’idea di collegare informazioni
Internet è l’infrastruttura. Il **World Wide Web** è l’applicazione che rende quell’infrastruttura navigabile e collegabile.

Tre invenzioni (più una) fissano ancora oggi le basi del nostro lavoro:

- **URL**: un identificatore universale per una risorsa.
- **HTTP**: un protocollo semplice richiesta/risposta.
- **HTML**: un formato ipertestuale.
- (e poi il browser, che mette tutto insieme)

L’idea potente non è “mostrare documenti”, ma **linkare risorse** in modo uniforme. Il link è l’unità fondamentale: ha costruito navigazione, discovery, SEO, e perfino modelli economici.

## Il browser diventa il campo di battaglia (e noi paghiamo il prezzo in compatibilità)
Quando il Web diventa mainstream, il browser smette di essere un semplice visualizzatore: diventa la piattaforma più distribuita del pianeta.

Da lì nasce una dinamica che chi fa frontend conosce bene:

- competizione → feature introdotte velocemente;
- bundling e dominanza di un player → standardizzazione “de facto”; 
- reazione della comunità → spinta su open source e interoperabilità.

La lezione pratica: **i vincoli di compatibilità non sono un incidente**, sono una conseguenza naturale di una piattaforma installata ovunque. E spiegano perché ancora oggi esistono polyfill, progressive enhancement, e una certa cautela nell’adottare novità senza guardare la diffusione.

## Dial-up e latenza: l’UX è sempre stata una lotta contro il tempo
Prima della banda larga, l’accesso domestico avveniva via modem su linee telefoniche analogiche. Velocità ridotte, latenza alta, connessioni instabili. E un problema molto umano: se qualcuno alzava la cornetta, la sessione poteva saltare.

Per noi è un promemoria: anche se oggi abbiamo fibra e 5G, **la rete del tuo utente è spesso peggiore di quanto immagini**:

- congestione mobile
- Wi‑Fi rumoroso
- power saving aggressivo
- captive portal
- DNS lenti
- proxy aziendali

Ottimizzare caricamento e resilienza resta parte del mestiere.

## Dot-com: quando l’infrastruttura corre più veloce dell’uso reale
A fine anni ’90 molte aziende investono enormemente in infrastrutture e promesse. Non tutte avevano un modello sostenibile e la bolla scoppia.

Nel medio periodo, però, resta un effetto positivo: **capacità e backbone aumentano**. È un pattern ricorrente: euforia → eccesso → correzione → infrastruttura che rimane e abilita la fase successiva.

## Web 2.0 e Ajax: la pagina smette di “ricaricarsi”
La svolta per l’esperienza utente arriva quando il browser può aggiornare parti della UI senza ricaricare tutto il documento. Con **Ajax** (e l’uso di `XMLHttpRequest`, poi evoluto in `fetch`) si apre la porta a interfacce più simili ad applicazioni.

Da qui discendono molte scelte del frontend moderno:

- SPA e routing client-side
- component model
- stato lato client
- chiamate API come flusso principale

Ma anche i costi:

- bundle JavaScript pesanti
- hydration e complessità di runtime
- dipendenza da endpoint e caching più difficile

Il punto non è “Ajax = bene” o “SPA = male”: è che ogni salto di interattività sposta il lavoro dal server al client, e quindi **sposta anche la responsabilità delle performance**.

## Mobile e browser “sempre connesso”: Internet entra in tasca
Con lo smartphone moderno arriva un browser vero, sempre collegato. Cambiano i comportamenti:

- sessioni più brevi e frammentate
- input touch, viewport variabili
- rete instabile ma costante
- notifiche e permessi

Per il frontend significa progettare per:

- **loading incrementale** (contenuto utile subito)
- **responsive reale** (non solo CSS, anche peso e priorità delle risorse)
- **accessibilità e ergonomia**

## Oggi: pagine pesanti, interruzioni e contenuti “mediati”
L’esperienza contemporanea spesso inizia con una sequenza di ostacoli: consenso cookie, pop-up, overlay, inviti a installare app. Nel frattempo la pagina scarica megabyte di JavaScript prima di diventare leggibile.

Questo non è inevitabile: è l’effetto di incentivi (tracking, ads, funnel) e di un abuso di potenza lato client. Il frontend può fare da contrappeso con scelte concrete:

- ridurre JS iniziale e preferire **HTML utile**
- usare **lazy loading** e priorità corrette
- eliminare dipendenze third‑party non essenziali
- misurare (LCP, INP, CLS) e ottimizzare dove conta

## Sintesi: la “stranezza” di Internet è la sua forza
Internet e Web non sono nati come prodotti rifiniti: sono nati come sistemi **resilienti, modulari e interoperabili**. Packet switching, TCP/IP, DNS e HTTP sono soluzioni pragmatiche a problemi reali: guasti, indirizzamento, usabilità, collegabilità.

Per chi costruisce interfacce oggi, la lezione è pratica: trattare la rete come imperfetta e il browser come una piattaforma universale porta a decisioni migliori—più progressive, più veloci, più robuste. E spesso, paradossalmente, più semplici.
