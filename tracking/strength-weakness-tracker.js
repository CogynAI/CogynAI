// Strength/Weakness Tracker - Aggregiert Daten für Stärken/Schwächen-Analyse
// Kombiniert Fehlerbilanzen, KI-Kompetenz-Ratings und regelbasierte Metriken

class StrengthWeaknessTracker {
    constructor(dbService) {
        this.db = dbService;
        this.schemas = window.DataSchemas;
        this.competencySchema = window.CompetencySchema;
        
        // Cache für Performance
        this.profileCache = new Map();
        this.cacheTimeout = 60000; // 1 Minute
    }
    
    // ==================== Error Balance Management ====================
    
    /**
     * Zeichne einen Fehler auf
     * @param {string} userId - User ID
     * @param {string} topic - Hauptthema
     * @param {string} subTopic - Unterthema (optional)
     * @param {string} errorType - Fehlertyp (logic, calc, followup, formal)
     * @param {Object} context - Zusätzlicher Kontext
     */
    async recordError(userId, topic, subTopic = '', errorType, context = {}) {
        try {
            // Speichere in DB
            await this.db.recordError(userId, topic, subTopic, errorType);
            
            // Regelbasierte Kompetenz-Anpassung
            await this._adjustCompetenciesFromError(userId, topic, subTopic, errorType);
            
            // Cache invalidieren
            this._invalidateCache(userId);
            
            return { success: true };
        } catch (error) {
            console.error('[StrengthWeaknessTracker] recordError error:', error);
            throw error;
        }
    }
    
    /**
     * Hole Fehlerbilanzen für einen User
     */
    async getErrorBalance(userId, topic = null) {
        try {
            return await this.db.getErrorBalance(userId, topic);
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getErrorBalance error:', error);
            return [];
        }
    }
    
    /**
     * Hole aggregierte Fehlerstatistiken
     */
    async getErrorStats(userId) {
        try {
            return await this.db.getErrorStats(userId);
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getErrorStats error:', error);
            return { byTopic: {}, byErrorType: {}, total: 0, recentTotal: 0 };
        }
    }
    
    /**
     * Hole Fehlertrends
     */
    async getErrorTrends(userId, days = 30) {
        try {
            const balances = await this.getErrorBalance(userId);
            
            const trends = {
                improving: [],
                stable: [],
                worsening: []
            };
            
            balances.forEach(b => {
                if (b.recentTrend === 'improving') {
                    trends.improving.push({ topic: b.topic, subTopic: b.subTopic, errorType: b.errorType });
                } else if (b.recentTrend === 'worsening') {
                    trends.worsening.push({ topic: b.topic, subTopic: b.subTopic, errorType: b.errorType });
                } else {
                    trends.stable.push({ topic: b.topic, subTopic: b.subTopic, errorType: b.errorType });
                }
            });
            
            return trends;
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getErrorTrends error:', error);
            return { improving: [], stable: [], worsening: [] };
        }
    }
    
    // ==================== Competency Rating Management ====================
    
    /**
     * Speichere ein KI-generiertes Kompetenz-Rating
     * @param {string} userId - User ID
     * @param {string} competencyId - Kompetenz-ID aus fixem Schema
     * @param {number} rating - Rating (1-10)
     * @param {Object} context - Kontext (topic, evidence, etc.)
     */
    async recordCompetencyRating(userId, competencyId, rating, context = {}) {
        try {
            // Validiere Kompetenz-ID
            if (!this.competencySchema.isValidCompetencyId(competencyId)) {
                console.warn(`[StrengthWeaknessTracker] Invalid competencyId: ${competencyId}`);
                return { success: false, reason: 'invalid_competency_id' };
            }
            
            await this.db.recordCompetencyRating(userId, competencyId, rating, context);
            
            // Cache invalidieren
            this._invalidateCache(userId);
            
            return { success: true };
        } catch (error) {
            console.error('[StrengthWeaknessTracker] recordCompetencyRating error:', error);
            throw error;
        }
    }
    
