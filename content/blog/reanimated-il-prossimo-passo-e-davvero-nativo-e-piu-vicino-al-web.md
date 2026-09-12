---
title: "Reanimated: il prossimo passo è (davvero) nativo — e più vicino al web"
subtitle: "CSS-like API, worklet potenti e un nuovo livello di integrazione con le primitive di piattaforma per spremere ogni frame."
description: "Reanimated sta chiudendo un cerchio interessante: rendere le animazioni più accessibili a chi arriva dal web con un’API “stile CSS”, senza perdere la flessibilità delle worklet, e al tempo stesso spingere forte su integrazioni native (come Core Animation su iOS) per ottenere performance best-in-class. In mezzo: stabilità, compatibilità con la nuova architettura di React Native e il tema spinoso delle shared element transitions."
publishedAt: 2026-07-07
tags: ["react-native-reanimated","animazioni-css-like","worklet-ui-runtime","core-animation-ios","shared-element-transition"]
---
Reanimated è diventato, per molti team React Native, **la** libreria di riferimento quando le animazioni smettono di essere “decorative” e iniziano a diventare parte dell’esperienza: gesture, micro-interazioni, transizioni complesse, sincronizzazioni strette con lo scroll. Negli ultimi tempi la direzione è particolarmente chiara: **chiudere il gap tra modello web e performance native**, senza rinunciare alla programmabilità che ha reso Reanimated così potente.

Di seguito i punti più interessanti per chi costruisce UI e design system in React Native.

---

## 1) Un motore per animazioni e transizioni “stile CSS”
Reanimated sta consolidando un’idea che piace molto a chi arriva dal frontend web: **un’API più vicina al modo in cui pensiamo animazioni e transizioni in CSS**.

Il vantaggio pratico è doppio:

- **Struttura familiare**: chi ha background web ritrova concetti e pattern noti.
- **Esempi quasi 1:1**: molte demo e snippet “da web” diventano traducibili in modo diretto.

Questa scelta non vuole rimpiazzare l’approccio tradizionale di Reanimated, ma aggiungere un livello più “dichiarativo” e immediato per un’ampia fetta di casi d’uso.

---

## 2) Le worklet restano: sono il superpotere
Se l’API CSS-like migliora l’ergonomia, il cuore di Reanimated rimane un altro: le **worklet**, cioè la possibilità di eseguire logica JavaScript sul **UI runtime**.

In termini pratici significa:

- poter definire animazioni guidate da logica arbitraria (non solo easing e timing);
- reagire a gesture e stati con calcoli custom;
- mantenere un controllo fine quando l’animazione diventa “sistema”, non effetto.

È un punto importante: la direzione “più web” non elimina la parte più espressiva. Anzi, l’obiettivo è offrire **entrambi i livelli**: semplicità per i casi comuni, potenza per quelli avanzati.

---

## 3) Il prossimo salto: usare le primitive native della piattaforma
La parte più ambiziosa è l’integrazione nativa sempre più profonda: invece di costruire tutto “sopra” un layer comune, Reanimated sta lavorando per **sfruttare le primitive migliori disponibili su ciascuna piattaforma**.

### Esempio concreto: iOS e Core Animation
Su iOS, Core Animation può appoggiarsi a meccanismi di threading specifici, arrivando a spostare il lavoro su un thread dedicato (il cosiddetto *Render Server* nell’ecosistema Apple). L’idea è semplice e potente:

- **meno carico sul thread principale**;
- **animazioni più fluide e stabili**;
- prestazioni **best-in-class** perché si usa ciò che il sistema operativo sa già fare benissimo.

Questa strada “chiude il cerchio”: API più accessibile (stile CSS) + worklet (massima flessibilità) + **backend nativo** (massime performance).

---

## 4) Stabilità e nuova architettura: un pain point che si sta riducendo
Un tema che ha pesato molto negli ultimi anni è stata l’adozione della **nuova architettura di React Native**. La migrazione dell’ecosistema richiede tempo, e quando una libreria è così centrale nelle UI, ogni incompatibilità si sente subito.

Il lavoro in corso punta a ridurre questo attrito attraverso una compatibilità più “di sistema” e un testing più rigoroso rispetto a cambiamenti nel core di React Native. In pratica, l’obiettivo è far sì che Reanimated si comporti come un componente affidabile dell’infrastruttura: **meno sorprese tra release**, meno regressioni, più prevedibilità.

---

## 5) Shared element transitions: la frontiera più difficile
Se c’è una categoria di animazioni che continua a mettere alla prova qualsiasi stack UI, sono le **shared element transitions**: far “viaggiare” un elemento visivo da una schermata all’altra mantenendo continuità.

Il problema non è solo tecnico, è anche concettuale: il modello React tende a considerare le view come “ancorate” al loro parent (non è naturale *riparentare* un nodo). Le shared transitions, per definizione, chiedono il contrario: **spostare** (o simulare lo spostamento di) un elemento tra due contesti.

### Snapshot vs spostamento della view reale
Sul web, molte implementazioni ragionano per *snapshot*: si cattura un’immagine dell’elemento e la si anima. È efficace… finché non entra in gioco un caso come il video.

Con i video lo snapshot non basta: perdi continuità, stato di playback, sincronizzazione. Una strategia più robusta è **muovere (o clonare) l’istanza nativa** preservandone lo stato, in modo che la riproduzione continui mentre l’elemento “transita” verso la nuova posizione.

Questo spiega perché, in ambito mobile, una parte della soluzione tende a vivere **molto vicino al nativo** (anche lato C++), pur lasciando spazio a implementazioni creative basate sulle API JavaScript.

---

## Sintesi: cosa cambia per chi costruisce UI oggi
La traiettoria è chiara e, dal punto di vista di un frontend engineer, è anche molto pragmatica:

- **Accessibilità**: un’API più vicina al modello mentale del CSS abbassa la soglia d’ingresso.
- **Potenza**: le worklet restano il livello “pro” per logiche non standard.
- **Performance**: l’integrazione con primitive native (Core Animation su iOS, e analoghi concetti su altre piattaforme) punta a rendere le animazioni più fluide e robuste.
- **Maturità**: maggiore allineamento con la nuova architettura significa meno frizioni nel tempo.

L’implicazione pratica è semplice: conviene progettare le animazioni pensando a due livelli. Un primo livello dichiarativo e “CSS-like” per la maggior parte delle transizioni di UI; un secondo livello, a worklet, per tutto ciò che è guidato da gesture, fisica custom, o vincoli non banali. E quando l’animazione deve essere impeccabile (shared transitions, video, casi edge), la direzione è quella di affidarsi sempre più a ciò che la piattaforma sa fare nativamente — senza perdere la comodità di un’API moderna in JavaScript.
