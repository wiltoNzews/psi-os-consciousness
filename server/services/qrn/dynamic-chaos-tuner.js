/**
 * Dynamic Chaos Tuner
 *
 * Implements the Dynamic Chaos Tuning mechanism based on the 70/30 Structured Chaos Ratio.
 * This module provides functionality to dynamically adjust the chaos level in the system
 * based on performance metrics, stability, and innovation needs.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { v4 as uuidv4 } from 'uuid';
// In-memory storage for chaos tuning history
var chaosTuningHistory = [];
var chaosSessionsHistory = [];
/**
 * Calculate the dynamic chaos ratio based on system stability and innovation needs
 * Implements the 70/30 Structured Chaos Ratio formula as defined in MATHEMATICAL_FORMULAS.md
 *
 * @param systemStability - Current system stability (0-1)
 * @param innovationDeficit - Current innovation deficit (0-1)
 * @param timeAvailable - Optional time available in minutes for potential chaos session
 * @returns Dynamic chaos ratio calculation result
 */
export function calculateDynamicChaosRatio(systemStability, innovationDeficit, timeAvailable) {
    if (timeAvailable === void 0) { timeAvailable = 60; }
    // Baseline ratio is 0.3 (30%)
    var baselineRatio = 0.3;
    // Performance adjustment based on the difference between innovation deficit and system stability
    // Range is [-0.1, 0.1]
    var performanceAdjustment = (innovationDeficit - systemStability) * 0.1;
    // Calculate final chaos ratio, constrained to range [0.2, 0.4]
    var finalRatio = Math.min(Math.max(baselineRatio + performanceAdjustment, 0.2), 0.4);
    // Calculate recommended chaos session duration
    var recommendedChaosSessionDuration = scheduleChaosSession(finalRatio, timeAvailable);
    // Calculate next scheduled chaos session (e.g., one week from now)
    var nextScheduledChaosSession = calculateNextChaosSession(systemStability, innovationDeficit);
    // Generate recommendations based on chaos ratio
    var recommendations = generateChaosRecommendations(finalRatio, systemStability, innovationDeficit, recommendedChaosSessionDuration);
    // Create the result object
    var result = {
        id: uuidv4(),
        timestamp: new Date(),
        baselineRatio: baselineRatio,
        performanceAdjustment: performanceAdjustment,
        finalRatio: finalRatio,
        systemStability: systemStability,
        innovationDeficit: innovationDeficit,
        recommendedChaosSessionDuration: recommendedChaosSessionDuration,
        nextScheduledChaosSession: nextScheduledChaosSession,
        recommendations: recommendations
    };
    // Store in history
    chaosTuningHistory.push(result);
    return result;
}
/**
 * Schedule a chaos session based on the current ratio and available time
 *
 * @param currentRatio - Current chaos ratio (0-1)
 * @param totalTimeAvailable - Total time available in minutes
 * @returns Recommended duration for chaos session in minutes
 */
export function scheduleChaosSession(currentRatio, totalTimeAvailable) {
    return Math.floor(totalTimeAvailable * currentRatio);
}
/**
 * Calculate the next scheduled chaos session based on system metrics
 *
 * @param systemStability - Current system stability (0-1)
 * @param innovationDeficit - Current innovation deficit (0-1)
 * @returns Date for next scheduled chaos session, or null if not needed
 */
function calculateNextChaosSession(systemStability, innovationDeficit) {
    // If system is highly stable but innovation deficit is high,
    // schedule a chaos session soon (within 1-3 days)
    if (systemStability > 0.8 && innovationDeficit > 0.6) {
        var nextSession_1 = new Date();
        nextSession_1.setDate(nextSession_1.getDate() + 1);
        return nextSession_1;
    }
    // If system is moderately stable and innovation deficit is moderate,
    // schedule a chaos session within the next week
    else if (systemStability > 0.6 && innovationDeficit > 0.4) {
        var nextSession_2 = new Date();
        nextSession_2.setDate(nextSession_2.getDate() + 7);
        return nextSession_2;
    }
    // If system is unstable or innovation deficit is low,
    // don't schedule a chaos session yet
    else if (systemStability < 0.5 || innovationDeficit < 0.3) {
        return null;
    }
    // Default: schedule a chaos session in two weeks
    var nextSession = new Date();
    nextSession.setDate(nextSession.getDate() + 14);
    return nextSession;
}
/**
 * Generate recommendations based on chaos ratio and system metrics
 *
 * @param chaosRatio - Calculated chaos ratio (0-1)
 * @param systemStability - Current system stability (0-1)
 * @param innovationDeficit - Current innovation deficit (0-1)
 * @param sessionDuration - Recommended session duration in minutes
 * @returns Array of recommendation strings
 */
