---
tags:
  - Algorithmik
  - zusammenfassung
---

# Herleitung: Laufzeit der Tiefensuche zum Sammeln von Blättern

In deinen Notizen wird hergeleitet, warum die Laufzeit einer Tiefensuche (DFS), die alle $k$ Blätter eines Binärbaums sammelt, in $O(k)$ liegt. Die Erklärung folgt genau der Struktur deiner Aufzeichnungen.

---

### Schritt 1: Allgemeine Laufzeit der Tiefensuche (DFS)

Zuerst wird die grundlegende Komplexität der Tiefensuche betrachtet:

*   **Auf einem allgemeinen Graphen:** Eine Tiefensuche auf einem Graphen mit $V$ Knoten und $E$ Kanten hat eine Laufzeit von $O(|V| + |E|)$.
*   **Auf einem Baum:** Ein Baum ist ein spezieller Graph, bei dem immer die Beziehung $|E| = |V| - 1$ gilt (die Anzahl der Kanten ist immer um eins kleiner als die Anzahl der Knoten).
*   **Vereinfachung für Bäume:** Setzt man dies in die allgemeine Formel ein, ergibt sich:
    $O(|V| + |V| - 1) = O(2|V| - 1)$. Da Konstanten in der O-Notation wegfallen, vereinfacht sich die Laufzeit einer DFS auf einem Baum zu $O(|V|)$. Die Laufzeit ist also linear zur Anzahl der Knoten im Baum.

---

### Schritt 2: Die Hauptaussage (HA) und der Beweisplan

Deine Notizen formulieren dann eine zentrale Behauptung und den Plan, um zum Endergebnis zu gelangen:

**Hauptaussage (HA):** In jedem Binärbaum mit $k$ Blättern gibt es genau $k-1$ innere Knoten.

**Beweisplan:**
1.  **Zeigen:** Diese Hauptaussage wird mit vollständiger Induktion bewiesen.
2.  **Folgern:** Aus der Hauptaussage wird dann gefolgert, dass die Laufzeit der Tiefensuche zum Sammeln von $k$ Blättern $O(k)$ ist.

---

### Schritt 3: Der Beweis durch vollständige Induktion

Hier wird die Hauptaussage aus Schritt 2 formal bewiesen.

**Behauptung (IB):** Für jeden Binärbaum mit $k$ Blättern gilt: Die Anzahl der inneren Knoten $i(k)$ ist $k - 1$.
$i(k) = k - 1$

**Induktionsanfang (IA):**
*   Wir betrachten den Basisfall: ein Baum mit $k=1$ Blatt.
*   Dieser Baum hat nur einen Knoten und somit **0 innere Knoten**.
*   Die Formel $i(1) = 1 - 1 = 0$ bestätigt dies. Der Anfang ist korrekt.

**Induktionsvoraussetzung (IV):**
*   Wir nehmen an, die Behauptung sei für alle Bäume mit $k$ Blättern wahr.

**Induktionsschritt (IS):**
*   Wir beweisen nun, dass die Behauptung auch für einen Baum $T$ mit $k+1$ Blättern gilt.
*   Wir teilen den Baum $T$ an seiner Wurzel in zwei Teilbäume, $T_L$ (links) und $T_R$ (rechts).
*   Sei $l$ die Anzahl der Blätter in $T_L$ und $r$ die in $T_R$. Es gilt: $l + r = k+1$.
*   Laut Induktionsvoraussetzung hat $T_L$ genau $l-1$ innere Knoten und $T_R$ hat $r-1$ innere Knoten.
*   Die Gesamtzahl der inneren Knoten in $T$ ist die Summe der inneren Knoten der Teilbäume plus die Wurzel von $T$ selbst:
    Gesamtzahl innere Knoten = $(l - 1) + (r - 1) + 1$
    $= l + r - 1$
*   Da $l + r = k+1$, setzen wir ein:
    $= (k + 1) - 1$
*   Dies beweist, dass ein Baum mit $k+1$ Blättern auch $(k+1)-1$ innere Knoten hat. Die Hauptaussage ist somit bewiesen.

---

### Schritt 4: Die finale Folgerung der Laufzeit

Zuletzt wird die bewiesene Hauptaussage genutzt, um die Laufzeit herzuleiten:

1.  Die Laufzeit der DFS auf einem Baum ist $O(|V|)$ (aus Schritt 1).
2.  Die Gesamtzahl der Knoten $|V|$ ist die Summe der Blätter und der inneren Knoten.
    $|V| = (\text{Anzahl Blätter}) + (\text{Anzahl innerer Knoten})$
3.  Mit unserer bewiesenen Hauptaussage (aus Schritt 3) können wir einsetzen:
    $|V| = k + (k - 1) = 2k - 1$
4.  Setzen wir dies in die DFS-Laufzeit ein, erhalten wir:
    Laufzeit = $O(|V|) = O(2k - 1)$
5.  Nach den Regeln der O-Notation wird dies vereinfacht zu **$O(k)$**.

Damit ist die Herleitung abgeschlossen. Die Laufzeit hängt linear von der Anzahl der Blätter $k$ ab.


![[Bildschirmfoto 2025-12-30 um 21.26.11.png]]


nächstes: [[KD-Bäume]]
