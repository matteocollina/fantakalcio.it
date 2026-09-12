---
title: "Celld: durable objects e “worker” stateful, ma self-hosted (senza rinunciare al modello Cloudflare)"
subtitle: "Un runtime distribuito che replica il paradigma dei Durable Objects: funzioni event-driven con storage persistente e indirizzamento stabile, eseguibili su una tua flotta di server."
description: "Durable Objects sono uno dei modelli più pratici per costruire sistemi stateful su infrastrutture edge: un handler che reagisce a eventi (HTTP, cron, ecc.) con uno storage persistente associato e un indirizzo stabile per garantire che richieste “correlate” finiscano sempre sullo stesso stato. Celld porta questo paradigma fuori dal perimetro gestito: stesso concetto, ma deploy su VPS/istanze proprie, con orchestrazione e persistenza basate su S3. Vediamo come funziona, quando conviene e quali trade-off considerare."
publishedAt: 2026-08-13
tags: ["durable-objects","celld","cloudflare-workers","sqlite-embedded","self-hosting","architetture-distribuite"]
---
## Perché i Durable Objects sono diversi dai “soliti” worker

Nel mondo dei runtime serverless/edge, un worker è spesso un **event handler stateless**: arriva una richiesta HTTP (o un trigger pianificato), il codice gira, produce una risposta e termina. È un modello potente, ma appena serve **stato** (sessioni, contatori, lock, code, coordinamento, cache “vera”), iniziano i compromessi:

- portarsi dietro lo stato ad ogni request (payload più grande, più latenza);
- appoggiarsi a servizi esterni (DB/Redis) e gestire concorrenza e consistenza;
- accettare che alcune operazioni non siano veramente atomiche.

I **Durable Objects** risolvono la parte più spinosa con un’idea semplice:

1. **Codice event-driven** (come un worker).
2. **Storage persistente** attaccato all’oggetto (tipicamente SQLite).
3. **Indirizzo stabile**: richieste con la stessa “chiave” arrivano alla stessa istanza logica.

Questo permette di modellare uno stato *per entità* (utente, ordine, stanza chat, carrello, documento…) senza dover re-implementare ogni volta routing, locking e serializzazione.

### L’ingrediente chiave: l’indirizzamento
Lo storage persistente è utile solo se puoi garantire che una certa categoria di richieste finisca sempre sullo **stesso stato**.

Nel paradigma Durable Objects, un oggetto è come una classe replicabile: hai un *tipo* (es. `Counter`) e tante *istanze* identificate da un **nome/ID** (es. `alice`, `max`, `meetup-2026`).

Una route tipica diventa qualcosa del genere:

- `GET /counters/alice` → legge il contatore di *Alice*
- `POST /counters/alice/increment` → incrementa e salva
- `GET /counters/max` → contatore diverso, storage diverso

Le istanze vengono create **lazy**: la prima request verso un nome mai visto crea l’oggetto e il relativo storage. Poi l’oggetto può “andare a dormire”, ma i dati restano.

## Persistenza e concorrenza: perché è un buon modello per sistemi distribuiti
Oltre alla comodità del “codice vicino ai dati”, c’è un vantaggio architetturale spesso sottovalutato: la gestione della **concorrenza**.

Con Durable Objects il runtime garantisce che le operazioni sullo storage di una singola istanza siano **ordinate/consistenti**, anche se arrivano richieste in parallelo. È esattamente ciò che serve in scenari come:

- vendita di biglietti con capienza limitata;
- lock per risorse condivise;
- gestione di inventario;
- coordinamento di job.

### Esempio mentale: “ultimo biglietto”
Immagina una capienza di 5 biglietti:

- `GET /tickets/meetup` → `capacity: 5, sold: 0`
- `POST /tickets/meetup/sell` → `sold: 1, remaining: 4`

Quando le richieste sono contemporanee, il rischio classico è vendere due volte l’ultimo biglietto. Con un durable object per `meetup`, lo stato è centralizzato su quell’istanza logica e la mutazione dello storage avviene in modo ordinato: la capienza non “sfora”.

## Perché un agente AI è un caso d’uso perfetto
Un agente conversazionale è quasi sempre **stateful**:

- ha una cronologia (memoria conversazionale);
- spesso ha un dataset (file caricati, appunti, documenti);
- può esporre strumenti (tool) per leggere dati e compiere azioni.

Un approccio comune è inviare tutta la cronologia ad ogni chiamata: funziona, ma aumenta traffico e latenza. Con un oggetto durevole, invece, puoi:

