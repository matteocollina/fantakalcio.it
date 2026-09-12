---
title: "Smettere di “bruciare token”: il metodo agentico per usare l’AI nel coding senza perdere qualità"
subtitle: "L’AI accelera davvero solo quando resti responsabile di specifiche, giudizio e verifica. Il resto è rumore (e debito tecnico)."
description: "Molti usano l’AI per scrivere codice come se bastasse un prompt gigante per arrivare in produzione. Funziona per demo e prototipi, ma quando serve software reale emergono i limiti: contesto incompleto, scelte architetturali discutibili, regressioni silenziose. Un approccio “agentico” ribalta il paradigma: tu possiedi spec, gusto, decisioni e verifiche; l’AI esegue, esplora e accelera dentro un sistema di guardrail. In questo articolo vediamo un workflow pratico in 4 mosse: stringere lo scope, definire la verifica prima di implementare, costruire un ambiente riusabile per l’agente e procedere per checkpoint piccoli e controllabili."
publishedAt: 2026-06-26
tags: ["coding agentico","spec e requisiti","verifica automatizzata","workflow con LLM","qualità del codice"]
---
## L’equivoco più costoso: un prompt enorme non è ingegneria
Negli ultimi mesi si è diffusa l’idea che il futuro del coding sia: *scrivi un prompt gigante → aspetta → deploy*. È una scorciatoia che può produrre qualcosa che “sembra software”, ma raramente produce **software affidabile**.

Il motivo è semplice: gli strumenti generativi **non eccellono nell’understanding**. Possono essere bravissimi a:
- riscrivere pezzi di codice,
- generare boilerplate,
- proporre fix,
- eseguire refactor locali,

…ma non possono sostituire il tuo ruolo di “regista”: definire cosa va costruito, cosa è fuori scope, quali trade-off accetti e soprattutto **come dimostri che il risultato è corretto**.

Se deleghi anche queste responsabilità, non stai “risparmiando tempo”: stai solo spostando il costo più avanti, sotto forma di bug, regressioni e debito tecnico.

---

## Vibe coding vs approccio agentico: alzare il pavimento o costruire fondamenta
C’è una differenza netta tra:
- **vibe coding**: l’AI alza il “pavimento” e ti permette di ottenere rapidamente output che *assomigliano* a feature;
- **ingegneria agentica**: usi agenti e modelli per accelerare *le stesse regole* della buona ingegneria software (spec, test, revisione, osservabilità), mantenendo il controllo.

L’AI ti rende più veloce **solo** se tu resti responsabile di:
- **spec** (cosa stiamo costruendo e perché),
- **taste** (standard di qualità, coerenza, ergonomia),
- **judgment** (trade-off e scelte),
- **verification** (prove, non sensazioni).

Un punto spesso ignorato: “andare più veloci” può voler dire anche **andare più veloci nella direzione sbagliata**. Per software reale, velocità senza verifica è una trappola.

---

## Software 1.0, 2.0, 3.0: perché oggi il contesto è il nuovo codice
Un modo utile per orientarsi è pensare a tre livelli:

- **Software 1.0**: codice esplicito scritto in linguaggi tradizionali (TypeScript, Go, Rust…). Tutto è ispezionabile e deterministico: cambi una riga, cambi il comportamento.
- **Software 2.0**: programmi “scritti” come pesi di una rete neurale. Non modifichi istruzioni, ma ottimizzi un comportamento tramite dati/obiettivi.
- **Software 3.0**: il modello linguistico diventa un interprete programmabile tramite **prompt e contesto**. La finestra di contesto è una specie di RAM: ciò che ci metti dentro determina come “ragiona” l’agente.

Il fatto che tu possa “programmare in linguaggio naturale” non implica che tu stia facendo ingegneria software. Significa che hai un nuovo tipo di leva: **strutturare contesto, vincoli e prove**.

E qui arriva il punto pratico: i modelli sono “jagged”. Possono essere eccezionali su task complessi e poi inciampare su banalità. Per questo serve un workflow robusto.

---

## Il metodo agentico in 4 mosse (per smettere di sprecare token)
Quello che funziona davvero non è chiedere di più al modello. È progettare un processo dove l’AI lavora *dentro* un sistema.

