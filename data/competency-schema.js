// Competency Schema - Festes Schema für mathematische Kompetenzen
// Garantiert Konsistenz bei KI-Analysen durch vordefinierte IDs

/**
 * Mathematische Kernkompetenzen
 * Jede Kompetenz hat:
 * - id: Eindeutige ID für Datenbank und KI-Zuordnung
 * - name: Deutsche Bezeichnung
 * - category: Übergeordnete Kategorie
 * - description: Kurze Beschreibung für KI-Prompt
 * - relatedTopics: Zugehörige Themen aus MATH_TOPICS (für regelbasiertes Mapping)
 * - difficulty: Schwierigkeitsindikator (1-5)
 */

const MATH_COMPETENCIES = {
    // ==================== ALGEBRAISCHE KOMPETENZEN ====================
    algebra_term_simplification: {
        id: 'algebra_term_simplification',
        name: 'Terme vereinfachen',
        category: 'algebra',
        description: 'Zusammenfassen gleichartiger Terme, Ausklammern, Ausmultiplizieren',
        relatedTopics: ['algebra.terme_vereinfachen', 'algebra.faktorisieren'],
        difficulty: 2
    },
    algebra_fractions: {
        id: 'algebra_fractions',
        name: 'Bruchrechnung',
        category: 'algebra',
        description: 'Addition, Subtraktion, Multiplikation, Division von Brüchen; Kürzen und Erweitern',
        relatedTopics: ['algebra.bruchrechnung', 'algebra.bruchgleichungen'],
        difficulty: 2
    },
    algebra_powers: {
        id: 'algebra_powers',
        name: 'Potenzgesetze',
        category: 'algebra',
        description: 'Anwendung der Potenzgesetze, Umformungen mit Potenzen',
        relatedTopics: ['algebra.potenzgesetze', 'algebra.wurzelgesetze'],
        difficulty: 2
    },
    algebra_roots: {
        id: 'algebra_roots',
        name: 'Wurzelrechnung',
        category: 'algebra',
        description: 'Wurzelgesetze, Rationalisieren, Wurzelgleichungen',
        relatedTopics: ['algebra.wurzelgesetze', 'algebra.wurzelgleichungen'],
        difficulty: 3
    },
    algebra_logarithms: {
        id: 'algebra_logarithms',
        name: 'Logarithmengesetze',
        category: 'algebra',
        description: 'Anwendung der Logarithmengesetze, Umformungen',
        relatedTopics: ['algebra.logarithmengesetze', 'algebra.logarithmusgleichungen'],
        difficulty: 3
    },
    algebra_linear_equations: {
        id: 'algebra_linear_equations',
        name: 'Lineare Gleichungen lösen',
        category: 'algebra',
        description: 'Umformen und Lösen linearer Gleichungen',
        relatedTopics: ['algebra.lineare_gleichungen', 'gleichungssysteme.lgs_2x2'],
        difficulty: 1
    },
    algebra_quadratic_equations: {
        id: 'algebra_quadratic_equations',
        name: 'Quadratische Gleichungen lösen',
        category: 'algebra',
        description: 'pq-Formel, Mitternachtsformel, Faktorisieren',
        relatedTopics: ['algebra.quadratische_gleichungen', 'funktionen.quadratisch'],
        difficulty: 2
    },
    algebra_polynomial_equations: {
        id: 'algebra_polynomial_equations',
        name: 'Polynomgleichungen lösen',
        category: 'algebra',
        description: 'Polynomdivision, Substitution, Faktorisierung höhergradiger Gleichungen',
        relatedTopics: ['algebra.polynomgleichungen', 'algebra.polynomdivision'],
        difficulty: 4
    },
    algebra_inequalities: {
        id: 'algebra_inequalities',
        name: 'Ungleichungen lösen',
        category: 'algebra',
        description: 'Lineare und quadratische Ungleichungen, Betragsungleichungen',
        relatedTopics: ['algebra.ungleichungen', 'algebra.betragsgleichungen'],
        difficulty: 3
    },
    algebra_equation_systems: {
        id: 'algebra_equation_systems',
        name: 'Gleichungssysteme lösen',
        category: 'algebra',
        description: 'Einsetzungs-, Gleichsetzungs-, Additionsverfahren; Gauß-Algorithmus',
        relatedTopics: ['gleichungssysteme.lgs_2x2', 'gleichungssysteme.lgs_3x3', 'gleichungssysteme.gaussverfahren'],
        difficulty: 3
    },
    algebra_binomial: {
        id: 'algebra_binomial',
        name: 'Binomische Formeln',
        category: 'algebra',
        description: 'Anwendung der drei binomischen Formeln',
        relatedTopics: ['algebra.binomische_formeln'],
        difficulty: 1
    },
    algebra_factoring: {
        id: 'algebra_factoring',
        name: 'Faktorisieren',
        category: 'algebra',
        description: 'Ausklammern, binomische Formeln rückwärts, Faktorisierung von Polynomen',
        relatedTopics: ['algebra.faktorisieren', 'algebra.polynomdivision'],
        difficulty: 3
    },

    // ==================== ANALYTISCHE KOMPETENZEN (Analysis) ====================
    analysis_limits: {
        id: 'analysis_limits',
        name: 'Grenzwerte berechnen',
        category: 'analysis',
        description: 'Grenzwerte von Folgen und Funktionen, Regel von L\'Hôpital',
        relatedTopics: ['analysis.grenzwerte', 'folgen_reihen.konvergenz'],
        difficulty: 4
    },
    analysis_derivative_basic: {
        id: 'analysis_derivative_basic',
        name: 'Grundlegende Ableitungsregeln',
        category: 'analysis',
        description: 'Potenzregel, Faktorregel, Summenregel',
        relatedTopics: ['analysis.differentialrechnung'],
        difficulty: 2
    },
    analysis_derivative_product: {
        id: 'analysis_derivative_product',
        name: 'Produktregel',
        category: 'analysis',
        description: 'Ableitung von Produkten zweier Funktionen',
        relatedTopics: ['analysis.differentialrechnung'],
        difficulty: 3
    },
    analysis_derivative_quotient: {
        id: 'analysis_derivative_quotient',
        name: 'Quotientenregel',
        category: 'analysis',
        description: 'Ableitung von Quotienten zweier Funktionen',
        relatedTopics: ['analysis.differentialrechnung', 'funktionen.gebrochen_rational'],
        difficulty: 3
    },
    analysis_derivative_chain: {
        id: 'analysis_derivative_chain',
        name: 'Kettenregel',
        category: 'analysis',
        description: 'Ableitung verketteter Funktionen',
        relatedTopics: ['analysis.differentialrechnung', 'funktionen.zusammengesetzte'],
        difficulty: 3
    },
    analysis_curve_sketching: {
        id: 'analysis_curve_sketching',
        name: 'Kurvendiskussion',
        category: 'analysis',
        description: 'Nullstellen, Extrema, Wendepunkte, Symmetrie, Asymptoten',
        relatedTopics: ['analysis.kurvendiskussion'],
        difficulty: 4
    },
    analysis_extrema: {
        id: 'analysis_extrema',
        name: 'Extremwertbestimmung',
        category: 'analysis',
        description: 'Lokale und globale Extrema, notwendige und hinreichende Bedingungen',
        relatedTopics: ['analysis.kurvendiskussion', 'analysis.extremwertaufgaben'],
        difficulty: 3
    },
    analysis_integral_basic: {
        id: 'analysis_integral_basic',
        name: 'Grundlegende Integration',
        category: 'analysis',
        description: 'Stammfunktionen, Potenzregel rückwärts, Faktorregel',
        relatedTopics: ['analysis.integralrechnung'],
        difficulty: 2
    },
    analysis_integral_substitution: {
        id: 'analysis_integral_substitution',
        name: 'Integration durch Substitution',
        category: 'analysis',
        description: 'Substitutionsmethode für Integrale',
        relatedTopics: ['analysis.integralrechnung'],
        difficulty: 4
    },
    analysis_integral_partial: {
        id: 'analysis_integral_partial',
        name: 'Partielle Integration',
        category: 'analysis',
        description: 'Integration durch partielle Integration',
        relatedTopics: ['analysis.integralrechnung'],
        difficulty: 4
    },
    analysis_integral_definite: {
        id: 'analysis_integral_definite',
        name: 'Bestimmte Integrale',
        category: 'analysis',
        description: 'Berechnung bestimmter Integrale, Flächenberechnung',
        relatedTopics: ['analysis.integralrechnung'],
        difficulty: 3
    },
    analysis_optimization: {
        id: 'analysis_optimization',
        name: 'Extremwertaufgaben',
        category: 'analysis',
        description: 'Anwendungsbezogene Optimierungsprobleme',
        relatedTopics: ['analysis.extremwertaufgaben', 'optimierung.extremwertprobleme_opt'],
        difficulty: 4
    },

    // ==================== FUNKTIONEN ====================
    functions_properties: {
        id: 'functions_properties',
        name: 'Funktionseigenschaften',
        category: 'functions',
        description: 'Definitionsbereich, Wertebereich, Symmetrie, Monotonie',
        relatedTopics: ['funktionen.linear', 'funktionen.quadratisch', 'funktionen.polynome'],
        difficulty: 2
    },
    functions_transformations: {
        id: 'functions_transformations',
        name: 'Funktionstransformationen',
        category: 'functions',
        description: 'Verschiebung, Streckung, Spiegelung von Funktionsgraphen',
        relatedTopics: ['funktionen.zusammengesetzte', 'geometrie.transformationen'],
        difficulty: 3
    },
    functions_exponential: {
        id: 'functions_exponential',
        name: 'Exponentialfunktionen',
        category: 'functions',
        description: 'Eigenschaften und Anwendungen von Exponentialfunktionen',
        relatedTopics: ['funktionen.exponential', 'wachstum.exponentielles_wachstum'],
        difficulty: 3
    },
    functions_logarithmic: {
        id: 'functions_logarithmic',
        name: 'Logarithmusfunktionen',
        category: 'functions',
        description: 'Eigenschaften und Anwendungen von Logarithmusfunktionen',
        relatedTopics: ['funktionen.logarithmus'],
        difficulty: 3
    },
    functions_trigonometric: {
        id: 'functions_trigonometric',
        name: 'Trigonometrische Funktionen',
        category: 'functions',
        description: 'Sinus, Kosinus, Tangens und ihre Eigenschaften',
        relatedTopics: ['funktionen.trigonometrisch', 'trigonometrie.sin_cos_tan'],
        difficulty: 3
    },
    functions_inverse: {
        id: 'functions_inverse',
        name: 'Umkehrfunktionen',
        category: 'functions',
        description: 'Bestimmung und Eigenschaften von Umkehrfunktionen',
        relatedTopics: ['funktionen.umkehrfunktionen'],
        difficulty: 3
    },

    // ==================== GEOMETRIE & VEKTOREN ====================
    geometry_vectors_basic: {
        id: 'geometry_vectors_basic',
        name: 'Vektorrechnung Grundlagen',
        category: 'geometry',
        description: 'Vektoraddition, Skalarmultiplikation, Länge, Einheitsvektoren',
        relatedTopics: ['vektoren.vektoraddition', 'vektoren.skalarmultiplikation', 'vektoren.laenge_winkel'],
        difficulty: 2
    },
    geometry_scalar_product: {
        id: 'geometry_scalar_product',
        name: 'Skalarprodukt',
        category: 'geometry',
        description: 'Berechnung und Anwendungen des Skalarprodukts, Winkelberechnung',
        relatedTopics: ['vektoren.skalarprodukt', 'vektoren.orthogonalitaet'],
        difficulty: 3
    },
    geometry_cross_product: {
        id: 'geometry_cross_product',
        name: 'Kreuzprodukt',
        category: 'geometry',
        description: 'Berechnung und Anwendungen des Kreuzprodukts',
        relatedTopics: ['vektoren.kreuzprodukt', 'vektoren.spatprodukt'],
        difficulty: 3
    },
    geometry_lines: {
        id: 'geometry_lines',
        name: 'Geraden im Raum',
        category: 'geometry',
        description: 'Geradengleichungen, Lagebeziehungen, Schnittpunkte',
        relatedTopics: ['analytische_geometrie.geraden_3d', 'analytische_geometrie.lagebeziehungen'],
        difficulty: 3
    },
    geometry_planes: {
        id: 'geometry_planes',
        name: 'Ebenen',
        category: 'geometry',
        description: 'Ebenengleichungen (Parameter-, Koordinaten-, Normalenform), Lagebeziehungen',
        relatedTopics: ['analytische_geometrie.ebenen', 'analytische_geometrie.hessesche_normalform'],
        difficulty: 4
    },
    geometry_distances: {
        id: 'geometry_distances',
        name: 'Abstandsberechnungen',
        category: 'geometry',
        description: 'Abstände zwischen Punkten, Geraden und Ebenen',
        relatedTopics: ['analytische_geometrie.abstaende', 'analytische_geometrie.lotfusspunkt'],
        difficulty: 4
    },
    geometry_trigonometry: {
        id: 'geometry_trigonometry',
        name: 'Trigonometrie im Dreieck',
        category: 'geometry',
        description: 'Sinus- und Kosinussatz, Winkel- und Seitenberechnungen',
        relatedTopics: ['trigonometrie.sinussatz', 'trigonometrie.kosinussatz', 'geometrie.dreiecke'],
        difficulty: 3
    },

    // ==================== STOCHASTIK ====================
    stochastics_probability_basic: {
        id: 'stochastics_probability_basic',
        name: 'Wahrscheinlichkeit Grundlagen',
        category: 'stochastics',
        description: 'Laplace-Wahrscheinlichkeit, Pfadregeln, Baumdiagramme',
        relatedTopics: ['stochastik.grundbegriffe', 'stochastik.laplace', 'stochastik.baumdiagramme'],
        difficulty: 2
    },
    stochastics_conditional: {
        id: 'stochastics_conditional',
        name: 'Bedingte Wahrscheinlichkeit',
        category: 'stochastics',
        description: 'Bedingte Wahrscheinlichkeit, Satz von Bayes, Vierfeldertafel',
        relatedTopics: ['stochastik.bedingte_wahrscheinlichkeit', 'stochastik.satz_von_bayes', 'stochastik.vierfeldertafel'],
        difficulty: 3
    },
    stochastics_distributions: {
        id: 'stochastics_distributions',
        name: 'Wahrscheinlichkeitsverteilungen',
        category: 'stochastics',
        description: 'Binomial-, Normal-, Poissonverteilung',
        relatedTopics: ['verteilungen.binomialverteilung', 'verteilungen.normalverteilung'],
        difficulty: 4
    },
    stochastics_expected_value: {
        id: 'stochastics_expected_value',
        name: 'Erwartungswert und Varianz',
        category: 'stochastics',
        description: 'Berechnung von Erwartungswert, Varianz, Standardabweichung',
        relatedTopics: ['stochastik.erwartungswert', 'stochastik.varianz_standardabweichung'],
        difficulty: 3
    },
    stochastics_hypothesis_testing: {
        id: 'stochastics_hypothesis_testing',
        name: 'Hypothesentests',
        category: 'stochastics',
        description: 'Signifikanztests, Fehler 1. und 2. Art',
        relatedTopics: ['hypothesentests.signifikanztest', 'hypothesentests.fehler_1_art', 'hypothesentests.fehler_2_art'],
        difficulty: 4
    },
    stochastics_combinatorics: {
        id: 'stochastics_combinatorics',
        name: 'Kombinatorik',
        category: 'stochastics',
        description: 'Permutationen, Variationen, Kombinationen, Binomialkoeffizient',
        relatedTopics: ['kombinatorik.permutationen', 'kombinatorik.variationen', 'kombinatorik.kombinationen'],
        difficulty: 3
    },

    // ==================== PROBLEMLÖSUNGS-KOMPETENZEN ====================
    problem_solving_modeling: {
        id: 'problem_solving_modeling',
        name: 'Mathematisches Modellieren',
        category: 'problem_solving',
        description: 'Übersetzung von Textaufgaben in mathematische Modelle',
        relatedTopics: ['finanzmathematik', 'wachstum', 'optimierung'],
        difficulty: 4
    },
    problem_solving_approach: {
        id: 'problem_solving_approach',
        name: 'Lösungsansatz finden',
        category: 'problem_solving',
        description: 'Auswahl geeigneter Methoden und Strategien',
        relatedTopics: [],
        difficulty: 4
    },
    problem_solving_verification: {
        id: 'problem_solving_verification',
        name: 'Ergebnis überprüfen',
        category: 'problem_solving',
        description: 'Probe, Plausibilitätsprüfung, Einheitencheck',
        relatedTopics: [],
        difficulty: 2
    },
    problem_solving_communication: {
        id: 'problem_solving_communication',
        name: 'Mathematisch kommunizieren',
        category: 'problem_solving',
        description: 'Klare Notation, strukturierte Darstellung, Begründungen',
        relatedTopics: ['logik.beweisverfahren'],
        difficulty: 3
    },
    problem_solving_connections: {
        id: 'problem_solving_connections',
        name: 'Zusammenhänge erkennen',
        category: 'problem_solving',
        description: 'Verknüpfung verschiedener mathematischer Gebiete',
        relatedTopics: [],
        difficulty: 4
    }
};

