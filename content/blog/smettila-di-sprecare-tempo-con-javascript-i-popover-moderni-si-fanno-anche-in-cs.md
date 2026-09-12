---
title: "Smettila di sprecare tempo con JavaScript: i popover moderni si fanno (anche) in CSS"
subtitle: "Con l’attributo `popover`, `::backdrop` implicito, transizioni discrete e un pizzico di anchoring, puoi ottenere apertura/chiusura accessibili con pochissimo codice."
description: "I popover non sono più un esercizio obbligatorio di JavaScript. Oggi il browser offre un’API nativa: un bottone che apre/chiude, light dismiss, ESC, gestione del focus e stati CSS da animare. In questo articolo vediamo un’implementazione minimale e pulita, con fade e slide controllati da CSS, inclusa la transizione per proprietà discrete e un accenno al posizionamento vicino al trigger tramite anchoring."
publishedAt: 2026-07-01
tags: ["CSS popover","accessibilità UI","transition-behavior","ancoraggio CSS","UI senza JavaScript"]
---
Negli ultimi anni abbiamo accumulato un riflesso quasi automatico: “serve un popover? scrivo due righe di JavaScript”. Il problema non è il JS in sé, è che spesso lo usiamo per ricreare comportamenti che il browser può già gestire meglio (e con più attenzione all’accessibilità) in modo nativo.

Oggi i **popover** possono essere realizzati con HTML + CSS in modo estremamente compatto, ottenendo gratis:

- **Apertura/chiusura** senza handler
- **Light dismiss** (clic fuori per chiudere)
- **Tasto ESC**
- Comportamenti di base più prevedibili e “browser-native”

E, soprattutto, puoi animarli con CSS in maniera pulita.

---

## Il popover nativo: markup minimo

L’idea è semplice:

1. Un elemento “contenitore” che dichiari `popover`
2. Un bottone che lo controlli con `popovertarget`

```html
<button popovertarget="my-popover">Apri popover</button>

<div id="my-popover" popover>
  Contenuto del popover
</div>
```

Con **solo questo**, il bottone apre/chiude il popover. E sì: funziona anche con ESC e clic fuori, senza dover “reinventare” niente.

> Nota: esistono varianti e attributi correlati (ad es. modalità diverse), ma questo è lo scheletro più immediato per partire.

---

## Styling e animazione: lo stato `:popover-open`

Quando il popover è visibile, puoi selezionarlo via pseudo-classe:

- `:popover-open` → popover attualmente aperto

Partiamo con un semplice fade.

```css
#my-popover {
  opacity: 0;
  transition: opacity 300ms ease;
}

#my-popover:popover-open {
  opacity: 1;
}
```

Fin qui sembra tutto normale… ma c’è un dettaglio importante.

---

## Transizioni che funzionano davvero: `transition-behavior: allow-discrete`

L’apertura/chiusura di un popover coinvolge anche cambiamenti “discreti” (non interpolabili) legati al rendering/visibilità. Risultato tipico: **l’animazione entra**, ma in chiusura “sparisce di colpo”.

Per consentire transizioni più sensate anche in questi casi, puoi aggiungere:

```css
#my-popover {
  transition-behavior: allow-discrete;
}
```

In pratica stai dicendo al browser: “consenti la transizione anche quando ci sono step discreti nel mezzo”.

---

## Animare anche la posizione: slide + fade con `translate`

Una combinazione molto naturale è **fade + slide**. Ad esempio: entra dal basso e esce verso l’alto (o viceversa).

```css
#my-popover {
  opacity: 0;
  translate: 0 50px;

  transition:
    opacity 300ms ease,
    translate 300ms ease;

  transition-behavior: allow-discrete;
}

#my-popover:popover-open {
  opacity: 1;
  translate: 0 0;
}

@starting-style {
  #my-popover:popover-open {
    opacity: 0;
    translate: 0 -50px;
  }
}
```

Cosa succede qui:

- Stato chiuso: `opacity: 0` e `translate: 0 50px`
- Stato aperto: `opacity: 1` e `translate: 0 0`
- Con `@starting-style` puoi definire lo **stato iniziale** al momento dell’apertura, rendendo l’entrata più controllata

È un pattern molto utile quando vuoi evitare “salti” tra calcolo layout e primo frame dell’animazione.

---

## Posizionarlo vicino al trigger: cenni di anchoring

Un popover spesso ha senso **in relazione al bottone** che lo apre. Il CSS moderno offre strumenti per agganciare un elemento a un altro (anchoring), riducendo la necessità di calcoli JS per “metterlo sotto al bottone”.

A livello concettuale:

- definisci un’ancora (il trigger)
- posizioni il popover rispetto a quell’ancora (ad es. “sotto”)

La sintassi e il supporto possono variare, ma il punto pratico è questo: **se il tuo popover è un componente ricorrente, l’anchoring ti evita coordinate hard-coded o `getBoundingClientRect()`** per casi semplici.

---

## Implicazione pratica: JS dove serve, non per abitudine

Non è una crociata contro JavaScript. È una questione di **allocare complessità** nel posto giusto:

- Se ti serve un popover standard (apri/chiudi, ESC, clic fuori, animazione), l’HTML/CSS nativi oggi coprono già gran parte del lavoro.
- Riservare JS ai casi “veramente applicativi” (stato, dati, orchestrazione) riduce bug, codice boilerplate e regressioni sull’accessibilità.

### Sintesi
Un popover moderno può essere:
- dichiarato in HTML con `popover`
- controllato con `popovertarget`
- animato con `:popover-open`, `@starting-style` e `transition-behavior: allow-discrete`
- posizionato vicino al trigger con anchoring (quando disponibile)

Se stai ancora scrivendo handler e listener solo per aprire/chiudere un pannellino, probabilmente stai spendendo tempo dove il browser è già pronto a fare il lavoro per te.
