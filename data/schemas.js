// Data Schemas für DynamoDB und Mock-DB
// Definiert die Datenstrukturen für alle Entitäten

// ==================== User Profile Schema ====================
const UserProfileSchema = {
    tableName: 'MathTutor-UserProfiles',
    primaryKey: 'userId',
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: Unique User ID
        email: 'string',            // User Email
        name: 'string',             // User Name
        grade: 'string',            // Klassenstufe (z.B. '12', 'abitur')
        learningGoal: 'string',     // Lernziel (z.B. 'abitur-prep')
        learningStyle: 'string',    // Lernstil (z.B. 'step-by-step')
        sessionLength: 'string',    // Bevorzugte Session-Länge
        weakTopics: 'array',        // Liste schwacher Themen
        createdAt: 'timestamp',     // Erstellungsdatum
        lastUpdated: 'timestamp',   // Letzte Aktualisierung
        lastLogin: 'timestamp'      // Letzter Login
    },
    
    // Default-Werte für neue Profile
    defaults: {
        grade: '12',
        learningGoal: 'abitur-prep',
        learningStyle: 'step-by-step',
        sessionLength: 'medium',
        weakTopics: []
    }
};

// ==================== Competency Tracking Schema ====================
const CompetencyTrackingSchema = {
    tableName: 'MathTutor-CompetencyTracking',
    primaryKey: 'userId',
    sortKey: 'topic',
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: User ID
        topic: 'string',            // SK: Hauptthema (z.B. 'functions', 'integration')
        overallLevel: 'number',     // Overall Competency Level (1-5)
        subTopics: 'map',           // Sub-Topic Levels { "linear": 4, "quadratic": 3, ... }
        tasksCompleted: 'number',   // Anzahl abgeschlossener Aufgaben
        successRate: 'number',      // Erfolgsrate (0-100)
        averageTime: 'number',      // Durchschnittliche Zeit pro Aufgabe (Sekunden)
        lastPracticed: 'timestamp', // Letztes Mal geübt
        history: 'array',           // Historie der Level-Änderungen
        lastUpdated: 'timestamp'    // Letzte Aktualisierung
    },
    
    // Default-Werte für neue Kompetenzen
    defaults: {
        overallLevel: 3,
        subTopics: {},
        tasksCompleted: 0,
        successRate: 0,
        averageTime: 0,
        history: []
    },
    
    // Verfügbare Hauptthemen
    topics: {
        functions: {
            name: 'Funktionen',
            subTopics: ['linear', 'quadratic', 'exponential', 'trigonometric', 'logarithmic']
        },
        integration: {
            name: 'Integration',
            subTopics: ['basic', 'substitution', 'partial', 'byParts', 'definite']
        },
        differentiation: {
            name: 'Differentiation',
            subTopics: ['basic', 'productRule', 'quotientRule', 'chainRule', 'implicit']
        },
        geometry: {
            name: 'Geometrie',
            subTopics: ['triangles', 'circles', 'vectors', 'coordinates', 'transformations']
        },
        algebra: {
            name: 'Algebra',
            subTopics: ['equations', 'inequalities', 'polynomials', 'systems', 'factoring']
        },
        statistics: {
            name: 'Statistik',
            subTopics: ['descriptive', 'probability', 'distributions', 'hypothesis', 'correlation']
        },
        trigonometry: {
            name: 'Trigonometrie',
            subTopics: ['basicIdentities', 'equations', 'graphing', 'applications', 'inverses']
        }
    }
};

