---
tags:
  - Algorithmik
  - zusammenfassung
---

# Leitfaden: Dynamische Programmierung verstehen und anwenden

## Was ist Dynamische Programmierung?

Dynamische Programmierung (DP) ist eine Methode zur Lösung von Optimierungsproblemen durch:
- **Zerlegen** des Problems in überlappende Teilprobleme
- **Speichern** der Lösungen von Teilproblemen (Memoization)
- **Wiederverwenden** dieser Lösungen, um das Gesamtproblem zu lösen

**Kernidee**: Vermeide redundante Berechnungen durch Speicherung von Zwischenergebnissen.

## Wann ist DP anwendbar?

Ein Problem eignet sich für DP, wenn es zwei Eigenschaften hat:

### 1. Optimal Substructure (Optimale Teilstruktur)
Die optimale Lösung des Gesamtproblems lässt sich aus optimalen Lösungen der Teilprobleme zusammensetzen.

**Beispiel**: Bei der Editierdistanz ist die optimale Transformation von $a_1\dots a_i$ zu $b_1\dots b_j$ abhängig von den optimalen Transformationen kleinerer Präfixe.

### 2. Overlapping Subproblems (Überlappende Teilprobleme)
Dieselben Teilprobleme werden mehrfach berechnet.

**Beispiel**: Bei Fibonacci wird $F(n-2)$ sowohl für $F(n)$ als auch für $F(n-1)$ benötigt.

## Schritt-für-Schritt-Anleitung zum Entwickeln eines DP-Algorithmus

### Schritt 1: Verstehe das Problem vollständig

**Fragen, die du dir stellen solltest:**
- Was ist die Eingabe?
- Was ist die Ausgabe?
- Was genau soll optimiert werden (Minimum? Maximum? Anzahl?)
- Gibt es Nebenbedingungen oder Einschränkungen?

**Beispiel (Editierdistanz):**
- Eingabe: Zwei Strings $a$ und $b$
- Ausgabe: Minimale Anzahl an Editieroperationen
- Optimierung: Minimiere die Anzahl der Operationen
- Operationen: Einfügen, Löschen, Ändern

### Schritt 2: Identifiziere die Teilprobleme

**Wie finde ich Teilprobleme?**

1. **Präfix-Ansatz**: Betrachte Präfixe der Eingabe
   - Editierdistanz: $d_{i,j}$ = Distanz zwischen $a_1\dots a_i$ und $b_1\dots b_j$
   - Längste aufsteigende Teilfolge: $L_i$ = längste Teilfolge endend bei Position $i$

2. **Suffix-Ansatz**: Betrachte Suffixe der Eingabe
   - Ähnlich zu Präfixen, manchmal natürlicher

3. **Bereichs-Ansatz**: Betrachte Teilbereiche $[i, j]$
   - Matrix Chain Multiplication: Optimale Klammerung für Matrizen $i$ bis $j$
   - Longest Palindromic Substring: Ist $s[i\dots j]$ ein Palindrom?

4. **Restkapazitäts-Ansatz**: Betrachte verbleibende Ressourcen
   - Rucksackproblem: $K(i, w)$ = maximaler Wert mit Items $1\dots i$ und Gewicht $w$

**Tipp**: Versuche, das Problem für eine kleinere Eingabe zu lösen und überlege, wie du die Lösung erweitern kannst.

### Schritt 3: Definiere die DP-Tabelle/Array

**Was wird gespeichert?**

Definiere genau, was jeder Eintrag $dp[i]$, $dp[i][j]$, etc. bedeutet.

**Beispiele:**

| Problem | DP-Tabelle | Bedeutung |
|---------|------------|-----------|
| Fibonacci | $F[n]$ | Die $n$-te Fibonacci-Zahl |
| Editierdistanz | $d[i][j]$ | Editierdistanz zwischen $a_1\dots a_i$ und $b_1\dots b_j$ |
| Rucksack | $K[i][w]$ | Max. Wert mit Items $1\dots i$ und Gewicht $\leq w$ |
| Longest Common Subsequence | $L[i][j]$ | Länge der LCS von $a_1\dots a_i$ und $b_1\dots b_j$ |

