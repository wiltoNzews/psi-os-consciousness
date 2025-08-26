/**
 * Symbolic Log Aggregator
 * 
 * Provides a singleton service to aggregate and analyze symbolic communication logs
 * for visualization and monitoring purposes.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Export log symbols for cross-component usage (now defined inline in quantum-chunk-tracker.ts)
// Kept for compatibility with other components
export const LIFECYCLE_LOG_SYMBOL = '⚽️';

// Singleton instance
let instance: SymbolicLogAggregator | null = null;

/**
 * Lifecycle event types for parsing
 */
type LifecycleEventType = 'creation' | 'routing' | 'entanglement' | 'decoherence' | 'pipeline_complete';

/**
 * Lifecycle event parsing result interface
 */
interface LifecycleEvent {
  type: LifecycleEventType;
  id?: string;
  id1?: string; 
  id2?: string;
  agent?: string;
  selectedPossibility?: string;
  finalState?: string;
  state?: Record<string, any>;
}

/**
 * Parse a lifecycle log entry into a structured event
 * @param log The log message to parse
 * @returns Structured lifecycle event or null if not recognized
 * 
 * NOTE: This function has been moved to the quantum-chunk-tracker.ts file for local usage
 * to avoid circular dependencies. This version is kept for compatibility with other components.
 */
