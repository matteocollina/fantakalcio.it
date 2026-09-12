---
title: "SQLite riscritta in Rust? Perché qualcuno sta provando a toccare il codice “più affidabile” che abbiamo"
subtitle: "Dalla libreria embedded che ha invaso ogni dispositivo a un’implementazione moderna con concorrenza, async I/O e vector search: cosa cambia davvero per chi sviluppa app."
description: "SQLite è ovunque perché è piccola, embedded e incredibilmente robusta. Proprio per questo l’idea di riscriverla da zero suona quasi sacrilega. Eppure c’è un progetto che ci sta provando: un’implementazione in Rust compatibile con SQLite, pensata per aggiungere concorrenza reale, I/O asincrono e funzionalità moderne come la ricerca vettoriale per embedding. In questo articolo vediamo il “perché” tecnico dietro la scelta, cosa significa essere drop-in replacement, e come si può costruire fiducia su un componente che vive (letteralmente) dei dati degli utenti."
publishedAt: 2026-06-19
tags: ["sqlite","rust","database-embedded","concorrenza","vector-search","testing-deterministico"]
---
Nel frontend e nel full‑stack capita spesso di parlare di database come servizi: Postgres gestito, cluster, repliche, connessioni, pooling, credenziali e una lunga lista di “cose che possono rompersi”. Ma esiste un’altra filosofia, più vicina all’idea di “dipendenza” che di “infrastruttura”: un motore SQL che vive *dentro* l’applicazione.

Questa è la ragione per cui SQLite è ovunque. È una libreria, non un server. Legge e scrive su un singolo file su disco. Riduce drasticamente configurazione, porte, processi separati e complessità operativa. Ed è proprio questa semplicità a renderla una delle fondamenta silenziose dell’informatica moderna: la usi in browser, smartphone, desktop app, tool CLI, IoT… spesso senza nemmeno accorgertene.

Ora immagina di riscrivere tutto da capo, in Rust, cercando di essere compatibile al 100% e allo stesso tempo più “moderna”. Sembra un’idea folle per definizione—finché non inizi a guardare ai limiti pratici che oggi emergono in molte applicazioni.

## Perché toccare SQLite, se funziona così bene?
SQLite non è “il problema”. Anzi: è considerata estremamente robusta perché è conservativa, minimalista, e custodita con un rigore quasi maniacale.

Il punto è un altro: il suo modello di sviluppo e manutenzione è atipico rispetto a quello che molti intendono per open source *collaborativo*. Il codice è disponibile e utilizzabile liberamente, ma l’evoluzione è guidata da pochissime persone e—di fatto—non segue la dinamica classica delle contribution esterne.

Questa scelta ha un effetto collaterale positivo: riduce il rischio di regressioni introdotte da cambiamenti non coerenti con la visione del progetto. Ma ha anche un costo: se la tua azienda o il tuo prodotto hanno esigenze nuove (concorrenza più spinta, I/O non bloccante, funzionalità specifiche), “aspettare che arrivi upstream” non è sempre un’opzione.

Da qui nasce l’idea: costruire un’alternativa che mantenga la compatibilità con SQLite, ma che possa evolvere con un set di priorità diverse.

## Cosa significa davvero “drop‑in replacement”
Quando parliamo di database embedded, *la fiducia* è tutto. Non basta essere veloci. Non basta avere feature nuove. Il requisito numero uno è: **non perdere mai dati**.

Il requisito numero due è: **non costringere gli utenti a riscrivere l’app**.

Essere un drop‑in replacement significa:
- compatibilità con il formato e/o comportamento atteso (SQL, pragma, edge case noti);
- stesse semantiche nei casi limite che la gente dà per scontati da anni;
- integrazione semplice nei binding e nei driver esistenti.

In pratica: “lo sostituisco e funziona” deve valere non solo per l’happy path, ma anche per i percorsi più brutti—quelli che incontrerai in produzione alle 3 di notte.

## Le tre aree dove una riscrittura può cambiare le regole
Alcune scelte architetturali di SQLite sono volutamente conservative. Funzionano benissimo in tantissimi scenari, ma diventano colli di bottiglia quando l’app cresce o quando cambiano le aspettative.

