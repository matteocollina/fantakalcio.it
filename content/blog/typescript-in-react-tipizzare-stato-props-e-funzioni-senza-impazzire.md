---
title: "TypeScript in React: tipizzare stato, props e funzioni senza impazzire"
subtitle: "Una guida pratica per portare un progetto React “classico” in TypeScript, con scelte di typing sensate e componenti più riusabili."
description: "Integrare TypeScript in React non significa riempire il codice di tipi ovunque: significa mettere i tipi nei punti giusti. In questo articolo vediamo un flusso di lavoro concreto: creare un progetto React con Vite + TypeScript, tipizzare dati e utility, gestire useState con generics quando serve, e definire props (anche funzione) in modo pulito e riusabile."
publishedAt: 2026-07-08
tags: ["useState con generics","props tipizzate","funzioni come props","Vite + TypeScript","utility tipizzate"]
---
## Perché TypeScript in React fa davvero la differenza
In un progetto React reale, gli errori più fastidiosi raramente sono “sintassi sbagliata”. Di solito sono:

- stato che cambia forma nel tempo (stringhe che diventano boolean, array che contengono `any`),
- props passate male tra componenti,
- callback con parametri non chiari (o non documentati),
- refactor che rompono comportamenti lontani dal punto in cui stai lavorando.

TypeScript interviene esattamente qui: ti aiuta a **rendere espliciti i contratti** (stato, funzioni, props) e a farli rispettare automaticamente dall’editor e dalla build.

---

## Parti bene: crea il progetto già “TypeScript-ready”
Aggiungere TypeScript in un progetto React esistente è possibile, ma richiede una serie di passaggi (dipendenze, configurazioni, rinomina file, dichiarazioni dei tipi) che aumentano il rischio di attriti inutili.

La via più pulita è creare direttamente un progetto con Vite e variante TypeScript:

```bash
npm create vite@latest
# Framework: React
# Variant: TypeScript
npm install
```

Così ti ritrovi già:

- `typescript`,
- `@types/react` e `@types/react-dom`,
- configurazioni TS pronte (spesso con `tsconfig` suddivisi per app/node),
- ESLint e toolchain compatibili.

In pratica: meno “config fatigue”, più tempo sul codice.

---

## Tipizzare i dati: array di stringhe e array di oggetti
### 1) Array di stringhe
Un file che esporta parole del gioco è il caso più semplice: **un array di stringhe**.

```ts
export const words: string[] = [
  "javascript",
  "typescript",
  "react",
]
```

Qui TypeScript spesso inferisce già il tipo, ma l’annotazione esplicita è utile quando vuoi rendere il contratto inequivocabile.

### 2) Array di oggetti: inline vs type dedicato
Quando hai una lista di “linguaggi” con proprietà ripetute, puoi scegliere due strade:

**Inline** (veloce, ma meno riusabile):

```ts
export const languages: {
  name: string
  backgroundColor: string
  color: string
}[] = [
  { name: "JavaScript", backgroundColor: "#f7df1e", color: "#000" },
]
```

**Type dedicato** (consigliato):

```ts
type Language = {
  name: string
  backgroundColor: string
  color: string
}

export const languages: Language[] = [
  { name: "JavaScript", backgroundColor: "#f7df1e", color: "#000" },
]
```

Il vantaggio del type dedicato emerge subito quando:

- lo riutilizzi in più file,
- lo usi come tipo di prop,
- vuoi mantenere un’unica fonte di verità.

---

## Tipizzare le utility: funzioni con return chiaro e niente `any`
Due tipologie di funzioni ricorrono spesso:

- funzioni che ritornano un valore deterministico (es. una stringa),
- funzioni che scelgono casualmente da una lista.

### Return type esplicito
Anche se TS può inferire, dichiarare il return type è un ottimo esercizio di chiarezza:

```ts
export function getRandomWord(): string {
  // ...
  return "react"
}
```

### Parametri tipizzati (il primo argine contro `any`)
Quando una funzione riceve un parametro e TypeScript non riesce a dedurlo, rischi `any` implicito (dipende dalle impostazioni). Tipizza subito:

