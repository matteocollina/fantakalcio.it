---
title: "Connect Four con solo CSS: quando lo styling diventa logica"
subtitle: "Un esempio sorprendente di interazione, stato e “regole” gestite senza JavaScript."
description: "È possibile costruire un Connect Four giocabile usando soltanto HTML e CSS: niente JS, niente canvas. Vediamo quali idee di base lo rendono possibile (stato, input, selettori, pseudo-classi) e perché questi esperimenti sono un ottimo esercizio per affinare la padronanza del CSS moderno."
publishedAt: 2026-05-19
tags: ["css-only","selettori-avanzati","pseudo-classi","input-hack","ui-interattive"]
---
Chiunque scriva CSS da un po’ si è sentito dire almeno una volta che “CSS non è un linguaggio di programmazione”. In senso accademico la discussione può anche avere un suo perché, ma nella pratica esiste un’area di sperimentazione molto concreta: interfacce e perfino piccoli giochi realizzati **senza una riga di JavaScript**.

Un Connect Four “solo CSS” è uno degli esempi più interessanti perché non si limita a animazioni o hover: richiede **stato**, **interazione ripetuta** e una qualche forma di **validazione visiva** (allineamenti orizzontali, verticali, diagonali). Anche se non sempre arriva a implementare un motore di regole completo come farebbe un JS, mette in mostra quanto si possa spingere la combinazione di HTML semantico + selettori + pseudo-classi.

## L’idea chiave: gestire lo stato con input HTML
In assenza di JavaScript, l’unico “contenitore di stato” disponibile nel DOM è spesso un controllo di form:

- `input[type="radio"]` o `input[type="checkbox"]`
- `:checked` come segnale persistente
- `label` per rendere cliccabile un’area di UI

Questo pattern (a volte chiamato *input hack*) consente di trasformare un click in una variazione dello stato del documento, che il CSS può leggere e usare per cambiare aspetto a qualunque elemento tramite selettori.

In un gioco a griglia, il concetto è tipicamente:

- ogni “cella” o ogni “mossa possibile” è mappata a un input
- cliccando sul punto giusto si attiva un `:checked`
- il disco (getto) compare grazie a regole tipo `input:checked ~ .board ...`

## Far “cadere” il gettone: simulazione con layout e selettori
Il comportamento distintivo del Connect Four è la gravità: il gettone non si piazza dove clicchi, ma **cade fino alla prima posizione libera** nella colonna.

Con solo CSS, la gravità si simula combinando:

- una colonna che contiene più “slot”
- regole che mostrano il disco nello **slot più basso disponibile**
- una catena di selettori che dipende da quali slot sono già occupati

In pratica, il CSS diventa un sistema di priorità: “se l’ultimo è libero, mostra lì; altrimenti se è occupato, prova quello sopra; e così via”. Non è la stessa cosa di un algoritmo, ma a livello di risultato visivo ci si può avvicinare molto.

## Alternare i turni senza JS
Un’altra difficoltà è alternare i colori (rosso/giallo) a ogni mossa.

Qui entrano in gioco strategie come:

- gruppi di radio button mutuamente esclusivi
- struttura HTML che forza una sequenza (turno 1 → turno 2 → turno 3…)
- selettori che cambiano stile in base a “quale turno” è attivo

È un’idea simile a un “wizard” CSS-only: ogni step abilita il successivo, e il foglio di stile decide come rendere la UI in quello stato.

## Rilevare un “connect four” (anche diagonale)
La parte più spettacolare è evidenziare una vittoria, incluse le diagonali. Con CSS moderno, questo tipo di feedback si costruisce spesso con:

- selettori che riconoscono pattern nella griglia (combinazioni specifiche di `:checked`)
- overlay o highlight tramite pseudo-elementi
- gestione accurata di stacking context per far emergere la linea vincente

È importante essere onesti: per un gioco completo la logica delle combinazioni può diventare enorme (combinatoria esplosiva). Per questo questi progetti tendono a essere **dimostrazioni ingegnose** più che implementazioni “scalabili”. Ma proprio lì sta il valore didattico: ti costringono a ragionare in termini di selettori, dipendenze e stato.

## L’effetto 3D: profondità senza canvas
Molti Connect Four CSS-only puntano anche su un look “3Dish”: ombre, gradienti, luci, e una cornice che dà profondità.

Con:

- `linear-gradient()` e `radial-gradient()` per simulare riflessi
- `box-shadow` e `filter: drop-shadow()` per la separazione dei piani
- `transform` (anche leggere rotazioni) per rendere il tabellone più fisico

si ottiene un rendering sorprendentemente realistico, pur restando nel dominio del layout e della pittura CSS.

## Perché vale la pena studiare questi esperimenti
Anche se nel lavoro quotidiano userai JavaScript per la logica di gioco (e faresti bene), i progetti CSS-only sono un ottimo allenamento perché:

- migliorano la padronanza di **selettori e specificità**
- insegnano a modellare la UI come **macchina a stati**
- ti rendono più creativo nell’uso di **pseudo-classi** e struttura del DOM

Se sai costruire interazioni non banali con solo CSS, scrivere CSS “normale” per prodotti reali diventa più semplice, pulito e robusto. E soprattutto: cambia la percezione di CSS da “decorazione” a **strumento espressivo** con logica e vincoli.
