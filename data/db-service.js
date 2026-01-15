// Database Service - Abstraction Layer für DB-Operationen
// Unterstützt sowohl Mock-DB (localStorage) als auch DynamoDB

class DBService {
    constructor() {
        // Lade Konfiguration
        this.config = window.AWS_CONFIG || {};
        this.useMock = this.config.USE_MOCK !== false; // Default: Mock-Modus
        
        // Initialisiere entsprechenden DB-Provider
        if (this.useMock) {
            console.log('[DBService] Running in MOCK mode');
            this.provider = new window.DBMock();
        } else {
            console.log('[DBService] Running in PRODUCTION mode with DynamoDB');
            this.provider = new window.DynamoDBAdapter();
        }
        
        // Lade Schemas
        this.schemas = window.DataSchemas;
    }
    
    // ==================== User Profile Operations ====================
    
    async getUserProfile(userId) {
        try {
            this._log('getUserProfile', { userId });
            const profile = await this.provider.getItem(
                this.schemas.UserProfileSchema.tableName,
                { userId }
            );
            return profile;
        } catch (error) {
            this._logError('getUserProfile', error);
            throw error;
        }
    }
    
    async saveUserProfile(userId, profileData) {
        try {
            this._log('saveUserProfile', { userId });
            
            // Apply defaults
            const data = this.schemas.applyDefaults(profileData, this.schemas.UserProfileSchema);
            
            // Add metadata
            data.userId = userId;
            data.lastUpdated = this.schemas.generateTimestamp();
            if (!data.createdAt) {
                data.createdAt = data.lastUpdated;
            }
            
            // Validate
            const validation = this.schemas.validateAgainstSchema(data, this.schemas.UserProfileSchema);
            if (!validation.valid) {
                throw new Error('Validation failed: ' + validation.errors.join(', '));
            }
            
            return await this.provider.putItem(
                this.schemas.UserProfileSchema.tableName,
                data
            );
        } catch (error) {
            this._logError('saveUserProfile', error);
            throw error;
        }
    }
    
    async updateUserProfile(userId, updates) {
        try {
            this._log('updateUserProfile', { userId, updates });
            updates.lastUpdated = this.schemas.generateTimestamp();
            
            return await this.provider.updateItem(
                this.schemas.UserProfileSchema.tableName,
                { userId },
                updates
            );
        } catch (error) {
            this._logError('updateUserProfile', error);
            throw error;
        }
    }
    
    // ==================== Competency Tracking Operations ====================
    
    async getCompetencyData(userId, topic = null) {
        try {
            this._log('getCompetencyData', { userId, topic });
            
            if (topic) {
                // Einzelnes Thema
                return await this.provider.getItem(
                    this.schemas.CompetencyTrackingSchema.tableName,
                    { userId, topic }
                );
            } else {
                // Alle Themen für User
                return await this.provider.query(
                    this.schemas.CompetencyTrackingSchema.tableName,
                    { userId }
                );
            }
        } catch (error) {
            this._logError('getCompetencyData', error);
            throw error;
        }
    }
    
    async updateCompetencyLevel(userId, topic, levelData) {
        try {
            this._log('updateCompetencyLevel', { userId, topic });
            
            // Apply defaults
            const data = this.schemas.applyDefaults(levelData, this.schemas.CompetencyTrackingSchema);
            
            // Add metadata
            data.userId = userId;
            data.topic = topic;
            data.lastUpdated = this.schemas.generateTimestamp();
            
            // Update history
            if (!data.history) {
                data.history = [];
            }
            data.history.push({
                timestamp: data.lastUpdated,
                level: data.overallLevel,
                event: 'level_update'
            });
            
            // Keep only last 50 history entries
            if (data.history.length > 50) {
                data.history = data.history.slice(-50);
            }
            
            return await this.provider.putItem(
                this.schemas.CompetencyTrackingSchema.tableName,
                data
            );
        } catch (error) {
            this._logError('updateCompetencyLevel', error);
            throw error;
        }
    }
    
