---
title: "Se Google si fosse chiamato Backrub: una lezione di UX, naming e “link graph” per chi fa frontend"
subtitle: "Un nome curioso e un’idea tecnica semplice (ma potentissima): ordinare il web guardando le relazioni tra pagine, non solo le parole."
description: "Negli anni ’90 un motore di ricerca nato a Stanford aveva un nome molto diverso: Backrub. Dietro c’era un’intuizione tecnica decisiva—valutare le pagine in base ai link in ingresso—che ha influenzato non solo la ricerca, ma anche il modo in cui pensiamo l’informazione sul web. Vediamo cosa racconta questa storia a chi progetta interfacce e prodotti frontend: modelli mentali, naming, affordance e coerenza tra tecnologia e linguaggio."
publishedAt: 2026-05-14
tags: ["naming","user experience","motori di ricerca","link graph","information architecture"]
---
Negli anni ’90, mentre il web cresceva a ritmi impossibili da “navigare a mano”, due studenti di Stanford stavano sperimentando un’idea che avrebbe cambiato il modo di trovare informazioni online. Non era tanto la barra di ricerca (quella è diventata familiare dopo), quanto **il criterio con cui ordinare i risultati**.

La cosa interessante, per chi fa frontend e prodotto, è che questa storia incrocia tre temi che incontriamo ogni giorno: **modello mentale**, **naming** e **coerenza tra ciò che l’app fa e ciò che l’utente capisce**.

## Dal testo ai collegamenti: l’intuizione del “web come rete”
I primi motori di ricerca puntavano soprattutto a “scansionare parole”: indicizzavano contenuti e cercavano corrispondenze testuali. L’intuizione diversa fu questa:

- una pagina non è importante solo per ciò che dice;
- è importante anche per **quante altre pagine la citano** (cioè la linkano);
- e, soprattutto, conta **chi** la linka.

In pratica, il web veniva trattato come un **grafo di collegamenti** (link graph). Se molte pagine puntano a te, probabilmente sei rilevante. Questo sposta l’asticella da “matching di parole” a “valutazione di autorevolezza attraverso relazioni”.

Per un frontend engineer può suonare familiare: è un po’ come passare dal guardare solo i valori grezzi a costruire **segnali derivati**. Non cambia l’input (l’utente scrive una query), cambia la qualità dell’ordinamento.

## Un nome che descriveva la tecnologia: Backrub
Il progetto iniziale fu chiamato **Backrub**, un nome che descriveva in modo quasi letterale la sua funzione: analizzare i **backlink**, cioè i link in ingresso.

È un naming “interno”, tecnico. Funziona in un laboratorio, in un team, in una demo tra addetti ai lavori. Ma appena lo sposti su un prodotto consumer, emergono frizioni:

- **Ambiguità semantica**: “Backrub” evoca tutt’altro (un massaggio), non la ricerca.
- **Verbalizzabilità**: chiedere a qualcuno di “Backrubbare” qualcosa non crea un verbo naturale.
- **Aspettativa d’uso**: il nome non aiuta a capire immediatamente cosa faccia lo strumento.

Nel design di prodotto questa distanza è un campanello classico: quando il naming è troppo legato all’implementazione, rischia di non aderire al modello mentale dell’utente.

## Google: un nome che scala con l’immaginario
La rinomina in **Google** (ispirata al “googol”, il numero 1 seguito da 100 zeri) ha un’altra proprietà: non descrive il “come”, suggerisce il “quanto”.

Non dice “analizzo backlink”, ma comunica implicitamente:

- enormità della conoscenza indicizzata;
- velocità nel trovarla;
- senso di potenza e ampiezza.

Per chi progetta interfacce, è un promemoria prezioso: **i nomi migliori spesso non spiegano la meccanica, ma fissano una promessa**.

## Cosa può portarsi a casa chi fa frontend
Questa vicenda, al netto dell’aneddotica, è una mini-guida su come tecnologia, UX e linguaggio si sostengono a vicenda.

### 1) L’utente non compra l’algoritmo: compra l’esperienza
La barra di ricerca può essere identica, ma la differenza tra “risultati ok” e “risultati sorprendentemente pertinenti” cambia tutto. Lo stesso vale per noi:

- un componente UI non “è” il componente;
- è l’effetto che produce (chiarezza, fiducia, velocità, riduzione dell’errore).

### 2) Naming = micro-UX
Un nome influenza:

- come parli del prodotto (“lo cerco su…”) 
- quanto è memorizzabile
- quanto è condivisibile
- quanto è *adatto a diventare un verbo*

Quando scegli nomi per feature, dashboard, tool interni o librerie, chiediti:

- Si presta a essere detto ad alta voce senza imbarazzo?
- È confondibile con altro?
- Descrive troppo l’implementazione invece del beneficio?

### 3) Modelli mentali: descrivere l’intento, non il meccanismo
“Backrub” punta al meccanismo (backlink). “Google” punta all’intento (trovare in un universo enorme). In UI succede lo stesso:

- etichette come **“Sincronizza”** o **“Aggiorna”** spesso sono migliori di **“Esegui invalidazione cache”**
- “Importa” comunica un’azione; “Parse CSV e normalizza” comunica l’implementazione.

## In definitiva
L’idea di ordinare il web guardando le relazioni tra pagine è stata una svolta tecnica. Ma la capacità di trasformarla in un prodotto riconoscibile, “dicibile” e coerente con l’immaginario dell’utente è stata altrettanto determinante.

E se oggi ci viene naturale dire “cercalo su Google”, è anche perché qualcuno ha capito che, a volte, **la differenza tra una tecnologia brillante e un prodotto globale passa da una parola sola**.