- salvare la history lato server;
- salvare piccoli file direttamente nello storage SQLite;
- esporre un endpoint tipo `POST /agents/<id>/chat` che accetta solo il nuovo messaggio.

In ambienti worker-like non hai un “vero” filesystem Linux dove installare ciò che vuoi; però puoi comunque:

- eseguire JavaScript in modo controllato;
- integrare storage esterni (ad es. un bucket S3) se servono file più grandi.

## Entra in gioco Celld: lo stesso paradigma, ma self-hosted
Celld prende l’idea dei Durable Objects e la porta su infrastruttura propria: **celle** (cells) che si comportano come oggetti durevoli, con:

- codice event-driven;
- storage persistente (SQLite);
- creazione on-demand;
- routing per istanza (nome/ID).

La differenza non è tanto “come programmi” quanto **dove gira** e **come lo gestisci**.

### Struttura tipica: entry point + celle
L’assetto ricorda una piccola “control plane” applicativa:

- un **entry point** che riceve le richieste e le smista in base all’URL;
- più **celle** registrate (counter, ticketing, agent, ecc.).

Nelle celle, invece di avere per forza metodi separati per ogni azione, puoi avere un unico `fetch()` e discriminare per method/URL. Il concetto rimane: lo stato è sempre quello dell’istanza identificata.

## Deploy e orchestrazione: il ruolo di S3 e della flotta
L’aspetto più interessante di Celld non è solo “gira su una VPS”, ma che è pensato per gestire **più nodi** (una flotta) e distribuire le celle.

In pratica:

- installi un **binary** Celld localmente e sui server che faranno da nodi;
- ti serve un **bucket S3** (o equivalente) come punto centrale di coordinamento;
- i nodi si registrano e diventano disponibili per l’esecuzione delle celle;
- lo storage (SQLite) viene persistito tramite il bucket.

Questo ti permette di crescere oltre la singola macchina senza dover reinventare manualmente:

- schedulazione delle istanze;
- distribuzione;
- persistenza e recupero dello stato.

## Quando conviene davvero self-hostare
La domanda pratica è sempre la stessa: perché non usare direttamente una piattaforma managed?

Le motivazioni che spingono verso il self-hosting in questo scenario sono tipicamente tre.

### 1) Controllo
Infrastruttura tua significa:

- più libertà su rete, osservabilità, integrazioni;
- scelta di region/fornitore;
- politiche di compliance e data locality più gestibili.

### 2) Predicibilità dei costi
I modelli “pay per invocation” sono spesso economici, ma possono diventare difficili da stimare se:

- aumentano i volumi in modo imprevedibile;
- un bug genera un loop di richieste;
- un design sbagliato moltiplica le invocazioni.

Con una VPS/istanza, hai un costo base fisso: paghi anche quando è idle, ma il conto è più stabile e scalabile “a gradini”.

### 3) Potenziale risparmio oltre una certa scala
Esiste un punto in cui una flotta di oggetti stateful, molto attivi, costa meno su server propri rispetto al pricing a consumo. Quel punto dipende da:

- traffico;
- intensità di I/O su storage;
- dimensionamento delle macchine;
- pattern di accesso (molte istanze poco attive vs poche istanze molto attive).

## Trade-off reali da considerare
Self-hosted non significa “gratis” e non significa “più facile”:

- devi gestire nodi, networking, aggiornamenti, alerting;
- devi ragionare su backup e durabilità del bucket;
- alcune feature potrebbero essere immature rispetto a soluzioni managed.

In cambio, ottieni un paradigma di sviluppo moderno (worker + stato) senza vincolarti completamente a un vendor.

## Sintesi: un modello stateful che vale la pena conoscere
Il paradigma dei Durable Objects è uno dei modi più puliti per portare **stato** e **consistenza** in un mondo di funzioni event-driven: indirizzo stabile, storage persistente, concorrenza gestita a livello di runtime.

Celld rende questo modello **deployabile su infrastruttura propria**, mantenendo un’esperienza simile: entry point che smista, istanze create on-demand, SQLite come storage locale/persistito, e orchestrazione pensata per più nodi.

L’implicazione pratica, per chi costruisce applicazioni frontend con backend “leggero” ma stateful, è chiara: invece di aggiungere complessità con servizi esterni e lock manuali, puoi modellare lo stato per entità e scalare per istanze. La scelta tra managed e self-hosted diventa allora una decisione di controllo e costi—non più di fattibilità tecnica.
