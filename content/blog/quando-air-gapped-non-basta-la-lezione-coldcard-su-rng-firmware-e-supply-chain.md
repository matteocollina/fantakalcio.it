---
title: "Quando “air‑gapped” non basta: la lezione Coldcard su RNG, firmware e supply chain"
subtitle: "Un bug minuscolo nella scelta del generatore casuale ha reso predicibili migliaia di seed phrase. E il recupero fondi ha esposto un’altra fragilità: il mempool come campo di battaglia."
description: "Un attacco ha svuotato migliaia di wallet Bitcoin legati a un firmware che, per anni, ha generato seed phrase con un RNG debole e deterministico. Ricostruiamo cosa è andato storto (ombre di MicroPython, flag “definiti ma a zero”, API con lo stesso nome) e perché la fase di “salvataggio” si è trasformata in un’asta a colpi di fee nel mempool. Una storia che parla meno di crypto e molto di ingegneria del software: test, invarianti, audit e confini tra librerie."
publishedAt: 2026-08-05
tags: ["sicurezza-firmware","random-number-generator","microcontrollori","mempool-fee","bug-critici","supply-chain"]
---
Negli ultimi anni le hardware wallet “security‑obsessed” hanno venduto un’idea semplice: se generi e custodisci le chiavi offline, con un dispositivo dedicato e un buon generatore di entropia, stai facendo *la cosa giusta*. L’incidente che ha coinvolto Coldcard (wallet hardware noto per l’approccio air‑gapped e l’attenzione alla sicurezza) ha dimostrato quanto questa promessa dipenda da dettagli software apparentemente banali: una funzione chiamata nel punto sbagliato, un flag impostato “quasi” correttamente, un fallback silenzioso.

Il risultato è stato devastante: migliaia di wallet compromessi e fondi drenati in poco tempo, senza malware sul PC dell’utente, senza phishing, senza “errori stupidi” da attribuire alle vittime. È una storia utile per chiunque costruisca prodotti: frontend, backend, mobile o embedded. Perché al centro non c’è Bitcoin, ma un classico problema di ingegneria: **credi di usare un componente sicuro, ma in produzione ne stai usando un altro**.

---

## Seed phrase e perché l’entropia è tutto
La proprietà critica di un wallet non è “essere offline”, ma **generare chiavi imprevedibili**.

In Bitcoin il controllo dei fondi deriva da una chiave privata, spesso rappresentata all’utente come *seed phrase* (tipicamente 12 parole). Se qualcuno può indovinare o ricostruire quella seed, ha i tuoi Bitcoin.

Una seed correttamente generata ha un livello di entropia tale da rendere l’attacco a forza bruta impraticabile: anche con potenze di calcolo enormi, il numero di combinazioni è astronomico.

Le hardware wallet esistono proprio per questo:

- generare la seed in un ambiente isolato (offline)
- usare un chip e/o una fonte di entropia fisica per ottenere casualità reale
- ridurre la superficie d’attacco del sistema operativo generale (PC/telefono)

Tutto questo, però, funziona solo se **la casualità “buona” viene davvero usata**.

---

## Il problema: due RNG, stesso nome, scelta sbagliata
Il nodo tecnico dell’incidente è un pattern che chi scrive software riconosce subito: *namespace collision + controllo “if not defined” ingannevole*.

### Lo scenario (semplificato)
- Il firmware gira in un contesto basato su MicroPython.
- MicroPython include un proprio RNG “di base”, adatto a compiti generici ma non all’uso crittografico.
- Il produttore, consapevole del problema, implementa un RNG più robusto, pensato per la generazione di chiavi.
- Per disabilitare l’RNG di MicroPython viene impostato un flag a `0`.

Fin qui sembra ragionevole. Il guaio è nella risoluzione della funzione RNG usata dalla libreria crypto:

- entrambi gli RNG espongono una funzione con lo **stesso nome**
- la libreria decide quale usare con un controllo del tipo **“se non è definito, allora…”**
- ma un valore `0` è “definito” dal punto di vista di quel controllo, quindi il fallback/non‑fallback si comporta al contrario di quanto atteso

In pratica: il sistema ha continuato a generare seed con l’RNG *debole*.

### Perché l’RNG “debole” era devastante su bare metal
Su un microcontrollore senza sistema operativo non hai a disposizione molte fonti “pronte” di entropia. Se un RNG non è progettato per estrarre casualità dal mondo fisico (rumore elettronico, TRNG, jitter misurato con criteri robusti…), finisce per “inventarsi” numeri pseudo‑casuali usando valori deterministici.

Qui l’RNG avrebbe derivato l’output da elementi come:

