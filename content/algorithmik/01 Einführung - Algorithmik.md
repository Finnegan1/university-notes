---
tags:
  - Algorithmik
  - zusammenfassung
---

>Algorithmus: Beschreibung eines Verfahrens zur schrittweisen Lösung eines Problems

# Qualitäten eines Algorithmus

1. Korrektheit => er sollte das Problem lösen
2. Einfachheit 
	1. einfach zu verstehen
	2. einfach zu Implementieren
3. möglichst geringe Laufzeit und Platzbedarf
=> Trade-Offs

# Abstraktionsebenen eines Algorithmus

1. Mathematik => als Funktion
2. Algorithmische Ebene => als Pseudocode
3. Programmiersprachliche Ebene => in Programmiersprache

# Laufzeitanalyse

Messen der Laufzeit in bspw. ms nicht praktikabel, da von vielen Parametern abhängig ist (Betriebssystem, Cmpilierung etc). Es soll der theoretische Algorithmus und nicht ein bestimmtes Programm / Implementierung gemessen werden.
- Daher messen / zählen der ausgeführten Elementaroperationen
- Darstellen der Anzahl der Elementaroperationen in Abhängigkeit von der Komplexität der Eingabe (Kardinalität der Eingabe) als Funktion

> Elementaroperation: Primitive, die als üblicherweise durch Programmiersprachen angeboten werden und in kurzer, fester Folge von Maschienenoperationen abgebildet werden.
> e.g.    Zuweisung    x:= 1
>	   Vergleich      $x \ge y$
>	   Arithmetische operation 1 + 2
>	   Arrayzugriff s[i]

> Uniformes Kostenmaß: Allgemein geht man davon aus, dass jede Elementaroperation einheitlich Kosten in höhe von 1 hat

## Komplexitätsmaße — Landau Notation

$f, g: N \to R^+$ 

- f beschreibt Wachstum (Laufzeit des Algorithmus)
- g beschreibt Vergleichsfunktion, die Bezugswachstum vergibt $(n, n^2, log(n), ...)$

$$f = O(g) : \iff \exists n_0 \in N, c \in R, C > 0 : \forall n > n_0 \; f(n) \leq c \cdot g(n) $$

<details>
<summary>Erklärung</summary>

Der Ausdruck f = O(g) beschreibt die sogenannte Big-O-Notation. <br><br>

Er bedeutet: Die Funktion f(n) wächst höchstens so schnell wie g(n), bis auf einen konstanten Faktor. <br><br>

Formal heißt das:
Es gibt eine Konstante c > 0 und einen Startwert n₀, sodass für alle n > n₀ gilt:
f(n) ≤ c · g(n) <br><br>

Interpretation in der Laufzeitanalyse: <br>
- f(n) ist die tatsächliche Anzahl der Elementaroperationen eines Algorithmus <br>
- g(n) ist eine einfache Vergleichsfunktion (z.B. n, n², log(n)) <br>
- Konstanten und kleinere Terme spielen für große n keine Rolle <br><br>

Kurz gesagt:<br>
Big-O gibt eine obere Schranke für das Wachstum der Laufzeit eines Algorithmus an.
</details>

### Weitere Notationen

- **Omega-Notation** $f = \Omega(g)$: Gibt eine untere Schranke an – der Algorithmus benötigt mindestens so viel Zeit.
- **Theta-Notation** $f = \Theta(g)$: Gibt eine scharfe Schranke an – der Algorithmus wächst genau in dieser Größenordnung (sowohl obere als auch untere Schranke).
- **Klein-o-Notation** $f = o(g)$: Wächst echt langsamer als g(n) – striktere obere Schranke als Big-O.
- **Klein-omega-Notation** $f = \omega(g)$: Wächst echt schneller als g(n) – striktere untere Schranke als Omega.


nächstes Thema: [[Binäre suche]]