// ==================== Performance Metrics Schema ====================
const PerformanceMetricsSchema = {
    tableName: 'MathTutor-PerformanceMetrics',
    primaryKey: 'userId',
    sortKey: 'timestamp',
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: User ID
        timestamp: 'timestamp',     // SK: Zeitstempel des Events
        metricId: 'string',         // Unique Metric ID
        topic: 'string',            // Thema der Aufgabe
        taskType: 'string',         // Typ der Aufgabe (analyze, generate)
        success: 'boolean',         // War die Lösung erfolgreich?
        timeSpent: 'number',        // Zeit in Sekunden
        hintsUsed: 'number',        // Anzahl genutzter Tipps
        showedSolution: 'boolean',  // Wurde Musterlösung angezeigt?
        attempts: 'number',         // Anzahl Versuche
        errorTypes: 'array',        // Liste von Fehlertypen
        difficulty: 'string',       // Schwierigkeitsgrad der Aufgabe
        fluctuationScore: 'number'  // Performance-Schwankungsindex (0-10)
    },
    
    // Default-Werte für neue Metriken
    defaults: {
        success: false,
        timeSpent: 0,
        hintsUsed: 0,
        showedSolution: false,
        attempts: 1,
        errorTypes: [],
        fluctuationScore: 5
    }
};

// ==================== Behavior Analytics Schema ====================
const BehaviorAnalyticsSchema = {
    tableName: 'MathTutor-BehaviorAnalytics',
    primaryKey: 'userId',
    sortKey: 'behaviorKey',        // Format: behaviorType#timestamp
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: User ID
        behaviorKey: 'string',      // SK: behaviorType#timestamp
        behaviorType: 'string',     // Typ des Verhaltens
        action: 'string',           // Spezifische Aktion
        context: 'map',             // Kontext-Informationen
        frequency: 'number',        // Häufigkeit (für aggregierte Daten)
        timestamp: 'timestamp',     // Zeitstempel
        sessionId: 'string'         // Session ID für Gruppierung
    },
    
    // Verfügbare Verhaltenstypen
    behaviorTypes: {
        SOLUTION_REQUEST: 'solution_request',           // User fordert Musterlösung an
        HINT_REQUEST: 'hint_request',                   // User fordert Tipp an
        TASK_ABANDON: 'task_abandon',                   // User bricht Aufgabe ab
        QUICK_SOLUTION: 'quick_solution',               // User zeigt schnell Lösung an
        SELF_SOLVE_ATTEMPT: 'self_solve_attempt',       // User versucht selbst zu lösen
        TASK_REPEAT: 'task_repeat',                     // User wiederholt Aufgabe
        LONG_PAUSE: 'long_pause',                       // Lange Pause in Session
        RAPID_SWITCHING: 'rapid_switching',             // Schnelles Wechseln zwischen Aufgaben
        HELP_PATTERN: 'help_pattern',                   // Muster bei Hilfe-Anfragen
        PROGRESS_PLATEAU: 'progress_plateau'            // Stagnation im Fortschritt
    },
    
    // Default-Werte
    defaults: {
        frequency: 1,
        context: {}
    }
};

// ==================== Session Schema ====================
const SessionSchema = {
    tableName: 'MathTutor-Sessions',
    primaryKey: 'userId',
    sortKey: 'sessionId',
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: User ID
        sessionId: 'string',        // SK: Unique Session ID
        startTime: 'timestamp',     // Session Start
        endTime: 'timestamp',       // Session Ende
        duration: 'number',         // Dauer in Sekunden
        tasksAttempted: 'number',   // Anzahl versuchter Aufgaben
        tasksCompleted: 'number',   // Anzahl abgeschlossener Aufgaben
        topicsExplored: 'array',    // Liste bearbeiteter Themen
        averagePerformance: 'number', // Durchschnittliche Performance
        motivationScore: 'number',  // Motivations-Score (1-10)
        distractionScore: 'number'  // Ablenkungsscore (0-10)
    },
    
    defaults: {
        tasksAttempted: 0,
        tasksCompleted: 0,
        topicsExplored: [],
        averagePerformance: 0,
        motivationScore: 5,
        distractionScore: 5
    }
};

