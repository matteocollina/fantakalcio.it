---
title: "Python per chi fa frontend: variabili, stringhe e input per costruire una mini app “split bill”"
subtitle: "Un primo progetto pratico (tipo “PayUp”) per imparare le basi senza perdersi in teoria."
description: "Python è una scelta sensata anche per chi lavora soprattutto nel frontend: si legge facilmente, si scrive in fretta e torna utile per scripting, automazioni e prototipi. In questo articolo rivediamo i mattoni fondamentali (variabili, tipi, stringhe, formattazione e input) costruendo una piccola app da terminale per dividere una spesa con percentuale di servizio e numero di persone."
publishedAt: 2026-09-09
tags: ["variabili-python","stringhe-e-formattazione","input-utente","tipi-e-conversioni","mini-progetto-cli"]
---
Chi fa frontend spesso associa la produttività a due cose: **feedback rapido** e **codice leggibile**. Python spicca proprio qui: sintassi pulita, poche “cerimonie”, e un percorso ideale per costruire piccoli strumenti utili (anche nel lavoro quotidiano: script, generatori, analisi veloci, automazioni).

Per fissare le basi senza rimanere impantanati nella teoria, l’approccio migliore è un micro‑progetto: una mini app da terminale per **splittare una spesa** (cena, viaggio, serata), calcolare una percentuale di servizio/mancia e ottenere quanto deve pagare ogni persona.

Di seguito trovi i concetti fondamentali che servono, con esempi mirati.

---

## 1) Anatomia minima di un programma Python: variabili e `print()`

Una **variabile** è un’etichetta che punta a un valore. In Python l’assegnazione si fa con `=`:

```py
meal_total = 85
print(meal_total)  # 85
```

Il punto interessante non è stampare `85`, ma capire che:

- puoi **usare il nome** (`meal_total`) in più punti;
- cambiando il valore **in un solo posto**, tutto ciò che dipende da quel valore si aggiorna.

```py
meal_total = 85
service_charge = 15
grand_total = meal_total + service_charge
print(grand_total)  # 100

meal_total = 120
grand_total = meal_total + service_charge
print(grand_total)  # 135
```

### Re-assegnazione: l’ultimo valore “vince”

Una variabile può essere riassegnata:

```py
my_party = 3
print(my_party)  # 3

my_party = 5
print(my_party)  # 5
```

Non esiste “memoria” automatica dei vecchi valori: una riassegnazione sostituisce il riferimento precedente.

---

## 2) Convenzioni di naming (per non odiarti tra una settimana)

In Python, lo standard de facto è lo **snake_case**:

- ✅ `drinks_total`, `service_percentage`, `people_count`
- ❌ `drinksTotal` (camelCase stile JS)
- ❌ `x`, `y` se non sono davvero variabili “matematiche” senza significato di dominio

E occhio alle **parole riservate**: `print`, `for`, `if`, ecc. non possono essere nomi di variabili.

---

## 3) Stringhe: testo tra virgolette (sempre coerenti)

Per salvare testo usi una **stringa**, racchiusa tra apici singoli o doppi:

```py
restaurant = "Paul's Pizza"
occasion = 'cena di gruppo'
```

L’importante è **non mischiare** gli apici nella stessa stringa:

```py
# ERRORE
lunch = "salad'
```

E se scrivi testo senza virgolette, Python lo interpreta come nome di variabile:

```py
# ERRORE: NameError
meal = pizza
```

### Concatenazione: sommare stringhe

Le stringhe si possono “sommarle” (concatenare):

```py
breakfast = "pancakes "
lunch = "salad "
dinner = "pizza"

meal_plan = breakfast + lunch + dinner
print(meal_plan)  # pancakes salad pizza
```

Funziona, ma per testi più lunghi spesso conviene usare **formattazione** (vedi più sotto).

---

## 4) Commenti: istruzioni che Python ignora

Una riga che inizia con `#` è un commento:

```py
# TODO: gestire input non valido
```

Ottimi per lasciare note o spiegare passaggi chiave.

---

## 5) Input da utente: `input()` e conversioni di tipo

Una mini app “split bill” ha bisogno di chiedere informazioni. In Python si usa:

```py
name = input("Come ti chiami? ")
```

Attenzione: **`input()` restituisce sempre una stringa**. Se ti serve un numero, devi convertire:

```py
expense = float(input("Totale spesa? "))
people = int(input("Quante persone? "))
service_pct = float(input("Servizio (%)? "))
```

Qui entrano in gioco i **tipi** più comuni:

- `str` per testo
- `int` per interi
- `float` per decimali

---

## 6) Mini progetto: “PayUp” (split bill da terminale)

Ecco una versione compatta e leggibile dell’app:

```py
print("Benvenuto in PayUp!\n")

occasion = input("Occasione/locale: ")
expense = float(input("Spesa totale (€): "))
service_pct = float(input("Servizio/mancia (%) : "))
people = int(input("Numero persone: "))

service_amount = expense * (service_pct / 100)
grand_total = expense + service_amount
per_person = grand_total / people

print("\n--- Riepilogo ---")
print(f"Occasione: {occasion}")
print(f"Spesa: €{expense:.2f}")
print(f"Servizio ({service_pct:.0f}%): €{service_amount:.2f}")
print(f"Totale: €{grand_total:.2f}")
print(f"Persone: {people}")
print(f"Quota a testa: €{per_person:.2f}")
```

### Perché `f"..."` è una buona abitudine

Le **f-string** rendono il testo più leggibile rispetto a concatenazioni infinite e gestiscono bene numeri e formati:

- `€{expense:.2f}` forza due decimali
- `({service_pct:.0f}%)` stampa la percentuale senza decimali

---

## Sintesi e implicazione pratica

Con un progetto piccolo come uno split bill hai già toccato i mattoni essenziali di Python:

- variabili e riassegnazione
- `print()` e output leggibile
- stringhe e formattazione
- input utente
- tipi (`str`, `int`, `float`) e conversioni
- operazioni matematiche di base

Il passo successivo, per rendere l’app “da usare davvero”, è aggiungere **validazione dell’input** (es. persone > 0, percentuale non negativa, gestione di valori non numerici) e incapsulare il tutto in funzioni. Ma già così hai un esempio concreto di come Python permetta di costruire strumenti utili in pochi minuti, con un codice che resta chiaro anche a distanza di tempo.
