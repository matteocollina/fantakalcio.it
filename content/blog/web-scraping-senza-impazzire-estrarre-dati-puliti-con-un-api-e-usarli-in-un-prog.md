---
title: "Web scraping senza impazzire: estrarre dati “puliti” con un’API (e usarli in un progetto Node)"
subtitle: "CAPTCHA, rate limit e bot protection sono il motivo per cui tanti scraper si rompono. Un approccio API-first ti fa arrivare prima al dato, già in JSON."
description: "Molti progetti frontend hanno bisogno di dati “dal web”: risultati di ricerca, contenuti multimediali, segnali SEO o informazioni di mercato. Costruire scraper tradizionali però significa inseguire CAPTCHA, blocchi e cambi di markup. In questo articolo vediamo un approccio più robusto: delegare la parte “difficile” a un’API che esegue la navigazione e restituisce dati strutturati (JSON). E poi usare quei dati in Node.js, fino a una mini-architettura per un’app che cerca short video e li scarica localmente."
publishedAt: 2026-06-08
tags: ["SERP API","Node.js scraping","Google Search API","Express backend","SEO tracking","JSON data pipeline"]
---
## Perché tanti scraper “classici” falliscono (e cosa fare invece)

Se hai provato anche solo una volta a fare scraping “a mano” (fetch + parsing HTML) ti sarai scontrato con almeno uno di questi problemi:

- **CAPTCHA** e challenge anti-bot
- **Rate limit** e blocchi per IP
- **Markup che cambia** (e parsing che si rompe)
- **Contenuti renderizzati** lato client (serve un browser vero)

Per attività come **monitoraggio SEO**, **raccolta dati per ricerche di mercato**, **analisi competitor** o perfino **tool di AI** che arricchiscono informazioni, l’obiettivo spesso non è “scrapare un sito” in senso romantico: è **ottenere dati affidabili, ripetibili e strutturati**.

Un approccio pratico è spostare la complessità su un servizio che:

- esegue ricerche in un **browser reale**
- gestisce automaticamente CAPTCHA e protezioni
- restituisce risultati **normalizzati** in **JSON**

Il vantaggio principale? Nel tuo codice non devi più inseguire HTML instabile: lavori su un contratto dati.

---

## Primo requisito: proteggere la tua API key

Quasi tutte le API di scraping/ricerca funzionano con una **API key** personale. Trattala come una password:

- **non committarla** nel repository
- usa `.env` e variabili d’ambiente
- ruotala se pensi sia stata esposta

Motivo banale ma doloroso: chiunque la trovi può consumare i tuoi crediti o generare costi.

---

## Verifica veloce via cURL: prima il dato, poi il codice

Quando inizi con un’API nuova, il modo più rapido per capire “cosa torna” è un test da terminale.

Esempio concettuale (parametri minimi tipici: query + key):

```bash
curl "https://serpapi.com/search.json?q=coffee&api_key=LA_TUA_API_KEY"
```

Se ottieni JSON in risposta, hai confermato:

- key valida
- endpoint corretto
- formato dei risultati

Da qui in poi il lavoro si sposta su: **quali parametri supporta l’engine** e come ottenere il JSON che ti serve davvero.

---

## Setup Node.js minimale: progetto + dipendenza

Per lavorare in JavaScript lato server:

1. crea una cartella (es. `scraping-tutorial/`)
2. aggiungi un `index.js`
3. inizializza il progetto

```bash
npm init -y
```

Poi installa il client npm dell’API (nell’esempio: pacchetto SerpApi):

```bash
npm i serpapi
```

> Nota pratica: se stai seguendo un progetto già esistente, **allineare le versioni** delle dipendenze evita sorprese. In contesti tutorial/prodotti didattici è comune “bloccare” una major/minor specifica.

---

## Eseguire una ricerca Google e ottenere risultati strutturati

Una chiamata tipica con un client Node prevede:

- **engine**: quale fonte/verticale interrogare (es. Google search)
- **q**: query
- **location / gl / hl**: localizzazione e lingua
- **google_domain**: dominio
- **api_key**: credenziale

Esempio (Node):

```js
const { getJson } = require("serpapi");

getJson({
  engine: "google",
  q: "cafe",
  location: "London, England, United Kingdom",
  google_domain: "google.co.uk",
  hl: "en",
  gl: "uk",
  api_key: process.env.SERPAPI_KEY
}, (json) => {
  console.log(json);
});
```

