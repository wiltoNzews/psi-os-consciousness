/**
 * Meta-Void Preview & Meta-Void Review Implementation
 *
 * This module implements the Meta-Void tools for dynamic strategic recalibration:
 * - Meta-Void Preview: Tool to foresee decisions/actions for dynamic strategic evaluation
 * - Meta-Void Review: Tool to retrospectively analyze decisions for recalibration
 *
 * Core Logic:
 * MetaVoidPreview(t) = ForeSight(Chaos, Structure, t+1)
 * MetaVoidReview(t) = ReflectiveInsight(Decisions(t), Outcomes(t))
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { v4 as uuidv4 } from 'uuid';
/**
 * Generate a Meta-Void Preview
 *
 * Implements MetaVoidPreview(t) = ForeSight(Chaos, Structure, t+1)
 *
 * @param params - Preview parameters
 * @returns Meta-Void Preview result
 */
export function generateMetaVoidPreview(params) {
    // 1. Set up base structure
    var baseStructure = {
        id: uuidv4(),
        timestamp: new Date(),
        subject: params.subject,
        context: params.context,
        quantumReadiness: calculateQuantumReadiness(params.context.domain, params.timeHorizon)
    };
    // 2. Set preview type (default to anticipatory if not specified)
    var previewType = params.previewType || 'anticipatory';
    // 3. Generate chaos factors
    var chaosFactors = generateChaosFactors(params.context.domain, params.timeHorizon, params.knownChaosFactors || []);
    // 4. Generate structure elements
    var structureElements = generateStructureElements(params.context.domain, params.existingStructures || []);
    // 5. Generate scenarios
    var scenarios = generateScenarios(params.subject, params.context, chaosFactors, structureElements, params.timeHorizon);
    // 6. Generate decision pathways
    var decisionPathways = generateDecisionPathways(params.subject, params.context.objectives, scenarios);
    // 7. Generate insights
    var insights = generatePreviewInsights(params.subject, params.context, chaosFactors, scenarios, decisionPathways);
    // 8. Generate recommendations
    var recommendations = generatePreviewRecommendations(chaosFactors, scenarios, decisionPathways, params.context.objectives);
    // 9. Construct complete preview result
    return __assign(__assign({}, baseStructure), { previewType: previewType, timeHorizon: params.timeHorizon, chaosFactors: chaosFactors, structureElements: structureElements, scenarios: scenarios, decisionPathways: decisionPathways, insights: insights, recommendations: recommendations });
}
/**
 * Generate a Meta-Void Review
 *
 * Implements MetaVoidReview(t) = ReflectiveInsight(Decisions(t), Outcomes(t))
 *
 * @param params - Review parameters
 * @returns Meta-Void Review result
 */
export function generateMetaVoidReview(params) {
    // 1. Set up base structure
    var baseStructure = {
        id: uuidv4(),
        timestamp: new Date(),
        subject: params.subject,
        context: params.context,
        quantumReadiness: calculateQuantumReadiness(params.context.domain, 0) // Present-focused
    };
    // 2. Set review type (default to evaluative if not specified)
    var reviewType = params.reviewType || 'evaluative';
    // 3. Process actual outcomes
    var actualOutcomes = analyzeActualOutcomes(params.actualOutcomes, params.originalDecision.expectedOutcomes);
    // 4. Evaluate decision effectiveness
    var decisionEffectiveness = evaluateDecisionEffectiveness(params.originalDecision, actualOutcomes, params.context.objectives);
    // 5. Extract lessons learned
    var lessonsLearned = extractLessonsLearned(params.originalDecision, actualOutcomes, params.context);
    // 6. Identify systemic patterns
    var systemicPatterns = identifySystemicPatterns(actualOutcomes, params.observedPatterns || []);
    // 7. Generate recalibration guidance
    var recalibrationGuidance = generateRecalibrationGuidance(lessonsLearned, systemicPatterns, decisionEffectiveness);
    // 8. Generate insights
    var insights = generateReviewInsights(params.subject, params.originalDecision, actualOutcomes, lessonsLearned, systemicPatterns);
    // 9. Generate recommendations
    var recommendations = generateReviewRecommendations(decisionEffectiveness, lessonsLearned, recalibrationGuidance);
    // 10. Construct complete review result
    return __assign(__assign({}, baseStructure), { reviewType: reviewType, actualOutcomes: actualOutcomes, decisionEffectiveness: decisionEffectiveness, lessonsLearned: lessonsLearned, systemicPatterns: systemicPatterns, recalibrationGuidance: recalibrationGuidance, insights: insights, recommendations: recommendations });
}
/**
 * Calculate quantum readiness based on domain and time horizon
 * @returns Score between 0-1
 */
function calculateQuantumReadiness(domain, timeHorizon) {
    // Base readiness - moderately high for comprehensive framework
    var readiness = 0.65;
    // Domain adjustments
    if (domain.toLowerCase().includes('quantum') ||
        domain.toLowerCase().includes('physics') ||
        domain.toLowerCase().includes('ai') ||
        domain.toLowerCase().includes('complex')) {
        readiness += 0.15; // Higher readiness for inherently quantum-friendly domains
    }
    if (domain.toLowerCase().includes('finance') ||
        domain.toLowerCase().includes('business') ||
        domain.toLowerCase().includes('social')) {
        readiness -= 0.1; // Lower readiness for traditionally classical domains
    }
    // Time horizon adjustments
    if (timeHorizon > 0) {
        // Future predictions are more quantum (uncertainty increases)
        readiness += Math.min(0.2, timeHorizon * 0.02);
    }
    else {
        // Past analysis is more classical (fixed outcomes)
        readiness -= 0.1;
    }
    // Ensure readiness stays within 0-1 range
    return Math.max(0, Math.min(1, readiness));
}
/**
 * Generate chaos factors for preview
 */
function generateChaosFactors(domain, timeHorizon, knownFactors) {
    // Initialize with known factors
    var factors = knownFactors.map(function (factor) { return ({
        name: factor.name,
        unpredictability: factor.unpredictability || 0.7, // Default high unpredictability
        potentialImpact: factor.potentialImpact || 7, // Default high impact
        mitigationOptions: []
    }); });
    // Add standard domain-specific factors if not already included
    var domainFactors = getDomainSpecificChaosFactors(domain);
    var _loop_1 = function (domainFactor) {
        if (!factors.some(function (f) { return f.name.toLowerCase() === domainFactor.name.toLowerCase(); })) {
            factors.push(domainFactor);
        }
    };
    for (var _i = 0, domainFactors_1 = domainFactors; _i < domainFactors_1.length; _i++) {
        var domainFactor = domainFactors_1[_i];
        _loop_1(domainFactor);
    }
    // Add time-horizon specific factors
    if (timeHorizon > 10) {
        // Long-term horizon - add disruptive factors
        factors.push({
            name: "Technological disruption",
            unpredictability: 0.85,
            potentialImpact: 9,
            mitigationOptions: ["Investment in R&D", "Adaptable infrastructure", "Scenario planning"]
        });
    }
    // Generate mitigation options for factors that don't have them
    for (var _a = 0, factors_1 = factors; _a < factors_1.length; _a++) {
        var factor = factors_1[_a];
        if (factor.mitigationOptions.length === 0) {
            factor.mitigationOptions = generateMitigationOptions(factor.name, factor.unpredictability);
        }
    }
    return factors;
}
/**
 * Get domain-specific chaos factors
 */
