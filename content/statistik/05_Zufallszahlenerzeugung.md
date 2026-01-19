
Dabei wird meist zweistufig vorgegangen:
1. Erzeugung von **gleichverteilten** Zufallszahlen $U \sim U(0,1)$.
2. Transformation dieser Zahlen in die **gewünschte Verteilung** (diskret oder stetig).

## 1. Erzeugung von $U(0,1)$-Zufallszahlen

Es gibt zwei grundlegende Ansätze:

1.  **Physikalische Methoden** (Echter Zufall)
    *   Messung physikalischer Phänomene (z.B. radioaktiver Zerfall, Rauschen in Halbleitern).
    *   *Nachteil*: Langsam, nicht reproduzierbar (erschwert Debugging).
2.  **Algorithmische Methoden** (Pseudo-Zufallszahlen)
    *   Verwendung von **Pseudo-Zufallszahlen-Generatoren (PRNG)**.
    *   Deterministische Algorithmen, die Zahlenfolgen erzeugen, die *wie* Zufall aussehen.
    *   Startwert: **Saat (Seed)**. Gleicher Seed $\to$ Gleiche Zahlenfolge (Reproduzierbarkeit!).

### Anforderungen an PRNGs
Da die Zahlen nicht wirklich zufällig sind, müssen sie statistische Tests bestehen:
*   **Gleichverteilung**: Die Zahlen müssen das Intervall $(0,1)$ gleichmäßig füllen (Test: Histogramm, $\chi^2$-Test).
*   **Unabhängigkeit**: Keine erkennbaren Muster oder Korrelationen zwischen aufeinanderfolgenden Zahlen (Test: Streudiagramm, Autokorrelation).
*   **Lange Periode**: Die Zahlenfolge wiederholt sich zwangsläufig irgendwann. Die Periode sollte für die Simulation ausreichend lang sein.

> [!example] Beispiel: Linearer Kongruenzgenerator
> Eine klassische (aber heute oft veraltete) Methode:
> $$ X_{n+1} = (a \cdot X_n + c) \mod m $$
> $$ U_{n+1} = \frac{X_{n+1}}{m} $$
> Bei schlechter Wahl der Parameter ($a, c, m$) entstehen im Streudiagramm von $(U_i, U_{i+1})$ sichtbare Gitterstrukturen (siehe Visualisierung unten).

### Visualisierung: Zufallsqualität
Das folgende Diagramm vergleicht einen "schlechten" Generator (mit kleiner Periode und Musterbildung) mit einem modernen Standard-Generator.

```dataviewjs
// Visualisierung: Schlechter LCG vs. Math.random() (Guter PRNG)
// LCG Parameter inspiriert aus Vorlesung Bsp 2.1.3: m=256, a=137, c=1
// Wir plotten Paare (U_i, U_{i+1}) um Muster zu erkennen

const n_points = 400;

// 1. Schlechter LCG
const m = 256;
const a = 137;
const c = 1;
let x = 1; // seed
const lcg_x = [];
const lcg_y = [];

for (let i = 0; i < n_points; i++) {
    let u_prev = x / m;
    x = (a * x + c) % m;
    let u_next = x / m;
    
    lcg_x.push(u_prev);
    lcg_y.push(u_next);
}

// 2. Guter PRNG (Javascript Math.random)
const js_x = [];
const js_y = [];
for (let i = 0; i < n_points; i++) {
    js_x.push(Math.random());
    js_y.push(Math.random()); // Hinweis: Im echten Streudiagramm würde man U_i vs U_i+1 plotten, hier vereinfacht zwei unabhängige Calls, was bei Math.random aufs gleiche hinausläuft
}

const data = [
    {
        x: lcg_x,
        y: lcg_y,
        mode: 'markers',
        type: 'scatter',
        name: 'Schlechter LCG (Muster!)',
        marker: { size: 6, color: '#E91E63' },
        xaxis: 'x',
        yaxis: 'y'
    },
    {
        x: js_x,
        y: js_y,
        mode: 'markers',
        type: 'scatter',
        name: 'Guter PRNG (Rauschen)',
        marker: { size: 6, color: '#2196F3' },
        xaxis: 'x2',
        yaxis: 'y2'
    }
];

const layout = {
    title: { text: 'Qualitätscheck: Streudiagramm (U_i vs U_{i+1})' },
    grid: {rows: 1, columns: 2, pattern: 'independent'},
    xaxis: { title: { text: 'U_i' }, range: [0, 1] },
    yaxis: { title: { text: 'U_{i+1}' }, range: [0, 1] },
    xaxis2: { title: { text: 'U_i' }, range: [0, 1] },
    yaxis2: { title: { text: 'U_{i+1}' }, range: [0, 1] },
    margin: { t: 50, b: 50, l: 50, r: 20 },
    height: 350,
    showlegend: true,
    legend: { x: 0.5, xanchor: 'center', y: -0.2, orientation: 'h' }
};

if (typeof window.renderPlotly === 'function') {
    window.renderPlotly(this.container, data, layout, {displaylogo: false});
} else {
    dv.paragraph("Plotly Plugin nicht aktiv.");
}
```


