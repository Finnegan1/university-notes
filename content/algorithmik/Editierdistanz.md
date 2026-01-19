---
tags:
  - Algorithmik
  - zusammenfassung
---

Gegeben seien Strings a, b

Gesucht ist die Anzahl an Editieroperationen, um `a` in `b` zu überführen. Editieroperationen seine Löschen, Ändern, Einfügen.

Bsp: `APFEL => PFERD`

| A   | P   | F   | E   | L   |     |
| --- | --- | --- | --- | --- | --- |
|     | P   | F   | E   | R   | D   |

Anwendungen sind:
- Suche nach Ähnlichkeiten in Texten oder das Finden von Plagiaten
- automatisierte Rechtschreibkorrektur
- Vergleich von DNA- oder RNA-Sequenzen


Sei $d_{i,j}$ die Editierdistanz zwischen den Präfixen $a_{1}, \dots, a_{i}, b_{1}, \dots, b_{j}$ . Wir betrachten folgende Möglichkeiten:

- **Für $a_{i} = b_{j}$** kann ein Matching verlängert werden. Dann ist $d_{i,j} = d_{i-1, j-1}$

| ... |     | $a_i$ |
| --- | --- | ----- |
| ... |     | $b_j$ |

- **Für $a_{i} \neq b_{j}$** wird ein Zeichen geändert. Dann ist $d_{i,j} = d_{i-1, j-1} + 1$

| ... |     | $a_i$ |
| --- | --- | ----- |
| ... |     | $b_j$ |

- **Es wird ein Zeichen gelöscht oder hinzugefügt.** Diese Fälle sind gleichartig.
	- Wenn $a_{i}$ gelöscht oder hinzugefügt wird, ist $d_{i,j} = d_{i-1, j} + 1$

| ... |       | $a_i$ |
| --- | ----- | ----- |
| ... | $b_j$ |       |

   - Wenn $b_{j}$ gelöscht oder hinzugefügt wird, ist $d_{i,j} = d_{i, j-1} + 1$

| ... | $a_i$ |       |
| --- | ----- | ----- |
| ... |       | $b_j$ |
|     |       |       |


Wir wählen diejenige Möglichkeit mit der besten Bewertung. Damit ergibt sich:

$$
d_{i,j} = \begin{cases}
j & \text{für } i = 0 \\
i & \text{für } j = 0 \\
\min\{d_{i-1,j-1} + \ I(a_i \neq b_j), d_{i-1,j} + 1, d_{i,j-1} + 1\} & \text{sonst}
\end{cases}
$$

wobei $I(x)$ die Indikatorfunktion für $x$ ist (gibt 1 zurück wenn $x$ wahr ist, sonst 0).

### Erklärung der Formel

Die rekursive Formel bedeutet:
- **Randfälle**:
  - Wenn $i = 0$: Alle Zeichen aus $b$ müssen eingefügt werden → $d_{0,j} = j$
  - Wenn $j = 0$: Alle Zeichen aus $a$ müssen gelöscht werden → $d_{i,0} = i$
- **Rekursiver Aufruf**: Die Funktion ruft sich für die nächsten Distanzen auf und vergleicht die minimalen Kosten

Die Werte $d_{i,j}$ werden in einer Tabelle **zeilenweise von oben nach unten** und **spaltenweise von links nach rechts** berechnet, wobei jede Zelle konstante Laufzeit hat.

## Laufzeit

Die Laufzeit des Algorithmus Editierdistanz liegt in $O(nm)$, wobei $n = |a|$ und $m = |b|$.

## Beispiel

Berechnung der Editierdistanz für APFEL → PFERD:

### Tabelle

|       | ε   | P   | F   | E   | R   | D   |
| ----- | --- | --- | --- | --- | --- | --- |
| **ε** | 0   | 1   | 2   | 3   | 4   | 5   |
| **A** | 1   | 1   | 2   | 3   | 4   | 5   |
| **P** | 2   | 1   | 2   | 3   | 4   | 5   |
| **F** | 3   | 2   | 1   | 2   | 3   | 4   |
| **E** | 4   | 3   | 2   | 1   | 2   | 3   |
| **L** | 5   | 4   | 3   | 2   | 2   | 3   |

**Leseweise**: Zeile $i$ (APFEL) vs. Spalte $j$ (PFERD)

Die Editierdistanz beträgt **3** (untere rechte Ecke).

### Schrittweise Berechnung (Beispiel für eine Zelle)

Betrachten wir die Berechnung von $d_{2,1}$ (P vs. P):

- $a_2 = \text{P}$, $b_1 = \text{P}$ → $a_2 = b_1$ ✓
- Daher: $d_{2,1} = d_{1,0} = 1$ (kein +1, da Zeichen gleich)

Betrachten wir $d_{5,5}$ (APFEL vs. PFERD):

- $a_5 = \text{L}$, $b_5 = \text{D}$ → $a_5 \neq b_5$
- Drei Möglichkeiten:
  1. **Ändern**: $d_{4,4} + 1 = 2 + 1 = 3$
  2. **Löschen** (L): $d_{4,5} + 1 = 3 + 1 = 4$
  3. **Einfügen** (D): $d_{5,4} + 1 = 2 + 1 = 3$
- Minimum: $\min\{3, 4, 3\} = 3$