function getDomainSpecificChaosFactors(domain) {
    // Common chaos factors by domain
    var domainFactors = {
        'finance': [
            {
                name: "Market volatility",
                unpredictability: 0.8,
                potentialImpact: 8,
                mitigationOptions: ["Diversification", "Hedging strategies", "Real-time monitoring"]
            },
            {
                name: "Regulatory changes",
                unpredictability: 0.6,
                potentialImpact: 9,
                mitigationOptions: ["Compliance frameworks", "Regulatory relationships", "Adaptable systems"]
            }
        ],
        'technology': [
            {
                name: "Technical debt",
                unpredictability: 0.5,
                potentialImpact: 7,
                mitigationOptions: ["Refactoring", "Architecture reviews", "Technical debt management"]
            },
            {
                name: "Emerging competition",
                unpredictability: 0.7,
                potentialImpact: 8,
                mitigationOptions: ["Market monitoring", "Innovation pipeline", "Agile response capabilities"]
            }
        ],
        'health': [
            {
                name: "Pandemic risks",
                unpredictability: 0.9,
                potentialImpact: 10,
                mitigationOptions: ["Preparedness planning", "Surge capacity", "Remote capabilities"]
            },
            {
                name: "Clinical uncertainties",
                unpredictability: 0.7,
                potentialImpact: 8,
                mitigationOptions: ["Evidence-based protocols", "Clinical decision support", "Patient monitoring"]
            }
        ]
    };
    // Default chaos factors for any domain
    var defaultFactors = [
        {
            name: "Stakeholder alignment shifts",
            unpredictability: 0.6,
            potentialImpact: 7,
            mitigationOptions: ["Regular engagement", "Shared vision development", "Interest mapping"]
        },
        {
            name: "Resource constraints",
            unpredictability: 0.5,
            potentialImpact: 6,
            mitigationOptions: ["Resource planning", "Prioritization frameworks", "Alternative sourcing"]
        }
    ];
    // Find matching domain or use default
    for (var _i = 0, _a = Object.entries(domainFactors); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], factors = _b[1];
        if (domain.toLowerCase().includes(key)) {
            return factors;
        }
    }
    return defaultFactors;
}
/**
 * Generate mitigation options for a chaos factor
 */
function generateMitigationOptions(factorName, unpredictability) {
    var options = [];
    // General mitigation approaches based on unpredictability
    if (unpredictability > 0.8) {
        // Highly unpredictable - focus on resilience and adaptability
        options.push("Develop resilience capabilities");
        options.push("Create adaptive response frameworks");
        options.push("Establish early warning systems");
    }
    else if (unpredictability > 0.5) {
        // Moderately unpredictable - focus on forecasting and preparation
        options.push("Enhance forecasting capabilities");
        options.push("Prepare contingency plans");
        options.push("Develop scenario-based strategies");
    }
    else {
        // More predictable - focus on management and control
        options.push("Implement risk management protocols");
        options.push("Establish monitoring systems");
        options.push("Develop mitigation playbooks");
    }
    // Factor-specific mitigations based on name keywords
    if (factorName.toLowerCase().includes("market")) {
        options.push("Market intelligence systems");
    }
    if (factorName.toLowerCase().includes("technology") ||
        factorName.toLowerCase().includes("technical")) {
        options.push("Technology radar monitoring");
        options.push("Flexible architecture design");
    }
    if (factorName.toLowerCase().includes("resource")) {
        options.push("Resource diversification strategy");
        options.push("Efficiency optimization initiatives");
    }
    if (factorName.toLowerCase().includes("stakeholder")) {
        options.push("Stakeholder engagement program");
        options.push("Communication strategy development");
    }
    return options;
}
/**
 * Generate structure elements for preview
 */
function generateStructureElements(domain, existingStructures) {
    // Initialize with existing structures
    var elements = existingStructures.map(function (structure) { return ({
        name: structure.name,
        stability: structure.stability || 0.7, // Default high stability
        adaptability: structure.adaptability || 0.5, // Default moderate adaptability
        relevance: 0.8 // Default high relevance
    }); });
    // Add standard domain-specific structures if not already included
    var domainStructures = getDomainSpecificStructures(domain);
    var _loop_2 = function (domainStructure) {
        if (!elements.some(function (e) { return e.name.toLowerCase() === domainStructure.name.toLowerCase(); })) {
            elements.push(domainStructure);
        }
    };
    for (var _i = 0, domainStructures_1 = domainStructures; _i < domainStructures_1.length; _i++) {
        var domainStructure = domainStructures_1[_i];
        _loop_2(domainStructure);
    }
    // Calculate relevance for elements that don't have it
    for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
        var element = elements_1[_a];
        if (element.relevance === undefined) {
            element.relevance = calculateStructureRelevance(element.name, domain);
        }
    }
    return elements;
}
/**
 * Get domain-specific structure elements
 */
function getDomainSpecificStructures(domain) {
    // Common structure elements by domain
    var domainStructures = {
        'finance': [
            {
                name: "Regulatory frameworks",
                stability: 0.8,
                adaptability: 0.4,
                relevance: 0.9
            },
            {
                name: "Risk assessment protocols",
                stability: 0.7,
                adaptability: 0.6,
                relevance: 0.9
            }
        ],
        'technology': [
            {
                name: "Technical architecture",
                stability: 0.6,
                adaptability: 0.7,
                relevance: 0.9
            },
            {
                name: "Development methodology",
                stability: 0.5,
                adaptability: 0.8,
                relevance: 0.8
            }
        ],
        'health': [
            {
                name: "Clinical protocols",
                stability: 0.9,
                adaptability: 0.4,
                relevance: 0.9
            },
            {
                name: "Care delivery systems",
                stability: 0.7,
                adaptability: 0.6,
                relevance: 0.8
            }
        ]
    };
    // Default structure elements for any domain
    var defaultStructures = [
        {
            name: "Organizational hierarchy",
            stability: 0.8,
            adaptability: 0.3,
            relevance: 0.7
        },
        {
            name: "Decision-making processes",
            stability: 0.7,
            adaptability: 0.5,
            relevance: 0.8
        }
    ];
    // Find matching domain or use default
    for (var _i = 0, _a = Object.entries(domainStructures); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], structures = _b[1];
        if (domain.toLowerCase().includes(key)) {
            return structures;
        }
    }
    return defaultStructures;
}
/**
 * Calculate relevance of a structure element to a domain
 */
