// Test-Datenpool für Fehleranalyse Unit Tests
// Erweitert mit allen Schwierigkeitsgraden: easy, medium, hard, expert, olympiad

const TEST_TASKS = [
    // ==================== EASY (Leicht) ====================
    {
        id: 'linear-eq-1',
        task: 'Löse die Gleichung: 2x + 6 = 14',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `2x + 6 = 14
2x = 14 - 6
2x = 8
x = 4`,
        incorrectSolution: `2x + 6 = 14
2x = 14 + 6
2x = 20
x = 10`,
        expectedErrors: [
            { step: 2, type: 'calc', description: 'Vorzeichenfehler: -6 statt +6' }
        ]
    },
    {
        id: 'linear-eq-2',
        task: 'Löse die Gleichung: 3x - 9 = 12',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `3x - 9 = 12
3x = 12 + 9
3x = 21
x = 7`,
        incorrectSolution: `3x - 9 = 12
3x = 12 - 9
3x = 3
x = 1`,
        expectedErrors: [
            { step: 2, type: 'calc', description: 'Vorzeichenfehler beim Umstellen' }
        ]
    },
    {
        id: 'fraction-calc-1',
        task: 'Berechne: 2/3 + 1/4',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `2/3 + 1/4
= 8/12 + 3/12
= 11/12`,
        incorrectSolution: `2/3 + 1/4
= 3/7`,
        expectedErrors: [
            { step: 2, type: 'logic', description: 'Zähler und Nenner direkt addiert' }
        ]
    },
    {
        id: 'fraction-calc-2',
        task: 'Berechne: 5/6 - 1/3',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `5/6 - 1/3
= 5/6 - 2/6
= 3/6
= 1/2`,
        incorrectSolution: `5/6 - 1/3
= 5/6 - 1/6
= 4/6
= 2/3`,
        expectedErrors: [
            { step: 2, type: 'calc', description: 'Falsches Erweitern von 1/3' }
        ]
    },
    {
        id: 'power-calc-1',
        task: 'Vereinfache: x³ · x⁴',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `x³ · x⁴
= x^(3+4)
= x⁷`,
        incorrectSolution: `x³ · x⁴
= x^(3·4)
= x¹²`,
        expectedErrors: [
            { step: 2, type: 'logic', description: 'Exponenten multipliziert statt addiert' }
        ]
    },
    {
        id: 'percentage-1',
        task: 'Berechne 15% von 240',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `15% von 240
= 0,15 · 240
= 36`,
        incorrectSolution: `15% von 240
= 240 / 15
= 16`,
        expectedErrors: [
            { step: 2, type: 'logic', description: 'Division statt Multiplikation mit Prozentsatz' }
        ]
    },
    {
        id: 'linear-eq-3',
        task: 'Löse die Gleichung: 5x + 3 = 2x + 15',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `5x + 3 = 2x + 15
5x - 2x = 15 - 3
3x = 12
x = 4`,
        incorrectSolution: `5x + 3 = 2x + 15
5x + 2x = 15 - 3
7x = 12
x = 12/7`,
        expectedErrors: [
            { step: 2, type: 'calc', description: 'Falsches Vorzeichen beim Umstellen von 2x' }
        ]
    },
    {
        id: 'percentage-2',
        task: 'Ein Artikel kostet 80€. Er wird um 25% reduziert. Was ist der neue Preis?',
        topic: 'algebra',
        difficulty: 'easy',
        correctSolution: `Rabatt = 25% von 80€
= 0,25 · 80€
= 20€
Neuer Preis = 80€ - 20€ = 60€`,
        incorrectSolution: `Rabatt = 25% von 80€
= 80€ / 25
= 3,20€
Neuer Preis = 80€ - 3,20€ = 76,80€`,
        expectedErrors: [
            { step: 2, type: 'logic', description: 'Prozentrechnung falsch angewendet' }
        ]
    },

    // ==================== MEDIUM (Mittel) ====================
    {
        id: 'quadratic-eq-1',
        task: 'Löse die Gleichung: x² - 5x + 6 = 0',
        topic: 'algebra',
        difficulty: 'medium',
        correctSolution: `x² - 5x + 6 = 0
(x - 2)(x - 3) = 0
x₁ = 2
x₂ = 3`,
        incorrectSolution: `x² - 5x + 6 = 0
(x - 2)(x + 3) = 0
x₁ = 2
x₂ = -3`,
        expectedErrors: [
            { step: 2, type: 'calc', description: 'Falsches Vorzeichen bei Faktorisierung' }
        ]
    },
    {
        id: 'linear-system-1',
        task: 'Löse das Gleichungssystem:\n2x + y = 7\nx - y = 2',
        topic: 'algebra',
        difficulty: 'medium',
        correctSolution: `2x + y = 7
x - y = 2
---
Addition: 3x = 9
x = 3
y = 7 - 2·3 = 1`,
        incorrectSolution: `2x + y = 7
x - y = 2
---
Addition: 3x = 9
x = 3
y = 7 - 3 = 4`,
        expectedErrors: [
            { step: 5, type: 'calc', description: 'Vergessen mit 2 zu multiplizieren' }
        ]
    },
    {
        id: 'sqrt-calc-1',
        task: 'Vereinfache: √50',
        topic: 'algebra',
        difficulty: 'medium',
        correctSolution: `√50
= √(25 · 2)
= √25 · √2
= 5√2`,
        incorrectSolution: `√50
= √(25 + 25)
= √25 + √25
= 10`,
        expectedErrors: [
            { step: 2, type: 'logic', description: 'Wurzel einer Summe falsch aufgeteilt' },
            { step: 3, type: 'followup', description: 'Folgefehler aus falschem Ansatz' }
        ]
    },
    {
        id: 'derivative-1',
        task: 'Bestimme die Ableitung von f(x) = 3x² + 2x - 5',
        topic: 'functions',
        difficulty: 'medium',
        correctSolution: `f(x) = 3x² + 2x - 5
f'(x) = 3 · 2x^(2-1) + 2 · 1 - 0
f'(x) = 6x + 2`,
        incorrectSolution: `f(x) = 3x² + 2x - 5
f'(x) = 3x + 2 - 5
f'(x) = 3x - 3`,
        expectedErrors: [
            { step: 2, type: 'calc', description: 'Potenzregel falsch angewendet' },
            { step: 3, type: 'followup', description: 'Folgefehler' }
        ]
    },
    {
        id: 'quadratic-eq-2',
        task: 'Löse mit der p-q-Formel: x² + 6x + 8 = 0',
        topic: 'algebra',
        difficulty: 'medium',
        correctSolution: `x² + 6x + 8 = 0
p = 6, q = 8
x₁,₂ = -p/2 ± √((p/2)² - q)
x₁,₂ = -3 ± √(9 - 8)
x₁,₂ = -3 ± 1
x₁ = -2, x₂ = -4`,
        incorrectSolution: `x² + 6x + 8 = 0
p = 6, q = 8
x₁,₂ = -p/2 ± √((p/2)² - q)
x₁,₂ = -3 ± √(9 + 8)
x₁,₂ = -3 ± √17
x₁ ≈ 1.12, x₂ ≈ -7.12`,
        expectedErrors: [
            { step: 4, type: 'calc', description: 'Plus statt Minus unter der Wurzel' }
        ]
    },
    {
        id: 'trig-basic-1',
        task: 'In einem rechtwinkligen Dreieck ist a = 3 und b = 4 (Katheten). Berechne die Hypotenuse c.',
        topic: 'geometry',
        difficulty: 'medium',
        correctSolution: `Satz des Pythagoras: c² = a² + b²
c² = 3² + 4²
c² = 9 + 16 = 25
c = √25 = 5`,
        incorrectSolution: `Satz des Pythagoras: c² = a² + b²
c² = 3² + 4²
c² = 9 + 16 = 25
c = 25/2 = 12,5`,
        expectedErrors: [
            { step: 4, type: 'logic', description: 'Wurzel vergessen zu ziehen' }
        ]
    },
    {
        id: 'exponential-1',
        task: 'Vereinfache: (2³)⁴ · 2⁻²',
        topic: 'algebra',
        difficulty: 'medium',
        correctSolution: `(2³)⁴ · 2⁻²
= 2^(3·4) · 2⁻²
= 2¹² · 2⁻²
= 2^(12-2)
= 2¹⁰ = 1024`,
        incorrectSolution: `(2³)⁴ · 2⁻²
= 2^(3+4) · 2⁻²
= 2⁷ · 2⁻²
= 2^(7-2)
= 2⁵ = 32`,
        expectedErrors: [
            { step: 2, type: 'logic', description: 'Bei verschachtelten Potenzen werden Exponenten multipliziert, nicht addiert' }
        ]
    },

    // ==================== HARD (Schwer) - Ausführliche Analysis-Aufgaben ====================
    {
        id: 'integration-parts-1',
        task: 'Berechne das unbestimmte Integral durch mehrfache partielle Integration:\n\n∫ x²·eˣ dx\n\nZeige alle Zwischenschritte vollständig.',
        topic: 'functions',
        difficulty: 'hard',
        correctSolution: `∫ x²·eˣ dx

Partielle Integration: ∫ u·v' dx = u·v - ∫ u'·v dx

=== Erste partielle Integration ===
Schritt 1: Wähle u = x², v' = eˣ
Schritt 2: Dann u' = 2x, v = eˣ
Schritt 3: ∫ x²·eˣ dx = x²·eˣ - ∫ 2x·eˣ dx

=== Zweite partielle Integration für ∫ 2x·eˣ dx ===
Schritt 4: Wähle u = 2x, v' = eˣ
Schritt 5: Dann u' = 2, v = eˣ
Schritt 6: ∫ 2x·eˣ dx = 2x·eˣ - ∫ 2·eˣ dx
Schritt 7: ∫ 2x·eˣ dx = 2x·eˣ - 2eˣ

=== Einsetzen in Schritt 3 ===
Schritt 8: ∫ x²·eˣ dx = x²·eˣ - (2x·eˣ - 2eˣ)
Schritt 9: = x²·eˣ - 2x·eˣ + 2eˣ
Schritt 10: = eˣ·(x² - 2x + 2)

=== Probe durch Ableiten ===
Schritt 11: d/dx[eˣ·(x² - 2x + 2)] = eˣ·(x² - 2x + 2) + eˣ·(2x - 2)
Schritt 12: = eˣ·(x² - 2x + 2 + 2x - 2) = eˣ·x² ✓

Ergebnis: ∫ x²·eˣ dx = eˣ·(x² - 2x + 2) + C`,
        incorrectSolution: `∫ x²·eˣ dx

Partielle Integration: ∫ u·v' dx = u·v - ∫ u'·v dx

=== Erste partielle Integration ===
Schritt 1: Wähle u = x², v' = eˣ
Schritt 2: Dann u' = 2x, v = eˣ
Schritt 3: ∫ x²·eˣ dx = x²·eˣ - ∫ 2x·eˣ dx

=== Zweite partielle Integration für ∫ 2x·eˣ dx ===
Schritt 4: Wähle u = 2x, v' = eˣ
Schritt 5: Dann u' = 2, v = eˣ
Schritt 6: ∫ 2x·eˣ dx = 2x·eˣ - ∫ 2·eˣ dx
Schritt 7: ∫ 2x·eˣ dx = 2x·eˣ + 2eˣ  ← FEHLER: Minus vergessen

=== Einsetzen in Schritt 3 ===
Schritt 8: ∫ x²·eˣ dx = x²·eˣ - (2x·eˣ + 2eˣ)
Schritt 9: = x²·eˣ - 2x·eˣ - 2eˣ  ← Folgefehler
Schritt 10: = eˣ·(x² - 2x - 2)  ← Folgefehler

Ergebnis: ∫ x²·eˣ dx = eˣ·(x² - 2x - 2) + C`,
        expectedErrors: [
            { step: 7, type: 'calc', description: 'Vorzeichenfehler: ∫ 2·eˣ dx = 2eˣ muss subtrahiert werden' },
            { step: 9, type: 'followup', description: 'Folgefehler aus Schritt 7' },
            { step: 10, type: 'followup', description: 'Folgefehler: falsches Endergebnis' }
        ]
    },
    {
        id: 'partial-fractions-1',
        task: 'Berechne das Integral durch Partialbruchzerlegung:\n\n∫ (2x + 3)/(x² - x - 2) dx\n\nZeige die vollständige Zerlegung und Integration.',
        topic: 'functions',
        difficulty: 'hard',
        correctSolution: `∫ (2x + 3)/(x² - x - 2) dx

=== Faktorisierung des Nenners ===
Schritt 1: x² - x - 2 = 0
Schritt 2: x₁,₂ = (1 ± √(1+8))/2 = (1 ± 3)/2
Schritt 3: x₁ = 2, x₂ = -1
Schritt 4: x² - x - 2 = (x - 2)(x + 1)

=== Partialbruchzerlegung ===
Schritt 5: (2x + 3)/((x-2)(x+1)) = A/(x-2) + B/(x+1)
Schritt 6: 2x + 3 = A(x + 1) + B(x - 2)

Schritt 7: Setze x = 2: 2·2 + 3 = A·3 + 0
Schritt 8: 7 = 3A → A = 7/3

Schritt 9: Setze x = -1: 2·(-1) + 3 = 0 + B·(-3)
Schritt 10: 1 = -3B → B = -1/3

=== Integration ===
Schritt 11: ∫ (2x + 3)/(x² - x - 2) dx = ∫ (7/3)/(x-2) dx + ∫ (-1/3)/(x+1) dx
Schritt 12: = (7/3)·ln|x - 2| - (1/3)·ln|x + 1| + C
Schritt 13: = (1/3)·(7·ln|x - 2| - ln|x + 1|) + C
Schritt 14: = (1/3)·ln|(x - 2)⁷/(x + 1)| + C

Ergebnis: ∫ (2x + 3)/(x² - x - 2) dx = (7/3)·ln|x - 2| - (1/3)·ln|x + 1| + C`,
        incorrectSolution: `∫ (2x + 3)/(x² - x - 2) dx

=== Faktorisierung des Nenners ===
Schritt 1: x² - x - 2 = 0
Schritt 2: x₁,₂ = (1 ± √(1+8))/2 = (1 ± 3)/2
Schritt 3: x₁ = 2, x₂ = -1
Schritt 4: x² - x - 2 = (x - 2)(x + 1)

=== Partialbruchzerlegung ===
Schritt 5: (2x + 3)/((x-2)(x+1)) = A/(x-2) + B/(x+1)
Schritt 6: 2x + 3 = A(x + 1) + B(x - 2)

Schritt 7: Setze x = 2: 2·2 + 3 = A·3 + 0
Schritt 8: 7 = 3A → A = 7/3

Schritt 9: Setze x = -1: 2·(-1) + 3 = 0 + B·(-3)
Schritt 10: 1 = -3B → B = 1/3  ← FEHLER: Vorzeichen falsch

=== Integration ===
Schritt 11: ∫ (2x + 3)/(x² - x - 2) dx = ∫ (7/3)/(x-2) dx + ∫ (1/3)/(x+1) dx
Schritt 12: = (7/3)·ln|x - 2| + (1/3)·ln|x + 1| + C  ← Folgefehler

Ergebnis: ∫ (2x + 3)/(x² - x - 2) dx = (7/3)·ln|x - 2| + (1/3)·ln|x + 1| + C`,
        expectedErrors: [
            { step: 10, type: 'calc', description: 'Vorzeichenfehler: 1 = -3B ergibt B = -1/3, nicht +1/3' },
            { step: 12, type: 'followup', description: 'Folgefehler: falsches Vorzeichen im Endergebnis' }
        ]
    },
    {
        id: 'curve-analysis-1',
        task: 'Führe eine vollständige Kurvendiskussion für die Funktion durch:\n\nf(x) = (x² - 4)/(x² + 1)\n\nBestimme: Definitionsbereich, Symmetrie, Nullstellen, Extrema, Wendepunkte, Asymptoten, Wertebereich.',
        topic: 'functions',
        difficulty: 'hard',
        correctSolution: `f(x) = (x² - 4)/(x² + 1)

=== Definitionsbereich ===
Schritt 1: Nenner x² + 1 > 0 für alle x ∈ ℝ
Schritt 2: D = ℝ

=== Symmetrie ===
Schritt 3: f(-x) = ((-x)² - 4)/((-x)² + 1) = (x² - 4)/(x² + 1) = f(x)
Schritt 4: f ist achsensymmetrisch zur y-Achse (gerade Funktion)

=== Nullstellen ===
Schritt 5: x² - 4 = 0 → x² = 4 → x₁ = -2, x₂ = 2

=== Ableitungen ===
Schritt 6: f'(x) = [2x(x²+1) - (x²-4)·2x] / (x²+1)²
Schritt 7: = [2x³ + 2x - 2x³ + 8x] / (x²+1)²
Schritt 8: = 10x / (x²+1)²

Schritt 9: f''(x) = [10(x²+1)² - 10x·2(x²+1)·2x] / (x²+1)⁴
Schritt 10: = [10(x²+1) - 40x²] / (x²+1)³
Schritt 11: = (10 - 30x²) / (x²+1)³

=== Extrema ===
Schritt 12: f'(x) = 0 → 10x = 0 → x = 0
Schritt 13: f''(0) = 10/1 = 10 > 0 → Minimum bei x = 0
Schritt 14: f(0) = -4/1 = -4 → Tiefpunkt T(0|-4)

=== Wendepunkte ===
Schritt 15: f''(x) = 0 → 10 - 30x² = 0 → x² = 1/3 → x = ±1/√3
Schritt 16: f(1/√3) = (1/3 - 4)/(1/3 + 1) = (-11/3)/(4/3) = -11/4
Schritt 17: Wendepunkte: W₁(-1/√3|-11/4), W₂(1/√3|-11/4)

=== Asymptoten ===
Schritt 18: lim(x→±∞) (x² - 4)/(x² + 1) = lim(x→±∞) (1 - 4/x²)/(1 + 1/x²) = 1
Schritt 19: Horizontale Asymptote: y = 1

=== Wertebereich ===
Schritt 20: Minimum bei y = -4, Asymptote bei y = 1 (wird nie erreicht)
Schritt 21: W = [-4, 1)`,
        incorrectSolution: `f(x) = (x² - 4)/(x² + 1)

=== Definitionsbereich ===
Schritt 1: Nenner x² + 1 > 0 für alle x ∈ ℝ
Schritt 2: D = ℝ

=== Symmetrie ===
Schritt 3: f(-x) = ((-x)² - 4)/((-x)² + 1) = (x² - 4)/(x² + 1) = f(x)
Schritt 4: f ist achsensymmetrisch zur y-Achse

=== Nullstellen ===
Schritt 5: x² - 4 = 0 → x² = 4 → x₁ = -2, x₂ = 2

=== Ableitungen ===
Schritt 6: f'(x) = [2x(x²+1) - (x²-4)·2x] / (x²+1)²
Schritt 7: = [2x³ + 2x - 2x³ - 8x] / (x²+1)²  ← FEHLER: Minus statt Plus
Schritt 8: = -6x / (x²+1)²  ← Folgefehler

=== Extrema ===
Schritt 9: f'(x) = 0 → -6x = 0 → x = 0
Schritt 10: f''(0) berechnen... (mit falschem f')
Schritt 11: Da f'(x) < 0 für x > 0: Maximum bei x = 0  ← Folgefehler
Schritt 12: f(0) = -4/1 = -4 → Hochpunkt H(0|-4)  ← Folgefehler: ist Tiefpunkt

=== Asymptoten ===
Schritt 13: lim(x→±∞) (x² - 4)/(x² + 1) = 1
Schritt 14: Horizontale Asymptote: y = 1

=== Wertebereich ===
Schritt 15: Maximum bei y = -4, Asymptote bei y = 1
Schritt 16: W = (-∞, -4] ∪ [1, ∞)  ← Folgefehler: komplett falsch`,
        expectedErrors: [
            { step: 7, type: 'calc', description: 'Vorzeichenfehler bei der Quotientenregel: -(x²-4)·2x = -2x³ + 8x, nicht -2x³ - 8x' },
            { step: 8, type: 'followup', description: 'Folgefehler: falsche erste Ableitung' },
            { step: 11, type: 'followup', description: 'Folgefehler: falsches Extremum-Typ' },
            { step: 16, type: 'followup', description: 'Folgefehler: falscher Wertebereich' }
        ]
    },
    {
        id: 'extremum-problem-1',
        task: 'Extremwertaufgabe:\n\nEin rechteckiges Grundstück soll mit einem 200m langen Zaun eingezäunt werden. Eine Seite grenzt an einen Fluss und braucht keinen Zaun. Bestimme die Abmessungen für maximale Fläche.\n\nStelle die Zielfunktion auf, berechne das Maximum und verifiziere durch hinreichende Bedingung.',
        topic: 'functions',
        difficulty: 'hard',
        correctSolution: `Extremwertaufgabe: Maximale Fläche mit 200m Zaun (eine Seite frei)

=== Variablen und Nebenbedingung ===
Schritt 1: Sei x = Länge parallel zum Fluss, y = Breite (beide Seiten)
Schritt 2: Nebenbedingung (Zaun): x + 2y = 200
Schritt 3: Auflösen nach x: x = 200 - 2y

=== Zielfunktion ===
Schritt 4: Fläche A = x · y
Schritt 5: Einsetzen: A(y) = (200 - 2y) · y
Schritt 6: A(y) = 200y - 2y²

=== Definitionsbereich ===
Schritt 7: y > 0 und x = 200 - 2y > 0 → y < 100
Schritt 8: Definitionsbereich: y ∈ (0, 100)

=== Notwendige Bedingung ===
Schritt 9: A'(y) = 200 - 4y
Schritt 10: A'(y) = 0 → 200 - 4y = 0 → y = 50

=== Hinreichende Bedingung ===
Schritt 11: A''(y) = -4
Schritt 12: A''(50) = -4 < 0 → Maximum bei y = 50

=== Lösung berechnen ===
Schritt 13: y = 50m (Breite)
Schritt 14: x = 200 - 2·50 = 100m (Länge parallel zum Fluss)
Schritt 15: A_max = 100 · 50 = 5000 m²

=== Randwertprüfung ===
Schritt 16: lim(y→0⁺) A(y) = 0
Schritt 17: lim(y→100⁻) A(y) = 0
Schritt 18: Das gefundene Maximum ist das globale Maximum.

Ergebnis: x = 100m, y = 50m, A_max = 5000 m²`,
        incorrectSolution: `Extremwertaufgabe: Maximale Fläche mit 200m Zaun (eine Seite frei)

=== Variablen und Nebenbedingung ===
Schritt 1: Sei x = Länge parallel zum Fluss, y = Breite (beide Seiten)
Schritt 2: Nebenbedingung (Zaun): x + 2y = 200
Schritt 3: Auflösen nach x: x = 200 - 2y

=== Zielfunktion ===
Schritt 4: Fläche A = x · y
Schritt 5: Einsetzen: A(y) = (200 - 2y) · y
Schritt 6: A(y) = 200y - 2y²

=== Notwendige Bedingung ===
Schritt 7: A'(y) = 200 - 2y  ← FEHLER: Ableitung von 2y² ist 4y, nicht 2y
Schritt 8: A'(y) = 0 → 200 - 2y = 0 → y = 100  ← Folgefehler

=== Hinreichende Bedingung ===
Schritt 9: A''(y) = -2  ← Folgefehler
Schritt 10: A''(100) = -2 < 0 → Maximum bei y = 100

=== Lösung berechnen ===
Schritt 11: y = 100m (Breite)
Schritt 12: x = 200 - 2·100 = 0m  ← Folgefehler: ergibt keinen Sinn!
Schritt 13: A_max = 0 · 100 = 0 m²  ← Folgefehler

"Das Ergebnis scheint falsch zu sein, aber ich finde den Fehler nicht..."`,
        expectedErrors: [
            { step: 7, type: 'calc', description: 'Ableitungsfehler: d/dy(2y²) = 4y, nicht 2y' },
            { step: 8, type: 'followup', description: 'Folgefehler: falscher kritischer Punkt' },
            { step: 12, type: 'followup', description: 'Folgefehler: unsinniges Ergebnis x = 0' },
            { step: 13, type: 'followup', description: 'Folgefehler: Fläche = 0 ist offensichtlich kein Maximum' }
        ]
    },

    // ==================== EXPERT (Experte) - Fortgeschrittene Analysis ====================
    {
        id: 'diff-eq-second-order-1',
        task: 'Löse die lineare Differentialgleichung 2. Ordnung mit Anfangswertproblem:\n\ny\'\' - 4y\' + 3y = eˣ mit y(0) = 1, y\'(0) = 0\n\nBestimme die vollständige Lösung mit homogenem und partikulärem Anteil.',
        topic: 'functions',
        difficulty: 'expert',
        correctSolution: `y'' - 4y' + 3y = eˣ mit y(0) = 1, y'(0) = 0

=== Homogene Lösung yₕ ===
Schritt 1: Charakteristische Gleichung: λ² - 4λ + 3 = 0
Schritt 2: (λ - 1)(λ - 3) = 0
Schritt 3: λ₁ = 1, λ₂ = 3
Schritt 4: yₕ = C₁·eˣ + C₂·e³ˣ

=== Partikuläre Lösung yₚ ===
Schritt 5: Störfunktion eˣ entspricht λ = 1 (ist Lösung der hom. Gl.!)
Schritt 6: Resonanzfall! Ansatz: yₚ = A·x·eˣ
Schritt 7: y'ₚ = A·eˣ + A·x·eˣ = A·eˣ(1 + x)
Schritt 8: y''ₚ = A·eˣ + A·eˣ(1 + x) = A·eˣ(2 + x)

Schritt 9: Einsetzen in DGL:
A·eˣ(2 + x) - 4·A·eˣ(1 + x) + 3·A·x·eˣ = eˣ

Schritt 10: eˣ ausklammern:
A(2 + x - 4 - 4x + 3x) = 1
A(2 - 4) = 1
-2A = 1 → A = -1/2

Schritt 11: yₚ = -x·eˣ/2

=== Allgemeine Lösung ===
Schritt 12: y = C₁·eˣ + C₂·e³ˣ - x·eˣ/2

=== Anfangsbedingungen einsetzen ===
Schritt 13: y(0) = 1: C₁ + C₂ = 1
Schritt 14: y'(x) = C₁·eˣ + 3C₂·e³ˣ - eˣ/2 - x·eˣ/2
Schritt 15: y'(0) = 0: C₁ + 3C₂ - 1/2 = 0 → C₁ + 3C₂ = 1/2

Schritt 16: Gleichungssystem lösen:
C₁ + C₂ = 1
C₁ + 3C₂ = 1/2
→ 2C₂ = -1/2 → C₂ = -1/4
→ C₁ = 1 - (-1/4) = 5/4

Lösung: y = (5/4)·eˣ - (1/4)·e³ˣ - (x/2)·eˣ`,
        incorrectSolution: `y'' - 4y' + 3y = eˣ mit y(0) = 1, y'(0) = 0

=== Homogene Lösung yₕ ===
Schritt 1: Charakteristische Gleichung: λ² - 4λ + 3 = 0
Schritt 2: (λ - 1)(λ - 3) = 0
Schritt 3: λ₁ = 1, λ₂ = 3
Schritt 4: yₕ = C₁·eˣ + C₂·e³ˣ

=== Partikuläre Lösung yₚ ===
Schritt 5: Ansatz: yₚ = A·eˣ  ← FEHLER: Resonanzfall nicht beachtet!
Schritt 6: y'ₚ = A·eˣ
Schritt 7: y''ₚ = A·eˣ

Schritt 8: Einsetzen in DGL:
A·eˣ - 4·A·eˣ + 3·A·eˣ = eˣ
A(1 - 4 + 3)·eˣ = eˣ
0 = eˣ  ← FEHLER: unlösbar!

Schritt 9: "Es scheint keine partikuläre Lösung zu geben..."  ← Folgefehler

=== Allgemeine Lösung ===
Schritt 10: y = C₁·eˣ + C₂·e³ˣ  ← Folgefehler: partikuläre Lösung fehlt

=== Anfangsbedingungen ===
Schritt 11: y(0) = 1: C₁ + C₂ = 1
Schritt 12: y'(0) = 0: C₁ + 3C₂ = 0

Schritt 13: C₂ = -1/2, C₁ = 3/2  ← Folgefehler

Lösung: y = (3/2)·eˣ - (1/2)·e³ˣ  ← Folgefehler: komplett falsch`,
        expectedErrors: [
            { step: 5, type: 'logic', description: 'Resonanzfall nicht erkannt: Da λ=1 bereits Lösung der homogenen DGL ist, muss der Ansatz yₚ = A·x·eˣ lauten' },
            { step: 8, type: 'followup', description: 'Folgefehler: 0 = eˣ ist unlösbar' },
            { step: 10, type: 'followup', description: 'Folgefehler: Partikuläre Lösung fehlt komplett' },
            { step: 13, type: 'followup', description: 'Folgefehler: Falsche Konstanten' }
        ]
    },
    {
        id: 'taylor-limit-1',
        task: 'Berechne den folgenden Grenzwert mit Hilfe der Taylor-Entwicklung:\n\nlim(x→0) [cos(x) - 1 + x²/2] / x⁴\n\nEntwickle cos(x) bis zum relevanten Glied und zeige alle Schritte.',
        topic: 'functions',
        difficulty: 'expert',
        correctSolution: `lim(x→0) [cos(x) - 1 + x²/2] / x⁴

=== Taylor-Entwicklung von cos(x) um x = 0 ===
Schritt 1: cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ...
Schritt 2: cos(x) = 1 - x²/2 + x⁴/24 - x⁶/720 + O(x⁸)

=== Einsetzen in den Zähler ===
Schritt 3: cos(x) - 1 + x²/2
Schritt 4: = (1 - x²/2 + x⁴/24 - ...) - 1 + x²/2
Schritt 5: = 1 - x²/2 + x⁴/24 - 1 + x²/2 + O(x⁶)
Schritt 6: = x⁴/24 + O(x⁶)

=== Division durch x⁴ ===
Schritt 7: [cos(x) - 1 + x²/2] / x⁴
Schritt 8: = [x⁴/24 + O(x⁶)] / x⁴
Schritt 9: = 1/24 + O(x²)

=== Grenzwert berechnen ===
Schritt 10: lim(x→0) [1/24 + O(x²)]
Schritt 11: = 1/24 + 0
Schritt 12: = 1/24

=== Probe mit L'Hôpital (4-fach anwenden) ===
Schritt 13: Form 0/0 → L'Hôpital anwendbar
Schritt 14: Nach 4-maliger Anwendung: lim(x→0) cos(x)/24 = 1/24 ✓

Ergebnis: lim(x→0) [cos(x) - 1 + x²/2] / x⁴ = 1/24`,
        incorrectSolution: `lim(x→0) [cos(x) - 1 + x²/2] / x⁴

=== Taylor-Entwicklung von cos(x) um x = 0 ===
Schritt 1: cos(x) = 1 - x²/2! + x⁴/4! - ...
Schritt 2: cos(x) = 1 - x²/2 + x⁴/24 - ...

=== Einsetzen in den Zähler ===
Schritt 3: cos(x) - 1 + x²/2
Schritt 4: = (1 - x²/2 + x⁴/24) - 1 + x²/2
Schritt 5: = - x²/2 + x⁴/24 + x²/2  ← FEHLER: -1 vergessen richtig einzusetzen
Schritt 6: = x⁴/24 - x²/2 + x²/2  [Korrektur, aber...]
Schritt 7: = x⁴/24 - 0 = x⁴/24  [Hm, sieht richtig aus...]

Aber dann machen wir einen anderen Fehler:
Schritt 8: [x⁴/24] / x⁴ = 24  ← FEHLER: Bruch falsch umgestellt!

Ergebnis: lim(x→0) [cos(x) - 1 + x²/2] / x⁴ = 24  ← Folgefehler`,
        expectedErrors: [
            { step: 8, type: 'calc', description: 'Bruch falsch berechnet: (x⁴/24)/x⁴ = 1/24, nicht 24' }
        ]
    },
    {
        id: 'rotation-volume-1',
        task: 'Berechne das Volumen des Rotationskörpers, der entsteht, wenn die Fläche zwischen\n\nf(x) = √x und g(x) = x²\n\num die x-Achse rotiert wird. Bestimme zunächst die Schnittstellen und zeige alle Integrationsschritte.',
        topic: 'functions',
        difficulty: 'expert',
        correctSolution: `Rotationsvolumen zwischen f(x) = √x und g(x) = x² um die x-Achse

=== Schnittstellen berechnen ===
Schritt 1: √x = x²
Schritt 2: x = x⁴ (durch Quadrieren)
Schritt 3: x - x⁴ = 0
Schritt 4: x(1 - x³) = 0
Schritt 5: x₁ = 0, x₂ = 1

=== Welche Funktion ist oben? ===
Schritt 6: Teste x = 0,5: √0,5 ≈ 0,71 > 0,25 = 0,5²
Schritt 7: Also f(x) = √x > g(x) = x² für x ∈ (0, 1)

=== Volumenformel (Differenzmethode) ===
Schritt 8: V = π · ∫₀¹ [f(x)² - g(x)²] dx
Schritt 9: V = π · ∫₀¹ [(√x)² - (x²)²] dx
Schritt 10: V = π · ∫₀¹ [x - x⁴] dx

=== Integration ===
Schritt 11: ∫ [x - x⁴] dx = x²/2 - x⁵/5

=== Grenzen einsetzen ===
Schritt 12: V = π · [x²/2 - x⁵/5]₀¹
Schritt 13: V = π · [(1/2 - 1/5) - (0 - 0)]
Schritt 14: V = π · [5/10 - 2/10]
Schritt 15: V = π · 3/10
Schritt 16: V = 3π/10

Ergebnis: V = 3π/10 ≈ 0,942 Volumeneinheiten`,
        incorrectSolution: `Rotationsvolumen zwischen f(x) = √x und g(x) = x² um die x-Achse

=== Schnittstellen berechnen ===
Schritt 1: √x = x²
Schritt 2: x = x⁴ (durch Quadrieren)
Schritt 3: x - x⁴ = 0
Schritt 4: x(1 - x³) = 0
Schritt 5: x₁ = 0, x₂ = 1

=== Volumenformel ===
Schritt 6: V = π · ∫₀¹ [f(x) - g(x)]² dx  ← FEHLER: Falsche Formel!
Schritt 7: V = π · ∫₀¹ [√x - x²]² dx
Schritt 8: V = π · ∫₀¹ [x - 2x^(5/2) + x⁴] dx

=== Integration ===
Schritt 9: ∫ [x - 2x^(5/2) + x⁴] dx = x²/2 - 2·(2/7)x^(7/2) + x⁵/5
Schritt 10: = x²/2 - (4/7)x^(7/2) + x⁵/5

=== Grenzen einsetzen ===
Schritt 11: V = π · [(1/2 - 4/7 + 1/5) - 0]
Schritt 12: V = π · [35/70 - 40/70 + 14/70]
Schritt 13: V = π · 9/70

Ergebnis: V = 9π/70  [FALSCH wegen falscher Formel]`,
        expectedErrors: [
            { step: 6, type: 'logic', description: 'Falsche Volumenformel: Es muss V = π∫[f(x)² - g(x)²]dx sein, nicht π∫[f(x) - g(x)]²dx' },
            { step: 13, type: 'followup', description: 'Folgefehler: falsches Volumen 9π/70 statt 3π/10' }
        ]
    },
    {
        id: 'parametric-arclength-1',
        task: 'Berechne die Bogenlänge der Parameterkurve:\n\nx(t) = t - sin(t)\ny(t) = 1 - cos(t)\n\nfür t ∈ [0, 2π] (eine Periode der Zykloide)\n\nZeige alle Ableitungen und den vollständigen Integrationsweg.',
        topic: 'functions',
        difficulty: 'expert',
        correctSolution: `Bogenlänge der Zykloide: x(t) = t - sin(t), y(t) = 1 - cos(t), t ∈ [0, 2π]

=== Ableitungen berechnen ===
Schritt 1: x'(t) = 1 - cos(t)
Schritt 2: y'(t) = sin(t)

=== Formel für Bogenlänge ===
Schritt 3: L = ∫₀^(2π) √[x'(t)² + y'(t)²] dt
Schritt 4: L = ∫₀^(2π) √[(1 - cos t)² + sin²t] dt

=== Vereinfachung des Integranden ===
Schritt 5: (1 - cos t)² + sin²t
Schritt 6: = 1 - 2cos t + cos²t + sin²t
Schritt 7: = 1 - 2cos t + 1  (da cos²t + sin²t = 1)
Schritt 8: = 2 - 2cos t
Schritt 9: = 2(1 - cos t)

=== Trigonometrische Identität anwenden ===
Schritt 10: 1 - cos t = 2sin²(t/2)
Schritt 11: Also: 2(1 - cos t) = 4sin²(t/2)
Schritt 12: √[4sin²(t/2)] = 2|sin(t/2)|

Schritt 13: Für t ∈ [0, 2π] ist t/2 ∈ [0, π], also sin(t/2) ≥ 0
Schritt 14: Daher: √[...] = 2sin(t/2)

=== Integration ===
Schritt 15: L = ∫₀^(2π) 2sin(t/2) dt
Schritt 16: Substitution: u = t/2, du = dt/2, dt = 2du
Schritt 17: Grenzen: t=0 → u=0, t=2π → u=π
Schritt 18: L = ∫₀^π 2sin(u) · 2du = 4∫₀^π sin(u) du
Schritt 19: L = 4[-cos(u)]₀^π
Schritt 20: L = 4[-cos(π) + cos(0)]
Schritt 21: L = 4[-(-1) + 1]
Schritt 22: L = 4 · 2 = 8

Ergebnis: Die Bogenlänge einer Periode der Zykloide beträgt L = 8`,
        incorrectSolution: `Bogenlänge der Zykloide: x(t) = t - sin(t), y(t) = 1 - cos(t), t ∈ [0, 2π]

=== Ableitungen berechnen ===
Schritt 1: x'(t) = 1 - cos(t)
Schritt 2: y'(t) = sin(t)

=== Formel für Bogenlänge ===
Schritt 3: L = ∫₀^(2π) √[x'(t)² + y'(t)²] dt
Schritt 4: L = ∫₀^(2π) √[(1 - cos t)² + sin²t] dt

=== Vereinfachung des Integranden ===
Schritt 5: (1 - cos t)² + sin²t
Schritt 6: = 1 - 2cos t + cos²t + sin²t
Schritt 7: = 1 - 2cos t + 1 = 2 - 2cos t

=== Direkte Integration (ohne Vereinfachung) ===
Schritt 8: L = ∫₀^(2π) √(2 - 2cos t) dt
Schritt 9: L = √2 · ∫₀^(2π) √(1 - cos t) dt

Schritt 10: "Das Integral ist kompliziert, schätzen wir ab..."  ← FEHLER: gibt auf
Schritt 11: Mit cos t ≈ 1 - t²/2 für kleine t... aber t geht bis 2π...
Schritt 12: Numerisch: L ≈ 7,5  ← FEHLER: falsche Schätzung

Ergebnis: L ≈ 7,5  [FALSCH: Der exakte Wert ist 8]`,
        expectedErrors: [
            { step: 10, type: 'logic', description: 'Integration aufgegeben, obwohl mit der Identität 1 - cos(t) = 2sin²(t/2) das Integral elementar lösbar ist' },
            { step: 12, type: 'calc', description: 'Falsche numerische Schätzung: Der exakte Wert ist 8, nicht 7,5' }
        ]
    },

    // ==================== OLYMPIAD (Olympiade) - Beweise und fortgeschrittene Analysis ====================
    {
        id: 'series-convergence-proof-1',
        task: 'Untersuche die Konvergenz der Reihe und berechne gegebenenfalls den Grenzwert:\n\n∑(n=1 bis ∞) [1/(n·(n+1)·(n+2))]\n\nVerwende Partialbruchzerlegung und teleskopierendes Summieren. Zeige alle Schritte vollständig.',
        topic: 'functions',
        difficulty: 'olympiad',
        correctSolution: `∑(n=1 bis ∞) 1/(n·(n+1)·(n+2))

=== Partialbruchzerlegung ===
Schritt 1: Ansatz: 1/(n(n+1)(n+2)) = A/n + B/(n+1) + C/(n+2)

Schritt 2: Multiplizieren mit n(n+1)(n+2):
1 = A(n+1)(n+2) + Bn(n+2) + Cn(n+1)

Schritt 3: Einsetzen von n = 0:
1 = A·1·2 = 2A → A = 1/2

Schritt 4: Einsetzen von n = -1:
1 = B·(-1)·1 = -B → B = -1

Schritt 5: Einsetzen von n = -2:
1 = C·(-2)·(-1) = 2C → C = 1/2

Schritt 6: Also: 1/(n(n+1)(n+2)) = (1/2)·[1/n - 2/(n+1) + 1/(n+2)]

=== Umformung für Teleskop-Summe ===
Schritt 7: = (1/2)·[1/n - 1/(n+1) - 1/(n+1) + 1/(n+2)]
Schritt 8: = (1/2)·[(1/n - 1/(n+1)) - (1/(n+1) - 1/(n+2))]

=== Partialsummen berechnen ===
Schritt 9: Sₙ = (1/2)·∑ₖ₌₁ⁿ [(1/k - 1/(k+1)) - (1/(k+1) - 1/(k+2))]

Schritt 10: Erste Teleskop-Summe: ∑(1/k - 1/(k+1)) = 1 - 1/(n+1)
Schritt 11: Zweite Teleskop-Summe: ∑(1/(k+1) - 1/(k+2)) = 1/2 - 1/(n+2)

Schritt 12: Sₙ = (1/2)·[(1 - 1/(n+1)) - (1/2 - 1/(n+2))]
Schritt 13: Sₙ = (1/2)·[1 - 1/(n+1) - 1/2 + 1/(n+2)]
Schritt 14: Sₙ = (1/2)·[1/2 - 1/(n+1) + 1/(n+2)]

=== Grenzwert bestimmen ===
Schritt 15: lim(n→∞) Sₙ = (1/2)·[1/2 - 0 + 0]
Schritt 16: = (1/2)·(1/2) = 1/4

=== Verifikation für kleine n ===
Schritt 17: S₁ = 1/(1·2·3) = 1/6
Schritt 18: S₂ = 1/6 + 1/(2·3·4) = 1/6 + 1/24 = 4/24 + 1/24 = 5/24
Schritt 19: Formel: S₂ = (1/2)·[1/2 - 1/3 + 1/4] = (1/2)·[6/12 - 4/12 + 3/12] = (1/2)·(5/12) = 5/24 ✓

Ergebnis: ∑(n=1 bis ∞) 1/(n(n+1)(n+2)) = 1/4`,
        incorrectSolution: `∑(n=1 bis ∞) 1/(n·(n+1)·(n+2))

=== Partialbruchzerlegung ===
Schritt 1: Ansatz: 1/(n(n+1)(n+2)) = A/n + B/(n+1) + C/(n+2)

Schritt 2: Multiplizieren mit n(n+1)(n+2):
1 = A(n+1)(n+2) + Bn(n+2) + Cn(n+1)

Schritt 3: Einsetzen von n = 0: A = 1/2
Schritt 4: Einsetzen von n = -1: B = -1
Schritt 5: Einsetzen von n = -2: C = 1/2

Schritt 6: Also: 1/(n(n+1)(n+2)) = (1/2)/n - 1/(n+1) + (1/2)/(n+2)

=== Summe direkt berechnen (FEHLER) ===
Schritt 7: ∑ = (1/2)·∑1/n - ∑1/(n+1) + (1/2)·∑1/(n+2)

Schritt 8: Die harmonische Reihe ∑1/n divergiert...  ← FEHLER: Divergenz gefolgert

Schritt 9: "Die Reihe könnte divergieren, da harmonische Reihen vorkommen"

Schritt 10: Aber die Terme werden kleiner... vielleicht konvergiert sie doch?

Schritt 11: Numerisch: 1/6 + 1/24 + 1/60 + ... ≈ 0.22...  ← Folgefehler: kein exakter Wert

Schritt 12: "Die Reihe konvergiert wahrscheinlich gegen ungefähr 0.22"

Ergebnis: ∑ ≈ 0.22 (unsicher)  [FALSCH: Der exakte Wert ist 1/4 = 0.25]`,
        expectedErrors: [
            { step: 7, type: 'logic', description: 'Falsche Methode: Die Summe kann nicht term-weise aufgeteilt werden in separat divergente Reihen' },
            { step: 8, type: 'logic', description: 'Falsche Schlussfolgerung: Auch wenn ∑1/n divergiert, kann die Gesamtsumme durch Teleskopieren konvergieren' },
            { step: 12, type: 'calc', description: 'Numerische Schätzung statt exakter Berechnung: Der korrekte Wert ist 1/4, nicht ≈0.22' }
        ]
    },
    {
        id: 'improper-integral-convergence-1',
        task: 'Untersuche die Konvergenz des uneigentlichen Integrals und berechne es gegebenenfalls:\n\n∫₀^∞ x·e^(-x²) dx\n\nBegründe die Existenz, führe die Substitution durch und zeige alle Grenzwertbetrachtungen.',
        topic: 'functions',
        difficulty: 'olympiad',
        correctSolution: `∫₀^∞ x·e^(-x²) dx

=== Existenz prüfen ===
Schritt 1: Der Integrand f(x) = x·e^(-x²) ist stetig auf [0, ∞)
Schritt 2: Für x → ∞: x·e^(-x²) → 0 (exponentieller Abfall dominiert)
Schritt 3: Majorante: |x·e^(-x²)| ≤ e^(-x²/2) für große x (konvergiert)

=== Definition des uneigentlichen Integrals ===
Schritt 4: ∫₀^∞ x·e^(-x²) dx = lim(b→∞) ∫₀^b x·e^(-x²) dx

=== Substitution ===
Schritt 5: Setze u = x², dann du = 2x dx
Schritt 6: Also: x dx = du/2

=== Grenztransformation ===
Schritt 7: x = 0 → u = 0
Schritt 8: x = b → u = b²

=== Integral transformieren ===
Schritt 9: ∫₀^b x·e^(-x²) dx = ∫₀^(b²) e^(-u) · (du/2)
Schritt 10: = (1/2) · ∫₀^(b²) e^(-u) du

=== Stammfunktion berechnen ===
Schritt 11: ∫ e^(-u) du = -e^(-u)
Schritt 12: (1/2) · [-e^(-u)]₀^(b²) = (1/2) · [-e^(-b²) + e^0]
Schritt 13: = (1/2) · [1 - e^(-b²)]

=== Grenzwert bilden ===
Schritt 14: lim(b→∞) (1/2) · [1 - e^(-b²)]
Schritt 15: Da lim(b→∞) e^(-b²) = 0:
Schritt 16: = (1/2) · [1 - 0] = 1/2

=== Konvergenzbeweis zusammenfassen ===
Schritt 17: Das Integral konvergiert, da:
- Der Grenzwert existiert und endlich ist
- Die Substitution legitim ist (monoton, stetig differenzierbar)

Ergebnis: ∫₀^∞ x·e^(-x²) dx = 1/2`,
        incorrectSolution: `∫₀^∞ x·e^(-x²) dx

=== Substitution ===
Schritt 1: Setze u = x², dann du = 2x dx
Schritt 2: x dx = du/2

Schritt 3: ∫₀^∞ x·e^(-x²) dx = (1/2)·∫₀^∞ e^(-u) du

=== Berechnung ===
Schritt 4: = (1/2)·[-e^(-u)]₀^∞

Schritt 5: An der oberen Grenze: -e^(-∞) = 0
Schritt 6: An der unteren Grenze: -e^0 = -1

Schritt 7: = (1/2)·[0 - (-1)]  ← FEHLER: Grenzen falsch eingesetzt!
Schritt 8: = (1/2)·(0 + 1)  [Noch ein Fehler]
Schritt 9: = (1/2)·(-1)  ← FEHLER: Vorzeichen vertauscht
Schritt 10: = -1/2  ← FEHLER: negatives Ergebnis für positiven Integranden!

"Das Ergebnis ist negativ, obwohl der Integrand positiv ist...
vielleicht habe ich einen Vorzeichenfehler gemacht?"

Ergebnis: ∫₀^∞ x·e^(-x²) dx = -1/2 ???  [FALSCH]`,
        expectedErrors: [
            { step: 4, type: 'logic', description: 'Grenztransformation bei Substitution vergessen: Wenn u = x², dann geht u von 0 nach ∞, nicht x' },
            { step: 7, type: 'calc', description: 'Vorzeichenfehler beim Einsetzen der Grenzen: [F(b) - F(a)], nicht [F(a) - F(b)]' },
            { step: 10, type: 'logic', description: 'Negativer Wert für Integral über positive Funktion ist ein Widerspruch - hätte zum Nachprüfen führen müssen' }
        ]
    },
    {
        id: 'uniform-continuity-proof-1',
        task: 'Beweise mit der ε-δ-Definition:\n\nDie Funktion f(x) = x² ist gleichmäßig stetig auf [0, 1], aber NICHT gleichmäßig stetig auf ℝ.\n\nZeige beide Teile vollständig mit allen notwendigen Abschätzungen.',
        topic: 'functions',
        difficulty: 'olympiad',
        correctSolution: `f(x) = x² - Untersuchung der gleichmäßigen Stetigkeit

=== TEIL 1: f ist gleichmäßig stetig auf [0, 1] ===

Definition: ∀ε>0 ∃δ>0: |x-y|<δ ⟹ |f(x)-f(y)|<ε für alle x,y ∈ [0,1]

Schritt 1: Sei ε > 0 beliebig gegeben.

Schritt 2: Für x, y ∈ [0, 1] gilt:
|x² - y²| = |x - y| · |x + y|

Schritt 3: Da x, y ∈ [0, 1]: |x + y| ≤ |x| + |y| ≤ 1 + 1 = 2

Schritt 4: Also: |x² - y²| ≤ 2 · |x - y|

Schritt 5: Wähle δ = ε/2

Schritt 6: Dann für |x - y| < δ:
|x² - y²| ≤ 2 · |x - y| < 2 · δ = 2 · (ε/2) = ε ✓

Schritt 7: Da δ = ε/2 nur von ε abhängt (nicht von x oder y),
ist f gleichmäßig stetig auf [0, 1]. □

=== TEIL 2: f ist NICHT gleichmäßig stetig auf ℝ ===

Schritt 8: Wir zeigen: ∃ε>0 ∀δ>0 ∃x,y∈ℝ: |x-y|<δ ∧ |f(x)-f(y)|≥ε

Schritt 9: Wähle ε = 1.

Schritt 10: Sei δ > 0 beliebig gegeben.

Schritt 11: Wähle x = 1/δ und y = 1/δ + δ/2
(sodass |x - y| = δ/2 < δ)

Schritt 12: Dann:
|x² - y²| = |x - y| · |x + y|
= (δ/2) · |1/δ + 1/δ + δ/2|
= (δ/2) · (2/δ + δ/2)

Schritt 13: = 1 + δ²/4

Schritt 14: Für alle δ > 0 gilt: 1 + δ²/4 > 1 = ε

Schritt 15: Also existiert für jedes δ > 0 ein Paar (x, y) mit
|x - y| < δ aber |x² - y²| ≥ 1 = ε

Schritt 16: Daher ist f nicht gleichmäßig stetig auf ℝ. □

=== Zusammenfassung ===
Schritt 17: Der entscheidende Unterschied:
- Auf [0,1] ist |x + y| durch 2 beschränkt
- Auf ℝ kann |x + y| beliebig groß werden

Schritt 18: Dies zeigt, warum Beschränktheit der Ableitung (hier |f'(x)| = |2x|)
auf kompakten Intervallen gleichmäßige Stetigkeit garantiert,
auf unbeschränkten Mengen jedoch nicht.`,
        incorrectSolution: `f(x) = x² - Untersuchung der gleichmäßigen Stetigkeit

=== TEIL 1: f ist gleichmäßig stetig auf [0, 1] ===

Schritt 1: f ist stetig auf [0, 1].

Schritt 2: [0, 1] ist kompakt.

Schritt 3: Stetige Funktionen auf kompakten Mengen sind gleichmäßig stetig.

Schritt 4: Also ist f gleichmäßig stetig auf [0, 1]. □

← FEHLER: Das ist zwar richtig, aber kein konstruktiver ε-δ-Beweis!

=== TEIL 2: f ist NICHT gleichmäßig stetig auf ℝ ===

Schritt 5: Angenommen, f wäre gleichmäßig stetig auf ℝ.

Schritt 6: Dann existiert für ε = 1 ein δ > 0 mit:
|x - y| < δ ⟹ |x² - y²| < 1

Schritt 7: Wähle x = 10 und y = 10 + δ/2.

Schritt 8: |x - y| = δ/2 < δ ✓

Schritt 9: |x² - y²| = |100 - (10 + δ/2)²|
= |100 - 100 - 10δ - δ²/4|  ← FEHLER: Minus falsch
= |10δ + δ²/4|  ← Folgefehler

Schritt 10: Für δ = 0,1: |10·0,1 + 0,01/4| = |1,0025| > 1 ✓

Schritt 11: Also Widerspruch, f nicht gleichmäßig stetig. □

[PROBLEM: Der Beweis funktioniert zufällig, aber die Rechnung in Schritt 9 ist falsch]`,
        expectedErrors: [
            { step: 4, type: 'logic', description: 'Teil 1 ist kein konstruktiver ε-δ-Beweis - nur Berufung auf einen Satz ohne explizite δ-Konstruktion' },
            { step: 9, type: 'calc', description: 'Binomische Formel falsch: (10 + δ/2)² = 100 + 10δ + δ²/4, daher ist die Differenz -10δ - δ²/4' },
            { step: 11, type: 'logic', description: 'Zwar stimmt das Ergebnis, aber der Rechenweg ist fehlerhaft und die Argumentation unvollständig' }
        ]
    }
];

