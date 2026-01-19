---
tags:
  - Algorithmik
  - zusammenfassung
---

**Skiplisten**: Eine probabilistische Datenstruktur

Skiplisten sind eine elegante Datenstruktur, um sortierte Elemente zu speichern und Operationen wie Suchen, Einfügen und Löschen in sehr schneller Zeit – vergleichbar mit balancierten Bäumen – durchzuführen. Ihre Besonderheit liegt darin, dass sie ihre Effizienz nicht durch komplexe Rotations-Algorithmen, sondern durch Wahrscheinlichkeit erreichen.

> **Analogie: Die Zugstrecke**
> Eine normale sortierte, verkettete Liste ist wie eine Zugstrecke mit nur einem Bummelzug, der an jeder Station hält. Um zu einer weit entfernten Station zu gelangen, muss man an allen dazwischenliegenden Stationen vorbeifahren, was sehr langsam ist (lineare Laufzeit, $O(n)$).
>
> Eine Skipliste fügt nun Express-Spuren hinzu:
> - **Ebene 1:** Der Bummelzug, der alle Stationen verbindet.
> - **Ebene 2:** Ein Regional-Express, der nur jede zweite oder dritte Station anfährt.
> - **Ebene 3:** Ein ICE, der nur große Knotenpunkte verbindet.
>
> Um schnell ein Ziel zu erreichen, nimmt man den schnellsten Zug (höchste Ebene), fährt so weit wie möglich, steigt eine Ebene tiefer und wiederholt dies, bis man auf der untersten Ebene die letzten paar Stationen mit dem Bummelzug fährt.

---

## Struktur einer Skipliste

Eine Skipliste besteht aus mehreren Schichten (Ebenen) von sortierten, verketteten Listen.

- **Ebene 1** (die unterste) enthält alle Elemente.
- Jede höhere Ebene $i$ enthält eine zufällige Untermenge der Elemente von Ebene $i-1$.
- Ein Element, das auf Ebene $i$ vorhanden ist, hat eine feste Wahrscheinlichkeit $p$ (oft $p=0.5$), auch auf Ebene $i+1$ zu erscheinen.
- Jeder Knoten in der Liste hat eine variable Höhe (sein "Turm") und besitzt für jede seiner Ebenen einen Vorwärts-Zeiger.

### Beispiel einer Skipliste (ASCII-Art)

Hier ist eine mögliche Skipliste für die Zahlen {3, 6, 9, 17, 19, 25}. Der `Kopf`-Knoten ist der Startpunkt.

```
 (Kopf)
    |
    v
L3: h-----------------------------------------> NIL
	|
    v
L2: h-------------> 9 ------------------------> NIL
    |               |
    v               v
L1: h------> 6 ---> 9 -------> 19 ------------> NIL
    |        |      |          |
    v        v      v          v
L0: h-> 3 -> 6 ---> 9 -> 17 -> 19 -> 25 ------> NIL
```

---

## Operationen auf Skiplisten

Der grundlegende Algorithmus für alle Operationen ist: **"Starte so hoch wie möglich, gehe so weit rechts wie möglich, dann gehe eine Ebene nach unten."**

### Suchen (z.B. nach Wert 19)

1.  **Start:** Beginne beim `Kopf` auf der höchsten Ebene (hier L3).
2.  **Ebene 3:** Gehe nach rechts. Der nächste Knoten ist `NIL`. `19` ist nicht weiter rechts. Gehe eine Ebene runter zum `Kopf` auf L2.
3.  **Ebene 2:** Gehe nach rechts. Der nächste Knoten ist `9`. Da $9 < 19$, springen wir zur `9`. Vom Knoten `9` aus ist der nächste `NIL`. Gehe eine Ebene runter zum Knoten `9` auf L1.
4.  **Ebene 1:** Gehe nach rechts. Der nächste Knoten ist `19`. Da $19 = 19$, sind wir fast am Ziel. Zur Sicherheit gehen wir noch eine Ebene runter zum Knoten `19` auf L0.
5.  **Ebene 0:** Wir sind beim Knoten `19`. **Wert gefunden!**

### Einfügen (z.B. von Wert 12)

