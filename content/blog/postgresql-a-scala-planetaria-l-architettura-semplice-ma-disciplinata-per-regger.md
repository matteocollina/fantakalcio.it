---
title: "PostgreSQL a scala “planetaria”: l’architettura semplice (ma disciplinata) per reggere carichi enormi"
subtitle: "Un primario per le scritture, decine di repliche in lettura, cache davanti al DB e pooling aggressivo: come rendere sostenibile un workload soprattutto read-heavy senza shardare tutto."
description: "Quando un prodotto esplode, il database diventa il collo di bottiglia più rapido e più costoso da rimuovere. In questo articolo vediamo un’architettura PostgreSQL sorprendentemente lineare per sostenere carichi giganteschi: un solo writer, molte read replica distribuite, cache applicativa, connection pooling, workload isolation e una strategia pragmatica per rimandare (quando ha senso) lo sharding. Il focus è pratico: cosa copiare oggi in un sistema moderno, anche se non sei “a scala Big Tech”."
publishedAt: 2026-07-20
tags: ["postgresql","read-replica","connection-pooling","pgbouncer","caching","workload-isolation"]
---
Quando un’app cresce rapidamente, quasi sempre succede la stessa cosa: la prima versione “naïf” dell’architettura (un database che fa tutto) funziona benissimo… finché non funziona più. Il punto interessante è che, per workload prevalentemente in lettura, PostgreSQL può spingersi molto oltre ciò che molti team considerano “ragionevole”, a patto di adottare una serie di accorgimenti semplici e coerenti.

Qui sotto metto in ordine le leve più efficaci, con un filo conduttore chiaro: **proteggere il nodo primario** (writer) da tutto ciò che non è strettamente necessario, e rendere la lettura scalabile orizzontalmente.

---

## 1) Il punto di partenza che prima o poi scoppia
Il setup più comune all’inizio è:

- **un solo nodo PostgreSQL**
- l’app legge e scrive lì
- l’aumento di traffico porta a:
  - CPU alta
  - tante connessioni simultanee
  - latenza che sale
  - errori intermittenti (timeout, 5xx)

Questo non è “sbagliato”: è la scelta più veloce per partire. Il problema è che il database diventa contemporaneamente:

- storage
- read engine
- write engine
- punto di sincronizzazione
- collo di bottiglia

La strategia vincente è **disaccoppiare i ruoli** senza introdurre complessità prematura.

---

## 2) Cache davanti al DB: la prima riduzione brutale di carico
Se il traffico è prevalentemente read-heavy (tipico di prodotti con molte consultazioni e relativamente poche scritture), la mossa più impattante è introdurre una **cache applicativa** (es. Redis) tra app e database.

### Perché funziona così bene
- intercetta richieste ripetute e “calde”
- riduce i roundtrip verso Postgres
- smorza gli spike

### Il rischio da progettare: cache miss storm
La cache non è solo “mettere Redis e via”. Quando un keyspace scade o una feature nuova genera pattern imprevisti, puoi avere **ondate di miss** che scaricano improvvisamente tutto su Postgres, saturandolo.

Buone pratiche (minime) per evitare l’effetto valanga:
- TTL con **jitter** (scadenze non allineate)
- **stale-while-revalidate** dove possibile
- protezioni lato app (rate limit, circuit breaker su query costose)

---

## 3) Read replica in massa: scalare la lettura senza toccare il writer
Una volta ridotta la pressione con la cache, il passo naturale è separare letture e scritture:

- **1 primary**: scrive (e legge il minimo indispensabile)
- **N read replica**: servono letture

Con molte repliche distribuite geograficamente puoi ottenere:
- **scalabilità orizzontale** sulle read
- **latenza più bassa** per utenti lontani
- un primario più stabile (quindi più affidabile sulle write)

### Serve un read router (o logica equivalente)
A livello applicativo devi instradare:
- query read-only verso repliche
- scritture (e letture strong-consistency) verso il primario

Il punto chiave è accettare una verità: con repliche avrai **replication lag**. Quindi definisci chiaramente:
- quali endpoint possono tollerare dati leggermente “vecchi”
- quali richiedono read-after-write (e quindi devono andare al primary)

---

