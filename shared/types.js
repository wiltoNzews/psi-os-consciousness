/**
 * Shared Types for WiltonOS
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 *
 * This file contains shared type definitions used throughout the application,
 * particularly for the 5D Meta-Orchestration system and QCTF calculations.
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
/**
 * Convert a basic Variant to a LokiVariant with reasonable defaults
 */
export function variantToLokiVariant(variant) {
    return __assign(__assign({}, variant), { theta: 0.5, qeai: variant.eai !== undefined ? variant.eai : 0.95, plugins: [], weight: 1.0, generation: 0 });
}
/**
 * Convert a LokiVariant to a basic Variant
 */
export function lokiVariantToVariant(lokiVariant) {
    var id = lokiVariant.id, name = lokiVariant.name, qctf = lokiVariant.qctf, entropy = lokiVariant.entropy, timestamp = lokiVariant.timestamp, state = lokiVariant.state;
    return {
        id: id,
        name: name || "Variant-".concat(id.substring(0, 8)), // Use name or generate from ID
        qctf: qctf,
        entropy: entropy,
        eai: lokiVariant.qeai, // Map qeai to eai for compatibility
        timestamp: timestamp,
        state: state,
    };
}
