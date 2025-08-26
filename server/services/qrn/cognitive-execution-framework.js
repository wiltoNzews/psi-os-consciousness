/**
 * 4W+1H+(X)WHICH(MACRO-OFFSET)(FLOW-ANTI-FLOW) Framework Implementation
 *
 * This module implements the Advanced Cognitive Execution Framework that refines
 * decision-making with clear contextualization and strategic prioritization.
 *
 * Core Logic:
 * Decision(t) = (4W+1H)×WHICH(X,Y)×MACRO-OFFSET×(FLOW/ANTI-FLOW)
 *
 * Where:
 * - 4W+1H: Who, What, When, Where + How.
 * - WHICH(X,Y): Strategic lens (X) and aspect priority (Y).
 * - MACRO-OFFSET: Long-term systemic implications adjustment.
 * - FLOW/ANTI-FLOW: Balance between intuitive momentum and necessary disruption.
 */
import { v4 as uuidv4 } from 'uuid';
/**
 * Apply the 4W+1H+(X)WHICH(MACRO-OFFSET)(FLOW-ANTI-FLOW) framework to a decision
 *
 * @param context - The 4W+1H context elements
 * @param strategicLens - The WHICH strategic lens and aspect priorities
 * @param macroOffset - The MACRO-OFFSET long-term systemic implications
 * @param flowDynamics - The FLOW/ANTI-FLOW momentum and disruption balance
 * @returns Comprehensive cognitive framework analysis result
 */
export function applyCognitiveExecutionFramework(context, strategicLens, macroOffset, flowDynamics) {
    // 1. Validate context completeness
    var contextScore = evaluateContextCompleteness(context);
    // 2. Evaluate strategic lens alignment
    var lensAlignmentScore = evaluateStrategicLensAlignment(context, strategicLens);
    // 3. Calculate macro offset adjustment
    var macroAdjustment = calculateMacroOffsetAdjustment(macroOffset);
    // 4. Determine flow/anti-flow balance value
    var flowBalanceValue = calculateFlowBalance(flowDynamics);
    // 5. Calculate overall decision value 
    // Core formula: Decision(t) = (4W+1H)×WHICH(X,Y)×MACRO-OFFSET×(FLOW/ANTI-FLOW)
    var decisionValue = contextScore * lensAlignmentScore * macroAdjustment * flowBalanceValue;
    // Scale to -100 to 100 range
    var scaledDecisionValue = Math.max(-100, Math.min(100, decisionValue * 100));
    // 6. Generate confidence score based on component quality
    var confidenceScore = calculateConfidenceScore(context, strategicLens, macroOffset, flowDynamics);
    // 7. Generate alternative decisions
    var alternativeDecisions = generateAlternativeDecisions(context, strategicLens, macroOffset, flowDynamics, scaledDecisionValue);
    // 8. Generate action steps
    var actionSteps = generateActionSteps(context, strategicLens, scaledDecisionValue, confidenceScore);
    // 9. Generate warnings
    var warnings = generateWarnings(context, strategicLens, macroOffset, flowDynamics, confidenceScore);
    // 10. Generate insight summary
    var insightSummary = generateInsightSummary(context, strategicLens, macroOffset, flowDynamics, scaledDecisionValue, confidenceScore);
    // 11. Create and return comprehensive result
    return {
        id: uuidv4(),
        timestamp: new Date(),
        context: context,
        strategicLens: strategicLens,
        macroOffset: macroOffset,
        flowDynamics: flowDynamics,
        decisionValue: scaledDecisionValue,
        confidenceScore: confidenceScore,
        alternativeDecisions: alternativeDecisions,
        actionSteps: actionSteps,
        warnings: warnings,
        insightSummary: insightSummary
    };
}
/**
 * Evaluate how complete and coherent the context is
 * @returns Score between 0-1
 */
