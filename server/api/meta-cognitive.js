/**
 * Meta-Cognitive API (Neural-Quantum naming: 'mc-')
 *
 * This API provides endpoints for accessing the Meta-Cognitive Analysis Engine,
 * which analyzes patterns, generates insights, and provides feedback loops
 * for system improvement.
 *
 * All endpoints follow the neural-quantum naming convention with 'mc-' prefix
 * to indicate meta-cognitive processes.
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
import { Router } from 'express';
import { metaCognitiveEngine, PatternType, InsightSeverity } from '../services/qrn/meta-cognitive-analysis-engine.js';
import { z } from 'zod';
import { storage } from '../storage.js';
export var router = Router();
export { metaCognitiveEngine }; // Export the engine directly for scripts to use
// Schema for pattern filtering
var patternFilterSchema = z.object({
    nodeId: z.string().optional(),
    patternType: z.enum([
        PatternType.SEQUENTIAL,
        PatternType.CYCLICAL,
        PatternType.CAUSAL,
        PatternType.CORRELATIONAL,
        PatternType.EMERGENT
    ]).optional(),
    minConfidence: z.number().min(0).max(1).optional(),
    strategicLayer: z.number().min(1).max(5).optional(),
    limit: z.number().min(1).max(100).optional()
});
// Schema for insight filtering
var insightFilterSchema = z.object({
    nodeId: z.string().optional(),
    severity: z.enum([
        InsightSeverity.INFORMATION,
        InsightSeverity.SUGGESTION,
        InsightSeverity.WARNING,
        InsightSeverity.CRITICAL
    ]).optional(),
    minImpact: z.number().min(1).max(10).optional(),
    strategicLayer: z.number().min(1).max(5).optional(),
    limit: z.number().min(1).max(100).optional()
});
/**
 * Get cognitive state summary
 * Using neural-quantum naming convention: mcGetCognitiveStateSummary
 */
