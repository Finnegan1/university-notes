---
tags:
  - Algorithmik
  - zusammenfassung
---

# Das Bruchteil-Rucksackproblem (Fractional Knapsack)

Im Gegensatz zum klassischen [[Rucksack Problem|0/1-Rucksackproblem]] können beim **Bruchteil-Rucksackproblem** Gegenstände beliebig geteilt werden (z.B. Sand, Flüssigkeiten, Stoffe). Dies führt dazu, dass das Problem effizienter lösbar ist.

## Problemstellung

*   **Gegeben:**
    *   $n$ Gegenstände mit Größen $x_1, \ldots, x_n$ und Werten $v_1, \ldots, v_n$.
    *   Eine Rucksackgröße (Kapazität) $y$.
*   **Gesucht:**
    *   Anteile $0 \le a_i \le 1$ für jeden Gegenstand $i$.
    *   Sodass die Kapazität eingehalten wird: $\sum_{i=1}^n a_i x_i \le y$.
    *   Und der Gesamtwert maximal ist: $\sum_{i=1}^n a_i v_i = \text{max}$.

## Algorithmus (Greedy)

Da wir Bruchteile wählen dürfen, ist intuitiv klar: Wir sollten immer den Gegenstand mit dem **höchsten Wert pro Gewichtseinheit** (relative Wertigkeit) wählen, bis der Rucksack voll ist oder der Gegenstand aufgebraucht ist.

1.  **Berechne relative Wertigkeit** für alle Gegenstände: $\frac{v_i}{x_i}$.
2.  **Sortiere** die Gegenstände absteigend nach ihrer relativen Wertigkeit.
    $$ \frac{v_1}{x_1} \ge \frac{v_2}{x_2} \ge \dots \ge \frac{v_n}{x_n} $$
3.  **Befülle den Rucksack** in dieser Reihenfolge:
    *   Nimm so viel wie möglich vom aktuellen Gegenstand.
    *   Falls der Gegenstand komplett passt ($x_i \le \text{Restkapazität}$): Nimm ihn ganz ($a_i = 1$).
    *   Falls der Gegenstand nicht ganz passt: Fülle den Rest des Rucksacks mit einem Bruchteil dieses Gegenstands auf ($a_i < 1$).
    *   Danach ist der Rucksack voll, alle weiteren Gegenstände erhalten $a_j = 0$.

### Struktur der Lösung
Die Lösung hat immer die Form:
$$ (a_1, \dots, a_n) = (\underbrace{1, \dots, 1}_{k}, \underbrace{b}_{\text{Bruchteil}}, \underbrace{0, \dots, 0}_{n-k-1}) $$
*   $k$: Anzahl der Objekte, die voll eingepackt werden.
*   $b$: Der Anteil des $k+1$-ten Objekts, mit dem der Rucksack aufgefüllt wird.
*   $0$: Alle weiteren Objekte mit schlechterer relativer Wertigkeit werden ignoriert.

## Beweis der Optimalität (Satz 5.1)

> [!abstract] Satz
> Der Greedy-Algorithmus für das Bruchteil-Rucksackproblem erzeugt eine optimale Lösung.

**Beweisidee (Austauschargument):**
Wir nehmen an, wir hätten eine optimale Lösung und verändern sie. Wir zeigen, dass keine Änderung der Greedy-Lösung eine Verbesserung bewirken kann.

Sei $(a_1, \dots, a_n)$ die Greedy-Lösung. Wir betrachten Änderungen an dieser Lösung:

