---
title: "Zustand in React: stato globale semplice, selettori e performance (senza impazzire con Context)"
subtitle: "Dallo store “hook-based” ai selector: come evitare rerender inutili, organizzare le azioni e usare lo stato anche fuori dai componenti."
description: "Zustand è una libreria di state management minimalista ma sorprendentemente potente. In questo articolo vediamo come passare da un approccio basato su React Context a uno store Zustand, perché migliora le performance (se usato nel modo giusto) e quali pattern conviene adottare per azioni e selettori, inclusa la shallow comparison per evitare rerender indesiderati."
publishedAt: 2026-04-21
tags: ["zustand","react-context","selettori","performance-react","state-management"]
---
## Perché guardare oltre React Context

React Context è una soluzione comoda per condividere stato “globale” (o quasi) senza prop-drilling. Il problema emerge quando lo usi come *state management general-purpose*:

- **Ogni cambiamento nel context può innescare rerender** di *tutti* i componenti che lo consumano, anche se usano solo una piccola parte dei dati.
- **La scalabilità peggiora**: più lo stato cresce (e più punti lo consumano), più diventa difficile mantenere performance e chiarezza.

Un caso tipico: un contatore con un componente che visualizza `count` e un altro con i controlli `increment/decrement/reset`. Se entrambi consumano lo stesso context, al cambio di `count` possono rerenderare *entrambi*… anche se i controlli non dipendono da `count`.

Zustand risolve questo scenario in modo molto pragmatico: uno store esterno a React con un’API semplice, e un hook che ti permette di sottoscrivere solo ciò che ti serve.

---

## Creare uno store Zustand: la base

Installa la libreria:

```bash
npm i zustand
```

Crea uno store, ad esempio `useCounterStore.ts`:

```ts
import { create } from "zustand"

type CounterState = {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

Osservazioni importanti:

- `create` restituisce **un hook** (`useCounterStore`) che userai nei componenti.
- `set` funziona come `setState` in React: può ricevere un oggetto o una funzione.
- Quando fai `set({ count: 0 })`, Zustand **mergia** lo stato: non devi fare `...state` manualmente.

---

## Il punto chiave: i selector (o perdi i vantaggi)

Se nei componenti fai:

```ts
const store = useCounterStore()
```

stai sottoscrivendo **l’intero store**. Risultato: se cambia una qualsiasi parte, il componente rerenderizza.

La pratica corretta è usare un *selector*:

### Display: sottoscrivi solo `count`

```tsx
const count = useCounterStore((state) => state.count)
```

### Controls: sottoscrivi solo le funzioni che ti servono

```tsx
const increment = useCounterStore((state) => state.increment)
const decrement = useCounterStore((state) => state.decrement)
const reset = useCounterStore((state) => state.reset)
```

Così:

- Il display rerenderizza quando cambia `count`.
- I controlli **non** rerenderizzano quando cambia `count` (le funzioni non cambiano reference di solito).

Questo è uno dei motivi principali per cui Zustand è spesso più efficiente di un Context “onnicomprensivo”.

---

## Se vuoi selezionare più cose insieme: attenzione all’oggetto

Potresti voler scrivere:

```tsx
const { increment, decrement, reset } = useCounterStore((state) => ({
  increment: state.increment,
  decrement: state.decrement,
  reset: state.reset,
}))
```

Sembra pulito, ma qui c’è un dettaglio: **stai creando un nuovo oggetto ad ogni esecuzione del selector**. Se il confronto viene fatto sulla reference, il componente può rerenderizzare più del necessario.

### Soluzione: `useShallow`

Zustand mette a disposizione un helper per fare **shallow comparison**:

```ts
import { useShallow } from "zustand/shallow"

const { increment, decrement, reset } = useCounterStore(
  useShallow((state) => ({
    increment: state.increment,
    decrement: state.decrement,
    reset: state.reset,
  }))
)
```

Con la shallow comparison, invece di confrontare l’oggetto “in blocco”, vengono confrontate le singole proprietà: se le funzioni sono le stesse, niente rerender.

---

## Accesso allo stato fuori dai componenti React

Una differenza enorme rispetto a Context: lo store Zustand vive fuori da React. Quindi puoi leggerlo o aggiornarlo anche in funzioni “normali”, senza dover passare callback tramite props o context.

Esempi:

```ts
// leggere lo stato corrente
const current = useCounterStore.getState().count

// eseguire un'azione esistente
useCounterStore.getState().increment()

// impostare stato direttamente
useCounterStore.setState({ count: 10 })
```

Questo è utilissimo per:

- listener globali (es. eventi del browser)
- integrazioni con librerie esterne
- utility che vivono fuori dall’albero React

---

## Come organizzare le azioni: due pattern comuni

### 1) Azioni dentro lo store (con namespace `actions`)

Se ti piace avere “stato + azioni” nello stesso posto, puoi raggruppare:

```ts
type CounterState = {
  count: number
  actions: {
    increment: () => void
    decrement: () => void
    reset: () => void
  }
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  actions: {
    increment: () => set((s) => ({ count: s.count + 1 })),
    decrement: () => set((s) => ({ count: s.count - 1 })),
    reset: () => set({ count: 0 }),
  },
}))
```

Nei componenti:

```tsx
const increment = useCounterStore((s) => s.actions.increment)
```

Pro: struttura chiara. Contro: lo store cresce e diventa un “contenitore di tutto”.

### 2) Store solo dati, azioni esportate a parte

Se preferisci uno store come “fonte dati” e azioni come funzioni separate:

```ts
import { create } from "zustand"

type CounterState = { count: number }

export const useCounterStore = create<CounterState>(() => ({ count: 0 }))

export const increment = () =>
  useCounterStore.setState((s) => ({ count: s.count + 1 }))

export const decrement = () =>
  useCounterStore.setState((s) => ({ count: s.count - 1 }))

export const reset = () =>
  useCounterStore.setState({ count: 0 })
```

Pro: separazione netta, funzioni riusabili ovunque. Contro: devi gestire naming/import con più disciplina.

---

## Linee guida pratiche

- **Non chiamare `useStore()` senza selector** se lo store non è microscopico.
- Se devi selezionare più valori e ritorni un oggetto, considera **`useShallow`**.
- Decidi un pattern per le azioni (dentro store vs fuori) e mantienilo coerente nel progetto.
- Per stato davvero globale e condiviso in tanti punti, Zustand tende a essere più semplice e performante di un Context usato come store.

---

## Conclusione

Zustand dà il meglio quando sfrutti la sua idea centrale: **sottoscrivere solo ciò che ti serve** tramite selector. Da lì ottieni un flusso di stato globale più pulito, componenti che rerenderizzano meno e la libertà di usare lo stato anche fuori dall’albero React.