## 4) Connection pooling: non è un’ottimizzazione, è igiene
Uno degli errori più costosi è lasciare che ogni richiesta (o peggio ogni utente) apra connessioni “a piacere” verso Postgres.

Sintomi tipici:
- esaurisci `max_connections`
- accumuli connessioni idle
- “connection storm” durante picchi o deploy

La soluzione standard in ecosistemi Postgres è un pooler come **PgBouncer**.

### Perché cambia davvero la partita
- riusa un numero limitato di connessioni verso il DB
- riduce latenza di setup
- stabilizza il sistema durante i picchi

Una nota pratica: molti deployment moderni mettono **un PgBouncer per istanza/replica** (o per cluster), come proxy/pool davanti al database.

---

## 5) Query optimization: l’ORM non ti salva dalle join “tossiche”
Quando il carico cresce, spesso non sono “tutte le query” a essere un problema: sono **poche query costose** che, in certi momenti, mangiano CPU e degradano tutto.

Un pattern comune è l’esplosione di query generate da ORM con:
- join multiple
- tabelle grandi
- filtri non indicizzati

### Linee guida pragmatiche
- evita join complesse “a cascata” quando non sono necessarie
- se la join è inevitabile, valuta di:
  - spezzare la query in più query semplici
  - spostare parte dell’aggregazione nel layer applicativo

Sì, “fare join nell’app” non è sempre elegante. Ma in sistemi ad alto traffico può essere una scelta razionale per **togliere CPU al database** e controllare meglio i costi.

---

## 6) Workload isolation: risolvere il problema del noisy neighbor
Quando più funzionalità condividono lo stesso Postgres, basta una feature nuova con query inefficienti per rallentare tutto (anche le parti critiche).

La soluzione è **isolare i workload**:
- separare per priorità (low/medium/high)
- instradare su istanze/repliche dedicate
- proteggere il traffico business-critical

Questo è particolarmente utile quando:
- lanci feature sperimentali
- hai campagne/effetti virali
- non vuoi che una moda del momento impatti l’API core

---

## 7) Load shedding: scegliere cosa far fallire (prima che fallisca tutto)
Quando il sistema è sotto stress estremo, l’obiettivo non è “tenere tutto su” ma:

- mantenere disponibili le operazioni essenziali
- degradare in modo controllato il resto

Il **load shedding** introduce regole per rifiutare o rimandare richieste non critiche quando:
- CPU/connessioni/queue superano soglie
- il replication lag aumenta
- la cache è in miss storm

È una di quelle misure che non “ottimizza” in condizioni normali, ma salva la disponibilità quando conta.

---

## 8) Sharding: non è vietato, ma non è sempre il primo passo
La tentazione, quando il DB soffre, è dire: “Shardiamo Postgres”.

Il problema vero dello sharding su un’app esistente è che spesso richiede:
- cambiare tanti endpoint
- ripensare query e chiavi di partizionamento
- gestire transazioni cross-shard
- mesi (o anni) di migrazione e rischio operativo

Se il carico è **principalmente in lettura**, puoi ottenere moltissimo con:
- cache + read replica + pooling + ottimizzazione query

### E le scritture?
Se le write crescono e il primario diventa il limite, una strategia intermedia è **spostare alcune scritture** su uno storage separato e shardato (eventi, log, telemetry, dati “grossi” che non richiedono le stesse garanzie transazionali del core). Così:
- il primario rimane “pulito” per il dato critico
- scarichi write throughput su un sistema più adatto

---

## Sintesi operativa (copiabile)
Se oggi hai un prodotto che sta crescendo e Postgres è sotto pressione, una roadmap concreta per un workload read-heavy è:

1. **Cache** (con protezioni anti miss storm)
2. **Read replica** + routing delle query
3. **PgBouncer** (o pooling equivalente) davanti al DB
4. **Ottimizzazione query** guidata da osservabilità (top query per CPU/latency)
5. **Workload isolation** per priorità
6. **Load shedding** per proteggere il core
7. Solo dopo, se serve davvero: **sharding** (o split mirato delle scritture)

La lezione più utile è che “semplice” non significa “banale”: un’architettura lineare, applicata con disciplina (routing, pooling, isolamenti, guardrail), può portare PostgreSQL molto lontano senza trasformare la tua base dati in un progetto di migrazione infinito.
