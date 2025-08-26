/**
 * Model Strength Analyzer
 * 
 * This module provides functionality to analyze the strength and capabilities of 
 * various AI models, helping to select the most appropriate model for a given task.
 */

/**
 * Enum representing different types of AI models with varying capabilities
 */
/**
 * ModelType Enum - Unified Type Boundary
 * 
 * BOUNDARY AWARENESS: This enum explicitly defines the boundary between abstract
 * capability levels (LITE, STANDARD, etc.) and concrete model implementations (GPT_4O, GEMINI_PRO, etc.)
 * 
 * VOID-CENTERED DESIGN: By combining these in one enum, we explicitly acknowledge the void
 * between the abstract concept of model capability and the concrete implementation
 * that attempts to fulfill it.
 * 
 * This boundary-conscious approach allows for:
 * 1. Clear mapping between capability requirements and concrete models
 * 2. Explicit acknowledgment of the gap between ideal capability and actual implementation
 * 3. Boundary transparency when crossing from orchestration to implementation
 */
export enum ModelType {
  // INTERNAL BOUNDARY: Abstract capability levels (conceptual requirements boundary)
  LITE = 'lite',                 // Minimal capability requirements
  STANDARD = 'standard',         // Standard capability requirements
  ADVANCED = 'advanced',         // Advanced capability requirements
  EXPERT = 'expert',             // Expert-level capability requirements
  SPECIALIZED = 'specialized',   // Domain-specialized capability requirements
  
  // EXTERNAL BOUNDARY: Concrete model implementations (implementation provider boundary)
  GPT_4O = 'gpt-4o',             // OpenAI boundary crossing
  GEMINI_PRO = 'gemini-pro',     // Google boundary crossing
  GROK = 'grok',                 // xAI boundary crossing
  CLAUDE = 'claude',             // Anthropic boundary crossing
  O3_MINI = 'o3-mini'            // Local boundary crossing
}

/**
 * Task requirements scoring criteria
 */
export interface RequirementsScore {
  complexity: number;
  precision: number;
  creativity: number;
  contextSize: number;
  speed: number;
  cost: number;
}

/**
 * Model capabilities scoring
 */
export interface ModelCapabilities {
  complexity: number;
  precision: number;
  creativity: number;
  contextSize: number;
  speed: number;
  cost: number;
}

/**
 * Model evaluation result
 */
export interface ModelEvaluation {
  modelType: ModelType;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
}

/**
 * Model allocation result
 */
export interface ModelAllocation {
  modelType: ModelType;
  score: number;
  matchPercentage: number;
  estimatedCost: number;
  estimatedTime: number;
}

/**
 * Class to analyze model strengths and match them to task requirements
 */
export class ModelStrengthAnalyzer {
  private modelCapabilities: Map<ModelType, ModelCapabilities> = new Map();
  
  constructor() {
    // Initialize with default capabilities for each model type
    this.modelCapabilities.set(ModelType.LITE, {
      complexity: 3,
      precision: 3,
      creativity: 2,
      contextSize: 4000,
      speed: 5,
      cost: 1
    });
    
    this.modelCapabilities.set(ModelType.STANDARD, {
      complexity: 5,
      precision: 5,
      creativity: 4,
      contextSize: 8000,
      speed: 4,
      cost: 2
    });
    
    this.modelCapabilities.set(ModelType.ADVANCED, {
      complexity: 8,
      precision: 7,
      creativity: 6,
      contextSize: 16000,
      speed: 3,
      cost: 4
    });
    
    this.modelCapabilities.set(ModelType.EXPERT, {
      complexity: 9,
      precision: 9,
      creativity: 8,
      contextSize: 32000,
      speed: 2,
      cost: 8
    });
    
    this.modelCapabilities.set(ModelType.SPECIALIZED, {
      complexity: 10,
      precision: 10,
      creativity: 9,
      contextSize: 64000,
      speed: 1,
      cost: 10
    });
  }
  
