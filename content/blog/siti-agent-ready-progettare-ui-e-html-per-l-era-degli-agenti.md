---
title: "Siti “agent-ready”: progettare UI e HTML per l’era degli agenti"
subtitle: "Quando la navigazione diventa delega, la differenza la fanno semantica, stabilità dell’interfaccia e strumenti strutturati come WebMCP."
description: "Per decenni abbiamo ottimizzato i siti per persone: UI, performance, SEO, accessibilità. Oggi entra in gioco un nuovo “utente”: l’agente AI che esegue task complessi al posto nostro, dentro una sessione reale di browser. In questo articolo vediamo come un agente interpreta una pagina (visuale, DOM, accessibility tree), quali scelte di design e markup rendono un’interfaccia più affidabile e perché WebMCP punta a ridurre ambiguità e fragilità offrendo tool strutturati agli agenti, senza creare una “seconda web”."
publishedAt: 2026-05-22
tags: ["WebMCP","HTML semantico","accessibility tree","UI stabile","agenti AI","tool per browser"]
---
Negli ultimi 30 anni abbiamo costruito siti per esseri umani: interfacce curate, performance, SEO, accessibilità. Tutto questo resta fondamentale, ma non è più l’intero quadro. Sempre più spesso l’utente non “naviga” direttamente: delega.

Nell’era degli agenti, una parte crescente delle interazioni con il web avviene tramite AI agent che:

- interpretano la pagina,
- pianificano una sequenza di azioni,
- cliccano controlli reali,
- completano flussi multi-step (con approvazione umana sui passaggi importanti).

Se un agente non riesce a capire il tuo sito, l’utente perde automazione e tu perdi conversione. La domanda quindi diventa: **quanto è “leggibile” e “azionabile” il tuo frontend per un agente?**

---

## Come “vede” un agente la tua pagina
Un agente non guarda il sito come lo guardiamo noi. In pratica, lavora su rappresentazioni machine-readable. Tipicamente, usa tre canali principali.

### 1) Screenshot + modello vision
L’agente può analizzare uno screenshot e inferire cosa “sembra” essere cosa: una search bar in alto, un form al centro, un bottone primario evidenziato.

**Pro:** utile quando la struttura è confusa ma la UI è chiara visivamente.

**Contro:** è più lento e costoso (token/compute). Di solito è una strategia di fallback.

### 2) DOM + testo
Il DOM fornisce gerarchia, relazione tra elementi e stringhe testuali. Esempio: se un pulsante “Compra ora” è *dentro* un container prodotto, l’agente può collegarlo a quel prodotto specifico.

Qui conta tantissimo:

- usare elementi corretti (es. `button` invece di `div`),
- una gerarchia coerente,
- attributi che chiariscono struttura e scopo.

### 3) Accessibility tree
È una vista “distillata” della pagina: ruoli, nomi accessibili, stati dei controlli. È ciò che usano anche gli screen reader.

Punto chiave: **l’accessibilità è per le persone**, ma gli agenti ne beneficiano direttamente. Per un agente, l’accessibility tree è una mappa funzionale che ignora il rumore visivo e mette in primo piano l’utilità.

---

## UI: rendere le azioni evidenti e verificabili
Quando un utente delega a un agente, tende a passare da una “superficie agentica” (chat/assistente) al tuo sito per verificare cosa sta succedendo. Questo cambia alcune priorità di UX.

### Rendi le azioni visibili (meglio: *extra* visibili)
Evita funzionalità che producono solo cambiamenti “in background” difficili da verificare. Se l’utente non può controllare a colpo d’occhio la traiettoria dell’agente, aumenta la sfiducia e diminuisce la probabilità di completare il task.

### Mantieni layout stabile
La stabilità riduce il carico cognitivo anche per un agente. Se il CTA “Compra” cambia posizione a seconda della categoria prodotto, o se i filtri appaiono in posti diversi tra pagine simili, il flusso diventa più fragile e lento.

### Non nascondere i controlli azionabili
Il “next best action” non dovrebbe essere un enigma.

- CTA fondamentali dovrebbero essere **nel viewport** (o raggiungibili con uno scorrimento ragionevole).
- Evita controlli che compaiono solo su hover, dietro animazioni complesse o step extra.

Un dettaglio pragmatico: il solo `cursor: pointer` può dare un indizio, ma **non sostituisce** un markup semantico corretto.

---

## HTML semantico: il moltiplicatore più semplice
Se vuoi un sito più agent-ready senza inventarti una “web parallela”, il punto di partenza resta sorprendentemente classico: **tornare alle basi**.

