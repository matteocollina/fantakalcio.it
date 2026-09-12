---
title: "WebMCP: dare alle pagine web un “catalogo di strumenti” per agenti AI"
subtitle: "Meno click alla cieca, più azioni affidabili: un approccio standard per rendere le interazioni web esplicite e sicure."
description: "Gli agenti AI spesso falliscono nell’usare un sito perché devono “indovinare” dove cliccare e come completare un flusso. WebMCP propone un modo standard per esporre, in modo dichiarativo o via JavaScript, un elenco di strumenti azionabili presenti nella pagina: dalle form HTML ai tool custom. Risultato: meno fragilità, meno passaggi rotti e integrazioni più affidabili per checkout, inserimenti dati e azioni guidate."
publishedAt: 2026-07-09
tags: ["WebMCP","agenti AI","origin trial Chrome","form HTML come tool","API dichiarativa","API JavaScript registerTool"]
---
Gli agenti AI che “usano il web” (compilano form, cercano bottoni, completano un checkout) inciampano spesso per un motivo semplice: l’azione concreta sull’interfaccia è ambigua. Un essere umano riconosce al volo un bottone “Acquista”, capisce che un input è “CAP”, intuisce quali step sono obbligatori. Un agente, invece, tende a **stimare** dove cliccare e cosa inserire, basandosi su indizi visivi o testuali che possono cambiare di continuo.

In altre parole, il problema non è solo “capire” l’intento: è **attuare** l’azione giusta in modo robusto.

## Perché oggi gli agenti sbagliano così spesso
Gran parte delle UI web moderne non espone in modo esplicito una mappa delle azioni possibili. Anche quando usiamo buone pratiche (label, aria-*), l’agente può comunque trovarsi davanti a:

- più elementi simili (div “button-like”, CTA duplicate, variazioni responsive);
- flussi multi-step con validazioni e stati (disabled/loading/error);
- contenuti dinamici (modal, drawer, componenti montati in ritardo);
- micro-interazioni non ovvie (autocompletamenti, maschere, pickers).

Il risultato è un comportamento “alla cieca”: tentativi, fallback, ripetizioni, e spesso step rotti. Con un costo reale: tempo, token, errori e frustrazione.

## L’idea di WebMCP: un “directory” di tool azionabili
WebMCP (proposta di standard) introduce un concetto pragmatico: permettere ai siti di esporre agli agenti una **directory etichettata** di “strumenti” disponibili sulla pagina.

Invece di costringere l’agente a inferire che:

- quell’input è “indirizzo di spedizione”,
- quel bottone invia l’ordine,
- quell’azione richiede certi parametri,

…la pagina può dichiararlo in modo esplicito. Così l’agente non naviga “a tentoni”: **sa già quali azioni sono supportate e come invocarle**.

## Due approcci: dichiarativo e imperativo
WebMCP propone due modalità complementari per descrivere gli strumenti.

### 1) API dichiarativa: trasformare form HTML in tool
L’approccio più immediato è quello dichiarativo: **partire dalle form standard** e aggiungere un attributo (ad esempio un *tool name*) che le renda registrabili come strumenti.

È un’idea potente perché:

- sfrutta primitive web consolidate (form, input, submit);
- riduce la necessità di “wrapper AI-specifici”;
- incentiva UI più semantiche e meno fragili.

In pratica, una form non è solo “un pezzo di UI”: diventa un’azione invocabile con nome e schema prevedibile.

### 2) API imperativa: tool custom via JavaScript
Non tutto è una form: ci sono calendari, configuratori, carrelli complessi, flussi guidati. Qui entra l’API imperativa: dal codice puoi **registrare strumenti personalizzati** (es. con una funzione tipo `registerTool`) e definire esattamente cosa fanno e quali parametri accettano.

Questo è particolarmente utile quando:

- l’azione richiede più passaggi interni ma vuoi esporla come “una sola operazione”;
- devi controllare validazioni, permessi o rate limiting;
- vuoi offrire un contratto stabile anche se la UI cambia.

## Un esempio concreto: checkout senza tentativi a vuoto
Immagina un checkout e-commerce. Senza una directory di tool, un agente potrebbe:

- cliccare sul bottone sbagliato (o su una CTA duplicata);
- compilare campi in ordine errato;
- non capire perché il submit è disabilitato;
- perdersi in una modale di consenso.

Con WebMCP, la pagina può esporre strumenti del tipo:

- `inserisci_dati_spedizione` (parametri: nome, indirizzo, cap, città…)
- `applica_codice_sconto` (parametri: codice)
- `invia_ordine` (parametri: conferma)

L’agente non deve “scoprire” la UI: **invoca tool noti, con input espliciti**, e il sito gestisce l’esecuzione in modo controllato.

## Implicazioni per chi fa frontend
Se questa direzione prenderà piede, cambia il modo in cui pensiamo all’integrazione con agenti:

- **Progettazione per azioni**: non solo componenti visivi, ma operazioni con nome, parametri e risultati.
- **Stabilità**: un tool può restare invariato anche se redesigni la UI.
- **Accessibilità e semantica**: l’approccio dichiarativo premia HTML “vero” (form ben strutturate) rispetto a interazioni puramente decorative.
- **Sicurezza**: esporre tool espliciti può ridurre comportamenti imprevedibili; l’azione passa da un contratto noto invece che da click arbitrari.

## Stato attuale: sperimentazione in Chrome
WebMCP è disponibile come **origin trial** per test in Chrome (indicata una build 104.9 nel materiale di riferimento). Questo significa che è pensato per sperimentazioni controllate: utile per prototipi, valutazioni di DX e primi casi d’uso, senza darlo per “definitivo”.

## Sintesi
WebMCP prova a risolvere il punto debole degli agenti sul web: l’atto pratico di interagire con una UI complessa. L’idea di esporre una **directory di strumenti** — tramite un’API dichiarativa per le form e una imperativa per tool custom — sposta il paradigma da “clicca e spera” a “invoca un’azione esplicita”.

Se costruisci interfacce con flussi critici (checkout, onboarding, backoffice), vale la pena osservare questa evoluzione: potrebbe diventare il modo più pulito per rendere i tuoi percorsi **più affidabili, automatizzabili e resilienti ai cambi di UI**.
