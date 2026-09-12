---
title: "Python da zero: installazione, setup dell’editor e primo script (senza inciampi)"
subtitle: "Una guida pratica per partire subito: interpreter, PATH, Zed e il classico “Hello, world” eseguito correttamente."
description: "Python è un linguaggio general purpose e ad alto livello: versatile, leggibile e adatto a tantissimi contesti (automazione, data, scripting, sicurezza). In questo articolo vediamo come installarlo bene su Windows e macOS, verificare che funzioni da terminale, configurare un editor leggero come Zed e creare il primo file .py senza errori tipici da principianti."
publishedAt: 2026-07-16
tags: ["installazione-python","zed-editor","python-interpreter","variabile-PATH","primo-script-python"]
---
Python è spesso il primo linguaggio “serio” che si impara, ma non è solo una scelta didattica: è uno strumento trasversale. Lo trovi in automazione, scripting, data analysis, machine learning, cybersecurity, web backend e mille attività quotidiane da IT.

Per partire bene, però, servono due cose:

1. **Un’installazione pulita dell’interprete** (e accessibile da terminale)
2. **Un ambiente di scrittura comodo** (editor configurato in modo sensato)

Qui sotto trovi un percorso essenziale, lineare, senza fronzoli.

---

## Perché Python è “general purpose” e “ad alto livello”

- **General purpose** significa che non è “bloccato” su un solo tipo di applicazione: con lo stesso linguaggio puoi fare scripting, automazioni, tool CLI, analisi dati, prototipi, servizi web e altro.
- **Ad alto livello** significa che la sintassi è pensata per essere **leggibile** e la piattaforma fa parecchio lavoro “dietro le quinte” (gestione memoria, dettagli hardware, molte complessità operative). Risultato: scrivi più velocemente e ti concentri sulla logica.

Questa combinazione (versatilità + leggibilità) spiega perché Python è così diffuso.

---

## Interprete: cos’è e perché ti serve

Quando scrivi Python, non stai scrivendo istruzioni direttamente eseguibili dalla CPU. Serve un programma che **legge il codice Python e lo esegue**: l’**interprete Python**.

In pratica, installare Python vuol dire installare quell’interprete (più strumenti di contorno).

---

## Installare Python su Windows (passo importante: PATH)

1. Vai su **python.org** → sezione **Downloads**.
2. Scarica l’installer per Windows.
3. Avvia l’installer e **prima di cliccare “Install”** assicurati di spuntare:
   - **“Add Python.exe to PATH”**

Questa opzione è cruciale: rende Python richiamabile da qualunque cartella nel terminale.

### Verifica da PowerShell
Apri PowerShell e prova:

- Avvio console Python:
  ```powershell
  py
  ```
  Se entri nella console interattiva, l’installazione è ok.

- Uscita dalla console:
  - `Ctrl + D` (in molti ambienti) oppure
  - `exit()`

- Versione:
  ```powershell
  python --version
  ```

Se questi comandi funzionano, sei a posto.

---

## Installare Python su macOS

1. Vai su **python.org** → **Downloads** → macOS.
2. Scarica l’installer `.pkg` più recente e installalo.
3. Verifica da Terminale:

```bash
python3 --version
```

Su macOS è comune usare `python3` invece di `python` (dipende dalla configurazione).

---

## Scegliere un editor leggero: Zed

Per iniziare ti serve un editor che:
- evidenzi la sintassi
- ti aiuti con completamento e formattazione
- non sia pesante

**Zed** è un editor moderno e snello, ottimo se vuoi reattività anche su macchine non recentissime.

### Installazione rapida
- Vai su **zed.dev**
- Scarica la versione per il tuo sistema (su macOS scegli tra Apple Silicon e Intel)
- Installa normalmente

---

## Configurazioni minime consigliate in Zed

### 1) Aumenta la dimensione del font
Una cosa banale che migliora subito comfort e leggibilità:
- Menu → **Settings** → **Appearance** → **Font size**

Un valore intorno a **18** è spesso un buon punto di partenza.

### 2) Tema
Puoi cambiare tema dal menu o con scorciatoia:
- **Ctrl + K** poi **Ctrl + T** (apre il selettore temi)

### 3) Estensioni
Le estensioni sono l’equivalente dei plugin: aggiungono temi, supporto linguaggi, miglioramenti.

Esempio pratico: installare un tema come **One Dark Pro**
- Menu → **Extensions**
- Cerca “One Dark Pro” → Install
- Selezionalo dai temi

Dopo l’installazione di estensioni, spesso conviene **riavviare l’editor**.

---

## Il primo file Python: “Hello, world” fatto bene

1. In Zed crea un nuovo file.
2. Scrivi:
   ```python
   print("Hello, world")
   ```
3. Salva il file in una cartella dedicata (consigliato) ad esempio `Python/`.
4. Nome file: **qualcosa.py** (l’estensione `.py` è obbligatoria)
   - esempio: `hello.py`

A questo punto puoi eseguirlo da terminale entrando nella cartella dove l’hai salvato e lanciando:

- Windows (spesso funziona anche con `python`):
  ```powershell
  py hello.py
  ```

- macOS / Linux:
  ```bash
  python3 hello.py
  ```

Se vedi stampato “Hello, world”, hai completato la pipeline base: **scrittura → salvataggio → esecuzione**.

---

## Sintesi e implicazione pratica

Partire con Python non è solo “installare un linguaggio”: è costruire un flusso affidabile.

- Interprete installato e raggiungibile da terminale (PATH) → meno errori “non riconosciuto come comando”.
- Editor configurato (font, tema, estensioni essenziali) → più comfort e meno attrito.
- Primo `.py` eseguito correttamente → base solida per passare a variabili, input, condizioni e poi progetti reali.

Se questo setup è stabile, tutto ciò che viene dopo (script, tool, automazioni) diventa molto più semplice e soprattutto ripetibile.
