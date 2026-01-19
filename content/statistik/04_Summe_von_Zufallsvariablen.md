## 1. Summen von unabhängigen und identisch verteilten Zufallsvariablen (i.i.d.)

Betrachtet werden $n$ Zufallsvariablen $X_1, X_2, \dots, X_n$, die **unabhängig** und **identisch verteilt** (i.i.d.) sind.
Das bedeutet, alle $X_i$ haben denselben Erwartungswert $\mu$ und dieselbe Varianz $\sigma^2$.

> [!info] Notation und Variablen
> *   $X_i$: Einzelne Zufallsvariable (z.B. Ergebnis eines einzelnen Wurfs).
> *   $\mu = E[X_i]$: Erwartungswert der *Einzelvariable* (nicht der Summe!).
> *   $\sigma^2 = \text{Var}(X_i)$: Varianz der *Einzelvariable*.
> *   $S_n$: Summe aller Variablen ($X_1 + \dots + X_n$).
> *   $\overline{X}_n$: Durchschnittswert ($\frac{1}{n} S_n$).

Wir betrachten zwei Kennzahlen:

1.  **Summe**: $S_n = \sum_{i=1}^{n} X_i$
2.  **Arithmetisches Mittel**: $\overline{X}_n = \frac{1}{n} S_n = \frac{1}{n} \sum_{i=1}^{n} X_i$

Aufgrund der Linearität des Erwartungswerts und der Unabhängigkeit (für die Varianz) gelten die folgenden Zusammenhänge:

### Übersicht: Einzelwert vs. Summe vs. Durchschnitt

| Kennzahl                 | **Einzelwert** <br>($X_i$) | **Summe** ($S_n = \sum_{i=1}^n X_i$)                         | **Durchschnitt** <br>($\overline{X}_n = \frac{1}{n}\sum_{i=1}^n X_i$) |
| :----------------------- | :------------------------- | :----------------------------------------------------------- | :-------------------------------------------------------------------- |
| **Erwartungswert**       | $\mu$                      | $n \cdot \mu$                                                | $\mu$                                                                 |
| **Varianz** ($\sigma^2$) | $\sigma^2$                 | $n \cdot \sigma^2$ <br>*(Varianzen addieren sich!)*          | $\frac{\sigma^2}{n}$ <br>*(Streuung wird kleiner)*                    |
| **Std.Abw.** ($\sigma$)  | $\sigma$                   | $\sqrt{n} \cdot \sigma$ <br>*(Wächst, aber langsamer als n)* | $\frac{\sigma}{\sqrt{n}}$ <br>*(Standardfehler)*                      |

> [!tip] Wichtige Regel zum Rechnen
> Man rechnet fast immer mit der **Varianz** ($\sigma^2$), weil man sie einfach addieren kann ($n \cdot \sigma^2$).
> Erst ganz am Schluss zieht man die Wurzel, um die Standardabweichung für das Ergebnis zu bekommen (z.B. $\sqrt{n \cdot \sigma^2} = \sqrt{n} \cdot \sigma$).

### Gesetz der Großen Zahlen (GGZ)
Das Gesetz der großen Zahlen besagt, dass sich das arithmetische Mittel $\overline{X}_n$ mit wachsendem Stichprobenumfang $n$ dem theoretischen Erwartungswert $\mu$ annähert.

$$ \overline{X}_n \xrightarrow{n \to \infty} \mu $$

Intuitiv: Je öfter man ein Zufallsexperiment wiederholt, desto genauer entspricht der Durchschnitt der beobachteten Werte dem "wahren" Mittelwert.

---

## 2. Zentraler Grenzwertsatz (ZGWS)

Der Zentrale Grenzwertsatz ist eines der wichtigsten Resultate der Statistik. Er besagt, dass die Verteilung der Summe (oder des Mittels) von unabhängigen, identisch verteilten Zufallsvariablen mit wachsendem $n$ gegen eine **Standardnormalverteilung** konvergiert – **völlig unabhängig davon, wie die ursprünglichen $X_i$ verteilt sind!**

> [!important] Satz (ZGWS)
> Die standardisierte Summe $Z_n$ konvergiert gegen die Standardnormalverteilung $\Phi(z)$:
>
> $$ Z_n := \frac{S_n - n \cdot \mu}{\sqrt{n} \cdot \sigma} = \frac{\overline{X}_n - \mu}{\sigma}\sqrt{n} \xrightarrow{n \to \infty} N(0, 1) $$

**Praktische Konsequenz (Approximation):**
Für "große" $n$ (Faustregel oft $n \ge 30$) können wir die Verteilungen von $\overline{X}_{n} \text{ sowie } S_{n}$ approximieren:


**Summe**:
- Verteilung:
	- $S_n \approx N(n \cdot \mu, n \cdot \sigma^2)$
	- (denn $E(S_n) = n \cdot \mu$, $\text{var}(S_n) = n \cdot \sigma^2$)
- Formeln für Wahrscheinlichkeiten:
	- $P(a < S_n \le b) = \Phi\left(\frac{b - n\mu}{\sqrt{n}\sigma}\right) - \Phi\left(\frac{a - n\mu}{\sqrt{n}\sigma}\right)$

**Mittelwert**:
- Verteilung:
	- $\overline{X}_n \approx N\left(\mu, \frac{\sigma^2}{n}\right)$
	- (denn $E(\overline{X}_n) = \mu$, $\text{var}(\overline{X}_n) = \frac{\sigma^2}{n}$)
- Formeln für Wahrscheinlichkeiten:
	- $P(a < \overline{X}_n \le b) = \Phi\left(\frac{b - \mu}{\sigma}\sqrt{n}\right) - \Phi\left(\frac{a - \mu}{\sigma}\sqrt{n}\right)$


