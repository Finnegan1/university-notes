# 2.4 Bootstrap

## 1. Definition & Herkunft
*   **Begriff:** Kommt von "to pull oneself up by one's bootstraps" (sich an den eigenen Stiefelriemen aus dem Sumpf ziehen – vgl. Baron Münchhausen).
*   **Bedeutung:** Ein komplexes System mit minimalen Mitteln aus eigener Kraft starten.
*   **In der Statistik:** Eine Methode, die **nur mit den vorliegenden Daten** arbeitet und **keine Annahmen** über die zugrundeliegende ("wahre") Verteilung macht.

## 2. Parametrische vs. Nicht-parametrische Verfahren

| Parametrische Methode | Bootstrap (Nicht-parametrisch) |
| :--- | :--- |
| 1. Annahme eines Verteilungstyps (z.B. Normal-, Exponentialverteilung) basierend auf Sachverhalt/Daten. | 1. **Keine** Festlegung auf einen Verteilungstyp. |
| 2. Schätzung der Parameter (z.B. $\mu, \sigma, \lambda$) aus den Daten. | 2. Verwendung der **empirischen Verteilungsfunktion** der Daten als Ausgangspunkt. |
| 3. Simulation/Berechnung basierend auf der theoretischen Verteilung. | 3. Simulation durch "Ziehen mit Zurücklegen" aus den Originaldaten. |

## 3. Funktionsweise
Beim Bootstrapping dient die **empirische Verteilung** $\hat{F}$ der Daten $x_1, \dots, x_n$ als Ersatz für die unbekannte wahre Verteilung.
*   Die empirische Verteilung ist eine Treppenfunktion mit Sprüngen der Höhe $1/n$ an den Stellen der beobachteten Werte.
*   Neue Daten werden generiert, indem man zufällig Werte aus der Menge der beobachteten Daten zieht.

## 4. Algorithmus (Ziehen mit Zurücklegen)
Um eine neue Zufallszahl $X^*$ mittels Bootstrap aus einem Datensatz der Größe $n$ zu erzeugen:

1.  Erzeuge eine gleichverteilte Zufallszahl $U \sim U(0,1)$.
2.  Berechne den Index $i = \lceil U \cdot n \rceil$ (Aufrunden).
    *   Dadurch wird zufällig einer der Indizes $1, \dots, n$ mit Wahrscheinlichkeit $1/n$ ausgewählt.
3.  Gib den Wert $x_i$ aus den Originaldaten aus.
4.  Wiederhole den Vorgang so oft wie benötigt.

> [!abstract] Intuitiv
> Man schreibt alle $n$ Datenwerte auf Zettel, wirft sie in einen Topf und zieht zufällig einen Zettel, notiert den Wert, und legt den Zettel **wieder zurück** (damit die Wahrscheinlichkeitsverteilung gleich bleibt).

## 5. Beispiel aus der Vorlesung (Wartezeiten)
Gegeben sind 1000 Beobachtungen von Wartezeiten zwischen Kundenankünften.

**Parametrischer Ansatz:**
*   Histogramm zeigt exponentiellen Abfall $\to$ Annahme: **Exponentialverteilung** ($Exp(\alpha)$).
*   Schätzung $\alpha$ über den Mittelwert der Daten ($\bar{x} = 2.91 \to \hat{\alpha} = 1/\bar{x} \approx 0.34$). 
*   Simulation durch Inversionsmethode mit $Exp(0.34)$.

**Bootstrap Ansatz:**
*   Verzicht auf Modellannahme.
*   Direktes Resampling (Ziehen mit Zurücklegen) aus den 1000 Messwerten.

**Ergebnis:** Beide Methoden lieferten im Beispiel sehr ähnliche Verläufe der kumulierten Verteilungsfunktion (siehe Abbildung im Skript), was den Bootstrap-Ansatz validiert, ohne dass man das Risiko einer falschen Modellannahme (z.B. falscher Verteilungstyp) eingeht.
