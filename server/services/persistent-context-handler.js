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
import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ensureDirectoryExists } from './utils/fs-helpers.js';
import { parseJsonWithDates, safeStringify } from './utils/date-helpers.js';
/**
 * File system implementation of the persistence layer
 */
var FileSystemPersistenceLayer = /** @class */ (function () {
    /**
     * Create a new FileSystemPersistenceLayer
     * @param storageDir Directory to store files in
     */
    function FileSystemPersistenceLayer(storageDir) {
        this.storageDir = storageDir;
    }
    /**
     * Initialize the storage directory asynchronously
     */
    FileSystemPersistenceLayer.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ensureDirectoryExists(this.storageDir)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save data to a file
     * @param key Unique identifier for the data
     * @param data Data to save
     */
    FileSystemPersistenceLayer.prototype.save = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.storageDir, "".concat(key, ".json"));
                        return [4 /*yield*/, fs.writeFile(filePath, safeStringify(data))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load data from a file
     * @param key Unique identifier for the data
     * @returns The data if found, null otherwise
     */
    FileSystemPersistenceLayer.prototype.load = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, content, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.storageDir, "".concat(key, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                    case 3:
                        content = _a.sent();
                        return [2 /*return*/, parseJsonWithDates(content)];
                    case 4:
                        error_1 = _a.sent();
                        if (error_1.code === 'ENOENT') {
                            return [2 /*return*/, null];
                        }
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all keys in the storage directory
     * @param prefix Optional prefix to filter keys by
     * @returns Array of keys
     */
    FileSystemPersistenceLayer.prototype.getKeys = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var files, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readdir(this.storageDir)];
                    case 3:
                        files = _a.sent();
                        return [2 /*return*/, files
                                .filter(function (file) { return file.endsWith('.json'); })
                                .map(function (file) { return file.slice(0, -5); }) // Remove .json extension
                                .filter(function (key) { return !prefix || key.startsWith(prefix); })];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error getting keys:', error_2);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a file
     * @param key Unique identifier for the data
     * @returns True if file was deleted, false otherwise
     */
    FileSystemPersistenceLayer.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialize()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.storageDir, "".concat(key, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        error_3 = _a.sent();
                        if (error_3.code === 'ENOENT') {
                            return [2 /*return*/, false];
                        }
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return FileSystemPersistenceLayer;
}());
export { FileSystemPersistenceLayer };
/**
 * Handler class for managing persistent contexts
 */
var PersistentContextHandler = /** @class */ (function () {
    /**
     * Create a new PersistentContextHandler
     * @param persistenceLayer Persistence layer to use
     */
    function PersistentContextHandler(persistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }
    /**
     * Create a new context
     */
    PersistentContextHandler.prototype.createContext = function (sessionId_1, name_1, description_1) {
        return __awaiter(this, arguments, void 0, function (sessionId, name, description, tags, metadata) {
            var timestamp, contextId, newContext, key;
            if (tags === void 0) { tags = []; }
            if (metadata === void 0) { metadata = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = new Date();
                        contextId = uuidv4();
                        newContext = {
                            id: contextId,
                            sessionId: sessionId,
                            name: name,
                            description: description,
                            tags: tags,
                            createdAt: timestamp,
                            updatedAt: timestamp,
                            chunks: [],
                            strategicPlans: [],
                            metadata: metadata
                        };
                        key = "".concat(sessionId, "-").concat(contextId);
                        return [4 /*yield*/, this.persistenceLayer.save(key, newContext)];
                    case 1:
                        _a.sent();
                        console.log("Created new context: ".concat(key));
                        return [2 /*return*/, newContext];
                }
            });
        });
    };
    /**
     * Get a context by ID
     */
    PersistentContextHandler.prototype.getContext = function (contextId) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.persistenceLayer.getKeys()];
                    case 1:
                        keys = _a.sent();
                        key = keys.find(function (k) { return k.includes(contextId); });
                        if (!key) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.persistenceLayer.load(key)];
                    case 2: 
                    // Load the context from the persistence layer
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get contexts by session ID
     */
    PersistentContextHandler.prototype.getContextsBySession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, contexts, _i, keys_1, key, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.persistenceLayer.getKeys(sessionId)];
                    case 1:
                        keys = _a.sent();
                        contexts = [];
                        _i = 0, keys_1 = keys;
                        _a.label = 2;
                    case 2:
                        if (!(_i < keys_1.length)) return [3 /*break*/, 5];
                        key = keys_1[_i];
                        return [4 /*yield*/, this.persistenceLayer.load(key)];
                    case 3:
                        context = _a.sent();
                        if (context) {
                            contexts.push(context);
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, contexts];
                }
            });
        });
    };
    /**
     * Update a context
     */
    PersistentContextHandler.prototype.updateContext = function (contextId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var context, updatedContext, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContext(contextId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            return [2 /*return*/, null];
                        }
                        updatedContext = __assign(__assign(__assign({}, context), updates), { updatedAt: new Date(), 
                            // Make sure these fields don't get overwritten
                            id: context.id, sessionId: context.sessionId, createdAt: context.createdAt });
                        key = "".concat(context.sessionId, "-").concat(contextId);
                        return [4 /*yield*/, this.persistenceLayer.save(key, updatedContext)];
                    case 2:
                        _a.sent();
                        console.log("Updated context: ".concat(key));
                        return [2 /*return*/, updatedContext];
                }
            });
        });
    };
    /**
     * Add a chunk to a context
     */
    PersistentContextHandler.prototype.addChunk = function (contextId_1, content_1, type_1) {
        return __awaiter(this, arguments, void 0, function (contextId, content, type, metadata) {
            var context, newChunk, key;
            if (metadata === void 0) { metadata = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContext(contextId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            return [2 /*return*/, null];
                        }
                        newChunk = {
                            id: uuidv4(),
                            content: content,
                            type: type,
                            metadata: metadata,
                            createdAt: new Date()
                        };
                        context.chunks.push(newChunk);
                        context.updatedAt = new Date();
                        key = "".concat(context.sessionId, "-").concat(contextId);
                        return [4 /*yield*/, this.persistenceLayer.save(key, context)];
                    case 2:
                        _a.sent();
                        console.log("Added chunk to context: ".concat(key));
                        return [2 /*return*/, newChunk];
                }
            });
        });
    };
    /**
     * Search for contexts with specific terms in their content or metadata
     */
    PersistentContextHandler.prototype.searchContexts = function (term) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, matchingContexts, lowercaseTerm, _i, keys_2, key, context, hasMatchingChunk, hasMatchingMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.persistenceLayer.getKeys()];
                    case 1:
                        keys = _a.sent();
                        matchingContexts = [];
                        lowercaseTerm = term.toLowerCase();
                        _i = 0, keys_2 = keys;
                        _a.label = 2;
                    case 2:
                        if (!(_i < keys_2.length)) return [3 /*break*/, 5];
                        key = keys_2[_i];
                        return [4 /*yield*/, this.persistenceLayer.load(key)];
                    case 3:
                        context = _a.sent();
                        if (!context)
                            return [3 /*break*/, 4];
                        // Check context name, description, and tags
                        if (context.name.toLowerCase().includes(lowercaseTerm) ||
                            (context.description && context.description.toLowerCase().includes(lowercaseTerm)) ||
                            context.tags.some(function (tag) { return tag.toLowerCase().includes(lowercaseTerm); })) {
                            matchingContexts.push(context);
                            return [3 /*break*/, 4];
                        }
                        hasMatchingChunk = context.chunks.some(function (chunk) {
                            return chunk.content.toLowerCase().includes(lowercaseTerm) ||
                                chunk.type.toLowerCase().includes(lowercaseTerm) ||
                                Object.entries(chunk.metadata).some(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return key.toLowerCase().includes(lowercaseTerm) ||
                                        String(value).toLowerCase().includes(lowercaseTerm);
                                });
                        });
                        if (hasMatchingChunk) {
                            matchingContexts.push(context);
                            return [3 /*break*/, 4];
                        }
                        hasMatchingMetadata = Object.entries(context.metadata).some(function (_a) {
                            var key = _a[0], value = _a[1];
                            return key.toLowerCase().includes(lowercaseTerm) ||
                                String(value).toLowerCase().includes(lowercaseTerm);
                        });
                        if (hasMatchingMetadata) {
                            matchingContexts.push(context);
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, matchingContexts];
                }
            });
        });
    };
    /**
     * Add a strategic plan to a context
     */
    PersistentContextHandler.prototype.addStrategicPlan = function (contextId_1, title_1, description_1) {
        return __awaiter(this, arguments, void 0, function (contextId, title, description, status) {
            var context, timestamp, newPlan, key;
            if (status === void 0) { status = 'pending'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContext(contextId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            return [2 /*return*/, null];
                        }
                        timestamp = new Date();
                        newPlan = {
                            id: uuidv4(),
                            title: title,
                            description: description,
                            status: status,
                            createdAt: timestamp,
                            updatedAt: timestamp
                        };
                        context.strategicPlans.push(newPlan);
                        context.updatedAt = timestamp;
                        key = "".concat(context.sessionId, "-").concat(contextId);
                        return [4 /*yield*/, this.persistenceLayer.save(key, context)];
                    case 2:
                        _a.sent();
                        console.log("Added strategic plan to context: ".concat(key));
                        return [2 /*return*/, newPlan];
                }
            });
        });
    };
    /**
     * Update a strategic plan status
     */
    PersistentContextHandler.prototype.updateStrategicPlan = function (contextId, planId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var context, planIndex, plan, updatedPlan, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContext(contextId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            return [2 /*return*/, null];
                        }
                        planIndex = context.strategicPlans.findIndex(function (plan) { return plan.id === planId; });
                        if (planIndex === -1) {
                            return [2 /*return*/, null];
                        }
                        plan = context.strategicPlans[planIndex];
                        updatedPlan = __assign(__assign(__assign({}, plan), updates), { updatedAt: new Date(), 
                            // Make sure these fields don't get overwritten
                            id: plan.id, createdAt: plan.createdAt });
                        context.strategicPlans[planIndex] = updatedPlan;
                        context.updatedAt = new Date();
                        key = "".concat(context.sessionId, "-").concat(contextId);
                        return [4 /*yield*/, this.persistenceLayer.save(key, context)];
                    case 2:
                        _a.sent();
                        console.log("Updated strategic plan in context: ".concat(key));
                        return [2 /*return*/, updatedPlan];
                }
            });
        });
    };
    /**
     * Delete a context by ID
     */
    PersistentContextHandler.prototype.deleteContext = function (contextId) {
        return __awaiter(this, void 0, void 0, function () {
            var context, key, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContext(contextId)];
                    case 1:
                        context = _a.sent();
                        if (!context) {
                            return [2 /*return*/, false];
                        }
                        key = "".concat(context.sessionId, "-").concat(contextId);
                        return [4 /*yield*/, this.persistenceLayer.delete(key)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            console.log("Deleted context: ".concat(key));
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return PersistentContextHandler;
}());
export { PersistentContextHandler };
/**
 * Create a new persistent context handler
 * @param config Configuration options
 * @returns A new instance of PersistentContextHandler
 */
export function createContextHandler(config) {
    if (config === void 0) { config = {}; }
    var baseDir = config.baseDir || process.cwd();
    var storageDir = path.join(baseDir, 'contexts');
    var persistenceLayer = new FileSystemPersistenceLayer(storageDir);
    return new PersistentContextHandler(persistenceLayer);
}
// For backward compatibility, export a default instance
// In a proper DI system, this would be configured at application startup
export var persistentContextHandler = createContextHandler();
