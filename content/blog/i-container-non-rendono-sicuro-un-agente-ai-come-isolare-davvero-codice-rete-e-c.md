---
title: "I container non rendono “sicuro” un agente AI: come isolare davvero codice, rete e credenziali"
subtitle: "Perché Docker ≠ sandbox, quali rischi restano anche in container, e come usare microVM e secret proxy per lavorare senza prompt di permesso continui."
description: "Gli agenti AI che eseguono comandi sul tuo progetto aumentano la produttività, ma anche il rischio: cancellazioni accidentali, dipendenze NPM malevole, furto di token e accessi non desiderati. I container aiutano, ma non bastano a garantire sicurezza. In questo articolo vediamo un approccio più robusto: sandbox basate su microVM con policy di rete e gestione delle credenziali tramite proxy, così da isolare davvero filesystem, network e segreti senza trasformare il flusso di lavoro in una serie infinita di conferme."
publishedAt: 2026-06-30
tags: ["sandbox microVM","sicurezza npm","segreti e token","policy di rete","agentic coding"]
---
## Il problema: produttività vs. permessi continui
Chi lavora con strumenti AI “agentici” (cioè capaci di eseguire comandi, installare dipendenze, modificare file) conosce bene il trade-off:

- **Modalità prudente**: chiedere conferma per ogni operazione potenzialmente pericolosa. Sicuro, ma interrompe il flusso e rallenta tutto.
- **Modalità “lascia fare”**: massimo throughput… finché non arriva l’errore grave (file cancellati, comandi distruttivi, configurazioni compromesse).

A complicare il quadro c’è il tema delle **dipendenze**: l’ecosistema NPM è enorme e, ciclicamente, emergono pacchetti malevoli o compromessi che puntano a:

- esfiltrare **API key** e token,
- leggere variabili d’ambiente,
- alterare script di build,
- introdurre hook o payload che eseguono codice al momento sbagliato.

La combinazione “agente che esegue comandi” + “dipendenze non sempre affidabili” è esattamente il motivo per cui serve un isolamento serio.

## Container ≠ sandbox: perché i container non bastano
È facile pensare: “Ok, eseguo tutto in Docker e sono a posto”. In realtà **un container non è una barriera di sicurezza completa**:

- il container condivide il kernel dell’host (salvo setup specifici),
- spesso ha accesso a volumi montati (e quindi ai file reali del progetto),
- può avere rete “aperta” verso Internet e servizi interni,
- può leggere segreti se li esporti come env var o li metti in chiaro nei file.

Il punto non è che i container siano inutili: sono ottimi per riproducibilità e isolamento applicativo. Ma se l’obiettivo è **limitare i danni** di un agente AI o di una dipendenza malevola, serve un livello di isolamento più vicino a una VM.

## L’approccio più robusto: sandbox su microVM
Una sandbox moderna per sviluppo mette il tuo ambiente di lavoro dentro una **microVM**: un compromesso molto pratico tra container e VM tradizionale.

Caratteristiche chiave:

- **Isolamento più forte** rispetto a un container “nudo”: la microVM separa meglio l’ambiente dall’host.
- **Avvio e spegnimento rapidi**: non è la VM pesante da gestire manualmente.
- **Comportamento consistente su Mac/Windows/Linux**: utile in team e per evitare “funziona solo sul mio computer”.

In pratica, puoi far girare:

- l’agente AI (o semplici comandi di build/test)
- dentro un container
- che a sua volta sta dentro la microVM (la sandbox)

Il risultato: **il codice gira dove vuoi, ma i confini sono chiari**.

## Tre controlli che cambiano tutto: filesystem, rete, segreti
### 1) Isolamento del filesystem: accesso solo a ciò che monti
Un buon modello di sandbox espone all’interno **solo la cartella che decidi**. Questo riduce drasticamente la superficie d’attacco:

- l’agente può modificare file del progetto (quelli condivisi),
- ma non può “salire” e navigare nel resto del disco,
- non può cancellare file altrove, anche se prova con percorsi assoluti.

Un esempio tipico: avvii la sandbox da `./test/` e dentro vedi solo `index.html`. Il file `../script.js` esiste sull’host, ma **non è visibile né raggiungibile** dalla sandbox.

Questa sola proprietà elimina una classe intera di disastri (“ho cancellato la home”, “ho wipeato una cartella sbagliata”, ecc.).