function calculateStructureRelevance(structureName, domain) {
    // Default moderate relevance
    var relevance = 0.6;
    // Check if structure name contains domain keywords
    if (domain.split(' ').some(function (word) {
        return structureName.toLowerCase().includes(word.toLowerCase());
    })) {
        relevance += 0.2; // Higher relevance if direct domain mention
    }
    // Common high-relevance structures across domains
    if (structureName.toLowerCase().includes("governance") ||
        structureName.toLowerCase().includes("process") ||
        structureName.toLowerCase().includes("system") ||
        structureName.toLowerCase().includes("framework")) {
        relevance += 0.1;
    }
    // Ensure relevance stays within 0-1 range
    return Math.min(1, relevance);
}
/**
 * Generate scenarios for preview
 */
function generateScenarios(subject, context, chaosFactors, structureElements, timeHorizon) {
    var scenarios = [];
    // 1. Generate baseline expected scenario
    scenarios.push(generateBaselineScenario(subject, context, structureElements, timeHorizon));
    // 2. Generate chaos-factor driven scenarios
    // Focus on high-impact, high-unpredictability factors
    var disruptiveFactors = chaosFactors
        .filter(function (f) { return f.potentialImpact >= 7 && f.unpredictability >= 0.6; })
        .slice(0, 2); // Limit to top 2 disruptive factors
    for (var _i = 0, disruptiveFactors_1 = disruptiveFactors; _i < disruptiveFactors_1.length; _i++) {
        var factor = disruptiveFactors_1[_i];
        scenarios.push(generateChaosFactorScenario(subject, context, factor, structureElements, timeHorizon));
    }
    // 3. Generate combined factors scenario (if multiple disruptive factors)
    if (disruptiveFactors.length >= 2) {
        scenarios.push(generateCombinedFactorsScenario(subject, context, disruptiveFactors, structureElements, timeHorizon));
    }
    // 4. Generate optimistic scenario
    scenarios.push(generateOptimisticScenario(subject, context, structureElements, timeHorizon));
    // 5. Normalize scenario probabilities to sum to 1.0
    var totalProbability = scenarios.reduce(function (sum, s) { return sum + s.probability; }, 0);
    scenarios.forEach(function (s) {
        s.probability = s.probability / totalProbability;
    });
    return scenarios;
}
/**
 * Generate baseline expected scenario
 */
function generateBaselineScenario(subject, context, structureElements, timeHorizon) {
    // Calculate average structure stability as baseline stability indicator
    var avgStability = structureElements.reduce(function (sum, element) { return sum + element.stability; }, 0) / Math.max(1, structureElements.length);
    // Higher stability increases baseline scenario probability
    var baselineProbability = 0.4 + (avgStability * 0.2);
    // Longer time horizons reduce baseline probability
    baselineProbability -= Math.min(0.2, timeHorizon * 0.01);
    // Generate outcomes based on objectives
    var outcomes = context.objectives.map(function (objective) {
        return "Achievement of \"".concat(objective, "\" within expected parameters");
    });
    // Generate strategic implications
    var strategicImplications = [
        "Reinforces current strategic direction",
        "Validates existing resource allocation approach",
        "Supports current stakeholder engagement model"
    ];
    // Add domain-specific implication
    strategicImplications.push("Maintains established position in ".concat(context.domain, " domain"));
    return {
        id: uuidv4(),
        name: "Expected Progression",
        probability: baselineProbability,
        description: "".concat(subject, " unfolds as anticipated, with expected challenges addressed through established mechanisms. Existing structures provide adequate support, and stakeholders respond in line with historical patterns."),
        outcomes: outcomes,
        strategicImplications: strategicImplications
    };
}
/**
 * Generate scenario driven by a specific chaos factor
 */
function generateChaosFactorScenario(subject, context, chaosFactor, structureElements, timeHorizon) {
    // Higher unpredictability and longer time horizons increase this scenario's probability
    var scenarioProbability = chaosFactor.unpredictability * 0.3;
    // Longer time horizons increase disruption probability
    scenarioProbability += Math.min(0.2, timeHorizon * 0.01);
    // Factor name drives scenario name
    var scenarioName = "".concat(chaosFactor.name, " Disruption");
    // Build description
    var description = "".concat(subject, " encounters significant challenges due to ").concat(chaosFactor.name.toLowerCase(), " becoming a dominant factor. Existing structures are tested, requiring adaptation and potentially new approaches to maintain progress toward objectives.");
    // Generate impacted outcomes
    var outcomes = [];
    // For each objective, consider how this factor affects it
    for (var _i = 0, _a = context.objectives; _i < _a.length; _i++) {
        var objective = _a[_i];
        if (Math.random() < 0.7) { // 70% chance of objective being impacted
            outcomes.push("".concat(objective, " achievement delayed or compromised due to ").concat(chaosFactor.name.toLowerCase(), " impact"));
        }
        else {
            outcomes.push("".concat(objective, " achievement maintained despite ").concat(chaosFactor.name.toLowerCase(), " challenges"));
        }
    }
    // Generate strategic implications based on factor and structures
    var strategicImplications = [];
    // Mitigation options become strategic implications
    if (chaosFactor.mitigationOptions.length > 0) {
        strategicImplications.push.apply(strategicImplications, chaosFactor.mitigationOptions.map(function (option) {
            return "Need to implement ".concat(option.toLowerCase(), " becomes critical");
        }));
    }
    // Structure adaptation implications
    var lowAdaptabilityStructures = structureElements
        .filter(function (element) { return element.adaptability < 0.5; })
        .slice(0, 2);
    if (lowAdaptabilityStructures.length > 0) {
        strategicImplications.push("".concat(lowAdaptabilityStructures.map(function (s) { return s.name; }).join(' and '), " require significant adaptation"));
    }
    return {
        id: uuidv4(),
        name: scenarioName,
        probability: scenarioProbability,
        description: description,
        outcomes: outcomes,
        strategicImplications: strategicImplications
    };
}
/**
 * Generate scenario driven by multiple chaos factors
 */
