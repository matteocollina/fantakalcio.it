---
title: "Vercel nell’era agentica: servizi full‑stack, AI Gateway e primitive per agenti in produzione"
subtitle: "Dalla preview deployment come unità di test alla “token delivery network”: cosa cambia per chi costruisce app e agenti con Next.js, TypeScript e Python."
description: "L’adozione di agenti di coding e di applicazioni autonome sta spostando il baricentro dell’infrastruttura: non basta più deployare pagine o API, bisogna eseguire workflow lunghi, gestire token AI come dipendenza critica, isolare codice non fidato e collegare agenti a sistemi aziendali con permessi minimali. In questo articolo passiamo in rassegna le novità della piattaforma Vercel orientate a questo scenario: Vercel Services per sviluppare e previeware front-end e back-end insieme, AI SDK e AI Gateway per orchestrare modelli multipli, Workflow SDK per durabilità, Sandboxes per esecuzione sicura e Connect per integrazioni con token short-lived."
publishedAt: 2026-06-18
tags: ["Vercel Services","AI Gateway","Workflow SDK","Vercel Sandbox","Vercel Connect","AI SDK"]
---
Negli ultimi mesi è diventato evidente un cambio di paradigma: scriviamo meno “colla” a mano, ma mettiamo in produzione più funzionalità. Il motivo è duplice. Da un lato i coding agent accelerano sviluppo e iterazione; dall’altro le applicazioni stesse stanno diventando **agentiche**, cioè capaci di interpretare un intento e portare a termine azioni in autonomia.

Questo sposta i requisiti infrastrutturali: non basta più una pipeline che compili e deployi un front-end, e neppure un classico set di API. Servono primitive per:

- far girare **servizi full‑stack** con DX coerente;
- trattare i **token** come dipendenza di produzione (affidabilità, routing, osservabilità, costi);
- eseguire **workflow lunghi** e durabili;
- far eseguire agli agenti **codice non fidato** in isolamento;
- collegare gli agenti ai sistemi aziendali con **permessi minimali e temporanei**.

Vediamo come questi pezzi si incastrano nella piattaforma.

---

## Dal “web di pagine” al full‑stack: Vercel Services
Vercel nasce come infrastruttura per pagine, caching e distribuzione globale. Con la crescita di applicazioni data‑powered, la piattaforma si è estesa verso server, API e database. Oggi l’obiettivo dichiarato è un **full‑stack reale**, dove front-end e back-end vivono la stessa esperienza di sviluppo e rilascio.

Il problema pratico che molti team conoscono bene è l’assemblaggio: microservizi, code, job asincroni, database e integrazioni finiscono spesso su piattaforme diverse e richiedono wiring manuale (reti, credenziali, preview, ambienti di test).

Con **Vercel Services** l’idea è riportare tutto sotto un flusso unico:

- **Sviluppo locale unificato**: un comando (es. `vc dev`) avvia l’insieme dei servizi necessari per l’applicazione.
- **Preview “end‑to‑end”**: ogni commit genera una preview URL per *l’intera* app, non solo per il front-end. Anche cambiamenti back-end-only hanno un ambiente completo da validare.
- **Comunicazione privata tra servizi**: i servizi possono parlarsi internamente senza “passare” dalla rete pubblica.

La conseguenza più interessante, soprattutto per chi lavora su architetture distribuite, è poter far convivere:

- front-end Next.js;
- back-end in TypeScript **e** Python (framework come FastAPI/Flask oltre a Express/Hono);
- workflow asincroni long-running;
- code che macinano grandi volumi;
- database gestiti e integrazioni.

In sostanza: la preview deployment non è più solo un modo elegante di rivedere una UI, ma diventa un **ambiente di test completo** per sistemi full‑stack.

---

## Infrastruttura agentica: tre livelli che cambiano le aspettative
Quando dentro un’app entrano agenti che ragionano, pianificano e agiscono, l’infrastruttura deve supportare una nuova “unità operativa”: non più solo request/response, ma processi che:

- durano minuti/ore/giorni;
- chiamano più modelli;
- generano ed eseguono codice;
- necessitano accesso controllato a strumenti e dati.

Il modello che emerge si può riassumere in tre layer:

1. **Dove i coding agent deployano**: una piattaforma adatta ad automazione, preview rapide e rollback.
2. **Dove si costruiscono e si eseguono agenti propri**: runtime, workflow, sandbox, accesso ai modelli.
3. **Una piattaforma che si auto‑ottimizza con agenti**: usare segnali di produzione (osservabilità, anomalie) per arrivare a suggerimenti operativi e cambiamenti proposti (es. PR) invece di soli alert.

Per chi fa frontend, il punto 1 è già familiare: preview per ogni commit. La novità è che questa proprietà diventa cruciale anche per gli agenti: un agente che “verifica” il proprio lavoro ha bisogno di una URL reale dove testare. E un agente che sperimenta ha bisogno di rollout sicuri (feature flag, rollback immediato) senza passare da dashboard.

---

## AI SDK: astrazione stabile per modelli e streaming
La base applicativa per integrare modelli, tool invocation e streaming rimane la DX.

L’**AI SDK** si posiziona come toolkit **model‑agnostic** e **provider‑agnostic** per TypeScript e Python, con un obiettivo pragmatico: permettere di cambiare modello (o usare modelli diversi per task diversi) senza riscrivere la logica di prodotto.

I vantaggi tipici in un’app/agent sono:

