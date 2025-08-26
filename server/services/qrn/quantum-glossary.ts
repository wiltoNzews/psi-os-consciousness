/**
 * Quantum Glossary
 * 
 * A centralized logging and context management system for quantum components.
 * Provides contextual tagging, error reporting, and quantum state tracking.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

// Define quantum states
export enum QuantumState {
  COHERENT = 'COHERENT',                    // Stable, aligned state
  DECOHERENT = 'DECOHERENT',                // Unstable, chaotic state
  SUPERPOSITION = 'SUPERPOSITION',          // Multiple potential states
  ENTANGLED = 'ENTANGLED',                  // Connected across components
  BIFROST_BRIDGE = 'BIFROST_BRIDGE',        // Information transfer state
  QUANTUM_ANNEALING = 'QUANTUM_ANNEALING',  // Optimization state
  WAVE_FUNCTION_COLLAPSE = 'WAVE_FUNCTION_COLLAPSE', // Decision state
  TRANSCENDENT_FLOW = 'TRANSCENDENT_FLOW',  // Highest coherence state
}

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  QUANTUM = 'QUANTUM' // Special level for quantum-specific logs
}

/**
 * Quantum Glossary Service
 * Provides logging and contextual information for quantum components
 */
export class QuantumGlossary {
  private currentState: QuantumState = QuantumState.COHERENT;
  private contextTags: Set<string> = new Set();
  private logEntries: any[] = []; // Would use proper type in full implementation
  
  // Single instance for the application
  private static instance: QuantumGlossary;
  
  /**
   * Get singleton instance of QuantumGlossary
   */
  public static getInstance(): QuantumGlossary {
    if (!QuantumGlossary.instance) {
      QuantumGlossary.instance = new QuantumGlossary();
    }
    
    return QuantumGlossary.instance;
  }
  
  /**
   * Create a new QuantumGlossary instance
   * Use getInstance() instead for singleton pattern
   */
  constructor() {
    // Use singleton pattern
    if (QuantumGlossary.instance) {
      return QuantumGlossary.instance;
    }
    
    QuantumGlossary.instance = this;
    this.log(LogLevel.INFO, 'Quantum Glossary initialized');
  }
  
  /**
   * Log a message with specified level
   * 
   * @param level - Log level
   * @param message - Log message
   * @param data - Optional data to include
   */
  public log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date();
    const entry = {
      timestamp,
      level,
      message,
      state: this.currentState,
      contextTags: Array.from(this.contextTags),
      data
    };
    
    this.logEntries.push(entry);
    
    // Format the log message
    let formattedMessage = `[${level}] [${this.currentState}]`;
    
    if (this.contextTags.size > 0) {
      formattedMessage += ` [${Array.from(this.contextTags).join(', ')}]`;
    }
    
    formattedMessage += `: ${message}`;
    
    // Output to console based on level
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        if (data) console.error(data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        if (data) console.warn(data);
        break;
      case LogLevel.QUANTUM:
        console.log(`🔮 ${formattedMessage}`);
        if (data) console.log(data);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        if (data) console.debug(data);
        break;
      default:
        console.log(formattedMessage);
        if (data) console.log(data);
    }
  }
  
  /**
   * Log an error with stack trace
   * 
   * @param message - Error message
   * @param error - Error object
   */
  public logError(message: string, error: Error): void {
    this.log(LogLevel.ERROR, message, {
      error: error.message,
      stack: error.stack
    });
  }
  
  /**
   * Log a message with QUANTUM level
   * 
   * @param message - Quantum message
   * @param data - Optional data
   */
  public logQuantum(message: string, data?: any): void {
    this.log(LogLevel.QUANTUM, message, data);
  }
  
  /**
   * Set current quantum state
   * 
   * @param state - New quantum state
   */
  public setState(state: QuantumState): void {
    const oldState = this.currentState;
    this.currentState = state;
    
    if (oldState !== state) {
      this.logQuantum(`Quantum state transition: ${oldState} -> ${state}`);
    }
  }
  
  /**
   * Get current quantum state
   * 
   * @returns Current quantum state
   */
  public getState(): QuantumState {
    return this.currentState;
  }
  
  /**
   * Add context tag
   * 
   * @param tag - Context tag to add
   */
  public addContextTag(tag: string): void {
    this.contextTags.add(tag);
  }
  
  /**
   * Remove context tag
   * 
   * @param tag - Context tag to remove
   */
  public removeContextTag(tag: string): void {
    this.contextTags.delete(tag);
  }
  
  /**
   * Clear all context tags
   */
  public clearContextTags(): void {
    this.contextTags.clear();
  }
  
  /**
   * Set context tags (replacing existing ones)
   * 
   * @param tags - New context tags
   */
  public setContextTags(tags: string[]): void {
    this.contextTags = new Set(tags);
  }
  
  /**
   * Log message with new temporary context tag
   * 
   * @param tag - Temporary context tag
   * @param message - Log message
   * @param level - Optional log level (default: INFO)
   * @param data - Optional data
   */
  public tagWithContext(
    message: string,
    level: LogLevel = LogLevel.INFO,
    data?: any
  ): void {
    this.log(level, message, data);
  }
  
  /**
   * Get recent log entries
   * 
   * @param count - Number of entries to retrieve (default: 100)
   * @param level - Optional filter by log level
   * @returns Recent log entries
   */
  public getRecentLogs(count: number = 100, level?: LogLevel): any[] {
    let filtered = this.logEntries;
    
    if (level) {
      filtered = filtered.filter(entry => entry.level === level);
    }
    
    return filtered.slice(-count);
  }
  
  /**
   * Search logs for keyword
   * 
   * @param keyword - Search keyword
   * @param maxResults - Maximum results to return (default: 100)
   * @returns Matching log entries
   */
  public searchLogs(keyword: string, maxResults: number = 100): any[] {
    const lowerKeyword = keyword.toLowerCase();
    
    return this.logEntries
      .filter(entry => 
        entry.message.toLowerCase().includes(lowerKeyword) ||
        (entry.data && JSON.stringify(entry.data).toLowerCase().includes(lowerKeyword))
      )
      .slice(-maxResults);
  }
  
  /**
   * Clear log history
   */
  public clearLogs(): void {
    this.logEntries = [];
    this.log(LogLevel.INFO, 'Log history cleared');
  }
}

// Export singleton instance
export default QuantumGlossary.getInstance();