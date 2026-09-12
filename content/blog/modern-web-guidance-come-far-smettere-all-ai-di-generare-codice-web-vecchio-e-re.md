---
title: "Modern Web Guidance: come far smettere all’AI di generare codice web “vecchio” (e renderlo davvero compatibile)"
subtitle: "Un approccio pratico per aggiornare workflow AI-assisted con best practice, feature nuove e target Baseline misurabili."
description: "Quando usi un agente AI per sviluppare frontend, il rischio è ottenere soluzioni datate, workaround inutili o consigli di compatibilità generici. Modern Web Guidance nasce per colmare questo gap: un set di guide “expert-vetted” che l’agente può recuperare al bisogno, in base al tuo prompt, includendo strategie di fallback in funzione del target Baseline del progetto. Vediamo come funziona e come applicarlo a refactor, performance e nuove feature."
publishedAt: 2026-07-02
tags: ["baseline web","performance frontend","lighthouse audit","css selectors moderni","ai coding workflow"]
---
Negli ultimi mesi mi è capitato spesso di vedere lo stesso film: chiedo a un agente AI di implementare una feature web “moderna” e mi ritrovo con codice che sembra scritto per un web di qualche anno fa. Funziona *quasi*, ma poi emergono i soliti problemi: pattern legacy, compatibilità gestita “a caso”, workaround in JavaScript dove oggi basterebbe CSS, e soprattutto soluzioni che non rispettano un requisito fondamentale: **il target reale di browser support del progetto**.

Per ridurre questo scarto tra ciò che il web offre oggi e ciò che l’AI tende a proporre, sta prendendo forma un’idea interessante: **Modern Web Guidance**. Non è “un altro modello”, ma un insieme di guide tecniche che l’agente può consultare **in modo mirato**, quando serve, e con un principio chiave: **ogni raccomandazione è legata a Baseline e include fallback quando necessario**.

Di seguito trovi una panoramica concreta di come ragionare con Modern Web Guidance in un workflow quotidiano: refactor di legacy, ottimizzazioni performance misurabili e introduzione di nuove UX senza compromettere compatibilità e manutenzione.

---

## Il problema reale: l’AI conosce il web “com’era”, non sempre “com’è”

I modelli generalisti sono fortissimi nel ricombinare pattern noti, ma soffrono su due fronti:

1. **Raccomandano soluzioni legacy** anche quando esistono alternative più pulite, native e performanti.
2. **Hanno punti ciechi sulle feature recenti**: spesso sbagliano dettagli d’implementazione o evitano del tutto l’approccio moderno.

Il risultato è tipico: codice più lungo del necessario, più fragile, e pieno di compatibilità “a sentimento” (la classica lista di browser support generica, che non considera i requisiti del tuo progetto).

Un esempio perfetto è l’evoluzione di alcune capacità CSS. In passato, per cambiare lo stile di un “gruppo” quando un input interno era invalido, finivi per fare toggle di classi via JavaScript. Oggi, in molti casi, puoi usare direttamente **`:has()`** per esprimere la relazione in CSS. È un salto enorme in chiarezza e manutenzione, ma se il modello non è aggiornato, continuerà a proporre JS e classi di appoggio.

---

## Cos’è Modern Web Guidance (in pratica)

Modern Web Guidance si può descrivere così:

- un set di **guide verificate da esperti** (best practice e feature-specific)
- pensate per essere **recuperate on-demand** dall’agente
- con un focus esplicito su **Baseline** e strategie di fallback.

La parte interessante non è solo “avere linee guida”, ma **come entrano nel flusso**:

### 1) Due livelli di guida
- **Guide ad alto livello**: performance, sicurezza, UX, ecc.
- **Guide a basso livello**: feature web recenti dove spesso l’AI sbaglia (o non osa).

### 2) Recupero semantico locale
Quando invii un prompt, l’agente esegue una **ricerca semantica locale** nel bundle di guide.
- Se trova corrispondenze, le aggiunge al contesto e genera una risposta “aggiornata”.
- Se non trova match, l’agente procede normalmente.

Questa scelta è importante perché evita il classico errore dei “mega prompt” dove carichi troppe regole e saturi il contesto.

### 3) Baseline come contratto di compatibilità
Ogni guida contiene:
- implementazione ideale (moderna)
- fallback quando la feature non è **Baseline widely available**

