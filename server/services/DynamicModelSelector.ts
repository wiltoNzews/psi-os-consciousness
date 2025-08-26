/**
 * Dynamic Model Selector for OROBORO NEXUS
 * 
 * This component intelligently routes tasks to the most cost-effective model
 * while meeting performance requirements. It can achieve up to 500x cost savings
 * by selecting appropriate models based on task complexity.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { budgetForecaster } from './AdaptiveBudgetForecaster';

/**
 * Task profile interface for describing request characteristics
 */
export interface TaskProfile {
  complexity: number;           // 1-10 scale of task complexity
  modality: 'text' | 'multi-modal' | 'audio' | 'real-time'; // Input type
  urgency: 'immediate' | 'high' | 'normal' | 'batchable';  // Response time requirements
  tokenEstimate: number;        // Estimated token count for input
  requiresReasoning: boolean;   // Whether task requires complex reasoning
  requiresCoding: boolean;      // Whether task requires code generation
  outputType?: string;          // Optional specific output format requirement
}

/**
 * Model capability interface
 */
interface ModelCapability {
  maxComplexity: number;        // Maximum complexity the model can handle (1-10)
  supportedModalities: string[]; // Supported input types
  reasoningCapability: number;  // Reasoning capability (1-10)
  codingCapability: number;     // Code generation capability (1-10)
  costPerMillion: {             // Cost per million tokens
    input: number;
    output: number;
  };
  latency: number;              // Typical latency in milliseconds
  supportsBatching: boolean;    // Whether the model supports batch processing
  contextWindow: number;        // Maximum context window in tokens
}

/**
 * Model selection result interface
 */
export interface ModelSelectionResult {
  model: string;                // Selected model ID
  confidence: number;           // Confidence in selection (0-1)
  costEstimate: number;         // Estimated cost for the task
  rationale: string;            // Explanation for the selection
  fallbackOptions: string[];    // Alternative models if primary is unavailable
}

/**
 * Dynamic Model Selector class
 */
export class DynamicModelSelector {
  private modelCapabilities: Record<string, ModelCapability>;
  private cachedSelections: Map<string, ModelSelectionResult> = new Map();
  
  constructor() {
    // Initialize model capabilities database (March 2025)
    this.modelCapabilities = {
      'GPT-4.5-preview': {
        maxComplexity: 10,
        supportedModalities: ['text', 'multi-modal', 'audio'],
        reasoningCapability: 10,
        codingCapability: 9,
        costPerMillion: {
          input: 75.00,
          output: 150.00
        },
        latency: 2000,
        supportsBatching: true,
        contextWindow: 128000
      },
      'GPT-4o': {
        maxComplexity: 9,
        supportedModalities: ['text', 'multi-modal', 'audio'],
        reasoningCapability: 9,
        codingCapability: 9,
        costPerMillion: {
          input: 2.50,
          output: 10.00
        },
        latency: 1500,
        supportsBatching: true,
        contextWindow: 128000
      },
      'o1': {
        maxComplexity: 10,
        supportedModalities: ['text', 'multi-modal'],
        reasoningCapability: 10,
        codingCapability: 10,
        costPerMillion: {
          input: 15.00,
          output: 60.00
        },
        latency: 2200,
        supportsBatching: true,
        contextWindow: 128000
      },
      'o1-mini': {
        maxComplexity: 8,
        supportedModalities: ['text', 'multi-modal'],
        reasoningCapability: 8,
        codingCapability: 8,
        costPerMillion: {
          input: 1.10,
          output: 4.40
        },
        latency: 1200,
        supportsBatching: true,
        contextWindow: 128000
      },
      'GPT-4o-mini': {
        maxComplexity: 7,
        supportedModalities: ['text', 'multi-modal'],
        reasoningCapability: 7,
        codingCapability: 7,
        costPerMillion: {
          input: 0.15,
          output: 0.60
        },
        latency: 900,
        supportsBatching: true,
        contextWindow: 128000
      },
      'Gemini-2.5-Pro': {
        maxComplexity: 9,
        supportedModalities: ['text', 'multi-modal', 'audio'],
        reasoningCapability: 9,
        codingCapability: 8,
        costPerMillion: {
          input: 7.00,
          output: 21.00
        },
        latency: 1800,
        supportsBatching: false,
        contextWindow: 1000000
      },
      'Gemini-1.5-Flash': {
        maxComplexity: 6,
        supportedModalities: ['text', 'multi-modal'],
        reasoningCapability: 6,
        codingCapability: 6,
        costPerMillion: {
          input: 0.075,
          output: 0.30
        },
        latency: 800,
        supportsBatching: false,
        contextWindow: 1000000
      },
      'Claude-3.7-Sonnet': {
        maxComplexity: 9,
        supportedModalities: ['text', 'multi-modal'],
        reasoningCapability: 10,
        codingCapability: 8,
        costPerMillion: {
          input: 3.00,
          output: 15.00
        },
        latency: 2000,
        supportsBatching: true,
        contextWindow: 200000
      },
      'Claude-3.5-Haiku': {
        maxComplexity: 7,
        supportedModalities: ['text', 'multi-modal'],
        reasoningCapability: 7,
        codingCapability: 7,
        costPerMillion: {
          input: 0.80,
          output: 4.00
        },
        latency: 1000,
        supportsBatching: true,
        contextWindow: 200000
      },
      'Grok-3': {
        maxComplexity: 9,
        supportedModalities: ['text', 'multi-modal', 'real-time'],
        reasoningCapability: 8,
        codingCapability: 8,
        costPerMillion: {
          input: 38.15,
          output: 114.44
        },
        latency: 300, // Extremely low latency for real-time tasks
        supportsBatching: false,
        contextWindow: 64000
      },
      'Grok-1': {
        maxComplexity: 6,
        supportedModalities: ['text'],
        reasoningCapability: 6,
        codingCapability: 6,
        costPerMillion: {
          input: 0.50,
          output: 1.50
        },
        latency: 800,
        supportsBatching: false,
        contextWindow: 8000
      }
    };
  }
  