function generateCombinedFactorsScenario(subject, context, chaosFactors, structureElements, timeHorizon) {
    // Probability based on combined factors, but lower than sum of individual probabilities
    var combinedUnpredictability = chaosFactors.reduce(function (product, factor) { return product * factor.unpredictability; }, 1);
    var scenarioProbability = Math.sqrt(combinedUnpredictability) * 0.2;
    // Longer time horizons increase complexity scenario probability
    scenarioProbability += Math.min(0.1, timeHorizon * 0.005);
    // Factor names drive scenario name
    var factorNames = chaosFactors.map(function (f) { return f.name; });
    var scenarioName = "Compounding Complexity";
    // Build description
    var description = "".concat(subject, " faces a perfect storm scenario where ").concat(factorNames.join(' and '), " interact in complex ways, creating amplified challenges. Traditional approaches may prove insufficient, requiring innovative responses and potential recalibration of objectives.");
    // Generate severely impacted outcomes
    var outcomes = [];
    // For each objective, consider the compounding impact
    for (var _i = 0, _a = context.objectives; _i < _a.length; _i++) {
        var objective = _a[_i];
        if (Math.random() < 0.8) { // 80% chance of objective being severely impacted
            outcomes.push("".concat(objective, " significantly challenged by compounding factors"));
        }
        else {
            outcomes.push("".concat(objective, " maintained but requires resource reallocation"));
        }
    }
    // Generate strategic implications based on compounding factors
    var strategicImplications = [
        "Need for integrated rather than siloed response approaches",
        "Potential requirement for strategic pivot or reframing",
        "Critical test of organizational adaptability and resilience"
    ];
    // Add structure overhaul implication
    var criticalStructures = structureElements
        .filter(function (element) { return element.relevance > 0.7; })
        .slice(0, 2);
    if (criticalStructures.length > 0) {
        strategicImplications.push("Fundamental reassessment of ".concat(criticalStructures.map(function (s) { return s.name; }).join(' and '), " required"));
    }
    return {
        id: uuidv4(),
        name: scenarioName,
        probability: scenarioProbability,
        description: description,
        outcomes: outcomes,
        strategicImplications: strategicImplications
    };
}
/**
 * Generate optimistic breakthrough scenario
 */
function generateOptimisticScenario(subject, context, structureElements, timeHorizon) {
    // Calculate average structure adaptability as opportunity indicator
    var avgAdaptability = structureElements.reduce(function (sum, element) { return sum + element.adaptability; }, 0) / Math.max(1, structureElements.length);
    // Higher adaptability increases breakthrough scenario probability
    var breakthroughProbability = 0.1 + (avgAdaptability * 0.2);
    // Moderate time horizons (not too short, not too long) maximize breakthrough probability
    var timeHorizonFactor = Math.min(timeHorizon, 10) / 10; // 0-1 scale capped at 10 units
    breakthroughProbability += timeHorizonFactor * (1 - timeHorizonFactor) * 0.2; // Parabolic curve
    // Generate enhanced outcomes based on objectives
    var outcomes = context.objectives.map(function (objective) {
        return "".concat(objective, " exceeded, with additional unanticipated benefits");
    });
    // Add breakthrough outcome
    outcomes.push("Emergence of new opportunities beyond original scope");
    // Generate strategic implications
    var strategicImplications = [
        "Potential to establish leadership position in emerging area",
        "Opportunity to redefine success metrics and ambition level",
        "Case study for strategic agility and opportunity capitalization"
    ];
    // Add domain-specific implication
    strategicImplications.push("Position to influence future direction of ".concat(context.domain, " domain"));
    return {
        id: uuidv4(),
        name: "Breakthrough Emergence",
        probability: breakthroughProbability,
        description: "".concat(subject, " not only achieves expected outcomes but creates unexpected positive emergent properties. Stakeholders find alignment in previously unforeseen ways, and structural elements demonstrate exceptional synergy, opening new strategic horizons."),
        outcomes: outcomes,
        strategicImplications: strategicImplications
    };
}
/**
 * Generate decision pathways based on scenarios
 */
function generateDecisionPathways(subject, objectives, scenarios) {
    var pathways = [];
    // 1. Generate standard pathway (addressing most probable scenario)
    var mostProbableScenario = __spreadArray([], scenarios, true).sort(function (a, b) { return b.probability - a.probability; })[0];
    pathways.push({
        id: uuidv4(),
        description: "Optimize for \"".concat(mostProbableScenario.name, "\" scenario, focusing resources on highest probability outcome"),
        alignment: 0.8, // High alignment with objectives
        risk: 0.3, // Low risk (following most probable path)
        opportunity: 0.6 // Moderate opportunity (limited breakthrough potential)
    });
    // 2. Generate hedging pathway (balancing multiple scenarios)
    pathways.push({
        id: uuidv4(),
        description: "Balance preparation across multiple scenarios, maintaining flexibility to pivot as emergence becomes clearer",
        alignment: 0.7, // Good alignment with objectives
        risk: 0.5, // Moderate risk (potential resource dilution)
        opportunity: 0.7 // Good opportunity (prepared for different outcomes)
    });
    // 3. Generate opportunity-focused pathway (emphasizing highest impact positive scenario)
    var positiveScenarios = scenarios.filter(function (s) {
        return s.outcomes.some(function (o) { return o.includes("exceeded") || o.includes("beyond"); });
    });
    if (positiveScenarios.length > 0) {
        var topPositiveScenario = positiveScenarios[0];
        pathways.push({
            id: uuidv4(),
            description: "Optimize for upside potential in \"".concat(topPositiveScenario.name, "\" scenario, emphasizing breakthrough possibilities"),
            alignment: 0.6, // Moderate alignment with stated objectives
            risk: 0.8, // High risk (betting on lower probability outcome)
            opportunity: 0.9 // High opportunity (focused on breakthrough)
        });
    }
    // 4. Generate resilience-focused pathway (emphasizing protection against negative scenarios)
    var negativeScenarios = scenarios.filter(function (s) {
        return s.outcomes.some(function (o) { return o.includes("compromised") || o.includes("challenged"); });
    });
    if (negativeScenarios.length > 0) {
        var topNegativeScenario = negativeScenarios[0];
        pathways.push({
            id: uuidv4(),
            description: "Prioritize resilience against \"".concat(topNegativeScenario.name, "\" scenario, implementing robust mitigations"),
            alignment: 0.7, // Good alignment with objectives (protective)
            risk: 0.4, // Lower risk (protected downside)
            opportunity: 0.5 // Moderate opportunity (focus on protection vs upside)
        });
    }
    // 5. Generate objective-focused pathway (emphasizing core objectives regardless of scenario)
    pathways.push({
        id: uuidv4(),
        description: "Maintain strict focus on core objectives: ".concat(objectives.slice(0, 2).join(", ")).concat(objectives.length > 2 ? "..." : ""),
        alignment: 0.9, // Very high alignment with stated objectives
        risk: 0.6, // Moderate risk (potential inflexibility)
        opportunity: 0.6 // Moderate opportunity (focused but potentially missing emergence)
    });
    return pathways;
}
/**
 * Generate insights for Meta-Void Preview
 */
