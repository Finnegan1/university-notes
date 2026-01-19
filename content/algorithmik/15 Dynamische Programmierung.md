---
tags:
  - Algorithmik
  - zusammenfassung
---

Beispiel: Fibonacci-Zahlen $f_{n}$

Mit rekursivem Algorithmus müssen viele Zahlen mehrfach berechnet werden => exponentielle Laufzeit

werden jedoch die Werte $f_{i}$ innerhalb einer Tabelle gespeichert, welche in einer Schleife i = 0 bis n befüllt wird, ist der Aufwand nur noch linear.

Das Dynamische Programmieren ist ein Konstruktionsprinzip für Algorithmen, bei der eine Lösung als Teillösung zusammengesetzt wird. Die Teillösungen werden für eine spätere Verwendung in Tabellen (Arrays) gespeichert, Die Reihenfolge der Berechnung ist dabei umgekehrt zu dem Divide-and-Conquer-Algorithmus.
Diese Zerlegen Probleme in Teilprobleme, während ein Dynamischer Programmieralgorithmus aus Teillösungen größere Teillösungen und schließlich die Lösung konstruiert. Vorraussetzung dafür ist, dass sich aus Teillösungen eine optimale Lösung konstruieren lässt.

Die Laufzeit eines Dynamischen Programmieralorithmus ist:
$$\text{Tabellengröße } \cdot \text{ Aufwand pro Spalte}$$

Tips für das Lösen von Dynamischen Programmieraufgaben: [[Dynamische-Programmierung-Leitfaden]]

nächstes: [[Editierdistanz]]



