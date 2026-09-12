---
title: "CSS text-box: finalmente testo senza “spazio fantasma” sopra e sotto"
subtitle: "Con text-box, text-box-trim e text-box-edge il box tipografico diventa preciso: utile per layout, badge, bottoni e allineamenti perfetti."
description: "In CSS il testo porta con sé spazio extra sopra e sotto dovuto alle metriche del font: un dettaglio che complica allineamenti verticali, badge, pill e componenti “pixel-perfect”. La nuova proprietà text-box (shorthand) unisce text-box-trim e text-box-edge per rifilare il box del testo in modo controllato, scegliendo cosa tagliare (top/bottom) e a quali riferimenti tipografici (cap height, x-height, baseline)."
publishedAt: 2026-05-14
tags: ["tipografia-css","text-box-trim","text-box-edge","allineamento-verticale","layout-pixel-perfect"]
---
Uno dei problemi più fastidiosi quando si lavora con il testo in CSS è la presenza di **spazio extra sopra e sotto le lettere**. Anche se imposti un bordo attorno a un elemento inline o a un contenitore che avvolge del testo, spesso noterai che il bordo non “abbraccia” davvero i glifi: c’è sempre un margine invisibile che rende più difficile ottenere componenti compatti e allineamenti verticali credibili.

Quel margine non è un bug: deriva dalle **metriche tipografiche del font** (ascender/descender, line box, ecc.). Il punto è che, per molte UI moderne (chip, badge, pulsanti piccoli, label in header, contatori), questa tolleranza è più un ostacolo che un vantaggio.

La novità è che oggi abbiamo un modo molto più diretto per intervenire: **`text-box`**, una shorthand che combina due proprietà:

- **`text-box-trim`**: decide *quali lati* rifilare (sopra/sotto).
- **`text-box-edge`**: decide *a quali riferimenti tipografici* agganciare il taglio.

Da sole non sono particolarmente utili; insieme diventano un’arma potente per rendere il box del testo più “onesto” rispetto a ciò che vedi.

---

## Il concetto: rifilare top e bottom del box del testo
L’idea è semplice: invece di accettare lo spazio extra generato dalle metriche del font, puoi chiedere al browser di **tagliare** (trim) il box del testo in alto, in basso o in entrambi i lati.

### 1) `text-box-trim`: cosa tagliare
`text-box-trim` controlla *dove* applicare il taglio:

- `both`: rifila sia sopra che sotto (spesso è l’opzione più sensata per UI compatte).
- `start`: rifila solo “l’inizio” del blocco (tipicamente la parte superiore).
- `end`: rifila solo la fine (tipicamente la parte inferiore).

> Nota pratica: nella maggior parte dei componenti UI vuoi un comportamento coerente, quindi **`both`** è un buon default.

### 2) `text-box-edge`: a quale “altezza” agganciare il taglio
`text-box-edge` definisce *come* rifilare i bordi e accetta **due valori**:

- primo valore: riferimento per il **top**
- secondo valore: riferimento per il **bottom**

E qui sta la parte davvero interessante: puoi scegliere riferimenti tipografici diversi a seconda del risultato che vuoi.

Esempi di riferimenti utili:

- **`cap`** (top): taglia fino all’altezza delle **maiuscole** (cap height). Perfetto se vuoi che una label “tocchi” visivamente la parte alta delle lettere.
- **`ex`** (top): taglia fino alla **x-height** (circa l’altezza delle minuscole). Utile se vuoi una resa più compatta e coerente su testi prevalentemente in minuscolo.
- **`alphabetic`** (bottom): taglia fino alla **baseline alfabetica**; in pratica può arrivare a sacrificare le discendenti (g, p, q, y), quindi va usato con consapevolezza.

---

## La shorthand `text-box`: meno errori, più leggibilità
Perché esiste `text-box`? Perché nella pratica devi **configurare sia cosa tagliare che dove agganciarti**. La shorthand aiuta a dichiarare tutto insieme, rendendo più difficile dimenticare un pezzo.

Un esempio tipico (trim sopra e sotto, top sulle maiuscole):

```css
.label {
  text-box: trim-both cap;
}
```

In alternativa, separando le proprietà:

```css
.label {
  text-box-trim: both;
  text-box-edge: cap alphabetic;
}
```

Il vantaggio della forma lunga è la chiarezza (specie quando vuoi controllare top e bottom in modo diverso); il vantaggio della shorthand è la compattezza e la minore probabilità di configurazioni “a metà”.

---

## Scegliere la strategia di trim: casi d’uso concreti
Di seguito alcune scelte ragionevoli che emergono spesso nella UI.

### Badge/Chip molto compatti
Se stai costruendo pill con altezza ridotta e vuoi evitare padding “gonfiati” dal line box:

- trim: `both`
- top: `cap` oppure `ex` (dipende da maiuscole/minuscole)
- bottom: valuta con attenzione `alphabetic` se hai discendenti

### Allineamenti verticali in header e toolbar
Quando testi e icone devono sembrare allineati “a occhio”, il box tipografico tradizionale introduce differenze percettive tra font e dimensioni. Rifilare in modo consistente può ridurre micro-disallineamenti.

### Bottoni piccoli e contatori
Numeri e label corte soffrono spesso di extra-space “inspiegabile” sopra/sotto. Un trim ben scelto rende il componente più solido, soprattutto in dimensioni XS.

---

## `start` e `end`: trim parziale
Non sempre vuoi rifilare entrambi i lati. In alcune UI potresti voler:

- rifilare **solo sopra** (`start`) per far “salire” la label senza toccare le discendenti
- rifilare **solo sotto** (`end`) per un allineamento migliore alla baseline di elementi adiacenti

Esempio:

```css
.title {
  text-box-trim: start;
  text-box-edge: cap alphabetic;
}
```

Qui il bottom rimane più conservativo, mentre il top diventa più “tight”.

---

## Considerazioni pratiche
- **Tipografia prima di tutto**: `cap`, `ex`, `alphabetic` sono ancoraggi tipografici; cambiare font può cambiare sensibilmente la resa.
- **Attenzione alle discendenti**: un bottom aggressivo (es. `alphabetic`) può rendere scomode parole con g/p/q/y.
- **Usalo dove serve davvero**: è ideale per componenti UI compatti; su paragrafi e blocchi di testo lunghi spesso è inutile (o persino dannoso per la leggibilità).

---

## In sintesi
Con `text-box` (e la coppia `text-box-trim` + `text-box-edge`) puoi finalmente **ridurre o eliminare lo spazio extra** che rende il box del testo meno prevedibile. È un passo importante verso componenti tipografici più precisi: badge, bottoni piccoli, label, toolbar e layout “pixel-perfect” ne beneficiano subito.

Se stai rifinendo una design system, vale la pena sperimentare: basta poco per trasformare un UI “quasi allineata” in una UI che sembra davvero curata.
