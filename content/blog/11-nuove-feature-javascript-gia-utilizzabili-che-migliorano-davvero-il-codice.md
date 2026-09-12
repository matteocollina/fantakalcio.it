---
title: "11 nuove feature JavaScript (già utilizzabili) che migliorano davvero il codice"
subtitle: "Set e Map finalmente “matematici”, iteratori più comodi, import JSON nativo e piccole utility che eliminano boilerplate."
description: "Panoramica di nuove funzionalità JavaScript pensate per ridurre codice ripetitivo e rendere più espressivi i casi d’uso comuni: operazioni tra Set, helper sugli iteratori, Promise.try per unificare la gestione errori, import JSON con attributi, RegExp.escape per input utente, Array.fromAsync per iterable asincroni, Error.isError più affidabile di instanceof e nuovi metodi per Map."
publishedAt: 2026-06-09
tags: ["metodi Set","iterator helpers","Promise.try","import JSON","Array.fromAsync","RegExp.escape"]
---
Negli ultimi aggiornamenti di JavaScript sono arrivati parecchi “miglioramenti di qualità della vita” che non cambiano il linguaggio in modo rivoluzionario, ma cambiano **come scriviamo** tante parti di codice quotidiano: meno boilerplate, meno edge case, più intent esplicito.

Di seguito trovi una selezione di feature particolarmente utili in contesti frontend (ma non solo), con esempi pratici e note su quando usarle.

---

## 1) Nuovi metodi per `Set`: operazioni insiemistiche native

`Set` è perfetto quando ti serve una collezione di valori **unici** (niente duplicati). Finora, però, fare operazioni “da insiemi” richiedeva conversioni ad array e un po’ di codice manuale. Ora invece sono disponibili metodi che rendono `Set` molto più espressivo.

```js
const a = new Set([1, 2, 3])
const b = new Set([3, 4, 5])

a.union(b)                 // Set {1, 2, 3, 4, 5}
a.intersection(b)          // Set {3}
a.difference(b)            // Set {1, 2}
a.symmetricDifference(b)   // Set {1, 2, 4, 5}
```

E non finisce qui: ci sono anche utility per confronti come subset/superset.

```js
const small = new Set([2, 3])
const big = new Set([1, 2, 3, 4])

small.isSubsetOf(big)      // true
big.isSupersetOf(small)    // true
```

**Quando conviene**: deduplica, permessi/ruoli, feature flags, tag, filtri selezionati, confronti tra liste senza costi cognitivi.

---

## 2) Iterator Helpers: `map`, `filter`, `take`, `toArray`… sugli iteratori

Gli iteratori (spesso prodotti da generatori o API che restituiscono `Iterator`) storicamente sono “scomodi”: hai `next()` e poi ti arrangi con `for...of` o loop manuali.

Con gli **iterator helpers** puoi applicare una pipeline simile agli array direttamente sull’iteratore.

Esempio con un generatore infinito:

```js
function* numbers() {
  let i = 0
  while (true) yield i++
}

const it = numbers()

const result = it
  .map(n => n * 2)
  .take(5)
  .toArray()

console.log(result) // [0, 2, 4, 6, 8]
```

Due dettagli importanti:
- `take(n)` è fondamentale quando lavori con iteratori potenzialmente infiniti.
- `toArray()` evita di dover fare conversioni manuali (e rende facile stampare/serializzare).

**Quando conviene**: generatori, stream “lazy”, librerie che restituiscono iteratori, elaborazioni incrementali senza creare array intermedi.

---

## 3) `Promise.try()`: unifica errori sincroni e asincroni

Uno dei problemi più fastidiosi è quando una funzione contiene sia logica sincrona (che può lanciare) sia promesse (che possono rigettare). Senza accorgimenti ti ritrovi con errori che **bypassano** `.catch()` perché avvengono prima di creare/ritornare la Promise.

`Promise.try()` risolve: esegue una callback e trasforma qualunque errore (sync o async) in un flusso Promise gestibile con `.catch()`.

