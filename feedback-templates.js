// feedback-templates.js - Templates für Feedback-Generierung
// Ersetzt KI-generiertes Feedback durch programmatische Auswahl

const FEEDBACK_TEMPLATES = {
    // ==================== FEHLER-FEEDBACK PRO TYP ====================
    errorFeedback: {
        logic: [
            'Der gewählte Ansatz führt nicht zum Ziel.',
            'Überlege, welche Methode hier besser passt.',
            'Der Lösungsweg ist nicht zielführend.',
            'Prüfe den grundsätzlichen Ansatz nochmal.',
            'Die Strategie muss überdacht werden.',
            'Dieser Weg führt nicht zur Lösung.',
            'Der Ansatz ist leider nicht korrekt.',
            'Hier ist ein Denkfehler passiert.',
            'Die Vorgehensweise ist nicht richtig.',
            'Das Konzept stimmt noch nicht ganz.'
        ],
        calc: [
            'Achte auf die Vorzeichen!',
            'Prüfe die Rechnung nochmal genau.',
            'Ein kleiner Rechenfehler hat sich eingeschlichen.',
            'Die Umformung ist nicht ganz korrekt.',
            'Bei der Berechnung ist etwas schiefgegangen.',
            'Kontrolliere die Zahlen nochmal.',
            'Hier stimmt eine Rechnung nicht.',
            'Überprüfe die mathematische Operation.',
            'Die Zahlen stimmen nicht ganz.',
            'Rechne diesen Schritt nochmal nach.'
        ],
        followup: [
            'Dieser Fehler folgt aus einem früheren.',
            'Korrigiere erst den vorherigen Schritt.',
            'Folgefehler – der ursprüngliche Fehler wirkt sich aus.',
            'Das Ergebnis ist falsch wegen eines früheren Fehlers.',
            'Hier zeigt sich ein vorheriger Fehler.',
            'Die Basis für diesen Schritt war schon falsch.',
            'Dieser Fehler ist eine Konsequenz.',
            'Geh zurück und korrigiere den Ursprungsfehler.'
        ],
        formal: [
            'Die Schreibweise ist nicht ganz sauber.',
            'Achte auf die mathematische Notation.',
            'Die Darstellung könnte präziser sein.',
            'Formale Ungenauigkeit in der Schreibweise.',
            'Die Notation ist nicht ganz korrekt.',
            'Achte auf die korrekte Schreibweise.',
            'Mathematisch korrekt, aber unsauber notiert.'
        ],
        none: [
            'Dieser Schritt ist korrekt!',
            'Richtig gerechnet!',
            'Stimmt so!',
            'Korrekte Umformung!',
            'Gut gemacht!'
        ]
    },

    // ==================== MOTIVATIONS-SÄTZE ====================
    encouragement: [
        'Du bist auf dem richtigen Weg!',
        'Guter Ansatz, weiter so!',
        'Das wird schon, bleib dran!',
        'Fehler sind Lernchancen!',
        'Beim nächsten Mal klappt es bestimmt!',
        'Du hast das Prinzip verstanden!',
        'Nur noch ein kleiner Schritt!',
        'Du machst Fortschritte!',
        'Lass dich nicht entmutigen!',
        'Das Verständnis ist da, nur die Ausführung hapert.',
        'Mit etwas Übung wird das perfekt!',
        'Du bist näher an der Lösung als du denkst!',
        'Jeder Fehler bringt dich der Lösung näher!',
        'Kopf hoch, das schaffst du!',
        'Der Weg ist das Ziel – und du bist unterwegs!',
        'Gut analysiert, jetzt noch korrekt rechnen!',
        'Fast geschafft, nur noch Details korrigieren!',
        'Du zeigst gutes mathematisches Denken!',
        'Die Grundidee stimmt, nur die Umsetzung braucht Feinschliff.',
        'Bleib dran, du entwickelst dich super!'
    ],

    // ==================== LOB-SÄTZE ====================
    praise: [
        'Perfekt gelöst!',
        'Sehr gut, alles richtig!',
        'Exzellente Arbeit!',
        'Mathematisch einwandfrei!',
        'Sauber durchgerechnet!',
        'Hervorragend!',
        'Tadellos!',
        'Großartig gemacht!',
        'Vorbildlich gelöst!',
        'Ausgezeichnet!',
        'Brillant!',
        'Sehr präzise gearbeitet!',
        'Korrekt und elegant!',
        'Top Leistung!',
        'Das sitzt!',
        'Genau so macht man das!',
        'Musterlösung!',
        'Fehlerfreie Arbeit!',
        'Das hast du drauf!',
        'Makellos!'
    ],

    // ==================== HINT-LABELS PRO FEHLERTYP ====================
    // Level 1: WARUM-Fragen - helfen zu verstehen, warum der Ansatz nicht stimmt
    // Level 2: WIE-Hinweise - konkrete Hilfe zur richtigen Lösung
    hintLabels: {
        logic: {
            // Level 1: Indirekte Fragen zum Nachdenken (WARUM ist das falsch?)
            level1: [
                'Führt dieser Ansatz zum Ziel?',
                'Ist diese Methode hier anwendbar?',
                'Stimmt die Voraussetzung?',
                'Passt das Verfahren zur Aufgabe?',
                'Welche Bedingung wurde übersehen?',
                'Ist der Startpunkt richtig gewählt?',
                'Gilt diese Annahme hier?',
                'Was sagt die Aufgabenstellung genau?'
            ],
            // Level 2: Konkrete Hinweise (WIE geht es richtig?)
            level2: [
                'Probiere einen anderen Ansatz: Was ist gegeben und was gesucht?',
                'Lies die Aufgabe nochmal und notiere die wichtigen Informationen.',
                'Überlege, welche Formel oder Methode hier passt.',
                'Zerlege das Problem in kleinere Teilschritte.',
                'Prüfe, ob du alle Voraussetzungen erfüllst.',
                'Skizziere das Problem, um einen Überblick zu bekommen.',
                'Welches Standardverfahren passt zu diesem Aufgabentyp?',
                'Beginne nochmal von vorn mit einem klareren Plan.'
            ]
        },
        calc: {
            // Level 1: Indirekte Fragen (WARUM stimmt die Rechnung nicht?)
            level1: [
                'Stimmt das Ergebnis dieser Rechnung?',
                'Was passiert mit dem Vorzeichen?',
                'Ist die Reihenfolge der Operationen korrekt?',
                'Wurde richtig eingesetzt?',
                'Stimmen die Zwischenschritte?',
                'Ist die Umformung erlaubt?',
                'Wurde etwas vergessen?',
                'Kontrolliere diesen Schritt nochmal.'
            ],
            // Level 2: Konkrete Hinweise (WIE korrigiert man es?)
            level2: [
                'Rechne diesen Schritt nochmal Zeile für Zeile nach.',
                'Achte auf Vorzeichen: Was ist (-a)·(-b)?',
                'Prüfe die Klammerauflösung Schritt für Schritt.',
                'Bei Brüchen: Hauptnenner bilden, dann addieren.',
                'Punkt vor Strich – ist die Reihenfolge richtig?',
                'Setze die Werte nochmal sauber ein.',
                'Vereinfache erst, dann rechne weiter.',
                'Mach eine Probe mit dem Ergebnis.'
            ]
        },
        followup: {
            // Level 1: Hinweis auf früheren Fehler (WARUM ist alles danach falsch?)
            level1: [
                'Dieser Fehler stammt von einem früheren Schritt.',
                'Die Basis für diesen Schritt war schon falsch.',
                'Wo ist der ursprüngliche Fehler?',
                'Ein vorheriger Schritt enthält den eigentlichen Fehler.'
            ],
            // Level 2: Konkrete Hilfe (WIE findet und korrigiert man den Ursprungsfehler?)
            level2: [
                'Geh zum markierten Fehler zurück und korrigiere dort zuerst.',
                'Finde den ersten Fehler im Lösungsweg und arbeite von dort weiter.',
                'Nach der Korrektur des Ursprungsfehlers musst du alles danach neu rechnen.',
                'Die Fehlerkette beginnt weiter oben – starte dort.'
            ]
        },
        formal: {
            // Level 1: Hinweis auf formale Mängel (WARUM ist die Darstellung problematisch?)
            level1: [
                'Ist die Schreibweise mathematisch korrekt?',
                'Fehlt hier etwas in der Notation?',
                'Stimmt die Darstellung?',
                'Ist das eindeutig formuliert?'
            ],
            // Level 2: Konkrete Hilfe (WIE schreibt man es richtig?)
            level2: [
                'Verwende die korrekte mathematische Notation.',
                'Schreibe Einheiten mit dazu.',
                'Klammern helfen bei der Übersichtlichkeit.',
                'Formeln sollten vollständig und lesbar sein.'
            ]
        }
    },

    // ==================== TIPPS PRO THEMA ====================
    tips: {
        algebra: [
            'Merke: Was du links machst, machst du auch rechts.',
            'Terme erst vereinfachen, dann lösen.',
            'Negative Zahlen in Klammern setzen.',
            'Beim Ausmultiplizieren: Jeder mit jedem!',
            'Brüche: Erst Hauptnenner finden.',
            'Potenzen: Bei Multiplikation Exponenten addieren.',
            'Wurzeln: Nur aus positiven Zahlen ziehen.',
            'Gleichungen: Immer Probe machen!',
            'Ungleichungen: Vorzeichen beim Multiplizieren beachten.',
            'Formeln: Erst umstellen, dann einsetzen.'
        ],
        geometrie: [
            'Immer eine Skizze anfertigen!',
            'Einheiten konsequent umrechnen.',
            'Formeln vor dem Einsetzen aufschreiben.',
            'Pythagoras: a² + b² = c² (nur im rechtwinkligen Dreieck!)',
            'Kreisumfang: U = 2πr',
            'Kreisfläche: A = πr²',
            'Dreiecksfläche: A = ½ · g · h',
            'Volumen Quader: V = a · b · c',
            'Oberfläche: Alle Seiten einzeln berechnen!',
            'Winkel im Dreieck: Summe immer 180°'
        ],
        analysis: [
            'Ableitung = Steigung der Tangente.',
            'Nullstellen: f(x) = 0 setzen.',
            'Extremstellen: f\'(x) = 0 und f\'\'(x) prüfen.',
            'Wendepunkte: f\'\'(x) = 0 und f\'\'\'(x) ≠ 0.',
            'Integral = Fläche unter der Kurve.',
            'Kettenregel: Äußere mal innere Ableitung.',
            'Produktregel: u\'v + uv\'',
            'Quotientenregel: (u\'v - uv\') / v²',
            'Stammfunktion: Exponent +1, dann durch neuen Exponenten teilen.',
            'Grenzwerte: L\'Hospital bei 0/0 oder ∞/∞.'
        ],
        stochastik: [
            'Wahrscheinlichkeit: Günstige durch mögliche Fälle.',
            'Baumdiagramm für mehrstufige Versuche.',
            'Pfadregeln: Multiplizieren entlang, Addieren parallel.',
            'Erwartungswert: Summe von (Wert × Wahrscheinlichkeit).',
            'Varianz: E(X²) - E(X)²',
            'Binomialverteilung: n über k · p^k · (1-p)^(n-k)',
            'Normalverteilung: z-Wert bestimmen, Tabelle nutzen.',
            'Unabhängigkeit: P(A∩B) = P(A)·P(B)',
            'Bedingte Wahrscheinlichkeit: P(A|B) = P(A∩B)/P(B)',
            'Kombinatorik: Mit/ohne Wiederholung, mit/ohne Reihenfolge.'
        ],
        lineare_algebra: [
            'Matrizen: Zeilen mal Spalten.',
            'Determinante 2x2: ad - bc',
            'Inverse Matrix: Nur wenn det ≠ 0',
            'Gauß-Algorithmus: Systematisch eliminieren.',
            'Eigenwerte: det(A - λI) = 0',
            'Vektoren: Komponentenweise rechnen.',
            'Skalarprodukt: a·b = |a|·|b|·cos(φ)',
            'Kreuzprodukt: Nur in 3D, Ergebnis steht senkrecht.',
            'Lineare Unabhängigkeit: Determinante ≠ 0',
            'Basiswechsel: Koordinaten transformieren.'
        ],
        trigonometrie: [
            'sin²(x) + cos²(x) = 1',
            'tan(x) = sin(x) / cos(x)',
            'Sinussatz: a/sin(α) = b/sin(β) = c/sin(γ)',
            'Kosinussatz: c² = a² + b² - 2ab·cos(γ)',
            'Einheitskreis: x = cos(φ), y = sin(φ)',
            'Periode: sin und cos haben 2π, tan hat π.',
            'Amplitude = Faktor vor sin/cos.',
            'Phasenverschiebung beachten.',
            'Bogenmaß: π entspricht 180°.',
            'Arcusfunktionen: Winkel aus Verhältnis.'
        ]
    },

    // ==================== STÄRKEN-TEMPLATES ====================
    strengths: {
        general: [
            'Gutes mathematisches Verständnis gezeigt',
            'Strukturierter Lösungsansatz',
            'Saubere Notation verwendet',
            'Korrekter Rechenweg erkannt',
            'Aufgabenstellung richtig erfasst',
            'Logischer Gedankengang',
            'Alle relevanten Formeln bekannt'
        ],
        correct_steps: [
            'Die ersten Schritte waren korrekt',
            'Der Ansatz war richtig',
            'Die Grundidee stimmt',
            'Guter Start in die Aufgabe',
            'Korrekte Vorüberlegungen'
        ],
        partial_success: [
            'Einige Schritte waren vollständig korrekt',
            'Das Konzept wurde verstanden',
            'Die Methode war richtig gewählt',
            'Gute Zwischenergebnisse erzielt'
        ]
    },

    // ==================== SCHWÄCHEN-TEMPLATES ====================
    weaknesses: {
        logic: [
            'Der gewählte Lösungsweg war nicht zielführend',
            'Die Methode passte nicht zur Aufgabe',
            'Konzeptioneller Fehler im Ansatz'
        ],
        calc: [
            'Rechenfehler bei der Umformung',
            'Vorzeichenfehler aufgetreten',
            'Zahlenwerte falsch übernommen'
        ],
        followup: [
            'Folgefehler durch früheren Fehler',
            'Fehlerhafte Zwischenergebnisse weiterverwendet'
        ],
        formal: [
            'Ungenaue mathematische Notation',
            'Fehlende Einheiten',
            'Schreibweise nicht korrekt'
        ]
    },

    // ==================== ZUSAMMENFASSUNGS-TEMPLATES ====================
    summary: {
        correct: [
            'Sehr gut! Alle Schritte sind mathematisch korrekt.',
            'Perfekt gelöst! Der Lösungsweg ist einwandfrei.',
            'Exzellent! Du hast die Aufgabe fehlerfrei bearbeitet.',
            'Hervorragend! Alles richtig gemacht.'
        ],
        partial: [
            'Guter Ansatz! Bei einigen Schritten sind kleine Fehler passiert.',
            'Die Grundidee stimmt, aber es gibt noch Verbesserungspotential.',
            'Fast richtig! Nur wenige Korrekturen nötig.',
            'Du bist auf dem richtigen Weg, aber prüfe die markierten Schritte.'
        ],
        major_errors: [
            'Der Lösungsweg enthält einige Fehler. Prüfe die markierten Stellen.',
            'Hier sind mehrere Korrekturen nötig. Schau dir die Hinweise an.',
            'Der Ansatz muss überdacht werden. Die Tipps helfen dir weiter.'
        ],
        wrong_approach: [
            'Der gewählte Ansatz führt nicht zum Ziel. Überlege eine andere Strategie.',
            'Die Methode passt nicht zur Aufgabe. Versuche einen anderen Weg.',
            'Hier ist ein grundsätzlicher Denkfehler. Lies die Aufgabe nochmal genau.'
        ]
    },

    // ==================== THEORIE-AUFGABEN FEEDBACK ====================
    theoryFeedback: {
        // Feedback für Definitions-Aufgaben
        definition: {
            correct: [
                'Perfekt! Die Definition ist mathematisch präzise und vollständig.',
                'Sehr gut! Du hast alle wesentlichen Aspekte der Definition erfasst.',
                'Ausgezeichnet! Eine korrekte und vollständige Definition.',
                'Genau richtig! Die Definition ist mathematisch einwandfrei.'
            ],
            partial: [
                'Die Definition enthält wichtige Aspekte, ist aber nicht vollständig.',
                'Guter Ansatz! Ein paar wesentliche Punkte fehlen noch.',
                'Du bist auf dem richtigen Weg, aber die Definition ist unvollständig.',
                'Die Grundidee stimmt, aber es fehlen wichtige Details.'
            ],
            incorrect: [
                'Diese Definition ist leider nicht korrekt.',
                'Die Definition trifft nicht den mathematischen Kern.',
                'Hier liegt ein Missverständnis vor. Lies die Definition nochmal nach.',
                'Die Aussage ist mathematisch nicht richtig.'
            ],
            missing_precision: [
                'Die Definition ist zu ungenau formuliert.',
                'Mathematische Präzision fehlt – achte auf exakte Formulierungen.',
                'Die Aussage ist zu vage. Definitionen müssen präzise sein.',
                'Sei mathematisch genauer – jedes Wort zählt in einer Definition.'
            ]
        },
        // Feedback für Erklärungs-Aufgaben
        explanation: {
            correct: [
                'Sehr gut erklärt! Deine Darstellung ist klar und verständlich.',
                'Ausgezeichnete Erklärung! Alle wichtigen Aspekte werden behandelt.',
                'Perfekt! Eine nachvollziehbare und vollständige Erklärung.',
                'Genau richtig! Du hast den Sachverhalt verständlich dargestellt.'
            ],
            partial: [
                'Gute Erklärung, aber einige Aspekte könnten noch vertieft werden.',
                'Du hast die Hauptpunkte erfasst, aber die Erklärung ist nicht vollständig.',
                'Der Ansatz stimmt, aber wichtige Zusammenhänge fehlen.',
                'Fast vollständig! Ergänze noch die fehlenden Details.'
            ],
            incorrect: [
                'Diese Erklärung ist leider nicht zutreffend.',
                'Hier liegt ein Missverständnis vor.',
                'Die Zusammenhänge sind nicht richtig dargestellt.',
                'Die Erklärung geht am eigentlichen Punkt vorbei.'
            ]
        },
        // Feedback für Beweise
        proof: {
            correct: [
                'Ausgezeichneter Beweis! Logisch schlüssig und vollständig.',
                'Perfekt! Der Beweis ist mathematisch einwandfrei.',
                'Sehr gut! Alle Schritte sind nachvollziehbar begründet.',
                'Brillant! Ein korrekter und eleganter Beweis.'
            ],
            partial: [
                'Der Beweisansatz stimmt, aber es fehlen wichtige Schritte.',
                'Gute Idee! Der Beweis ist aber noch nicht vollständig.',
                'Die Beweisstruktur ist richtig, aber Lücken sind vorhanden.',
                'Fast geschafft! Einige Schritte müssen noch begründet werden.'
            ],
            incorrect: [
                'Der Beweis enthält einen logischen Fehler.',
                'Die Schlussfolgerung ist nicht korrekt.',
                'Der Beweisansatz führt nicht zum Ziel.',
                'Hier ist ein Fehlschluss passiert.'
            ],
            missing_rigor: [
                'Der Beweis ist nicht streng genug.',
                'Es fehlen wichtige Begründungen für die Schritte.',
                'Behauptungen müssen mathematisch begründet werden.',
                'Der Beweis springt zu schnell zu Schlussfolgerungen.'
            ]
        },
        // Feedback für Vergleiche
        comparison: {
            correct: [
                'Sehr guter Vergleich! Unterschiede und Gemeinsamkeiten sind klar dargestellt.',
                'Ausgezeichnet! Du hast beide Konzepte richtig gegenübergestellt.',
                'Perfekt! Ein präziser und vollständiger Vergleich.',
                'Genau richtig! Alle relevanten Aspekte wurden verglichen.'
            ],
            partial: [
                'Guter Ansatz, aber der Vergleich ist nicht vollständig.',
                'Einige Unterschiede wurden erkannt, aber andere fehlen.',
                'Die Gemeinsamkeiten stimmen, aber bei den Unterschieden fehlt etwas.',
                'Der Vergleich könnte detaillierter sein.'
            ],
            incorrect: [
                'Die Unterschiede wurden nicht richtig erkannt.',
                'Hier werden Äpfel mit Birnen verglichen – die Aspekte passen nicht zusammen.',
                'Der Vergleich enthält sachliche Fehler.',
                'Die Gegenüberstellung ist nicht korrekt.'
            ]
        },
        // Feedback für Beispiele
        example: {
            correct: [
                'Sehr gutes Beispiel! Es illustriert den Begriff perfekt.',
                'Ausgezeichnet! Ein passendes und korrektes Beispiel.',
                'Perfekt! Das Beispiel trifft genau den Kern.',
                'Genau richtig! Ein anschauliches Beispiel.'
            ],
            partial: [
                'Das Beispiel passt, könnte aber genauer sein.',
                'Guter Ansatz, aber das Beispiel ist nicht vollständig ausgeführt.',
                'Das Beispiel ist richtig, aber es fehlt die Begründung.',
                'Fast! Das Beispiel hat kleine Ungenauigkeiten.'
            ],
            incorrect: [
                'Das Beispiel passt leider nicht zum gefragten Begriff.',
                'Das ist kein gültiges Beispiel für diesen Fall.',
                'Das Beispiel enthält einen Fehler.',
                'Dieses Beispiel erfüllt nicht die geforderten Bedingungen.'
            ]
        }
    },

    // ==================== THEORIE HINT-LABELS ====================
    theoryHintLabels: {
        definition: {
            level1: [
                'Definition prüfen',
                'Präziser formulieren',
                'Was fehlt?',
                'Wesentliches vergessen',
                'Genauer werden'
            ],
            level2: [
                'Welche Bedingungen gehören zur Definition?',
                'Denke an alle notwendigen Eigenschaften',
                'Was unterscheidet diesen Begriff von ähnlichen?',
                'Prüfe die mathematische Präzision'
            ]
        },
        explanation: {
            level1: [
                'Mehr erklären',
                'Zusammenhänge zeigen',
                'Warum?',
                'Begründung fehlt',
                'Vertiefen'
            ],
            level2: [
                'Erkläre den Zusammenhang zwischen den Konzepten',
                'Warum gilt diese Aussage?',
                'Was ist die Ursache für dieses Verhalten?',
                'Verbinde die einzelnen Aspekte'
            ]
        },
        proof: {
            level1: [
                'Beweis unvollständig',
                'Lücke im Beweis',
                'Begründung fehlt',
                'Logikfehler',
                'Schritt fehlt'
            ],
            level2: [
                'Welche Annahme brauchst du?',
                'Wie folgt dieser Schritt aus dem vorherigen?',
                'Ist die Schlussfolgerung gerechtfertigt?',
                'Was muss noch gezeigt werden?'
            ]
        },
        comparison: {
            level1: [
                'Unterschied vergessen',
                'Gemeinsamkeit fehlt',
                'Genauer vergleichen',
                'Aspekt übersehen'
            ],
            level2: [
                'Was haben beide Konzepte gemeinsam?',
                'Worin unterscheiden sie sich genau?',
                'Gibt es noch weitere Aspekte zum Vergleichen?'
            ]
        },
        example: {
            level1: [
                'Beispiel prüfen',
                'Passt das?',
                'Anderes Beispiel',
                'Begründung fehlt'
            ],
            level2: [
                'Erfüllt dein Beispiel alle Bedingungen?',
                'Erkläre, warum das ein gültiges Beispiel ist',
                'Gibt es ein einfacheres Beispiel?'
            ]
        }
    },

    // ==================== ANTWORTSATZ FEEDBACK ====================
    answerSentenceFeedback: {
        missing: [
            'Vergiss den Antwortsatz nicht! Eine Textaufgabe braucht eine vollständige Antwort.',
            'Der Rechenweg ist gut, aber der Antwortsatz fehlt noch.',
            'Bei Sachaufgaben gehört immer ein Antwortsatz dazu.',
            'Formuliere das Ergebnis als vollständigen Antwortsatz.',
            'Die Rechnung stimmt, aber beantworte die Frage auch in Worten!'
        ],
        incomplete: [
            'Der Antwortsatz ist unvollständig. Nenne auch die Einheit!',
            'Im Antwortsatz fehlt der Bezug zur Aufgabenstellung.',
            'Ergänze den Antwortsatz um die fehlenden Informationen.',
            'Der Antwortsatz sollte die Frage vollständig beantworten.'
        ],
        wrong_unit: [
            'Achte auf die richtige Einheit im Antwortsatz!',
            'Die Einheit im Antwortsatz passt nicht zur Aufgabe.',
            'Prüfe nochmal, welche Einheit das Ergebnis haben sollte.',
            'Im Antwortsatz steht die falsche Einheit.'
        ],
        grammatically_incorrect: [
            'Der Antwortsatz könnte grammatikalisch besser formuliert sein.',
            'Formuliere den Antwortsatz als vollständigen Satz.',
            'Achte auf eine saubere Formulierung des Antwortsatzes.'
        ],
        context_missing: [
            'Der Antwortsatz sollte den Kontext der Aufgabe aufgreifen.',
            'Beziehe dich im Antwortsatz auf die Personen/Situation aus der Aufgabe.',
            'Ein guter Antwortsatz enthält den Kontext der Sachaufgabe.'
        ],
        correct: [
            'Sehr gut! Der Antwortsatz ist vollständig und korrekt.',
            'Perfekt formuliert! Ergebnis, Einheit und Kontext stimmen.',
            'Genau so! Ein vorbildlicher Antwortsatz.',
            'Ausgezeichnet! Die Antwort ist vollständig und richtig.'
        ]
    },

    // ==================== THEORIE ZUSAMMENFASSUNGEN ====================
    theorySummary: {
        excellent: [
            'Ausgezeichnet! Du zeigst ein tiefes Verständnis der Theorie.',
            'Perfekt! Alle Konzepte wurden korrekt und präzise dargestellt.',
            'Hervorragend! Eine mathematisch einwandfreie Bearbeitung.',
            'Exzellent! Du beherrschst die theoretischen Grundlagen sehr gut.'
        ],
        good: [
            'Gut gemacht! Du hast die wesentlichen Konzepte verstanden.',
            'Solide Arbeit! Die meisten Aspekte sind korrekt.',
            'Sehr ordentlich! Nur kleine Details könnten noch verbessert werden.',
            'Gute Leistung! Du zeigst ein gutes Verständnis der Materie.'
        ],
        partial: [
            'Guter Ansatz, aber einige Konzepte sind noch nicht ganz verstanden.',
            'Du bist auf dem richtigen Weg, aber es gibt noch Lücken.',
            'Die Grundideen stimmen, aber die Ausführung braucht noch Arbeit.',
            'Teilweise richtig, aber wichtige Aspekte fehlen oder sind ungenau.'
        ],
        needs_work: [
            'Hier gibt es noch einiges zu verbessern. Schau dir die Erklärungen an.',
            'Die theoretischen Grundlagen sind noch nicht gefestigt.',
            'Einige Konzepte wurden missverstanden. Wiederhole die Theorie.',
            'Es sind mehrere Korrekturen nötig. Die Hinweise helfen dir weiter.'
        ],
        incorrect: [
            'Die Antworten zeigen grundlegende Missverständnisse.',
            'Hier liegt ein konzeptionelles Problem vor. Lies die Theorie nochmal.',
            'Die theoretischen Konzepte wurden nicht richtig erfasst.',
            'Es sind grundlegende Fehler vorhanden. Beginne nochmal von vorn.'
        ]
    }
};

