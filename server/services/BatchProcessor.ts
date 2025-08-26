/**
 * Batch Processor Service
 * 
 * This service combines multiple API requests into batches to optimize costs
 * by leveraging the batch processing discounts offered by LLM providers.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { budgetForecaster } from './AdaptiveBudgetForecaster.js';

/**
 * Request interface
 */
export interface BatchRequest {
  id: string;
  model: string;
  content: string;
  priority: number;
  maxBatchSize?: number;
  maxWaitTime?: number;
  createdAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Response interface
 */
export interface BatchResponse {
  requestId: string;
  response: string;
  model: string;
  tokenCount: {
    input: number;
    output: number;
  };
  cost: number;
  processingTime: number;
  batchId?: string;
  wasBatched: boolean;
  savedCost?: number;
  createdAt: Date;
}

/**
 * Batch interface
 */
export interface Batch {
  id: string;
  model: string;
  requests: BatchRequest[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  tokenCount?: {
    input: number;
    output: number;
  };
  cost?: number;
  individualCostEstimate?: number;
  savedCost?: number;
  error?: string;
}

/**
 * Statistics interface
 */
export interface BatchStats {
  totalRequests: number;
  totalBatches: number;
  totalSavedCost: number;
  averageBatchSize: number;
  averageSavingsPerBatch: number;
  averageSavingsPercentage: number;
  modelStats: Record<string, {
    requests: number;
    batches: number;
    averageBatchSize: number;
    savedCost: number;
  }>;
}

/**
 * Configuration interface
 */
export interface BatchProcessorConfig {
  defaultBatchSize?: number;
  maxBatchSize?: number;
  defaultWaitTime?: number;
  maxWaitTime?: number;
  batchingThreshold?: number;
  savingsPercentage?: number;
  enabledModels?: string[];
  autoFlushInterval?: number;
  priorityLevels?: {
    low: number;
    normal: number;
    high: number;
    critical: number;
  };
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: BatchProcessorConfig = {
  defaultBatchSize: 5,
  maxBatchSize: 20,
  defaultWaitTime: 500, // ms
  maxWaitTime: 2000, // ms
  batchingThreshold: 2, // minimum number of requests to create a batch
  savingsPercentage: 0.5, // 50% discount for batched requests
  enabledModels: ['GPT-4o', 'GPT-4o-mini', 'GPT-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  autoFlushInterval: 1000, // ms
  priorityLevels: {
    low: 0,
    normal: 50,
    high: 75,
    critical: 100
  }
};

/**
 * Calculate token counts for content (simplified estimation)
 * In a real implementation, this would use a proper tokenizer
 */
function estimateTokenCount(content: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(content.length / 4);
}

/**
 * Estimates cost for a request based on model and token count
 * This is a simplified version; real implementation would use provider-specific pricing
 */
function estimateCost(model: string, inputTokens: number, outputTokens: number = 0): number {
  // Simplified pricing model (per 1K tokens)
  const pricing: Record<string, { input: number; output: number }> = {
    'GPT-4o': { input: 0.01, output: 0.03 },
    'GPT-4o-mini': { input: 0.00015, output: 0.0006 },
    'GPT-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    // Default pricing if model not found
    'default': { input: 0.005, output: 0.015 }
  };

  // Get model pricing or default
  const modelPricing = pricing[model] || pricing['default'];
  
  // Calculate cost
  const inputCost = (inputTokens / 1000) * modelPricing.input;
  const outputCost = (outputTokens / 1000) * modelPricing.output;
  
  return inputCost + outputCost;
}

/**
 * BatchProcessor class for optimizing API calls by batching
 */
export class BatchProcessor {
  private pendingRequests: Map<string, BatchRequest[]> = new Map();
  private activeBatches: Map<string, Batch> = new Map();
  private completedBatches: Batch[] = [];
  private pendingResponses: Map<string, BatchResponse> = new Map();
  private config: BatchProcessorConfig;
  private flushTimers: Map<string, NodeJS.Timeout> = new Map();
  private stats: BatchStats = {
    totalRequests: 0,
    totalBatches: 0,
    totalSavedCost: 0,
    averageBatchSize: 0,
    averageSavingsPerBatch: 0,
    averageSavingsPercentage: 0,
    modelStats: {}
  };
  
  constructor(config: Partial<BatchProcessorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    console.log('Batch Processor initialized with config:', {
      defaultBatchSize: this.config.defaultBatchSize,
      maxBatchSize: this.config.maxBatchSize,
      defaultWaitTime: this.config.defaultWaitTime,
      maxWaitTime: this.config.maxWaitTime,
      enabledModels: this.config.enabledModels?.length,
      autoFlushInterval: this.config.autoFlushInterval
    });
  }
  
  /**
   * Add a request to the batch processor
   *
   * @param model The model to use
   * @param content The request content
   * @param options Additional options
   * @returns The request ID
   */
  async addRequest(
    model: string,
    content: string,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'critical' | number;
      maxBatchSize?: number;
      maxWaitTime?: number;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<string> {
    // Check if model is supported for batching
    if (!this.isModelSupported(model)) {
      throw new Error(`Model ${model} is not supported for batching`);
    }
    
    // Generate request ID
    const requestId = uuidv4();
    
    // Determine priority
    let priority: number;
    if (typeof options.priority === 'number') {
      priority = options.priority;
    } else if (typeof options.priority === 'string') {
      priority = this.config.priorityLevels?.[options.priority] || 
                 DEFAULT_CONFIG.priorityLevels?.[options.priority] || 
                 DEFAULT_CONFIG.priorityLevels?.normal || 
                 50;
    } else {
      priority = DEFAULT_CONFIG.priorityLevels?.normal || 50;
    }
    
    // Create request object
    const request: BatchRequest = {
      id: requestId,
      model,
      content,
      priority,
      maxBatchSize: options.maxBatchSize || this.config.defaultBatchSize,
      maxWaitTime: options.maxWaitTime || this.config.defaultWaitTime,
      createdAt: new Date(),
      metadata: options.metadata
    };
    
    // Initialize model stats if needed
    if (!this.stats.modelStats[model]) {
      this.stats.modelStats[model] = {
        requests: 0,
        batches: 0,
        averageBatchSize: 0,
        savedCost: 0
      };
    }
    
    // Update stats
    this.stats.totalRequests++;
    this.stats.modelStats[model].requests++;
    
    // Add request to pending requests for the model
    if (!this.pendingRequests.has(model)) {
      this.pendingRequests.set(model, []);
      
      // Start auto-flush timer for this model
      if (this.config.autoFlushInterval && this.config.autoFlushInterval > 0) {
        const timer = setTimeout(() => {
          this.flushModelRequests(model);
        }, this.config.autoFlushInterval);
        
        this.flushTimers.set(model, timer);
      }
    }
    
    this.pendingRequests.get(model)?.push(request);
    
    // Check if we have enough requests to create a batch
    const pendingCount = this.pendingRequests.get(model)?.length || 0;
    const threshold = this.config.batchingThreshold || DEFAULT_CONFIG.batchingThreshold || 2;
    
    if (pendingCount >= threshold) {
      // Try to create batches
      this.createBatches(model);
    }
    
    return requestId;
  }
  
  /**
   * Process a batch of requests
   *
   * @param batchId The batch ID to process
   * @param processFunction The function to process the batch
   * @returns The processing results
   */
  async processBatch(
    batchId: string,
    processFunction: (batch: Batch) => Promise<{
      responses: { requestId: string, response: string }[];
      tokenCount: { input: number; output: number };
      cost: number;
      processingTime: number;
    }>
  ): Promise<BatchResponse[]> {
    const batch = this.activeBatches.get(batchId);
    if (!batch) {
      throw new Error(`Batch ${batchId} not found`);
    }
    
    // Update batch status
    batch.status = 'processing';
    batch.processedAt = new Date();
    
    try {
      // Calculate estimated cost if each request was processed individually
      const individualRequests = batch.requests.map(req => {
        const inputTokens = estimateTokenCount(req.content);
        return estimateCost(batch.model, inputTokens);
      });
      
      const individualCostEstimate = individualRequests.reduce((sum, cost) => sum + cost, 0);
      batch.individualCostEstimate = individualCostEstimate;
      
      // Process the batch
      const startTime = Date.now();
      const result = await processFunction(batch);
      const endTime = Date.now();
      
      // Update batch with results
      batch.status = 'completed';
      batch.completedAt = new Date();
      batch.tokenCount = result.tokenCount;
      batch.cost = result.cost;
      
      // Calculate savings
      const savedCost = Math.max(0, individualCostEstimate - result.cost);
      batch.savedCost = savedCost;
      
      // Update stats
      this.stats.totalSavedCost += savedCost;
      this.stats.modelStats[batch.model].savedCost += savedCost;
      
      // Update averages
      this.updateAverages();
      
      // Report to budget forecaster
      budgetForecaster.logBatchSavings(
        batch.model,
        savedCost,
        `Batched ${batch.requests.length} requests into 1 API call`
      );
      
      // Create responses for each request
      const responses: BatchResponse[] = [];
      
      for (const item of result.responses) {
        const request = batch.requests.find(req => req.id === item.requestId);
        if (!request) continue;
        
        // Calculate token counts for this specific response
        const inputTokens = estimateTokenCount(request.content);
        const outputTokens = estimateTokenCount(item.response);
        
        // Calculate individual cost
        const individualCost = estimateCost(batch.model, inputTokens, outputTokens);
        
        // Calculate this request's share of the batch cost
        const ratio = inputTokens / (result.tokenCount.input || 1);
        const shareCost = result.cost * ratio;
        
        // Calculate savings for this request
        const requestSavedCost = Math.max(0, individualCost - shareCost);
        
        // Create response object
        const response: BatchResponse = {
          requestId: item.requestId,
          response: item.response,
          model: batch.model,
          tokenCount: {
            input: inputTokens,
            output: outputTokens
          },
          cost: shareCost,
          processingTime: endTime - startTime,
          batchId: batch.id,
          wasBatched: true,
          savedCost: requestSavedCost,
          createdAt: new Date()
        };
        
        // Store the response
        this.pendingResponses.set(item.requestId, response);
        responses.push(response);
      }
      
      // Add to completed batches
      this.completedBatches.push(batch);
      this.activeBatches.delete(batchId);
      
      return responses;
    } catch (error) {
      // Update batch status on error
      batch.status = 'failed';
      batch.error = error instanceof Error ? error.message : String(error);
      
      // Move failed requests back to pending
      for (const request of batch.requests) {
        this.pendingRequests.get(batch.model)?.push(request);
      }
      
      // Remove from active batches
      this.activeBatches.delete(batchId);
      
      throw error;
    }
  }
  
  /**
   * Get a batch by ID
   *
   * @param batchId The batch ID
   * @returns The batch or undefined if not found
   */
  getBatch(batchId: string): Batch | undefined {
    // Check active batches
    const activeBatch = this.activeBatches.get(batchId);
    if (activeBatch) return activeBatch;
    
    // Check completed batches
    return this.completedBatches.find(batch => batch.id === batchId);
  }
  
  /**
   * Get pending requests for a model
   *
   * @param model The model to check
   * @returns Array of pending requests
   */
  getPendingRequests(model?: string): BatchRequest[] {
    if (model) {
      return this.pendingRequests.get(model) || [];
    }
    
    // Get all pending requests across models
    return Array.from(this.pendingRequests.values()).flat();
  }
  
  /**
   * Get active batches
   *
   * @param model Optional model to filter by
   * @returns Array of active batches
   */
  getActiveBatches(model?: string): Batch[] {
    const batches = Array.from(this.activeBatches.values());
    
    if (model) {
      return batches.filter(batch => batch.model === model);
    }
    
    return batches;
  }
  
  /**
   * Get completed batches
   *
   * @param model Optional model to filter by
   * @param limit Optional limit on the number of results
   * @returns Array of completed batches
   */
  getCompletedBatches(model?: string, limit?: number): Batch[] {
    let batches = this.completedBatches;
    
    if (model) {
      batches = batches.filter(batch => batch.model === model);
    }
    
    // Sort by completion time (newest first)
    batches = batches.sort((a, b) => {
      const timeA = a.completedAt?.getTime() || a.createdAt.getTime();
      const timeB = b.completedAt?.getTime() || b.createdAt.getTime();
      return timeB - timeA;
    });
    
    if (limit && limit > 0) {
      batches = batches.slice(0, limit);
    }
    
    return batches;
  }
  
  /**
   * Get response for a request
   *
   * @param requestId The request ID
   * @returns The response or undefined if not found
   */
  getResponse(requestId: string): BatchResponse | undefined {
    return this.pendingResponses.get(requestId);
  }
  
  /**
   * Check if a response is ready
   *
   * @param requestId The request ID
   * @returns True if the response is ready
   */
  isResponseReady(requestId: string): boolean {
    return this.pendingResponses.has(requestId);
  }
  
  /**
   * Wait for a response to be ready
   *
   * @param requestId The request ID
   * @param timeout Optional timeout in milliseconds
   * @returns The response
   */
  async waitForResponse(requestId: string, timeout?: number): Promise<BatchResponse> {
    // Check if response is already ready
    const immediate = this.getResponse(requestId);
    if (immediate) return immediate;
    
    return new Promise((resolve, reject) => {
      // Set timeout if specified
      let timeoutId: NodeJS.Timeout | undefined;
      if (timeout) {
        timeoutId = setTimeout(() => {
          reject(new Error(`Timeout waiting for response to request ${requestId}`));
        }, timeout);
      }
      
      // Check for response every 100ms
      const interval = setInterval(() => {
        const response = this.getResponse(requestId);
        if (response) {
          clearInterval(interval);
          if (timeoutId) clearTimeout(timeoutId);
          resolve(response);
        }
      }, 100);
    });
  }
  
  /**
   * Force creation of batches for a model
   *
   * @param model The model to create batches for
   * @returns Array of created batch IDs
   */
  createBatches(model: string): string[] {
    const pendingRequests = this.pendingRequests.get(model) || [];
    if (pendingRequests.length === 0) {
      return [];
    }
    
    // Cancel any existing flush timer for this model
    if (this.flushTimers.has(model)) {
      clearTimeout(this.flushTimers.get(model));
      this.flushTimers.delete(model);
    }
    
    // Sort requests by priority (highest first)
    pendingRequests.sort((a, b) => b.priority - a.priority);
    
    const batchIds: string[] = [];
    let remaining = [...pendingRequests];
    
    while (remaining.length > 0) {
      // Get the highest priority request
      const highestPriority = remaining[0];
      
      // Determine batch size (min of request's max batch size and config max batch size)
      const maxBatchSize = Math.min(
        highestPriority.maxBatchSize || this.config.defaultBatchSize || 5,
        this.config.maxBatchSize || 20
      );
      
      // Create a new batch with up to maxBatchSize requests
      const batchRequests = remaining.slice(0, maxBatchSize);
      remaining = remaining.slice(maxBatchSize);
      
      // Create batch
      const batchId = uuidv4();
      const batch: Batch = {
        id: batchId,
        model,
        requests: batchRequests,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Add to active batches
      this.activeBatches.set(batchId, batch);
      batchIds.push(batchId);
      
      // Update stats
      this.stats.totalBatches++;
      this.stats.modelStats[model].batches++;
      
      const currentTotal = this.stats.modelStats[model].batches;
      const currentSize = batch.requests.length;
      const currentAvg = this.stats.modelStats[model].averageBatchSize;
      
      // Update average batch size
      this.stats.modelStats[model].averageBatchSize = 
        (currentAvg * (currentTotal - 1) + currentSize) / currentTotal;
    }
    
    // Clear pending requests for this model
    this.pendingRequests.set(model, []);
    
    // Start a new flush timer for this model
    if (this.config.autoFlushInterval && this.config.autoFlushInterval > 0) {
      const timer = setTimeout(() => {
        this.flushModelRequests(model);
      }, this.config.autoFlushInterval);
      
      this.flushTimers.set(model, timer);
    }
    
    return batchIds;
  }
  
  /**
   * Flush all pending requests for a model
   *
   * @param model The model to flush
   * @returns Array of created batch IDs
   */
  flushModelRequests(model: string): string[] {
    const pendingRequests = this.pendingRequests.get(model) || [];
    if (pendingRequests.length === 0) {
      return [];
    }
    
    // Need at least the threshold number of requests to create a batch
    const threshold = this.config.batchingThreshold || DEFAULT_CONFIG.batchingThreshold || 2;
    
    if (pendingRequests.length < threshold) {
      // Not enough requests to batch, process individually
      const batchIds: string[] = [];
      
      for (const request of pendingRequests) {
        // Create individual "batch" for each request
        const batchId = uuidv4();
        const batch: Batch = {
          id: batchId,
          model,
          requests: [request],
          status: 'pending',
          createdAt: new Date()
        };
        
        // Add to active batches
        this.activeBatches.set(batchId, batch);
        batchIds.push(batchId);
        
        // Update stats
        this.stats.totalBatches++;
        this.stats.modelStats[model].batches++;
      }
      
      // Clear pending requests
      this.pendingRequests.set(model, []);
      
      return batchIds;
    }
    
    // Create batches normally
    return this.createBatches(model);
  }
  
  /**
   * Flush all pending requests across all models
   *
   * @returns Map of model to created batch IDs
   */
  flushAllRequests(): Map<string, string[]> {
    const result = new Map<string, string[]>();
    
    for (const model of this.pendingRequests.keys()) {
      const batchIds = this.flushModelRequests(model);
      result.set(model, batchIds);
    }
    
    return result;
  }
  
  /**
   * Process a request outside of batching
   *
   * @param model The model to use
   * @param content The request content
   * @param processFunction The function to process the request
   * @param options Additional options
   * @returns The response
   */
  async processIndividual(
    model: string,
    content: string,
    processFunction: (request: BatchRequest) => Promise<{
      response: string;
      tokenCount: { input: number; output: number };
      cost: number;
      processingTime: number;
    }>,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'critical' | number;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<BatchResponse> {
    // Create a request
    const requestId = uuidv4();
    
    // Determine priority
    let priority: number;
    if (typeof options.priority === 'number') {
      priority = options.priority;
    } else if (typeof options.priority === 'string') {
      priority = this.config.priorityLevels?.[options.priority] || 
                 DEFAULT_CONFIG.priorityLevels?.[options.priority] || 
                 DEFAULT_CONFIG.priorityLevels?.normal || 
                 50;
    } else {
      priority = DEFAULT_CONFIG.priorityLevels?.normal || 50;
    }
    
    const request: BatchRequest = {
      id: requestId,
      model,
      content,
      priority,
      createdAt: new Date(),
      metadata: options.metadata
    };
    
    // Process the request
    const startTime = Date.now();
    const result = await processFunction(request);
    const endTime = Date.now();
    
    // Create response
    const response: BatchResponse = {
      requestId,
      response: result.response,
      model,
      tokenCount: result.tokenCount,
      cost: result.cost,
      processingTime: result.processingTime || (endTime - startTime),
      wasBatched: false,
      createdAt: new Date()
    };
    
    // Store the response
    this.pendingResponses.set(requestId, response);
    
    return response;
  }
  
  /**
   * Get batch statistics
   *
   * @returns Batch statistics
   */
  getStats(): BatchStats {
    return { ...this.stats };
  }
  
  /**
   * Reset batch statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      totalBatches: 0,
      totalSavedCost: 0,
      averageBatchSize: 0,
      averageSavingsPerBatch: 0,
      averageSavingsPercentage: 0,
      modelStats: {}
    };
    
    console.log('Batch processor statistics reset');
  }
  
  /**
   * Update the processor configuration
   *
   * @param config Updated configuration
   */
  updateConfig(config: Partial<BatchProcessorConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Batch processor configuration updated');
  }
  
  /**
   * Clear completed batches to free memory
   *
   * @param olderThan Optional age threshold in milliseconds
   * @returns Number of batches cleared
   */
  clearCompletedBatches(olderThan?: number): number {
    const now = Date.now();
    
    if (olderThan) {
      const threshold = now - olderThan;
      const oldBatches = this.completedBatches.filter(batch => 
        batch.completedAt && batch.completedAt.getTime() < threshold
      );
      
      this.completedBatches = this.completedBatches.filter(batch => 
        !batch.completedAt || batch.completedAt.getTime() >= threshold
      );
      
      return oldBatches.length;
    }
    
    // Clear all completed batches
    const count = this.completedBatches.length;
    this.completedBatches = [];
    return count;
  }
  
  /**
   * Check if a model is supported for batching
   *
   * @private
   * @param model The model to check
   * @returns True if the model is supported
   */
  private isModelSupported(model: string): boolean {
    return !!this.config.enabledModels?.includes(model);
  }
  
  /**
   * Update average statistics
   *
   * @private
   */
  private updateAverages(): void {
    // Update average batch size
    if (this.stats.totalBatches > 0) {
      let totalBatchSize = 0;
      let batchCount = 0;
      
      for (const model in this.stats.modelStats) {
        const modelStats = this.stats.modelStats[model];
        totalBatchSize += modelStats.averageBatchSize * modelStats.batches;
        batchCount += modelStats.batches;
      }
      
      this.stats.averageBatchSize = totalBatchSize / batchCount;
    }
    
    // Update average savings per batch
    if (this.stats.totalBatches > 0) {
      this.stats.averageSavingsPerBatch = this.stats.totalSavedCost / this.stats.totalBatches;
    }
    
    // Update average savings percentage
    const completedBatches = this.completedBatches.filter(batch => 
      batch.cost !== undefined && batch.individualCostEstimate !== undefined
    );
    
    if (completedBatches.length > 0) {
      let totalPercentage = 0;
      
      for (const batch of completedBatches) {
        if (batch.individualCostEstimate && batch.individualCostEstimate > 0) {
          const savedPercentage = ((batch.savedCost || 0) / batch.individualCostEstimate) * 100;
          totalPercentage += savedPercentage;
        }
      }
      
      this.stats.averageSavingsPercentage = totalPercentage / completedBatches.length;
    }
  }
  
  /**
   * Generate a report on batch processor efficiency
   */
  generateEfficiencyReport(): {
    summary: string;
    stats: BatchStats;
    recommendations: Array<{ type: string; description: string; impact: 'low' | 'medium' | 'high' }>;
  } {
    // Generate recommendations
    const recommendations: Array<{ type: string; description: string; impact: 'low' | 'medium' | 'high' }> = [];
    
    // Check if batching is being used effectively
    if (this.stats.totalRequests > 0 && this.stats.totalBatches > 0) {
      const avgBatchSize = this.stats.averageBatchSize;
      const maxBatchSize = this.config.maxBatchSize || DEFAULT_CONFIG.maxBatchSize || 20;
      
      if (avgBatchSize < 2) {
        recommendations.push({
          type: 'batch_size',
          description: 'Batching is underutilized. Consider increasing wait time to accumulate more requests.',
          impact: 'high'
        });
      } else if (avgBatchSize < maxBatchSize / 2) {
        recommendations.push({
          type: 'batch_size',
          description: `Average batch size (${avgBatchSize.toFixed(1)}) is below optimal. Consider adjusting wait time or batch thresholds.`,
          impact: 'medium'
        });
      }
      
      // Check savings
      if (this.stats.averageSavingsPercentage < 20) {
        recommendations.push({
          type: 'savings',
          description: 'Cost savings from batching are below expectations. Review batch processing implementation.',
          impact: 'high'
        });
      }
    }
    
    // Check model-specific recommendations
    for (const model in this.stats.modelStats) {
      const modelStats = this.stats.modelStats[model];
      
      if (modelStats.requests > 20 && modelStats.batches === 0) {
        recommendations.push({
          type: 'model_usage',
          description: `Model ${model} has ${modelStats.requests} requests but no batches. Check if batching is enabled for this model.`,
          impact: 'medium'
        });
      }
    }
    
    // Create summary
    let summary = `Batch Processor Efficiency Report\n`;
    summary += `Total requests: ${this.stats.totalRequests}\n`;
    summary += `Total batches: ${this.stats.totalBatches}\n`;
    summary += `Total cost savings: $${this.stats.totalSavedCost.toFixed(6)}\n`;
    summary += `Average batch size: ${this.stats.averageBatchSize.toFixed(2)}\n`;
    summary += `Average savings per batch: $${this.stats.averageSavingsPerBatch.toFixed(6)}\n`;
    summary += `Average savings percentage: ${this.stats.averageSavingsPercentage.toFixed(2)}%\n\n`;
    
    summary += `Model usage:\n`;
    for (const model in this.stats.modelStats) {
      const ms = this.stats.modelStats[model];
      summary += `- ${model}: ${ms.requests} requests, ${ms.batches} batches, avg size ${ms.averageBatchSize.toFixed(2)}, saved $${ms.savedCost.toFixed(6)}\n`;
    }
    
    // Ensure budget forecaster gets our data
    budgetForecaster.checkBudgetThresholds();
    
    return {
      summary,
      stats: this.stats,
      recommendations
    };
  }
}

// Create singleton instance
export const batchProcessor = new BatchProcessor();