---
title: "Immagini in Markdown senza stress: figure HTML con alt e didascalia generate via AI (vincolate da JSON Schema)"
subtitle: "Dalla sintassi fragile del Markdown a un flusso editoriale moderno: inserisci un’immagine, ottieni alt text e caption strutturati e modificabili, senza output “creativi” fuori formato."
description: "La sintassi delle immagini in Markdown è facile da sbagliare e non gestisce bene le didascalie. Un approccio più robusto è trattare l’inserimento immagini come creazione di una <figure> HTML, arricchita con alt text e caption proposti da un modello AI. Il punto chiave è vincolare la risposta dell’AI con un JSON Schema (alt + caption), così da ottenere un oggetto JSON affidabile da parsare e inserire nell’editor."
publishedAt: 2026-06-05
tags: ["markdown-immagini","json-schema","ai-multimodale","accessibilità-alt-text","figure-html","editor-rte"]
---
## Il problema: immagini in Markdown tra sintassi e limiti
Chi scrive contenuti tecnici lo sa: la sintassi Markdown per link e immagini è facile da dimenticare e ancora più facile da sbagliare quando si va di fretta. E anche quando la sintassi è corretta, c’è un limite strutturale: l’immagine in Markdown supporta l’**alt text**, ma non ha un costrutto standard e “pulito” per una **didascalia**.

Nel mondo reale però alt e caption sono due cose diverse:
- **Alt text**: serve all’accessibilità e descrive l’immagine per chi non può vederla.
- **Caption**: aiuta il lettore a contestualizzare l’immagine nel testo.

Se il tuo editor gestisce immagini come semplice `![]()` finisci per:
- perdere la didascalia (o inserirla in modo incoerente),
- avere alt text vuoti o inutili,
- lasciare agli autori l’onere di ricordare la sintassi.

## Un approccio più solido: inserimento immagini → `<figure>` HTML
Un flusso editoriale più moderno è: **l’utente inserisce l’immagine** (da file picker o incolla dagli appunti) e l’editor la converte in markup semantico, ad esempio:

```html
<figure>
  <img src="..." alt="...">
  <figcaption>...</figcaption>
</figure>
```

Così ottieni:
- un contenitore semantico unico,
- alt e caption gestiti come campi dedicati,
- una struttura più robusta da esportare/trasformare (es. verso Markdown, HTML o CMS).

## Dove entra l’AI (nel modo giusto): suggerimenti modificabili
L’idea non è “far scrivere tutto al modello”, ma **proporre alt text e didascalia** immediatamente dopo l’inserimento dell’immagine.

Punti chiave per un’esperienza credibile:
- alt e caption devono essere **facilmente editabili** (perché il modello può sbagliare o essere generico),
- l’output deve essere **affidabile e strutturato**, non testo libero.

## Il trucco che rende il flusso affidabile: vincolare l’output con JSON Schema
Se chiedi a un LLM “scrivi alt e caption”, spesso ottieni:
- frasi aggiuntive,
- formattazione variabile,
- output difficile da parsare.

Per evitarlo, imposti un **vincolo di risposta**: vuoi **un JSON** con due proprietà e basta.

### Schema minimale
```json
{
  "type": "object",
  "properties": {
    "alt": { "type": "string" },
    "caption": { "type": "string" }
  },
  "required": ["alt", "caption"],
  "additionalProperties": false
}
```

Questo ti permette di:
- parsare la risposta senza euristiche,
- gestire errori in modo deterministico,
- impedire campi “creativi” non previsti.

## Multimodalità: passare anche l’immagine come input
Per scrivere un alt text sensato, il modello deve “vedere” l’immagine. Il flusso tipico è:
1. crei una sessione con il modello,
2. dichiari che l’input atteso include anche un **asset immagine**,
3. imposti un system prompt che lo istruisca a comportarsi come autore di alt text e didascalie,
4. invii richiesta + immagine, **vincolando l’output allo schema**.

Il prompt applicativo può includere regole utili, ad esempio:
- alt text descrittivo e conciso,
- niente “immagine di…” se non necessario,
- caption più editoriale/contestuale,
- lingua coerente con il documento.

## Dal JSON al markup: parsing e inserimento nell’editor
Una volta ricevuto l’oggetto JSON:
- fai `JSON.parse(...)`,
- popoli i campi dell’interfaccia (alt/caption),
- generi o aggiorni la `<figure>` nel documento.

Esempio di oggetto restituito:

```json
{
  "alt": "Schermata di un editor con un pannello laterale per modificare alt text e didascalia",
  "caption": "Alt e caption vengono proposti automaticamente e restano sempre modificabili dall’autore."
}
```

## Perché questo pattern è utile anche in produzione
Questo approccio non è solo “comodo”: rende l’editor più coerente e più accessibile.

Benefici concreti:
- **accessibilità**: alt text presenti più spesso e mediamente migliori,
- **qualità editoriale**: didascalie consistenti senza workaround,
- **robustezza tecnica**: output strutturato e validabile,
- **manutenibilità**: lo schema evolve (es. `credit`, `source`, `longdesc`) senza stravolgere il flusso.

## Estensioni naturali (se vuoi spingerti oltre)
Una volta adottato lo schema, è facile iterare:
- aggiungere `language` o `tone` per documenti multilingua,
- distinguere `caption` (breve) e `description` (lunga),
- includere un flag `needsReview` quando il modello è poco sicuro,
- integrare linee guida WCAG direttamente nelle istruzioni.

---

Se stai costruendo (o evolvendo) un editor per contenuti tecnici, il mix **multimodalità + JSON Schema + `<figure>`** è un modo pragmatico per eliminare fragilità del Markdown, migliorare l’accessibilità e mantenere il controllo sul markup finale.