// ==================== FEEDBACK-GENERIERUNGS-FUNKTIONEN ====================

/**
 * Generiert Hints basierend auf der Analyse
 * Level 1: LEITFRAGEN die den Schüler zum Nachdenken anregen (als Fragen formuliert!)
 * Level 2: Konstruktive Hinweise WIE man es lösen könnte
 * 
 * WICHTIG: Folgefehler bekommen KEINE Hints - nur echte Fehler brauchen Hilfe!
 */
function generateHintsFromAnalysis(analysis) {
    const hints = { level1: [], level2: [] };
    
    if (!analysis || !analysis.steps) return hints;
    
    // Alle Fehler-Schritte
    const allErrorSteps = analysis.steps.filter(s => s.errorType && s.errorType !== 'none');
    
    // WICHTIG: Folgefehler filtern - diese brauchen keine eigenen Hints!
    // Wenn der ursprüngliche Fehler behoben wird, verschwinden Folgefehler automatisch
    const realErrorSteps = allErrorSteps.filter(s => s.errorType !== 'followup');
    
    if (realErrorSteps.length === 0) {
        // Wenn nur Folgefehler vorhanden sind, gib einen generischen Hint
        if (allErrorSteps.length > 0) {
            hints.level1.push({
                hintLevel: 1,
                category: 'followup_notice',
                label: 'Wo liegt der ursprüngliche Fehler, der zu den Folgefehlern geführt hat?',
                color: 'orange'
            });
        }
        return hints;
    }
    
    // Hilfsfunktion: Stelle sicher dass der Hint als Frage formuliert ist
    const ensureQuestionFormat = (text) => {
        if (!text) return 'Stimmt dieser Schritt?';
        text = text.trim();
        // Wenn bereits eine Frage, übernehmen
        if (text.endsWith('?')) return text;
        // Kurze Labels in Fragen umwandeln
        if (text.length < 30) {
            // Typische Keywords die auf Fehler hinweisen
            if (text.toLowerCase().includes('vorzeichen')) return 'Stimmt das Vorzeichen hier?';
            if (text.toLowerCase().includes('reihenfolge')) return 'Ist die Reihenfolge der Operationen korrekt?';
            if (text.toLowerCase().includes('klammer')) return 'Wurde die Klammer richtig aufgelöst?';
            if (text.toLowerCase().includes('formel')) return 'Wurde die richtige Formel angewendet?';
            if (text.toLowerCase().includes('ansatz')) return 'Führt dieser Ansatz zum Ziel?';
            // Generische Umwandlung
            return `${text} - stimmt das?`;
        }
        // Längere Texte: Fragezeichen anhängen wenn sinnvoll
        return text.endsWith('.') ? text.slice(0, -1) + '?' : text + '?';
    };
    
    // ==================== LEVEL 1: LEITFRAGEN ====================
    // Nutze AI-generierte hintQuestion die auf den konkreten Fehler zeigt
    const firstError = realErrorSteps[0];
    const fallbackLabelsL1 = FEEDBACK_TEMPLATES.hintLabels[firstError.errorType]?.level1 || ['Stimmt dieser Schritt?'];
    const firstLabel = ensureQuestionFormat(firstError.hintQuestion || pickRandom(fallbackLabelsL1));
    
    hints.level1.push({
        hintLevel: 1,
        category: firstError.errorType === 'logic' ? 'wrong_method' : 'missing_step',
        label: firstLabel,
        color: firstError.errorType === 'logic' ? 'orange' : 'yellow'
    });
    
    // Zweiten Level-1 Hint hinzufügen, wenn verschiedene ECHTE Fehlertypen vorliegen
    const uniqueRealErrorTypes = [...new Set(realErrorSteps.map(s => s.errorType))];
    if (uniqueRealErrorTypes.length > 1) {
        const secondType = uniqueRealErrorTypes.find(t => t !== firstError.errorType);
        const secondError = realErrorSteps.find(s => s.errorType === secondType);
        const secondFallbackLabels = FEEDBACK_TEMPLATES.hintLabels[secondType]?.level1 || [];
        
        if (secondFallbackLabels.length > 0 || secondError?.hintQuestion) {
            const secondLabel = ensureQuestionFormat(secondError?.hintQuestion || pickRandom(secondFallbackLabels));
            hints.level1.push({
                hintLevel: 1,
                category: secondType === 'logic' ? 'wrong_method' : 'missing_step',
                label: secondLabel,
                color: secondType === 'calc' ? 'yellow' : 'orange'
            });
        }
    }
    
    // Dritten Hint hinzufügen wenn nur ein Fehlertyp aber mehrere Fehler
    if (uniqueRealErrorTypes.length === 1 && realErrorSteps.length > 1) {
        const thirdError = realErrorSteps[1];
        if (thirdError.hintQuestion && thirdError.hintQuestion !== firstError.hintQuestion) {
            hints.level1.push({
                hintLevel: 1,
                category: 'missing_step',
                label: ensureQuestionFormat(thirdError.hintQuestion),
                color: 'yellow'
            });
        }
    }
    
    // ==================== LEVEL 2: LÖSUNGSKONZEPT ANDEUTEN ====================
    // NICHT Level 1 wiederholen! Level 1 zeigt WO der Fehler ist,
    // Level 2 gibt Hinweis WIE man es lösen könnte
    // NUR für echte Fehler, KEINE Folgefehler!
    realErrorSteps.slice(0, 3).forEach(step => {
        const level2Approaches = FEEDBACK_TEMPLATES.hintLabels[step.errorType]?.level2 || ['Überdenke diesen Schritt nochmal.'];
        let solutionApproach = pickRandom(level2Approaches);
        
        // Wenn eine Operation bekannt ist, spezifischeren Hinweis generieren
        if (step.operation) {
            const op = step.operation.toLowerCase();
            if (op.includes('subst')) {
                solutionApproach = 'Führe die Substitution sorgfältig durch und vergiss nicht, auch die Grenzen anzupassen.';
            } else if (op.includes('partial')) {
                solutionApproach = 'Prüfe erst ob der Grad des Zählers kleiner ist als der des Nenners.';
            } else if (op.includes('grenz') || op.includes('lim')) {
                solutionApproach = 'Versuche die Summe erst aufzuteilen bevor du den Grenzwert bildest.';
            }
        }
        
        hints.level2.push({
            hintLevel: 2,
            category: step.errorType === 'calc' ? 'formula_hint' : 'step_sequence',
            stepIndex: step.index,
            solutionApproach: solutionApproach,
            latex: '',  // Nur wenn relevant
            color: step.errorType === 'calc' ? 'green' : 'blue'
        });
    });
    
    return hints;
}

