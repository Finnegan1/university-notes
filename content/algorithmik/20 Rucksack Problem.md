---
tags:
  - Algorithmik
  - zusammenfassung
---

## Grundkonzept

Das **Rucksack-Problem** (Knapsack Problem) ist ein klassisches **NP-vollständiges** Optimierungsproblem.

**Problemstellung:**
- Gegeben: Ein Rucksack der Größe $y$ sowie $n$ Gegenstände mit Größen $x_1, \ldots, x_n$ und Werten
- Gesucht: Eine optimale (maximale) Bepackung des Rucksacks, ohne dessen Größe zu überschreiten
- Ziel: Maximierung des Gesamtwerts der ausgewählten Gegenstände (möglichst viel Gewicht tragen)

> [!note] Naive Lösung
> Das Ausprobieren aller $2^n$ Einpackmöglichkeiten führt zu einer exponentiellen Laufzeit von $O(2^n)$ und ist daher unpraktikabel.

**Grundidee des effizienten Ansatzes:**
Optimale Bepackungen für kleinere Rucksäcke bestimmen und Gegenstände schrittweise hinzufügen (Dynamische Programmierung).

## Algorithmus

### Rekursionsformel (Satz 4.1)

Sei $r(n, y)$ der Wert einer Lösung des Rucksack-Problems für die Werte $x_1, \ldots, x_n$ und der Rucksackgröße $y$. Dann gilt:

$$
r(n, y) = \begin{cases}
0 & \text{für } n = 0 \\
r(n-1, y) & \text{für } n > 0 \text{ und } x_n > y \\
\max\{r(n-1, y), r(n-1, y-x_n) + x_n\} & \text{sonst}
\end{cases}
$$

### Fallunterscheidung

Die Rekursionsformel basiert auf folgender Überlegung:

**Fall 1: $n = 0$**
- Es gibt keine Gegenstände zum Einpacken
- Daher ist $r(n, y) = 0$

**Fall 2: $n > 0$ und $x_n > y$**
- Gegenstand $n$ ist größer als die Rucksackgröße
- Gegenstand $n$ kann nicht eingepackt werden
- Daher gilt: $r(n, y) = r(n-1, y)$

**Fall 3: $n > 0$ und $x_n \leq y$**
- Gegenstand $n$ kann eingepackt werden oder nicht
  - **Fall 3.1 (nicht einpacken):** Wert der Lösung ist $r(n-1, y)$
  - **Fall 3.2 (einpacken):** Wenn $r(n, y)$ der Wert der Lösung ist und Gegenstand $n$ wieder entfernt wird, ist der Wert des Rucksacks $r(n-1, y-x_n)$
  - Daraus folgt: $r(n, y) = r(n-1, y-x_n) + x_n$
- **Das Optimum:** $\max\{r(n-1, y), r(n-1, y-x_n) + x_n\}$

> [!tip] Dynamische Programmierung
> Die Rekursionsformel ermöglicht einen Bottom-Up-Ansatz: Berechne systematisch alle Teilprobleme in einer Tabelle, beginnend bei kleinen Werten.

### Beweis der Korrektheit

Der Beweis erfolgt durch **Induktion nach $n$** mit **Fallunterscheidung**:

- **Induktionsanfang ($n=0$):** Trivial, da keine Gegenstände vorhanden sind
- **Induktionsschritt:** Die Fallunterscheidung zeigt, dass entweder Gegenstand $n$ zu groß ist (Fall 2) oder das Optimum durch Vergleich von "einpacken" vs. "nicht einpacken" gefunden wird (Fall 3)

## Laufzeitanalyse

### Dynamischer Programmieralgorithmus

Aus der Rekursionsformel erhalten wir unmittelbar einen **Dynamischen Programmieralgorithmus**:

- **Naive Laufzeit:** $O(n) \cdot O(y) \cdot O(1) = O(ny)$
- Die Laufzeit ist **linear in der Anzahl Gegenstände** und **der Rucksackgröße**

> [!warning] Überraschung: Das Problem ist NP-vollständig!
> Die lineare Laufzeit $O(ny)$ scheint dem Widerspruch zu widersprechen, dass das Rucksack-Problem **NP-vollständig** ist. Die Auflösung liegt in der **Eingabelänge**.

### Pseudopolynomielle Laufzeit

Die Länge der Binärdarstellung einer Zahl $x$ ist $\log_2 x + \Theta(1)$.