**Dimensionen der Tabelle:**
- 1D-Array: Ein Parameter variiert (z.B. Fibonacci: $n$)
- 2D-Array: Zwei Parameter variieren (z.B. Editierdistanz: $i$ und $j$)
- 3D-Array: Drei Parameter (selten, aber möglich)

### Schritt 4: Finde die Rekursionsformel (Rekurrenz)

**Dies ist der schwierigste Teil!**

**Vorgehensweise:**

1. **Betrachte den letzten Schritt**: Was könnte die letzte Entscheidung/Operation gewesen sein?

2. **Fallunterscheidung**: Liste alle möglichen Fälle auf
   - Was sind die verschiedenen Möglichkeiten?
   - Wie hängen sie von kleineren Teilproblemen ab?

3. **Optimierung**: Wähle das Beste (min/max) oder kombiniere die Fälle

**Beispiel: Editierdistanz**

Betrachte $d[i][j]$ (Distanz zwischen $a_1\dots a_i$ und $b_1\dots b_j$):

**Letzter Schritt - Was könnte passiert sein?**

1. **Fall 1**: $a_i = b_j$ → Matching, keine Operation nötig
   - $d[i][j] = d[i-1][j-1]$

2. **Fall 2**: $a_i \neq b_j$ → Ändern von $a_i$ zu $b_j$
   - $d[i][j] = d[i-1][j-1] + 1$

3. **Fall 3**: $a_i$ wurde gelöscht
   - $d[i][j] = d[i-1][j] + 1$

4. **Fall 4**: $b_j$ wurde eingefügt
   - $d[i][j] = d[i][j-1] + 1$

**Wähle das Minimum:**
$$
d[i][j] = \min\{d[i-1][j-1] + I(a_i \neq b_j), d[i-1][j] + 1, d[i][j-1] + 1\}
$$

**Beispiel: Rucksackproblem**

Betrachte $K[i][w]$ (max. Wert mit Items $1\dots i$ und Gewicht $\leq w$):

**Letzter Schritt - Wurde Item $i$ genommen?**

1. **Item $i$ nicht nehmen**: $K[i][w] = K[i-1][w]$
2. **Item $i$ nehmen** (nur wenn $w_i \leq w$): $K[i][w] = K[i-1][w-w_i] + v_i$

**Wähle das Maximum:**
$$
K[i][w] = \max\{K[i-1][w], K[i-1][w-w_i] + v_i\}
$$

### Schritt 5: Bestimme die Randfälle (Base Cases)

**Was sind die einfachsten/kleinsten Teilprobleme?**

Diese können direkt gelöst werden, ohne Rekursion.

**Beispiele:**

| Problem | Randfälle |
|---------|-----------|
| Editierdistanz | $d[0][j] = j$ (alle einfügen)<br>$d[i][0] = i$ (alle löschen) |
| Fibonacci | $F[0] = 0$, $F[1] = 1$ |
| Rucksack | $K[0][w] = 0$ (keine Items)<br>$K[i][0] = 0$ (keine Kapazität) |

### Schritt 6: Bestimme die Berechnungsreihenfolge

**In welcher Reihenfolge müssen die Tabellenzellen gefüllt werden?**

**Regel**: Berechne eine Zelle erst, wenn alle Zellen, von denen sie abhängt, bereits berechnet sind.

**Typische Muster:**

1. **1D-Array**: Von links nach rechts
   ```
   for i = 1 to n:
       dp[i] = ...  // benutzt dp[i-1], dp[i-2], etc.
   ```

2. **2D-Array (Standard)**: Zeilenweise von oben nach unten, spaltenweise von links nach rechts
   ```
   for i = 1 to n:
       for j = 1 to m:
           dp[i][j] = ...  // benutzt dp[i-1][j], dp[i][j-1], etc.
   ```

3. **2D-Array (Diagonal)**: Manchmal diagonal für Bereichsprobleme
   ```
   for länge = 1 to n:
       for i = 0 to n-länge:
           j = i + länge
           dp[i][j] = ...
   ```

