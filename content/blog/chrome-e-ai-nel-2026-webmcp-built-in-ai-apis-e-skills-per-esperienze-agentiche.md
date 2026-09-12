---
title: "Chrome e AI nel 2026: WebMCP, Built‑in AI APIs e Skills per esperienze agentiche"
subtitle: "Tre aggiornamenti di piattaforma che cambiano il modo in cui progettiamo UI, automazione e funzionalità AI direttamente nel browser."
description: "Chrome introduce WebMCP come base per il web “agentico”, porta in produzione la Prompt API e rafforza le Built‑in AI APIs con nuovi modelli locali (Gemma 3 e Gemini Nano). In più arrivano le Skills: prompt salvati e riutilizzabili come strumenti one‑click su tab singole o multiple."
publishedAt: 2026-06-12
tags: ["WebMCP","Prompt API","Built-in AI APIs","AI on-device","Skills Chrome","Origin Trial"]
---
Negli ultimi anni l’AI nel frontend è passata da “feature aggiuntiva” a componente architetturale. L’evoluzione più interessante non è solo avere un modello che risponde, ma **integrare l’intelligenza in flussi reali**, con UI affidabili, costi sotto controllo e rispetto della privacy.

Qui sotto trovi tre aggiornamenti di piattaforma che vanno esattamente in questa direzione: **WebMCP**, le **Built‑in AI APIs** (con Prompt API in produzione) e le nuove **Skills**.

---

## 1) WebMCP: la base del web agentico
Quando un agente deve “usare” un sito—cliccare, compilare campi, capire stati e vincoli—la differenza tra demo e prodotto sta nella **struttura degli strumenti** che gli metti a disposizione.

**WebMCP** nasce per questo: è un’infrastruttura che permette di esporre al browser (e quindi agli agenti) **tool JavaScript personalizzati** tramite **due API**, con l’obiettivo di:

- **Ridurre l’attrito** di operazioni ripetitive (es. form lunghi, procedure guidate, flussi multi-step).
- **Aumentare l’accuratezza dell’agente** dando azioni “ad alto livello” (più robuste di click e selector fragili).
- **Mantenere una UI fluida**: l’automazione non deve trasformarsi in un’esperienza opaca o lenta per chi sta usando l’app.

In pratica, invece di sperare che un modello interpreti correttamente ogni singolo input della pagina, gli offri strumenti come “compila profilo”, “aggiungi indirizzo di spedizione”, “seleziona piano”, ciascuno con logica validata e controlli lato app.

**Disponibilità**: WebMCP è accessibile tramite **Origin Trial**, utile per sperimentare in produzione controllata e raccogliere feedback reali.

---

## 2) Built‑in AI APIs: Prompt API in produzione + più AI locale
Lato browser, l’AI diventa realmente “di piattaforma” quando puoi invocarla come chiameresti una Web API: con contratti chiari, permessi, comportamento stabile e costi prevedibili.

### Prompt API in produzione
La **Prompt API** è ora disponibile in **production**, affiancandosi a un set di API già orientate a casi d’uso concreti:

- **Summarizer**
- **Language Detector**
- **Translator**

Per un frontend engineer significa poter costruire feature come riassunti contestuali, rilevamento lingua per UX multilingua, traduzioni “al volo” e prompt-driven tooling con una superficie API più coerente e integrata nel runtime del browser.

### Gemma 3 in Chrome (Summarizer e Proofreader) + Gemini Nano
Un punto chiave è l’ampliamento delle opzioni per **AI client-side**: oltre a **Gemini Nano**, arriva **Gemma 3** come modello per l’API di **summarization** e per la **proofreader API**.

Il valore pratico è chiaro:

- **Privacy**: elaborazione locale quando possibile.
- **Costi**: meno dipendenza da chiamate server e token.
- **Latenza**: interazioni più immediate, senza “round-trip”.

Questo non elimina l’AI server-side (che resta fondamentale per molti scenari), ma rende più realistici pattern ibridi: locale per operazioni veloci e private, remoto per task pesanti o con dati condivisi.

---

## 3) Skills: dai prompt “usa e getta” a strumenti riutilizzabili
Chi lavora con prompt complessi conosce il problema: li perfezioni, funzionano benissimo… e poi li riscrivi da capo dopo due giorni.

Le **Skills** trasformano quei prompt in **tool one‑click**:

- salvi i tuoi prompt migliori come “abilità”
- li esegui sulla **tab aperta** oppure su una **selezione di più tab**
- puoi anche **condividerli**

Il salto di qualità non è solo comodità: è **standardizzazione**. Una skill diventa una mini-funzionalità ripetibile, più facile da adottare in team e più consistente nei risultati rispetto a una chat estemporanea.

Per partire velocemente, esiste anche una libreria di skill pronte e la possibilità di crearne di nuove direttamente da una conversazione.

---

## Come collegare i pezzi (in modo sensato)
Questi tre elementi funzionano bene insieme perché coprono tre strati diversi:

1. **WebMCP**: strumenti e azioni “affidabili” per far operare agenti dentro la tua web app.
2. **Built‑in AI APIs**: capacità AI integrate nel browser, con opzioni locali (Gemma 3 / Gemini Nano) per velocità e privacy.
3. **Skills**: packaging dell’intelligenza in comandi ripetibili, condivisibili e immediati.

L’insieme spinge verso un frontend dove l’AI non è solo un widget, ma un modo per **accorciare flussi**, **ridurre errori** e **automatizzare interazioni** mantenendo il controllo dell’esperienza.

---

## Cosa fare adesso
Se stai progettando feature agentiche o AI-assisted nel browser, l’approccio migliore è:

- identificare 1–2 flussi ad alta ripetitività (form, onboarding, configurazioni)
- modellare azioni ad alto livello (tool) invece di micro‑interazioni
- scegliere dove l’AI deve essere locale vs remota
- trasformare i prompt “che funzionano” in skill riusabili

Il risultato tipico è lo stesso che cerchiamo sempre nel frontend: **meno frizione, più affidabilità, tempi di esecuzione più brevi**—ma finalmente con l’AI integrata nel punto giusto della piattaforma.
