---
title: "Autenticazione moderna senza impazzire: email/password, OAuth, passkey e Stripe con una configurazione unica"
subtitle: "Quando “aggiungere login” diventa dieci micro-sistemi: un approccio più pulito con Better Auth, plugin e integrazione database."
description: "Un login form è la parte facile. Il resto è fatto di sessioni, callback OAuth, tabelle utenti, migrazioni, linking account, passkey e — nelle app a pagamento — sincronizzazione con Stripe. In questo articolo vediamo come impostare un flusso di autenticazione completo in modo ordinato: una configurazione centrale, un endpoint API “catch-all”, un client frontend e plugin per OAuth, passkey, “last login method” e abbonamenti Stripe, con persistenza su Postgres/Drizzle."
publishedAt: 2026-08-07
tags: ["better-auth","passkey","oauth-google-github","drizzle-postgres","stripe-subscriptions","sessioni-cookie"]
---
## Il problema reale: l’auth non è una feature, è un ecosistema
Aggiungere un form di login è semplice. Il punto è che, appena l’app cresce, “auth” smette di essere una singola funzionalità e diventa un insieme di sottosistemi:

- **Sessioni e cookie** (scadenze, rotazione, sicurezza)
- **Redirect e callback OAuth** (Google, GitHub, ecc.)
- **Tabelle utenti / account / sessioni** e relative **migrazioni**
- **Account linking** (lo stesso utente che entra con metodi diversi)
- **Passwordless / passkey** (WebAuthn, device, challenge, verifiche)
- UI che **non confonda** chi torna dopo settimane (“Con cosa avevo fatto login?”)
- Per SaaS: **Stripe customer**, **subscription lifecycle**, **webhook verificati**

Il rischio, quando si “cuce tutto a mano”, è creare dieci mini-progetti che devono rimanere coerenti tra loro.

Una strategia più pulita è trattare l’autenticazione come un modulo unico, con:
1) una **configurazione centrale**, 2) un **endpoint backend standard**, 3) un **client frontend** e 4) **plugin** per le estensioni.

---

## Un’architettura ordinata: config unica + endpoint catch-all + client
L’impostazione che funziona bene (soprattutto su stack TypeScript/React/Next) separa chiaramente tre pezzi.

### 1) Configurazione centrale (`auth.ts`)
Il “cuore” vive in un file unico: provider abilitati, plugin, database, opzioni di sicurezza.

Vantaggi pratici:
- niente configurazioni sparse in file diversi
- manutenzione più semplice
- chi entra nel progetto capisce subito “come gira” l’auth

Esempi di cosa ci finisce dentro:
- email/password (abilitazione e policy)
- provider social (Google/GitHub…)
- integrazione database (Drizzle/Prisma…)
- plugin (Stripe, passkey, last login method, 2FA…)

### 2) Endpoint API “catch-all”
Il browser ha bisogno di un endpoint unico a cui parlare per l’intero flusso auth.

In una app Next è comune creare una route tipo:

- `app/api/auth/[...all]/route.ts`

che esporta gli handler `GET` e `POST` dell’adapter. Il risultato è un backend minimalista: non devi riscrivere ogni singolo endpoint per login, callback, refresh session, ecc.

### 3) Client frontend (`auth-client.ts`)
Sul lato UI crei un client che chiama in modo consistente le API di auth.

Poi nelle pagine/componenti usi metodi ad alto livello:
- **signup** con email/password
- **signin** con email/password
- **signin** con provider social
- **signin** con passkey
- gestione subscription (upgrade, redirect, ecc.)

---

## Email e password: l’essenziale, fatto bene
Con un client ben disegnato, le chiamate tipiche restano leggibili.

- **Registrazione**: `signUp.email({ name, email, password })`
- **Login**: `signIn.email({ email, password })`

Nota importante: la libreria può gestire gran parte della parte “noiosa ma critica” (cookie, sessioni, hardening di base), ma **l’esperienza utente** resta responsabilità dell’app:
- messaggi d’errore chiari
- loading state
- gestione “utente già esistente”
- policy password e reset (se previsto)

---

## OAuth (Google, GitHub) senza incollare mille pezzi
Lato config aggiungi i provider social indicando:
- `clientId`
- `clientSecret`

