/**
 * Persistent Neural Orchestration Engine
 * 
 * This module extends the base Neural Orchestration Engine with persistence
 * capabilities, allowing it to maintain state across sessions and integrate
 * with the Persistent Context Service.
 */

import { v4 as uuidv4 } from 'uuid';
import { NeuralOrchestrationEngine, Task as BaseTask, TaskResult } from './neural-orchestration-engine.js';
import { quantumChunkingEngine, Chunk } from './quantum-chunking-engine.js';
import { ModelType, modelStrengthAnalyzer } from './model-strength-analyzer.js';
import { IPersistentContextService } from '../context-manager.js';
import { CognitiveLayer, HistoryChunk } from '../context-manager.js';

/**
 * Extended Task interface for persistent tasks
 */
export interface Task extends BaseTask {
  sessionId?: string;
  contextId?: string;
  parentTaskId?: string;
  subtasks?: string[];
  deadline?: Date;
  priority?: number;
  modelPreference?: ModelType;
}

/**
 * Extended TaskResult interface for persistent results
 */
export interface PersistentTaskResult extends TaskResult {
  sessionId?: string;
  contextId?: string;
  modelUsed?: ModelType;
  executionTime?: number;
  subtaskResults?: TaskResult[];
}

/**
 * Task metadata interface for describing task processing requirements
 */
export interface TaskMetadata {
  complexity: number;
  precision: number;
  creativity: number;
  maxContextSize: number;
}

/**
 * Task status enum
 */
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Class for the Persistent Neural Orchestration Engine
 * Implements the IDDR paradigm with persistence
 */
export class PersistentNeuralOrchestrationEngine {
  private baseEngine: NeuralOrchestrationEngine;
  private persistentContextService: IPersistentContextService;
  private tasks: Map<string, Task> = new Map();
  private taskResults: Map<string, PersistentTaskResult> = new Map();
  private taskStatus: Map<string, TaskStatus> = new Map();
  private chunkProcessors: Map<string, (chunk: Chunk) => Promise<string>> = new Map();
  
  /**
   * Private constructor to enforce singleton pattern
   * @param contextService Persistent context service
   */
  private constructor(contextService: IPersistentContextService) {
    this.baseEngine = new NeuralOrchestrationEngine();
    this.persistentContextService = contextService;
    
    // Register default chunk processors
    this.registerChunkProcessor('summarization', this.processChunkSummarization.bind(this));
    this.registerChunkProcessor('analysis', this.processChunkAnalysis.bind(this));
    this.registerChunkProcessor('generation', this.processChunkGeneration.bind(this));
    this.registerChunkProcessor('extraction', this.processChunkExtraction.bind(this));
    this.registerChunkProcessor('classification', this.processChunkClassification.bind(this));
  }
  
  /**
   * Factory method to create a persistent orchestration engine
   * @param contextService Persistent context service
   * @returns PersistentNeuralOrchestrationEngine instance
   */
  public static create(contextService: IPersistentContextService): PersistentNeuralOrchestrationEngine {
    return new PersistentNeuralOrchestrationEngine(contextService);
  }
  
  /**
   * Register a chunk processor for a specific task type
   * @param taskType Type of task
   * @param processor Function to process chunks
   */
  registerChunkProcessor(taskType: string, processor: (chunk: Chunk) => Promise<string>): void {
    this.chunkProcessors.set(taskType, processor);
  }
  
  /**
   * Create a new task with persistent context
   * @param sessionId Session ID
   * @param taskData Task data
   * @returns Created task
   */
  async createTask(sessionId: string, taskData: Omit<Task, 'id'>): Promise<Task> {
    // Initialize session if needed
    await this.ensureSession(sessionId);
    
    // Ensure taskData contains required Task properties
    if (!taskData.prompt || !taskData.type || !taskData.requirements) {
      throw new Error('Task must contain prompt, type, and requirements');
    }
    
    // Create task with ID and all required properties explicitly specified for TypeScript
    const task: Task = {
      id: uuidv4(),
      prompt: taskData.prompt,
      type: taskData.type,
      requirements: taskData.requirements,
      ...taskData,
      sessionId
    };
    
    // Store task
    this.tasks.set(task.id, task);
    this.taskStatus.set(task.id, TaskStatus.PENDING);
    
    // Add task to history
    await this.addTaskToHistory(sessionId, task);
    
    return task;
  }
  