**Beispiel Editierdistanz:**
```
     j → → →
 i   0 1 2 3
 ↓ 0 ✓ ✓ ✓ ✓
 ↓ 1 ✓ → → →
 ↓ 2 ✓ → → →
```
Zeilenweise füllen, da $d[i][j]$ von $d[i-1][j-1]$, $d[i-1][j]$, und $d[i][j-1]$ abhängt.

### Schritt 7: Implementiere den Algorithmus

```python
def dp_problem(eingabe):
    # 1. Initialisiere die DP-Tabelle
    dp = [[0] * m for _ in range(n)]

    # 2. Setze Randfälle
    dp[0][0] = ...
    for i in range(n):
        dp[i][0] = ...
    for j in range(m):
        dp[0][j] = ...

    # 3. Fülle die Tabelle in der richtigen Reihenfolge
    for i in range(1, n):
        for j in range(1, m):
            # Wende die Rekursionsformel an
            dp[i][j] = ...  # basierend auf dp[i-1][j], dp[i][j-1], etc.

    # 4. Gib die Lösung zurück
    return dp[n-1][m-1]  # oder dp[n][m], je nach Indexierung
```

### Schritt 8: Analysiere die Laufzeit

**Laufzeit = (Anzahl Teilprobleme) × (Zeit pro Teilproblem)**

**Beispiele:**

| Problem | Teilprobleme | Zeit/Problem | Gesamtlaufzeit |
|---------|-------------|--------------|----------------|
| Fibonacci | $O(n)$ | $O(1)$ | $O(n)$ |
| Editierdistanz | $O(nm)$ | $O(1)$ | $O(nm)$ |
| Rucksack | $O(nW)$ | $O(1)$ | $O(nW)$ |
| Matrix Chain | $O(n^2)$ | $O(n)$ | $O(n^3)$ |

## Häufige DP-Muster erkennen

### Muster 1: Sequenz-DP (1D)
**Charakteristik**: Ein einzelnes Array/String wird verarbeitet

**Beispiele:**
- Fibonacci-Zahlen
- Längste aufsteigende Teilfolge (LIS)
- Maximale Teilsumme
- House Robber Problem

**Typische Formel**:
```
dp[i] = f(dp[i-1], dp[i-2], ..., arr[i])
```

### Muster 2: Zwei-Sequenzen-DP (2D)
**Charakteristik**: Zwei Arrays/Strings werden verglichen oder kombiniert

**Beispiele:**
- Editierdistanz
- Längste gemeinsame Teilfolge (LCS)
- String Matching

**Typische Formel**:
```
dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1], a[i], b[j])
```

### Muster 3: Rucksack-DP (2D mit Kapazität)
**Charakteristik**: Optimierung unter Ressourcenbeschränkung

**Beispiele:**
- 0/1 Rucksackproblem
- Coin Change Problem
- Partition Equal Subset Sum

**Typische Formel**:
```
dp[i][w] = max(dp[i-1][w], dp[i-1][w-gewicht[i]] + wert[i])
```

### Muster 4: Bereichs-DP (2D mit Intervallen)
**Charakteristik**: Optimierung über Bereiche $[i, j]$

**Beispiele:**
- Palindrom-Probleme
- Matrix Chain Multiplication
- Burst Balloons

**Typische Formel**:
```
dp[i][j] = min/max über alle k in [i,j] von f(dp[i][k], dp[k][j])
```

### Muster 5: Zustandsmaschinen-DP
**Charakteristik**: Verschiedene Zustände mit Übergängen

**Beispiele:**
- Buy/Sell Stock mit Zuständen (besitze Aktie / besitze keine Aktie)
- Paint House (verschiedene Farben als Zustände)

**Typische Formel**:
```
dp[i][zustand] = f(dp[i-1][anderer_zustand], ...)
```

## Übungsaufgaben mit Lösungsansätzen

### Aufgabe 1: Längste aufsteigende Teilfolge (LIS)

**Problem**: Gegeben sei ein Array $a[1\dots n]$. Finde die Länge der längsten aufsteigenden Teilfolge.

**Beispiel**: $a = [10, 9, 2, 5, 3, 7, 101, 18]$ → LIS = 4 (z.B. $[2, 3, 7, 101]$)

