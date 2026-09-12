---
title: "React Server Components: promessa di performance, realtà di superficie d’attacco"
subtitle: "Dopo mesi di CVE, fix incompleti e DoS ricorrenti, vale la pena chiedersi se l’architettura RSC—così com’è oggi—stia spostando troppa complessità (e rischio) dentro al framework."
description: "React Server Components hanno portato un modello di sviluppo potente: componenti async, accesso diretto a dati e rendering sul server con meno JavaScript sul client. Ma la storia recente di vulnerabilità (DoS, SSRF, bypass, e persino RCE nella filiera server-side) mostra un pattern preoccupante: la complessità della serializzazione, dei confini client/server e dell’App Router può trasformarsi in una superficie d’attacco ampia, anche per app che “non usano RSC esplicitamente”. In questo articolo facciamo il punto: cosa cambia davvero rispetto a CSR/SSR classico, perché certe classi di bug sono più probabili, e quali contromisure pragmatiche adottare oggi se lavori con Next.js e App Router."
publishedAt: 2026-05-11
tags: ["react-server-components","nextjs-app-router","sicurezza-web","cve-nextjs","denial-of-service"]
---
## Il punto non è “RSC fa schifo”: è che aumenta la superficie d’attacco

React Server Components (RSC) sono state presentate come un salto di paradigma: meno JavaScript spedito al browser, più rendering sul server, componenti `async` che possono parlare direttamente con il database, e una UX più rapida grazie a streaming e composizione.

Tutto vero—almeno sul piano dell’obiettivo.

Il problema è che, nel mondo reale, questo modello sposta dentro al framework una quantità di responsabilità enorme: **serializzazione**, **routing**, **boundary client/server**, **invocazione di “azioni” o funzioni server**, caching, streaming, e compatibilità con bundler/runtime. Quando aggiungi così tanta logica “magica” nel percorso di una richiesta HTTP, la probabilità di inciampare in classi di vulnerabilità nuove (o più facili da innescare) cresce.

Negli ultimi mesi, una serie di vulnerabilità e patch correttive (in alcuni casi seguite da fix incompleti e nuove varianti) ha messo in evidenza un pattern: **non è un singolo bug sfortunato**, ma un’area architetturale ad alto rischio.

> Nota importante: spesso non serve “usare RSC volontariamente” per essere coinvolti. Se sei su versioni/feature che includono App Router e l’infrastruttura che abilita RSC, potresti essere esposto comunque.

---

## Un ripasso utile: CSR, SSR e il “vecchio Next”

Per capire perché certe vulnerabilità sono più probabili con RSC, conviene rimettere in fila i modelli.

### 1) CSR (Client-Side Rendering)
- Il server consegna un bundle JS.
- Il browser esegue React e renderizza uno *shell* iniziale.
- I dati “veri” arrivano dopo via API (REST/GraphQL), con una seconda richiesta.

**Pro:** server semplice, confini chiari.

**Contro:** più JS, più round-trip, first paint spesso peggiore.

### 2) SSR classico
- Il server rende HTML iniziale.
- Il client scarica JS e idrata.
- I dati dinamici spesso arrivano ancora con chiamate successive (dipende dall’architettura).

**Pro:** pagina “sembra” pronta prima.

**Contro:** idratazione, complessità di stato e cache.

### 3) Next “tradizionale” (Pages Router: `getServerSideProps`, `getStaticProps`)
Qui la cosa era sorprendentemente lineare:
- Next esegue funzioni server dedicate per ottenere dati.
- Renderizza la pagina già con i dati.
- Il client idrata e diventa interattivo.

**Pro:** flusso prevedibile, responsabilità ben separate.

**Contro:** meno composizione “fine” rispetto ai componenti, pattern più verbosi.

---

## Cosa cambia davvero con React Server Components

Con RSC il cambio è concettuale: non hai solo “rendering sul server”, hai **componenti React che esistono e girano sul server**, e che possono:
- essere `async`;
- chiamare direttamente database/servizi interni;
- importare moduli server-only;
- produrre un output serializzato che il client ricompone.

Questo abilita flussi molto comodi, del tipo:

- componente server che fa query;
- render immediato dei risultati;
- invio al client solo di ciò che serve davvero;
- interattività limitata ai componenti client.

A livello di DX sembra “il modo giusto”. Ma il costo è un altro: per far funzionare questo modello, il framework deve gestire un protocollo, una serializzazione e dei percorsi di esecuzione molto più articolati.

Ed è qui che entrano in gioco le vulnerabilità.

---

## Perché RSC tende a generare nuove classi di bug (e DoS ricorrenti)

### 1) Serializzazione e deserializzazione come punto critico
Quando un sistema deve **interpretare** payload complessi (spesso costruiti a partire da richieste HTTP) e trasformarli in chiamate a funzioni/moduli, qualsiasi dettaglio diventa una leva:
- input craftati;
- percorsi non previsti;
- casi limite del runtime;
- mismatch tra bundler e output.

Molti DoS moderni, in pratica, sono questo: **un input “valido” che scatena un lavoro enorme** (CPU spike, loop, memory exhaustion) nel server.