    /**
     * Speichere mehrere Kompetenz-Ratings auf einmal (nach KI-Analyse)
     */
    async recordMultipleRatings(userId, ratings, baseContext = {}) {
        try {
            const results = [];
            
            for (const rating of ratings) {
                if (rating.competencyId && rating.rating !== undefined) {
                    const result = await this.recordCompetencyRating(
                        userId,
                        rating.competencyId,
                        rating.rating,
                        { ...baseContext, evidence: rating.evidence }
                    );
                    results.push({ ...rating, ...result });
                }
            }
            
            return results;
        } catch (error) {
            console.error('[StrengthWeaknessTracker] recordMultipleRatings error:', error);
            throw error;
        }
    }
    
    /**
     * Hole das Kompetenz-Profil eines Users
     */
    async getCompetencyProfile(userId) {
        try {
            const ratings = await this.db.getCompetencyRatings(userId);
            
            // Gruppiere nach Kategorie
            const profile = {
                byCategory: {},
                all: [],
                strong: [],
                weak: [],
                summary: {}
            };
            
            ratings.forEach(r => {
                const competency = this.competencySchema.getCompetencyById(r.competencyId);
                if (!competency) return;
                
                const enrichedRating = {
                    ...r,
                    name: competency.name,
                    category: competency.category,
                    categoryName: this.competencySchema.COMPETENCY_CATEGORIES[competency.category]?.name
                };
                
                profile.all.push(enrichedRating);
                
                // Nach Kategorie gruppieren
                if (!profile.byCategory[competency.category]) {
                    profile.byCategory[competency.category] = {
                        name: this.competencySchema.COMPETENCY_CATEGORIES[competency.category]?.name,
                        competencies: [],
                        averageRating: 0
                    };
                }
                profile.byCategory[competency.category].competencies.push(enrichedRating);
                
                // Stärken/Schwächen
                if (r.confidence !== 'low') {
                    if (r.weightedAverage >= 7) {
                        profile.strong.push(enrichedRating);
                    } else if (r.weightedAverage <= 4) {
                        profile.weak.push(enrichedRating);
                    }
                }
            });
            
            // Kategorie-Durchschnitte berechnen
            for (const [catId, catData] of Object.entries(profile.byCategory)) {
                if (catData.competencies.length > 0) {
                    catData.averageRating = catData.competencies
                        .reduce((sum, c) => sum + c.weightedAverage, 0) / catData.competencies.length;
                }
            }
            
            // Sortieren
            profile.strong.sort((a, b) => b.weightedAverage - a.weightedAverage);
            profile.weak.sort((a, b) => a.weightedAverage - b.weightedAverage);
            
            // Summary
            if (profile.all.length > 0) {
                profile.summary = {
                    totalCompetencies: profile.all.length,
                    averageRating: profile.all.reduce((sum, c) => sum + c.weightedAverage, 0) / profile.all.length,
                    strongCount: profile.strong.length,
                    weakCount: profile.weak.length,
                    topStrength: profile.strong[0] || null,
                    topWeakness: profile.weak[0] || null
                };
            }
            
            return profile;
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getCompetencyProfile error:', error);
            return { byCategory: {}, all: [], strong: [], weak: [], summary: {} };
        }
    }
    
    /**
     * Hole starke Kompetenzen
     */
    async getStrongCompetencies(userId, threshold = 7, limit = 5) {
        try {
            const strong = await this.db.getStrongCompetencies(userId, threshold);
            return strong.slice(0, limit).map(r => ({
                ...r,
                name: this.competencySchema.getCompetencyById(r.competencyId)?.name
            }));
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getStrongCompetencies error:', error);
            return [];
        }
    }
    
    /**
     * Hole schwache Kompetenzen
     */
    async getWeakCompetencies(userId, threshold = 5, limit = 5) {
        try {
            const weak = await this.db.getWeakCompetencies(userId, threshold);
            return weak.slice(0, limit).map(r => ({
                ...r,
                name: this.competencySchema.getCompetencyById(r.competencyId)?.name
            }));
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getWeakCompetencies error:', error);
            return [];
        }
    }
    
    // ==================== Full Profile & Analysis ====================
    
