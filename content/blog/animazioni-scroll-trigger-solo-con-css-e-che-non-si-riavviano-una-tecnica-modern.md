---
title: "Animazioni “scroll-trigger” solo con CSS (e che non si riavviano): una tecnica moderna e pulita"
subtitle: "Scroll-driven animations + style queries: fai partire l’animazione quando l’elemento entra in viewport e lasciala “incollata” allo stato finale, senza una riga di JavaScript."
description: "Creare animazioni attivate dallo scroll di solito fa pensare subito a JavaScript. In realtà oggi CSS permette un approccio sorprendentemente solido: puoi rilevare l’ingresso in viewport, far partire un’animazione una sola volta e mantenerne lo stato finale anche quando l’elemento esce dallo schermo. In più, puoi aggiungere uno stagger intelligente in una griglia responsive e gestire tutto in progressive enhancement con @supports e prefers-reduced-motion."
publishedAt: 2026-08-26
tags: ["scroll-driven animations","animation-timeline","container style queries","progressive enhancement","prefers-reduced-motion"]
---
## Perché le animazioni “a scroll” sono difficili (e cosa vogliamo davvero)

Le animazioni attivate dallo scroll sono spesso una lama a doppio taglio: belle quando entrano in scena, irritanti quando continuano a riattivarsi mentre si risale e si riscende la pagina.

L’obiettivo più sensato, nella maggior parte dei layout “a card” (portfolio, listati, blog index), è:

1. **attivare l’animazione quando l’elemento entra in viewport**
2. **farla partire una sola volta**
3. **mantenere lo stato finale** anche se poi l’elemento esce e rientra
4. **senza JS**, e con fallback decente.

Oggi ci si arriva con una combinazione di due feature moderne:

- **Scroll-driven animations** (`animation-timeline: view()`)
- **Container style queries** (style queries basate su custom property)

## Struttura HTML: due livelli, uno “sensore” e uno “contenuto”

Per questa tecnica conviene avere due layer:

- un wrapper (il “sensore”, quello che osserviamo rispetto alla viewport)
- un elemento interno (il “contenuto” che anima)

Esempio:

```html
<div class="reveal">
  <article class="card">
    <!-- contenuto -->
  </article>
</div>
```

Il motivo è pratico: il wrapper gestisce lo stato “in vista”, l’interno esegue l’animazione.

## Step 1 — Un booleano CSS che diventa vero quando l’elemento entra in view

Sul wrapper iniziamo impostando una custom property come stato:

```css
.reveal {
  --in-view: false;
}
```

Poi definiamo un’animazione che “switcha” quel valore da `false` a `true` quando l’elemento entra in viewport, usando una **view timeline**.

> Sì: qui l’animazione non muove pixel, ma cambia **uno stato**.

```css
@keyframes in-view {
  to { --in-view: true; }
}

.reveal {
  animation: in-view 1s both;
  animation-timeline: view();
}
```

A questo punto abbiamo un interruttore che si accende quando l’elemento è in vista. Ma da solo non fa nulla: dobbiamo reagire al cambio di stato.

## Step 2 — Reagire allo stato con una container style query

Qui entra in gioco la parte elegante: usiamo una **style query** per applicare stili al contenuto quando `--in-view` è `true`.

Serve dichiarare un container sul wrapper (inline-size è sufficiente per questo tipo di query):

```css
.reveal {
  container-type: inline-size;
}
```

Poi, sul contenuto, possiamo fare:

```css
@container style(--in-view: true) {
  .card {
    outline: 2px solid red; /* solo per visualizzare l'effetto */
  }
}
```

Funziona, ma c’è un problema tipico: spesso l’attivazione risulta “tardiva” perché l’elemento deve entrare in una certa porzione della viewport.

## Step 3 — Anticipare il trigger con `animation-range`

Con le scroll-driven animations puoi definire **quando** scatta il range di animazione.

Esempio concettuale:

```css
.reveal {
  animation-range: entry 20% cover 30%;
}
```

Questo ti permette di evitare l’effetto “spazio vuoto” (ad esempio quando l’opacità è 0 finché la card non è completamente dentro).

## Step 4 — Evitare l’effetto “on/off” e farla partire una sola volta

Il difetto più fastidioso: se lo stile dipende direttamente dall’essere in vista, allora risalendo la pagina l’animazione/stato può tornare indietro.

La soluzione robusta è spostare l’animazione vera e propria sul contenuto e usare lo stato “in view” solo per cambiare il **play state**:

- di default l’animazione è **paused**
- quando entra in view diventa **running**
- quando esce torna **paused**, ma resta bloccata **al frame raggiunto** (tipicamente 100%)

Esempio:

```css
.card {
  opacity: 0;
  transform: translateY(16px) scale(0.98);

  animation: reveal 600ms ease forwards;
  animation-play-state: paused;
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@container style(--in-view: true) {
  .card {
    animation-play-state: running;
  }
}
```

Risultato: l’animazione parte quando la card entra in viewport e **non si riavvolge** quando torni indietro.

## Step 5 — Uno stagger “intelligente” in una griglia responsive

Lo stagger rende tutto più naturale, ma farlo bene su una griglia che cambia colonne è il punto difficile.

L’idea è assegnare a ogni card un indice di “ritardo” (`--stagger`) in base alla colonna in cui si trova, usando media query e selettori che tengono conto della geometria dell’auto-grid.

In pratica:

- definisci i due numeri chiave: **min column size** e **gap**
- sul parent imposti un container (`container-type: inline-size`)
- poi, in base a quante colonne ci sono a quella larghezza, assegni `--stagger` ai figli della 2ª colonna, 3ª colonna, ecc.

Una volta che ogni card ha `--stagger`, l’applicazione è semplice:

```css
.card {
  animation-delay: calc(var(--stagger, 0) * 120ms);
}
```

Note importanti:

- è una tecnica che può richiedere **valori “magic number”** perché in alcuni punti non puoi infilare custom property dove vorresti
- conviene usarla quando lo stagger “per colonna” è un requisito reale (portfolio/grid), altrimenti uno stagger lineare per `nth-child()` può bastare.

## Progressive enhancement: `@supports` e accessibilità con `prefers-reduced-motion`

Due accortezze rendono questo approccio production-friendly:

### 1) Non lasciare le card invisibili nei browser non compatibili

Se la tua UI di base mette `opacity: 0` in attesa dell’animazione, devi proteggere tutto con `@supports`.

Il check più pragmatico è sul supporto di `animation-timeline: view()`:

```css
@supports (animation-timeline: view()) {
  /* qui dentro: timeline, range, play-state, ecc. */
}
```

Fuori da `@supports`, tieni lo stile “statico” visibile.

### 2) Rispetta `prefers-reduced-motion`

Se l’utente chiede meno animazioni, niente reveal: contenuti subito presenti.

```css
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}
```

## Sintesi operativa

- Usa un wrapper che anima una custom property (`--in-view`) tramite `animation-timeline: view()`.
- Reagisci a quello stato con una container **style query**.
- Per evitare “riattivazioni”, anima davvero la card e controlla solo `animation-play-state`.
- Aggiungi `animation-range` per scegliere un punto di trigger più piacevole.
- Se serve, calcola uno stagger per colonne e applicalo con `animation-delay`.
- Chiudi il cerchio con `@supports` e `prefers-reduced-motion`.

Il risultato è un pattern moderno, pulito e sorprendentemente mantenibile: un’animazione “scroll-trigger” che sembra JavaScript, ma resta CSS puro — e soprattutto non penalizza chi non ha supporto o non vuole motion.
