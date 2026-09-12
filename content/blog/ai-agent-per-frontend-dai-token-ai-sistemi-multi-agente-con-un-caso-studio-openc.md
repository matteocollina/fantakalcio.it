---
title: "AI agent per frontend: dai token ai sistemi multi‑agente (con un caso studio “OpenClaw”)"
subtitle: "Una mappa pratica per capire cosa c’è sotto un LLM e come trasformarlo in un agente che usa strumenti, memoria e orchestrazione."
description: "Gli AI agent sono diventati un tema ricorrente anche per chi lavora sul frontend: assistenti per coding, ricerca, QA, generazione contenuti, automazioni. Ma spesso manca una base solida: cosa sta facendo davvero un LLM, perché “allucina”, cosa sono i token e soprattutto cosa distingue un semplice workflow da un agente. In questo articolo metto in ordine i concetti fondamentali e una possibile architettura multi‑agente ispirata a un caso studio reale, con attenzione a implicazioni pratiche (costi, limiti, sicurezza)."
publishedAt: 2026-07-07
tags: ["ai-agent","tokenizzazione","prompt-design","multi-agente","agent-loop","tool-calling"]
---
Negli ultimi mesi “AI agent” è diventata una parola ombrello: a volte indica una chat con un prompt ben scritto, altre un’automazione che esegue azioni reali (ricerca, scrittura codice, ticketing, deploy). Se lavori nel frontend, la differenza è tutt’altro che accademica: cambia come progetti l’interfaccia, come gestisci lo stato, quanto ti costa ogni richiesta e quanto puoi fidarti dell’output.

Mettiamo ordine partendo dal nucleo: gli LLM.

---

## Chat e “GPT”: interfaccia vs cervello
Quando usi un prodotto tipo ChatGPT, stai usando:

- **Chat**: l’interfaccia conversazionale (UI, gestione messaggi, cronologia, ecc.)
- **GPT** (o un altro modello): la tecnologia che genera testo

Per chi sviluppa, la “chat” è la parte più familiare: una sequenza di messaggi e uno stato conversazionale. Il modello invece è un servizio che riceve input e restituisce output.

---

## Transformer: perché dal 2017 il linguaggio è cambiato di livello
La svolta moderna nasce con l’architettura **Transformer**, resa popolare dal paper *“Attention Is All You Need”*.

Il punto chiave, senza entrare troppo nella matematica: i transformer usano **attention**, cioè la capacità di considerare simultaneamente le relazioni tra le parole della frase. Questo migliora drasticamente la comprensione del contesto (ad esempio la risoluzione di pronomi e riferimenti) e rende la generazione molto più coerente.

---

## “Pre‑trained” e “generative”: cosa fa davvero un LLM
Un LLM è **pre‑addestrato** su enormi quantità di testo. Non “memorizza fatti” come un’enciclopedia: apprende **pattern** statistici del linguaggio.

Durante l’addestramento il compito base è sempre lo stesso: **predire il prossimo token**. Questo spiega due comportamenti cruciali:

- **Fluenza altissima**: sa produrre testo plausibile in tanti stili.
- **Allucinazioni**: se non ha basi solide o il prompt lo spinge, può generare risposte “credibili” ma sbagliate, perché non sta verificando i fatti: sta continuando un pattern.

La parte “generative” significa proprio questo: non copia una risposta da un database, **la costruisce** token dopo token.

---

## “Large” in LLM: dati e parametri (e perché non è solo marketing)
“Large” di solito indica due dimensioni:

1. **Molti dati di training** (testi, codice, documenti)
2. **Molti parametri** (i “pesi” numerici che il modello regola durante l’addestramento)

Un modo intuitivo di pensarli: i parametri sono come micro‑regolazioni apprese col tempo, simili a come impari un gesto sportivo (tiri, sbagli, correggi). Più parametri non significa automaticamente “meglio per tutto”: significa anche più costo, più latenza, più complessità. In contesti di prodotto può essere vantaggioso un modello più piccolo ma specializzato.

---

## Token: la moneta invisibile di ogni richiesta
Un LLM non “vede” parole, vede **token**: pezzi di testo (parola intera, parte di parola, carattere). La **tokenizzazione** influisce su:

- **Costo** (molti provider tariffano per token)
- **Limiti di contesto** (quanta storia puoi inviare + ricevere)
- **Comportamenti strani** su lingue meno rappresentate o testo tecnico

Esempio tipico: parole rare o composte vengono spezzate in più token. Il codice spesso “costa” di più perché punteggiatura e simboli aumentano la frammentazione.

**Implicazione frontend**: se stai costruendo un editor/assistente che invia stack trace, file lunghi o diff, devi ragionare in termini di budget token, non di “numero di righe”.

