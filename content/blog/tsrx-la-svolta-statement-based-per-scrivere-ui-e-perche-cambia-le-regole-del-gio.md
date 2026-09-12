---
title: "TSRX: la svolta “statement-based” per scrivere UI (e perché cambia le regole del gioco rispetto a JSX)"
subtitle: "Controllo di flusso leggibile, hook condizionali, scope locali nel markup e stili co-locati: una nuova estensione TypeScript che ripensa l’authoring dei componenti."
description: "TSRX (TypeScript Render Extensions) propone un’alternativa a JSX/TSX che sposta il rendering da “espressioni” a “statement”. Il risultato è una sintassi più lineare: if/else nel markup senza ternari annidati, hook richiamabili in rami condizionali, variabili locali dichiarate direttamente dentro i blocchi di UI, escaping del testo esplicito e perfino style block nello stesso file. In più, l’obiettivo dichiarato è migliorare la co-locazione del contesto per persone e strumenti automatici, riducendo la dispersione tra file e sezioni distanti del codice."
publishedAt: 2026-04-27
tags: ["TSRX","JSX alternativa","hook condizionali","control flow UI","TypeScript template"]
---
## JSX oggi: potente, ma “costretto” dalle espressioni
Chi scrive React da un po’ lo sa: JSX/TSX è **expression-based**. In pratica, quello che metti tra `return (...)` deve essere un’espressione che “produce un valore” (un albero di elementi). Questo modello ha funzionato benissimo per anni, ma introduce inevitabilmente alcune frizioni:

- **Controllo di flusso nel markup** spesso affidato a ternari, short-circuit (`&&`) o a variabili intermedie.
- **Leggibilità** che degrada rapidamente quando le condizioni diventano annidate.
- **Hook** con regole rigide (ordine stabile, niente chiamate condizionali), che portano a pattern come early return e guard clauses anche quando la UI sarebbe più naturale da descrivere “a blocchi”.

TSRX entra qui: non è “un altro modo di scrivere JSX”, ma un cambio di paradigma.

---

## Cos’è TSRX (TypeScript Render Extensions)
TSRX è un’estensione costruita in TypeScript che introduce una sintassi di rendering **statement-based**. Tradotto: invece di costruire un unico grande valore JSX da restituire, scrivi una sequenza di **istruzioni** che descrivono cosa renderizzare.

Questa differenza abilita un insieme di feature che in JSX risultano scomode o impossibili, mantenendo però un modello mentale molto vicino al “scrivo UI in modo dichiarativo”.

Inoltre, l’approccio è pensato per favorire la **co-locazione**: logica di rendering, stili e dettagli del componente tendono a vivere nello stesso punto, con l’obiettivo di ridurre il “salto” continuo tra contesti.

---

## Expression vs statement: perché cambia tutto
In JavaScript:

- Un’**espressione** valuta (prima o poi) a un valore.
- Uno **statement** è un’istruzione: può creare scope, eseguire azioni, controllare il flusso (`if`, `for`, `switch`) senza dover “essere un valore”.

JSX è intrinsecamente legato alle espressioni: ecco perché il controllo di flusso nel markup tende a trasformarsi in ternari e composizioni.

TSRX, essendo statement-based, può rappresentare l’albero UI come una serie di istruzioni: “renderizza questo”, “se succede X renderizza quest’altro”, ecc.

---

## 1) Definizione dei componenti: arriva la keyword `component`
Una delle differenze più evidenti è la presenza di una keyword dedicata:

```ts
export component UserCard(props: Props) {
  // ...
}
```

L’idea è rendere *esplicito* al compilatore che quel blocco è un componente (e non una funzione generica), in un mondo dove il corpo del componente è più simile a un “template con statement” che a una funzione che ritorna un valore.

---

## 2) Controllo di flusso nel markup: addio ternari annidati
Uno dei vantaggi più immediati è poter usare `if / else if / else` direttamente nel punto in cui stai descrivendo la UI.

Dove in TSX tipicamente finisci con:

- ternari annidati
- frammenti condizionali
- estrazione in variabili render-helper

in TSRX l’intento diventa lineare: leggi il componente dall’alto verso il basso e “segui” i rami.

Questa è una differenza enorme soprattutto per componenti di media/grande dimensione: la UI torna a somigliare a un flusso narrativo, non a un puzzle di parentesi.

---

## 3) Hook condizionali: una regola che qui può cambiare
In React classico, chiamare un hook dentro un `if` è vietato perché rompe l’ordine delle chiamate tra render.

TSRX introduce la possibilità di esprimere hook in rami condizionali come parte del modello statement-based. In pratica, puoi descrivere:

- “se ho `userId`, allora prendi anche `username` con questo hook”
- altrimenti renderizza una UI alternativa

È probabilmente la feature più “controintuitiva” per chi arriva da React puro, e allo stesso tempo una delle più interessanti: riduce la necessità di guard clauses/early return e rende più naturale associare dati e UI al ramo che li usa davvero.

> Nota importante: qui il tema non è solo sintattico. Il valore reale dipende da *come* questa cosa viene compilata e garantita a runtime. È un punto da valutare bene in termini di compatibilità e prevedibilità.

