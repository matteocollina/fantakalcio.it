---
title: "Il futuro del CSS: funzioni, if() e responsive senza media query “a blocchi”"
subtitle: "Le nuove primitive rendono il CSS più espressivo: token come funzioni, logica condizionale e valori che cambiano in base al viewport (o al container) direttamente dentro le proprietà."
description: "Il CSS sta cambiando forma: non solo nuove proprietà, ma nuovi modi di scrivere design token, tipografia fluida e logica responsive. Con @function e if() puoi incapsulare regole, passare argomenti, definire fallback e perfino inserire condizioni media/container dentro un valore. Risultato: meno ripetizione, API più chiare e un CSS che assomiglia sempre più a un linguaggio capace di esprimere intenti, non solo dichiarazioni statiche."
publishedAt: 2026-06-24
tags: ["design token","@function CSS","if() CSS","tipografia fluida","responsive layout"]
---
Negli ultimi anni abbiamo imparato a usare le *custom properties* come “colla” tra design system e implementazione: una manciata di token per spaziature, font-size, colori, e poi `var(--qualcosa)` sparso ovunque.

È un approccio che funziona, ma sta emergendo un’idea diversa: invece di *solo* variabili, iniziare a definire **funzioni CSS** che incapsulano logica e scelte, rendendo i token più simili a una piccola API.

Il punto non è “scrivere meno caratteri”: è **spostare complessità e convenzioni in un posto solo**, per consumarle poi in modo più intenzionale.

## 1) Token come funzioni: spaziature più “API-like”

Con le custom properties classiche si finisce spesso con qualcosa del genere:

```css
.card {
  padding: var(--space-md);
  gap: var(--space-sm);
}
```

L’alternativa è definire una funzione che mappa un argomento (es. `md`, `lg`, `xl`) sul valore corrispondente. Il pattern è: **passo un token, ottengo un valore**.

Concettualmente:

- definisci una funzione (es. `--space()`)
- dentro, usi condizioni per scegliere il valore giusto
- nei componenti, richiami `--space(md)` invece di `var(--space-md)`

Esempio d’uso (lato consumo):

```css
.card {
  padding: --space(md);
  gap: --space(lg);
}
```

La differenza sembra piccola, ma cambia la semantica: non sto “leggendo una variabile”, sto chiedendo un valore a un token system.

### Perché può essere utile

- **Riduce la proliferazione di nomi** (`--space-xxs`, `--space-xs`, …) in favore di un punto d’accesso unico.
- **Rende più facile cambiare l’implementazione** dei token (internamente) senza toccare il consumo.
- **Apre la porta a parametri aggiuntivi**, non solo al nome del token.

## 2) Tipografia: stesso step, output diverso (fixed vs fluid)

Dove il modello “funzione” diventa più interessante è quando hai **una stessa intenzione** (“usa lo step 3”) ma vuoi **varianti** (“fluido” o “fisso”).

Con le custom properties tradizionali, spesso finisci con due token:

- `--fs-3`
- `--fs-3-fluid`

Con una funzione puoi fare una cosa più espressiva: **step + modalità**.

Esempio d’uso:

```css
body {
  font-size: --fs(2);
}

h2 {
  font-size: --fs(5, fluid);
}
```

Qui l’idea è: il secondo argomento può essere opzionale, con un default (es. `fixed`). Se passi `fluid`, la funzione restituisce la versione fluida dello stesso step.

### Il vero vantaggio: intenti più chiari

- `--fs(5)` comunica “voglio lo step 5”.
- `--fs(5, fluid)` comunica “voglio lo step 5, ma che si adatti al viewport”.

Non è impossibile ottenere qualcosa di simile con naming conventions e variabili, ma la funzione ti permette di **modellare l’intento** direttamente.

## 3) Responsive “inline”: un if() dentro il valore

Il salto concettuale più forte arriva quando porti la logica responsive *dentro* una dichiarazione, invece di spezzare il CSS in blocchi.

Classico:

```css
.grid {
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Con le funzioni, puoi costruirti una sorta di helper `--mq()` che prende due valori: uno per “narrow” e uno per “wide”, e internamente decide quale restituire con `if()` in base a una media query (o container query, o support query, ecc.).

L’uso diventa così:

```css
.grid {
  grid-template-columns: repeat(--mq-lg(1, 3), 1fr);
}
```

È una frase sola, ma con un comportamento responsive completo.

### Pro e contro (senza romanticismi)

**Pro**
- Riduci duplicazione: niente più “stessa proprietà riscritta in tre breakpoint”.
- Puoi comporre: il valore condizionale può vivere *dentro* `repeat()`, `clamp()`, `calc()`, ecc.
- Puoi centralizzare breakpoint e logica, rendendo il responsive un dettaglio dell’API.

**Contro**
- **Leggibilità iniziale**: a colpo d’occhio è meno familiare di un blocco `@media`.
- Debug mentale più difficile se esageri con annidamenti e `if()` multipli.

Come sempre, il punto è la misura: questo approccio ha senso quando ti evita ripetizioni e rende più lineare il consumo nei componenti.

## 4) Non solo media query: style, support e container

Un aspetto spesso sottovalutato è che la condizione non deve essere per forza una media query.

Dentro una funzione puoi basarti su:

- **feature query** (`@supports`) per offrire progress enhancement in modo elegante;
- **style queries** per reagire a stati/stili (utile in architetture più “componentizzate”);
- **container queries** per un responsive realmente contestuale.

Il pattern resta lo stesso: *parametri in ingresso → logica → valore in uscita*.

## Implicazione pratica: CSS come “linguaggio di intenti”

Se metti insieme token-funzione, `if()` e condizioni inline, il CSS inizia ad assomigliare meno a un elenco di dichiarazioni e più a un sistema in cui:

- definisci **contratti** (API) per spacing/typography/breakpoints;
- consumi quei contratti in modo coerente e leggibile nei componenti;
- sposti la complessità “di sistema” fuori dal markup dei singoli layout.

### Sintesi

- Le custom properties restano fondamentali, ma le **funzioni CSS** promettono un livello di astrazione più adatto ai design system moderni.
- `if()` rende possibile una logica condizionale che prima richiedeva duplicazioni o preprocessor.
- Il responsive può diventare **componibile**: non più solo “blocchi di override”, ma valori che si adattano *dentro* le proprietà.

Se queste primitive entreranno davvero nel quotidiano, la conseguenza più interessante non sarà “scrivere meno CSS”, ma scrivere un CSS che dichiara meglio l’intento e che scala meglio quando il progetto cresce.
