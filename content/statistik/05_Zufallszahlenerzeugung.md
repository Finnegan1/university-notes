
Dabei wird meist zweistufig vorgegangen:
1. Erzeugung von **gleichverteilten** Zufallszahlen $U \sim U(0,1)$.
2. Transformation dieser Zahlen in die **gewünschte Verteilung** (diskret oder stetig).

## 1. Erzeugung von $U(0,1)$-Zufallszahlen

Es gibt zwei grundlegende Ansätze:

1.  **Physikalische Methoden** (Echter Zufall)
    *  Messung physikalischer Phänomene (z.B. radioaktiver Zerfall, Rauschen in Halbleitern).
    *  *Nachteil*: Langsam, nicht reproduzierbar (erschwert Debugging).
2.  **Algorithmische Methoden** (Pseudo-Zufallszahlen)
    *  Verwendung von **Pseudo-Zufallszahlen-Generatoren (PRNG)**.
    *  Deterministische Algorithmen, die Zahlenfolgen erzeugen, die *wie* Zufall aussehen.
    *  Startwert: **Saat (Seed)**. Gleicher Seed $\to$ Gleiche Zahlenfolge (Reproduzierbarkeit!).
    * $X_{n} = h(X_{n-1}, X_{n-2}, \dots, H_{n-k}), \; n > k$

### Anforderungen und Tests für PRNGs
Da PRNGs deterministisch arbeiten (und somit periodisch sind), sind die Zahlen nicht *wirklich* zufällig. Ihre Qualität muss daher durch statistische Tests auf **Gleichverteilung** und **Unabhängigkeit** geprüft werden.

#### 1. Gleichverteilung (Uniformity)
Die erzeugten Zahlen $U_1, \dots, U_n$ müssen das Intervall $(0,1)$ gleichmäßig abdecken.

*   **Visueller Test (Histogramm):**
    Man teilt das Intervall $(0,1)$ in $k$ gleich große Klassen ("Bins") ein und zählt die Häufigkeit der Zahlen pro Klasse.
    $\to$ **Ziel:** Alle Balken sollten ungefähr gleich hoch sein (Höhe $\approx n/k$).

*   **Statistischer Test ($\chi^2$-Anpassungstest):**
    Prüft signifikante Abweichungen der beobachteten Häufigkeiten $N_j$ von den erwarteten Häufigkeiten $E_j = n/k$.
    $$ \chi^2 = \sum_{j=1}^{k} \frac{(N_j - E_j)^2}{E_j} $$
    Ist der $\chi^2$-Wert zu hoch (größer als das Quantil der $\chi^2$-Verteilung), wird die Hypothese der Gleichverteilung verworfen.

#### 2. Unabhängigkeit (Independence)
Die Folge $U_1, U_2, \dots$ darf keine erkennbaren Muster oder Abhängigkeiten aufweisen ($U_{i+1}$ darf nicht aus $U_i$ vorhersagbar sein).

*   **Visueller Test (Streudiagramm / Scatterplot):**
    Man plottet Paare $(U_i, U_{i+1})$ als Punkte in einem Einheitsquadrat.
    $\to$ **Ziel:** Eine strukturlose "Punktewolke".
    $\to$ **Fehlerbild:** Erkennbare Gitterstrukturen, Linien oder Cluster (typisch für schlechte Generatoren, siehe Beispiel unten).
    *Erweiterung:* Betrachtung von Tupeln $(U_i, U_{i+k})$ für größere Abstände ("Lags") $k$.

*   **Autokorrelationsfunktion:**
    Misst die lineare Abhängigkeit zwischen Werten mit Abstand $k$ ("Lag").
    $$ \gamma(k) := \text{cov}(U_1, U_{1+k}) \approx \frac{1}{n} \sum (U_i - \overline{U})(U_{i+k} - \overline{U}) $$
    $\to$ **Ziel:** Die Autokorrelation $\gamma(k)$ sollte für alle $k \ge 1$ nahe 0 liegen (innerhalb der Signifikanzschwellen).