function evaluateContextCompleteness(context) {
    var score = 0;
    var maxScore = 0;
    // Who component (score based on stakeholder completeness)
    if (context.who && context.who.length > 0) {
        score += Math.min(1, context.who.length / 5); // Up to 5 stakeholders for max score
        maxScore += 1;
    }
    // What component (score based on clarity and specificity)
    if (context.what && context.what.trim().length > 0) {
        // Simple length-based heuristic as a proxy for specificity
        score += Math.min(1, context.what.length / 100);
        maxScore += 1;
    }
    // When component
    if (context.when) {
        // Timeframe specified
        if (context.when.timeframe && context.when.timeframe.trim().length > 0) {
            score += 0.5;
        }
        // Urgency specified
        if (context.when.urgency >= 1 && context.when.urgency <= 10) {
            score += 0.3;
        }
        // Deadline specified
        if (context.when.deadline) {
            score += 0.2;
        }
        maxScore += 1;
    }
    // Where component
    if (context.where) {
        // Domain specified
        if (context.where.domain && context.where.domain.trim().length > 0) {
            score += 0.5;
        }
        // Location specified
        if (context.where.location && context.where.location.trim().length > 0) {
            score += 0.2;
        }
        // Scope specified
        if (context.where.scope && context.where.scope.trim().length > 0) {
            score += 0.3;
        }
        maxScore += 1;
    }
    // How component
    if (context.how) {
        // Methods specified
        if (context.how.methods && context.how.methods.length > 0) {
            score += Math.min(0.4, context.how.methods.length * 0.1);
        }
        // Resources specified
        if (context.how.resources && context.how.resources.length > 0) {
            score += Math.min(0.3, context.how.resources.length * 0.1);
        }
        // Constraints specified
        if (context.how.constraints && context.how.constraints.length > 0) {
            score += Math.min(0.3, context.how.constraints.length * 0.1);
        }
        maxScore += 1;
    }
    // Calculate final score (0-1)
    return maxScore > 0 ? score / maxScore : 0;
}
/**
 * Evaluate how well the strategic lens aligns with the context
 * @returns Score between 0-1
 */
