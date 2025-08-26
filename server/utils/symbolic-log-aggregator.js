/**
 * Symbolic Log Aggregator
 *
 * Provides a singleton service to aggregate and analyze symbolic communication logs
 * for visualization and monitoring purposes.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// Export log symbols for cross-component usage (now defined inline in quantum-chunk-tracker.ts)
// Kept for compatibility with other components
export var LIFECYCLE_LOG_SYMBOL = '⚽️';
// Singleton instance
var instance = null;
/**
 * Parse a lifecycle log entry into a structured event
 * @param log The log message to parse
 * @returns Structured lifecycle event or null if not recognized
 *
 * NOTE: This function has been moved to the quantum-chunk-tracker.ts file for local usage
 * to avoid circular dependencies. This version is kept for compatibility with other components.
 */
export function parseLifecycleEvent(log) {
    // Only process lifecycle logs
    if (!log.includes("[".concat(LIFECYCLE_LOG_SYMBOL, "]"))) {
        return null;
    }
    // Extract the event text after the symbol marker
    var match = log.match(/\[⚽️\]\s+([\w]+):\s+(.*)/);
    if (!match)
        return null;
    var _ = match[0], component = match[1], eventData = match[2];
    // Parse the event data based on component and format
    if (component === 'QuantumChunkTracker') {
        if (eventData.startsWith('ChunkCreated=')) {
            var id = eventData.replace('ChunkCreated=', '');
            return { type: 'creation', id: id };
        }
        if (eventData.startsWith('ChunkRouted=')) {
            var parts = eventData.replace('ChunkRouted=', '').split(', Agent=');
            return {
                type: 'routing',
                id: parts[0],
                agent: parts[1]
            };
        }
        if (eventData.startsWith('ChunksEntangled=')) {
            var ids = eventData.replace('ChunksEntangled=', '').split(',');
            return {
                type: 'entanglement',
                id1: ids[0],
                id2: ids[1]
            };
        }
        if (eventData.startsWith('ChunkCollapsed=')) {
            var parts = eventData.replace('ChunkCollapsed=', '').split(', Possibility=');
            return {
                type: 'decoherence',
                id: parts[0],
                selectedPossibility: parts[1] !== 'unspecified' ? parts[1] : undefined
            };
        }
        if (eventData.startsWith('PipelineComplete=')) {
            var parts = eventData.replace('PipelineComplete=', '').split(', FinalState=');
            var timeMatch = parts[1].match(/, Time=(\d+)ms/);
            var finalState = parts[1];
            if (timeMatch) {
                finalState = parts[1].substring(0, parts[1].indexOf(', Time='));
            }
            return {
                type: 'pipeline_complete',
                id: parts[0],
                finalState: finalState !== 'unspecified' ? finalState : undefined
            };
        }
    }
    // No recognized pattern
    return null;
}
/**
 * Class that aggregates and analyzes symbolic communication logs
 */
