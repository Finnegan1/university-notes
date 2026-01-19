---
tags:
  - Algorithmik
  - zusammenfassung
---

Gesucht ist der kürzeste Weg durch n Städte, wobei jede Stadt genau einmal besucht wird. Die Reise beginnt in einer beliebigen Startstadt i und endet in einer festen Zielstadt n (keine Rundreise zurück zum Start). Das TSP ist NP-vollständig.

Das Optimierungsproblem kann zu einem Entscheidungsproblem umgeformt werden durch das Fragen von:
- Gibt es eine mögliche Reise mit Dauer ... (e.g. 5) ?

Naiver Ansatz:
- alles Ausprobieren
- LZ: $\ohm (n!)$ => n! Möglichkeiten und jeweils O(n) zur Berechnung der Länge

Sei $(d_{i, j})_{1 \le i; j \leq n}$ die Entfernungsmatrix des TSP
- unsymmetrische Matrix, a => b muss nicht selbe länge haben wie b => a
- keine Verbindung => Länge = unendlich

Sei $l(i, S)$ die Länge des kürzesten Weges von Stadt $i$ über alle Städte in $S$ zur Zielstadt $n$.

**Komplette Reise:** Um den kürzesten Weg von einer Startstadt (z.B. Stadt 1) über alle Zwischenstädte zur Zielstadt $n$ zu finden, berechnen wir $l(1, S)$ mit $S = \{2, 3, \dots, n-1\}$ (alle Städte außer Start und Ziel).


$$l(i, S) = \begin{cases}
d_{in} & \text{für } S = \emptyset \quad \text{(direkt von } i \text{ zur Zielstadt } n\text{)} \\
\min\{d_{ij} + l(j, S - \{j\}) \mid j \in S\} & \text{für } S \neq \emptyset
\end{cases}$$

**Erklärung:**
- **Basisfall:** Wenn keine Zwischenstädte mehr zu besuchen sind ($S = \emptyset$), gehe direkt von der aktuellen Stadt $i$ zur Zielstadt $n$ mit Kosten $d_{in}$
- **Rekursiver Fall:** Wähle eine Stadt $j \in S$ als nächste Station, entferne sie aus $S$, und löse das kleinere Problem $l(j, S - \{j\})$


## Laufzeit

Unter der Voraussetzung, dass $S - \{j\}$ in der Zeit $O(1)$ berechnet werden kann.

### DP-Tabelle Dimensionen

- **Zeilenanzahl:** $2^{n-1}$
  - Jede Zeile entspricht einer möglichen Städtemenge $S$ (Zwischenstädte zwischen Start und Ziel)
  - Da Stadt $n$ die feste Zielstadt ist, kann $S$ nur Städte aus $\{1, 2, ..., n-1\}$ enthalten
  - Die [[Potenzmenge]] von $\{1, 2, ..., n-1\}$ hat $2^{n-1}$ Elemente
  - Beispiele für $S$: $\emptyset$, $\{1\}$, $\{2\}$, $\{1, 2\}$, ..., $\{1, 2, ..., n-1\}$

- **Spaltenzahl:** $n - 1$
  - Jede Spalte entspricht einer möglichen Startstadt $i \in \{1, 2, ..., n-1\}$
  - Stadt $n$ ist immer das Ziel, daher keine Spalte für $i = n$

- **Aufwand pro Zelle:** $O(n)$
  - Für jedes $l(i, S)$ muss das Minimum über alle $j \in S$ berechnet werden
  - Im schlimmsten Fall: $|S| = n-1$ → maximal $n$ Vergleiche

### Gesamtlaufzeit

$$2^{n-1} \cdot (n-1) \cdot O(n) = O(n^2 \cdot 2^n)$$



# Implementierung - von S

S kann als Bitmaske implementiert werden, wobei jedes Bit einer Stadt entspricht (Index des Bits = Stadt-ID). Siehe [[Bitoperationen]] für eine detaillierte Erklärung aller Bitoperationen.

> [!warning] Zwei mögliche Interpretationen
> Es gibt zwei verschiedene Konventionen für die Bedeutung der Bits:
>
> **Variante 1 (Theorie):** 1 = noch zu besuchen, 0 = bereits besucht
> **Variante 2 (Implementierung unten):** 1 = noch zu besuchen, 0 = bereits besucht
>
> Beide Varianten funktionieren, wichtig ist nur Konsistenz! Die Implementierung unten nutzt **Variante 2**.

