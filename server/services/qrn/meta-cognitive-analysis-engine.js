/**
 * Meta-Cognitive Analysis Engine
 *
 * This service analyzes meta-cognitive events to detect patterns,
 * anomalies, and generate insights that can improve system performance.
 *
 * Core capabilities:
 * - Pattern detection across temporal instances
 * - Anomaly detection in cognitive processes
 * - Insight generation for system optimization
 * - Feedback loops for continuous improvement
 * - Strategic layer awareness
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { storage } from '../../storage.js';
import { qrnService } from './quantum-root-node-service.js';
// Types of patterns the engine can detect
export var PatternType;
(function (PatternType) {
    PatternType["SEQUENTIAL"] = "sequential";
    PatternType["CYCLICAL"] = "cyclical";
    PatternType["CAUSAL"] = "causal";
    PatternType["CORRELATIONAL"] = "correlational";
    PatternType["EMERGENT"] = "emergent";
})(PatternType || (PatternType = {}));
// Insight severity levels
export var InsightSeverity;
(function (InsightSeverity) {
    InsightSeverity["INFORMATION"] = "information";
    InsightSeverity["SUGGESTION"] = "suggestion";
    InsightSeverity["WARNING"] = "warning";
    InsightSeverity["CRITICAL"] = "critical";
})(InsightSeverity || (InsightSeverity = {}));
var MetaCognitiveAnalysisEngine = /** @class */ (function () {
    function MetaCognitiveAnalysisEngine() {
        var _this = this;
        this.patterns = new Map();
        this.insights = new Map();
        this.eventTimestamps = new Map();
        this.eventTypeStats = new Map();
        // Initialize the engine
        console.log('Meta-Cognitive Analysis Engine initialized');
        // Start background analysis every 30 seconds
        setInterval(function () { return _this.performBackgroundAnalysis(); }, 30000);
    }
    // Get singleton instance
    MetaCognitiveAnalysisEngine.getInstance = function () {
        if (!MetaCognitiveAnalysisEngine.instance) {
            MetaCognitiveAnalysisEngine.instance = new MetaCognitiveAnalysisEngine();
        }
        return MetaCognitiveAnalysisEngine.instance;
    };
    /**
     * Process a new meta-cognitive event
     * This method analyzes events as they occur to detect immediate patterns and insights
     * @param event The meta-cognitive event to process
     * @returns Promise that resolves when processing is complete
     */
    MetaCognitiveAnalysisEngine.prototype.processEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, errorMessage, errorStack, innerError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 8]);
                        // Check for immediate patterns with this event
                        return [4 /*yield*/, this.detectImmedatePatterns(event)];
                    case 1:
                        // Check for immediate patterns with this event
                        _a.sent();
                        // Generate insights if needed
                        return [4 /*yield*/, this.generateEventInsights(event)];
                    case 2:
                        // Generate insights if needed
                        _a.sent();
                        // Track event for real-time analytics
                        this.trackEventMetrics(event);
                        // Log that we've processed this event
                        console.log("Processed meta-cognitive event: ".concat(event.id, " (").concat(event.type, ")"));
                        return [3 /*break*/, 8];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error processing meta-cognitive event:', error_1);
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                        errorStack = error_1 instanceof Error ? error_1.stack : undefined;
                        return [4 /*yield*/, qrnService.recordMetaCognitiveEvent({
                                nodeId: event.nodeId || 'system',
                                type: 'processing-error',
                                description: "Error processing event: ".concat(errorMessage),
                                details: {
                                    originalEventId: event.id,
                                    errorStack: errorStack
                                },
                                confidence: 0.9,
                                impact: 5
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        innerError_1 = _a.sent();
                        console.error('Failed to record error event:', innerError_1 instanceof Error ? innerError_1.message : String(innerError_1));
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Track metrics about events for real-time analytics
     * @param event The event to track metrics for
     */
    MetaCognitiveAnalysisEngine.prototype.trackEventMetrics = function (event) {
        // Track event type frequencies
        // This data is used for real-time anomaly detection
        var eventType = event.type; // Use type instead of eventType
        var now = Date.now();
        // Store the event timestamp for rate analysis
        // No need to check for initialization as it's already done in constructor
        if (!this.eventTimestamps.has(eventType)) {
            this.eventTimestamps.set(eventType, []);
        }
        var timestamps = this.eventTimestamps.get(eventType);
        timestamps.push(now);
        // Keep only the most recent 100 timestamps
        if (timestamps.length > 100) {
            timestamps.shift();
        }
        // Update event type statistics
        // No need to check for initialization as it's already done in constructor
        var stats = this.eventTypeStats.get(eventType) || { count: 0, avgImpact: 0 };
        stats.count++;
        // Update rolling average of impact if available
        if (event.impact !== undefined) {
            stats.avgImpact = (stats.avgImpact * (stats.count - 1) + event.impact) / stats.count;
        }
        this.eventTypeStats.set(eventType, stats);
    };
    /**
     * Perform background analysis of all meta-cognitive events
     * Made public to allow manual triggering of analysis
     */
    MetaCognitiveAnalysisEngine.prototype.performBackgroundAnalysis = function () {
        return __awaiter(this, void 0, void 0, function () {
            var events, latestEvents, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        console.log('Performing background meta-cognitive analysis...');
                        return [4 /*yield*/, storage.getAllMetaCognitiveEvents()];
                    case 1:
                        events = _a.sent();
                        latestEvents = events.slice(0, 100);
                        // Skip if no events
                        if (!events || events.length === 0) {
                            console.log('No meta-cognitive events to analyze');
                            return [2 /*return*/];
                        }
                        // Detect temporal patterns
                        return [4 /*yield*/, this.detectTemporalPatterns(latestEvents)];
                    case 2:
                        // Detect temporal patterns
                        _a.sent();
                        // Detect node-specific patterns
                        return [4 /*yield*/, this.detectNodePatterns(latestEvents)];
                    case 3:
                        // Detect node-specific patterns
                        _a.sent();
                        // Generate system-wide insights
                        return [4 /*yield*/, this.generateSystemInsights(latestEvents)];
                    case 4:
                        // Generate system-wide insights
                        _a.sent();
                        console.log("Background analysis complete. Patterns: ".concat(this.patterns.size, ", Insights: ").concat(this.insights.size));
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error('Error in background meta-cognitive analysis:', error_2 instanceof Error ? error_2.message : String(error_2));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Detect immediate patterns for a single event
     */
    MetaCognitiveAnalysisEngine.prototype.detectImmedatePatterns = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var nodeIdSafe, allEvents, allRecentEvents, recentEvents, sameTypeEvents, timeDiffs, i, diff, avgDiff_1, consistentTiming, patternId, pattern, nodeIdSafe_1, newPattern, potentialCause, timeDiff, patternId, pattern, nodeIdSafe_2, newPattern;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nodeIdSafe = event.nodeId || 'system';
                        return [4 /*yield*/, storage.getAllMetaCognitiveEvents()];
                    case 1:
                        allEvents = _a.sent();
                        allRecentEvents = allEvents.slice(0, 50);
                        recentEvents = allRecentEvents.filter(function (e) { return e.nodeId === nodeIdSafe; }).slice(0, 10);
                        // Skip if there are not enough events
                        if (recentEvents.length < 3) {
                            return [2 /*return*/];
                        }
                        sameTypeEvents = recentEvents.filter(function (e) { return e.type === event.type; });
                        if (!(sameTypeEvents.length >= 3)) return [3 /*break*/, 4];
                        timeDiffs = [];
                        for (i = 1; i < sameTypeEvents.length; i++) {
                            diff = new Date(sameTypeEvents[i].createdAt).getTime() -
                                new Date(sameTypeEvents[i - 1].createdAt).getTime();
                            timeDiffs.push(diff);
                        }
                        avgDiff_1 = timeDiffs.reduce(function (a, b) { return a + b; }, 0) / timeDiffs.length;
                        consistentTiming = timeDiffs.every(function (diff) {
                            return Math.abs(diff - avgDiff_1) / avgDiff_1 < 0.2;
                        });
                        if (!consistentTiming) return [3 /*break*/, 4];
                        patternId = "cyclical-".concat(event.nodeId || 'system', "-").concat(event.type);
                        if (!this.patterns.has(patternId)) return [3 /*break*/, 2];
                        pattern = this.patterns.get(patternId);
                        pattern.lastDetected = new Date();
                        pattern.occurrences += 1;
                        pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
                        return [3 /*break*/, 4];
                    case 2:
                        nodeIdSafe_1 = event.nodeId || 'system';
                        newPattern = {
                            id: patternId,
                            type: PatternType.CYCLICAL,
                            nodeIds: [nodeIdSafe_1],
                            eventTypes: [event.type],
                            confidence: 0.6,
                            description: "Cyclical pattern of ".concat(event.type, " events occurring approximately every ").concat(Math.round(avgDiff_1 / 1000), " seconds"),
                            firstDetected: new Date(),
                            lastDetected: new Date(),
                            occurrences: 1,
                            strategicLayer: 2
                        };
                        this.patterns.set(patternId, newPattern);
                        // Record a meta-cognitive event about this pattern detection
                        return [4 /*yield*/, qrnService.recordMetaCognitiveEvent({
                                nodeId: nodeIdSafe_1,
                                type: 'pattern-detection',
                                description: "Detected cyclical pattern of ".concat(event.type, " events"),
                                details: {
                                    patternId: patternId,
                                    patternType: PatternType.CYCLICAL,
                                    confidence: newPattern.confidence,
                                    avgInterval: Math.round(avgDiff_1 / 1000)
                                },
                                confidence: newPattern.confidence, // Use confidence instead of confidenceLevel
                                impact: 6
                            })];
                    case 3:
                        // Record a meta-cognitive event about this pattern detection
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        // Check for causal relationships with previous events
                        // (This is a simplified implementation - a more sophisticated version would
                        // use statistical methods to detect true causality)
                        if (recentEvents.length >= 2 && recentEvents[1].type !== event.type) {
                            potentialCause = recentEvents[1];
                            timeDiff = new Date(event.createdAt).getTime() -
                                new Date(potentialCause.createdAt).getTime();
                            // If events happened within 5 seconds, suggest potential causality
                            if (timeDiff > 0 && timeDiff < 5000) {
                                patternId = "causal-".concat(potentialCause.type, "-").concat(event.type);
                                if (this.patterns.has(patternId)) {
                                    pattern = this.patterns.get(patternId);
                                    pattern.lastDetected = new Date();
                                    pattern.occurrences += 1;
                                    pattern.confidence = Math.min(0.9, pattern.confidence + 0.1);
                                }
                                else {
                                    nodeIdSafe_2 = event.nodeId || 'system';
                                    newPattern = {
                                        id: patternId,
                                        type: PatternType.CAUSAL,
                                        nodeIds: [nodeIdSafe_2],
                                        eventTypes: [potentialCause.type, event.type],
                                        confidence: 0.4, // Start with low confidence
                                        description: "Potential causal relationship: ".concat(potentialCause.type, " events may trigger ").concat(event.type, " events within ").concat(Math.round(timeDiff / 1000), " seconds"),
                                        firstDetected: new Date(),
                                        lastDetected: new Date(),
                                        occurrences: 1,
                                        strategicLayer: 3 // Causality is higher strategic layer
                                    };
                                    this.patterns.set(patternId, newPattern);
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Detect patterns across time
     */
    MetaCognitiveAnalysisEngine.prototype.detectTemporalPatterns = function (events) {
        return __awaiter(this, void 0, void 0, function () {
            var eventsByType, _i, events_1, event_1, _loop_1, this_1, _a, _b, _c, eventType, eventsOfType;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        eventsByType = new Map();
                        for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                            event_1 = events_1[_i];
                            if (!eventsByType.has(event_1.type)) {
                                eventsByType.set(event_1.type, []);
                            }
                            eventsByType.get(event_1.type).push(event_1);
                        }
                        _loop_1 = function (eventType, eventsOfType) {
                            var timeDiffs, i, diff, avgDiff, stdDev, consistencyRatio, patternId, pattern, _e, eventsOfType_1, event_2, nodeId, nodeIds, newPattern, insightId, newInsight, _f, nodeIds_1, nodeId;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        if (eventsOfType.length < 5)
                                            return [2 /*return*/, "continue"]; // Need enough data
                                        // Sort by timestamp
                                        eventsOfType.sort(function (a, b) {
                                            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                                        });
                                        timeDiffs = [];
                                        for (i = 1; i < eventsOfType.length; i++) {
                                            diff = new Date(eventsOfType[i].createdAt).getTime() -
                                                new Date(eventsOfType[i - 1].createdAt).getTime();
                                            timeDiffs.push(diff);
                                        }
                                        avgDiff = timeDiffs.reduce(function (a, b) { return a + b; }, 0) / timeDiffs.length;
                                        stdDev = Math.sqrt(timeDiffs.reduce(function (sum, diff) { return sum + Math.pow(diff - avgDiff, 2); }, 0) / timeDiffs.length);
                                        consistencyRatio = stdDev / avgDiff;
                                        if (!(consistencyRatio < 0.3 && eventsOfType.length >= 5)) return [3 /*break*/, 5];
                                        patternId = "system-cyclical-".concat(eventType);
                                        if (!this_1.patterns.has(patternId)) return [3 /*break*/, 1];
                                        pattern = this_1.patterns.get(patternId);
                                        pattern.lastDetected = new Date();
                                        pattern.occurrences = Math.max(pattern.occurrences, eventsOfType.length);
                                        pattern.confidence = Math.min(0.98, pattern.confidence + 0.02);
                                        // Add any new nodes involved
                                        for (_e = 0, eventsOfType_1 = eventsOfType; _e < eventsOfType_1.length; _e++) {
                                            event_2 = eventsOfType_1[_e];
                                            nodeId = event_2.nodeId || 'system';
                                            if (!pattern.nodeIds.includes(nodeId)) {
                                                pattern.nodeIds.push(nodeId);
                                            }
                                        }
                                        return [3 /*break*/, 5];
                                    case 1:
                                        nodeIds = __spreadArray([], new Set(eventsOfType.map(function (e) { return e.nodeId || 'system'; }).filter(Boolean)), true);
                                        newPattern = {
                                            id: patternId,
                                            type: PatternType.CYCLICAL,
                                            nodeIds: nodeIds,
                                            eventTypes: [eventType],
                                            confidence: 0.7,
                                            description: "System-wide cyclical pattern of ".concat(eventType, " events occurring approximately every ").concat(Math.round(avgDiff / 1000), " seconds with ").concat(consistencyRatio.toFixed(2), " consistency ratio"),
                                            firstDetected: new Date(),
                                            lastDetected: new Date(),
                                            occurrences: eventsOfType.length,
                                            strategicLayer: 3
                                        };
                                        this_1.patterns.set(patternId, newPattern);
                                        insightId = "insight-".concat(patternId);
                                        newInsight = {
                                            id: insightId,
                                            patternId: patternId,
                                            title: "Detected system-wide cyclical pattern for ".concat(eventType, " events"),
                                            description: "Analysis shows ".concat(eventType, " events occur cyclically every ").concat(Math.round(avgDiff / 1000), " seconds across ").concat(nodeIds.length, " nodes with good consistency (").concat(consistencyRatio.toFixed(2), "). This may indicate a coordinated process or underlying system rhythm."),
                                            severity: InsightSeverity.INFORMATION,
                                            confidence: 0.7,
                                            impact: 5,
                                            suggestedActions: [
                                                "Monitor for changes in this cycle",
                                                "Check if this cycle aligns with any system processes",
                                                "Consider optimizing resources around this cycle if appropriate"
                                            ],
                                            createdAt: new Date(),
                                            strategicLayer: 3
                                        };
                                        this_1.insights.set(insightId, newInsight);
                                        if (!(nodeIds.length > 1)) return [3 /*break*/, 5];
                                        _f = 0, nodeIds_1 = nodeIds;
                                        _g.label = 2;
                                    case 2:
                                        if (!(_f < nodeIds_1.length)) return [3 /*break*/, 5];
                                        nodeId = nodeIds_1[_f];
                                        return [4 /*yield*/, qrnService.recordMetaCognitiveEvent({
                                                nodeId: nodeId, // Explicitly use the same variable name
                                                type: 'system-pattern-detection',
                                                description: "Detected system-wide cyclical pattern for ".concat(eventType, " events"),
                                                details: {
                                                    patternId: patternId,
                                                    insightId: insightId,
                                                    confidence: newPattern.confidence,
                                                    impact: newInsight.impact
                                                },
                                                confidence: newPattern.confidence,
                                                impact: newInsight.impact
                                            })];
                                    case 3:
                                        _g.sent();
                                        _g.label = 4;
                                    case 4:
                                        _f++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = 0, _b = eventsByType.entries();
                        _d.label = 1;
                    case 1:
                        if (!(_a < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_a], eventType = _c[0], eventsOfType = _c[1];
                        return [5 /*yield**/, _loop_1(eventType, eventsOfType)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Detect patterns specific to individual nodes
     */
    MetaCognitiveAnalysisEngine.prototype.detectNodePatterns = function (events) {
        return __awaiter(this, void 0, void 0, function () {
            var eventsByNode, _i, events_2, event_3, nodeId, _a, _b, _c, nodeId, nodeEvents, eventTypeCounts, _d, nodeEvents_1, event_4, _e, _f, _g, eventType, count, percentage, patternId, pattern, newPattern, qrn, nodeName, insightId, newInsight, sequences, seqLength, i, seq1, _loop_2, j, state_1, bestSeq, bestCount, _h, sequences_1, seq, count, pos, _loop_3, score, currentScore, seqStr, patternId, pattern, newPattern, qrn, nodeName, insightId, newInsight;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        eventsByNode = new Map();
                        for (_i = 0, events_2 = events; _i < events_2.length; _i++) {
                            event_3 = events_2[_i];
                            nodeId = event_3.nodeId || 'system';
                            if (!eventsByNode.has(nodeId)) {
                                eventsByNode.set(nodeId, []);
                            }
                            eventsByNode.get(nodeId).push(event_3);
                        }
                        _a = 0, _b = eventsByNode.entries();
                        _j.label = 1;
                    case 1:
                        if (!(_a < _b.length)) return [3 /*break*/, 12];
                        _c = _b[_a], nodeId = _c[0], nodeEvents = _c[1];
                        if (nodeEvents.length < 5)
                            return [3 /*break*/, 11]; // Need enough data
                        eventTypeCounts = new Map();
                        for (_d = 0, nodeEvents_1 = nodeEvents; _d < nodeEvents_1.length; _d++) {
                            event_4 = nodeEvents_1[_d];
                            eventTypeCounts.set(event_4.type, (eventTypeCounts.get(event_4.type) || 0) + 1);
                        }
                        _e = 0, _f = eventTypeCounts.entries();
                        _j.label = 2;
                    case 2:
                        if (!(_e < _f.length)) return [3 /*break*/, 7];
                        _g = _f[_e], eventType = _g[0], count = _g[1];
                        percentage = count / nodeEvents.length;
                        if (!(percentage > 0.4 && count >= 4)) return [3 /*break*/, 6];
                        patternId = "node-dominant-".concat(nodeId, "-").concat(eventType);
                        if (!this.patterns.has(patternId)) return [3 /*break*/, 3];
                        pattern = this.patterns.get(patternId);
                        pattern.lastDetected = new Date();
                        pattern.occurrences = count;
                        pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
                        return [3 /*break*/, 6];
                    case 3:
                        newPattern = {
                            id: patternId,
                            type: PatternType.EMERGENT,
                            nodeIds: [nodeId],
                            eventTypes: [eventType],
                            confidence: 0.8,
                            description: "Node ".concat(nodeId, " shows dominant pattern of ").concat(eventType, " events (").concat(Math.round(percentage * 100), "% of all events)"),
                            firstDetected: new Date(),
                            lastDetected: new Date(),
                            occurrences: count,
                            strategicLayer: 2
                        };
                        this.patterns.set(patternId, newPattern);
                        if (!(percentage > 0.6)) return [3 /*break*/, 6];
                        return [4 /*yield*/, qrnService.getNode(nodeId)];
                    case 4:
                        qrn = _j.sent();
                        nodeName = qrn ? qrn.name : nodeId;
                        insightId = "insight-".concat(patternId);
                        newInsight = {
                            id: insightId,
                            patternId: patternId,
                            nodeId: nodeId,
                            title: "Dominant behavior pattern detected for ".concat(nodeName),
                            description: "".concat(nodeName, " exhibits a strong tendency toward ").concat(eventType, " events (").concat(Math.round(percentage * 100), "% of all events). This suggests specialized functionality or a potential behavioral bias."),
                            severity: InsightSeverity.INFORMATION,
                            confidence: 0.8,
                            impact: 6,
                            suggestedActions: [
                                "Review if this specialization is intended",
                                "Consider if the node could benefit from more diverse behaviors",
                                "Monitor for changes in this pattern over time"
                            ],
                            createdAt: new Date(),
                            strategicLayer: 2
                        };
                        this.insights.set(insightId, newInsight);
                        // Record meta-cognitive event about this insight
                        return [4 /*yield*/, qrnService.recordMetaCognitiveEvent({
                                nodeId: nodeId,
                                type: 'behavioral-insight',
                                description: "Generated insight about dominant ".concat(eventType, " behavior"),
                                details: {
                                    insightId: insightId,
                                    pattern: newPattern.id,
                                    percentage: percentage
                                },
                                confidence: newInsight.confidence,
                                impact: newInsight.impact
                            })];
                    case 5:
                        // Record meta-cognitive event about this insight
                        _j.sent();
                        _j.label = 6;
                    case 6:
                        _e++;
                        return [3 /*break*/, 2];
                    case 7:
                        if (!(nodeEvents.length >= 8)) return [3 /*break*/, 11];
                        // Sort by timestamp (createdAt)
                        nodeEvents.sort(function (a, b) {
                            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                        });
                        sequences = [];
                        for (seqLength = 2; seqLength <= 4; seqLength++) {
                            // Generate all possible sequences of this length
                            for (i = 0; i <= nodeEvents.length - seqLength * 2; i++) {
                                seq1 = nodeEvents.slice(i, i + seqLength).map(function (e) { return e.type; });
                                _loop_2 = function (j) {
                                    var seq2 = nodeEvents.slice(j, j + seqLength).map(function (e) { return e.type; });
                                    // Check if sequences match
                                    var match = seq1.every(function (type, idx) { return type === seq2[idx]; });
                                    if (match) {
                                        // Found a repeating sequence
                                        sequences.push(seq1);
                                        return "break";
                                    }
                                };
                                // Look for a matching sequence later in the events
                                for (j = i + seqLength; j <= nodeEvents.length - seqLength; j++) {
                                    state_1 = _loop_2(j);
                                    if (state_1 === "break")
                                        break;
                                }
                            }
                        }
                        if (!(sequences.length > 0)) return [3 /*break*/, 11];
                        bestSeq = sequences[0];
                        bestCount = 0;
                        for (_h = 0, sequences_1 = sequences; _h < sequences_1.length; _h++) {
                            seq = sequences_1[_h];
                            count = 0;
                            pos = 0;
                            _loop_3 = function () {
                                var eventSeq = nodeEvents.slice(pos, pos + seq.length).map(function (e) { return e.type; });
                                var match = seq.every(function (type, idx) { return type === eventSeq[idx]; });
                                if (match) {
                                    count++;
                                    pos += seq.length;
                                }
                                else {
                                    pos++;
                                }
                            };
                            while (pos <= nodeEvents.length - seq.length) {
                                _loop_3();
                            }
                            score = count * seq.length;
                            currentScore = bestCount * bestSeq.length;
                            if (score > currentScore) {
                                bestSeq = seq;
                                bestCount = count;
                            }
                        }
                        if (!(bestCount >= 2)) return [3 /*break*/, 11];
                        seqStr = bestSeq.join(' → ');
                        patternId = "sequential-".concat(nodeId, "-").concat(bestSeq.join('-'));
                        if (!this.patterns.has(patternId)) return [3 /*break*/, 8];
                        pattern = this.patterns.get(patternId);
                        pattern.lastDetected = new Date();
                        pattern.occurrences = Math.max(pattern.occurrences, bestCount);
                        pattern.confidence = Math.min(0.95, pattern.confidence + 0.05);
                        return [3 /*break*/, 11];
                    case 8:
                        newPattern = {
                            id: patternId,
                            type: PatternType.SEQUENTIAL,
                            nodeIds: [nodeId],
                            eventTypes: __spreadArray([], new Set(bestSeq), true), // Unique event types
                            confidence: 0.7,
                            description: "Sequential pattern detected: ".concat(seqStr, " (occurs ").concat(bestCount, " times)"),
                            firstDetected: new Date(),
                            lastDetected: new Date(),
                            occurrences: bestCount,
                            strategicLayer: 4 // Sequential patterns have higher strategic value
                        };
                        this.patterns.set(patternId, newPattern);
                        if (!(bestCount >= 3 || bestSeq.length >= 3)) return [3 /*break*/, 11];
                        return [4 /*yield*/, qrnService.getNode(nodeId)];
                    case 9:
                        qrn = _j.sent();
                        nodeName = qrn ? qrn.name : nodeId;
                        insightId = "insight-".concat(patternId);
                        newInsight = {
                            id: insightId,
                            patternId: patternId,
                            nodeId: nodeId,
                            title: "Behavioral sequence detected for ".concat(nodeName),
                            description: "".concat(nodeName, " exhibits a recurring behavioral sequence: ").concat(seqStr, ". This sequence has occurred ").concat(bestCount, " times and may represent a core process or workflow."),
                            severity: InsightSeverity.SUGGESTION,
                            confidence: 0.7,
                            impact: 7,
                            suggestedActions: [
                                "Consider formalizing this sequence as a defined workflow",
                                "Analyze if this sequence can be optimized",
                                "Monitor performance metrics during this sequence execution"
                            ],
                            createdAt: new Date(),
                            strategicLayer: 4
                        };
                        this.insights.set(insightId, newInsight);
                        // Record meta-cognitive event about this insight
                        return [4 /*yield*/, qrnService.recordMetaCognitiveEvent({
                                nodeId: nodeId,
                                type: 'sequence-detection',
                                description: "Detected recurring behavioral sequence: ".concat(seqStr),
                                details: {
                                    insightId: insightId,
                                    pattern: newPattern.id,
                                    sequence: bestSeq,
                                    occurrences: bestCount
                                },
                                confidence: newInsight.confidence,
                                impact: newInsight.impact
                            })];
                    case 10:
                        // Record meta-cognitive event about this insight
                        _j.sent();
                        _j.label = 11;
                    case 11:
                        _a++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate insights from a single event
     */
    MetaCognitiveAnalysisEngine.prototype.generateEventInsights = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var insightId, nodeIdSafe, qrn, nodeName, newInsight, confidenceImpactRatio, insightId, nodeIdSafe, newInsight, insightId, nodeIdSafe, newInsight;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(event.impact && event.impact >= 8)) return [3 /*break*/, 2];
                        insightId = "immediate-".concat(event.id);
                        nodeIdSafe = event.nodeId || 'system';
                        return [4 /*yield*/, qrnService.getNode(nodeIdSafe)];
                    case 1:
                        qrn = _a.sent();
                        nodeName = qrn ? qrn.name : nodeIdSafe;
                        newInsight = {
                            id: insightId,
                            nodeId: nodeIdSafe,
                            title: "High-impact event detected for ".concat(nodeName),
                            description: "".concat(nodeName, " reported a high-impact ").concat(event.type, " event: \"").concat(event.description, "\". This event has an impact rating of ").concat(event.impact, "/10 and may require attention."),
                            severity: InsightSeverity.WARNING,
                            confidence: event.confidence || 0.7,
                            impact: event.impact,
                            suggestedActions: [
                                "Review the details of this event",
                                "Check if this event has affected system performance",
                                "Consider if this event requires manual intervention"
                            ],
                            createdAt: new Date(),
                            strategicLayer: 1 // Immediate concerns are low strategic layer
                        };
                        this.insights.set(insightId, newInsight);
                        _a.label = 2;
                    case 2:
                        if (!(event.confidence && event.impact)) return [3 /*break*/, 4];
                        confidenceImpactRatio = event.confidence / event.impact;
                        if (confidenceImpactRatio > 0.2 && event.confidence > 0.9 && event.impact < 4) {
                            insightId = "confidence-anomaly-".concat(event.id);
                            nodeIdSafe = event.nodeId || 'system';
                            newInsight = {
                                id: insightId,
                                nodeId: nodeIdSafe,
                                title: "Unusual certainty about low-impact event",
                                description: "Detected anomalously high confidence (".concat(event.confidence.toFixed(2), ") about a low-impact event (").concat(event.impact, "/10): \"").concat(event.description, "\". This confidence-impact mismatch may indicate cognitive bias or misaligned prioritization."),
                                severity: InsightSeverity.INFORMATION,
                                confidence: 0.6,
                                impact: 3,
                                suggestedActions: [
                                    "Review confidence calculation for this event type",
                                    "Consider if impact rating should be adjusted"
                                ],
                                createdAt: new Date(),
                                strategicLayer: 3 // Cognitive biases have medium strategic significance
                            };
                            this.insights.set(insightId, newInsight);
                        }
                        if (!(confidenceImpactRatio < 0.05 && event.confidence < 0.4 && event.impact > 7)) return [3 /*break*/, 4];
                        insightId = "uncertainty-risk-".concat(event.id);
                        nodeIdSafe = event.nodeId || 'system';
                        newInsight = {
                            id: insightId,
                            nodeId: nodeIdSafe,
                            title: "Critical uncertainty detected",
                            description: "Detected low confidence (".concat(event.confidence.toFixed(2), ") about a high-impact event (").concat(event.impact, "/10): \"").concat(event.description, "\". This combination of uncertainty and high stakes requires attention."),
                            severity: InsightSeverity.WARNING,
                            confidence: 0.8,
                            impact: 8,
                            suggestedActions: [
                                "Gather more information to increase confidence",
                                "Consider preventative measures given the high potential impact",
                                "Monitor this situation closely"
                            ],
                            createdAt: new Date(),
                            strategicLayer: 4 // High-impact uncertainties have high strategic significance
                        };
                        this.insights.set(insightId, newInsight);
                        // Record meta-cognitive event about this critical uncertainty
                        return [4 /*yield*/, qrnService.recordMetaCognitiveEvent({
                                nodeId: nodeIdSafe,
                                type: 'critical-uncertainty',
                                description: "Detected critical uncertainty with high potential impact",
                                details: {
                                    insightId: insightId,
                                    originalEvent: event.id,
                                    confidence: event.confidence,
                                    impact: event.impact
                                },
                                confidence: newInsight.confidence,
                                impact: newInsight.impact
                            })];
                    case 3:
                        // Record meta-cognitive event about this critical uncertainty
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate system-wide insights
     */
    MetaCognitiveAnalysisEngine.prototype.generateSystemInsights = function (events) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamps, timeDiffs, i, avgTimeDiff, recentTimeDiffs, recentAvgTimeDiff, insightId, newInsight, uniqueNodeIds, _i, uniqueNodeIds_1, nodeId, eventTypeCounts, _a, events_3, event_5, entropy, _b, _c, count, p, sortedTypes, dominantTypes, insightId, newInsight;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Skip if not enough events
                        if (events.length < 20)
                            return [2 /*return*/];
                        timestamps = events.map(function (e) { return new Date(e.createdAt).getTime(); }).sort();
                        timeDiffs = [];
                        for (i = 1; i < timestamps.length; i++) {
                            timeDiffs.push(timestamps[i] - timestamps[i - 1]);
                        }
                        avgTimeDiff = timeDiffs.reduce(function (a, b) { return a + b; }, 0) / timeDiffs.length;
                        recentTimeDiffs = timeDiffs.slice(-5);
                        recentAvgTimeDiff = recentTimeDiffs.reduce(function (a, b) { return a + b; }, 0) / recentTimeDiffs.length;
                        if (!(avgTimeDiff > 0 && recentAvgTimeDiff > 0 && recentAvgTimeDiff < avgTimeDiff * 0.5 && events.length >= 30)) return [3 /*break*/, 4];
                        insightId = "system-acceleration-".concat(Date.now());
                        newInsight = {
                            id: insightId,
                            title: "System activity acceleration detected",
                            description: "Recent meta-cognitive events are occurring ".concat((avgTimeDiff / recentAvgTimeDiff).toFixed(1), "x faster than the historical average. This may indicate increased system load, an emerging process, or potential runaway behavior."),
                            severity: InsightSeverity.WARNING,
                            confidence: 0.75,
                            impact: 7,
                            suggestedActions: [
                                "Monitor system resources",
                                "Check for concurrent user activity spikes",
                                "Verify that feedback loops are properly regulated",
                                "Consider throttling if acceleration continues to increase"
                            ],
                            createdAt: new Date(),
                            strategicLayer: 4
                        };
                        this.insights.set(insightId, newInsight);
                        uniqueNodeIds = __spreadArray([], new Set(events.slice(-10).map(function (e) { return e.nodeId || 'system'; })), true).slice(0, 3);
                        _i = 0, uniqueNodeIds_1 = uniqueNodeIds;
                        _d.label = 1;
                    case 1:
                        if (!(_i < uniqueNodeIds_1.length)) return [3 /*break*/, 4];
                        nodeId = uniqueNodeIds_1[_i];
                        return [4 /*yield*/, qrnService.recordMetaCognitiveEvent({
                                nodeId: nodeId,
                                type: 'system-acceleration',
                                description: "System-wide acceleration of activity detected",
                                details: {
                                    insightId: insightId,
                                    accelerationFactor: avgTimeDiff / recentAvgTimeDiff,
                                    historicalAvgInterval: Math.round(avgTimeDiff),
                                    recentAvgInterval: Math.round(recentAvgTimeDiff)
                                },
                                confidence: newInsight.confidence,
                                impact: newInsight.impact
                            })];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        eventTypeCounts = new Map();
                        for (_a = 0, events_3 = events; _a < events_3.length; _a++) {
                            event_5 = events_3[_a];
                            eventTypeCounts.set(event_5.type, (eventTypeCounts.get(event_5.type) || 0) + 1);
                        }
                        entropy = 0;
                        for (_b = 0, _c = eventTypeCounts.values(); _b < _c.length; _b++) {
                            count = _c[_b];
                            p = count / events.length;
                            entropy -= p * Math.log2(p);
                        }
                        // Very low entropy means a few event types dominate
                        if (entropy < 1.5 && eventTypeCounts.size >= 5) {
                            sortedTypes = __spreadArray([], eventTypeCounts.entries(), true).sort(function (a, b) { return b[1] - a[1]; })
                                .slice(0, 3);
                            dominantTypes = sortedTypes
                                .map(function (_a) {
                                var type = _a[0], count = _a[1];
                                return "".concat(type, " (").concat(Math.round(count / events.length * 100), "%)");
                            })
                                .join(', ');
                            insightId = "low-entropy-".concat(Date.now());
                            newInsight = {
                                id: insightId,
                                title: "Low cognitive diversity detected",
                                description: "The system is showing unusually low diversity in its meta-cognitive events (entropy: ".concat(entropy.toFixed(2), "). Events are dominated by: ").concat(dominantTypes, ". This may indicate a narrow operational focus or potential fixation."),
                                severity: InsightSeverity.SUGGESTION,
                                confidence: 0.7,
                                impact: 6,
                                suggestedActions: [
                                    "Review if this specialized focus is appropriate for current goals",
                                    "Consider introducing more diverse cognitive processes",
                                    "Monitor for changes in this pattern over time"
                                ],
                                createdAt: new Date(),
                                strategicLayer: 5 // Cognitive diversity is highest strategic layer
                            };
                            this.insights.set(insightId, newInsight);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all detected patterns with no filtering
     * Used for testing and direct access to all patterns
     */
    MetaCognitiveAnalysisEngine.prototype.getAllPatterns = function () {
        return __spreadArray([], this.patterns.values(), true);
    };
    /**
     * Get all detected insights with no filtering
     * Used for testing and direct access to all insights
     */
    MetaCognitiveAnalysisEngine.prototype.getAllInsights = function () {
        return __spreadArray([], this.insights.values(), true);
    };
    /**
     * Get detected patterns with optional filtering
     */
    MetaCognitiveAnalysisEngine.prototype.getPatterns = function (filter) {
        var patterns = __spreadArray([], this.patterns.values(), true);
        // Apply filters
        if (filter) {
            if (filter.nodeId) {
                var nodeIdSafe_3 = filter.nodeId;
                patterns = patterns.filter(function (p) { return p.nodeIds.some(function (id) { return id === nodeIdSafe_3; }); });
            }
            if (filter.patternType) {
                patterns = patterns.filter(function (p) { return p.type === filter.patternType; });
            }
            if (filter.minConfidence !== undefined) {
                var minConfidence_1 = filter.minConfidence;
                patterns = patterns.filter(function (p) { return p.confidence >= minConfidence_1; });
            }
            if (filter.strategicLayer !== undefined) {
                patterns = patterns.filter(function (p) { return p.strategicLayer === filter.strategicLayer; });
            }
        }
        // Sort by recency
        return patterns.sort(function (a, b) {
            return b.lastDetected.getTime() - a.lastDetected.getTime();
        });
    };
    /**
     * Get all generated insights
     */
    MetaCognitiveAnalysisEngine.prototype.getInsights = function (filter) {
        var insights = __spreadArray([], this.insights.values(), true);
        // Apply filters
        if (filter) {
            if (filter.nodeId) {
                var nodeIdSafe_4 = filter.nodeId;
                insights = insights.filter(function (i) { return !i.nodeId || i.nodeId === nodeIdSafe_4; });
            }
            if (filter.severity) {
                insights = insights.filter(function (i) { return i.severity === filter.severity; });
            }
            if (filter.minImpact !== undefined) {
                var minImpact_1 = filter.minImpact;
                insights = insights.filter(function (i) { return i.impact >= minImpact_1; });
            }
            if (filter.strategicLayer !== undefined) {
                insights = insights.filter(function (i) { return i.strategicLayer === filter.strategicLayer; });
            }
        }
        // Sort by impact and timestamp
        return insights.sort(function (a, b) {
            if (b.impact !== a.impact) {
                return b.impact - a.impact; // Higher impact first
            }
            return b.createdAt.getTime() - a.createdAt.getTime(); // More recent first
        });
    };
    /**
     * Analyze system stability trends over time
     * This method examines historical system stability metrics to detect trends and anomalies
     * @param days Number of days of history to analyze (default: 7)
     * @returns Analysis results including trends and recommendations
     */
    MetaCognitiveAnalysisEngine.prototype.analyzeSystemStabilityTrends = function () {
        return __awaiter(this, arguments, void 0, function (days) {
            var endTime, startTime, stabilityHistory, _a, values, timestamps, currentStability, avgStability_1, minStability, maxStability, squaredDiffs, avgSquaredDiff, volatility, anomalies, i, val, deviation, xValues, xMean, yMean, numerator, denominator, i, slope, recentSlope, trend, recommendations, error_3;
            if (days === void 0) { days = 7; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        endTime = new Date();
                        startTime = new Date(endTime.getTime() - (days * 24 * 60 * 60 * 1000));
                        if (!('getSystemStabilityHistory' in storage)) return [3 /*break*/, 2];
                        return [4 /*yield*/, storage.getSystemStabilityHistory(startTime, endTime)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = [];
                        _b.label = 3;
                    case 3:
                        stabilityHistory = _a;
                        // If insufficient data, return early
                        if (!stabilityHistory || stabilityHistory.length < 3) {
                            return [2 /*return*/, {
                                    trend: 'insufficient-data',
                                    currentStability: 0,
                                    avgStability: 0,
                                    minStability: 0,
                                    maxStability: 0,
                                    volatility: 0,
                                    anomalies: [],
                                    recommendations: [
                                        'Collect more system stability data',
                                        'Ensure metrics collection is properly configured'
                                    ]
                                }];
                        }
                        values = stabilityHistory.map(function (entry) { return entry.stability; });
                        timestamps = stabilityHistory.map(function (entry) { return new Date(entry.timestamp); });
                        currentStability = values[values.length - 1];
                        avgStability_1 = values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
                        minStability = Math.min.apply(Math, values);
                        maxStability = Math.max.apply(Math, values);
                        squaredDiffs = values.map(function (val) { return Math.pow(val - avgStability_1, 2); });
                        avgSquaredDiff = squaredDiffs.reduce(function (sum, val) { return sum + val; }, 0) / squaredDiffs.length;
                        volatility = Math.sqrt(avgSquaredDiff);
                        anomalies = [];
                        for (i = 0; i < values.length; i++) {
                            val = values[i];
                            deviation = Math.abs(val - avgStability_1) / volatility;
                            if (deviation > 2) {
                                anomalies.push({
                                    timestamp: timestamps[i],
                                    value: val,
                                    deviation: deviation
                                });
                            }
                        }
                        xValues = Array.from({ length: values.length }, function (_, i) { return i; });
                        xMean = xValues.reduce(function (sum, x) { return sum + x; }, 0) / xValues.length;
                        yMean = avgStability_1;
                        numerator = 0;
                        denominator = 0;
                        for (i = 0; i < values.length; i++) {
                            numerator += (xValues[i] - xMean) * (values[i] - yMean);
                            denominator += Math.pow(xValues[i] - xMean, 2);
                        }
                        slope = denominator !== 0 ? numerator / denominator : 0;
                        recentSlope = values.length >= 10 ?
                            this.calculateSlope(values.slice(-10)) :
                            this.calculateSlope(values);
                        trend = void 0;
                        if (volatility > 0.2) {
                            trend = 'fluctuating';
                        }
                        else if (Math.abs(slope) < 0.005) {
                            trend = 'stable';
                        }
                        else if (slope > 0) {
                            trend = 'improving';
                        }
                        else {
                            trend = 'declining';
                        }
                        recommendations = [];
                        if (trend === 'declining') {
                            recommendations.push('Investigate recent system changes that may be affecting stability');
                            recommendations.push('Consider rolling back to the last known stable configuration');
                            recommendations.push('Increase monitoring frequency for critical components');
                        }
                        else if (trend === 'fluctuating') {
                            recommendations.push('Identify and address sources of system volatility');
                            recommendations.push('Implement additional buffering or stabilization mechanisms');
                            recommendations.push('Review system response to varying loads');
                        }
                        else if (currentStability < 0.4) {
                            recommendations.push('Critical: System stability is below acceptable thresholds');
                            recommendations.push('Perform immediate diagnostic of all core components');
                            recommendations.push('Consider reducing system load until stability improves');
                        }
                        else if (trend === 'improving' && currentStability < 0.7) {
                            recommendations.push('Continue current improvement trajectory');
                            recommendations.push('Document recent changes that may be contributing to improvement');
                        }
                        else if (trend === 'stable' && currentStability > 0.8) {
                            recommendations.push('System is operating at optimal stability');
                            recommendations.push('Consider experimental optimizations to further improve performance');
                        }
                        return [2 /*return*/, {
                                trend: trend,
                                currentStability: currentStability,
                                avgStability: avgStability_1,
                                minStability: minStability,
                                maxStability: maxStability,
                                volatility: volatility,
                                anomalies: anomalies,
                                recommendations: recommendations
                            }];
                    case 4:
                        error_3 = _b.sent();
                        console.error('Error analyzing system stability trends:', error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate the slope of a series of values using linear regression
     * @param values Array of numerical values
     * @returns Slope indicating trend direction and magnitude
     */
    MetaCognitiveAnalysisEngine.prototype.calculateSlope = function (values) {
        var xValues = Array.from({ length: values.length }, function (_, i) { return i; });
        var xMean = xValues.reduce(function (sum, x) { return sum + x; }, 0) / xValues.length;
        var yMean = values.reduce(function (sum, y) { return sum + y; }, 0) / values.length;
        var numerator = 0;
        var denominator = 0;
        for (var i = 0; i < values.length; i++) {
            numerator += (xValues[i] - xMean) * (values[i] - yMean);
            denominator += Math.pow(xValues[i] - xMean, 2);
        }
        return denominator !== 0 ? numerator / denominator : 0;
    };
    /**
     * Get a summary of the current cognitive state
     */
    MetaCognitiveAnalysisEngine.prototype.getCognitiveStateSummary = function () {
        var patterns = __spreadArray([], this.patterns.values(), true);
        var insights = __spreadArray([], this.insights.values(), true);
        // Count warnings and critical insights
        var warningCount = insights.filter(function (i) { return i.severity === InsightSeverity.WARNING; }).length;
        var criticalCount = insights.filter(function (i) { return i.severity === InsightSeverity.CRITICAL; }).length;
        // Get top insights by impact
        var topInsights = __spreadArray([], insights, true).sort(function (a, b) { return b.impact - a.impact; })
            .slice(0, 5);
        // Calculate strategic layer distribution
        var strategicLayerDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };
        for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
            var pattern = patterns_1[_i];
            strategicLayerDistribution[pattern.strategicLayer]++;
        }
        for (var _a = 0, insights_1 = insights; _a < insights_1.length; _a++) {
            var insight = insights_1[_a];
            strategicLayerDistribution[insight.strategicLayer]++;
        }
        // Calculate entropy (cognitive diversity)
        var patternsByType = new Map();
        for (var _b = 0, patterns_2 = patterns; _b < patterns_2.length; _b++) {
            var pattern = patterns_2[_b];
            patternsByType.set(pattern.type, (patternsByType.get(pattern.type) || 0) + 1);
        }
        var entropy = 0;
        var total = patterns.length;
        if (total > 0) {
            for (var _c = 0, _d = patternsByType.values(); _c < _d.length; _c++) {
                var count = _d[_c];
                var p = count / total;
                entropy -= p * Math.log2(p);
            }
        }
        return {
            patternCount: patterns.length,
            insightCount: insights.length,
            warningCount: warningCount,
            criticalCount: criticalCount,
            topInsights: topInsights,
            entropy: entropy,
            strategicLayerDistribution: strategicLayerDistribution
        };
    };
    /**
     * Clear old patterns and insights to prevent memory bloat
     * Called automatically by the background analysis
     */
    MetaCognitiveAnalysisEngine.prototype.cleanupOldData = function () {
        var now = new Date().getTime();
        var oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        // Remove patterns not detected in the last week
        for (var _i = 0, _a = this.patterns.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], pattern = _b[1];
            if (pattern.lastDetected.getTime() < oneWeekAgo) {
                this.patterns.delete(id);
            }
        }
        // Remove insights older than a week, unless they are critical
        for (var _c = 0, _d = this.insights.entries(); _c < _d.length; _c++) {
            var _e = _d[_c], id = _e[0], insight = _e[1];
            if (insight.severity !== InsightSeverity.CRITICAL &&
                insight.createdAt.getTime() < oneWeekAgo) {
                this.insights.delete(id);
            }
        }
    };
    return MetaCognitiveAnalysisEngine;
}());
export { MetaCognitiveAnalysisEngine };
// Singleton instance
export var metaCognitiveEngine = MetaCognitiveAnalysisEngine.getInstance();