### Usa i controlli giusti
- `button` e `a` comunicano azionabilità in modo nativo.
- Il browser li rende focusabili e attivabili da tastiera (Tab/Enter/Space).

Al contrario, un “finto bottone” con `div` richiede:

- `tabindex`,
- gestione manuale degli eventi tastiera,
- ruoli ARIA e stati,
- più superfici per bug e incoerenze.

### Usa le landmark e la struttura
Elementi come `header`, `nav`, `main`, `footer` aiutano a definire regioni logiche. Per un agente (e per tecnologie assistive) è un enorme vantaggio: riduce l’ambiguità su *dove* cercare cosa.

**Regola pratica:** se la tua UI è davvero solida con gli screen reader, sei già a metà strada verso la “agentic readiness”.

---

## Quando la semantica non basta: strumenti strutturati (WebMCP)
Anche con un HTML esemplare, un agente deve spesso sintetizzare segnali diversi (vision, DOM, accessibility tree) per risolvere intenti complessi: viaggi, prenotazioni, comparazioni, configurazioni prodotto, flussi lunghi.

L’idea di WebMCP è ridurre questa complessità offrendo **tool strutturati** esposti direttamente dal sito. In pratica:

- invece di “indovinare” quali click fare,
- l’agente può chiamare un’azione esplicita (es. applicare filtri, ottenere risultati correnti, aggiungere al carrello),
- con input/output definiti e meno ambiguità.

### WebMCP vs MCP: non sono la stessa cosa
È facile confonderli, ma rispondono a bisogni diversi:

- **WebMCP**: strumenti legati alla **tab** e al **contesto di navigazione** (sessione, cookie, stato di login). È browser-integrato e DOM-aware.
- **MCP**: strumenti esposti da un **server** (persistenti, disponibili “ovunque”), non dipendono dalla tab o dallo stato della pagina.

In breve: MCP parla bene con la tua infrastruttura; WebMCP rende “strumentabile” l’esperienza *live* del frontend dentro la sessione utente.

---

## Definire tool WebMCP: API imperativa e declarativa
Ci sono due approcci: JavaScript (imperativo) o form HTML (dichiarativo).

### API imperativa (JavaScript)
Il concetto è: registri un tool con nome, descrizione, schema input e una funzione `execute` che incapsula l’azione.

```js
navigator.modelContext.registerTool({
  name: 'add_todo_item',
  description: 'Aggiunge una voce alla lista delle cose da fare',
  inputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string' }
    },
    required: ['title']
  },
  execute: async ({ title }) => {
    await addTodoItem(title);
    return { ok: true };
  }
});
```

Nota importante: **nome e descrizione non sono “decorazione”**. Sono testo che l’agente userà per decidere *se* e *come* chiamare quel tool. Una tassonomia confusa o descrizioni vaghe peggiorano l’affidabilità.

Per gestire la vita del tool (registrato solo quando serve), puoi legarlo a un `AbortController` e disattivarlo quando cambia contesto.

### API declarativa (HTML form)
Se hai già dei form, l’approccio dichiarativo è particolarmente interessante: aggiungi attributi per nome e descrizione del tool e il browser può esporlo come strumento.

Qui torna utile anche descrivere i parametri: aiuta l’agente a compilare correttamente gli input.

---

## Checklist pratica per audit “agent-ready”
Una mini-lista di controllo da applicare su pagine critiche (search, PDP, checkout, impostazioni):

1. **Azioni primarie sempre visibili** e non solo su hover/animazioni.
2. **CTA coerenti** tra pagine simili (posizione, etichetta, gerarchia visiva).
3. **Controlli nativi** (`button`, `a`, `input`, `select`) al posto di div interattivi.
4. **Landmark semantiche** (`main`, `nav`, ecc.) e heading ben strutturati.
5. **Nomi accessibili** chiari (etichette, `aria-label` dove serve, stati corretti).
6. Se il flusso è complesso: valuta **tool strutturati** per azioni ad alto valore (filtri, “get results”, “add to cart”, “compare”).

---

## Direzione: una web migliore, non una web diversa
La parte interessante è che la maggior parte delle scelte che rendono un sito più “agent-ready” sono le stesse che lo rendono più usabile e accessibile per le persone.

L’obiettivo non è costruire un frontend “per agenti” separato: è costruire un frontend **più chiaro, più semantico, più stabile** — e, quando serve, offrire strumenti espliciti che riducono l’ambiguità delle interazioni complesse.
