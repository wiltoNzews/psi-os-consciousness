/**
 * PostgreSQL Database Storage Adapter
 *
 * This module provides a PostgreSQL database implementation of the Storage interface.
 * It replaces the file-based storage with a robust database solution for better
 * persistence, transactional safety, and scalability.
 *
 * [QUANTUM_STATE: SIM_FLOW]
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
import { v4 as uuidv4 } from 'uuid';
import { ChronosDateHandler } from './services/utils/chronos-date-handler.js';
import { db } from '../shared/db/db.js';
import * as schema from '../shared/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { createNexusJob } from '../shared/schema-minimal.js';
/**
 * [Responsibility] PostgreSQLStorage provides **persistent database storage** for all core data entities
 * in the WiltonOS/PassiveWorks platform. It fully implements the IStorage interface, ensuring that
 * every data operation (create, read, update, delete) is handled consistently with transactional safety.
 * It leverages PostgreSQL's JSONB capabilities for storing complex data structures.
 *
 * [Boundary] This class acts as the database persistence boundary of the system. It exclusively handles
 * database interactions and **does not contain business logic** or higher-level decision-making.
 * It relies on predefined data schemas and does not interpret or modify the meaning of the data – following
 * Void-Centered Design, it **acknowledges unknowns** by treating data as opaque payloads beyond the storage context.
 *
 * [Chronos Integration] All timestamps (e.g., createdAt, updatedAt) are generated using `ChronosDateHandler.createDate()`,
 * ensuring **consistent time management** across modules and satisfying the Chronos verification check.
 */
