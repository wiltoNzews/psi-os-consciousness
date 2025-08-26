/**
 * Validation API Service
 * 
 * This service provides a central access point for all meta-learning validation
 * metrics across the Neural-Symbiotic Orchestration Platform. It aggregates data
 * from all formula validation trackers and provides unified access to metrics,
 * proofs of learning, and recommendations.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  getAllMetaLearningValidations,
  MetaLearningValidationResult
} from './meta-learning-validation.js';

import {
  validateResonanceEvolution,
  ResonanceEvolutionResult
} from './resonance-evolution-tracker.js';

import {
  calculateStabilityConvergence,
  StabilityConvergenceResult
} from './stability-convergence-tracker.js';

import {
  calculateIntegrationCoherence,
  IntegrationCoherenceResult
} from './integration-coherence-tracker.js';

import {
  validateCognitiveFramework,
  CognitiveFrameworkValidationResult
} from './cognitive-framework-tracker.js';

/**
 * Formula type enum
 */
export enum FormulaType {
  SYNAPTIC_RESONANCE = 'synaptic_resonance',
  INVERSE_PENDULUM = 'inverse_pendulum',
  WILTON_GOD = 'wilton_god',
  COGNITIVE_FRAMEWORK = '4w1h_framework',
  META_VOID = 'meta_void',
  WFCRS = 'wfcrs',
  MSMF = 'msmf',
  HPEF = 'hpef',
  EXECUTION_FORMULA = 'execution_formula'
}

/**
 * Formula validation summary
 */
export interface FormulaValidationSummary {
  id: string;
  timestamp: Date;
  formulaType: FormulaType;
  formulaName: string;
  isLearning: boolean;
  learningConfidence: number; // 0-1 scale
  learningRate: number; // 0-1 scale
  currentMetrics: {
    siq: number; // System Intelligence Quotient
    ilc: number; // Iterative Learning Capacity 
    pir: number; // Predictive Insight Ratio
    elq: number; // Experiential Learning Quotient
    tlc: number; // Total Lifecycle Coherence
    nprr: number; // Normalized Performance-Risk Ratio
    sme: number; // Symbiotic Meta-Efficiency
  };
  baselineMetrics: {
    siq: number;
    ilc: number;
    pir: number;
    elq: number;
    tlc: number;
    nprr: number;
    sme: number;
  };
  improvementMetrics: {
    siq: number;
    ilc: number;
    pir: number;
    elq: number;
    tlc: number;
    nprr: number;
    sme: number;
  };
  keyInsights: string[];
  recommendations: string[];
  isStatisticallySignificant: boolean;
  rawValidationData: any; // Formula-specific validation data
}

/**
 * System-wide validation metrics
 */
export interface SystemValidationMetrics {
  id: string;
  timestamp: Date;
  overallLearningScore: number; // 0-1 scale
  formulaSummaries: FormulaValidationSummary[];
  systemLevelInsights: {
    synergy: number; // How well formulas work together (0-1)
    balancedLearning: number; // How balanced learning is across formulas (0-1)
    adaptiveCapacity: number; // How well system adapts to new challenges (0-1)
    humanAISymbiosis: number; // How well human-AI interaction enhances learning (0-1)
  };
  systemRecommendations: string[];
}

/**
 * Get formula-specific validation results
 * 
 * @param formulaType Type of formula to get validation results for
 * @param timeWindow Optional time window in milliseconds
 * @returns Formula validation summary
 */
