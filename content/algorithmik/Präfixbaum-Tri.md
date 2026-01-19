---
tags:
  - Algorithmik
  - zusammenfassung
---

= endlicher, deterministischer Baum

![[Bildschirmfoto 2025-12-31 um 14.48.22.png]]
## Laufzeiten der Suche

 sei $\sigma$ (sigma) das Alphabt und m die Länge der Gesuchten Zeichenkette

- bei Speicherung als Listen: $O(m \cdot |\sigma|)$
	- es muss m mal eine liste von $|\sigma|$ Zeichen durchsucht werden
- bei Speicherung als einzelne Knoten: $O(m)$
	- jedoch viel Speicherplatz
- bei Speicherung in sortierten Arrays: $O(m \cdot log \space |\sigma|)$
	- durch Möglichkeit der Binärsuche Suchzeit in array nur $O(log \space n)$
	- geringerer Speicherbedarf

## Autocompleate

Autocompleate mit Präfixbaum einfach implementierterbar.
- Mindestanzahl an Zeichen festlegen
- Wenn Mindestanzahl erreicht werden Blätter per Tiefensuche ausgehend von aktuellem Knoten ausgegeben.


nächstes: [[Untere Laufzeitschranke für Sortierverfahren]]
