---
title: "GitHub sotto stress: downtime, integrità dei dati e l’effetto “agentic coding”"
subtitle: "Quando la piattaforma più centrale del nostro workflow diventa un collo di bottiglia: cosa sta succedendo e come prepararsi."
description: "Negli ultimi mesi GitHub ha mostrato segnali insoliti: incidenti prolungati, funzionalità degradate e persino casi in cui l’integrità dei merge è stata compromessa. Il punto non è (solo) l’infrastruttura: l’esplosione di PR, commit e repository generati da flussi di lavoro agentici e bot sta cambiando drasticamente i carichi di lavoro. Vediamo i rischi reali per team e aziende, perché non è banale “migrare via”, e quali alternative e strategie adottare per non restare bloccati."
publishedAt: 2026-04-30
tags: ["downtime GitHub","integrità repository","agentic coding","alternative a GitHub","Codeberg","Gitea"]
---
Negli ultimi mesi GitHub sta mostrando una fragilità che molti di noi non erano abituati a considerare: non parlo solo di qualche rallentamento sporadico, ma di incidenti estesi che impattano feature centrali del ciclo di sviluppo (PR, Issues, Projects) e, in un caso particolarmente serio, persino l’integrità dei dati prodotti da una funzione di merge.

Per chi fa frontend (ma vale per qualunque disciplina), GitHub non è “solo” un hosting Git: è il pannello di controllo del lavoro quotidiano. Quando vacilla, si ferma tutto: review, triage, release, hotfix.

## Incidenti recenti: non è solo questione di “status rosso”
Tra gli episodi più preoccupanti se ne distinguono due tipologie:

### 1) Piattaforma quasi inaccessibile per problemi al search
Un incidente ha colpito il sottosistema di ricerca (basato su Elasticsearch), che alimenta diverse esperienze: porzioni delle pull request, la consultazione di issue e progetti. Il risultato pratico è stato un GitHub “in piedi” solo sulla carta: se non riesci a trovare, filtrare, navigare e aprire correttamente contenuti, la piattaforma diventa di fatto inutilizzabile.

Per i team questo è il classico scenario in cui la work queue esplode: PR bloccate, bug non triagiati, release slittate.

### 2) L’incidente peggiore: merge commit errati e integrità dei dati
Il salto di qualità (in negativo) arriva quando non è più “solo” un problema di disponibilità ma di **data integrity**.

Un incidente legato alla **merge queue** ha prodotto, per una finestra temporale, **merge commit non corretti** in alcuni casi d’uso (soprattutto enterprise) che adottavano squash+merge via queue. Parliamo di un impatto significativo (centinaia di repository e migliaia di PR coinvolte) e, soprattutto, di un dettaglio cruciale: non sempre è possibile ripristinare automaticamente.

Quando l’integrità dei merge viene messa in discussione, cambia la percezione di GitHub come fonte autorevole della “verità” del codice. E questo, per aziende regolamentate (finanza, sanità, infrastrutture critiche), è un campanello d’allarme enorme.

## Il vero fattore di pressione: bot, agenti e volumi fuori scala
La lettura più utile non è “GitHub è peggiorato perché ha ingegneri meno bravi” (semplificazione sterile), ma **il contesto di carico è cambiato radicalmente**.

Negli ultimi mesi i workflow di **agentic development** e l’uso massiccio di LLM per generare codice hanno aumentato:

- numero di pull request aperte/chiuse/mergiate
- numero di commit (scala da milioni a miliardi)
- creazione di repository (decine di milioni al mese)

Questo tipo di crescita non è lineare: introduce nuovi pattern di traffico (più burst, più automazioni, più operazioni ripetitive) e quindi stressa in modo diverso le componenti più “sensibili” della piattaforma: code di merge, indicizzazione, permessi, eventi, notifiche, audit.

In altre parole: non è solo più traffico, è **traffico di natura diversa**.

