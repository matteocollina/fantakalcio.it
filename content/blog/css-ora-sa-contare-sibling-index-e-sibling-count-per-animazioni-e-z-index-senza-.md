---
title: "CSS ora sa “contare”: sibling-index e sibling-count per animazioni e z-index senza hack"
subtitle: "Niente più catene di :nth-child, variabili scritte a mano o loop JS: due nuove funzioni CSS risolvono problemi ricorrenti con fratelli e liste."
description: "Due nuove primitive CSS, sibling-index() e sibling-count(), permettono di ottenere rispettivamente la posizione di un elemento tra i fratelli e il numero totale di fratelli. Risultato: stagger animation mantenibili, layering con z-index automatico (anche su avatar sovrapposti) e piccoli trick come palette colori basate su indice, senza toccare l’HTML e senza JavaScript."
publishedAt: 2026-09-09
tags: ["sibling-index","sibling-count","stagger animation","z-index","popover","HSL"]
---
Quando lavori con liste di elementi “fratelli” (voci di menu, card, avatar, step di una timeline), prima o poi finisci in uno di questi vicoli ciechi:

- vuoi uno **stagger** in animazione (ritardi progressivi), ma mantenere `:nth-child()` per 10/20 elementi è una fatica;
- vuoi un valore progressivo (delay, hue, z-index…) e ti ritrovi a **scrivere variabili a mano** nell’HTML (`--i: 1`, `--i: 2`, …);
- vuoi risolvere un problema di **sovrapposizione** e inizi a sparare `z-index: 9999` o a creare scale infinite.

Ora CSS ha due strumenti nativi per “contare” tra fratelli:

- `sibling-index()` → restituisce l’indice dell’elemento tra i suoi fratelli (1, 2, 3, …)
- `sibling-count()` → restituisce il numero totale di fratelli nel gruppo

Sono piccole aggiunte, ma cambiano parecchio il modo in cui si costruiscono micro-interazioni e layout sovrapposti.

---

## 1) Stagger animation senza :nth-child e senza variabili in HTML

Lo scenario classico: menu che entra/esce e vuoi che le voci compaiano una dopo l’altra.

### Il problema con gli approcci “vecchi”

- **Catena di `:nth-child()`**: funziona, ma è fragile. Aggiungi/rimuovi elementi e devi ricordarti di aggiornare il CSS.
- **`--i` in HTML**: più pulito di `:nth-child()`, ma stai spostando complessità nel markup (o devi comunque calcolarlo via JS).

### La soluzione: delay basato su `sibling-index()`

Puoi calcolare il delay direttamente in CSS:

```css
.menu li {
  --stagger: 80ms;
  transition-delay: calc(sibling-index() * var(--stagger));
}
```

Se non vuoi ritardo sul primo elemento (di solito è così), basta sottrarre 1:

```css
.menu li {
  --stagger: 80ms;
  transition-delay: calc((sibling-index() - 1) * var(--stagger));
}
```

Da qui in poi puoi applicare la transizione su ciò che ti serve (opacity, translate, ecc.) senza dover “mappare” manualmente ogni voce.

### Un dettaglio pratico: tempi più piacevoli con overlap

Uno stagger troppo “lento” può dare l’impressione che l’interfaccia sia macchinosa. Spesso conviene:

- mantenere una durata relativamente breve;
- distribuire delay piccoli;
- far sovrapporre le animazioni (non aspettare che una finisca prima di iniziare la successiva).

E già che ci sei, una **cubic-bezier** ben scelta spesso fa più differenza di quanto sembri: l’animazione risulta meno “lineare” e più naturale.

---

## 2) Palette automatiche: ruotare colori con l’indice del fratello

Un uso simpatico (non sempre essenziale, ma comodo) è generare variazioni di colore senza creare classi o varianti a mano.

Esempio con HSL:

```css
.avatar {
  --step: 22deg;
  --h: calc(sibling-index() * var(--step));
  background: hsl(var(--h) 70% 55%);
}
```

Se vuoi spostare tutta la palette (per evitare tonalità che non ti piacciono), basta aggiungere un offset:

```css
.avatar {
  --offset: 40deg;
  --step: 22deg;
  --h: calc(var(--offset) + sibling-index() * var(--step));
  background: hsl(var(--h) 70% 55%);
}
```

Lo stesso concetto vale con spazi colore più moderni (OKLCH, ecc.), cambiando la funzione colore.

---

## 3) Overlap di avatar e z-index “giusto” senza impazzire

Caso reale e frequente: avatar sovrapposti.

Visivamente, spesso si vuole che **quello più a sinistra stia sopra** (il primo “vince”), mentre l’ordine naturale di rendering tende a mettere sopra gli elementi più a destra.

### L’hack classico (da evitare)

Assegnare z-index decrescenti a mano:

```css
/* fragile e poco scalabile */
.avatar:nth-child(1) { z-index: 5; }
.avatar:nth-child(2) { z-index: 4; }
.avatar:nth-child(3) { z-index: 3; }
/* ... */
```

### La soluzione scalabile: `sibling-count()` - `sibling-index()`

Ora puoi calcolare lo z-index automaticamente:

```css
.avatar {
  z-index: calc(sibling-count() - sibling-index());
}
```

Se hai 5 avatar:

- il primo: `5 - 1 = 4` (sopra)
- il secondo: `5 - 2 = 3`
- …
- l’ultimo: `5 - 5 = 0` (sotto)

Aggiungi o rimuovi avatar? Funziona comunque, senza toccare il CSS.

### Hover: porta in primo piano l’elemento interattivo

Se al passaggio del mouse vuoi che l’avatar “salti davanti a tutti”, puoi impostare uno z-index garantito più alto del massimo attuale:

```css
.avatar:hover {
  z-index: calc(sibling-count() + 1);
}
```

Così eviti valori arbitrari tipo `9999` e il comportamento resta coerente anche se il numero di elementi cambia.

---

## In sintesi: quando usare queste funzioni (e perché conviene)

- **Stagger animation**: `sibling-index()` elimina `:nth-child()` seriali e variabili manuali.
- **Layering affidabile**: `sibling-count()` + `sibling-index()` risolvono overlap e z-index senza “scale” infinite.
- **Pattern generativi** (colori, offset, delay, ecc.): ottieni variazioni per elemento con una formula unica.

L’implicazione pratica è semplice: se stai per scrivere una sfilza di selettori `:nth-child()` o stai per aggiungere `--i` nel markup solo per “numerare” elementi, è il momento di passare a `sibling-index()` e `sibling-count()`. Riduci codice, riduci manutenzione e rendi i componenti davvero riusabili.