1.  **Position finden:** Suche nach `12` wie oben beschrieben. Du landest auf Ebene 0 beim Knoten `9` und stellst fest, dass `12` zwischen `9` und `17` gehört.
2.  **Unten einfügen:** Füge `12` immer auf Ebene 0 ein. Die Liste ist jetzt: `h -> ... -> 9 -> 12 -> 17 -> ...`
3.  **Höhe bestimmen (Münzwurf):** Bestimme durch einen probabilistischen Prozess, wie hoch der "Turm" des neuen Knotens wird.
    - Wirf eine Münze. Bei "Kopf" (Wahrscheinlichkeit $p$), baue eine Ebene höher und wiederhole. Bei "Zahl", stoppe.
    - **1. Wurf:** Kopf? -> Füge `12` auch auf Ebene 1 ein. Die Liste dort wird zu `h -> ... -> 9 -> 12 -> 19 -> ...`.
    - **2. Wurf:** Zahl. -> Stopp. Der Turm für `12` ist also 2 Ebenen hoch (Ebene 0 und 1).

### Löschen

Um ein Element zu löschen, wird es zuerst gesucht. Während der Suche merkt man sich die Pfad-Knoten (die Vorgänger auf jeder Ebene). Sobald das Element auf Ebene 0 gefunden wurde, wird es auf allen Ebenen, auf denen es existiert, entfernt, indem die Zeiger der Vorgänger aktualisiert werden.

---

## Laufzeitanalyse (Der mathematische Kern)

Sei $n$ die Anzahl der Elemente in der Liste und $p$ die Wahrscheinlichkeit, dass ein Knoten eine Ebene aufsteigt (typischerweise $p=0.5$).

### Erwartete Höhe der Skipliste

Die Wahrscheinlichkeit, dass ein bestimmter Knoten mindestens Höhe $h$ hat, ist $p^{h-1}$. Für $p=1/2$ ist das $(\frac{1}{2})^{h-1}$. Die erwartete Anzahl von Knoten auf der höchsten Ebene $h$ ist die Gesamtzahl $n$ mal diese Wahrscheinlichkeit. Wir nehmen an, dass die höchste Ebene im Schnitt nur noch 1 Element enthält und lösen nach $h$ auf.

$$
E(M) = n \cdot \left(\frac{1}{2}\right)^{h-1} = 1
$$
> **Erklärung:** Startgleichung. Die erwartete Anzahl der Knoten auf Ebene $h$ wird auf 1 gesetzt.

$$
\Longleftrightarrow \left(\frac{1}{2}\right)^{h-1} = \frac{1}{n}
$$
> **Erklärung:** Umformung durch Division beider Seiten durch $n$.

$$
\Longleftrightarrow 2^{h-1} = n
$$
> **Erklärung:** Bildung des Kehrwerts auf beiden Seiten. Es gilt $(\frac{1}{x})^y = x^{-y}$ und $\frac{1}{z} = z^{-1}$. Die Gleichung $(\frac{1}{2})^{h-1} = \frac{1}{n}$ wird zu $2^{-(h-1)} = n^{-1}$. Wenn man nun beide Seiten mit -1 potenziert (also den Kehrwert des Kehrwerts bildet), erhält man $2^{h-1} = n$.

$$
\Longleftrightarrow h-1 = \log_2(n)
$$
> **Erklärung:** Anwendung des Logarithmus zur Basis 2, um den Exponenten aufzulösen.

$$
\Longleftrightarrow h = \log_2(n) + 1
$$
> **Erklärung:** Umformung durch Addition von 1 auf beiden Seiten.

Das Endergebnis zeigt, dass die Höhe $h$ logarithmisch mit der Anzahl der Elemente $n$ wächst:
$$ \rightarrow \text{Höhe } h \text{ liegt in } O(\log n) $$

### Erwartete Suchkomplexität

Eine Suche besteht aus vertikalen und horizontalen Bewegungen.

1.  **Vertikale Schritte:** Die Anzahl der Ebenen ist, wie wir gesehen haben, $O(\log n)$. Also machen wir höchstens $O(\log n)$ Schritte nach unten.
2.  **Horizontale Schritte:** Auf einer Ebene $i$ bewegen wir uns vorwärts, bis wir einen Knoten finden, dessen Nachfolger größer als unser Suchwert ist. Wie viele Schritte sind das im Schnitt?
    Die Anzahl der Knoten, die wir auf einer Ebene überspringen, bevor wir einen finden, der auch auf der nächsthöheren Ebene existiert, folgt einer geometrischen Verteilung. Der Erwartungswert für die Anzahl der horizontalen Schritte pro Ebene ist eine Konstante, nämlich $1/p$.

