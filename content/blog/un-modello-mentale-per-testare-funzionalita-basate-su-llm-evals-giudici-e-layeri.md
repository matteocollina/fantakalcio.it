---
title: "Un modello mentale per testare funzionalità basate su LLM: evals, giudici e layering"
subtitle: "Dai test deterministici ai giudizi “esperti” automatizzati: come costruire una pipeline di qualità che regge regressioni, ottimizzazione e scelta del modello."
description: "Quando un’app frontend delega parti del comportamento a un LLM, i test tradizionali non bastano: alcune proprietà sono verificabili con regole, altre richiedono valutazioni qualitative. Vediamo un modello mentale pratico per progettare evals, usare un LLM come giudice e stratificare i test per ottenere una pipeline affidabile e automatizzata, con un ultimo passaggio di validazione umana."
publishedAt: 2026-04-21
tags: ["LLM evals","LLM-as-judge","testing stratificato","regressione prompt","selezione modelli"]
---
Quando introduci un LLM in un’applicazione, non stai solo aggiungendo una dipendenza: stai cambiando la natura di ciò che “significa” testare. Nel frontend siamo abituati a verificare comportamenti deterministici (o quasi), ma un LLM produce output che possono variare e spesso includono requisiti qualitativi: tono, adeguatezza al brand, assenza di contenuti problematici.

Serve quindi un modello mentale che colleghi le buone pratiche del testing web al mondo degli LLM, senza reinventare tutto da zero.

## Un esempio concreto: “Theme Builder”
Immagina una piccola app: l’utente inserisce **nome azienda**, **descrizione**, **pubblico** e **tono**. L’app invia questi dati a un LLM e riceve in risposta un **JSON** con:

- un **motto** coerente con il brand e il tono
- una **palette colori** che rispetti l’identità richiesta

In più ci sono vincoli importanti:

- la palette deve avere **contrasto sufficiente** per essere accessibile
- il motto deve essere **non tossico** (niente hate speech, offese, contenuti violenti o discriminatori)

Come lo testiamo in modo serio?

## Due famiglie di verifiche: regole vs giudizio
### 1) Evals basate su regole (rule-based)
Alcuni aspetti sono **oggettivi** e verificabili con codice tradizionale:

- il JSON è valido?
- rispetta lo schema atteso (chiavi presenti, tipi corretti)?
- i colori rispettano un contrast ratio minimo (es. WCAG)?

Queste sono evals deterministiche: veloci, ripetibili, ideali da far girare in CI ad ogni modifica.

### 2) Evals basate su giudizio (LLM as a judge)
Altri aspetti sono **soggettivi** o contestuali:

- il motto “suona” adatto al brand?
- il tono è davvero quello richiesto?
- la risposta è potenzialmente tossica, ambigua o inappropriata?

Qui entra in gioco un concetto chiave: usare un **LLM come giudice** per simulare un giudizio “da esperto umano” in modo automatizzabile.

Non significa accettare qualsiasi cosa dica il giudice. Significa definire criteri chiari, chiedere una valutazione strutturata (ad es. punteggi e motivazioni), e trasformare quel giudizio in un segnale testabile.

## Perché testare un sistema LLM: tre obiettivi distinti
Nel testing frontend spesso pensiamo ai test soprattutto come protezione da regressioni. Con gli LLM è utile distinguere **tre obiettivi**:

### 1) Regressione
La domanda classica: **“Ho rotto qualcosa?”**

Esempio: una piccola modifica al prompt (o a come serializzi l’input) può improvvisamente generare JSON invalido o perdere campi essenziali. I test servono a bloccare queste regressioni.

### 2) Ottimizzazione
Qui la domanda è: **“Sto davvero migliorando?”**

Quando iteri su prompt, guardrail, template o post-processing, le evals diventano la prova quantitativa che la qualità sta salendo nel tempo (o che stai scambiando qualità per velocità/costo consapevolmente).

### 3) Selezione del modello
Nel web non cambi framework ogni settimana. Con gli LLM invece l’ecosistema si muove velocemente.

Serve un approccio continuo di benchmarking per poter:

- passare a un modello più piccolo ed economico **senza perdere qualità**
- confrontare versioni nuove dello stesso modello
- scegliere il miglior compromesso costo/latency/qualità per il tuo caso d’uso

## Test layering: lo stesso principio, applicato agli LLM
La parte più “familiare” per chi fa frontend testing è questa: **stratifica i test**.

Una codebase sana non vive di un solo tipo di test. Anche una pipeline per funzionalità LLM dovrebbe avere più livelli, ciascuno con un ruolo preciso.

### Livello 1 — Unit test veloci e deterministici (rule-based)
Obiettivo: feedback immediato e robusto.

- validazione schema JSON
- parsing e fallback
- calcolo contrast ratio
- normalizzazione output, sanitizzazione e guardrail deterministici

### Livello 2 — “Extended unit” con LLM judge
Obiettivo: coprire qualità e criteri semi-soggettivi in modo automatizzato.

- scoring del brand fit
- aderenza al tono
- rilevazione di contenuto tossico o non conforme

Questi test sono più lenti e meno “assoluti” dei rule-based, ma ampliano enormemente la copertura dove il codice non può arrivare.

### Livello 3 — Integration test più ampi
Obiettivo: verificare il flusso end-to-end.

- input utente → chiamata LLM → parsing → controlli → rendering UI
- gestione errori e retry
- limiti di rate, timeouts, degradazione controllata

## Automazione sì, ma con un ultimo passaggio umano
Una pipeline può essere **fortemente automatizzata**: regole + judge + integration coprono la maggior parte dei casi.

Resta però sensato avere una **valutazione umana finale** come “acceptance test” (soprattutto quando:
- cambi modello
- rilasci una nuova funzionalità di generazione
- tocchi parti sensibili come safety e compliance)

L’idea non è sostituire il giudizio umano, ma usarlo dove ha più valore: come controllo conclusivo e come fonte per migliorare le evals.

## In pratica: cosa portarsi a casa
Se costruisci esperienze frontend che dipendono da output generativi:

- separa ciò che è **verificabile con regole** da ciò che richiede **giudizio**
- definisci evals con tre scopi: **regressione, ottimizzazione, selezione modello**
- applica il **test layering**: unit deterministici → unit estesi con judge → integrazione
- chiudi il cerchio con un **gate umano** per le decisioni di rilascio

Questo modello mentale rende il testing delle funzionalità LLM meno “magico” e più simile a un ingegneria misurabile: criteri espliciti, segnali ripetibili e un processo che evolve insieme al prodotto.