  /**
   * Execute a task using the IDDR paradigm with persistence
   * @param task Task to execute
   * @returns Task result
   */
  async executeTask(task: Task): Promise<PersistentTaskResult> {
    const sessionId = task.sessionId;
    if (!sessionId) {
      throw new Error('Session ID is required for persistent task execution');
    }
    
    // Update status
    this.taskStatus.set(task.id, TaskStatus.IN_PROGRESS);
    
    try {
      // Decide on model to use based on task requirements
      const modelType = task.modelPreference || ModelType.STANDARD;
      
      // Record start time
      const startTime = new Date();
      
      // Process task with appropriate engine based on type
      let result: PersistentTaskResult;
      
      // Use Quantum Chunking Engine for processing
      result = await this.processWithQuantumChunking(task, modelType);
      
      // Record end time and execution time
      const endTime = new Date();
      const executionTime = endTime.getTime() - startTime.getTime();
      
      // Enhance result with persistence data
      result = {
        ...result,
        sessionId,
        modelUsed: modelType,
        executionTime
      };
      
      // Store result
      this.taskResults.set(task.id, result);
      this.taskStatus.set(task.id, TaskStatus.COMPLETED);
      
      // Add result to history
      await this.addResultToHistory(sessionId, task, result);
      
      return result;
    } catch (error) {
      // Update status to failed
      this.taskStatus.set(task.id, TaskStatus.FAILED);
      
      // Create error result
      const errorResult: PersistentTaskResult = {
        taskId: task.id,
        output: `Error: ${(error as Error).message}`,
        metadata: {
          error: (error as Error).message,
          stack: (error as Error).stack
        },
        sessionId
      };
      
      // Store error result
      this.taskResults.set(task.id, errorResult);
      
      // Add error to history
      await this.addErrorToHistory(sessionId, task, error as Error);
      
      // Re-throw the error
      throw error;
    }
  }
  
