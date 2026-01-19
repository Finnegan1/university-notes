---
tags:
  - Algorithmik
  - zusammenfassung
---

### Das Entscheidungsbaum-Modell (Beispiel aus den Notizen)

Jedes vergleichsbasierte Sortierverfahren lässt sich als **Entscheidungsbaum** modellieren. Dieser Baum stellt alle möglichen Abläufe des Algorithmus dar.

-   **Innere Knoten**: Jeder Knoten im Baum repräsentiert einen **Vergleich** zwischen zwei Elementen (z. B. $a_i \le a_j$).
-   **Kanten**: Von jedem Knoten führen zwei Kanten weg, die den beiden möglichen Ausgängen des Vergleichs entsprechen ($\le$ oder $>$).
-   **Blätter**: Jedes Blatt des Baumes repräsentiert ein eindeutiges, **fertig sortiertes Ergebnis** (eine Permutation der ursprünglichen Elemente).

#### Darstellung für 3 Elemente ($a_1, a_2, a_3$)

Deine Notiz zeigt, wie man sich einen solchen Baum vorstellen kann. Hier ist eine mögliche Umsetzung als Textgrafik, die alle $3! = 6$ Ergebnisse abdeckt:

```
                             (a1 <= a2?)
                     /-------------------------\ 
                 (ja, <=)                     (nein, >)
                   /                             \
            (a2 <= a3?)                      (a1 <= a3?)
           /           \                    /           \
        (<=)           (>)               (<=)           (>)
         /               \                /               \
   {a1,a2,a3}      (a1 <= a3?)        {a2,a1,a3}      (a2 <= a3?)
                   /       \                           /       \
                (<=)       (>)                      (<=)       (>)
                 /           \                       /           \
            {a1,a3,a2}    {a3,a1,a2}            {a2,a3,a1}    {a3,a2,a1}
```

Die **Laufzeit** für eine bestimmte Eingabe entspricht der Länge des Pfades von der Wurzel bis zum Ergebnisblatt. Die **Worst-Case-Laufzeit** ist die Länge des längsten Pfades, also die **Höhe $h$** des Baumes.

---

### 1. Die zentrale Frage nach der Mindestlaufzeit

> **Notiz:** *„wichtig für die Laufzeit: Mindestlänge des längsten Pfades! => Ω-Notation“*
> 
> **Notiz:** *„Wie lang muss ein längster Pfad von der Wurzel zu einem Blatt mindestens sein?“*

Die Kernaussage ist: Die **Worst-Case-Laufzeit** eines vergleichsbasierten Sortieralgorithmus wird durch die Höhe seines Entscheidungsbaums, also die **Länge des längsten Pfades**, bestimmt.

Unser Ziel ist es, die theoretische **Mindesthöhe** für *jeden denkbaren* Entscheidungsbaum zu finden, der $n$ Elemente sortiert. Diese untere Schranke wird mit der **$\Omega$-Notation** ausgedrückt.

---

### 2. Die Höhe eines allgemeinen Binärbaums

> **Notiz:** *„Aufgabe: Ein Binärbaum mit n Blättern besitzt einen Pfad der Länge log₂n.“*

Um die Frage zu beantworten, benötigen wir einen fundamentalen Satz über Binärbäume:

**Ein Binärbaum mit $L$ Blättern hat eine Höhe $h$ von mindestens $h \ge \lceil\log_2(L)\rceil$.**

Das bedeutet, die Höhe des Baumes hängt immer logarithmisch von seiner Anzahl an Blättern ab.

#### Beweis durch Widerspruch

> **Notiz:** *„über Widerspruch: Sonst n Blätter und Pfad mit Länge log₂n - 1 => ... => geht nicht!“*

Man kann diesen Satz leicht durch einen Widerspruchsbeweis verstehen:

1.  **Annahme:** Nehmen wir an, es gäbe einen Baum mit $L$ Blättern, dessen Höhe $h$ *kleiner* als $\log_2(L)$ ist (z.B. $h = \lceil\log_2(L)\rceil - 1$).
2.  **Maximal mögliche Blätter:** Ein Baum der Höhe $h$ kann maximal $2^h$ Blätter haben.
3.  **Widerspruch:** Setzen wir unsere angenommene (zu kleine) Höhe ein, kann der Baum höchstens $2^{\lceil\log_2(L)\rceil - 1}$ Blätter haben. Dieser Wert ist garantiert *kleiner* als $L$.
4.  **Schlussfolgerung:** Unsere Annahme führt zu einem Widerspruch, da der Baum nicht gleichzeitig $L$ Blätter haben und eine Höhe kleiner als $\log_2(L)$ besitzen kann. Die Annahme muss also falsch sein.

---

### 3. Anwendung auf den Sortierbaum

> **Notiz:** *„Aufgabe: längster Pfad (= Laufzeit) eines Sortierbaums. Binärbaum, der n Elemente sortieren soll, hat n! Blätter -> damit längster Pfad log₂(n!)“*

Jetzt wenden wir diesen allgemeinen Satz auf unseren konkreten Fall an:

1.  Ein Sortierbaum für $n$ Elemente muss in der Lage sein, jede mögliche Permutation als Ergebnis zu liefern. Es gibt **$n!$** mögliche Permutationen.
2.  Der Baum muss also mindestens **$L = n!$ Blätter** haben.
3.  Wir setzen $L = n!$ in unsere Formel für die Mindesthöhe ein:
    $$h \ge \log_2(n!)$$

> **Notiz:** *„Folgerung: Da der Binärbaum, der das Verhalten eines Sortierverfahrens darstellt, n! Blätter besitzt, enthält er einen Pfad der Länge log₂(n!).“*

Die logische Schlussfolgerung ist also: Jeder Entscheidungsbaum, der $n$ Elemente sortiert, muss eine Höhe von mindestens $\log_2(n!)$ haben.

---

### 4. Finale Komplexitätsklasse

> **Notiz:** *„daraus folgt: Die Laufzeit eines allgemeinen Sortierverfahrens liegt in Ω(log n!).“*

Diese Mindesthöhe $h$ übersetzen wir direkt in die Sprache der Komplexitätstheorie. Die untere Schranke für die Laufzeit im Worst-Case ist:

$$\text{Laufzeit} \in \Omega(\log(n!))$$

> **Notiz:** *„dabei: Ω(log n!) = Ω(n log n) - Θ(n)“*

Der letzte Schritt ist die Vereinfachung dieses Ausdrucks. Mithilfe der Stirling-Formel nähert man $\log(n!)$ an $n \log(n)$ an.

**Korrektur der Notiz:** In der $\Omega$-Notation werden Terme niedrigerer Ordnung ignoriert, da sie für große $n$ nicht ins Gewicht fallen. Der Term $- \Theta(n)$ ist daher nicht korrekt. Die korrekte Vereinfachung lautet:

$$\Omega(\log(n!)) = \Omega(n \log n)$$

### Fazit

Jedes vergleichsbasierte Sortierverfahren benötigt im schlimmsten Fall **mindestens $\Omega(n \log n)$** Vergleiche.

nächstes: [[Merge Sort]] 