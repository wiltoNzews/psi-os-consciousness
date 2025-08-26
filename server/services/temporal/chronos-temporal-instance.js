"use strict";
/**
 * Chronos-aware Temporal Instance Utility
 *
 * This utility integrates the ChronosHandler and FeatureToggleService
 * to provide time-enhanced temporal instance operations. It ensures
 * consistent time handling across all temporal instance operations.
 *
 * BOUNDARY CONSCIOUSNESS: This module explicitly handles the boundary
 * between temporal data representation and storage by ensuring consistent
 * time handling across the boundary.
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
exports.ChronosTemporalInstanceService = void 0;
var chronos_handler_js_1 = require("../utils/chronos-handler.js");
var feature_toggle_service_js_1 = require("../feature-toggle-service.js");
var uuid_1 = require("uuid");
var ChronosTemporalInstanceService = /** @class */ (function () {
    /**
     * Constructor
     * @param storage File system storage instance
     */
    function ChronosTemporalInstanceService(storage) {
        this.storage = storage;
        this.featureToggle = feature_toggle_service_js_1.FeatureToggleService.getInstance();
        console.log('ChronosTemporalInstanceService initialized with static ChronosHandler');
    }
    /**
     * Create a new temporal instance with Chronos-enhanced time handling
     *
     * @param instance Temporal instance data to save
     * @param context Optional context for feature toggles
     * @returns Promise that resolves with the created TemporalInstance
     */
    ChronosTemporalInstanceService.prototype.createTemporalInstance = function (instance, context) {
        return __awaiter(this, void 0, void 0, function () {
            var instanceId, now, fullInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.featureToggle.isEnabled(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER, context)) return [3 /*break*/, 2];
                        console.log('Using Chronos handler for temporal instance creation');
                        instanceId = instance.id || (0, uuid_1.v4)();
                        now = chronos_handler_js_1.ChronosHandler.now();
                        fullInstance = __assign(__assign({}, instance), { id: instanceId, timestamp: instance.timestamp || now, createdAt: now, updatedAt: now });
                        return [4 /*yield*/, this.storage.createTemporalInstance(fullInstance)];
                    case 1: 
                    // Return the result of the storage creation
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        // Fall back to standard implementation if feature is disabled
                        console.log('Using standard implementation for temporal instance creation');
                        return [4 /*yield*/, this.storage.createTemporalInstance(instance)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Update a temporal instance with Chronos-enhanced time handling
     *
     * @param id ID of the temporal instance to update
     * @param instanceUpdate Partial instance data to update
     * @param context Optional context for feature toggles
     * @returns Promise that resolves with the updated TemporalInstance or undefined if not found
     */
    ChronosTemporalInstanceService.prototype.updateTemporalInstance = function (id, instanceUpdate, context) {
        return __awaiter(this, void 0, void 0, function () {
            var enhancedUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.featureToggle.isEnabled(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER, context)) return [3 /*break*/, 2];
                        console.log('Using Chronos handler for temporal instance update');
                        enhancedUpdate = __assign(__assign({}, instanceUpdate), { updatedAt: chronos_handler_js_1.ChronosHandler.now() });
                        return [4 /*yield*/, this.storage.updateTemporalInstance(id, enhancedUpdate)];
                    case 1: 
                    // Return the result of the storage update
                    return [2 /*return*/, _a.sent()];
                    case 2:
                        // Fall back to standard implementation if feature is disabled
                        console.log('Using standard implementation for temporal instance update');
                        return [4 /*yield*/, this.storage.updateTemporalInstance(id, instanceUpdate)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get a temporal instance
     *
     * @param id ID of the temporal instance to retrieve
     * @returns Promise that resolves with the TemporalInstance or undefined if not found
     */
    ChronosTemporalInstanceService.prototype.getTemporalInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.getTemporalInstance(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Delete a temporal instance
     *
     * @param id ID of the temporal instance to delete
     * @returns Promise that resolves with true if the instance was deleted, false if it wasn't found
     */
    ChronosTemporalInstanceService.prototype.deleteTemporalInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.deleteTemporalInstance(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get all temporal instances
     *
     * @param limit Maximum number of instances to retrieve
     * @param filter Optional filter criteria
     * @returns Promise that resolves with an array of TemporalInstance objects
     */
    ChronosTemporalInstanceService.prototype.getAllTemporalInstances = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.getAllTemporalInstances(limit, filter)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get all temporal instances within a time range
     *
     * @param startTime Start of time range
     * @param endTime End of time range
     * @param filter Optional filter criteria
     * @returns Promise that resolves with an array of TemporalInstance objects
     */
    ChronosTemporalInstanceService.prototype.getTemporalInstancesByTimeRange = function (startTime, endTime, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var allInstances;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.getAllTemporalInstances(undefined, filter)];
                    case 1:
                        allInstances = _a.sent();
                        // Filter by time range
                        return [2 /*return*/, allInstances.filter(function (instance) {
                                var timestamp = instance.timestamp;
                                return timestamp >= startTime && timestamp <= endTime;
                            })];
                }
            });
        });
    };
    return ChronosTemporalInstanceService;
}());
exports.ChronosTemporalInstanceService = ChronosTemporalInstanceService;
