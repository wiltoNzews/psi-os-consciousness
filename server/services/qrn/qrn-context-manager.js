/**
 * QRN Context Manager
 *
 * This service is responsible for ensuring that all operations within the
 * Neural-Symbiotic Orchestration Platform maintain proper context references
 * to Quantum Root Nodes (QRNs). It provides a central point for managing QRN
 * associations across the platform's components.
 *
 * Core capabilities:
 * - Tracking active QRN contexts
 * - Ensuring consistent QRN references across operations
 * - Providing context-aware operations for tasks, events, and pathways
 * - Supporting context persistence and transitions
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
import { QuantumRootNodeService } from './quantum-root-node-service.js';
import { storage } from '../../storage.js';
var QRNContextManager = /** @class */ (function () {
    /**
     * Private constructor for singleton
     */
    function QRNContextManager() {
        // Active contexts by session/user
        this.activeContexts = new Map(); // sessionId -> qrnId
        // Default QRN for operations without explicit context
        this.defaultQRN = null;
        this.qrnService = new QuantumRootNodeService();
        console.log('QRN Context Manager initialized');
        this.initializeDefaultQRN();
    }
    /**
     * Get the singleton instance
     */
    QRNContextManager.getInstance = function () {
        if (!QRNContextManager.instance) {
            QRNContextManager.instance = new QRNContextManager();
        }
        return QRNContextManager.instance;
    };
    /**
     * Initialize the default QRN if needed
     */
    QRNContextManager.prototype.initializeDefaultQRN = function () {
        return __awaiter(this, void 0, void 0, function () {
            var systemQRNs, systemQRN, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, storage.getAllQuantumRootNodes(1, {
                                type: 'system'
                            })];
                    case 1:
                        systemQRNs = _a.sent();
                        if (!(systemQRNs && systemQRNs.length > 0)) return [3 /*break*/, 2];
                        this.defaultQRN = systemQRNs[0].id;
                        console.log("Using existing system QRN as default: ".concat(this.defaultQRN));
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.qrnService.createNode({
                            name: 'System Default QRN',
                            description: 'Default Quantum Root Node for operations without explicit context',
                            type: 'system',
                            initialCapabilities: ['core', 'system', 'default']
                        })];
                    case 3:
                        systemQRN = _a.sent();
                        this.defaultQRN = systemQRN.id;
                        console.log("Created new system QRN as default: ".concat(this.defaultQRN));
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error initializing default QRN:', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the active QRN for a session/user
     * If no active QRN exists, create one and associate it with the session
     */
    QRNContextManager.prototype.getOrCreateActiveQRN = function (sessionId_1) {
        return __awaiter(this, arguments, void 0, function (sessionId, options) {
            var existingQRN, qrn, error_2;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existingQRN = this.activeContexts.get(sessionId);
                        if (existingQRN) {
                            return [2 /*return*/, existingQRN];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.qrnService.createNode({
                                name: options.name || "Session QRN: ".concat(sessionId),
                                description: options.description || "Quantum Root Node for session ".concat(sessionId),
                                type: options.type || 'session',
                                userId: options.userId,
                                initialCapabilities: ['core', 'session', 'temporal-awareness']
                            })];
                    case 2:
                        qrn = _a.sent();
                        // Store the association
                        this.activeContexts.set(sessionId, qrn.id);
                        return [2 /*return*/, qrn.id];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Error creating QRN for session ".concat(sessionId, ":"), error_2);
                        // Fall back to default QRN
                        return [2 /*return*/, this.getDefaultQRN()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set the active QRN for a session/user
     */
    QRNContextManager.prototype.setActiveQRN = function (sessionId, qrnId) {
        this.activeContexts.set(sessionId, qrnId);
    };
    /**
     * Get the default QRN (for operations without explicit context)
     */
    QRNContextManager.prototype.getDefaultQRN = function () {
        if (!this.defaultQRN) {
            throw new Error('Default QRN not initialized');
        }
        return this.defaultQRN;
    };
    /**
     * Resolve a QRN ID based on context information
     * This is used to ensure all operations have a valid QRN reference
     */
    QRNContextManager.prototype.resolveQRN = function (options) {
        // If explicit QRN ID provided, use it
        if (options.qrnId) {
            return options.qrnId;
        }
        // If session ID provided, use the active QRN for that session
        if (options.sessionId) {
            var sessionQRN = this.activeContexts.get(options.sessionId);
            if (sessionQRN) {
                return sessionQRN;
            }
        }
        // Fall back to default QRN
        return this.getDefaultQRN();
    };
    return QRNContextManager;
}());
export { QRNContextManager };
// Export the singleton instance
export var qrnContextManager = QRNContextManager.getInstance();
