---
title: "Costruire un “LLM Judge” di base per le tue eval: regole oggettive + valutazioni soggettive"
subtitle: "Un approccio pratico in TypeScript: Zod per i controlli deterministici, un modello come giudice per criteri qualitativi, e un formato unico di risultato PASS/FAIL con rationale."
description: "Quando inizi a valutare output generati da modelli, alcune verifiche sono semplici (schema JSON, vincoli hard), altre sono inevitabilmente qualitative (tono, brand fit, tossicità). In questo articolo vediamo come strutturare un giudice automatico “ibrido”: prima regole oggettive con Zod e utility functions, poi un LLM configurato come giudice con rubric rigorosa. L’obiettivo è ottenere risultati ripetibili, economici da far girare spesso, e soprattutto azionabili: PASS/FAIL con motivazione."
publishedAt: 2026-04-29
tags: ["eval-llm","zod-schema","typescript-testing","prompt-rubric","gemini-flash"]
---
## Perché un “judge” automatico (e perché ibrido)

Quando metti in piedi un sistema di valutazione per output generati (risposte, JSON strutturati, riassunti, testi “in stile”), ti scontri subito con due famiglie di requisiti:

1. **Oggettivi e verificabili**: lo schema JSON è valido? sono presenti tutti i campi? il testo rispetta una lunghezza massima? ci sono parole proibite?
2. **Soggettivi/qualitativi**: il tono è coerente col brand? il contenuto è potenzialmente tossico? è “utile” o solo verboso?

Il modo più robusto per automatizzare queste eval è **separare i controlli deterministici da quelli qualitativi**:

- **Regole hard**: rapide, ripetibili, a costo quasi zero. Output: PASS/FAIL.
- **LLM come giudice**: per ciò che richiede ragionamento semantico. Output: PASS/FAIL + motivazione.

L’idea chiave è avere una pipeline che **prima boccia su regole oggettive**, e solo dopo (se ha senso) invoca il giudice LLM.

---

## Step 1: controlli oggettivi con Zod + utility functions

Per gli output strutturati, **Zod** è una scelta naturale in TypeScript: ti permette di validare JSON, produrre errori utili e mantenere lo schema vicino al codice.

Esempio concettuale:

- Validazione dello schema (campi, tipi, opzionalità)
- Controlli “hard rules” non esprimibili comodamente nello schema (es. `maxItems`, pattern extra, vincoli tra campi)

Questa parte dovrebbe tornare un risultato minimale e azionabile: **PASS o FAIL**.

### Perché PASS/FAIL invece di punteggi

I punteggi numerici (1–10) sono comodi sulla carta, ma nella pratica tendono a diventare rumorosi e poco utili: sia gli esseri umani sia i modelli spesso **si “ammassano” sui valori centrali** per prudenza. Un’etichetta binaria, se supportata da una buona rubric e da una motivazione, è più facile da usare in CI e da tracciare nel tempo.

---

## Step 2: scegliere il modello “giudice” (trade-off realistici)

Un judge deve avere **buon ragionamento**, ma anche essere:

- **veloce**, per poter girare spesso
- **economico**, per sperimentare e iterare

Una strategia comune:

- usare un modello **più economico** per i controlli quotidiani (PR/commit)
- usare un modello **più potente** per test di release o regressioni importanti

Oppure partire con un modello molto forte e poi “scalare giù” quando la rubric è stabile.

Molti team adottano modelli “Flash”/rapidi per il loop quotidiano: l’importante è che il pattern sia replicabile con qualunque provider/modello.

---

## Step 3: configurare il giudice per consistenza

Per un judge, la priorità è **ripetibilità**.

- In generale, **temperature a 0** aiuta a ridurre varianza e comportamenti creativi.
- Per alcuni modelli orientati al ragionamento, può essere più efficace mantenere la temperatura di default e alzare parametri equivalenti a un **thinking level più alto** (quando disponibili), in modo da migliorare la qualità del giudizio senza introdurre casualità gratuita.

La regola pratica: *prima rendi stabile il comportamento, poi ottimizzi costi e latenza*.

---

## Step 4: un tipo di risultato unico (regole e judge parlano la stessa lingua)

In TypeScript conviene definire un **unico tipo di risultato** per tutte le eval, sia rule-based sia LLM-based. Questo semplifica pipeline, report e metriche.

Caratteristiche minime consigliate:

- `label`: `'PASS' | 'FAIL'`
- `rationale`: stringa con motivazione (soprattutto per i FAIL)

Il campo `rationale` è fondamentale: senza spiegazione, il FAIL è difficile da debuggare e peggiora l’esperienza di chi deve correggere prompt o logica.

---

## Step 5: il prompt del giudice (persona + rubric + esempi)

Il prompt è ciò che trasforma un LLM generico in un **valutatore affidabile**. Tre elementi aiutano molto:

### 1) Persona “esperta”
Dai un ruolo chiaro (es. “revisore QA”, “editor tecnico”, “moderatore contenuti”) coerente con ciò che stai giudicando.

### 2) Rubric severa e non ambigua
Definisci criteri di PASS/FAIL con regole chiare. Se il criterio è “brand fit”, esplicita cosa significa in termini osservabili (tono, lessico, claim ammessi/vietati, formalità, ecc.).

### 3) Few-shot con esempi di PASS e FAIL
Gli esempi riducono interpretazioni creative della rubric.

Un dettaglio importante: **tieni gli esempi separati dai dati reali di test**, per evitare che il giudice “imbrogli” (pattern matching sui tuoi casi).

### Ordine dell’output
Chiedi al giudice di:

1. ragionare e giustificare (motivazione)
2. produrre la label finale `PASS` o `FAIL`

Anche qui l’obiettivo non è un saggio: è un giudizio conciso, verificabile e utile.

---

## Architettura consigliata (in breve)

Una pipeline pragmatica spesso funziona così:

1. **Parse e validazione JSON con Zod** → se FAIL, stop.
2. **Hard rules** (utility functions) → se FAIL, stop.
3. **LLM judge** per criteri qualitativi → PASS/FAIL + rationale.
4. **Report unificato** (stesso formato ovunque) → facile da salvare, confrontare, mettere in CI.

---

## Cosa manca per renderlo “affidabile” sul serio

Un judge automatico non è “vero” finché non sai se è allineato a ciò che farebbe una persona. Il passo successivo, quando hai il prototipo funzionante, è **calibrarlo su giudizi umani** (campioni etichettati, accordo inter-annotator, soglie, regressioni).

Ma già con questo setup puoi ottenere un enorme salto di qualità: eval ripetibili, motivazioni utili e un workflow sostenibile per iterare su prompt e output.