## Bitoperationen zum Lesen von S

### Beispiel: S für 4 Städte (noch zu besuchen)

Angenommen wir haben Städte 0, 1, 2, 3 und starten bei Stadt 0.

**Bitmaske:** `S = 1110` (binär) = 14 (dezimal)

- **Bit 0 (ganz rechts):** Stadt 0 → `0` = bereits besucht (Startstadt)
- **Bit 1:** Stadt 1 → `1` = noch zu besuchen
- **Bit 2:** Stadt 2 → `1` = noch zu besuchen
- **Bit 3:** Stadt 3 → `1` = noch zu besuchen

Also: $S = \{1, 2, 3\}$ (noch zu besuchende Städte)

### Wichtige Bitoperationen

> [!tip] 1. Prüfen ob Stadt city noch zu besuchen ist (Bit gesetzt?)
> ```python
> if S & (1 << city):
>     # Stadt city ist noch zu besuchen (Bit ist 1)
> ```
> - `1 << city` erzeugt eine Bitmaske mit nur Bit an Position `city` gesetzt
>   - Beispiel: `1 << 2` = `0100` (binär) = 4 (dezimal)
> - `S & (1 << city)` führt bitweises UND aus → gibt nur dann ≠ 0 zurück, wenn das Bit gesetzt ist
> - **Beispiel:** Ist Stadt 2 noch zu besuchen bei `S = 1110`?
>   - `1 << 2` = `0100`
>   - `1110 & 0100` = `0100` ≠ 0 → **Ja**, Stadt 2 ist noch zu besuchen

> [!tip] 2. Stadt city aus S entfernen (als besucht markieren)
> ```python
> new_mask = S & ~(1 << city)
> ```
> - `1 << city` erzeugt Bitmaske mit Bit an Position `city` gesetzt (z.B. `0100`)
> - `~(1 << city)` negiert diese Maske → alle Bits sind 1 **außer** an Position `city`
>   - Beispiel: `~(0100)` = `1011` (bei 4 Bits)
> - `S & ~(1 << city)` setzt Bit an Position `city` auf 0, lässt alle anderen unverändert
> - **Beispiel:** Markiere Stadt 2 als besucht bei `S = 1110`:
>   - `1 << 2` = `0100`
>   - `~(0100)` = `1011`
>   - `1110 & 1011` = `1010` → neue Menge $\{1, 3\}$ (Stadt 2 wurde entfernt)

> [!tip] 3. Initiale Maske erstellen: Alle Städte außer Start
> ```python
> full_mask = (1 << city_count) - 1      # Alle Bits auf 1
> mask_without_start = full_mask ^ (1 << 0)  # Start-Bit entfernen
> ```
> - `(1 << city_count) - 1` erzeugt eine Maske mit `city_count` Einsen
>   - Beispiel bei 4 Städten: `(1 << 4) - 1` = `10000 - 1` = `1111`
> - `^` ist XOR (exklusives ODER) → flippt das Bit an Position 0
>   - Beispiel: `1111 ^ 0001` = `1110`
> - **Resultat:** Alle Städte außer der Startstadt (0) sind zu besuchen

> [!tip] 4. Prüfen ob alle Städte besucht wurden
> ```python
> if S == 0:
>     # Alle Städte wurden besucht (alle Bits sind 0)
> ```
> - Wenn alle Bits 0 sind, wurden alle Städte als besucht markiert
> - Rekursionsabbruch: zurück zur Startstadt

> [!tip] 5. Über alle noch zu besuchenden Städte iterieren
> ```python
> for city in all_cities:
>     if S & (1 << city):
>         # Stadt city ist noch zu besuchen
>         new_mask = S & ~(1 << city)
>         distance = distance_matrix[i][city] + l(city, new_mask)
> ```
> - Kombiniert Operation 1 (Prüfen) und 2 (Entfernen)
> - Berechnet rekursiv $l(j, S - \{j\})$ für alle $j \in S$

### Vorteil der Bitmaske

- **Speicher:** Jedes S ist nur eine ganze Zahl (z.B. 32 oder 64 Bit)
- **Geschwindigkeit:** Alle Operationen (Prüfen, Hinzufügen, Entfernen) in $O(1)$
- **DP-Tabelle:** Kann als Array `l[S][i]` mit Größe $2^{n-1} \times (n-1)$ implementiert werden

