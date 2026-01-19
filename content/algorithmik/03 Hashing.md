---
tags:
  - Algorithmik
  - zusammenfassung
---

# Hashtable

Sei U eine Menge an Potentiellen Schlüsseln (z.b. alle möglichen ISBN Nummern)
Sei S eine Menge an zu verwaltenden Schlüssen $S \in U$ (z.b. ISBN Nummern der Bücher der Bibliothek)

## Funktionsweise
Verwendet eine Hashfunktion h, welche angewandt auf den Schlüssel S ($\in U$) eine Adresse in der Hashtabelle liefert.

Die Hashtabelle T ist ein Array von Zeigern, welche auf die Eigentlichen Datensätze zeigen und mit 0, 1, ..., n-1 durchindiziert sind.

Typische Hashfunktion h ist: $h(S) = S \space mod \space m$  
- mit m = der Länge der Hashtabelle
- $h(S) \rightarrow \{0, 1, ... , n-1\}$ 

> Für $|u| > m$  (kleinere Hashtabellenlänge als mögliche Schlüssel) ist h nicht injektiv, folglich gibt es Kollisionen, also Schlüssel für welche gilt: $h(S) = h(S')$  

### Wie groß ist die Chance einer Kollision? (Geburtstagsproblem)

Die Wahrscheinlichkeit für *mindestens eine Kollision* berechnet man über die Gegenwahrscheinlichkeit: `P(mind. eine Kollision) = 1 - P(keine Kollision)`.

Hier ist die schrittweise Berechnung für die Wahrscheinlichkeit von **keiner Kollision** bei `m=100`:

- **1. Schlüssel:** Trifft einen freien Platz. Wahrscheinlichkeit für *keine* Kollision ist `100/100`.
- **2. Schlüssel:** Muss einen der 99 freien Plätze treffen. Wahrscheinlichkeit ist `99/100`.
- **3. Schlüssel:** Muss einen der 98 freien Plätze treffen. Wahrscheinlichkeit ist `98/100`.
- **k-ter Schlüssel:** Muss einen der `100-k+1` freien Plätze treffen. Wahrscheinlichkeit ist `(100-k+1)/100`.

Die Gesamtwahrscheinlichkeit für *keine* Kollision bei mehrfachen einfügen ist das Produkt dieser Werte:
$P(\text{keine Kollision}) = \frac{100 \cdot 99 \cdot 98 \cdots (100-k+1)}{100^k}$

Daraus ergibt sich die Wahrscheinlichkeit für *mindestens eine* Kollision:
$P(\text{mind. eine Kollision}) = 1 - (\frac{99}{100} \cdot \frac{98}{100} \cdots \frac{100-k+1}{100})$

Schon bei dem hintereinander einfügen von k=13 Schlüsseln liegt die Kollisionswahrscheinlichkeit bei über 50%.

### Überlaufliste

Hashing mit Verkettung, jedes Element der Hashtabelle wird als Ausgangspunkt für eine Überlaufliste angesehen.

![[Bildschirmfoto 2025-12-29 um 17.23.36.png]]


### Laufzeit

Die Effizienz einer Hashtabelle wird maßgeblich durch den **Belegungsfaktor (oder Ladefaktor) $\beta$** bestimmt. Dieser ist definiert als:
$$ \beta = \frac{m}{n} $$
- **$m$**: Anzahl der eingefügten Elemente
- **$n$**: Größe der Hashtabelle

#### Durchschnittliche Laufzeit (Erwartungswert)
Die mit Abstand häufigste Methode zur Kollisionsbehandlung ist die **Verkettung**, bei der eine Überlaufliste entsteht. Die durchschnittliche Laufzeit für Operationen hängt von der erwarteten Länge dieser Liste ab.

**Analyse der erwarteten Listenlänge:**
1.  **Annahme:** Wir verwenden eine gute Hashfunktion, die die $m$ Elemente **zufällig und gleichverteilt** auf die $n$ Plätze der Tabelle abbildet. Die Wahrscheinlichkeit, dass ein Element an einem bestimmten Platz $i$ landet, ist also $\frac{1}{n}$.
2.  **Indikatorvariable:** Wir definieren eine Hilfsvariable $\Pi_k$ für jedes Element $k$. $\Pi_k$ ist $1$, wenn Element $k$ an Position $i$ gehasht wird, und $0$ sonst.
3.  **Erwartungswert:** Der Erwartungswert $E[\Pi_k]$ ist die Wahrscheinlichkeit, dass $\Pi_k = 1$, also $\frac{1}{n}$.
4.  **Gesamtlänge:** Die Länge der Kette an Position $i$ ist die Summe aller Indikatorvariablen $\sum \Pi_k$. Deren Erwartungswert ist die Summe der einzelnen Erwartungswerte:
    $$ E(\text{Länge an Pos. i}) = \sum_{k=1}^{m} E[\Pi_k] = \sum_{k=1}^{m} \frac{1}{n} = m \cdot \frac{1}{n} = \beta $$

Die erwartete Länge einer Kette ist also genau der Belegungsfaktor $\beta$. Daraus ergibt sich:
- **Durchschnittliche Laufzeit:** $O(1 + \beta)$. ($O(1)$ für Hash-Berechnung + $O(\beta)$ für Listensuche)
- **Worst-Case-Laufzeit:** $O(m)$, falls alle $m$ Elemente in derselben Kette landen.

#### Amortisierte Laufzeitanalyse bei dynamischer Größenanpassung

Wenn eine Hashtabelle zu voll wird (hoher Belegungsfaktor $\beta$), steigt die Anzahl der Kollisionen und die Performance sinkt. Um dies zu verhindern und den Faktor $\beta$ niedrig zu halten, wird die Tabelle dynamisch vergrößert. Diese Strategie sorgt dafür, dass die Operationen im Durchschnitt schnell bleiben.

**Das Grundprinzip:**
1.  **Schwellenwert (z.B. $\beta_{max} = 1$)**: Es wird ein maximaler Lastfaktor festgelegt.
2.  **Größenänderung**: Sobald eine Einfügung diesen Schwellenwert überschreitet, wird eine neue, größere Tabelle (z.B. doppelt so groß) erstellt.
3.  **Kopieren**: Alle bisherigen Elemente müssen aus der alten in die neue Tabelle umkopiert werden. Dieser einzelne Schritt ist mit einem Aufwand von $O(m)$ (wobei $m$ die Anzahl der Elemente ist) sehr teuer.

**Die Amortisierte Analyse: Warum es trotzdem effizient ist**

Obwohl die Vergrößerung teuer ist, passiert sie nur selten. Davor gibt es viele "billige" Einfügeoperationen (jeweils $O(1)$). Die amortisierte Analyse verteilt die hohen Kosten der seltenen, teuren Operation auf die vielen günstigen Operationen, die sie verursacht haben.

**Beispiel-Szenario ($\beta_{max}=1$):**
- Annahme: Wir starten mit einer Tabelle der Größe `n` und führen `n` Elemente ein. Jede dieser `n` Einfügungen kostet `O(1)`.
- Die `(n+1)`-te Einfügung löst die Größenänderung aus.
- Die Kosten für **diese eine Operation** setzen sich zusammen aus:
    - **Kopieren der `n` alten Elemente**: $O(n)$
    - **Einfügen des neuen Elements**: $O(1)$
    - Gesamtkosten der Operation: $O(n)$
- **Gesamtkostenberechnung:**
    - Die ersten `n` Operationen kosteten zusammen: $n \cdot O(1) = O(n)$
    - Die `(n+1)`-te Operation kostete: $O(n)$
    - Die Gesamtkosten für alle `n+1` Operationen sind also: $O(n) + O(n) = O(n)$
- **Amortisierte ("durchschnittliche") Kosten:**
    - Man teilt die Gesamtkosten durch die Anzahl der Operationen:
    $$ \frac{O(n)}{n+1} \rightarrow O(1) $$

**Ergebnis:** Obwohl eine einzelne Einfügung im schlimmsten Fall $O(n)$ kosten kann, betragen die **amortisierten Kosten** pro Operation nur **$O(1)$**. Dank der dynamischen Größenanpassung bleibt die Hashtabelle also auch bei vielen Einfügungen extrem effizient.

## Unterstützte Operationen
- Suchen nach einem Datensatz (bei gegebenem Schlüssel)
- Einfügen eines Datensatzes
- Löschen eines Datensatzes



Next: [[Dynamische Arrays]]