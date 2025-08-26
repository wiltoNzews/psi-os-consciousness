"use strict";
/**
 * Direct Verification of ChronosQRNService
 *
 * This script directly verifies that the ChronosQRNService properly
 * integrates the ChronosHandler with QRN operations and maintains
 * temporal history for QRNs.
 *
 * It applies the TSAR BOMBA verification approach with explicit testing
 * for each function and edge case.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var feature_toggle_service_js_1 = require("../services/feature-toggle-service.js");
var chronos_qrn_service_js_1 = require("../services/qrn/chronos-qrn-service.js");
var file_system_storage_js_1 = require("../services/file-system-storage.js");
var fs = __importStar(require("node:fs/promises"));
var path = __importStar(require("node:path"));
/**
 * Clean up any existing test data
 */
function cleanupTestData() {
    return __awaiter(this, void 0, void 0, function () {
        var qrnDir, tempDir, qrnFiles, _i, qrnFiles_1, file, tempFiles, _a, tempFiles_1, file, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    qrnDir = path.join('./data', 'quantum_root_nodes');
                    tempDir = path.join('./data', 'temporal_instances');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 14, , 15]);
                    // Create directories if they don't exist
                    return [4 /*yield*/, fs.mkdir(qrnDir, { recursive: true })];
                case 2:
                    // Create directories if they don't exist
                    _b.sent();
                    return [4 /*yield*/, fs.mkdir(tempDir, { recursive: true })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, fs.readdir(qrnDir)];
                case 4:
                    qrnFiles = _b.sent();
                    _i = 0, qrnFiles_1 = qrnFiles;
                    _b.label = 5;
                case 5:
                    if (!(_i < qrnFiles_1.length)) return [3 /*break*/, 8];
                    file = qrnFiles_1[_i];
                    if (!file.includes('chronos-test')) return [3 /*break*/, 7];
                    return [4 /*yield*/, fs.unlink(path.join(qrnDir, file))];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, fs.readdir(tempDir)];
                case 9:
                    tempFiles = _b.sent();
                    _a = 0, tempFiles_1 = tempFiles;
                    _b.label = 10;
                case 10:
                    if (!(_a < tempFiles_1.length)) return [3 /*break*/, 13];
                    file = tempFiles_1[_a];
                    if (!file.includes('chronos-test')) return [3 /*break*/, 12];
                    return [4 /*yield*/, fs.unlink(path.join(tempDir, file))];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_1 = _b.sent();
                    console.error('Error during cleanup:', error_1);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
/**
 * Run the direct verification
 */