## Vollständige Python-Implementierung

```python
def solve_tsp(distance_matrix: list[list[int]]):
    city_count = len(distance_matrix)
    all_cities = range(city_count)

    ALL_CITIES_VISITED = 0

    memory = {}

    def l(i: int, S: int) -> int:
        """
        Berechnet die kürzeste Distanz von Stadt i über alle Städte in S zur Zielstadt n.

        i: Aktuelle Stadt (zuletzt besuchte Stadt)
        S: Bitmaske der noch zu besuchenden Städte (1 = zu besuchen, 0 = besucht)

        Returns: Minimale Distanz von i über S zur Zielstadt n
        """

        # Basisfall: Alle Zwischenstädte besucht → direkt zur Zielstadt n
        if S == ALL_CITIES_VISITED:
            return distance_matrix[i][city_count - 1]  # city_count - 1 = Stadt n

        # Memoization: Wurde dieser Zustand schon berechnet?
        state = (i, S)
        if state in memory:
            return memory[state]

        # Rekursiver Fall: Probiere alle noch zu besuchenden Städte
        res = float('inf')
        for city in all_cities:
            # Prüfe ob Stadt 'city' noch zu besuchen ist (Bit gesetzt?)
            if S & (1 << city):
                # Entferne 'city' aus S (markiere als besucht)
                new_mask = S & ~(1 << city)
                # Berechne: Distanz(i → city) + kürzester Weg(city → ... → n)
                distance = distance_matrix[i][city] + l(city, new_mask)
                # Behalte das Minimum
                if distance < res:
                    res = distance

        # Speichere Ergebnis für Memoization
        memory[state] = res
        return res

    # Initialisierung: Alle Zwischenstädte (außer Start 0 und Ziel n) sind zu besuchen
    # Beispiel bei 5 Städten (0,1,2,3,4): Start=0, Ziel=4, Zwischenstädte={1,2,3}
    full_mask = (1 << city_count) - 1                      # 11111 (alle Städte)
    mask_without_start = full_mask ^ (1 << 0)              # 11110 (ohne Stadt 0)
    mask_without_start_and_goal = mask_without_start ^ (1 << (city_count - 1))  # 01110 (ohne 0 und n)

    return l(0, mask_without_start_and_goal)
```

### Beispiel-Durchlauf

Für 5 Städte: Start bei Stadt 0, Ziel bei Stadt 4, Zwischenstädte {1, 2, 3}:

1. **Initialisierung:**
   - `city_count = 5`
   - `full_mask = (1 << 5) - 1 = 31 = 11111`
   - `mask_without_start = 11111 ^ 00001 = 11110` → ohne Stadt 0
   - `mask_without_start_and_goal = 11110 ^ 10000 = 01110` → Städte {1, 2, 3} zu besuchen

2. **Rekursion:** `l(0, 01110)` - von Stadt 0 über {1,2,3} zu Stadt 4
   - Probiere Stadt 1: `l(1, 01110 & ~00010) = l(1, 01100)` → Städte {2, 3} übrig
   - Probiere Stadt 2: `l(2, 01110 & ~00100) = l(2, 01010)` → Städte {1, 3} übrig
   - Probiere Stadt 3: `l(3, 01110 & ~01000) = l(3, 00110)` → Städte {1, 2} übrig

3. **Weiterer Schritt:** z.B. `l(1, 01100)` - von Stadt 1 über {2,3} zu Stadt 4
   - Probiere Stadt 2: `l(2, 01100 & ~00100) = l(2, 01000)` → nur Stadt 3 übrig
   - Probiere Stadt 3: `l(3, 01100 & ~01000) = l(3, 00100)` → nur Stadt 2 übrig

4. **Basisfall:** Wenn `S = 00000`, gebe `distance_matrix[i][4]` zurück (direkt zur Zielstadt 4)


# Besondere Laufzeiten

## Grundaussage

Der exakte DP-Algorithmus für TSP hat **exponentielle Laufzeit** $O(n^2 \cdot 2^n)$. **Aber:** Für bestimmte Spezialfälle des TSP gibt es Approximationsalgorithmen mit **polynomieller Laufzeit**, die gute Näherungslösungen liefern.