function evaluateStrategicLensAlignment(context, strategicLens) {
    // Default moderate alignment
    var alignment = 0.5;
    // Analyze lens appropriateness for the context
    switch (strategicLens.lens) {
        case 'efficiency':
            // Efficiency lens works well when resources are constrained
            if (context.how.constraints.length > 0) {
                alignment += 0.2;
            }
            // Less appropriate for innovation-focused activities
            if (context.what.toLowerCase().includes('innovat') ||
                context.what.toLowerCase().includes('creat')) {
                alignment -= 0.1;
            }
            break;
        case 'innovation':
            // Innovation lens works well for creative and future-focused contexts
            if (context.what.toLowerCase().includes('innovat') ||
                context.what.toLowerCase().includes('creat') ||
                context.what.toLowerCase().includes('new') ||
                context.what.toLowerCase().includes('future')) {
                alignment += 0.2;
            }
            // Less appropriate for stability or maintenance contexts
            if (context.what.toLowerCase().includes('maintain') ||
                context.what.toLowerCase().includes('stabil')) {
                alignment -= 0.1;
            }
            break;
        case 'stability':
            // Stability lens works well for maintenance and risk-sensitive contexts
            if (context.what.toLowerCase().includes('maintain') ||
                context.what.toLowerCase().includes('stabil') ||
                context.what.toLowerCase().includes('risk') ||
                context.what.toLowerCase().includes('secure')) {
                alignment += 0.2;
            }
            // Less appropriate for growth or innovation contexts
            if (context.what.toLowerCase().includes('growth') ||
                context.what.toLowerCase().includes('innovat')) {
                alignment -= 0.1;
            }
            break;
        case 'growth':
            // Growth lens works well for expansion and opportunity contexts
            if (context.what.toLowerCase().includes('growth') ||
                context.what.toLowerCase().includes('expan') ||
                context.what.toLowerCase().includes('opportunit') ||
                context.what.toLowerCase().includes('market')) {
                alignment += 0.2;
            }
            // Less appropriate for cost-cutting or risk-averse contexts
            if (context.what.toLowerCase().includes('cost') ||
                context.what.toLowerCase().includes('risk')) {
                alignment -= 0.1;
            }
            break;
        case 'resilience':
            // Resilience lens works well for long-term and risk-related contexts
            if (context.when.timeframe.toLowerCase().includes('long') ||
                context.what.toLowerCase().includes('risk') ||
                context.what.toLowerCase().includes('adapt') ||
                context.what.toLowerCase().includes('uncertain')) {
                alignment += 0.2;
            }
            // Less appropriate for short-term urgent contexts
            if (context.when.urgency > 8 ||
                context.when.timeframe.toLowerCase().includes('immediate')) {
                alignment -= 0.1;
            }
            break;
        default:
            // For custom lenses, maintain default alignment
            break;
    }
    // Evaluate aspect priorities against context needs
    var aspects = strategicLens.aspects || [];
    if (aspects.length > 0) {
        // Bonus for having multiple prioritized aspects (more comprehensive)
        alignment += Math.min(0.1, (aspects.length - 1) * 0.02);
        // Analyze if high-priority aspects align with the context
        var highPriorityAspects = aspects.filter(function (a) { return a.priority >= 7; });
        var _loop_1 = function (aspect) {
            // Check if aspect is mentioned in context
            if (context.what.toLowerCase().includes(aspect.name.toLowerCase()) ||
                context.how.methods.some(function (m) { return m.toLowerCase().includes(aspect.name.toLowerCase()); })) {
                alignment += 0.05;
            }
        };
        for (var _i = 0, highPriorityAspects_1 = highPriorityAspects; _i < highPriorityAspects_1.length; _i++) {
            var aspect = highPriorityAspects_1[_i];
            _loop_1(aspect);
        }
    }
    // Ensure alignment stays within 0-1 range
    return Math.max(0, Math.min(1, alignment));
}
/**
 * Calculate macro offset adjustment factor
 * @returns Factor between 0.5-1.5
 */
function calculateMacroOffsetAdjustment(macroOffset) {
    // Base adjustment is neutral (1.0)
    var adjustment = 1.0;
    // Calculate weighted impact of systemic implications
    if (macroOffset.systemicImplications && macroOffset.systemicImplications.length > 0) {
        var totalImpact = 0;
        var totalWeight = 0;
        for (var _i = 0, _a = macroOffset.systemicImplications; _i < _a.length; _i++) {
            var implication = _a[_i];
            // Convert timeline to weight (long-term implications get higher weight)
            var timelineWeight = 1.0;
            if (implication.timeline === 'medium-term')
                timelineWeight = 1.5;
            if (implication.timeline === 'long-term')
                timelineWeight = 2.0;
            // Weight by certainty and timeline
            var weight = implication.certainty * timelineWeight;
            // Add to weighted sum
            totalImpact += implication.impact * weight;
            totalWeight += weight;
        }
        // Calculate average weighted impact
        var avgImpact = totalWeight > 0 ? totalImpact / totalWeight : 0;
        // Convert to adjustment factor (normalized to 0.5-1.5 range)
        // Zero impact -> neutral (1.0)
        // Max positive impact (10) -> 1.5
        // Max negative impact (-10) -> 0.5
        adjustment = 1.0 + (avgImpact / 20); // Range: 0.5 to 1.5
    }
    // Apply explicit offset factor if provided
    if (macroOffset.offsetFactor !== undefined) {
        // Blend with calculated adjustment
        adjustment = (adjustment + macroOffset.offsetFactor) / 2;
    }
    // Ensure adjustment stays within reasonable bounds
    return Math.max(0.5, Math.min(1.5, adjustment));
}
/**
 * Calculate flow/anti-flow balance value
 * @returns Value between 0.5-1.5
 */