export function getFormulaValidation(
  formulaType: FormulaType,
  timeWindow?: number
): FormulaValidationSummary {
  // Get the appropriate validation result based on formula type
  let specificValidation: any;
  
  switch (formulaType) {
    case FormulaType.SYNAPTIC_RESONANCE:
      specificValidation = validateResonanceEvolution(timeWindow);
      break;
      
    case FormulaType.INVERSE_PENDULUM:
      specificValidation = calculateStabilityConvergence(timeWindow);
      break;
      
    case FormulaType.WILTON_GOD:
      specificValidation = calculateIntegrationCoherence(timeWindow);
      break;
      
    case FormulaType.COGNITIVE_FRAMEWORK:
      specificValidation = validateCognitiveFramework(timeWindow);
      break;
      
    default:
      // For other formulas, use the generic meta-learning validation
      break;
  }
  
  // Get the general meta-learning validation for this formula
  const metaLearningResults = getAllMetaLearningValidations();
  const metaLearningValidation = metaLearningResults.find(
    result => result.formula === mapFormulaTypeToMetaLearningType(formulaType)
  );
  
  // If no validation data is available, return a default summary
  if (!metaLearningValidation) {
    return createDefaultValidationSummary(formulaType);
  }
  
  // Create the validation summary
  return {
    id: uuidv4(),
    timestamp: new Date(),
    formulaType,
    formulaName: getFormulaName(formulaType),
    isLearning: metaLearningValidation.learningEvidence.recentImprovement,
    learningConfidence: metaLearningValidation.learningEvidence.confidenceLevel,
    learningRate: metaLearningValidation.learningEvidence.improvementRate,
    currentMetrics: metaLearningValidation.metrics.current,
    baselineMetrics: metaLearningValidation.metrics.baseline,
    improvementMetrics: metaLearningValidation.metrics.improvement,
    keyInsights: generateKeyInsights(formulaType, metaLearningValidation, specificValidation),
    recommendations: metaLearningValidation.recommendations,
    isStatisticallySignificant: metaLearningValidation.learningEvidence.isStatisticallySignificant,
    rawValidationData: specificValidation || metaLearningValidation.formulaSpecificValidation
  };
}

/**
 * Get system-wide validation metrics
 * 
 * @param timeWindow Optional time window in milliseconds
 * @returns System validation metrics
 */
export function getSystemValidationMetrics(
  timeWindow?: number
): SystemValidationMetrics {
  // Get validation summaries for all formulas
  const formulaSummaries = Object.values(FormulaType).map(
    formulaType => getFormulaValidation(formulaType, timeWindow)
  );
  
  // Calculate overall learning score (average of all formula learning rates)
  const overallLearningScore = formulaSummaries.reduce(
    (sum, summary) => sum + summary.learningRate, 0
  ) / formulaSummaries.length;
  
  // Calculate system-level insights
  const systemLevelInsights = calculateSystemLevelInsights(formulaSummaries);
  
  // Generate system recommendations
  const systemRecommendations = generateSystemRecommendations(
    formulaSummaries,
    systemLevelInsights
  );
  
  return {
    id: uuidv4(),
    timestamp: new Date(),
    overallLearningScore,
    formulaSummaries,
    systemLevelInsights,
    systemRecommendations
  };
}

/**
 * Map formula type to meta-learning type
 */
function mapFormulaTypeToMetaLearningType(
  formulaType: FormulaType
): string {
  switch (formulaType) {
    case FormulaType.SYNAPTIC_RESONANCE:
      return 'synaptic_resonance';
      
    case FormulaType.INVERSE_PENDULUM:
      return 'inverse_pendulum';
      
    case FormulaType.WILTON_GOD:
      return 'wilton_god';
      
    case FormulaType.COGNITIVE_FRAMEWORK:
      return 'cognitive_framework';
      
    case FormulaType.META_VOID:
      return 'meta_void';
      
    case FormulaType.WFCRS:
      return 'wfcrs';
      
    case FormulaType.MSMF:
      return 'msmf';
      
    case FormulaType.HPEF:
      return 'hpef';
      
    case FormulaType.EXECUTION_FORMULA:
      return 'execution_formula';
      
    default:
      return 'unknown';
  }
}

/**
 * Get formula name
 */
function getFormulaName(
  formulaType: FormulaType
): string {
  switch (formulaType) {
    case FormulaType.SYNAPTIC_RESONANCE:
      return 'Synaptic Resonance Factor';
      
    case FormulaType.INVERSE_PENDULUM:
      return 'Inverse Pendulum Formula';
      
    case FormulaType.WILTON_GOD:
      return 'Wilton GOD Formula';
      
    case FormulaType.COGNITIVE_FRAMEWORK:
      return '4W+1H+(X)WHICH Framework';
      
    case FormulaType.META_VOID:
      return 'Meta-Void Preview & Review';
      
    case FormulaType.WFCRS:
      return 'Wilton Formula Chunking & Resonance';
      
    case FormulaType.MSMF:
      return 'Meta-Synthesis Modular Formula';
      
    case FormulaType.HPEF:
      return 'Hyper-Precision Adaptive Execution';
      
    case FormulaType.EXECUTION_FORMULA:
      return 'Execution Formula';
      
    default:
      return 'Unknown Formula';
  }
}

/**
 * Generate key insights based on validation results
 */
