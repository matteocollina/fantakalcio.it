---
title: "Un “News Agent” per React Native: aggiornamenti automatici su Slack con Eve"
subtitle: "Dai repository GitHub a un riepilogo utile ogni mattina: architettura, prompt, filtri e integrazione, senza over-engineering."
description: "Progettare un agente che monitora l’attività su repository React/React Native/Expo e pubblica su Slack un riepilogo quotidiano davvero leggibile richiede soprattutto buone scelte di architettura: cosa considerare “notizia”, come filtrare rumore (CI, chore), come gestire contesto e sub-agent, e come separare lo strato “cervello” dal canale (Slack, web, ecc.). In questo articolo vediamo un approccio pragmatico con Eve: dal setup del modello custom, alla schedulazione, fino alla forma finale dei messaggi su Slack (card + thread)."
publishedAt: 2026-07-30
tags: ["Eve agent","Slack bot","GitHub activity","prompt engineering","contesto LLM","sub-agent"]
---
Costruire un agente che “legge” GitHub e ogni giorno ti consegna un riepilogo davvero utile sembra un problema di AI. In realtà è (soprattutto) un problema di prodotto e di architettura: **cosa consideri informazione**, come elimini il rumore e come fai arrivare il risultato nel posto giusto (Slack, web, Discord…)

L’obiettivo concreto è semplice:

- monitorare una lista di repository (es. React, React Native, Expo, Metro, Hermes…)
- individuare ciò che è “newsworthy” (PR con cambi di API, fix rilevanti, RFC/proposte, discussioni importanti)
- filtrare attività poco utile (CI, chore, refactor puramente interno, aggiornamenti automatici)
- pubblicare un riepilogo **quotidiano** su Slack in un formato leggibile: una “card” e, sotto, un thread con gli item per repo

Di seguito trovi un approccio pragmatico per arrivarci con Eve, mantenendo il sistema estendibile e senza cadere nell’over-engineering.

---

## 1) Progettare l’output: “card + thread” batte “muro di testo”

Il primo dettaglio che cambia tutto è decidere *come* vuoi consumare l’informazione.

Un formato efficace su Slack è:

1. **Messaggio principale** (la card): titolo del digest, data, scope (quali repo), eventuale summary generale.
2. **Thread** con un messaggio per ciascun repository, contenente:
   - 3–8 punti massimi (dipende dal volume)
   - link diretti a PR/discussioni
   - perché è importante (una riga)
   - eventuali “azioni” (es. “da tenere d’occhio”, “breaking change potenziale”)

Questo formato ha due vantaggi:

- non “intasa” il canale con 20 messaggi scollegati
- il thread rimane consultabile e riassumibile, anche a distanza di giorni

---

## 2) Separare “cervello” e “canale”: l’agente non deve essere uno Slack-bot

Una scelta architetturale che ripaga subito: **l’agente produce un output strutturato**, non “messaggi Slack”.

Esempio:

- l’agente restituisce un oggetto (o JSON) del tipo:
  - `title`, `dateRange`
  - `repos: [{ name, items: [{ title, url, type, impact, summary }] }]`

Poi:

- un layer di integrazione lo renderizza su Slack (card + thread)
- lo stesso output può essere usato da una UI web, da Discord o da email

Questo evita di legare prompt e logica al trasporto: se cambi canale, non riscrivi l’agente.

---

## 3) Repo supportati: hardcoded nel prompt o in storage?

Per un prototipo, mettere la lista dei repository nel prompt (o in config) è spesso la scelta migliore.

Sì, potresti esternalizzare tutto (DB con tabella `supported_repos`, tool call per caricarli, UI di gestione…), ma:

- aggiungi roundtrip e complessità
- aumenti il costo in token e la superficie di errore
- stai costruendo un “prodotto di configurazione” prima di validare l’utilità

Regola pratica:

- **config statica finché non fa male**
- quando la lista cambia spesso o serve delegare la gestione a non-dev, allora ha senso esternalizzare

---

## 4) “Notizie” vs “rumore”: il filtro è più importante del riassunto

Se prendi l’attività GitHub “as-is”, l’agente ti restituisce un digest inutilizzabile:

- bump di dipendenze
- fix a CI
- rename di file
- chore e housekeeping
- commenti automatici di bot