function calculateFlowBalance(flowDynamics) {
    // Default to neutral if flow ratio not provided
    if (flowDynamics.flowRatio === undefined) {
        return 1.0;
    }
    // Calculate basic balance from flow ratio
    // flowRatio > 1: Flow dominates (support current momentum)
    // flowRatio < 1: Anti-flow dominates (disruption valuable)
    // flowRatio = 1: Perfect balance
    // Convert to 0.5-1.5 range
    // flowRatio of 3 (strong flow) -> 1.5
    // flowRatio of 0.33 (strong anti-flow) -> 0.5
    // flowRatio of 1 (balance) -> 1.0
    var balance = Math.log(flowDynamics.flowRatio) / Math.log(3) + 1;
    // Ensure balance stays within bounds
    return Math.max(0.5, Math.min(1.5, balance));
}
/**
 * Calculate confidence score for the decision
 * @returns Score between 0-1
 */
function calculateConfidenceScore(context, strategicLens, macroOffset, flowDynamics) {
    // 1. Context completeness contribution (40%)
    var contextScore = evaluateContextCompleteness(context) * 0.4;
    // 2. Strategic lens alignment contribution (30%)
    var lensScore = evaluateStrategicLensAlignment(context, strategicLens) * 0.3;
    // 3. Macro offset certainty contribution (15%)
    var offsetCertainty = 0.5; // Default moderate certainty
    if (macroOffset.systemicImplications && macroOffset.systemicImplications.length > 0) {
        // Average certainty across all implications
        var avgCertainty = macroOffset.systemicImplications.reduce(function (sum, imp) { return sum + imp.certainty; }, 0) / macroOffset.systemicImplications.length;
        offsetCertainty = avgCertainty;
    }
    var offsetScore = offsetCertainty * 0.15;
    // 4. Flow dynamics clarity contribution (15%)
    var flowClarity = 0.5; // Default moderate clarity
    // Higher current momentum gives more clarity
    if (flowDynamics.currentMomentum > 5) {
        flowClarity += 0.2;
    }
    // Clear flow direction increases clarity
    if (flowDynamics.flowDirection && flowDynamics.flowDirection.length > 10) {
        flowClarity += 0.1;
    }
    // Extreme flow ratios (very clear dominance) increase clarity
    if (flowDynamics.flowRatio > 3 || flowDynamics.flowRatio < 0.33) {
        flowClarity += 0.1;
    }
    // Ensure flow clarity stays within bounds
    flowClarity = Math.min(1, flowClarity);
    var flowScore = flowClarity * 0.15;
    // Calculate overall confidence score
    return contextScore + lensScore + offsetScore + flowScore;
}
/**
 * Generate alternative decisions based on framework components
 */
function generateAlternativeDecisions(context, strategicLens, macroOffset, flowDynamics, mainDecisionValue) {
    var alternatives = [];
    // 1. Alternative based on changing the strategic lens
    if (strategicLens.alternativeLenses && strategicLens.alternativeLenses.length > 0) {
        var altLens = strategicLens.alternativeLenses[0];
        alternatives.push({
            description: "Apply ".concat(altLens, " lens instead of ").concat(strategicLens.lens),
            relativeValue: mainDecisionValue * (Math.random() * 0.4 + 0.6) // 60-100% of main value
        });
    }
    // 2. Alternative based on inverting the flow/anti-flow balance
    if (flowDynamics.flowRatio !== undefined) {
        var inverseDynamics = flowDynamics.flowRatio > 1
            ? "Prioritize disruption over continuity"
            : "Prioritize continuity over disruption";
        alternatives.push({
            description: inverseDynamics,
            relativeValue: mainDecisionValue * (Math.random() * 0.5 + 0.3) // 30-80% of main value
        });
    }
    // 3. Alternative based on timeline shift
    var timeframeShift = context.when.timeframe.toLowerCase().includes('long')
        ? "Focus on short-term outcomes instead of long-term"
        : "Focus on long-term outcomes instead of immediate results";
    alternatives.push({
        description: timeframeShift,
        relativeValue: mainDecisionValue * (Math.random() * 0.4 + 0.5) // 50-90% of main value
    });
    // 4. Alternative based on scope change
    var scopeShift = context.where.scope === 'local' || context.where.scope === 'regional'
        ? "Expand scope to system-wide approach"
        : "Narrow focus to local implementation";
    alternatives.push({
        description: scopeShift,
        relativeValue: mainDecisionValue * (Math.random() * 0.3 + 0.6) // 60-90% of main value
    });
    // Sort by relative value (descending)
    return alternatives.sort(function (a, b) { return b.relativeValue - a.relativeValue; });
}
/**
 * Generate concrete action steps based on framework analysis
 */