  /**
   * Select the most appropriate model for a task
   * 
   * @param taskProfile Profile of the task to be performed
   * @param forceModel Optional model to force selection of
   * @returns Selection result with model and rationale
   */
  selectModel(taskProfile: TaskProfile, forceModel?: string): ModelSelectionResult {
    // If a model is forced, check if it's capable and return it
    if (forceModel && this.modelCapabilities[forceModel]) {
      const forcedModelCapability = this.modelCapabilities[forceModel];
      
      // Check if forced model meets minimum requirements
      if (
        forcedModelCapability.maxComplexity >= taskProfile.complexity &&
        forcedModelCapability.supportedModalities.includes(taskProfile.modality)
      ) {
        const costEstimate = this.calculateCostEstimate(forceModel, taskProfile.tokenEstimate);
        
        return {
          model: forceModel,
          confidence: 0.9,
          costEstimate,
          rationale: `Forced selection of ${forceModel}`,
          fallbackOptions: this.getFallbackOptions(taskProfile)
        };
      }
      
      // If forced model doesn't meet requirements, log warning and proceed with normal selection
      console.warn(`Forced model ${forceModel} does not meet minimum requirements for this task. Proceeding with automatic selection.`);
    }
    
    // Check for budget-constrained adaptive routing
    const adaptiveStrategy = budgetForecaster.getAdaptiveStrategy();
    if (adaptiveStrategy.modelPreference !== 'default') {
      // Budget constraints in effect, try to use the preferred model
      const preferredModel = adaptiveStrategy.modelPreference;
      const preferredModelCapability = this.modelCapabilities[preferredModel];
      
      // Check if preferred model meets minimum requirements
      if (
        preferredModelCapability.maxComplexity >= taskProfile.complexity &&
        preferredModelCapability.supportedModalities.includes(taskProfile.modality)
      ) {
        const costEstimate = this.calculateCostEstimate(preferredModel, taskProfile.tokenEstimate);
        
        return {
          model: preferredModel,
          confidence: 0.85,
          costEstimate,
          rationale: `Budget-optimized selection of ${preferredModel} (${adaptiveStrategy.thresholdReached} threshold)`,
          fallbackOptions: this.getFallbackOptions(taskProfile)
        };
      }
      
      // If budget-optimized model doesn't meet requirements, continue with selection
      // but prioritize cost-effective models
    }
    
    // Check cache for similar task profiles
    const cacheKey = this.getTaskProfileCacheKey(taskProfile);
    if (this.cachedSelections.has(cacheKey)) {
      return this.cachedSelections.get(cacheKey)!;
    }
    
    // Filter models that can handle this task
    const capableModels = Object.entries(this.modelCapabilities)
      .filter(([_, capability]) => {
        return (
          capability.maxComplexity >= taskProfile.complexity &&
          capability.supportedModalities.includes(taskProfile.modality) &&
          (taskProfile.requiresReasoning ? capability.reasoningCapability >= 7 : true) &&
          (taskProfile.requiresCoding ? capability.codingCapability >= 7 : true) &&
          (taskProfile.urgency === 'immediate' ? capability.latency < 500 : true) &&
          (taskProfile.urgency === 'batchable' ? capability.supportsBatching : true) &&
          (taskProfile.tokenEstimate ? capability.contextWindow >= taskProfile.tokenEstimate * 2 : true)
        );
      })
      .map(([model, capability]) => ({ 
        model, 
        capability,
        score: this.calculateModelScore(model, capability, taskProfile),
        costEstimate: this.calculateCostEstimate(model, taskProfile.tokenEstimate)
      }));
    
    // Sort by score (higher is better)
    capableModels.sort((a, b) => b.score - a.score);
    
    // If no capable models found, use GPT-4o-mini as a fallback
    if (capableModels.length === 0) {
      const fallbackModel = 'GPT-4o-mini';
      const costEstimate = this.calculateCostEstimate(fallbackModel, taskProfile.tokenEstimate);
      
      const result: ModelSelectionResult = {
        model: fallbackModel,
        confidence: 0.5,
        costEstimate,
        rationale: 'Fallback selection due to no fully capable models for this task',
        fallbackOptions: ['GPT-4o', 'Claude-3.5-Haiku']
      };
      
      // Cache the selection
      this.cachedSelections.set(cacheKey, result);
      return result;
    }
    
    // Select the best model
    const bestModel = capableModels[0];
    
    // Get fallback options
    const fallbackOptions = capableModels
      .slice(1, 4)
      .map(model => model.model);
    
    const result: ModelSelectionResult = {
      model: bestModel.model,
      confidence: this.calculateConfidence(bestModel.score, capableModels),
      costEstimate: bestModel.costEstimate,
      rationale: this.generateRationale(bestModel.model, bestModel.capability, taskProfile, adaptiveStrategy),
      fallbackOptions
    };
    
    // Cache the selection
    this.cachedSelections.set(cacheKey, result);
    return result;
  }
  
