---
title: "Figma Motion: come costruire una micro‑animazione “da UI” (e esportarla in MP4)"
subtitle: "Timeline, keyframe, easing, maschere con Clip content e piccoli trucchi per motion pulito direttamente in Figma."
description: "Figma Motion introduce una timeline keyframe-based che permette di creare brevi animazioni e esportarle come video MP4. In questo articolo vediamo un flusso di lavoro pratico per realizzare una micro‑animazione in stile UI: progress bar, testo che “sale” mascherato, linee che si disegnano, un reveal di scena con scala/rotazione e un indicatore circolare con path trim."
publishedAt: 2026-06-26
tags: ["Figma Motion","keyframe e timeline","easing e curve","clip content (maschere)","progress bar animata","path trim su stroke"]
---
Figma Motion porta dentro Figma un paradigma molto familiare a chi fa animazioni: **timeline + keyframe + easing**. Il risultato non è solo una preview “carina”: si può arrivare a un output **esportabile in MP4**, utile per mini promo, hero animate, walkthrough di interfacce e micro‑interazioni da presentazione.

Qui sotto trovi un flusso di lavoro concreto (e replicabile) per costruire una micro‑animazione in stile UI, con alcuni pattern che tornano identici anche quando poi passi a CSS/GSAP.

---

## 1) Imposta il canvas come se stessi facendo un video
Per partire puliti:

- Crea un **Frame 1920×1080** (Full HD). Se ti serve 4K, scala di conseguenza.
- Scegli uno sfondo chiaro e neutro (es. `#E8F1F7`), così le animazioni “flat” risultano leggibili.

L’idea: stai progettando una scena, non una schermata statica. Quindi lavora già con gerarchia visiva e spaziatura.

---

## 2) Costruisci una progress bar “a due layer”
La progress bar più semplice e più controllabile in motion è fatta da **due rettangoli**:

1. **Track** (background): un rettangolo bianco con **corner radius** generoso.
2. **Fill** (progress): un rettangolo sopra, colorato (es. un blu primario).

Suggerimento pratico: invece di animare due elementi separati da zero, **anima il track** e poi **duplica** quel rettangolo per ottenere il fill con la stessa identica struttura (e, se vuoi, gli stessi keyframe di base).

---

## 3) Apri la timeline Motion e ragiona per “end state”
Nel pannello Motion trovi una timeline keyframe-based. Un approccio comodo in UI motion è:

- Mettere il layout già nella **posizione finale** (end state).
- Inserire i keyframe sullo stato finale.
- Tornare indietro nel tempo e impostare lo **stato iniziale**.

Esempio: per far “comparire” la progress bar puoi keyframare la **Width**.

- Keyframe della width sullo stato finale.
- All’inizio porta la width a **0**.

Questo pattern è velocissimo e molto leggibile quando torni a mettere mano all’animazione dopo qualche giorno.

### Auto-keyframe: utile ma pericoloso
L’auto-keyframing fa risparmiare click, ma è anche un ottimo modo per aggiungere keyframe involontari e ritrovarti a “cacciare” valori nella timeline. Se stai costruendo una scena con molti elementi, spesso conviene essere espliciti.

---

## 4) L’easing non è un dettaglio: è *la* qualità percepita
Di default molte animazioni risultano “meccaniche” perché lineari. Il salto di qualità arriva quando curi:

- **Durata**
- **Easing** (ease in / ease out / ease in-out)
- **Curve personalizzate** (spostando le maniglie)

Regola empirica utile:
- **Ease out** quando qualcosa entra e “si assesta” (parte veloce, finisce lento).
- **Ease in** quando qualcosa esce o accelera via.
- **Ease in-out** per movimenti più “organici” e centrati.

Se devi scegliere una sola cosa su cui perdere tempo, scegli l’easing: è ciò che separa un motion “ok” da uno convincente.

---

