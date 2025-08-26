/**
 * QCTF Meta-Layer for 5D Resonance Mechanics
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 *
 * This file implements the core resonance mechanics for the 5D meta-orchestration layer.
 * It provides refined versions of the resonance calculations, variant generation logic,
 * and helpers for implementing the Resonance heatmap and dashboard visualizations.
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
import { calculateQCTFWithPlugins } from './qctf-plugins.js';
/**
 * Enhanced resonance calculation with temporal decay
 *
 * Implements the formula:
 * R_{ij}(t) = [0.618 * (1 - |QCTF_i - QCTF_j|) + 0.382 * (1 - |Ψ_i - Ψ_j|)] * e^(-Δt/τ)
 *
 * @param v1 First variant
 * @param v2 Second variant
 * @param decayTimeMs Temporal decay constant in milliseconds (default: 60000 = 1 minute)
 * @returns Resonance value between 0 and 1
 */
export function calculateResonance(v1, v2, decayTimeMs) {
    if (decayTimeMs === void 0) { decayTimeMs = 60000; }
    // Calculate alignment in QCTF output (primary factor)
    var qctfDiff = Math.abs(v1.qctf - v2.qctf);
    var qctfAlignment = 1 - Math.min(1, qctfDiff); // Bounded [0,1]
    // Calculate alignment in entropy (secondary factor)
    var entropyDiff = Math.abs(v1.entropy - v2.entropy);
    var entropyAlignment = 1 - Math.min(1, entropyDiff); // Bounded [0,1]
    // Calculate time decay factor (recent interactions matter more)
    var timeDiffMs = Math.abs(v1.timestamp - v2.timestamp);
    var timeDiffSec = timeDiffMs / 1000;
    var decayFactor = Math.exp(-timeDiffSec / (decayTimeMs / 1000)); // τ = 60s by default
    // Apply golden ratio weighting (φ ≈ 0.618 for QCTF, 1-φ ≈ 0.382 for entropy)
    // and multiply by decay factor to prioritize recent interactions
    return (0.618 * qctfAlignment + 0.382 * entropyAlignment) * decayFactor;
}
/**
 * Generate type designation for a variant based on its parameters
 */
export function determineVariantType(variant) {
    // Determine variant type based on theta and plugins
    if (variant.theta < 0.4)
        return 'stability';
    if (variant.theta > 0.6)
        return 'chaos';
    if (Math.abs(variant.theta - 0.5) < 0.05)
        return 'bifurcation';
    // Check for ethics-focused variant
    var ethicsPlugins = ['quantumEthicalGuidance', 'ethicalAlignmentPlugin'];
    if (variant.plugins && variant.plugins.some(function (p) { return ethicsPlugins.includes(p); }))
        return 'ethics';
    return 'unknown';
}
/**
 * Generate resonance heatmap data from a list of variants
 */
export function generateResonanceHeatmap(variants) {
    // Prepare variant data with types
    var variantData = variants.map(function (v) { return ({
        id: v.id,
        qctf: v.qctf,
        entropy: v.entropy,
        theta: v.theta,
        weight: v.weight,
        type: determineVariantType(v)
    }); });
    // Calculate resonance between all pairs
    var resonanceMatrix = [];
    for (var i = 0; i < variants.length; i++) {
        for (var j = i + 1; j < variants.length; j++) {
            var resonance = calculateResonance(variants[i], variants[j]);
            resonanceMatrix.push({
                v1: variants[i].id,
                v2: variants[j].id,
                resonance: resonance
            });
        }
    }
    return {
        variants: variantData,
        resonanceMatrix: resonanceMatrix,
        timestamp: Date.now()
    };
}
/**
 * Lean variant spawning function for use in the qctf calculator
 *
 * This is a simplified version of the spawnVariant function from variant-generator.ts
 * for use in environments where the full implementation is not needed.
 */
