---
title: "Una mini estensione Chrome: timer di 30 secondi in popup"
subtitle: "Un esercizio rapido e concreto per ripassare struttura, manifest e UI minimale di un’estensione."
description: "Costruiamo una piccola estensione Chrome con un popup che mostra un countdown di 30 secondi. Vediamo struttura dei file, Manifest V3, UI essenziale e logica del timer, con qualche accorgimento pratico per evitare i problemi più comuni."
publishedAt: 2026-07-16
tags: ["estensioni-chrome","manifest-v3","popup-extension","countdown-timer","vanilla-js"]
---
Costruire una piccola estensione Chrome è uno dei modi più efficaci per “toccare con mano” Manifest V3, la struttura dei file e l’interazione tra UI e logica. Un caso d’uso perfetto per iniziare è un **timer di 30 secondi** in un **popup**: semplice, utile e abbastanza completo da farti attraversare i passaggi fondamentali.

Di seguito trovi una versione minimale ma pulita: **popup con countdown**, pulsante di start/reset, aggiornamento UI e gestione del ciclo del timer.

---

## Struttura del progetto

Crea una cartella, ad esempio `timer-extension/`, con questi file:

```
timer-extension/
  manifest.json
  popup.html
  popup.css
  popup.js
```

Puoi aggiungere un’icona (opzionale) più avanti.

---

## Manifest (MV3): definire l’action con popup

`manifest.json`

```json
{
  "manifest_version": 3,
  "name": "30s Timer",
  "version": "1.0.0",
  "description": "Un timer di 30 secondi in popup.",
  "action": {
    "default_title": "Timer 30s",
    "default_popup": "popup.html"
  }
}
```

Qui non servono permessi: il timer vive interamente nel popup.

---

## UI: markup essenziale

`popup.html`

```html
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Timer 30s</title>
    <link rel="stylesheet" href="popup.css" />
  </head>
  <body>
    <main class="card">
      <h1 class="title">Timer</h1>

      <div class="time" id="time" aria-live="polite">30</div>

      <div class="actions">
        <button id="start" class="btn">Avvia</button>
        <button id="reset" class="btn btn--secondary">Reset</button>
      </div>
    </main>

    <script src="popup.js"></script>
  </body>
</html>
```

Note utili:
- `aria-live="polite"` aiuta gli screen reader ad annunciare l’aggiornamento senza essere invasivi.
- Un numero grande e pochi controlli: in popup lo spazio è poco.

---

## Stili: compatti e leggibili

`popup.css`

```css
:root {
  --bg: #0b1220;
  --card: #111a2e;
  --text: #e8eefc;
  --muted: #a9b6d3;
  --accent: #6ea8fe;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  width: 220px;
  padding: 12px;
  background: var(--bg);
  color: var(--text);
  font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

.card {
  background: var(--card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px;
}

.title {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--muted);
  font-weight: 600;
}

.time {
  font-size: 56px;
  font-weight: 800;
  text-align: center;
  letter-spacing: -1px;
  margin: 4px 0 10px;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  border: 0;
  border-radius: 10px;
  padding: 10px 10px;
  background: var(--accent);
  color: #0a1020;
  font-weight: 700;
  cursor: pointer;
}

.btn--secondary {
  background: rgba(255,255,255,0.10);
  color: var(--text);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## Logica: countdown affidabile nel popup

`popup.js`

```js
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');

const DURATION = 30;
let remaining = DURATION;
let intervalId = null;

function render() {
  timeEl.textContent = String(remaining);
}

function setRunning(running) {
  startBtn.disabled = running;
}

function stop() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  setRunning(false);
}

function reset() {
  stop();
  remaining = DURATION;
  render();
}

function start() {
  if (intervalId !== null) return;

  setRunning(true);

  // Primo render “sincronizzato”
  render();

  intervalId = setInterval(() => {
    remaining -= 1;
    render();

    if (remaining <= 0) {
      stop();
      remaining = 0;
      render();
    }
  }, 1000);
}

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);

render();
```

### Una nota importante sui popup
Il popup di un’estensione **non è una pagina persistente**: quando lo chiudi, lo stato JS si perde. Questo esempio va benissimo come esercizio e come utility “rapida”, ma se vuoi che il timer continui anche a popup chiuso, ti serve spostare la logica su un **service worker** (background) e sincronizzare lo stato al riaprirsi del popup.

---

## Caricare l’estensione in Chrome

1. Apri `chrome://extensions`.
2. Attiva **Modalità sviluppatore**.
3. Clicca **Carica estensione non pacchettizzata**.
4. Seleziona la cartella `timer-extension/`.
5. Clicca l’icona dell’estensione e verifica che il popup mostri **30** e che il countdown scenda fino a **0**.

---

## Sintesi e implicazione pratica

Un timer di 30 secondi in popup è un’ottima “palestra” per prendere confidenza con **Manifest V3**, con la **UI compatta** di un action popup e con una logica di aggiornamento semplice ma corretta. Da qui il passo naturale è rendere il timer **persistente** (background/service worker) e aggiungere qualità d’uso: suono a fine countdown, preset (15/30/60), e salvataggio dello stato con `chrome.storage`.
