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
/**
 * Persistent Context Service Interface
 *
 * Defines the contract for context persistence following Void-Centered Design
 * principles by explicitly acknowledging the boundary between in-memory
 * operations and persisted data.
 *
 * BOUNDARY DEFINITION: This service defines the critical boundary between
 * the ephemeral in-memory context and the persistent storage layer, ensuring
 * data integrity and consistency across this boundary.
 *
 * RESPONSIBILITY: This service has the sole responsibility of managing the
 * persistence of context data, including versioning, history tracking, and
 * the transformation between runtime and persisted formats.
 */
import { ChronosDateHandler } from '../utils/chronos-date-handler.js';
/**
 * Implementation of the persistent context service
 */
var PersistentContextService = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param persistenceLayer The persistence layer to use
     */
    function PersistentContextService(persistenceLayer) {
        this.persistenceLayer = persistenceLayer;
        console.log('PersistentContextService initialized');
    }
    /**
     * Initialize a new session
     *
     * @param sessionId The session ID
     * @returns The initialized context
     */
    PersistentContextService.prototype.initializeSession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Creating new context for session: ".concat(sessionId));
                        context = {
                            sessionId: sessionId,
                            history: [],
                            metaInsights: [],
                            strategicPlans: [],
                            relationships: [],
                            version: 1,
                            lastUpdated: ChronosDateHandler.createDate()
                        };
                        return [4 /*yield*/, this.saveContext(context)];
                    case 1:
                        _a.sent();
                        console.log("Session initialized: ".concat(sessionId));
                        return [2 /*return*/, context];
                }
            });
        });
    };
    /**
     * Save a context
     *
     * @param context The context to save
     */
    PersistentContextService.prototype.saveContext = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Update the version and timestamp
                        context.version += 1;
                        context.lastUpdated = ChronosDateHandler.createDate();
                        // Store the context
                        return [4 /*yield*/, this.persistenceLayer.save("context:".concat(context.sessionId), context)];
                    case 1:
                        // Store the context
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load a context
     *
     * @param sessionId The session ID
     * @returns The loaded context, or null if not found
     */
    PersistentContextService.prototype.loadContext = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.persistenceLayer.load("context:".concat(sessionId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Add a history chunk to a context
     *
     * @param sessionId The session ID
     * @param chunk The chunk to add
     */
    PersistentContextService.prototype.addHistoryChunk = function (sessionId, chunk) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        // Add the chunk to the history
                        context.history.push(__assign(__assign({}, chunk), { timestamp: chunk.timestamp || ChronosDateHandler.createDate() }));
                        // Save the updated context
                        return [4 /*yield*/, this.saveContext(context)];
                    case 2:
                        // Save the updated context
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add a meta insight to a context
     *
     * @param sessionId The session ID
     * @param insight The insight to add
     */
    PersistentContextService.prototype.addMetaInsight = function (sessionId, insight) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        // Add the insight to the meta insights
                        context.metaInsights.push(__assign(__assign({}, insight), { timestamp: insight.timestamp || ChronosDateHandler.createDate() }));
                        // Save the updated context
                        return [4 /*yield*/, this.saveContext(context)];
                    case 2:
                        // Save the updated context
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add a strategic plan to a context
     *
     * @param sessionId The session ID
     * @param plan The plan to add
     */
    PersistentContextService.prototype.addStrategicPlan = function (sessionId, plan) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        // Add the plan to the strategic plans
                        context.strategicPlans.push(__assign(__assign({}, plan), { timestamp: plan.timestamp || ChronosDateHandler.createDate(), status: plan.status || 'active' }));
                        // Save the updated context
                        return [4 /*yield*/, this.saveContext(context)];
                    case 2:
                        // Save the updated context
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a strategic plan in a context
     *
     * @param sessionId The session ID
     * @param updatedPlan The updated plan
     */
    PersistentContextService.prototype.updateStrategicPlan = function (sessionId, updatedPlan) {
        return __awaiter(this, void 0, void 0, function () {
            var context, planIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        planIndex = context.strategicPlans.findIndex(function (p) { return p.id === updatedPlan.id; });
                        if (planIndex === -1) {
                            throw new Error("Strategic plan not found with ID: ".concat(updatedPlan.id));
                        }
                        // Update the plan
                        context.strategicPlans[planIndex] = __assign(__assign(__assign({}, context.strategicPlans[planIndex]), updatedPlan), { updatedAt: ChronosDateHandler.createDate() });
                        // Save the updated context
                        return [4 /*yield*/, this.saveContext(context)];
                    case 2:
                        // Save the updated context
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add a relationship to a context
     *
     * @param sessionId The session ID
     * @param relationship The relationship to add
     */
    PersistentContextService.prototype.addRelationship = function (sessionId, relationship) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        // Add the relationship to the relationships
                        context.relationships.push(__assign(__assign({}, relationship), { timestamp: relationship.timestamp || ChronosDateHandler.createDate() }));
                        // Save the updated context
                        return [4 /*yield*/, this.saveContext(context)];
                    case 2:
                        // Save the updated context
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get recent history from a context
     *
     * @param sessionId The session ID
     * @param layer The layer to filter by
     * @param limit The maximum number of history items to get
     * @returns The recent history
     */
    PersistentContextService.prototype.getRecentHistory = function (sessionId, layer, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var context, filtered;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        filtered = context.history.filter(function (h) { return h.layer === layer; });
                        return [2 /*return*/, filtered.slice(-limit)];
                }
            });
        });
    };
    /**
     * Get active strategic plans from a context
     *
     * @param sessionId The session ID
     * @returns The active strategic plans
     */
    PersistentContextService.prototype.getActiveStrategicPlans = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        // Return active plans
                        return [2 /*return*/, context.strategicPlans.filter(function (p) { return p.status === 'active'; })];
                }
            });
        });
    };
    /**
     * Get insights by type from a context
     *
     * @param sessionId The session ID
     * @param eventType The event type to filter by
     * @param minImportance The minimum importance to filter by
     * @returns The matching insights
     */
    PersistentContextService.prototype.getInsightsByType = function (sessionId, eventType, minImportance) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        // Filter insights by type and importance
                        return [2 /*return*/, context.metaInsights.filter(function (i) {
                                return i.type === eventType &&
                                    (i.importance || 0) >= minImportance;
                            })];
                }
            });
        });
    };
    /**
     * Search a context for items matching a query
     *
     * @param sessionId The session ID
     * @param query The search query
     * @returns The matching items
     */
    PersistentContextService.prototype.searchContext = function (sessionId, query) {
        return __awaiter(this, void 0, void 0, function () {
            var context, results, lowerQuery, _i, _a, item, _b, _c, item, _d, _e, item;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _f.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        results = [];
                        lowerQuery = query.toLowerCase();
                        // Search history
                        for (_i = 0, _a = context.history; _i < _a.length; _i++) {
                            item = _a[_i];
                            if (JSON.stringify(item).toLowerCase().includes(lowerQuery)) {
                                results.push({ type: 'history', item: item });
                            }
                        }
                        // Search meta insights
                        for (_b = 0, _c = context.metaInsights; _b < _c.length; _b++) {
                            item = _c[_b];
                            if (JSON.stringify(item).toLowerCase().includes(lowerQuery)) {
                                results.push({ type: 'insight', item: item });
                            }
                        }
                        // Search strategic plans
                        for (_d = 0, _e = context.strategicPlans; _d < _e.length; _d++) {
                            item = _e[_d];
                            if (JSON.stringify(item).toLowerCase().includes(lowerQuery)) {
                                results.push({ type: 'plan', item: item });
                            }
                        }
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return PersistentContextService;
}());
export { PersistentContextService };
