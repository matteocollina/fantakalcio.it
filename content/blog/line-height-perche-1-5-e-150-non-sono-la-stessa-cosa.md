---
title: "line-height: perché 1.5 e 150% non sono la stessa cosa"
subtitle: "Due sintassi che sembrano equivalenti, ma cambiano completamente il modo in cui il browser calcola ed eredita l’interlinea."
description: "In CSS, line-height impostato come numero senza unità (es. 1.5) e come percentuale (es. 150%) può produrre risultati diversi, soprattutto con font-size che variano tra componenti o con tipografia fluida. La differenza sta in quando e dove avviene il calcolo: per-elemento nel caso unitless, “congelato” e poi ereditato nel caso percentuale. Vediamo cosa significa in pratica e quale scelta è più robusta."
publishedAt: 2026-07-23
tags: ["tipografia-css","line-height","ereditarietà-css","fluid-typography","debug-devtools"]
---
In CSS è facile dare per scontato che:

```css
line-height: 1.5;
```

sia equivalente a:

```css
line-height: 150%;
```

Visivamente, spesso *sembra* vero. Finché non inizi a mischiare dimensioni di testo diverse (heading, didascalie, piccoli paragrafi) o finché non adotti una tipografia fluida con `clamp()`/viewport units. A quel punto possono comparire spaziature “strane”: blocchi troppo ariosi o troppo compatti, spesso proprio nelle aree con testo più piccolo o più grande.

La causa è una differenza fondamentale: **numero unitless e percentuale non vengono calcolati e ereditati nello stesso modo**.

---

## Numero senza unità: il moltiplicatore che si ricalcola per ogni elemento
Quando scrivi:

```css
body { line-height: 1.5; }
```

quel `1.5` non è una lunghezza. È un **fattore di scala**.

- Il browser lo tratta come un valore “relativo” al `font-size` dell’elemento.
- **Quando un elemento ha un font-size diverso dal genitore**, il calcolo dell’interlinea viene rifatto *per quell’elemento*.

In pratica:

- Un paragrafo da `24px` avrà `line-height` calcolata a `36px`.
- Un testo da `14px` avrà `line-height` calcolata a `21px`.

L’idea chiave: **il valore ereditato è il moltiplicatore**, non un numero in pixel già risolto. Questo rende il comportamento molto coerente in un sistema tipografico con scale diverse.

---

## Percentuale: la linea viene “risolta” prima e poi ereditata come valore calcolato
Quando scrivi:

```css
body { line-height: 150%; }
```

la percentuale viene calcolata rispetto al `font-size` dell’elemento su cui la imposti (qui: `body`). Fin qui tutto normale.

Il problema emerge nell’ereditarietà: **ai figli non viene ereditata la percentuale “150%” come moltiplicatore**, ma un **valore calcolato** (una lunghezza, di fatto).

Quindi se sul `body` il calcolo produce, ad esempio, `24px` di interlinea (perché il body ha un certo `font-size`), quel `24px` può finire per essere riutilizzato anche da elementi discendenti *anche se* hanno un `font-size` diverso.

Risultato tipico:

- su testo piccolo l’interlinea risulta troppo grande (se eredita un valore “pensato” per un font più grande);
- su testo grande l’interlinea può risultare troppo stretta (se eredita un valore “pensato” per un font più piccolo);
- con tipografia fluida, il fenomeno si nota di più perché i numeri intermedi diventano meno intuitivi e cambiano al variare della viewport.

---

## Come accorgersene (debug rapido)
Quando qualcosa “non torna”, i DevTools aiutano subito: seleziona elementi con dimensioni di font diverse e controlla il `line-height` effettivo.

- Con `line-height: 1.5`, vedrai valori calcolati diversi in base al `font-size` di ciascun elemento.
- Con `line-height: 150%`, potresti vedere **lo stesso valore calcolato** ripetersi dove ti aspetteresti proporzioni diverse.

---

## Quale usare nella pratica?
Per un layout tipografico robusto, soprattutto in design system o UI componentizzate, la regola pratica è semplice:

- **Preferisci `line-height` unitless** (es. `1.4`, `1.5`, `1.6`) come impostazione di base.
  - È più “elastica”: si adatta automaticamente quando cambia il font-size.
  - È più prevedibile quando componenti e varianti tipografiche convivono.

La percentuale può avere senso in casi specifici, ma è più facile che introduca effetti collaterali quando l’ereditarietà entra in gioco.

---

## Sintesi conclusiva
`line-height: 1.5` e `line-height: 150%` non sono intercambiabili: il primo si comporta come un **moltiplicatore ereditabile** che viene ricalcolato per ogni elemento, il secondo tende a trasformarsi in un **valore già risolto** che può essere ereditato “così com’è”.

Se l’obiettivo è mantenere proporzioni coerenti tra testi di dimensioni diverse (soprattutto con tipografia fluida), impostare un `line-height` **senza unità** è la scelta più sicura e stabile.