---

## 4) TSX “island” per trattare markup come valore
Il passaggio a statement-based ha un effetto collaterale: se vuoi **assegnare del markup a una variabile** (quindi trattarlo come valore), serve un confine esplicito.

In TSRX esiste un costrutto dedicato (una sorta di “isola TSX”) per incapsulare markup come espressione/valore, così da poterlo passare come prop o riutilizzare.

Non è necessariamente un difetto: è il prezzo di una distinzione più netta tra “renderizzare ora” (statement) e “costruire un valore UI” (expression).

---

## 5) Lazy destructuring dei props
TSRX propone anche un meccanismo di **destrutturazione lazy** dei props, con una sintassi dedicata.

L’idea: i valori non vengono “letti” immediatamente, ma nel momento in cui sono effettivamente usati/renderizzati. Questo può:

- evitare letture inutili
- garantire accesso al valore più aggiornato (riducendo il rischio di valori “stale” in certi modelli)
- allinearsi meglio a framework con primitive reattive tipo signal

Su React puro l’impatto va capito bene (perché React non è basato su signal nativamente), ma come concetto è interessante: porta nel linguaggio un’intenzione che oggi è implicita e demandata al runtime/framework.

---

## 6) Variabili locali *dentro* il template (scope per blocchi UI)
Un’altra idea molto pratica: poter dichiarare variabili e fare calcoli **nel punto esatto** in cui servono, all’interno del markup.

E soprattutto: i tag/blocchi possono comportarsi come **scope**. Quindi variabili dichiarate dentro una sezione restano lì, senza “sporcare” l’esterno.

Questo abilita pattern del tipo:

- calcoli per un riepilogo carrello dentro la `section` che lo renderizza
- mapping e derivazioni locali senza riempire la testa del componente di `const` che esistono solo per un pezzo di UI

---

## 7) Text expressions con escaping esplicito
TSRX introduce un costrutto per dichiarare che un certo output va trattato come **testo** con escaping automatico.

È un dettaglio che può sembrare piccolo, ma tocca temi reali:

- sicurezza (XSS e output non sanificato)
- chiarezza: “questa cosa è testo, non markup”

In React spesso ti affidi al comportamento standard e a regole/procedure del team; qui l’intenzione diventa parte della sintassi.

---

## 8) Style block co-locati: comodità vs separazione delle responsabilità
TSRX permette di includere stili direttamente accanto al componente.

Pro:
- tutto nello stesso posto
- meno file e meno salti di contesto
- potenzialmente più semplice per costruire/rigenerare componenti in modo automatico

Contro:
- quando gli stili crescono, la leggibilità del componente può peggiorare
- il bilanciamento tra logica, markup e CSS diventa una scelta architetturale da team a team
- con ecosistemi già maturi (Tailwind, CSS Modules, CSS-in-JS, design system) bisogna capire dove si posiziona davvero

Qui non esiste una risposta unica: è una feature che va giudicata su progetti reali, non su snippet.

---

## Perché tanta attenzione alla “co-locazione” (anche per strumenti automatici)
Una parte centrale della filosofia TSRX è ridurre la dispersione del contesto: meno file separati, meno pattern indiretti, meno “vai su e giù” per capire cosa succede.

In generale, un codice più lineare e localizzato:

- aiuta chi lo legge e lo mantiene
- rende più facile anche per strumenti automatici lavorare su porzioni di UI senza doversi portare dietro troppi pezzi di contesto

---

## Tooling e adozione: cosa aspettarsi
Per essere credibile, una sintassi nuova deve avere due cose:

1. **Compilazione/infrastruttura** integrabile con i tool moderni (bundler e pipeline).
2. **Tooling editor** (highlight, lint, formattazione) che eviti l’effetto “linguaggio di nicchia scomodo”.

Da quello che emerge, TSRX punta a inserirsi nel flusso moderno con plugin e supporto a formattazione/editor, rendendo più facile provarlo in un progetto senza stravolgere tutto.

---

## Quando ha senso interessarsene (e quando no)
Vale la pena seguirlo se:

- soffri spesso la complessità di controllo di flusso in JSX
- scrivi componenti con molte varianti di UI e stati
- vuoi un modello che incoraggi co-locazione e lettura top-down

È invece presto per “buttarsi” se:

- hai un codebase React enorme con convenzioni consolidate
- dipendi fortemente da pattern/strumenti strettamente legati a JSX classico
- non hai margine per introdurre una sintassi nuova in produzione senza una fase di valutazione lunga

---

## Conclusione
TSRX prova a risolvere un problema reale: JSX è diventato lo standard, ma paga un prezzo in leggibilità e controllo di flusso quando la UI cresce. Spostare il rendering verso gli statement apre possibilità nuove (if/else nel markup, scope locali, hook in rami condizionali) che rendono la scrittura dei componenti più lineare.

Se questa direzione prenderà piede dipenderà soprattutto da due fattori: qualità della compilazione/runtime e maturità dell’ecosistema. Ma come idea, è una delle proposte più interessanti degli ultimi anni per ripensare l’authoring della UI in TypeScript.
