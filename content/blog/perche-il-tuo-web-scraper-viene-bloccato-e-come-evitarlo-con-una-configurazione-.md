---
title: "Perché il tuo web scraper viene bloccato (e come evitarlo con una configurazione minima)"
subtitle: "Rate limit dopo poche richieste? Spesso non è un bug del codice di scraping, ma del modo in cui ti presenti al sito: IP, provenienza e rotazione contano più del parser."
description: "Molti scraper “funzionano” per 5–10 richieste e poi si schiantano contro un rate limit o un blocco. Il motivo più comune non è l’estrazione in sé, ma l’impronta di rete: troppe richieste dallo stesso IP, senza rotazione e senza coerenza geografica. In questo articolo vediamo un caso tipico (Node.js, prezzi su più storefront regionali) e una soluzione pratica: instradare le richieste su proxy residenziali con uscita per paese e IP rotation per richiesta, riducendo drasticamente i blocchi."
publishedAt: 2026-09-04
tags: ["proxy residenziali","rate limiting","node.js scraping","rotazione IP","storefront regionali"]
---
## Il sintomo: dopo 10 richieste “va tutto giù”

Un caso comune nello scraping è questo:

- le prime richieste tornano dati corretti (HTML/JSON, prezzi, disponibilità, ecc.)
- dopo poche iterazioni inizi a ricevere **429 Too Many Requests**, pagine di blocco, CAPTCHA o risposte degradate

Quando succede così in modo ripetibile, spesso non stai “sbagliando il selettore”: stai **facendo troppe richieste con la stessa identità di rete**.

In pratica, per il sito sei un unico client che:

- arriva dallo stesso IP
- colpisce endpoint simili a ritmo costante
- ripete pattern identici

Risultato: scatta il **rate limit** o un blocco automatico.

## Un esempio realistico: prezzi su storefront regionali

Immagina uno script Node.js che raccoglie il prezzo dello stesso prodotto su più regioni (ad esempio **UK, Germania, USA**). L’estrazione del prezzo può essere corretta e stabile, ma lo scraping fallisce comunque perché:

- stai facendo tante richieste in sequenza
- lo fai da un solo IP
- in più, se interroghi regioni diverse, potresti sembrare “sospetto” (utente che cambia paese in modo innaturale ma resta sullo stesso IP)

La dinamica tipica è: *prezzi OK → improvvisamente blocco → fine run*.

## La differenza che conta: come esci su Internet

Molti blocchi non dipendono dal DOM o dal parsing, ma dalla **rete**. Le leve più impattanti sono:

1. **IP reputation** (datacenter IP vs IP residenziali)
2. **Rotazione dell’IP** (uno per richiesta o per sessione)
3. **Coerenza geografica** (se stai interrogando una vetrina UK, “uscire” dal Regno Unito ha senso)

Ed è qui che una configurazione piccola può cambiare completamente l’esito.

## Soluzione pratica: proxy residenziali + uscita per paese + rotazione

Un approccio molto usato è instradare le richieste attraverso un **proxy residenziale**.

Caratteristiche utili in questo scenario:

- **Egress per paese**: scegli (o fai scegliere al provider) l’uscita in UK/DE/US
- **IP rotation**: ad ogni richiesta ottieni un IP diverso (o sufficientemente variabile) per evitare il “martellamento” da un solo indirizzo

In un flusso Node.js, l’idea è:

- aggiungere un **proxy agent** (HTTP(S))
- passare credenziali e endpoint del proxy (host, porta, login, password)
- includere un **suffisso/parametro di paese** nel login (dipende dal provider) così il proxy esce dalla regione desiderata

Il resto del codice di scraping può rimanere identico: cambiano solo le opzioni di rete con cui fai le request.

### Perché funziona

Per il sito target, le tue richieste:

- non arrivano più tutte dallo stesso IP
- risultano più distribuite e meno “meccaniche” dal punto di vista dell’identità
- sono più coerenti con la geografia della vetrina che stai interrogando

Questo riduce drasticamente la probabilità di colpire rate limit aggressivi nel giro di poche chiamate.

## Attenzioni importanti (anche con i proxy)

I proxy non sono una bacchetta magica. Se il tuo scraper è troppo aggressivo, verrai bloccato comunque. Alcune buone pratiche restano fondamentali:

- **throttling**: metti un limite di richieste al secondo
- **retry con backoff**: su 429/5xx ritenta con attese crescenti
- **cache**: se puoi, evita di richiedere più volte la stessa risorsa
- **sessioni**: quando serve continuità (carrello, cookie, AB test), valuta rotazione per sessione invece che per singola request

E naturalmente: rispetta **termini di servizio**, **robots**, e i vincoli legali del contesto in cui lavori.

## Sintesi: se ti bloccano subito, guarda prima la rete

Quando uno scraper si ferma dopo poche richieste, nella maggior parte dei casi il problema non è “estraggo male il prezzo”, ma **come stai effettuando le richieste**.

La correzione più efficace e rapida, soprattutto su siti sensibili ai rate limit, è spesso una: **instradare lo scraping tramite proxy residenziali con uscita geografica e rotazione IP**. A parità di codice di parsing, può essere la differenza tra un run che muore al decimo request e uno che completa l’intero batch in modo stabile.
