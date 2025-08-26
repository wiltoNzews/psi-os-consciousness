/**
 * Quantum Glossary
 *
 * A centralized logging and context management system for quantum components.
 * Provides contextual tagging, error reporting, and quantum state tracking.
 *
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */
// Define quantum states
export var QuantumState;
(function (QuantumState) {
    QuantumState["COHERENT"] = "COHERENT";
    QuantumState["DECOHERENT"] = "DECOHERENT";
    QuantumState["SUPERPOSITION"] = "SUPERPOSITION";
    QuantumState["ENTANGLED"] = "ENTANGLED";
    QuantumState["BIFROST_BRIDGE"] = "BIFROST_BRIDGE";
    QuantumState["QUANTUM_ANNEALING"] = "QUANTUM_ANNEALING";
    QuantumState["WAVE_FUNCTION_COLLAPSE"] = "WAVE_FUNCTION_COLLAPSE";
    QuantumState["TRANSCENDENT_FLOW"] = "TRANSCENDENT_FLOW";
})(QuantumState || (QuantumState = {}));
// Log levels
export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["QUANTUM"] = "QUANTUM"; // Special level for quantum-specific logs
})(LogLevel || (LogLevel = {}));
/**
 * Quantum Glossary Service
 * Provides logging and contextual information for quantum components
 */
var QuantumGlossary = /** @class */ (function () {
    /**
     * Create a new QuantumGlossary instance
     * Use getInstance() instead for singleton pattern
     */
    function QuantumGlossary() {
        this.currentState = QuantumState.COHERENT;
        this.contextTags = new Set();
        this.logEntries = []; // Would use proper type in full implementation
        // Use singleton pattern
        if (QuantumGlossary.instance) {
            return QuantumGlossary.instance;
        }
        QuantumGlossary.instance = this;
        this.log(LogLevel.INFO, 'Quantum Glossary initialized');
    }
    /**
     * Get singleton instance of QuantumGlossary
     */
    QuantumGlossary.getInstance = function () {
        if (!QuantumGlossary.instance) {
            QuantumGlossary.instance = new QuantumGlossary();
        }
        return QuantumGlossary.instance;
    };
    /**
     * Log a message with specified level
     *
     * @param level - Log level
     * @param message - Log message
     * @param data - Optional data to include
     */
    QuantumGlossary.prototype.log = function (level, message, data) {
        var timestamp = new Date();
        var entry = {
            timestamp: timestamp,
            level: level,
            message: message,
            state: this.currentState,
            contextTags: Array.from(this.contextTags),
            data: data
        };
        this.logEntries.push(entry);
        // Format the log message
        var formattedMessage = "[".concat(level, "] [").concat(this.currentState, "]");
        if (this.contextTags.size > 0) {
            formattedMessage += " [".concat(Array.from(this.contextTags).join(', '), "]");
        }
        formattedMessage += ": ".concat(message);
        // Output to console based on level
        switch (level) {
            case LogLevel.ERROR:
                console.error(formattedMessage);
                if (data)
                    console.error(data);
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage);
                if (data)
                    console.warn(data);
                break;
            case LogLevel.QUANTUM:
                console.log("\uD83D\uDD2E ".concat(formattedMessage));
                if (data)
                    console.log(data);
                break;
            case LogLevel.DEBUG:
                console.debug(formattedMessage);
                if (data)
                    console.debug(data);
                break;
            default:
                console.log(formattedMessage);
                if (data)
                    console.log(data);
        }
    };
    /**
     * Log an error with stack trace
     *
     * @param message - Error message
     * @param error - Error object
     */
    QuantumGlossary.prototype.logError = function (message, error) {
        this.log(LogLevel.ERROR, message, {
            error: error.message,
            stack: error.stack
        });
    };
    /**
     * Log a message with QUANTUM level
     *
     * @param message - Quantum message
     * @param data - Optional data
     */
    QuantumGlossary.prototype.logQuantum = function (message, data) {
        this.log(LogLevel.QUANTUM, message, data);
    };
    /**
     * Set current quantum state
     *
     * @param state - New quantum state
     */
    QuantumGlossary.prototype.setState = function (state) {
        var oldState = this.currentState;
        this.currentState = state;
        if (oldState !== state) {
            this.logQuantum("Quantum state transition: ".concat(oldState, " -> ").concat(state));
        }
    };
    /**
     * Get current quantum state
     *
     * @returns Current quantum state
     */
    QuantumGlossary.prototype.getState = function () {
        return this.currentState;
    };
    /**
     * Add context tag
     *
     * @param tag - Context tag to add
     */
    QuantumGlossary.prototype.addContextTag = function (tag) {
        this.contextTags.add(tag);
    };
    /**
     * Remove context tag
     *
     * @param tag - Context tag to remove
     */
    QuantumGlossary.prototype.removeContextTag = function (tag) {
        this.contextTags.delete(tag);
    };
    /**
     * Clear all context tags
     */
    QuantumGlossary.prototype.clearContextTags = function () {
        this.contextTags.clear();
    };
    /**
     * Set context tags (replacing existing ones)
     *
     * @param tags - New context tags
     */
    QuantumGlossary.prototype.setContextTags = function (tags) {
        this.contextTags = new Set(tags);
    };
    /**
     * Log message with new temporary context tag
     *
     * @param tag - Temporary context tag
     * @param message - Log message
     * @param level - Optional log level (default: INFO)
     * @param data - Optional data
     */
    QuantumGlossary.prototype.tagWithContext = function (message, level, data) {
        if (level === void 0) { level = LogLevel.INFO; }
        this.log(level, message, data);
    };
    /**
     * Get recent log entries
     *
     * @param count - Number of entries to retrieve (default: 100)
     * @param level - Optional filter by log level
     * @returns Recent log entries
     */
    QuantumGlossary.prototype.getRecentLogs = function (count, level) {
        if (count === void 0) { count = 100; }
        var filtered = this.logEntries;
        if (level) {
            filtered = filtered.filter(function (entry) { return entry.level === level; });
        }
        return filtered.slice(-count);
    };
    /**
     * Search logs for keyword
     *
     * @param keyword - Search keyword
     * @param maxResults - Maximum results to return (default: 100)
     * @returns Matching log entries
     */
    QuantumGlossary.prototype.searchLogs = function (keyword, maxResults) {
        if (maxResults === void 0) { maxResults = 100; }
        var lowerKeyword = keyword.toLowerCase();
        return this.logEntries
            .filter(function (entry) {
            return entry.message.toLowerCase().includes(lowerKeyword) ||
                (entry.data && JSON.stringify(entry.data).toLowerCase().includes(lowerKeyword));
        })
            .slice(-maxResults);
    };
    /**
     * Clear log history
     */
    QuantumGlossary.prototype.clearLogs = function () {
        this.logEntries = [];
        this.log(LogLevel.INFO, 'Log history cleared');
    };
    return QuantumGlossary;
}());
export { QuantumGlossary };
// Export singleton instance
export default QuantumGlossary.getInstance();
