/**
 * Quantum Chunk Tracker
 * 
 * This module tracks quantum chunks as they flow through the system,
 * including their creation, state transitions, and relationships.
 * It provides methods for monitoring chunk lifecycle and performance metrics.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { chunkStatesEnum } from '../../shared/schema-minimal.js';

// Define lifecycle log symbol inline to avoid import issues
const LIFECYCLE_LOG_SYMBOL = '⚽️';

/**
 * Basic lifecycle event interface for local usage
 */
interface LifecycleEvent {
  type: string;
  id?: string;
  id1?: string; 
  id2?: string;
  agent?: string;
  selectedPossibility?: string;
  finalState?: string;
  state?: Record<string, any>;
}

/**
 * Simple lifecycle event parser
 * @param log The log entry to parse
 */
function parseLifecycleEvent(log: string): LifecycleEvent | null {
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

// Define ChunkState enum for our internal tracking purposes
export enum ChunkState {
  CREATED = "created",
  PROCESSING = "in_progress",
  PROCESSED = "processed",
  ERROR = "error",
  MERGED = "merged",
  // Additional states for quantum processing
  SUPERPOSED = "superposed",
  ENTANGLED = "entangled",
  COLLAPSED = "collapsed"
}

// Singleton instance
let instance: QuantumChunkTracker | null = null;

/**
 * Represents a tracked chunk with all its metadata
 */
interface TrackedChunk {
  id: string;
  state: ChunkState;
  createdAt: Date;
  lastUpdated: Date;
  routedTo: Array<{
    agent: string;
    timestamp: Date;
  }>;
  entangledWith: Array<{
    partnerId: string;
    timestamp: Date;
  }>;
  stateHistory: Array<{
    state: ChunkState;
    timestamp: Date;
    selectedPossibility?: string;
    partnerId?: string;
  }>;
  content?: string;
  domain?: string;
  timeline?: string;
  handlingAgent?: string;
  processingTime?: number;
  selectedPossibility?: string;
  completed?: boolean;
  completedAt?: Date;
  finalState?: string;
}

/**
 * Represents a state transition of a chunk
 */
interface StateTransition {
  chunkId: string;
  from: ChunkState;
  to: ChunkState;
  timestamp: Date;
  selectedPossibility?: string;
}

/**
 * Tracks the lifecycle and processing metrics for quantum chunks
 */
export class QuantumChunkTracker {
  private chunks: Map<string, TrackedChunk> = new Map();
  private stateTransitions: StateTransition[] = [];
  private lifecycleLogs: string[] = [];
  private metrics: {
    totalChunks: number;
    processedChunks: number;
    averageProcessingTime: number;
    totalProcessingTime: number;
    stateDistribution: Record<string, number>;
  };
  
  /**
   * Create a new QuantumChunkTracker instance
   */
  private constructor() {
    // Initialize metrics
    this.metrics = {
      totalChunks: 0,
      processedChunks: 0,
      averageProcessingTime: 0,
      totalProcessingTime: 0,
      stateDistribution: {
        [ChunkState.SUPERPOSED]: 0,
        [ChunkState.ENTANGLED]: 0,
        [ChunkState.COLLAPSED]: 0
      }
    };
    
    // Initialize periodic cleanup
    this.initializePeriodicCleanup();
    
    console.log(`[α/S+/🧩] Quantum Chunk Tracker initialized`);
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: Initialized`);
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): QuantumChunkTracker {
    if (!instance) {
      instance = new QuantumChunkTracker();
    }
    return instance;
  }
  
  /**
   * Add a lifecycle log entry for analysis
   * 
   * @param log The log entry to add
   */
  public addLog(log: string): void {
    if (log.includes(`[${LIFECYCLE_LOG_SYMBOL}]`)) {
      this.lifecycleLogs.push(log);
      this.processLogEntry(log);
    }
  }
  
  /**
   * Process a log entry to update tracker state
   * 
   * @param log The log entry to process
   */
  private processLogEntry(log: string): void {
    const event = parseLifecycleEvent(log);
    if (!event) return;
    
    switch (event.type) {
      case 'creation':
        if (event.id) {
          this.trackChunkCreation(event.id, event.state);
        }
        break;
        
      case 'routing':
        if (event.id && event.agent) {
          this.trackChunkRouting(event.id, event.agent);
        }
        break;
        
      case 'decoherence':
        if (event.id) {
          this.trackStateCollapse(event.id, event.selectedPossibility);
        }
        break;
        
      case 'entanglement':
        if (event.id1 && event.id2) {
          this.trackEntanglement(event.id1, event.id2);
        }
        break;
        
      case 'pipeline_complete':
        if (event.id) {
          this.trackPipelineCompletion(event.id, event.finalState);
        }
        break;
    }
  }
  
  /**
   * Track the creation of a new quantum chunk
   * 
   * @param id Chunk ID
   * @param state Initial chunk state
   */
  public trackChunkCreation(id: string, state?: Record<string, any>): void {
    if (!id) return;
    
    const chunk: TrackedChunk = {
      id,
      state: ChunkState.SUPERPOSED,
      createdAt: new Date(),
      lastUpdated: new Date(),
      routedTo: [],
      entangledWith: [],
      stateHistory: [{
        state: ChunkState.SUPERPOSED,
        timestamp: new Date()
      }]
    };
    
    // Add any extra state data
    if (state) {
      Object.assign(chunk, state);
    }
    
    this.chunks.set(id, chunk);
    
    // Update metrics
    this.metrics.totalChunks++;
    this.metrics.stateDistribution[ChunkState.SUPERPOSED]++;
    
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: ChunkCreated=${id}`);
  }
  
  /**
   * Track chunk routing to an agent
   * 
   * @param id Chunk ID
   * @param agent Agent the chunk was routed to
   */
  public trackChunkRouting(id: string, agent: string): void {
    if (!id || !agent) return;
    
    const chunk = this.chunks.get(id);
    if (!chunk) return;
    
    // Update chunk routing history
    chunk.routedTo.push({
      agent,
      timestamp: new Date()
    });
    
    chunk.handlingAgent = agent;
    chunk.lastUpdated = new Date();
    this.chunks.set(id, chunk);
    
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: ChunkRouted=${id}, Agent=${agent}`);
  }
  
  /**
   * Track state collapse (decoherence)
   * 
   * @param id Chunk ID
   * @param selectedPossibility The selected possibility
   */
  public trackStateCollapse(id: string, selectedPossibility?: string): void {
    if (!id) return;
    
    const chunk = this.chunks.get(id);
    if (!chunk) return;
    
    // Update state metrics
    this.metrics.stateDistribution[chunk.state]--;
    this.metrics.stateDistribution[ChunkState.COLLAPSED]++;
    
    // Record the state transition
    this.stateTransitions.push({
      chunkId: id,
      from: chunk.state,
      to: ChunkState.COLLAPSED,
      timestamp: new Date(),
      selectedPossibility
    });
    
    // Update chunk state
    chunk.state = ChunkState.COLLAPSED;
    chunk.selectedPossibility = selectedPossibility;
    chunk.lastUpdated = new Date();
    chunk.stateHistory.push({
      state: ChunkState.COLLAPSED,
      timestamp: new Date(),
      selectedPossibility
    });
    
    this.chunks.set(id, chunk);
    
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: ChunkCollapsed=${id}, Possibility=${selectedPossibility || 'unspecified'}`);
  }
  
  /**
   * Track entanglement between chunks
   * 
   * @param id1 First chunk ID
   * @param id2 Second chunk ID
   */
  public trackEntanglement(id1: string, id2: string): void {
    if (!id1 || !id2) return;
    
    const chunk1 = this.chunks.get(id1);
    const chunk2 = this.chunks.get(id2);
    
    if (!chunk1 || !chunk2) return;
    
    // Update state metrics for both chunks
    this.metrics.stateDistribution[chunk1.state]--;
    this.metrics.stateDistribution[chunk2.state]--;
    this.metrics.stateDistribution[ChunkState.ENTANGLED] += 2;
    
    // Record state transitions
    [
      { chunkId: id1, from: chunk1.state, to: ChunkState.ENTANGLED },
      { chunkId: id2, from: chunk2.state, to: ChunkState.ENTANGLED }
    ].forEach(transition => {
      this.stateTransitions.push({
        ...transition,
        timestamp: new Date()
      });
    });
    
    // Update both chunks
    [
      { chunk: chunk1, partnerId: id2 },
      { chunk: chunk2, partnerId: id1 }
    ].forEach(({chunk, partnerId}) => {
      chunk.state = ChunkState.ENTANGLED;
      chunk.entangledWith.push({
        partnerId,
        timestamp: new Date()
      });
      chunk.lastUpdated = new Date();
      chunk.stateHistory.push({
        state: ChunkState.ENTANGLED,
        timestamp: new Date(),
        partnerId
      });
      
      this.chunks.set(chunk.id, chunk);
    });
    
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: ChunksEntangled=${id1},${id2}`);
  }
  
  /**
   * Track completion of quantum pipeline for a chunk
   * 
   * @param id Chunk ID
   * @param finalState Final state of the chunk
   */
  public trackPipelineCompletion(id: string, finalState?: string): void {
    if (!id) return;
    
    const chunk = this.chunks.get(id);
    if (!chunk) return;
    
    // Calculate processing time
    const processingTime = new Date().getTime() - chunk.createdAt.getTime();
    
    // Update metrics
    this.metrics.processedChunks++;
    this.metrics.totalProcessingTime += processingTime;
    this.metrics.averageProcessingTime = this.metrics.totalProcessingTime / this.metrics.processedChunks;
    
    // Update chunk
    chunk.completed = true;
    chunk.completedAt = new Date();
    chunk.processingTime = processingTime;
    chunk.finalState = finalState;
    
    this.chunks.set(id, chunk);
    
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: PipelineComplete=${id}, FinalState=${finalState || 'unspecified'}, Time=${processingTime}ms`);
  }
  
  /**
   * Get a specific chunk by ID
   * 
   * @param id Chunk ID
   * @returns The chunk or undefined if not found
   */
  public getChunk(id: string): TrackedChunk | undefined {
    return this.chunks.get(id);
  }
  
  /**
   * Get all tracked chunks
   * 
   * @returns Array of all tracked chunks
   */
  public getAllChunks(): TrackedChunk[] {
    return Array.from(this.chunks.values());
  }
  
  /**
   * Get recent state transitions
   * 
   * @param limit Maximum number of transitions to return
   * @returns Recent state transitions
   */
  public getRecentTransitions(limit: number = 10): StateTransition[] {
    return this.stateTransitions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  /**
   * Get chunk throughput (chunks processed per minute)
   * 
   * @returns Chunks per minute
   */
  public getThroughput(): number {
    // Calculate throughput based on completed chunks
    const completedChunks = Array.from(this.chunks.values()).filter(c => c.completed);
    
    if (completedChunks.length < 2) return 0;
    
    // Sort by completion time
    completedChunks.sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return a.completedAt.getTime() - b.completedAt.getTime();
    });
    
    // Get first and last completion time (with null checks)
    const firstChunk = completedChunks[0];
    const lastChunk = completedChunks[completedChunks.length - 1];
    
    if (!firstChunk.completedAt || !lastChunk.completedAt) return 0;
    
    const firstCompletion = firstChunk.completedAt.getTime();
    const lastCompletion = lastChunk.completedAt.getTime();
    
    // Calculate time span in minutes
    const timeSpanMinutes = (lastCompletion - firstCompletion) / (1000 * 60);
    
    // Return chunks per minute
    return timeSpanMinutes > 0 ? Number((completedChunks.length / timeSpanMinutes).toFixed(2)) : 0;
  }
  
  /**
   * Get current backlog size (uncompleted chunks)
   * 
   * @returns Number of uncompleted chunks
   */
  public getBacklogSize(): number {
    return Array.from(this.chunks.values()).filter(c => !c.completed).length;
  }
  
  /**
   * Get average processing time for completed chunks
   * 
   * @returns Average processing time in milliseconds
   */
  public getAverageProcessingTime(): number {
    return this.metrics.averageProcessingTime;
  }
  
  /**
   * Get distribution of chunks across different states
   * 
   * @returns Count of chunks in each state
   */
  public getStateDistribution(): Record<string, number> {
    return { ...this.metrics.stateDistribution };
  }
  
  /**
   * Initialize periodic cleanup of old data to prevent memory leaks
   */
  private initializePeriodicCleanup(): void {
    // Run cleanup every hour
    setInterval(() => this.cleanupOldData(), 60 * 60 * 1000);
  }
  
  /**
   * Clean up old data (chunks and transitions)
   */
  private cleanupOldData(): void {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Clean up old transitions
    this.stateTransitions = this.stateTransitions.filter(t => t.timestamp > oneDayAgo);
    
    // Clean up old chunks that have been processed and are older than 24 hours
    for (const [id, chunk] of this.chunks.entries()) {
      if (
        (chunk.state === ChunkState.COLLAPSED) &&
        chunk.lastUpdated < oneDayAgo && 
        chunk.completed
      ) {
        this.chunks.delete(id);
      }
    }
    
    // Limit the size of the logs array
    if (this.lifecycleLogs.length > 1000) {
      this.lifecycleLogs = this.lifecycleLogs.slice(-1000);
    }
    
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: CleanupComplete, Remaining=${this.chunks.size}`);
  }
  
  /**
   * Clear all tracking data (for testing)
   */
  public clear(): void {
    this.chunks.clear();
    this.stateTransitions = [];
    this.lifecycleLogs = [];
    this.metrics = {
      totalChunks: 0,
      processedChunks: 0,
      averageProcessingTime: 0,
      totalProcessingTime: 0,
      stateDistribution: {
        [ChunkState.SUPERPOSED]: 0,
        [ChunkState.ENTANGLED]: 0,
        [ChunkState.COLLAPSED]: 0
      }
    };
    
    console.log(`[${LIFECYCLE_LOG_SYMBOL}] QuantumChunkTracker: Cleared`);
  }
}

/**
 * Get the singleton instance of QuantumChunkTracker
 * 
 * @returns The tracker instance
 */
export function getQuantumChunkTracker(): QuantumChunkTracker {
  return QuantumChunkTracker.getInstance();
}