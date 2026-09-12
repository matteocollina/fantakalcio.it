---
title: "Agent Skills: come usarle davvero bene (e quando NON servono)"
subtitle: "Non sono solo file .md: sono strumenti modulari per colmare gap di conoscenza ed esecuzione, senza inquinare il contesto."
description: "Le agent skills vengono spesso trattate come “prompt salvati”, ma il loro valore emerge quando diventano strumenti modulari: descrizione per l’attivazione, corpo snello e operativo, riferimenti/asset/script quando serve. In questo articolo vediamo tipologie, struttura, best practice, dove metterle (global vs progetto) e come distinguerle da agents.md/claude.md."
publishedAt: 2026-07-23
tags: ["agent-skills","prompt-engineering-operativo","coding-agent-workflow","skills-modulari","agents-md"]
---
Le *agent skills* finiscono spesso in due estremi ugualmente improduttivi:

- una collezione di file `.md` lunghi e generici che nessun agente usa davvero bene;
- oppure micro-prompt duplicati ovunque, ripetuti a mano ogni volta che serve.

L’uso “giusto” sta nel mezzo: una skill è uno **strumento riutilizzabile** che l’agente può attivare *quando serve*, per ottenere **conoscenza mirata** o **comportamenti ripetibili**.

Di seguito trovi un modo pratico e sostenibile per progettare skills che funzionano davvero, senza bruciare token inutilmente e senza degradare le performance dell’agente.

---

## Una skill non è (solo) un file `skill.md`
Il formato più comune è un file Markdown con:

1. **metadati/descrizione**: servono a far capire *quando* la skill va attivata;
2. **istruzioni operative**: quello che, di fatto, verrà “iniettato” nel contesto quando la skill viene usata.

Il punto chiave è che una skill efficace non è necessariamente solo testo.

### Skill “espandibili”: riferimenti, asset e script
Oltre alle istruzioni, una skill può includere:

- **References**: link e risorse di approfondimento da consultare solo se necessario (ottimo per la *incremental discovery*).
- **Assets**: template, blueprint, checklist, schemi di output. Esempio tipico: un *plan blueprint* che impone una struttura standard ai piani.
- **Scripts**: automazioni deterministiche (TypeScript, bash, ecc.) che l’agente può invocare per eseguire una parte “meccanica” del lavoro.

Questa combinazione è spesso il “sweet spot”:
- **la skill** gestisce la parte ambigua (tradurre un obiettivo vago in istruzioni precise, decidere parametri, scegliere un percorso);
- **lo script** gestisce la parte deterministica (chiamate API, parsing risposte, salvataggi su disco, scaffolding ripetibile).

Se ti stai chiedendo “non basterebbe solo lo script?”, la risposta pratica è: **dipende da quanta interpretazione serve**. Se c’è anche solo un minimo di traduzione tra intento umano e input macchina, skill+script spesso battono “solo script”.

---

## A cosa servono davvero: colmare due tipi di gap
Le skills hanno due funzioni principali.

### 1) Knowledge gap: quando al modello manca conoscenza affidabile
I modelli hanno conoscenza “di base” dal training, più tutto ciò che gli dai in contesto (repository, prompt, ricerca). Ma ci sono aree dove conviene consolidare una base stabile:

- librerie o framework di nicchia;
- pattern interni aziendali;
- convenzioni di progetto;
- API particolari e poco presenti nei dataset.

Qui una skill funziona come una **capsula di conoscenza**: evita di rifare ricerche ogni volta e riduce gli errori “da memoria probabilistica”.

### 2) Execution gap: quando vuoi un modo *specifico* di lavorare
Anche quando l’agente “sa” cosa fare, il *come* può variare molto. Le skills sono perfette per rendere ripetibili flussi come:

- creare piani con una struttura fissa;
- fare code review con criteri e severità coerenti;
- spezzare task e delegare a sub-agent;
- applicare regole anti-complessità;
- imporre vincoli editoriali (“risposte brevi”, “niente fallback/legacy code”, ecc.).

Un segnale chiarissimo che ti serve una skill: **ripeti le stesse istruzioni** o **correggi sempre gli stessi errori**.

---

