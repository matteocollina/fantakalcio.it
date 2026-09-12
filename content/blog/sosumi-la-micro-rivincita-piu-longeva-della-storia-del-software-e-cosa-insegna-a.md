---
title: "“Sosumi”: la micro-rivincita più longeva della storia del software (e cosa insegna a chi scrive frontend)"
subtitle: "Quando una causa miliardaria finisce… in un nome di sistema, in un file audio e persino in una classe CSS."
description: "Una piccola notifica “a xilofono” presente sui Mac dal 1991 nasconde un gioco di parole nato durante una guerra legale sul marchio Apple. La storia di “Sosumi” è un caso perfetto per capire quanto contino i nomi nel software, perché le rinomine imposte sono pericolose e come una convenzione può sopravvivere per decenni—fino ad arrivare nel CSS di pagine pubbliche."
publishedAt: 2026-07-17
tags: ["naming","api pubbliche","css class naming","debito tecnico","storia del software"]
---
Nel software ci sono dettagli minuscoli che durano più delle architetture, più dei framework e spesso persino più delle ragioni per cui sono nati. Uno di questi è un suono di avviso che molti hanno sentito senza mai farci caso: un brevissimo “toc” da xilofono presente sui Mac dal 1991. Il suo nome storico è **“Sosumi”** — e non è una parola casuale.

È un promemoria sorprendentemente utile per chi sviluppa: parla di **naming**, di **API pubbliche**, di quanto sia fragile cambiare identificatori in corsa, e di come una convenzione apparentemente innocua possa finire per diventare… permanente.

## Due “Apple” e una regola impossibile: «voi computer, noi musica»
Alla fine degli anni ’70 esistevano (e coesistevano malissimo) due aziende con lo stesso nome: da una parte Apple nel mondo dei computer, dall’altra la casa discografica fondata dai Beatles. L’accordo iniziale era semplice solo sulla carta: ok usare “Apple”, ma **niente musica**.

Peccato che i computer, inevitabilmente, abbiano iniziato a fare sempre più musica: chip audio, registrazione, MIDI, funzioni sonore. Da lì, una nuova ondata di contenziosi e un effetto collaterale che ogni team tecnico teme: **quando il legale entra nei dettagli di prodotto**.

Non si parla solo di “questa feature sì / questa feature no”. Si arriva alla granularità dei *nomi*.

## Quando ti fanno rinominare un’API (a progetto avviato)
Nel mondo reale, rinominare un identificatore non è mai solo “cambiare una stringa”. Se l’elemento è pubblico (un’API, una costante, un comando documentato), significa:

- rompere compatibilità con software esistente;
- costringere terzi a migrazioni urgenti;
- aumentare la superficie di bug in prossimità di una deadline;
- introdurre workaround e alias che restano in giro anni.

In questa storia, persino un comando con un nome “troppo musicale” viene spinto a diventare più neutro. È l’incubo di chiunque abbia mai dovuto mantenere un contratto pubblico: **il naming non è solo estetica, è stabilità**.

## “Sosumi”: un nome approvato perché… non è mai stato pronunciato
Arriviamo al suono: un breve alert originariamente chiamato “xylophone” viene segnalato come problematico e deve essere rinominato.

Da frustrazione nasce una battuta: “Ok, allora… *so sue me*”. Detto lentamente, suona come un messaggio passivo-aggressivo perfetto per la situazione. La genialità sta nell’esecuzione: trasformare la frase in un “nome” che sembri innocuo.

Nasce così **S O S U M I** → **Sosumi**.

- Presentato **solo in forma scritta**.
- Evitando accuratamente che qualcuno lo leggesse ad alta voce.
- Giustificato come “parola giapponese” priva di significati musicali.

Il risultato è un piccolo capolavoro di *social engineering* applicato alla burocrazia: il nome passa la revisione e viene spedito nel sistema operativo.

E qui c’è la parte interessante per noi: **una volta che qualcosa viene “shippato” e diventa dipendenza**, rimuoverlo costa più che tenerlo.

## Il vero superpotere: sopravvivere abbastanza a lungo
Il nome “Sosumi” resta lì per anni. Non come easter egg urlato, ma come dettaglio silenzioso in mezzo a milioni di installazioni. E più passa il tempo, più cresce l’inerzia:

- è nei menu;
- è nei file di sistema;
- viene mantenuto nelle release successive;
- viene ri-campionato e aggiornato, ma l’identità resta riconoscibile.

Questa è una lezione su come funziona davvero la longevità nel software: **non vince l’idea più “giusta”**, vince spesso **quella che è entrata nel flusso e non crea abbastanza dolore da essere rimossa**.

## Dal suono al frontend: “sosumi” finisce persino nel CSS
C’è un altro dettaglio che rende la storia irresistibile per chi fa frontend: lo stesso termine compare come **nome di classe CSS** usato per stilizzare testi legali e note a piè pagina (il classico “fine print”).

È un esempio perfetto di come le convenzioni migrino tra domini:

- oggi nasce come nome interno di un asset;
- domani diventa stringa in un repository;
- dopodomani è parte di markup/CSS pubblico;
- a quel punto è *de facto* una convenzione.

E sì: è esattamente quel tipo di cosa che poi ritrovi in DevTools, ti chiedi “perché si chiama così?”, e ti rendi conto che il software è anche antropologia.

## Cosa portarsi a casa (in pratica) quando dai nomi alle cose
La morale non è “metti battute ovunque”. Anzi: nel lavoro quotidiano, i nomi devono soprattutto essere chiari, manutenibili e coerenti. Però questa storia lascia tre indicazioni molto concrete.

### 1) Tratta il naming come parte dell’API
Anche nel frontend:
- nomi di classi pubbliche in design system;
- data-attributes usati da terze parti;
- eventi custom;
- chiavi di i18n;
- nomi di token CSS.

Una volta consumati, **sono contratti**.

### 2) Evita rinomine arbitrarie a ridosso della consegna
Se devi rinominare:
- prevedi alias e deprecazioni;
- automatizza codemod/lint per la migrazione;
- pianifica una finestra di transizione;
- documenta il “perché” (il contesto sparisce, il codice resta).

### 3) Ricordati che alcune scelte ti sopravvivono
Nel bene e nel male. Un nome buttato lì oggi può finire:
- nelle API di un SDK;
- nel markup di una pagina che non controllerai più;
- in snippet copiati da altri team;
- in migliaia di test e selector.

Scegliere bene è un investimento, non una formalità.

## Sintesi
“Sosumi” è un dettaglio minuscolo diventato storico perché incrocia tre forze che governano il software: **vincoli legali**, **inerzia delle release** e **peso del naming**. Per chi scrive frontend è un promemoria potente: le stringhe che inventiamo — classi, token, nomi di componenti — non sono solo etichette. Sono interfacce che possono rimanere in produzione molto più a lungo del contesto che le ha generate.

La prossima volta che stai per chiamare qualcosa “tmp”, “final2”, “new-new” o un nome scelto di fretta, fermati un secondo: potrebbe essere ancora lì tra trent’anni.
