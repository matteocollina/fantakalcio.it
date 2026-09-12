---
title: "Che framework scegliere oggi? Il paradosso: vince Svelte, ma “nessun framework” è tra i preferiti"
subtitle: "Quando si riparte da zero, molti frontend non scelgono il solito “default”: contano performance percepite, complessità operativa e debito di tooling."
description: "Se dovessi iniziare un nuovo progetto e scegliere un framework JavaScript, cosa prenderesti? Una piccola fotografia delle preferenze mette in luce due segnali interessanti: Svelte davanti a React e una fetta rilevante di sviluppatori che preferisce… non scegliere alcun framework. Ecco cosa significa (davvero) e come trasformarlo in una decisione pratica per il tuo prossimo progetto."
publishedAt: 2026-08-20
tags: ["Svelte","React","Vue","vanilla JS","scelta tecnologica","tooling frontend"]
---
Scegliere un framework quando si apre un progetto nuovo è una decisione che sembra banale (“prendiamo quello più usato e via”), ma negli ultimi anni sta diventando sempre più sfumata. Le preferenze reali dei frontend, infatti, non raccontano solo “chi è più popolare”: raccontano cosa pesa davvero nella quotidianità—DX, performance, complessità, manutenzione.

Una fotografia interessante delle preferenze mette in evidenza quattro nomi ricorrenti e, soprattutto, una presenza sorprendente: **“nessun framework”** come scelta deliberata.

## La classifica che non ti aspetti: Svelte davanti a React
In un contesto in cui molti darebbero per scontato React in cima, emerge invece **Svelte come prima scelta** per iniziare un progetto da zero, con **React subito dietro**.

Questo non significa che React “stia morendo” (non lo è), ma indica un cambio di sensibilità:

- **Peso della complessità**: React è un ecosistema enorme e potente, ma spesso richiede decisioni architetturali e di tooling che non sono gratuite (routing, data fetching, state, rendering strategy, ecc.).
- **Desiderio di semplicità operativa**: Svelte viene percepito come più diretto: meno strati, meno boilerplate, feedback loop rapido.
- **Performance e output**: l’idea di “meno runtime, più compilazione” continua a essere attraente quando si vuole un’app snella.

In breve: non è solo una questione di sintassi, ma di **quanto attrito introduce il framework nel ciclo di sviluppo e nel mantenimento**.

## Vue resta tra le scelte più solide
**Vue** compare stabilmente tra le preferenze “top”, e non è una sorpresa: è spesso visto come un buon compromesso tra approccio strutturato e curva di apprendimento relativamente morbida.

Quando Vue viene scelto, di solito è perché:

- l’esperienza di sviluppo è coerente e “guidata”; 
- la separazione dei pezzi in SFC funziona bene per team e codebase medio-grandi;
- l’ecosistema è abbastanza completo senza risultare ingestibile.

## Il dato più interessante: “nessun framework” è una scelta
Il punto che vale più di una classifica è questo: una parte significativa di sviluppatori, quando può scegliere liberamente, mette tra le opzioni preferite **“no framework”** (vanilla, o quasi).

Non è nostalgia. È un segnale pratico:

- **Per molti progetti non serve una SPA**: pagine marketing, documentazione, form semplici, aree riservate leggere… spesso si reggono meglio con HTML/CSS/JS essenziali.
- **Riduzione del debito**: dipendenze, aggiornamenti, breaking changes, migrazioni—tutto ciò ha un costo reale nel tempo.
- **Progressive enhancement**: aggiungere interattività dove serve, senza trasformare tutto in un’app.

Questa scelta è particolarmente sensata se hai:

- poche view e poca logica di stato;
- un team piccolo;
- vincoli di performance e tempi stretti;
- bisogno di stabilità a lungo termine più che di velocità di prototipazione.

## E gli “altri” (Astro, Solid, ecc.)?
È interessante notare che alcuni nomi molto discussi (ad esempio **Astro** o **Solid**) possono avere presenza, ma non sempre rientrano nelle primissime preferenze in una classifica “secca”. Non perché non siano validi, ma perché spesso rispondono a esigenze più specifiche:

- **Astro** brilla quando il progetto è content-driven e vuoi massimizzare resa e performance con isole di interattività.
- **Solid** è estremamente convincente sul piano tecnico e delle performance, ma la scelta di un framework è anche ecosistema, hiring, abitudini del team.

## Come trasformare queste preferenze in una decisione pratica
Più che chiederti “qual è il framework più amato”, prova a partire da queste domande:

1. **Quanto stato complesso avrà l’interfaccia?** Se tanto, un framework strutturato (React/Vue/Svelte) ha senso.
2. **Quante persone toccheranno il codice e per quanto tempo?** Più è lunga la vita del progetto, più pesano stabilità e costi di aggiornamento.
3. **Serve davvero una SPA?** Se no, la scelta migliore può essere una base server-rendered o addirittura vanilla + componenti mirati.
4. **Qual è il vero collo di bottiglia?** Time-to-market? Performance? Manutenibilità? Hiring? La risposta cambia la tecnologia.

## Sintesi finale
La lettura più utile è questa: oggi molti frontend **premiano la semplicità concreta**. Svelte viene scelto perché riduce attrito e burocrazia tecnica; React resta fortissimo ma non è più l’unico “default mentale”; Vue continua a essere una scelta affidabile; e “nessun framework” non è un meme, ma una strategia per contenere complessità e debito.

Se stai per iniziare un progetto, la decisione migliore spesso non è “quale framework è più popolare”, ma **quale quantità di framework ti serve davvero**—né più, né meno.