/**
 * Generiert detailliertes Feedback basierend auf der Analyse
 * - Stärken beschreiben KONKRETE KONZEPTE die verstanden wurden (nicht generisch!)
 * - Schwächen geben SPEZIFISCHE Lernempfehlungen für JEDEN Fehlertyp
 * - Tipps sind aufgabenspezifische MERKSÄTZE (keine generischen Phrasen!)
 */
function generateDetailedFeedback(analysis, topic = 'algebra') {
    if (!analysis || !analysis.steps) {
        return {
            strengths: [],
            weaknesses: [],
            tips: [],
            encouragement: pickRandom(FEEDBACK_TEMPLATES.encouragement)
        };
    }
    
    // Fehler-Kategorisierung
    const allErrorSteps = analysis.steps.filter(s => s.errorType && s.errorType !== 'none');
    const realErrorSteps = allErrorSteps.filter(s => s.errorType !== 'followup');
    const correctSteps = analysis.steps.filter(s => s.errorType === 'none');
    
    // Fehlertypen
    const realErrorTypes = [...new Set(realErrorSteps.map(s => s.errorType))];
    const hasLogicError = realErrorTypes.includes('logic');
    const hasCalcError = realErrorTypes.includes('calc');
    const hasFormalError = realErrorTypes.includes('formal');
    
    // Hilfsfunktion: Operation zu Konzept-Beschreibung
    const operationToConceptName = (op) => {
        if (!op) return null;
        const opLower = op.toLowerCase();
        if (opLower.includes('zgf') || opLower.includes('zusammen')) return 'das Zusammenfassen von Termen';
        if (opLower.includes('ausklammer') || opLower.includes('faktor')) return 'das Ausklammern (Distributivgesetz)';
        if (opLower.includes('ausmult') || opLower.includes('auflös')) return 'das Ausmultiplizieren';
        if (opLower.includes('ansatz')) return 'das Aufstellen des Lösungsansatzes';
        if (opLower.includes('partial') || opLower.includes('bruch')) return 'die Partialbruchzerlegung';
        if (opLower.includes('subst')) return 'die Substitutionsmethode';
        if (opLower.includes('grenz') || opLower.includes('lim')) return 'die Grenzwertberechnung';
        if (opLower.includes('ableit') || opLower.includes("'") || opLower.includes('diff')) return 'das Ableiten';
        if (opLower.includes('integr') || opLower.includes('∫')) return 'das Integrieren';
        if (opLower.includes('umform') || opLower.includes('äquiv')) return 'die Äquivalenzumformung';
        if (opLower.includes('einset') || opLower.includes('einsetz')) return 'das Einsetzen';
        if (opLower.includes('durch') || opLower.includes(':') || opLower.includes('÷')) return 'das Dividieren';
        if (opLower.includes('mult') || opLower.includes('·') || opLower.includes('*')) return 'das Multiplizieren';
        if (opLower.includes('add') || opLower.includes('+')) return 'das Addieren';
        if (opLower.includes('sub') || opLower.includes('-')) return 'das Subtrahieren';
        return null;
    };
    
    // ==================== STÄRKEN - KONKRETE KONZEPTE ====================
    const strengths = [];
    
    // Sammle alle korrekten Konzepte basierend auf Operationen
    const correctConcepts = [];
    correctSteps.forEach(step => {
        const concept = operationToConceptName(step.operation);
        if (concept && !correctConcepts.includes(concept)) {
            correctConcepts.push(concept);
        }
    });
    
    // Generiere Stärken aus den korrekten Konzepten
    if (correctConcepts.length > 0) {
        correctConcepts.slice(0, 2).forEach(concept => {
            strengths.push(`Du hast ${concept} korrekt angewendet`);
        });
    }
    
    // Wenn nur Folgefehler vorhanden
    if (realErrorSteps.length === 0 && allErrorSteps.length > 0) {
        strengths.push('Dein Rechenweg ist im Kern richtig - die Fehler sind nur Folgefehler eines früheren Schritts');
    }
    
    // ==================== SCHWÄCHEN - SPEZIFISCH FÜR JEDEN FEHLER ====================
    const weaknesses = [];
    
    // Für JEDEN echten Fehler eine spezifische Empfehlung generieren
    realErrorSteps.forEach(step => {
        const concept = operationToConceptName(step.operation);
        const errorType = step.errorType;
        
        // Wenn wir das Konzept kennen, spezifische Empfehlung
        if (concept) {
            if (errorType === 'logic') {
                weaknesses.push(`Wiederhole ${concept} - hier wurde die Methode falsch angewendet`);
            } else if (errorType === 'calc') {
                weaknesses.push(`Übe ${concept} - hier ist ein Rechenfehler aufgetreten`);
            } else if (errorType === 'formal') {
                weaknesses.push(`Achte bei ${concept} auf die korrekte Schreibweise`);
            }
        } else if (step.hintQuestion) {
            // Nutze hintQuestion wenn keine Operation bekannt
            const hint = step.hintQuestion.replace(/\?$/, '');
            if (errorType === 'logic') {
                weaknesses.push(`Wiederhole: ${hint}`);
            } else if (errorType === 'calc') {
                weaknesses.push(`Rechenfehler bei: ${hint}`);
            }
        }
    });
    
    // Dedupliziere und limitiere
    const uniqueWeaknesses = [...new Set(weaknesses)].slice(0, 4);
    
    // ==================== TIPPS/MERKSÄTZE - NUR SPEZIFISCHE ====================
    const tips = [];
    
    // Merksätze NUR wenn wir konkrete Operationen kennen
    const addedTipTypes = new Set();
    realErrorSteps.forEach(step => {
        if (!step.operation) return;
        const op = step.operation.toLowerCase();
        
        if ((op.includes('summen') || op.includes('aufteilen')) && !addedTipTypes.has('summen')) {
            tips.push('Merksatz: Prüfe bei "Summen aufteilen" immer ob das Vorzeichen und die Reihenfolge stimmen');
            addedTipTypes.add('summen');
        } else if (op.includes('ausklammer') && !addedTipTypes.has('ausklammer')) {
            tips.push('Beim Ausklammern: Jeder Term muss den Faktor enthalten!');
            addedTipTypes.add('ausklammer');
        } else if (op.includes('ausmult') && !addedTipTypes.has('ausmult')) {
            tips.push('Beim Ausmultiplizieren: Jeder mit jedem!');
            addedTipTypes.add('ausmult');
        } else if ((op.includes('vorzeichen') || step.hintQuestion?.includes('Vorzeichen')) && !addedTipTypes.has('vorzeichen')) {
            tips.push('Bei Vorzeichen: (-a)·(-b) = +ab, (-a)·(+b) = -ab');
            addedTipTypes.add('vorzeichen');
        } else if (op.includes('partial') && !addedTipTypes.has('partial')) {
            tips.push('Bei Partialbruchzerlegung: Falls Zählergrad ≥ Nennergrad, erst Polynomdivision durchführen');
            addedTipTypes.add('partial');
        } else if ((op.includes('grenz') || op.includes('lim')) && !addedTipTypes.has('grenz')) {
            tips.push('Bei Grenzwerten: Erst prüfen ob beide einzelnen Grenzwerte existieren, bevor die Summenregel angewandt wird');
            addedTipTypes.add('grenz');
        } else if (op.includes('subst') && !addedTipTypes.has('subst')) {
            tips.push('Bei Substitution: Vergiss nicht auch die Integrationsgrenzen anzupassen!');
            addedTipTypes.add('subst');
        } else if ((op.includes('ableit') || op.includes("'")) && !addedTipTypes.has('ableit')) {
            tips.push('Beim Ableiten: Bei verketteten Funktionen immer die Kettenregel anwenden!');
            addedTipTypes.add('ableit');
        }
    });
    
    // Ermutigung
    const encouragement = pickRandom(FEEDBACK_TEMPLATES.encouragement);
    
    return {
        strengths: strengths.slice(0, 3),
        weaknesses: uniqueWeaknesses,
        tips: tips.slice(0, 3),
        encouragement: encouragement
    };
}