    /**
     * Hole vollständiges Stärken/Schwächen-Profil
     */
    async getFullProfile(userId) {
        try {
            // Check cache
            const cached = this._getFromCache(userId);
            if (cached) return cached;
            
            // Hole alle Daten parallel
            const [
                competencyProfile,
                errorStats,
                errorTrends,
                usageStats
            ] = await Promise.all([
                this.getCompetencyProfile(userId),
                this.getErrorStats(userId),
                this.getErrorTrends(userId),
                this.db.getUsageStats(userId)
            ]);
            
            const profile = {
                userId,
                timestamp: new Date().toISOString(),
                
                // Kompetenz-basierte Stärken/Schwächen
                competencies: competencyProfile,
                
                // Fehlerbilanzen
                errors: {
                    stats: errorStats,
                    trends: errorTrends,
                    topErrorTopics: this._getTopErrorTopics(errorStats),
                    topErrorTypes: this._getTopErrorTypes(errorStats)
                },
                
                // Nutzungsstatistiken
                usage: {
                    totalSessions: usageStats.totalSessions || 0,
                    totalTasks: usageStats.totalTasksCompleted || 0,
                    currentStreak: usageStats.currentStreak || 0,
                    longestStreak: usageStats.longestStreak || 0,
                    averageSessionLength: usageStats.averageSessionLength || 0,
                    isActive: this._isRecentlyActive(usageStats)
                },
                
                // Aggregierte Zusammenfassung
                summary: this._buildProfileSummary(competencyProfile, errorStats, usageStats)
            };
            
            // Cache speichern
            this._saveToCache(userId, profile);
            
            return profile;
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getFullProfile error:', error);
            return this._getEmptyProfile(userId);
        }
    }
    
    /**
     * Hole Themen-spezifische Analyse
     */
    async getTopicAnalysis(userId, topic) {
        try {
            const [
                errorBalance,
                competencyProfile
            ] = await Promise.all([
                this.getErrorBalance(userId, topic),
                this.getCompetencyProfile(userId)
            ]);
            
            // Finde relevante Kompetenzen für dieses Thema
            const topicPath = topic; // z.B. "analysis"
            const relevantCompetencies = this.competencySchema.getCompetenciesForTopic(topicPath);
            const relevantRatings = competencyProfile.all.filter(r => 
                relevantCompetencies.some(c => c.id === r.competencyId)
            );
            
            // Fehler-Analyse für Thema
            const errorSummary = {
                total: errorBalance.reduce((sum, b) => sum + b.count, 0),
                recent: errorBalance.reduce((sum, b) => sum + (b.recentCount || 0), 0),
                byType: {},
                bySubTopic: {}
            };
            
            errorBalance.forEach(b => {
                errorSummary.byType[b.errorType] = (errorSummary.byType[b.errorType] || 0) + b.count;
                if (b.subTopic) {
                    errorSummary.bySubTopic[b.subTopic] = (errorSummary.bySubTopic[b.subTopic] || 0) + b.count;
                }
            });
            
            return {
                topic,
                topicName: window.MATH_TOPICS?.[topic]?.name || topic,
                competencies: {
                    relevant: relevantRatings,
                    averageRating: relevantRatings.length > 0 
                        ? relevantRatings.reduce((sum, r) => sum + r.weightedAverage, 0) / relevantRatings.length 
                        : null,
                    strong: relevantRatings.filter(r => r.weightedAverage >= 7),
                    weak: relevantRatings.filter(r => r.weightedAverage <= 4)
                },
                errors: errorSummary,
                recommendation: this._generateTopicRecommendation(relevantRatings, errorSummary)
            };
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getTopicAnalysis error:', error);
            return null;
        }
    }
    