### Visualisierung: ZGWS
Das folgende Diagramm zeigt, wie sich die Verteilung der Summe von Würfelwürfen (Gleichverteilung) der Normalverteilung annähert, wenn $n$ steigt.

```dataviewjs
// Visualisierung Zentraler Grenzwertsatz
// Summe von n uniform verteilten ZV (Würfeln) nähert sich Normalverteilung

const n_dice = 3; // Anzahl der Würfel
// Bei n=1: Gleichverteilung 1..6
// Bei n=2: Dreiecksverteilung 2..12
// Bei n=3: Glockenähnlich 3..18

// Funktion zur Berechnung der exakten Wahrscheinlichkeiten für Würfelsummen (rekursiv/Faltung)
function getDiceSumProb(n, sides) {
    let probs = new Map();
    probs.set(0, 1);

    for (let i = 0; i < n; i++) {
        let newProbs = new Map();
        for (let [sum, p] of probs) {
            for (let face = 1; face <= sides; face++) {
                let currentSum = sum + face;
                let currentP = newProbs.get(currentSum) || 0;
                newProbs.set(currentSum, currentP + p / sides);
            }
        }
        probs = newProbs;
    }
    return probs;
}

const sides = 6;
const dist = getDiceSumProb(n_dice, sides);
const x_vals = Array.from(dist.keys()).sort((a, b) => a - b);
const y_vals = x_vals.map(k => dist.get(k));

// Normalverteilungs-Approximation
const mu = 3.5;
const sigma = Math.sqrt(35/12); // Varianz eines Würfels
const mu_sum = n_dice * mu;
const sigma_sum = Math.sqrt(n_dice * (35/12));

const x_norm = [];
const y_norm = [];
for (let i = x_vals[0]; i <= x_vals[x_vals.length-1]; i += 0.1) {
    x_norm.push(i);
    y_norm.push(
        (1 / (sigma_sum * Math.sqrt(2 * Math.PI))) * 
        Math.exp(-0.5 * Math.pow((i - mu_sum) / sigma_sum, 2))
    );
}

const data = [
    {
        x: x_vals,
        y: y_vals,
        type: 'bar',
        name: `Summe von ${n_dice} Würfeln`,
        marker: { color: '#673AB7' }
    },
    {
        x: x_norm,
        y: y_norm,
        type: 'scatter',
        mode: 'lines',
        name: 'Normalverteilung (Approx)',
        line: { color: '#E91E63', width: 3 }
    }
];

const layout = {
    title: { text: `ZGWS: Summe von ${n_dice} Würfeln vs. Normalverteilung` },
    xaxis: { title: { text: 'Summe' } },
    yaxis: { title: { text: 'Wahrscheinlichkeit' } },
    margin: { t: 40, b: 40, l: 50, r: 20 },
    height: 350,
    showlegend: true
};

if (typeof window.renderPlotly === 'function') {
    window.renderPlotly(this.container, data, layout, {displaylogo: false});
} else {
    dv.paragraph("Plotly Plugin nicht aktiv.");
}
```

---

## 3. Spezialfall: Satz von Moivre-Laplace
(Approximation der Binomialverteilung)

Da die Binomialverteilung $B(n, p)$ als Summe von $n$ Bernoulli-verteilten Zufallsvariablen ($X_i \in \{0, 1\}$) aufgefasst werden kann, gilt auch hier der ZGWS.

Wenn $n$ groß genug ist, gilt:
$$ B(n, p) \approx N(\mu, \sigma^2) $$
mit $\mu = n \cdot p$ und $\sigma^2 = n \cdot p \cdot (1-p)$.

> [!check] Faustregel
> Die Approximation ist gut genug, wenn die Varianz $\sigma^2$ groß genug ist:
> $$ n \cdot p \cdot (1-p) \ge 9 $$

### Stetigkeitskorrektur
Da wir eine diskrete Verteilung (Balken / Verteilungsfunktion als Stufen) durch eine stetige Kurve approximieren, verbessern wir die Genauigkeit, indem wir die Integrationsgrenzen um $0.5$ nach rechts verschieben ("halbe Balkenbreite"). Dadurch geht die Funktion nicht durch die Mitte der Treppenstufen, sondern liegen die Sprungstellen auf der Approximationsfunktion

$$ P(a < S_n \le b) \approx \Phi\left(\frac{b + 0.5 - \mu}{\sigma}\right) - \Phi\left(\frac{a + 0.5 - \mu}{\sigma}\right) $$
*(Hinweis: Achte genau auf $<$ vs $\le$. Bei diskreten ZV ist $P(X \le k)$ relevant, also wird bis $k+0.5$ integriert. Bei $P(X < k)$ (= $P(X \le k-1)$) bis $k-0.5$.)*

---

## 4. Summen spezieller Verteilungen

In einigen Fällen ist die Verteilung der Summe (von i.i.d Zufallsvariablen) exakt bekannt (ohne Approximation, auch für kleine n):

1.  **Summe von Normalverteilungen**:
    Sind $X_i \sim N(\mu, \sigma^2)$ unabhängig, so ist auch die Summe exakt normalverteilt:
    $$ S_n \sim N(n\mu, n\sigma^2) $$

2.  **Summe von Binomialverteilungen** (bei gleichem $p$):
    Sind $X_i \sim B(k_{i}, p)$ unabhängig, so addieren sich die Versuchszahlen:
    $$ (S_{n} = \sum X_i) \sim B\left(\sum_{i=1}^n (k_i), p\right) $$
    *(Dies gilt intuitiv: Ob ich $n$ mal eine Münze werfe und Treffer zähle, oder $n$ einzelne Münzwurf-Experimente addiere, ist das gleiche.)*
    