> [!success]- Lösung anzeigen
>
> **Schritt 1-2**: Teilproblem
> - $L[i]$ = Länge der längsten aufsteigenden Teilfolge, die bei $a[i]$ endet
>
> **Schritt 3**: Rekurrenz
> - Für jeden Index $i$, betrachte alle vorherigen Elemente $j < i$
> - Wenn $a[j] < a[i]$, können wir die Teilfolge bei $j$ erweitern
>
> $$
> L[i] = 1 + \max_{j < i, a[j] < a[i]} L[j]
> $$
>
> **Schritt 4**: Randfälle
> - $L[1] = 1$ (jedes Element bildet eine Teilfolge der Länge 1)
>
> **Schritt 5**: Reihenfolge
> - Von links nach rechts ($i = 1$ bis $n$)
>
> **Implementierung**:
> ```python
> def longest_increasing_subsequence(a):
>     n = len(a)
>     if n == 0:
>         return 0
>
>     L = [1] * n  # Jedes Element ist mindestens eine Teilfolge der Länge 1
>
>     for i in range(1, n):
>         for j in range(i):
>             if a[j] < a[i]:
>                 L[i] = max(L[i], L[j] + 1)
>
>     return max(L)  # Maximum über alle L[i]
> ```
>
> **Laufzeit**: $O(n^2)$ - $n$ Teilprobleme, jedes in $O(n)$

### Aufgabe 2: Coin Change Problem

**Problem**: Gegeben seien Münzwerte $c_1, \dots, c_k$ und ein Betrag $n$. Finde die minimale Anzahl an Münzen, um den Betrag $n$ zu erreichen.

**Beispiel**: Münzen = $[1, 2, 5]$, Betrag = $11$ → Minimum = 3 (Münzen: $5 + 5 + 1$)

> [!success]- Lösung anzeigen
>
> **Schritt 1-2**: Teilproblem
> - $M[i]$ = Minimale Anzahl Münzen für Betrag $i$
>
> **Schritt 3**: Rekurrenz
> - Für Betrag $i$, probiere jede Münze $c_j$
> - Wenn wir Münze $c_j$ nehmen, brauchen wir noch $M[i - c_j]$ Münzen
>
> $$
> M[i] = 1 + \min_{c_j \leq i} M[i - c_j]
> $$
>
> **Schritt 4**: Randfälle
> - $M[0] = 0$ (kein Betrag, keine Münzen)
> - $M[i] = \infty$ für $i < 0$ oder wenn unmöglich
>
> **Schritt 5**: Reihenfolge
> - Von $i = 1$ bis $n$
>
> **Implementierung**:
> ```python
> def coin_change(coins, betrag):
>     M = [float('inf')] * (betrag + 1)
>     M[0] = 0
>
>     for i in range(1, betrag + 1):
>         for c in coins:
>             if i - c >= 0:
>                 M[i] = min(M[i], M[i - c] + 1)
>
>     return M[betrag] if M[betrag] != float('inf') else -1
> ```
>
> **Laufzeit**: $O(n \cdot k)$ wobei $n$ = Betrag, $k$ = Anzahl Münztypen

### Aufgabe 3: 0/1 Rucksackproblem

**Problem**: Gegeben seien $n$ Items mit Gewichten $w_1, \dots, w_n$ und Werten $v_1, \dots, v_n$, sowie eine Kapazität $W$. Maximiere den Gesamtwert ohne die Kapazität zu überschreiten.

**Beispiel**:
- Items: $[(w=2, v=3), (w=3, v=4), (w=4, v=5), (w=5, v=6)]$
- Kapazität $W = 5$
- Maximum = 7 (Items 1 und 2: Gewicht $2+3=5$, Wert $3+4=7$)