## Perché la questione “AI dentro GitHub” è delicata
È comprensibile che GitHub spinga forte sull’integrazione AI: è il posto dove vivono i repository e dove passano i flussi di lavoro, quindi è anche il punto ideale per vendere e distribuire assistenza alla scrittura del codice.

Il problema emerge quando l’integrazione AI diventa **un moltiplicatore di carico** (più operazioni automatizzate, più PR “macchina su macchina”) senza un’adeguata separazione e governance.

Qui la domanda non è “AI sì / AI no”, ma:

- come si gestisce l’accesso programmato massivo?
- come si riduce lo spam e l’abuso di risorse?
- come si preservano le feature critiche per chi lavora “normalmente”?

## Possibili contromisure (e perché fanno discutere)
Se il problema principale è la pressione di bot e agenti, le soluzioni probabili vanno oltre l’ottimizzazione tecnica. Due idee ricorrenti:

1) **Micro-pagamenti** (anche pochi centesimi per push/operazione) per abbattere spam e automazioni aggressive.
2) **Verifica più forte degli account** con “human in the loop” per limitare la creazione industriale di profili e repository usati da bot.

Sono misure impopolari perché toccano il modello “gratis e aperto” che ha reso GitHub ciò che è. Ma se il costo marginale delle operazioni tende a zero, gli abusi tendono all’infinito.

## “Ok, quindi dove si va?” La migrazione non è banale
La verità è che oggi non esiste un sostituto 1:1 che replichi **tutto**: ecosistema, integrazioni, UX, community, marketplace, Actions, permessi enterprise, discovery, e abitudini consolidate.

Però sta tornando attuale una strategia che molte organizzazioni avevano accantonato: **ridurre la dipendenza da un singolo fornitore**.

### Alternative interessanti
- **Codeberg**: realtà non profit e community-driven, basata su Forgejo, con un’impostazione molto orientata all’open source e alla sostenibilità. È una delle mete più citate quando si parla di “spostarsi fuori” dall’asse delle grandi piattaforme.
- **GitLab**: competitor storico, più “suite” end-to-end. Anche qui però la complessità operativa è alta e non è immune da degradazioni o incidenti.
- **Gitea / Forgejo self-hosted**: scelta pragmatica per chi vuole controllo e indipendenza. Il prezzo è pagarlo in SRE/ops: backup, upgrade, monitoraggio, sicurezza, runner CI.

## Cosa fare, concretamente, come team (anche frontend)
Se oggi GitHub è centrale nel tuo workflow, la cosa sensata non è una fuga impulsiva, ma una **strategia di resilienza**:

1) **Backup e mirror**: valuta un mirror read-only su un secondo fornitore o su un’istanza self-hosted per i progetti critici.
2) **Piano di continuità per release**: documenta cosa succede se PR/CI sono giù per 6–12 ore (come tagghi, come rilasci, come hotfixi).
3) **Riduci l’accoppiamento**: evita di legare tutto a feature proprietarie difficili da migrare (o quantomeno rendilo una scelta consapevole).
4) **Governance sull’automazione AI**: se in azienda agenti e bot aprono PR in massa, definisci rate limit, policy e “guardrail” (branch protection, codeowners, controlli obbligatori).

## Il punto: GitHub non “sta finendo”, ma sta cambiando fase
GitHub resta una piattaforma straordinaria, ma sta entrando in un’era in cui il carico non è più guidato principalmente da persone: è guidato da automazioni, agenti e bot che producono volumi e pattern mai visti.

Chi sviluppa oggi dovrebbe leggere questo momento come un invito a maturare: meno dipendenza cieca dalla piattaforma unica, più capacità di spostarsi (anche solo parzialmente) quando affidabilità e integrità diventano variabili.

Se hai già sperimentato migrazioni (anche solo per progetti open source) o hai provato Codeberg/Gitea/Forgejo in produzione, mi interessa sapere cosa ha funzionato davvero: onboarding, permessi, CI, performance e UX nel day-by-day.