export function spawnLeanVariant(params) {
    // Only spawn near the bifurcation point (θ ≈ 0.5)
    var nearBifurcation = Math.abs(params.theta - 0.5) < 0.1;
    // Only spawn if entropy is sufficiently high
    if (nearBifurcation && params.entropy > 0.015) {
        // Calculate spawn probability (higher entropy = higher chance)
        var spawnProb = 1 - Math.exp(-params.entropy / 0.015);
        // Probabilistic spawning
        if (Math.random() < spawnProb) {
            // Perturb theta in either direction (± 0.1)
            var thetaDirection = Math.random() > 0.5 ? 1 : -1;
            var thetaPerturbation = thetaDirection * (Math.random() * 0.1);
            var newTheta = Math.max(0.1, Math.min(0.9, params.theta + thetaPerturbation));
            // Calculate QCTF with new parameters
            var variantParams = __assign(__assign({}, params), { theta: newTheta });
            var result = calculateQCTFWithPlugins(variantParams);
            // Generate a variant ID and name
            var variantId = "variant-".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 11));
            var variantName = "Variant-".concat(Math.random().toString(36).slice(2, 6).toUpperCase());
            // Create the new variant
            return {
                id: variantId,
                name: variantName,
                qctf: result.final,
                theta: newTheta,
                entropy: params.entropy,
                qeai: params.qeai || 0.95, // Default to high QEAI (ethical alignment)
                plugins: params.activeToggles || [],
                weight: 1.0,
                timestamp: Date.now(),
                generation: 0
            };
        }
    }
    return null;
}
/**
 * Class for tracking resonance events and broadcasting via WebSocket
 */
var ResonanceTracker = /** @class */ (function () {
    function ResonanceTracker(websocketInterface, highResonanceThreshold) {
        if (highResonanceThreshold === void 0) { highResonanceThreshold = 0.8; }
        this.ws = websocketInterface;
        this.highResonanceThreshold = highResonanceThreshold;
        this.resonanceCache = new Map();
        this.lastUpdate = Date.now();
    }
    /**
     * Track resonance between all variants and broadcast high resonance events
     */
    ResonanceTracker.prototype.trackResonance = function (variants) {
        if (variants.length <= 1)
            return;
        // Clear cache if it's been more than 5 minutes
        var now = Date.now();
        if (now - this.lastUpdate > 5 * 60 * 1000) {
            this.resonanceCache.clear();
            this.lastUpdate = now;
        }
        // Check all variant pairs
        for (var i = 0; i < variants.length; i++) {
            for (var j = i + 1; j < variants.length; j++) {
                var v1 = variants[i];
                var v2 = variants[j];
                // Calculate resonance
                var resonance = calculateResonance(v1, v2);
                // Generate cache key
                var cacheKey = [v1.id, v2.id].sort().join(':');
                // Check if this is a significant change or first calculation
                var prevResonance = this.resonanceCache.get(cacheKey) || 0;
                var isSignificantChange = Math.abs(resonance - prevResonance) > 0.1;
                // Update cache
                this.resonanceCache.set(cacheKey, resonance);
                // Broadcast high resonance events or significant changes
                if ((resonance > this.highResonanceThreshold) || isSignificantChange) {
                    var event_1 = {
                        type: 'resonance_detected',
                        timestamp: now,
                        data: {
                            v1: {
                                id: v1.id,
                                qctf: v1.qctf,
                                theta: v1.theta,
                                entropy: v1.entropy,
                                qeai: v1.qeai || 0.95,
                                type: determineVariantType(v1)
                            },
                            v2: {
                                id: v2.id,
                                qctf: v2.qctf,
                                theta: v2.theta,
                                entropy: v2.entropy,
                                qeai: v2.qeai || 0.95,
                                type: determineVariantType(v2)
                            },
                            resonance: resonance,
                            highResonance: resonance > this.highResonanceThreshold,
                            change: resonance - prevResonance
                        }
                    };
                    if (this.ws) {
                        this.ws.broadcast('resonance_event', event_1);
                    }
                }
            }
        }
    };
    return ResonanceTracker;
}());
export { ResonanceTracker };
/**
 * Calculate the weighted 5D meta-orchestration QCTF value
 * QCTF_5D(t) = ∑_{i=1}^{n} w_i(t) · QCTF_variant_i(t)
 */
export function calculate5DQCTF(variants) {
    if (variants.length === 0)
        return 0;
    var qctf5D = 0;
    var weightSum = 0;
    for (var _i = 0, variants_1 = variants; _i < variants_1.length; _i++) {
        var variant = variants_1[_i];
        qctf5D += variant.weight * variant.qctf;
        weightSum += variant.weight;
    }
    // Normalize if needed
    return weightSum > 0 ? qctf5D / weightSum : 0;
}
