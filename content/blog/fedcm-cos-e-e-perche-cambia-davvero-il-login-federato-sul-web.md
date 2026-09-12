---
title: "FedCM: cos’è e perché cambia (davvero) il login federato sul web"
subtitle: "Un’API che mette il browser al centro dell’identità: più controllo per l’utente, flussi più coerenti per i siti, meno esposizione di dati tra parti."
description: "FedCM (Federated Credential Management) è un approccio “browser-mediated” al login federato: il browser diventa il mediatore fidato tra utente, sito (relying party) e identity provider. In questo articolo vediamo cosa significa in pratica, perché è diversa da OAuth/SAML, e cosa serve per abilitarla lato IdP (file well-known ed endpoint dedicati)."
publishedAt: 2026-06-17
tags: ["fedcm","identity-provider","login-federato","privacy-browser","oauth-saml"]
---
## Il problema: l’identità federata è utile, ma fragile sul piano della privacy
Il login federato ("Accedi con …") ha reso l’accesso ai servizi più rapido e ha ridotto la proliferazione di password. Ma i flussi tradizionali spesso implicano che il sito e l’Identity Provider (IdP) coordinino direttamente molti passaggi: redirect, cookie, finestre pop-up, scambi di token e segnali che possono rivelare più del necessario su chi sta accedendo, dove e quando.

Negli ultimi anni, in parallelo all’inasprimento delle regole su cookie e tracciamento cross-site, è diventato evidente che serve un meccanismo più robusto e coerente, che riduca l’esposizione di informazioni tra le parti senza sacrificare l’esperienza utente.

## Cos’è FedCM (Federated Credential Management)
**FedCM** è un’API che gestisce l’identità federata con un approccio *browser-mediated*: in pratica **è il browser a orchestrare il flusso** tra:

- **Utente**
- **Relying Party (RP)**: il sito/app che richiede l’accesso
- **Identity Provider (IdP)**: il provider che autentica l’utente

La differenza sostanziale è che **il browser diventa un mediatore fidato**, invece di lasciare tutto alle integrazioni “ad-hoc” tra RP e IdP.

### L’innovazione chiave: “mettere il browser in mezzo”
Quando il browser ha un ruolo attivo:

- può presentare un’esperienza di consenso più uniforme e comprensibile;
- può limitare la quantità di informazioni condivise tra RP e IdP a ciò che è strettamente necessario;
- può rendere i flussi meno dipendenti da meccanismi storicamente vulnerabili a policy e cambiamenti (ad esempio comportamenti dei cookie tra contesti diversi).

In altre parole: FedCM prova a rendere l’identità federata **più conveniente** e **più privata** per l’utente.

## FedCM non sostituisce OAuth o SAML: lavora su un altro livello
Un punto importante per chi sviluppa: **FedCM è “protocol-agnostic”**.

Significa che:

- non impone un protocollo specifico;
- **non è un rimpiazzo diretto** di standard come **OAuth** o **SAML**;
- opera “a un livello diverso”: stabilisce *come* il browser media e presenta il flusso, mentre OAuth/SAML definiscono *come* rappresentare e trasportare autorizzazioni/asserzioni.

Questo è un cambio di prospettiva utile: FedCM non ti chiede necessariamente di buttare via ciò che usi già, ma di incapsulare l’esperienza federata in un modello più controllato dal browser.

## Cosa serve per supportare FedCM lato Identity Provider
Dal punto di vista implementativo, per rendere un IdP compatibile con FedCM serve esporre:

1. **Un file “well-known”**
2. **Un set di endpoint specifici** richiesti dall’API

Questi elementi permettono al browser di “scoprire” in modo standardizzato come parlare con l’IdP e quali risorse utilizzare durante il flusso.

> Nota pratica: la presenza del well-known e degli endpoint non è un dettaglio burocratico, è ciò che rende possibile spostare l’orchestrazione nel browser senza accordi custom tra singoli siti e provider.

Per partire con i dettagli tecnici e una guida di implementazione, la documentazione ufficiale è indicata qui: https://goo.gl/fedcm

## Implicazioni per chi sviluppa frontend
FedCM introduce un concetto che vale la pena internalizzare: **il login federato non è solo un “pezzo di auth”**, è un’interazione delicata tra più soggetti con interessi diversi. Rendere il browser il coordinatore consente di:

- **ridurre superficie di tracciamento** e scambi impliciti;
- **standardizzare UX e permessi** a beneficio dell’utente;
- **rendere i flussi più resilienti** all’evoluzione delle policy di privacy del web.

## Sintesi
FedCM è un passo verso un web in cui l’identità federata rimane comoda, ma con **maggiori garanzie di privacy** e un flusso più pulito: il browser smette di essere un semplice contenitore di redirect e diventa **il mediatore esplicito** tra utente, sito e provider.

Se stai progettando un login “Accedi con …” oggi, vale la pena considerare FedCM non come una moda, ma come una direzione architetturale: spostare la fiducia e la coordinazione nel browser è una scelta che rende l’autenticazione più sostenibile nel tempo.