function generatePreviewInsights(subject, context, chaosFactors, scenarios, decisionPathways) {
    var insights = [];
    // Insight about probability distribution
    var concentratedProbability = scenarios.some(function (s) { return s.probability > 0.6; });
    if (concentratedProbability) {
        insights.push("Future probability is heavily concentrated in a single scenario, suggesting lower overall uncertainty despite specific chaos factors.");
    }
    else {
        insights.push("Future probability is distributed across multiple scenarios, indicating high situational uncertainty requiring flexible response capabilities.");
    }
    // Insight about highest impact chaos factors
    var highImpactFactors = chaosFactors
        .filter(function (f) { return f.potentialImpact >= 8; })
        .map(function (f) { return f.name; });
    if (highImpactFactors.length > 0) {
        insights.push("".concat(highImpactFactors.join(' and '), " represent critical uncertainties that could fundamentally reshape outcomes."));
    }
    // Insight about stakeholder dynamics
    if (context.stakeholders.length > 2) {
        insights.push("Complex stakeholder dynamics among ".concat(context.stakeholders.length, " key parties creates additional uncertainty not captured in individual chaos factors."));
    }
    // Insight about constraint impact
    if (context.constraints.length > 0) {
        insights.push("Existing constraints (".concat(context.constraints.map(function (c) { return "\"".concat(c, "\""); }).join(', '), ") may limit responsiveness to emerging scenarios."));
    }
    // Insight about pathway trade-offs
    var highAlignmentPathway = decisionPathways.find(function (p) { return p.alignment > 0.8; });
    var highOpportunityPathway = decisionPathways.find(function (p) { return p.opportunity > 0.8; });
    if (highAlignmentPathway && highOpportunityPathway && highAlignmentPathway.id !== highOpportunityPathway.id) {
        insights.push("Clear trade-off exists between highest alignment pathway and highest opportunity pathway, requiring explicit prioritization choice.");
    }
    return insights;
}
/**
 * Generate recommendations for Meta-Void Preview
 */
function generatePreviewRecommendations(chaosFactors, scenarios, decisionPathways, objectives) {
    var _a;
    var recommendations = [];
    // Recommendation based on highest impact chaos factor
    var topChaosFactor = __spreadArray([], chaosFactors, true).sort(function (a, b) { return b.potentialImpact - a.potentialImpact; })[0];
    if (topChaosFactor) {
        recommendations.push("Develop explicit mitigation strategies for ".concat(topChaosFactor.name, ", the highest impact uncertainty factor."));
    }
    // Recommendation based on probability distribution
    var probabilities = scenarios.map(function (s) { return s.probability; });
    var maxProbability = Math.max.apply(Math, probabilities);
    var minProbability = Math.min.apply(Math, probabilities);
    if (maxProbability - minProbability > 0.5) {
        // Wide probability spread
        recommendations.push("Focus resources on the ".concat((_a = scenarios.find(function (s) { return s.probability === maxProbability; })) === null || _a === void 0 ? void 0 : _a.name, " scenario while maintaining minimal viable preparation for others."));
    }
    else {
        // Narrow probability spread
        recommendations.push("Develop balanced preparation across multiple scenarios given their comparable probabilities.");
    }
    // Recommendation based on objective alignment
    recommendations.push("Ensure ongoing measurement of progress toward core objectives: ".concat(objectives.slice(0, 2).join(", ")).concat(objectives.length > 2 ? "..." : "", " with explicit trigger points for strategy adjustment."));
    // Recommendation based on optimal pathway
    var optimalPathway = __spreadArray([], decisionPathways, true).sort(function (a, b) {
        // Balance formula: (alignment * 0.4) + (opportunity * 0.4) + ((1 - risk) * 0.2)
        var scoreA = (a.alignment * 0.4) + (a.opportunity * 0.4) + ((1 - a.risk) * 0.2);
        var scoreB = (b.alignment * 0.4) + (b.opportunity * 0.4) + ((1 - b.risk) * 0.2);
        return scoreB - scoreA;
    })[0];
    if (optimalPathway) {
        recommendations.push("Consider adopting the balanced-optimal approach: \"".concat(optimalPathway.description, "\""));
    }
    // General recommendation for ongoing recalibration
    recommendations.push("Establish explicit points for Meta-Void Review to recalibrate preview assumptions based on emergent patterns.");
    return recommendations;
}
/**
 * Analyze actual outcomes relative to expected outcomes
 */
function analyzeActualOutcomes(actualOutcomes, expectedOutcomes) {
    return actualOutcomes.map(function (outcome) {
        // Determine valence if not specified
        var valence = outcome.valence || determineOutcomeValence(outcome.description);
        // Determine magnitude if not specified (1-10 scale)
        var magnitude = outcome.magnitude || determineOutcomeMagnitude(outcome.description, valence);
        // Calculate alignment with expected outcomes
        var alignment = calculateOutcomeAlignment(outcome.description, expectedOutcomes);
        return {
            description: outcome.description,
            valence: valence,
            magnitude: magnitude,
            alignment: alignment
        };
    });
}
/**
 * Determine valence of outcome based on description
 */
function determineOutcomeValence(description) {
    // Count positive and negative signal words
    var positiveSignals = [
        'success', 'improve', 'exceed', 'achieve', 'benefit',
        'gain', 'advantage', 'progress', 'growth', 'positive'
    ];
    var negativeSignals = [
        'fail', 'decline', 'below', 'miss', 'challenge',
        'problem', 'issue', 'negative', 'loss', 'decrease'
    ];
    var positiveCount = 0;
    var negativeCount = 0;
    var descriptionLower = description.toLowerCase();
    for (var _i = 0, positiveSignals_1 = positiveSignals; _i < positiveSignals_1.length; _i++) {
        var signal = positiveSignals_1[_i];
        if (descriptionLower.includes(signal)) {
            positiveCount++;
        }
    }
    for (var _a = 0, negativeSignals_1 = negativeSignals; _a < negativeSignals_1.length; _a++) {
        var signal = negativeSignals_1[_a];
        if (descriptionLower.includes(signal)) {
            negativeCount++;
        }
    }
    // Determine valence based on signal counts
    if (positiveCount > 0 && negativeCount > 0) {
        return 'mixed';
    }
    else if (positiveCount > 0) {
        return 'positive';
    }
    else if (negativeCount > 0) {
        return 'negative';
    }
    else {
        return 'neutral';
    }
}
/**
 * Determine magnitude of outcome based on description and valence
 */