  /**
   * Process a task using the Quantum Chunking Engine
   * @param task Task to process
   * @param modelType Model type to use
   * @returns Task result
   */
  private async processWithQuantumChunking(task: Task, modelType: ModelType): Promise<PersistentTaskResult> {
    const { prompt, type, requirements } = task;
    
    // Get processor for task type
    const processor = this.chunkProcessors.get(type || 'analysis');
    if (!processor) {
      throw new Error(`No processor registered for task type: ${type}`);
    }
    
    // Determine task metadata based on requirements or use defaults
    let metadata: TaskMetadata;
    
    if (requirements) {
      // Use provided requirements
      metadata = {
        complexity: requirements.complexity || 5,
        precision: requirements.precision || 5,
        creativity: requirements.creativity || 3,
        maxContextSize: requirements.contextSize || 8000
      };
    } else {
      // Use default metadata based on task type
      switch (type) {
        case 'summarization':
          metadata = {
            complexity: 4,
            precision: 6,
            creativity: 2,
            maxContextSize: 8000
          };
          break;
        case 'analysis':
          metadata = {
            complexity: 7,
            precision: 7,
            creativity: 4,
            maxContextSize: 12000
          };
          break;
        case 'generation':
          metadata = {
            complexity: 5,
            precision: 4,
            creativity: 8,
            maxContextSize: 8000
          };
          break;
        case 'extraction':
          metadata = {
            complexity: 6,
            precision: 8,
            creativity: 2,
            maxContextSize: 16000
          };
          break;
        case 'classification':
          metadata = {
            complexity: 5,
            precision: 7,
            creativity: 3,
            maxContextSize: 8000
          };
          break;
        default:
          metadata = {
            complexity: 5,
            precision: 5,
            creativity: 3,
            maxContextSize: 8000
          };
      }
    }
    
    // Determine if we should use the model provided or let the analyzer choose
    let selectedModelType = modelType;
    
    if (!task.modelPreference) {
      // Let the analyzer choose the best model based on task requirements
      const requirementsScore = {
        complexity: metadata.complexity,
        precision: metadata.precision || 5,
        creativity: metadata.creativity || 3,
        contextSize: metadata.maxContextSize || 8000,
        speed: task.priority ? 10 - task.priority : 5, // Higher priority = higher speed requirement
        cost: task.priority ? task.priority : 5 // Higher priority = willing to pay more
      };
      
      selectedModelType = modelStrengthAnalyzer.findBestModelForRequirements(requirementsScore);
      console.log(`Selected model ${selectedModelType} for task type ${type} based on requirements`);
    }
    
    // Execute IDDR pipeline
    const result = await quantumChunkingEngine.executeIDDR(prompt, metadata, type || 'analysis', processor);
    
    // Include enhanced metadata in the result
    return {
      taskId: task.id,
      output: result.recomposedResult,
      metadata: {
        ...result.metadata,
        chunkCount: result.chunks.length,
        modelType: selectedModelType,
        taskMetadata: metadata,
        processingDetails: {
          decompositionStrategy: `${result.chunks.length} chunks using adaptive IDDR paradigm`,
          processingTime: result.metadata?.processingTime || 0,
          modelStrengthScore: modelStrengthAnalyzer.evaluateModelForRequirements({
            complexity: metadata.complexity,
            precision: metadata.precision || 5,
            creativity: metadata.creativity || 3,
            contextSize: metadata.maxContextSize || 8000,
            speed: 5,
            cost: 5
          }, selectedModelType)
        }
      }
    };
  }
  
  /**
   * Process a summarization chunk
   * @param chunk Chunk to process
   * @returns Processed content
   */
  private async processChunkSummarization(chunk: Chunk): Promise<string> {
    try {
      // Get content from chunk
      const content = chunk.content;
      
      // Define OpenAI API parameters
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a summarization expert. Create a concise, comprehensive summary of the provided text while preserving key information and insights."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      };
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Extract and return the summary from the response
      const responseData = await response.json();
      const summary = responseData.choices[0].message.content.trim();
      
      return summary;
    } catch (error) {
      console.error('Error processing summarization chunk:', error);
      // Fallback to basic processing in case of API error
      return `Summary: ${chunk.content.substring(0, 100)}${chunk.content.length > 100 ? '...' : ''} [Error encountered during processing]`;
    }
  }
  
  /**
   * Process an analysis chunk
   * @param chunk Chunk to process
   * @returns Processed content
   */
  private async processChunkAnalysis(chunk: Chunk): Promise<string> {
    try {
      // Get content from chunk
      const content = chunk.content;
      
      // Define OpenAI API parameters
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an analytical expert. Provide a detailed analysis of the provided text, identifying key patterns, insights, and relationships. Focus on depth, context, and implications."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      };
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Extract and return the analysis from the response
      const responseData = await response.json();
      const analysis = responseData.choices[0].message.content.trim();
      
      return analysis;
    } catch (error) {
      console.error('Error processing analysis chunk:', error);
      // Fallback to basic processing in case of API error
      return `Analysis: ${chunk.content.substring(0, 100)}${chunk.content.length > 100 ? '...' : ''} [Error encountered during processing]`;
    }
  }
  
  /**
   * Process a content generation chunk
   * @param chunk Chunk to process
   * @returns Processed content
   */
  private async processChunkGeneration(chunk: Chunk): Promise<string> {
    try {
      // Get content from chunk
      const content = chunk.content;
      
      // Define OpenAI API parameters
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a creative content generator. Create engaging, original content based on the provided context or instructions. Focus on coherence, relevance, and depth."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      };
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Extract and return the generated content from the response
      const responseData = await response.json();
      const generatedContent = responseData.choices[0].message.content.trim();
      
      return generatedContent;
    } catch (error) {
      console.error('Error processing generation chunk:', error);
      // Fallback to basic processing in case of API error
      return `Generated Content: ${chunk.content.substring(0, 100)}${chunk.content.length > 100 ? '...' : ''} [Error encountered during processing]`;
    }
  }
  
