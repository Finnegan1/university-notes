## 1. Was ist Modellierung?

Mathematische Modellierung ist der Prozess, konkrete Fragestellungen aus der Realität (Physik, Technik, Wirtschaft etc.) in ein **wohldefiniertes mathematisches Problem** zu übersetzen.

### Der Modellierungskreis

Der Prozess ist iterativ und wird oft als Kreis dargestellt:

1.  **Reales Problem**: Ausgangspunkt.
2.  **Vereinfachung & Annahmen**: Identifikation wesentlicher Einflussfaktoren. Vernachlässigung unwichtiger Details oder Modellierung durch **stochastische Komponenten** (Zufall), wenn Effekte nicht explizit beschreibbar sind.
3.  **Mathematisches Modell**: Formulierung als Gleichung, DGL, Optimierungsproblem oder **stochastisches Modell**.
4.  **Analyse / Simulation**: Lösen des mathematischen Problems (analytisch oder numerisch/simulativ).
5.  **Validierung**: Vergleich der Ergebnisse mit realen Daten.
    *   *Passung gut?* -> Interpretation und Anwendung.
    *   *Passung schlecht?* -> Anpassung des Modells (Parameter, Annahmen) und erneuter Durchlauf.

## 2. Stochastische Modelle: Beispiel Ticketbuchung

Ein klassisches Beispiel für stochastische Modellierung ist das **Überbuchungsproblem** (Yield Management).

**Szenario**:
*   Kapazität: 100 Plätze.
*   Verkaufte Tickets: $n$.
*   Jeder Käufer erscheint mit Wahrscheinlichkeit $p$ (unabhängig voneinander).
*   $S_n$: Anzahl der tatsächlich erscheinenden Personen.

**Modellierung**:
$S_n$ folgt einer **Binomialverteilung**:
$$S_n \sim B(n, p)$$
$$P(S_n = k) = \binom{n}{k} p^k (1-p)^{n-k}$$

**Ziel**:
Maximiere die verkauften Tickets $n$, unter der Nebenbedingung, dass das Risiko einer Überbuchung eine Schranke $\alpha$ (z.B. 0.05) nicht überschreitet.
$$P(S_n > 100) \le \alpha$$

**Lösungswege**:
1.  **Theoretisch**: Berechnung der Wahrscheinlichkeitssumme $\sum_{k=101}^{n} P(S_n=k)$ für verschiedene $n$.
2.  **Simulation (Monte-Carlo)**:
    *   Simuliere $N$-mal den Prozess (z.B. $n$ Bernoulli-Experimente).
    *   Zähle, wie oft Überbuchung eintritt.
    *   Relative Häufigkeit $\approx$ Wahrscheinlichkeit.

## 3. Momente und Kennzahlen (allgemein)

Momente sind **Kennzahlen**, die eine Verteilung kompakt beschreiben (Lage, Streuung, Form). Inhaltlich sind die Regeln bei **diskreten** und **stetigen** Zufallsvariablen gleich – der praktische Unterschied ist, ob man **summiert** oder **integriert**.

> [!summary] Merksatz
> Gleiche Idee, andere „Rechenoperation“:  
> diskret $\Rightarrow$ Summe, stetig $\Rightarrow$ Integral.

### 3.1 Rohmomente und zentrale Momente

*   **$k$-tes Rohmoment**:
    $$m_k := E[X^k]$$
*   **$k$-tes zentrales Moment**:
    $$\mu_k := E[(X - E[X])^k]$$

Spezialfälle:
*   $E[X] = \mu$ (Erwartungswert)
*   $\mu_2 = \operatorname{Var}(X) = \sigma^2$ (Varianz)

### 3.2 Erwartungswert und Transformationssatz (LOTUS)

Für eine Funktion $g$ gilt allgemein (sofern der Erwartungswert existiert):

*   **Diskret** (Werte $x_k$):
    $$E[g(X)] = \sum_k g(x_k)\,P(X=x_k)$$
*   **Stetig** (Dichte $f_X$):
    $$E[g(X)] = \int_{-\infty}^{\infty} g(x)\, f_X(x)\, dx$$

Das ist besonders praktisch, weil man $E[g(X)]$ so direkt aus der Verteilung von $X$ berechnen kann, **ohne** zuerst die Verteilung von $Y=g(X)$ zu bestimmen.

### 3.3 Varianz und Standardabweichung („Streuung“)

*   **Varianz**:
    $$\operatorname{Var}(X) := E[(X - E[X])^2] = E[X^2] - (E[X])^2$$
*   **Standardabweichung** (oft als „Streuung“ bezeichnet):
    $$\sigma_X := \sqrt{\operatorname{Var}(X)}$$

### 3.4 Lineare (affine) Transformationen

Sei $Y = aX + b$ mit Konstanten $a,b \in \mathbb{R}$. Dann gilt **immer** (diskret & stetig):
$$E[Y] = aE[X] + b$$
$$ E[aX + b] = a \cdot E[X] + b $$


$$\operatorname{Var}(Y) = a^2 \operatorname{Var}(X) \quad\Rightarrow\quad \sigma_Y = |a|\,\sigma_X$$
$$ \text{Var}(aX + b) = a^2 \cdot \text{Var}(X) $$

Interpretation:
*   $b$ verschiebt nur die Lage (ändert die Streuung nicht).
*   $a$ skaliert die Streuung (und dreht ggf. das Vorzeichen um).

### 3.5 Nichtlineare Transformationen

Für nichtlineare $g$ gibt es **keine** allgemeine „Abkürzung“ wie bei $aX+b$:
$$E[g(X)] \ne g(E[X]) \quad \text{(im Allgemeinen)}$$
Stattdessen berechnet man $E[g(X)]$ mit dem Transformationssatz.

### 3.6 Existenz von Momenten

Damit Momente sinnvoll sind, müssen die entsprechenden Summen/Integrale **konvergieren** (z.B. können bei „schweren Tails“ hohe Momente auch unendlich sein).