var SymbolicLogAggregator = /** @class */ (function () {
    function SymbolicLogAggregator() {
        this.messages = [];
        this.symbols = [];
        this.agentCommunicationPatterns = new Map();
        // Usage statistics
        this.domainUsage = {};
        this.timelineUsage = {};
        this.symbolUsage = {};
        this.initializeSymbols();
    }
    /**
     * Get the singleton instance
     */
    SymbolicLogAggregator.getInstance = function () {
        if (!instance) {
            instance = new SymbolicLogAggregator();
        }
        return instance;
    };
    /**
     * Add a symbolic message to the aggregator
     */
    SymbolicLogAggregator.prototype.addMessage = function (message) {
        this.messages.push(message);
        // Update usage statistics
        this.updateUsageStatistics(message);
        // Update agent communication patterns
        if (message.sourceAgent && message.targetAgent) {
            this.updateAgentCommunicationPattern(message);
        }
    };
    /**
     * Get symbolic messages filtered by options
     */
    SymbolicLogAggregator.prototype.getSymbolicMessages = function (options) {
        if (options === void 0) { options = {}; }
        var filtered = this.messages;
        if (options.since) {
            filtered = filtered.filter(function (m) { return m.timestamp >= options.since; });
        }
        if (options.domain) {
            filtered = filtered.filter(function (m) { return m.domain === options.domain; });
        }
        if (options.timeline) {
            filtered = filtered.filter(function (m) { return m.timeline === options.timeline; });
        }
        if (options.sourceAgent) {
            filtered = filtered.filter(function (m) { return m.sourceAgent === options.sourceAgent; });
        }
        if (options.targetAgent) {
            filtered = filtered.filter(function (m) { return m.targetAgent === options.targetAgent; });
        }
        // Sort by most recent first
        filtered = filtered.sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); });
        // Apply limit
        if (options.limit && options.limit > 0) {
            filtered = filtered.slice(0, options.limit);
        }
        // Remove content if not requested
        if (!options.includeContent) {
            filtered = filtered.map(function (m) {
                var content = m.content, rest = __rest(m, ["content"]);
                return rest;
            });
        }
        return filtered;
    };
    /**
     * Get all defined symbols
     */
    SymbolicLogAggregator.prototype.getAllSymbols = function () {
        return this.symbols;
    };
    /**
     * Get agent communication statistics
     */
    SymbolicLogAggregator.prototype.getAgentCommunicationStats = function () {
        return Array.from(this.agentCommunicationPatterns.values());
    };
    /**
     * Get the total number of messages
     */
    SymbolicLogAggregator.prototype.getTotalMessageCount = function () {
        return this.messages.length;
    };
    /**
     * Get the most frequently used symbols
     */
    SymbolicLogAggregator.prototype.getTopSymbols = function (limit) {
        if (limit === void 0) { limit = 10; }
        return Object.entries(this.symbolUsage)
            .map(function (_a) {
            var symbol = _a[0], count = _a[1];
            return ({ symbol: symbol, count: count });
        })
            .sort(function (a, b) { return b.count - a.count; })
            .slice(0, limit);
    };
    /**
     * Get distribution of messages across domains
     */
    SymbolicLogAggregator.prototype.getDomainDistribution = function () {
        return this.domainUsage;
    };
    /**
     * Get distribution of messages across timelines
     */
    SymbolicLogAggregator.prototype.getTimelineDistribution = function () {
        return this.timelineUsage;
    };
    /**
     * Initialize the symbol definitions
     */
    SymbolicLogAggregator.prototype.initializeSymbols = function () {
        this.symbols = [
            {
                symbol: '⚽️',
                name: 'Lifecycle Event',
                description: 'Tracks the lifecycle of a quantum chunk',
                context: 'Quantum Chunk Processing',
                usageCount: 0
            },
            {
                symbol: '🥶',
                name: 'Logic Lockdown',
                description: 'A signal to stop and reflect on the current process',
                context: 'Quantum Signal',
                usageCount: 0
            },
            {
                symbol: '♻️',
                name: 'Refresh Signal',
                description: 'A signal to try a better approach',
                context: 'Quantum Signal',
                usageCount: 0
            },
            {
                symbol: '🌊',
                name: 'Flow State',
                description: 'Indicates system alignment and optimal processing',
                context: 'System State',
                usageCount: 0
            },
            {
                symbol: '🧩',
                name: 'Chunk Creation',
                description: 'Marks the creation of a new quantum chunk',
                context: 'Quantum Chunk Lifecycle',
                usageCount: 0
            },
            {
                symbol: '🔄',
                name: 'State Transition',
                description: 'Indicates a change in quantum state',
                context: 'Quantum State',
                usageCount: 0
            },
            {
                symbol: '🔗',
                name: 'Entanglement',
                description: 'Represents an entanglement between quantum chunks',
                context: 'Quantum Relationship',
                usageCount: 0
            },
            {
                symbol: '💎',
                name: 'Collapsed State',
                description: 'Indicates a quantum chunk has been collapsed to a definite outcome',
                context: 'Quantum Chunk Lifecycle',
                usageCount: 0
            }
        ];
    };
    /**
     * Update usage statistics based on a new message
     */
    SymbolicLogAggregator.prototype.updateUsageStatistics = function (message) {
        // Update domain usage
        this.domainUsage[message.domain] = (this.domainUsage[message.domain] || 0) + 1;
        // Update timeline usage
        this.timelineUsage[message.timeline] = (this.timelineUsage[message.timeline] || 0) + 1;
        // Update symbol usage
        this.symbolUsage[message.symbol] = (this.symbolUsage[message.symbol] || 0) + 1;
        // Update symbol definition usage count
        var symbolDef = this.symbols.find(function (s) { return s.symbol === message.symbol; });
        if (symbolDef) {
            symbolDef.usageCount++;
        }
    };
    /**
     * Update agent communication patterns based on a new message
     */
    SymbolicLogAggregator.prototype.updateAgentCommunicationPattern = function (message) {
        var key = "".concat(message.sourceAgent, "->").concat(message.targetAgent);
        var pattern = this.agentCommunicationPatterns.get(key);
        if (!pattern) {
            pattern = {
                sourceAgent: message.sourceAgent,
                targetAgent: message.targetAgent,
                messageCount: 0,
                symbolUsage: {}
            };
        }
        pattern.messageCount++;
        pattern.symbolUsage[message.symbol] = (pattern.symbolUsage[message.symbol] || 0) + 1;
        this.agentCommunicationPatterns.set(key, pattern);
    };
    return SymbolicLogAggregator;
}());
export { SymbolicLogAggregator };
// Export a function to get the singleton instance
export function getSymbolicLogAggregator() {
    return SymbolicLogAggregator.getInstance();
}
