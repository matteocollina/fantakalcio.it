---
title: "Costruire un “giudice” LLM davvero affidabile: etichette esperte, metriche giuste e test finali"
subtitle: "Dalla qualità delle label alla valutazione con kappa, precision/recall e F1: una pipeline di eval che regge in produzione."
description: "Un giudice LLM può sembrare “accurato” e fallire clamorosamente sul campo. In questo articolo vediamo come portare la valutazione a livello produzione: etichette di dominio, UI di labeling, controllo dell’accordo tra valutatori con Cohen’s kappa, metriche robuste (precision, recall, F1), bootstrapping e un dataset di esame finale per evitare overfitting."
publishedAt: 2026-05-14
tags: ["valutazione-llm","cohens-kappa","precision-recall","f1-score","data-labeling"]
---
Quando si costruisce un *LLM judge* (un modello o prompt che valuta l’output di un altro sistema), la tentazione è misurare tutto con una metrica semplice e dichiararsi soddisfatti. In pratica, però, un giudice “ok in laboratorio” può diventare un rischio in produzione: promuove contenuti problematici, penalizza risposte corrette o, peggio, sembra performante solo perché il dataset è sbilanciato.

Qui raccolgo un approccio pragmatico per portare un judge a un livello *production-grade*: dati etichettati bene, rubriche solide, metriche che non mentono e una strategia di test che riduce l’overfitting.

---

## 1) La qualità delle etichette batte la quantità (di molto)
Un judge è forte quanto lo sono le sue etichette. E nel caso di valutazioni “di qualità” (sicurezza, conformità, stile, factuality, policy interne, tono brand, ecc.) spesso servono competenze di dominio.

Un punto controintuitivo ma fondamentale:

- **30 etichette di alta qualità da un esperto** spesso valgono più di **300 etichette “medie”**.

Questo non significa che la scala non conti, ma che la *rumorosità* delle label non esperte può distruggere il segnale che il judge dovrebbe imparare a riconoscere.

### Ottimizzare il tempo dell’esperto
Il labeling manuale costa; quindi conviene massimizzare il tempo dell’esperto con due strategie che funzionano bene:

1. **Una UI di labeling minimalista**: pochi click, rubriche sempre visibili, esempi di riferimento. Ridurre l’attrito aumenta coerenza e velocità.
2. **Pre-labeling assistito**: far generare una prima bozza di etichetta (o motivazione) e chiedere all’esperto di *verificare/correggere*. Verificare è spesso più rapido che partire da zero.

---

## 2) Se hai un solo esperto, misura la stabilità nel tempo
Idealmente vuoi più valutatori, ma non sempre è possibile. Se ne hai uno soltanto, c’è un rischio: stai “allenando” e misurando una singola opinione, che può variare con il contesto, la stanchezza o una comprensione che evolve.

Una pratica semplice:

- **Rietichettare “alla cieca” ~10% dei dati una settimana dopo** e misurare quanto l’esperto è coerente con sé stesso.

Se la stabilità è bassa, il problema quasi sempre è la rubrica: è troppo ambigua o lascia troppo spazio a interpretazioni.

---

## 3) Quando hai più esperti, i disaccordi sono oro
I disaccordi non sono solo rumore: sono una mappa precisa di ciò che la tua rubrica non sta definendo bene.

- Se due esperti divergono regolarmente su certi casi, lì hai bisogno di:
  - definizioni più operative (criteri osservabili)
  - esempi positivi/negativi “canonici”
  - regole di priorità (cosa prevale tra criteri in conflitto)

### Non misurare l’accordo con la sola percentuale
La percentuale di accordo è fuorviante: anche due persone che “tirano a caso” possono concordare molto, soprattutto su dataset sbilanciati.

Una metrica più sensata è **Cohen’s kappa**, che corregge l’accordo atteso “per fortuna”.

- **Accordo %**: facile da leggere, ma inganna.
- **Kappa**: ti dice quanto l’accordo supera il caso.

Se kappa è bassa, prima di “fixare il modello” devi quasi sempre “fixare la rubrica” (o il processo di labeling).

---

## 4) Accuratezza alta non significa judge buono
Supponiamo che il tuo judge “matchi” gli esperti nel 90% dei casi: sembra ottimo. Ma può essere un miraggio.

Esempio classico: dataset con molti casi “OK” e pochi casi “BAD”. Un giudice pigro che risponde sempre “OK” potrebbe ottenere un’accuratezza altissima… e fallire *tutti* i casi davvero importanti (tossicità, policy violation, ecc.).

Per questo, per i judge conviene ragionare in termini di:

- **Recall**: quante cose “cattive” riesco a intercettare?
- **Precision**: quante volte segnalo “cattivo” quando è davvero cattivo?

Spesso aumentando il recall (diventi più severo) peggiori la precision (più falsi positivi). La metrica che ti aiuta a bilanciare è:

- **F1 score**: combina precision e recall in un unico numero.

> Se il tuo use case è safety-critical, potresti preferire massimizzare il recall anche a costo della precision. Se invece il costo dei falsi positivi è alto (es. moderazione che blocca contenuti innocui), potresti spingere sulla precision.

---

## 5) Dimostra che i risultati non sono “fortuna”: bootstrapping
Anche con metriche corrette, un campione piccolo può dare risultati instabili. Un modo pratico per stimare l’incertezza è il **bootstrapping**:

- ricampi ripetutamente il dataset (con reinserimento)
- ricalcoli le metriche
- ottieni una distribuzione (e quindi intervalli/confidenza)

Questo ti aiuta a capire se un miglioramento è reale o solo un colpo di fortuna sul dataset.

---

## 6) Il “final exam” segreto: prevenire overfitting della valutazione
Quando iteri su rubriche, prompt e modelli, rischi di ottimizzare indirettamente sul dataset di valutazione. Il risultato: metriche splendide… ma solo lì.

La contromossa è semplice e molto efficace:

- tieni un **dataset finale “segreto”** (non usato durante tuning e discussioni)
- lo usi come **esame finale** prima di promuovere il judge

Se il judge crolla sull’esame finale, non è pronto. Se regge, hai un segnale molto più credibile di generalizzazione.

---

## 7) Non aspettare la perfezione: inizia con una baseline misurabile
Costruire un’intera pipeline di eval può sembrare enorme. Ma l’approccio che funziona davvero è incrementale:

1. **Uno o due test rule-based** (anche banali) per coprire casi critici.
2. **Un judge semplice** con una rubrica minimale.
3. **Un ciclo di misura → correzione → misura**, usando metriche giuste.

Appena hai una baseline, recuperi “potere” da ingegnere: non stai più discutendo in astratto della qualità dell’AI, la stai **misurando**. E ciò che puoi misurare puoi migliorare, automatizzare e rilasciare con maggiore confidenza.

---

### Checklist rapida (da tenere a portata)
- [ ] Label di dominio: poche ma buone
- [ ] UI o pre-labeling per velocizzare l’esperto
- [ ] Stabilità intra-rater se c’è un solo esperto
- [ ] Cohen’s kappa per accordo tra etichettatori
- [ ] Precision/Recall/F1 (non solo accuracy)
- [ ] Bootstrapping per robustezza statistica
- [ ] Dataset “final exam” separato e intoccabile