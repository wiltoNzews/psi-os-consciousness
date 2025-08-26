/**
 * Validation API Service
 *
 * This service provides a central access point for all meta-learning validation
 * metrics across the Neural-Symbiotic Orchestration Platform. It aggregates data
 * from all formula validation trackers and provides unified access to metrics,
 * proofs of learning, and recommendations.
 */
import { v4 as uuidv4 } from 'uuid';
import { getAllMetaLearningValidations } from './meta-learning-validation.js';
import { validateResonanceEvolution } from './resonance-evolution-tracker.js';
import { calculateStabilityConvergence } from './stability-convergence-tracker.js';
import { calculateIntegrationCoherence } from './integration-coherence-tracker.js';
import { validateCognitiveFramework } from './cognitive-framework-tracker.js';
/**
 * Formula type enum
 */
export var FormulaType;
(function (FormulaType) {
    FormulaType["SYNAPTIC_RESONANCE"] = "synaptic_resonance";
    FormulaType["INVERSE_PENDULUM"] = "inverse_pendulum";
    FormulaType["WILTON_GOD"] = "wilton_god";
    FormulaType["COGNITIVE_FRAMEWORK"] = "4w1h_framework";
    FormulaType["META_VOID"] = "meta_void";
    FormulaType["WFCRS"] = "wfcrs";
    FormulaType["MSMF"] = "msmf";
    FormulaType["HPEF"] = "hpef";
    FormulaType["EXECUTION_FORMULA"] = "execution_formula";
})(FormulaType || (FormulaType = {}));
/**
 * Get formula-specific validation results
 *
 * @param formulaType Type of formula to get validation results for
 * @param timeWindow Optional time window in milliseconds
 * @returns Formula validation summary
 */
