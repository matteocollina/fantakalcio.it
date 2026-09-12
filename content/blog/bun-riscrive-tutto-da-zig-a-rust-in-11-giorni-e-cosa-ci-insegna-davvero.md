---
title: "Bun riscrive tutto: da Zig a Rust in 11 giorni (e cosa ci insegna davvero)"
subtitle: "Una riscrittura totale di codebase è quasi sempre un pessimo segnale. Qui, invece, ha prodotto bug in meno, binari più piccoli e prestazioni migliori — ma non senza polemiche."
description: "Bun ha portato oltre mezzo milione di righe da Zig a Rust in meno di due settimane, spinto da problemi reali di memory management e da un nuovo modo di lavorare con agenti AI in parallelo. Risultato: meno bug storici, leak risolti, binario più piccolo e qualche punto percentuale di performance. Ma la community Zig contesta le conclusioni e mette in discussione la narrativa sui benchmark. In questo articolo: perché la riscrittura è stata tentante, cosa rendeva fragile la gestione della memoria, come hanno strutturato il porting, e quali lezioni pratiche può portarsi a casa chi sviluppa toolchain e runtime per JS."
publishedAt: 2026-07-15
tags: ["Bun","Rust","Zig","memory management","codebase rewrite","AI agents"]
---
Riscrivere una codebase da zero è uno di quei “eventi estremi” che, in molte aziende software, coincidono con un periodo di confusione strategica: anni di lavoro buttati, bug che ritornano, feature congelate e un vantaggio competitivo regalato ai concorrenti.

Eppure, ogni tanto, una riscrittura *sembra* fare centro. È il caso del porting completo di Bun da Zig a Rust, completato in 11 giorni su una codebase enorme. Il dato interessante non è solo la velocità: è **il motivo tecnico** che rendeva la riscrittura plausibile e, soprattutto, **il metodo** con cui è stata eseguita.

## Perché una riscrittura totale è (quasi) sempre una cattiva idea
La regola empirica è semplice: il software “vive” di dettagli. Una codebase matura accumula anni di correzioni, edge case, workaround per ambienti specifici, fix per regressioni che nessuno ricorda più. Quando riscrivi, rischi di perdere tutta quella conoscenza implicita.

Quindi cosa può giustificare una mossa così drastica? In genere, soltanto problemi che:

- sono **strutturali**, non “riparabili” con refactor incrementali;
- hanno un costo operativo continuo (crash, leak, corruzione dati, incidenti);
- derivano da un mismatch fra **modello mentale** del progetto e **strumenti** usati.

Nel caso di Bun, il nodo era un grande classico: **la gestione della memoria**.

## Il problema reale: due mondi di memoria che devono parlarsi
Bun integra JavaScriptCore (il motore JS di Safari), che è garbage-collected. Ma gran parte del resto del runtime/tooling era scritto in Zig, dove la memoria si gestisce manualmente.

Questo crea una situazione delicata: una parte degli oggetti è “posseduta” dal GC, l’altra vive in memoria manuale, e i due mondi mantengono puntatori reciproci. È un terreno fertile per bug del tipo:

- **use-after-free**: si legge memoria già liberata;
- **double free**: si libera due volte lo stesso blocco;
- **leak**: percorsi d’errore che saltano cleanup;
- lifetime non ovvi, soprattutto quando lo stesso oggetto attraversa più layer.

Un esempio emblematico: un leak di memoria nel dev server che cresceva a ogni rebuild per colpa di un singolo percorso d’errore senza cleanup. Non è “solo” un bug: è un segnale che il sistema di ownership è troppo facile da sbagliare.

## Perché Rust (e non un refactor in Zig)
La scommessa di Rust è nota: spostare la gestione della memoria nel sistema di tipi, con il borrow checker a trasformare molti errori runtime in errori a compile-time.

Per un progetto che vive di puntatori, lifetime, risorse native e integrazione con un engine GC, questo significa:

- più frizione iniziale, ma **meno bug di classe memory-safety**;
- ownership e cleanup più leggibili nei confini delle API;
- maggiore prevedibilità quando il progetto cresce e cambia team.

Non è magia: Rust non elimina i bug. Però rende *più costoso* scrivere certe categorie di bug — e questo, in sistemi complessi, è spesso la differenza fra “debito infinito” e “debito gestibile”.

## Il fattore organizzativo: codice scritto sempre di più con LLM
C’è poi una motivazione meno “accademica” ma molto concreta: una parte crescente del codice futuro sarebbe stata prodotta con l’aiuto di modelli.

Qui entra un punto scomodo: **non tutte le lingue sono ugualmente “scrivibili” da LLM oggi**. Linguaggi giovani, con meno esempi pubblici e con breaking changes frequenti, tendono ad avere un “supporto statistico” peggiore.

