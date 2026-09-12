---
title: "FedCM: la nuova frontiera del login federato mediato dal browser"
subtitle: "Un’API pensata per sostituire pattern fragili (redirect, iframe, cookie di terze parti) con un flusso più consistente, controllabile e orientato alla privacy."
description: "FedCM (Federated Credential Management) è un’API del browser per gestire l’identità federata mettendo l’user agent al centro del consenso e dell’esperienza utente. In questo articolo vediamo cos’è, come funziona (modalità active e passive), perché è rilevante nell’era post third‑party cookie e quali componenti servono per integrarla lato Identity Provider e lato Relying Party."
publishedAt: 2026-06-15
tags: ["fedcm","login-federato","identity-provider","privacy-web","third-party-cookie","oauth-sso"]
---
## Cos’è FedCM (e perché se ne parla ora)

La **Federated Credential Management API (FedCM)** è un’API del browser progettata per gestire i flussi di **identità federata**: l’utente accede a un sito (il *relying party*, RP) usando un account gestito da un altro dominio (l’*identity provider*, IdP). È lo scenario classico dei pulsanti “Accedi con …”.

La novità non è l’SSO in sé, ma *chi* orchestra il flusso: con FedCM **il browser diventa un mediatore fidato** tra utente, RP e IdP. Questo sposta il baricentro da meccanismi storicamente “di pagina” (iframe, redirect, pop-up non standard, cookie di terze parti) a un’interazione più **consistente, esplicita e controllata**.

Un punto importante: FedCM è **protocol-agnostica**. Non sostituisce OAuth o SAML, ma opera su un livello diverso, concentrandosi su **UX, consenso e scambio dati** mediato dal browser.

---

## I concetti chiave: RP, IdP e browser come arbitro

In un flusso federato tradizionale, il sito che integra l’accesso deve spesso affidarsi a:

- redirect top-level verso l’IdP e ritorno;
- iframe per “scoprire” lo stato di login;
- cookie di terze parti o tecniche equivalenti per mantenere sessioni e contesto.

FedCM cambia la dinamica:

1. **Il browser presenta un’interfaccia di scelta/consenso** (un dialog controllato dall’user agent).
2. **La condivisione delle informazioni avviene solo dopo un’azione esplicita dell’utente** (o in modalità “passive” in presenza di sessione IdP, come vedremo).
3. Il flusso è progettato per funzionare **anche senza cookie di terze parti** e per essere più robusto rispetto alle mitigazioni anti-tracking basate su “bounce”.

---

## Come appare il flusso all’utente: due modalità UX

FedCM supporta due modalità di esperienza utente che cambiano soprattutto *quando* può apparire il dialog del browser.

### 1) Modalità **active**

- Richiede un **gesto dell’utente** (tipicamente un click su “Sign in with …”).
- Dopo l’interazione, il browser mostra il **dialog FedCM** anche se l’utente **non** è già autenticato presso l’IdP.

Scenario tipico:

- L’utente visita `pharmacy.example` (RP) che supporta l’accesso tramite `healthprovider.example` (IdP).
- Se l’utente è già loggato sull’IdP, al click il browser mostra un dialog che:
  - propone l’account disponibile;
  - indica quali informazioni verranno condivise;
  - consente di procedere o annullare.
- Se l’utente **non** ha una sessione IdP attiva, può aprirsi una finestra di login dell’IdP (in base all’endpoint di login definito dall’IdP) che, una volta completato l’accesso, si chiude e riporta l’utente al contesto del RP con il dialog pronto a completare la procedura.

Il punto centrale: si evita di “trascinare” l’utente in navigazioni a catena; l’esperienza rimane **ancorata alla pagina** dove l’utente stava agendo.

### 2) Modalità **passive**

- Non richiede un gesto immediato per far apparire il dialog.
- Però, per essere davvero “one-tap”, presuppone che l’utente sia **già autenticato** presso l’IdP.

Quando l’utente arriva sul RP e questo invoca FedCM, il browser può proporre il dialog automaticamente. Se l’utente ha già un account sul RP, il dialog indirizza al **sign-in**; altrimenti può guidare al **sign-up**.

---

## Perché FedCM è rilevante: privacy, UX e resilienza

