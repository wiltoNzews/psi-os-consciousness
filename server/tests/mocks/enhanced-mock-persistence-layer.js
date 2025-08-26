/**
 * Enhanced Mock Persistence Layer (TypeScript Version)
 *
 * A robust in-memory persistence layer implementation with proper date handling
 * and circular reference detection, following the Explicit-Implicit Quantum Balance principle.
 *
 * 🔗 EXPLICIT PATIENT REPETITION: This persistence layer appropriately handles:
 * - Date serialization and deserialization
 * - Circular reference detection
 * - Standard IPersistenceLayer interface compliance
 *
 * BOUNDARY AWARENESS: This implementation explicitly defines the boundary
 * between in-memory data structures and their persistent form.
 *
 * [QUANTUM_STATE: SIM_FLOW]
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
// Import DateTransformer from JavaScript file using ES module syntax
import { DateTransformer } from '../../utils/DateTransformer.js';
/**
 * Enhanced Mock Persistence Layer with proper date handling and circular reference detection
 *
 * @implements {IPersistenceLayer}
 */
var EnhancedMockPersistenceLayer = /** @class */ (function () {
    /**
     * Create a new instance of the enhanced mock persistence layer
     */
    function EnhancedMockPersistenceLayer() {
        this.store = new Map();
        console.log('[EnhancedMockPersistenceLayer] Initialized');
    }
    /**
     * Save a value with the specified key
     *
     * @param {string} key - The unique identifier
     * @param {any} value - The value to save
     * @returns {Promise<void>}
     */
    EnhancedMockPersistenceLayer.prototype.save = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, seen_1, processedValue, serialized, endTime;
            return __generator(this, function (_a) {
                try {
                    startTime = Date.now();
                    seen_1 = new WeakSet();
                    processedValue = DateTransformer.transformDates(value, 'serialize');
                    serialized = JSON.stringify(processedValue, function (key, val) {
                        if (typeof val === 'object' && val !== null) {
                            if (seen_1.has(val)) {
                                return '[Circular Reference]';
                            }
                            seen_1.add(val);
                        }
                        return val;
                    });
                    // Store the serialized value
                    this.store.set(key, serialized);
                    endTime = Date.now();
                    console.log("[EnhancedMockPersistenceLayer] Saved key \"".concat(key, "\" in ").concat(endTime - startTime, "ms"));
                }
                catch (error) {
                    console.error("[EnhancedMockPersistenceLayer] Error saving data with key ".concat(key, ":"), error);
                    throw new Error("Failed to save data with key: ".concat(key));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Load a value by key
     *
     * @param {string} key - The unique identifier
     * @returns {Promise<any|null>} - The stored value or null if not found
     */
    EnhancedMockPersistenceLayer.prototype.load = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, serialized, parsed, result, endTime;
            return __generator(this, function (_a) {
                try {
                    startTime = Date.now();
                    serialized = this.store.get(key);
                    // Return null if not found
                    if (serialized === undefined) {
                        return [2 /*return*/, null];
                    }
                    parsed = JSON.parse(serialized);
                    result = DateTransformer.transformDates(parsed, 'deserialize');
                    endTime = Date.now();
                    console.log("[EnhancedMockPersistenceLayer] Loaded key \"".concat(key, "\" in ").concat(endTime - startTime, "ms"));
                    return [2 /*return*/, result];
                }
                catch (error) {
                    console.error("[EnhancedMockPersistenceLayer] Error loading data with key ".concat(key, ":"), error);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Alias for load
     *
     * @param {string} key - The unique identifier
     * @returns {Promise<any|null>} - The stored value or null if not found
     */
    EnhancedMockPersistenceLayer.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(key)];
            });
        });
    };
    /**
     * Get all keys, optionally filtered by prefix
     *
     * @param {string} [prefix] - Optional key prefix to filter by
     * @returns {Promise<string[]>} - Array of keys
     */
    EnhancedMockPersistenceLayer.prototype.getKeys = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            return __generator(this, function (_a) {
                try {
                    keys = Array.from(this.store.keys());
                    // Filter by prefix if provided
                    if (prefix) {
                        return [2 /*return*/, keys.filter(function (key) { return key.startsWith(prefix); })];
                    }
                    return [2 /*return*/, keys];
                }
                catch (error) {
                    console.error('[EnhancedMockPersistenceLayer] Error getting keys:', error);
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Delete a value by key
     *
     * @param {string} key - The unique identifier
     * @returns {Promise<boolean>} - True if the value was deleted, false if not found
     */
    EnhancedMockPersistenceLayer.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                try {
                    // Check if the key exists
                    if (!this.store.has(key)) {
                        return [2 /*return*/, false];
                    }
                    result = this.store.delete(key);
                    console.log("[EnhancedMockPersistenceLayer] Deleted key \"".concat(key, "\": ").concat(result));
                    return [2 /*return*/, result];
                }
                catch (error) {
                    console.error("[EnhancedMockPersistenceLayer] Error deleting key ".concat(key, ":"), error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Clear all stored values
     *
     * @returns {Promise<void>}
     */
    EnhancedMockPersistenceLayer.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.store.clear();
                    console.log('[EnhancedMockPersistenceLayer] Cleared all data');
                }
                catch (error) {
                    console.error('[EnhancedMockPersistenceLayer] Error clearing data:', error);
                    throw new Error('Failed to clear data');
                }
                return [2 /*return*/];
            });
        });
    };
    return EnhancedMockPersistenceLayer;
}());
export { EnhancedMockPersistenceLayer };
