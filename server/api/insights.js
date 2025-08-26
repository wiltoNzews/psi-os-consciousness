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
import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { summarizeInsights } from '../services/openai-analyzer';
// Create router
var router = Router();
// Get all insights with optional filtering
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, filter, insights, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                filter = {};
                if (req.query.datasetId) {
                    filter.datasetId = parseInt(req.query.datasetId);
                }
                if (req.query.analysisId) {
                    filter.analysisId = parseInt(req.query.analysisId);
                }
                return [4 /*yield*/, storage.getAllInsights(limit, filter)];
            case 1:
                insights = _a.sent();
                res.json(insights);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching insights:', error_1);
                res.status(500).json({ error: 'Failed to fetch insights' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get a specific insight by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, insight, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getInsight(id)];
            case 1:
                insight = _a.sent();
                if (!insight) {
                    return [2 /*return*/, res.status(404).json({ error: 'Insight not found' })];
                }
                res.json(insight);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching insight:', error_2);
                res.status(500).json({ error: 'Failed to fetch insight' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create a new insight (manual creation)
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var insertInsightSchema, validationResult, insight, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                insertInsightSchema = z.object({
                    title: z.string(),
                    // Add other required fields for insights
                    content: z.string().optional(),
                    datasetId: z.number().optional(),
                    analysisId: z.number().optional(),
                    confidence: z.number().min(0).max(1).optional(),
                    importance: z.number().min(0).max(10).optional(),
                    type: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                    isPublished: z.boolean().optional().default(false),
                    createdBy: z.number().optional(),
                    metadata: z.record(z.any()).optional()
                });
                validationResult = insertInsightSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid insight data',
                            details: validationResult.error.errors
                        })];
                }
                return [4 /*yield*/, storage.createInsight(validationResult.data)];
            case 1:
                insight = _a.sent();
                res.status(201).json(insight);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error creating insight:', error_3);
                res.status(500).json({ error: 'Failed to create insight' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update an insight
router.patch('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingInsight, insertInsightSchema, updateSchema, validationResult, updatedInsight, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getInsight(id)];
            case 1:
                existingInsight = _a.sent();
                if (!existingInsight) {
                    return [2 /*return*/, res.status(404).json({ error: 'Insight not found' })];
                }
                insertInsightSchema = z.object({
                    title: z.string(),
                    // Add other required fields for insights
                    content: z.string().optional(),
                    datasetId: z.number().optional(),
                    analysisId: z.number().optional(),
                    confidence: z.number().min(0).max(1).optional(),
                    importance: z.number().min(0).max(10).optional(),
                    type: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                    isPublished: z.boolean().optional().default(false),
                    createdBy: z.number().optional(),
                    metadata: z.record(z.any()).optional()
                });
                updateSchema = insertInsightSchema.partial();
                validationResult = updateSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid insight data',
                            details: validationResult.error.errors
                        })];
                }
                return [4 /*yield*/, storage.updateInsight(id, validationResult.data)];
            case 2:
                updatedInsight = _a.sent();
                res.json(updatedInsight);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating insight:', error_4);
                res.status(500).json({ error: 'Failed to update insight' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete an insight
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingInsight, deleted, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getInsight(id)];
            case 1:
                existingInsight = _a.sent();
                if (!existingInsight) {
                    return [2 /*return*/, res.status(404).json({ error: 'Insight not found' })];
                }
                return [4 /*yield*/, storage.deleteInsight(id)];
            case 2:
                deleted = _a.sent();
                if (deleted) {
                    res.status(204).send();
                }
                else {
                    res.status(500).json({ error: 'Failed to delete insight' });
                }
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Error deleting insight:', error_5);
                res.status(500).json({ error: 'Failed to delete insight' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Toggle publish status of an insight
router.post('/:id/publish', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingInsight, isPublished, updatedInsight, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getInsight(id)];
            case 1:
                existingInsight = _a.sent();
                if (!existingInsight) {
                    return [2 /*return*/, res.status(404).json({ error: 'Insight not found' })];
                }
                isPublished = !existingInsight.isPublished;
                return [4 /*yield*/, storage.updateInsight(id, { isPublished: isPublished })];
            case 2:
                updatedInsight = _a.sent();
                res.json(updatedInsight);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error('Error updating insight publish status:', error_6);
                res.status(500).json({ error: 'Failed to update insight publish status' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Summarize multiple insights
router.post('/summarize', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var summaryOptionsSchema, validationResult, options, summary, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                summaryOptionsSchema = z.object({
                    insightIds: z.array(z.number()).min(1),
                    audience: z.enum(['executive', 'technical', 'marketing']).optional(),
                    format: z.enum(['bullet', 'narrative', 'presentation']).optional(),
                    maxLength: z.number().positive().optional(),
                });
                validationResult = summaryOptionsSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid summary options',
                            details: validationResult.error.errors
                        })];
                }
                options = validationResult.data;
                return [4 /*yield*/, summarizeInsights(options.insightIds, {
                        audience: options.audience,
                        format: options.format,
                        maxLength: options.maxLength,
                    })];
            case 1:
                summary = _a.sent();
                res.status(200).json({ summary: summary });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error summarizing insights:', error_7);
                res.status(500).json({ error: 'Failed to summarize insights', details: error_7 instanceof Error ? error_7.message : String(error_7) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
export default router;