### 1) Concorrenza in scrittura: non solo “un writer alla volta”
Un limite storico di SQLite è il modello in cui, semplificando, **solo uno writer può scrivere alla volta** sul database. È una scelta coerente con un file singolo e con l’obiettivo di robustezza.

Un approccio più moderno prova a consentire **più scritture simultanee** su porzioni diverse dei dati, facendo emergere il conflitto solo quando due operazioni toccano realmente le stesse righe (o la stessa area logica). Se funziona bene, questo cambia parecchio per carichi con:
- molte richieste concorrenti;
- job asincroni in background;
- app locali con più thread/worker.

Per un frontend, l’impatto è indiretto ma concreto: API più reattive sotto carico, meno code lato server, meno timeout percepiti in UI.

### 2) I/O asincrono: evitare di bloccare thread quando si tocca il disco
SQLite tipicamente esegue I/O su disco in modo bloccante: quando legge o scrive, il thread aspetta.

In architetture moderne (specialmente in ambienti con runtime async), la possibilità di **cedere il controllo durante l’I/O** aiuta a:
- aumentare la capacità di gestire richieste concorrenti;
- ridurre sprechi di thread in attesa;
- migliorare la prevedibilità della latenza.

Per chi lavora con Node.js, Rust, o servizi con event loop, questa differenza non è un dettaglio: è una leva architetturale.

### 3) Vector search: embeddings nello stesso database
La svolta “AI‑driven” ha creato un nuovo requisito: **salvare embeddings e cercare i più vicini rapidamente**.

La soluzione comune oggi è aggiungere un secondo sistema (vector database o servizio esterno). Funziona, ma raddoppia la complessità:
- due database, due backup strategy;
- due permessi/connessioni;
- sincronizzazione applicativa;
- query che diventano una pipeline di chiamate.

Integrare tipi vettoriali e indici nativi significa poter tenere:
- dati relazionali tradizionali;
- embeddings;
- e query di similarità

…in un unico file, con un unico linguaggio (SQL) e un unico modello operativo. Per prodotti piccoli/medi—o per edge/desktop/mobile—questa è una semplificazione enorme.

## Il vero problema: guadagnarsi la fiducia (senza 25 anni di storia)
Aggiungere feature è relativamente “facile”. Il difficile è costruire un database che non tradisca mai.

Qui entra in gioco un’idea molto interessante: **test tramite simulazione deterministica**.

Invece di affidarsi solo a test tradizionali, si esegue il database in un ambiente simulato dove puoi controllare tempo e condizioni e, soprattutto, **iniettare guasti riproducibili**:
- perdita di alimentazione durante una scrittura;
- pagina corrotta a metà;
- disco che “mente” e conferma un flush che non è avvenuto;
- interruzioni nel momento peggiore.

La parte cruciale è la *ripetibilità*: stesso seed, stesso scenario, stesso fallimento, fino a quando il bug viene isolato e rimosso. È un modo pragmatico per attaccare il tipo di problemi che non vuoi mai scoprire su un laptop dell’utente o in un POS in negozio.

## Implicazioni pratiche per chi fa frontend (e prodotto)
Anche se “riscrivere un database” sembra lontano dalla UI, le conseguenze arrivano fino al client:

- **Meno dipendenze di sistema**: un motore embedded con capacità moderne può ridurre il numero di servizi esterni necessari.
- **Offline e edge più potenti**: avere SQL + vector search in locale abilita ricerche semantiche e feature AI senza roundtrip costanti.
- **Prestazioni percepite**: concorrenza e I/O non bloccante migliorano latenza e throughput dei servizi che alimentano l’interfaccia.

## Sintesi: una scommessa rischiosa, ma comprensibile
SQLite è diventata “invisibile” perché è affidabile e semplice. Riscriverla è rischioso proprio perché la posta in gioco è massima: i dati.

Eppure, in un mondo dove servono più concorrenza, integrazione async e funzionalità come la vector search *senza* moltiplicare i componenti, la spinta verso un’alternativa compatibile e più evolvibile è naturale.

La domanda non è tanto se sia una buona idea in assoluto, ma **per quali prodotti** e **con quali garanzie**. La differenza la farà la capacità di dimostrare affidabilità nel tempo, con test che cercano attivamente il fallimento—prima che lo faccia la produzione.
