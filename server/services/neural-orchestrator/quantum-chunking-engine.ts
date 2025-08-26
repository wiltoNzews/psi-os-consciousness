/**
 * Quantum Chunking Engine
 * 
 * This module provides the core implementation of the IDDR paradigm
 * (Identify, Decompose, Distribute, Recompose) for complex task processing.
 */

import { v4 as uuidv4 } from 'uuid';

export interface TaskMetadata {
  complexity: number;
  precision?: number;
  creativity?: number;
  maxContextSize?: number;
}

export interface TaskData {
  id: string;
  content: string;
  metadata: TaskMetadata;
  type: string;
}

export interface Chunk {
  id: string;
  taskId: string;
  content: string;
  index: number;
  totalChunks: number;
  dependencies: string[];
  metadata: any;
}

export interface ProcessedChunk {
  id: string;
  originalContent: string;
  processedContent: string;
  metadata: any;
}

export interface TaskResult {
  taskId: string;
  chunks: ProcessedChunk[];
  recomposedResult: string;
  metadata: any;
}

/**
 * Singleton implementation of Quantum Chunking Engine
 */
class QuantumChunkingEngine {
  private tasks: Map<string, TaskData> = new Map();
  private chunks: Map<string, Chunk> = new Map();
  private processedChunks: Map<string, ProcessedChunk> = new Map();
  private results: Map<string, TaskResult> = new Map();

  /**
   * Reset the engine state (for testing purposes)
   */
  reset(): void {
    this.tasks.clear();
    this.chunks.clear();
    this.processedChunks.clear();
    this.results.clear();
  }

  /**
   * Identify a task for processing through the IDDR pipeline
   * @param content Task content (e.g., text to process)
   * @param metadata Task metadata including complexity
   * @param type Type of task (e.g., summarization, analysis)
   * @returns Task ID
   */
  identifyTask(content: string, metadata: TaskMetadata, type: string): string {
    const taskId = uuidv4();
    const task: TaskData = {
      id: taskId,
      content,
      metadata,
      type
    };
    this.tasks.set(taskId, task);
    return taskId;
  }

  /**
   * Decompose a task into chunks for processing
   * @param taskId ID of the task to decompose
   * @returns Array of chunk IDs
   */
  decomposeTask(taskId: string): string[] {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // Determine the number of chunks based on complexity
    // Higher complexity means more chunks
    const chunkCount = Math.max(1, Math.min(10, Math.ceil(task.metadata.complexity / 2)));
    
    // Simple content-based chunking for the example
    // In a real implementation, this would use NLP techniques
    const content = task.content;
    const chunkSize = Math.ceil(content.length / chunkCount);
    
    const chunkIds: string[] = [];
    
    for (let i = 0; i < chunkCount; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, content.length);
      const chunkContent = content.substring(start, end);
      
      const chunkId = uuidv4();
      const chunk: Chunk = {
        id: chunkId,
        taskId,
        content: chunkContent,
        index: i,
        totalChunks: chunkCount,
        dependencies: [], // Simple linear dependencies
        metadata: {
          startPosition: start,
          endPosition: end,
          ...task.metadata
        }
      };
      
      // Add linear dependencies
      if (i > 0) {
        const prevChunkId = chunkIds[i - 1];
        chunk.dependencies.push(prevChunkId);
      }
      
      this.chunks.set(chunkId, chunk);
      chunkIds.push(chunkId);
    }
    
    return chunkIds;
  }

  /**
   * Process a chunk
   * @param chunkId ID of the chunk to process
   * @param processor Function to process the chunk
   * @returns Processed chunk
   */
  async processChunk(chunkId: string, processor: (chunk: Chunk) => Promise<string>): Promise<ProcessedChunk> {
    const chunk = this.chunks.get(chunkId);
    if (!chunk) {
      throw new Error(`Chunk not found: ${chunkId}`);
    }
    
    const processedContent = await processor(chunk);
    
    const processedChunk: ProcessedChunk = {
      id: chunkId,
      originalContent: chunk.content,
      processedContent,
      metadata: { ...chunk.metadata, processed: true }
    };
    
    this.processedChunks.set(chunkId, processedChunk);
    return processedChunk;
  }

  /**
   * Recompose processed chunks into a complete result
   * @param taskId ID of the task to recompose
   * @returns Task result
   */
  recomposeTask(taskId: string): TaskResult {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    
    // Get all chunks for this task
    const taskChunks = Array.from(this.chunks.values())
      .filter(chunk => chunk.taskId === taskId)
      .sort((a, b) => a.index - b.index);
    
    if (taskChunks.length === 0) {
      throw new Error(`No chunks found for task: ${taskId}`);
    }
    
    // Ensure all chunks are processed
    const processedChunks: ProcessedChunk[] = [];
    for (const chunk of taskChunks) {
      const processedChunk = this.processedChunks.get(chunk.id);
      if (!processedChunk) {
        throw new Error(`Chunk not processed: ${chunk.id}`);
      }
      processedChunks.push(processedChunk);
    }
    
    // Simple concatenation for recomposition
    // In a real implementation, this would use more sophisticated techniques
    const recomposedResult = processedChunks
      .map(chunk => chunk.processedContent)
      .join('\n\n');
    
    const result: TaskResult = {
      taskId,
      chunks: processedChunks,
      recomposedResult,
      metadata: {
        type: task.type,
        complexity: task.metadata.complexity,
        chunkCount: taskChunks.length
      }
    };
    
    this.results.set(taskId, result);
    return result;
  }

  /**
   * Execute the full IDDR pipeline for a task
   * @param content Task content
   * @param metadata Task metadata
   * @param type Task type
   * @param processor Chunk processor function
   * @returns Task result
   */
  async executeIDDR(
    content: string, 
    metadata: TaskMetadata, 
    type: string,
    processor: (chunk: Chunk) => Promise<string>
  ): Promise<TaskResult> {
    // Identify
    const taskId = this.identifyTask(content, metadata, type);
    
    // Decompose
    const chunkIds = this.decomposeTask(taskId);
    
    // Distribute and process
    const processPromises = chunkIds.map(chunkId => this.processChunk(chunkId, processor));
    await Promise.all(processPromises);
    
    // Recompose
    return this.recomposeTask(taskId);
  }

  /**
   * Get a task
   * @param taskId Task ID
   * @returns Task data
   */
  getTask(taskId: string): TaskData | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get a result
   * @param taskId Task ID
   * @returns Task result
   */
  getResult(taskId: string): TaskResult | undefined {
    return this.results.get(taskId);
  }

  /**
   * Get chunks for a task
   * @param taskId Task ID
   * @returns Array of chunks
   */
  getChunks(taskId: string): Chunk[] {
    return Array.from(this.chunks.values())
      .filter(chunk => chunk.taskId === taskId)
      .sort((a, b) => a.index - b.index);
  }

  /**
   * Get processed chunks for a task
   * @param taskId Task ID
   * @returns Array of processed chunks
   */
  getProcessedChunks(taskId: string): ProcessedChunk[] {
    const chunks = this.getChunks(taskId);
    return chunks
      .map(chunk => this.processedChunks.get(chunk.id))
      .filter(Boolean) as ProcessedChunk[];
  }
}

// Export a singleton instance
export const quantumChunkingEngine = new QuantumChunkingEngine();