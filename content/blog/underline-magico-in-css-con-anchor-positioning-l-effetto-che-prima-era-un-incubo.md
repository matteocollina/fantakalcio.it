---
title: "Underline “magico” in CSS con Anchor Positioning: l’effetto che prima era un incubo, ora sono poche righe"
subtitle: "Pseudo-elementi, blur e ancoraggi: un highlight/underline che segue i link in hover e focus senza calcoli complicati né wrapper strani."
description: "Creare un underline o un evidenziatore animato che “insegua” le voci di una nav era spesso un esercizio di pazienza: misure, offset, resize, layout che cambia. Con CSS Anchor Positioning puoi ancorare un pseudo-elemento a un elemento e farlo saltare automaticamente sull’ultimo anchor attivo (es. il link in hover/focus), con animazioni fluide e anche un tocco di blur/glass se vuoi."
publishedAt: 2026-08-27
tags: ["anchor-positioning","pseudo-elementi","navbar","animazioni-css","focus-accessibile","blur-backdrop"]
---
## Perché questo effetto era complicato
Il classico “underline animato” che scorre sotto le voci della navigazione, seguendo hover e focus, storicamente richiedeva:

- JavaScript per misurare posizione e larghezza del link attivo
- variabili CSS aggiornate da JS
- wrapper aggiuntivi e layout fragili
- edge case su resize, font loading, zoom, contenuti dinamici

Con **CSS Anchor Positioning** l’idea cambia: non misuri più “dove sta” l’elemento. Lo **ancori**.

---

## L’idea: un overlay (pseudo-elemento) ancorato alla nav
Costruiamo l’effetto con due pseudo-elementi (tipicamente `::before` e `::after`) che possono coprire un’area e muoversi.

Uno può essere responsabile della “texture”/immagine (anche riprendendo lo sfondo della pagina), l’altro può aggiungere un **blur** o un layer estetico.

A livello di posizionamento, il punto chiave è:

1. i pseudo-elementi sono `position: absolute` (o `fixed` in base all’effetto)
2. invece di riferirsi a un `position: relative` sul parent, si riferiscono a un **anchor**
3. i loro `top/right/bottom/left` (ovvero le *inset properties*) diventano **relativi all’anchor**

> Nota pratica: quando si lavora con anchor positioning, aggiungere `position: relative` “per abitudine” sul contenitore può introdurre comportamenti indesiderati. Qui conviene ragionare per ancoraggi, non per stacking contest tradizionali.

---

## 1) Creare un anchor “di base” sulla nav
Si assegna un nome all’anchor, ad esempio `nav`:

```css
nav {
  anchor-name: --nav;
}
```

Ora i nostri pseudo-elementi possono dichiarare quale anchor usare:

```css
nav::before,
nav::after {
  content: "";
  position: absolute;
  position-anchor: --nav;
}
```

A questo punto, invece di fare `inset: 0` (o `top/right/bottom/left: 0`), si impostano i lati usando i riferimenti dell’anchor. È comune partire dal basso perché è più evidente visivamente.

Concettualmente:

- `bottom` si aggancia al `bottom` dell’anchor
- `top/right/left` seguono allo stesso modo

Questo trasforma un overlay “a schermo intero” in un overlay che combacia con l’area dell’elemento ancorato.

---

## 2) Far “saltare” l’anchor sull’elemento in hover/focus
La parte sorprendente è che puoi **riutilizzare lo stesso anchor name** sui link (o sugli item) durante hover/focus.

Esempio concettuale:

```css
nav a:hover,
nav a:focus-visible {
  anchor-name: --nav;
}
```

Risultato: quando passi da un link all’altro, l’anchor effettivo diventa l’ultimo elemento nel DOM che espone `--nav`.

Quindi il tuo pseudo-elemento, che continua a dire “mi ancora a `--nav`”, in realtà **segue automaticamente** il link attivo.

Questo elimina tutta la logica di tracking manuale.

---

## 3) Animare lo spostamento: transition sulle inset properties
Dato che stai muovendo `top/right/bottom/left`, la transizione può essere impostata direttamente su queste proprietà (o su tutte, se preferisci):

```css
nav::before,
nav::after {
  transition-property: top, right, bottom, left;
  transition-duration: 350ms;
}
```

Per un movimento più “fisico” e gradevole, una curva di timing più ricca di `ease` fa la differenza:

```css
nav::before,
nav::after {
  transition-timing-function: linear(
    0, 0.5, 1.05, 1.15, 1.1, 1.0
  );
}
```

(Le curve `linear()` permettono fine controllo: puoi ottenere un effetto elastico/bouncy senza dover ricorrere a keyframes.)

---

## 4) Rifinire la geometria con un po’ di “matematica” sugli inset
Una volta che l’overlay segue l’anchor, spesso vuoi trasformarlo in un underline reale: più basso, più sottile, con un offset.

Qui entra in gioco la possibilità di calcolare i lati invece di copiarli 1:1. Concettualmente:

- `bottom`: “ancorato al bottom, ma spostato di qualche pixel”
- `top`: calcolato a partire da `bottom` per ottenere uno spessore controllato
- `left/right`: aggiungere padding laterale (es. `+ 1rem`)

Questa logica è utile perché mantiene l’effetto coerente anche se cambiano font, dimensioni e spaziature.

---

## 5) Stati: underline normale vs highlight “pieno” quando la nav è attiva
Un’ulteriore rifinitura è cambiare comportamento quando l’intera nav è in hover (o quando contiene focus):

- stato base: underline sottile sotto il link attivo
- stato “nav attiva”: overlay più evidente, magari con blur/texture

Concettualmente:

```css
nav:hover::before,
nav:has(:focus-visible)::before {
  /* cambia dimensioni/offset dell’overlay */
}
```

Questo permette una UI più ricca senza introdurre logica extra.

---

## Implicazione pratica (e perché vale la pena)
Con Anchor Positioning, un underline animato che segue i link passa da “micro-progetto con JS e misure” a **pattern CSS**:

- un anchor di default sulla nav
- lo stesso anchor riapplicato al link in hover/focus
- un pseudo-elemento che si ancora e si anima via inset
- eventuali offset calcolati per ottenere underline, pill, highlight, glow

In pratica: meno fragilità, meno codice, più controllo visivo. Se stai progettando una navigazione con micro-interazioni, questo approccio è uno dei modi più puliti per ottenere un risultato moderno e robusto.
