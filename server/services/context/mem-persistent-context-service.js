/**
 * In-Memory Persistent Context Service Implementation
 *
 * This implements IPersistentContextService using in-memory storage, ensuring
 * proper date handling with ChronosDateHandler. This implementation ensures
 * boundary integrity between in-memory operation and serialized form.
 *
 * BOUNDARY AWARENESS: This module explicitly manages the boundary between
 * volatile memory state and persistent storage following Void-Centered Design
 * principles. It defines clear serialization/deserialization processes for
 * crossing system boundaries.
 *
 * BOUNDARY MANAGEMENT: All date objects crossing system boundaries are properly
 * handled through ChronosDateHandler to maintain temporal consistency across
 * the system.
 *
 * RESPONSIBILITY: This module is solely responsible for providing an in-memory
 * implementation of the PersistentContextService interface, managing context
 * storage, retrieval, and modification operations.
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
import { ChronosDateHandler } from '../utils/chronos-date-handler.js';
/**
 * In-memory persistence layer
 *
 * BOUNDARY AWARENESS: This class handles the boundary between in-memory objects
 * and their serialized string representation. It ensures proper serialization
 * and deserialization of objects with dates.
 */
var MemPersistenceLayer = /** @class */ (function () {
    function MemPersistenceLayer() {
        this.dateHandler = ChronosDateHandler;
        this.storage = new Map();
    }
    /**
     * Save data to in-memory storage
     *
     * @param key Storage key
     * @param data Data to store
     */
    MemPersistenceLayer.prototype.save = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            var serialized;
            return __generator(this, function (_a) {
                serialized = this.dateHandler.stringifyWithDates(data);
                this.storage.set(key, serialized);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Load data from in-memory storage
     *
     * @param key Storage key
     * @returns The loaded data, or null if not found
     */
    MemPersistenceLayer.prototype.load = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var serialized;
            return __generator(this, function (_a) {
                serialized = this.storage.get(key);
                if (!serialized) {
                    return [2 /*return*/, null];
                }
                // Use ChronosDateHandler to properly deserialize dates
                return [2 /*return*/, this.dateHandler.parseWithDates(serialized)];
            });
        });
    };
    /**
     * Delete data from in-memory storage
     *
     * @param key Storage key
     * @returns True if data was deleted, false if not found
     */
    MemPersistenceLayer.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.storage.has(key)) {
                    return [2 /*return*/, false];
                }
                this.storage.delete(key);
                return [2 /*return*/, true];
            });
        });
    };
    return MemPersistenceLayer;
}());
/**
 * In-memory implementation of persistent context service
 *
 * BOUNDARY AWARENESS: This class implements the PersistentContextService interface
 * and serves as a boundary between the system's context operations and their
 * in-memory persistence. It explicitly manages temporal boundaries with the
 * ChronosDateHandler.
 *
 * BOUNDARY MANAGEMENT: All context data crossing system boundaries is properly
 * serialized and deserialized using the persistence layer, with dates being
 * handled correctly through the ChronosDateHandler.
 */
