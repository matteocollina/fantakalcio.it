---
title: "Cosa succede davvero quando clicchi un link (in Chrome)"
subtitle: "Dalla rete al rendering: DNS, TCP, HTTP, TLS e i motori Blink/V8 fino ai pixel sullo schermo."
description: "Un clic su un link innesca una catena di passaggi ben precisi: il browser si appoggia allo stack di rete del sistema operativo, risolve il dominio via DNS, negozia connessioni TCP e (spesso) TLS, scambia richieste/risposte HTTP e infine trasforma HTML/CSS/JS in una pagina renderizzata tramite Blink, V8 e Skia. Ecco il percorso completo, spiegato con un taglio pratico per chi fa frontend."
publishedAt: 2026-07-23
tags: ["dns","http-e-headers","tls","blink","v8"]
---
Cliccare un link sembra un gesto banale. In realtà, quel clic avvia una sequenza di passaggi che attraversa sistema operativo, rete, protocolli e motori di rendering, fino a produrre i pixel che vedi a schermo. Capire questa pipeline aiuta a ragionare meglio su performance, sicurezza e perché a volte “la pagina è lenta” anche quando il codice è semplice.

## 1) Dal clic al sistema operativo: il browser delega la rete
Quando attivi un link, Chrome deve ottenere **le risorse** necessarie a mostrare e rendere interattiva la pagina (HTML, CSS, JavaScript, immagini, font, dati…).

Un punto spesso sottovalutato: il browser non gestisce tutto “in casa”. Per stabilire una connessione di rete si appoggia allo **stack di rete del sistema operativo** (Android, Windows, macOS, Linux…).

Lo stack di rete del sistema operativo, a sua volta, dialoga con l’**hardware di rete** del dispositivo (scheda Wi‑Fi, modem cellulare, Ethernet). In base alla connettività disponibile, il traffico verrà instradato attraverso l’ISP e Internet verso i server giusti.

## 2) Trovare il server: la risoluzione DNS
Prima di parlare con un server, bisogna sapere *dove* si trova.

Gli esseri umani cliccano domini come `cats.example`. Le macchine però comunicano usando indirizzi numerici (IP), ad esempio `142.250.187.211`.

Qui entra in gioco il **DNS (Domain Name System)**: Chrome chiede a uno o più **DNS server** di tradurre il nome di dominio in un indirizzo IP. Solo dopo questa risoluzione il browser può iniziare la connessione verso il computer (o il cluster) che ospita le risorse richieste.

## 3) Aprire il “canale” di trasporto: TCP/IP e la sessione
Ottenuto l’IP, il browser deve negoziare una connessione affidabile con il server. Questo passaggio si basa sulle regole della suite **TCP/IP**.

- **IP** riguarda l’instradamento dei pacchetti nella rete.
- **TCP** fornisce un canale affidabile (ordinamento, ritrasmissioni, controllo congestione…).

L’avvio di una connessione TCP prevede un **handshake** (scambio iniziale di messaggi) che porta alla creazione di una **sessione TCP**: un meccanismo stabile su cui poi “viaggeranno” richieste e risposte.

## 4) Scambiare richieste e risposte: HTTP sopra TCP
Una volta esistente la connessione di trasporto, si passa al livello applicativo: **HTTP**.

Una richiesta HTTP è essenzialmente testo (più un corpo opzionale) costruito secondo regole precise: metodo, URL, versione, **header**, ecc. Il server risponde con un contenuto (HTML, CSS, immagine, JSON…) e i relativi metadati.

### A cosa servono gli header (e perché ti interessano)
Gli **header** trasportano informazioni accessorie fondamentali: caching, compressione, content type, policy di sicurezza e, molto spesso, anche i **cookie** (in request e/o response). Per un frontend, questi dettagli impattano su:

- autenticazione e sessioni
- caching e prestazioni percepite
- CORS e integrazioni con API
- sicurezza (CSP, HSTS, ecc.)

## 5) La sicurezza: TLS prima di parlare “davvero”
Nella maggior parte dei casi oggi si naviga in **HTTPS**, cioè HTTP con **TLS (Transport Layer Security)**.

TLS aggiunge un’ulteriore fase di negoziazione (un “handshake” più articolato) prima che i dati applicativi inizino a fluire. Lo scopo è evitare intercettazioni e manomissioni: browser e server stabiliscono crittografia e verificano l’identità (certificati), riducendo la possibilità che qualcuno “ascolti” o alteri la comunicazione.

Questo passaggio comporta **round trip** aggiuntivi: motivo per cui latenza e qualità della rete incidono anche quando il server è velocissimo.

## 6) Arriva il codice: parsing di HTML/CSS e recupero delle risorse
Quando Chrome riceve le prime risposte (spesso l’HTML), inizia a lavorare sul contenuto.

- **HTML e CSS** vengono analizzati (parsing) per costruire le strutture interne che servono a rappresentare la pagina.
- Nel frattempo il browser scopre ulteriori dipendenze (foglio CSS esterno, immagini, font, script…) e avvia nuove richieste HTTP per scaricarle.

È qui che la progettazione delle risorse (numero di request, dimensioni, caching) si traduce direttamente in tempi di caricamento.

## 7) JavaScript e WebAssembly: entra in scena V8
Per JavaScript (e WebAssembly) Chrome usa **V8**, il motore di esecuzione.

In pratica:
- il browser analizza e compila/esegue JS
- lo script può modificare il DOM, applicare logica, fare fetch, aggiornare lo stato UI
- questi cambiamenti possono innescare nuovi cicli di layout/paint

Per il frontend, questo è il punto dove “il caricamento” smette di essere solo rete e diventa anche CPU: bundle pesanti e runtime costosi possono rallentare anche con una connessione ottima.

## 8) Dal codice ai pixel: Blink, layout, paint e grafica
Il componente che trasforma HTML/CSS/JS e risorse in una pagina visibile e interattiva è il **motore di rendering**. In Chrome (e negli altri browser basati su Chromium) è **Blink**.

Dopo parsing ed esecuzione degli script, Blink passa alla fase di **rendering**: calcolo del layout e disegno della pagina.

Per il rendering grafico Chrome usa **Skia**, un motore grafico che interagisce con l’hardware del dispositivo. A seconda dei contenuti, entrano in gioco anche librerie e API specializzate: ad esempio **WebGL** per grafica 2D/3D interattiva.

## Mettere tutto insieme: la catena completa in una frase
Clicchi un link → Chrome usa lo stack di rete del sistema operativo → risolve il dominio via DNS → apre una connessione TCP (spesso negoziando prima TLS) → scambia richieste e risposte HTTP per ottenere le risorse → Blink analizza HTML/CSS e orchestra il rendering → V8 esegue JavaScript/WebAssembly → Skia (e altre librerie) disegna il risultato sullo schermo.

## Sintesi pratica per chi fa frontend
Quando una pagina “ci mette”, il collo di bottiglia di solito cade in uno di questi tre blocchi:

1. **Rete**: DNS/TCP/TLS/HTTP, latenza e numero/peso delle risorse.
2. **Parsing + dipendenze**: ordine e modalità di caricamento di CSS/JS/font/immagini.
3. **Esecuzione e rendering**: costo di JavaScript, layout complessi, paint frequenti.

La prossima volta che ottimizzi una pagina, prova a pensare al clic come all’avvio di una pipeline: ridurre round trip e byte scaricati è importante, ma altrettanto lo è minimizzare il lavoro che la CPU deve fare per trasformare quel codice in interfaccia realmente utilizzabile.