---

## Un LLM da solo non è un agente
Un LLM puro genera testo. Non può:

- interrogare un database
- fare chiamate HTTP affidabili
- inviare email
- creare PR
- eseguire comandi

Quando gli dai **strumenti** (tool) e una logica che decide *quando* usarli e *come* validarne l’output, inizi a parlare di **AI agent**.

Dal punto di vista architetturale, lo schema minimo è:

1. input utente
2. chiamata al modello
3. decisione: rispondi oppure usa un tool
4. eventuale chiamata tool
5. nuova chiamata al modello con i risultati
6. risposta finale

Questo ciclo è spesso chiamato **agent loop**.

---

## Workflow vs agente: la distinzione che ti evita molte trappole
Molti sistemi “sembrano” agenti ma sono workflow.

- **Workflow**: una pipeline deterministica (step A → step B → step C). Ottimo per processi ripetibili, controllabili, testabili.
- **Agente**: ha più autonomia decisionale: può scegliere strumenti, iterare, cambiare piano, recuperare contesto, gestire errori.

Se il tuo caso d’uso è lineare (es. “prendi testo → riassumi → pubblica”), un workflow spesso è più sicuro.
Se invece serve esplorazione, tentativi multipli, interazioni con tool diversi (ricerca, memoria, coding), un agente ha senso.

---

## Memoria: utile, ma va progettata
Un agente “ricorda” in due modi:

- **Memoria nel contesto**: includi i messaggi precedenti. Semplice, ma costosa in token e limitata dalla finestra di contesto.
- **Memoria esterna**: salvi informazioni fuori (DB, vector store, file). Più scalabile, ma introduce problemi di qualità, privacy e sicurezza.

Nel frontend questo tocca temi pratici: UI per “cosa è stato salvato”, controlli per cancellazione, consenso, esportazione, e una buona strategia per evitare che la memoria diventi rumore.

---

## Una possibile architettura multi‑agente: orchestratore + specialisti
Una configurazione produttiva comune è dividere responsabilità:

- **Orchestratore**: riceve l’obiettivo, decide quali agenti coinvolgere, aggrega risultati.
- **Agente ricerca**: naviga fonti/strumenti di retrieval.
- **Agente memoria**: gestisce salvataggio/recupero e “distillazione” del contesto.
- **Agente coding**: scrive/analizza codice, propone patch e test.

Questa separazione riduce il caos: prompt più piccoli e mirati, tool più controllati, output più verificabili.

---

## Case study “OpenClaw”: cosa guardare quando analizzi un agente reale
Quando dissezioni un progetto open source di agentic AI, le parti che contano davvero (anche per chi fa frontend) sono sempre simili:

1. **Tools e permessi**: cosa può fare l’agente? con quali limiti?
2. **Agent loop**: come decide il prossimo passo? quando si ferma?
3. **Memoria**: dove salva? come recupera? come evita di “inquinarsi”?
4. **Testing**: test deterministici dei tool, test di regressione su prompt, golden outputs.
5. **Monitoring**: tracciamento di token, errori tool, tempi, fallimenti, retry.
6. **Sicurezza**: 
   - prompt injection (input ostile che forza azioni)
   - leakage di segreti (API key, token, dati utente)
   - tool abuse (azioni non previste)

La sicurezza è spesso la parte sottovalutata: appena un agente ha tool che “fanno cose”, devi ragionare come se stessi esponendo un’API pubblica a input non fidato.

---

## Implicazioni pratiche per chi sviluppa UI
Se stai costruendo un’interfaccia per agenti, alcuni pattern ricorrenti aiutano molto:

- **Stato visibile del piano**: mostra obiettivo, step in corso, tool chiamati, output intermedio.
- **Conferma prima di azioni critiche**: soprattutto per tool che scrivono, inviano, cancellano.
- **Budget token e limiti**: feedback chiaro quando il contesto è troppo lungo.
- **Fallback**: se un tool fallisce, l’agente deve degradare con un messaggio utile, non con testo “sicuro ma vuoto”.

---

## Sintesi e conclusione
Un LLM è un generatore di testo basato su transformer, addestrato a predire token: potente ma non “affidabile” di default, e costoso in funzione dei token. Un **AI agent** nasce quando aggiungi strumenti, memoria e un ciclo decisionale (agent loop). La differenza tra **workflow** e **agente** è spesso la decisione architetturale che separa un prodotto robusto da un prototipo fragile.

Se stai valutando un sistema multi‑agente, la regola pratica è: **separa i ruoli**, limita i permessi dei tool, rendi osservabile il loop (log, monitoraggio, test), e tratta ogni input come potenzialmente ostile. È lì che un agente smette di essere una demo e inizia a diventare una feature di prodotto.
