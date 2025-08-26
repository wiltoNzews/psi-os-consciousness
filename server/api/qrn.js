/**
 * Quantum Root Node API
 *
 * This API provides endpoints for interacting with the QRN service,
 * allowing for management of Quantum Root Nodes, Neural Pathways,
 * Temporal Instances, and Meta-Cognitive Events.
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
import { Router } from 'express';
import { qrnService } from '../services/qrn/quantum-root-node-service.js';
import { z } from 'zod';
export var router = Router();
// Schema for node creation
var createNodeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.string().optional(),
    userId: z.number().optional(),
    initialCapabilities: z.array(z.string()).optional(),
    initialParameters: z.record(z.any()).optional()
});
// Schema for node update
var updateNodeSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    capabilities: z.array(z.string()).optional(),
    energyLevel: z.number().optional(),
    version: z.string().optional(),
    metaParameters: z.record(z.any()).optional(),
    securityContext: z.record(z.any()).optional(),
    reflectiveState: z.record(z.any()).optional(),
    cognitiveArchitecture: z.record(z.any()).optional()
});
// Schema for neural pathway creation
var createPathwaySchema = z.object({
    sourceName: z.string().optional(),
    sourceId: z.string().uuid("Source ID must be a valid UUID"),
    targetId: z.string().uuid("Target ID must be a valid UUID"),
    targetName: z.string().optional(),
    pathType: z.string().optional(),
    strength: z.number().min(0).max(1).optional(),
    latency: z.number().min(0).optional(),
    bandwidth: z.number().min(0).optional(),
    metadata: z.record(z.any()).optional()
});
// Schema for temporal instance creation
var createTemporalInstanceSchema = z.object({
    nodeId: z.string().uuid("Node ID must be a valid UUID"),
    state: z.record(z.any()),
    dimensionType: z.string().optional(),
    parentId: z.string().uuid("Parent ID must be a valid UUID").optional(),
    stabilityFactor: z.number().min(0).max(1).optional(),
    metadata: z.record(z.any()).optional()
});
// Schema for meta-cognitive event creation
var createMetaCognitiveEventSchema = z.object({
    nodeId: z.string().uuid("Node ID must be a valid UUID"),
    type: z.string(),
    description: z.string(),
    details: z.record(z.any()).optional(),
    confidence: z.number().min(0).max(1).optional(),
    impact: z.number().min(1).max(10).optional(),
    relatedEvents: z.array(z.string()).optional(),
    outcome: z.record(z.any()).optional(),
    sourceContext: z.record(z.any()).optional()
});
// Schema for transmission recording
var recordTransmissionSchema = z.object({
    data: z.any().optional()
});
// Quantum Root Node endpoints
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, userId, type, status_1, nodes, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                userId = req.query.userId ? parseInt(req.query.userId) : undefined;
                type = req.query.type;
                status_1 = req.query.status;
                return [4 /*yield*/, qrnService.getAllNodes({
                        limit: limit,
                        userId: userId,
                        type: type,
                        status: status_1
                    })];
            case 1:
                nodes = _a.sent();
                res.json(nodes);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching QRNs:', error_1);
                res.status(500).json({ error: 'Failed to fetch Quantum Root Nodes' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, node, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, qrnService.getNode(id)];
            case 1:
                node = _a.sent();
                if (!node) {
                    return [2 /*return*/, res.status(404).json({ error: 'Quantum Root Node not found' })];
                }
                res.json(node);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching QRN:', error_2);
                res.status(500).json({ error: 'Failed to fetch Quantum Root Node' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationResult, node, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validationResult = createNodeSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid input',
                            details: validationResult.error.format()
                        })];
                }
                return [4 /*yield*/, qrnService.createNode(validationResult.data)];
            case 1:
                node = _a.sent();
                res.status(201).json(node);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error creating QRN:', error_3);
                res.status(500).json({ error: 'Failed to create Quantum Root Node' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.patch('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, validationResult, updatedNode, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                validationResult = updateNodeSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid input',
                            details: validationResult.error.format()
                        })];
                }
                return [4 /*yield*/, qrnService.updateNode(id, validationResult.data)];
            case 1:
                updatedNode = _a.sent();
                if (!updatedNode) {
                    return [2 /*return*/, res.status(404).json({ error: 'Quantum Root Node not found' })];
                }
                res.json(updatedNode);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error updating QRN:', error_4);
                res.status(500).json({ error: 'Failed to update Quantum Root Node' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, qrnService.deleteNode(id)];
            case 1:
                result = _a.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({ error: 'Quantum Root Node not found' })];
                }
                res.status(204).end();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting QRN:', error_5);
                res.status(500).json({ error: 'Failed to delete Quantum Root Node' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.patch('/:id/state', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, state, updatedNode, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                state = req.body;
                if (!state || typeof state !== 'object') {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid state object' })];
                }
                return [4 /*yield*/, qrnService.updateNodeState(id, state)];
            case 1:
                updatedNode = _a.sent();
                if (!updatedNode) {
                    return [2 /*return*/, res.status(404).json({ error: 'Quantum Root Node not found' })];
                }
                res.json(updatedNode);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error updating QRN state:', error_6);
                res.status(500).json({ error: 'Failed to update Quantum Root Node state' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Neural Pathway endpoints
router.get('/:id/pathways', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, limit, pathType, pathways, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                pathType = req.query.pathType;
                return [4 /*yield*/, qrnService.getAllPathways({
                        limit: limit,
                        sourceId: id,
                        pathType: pathType
                    })];
            case 1:
                pathways = _a.sent();
                res.json(pathways);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching pathways:', error_7);
                res.status(500).json({ error: 'Failed to fetch Neural Pathways' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/pathways', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationResult, pathway, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validationResult = createPathwaySchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid input',
                            details: validationResult.error.format()
                        })];
                }
                return [4 /*yield*/, qrnService.createPathway(validationResult.data)];
            case 1:
                pathway = _a.sent();
                res.status(201).json(pathway);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error creating pathway:', error_8);
                res.status(500).json({ error: 'Failed to create Neural Pathway' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/pathways/:id/transmit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, validationResult, updatedPathway, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                validationResult = recordTransmissionSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid input',
                            details: validationResult.error.format()
                        })];
                }
                return [4 /*yield*/, qrnService.recordTransmission(id, validationResult.data.data)];
            case 1:
                updatedPathway = _a.sent();
                if (!updatedPathway) {
                    return [2 /*return*/, res.status(404).json({ error: 'Neural Pathway not found' })];
                }
                res.json(updatedPathway);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error recording transmission:', error_9);
                res.status(500).json({ error: 'Failed to record transmission' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Temporal Instance endpoints
router.get('/:id/temporal', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, limit, instances, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                return [4 /*yield*/, qrnService.getNodeTemporalInstances(id, limit)];
            case 1:
                instances = _a.sent();
                res.json(instances);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('Error fetching temporal instances:', error_10);
                res.status(500).json({ error: 'Failed to fetch Temporal Instances' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/temporal', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationResult, instance, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validationResult = createTemporalInstanceSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid input',
                            details: validationResult.error.format()
                        })];
                }
                return [4 /*yield*/, qrnService.createTemporalInstance(validationResult.data)];
            case 1:
                instance = _a.sent();
                res.status(201).json(instance);
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error('Error creating temporal instance:', error_11);
                res.status(500).json({ error: 'Failed to create Temporal Instance' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/temporal/:id/access', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, instance, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, qrnService.accessTemporalInstance(id)];
            case 1:
                instance = _a.sent();
                if (!instance) {
                    return [2 /*return*/, res.status(404).json({ error: 'Temporal Instance not found' })];
                }
                res.json(instance);
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                console.error('Error accessing temporal instance:', error_12);
                res.status(500).json({ error: 'Failed to access Temporal Instance' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Meta-Cognitive Event endpoints
router.get('/:id/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, limit, events, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                return [4 /*yield*/, qrnService.getNodeMetaCognitiveEvents(id, limit)];
            case 1:
                events = _a.sent();
                res.json(events);
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.error('Error fetching meta-cognitive events:', error_13);
                res.status(500).json({ error: 'Failed to fetch Meta-Cognitive Events' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationResult, event_1, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validationResult = createMetaCognitiveEventSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid input',
                            details: validationResult.error.format()
                        })];
                }
                return [4 /*yield*/, qrnService.recordMetaCognitiveEvent(validationResult.data)];
            case 1:
                event_1 = _a.sent();
                res.status(201).json(event_1);
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.error('Error creating meta-cognitive event:', error_14);
                res.status(500).json({ error: 'Failed to create Meta-Cognitive Event' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