### Benefici per l’utente

- **Trasparenza**: è il browser a mostrare cosa sta succedendo e quali dati vengono condivisi.
- **Controllo**: lo scambio avviene dopo una scelta esplicita.
- **Coerenza**: un pattern di login uniforme tra siti riduce attriti e sorprese.

### Benefici per il relying party (chi integra il login)

- Meno necessità di UI affollate con decine di pulsanti: il browser può mostrare **solo account e IdP rilevanti** per l’utente.
- Flussi più fluidi spesso si traducono in **tassi di accesso migliori** rispetto a implementazioni federate più “tradizionali”.
- Funziona **senza cookie di terze parti**, quindi è più futuro‑compatibile.

### Benefici per l’identity provider

- Copertura maggiore: gli utenti che hanno bloccato i cookie di terze parti non vengono automaticamente esclusi.
- Minore dipendenza da tecniche come la **link decoration** (parametri aggiunti in URL) e quindi maggiore resilienza verso mitigazioni anti-tracking.

### Una nota sulla “delegation model”

FedCM sta evolvendo anche sul fronte privacy con un approccio di **delegazione** che mira a ridurre la visibilità dell’IdP su *dove* l’utente stia accedendo (cioè su quale RP). È un cambio di paradigma interessante: meno correlazione tra siti, più protezione contro forme di tracciamento implicito.

---

## Cosa serve per implementarlo: i pezzi principali

FedCM coinvolge due attori tecnici:

- **Identity Provider (IdP)**: deve esporre una serie di risorse ed endpoint.
- **Relying Party (RP)**: invoca l’API FedCM e gestisce il risultato lato applicazione.

### Lato Identity Provider: file “well-known” e endpoint

Per abilitare FedCM, l’IdP deve pubblicare:

1. Un file **well-known**: una “mappa” che indica al browser dove trovare configurazione ed endpoint richiesti.
2. Endpoint principali, tra cui:
   - **accounts endpoint**: elenca gli account disponibili per l’utente.
   - **ID assertion endpoint**: verifica l’utente ed emette un token/asserzione sicura per completare il login sul RP.
   - **login endpoint**: gestisce l’autenticazione quando non esiste una sessione attiva sull’IdP.
   - **client metadata endpoint**: fornisce elementi di branding e informazioni utili all’interfaccia del browser (ad esempio logo del RP, privacy policy, ecc.).

### Lato Relying Party: chiamata FedCM e gestione token

Il RP effettua la chiamata all’API FedCM e, una volta ottenuta l’asserzione/token dall’IdP, completa l’autenticazione nella propria applicazione (tipicamente scambiando o validando il token sul backend).

### SDK dell’IdP: un dettaglio pratico che conta

Dal punto di vista operativo, è spesso consigliabile che l’IdP distribuisca un **SDK**. In questo modo i siti che si affidano a quell’IdP incorporano una dipendenza gestibile centralmente: aggiornamenti e adeguamenti alle evoluzioni dell’API diventano più lineari e riducono il rischio di rotture “a macchia di leopardo” sui vari RP.

---

## Implicazioni pratiche per chi fa frontend

FedCM va letto come un passo concreto verso flussi di autenticazione federata:

- meno fragili rispetto a vincoli di tracking prevention;
- più chiari dal punto di vista del consenso;
- più consistenti nell’interazione.

Se oggi stai integrando “Sign in with …” con pattern basati su redirect, iframe o segnali impliciti di sessione, FedCM è una direzione da monitorare attentamente: non solo per adeguarti a un web sempre più “cookie-less”, ma perché sposta l’esperienza di login su un terreno più standardizzato e comprensibile.

---

## Sintesi

FedCM introduce un modello in cui il **browser media** l’accesso federato: presenta un dialog di consenso, coordina la scelta dell’account e riduce la dipendenza da meccanismi storici poco robusti. Con le modalità **active** e **passive** copre sia flussi guidati da interazione sia esperienze “one‑tap” quando l’utente è già autenticato.

Per i team frontend e identity, la conseguenza pratica è chiara: progettare l’autenticazione federata pensando a UX coerente e privacy-by-design non è più un “nice to have”, ma un requisito che l’ecosistema sta rendendo inevitabile.
