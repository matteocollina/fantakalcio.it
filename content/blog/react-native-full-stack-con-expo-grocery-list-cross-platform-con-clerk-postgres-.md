---
title: "React Native full stack con Expo: grocery list cross‑platform con Clerk, Postgres (Neon) e NativeWind"
subtitle: "Un’architettura moderna per iOS e Android: autenticazione pronta, database in cloud, UI “tailwind-like” e basi solide per crescere in produzione."
description: "Costruire un’app mobile oggi significa mettere insieme UI, autenticazione, dati e deploy con strumenti affidabili. In questo articolo vediamo come impostare un progetto React Native con Expo e un backend moderno: Clerk per l’auth (Google/Apple/GitHub), Postgres su Neon con Drizzle ORM, styling con NativeWind e uno stato globale leggero con Zustand. Il caso d’uso è una grocery list condivisibile, con schermate di login, lista, planner e insights: un esempio perfetto per imparare i fondamentali full stack su mobile."
publishedAt: 2026-07-13
tags: ["expo","clerk-auth","neon-postgres","drizzle-orm","nativewind","zustand"]
---
## Perché React Native (e perché quasi sempre con Expo)

React Native è un framework che ti permette di sviluppare app mobile usando gli stessi concetti di React (componenti, props, state, JSX) ma targettizzando **iOS e Android** da un’unica codebase in **JavaScript o TypeScript**.

Il punto pratico è il *cross‑platform development*: invece di mantenere due progetti separati (Swift/Objective‑C per iOS e Kotlin/Java per Android), lavori in un’unica repo e rilasci su entrambi gli store.

Su React Native, però, conviene quasi sempre appoggiarsi a un framework “superiore”: **Expo**.

### Expo non è “React Native”, ma ci gira sopra

Expo è una piattaforma/framework costruita sopra React Native: tu scrivi comunque codice React Native, ma con un ecosistema più completo (tooling, runtime, ottimizzazioni e un percorso più lineare verso build e pubblicazione). Il parallelo più utile, se vieni dal web, è:

- **React** → **Next.js**
- **React Native** → **Expo**

Expo è usato anche in app molto note: è un segnale importante di maturità e stabilità, soprattutto se vuoi evitare attrito nella fase iniziale.

---

## Il progetto: una grocery list full stack con 4 schermate

Un’ottima “app palestra” per imparare il full stack mobile è una lista della spesa condivisibile (concettualmente simile a una to‑do list) con:

1. **Authentication**: login con provider social
2. **List**: elenco prodotti, spunta completati, modifica quantità, eliminazione
3. **Planner**: form per aggiungere nuovi item
4. **Insights**: profilo, logout, mini‑analytics, pulizia degli elementi completati

Questo tipo di app è abbastanza semplice da costruire, ma abbastanza reale da obbligarti a risolvere problemi concreti: navigazione, form, liste performanti, stato globale, persistenza su database, gestione utenti.

---

## Stack consigliato: Clerk + Neon Postgres + Drizzle + NativeWind

Per un progetto mobile moderno e “pulito”, lo stack che funziona molto bene è:

- **Clerk** per l’autenticazione: gestione utenti, sessioni e OAuth senza reinventare la ruota
- **Postgres** come database: solido, standard e perfetto per dati relazionali (liste, utenti, item)
- **Neon** per ospitare Postgres nel cloud: provisioning immediato e piano gratuito comodo per prototipi
- **Drizzle ORM** per parlare con Postgres: schema chiaro, query tipizzate, approccio moderno
- **NativeWind** per lo styling: una sintassi “alla Tailwind” in React Native, senza impazzire con StyleSheet
- **Zustand** per stato globale leggero: meno boilerplate rispetto a soluzioni più pesanti

L’obiettivo non è “mettere tecnologie a caso”, ma costruire una base coerente:

- auth affidabile e sicura
- database accessibile da subito
- UI rapida da iterare
- stato condiviso semplice

---

## Differenze chiave tra React (web) e React Native

Se arrivi dal web, la buona notizia è che **i concetti sono quasi identici**. Cambiano soprattutto i *primitivi* e alcuni pattern.

### 1) Componenti: da `div` a `View`, da testo libero a `Text`

Sul web scrivi:

- `div`, `h1`, `p`, `span`…

In React Native i mattoni base sono:

- `View` per i contenitori
- `Text` per *qualsiasi* testo

Una regola pratica: **non puoi mettere testo “nudo” dentro una `View`**. Il testo va sempre in un componente `Text`.