function runVerification() {
    return __awaiter(this, void 0, void 0, function () {
        var storage, qrnService, toggleService, testNode, createdNode, updateData, updatedNode, temporalInstances, coherenceAnalysis, testNode2, createdNode2, allNodes, deleteResult, deleteResult2, deletedNode, deletedNode2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("⚛️ CHRONOS QRN SERVICE - DIRECT VERIFICATION");
                    console.log("=============================================");
                    // Clean up before testing
                    return [4 /*yield*/, cleanupTestData()];
                case 1:
                    // Clean up before testing
                    _a.sent();
                    storage = new file_system_storage_js_1.FileSystemStorage('./data');
                    qrnService = new chronos_qrn_service_js_1.ChronosQRNService(storage);
                    toggleService = feature_toggle_service_js_1.FeatureToggleService.getInstance();
                    // Enable the Chronos feature to test with it enabled
                    toggleService.enable(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER);
                    testNode = {
                        name: 'Chronos Test QRN',
                        description: 'A quantum root node for testing Chronos integration',
                        state: {
                            status: 'initialized',
                            coherence: 0.75,
                            energy: 100
                        },
                        capabilities: ['test', 'chronos', 'verification'],
                        coherenceScore: 0.75
                    };
                    // Test with Chronos enabled
                    console.log("\n--- Testing with CHRONOS_HANDLER enabled ---");
                    return [4 /*yield*/, qrnService.createQuantumRootNode(testNode)];
                case 2:
                    createdNode = _a.sent();
                    console.log("Created QRN:", {
                        id: createdNode.id,
                        name: createdNode.name,
                        createdAt: createdNode.createdAt,
                        updatedAt: createdNode.updatedAt,
                        coherenceScore: createdNode.coherenceScore
                    });
                    // Verify created node
                    console.assert(createdNode.name === testNode.name, 'Name should match');
                    console.assert(createdNode.description === testNode.description, 'Description should match');
                    console.assert(typeof createdNode.state === 'object', 'State should be an object');
                    console.assert(createdNode.createdAt instanceof Date, 'CreatedAt should be a Date');
                    console.assert(createdNode.updatedAt instanceof Date, 'UpdatedAt should be a Date');
                    // Wait a moment to ensure timestamps are different
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                case 3:
                    // Wait a moment to ensure timestamps are different
                    _a.sent();
                    updateData = {
                        state: {
                            status: 'active',
                            coherence: 0.85,
                            energy: 95,
                            lastAction: 'verification'
                        },
                        coherenceScore: 0.85
                    };
                    return [4 /*yield*/, qrnService.updateQuantumRootNode(createdNode.id, updateData)];
                case 4:
                    updatedNode = _a.sent();
                    console.log("\nUpdated QRN:", {
                        id: updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.id,
                        name: updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.name,
                        state: updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.state,
                        updatedAt: updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.updatedAt,
                        coherenceScore: updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.coherenceScore
                    });
                    // Verify updated node
                    console.assert(updatedNode, 'Updated node should exist');
                    console.assert((updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.state.status) === 'active', 'State status should be updated');
                    console.assert((updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.coherenceScore) === 0.85, 'Coherence score should be updated');
                    console.assert((updatedNode === null || updatedNode === void 0 ? void 0 : updatedNode.updatedAt.getTime()) > createdNode.updatedAt.getTime(), 'UpdatedAt should be newer');
                    return [4 /*yield*/, qrnService.getNodeTemporalInstances(createdNode.id)];
                case 5:
                    temporalInstances = _a.sent();
                    console.log("\nTemporal instances for node:", temporalInstances.length);
                    console.assert(temporalInstances.length >= 2, 'Should have at least 2 temporal instances');
                    if (temporalInstances.length > 0) {
                        console.log("Example temporal instance:", {
                            id: temporalInstances[0].id,
                            nodeId: temporalInstances[0].nodeId,
                            dimensionType: temporalInstances[0].dimensionType,
                            timestamp: temporalInstances[0].timestamp
                        });
                    }
                    return [4 /*yield*/, qrnService.analyzeNodeCoherence(createdNode.id)];
                case 6:
                    coherenceAnalysis = _a.sent();
                    console.log("\nCoherence analysis:", coherenceAnalysis);
                    console.assert(coherenceAnalysis.nodeId === createdNode.id, 'Analysis should be for the right node');
                    console.assert(typeof coherenceAnalysis.averageCoherence === 'number', 'Should have average coherence');
                    console.assert(coherenceAnalysis.dataPoints > 0, 'Should have data points');
                    // Disable Chronos feature
                    toggleService.disable(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER);
                    // Test with Chronos disabled
                    console.log("\n--- Testing with CHRONOS_HANDLER disabled ---");
                    testNode2 = {
                        name: 'Standard Test QRN',
                        description: 'A quantum root node for testing standard operation',
                        state: {
                            status: 'initialized',
                            coherence: 0.65
                        },
                        capabilities: ['test', 'standard'],
                        coherenceScore: 0.65
                    };
                    return [4 /*yield*/, qrnService.createQuantumRootNode(testNode2)];
                case 7:
                    createdNode2 = _a.sent();
                    console.log("Created QRN without Chronos:", {
                        id: createdNode2.id,
                        name: createdNode2.name,
                        createdAt: createdNode2.createdAt
                    });
                    return [4 /*yield*/, qrnService.getAllQuantumRootNodes()];
                case 8:
                    allNodes = _a.sent();
                    console.log("\nAll QRNs:", allNodes.length);
                    console.assert(allNodes.length >= 2, 'Should have at least 2 QRNs');
                    // Test deletion with Chronos enabled
                    toggleService.enable(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER);
                    return [4 /*yield*/, qrnService.deleteQuantumRootNode(createdNode.id)];
                case 9:
                    deleteResult = _a.sent();
                    console.log("\nDeletion result (with Chronos):", deleteResult);
                    console.assert(deleteResult === true, 'Deletion should succeed');
                    // Test deletion with Chronos disabled
                    toggleService.disable(feature_toggle_service_js_1.Feature.CHRONOS_HANDLER);
                    return [4 /*yield*/, qrnService.deleteQuantumRootNode(createdNode2.id)];
                case 10:
                    deleteResult2 = _a.sent();
                    console.log("Deletion result (without Chronos):", deleteResult2);
                    console.assert(deleteResult2 === true, 'Deletion should succeed');
                    return [4 /*yield*/, qrnService.getQuantumRootNode(createdNode.id)];
                case 11:
                    deletedNode = _a.sent();
                    return [4 /*yield*/, qrnService.getQuantumRootNode(createdNode2.id)];
                case 12:
                    deletedNode2 = _a.sent();
                    console.assert(!deletedNode, 'First deleted node should not exist');
                    console.assert(!deletedNode2, 'Second deleted node should not exist');
                    console.log("\n✅ CHRONOS QRN SERVICE VERIFICATION COMPLETE");
                    return [2 /*return*/];
            }
        });
    });
}
// Run the verification
runVerification()
    .then(function () {
    console.log("ChronosQRNService verification succeeded");
    feature_toggle_service_js_1.FeatureToggleService.getInstance().resetToDefaults(); // Reset toggles to defaults
})
    .catch(function (error) {
    console.error("ChronosQRNService verification failed:", error);
    feature_toggle_service_js_1.FeatureToggleService.getInstance().resetToDefaults(); // Reset toggles to defaults
    process.exit(1);
});
