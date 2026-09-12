---
title: "Non è over‑engineering: è solo codice che non conosci ancora"
subtitle: "Quando la “leggibilità” diventa resistenza al cambiamento, la soluzione non è tornare indietro ma normalizzare i pattern moderni (con criterio)."
description: "Spesso etichettiamo come over‑engineered ciò che è semplicemente nuovo ai nostri occhi: funzioni CSS usate in modo inusuale, logical properties, pattern moderni che risolvono problemi reali (come overflow e layout fragili). Il punto non è evitare le novità, ma ridurre l’attrito: educazione, convenzioni condivise e adozione progressiva. Così ciò che oggi sembra “difficile da leggere” domani diventa standard di team."
publishedAt: 2026-04-21
tags: ["css-modern","logical-properties","pattern-di-team","code-review","clamp-min-max"]
---
Capita spesso: apri una PR, vedi una riga di CSS “strana”, e la reazione istintiva è *«è difficile da leggere»*. In molti casi però non stiamo guardando del codice inutilmente complicato. Stiamo guardando qualcosa di **semplicemente non familiare**.

Questa distinzione è importante perché influenza direttamente come evolvono i nostri progetti e, soprattutto, come funziona la collaborazione: se tutto ciò che non riconosciamo al primo sguardo viene respinto, il team resta bloccato su un set di soluzioni “comode” ma non necessariamente migliori.

## Over‑engineering vs unfamiliar: come riconoscerli

### Quando è davvero over‑engineering
Parliamo di over‑engineering quando:

- la soluzione introduce complessità **senza** un problema reale da risolvere;
- aggiunge concetti o astrazioni che il progetto non userà (o userà una volta sola);
- rende difficile la manutenzione perché richiede troppe regole implicite.

In sintesi: più costo che beneficio.

### Quando è solo unfamiliar
È “unfamiliar” quando:

- la soluzione risolve un problema concreto (robustezza del layout, accessibilità, internazionalizzazione…);
- usa strumenti moderni che non fanno parte del “vocabolario” quotidiano del team;
- sembra criptica perché non abbiamo ancora creato un’abitudine visiva e mentale attorno a quel pattern.

Qui la complessità non è gratuita: è spesso **spostata** (da runtime a compile-time, da bug a prevenzione, da workaround a funzionalità nativa).

## Il punto dolente: la frizione in team e in code review

Il vero problema non è che esistano pattern moderni. È la frizione che nasce quando:

- qualcuno li introduce;
- qualcun altro li vede per la prima volta;
- la review diventa *«cambialo perché non so cos’è»*.

Questo è tossico per l’evoluzione tecnica: una code review dovrebbe valutare **correttezza, coerenza e valore**, non la sola familiarità.

Un esempio tipico: l’uso delle **logical properties** (`margin-inline`, `padding-block`, ecc.). Funzionano, sono standard, aiutano con layout più “internazionalizzabili” e coerenti con la direzione di scrittura. Eppure vengono spesso respinte solo perché “non si usano qui”.

## Normalizzare i pattern moderni: come ridurre l’attrito

La chiave è far sì che certe soluzioni diventino *attese*, non “sorprese”. Alcune leve pratiche:

### 1) Educazione mirata (non teoria infinita)
Meglio 10 minuti su *un* pattern utile che ore di panoramica. Scegliete ciò che vi serve davvero:

- logical properties quando il design lo giustifica;
- funzioni CSS (`min()`, `max()`, `clamp()`) per gestire dimensioni fluide;
- nuove unità o strategie layout quando risolvono bug ricorrenti.

### 2) Convenzioni scritte
Basta poco: una pagina di “CSS conventions” nel repo.

- *Quando* usare le logical properties.
- *Perché* preferire `min()/max()/clamp()` in certi casi.
- Esempi brevi, copiabili.

Così la review non diventa un dibattito ogni volta.

### 3) Adozione progressiva e coerente
Se un pattern è buono, usatelo in più punti coerenti, non in un solo file “esotico”. La ripetizione lo rende familiare.

Un esempio pratico: usare `min()` (o `clamp()`) per prevenire overflow e gestire dimensioni responsivi può evitare una classe intera di bug. Se diventa una scelta ricorrente, dopo poche settimane nessuno lo percepisce più come “difficile”.

### 4) Code review: cambiare la domanda
Sostituite:

- “Non lo capisco, quindi no”

con:

- “Quale problema risolve?”
- “È coerente con le convenzioni?”
- “Possiamo aggiungere un commento o una nota in docs se serve?”

La familiarità si costruisce, non si pretende.

## Una regola semplice: se funziona e riduce bug, vale la pena conoscerlo

Molte funzionalità moderne del CSS non sono “gimmick”: sono strumenti che ci permettono di scrivere layout più solidi e meno fragili, riducendo workaround e comportamenti imprevedibili.

Se un costrutto è nuovo e ti sembra illeggibile, non è automaticamente over‑engineering. Potrebbe essere solo il segnale che il team ha bisogno di **normalizzare** quel pattern: un po’ di contesto, una convenzione, qualche esempio riutilizzabile.

Alla fine, la leggibilità non è una proprietà assoluta del codice. È un accordo condiviso tra le persone che lo mantengono.