### 2) Styling: StyleSheet vs classi (con NativeWind)

React Native supporta `StyleSheet` (un oggetto JS con proprietà di stile), ma se vuoi velocità e consistenza, **NativeWind** ti consente di usare classi in stile Tailwind direttamente nei componenti.

È un vantaggio enorme quando costruisci UI iterando velocemente: meno file, meno contesto, meno attrito.

### 3) Eventi: niente mouse, quindi `onPress`

Sul web hai `onClick`, `onMouseOver`, ecc.

Su mobile usi eventi legati al tocco:

- `onPress`
- `onLongPress`
- ecc.

E al posto di `button` spesso userai componenti come **Pressable** (oggi preferibile a pattern più datati come `TouchableOpacity`).

### 4) Liste: `map` funziona, ma `FlatList` è più performante

Mappare un array va bene, ma per liste non banali React Native offre **FlatList**, pensata per performance e rendering efficiente (virtualizzazione).

### 5) Form: niente `form`, usa `TextInput` + submit su bottone

Non esiste un tag `form` come sul web. Il pattern tipico è:

- campi con `TextInput`
- bottone con `onPress` che esegue il submit

I concetti di `value`, `onChange`, placeholder e validazione rimangono familiari.

---

## Bootstrap del progetto: creare l’app Expo con TypeScript

Per partire da una base pulita:

```bash
npx create-expo-app@latest --template default@next .
```

- `--template default@next` può essere utile per agganciare le versioni più recenti del template (dipende dal periodo: verifica sempre la compatibilità del template con la tua versione di Expo).
- Il `.` finale crea l’app nella cartella corrente.

Da qui hai una struttura iniziale funzionante e puoi iniziare a montare routing, schermate e integrazioni.

---

## Setup servizi: Clerk (auth) e Neon (Postgres)

### Clerk: crea l’app e abilita i provider

Nel pannello di Clerk crei un’app e abiliti i provider (tipicamente **Google**, **GitHub**, **Apple** oltre all’email). È un passaggio che ti evita settimane di lavoro e soprattutto riduce il rischio di errori di sicurezza.

Nota pratica: alcuni piani limitano il numero di provider attivabili, ma per iniziare di solito basta.

### Neon: crea un database Postgres e copia la connection string

Con Neon crei un progetto Postgres in pochi click e recuperi la **connection string** per collegarti dal tuo backend/route layer.

---

## Environment variables: metti subito in ordine le chiavi

Crea un file `.env` nella root e inserisci almeno:

- la connection string di Neon
- la publishable key di Clerk (in Expo spesso viene usato un prefisso come `EXPO_PUBLIC_...` per rendere la variabile disponibile lato client)

Esempio (nomi indicativi):

```env
DATABASE_URL="postgresql://..."
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
```

Suggerimento pratico: separa sempre le chiavi *pubbliche* da quelle *server-only*. Anche su mobile, trattare bene le variabili d’ambiente è fondamentale per non impastare ambienti (dev/staging/prod) e per non esporre segreti.

---

## Un dettaglio che fa la differenza: UI e “effetti” platform‑friendly

Un’app cross‑platform convincente non è solo “funziona su iOS e Android”. È anche:

- componenti touch coerenti
- transizioni e spacing leggibili
- tab bar curata

Una tab bar con effetto “glass / liquid glass” (stile iOS recente) è un buon esempio di come l’attenzione ai dettagli cambi la percezione del prodotto. Il punto non è l’effetto in sé, ma la mentalità: *non accontentarti del layout base*.

---

## Sintesi: un percorso full stack mobile sensato

Un’app come una grocery list è un pretesto perfetto per imparare davvero React Native:

- **Expo** ti dà un percorso produttivo e pragmatico
- **Clerk** risolve l’auth in modo serio e scalabile
- **Neon + Postgres + Drizzle** ti portano subito su un backend reale, tipizzato e manutenibile
- **NativeWind** accelera lo sviluppo UI senza sacrificare consistenza
- **Zustand** ti aiuta a gestire stato e flussi senza boilerplate

La conseguenza pratica è semplice: con questo stack puoi passare da “demo che gira” a “app che regge utenti e dati veri” senza dover riscrivere tutto dopo due settimane. E quando la base è sana, ogni feature successiva (condivisione, analytics, pulizie di massa, feedback, ecc.) diventa un’estensione naturale, non un refactor infinito.
