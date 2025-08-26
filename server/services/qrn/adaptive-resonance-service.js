/**
 * Adaptive Resonance Service
 *
 * This service integrates the mathematical frameworks for resonance calculations
 * with the existing adaptive resonance functionality. It provides a comprehensive
 * API for calculating, applying, and monitoring resonance between system components.
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
import { calculateSynapticResonanceFactor, calculateAdaptiveResonanceMetrics } from './resonance-calculator.js';
import { storage } from '../../storage.js';
import { metaCognitiveEngine } from './meta-cognitive-analysis-engine.js';
import { qrnService } from './quantum-root-node-service.js';
import { recordSynapticResonanceOperation } from './meta-learning-validation.js';
import { v4 as uuidv4 } from 'uuid';
import { MetaCognitiveEventBuilder } from '../utils/MetaCognitiveEventBuilder.js';
/**
 * Adaptive Resonance Service
 */
var AdaptiveResonanceService = /** @class */ (function () {
    function AdaptiveResonanceService() {
        console.log('Adaptive Resonance Service initialized');
    }
    /**
     * Get singleton instance
     */
    AdaptiveResonanceService.getInstance = function () {
        if (!AdaptiveResonanceService.instance) {
            AdaptiveResonanceService.instance = new AdaptiveResonanceService();
        }
        return AdaptiveResonanceService.instance;
    };
    /**
     * Calculate resonance between two QRNs using the Synaptic Resonance Factor
     * @param sourceId - Source Quantum Root Node ID
     * @param targetId - Target Quantum Root Node ID
     */
    AdaptiveResonanceService.prototype.calculateNodeResonance = function (sourceId, targetId) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceNode, targetNode, sourceFrequencies, targetFrequencies, frequencies, sourceData, targetData, synapticResonance, sourceMetrics, targetMetrics, adaptiveMetrics, resonanceMetrics, frequencyComponents, recommendations, result, params, performanceMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, qrnService.getNode(sourceId)];
                    case 1:
                        sourceNode = _a.sent();
                        return [4 /*yield*/, qrnService.getNode(targetId)];
                    case 2:
                        targetNode = _a.sent();
                        if (!sourceNode || !targetNode) {
                            throw new Error("One or both nodes not found: ".concat(sourceId, ", ").concat(targetId));
                        }
                        sourceFrequencies = this.extractFrequencyComponents(sourceNode.state);
                        targetFrequencies = this.extractFrequencyComponents(targetNode.state);
                        frequencies = this.alignFrequencyComponents(sourceFrequencies, targetFrequencies);
                        sourceData = {
                            phases: frequencies.map(function (f) { return f.sourcePhase; }),
                            amplitudes: frequencies.map(function (f) { return f.sourceAmplitude; }),
                            frequencies: frequencies.map(function (f) { return f.frequency; })
                        };
                        targetData = {
                            phases: frequencies.map(function (f) { return f.targetPhase; }),
                            amplitudes: frequencies.map(function (f) { return f.targetAmplitude; }),
                            frequencies: frequencies.map(function (f) { return f.frequency; })
                        };
                        synapticResonance = calculateSynapticResonanceFactor(sourceData, targetData, {
                            temporalWeight: 0.3,
                            spatialWeight: 0.2,
                            frequencyWeight: 0.3,
                            patternWeight: 0.2
                        });
                        sourceMetrics = this.extractQuantumMetrics(sourceNode.state);
                        targetMetrics = this.extractQuantumMetrics(targetNode.state);
                        adaptiveMetrics = calculateAdaptiveResonanceMetrics(sourceMetrics, targetMetrics);
                        resonanceMetrics = {
                            resonanceScore: synapticResonance, // Use synaptic resonance as the overall score
                            layerCoherence: adaptiveMetrics.layerCoherence,
                            adaptiveEfficiency: adaptiveMetrics.adaptiveEfficiency,
                            temporalStability: adaptiveMetrics.temporalStability,
                            microMacroSynergy: adaptiveMetrics.microMacroSynergy,
                            phaseSynchronization: adaptiveMetrics.phaseSynchronization
                        };
                        frequencyComponents = frequencies.map(function (f) { return ({
                            frequency: f.frequency,
                            amplitude: (f.sourceAmplitude + f.targetAmplitude) / 2,
                            phaseAlignment: Math.cos(f.sourcePhase - f.targetPhase)
                        }); });
                        recommendations = this.generateResonanceRecommendations(synapticResonance, resonanceMetrics, frequencyComponents);
                        result = {
                            id: uuidv4(),
                            timestamp: new Date(),
                            sourceId: sourceId,
                            targetId: targetId,
                            resonanceScore: resonanceMetrics.resonanceScore,
                            synapticResonance: synapticResonance,
                            quantumCoherence: resonanceMetrics.layerCoherence,
                            detailedMetrics: {
                                layerCoherence: resonanceMetrics.layerCoherence,
                                adaptiveEfficiency: resonanceMetrics.adaptiveEfficiency,
                                temporalStability: resonanceMetrics.temporalStability,
                                microMacroSynergy: resonanceMetrics.microMacroSynergy,
                                phaseSynchronization: resonanceMetrics.phaseSynchronization
                            },
                            frequencyComponents: frequencyComponents,
                            recommendations: recommendations
                        };
                        // Record a meta-cognitive event
                        return [4 /*yield*/, this.recordResonanceAnalysisEvent(result)];
                    case 3:
                        // Record a meta-cognitive event
                        _a.sent();
                        params = {
                            sourceId: sourceId,
                            targetId: targetId,
                            sourcePhases: sourcePhases,
                            targetPhases: targetPhases,
                            weights: weights
                        };
                        performanceMetrics = {
                            executionTime: Date.now() - result.timestamp.getTime(),
                            accuracy: result.resonanceScore,
                            resourceUtilization: {
                                cpu: 0.4, // Placeholder - replace with actual CPU measurement
                                memory: 0.3 // Placeholder - replace with actual memory measurement
                            },
                            systemFeedback: result.resonanceScore
                        };
                        // Record the operation
                        recordSynapticResonanceOperation(params, result, performanceMetrics);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Apply resonance tuning based on calculated metrics
     * @param resonanceAnalysis - The resonance analysis result
     */
    AdaptiveResonanceService.prototype.applyResonanceTuning = function (resonanceAnalysis) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceNode, sourceState, targetNode, targetState, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        // Record the adaptive resonance in the database
                        return [4 /*yield*/, storage.createAdaptiveResonance({
                                qrnId: resonanceAnalysis.sourceId,
                                chunkPattern: {
                                    targetId: resonanceAnalysis.targetId,
                                    frequencyComponents: resonanceAnalysis.frequencyComponents
                                },
                                performanceMetrics: __assign({ resonanceScore: resonanceAnalysis.resonanceScore, synapticResonance: resonanceAnalysis.synapticResonance, quantumCoherence: resonanceAnalysis.quantumCoherence }, resonanceAnalysis.detailedMetrics),
                                resonanceScore: resonanceAnalysis.resonanceScore,
                                sampleSize: resonanceAnalysis.frequencyComponents.length,
                                description: "Resonance analysis between ".concat(resonanceAnalysis.sourceId, " and ").concat(resonanceAnalysis.targetId)
                            })];
                    case 1:
                        // Record the adaptive resonance in the database
                        _a.sent();
                        return [4 /*yield*/, qrnService.getNode(resonanceAnalysis.sourceId)];
                    case 2:
                        sourceNode = _a.sent();
                        if (!sourceNode) return [3 /*break*/, 4];
                        sourceState = sourceNode.state;
                        // Update energy flow based on resonance score
                        sourceState.energyFlow = Math.max(0.2, resonanceAnalysis.resonanceScore);
                        // Update coherence based on quantum coherence
                        sourceState.coherence = Math.max(0.3, resonanceAnalysis.quantumCoherence);
                        // Update stability based on temporal stability
                        sourceState.stability = Math.max(0.4, resonanceAnalysis.detailedMetrics.temporalStability);
                        // Apply the updates
                        return [4 /*yield*/, qrnService.updateNodeState(resonanceAnalysis.sourceId, sourceState)];
                    case 3:
                        // Apply the updates
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!resonanceAnalysis.targetId) return [3 /*break*/, 7];
                        return [4 /*yield*/, qrnService.getNode(resonanceAnalysis.targetId)];
                    case 5:
                        targetNode = _a.sent();
                        if (!targetNode) return [3 /*break*/, 7];
                        targetState = targetNode.state;
                        // Apply tuning
                        targetState.energyFlow = Math.max(0.2, resonanceAnalysis.resonanceScore);
                        targetState.coherence = Math.max(0.3, resonanceAnalysis.quantumCoherence);
                        targetState.stability = Math.max(0.4, resonanceAnalysis.detailedMetrics.temporalStability);
                        // Apply the updates
                        return [4 /*yield*/, qrnService.updateNodeState(resonanceAnalysis.targetId, targetState)];
                    case 6:
                        // Apply the updates
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, true];
                    case 8:
                        error_1 = _a.sent();
                        console.error('Error applying resonance tuning:', error_1);
                        return [2 /*return*/, false];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract frequency components from node state
     */
    AdaptiveResonanceService.prototype.extractFrequencyComponents = function (nodeState) {
        var _this = this;
        var components = [];
        // Base frequency component from energy flow
        components.push({
            frequency: 1.0, // Base frequency of 1 Hz
            phase: (nodeState.energyFlow || 0.5) * Math.PI,
            amplitude: nodeState.energyFlow || 0.5
        });
        // Coherence component
        components.push({
            frequency: 2.5, // 2.5 Hz for coherence
            phase: (nodeState.coherence || 0.5) * Math.PI * 1.5,
            amplitude: nodeState.coherence || 0.5
        });
        // Stability component
        components.push({
            frequency: 0.5, // 0.5 Hz for stability
            phase: (nodeState.stability || 0.5) * Math.PI * 0.8,
            amplitude: nodeState.stability || 0.5
        });
        // Add additional frequency components from active threads if available
        if (nodeState.activeThreads && Array.isArray(nodeState.activeThreads)) {
            nodeState.activeThreads.forEach(function (thread, index) {
                // Create unique frequency based on thread
                var threadHash = _this.simpleHash(thread);
                var frequency = 1.5 + (threadHash % 10) / 10; // Range from 1.5 to 2.5 Hz
                components.push({
                    frequency: frequency,
                    phase: ((threadHash % 100) / 100) * Math.PI * 2, // 0 to 2π
                    amplitude: 0.3 + (threadHash % 10) / 20 // Range from 0.3 to 0.8
                });
            });
        }
        // Add temporal markers if available
        if (nodeState.temporalMarkers && Array.isArray(nodeState.temporalMarkers)) {
            nodeState.temporalMarkers.forEach(function (marker) {
                components.push({
                    frequency: 0.2 + (marker.stability || 0.5) * 0.6, // Range from 0.2 to 0.8 Hz
                    phase: ((marker.timestamp || 0) % 1000) / 1000 * Math.PI * 2,
                    amplitude: marker.stability || 0.5
                });
            });
        }
        return components;
    };
    /**
     * Align frequency components from two nodes for resonance calculation
     */
    AdaptiveResonanceService.prototype.alignFrequencyComponents = function (sourceFrequencies, targetFrequencies) {
        var aligned = [];
        // First, add components that exist in both
        sourceFrequencies.forEach(function (sourceComp) {
            // Look for matching frequency in target
            var targetComp = targetFrequencies.find(function (t) { return Math.abs(t.frequency - sourceComp.frequency) < 0.1; });
            if (targetComp) {
                // Matching frequency component found
                aligned.push({
                    frequency: sourceComp.frequency,
                    sourcePhase: sourceComp.phase,
                    targetPhase: targetComp.phase,
                    sourceAmplitude: sourceComp.amplitude,
                    targetAmplitude: targetComp.amplitude,
                    weight: (sourceComp.amplitude + targetComp.amplitude) / 2 // Weight by average amplitude
                });
            }
            else {
                // No match in target, add with zero target amplitude
                aligned.push({
                    frequency: sourceComp.frequency,
                    sourcePhase: sourceComp.phase,
                    targetPhase: 0,
                    sourceAmplitude: sourceComp.amplitude,
                    targetAmplitude: 0,
                    weight: sourceComp.amplitude * 0.3 // Lower weight for unmatched component
                });
            }
        });
        // Add target components that weren't matched
        targetFrequencies.forEach(function (targetComp) {
            // Check if this component was already added
            var exists = aligned.some(function (a) { return Math.abs(a.frequency - targetComp.frequency) < 0.1; });
            if (!exists) {
                // Add unmatched target component
                aligned.push({
                    frequency: targetComp.frequency,
                    sourcePhase: 0,
                    targetPhase: targetComp.phase,
                    sourceAmplitude: 0,
                    targetAmplitude: targetComp.amplitude,
                    weight: targetComp.amplitude * 0.3 // Lower weight for unmatched component
                });
            }
        });
        // Normalize weights so they sum to 1
        var totalWeight = aligned.reduce(function (sum, comp) { return sum + comp.weight; }, 0);
        if (totalWeight > 0) {
            aligned.forEach(function (comp) {
                comp.weight = comp.weight / totalWeight;
            });
        }
        return aligned;
    };
    /**
     * Extract quantum metrics from node state
     */
    AdaptiveResonanceService.prototype.extractQuantumMetrics = function (nodeState) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        // Default metrics
        var defaults = {
            quantumLayerScore: 0.5,
            microMacroBalance: 0.5,
            modelEnsembleEfficiency: 0.5,
            adaptabilityFactor: 0.5,
            cognitiveCoherence: 0.5,
            semanticOverlap: 0.5,
            temporalConsistency: 0.5
        };
        // Try to extract metrics from node state
        var metrics = {
            quantumLayerScore: (_b = (_a = nodeState.quantumLayerScore) !== null && _a !== void 0 ? _a : nodeState.energyFlow) !== null && _b !== void 0 ? _b : defaults.quantumLayerScore,
            microMacroBalance: (_c = nodeState.microMacroBalance) !== null && _c !== void 0 ? _c : defaults.microMacroBalance,
            modelEnsembleEfficiency: (_e = (_d = nodeState.modelEnsembleEfficiency) !== null && _d !== void 0 ? _d : nodeState.coherence) !== null && _e !== void 0 ? _e : defaults.modelEnsembleEfficiency,
            adaptabilityFactor: (_f = nodeState.adaptabilityFactor) !== null && _f !== void 0 ? _f : defaults.adaptabilityFactor,
            cognitiveCoherence: (_h = (_g = nodeState.cognitiveCoherence) !== null && _g !== void 0 ? _g : nodeState.coherence) !== null && _h !== void 0 ? _h : defaults.cognitiveCoherence,
            semanticOverlap: (_j = nodeState.semanticOverlap) !== null && _j !== void 0 ? _j : defaults.semanticOverlap,
            temporalConsistency: (_l = (_k = nodeState.temporalConsistency) !== null && _k !== void 0 ? _k : nodeState.stability) !== null && _l !== void 0 ? _l : defaults.temporalConsistency
        };
        return metrics;
    };
    /**
     * Generate recommendations based on resonance analysis
     */
    AdaptiveResonanceService.prototype.generateResonanceRecommendations = function (synapticResonance, resonanceMetrics, frequencyComponents) {
        var recommendations = [];
        // Synaptic resonance recommendations
        if (synapticResonance < 0.3) {
            recommendations.push('Critical resonance misalignment detected. Consider complete recalibration.');
        }
        else if (synapticResonance < 0.6) {
            recommendations.push('Moderate resonance achieved. Fine-tune phase alignment for better harmony.');
        }
        else {
            recommendations.push('Strong resonance detected. Maintain current phase alignment parameters.');
        }
        // Layer coherence recommendations
        if (resonanceMetrics.layerCoherence < 0.4) {
            recommendations.push('Improve layer coherence by aligning quantum processing objectives.');
        }
        // Temporal stability recommendations
        if (resonanceMetrics.temporalStability < 0.5) {
            recommendations.push('Enhance temporal stability through consistent checkpoint synchronization.');
        }
        // Micro-macro synergy recommendations
        if (resonanceMetrics.microMacroSynergy < 0.5) {
            recommendations.push('Balance micro and macro cognitive processing to improve synergy.');
        }
        // Analyze frequency components for specific recommendations
        var misalignedComponents = frequencyComponents.filter(function (c) { return c.phaseAlignment < 0; });
        if (misalignedComponents.length > 0) {
            recommendations.push("Correct phase misalignment in ".concat(misalignedComponents.length, " frequency components."));
        }
        return recommendations;
    };
    /**
     * Record a meta-cognitive event for resonance analysis
     */
    AdaptiveResonanceService.prototype.recordResonanceAnalysisEvent = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var event_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        event_1 = new MetaCognitiveEventBuilder()
                            .withId(uuidv4())
                            .withNodeId(result.sourceId)
                            .withType('resonance-analysis')
                            .withCreatedAt(new Date())
                            .withDescription("Resonance analysis between ".concat(result.sourceId, " and ").concat(result.targetId))
                            .withDetails({
                            resonanceScore: result.resonanceScore,
                            synapticResonance: result.synapticResonance,
                            quantumCoherence: result.quantumCoherence,
                            recommendations: result.recommendations.length,
                            processingTime: 0 // Added processingTime to details where it belongs
                        })
                            .withConfidence(result.resonanceScore)
                            .withImpact(Math.ceil(result.resonanceScore * 10))
                            .withRelatedEvents([]) // Properly converts empty array to empty string
                            .withOutcome('') // Properly handles empty object as a string
                            .withSourceContext({
                            source: result.sourceId,
                            operation: "analyze-resonance-with-".concat(result.targetId)
                        })
                            .build();
                        // Process the properly formatted event
                        return [4 /*yield*/, metaCognitiveEngine.processEvent(event_1)];
                    case 1:
                        // Process the properly formatted event
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.warn('Failed to record resonance analysis event:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Simple hash function for strings
     */
    AdaptiveResonanceService.prototype.simpleHash = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };
    return AdaptiveResonanceService;
}());
export { AdaptiveResonanceService };
// Export singleton instance
export var adaptiveResonanceService = AdaptiveResonanceService.getInstance();