/**
 * Generiert eine Zusammenfassung basierend auf der Analyse
 */
function generateSummary(analysis) {
    if (!analysis || !analysis.steps) {
        return pickRandom(FEEDBACK_TEMPLATES.summary.major_errors);
    }
    
    const errorSteps = analysis.steps.filter(s => s.errorType && s.errorType !== 'none');
    const errorRate = errorSteps.length / analysis.steps.length;
    const hasLogicError = errorSteps.some(s => s.errorType === 'logic');
    
    if (errorSteps.length === 0) {
        return pickRandom(FEEDBACK_TEMPLATES.summary.correct);
    } else if (hasLogicError) {
        return pickRandom(FEEDBACK_TEMPLATES.summary.wrong_approach);
    } else if (errorRate < 0.3) {
        return pickRandom(FEEDBACK_TEMPLATES.summary.partial);
    } else {
        return pickRandom(FEEDBACK_TEMPLATES.summary.major_errors);
    }
}

/**
 * Generiert Lob für korrekte Lösungen
 */
function generatePraise() {
    return pickRandom(FEEDBACK_TEMPLATES.praise);
}

/**
 * Generiert Ermutigung
 */
function generateEncouragement() {
    return pickRandom(FEEDBACK_TEMPLATES.encouragement);
}

