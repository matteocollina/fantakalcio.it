---
title: "Hashing vs Encryption: la differenza che fa davvero la sicurezza"
subtitle: "Due concetti spesso confusi: uno è reversibile con una chiave, l’altro è una trasformazione a senso unico."
description: "Capire la differenza tra hashing ed encryption è fondamentale per usare correttamente password, token e dati sensibili. Vediamo cosa cambia, perché l’hash non si “decripta”, perché la cifratura può produrre output diversi a parità di input e quali sono gli scenari d’uso corretti (HTTPS, storage password, ecc.)."
publishedAt: 2026-06-18
tags: ["hashing-password","crittografia-simmetrica","sicurezza-backend","https-tls","gestione-chiavi"]
---
Capire la differenza tra **hashing** e **cifratura (encryption)** è una delle basi pratiche più importanti quando si parla di sicurezza applicativa. Sono due strumenti diversi, pensati per scopi diversi, e confonderli porta quasi sempre a errori di design: password “criptate” nel database, token gestiti male, dati sensibili trattati come se fossero irreversibili.

## Encryption (cifratura): trasformazione reversibile con una chiave
La cifratura serve quando devi **rendere un dato illeggibile a chi non possiede una chiave**, ma **leggibile (decifrabile) a chi quella chiave ce l’ha**.

- **Input**: un testo/dato in chiaro (plaintext)
- **Output**: testo cifrato (ciphertext), apparentemente “casuale”
- **Proprietà fondamentale**: è **a due vie**
  - con la **stessa chiave corretta** puoi tornare al dato originale (decrypt)

Un dettaglio che sorprende molti: spesso, **cifrando lo stesso dato più volte** ottieni **risultati diversi**. Non è un bug: in molti schemi moderni si usano valori casuali (es. *nonce* o *IV*) per rendere la cifratura più robusta, evitando che due messaggi identici producano lo stesso ciphertext.

### Quando usare la cifratura
- **Trasporto sicuro dei dati**: ad esempio **HTTPS/TLS** cifra i dati in transito, così intercettarli non basta per leggerli.
- **Protezione di dati che dovranno essere recuperati**: documenti, segreti applicativi, informazioni personali che devono poter essere mostrate di nuovo all’utente.

## Hashing: impronta digitale a senso unico
L’hashing è una trasformazione pensata per ottenere una “impronta” del dato.

- **Input**: una stringa o un dato
- **Output**: un hash (una stringa di lunghezza fissa, a seconda dell’algoritmo)
- **Proprietà fondamentale**: è **a una via**
  - **non puoi** (in modo pratico) risalire dall’hash al valore originale

Un’altra proprietà chiave: **a parità di input, l’hash è sempre lo stesso**. Se calcoli l’hash di `password` oggi e domani, ottieni lo stesso risultato (stesso algoritmo, stessi parametri).

> Nota importante: “a una via” non significa “magico”. Se un attaccante prova tantissime password candidate e ne calcola l’hash, può trovare quella che combacia (attacco a dizionario/brute force). Per questo, nella pratica, le password vanno gestite con algoritmi specifici e tecniche come il *salt* e parametri di costo.

### Quando usare l’hashing
- **Password**: non vuoi poter “decifrare” la password. Vuoi solo verificare se quella inserita dall’utente, una volta hashata, **corrisponde** a quella salvata.

## In due righe: cosa cambia davvero
- **Encryption**: reversibile → *“posso recuperare il dato”* (serve una chiave)
- **Hashing**: irreversibile → *“posso solo verificare che due valori coincidano”*

## Implicazione pratica per chi sviluppa
Se il tuo caso d’uso richiede di **leggere nuovamente** il dato in chiaro (o permettere a qualcun altro di leggerlo), allora ti serve **cifratura + gestione corretta delle chiavi**. Se invece ti serve solo **confrontare** un valore senza poterlo ricostruire (tipicamente le password), allora serve **hashing**.

Scegliere l’operazione giusta è una decisione architetturale: non è solo terminologia, è la differenza tra un sistema robusto e uno che espone dati sensibili per design.
