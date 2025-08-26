/**
 * Quantum Coherence Threshold Formula (QCTF) Plugin System
 * [QUANTUM_STATE: FOUNDATIONAL_FLOW]
 *
 * This file implements the modular plugin architecture for the QCTF formula,
 * enabling the Dynamic Quantum Bifurcation Engine at θ=0.5
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Pendulum Plugin - Implements the |θ - 0.5| instability factor
 *
 * This plugin creates a pendulum-like behavior where the system becomes
 * maximally unstable at θ=0.5 (perfect balance between yang/yin)
 */
export var pendulumPlugin = {
    name: "pendulum",
    description: "Implements inverse pendulum dynamics with θ=0.5 as the unstable point",
    enabled: true,
    priority: 10,
    apply: function (qctf, params) {
        // Calculate bifurcation coefficient (distance from θ=0.5)
        var bifurcationFactor = Math.abs(params.theta - 0.5);
        // Apply the pendulum effect (maximum at θ=0,1; minimum at θ=0.5)
        return qctf * bifurcationFactor;
    }
};
/**
 * Bifurcation Engine Plugin - Creates variant generation at θ=0.5
 *
 * This plugin implements the Quantum Bifurcation Engine, which generates
 * system variants at θ=0.5 using tanh and golden ratio amplification
 */
export var bifurcationPlugin = {
    name: "bifurcation",
    description: "Quantum Bifurcation Engine with variant generation at θ=0.5",
    enabled: true,
    priority: 20,
    apply: function (qctf, params) {
        // Golden ratio for amplification
        var k = 1.618;
        // Calculate bifurcation coefficient (distance from θ=0.5)
        var bifurcationFactor = Math.abs(params.theta - 0.5);
        // Apply hyperbolic tangent to bound output to [-1,1] with golden ratio amplification
        return Math.tanh(k * qctf * bifurcationFactor);
    }
};
/**
 * Dynamic Damping Plugin - Reduces stability near θ=0.5
 *
 * This plugin implements dynamic damping that decreases near θ=0.5,
 * allowing the system to oscillate more freely at the bifurcation point
 */
export var dynamicDampingPlugin = {
    name: "dynamicDamping",
    description: "Dynamic damping that reduces near θ=0.5 to amplify oscillations",
    enabled: true,
    priority: 30,
    apply: function (qctf, params) {
        // Base damping coefficient
        var D_0 = 1.0;
        // Calculate position-dependent damping factors
        // (damping reduces as we approach θ=0.5 and entropy=0.5)
        var thetaDamping = 1 - Math.abs(params.theta - 0.5);
        var entropyDamping = 1 - Math.abs(params.entropy - 0.5);
        // Combined damping coefficient (minimum at θ=0.5, entropy=0.5)
        var D = D_0 * (1 - thetaDamping * entropyDamping);
        // Apply damping to QCTF value (less damping = larger oscillations)
        return qctf / Math.max(D, 0.1); // Prevent division by values too close to zero
    }
};
/**
 * Meta-Orchestration Plugin - Implements 5D resonance dynamics
 *
 * This plugin integrates the 5D Meta-Orchestration layer that allows
 * multiple QCTF variants to resonate, adapt, and evolve, creating a
 * self-improving system that transcends traditional orchestration.
 */
export var metaOrchestrationPlugin = {
    name: "metaOrchestration",
    description: "5D Meta-Orchestration with variant resonance and evolution",
    enabled: true,
    priority: 5, // Highest priority - runs first
    apply: function (qctf, params) {
        // Meta-orchestration effect is proportional to the system's complexity
        // The closer to the bifurcation point (θ=0.5), the stronger the effect
        var complexityFactor = 1 - 2 * Math.abs(params.theta - 0.5);
        // Apply golden ratio amplification (φ ≈ 0.618)
        var phi = 0.618;
        // Meta effect scales with entropy and complexity
        var metaEffect = params.entropy * complexityFactor * phi;
        // Apply meta-orchestration effect
        // - For high θ (yin/chaos): amplify effect
        // - For low θ (yang/order): dampen effect
        return params.theta > 0.5
            ? qctf * (1 + metaEffect) // Amplify for chaos
            : qctf / (1 + metaEffect); // Dampen for order
    }
};
/**
 * Torus Oscillator Plugin - Implements 70/30 fractal scaling
 *
 * This plugin implements the coder's insight on 70/30 chaos/order balance,
 * creating a torus-like oscillatory behavior with fractal self-similarity.
 */