    /**
     * Generiere Verbesserungsvorschläge
     */
    async getImprovementSuggestions(userId, limit = 5) {
        try {
            const profile = await this.getFullProfile(userId);
            const suggestions = [];
            
            // Vorschlag 1: Schwache Kompetenzen üben
            if (profile.competencies.weak.length > 0) {
                const weakest = profile.competencies.weak[0];
                suggestions.push({
                    type: 'practice_weakness',
                    priority: 'high',
                    competencyId: weakest.competencyId,
                    competencyName: weakest.name,
                    rating: weakest.weightedAverage,
                    message: `Übe "${weakest.name}" - aktuelles Rating: ${weakest.weightedAverage.toFixed(1)}/10`,
                    action: 'focus_practice'
                });
            }
            
            // Vorschlag 2: Häufige Fehlertypen adressieren
            const topErrorTypes = profile.errors.topErrorTypes;
            if (topErrorTypes.length > 0) {
                const topError = topErrorTypes[0];
                const errorMessages = {
                    logic: 'Achte mehr auf den richtigen Lösungsansatz',
                    calc: 'Überprüfe Rechnungen sorgfältiger',
                    followup: 'Korrigiere Fehler früh im Lösungsweg',
                    formal: 'Achte auf korrekte mathematische Notation'
                };
                suggestions.push({
                    type: 'reduce_error_type',
                    priority: 'medium',
                    errorType: topError.type,
                    count: topError.count,
                    message: errorMessages[topError.type] || `Reduziere ${topError.type}-Fehler`,
                    action: 'review_errors'
                });
            }
            
            // Vorschlag 3: Themen mit vielen Fehlern wiederholen
            const topErrorTopics = profile.errors.topErrorTopics;
            if (topErrorTopics.length > 0) {
                const topTopic = topErrorTopics[0];
                suggestions.push({
                    type: 'review_topic',
                    priority: 'medium',
                    topic: topTopic.topic,
                    topicName: window.MATH_TOPICS?.[topTopic.topic]?.name || topTopic.topic,
                    errorCount: topTopic.count,
                    message: `Wiederhole "${window.MATH_TOPICS?.[topTopic.topic]?.name || topTopic.topic}" - ${topTopic.count} Fehler`,
                    action: 'topic_review'
                });
            }
            
            // Vorschlag 4: Stärken weiter ausbauen (positive Motivation)
            if (profile.competencies.strong.length > 0 && suggestions.length > 0) {
                const strongest = profile.competencies.strong[0];
                suggestions.push({
                    type: 'build_on_strength',
                    priority: 'low',
                    competencyId: strongest.competencyId,
                    competencyName: strongest.name,
                    rating: strongest.weightedAverage,
                    message: `Super in "${strongest.name}"! Versuche anspruchsvollere Aufgaben.`,
                    action: 'challenge_yourself'
                });
            }
            
            // Vorschlag 5: Regelmäßigkeit verbessern
            if (profile.usage.currentStreak < 3 && profile.usage.totalSessions > 5) {
                suggestions.push({
                    type: 'improve_consistency',
                    priority: 'low',
                    currentStreak: profile.usage.currentStreak,
                    message: 'Übe regelmäßiger für bessere Ergebnisse',
                    action: 'daily_practice'
                });
            }
            
            // Sortiere nach Priorität
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            
            return suggestions.slice(0, limit);
        } catch (error) {
            console.error('[StrengthWeaknessTracker] getImprovementSuggestions error:', error);
            return [];
        }
    }
    
    // ==================== Context Generation for AI ====================
    
