---
title: "Popover nativi in HTML con animazioni fluide (senza JavaScript)"
subtitle: "Apri, chiudi, posiziona e anima un popover usando solo attributi HTML e un po’ di CSS moderno: transizioni diverse in entrata/uscita incluse."
description: "I popover nativi sono finalmente pratici: si attivano con un attributo sul bottone, si chiudono con click esterno o Esc, finiscono nel “top layer” (niente lotte di z-index) e possono essere animati in modo credibile anche se partono da display:none. In questo articolo vediamo come collegarli, come evitare i gotcha dei CSS di default, come posizionarli vicino al trigger con anchor positioning (progressive enhancement) e come ottenere transizioni diverse tra apertura e chiusura grazie a @starting-style e transition-behavior: allow-discrete."
publishedAt: 2026-07-01
tags: ["popover HTML","@starting-style","anchor positioning","transition allow-discrete","top layer"]
---
I popover nativi stanno diventando una scelta sempre più sensata per piccoli pannelli contestuali: un box autore, un menu compatto, un help tooltip “ricco”, un micro-form. Il punto forte è che si **aprono e chiudono senza JavaScript**, con comportamento accessibile già integrato (focus, Esc, click esterno) e con rendering nel **top layer**, quindi senza la solita guerra di `z-index`.

In più, con un po’ di CSS moderno, puoi ottenere **animazioni in entrata e in uscita diverse** (non solo un fade generico) pur partendo da uno stato “nascosto” gestito dal browser.

## 1) Markup minimo: collegare bottone e popover

Servono due cose:

- un elemento con attributo `popover`
- un trigger con `popovertarget` che punta all’`id`

```html
<button popovertarget="author-popover">
  Info autore
</button>

<div id="author-popover" popover>
  <strong>Mario Rossi</strong><br />
  Frontend developer
</div>
```

Già così ottieni:

- apertura al click sul bottone
- **light dismiss**: click fuori per chiudere
- **Esc** per chiudere
- gestione focus: quando si apre, il focus entra nel popover (se ci sono elementi focalizzabili)

Nota pratica: il popover può stare “lontano” nel DOM rispetto al trigger. Il flusso di tab e l’accessibilità non dipendono dalla sua posizione fisica nella pagina.

## 2) Attenzione agli stili di default (user agent styles)

Quando aggiungi `popover`, il browser applica stili interni per gestire lo stato chiuso/aperto. In particolare, nello stato chiuso entra in gioco un **`display: none`** (gestito dal browser), motivo per cui l’elemento “sparisce”.

### Gotcha: non impostare `display` sul selettore base
Se scrivi:

```css
#author-popover {
  display: grid;
}
```

rischi di **rompere la scomparsa**: stai sovrascrivendo lo stato “chiuso”. Il risultato tipico è un popover che non torna più davvero invisibile.

Soluzione: se vuoi cambiare display (grid/flex), fallo **solo quando è aperto** usando `:popover-open`.

```css
#author-popover:popover-open {
  display: grid;
}
```

## 3) Posizionamento: dal “centrato” al popover ancorato al trigger

Di default molti browser tendono a centrare il popover nel viewport (in combinazione con inset/margini). Va bene per certi casi, ma spesso vuoi che “esca” dal bottone.

Un primo reset utile è:

```css
#author-popover {
  margin: 0;
  inset: auto;
}
```

Così togli l’effetto “centrato a forza”.

### Progressive enhancement con anchor positioning
Il bello arriva con l’anchor positioning: alcuni browser lo supportano in modo non uniforme, quindi conviene usarlo con `@supports`.

```css
@supports (anchor-name: --a) {
  #author-popover {
    margin: 1rem;
    inset: auto;
    position-area: bottom;
  }
}
```

Perché funziona? Il popover ha un’**ancora implicita** verso l’elemento che lo ha aperto (il trigger). Quindi `position-area: bottom` significa “posizionami sotto al trigger”, senza dover dichiarare manualmente un anchor.

Varianti rapide:

```css
position-area: right;
/* oppure */
position-area: top;
```

### Evitare che copra il trigger: `position-try: flip-block`
Se chiedi `top` ma non c’è spazio, il popover può finire per sovrapporsi al bottone o venire compresso. Puoi dire al browser di “provare” un’alternativa:

