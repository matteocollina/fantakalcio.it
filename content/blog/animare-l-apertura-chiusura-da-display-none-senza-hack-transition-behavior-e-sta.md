---
title: "Animare l’apertura/chiusura da display: none senza hack: transition-behavior e @starting-style"
subtitle: "Fade e slide fluidi anche quando l’elemento entra/esce dal layout, con poche righe di CSS moderno."
description: "Per anni abbiamo aggirato l’impossibilità di animare display: none con wrapper, max-height, visibility e setTimeout. Oggi il CSS offre un approccio più pulito: con transition-behavior: allow-discrete e @starting-style puoi gestire l’ingresso/uscita di elementi che cambiano display (e persino overlay per i componenti in top-layer come popover e modali), ottenendo animazioni coerenti in apertura e in chiusura."
publishedAt: 2026-07-16
tags: ["CSS moderne","popover","modali","animazioni UI","transition-behavior","starting-style"]
---
## Il problema: `display: none` non si anima (ma l’UI sì)
Quando un componente passa da `display: none` a `display: block` (o viceversa) non c’è interpolazione possibile: o è nel layout oppure no. Per questo molti pattern storici usano alternative come `opacity + visibility`, wrapper che restano nel DOM, oppure trucchi con `max-height`.

Nel CSS moderno però possiamo ottenere transizioni “pulite” anche quando entra in gioco un cambio discreto (come `display`), coordinandolo con proprietà interpolabili (`opacity`, `transform`, ecc.).

## L’idea: transizioni miste (discrete + interpolabili)
Il pattern è:

1. **Stato “chiuso”**: l’elemento ha i valori finali dell’uscita (es. `opacity: 0` e una traslazione).
2. **Stato “aperto”**: l’elemento passa a `opacity: 1` e torna in posizione.
3. **Transizione**: abilitiamo la transizione anche per le proprietà *discrete* con `transition-behavior: allow-discrete`.
4. **Ingresso coerente**: usiamo `@starting-style` per definire i valori iniziali *solo all’apertura* (fondamentale per vedere l’animazione in entrata quando l’elemento “compare”).

> Nota: l’esempio qui sotto usa un **popover** (top-layer), ma il concetto è applicabile a qualsiasi UI che alterna `display: none`/visibile. Per top-layer, ha senso includere anche `overlay`.

## Esempio completo: fade + slide per un popover

### 1) Base: stato chiuso + transizioni
```css
.my-popover {
  /* Stato di uscita (chiuso) */
  opacity: 0;
  transform: translate(0, 30px);

  /* Transizioni: includiamo anche le proprietà discrete */
  transition-property: display, opacity, transform, overlay;
  transition-duration: 200ms;
  transition-timing-function: ease;

  /* Abilita la transizione delle proprietà discrete (es. display/overlay) */
  transition-behavior: allow-discrete;
}
```

- `opacity` e `transform` sono interpolabili, quindi animano normalmente.
- `display` e `overlay` sono discrete: senza `allow-discrete` lo switch sarebbe “secco”.
- `overlay` ha senso quando stai lavorando con elementi in top-layer (popover/modali).

### 2) Stato aperto: rendi visibile e imposta il layout *qui*
Con un popover nativo puoi usare l’attributo `:popover-open`.

```css
.my-popover:popover-open {
  opacity: 1;
  transform: translate(0, 0);

  /* Importante: imposta il display SOLO quando è aperto */
  display: grid;
}
```

Perché `display: grid` solo qui?
- Se lo metti nella regola base, l’elemento potrebbe risultare “sempre presente” dal punto di vista del layout.
- In generale, **tutti i cambi di display vanno legati allo stato aperto**, non allo stato chiuso.

### 3) L’ingrediente che sblocca l’entrata: `@starting-style`
Senza questo, spesso noterai che la chiusura anima correttamente, ma l’apertura no (perché il browser non ha un “valore iniziale animabile” al momento in cui l’elemento entra nel rendering).

```css
@starting-style {
  .my-popover:popover-open {
    opacity: 0;
    transform: translate(0, -30px);
  }
}
```

Cosa ottieni:
- **Apertura**: parte da `opacity: 0` e `translateY(-30px)` e transiziona verso `opacity: 1` e `translateY(0)`.
- **Chiusura**: torna verso lo stato base (`opacity: 0` e `translateY(30px)`), quindi puoi anche avere una direzione diversa in uscita.

## Dettagli pratici (che evitano glitch)
- **Direzione diversa tra entrata e uscita**: come nell’esempio, usa `@starting-style` per l’entrata (es. `-30px`) e la regola base per l’uscita (es. `+30px`).
- **Layout e proprietà “strutturali”**: imposta `display` nello stato aperto, ma valuta caso per caso proprietà come `grid-template-columns`. Se cambiano drasticamente, può essere meglio mantenerle coerenti tra stati per evitare salti inattesi durante la transizione.
- **Durate**: 150–250ms di solito sono più che sufficienti per popover e menu; durate più lunghe evidenziano eventuali imperfezioni.

## Sintesi
Con `transition-behavior: allow-discrete` e `@starting-style` puoi finalmente gestire in modo elegante la transizione di componenti che entrano/escono dal layout (anche partendo da `display: none`), combinando cambi discreti e animazioni fluide su `opacity` e `transform`. Il risultato è un’UI più coerente, senza wrapper extra e senza hack: lo stato chiuso definisce l’uscita, `@starting-style` definisce l’ingresso, e lo stato aperto contiene anche le scelte di `display`.
