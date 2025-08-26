"use strict";
/**
 * Chronos-aware Quantum Root Node Service
 *
 * This service integrates the ChronosHandler and FeatureToggleService
 * with the Quantum Root Node service to provide time-enhanced QRN operations.
 * It ensures consistent time handling across all QRN operations.
 *
 * BOUNDARY CONSCIOUSNESS: This module explicitly handles the boundary
 * between QRN operations and temporal persistence.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChronosQRNService = void 0;
var chronos_handler_js_1 = require("../utils/chronos-handler.js");
var feature_toggle_service_js_1 = require("../feature-toggle-service.js");
var chronos_temporal_instance_js_1 = require("../temporal/chronos-temporal-instance.js");
var uuid_1 = require("uuid");
var ChronosQRNService = /** @class */ (function () {
    /**
     * Constructor
     * @param storage File system storage instance
     */
    function ChronosQRNService(storage) {
        this.storage = storage;
        this.featureToggle = feature_toggle_service_js_1.FeatureToggleService.getInstance();
        this.temporalService = new chronos_temporal_instance_js_1.ChronosTemporalInstanceService(storage);
        console.log('ChronosQRNService initialized with static ChronosHandler');
    }
    /**
     * Create a new quantum root node with Chronos-enhanced time handling
     *
     * @param node Quantum root node data to save
     * @param context Optional context for feature toggles
     * @returns Promise that resolves with the created QuantumRootNode
     */
    ChronosQRNService.prototype.createQuantumRootNode = function (node, context) {
        return __awaiter(this, void 0, void 0, function () {
            var nodeId, now, fullNode, createdNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.featureToggle.isEnabled(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER, context)) return [3 /*break*/, 4];
                        console.log('Using Chronos handler for QRN creation');
                        nodeId = node.id || (0, uuid_1.v4)();
                        now = chronos_handler_js_1.ChronosHandler.now();
                        fullNode = __assign(__assign({}, node), { id: nodeId, createdAt: now, updatedAt: now, state: node.state || {}, capabilities: node.capabilities || [], connections: node.connections || {}, lastActivity: node.lastActivity || now, coherenceScore: node.coherenceScore || 0.5 });
                        return [4 /*yield*/, this.storage.createQuantumRootNode(fullNode)];
                    case 1:
                        createdNode = _a.sent();
                        if (!createdNode) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createTemporalInstance({
                                nodeId: createdNode.id,
                                state: JSON.stringify(createdNode.state),
                                dimensionType: 'PRIMARY',
                                stabilityFactor: 1.0,
                                metadata: {
                                    event: 'creation',
                                    capabilities: createdNode.capabilities
                                }
                            }, context)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, createdNode];
                    case 4:
                        // Fall back to standard implementation if feature is disabled
                        console.log('Using standard implementation for QRN creation');
                        return [4 /*yield*/, this.storage.createQuantumRootNode(node)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Update a quantum root node with Chronos-enhanced time handling
     *
     * @param id ID of the quantum root node to update
     * @param nodeUpdate Partial node data to update
     * @param context Optional context for feature toggles
     * @returns Promise that resolves with the updated QuantumRootNode or undefined if not found
     */
    ChronosQRNService.prototype.updateQuantumRootNode = function (id, nodeUpdate, context) {
        return __awaiter(this, void 0, void 0, function () {
            var now, enhancedUpdate, updatedNode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.featureToggle.isEnabled(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER, context)) return [3 /*break*/, 4];
                        console.log('Using Chronos handler for QRN update');
                        now = chronos_handler_js_1.ChronosHandler.now();
                        enhancedUpdate = __assign(__assign({}, nodeUpdate), { updatedAt: now, lastActivity: now });
                        return [4 /*yield*/, this.storage.updateQuantumRootNode(id, enhancedUpdate)];
                    case 1:
                        updatedNode = _a.sent();
                        if (!(updatedNode && nodeUpdate.state)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createTemporalInstance({
                                nodeId: updatedNode.id,
                                state: JSON.stringify(updatedNode.state),
                                dimensionType: 'UPDATE',
                                stabilityFactor: updatedNode.coherenceScore || 0.5,
                                metadata: {
                                    event: 'update',
                                    fields: Object.keys(nodeUpdate).join(',')
                                }
                            }, context)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, updatedNode];
                    case 4:
                        // Fall back to standard implementation if feature is disabled
                        console.log('Using standard implementation for QRN update');
                        return [4 /*yield*/, this.storage.updateQuantumRootNode(id, nodeUpdate)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get a quantum root node
     *
     * @param id ID of the quantum root node to retrieve
     * @returns Promise that resolves with the QuantumRootNode or undefined if not found
     */
    ChronosQRNService.prototype.getQuantumRootNode = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.getQuantumRootNode(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Delete a quantum root node
     *
     * @param id ID of the quantum root node to delete
     * @returns Promise that resolves with true if the node was deleted, false if it wasn't found
     */
    ChronosQRNService.prototype.deleteQuantumRootNode = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.featureToggle.isEnabled(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.storage.getQuantumRootNode(id)];
                    case 1:
                        node = _a.sent();
                        if (!node) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createTemporalInstance({
                                nodeId: node.id,
                                state: JSON.stringify(node.state),
                                dimensionType: 'TERMINAL',
                                stabilityFactor: 0.0,
                                metadata: {
                                    event: 'deletion',
                                    reason: 'explicit_delete',
                                    finalCoherence: node.coherenceScore
                                }
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.storage.deleteQuantumRootNode(id)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get all quantum root nodes
     *
     * @param limit Maximum number of nodes to retrieve
     * @param filter Optional filter criteria
     * @returns Promise that resolves with an array of QuantumRootNode objects
     */
    ChronosQRNService.prototype.getAllQuantumRootNodes = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.getAllQuantumRootNodes(limit, filter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Update the state of a quantum root node with Chronos-enhanced time handling
     *
     * @param id ID of the quantum root node to update
     * @param state New state object
     * @param context Optional context for feature toggles
     * @returns Promise that resolves with the updated QuantumRootNode or undefined if not found
     */
    ChronosQRNService.prototype.updateQuantumRootNodeState = function (id, state, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateQuantumRootNode(id, { state: state }, context)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Create a temporal instance using the Chronos-enhanced temporal service
     *
     * @param instance Temporal instance data to save
     * @param context Optional context for feature toggles
     * @returns Promise that resolves with the created TemporalInstance
     */
    ChronosQRNService.prototype.createTemporalInstance = function (instance, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.temporalService.createTemporalInstance(instance, context)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get all temporal instances for a node
     *
     * @param nodeId ID of the node to get temporal instances for
     * @param limit Maximum number of instances to retrieve
     * @returns Promise that resolves with an array of TemporalInstance objects
     */
    ChronosQRNService.prototype.getNodeTemporalInstances = function (nodeId, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.temporalService.getAllTemporalInstances(limit, { nodeId: nodeId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Analyze the coherence of a quantum root node over time
     *
     * @param nodeId ID of the node to analyze
     * @param timeRange Optional time range in milliseconds (default: 24 hours)
     * @returns Promise that resolves with the coherence analysis result
     */
    ChronosQRNService.prototype.analyzeNodeCoherence = function (nodeId_1) {
        return __awaiter(this, arguments, void 0, function (nodeId, timeRange) {
            var now, startTime, instances, node, coherenceValues, sum, average, max, min, trend, first, last;
            if (timeRange === void 0) { timeRange = 24 * 60 * 60 * 1000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = chronos_handler_js_1.ChronosHandler.now();
                        startTime = new Date(now.getTime() - timeRange);
                        return [4 /*yield*/, this.temporalService.getTemporalInstancesByTimeRange(startTime, now, { nodeId: nodeId })];
                    case 1:
                        instances = _a.sent();
                        if (!(instances.length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getQuantumRootNode(nodeId)];
                    case 2:
                        node = _a.sent();
                        return [2 /*return*/, {
                                nodeId: nodeId,
                                averageCoherence: (node === null || node === void 0 ? void 0 : node.coherenceScore) || 0,
                                coherenceTrend: 'stable',
                                dataPoints: 0,
                                maxCoherence: (node === null || node === void 0 ? void 0 : node.coherenceScore) || 0,
                                minCoherence: (node === null || node === void 0 ? void 0 : node.coherenceScore) || 0
                            }];
                    case 3:
                        coherenceValues = instances.map(function (instance) {
                            try {
                                var state = JSON.parse(instance.state);
                                return state.coherence || 0;
                            }
                            catch (error) {
                                return 0;
                            }
                        }).filter(function (c) { return typeof c === 'number'; });
                        sum = coherenceValues.reduce(function (acc, val) { return acc + val; }, 0);
                        average = sum / coherenceValues.length;
                        max = Math.max.apply(Math, coherenceValues);
                        min = Math.min.apply(Math, coherenceValues);
                        trend = 'stable';
                        if (coherenceValues.length > 1) {
                            first = coherenceValues[0];
                            last = coherenceValues[coherenceValues.length - 1];
                            if (last > first + 0.1) {
                                trend = 'increasing';
                            }
                            else if (last < first - 0.1) {
                                trend = 'decreasing';
                            }
                        }
                        return [2 /*return*/, {
                                nodeId: nodeId,
                                averageCoherence: average,
                                coherenceTrend: trend,
                                dataPoints: coherenceValues.length,
                                maxCoherence: max,
                                minCoherence: min
                            }];
                }
            });
        });
    };
    return ChronosQRNService;
}());
exports.ChronosQRNService = ChronosQRNService;