```css
@supports (anchor-name: --a) {
  #author-popover {
    position-area: top;
    position-try: flip-block;
  }
}
```

In pratica: prova ad aprire sopra, ma se manca spazio **ribalta** sotto.

## 4) Layout interno: grid/flex senza glitch

Ricorda il gotcha del `display`: va in `:popover-open`. Ma c’è un secondo dettaglio: se alcune proprietà di layout (es. `grid-template-columns`, `gap`) vivono solo dentro `:popover-open`, durante la chiusura potresti vedere “saltare” il layout mentre sta ancora animando.

Buona regola: **il layout interno stabile** (colonne, gap) mettilo sul selettore base; usa `:popover-open` solo per ciò che deve esistere solo da aperto (in primis `display`).

```css
#author-popover {
  grid-template-columns: auto 1fr;
  gap: 1rem;
}

#author-popover:popover-open {
  display: grid;
}
```

## 5) Animare apertura e chiusura (anche con display:none)

Qui entra il CSS moderno: per animare un elemento che passa da `display: none` a `display: grid`, serve dichiarare che alcune transizioni **possono essere discrete** (cioè “a scatto” nel momento giusto), invece di fallire.

### Transizioni con `transition-behavior: allow-discrete`

```css
#author-popover {
  opacity: 0;
  translate: 0 30px;

  transition-property: display, overlay, opacity, translate;
  transition-duration: 200ms;
  transition-timing-function: ease;
  transition-behavior: allow-discrete;
}

#author-popover:popover-open {
  opacity: 1;
  translate: 0 0;
}
```

Note:

- `overlay` è rilevante per gli elementi nel top layer (popover e dialog/modal). In alcuni casi conviene includerlo insieme a `display`.
- `translate` è comodo perché evita di toccare `transform` se lo stai già usando altrove.

### Entrata “pulita” con `@starting-style`
Senza ulteriori accorgimenti, l’apertura può risultare brusca: quando lo stato passa a “visibile”, il browser applica subito layout/display e poi la transizione non parte dal valore atteso.

`@starting-style` risolve proprio questo: definisci lo stile di partenza **solo per l’entrata**.

```css
#author-popover:popover-open {
  opacity: 1;
  translate: 0 0;

  @starting-style {
    opacity: 0;
    translate: 0 30px;
  }
}
```

Importante: l’ordine conta. `@starting-style` deve stare **dentro** al blocco dello stato finale e viene valutato come punto di partenza dell’animazione in ingresso.

### Animazioni diverse in apertura e chiusura
Vuoi che in apertura “salga” (da sotto verso il bottone), ma in chiusura “svanisca” andando verso l’alto? Basta invertire i valori:

```css
#author-popover {
  opacity: 0;
  translate: 0 -10px; /* direzione della chiusura */

  transition-property: display, overlay, opacity, translate;
  transition-duration: 200ms;
  transition-behavior: allow-discrete;
}

#author-popover:popover-open {
  opacity: 1;
  translate: 0 0;

  @starting-style {
    opacity: 0;
    translate: 0 30px; /* direzione dell’apertura */
  }
}
```

In questo modo:
- **entrata**: parte da `translate: 0 30px` e arriva a `0 0`
- **uscita**: parte da `0 0` e torna a `0 -10px`

## Sintesi e implicazioni pratiche

Con `popover` + `popovertarget` puoi coprire un’ampia fetta di UI “leggere” senza JS, con chiusura su click esterno/Esc e gestione del focus già pronta. Con `:popover-open` eviti di rompere lo stato chiuso (soprattutto non toccando `display` sul selettore base) e, grazie a `transition-behavior: allow-discrete` + `@starting-style`, ottieni animazioni credibili anche attraverso il passaggio da `display:none`.

Il passo successivo, se vuoi un popover davvero “da prodotto”, è trattare l’anchor positioning come progressive enhancement: nei browser che lo supportano, il pannello si ancora al trigger con flip intelligente; negli altri, resta una fallback dignitosa (ad esempio centrata). Così il popover nativo diventa una soluzione pragmatica, moderna e sorprendentemente solida.
