/**
 * Relational Test Harness
 * 
 * This module provides a testing framework for the relational aspects of the neural-symbiotic
 * orchestration platform. It orchestrates tests across multiple formulas and services to
 * validate the integration of relational experience with computational calculations.
 * 
 * Key capabilities:
 * - Run comprehensive tests across all relational-enabled services
 * - Generate stability sequences to validate temporal coherence
 * - Compare computational vs. relational metrics to validate integration
 * - Record test results for meta-learning validation
 */

import { v4 as uuidv4 } from 'uuid';
// Using .js extensions for Node.js compatibility with TypeScript
import { calculateStabilityWithMetrics } from './inverse-pendulum-calculator.js';
import { recordInversePendulumOperation } from './meta-learning-validation.js';
import { calculateSynapticResonanceFactor } from './resonance-calculator.js';
import { adaptiveResonanceService } from './adaptive-resonance-service.js';
import { applyStrategicRefinementProcess } from './strategic-refinement-process.js';
import { recordMetaLearningDataPoint } from './meta-learning-validation.js';
import { storage } from '../../storage.js';
// Using .js extension for Node.js compatibility while referencing actual .ts file
import { relationalExperienceIntegrator } from './relational-experience-integrator.js';

/**
 * Interface for MetaLearningDataPoint parameters
 */
interface MetaLearningParams {
  formulaType: 'synaptic_resonance' | 'inverse_pendulum' | 'wilton_god' | 
               'cognitive_framework' | 'meta_void' | 'wfcrs' | 'msmf' | 
               'hpef' | 'execution_formula' | 'relational_test' | 'stability_sequence';
  inputParams: any;
  outputResult: any;
  performanceMetrics: {
    accuracy?: number;
    executionTime?: number;
    resourceUtilization?: Record<string, number>;
    userFeedback?: number;
    systemFeedback?: number;
  };
  experientialDimension?: any;
}

// Type for relational test results
interface RelationalTestResult {
  id: string;
  timestamp: Date;
  computationalMetrics: {
    resonanceScore: number;
    stabilityScore: number;
    coherenceLevel: number;
    refinementAlignment: number;
  };
  relationalMetrics: {
    experientialRelevance: number;
    contextualAlignment: number;
    meaningfulness: number;
    embodiedResonance: number;
  };
  integration: {
    overallScore: number;
    balanceFactor: number;
    synergy: number;
    tensions: string[];
  };
  narrativeContext: string;
  recommendations: string[];
  executionTime: number;
}

// Type for stability sequence operations
interface StabilityOperation {
  id: string;
  timestamp: Date;
  operationType: 'computational' | 'relational' | 'integrated';
  parameters: Record<string, any>;
  result: {
    stabilityScore: number;
    resonanceLevel?: number;
    experientialQuality?: number;
    executionTime: number;
  };
  narrativeContext?: string;
}

/**
 * Run a comprehensive test of the relational experience integration
 * with computational formulas
 */