  /**
   * Calculate a cache key for a task profile
   * 
   * @param taskProfile Task profile
   * @returns Cache key
   */
  private getTaskProfileCacheKey(taskProfile: TaskProfile): string {
    return `${taskProfile.complexity}_${taskProfile.modality}_${taskProfile.urgency}_${taskProfile.requiresReasoning ? 1 : 0}_${taskProfile.requiresCoding ? 1 : 0}_${Math.ceil(taskProfile.tokenEstimate / 1000)}k`;
  }
  
  /**
   * Calculate a score for a model based on task profile
   * 
   * @param model Model identifier
   * @param capability Model capability
   * @param taskProfile Task profile
   * @returns Score (higher is better)
   */
  private calculateModelScore(model: string, capability: ModelCapability, taskProfile: TaskProfile): number {
    // Start with a base score
    let score = 50;
    
    // Cost factor (models with lower costs get higher scores)
    const costFactor = 1000 / (capability.costPerMillion.input + capability.costPerMillion.output);
    score += Math.min(40, costFactor);
    
    // Capability match factor
    const complexityMatch = 10 - Math.abs(capability.maxComplexity - taskProfile.complexity);
    score += complexityMatch * 2;
    
    // Reasoning capability factor
    if (taskProfile.requiresReasoning) {
      score += capability.reasoningCapability * 3;
    }
    
    // Coding capability factor
    if (taskProfile.requiresCoding) {
      score += capability.codingCapability * 3;
    }
    
    // Latency factor
    if (taskProfile.urgency === 'immediate') {
      score += (2000 - capability.latency) / 50; // Faster models get higher scores
    }
    
    // Batching factor
    if (taskProfile.urgency === 'batchable' && capability.supportsBatching) {
      score += 20; // Bonus for supporting batching
    }
    
    // Context window factor
    if (taskProfile.tokenEstimate > 0) {
      const contextFactor = Math.min(20, capability.contextWindow / taskProfile.tokenEstimate / 10);
      score += contextFactor;
    }
    
    // Apply adaptive budget constraints
    const adaptiveStrategy = budgetForecaster.getAdaptiveStrategy();
    if (adaptiveStrategy.thresholdReached !== 'none') {
      // Heavy penalty for expensive models when budget constraints are active
      score -= capability.costPerMillion.input + capability.costPerMillion.output;
      
      // Bonus for matching the preferred model
      if (model === adaptiveStrategy.modelPreference) {
        score += 50;
      }
    }
    
    return score;
  }
  