In più, l’agente può adattare le scelte in base al target che dichiari nel progetto (tipicamente tramite un file di configurazione come `agents.md`).

---

## Un caso d’uso concreto: rifare ordine in un progetto legacy

Immagina una piccola app “legacy” (classico progetto didattico con HTML/CSS/JS sparsi, una manciata di moduli e qualche scelta discutibile fatta anni fa). Il punto non è l’app in sé, ma il metodo.

### Step 1: misurare prima di toccare
Prima di refactorare “a naso”, conviene fare un audit e farsi guidare dai colli di bottiglia reali:

- **FCP / LCP** fuori target
- risorse bloccanti (CSS, font)
- immagini caricate in modo subottimale

Se nel workflow usi strumenti automatizzabili, l’ideale è far girare Lighthouse e produrre un report ripetibile, così puoi:

- confrontare il prima/dopo
- evitare ottimizzazioni “placebo”

### Step 2: sistemare LCP con priorità di caricamento immagini
Uno dei problemi più comuni nelle app legacy è la hero image:
- viene iniettata via JavaScript
- arriva tardi
- “salta” nel layout

Una correzione moderna e spesso immediata è:

- riportare l’immagine nel markup (quando sensato)
- usare `fetchpriority="high"` sulla risorsa critica
- specificare dimensioni (`width`/`height`) o strategie equivalenti per ridurre layout shift

Non è magia: è dare al browser segnali chiari su cosa caricare *subito*.

### Step 3: eliminare fallback non più necessari (quando Baseline lo consente)
Molti progetti si portano dietro anni di “compat layer”:
- mapping di stati
- classi CSS duplicate
- JS per gestire casi che oggi non esistono più

Se una feature è diventata **Baseline widely available**, puoi:
- togliere rami condizionali e polyfill artigianali
- semplificare CSS
- ridurre JS e superficie di bug

È qui che Baseline diventa uno strumento operativo: ti permette di dire con sicurezza *“questo workaround non mi serve più”* senza rompere l’esperienza su browser importanti.

---

## Aggiungere UX moderna senza compromettere il support: esempio “swipe to remove”

Un’ottima prova per un workflow AI-assisted è introdurre una UX mobile semplice ma non banale, tipo:

- nel carrello puoi rimuovere singoli prodotti
- su mobile vuoi anche “swipe to remove”

Qui la qualità della guida fa la differenza: senza un riferimento aggiornato, l’agente tende a:
- inventare gesture handling fragile
- ignorare accessibilità
- produrre codice non coerente con i pattern moderni

Con guide mirate, invece, ti aspetti che l’implementazione:

- definisca un comportamento base robusto (click/tap “Rimuovi”)
- aggiunga l’interazione swipe come enhancement
- rimanga testabile, accessibile e coerente con il target Baseline

Il punto non è *solo* ottenere l’effetto, ma farlo senza introdurre un nuovo “debito UX”.

---

## La parte che conta davvero: trasformare ogni prompt in una scelta tecnica tracciabile

La promessa di Modern Web Guidance non è “scrivere codice al posto tuo”. È una cosa più utile:

- ridurre l’entropia del codice generato
- ancorare le decisioni a best practice aggiornate
- legare compatibilità e fallback a un requisito esplicito (Baseline)

In un contesto reale, questo significa:

- **meno workaround inutili**
- **più performance misurabile** (audit prima/dopo)
- **più coerenza architetturale** anche quando chiedi interventi piccoli e incrementali

---

## Sintesi operativa

Se oggi usi un agente AI per fare frontend e ti ritrovi spesso con output “datati”, il cambio di passo è introdurre un livello di guida moderno e *contestuale*.

Una routine efficace è:

1. definire il target di support (Baseline) del progetto
2. misurare con audit ripetibili (Lighthouse) prima di intervenire
3. applicare fix moderni dove hanno impatto (LCP, font, risorse bloccanti)
4. rimuovere fallback non più necessari quando il support lo consente
5. aggiungere UX come enhancement, mantenendo un comportamento base solido

Quando questo processo diventa automatico anche nei prompt quotidiani, l’AI smette di essere una scorciatoia incerta e diventa un moltiplicatore di qualità: meno codice, più compatibilità reale, più performance verificabile.
