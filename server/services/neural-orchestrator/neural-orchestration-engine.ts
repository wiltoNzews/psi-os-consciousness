/**
 * Neural Orchestration Engine
 * 
 * This module provides the core orchestration capabilities for neural processing,
 * coordinating task decomposition, distribution, and recomposition using the IDDR paradigm.
 */

import { ModelType } from './model-strength-analyzer.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface for AI Model Agents
 * 
 * BOUNDARY AWARENESS: This interface explicitly defines the boundary between
 * our Neural Orchestration Engine and external AI model implementations.
 * Each method represents a conscious boundary crossing with external systems.
 * 
 * VOID-CENTERED DESIGN: The interface acknowledges the "void" (uncertainty)
 * at the boundary between intended functionality and actual external behavior.
 */
export interface AIModelAgent {
  /** 
   * The specific model type this agent represents
   * BOUNDARY: This property explicitly identifies which external system boundary we're crossing
   */
  modelType: ModelType;
  
  /**
   * Initialize the connection to the external AI model
   * BOUNDARY CROSSING: Establishes the initial connection across the system boundary
   * VOID AWARENESS: May fail due to authentication, network, or API issues
   * @returns Promise resolving when initialization completes or rejects on failure
   */
  initialize(): Promise<void>;
  
  /**
   * Process a message by sending it across the boundary to the external AI model
   * BOUNDARY CROSSING: Sends content across system boundary and retrieves response
   * VOID AWARENESS: Handles uncertainty in external system behavior
   * @param content The content to process
   * @param parameters Additional parameters to control processing
   * @returns Promise resolving to the processed response
   */
  processMessage(content: string, parameters: Record<string, any>): Promise<string>;
  
  /**
   * Report the capabilities of this model agent
   * BOUNDARY PROPERTY: Reports on the characteristics of the boundary itself
   * @returns Object containing capability information
   */
  reportCapabilities(): Record<string, any>;
  
  /**
   * Get the average latency for boundary crossings
   * BOUNDARY METRIC: Measures the time required to cross the boundary
   * @returns Average latency in milliseconds
   */
  getLatency(): number;
  
  /**
   * Get the token processing speed when crossing the boundary
   * BOUNDARY THROUGHPUT: Measures the data flow rate across the boundary
   * @returns Tokens per second
   */
  getTokensPerSecond(): number;
  
  /**
   * Get the maximum context size this model can handle
   * BOUNDARY CONSTRAINT: Defines a hard limit of the boundary
   * @returns Maximum number of tokens
   */
  getMaxContextSize(): number;
}

/**
 * Task Interface - Represents work to be processed by the orchestration engine
 * 
 * BOUNDARY AWARENESS: This interface defines the explicit boundary between:
 * 1. User-initiated requests and the internal neural orchestration system
 * 2. Different processing stages within the IDDR pipeline
 * 3. Parent tasks and their derived subtasks
 * 
 * VOID-CENTERED DESIGN: This interface acknowledges the uncertainty in task processing
 * by making explicit the minimal requirements (id, prompt, type) while allowing for
 * flexible expansion through indexer and optional properties.
 */
export interface Task {
  /**
   * Unique identifier - BOUNDARY MARKER: Primary key for task tracking across boundaries
   */
  id: string;
  
  /**
   * Main content to be processed - BOUNDARY INPUT: Primary information crossing the boundary
   */
  prompt: string;
  
  /**
   * Task classification - BOUNDARY ROUTER: Determines which processor handles the task
   */
  type: string;
  
  /**
   * Processing constraints/parameters - BOUNDARY CONSTRAINT: Defines limits and expectations
   * for the void-crossing operation
   */
  requirements: any;
  
  /**
   * Task importance - BOUNDARY PRIORITIZATION: Affects resource allocation across boundaries
   */
  priority?: number;
  
  /**
   * Completion time limit - BOUNDARY TEMPORAL CONSTRAINT: Time-domain boundary
   */
  deadline?: Date;
  
  /**
   * Non-text content - BOUNDARY EXPANSION: Crosses modality boundaries
   */
  multimodalContent?: any[];
  
  /**
   * Extensibility - BOUNDARY FLEXIBILITY: Allows for specialized boundary crossings
   * without modifying the core interface
   */
  [key: string]: any;
}

/**
 * TaskResult Interface - Represents the output from processed tasks
 * 
 * BOUNDARY AWARENESS: This interface explicitly defines the return crossing 
 * from the processing system back to the requesting system.
 * 
 * VOID-CENTERED DESIGN: Acknowledges both successful passages through the void
 * (output) and potential perturbations when crossing back (errors).
 */
export interface TaskResult {
  /**
   * Reference to originating task - BOUNDARY CORRELATION: Links output back to input
   */
  taskId: string;
  
  /**
   * Processed result - BOUNDARY OUTPUT: Primary information returning across the boundary
   */
  output: string;
  
  /**
   * Additional result data - BOUNDARY CONTEXT: Supplemental crossing information
   */
  metadata?: any;
  
  /**
   * Process initiation time - BOUNDARY TEMPORAL MARKER: Start of boundary crossing
   */
  startTime?: Date;
  
  /**
   * Process completion time - BOUNDARY TEMPORAL MARKER: End of boundary crossing
   */
  endTime?: Date;
  