Die Gesamtkosten für eine Suche sind daher das Produkt aus der Anzahl der Ebenen und den Schritten pro Ebene:
$$ \text{Erwartete Suchkosten} = O(\log n) \cdot O(1/p) = O(\log n) $$

Operationen wie Einfügen und Löschen haben dieselbe erwartete Laufzeit von $O(\log n)$, da sie primär aus einer Suche bestehen.

### Fazit

- **Vorteile:**
  - Im Durchschnitt sehr schnelle Operationen mit $O(\log n)$.
  - Deutlich einfachere Implementierung als balancierte Bäume (z.B. Rot-Schwarz-Bäume), da keine komplexen Balance-Operationen nötig sind.
- **Nachteile:**
  - Die Laufzeit ist probabilistisch. Im extrem unwahrscheinlichen schlimmsten Fall (Worst Case) entartet die Liste zu einer normalen verketteten Liste mit $O(n)$ Laufzeit.
  - Höherer Speicherverbrauch als eine einfache verkettete Liste durch die zusätzlichen Vorwärts-Zeiger.

---

## Alternative Analyse der Suchkomplexität (Rückwärtsanalyse)

Eine formalere Methode, die $O(\log n)$ Suchkomplexität zu beweisen, ist die **Rückwärtsanalyse**. Anstatt den Suchpfad von oben nach unten zu verfolgen, analysiert man den Pfad vom Zielknoten rückwärts und nach oben.

### Die Rekursive Idee

Man stellt sich die Frage: "Wie viele Schritte hat es im Schnitt gebraucht, um von ganz links oben zu einem bestimmten Knoten zu gelangen?"

- Sei $S_j$ die erwartete Anzahl an Schritten auf einem Suchpfad, der über **$j$ Ebenen** verläuft.
- $E(S_j)$ ist der Erwartungswert dafür.

Wenn wir uns auf dem Suchpfad rückwärts bewegen (also nach links), gibt es an jedem Knoten zwei Möglichkeiten (bei $p=1/2$):
1.  Mit Wahrscheinlichkeit $1/2$ hat der Knoten **keinen Turm nach oben**. Wir müssen weiter nach links auf derselben Ebene suchen.
2.  Mit Wahrscheinlichkeit $1/2$ hat der Knoten **einen Turm nach oben**. Wir können eine Ebene "hochklettern".

Ein Schritt nach links kostet immer eine Vergleichsoperation (`+1`). Daraus ergibt sich folgende Rekursionsgleichung für die erwarteten Gesamtkosten:

$$ E(S_j) = 1 + \frac{1}{2} E(S_j) + \frac{1}{2} E(S_{j-1}) $$

- Die `1` steht für den einen Schritt nach links.
- $\frac{1}{2} E(S_j)$ sind die erwarteten Restkosten, wenn wir **nicht** hochklettern können und das Problem der Größe $j$ bleibt.
- $\frac{1}{2} E(S_{j-1})$ sind die erwarteten Restkosten, wenn wir hochklettern und das Problem auf die Größe $j-1$ reduzieren.

### Auflösung der Rekurrenz

Diese Gleichung lässt sich algebraisch umformen:

$$ E(S_j) - \frac{1}{2} E(S_j) = 1 + \frac{1}{2} E(S_{j-1}) $$

$$ \frac{1}{2} E(S_j) = 1 + \frac{1}{2} E(S_{j-1}) $$

Multipliziert mit 2 ergibt sich die vereinfachte Beziehung:

$$ E(S_j) = 2 + E(S_{j-1}) $$

Dieses Ergebnis zeigt, dass jede zusätzliche Ebene die erwartete Gesamtzahl der Suchschritte um exakt 2 erhöht. Löst man diese Rekursion bis zur Basis $E(S_1)$ auf, erhält man:

$$ E(S_j) = 2(j-1) + E(S_1) $$

Da $E(S_1)$ eine Konstante ist, ist die erwartete Anzahl der Schritte linear zur Anzahl der Ebenen $j$, also $E(S_j) \in O(j)$.

### Endergebnis

Da wir bereits wissen, dass die Höhe $h$ (und somit die Anzahl der Ebenen $j$) im Erwartungswert logarithmisch ist ($h \in O(\log n)$), können wir schlussfolgern:

$$ E(S_h) \in O(h) \implies E(S_h) \in O(\log n) $$