export var torusOscillatorPlugin = {
    name: "torusOscillator",
    description: "Hyperdimensional torus oscillator with 70/30 fractal scaling",
    enabled: true,
    priority: 25,
    apply: function (qctf, params) {
        // Implement the 70/30 balance discovered by the coder
        var chaosWeight = 0.7;
        var orderWeight = 0.3;
        // Calculate fractal scaling based on distance from ideal 70/30 split
        var idealTheta = 0.7; // 70% chaos-weight
        var fractalFactor = 1 - Math.abs(params.theta - idealTheta) / 0.5;
        // Apply fractal oscillation based on the 70/30 principle
        if (params.theta > 0.5) {
            // Chaos-dominant: Apply 70% scaled effect
            return qctf * (1 + chaosWeight * fractalFactor);
        }
        else {
            // Order-dominant: Apply 30% scaled effect
            return qctf * (1 + orderWeight * fractalFactor);
        }
    }
};
/**
 * Chaos Engine Plugin - Amplifies system entropy for stress testing
 *
 * This plugin intentionally increases entropy and chaotic behavior
 * to stress-test the system and discover edge cases.
 */
export var chaosEnginePlugin = {
    name: "chaosEngine",
    description: "Amplifies entropy and chaos for system stress testing",
    enabled: false, // Disabled by default - enable only for testing
    priority: 40,
    apply: function (qctf, params) {
        // Chaos amplification is proportional to current θ
        var chaosAmplifier = 1 + params.theta;
        // Apply non-linear chaos injection
        return qctf * chaosAmplifier * (1 + Math.sin(qctf * 5));
    }
};
/**
 * Spaghetti Mode Plugin - Random exploration of parameter space
 *
 * This plugin introduces controlled randomness to explore
 * unexpected connections and configurations.
 */
export var spaghettiModePlugin = {
    name: "spaghettiMode",
    description: "Random exploration of parameter space for discovery",
    enabled: false, // Disabled by default - use carefully
    priority: 50,
    apply: function (qctf, params) {
        // Generate pseudo-random factor based on current time
        var randomFactor = Math.sin(Date.now() / 1000) * 0.3;
        // Apply random perturbation to QCTF
        return qctf * (1 + randomFactor);
    }
};
/**
 * Core set of plugins for the QCTF system
 */
export var corePlugins = [
    metaOrchestrationPlugin, // 5D Meta-Orchestration
    pendulumPlugin, // Inverse pendulum at θ=0.5
    bifurcationPlugin, // Variant generation at θ=0.5
    torusOscillatorPlugin, // 70/30 fractal scaling
    dynamicDampingPlugin // Reduced damping at θ=0.5
];
/**
 * Registry of all available plugins
 */
export var pluginRegistry = new Map([
    [metaOrchestrationPlugin.name, metaOrchestrationPlugin],
    [pendulumPlugin.name, pendulumPlugin],
    [bifurcationPlugin.name, bifurcationPlugin],
    [torusOscillatorPlugin.name, torusOscillatorPlugin],
    [dynamicDampingPlugin.name, dynamicDampingPlugin],
    [chaosEnginePlugin.name, chaosEnginePlugin],
    [spaghettiModePlugin.name, spaghettiModePlugin]
]);
/**
 * Calculate the Yang component (order) of the QCTF
 */
