---
tags:
  - Algorithmik
  - zusammenfassung
---

## Grundlagen

### Komplexitätsklassen

Aus TI bekannt sind die Komplexitätsklassen **P** und **NP**:
- **P**: Klasse der in polynomieller Zeit entscheidbaren Probleme
- **NP**: 
	- Klasse der in nichtdeterministisch polynomieller Zeit entscheidbaren Probleme
	- Äquivalent: In deterministischer Zeit verifizierbare Probleme
- **EXP**: Klasse der in exponentieller Zeit entscheidbaren Probleme

![[Bildschirmfoto 2026-01-02 um 21.41.53.png]]

**Beziehungen**: $\text{P} \subseteq \text{NP} \subseteq \text{EXP}$

**Offene Frage**: Ist P = NP? (Eines der größten ungelösten Probleme der Informatik)

Eine Teilmenge von **NP** ist die Klasse der **NP-vollständigen** Probleme, für die kein Entscheidungsverfahren mit polynomieller Laufzeit bekannt ist.

#### Was bedeutet NP-vollständig?

Ein Problem ist **NP-vollständig**, wenn es zwei Eigenschaften erfüllt:

1. **Das Problem liegt in NP**: Eine gegebene Lösung kann in polynomieller Zeit verifiziert werden
2. **Das Problem ist NP-schwer**: Jedes andere Problem in NP kann in polynomieller Zeit auf dieses Problem reduziert werden

> [!note] Was bedeutet "Reduktion"? (Einfach erklärt)
> **Reduktion = Übersetzung zwischen Problemen**
>
> Wenn du Problem A auf Problem B reduzieren kannst:
> - Du übersetzt A → B (schnell, in polynomieller Zeit)
> - Löst du B, hast du auch A gelöst
> - **Also**: B ist mindestens so schwer wie A
>
> **Beispiel**:
> - A = "Hat dieser Graph einen Hamiltonschen Kreis?"
> - B = "Gibt es eine TSP-Tour mit Länge ≤ n?"
> - Übersetze Graph → TSP-Distanzmatrix (Kante existiert = 1, sonst = ∞)
> - Lösung für TSP gibt dir die Antwort für Hamiltonschen Kreis
>
> **NP-schwer bedeutet**: Du kannst **ALLE** NP-Probleme auf dieses Problem übersetzen.
> → Es ist mindestens so schwer wie jedes andere NP-Problem!

> [!example] Beispiel: Reduktion von Hamiltonscher Kreis auf TSP
> **Ausgangspunkt**: Wir wissen bereits, dass "Hamiltonscher Kreis" NP-vollständig ist.
>
> **Ziel**: Zeigen, dass [[TSP]] (Traveling Salesman Problem) ebenfalls NP-schwer ist.
>
> **Hamiltonscher Kreis**: Gibt es in einem Graphen einen Kreis, der jede Stadt genau einmal besucht?
>
> **TSP**: Gibt es eine Rundreise durch alle Städte mit Gesamtlänge ≤ k?
>
> ### Die Reduktion (Übersetzung)
>
> **Schritt 1**: Nimm eine beliebige Instanz des Hamiltonschen Kreis Problems
> - Gegeben: Ein Graph $G = (V, E)$ mit Städten und Kanten
> - Frage: Hat dieser Graph einen Hamiltonschen Kreis?
>
> **Schritt 2**: Konstruiere daraus eine TSP-Instanz in polynomieller Zeit
> - Erstelle eine Entfernungsmatrix für alle Städte:
>   - Wenn Kante $(i, j)$ **existiert** in $G$: setze $d_{ij} = 1$
>   - Wenn Kante $(i, j)$ **nicht existiert**: setze $d_{ij} = \infty$ (oder eine sehr große Zahl $> n$)
> - Setze Schwellwert $k = n$ (Anzahl der Städte)
> - Frage: Gibt es eine TSP-Rundreise mit Länge ≤ n?
>
> **Schritt 3**: Zeige die Äquivalenz der Antworten
> - **Wenn** $G$ einen Hamiltonschen Kreis hat:
>   - Dann gibt es eine Rundreise, die nur existierende Kanten benutzt
>   - Diese Tour hat Länge genau $n$ (n Kanten mit Gewicht 1)
>   - Also: TSP-Antwort = JA (es gibt Tour mit Länge ≤ n)
>
> - **Wenn** $G$ keinen Hamiltonschen Kreis hat:
>   - Jede Rundreise muss mindestens eine nicht-existierende Kante benutzen
>   - Diese hat Gewicht $\infty$, also Gesamtlänge > n
>   - Also: TSP-Antwort = NEIN (keine Tour mit Länge ≤ n)
>
> ### Warum macht das TSP NP-schwer?
>
> **Argumentation**:
> 1. Hamiltonscher Kreis ist NP-vollständig (bekannt)
> 2. Wir können Hamiltonscher Kreis in polynomieller Zeit auf TSP reduzieren (siehe oben)
> 3. **Wenn** es einen polynomiellen TSP-Algorithmus gäbe:
>    - Könnten wir damit auch Hamiltonscher Kreis in polynomieller Zeit lösen
>    - Einfach die Reduktion anwenden und dann TSP lösen
> 4. **Aber** Hamiltonscher Kreis ist NP-vollständig → kein polynomieller Algorithmus (falls P ≠ NP)
> 5. **Schlussfolgerung**: TSP kann auch nicht in polynomieller Zeit lösbar sein
>
> ### Fazit
>
> TSP ist mindestens so schwer wie Hamiltonscher Kreis. Da man zusätzlich zeigen kann, dass TSP in NP liegt (eine Lösung kann schnell verifiziert werden), ist TSP **NP-vollständig**.

> [!important] Bedeutung von NP-vollständig
> NP-vollständige Probleme sind die **schwierigsten Probleme in NP**. Wenn man für irgendein NP-vollständiges Problem einen polynomiellen Algorithmus findet, dann kann man damit **alle Probleme in NP** in polynomieller Zeit lösen – und es würde P = NP gelten.

> [!tip] Praktische Konsequenz
> Wenn du zeigen kannst, dass ein Problem NP-vollständig ist, weißt du:
> - Es gibt wahrscheinlich keinen effizienten Algorithmus
> - Du solltest nach Approximationsalgorithmen oder heuristischen Lösungen suchen
> - Für kleine Eingaben können exakte Lösungen noch praktikabel sein

**Wichtig**: Genau dann, wenn es ein **NP-vollständiges** Problem gibt, das in **P** liegt, gilt **P = NP**.

### NP-vollständige Optimierungsprobleme

Einem Optimierungsproblem lässt sich ein Entscheidungsproblem zuordnen, indem man die Frage stellt, ob es eine Instanz gibt, deren Bewertung einen Schwellwert unterschreitet (Minimierungsproblem) bzw. überschreitet (Maximierungsproblem).

**Schlussfolgerung**: Da man aus einem Entscheidungsproblem eine Lösung des Optimierungsproblems erzeugen kann, ist das Optimierungsproblem mindestens so schwierig wie das Entscheidungsproblem.


[[TSP]] 