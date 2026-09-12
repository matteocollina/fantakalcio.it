---
title: "5 proprietà CSS sottovalutate che migliorano subito UI e leggibilità"
subtitle: "Numerazioni automatiche, testi “non selezionabili”, cifre allineate, colonne fluide e underline finalmente controllabili."
description: "Cinque proprietà CSS poco usate ma estremamente pratiche: counters per numerazioni senza liste, user-select per evitare selezioni indesiderate, font-variant-numeric per allineare le cifre, multicolumn per impaginare testi in colonne responsive e text-decoration per underline personalizzate (spessore, offset, stile e colore). Con esempi pronti da copiare."
publishedAt: 2026-05-20
tags: ["CSS counters","multicolumn layout","text-decoration","font-variant-numeric","user-select"]
---
## 1) CSS Counters: numerazioni automatiche senza liste
Capita spesso di voler numerare blocchi “tipo lista” (step, tips, sezioni) senza trasformare il markup in una vera `<ol>`. I **CSS counters** risolvono bene quando la numerazione è **solo visiva** e vuoi evitare di aggiornare i numeri a mano (soprattutto se riordini i blocchi).

### Pattern base
1. Inizializzi il contatore sul contenitore.
2. Incrementi il contatore su ogni item.
3. Stampi il valore con un pseudo-elemento.

```css
.tips {
  counter-reset: tip; /* inizializza (e resetta) il contatore */
}

.tip {
  counter-increment: tip;
}

.tip::before {
  content: counter(tip);
  margin-inline-end: .75rem;
  font-weight: 700;
}
```

### Prefissi, zeri e formattazione veloce
Puoi comporre stringhe in `content`:

```css
.tip::before {
  content: "0" counter(tip) ".";
}
```

Se vuoi riservare spazio stabile, valuta un layout (grid/flex) e una larghezza fissa per il “numero”. Spesso `ch` è utile perché esprime una misura legata alla larghezza del carattere.

### Accessibilità: testo alternativo per `content`
Una chicca poco conosciuta: dentro `content` puoi fornire un testo alternativo dopo uno slash. Se la numerazione è puramente decorativa, puoi “svuotarla” per gli screen reader:

```css
.tip::before {
  content: counter(tip) / "";
}
```

Usalo con criterio: se il numero è informativo (es. “Step 1 di 5”), potrebbe essere meglio che venga letto.

---

## 2) `user-select: none`: evita selezioni indesiderate (senza abusarne)
`user-select` controlla se il testo può essere selezionato. Oggi i browser gestiscono meglio la selezione accidentale sui bottoni, ma ci sono ancora casi reali:

- elementi cliccabili con drag (slider custom, card trascinabili)
- badge, chip, UI “da cruscotto” dove trascinare/sele­zionare testo è solo rumore

```css
.button,
.chip,
.draggable-handle {
  user-select: none;
}
```

**Nota pratica:** non usarlo per “impedire di copiare” contenuti: è una pessima UX e non è una protezione reale. Usalo solo dove la selezione non ha senso e crea attrito.

---

## 3) `font-variant-numeric: tabular-nums`: numeri allineati senza monospace
In molti font proporzionali, le cifre hanno larghezze diverse (un “1” occupa meno di un “0”). In tabelle, listini, dashboard o KPI, questo peggiora la scansione visiva.

Con `tabular-nums` forzi cifre **a larghezza uniforme** *senza* cambiare font in monospace.

```css
table {
  font-variant-numeric: tabular-nums;
}

.kpi {
  font-variant-numeric: tabular-nums;
}
```

Vantaggio: la regola impatta sostanzialmente solo le cifre, quindi puoi applicarla anche a contenitori ampi (tabelle intere, pannelli) senza stravolgere il testo.

---

## 4) Multicolumn: testo in colonne fluide con poche righe
Il layout **multicolonna** è perfetto per testo scorrevole (articoli, note, liste lunghe) quando vuoi un effetto “editoriale” senza costruire una grid manuale.

### Colonne automatiche con `columns`
`columns` accetta due valori: conteggio e larghezza ideale.

```css
.article {
  columns: 3 18ch; /* max 3 colonne, larghezza ideale ~18ch */
  gap: 2rem;
}
```

Questo approccio è molto comodo:
- il browser crea **fino a** 3 colonne
- rispetta una **larghezza di colonna** ragionevole
- al diminuire dello spazio, le colonne “spariscono” gradualmente

> Se specifichi solo il numero di colonne (es. `column-count: 3;`) rischi di “forzare” 3 colonne anche quando diventano troppo strette. Abbina sempre una dimensione (`column-width` o la shorthand `columns`).

### Evitare split brutti: `break-inside: avoid`
Con contenuti a “blocchi” (card, box, snippet) può succedere che un elemento venga spezzato tra colonne. In quei casi:

```css
.card {
  break-inside: avoid;
}
```

Su paragrafi lunghi invece può creare colonne sbilanciate: va valutato in base al contenuto.

### Decorare la separazione: `column-rule`
Vuoi una linea tra le colonne senza hack?

```css
.article {
  column-rule: 2px solid color-mix(in oklab, currentColor 25%, transparent);
}
```

`column-rule` è la “riga” tra colonne: pulita e immediata.

---

## 5) `text-decoration-*`: underline finalmente sotto controllo
Molti si fermano a `text-decoration: underline;`. In realtà hai un set di proprietà che rendono i link molto più curati (e coerenti col design system).

### Spessore: `text-decoration-thickness`

```css
a {
  text-decoration-thickness: .12em;
}
```

### Distanza dal testo (solo underline): `text-underline-offset`
Questa proprietà lavora sulle sottolineature (non su overline/line-through):

```css
a {
  text-underline-offset: .2em;
}
```

### Stile e colore

```css
a {
  text-decoration-style: wavy; /* solid | double | dotted | dashed | wavy */
  text-decoration-color: color-mix(in oklab, currentColor 65%, transparent);
}
```

Puoi usare transizioni soprattutto sul colore (è comodo per hover):

```css
a {
  transition: text-decoration-color 160ms ease;
}

a:hover {
  text-decoration-color: currentColor;
}
```

---

## In sintesi
- **Counters**: numerazioni automatiche e riordinabili, perfette per “liste visive”.
- **user-select**: elimina selezioni accidentali su UI interattive.
- **tabular-nums**: cifre allineate e leggibili in tabelle e KPI.
- **Multicolumn**: impaginazione editoriale con colonne fluide, `gap`, `column-rule` e controllo degli split.
- **text-decoration**: underline su misura (spessore, offset, stile, colore) per link più rifiniti.