function generateKeyInsights(
  formulaType: FormulaType,
  metaLearningValidation: MetaLearningValidationResult,
  specificValidation: any
): string[] {
  const insights: string[] = [];
  
  // Add insights about overall learning
  if (metaLearningValidation.learningEvidence.recentImprovement) {
    insights.push(`${getFormulaName(formulaType)} is actively learning and improving with ${(metaLearningValidation.learningEvidence.confidenceLevel * 100).toFixed(1)}% confidence`);
  } else {
    insights.push(`${getFormulaName(formulaType)} is not showing significant improvement in recent operations`);
  }
  
  // Add insights about most improved metrics
  const improvements = Object.entries(metaLearningValidation.metrics.improvement)
    .sort(([_, a], [__, b]) => b - a);
  
  if (improvements.length > 0 && improvements[0][1] > 0) {
    insights.push(`Strongest improvement in ${improvements[0][0].toUpperCase()} metric with +${improvements[0][1].toFixed(2)} points gain`);
  }
  
  // Add formula-specific insights
  switch (formulaType) {
    case FormulaType.SYNAPTIC_RESONANCE:
      if (specificValidation) {
        const resonanceValidation = specificValidation as ResonanceEvolutionResult;
        
        insights.push(`Resonance evolution trend: ${resonanceValidation.evolutionTrend}`);
        
        if (resonanceValidation.pairwiseAnalysis.length > 0) {
          const topPairs = resonanceValidation.pairwiseAnalysis
            .sort((a, b) => b.evolutionRate - a.evolutionRate)
            .slice(0, 3);
          
          if (topPairs.length > 0) {
            insights.push(`Top performing pairs: ${topPairs.map(p => `${p.sourceId}-${p.targetId}`).join(', ')}`);
          }
        }
        
        insights.push(`Learning efficiency: ${(resonanceValidation.learningEfficiency * 100).toFixed(1)}%`);
      }
      break;
      
    case FormulaType.INVERSE_PENDULUM:
      if (specificValidation) {
        const stabilityValidation = specificValidation as StabilityConvergenceResult;
        
        insights.push(`Stability convergence: ${(stabilityValidation.overallConvergence * 100).toFixed(1)}%`);
        insights.push(`Oscillation damping: ${(stabilityValidation.oscillationDamping * 100).toFixed(1)}%`);
        insights.push(`Adjustment rate adaptation: ${(stabilityValidation.adaptiveCapacity.adjustmentRateAdaptation * 100).toFixed(1)}%`);
      }
      break;
      
    case FormulaType.WILTON_GOD:
      if (specificValidation) {
        const coherenceValidation = specificValidation as IntegrationCoherenceResult;
        
        insights.push(`Integration coherence: ${(coherenceValidation.overallCoherence * 100).toFixed(1)}%`);
        insights.push(`Domain coverage: ${(coherenceValidation.domainCoverage * 100).toFixed(1)}%`);
        insights.push(`Transfer learning coefficient: ${(coherenceValidation.crossLayerTransferLearning.transferCoefficient * 100).toFixed(1)}%`);
      }
      break;
      
    case FormulaType.COGNITIVE_FRAMEWORK:
      if (specificValidation) {
        const frameworkValidation = specificValidation as CognitiveFrameworkValidationResult;
        
        insights.push(`Overall improvement: ${(frameworkValidation.overallImprovement * 100).toFixed(1)}%`);
        insights.push(`Strongest dimension: ${frameworkValidation.dimensionalAnalysis.strongestDimension}`);
        insights.push(`Knowledge retention: ${(frameworkValidation.learningDynamics.knowledgeRetention * 100).toFixed(1)}%`);
      }
      break;
  }
  
  return insights;
}

/**
 * Calculate system-level insights
 */
