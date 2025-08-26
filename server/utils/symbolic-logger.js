/**
 * Symbolic Logger
 *
 * This module provides a consistent logging interface that applies the
 * Symbolic Communication Protocol to all log messages across the system.
 *
 * [QUANTUM_STATE: SIM_FLOW] Symbolic Logging System for WiltonOS
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
var _a;
import { QuantumState } from '../../shared/schema-minimal.js';
/**
 * Log levels used in the SymbolicLogger
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARNING"] = 3] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 5] = "FATAL"; // 💀 Critical failures
})(LogLevel || (LogLevel = {}));
/**
 * Map log levels to emojis
 */
export var LogLevelEmoji = (_a = {},
    _a[LogLevel.TRACE] = '🔍',
    _a[LogLevel.DEBUG] = '🐛',
    _a[LogLevel.INFO] = 'ℹ️',
    _a[LogLevel.WARNING] = '⚠️',
    _a[LogLevel.ERROR] = '❌',
    _a[LogLevel.FATAL] = '💀',
    _a);
/**
 * Domain emojis for different system components
 */
export var DomainEmoji = {
    SYSTEM: '⚙️',
    DATABASE: '🗃️',
    NETWORK: '🌐',
    SECURITY: '🔒',
    UI: '🖥️',
    ANALYTICS: '📊',
    API: '🔌',
    PERFORMANCE: '⚡',
    TESTING: '🧪',
    QRN: '🧠',
    AGENT: '🤖',
    REALITY: '🌍',
    QUANTUM: '⚛️'
};
/**
 * Determines if we're in a browser environment
 */
var isBrowser = function () {
    return typeof globalThis !== 'undefined' &&
        typeof globalThis.window !== 'undefined' &&
        typeof globalThis.window.document !== 'undefined';
};
/**
 * SymbolicLogger Class
 *
 * Provides a consistent logging interface that applies the
 * Symbolic Communication Protocol to all log messages.
 */