/**
 * Wählt eine zufällige Aufgabe aus dem Pool
 * @returns {Object} Zufällige Testaufgabe
 */
function getRandomTestTask() {
    const index = Math.floor(Math.random() * TEST_TASKS.length);
    return TEST_TASKS[index];
}

/**
 * Wählt eine zufällige Aufgabe nach Schwierigkeitsgrad
 * @param {string} difficulty - Schwierigkeitsgrad (easy, medium, hard, expert, olympiad)
 * @returns {Object|null} Zufällige Testaufgabe oder null wenn keine gefunden
 */
function getRandomTestTaskByDifficulty(difficulty) {
    const filteredTasks = TEST_TASKS.filter(t => t.difficulty === difficulty);
    if (filteredTasks.length === 0) return null;
    
    const index = Math.floor(Math.random() * filteredTasks.length);
    return filteredTasks[index];
}

/**
 * Gibt alle verfügbaren Schwierigkeitsgrade zurück
 * @returns {Array<string>} Liste der Schwierigkeitsgrade
 */
function getAvailableDifficulties() {
    const difficulties = [...new Set(TEST_TASKS.map(t => t.difficulty))];
    const order = ['easy', 'medium', 'hard', 'expert', 'olympiad'];
    return difficulties.sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

/**
 * Gibt die Anzahl der Aufgaben pro Schwierigkeitsgrad zurück
 * @returns {Object} { difficulty: count }
 */
function getTaskCountByDifficulty() {
    const counts = {};
    TEST_TASKS.forEach(task => {
        counts[task.difficulty] = (counts[task.difficulty] || 0) + 1;
    });
    return counts;
}

/**
 * Wählt zufällig den korrekten oder fehlerhaften Lösungsweg
 * @param {Object} task - Die Testaufgabe
 * @param {boolean} [forceIncorrect=null] - null=zufällig, true=fehlerhaft, false=korrekt
 * @returns {Object} { solution, isCorrect, expectedErrors }
 */
function getRandomSolution(task, forceIncorrect = null) {
    const useIncorrect = forceIncorrect !== null 
        ? forceIncorrect 
        : Math.random() < 0.5;
    
    return {
        solution: useIncorrect ? task.incorrectSolution : task.correctSolution,
        isCorrect: !useIncorrect,
        expectedErrors: useIncorrect ? task.expectedErrors : []
    };
}

/**
 * Holt eine Aufgabe nach ID
 * @param {string} id - Die Aufgaben-ID
 * @returns {Object|null} Die Aufgabe oder null
 */
function getTestTaskById(id) {
    return TEST_TASKS.find(t => t.id === id) || null;
}

/**
 * Gibt alle verfügbaren Aufgaben zurück
 * @returns {Array} Alle Testaufgaben
 */
function getAllTestTasks() {
    return [...TEST_TASKS];
}

/**
 * Gibt Aufgaben eines bestimmten Schwierigkeitsgrads zurück
 * @param {string} difficulty - Schwierigkeitsgrad
 * @returns {Array} Gefilterte Aufgaben
 */
function getTestTasksByDifficulty(difficulty) {
    return TEST_TASKS.filter(t => t.difficulty === difficulty);
}

/**
 * Validiert das Analyseergebnis gegen erwartete Fehler
 * @param {Object} analysisResult - Das Ergebnis der Fehleranalyse
 * @param {Array} expectedErrors - Die erwarteten Fehler
 * @returns {Object} { passed, details }
 */
function validateAnalysisResult(analysisResult, expectedErrors) {
    if (!analysisResult || !analysisResult.steps) {
        return {
            passed: false,
            details: 'Keine gültige Analyse erhalten'
        };
    }

    const foundErrors = analysisResult.steps
        .filter(s => s.errorType !== 'none')
        .map(s => ({ step: s.index, type: s.errorType }));

    // Prüfe ob erwartete Fehler gefunden wurden
    const matchedErrors = [];
    const missedErrors = [];
    const unexpectedErrors = [];

    for (const expected of expectedErrors) {
        const found = foundErrors.find(f => 
            f.step === expected.step && f.type === expected.type
        );
        if (found) {
            matchedErrors.push(expected);
        } else {
            missedErrors.push(expected);
        }
    }

    for (const found of foundErrors) {
        const wasExpected = expectedErrors.find(e => 
            e.step === found.step && e.type === found.type
        );
        if (!wasExpected) {
            unexpectedErrors.push(found);
        }
    }

    const passed = missedErrors.length === 0;

    return {
        passed,
        details: {
            matchedErrors,
            missedErrors,
            unexpectedErrors,
            totalExpected: expectedErrors.length,
            totalFound: foundErrors.length
        }
    };
}

// Export für Browser-Nutzung
if (typeof window !== 'undefined') {
    window.TestData = {
        TEST_TASKS,
        getRandomTestTask,
        getRandomTestTaskByDifficulty,
        getAvailableDifficulties,
        getTaskCountByDifficulty,
        getRandomSolution,
        getTestTaskById,
        getAllTestTasks,
        getTestTasksByDifficulty,
        validateAnalysisResult
    };
}