  /**
   * Calculate the estimated cost for a task
   * 
   * @param model Model identifier
   * @param tokenEstimate Estimated token count
   * @returns Estimated cost in USD
   */
  private calculateCostEstimate(model: string, tokenEstimate: number): number {
    const capability = this.modelCapabilities[model];
    if (!capability) {
      return 0;
    }
    
    // Assume output is roughly 50% of input size on average
    const outputTokenEstimate = tokenEstimate * 0.5;
    
    // Calculate cost based on pricing
    const inputCost = (tokenEstimate / 1000000) * capability.costPerMillion.input;
    const outputCost = (outputTokenEstimate / 1000000) * capability.costPerMillion.output;
    
    return inputCost + outputCost;
  }
  
  /**
   * Calculate confidence in the model selection
   * 
   * @param bestScore Score of the best model
   * @param allModels All capable models with scores
   * @returns Confidence score (0-1)
   */
  private calculateConfidence(bestScore: number, allModels: Array<{ model: string; score: number }>): number {
    if (allModels.length === 1) {
      return 1.0; // Only one option, 100% confidence
    }
    
    // Calculate the gap between best and second best
    const secondBestScore = allModels[1]?.score || 0;
    const gap = bestScore - secondBestScore;
    
    // Normalize to 0-1 range
    return Math.min(1.0, Math.max(0.5, 0.7 + (gap / 100)));
  }
  
  /**
   * Get fallback options for a task
   * 
   * @param taskProfile Task profile
   * @returns Array of fallback model identifiers
   */
  private getFallbackOptions(taskProfile: TaskProfile): string[] {
    // Simplified fallback options based on modality and complexity
    if (taskProfile.modality === 'real-time') {
      return ['Grok-3', 'GPT-4o'];
    }
    
    if (taskProfile.complexity >= 8) {
      return ['Claude-3.7-Sonnet', 'Gemini-2.5-Pro', 'GPT-4o'];
    }
    
    if (taskProfile.modality === 'multi-modal') {
      return ['Gemini-1.5-Flash', 'GPT-4o-mini', 'Claude-3.5-Haiku'];
    }
    
    return ['GPT-4o-mini', 'Gemini-1.5-Flash', 'Claude-3.5-Haiku'];
  }
  
  /**
   * Generate a rationale for the model selection
   * 
   * @param model Selected model
   * @param capability Model capability
   * @param taskProfile Task profile
   * @param adaptiveStrategy Adaptive routing strategy
   * @returns Rationale string
   */
  private generateRationale(
    model: string, 
    capability: ModelCapability, 
    taskProfile: TaskProfile,
    adaptiveStrategy: { thresholdReached: string; modelPreference: string }
  ): string {
    let rationale = `Selected ${model} for `;
    
    // Add task description
    rationale += `${taskProfile.modality} task with complexity ${taskProfile.complexity}/10`;
    
    if (taskProfile.requiresReasoning) {
      rationale += ', requiring advanced reasoning';
    }
    
    if (taskProfile.requiresCoding) {
      rationale += ', requiring code generation';
    }
    
    // Add capability match
    rationale += `. Model has complexity rating ${capability.maxComplexity}/10`;
    
    // Add cost information
    rationale += ` at $${capability.costPerMillion.input.toFixed(2)}/$${capability.costPerMillion.output.toFixed(2)} per million tokens`;
    
    // Add budget constraints if applicable
    if (adaptiveStrategy.thresholdReached !== 'none') {
      rationale += `. Selection influenced by ${adaptiveStrategy.thresholdReached} budget threshold`;
    }
    
    return rationale;
  }
  
  /**
   * Update model capability information
   * 
   * @param model Model identifier
   * @param capability Model capability information
   */
  updateModelCapability(model: string, capability: Partial<ModelCapability>): void {
    // Create or update model capability
    this.modelCapabilities[model] = {
      ...this.modelCapabilities[model],
      ...capability
    } as ModelCapability;
    
    // Clear cache to ensure fresh selections
    this.cachedSelections.clear();
  }
  
  /**
   * Get capability information for a model
   * 
   * @param model Model identifier
   * @returns Model capability or undefined if not found
   */
  getModelCapability(model: string): ModelCapability | undefined {
    return this.modelCapabilities[model];
  }
  
  /**
   * Get all available models
   * 
   * @returns Array of model identifiers
   */
  getAvailableModels(): string[] {
    return Object.keys(this.modelCapabilities);
  }
}