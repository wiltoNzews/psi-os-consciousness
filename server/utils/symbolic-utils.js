/**
 * Symbolic Communication Protocol Utilities
 *
 * This module provides utilities for working with the standardized symbolic
 * communication format that provides clear contextual information for all
 * messages within the system.
 *
 * @see SYMBOL_DICTIONARY.md for full documentation on the symbolic protocol
 */
var _a;
// Import directly from schema-minimal for TypeScript type support
import { QuantumState } from '../../shared/schema-minimal.js';
// This module must remain compatible with the JS version in symbolic-utils.js
// The JS version has its own internal QuantumState definition to avoid import issues
/**
 * Maps QuantumState enum values to their symbolic state representation
 */
var QUANTUM_STATE_SYMBOLS = (_a = {},
    _a[QuantumState.SIM_FLOW] = 'S+',
    _a[QuantumState.SIM_ANTIFLOW] = 'S-',
    _a[QuantumState.SIM_PARTIAL] = 'S~',
    _a[QuantumState.REAL_FLOW] = 'R+',
    _a[QuantumState.REAL_ANTIFLOW] = 'R-',
    _a[QuantumState.REAL_PARTIAL] = 'R~',
    _a[QuantumState.TRANSITION_TO_REAL] = 'T>R',
    _a[QuantumState.TRANSITION_TO_SIM] = 'T>S',
    _a);
/**
 * Format a message with the appropriate symbolic prefix based on quantum state
 *
 * @param state The QuantumState enum value
 * @param message The message to format
 * @param domain Optional domain symbol (e.g., 💻, 🧪, 📊)
 * @param timeline Optional timeline identifier (defaults to α)
 * @returns Formatted message with symbolic prefix
 *
 * @example
 * // Basic usage
 * formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Task completed")
 * // Returns: "[α/S+] Task completed"
 *
 * @example
 * // With domain
 * formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Test passed", "🧪")
 * // Returns: "[α/S+/🧪] Test passed"
 *
 * @example
 * // With timeline and domain
 * formatWithSymbolicPrefix(QuantumState.REAL_FLOW, "Deployment successful", "🚀", "2025α")
 * // Returns: "[2025α/R+/🚀] Deployment successful"
 */
export function formatWithSymbolicPrefix(state, message, domain, timeline) {
    if (timeline === void 0) { timeline = 'α'; }
    // Get the symbolic state representation (e.g., "S+", "R-") 
    var stateSymbol = QUANTUM_STATE_SYMBOLS[state];
    // Construct the prefix with optional domain
    var prefix = domain
        ? "[".concat(timeline, "/").concat(stateSymbol, "/").concat(domain, "]")
        : "[".concat(timeline, "/").concat(stateSymbol, "]");
    return "".concat(prefix, " ").concat(message);
}
/**
 * Parse a message with symbolic prefix into its components
 *
 * @param formattedMessage The message with symbolic prefix
 * @returns Object containing timeline, state, domain, and the message
 *
 * @example
 * parseSymbolicPrefix("[α/S+/💻] Task completed")
 * // Returns: { timeline: "α", state: "S+", domain: "💻", message: "Task completed" }
 */
export function parseSymbolicPrefix(formattedMessage) {
    // Default return object
    var result = {
        message: formattedMessage
    };
    // Try to match the symbolic prefix pattern
    // The pattern matches Greek letters (α, β) and other special characters
    var match = formattedMessage.match(/^\[([\wα-ωΑ-Ω\d]+)\/([\w\+\-~>]+)(?:\/([^\]]+))?\]\s*(.*)/);
    if (match) {
        result.timeline = match[1];
        result.state = match[2];
        result.domain = match[3]; // This might be undefined if domain wasn't included
        result.message = match[4];
    }
    return result;
}
/**
 * Convert from legacy format to symbolic format
 *
 * @param legacyMessage The message with legacy prefix
 * @returns Message with symbolic prefix
 *
 * @example
 * convertLegacyToSymbolic("[QUANTUM_STATE: SIM_FLOW] Operation successful")
 * // Returns: "[α/S+] Operation successful"
 */
export function convertLegacyToSymbolic(legacyMessage) {
    // Map of legacy states to symbolic states
    var stateMap = {
        'SIM_FLOW': 'S+',
        'SIM_ANTIFLOW': 'S-',
        'SIM_PARTIAL': 'S~',
        'REAL_FLOW': 'R+',
        'REAL_ANTIFLOW': 'R-',
        'REAL_PARTIAL': 'R~',
        'TRANSITION_TO_REAL': 'T>R',
        'TRANSITION_TO_SIM': 'T>S'
    };
    // Try to match the legacy prefix pattern
    var match = legacyMessage.match(/^\[QUANTUM_STATE:\s*([A-Z_]+)\](.*)/);
    if (match && stateMap[match[1]]) {
        return "[\u03B1/".concat(stateMap[match[1]], "]").concat(match[2]);
    }
    // If no match or unknown state, return the original message
    return legacyMessage;
}
/**
 * Add a symbolic suffix to a message
 *
 * @param message The message
 * @param suffix The suffix symbol (e.g., ✅, ⚠️, 💡, ❓)
 * @returns Message with added suffix
 *
 * @example
 * addSymbolicSuffix("Task completed", "✅")
 * // Returns: "Task completed ✅"
 */
export function addSymbolicSuffix(message, suffix) {
    return "".concat(message, " ").concat(suffix);
}
/**
 * Create a symbolic domain reference for inline use
 *
 * @param referenceType The reference type identifier
 * @param reference The specific reference
 * @returns Formatted symbolic reference
 *
 * @example
 * createSymbolicReference("Δ", "Analysis")
 * // Returns: "{Δ:Analysis}"
 */
export function createSymbolicReference(referenceType, reference) {
    return "{".concat(referenceType, ":").concat(reference, "}");
}