> [!important] Definition: ε-Approximierbarkeit
> Ein Minimierungsproblem ist **ε-approximierbar** (für $\varepsilon > 1$), wenn es einen Algorithmus mit polynomieller Laufzeit gibt, der eine Lösung liefert, die höchstens um den Faktor $\varepsilon$ größer ist als das Optimum. (um Faktor $\varepsilon$ falsch liegt)

## TSP mit Dreiecksungleichung (Δ-TSP)

### Voraussetzung

Die Entfernungsmatrix erfüllt die **Dreiecksungleichung**:

$$d_{uv} \leq d_{uw} + d_{wv} \quad \text{für alle Städte } u, v, w$$

**Bedeutung:** Der direkte Weg von $u$ nach $v$ ist nie länger als ein Umweg über eine Zwischenstadt $w$.

> [!note] Dreiecksungleichung künstlich erzwingen
> **Wenn Mehrfachbesuche von Städten erlaubt sind** (d.h. wenn für die Anwendung nicht notwendig ist, dass jede Stadt nur einmal besucht wird), kann die Dreiecksungleichung immer erfüllt werden:
>
> - **Methode:** Ersetze jede Kante von $u$ nach $v$ durch die kürzeste Verbindung von $u$ nach $v$ (unter Verwendung von Zwischenstädten)
> - **Ergebnis:** Dadurch gilt automatisch $d_{uv} \leq d_{uw} + d_{wv}$ für alle Städte
> - **Konsequenz:** Die resultierende Tour kann einzelne Städte mehrfach besuchen
> - **Wann anwendbar:** Wenn Mehrfachbesuche in der Praxis tolerierbar sind (z.B. bei Routenplanung, wo man durch Städte durchfahren darf)

### Approximationsgarantie

Wenn die Dreiecksungleichung gilt, ist das TSP **3/2-approximierbar**:

- **Algorithmus:** Berechne einen minimalen Spannbaum (MST) und konstruiere daraus eine Tour
- **Garantie:** Die gefundene Lösung ist höchstens 50% länger als das Optimum
- **Laufzeit:** Polynomiell (z.B. mit Kruskal oder Prim für MST)

> [!tip] Praktische Bedeutung
> In vielen realen Anwendungen (z.B. Routenplanung, Bohrmaschinensteuerung) ist die Dreiecksungleichung natürlich erfüllt, weil Umwege nie kürzer als direkte Wege sind. Damit lassen sich in polynomieller Zeit gute Näherungslösungen finden!

## Euklidisches TSP

### Spezialfall

Beim **Euklidischen TSP** liegen die Städte in der 2D-Ebene und die Entfernungen entsprechen dem geometrischen Abstand:

$$d_{uv} = \sqrt{(x_u - x_v)^2 + (y_u - y_v)^2}$$

Die Dreiecksungleichung ist hier automatisch erfüllt.

### Verbesserte Approximation

Für jedes $\delta > 1$ ist das Euklidische TSP in der Ebene (2D) **$(1 + \frac{1}{\delta})$-approximierbar**:

- **Laufzeit:** $O(n \cdot (\log n)^{O(\delta)})$
- **Beispiel:** Für $\delta = 2$ erhalten wir eine 1.5-Approximation (also maximal 50% Abweichung vom Optimum)
- **Trade-off:** Kleineres $\delta$ → bessere Approximation, aber höhere Laufzeit

> [!note] Zusammenfassung der Laufzeiten
> - **Exakte Lösung (DP):** $O(n^2 \cdot 2^n)$ - exponentiell
> - **Δ-TSP Approximation:** Polynomiell mit 3/2-Faktor
> - **Euklidisches TSP:** $O(n (\log n)^{O(\delta)})$ mit $(1 + \frac{1}{\delta})$-Faktor

## Warum ist das besonders?

> [!warning] NP-Vollständigkeit vs. Approximierbarkeit
> Obwohl TSP NP-vollständig ist, bedeutet das **nicht**, dass es keine polynomiellen Approximationsalgorithmen gibt!
>
> - **NP-Vollständigkeit** sagt nur: Es gibt keine polynomielle Lösung für das **exakte** Optimum (falls P ≠ NP)
> - **Approximierbarkeit** bedeutet: Wir können in polynomieller Zeit Lösungen finden, die **fast optimal** sind
>
> Für Spezialfälle wie Δ-TSP oder Euklidisches TSP können wir also praktisch verwendbare Lösungen effizient berechnen, auch wenn das Problem theoretisch schwer ist.



nächstes: [[Rucksack Problem]]