function determineOutcomeMagnitude(description, valence) {
    // Default moderate magnitude
    var magnitude = 5;
    // Intensity signal words
    var highIntensitySignals = [
        'significant', 'dramatic', 'substantial', 'major', 'critical',
        'exceptional', 'extraordinary', 'remarkable', 'tremendous', 'extreme'
    ];
    var moderateIntensitySignals = [
        'moderate', 'modest', 'reasonable', 'adequate', 'fair',
        'partial', 'limited', 'some', 'certain', 'several'
    ];
    var lowIntensitySignals = [
        'minor', 'minimal', 'slight', 'small', 'marginal',
        'negligible', 'trivial', 'insignificant', 'inconsequential', 'little'
    ];
    var descriptionLower = description.toLowerCase();
    // Check for intensity signals
    for (var _i = 0, highIntensitySignals_1 = highIntensitySignals; _i < highIntensitySignals_1.length; _i++) {
        var signal = highIntensitySignals_1[_i];
        if (descriptionLower.includes(signal)) {
            magnitude += 3;
            break;
        }
    }
    for (var _a = 0, moderateIntensitySignals_1 = moderateIntensitySignals; _a < moderateIntensitySignals_1.length; _a++) {
        var signal = moderateIntensitySignals_1[_a];
        if (descriptionLower.includes(signal)) {
            magnitude += 0; // No change for moderate
            break;
        }
    }
    for (var _b = 0, lowIntensitySignals_1 = lowIntensitySignals; _b < lowIntensitySignals_1.length; _b++) {
        var signal = lowIntensitySignals_1[_b];
        if (descriptionLower.includes(signal)) {
            magnitude -= 3;
            break;
        }
    }
    // Adjust magnitude based on valence
    if (valence === 'mixed') {
        magnitude = 5; // Reset to moderate for mixed
    }
    else if (valence === 'neutral') {
        magnitude = 3; // Lower for neutral
    }
    // Ensure magnitude stays within 1-10 range
    return Math.max(1, Math.min(10, magnitude));
}
/**
 * Calculate alignment between actual outcome and expected outcomes
 */
function calculateOutcomeAlignment(actualOutcomeDescription, expectedOutcomes) {
    if (!expectedOutcomes || expectedOutcomes.length === 0) {
        return 0.5; // Default moderate alignment if no expected outcomes
    }
    // Calculate similarity scores with each expected outcome
    var similarityScores = expectedOutcomes.map(function (expected) {
        return calculateTextSimilarity(actualOutcomeDescription, expected);
    });
    // Use highest similarity as alignment score
    return Math.max.apply(Math, similarityScores);
}
/**
 * Calculate simple text similarity score
 */
function calculateTextSimilarity(text1, text2) {
    // Convert to lowercase for comparison
    var t1 = text1.toLowerCase();
    var t2 = text2.toLowerCase();
    // Split into words
    var words1 = t1.split(/\s+/);
    var words2 = t2.split(/\s+/);
    // Count matching words
    var matchCount = 0;
    for (var _i = 0, words1_1 = words1; _i < words1_1.length; _i++) {
        var word = words1_1[_i];
        if (word.length > 3 && words2.includes(word)) { // Only count substantial words
            matchCount++;
        }
    }
    // Calculate similarity as proportion of matching words
    var totalUniqueWords = new Set(__spreadArray(__spreadArray([], words1, true), words2, true)).size;
    return totalUniqueWords > 0 ? matchCount / totalUniqueWords : 0;
}
/**
 * Evaluate overall decision effectiveness
 */
function evaluateDecisionEffectiveness(originalDecision, actualOutcomes, objectives) {
    // Calculate overall effectiveness based on outcome alignment and valence
    var overallScore = 0;
    var totalWeight = 0;
    for (var _i = 0, actualOutcomes_1 = actualOutcomes; _i < actualOutcomes_1.length; _i++) {
        var outcome = actualOutcomes_1[_i];
        var outcomeValue = outcome.alignment;
        // Adjust for valence (positive outcomes contribute more to effectiveness)
        if (outcome.valence === 'positive') {
            outcomeValue *= 1.2;
        }
        else if (outcome.valence === 'negative') {
            outcomeValue *= 0.8;
        }
        // Weight by magnitude
        var weight = outcome.magnitude / 10;
        overallScore += outcomeValue * weight;
        totalWeight += weight;
    }
    // Normalize overall score
    var overall = totalWeight > 0 ? Math.min(1, overallScore / totalWeight) : 0.5;
    // Effectiveness by objective (simplified)
    var byObjective = {};
    var _loop_3 = function (objective) {
        // Find outcomes related to this objective
        var relatedOutcomes = actualOutcomes.filter(function (outcome) {
            return calculateTextSimilarity(outcome.description, objective) > 0.3;
        });
        if (relatedOutcomes.length > 0) {
            // Calculate average effectiveness for this objective
            var objectiveScore = relatedOutcomes.reduce(function (sum, outcome) { return sum + (outcome.alignment * (outcome.valence === 'positive' ? 1.2 :
                outcome.valence === 'negative' ? 0.8 : 1.0)); }, 0) / relatedOutcomes.length;
            byObjective[objective] = Math.min(1, objectiveScore);
        }
        else {
            byObjective[objective] = 0.5; // Default if no related outcomes
        }
    };
    for (var _a = 0, objectives_1 = objectives; _a < objectives_1.length; _a++) {
        var objective = objectives_1[_a];
        _loop_3(objective);
    }
    // Opportunity utilization (how well positive opportunities were leveraged)
    // Higher for positive outcomes with high magnitude and low expected alignment
    var opportunityScore = 0;
    var positiveOutcomes = actualOutcomes.filter(function (o) { return o.valence === 'positive'; });
    if (positiveOutcomes.length > 0) {
        opportunityScore = positiveOutcomes.reduce(function (sum, outcome) { return sum + (outcome.magnitude / 10) * (1 - outcome.alignment); }, 0) / positiveOutcomes.length;
        // Normalize opportunity score
        opportunityScore = Math.min(1, opportunityScore * 2);
    }
    else {
        opportunityScore = 0.3; // Low opportunity utilization if no positive outcomes
    }
    // Resource use efficiency (simplified)
    // Higher if more positive outcomes achieved than alternatives would likely provide
    var resourceUse = 0.7; // Default moderate efficiency
    return {
        overall: overall,
        byObjective: byObjective,
        opportunity: opportunityScore,
        resourceUse: resourceUse
    };
}
/**
 * Extract lessons learned from review
 */
