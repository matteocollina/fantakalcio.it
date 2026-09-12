---
title: "Guida 2026 all’ottimizzazione di React Native: una checklist pragmatica per app più veloci"
subtitle: "Performance come disciplina: misurare, isolare i colli di bottiglia e intervenire dove conta davvero (UI, JS, rete e startup)."
description: "Una guida operativa all’ottimizzazione di React Native nel 2026: come impostare una strategia di performance, cosa misurare, come ridurre re-render, alleggerire liste e immagini, migliorare startup e networking, e quali pratiche rendono i risultati stabili nel tempo."
publishedAt: 2026-06-22
tags: ["performance-react-native","profiling-flipper","rendering-react","liste-virtualizzate","ottimizzazione-startup"]
---
## Perché parlare di ottimizzazione (ancora) nel 2026
React Native è maturato molto, ma la performance resta una responsabilità “di progetto”, non un interruttore che si attiva a fine sviluppo. La differenza tra un’app che “sembra ok” e una che risulta davvero fluida sta quasi sempre in una manciata di aree ricorrenti: rendering e re-render, liste, immagini, startup, eccesso di lavoro sul thread JS, networking e gestione dello stato.

L’obiettivo di questo articolo è offrire una checklist concreta e ripetibile: come misurare, come individuare i colli di bottiglia, e quali interventi tendono a dare il miglior rapporto impatto/complessità.

---

## 1) Prima regola: ottimizzare solo ciò che sai misurare
Qualsiasi strategia sensata parte da due domande:

- **Qual è l’esperienza che deve migliorare?** (scroll, transizioni, input lag, time-to-interactive, consumo batteria)
- **Dove si spende tempo?** (JS thread, UI thread, bridge/JNI, rete, parsing, layout)

### Metriche utili da tenere a mente
- **Startup**: tempo fino a primo frame utile e tempo fino a interazione.
- **Fluidità UI**: frame drops durante scroll/animazioni.
- **Re-render**: quante volte si ridisegnano componenti e perché.
- **Costo liste**: quantità di elementi montati, riciclati, misurazioni di layout.
- **Immagini**: dimensioni, decode, caching, overdraw.

Strumenti e approccio cambiano da team a team, ma il pattern è lo stesso: **profilare → isolare → intervenire → verificare**.

---

## 2) Rendering: ridurre re-render inutili è quasi sempre la leva #1
Molti problemi di performance in React Native non sono “lenti di sistema”, ma **render e riconciliazione che avvengono troppo spesso**.

### Cose che in genere peggiorano le performance
- Props che cambiano identità a ogni render (oggetti, array, funzioni inline).
- State globale usato “a grana grossa”, che fa aggiornare troppo UI.
- Computazioni pesanti dentro render (mapping, sorting, filtering).

### Interventi tipici ad alto ROI
- **Stabilizzare riferimenti** con `useMemo`/`useCallback` quando serve (senza trasformare il codice in una “giungla di hook”).
- **Spezzare componenti**: isolare sotto-alberi che non devono aggiornarsi.
- **Memoizzazione mirata** con `React.memo` sui componenti costosi o ripetuti.
- **Derivare valori fuori dal render**: precomputare, cache, selettori efficienti.

Regola pratica: se uno schermo “pesa”, la prima cosa da controllare è *quante volte renderizza* e *cosa lo fa renderizzare*.

---

## 3) Liste: FlatList funziona, ma va trattata con rispetto
Quando un’app “scatta”, spesso è una lista: feed, cataloghi, chat, timeline.

### Checklist per liste fluide
- Impostare **`keyExtractor`** stabile.
- Evitare item troppo complessi: meno view nidificate, meno ombre, meno layout dinamici.
- Usare **`getItemLayout`** quando l’altezza è prevedibile.
- Curare `windowSize`, `initialNumToRender`, `maxToRenderPerBatch` (profilando: valori aggressivi possono peggiorare).
- **Separare l’item** in un componente memoizzato (e assicurarsi che le props siano stabili).

### Attenzione a immagini e misurazioni
Le immagini dentro una lista sono spesso la causa reale: decode/caching e layout che ricalcola. Se una lista ha immagini, considera la performance “immagini-first”, non “lista-first”.

---

## 4) Immagini: peso, decode e caching contano più del numero
Un’app con immagini non ottimizzate può sembrare lenta anche con UI perfetta.

Interventi tipici:
- Servire immagini **della dimensione giusta** (evitare 3000px per un thumbnail).
- Preferire formati e pipeline che riducono peso e tempi di decode.
- Usare **caching** coerente e strategie di prefetch dove ha senso.
- Evitare animazioni o resize continui che costringono a ricalcoli e ridisegni.

---

## 5) Animazioni: separare ciò che deve stare sulla UI
Le animazioni e le gesture devono restare fluide anche quando JS è occupato. Nel 2026 la direzione è chiara: **spostare lavoro e sincronizzazioni dove non bloccano la UI**.

Checklist pratica:
- Evitare di legare animazioni ad aggiornamenti frequenti di stato React.
- Minimizzare il traffico tra thread durante gesture.
- Tenere l’albero di componenti animati semplice e prevedibile.

---

## 6) Startup e navigazione: “percepito” batte “teorico”
La velocità di avvio è un mix di bundle, inizializzazioni, font, storage, networking e rendering iniziale.

Interventi utili:
- **Ridurre lavoro all’avvio**: inizializzare in lazy ciò che non serve subito.
- Caricare dati in modo progressivo: prima UI utile, poi il resto.
- Evitare di montare subito sezioni non visibili (tab secondarie, modali pre-montate).

Anche la navigazione pesa: transizioni, mount di schermate e fetch simultanei vanno orchestrati.

---

## 7) Stato e data layer: aggiornamenti piccoli e selettivi
Una gestione dello stato inefficiente crea re-render “a cascata”. In generale:
- Preferire **selettori** e sottoscrizioni granulari.
- Evitare di far dipendere intere schermate da un unico oggetto globale che cambia spesso.
- Normalizzare dati e aggiornare solo ciò che serve.

---

## 8) Networking: meno richieste, risposte più leggere
La performance non è solo rendering: spesso è “attesa”.

Buone pratiche:
- Deduplicazione e caching delle richieste.
- Payload più piccoli (campi minimi, compressione lato server quando possibile).
- Evitare fetching ridondante tra schermate.

---

## Una checklist rapida (da tenere nel PR template)
1. Ho misurato prima/dopo (startup, scroll, re-render)?
2. Ho eliminato re-render inutili (props stabili, memo dove serve)?
3. Liste: item component memoizzato, `keyExtractor`, parametri di rendering verificati?
4. Immagini dimensionate/cachate correttamente?
5. Animazioni e gesture non dipendono da state React ad alta frequenza?
6. All’avvio carico solo il necessario?
7. Stato: aggiornamenti granulari, selettori efficienti?
8. Rete: caching, payload snello, niente fetch duplicati?

---

## Sintesi conclusiva
Ottimizzare React Native nel 2026 significa essere sistematici: **profilare, trovare un collo di bottiglia reale, intervenire con una modifica piccola ma mirata, e verificare l’impatto**. Nella pratica, i miglioramenti più consistenti arrivano quasi sempre da tre aree: **riduzione dei re-render**, **liste e immagini trattate come componenti “critici”**, e **startup alleggerito**.

Se queste tre leve sono sotto controllo, il resto (animazioni, data layer, rete) diventa un lavoro di rifinitura che consolida la fluidità e rende l’app stabile nel tempo.