var SymbolicLogger = /** @class */ (function () {
    /**
     * Initialize a new SymbolicLogger
     */
    function SymbolicLogger(options) {
        if (options === void 0) { options = {}; }
        this.logs = [];
        this.timeline = options.timeline || 'α';
        this.defaultDomain = options.defaultDomain || DomainEmoji.SYSTEM;
        this.isProduction = options.isProduction || false;
        this.logToConsole = options.logToConsole !== false;
        this.persistLogs = options.persistLogs || false;
        this.storageKey = options.storageKey || 'symbolic_logger_entries';
        this.maxLogsToKeep = options.maxLogsToKeep || 1000;
        this.minLevel = options.minLevel || (this.isProduction ? LogLevel.INFO : LogLevel.DEBUG);
        // Load persisted logs if enabled
        if (this.persistLogs) {
            this.loadPersistedLogs();
        }
    }
    /**
     * Map log level to appropriate quantum state
     */
    SymbolicLogger.prototype._mapLevelToState = function (level) {
        // In production, use REAL states, otherwise use SIM states
        var contextPrefix = this.isProduction ? 'REAL' : 'SIM';
        switch (level) {
            case LogLevel.TRACE:
            case LogLevel.DEBUG:
            case LogLevel.INFO:
                return QuantumState["".concat(contextPrefix, "_FLOW")];
            case LogLevel.WARNING:
                return QuantumState["".concat(contextPrefix, "_PARTIAL")];
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                return QuantumState["".concat(contextPrefix, "_ANTIFLOW")];
            default:
                return QuantumState["".concat(contextPrefix, "_FLOW")];
        }
    };
    /**
     * Format a log message with the symbolic protocol
     */
    SymbolicLogger.prototype.formatMessage = function (level, message, domain) {
        if (domain === void 0) { domain = this.defaultDomain; }
        var timeStr = new Date().toISOString();
        var emoji = LogLevelEmoji[level];
        var prefix = "[".concat(this.timeline, "/").concat(domain, "/").concat(emoji, "]");
        return "".concat(prefix, " ").concat(timeStr, " - ").concat(message);
    };
    /**
     * Load persisted logs from storage (browser-only)
     */
    SymbolicLogger.prototype.loadPersistedLogs = function () {
        if (!this.persistLogs)
            return;
        try {
            if (isBrowser()) {
                var storedLogs = localStorage.getItem(this.storageKey);
                if (storedLogs) {
                    var parsedLogs = JSON.parse(storedLogs, function (key, value) {
                        if (key === 'timestamp' && typeof value === 'string') {
                            return new Date(value);
                        }
                        return value;
                    });
                    if (Array.isArray(parsedLogs)) {
                        this.logs = parsedLogs;
                    }
                }
            }
        }
        catch (error) {
            console.error('Failed to load persisted logs:', error);
        }
    };
    /**
     * Persist logs to storage (browser-only)
     */
    SymbolicLogger.prototype.persistLogsToStorage = function () {
        if (!this.persistLogs)
            return;
        try {
            if (isBrowser()) {
                // Trim logs if they exceed the maximum
                if (this.logs.length > this.maxLogsToKeep) {
                    this.logs = this.logs.slice(-this.maxLogsToKeep);
                }
                localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
            }
        }
        catch (error) {
            console.error('Failed to persist logs:', error);
        }
    };
    /**
     * Log to console with appropriate styling
     */
    SymbolicLogger.prototype._logToConsole = function (level, formattedMessage) {
        if (!this.logToConsole)
            return;
        switch (level) {
            case LogLevel.TRACE:
            case LogLevel.DEBUG:
                console.debug(formattedMessage);
                break;
            case LogLevel.INFO:
                console.info(formattedMessage);
                break;
            case LogLevel.WARNING:
                console.warn(formattedMessage);
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(formattedMessage);
                break;
            default:
                console.log(formattedMessage);
        }
    };
    /**
     * Internal logging method
     */
    SymbolicLogger.prototype.log = function (level, message, domain, metadata) {
        if (domain === void 0) { domain = this.defaultDomain; }
        // Skip if below minimum log level
        if (level < this.minLevel) {
            // Create a dummy LogEntry to return
            return {
                timestamp: new Date(),
                level: level,
                message: message,
                formattedMessage: '',
                domain: domain,
                metadata: metadata
            };
        }
        var timestamp = new Date();
        var formattedMessage = this.formatMessage(level, message, domain);
        var logEntry = {
            timestamp: timestamp,
            level: level,
            message: message,
            formattedMessage: formattedMessage,
            domain: domain,
            metadata: metadata
        };
        // Store the log
        this.logs.push(logEntry);
        // Persist logs if enabled
        if (this.persistLogs) {
            this.persistLogsToStorage();
        }
        // Output to console if enabled
        this._logToConsole(level, formattedMessage);
        return logEntry;
    };
    // Convenience methods for different log levels
    SymbolicLogger.prototype.trace = function (message, domain, metadata) {
        return this.log(LogLevel.TRACE, message, domain || this.defaultDomain, metadata);
    };
    SymbolicLogger.prototype.debug = function (message, domain, metadata) {
        return this.log(LogLevel.DEBUG, message, domain || this.defaultDomain, metadata);
    };
    SymbolicLogger.prototype.info = function (message, domain, metadata) {
        return this.log(LogLevel.INFO, message, domain || this.defaultDomain, metadata);
    };
    SymbolicLogger.prototype.warning = function (message, domain, metadata) {
        return this.log(LogLevel.WARNING, message, domain || this.defaultDomain, metadata);
    };
    SymbolicLogger.prototype.error = function (message, domain, metadata) {
        return this.log(LogLevel.ERROR, message, domain || this.defaultDomain, metadata);
    };
    SymbolicLogger.prototype.fatal = function (message, domain, metadata) {
        return this.log(LogLevel.FATAL, message, domain || this.defaultDomain, metadata);
    };
    /**
     * Get logs filtered by various criteria
     */
    SymbolicLogger.prototype.getLogHistory = function (options) {
        if (options === void 0) { options = {}; }
        var filteredLogs = __spreadArray([], this.logs, true);
        if (options.level !== undefined) {
            filteredLogs = filteredLogs.filter(function (log) { return log.level === options.level; });
        }
        if (options.domain !== undefined) {
            filteredLogs = filteredLogs.filter(function (log) { return log.domain === options.domain; });
        }
        if (options.since !== undefined) {
            var sinceTime_1 = typeof options.since === 'string' ? new Date(options.since) : options.since;
            filteredLogs = filteredLogs.filter(function (log) { return log.timestamp >= sinceTime_1; });
        }
        if (options.until !== undefined) {
            var untilTime_1 = typeof options.until === 'string' ? new Date(options.until) : options.until;
            filteredLogs = filteredLogs.filter(function (log) { return log.timestamp <= untilTime_1; });
        }
        if (options.metadata) {
            filteredLogs = filteredLogs.filter(function (log) {
                if (!log.metadata)
                    return false;
                return Object.entries(options.metadata || {}).every(function (_a) {
                    var _b;
                    var key = _a[0], value = _a[1];
                    return ((_b = log.metadata) === null || _b === void 0 ? void 0 : _b[key]) === value;
                });
            });
        }
        if (options.limit !== undefined && options.limit > 0) {
            filteredLogs = filteredLogs.slice(-options.limit);
        }
        return filteredLogs;
    };
    /**
     * Clear all logs
     */
    SymbolicLogger.prototype.clearLogs = function () {
        this.logs = [];
        if (this.persistLogs) {
            this.persistLogsToStorage();
        }
    };
    /**
     * Get the total number of logs
     */
    SymbolicLogger.prototype.getLogCount = function () {
        return this.logs.length;
    };
    /**
     * Create a formatted string representation of filtered logs
     */
    SymbolicLogger.prototype.getFormattedLogs = function (options) {
        if (options === void 0) { options = {}; }
        var logs = this.getLogHistory(options);
        return logs.map(function (log) { return log.formattedMessage; }).join('\n');
    };
    return SymbolicLogger;
}());
export { SymbolicLogger };
// Create a singleton instance for system-wide use
export var systemLogger = new SymbolicLogger({
    isProduction: process.env.NODE_ENV === 'production',
    defaultDomain: DomainEmoji.SYSTEM
});
// Export everything for use in other modules
export default {
    SymbolicLogger: SymbolicLogger,
    systemLogger: systemLogger,
    LogLevel: LogLevel,
    DomainEmoji: DomainEmoji
};
