---
title: "Perché i computer “non sanno contare” i soldi (e cosa fare nel frontend)"
subtitle: "Il problema non è l’aritmetica: è la rappresentazione dei numeri. E nelle app con pagamenti basta un centesimo “fantasma” per creare caos."
description: "I soldi sembrano solo numeri, ma in software hanno regole rigide: non puoi creare o perdere centesimi, e non puoi essere “quasi corretto”. Eppure, in molti sistemi digitali—specialmente quando operano su grandi volumi—piccoli errori di arrotondamento possono accumularsi e alterare saldi, report e riconciliazioni. Vediamo perché succede (0.1 + 0.2), perché è un rischio reale in ambienti finanziari e quali pratiche concrete adottare nel frontend per non introdurre drift e discrepanze."
publishedAt: 2026-06-18
tags: ["precisione-numerica","valute-e-arrotondamenti","javascript-number","bigint","pagamenti-online","cents-integer"]
---
Gestire denaro in un’applicazione sembra banale: sommi, sottrai, mostri un totale. In realtà è uno dei domini più insidiosi che esistano, perché il denaro **non ammette approssimazioni**: non puoi “perdere” un centesimo per strada, non puoi crearne uno dal nulla e—soprattutto—non puoi essere “quasi corretto”.

Eppure, per anni (e ancora oggi se non si sta attenti) sistemi di pagamento e piattaforme bancarie hanno dovuto combattere una classe di bug legata a una verità scomoda: **i computer non rappresentano i numeri decimali come li pensiamo noi**.

## Il bug che nasce dai dettagli: errori minuscoli che diventano soldi veri
Un errore di 0,0000001 su una singola transazione non fa notizia. Ma prova a moltiplicarlo per milioni di operazioni al giorno: improvvisamente quel “rumore” numerico diventa una deriva misurabile.

Il problema peggiora quando:

- una parte del sistema **arrotonda per eccesso**, un’altra **per difetto**;
- alcuni passaggi **non arrotondano affatto**;
- si combinano conversioni, split di pagamenti, riaggregazioni, rimborsi.

In questi casi il valore può “driftare” (derivare) tra sistemi e report: microscopiche differenze si accumulano e i saldi non tornano più perfettamente.

E c’è un risvolto ancora più delicato: se un flusso consente di ripetere certe operazioni (split/merge, conversione, reverse) introducendo ogni volta un arrotondamento leggermente diverso, quelle discrepanze possono essere **amplificate**. Non serve “bucare” un sistema: basta sfruttare in modo ripetitivo comportamenti numerici incoerenti.

## Il caso classico: 0.1 + 0.2 non fa 0.3
Nel frontend, soprattutto in JavaScript, il problema si vede subito:

```js
0.1 + 0.2
// 0.30000000000000004
```

Se poi fai confronti diretti, ti fai male:

```js
const balance = 0.1 + 0.2;
if (balance === 0.3) {
  console.log('ok');
} else {
  console.log('nope');
}
// nope
```

Non è un “bug di JavaScript”. È un effetto della rappresentazione numerica più comune: i **floating point** (IEEE 754).

## Perché succede: base 10 vs base 2
Noi ragioniamo in base 10 (decimale). I computer, invece, memorizzano i numeri in base 2 (binario). Alcuni decimali “semplici” per noi—come **0.1** o **0.2**—in binario non hanno una rappresentazione finita. Quindi vengono salvati come **approssimazioni**.

Sommi due approssimazioni e ottieni un’altra approssimazione: nella maggior parte delle UI non cambia nulla, ma in ambito finanziario (grandi volumi, riconciliazioni, audit) quei residui diventano costi, contestazioni o vulnerabilità.

## La regola d’oro nei sistemi di pagamento: niente floating point per la valuta
Per questo i sistemi moderni seri **non memorizzano denaro come decimali floating**.

L’approccio tipico è:

- salvare importi come **interi nella unità minima** (es. centesimi);
- fare tutte le operazioni (somma/sottrazione) su interi;
- convertire in decimale **solo in fase di visualizzazione**.

Esempio: invece di `10.23`, memorizzi `1023`.

Questo elimina la classe di errori “0.30000000000000004” e riduce drasticamente le discrepanze da arrotondamento.

## Implicazioni pratiche per chi fa frontend
Anche se la contabilità “vera” vive sul backend, il frontend può introdurre divergenze che poi diventano bug difficili da diagnosticare. Alcune pratiche pragmatiche:

1. **Non sommare prezzi in `Number` se devi ottenere totali affidabili** (carrello, tasse, sconti, rate).
2. **Trasporta importi come interi** (es. `amountCents`) nelle API e nei modelli di stato.
3. **Definisci una strategia di arrotondamento unica** (half-up, half-even, ecc.) e applicala in un solo punto del flusso, non “a ogni passaggio”.
4. **Formatta per l’utente, non per il calcolo**: usa `Intl.NumberFormat` per mostrare, non per computare.
5. Se servono grandi numeri o regole complesse (tassi, conversioni, interessi), valuta librerie/approcci dedicati o tipi numerici appropriati (in JS moderno anche `BigInt`, dove applicabile), ma senza mescolare casualmente rappresentazioni diverse.

## Sintesi: la precisione non è un dettaglio, è una feature
Quando lavori con prezzi e pagamenti, l’obiettivo non è “avere un numero vicino”: è **avere sempre lo stesso numero** tra UI, backend, sistemi esterni e riconciliazioni.

La lezione è semplice e pratica: **i floating point sono ottimi per molte cose, ma il denaro non è una di quelle**. Nel momento in cui rappresenti importi come interi (centesimi) e tratti l’arrotondamento come una regola di business, smetti di inseguire fantasmi come `0.30000000000000004` e costruisci un sistema molto più robusto, verificabile e difficile da sfruttare.