// ==================== THEORIE-AUFGABEN FUNKTIONEN ====================

/**
 * Generiert Feedback für eine Theorie-Analyse
 * @param {Object} analysis - Die Theorie-Analyse-Antwort
 * @returns {Object} - Feedback-Objekt
 */
function generateTheoryFeedback(analysis) {
    if (!analysis || !analysis.subTasks) {
        return {
            summary: pickRandom(FEEDBACK_TEMPLATES.theorySummary.needs_work),
            subTaskFeedback: [],
            encouragement: pickRandom(FEEDBACK_TEMPLATES.encouragement)
        };
    }
    
    const subTaskFeedback = analysis.subTasks.map(task => {
        const type = task.questionType || 'explanation';
        const correctness = task.correctness || 'incorrect';
        
        const templates = FEEDBACK_TEMPLATES.theoryFeedback[type] || FEEDBACK_TEMPLATES.theoryFeedback.explanation;
        let feedback;
        
        switch(correctness) {
            case 'correct':
                feedback = pickRandom(templates.correct);
                break;
            case 'partial':
                feedback = pickRandom(templates.partial);
                break;
            case 'missing':
                feedback = 'Diese Teilaufgabe wurde nicht beantwortet.';
                break;
            default:
                feedback = pickRandom(templates.incorrect);
        }
        
        return {
            label: task.label,
            feedback: feedback,
            correctness: correctness
        };
    });
    
    // Gesamtbewertung
    const assessment = analysis.overallAssessment || 'needs_work';
    const summaryTemplates = FEEDBACK_TEMPLATES.theorySummary[assessment] || FEEDBACK_TEMPLATES.theorySummary.partial;
    
    return {
        summary: pickRandom(summaryTemplates),
        subTaskFeedback: subTaskFeedback,
        encouragement: pickRandom(FEEDBACK_TEMPLATES.encouragement)
    };
}

