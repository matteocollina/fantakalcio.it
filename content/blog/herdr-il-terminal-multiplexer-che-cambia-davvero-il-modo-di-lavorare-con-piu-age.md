---
title: "herdr: il terminal multiplexer che cambia davvero il modo di lavorare con più agenti AI"
subtitle: "Sessioni persistenti, sidebar degli agenti, mouse support e plug-in: un ambiente TUI pensato per l’agentic engineering."
description: "herdr è un terminal multiplexer con architettura client-server che mantiene vivi i processi, organizza il lavoro in spazi/tab/pane e integra in modo “nativo” molte CLI di agenti AI (con stato e indicatori di attività). In più supporta mouse e plug-in, diventando un hub operativo per chi lavora con più agenti e più progetti, anche in remoto via SSH."
publishedAt: 2026-07-16
tags: ["agentic engineering","terminal multiplexer","coding agents CLI","workflow multi-progetto","SSH remoto","plugin TUI"]
---
Chi lavora con agenti AI via CLI finisce spesso nello stesso punto: troppe finestre del terminale, contesti che si perdono, processi lunghi da tenere d’occhio e un continuo “alt-tab” tra sessioni diverse. **herdr** entra esattamente lì: non è solo un modo più ordinato per affiancare terminali, ma un ambiente costruito per gestire **più agenti** e **più progetti** senza perdere continuità.

## Non è “solo” un multiplexer
Un terminal multiplexer, in teoria, serve a tenere più terminali dentro una singola UI. Ma la differenza sostanziale di herdr sta nel come lo fa: **architettura client-server**.

In pratica:
- avvii herdr da un terminale con un comando;
- herdr avvia (o usa) un *server* locale che ospita sessioni e processi;
- tu ti colleghi a quel server con un *client*.

Il risultato è che **i processi restano attivi anche se chiudi la UI** o ti “stacchi” dalla sessione. Quando rientri, ritrovi layout e stato di lavoro. Per chi lancia agenti che ragionano, indicizzano repository, eseguono task lunghi o fanno refactoring, questo cambia il ritmo operativo: niente “non chiudere quella finestra che sta ancora lavorando”.

## La killer feature: integrazione profonda con gli agenti
La parte davvero distintiva è la gestione degli agenti. herdr **riconosce automaticamente molte CLI di agenti AI** e le tratta come entità di prima classe nell’interfaccia.

Cosa significa concretamente:
- se avvii una sessione di un agente in un pane, herdr la **mostra in una sidebar dedicata**;
- puoi vedere a colpo d’occhio **quali agenti esistono** e **quali stanno lavorando** (con indicatori di attività);
- passare da un agente all’altro diventa un’operazione di navigazione, non un esercizio di memoria su “dov’era quella finestra?”.

Se lavori con più agenti in parallelo (ricerca, implementazione, revisione, documentazione), avere una “console di controllo” laterale fa la differenza tra caos e flusso.

## Organizzazione: Spaces → Tabs → Panes
herdr impone un modello semplice e produttivo:

- **Spaces (workspaces)**: tipicamente un progetto o un contesto di lavoro.
- **Tabs**: sezioni del progetto (es. “dev”, “tests”, “agent”, “ops”).
- **Panes**: i terminali veri e propri dentro ogni tab.

Questa gerarchia aiuta molto quando passi spesso da un repository all’altro o quando, nello stesso progetto, vuoi separare:
- comandi di build/test,
- un editor in terminale,
- uno o più agenti AI,
- log e processi di watch.

E soprattutto: puoi farlo senza trasformare il tuo desktop in un mosaico ingestibile.

## TUI, ma senza la barriera d’ingresso
Molti strumenti terminal-first sono potentissimi, ma richiedono una curva di apprendimento ripida fatta di scorciatoie e combinazioni.

herdr invece punta su due cose:
- **shortcut** per lavorare veloce quando vuoi;
- **supporto mouse** per essere operativo subito.

Puoi creare tab, splittare pane, rinominare workspace e accedere a impostazioni anche senza diventare “wizard” del terminale. È un dettaglio che sembra marginale, ma in team o su progetti lunghi riduce drasticamente l’attrito.

## Estendibilità: plug-in (e workflow “auto-migliorante”)
Un altro punto forte: **plug-in**.

L’idea interessante, specie in un contesto agentic, è che herdr non è un blocco monolitico. Puoi:
- installare plug-in esistenti;
- costruirti funzionalità su misura.

Un esempio molto concreto è un **file viewer** integrato: invece di saltare continuamente su un editor esterno per controllare cosa ha cambiato l’agente, puoi aprire un viewer direttamente dentro herdr, vedere file e modifiche (anche non committate), fare una revisione rapida e poi tornare a dare istruzioni all’agente.

Questo favorisce un ciclo stretto:
1) l’agente produce output,
2) tu lo ispezioni velocemente,
3) dai feedback immediati,
4) ripeti.

## Non sostituisce il terminale: si affianca
herdr non è un emulatore di terminale. Lo installi e lo lanci **dentro qualunque terminale** tu stia già usando (su Linux/macOS e con comando dedicato su Windows). L’avvio è essenziale: `herdr` e riparti dal layout precedente.

La cosa importante: grazie al modello client-server, **puoi uscire e rientrare** senza interrompere ciò che sta girando.

## Lavoro remoto senza frizioni: herdr remote
Se usi VPS o macchine remote, herdr offre una modalità per connetterti a un’istanza remota **via SSH**, mantenendo però comodità locali come keybinding e impostazioni.

Invece di:
- entrare in SSH,
- lanciare tool sul server,
- ritrovarti con un’esperienza diversa da macchina a macchina,

puoi avere una sensazione più uniforme: il lavoro “gira” sul server, ma l’ergonomia resta la tua.

## Quando ha più senso adottarlo
herdr dà il meglio se ti riconosci in almeno uno di questi scenari:

- usi **agenti AI via CLI** e ne tieni spesso **più di uno** attivo;
- lavori su **più progetti** e vuoi contesti separati ma navigabili;
- lanci processi lunghi (build, test watch, indicizzazioni) e vuoi **persistenza**;
- ti interessa un ambiente **personalizzabile** e potenzialmente estendibile con plug-in;
- fai spesso lavoro remoto e vuoi un’esperienza coerente.

## Sintesi finale
herdr non è interessante perché “mette più terminali in una finestra”: quello lo fanno in tanti. È interessante perché combina **persistenza dei processi**, **organizzazione strutturata** e **una gestione esplicita degli agenti AI** (con stato e navigazione dedicata), il tutto con una TUI accessibile anche grazie al mouse.

Se la tua giornata alterna agenti, comandi, log e revisioni, herdr diventa rapidamente un *workspace operativo* più che un semplice strumento da terminale: un posto unico dove tenere insieme contesto, progresso e controllo.
