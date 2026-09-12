---
title: "Intro agli shader con JavaScript e p5.js: capire davvero GPU, GLSL e pipeline (WebGL2)"
subtitle: "Dalla differenza CPU/GPU al primo frammento di GLSL che colora (e anima) ogni pixel, senza magia nera."
description: "Una guida introduttiva agli shader pensata per chi parte da zero: cosa sono, perché sono veloci, come funziona la pipeline vertex/fragment in WebGL2 e come impostare un progetto p5.js con shader GLSL. Arriviamo fino a gradienti basati sulle coordinate e al primo passo verso l’animazione con uniform come il tempo."
publishedAt: 2026-07-15
tags: ["shader-fragment","webgl2-glsl300es","p5js-webgl","uniform-tempo","pipeline-gpu"]
---
Gli shader sono uno di quei confini che, una volta attraversati, cambiano il modo in cui pensi la grafica: non “disegni forme” chiamando funzioni, ma **scrivi una regola matematica che viene eseguita in parallelo su milioni di pixel**. Risultato: effetti ricchi, fluidi, spesso impossibili da ottenere con la stessa efficienza sulla CPU.

In questo articolo mettiamo ordine sulle basi: **cos’è uno shader**, come funziona la **pipeline GPU** (vertex e fragment), perché la mentalità è diversa da un normale sketch p5.js e come creare un setup minimale in **p5.js + WebGL2 + GLSL (300 es)** per arrivare a gradienti e alle prime animazioni con le *uniform*.

---

## Perché gli shader sono così veloci (e cosa perdi in cambio)

La differenza non è “solo” una questione di librerie: è architettura.

- **CPU (Central Processing Unit)**: eccellente su logica complessa e task seriali. È come un artigiano: bravissimo, ma se deve ripetere la stessa operazione migliaia di volte una per una, si satura.
- **GPU (Graphics Processing Unit)**: progettata per lavorare su **griglie enormi di dati in parallelo**. È come una fabbrica con migliaia di postazioni identiche che eseguono la stessa istruzione contemporaneamente.

Uno **shader** è il codice che gira su quella “fabbrica”. Il trade-off è fondamentale: **ogni pixel (o frammento) è isolato**.

> In un fragment shader non puoi “chiedere” direttamente al pixel vicino cosa sta facendo. Ogni frammento decide il suo colore usando la stessa ricetta matematica, partendo dalle sue coordinate e dai parametri globali.

Ed è proprio questo che rende gli shader così potenti per pattern, campi di distanza, ripetizioni, noise, effetti procedurali.

---

## Il modello mentale giusto: la pipeline (vertex → fragment)

Nel flusso WebGL “classico”, il CPU-side (JavaScript) fa tre cose essenziali:

1. **Attiva il contesto WebGL** (in p5: `createCanvas(..., WEBGL)`)
2. **Carica e invia gli shader** alla GPU
3. **Invia dati a ogni frame**, principalmente:
   - *uniform* (tempo, mouse, risoluzione…)
   - geometria (vertici) da disegnare

Poi la GPU entra in scena con due stadi principali:

### 1) Vertex shader
Posiziona la geometria in spazio clip. In 2D spesso è quasi boilerplate: tipicamente disegni un rettangolo che copre tutto lo schermo.

### 2) Fragment shader
È “il pittore”: viene eseguito **una volta per pixel** e decide il colore finale.

Su una canvas 800×600 significa **480.000 esecuzioni per frame**. Su 1080p, oltre **2 milioni**. Questo cambia completamente l’approccio: niente loop “da CPU” per disegnare ogni cosa; **sei già dentro un loop implicito gigantesco**.

---

## Setup in p5.js: WebGL, shader esterni e caricamento async

Con p5 in modalità WebGL:

```js
function setup() {
  createCanvas(400, 400, WEBGL);
}
```

Nota importante: in WEBGL l’origine è al centro della canvas. Se provi a fare un rettangolo “alla vecchia maniera” (`rect(0,0,width,height)`), lo vedrai spostato. In p5 puoi compensare usando coordinate centrate oppure lavorare direttamente con un quad full-screen tramite shader.

