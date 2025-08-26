/**
 * Variant Generator for 5D Meta-Orchestration
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 *
 * This module implements the variant spawning logic for the Quantum Bifurcation Engine.
 * Variants are spawned when the system is near the bifurcation point (θ ≈ 0.5)
 * and entropy is sufficiently high.
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { calculateCoreQCTF } from './qctf-plugins.js';
// Default spawn conditions
var DEFAULT_SPAWN_CONDITIONS = {
    entropyThreshold: 0.015, // 90th percentile threshold
    thetaRange: 0.1, // θ in [0.4, 0.6]
    maxVariants: 10, // Prevent computational explosion
    maxGeneration: 3 // Limit recursion depth
};
/**
 * Generate a probabilistic spawn rate based on current entropy
 * Higher entropy = higher chance of spawning
 *
 * Enhanced formula:
 * P(spawn) = 1 - e^(-entropy / threshold) * [1 + 2 * max(0, entropy - 0.02)]
 *
 * This includes:
 * - Base probability from entropy level (exponential scaling)
 * - Novelty boost when entropy > 0.02 (doubles at high entropy)
 *
 * @param entropy Current entropy level
 * @param threshold Base entropy threshold
 * @returns Probability of spawning in range [0,1]
 */
function calculateSpawnProbability(entropy, threshold) {
    // Novelty boost factor (same as in resonance formula)
    var noveltyBoost = 1 + 2 * Math.max(0, entropy - 0.02);
    // Base probability with exponential scaling
    var baseProbability = 1 - Math.exp(-entropy / threshold);
    // Apply novelty boost to increase spawn chance at entropy spikes
    return Math.min(1, baseProbability * noveltyBoost);
}
/**
 * Spawn a new Loki variant if conditions are met
 *
 * Enhanced with:
 * 1. Autonomous spawning under non-critical conditions (entropy spikes)
 * 2. Direct bifurcation point targeting for strategic spawning
 * 3. Adaptive QEAI calculation based on system state
 * 4. Intelligent plugin inheritance with mutation
 *
 * @param params Current QCTF parameters
 * @param conditions Spawn conditions (optional)
 * @param parentId ID of parent variant (for recursive spawning)
 * @param generation Current generation (recursion depth)
 * @returns New variant or null if conditions not met
 */