### 2) Confini “impliciti” tra codice server e codice client
Con RSC il confine esiste, ma è anche *convenzionale*: dipende da direttive (`"use client"`), dalle regole del framework, dal bundling, dai transformer.

Ogni volta che un framework deve “capire” cosa gira dove e quando, aumenta:
- il rischio di bypass;
- il rischio di leakage (segreti finiti nel posto sbagliato);
- la quantità di edge case.

### 3) App Router come acceleratore di complessità
L’adozione di App Router e delle primitive collegate (streaming, flight data, actions, middleware, proxying) crea un ecosistema potente… ma anche una rete di componenti che devono interagire perfettamente.

In un contesto così, è plausibile vedere:
- vulnerabilità in endpoint interni;
- bypass nei middleware;
- SSRF;
- XSS legate a combinazioni specifiche;
- DoS su endpoint “di servizio” che non pensavi nemmeno di esporre.

---

## “Non uso RSC, quindi sono al sicuro”: spesso no

Uno degli aspetti più controintuitivi emersi in queste ondate di CVE è che l’esposizione può dipendere da:
- versione del framework;
- uso di App Router;
- abilitazione implicita di percorsi server;
- presenza di endpoint/handler che supportano quel protocollo.

Quindi sì: anche un’app che “sembra” semplice può trovarsi con un punto d’ingresso sfruttabile tramite richieste craftate verso endpoint interni.

Il takeaway pragmatico è brutale ma utile: **la sicurezza non si misura dalle feature che pensi di usare, ma dal codice che stai deployando davvero**.

---

## Un segnale da non ignorare: patch, poi patch della patch

In ogni ecosistema software esistono vulnerabilità. Non è quello lo scandalo.

Il campanello d’allarme è un altro: quando vedi una sequenza di:
- vulnerabilità critiche;
- fix rapidi;
- varianti che aggirano il fix;
- nuove CVE che colpiscono aree simili (DoS ripetuti, CPU/memory exhaustion);

…allora probabilmente non è solo “un bug”, ma **un’area architetturale difficile da rendere robusta**.

In particolare i DoS legati a deserializzazione o parsing sono famosi per essere insidiosi: basta un caso limite rimasto fuori da un controllo per riaprire il problema.

---

## “RSC era una cattiva idea”? Dipende da cosa intendi

Dire che RSC è “un errore” è una semplificazione, ma capisco perfettamente perché questa percezione stia crescendo.

Il vero punto, per chi costruisce prodotti, è più concreto:

- **Il guadagno di performance e DX vale il rischio operativo?**
- **Hai team e processi per reagire velocemente a CVE e upgrade urgenti?**
- **Il tuo threat model include attacchi automatizzati e scanner aggressivi?**

Se la risposta a queste domande è “non proprio”, allora l’adozione indiscriminata di stack basati su RSC/App Router merita una riflessione.

---

## Cosa fare oggi (checklist pragmatica)

### 1) Aggiorna Next.js con disciplina
- Mantieni una policy di aggiornamento frequente.
- Automatizza la verifica delle advisory (Dependabot/Snyk o simili).
- Considera una procedura interna per aggiornamenti “urgenti di sicurezza”.

### 2) Tratta App Router/RSC come parte del perimetro esposto
- Non assumere che endpoint “interni” siano invisibili.
- Logga e monitora pattern anomali (burst di richieste, payload sospetti).

### 3) Metti protezioni anti-DoS davanti all’app
- Rate limiting a livello CDN/WAF.
- Timeouts e limiti di dimensione su request body/headers.
- Circuit breaker dove possibile.

### 4) Riduci la magia dove puoi
- Se una pagina non ha bisogno di RSC, valuta approcci più lineari.
- Isola le parti server critiche in servizi dedicati (API interne), con contratti espliciti.

### 5) Valuta alternative di implementazione RSC (quando disponibili)
Non tutte le implementazioni di “server components” sono identiche. Alcuni framework/stack adottano meccanismi di serializzazione diversi o non dipendono dagli stessi percorsi interni: questo può cambiare molto il profilo di rischio.

---

## Conclusione: RSC è potente, ma oggi va trattato come “zona ad alto rischio”

RSC ha un’idea forte: **comporre UI e dati sul server come parte del modello React**. È elegante e, in casi ideali, migliora davvero performance e bundle size.

Ma l’esperienza recente suggerisce cautela: la combinazione di protocollo, serializzazione e routing avanzato crea una superficie d’attacco ampia, e il ritmo di vulnerabilità (specialmente DoS) indica che l’ecosistema sta ancora cercando stabilità.

Se stai costruendo un prodotto in produzione, la scelta migliore non è ideologica: è operativa.

- Se adotti RSC/App Router, fallo con **processi di patching rapidi**, **monitoraggio**, **rate limiting** e un’idea chiara del tuo perimetro.
- Se ti serve prevedibilità e un threat model più semplice, valuta architetture meno “magiche” per le parti critiche.

La “feature del futuro” non è quella più nuova: è quella che riesci a mantenere sicura nel tempo.
