---
title: "TanStack Intent: buona idea, integrazione fragile (e come fare meglio senza “magia”)"
subtitle: "Bundlare le “skills” nei pacchetti è sensato. Generarle e copiarle via prompt dentro agents.md molto meno."
description: "TanStack Intent prova a risolvere un problema reale: tenere allineate versione di una libreria e “skills” usate dagli agent. L’approccio, però, introduce attrito, rischi di sincronizzazione e superfici di attacco evitabili. Vediamo cosa funziona, cosa scricchiola e una strategia più robusta: referenziare direttamente le skills dai node_modules tramite configurazione esplicita, senza copia-incolla e senza file generati non deterministici."
publishedAt: 2026-07-21
tags: ["tanstack-intent","skills-ai","agents-md","sicurezza-supply-chain","node-modules"]
---
## Il problema reale: versioni allineate tra libreria e “skills”
Chi lavora con agent e automazioni basate su “skills” (file/manifest che descrivono capacità e comandi) conosce bene il dolore: installi una libreria, poi devi procurarti anche le skills “giuste” per quella stessa libreria, e il rischio di mismatch di versione è costante.

L’idea di **spedire le skills insieme al pacchetto** (dentro `node_modules`) è, concettualmente, eccellente:

- aggiornando la libreria, si aggiornano anche le skills;
- la libreria diventa la **single source of truth**;
- il consumer non deve “cercare” file in giro.

TanStack Intent nasce proprio con questa ambizione. Il punto è *come* prova a chiudere il cerchio.

---

## L’approccio di Intent lato consumer: generare `agents.md` con un prompt
Nel flusso tipico, l’installazione di Intent si traduce in un’operazione che:

1. scandisce `node_modules` alla ricerca di skills;
2. produce (o aggiorna) una sezione dentro un file tipo `agents.md` con riferimenti a quelle skills.

Sulla carta è comodo. Nella pratica introduce tre problemi strutturali.

### 1) `agents.md` diventa un “registro” rumoroso e facile da invecchiare
Il file si riempie di riferimenti e descrizioni. Il risultato è spesso un documento che:

- cresce velocemente con l’aumentare delle dipendenze;
- diventa difficile da leggere e mantenere;
- soprattutto **non si aggiorna da solo** quando cambiano le skills nel pacchetto.

Se la libreria aggiunge/rimuove/rinomina una skill, tu devi rigenerare manualmente la sezione. È la stessa dinamica che rende la documentazione “driftare” rispetto al codice.

### 2) La generazione via LLM non è deterministica
Quando in mezzo metti un modello generativo, la riproducibilità ne risente. Anche con istruzioni “rigide”, è facile ottenere:

- descrizioni diverse a parità di input;
- omissioni;
- errori di formattazione;
- riferimenti incompleti.

Per un workflow che dovrebbe garantire allineamento e affidabilità, è una base poco solida.

### 3) Skills “in due posti”: mental model più complesso
Nel momento in cui le skills sono:

- *fisicamente* in `node_modules`,
- ma *logicamente* “attivate” tramite `agents.md`,

ti ritrovi con un doppio livello di indirection. In molti setup questo rende più difficile:

- scoprire quali skills sono davvero disponibili;
- usare autocomplete o tooling nativo;
- capire cosa è caricato nell’ambiente dell’agent.

In alcuni casi finisci per dover caricare a mano una skill specifica con un comando ad-hoc, perdendo gran parte dell’ergonomia.

---

## Un rischio spesso sottovalutato: injection di skills malevole
C’è poi un tema di **supply chain**.

Se un pacchetto viene compromesso e pubblica “skills” in un formato atteso dal tooling, un flusso che:

- scansiona automaticamente `node_modules`,
- e importa/genera riferimenti in un file operativo dell’agent,

aumenta la probabilità che contenuti malevoli entrino nel percorso di esecuzione o nelle decisioni dell’agent.

Questo non significa che “non si debbano usare skills”, ma che **la selezione deve essere esplicita** e verificabile.

---

## L’alternativa più robusta: referenziare direttamente le skills in `node_modules`
La soluzione pragmatica è mantenere la parte migliore dell’idea (skills “ship” con la libreria), eliminando il passaggio fragile (copia/generazione in `agents.md`).

In altre parole:

- **lascia le skills dove sono** (`node_modules/<pkg>/...`),
- **configura l’agent** per caricare *solo* le skills che vuoi da quei percorsi.

Vantaggi immediati:

- **zero drift**: stai puntando alla fonte; aggiornare la libreria aggiorna anche ciò che l’agent vede;
- **selezione esplicita**: carichi solo i pacchetti che autorizzi;
- **meno rumore**: niente file “indice” generati e da rigenerare;
- **workflow più naturale**: le skills si comportano come skills, non come testo incollato in un markdown.

### Esempio di approccio (concettuale)
Molti tool/agent harness permettono di definire in configurazione una lista di percorsi (o glob) da cui caricare skills. L’idea è:

- creare una cartella di configurazione nel progetto;
- dichiarare i path delle skills dentro `node_modules` delle librerie rilevanti;
- restringere se serve a una sottocartella specifica (es. `/skills`).

Il dettaglio del file e della sintassi cambia in base all’agent che usi, ma il pattern resta identico: **non copiare, referenzia**.

---

## Lato maintainer: scaffolding utile, ma attenzione alle scelte opinionate
TanStack Intent include anche un flusso per chi mantiene una libreria: uno scaffolding che analizza il repository e propone skills iniziali.

Qui l’uso dell’AI ha più senso: non stai cercando determinismo perfetto, stai cercando un *boilerplate intelligente* da rifinire.

Detto questo, alcuni aspetti possono risultare eccessivamente opinionati:

- modifica di metadati nel `package.json` (keyword e simili);
- settaggi o convenzioni di repository (es. etichette per issue) che non tutti vogliono adottare;
- output che non sempre rispetta le convenzioni più sane per naming e struttura delle skills.

### Best practice pratica per le skills di una libreria
Se pubblichi skills insieme al tuo pacchetto, punta a:

- **nomi coerenti e standardizzati** (evita separatori inconsueti o pattern poco portabili);
- **descrizioni orientate all’intento** (quando usarla e perché, non la lista dei file interni);
- **struttura prevedibile** (una skill “root” e riferimenti chiari, invece di proliferazione confusa di sub-skill);
- **documentazione minima ma verificabile** (pochi esempi reali, versionati insieme al codice).

---

## Sintesi: l’idea è giusta, l’attivazione deve essere esplicita
Bundlare skills e libreria è un’ottima direzione: riduce mismatch e migliora la DX. Il punto debole nasce quando si prova a “sincronizzare” tutto tramite generazione di testo in `agents.md`.

La strategia più solida è **caricare le skills direttamente dai path in `node_modules` tramite configurazione**, autorizzando esplicitamente le librerie desiderate. Risultato: meno manutenzione, meno drift, meno sorprese e una superficie di rischio più controllabile.

Se l’obiettivo è affidabilità operativa, la regola è semplice: **evita i duplicati e punta sempre alla fonte di verità**.
