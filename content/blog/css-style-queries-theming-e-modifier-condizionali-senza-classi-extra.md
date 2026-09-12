---
title: "CSS Style Queries: theming e “modifier” condizionali senza classi extra"
subtitle: "Le style queries sono finalmente cross‑browser: usale per far decidere al contesto come deve comportarsi un componente, senza moltiplicare classi e breakpoint duplicati."
description: "Le CSS style queries permettono di applicare varianti di stile in base a proprietà (tipicamente custom properties) presenti nel contesto. Questo abilita due pattern molto pratici: il theming “dal genitore ai figli” e i modifier condizionali (es. card compatte solo in certe layout). Vediamo come strutturarle in modo pulito e scalabile, con esempi concreti."
publishedAt: 2026-06-17
tags: ["style queries","container queries","custom properties","theming componenti","CSS architettura"]
---
Le **CSS style queries** sono una di quelle feature che, una volta entrate in produzione, cambiano il modo in cui imposti varianti e temi nei componenti. A prima vista possono ricordare un “modifier” (tipo `.card--primary`, `.card--compact`), ma in realtà il salto è più interessante: **è il contesto a dichiarare l’intenzione** e i componenti si adattano automaticamente.

In pratica: invece di aggiungere classi in giro, puoi far sì che **un contenitore “dica”**: “qui il tema è primary” oppure “qui le card devono essere compatte”, e ogni card dentro quel contesto reagirà.

## Cos’è una style query (in breve)
Una style query è un `@container style(...) { ... }` che verifica **valori di proprietà CSS** nel contesto (spesso **custom properties**).

La forma tipica è:

```css
.card {
  /* stile base */

  @container style(--theme: primary) {
    /* variante */
  }
}
```

Nota importante: a differenza delle container queries “di size”, qui **non stai misurando una dimensione**. Stai chiedendo: “in qualche contenitore antenato è impostata questa proprietà con questo valore?”.

## 1) Theming: far decidere il tema al parent (senza `.card--primary`)
Il caso classico: hai una card che in un’area “primary” deve cambiare colori, bordi, link, pulsanti…

L’approccio tradizionale è aggiungere un modifier alla card:

```html
<section class="cta">
  <article class="card card--primary">...</article>
</section>
```

Funziona, ma scala male: appena aumentano i componenti o i livelli di annidamento, rischi di entrare nella spirale “modifico il contenitore, poi modifico il figlio, poi il nipote…”.

Con le style queries puoi invertire il controllo:

### Imposti il contesto

```css
.cta {
  --theme: primary;
}
```

### E la card si adatta

```css
.card {
  background: var(--surface, white);
  color: var(--text, black);

  @container style(--theme: primary) {
    background: oklch(0.22 0.06 260);
    color: white;

    a {
      color: white;
    }
  }
}
```

Risultato: basta dichiarare `--theme: primary` sull’area e **tutto ciò che sta dentro** (e che ha regole per quel tema) reagisce, senza aggiungere classi specifiche ai componenti.

### Perché è più pulito
- Il tema diventa una **responsabilità del layout/contesto**, non del singolo componente.
- Riduci classi “di stato” applicate manualmente.
- Le varianti sono **componibili**: puoi usare più proprietà (`--theme`, `--density`, `--tone`, ecc.) senza moltiplicare combinazioni di classi.

## 2) Modifier condizionali: “compatto solo quando serve”
Un secondo scenario è ancora più interessante: hai, ad esempio, una sidebar con un elenco di card. In layout a due colonne vuoi card più “dense/compact”, ma quando la pagina collassa (layout stacked) **non vuoi** che restino compatte, perché diventano inutilmente minuscole rispetto al contenuto principale.

Con un modifier classico, finisci spesso per:
- applicare `.card--compact` a tutte le card in sidebar sempre, oppure
- duplicare logica nei media query, oppure
- introdurre JS per togglare classi in base al layout (overkill per un problema di stile).

Con le style queries puoi modellare una “preferenza di densità” guidata dal layout.

### 2.1 Definisci la variante nel componente

```css
.card {
  padding: 1rem;
  font-size: 1rem;

  @container style(--card-density: compact) {
    padding: 0.65rem;
    font-size: 0.925rem;
  }
}
```

### 2.2 Attivi la densità solo nel contesto giusto
E qui sta il punto: non la attivi “sempre”, ma solo quando la sidebar è realmente in modalità “sidebar”, cioè dentro un certo breakpoint/layout.

Esempio concettuale:

```css
@media (min-width: 60rem) {
  aside {
    --card-density: compact;
  }
}
```

- Sotto i 60rem (layout stacked): niente `--card-density: compact` → le card restano normali.
- Sopra i 60rem (due colonne): l’`aside` “annuncia” densità compatta → le card in sidebar si compattano.

In altre parole, ottieni un modifier “tipo classe”, ma **attivabile in modo condizionale** dal CSS, senza dover toccare l’HTML di ogni card.

## Linee guida pratiche per usarle bene
1. **Usa nomi semantici per le custom properties**
   - `--theme`, `--density`, `--tone`, `--emphasis` funzionano meglio di `--blue-mode`.
2. **Tieni lo stile base completo**
   - Le varianti dovrebbero cambiare solo ciò che serve (padding, colori, typographic scale…), non riscrivere tutto.
3. **Evita “prop drilling” manuale**
   - Con style queries, la proprietà può stare sul contenitore giusto e propagarsi naturalmente ai discendenti.
4. **Ragiona per “intenti” e non per “componenti speciali”**
   - “in questa zona il tema è primary” è un intento; “questa card è primary” è spesso un effetto collaterale dell’intento.

## Sintesi
Le **CSS style queries** sono un ottimo strumento per ridurre classi di variante e per rendere i componenti più adattivi al contesto:
- **Theming dal parent**: imposti un tema a livello di sezione e i componenti si adeguano.
- **Modifier condizionali**: attivi varianti come la densità compatta solo quando il layout lo richiede.

Se costruisci design system o semplicemente vuoi CSS più scalabile, l’implicazione pratica è chiara: sposta le “decisioni” (tema, densità, enfasi) nel contesto e lascia ai componenti il compito di reagire. Questo riduce accoppiamento, duplicazioni e classi decorative, mantenendo l’HTML più pulito e il CSS più espressivo.
