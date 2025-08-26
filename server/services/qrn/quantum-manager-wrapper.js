/**
 * Quantum Agent Manager TypeScript Wrapper
 *
 * This module provides a TypeScript-friendly wrapper around the JavaScript
 * quantum agent manager implementation. It ensures proper type safety
 * for TypeScript modules that need to interact with the agent system.
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
// Dynamic import to resolve module type mismatch
// The real implementation is in the Javascript file
var QuantumAgentManagerImpl;
try {
    // Try to import from the relative path
    var module_1 = await import('./quantum-agent-manager.js');
    QuantumAgentManagerImpl = module_1.QuantumAgentManager;
}
catch (error) {
    console.error('Error importing QuantumAgentManager:', error);
    // Create a stub implementation for type compatibility
    var StubManager = /** @class */ (function () {
        function StubManager(options) {
            if (options === void 0) { options = {}; }
            this.agents = {};
            this.messageHistory = [];
            this.options = { maxHistoryEntries: 100, agentInitialization: 'lazy' };
            this.communicationBus = new Map();
            this.options = __assign(__assign({}, this.options), options);
            console.log('[STUB] Quantum Agent Manager initialized with stub implementation');
        }
        StubManager.prototype.getAgents = function () { return {}; };
        StubManager.prototype.getAgentStatus = function () { return "unknown"; };
        StubManager.prototype.getMessageHistory = function () { return []; };
        StubManager.prototype.getAgentInfo = function () { return {}; };
        StubManager.prototype.initializeStandardAgents = function () { return []; };
        StubManager.prototype.registerAgent = function () { return ""; };
        StubManager.prototype.sendMessage = function () { return null; };
        StubManager.prototype.broadcastMessage = function () { return {}; };
        StubManager.prototype.processChunk = function () {
            return { processingState: {} };
        };
        StubManager.prototype.deregisterAgent = function () { return false; };
        return StubManager;
    }());
    QuantumAgentManagerImpl = StubManager;
}
// Singleton instance for the agent manager
var instance = null;
/**
 * Get the singleton instance of the QuantumAgentManager
 * @returns The quantum agent manager instance
 */
export function getQuantumAgentManager() {
    if (!instance) {
        try {
            // Create instance from constructor (JavaScript options format is simple object)
            instance = new QuantumAgentManagerImpl({});
            // Ensure we have necessary methods
            if (!instance.getAgents && QuantumAgentManagerImpl.prototype.getAgents) {
                // Copy from prototype if missing
                instance.getAgents = QuantumAgentManagerImpl.prototype.getAgents.bind(instance);
            }
        }
        catch (error) {
            console.error('Error creating QuantumAgentManager instance:', error);
            // Return a compatible stub object
            instance = {
                agents: {},
                messageHistory: [],
                options: { maxHistoryEntries: 100, agentInitialization: 'lazy' },
                communicationBus: new Map(),
                getAgents: function () { return ({}); },
                getAgentStatus: function () { return "unknown"; },
                getMessageHistory: function () { return []; },
            };
        }
    }
    return instance;
}
/**
 * Create a new QuantumAgentManager instance
 * @param options Configuration options for the agent manager
 * @returns A new quantum agent manager instance
 */
export function createQuantumAgentManager(options) {
    if (options === void 0) { options = {}; }
    try {
        // Pass options directly to QuantumAgentManager constructor
        return new QuantumAgentManagerImpl(options);
    }
    catch (error) {
        console.error('Error creating new QuantumAgentManager instance:', error);
        // Return a compatible stub object
        return {
            agents: {},
            messageHistory: [],
            options: __assign(__assign({}, options), { maxHistoryEntries: 100, agentInitialization: 'lazy' }),
            communicationBus: new Map(),
            getAgents: function () { return ({}); },
            getAgentStatus: function () { return "unknown"; },
            getMessageHistory: function () { return []; },
        };
    }
}