> [!success]- Lösung anzeigen
>
> **Schritt 1-2**: Teilproblem
> - $K[i][w]$ = Maximaler Wert mit Items $1\dots i$ und Kapazität $w$
>
> **Schritt 3**: Rekurrenz
> - Für Item $i$ gibt es zwei Möglichkeiten:
>   1. Item $i$ nicht nehmen: $K[i-1][w]$
>   2. Item $i$ nehmen (falls $w_i \leq w$): $K[i-1][w-w_i] + v_i$
>
> $$
> K[i][w] = \begin{cases}
> 0 & \text{für } i = 0 \text{ oder } w = 0 \\
> K[i-1][w] & \text{für } w_i > w \\
> \max\{K[i-1][w], K[i-1][w-w_i] + v_i\} & \text{sonst}
> \end{cases}
> $$
>
> **Schritt 4**: Randfälle
> - $K[0][w] = 0$ (keine Items)
> - $K[i][0] = 0$ (keine Kapazität)
>
> **Schritt 5**: Reihenfolge
> - Zeilenweise: $i = 1$ bis $n$, für jedes $i$: $w = 1$ bis $W$
>
> **Implementierung**:
> ```python
> def rucksack(gewichte, werte, W):
>     n = len(gewichte)
>     K = [[0] * (W + 1) for _ in range(n + 1)]
>
>     for i in range(1, n + 1):
>         for w in range(1, W + 1):
>             # Option 1: Item nicht nehmen
>             K[i][w] = K[i-1][w]
>
>             # Option 2: Item nehmen (falls möglich)
>             if gewichte[i-1] <= w:
>                 K[i][w] = max(K[i][w], K[i-1][w - gewichte[i-1]] + werte[i-1])
>
>     return K[n][W]
> ```
>
> **Laufzeit**: $O(nW)$ (pseudopolynomiell)

## Tipps für die Prüfung

### Vor der Prüfung
1. **Übe verschiedene Problemtypen**: Sequenz-DP, Zwei-Sequenzen-DP, Rucksack, Bereichs-DP
2. **Erkenne Muster**: Welches Muster passt zu welchem Problem?
3. **Schreibe die Schritte auf**: Teilproblem → Rekurrenz → Randfälle → Reihenfolge

### In der Prüfung
1. **Lese das Problem sorgfältig**: Was wird optimiert? Was sind die Constraints?
2. **Starte mit kleinen Beispielen**: Löse das Problem für $n=1, 2, 3$ per Hand
3. **Definiere das Teilproblem klar**: Schreibe auf, was $dp[i]$ oder $dp[i][j]$ bedeutet
4. **Finde die Rekurrenz systematisch**:
   - Was ist die letzte Entscheidung?
   - Welche Optionen gibt es?
   - Wie hängen sie von kleineren Problemen ab?
5. **Vergiss die Randfälle nicht**: Was passiert bei $i=0$, $j=0$, etc.?
6. **Überprüfe die Laufzeit**: Anzahl Teilprobleme × Zeit pro Problem

### Häufige Fehler vermeiden
- ❌ Vergessen, die Bedeutung der DP-Tabelle zu definieren
- ❌ Randfälle nicht behandeln
- ❌ Falsche Berechnungsreihenfolge (Zellen benutzen, bevor sie berechnet sind)
- ❌ Verwechslung von Indizes (0-basiert vs. 1-basiert)
- ❌ Optimierungsrichtung verwechseln (min vs. max)

## Zusammenfassung: Die DP-Checkliste

Wenn du ein neues Problem siehst, gehe diese Schritte durch:

- [ ] **Problem verstehen**: Was ist Input, Output, Optimierungsziel?
- [ ] **DP-geeignet prüfen**: Optimale Teilstruktur? Überlappende Teilprobleme?
- [ ] **Teilproblem definieren**: Was bedeutet $dp[i]$ oder $dp[i][j]$?
- [ ] **Rekurrenz finden**: Was ist die letzte Entscheidung? Welche Optionen gibt es?
- [ ] **Randfälle bestimmen**: Kleinste/einfachste Fälle direkt lösen
- [ ] **Reihenfolge festlegen**: Wie fülle ich die Tabelle?
- [ ] **Implementieren**: Code schreiben
- [ ] **Laufzeit analysieren**: $O(?)$

**Denke immer daran**: DP ist eine Denkweise, kein Algorithmus. Mit Übung wirst du die Muster erkennen und schneller Lösungen finden!

## Weiterführende Ressourcen

- Andere Zusammenfassungen in diesem Vault:
  - [[Editierdistanz]]
  - [[Längste gemeinsame Teilerfolge]]
  - Rucksackproblem (falls vorhanden)

- Übe mit verschiedenen Schwierigkeitsgraden, um die Muster zu verinnerlichen