Diese Analyse bestätigt also auf einem formaleren Weg das $O(\log n)$ Ergebnis für die Suchkomplexität.



# Indexierte Skipliste

Eine **Indexierte Skipliste** ist eine Erweiterung der normalen Skipliste. Der Kernunterschied besteht darin, dass jeder Vorwärtszeiger nicht nur auf den nächsten Knoten verweist, sondern zusätzlich eine Information über seine **"Spannweite"** (englisch: *span*) speichert.

> **Definition: Spannweite**
> Die Spannweite eines Zeigers gibt an, wie viele Knoten auf der untersten Ebene (Level 0) zwischen dem aktuellen Knoten und dem Zielknoten des Zeigers liegen.

Dies ermöglicht neue Operationen und verbessert die Effizienz bestehender.

### Beispiel einer Indexierten Skipliste (ASCII-Art)

Die Zahlen in `[Klammern]` geben die Spannweite des jeweiligen Zeigers an.

```
Level 3: (Kopf) --[8]------------------------------------------> (9)
            |
Level 2: (Kopf) --[5]---------------> (5) --[4]----------------> (9)
            |                          |                          |
Level 1: (Kopf) --[3]-----> (3)-[2]-> (5) --[2]--> (7) --[2]---> (9)
            |                |         |            |             |
Level 0: (Kopf) -> 1 -> 2 -> 3 -> 4 -> 5 ---> 6 --> 7 -> 8 -----> 9 -> NIL
```

*   **Beispiel-Lesart:** Der Zeiger vom `Kopf` zu Knoten `5` auf `Level 2` hat eine Spannweite von `4`, weil er die vier Knoten `1, 2, 3, 4` auf der untersten Ebene überspringt.

---

### Laufzeitanalyse und neue Operationen

Durch das Speichern der Spannweite ändern sich die Laufzeiten für bestimmte Operationen oder werden erst ermöglicht.

#### Zugriff auf das k-te Element (Rangsuche): `O(log n)`

Dies ist die wichtigste neue Operation. Eine normale Skipliste kann nicht effizient das k-te Element finden. Eine indexierte Skipliste kann dies in `O(log n)`.

**Algorithmus:**
1.  Starte am `Kopf` auf der höchsten Ebene. Halte einen Zähler `traversed = 0` für die bisher durchlaufenen Knoten.
2.  Betrachte den nächsten Zeiger auf der aktuellen Ebene. Sei seine Spannweite `span`.
3.  **Fall 1:** `traversed + span <= k`. Der Sprung zum nächsten Knoten bringt uns nicht über das Ziel hinaus.
    *   Folge dem Zeiger.
    *   Addiere seine Spannweite zum Zähler: `traversed = traversed + span`.
    *   Wiederhole Schritt 2 auf derselben Ebene.
4.  **Fall 2:** `traversed + span > k` (oder der Zeiger ist `NIL`). Der Sprung wäre zu weit.
    *   Gehe eine Ebene tiefer.
    *   Wiederhole Schritt 2.
5.  Der Algorithmus endet, wenn wir das k-te Element auf der untersten Ebene erreicht haben.

**Analyse:** Die Logik ist identisch zur normalen Suche. Man durchläuft `O(log n)` Ebenen und macht pro Ebene im Schnitt eine konstante Anzahl von Schritten. Die Gesamtlaufzeit ist daher **`O(log n)`**.

#### Vergleich
- liste => suche einmal über alle Elemente => O(n)
- array => suche (Binärsuche) => O(log n)
	   => jedoch hinzufügen / löschen O(n)
- indexierte skipliste => O(log n)

#### Bereichssuche [x, y]: `O(log n + k)`

Die Bereichssuche wird nicht schneller, aber ihre Analyse ist klar.
1.  **Suchen des Startpunkts:** Finde den ersten Wert `x` (oder den ersten Wert größer als `x`) in der Liste. Dies geschieht mit der normalen Suchmethode und dauert **`O(log n)`**.
2.  **Sammeln der Elemente:** Durchlaufe von der gefundenen Position aus die unterste Ebene (Level 0) Knoten für Knoten und sammle alle Werte, bis ein Element größer als `y` gefunden wird.
3.  Wenn sich `k` Elemente im Intervall `[x, y]` befinden, dauert dieser zweite Schritt **`O(k)`**.

Die Gesamtlaufzeit setzt sich aus beiden Schritten zusammen: **`O(log n + k)`**.


[[Tiefensuche]]