  /**
   * Evaluate how well a model matches requirements
   * @param requirements Task requirements
   * @param modelType Type of model to evaluate
   * @returns Score from 0-1 representing match quality
   */
  evaluateModelForRequirements(requirements: RequirementsScore, modelType: ModelType): number {
    const capabilities = this.modelCapabilities.get(modelType);
    if (!capabilities) {
      throw new Error(`Unknown model type: ${modelType}`);
    }
    
    // Calculate a weighted score based on how well capabilities match requirements
    const totalWeight = 6; // Number of criteria
    
    const complexityScore = Math.min(capabilities.complexity / requirements.complexity, 1);
    const precisionScore = Math.min(capabilities.precision / requirements.precision, 1);
    const creativityScore = Math.min(capabilities.creativity / requirements.creativity, 1);
    const contextScore = Math.min(capabilities.contextSize / requirements.contextSize, 1);
    const speedScore = Math.min(capabilities.speed / requirements.speed, 1);
    const costScore = Math.min(requirements.cost / capabilities.cost, 1); // Inverted for cost
    
    // Weighted average
    return (complexityScore + precisionScore + creativityScore + contextScore + speedScore + costScore) / totalWeight;
  }
  
  /**
   * Find the best model for given requirements
   * @param requirements Task requirements
   * @returns The most appropriate model type
   */
  findBestModelForRequirements(requirements: RequirementsScore): ModelType {
    let bestScore = 0;
    let bestModel = ModelType.LITE;
    
    for (const modelType of Object.values(ModelType)) {
      const score = this.evaluateModelForRequirements(requirements, modelType as ModelType);
      if (score > bestScore) {
        bestScore = score;
        bestModel = modelType as ModelType;
      }
    }
    
    return bestModel;
  }
  