function extractLessonsLearned(originalDecision, actualOutcomes, context) {
    var lessons = [];
    // 1. Lesson from expectations vs. reality gap
    var lowAlignmentOutcomes = actualOutcomes.filter(function (o) { return o.alignment < 0.5; });
    if (lowAlignmentOutcomes.length > 0) {
        var exampleOutcome = lowAlignmentOutcomes[0];
        lessons.push({
            insight: "Expectation-reality gap evident in \"".concat(exampleOutcome.description, "\" suggests need for improved forecasting models"),
            confidence: 0.7 + (lowAlignmentOutcomes.length * 0.05), // Higher confidence with more examples
            applicability: 'generalizable',
            actionableSteps: [
                "Implement pre-mortem analysis in planning process",
                "Establish wider range of scenario planning",
                "Create explicit assumption testing protocols"
            ]
        });
    }
    // 2. Lesson from assumption testing
    if (originalDecision.assumptions && originalDecision.assumptions.length > 0) {
        lessons.push({
            insight: "Critical assumptions about ".concat(originalDecision.assumptions[0], " required testing earlier in process"),
            confidence: 0.8,
            applicability: 'generalizable',
            actionableSteps: [
                "Create explicit assumption testing protocols",
                "Implement staged decision gates for assumption validation",
                "Develop key metrics for early detection of assumption failures"
            ]
        });
    }
    // 3. Lesson from unexpected positive outcomes
    var unexpectedPositives = actualOutcomes.filter(function (o) {
        return o.valence === 'positive' && o.alignment < 0.4;
    });
    if (unexpectedPositives.length > 0) {
        lessons.push({
            insight: "Unexpected positive outcomes reveal opportunity blind spots in planning process",
            confidence: 0.6 + (unexpectedPositives.length * 0.05),
            applicability: 'generalizable',
            actionableSteps: [
                "Implement opportunity scanning protocols",
                "Create explicit positive scenario exploration",
                "Develop flexibility mechanisms to capitalize on emergent opportunities"
            ]
        });
    }
    // 4. Lesson from constraint impact
    if (context.constraints && context.constraints.length > 0) {
        lessons.push({
            insight: "Impact of \"".concat(context.constraints[0], "\" constraint was greater than anticipated"),
            confidence: 0.7,
            applicability: 'specific',
            actionableSteps: [
                "Develop better constraint impact modeling",
                "Create earlier testing of constraint boundaries",
                "Implement constraint mitigation strategies earlier in process"
            ]
        });
    }
    // 5. Domain-specific lesson
    lessons.push({
        insight: "".concat(context.domain, " domain requires more specialized approach than was utilized"),
        confidence: 0.6,
        applicability: 'specific',
        actionableSteps: [
            "Engage deeper domain expertise in ".concat(context.domain),
            "Develop domain-specific decision frameworks",
            "Create knowledge repository of domain patterns"
        ]
    });
    return lessons;
}
/**
 * Identify systemic patterns from review
 */
function identifySystemicPatterns(actualOutcomes, observedPatterns) {
    var patterns = [];
    // 1. Add explicitly observed patterns
    for (var _i = 0, observedPatterns_1 = observedPatterns; _i < observedPatterns_1.length; _i++) {
        var pattern = observedPatterns_1[_i];
        patterns.push({
            pattern: pattern,
            frequency: 0.7, // Default high frequency for explicitly observed
            impact: 7, // Default high impact
            intervention: generateInterventionForPattern(pattern)
        });
    }
    // 2. Pattern from outcome alignment
    var alignmentScores = actualOutcomes.map(function (o) { return o.alignment; });
    var avgAlignment = alignmentScores.reduce(function (sum, score) { return sum + score; }, 0) / alignmentScores.length;
    if (avgAlignment < 0.5) {
        patterns.push({
            pattern: "Chronic expectation-reality gap in outcomes",
            frequency: 0.8,
            impact: 8,
            intervention: "Implement systematic expectation calibration process with explicit feedback loops"
        });
    }
    // 3. Pattern from outcome valence distribution
    var valences = actualOutcomes.map(function (o) { return o.valence; });
    var negativeCount = valences.filter(function (v) { return v === 'negative'; }).length;
    var positiveCount = valences.filter(function (v) { return v === 'positive'; }).length;
    if (negativeCount > positiveCount * 2) {
        patterns.push({
            pattern: "Negative outcome bias in decision processes",
            frequency: 0.7,
            impact: 7,
            intervention: "Restructure decision frameworks to better balance risk management with opportunity development"
        });
    }
    if (positiveCount > negativeCount * 2) {
        patterns.push({
            pattern: "Positive outcome reporting bias",
            frequency: 0.6,
            impact: 6,
            intervention: "Implement objective outcome classification system with third-party validation"
        });
    }
    // 4. Pattern from magnitude distribution
    var magnitudes = actualOutcomes.map(function (o) { return o.magnitude; });
    var highMagnitudeCount = magnitudes.filter(function (m) { return m >= 8; }).length;
    if (highMagnitudeCount > actualOutcomes.length / 3) {
        patterns.push({
            pattern: "High-volatility outcome distribution",
            frequency: 0.6,
            impact: 8,
            intervention: "Develop volatility management frameworks and stabilization mechanisms"
        });
    }
    return patterns;
}
/**
 * Generate intervention for pattern
 */
function generateInterventionForPattern(pattern) {
    // Common pattern interventions
    if (pattern.toLowerCase().includes('communication')) {
        return "Implement structured communication protocols with explicit feedback verification";
    }
    if (pattern.toLowerCase().includes('delay') || pattern.toLowerCase().includes('time')) {
        return "Develop timeline buffers and milestone-based early warning system";
    }
    if (pattern.toLowerCase().includes('resource') || pattern.toLowerCase().includes('capacity')) {
        return "Create capacity forecasting model with dynamic resource allocation system";
    }
    if (pattern.toLowerCase().includes('quality') || pattern.toLowerCase().includes('standard')) {
        return "Implement quality management system with explicit acceptance criteria";
    }
    if (pattern.toLowerCase().includes('stakeholder') || pattern.toLowerCase().includes('alignment')) {
        return "Develop stakeholder alignment framework with explicit interest mapping";
    }
    // Default generic intervention
    return "Establish pattern recognition protocol to identify and address recurring system behavior";
}
/**
 * Generate recalibration guidance
 */
