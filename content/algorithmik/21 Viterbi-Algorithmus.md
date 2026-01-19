---
tags:
  - Algorithmik
  - zusammenfassung
---

# Markov-Kette und Hidden Markov Modell (HMM)

## Markov-Kette

Eine Markov-Kette ist ein stochastischer Prozess, der durch Zustände (z) und Übergangswahrscheinlichkeiten $p(z|z')$ beschrieben wird.

## Hidden-Markov-Modell (HMM)

Ein Hidden-Markov-Modell (HMM) ist eine Markov-Kette, die in jedem Zustand z ein Zeichen a mit einer Emissionswahrscheinlichkeit $p(a|z)$ ausgibt.

**Charakterisiert durch:**
- **Startwahrscheinlichkeit** $p(z)$ für jeden Zustand z
- **Übergangswahrscheinlichkeit** $p(z|z')$ zwischen zwei Zuständen (von $z' \rightarrow z$)
- **Emissionswahrscheinlichkeit** $p(a|z)$ für die Ausgabe a im Zustand z

> [!example]- Beispiele für HMMs
> - **DNA-Sequenzen:** Die Zustände sind die Nukleotide A, C, G, T
> - **Gesprochene Sprache:** Die Zustände sind die Phoneme
> - **Nachrichtenübertragung durch ein Kanal:** Die verborgenen Zustände sind die gesendeten Zeichen, die empfangenen Zeichen die Ausgabe des HMM

# Viterbi-Algorithmus

## Ziel des Viterbi-Algorithmus:
- Rekonstruktion der wahrscheinlichsten Zufallsfolge für einen HMM aus seiner Ausgabe
- Für eine Folge $a_{1}, \dots, a_{n}$ von Augabezeichen suchen wir eine Folge von Zuständen $z_{1}, \dots, z_{n}$ , sodass $p(z_{1}, \dots, z_{n} | a_{1}, \dots, a_{n})$ maximal ist.

> [!note]- 📖 Erklärung der Notation $p(z_{1}, \dots, z_{n} | a_{1}, \dots, a_{n})$
> **Wie liest man das?**
>
> Wörtlich: "Die Wahrscheinlichkeit für die Zustandsfolge $z_{1}, \dots, z_{n}$, **gegeben** die Ausgabefolge $a_{1}, \dots, a_{n}$"
>
> **Was bedeutet der Strich "|"?**
>
> Der Strich "|" bedeutet **"gegeben"** oder **"unter der Bedingung"**.
>
> Die Formel bedeutet:
> - **Links vom Strich:** Was wir herausfinden wollen (die versteckten Zustände)
> - **Rechts vom Strich:** Was wir bereits wissen (die beobachteten Ausgaben)
>
> **Konkret für den Viterbi-Algorithmus:**
>
> Situation:
> - Du **beobachtest** eine Folge von Zeichen: $a_1, a_2, a_3, \ldots, a_n$
> - Du **kennst NICHT** die Zustände, die diese Zeichen produziert haben
> - Du **willst herausfinden:** Welche Zustandsfolge $z_1, z_2, z_3, \ldots, z_n$ hat am wahrscheinlichsten zu diesen Beobachtungen geführt?
>
> Die Frage in der Wahrscheinlichkeitsnotation:
> $$p(z_1, \ldots, z_n | a_1, \ldots, a_n)$$
>
> bedeutet: "Wie wahrscheinlich ist die Zustandsfolge $z_1, \ldots, z_n$, **wenn wir bereits wissen**, dass die Ausgaben $a_1, \ldots, a_n$ sind?"

## Anwendung:
- Nachrichtenübertragung durch ein Kabel
- codierende Regionen der DNA
- Spracherkennung (Mustererkennung der Frequenz => Phoneme über HMM ermitteln)

## Vorgehen und mathematischer Hintergrund

Das Kernprinzip basiert auf dem Satz von Bayes, der die bedingte Wahrscheinlichkeit beschreibt:

$$p(z_1, \ldots, z_n | a_1, \ldots, a_n) = \frac{p(z_1, \ldots, z_n, a_1, \ldots, a_n)}{p(a_1, \ldots, a_n)}$$

Um das Vorgehen des Algorithmus zu verstehen, zerlegen wir diese Formel in ihre Komponenten.

> [!NOTE]- Zähler: Die gemeinsame Wahrscheinlichkeit $p(Z, A)$
> Der Zähler $p(z_1, \ldots, z_n, a_1, \ldots, a_n)$ ist die Wahrscheinlichkeit, dass eine *bestimmte Zustandssequenz* $Z$ und eine *bestimmte Beobachtungssequenz* $A$ gemeinsam auftreten. Man berechnet sie, indem man die Wahrscheinlichkeiten entlang eines einzigen Pfades multipliziert.
> 
> $$p(Z, A) = \underbrace{p(z_1)}_{\text{Start}} \cdot \underbrace{p(a_1|z_1)}_{\text{Emission}} \cdot \underbrace{p(z_2|z_1)}_{\text{Übergang}} \cdot \underbrace{p(a_2|z_2)}_{\text{Emission}} \cdot \ldots$$
>
> Allgemein als Produktformel:
> $$p(Z, A) = p(z_1) \cdot \left( \prod_{i=2}^{n} p(z_i | z_{i-1}) \right) \cdot \left( \prod_{i=1}^{n} p(a_i | z_i) \right)$$
> 
> Dies ist der Wert, den der Viterbi-Algorithmus zu maximieren versucht.

> [!NOTE]- Nenner: Die Beobachtungswahrscheinlichkeit (Evidenz) $p(A)$
> Der Nenner $p(a_1, \ldots, a_n)$ ist die Gesamtwahrscheinlichkeit der Beobachtungssequenz $A$, summiert über *alle möglichen* versteckten Zustandssequenzen $Z$:
> 
> $$p(A) = \sum_{\text{alle möglichen } Z} p(Z, A)$$
> 
> **Problem:** Die direkte Berechnung ist extrem aufwändig, da die Anzahl der Pfade exponentiell wächst ($K^n$ bei $K$ Zuständen).
> **Lösung:** In der Praxis wird hierfür der **Forward-Algorithmus** verwendet, der $p(A)$ effizient mittels dynamischer Programmierung berechnet.

> [!IMPORTANT] Verbindung zum Viterbi-Algorithmus: Maximierung statt Berechnung
> Der Viterbi-Algorithmus berechnet nicht die exakte Wahrscheinlichkeit $p(Z|A)$ für alle Pfade. Sein Ziel ist es, **den wahrscheinlichsten Pfad** $Z^*$ zu finden.
>
> $$ Z^* = \underset{Z}{\operatorname{argmax}} \, p(Z | A) = \underset{Z}{\operatorname{argmax}} \, \frac{p(Z, A)}{p(A)} $$
>
> **Der Trick:** Da der Nenner $p(A)$ für eine gegebene Beobachtung konstant ist und nicht von der Zustandsfolge $Z$ abhängt, beeinflusst er nicht, *welcher* Pfad der wahrscheinlichste ist. Wir können ihn bei der Maximierung also ignorieren.
>
> Das Problem vereinfacht sich zu:
> $$ Z^* = \underset{Z}{\operatorname{argmax}} \, p(Z, A) $$
>
> Der Viterbi-Algorithmus ist somit ein effizientes Verfahren (basierend auf dynamischer Programmierung), um den Pfad $Z^*$ zu finden, der die **gemeinsame Wahrscheinlichkeit** (den Zähler) maximiert. Ein naiver Ansatz, alle Pfade zu prüfen, hätte eine exponentielle Laufzeit und wäre unpraktikabel.

## Dynamic Programming Lösung

### Problemstellung

Alle möglichen Zustandsfolgen durchzuprobieren hätte **exponentielle Laufzeit** ($|Z|^n$ mögliche Pfade). Die Lösung: **Dynamic Programming**

### Definition der DP-Zustandsgröße

Wir definieren:

$$t(z,k) := \max_{z_1,\dots,z_{k-1}} p(z_1,\dots,z_{k-1},z,a_1,\dots,a_k)$$

**Bedeutung:** Die maximale Wahrscheinlichkeit aller Pfade, die bei Zeit k im Zustand z enden und die Ausgaben $a_1,\dots,a_k$ erklären.

> [!tip] Kernidee
> Wir merken uns für jeden Zeitpunkt k und jeden Zustand z nur den **besten Weg dorthin**, weil ein nicht-optimaler Teilpfad niemals Teil eines optimalen Gesamtpfades sein kann (Optimalitätsprinzip).

### Rekursionsformel (Bellman-Gleichung)

Betrachte den letzten Schritt eines optimalen Pfades, der in Zustand z zur Zeit k endet:
- Der Pfad muss aus irgendeinem Zustand $z'$ zur Zeit $k-1$ kommen
- Danach:
  - Übergang $z' \to z$ mit Wahrscheinlichkeit $p(z|z')$
  - Emission $a_k$ aus Zustand z mit Wahrscheinlichkeit $p(a_k|z)$