var MemPersistentContextService = /** @class */ (function () {
    /**
     * Constructor
     */
    function MemPersistentContextService() {
        this.dateHandler = ChronosDateHandler;
        this.persistenceLayer = new MemPersistenceLayer();
        console.log('MemPersistentContextService initialized');
    }
    /**
     * Initialize a new session
     *
     * BOUNDARY MANAGEMENT: Creates a new context with correct date handling
     * and persists it across the system boundary using the persistence layer.
     *
     * @param sessionId The session ID
     * @returns The initialized context
     */
    MemPersistentContextService.prototype.initializeSession = function (sessionId) {
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
                            lastUpdated: this.dateHandler.createDate() // Use ChronosDateHandler for date creation
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
     * BOUNDARY MANAGEMENT: Updates temporal data using ChronosDateHandler
     * and persists the context across the system boundary through the
     * persistence layer's serialization capabilities.
     *
     * @param context The context to save
     */
    MemPersistentContextService.prototype.saveContext = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Update the version and timestamp
                        context.version += 1;
                        context.lastUpdated = this.dateHandler.createDate(); // Use ChronosDateHandler for date creation
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
     * BOUNDARY MANAGEMENT: Retrieves context data across the persistence boundary,
     * ensuring proper date handling for serialized date objects through the
     * persistence layer's deserialization mechanisms.
     *
     * @param sessionId The session ID
     * @returns The loaded context, or null if not found
     */
    MemPersistentContextService.prototype.loadContext = function (sessionId) {
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
     * BOUNDARY MANAGEMENT: Maintains temporal integrity by applying ChronosDateHandler
     * for any missing timestamps and ensuring proper serialization across
     * the persistence boundary for history data.
     *
     * @param sessionId The session ID
     * @param chunk The chunk to add
     */
    MemPersistentContextService.prototype.addHistoryChunk = function (sessionId, chunk) {
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
                        // Add the chunk to the history - use ChronosDateHandler for date creation
                        context.history.push(__assign(__assign({}, chunk), { timestamp: chunk.timestamp || this.dateHandler.createDate() }));
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
     * BOUNDARY MANAGEMENT: Enforces temporal consistency when crossing
     * the persistence boundary by ensuring proper timestamp handling with
     * ChronosDateHandler while maintaining contextual metadata integrity.
     *
     * @param sessionId The session ID
     * @param insight The insight to add
     */
    MemPersistentContextService.prototype.addMetaInsight = function (sessionId, insight) {
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
                        // Add the insight to the meta insights - use ChronosDateHandler for date creation
                        context.metaInsights.push(__assign(__assign({}, insight), { timestamp: insight.timestamp || this.dateHandler.createDate() }));
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
     * BOUNDARY MANAGEMENT: Ensures object temporal coherence across
     * the persistence boundary by handling all required date fields with
     * ChronosDateHandler and maintaining consistency when creating new plans.
     *
     * @param sessionId The session ID
     * @param plan The plan to add
     */
    MemPersistentContextService.prototype.addStrategicPlan = function (sessionId, plan) {
        return __awaiter(this, void 0, void 0, function () {
            var context, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            throw new Error("Context not found for session: ".concat(sessionId));
                        }
                        now = this.dateHandler.createDate();
                        // Add the plan to the strategic plans
                        context.strategicPlans.push(__assign(__assign({}, plan), { createdAt: plan.createdAt || now, updatedAt: plan.updatedAt || now, status: plan.status || 'pending' }));
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
     * BOUNDARY MANAGEMENT: Handles complex state transitions with boundary integrity
     * by ensuring proper temporal references (updatedAt, completedAt) are maintained
     * with consistent ChronosDateHandler usage, especially during status transitions.
     *
     * @param sessionId The session ID
     * @param updatedPlan The updated plan
     */
    MemPersistentContextService.prototype.updateStrategicPlan = function (sessionId, updatedPlan) {
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
                        // Update the plan with ChronosDateHandler for date creation
                        context.strategicPlans[planIndex] = __assign(__assign(__assign({}, context.strategicPlans[planIndex]), updatedPlan), { updatedAt: this.dateHandler.createDate() });
                        // If the plan status changed to completed or failed, set the completedAt
                        if ((updatedPlan.status === 'completed' || updatedPlan.status === 'failed') &&
                            !context.strategicPlans[planIndex].completedAt) {
                            context.strategicPlans[planIndex].completedAt = this.dateHandler.createDate();
                        }
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
     * BOUNDARY MANAGEMENT: Maintains relationship temporal coherence by ensuring
     * consistent timestamp handling with ChronosDateHandler. Timestamp is preserved
     * if present in the input relationship or created using the date handler if absent,
     * ensuring temporal consistency across the persistence boundary.
     *
     * @param sessionId The session ID
     * @param relationship The relationship to add
     */
    MemPersistentContextService.prototype.addRelationship = function (sessionId, relationship) {
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
                        context.relationships.push(__assign(__assign({}, relationship), { timestamp: relationship.timestamp || this.dateHandler.createDate() }));
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
     * BOUNDARY MANAGEMENT: Handles cross-boundary temporal ordering with
     * explicit ChronosDateHandler.deserializeDate usage for timestamp comparison.
     * Ensures consistent date handling across the persistence boundary during
     * both storage and retrieval, maintaining temporal coherence.
     *
     * @param sessionId The session ID
     * @param layer The layer to filter by
     * @param limit The maximum number of history items to get
     * @returns The recent history
     */
    MemPersistentContextService.prototype.getRecentHistory = function (sessionId, layer, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var context, filtered, sorted;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            // Return empty array instead of throwing for graceful degradation
                            return [2 /*return*/, []];
                        }
                        filtered = context.history.filter(function (h) { return h.layer === layer; });
                        sorted = filtered.sort(function (a, b) {
                            return _this.dateHandler.deserializeDate(b.timestamp).getTime() -
                                _this.dateHandler.deserializeDate(a.timestamp).getTime();
                        });
                        // Return the most recent items
                        return [2 /*return*/, sorted.slice(0, limit)];
                }
            });
        });
    };
    /**
     * Get active strategic plans from a context
     *
     * BOUNDARY MANAGEMENT: Provides critical status-based filtering at the
     * persistence boundary, ensuring only active plans (pending or in_progress)
     * cross the boundary. Handles graceful degradation for non-existent contexts
     * to maintain system resilience and boundary integrity.
     *
     * @param sessionId The session ID
     * @returns The active strategic plans
     */
    MemPersistentContextService.prototype.getActiveStrategicPlans = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            // Return empty array instead of throwing for graceful degradation
                            return [2 /*return*/, []];
                        }
                        // Return plans that are not completed or failed
                        return [2 /*return*/, context.strategicPlans.filter(function (p) {
                                return p.status === 'pending' || p.status === 'in_progress';
                            })];
                }
            });
        });
    };
    /**
     * Get insights by type from a context
     *
     * BOUNDARY MANAGEMENT: Implements dual-parameter boundary filtering
     * to ensure only insights meeting both type and importance thresholds
     * cross the persistence boundary. Maintains system degradation resilience
     * at the boundary through empty array fallback when context is not found.
     *
     * @param sessionId The session ID
     * @param eventType The event type to filter by
     * @param minImportance The minimum importance to filter by
     * @returns The matching insights
     */
    MemPersistentContextService.prototype.getInsightsByType = function (sessionId, eventType, minImportance) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            // Return empty array instead of throwing for graceful degradation
                            return [2 /*return*/, []];
                        }
                        // Filter insights by category (which is the type) and importance
                        return [2 /*return*/, context.metaInsights.filter(function (i) {
                                return i.category === eventType &&
                                    (i.importance || 0) >= minImportance;
                            })];
                }
            });
        });
    };
    /**
     * Search a context for items matching a query
     *
     * BOUNDARY MANAGEMENT: Provides cross-boundary search capabilities
     * with unified query processing across different data types (history,
     * insights, plans). Implements an abstraction layer that hides the
     * complexity of the underlying data structures, allowing consistent
     * queries across the persistence boundary while maintaining
     * graceful degradation for non-existent contexts.
     *
     * @param sessionId The session ID
     * @param query The search query
     * @returns The matching items
     */
    MemPersistentContextService.prototype.searchContext = function (sessionId, query) {
        return __awaiter(this, void 0, void 0, function () {
            var context, results, lowerQuery, containsQuery, _i, _a, item, _b, _c, item, _d, _e, item;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.loadContext(sessionId)];
                    case 1:
                        context = _f.sent();
                        if (!context) {
                            // Return empty array instead of throwing for graceful degradation
                            return [2 /*return*/, []];
                        }
                        results = [];
                        lowerQuery = query.toLowerCase();
                        containsQuery = function (obj) {
                            // Convert to string and check
                            var str = JSON.stringify(obj).toLowerCase();
                            return str.includes(lowerQuery);
                        };
                        // Search history items
                        for (_i = 0, _a = context.history; _i < _a.length; _i++) {
                            item = _a[_i];
                            if (containsQuery(item)) {
                                results.push(item);
                            }
                        }
                        // Search meta insights
                        for (_b = 0, _c = context.metaInsights; _b < _c.length; _b++) {
                            item = _c[_b];
                            if (containsQuery(item)) {
                                results.push(item);
                            }
                        }
                        // Search strategic plans
                        for (_d = 0, _e = context.strategicPlans; _d < _e.length; _d++) {
                            item = _e[_d];
                            if (containsQuery(item)) {
                                results.push(item);
                            }
                        }
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return MemPersistentContextService;
}());
export { MemPersistentContextService };
export default MemPersistentContextService;
