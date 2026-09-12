---
title: "CSS moderno per contenuti dinamici: lascia decidere lo stile ai dati (senza if in JavaScript)"
subtitle: "Con data-attribute, typed custom properties e style queries puoi adattare icone e varianti UI in base a valori reali (pioggia leggera/forte, sole, nuvole)."
description: "Quando l’interfaccia nasce da dati (API, CMS, personalizzazione utente), la tentazione è riempire JavaScript di condizioni per scegliere icone e varianti. Con le style queries e le custom properties tipizzate puoi invece spostare queste decisioni in CSS: il markup resta semplice, JS si limita a passare i dati e lo stile si adatta in modo dichiarativo."
publishedAt: 2026-06-18
tags: ["style queries","data-attribute","custom properties tipizzate","attr()","UI data-driven"]
---
Quando il contenuto è dinamico (arriva da un’API, da un CMS o da un feed), spesso finiamo per mettere in JavaScript anche logiche puramente “visive”: scegliere un’icona, impostare una variante, cambiare un colore in base a una soglia.

Il problema non è solo la quantità di codice: è che stai mescolando **dati** e **presentazione**, rendendo più difficile mantenere e far evolvere l’interfaccia.

Un approccio più pulito è questo:

- **JavaScript passa i dati** (es. meteo, mm di pioggia) nel DOM.
- **CSS interpreta quei dati** e decide l’aspetto (icone, varianti, stati).

Con le funzionalità CSS moderne—in particolare **style queries** e **custom properties tipizzate**—questa separazione diventa pratica e robusta.

---

## 1) Passa i dati al DOM (senza “decidere” in JS)

Immagina una griglia di card meteo generate via JavaScript. Il JS può limitarsi ad aggiungere attributi dati:

```html
<article class="weather-card" data-weather="raining" data-precipitation="8">
  <h3>Mercoledì</h3>
  <span class="icon" aria-hidden="true"></span>
</article>
```

- `data-weather`: condizione testuale (sunny, partly-cloudy, raining…)
- `data-precipitation`: valore numerico (mm)

A questo punto **non ti serve** che JS scelga “rain-heavy.svg” o “rain-light.svg”. Lo fa CSS.

---

## 2) Trasforma gli attributi in custom properties (e tipizzale)

Il passaggio chiave è leggere gli attributi in CSS e salvarli in custom properties.

```css
.weather-card {
  --weather: attr(data-weather);
  --precipitation: attr(data-precipitation number);
}
```

Qui ci sono due dettagli importanti:

1. `--weather` è testo: va bene come ident/stringa.
2. `--precipitation` serve come numero: **tipizzarlo** è fondamentale se vuoi fare confronti (soglie, range, ecc.).

> Se ti dimentichi il tipo numerico, le comparazioni non funzionano: per CSS quel valore resta una stringa.

---

## 3) Usa le style queries per scegliere varianti e icone

Le **style queries** permettono di applicare regole in base a proprietà (incluse custom properties) presenti sull’elemento.

Esempio: condizioni base.

```css
@container style(--weather: sunny) {
  .weather-card .icon { background-image: url(/icons/sun.svg); }
}

@container style(--weather: partly-cloudy) {
  .weather-card .icon { background-image: url(/icons/partly-cloudy.svg); }
}
```

Fin qui è simile a uno switch. Ma il vantaggio vero arriva quando **devi combinare più segnali**.

---

## 4) Pioggia leggera vs pioggia forte (soglie in CSS)

Se “raining” non è un unico stato, puoi distinguere in base ai mm.

```css
@container style(--weather: raining) and style(--precipitation > 5) {
  .weather-card .icon { background-image: url(/icons/rain-heavy.svg); }
}

@container style(--weather: raining) and style(--precipitation <= 5) {
  .weather-card .icon { background-image: url(/icons/rain-light.svg); }
}
```

Risultato:
- sopra i 5mm mostri pioggia “forte”
- fino a 5mm mostri pioggia “leggera”

Senza aggiungere classi extra, senza logica condizionale in JS.

---

## 5) Quando i dati sono “incompleti”: partly cloudy + pioggia

Capita spesso che un’API descriva la condizione principale (es. *partly cloudy*) ma fornisca anche precipitazioni > 0.

In quel caso puoi *raffinare* la resa visiva con una query composta:

```css
@container style(--weather: partly-cloudy) and style(--precipitation > 0) {
  .weather-card .icon { background-image: url(/icons/partly-cloudy-rain.svg); }
}
```

Così l’interfaccia comunica qualcosa di più utile: “parzialmente nuvoloso, ma potrebbe piovere”.

---

## Note pratiche (per evitare inciampi)

- **Nomi coerenti**: se l’attributo si chiama `data-precipitation`, in CSS deve combaciare perfettamente. Un refuso qui rompe tutto in modo silenzioso.
- **Tipizzazione**: per confronti numerici, usa `attr(... number)` (o una strategia equivalente supportata dal browser target) e assicurati che il valore nel DOM sia davvero numerico.
- **CSS come layer decisionale**: tieni JS come “trasporto dati” e CSS come “motore di presentazione”. Ti ritrovi con componenti più riusabili e un codice più facile da evolvere.

---

## Sintesi

Se il tuo UI è guidato dai dati, non sei obbligato a infilare in JavaScript ogni scelta visuale. Passa al DOM valori grezzi (testo e numeri), converti in custom properties e usa style queries per applicare varianti basate su soglie e combinazioni.

Il risultato è un front-end più dichiarativo: **i dati cambiano, e il CSS reagisce**. È un modo concreto per rendere l’interfaccia più resiliente quando il contenuto è dinamico, imperfetto o variabile—che è poi la normalità in produzione.