    async updateSubTopicLevel(userId, topic, subTopic, level) {
        try {
            this._log('updateSubTopicLevel', { userId, topic, subTopic, level });
            
            // Hole aktuelle Daten
            const competency = await this.getCompetencyData(userId, topic) || {};
            
            // Update subTopic
            if (!competency.subTopics) {
                competency.subTopics = {};
            }
            competency.subTopics[subTopic] = level;
            
            // Berechne neuen overall level (Durchschnitt)
            const subTopicLevels = Object.values(competency.subTopics);
            if (subTopicLevels.length > 0) {
                competency.overallLevel = Math.round(
                    subTopicLevels.reduce((a, b) => a + b, 0) / subTopicLevels.length
                );
            }
            
            return await this.updateCompetencyLevel(userId, topic, competency);
        } catch (error) {
            this._logError('updateSubTopicLevel', error);
            throw error;
        }
    }
    
    // ==================== Performance Metrics Operations ====================
    
    async logPerformanceMetric(userId, metricData) {
        try {
            this._log('logPerformanceMetric', { userId });
            
            // Apply defaults
            const data = this.schemas.applyDefaults(metricData, this.schemas.PerformanceMetricsSchema);
            
            // Add metadata
            data.userId = userId;
            data.timestamp = this.schemas.generateTimestamp();
            data.metricId = this.schemas.generateId('metric');
            
            return await this.provider.putItem(
                this.schemas.PerformanceMetricsSchema.tableName,
                data
            );
        } catch (error) {
            this._logError('logPerformanceMetric', error);
            throw error;
        }
    }
    
