---
title: "Animazioni “next-level” con GSAP: scroll, stagger e trigger per landing page che si muovono bene"
subtitle: "Dalle micro-animazioni ai pattern più strutturati: come usare gsap.from(), ScrollTrigger e le animazioni “a gruppi” senza perdere controllo (e senza esagerare)."
description: "GSAP è uno dei modi più rapidi per dare vita a una landing page con animazioni curate: fade/slide, stagger, easing e soprattutto trigger sullo scroll. In questo articolo vediamo un approccio pratico: come installarlo, come organizzare i plugin, come animare una griglia di card quando entra in viewport e come scegliere tra un trigger “di sezione” o un trigger “per elemento” con querySelectorAll + forEach. Concludiamo con alcune linee guida per tenere animazioni eleganti, leggere e coerenti."
publishedAt: 2026-07-08
tags: ["gsap","scrolltrigger","stagger","easing","animazioni-scroll"]
---
GSAP è una di quelle librerie che, quando serve **dare ritmo** a una landing page (senza impazzire), ti fa recuperare ore. Non perché “fa magie”, ma perché rende *banali* operazioni che altrimenti richiedono workaround: timeline, stagger, controlli sullo scroll, easing coerenti, e una buona ergonomia API.

Qui raccolgo un flusso di lavoro pratico per:

- integrare GSAP in un progetto moderno (es. Astro, ma vale ovunque)
- usare `from()` per animazioni in ingresso
- aggiungere **stagger** e **easing**
- rendere tutto **scroll-triggered** con `ScrollTrigger`
- scegliere tra trigger “di sezione” o trigger “per elemento”

> Nota di design: le animazioni migliori sono spesso quelle che *non si notano* come “effetto speciale”, ma come una UI più reattiva e leggibile.

---

## 1) Installazione e organizzazione: GSAP + plugin

Installazione classica via npm:

```bash
npm i gsap
```

Poi conviene creare un file unico (tipo `lib/gsap.js`) dove registrare i plugin che userai, così da non ripetere codice in giro:

```js
// lib/gsap.js
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
```

Perché farlo:

- eviti import “sparsi” con registrazioni duplicate
- hai un punto unico per cambiare configurazioni
- i componenti importano solo ciò che serve

---

## 2) Il pattern più utile: `gsap.from()` per animazioni in ingresso

La differenza che ti semplifica la vita:

- `gsap.from(target, vars)` parte da valori iniziali e anima verso lo stato “naturale” (quello definito in CSS/DOM)
- `gsap.to(target, vars)` parte dallo stato corrente e anima verso i valori specificati

Per una landing, `from()` è spesso perfetta perché:

- definisci lo stile finale normalmente in CSS
- GSAP gestisce solo l’ingresso, senza “inquinare” la base

Esempio semplice (fade + slide):

```js
import { gsap } from "../lib/gsap";

gsap.from(".card", {
  opacity: 0,
  y: 100,
  duration: 0.8,
});
```

---

## 3) Stagger: dare ritmo a liste e griglie

Quando animi più elementi insieme, farli partire tutti nello stesso istante crea un effetto “blocco unico”. A volte va bene, spesso è più gradevole scaglionare:

```js
gsap.from(".driver-card", {
  opacity: 0,
  y: 80,
  duration: 0.8,
  stagger: 0.12,
});
```

- `stagger: 0.12` = ogni card parte 0.12s dopo la precedente
- utile su grid di card, feature list, step, loghi, ecc.

---

## 4) Easing: la differenza tra “animazione” e “interazione curata”

GSAP rende comodissimo sperimentare easing.
Un easing che spesso funziona per ingressi “snappy ma morbidi”:

```js
ease: "power4.out"
```

Esempio completo:

```js
gsap.from(".driver-card", {
  opacity: 0,
  y: 80,
  duration: 0.8,
  stagger: 0.12,
  ease: "power4.out",
});
```

---

## 5) ScrollTrigger: animare quando l’utente arriva (non al load)

Le animazioni al caricamento rischiano di partire quando l’utente non le sta guardando (specie se sono sotto la fold). Con `ScrollTrigger` agganci l’animazione all’ingresso in viewport.

### Trigger “di sezione” (un solo trigger per un gruppo)

```js
import { gsap } from "../lib/gsap";

gsap.from(".driver-card", {
  opacity: 0,
  y: 80,
  duration: 0.8,
  stagger: 0.12,
  ease: "power4.out",
  scrollTrigger: {
    trigger: ".drivers-grid",
    start: "top 85%",
  },
});
```

- `trigger`: l’elemento che “accende” l’animazione
- `start: "top 85%"`: l’animazione parte quando il top del trigger arriva all’85% dell’altezza viewport

Questo approccio è ottimo quando vuoi che l’intera sezione “entri” insieme (con stagger interno).

### Quando cambiare `start`

Se parte troppo presto (o troppo tardi), `start` è la tua manopola principale.
Valori tipici:

- `"top 90%"` (molto tardi, più “sotto”)
- `"top 75%"` (più presto)

---

## 6) Trigger “per elemento”: ogni riga/card anima quando entra lei

C’è un caso comune: una lista verticale (spec, righe, step) dove vuoi che **ogni item** si animi quando arriva, non tutti insieme quando entra il primo.

Se provi a usare come `trigger` lo stesso selettore del target, rischi comunque di agganciarti “di fatto” al primo match. La soluzione robusta è selezionare tutti gli elementi e creare un’animazione per ciascuno.

```js
import { gsap } from "../lib/gsap";

const rows = document.querySelectorAll(".car-spec-row");

rows.forEach((row) => {
  gsap.from(row, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: row,
      start: "top 90%",
    },
  });
});
```

Cosa ottieni:

- micro-animazioni “puntuali”, una alla volta
- meno rumore visivo
- migliore percezione di scorrimento e progressione

---

## 7) Un appunto importante: accessibilità e misura

Le animazioni non sono solo estetica:

- possono distrarre
- possono causare discomfort
- possono peggiorare la navigazione se non pensate con criterio

Linee guida pragmatiche:

1. **micro-animazioni** (0.3–0.8s) > animazioni lunghe
2. usa stagger piccoli (0.06–0.15s) su liste dense
3. evita movimenti ampi e continui su tutto lo schermo
4. valuta `prefers-reduced-motion` per ridurre/disattivare gli effetti più “fisici”

---

## Sintesi: il kit essenziale per una landing che “si muove bene”

- `gsap.from()` per ingressi puliti senza complicare il CSS
- `stagger` per dare ritmo a grid e liste
- `ease` per farle sembrare interazioni, non effetti
- `ScrollTrigger` per far partire tutto quando serve
- `forEach + trigger: element` quando vuoi comportamento veramente per-elemento

Se c’è un punto che fa davvero salire di livello una landing, è questo: **animazioni piccole, coerenti e agganciate allo scroll nel momento giusto**. Più che “wow”, devono comunicare gerarchia, guidare lo sguardo e rendere la pagina più leggibile mentre la si attraversa.
