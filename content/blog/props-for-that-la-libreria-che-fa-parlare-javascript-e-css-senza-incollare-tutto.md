---
title: "Props (for that): la libreria che fa parlare JavaScript e CSS senza incollare tutto a mano"
subtitle: "Passa a CSS valori “vivi” come pointer, visibilità, viewport e velocità di scroll con una configurazione minimale e un occhio alla performance."
description: "Coordinare JS e CSS di solito significa: listener, state, custom properties aggiornate a mano e (spesso) qualche compromesso di performance. Props (for that) cambia l’approccio: dichiari cosa ti serve su un elemento e ottieni variabili CSS già pronte, aggiornate in modo efficiente e solo quando l’elemento è realmente in gioco. Risultato: interazioni, glow, tilt e reveal su scroll con pochissimo codice e logica molto più pulita."
publishedAt: 2026-08-05
tags: ["custom-properties","animazioni-scroll","pointer-tracking","performance-frontend","css-variables"]
---
Quando costruiamo micro-interazioni “ricche” (tilt al passaggio del mouse, gradienti che inseguono il cursore, elementi che entrano in viewport con un twist), il pattern classico è sempre lo stesso:

- JavaScript ascolta eventi (pointermove, scroll, resize…)
- calcola valori
- li scrive in **CSS custom properties**
- CSS li usa per trasformazioni, gradienti, opacity, ecc.

Funziona, ma è facile finire con:

- molto boilerplate (listener, throttling, cleanup)
- logica duplicata per componente
- aggiornamenti continui anche quando l’elemento non è visibile

**Props (for that)** punta a risolvere esattamente questo: ti dà un modo dichiarativo per far arrivare a CSS una serie di valori “dinamici” (pointer, visibilità, viewport, FPS, velocità di scroll, ecc.) senza dover costruire tutta l’infrastruttura ogni volta.

## L’idea: “JS conosce qualcosa, ora lo conosce anche CSS”
L’approccio è semplice: JavaScript si occupa di raccogliere segnali dall’ambiente (input, scroll, viewport…), e la libreria li espone come **custom properties** direttamente sugli elementi che lo richiedono.

Il cambio di paradigma non è tanto “posso fare un tilt con una riga”, ma:

- **CSS diventa il posto dove compongo l’effetto**
- **JS diventa un provider di dati**, non un orchestratore di animazioni

Questo è un passo importante perché ci permette di mantenere le animazioni e i look & feel in CSS (dove sono più facili da iterare), e usare JS solo per ciò che CSS non può misurare da solo.

## Setup: import e dichiarazione per elemento
L’uso tipico parte da un import “auto” (che inizializza la libreria) e poi da un attributo HTML per dire *quali props* ti servono.

A livello concettuale:

- in JS importi l’entrypoint automatico
- in HTML aggiungi `data-props-for` sull’elemento e elenchi le props

Esempio: vuoi tracciare il puntatore relativo a una card.

```html
<article class="card" data-props-for="pointer local">
  ...
</article>
```

Da qui in poi, sull’elemento compariranno custom properties “live” come:

- `--live-local-pointer-x-ratio`
- `--live-local-pointer-y-ratio`
- `--live-local-pointer-inside`

### Valori “unitless” (ed è un vantaggio)
Un dettaglio furbo: i valori arrivano **senza unità**.

Sembra scomodo, ma è l’opposto: significa che puoi decidere tu come interpretarli.

- vuoi percentuali? moltiplichi per `100%`
- vuoi gradi? moltiplichi per `deg`
- vuoi pixel? moltiplichi per `1px`

Questa neutralità rende le props molto riusabili.

## Pointer-follow glow: gradienti che inseguono il mouse con puro CSS
Mettiamo che tu abbia un background con un radial-gradient e vuoi spostarne il centro in base al cursore.

In CSS:

```css
.card {
  --x: calc(var(--live-local-pointer-x-ratio, 0.5) * 100%);
  --y: calc(var(--live-local-pointer-y-ratio, 0.5) * 100%);

  background:
    radial-gradient(circle at var(--x) var(--y), rgba(80, 140, 255, 0.6), transparent 55%),
    #0b1020;
}
```