- streaming gestito in modo consistente;
- fallback tra modelli;
- output strutturati (utile quando il risultato deve alimentare UI o pipeline);
- facilità di sperimentazione per ottimizzare costo/qualità.

---

## AI Gateway: i token come “CDN” (token delivery network)
Se nel web tradizionale il problema era servire asset da un origin sotto picchi globali, nell’AI moderna il parallelismo è chiaro: i “nuovi origin” sono i model provider, e i **token** diventano una dipendenza di produzione.

Il punto è che “chiamare direttamente il provider” scala male per motivi noti:

- rate limit e variabilità operativa;
- latenza geografica;
- costi e controllo della spesa;
- osservabilità frammentata;
- necessità di instradare su più modelli.

L’**AI Gateway** affronta questo trattando il traffico AI come infrastruttura:

- routing e failover;
- un’interfaccia unificata verso molti provider e modelli;
- spend tracking e osservabilità granulare;
- policy centralizzate;
- (per contesti enterprise) opzioni come zero data retention.

Un aspetto che impatta direttamente l’architettura degli agenti: in produzione non si usa quasi mai “un solo modello”. Le applicazioni agentiche tipicamente **instradano su decine di modelli** in base al task (retrieval/summarization, reasoning, generazione immagini, ecc.). In questo scenario, il routing non è un optional: è *il modo* in cui si opera.

---

## Workflow SDK: durabilità per processi long‑running
La parte più antipatica dei job lunghi non è implementare i passi “felici”, ma gestire ciò che inevitabilmente accade:

- timeout;
- connessioni interrotte;
- retry mal progettati che duplicano side effects;
- perdita di stato;
- necessità di checkpoint e ripresa.

Il **Workflow SDK** introduce una primitiva di **durabilità**: workflow che possono sospendersi, riprendere, mantenere stato e gestire retry in modo nativo.

È la base per:

- ETL e sincronizzazioni periodiche;
- orchestrazione di agenti che fan‑out su molte chiamate;
- flussi con “human in the loop” (pause in attesa di approvazione o input).

Per un prodotto frontend moderno questo significa poter offrire UI che avviano processi lunghi (es. generazione contenuti, audit, import massivi) senza costruire a mano una torre di queue + state store + scheduler.

---

## Vercel Sandbox: esecuzione sicura di codice generato
Gli LLM sanno scrivere codice, ma quel codice è **non fidato**. Farlo girare nello stesso ambiente con accesso a sistemi di produzione è un anti‑pattern pericoloso.

Qui entra **Vercel Sandbox**: un ambiente isolato (micro‑VM) pensato per eseguire codice in modo sicuro, lo stesso tipo di isolamento che ha reso scalabile il concetto di build e preview deployments.

Caratteristiche chiave per casi agentici:

- file system e boundary di sicurezza;
- workload dinamici real‑time;
- supporto Docker;
- possibilità di installare dipendenze e avviare servizi di test (es. Redis/Postgres) dentro l’isolamento.

In pratica: l’agente può generare uno script, eseguirlo, verificare output e produrre un risultato — senza esporre credenziali o risorse sensibili.

---

## Vercel Connect: integrazioni con token short‑lived e scope minimo
Un agente diventa utile solo quando può agire sui sistemi reali: CRM, issue tracker, data warehouse, chat aziendali.

Il problema tipico delle integrazioni “fatte in casa” è la gestione delle credenziali:

- token long‑lasting;
- permessi troppo ampi;
- token legati a un utente umano (quindi l’agente eredita tutto ciò che può fare quella persona);
- scarsa visibilità su come le credenziali vengono usate.

**Vercel Connect** affronta il tema con un building block orientato a sicurezza e governance:

- token **temporanei** (short‑lived);
- permessi **minimamente necessari** (minimally scoped);
- integrazione con l’osservabilità per capire come e quando i token vengono usati;
- connettori pronti (Slack, GitHub, Linear, Salesforce, Snowflake, ecc.) e possibilità di crearne via OAuth/API key.

Per un team frontend/full‑stack questo è particolarmente rilevante quando si costruiscono “agent UI” dentro app interne: l’esperienza utente può essere semplice (un bottone “aggiorna CRM”, “apri issue”, “riassumi conversazione”), ma dietro serve un modello di permessi robusto.

---

## Implicazioni pratiche per chi costruisce prodotti web
Mettendo insieme i pezzi, emerge una direzione chiara:

- La **preview deployment** diventa il centro della validazione non solo per la UI, ma per back-end, workflow e integrazioni.
- I **token AI** si gestiscono come traffico di rete: routing, osservabilità e policy prima del “provider scelto”.
- I workflow lunghi vanno progettati con **durabilità** come requisito, non come patch.
- Il codice generato dagli agenti deve avere un **luogo sicuro** dove girare.
- Le integrazioni devono nascere con **scoping e TTL** delle credenziali, non con token permanenti.

### Sintesi
L’evoluzione più interessante non è “aggiungere AI” a un’app, ma rendere l’infrastruttura capace di sostenere applicazioni che eseguono piani, chiamano strumenti, persistono stato e operano su sistemi esterni in modo affidabile. Il risultato è una piattaforma che tratta agenti e servizi come componenti di prima classe: sviluppabili localmente, previewabili end‑to‑end, osservabili e governabili. In un mondo dove si scrive meno codice a mano, la differenza la fa quanto velocemente e in sicurezza si riesce a portare un’idea in produzione.
