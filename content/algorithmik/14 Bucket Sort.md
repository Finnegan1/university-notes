---
tags:
  - Algorithmik
  - zusammenfassung
---

# Bucket Sort

Bucket Sort ist ein Sortieralgorithmus, der besonders effizient arbeitet, wenn die zu sortierenden Daten gleichmäßig über einen bestimmten Wertebereich verteilt sind. Die Grundidee ist, die Elemente auf mehrere "Eimer" (Buckets) aufzuteilen und diese dann einzeln zu sortieren.

## Annahme

Die $n$ Elemente, die sortiert werden sollen, liegen in einem Intervall $[a, b]$ und sind darin gleichverteilt.

## Algorithmus-Schritte

1.  **Buckets erstellen:** Erstelle $n$ leere Listen (die Buckets). Das Intervall $[a, b]$ wird in $n$ gleich große Teilintervalle aufgeteilt, wobei jedes Teilintervall einem Bucket zugeordnet ist.
2.  **Elemente verteilen:** Gehe die ursprüngliche Liste mit $n$ Elementen durch. Für jedes Element wird berechnet, in welchen Bucket es gehört, und dort eingefügt. Dieser Schritt dauert $O(n)$.
3.  **Buckets sortieren:** Sortiere die Listen in jedem einzelnen Bucket.
4.  **Zusammenfügen:** Gehe die Buckets in der richtigen Reihenfolge durch und hänge die sortierten Elemente an die finale Ausgabeliste an. Dieser Schritt dauert $O(n)$.

## Laufzeitanalyse (detailliert nach Notizen)

### 1. Grundlagen der Analyse
Die $n$ zu sortierenden Werte werden als **unabhängig und identisch verteilt** (i.i.d.) auf dem Intervall $[a,b]$ angenommen.
- $X_i$ wird als die **Anzahl der Elemente in Liste i** (also im i-ten Bucket) definiert.
- Da jedes der $n$ Elemente mit einer Wahrscheinlichkeit von $p = 1/n$ in genau dieser Liste $i$ landet, ist $X_i$ eine **binomialverteilte Zufallsvariable** mit den Parametern $n$ und $p$.

### 2. Erwartungswert und Varianz von $X_i$
Für die binomialverteilte Zufallsvariable $X_i$ gelten folgende Formeln:
- **Erwartungswert:** $E[X_i] = n \cdot p = n \cdot \frac{1}{n} = 1$.
- **Varianz:** $Var(X_i) = n \cdot p \cdot (1-p) = n \cdot \frac{1}{n} \cdot (1 - \frac{1}{n}) = 1 - \frac{1}{n}$.

### 3. Herleitung des erwarteten Sortieraufwands $E[X_i^2]$
- Die Laufzeit zum Sortieren der Liste $i$ liegt in $O(X_i^2)$ (wenn man z.B. Insertion Sort verwendet).
- Um die erwartete Laufzeit zu finden, wird die Formel für die Varianz (Verschiebungssatz) genutzt: $Var(X_i) = E[X_i^2] - (E[X_i])^2$.
- Diese Formel wird nach $E[X_i^2]$ umgestellt: $E[X_i^2] = Var(X_i) + (E[X_i])^2$.
- Jetzt werden die oben berechneten Werte eingesetzt: $E[X_i^2] = (1 - \frac{1}{n}) + 1^2 = 2 - \frac{1}{n}$.

### 4. Gesamter erwarteter Aufwand
- Der gesamte erwartete Aufwand, um alle Listen zu sortieren, ist die Summe der erwarteten Aufwände für jede einzelne Liste: $E[\sum_{i=1}^{n} c \cdot X_i^2]$.
- Durch Vereinfachung (Linearität des Erwartungswertes) erhält man: $c \cdot n \cdot E[X_i^2]$.
- Einsetzen des hergeleiteten Werts für $E[X_i^2]$: $c \cdot n \cdot (2 - \frac{1}{n})$.
- Ausmultipliziert ergibt das: $c \cdot (2n - 1)$.
- Dieser Ausdruck ist in der Komplexitätsklasse **$O(n)$**.



[[Dynamische Programmierung]]