router.get('/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var summary;
    return __generator(this, function (_a) {
        try {
            summary = metaCognitiveEngine.getCognitiveStateSummary();
            res.json(summary);
        }
        catch (error) {
            console.error('Error getting cognitive state summary:', error);
            res.status(500).json({ error: 'Failed to get cognitive state summary' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * Get cognitive patterns
 * Using neural-quantum naming convention: mcGetCognitivePatterns
 */
router.get('/patterns', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationResult, _a, nodeId, patternType, minConfidence, strategicLayer, limit, patterns;
    return __generator(this, function (_b) {
        try {
            validationResult = patternFilterSchema.safeParse(req.query);
            if (!validationResult.success) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Invalid query parameters',
                        details: validationResult.error.format()
                    })];
            }
            _a = validationResult.data, nodeId = _a.nodeId, patternType = _a.patternType, minConfidence = _a.minConfidence, strategicLayer = _a.strategicLayer;
            limit = validationResult.data.limit || 50;
            patterns = metaCognitiveEngine.getPatterns({
                nodeId: nodeId,
                patternType: patternType,
                minConfidence: minConfidence,
                strategicLayer: strategicLayer
            });
            // Apply limit
            patterns = patterns.slice(0, limit);
            res.json(patterns);
        }
        catch (error) {
            console.error('Error getting cognitive patterns:', error);
            res.status(500).json({ error: 'Failed to get cognitive patterns' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * Get cognitive insights
 * Using neural-quantum naming convention: mcGetCognitiveInsights
 */
router.get('/insights', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationResult, _a, nodeId, severity, minImpact, strategicLayer, limit, insights;
    return __generator(this, function (_b) {
        try {
            validationResult = insightFilterSchema.safeParse(req.query);
            if (!validationResult.success) {
                return [2 /*return*/, res.status(400).json({
                        error: 'Invalid query parameters',
                        details: validationResult.error.format()
                    })];
            }
            _a = validationResult.data, nodeId = _a.nodeId, severity = _a.severity, minImpact = _a.minImpact, strategicLayer = _a.strategicLayer;
            limit = validationResult.data.limit || 50;
            insights = metaCognitiveEngine.getInsights({
                nodeId: nodeId,
                severity: severity,
                minImpact: minImpact,
                strategicLayer: strategicLayer
            });
            // Apply limit
            insights = insights.slice(0, limit);
            res.json(insights);
        }
        catch (error) {
            console.error('Error getting cognitive insights:', error);
            res.status(500).json({ error: 'Failed to get cognitive insights' });
        }
        return [2 /*return*/];
    });
}); });
/**
 * Get patterns for a specific node
 * Using neural-quantum naming convention: mcGetNodePatterns
 */
router.get('/nodes/:nodeId/patterns', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nodeId, node, patterns, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                nodeId = req.params.nodeId;
                // Validate nodeId format (UUID)
                if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nodeId)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid node ID format' })];
                }
                return [4 /*yield*/, storage.getQuantumRootNode(nodeId)];
            case 1:
                node = _a.sent();
                if (!node) {
                    return [2 /*return*/, res.status(404).json({ error: 'Quantum Root Node not found' })];
                }
                patterns = metaCognitiveEngine.getPatterns({ nodeId: nodeId });
                res.json(patterns);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error getting node patterns:', error_1);
                res.status(500).json({ error: 'Failed to get node patterns' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get insights for a specific node
 * Using neural-quantum naming convention: mcGetNodeInsights
 */
router.get('/nodes/:nodeId/insights', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nodeId, node, insights, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                nodeId = req.params.nodeId;
                // Validate nodeId format (UUID)
                if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nodeId)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid node ID format' })];
                }
                return [4 /*yield*/, storage.getQuantumRootNode(nodeId)];
            case 1:
                node = _a.sent();
                if (!node) {
                    return [2 /*return*/, res.status(404).json({ error: 'Quantum Root Node not found' })];
                }
                insights = metaCognitiveEngine.getInsights({ nodeId: nodeId });
                res.json(insights);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error getting node insights:', error_2);
                res.status(500).json({ error: 'Failed to get node insights' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Analyze system stability trends
 * Using neural-quantum naming convention: mcAnalyzeSystemStabilityTrends
 */
router.get('/stability-trends', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var daysParam, days, parsedDays, analysis, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                daysParam = req.query.days;
                days = 7;
                if (daysParam) {
                    parsedDays = parseInt(daysParam, 10);
                    if (!isNaN(parsedDays) && parsedDays > 0 && parsedDays <= 90) {
                        days = parsedDays;
                    }
                    else {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Invalid days parameter. Must be a number between 1 and 90.'
                            })];
                    }
                }
                return [4 /*yield*/, metaCognitiveEngine.analyzeSystemStabilityTrends(days)];
            case 1:
                analysis = _a.sent();
                res.json(__assign(__assign({}, analysis), { analyzedDays: days, generatedAt: new Date() }));
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error analyzing system stability trends:', error_3);
                res.status(500).json({ error: 'Failed to analyze system stability trends' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get a real-time system health report
 * Using neural-quantum naming convention: mcGetSystemHealthReport
 */
router.get('/system-health', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var summary, latestMetrics, warnings, critical, status_1, statusMessage, healthReport, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                summary = metaCognitiveEngine.getCognitiveStateSummary();
                return [4 /*yield*/, storage.getLatestQRNMetrics()];
            case 1:
                latestMetrics = _a.sent();
                warnings = metaCognitiveEngine.getInsights({
                    severity: InsightSeverity.WARNING,
                    minImpact: 5
                }).slice(0, 5);
                critical = metaCognitiveEngine.getInsights({
                    severity: InsightSeverity.CRITICAL
                });
                status_1 = 'healthy';
                if (critical.length > 0) {
                    status_1 = 'critical';
                }
                else if (warnings.length > 0) {
                    status_1 = 'warning';
                }
                else if (latestMetrics && latestMetrics.stability && latestMetrics.stability < 0.5) {
                    status_1 = 'unstable';
                }
                statusMessage = 'System is operating normally.';
                if (status_1 === 'critical') {
                    statusMessage = 'Critical issues detected. Immediate attention required.';
                }
                else if (status_1 === 'warning') {
                    statusMessage = 'Warning conditions detected. Monitoring advised.';
                }
                else if (status_1 === 'unstable') {
                    statusMessage = 'System stability is below optimal levels.';
                }
                healthReport = {
                    status: status_1,
                    statusMessage: statusMessage,
                    timestamp: new Date(),
                    metrics: latestMetrics || { stability: null, efficiency: null, coherence: null },
                    summary: {
                        patternCount: summary.patternCount,
                        insightCount: summary.insightCount,
                        warningCount: summary.warningCount,
                        criticalCount: summary.criticalCount,
                        entropy: summary.entropy
                    },
                    alerts: {
                        critical: critical,
                        warnings: warnings
                    },
                    recommendations: __spreadArray(__spreadArray([], critical.flatMap(function (c) { return c.suggestedActions || []; }), true), warnings.flatMap(function (w) { return w.suggestedActions || []; }), true).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 5) // Unique, limited to 5
                };
                res.json(healthReport);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error generating system health report:', error_4);
                res.status(500).json({ error: 'Failed to generate system health report' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Create a new meta-cognitive event
 * Using neural-quantum naming convention: mcCreateEvent
 */
router.post('/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, nodeId, type, eventType, description, details, event_1, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, id = _a.id, nodeId = _a.nodeId, type = _a.type, eventType = _a.eventType, description = _a.description, details = _a.details;
                if (!id || !nodeId || !type || !description) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Missing required fields',
                            requiredFields: ['id', 'nodeId', 'type', 'description']
                        })];
                }
                event_1 = __assign(__assign({}, req.body), { createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(), timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date() });
                // Save to storage first
                return [4 /*yield*/, storage.createMetaCognitiveEvent(event_1)];
            case 1:
                // Save to storage first
                _b.sent();
                return [4 /*yield*/, metaCognitiveEngine.processEvent(event_1)];
            case 2:
                result = _b.sent();
                // Return success response with processing result
                res.status(201).json({
                    id: event_1.id,
                    processed: true,
                    timestamp: new Date(),
                    result: result
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('Error creating meta-cognitive event:', error_5);
                res.status(500).json({
                    error: 'Failed to create meta-cognitive event',
                    message: error_5 instanceof Error ? error_5.message : String(error_5)
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Get all meta-cognitive events
 * Using neural-quantum naming convention: mcGetAllEvents
 */
router.get('/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, nodeId, eventType, events, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = req.query.limit ? parseInt(req.query.limit) : 100;
                nodeId = req.query.nodeId;
                eventType = req.query.eventType;
                return [4 /*yield*/, storage.getAllMetaCognitiveEvents(limit, {
                        nodeId: nodeId,
                        eventType: eventType
                    })];
            case 1:
                events = _a.sent();
                res.json(events);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching meta-cognitive events:', error_6);
                res.status(500).json({ error: 'Failed to fetch meta-cognitive events' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get a specific meta-cognitive event by ID
 * Using neural-quantum naming convention: mcGetEventById
 */
router.get('/events/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, event_2, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, storage.getMetaCognitiveEvent(id)];
            case 1:
                event_2 = _a.sent();
                if (!event_2) {
                    return [2 /*return*/, res.status(404).json({ error: 'Meta-cognitive event not found' })];
                }
                res.json(event_2);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error("Error fetching meta-cognitive event ".concat(req.params.id, ":"), error_7);
                res.status(500).json({ error: 'Failed to fetch meta-cognitive event' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
export default router;
