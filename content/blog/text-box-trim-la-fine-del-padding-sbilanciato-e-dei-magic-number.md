---
title: "text-box-trim: la fine del padding “sbilanciato” (e dei magic number)"
subtitle: "Un paio di proprietà CSS per tagliare l’extra spazio dei font e rendere coerenti padding e gap, a prescindere dal typeface."
description: "Il padding verticale “uguale” che sembra diverso è un classico problema dovuto alle metriche dei font: ascender, accenti e discendenti aggiungono spazio invisibile sopra e sotto al testo. Oggi CSS offre una soluzione nativa: text-box-trim insieme a text-box-edge permettono di rifilare quel margine interno e far combaciare il box con cap height e baseline. Risultato: bottoni, chip e UI one-line finalmente centrati senza trucchi, e design/implementazione più allineati."
publishedAt: 2026-09-02
tags: ["text-box-trim","text-box-edge","metriche tipografiche","padding verticale","baseline e cap height","bottoni CSS"]
---
Il “mistero” è sempre lo stesso: imposti `padding-top` e `padding-bottom` identici, eppure il testo sembra più vicino sopra (o sotto). Cambi font e cambia di nuovo. Ritocchi a occhio, poi arriva un’altra famiglia tipografica e tutto si rompe.

Non è un bug del tuo CSS: è il modo in cui i font definiscono le proprie **metriche**. Per accomodare **accenti**, **ascender** e **discendenti**, il box tipografico include spazio extra che influisce sul modo in cui percepiamo il bilanciamento verticale.

La buona notizia è che oggi esiste un rimedio nativo: **`text-box-trim`** (con **`text-box-edge`**) permette di “rifilare” quello spazio in eccesso, così il box si allinea in modo più prevedibile a **cap height** e **baseline**.

---

## Perché il padding “uguale” sembra diverso
Quando guardi un bottone con testo su una riga, il problema salta subito all’occhio:

- il box del testo include spazio “tecnico” sopra (per accenti e ascender)
- e sotto (per discendenti)
- ma **non è detto che sia simmetrico**

In più, **ogni font** ha metriche diverse: quello che “sembra centrato” con una famiglia può risultare spostato con un’altra. Da qui la tentazione dei **magic number**: piccoli aggiustamenti finché “pare giusto”.

Lo stesso fenomeno si nota anche nei layout con `gap`: anche se stai spaziando elementi in modo matematicamente corretto, la percezione può risultare sporca perché parte di quello spazio viene “mangiato” dal box tipografico.

---

## Il fix moderno: text-box-trim
`text-box-trim` serve a **tagliare** (trim) parte del box tipografico legato alle metriche del font.

### 1) Attivare il trim
Puoi decidere se rifilare:

- **entrambi i lati** (`both`)
- solo l’inizio (in pratica l’alto, `start`)
- solo la fine (in pratica il basso, `end`)

Nella maggior parte delle UI “da prodotto” (bottoni, chip, pill, badge…) la scelta più utile è **rifilare sopra e sotto**.

### 2) Scegliere “dove” tagliare: text-box-edge
A differenza di altri strumenti di design che propongono un singolo trim “verticale”, in CSS puoi controllare con precisione i riferimenti tipografici.

La proprietà chiave è `text-box-edge`, che definisce l’edge superiore e inferiore a cui ancorare il box dopo il trim.

Valori rilevanti:

- **Top:** `cap` (cap height) oppure `ex` (x-height)
- **Bottom:** `alphabetic` (baseline alfabetica)

In pratica, la combinazione più comune per UI è:

- **top:** `cap`
- **bottom:** `alphabetic`

Così il box diventa “tight”: sopra arriva alla cap height, sotto arriva alla baseline, eliminando la sensazione di testo otticamente spostato.

---

## Shorthand consigliato (il caso tipico)
Quando l’obiettivo è rendere coerente la spaziatura verticale nelle componenti a una riga, la dichiarazione più sensata è:

```css
.button {
  text-box: trim-both cap alphabetic;
}
```

Se preferisci le proprietà esplicite (a seconda di come le supporta la tua toolchain), l’idea è la stessa: abiliti il trim e imposti gli edge.

---

## Effetto collaterale: i tuoi numeri di padding cambiano
C’è un punto fondamentale: quando inizi a usare `text-box-trim`, **le vecchie abitudini di padding verticale diventano “troppo strette”**.

Prima parte del “respiro” che vedevi era in realtà spazio delle metriche del font. Dopo il trim quello spazio sparisce, quindi:

- a parità di `padding-block`, il bottone può sembrare più compresso
- dovrai spesso **aumentare i valori verticali** rispetto a prima

Non è un problema: è semplicemente che finalmente il padding che stai impostando è *davvero* quello che ottieni, senza bonus invisibili.

---

## Coerenza tra font diversi: il vero vantaggio
Il guadagno più grande non è solo estetico, ma di **robustezza**:

- cambi `font-family`
- cambi peso (`font-weight`)
- cambi font fallback

…e la spaziatura verticale rimane coerente perché viene rifilata **in base alle metriche del font in uso**, non in base a un aggiustamento “tarato” su un singolo typeface.

---

## E nei layout con gap?
Applicare il trim dove stai usando `gap` può dare un effetto iniziale spiazzante: sembra che lo spazio “sparisca”. In realtà lo spazio c’è, ma:

- discendenti e metriche rientrano nel gap
- otticamente lo spazio appare più piccolo

Anche qui, se vuoi mantenere lo stesso “respiro” visivo di prima, spesso dovrai **aumentare il gap**. Detto questo, non è obbligatorio usare `text-box-trim` ovunque: ha molto senso su componenti UI one-line, mentre su blocchi di testo e layout generali può essere una scelta più situazionale.

---

## Quando usarlo (pratico)
Ottimi candidati:

- bottoni con testo su una riga
- chip / pill / badge
- toggle, tab, label compatte
- elementi in cui `line-height: 1` e padding verticale devono risultare otticamente centrati

Più cautela (valuta caso per caso):

- paragrafi e blocchi multi-linea
- layout dove il testo non è il “contenuto principale” del box, o dove il trim può cambiare aspettative di allineamento

---

## Sintesi
La spaziatura verticale “strana” non è colpa del padding: è l’effetto collaterale delle **metriche dei font**, variabili da famiglia a famiglia. Con `text-box-trim` e `text-box-edge` puoi finalmente rifilare lo spazio tipografico in eccesso e ottenere componenti **più coerenti, prevedibili e portabili**.

La parte da mettere in conto è una sola: ricalibrare i valori di `padding-block` (e talvolta di `gap`). In cambio, elimini una delle fonti più comuni di micro-inefficienze nel CSS quotidiano: i magic number per far sembrare centrato ciò che, tecnicamente, non lo è mai stato davvero.