// ==================== KATEGORIEN ====================
const COMPETENCY_CATEGORIES = {
    algebra: {
        id: 'algebra',
        name: 'Algebra',
        icon: 'fa-superscript',
        color: '#3b82f6',
        description: 'Terme, Gleichungen, Ungleichungen'
    },
    analysis: {
        id: 'analysis',
        name: 'Analysis',
        icon: 'fa-chart-line',
        color: '#10b981',
        description: 'Ableitungen, Integrale, Kurvendiskussion'
    },
    functions: {
        id: 'functions',
        name: 'Funktionen',
        icon: 'fa-wave-square',
        color: '#8b5cf6',
        description: 'Funktionstypen und ihre Eigenschaften'
    },
    geometry: {
        id: 'geometry',
        name: 'Geometrie & Vektoren',
        icon: 'fa-shapes',
        color: '#f59e0b',
        description: 'Vektoren, Geraden, Ebenen, Trigonometrie'
    },
    stochastics: {
        id: 'stochastics',
        name: 'Stochastik',
        icon: 'fa-dice',
        color: '#ef4444',
        description: 'Wahrscheinlichkeit, Verteilungen, Tests'
    },
    problem_solving: {
        id: 'problem_solving',
        name: 'Problemlösen',
        icon: 'fa-lightbulb',
        color: '#06b6d4',
        description: 'Modellieren, Strategien, Kommunikation'
    }
};