/**
 * Generiert Hints für Theorie-Aufgaben
 * @param {Object} analysis - Die Theorie-Analyse-Antwort
 * @returns {Object} - Hints-Objekt mit level1 und level2
 */
function generateTheoryHints(analysis) {
    const hints = { level1: [], level2: [] };
    
    if (!analysis || !analysis.subTasks) return hints;
    
    const incorrectTasks = analysis.subTasks.filter(t => 
        t.correctness === 'incorrect' || t.correctness === 'partial' || t.correctness === 'missing'
    );
    
    if (incorrectTasks.length === 0) return hints;
    
    // Level 1: Allgemeine Hinweise basierend auf erstem Problem
    const firstProblem = incorrectTasks[0];
    const type = firstProblem.questionType || 'explanation';
    const hintLabels = FEEDBACK_TEMPLATES.theoryHintLabels[type] || FEEDBACK_TEMPLATES.theoryHintLabels.explanation;
    
    hints.level1.push({
        hintLevel: 1,
        category: type + '_hint',
        label: pickRandom(hintLabels.level1),
        color: firstProblem.correctness === 'incorrect' ? 'orange' : 'yellow'
    });
    
    // Level 2: Teilaufgaben-spezifische Hinweise
    incorrectTasks.slice(0, 3).forEach(task => {
        const taskType = task.questionType || 'explanation';
        const taskHintLabels = FEEDBACK_TEMPLATES.theoryHintLabels[taskType] || FEEDBACK_TEMPLATES.theoryHintLabels.explanation;
        
        hints.level2.push({
            hintLevel: 2,
            category: task.correctness === 'incorrect' ? 'wrong_concept' : 
                     task.correctness === 'missing' ? 'missing_aspect' : 'incomplete',
            subTaskLabel: task.label,
            title: `Zu ${task.label}`,
            text: pickRandom(taskHintLabels.level2),
            color: task.correctness === 'incorrect' ? 'orange' : 'blue'
        });
    });
    
    return hints;
}

