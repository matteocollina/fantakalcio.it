---
title: "5 regole per rendere ripetibili i test QA con agenti AI (senza flakiness)"
subtitle: "Determinismo, contesto di prodotto, prove verificabili e un pizzico di memoria: la ricetta per trasformare l’AI in una QA affidabile."
description: "Cinque regole pratiche per eseguire test QA con agenti AI in modo ripetibile: setup deterministico, contesto completo, vincoli di piattaforma, modelli economici e output verificabili con evidenze. Chiude con un approccio per migliorare la ripetibilità tramite planning, memoria e casi di test di riferimento."
publishedAt: 2026-08-10
tags: ["qa automatizzata","testing deterministico","agenti ai","evidenze di test","modelli economici"]
---
L’idea di usare agenti AI per fare QA è affascinante finché non ci si scontra con il problema principale: **la non ripetibilità**. Un run passa, quello dopo fallisce senza che il codice sia cambiato. Oppure l’agente “interpreta” diversamente un requisito e prende un percorso alternativo nell’app.

Se l’obiettivo è integrare questi test in una pipeline (o anche solo fidarsi dei risultati), serve un approccio più ingegneristico: ridurre l’entropia, aumentare l’osservabilità e rendere l’esecuzione **deterministica** quanto basta.

Di seguito 5 regole pratiche che aiutano a trasformare una QA “creativa” in una QA **ripetibile**.

---

## 1) Imposta l’ambiente in modo deterministico (anti-flakiness)
La flakiness nasce spesso da fattori esterni al test:

- dati che cambiano tra un run e l’altro (feed, contenuti dinamici, feature flag)
- orari e fusi (formati data/ora, countdown, token in scadenza)
- rete instabile o rate limiting
- animazioni e transizioni che cambiano tempi e stati

**Regola pratica:** prima di chiedere all’agente “verifica X”, crea le condizioni perché X sia verificabile sempre uguale.

Checklist rapida:
- usa **seed** o dataset fissi (account di test, contenuti pre-caricati)
- blocca o simula dipendenze variabili (mock/stub, sandbox, staging controllato)
- stabilizza timing e attese (attendi condizioni, non secondi; disabilita animazioni dove possibile)
- definisci un punto di partenza certo (reset app, logout/login, clear storage)

Un agente AI può essere bravissimo a navigare UI complesse, ma se lo stato dell’app cambia in modo imprevedibile, anche il miglior agente diventa “casuale”.

---

## 2) Fornisci contesto completo di prodotto (non solo il task)
Gli agenti AI lavorano meglio quando capiscono **che cosa stanno testando** e **perché**. Un prompt minimal tipo “testa la schermata di checkout” costringe l’agente a riempire i buchi con assunzioni.

Meglio passare contesto strutturato:
- obiettivo della funzionalità (es. “il checkout deve sempre mostrare totale, spedizione, metodo di pagamento”) 
- definizione di “done” e criteri di accettazione
- casi limite noti (es. “indirizzi internazionali”, “sconti cumulabili/non cumulabili”)
- vincoli (es. “non deve mai salvare carte”, “non deve uscire dall’app”)

**Regola pratica:** scrivi il contesto come se stessi briefando un QA umano nuovo sul progetto. L’AI non ha “memoria implicita” del tuo dominio: o gliela dai, o la inventa.

---

## 3) Esplicita capacità dello schermo e best practice di piattaforma
Un test guidato da UI cambia completamente se l’agente:
- può fare screenshot o no
- può leggere testo on-screen con affidabilità
- può conoscere la gerarchia accessibilità (label, role, testID)
- è su iOS/Android/Web e con quali pattern di navigazione

**Regola pratica:** dichiara esplicitamente le capacità e le regole del gioco.

Esempi di vincoli utili:
- “Identifica elementi tramite accessibility label / testID quando disponibili”
- “Evita gesture ambigue; preferisci tap su elementi con label univoca”
- “Su iOS, i back sono nella navbar; su Android c’è anche back di sistema”
- “Non considerare ‘successo’ se il testo è solo parzialmente visibile”

Questa regola riduce un’altra fonte di flakiness: l’agente che cambia strategia di interazione ad ogni run.

---

## 4) Usa modelli economici per i run frequenti (costi sotto controllo)
Se ogni esecuzione costa “dollari”, la tentazione è farne poche. E fare pochi run significa non accorgersi di instabilità e regressioni minori.

**Regola pratica:** per i test ripetitivi e frequenti usa modelli più economici (o una strategia a due livelli):
- modello “cheap” per smoke test e flussi standard (costo a run: centesimi)
- modello più potente solo quando:
  - serve ragionamento complesso
  - serve interpretazione più robusta di UI complesse
  - serve diagnosi di failure (triage)

Questo approccio rende sostenibile eseguire test spesso e, di conseguenza, migliorare davvero la qualità.

---

## 5) Pretendi evidenze: screenshot, schermate visitate, note e decisioni
Un risultato “PASS/FAIL” da solo non basta, soprattutto se vuoi ripetibilità e debug.

**Regola pratica:** ogni run deve produrre **evidenze verificabili**:
- screenshot (o frame) dei passaggi chiave
- elenco delle schermate visitate e azioni compiute
- note su cosa ha osservato (testo, valori, stati)
- motivazioni quando sceglie un percorso (“ho selezionato X perché…”)

Le evidenze servono a:
- verificare che il test abbia davvero coperto ciò che pensavi
- capire dove è iniziata la deviazione
- confrontare run diversi (diff visivo/di percorso)

Senza evidenze, l’AI diventa una scatola nera. E una scatola nera non è ripetibile: è solo “a volte va”.

---

## Bonus: ripetibilità vera con planning, memoria e casi di test di riferimento
Se vuoi alzare ulteriormente l’affidabilità, potenzia l’agente con:

- **Planning**: prima esegue un piano (“step 1… step 2… step 3…”) e poi lo segue, invece di improvvisare.
- **Memoria operativa del run**: conserva decisioni e stati intermedi (es. “utente loggato”, “carrello con 2 item”), così evita loop e ripartenze incoerenti.
- **Sample test cases**: fornisci 2–5 casi di test “modello” (anche solo in forma testuale) per ancorare stile, rigore e profondità delle verifiche.

In pratica: meno creatività, più procedura.

---

## Sintesi: l’AI QA funziona quando la tratti come un sistema di test
Le 5 regole si riducono a una disciplina semplice:
1. **stabilizza l’ambiente**
2. **dai contesto completo**
3. **vincola interazioni e piattaforma**
4. **ottimizza i costi per aumentare la frequenza**
5. **rendi ogni run osservabile con evidenze**

Un agente AI non è una scorciatoia per “testare senza pensarci”: è un acceleratore che funziona solo se gli togli incertezza e gli imponi output verificabili. Quando lo fai, la QA diventa non solo più veloce, ma soprattutto più affidabile e ripetibile nel tempo.