*   **Run-Tests:**
    Untersuchen die Häufigkeit von monotonen Teilfolgen ("Runs" up/down) oder Mustern ("Wörtern").
    *Beispiel:* Ist die Abfolge "groß - klein - groß" so häufig wie erwartet?
    Prüft auf subtilere Abhängigkeiten, die Korrelationstests übersehen könnten.

> [!example] Beispiel: Linearer Kongruenzgenerator
> Eine klassische (aber heute oft veraltete) Methode:
> $$ X_{n+1} = (a \cdot X_n + c) \mod m $$
> $$ U_{n+1} = \frac{X_{n+1}}{m} $$
> Bei schlechter Wahl der Parameter ($a, c, m$) entstehen im Streudiagramm von $(U_i, U_{i+1})$ sichtbare Gitterstrukturen (siehe Visualisierung unten). (a = 137, c = 1, m = 256)

### Visualisierung: Zufallsqualität
Vergleich eines "schlechten" Generator (mit kleiner Periode und Musterbildung) mit einem modernen Standard-Generator.

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

Gegeben sei eine diskrete Verteilung X mit Werten in $S = {x_0, x_1, \dots, x_{n}, \dots}$ und Einzelwahrscheinlichkeiten $p_k = P(X=x_k)$. (Belibige, konkret vorgegebene diskrete Verteilung)

Wir wollen aus i.i.d. $U \sim U(0,1)$ eine neue Zufallszahlen $X_{1}, \dots, X{n}$ erzeugen, die der Verteilung X folgen  (i.i.d. $\sim X$)

### Methode: Intervallzerlegung (Praktische Umsetzung)
Wir zerlegen das Einheitsintervall $(0,1)$ in Teilintervalle der Längen $p_k$ (Einzelwahrscheinlichkeiten der gegebenen Verteilung $X$).
Die Grenzen der Intervalle sind die **kumulierten Wahrscheinlichkeiten** $s_k$:
$$ s_k = \sum_{i=0}^k p_i = P(X \le x_k) $$

**Algorithmus:**
1.  Erzeuge $U \sim U(0,1)$.
2.  Suche das Intervall $k$, in das $U$ fällt:
    $$ s_{k-1} < U \le s_k \quad (\text{mit } s_{-1} = 0) $$
3.  Ausgabe: $X = x_k$.

### Theoretischer Hintergrund: Inversionsprinzip für diskrete Variable
Der obige Algorithmus ist nichts anderes als die Anwendung der Inversionsmethode auf diskrete Zufallsvariablen. Allerdings gibt es hier eine Besonderheit bei der "Umkehrung" der Verteilungsfunktion.

#### Das Problem: Treppenfunktion
Die Verteilungsfunktion $F(x) = P(X \le x)$ einer diskreten Variablen ist eine **Treppenfunktion**:
*   Sie springt an den Stellen $x_k$ um die Höhe $p_k$.
*   Dazwischen ist sie konstant auf dem Niveau $s_k$.

Daher ist die Gleichung $y = F(z)$ **nicht eindeutig** nach $z$ auflösbar:
1.  Für $y$-Werte zwischen den Sprunghöhen ($s_{k-1} < y < s_k$) gibt es gar keinen Funktionswert $F(z) = y$.
2.  Für $y$-Werte genau auf den Treppenstufen ($y = s_k$) kommen unendlich viele $z$-Werte in Frage.

#### Die Lösung: Quantilfunktion (Verallgemeinerte Inverse)
Man definiert daher die **Quantilfunktion** $F^{-1}$ als das "kleinste $z$, für das die Verteilung mindestens den Wert $y$ erreicht":

$$ F^{-1}(y) := \min \{ z \in \mathbb{R} : F(z) \ge y \}, \quad y \in (0,1) $$

**Zusammenhang zur Intervallzerlegung:**
Diese Definition sorgt dafür, dass jedem $y \in (s_{k-1}, s_k]$ genau der Wert $x_k$ zugeordnet wird.
*   Das Intervall auf der y-Achse (Länge $p_k$) entspricht genau der "Sprunghöhe" an der Stelle $x_k$.
*   Zieht man eine gleichverteilte Zufallszahl $U$, so landet sie mit Wahrscheinlichkeit $p_k$ in diesem Intervall.
*   Die Quantilfunktion bildet dieses $U$ dann auf $x_k$ ab.