/**
 * Generiert eine Zusammenfassung für Theorie-Aufgaben
 * @param {Object} analysis - Die Theorie-Analyse-Antwort
 * @returns {string} - Zusammenfassungstext
 */
function generateTheorySummary(analysis) {
    if (!analysis) {
        return pickRandom(FEEDBACK_TEMPLATES.theorySummary.needs_work);
    }
    
    const assessment = analysis.overallAssessment || 'partial';
    const templates = FEEDBACK_TEMPLATES.theorySummary[assessment] || FEEDBACK_TEMPLATES.theorySummary.partial;
    return pickRandom(templates);
}

// ==================== ANTWORTSATZ FUNKTIONEN ====================

/**
 * Generiert Feedback für den Antwortsatz einer Sachaufgabe
 * @param {Object} answerSentence - Das answerSentence-Objekt aus der Analyse
 * @returns {Object} - Feedback-Objekt
 */
function generateAnswerSentenceFeedback(answerSentence) {
    if (!answerSentence) {
        return {
            feedback: pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.missing),
            isOk: false
        };
    }
    
    if (!answerSentence.present || answerSentence.quality === 'missing') {
        return {
            feedback: pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.missing),
            isOk: false,
            suggestion: answerSentence.suggestion
        };
    }
    
    if (answerSentence.quality === 'complete') {
        return {
            feedback: pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.correct),
            isOk: true
        };
    }
    
    // Spezifisches Feedback basierend auf issues
    const issues = answerSentence.issues || [];
    let feedbackList = [];
    
    if (issues.includes('no_unit') || answerSentence.quality === 'wrong_unit') {
        feedbackList.push(pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.wrong_unit));
    }
    if (issues.includes('incomplete_answer') || answerSentence.quality === 'incomplete') {
        feedbackList.push(pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.incomplete));
    }
    if (issues.includes('context_missing')) {
        feedbackList.push(pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.context_missing));
    }
    if (issues.includes('grammatically_incorrect')) {
        feedbackList.push(pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.grammatically_incorrect));
    }
    
    if (feedbackList.length === 0) {
        feedbackList.push(pickRandom(FEEDBACK_TEMPLATES.answerSentenceFeedback.incomplete));
    }
    
    return {
        feedback: feedbackList.join(' '),
        isOk: false,
        suggestion: answerSentence.suggestion
    };
}