Questi arrivano dai rispettivi pannelli (Google Cloud Console, GitHub Developer Settings). Rimangono comunque da gestire correttamente:
- variabili d’ambiente
- callback URL
- ambienti (dev/staging/prod)

Sul frontend, il flusso diventa una singola chiamata con redirect:
- `signIn.social({ provider, callbackURL })`

Il guadagno non è “meno OAuth” (i concetti restano), ma **meno superfici da implementare male**: callback, scambio token, creazione/collegamento account, ecc.

---

## Persistenza: Postgres + Drizzle (e migrazioni senza sorprese)
Un’auth completa ha bisogno di tabelle coerenti (utenti, sessioni, account OAuth, passkey…).

Better Auth supporta più database e ORM; una combinazione comune è:
- **Postgres**
- **Drizzle ORM**

Passi tipici:
1. installare l’adapter Drizzle
2. configurare il database nella config auth (istanza + provider)
3. passare lo **schema** (tabelle richieste)
4. generare schema/migrazioni via CLI
5. applicare le migrazioni con Drizzle Kit

Alla fine ti ritrovi un DB con tabelle come:
- `users`
- `sessions`
- `accounts` (per collegare metodi diversi allo stesso utente)
- entità per verifiche, passkey, ecc.

Questo è cruciale: l’auth non è solo “autenticare”, ma **tracciare in modo affidabile lo stato** nel tempo.

---

## SaaS: far combaciare autenticazione e billing con Stripe
Nelle app a pagamento il punto non è solo “chi è loggato”, ma **chi è il customer su Stripe** e che piano ha.

Con un plugin Stripe ben integrato puoi ottenere:
- creazione automatica del **customer** alla signup
- gestione piani e pricing
- lifecycle subscription (creazione, update, cancellazione)
- webhooks con **verifica firma** (parte fondamentale per la sicurezza)

Lato config:
- inizializzi un client Stripe con la **secret key**
- aggiungi il plugin con webhook secret e opzioni (es. create customer on signup)
- colleghi i priceId dei piani (es. “pro”)

Lato frontend, l’upgrade può diventare una singola chiamata:
- `subscription.upgrade({ plan, successURL, cancelURL })`

Risultato: quando l’utente completa il checkout, la subscription si riflette nel suo profilo autenticato **senza dover orchestrare manualmente** customer mapping, webhook handler e aggiornamenti DB.

---

## Due dettagli UX che fanno la differenza: passkey e “last used login method”
### 1) Mostrare l’ultimo metodo usato
È un’accortezza piccola ma enorme: chi torna dopo giorni spesso non ricorda se aveva usato Google, GitHub o email.

Con un plugin dedicato puoi:
- salvare la preferenza in DB (`storeInDatabase: true`)
- leggere da UI l’ultimo metodo e **orientare l’utente** (es. evidenziare “Continua con Google”)

### 2) Passkey (WebAuthn) come first-class citizen
Implementare passkey da zero è delicato: challenge, verifiche, device binding, edge case. Un plugin riduce drasticamente complessità e rischio.

Tipicamente ti servono:
- plugin passkey in config (con identifier, nome, authenticator selection)
- supporto client
- chiamate UI essenziali:
  - registrazione: `passkey.addPasskey({ name })`
  - login: `signIn.passkey({ callbackURL })`

Il vantaggio reale è offrire un login **rapido e sicuro** (Touch ID/Face ID/Windows Hello/Password manager) senza trasformare l’implementazione in un progetto a parte.

---

## In sintesi: meno colla, più sistema
Un’autenticazione moderna non è solo login/logout: è coerenza tra sessioni, provider, database, UX e (spesso) billing. Un approccio basato su:

- **configurazione centralizzata**
- **endpoint backend unico**
- **client frontend dedicato**
- **plugin** per estendere (OAuth, passkey, last login, Stripe)

riduce il numero di punti fragili e rende l’auth una parte mantenibile del prodotto.

L’implicazione pratica è semplice: invece di inseguire bug e incongruenze tra strumenti diversi, puoi investire tempo dove conta davvero—**esperienza utente**, flussi chiari e regole di business—sapendo che la base (sessioni, provider, persistenza e integrazioni) resta solida e uniforme.