    /**
     * Generiere Kontext-String für KI-Prompts
     */
    async generateContextForAI(userId, currentTopic = null) {
        try {
            const profile = await this.getFullProfile(userId);
            
            let context = '\n=== KOMPETENZ-PROFIL ===\n';
            
            // Starke Kompetenzen
            if (profile.competencies.strong.length > 0) {
                context += 'Starke Kompetenzen:\n';
                profile.competencies.strong.slice(0, 3).forEach(c => {
                    context += `  - ${c.name}: ${c.weightedAverage.toFixed(1)}/10\n`;
                });
            }
            
            // Schwache Kompetenzen
            if (profile.competencies.weak.length > 0) {
                context += 'Schwache Kompetenzen:\n';
                profile.competencies.weak.slice(0, 3).forEach(c => {
                    context += `  - ${c.name}: ${c.weightedAverage.toFixed(1)}/10\n`;
                });
            }
            
            // Häufige Fehlertypen
            if (profile.errors.topErrorTypes.length > 0) {
                context += 'Häufige Fehlertypen:\n';
                profile.errors.topErrorTypes.slice(0, 3).forEach(e => {
                    const typeNames = { logic: 'Logikfehler', calc: 'Rechenfehler', followup: 'Folgefehler', formal: 'Formfehler' };
                    context += `  - ${typeNames[e.type] || e.type}: ${e.count}x\n`;
                });
            }
            
            // Themen-spezifischer Kontext
            if (currentTopic) {
                const topicAnalysis = await this.getTopicAnalysis(userId, currentTopic);
                if (topicAnalysis && topicAnalysis.competencies.relevant.length > 0) {
                    context += `\nZum Thema "${topicAnalysis.topicName}":\n`;
                    context += `  - Durchschnittliches Rating: ${topicAnalysis.competencies.averageRating?.toFixed(1) || 'k.A.'}/10\n`;
                    context += `  - Fehler insgesamt: ${topicAnalysis.errors.total}\n`;
                }
            }
            
            // Empfehlung
            context += '\nEMPFEHLUNG FÜR INTERAKTION:\n';
            if (profile.competencies.weak.length > 0) {
                const weakest = profile.competencies.weak[0];
                context += `Bei "${weakest.name}" extra detailliert erklären.\n`;
            }
            if (profile.errors.topErrorTypes.length > 0) {
                const topError = profile.errors.topErrorTypes[0];
                if (topError.type === 'logic') {
                    context += 'Nutzer macht oft Logikfehler - Lösungsansatz klar erklären.\n';
                } else if (topError.type === 'calc') {
                    context += 'Nutzer macht oft Rechenfehler - Zwischenschritte betonen.\n';
                }
            }
            
            return context;
        } catch (error) {
            console.error('[StrengthWeaknessTracker] generateContextForAI error:', error);
            return '\n=== KOMPETENZ-PROFIL ===\nKeine Daten verfügbar.\n';
        }
    }
    
    // ==================== Regelbasierte Anpassungen ====================
    
    /**
     * Passe Kompetenzen regelbasiert an (Fallback wenn KI nicht verfügbar)
     */
    async _adjustCompetenciesFromError(userId, topic, subTopic, errorType) {
        try {
            // Finde relevante Kompetenzen für Thema
            const topicPath = subTopic ? `${topic}.${subTopic}` : topic;
            const relevantCompetencies = this.competencySchema.getCompetenciesForTopic(topicPath);
            
            // Kleine negative Anpassung für alle relevanten Kompetenzen
            for (const competency of relevantCompetencies.slice(0, 3)) {
                const currentRating = await this.db.getCompetencyRating(userId, competency.id);
                
                // Nur anpassen wenn bereits Daten existieren
                if (currentRating && currentRating.sampleCount > 0) {
                    // Fehler reduziert Rating leicht (-0.5)
                    const newRating = Math.max(1, currentRating.weightedAverage - 0.5);
                    await this.db.recordCompetencyRating(userId, competency.id, newRating, {
                        source: 'rule_based',
                        trigger: 'error',
                        errorType
                    });
                }
            }
        } catch (error) {
            console.error('[StrengthWeaknessTracker] _adjustCompetenciesFromError error:', error);
        }
    }
    
    /**
     * Passe Kompetenzen nach Erfolg an
     */
    async adjustCompetenciesFromSuccess(userId, topic, subTopic = '') {
        try {
            const topicPath = subTopic ? `${topic}.${subTopic}` : topic;
            const relevantCompetencies = this.competencySchema.getCompetenciesForTopic(topicPath);
            
            for (const competency of relevantCompetencies.slice(0, 3)) {
                const currentRating = await this.db.getCompetencyRating(userId, competency.id);
                
                if (currentRating && currentRating.sampleCount > 0) {
                    // Erfolg erhöht Rating leicht (+0.3)
                    const newRating = Math.min(10, currentRating.weightedAverage + 0.3);
                    await this.db.recordCompetencyRating(userId, competency.id, newRating, {
                        source: 'rule_based',
                        trigger: 'success'
                    });
                } else {
                    // Initialisiere mit neutralem Rating bei Erfolg
                    await this.db.recordCompetencyRating(userId, competency.id, 6, {
                        source: 'rule_based',
                        trigger: 'initial_success'
                    });
                }
            }
            
            this._invalidateCache(userId);
        } catch (error) {
            console.error('[StrengthWeaknessTracker] adjustCompetenciesFromSuccess error:', error);
        }
    }
    