### 2) Policy di rete: default deny con whitelist sensata
Il secondo pilastro è la rete.

In uno scenario realistico, vuoi:

- permettere accesso ai servizi necessari allo sviluppo (es. registry pacchetti),
- bloccare chiamate arbitrarie verso domini sconosciuti,
- impedire che un processo possa parlare con database o pannelli admin non previsti.

Una configurazione “bilanciata” (default deny + eccezioni per domini comuni) è spesso il miglior compromesso:

- continui a lavorare senza impazzire,
- ma riduci l’esfiltrazione di dati e i download opportunistici.

Nota: anche con policy “locked down” (tutto bloccato) puoi lavorare, ma richiede più manutenzione. Per molti progetti frontend, “balanced” è la scelta che massimizza produttività e sicurezza.

### 3) Gestione dei segreti: mai token in chiaro dentro l’ambiente
Questo è il punto dove molte persone si fanno male anche usando container o VM:

- esportano token come `GITHUB_TOKEN=...` dentro la shell,
- salvano chiavi in `.env`,
- fanno login “interattivo” dentro l’ambiente isolato.

Il problema è semplice: **qualsiasi processo dentro l’ambiente può leggere quelle credenziali**, incluse dipendenze malevole.

Un’alternativa molto più solida è usare un **meccanismo di secret injection via proxy**:

- dentro la sandbox non esiste il token in chiaro,
- quando un tool fa una richiesta verso un servizio esterno, un proxy “fuori” dalla sandbox inserisce la credenziale al volo,
- se un pacchetto prova a leggere la variabile o stamparla, ottiene solo un valore “proxy-managed”, non il segreto reale.

È un cambio di paradigma: non “proteggi meglio” il segreto, **lo togli proprio dall’ambiente dove gira il codice non fidato**.

## Il rischio che resta: modifiche malevole nel progetto
Anche con filesystem isolato al progetto, un agente (o una dipendenza) può ancora:

- aggiungere file indesiderati nella repo,
- modificare script di build,
- introdurre hook (ad es. pre-commit) o configurazioni che diventano pericolose se eseguite poi sull’host.

Questo significa che l’isolamento deve coprire anche il *modo* in cui sincronizzi le modifiche.

### Sincronizzazione diretta vs. lavoro su clone
Molte sandbox, per comodità, lavorano su una cartella condivisa: le modifiche fatte dentro si riflettono subito fuori. È veloce, ma se finisce in repo qualcosa di malevolo, il danno “persistente” è possibile.

Un’alternativa più cauta è lavorare in modalità **clone**:

- la sandbox clona il progetto al suo interno,
- le modifiche restano nella sandbox fino a quando non decidi di esportarle/applicarle,
- riduci il rischio di ritrovarti hook o file aggiunti “a sorpresa” nell’ambiente host.

È la stessa logica per cui, nelle operazioni delicate, conviene evitare di lavorare direttamente sulla working tree principale.

## Una strategia pratica per il frontend (senza paranoia)
Per un flusso di lavoro sostenibile, soprattutto in progetti JS/TS con tante dipendenze:

1. **Esegui agenti AI e comandi di install/build/test in sandbox su microVM**.
2. **Abilita una policy di rete non “open”** (bilanciata o restrittiva).
3. **Gestisci i token con secret proxy** (non login interattivi e non `.env` pieni di chiavi reali dentro l’ambiente).
4. **Per task ad alto rischio, preferisci modalità clone** e porta fuori solo le modifiche che hai revisionato.

## Sintesi e implicazione pratica
I container sono un ottimo strumento, ma non sono automaticamente una cintura di sicurezza per gli agenti AI. Se vuoi davvero lavorare senza continue richieste di permesso (e senza l’ansia che un comando sbagliato o un pacchetto NPM compromesso faccia danni), la combinazione vincente è:

- **microVM come perimetro**,
- **rete con policy**,
- **segreti fuori dall’ambiente via proxy**,
- e, quando serve, **workflow su clone** per evitare che modifiche malevole arrivino direttamente nella tua working directory.

Il risultato non è “zero rischio”, ma un rischio drasticamente ridotto, con un flusso di lavoro ancora veloce: esattamente ciò che serve quando l’AI passa da suggerire codice a eseguire azioni.
