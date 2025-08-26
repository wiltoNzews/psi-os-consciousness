/**
 * Symbolic Logging System Example
 * 
 * This example demonstrates how to implement a practical logging system
 * using the Symbolic Communication Protocol to provide clear contextual
 * information for all system logs.
 * 
 * [α/S+/📋] Example logging system for WiltonOS
 */

// Direct imports to avoid the TypeScript-style imports that might not work in plain JS
import * as symbolicUtils from '../utils/symbolic-utils.js';
import * as symbolicToQuantumState from '../utils/symbolic-to-quantumstate.js';

// Extract the functions we need
const { formatWithSymbolicPrefix, addSymbolicSuffix } = symbolicUtils;
const { symbolToQuantumState } = symbolicToQuantumState;

// QuantumState enum (mirroring schema-minimal.ts)
const QuantumState = {
  SIM_FLOW: "SIM_FLOW",
  SIM_ANTIFLOW: "SIM_ANTIFLOW",
  SIM_PARTIAL: "SIM_PARTIAL",
  REAL_FLOW: "REAL_FLOW",
  REAL_ANTIFLOW: "REAL_ANTIFLOW",
  REAL_PARTIAL: "REAL_PARTIAL",
  TRANSITION_TO_REAL: "TRANSITION_TO_REAL",
  TRANSITION_TO_SIM: "TRANSITION_TO_SIM"
};

// Log levels
const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL'
};

// Domain emojis for different system components
const DomainEmoji = {
  SYSTEM: '⚙️',
  DATABASE: '💾',
  NETWORK: '🔌',
  SECURITY: '🔒',
  UI: '🖥️',
  ANALYTICS: '📊',
  API: '🔄',
  PERFORMANCE: '⚡',
  TESTING: '🧪'
};

/**
 * Symbolic Logger Class
 * 
 * Provides a consistent logging interface that applies the 
 * Symbolic Communication Protocol to all log messages.
 */
class SymbolicLogger {
  constructor(options = {}) {
    this.timeline = options.timeline || 'α';
    this.defaultDomain = options.defaultDomain || DomainEmoji.SYSTEM;
    this.isProduction = options.isProduction || false;
    this.logToConsole = options.logToConsole !== false;
    this.logs = [];
  }
  
  /**
   * Map log level to appropriate quantum state
   */
  _mapLevelToState(level, domainSpecificIssue = false) {
    // In production, use REAL states, otherwise use SIM states
    const contextPrefix = this.isProduction ? 'REAL' : 'SIM';
    
    switch(level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        return QuantumState[`${contextPrefix}_FLOW`];
      case LogLevel.WARNING:
        return QuantumState[`${contextPrefix}_PARTIAL`];
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return QuantumState[`${contextPrefix}_ANTIFLOW`];
      default:
        return QuantumState[`${contextPrefix}_FLOW`];
    }
  }
  
  /**
   * Map log level to appropriate suffix symbol
   */
  _getLevelSuffix(level) {
    switch(level) {
      case LogLevel.DEBUG: return '🔍';
      case LogLevel.INFO: return '✅';
      case LogLevel.WARNING: return '⚠️';
      case LogLevel.ERROR: return '❌';
      case LogLevel.CRITICAL: return '🚨';
      default: return '';
    }
  }
  
  /**
   * Format a log message with the symbolic protocol
   */
  _formatLogMessage(level, message, domain) {
    const state = this._mapLevelToState(level);
    const domainEmoji = domain || this.defaultDomain;
    
    // Create the symbolic formatted message
    let formattedMessage = formatWithSymbolicPrefix(
      state,
      message,
      domainEmoji,
      this.timeline
    );
    
    // Add an appropriate suffix based on log level
    const suffix = this._getLevelSuffix(level);
    if (suffix) {
      formattedMessage = addSymbolicSuffix(formattedMessage, suffix);
    }
    
    return formattedMessage;
  }
  
  /**
   * Log a message at the specified level
   */
  log(level, message, domain) {
    const timestamp = new Date();
    const formattedMessage = this._formatLogMessage(level, message, domain);
    
    const logEntry = {
      timestamp,
      level,
      message: formattedMessage,
      rawMessage: message,
      domain
    };
    
    // Store the log
    this.logs.push(logEntry);
    
    // Output to console if enabled
    if (this.logToConsole) {
      console.log(`${timestamp.toISOString()} - ${formattedMessage}`);
    }
    
    return logEntry;
  }
  
  // Convenience methods for different log levels
  debug(message, domain) {
    return this.log(LogLevel.DEBUG, message, domain);
  }
  
  info(message, domain) {
    return this.log(LogLevel.INFO, message, domain);
  }
  
  warning(message, domain) {
    return this.log(LogLevel.WARNING, message, domain);
  }
  
  error(message, domain) {
    return this.log(LogLevel.ERROR, message, domain);
  }
  
  critical(message, domain) {
    return this.log(LogLevel.CRITICAL, message, domain);
  }
  
  /**
   * Get logs filtered by various criteria
   */
  getLogs(options = {}) {
    let filteredLogs = [...this.logs];
    
    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }
    
    if (options.domain) {
      filteredLogs = filteredLogs.filter(log => log.domain === options.domain);
    }
    
    if (options.since) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= options.since);
    }
    
    if (options.limit) {
      filteredLogs = filteredLogs.slice(0, options.limit);
    }
    
    return filteredLogs;
  }
}

/**
 * Demonstrate the SymbolicLogger with various examples
 */
function demonstrateSymbolicLogger() {
  console.log('\n[α/S+/📋] DEMONSTRATION: Symbolic Logger System');
  
  // Create a development environment logger
  const devLogger = new SymbolicLogger({
    isProduction: false,
    defaultDomain: DomainEmoji.SYSTEM
  });
  
  // Log various messages at different levels
  devLogger.info('System startup complete', DomainEmoji.SYSTEM);
  devLogger.debug('Connected to database', DomainEmoji.DATABASE);
  
  // Simulate a warning
  devLogger.warning('Database connection latency high', DomainEmoji.DATABASE);
  
  // Simulate an error
  devLogger.error('Failed to process payment', DomainEmoji.API);
  
  // Simulate a critical issue
  devLogger.critical('Security breach detected', DomainEmoji.SECURITY);
  
  // Create a production environment logger
  const prodLogger = new SymbolicLogger({
    isProduction: true,
    timeline: '2025α',
    defaultDomain: DomainEmoji.SYSTEM
  });
  
  console.log('\n[α/S+/🌐] PRODUCTION ENVIRONMENT LOGS:');
  
  // Log various messages in the production logger
  prodLogger.info('Production server started', DomainEmoji.SYSTEM);
  prodLogger.warning('High memory usage detected', DomainEmoji.PERFORMANCE);
  prodLogger.error('API rate limit exceeded', DomainEmoji.API);
  
  // Filter and retrieve logs
  console.log('\n[α/S+/🔍] FILTERED LOGS (Errors only):');
  const errorLogs = devLogger.getLogs({ level: LogLevel.ERROR });
  errorLogs.forEach(log => {
    console.log(`${log.timestamp.toISOString()} - ${log.message}`);
  });
}

// Run the demonstration
demonstrateSymbolicLogger();

// Export the SymbolicLogger for use in other modules
export { SymbolicLogger, LogLevel, DomainEmoji };