Punti chiave:

- i fallback (`0.5`) tengono l’effetto stabile prima che i valori siano disponibili
- `* 100%` trasforma un rapporto 0..1 in una percentuale usabile in `background-position`
- non hai scritto nessun listener `pointermove` né aggiornato variabili a mano

## Performance: traccia solo quando serve
La paura naturale è: “ok, ma se aggiorna tutto live, non mi ammazza le performance?”

La scelta progettuale interessante è che il tracking avviene **solo quando l’elemento è rilevante**, tipicamente quando è in viewport. Quando scorre fuori, smette di aggiornarsi.

Questo evita di buttare cicli CPU su elementi non visibili e rende l’approccio più scalabile su pagine lunghe con molte card.

## Live vs Const: due famiglie di props per due tipi di animazioni
La libreria espone due categorie:

- **`--live-*`**: valori continuamente aggiornati (es. `--live-visible`)
- **`--const-*`**: valori che cambiano “una volta” al verificarsi di un evento (es. `--const-has-entered`)

### Esempio mentale: visibilità
- `--live-visible`: passa da `0` a `1` quando entra in viewport, e torna a `0` quando esce
- `--const-has-entered`: parte da `0`, diventa `1` alla prima entrata, e resta `1`

Questa distinzione è utilissima:

- se vuoi un effetto che **si resetta** (entra/esce), usi `live`
- se vuoi un’animazione che **parte una sola volta**, usi `const`

## Reveal su scroll senza observer: opacity e twist controllati da una variabile
Con `--live-visible` puoi fare un reveal in modo quasi banale:

```css
.twist-in {
  opacity: var(--live-visible, 0);
  transition: opacity 0.75s ease;
}
```

Se però vuoi un twist che “si annulla” quando diventa visibile, puoi invertire il valore:

```css
.twist-in {
  --is-offscreen: calc(1 - var(--live-visible, 0));

  transform:
    perspective(1000px)
    rotateX(calc(var(--twist-x, -8deg) * var(--is-offscreen)))
    rotateY(calc(var(--twist-y, -25deg) * var(--is-offscreen)));

  transition: transform 0.75s ease;
}
```

Come funziona:

- quando `--live-visible` è `0`, `--is-offscreen` vale `1` → la card è inclinata
- quando `--live-visible` è `1`, `--is-offscreen` vale `0` → le rotazioni vanno a zero

### Alternare direzioni senza JS
Puoi personalizzare il verso del twist per singola card impostando solo due variabili:

```html
<article class="card twist-in" style="--twist-y: 25deg; --twist-x: 8deg" data-props-for="visible">
  ...
</article>
```

Così eviti classi extra o logiche condizionali in JavaScript.

## Quando usarla (e quando no)
**Ha molto senso** quando:

- vuoi far “guidare” a CSS trasformazioni/gradienti/filtri
- ti serve una fonte affidabile di valori ambientali (pointer, scroll velocity, viewport…)
- vuoi ridurre boilerplate di observer e listener

**Potresti evitarla** se:

- hai un caso ultra-specifico e preferisci una micro-utility ad hoc
- devi supportare ambienti dove non puoi aggiungere dipendenze

## Sintesi: più dati a CSS, meno colla in JS
Props (for that) è interessante perché sposta l’equilibrio: invece di scrivere JS per orchestrare animazioni, scrivi CSS che *reagisce* a variabili già pronte. Il risultato è spesso più pulito, più modulare e, soprattutto, più facile da mantenere.

L’implicazione pratica è chiara: la prossima volta che stai per aggiungere l’ennesimo `IntersectionObserver` o l’ennesimo `pointermove` per aggiornare `--mouse-x` e `--mouse-y`, fermati un attimo e chiediti se non sia il caso di standardizzare quel flusso. Se CSS ha i dati giusti, molte interazioni diventano semplicemente… CSS.