$$F(x) = \text{Verteilungsfunktion} \to F^{-1}(z) = \text{Quantilfunktion}$$
$$ U \sim U(0,1) \implies F^{-1}(U) \sim X $$

> [!tip] Laufzeit-Optimierung
> Laufzeit worst-case: k letzten Intervall in der Liste fällt.
> Mittlere Laufzeit: $EX + 1$.
> 
> Um das passende Intervall schneller zu finden, sollten die Werte **nach Wahrscheinlichkeit absteigend sortiert** werden. (nach der Größe der Intervalle)
> *   Häufige Werte stehen am Anfang der Liste $\to$ Weniger Vergleiche im Durchschnitt.
> *   Erwartete Anzahl Vergleiche: $E[\text{Steps}] = E[X] + 1$ (bei Indizes $0, 1, \dots$).


## 3. Erzeugung stetiger Zufallszahlen

Für stetige Verteilungen gibt es drei Hauptmethoden.

### 3.1 Inversionsmethode

**Idee & Intuition:**
Die Verteilungsfunktion $F(x)$ bildet Werte der Zufallsvariablen auf Wahrscheinlichkeiten im Intervall $(0,1)$ ab.
Wir kehren diesen Prozess um: Wir wählen zufällig eine "Wahrscheinlichkeit" $U$ (auf der y-Achse) und schauen, welcher Wert $x$ (auf der x-Achse) dazu gehört.
*   In Bereichen, wo die Dichte $f(x)$ hoch ist, verläuft $F(x)$ **steil**.
*   Ein steiler Anstieg bedeutet, dass ein kleines Intervall auf der x-Achse ein *großes* Intervall auf der y-Achse abdeckt.
*   Dadurch landen "viele" der gleichverteilten $U$-Werte in diesem Bereich, sodass die entsprechenden $x$-Werte häufiger erzeugt werden.

> [!important] Satz (Inversionsprinzip)
> Sei $F$ eine stetige, streng monoton wachsende Verteilungsfunktion.
> Ist $U \sim U(0,1)$ eine gleichverteilte Zufallsvariable, dann ist die transformierte Variable
> $$ X = F^{-1}(U) $$
> exakt verteilt mit der Verteilungsfunktion $F$.

**Voraussetzung:**
Die Umkehrfunktion $F^{-1}$ (Quantilfunktion) muss bekannt und berechenbar sein.
- $f(x)$ gegeben und Integration zu $F(x)$
- oder $F(x)$ gegeben

**Algorithmus:**
1.  Erzeuge $U \sim U(0,1)$
2.  Berechne $X := g(U)$ (mit $g = F^{-1}$)
3.  Gib $X$ aus.
4.  Wiederhole ab (1) bis Abbruchkriterium erfüllt ist.

