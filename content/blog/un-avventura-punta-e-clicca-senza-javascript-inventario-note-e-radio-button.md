---
title: "Un’avventura punta-e-clicca senza JavaScript: inventario, note e… radio button"
subtitle: "Con un trucco “vecchia scuola” di CSS puoi costruire una piccola logica di navigazione: stato, percorsi e viewport a segmenti, tutto senza una riga di JS."
description: "È possibile realizzare un mini gioco d’avventura senza JavaScript? Sì, se accetti alcune regole: stato semplice, navigazione a step e UI costruita con HTML + CSS. In questo articolo vediamo un approccio basato su input “checked” e selettori CSS per spostare la viewport a segmenti e simulare stanze, frecce direzionali e un inventario (con oggetti come una mela o un biglietto)."
publishedAt: 2026-06-27
tags: ["css-checked","radio-button-hack","selettori-css","ui-state","giochi-css"]
---
Realizzare un piccolo gioco d’avventura **senza JavaScript** sembra un esercizio di stile, ma in realtà è un ottimo modo per ragionare su **stato**, **navigazione** e **componenti UI** con i soli strumenti di HTML e CSS.

L’idea: una schermata “a stanze”, frecce per muoversi, e un inventario che si popola (una mela, un biglietto “strano”, ecc.). Niente calcoli complessi, niente fisica: solo **progressione** e **scelte**.

## Il vincolo che rende tutto interessante: lo stato in CSS
CSS non ha variabili di stato nel senso applicativo del termine, ma ha una cosa preziosa: gli **input** possono essere **selezionati** (checked) e quello stato è “leggibile” dai selettori.

Quindi il fulcro del gioco diventa:

- una serie di `input` (tipicamente `radio` per stati mutuamente esclusivi, o `checkbox` per stati cumulativi)
- un set di `label` che l’utente clicca (le frecce direzionali, i pulsanti, gli oggetti)
- regole CSS che, in base a `:checked`, **mostrano/nascondono** pezzi di UI e **spostano** la viewport

È un trucco che gira da anni (letteralmente un “classico” del CSS), ma è ancora sorprendentemente efficace.

## Navigazione a stanze: la viewport che si sposta a segmenti
Un modo molto robusto per simulare un mondo a stanze è considerare ogni “scena” come un **segmento** in una griglia orizzontale (o anche bidimensionale).

### Struttura concettuale
- Un contenitore (la “viewport”) con `overflow: hidden`
- Un wrapper interno (il “world”) che contiene tutte le scene in fila
- Ogni scena ha larghezza pari alla viewport
- Quando cambia lo stato, sposti il wrapper con `transform: translateX(...)` (o `translate(...)`)

L’aggancio allo stato avviene così:

1. clic su una freccia → in realtà è un `label` associato a un `input`
2. quell’input diventa `:checked`
3. la regola `#stanza-3:checked ~ .world { transform: translateX(-200%); }` entra in gioco
4. il mondo “scorre” fino alla stanza corretta

In altre parole: **lo stato decide quale input è checked; il checked decide dove si posiziona la viewport.**

### Perché radio e non solo checkbox?
Per la posizione del player è comodo usare `radio` perché vuoi che **una sola stanza** sia attiva alla volta. Le `checkbox` invece sono perfette per l’inventario (puoi avere più oggetti contemporaneamente).

## L’inventario: oggetti come flag persistenti
Aggiungere un inventario senza JS significa pensarlo come una collezione di **flag**.

- “Ho preso la mela” → `#item-mela:checked`
- “Ho preso il biglietto” → `#item-biglietto:checked`

Quando clicchi su un oggetto nella scena, in realtà stai cliccando un `label` che attiva la checkbox corrispondente.

Poi, con CSS:

- l’oggetto nella scena sparisce (perché è stato raccolto)
- l’icona nell’inventario appare
- eventuali messaggi o dettagli diventano visibili (es. leggere un “biglietto strano”)

Esempio di logica (concettuale):

- se **non** hai lo strumento → davanti a un ostacolo compare “Mi serve un attrezzo per passare”
- se **hai** lo strumento → appare l’azione “Apri / scava / rimuovi”, e il percorso si sblocca

Tutto questo solo con selettori e condizioni basate su `:checked`.

## Traversare il DOM con `:checked` e selettori di fratellanza
Il trucco più “magico” di questo approccio è la possibilità di usare selettori tipo:

- `#qualcosa:checked ~ .qualcosaltro ...`

In pratica:

- metti tutti gli input in testa (o comunque prima) rispetto alla UI che vuoi controllare
- sfrutti il selettore di fratello generale `~` per applicare stili ai nodi successivi

A volte serve anche “percorrere” più livelli (con combinazioni di wrapper e classi), ma l’idea resta: **lo stato vive negli input, la UI reagisce perché si trova dopo nel DOM**.

## Quanto CSS serve davvero?
Sorprende sempre vedere che un progetto del genere può arrivare a **centinaia o migliaia di righe di CSS** (ordine di grandezza: ~1.600 righe non è affatto inusuale).

Non perché CSS sia “verbose” di per sé, ma perché:

- ogni stanza aggiunge layout e asset
- ogni stato aggiunge regole condizionali
- ogni oggetto aggiunge varianti (prima/dopo raccolta)

È la stessa dinamica di un piccolo sistema a stati finiti: all’aumentare degli stati, aumenta la matrice di condizioni.

## Limiti (onesti) di un gioco no-JS
Questo approccio è fantastico come esercizio e per micro-esperienze, ma ha limiti chiari:

- debug più scomodo rispetto a una state machine in JS
- combinazioni di stato che possono esplodere se il design non è molto controllato
- logiche “calcolate” (punti, timer, pathfinding) praticamente fuori portata

Il punto però non è sostituire JavaScript: è dimostrare quanto lontano puoi spingere **HTML + CSS** quando progetti bene i vincoli.

## Sintesi: il trucco è progettare prima lo stato, poi la UI
Un’avventura no-JS funziona quando riduci tutto a:

1. **posizione corrente** (radio)
2. **oggetti raccolti** (checkbox)
3. **UI reattiva** guidata da `:checked` e selettori `~`
4. **viewport a segmenti** che si sposta in base allo stato

Se ti porti a casa una sola lezione pratica è questa: **CSS diventa sorprendentemente “logico” quando trasformi l’interazione in una macchina a stati semplice**, e costruisci il DOM in modo che i selettori possano fare il loro lavoro.