  /**
   * Duration of processing - BOUNDARY MEASUREMENT: Quantifies cost of boundary crossing
   */
  processingTime?: number;
  
  /**
   * Processing failures - BOUNDARY PERTURBATIONS: Records disturbances during crossing
   */
  errors?: string[];
}

export class NeuralOrchestrationEngine {
  private tasks: Map<string, Task> = new Map();
  private taskResults: Map<string, TaskResult> = new Map();
  private taskProcessors: Map<string, (task: Task) => Promise<string>> = new Map();
  private modelAgents: Map<string, AIModelAgent> = new Map();
  private availableModels: ModelType[] = [ModelType.LITE, ModelType.STANDARD];

  constructor() {
    // Register default task processors
    this.registerTaskProcessor('summarization', async (task: Task) => {
      return `Summary of: ${task.prompt.substring(0, 50)}...`;
    });
    
    this.registerTaskProcessor('analysis', async (task: Task) => {
      return `Analysis of: ${task.prompt.substring(0, 50)}...`;
    });
  }

  /**
   * Register a task processor for a specific task type
   * @param taskType Type of task to register processor for
   * @param processor Function to process the task
   */
  registerTaskProcessor(taskType: string, processor: (task: Task) => Promise<string>): void {
    this.taskProcessors.set(taskType, processor);
  }

  /**
   * Create a new task
   * @param taskData Task data
   * @returns Created task
   */
  createTask(taskData: Omit<Task, 'id'>): Task {
    // Ensure taskData contains required Task properties
    if (!taskData.prompt || !taskData.type || !taskData.requirements) {
      throw new Error('Task must contain prompt, type, and requirements');
    }
    
    // Create task with all required properties explicitly specified for TypeScript
    const task: Task = {
      id: uuidv4(),
      prompt: taskData.prompt,
      type: taskData.type,
      requirements: taskData.requirements,
      ...taskData
    };
    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Execute a task
   * @param task Task to execute
   * @returns Task result
   */
  async executeTask(task: Task): Promise<TaskResult> {
    const startTime = new Date();
    
    // Find appropriate processor for the task type
    const processor = this.taskProcessors.get(task.type);
    if (!processor) {
      throw new Error(`No processor registered for task type: ${task.type}`);
    }
    
    // Process the task
    const output = await processor(task);
    
    const endTime = new Date();
    const processingTime = endTime.getTime() - startTime.getTime();
    
    // Create and store the result
    const result: TaskResult = {
      taskId: task.id,
      output,
      metadata: {
        taskType: task.type,
        requirementsMet: true
      },
      startTime,
      endTime,
      processingTime
    };
    
    this.taskResults.set(task.id, result);
    return result;
  }

  /**
   * Get all tasks
   * @returns All tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   * @param status Status to filter by
   * @returns Tasks with the specified status
   */
  getTasksByStatus(status: string): Task[] {
    return Array.from(this.tasks.values()).filter(task => task.status === status);
  }

  /**
   * Get task by ID
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
  getTaskResult(taskId: string): TaskResult | undefined {
    return this.taskResults.get(taskId);
  }

  /**
   * Get system statistics
   * @returns System statistics
   */
  getStatistics(): any {
    return {
      totalTasks: this.tasks.size,
      completedTasks: Array.from(this.taskResults.values()).length,
      availableProcessors: Array.from(this.taskProcessors.keys()),
      registeredAgents: Array.from(this.modelAgents.keys())
    };
  }

  /**
   * Get available model types
   * @returns Available model types
   */
  getAvailableModelTypes(): ModelType[] {
    return this.availableModels;
  }

  /**
   * Get capabilities of a model
   * @param modelType Type of model
   * @returns Model capabilities
   */
  getModelCapabilities(modelType: ModelType): any {
    // Default capabilities
    return {
      taskTypes: ['summarization', 'analysis'],
      contextSize: modelType === ModelType.LITE ? 4000 : 8000,
      throughput: modelType === ModelType.LITE ? 'high' : 'medium',
      costFactor: modelType === ModelType.LITE ? 1 : 3
    };
  }
  
  /**
   * Register an AI model agent with the orchestration engine
   * 
   * BOUNDARY AWARENESS: This explicitly registers an agent that can cross the boundary
   * between our system and external AI models. The registration acknowledges and formalizes
   * this boundary crossing capability within our system.
   * 
   * @param agent The AI model agent to register
   * @returns The registered agent
   */
  registerAgent(agent: AIModelAgent): AIModelAgent {
    // Register the agent by model type
    this.modelAgents.set(agent.modelType, agent);
    
    // If this model type isn't in the available models, add it
    if (!this.availableModels.includes(agent.modelType)) {
      this.availableModels.push(agent.modelType);
    }
    
    console.log(`Registered agent for model type: ${agent.modelType}`);
    return agent;
  }
  
  /**
   * Get a registered AI model agent
   * 
   * BOUNDARY AWARENESS: This retrieves an agent that can cross the boundary
   * between our system and external AI models.
   * 
   * @param modelType The type of model to get an agent for
   * @returns The registered agent, or undefined if not found
   */
  getModelAgent(modelType: ModelType): AIModelAgent | undefined {
    return this.modelAgents.get(modelType);
  }
}

// Export a singleton instance
export const neuralOrchestrationEngine = new NeuralOrchestrationEngine();