function generateChaosRecommendations(chaosRatio, systemStability, innovationDeficit, sessionDuration) {
    var recommendations = [];
    // Chaos ratio recommendations
    if (chaosRatio > 0.35) {
        recommendations.push("Increase chaos allocation to ".concat(Math.round(chaosRatio * 100), "% to address high innovation deficit"));
    }
    else if (chaosRatio < 0.25) {
        recommendations.push("Reduce chaos allocation to ".concat(Math.round(chaosRatio * 100), "% to prioritize system stability"));
    }
    else {
        recommendations.push("Maintain balanced chaos allocation at ".concat(Math.round(chaosRatio * 100), "%"));
    }
    // Session recommendations
    if (sessionDuration > 30) {
        recommendations.push("Schedule a dedicated chaos session of ".concat(sessionDuration, " minutes focused on targeted innovation"));
    }
    else if (sessionDuration > 0) {
        recommendations.push("Integrate a ".concat(sessionDuration, "-minute mini chaos session into regular workflows"));
    }
    // System stability recommendations
    if (systemStability < 0.5) {
        recommendations.push('Address system stability issues before increasing chaos allocation');
    }
    else if (systemStability > 0.9) {
        recommendations.push('Consider introducing more variability to prevent system rigidity');
    }
    // Innovation deficit recommendations
    if (innovationDeficit > 0.7) {
        recommendations.push('Critical innovation deficit detected - prioritize exploratory activities');
    }
    else if (innovationDeficit < 0.3) {
        recommendations.push('Innovation deficit is low - focus on consolidating recent innovations');
    }
    return recommendations;
}
/**
 * Create and schedule a new chaos tuning session
 *
 * @param duration - Duration of the session in minutes
 * @param chaosRatio - Chaos ratio to apply during the session (0-1)
 * @param targetAreas - Areas to focus chaos injection on
 * @param objectives - Specific objectives for the session
 * @returns The created chaos session
 */
export function createChaosTuningSession(duration, chaosRatio, targetAreas, objectives) {
    if (targetAreas === void 0) { targetAreas = []; }
    if (objectives === void 0) { objectives = []; }
    var startTime = new Date();
    startTime.setHours(startTime.getHours() + 1); // Start in 1 hour by default
    var endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    // Calculate intensity based on chaos ratio and current system state
    var intensity = chaosRatio * 0.8 + Math.random() * 0.2;
    // Create the session object
    var session = {
        id: uuidv4(),
        timestamp: new Date(),
        startTime: startTime,
        endTime: null, // Will be set when session completes
        duration: duration,
        chaosRatio: chaosRatio,
        intensity: intensity,
        targetAreas: targetAreas.length > 0 ? targetAreas : ['general'],
        objectives: objectives.length > 0 ? objectives : ['increase innovation'],
        results: null, // Will be set when session completes
        status: 'scheduled'
    };
    // Store in history
    chaosSessionsHistory.push(session);
    console.log("[QUANTUM_STATE: SIM_FLOW] ".concat(new Date().toISOString(), " - Scheduled chaos tuning session: ").concat(session.id));
    return session;
}
/**
 * Start a scheduled chaos tuning session
 *
 * @param sessionId - ID of the session to start
 * @returns The updated session, or null if not found
 */
export function startChaosTuningSession(sessionId) {
    var sessionIndex = chaosSessionsHistory.findIndex(function (s) { return s.id === sessionId; });
    if (sessionIndex === -1) {
        return null;
    }
    var session = chaosSessionsHistory[sessionIndex];
    if (session.status !== 'scheduled') {
        return session;
    }
    // Update the session
    session.status = 'in_progress';
    session.startTime = new Date(); // Start now
    console.log("[QUANTUM_STATE: SIM_FLOW] ".concat(new Date().toISOString(), " - Started chaos tuning session: ").concat(session.id));
    return session;
}
/**
 * Complete a chaos tuning session with results
 *
 * @param sessionId - ID of the session to complete
 * @param innovationScore - Score representing innovation generated (0-1)
 * @param structuralImpact - Score representing impact on system structure (0-1)
 * @param unexpectedInsights - Array of unexpected insights generated
 * @returns The updated session, or null if not found
 */