### 1) Trasforma lavoro vago in uno scope stretto (Agent Spec)
Prompt tipo: “Fammi una dashboard” produce quasi inevitabilmente software vago.

Una **spec utile per un agente** contiene almeno:
- obiettivo (che decisione abilita? quale problema risolve?),
- utenti e casi d’uso principali,
- cosa è **in scope** / **out of scope**,
- interfacce e shape dell’implementazione (input/output, API, routing, stati),
- vincoli (performance, accessibilità, librerie consentite, compatibilità),
- **acceptance criteria** verificabili,
- checkpoint piccoli.

Punto chiave: prima di inventare, l’agente deve cercare la “repo truth”. Quindi: esplorare file rilevanti, script, convenzioni, test esistenti, pattern architetturali. Le domande all’umano vanno ridotte alle sole informazioni **non ricavabili dal repository**.

### 2) Definisci la verifica *prima* dell’implementazione (Agent Verify)
La qualità non è una sensazione: è un insieme di segnali.

Un piano di verifica solido:
- stabilisce criteri di valutazione upfront (cosa significa “funziona”),
- elenca i controlli disponibili (unit/integration/e2e, lint, typecheck, build),
- sceglie il check minimo efficace (non over-testing, ma evidenze mirate),
- aggiunge segnali extra dove possibile (screenshot, risposta API, stati DB, URL di preview, log),
- per cambi complessi, usa una revisione indipendente (anche con un secondo agente “a contesto zero”) che guardi spec, diff e prove.

E soprattutto: report onesto.
- check passati,
- check falliti,
- check non eseguiti.

### 3) Crea un “ambiente” riusabile per l’agente (Agent Environment)
Se ogni task riparte da zero, paghi continuamente token per far riscoprire le stesse cose.

Un ambiente agent-friendly include:
- istruzioni durevoli (regole del repo, convenzioni, cosa non fare),
- documentazione minima su architettura e flussi,
- confini di sicurezza (cosa può modificare senza approvazione: *idealmente nulla*),
- una knowledge base con esempi canonici (pattern di componenti, chiamate API, gestione errori, testing).

In pratica: investi in un piccolo set di file guida (tipo `AGENTS.md`, note di architettura, checklist di PR). Non è burocrazia: è riduzione di entropia.

### 4) Esegui a checkpoint piccoli, non come “handoff” unico (Build Loop)
Il loop agentico orchestra le tre parti sopra:
1. spec chiara e “decision-ready”,
2. verifica pianificata,
3. ambiente aggiornato,
4. implementazione per step con checkpoint.

Questo evita due fallimenti tipici:
- PR gigantesche impossibili da revisionare,
- direzione sbagliata scoperta troppo tardi.

---

## Cosa cambia davvero per chi fa frontend
Nel frontend l’illusione del “sembra funzionare” è particolarmente pericolosa: UI belle possono nascondere bug di stato, edge case, accessibilità, performance e regressioni.

Applicare l’approccio agentico significa, ad esempio:
- definire acceptance criteria concreti (keyboard navigation, focus management, loading/error states, responsive breakpoints),
- chiedere prove (screenshot comparativi, storybook test, e2e su flussi critici),
- imporre vincoli di coerenza (design system, naming, patterns),
- spezzare in milestone (layout → state management → data fetching → a11y → test).

Non è “meno creativo”: è creatività con guardrail.

---

## Sintesi: l’AI accelera l’esecuzione, non sostituisce la responsabilità
Il modo più efficace per non sprecare token è smettere di trattare l’AI come un ingegnere autonomo e iniziare a trattarla come **un acceleratore dentro un processo**.

Se ti porti a casa una sola regola pratica, è questa: **puoi delegare l’esecuzione, non la comprensione**.

Stringi lo scope, definisci la verifica prima di scrivere codice, costruisci un ambiente riusabile e lavora a checkpoint piccoli. Otterrai meno “slop”, meno sorprese in review e un incremento reale di produttività—quello che regge anche quando il progetto diventa grande e la qualità conta davvero.