**Fall 1: Einen Gegenstand $i$ mit hoher Dichte (der voll eingepackt ist, $a_i=1$) reduzieren.**
*   Wir verringern den Anteil eines Gegenstands $i$ (mit hoher Dichte) um einen kleinen Wert und erhöhen dafür den Anteil eines Gegenstands $j$ (mit niedrigerer Dichte, $j > k$), um die Kapazität wieder zu nutzen.
*   Da $i$ weiter vorne in der Sortierung steht als $j$, gilt: $\frac{v_i}{x_i} \ge \frac{v_j}{x_j}$.
*   Wenn wir Gewicht von einem "wertvolleren" Gegenstand (pro kg) zu einem "weniger wertvollen" verschieben, **verlieren** wir insgesamt an Wert (oder bleiben gleich, wenn Dichten identisch).
*   Formal:
    *   Sei $\alpha < 1$ der neue Anteil von $x_i$. Das freiwerdende Gewicht ist $(1-\alpha)x_i$.
    *   Dieses Gewicht füllen wir mit $x_j$ auf. Der Anteil $\beta$ für $x_j$ berechnet sich aus $\beta x_j = (1-\alpha)x_i \implies \beta = (1-\alpha)\frac{x_i}{x_j}$.
    *   Änderung des Gesamtwerts:
        $$ \Delta \text{Wert} = \underbrace{(\alpha - 1) v_i}_{\text{Verlust durch } i} + \underbrace{\beta v_j}_{\text{Gewinn durch } j} $$
        $$ = -(1-\alpha)v_i + (1-\alpha)\frac{x_i}{x_j} v_j $$
        $$ = (1-\alpha)x_i \left( -\frac{v_i}{x_i} + \frac{v_j}{x_j} \right) $$
    *   Da $\frac{v_i}{x_i} \ge \frac{v_j}{x_j}$, ist der Term in der Klammer $\le 0$. Die Wertänderung ist also negativ oder null. Keine Verbesserung möglich.

**Fall 2: Den Bruchteil-Gegenstand $b$ verändern.**
*   Ähnlich wie Fall 1: Wenn wir den Anteil des Bruchteil-Gegenstands verringern, um einen schlechteren Gegenstand aufzunehmen, verlieren wir Wert. Wenn wir ihn erhöhen würden, würde die Kapazität überschritten (nicht zulässig) oder wir müssten einen noch besseren Gegenstand entfernen (siehe Fall 1).

Daraus folgt: Die Greedy-Lösung ist optimal.

## Abgrenzung zum 0/1-Rucksackproblem

Beim [[Rucksack Problem|0/1-Rucksackproblem]] (keine Bruchteile erlaubt) **versagt** der Greedy-Algorithmus oft.

> [!example] Gegenbeispiel
> *   Gegenstände $1, \dots, n-1$: $v_i = x_i = 1$ (Dichte 1).
> *   Gegenstand $n$: $v_n = y-1, x_n = y$ (Dichte $\frac{y-1}{y} < 1$).
> *   Sei Rucksackgröße $y = k \cdot n$ für ein großes $k$.
>
> **Greedy:**
> *   Wählt zuerst alle Gegenstände $1$ bis $n-1$ (höchste Dichte 1).
> *   Rucksack ist gefüllt mit Gewicht $n-1$.
> *   Restplatz: $kn - (n-1)$.
> *   Gegenstand $n$ hat Größe $kn$. Passt nicht mehr rein!
> *   **Wert Greedy:** $n-1$.
>
> **Optimal:**
> *   Nimm nur Gegenstand $n$.
> *   Passt genau ($x_n = y$).
> *   **Wert Optimal:** $y-1 = kn - 1$.
>
> Für $k > 1$ ist $kn - 1$ viel größer als $n - 1$. Der Greedy-Algorithmus ist hier beliebig schlecht.

## Zusammenfassung

| Merkmal | Bruchteil-Rucksackproblem | 0/1-Rucksackproblem |
| :--- | :--- | :--- |
| **Teilbarkeit** | Gegenstände beliebig teilbar | Ganz oder gar nicht |
| **Algorithmus** | **Greedy** (Sortieren nach $v/x$) | **Dynamische Programmierung** |
| **Komplexität** | $O(n \log n)$ (wegen Sortieren) | $O(n \cdot y)$ (pseudopolynomiell) |
| **Optimalität Greedy** | Ja | Nein |
