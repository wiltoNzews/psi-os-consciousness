/**
 * Symbolic Logger
 * 
 * This module provides a consistent logging interface that applies the 
 * Symbolic Communication Protocol to all log messages across the system.
 * 
 * [QUANTUM_STATE: SIM_FLOW] Symbolic Logging System for WiltonOS
 */

import { QuantumState } from '../../shared/schema-minimal.js';
import { formatWithSymbolicPrefix, addSymbolicSuffix } from './symbolic-utils.js';

/**
 * Log levels used in the SymbolicLogger
 */
export enum LogLevel {
  TRACE = 0,   // 🔍 Detailed tracing info
  DEBUG = 1,   // 🐛 Debugging information
  INFO = 2,    // ℹ️ General information
  WARNING = 3, // ⚠️ Warning conditions
  ERROR = 4,   // ❌ Error conditions
  FATAL = 5    // 💀 Critical failures
}

/**
 * Map log levels to emojis
 */
export const LogLevelEmoji: Record<LogLevel, string> = {
  [LogLevel.TRACE]: '🔍',
  [LogLevel.DEBUG]: '🐛',
  [LogLevel.INFO]: 'ℹ️',
  [LogLevel.WARNING]: '⚠️',
  [LogLevel.ERROR]: '❌',
  [LogLevel.FATAL]: '💀'
};

/**
 * Domain emojis for different system components
 */
export const DomainEmoji = {
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
 * Interface for a log entry
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  formattedMessage: string;
  domain: string;
  metadata?: Record<string, any>;
}

/**
 * Options for initializing the SymbolicLogger
 */
export interface SymbolicLoggerOptions {
  timeline?: string;
  defaultDomain?: string;
  isProduction?: boolean;
  logToConsole?: boolean;
  persistLogs?: boolean;
  storageKey?: string;
  maxLogsToKeep?: number;
  minLevel?: LogLevel;
}

/**
 * Options for filtering logs
 */
export interface LogFilterOptions {
  level?: LogLevel;
  domain?: string;
  since?: Date | string;
  until?: Date | string;
  limit?: number;
  metadata?: Record<string, any>;
}

/**
 * Determines if we're in a browser environment
 */
