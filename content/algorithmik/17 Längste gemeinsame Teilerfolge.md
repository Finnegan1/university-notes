---
tags:
  - Algorithmik
  - zusammenfassung
---

# Längste gemeinsame Teilfolge (LCS)

## Grundkonzept

Das **Longest Common Subsequence (LCS)** Problem sucht die längste Teilfolge, die in zwei gegebenen Sequenzen vorkommt. Die Teilfolge muss **kein Teilstring** sein - Zeichen können übersprungen werden, aber die Reihenfolge muss erhalten bleiben.

Eine längste gemeinsame Teilfolge erhalten wir aus Strings $a, b$ durch das Streichen von Zeichen. Diese Teilfolge muss kein zusammenhängender Teilstring sein.

**Beispiel:**
- Sequenz A: `BANANEN BLATT`
- Sequenz B: `ANANAS BLATT`
- Eine längste gemeinsame Teilfolge: `ANAN BLATT` (nicht zusammenhängend)

**Weiteres Beispiel aus Vorlesung:**
- Sequenz A: `ANANAS`
- Sequenz B: `BANANE`
- Längste gemeinsame Teilfolge: `ANAN` (Länge 4)

## Algorithmus (Dynamische Programmierung)

### Verfahren

Sei $d_{ij}$ die Länge der längsten gemeinsamen Teilfolge von Präfix $a_1 \ldots a_i$ und $b_1 \ldots b_j$.

### Rekursionsformel

$$
d_{ij} = \begin{cases}
0 & \text{für } i = 0 \text{ oder } j = 0 \\
\max\{d_{i-1,j-1} + \mathbb{1}(a_i = b_j), d_{i-1,j}, d_{i,j-1}\} & \text{sonst}
\end{cases}
$$

wobei $\mathbb{1}(a_i = b_j) = 1$ falls $a_i = b_j$, sonst $0$.

### Fallunterscheidung

Wir betrachten folgende Möglichkeiten:

**Fall 1: $a_i = b_j$** (Zeichen stimmen überein)
- Die Teilfolge kann verlängert werden: $d_{ij} = d_{i-1,j-1} + 1$
- Beide Zeichen gehören zur gemeinsamen Teilfolge

**Fall 2: $a_i \neq b_j$** (Zeichen stimmen nicht überein)
- Eines der letzten beiden Zeichen wird gestrichen:
  - **$a_i$ streichen:** $d_{ij} = d_{i-1,j}$
  - **$b_j$ streichen:** $d_{ij} = d_{i,j-1}$
- Wir nehmen das Maximum beider Optionen

**Fall 3: Basisfall**
- Wenn $i = 0$ oder $j = 0$: $d_{ij} = 0$ (leere Sequenz)

**Wichtig:** Wir wählen diejenige Möglichkeit mit der besten Bewertung. Damit ergibt sich:

$$
d_{ij} = \max\begin{cases}
d_{i-1,j-1} + 1 & \text{wenn } a_i = b_j \\
d_{i-1,j} & \text{wenn } a_i \text{ streichen} \\
d_{i,j-1} & \text{wenn } b_j \text{ streichen}
\end{cases}
$$

## Beispiel

**Gegeben:**
- Sequenz A: `BANANA` (Zeilen)
- Sequenz B: `ANANAS` (Spalten)

### DP-Tabelle

|     | ε | A | N | A | N | A | S |
|-----|---|---|---|---|---|---|---|
| **ε** | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **B** | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **A** | 0 | 1 | 1 | 1 | 1 | 1 | 1 |
| **N** | 0 | 1 | 2 | 2 | 2 | 2 | 2 |
| **A** | 0 | 1 | 2 | 3 | 3 | 3 | 3 |
| **N** | 0 | 1 | 2 | 3 | 4 | 4 | 4 |
| **A** | 0 | 1 | 2 | 3 | 4 | 4 | 4 |

**Lösung:** $d_{6,6} = 4$ (untere rechte Ecke, ohne das 'S')

Die längste gemeinsame Teilfolge hat die Länge 4 (z.B. `ANAN`).

### Berechnung der Tabelle

Die Tabelle wird **zeilenweise von links nach rechts** gefüllt:

