---
title: "Algoritmo di Dijkstra: trovare il percorso minimo (e perché serve ancora nel software moderno)"
subtitle: "Dai grafi pesati alle code di priorità: il cuore “greedy” del shortest path spiegato in modo operativo."
description: "L’algoritmo di Dijkstra è uno dei pilastri dell’informatica applicata: routing di rete, navigazione, robotica, logistica, giochi. In questo articolo vediamo come modella il problema con grafi pesati, come funziona passo-passo, perché è un algoritmo greedy e come si implementa in pratica con una priority queue (min-heap), includendo anche la ricostruzione del percorso tramite i predecessori."
publishedAt: 2026-07-10
tags: ["algoritmo-di-dijkstra","grafi-pesati","priority-queue","min-heap","shortest-path"]
---
## Il problema: “qual è la strada migliore da A a B?”

Molti problemi reali si riducono a una domanda semplice: **come arrivo dal punto A al punto B minimizzando un costo?**

Quel “costo” può essere:

- distanza (km), tempo (minuti), carburante;
- latenza in una rete;
- costo di attraversamento di una cella in una griglia;
- “fatica” o rischio in un percorso;
- qualsiasi metrica misurabile e confrontabile.

L’algoritmo di Dijkstra risolve proprio questo: **trovare il percorso a costo minimo** tra un nodo sorgente e gli altri nodi (o verso una destinazione specifica), in un grafo con pesi non negativi.

## Il modello: grafi, nodi, archi e pesi

Per applicare Dijkstra bisogna prima trasformare il dominio in un’astrazione:

- **nodi (nodes)**: entità (città, router, utenti, celle di una mappa…)
- **archi (edges)**: connessioni tra entità (strade, link, relazioni…)
- **pesi (weights)**: costo associato a ciascun arco

Quando gli archi hanno un costo, il grafo è un **grafo pesato (weighted graph)**. Dijkstra lavora su questo tipo di struttura e cerca il cammino con **somma dei pesi minima**.

> Nota importante: Dijkstra assume pesi **non negativi**. Se esistono pesi negativi, servono altre tecniche (es. Bellman–Ford).

## L’idea chiave: espandere sempre il “più promettente”

Dijkstra è un algoritmo **greedy**: ad ogni passo sceglie ciò che sembra migliore *in quel momento*.

In pratica mantiene una stima della distanza minima dalla sorgente a ogni nodo e ripete questo ciclo:

1. seleziona il nodo non ancora visitato con distanza stimata più piccola;
2. prova a migliorare (rilassare) le distanze dei suoi vicini;
3. marca il nodo come visitato.

Questa scelta “ingorda” funziona perché, con pesi non negativi, quando un nodo diventa il più vicino tra i non visitati, **la sua distanza è definitiva**.

## Esempio rapido (concettuale)

Supponiamo di partire da **A** e voler raggiungere **D**.

### Inizializzazione

- `dist[A] = 0`
- `dist[altri] = ∞` (valore temporaneo: “non lo so ancora”)
- `prev[*] = None` per ricostruire il percorso
- insieme `visited = ∅`

### Passi

- Si parte da **A**, si aggiornano i vicini (es. B e C).
- Poi si visita il nodo non visitato con `dist` più piccolo (es. **B**), si aggiornano i suoi vicini (es. D).
- Si continua finché si visita **D** o finché si sono processati tutti i nodi raggiungibili.

### Ricostruzione del percorso

Una volta calcolate le distanze, il percorso minimo non è “stampato” da solo: per ottenerlo si usa `prev`:

- si parte da **D**
- si risale `prev[D]`, poi `prev[prev[D]]`, ecc.
- si ottiene la lista al contrario, che va poi invertita

Questa struttura `prev` è uno dei dettagli più utili in produzione: senza, avresti solo il costo minimo, non la sequenza di passi.

## Implementazione pratica: adjacency list + priority queue

Per grafi medi o grandi, scegliere ogni volta “il nodo con distanza minima” scorrendo una lista sarebbe troppo lento. La soluzione standard è usare una **coda di priorità** (in pratica un **min-heap**).

### Rappresentare il grafo

Una forma comoda è la **lista di adiacenza**:

- per ogni nodo, elenco dei vicini e del peso per raggiungerli

Concettualmente:

```text
A: { B: 2, C: 6 }
B: { A: 2, C: 9, D: 5 }
C: { A: 6, B: 9, D: 8 }
D: { B: 5, C: 8 }
```

### Strutture dati essenziali

- `dist`: mappa nodo → miglior distanza nota
- `prev`: mappa nodo → predecessore nel percorso minimo
- `visited`: insieme di nodi già finalizzati
- `pq`: min-heap di coppie `(distanza, nodo)`

### Il ciclo

- estrai da `pq` il nodo con distanza minore
- se già visitato, salta (capita perché un nodo può entrare più volte nel heap con distanze diverse)
- per ogni vicino, calcola una `newDist = dist[current] + weight(current, neighbor)`
- se `newDist` è migliore, aggiorna `dist[neighbor]` e `prev[neighbor]`, e inserisci `(newDist, neighbor)` nel heap

Questa combinazione (lista di adiacenza + min-heap) è il motivo per cui Dijkstra resta un’arma estremamente attuale: **scala bene** e si adatta a molti problemi “di percorso” nel software.

## Perché questa semplicità è un vantaggio (anche nel frontend)

Anche se spesso lo associamo a GPS e routing, Dijkstra torna utile ovunque serva:

- calcolo di percorsi su griglie (editor, giochi, mappe interattive)
- suggerimento di “passi minimi” in flussi o stati (wizard, funnel, grafi di dipendenze)
- ottimizzazione di pipeline (build graph, dependency graph)
- analisi di rete (anche concettuale) per visualizzazioni e strumenti di debug

C’è un punto culturale importante: **forzare la semplicità**. Un algoritmo come Dijkstra funziona perché separa bene:

- modello (grafo pesato)
- regola di scelta (minimo tra i non visitati)
- aggiornamento locale (rilassamento)
- ricostruzione (predecessori)

Se il tuo codice riesce a rispecchiare queste quattro parti senza “magia”, diventa immediatamente più leggibile e testabile.

## Sintesi e implicazione pratica

Dijkstra è un classico perché trasforma un problema enorme (tutti i possibili percorsi) in una procedura deterministica e incrementale:

- mantieni distanze provvisorie
- scegli sempre il nodo più vicino non ancora finalizzato
- aggiorna i vicini
- usa `prev` per ricostruire il cammino

Quando devi modellare un problema di ottimizzazione “da A a B” nel tuo progetto, il primo passo non è cercare librerie: è chiederti **se puoi descriverlo come un grafo pesato a pesi non negativi**. Se la risposta è sì, hai già in mano una soluzione robusta, comprensibile e sorprendentemente versatile.