/**
 * Generiert erweitertes Feedback für Sachaufgaben (inkl. Antwortsatz)
 * @param {Object} analysis - Die Sachaufgaben-Analyse-Antwort
 * @param {string} topic - Das Thema
 * @returns {Object} - Erweitertes Feedback-Objekt
 */
function generateWordProblemFeedback(analysis, topic = 'algebra') {
    // Basis-Feedback generieren
    const baseFeedback = generateDetailedFeedback(analysis, topic);
    
    // Antwortsatz-Feedback hinzufügen
    const answerSentenceFeedback = generateAnswerSentenceFeedback(analysis?.answerSentence);
    
    // Problemverständnis-Feedback
    let understandingFeedback = '';
    if (analysis?.problemUnderstanding) {
        if (!analysis.problemUnderstanding.correctApproach) {
            understandingFeedback = 'Der gewählte Lösungsansatz passt nicht zur Aufgabenstellung. Überlege nochmal, was gegeben und was gesucht ist.';
        }
    }
    
    // Kontextbezug-Feedback
    let contextFeedback = '';
    if (analysis?.realWorldContext && !analysis.realWorldContext.maintained) {
        contextFeedback = analysis.realWorldContext.feedback || 'Achte darauf, den Bezug zur Aufgabensituation beizubehalten.';
    }
    
    return {
        ...baseFeedback,
        answerSentence: answerSentenceFeedback,
        understandingFeedback: understandingFeedback,
        contextFeedback: contextFeedback
    };
}

/**
 * Hilfsfunktion: Wählt zufälliges Element (falls nicht aus task-variations importiert)
 */
if (typeof pickRandom === 'undefined') {
    function pickRandom(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    }
}

if (typeof pickRandomN === 'undefined') {
    function pickRandomN(array, n) {
        if (!array || array.length === 0) return [];
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(n, array.length));
    }
}

// Export für Browser
if (typeof window !== 'undefined') {
    window.FEEDBACK_TEMPLATES = FEEDBACK_TEMPLATES;
    window.generateHintsFromAnalysis = generateHintsFromAnalysis;
    window.generateDetailedFeedback = generateDetailedFeedback;
    window.generateSummary = generateSummary;
    window.generatePraise = generatePraise;
    window.generateEncouragement = generateEncouragement;
    // Neue Exporte
    window.generateTheoryFeedback = generateTheoryFeedback;
    window.generateTheoryHints = generateTheoryHints;
    window.generateTheorySummary = generateTheorySummary;
    window.generateAnswerSentenceFeedback = generateAnswerSentenceFeedback;
    window.generateWordProblemFeedback = generateWordProblemFeedback;
}