// ==================== Learning Goals Schema ====================
const LearningGoalsSchema = {
    tableName: 'MathTutor-LearningGoals',
    primaryKey: 'userId',
    sortKey: 'goalId',
    
    attributes: {
        userId: 'string',           // PK: User ID
        goalId: 'string',           // SK: Unique Goal ID
        goalType: 'string',         // Typ des Ziels (topic_mastery, exam_prep, etc.)
        topic: 'string',            // Zugehöriges Thema
        targetLevel: 'number',      // Ziel-Level (1-5)
        currentLevel: 'number',     // Aktuelles Level
        deadline: 'timestamp',      // Deadline (optional)
        progress: 'number',         // Fortschritt in % (0-100)
        milestones: 'array',        // Meilensteine
        status: 'string',           // Status (active, completed, paused)
        createdAt: 'timestamp',
        completedAt: 'timestamp'    // Abschlussdatum (wenn completed)
    },
    
    defaults: {
        currentLevel: 0,
        progress: 0,
        milestones: [],
        status: 'active'
    }
};

// ==================== Error Balance Schema ====================
// Trackt Fehlerbilanzen pro Thema/Unterthema und Fehlertyp
const ErrorBalanceSchema = {
    tableName: 'MathTutor-ErrorBalance',
    primaryKey: 'userId',
    sortKey: 'balanceKey',        // Format: topic#subTopic#errorType
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: User ID
        balanceKey: 'string',       // SK: topic#subTopic#errorType
        topic: 'string',            // Hauptthema
        subTopic: 'string',         // Unterthema (kann leer sein)
        errorType: 'string',        // Fehlertyp: logic, calc, followup, formal
        count: 'number',            // Anzahl Fehler
        recentCount: 'number',      // Anzahl in letzten 7 Tagen
        lastOccurrence: 'timestamp',// Letztes Auftreten
        firstOccurrence: 'timestamp',// Erstes Auftreten
        recentTrend: 'string',      // improving, stable, worsening
        history: 'array',           // Historische Zählungen [{date, count}, ...]
        lastUpdated: 'timestamp'
    },
    
    // Verfügbare Fehlertypen
    errorTypes: {
        LOGIC: 'logic',             // Logikfehler (falscher Ansatz)
        CALC: 'calc',               // Rechenfehler (richtiger Ansatz, falsche Rechnung)
        FOLLOWUP: 'followup',       // Folgefehler (aus vorherigem Fehler)
        FORMAL: 'formal'            // Formaler Fehler (Notation, Darstellung)
    },
    
    defaults: {
        count: 0,
        recentCount: 0,
        recentTrend: 'stable',
        history: []
    }
};

// ==================== Competency Ratings Schema ====================
// Speichert KI-generierte Kompetenz-Bewertungen
const CompetencyRatingsSchema = {
    tableName: 'MathTutor-CompetencyRatings',
    primaryKey: 'userId',
    sortKey: 'competencyId',      // ID aus MATH_COMPETENCIES
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: User ID
        competencyId: 'string',     // SK: Kompetenz-ID aus fixem Schema
        ratings: 'array',           // Letzte N Ratings [{value, timestamp, context}, ...]
        averageRating: 'number',    // Durchschnitt (1-10)
        weightedAverage: 'number',  // Gewichteter Durchschnitt (neuere zählen mehr)
        sampleCount: 'number',      // Anzahl Bewertungen
        confidence: 'string',       // low (<3), medium (3-9), high (>=10)
        trend: 'string',            // improving, stable, declining
        lastPositive: 'timestamp',  // Letztes positives Rating (>=7)
        lastNegative: 'timestamp',  // Letztes negatives Rating (<=4)
        lastUpdated: 'timestamp'
    },
    
    // Confidence-Level basierend auf Sample-Anzahl
    confidenceLevels: {
        LOW: { min: 0, max: 2, label: 'low' },
        MEDIUM: { min: 3, max: 9, label: 'medium' },
        HIGH: { min: 10, max: Infinity, label: 'high' }
    },
    
    defaults: {
        ratings: [],
        averageRating: 5,           // Neutral start
        weightedAverage: 5,
        sampleCount: 0,
        confidence: 'low',
        trend: 'stable'
    }
};

