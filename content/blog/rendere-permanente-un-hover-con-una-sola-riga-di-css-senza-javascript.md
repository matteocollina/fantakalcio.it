---
title: "Rendere “permanente” un hover con una sola riga di CSS (senza JavaScript)"
subtitle: "Un trucco con transition-duration e calc() per far sì che lo stato ritorni… in “infinito” tempo."
description: "Vuoi che un elemento cambi aspetto al passaggio del mouse e poi rimanga così anche quando il puntatore se ne va? Con un’idea semplice: fai durare il ritorno allo stato iniziale un tempo infinito. Risultato: l’hover sembra “bloccarsi” per sempre, senza JS."
publishedAt: 2026-08-13
tags: ["css-transition","hover-persistente","calc-infinity","ui-microinterazioni","focus-accessibilità"]
---
In UI e microinterazioni capita spesso di voler ottenere un effetto “sticky”: passi sopra un elemento, lui cambia stile… e quando te ne vai rimane così. Magari per segnalare l’ultimo elemento esplorato, per evidenziare una scelta o per lasciare una traccia visiva senza introdurre logica JavaScript.

In CSS c’è un trucco molto pulito per farlo: **far durare la transizione di ritorno un tempo “infinito”**.

## L’idea
Una transizione ha due momenti:

1. **Andata**: quando entri in `:hover` (o `:focus`), lo stile cambia.
2. **Ritorno**: quando esci dallo stato, lo stile torna a quello base.

Di norma imposti una `transition-duration` e vale in entrambe le direzioni.

Qui facciamo invece così:

- nello stato base impostiamo una durata **infinita** (quindi il ritorno non avviene mai, o meglio: richiede un tempo infinito)
- nello stato `:hover`/`:focus` impostiamo la durata “normale” (es. `0.5s`) per animare l’andata

## Il codice
Esempio minimale su link e titoli:

```css
/* Stato base: il "ritorno" richiede un tempo infinito */
a,
h1 {
  color: black;
  transition-property: color;
  transition-duration: calc(infinity * 1s);
}

/* Stato interattivo: l'andata avviene in modo normale */
a:hover,
a:focus,
h1:hover,
h1:focus {
  color: red;
  transition-duration: 0.5s;
}
```

### Perché `calc(infinity * 1s)`?
`transition-duration` richiede una **durata temporale** (`s` o `ms`). `infinity` è un valore numerico valido in CSS, ma da solo non è un tempo: con `calc(infinity * 1s)` lo “converti” in una durata.

## Cosa ottieni (e cosa no)
- Quando passi sopra l’elemento, in `0.5s` va al colore rosso.
- Quando esci, dovrebbe tornare al colore base… ma la transizione di ritorno dura infinito, quindi **di fatto resta rosso**.

Nota importante: non è un “toggle” persistente nel senso applicativo (non stai memorizzando uno stato). È un effetto visivo basato sul fatto che il ritorno viene posticipato indefinitamente.

## Quando usarlo
Funziona bene per:
- demo, prototipi e microinterazioni “giocose”
- evidenziazioni temporanee che non devono necessariamente essere “vere” a livello di stato
- pattern dove vuoi evitare JavaScript e ti basta un comportamento visivo

Se invece ti serve **uno stato persistente reale** (es. selezione che sopravvive a click, cambio di focus, navigazione da tastiera, ecc.), allora è più corretto usare meccanismi come `:checked` con input/label, `:target`, oppure JS.

## Sintesi
Impostando una `transition-duration` infinita nello stato base e una durata normale in `:hover`/`:focus`, puoi ottenere un hover che “rimane” senza scrivere una riga di JavaScript. È un trucco semplice, sorprendentemente efficace, e utile quando vuoi un effetto sticky puramente estetico con pochissimo codice.
