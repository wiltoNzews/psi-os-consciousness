/**
 * Meta Orchestrator
 *
 * Coordinates the intelligent orchestration of quantum coherence,
 * variants, and other meta-cognitive components.
 *
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { EventEmitter } from 'events';
import { ouroborosService } from './OuroborosService.js';
/**
 * Central orchestrator to coordinate all quantum-inspired components
 */
var MetaOrchestrator = /** @class */ (function (_super) {
    __extends(MetaOrchestrator, _super);
    /**
     * Creates a new MetaOrchestrator
     */
    function MetaOrchestrator() {
        var _this = _super.call(this) || this;
        _this.variants = new Map();
        _this.lastSystemState = null;
        _this.isInitialized = false;
        _this.resonanceTracker = null;
        _this.initialize();
        return _this;
    }
    /**
     * Initializes the Meta Orchestrator
     */
    MetaOrchestrator.prototype.initialize = function () {
        var _this = this;
        if (this.isInitialized)
            return;
        // Subscribe to Ouroboros service events
        ouroborosService.on('state', function (state) {
            _this.updateSystemState();
        });
        // Initialize system state
        this.updateSystemState();
        this.isInitialized = true;
        console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Meta Orchestrator initialized');
    };
    /**
     * Updates the overall system state
     */
    MetaOrchestrator.prototype.updateSystemState = function () {
        var ouroborosState = ouroborosService.getCurrentState();
        var activeVariants = this.getActiveVariants();
        // Calculate QCTF based on current state
        var qctf = ouroborosService.calculateQCTF();
        // Calculate stability factor
        var stabilityFactor = ouroborosService.getCoherenceStability(20);
        var newState = {
            coherence: ouroborosState.coherence,
            coherencePhase: ouroborosState.phase,
            qctf: qctf,
            activeVariants: activeVariants,
            stabilityFactor: stabilityFactor,
            timestamp: Date.now()
        };
        this.lastSystemState = newState;
        this.emit('stateUpdated', newState);
    };
    /**
     * Gets the current system state
     */
    MetaOrchestrator.prototype.getSystemState = function () {
        if (!this.lastSystemState) {
            this.updateSystemState();
        }
        return this.lastSystemState;
    };
    /**
     * Registers a new variant
     */
    MetaOrchestrator.prototype.registerVariant = function (variant) {
        if (this.variants.has(variant.id)) {
            throw new Error("Variant with ID ".concat(variant.id, " already exists"));
        }
        var now = new Date();
        var fullVariant = __assign(__assign({}, variant), { createdAt: now, updatedAt: now });
        this.variants.set(variant.id, fullVariant);
        console.log("[QUANTUM_STATE: CREATION_FLOW] Created variant ".concat(variant.name, " (").concat(variant.id.substring(0, 10), "...)"));
        this.emit('variantRegistered', fullVariant);
        return fullVariant;
    };
    /**
     * Gets all registered variants
     */
    MetaOrchestrator.prototype.getAllVariants = function () {
        return Array.from(this.variants.values());
    };
    /**
     * Alias for getAllVariants - provided for API compatibility with previous versions
     */
    MetaOrchestrator.prototype.getVariants = function () {
        return this.getAllVariants();
    };
    /**
     * Gets active variants
     */
    MetaOrchestrator.prototype.getActiveVariants = function () {
        return Array.from(this.variants.values()).filter(function (v) { return v.isActive; });
    };
    /**
     * Gets a variant by ID
     */
    MetaOrchestrator.prototype.getVariant = function (id) {
        return this.variants.get(id);
    };
    /**
     * Updates a variant's properties
     */
    MetaOrchestrator.prototype.updateVariant = function (id, updates) {
        var variant = this.getVariant(id);
        if (!variant) {
            throw new Error("Variant with ID ".concat(id, " not found"));
        }
        var updatedVariant = __assign(__assign(__assign({}, variant), updates), { updatedAt: new Date() });
        this.variants.set(id, updatedVariant);
        console.log("[QUANTUM_STATE: UPDATE_FLOW] Updated variant ".concat(variant.name, " (").concat(variant.id.substring(0, 10), "...)"));
        this.emit('variantUpdated', updatedVariant);
        return updatedVariant;
    };
    /**
     * Removes a variant
     */
    MetaOrchestrator.prototype.removeVariant = function (id) {
        var variant = this.getVariant(id);
        if (!variant) {
            return false;
        }
        this.variants.delete(id);
        console.log("[QUANTUM_STATE: DELETION_FLOW] Removed variant ".concat(variant.name, " (").concat(variant.id.substring(0, 10), "...)"));
        this.emit('variantRemoved', variant);
        return true;
    };
    /**
     * Activates a variant
     */
    MetaOrchestrator.prototype.activateVariant = function (id, activation) {
        if (activation === void 0) { activation = 1.0; }
        var variant = this.getVariant(id);
        if (!variant) {
            throw new Error("Variant with ID ".concat(id, " not found"));
        }
        return this.updateVariant(id, {
            isActive: true,
            activation: Math.max(0, Math.min(1, activation))
        });
    };
    /**
     * Deactivates a variant
     */
    MetaOrchestrator.prototype.deactivateVariant = function (id) {
        var variant = this.getVariant(id);
        if (!variant) {
            throw new Error("Variant with ID ".concat(id, " not found"));
        }
        return this.updateVariant(id, {
            isActive: false,
            activation: 0
        });
    };
    /**
     * Seeds the system with initial variants
     */
    MetaOrchestrator.prototype.seedInitialVariants = function () {
        // Create stability-focused variant
        if (!this.getVariantByName('Stability Variant')) {
            this.registerVariant({
                id: "Variant-".concat(Date.now(), "-1"),
                name: 'Stability Variant',
                type: 'stability',
                parameters: {
                    targetCoherence: 0.85,
                    attractorStrength: 0.95,
                    stabilityPhaseRatio: 0.8
                },
                activation: 0.7,
                isActive: true,
                metadata: {
                    description: 'Prioritizes system stability and consistent behavior'
                }
            });
        }
        // Create balance-focused variant
        if (!this.getVariantByName('Balance Variant')) {
            this.registerVariant({
                id: "Variant-".concat(Date.now(), "-2"),
                name: 'Balance Variant',
                type: 'balance',
                parameters: {
                    targetCoherence: 0.75,
                    attractorStrength: 0.9,
                    stabilityPhaseRatio: 0.75
                },
                activation: 0.8,
                isActive: true,
                metadata: {
                    description: 'Maintains optimal balance between stability and adaptability'
                }
            });
        }
        // Create adaptability-focused variant
        if (!this.getVariantByName('Adaptability Variant')) {
            this.registerVariant({
                id: "Variant-3",
                name: 'Adaptability Variant',
                type: 'adaptability',
                parameters: {
                    targetCoherence: 0.65,
                    attractorStrength: 0.85,
                    stabilityPhaseRatio: 0.6
                },
                activation: 0.6,
                isActive: true,
                metadata: {
                    description: 'Emphasizes adaptability and exploration'
                }
            });
        }
        // Create chaos variant
        if (!this.getVariantByName('Chaos Variant')) {
            this.registerVariant({
                id: "Variant-4",
                name: 'Chaos Variant',
                type: 'chaos',
                parameters: {
                    targetCoherence: 0.5,
                    attractorStrength: 0.7,
                    stabilityPhaseRatio: 0.3
                },
                activation: 0.3,
                isActive: false,
                metadata: {
                    description: 'Introduces controlled chaos for radical innovation'
                }
            });
        }
        console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Seeded Meta-Orchestrator with initial variants');
    };
    /**
     * Gets a variant by name
     */
    MetaOrchestrator.prototype.getVariantByName = function (name) {
        return Array.from(this.variants.values()).find(function (v) { return v.name === name; });
    };
    /**
     * Perturbs the system coherence
     */
    MetaOrchestrator.prototype.perturbSystem = function (targetCoherence, duration) {
        ouroborosService.perturb(targetCoherence, duration);
        console.log("[QUANTUM_STATE: PERTURBATION_FLOW] System perturbed to ".concat(targetCoherence, " for ").concat(duration, " cycles"));
        this.emit('systemPerturbed', { targetCoherence: targetCoherence, duration: duration });
    };
    /**
     * Updates the coherence target
     */
    MetaOrchestrator.prototype.updateCoherenceTarget = function (target) {
        ouroborosService.updateParameters({ targetCoherence: target });
        console.log("[QUANTUM_STATE: UPDATE_FLOW] Coherence target updated to ".concat(target));
        this.emit('coherenceTargetUpdated', target);
    };
    /**
     * Gets the current QCTF value
     */
    MetaOrchestrator.prototype.getQCTF = function () {
        return ouroborosService.calculateQCTF();
    };
    /**
     * Gets the current coherence value
     * This method is used by the perturbation test system to intercept and modify coherence values
     * during validation experiments
     */
    MetaOrchestrator.prototype.getCoherence = function () {
        return ouroborosService.getCurrentState().coherence;
    };
    /**
     * Calculates QCTF with custom parameters
     */
    MetaOrchestrator.prototype.calculateQCTF = function (params) {
        if (params === void 0) { params = {}; }
        return ouroborosService.calculateQCTF(params);
    };
    /**
     * Starts the Ouroboros service
     */
    MetaOrchestrator.prototype.start = function () {
        ouroborosService.start();
        console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Meta-Orchestrator started');
        this.emit('started');
    };
    /**
     * Stops the Ouroboros service
     */
    MetaOrchestrator.prototype.stop = function () {
        ouroborosService.stop();
        console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Meta-Orchestrator stopped');
        this.emit('stopped');
    };
    /**
     * Sets the experimental manager for integration with experiment handlers
     * This method allows external experimental systems to integrate with the orchestrator
     *
     * @param experimentalManager The experimental manager instance to integrate
     */
    MetaOrchestrator.prototype.setExperimentalManager = function (experimentalManager) {
        console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Experimental manager attached to Meta-Orchestrator');
        this.emit('experimentalManagerSet', experimentalManager);
    };
    /**
     * Adds a message handler function for WebSocket messages
     * This method allows WebSocket handlers to register their message processing functions
     *
     * @param handler The message handler function to add
     */
    MetaOrchestrator.prototype.addMessageHandler = function (handler) {
        console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Message handler added to Meta-Orchestrator');
        this.emit('messageHandlerAdded', handler);
    };
    /**
     * Adds a variant to the system (legacy compatibility method)
     * Transforms the legacy variant format to the new Variant interface
     *
     * @param variantData Legacy variant data
     * @returns The created variant
     */
    MetaOrchestrator.prototype.addVariant = function (variantData) {
        // Map legacy variant data to new Variant interface
        var variant = {
            id: variantData.id || "variant-".concat(Date.now()),
            name: variantData.name || "Variant ".concat(Date.now().toString().slice(-4)),
            type: variantData.type || 'generic',
            parameters: __assign({ qctf: variantData.qctf || 0, theta: variantData.theta || 0, entropy: variantData.entropy || 0, plugins: variantData.plugins || [], generation: variantData.generation || 0 }, variantData),
            activation: variantData.weight || 1.0,
            isActive: true,
            metadata: {
                timestamp: variantData.timestamp || Date.now(),
                legacy: true
            }
        };
        return this.registerVariant(variant);
    };
    /**
     * Calculate the weighted 5D meta-orchestration QCTF value
     * QCTF_5D(t) = ∑_{i=1}^{n} w_i(t) · QCTF_variant_i(t)
     *
     * @returns The calculated 5D QCTF value
     */
    MetaOrchestrator.prototype.calculate5DQCTF = function () {
        var _a;
        var variants = this.getAllVariants();
        if (variants.length === 0)
            return 0.75; // Default to optimal coherence value
        var qctf5D = 0;
        var weightSum = 0;
        for (var _i = 0, variants_1 = variants; _i < variants_1.length; _i++) {
            var variant = variants_1[_i];
            var qctfValue = ((_a = variant.parameters) === null || _a === void 0 ? void 0 : _a.qctf) || 0.75;
            var weight = variant.activation || 1.0;
            qctf5D += weight * qctfValue;
            weightSum += weight;
        }
        // Normalize if needed
        return weightSum > 0 ? qctf5D / weightSum : 0.75;
    };
    /**
     * Resonate variants with each other to update resonance values
     * This function calculates the resonance between all active variants
     * and updates their weights based on the resonance values
     */
    MetaOrchestrator.prototype.resonateVariants = function () {
        var _a, _b;
        var variants = this.getActiveVariants();
        if (variants.length <= 1)
            return; // No resonance with less than 2 variants
        console.log("[QUANTUM_STATE: RESONANCE_FLOW] Resonating ".concat(variants.length, " active variants"));
        // Create a map to store resonance values for each variant
        var resonanceMap = new Map();
        // Calculate resonance between all variant pairs
        for (var i = 0; i < variants.length; i++) {
            for (var j = i + 1; j < variants.length; j++) {
                var v1 = variants[i];
                var v2 = variants[j];
                // Calculate resonance value using a simple coherence formula
                // In a real implementation, this would use the resonance formula from qctf-meta.ts
                var coherenceDiff = Math.abs((((_a = v1.parameters) === null || _a === void 0 ? void 0 : _a.qctf) || 0.75) - (((_b = v2.parameters) === null || _b === void 0 ? void 0 : _b.qctf) || 0.75));
                var resonance = 1 - (coherenceDiff / 0.75);
                // Add resonance to both variants' totals
                resonanceMap.set(v1.id, (resonanceMap.get(v1.id) || 0) + resonance);
                resonanceMap.set(v2.id, (resonanceMap.get(v2.id) || 0) + resonance);
            }
        }
        // Normalize and update weights for each variant
        for (var _i = 0, variants_2 = variants; _i < variants_2.length; _i++) {
            var variant = variants_2[_i];
            // Get total resonance and normalize by number of other variants
            var totalResonance = resonanceMap.get(variant.id) || 0;
            var normalizedResonance = variants.length > 1 ? totalResonance / (variants.length - 1) : 0;
            // Update variant with resonance value
            this.updateVariant(variant.id, {
                activation: 0.25 + (0.75 * normalizedResonance) // Scale to range 0.25-1.0
            });
        }
        this.emit('variantsResonated');
    };
    /**
     * Run a cycle in the orchestrator
     * This method is used by the validation process to trigger a cycle in the system
     * and collect metrics for validation purposes
     *
     * @returns The current system state after running the cycle
     */
    MetaOrchestrator.prototype.runCycle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qctf, ouroborosState, systemMetrics;
            return __generator(this, function (_a) {
                // Update system state to simulate a cycle
                this.updateSystemState();
                // Resonate variants with each other
                this.resonateVariants();
                qctf = this.getQCTF();
                ouroborosState = ouroborosService.getCurrentState();
                systemMetrics = {
                    CTF: qctf,
                    coherence: ouroborosState.coherence,
                    systemCoherence: ouroborosState.coherence, // For compatibility with validation scripts
                    phase: ouroborosState.phase,
                    stabilityFactor: ouroborosService.getCoherenceStability(20),
                    variantCount: this.getActiveVariants().length,
                    timestamp: Date.now()
                };
                console.log("[QUANTUM_STATE: CYCLE_FLOW] Completed system cycle - Coherence: ".concat(ouroborosState.coherence.toFixed(4), ", QCTF: ").concat(qctf.toFixed(4)));
                // Emit cycle completed event
                this.emit('cycleCompleted', {
                    metrics: systemMetrics,
                    timestamp: Date.now()
                });
                // Return the state for validation
                return [2 /*return*/, {
                        metrics: systemMetrics
                    }];
            });
        });
    };
    /**
     * Get system metrics for validation
     *
     * @returns Current system metrics
     */
    MetaOrchestrator.prototype.getSystemMetrics = function () {
        // Update system state to ensure we have the latest metrics
        this.updateSystemState();
        // Get the current state of the Ouroboros service
        var ouroborosState = ouroborosService.getCurrentState();
        // Return system metrics
        return {
            CTF: this.getQCTF(),
            coherence: ouroborosState.coherence,
            systemCoherence: ouroborosState.coherence, // For compatibility with validation scripts
            phase: ouroborosState.phase,
            stabilityFactor: ouroborosService.getCoherenceStability(20),
            variantCount: this.getActiveVariants().length,
            timestamp: Date.now()
        };
    };
    return MetaOrchestrator;
}(EventEmitter));
export { MetaOrchestrator };
// Export a singleton instance
export var metaOrchestrator = new MetaOrchestrator();