Rust, nel bene e nel male, ha:

- un ecosistema enorme;
- pattern consolidati;
- tante implementazioni di riferimento;
- tooling e lints che aiutano a convergere su soluzioni “standard”.

In pratica: se sai che produrrai tanto codice in tempi stretti, vuoi massimizzare la probabilità che quel codice sia *compilabile*, *idiomatico* e *reviewabile*.

## Il metodo: porting industriale, in parallelo, con revisione avversaria
La parte più interessante non è “abbiamo riscritto tutto”, ma *come*.

Il processo, per come è stato descritto pubblicamente, sembra seguire una logica molto ingegneristica:

1. **Studio e guida di porting**: prima si produce un documento di mappatura concettuale (API, ownership, invarianti, convenzioni).
2. **Tracciamento dei lifetime**: ricostruire “chi libera cosa e quando”, trasformando anni di conoscenza implicita in documentazione operativa.
3. **Parallelizzazione massiva**: più agenti in parallelo su più workstream Git, portando centinaia di migliaia di righe e migliaia di file.
4. **Review avversaria**: per ogni implementazione, reviewer dedicati con un obiettivo preciso: assumere che il codice sia sbagliato e provare a dimostrarlo.
5. **Verifica pragmatica**: test suite su piattaforme diverse come vincolo non negoziabile.

Il punto chiave è che la velocità non arriva solo dall’AI: arriva da una struttura di lavoro che riduce il rischio classico del porting (“non sappiamo più cosa stiamo cambiando e perché”).

## Risultati dichiarati: bug storici risolti e binario più piccolo
I numeri riportati sono importanti soprattutto perché toccano aspetti difficili da “truccare” senza conseguenze:

- test suite passante su tutte le piattaforme;
- **128 bug storici** corretti;
- leak del dev server risolti;
- binario **~20% più piccolo**;
- qualche punto percentuale di performance.

Al di là delle percentuali, la metrica più convincente è la categoria dei bug: quando un porting riduce crash e leak, spesso significa che ha migliorato davvero il modello di ownership.

## La polemica: benchmark, LTO e compile time
La reazione più dura è arrivata dalla community Zig, con contestazioni su tre fronti tecnici ricorrenti in queste discussioni:

- **Benchmark “fuorvianti”**: confronto non sempre simmetrico, workload scelti ad hoc, oppure build flags diverse.
- **LTO (Link Time Optimization)**: se attivi ottimizzazioni diverse, puoi attribuire a “Rust vs Zig” ciò che è in realtà “configurazione vs configurazione”.
- **Tempi di compilazione**: anche quando il runtime migliora, la developer experience può peggiorare se la build diventa più lenta.

Queste critiche non cancellano i benefici del porting, ma ricordano una lezione fondamentale: quando comunichi risultati, devi separare chiaramente **linguaggio**, **toolchain**, **flags**, **profiling**, **test**, e condizioni di esecuzione.

## Cosa portarsi a casa (anche se non stai riscrivendo un runtime)
Questa storia è interessante per chi fa frontend tooling e infrastruttura JS per un motivo: Bun non è una “web app”, è un pezzo di sistema che vive di FFI, risorse native e performance. Proprio lì, le scelte su memory safety e ownership sono determinanti.

Le implicazioni pratiche:

- Se stai integrando componenti GC con componenti manual memory, **documenta l’ownership come se fosse un’API pubblica**: chi alloca, chi libera, e quali invarianti non devono mai rompersi.
- Se la tua codebase soffre di bug memory-safety ricorrenti, valuta strumenti che trasformano errori runtime in **vincoli statici** (non per ideologia, ma per costo totale).
- Se usi AI per produrre molto codice, la qualità dipende dal contesto: **workflow, review, test e guardrail** contano più del modello.
- Se comunichi “abbiamo guadagnato X%”, pubblica anche *come* (flags, ambiente, suite) oppure aspettati una guerra di benchmark.

## Sintesi
Una riscrittura totale rimane una scelta ad altissimo rischio. Qui però il rischio era in parte già “materializzato” sotto forma di bug strutturali di memoria e complessità d’ownership fra mondi diversi. Il passaggio a Rust ha senso soprattutto come investimento in un modello di sicurezza e manutenzione più verificabile.

La lezione non è “riscrivi tutto”. È: quando il problema è *strutturale*, serve un cambiamento che agisca sul *tipo* di errori che il sistema permette. E se decidi di farlo, il risultato dipende meno dall’eroismo e più da un processo disciplinato: tracciamento dei lifetime, parallelizzazione controllata, review avversaria e test come contratto.