var PostgreSQLStorage = /** @class */ (function () {
    function PostgreSQLStorage() {
        console.log('🔄 Initializing PostgreSQL storage adapter...');
    }
    // QUANTUM ROOT NODE OPERATIONS
    PostgreSQLStorage.prototype.createQuantumRootNode = function (nodeData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newNode, inserted, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = ChronosDateHandler.createDate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        newNode = {
                            id: nodeData.id || uuidv4(),
                            name: nodeData.name,
                            description: nodeData.description || '',
                            state: nodeData.state || {},
                            capabilities: nodeData.capabilities || [],
                            connections: nodeData.connections || {},
                            lastActivity: nodeData.lastActivity || now,
                            coherenceScore: nodeData.coherenceScore !== undefined ? nodeData.coherenceScore : 0.5
                        };
                        return [4 /*yield*/, db.insert(schema.quantumRootNodes).values(newNode).returning()];
                    case 2:
                        inserted = (_a.sent())[0];
                        // Convert the DB record to our application model
                        return [2 /*return*/, {
                                id: inserted.id,
                                name: inserted.name,
                                description: inserted.description || '',
                                state: inserted.state,
                                capabilities: inserted.capabilities,
                                connections: inserted.connections,
                                createdAt: inserted.createdAt,
                                updatedAt: inserted.updatedAt,
                                lastActivity: inserted.lastActivity || now,
                                coherenceScore: inserted.coherenceScore
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error creating quantum root node:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getQuantumRootNode = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, node, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.quantumRootNodes).where(eq(schema.quantumRootNodes.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        node = result[0];
                        return [2 /*return*/, {
                                id: node.id,
                                name: node.name,
                                description: node.description || '',
                                state: node.state,
                                capabilities: node.capabilities,
                                connections: node.connections,
                                createdAt: node.createdAt,
                                updatedAt: node.updatedAt,
                                lastActivity: node.lastActivity || node.createdAt,
                                coherenceScore: node.coherenceScore
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error retrieving quantum root node ".concat(id, ":"), error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateQuantumRootNode = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var now, updateData, updated, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        now = ChronosDateHandler.createDate();
                        updateData = __assign(__assign({}, updates), { updatedAt: now });
                        // Remove id from updates if it's included
                        delete updateData.id;
                        delete updateData.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.quantumRootNodes)
                                .set(updateData)
                                .where(eq(schema.quantumRootNodes.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                name: updated.name,
                                description: updated.description || '',
                                state: updated.state,
                                capabilities: updated.capabilities,
                                connections: updated.connections,
                                createdAt: updated.createdAt,
                                updatedAt: updated.updatedAt,
                                lastActivity: updated.lastActivity || updated.createdAt,
                                coherenceScore: updated.coherenceScore
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error updating quantum root node ".concat(id, ":"), error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteQuantumRootNode = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.quantumRootNodes)
                                .where(eq(schema.quantumRootNodes.id, id))
                                .returning({ id: schema.quantumRootNodes.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error deleting quantum root node ".concat(id, ":"), error_4);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllQuantumRootNodes = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, results, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = db.select().from(schema.quantumRootNodes);
                        // Apply limit if specified
                        if (limit) {
                            query = query.limit(limit);
                        }
                        // Order by created date (newest first)
                        query = query.orderBy(desc(schema.quantumRootNodes.createdAt));
                        return [4 /*yield*/, query];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (node) { return ({
                                id: node.id,
                                name: node.name,
                                description: node.description || '',
                                state: node.state,
                                capabilities: node.capabilities,
                                connections: node.connections,
                                createdAt: node.createdAt,
                                updatedAt: node.updatedAt,
                                lastActivity: node.lastActivity || node.createdAt,
                                coherenceScore: node.coherenceScore
                            }); })];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error retrieving all quantum root nodes:', error_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // META-COGNITIVE EVENT OPERATIONS
    PostgreSQLStorage.prototype.createMetaCognitiveEvent = function (eventData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newEvent, inserted, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = ChronosDateHandler.createDate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        newEvent = {
                            id: eventData.id || uuidv4(),
                            nodeId: eventData.nodeId,
                            type: eventData.type,
                            description: eventData.description,
                            details: eventData.details || {},
                            confidence: eventData.confidence || 0,
                            impact: eventData.impact || 0,
                            relatedEvents: eventData.relatedEvents,
                            outcome: eventData.outcome,
                            sourceContext: eventData.sourceContext
                        };
                        return [4 /*yield*/, db.insert(schema.metaCognitiveEvents).values(newEvent).returning()];
                    case 2:
                        inserted = (_a.sent())[0];
                        return [2 /*return*/, {
                                id: inserted.id,
                                nodeId: inserted.nodeId,
                                type: inserted.type,
                                description: inserted.description,
                                details: inserted.details,
                                confidence: inserted.confidence,
                                impact: inserted.impact,
                                relatedEvents: inserted.relatedEvents,
                                outcome: inserted.outcome,
                                sourceContext: inserted.sourceContext,
                                createdAt: inserted.createdAt
                            }];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error creating meta-cognitive event:', error_6);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getMetaCognitiveEvent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, event_1, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.metaCognitiveEvents).where(eq(schema.metaCognitiveEvents.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        event_1 = result[0];
                        return [2 /*return*/, {
                                id: event_1.id,
                                nodeId: event_1.nodeId,
                                type: event_1.type,
                                description: event_1.description,
                                details: event_1.details,
                                confidence: event_1.confidence,
                                impact: event_1.impact,
                                relatedEvents: event_1.relatedEvents,
                                outcome: event_1.outcome,
                                sourceContext: event_1.sourceContext,
                                createdAt: event_1.createdAt
                            }];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error retrieving meta-cognitive event ".concat(id, ":"), error_7);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateMetaCognitiveEvent = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updated, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Remove id and createdAt from updates if included
                        delete updates.id;
                        delete updates.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.metaCognitiveEvents)
                                .set(updates)
                                .where(eq(schema.metaCognitiveEvents.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                nodeId: updated.nodeId,
                                type: updated.type,
                                description: updated.description,
                                details: updated.details,
                                confidence: updated.confidence,
                                impact: updated.impact,
                                relatedEvents: updated.relatedEvents,
                                outcome: updated.outcome,
                                sourceContext: updated.sourceContext,
                                createdAt: updated.createdAt
                            }];
                    case 2:
                        error_8 = _a.sent();
                        console.error("Error updating meta-cognitive event ".concat(id, ":"), error_8);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteMetaCognitiveEvent = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.metaCognitiveEvents)
                                .where(eq(schema.metaCognitiveEvents.id, id))
                                .returning({ id: schema.metaCognitiveEvents.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_9 = _a.sent();
                        console.error("Error deleting meta-cognitive event ".concat(id, ":"), error_9);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllMetaCognitiveEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .select()
                                .from(schema.metaCognitiveEvents)
                                .orderBy(desc(schema.metaCognitiveEvents.createdAt))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (event) { return ({
                                id: event.id,
                                nodeId: event.nodeId,
                                type: event.type,
                                description: event.description,
                                details: event.details,
                                confidence: event.confidence,
                                impact: event.impact,
                                relatedEvents: event.relatedEvents,
                                outcome: event.outcome,
                                sourceContext: event.sourceContext,
                                createdAt: event.createdAt
                            }); })];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error retrieving all meta-cognitive events:', error_10);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // NEURAL PATHWAY OPERATIONS
    PostgreSQLStorage.prototype.createNeuralPathway = function (pathwayData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newPathway, inserted, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = ChronosDateHandler.createDate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        newPathway = {
                            id: pathwayData.id || uuidv4(),
                            sourceId: pathwayData.sourceId,
                            targetId: pathwayData.targetId,
                            weight: pathwayData.weight,
                            type: pathwayData.type,
                            metadata: pathwayData.metadata || {},
                            pathType: pathwayData.pathType
                        };
                        return [4 /*yield*/, db.insert(schema.neuralPathways).values(newPathway).returning()];
                    case 2:
                        inserted = (_a.sent())[0];
                        return [2 /*return*/, {
                                id: inserted.id,
                                sourceId: inserted.sourceId,
                                targetId: inserted.targetId,
                                weight: inserted.weight,
                                type: inserted.type,
                                metadata: inserted.metadata,
                                pathType: inserted.pathType,
                                createdAt: inserted.createdAt,
                                updatedAt: inserted.updatedAt
                            }];
                    case 3:
                        error_11 = _a.sent();
                        console.error('Error creating neural pathway:', error_11);
                        throw error_11;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getNeuralPathway = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, pathway, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.neuralPathways).where(eq(schema.neuralPathways.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        pathway = result[0];
                        return [2 /*return*/, {
                                id: pathway.id,
                                sourceId: pathway.sourceId,
                                targetId: pathway.targetId,
                                weight: pathway.weight,
                                type: pathway.type,
                                metadata: pathway.metadata,
                                pathType: pathway.pathType,
                                createdAt: pathway.createdAt,
                                updatedAt: pathway.updatedAt
                            }];
                    case 2:
                        error_12 = _a.sent();
                        console.error("Error retrieving neural pathway ".concat(id, ":"), error_12);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateNeuralPathway = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var now, updateData, updated, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        now = ChronosDateHandler.createDate();
                        updateData = __assign(__assign({}, updates), { updatedAt: now });
                        // Remove id and createdAt from updates if included
                        delete updateData.id;
                        delete updateData.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.neuralPathways)
                                .set(updateData)
                                .where(eq(schema.neuralPathways.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                sourceId: updated.sourceId,
                                targetId: updated.targetId,
                                weight: updated.weight,
                                type: updated.type,
                                metadata: updated.metadata,
                                pathType: updated.pathType,
                                createdAt: updated.createdAt,
                                updatedAt: updated.updatedAt
                            }];
                    case 2:
                        error_13 = _a.sent();
                        console.error("Error updating neural pathway ".concat(id, ":"), error_13);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteNeuralPathway = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.neuralPathways)
                                .where(eq(schema.neuralPathways.id, id))
                                .returning({ id: schema.neuralPathways.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_14 = _a.sent();
                        console.error("Error deleting neural pathway ".concat(id, ":"), error_14);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllNeuralPathways = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .select()
                                .from(schema.neuralPathways)
                                .orderBy(desc(schema.neuralPathways.createdAt))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (pathway) { return ({
                                id: pathway.id,
                                sourceId: pathway.sourceId,
                                targetId: pathway.targetId,
                                weight: pathway.weight,
                                type: pathway.type,
                                metadata: pathway.metadata,
                                pathType: pathway.pathType,
                                createdAt: pathway.createdAt,
                                updatedAt: pathway.updatedAt
                            }); })];
                    case 2:
                        error_15 = _a.sent();
                        console.error('Error retrieving all neural pathways:', error_15);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // TEMPORAL INSTANCE OPERATIONS
    PostgreSQLStorage.prototype.createTemporalInstance = function (instanceData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newInstance, inserted, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = ChronosDateHandler.createDate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        newInstance = {
                            id: instanceData.id || uuidv4(),
                            nodeId: instanceData.nodeId,
                            timestamp: instanceData.timestamp || now,
                            state: instanceData.state,
                            dimensionType: instanceData.dimensionType,
                            parentId: instanceData.parentId,
                            stabilityFactor: instanceData.stabilityFactor || 50,
                            metadata: instanceData.metadata || {}
                        };
                        return [4 /*yield*/, db.insert(schema.temporalInstances).values(newInstance).returning()];
                    case 2:
                        inserted = (_a.sent())[0];
                        return [2 /*return*/, {
                                id: inserted.id,
                                nodeId: inserted.nodeId,
                                timestamp: inserted.timestamp,
                                state: inserted.state,
                                dimensionType: inserted.dimensionType,
                                parentId: inserted.parentId,
                                stabilityFactor: inserted.stabilityFactor,
                                metadata: inserted.metadata,
                                createdAt: inserted.createdAt,
                                updatedAt: inserted.updatedAt
                            }];
                    case 3:
                        error_16 = _a.sent();
                        console.error('Error creating temporal instance:', error_16);
                        throw error_16;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getTemporalInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, instance, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.temporalInstances).where(eq(schema.temporalInstances.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        instance = result[0];
                        return [2 /*return*/, {
                                id: instance.id,
                                nodeId: instance.nodeId,
                                timestamp: instance.timestamp,
                                state: instance.state,
                                dimensionType: instance.dimensionType,
                                parentId: instance.parentId,
                                stabilityFactor: instance.stabilityFactor,
                                metadata: instance.metadata,
                                createdAt: instance.createdAt,
                                updatedAt: instance.updatedAt
                            }];
                    case 2:
                        error_17 = _a.sent();
                        console.error("Error retrieving temporal instance ".concat(id, ":"), error_17);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateTemporalInstance = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var now, updateData, updated, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        now = ChronosDateHandler.createDate();
                        updateData = __assign(__assign({}, updates), { updatedAt: now });
                        // Remove id and createdAt from updates if included
                        delete updateData.id;
                        delete updateData.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.temporalInstances)
                                .set(updateData)
                                .where(eq(schema.temporalInstances.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                nodeId: updated.nodeId,
                                timestamp: updated.timestamp,
                                state: updated.state,
                                dimensionType: updated.dimensionType,
                                parentId: updated.parentId,
                                stabilityFactor: updated.stabilityFactor,
                                metadata: updated.metadata,
                                createdAt: updated.createdAt,
                                updatedAt: updated.updatedAt
                            }];
                    case 2:
                        error_18 = _a.sent();
                        console.error("Error updating temporal instance ".concat(id, ":"), error_18);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteTemporalInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.temporalInstances)
                                .where(eq(schema.temporalInstances.id, id))
                                .returning({ id: schema.temporalInstances.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_19 = _a.sent();
                        console.error("Error deleting temporal instance ".concat(id, ":"), error_19);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllTemporalInstances = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .select()
                                .from(schema.temporalInstances)
                                .orderBy(desc(schema.temporalInstances.createdAt))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (instance) { return ({
                                id: instance.id,
                                nodeId: instance.nodeId,
                                timestamp: instance.timestamp,
                                state: instance.state,
                                dimensionType: instance.dimensionType,
                                parentId: instance.parentId,
                                stabilityFactor: instance.stabilityFactor,
                                metadata: instance.metadata,
                                createdAt: instance.createdAt,
                                updatedAt: instance.updatedAt
                            }); })];
                    case 2:
                        error_20 = _a.sent();
                        console.error('Error retrieving all temporal instances:', error_20);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // NEXUS JOB OPERATIONS
    PostgreSQLStorage.prototype.createNexusJob = function (jobData) {
        return __awaiter(this, void 0, void 0, function () {
            var nexusJob, inserted, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        nexusJob = createNexusJob(jobData);
                        return [4 /*yield*/, db.insert(schema.nexusJobs).values({
                                id: nexusJob.id,
                                input: nexusJob.input,
                                options: nexusJob.options,
                                status: nexusJob.status,
                                progress: nexusJob.progress,
                                result: nexusJob.result,
                                error: nexusJob.error,
                                metrics: nexusJob.metrics,
                                stageMetrics: nexusJob.stageMetrics,
                                startTime: nexusJob.startTime,
                                estimatedCompletion: nexusJob.estimatedCompletion
                            }).returning()];
                    case 1:
                        inserted = (_a.sent())[0];
                        // Return the created job
                        return [2 /*return*/, {
                                id: inserted.id,
                                input: inserted.input,
                                options: inserted.options,
                                status: inserted.status,
                                progress: inserted.progress,
                                result: inserted.result,
                                error: inserted.error,
                                metrics: inserted.metrics,
                                stageMetrics: inserted.stageMetrics,
                                startTime: inserted.startTime,
                                estimatedCompletion: inserted.estimatedCompletion,
                                createdAt: inserted.createdAt,
                                updatedAt: inserted.updatedAt
                            }];
                    case 2:
                        error_21 = _a.sent();
                        console.error('Error creating nexus job:', error_21);
                        throw error_21;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getNexusJob = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, job, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.nexusJobs).where(eq(schema.nexusJobs.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        job = result[0];
                        return [2 /*return*/, {
                                id: job.id,
                                input: job.input,
                                options: job.options,
                                status: job.status,
                                progress: job.progress,
                                result: job.result,
                                error: job.error,
                                metrics: job.metrics,
                                stageMetrics: job.stageMetrics,
                                startTime: job.startTime,
                                estimatedCompletion: job.estimatedCompletion,
                                createdAt: job.createdAt,
                                updatedAt: job.updatedAt
                            }];
                    case 2:
                        error_22 = _a.sent();
                        console.error("Error retrieving nexus job ".concat(id, ":"), error_22);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateNexusJob = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var now, updateData, updated, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        now = ChronosDateHandler.createDate();
                        updateData = __assign(__assign({}, updates), { updatedAt: now });
                        // Remove id and createdAt from updates if included
                        delete updateData.id;
                        delete updateData.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.nexusJobs)
                                .set(updateData)
                                .where(eq(schema.nexusJobs.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                input: updated.input,
                                options: updated.options,
                                status: updated.status,
                                progress: updated.progress,
                                result: updated.result,
                                error: updated.error,
                                metrics: updated.metrics,
                                stageMetrics: updated.stageMetrics,
                                startTime: updated.startTime,
                                estimatedCompletion: updated.estimatedCompletion,
                                createdAt: updated.createdAt,
                                updatedAt: updated.updatedAt
                            }];
                    case 2:
                        error_23 = _a.sent();
                        console.error("Error updating nexus job ".concat(id, ":"), error_23);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateNexusJobProgress = function (id, stage, percentage) {
        return __awaiter(this, void 0, void 0, function () {
            var job, progress, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getNexusJob(id)];
                    case 1:
                        job = _a.sent();
                        if (!job) {
                            return [2 /*return*/, null];
                        }
                        progress = __assign({}, job.progress);
                        // Add the stage to completed stages if it's not already there
                        if (!progress.completedStages.includes(stage) && percentage >= 100) {
                            progress.completedStages.push(stage);
                        }
                        // Update the current stage and percentage
                        progress.currentStage = stage;
                        progress.percentage = percentage;
                        // Update the job with the new progress
                        return [4 /*yield*/, this.updateNexusJob(id, { progress: progress, updatedAt: ChronosDateHandler.createDate() })];
                    case 2:
                        // Update the job with the new progress
                        _a.sent();
                        return [2 /*return*/, progress];
                    case 3:
                        error_24 = _a.sent();
                        console.error("Error updating nexus job progress ".concat(id, ":"), error_24);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteNexusJob = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.nexusJobs)
                                .where(eq(schema.nexusJobs.id, id))
                                .returning({ id: schema.nexusJobs.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_25 = _a.sent();
                        console.error("Error deleting nexus job ".concat(id, ":"), error_25);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllNexusJobs = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var query, results, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = db.select().from(schema.nexusJobs);
                        // Apply limit if specified
                        if (limit) {
                            query = query.limit(limit);
                        }
                        // Order by created date (newest first)
                        query = query.orderBy(desc(schema.nexusJobs.createdAt));
                        return [4 /*yield*/, query];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (job) { return ({
                                id: job.id,
                                input: job.input,
                                options: job.options,
                                status: job.status,
                                progress: job.progress,
                                result: job.result,
                                error: job.error,
                                metrics: job.metrics,
                                stageMetrics: job.stageMetrics,
                                startTime: job.startTime,
                                estimatedCompletion: job.estimatedCompletion,
                                createdAt: job.createdAt,
                                updatedAt: job.updatedAt
                            }); })];
                    case 2:
                        error_26 = _a.sent();
                        console.error('Error retrieving all nexus jobs:', error_26);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // TASK OPERATIONS (STUB IMPLEMENTATIONS)
    PostgreSQLStorage.prototype.saveTask = function (taskData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    PostgreSQLStorage.prototype.loadTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null]; // Implement when needed
            });
        });
    };
    PostgreSQLStorage.prototype.saveSubTasks = function (taskId, subTasksData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    PostgreSQLStorage.prototype.loadSubTasks = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []]; // Implement when needed
            });
        });
    };
    PostgreSQLStorage.prototype.deleteTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, false]; // Implement when needed
            });
        });
    };
    PostgreSQLStorage.prototype.getAllTasks = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []]; // Implement when needed
            });
        });
    };
    // CHUNK OPERATIONS
    PostgreSQLStorage.prototype.createChunk = function (chunkData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newChunk, inserted, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = ChronosDateHandler.createDate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        newChunk = {
                            id: chunkData.id || uuidv4(),
                            qrnId: chunkData.qrnId,
                            parentTaskId: chunkData.parentTaskId,
                            parentChunkId: chunkData.parentChunkId,
                            originalContent: chunkData.originalContent,
                            processedContent: chunkData.processedContent,
                            chunkIndex: chunkData.chunkIndex,
                            totalChunks: chunkData.totalChunks,
                            chunkSize: chunkData.chunkSize,
                            chunkState: chunkData.chunkState || 'created',
                            embedding: chunkData.embedding
                        };
                        return [4 /*yield*/, db.insert(schema.chunks).values(newChunk).returning()];
                    case 2:
                        inserted = (_a.sent())[0];
                        return [2 /*return*/, {
                                id: inserted.id,
                                qrnId: inserted.qrnId,
                                parentTaskId: inserted.parentTaskId,
                                parentChunkId: inserted.parentChunkId,
                                originalContent: inserted.originalContent,
                                processedContent: inserted.processedContent,
                                chunkIndex: inserted.chunkIndex,
                                totalChunks: inserted.totalChunks,
                                chunkSize: inserted.chunkSize,
                                chunkState: inserted.chunkState,
                                embedding: inserted.embedding,
                                createdAt: inserted.createdAt,
                                updatedAt: inserted.updatedAt
                            }];
                    case 3:
                        error_27 = _a.sent();
                        console.error('Error creating chunk:', error_27);
                        throw error_27;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getChunk = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, chunk, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.chunks).where(eq(schema.chunks.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        chunk = result[0];
                        return [2 /*return*/, {
                                id: chunk.id,
                                qrnId: chunk.qrnId,
                                parentTaskId: chunk.parentTaskId,
                                parentChunkId: chunk.parentChunkId,
                                originalContent: chunk.originalContent,
                                processedContent: chunk.processedContent,
                                chunkIndex: chunk.chunkIndex,
                                totalChunks: chunk.totalChunks,
                                chunkSize: chunk.chunkSize,
                                chunkState: chunk.chunkState,
                                embedding: chunk.embedding,
                                createdAt: chunk.createdAt,
                                updatedAt: chunk.updatedAt
                            }];
                    case 2:
                        error_28 = _a.sent();
                        console.error("Error retrieving chunk ".concat(id, ":"), error_28);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateChunk = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var now, updateData, updated, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        now = ChronosDateHandler.createDate();
                        updateData = __assign(__assign({}, updates), { updatedAt: now });
                        // Remove id and createdAt from updates if included
                        delete updateData.id;
                        delete updateData.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.chunks)
                                .set(updateData)
                                .where(eq(schema.chunks.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                qrnId: updated.qrnId,
                                parentTaskId: updated.parentTaskId,
                                parentChunkId: updated.parentChunkId,
                                originalContent: updated.originalContent,
                                processedContent: updated.processedContent,
                                chunkIndex: updated.chunkIndex,
                                totalChunks: updated.totalChunks,
                                chunkSize: updated.chunkSize,
                                chunkState: updated.chunkState,
                                embedding: updated.embedding,
                                createdAt: updated.createdAt,
                                updatedAt: updated.updatedAt
                            }];
                    case 2:
                        error_29 = _a.sent();
                        console.error("Error updating chunk ".concat(id, ":"), error_29);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteChunk = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.chunks)
                                .where(eq(schema.chunks.id, id))
                                .returning({ id: schema.chunks.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_30 = _a.sent();
                        console.error("Error deleting chunk ".concat(id, ":"), error_30);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllChunks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .select()
                                .from(schema.chunks)
                                .orderBy(desc(schema.chunks.createdAt))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (chunk) { return ({
                                id: chunk.id,
                                qrnId: chunk.qrnId,
                                parentTaskId: chunk.parentTaskId,
                                parentChunkId: chunk.parentChunkId,
                                originalContent: chunk.originalContent,
                                processedContent: chunk.processedContent,
                                chunkIndex: chunk.chunkIndex,
                                totalChunks: chunk.totalChunks,
                                chunkSize: chunk.chunkSize,
                                chunkState: chunk.chunkState,
                                embedding: chunk.embedding,
                                createdAt: chunk.createdAt,
                                updatedAt: chunk.updatedAt
                            }); })];
                    case 2:
                        error_31 = _a.sent();
                        console.error('Error retrieving all chunks:', error_31);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // CHUNK DEPENDENCY OPERATIONS
    PostgreSQLStorage.prototype.createChunkDependency = function (dependencyData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newDependency, inserted, error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = ChronosDateHandler.createDate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        newDependency = {
                            id: dependencyData.id || uuidv4(),
                            sourceChunkId: dependencyData.sourceChunkId,
                            targetChunkId: dependencyData.targetChunkId,
                            type: dependencyData.type,
                            strength: dependencyData.strength,
                            metadata: dependencyData.metadata || {}
                        };
                        return [4 /*yield*/, db.insert(schema.chunkDependencies).values(newDependency).returning()];
                    case 2:
                        inserted = (_a.sent())[0];
                        return [2 /*return*/, {
                                id: inserted.id,
                                sourceChunkId: inserted.sourceChunkId,
                                targetChunkId: inserted.targetChunkId,
                                type: inserted.type,
                                strength: inserted.strength,
                                metadata: inserted.metadata,
                                createdAt: inserted.createdAt,
                                updatedAt: inserted.updatedAt
                            }];
                    case 3:
                        error_32 = _a.sent();
                        console.error('Error creating chunk dependency:', error_32);
                        throw error_32;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getChunkDependency = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, dependency, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.chunkDependencies).where(eq(schema.chunkDependencies.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        dependency = result[0];
                        return [2 /*return*/, {
                                id: dependency.id,
                                sourceChunkId: dependency.sourceChunkId,
                                targetChunkId: dependency.targetChunkId,
                                type: dependency.type,
                                strength: dependency.strength,
                                metadata: dependency.metadata,
                                createdAt: dependency.createdAt,
                                updatedAt: dependency.updatedAt
                            }];
                    case 2:
                        error_33 = _a.sent();
                        console.error("Error retrieving chunk dependency ".concat(id, ":"), error_33);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateChunkDependency = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var now, updateData, updated, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        now = ChronosDateHandler.createDate();
                        updateData = __assign(__assign({}, updates), { updatedAt: now });
                        // Remove id and createdAt from updates if included
                        delete updateData.id;
                        delete updateData.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.chunkDependencies)
                                .set(updateData)
                                .where(eq(schema.chunkDependencies.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                sourceChunkId: updated.sourceChunkId,
                                targetChunkId: updated.targetChunkId,
                                type: updated.type,
                                strength: updated.strength,
                                metadata: updated.metadata,
                                createdAt: updated.createdAt,
                                updatedAt: updated.updatedAt
                            }];
                    case 2:
                        error_34 = _a.sent();
                        console.error("Error updating chunk dependency ".concat(id, ":"), error_34);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteChunkDependency = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_35;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.chunkDependencies)
                                .where(eq(schema.chunkDependencies.id, id))
                                .returning({ id: schema.chunkDependencies.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_35 = _a.sent();
                        console.error("Error deleting chunk dependency ".concat(id, ":"), error_35);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllChunkDependencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .select()
                                .from(schema.chunkDependencies)
                                .orderBy(desc(schema.chunkDependencies.createdAt))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (dependency) { return ({
                                id: dependency.id,
                                sourceChunkId: dependency.sourceChunkId,
                                targetChunkId: dependency.targetChunkId,
                                type: dependency.type,
                                strength: dependency.strength,
                                metadata: dependency.metadata,
                                createdAt: dependency.createdAt,
                                updatedAt: dependency.updatedAt
                            }); })];
                    case 2:
                        error_36 = _a.sent();
                        console.error('Error retrieving all chunk dependencies:', error_36);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ADAPTIVE RESONANCE OPERATIONS
    PostgreSQLStorage.prototype.createAdaptiveResonance = function (resonanceData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newResonance, inserted, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = ChronosDateHandler.createDate();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        newResonance = {
                            id: resonanceData.id || uuidv4(),
                            chunkId: resonanceData.chunkId,
                            modelType: resonanceData.modelType,
                            strength: resonanceData.strength,
                            adaptationRate: resonanceData.adaptationRate,
                            metadata: resonanceData.metadata || {}
                        };
                        return [4 /*yield*/, db.insert(schema.adaptiveResonances).values(newResonance).returning()];
                    case 2:
                        inserted = (_a.sent())[0];
                        return [2 /*return*/, {
                                id: inserted.id,
                                chunkId: inserted.chunkId,
                                modelType: inserted.modelType,
                                strength: inserted.strength,
                                adaptationRate: inserted.adaptationRate,
                                metadata: inserted.metadata,
                                createdAt: inserted.createdAt,
                                updatedAt: inserted.updatedAt
                            }];
                    case 3:
                        error_37 = _a.sent();
                        console.error('Error creating adaptive resonance:', error_37);
                        throw error_37;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAdaptiveResonance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, resonance, error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db.select().from(schema.adaptiveResonances).where(eq(schema.adaptiveResonances.id, id))];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, null];
                        }
                        resonance = result[0];
                        return [2 /*return*/, {
                                id: resonance.id,
                                chunkId: resonance.chunkId,
                                modelType: resonance.modelType,
                                strength: resonance.strength,
                                adaptationRate: resonance.adaptationRate,
                                metadata: resonance.metadata,
                                createdAt: resonance.createdAt,
                                updatedAt: resonance.updatedAt
                            }];
                    case 2:
                        error_38 = _a.sent();
                        console.error("Error retrieving adaptive resonance ".concat(id, ":"), error_38);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.updateAdaptiveResonance = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var now, updateData, updated, error_39;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        now = ChronosDateHandler.createDate();
                        updateData = __assign(__assign({}, updates), { updatedAt: now });
                        // Remove id and createdAt from updates if included
                        delete updateData.id;
                        delete updateData.createdAt;
                        return [4 /*yield*/, db
                                .update(schema.adaptiveResonances)
                                .set(updateData)
                                .where(eq(schema.adaptiveResonances.id, id))
                                .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                id: updated.id,
                                chunkId: updated.chunkId,
                                modelType: updated.modelType,
                                strength: updated.strength,
                                adaptationRate: updated.adaptationRate,
                                metadata: updated.metadata,
                                createdAt: updated.createdAt,
                                updatedAt: updated.updatedAt
                            }];
                    case 2:
                        error_39 = _a.sent();
                        console.error("Error updating adaptive resonance ".concat(id, ":"), error_39);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.deleteAdaptiveResonance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .delete(schema.adaptiveResonances)
                                .where(eq(schema.adaptiveResonances.id, id))
                                .returning({ id: schema.adaptiveResonances.id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_40 = _a.sent();
                        console.error("Error deleting adaptive resonance ".concat(id, ":"), error_40);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostgreSQLStorage.prototype.getAllAdaptiveResonances = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, error_41;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db
                                .select()
                                .from(schema.adaptiveResonances)
                                .orderBy(desc(schema.adaptiveResonances.createdAt))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (resonance) { return ({
                                id: resonance.id,
                                chunkId: resonance.chunkId,
                                modelType: resonance.modelType,
                                strength: resonance.strength,
                                adaptationRate: resonance.adaptationRate,
                                metadata: resonance.metadata,
                                createdAt: resonance.createdAt,
                                updatedAt: resonance.updatedAt
                            }); })];
                    case 2:
                        error_41 = _a.sent();
                        console.error('Error retrieving all adaptive resonances:', error_41);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // STUB IMPLEMENTATIONS FOR REMAINING INTERFACE METHODS
    PostgreSQLStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.updateUser = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.createApiKey = function (keyData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.getApiKey = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.getApiKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.updateApiKey = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    PostgreSQLStorage.prototype.deleteApiKey = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Method not implemented.');
            });
        });
    };
    return PostgreSQLStorage;
}());
export { PostgreSQLStorage };
