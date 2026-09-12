---
title: "CSS Nesting: due trappole comuni (ampersand e specificità)"
subtitle: "Il nesting nativo è sempre più usato, ma ha differenze importanti rispetto ai preprocessori e qualche effetto collaterale sulla specificità."
description: "Il nesting nativo in CSS è ormai abbastanza supportato da finire in produzione. Tuttavia, ci sono due “gotcha” che possono sorprendere: l’uso dell’ampersand (&) in stile BEM (che non si comporta come in Sass/Less) e un caso meno intuitivo in cui la specificità di una selector list può “contaminare” selettori più semplici, rendendo più difficile sovrascrivere alcune regole."
publishedAt: 2026-06-04
tags: ["css-nesting","specificità-css","selettori-css","bem","devtools-css"]
---
Il **CSS Nesting** è finalmente diventato una feature concreta: lo supporto nei browser è ormai buono e sempre più spesso lo si vede in codice reale. Proprio perché sta entrando nelle codebase, vale la pena chiarire due trappole che possono far perdere tempo in debug.

## 1) L’ampersand (`&`) non è un “concat” per i nomi in stile BEM

Chi arriva da Sass/Less tende ad aspettarsi di poter “costruire” nomi di classe BEM così:

```css
.card {
  &__header {
    /* ... */
  }
}
```

Nei preprocessori questo pattern è normale: `&__header` diventa `.card__header`.

Con il **nesting nativo**, però, la logica è diversa: `&` rappresenta il selettore del livello corrente e viene combinato secondo regole che mirano a generare selettori validi nel modello CSS. In pratica, il browser non interpreta `&__header` come “append di stringa”, e il risultato può trasformarsi in un selettore senza senso (o comunque non equivalente a quello che ti aspetti).

### Cosa funziona invece (perché ha senso per CSS)

Questa forma, ad esempio, è perfettamente sensata:

```css
.card {
  &:hover {
    /* ... */
  }
}
```

Qui `&:hover` è una variante pseudo-classica del selettore `.card`, quindi il nesting produce un risultato coerente.

### Come gestire BEM con nesting nativo

Se vuoi restare su BEM “classico”, le alternative pulite sono:

- **Ripetere la classe completa** (esplicito e prevedibile):

  ```css
  .card {
    /* ... */
  }

  .card__header {
    /* ... */
  }
  ```

- **Cambiare approccio**: se l’elemento è semanticamente un heading, valuta selettori strutturali/semantici (quando appropriato) invece di forzare naming concatenato.

Il punto non è “BEM è sbagliato”, ma che il nesting nativo **non è un preprocessor**: evita di portarti dietro meccanismi che erano, di fatto, string interpolation.

---

## 2) Specificità “gonfiata” con le selector list: un effetto collaterale del nesting

Questa è più sottile e può colpire chiunque.

Immagina una regola annidata che coinvolge una **lista di selettori** (con la virgola), ad esempio:

```css
.wrapper {
  #page-title, h2 {
    color: var(--brand-blue);
  }
}
```

A prima vista potresti pensare:

- `h2` è un selettore “debole”
- quindi dovrebbe essere facile sovrascriverlo con qualcosa come `.card h2` (che è più specifico di un semplice `h2`)

Eppure può succedere l’opposto: alcune regole che sembrano facilmente overrideabili **diventano più difficili da battere**, e ti ritrovi con colori/stili che “non ne vogliono sapere” di cambiare.

### Perché succede

Con il nesting, per ragioni di implementazione, quando una selector list contiene selettori con specificità diversa, la specificità effettiva può essere determinata dal **selettore più specifico nella lista**.

Nel caso sopra, `#page-title` (ID) ha specificità alta, e questa può finire per influenzare anche l’altro selettore della lista (`h2`) quando il browser “riscrive” internamente le regole annidate.

Risultato: quell’`h2` può comportarsi come se avesse una specificità molto più alta del previsto, rendendo meno efficaci override che, “a occhio”, dovrebbero vincere.

### Come accorgersene in fretta

Controlla sempre in **DevTools** la specificità della regola applicata: potresti vedere valori sorprendentemente alti (es. `101`) su selettori che sembrano innocui.

### Come evitarlo (linee guida pratiche)

- **Evita liste di selettori miste** (ID + tag/utility) dentro nesting, specialmente se i selettori servono scopi diversi.
- Se devi usare un ID, **isola la regola**:
  - una regola per `#page-title`
  - una regola separata per `h2`
- In generale: nesting o non nesting, cerca di non scrivere CSS che dipende da specificità “accidentali”.

---

## In sintesi

- L’ampersand nel nesting nativo **non è concatenazione per BEM**: `&__element` non è equivalente al comportamento di Sass/Less.
- Con selector list annidate, la specificità può avere effetti non intuitivi: il selettore più specifico nella lista può “alzare” la specificità percepita anche degli altri.

Se il nesting ti piace (e ha senso: spesso migliora la leggibilità), usalo pure—ma con la consapevolezza che è CSS “vero”, con le sue regole e i suoi compromessi, non una scorciatoia da preprocessor.