**Detailliertes Vorgehen bei der Inversionsmethode:**
1.  **Ermittlung des Zustandsraumes:**
    Bestimme den Bereich $S = (a, b)$, in dem die Dichte positiv ist:
    $$ S = (a, b) = \{x \in \mathbb{R} : f(x) > 0\} = \{x \in \mathbb{R} : F'(x) > 0\} $$
2.  **Berechnung der Verteilungsfunktion (auf $S$ eingeschränkt):**
    Berechne $H(x)$ durch Integration der Dichte:
    $$ H(x) = F|_S(x) = \int_{a}^{x} f(z) \, dz, \quad a < x < b $$
3.  **Berechnung der Umkehrfunktion $g = H^{-1}$:**
    Löse die Gleichung $y = H(x)$ für $a < x < b$ nach $x$ auf.
    Dies ergibt für jedes $y \in (0, 1)$ einen eindeutigen Wert $x$:
    $$ x = H^{-1}(y) = g(y) \in S = (a, b) $$
    Damit erhält man die funktionale Zuordnungsvorschrift:
    $$ g: (0, 1) \to S : y \mapsto g(y) = H^{-1}(y) $$

### 3.2 Annahme-Verwerfungs-Methode (Rechteck-Methode)

In den Vorlesungsfolien wird zunächst dieser Spezialfall behandelt. Er funktioniert für Dichten $f(x)$, die auf einem Intervall $[a, b]$ leben und beschränkt sind.

**Voraussetzungen:**
1.  Der Träger ist beschränkt: $f(x) = 0$ für $x \notin [a, b]$.
    *(Das bedeutet: Verteilungen auf ganz $\mathbb{R}$ wie die Normalverteilung können mit dieser einfachen Rechteck-Methode NICHT simuliert werden, da ein Rechteck über einem unendlichen Bereich eine unendliche Fläche hätte.)*
2.  Die Dichte ist beschränkt: Es gibt ein $c$, sodass $f(x) \le c$ für alle $x$.

**Idee:**
Wir legen ein **Rechteck** der Höhe $c$ über die Funktion $f(x)$. Wir "beregnen" dieses Rechteck gleichmäßig mit zufälligen Punkten. Punkte, die unterhalb der Kurve $f(x)$ landen, werden behalten.
![[Bildschirmfoto 2026-01-19 um 17.37.02.png]]
**Algorithmus:**
1.  **Erzeuge x-Koordinate:** $Q \sim U(a, b)$.
2.  **Erzeuge y-Koordinate:** $Y \sim U(0, c)$. (Also $Y = V \cdot c$ mit $V \sim U(0,1)$).
3.  **Akzeptanz-Test:**
    *   Falls $Y \le f(Q)$, gib $X = Q$ aus.
    *   Sonst wiederhole ab (1).

---

### 3.3 Importance Sampling (Allgemeine Hüllkurven-Methode)

Statt eines Rechtecks nutzen wir eine beliebige **Hüllkurve** $h(x)$, die sich besser an $f(x)$ anschmiegt.

**Idee:**
Wir nutzen eine **Vorschlagsdichte** $g(x)$, von der wir leicht Zufallszahlen erzeugen können (z.B. per Inversion). Die Kurve $h(x)$ dient (mit c skaliert) als Majorante. $h(x) = c \cdot g(x)$

- $g(x)$ ist Normiert (Fläche unter der Kurve = 1) also $g(x) = \frac{h(x)}{c}$
  Wird genutzt um x-Koordinate (Q) zu erzeugen.
- $h(x)$ ist nicht normiert (Fläche unter Kurve =  $\int g(x) \cdot c = 1 \cdot c = c$ )
  Wird als decke für den Akzeptanz-Test genutzt

**Algorithmus:**
1.  **Erzeuge x-Kandidat:** $Q$ aus der Verteilung mit Dichte $g(x)$ 
				   (z.B. durch $Q = G^{-1}(U), \text{ wobei } U \sim U(0,1)$)
2.  **Erzeuge y-Koordinate:** $Y$ gleichverteilt unter der Hüllkurve an der Stelle $Q$. $$ Y = U_2 \cdot h(Q) \quad (\text{wobei } U_2 \sim U(0,1)) $$
3.  **Akzeptanz-Test:**
    *   Falls $Y \le f(Q)$, gib $X = Q$ aus.
    *   Sonst wiederhole ab (1).

**Visualisierung des Unterschieds:**
Die klassische Annahme-Verwerfungsmethode kann als Sonderfall des Importance-Samplings verstanden mit: $h(x) = c : max \{f(x) : a < x < b\}, \; a < x < b$ verstanden werden.

Das Diagramm zeigt:
*   **Rot (Rechteck-Methode):** Viel "Verschnitt" (unnötige Rejections), da das Rechteck viel Fläche hat, wo $f(x)$ klein ist.
*   **Grün (Importance Sampling):** Die Hüllkurve $h(x)$ passt sich der Form an $\to$ viel effizienter.

```dataviewjs
// Visualisierung: Rechteck vs. Hüllkurve (Importance Sampling)
const x_vals = [];
const f_vals = [];
const rect_vals = [];
const imp_vals = [];

// Parameter
const x_min = 0;
const x_max = 10;
const y_max_rect = 0.35; // Konstante Höhe c

// Zieldichte f(x)
function f(x) {
    return 0.3 * Math.exp(-0.5 * Math.pow(x - 3, 2)) + 
           0.2 * Math.exp(-0.5 * Math.pow(x - 7, 2));
}

// Hüllkurve h(x) für Importance Sampling
function h_imp(x) {
    if (x < 0.5 || x > 9.5) return 0.05;
    if (x >= 0.5 && x <= 5.0) return 0.32; // Erster Peak sicher abgedeckt
    if (x > 5.0 && x <= 9.5) return 0.22;  // Zweiter Peak sicher abgedeckt
    return 0.05;
}

for (let i = x_min; i <= x_max; i += 0.1) {
    x_vals.push(i);
    f_vals.push(f(i));
    rect_vals.push(y_max_rect);
    imp_vals.push(h_imp(i));
}

const data = [
    {
        x: x_vals,
        y: f_vals,
        name: 'Zieldichte f(x)',
        line: { color: '#2196F3', width: 4 },
        fill: 'tozeroy'
    },
    {
        x: x_vals,
        y: rect_vals,
        name: 'Rechteck (Abschnitt 3.2)',
        line: { color: '#E91E63', dash: 'dash' }
    },
    {
        x: x_vals,
        y: imp_vals,
        name: 'Hüllkurve h(x) (Abschnitt 3.3)',
        line: { color: '#4CAF50', width: 2 }
    }
];

const layout = {
    title: { text: 'Vergleich: Rechteck vs. Hüllkurve' },
    xaxis: { title: { text: 'x' } },
    yaxis: { title: { text: 'Dichte / Höhe' } },
    margin: { t: 40, b: 40, l: 40, r: 20 },
    height: 300,
    showlegend: true
};

if (typeof window.renderPlotly === 'function') {
    window.renderPlotly(this.container, data, layout, {displaylogo: false});
} else {
    dv.paragraph("Plotly Plugin nicht aktiv.");
}
```

#### Erweiterung durch Importance Sampling
Gegenüber der einfachen Annahme-Verwerfungs-Methode bietet die das Important-Sampling entscheidende Vorteile:

1.  **Unbeschränkter Träger möglich:**
    Da die Hüllkurve $h(x)$ keine "Box" sein muss, sondern gegen 0 abfallen kann (z.B. wie eine Glockenkurve), können wir damit auch Verteilungen auf **ganz $\mathbb{R}$** simulieren (z.B. Normalverteilung, t-Verteilung).
    *Voraussetzung:* Wir müssen eine passende Vorschlagsdichte $g(x)$ finden, deren "Enden" (Tails) langsamer gegen 0 gehen als die von $f(x)$ (damit die Majorantenbedingung $c \cdot g(x) \ge f(x)$ auch im Unendlichen gilt).

2.  **Effizienz:**
    Durch eine gute Anpassung von $h(x)$ an $f(x)$ wird der Verschnitt minimiert ($c \approx 1$), was die Methode deutlich schneller macht als grobe Rechteck-Ansätze.
    
    Die Anzahl der benötigten Versuche, bis ein Wert akzeptiert wird, ist geometrisch verteilt. Der Erwartungswert entspricht genau der **Gesamtfläche unter der Majorante** (da die Fläche unter der Zieldichte $f(x)$ auf 1 normiert ist).
    
    **1. Klassische Rechteck-Methode:**
    Die Majorante ist ein Rechteck der Höhe $c$ über dem Intervall $[a, b]$. $$ E[\text{Iterationen}] = \text{Fläche} = c \cdot (b - a) $$
    **2. Importance Sampling:**
    Die Majorante ist die Funktion $h(x)$. Der Erwartungswert ist das Integral über diese Funktion (oft als $\gamma$ bezeichnet):
    $$ E[\text{Iterationen}] = \gamma = \int_{-\infty}^{\infty} h(x) \, dx $$
    *(Je näher $\gamma$ an 1 ist, desto effizienter ist der Algorithmus.)*

### 3.4 Box-Muller-Methode (für Normalverteilung)
Spezialverfahren zur Erzeugung von standardnormalverteilten Zufallszahlen $N(0,1)$. Die Inversionsmethode ist hier schwierig, da $\Phi^{-1}$ keine geschlossene Formel hat.

Der Box-Muller-Algorithmus transformiert **zwei** unabhängige $U(0,1)$-Zahlen ($U, V$) in **zwei** unabhängige $N(0,1)$-Zahlen ($Z_1, Z_2$).

**Gegeben:**
*   $U, V$ unabhängig $\sim U(0,1)$ (PRNG)

**Gesucht:**
* Algorithmus, der Zufallszahlen $X_1, \dots, X_n$ i.i.d. $\sim N(\mu, \sigma^2)$ erzeugt, wobei $\mu \in \mathbb{R}$ und $\sigma^2 > 0$ gegeben sind.

**Algorithmus:**
1.  Erzeuge von $U \sim U(0,1), V \sim U(0,1)$, unabhängig.
2.  Berechne $Z_1$ durch die Vorschrift:
    $$ Z_1 = \sqrt{-2 \ln U} \cos(2\pi V) $$
    (optional auch 2. Wert $Z_2$ erzeugbar durch: $Z_2 = \sqrt{-2 \ln U} \sin(2\pi V)$)
3.  Lineare Transformation:
    $$ X_{1/2} = Z_{1/2} \cdot \sigma + \mu $$
4.  Ausgabe von $X_1$ (optional: auch gleich $X_2$).

### 3.5 Marsaglia-Polar-Methode
Eine Optimierung der Box-Muller-Methode, die die rechenintensiven trigonometrischen Funktionen ($\sin, \cos$) vermeidet.

**Gegeben:**
*   $U, V$ unabhängig $\sim U(0,1)$ (PRNG)

**Gesucht:**
*   Algorithmus, der Zufallszahlen $Z_1, \dots, Z_n$ i.i.d $\sim N(0,1)$ erzeugt.

**Algorithmus:**
1.  Erzeuge $U \sim U(0,1), V \sim U(0,1)$ (unabhängig) und berechne:
    $$ X = 2U - 1, \quad Y = 2V - 1 $$
2.  Berechne $S = X^2 + Y^2$.
3.  Falls $S \ge 1$ gehe zu (1).
4.  Falls $S = 0$ setze $Z_1 = 0, Z_2 = 0$;
    sonst: setze
    $$ Z_1 = X \sqrt{\frac{-2 \ln S}{S}}, \quad Z_2 = Y \sqrt{\frac{-2 \ln S}{S}} $$
5.  Gib $Z_1, Z_2$ aus.

> [!abstract] Vergleich & Intuition: Box-Muller vs. Marsaglia-Polar-Methode
> **Unterschied:**
> *   **Box-Muller:** Nutzt trigonometrische Funktionen ($\sin, \cos$). Diese sind rechnerisch "teuer" (langsam). Transformiert das Rechteck $(0,1)^2$ direkt.
> *   **Marsaglia-Polar-Methode:** Nutzt algebraische Berechnungen und eine Verwerfung (Rejection). Vermeidet $\sin/\cos$.
> 
> **Gedanke hinter der Marsaglia-Polar-Methode (Intuition):**
> Statt einen Winkel $\alpha$ explizit zu berechnen (via $2\pi V$) und dann Sinus/Cosinus davon zu nehmen, wählt man einen **zufälligen Punkt $(X,Y)$ im Einheitskreis**.
> *   Die Koordinaten dieses Punktes definieren den Winkel geometrisch: $\cos \alpha = \frac{X}{\sqrt{S}}$ und $\sin \alpha = \frac{Y}{\sqrt{S}}$.
> *   Durch Einsetzen in die Box-Muller-Formeln kürzen sich die Terme so weg, dass keine Trigonometrie mehr nötig ist.
> *   Der Preis dafür ist, dass wir ca. $21\%$ der generierten Punkte verwerfen (Verhältnis von Quadratfläche zu Kreisfläche: $1 - \frac{\pi}{4} \approx 0.21$). Das ist aber meist schneller als die Berechnung von Sinus/Cosinus.