// ==================== HILFSFUNKTIONEN ====================

/**
 * Gibt alle Kompetenzen als Array zurück
 */
function getAllCompetencies() {
    return Object.values(MATH_COMPETENCIES);
}

/**
 * Gibt alle Kompetenzen einer Kategorie zurück
 */
function getCompetenciesByCategory(categoryId) {
    return Object.values(MATH_COMPETENCIES).filter(c => c.category === categoryId);
}

/**
 * Findet Kompetenzen, die zu einem Thema passen
 * @param {string} topicPath - Format: "hauptthema.unterthema" z.B. "analysis.differentialrechnung"
 */
function getCompetenciesForTopic(topicPath) {
    return Object.values(MATH_COMPETENCIES).filter(c => 
        c.relatedTopics.some(t => t === topicPath || t.startsWith(topicPath + '.') || topicPath.startsWith(t))
    );
}

/**
 * Gibt eine Kompetenz nach ID zurück
 */
function getCompetencyById(competencyId) {
    return MATH_COMPETENCIES[competencyId] || null;
}

/**
 * Validiert eine Kompetenz-ID
 */
function isValidCompetencyId(competencyId) {
    return competencyId in MATH_COMPETENCIES;
}

/**
 * Gibt die Kompetenz-IDs als Array zurück (für KI-Prompt)
 */
