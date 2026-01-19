# Allgemeine Mathematische Grundlagen

## 1. Terme Ausmultiplizieren

Beim Ausmultiplizieren von zwei Klammern wird jeder Summand der ersten Klammer mit jedem Summanden der zweiten Klammer multipliziert.

**Allgemeine Formel:**
$$(a + b)(c + d) = a \cdot c + a \cdot d + b \cdot c + b \cdot d$$ 

### Beispiel: Ausdruck ausmultiplizieren
Gegebener Ausdruck:
$$c \cdot (x - 5) \cdot (10 - x)$$

**Schritt-für-Schritt:**

1. **Klammern ausmultiplizieren:**
   $$(x - 5) \cdot (10 - x)$$
   $$= (x \cdot 10) + (x \cdot -x) + (-5 \cdot 10) + (-5 \cdot -x)$$
   $$= 10x - x^2 - 50 + 5x$$
   $$= -x^2 + 15x - 50$$

2. **Mit Faktor $c$ multiplizieren:**
   $$c \cdot (-x^2 + 15x - 50)$$
   $$= -cx^2 + 15cx - 50c$$

---

## 2. Analysis: Ableiten und Integrieren

### Ableitungsregeln ($f'(x)$)

| Regel | Funktion $f(x)$ | Ableitung $f'(x)$ | Beispiel |
| :--- | :--- | :--- | :--- |
| **Potenzregel** | $x^n$ | $n \cdot x^{n-1}$ | $x^3 \to 3x^2$ |
| **Faktorregel** | $a \cdot x^n$ | $a \cdot n \cdot x^{n-1}$ | $2x^4 \to 8x^3$ |
| **Konstantenregel** | $c$ | $0$ | $5 \to 0$ |
| **Summenregel** | $g(x) + h(x)$ | $g'(x) + h'(x)$ | $x^2 + x \to 2x + 1$ |
| **e-Funktion** | $e^x$ | $e^x$ |  |
| **Logarithmus** | $\ln(x)$ | $\frac{1}{x}$ |  |
| **Log. (Basis a)** | $\log_a(x)$ | $\frac{1}{x \cdot \ln(a)}$ | $\log_2(x) \to \frac{1}{x \cdot \ln(2)}$ |

### Kettenregel

Wird verwendet bei verketteten Funktionen (innere und äußere Funktion).
**Formel:** $f(x) = u(v(x)) \Rightarrow f'(x) = u'(v(x)) \cdot v'(x)$ ("Äußere Ableitung mal innere Ableitung")

**Beispiel: e-Funktion mit linearem Exponent**
Gesucht: Ableitung von $f(x) = e^{3x + 1}$

*   **Äußere Funktion:** $e^{(\dots)}$ (bleibt beim Ableiten gleich)
*   **Innere Funktion:** $3x + 1$ (Ableitung ist $3$)

$$f'(x) = e^{3x + 1} \cdot 3 = 3 \cdot e^{3x + 1}$$

### Produktregel
Wenn zwei Funktionen multipliziert werden: $f(x) = u(x) \cdot v(x)$
$$f'(x) = u'(x) \cdot v(x) + u(x) \cdot v'(x)$$
*Merkspruch: "Ableitung der ersten mal die zweite plus erste mal Ableitung der zweiten"*

### Quotientenregel
Bei einem Bruch von Funktionen: $f(x) = \frac{u(x)}{v(x)}$
$$f'(x) = \frac{u'(x) \cdot v(x) - u(x) \cdot v'(x)}{(v(x))^2}$$
*Merkspruch: "Nenner mal Ableitung Zähler minus Zähler mal Ableitung Nenner, durch Nenner zum Quadrat"*

### Integrationsregeln ($\int f(x) dx$)

> [!important] Integrationskonstante C
> Bei **unbestimmten Integralen** (ohne Grenzen) muss immer ein $+ C$ angehängt werden!
> Grund: Die Ableitung einer Konstanten ist 0. Daher wissen wir beim Rückwärtsrechnen (Integrieren) nicht, ob vorher eine Zahl da war.
> Beispiel: $\int 2x \, dx = x^2 + C$

| Regel | Funktion $f(x)$ | Stammfunktion $F(x)$ | Beispiel |
| :--- | :--- | :--- | :--- |
| **Potenzregel** | $x^n$ | $\frac{1}{n+1} x^{n+1} + C$ | $x^2 \to \frac{1}{3}x^3 + C$ |
| **Konstante** | $k$ | $k \cdot x + C$ | $5 \to 5x + C$ |
| **e-Funktion** | $e^x$ | $e^x + C$ |  |
| **Lineare Subst.** | $e^{mx+n}$ | $\frac{1}{m} e^{mx+n} + C$ | $e^{3x+1} \to \frac{1}{3}e^{3x+1} + C$ |

### Faktorregel: Konstante vor das Integral ziehen

**Regel:**
Ein konstanter Faktor (eine Zahl oder Variable wie $c$, die **nicht** von der Integrationsvariablen $x$ abhängt) darf vor das Integral gezogen werden.

$$ \int c \cdot f(x) \, dx = c \cdot \int f(x) \, dx $$

**Anwendung auf dein Beispiel:**
$$ \int_{5}^{10} c \cdot (x-5)(10-x) \, dx $$

Da $c$ konstant ist, stört es beim Integrieren nicht und wird einfach davor geschrieben:
$$ = c \cdot \int_{5}^{10} (x-5)(10-x) \, dx $$

**Warum macht man das?**
Es vereinfacht die Rechnung. Man integriert nur den komplizierten Teil mit $x$ (die Klammern) und multipliziert das Ergebnis ganz am Ende einfach mit $c$.
In deinem Bild wird der Term in der Klammer integriert zu $[\dots]_5^{10}$ und das Ergebnis davon (welches eine Zahl ist) wird am Schluss mit $c$ malgenommen.