1. **Initialisierung:** Erste Zeile und Spalte mit 0 füllen (Basisfall)
2. **Für jedes Feld** $(i,j)$:
   - Wenn $a_i = b_j$: $d_{ij} = d_{i-1,j-1} + 1$
   - Sonst: $d_{ij} = \max(d_{i-1,j}, d_{i,j-1})$

**Beispiel für Position (4,4):**
- $a_4 = N$, $b_4 = N$ → $a_4 = b_4$
- $d_{4,4} = d_{3,3} + 1 = 3 + 1 = 4$

**Beispiel für Position (5,5):**
- $a_5 = A$, $b_5 = A$ → $a_5 = b_5$
- $d_{5,5} = d_{4,4} + 1 = 4 + 1 = 5$
- Moment: In der Tabelle steht 4, nicht 5. Das bedeutet hier ist ein Fehler...
- Korrektur: Position (5,5) in der Tabelle bezieht sich auf $a_5 = N$ (5. Zeichen von BANANA) und $b_5 = A$ (5. Zeichen von ANANAS)
- Also $N \neq A$, daher: $d_{5,5} = \max(d_{4,5}, d_{5,4}) = \max(4, 3) = 4$ ✓

### Rückverfolgung (Backtracking)

Um die tatsächliche Teilfolge zu rekonstruieren, startet man bei $d_{m,n}$ und geht rückwärts:

1. **Start:** Position $(m, n)$ (untere rechte Ecke)
2. **Für Position** $(i, j)$:
   - Wenn $a_i = b_j$: Gehe diagonal nach $(i-1, j-1)$, füge Zeichen $a_i$ zur Lösung hinzu
   - Sonst:
     - Wenn $d_{i-1,j} > d_{i,j-1}$: Gehe nach oben zu $(i-1, j)$
     - Sonst: Gehe nach links zu $(i, j-1)$
3. **Stop:** Wenn $i = 0$ oder $j = 0$

**Im Beispiel (BANANA / ANANAS):**
- Start bei (6,6): Wert 4, aber $A \neq S$ → gehe nach links zu (6,5)
- (6,5): Wert 4, $A = A$ ✓ → diagonal zu (5,4), füge 'A' hinzu
- (5,4): Wert 4, $N = N$ ✓ → diagonal zu (4,3), füge 'N' hinzu
- (4,3): Wert 3, $A = A$ ✓ → diagonal zu (3,2), füge 'A' hinzu
- (3,2): Wert 2, $N = N$ ✓ → diagonal zu (2,1), füge 'N' hinzu
- (2,1): Wert 0, $B \neq A$ → stoppe

**Ergebnis:** ANAN (rückwärts gelesen: NANA → falsch)
**Richtig:** Die Zeichen in richtiger Reihenfolge: ANAN

## Laufzeitanalyse

- **Zeitkomplexität:** $O(m \cdot n)$
  - $m$ = Länge der Sequenz A
  - $n$ = Länge der Sequenz B
  - Jedes Feld der DP-Tabelle wird genau einmal berechnet
  - Backtracking: $O(m + n)$

- **Platzkomplexität:** $O(m \cdot n)$
  - Speicherung der kompletten DP-Tabelle
  - Kann auf $O(\min(m,n))$ optimiert werden, wenn nur die Länge benötigt wird (keine Rekonstruktion)

## Unterschied zu Longest Common Substring

| Kriterium | Longest Common **Subsequence** | Longest Common **Substring** |
|-----------|--------------------------------|------------------------------|
| Zusammenhängend | **Nein**, Zeichen dürfen übersprungen werden | **Ja**, Zeichen müssen aufeinanderfolgen |
| Rekursion bei $a_i \neq b_j$ | $d_{ij} = \max(d_{i-1,j}, d_{i,j-1})$ | $d_{ij} = 0$ |
| Ergebnis | $d_{m,n}$ (untere rechte Ecke) | Maximum der gesamten Tabelle |
| Beispiel BANANA/ANANAS | ANAN (Länge 4) | ANA oder ANA (Länge 3) |

## Anwendungen

- **Diff-Tools:** Vergleich von Dateiversionen (zeigt Änderungen)
- **Bioinformatik:** DNA-Sequenzvergleiche (evolutionäre Verwandtschaft)
- **Plagiatserkennung:** Textähnlichkeit (auch bei Umstellungen)

---

nächstes: [[NP-vollständige Probleme]]
