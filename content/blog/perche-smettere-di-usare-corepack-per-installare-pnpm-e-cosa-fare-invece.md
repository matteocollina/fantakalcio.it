---
title: "Perché smettere di usare Corepack per installare pnpm (e cosa fare invece)"
subtitle: "Corepack non sparisce, ma non è più “di default”: con Node 25 cambia il contesto e conviene aggiornare la strategia."
description: "Corepack è stato per anni un modo comodo per uniformare le versioni dei package manager in team e in CI. Con la decisione di non distribuirlo più insieme a Node.js a partire da Node 25, usarlo per installare pnpm perde gran parte del senso pratico e introduce una dipendenza in più da gestire. Vediamo cosa cambia, perché pnpm sconsiglia Corepack e quali alternative adottare oggi per un setup più robusto."
publishedAt: 2026-08-15
tags: ["pnpm","corepack","nodejs-25","gestione-versioni","ci-cd","lockfile"]
---
Corepack è stato pensato per risolvere un problema reale: **allineare la versione del package manager** tra sviluppatori e pipeline CI/CD, evitando divergenze nei lockfile e installazioni non riproducibili. Per molto tempo ha funzionato bene soprattutto perché era lì, “a portata di mano”, distribuito insieme a Node.

Oggi, però, il contesto è cambiato: **dalle versioni future di Node.js (a partire da Node 25) Corepack non viene più distribuito di default**. E questa singola scelta sposta l’equilibrio: ciò che prima era una comodità inclusa diventa una dipendenza opzionale che devi ricordarti di installare, versionare e mantenere.

In parallelo, dal lato pnpm il messaggio è diventato più netto: **non usare Corepack per installare pnpm**. Vediamo perché, e soprattutto cosa conviene fare in pratica.

---

## Cosa cambia con Node 25: Corepack non è più “in dotazione”

Per anni, molte persone hanno trattato Corepack come un componente stabile della toolchain Node. In realtà è rimasto a lungo in stato “sperimentale” e, soprattutto, **la sua presenza dipendeva dalla distribuzione di Node**.

Con Node 25 in avanti, il binario di Corepack **non è più incluso**. Questo non significa che Corepack sia “morto”, ma significa che:

- non puoi più darlo per scontato nelle macchine di sviluppo o negli ambienti CI;
- se lo usi, devi **installarlo esplicitamente** e garantirne la disponibilità;
- la promessa “zero setup” legata a Corepack perde la parte più comoda.

Corepack resta comunque installabile come pacchetto separato (via npm), quindi non c’è un crollo immediato dei workflow esistenti: semplicemente **diventa un pezzo in più da gestire**.

---

## Perché Node ha scelto di non distribuirlo più

Le motivazioni principali sono pragmatiche:

1. **Adozione non così diffusa**: molti team hanno continuato a installare i package manager “a modo loro”, senza passare da Corepack.
2. **Costo di distribuzione**: includere Corepack nel runtime implica aggiornamenti e manutenzione coordinati ogni volta che esce Node.
3. **Manutenibilità a lungo termine**: slegare Corepack dalla release cycle di Node consente agli strumenti di evolvere in modo indipendente.

Queste ragioni, da sole, bastano a spiegare perché basare l’installazione di pnpm su Corepack oggi sia una scelta meno solida di ieri.

---

## Perché pnpm sconsiglia Corepack (anche se “funziona”)

Il punto non è solo filosofico (“non è più incluso”), ma operativo:

- **Corepack non è sempre affidabile con pnpm**: se un tool non gestisce correttamente il package manager, diventa una fonte di edge case, soprattutto su CI.
- **non aggiunge più valore proporzionato al costo**: se devi installare comunque qualcosa in più, allora conviene installare direttamente pnpm nel modo supportato.

In altre parole: non è detto che il tuo setup smetta di funzionare domani. Ma è un invito a **ridurre dipendenze indirette** e adottare un percorso più prevedibile.

---

## Il problema originale che Corepack risolveva (e che resta reale)

Vale la pena ricordare perché Corepack è stato così apprezzato.

Senza un meccanismo di standardizzazione, è facile finire con:

- Dev A con pnpm 8
- Dev B con pnpm 9
- CI con pnpm 10

Risultato: **lockfile diversi**, installazioni divergenti, conflitti di merge più frequenti.

Corepack ha introdotto un’idea semplice: dichiarare in `package.json` la versione del package manager tramite il campo:

```json
{
  "packageManager": "pnpm@10.4.1"
}
```

A quel punto, chi usa Corepack può ottenere automaticamente la versione corretta.

Questa esigenza (versioni coerenti) non sparisce. Cambia il modo migliore per soddisfarla.

---

## Alternative consigliate oggi per installare pnpm

### 1) Installer ufficiale pnpm (Linux/macOS)
È l’opzione “diretta” e oggi è spesso la più lineare: installi pnpm senza passare da Corepack e senza accoppiarti alle scelte di distribuzione di Node.

### 2) Homebrew su macOS
Su macOS, Homebrew è spesso la scelta più coerente se già gestisci così le CLI di sistema:

- un solo “source of truth” per gli strumenti
- update semplici
- integrazione pulita con il resto dell’ambiente

### 3) Script/runner dedicati (es. via `npx`) per bootstrap
Utile quando vuoi un bootstrap ripetibile senza preinstallare troppo, specie in contesti temporanei.

---

## “Ma io uso Corepack per cambiare versione”: qui entra in gioco pnpm stesso

Un punto chiave spesso ignorato è che **pnpm moderno può gestire meglio il proprio versioning**, riducendo la necessità di aggiungere un ulteriore layer (Corepack) solo per “switchare”.

Se nel tuo setup hai già un version manager per Node (fnm, nvm, volta, asdf…), aggiungere anche Corepack solo per pnpm può diventare una stratificazione non necessaria. L’obiettivo pratico dovrebbe essere:

- meno componenti da installare
- meno punti di rottura
- versioni deterministiche e ripetibili

---

## Cosa fare concretamente in un progetto esistente

Una migrazione sensata, a basso rischio, può seguire questa logica:

1. **Smettere di dipendere da Corepack come “installer”** di pnpm.
2. Installare pnpm con un metodo supportato (installer ufficiale / Homebrew / altro approccio standard nel tuo team).
3. Mantenere (o introdurre) il campo `packageManager` in `package.json` per documentare chiaramente la versione attesa.
4. In CI, rendere esplicito l’install di pnpm (niente assunzioni sulla presenza di Corepack).

---

## Sintesi

Corepack non “sparisce” e non è necessariamente vietato, ma **non essendo più distribuito con Node da Node 25**, usarlo come strada principale per installare pnpm perde la sua convenienza originaria e introduce una dipendenza extra.

La direzione più pragmatica è semplice: **installa pnpm in modo diretto e supportato**, rendi la versione attesa esplicita nel progetto e riduci gli strati della toolchain. Meno magia, più riproducibilità: è esattamente ciò che serve quando un progetto cresce, entra in CI e viene toccato da molte persone.