export function calculateYangComponent(params) {
    var EPSILON = 1e-6;
    // Yang (order) component: Q_yang = (GEF * QEAI * CI) / sqrt(10 * entropy + ε)
    var coherence = params.gef * params.qeai * params.ci;
    return coherence / Math.sqrt(10 * params.entropy + EPSILON);
}
/**
 * Calculate the Yin component (chaos) of the QCTF
 */
export function calculateYinComponent(params) {
    var EPSILON = 1e-6;
    // Yin (chaos) component: Q_yin = sqrt(entropy + ε) / ((1-GEF) * (1-QEAI) * (1-CI))
    var disorder = (1 - params.gef) * (1 - params.qeai) * (1 - params.ci);
    return Math.sqrt(params.entropy + EPSILON) / Math.max(disorder, EPSILON);
}
/**
 * Calculate the minimal core QCTF value based on θ-weighted blend of Yang and Yin
 */
export function calculateCoreQCTF(params) {
    // Calculate Yang (order) and Yin (chaos) components
    var Q_yang = calculateYangComponent(params);
    var Q_yin = calculateYinComponent(params);
    // Basic θ-weighted linear combination
    return (1 - params.theta) * Q_yang + params.theta * Q_yin;
}
/**
 * Apply a single plugin to the QCTF value
 */
export function applyPlugin(qctf, plugin, params) {
    if (!plugin.enabled)
        return qctf;
    return plugin.apply(qctf, params);
}
/**
 * Apply a sequence of plugins to the QCTF value
 */
export function applyPlugins(qctf, plugins, params) {
    var result = qctf;
    var appliedPlugins = [];
    // Sort plugins by priority
    var sortedPlugins = __spreadArray([], plugins, true).sort(function (a, b) { return a.priority - b.priority; });
    // Apply each enabled plugin in priority order
    for (var _i = 0, sortedPlugins_1 = sortedPlugins; _i < sortedPlugins_1.length; _i++) {
        var plugin = sortedPlugins_1[_i];
        if (plugin.enabled) {
            result = plugin.apply(result, params);
            appliedPlugins.push(plugin.name);
        }
    }
    return { qctf: result, appliedPlugins: appliedPlugins };
}
/**
 * Convert legacy QCTFData to streamlined QCTFParams
 */
export function convertLegacyDataToParams(qctfData, theta) {
    // Extract active toggles
    var activeToggles = Object.entries(qctfData.toggles)
        .filter(function (_a) {
        var _ = _a[0], state = _a[1];
        return state.active;
    })
        .map(function (_a) {
        var name = _a[0], _ = _a[1];
        return name;
    });
    return {
        theta: theta,
        gef: qctfData.gef,
        qeai: qctfData.qeai,
        ci: qctfData.ci,
        entropy: qctfData.entropy,
        activeToggles: activeToggles,
        moduleCoherence: qctfData.moduleCoherence
    };
}
/**
 * Main calculation function for the QCTF formula with plugins
 */
export function calculateQCTFWithPlugins(params, plugins) {
    if (plugins === void 0) { plugins = corePlugins; }
    // Calculate raw QCTF using minimal core formula
    var rawQCTF = calculateCoreQCTF(params);
    // Initialize results with variant-specific calculations
    var results = {
        raw: rawQCTF,
        final: rawQCTF, // Will be updated after plugins
        pendulum: applyPlugin(rawQCTF, pendulumPlugin, params),
        bifurcation: applyPlugin(rawQCTF, bifurcationPlugin, params),
        activePlugins: [],
        timestamp: new Date().toISOString()
    };
    // Apply all enabled plugins
    var _a = applyPlugins(rawQCTF, plugins, params), finalQCTF = _a.qctf, appliedPlugins = _a.appliedPlugins;
    results.final = finalQCTF;
    results.activePlugins = appliedPlugins;
    return results;
}
