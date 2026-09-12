---
title: "Invoker commands: aprire e chiudere un <dialog> senza JavaScript"
subtitle: "Con command=\"show-modal\" e command=\"close\" puoi pilotare un modal in puro HTML, in modo dichiarativo e accessibile."
description: "Gli invoker commands sono arrivati in baseline e permettono di invocare azioni standard (come aprire/chiudere un <dialog>) direttamente dall’HTML, eliminando JavaScript “di colla” per le interazioni più comuni. Vediamo come funzionano con show-modal e close usando command e commandfor."
publishedAt: 2026-05-14
tags: ["invoker-commands","dialog-html","modali-accessibili","html-dichiarativo","baseline-web"]
---
Gli **invoker commands** sono una piccola grande novità per chi fa frontend: consentono di attivare certe azioni native del browser **direttamente dall’HTML**, senza dover scrivere il classico JavaScript “di contorno” per aprire/chiudere componenti come i modali.

Uno dei casi d’uso più immediati è la gestione del tag **`<dialog>`**, che normalmente si controlla via JavaScript con metodi come `showModal()` e `close()`.

Con gli invoker commands, per molte interazioni puoi invece passare a un approccio **dichiarativo**: descrivi *cosa* deve succedere in markup e lasci al browser l’esecuzione.

## Il problema: controllare un `<dialog>` richiede JS
Un `<dialog>` espone metodi nativi:

- `showModal()` per aprirlo come modale
- `close()` per chiuderlo

Il pattern classico è: bottone → event listener → chiamata a uno dei metodi.

## La soluzione: `command` e `commandfor`
Con gli invoker commands puoi collegare un elemento “invocatore” (tipicamente un bottone) a un target (il tuo `<dialog>`) usando due attributi:

- **`command`**: l’azione da invocare
- **`commandfor`**: l’elemento target, indicato tramite il suo `id`

### Aprire il modal (show-modal)
Ecco un esempio minimale. Nota che il valore di `command` usa la forma **con trattino** (`show-modal`), non camelCase.

```html
<button command="show-modal" commandfor="contact-modal">
  Apri contatti
</button>

<dialog id="contact-modal">
  <p>Scrivimi a…</p>
  
  <button command="close" commandfor="contact-modal">
    Chiudi
  </button>
</dialog>
```

Con questo markup:

- clic su **Apri contatti** → il dialog viene aperto in modalità modale
- clic su **Chiudi** → il dialog viene chiuso

Niente listener. Niente `document.querySelector(...)`. Niente chiamate manuali a `showModal()` e `close()`.

## Chiusura: command="close"
Il pulsante di chiusura segue lo stesso schema:

- `command="close"`
- `commandfor="contact-modal"` (stesso target)

Se il tuo close “smette di funzionare” dopo aver rimosso JavaScript, di solito è perché non è ancora stato aggiornato a questo pattern dichiarativo.

## Perché è utile (anche oltre il “meno JS”)
Ridurre JavaScript è solo una parte del vantaggio. Il punto è avere:

- **markup più espressivo**, che descrive chiaramente l’intento
- **meno codice di glue** da mantenere
- un modello che si integra bene con componenti nativi come `<dialog>`

Per i modali semplici, è una di quelle feature che ti fa chiedere perché non esistesse già.

---

Se usi `<dialog>` per modali di contatto, conferme o micro-form, vale la pena aggiornare il markup: spesso puoi eliminare del tutto lo strato JavaScript dedicato solo ad aprire/chiudere.