function generateActionSteps(context, strategicLens, decisionValue, confidenceScore) {
    var steps = [];
    // Initial action based on decision type
    steps.push("Define clear metrics for \"".concat(context.what, "\" success aligned with ").concat(strategicLens.lens, " lens"));
    // Add stakeholder-focused actions
    if (context.who && context.who.length > 0) {
        steps.push("Engage key stakeholders: ".concat(context.who.join(', ')));
    }
    // Add method-focused actions
    if (context.how && context.how.methods && context.how.methods.length > 0) {
        // Pick primary method
        var primaryMethod = context.how.methods[0];
        steps.push("Implement using ".concat(primaryMethod, " as primary approach"));
        // If multiple methods, add integration step
        if (context.how.methods.length > 1) {
            steps.push("Create integration plan for multiple methods: ".concat(context.how.methods.join(', ')));
        }
    }
    // Add resource allocation action
    if (context.how && context.how.resources && context.how.resources.length > 0) {
        steps.push("Allocate resources: ".concat(context.how.resources.join(', ')));
    }
    // Add timeline-based action
    if (context.when) {
        if (context.when.deadline) {
            steps.push("Set milestone timeline to meet deadline: ".concat(context.when.deadline.toDateString()));
        }
        else {
            steps.push("Establish timeline appropriate for ".concat(context.when.timeframe, " timeframe"));
        }
    }
    // Add high-priority aspect focus
    if (strategicLens.aspects && strategicLens.aspects.length > 0) {
        var highPriorityAspects = strategicLens.aspects
            .filter(function (a) { return a.priority >= 8; })
            .map(function (a) { return a.name; });
        if (highPriorityAspects.length > 0) {
            steps.push("Prioritize these critical aspects: ".concat(highPriorityAspects.join(', ')));
        }
    }
    // Add confidence-based actions
    if (confidenceScore < 0.7) {
        steps.push("Implement validation steps to address uncertainty (confidence: ".concat((confidenceScore * 100).toFixed(0), "%)"));
    }
    // Add value-based scope suggestion
    if (Math.abs(decisionValue) > 70) {
        steps.push("Expand implementation scope due to high potential impact (value: ".concat(decisionValue.toFixed(0), ")"));
    }
    else if (Math.abs(decisionValue) < 30) {
        steps.push("Start with limited pilot implementation due to moderate potential impact (value: ".concat(decisionValue.toFixed(0), ")"));
    }
    return steps;
}
/**
 * Generate warnings based on framework analysis
 */
