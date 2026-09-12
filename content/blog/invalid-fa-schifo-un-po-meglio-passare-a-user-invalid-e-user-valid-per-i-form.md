---
title: "`:invalid` “fa schifo” (un po’): meglio passare a `:user-invalid` e `:user-valid` per i form"
subtitle: "Niente più campi “sbagliati” o “giusti” prima ancora che l’utente tocchi il form: feedback solo dopo l’interazione, con le nuove pseudo-classi."
description: "Le pseudo-classi CSS :valid e :invalid sono utili, ma spesso producono UI aggressive: campi marcati validi o invalidi appena la pagina carica. Con :user-valid e :user-invalid puoi mostrare lo stato solo dopo che l’utente ha interagito col campo. Vediamo perché cambia tutto, come funziona con required/minlength/pattern e come usarlo come primo livello di feedback senza sostituire la validazione lato server."
publishedAt: 2026-09-10
tags: ["pseudo-classi CSS","validazione form","user-invalid","pattern regex","UX dei form"]
---
## Il problema di `:valid` e `:invalid`: feedback troppo presto
Lo styling dei form non è mai la parte più divertente del frontend, ma alcune feature CSS vengono evitate per un motivo concreto: **possono dare feedback sbagliato al momento sbagliato**.

Con le pseudo-classi classiche:
- `:valid`
- `:invalid`

succede spesso questo:

1) **Input “normali” (non `required`)**: risultano *validi* subito, anche se l’utente non ha scritto nulla. Visivamente, sembra che il form sia “già a posto”.

2) **Input con `required`**: risultano *invalidi* subito perché vuoti. Ma l’utente non ha ancora fatto niente: comunicargli “stai sbagliando” appena apre la pagina è una UX aggressiva.

In pratica, `:valid`/`:invalid` descrivono lo **stato di validità intrinseco** dell’input in quell’istante, non lo stato “percepito” dall’utente dopo un tentativo.

## L’alternativa: `:user-valid` e `:user-invalid`
Le pseudo-classi:
- `:user-valid`
- `:user-invalid`

permettono di **rimandare lo styling di validazione a dopo l’interazione**. Risultato: niente bordi rossi o verdi “a freddo”, e feedback che compare quando ha senso.

L’idea è semplice:
- prima che l’utente tocchi il campo, non mostri nulla;
- dopo che l’utente ci interagisce (es. entra, modifica, esce), lo stato può diventare “valido” o “non valido” e allora lo evidenzi.

### Esempio base di styling
```css
input:user-valid {
  border-color: #16a34a; /* green */
}

input:user-invalid {
  border-color: #dc2626; /* red */
}
```

Questa piccola differenza cambia tantissimo la percezione del form: **feedback contestuale**, non punitivo.

## Come “sa” il browser che un campo è invalido?
Il punto forte della validazione nativa è che il browser conosce già molte regole, se gliele dichiari nel markup.

### `required`
Se un campo è obbligatorio:
```html
<input required>
```
Il browser lo considera invalido quando è vuoto *dopo* l’interazione (se usi `:user-invalid`).

### `minlength`
Per esempio, password con minimo 8 caratteri:
```html
<input type="password" minlength="8" required>
```
Se l’utente inserisce una password troppo corta, il campo diventa invalido e lo styling con `:user-invalid` scatta in modo coerente.

### `pattern` (regex)
Se vuoi una regola più specifica (es. almeno una cifra):
```html
<input
  type="password"
  required
  minlength="8"
  pattern=".*\\d.*"
>
```
Con questo pattern, anche una password lunga può restare invalida finché non contiene almeno un numero. Appena l’utente aggiunge una cifra, il campo diventa valido.

> Nota: questo è un esempio volutamente semplice. In produzione, i pattern vanno progettati con attenzione (e messaggi d’errore chiari).

## Non è “validazione con CSS”: è feedback immediato
È importante essere chiari: **CSS non sostituisce la validazione**.

- CSS può solo *riflettere* lo stato di validità calcolato dal browser.
- La validazione robusta resta lato server (e spesso anche lato client via JS, per UX avanzata).

Dove `:user-valid`/`:user-invalid` brillano è nel ruolo di **prima linea di difesa**:
- guidano l’utente mentre compila;
- riducono tentativi a vuoto al submit;
- evitano di mostrare errori prima che l’utente abbia compiuto un’azione.

## Takeaway pratico
Se oggi stai usando `:valid` e `:invalid` per stilizzare i campi, è probabile che tu stia introducendo rumore visivo: tutto “verde” quando non serve, oppure “rosso” troppo presto.

Passare a `:user-valid` e `:user-invalid` significa allineare la UI a una regola semplice e più umana: **il feedback arriva dopo l’interazione**.

In combinazione con `required`, `minlength` e `pattern`, ottieni un form più chiaro, meno frustrante e più efficace—senza aggiungere logica extra, e senza rinunciare alla validazione seria dove conta davvero (server-side).
