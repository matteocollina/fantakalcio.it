---
title: "Animare l’entrata/uscita da display: none in CSS (finalmente)"
subtitle: "Con transition-behavior: allow-discrete e @starting-style puoi fare fade e movimenti sia in apertura che in chiusura, senza hack e senza JS."
description: "Per anni il limite era chiaro: display è una proprietà “discreta” e non si poteva transizionare. Oggi si può gestire in modo pulito l’apertura e la chiusura di elementi che passano da display: none a display: grid/block, ottenendo animazioni complete (anche diverse tra enter e exit) grazie a transition-behavior: allow-discrete e alla nuova at-rule @starting-style. Ecco come impostare modali, popover e pannelli con un CSS chiaro e prevedibile, includendo anche l’animazione del backdrop."
publishedAt: 2026-07-22
tags: ["display-none","transition-behavior","starting-style","modali-css","backdrop-dialog"]
---
Per molto tempo, ogni volta che volevamo **animare un elemento che passa da `display: none` a “visibile”**, finivamo in una palude di workaround: `opacity` + `visibility`, `max-height` finto, animazioni su wrapper, classi intermedie, setTimeout e simili.

Il motivo era semplice: **`display` è una proprietà a “salti” (discreta)**. Non ha valori intermedi, quindi una transizione tradizionale non può interpolarla.

Oggi però possiamo ottenere un risultato sorprendentemente pulito con due ingredienti:

1. `transition-behavior: allow-discrete;`
2. `@starting-style` (una nuova at-rule)

Il risultato: **l’elemento può animare sia in uscita che in entrata**, pur passando da `display: none`.

---

## 1) Il problema: perché in chiusura “quasi” funziona

Quando chiudi un componente e lo riporti a `display: none`, l’animazione tipica che vorresti è: fade-out, slide-out, ecc.

Con `transition-behavior: allow-discrete` puoi dire al browser: “Accetta transizioni anche se ci sono proprietà discrete nel mezzo”. In pratica il browser **ritarda l’applicazione del salto discreto** (es. il passaggio a `display: none`) finché le altre transizioni (come `opacity` o `translate`) non hanno finito.

Ecco perché spesso vedi subito un miglioramento *in chiusura*.

```css
.panel {
  transition: opacity 300ms ease, translate 300ms ease;
  transition-behavior: allow-discrete;
}

.panel[hidden] {
  display: none;
  opacity: 0;
  translate: 0 12px;
}

.panel:not([hidden]) {
  display: grid;
  opacity: 1;
  translate: 0 0;
}
```

Ma in apertura potresti notare un comportamento “istantaneo”: se l’elemento era `display: none`, quando appare è già nello stato finale e non “sa” da dove partire.

---

## 2) La chiave per l’entrata: `@starting-style`

`@starting-style` serve esattamente a questo: **definire lo stile di partenza per l’animazione di entrata**, anche se l’elemento prima non partecipava al layout perché era `display: none`.

La cosa importante è che **`@starting-style` deve stare dopo le regole dello stato “aperto”**, perché conta la cascata (l’ultima regola vince). Se lo metti prima, rischi di annullarlo senza accorgertene.

Esempio completo:

```css
.modal {
  transition: opacity 350ms ease, translate 350ms ease;
  transition-behavior: allow-discrete;
}

/* stato chiuso */
.modal[hidden] {
  display: none;
  opacity: 0;
  translate: 0 24px;
}

/* stato aperto */
.modal:not([hidden]) {
  display: grid;
  opacity: 1;
  translate: 0 0;
}

/* stile di partenza SOLO per l'entrata */
@starting-style {
  .modal:not([hidden]) {
    opacity: 0;
    translate: 0 -24px;
  }
}
```

### Perché è potente

Notare un dettaglio interessante: qui **l’entrata e l’uscita possono essere diverse**.
- In entrata parti da `translate: 0 -24px` (arriva dall’alto)
- In uscita vai verso `translate: 0 24px` (esce verso il basso)

È un pattern molto difficile da ottenere “bene” quando sei costretto a usare solo classi e proprietà alternative a `display`.

---

## 3) Modali, top layer e overlay: cosa ha senso dichiarare

Se stai lavorando con modali (ad esempio `dialog`, popover, componenti in top layer), in alcuni casi può essere utile dichiarare anche proprietà legate al layer/overlay quando passi allo stato aperto, per evitare comportamenti incoerenti tra browser e garantire che la UI “si agganci” correttamente al contesto.

Il punto pratico resta: **`display` + transizioni su proprietà continue** (opacity/transform/translate/filter) ora possono convivere senza hack.

---

## 4) Animare il backdrop: il trucco più semplice

Se hai un backdrop (ad esempio quello del `dialog`), spesso non si anima “da solo” come ti aspetti. La soluzione più robusta è: **anima l’`opacity` del backdrop**.

Esempio:

```css
dialog::backdrop {
  opacity: 0;
  transition: opacity 350ms ease;
}

dialog[open]::backdrop {
  opacity: 1;
}
```

Se sul backdrop usi anche `filter` (blur, saturazione, ecc.), spesso l’effetto percepito migliora comunque grazie alla transizione dell’opacità: il filtro sembra “entrare” con più naturalezza.

---

## Sintesi operativa

- **`transition-behavior: allow-discrete`** permette al browser di gestire correttamente il passaggio a proprietà discrete (come `display`) durante una transizione.
- **`@starting-style`** definisce lo stato iniziale dell’animazione di entrata, anche quando l’elemento prima era `display: none`.
- Con questo approccio puoi creare **enter/exit diversi**, cosa che migliora tantissimo la qualità percepita di modali, pannelli, menu e popover.
- Per il backdrop, **anima l’opacità**: è semplice e funziona bene.

La conseguenza pratica è enorme: molte UI che prima richiedevano struttura extra o JavaScript per “pilotare” le classi possono tornare a essere **CSS-first, leggibili e mantenibili**, senza rinunciare ad animazioni fluide e coerenti.