function generateWarnings(context, strategicLens, macroOffset, flowDynamics, confidenceScore) {
    var warnings = [];
    // Low confidence warning
    if (confidenceScore < 0.6) {
        warnings.push("Low decision confidence (".concat((confidenceScore * 100).toFixed(0), "%). Consider gathering more information."));
    }
    // Strategic lens mismatch warning
    var lensAlignment = evaluateStrategicLensAlignment(context, strategicLens);
    if (lensAlignment < 0.6) {
        warnings.push("The ".concat(strategicLens.lens, " lens may not be optimal for this context. Consider alternatives."));
    }
    // Timeframe/urgency mismatch warning
    if (context.when.urgency > 8 && context.when.timeframe.toLowerCase().includes('long')) {
        warnings.push("High urgency (".concat(context.when.urgency, "/10) contradicts long-term timeframe."));
    }
    // Resource constraints warning
    if (context.how.constraints && context.how.constraints.length > 2) {
        warnings.push("Multiple constraints identified (".concat(context.how.constraints.length, "). May impact feasibility."));
    }
    // Negative systemic implications warning
    if (macroOffset.systemicImplications && macroOffset.systemicImplications.length > 0) {
        var negativeImplications = macroOffset.systemicImplications.filter(function (imp) { return imp.impact < 0; });
        if (negativeImplications.length > 0) {
            warnings.push("".concat(negativeImplications.length, " negative systemic implications identified. Consider mitigation strategies."));
        }
    }
    // Flow/Anti-Flow balance warning
    if (flowDynamics.flowRatio > 3 && flowDynamics.disruptionValue > 7) {
        warnings.push("High disruption value (".concat(flowDynamics.disruptionValue, "/10) is being overlooked due to strong flow momentum."));
    }
    // Stakeholder warning
    if (context.who.length < 2) {
        warnings.push("Limited stakeholder perspective (".concat(context.who.length, "). Consider broader involvement."));
    }
    return warnings;
}
/**
 * Generate insight summary based on framework analysis
 */
function generateInsightSummary(context, strategicLens, macroOffset, flowDynamics, decisionValue, confidenceScore) {
    // Summary template based on decision value and confidence
    var summary = '';
    // Decision value assessment
    if (decisionValue > 70) {
        summary += 'High-value decision with strong potential impact. ';
    }
    else if (decisionValue > 30) {
        summary += 'Moderate-value decision with good potential impact. ';
    }
    else if (decisionValue > 0) {
        summary += 'Low-positive value decision with limited potential impact. ';
    }
    else if (decisionValue > -30) {
        summary += 'Slightly negative decision that may not be worth pursuing. ';
    }
    else {
        summary += 'Negative-value decision that should likely be reconsidered. ';
    }
    // Confidence assessment
    if (confidenceScore > 0.8) {
        summary += 'Analysis has high confidence. ';
    }
    else if (confidenceScore > 0.6) {
        summary += 'Analysis has moderate confidence. ';
    }
    else {
        summary += 'Analysis has limited confidence. Additional validation recommended. ';
    }
    // Framework component insights
    summary += "The ".concat(strategicLens.lens, " strategic lens ");
    if (evaluateStrategicLensAlignment(context, strategicLens) > 0.7) {
        summary += 'aligns well with the context. ';
    }
    else {
        summary += 'has moderate alignment with the context. ';
    }
    // Flow dynamics insight
    if (flowDynamics.equilibriumState === 'flow-dominant') {
        summary += 'Current momentum strongly influences the decision. ';
    }
    else if (flowDynamics.equilibriumState === 'anti-flow-dominant') {
        summary += 'Disrupting current patterns is valuable in this context. ';
    }
    else {
        summary += 'The decision balances continuation and innovation appropriately. ';
    }
    // Macro offset insight
    if (macroOffset.systemicImplications && macroOffset.systemicImplications.length > 0) {
        var avgImpact = macroOffset.systemicImplications.reduce(function (sum, imp) { return sum + imp.impact; }, 0) / macroOffset.systemicImplications.length;
        if (avgImpact > 3) {
            summary += 'Long-term systemic implications are strongly positive. ';
        }
        else if (avgImpact > 0) {
            summary += 'Long-term systemic implications are moderately positive. ';
        }
        else if (avgImpact > -3) {
            summary += 'Long-term systemic implications are slightly negative but manageable. ';
        }
        else {
            summary += 'Long-term systemic implications are concerning and require mitigation. ';
        }
    }
    return summary;
}