function getCompetencyIds() {
    return Object.keys(MATH_COMPETENCIES);
}

/**
 * Generiert eine kompakte Kompetenz-Liste für KI-Prompts
 * Format: "id: Name - Beschreibung"
 */
function getCompetencyListForPrompt() {
    return Object.values(MATH_COMPETENCIES)
        .map(c => `${c.id}: ${c.name} - ${c.description}`)
        .join('\n');
}

/**
 * Generiert eine kategorisierte Kompetenz-Liste für KI-Prompts
 */
function getCategorizedCompetencyListForPrompt() {
    let result = '';
    
    for (const category of Object.values(COMPETENCY_CATEGORIES)) {
        const competencies = getCompetenciesByCategory(category.id);
        if (competencies.length > 0) {
            result += `\n### ${category.name}\n`;
            competencies.forEach(c => {
                result += `- ${c.id}: ${c.name}\n`;
            });
        }
    }
    
    return result;
}

/**
 * Berechnet ein gewichtetes Rating basierend auf Schwierigkeit
 * Schwierigere Kompetenzen werden bei Erfolg höher bewertet
 */
function calculateWeightedRating(baseRating, competencyId, wasSuccessful) {
    const competency = MATH_COMPETENCIES[competencyId];
    if (!competency) return baseRating;
    
    const difficultyFactor = competency.difficulty / 3; // Normalisiert auf ~0.33-1.67
    
    if (wasSuccessful) {
        // Bei Erfolg: Schwierigere Aufgaben geben mehr Punkte
        return Math.min(10, baseRating * difficultyFactor);
    } else {
        // Bei Misserfolg: Leichtere Aufgaben ziehen mehr ab
        return Math.max(1, baseRating * (2 - difficultyFactor));
    }
}

// ==================== EXPORT ====================

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MATH_COMPETENCIES,
        COMPETENCY_CATEGORIES,
        getAllCompetencies,
        getCompetenciesByCategory,
        getCompetenciesForTopic,
        getCompetencyById,
        isValidCompetencyId,
        getCompetencyIds,
        getCompetencyListForPrompt,
        getCategorizedCompetencyListForPrompt,
        calculateWeightedRating
    };
}

// Export für Browser
if (typeof window !== 'undefined') {
    window.CompetencySchema = {
        MATH_COMPETENCIES,
        COMPETENCY_CATEGORIES,
        getAllCompetencies,
        getCompetenciesByCategory,
        getCompetenciesForTopic,
        getCompetencyById,
        isValidCompetencyId,
        getCompetencyIds,
        getCompetencyListForPrompt,
        getCategorizedCompetencyListForPrompt,
        calculateWeightedRating
    };
}