// ==================== Usage Stats Schema ====================
// Trackt Nutzungsstatistiken und Engagement
const UsageStatsSchema = {
    tableName: 'MathTutor-UsageStats',
    primaryKey: 'userId',
    
    // Attribute-Definitionen
    attributes: {
        userId: 'string',           // PK: User ID
        totalSessions: 'number',    // Gesamtanzahl Sessions
        totalTasksAttempted: 'number', // Gesamtanzahl versuchter Aufgaben
        totalTasksCompleted: 'number', // Gesamtanzahl abgeschlossener Aufgaben
        totalTimeSpent: 'number',   // Gesamtzeit in Sekunden
        averageSessionLength: 'number', // Durchschnittliche Session-Länge
        lastActiveDate: 'timestamp',// Letzter aktiver Tag
        firstActiveDate: 'timestamp',// Erster aktiver Tag
        currentStreak: 'number',    // Aktuelle Streak (Tage in Folge)
        longestStreak: 'number',    // Längste Streak
        weeklyActivity: 'map',      // { "2024-W01": 5, "2024-W02": 3, ... }
        monthlyActivity: 'map',     // { "2024-01": 15, "2024-02": 20, ... }
        topicsExplored: 'array',    // Liste aller bearbeiteten Themen
        preferredDifficulty: 'string', // Bevorzugte Schwierigkeit
        peakHour: 'number',         // Uhrzeit mit höchster Aktivität (0-23)
        lastUpdated: 'timestamp'
    },
    
    defaults: {
        totalSessions: 0,
        totalTasksAttempted: 0,
        totalTasksCompleted: 0,
        totalTimeSpent: 0,
        averageSessionLength: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyActivity: {},
        monthlyActivity: {},
        topicsExplored: [],
        preferredDifficulty: 'fortgeschritten',
        peakHour: 16
    }
};

// ==================== Helper Functions ====================

// Validiere Daten gegen Schema
function validateAgainstSchema(data, schema) {
    const errors = [];
    
    for (const [key, type] of Object.entries(schema.attributes)) {
        if (data[key] !== undefined) {
            const value = data[key];
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            
            // Spezielle Behandlung für Timestamp
            if (type === 'timestamp') {
                if (typeof value !== 'string' && !(value instanceof Date)) {
                    errors.push(`${key} should be timestamp (string or Date), got ${actualType}`);
                }
            }
            // Spezielle Behandlung für Map
            else if (type === 'map') {
                if (typeof value !== 'object' || Array.isArray(value)) {
                    errors.push(`${key} should be map (object), got ${actualType}`);
                }
            }
            // Standard-Typen
            else if (type !== actualType) {
                errors.push(`${key} should be ${type}, got ${actualType}`);
            }
        }
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Wende Default-Werte an
function applyDefaults(data, schema) {
    const result = { ...data };
    
    if (schema.defaults) {
        for (const [key, defaultValue] of Object.entries(schema.defaults)) {
            if (result[key] === undefined) {
                // Deep copy für arrays und objects
                if (Array.isArray(defaultValue)) {
                    result[key] = [...defaultValue];
                } else if (typeof defaultValue === 'object' && defaultValue !== null) {
                    result[key] = { ...defaultValue };
                } else {
                    result[key] = defaultValue;
                }
            }
        }
    }
    
    return result;
}

// Generiere Timestamp
function generateTimestamp() {
    return new Date().toISOString();
}

// Generiere Unique ID
function generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UserProfileSchema,
        CompetencyTrackingSchema,
        PerformanceMetricsSchema,
        BehaviorAnalyticsSchema,
        SessionSchema,
        LearningGoalsSchema,
        ErrorBalanceSchema,
        CompetencyRatingsSchema,
        UsageStatsSchema,
        validateAgainstSchema,
        applyDefaults,
        generateTimestamp,
        generateId
    };
}

// Export für Browser
if (typeof window !== 'undefined') {
    window.DataSchemas = {
        UserProfileSchema,
        CompetencyTrackingSchema,
        PerformanceMetricsSchema,
        BehaviorAnalyticsSchema,
        SessionSchema,
        LearningGoalsSchema,
        ErrorBalanceSchema,
        CompetencyRatingsSchema,
        UsageStatsSchema,
        validateAgainstSchema,
        applyDefaults,
        generateTimestamp,
        generateId
    };
}

