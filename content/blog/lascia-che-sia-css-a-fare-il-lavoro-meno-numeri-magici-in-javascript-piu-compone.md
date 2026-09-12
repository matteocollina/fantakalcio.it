---
title: "Lascia che sia CSS a fare il lavoro: meno “numeri magici” in JavaScript, più componenti leggibili"
subtitle: "Passa i dati grezzi al DOM, calcola in CSS con custom properties, calc(), min() e percentuali: il codice diventa più chiaro, più flessibile e spesso anche più veloce."
description: "Capita spesso di vedere UI “guidate” da JavaScript che impostano inline style con altezze e dimensioni calcolate a runtime (es. barre meteo, progressi, indicatori). Funziona, ma introduce numeri magici, logica di presentazione sparsa e manutenzione scomoda. Un approccio migliore è passare al CSS solo i dati grezzi (come custom property) e lasciare che sia CSS a trasformarli in dimensioni, percentuali e limiti visivi. In questo articolo vediamo un pattern pratico e riutilizzabile per farlo bene."
publishedAt: 2026-07-29
tags: ["custom properties","calc()","min() CSS","separazione responsabilità","performance UI"]
---
Molte interfacce “data-driven” finiscono per affidare a JavaScript anche pezzi che sono puramente presentazionali: calcoli per riempire una barra, trasformare un numero in un’altezza, limitare un valore massimo, ecc.

Il classico esempio: un indicatore di pioggia (o un progress bar) a cui viene applicato un `style="height: 45px"` perché da qualche parte c’è uno script che calcola quanto deve essere “piena” la barra.

Funziona, sì. Ma spesso porta con sé tre problemi:

1. **Numeri magici** (es. “10 mm = 100%”), nascosti in JavaScript.
2. **Debug e manutenzione scomodi**: apri DevTools, non trovi nulla nel CSS, poi scopri che c’è un inline style generato.
3. **Flessibilità ridotta**: ogni modifica visiva richiede di toccare logica JS che in realtà riguarda il layout.

L’alternativa è semplice: **JavaScript passa i dati, CSS decide come renderli**.

---

## Il pattern: dati grezzi in una custom property
Invece di impostare direttamente un’altezza in pixel da JS, passa il valore “grezzo” (senza unità) come variabile CSS.

Esempio concettuale sul singolo elemento (barre, card, row, ecc.):

```html
<div class="rain" style="--precip: 8.2"></div>
```

Qui `8.2` non significa ancora nulla per CSS: **manca l’unità**. Ed è proprio il punto: stai trasferendo un dato, non una decisione di stile.

---

## Aggiungere unità in CSS (quando serve)
A questo punto è CSS che trasforma il numero in una misura valida.

Se volessi convertire in pixel (esempio didattico):

```css
.rain {
  block-size: calc(var(--precip) * 1px);
}
```

Oppure in percentuale, `em`, ecc. L’idea è: **CSS “attacca” l’unità nel contesto giusto**.

---

## Percentuali “sensate”: sposta il massimo in CSS
Nel caso di una barra che deve riempirsi rispetto a un massimo (es. 10 mm = barra piena), quel massimo è una regola di visualizzazione. Quindi ha senso stare nel CSS.

```css
.rain {
  --max-precip: 10;
}
```

Ora puoi calcolare la percentuale rispetto al massimo:

```css
.rain {
  block-size: calc(var(--precip) / var(--max-precip) * 100%);
}
```

Ma c’è un problema: se il valore supera il massimo (es. 18 mm), la barra può “sfondare”. Serve un limite.

---

## Limita l’overflow con `min()` (logica sì, ma di presentazione)
Per evitare che l’indicatore superi il 100%, usa `min()`:

```css
.rain {
  --max-precip: 10;
  block-size: min(
    calc(var(--precip) / var(--max-precip) * 100%),
    100%
  );
}
```

Risultato:
- con `--precip: 8.2` ottieni **82%**
- con `--precip: 18` ottieni comunque **100%**

La stessa protezione che spesso viene fatta in JavaScript (clamp, min/max) ora vive dove serve: **nel layer di styling**.

---

## “Ma questa è logica: non dovrebbe stare in JS?”
Dipende dalla logica.

Se la logica **determina il comportamento dell’app** (validazioni, regole di business, permessi, calcoli funzionali), JS è il posto giusto.

Se la logica **serve a tradurre un numero in una resa visiva** (riempimenti, proporzioni, scaling, limiti grafici), metterla in CSS porta vantaggi pratici:

- **Modifiche più rapide**: se domani “barra piena” diventa 20 mm, cambi `--max-precip` nel CSS e fine.
- **Codice più leggibile**: niente caccia agli inline style.
- **Più possibilità compositive**: una volta che il dato è in CSS, puoi animare, tematizzare, fare fallback, cambiare layout senza riscrivere JS.

---

## Un accenno alle performance
Non è una legge universale, ma in molte UI piene di piccoli calcoli presentazionali, spostare trasformazioni e mapping in CSS può:

- ridurre lavoro JS superfluo,
- semplificare il rendering (meno DOM mutation dirette sugli stili),
- rendere più facile ragionare su cosa fa cosa.

Vale comunque la regola d’oro: **misura** se stai intervenendo per ottimizzare, perché ogni app fa storia a sé.

---

## Sintesi: dati in JS, resa in CSS
Quando ti trovi a impostare `element.style.height = ...` (o simili) per motivi puramente grafici, fermati e chiediti:

- posso passare solo il dato come `--variabile`?
- posso fare il mapping in CSS con `calc()`, `min()`, `max()`, `clamp()`?
- il “massimo” o i “limiti” sono regole visuali? Allora mettili nel CSS.

Il risultato è un componente più pulito: **JavaScript fornisce i numeri, CSS decide come appaiono**. E questo, nel lungo periodo, riduce frizione, bug e tempo perso a inseguire stili applicati “da qualche parte”.