## 5) Stagger: animazioni semplici, risultato più ricco
Una delle tecniche più efficaci con poco sforzo è lo **stagger**:

- Duplica l’elemento (es. fill sopra il track).
- Trascina i suoi keyframe leggermente avanti nel tempo.

Stessa animazione, ma con ritmo. In UI motion funziona quasi sempre.

---

## 6) Testo che entra “dal basso” con maschera (Clip content)
Questo è un grande classico e vale oro anche fuori da Figma.

Per animare un testo tipo “Analyzing lab results” senza vederlo scorrere fuori contesto:

1. Seleziona il testo e fai **Frame selection**.
2. Sul frame abilita **Clip content** (diventa una maschera).
3. Anima la **Y** del testo: nello stato iniziale è più in basso (nascosto), nello stato finale è in posizione.

Risultato: il testo “sale” e viene rivelato solo dentro la finestra del frame.

---

## 7) Linee che si “disegnano” con la width a 0
Per dare struttura alla scena, puoi aggiungere linee sottili (orizzontali/verticali) e animarle così:

- Keyframe sulla **Width** (anche su più linee insieme).
- All’inizio width = **0**.
- Poi anticipa o ritarda i keyframe per decidere *quando* entrano.

È un trucco minimale ma molto UI-like: richiama pattern di skeleton/loading e layout reveal.

---

## 8) Anima un gruppo/frame intero per un ingresso “morbido”
Quando hai più elementi che devono entrare insieme (progress bar + testo + linee), conviene:

- Selezionarli tutti → **Frame selection**
- Animare il frame contenitore in **Scale**

Tipico setup:
- End state: scale 100%
- Start state: scale leggermente ridotto (es. 90–95%)

Così tutto entra con coerenza senza dover micro‑regolare ogni layer.

---

## 9) Inserisci un “beat” intermedio: progress radiale con Path Trim
Per rendere la scena più interessante puoi aggiungere un indicatore circolare, stile radial progress.

### Come si costruisce
- Crea un’**ellipse** (tenendo Shift).
- Rimuovi il fill, aggiungi uno **stroke**.
- Imposta lo stroke in **Center**.
- Anima **Path trim end**: è il parametro che ti permette di “disegnare” l’arco.

Trucco: ruota l’ellisse (es. 90°) per decidere il punto di partenza del progress.

### Due cerchi: track e progress
Come per la progress bar, fai due layer:
- Cerchio sotto: track (end 100%)
- Cerchio sopra: progress (end, ad esempio, 76%)

Poi **stagger** anche qui per un effetto più naturale.

---

## 10) Numero centrale con reveal mascherato
Il valore (es. “76”) al centro del cerchio può entrare con lo stesso pattern del testo:

- Frame selection → Clip content
- Anima Y del testo per farlo emergere
- Easing: spesso un **ease out** leggermente enfatizzato è quello che “legge” meglio

---

## Un metodo che funziona: iterazione rapida sul playhead
La parte meno glamour del motion design è anche quella più determinante: **riguardare, micro‑aggiustare, riguardare**.

In pratica, le tre leve che userai di continuo sono sempre le stesse:

1. **Durata** (troppo lungo = noioso, troppo corto = nervoso)
2. **Timing relativo** (stagger e sovrapposizioni)
3. **Easing** (per togliere rigidità e aggiungere “peso”)

---

## Sintesi e implicazione pratica
Figma Motion rende molto più immediato costruire micro‑animazioni “da UI” senza cambiare strumento: timeline, keyframe, maschere tramite Clip content, animazioni di width/scale e path trim coprono già una fetta enorme dei pattern che usiamo ogni giorno in interfacce moderne.

La differenza tra un risultato mediocre e uno credibile, però, non è nei widget: è nella disciplina su **easing, durata e iterazione sul timing**. Se ti alleni su una scena semplice (progress bar + reveal testo + beat radiale), stai già costruendo la base per motion più complessi — e soprattutto riutilizzabili in contesti reali di prodotto.