- seriale del chip
- timer / contatori

Cose che non sono segrete e/o sono enumerabili. Il salto concettuale è enorme:

- da “indovina una seed da uno spazio 2^128”
- a “itera tutte le combinazioni plausibili di seriali e tempi e ricostruisci le chiavi”

Non serve compromettere il PC dell’utente. Non serve ingannarlo. **Serve solo enumerare**.

---

## L’attacco: drenaggio automatico su larga scala
Una volta che la generazione delle seed è predicibile, l’attaccante può:

1. ricostruire seed candidate a partire da seriali/timing
2. derivare gli indirizzi pubblici
3. confrontarli con la blockchain per trovare indirizzi con saldo
4. firmare transazioni di spostamento fondi e svuotare i wallet

È l’aspetto più inquietante: **l’attacco scala bene**. Non è una rapina mirata: è raccolta industriale.

---

## Il “recupero” e l’asta nel mempool: quando la trasparenza diventa un problema
C’è un secondo capitolo interessante, che riguarda la gestione post‑incidente.

In Bitcoin non esiste un “reset password”. Se una chiave è compromessa, l’unico modo per mettersi in sicurezza è:

- generare una nuova seed (questa volta con entropia corretta)
- spostare i fondi con una transazione on‑chain

Peccato che le transazioni, prima di finire in un blocco, restino visibili nel **mempool**. Se l’attaccante controlla già le chiavi di un indirizzo compromesso, può osservare il tentativo di “rescue” e reagire:

- crea una transazione concorrente che spende gli stessi UTXO
- imposta una fee più alta
- i miner includono la transazione più conveniente

Il risultato è un paradosso operativo: le vittime finiscono per **competere in tempo reale** con l’attaccante a colpi di fee.

### L’unica strategia praticabile: bypassare il mempool pubblico
Per evitare che un bot “veda” la transazione di salvataggio e la rimpiazzi, la via più efficace diventa inviarla direttamente a un mining pool (o a un canale privato), così che venga minata senza passare dal mempool pubblico.

È una lezione scomoda per chi ama le architetture “trustless”: in emergenza, spesso il playbook migliore è **un canale centralizzato e coordinato**.

---

## Lezioni di ingegneria (valide anche per chi fa frontend)
Anche se non tocchi firmware o crittografia, questo caso è un promemoria su alcuni principi che nel software moderno tornano ovunque.

### 1) “Defined vs truthy” è una trappola ricorrente
Il bug nasce da una distinzione semantica che in JavaScript conosciamo bene:

- `defined`/`undefined` non coincide con `truthy`/`falsy`
- un valore può essere definito ma falsy (`0`, `""`, `false`)

Quando quella differenza governa un ramo critico (selezione di un RNG, scelta di un provider, fallback di sicurezza), serve un’invariante esplicita, non un controllo implicito.

### 2) Collisioni di API: stesso nome, significati diversi
Due moduli che esportano una funzione con lo stesso nome possono sembrare intercambiabili, ma non lo sono.

- nomi chiari e namespacing rigoroso
- import espliciti (evitare lookup “magici”)
- test che verificano *quale* implementazione è in uso

### 3) Il fallback “silenzioso” è spesso un anti‑pattern di sicurezza
In sicurezza, fallire “in modo comodo” è pericoloso.

Se il componente sicuro non è disponibile, la scelta più sicura è spesso:

- **fail closed** (bloccare l’operazione)
- loggare/telemetria forte
- rendere l’errore impossibile da ignorare

### 4) La trasparenza operativa può diventare un vettore d’attacco
Un mempool pubblico è utilissimo per l’osservabilità, ma in scenari di key compromise diventa anche una superficie dove l’avversario gioca con informazioni perfette e reazioni automatiche.

---

## Conclusione: sicurezza “per design” significa verificare l’esecuzione, non l’intenzione
La parte più amara di questa storia è che la progettazione “sulla carta” era corretta: air‑gapped, entropia hardware, attenzione maniacale. Ma il sistema reale ha eseguito un percorso diverso per anni, senza che nessuno se ne accorgesse.

L’implicazione pratica è netta: **nei punti critici bisogna testare l’invariante, non il comportamento atteso**. Se stai generando chiavi, non basta “avere un RNG robusto nel codice”: devi poter dimostrare che è quello effettivamente invocato, che non esistono fallback insicuri e che ogni aggiornamento di librerie/VM non può cambiare la risoluzione delle funzioni in modo implicito.

In sicurezza, la differenza tra “sembra giusto” e “sta girando giusto” è esattamente lo spazio in cui succedono i disastri.
