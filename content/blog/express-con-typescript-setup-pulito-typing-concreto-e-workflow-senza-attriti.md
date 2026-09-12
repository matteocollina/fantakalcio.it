---
title: "Express con TypeScript: setup pulito, typing concreto e workflow senza attriti"
subtitle: "Dalla configurazione del progetto al primo endpoint tipizzato, con build e start script pronti per crescere."
description: "Integrare TypeScript in un server Express non è solo “aggiungere tipi”: significa rendere più prevedibili request/response, ridurre bug banali e preparare il codice a scalare con una struttura più solida. In questo articolo vediamo un setup essenziale (ma serio) per Node + Express + TypeScript, come organizzare src/dist, come far partire il server compilando in modo consistente e come tipizzare i primi dati e handler senza complicarsi la vita."
publishedAt: 2026-07-24
tags: ["express-typescript","tsconfig-node","tipi-request-response","npm-scripts-node","api-rest-node"]
---
TypeScript e Express stanno bene insieme per un motivo semplice: Express ti fa andare veloce, TypeScript ti evita di pagare quella velocità in bug stupidi e refactor dolorosi. Se l’obiettivo è costruire API manutenibili (anche piccole), vale la pena impostare da subito una base pulita.

Qui sotto trovi un percorso pratico: setup del progetto, `tsconfig`, primo server, compilazione e un workflow tramite script npm. Il risultato è una mini-API pronta a crescere in rotte, controller e middleware tipizzati.

---

## 1) Dipendenze: Express “runtime”, TypeScript “dev-time”

Parti come un normale progetto Node:

```bash
npm init -y
```

Installa Express come dipendenza *runtime*:

```bash
npm install express
```

Poi aggiungi TypeScript e i tipi di Express come *devDependencies* (Express è JavaScript puro: senza `@types` TypeScript non conosce `Request`, `Response`, ecc.):

```bash
npm install -D typescript @types/express
```

### Un `tsconfig` sensato senza reinventare la ruota
Scrivere un `tsconfig.json` “perfetto” a mano è una perdita di tempo. Molto meglio estendere una base già collaudata per la tua versione di Node.

Ad esempio, per Node 20:

```bash
npm install -D @tsconfig/node20
```

Crea `tsconfig.json` e imposta estensione + due directory chiave:

```json
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "rootDir": "source",
    "outDir": "dist"
  }
}
```

- **`rootDir`**: dove vivi con i file TypeScript (qui: `source/`).
- **`outDir`**: dove finiscono i JavaScript compilati (qui: `dist/`).

Questo pattern è semplice ma importantissimo: separa *sorgente* e *build output*, evitando confusione e import strani.

---

## 2) Struttura minima del progetto

Crea la cartella e l’entry point:

```
source/
  index.ts
tsconfig.json
package.json
```

Dentro `source/index.ts`, lo scheletro base di Express:

```ts
import express from "express";

const app = express();
const port = 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
```

### Un pizzico di typing (senza forzature)
Molto è già inferito da TypeScript, ma esercitarsi a *pensare per tipi* aiuta. Puoi tipizzare esplicitamente l’app e il return type della callback:

```ts
import express, { type Express } from "express";

const app: Express = express();
const port = 8000;

app.listen(port, (): void => {
  console.log(`listening on port ${port}`);
});
```

Non è obbligatorio. È allenamento: quando arriverai a tipizzare middleware, handler, query param e payload, questa disciplina torna utilissima.

---

## 3) Compilare e avviare: Node non esegue TypeScript

Node non capisce `.ts` nativamente: devi compilare.

Compila con il compiler TypeScript:

```bash
npx tsc
```

Otterrai il build in `dist/` (ad esempio `dist/index.js`). Poi avvii:

```bash
node dist/index.js
```

A questo punto il server gira, ma se non hai rotte otterrai un classico 404 su `/`.

---

## 4) Prima rotta: risposta JSON

Aggiungi una rotta `GET /` che risponde con un JSON (anche vuoto, giusto per testare la pipeline):

```ts
app.get("/", (req, res) => {
  res.json({});
});
```

Poi:

```bash
npx tsc
node dist/index.js
```

---

## 5) Modellare dati reali: tipizzare un “pet” (o qualsiasi dominio)

Restituire `{}` serve solo per verificare che tutto funzioni. Il passo successivo è introdurre un piccolo modello dati e tipizzarlo.

Esempio con un tipo `Pet`:

```ts
type Pet = {
  name: string;
  species: string;
  adopted: boolean;
  age: number;
};

const pets: Pet[] = [
  { name: "Rubik", species: "cat", adopted: true, age: 3 },
  { name: "Pickle", species: "dog", adopted: false, age: 5 }
];

app.get("/", (req, res) => {
  res.json(pets);
});
```

Qui TypeScript ti protegge da:
- proprietà mancanti o con tipo sbagliato (`age: "3"` → errore),
- dati incoerenti tra i vari oggetti,
- refactor fragili quando cambi il modello.

---

## 6) Workflow migliore: script npm per build + run

Digitare ogni volta `npx tsc` e poi `node dist/index.js` diventa rapidamente noioso. Gli script npm sistemano la routine e la rendono standard.

In `package.json`:

```json
{
  "scripts": {
    "build": "npx tsc",
    "start": "npx tsc && node dist/index.js"
  }
}
```

Ora puoi fare:

```bash
npm run start
```

- prima compila
- poi avvia l’output compilato

È una base semplice, ma già “production-shaped”: separa compilation e runtime, ed evita di eseguire TypeScript direttamente in ambienti dove non vuoi dipendenze extra.

---

## Sintesi e implicazione pratica

Un setup Express + TypeScript ben fatto non richiede un framework aggiuntivo: bastano dipendenze corrette, un `tsconfig` sensato e una convenzione chiara (`source/` → `dist/`). Da lì, ogni miglioramento (rotte tipizzate, controller, middleware, validazione input, gestione errori) poggia su fondamenta solide.

Se oggi stai iniziando un’API Express, il consiglio pratico è: imposta subito `rootDir/outDir`, aggiungi `@types/express`, crea gli script `build`/`start` e inizia a modellare il dominio con tipi espliciti. Il tempo risparmiato in debug e refactor ripaga molto più di quanto costi la configurazione iniziale.
