---
title: "Nitro Modules in React Native: perché non sono “solo un bridge più veloce”"
subtitle: "Oggetti nativi stateful, ArrayBuffer e C++ di prima classe: l’idea è spostare il confine tra JS e native senza perdere espressività (e guadagnando performance)."
description: "Nitro sta catalizzando l’attenzione della community React Native, ma ridurlo a un semplice boost di velocità è limitante. In questo articolo vediamo cosa abilita davvero: oggetti nativi con stato, trasferimenti zero-copy con ArrayBuffer, integrazione C++ e un modello più adatto a casi real-time come camera, grafica e ML. Con uno sguardo a un possibile “Nitro SDK” unificato e a un esempio concreto: Nitro Image, che elimina copie su disco e stringhe base64."
publishedAt: 2026-07-03
tags: ["nitro-modules","jsi","zero-copy","webgpu","vision-camera","c++-interop"]
---
React Native oggi è in una fase interessante: il “tetto” di performance e capacità è altissimo, molte delle vecchie limitazioni sono state aggirate o risolte, e l’ecosistema offre librerie mature per casi d’uso un tempo impensabili (grafica avanzata, animazioni complesse, accesso camera ad alte prestazioni, persino WebGPU).

Dentro questa maturità, Nitro Modules sta diventando un punto di convergenza. Non perché sia l’ennesima moda, ma perché introduce un modello più **potente** e **flessibile** per costruire integrazioni native, soprattutto quando serve andare oltre il classico “chiamo un metodo nativo e mi torna un JSON”.

## Perché Nitro è diverso: non solo velocità, ma *modello*
Quando si parla di bridge in React Native, il pensiero corre subito ai millisecondi risparmiati nelle chiamate. Nitro è effettivamente molto veloce (in benchmark isolati può risultare decine di volte più rapido rispetto ad alternative), ma il punto è: **che cosa rende possibile** quella velocità e, soprattutto, **che cosa abilita** a livello di API.

Nitro punta su alcune caratteristiche chiave:

- **Oggetti nativi stateful (con stato) come “cittadini di prima classe”**
- **Supporto “first-class” ad `ArrayBuffer`** (quindi binari, buffer, dati grezzi)
- **Supporto “first-class” al C++** e interop tra C++ e linguaggi nativi di piattaforma (Swift/Kotlin)
- **Astrazione sottile e type-safe, con binding generati a compile-time**

Tradotto: non sei costretto a modellare tutto come funzioni statiche e payload serializzati. Puoi rappresentare *cose* native (frame camera, immagini in memoria, risorse GPU, handle) in modo più diretto, mantenendo prestazioni e pulizia.

## Quando la differenza si vede davvero: real-time e chiamate ripetute
I benchmark sono utili, ma spesso fuorvianti. La differenza pratica emerge quando:

- fai molte chiamate native al secondo,
- su dati pesanti,
- in un loop real-time.

Un esempio tipico è l’elaborazione camera ad alto frame rate. A 120 FPS, anche “solo” 10 chiamate native per frame diventano **1200 chiamate al secondo**. In quel contesto, l’overhead non è più un dettaglio: si somma, impatta la latenza, e finisce per limitare ciò che puoi permetterti in pipeline.

Nitro, avendo un costo di call molto basso e un modello più adatto a oggetti stateful, diventa un abilitante: non solo fai le stesse cose più velocemente, ma puoi progettare API che prima risultavano scomode o impraticabili.

## Vision Camera, estensibilità nativa e nuove pipeline
Un caso che beneficia molto di questo approccio è l’ecosistema intorno alla camera.

L’idea centrale è avere una base estremamente flessibile da estendere con codice nativo di terze parti: integrazioni con framework e toolchain esistenti (Torch, ML Kit, OpenCV e simili) diventano “plug-in” su una pipeline coerente.

Qui Nitro torna utile perché:

- i **frame** e le risorse non sono “stringhe e path su disco”,
- puoi mantenere i dati **in memoria**,
- puoi ridurre copie e conversioni.

### L’innesto con WebGPU: frame come texture, compute shader e zero-copy
Un’altra direzione molto interessante è l’integrazione tra camera e **WebGPU**: importare frame come **texture WebGPU** e processarli con **compute shader**.

Il valore tecnico qui è enorme:

- **riuso di buffer GPU zero-copy** (o comunque senza passaggi inutili),
- elaborazioni parallele sulla GPU,
- possibilità di costruire task di computer vision (face detection, QR scanning, filtri, statistiche) con **codice JS + shader**, senza introdurre dipendenze native specifiche.

E se non ami scrivere shader “raw”, strumenti come TypeGPU (syntax più ergonomica sopra WebGPU) possono diventare un tassello per rendere queste pipeline più accessibili.

## Dall’era “hard problems” a “ship faster”
C’è un cambio di prospettiva importante: una volta React Native era pieno di spigoli. Oggi, con più aziende che investono e una community più strutturata, molte “grane storiche” sono meno frequenti.

Il problema si sposta verso:

- **velocità di delivery**,
- efficienza nel costruire feature,
- capacità di “scendere in native” rapidamente quando serve (nuove API Apple/Google, hardware capability, feature di sistema).

In questo, Nitro si propone come leva pragmatica: quando ti serve una feature specifica, scrivi un modulo con una porzione di Swift/Kotlin (e, quando utile, C++) e lo integri con un’API più espressiva.

## Verso un “Nitro SDK”? Il tema dell’orchestrazione
Un rischio tipico quando nasce una nuova “ondata” di moduli è la frammentazione:

- pattern diversi tra librerie,
- scelte API incoerenti,
- qualità e manutenzione disomogenee.

Ha senso immaginare un livello “umbrella” stile SDK che:

- imponga o suggerisca **best practice di API design**,
- mantenga uno stile coerente,
- incentivi l’uso di feature Nitro più avanzate (ad esempio un modello più object-oriented, invece di tutto statico),
- soprattutto: abiliti la **condivisione di tipi** tra librerie.

La condivisione dei tipi è un acceleratore enorme: se una libreria produce un certo tipo in memoria e un’altra lo consuma senza conversioni, l’integrazione diventa naturale e molto più performante.

## Nitro Image: esempio concreto di “tipo in memoria” che cambia il gioco
Chi ha lavorato con image picker tradizionali in React Native conosce bene il collo di bottiglia:

- selezioni una o più immagini,
- parte un processo di **copia su disco** (spesso in una directory temporanea),
- poi l’app si scambia **path** come stringhe… o peggio **base64**.

Questo approccio è comodo, ma pessimo per performance e latenza, soprattutto quando selezioni molte immagini.

Un tipo come **Nitro Image** introduce un’idea semplice ma fondamentale:

- trasferimento **in-memory** (binario),
- **zero-copy** per il passaggio dei dati,
- possibilità di operare sull’immagine (resize, trasformazioni, salvataggio) senza “spostare file” come meccanismo principale.

È uno di quei mattoni infrastrutturali che non fanno rumore, ma cambiano l’esperienza utente quando l’app inizia a trattare media in modo serio.

## Sintesi: Nitro come spostamento del confine, non come micro-ottimizzazione
Nitro è interessante perché sposta il confine tra JavaScript e native:

- meno serializzazione e meno “stringhe come protocollo”,
- più oggetti reali e dati binari in memoria,
- interop C++ e performance coerenti con casi real-time,
- API potenzialmente più eleganti e riusabili tra librerie.

La conseguenza pratica è chiara: **meno tempo speso a combattere l’infrastruttura**, più tempo per costruire feature. E quando serve spingere su camera, grafica, ML o pipeline GPU, avere un modello zero-copy e stateful non è un lusso: è la differenza tra un prototipo e un prodotto che regge in produzione.