  /**
   * Process an extraction chunk
   * @param chunk Chunk to process
   * @returns Processed content
   */
  private async processChunkExtraction(chunk: Chunk): Promise<string> {
    try {
      // Get content from chunk
      const content = chunk.content;
      
      // Define OpenAI API parameters
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an information extraction expert. Extract key facts, entities, relationships, and structured data from the provided text. Present the extracted information in a clear, organized format."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      };
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Extract and return the extraction results from the response
      const responseData = await response.json();
      const extractedInfo = responseData.choices[0].message.content.trim();
      
      return extractedInfo;
    } catch (error) {
      console.error('Error processing extraction chunk:', error);
      // Fallback to basic processing in case of API error
      return `Extracted Information: ${chunk.content.substring(0, 100)}${chunk.content.length > 100 ? '...' : ''} [Error encountered during processing]`;
    }
  }
  
  /**
   * Process a classification chunk
   * @param chunk Chunk to process
   * @returns Processed content
   */
  private async processChunkClassification(chunk: Chunk): Promise<string> {
    try {
      // Get content from chunk
      const content = chunk.content;
      
      // Define OpenAI API parameters
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a classification expert. Categorize the provided content according to relevant taxonomies, identify themes, topics, sentiment, and other classification metrics. Provide justification for your classifications."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      };
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
      
      // Extract and return the classification from the response
      const responseData = await response.json();
      const classification = responseData.choices[0].message.content.trim();
      
      return classification;
    } catch (error) {
      console.error('Error processing classification chunk:', error);
      // Fallback to basic processing in case of API error
      return `Classification: ${chunk.content.substring(0, 100)}${chunk.content.length > 100 ? '...' : ''} [Error encountered during processing]`;
    }
  }
  
  /**
   * Ensure a session exists
   * @param sessionId Session ID
   */
  private async ensureSession(sessionId: string): Promise<void> {
    const context = await this.persistentContextService.loadContext(sessionId);
    if (!context) {
      await this.persistentContextService.initializeSession(sessionId);
    }
  }
  
