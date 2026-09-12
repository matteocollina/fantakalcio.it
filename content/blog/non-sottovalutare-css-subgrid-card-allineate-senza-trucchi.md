---
title: "Non sottovalutare CSS Subgrid: card allineate senza trucchi"
subtitle: "Quando titoli, contenuti e footer devono “cadere” sulla stessa linea, subgrid risolve un problema classico delle card responsive."
description: "Allineare sezioni interne di card con altezze variabili è una delle seccature più frequenti nei layout a griglia. Con CSS subgrid puoi far ereditare alle card le righe del grid container, ottenendo allineamento perfetto di titolo, body e footer anche con colonne responsive via auto-fit. Vediamo come impostarlo in modo pulito e controllare le immagini senza complicare la griglia padre."
publishedAt: 2026-08-06
tags: ["css-subgrid","css-grid","layout-card","responsive-design","auto-fit"]
---
Chi costruisce UI a “card” lo conosce bene: due righe di titolo in una card, una sola riga in un’altra, descrizioni più o meno lunghe… e all’improvviso i pulsanti in basso non sono più allineati, i blocchi centrali “ballano” e l’insieme sembra disordinato.

Con **CSS Subgrid** puoi ottenere un allineamento impeccabile tra card diverse, senza dover forzare altezze arbitrarie o aggiungere wrapper e hack.

## Il problema: card con contenuti variabili
Immagina una griglia di prodotti:

- immagini con dimensioni diverse
- titoli più o meno lunghi
- un’area descrittiva o dettagli
- un footer con prezzo e CTA

Visivamente vuoi che:

- **tutti i titoli** inizino e finiscano sulla stessa “banda”
- **tutte le descrizioni** stiano nella banda centrale
- **tutti i footer** (bottoni, prezzo, ecc.) si allineino in basso

Il classico `display: grid` dentro ogni card aiuta a organizzare i contenuti *localmente*, ma non garantisce che le righe interne siano coerenti *tra card diverse*.

## L’idea: una griglia padre per le colonne, subgrid per le righe
La soluzione funziona molto bene quando:

1. il contenitore padre gestisce **le colonne** (spesso responsive)
2. ogni card “aggancia” le **righe** del padre, così i suoi blocchi interni finiscono esattamente sulle stesse linee degli altri

In pratica, la card diventa una griglia, ma le sue righe non sono “indipendenti”: usa `subgrid`.

## Esempio: griglia responsive con `auto-fit`
Un setup tipico per la griglia padre:

```css
.products {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
```

`auto-fit` (con `minmax`) ti permette di ottenere un numero di colonne fluido in base allo spazio disponibile. Fin qui tutto standard.

## La card: `grid-row: span ...` + `grid-template-rows: subgrid`
Ora la parte interessante: la card deve dichiarare che occuperà un certo numero di righe del parent, **pari alle sezioni che vuoi allineare**.

Esempio con 4 sezioni (immagine, titolo, contenuto, footer):

```css
.product-card {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
}
```

- `grid-row: span 4` dice: “questa card si estende su 4 righe della griglia padre”.
- `grid-template-rows: subgrid` dice: “le righe interne della card devono essere quelle del parent”.

Il risultato pratico è che le sezioni equivalenti delle varie card finiscono sempre sulla stessa linea: **allineamento automatico, costante, pulito**.

### Struttura HTML (indicativa)
```html
<article class="product-card">
  <img class="product-image" src="..." alt="" />
  <h3 class="product-title">...</h3>
  <p class="product-desc">...</p>
  <footer class="product-footer">...</footer>
</article>
```

## Controllare le immagini senza complicare la griglia
Se il disallineamento nasce anche da immagini troppo alte (o con aspect ratio molto variabile), il modo più semplice è **imporre una dimensione coerente direttamente sull’immagine**, invece di ristrutturare righe e vincoli sul contenitore padre.

Esempio minimal:

```css
.product-image {
  height: 100px;
  width: 100%;
  object-fit: cover;
}
```

Così:

- l’immagine diventa prevedibile
- il resto del contenuto si allinea sulle righe subgrid
- eviti di “sporcare” la griglia padre con logiche che riguardano solo l’aspetto del media

## Quando subgrid è davvero la scelta giusta
Usalo quando:

- hai **componenti ripetuti** (card, righe di tabella, moduli complessi)
- vuoi **coerenza verticale** tra sezioni omologhe
- le altezze dei contenuti sono **intrinsecamente variabili**

Se invece ti basta allineare un singolo elemento (es. footer sempre in basso) e non ti interessa che *tutte* le bande combacino tra card, potresti risolvere anche con altre tecniche. Ma quando vuoi un layout “da catalogo” ordinato, subgrid è difficile da battere.

## Sintesi e implicazione pratica
Subgrid brilla nei layout a card: lasci al contenitore padre la responsabilità delle **colonne responsive** (magari con `auto-fit`), e fai in modo che ogni card erediti le **righe** del padre con `grid-template-rows: subgrid` dopo aver definito quante righe deve occupare (`grid-row: span ...`).

Il guadagno è immediato: meno CSS difensivo, meno compromessi sulle altezze, e un allineamento che resta stabile anche quando i contenuti cambiano. In un’interfaccia reale—dove testi e immagini non sono mai perfettamente uniformi—è uno di quei dettagli che alza drasticamente la qualità percepita del layout.
