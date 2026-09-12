---
title: "Refactor UI: come ripulire una schermata “Agents” piena di rumore (senza rifarla da zero)"
subtitle: "Allineamenti, gerarchia tipografica, stati e densità informativa: piccoli interventi che trasformano la leggibilità percepita di un’app."
description: "Una schermata di lista/selection degli “agent” può diventare rapidamente il classico muro di badge, label ripetute e indicatori poco chiari. Qui trovi un approccio pratico di refactor: bilanciare gli spazi, eliminare ridondanze, chiarire gli stati con pattern robusti e migliorare la scansione visiva delle card. Con alcune varianti di layout per capire come cambiano ritmo, respiro e densità."
publishedAt: 2026-06-30
tags: ["gerarchia tipografica","allineamenti e spaziatura","card design","stati e indicatori","riduzione ridondanze","UI refactor"]
---
Una schermata “Agents” (o “List/Select item”) sembra semplice: una lista di card, qualche filtro, uno stato online/offline. Eppure è uno dei punti in cui molte app crollano, perché l’interfaccia si riempie di micro-informazioni, indicatori duplicati e scelte cromatiche che non reggono su contenuti reali.

Qui trovi un refactor guidato dai fondamentali: non “rifacciamo tutto”, ma sistemiamo ciò che rovina leggibilità, coerenza e scansionabilità.

---

## 1) Parti dall’inquadratura: spazi simmetrici e margini coerenti
Prima ancora di parlare di card e colori, controlla la *cornice* dell’interfaccia:

- **Margine sinistro e destro**: devono “pesare” allo stesso modo.
- **Allineamenti nella status bar/top area**: se il tempo (a sinistra) è “spinto” troppo verso il centro, l’intera schermata sembrerà sbilanciata anche se tutto il resto è corretto.

È un intervento minuscolo, ma imposta subito una sensazione di ordine. La UI non deve costringere l’occhio a compensare asimmetrie inutili.

---

## 2) Elimina titoli doppi e label ridondanti
Un errore frequente: ripetere lo stesso concetto in due punti diversi.

Esempio tipico:
- un titolo piccolo centrato (“Agents”)
- e subito sotto un header o una label più evidente che dice… “Agents”

Risultato:
- spazio verticale sprecato
- gerarchia confusa
- sensazione di “template” generico

**Regola pratica**: un’informazione deve avere **un posto dominante**. Se serve un breadcrumb/contesto, deve essere chiaramente secondario, non duplicato.

---

## 3) Stato “online”: o lo rendi inequivocabile, o lo togli
Gli stati sono utili solo se si leggono al primo colpo.

Se “Online” è indicato con un colore poco contrastato o ambiguo, l’utente non lo registra. Due alternative sensate:

1. **Rendere lo stato testuale evidente** (contrasto, peso, posizione)
2. **Affidarsi a un indicatore iconico** (puntino/circle status) ben progettato

L’errore più comune è il peggiore: **avere sia testo che icona**, ma entrambi deboli. In quel caso aggiungi rumore senza aggiungere informazione.

---

## 4) Tabs e filtri: leggibilità prima dell’estetica
Le tab (“All”, “Online”, “Ready”) sono un elemento di scanning: devono essere immediatamente comprensibili.

Checklist:
- testo con dimensione adeguata
- target touch comodo
- stato selezionato chiaro (non solo un cambio colore minimo)
- spaziatura regolare

Se i filtri non si leggono, l’utente percepisce la lista come “troppo lunga” anche quando non lo è.

---

## 5) Il cuore del problema: card con troppe cose e poca gerarchia
Nelle card avvengono quasi sempre gli stessi errori:

- troppi badge
- troppe righe
- informazioni ripetute
- indicatori di selezione timidi e fuori asse

### 5.1 Indicatore di selezione: deve essere forte e **allineato**
Se una card è “attiva” (selezionata), l’indicatore:
- deve essere **immediatamente identificabile**
- deve vivere in un punto coerente (spesso **a destra**, allineato)
- deve usare un linguaggio visivo coerente con i colori primari dell’app

Un micro-check rosso, piccolo e “buttato lì”, non comunica selezione: sembra un errore o un warning.