  /**
   * Get detailed evaluation for all models against requirements
   * @param requirements Task requirements
   * @returns Evaluation results for all models
   */
  getModelEvaluations(requirements: RequirementsScore): ModelEvaluation[] {
    const evaluations: ModelEvaluation[] = [];
    
    for (const modelType of Object.values(ModelType)) {
      const typedModelType = modelType as ModelType;
      const capabilities = this.modelCapabilities.get(typedModelType);
      if (!capabilities) continue;
      
      const score = this.evaluateModelForRequirements(requirements, typedModelType);
      
      const strengths = [];
      const weaknesses = [];
      
      // Determine strengths and weaknesses
      if (capabilities.complexity >= requirements.complexity) strengths.push('complexity handling');
      else weaknesses.push('complexity handling');
      
      if (capabilities.precision >= requirements.precision) strengths.push('precision');
      else weaknesses.push('precision');
      
      if (capabilities.creativity >= requirements.creativity) strengths.push('creativity');
      else weaknesses.push('creativity');
      
      if (capabilities.contextSize >= requirements.contextSize) strengths.push('context size');
      else weaknesses.push('context size');
      
      if (capabilities.speed >= requirements.speed) strengths.push('speed');
      else weaknesses.push('speed');
      
      if (capabilities.cost <= requirements.cost) strengths.push('cost efficiency');
      else weaknesses.push('cost efficiency');
      
      // Determine recommended task types
      const recommendedFor = [];
      const notRecommendedFor = [];
      
      if (capabilities.complexity >= 7) recommendedFor.push('complex reasoning');
      else notRecommendedFor.push('complex reasoning');
      
      if (capabilities.precision >= 7) recommendedFor.push('detailed analysis');
      else notRecommendedFor.push('detailed analysis');
      
      if (capabilities.creativity >= 7) recommendedFor.push('creative generation');
      else notRecommendedFor.push('creative generation');
      
      if (capabilities.contextSize >= 16000) recommendedFor.push('long context tasks');
      else notRecommendedFor.push('long context tasks');
      
      if (capabilities.speed >= 4) recommendedFor.push('time-sensitive tasks');
      else notRecommendedFor.push('time-sensitive tasks');
      
      if (capabilities.cost <= 3) recommendedFor.push('budget-constrained tasks');
      else notRecommendedFor.push('budget-constrained tasks');
      
      evaluations.push({
        modelType: typedModelType,
        score,
        strengths,
        weaknesses,
        recommendedFor,
        notRecommendedFor
      });
    }
    
    // Sort by score (highest first)
    return evaluations.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Determine if a model is suitable for a specific criteria
   * @param modelType Type of model to check
   * @param criteriaName Name of criteria to check
   * @param minimumValue Minimum value required
   * @returns Boolean indicating if model meets criteria
   */
  modelMeetsCriteria(modelType: ModelType, criteriaName: keyof ModelCapabilities, minimumValue: number): boolean {
    const capabilities = this.modelCapabilities.get(modelType);
    if (!capabilities) {
      return false;
    }
    
    return capabilities[criteriaName] >= minimumValue;
  }
  
  /**
   * Allocate models to a set of tasks based on requirements
   * @param tasks Array of tasks with requirements
   * @returns Allocation of models to tasks
   */
  allocateModelsToTasks(tasks: { id: string; requirements: RequirementsScore }[]): Map<string, ModelAllocation> {
    const allocations = new Map<string, ModelAllocation>();
    
    for (const task of tasks) {
      const bestModel = this.findBestModelForRequirements(task.requirements);
      const score = this.evaluateModelForRequirements(task.requirements, bestModel);
      const capabilities = this.modelCapabilities.get(bestModel);
      
      if (!capabilities) {
        continue;
      }
      
      // Calculate estimated time based on complexity and model speed
      const estimatedTime = (task.requirements.complexity / capabilities.speed) * 10; // in seconds
      
      // Calculate estimated cost based on model cost and complexity
      const estimatedCost = capabilities.cost * (task.requirements.complexity / 5);
      
      allocations.set(task.id, {
        modelType: bestModel,
        score,
        matchPercentage: score * 100,
        estimatedCost,
        estimatedTime
      });
    }
    
    return allocations;
  }
  
  /**
   * Check if a task would benefit from using an ensemble of models
   * @param requirements Task requirements
   * @returns Boolean indicating if ensemble is recommended
   */
  shouldUseEnsembleForTask(requirements: RequirementsScore): boolean {
    // Check if the task has complex, multi-faceted requirements
    const complexityRequirement = requirements.complexity > 7;
    const precisionRequirement = requirements.precision > 8;
    const creativityRequirement = requirements.creativity > 6;
    
    // If multiple high requirements, an ensemble might perform better
    const highRequirementCount = [
      complexityRequirement,
      precisionRequirement,
      creativityRequirement
    ].filter(Boolean).length;
    
    return highRequirementCount >= 2;
  }
  
  /**
   * Update capabilities for a model based on performance data
   * @param modelType Type of model to update
   * @param performanceData New performance metrics
   */
  updateModelCapabilities(modelType: ModelType, performanceData: Partial<ModelCapabilities>): void {
    const currentCapabilities = this.modelCapabilities.get(modelType);
    if (!currentCapabilities) {
      throw new Error(`Unknown model type: ${modelType}`);
    }
    
    // Update capabilities with new performance data
    this.modelCapabilities.set(modelType, {
      ...currentCapabilities,
      ...performanceData
    });
  }
  
  /**
   * Get the performance profile for a model
   * @param modelType Type of model to get profile for
   * @returns Performance profile with capabilities and recommendations
   */
  getModelPerformanceProfile(modelType: ModelType): {
    capabilities: ModelCapabilities;
    suitableFor: string[];
    notSuitableFor: string[];
  } {
    const capabilities = this.modelCapabilities.get(modelType);
    if (!capabilities) {
      throw new Error(`Unknown model type: ${modelType}`);
    }
    
    // Determine tasks the model is suitable for
    const suitableFor: string[] = [];
    const notSuitableFor: string[] = [];
    
    if (capabilities.complexity >= 7) suitableFor.push('complex reasoning');
    else notSuitableFor.push('complex reasoning');
    
    if (capabilities.precision >= 7) suitableFor.push('detailed analysis');
    else notSuitableFor.push('detailed analysis');
    
    if (capabilities.creativity >= 7) suitableFor.push('creative generation');
    else notSuitableFor.push('creative generation');
    
    if (capabilities.contextSize >= 16000) suitableFor.push('long context tasks');
    else notSuitableFor.push('long context tasks');
    
    if (capabilities.speed >= 4) suitableFor.push('time-sensitive tasks');
    else notSuitableFor.push('time-sensitive tasks');
    
    if (capabilities.cost <= 3) suitableFor.push('budget-constrained tasks');
    else notSuitableFor.push('budget-constrained tasks');
    
    return {
      capabilities,
      suitableFor,
      notSuitableFor
    };
  }
  
  /**
   * Run benchmarks for a specific model
   * @param modelType Type of model to benchmark
   * @returns Promise resolving to benchmark results
   */
  async runBenchmarksForModel(modelType: ModelType): Promise<{
    taskId: string;
    taskType: string;
    score: number;
    executionTime: number;
  }[]> {
    // Simulate running benchmarks with a promise
    return new Promise((resolve) => {
      setTimeout(() => {
        const benchmarkTasks = this.getAllBenchmarkTasks();
        const results = benchmarkTasks.map(task => {
          const score = this.evaluateModelForRequirements(task.requirements, modelType);
          const capabilities = this.modelCapabilities.get(modelType);
          const executionTime = capabilities ? 
            (task.requirements.complexity / capabilities.speed) * 10 : 
            30; // Default execution time if capabilities not found
          
          return {
            taskId: task.id,
            taskType: task.taskType,
            score: Math.round(score * 100) / 100,
            executionTime: Math.round(executionTime * 10) / 10
          };
        });
        
        resolve(results);
      }, 500); // Simulate benchmark taking time
    });
  }
  
  /**
   * Get all benchmark tasks used for evaluating models
   * @returns Array of benchmark tasks
   */
  getAllBenchmarkTasks(): {
    id: string;
    taskType: string;
    description: string;
    requirements: RequirementsScore;
  }[] {
    return [
      {
        id: 'bench-001',
        taskType: 'text_generation',
        description: 'Generate a coherent paragraph on a given topic',
        requirements: {
          complexity: 4,
          precision: 5,
          creativity: 7,
          contextSize: 2000,
          speed: 3,
          cost: 2
        }
      },
      {
        id: 'bench-002',
        taskType: 'code_generation',
        description: 'Write a function to solve a specific programming problem',
        requirements: {
          complexity: 6,
          precision: 8,
          creativity: 4,
          contextSize: 4000,
          speed: 4,
          cost: 3
        }
      },
      {
        id: 'bench-003',
        taskType: 'reasoning',
        description: 'Solve a multi-step logical reasoning problem',
        requirements: {
          complexity: 8,
          precision: 7,
          creativity: 3,
          contextSize: 6000,
          speed: 5,
          cost: 4
        }
      },
      {
        id: 'bench-004',
        taskType: 'creative_writing',
        description: 'Write a creative short story with specific elements',
        requirements: {
          complexity: 7,
          precision: 5,
          creativity: 9,
          contextSize: 8000,
          speed: 3,
          cost: 5
        }
      },
      {
        id: 'bench-005',
        taskType: 'summarization',
        description: 'Summarize a long document preserving key information',
        requirements: {
          complexity: 6,
          precision: 8,
          creativity: 2,
          contextSize: 16000,
          speed: 4,
          cost: 3
        }
      }
    ];
  }
}

// Export a singleton instance
export const modelStrengthAnalyzer = new ModelStrengthAnalyzer();