    // ==================== Helper Methods ====================
    
    _getTopErrorTopics(errorStats) {
        return Object.entries(errorStats.byTopic || {})
            .map(([topic, data]) => ({ topic, count: data.total }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }
    
    _getTopErrorTypes(errorStats) {
        return Object.entries(errorStats.byErrorType || {})
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    _isRecentlyActive(usageStats) {
        if (!usageStats.lastActiveDate) return false;
        const daysSinceActive = (Date.now() - new Date(usageStats.lastActiveDate).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceActive <= 7;
    }
    
    _buildProfileSummary(competencyProfile, errorStats, usageStats) {
        const avgRating = competencyProfile.summary?.averageRating || 5;
        const errorRate = usageStats.totalTasksCompleted > 0 
            ? errorStats.total / usageStats.totalTasksCompleted 
            : 0;
        
        let overallLevel = 'neutral';
        if (avgRating >= 7 && errorRate < 0.3) {
            overallLevel = 'excellent';
        } else if (avgRating >= 5.5 && errorRate < 0.5) {
            overallLevel = 'good';
        } else if (avgRating < 4 || errorRate > 0.7) {
            overallLevel = 'needs_attention';
        }
        
        return {
            overallLevel,
            averageCompetencyRating: avgRating,
            totalErrors: errorStats.total,
            recentErrors: errorStats.recentTotal,
            taskCompletionRate: usageStats.totalTasksAttempted > 0 
                ? (usageStats.totalTasksCompleted / usageStats.totalTasksAttempted) * 100 
                : 0,
            strongAreasCount: competencyProfile.strong?.length || 0,
            weakAreasCount: competencyProfile.weak?.length || 0
        };
    }
    
    _generateTopicRecommendation(competencyRatings, errorSummary) {
        if (competencyRatings.length === 0 && errorSummary.total === 0) {
            return { level: 'neutral', message: 'Noch keine Daten zu diesem Thema.' };
        }
        
        const avgRating = competencyRatings.length > 0
            ? competencyRatings.reduce((sum, r) => sum + r.weightedAverage, 0) / competencyRatings.length
            : 5;
        
        if (avgRating >= 7 && errorSummary.recent < 3) {
            return { level: 'strong', message: 'Gutes Verständnis - versuche anspruchsvollere Aufgaben!' };
        } else if (avgRating <= 4 || errorSummary.recent > 5) {
            return { level: 'weak', message: 'Mehr Übung empfohlen - starte mit einfacheren Aufgaben.' };
        } else {
            return { level: 'moderate', message: 'Solide Basis - weiter üben für Vertiefung.' };
        }
    }
    
    _getEmptyProfile(userId) {
        return {
            userId,
            timestamp: new Date().toISOString(),
            competencies: { byCategory: {}, all: [], strong: [], weak: [], summary: {} },
            errors: { stats: { byTopic: {}, byErrorType: {}, total: 0, recentTotal: 0 }, trends: { improving: [], stable: [], worsening: [] }, topErrorTopics: [], topErrorTypes: [] },
            usage: { totalSessions: 0, totalTasks: 0, currentStreak: 0, longestStreak: 0, averageSessionLength: 0, isActive: false },
            summary: { overallLevel: 'unknown', averageCompetencyRating: 5, totalErrors: 0, recentErrors: 0, taskCompletionRate: 0, strongAreasCount: 0, weakAreasCount: 0 }
        };
    }
    
    // Cache Methods
    _getFromCache(userId) {
        const cached = this.profileCache.get(userId);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }
    
    _saveToCache(userId, data) {
        this.profileCache.set(userId, { data, timestamp: Date.now() });
    }
    
    _invalidateCache(userId) {
        this.profileCache.delete(userId);
    }
    
    /**
     * Export Daten für Reporting
     */
    async exportData(userId) {
        try {
            return await this.getFullProfile(userId);
        } catch (error) {
            console.error('[StrengthWeaknessTracker] exportData error:', error);
            throw error;
        }
    }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StrengthWeaknessTracker;
}

// Export für Browser
if (typeof window !== 'undefined') {
    window.StrengthWeaknessTracker = StrengthWeaknessTracker;
}