```js
Promise.try(() => {
  // qui dentro: può lanciare sync
  // e può anche ritornare una Promise
  return doSomething()
})
  .then(result => {
    // ...
  })
  .catch(err => {
    // gestisce sia throw sync che reject async
  })
```

**Quando conviene**: pipeline di inizializzazione, wrapper di chiamate, utility che accettano callback “miste”.

---

## 4) Import Attributes: importare JSON nativamente

In ambiente browser, importare JSON “come modulo” non è sempre stato supportato nativamente. Con gli **import attributes** puoi dichiarare esplicitamente il tipo:

```js
import user from "./user.json" with { type: "json" }

console.log(user)
```

Nota pratica: questo è particolarmente utile quando lavori senza bundler (o quando vuoi ridurre configurazioni). Inoltre apre la porta a futuri tipi supportati oltre al JSON.

---

## 5) `RegExp.escape()`: input utente sicuro dentro una regex

Capita spesso di costruire una regex a partire da input utente (search box, filtri, highlight). Il problema: i caratteri speciali (`.`, `?`, `*`, `+`, ecc.) cambiano il significato della regex.

`RegExp.escape()` fa esattamente ciò che serve: **escapa** l’input trasformandolo in una ricerca letterale.

```js
const query = ".com"
const safe = RegExp.escape(query) // "\.com"

const re = new RegExp(safe, "i")
```

**Quando conviene**: ricerca testuale con regex “attorno” (es. prefissi/suffissi), evidenziazione risultati, filtri.

---

## 6) `Array.fromAsync()`: convertire iterable/generator asincroni in array

Se hai un **async iterable** (tipicamente un async generator che pagina un’API), trasformarlo in un array completo richiedeva loop `for await...of` e push manuali.

Con `Array.fromAsync()` fai tutto in un colpo:

```js
async function* fetchPages() {
  let page = 1
  while (true) {
    const data = await getData(page++)
    if (data.length === 0) return
    yield data
  }
}

const all = await Array.fromAsync(fetchPages())
```

In più puoi spesso combinarlo con una trasformazione (mapping) se ti serve normalizzare i dati mentre li collezioni.

**Quando conviene**: paginazione, stream asincroni, iterazioni su sorgenti lente (rete, file, code).

---

## 7) `Error.isError()`: check più robusto di `instanceof Error`

`instanceof Error` funziona nella maggior parte dei casi, ma può rompersi in scenari con “boundary” diversi (es. contesti separati come iframe) o portare a comportamenti inattesi.

Con `Error.isError()` hai un controllo dedicato:

```js
if (Error.isError(value)) {
  // value è un Error
}
```

**Quando conviene**: librerie, utility generiche, app che interagiscono con contesti multipli (iframe, sandbox), parsing di errori provenienti da sorgenti diverse.

---

## 8) Nuovi metodi per `Map`: operazioni più comode (upsert & co.)

`Map` è la scelta giusta quando ti serve una struttura chiave→valore più flessibile di un oggetto (chiavi non solo stringhe, ordine di inserimento, ecc.). Il linguaggio sta aggiungendo metodi che coprono pattern molto comuni, come ottenere un valore **o** inserirne uno di default (il classico “upsert”).

Se ti capita spesso di scrivere:

```js
if (!map.has(key)) map.set(key, defaultValue)
const value = map.get(key)
```

…queste nuove API puntano proprio a eliminare quel boilerplate e rendere l’intento più dichiarativo.

---

## Come scegliere cosa adottare subito

- Se usi molto `Set` per deduplica o confronti: **le operazioni insiemistiche** sono un upgrade immediato.
- Se tocchi generatori/iteratori: gli **iterator helpers** ti fanno risparmiare loop e variabili temporanee.
- Se hai wrapper Promise “sporchi” (sync+async): **`Promise.try()`** pulisce molto.
- Se fai search: **`RegExp.escape()`** evita bug sottili e risultati inattesi.
- Se consumi stream/paginazione: **`Array.fromAsync()`** è una comodità enorme.

Queste feature non sono “da curriculum”: sono strumenti che rendono il codice più leggibile, più corretto e più corto. Esattamente il tipo di miglioramento che, nel lungo periodo, si sente davvero in una codebase frontend.