export function spawnVariant(params, conditions, parentId, generation) {
    if (conditions === void 0) { conditions = {}; }
    if (generation === void 0) { generation = 0; }
    // Merge with default conditions
    var _a = __assign(__assign({}, DEFAULT_SPAWN_CONDITIONS), conditions), entropyThreshold = _a.entropyThreshold, thetaRange = _a.thetaRange, maxGeneration = _a.maxGeneration;
    var theta = params.theta, entropy = params.entropy;
    // Standard scenario: Check bifurcation point condition (θ ≈ 0.5)
    var nearBifurcation = Math.abs(theta - 0.5) < thetaRange;
    // Enhanced autonomous scenario: High entropy spike overrides bifurcation requirement
    // This allows the system to explore new configurations even when away from θ=0.5
    var entropySpike = entropy > entropyThreshold * 2;
    // Check conditions and respect max generation
    if ((nearBifurcation || entropySpike) && entropy > entropyThreshold && generation < maxGeneration) {
        // Calculate spawn probability (higher entropy = higher chance)
        var spawnProb = calculateSpawnProbability(entropy, entropyThreshold);
        // Probabilistic spawning
        if (Math.random() < spawnProb) {
            // Determine new theta:
            var newTheta = void 0;
            if (entropySpike && !nearBifurcation) {
                // During entropy spikes, actively push toward bifurcation point
                // This creates a natural gravity well around θ=0.5
                newTheta = theta + (0.5 - theta) * 0.4; // Move 40% closer to bifurcation point
            }
            else {
                // Regular theta perturbation when near bifurcation point
                var thetaDirection = Math.random() > 0.5 ? 1 : -1;
                var thetaPerturbation = thetaDirection * (Math.random() * thetaRange);
                newTheta = theta + thetaPerturbation;
            }
            // Ensure theta stays in valid range [0.1, 0.9]
            newTheta = Math.max(0.1, Math.min(0.9, newTheta));
            // Calculate core QCTF with new parameters
            var variantParams = __assign(__assign({}, params), { theta: newTheta });
            var qctfValue = calculateCoreQCTF(variantParams);
            // Adaptive QEAI calculation:
            // Variants closer to bifurcation have higher QEAI due to their strategic position
            var baseQEAI = params.qeai || 0.95;
            var bifurcationProximityBonus = 0.05 * (1 - Math.min(1, Math.abs(newTheta - 0.5) / 0.4));
            var adaptiveQEAI = Math.min(0.999, baseQEAI + bifurcationProximityBonus);
            // Intelligent plugin inheritance with mutation
            var parentPlugins = params.activeToggles || [];
            var pluginMutationRate = 0.15; // 15% chance of mutation per plugin
            // Copy parent plugins with possible mutations (add/remove)
            var variantPlugins = __spreadArray([], parentPlugins, true);
            // Randomly mutate plugins (add/remove based on entropy)
            if (Math.random() < pluginMutationRate * entropy * 10) {
                var availablePlugins = ["pendulum", "bifurcation", "resonance", "chaos", "structure", "ethical"];
                var randomPlugin = availablePlugins[Math.floor(Math.random() * availablePlugins.length)];
                if (variantPlugins.includes(randomPlugin)) {
                    // Remove plugin (if not critical)
                    if (randomPlugin !== "pendulum" && randomPlugin !== "ethical") {
                        variantPlugins.splice(variantPlugins.indexOf(randomPlugin), 1);
                    }
                }
                else {
                    // Add plugin
                    variantPlugins.push(randomPlugin);
                }
            }
            // Create and return the new variant
            return {
                id: "variant-".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 11)),
                name: "Variant-".concat(Math.random().toString(36).slice(2, 6)), // Generate a human-readable name
                qctf: qctfValue,
                theta: newTheta,
                entropy: entropy,
                qeai: adaptiveQEAI,
                plugins: variantPlugins,
                weight: 1.0, // Initial weight (will be adjusted by resonance)
                timestamp: Date.now(),
                parentId: parentId,
                generation: generation + 1
            };
        }
    }
    // Conditions not met, no variant spawned
    return null;
}
/**
 * Calculate enhanced resonance between two variants
 * Higher resonance indicates stronger alignment in behavior
 *
 * Enhanced Formula:
 * R = GEF * [0.5 * (1 - |QCTF_i - QCTF_j|) + 0.3 * (1 - |Ψ_i - Ψ_j|) + 0.2 * (1 - |QEAI_i - QEAI_j|)]
 *     * e^(-Δt/60) * (1 + 2 * max(0, Ψ_i - 0.02))
 *
 * Where:
 * - GEF is the system's Global Ethical Factor (assumed to be 1.0 if not provided)
 * - QCTF is the quantum coherence threshold factor
 * - Ψ is the entropy
 * - QEAI is the Quantum Ethical Alignment Index
 * - Novelty Boost: 2 * max(0, Ψ_i - 0.02) doubles resonance at high entropy
 */
export function calculateResonance(v1, v2, gef, decayTimeMs) {
    if (gef === void 0) { gef = 1.0; }
    if (decayTimeMs === void 0) { decayTimeMs = 60000; }
    // Calculate alignment in QCTF output (primary factor)
    var qctfDiff = Math.abs(v1.qctf - v2.qctf);
    var qctfAlignment = 1 - Math.min(1, qctfDiff); // Bounded [0,1]
    // Calculate alignment in entropy (secondary factor)
    var entropyDiff = Math.abs(v1.entropy - v2.entropy);
    var entropyAlignment = 1 - Math.min(1, entropyDiff); // Bounded [0,1]
    // Calculate alignment in QEAI values (ethical alignment)
    var qeaiDiff = Math.abs((v1.qeai || 0.95) - (v2.qeai || 0.95));
    var qeaiAlignment = 1 - Math.min(1, qeaiDiff); // Bounded [0,1]
    // Calculate time decay factor (recent interactions matter more)
    var timeDiff = Math.abs(v1.timestamp - v2.timestamp);
    var decayFactor = Math.exp(-timeDiff / decayTimeMs);
    // Calculate novelty boost based on entropy level
    // When entropy > 0.02, provides additional resonance boost
    var noveltyBoost = 1 + 2 * Math.max(0, v1.entropy - 0.02);
    // Updated weight distribution:
    // 50% QCTF alignment, 30% entropy alignment, 20% QEAI alignment
    var amplitude = 0.5 * qctfAlignment + 0.3 * entropyAlignment + 0.2 * qeaiAlignment;
    // Apply GEF multiplier, decay factor, and novelty boost
    return gef * amplitude * decayFactor * noveltyBoost;
}