### 5.2 Avatar + status: separazione obbligatoria (contenuto imprevedibile)
Gli avatar sono immagini non controllabili: possono avere qualunque colore e contrasto.

Se sovrapponi un indicatore di stato (il classico pallino) senza separazione:
- rischi clash cromatico
- perdi leggibilità

Soluzione robusta: **stroke bianco** (3–4px) attorno al pallino di stato. Non è decorazione: è *spazio negativo artificiale* che garantisce leggibilità su qualunque avatar.

### 5.3 Tipografia: fai respirare il nome, comprimi il resto
Il nome dell’agente (o item principale) è ciò che l’utente cerca. Deve essere:
- più grande
- più leggibile
- con peso coerente

Molte UI fanno l’opposto: nome piccolo e una riga di microtesti attorno. Il refactor tipico è:
- **ingrandire il titolo**
- ridurre o eliminare le righe che non aggiungono decisione

### 5.4 Togli duplicazioni logiche: un solo posto per la stessa informazione
Esempio classico:
- icona di stato (online/offline)
- e testo “Online” dentro la card

Se l’icona è chiara, il testo è ridondante. Ridondanza = densità inutile.

Stessa cosa per info tecniche ripetute (es. runtime/modello/versione) riportate in più punti: se esiste già un contesto o un badge dedicato, evita di ripeterlo.

### 5.5 Badge e metadati: meno etichette, più struttura
Se hai tag come “GPT 5.5”, “Default”, “Runtime 5.5”, “Sessions 1”… stai probabilmente mostrando:
- dati tecnici
- stato selezione
- contatori

Mescolarli senza una gerarchia crea confusione.

Refactor efficace:
- rimuovere badge ambigui (es. “Default” come pseudo-selezione)
- usare una riga compatta e coerente per metadati utili (es. **Sessions** vicino al tag principale)
- evitare ripetizioni (“Runtime 5.5” e “GPT 5.5” insieme, se comunicano la stessa cosa)

---

## 6) Il colore primario: se disturba, sta guidando male l’interfaccia
Un colore primario troppo “pesante” (scuro, saturo, cupo) usato ovunque crea:
- affaticamento
- gerarchia falsata (tutto sembra importante)
- estetica involontariamente aggressiva

Non è una questione di gusto: è una questione di **dosaggio**. Il primario deve guidare le azioni e gli stati, non colorare l’interfaccia a caso.

---

## 7) Varianti di layout: come cambiano ritmo e densità
Una volta ripuliti i fondamentali, puoi esplorare varianti senza perdere qualità.

### Variante A: selezione ultra evidente
Rendi la card attiva riconoscibile anche in un colpo periferico (utile in liste lunghe). Attenzione a non rendere *tutto* “attivo”: un solo elemento deve dominare.

### Variante B: gradienti di sfondo “quasi invisibili”
Un leggero gradiente può dare profondità senza aggiungere componenti. Funziona solo se:
- è poco contrastato
- non compete con testi e badge
- non crea bande dietro contenuti chiave

### Variante C (spesso la migliore): meno contenitori, più respiro
Se metti tutto in “box” (card dentro card, filtri dentro card…), paghi un prezzo:
- devi aggiungere padding interno per non schiacciare i contenuti
- perdi spazio utile
- aumenti la sensazione di UI “impacchettata”

Rimuovendo un contenitore superfluo (per esempio attorno ai filtri), l’interfaccia si **apre**: più spazio reale, meno cornici, più leggibilità.

---

## Sintesi: il refactor che conta davvero
Una schermata “Agents” migliora drasticamente quando:

- **bilanci i margini** e sistemi gli allineamenti base
- **elimini ridondanze** (titoli doppi, stati duplicati, runtime ripetuti)
- **rendi chiaro lo stato selezionato** con un pattern forte e allineato
- **proteggi gli indicatori** da contenuti imprevedibili (stroke/spacing attorno allo status)
- **sposti la gerarchia**: titolo grande, metadati compatti, badge solo se utili
- **riduci contenitori** che consumano spazio e aggiungono rumore

Il punto non è “fare la UI più bella”: è farla **più leggibile e più veloce da usare**. Quando la gerarchia è chiara, anche un design semplice sembra immediatamente più professionale—perché smette di chiedere attenzione e inizia a restituire informazione.