## 2. Erzeugung diskreter Zufallszahlen

Gegeben sei eine diskrete Verteilung mit Werten $x_0, x_1, \dots$ und Wahrscheinlichkeiten $p_k = P(X=x_k)$.
Wir wollen aus $U \sim U(0,1)$ eine Zahl $X$ erzeugen, die dieser Verteilung folgt.

### Methode: Intervallzerlegung (Inversion)
Wir zerlegen das Einheitsintervall $(0,1)$ in Teilintervalle der Längen $p_k$.
Die Grenzen der Intervalle sind die **kumulierten Wahrscheinlichkeiten** $s_k$:
$$ s_k = \sum_{i=0}^k p_i = P(X \le x_k) $$

**Algorithmus:**
1.  Erzeuge $U \sim U(0,1)$.
2.  Suche das Intervall $k$, in das $U$ fällt:
    $$ s_{k-1} < U \le s_k \quad (\text{mit } s_{-1} = 0) $$
3.  Ausgabe: $X = x_k$.

> [!tip] Laufzeit-Optimierung
> Um das passende Intervall schneller zu finden, sollten die Werte **nach Wahrscheinlichkeit absteigend sortiert** werden.
> *   Häufige Werte stehen am Anfang der Liste $\to$ Weniger Vergleiche im Durchschnitt.
> *   Erwartete Anzahl Vergleiche: $E[\text{Steps}] = E[X] + 1$ (bei Indizes $0, 1, \dots$).

---\n

## 3. Erzeugung stetiger Zufallszahlen

Für stetige Verteilungen gibt es drei Hauptmethoden.

### 3.1 Inversionsmethode
Nutzt die Verteilungsfunktion $F(x)$, um $U(0,1)$ direkt in $X$ umzurechnen.

> [!important] Satz (Inversionsmethode)
> Ist $U \sim U(0,1)$ und $F$ eine invertierbare Verteilungsfunktion, dann ist die Zufallsvariable
> $$ X = F^{-1}(U) $$
> exakt $F$-verteilt.

Voraussetzung: Die Umkehrfunktion $F^{-1}$ (Quantilfunktion) muss bekannt und berechenbar sein.
**Beispiel:** Exponentialverteilung
*   $F(x) = 1 - e^{-\lambda x}$
*   $F^{-1}(u) = -\frac{1}{\lambda} \ln(1-u)$
*   Da $1-U$ ebenfalls $U(0,1)$-verteilt ist, rechnet man oft einfach: $X = -\frac{1}{\lambda} \ln(U)$.

### 3.2 Annahme-Verwerfungs-Methode (Acceptance-Rejection)
Wird verwendet, wenn $F^{-1}$ schwer zu berechnen ist.
**Idee:** Wir simulieren eine einfachere Dichte $g(x)$ (von der wir gut Zahlen erzeugen können) und "korrigieren" die Häufigkeit durch zufälliges Verwerfen.

**Gegeben:**
*   Ziel-Dichte $f(x)$.
*   Hilfs-Dichte $g(x)$ (leicht zu simulieren).
*   Konstante $c \ge 1$, sodass $c \cdot g(x) \ge f(x)$ für alle $x$ (**Majorante**).

**Algorithmus:**
1.  Erzeuge $Y$ aus der Verteilung mit Dichte $g$.
2.  Erzeuge $U \sim U(0,1)$ (unabhängig).
3.  **Akzeptanz-Test:**
    *   Falls $U \le \frac{f(Y)}{c \cdot g(Y)}$, **akzeptiere** $X = Y$.
    *   Sonst **verwerfe** $Y$ und beginne wieder bei 1.

*   Die Fläche unter der Kurve $c \cdot g(x)$ wird quasi mit Punkten "berechnet". Nur Punkte, die unterhalb von $f(x)$ liegen, werden behalten.
*   **Effizienz:** Die Wahrscheinlichkeit, einen Wert zu akzeptieren, ist $1/c$. $c$ sollte also möglichst klein (nahe 1) sein.

### 3.3 Box-Muller-Methode (für Normalverteilung)
Spezialverfahren zur Erzeugung von standardnormalverteilten Zufallszahlen $N(0,1)$. Die Inversionsmethode ist hier schwierig, da $\Phi^{-1}$ keine geschlossene Formel hat.

Der Box-Muller-Algorithmus transformiert **zwei** unabhängige $U(0,1)$-Zahlen ($U, V$) in **zwei** unabhängige $N(0,1)$-Zahlen ($Z_1, Z_2$).

**Formel:**
$$ Z_1 = \sqrt{-2 \ln U} \cdot \cos(2\pi V) $$
$$ Z_2 = \sqrt{-2 \ln U} \cdot \sin(2\pi V) $$

Für eine beliebige Normalverteilung $N(\mu, \sigma^2)$ transformiert man anschließend:
$$ X = Z_1 \cdot \sigma + \mu $$

> [!info] Marsaglia-Polar-Methode
> Eine Optimierung der Box-Muller-Methode, die die rechenintensiven trigonometrischen Funktionen ($\sin, \cos$) vermeidet, indem Punkte im Einheitskreis generiert werden.