### Perché `gl`, `hl`, location e dominio contano

Se stai facendo **SEO tracking** o confronti di mercato, questi parametri sono tutto:

- `hl` (language) influenza lingua dell’interfaccia e spesso parte della SERP
- `gl` (country) influenza la geolocalizzazione logica
- `location` può cambiare drasticamente risultati local e map pack
- `google_domain` aiuta a replicare il contesto (es. `.it`, `.co.uk`, …)

Il punto chiave è non “inventarseli”: molti servizi richiedono valori in formati precisi (codici lingua, codici paese, location supportate, ecc.).

---

## Oltre la SERP classica: short video e ricerca per immagini

Una volta che ragioni per “engine”, diventa naturale cambiare verticale.

### 1) Short video

Per estrarre short video (titoli, link, miniature, durata, sorgente, ecc.) si usa un engine dedicato.

```js
getJson({
  engine: "google_short_videos",
  q: "labubu",
  api_key: process.env.SERPAPI_KEY
}, (json) => {
  console.log(json);
});
```

Qui il valore sta nel fatto che i risultati arrivano già **modellati**: non devi capire come Google compone la pagina o dove mette i metadati.

### 2) Google Lens (image search)

Per la ricerca via immagine, invece, passi un URL dell’immagine e ottieni match e risultati correlati.

```js
getJson({
  engine: "google_lens",
  url: "https://example.com/immagine.jpg",
  api_key: process.env.SERPAPI_KEY
}, (json) => {
  // esempio: filtrare solo i visual matches
  console.log(json.visual_matches);
});
```

Questo è utile per:

- identificare fonti/riutilizzi di un’immagine
- costruire tool di content discovery
- arricchire dataset (con attenzione a licenze e diritti)

---

## Mini-progetto: web app Node/Express che cerca short video e li scarica

Mettiamo insieme i pezzi con una pipeline semplice:

1. frontend minimale: input query + selezione “quanti risultati”
2. backend Express: endpoint `/search`
3. backend chiama l’API (engine short video)
4. backend scarica N video in una cartella locale con un tool esterno (es. `yt-dlp`)

### Dipendenze e moduli Node utili

- **express**: routing e server HTTP
- **path**: gestire percorsi in modo cross-platform
- **fs**: leggere/scrivere file e cartelle
- **child_process.execFile**: eseguire comandi esterni (es. downloader)
- client API: `getJson(...)`

Installazione:

```bash
npm i express serpapi
```

### Skeleton server (idea architetturale)

```js
const express = require("express");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { getJson } = require("serpapi");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/search", async (req, res) => {
  const { q, count = 5 } = req.body;
  if (!q) return res.status(400).json({ error: "Missing q" });

  getJson({
    engine: "google_short_videos",
    q,
    api_key: process.env.SERPAPI_KEY
  }, (json) => {
    // 1) estrai i link che ti interessano
    const items = (json.short_videos || []).slice(0, Number(count));

    // 2) scarica con yt-dlp (esempio: concettuale)
    // items.forEach(item => execFile("yt-dlp", [item.link, "-o", "downloads/%(title)s.%(ext)s"]))

    res.json({ items });
  });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
```

**Dettagli importanti**:

- la cartella `downloads/` va creata e gestita (permessi, naming file, collisioni)
- `yt-dlp` deve essere installato sulla macchina (o incluso nell’immagine Docker)
- conviene usare una coda o limitare concorrenza se scarichi molti asset

---

## Note pratiche per renderlo “da progetto vero”

Se vuoi trasformare lo skeleton in un tool robusto:

- **rate limiting lato server**: non demandare tutto al client
- **caching**: stessa query + stessi parametri = stessi risultati per un certo TTL
- **validazione input** (query, count, parametri di localizzazione)
- **osservabilità**: log degli errori API e dei download falliti
- **separazione responsabilità**: un modulo per “search”, uno per “download”, uno per “storage”

---

## Conclusione

Quando l’obiettivo è costruire feature (SEO monitoring, research, content discovery), spesso la scelta più sensata non è combattere con scraping “fragile”, ma adottare un flusso **API → JSON → applicazione**.

La parte interessante, a quel punto, diventa il prodotto: come filtri i risultati, come li salvi, come li visualizzi, come li arricchisci e come rendi tutto ripetibile nel tempo.