function calculateSystemLevelInsights(
  formulaSummaries: FormulaValidationSummary[]
): SystemValidationMetrics['systemLevelInsights'] {
  // Calculate synergy (how well formulas work together)
  // Higher when multiple formulas are learning simultaneously
  const learningCount = formulaSummaries.filter(summary => summary.isLearning).length;
  const synergy = learningCount / formulaSummaries.length;
  
  // Calculate balanced learning (how balanced learning is across formulas)
  // Higher when learning rates are similar across formulas
  const learningRates = formulaSummaries.map(summary => summary.learningRate);
  const minRate = Math.min(...learningRates);
  const maxRate = Math.max(...learningRates);
  const balancedLearning = maxRate > 0 ? minRate / maxRate : 0;
  
  // Calculate adaptive capacity (how well system adapts to new challenges)
  // Based on average ILC (Iterative Learning Capacity) improvements
  const ilcImprovements = formulaSummaries.map(summary => summary.improvementMetrics.ilc);
  const adaptiveCapacity = ilcImprovements.reduce((sum, val) => sum + Math.max(0, val), 0) / 
                         formulaSummaries.length;
  
  // Calculate human-AI symbiosis (how well human-AI interaction enhances learning)
  // Based on average SME (Symbiotic Meta-Efficiency) improvements
  const smeImprovements = formulaSummaries.map(summary => summary.improvementMetrics.sme);
  const humanAISymbiosis = smeImprovements.reduce((sum, val) => sum + Math.max(0, val), 0) / 
                          formulaSummaries.length;
  
  return {
    synergy,
    balancedLearning,
    adaptiveCapacity,
    humanAISymbiosis
  };
}

/**
 * Generate system recommendations
 */
function generateSystemRecommendations(
  formulaSummaries: FormulaValidationSummary[],
  systemLevelInsights: SystemValidationMetrics['systemLevelInsights']
): string[] {
  const recommendations: string[] = [];
  
  // Identify formulas that need improvement
  const strugglingFormulas = formulaSummaries
    .filter(summary => !summary.isLearning || summary.learningRate < 0.3)
    .map(summary => summary.formulaName);
  
  if (strugglingFormulas.length > 0) {
    recommendations.push(`Prioritize improvement for underperforming formulas: ${strugglingFormulas.join(', ')}`);
  }
  
  // System-level recommendations based on insights
  if (systemLevelInsights.synergy < 0.5) {
    recommendations.push('Low formula synergy detected - implement cross-formula learning mechanisms');
  }
  
  if (systemLevelInsights.balancedLearning < 0.3) {
    recommendations.push('Unbalanced learning across formulas - redistribute learning resources more evenly');
  }
  
  if (systemLevelInsights.adaptiveCapacity < 0.4) {
    recommendations.push('Limited adaptive capacity - increase exposure to diverse, novel challenges');
  }
  
  if (systemLevelInsights.humanAISymbiosis < 0.5) {
    recommendations.push('Suboptimal human-AI symbiosis - enhance human feedback integration mechanisms');
  }
  
  // Add overall system recommendation
  if (recommendations.length === 0) {
    recommendations.push('All formulas are learning effectively - continue current training approach');
  } else {
    // Calculate overall system health
    const systemHealth = (
      systemLevelInsights.synergy +
      systemLevelInsights.balancedLearning +
      systemLevelInsights.adaptiveCapacity +
      systemLevelInsights.humanAISymbiosis
    ) / 4;
    
    if (systemHealth < 0.3) {
      recommendations.push('Critical system optimization needed - consider system-wide reset and recalibration');
    } else if (systemHealth < 0.6) {
      recommendations.push('Moderate system health - incremental improvements recommended');
    } else {
      recommendations.push('Good system health - targeted optimizations will further enhance performance');
    }
  }
  
  return recommendations;
}

/**
 * Create a default validation summary when insufficient data is available
 */
function createDefaultValidationSummary(
  formulaType: FormulaType
): FormulaValidationSummary {
  return {
    id: uuidv4(),
    timestamp: new Date(),
    formulaType,
    formulaName: getFormulaName(formulaType),
    isLearning: false,
    learningConfidence: 0.1,
    learningRate: 0,
    currentMetrics: {
      siq: 74, ilc: 5, pir: 0.43, elq: 62, tlc: 0.57, nprr: 0.62, sme: 0.41
    },
    baselineMetrics: {
      siq: 74, ilc: 5, pir: 0.43, elq: 62, tlc: 0.57, nprr: 0.62, sme: 0.41
    },
    improvementMetrics: {
      siq: 0, ilc: 0, pir: 0, elq: 0, tlc: 0, nprr: 0, sme: 0
    },
    keyInsights: [
      `Insufficient data for ${getFormulaName(formulaType)} validation`,
      'More operational data needed to validate learning'
    ],
    recommendations: [
      `Collect at least 5 operational data points for ${getFormulaName(formulaType)}`,
      'Ensure diversity in test scenarios to enable comprehensive validation'
    ],
    isStatisticallySignificant: false,
    rawValidationData: null
  };
}