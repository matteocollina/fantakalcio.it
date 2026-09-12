---
title: "WebMCP: strumenti strutturati per far capire (davvero) le intenzioni complesse agli agenti"
subtitle: "Un approccio proposto per ridurre l’ambiguità tra DOM, screenshot e accessibility tree, esponendo “tool” richiamabili in modo affidabile."
description: "Quando un flusso utente diventa articolato (ricerca, filtri, preferenze, checkout), per un agente automatizzato ricostruire un piano d’azione solo da UI e semantica della pagina può diventare fragile. WebMCP propone di standardizzare l’esposizione di strumenti strutturati direttamente dai siti, così che l’agente possa invocare azioni esplicite con input validati, invece di “indovinare” clic e selettori."
publishedAt: 2026-06-01
tags: ["WebMCP","agenti AI","API del browser","accessibilità","HTML forms"]
---
Gli agenti che navigano il web oggi fanno un lavoro simile a quello di un utente: osservano la pagina, interpretano layout e componenti, leggono il DOM e l’accessibility tree, poi provano a trasformare tutto in una sequenza di azioni (clic, input, submit, navigazione).

Finché l’intento è semplice—tipo “apri il carrello”—spesso funziona. Ma appena il percorso si complica (ricerca + filtri + preferenze + passi intermedi), quel modello diventa fragile: aumenta la quantità di segnali da combinare e cresce il rischio di ambiguità.

## Perché le intenzioni complesse sono difficili
Un utente umano porta con sé un “modello mentale” delle interfacce: sa che login e account stanno spesso in alto a destra, che la ricerca è in alto o al centro, che i filtri sono laterali, ecc. Inoltre sa adattarsi se un dettaglio cambia.

Un agente, invece, deve **sintetizzare segnali eterogenei**:

- struttura e stati del **DOM**
- informazioni dell’**accessibility tree**
- indizi **visivi** (layout, screenshot, posizione degli elementi)

Quando il flusso include preferenze e vincoli (es. “hotel con palestra e colazione, con late checkout”), le varianti esplodono: più step, più pagine, più componenti, più possibilità di errore. Il risultato è un’interazione più lenta e meno affidabile.

## L’idea di WebMCP: esporre “tool” strutturati
WebMCP è una proposta di standard web che punta a ridurre questa complessità permettendo ai siti di **esporre strumenti strutturati** direttamente agli agenti.

In pratica, invece di costringere l’agente a dedurre che:

- deve trovare un certo pulsante
- compilare un certo form
- selezionare una variante
- cliccare “Aggiungi al carrello”

…il sito può offrire un **tool esplicito** come `addToCart`, con input definiti e un’esecuzione chiara.

Esempio concettuale: se l’utente vuole “aggiungere una pizza specifica al carrello”, l’agente non deve più interpretare tutta la UI per arrivarci. Può invocare il tool con parametri strutturati (id prodotto, quantità, variante, extra), lasciando al sito la responsabilità di applicare l’azione corretta.

## Benefici attesi
L’approccio è interessante perché sposta il baricentro da “capire la UI” a “chiamare capacità”. Questo tende a portare:

- **maggiore affidabilità** (meno dipendenza da selettori e layout)
- **maggiore velocità** (meno esplorazione/riconciliazione dei segnali)
- **minore ambiguità** (input e output descritti e validabili)
- **migliore evolvibilità** (cambi UI con tool stabili)

Detto in modo semplice: è un tentativo di dare agli agenti una “API di interazione” standard, senza obbligare i siti a riscrivere tutto.

## Come si definiscono i tool: imperativo o dichiarativo
WebMCP prevede due modalità per definire questi strumenti.

### 1) Modalità imperativa (JavaScript)
Qui il sito registra un tool via API, fornendo metadati e logica di esecuzione.

Gli ingredienti tipici di un tool sono:

- **name**: identificatore del tool
- **description**: testo che aiuta a capire quando usarlo
- **input schema**: schema dei parametri accettati (e quindi validabili)
- **execute**: funzione che implementa cosa succede quando l’agente invoca il tool

L’idea chiave è che i parametri passati a `execute` **derivano dallo schema di input**: questo rende l’invocazione più robusta e meno soggetta a interpretazioni.

A livello di API, il pattern mostrato è del tipo:

- registrazione tramite qualcosa come `navigator.modelContext.registerTool(...)`
- definizione del tool con metadati + `execute(params)`

> Nota pratica: questo approccio assomiglia molto a definire “capabilities” formalizzate. È un salto di qualità rispetto a macro di automazione basate su click e querySelector.

### 2) Modalità dichiarativa (HTML forms)
In alternativa, è possibile esporre tool in modo **dichiarativo** aggiungendo attributi specifici ai form HTML.

Questo è particolarmente interessante per flussi già centrati sui form (ricerca, prenotazioni, checkout), perché permette di collegare una capacità strutturata a meccanismi web esistenti senza introdurre necessariamente molta logica custom.

## Cosa significa per chi sviluppa frontend
Se questa direzione prenderà piede, il lavoro frontend potrebbe evolvere in due aspetti:

1. **Progettare azioni di dominio come strumenti stabili** (es. `searchHotels`, `applyFilters`, `addToCart`, `selectRoom`, `book`) invece di affidarsi solo alla navigabilità della UI.
2. **Curare schemi di input** chiari e minimali: più lo schema è ben definito, più l’agente può operare con precisione.

In altre parole, oltre a costruire interfacce usabili per le persone, potremmo iniziare a pubblicare anche “interfacce usabili per agenti”: non una seconda UI, ma un set di azioni formali e verificabili.

## Una lettura realistica: ridurre la complessità, non eliminarla
WebMCP non elimina la necessità di un agente di comprendere contesto e obiettivo, ma può ridurre drasticamente l’area più fragile: la traduzione continua tra intenti e micro-azioni sulla UI.

Se l’obiettivo è rendere le interazioni **più veloci e più affidabili** in scenari complessi, l’idea di tool strutturati esposti dai siti è una delle strade più sensate: rende esplicito ciò che oggi l’agente deve dedurre—spesso a tentativi.