const isBrowser = (): boolean => {
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
export class SymbolicLogger {
  private timeline: string;
  private defaultDomain: string;
  private isProduction: boolean;
  private logToConsole: boolean;
  private persistLogs: boolean;
  private storageKey: string;
  private maxLogsToKeep: number;
  private minLevel: LogLevel;
  private logs: LogEntry[] = [];

  /**
   * Initialize a new SymbolicLogger
   */
  constructor(options: SymbolicLoggerOptions = {}) {
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
  private _mapLevelToState(level: LogLevel): QuantumState {
    // In production, use REAL states, otherwise use SIM states
    const contextPrefix = this.isProduction ? 'REAL' : 'SIM';
    
    switch(level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        return QuantumState[`${contextPrefix}_FLOW`];
      case LogLevel.WARNING:
        return QuantumState[`${contextPrefix}_PARTIAL`];
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return QuantumState[`${contextPrefix}_ANTIFLOW`];
      default:
        return QuantumState[`${contextPrefix}_FLOW`];
    }
  }
  
  /**
   * Format a log message with the symbolic protocol
   */
  private formatMessage(level: LogLevel, message: string, domain: string = this.defaultDomain): string {
    const timeStr = new Date().toISOString();
    const emoji = LogLevelEmoji[level];
    const prefix = `[${this.timeline}/${domain}/${emoji}]`;
    return `${prefix} ${timeStr} - ${message}`;
  }
  
  /**
   * Load persisted logs from storage (browser-only)
   */
  private loadPersistedLogs(): void {
    if (!this.persistLogs) return;
    
    try {
      if (isBrowser()) {
        const storedLogs = localStorage.getItem(this.storageKey);
        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs, (key, value) => {
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
    } catch (error) {
      console.error('Failed to load persisted logs:', error);
    }
  }
  
  /**
   * Persist logs to storage (browser-only)
   */
  private persistLogsToStorage(): void {
    if (!this.persistLogs) return;
    
    try {
      if (isBrowser()) {
        // Trim logs if they exceed the maximum
        if (this.logs.length > this.maxLogsToKeep) {
          this.logs = this.logs.slice(-this.maxLogsToKeep);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
      }
    } catch (error) {
      console.error('Failed to persist logs:', error);
    }
  }
  
  /**
   * Log to console with appropriate styling
   */
  private _logToConsole(level: LogLevel, formattedMessage: string): void {
    if (!this.logToConsole) return;
    
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
  }
  
  /**
   * Internal logging method
   */
  public log(level: LogLevel, message: string, domain: string = this.defaultDomain, metadata?: Record<string, any>): LogEntry {
    // Skip if below minimum log level
    if (level < this.minLevel) {
      // Create a dummy LogEntry to return
      return {
        timestamp: new Date(),
        level,
        message,
        formattedMessage: '',
        domain,
        metadata
      };
    }

    const timestamp = new Date();
    const formattedMessage = this.formatMessage(level, message, domain);
    
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      formattedMessage,
      domain,
      metadata
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
  }
  
  // Convenience methods for different log levels
  public trace(message: string, domain?: string, metadata?: Record<string, any>): LogEntry {
    return this.log(LogLevel.TRACE, message, domain || this.defaultDomain, metadata);
  }
  
  public debug(message: string, domain?: string, metadata?: Record<string, any>): LogEntry {
    return this.log(LogLevel.DEBUG, message, domain || this.defaultDomain, metadata);
  }
  
  public info(message: string, domain?: string, metadata?: Record<string, any>): LogEntry {
    return this.log(LogLevel.INFO, message, domain || this.defaultDomain, metadata);
  }
  
  public warning(message: string, domain?: string, metadata?: Record<string, any>): LogEntry {
    return this.log(LogLevel.WARNING, message, domain || this.defaultDomain, metadata);
  }
  
  public error(message: string, domain?: string, metadata?: Record<string, any>): LogEntry {
    return this.log(LogLevel.ERROR, message, domain || this.defaultDomain, metadata);
  }
  
  public fatal(message: string, domain?: string, metadata?: Record<string, any>): LogEntry {
    return this.log(LogLevel.FATAL, message, domain || this.defaultDomain, metadata);
  }
  
  /**
   * Get logs filtered by various criteria
   */
  public getLogHistory(options: LogFilterOptions = {}): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (options.level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }
    
    if (options.domain !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.domain === options.domain);
    }
    
    if (options.since !== undefined) {
      const sinceTime = typeof options.since === 'string' ? new Date(options.since) : options.since;
      filteredLogs = filteredLogs.filter(log => log.timestamp >= sinceTime);
    }
    
    if (options.until !== undefined) {
      const untilTime = typeof options.until === 'string' ? new Date(options.until) : options.until;
      filteredLogs = filteredLogs.filter(log => log.timestamp <= untilTime);
    }
    
    if (options.metadata) {
      filteredLogs = filteredLogs.filter(log => {
        if (!log.metadata) return false;
        
        return Object.entries(options.metadata || {}).every(([key, value]) => 
          log.metadata?.[key] === value
        );
      });
    }
    
    if (options.limit !== undefined && options.limit > 0) {
      filteredLogs = filteredLogs.slice(-options.limit);
    }
    
    return filteredLogs;
  }
  
  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
    
    if (this.persistLogs) {
      this.persistLogsToStorage();
    }
  }
  
  /**
   * Get the total number of logs
   */
  public getLogCount(): number {
    return this.logs.length;
  }
  
  /**
   * Create a formatted string representation of filtered logs
   */
  public getFormattedLogs(options: LogFilterOptions = {}): string {
    const logs = this.getLogHistory(options);
    
    return logs.map(log => log.formattedMessage).join('\n');
  }
}

// Create a singleton instance for system-wide use
export const systemLogger = new SymbolicLogger({
  isProduction: process.env.NODE_ENV === 'production',
  defaultDomain: DomainEmoji.SYSTEM
});

// Export everything for use in other modules
export default {
  SymbolicLogger,
  systemLogger,
  LogLevel,
  DomainEmoji
};