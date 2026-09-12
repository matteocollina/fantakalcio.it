---
title: "Il software mancante: cosa cambia davvero quando costruire diventa (quasi) gratis"
subtitle: "Con gli agenti software, l’automazione non è più un lusso: diventa un problema di selezione, qualità e manutenzione."
description: "Per anni il limite non è stato cosa si poteva automatizzare, ma cosa valeva la pena costruire. Oggi, con agenti sempre più capaci, una parte enorme di “software che dovrebbe esistere” diventa economicamente sostenibile: strumenti piccoli, verticali, interni, spesso ignorati perché troppo costosi da sviluppare e mantenere. Vediamo cosa significa per chi fa frontend e come progettare prodotti e workflow in un mondo dove il costo marginale di scrittura del codice crolla, ma crescono i rischi su qualità, affidabilità e governance."
publishedAt: 2026-05-25
tags: ["agenti AI","automazione processi","tooling interno","product engineering","manutenzione software","costo del software"]
---
Negli ultimi anni abbiamo imparato a convivere con un paradosso: **tante cose sono tecnicamente automatizzabili**, ma pochissime vengono davvero automatizzate. Non perché manchino le API o i framework, bensì perché manca l’unica risorsa che storicamente ha sempre governato il software: **l’economia**.

Per molto tempo il freno principale è stato semplice: *scrivere e mantenere software costa troppo*. Non solo in termini di ore di sviluppo, ma anche di delivery, QA, supporto, onboarding, documentazione, migrazioni, e tutto ciò che rende un progetto sostenibile.

Oggi, con l’emergere di **agenti software** capaci di produrre codice, test, documentazione e perfino iterare su feedback, una parte di quel costo scende drasticamente. Risultato: diventa finalmente praticabile una categoria enorme di “software che dovrebbe esistere”… ma che non è mai esistito.

## Cos’è il “software mancante”
È l’insieme di strumenti e automazioni che:

- sarebbero utilissimi,
- sono ben definiti e ripetibili,
- hanno un ROI potenziale,
- ma **non sono mai stati costruiti** perché il costo di realizzazione e manutenzione superava il valore percepito.

Non parliamo solo di grandi prodotti. Anzi: il “software mancante” è spesso **piccolo, verticale, localizzato**, a volte persino “brutto ma efficace”. E proprio per questo non veniva finanziato.

Esempi tipici (soprattutto in contesti frontend):

- generatori di pagine o contenuti interni con vincoli specifici (SEO, accessibilità, naming, tracking);
- tool che normalizzano asset, icone, immagini e formati in base a regole aziendali;
- automazioni di QA su component library (snapshot, visual regression, a11y) con report su misura;
- dashboard minuscole per gestire “liste” e configurazioni che oggi vivono in fogli Excel o JSON sparsi;
- script che aggiornano dipendenze e aprono PR con changelog ragionato e test mirati.

Tutte cose fattibili anche ieri. Solo che **ieri costavano troppo**.

## Il cambio di paradigma: dal “possiamo farlo?” al “vale la pena farlo?”
Quando costruire diventa meno oneroso, la domanda non è più se un’idea sia implementabile.

Diventa:

1. **Dove conviene automatizzare davvero?**
2. **Quale qualità è sufficiente per ottenere valore?**
3. **Chi mantiene e governa ciò che viene generato?**

In altre parole: se il costo marginale di scrittura del codice crolla, il collo di bottiglia si sposta su:

- requisiti e confini del problema;
- validazione (test, review, osservabilità);
- sicurezza e compliance;
- manutenzione nel tempo.

## Per chi fa frontend: più strumenti, più responsabilità
Nel frontend questo effetto si sente subito, perché una grande fetta di lavoro è:

- ripetitiva (varianti UI, form, validazioni, wiring di API),
- governata da regole (design system, a11y, i18n),
- verificabile (test automatici, lint, type-checking).

Gli agenti rendono **economicamente sensato** produrre una quantità di micro-tool che prima non avresti mai approvato in roadmap.

Ma attenzione: il rischio non è “fare troppo”, è **accumulare debito in modo più veloce**.

### Il nuovo debito: software che esiste ma non è “posseduto”
Se generare un tool interno richiede poco sforzo, è facile ritrovarsi con:

- repository senza owner,
- automazioni che nessuno comprende,
- integrazioni fragili,
- UX incoerenti,
- sicurezza trascurata (token, permessi, data leakage).

Quindi il tema diventa: *come si introduce software mancante senza creare caos?*

## Linee guida pratiche per costruire “software mancante” bene
### 1) Progetta confini stretti
Un agente rende velocissima la produzione, ma **non sostituisce il product thinking**.

- Definisci input/output.
- Specifica i casi limite.
- Scrivi una “definition of done” semplice.

Il software mancante vince quando è **piccolo e affidabile**, non quando è ambizioso.

### 2) Trasforma regole implicite in regole eseguibili
Molte automazioni falliscono perché le regole stanno nella testa di qualcuno.

Per il frontend, rendi espliciti:

- constraints del design system;
- policy di accessibilità;
- convenzioni di tracking e naming;
- contratti API (schema, tipi, error handling).

Più queste regole sono codificate (lint, schema, test), più un agente può produrre output coerente.

### 3) Investi in test e osservabilità prima che in feature
Se costruire è economico, **testare è il moltiplicatore**.

- unit test mirati;
- test di integrazione su flussi critici;
- visual regression per UI;
- logging strutturato e alerting per automazioni.

L’obiettivo è che il software “mancante” non diventi “mancante di affidabilità”.

### 4) Stabilire ownership e ciclo di vita
Ogni tool deve avere:

- un owner (team o persona);
- un canale di supporto;
- una policy di deprecazione;
- aggiornamenti minimi (dipendenze, security patch).

Se non puoi garantirlo, meglio non creare il tool: il costo è solo rimandato.

## Una conseguenza interessante: si riempie la “mappa” delle automazioni
Immagina un grande cerchio che rappresenta tutto ciò che *in teoria* potrebbe essere automatizzato. Finora una porzione enorme restava vuota, non per limiti tecnici, ma per costi.

Gli agenti abbassano quella barriera: **più aree diventano economicamente raggiungibili**. Non significa che automatizzeremo tutto, ma che l’insieme di automazioni “sensate” crescerà rapidamente.

E questo cambia il lavoro quotidiano:

- più tooling su misura;
- più iterazioni rapide;
- più attenzione a governance, qualità e sicurezza;
- meno “non lo facciamo perché costa troppo”.

## In conclusione
Il futuro prossimo non è solo “più software”. È **più software utile**, quello che mancava perché non conveniva scriverlo.

Per chi fa frontend, è un’opportunità enorme: liberare tempo dalle micro-frizioni, standardizzare processi, e costruire strumenti che rendono il team più veloce.

La vera sfida non sarà generare codice. Sarà decidere *cosa* generare, *con quali garanzie*, e *chi se ne prende cura* quando smette di essere una sperimentazione e diventa infrastruttura quotidiana.