## Quattro tipologie utili (che spesso si sovrappongono)
Una tassonomia pratica:

1. **Domain knowledge skills**: conoscenza specifica di una libreria/stack/progetto.
2. **Workflow skills**: step ripetibili (pianificazione, review, debugging strutturato).
3. **Companion skills**: spiegano all’agente come usare un tool (CLI, pipeline, sub-agent manager, script interno).
4. **Executables**: workflow guidati con asset + script + decisioni (setup ambienti, hardening, scaffolding avanzato).

Non fissarti sulle etichette: ti servono solo per capire *che forma* dare alla skill (più testo? più template? più script?).

---

## Come scrivere skills che si attivano e non “inquinano”
Una skill mediocre è lunga, vaga e autoreferenziale. Una skill buona è breve, attivabile e operativa.

### 1) Descrizione: la parte più importante
La descrizione deve essere:

- **specifica** (trigger chiari: “quando l’utente chiede un piano”, “quando devi fare review”, “quando tocchi X libreria”);
- **riconoscibile** (sinonimi e frasi che usi davvero nei tuoi prompt);
- **non ambigua** (meglio pochi casi coperti bene che mille casi coperti male).

Se la descrizione non è ottima, l’agente non attiva la skill (o la attiva a sproposito).

### 2) Corpo: lean, a bullet point, zero prosa
Preferisci:

- checklist;
- regole numerate;
- template di output;
- “do / don’t”.

Evita documenti lunghi “da manuale”: costano token e, peggio, **sporcano il contesto**. Più contesto ≠ più qualità, spesso è il contrario.

### 3) Evoluzione continua (non collezionismo)
Le skills non sono statiche:

- cambiano i modelli (verbose, aggressivi, troppo “creativi”, ecc.);
- cambiano gli agent harness (tool disponibili, system prompt impliciti);
- cambi tu e cambia il tuo workflow.

Risultato: una skill “installata sei mesi fa” potrebbe essere già subottimale. Va potata, aggiornata, o rimossa.

Un approccio efficace è introdurre una routine: quando noti correzioni ripetute, **aggiorna la skill**. L’obiettivo non è avere tante skills: è avere **poche skills eccellenti**.

---

## Globali o per-progetto? Una regola semplice
Ogni skill ha un “costo fisso”: almeno i metadati/descrizione finiscono spesso caricati nelle sessioni. Troppe skills globali possono peggiorare le performance.

Quindi:

- **Global skill** se il comportamento è trasversale (es. creare piani, stile di review, utility come generare asset).
- **Project skill** se è utile solo in quel repo (es. conoscenza di una libreria usata solo lì, convenzioni interne specifiche).

In generale: *spingi tutto ciò che puoi nel progetto* e mantieni globali solo le skill davvero universali.

---

## Skills vs `agents.md` / `claude.md`: cosa va dove
Una distinzione pratica e molto efficace:

- **`agents.md` / `claude.md`**: regole *sempre vere*, che non vuoi “sperare” vengano attivate.
  - Esempi: “mantieni le risposte brevi”, “non aggiungere fallback/legacy”, “non stratificare senza rimuovere codice morto”.

- **Skills**: strumenti che servono *spesso ma non sempre*.
  - Esempi: “come fare una plan review”, “come delegare a sub-agent”, “come strutturare un piano”, “come usare un CLI specifico”.

Se una regola deve valere in ogni singola sessione, mettila nel file di istruzioni globali. Se invece è un tool situazionale, falla diventare skill.

---

## Sintesi operativa
Un buon sistema di agent skills non è una libreria di prompt: è una cassetta degli attrezzi.

- Usa le skills per colmare **knowledge gap** e **execution gap**.
- Progettale come moduli: **descrizione attivabile + corpo snello**.
- Quando serve, aggiungi **references**, **asset** (template) e **script** (determinismo).
- Mantieni poche skill globali, il resto nel progetto.
- Metti in `agents.md`/`claude.md` solo regole universali, non “tool”.

Se l’agente sbaglia sempre nello stesso modo o ti costringe a ripetere sempre la stessa istruzione, non è un problema “di prompt”: è un candidato perfetto per una skill ben scritta e mantenuta.