Quindi la pipeline tipica diventa:

1. **Raccolta dati**: PR, issue, discussion, RFC/proposals (dipende dal repo)
2. **Pre-filtri deterministici** (prima dell’LLM):
   - escludi label come `ci`, `chore`, `dependencies`
   - escludi path noti (es. `.github/`, `scripts/ci/`)
   - ignora autori bot
   - limita la finestra temporale
3. **Classificazione con LLM** (solo sul candidato “pulito”):
   - impatto: API / behavior change / perf / bugfix / tooling
   - “importance score”
4. **Selezione**: top-N per repo + eventuali “high impact” sempre inclusi

L’LLM dà il meglio quando:

- non deve “spazzare il pavimento”
- lavora su segnali già abbastanza puliti

---

## 5) Modello custom: dichiarare esplicitamente il contesto (context window)

Quando usi modelli “standard”, spesso il framework conosce già i limiti (token/context window). Con un modello custom o self-hosted, questa informazione può non essere disponibile automaticamente.

In quel caso è fondamentale:

- **dichiarare la context size** per permettere al runtime di gestire correttamente:
  - quando compattare la conversazione
  - quanta storia mantenere
  - come evitare errori di overflow

### Compaction: utile, ma da conoscere bene

Molti runtime gestiscono la **compaction**: quando si arriva vicino al limite del contesto (ad esempio al 90%), il sistema riassume parte della conversazione e sostituisce la storia con un summary.

È comodo, ma introduce trade-off:

- ogni compaction può perdere dettaglio
- un sistema “long running” compatta molte volte: l’errore si accumula
- si perdono spesso anche vantaggi di caching/contesto (dipende dall’implementazione)

Conclusione pratica: non progettare un agente che “vive per sempre” nello stesso contesto se non è necessario.

---

## 6) Quando usare sub-agent (e che differenza fa il sandbox)

Per evitare contesti enormi e ridurre il rischio di degradazione, conviene spezzare il lavoro:

- un “controller” pianifica
- sub-agent analizzano singoli repo o singole categorie (PR vs discussions)

Qui conta capire due modelli:

1. **Sub-agent dedicato**: ambiente isolato (tools e contesto propri). Ideale quando vuoi separazione netta.
2. **Copia fresca dell’agente root**: contesto nuovo ma stesso sandbox/tools. Utile quando vuoi mantenere artefatti e strumenti condivisi (ad esempio file temporanei o cache locale), ma ripartire con un prompt pulito.

È una distinzione che influisce su:

- riproducibilità
- costi token
- facilità di debugging

---

## 7) Scheduling: farlo ogni giorno senza trasformarlo in un sistema enorme

Un digest quotidiano è un job periodico. La scelta più semplice:

- cron (o scheduler della piattaforma di deploy)
- esecuzione server-side
- output inviato a Slack via API

La cosa importante è **rendere l’esecuzione idempotente**:

- calcola una `time window` chiara (es. ultime 24h in UTC, o “da ieri alle 09:00 CET”)
- salva un marker (timestamp/last run) per evitare buchi o duplicazioni

---

## 8) Slack: messaggi coerenti, link utili, zero fronzoli

Una buona integrazione Slack non è “mandare un testo”, ma produrre un oggetto consultabile:

- titolo chiaro
- bullet point sintetici
- link diretti (PR, discussion, RFC)
- indicazione di impatto (breaking/behavior/perf)

La regola d’oro: **ogni bullet deve rispondere a “perché mi interessa?”**

---

## Sintesi e implicazione pratica

Un news agent efficace non si misura dalla qualità “letteraria” del riassunto, ma da quanto bene:

- riduce rumore prima di chiamare il modello
- classifica e seleziona ciò che ha impatto reale (API, behavior, perf, bug)
- mantiene il contesto sotto controllo (compaction e sub-agent)
- separa output strutturato dal canale di pubblicazione

Se stai pensando di introdurre un agente simile nel tuo team, parti da un MVP: 3–6 repo, un digest al giorno, filtri deterministici aggressivi e un formato Slack ben progettato. Dopo una settimana avrai dati reali su cosa serve davvero automatizzare (e cosa sarebbe solo “burnare token”).