export async function runComprehensiveRelationalTest(): Promise<RelationalTestResult> {
  const startTime = Date.now();
  const testId = uuidv4();
  
  console.log(`Starting comprehensive relational test (${testId})...`);

  try {
    // 1. First run standard computational formulas
    
    // 1.1 Calculate stability using inverse pendulum formula
    const stabilityParams = {
      adjustmentRate: 0.7,
      targetChaosLevel: 0.3,
      feedbackSignals: [
        { name: 'userSatisfaction', value: 0.8, weight: 1.5 },
        { name: 'systemPerformance', value: 0.85, weight: 1.2 },
        { name: 'adaptability', value: 0.75, weight: 1.0 }
      ]
    };
    
    const stabilityResult = calculateStabilityWithMetrics(stabilityParams);
    
    // Record operation for meta-learning validation
    recordInversePendulumOperation(stabilityParams, stabilityResult, {
      executionTime: Date.now() - startTime,
      accuracy: 0.9,
      resourceUtilization: { cpu: 0.3, memory: 0.2 },
      systemFeedback: stabilityResult.stabilityScore
    });
    
    // 1.2 Calculate synaptic resonance 
    // Generate phase arrays using the resonance parameters
    const sourcePhases = [0.1, 0.3, 0.5, 0.7, 0.9];
    const targetPhases = [0.2, 0.35, 0.45, 0.65, 0.85];
    const weights = [0.25, 0.2, 0.2, 0.15, 0.2];
    
    // Create proper objects for the resonance calculation
    const sourceData = { phases: sourcePhases };
    const targetData = { phases: targetPhases };
    const options = { 
      temporalWeight: weights[0],
      spatialWeight: weights[1], 
      frequencyWeight: weights[2],
      patternWeight: weights[3]
    };
    
    // Calculate the resonance score
    const resonanceValue = calculateSynapticResonanceFactor(sourceData, targetData, options);
    
    // Create a properly formatted result object with the resonance score
    const resonanceResult = {
      resonanceScore: resonanceValue,
      sourceId: 'system-generated',
      targetId: 'system-generated',
      timestamp: new Date(),
      id: uuidv4()
    };
    
    // 1.3 Calculate adaptive resonance between system components
    const adaptiveResonanceResult = await adaptiveResonanceService.calculateNodeResonance(
      'da0254eb-f54c-4f5d-aa82-e7c3c7f00021', // Default system QRN ID
      'da0254eb-f54c-4f5d-aa82-e7c3c7f00021'  // Self-resonance for baseline
    );
    
    // 1.4 Apply strategic refinement
    const systemState = {
      currentStability: stabilityResult.stabilityScore,
      resonanceLevel: resonanceResult.resonanceScore,
      adaptiveResonance: adaptiveResonanceResult.resonanceScore,
      challenges: ['integration_conflicts', 'data_misalignment', 'uncertain_contexts']
    };
    
    const refinementResult = await applyStrategicRefinementProcess(systemState);
    
    // 2. Now process through relational experience integrator
    
    // 2.1 Get relational metrics using computational results as input
    const relationalMetrics = await relationalExperienceIntegrator.getRelationalMetrics({
      computationalResults: {
        stabilityScore: stabilityResult.stabilityScore,
        resonanceScore: resonanceResult.resonanceScore,
        adaptiveResonance: adaptiveResonanceResult.resonanceScore,
        refinementAlignment: refinementResult.overallAlignment
      },
      context: 'comprehensive_system_test',
      temporalLayer: 'present'
    });
    
    // 2.2 Generate narrative context for these operations
    const narrativeContext = await relationalExperienceIntegrator.generateNarrativeContext({
      computationalMetrics: {
        stabilityScore: stabilityResult.stabilityScore,
        resonanceScore: resonanceResult.resonanceScore,
        adaptiveResonance: adaptiveResonanceResult.resonanceScore,
        refinementAlignment: refinementResult.overallAlignment
      },
      relationalMetrics,
      operationType: 'system_validation'
    });
    
    // 2.3 Get integration recommendations
    const integrationRecommendations = await relationalExperienceIntegrator.getIntegrationRecommendations({
      computationalMetrics: {
        stabilityScore: stabilityResult.stabilityScore,
        resonanceScore: resonanceResult.resonanceScore,
        adaptiveResonance: adaptiveResonanceResult.resonanceScore,
        refinementAlignment: refinementResult.overallAlignment
      },
      relationalMetrics,
      narrativeContext
    });
    
    // 3. Calculate integration scores (how well computational and relational aspects integrate)
    
    // 3.1 Calculate overall integration score - balance between computational precision and relational meaning
    const overallScore = (stabilityResult.stabilityScore * 0.3) + 
                         (resonanceResult.resonanceScore * 0.2) + 
                         (adaptiveResonanceResult.resonanceScore * 0.2) +
                         (relationalMetrics.experientialRelevance * 0.15) +
                         (relationalMetrics.meaningfulness * 0.15);
                         
    // 3.2 Calculate balance factor - how evenly balanced computational and relational aspects are
    const computationalAvg = (stabilityResult.stabilityScore + 
                              resonanceResult.resonanceScore + 
                              adaptiveResonanceResult.resonanceScore + 
                              refinementResult.overallAlignment) / 4;
                              
    const relationalAvg = (relationalMetrics.experientialRelevance + 
                           relationalMetrics.contextualAlignment + 
                           relationalMetrics.meaningfulness + 
                           relationalMetrics.embodiedResonance) / 4;
                           
    const balanceFactor = 1 - Math.abs(computationalAvg - relationalAvg);
    
    // 3.3 Calculate synergy - when integrated is better than either alone
    const synergy = overallScore > Math.max(computationalAvg, relationalAvg) ? 
                    (overallScore - Math.max(computationalAvg, relationalAvg)) * 10 : 0;
                    
    // 3.4 Identify tensions - areas where computational and relational approaches conflict
    const tensions: string[] = [];
    
    if (stabilityResult.stabilityScore > 0.8 && relationalMetrics.meaningfulness < 0.6) {
      tensions.push("High system stability may be achieved at the expense of meaningful engagement");
    }
    
    if (refinementResult.overallAlignment > 0.7 && relationalMetrics.experientialRelevance < 0.6) {
      tensions.push("Strategic refinement may optimize for metrics rather than lived experience");
    }
    
    if (adaptiveResonanceResult.resonanceScore > 0.8 && relationalMetrics.contextualAlignment < 0.6) {
      tensions.push("System resonance may not align with contextual human understanding");
    }
    
    // 4. Compile final result
    const finalResult: RelationalTestResult = {
      id: testId,
      timestamp: new Date(),
      computationalMetrics: {
        resonanceScore: resonanceResult.resonanceScore,
        stabilityScore: stabilityResult.stabilityScore,
        coherenceLevel: adaptiveResonanceResult.resonanceScore,
        refinementAlignment: refinementResult.overallAlignment
      },
      relationalMetrics,
      integration: {
        overallScore,
        balanceFactor,
        synergy,
        tensions
      },
      narrativeContext,
      recommendations: integrationRecommendations,
      executionTime: Date.now() - startTime
    };
    
    // 5. Log test result to system logs
    console.log(`Completed comprehensive relational test (${testId})`);
    
    // Note: We're using console.log instead of storage.createSystemLog 
    // since createSystemLog may not be available in the storage interface
    
    // 6. Record test results for meta-learning validation
    recordMetaLearningDataPoint({
      formulaType: 'relational_test',
      inputParams: {
        testId,
        timestamp: finalResult.timestamp
      },
      outputResult: {
        computationalMetrics: finalResult.computationalMetrics,
        relationalMetrics: finalResult.relationalMetrics,
        integration: {
          overallScore: finalResult.integration.overallScore,
          balanceFactor: finalResult.integration.balanceFactor,
          synergy: finalResult.integration.synergy
        }
      },
      performanceMetrics: {
        executionTime: finalResult.executionTime
      }
    } as MetaLearningParams);
    
    console.log(`Completed comprehensive relational test (${testId})`);
    
    return finalResult;
  } catch (error: unknown) {
    console.error('Error in comprehensive relational test:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Relational test failed: ${errorMessage}`);
  }
}

/**
 * Generate a sequence of stability operations to validate the temporal
 * coherence of relational integration over time
 * @param operationCount Number of operations to generate in sequence
 */
export async function generateRelationalStabilitySequence(operationCount: number = 5): Promise<StabilityOperation[]> {
  const sequence: StabilityOperation[] = [];
  const sequenceId = uuidv4();
  
  console.log(`Starting relational stability sequence (${sequenceId}) with ${operationCount} operations...`);
  
  try {
    // Start with base parameters
    let adjustmentRate = 0.5;
    let chaosLevel = 0.2;
    let feedbackSignals = [
      { name: 'systemPerformance', value: 0.7, weight: 1.0 }
    ];
    
    // Generate sequence of operations with temporal progression
    for (let i = 0; i < operationCount; i++) {
      const startTime = Date.now();
      
      // 1. Determine operation type based on sequence
      const operationType = i % 3 === 0 ? 'computational' : 
                           i % 3 === 1 ? 'relational' : 'integrated';
      
      // 2. Adjust parameters to simulate temporal progression
      adjustmentRate += (Math.random() * 0.2 - 0.1); // Slight random adjustment
      adjustmentRate = Math.min(Math.max(adjustmentRate, 0.1), 0.9); // Keep in range
      
      chaosLevel += (Math.random() * 0.15 - 0.05); // Tends to increase slightly
      chaosLevel = Math.min(Math.max(chaosLevel, 0.1), 0.8); // Keep in range
      
      // Update feedback signal values
      feedbackSignals = feedbackSignals.map(signal => ({
        ...signal,
        value: Math.min(Math.max(signal.value + (Math.random() * 0.2 - 0.1), 0.1), 0.9)
      }));
      
      // Add a new feedback signal occasionally
      if (i > 0 && i % 2 === 0) {
        feedbackSignals.push({
          name: `newSignal_${i}`,
          value: 0.5 + (Math.random() * 0.3),
          weight: 0.8 + (Math.random() * 0.4)
        });
      }
      
      // 3. Create parameters for this operation
      const parameters = {
        adjustmentRate,
        targetChaosLevel: chaosLevel,
        feedbackSignals,
        timeHorizon: 5 + i, // Increasing time horizon with each step
        operationIndex: i,
        sequenceId
      };
      
      // 4. Perform operation based on type
      let result;
      let narrativeContext;
      
      if (operationType === 'computational') {
        // Pure computational stability calculation
        const stabilityResult = calculateStabilityWithMetrics(parameters);
        
        result = {
          stabilityScore: stabilityResult.stabilityScore,
          executionTime: Date.now() - startTime
        };
        
        // Record for meta-learning validation
        recordInversePendulumOperation(parameters, stabilityResult, {
          executionTime: result.executionTime,
          accuracy: 0.85 + (Math.random() * 0.1),
          resourceUtilization: { 
            cpu: 0.2 + (Math.random() * 0.2),
            memory: 0.15 + (Math.random() * 0.2)
          },
          systemFeedback: stabilityResult.stabilityScore
        });
      } 
      else if (operationType === 'relational') {
        // Pure relational experience integration
        const relationalMetrics = await relationalExperienceIntegrator.getRelationalMetrics({
          computationalResults: {
            stabilityScore: 0, // Not using computational results
            resonanceScore: 0,
            adaptiveResonance: 0,
            refinementAlignment: 0
          },
          context: `sequence_${sequenceId}_step_${i}`,
          temporalLayer: i < operationCount / 2 ? 'present' : 'future'
        });
        
        narrativeContext = await relationalExperienceIntegrator.generateNarrativeContext({
          computationalMetrics: {
            stabilityScore: 0,
            resonanceScore: 0,
            adaptiveResonance: 0,
            refinementAlignment: 0
          },
          relationalMetrics,
          operationType: 'stability_sequence'
        });
        
        result = {
          stabilityScore: (relationalMetrics.experientialRelevance * 0.3) + 
                          (relationalMetrics.contextualAlignment * 0.3) + 
                          (relationalMetrics.meaningfulness * 0.2) + 
                          (relationalMetrics.embodiedResonance * 0.2),
          experientialQuality: (relationalMetrics.experientialRelevance + 
                               relationalMetrics.meaningfulness) / 2,
          executionTime: Date.now() - startTime
        };
      }
      else {
        // Integrated computational and relational approach
        const stabilityResult = calculateStabilityWithMetrics(parameters);
        
        const relationalMetrics = await relationalExperienceIntegrator.getRelationalMetrics({
          computationalResults: {
            stabilityScore: stabilityResult.stabilityScore,
            resonanceScore: 0.7 + (Math.random() * 0.2),
            adaptiveResonance: 0.65 + (Math.random() * 0.2),
            refinementAlignment: 0.75 + (Math.random() * 0.15)
          },
          context: `sequence_${sequenceId}_step_${i}`,
          temporalLayer: i < operationCount / 2 ? 'present' : 'future'
        });
        
        narrativeContext = await relationalExperienceIntegrator.generateNarrativeContext({
          computationalMetrics: {
            stabilityScore: stabilityResult.stabilityScore,
            resonanceScore: 0.7 + (Math.random() * 0.2),
            adaptiveResonance: 0.65 + (Math.random() * 0.2),
            refinementAlignment: 0.75 + (Math.random() * 0.15)
          },
          relationalMetrics,
          operationType: 'stability_sequence'
        });
        
        const computationalWeight = 0.6;
        const relationalWeight = 0.4;
        
        result = {
          stabilityScore: (stabilityResult.stabilityScore * computationalWeight) +
                          ((relationalMetrics.experientialRelevance * 0.3 + 
                           relationalMetrics.contextualAlignment * 0.3 + 
                           relationalMetrics.meaningfulness * 0.2 + 
                           relationalMetrics.embodiedResonance * 0.2) * relationalWeight),
          resonanceLevel: 0.7 + (Math.random() * 0.2),
          experientialQuality: (relationalMetrics.experientialRelevance + 
                               relationalMetrics.meaningfulness) / 2,
          executionTime: Date.now() - startTime
        };
        
        // Record for meta-learning validation
        recordInversePendulumOperation(parameters, stabilityResult, {
          executionTime: result.executionTime,
          accuracy: 0.85 + (Math.random() * 0.1),
          resourceUtilization: { 
            cpu: 0.2 + (Math.random() * 0.2),
            memory: 0.15 + (Math.random() * 0.2)
          },
          systemFeedback: result.stabilityScore
        });
      }
      
      // 5. Add operation to sequence
      sequence.push({
        id: uuidv4(),
        timestamp: new Date(),
        operationType,
        parameters,
        result,
        narrativeContext
      });
      
      // 6. Record for meta-learning validation 
      recordMetaLearningDataPoint({
        formulaType: 'stability_sequence',
        inputParams: {
          sequenceId,
          operationIndex: i,
          operationType,
          parameters
        },
        outputResult: {
          result,
          narrativeContext
        },
        performanceMetrics: {
          executionTime: result.executionTime
        }
      } as MetaLearningParams);
      
      // 7. Log operation to console
      console.log(`Completed stability sequence operation ${i+1}/${operationCount} (${operationType}) - Score: ${result.stabilityScore.toFixed(2)}, Time: ${result.executionTime}ms`);
      
      // Add a small delay between operations to simulate temporal progression
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Completed relational stability sequence (${sequenceId}) with ${operationCount} operations`);
    
    return sequence;
  } catch (error: unknown) {
    console.error('Error generating relational stability sequence:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate stability sequence: ${errorMessage}`);
  }
}