Damit gilt:

$$
t(z,k) = \begin{cases}
p(z) \cdot p(a_1|z) & \text{für } k=1 \\
p(a_k|z) \cdot \max_{z'}\left[ t(z',k-1) \cdot p(z|z') \right] & \text{für } k>1
\end{cases}
$$

**Anfangsbedingung (k=1):** Für das erste Symbol gibt es noch keinen Vorgänger, daher:
$$t(z,1) = p(z) \cdot p(a_1|z)$$

**Rekursionsschritt (k>1):** Wähle den Vorgängerzustand $z'$, der das Maximum liefert:
$$t(z,k) = p(a_k|z) \cdot \max_{z'}\left[ t(z',k-1) \cdot p(z|z') \right]$$

> [!example]- Grafische Darstellung der Rekursion
> ```
>     t(z,k)
>        ┌─────────────┐
>        │      ○      │  ← Zustand z zur Zeit k
>        │    p(a_k|z) │
>        │      │      │
>        │   ┌──┴──┐   │
>     z'₁│  ○      │   │  ← mögliche Vorgängerzustände
>        │  │ p(z|z'₁)│
>     z'₂│  ○      │   │
>        │  │ p(z|z'₂)│
>        └──┴──────┴───┘
>          t(z',k-1)
> ```
> Wir wählen den Vorgänger $z'$, der $t(z',k-1) \cdot p(z|z')$ maximiert.

### Backtracking: Rekonstruktion der Zustandsfolge

Um den wahrscheinlichsten Pfad zu finden, gehen wir vom Ende ($t=n$) rückwärts bis zum Start ($t=1$).

**Schritt 1: Besten Endzustand finden**
Wir wählen den Zustand mit der höchsten Wahrscheinlichkeit in der letzten Spalte:
$$z_n^* = \underset{z}{\operatorname{argmax}} \, t(z,n)$$

**Schritt 2: Rückwärts iterieren**
Für jeden Zeitschritt $k = n, \dots, 2$ bestimmen wir den Vorgänger $z_{k-1}^*$, der zum aktuellen Zustand $z_k^*$ geführt hat.

Dazu gibt es zwei Möglichkeiten:

#### A) Mit gespeicherten Zeigern (Backpointer)
Falls während der Berechnung gespeichert wurde, welcher Vorgänger das Maximum geliefert hat, folgen wir einfach diesen Zeigern zurück.

#### B) Rechnerisch (ohne Zeiger)
Falls nur die Tabelle $t(z, k)$ vorliegt, berechnen wir den Vorgänger erneut, indem wir prüfen, welcher Übergang das Maximum erzeugt:

$$z_{k-1}^* = \underset{z'}{\operatorname{argmax}} \left[ t(z', k-1) \cdot p(z_k^* | z') \right]$$

Hierbei ist:
- $z_k^*$: Der bereits ermittelte optimale Zustand zum Zeitpunkt $k$.
- $t(z', k-1)$: Der Tabellenwert des möglichen Vorgängers $z'$ zum Zeitpunkt $k-1$.
- $p(z_k^* | z')$: Die Übergangswahrscheinlichkeit von $z'$ nach $z_k^*$.

> [!example] Beispiel zur rechnerischen Bestimmung
> Angenommen, der optimale Zustand bei $t=3$ ist **Regen** ($z_3^* = \text{Regen}$). Wir suchen den Vorgänger bei $t=2$.
>
> Wir berechnen für jeden möglichen Vorgänger $z'$ den Wert:
> $$ \text{Score}(z') = \text{Tabellenwert}(z', 2) \cdot p(\text{Regen} | z') $$
>
> Der Zustand $z'$, der den höchsten Score liefert, ist der gesuchte Vorgänger $z_{2}^*$.
> *Hinweis: Die Emissionswahrscheinlichkeit $p(a_k | z_k^*)$ wird hier nicht benötigt, da sie ein konstanter Faktor ist und das Maximum bezüglich $z'$ nicht beeinflusst.*

### Laufzeitanalyse

- **Zustände:** $|Z|$
- **Zeitpunkte:** $n$
- **Pro DP-Zelle:** Maximum über $|Z|$ Vorgänger berechnen

**Gesamtlaufzeit:** $O(n \cdot |Z|^2)$

**Speicherplatz:** $O(n \cdot |Z|)$ für die DP-Tabelle

> [!success] Effizienzgewinn
> - **Naive Lösung:** $O(|Z|^n)$ – exponentielle Laufzeit
> - **Viterbi-Algorithmus:** $O(n \cdot |Z|^2)$ – polynomielle Laufzeit

### Numerisches Problem und Lösung

> [!warning] Problem: Numerischer Unterlauf
> Bei vielen Multiplikationen kleiner Wahrscheinlichkeiten (z.B. $0.01 \times 0.01 \times \ldots$) entstehen extrem kleine Zahlen, die zu Unterlauf führen können.

**Lösung: Rechnen im Log-Raum**

Statt $t(z,k)$ speichern wir $\log t(z,k)$:

$$
\log t(z,k) = \log p(a_k|z) + \max_{z'}\left[\log t(z',k-1) + \log p(z|z')\right]
$$

**Vorteile:**
- Multiplikationen → Additionen ✅
- Kein numerischer Unterlauf ✅
- Das Maximum bleibt erhalten (Logarithmus ist monoton steigend)


[[Viterbi-Training]] 

