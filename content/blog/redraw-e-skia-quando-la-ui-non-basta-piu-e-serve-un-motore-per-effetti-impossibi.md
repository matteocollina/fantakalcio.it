---
title: "Redraw e Skia: quando la UI non basta più (e serve un motore per effetti “impossibili”)"
subtitle: "Skia per grafica scalabile e testo; Redraw per effetti procedurali, materiali e rendering fisicamente plausibile su WebGPU."
description: "Skia è eccellente per disegno 2D ad alte prestazioni (testo, layout, scaling). Ma quando vuoi effetti avanzati come stroke variabile, colore lungo un tracciato o materiali PBR che generano luci e ombre in modo automatico, entra in gioco Redraw: un layer orientato a WebGPU che punta su geometria e calcolo, non sulla “pittura” tradizionale. Vediamo differenze, combinazioni possibili e scenari pratici in React Native e sul web."
publishedAt: 2026-07-01
tags: ["webgpu","react-native-skia","rendering-pbr","effetti-procedurali","visioncamera"]
---
Nel frontend moderno abbiamo raggiunto un paradosso: la potenza grafica disponibile è enorme, ma molte interfacce restano “piatte” o comunque conservative perché certi effetti costano troppo in prestazioni, oppure richiedono un lavoro manuale infinito (ombre su ombre, blur, inner shadow, gradienti complessi). Il risultato è che, appena si prova a spingere davvero sul look&feel, la UI diventa lenta o ingestibile.

In questo scenario si capisce perché abbia senso parlare di **Skia** e **Redraw** non come alternative, ma come strumenti con **obiettivi diversi**.

## Skia: il motore “solido” per grafica 2D scalabile
Skia nasce per essere un’ottima base per grafica 2D ad alte prestazioni, con punti di forza molto concreti:

- **testo e layout** affidabili;
- **scaling e rendering vettoriale** efficienti;
- prestazioni pensate per UI reali, non solo demo;
- una filosofia “da libreria grafica”: disegno, compositing, pipeline prevedibile.

È la scelta naturale quando la tua priorità è far girare bene componenti e scene 2D che devono rimanere nitide e reattive su device diversi.

## Redraw: effetti avanzati, procedurali, oltre la UI tradizionale
Redraw ha un focus diverso: non sostituire il disegno 2D classico, ma abilitare **effetti non banali** (e spesso non disponibili come primitive standard “da web”). Esempi tipici:

- **stroke variabile** lungo un path;
- **colore lungo il tracciato** (non solo un gradiente banale, ma variazioni controllate sul percorso);
- effetti “da motion design” o da pipeline grafica evoluta;
- costruzione di look complessi a partire da **informazione geometrica**, non da rasterizzazione pesante.

Il punto chiave è che Redraw si presta a generare risultati che ricordano la grafica “da presentazione Apple” o da software di motion/3D, ma con un’idea più programmabile e “procedurale”.

## Il tassello decisivo: WebGPU (web e native)
Un aspetto interessante è l’allineamento su **WebGPU**.

WebGPU è uno standard JavaScript per il web, ma il modello (e le implementazioni) sono progettati per essere portabili anche fuori dal browser. In pratica:

- lo stesso paradigma di rendering può vivere su **web** e su **app native**;
- si sblocca una classe di effetti che prima erano difficili da sostenere con performance e portabilità.

Questo rende Redraw particolarmente adatto a chi vuole investire su un approccio moderno al rendering, evitando soluzioni troppo “artigianali” o legate a una singola piattaforma.

## UI “procedurale”: perché ombre e materiali non dovrebbero essere un lavoro manuale
Nel design tool più diffuso, molte cose si fanno ancora “a mano”: scegli ombra, blur, distanza, opacità, magari replichi con un’inner shadow, e così via. Funziona, ma:

- è **lento** da produrre e iterare;
- è **fragile** (cambia una forma e devi ritoccare mille parametri);
- spesso è **pesante** a runtime perché certe tecniche implicano rasterizzazione e blur costosi.

L’idea più interessante che emerge con Redraw è spostare la UI verso un modello simile a quello del 3D:

> descrivi una scena (luci) e un materiale (proprietà), e il risultato “cade fuori” automaticamente.

Qui entra in gioco il **PBR (Physics-Based Rendering)**.

### PBR in breve (e perché è utile in UI)
Con il PBR definisci proprietà come “questo materiale è metallico”, “questa superficie è ruvida”, “questa luce arriva da qui”. Ombre, riflessi e resa generale non sono più un collage di effetti: sono conseguenze del modello.

Due vantaggi pratici:

1. **Coerenza visiva**: cambi luce o geometria e tutto si aggiorna in modo plausibile.
2. **Produttività**: meno parametri grafici da micro-gestire manualmente.

E la cosa divertente è che, una volta che hai una base fisica, puoi anche **rompere le regole** in modo controllato per ottenere look stilizzati.

## Skia + Redraw: complementarità, non competizione
Messa semplice:

- **Skia** è perfetta per la “spina dorsale” grafica: testo, 2D scalabile, UI reattiva.
- **Redraw** entra quando vuoi “quel livello in più”: materiale, illuminazione, effetti lungo i path, shading procedurale.

È un approccio stratificato: mantieni la robustezza del rendering 2D per il quotidiano, e aggiungi un layer più sperimentale per momenti in cui l’esperienza deve distinguersi.

## Integrazione con camera e ML: perché è un acceleratore enorme
Un’altra direzione concreta è l’integrazione tra pipeline grafica e camera, con tre categorie di use case molto riconoscibili:

1. **Filtri ed effetti colore** (il classico: color matrix, LUT, look cinematografici).
2. **Interazione guidata da ML**: rilevamento volto/mano per controllare elementi UI o animazioni (gesture-driven UI che non passa dal touch).
3. **AR e 3D compositing**: inserire oggetti e shading coerenti con la scena, usando anche informazioni come “luce” e contesto provenienti dalla camera.

Quando questi pezzi funzionano senza integrazioni “pesanti” e accoppiamenti rigidi tra librerie, diventa più realistico portare prototipi avanzati in produzione.

## Il vero lavoro dopo l’idea: performance e stabilità
Una libreria grafica può impressionare con proof-of-concept, ma il salto di qualità arriva quando:

- le prestazioni sono consistenti su device diversi;
- la stabilità è sufficiente per casi reali (memory, fallback, edge case);
- l’API non obbliga a “combattere” la libreria per ottenere risultati.

È qui che si misura la maturità di un approccio come Redraw: non tanto nella spettacolarità dell’effetto, quanto nella ripetibilità e affidabilità nel tempo.

## Sintesi: cosa cambia per chi costruisce UI
Skia resta una base eccellente per la grafica 2D scalabile e per tutto ciò che deve essere solido (testo, layout, rendering prevedibile). Redraw aggiunge una prospettiva diversa: **UI come scena**, effetti come **funzione della geometria**, materiali e luci come strumenti per ottenere complessità senza stratificare hack di ombre e blur.

L’implicazione pratica è chiara: se vuoi interfacce più ricche senza pagare il prezzo di rasterizzazione e lavoro manuale, la direzione è rendere gli effetti **procedurali**. Non è solo estetica: è un modo per far tornare sostenibili quelle UI che oggi scartiamo perché “troppo lente” o troppo difficili da mantenere.