  /**
   * Initialize a new session
   * @param sessionId Session ID
   * @returns Promise resolving when the session is initialized
   */
  public async initializeSession(sessionId: string): Promise<void> {
    try {
      // Use the persistent context service to initialize the session
      await this.persistentContextService.initializeSession(sessionId);
      console.log(`Session initialized: ${sessionId}`);
    } catch (error) {
      console.error(`Error initializing session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a task to the session history
   * @param sessionId Session ID
   * @param task Task to add
   */
  private async addTaskToHistory(sessionId: string, task: Task): Promise<void> {
    const historyChunk: HistoryChunk = {
      chunkId: uuidv4(),
      content: `Task created: ${task.type} - ${task.prompt.substring(0, 50)}${task.prompt.length > 50 ? '...' : ''}`,
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      timestamp: new Date(),
      taskId: task.id,
      tags: ['task', task.type || 'general']
    };
    
    await this.persistentContextService.addHistoryChunk(sessionId, historyChunk);
  }
  
  /**
   * Add a result to the session history
   * @param sessionId Session ID
   * @param task Task
   * @param result Task result
   */
  private async addResultToHistory(sessionId: string, task: Task, result: PersistentTaskResult): Promise<void> {
    const historyChunk: HistoryChunk = {
      chunkId: uuidv4(),
      content: `Task completed: ${task.type} - ${result.output.substring(0, 50)}${result.output.length > 50 ? '...' : ''}`,
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      timestamp: new Date(),
      taskId: task.id,
      tags: ['result', task.type || 'general', 'completed']
    };
    
    await this.persistentContextService.addHistoryChunk(sessionId, historyChunk);
  }
  
  /**
   * Add an error to the session history
   * @param sessionId Session ID
   * @param task Task
   * @param error Error
   */
  private async addErrorToHistory(sessionId: string, task: Task, error: Error): Promise<void> {
    const historyChunk: HistoryChunk = {
      chunkId: uuidv4(),
      content: `Task failed: ${task.type} - ${error.message}`,
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      timestamp: new Date(),
      taskId: task.id,
      tags: ['error', task.type || 'general', 'failed']
    };
    
    await this.persistentContextService.addHistoryChunk(sessionId, historyChunk);
  }
  
  /**
   * Get all tasks for a session
   * @param sessionId Session ID
   * @returns Array of tasks
   */
  async getSessionTasks(sessionId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.sessionId === sessionId);
  }
  
  /**
   * Get a task by ID
   * @param taskId Task ID
   * @returns Task if found, undefined otherwise
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }
  
  /**
   * Get task result by task ID
   * @param taskId Task ID
   * @returns Task result if found, undefined otherwise
   */
  getTaskResult(taskId: string): PersistentTaskResult | undefined {
    return this.taskResults.get(taskId);
  }
  
  /**
   * Get task status by task ID
   * @param taskId Task ID
   * @returns Task status if found, undefined otherwise
   */
  getTaskStatus(taskId: string): TaskStatus | undefined {
    return this.taskStatus.get(taskId);
  }
  
  /**
   * Reset the engine state (for testing purposes)
   */
  reset(): void {
    this.tasks.clear();
    this.taskResults.clear();
    this.taskStatus.clear();
    quantumChunkingEngine.reset();
  }
  
  /**
   * Get system statistics
   * @returns System statistics
   */
  getStatistics(): any {
    const tasksByStatus = new Map<TaskStatus, number>();
    
    for (const status of Object.values(TaskStatus)) {
      tasksByStatus.set(status as TaskStatus, 0);
    }
    
    Array.from(this.taskStatus.values()).forEach(status => {
      tasksByStatus.set(status, (tasksByStatus.get(status) || 0) + 1);
    });
    
    return {
      totalTasks: this.tasks.size,
      completedTasks: tasksByStatus.get(TaskStatus.COMPLETED) || 0,
      failedTasks: tasksByStatus.get(TaskStatus.FAILED) || 0,
      pendingTasks: tasksByStatus.get(TaskStatus.PENDING) || 0,
      inProgressTasks: tasksByStatus.get(TaskStatus.IN_PROGRESS) || 0,
      cancelledTasks: tasksByStatus.get(TaskStatus.CANCELLED) || 0,
      averageExecutionTime: this.calculateAverageExecutionTime(),
      modelUsage: this.calculateModelUsage()
    };
  }
  
  /**
   * Calculate average execution time
   * @returns Average execution time in milliseconds
   */
  private calculateAverageExecutionTime(): number {
    const results = Array.from(this.taskResults.values())
      .filter(result => result.executionTime !== undefined);
    
    if (results.length === 0) {
      return 0;
    }
    
    const totalTime = results.reduce((sum, result) => sum + (result.executionTime || 0), 0);
    return totalTime / results.length;
  }
  
  /**
   * Calculate model usage
   * @returns Model usage statistics
   */
  private calculateModelUsage(): Record<ModelType, number> {
    const usage: Partial<Record<ModelType, number>> = {};
    
    for (const modelType of Object.values(ModelType)) {
      usage[modelType] = 0;
    }
    
    Array.from(this.taskResults.values()).forEach(result => {
      if (result.modelUsed) {
        usage[result.modelUsed] = (usage[result.modelUsed] || 0) + 1;
      }
    });
    
    return usage as Record<ModelType, number>;
  }
}

/**
 * Create a persistent orchestration engine with the provided context service
 * @param contextService Persistent context service
 * @returns PersistentNeuralOrchestrationEngine instance
 */
export function createPersistentOrchestrationEngine(
  contextService: IPersistentContextService
): PersistentNeuralOrchestrationEngine {
  return PersistentNeuralOrchestrationEngine.create(contextService);
}