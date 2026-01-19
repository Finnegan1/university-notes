---
tags:
  - Algorithmik
  - zusammenfassung
---

# Binäre suche

## Algorithmus

Gegeben: sortierte Liste mit $n = 2^k$ Elementen

Es wird nun immer das Element in der Mitte der Liste betrachtet und mit dem gesuchten Wert verglichen.
![[assets/ink/2025.12.17 - 10.27am.svg|350x150]]

## Laufzeit

Es gibt 2 Methoden zur Implementierung:

- Rekursionsgleichung
- Binärbaumuntersuchung

### Rekursionsgleichung

Es wird die Anzahl an Zugriffen $v$ auf einen Wert in der Mitte des (restlichen) Arrays mit Länge $n$ gezählt.

Wenn in Liste nur 1 Element, dann ist Zugriffsanzahl 1

- $v(1) = 1$

Angenommen: $n=2^k$

- Für eine unerfolgreiche Suche gilt: $v(n) = 1 + v(\frac{n-1}{2})$
- Es wird das mittlere Element verglichen (+1) und danach ist nur noch die Hälfte des Arrays übrig $v(\frac{n-1}{2})$

#### Rekursionsgleichung auflösen:

Da v(n) monoton wächst gilt:

- $v(n) = 1 + v(\frac{n-1}{2})$
- $v(n) \leq 1 + v(\frac{n}{2})$
  Lösen durch mehrfaches Einsetzen:
  $$
  \begin{aligned}
  v(n)
  &\le 1 + v\!\left(\frac{n}{2}\right) \\
  &\le 1 + 1 + v\!\left(\frac{n}{4}\right) \\
  &\le 1 + 1 + 1 + v\!\left(\frac{n}{8}\right) \\
  &\;\;\vdots \\
  &\le k + v(\frac{n}{2^k}) \text{ | durch Annahme } n=2^k \\
  &\le k + v(1) \\
  &\le k + 1 \\
  \end{aligned}
  $$
  **Nebenrechnung**:
  $$
  \begin{aligned}
  n = 2^k \\
  k = log_2(n)
  \end{aligned}
  $$
  **Ergebnis**
  $$v(n) \le log_2(n) + 1$$

LZ ist damit $O(log(n))$

> [!note]- Warum ist die Basis des Logarithmus bei der Laufzeit egal?
>
> In der Laufzeitanalyse der binären Suche ergibt sich:
>
> $$v(n) \le \log_2(n) + 1$$
>
> Beim Übergang zur asymptotischen Laufzeit wird dies als $O(\log n)$ geschrieben, ohne eine konkrete Basis anzugeben. Das ist korrekt, weil die Basis des Logarithmus in der O-Notation keine Rolle spielt.
>
> #### Mathematische Begründung (Basiswechsel)
>
> Für Logarithmen gilt die Basiswechsel-Formel:
>
> $$\log_a(n) = \frac{\log_b(n)}{\log_b(a)}$$
>
> Der Faktor $\frac{1}{\log_b(a)}$ ist eine Konstante und hängt nicht von $n$ ab. Logarithmen mit unterschiedlicher Basis unterscheiden sich daher nur durch einen konstanten Faktor.
>
> #### Bezug zur O-Notation
>
> Die O-Notation ignoriert konstante Faktoren per Definition. Deshalb gilt:
>
> $$O(\log_2 n) = O(\log_{10} n) = O(\ln n)$$
>
> Die Wachstumsordnung bleibt gleich, unabhängig von der Basis des Logarithmus.
>
> #### Bezug zur binären Suche
>
> Bei der binären Suche wird das Problem in jedem Schritt halbiert, weshalb sich ein Logarithmus zur Basis 2 ergibt. Für die asymptotische Laufzeit ist jedoch nur entscheidend, dass die Laufzeit logarithmisch wächst, nicht mit welcher Basis.
>
> Daher schreibt man allgemein:
>
> $$O(\log n)$$

# Binäre Suchbäume

= Binäre Wurzelbäume, wobei alle Werte der Knoten in dem linken Teilbaum eines Knoten kleiner und im rechten Teilbaum des Knotens größer sind als der Wert des Knotens selbst.

## Notwendige Funktionen:

### Suche nach Werte

Laufzeit:

- Abhängig von der Tiefe des Baumes
- Bei vollständig ausbalanciertem Baum: O(log n)
- Bei linear entarteten Bäumen O(n) - mit n höhe des Baumes

### Einfügen eines Wertes

Suche des Wertes im Baum, falls im Baum gefunden abbrechen des Einfügens.
Sonst wird an der stelle an welcher die suche beendet wurde ein neues Blatt mit dem Wert hinzugefügt.
Laufzeit:

- Bei Balancierten Bäumen O(log n)
- Bei linear ausgearteten Bäumen O($n$) - mit n höhe des Baumes

### Erstelle eines gesamten Baums

Es wird hierbei n mal die Einfügeoperation wiederholt.
Laufzeit:

- Bei Balancierten Bäumen O(n $\cdot$ log n)
- Bei linear ausgearteten Bäumen O($n^2$)

### Entfernen eines Wertes

- Wenn Blatt => direkt löschen
- Wenn nur ein Nachfolger => direkt löschen und Nachfolger anstelle des gelöschten Wertes setzen
- Wenn Knoten 2 Nachfolger besitzt wird er durch den kleinsten wert im rechten Teilbaum ersetzt.
  Laufzeit:
- O(n) mit n höhe des Baumes

## Erweitertet Binärmaum

Binärbaum bei welchem jeder Knoten genau 2 Nachfolger besitzt und dessen Blätter leere knoten sind.

nächstes: [[Algorithmik/fynn-zusammenfasssung/Hashing]]