```ts
export function getFarewellText(language: string): string {
  const options: string[] = [
    `Addio, ${language}!`,
    `${language} è stato rimosso dalla timeline.`,
  ]

  const randomIndex: number = Math.floor(Math.random() * options.length)
  return options[randomIndex]
}
```

### Refactor utile: estrai `getRandomIndex`
Se ripeti lo stesso calcolo in più punti, estrarlo migliora leggibilità e testabilità.

```ts
function getRandomIndex(arr: string[]): number {
  return Math.floor(Math.random() * arr.length)
}
```

Poi lo riusi:

```ts
export function getRandomWord(): string {
  return words[getRandomIndex(words)]
}

export function getFarewellText(language: string): string {
  const options: string[] = [/* ... */]
  return options[getRandomIndex(options)]
}
```

Nota: qui `getRandomIndex` accetta `string[]` perché è il caso d’uso attuale. Se vuoi renderla più generica in futuro, puoi passare a un generic `T[]` (ma solo quando serve davvero).

---

## Tipizzare `useState`: quando l’inferenza basta e quando no
`useState` spesso inferisce bene il tipo dal valore iniziale. Se inizializzi con una stringa, avrai uno state di tipo string.

Il problema tipico nasce quando inizializzi con un array vuoto:

```ts
const [guessedLetters, setGuessedLetters] = useState([])
```

Un array vuoto non dà abbastanza informazioni, e rischi un `any[]` (o un tipo troppo largo). Qui conviene usare i **generics** di `useState`.

### Esempio: stringa
```ts
const [currentWord, setCurrentWord] = useState<string>(() => getRandomWord())
```

### Esempio: array di stringhe
```ts
const [guessedLetters, setGuessedLetters] = useState<string[]>([])
```

Questa singola scelta impedisce un’intera classe di bug: nessuno potrà più fare `setGuessedLetters([1, 2, 3])` senza che TypeScript lo blocchi.

---

## Props tipizzate: inline, type, import e riuso
Quando inizi a spezzare l’interfaccia in componenti, la tipizzazione delle props diventa la parte più “pagante”.

### Props inline (ok per componenti piccoli)
```tsx
function Keyboard(props: { onGuess: (letter: string) => void }) {
  // ...
}
```

### Props con type dedicato (preferibile)
```ts
type KeyboardProps = {
  onGuess: (letter: string) => void
}
```

```tsx
function Keyboard({ onGuess }: KeyboardProps) {
  // ...
}
```

### Importare tipi da altri file
Se hai già un type come `Language` in `languages.ts`, puoi riutilizzarlo come prop type in un componente “Badge” o “Status”:

```ts
import type { Language } from "./languages"

type LanguageBadgeProps = {
  language: Language
}
```

Questo approccio evita duplicazioni e mantiene la coerenza quando la struttura dati evolve.

---

## Il pattern più comune: tipizzare le function props
In React passiamo funzioni continuamente: handler di click, callback di submit, setter “incapsulati”. La regola pratica è semplice:

- **tipizza i parametri in ingresso**,
- **tipizza il return** (spesso `void`).

```ts
type GuessHandler = (letter: string) => void

type KeyboardProps = {
  onGuess: GuessHandler
}
```

Se domani `onGuess` dovrà accettare anche un contesto (es. la posizione o la sorgente dell’input), TypeScript ti guiderà nel refactor perché ogni punto d’uso verrà aggiornato in modo forzato.

---

## In sintesi: metti i tipi dove riducono davvero l’entropia
TypeScript in React non è un esercizio di burocrazia: è un modo per costruire componenti e funzioni con **contratti espliciti**.

Le priorità che danno più ritorno sono:

1. **State**: usa i generics di `useState` quando l’inferenza è ambigua (es. array vuoti).
2. **Dati e modelli**: preferisci type dedicati per array di oggetti riusabili.
3. **Utility**: tipi su parametri e return (e refactor delle parti ripetute).
4. **Props e callback**: tipizza bene le function props, perché sono la spina dorsale della comunicazione tra componenti.

Con questi pochi punti fermi, il codice diventa più robusto, il refactor più sicuro e l’editor smette di “indovinare” cosa intendevi.