Per caricare shader esterni (`.vert` e `.frag`) con le versioni recenti è comune usare `async/await` invece del vecchio `preload()`.

Concettualmente:

- crei `shader.vert` e `shader.frag`
- li carichi
- in `draw()` abiliti lo shader con `shader(myShader)`

---

## GLSL: regole che è meglio sapere subito

GLSL è più rigido di JavaScript:

- ogni statement finisce con `;`
- è **statically typed**: `float`, `int`, `vec2`, `vec3`, `vec4`…
- una costante come `1` spesso deve essere `1.0` se ti serve un `float`
- devi dichiarare la precisione (specialmente nel fragment):

```glsl
precision mediump float;
```

### Vettori e “swizzling”
I vettori sono centrali e comodi:

- `vec3(1.0)` inizializza tutti i canali a `1.0`
- accesso per semantica: `.xyzw` o `.rgba` (intercambiabili)
- swizzle: `color.bgr` scambia canali; `pos.xy` estrae un `vec2` da un `vec3`

---

## WebGL2 moderno: `#version 300 es`

Se usi la sintassi WebGL2/GLSL ES 3.0, la prima riga di **entrambi** i file shader deve essere:

```glsl
#version 300 es
```

In questa versione cambia anche il modo di dichiarare input/output (si usano `in` e `out`, e nel fragment non c’è più `gl_FragColor`: devi dichiarare tu una variabile di output).

---

## Vertex shader minimale per un quad (con passaggio coordinate)

In 2D spesso vuoi solo passare coordinate al fragment shader.

Esempio di struttura:

```glsl
#version 300 es

in vec3 aPosition;

out vec2 vPos;

void main() {
  // p5 può fornire coordinate in range 0..1: per clip space serve -1..1
  vec4 position = vec4(aPosition, 1.0);
  position.xy = position.xy * 2.0 - 1.0;

  vPos = aPosition.xy;
  gl_Position = position;
}
```

Due punti chiave:

- `gl_Position` deve essere un `vec4`
- se i tuoi input arrivano normalizzati 0..1 e ti servono in clip space, fai il remap con `*2 - 1`

---

## Fragment shader: dal colore piatto al gradiente “gratis”

Qui succede la magia pratica: una volta che hai coordinate per pixel, puoi creare gradienti senza disegnare nulla “a mano”.

```glsl
#version 300 es
precision mediump float;

in vec2 vPos;
out vec4 fragColor;

void main() {
  fragColor = vec4(vPos.x, 0.0, vPos.y, 1.0);
}
```

Questo produce un gradiente dove:

- il rosso cresce andando verso destra (`vPos.x`)
- il blu cresce andando verso l’alto (`vPos.y`)

Nessun loop esplicito: ogni pixel usa le proprie coordinate e calcola il colore localmente.

---

## Animare: la prima uniform (tempo)

Per far “muovere” uno shader serve un parametro che cambi nel tempo. L’approccio tipico è:

- JavaScript invia un valore (tempo) ogni frame
- lo shader lo riceve come `uniform float` e lo usa nelle formule

In p5, concettualmente:

```js
myShader.setUniform("uTime", millis());
```

Nel fragment shader:

```glsl
uniform float uTime;
```

Da lì puoi iniziare a usare `sin`, `cos`, rotazioni, traslazioni, domain repetition… e trasformare un gradiente statico in un pattern vivo.

---

## Sintesi: cosa portarti a casa (subito)

1. Uno shader è **codice per GPU**: massima parallelizzazione, pixel isolati.
2. La pipeline base è **vertex (posiziona)** → **fragment (colora)**.
3. In 2D il vertex shader spesso è boilerplate; la creatività sta nel fragment.
4. In WebGL2 usa `#version 300 es`, `in/out`, e dichiara `fragColor`.
5. Con coordinate + uniform (tempo) hai già gli ingredienti per passare da “disegno” a **grafica procedurale animata**.

La parte interessante arriva quando smetti di pensare in termini di primitive (cerchi, rettangoli) e inizi a pensare in termini di **funzioni sullo spazio**: distanza dal centro, ripetizioni del dominio, soglie morbide, palette. È lì che gli shader diventano un vero strumento creativo — e anche una scelta tecnica concreta quando vuoi performance e fluidità.