export function getFormulaValidation(formulaType, timeWindow) {
    // Get the appropriate validation result based on formula type
    var specificValidation;
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
    var metaLearningResults = getAllMetaLearningValidations();
    var metaLearningValidation = metaLearningResults.find(function (result) { return result.formula === mapFormulaTypeToMetaLearningType(formulaType); });
    // If no validation data is available, return a default summary
    if (!metaLearningValidation) {
        return createDefaultValidationSummary(formulaType);
    }
    // Create the validation summary
    return {
        id: uuidv4(),
        timestamp: new Date(),
        formulaType: formulaType,
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
export function getSystemValidationMetrics(timeWindow) {
    // Get validation summaries for all formulas
    var formulaSummaries = Object.values(FormulaType).map(function (formulaType) { return getFormulaValidation(formulaType, timeWindow); });
    // Calculate overall learning score (average of all formula learning rates)
    var overallLearningScore = formulaSummaries.reduce(function (sum, summary) { return sum + summary.learningRate; }, 0) / formulaSummaries.length;
    // Calculate system-level insights
    var systemLevelInsights = calculateSystemLevelInsights(formulaSummaries);
    // Generate system recommendations
    var systemRecommendations = generateSystemRecommendations(formulaSummaries, systemLevelInsights);
    return {
        id: uuidv4(),
        timestamp: new Date(),
        overallLearningScore: overallLearningScore,
        formulaSummaries: formulaSummaries,
        systemLevelInsights: systemLevelInsights,
        systemRecommendations: systemRecommendations
    };
}
/**
 * Map formula type to meta-learning type
 */
function mapFormulaTypeToMetaLearningType(formulaType) {
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
function getFormulaName(formulaType) {
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
function generateKeyInsights(formulaType, metaLearningValidation, specificValidation) {
    var insights = [];
    // Add insights about overall learning
    if (metaLearningValidation.learningEvidence.recentImprovement) {
        insights.push("".concat(getFormulaName(formulaType), " is actively learning and improving with ").concat((metaLearningValidation.learningEvidence.confidenceLevel * 100).toFixed(1), "% confidence"));
    }
    else {
        insights.push("".concat(getFormulaName(formulaType), " is not showing significant improvement in recent operations"));
    }
    // Add insights about most improved metrics
    var improvements = Object.entries(metaLearningValidation.metrics.improvement)
        .sort(function (_a, _b) {
        var _ = _a[0], a = _a[1];
        var __ = _b[0], b = _b[1];
        return b - a;
    });
    if (improvements.length > 0 && improvements[0][1] > 0) {
        insights.push("Strongest improvement in ".concat(improvements[0][0].toUpperCase(), " metric with +").concat(improvements[0][1].toFixed(2), " points gain"));
    }
    // Add formula-specific insights
    switch (formulaType) {
        case FormulaType.SYNAPTIC_RESONANCE:
            if (specificValidation) {
                var resonanceValidation = specificValidation;
                insights.push("Resonance evolution trend: ".concat(resonanceValidation.evolutionTrend));
                if (resonanceValidation.pairwiseAnalysis.length > 0) {
                    var topPairs = resonanceValidation.pairwiseAnalysis
                        .sort(function (a, b) { return b.evolutionRate - a.evolutionRate; })
                        .slice(0, 3);
                    if (topPairs.length > 0) {
                        insights.push("Top performing pairs: ".concat(topPairs.map(function (p) { return "".concat(p.sourceId, "-").concat(p.targetId); }).join(', ')));
                    }
                }
                insights.push("Learning efficiency: ".concat((resonanceValidation.learningEfficiency * 100).toFixed(1), "%"));
            }
            break;
        case FormulaType.INVERSE_PENDULUM:
            if (specificValidation) {
                var stabilityValidation = specificValidation;
                insights.push("Stability convergence: ".concat((stabilityValidation.overallConvergence * 100).toFixed(1), "%"));
                insights.push("Oscillation damping: ".concat((stabilityValidation.oscillationDamping * 100).toFixed(1), "%"));
                insights.push("Adjustment rate adaptation: ".concat((stabilityValidation.adaptiveCapacity.adjustmentRateAdaptation * 100).toFixed(1), "%"));
            }
            break;
        case FormulaType.WILTON_GOD:
            if (specificValidation) {
                var coherenceValidation = specificValidation;
                insights.push("Integration coherence: ".concat((coherenceValidation.overallCoherence * 100).toFixed(1), "%"));
                insights.push("Domain coverage: ".concat((coherenceValidation.domainCoverage * 100).toFixed(1), "%"));
                insights.push("Transfer learning coefficient: ".concat((coherenceValidation.crossLayerTransferLearning.transferCoefficient * 100).toFixed(1), "%"));
            }
            break;
        case FormulaType.COGNITIVE_FRAMEWORK:
            if (specificValidation) {
                var frameworkValidation = specificValidation;
                insights.push("Overall improvement: ".concat((frameworkValidation.overallImprovement * 100).toFixed(1), "%"));
                insights.push("Strongest dimension: ".concat(frameworkValidation.dimensionalAnalysis.strongestDimension));
                insights.push("Knowledge retention: ".concat((frameworkValidation.learningDynamics.knowledgeRetention * 100).toFixed(1), "%"));
            }
            break;
    }
    return insights;
}
/**
 * Calculate system-level insights
 */
function calculateSystemLevelInsights(formulaSummaries) {
    // Calculate synergy (how well formulas work together)
    // Higher when multiple formulas are learning simultaneously
    var learningCount = formulaSummaries.filter(function (summary) { return summary.isLearning; }).length;
    var synergy = learningCount / formulaSummaries.length;
    // Calculate balanced learning (how balanced learning is across formulas)
    // Higher when learning rates are similar across formulas
    var learningRates = formulaSummaries.map(function (summary) { return summary.learningRate; });
    var minRate = Math.min.apply(Math, learningRates);
    var maxRate = Math.max.apply(Math, learningRates);
    var balancedLearning = maxRate > 0 ? minRate / maxRate : 0;
    // Calculate adaptive capacity (how well system adapts to new challenges)
    // Based on average ILC (Iterative Learning Capacity) improvements
    var ilcImprovements = formulaSummaries.map(function (summary) { return summary.improvementMetrics.ilc; });
    var adaptiveCapacity = ilcImprovements.reduce(function (sum, val) { return sum + Math.max(0, val); }, 0) /
        formulaSummaries.length;
    // Calculate human-AI symbiosis (how well human-AI interaction enhances learning)
    // Based on average SME (Symbiotic Meta-Efficiency) improvements
    var smeImprovements = formulaSummaries.map(function (summary) { return summary.improvementMetrics.sme; });
    var humanAISymbiosis = smeImprovements.reduce(function (sum, val) { return sum + Math.max(0, val); }, 0) /
        formulaSummaries.length;
    return {
        synergy: synergy,
        balancedLearning: balancedLearning,
        adaptiveCapacity: adaptiveCapacity,
        humanAISymbiosis: humanAISymbiosis
    };
}
/**
 * Generate system recommendations
 */
function generateSystemRecommendations(formulaSummaries, systemLevelInsights) {
    var recommendations = [];
    // Identify formulas that need improvement
    var strugglingFormulas = formulaSummaries
        .filter(function (summary) { return !summary.isLearning || summary.learningRate < 0.3; })
        .map(function (summary) { return summary.formulaName; });
    if (strugglingFormulas.length > 0) {
        recommendations.push("Prioritize improvement for underperforming formulas: ".concat(strugglingFormulas.join(', ')));
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
    }
    else {
        // Calculate overall system health
        var systemHealth = (systemLevelInsights.synergy +
            systemLevelInsights.balancedLearning +
            systemLevelInsights.adaptiveCapacity +
            systemLevelInsights.humanAISymbiosis) / 4;
        if (systemHealth < 0.3) {
            recommendations.push('Critical system optimization needed - consider system-wide reset and recalibration');
        }
        else if (systemHealth < 0.6) {
            recommendations.push('Moderate system health - incremental improvements recommended');
        }
        else {
            recommendations.push('Good system health - targeted optimizations will further enhance performance');
        }
    }
    return recommendations;
}
/**
 * Create a default validation summary when insufficient data is available
 */
function createDefaultValidationSummary(formulaType) {
    return {
        id: uuidv4(),
        timestamp: new Date(),
        formulaType: formulaType,
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
            "Insufficient data for ".concat(getFormulaName(formulaType), " validation"),
            'More operational data needed to validate learning'
        ],
        recommendations: [
            "Collect at least 5 operational data points for ".concat(getFormulaName(formulaType)),
            'Ensure diversity in test scenarios to enable comprehensive validation'
        ],
        isStatisticallySignificant: false,
        rawValidationData: null
    };
}