export function parseLifecycleEvent(log: string): LifecycleEvent | null {
  // Only process lifecycle logs
  if (!log.includes(`[${LIFECYCLE_LOG_SYMBOL}]`)) {
    return null;
  }

  // Extract the event text after the symbol marker
  const match = log.match(/\[⚽️\]\s+([\w]+):\s+(.*)/);
  if (!match) return null;

  const [_, component, eventData] = match;
  
  // Parse the event data based on component and format
  if (component === 'QuantumChunkTracker') {
    if (eventData.startsWith('ChunkCreated=')) {
      const id = eventData.replace('ChunkCreated=', '');
      return { type: 'creation', id };
    }
    
    if (eventData.startsWith('ChunkRouted=')) {
      const parts = eventData.replace('ChunkRouted=', '').split(', Agent=');
      return { 
        type: 'routing', 
        id: parts[0],
        agent: parts[1]
      };
    }
    
    if (eventData.startsWith('ChunksEntangled=')) {
      const ids = eventData.replace('ChunksEntangled=', '').split(',');
      return { 
        type: 'entanglement', 
        id1: ids[0],
        id2: ids[1]
      };
    }
    
    if (eventData.startsWith('ChunkCollapsed=')) {
      const parts = eventData.replace('ChunkCollapsed=', '').split(', Possibility=');
      return { 
        type: 'decoherence', 
        id: parts[0],
        selectedPossibility: parts[1] !== 'unspecified' ? parts[1] : undefined
      };
    }
    
    if (eventData.startsWith('PipelineComplete=')) {
      const parts = eventData.replace('PipelineComplete=', '').split(', FinalState=');
      const timeMatch = parts[1].match(/, Time=(\d+)ms/);
      
      let finalState = parts[1];
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
 * Represents a symbolic message log entry
 */
interface SymbolicMessage {
  id: string;
  timestamp: Date;
  symbol: string;
  domain: string;
  timeline: string;
  sourceAgent?: string;
  targetAgent?: string;
  content?: string;
  messageType?: string;
}

/**
 * Represents a communication pattern between agents
 */
interface AgentCommunicationPattern {
  sourceAgent: string;
  targetAgent: string;
  messageCount: number;
  symbolUsage: Record<string, number>;
  averageResponseTime?: number;
}

/**
 * Symbol definition mapping
 */
interface SymbolDefinition {
  symbol: string;
  name: string;
  description: string;
  context: string;
  usageCount: number;
}

/**
 * Options for retrieving symbolic messages
 */
interface GetMessagesOptions {
  since?: Date;
  domain?: string;
  timeline?: string;
  sourceAgent?: string;
  targetAgent?: string;
  includeContent?: boolean;
  limit?: number;
}

/**
 * Class that aggregates and analyzes symbolic communication logs
 */
export class SymbolicLogAggregator {
  private messages: SymbolicMessage[] = [];
  private symbols: SymbolDefinition[] = [];
  private agentCommunicationPatterns: Map<string, AgentCommunicationPattern> = new Map();
  
  // Usage statistics
  private domainUsage: Record<string, number> = {};
  private timelineUsage: Record<string, number> = {};
  private symbolUsage: Record<string, number> = {};
  
  private constructor() {
    this.initializeSymbols();
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): SymbolicLogAggregator {
    if (!instance) {
      instance = new SymbolicLogAggregator();
    }
    return instance;
  }
  
  /**
   * Add a symbolic message to the aggregator
   */
  public addMessage(message: SymbolicMessage): void {
    this.messages.push(message);
    
    // Update usage statistics
    this.updateUsageStatistics(message);
    
    // Update agent communication patterns
    if (message.sourceAgent && message.targetAgent) {
      this.updateAgentCommunicationPattern(message);
    }
  }
  
  /**
   * Get symbolic messages filtered by options
   */
  public getSymbolicMessages(options: GetMessagesOptions = {}): SymbolicMessage[] {
    let filtered = this.messages;
    
    if (options.since) {
      filtered = filtered.filter(m => m.timestamp >= options.since!);
    }
    
    if (options.domain) {
      filtered = filtered.filter(m => m.domain === options.domain);
    }
    
    if (options.timeline) {
      filtered = filtered.filter(m => m.timeline === options.timeline);
    }
    
    if (options.sourceAgent) {
      filtered = filtered.filter(m => m.sourceAgent === options.sourceAgent);
    }
    
    if (options.targetAgent) {
      filtered = filtered.filter(m => m.targetAgent === options.targetAgent);
    }
    
    // Sort by most recent first
    filtered = filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit
    if (options.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }
    
    // Remove content if not requested
    if (!options.includeContent) {
      filtered = filtered.map(m => {
        const { content, ...rest } = m;
        return rest;
      });
    }
    
    return filtered;
  }
  
  /**
   * Get all defined symbols
   */
  public getAllSymbols(): SymbolDefinition[] {
    return this.symbols;
  }
  
  /**
   * Get agent communication statistics
   */
  public getAgentCommunicationStats(): AgentCommunicationPattern[] {
    return Array.from(this.agentCommunicationPatterns.values());
  }
  
  /**
   * Get the total number of messages
   */
  public getTotalMessageCount(): number {
    return this.messages.length;
  }
  
  /**
   * Get the most frequently used symbols
   */
  public getTopSymbols(limit: number = 10): { symbol: string; count: number }[] {
    return Object.entries(this.symbolUsage)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  /**
   * Get distribution of messages across domains
   */
  public getDomainDistribution(): Record<string, number> {
    return this.domainUsage;
  }
  
  /**
   * Get distribution of messages across timelines
   */
  public getTimelineDistribution(): Record<string, number> {
    return this.timelineUsage;
  }
  
  /**
   * Initialize the symbol definitions
   */
  private initializeSymbols(): void {
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
  }
  
  /**
   * Update usage statistics based on a new message
   */
  private updateUsageStatistics(message: SymbolicMessage): void {
    // Update domain usage
    this.domainUsage[message.domain] = (this.domainUsage[message.domain] || 0) + 1;
    
    // Update timeline usage
    this.timelineUsage[message.timeline] = (this.timelineUsage[message.timeline] || 0) + 1;
    
    // Update symbol usage
    this.symbolUsage[message.symbol] = (this.symbolUsage[message.symbol] || 0) + 1;
    
    // Update symbol definition usage count
    const symbolDef = this.symbols.find(s => s.symbol === message.symbol);
    if (symbolDef) {
      symbolDef.usageCount++;
    }
  }
  
  /**
   * Update agent communication patterns based on a new message
   */
  private updateAgentCommunicationPattern(message: SymbolicMessage): void {
    const key = `${message.sourceAgent}->${message.targetAgent}`;
    
    let pattern = this.agentCommunicationPatterns.get(key);
    
    if (!pattern) {
      pattern = {
        sourceAgent: message.sourceAgent!,
        targetAgent: message.targetAgent!,
        messageCount: 0,
        symbolUsage: {}
      };
    }
    
    pattern.messageCount++;
    pattern.symbolUsage[message.symbol] = (pattern.symbolUsage[message.symbol] || 0) + 1;
    
    this.agentCommunicationPatterns.set(key, pattern);
  }
}

// Export a function to get the singleton instance
export function getSymbolicLogAggregator(): SymbolicLogAggregator {
  return SymbolicLogAggregator.getInstance();
}