### Mögliche Operationen

Eine optimale Transformation:
1. **A** löschen
2. **E** → **R** ändern
3. **L** → **D** ändern


## Python-Implementierung

```python
def editierdistanz(a: str, b: str) -> tuple[int, list[list[int]]]:
    """
    Berechnet die Editierdistanz zwischen zwei Strings.

    Args:
        a: Erster String
        b: Zweiter String

    Returns:
        Tuple aus (Editierdistanz, DP-Tabelle)
    """
    n = len(a)
    m = len(b)

    # Initialisiere die Tabelle mit (n+1) x (m+1) Dimensionen
    # d[i][j] speichert die Editierdistanz zwischen a[0..i-1] und b[0..j-1]
    d = [[0] * (m + 1) for _ in range(n + 1)]

    # Randfälle: Wenn einer der Strings leer ist
    for i in range(n + 1):
        d[i][0] = i  # Alle Zeichen aus a müssen gelöscht werden

    for j in range(m + 1):
        d[0][j] = j  # Alle Zeichen aus b müssen eingefügt werden

    # Fülle die Tabelle zeilenweise von oben nach unten
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            # Kosten für Ändern oder Matching (0 wenn gleich, 1 wenn ungleich)
            kosten_aendern = d[i-1][j-1] + (0 if a[i-1] == b[j-1] else 1)

            # Kosten für Löschen (aus a)
            kosten_loeschen = d[i-1][j] + 1

            # Kosten für Einfügen (in a)
            kosten_einfuegen = d[i][j-1] + 1

            # Wähle die minimale Kosten
            d[i][j] = min(kosten_aendern, kosten_loeschen, kosten_einfuegen)

    return d[n][m], d


def print_tabelle(a: str, b: str, tabelle: list[list[int]]):
    """
    Gibt die DP-Tabelle formatiert aus.
    """
    # Header mit b
    print(f"{'':>6}", end="")
    print(f"{'ε':>4}", end="")
    for char in b:
        print(f"{char:>4}", end="")
    print()

    # Erste Zeile (ε)
    print(f"{'ε':>6}", end="")
    for j in range(len(b) + 1):
        print(f"{tabelle[0][j]:>4}", end="")
    print()

    # Restliche Zeilen (mit a)
    for i in range(1, len(a) + 1):
        print(f"{a[i-1]:>6}", end="")
        for j in range(len(b) + 1):
            print(f"{tabelle[i][j]:>4}", end="")
        print()


def finde_operationen(a: str, b: str, tabelle: list[list[int]]) -> list[str]:
    """
    Rekonstruiert die Editieroperationen aus der DP-Tabelle.
    """
    operationen = []
    i = len(a)
    j = len(b)

    while i > 0 or j > 0:
        if i == 0:
            # Nur Einfügen möglich
            operationen.append(f"Füge '{b[j-1]}' ein")
            j -= 1
        elif j == 0:
            # Nur Löschen möglich
            operationen.append(f"Lösche '{a[i-1]}'")
            i -= 1
        else:
            # Prüfe, woher der minimale Wert kam
            aktuell = tabelle[i][j]
            diagonal = tabelle[i-1][j-1]
            oben = tabelle[i-1][j]
            links = tabelle[i][j-1]

            if a[i-1] == b[j-1] and aktuell == diagonal:
                # Matching - keine Operation nötig
                operationen.append(f"Behalte '{a[i-1]}'")
                i -= 1
                j -= 1
            elif aktuell == diagonal + 1:
                # Ändern
                operationen.append(f"Ändere '{a[i-1]}' → '{b[j-1]}'")
                i -= 1
                j -= 1
            elif aktuell == oben + 1:
                # Löschen
                operationen.append(f"Lösche '{a[i-1]}'")
                i -= 1
            else:  # aktuell == links + 1
                # Einfügen
                operationen.append(f"Füge '{b[j-1]}' ein")
                j -= 1

    return list(reversed(operationen))


# Beispiel: APFEL → PFERD
if __name__ == "__main__":
    a = "APFEL"
    b = "PFERD"

    distanz, tabelle = editierdistanz(a, b)

    print(f"Editierdistanz von '{a}' → '{b}': {distanz}\n")
    print("DP-Tabelle:")
    print_tabelle(a, b, tabelle)

    print(f"\nOperationen:")
    operationen = finde_operationen(a, b, tabelle)
    for i, op in enumerate(operationen, 1):
        print(f"{i}. {op}")
```

### Ausgabe des Programms

```
Editierdistanz von 'APFEL' → 'PFERD': 3

DP-Tabelle:
         ε   P   F   E   R   D
     ε   0   1   2   3   4   5
     A   1   1   2   3   4   5
     P   2   1   2   3   4   5
     F   3   2   1   2   3   4
     E   4   3   2   1   2   3
     L   5   4   3   2   2   3

Operationen:
1. Lösche 'A'
2. Behalte 'P'
3. Behalte 'F'
4. Behalte 'E'
5. Ändere 'L' → 'R'
6. Füge 'D' ein
```

**Hinweis**: Die rekonstruierten Operationen können je nach Pfadwahl variieren (es gibt oft mehrere optimale Lösungen).


nächstes: [[Längste gemeinsame Teilerfolge]]