Wenn die Werte $x_1, \ldots, x_n, y$ binär codiert werden, liegt die Laufzeit in:

$$
\Theta(ny) = \Theta(n \cdot 2^{\log_2 y}) = \Theta(n \cdot 2^{\log_2 y + \Theta(1)}) = \Theta(n \cdot 2^{|y|})
$$

und ist daher **exponentiell in $|y|$** (der Länge der Binärdarstellung von $y$).

> [!important] Definition: Pseudopolynomiell
> Ein Algorithmus heißt **pseudopolynomiell**, wenn seine Laufzeit durch ein Polynom in der **Eingabelänge** und der **größten, in der Eingabe vorkommenden Zahl** beschränkt ist.

### Eingabelänge vs. Zahlengröße

Sei $|w|$ die Eingabelänge des Rucksack-Problems (enthält Rucksackgröße $y$ und Größen der Gegenstände $x_1, \ldots, x_n$). Dann gilt:

$$
n \leq |w| \quad \text{und} \quad O(ny) \subseteq O(|w| \cdot m) \text{ mit } m = \max\{x_1, \ldots, x_n, y\}
$$

Der Dynamische Programmieralgorithmus für das Rucksack-Problem ist daher **pseudopolynomiell**.

> [!note] Praktikabilität
> Ein pseudopolynomieller Algorithmus für ein **NP-vollständiges Problem** ist praktikabel, wenn die Größe der in der Eingabe vorkommenden Zahlen ein sinnvolles Maß für die Größe des Problems ist als die Länge der Eingabe.

### Starke NP-Vollständigkeit

- Es gibt eine Teilmenge der **NP-vollständigen Probleme**, die **stark NP-vollständigen Probleme**, für die keine pseudopolynomiellen Algorithmen bekannt sind
- Aus $\mathbf{P} \neq \mathbf{NP}$ folgt, dass für kein stark NP-vollständiges Problem ein pseudopolynomieller Algorithmus existiert

> [!example] Komplexitätsklassen
> - Das Rucksack-Problem ist NP-vollständig, aber **nicht stark NP-vollständig**
> - Es besitzt einen pseudopolynomiellen Algorithmus mit $O(ny)$

## Beispiel

### Tabellarische Berechnung

Die Rekursionsformel wird durch systematisches Ausfüllen einer Tabelle umgesetzt:

- **Zeilen:** Gegenstände (von 0 bis $n$)
- **Spalten:** Rucksackgrößen (von 0 bis $y$)
- **Eintrag $r(i, j)$:** Optimaler Wert für die ersten $i$ Gegenstände bei Rucksackgröße $j$

**Vorgehen:**
1. Initialisiere erste Zeile mit 0 (keine Gegenstände)
2. Für jeden Gegenstand $i$ und jede Größe $j$:
   - Falls $x_i > j$: $r(i, j) = r(i-1, j)$ (Gegenstand passt nicht)
   - Sonst: $r(i, j) = \max\{r(i-1, j), r(i-1, j-x_i) + x_i\}$

> [!tip] Implementierungshinweis
> Es wird immer die **gesamte Tabelle** berechnet (kein Abbruch), deshalb folgt für $O(ny)$ auch $\Theta(ny)$.

## Zusammenfassung

| Eigenschaft                  | Wert                                                   |
| ---------------------------- | ------------------------------------------------------ |
| **Problemtyp**               | NP-vollständiges Optimierungsproblem                   |
| **Lösungsansatz**            | Dynamische Programmierung                              |
| **Laufzeit (naiv)**          | $O(2^n)$ - alle Möglichkeiten durchprobieren           |
| **Laufzeit (DP)**            | $O(ny)$ - pseudopolynomiell                            |
| **Tatsächliche Komplexität** | $\Theta(n \cdot 2^{y})$ - exponentiell in Eingabelänge |
| **Praktikabilität**          | Gut für kleine Werte von $y$                           |

> [!important] Kernaussagen
> 1. Das Rucksack-Problem ist **NP-vollständig**
> 2. Der DP-Algorithmus hat **pseudopolynomielle** Laufzeit $O(ny)$
> 3. Die Laufzeit ist **exponentiell in der Binärlänge** von $y$: $\Theta(n \cdot 2^{|y|})$
> 4. Für praktische Anwendungen mit moderaten Werten ist der Algorithmus effizient




next: [[Viterbi-Algorithmus]]