    async getPerformanceHistory(userId, options = {}) {
        try {
            this._log('getPerformanceHistory', { userId, options });
            
            const { timeRange, topic, limit } = options;
            
            // Query mit optionalen Filtern
            const results = await this.provider.query(
                this.schemas.PerformanceMetricsSchema.tableName,
                { userId },
                { limit, sortDescending: true }
            );
            
            // Filter nach timeRange und topic
            let filtered = results;
            
            if (timeRange) {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - timeRange);
                filtered = filtered.filter(m => new Date(m.timestamp) >= cutoffDate);
            }
            
            if (topic) {
                filtered = filtered.filter(m => m.topic === topic);
            }
            
            return filtered;
        } catch (error) {
            this._logError('getPerformanceHistory', error);
            throw error;
        }
    }
    
    async getPerformanceStats(userId, topic = null, days = 30) {
        try {
            this._log('getPerformanceStats', { userId, topic, days });
            
            const history = await this.getPerformanceHistory(userId, { 
                timeRange: days, 
                topic 
            });
            
            if (history.length === 0) {
                return {
                    tasksCompleted: 0,
                    successRate: 0,
                    averageTime: 0,
                    hintsUsedAvg: 0,
                    solutionShownRate: 0
                };
            }
            
            const stats = {
                tasksCompleted: history.length,
                successRate: (history.filter(h => h.success).length / history.length) * 100,
                averageTime: history.reduce((sum, h) => sum + (h.timeSpent || 0), 0) / history.length,
                hintsUsedAvg: history.reduce((sum, h) => sum + (h.hintsUsed || 0), 0) / history.length,
                solutionShownRate: (history.filter(h => h.showedSolution).length / history.length) * 100,
                fluctuationScore: this._calculateFluctuation(history)
            };
            
            return stats;
        } catch (error) {
            this._logError('getPerformanceStats', error);
            throw error;
        }
    }
    
    _calculateFluctuation(history) {
        if (history.length < 3) return 5; // Neutral
        
        // Berechne Standard-Abweichung der Erfolgsraten über Zeit
        const windowSize = 5;
        const windows = [];
        
        for (let i = 0; i <= history.length - windowSize; i++) {
            const window = history.slice(i, i + windowSize);
            const successRate = window.filter(h => h.success).length / windowSize;
            windows.push(successRate);
        }
        
        if (windows.length === 0) return 5;
        
        const mean = windows.reduce((a, b) => a + b) / windows.length;
        const variance = windows.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / windows.length;
        const stdDev = Math.sqrt(variance);
        
        // Skaliere auf 0-10 (höher = mehr Fluktuation/Ablenkung)
        return Math.min(10, Math.round(stdDev * 20));
    }
    
    // ==================== Behavior Analytics Operations ====================
    
    async logBehavior(userId, behaviorData) {
        try {
            this._log('logBehavior', { userId, behaviorType: behaviorData.behaviorType });
            
            // Apply defaults
            const data = this.schemas.applyDefaults(behaviorData, this.schemas.BehaviorAnalyticsSchema);
            
            // Add metadata
            data.userId = userId;
            data.timestamp = this.schemas.generateTimestamp();
            data.behaviorKey = `${data.behaviorType}#${data.timestamp}`;
            
            if (!data.sessionId) {
                data.sessionId = this._getCurrentSessionId(userId);
            }
            
            return await this.provider.putItem(
                this.schemas.BehaviorAnalyticsSchema.tableName,
                data
            );
        } catch (error) {
            this._logError('logBehavior', error);
            throw error;
        }
    }
    
    async getBehaviorPatterns(userId, behaviorType = null, days = 30) {
        try {
            this._log('getBehaviorPatterns', { userId, behaviorType, days });
            
            // Query alle Behaviors
            const behaviors = await this.provider.query(
                this.schemas.BehaviorAnalyticsSchema.tableName,
                { userId }
            );
            
            // Filter nach Zeitraum
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            let filtered = behaviors.filter(b => new Date(b.timestamp) >= cutoffDate);
            
            // Filter nach Typ wenn angegeben
            if (behaviorType) {
                filtered = filtered.filter(b => b.behaviorType === behaviorType);
            }
            
            // Aggregiere Patterns
            const patterns = {};
            filtered.forEach(behavior => {
                if (!patterns[behavior.behaviorType]) {
                    patterns[behavior.behaviorType] = {
                        count: 0,
                        lastOccurrence: null,
                        contexts: []
                    };
                }
                patterns[behavior.behaviorType].count += behavior.frequency || 1;
                patterns[behavior.behaviorType].lastOccurrence = behavior.timestamp;
                if (behavior.context) {
                    patterns[behavior.behaviorType].contexts.push(behavior.context);
                }
            });
            
            return patterns;
        } catch (error) {
            this._logError('getBehaviorPatterns', error);
            throw error;
        }
    }
    
    // ==================== Session Operations ====================
    
    _getCurrentSessionId(userId) {
        // Hole oder erstelle Session ID für aktuelle Session
        const storageKey = `current_session_${userId}`;
        let sessionId = sessionStorage.getItem(storageKey);
        
        if (!sessionId) {
            sessionId = this.schemas.generateId('session');
            sessionStorage.setItem(storageKey, sessionId);
        }
        
        return sessionId;
    }
    
    async startSession(userId) {
        try {
            const sessionId = this._getCurrentSessionId(userId);
            const sessionData = {
                userId,
                sessionId,
                startTime: this.schemas.generateTimestamp(),
                tasksAttempted: 0,
                tasksCompleted: 0,
                topicsExplored: []
            };
            
            return await this.provider.putItem(
                this.schemas.SessionSchema.tableName,
                sessionData
            );
        } catch (error) {
            this._logError('startSession', error);
            throw error;
        }
    }
    
    async updateSession(userId, updates) {
        try {
            const sessionId = this._getCurrentSessionId(userId);
            
            return await this.provider.updateItem(
                this.schemas.SessionSchema.tableName,
                { userId, sessionId },
                updates
            );
        } catch (error) {
            this._logError('updateSession', error);
            throw error;
        }
    }
    
    // ==================== Error Balance Operations ====================
    
    /**
     * Zeichne einen Fehler auf
     * @param {string} userId - User ID
     * @param {string} topic - Hauptthema
     * @param {string} subTopic - Unterthema (kann leer sein)
     * @param {string} errorType - Fehlertyp (logic, calc, followup, formal)
     */
    async recordError(userId, topic, subTopic = '', errorType) {
        try {
            this._log('recordError', { userId, topic, subTopic, errorType });
            
            const balanceKey = `${topic}#${subTopic}#${errorType}`;
            const now = this.schemas.generateTimestamp();
            
            // Hole bestehende Balance oder erstelle neue
            let balance = await this.provider.getItem(
                this.schemas.ErrorBalanceSchema.tableName,
                { userId, balanceKey }
            );
            
            if (!balance) {
                balance = this.schemas.applyDefaults({
                    userId,
                    balanceKey,
                    topic,
                    subTopic,
                    errorType,
                    firstOccurrence: now
                }, this.schemas.ErrorBalanceSchema);
            }
            
            // Update counts
            balance.count = (balance.count || 0) + 1;
            balance.lastOccurrence = now;
            balance.lastUpdated = now;
            
            // Update history (letzte 30 Tage)
            if (!balance.history) balance.history = [];
            const today = now.split('T')[0];
            const existingEntry = balance.history.find(h => h.date === today);
            if (existingEntry) {
                existingEntry.count++;
            } else {
                balance.history.push({ date: today, count: 1 });
                // Behalte nur letzte 30 Einträge
                if (balance.history.length > 30) {
                    balance.history = balance.history.slice(-30);
                }
            }
            
            // Berechne recent count (letzte 7 Tage)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            balance.recentCount = balance.history
                .filter(h => new Date(h.date) >= sevenDaysAgo)
                .reduce((sum, h) => sum + h.count, 0);
            
            // Berechne Trend
            balance.recentTrend = this._calculateErrorTrend(balance.history);
            
            return await this.provider.putItem(
                this.schemas.ErrorBalanceSchema.tableName,
                balance
            );
        } catch (error) {
            this._logError('recordError', error);
            throw error;
        }
    }
    
    /**
     * Hole Fehlerbilanzen für einen User
     */
    async getErrorBalance(userId, topic = null) {
        try {
            this._log('getErrorBalance', { userId, topic });
            
            const balances = await this.provider.query(
                this.schemas.ErrorBalanceSchema.tableName,
                { userId }
            );
            
            if (topic) {
                return balances.filter(b => b.topic === topic);
            }
            
            return balances;
        } catch (error) {
            this._logError('getErrorBalance', error);
            throw error;
        }
    }
    
    /**
     * Hole aggregierte Fehlerstatistiken nach Thema
     */
    async getErrorStats(userId) {
        try {
            const balances = await this.getErrorBalance(userId);
            
            const stats = {
                byTopic: {},
                byErrorType: {},
                total: 0,
                recentTotal: 0
            };
            
            balances.forEach(b => {
                // Nach Thema
                if (!stats.byTopic[b.topic]) {
                    stats.byTopic[b.topic] = { total: 0, recent: 0, byType: {} };
                }
                stats.byTopic[b.topic].total += b.count;
                stats.byTopic[b.topic].recent += b.recentCount || 0;
                stats.byTopic[b.topic].byType[b.errorType] = (stats.byTopic[b.topic].byType[b.errorType] || 0) + b.count;
                
                // Nach Fehlertyp
                stats.byErrorType[b.errorType] = (stats.byErrorType[b.errorType] || 0) + b.count;
                
                // Gesamt
                stats.total += b.count;
                stats.recentTotal += b.recentCount || 0;
            });
            
            return stats;
        } catch (error) {
            this._logError('getErrorStats', error);
            throw error;
        }
    }
    
    _calculateErrorTrend(history) {
        if (!history || history.length < 7) return 'stable';
        
        // Vergleiche letzte 7 Tage mit den 7 Tagen davor
        const recent = history.slice(-7);
        const previous = history.slice(-14, -7);
        
        const recentSum = recent.reduce((sum, h) => sum + h.count, 0);
        const previousSum = previous.reduce((sum, h) => sum + h.count, 0);
        
        if (recentSum < previousSum * 0.7) return 'improving';
        if (recentSum > previousSum * 1.3) return 'worsening';
        return 'stable';
    }
    
    // ==================== Competency Ratings Operations ====================
    
    /**
     * Speichere ein Kompetenz-Rating
     * @param {string} userId - User ID
     * @param {string} competencyId - Kompetenz-ID aus Schema
     * @param {number} rating - Rating (1-10)
     * @param {Object} context - Optionaler Kontext (topic, taskId, etc.)
     */
    async recordCompetencyRating(userId, competencyId, rating, context = {}) {
        try {
            this._log('recordCompetencyRating', { userId, competencyId, rating });
            
            const now = this.schemas.generateTimestamp();
            
            // Validiere Rating
            rating = Math.max(1, Math.min(10, Math.round(rating)));
            
            // Hole bestehende Ratings oder erstelle neue
            let competencyRating = await this.provider.getItem(
                this.schemas.CompetencyRatingsSchema.tableName,
                { userId, competencyId }
            );
            
            if (!competencyRating) {
                competencyRating = this.schemas.applyDefaults({
                    userId,
                    competencyId
                }, this.schemas.CompetencyRatingsSchema);
            }
            
            // Füge neues Rating hinzu
            if (!competencyRating.ratings) competencyRating.ratings = [];
            competencyRating.ratings.push({
                value: rating,
                timestamp: now,
                context
            });
            
            // Behalte nur letzte 20 Ratings
            if (competencyRating.ratings.length > 20) {
                competencyRating.ratings = competencyRating.ratings.slice(-20);
            }
            
            // Berechne Statistiken
            const values = competencyRating.ratings.map(r => r.value);
            competencyRating.sampleCount = values.length;
            competencyRating.averageRating = values.reduce((a, b) => a + b, 0) / values.length;
            
            // Gewichteter Durchschnitt (neuere zählen mehr)
            let weightedSum = 0;
            let weightTotal = 0;
            values.forEach((v, i) => {
                const weight = i + 1; // Älteste = 1, neueste = N
                weightedSum += v * weight;
                weightTotal += weight;
            });
            competencyRating.weightedAverage = weightedSum / weightTotal;
            
            // Berechne Confidence
            const confidenceLevels = this.schemas.CompetencyRatingsSchema.confidenceLevels;
            if (competencyRating.sampleCount >= confidenceLevels.HIGH.min) {
                competencyRating.confidence = 'high';
            } else if (competencyRating.sampleCount >= confidenceLevels.MEDIUM.min) {
                competencyRating.confidence = 'medium';
            } else {
                competencyRating.confidence = 'low';
            }
            
            // Berechne Trend
            if (values.length >= 5) {
                const firstHalf = values.slice(0, Math.floor(values.length / 2));
                const secondHalf = values.slice(Math.floor(values.length / 2));
                const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
                const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
                
                if (secondAvg > firstAvg + 1) {
                    competencyRating.trend = 'improving';
                } else if (secondAvg < firstAvg - 1) {
                    competencyRating.trend = 'declining';
                } else {
                    competencyRating.trend = 'stable';
                }
            }
            
            // Track letzte positive/negative Ratings
            if (rating >= 7) {
                competencyRating.lastPositive = now;
            } else if (rating <= 4) {
                competencyRating.lastNegative = now;
            }
            
            competencyRating.lastUpdated = now;
            
            return await this.provider.putItem(
                this.schemas.CompetencyRatingsSchema.tableName,
                competencyRating
            );
        } catch (error) {
            this._logError('recordCompetencyRating', error);
            throw error;
        }
    }
    
    /**
     * Hole alle Kompetenz-Ratings für einen User
     */
    async getCompetencyRatings(userId) {
        try {
            this._log('getCompetencyRatings', { userId });
            
            return await this.provider.query(
                this.schemas.CompetencyRatingsSchema.tableName,
                { userId }
            );
        } catch (error) {
            this._logError('getCompetencyRatings', error);
            throw error;
        }
    }
    
    /**
     * Hole ein spezifisches Kompetenz-Rating
     */
    async getCompetencyRating(userId, competencyId) {
        try {
            return await this.provider.getItem(
                this.schemas.CompetencyRatingsSchema.tableName,
                { userId, competencyId }
            );
        } catch (error) {
            this._logError('getCompetencyRating', error);
            throw error;
        }
    }
    
    /**
     * Hole starke Kompetenzen (Rating >= threshold)
     */
    async getStrongCompetencies(userId, threshold = 7) {
        try {
            const ratings = await this.getCompetencyRatings(userId);
            return ratings
                .filter(r => r.weightedAverage >= threshold && r.confidence !== 'low')
                .sort((a, b) => b.weightedAverage - a.weightedAverage);
        } catch (error) {
            this._logError('getStrongCompetencies', error);
            throw error;
        }
    }
    
    /**
     * Hole schwache Kompetenzen (Rating <= threshold)
     */
    async getWeakCompetencies(userId, threshold = 5) {
        try {
            const ratings = await this.getCompetencyRatings(userId);
            return ratings
                .filter(r => r.weightedAverage <= threshold && r.confidence !== 'low')
                .sort((a, b) => a.weightedAverage - b.weightedAverage);
        } catch (error) {
            this._logError('getWeakCompetencies', error);
            throw error;
        }
    }
    
    // ==================== Usage Stats Operations ====================
    
    /**
     * Hole Usage Stats für einen User
     */
    async getUsageStats(userId) {
        try {
            this._log('getUsageStats', { userId });
            
            let stats = await this.provider.getItem(
                this.schemas.UsageStatsSchema.tableName,
                { userId }
            );
            
            if (!stats) {
                stats = this.schemas.applyDefaults({ userId }, this.schemas.UsageStatsSchema);
            }
            
            return stats;
        } catch (error) {
            this._logError('getUsageStats', error);
            throw error;
        }
    }
    
    /**
     * Aktualisiere Usage Stats nach einer Session
     */
    async updateUsageStats(userId, sessionData) {
        try {
            this._log('updateUsageStats', { userId });
            
            const now = this.schemas.generateTimestamp();
            const today = now.split('T')[0];
            
            let stats = await this.getUsageStats(userId);
            
            // Update session counts
            stats.totalSessions = (stats.totalSessions || 0) + 1;
            stats.totalTasksAttempted = (stats.totalTasksAttempted || 0) + (sessionData.tasksAttempted || 0);
            stats.totalTasksCompleted = (stats.totalTasksCompleted || 0) + (sessionData.tasksCompleted || 0);
            stats.totalTimeSpent = (stats.totalTimeSpent || 0) + (sessionData.duration || 0);
            
            // Update average session length
            if (stats.totalSessions > 0) {
                stats.averageSessionLength = stats.totalTimeSpent / stats.totalSessions;
            }
            
            // Update streak
            const lastActive = stats.lastActiveDate ? stats.lastActiveDate.split('T')[0] : null;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastActive === yesterdayStr) {
                // Streak fortsetzen
                stats.currentStreak = (stats.currentStreak || 0) + 1;
            } else if (lastActive !== today) {
                // Streak zurücksetzen (außer wenn heute bereits aktiv)
                stats.currentStreak = 1;
            }
            
            // Update longest streak
            if (stats.currentStreak > (stats.longestStreak || 0)) {
                stats.longestStreak = stats.currentStreak;
            }
            
            // Update first/last active
            if (!stats.firstActiveDate) {
                stats.firstActiveDate = now;
            }
            stats.lastActiveDate = now;
            
            // Update weekly activity
            const weekNum = this._getWeekNumber(new Date());
            const weekKey = `${new Date().getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
            if (!stats.weeklyActivity) stats.weeklyActivity = {};
            stats.weeklyActivity[weekKey] = (stats.weeklyActivity[weekKey] || 0) + 1;
            
            // Update monthly activity
            const monthKey = today.substring(0, 7); // YYYY-MM
            if (!stats.monthlyActivity) stats.monthlyActivity = {};
            stats.monthlyActivity[monthKey] = (stats.monthlyActivity[monthKey] || 0) + 1;
            
            // Update explored topics
            if (sessionData.topicsExplored && sessionData.topicsExplored.length > 0) {
                if (!stats.topicsExplored) stats.topicsExplored = [];
                sessionData.topicsExplored.forEach(topic => {
                    if (!stats.topicsExplored.includes(topic)) {
                        stats.topicsExplored.push(topic);
                    }
                });
            }
            
            stats.lastUpdated = now;
            
            return await this.provider.putItem(
                this.schemas.UsageStatsSchema.tableName,
                stats
            );
        } catch (error) {
            this._logError('updateUsageStats', error);
            throw error;
        }
    }
    
    /**
     * Zeichne eine einzelne Aktivität auf (ohne vollständige Session)
     */
    async recordActivity(userId, activityData = {}) {
        try {
            const now = this.schemas.generateTimestamp();
            const today = now.split('T')[0];
            
            let stats = await this.getUsageStats(userId);
            
            // Update counts
            if (activityData.taskAttempted) {
                stats.totalTasksAttempted = (stats.totalTasksAttempted || 0) + 1;
            }
            if (activityData.taskCompleted) {
                stats.totalTasksCompleted = (stats.totalTasksCompleted || 0) + 1;
            }
            if (activityData.timeSpent) {
                stats.totalTimeSpent = (stats.totalTimeSpent || 0) + activityData.timeSpent;
            }
            if (activityData.topic && !stats.topicsExplored?.includes(activityData.topic)) {
                if (!stats.topicsExplored) stats.topicsExplored = [];
                stats.topicsExplored.push(activityData.topic);
            }
            
            // Check and update streak if first activity today
            const lastActive = stats.lastActiveDate ? stats.lastActiveDate.split('T')[0] : null;
            if (lastActive !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                
                if (lastActive === yesterdayStr) {
                    stats.currentStreak = (stats.currentStreak || 0) + 1;
                } else {
                    stats.currentStreak = 1;
                }
                
                if (stats.currentStreak > (stats.longestStreak || 0)) {
                    stats.longestStreak = stats.currentStreak;
                }
            }
            
            if (!stats.firstActiveDate) {
                stats.firstActiveDate = now;
            }
            stats.lastActiveDate = now;
            stats.lastUpdated = now;
            
            return await this.provider.putItem(
                this.schemas.UsageStatsSchema.tableName,
                stats
            );
        } catch (error) {
            this._logError('recordActivity', error);
            throw error;
        }
    }
    
    _getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }
    
    // ==================== Helper Methods ====================
    
    getMode() {
        return this.useMock ? 'mock' : 'production';
    }
    
    _log(method, data = {}) {
        if (this.config.debug?.logApiCalls) {
            console.log(`[DBService] ${method}`, data);
        }
    }
    
    _logError(method, error) {
        if (this.config.debug?.verbose) {
            console.error(`[DBService] ${method} Error:`, error);
        }
    }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DBService;
}

// Export für Browser
if (typeof window !== 'undefined') {
    window.DBService = DBService;
}