export function completeChaosTuningSession(sessionId, innovationScore, structuralImpact, unexpectedInsights) {
    if (unexpectedInsights === void 0) { unexpectedInsights = []; }
    var sessionIndex = chaosSessionsHistory.findIndex(function (s) { return s.id === sessionId; });
    if (sessionIndex === -1) {
        return null;
    }
    var session = chaosSessionsHistory[sessionIndex];
    if (session.status !== 'in_progress') {
        return session;
    }
    // Update the session
    session.status = 'completed';
    session.endTime = new Date();
    session.results = {
        innovationScore: Math.max(0, Math.min(1, innovationScore)),
        structuralImpact: Math.max(0, Math.min(1, structuralImpact)),
        unexpectedInsights: unexpectedInsights
    };
    console.log("[QUANTUM_STATE: SIM_FLOW] ".concat(new Date().toISOString(), " - Completed chaos tuning session: ").concat(session.id));
    return session;
}
/**
 * Get the history of chaos tuning calculations
 *
 * @param limit - Maximum number of records to return (default: 10)
 * @returns Array of chaos tuning results
 */
export function getChaosTuningHistory(limit) {
    if (limit === void 0) { limit = 10; }
    // Return the most recent records
    return __spreadArray([], chaosTuningHistory, true).sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
        .slice(0, limit);
}
/**
 * Get the history of chaos tuning sessions
 *
 * @param limit - Maximum number of sessions to return (default: 10)
 * @param status - Optional filter by status
 * @returns Array of chaos tuning sessions
 */
export function getChaosSessions(limit, status) {
    if (limit === void 0) { limit = 10; }
    // Filter by status if provided
    var filteredSessions = status
        ? chaosSessionsHistory.filter(function (s) { return s.status === status; })
        : chaosSessionsHistory;
    // Return the most recent sessions
    return __spreadArray([], filteredSessions, true).sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
        .slice(0, limit);
}
/**
 * Calculate innovation deficit based on system metrics
 *
 * @param systemStability - Current system stability (0-1)
 * @param recentChanges - Number of recent changes or innovations
 * @param stagnationDuration - Time since last significant change in days
 * @returns Innovation deficit score (0-1)
 */
export function calculateInnovationDeficit(systemStability, recentChanges, stagnationDuration) {
    // Base deficit calculation
    var deficit = 0.5;
    // Stability factor (higher stability can indicate less innovation)
    var stabilityFactor = systemStability > 0.7 ? (systemStability - 0.7) * 2 : 0;
    // Recent changes factor (more changes indicate less deficit)
    var changesFactor = Math.min(recentChanges / 10, 0.5);
    // Stagnation factor (longer stagnation indicates higher deficit)
    var stagnationFactor = Math.min(stagnationDuration / 30, 0.5);
    // Calculate deficit
    deficit = 0.3 + stabilityFactor + stagnationFactor - changesFactor;
    // Ensure result is in valid range
    return Math.max(0, Math.min(1, deficit));
}
/**
 * Apply chaos tuning to a stability state
 *
 * This function takes a current stability state and applies dynamic chaos tuning
 * to adjust the chaos level based on system metrics.
 *
 * @param state - Current stability state
 * @param innovationDeficit - Current innovation deficit (0-1)
 * @returns Updated stability state with tuned chaos level
 */
export function applyChaosTuning(state, innovationDeficit) {
    // Calculate dynamic chaos ratio
    var chaosRatio = calculateDynamicChaosRatio(state.stabilityScore, innovationDeficit);
    // Apply chaos ratio to adjust chaos level
    var tunedChaosLevel = Math.max(0.1, Math.min(0.9, state.chaosLevel * 0.7 + chaosRatio.finalRatio));
    // Create updated state with new chaos level
    return __assign(__assign({}, state), { chaosLevel: tunedChaosLevel, recommendations: __spreadArray(__spreadArray([], state.recommendations, true), chaosRatio.recommendations.map(function (r) { return "Chaos Tuning: ".concat(r); }), true) });
}
