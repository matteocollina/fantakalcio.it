---
title: "Quale progetto AI costruire per primo (e perché oggi può girare anche su mobile)"
subtitle: "Dal “fine-tuning” al vero prodotto: scegliere il primo use case con vincoli reali, e sfruttare la nuova ondata di modelli ultra-compressi"
description: "Se stai pensando di “insegnare” qualcosa a un modello, la domanda giusta non è quale architettura usare, ma cosa costruire per primo. In questo articolo metto ordine tra scelte pratiche (on-device vs cloud, qualità vs latenza, guardrail vs UX) e collego il tutto a un trend recente: modelli LLM compressi fino a 1 bit con kernel custom, abbastanza piccoli da girare su smartphone e perfino in WebGPU."
publishedAt: 2026-07-16
tags: ["quantizzazione LLM","on-device AI","WebGPU","kernels personalizzati","guardrail AI","frontend AI"]
---
Negli ultimi mesi è diventato molto più semplice *provare* un’idea con un LLM. La parte difficile è un’altra: trasformare l’esperimento in un prodotto affidabile.

Quando si parla di “insegnare” un modello, la tentazione è partire dal training. In pratica, conviene fare l’opposto: partire da ciò che vuoi costruire **e dai vincoli** (memoria, latenza, privacy, costi, sicurezza), e solo dopo decidere *quanto* addestramento o adattamento ti serve.

Di seguito una traccia concreta per scegliere **il primo progetto AI** da costruire, con un occhio specifico a chi lavora nel frontend.

---

## 1) Prima decisione: AI in cloud o on-device?
Questa è la biforcazione che determina tutto il resto.

### Cloud
**Pro:** qualità alta, contesto ampio, aggiornamenti immediati, toolchain matura.

**Contro:** latenza di rete, costi variabili, dipendenza da provider, gestione dati e compliance più delicata.

### On-device (mobile/desktop/browser)
**Pro:** privacy migliore (dati che non escono dal device), latenza più stabile, funziona offline, costi di inference a carico dell’utente (in molti scenari).

**Contro:** RAM/VRAM limitata, consumo energetico, contesti più piccoli, complessità nel deployment (modelli, runtime, accelerazione).

**Se non hai ancora un use case**, la scelta più sensata è: 
- **cloud** per prototipare velocemente;
- **on-device** se il valore del prodotto sta in privacy/offline/reattività (o se devi scalare evitando costi di inference).

---

## 2) Cosa costruire per primo: un “feature” con ROI, non un modello
Il primo progetto non dovrebbe essere “un modello addestrato”, ma una **feature** che:

1. ha un input chiaro (testo, log, screenshot, form);
2. ha un output verificabile (azione, suggerimento, classificazione);
3. può fallire senza rompere l’app (graceful degradation);
4. è misurabile con metriche semplici.

Esempi molto adatti a un team frontend:

- **Assistente di scrittura guidata** (non chat generica): genera micro-testi con template e validazioni (titoli, descrizioni, changelog). Output facilmente verificabile.
- **Classificazione locale** (intent, tag, routing): poche classi, risultati immediatamente testabili.
- **Riassunti “con vincoli”**: riassunto di un documento con lunghezza fissa, bullet obbligatori, terminologia controllata.
- **Guardrail UX**: rilevare contenuti “a rischio” e intervenire *prima* dell’invio (warnings, blocchi, richiesta di conferma).

La parola chiave è **vincoli**. Un’AI senza vincoli è una demo. Un’AI con vincoli è una feature.

---

## 3) Il trend che cambia le opzioni: modelli ultra-compressi (ternari e 1-bit)
Tradizionalmente un LLM “serio” richiede decine di GB in floating point (es. fp16). Per renderlo eseguibile su hardware consumer si ricorre alla **quantizzazione**, cioè rappresentare i pesi con meno bit (4-bit, 8-bit…).

La novità interessante è l’emergere di approcci ancora più aggressivi:

- **ternario** (valori tipo -1, 0, +1),
- addirittura **1-bit** (valori binari),

supportati da **kernel custom** che rendono praticabile l’inference con queste rappresentazioni estreme.

### Perché al frontend dovrebbe importare?
Perché abbassa drasticamente la soglia di:
- eseguire LLM **su smartphone**;
- eseguire modelli **nel browser** via **WebGPU**;
- costruire esperienze AI “reattive” senza roundtrip al server.

In questi approcci il compromesso tipico è un calo di qualità misurabile sui benchmark, ma con un vantaggio enorme in **footprint** (GB → pochi GB). E la memoria resta comunque influenzata dal **context size**: anche con modelli compressi, più contesto significa più RAM.

---

## 4) “Qualità vs peso”: come ragionare senza farsi ingannare dai benchmark
Quando scegli cosa costruire per primo, non fissarti sul numero di parametri o sul punteggio medio. Pensa a:

- **Qualità minima accettabile** per il tuo task (es. classificazione vs scrittura creativa).
- **Budget di latenza**: quanto può aspettare l’utente senza percepire frizione?
- **Budget di memoria**: quanto puoi permetterti su device reali (non sul tuo laptop)?
- **Degradazione controllata**: cosa succede se il modello fallisce?

Una regola pratica:

- per **task ristretti e verificabili** (tagging, routing, estrazione), modelli più piccoli/quantizzati spesso bastano;
- per **ragionamento lungo o generazione complessa**, il contesto e la qualità del modello contano molto di più.

---

## 5) Guardrail: non come “modello separato”, ma come parte del sistema
Un punto spesso sottovalutato è che la sicurezza non è solo un filtro a valle.

Se lavori on-device o con runtime personalizzati, puoi introdurre controlli a più livelli:

- **UI/UX guardrail**: copy, conferme, limiti su input/output.
- **Prompt e policy**: vincoli testuali, formati obbligatori.
- **Post-processing**: validazione schema, regex, controlli semantici.
- **Controlli più “bassi”** (quando disponibili): interventi sul runtime/operazioni (kernel, routing interno) per ridurre comportamenti indesiderati.

L’obiettivo del primo progetto dovrebbe essere un flusso in cui l’AI è utile **anche quando non è perfetta**, perché l’app la incanala.

---

## 6) Un percorso consigliato per il tuo “primo build”
Ecco una sequenza che funziona bene in un contesto prodotto:

1. **Definisci il task** in una frase e l’output atteso (con esempi reali).
2. **Scegli l’ambiente**: cloud per prototipo o on-device se privacy/offline sono requisito.
3. **Prototipa con dataset minimo** (50–200 esempi reali) e metriche semplici.
4. **Aggiungi vincoli**: schema di output, validazioni, fallback.
5. **Valuta compressione/quantizzazione** solo quando il flusso è chiaro.
6. **Test su device reali** (RAM, calore, battery, crash rate).

Questo ti evita il classico errore: investire settimane su training/ottimizzazioni prima di sapere se la feature sta in piedi.

---

## Sintesi e implicazione pratica
Il primo progetto AI da costruire non è “un modello”, ma una feature con input/output verificabili, vincoli chiari e fallback. La scelta cloud vs on-device viene prima del resto, e oggi l’on-device è più realistico grazie a modelli sempre più compressi (fino a varianti ternarie e 1-bit con kernel custom), che aprono la porta a esperienze AI su mobile e WebGPU.

Se costruisci il sistema attorno al task (vincoli, UX, guardrail) e solo dopo ottimizzi il modello, il salto da demo a prodotto diventa molto più breve.