function generateRecalibrationGuidance(lessonsLearned, systemicPatterns, decisionEffectiveness) {
    var mentalModels = [];
    var processAdjustments = [];
    var structuralChanges = [];
    // 1. Mental model adjustments from lessons and patterns
    // From high confidence lessons
    var highConfidenceLessons = lessonsLearned.filter(function (l) { return l.confidence > 0.7; });
    for (var _i = 0, highConfidenceLessons_1 = highConfidenceLessons; _i < highConfidenceLessons_1.length; _i++) {
        var lesson = highConfidenceLessons_1[_i];
        mentalModels.push("Recalibrate thinking: ".concat(lesson.insight));
    }
    // From high impact patterns
    var highImpactPatterns = systemicPatterns.filter(function (p) { return p.impact > 7; });
    for (var _a = 0, highImpactPatterns_1 = highImpactPatterns; _a < highImpactPatterns_1.length; _a++) {
        var pattern = highImpactPatterns_1[_a];
        mentalModels.push("Shift mental model to recognize \"".concat(pattern.pattern, "\" as systemic rather than situational"));
    }
    // 2. Process adjustments
    // From lessons
    for (var _b = 0, lessonsLearned_1 = lessonsLearned; _b < lessonsLearned_1.length; _b++) {
        var lesson = lessonsLearned_1[_b];
        if (lesson.actionableSteps.length > 0) {
            processAdjustments.push(lesson.actionableSteps[0]);
        }
    }
    // From effectiveness gaps
    if (decisionEffectiveness.opportunity < 0.5) {
        processAdjustments.push("Implement opportunity scanning processes in decision workflows");
    }
    if (decisionEffectiveness.resourceUse < 0.6) {
        processAdjustments.push("Develop resource optimization protocols with explicit efficiency metrics");
    }
    // From patterns
    for (var _c = 0, systemicPatterns_1 = systemicPatterns; _c < systemicPatterns_1.length; _c++) {
        var pattern = systemicPatterns_1[_c];
        processAdjustments.push(pattern.intervention);
    }
    // 3. Structural changes
    // Based on overall effectiveness
    if (decisionEffectiveness.overall < 0.6) {
        structuralChanges.push("Restructure decision authority framework to improve outcome alignment");
    }
    // Based on objective effectiveness
    var lowPerformingObjectives = Object.entries(decisionEffectiveness.byObjective)
        .filter(function (_a) {
        var _ = _a[0], score = _a[1];
        return score < 0.5;
    })
        .map(function (_a) {
        var objective = _a[0], _ = _a[1];
        return objective;
    });
    if (lowPerformingObjectives.length > 0) {
        structuralChanges.push("Redesign objective management approach for: ".concat(lowPerformingObjectives.join(', ')));
    }
    // Based on systemic patterns
    var criticalPatterns = systemicPatterns.filter(function (p) { return p.impact * p.frequency > 0.5; });
    if (criticalPatterns.length > 1) {
        structuralChanges.push("Implement pattern recognition and response system into organizational structure");
    }
    return {
        mentalModels: mentalModels,
        processAdjustments: processAdjustments,
        structuralChanges: structuralChanges
    };
}
/**
 * Generate insights for Meta-Void Review
 */
function generateReviewInsights(subject, originalDecision, actualOutcomes, lessonsLearned, systemicPatterns) {
    var insights = [];
    // Calculate key metrics for insights
    var avgAlignment = actualOutcomes.reduce(function (sum, o) { return sum + o.alignment; }, 0) / actualOutcomes.length;
    var positiveOutcomes = actualOutcomes.filter(function (o) { return o.valence === 'positive'; });
    var negativeOutcomes = actualOutcomes.filter(function (o) { return o.valence === 'negative'; });
    var positiveRatio = positiveOutcomes.length / actualOutcomes.length;
    // 1. Outcome alignment insight
    if (avgAlignment > 0.7) {
        insights.push("High outcome alignment (".concat((avgAlignment * 100).toFixed(0), "%) indicates effective prediction capacity despite complexity."));
    }
    else if (avgAlignment > 0.4) {
        insights.push("Moderate outcome alignment (".concat((avgAlignment * 100).toFixed(0), "%) suggests reasonable prediction capacity with specific blind spots."));
    }
    else {
        insights.push("Low outcome alignment (".concat((avgAlignment * 100).toFixed(0), "%) reveals significant expectation-reality gaps requiring fundamental recalibration."));
    }
    // 2. Outcome valence insight
    if (positiveRatio > 0.7) {
        insights.push("Strong positive outcome bias (".concat((positiveRatio * 100).toFixed(0), "%) suggests either exceptional execution or evaluation criteria issues."));
    }
    else if (positiveRatio < 0.3) {
        insights.push("Negative outcome dominance (".concat(((1 - positiveRatio) * 100).toFixed(0), "%) indicates execution challenges or overly optimistic initial expectations."));
    }
    else {
        insights.push("Balanced outcome distribution suggests realistic assessment approach capturing both successes and challenges.");
    }
    // 3. Systemic pattern insight
    if (systemicPatterns.length > 2) {
        insights.push("Multiple systemic patterns (".concat(systemicPatterns.length, ") identified, suggesting opportunity for structural rather than incremental improvement."));
    }
    // 4. Lesson applicability insight
    var generalizableLessons = lessonsLearned.filter(function (l) { return l.applicability === 'generalizable' || l.applicability === 'universal'; });
    if (generalizableLessons.length > 0) {
        insights.push("".concat(generalizableLessons.length, " generalizable lessons identified, creating potential value beyond this specific decision context."));
    }
    // 5. Assumption insight
    if (originalDecision.assumptions && originalDecision.assumptions.length > 0) {
        insights.push("Key assumptions about ".concat(originalDecision.assumptions[0], " influenced outcome trajectory, demonstrating the critical role of assumption validation."));
    }
    return insights;
}
/**
 * Generate recommendations for Meta-Void Review
 */
function generateReviewRecommendations(decisionEffectiveness, lessonsLearned, recalibrationGuidance) {
    var recommendations = [];
    // 1. Effectiveness-based recommendation
    if (decisionEffectiveness.overall < 0.5) {
        recommendations.push("Conduct comprehensive decision process review to address significant effectiveness gap (".concat((decisionEffectiveness.overall * 100).toFixed(0), "%)."));
    }
    else if (decisionEffectiveness.overall < 0.7) {
        recommendations.push("Implement targeted improvements to decision process to increase overall effectiveness (currently ".concat((decisionEffectiveness.overall * 100).toFixed(0), "%)."));
    }
    else {
        recommendations.push("Document successful decision patterns to replicate high effectiveness (".concat((decisionEffectiveness.overall * 100).toFixed(0), "%) in future scenarios."));
    }
    // 2. Opportunity-based recommendation
    if (decisionEffectiveness.opportunity < 0.4) {
        recommendations.push("Develop opportunity identification capability to address low opportunity utilization (".concat((decisionEffectiveness.opportunity * 100).toFixed(0), "%)."));
    }
    // 3. Resource-based recommendation
    if (decisionEffectiveness.resourceUse < 0.6) {
        recommendations.push("Optimize resource allocation processes to improve efficiency (currently ".concat((decisionEffectiveness.resourceUse * 100).toFixed(0), "%)."));
    }
    // 4. Lesson-based recommendations
    var highConfidenceLessons = lessonsLearned
        .filter(function (l) { return l.confidence > 0.7; })
        .sort(function (a, b) { return b.confidence - a.confidence; });
    if (highConfidenceLessons.length > 0) {
        // Add actionable steps from highest confidence lesson
        var topLesson = highConfidenceLessons[0];
        if (topLesson.actionableSteps.length > 0) {
            recommendations.push("Implement key lesson: ".concat(topLesson.actionableSteps[0]));
        }
    }
    // 5. Structure-based recommendation
    if (recalibrationGuidance.structuralChanges.length > 0) {
        recommendations.push(recalibrationGuidance.structuralChanges[0]);
    }
    // 6. Process-based recommendation
    if (recalibrationGuidance.processAdjustments.length > 0) {
        recommendations.push(recalibrationGuidance.processAdjustments[0]);
    }
    // 7. Meta-review recommendation
    recommendations.push("Establish Meta-Void Review as standard practice for all significant decisions to enable continuous learning.");
    return recommendations;
}
