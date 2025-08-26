/**
 * Meta-Synthesis Modular Formula (MSMF) Implementation
 *
 * Implementation of:
 * [Macro-Context] + [Micro-Detail] + [Root cause identification] + [Void (unseen variables)] = MSMF
 *
 * This module provides a comprehensive implementation of the MSMF framework, which
 * enables effective integration of macro and micro perspectives to identify root causes
 * and account for unseen variables (void analysis).
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
 * Macro-context level
 */
export var MacroLevel;
(function (MacroLevel) {
    MacroLevel["SYSTEM"] = "system";
    MacroLevel["ECOSYSTEM"] = "ecosystem";
    MacroLevel["DOMAIN"] = "domain";
    MacroLevel["ORGANIZATIONAL"] = "organizational";
    MacroLevel["PROJECT"] = "project"; // Project-level considerations
})(MacroLevel || (MacroLevel = {}));
/**
 * Micro-detail scope
 */
export var MicroScope;
(function (MicroScope) {
    MicroScope["COMPONENT"] = "component";
    MicroScope["INTERACTION"] = "interaction";
    MicroScope["PERFORMANCE"] = "performance";
    MicroScope["RESOURCE"] = "resource";
    MicroScope["PROCESS"] = "process"; // Process execution details
})(MicroScope || (MicroScope = {}));
/**
 * Root cause category
 */
export var RootCauseCategory;
(function (RootCauseCategory) {
    RootCauseCategory["STRUCTURAL"] = "structural";
    RootCauseCategory["PROCEDURAL"] = "procedural";
    RootCauseCategory["TECHNICAL"] = "technical";
    RootCauseCategory["INFORMATIONAL"] = "informational";
    RootCauseCategory["HUMAN"] = "human";
    RootCauseCategory["ENVIRONMENTAL"] = "environmental"; // External or environmental factors
})(RootCauseCategory || (RootCauseCategory = {}));
/**
 * Void (unseen variables) confidence level
 */
export var VoidConfidenceLevel;
(function (VoidConfidenceLevel) {
    VoidConfidenceLevel["HYPOTHETICAL"] = "hypothetical";
    VoidConfidenceLevel["INFERRED"] = "inferred";
    VoidConfidenceLevel["PARTIAL"] = "partial";
    VoidConfidenceLevel["CONFIRMED"] = "confirmed"; // Confirmed but previously unseen
})(VoidConfidenceLevel || (VoidConfidenceLevel = {}));
/**
 * Analyze macro-context elements
 *
 * Part of the MSMF [Macro-Context] component.
 *
 * @param subject Subject being analyzed
 * @param data Contextual data for analysis
 * @param options Analysis options
 * @returns Array of macro-context elements
 */
export function analyzeMacroContext(subject, data, options) {
    // Default options
    var opts = __assign({ primaryLevel: MacroLevel.SYSTEM, includeLevels: Object.values(MacroLevel), minCertainty: 0.4 }, options);
    var macroElements = [];
    // System-level analysis
    if (opts.includeLevels.includes(MacroLevel.SYSTEM)) {
        var systemFactors = analyzeSystemFactors(subject, data);
        if (systemFactors.factors.length > 0) {
            macroElements.push({
                id: uuidv4(),
                level: MacroLevel.SYSTEM,
                name: "".concat(subject, " System Analysis"),
                description: "Systematic analysis of ".concat(subject, " as a holistic system"),
                factors: systemFactors.factors.filter(function (f) { return f.certainty >= opts.minCertainty; }),
                knownPatterns: data.knownPatterns || [],
                metrics: data.metrics,
            });
        }
    }
    // Ecosystem-level analysis
    if (opts.includeLevels.includes(MacroLevel.ECOSYSTEM)) {
        var ecosystemFactors = analyzeEcosystemFactors(data.environmentalFactors);
        if (ecosystemFactors.factors.length > 0) {
            macroElements.push({
                id: uuidv4(),
                level: MacroLevel.ECOSYSTEM,
                name: "".concat(subject, " Ecosystem Forces"),
                description: "External ecosystem factors affecting ".concat(subject),
                factors: ecosystemFactors.factors.filter(function (f) { return f.certainty >= opts.minCertainty; }),
                knownPatterns: ecosystemFactors.patterns,
            });
        }
    }
    // Domain-level analysis
    if (opts.includeLevels.includes(MacroLevel.DOMAIN) && data.domainSpecifics) {
        var domainFactors = analyzeDomainFactors(data.domainSpecifics, subject);
        if (domainFactors.factors.length > 0) {
            macroElements.push({
                id: uuidv4(),
                level: MacroLevel.DOMAIN,
                name: "".concat(subject, " Domain Context"),
                description: "Domain-specific context for ".concat(subject),
                factors: domainFactors.factors.filter(function (f) { return f.certainty >= opts.minCertainty; }),
                knownPatterns: domainFactors.patterns,
            });
        }
    }
    // Organizational-level analysis
    if (opts.includeLevels.includes(MacroLevel.ORGANIZATIONAL) && data.organizationalContext) {
        var orgFactors = analyzeOrganizationalFactors(data.organizationalContext);
        if (orgFactors.factors.length > 0) {
            macroElements.push({
                id: uuidv4(),
                level: MacroLevel.ORGANIZATIONAL,
                name: "".concat(subject, " Organizational Context"),
                description: "Organizational factors affecting ".concat(subject),
                factors: orgFactors.factors.filter(function (f) { return f.certainty >= opts.minCertainty; }),
                knownPatterns: orgFactors.patterns,
            });
        }
    }
    // Project-level analysis
    if (opts.includeLevels.includes(MacroLevel.PROJECT)) {
        var projectFactors = extractProjectFactors(data, subject);
        if (projectFactors.factors.length > 0) {
            macroElements.push({
                id: uuidv4(),
                level: MacroLevel.PROJECT,
                name: "".concat(subject, " Project Parameters"),
                description: "Project-specific parameters for ".concat(subject),
                factors: projectFactors.factors.filter(function (f) { return f.certainty >= opts.minCertainty; }),
                knownPatterns: projectFactors.patterns,
            });
        }
    }
    return macroElements;
}
/**
 * Analyze micro-detail elements
 *
 * Part of the MSMF [Micro-Detail] component.
 *
 * @param subject Subject being analyzed
 * @param data Detailed data for analysis
 * @param options Analysis options
 * @returns Array of micro-detail elements
 */
export function analyzeMicroDetails(subject, data, options) {
    // Default options
    var opts = __assign({ primaryScope: MicroScope.PERFORMANCE, includeScopes: Object.values(MicroScope), minReliability: 0.6, anomalyThreshold: 2.0 }, options);
    var microElements = [];
    // Component-level analysis
    if (opts.includeScopes.includes(MicroScope.COMPONENT) && data.componentData) {
        var componentDetails = analyzeComponentDetails(data.componentData, opts.anomalyThreshold);
        if (componentDetails.metrics.length > 0) {
            microElements.push({
                id: uuidv4(),
                scope: MicroScope.COMPONENT,
                name: "".concat(subject, " Component Analysis"),
                description: "Detailed analysis of individual components within ".concat(subject),
                data: componentDetails.metrics.filter(function (m) { return m.reliability >= opts.minReliability; }),
                anomalies: componentDetails.anomalies,
            });
        }
    }
    // Interaction-level analysis
    if (opts.includeScopes.includes(MicroScope.INTERACTION) && data.interactionData) {
        var interactionDetails = analyzeInteractionDetails(data.interactionData, opts.anomalyThreshold);
        if (interactionDetails.metrics.length > 0) {
            microElements.push({
                id: uuidv4(),
                scope: MicroScope.INTERACTION,
                name: "".concat(subject, " Interaction Analysis"),
                description: "Detailed analysis of interactions within ".concat(subject),
                data: interactionDetails.metrics.filter(function (m) { return m.reliability >= opts.minReliability; }),
                anomalies: interactionDetails.anomalies,
            });
        }
    }
    // Performance-level analysis
    if (opts.includeScopes.includes(MicroScope.PERFORMANCE) && data.performanceMetrics) {
        var performanceDetails = analyzePerformanceDetails(data.performanceMetrics, opts.anomalyThreshold);
        if (performanceDetails.metrics.length > 0) {
            microElements.push({
                id: uuidv4(),
                scope: MicroScope.PERFORMANCE,
                name: "".concat(subject, " Performance Analysis"),
                description: "Detailed performance metrics for ".concat(subject),
                data: performanceDetails.metrics.filter(function (m) { return m.reliability >= opts.minReliability; }),
                anomalies: performanceDetails.anomalies,
            });
        }
    }
    // Resource-level analysis
    if (opts.includeScopes.includes(MicroScope.RESOURCE) && data.resourceUtilization) {
        var resourceDetails = analyzeResourceDetails(data.resourceUtilization, opts.anomalyThreshold);
        if (resourceDetails.metrics.length > 0) {
            microElements.push({
                id: uuidv4(),
                scope: MicroScope.RESOURCE,
                name: "".concat(subject, " Resource Utilization"),
                description: "Detailed resource utilization metrics for ".concat(subject),
                data: resourceDetails.metrics.filter(function (m) { return m.reliability >= opts.minReliability; }),
                anomalies: resourceDetails.anomalies,
            });
        }
    }
    // Process-level analysis
    if (opts.includeScopes.includes(MicroScope.PROCESS) && data.processExecutionData) {
        var processDetails = analyzeProcessDetails(data.processExecutionData, opts.anomalyThreshold);
        if (processDetails.metrics.length > 0) {
            microElements.push({
                id: uuidv4(),
                scope: MicroScope.PROCESS,
                name: "".concat(subject, " Process Execution"),
                description: "Detailed process execution metrics for ".concat(subject),
                data: processDetails.metrics.filter(function (m) { return m.reliability >= opts.minReliability; }),
                anomalies: processDetails.anomalies,
            });
        }
    }
    return microElements;
}
/**
 * Identify root causes
 *
 * Part of the MSMF [Root cause identification] component.
 *
 * @param macroElements Macro-context elements
 * @param microElements Micro-detail elements
 * @param options Analysis options
 * @returns Array of root cause elements
 */
export function identifyRootCauses(macroElements, microElements, options) {
    // Default options
    var opts = __assign({ minConfidence: 0.6, minImpact: 5, prioritizeCategories: Object.values(RootCauseCategory), externalKnowledge: {} }, options);
    // Collect all anomalies from micro elements
    var allAnomalies = microElements.flatMap(function (element) {
        return element.anomalies.map(function (anomaly) { return ({
            anomaly: anomaly,
            sourceElement: element
        }); });
    });
    // Collect all negative factors from macro elements
    var allNegativeFactors = macroElements.flatMap(function (element) {
        return element.factors
            .filter(function (factor) { return factor.directionality === 'negative' && factor.impact >= opts.minImpact; })
            .map(function (factor) { return ({
            factor: factor,
            sourceElement: element
        }); });
    });
    // Initialize root causes array
    var rootCauses = [];
    // Identify structural root causes
    if (opts.prioritizeCategories.includes(RootCauseCategory.STRUCTURAL)) {
        var structuralCauses = identifyStructuralCauses(macroElements, microElements, allAnomalies, allNegativeFactors);
        rootCauses.push.apply(rootCauses, structuralCauses.filter(function (cause) {
            return cause.confidence >= opts.minConfidence && cause.impact >= opts.minImpact;
        }));
    }
    // Identify procedural root causes
    if (opts.prioritizeCategories.includes(RootCauseCategory.PROCEDURAL)) {
        var proceduralCauses = identifyProceduralCauses(macroElements, microElements, allAnomalies, allNegativeFactors);
        rootCauses.push.apply(rootCauses, proceduralCauses.filter(function (cause) {
            return cause.confidence >= opts.minConfidence && cause.impact >= opts.minImpact;
        }));
    }
    // Identify technical root causes
    if (opts.prioritizeCategories.includes(RootCauseCategory.TECHNICAL)) {
        var technicalCauses = identifyTechnicalCauses(macroElements, microElements, allAnomalies, allNegativeFactors);
        rootCauses.push.apply(rootCauses, technicalCauses.filter(function (cause) {
            return cause.confidence >= opts.minConfidence && cause.impact >= opts.minImpact;
        }));
    }
    // Identify informational root causes
    if (opts.prioritizeCategories.includes(RootCauseCategory.INFORMATIONAL)) {
        var informationalCauses = identifyInformationalCauses(macroElements, microElements, allAnomalies, allNegativeFactors);
        rootCauses.push.apply(rootCauses, informationalCauses.filter(function (cause) {
            return cause.confidence >= opts.minConfidence && cause.impact >= opts.minImpact;
        }));
    }
    // Identify human root causes
    if (opts.prioritizeCategories.includes(RootCauseCategory.HUMAN)) {
        var humanCauses = identifyHumanCauses(macroElements, microElements, allAnomalies, allNegativeFactors, opts.externalKnowledge);
        rootCauses.push.apply(rootCauses, humanCauses.filter(function (cause) {
            return cause.confidence >= opts.minConfidence && cause.impact >= opts.minImpact;
        }));
    }
    // Identify environmental root causes
    if (opts.prioritizeCategories.includes(RootCauseCategory.ENVIRONMENTAL)) {
        var environmentalCauses = identifyEnvironmentalCauses(macroElements, microElements, allAnomalies, allNegativeFactors);
        rootCauses.push.apply(rootCauses, environmentalCauses.filter(function (cause) {
            return cause.confidence >= opts.minConfidence && cause.impact >= opts.minImpact;
        }));
    }
    return rootCauses;
}
/**
 * Analyze void (unseen variables)
 *
 * Part of the MSMF [Void (unseen variables)] component.
 *
 * @param macroElements Macro-context elements
 * @param microElements Micro-detail elements
 * @param rootCauses Identified root causes
 * @param options Analysis options
 * @returns Array of void elements
 */
export function analyzeVoid(macroElements, microElements, rootCauses, options) {
    // Default options
    var opts = __assign({ minPotentialImpact: 5, maxUnknownDegree: 0.8, confidenceLevels: [
            VoidConfidenceLevel.INFERRED,
            VoidConfidenceLevel.PARTIAL,
            VoidConfidenceLevel.CONFIRMED
        ] }, options);
    // Identify potential void elements using several methods
    var voidElements = [];
    // Method 1: Identify gaps in causal chains
    var causalGaps = identifyCausalGaps(macroElements, microElements, rootCauses);
    voidElements.push.apply(voidElements, causalGaps.filter(function (element) {
        return element.potentialImpact >= opts.minPotentialImpact &&
            element.unknownDegree <= opts.maxUnknownDegree &&
            opts.confidenceLevels.includes(element.confidenceLevel);
    }));
    // Method 2: Identify unexplained variance
    var unexplainedVariance = identifyUnexplainedVariance(microElements, rootCauses);
    voidElements.push.apply(voidElements, unexplainedVariance.filter(function (element) {
        return element.potentialImpact >= opts.minPotentialImpact &&
            element.unknownDegree <= opts.maxUnknownDegree &&
            opts.confidenceLevels.includes(element.confidenceLevel);
    }));
    // Method 3: Identify potential hidden dependencies
    var hiddenDependencies = identifyHiddenDependencies(macroElements, microElements);
    voidElements.push.apply(voidElements, hiddenDependencies.filter(function (element) {
        return element.potentialImpact >= opts.minPotentialImpact &&
            element.unknownDegree <= opts.maxUnknownDegree &&
            opts.confidenceLevels.includes(element.confidenceLevel);
    }));
    // Remove duplicates (similar void elements)
    var uniqueVoidElements = removeDuplicateVoidElements(voidElements);
    return uniqueVoidElements;
}
/**
 * Apply the complete Meta-Synthesis Modular Formula process
 *
 * [Macro-Context] + [Micro-Detail] + [Root cause identification] + [Void (unseen variables)] = MSMF
 *
 * @param subject Subject to analyze
 * @param data Analysis data
 * @param options Analysis options
 * @returns MSMF analysis result
 */
export function applyMSMF(subject, data, options) {
    // Default options
    var opts = __assign({ macroLevels: Object.values(MacroLevel), microScopes: Object.values(MicroScope), rootCauseCategories: Object.values(RootCauseCategory), minRootCauseConfidence: 0.6, minRootCauseImpact: 5, includeVoidAnalysis: true }, options);
    // Step 1: Analyze macro-context
    var macroElements = analyzeMacroContext(subject, {
        systemDescription: data.systemDescription,
        knownPatterns: data.knownPatterns,
        environmentalFactors: data.environmentalFactors,
        organizationalContext: data.organizationalContext,
        domainSpecifics: data.domainSpecifics,
        metrics: data.systemMetrics
    }, {
        includeLevels: opts.macroLevels
    });
    // Step 2: Analyze micro-details
    var microElements = analyzeMicroDetails(subject, {
        componentData: data.componentData,
        interactionData: data.interactionData,
        performanceMetrics: data.performanceMetrics,
        resourceUtilization: data.resourceUtilization,
        processExecutionData: data.processExecutionData
    }, {
        includeScopes: opts.microScopes
    });
    // Step 3: Identify root causes
    var rootCauses = identifyRootCauses(macroElements, microElements, {
        minConfidence: opts.minRootCauseConfidence,
        minImpact: opts.minRootCauseImpact,
        prioritizeCategories: opts.rootCauseCategories,
        externalKnowledge: data.externalKnowledge
    });
    // Step 4: Analyze void (unseen variables) if enabled
    var voidElements = opts.includeVoidAnalysis
        ? analyzeVoid(macroElements, microElements, rootCauses)
        : [];
    // Step 5: Synthesize findings
    var synthesis = synthesizeFindings(macroElements, microElements, rootCauses, voidElements);
    // Step 6: Generate recommendations
    var recommendations = generateRecommendations(rootCauses, voidElements, synthesis);
    // Return the complete MSMF result
    return {
        id: uuidv4(),
        timestamp: new Date(),
        subject: subject,
        macroContext: macroElements,
        microDetails: microElements,
        rootCauses: rootCauses,
        voidElements: voidElements,
        synthesis: synthesis,
        recommendations: recommendations
    };
}
/**
 * Synthesize findings into a coherent understanding
 */
function synthesizeFindings(macroElements, microElements, rootCauses, voidElements) {
    // Find primary root cause (highest impact * confidence)
    var primaryRootCause = undefined;
    var highestScore = 0;
    for (var _i = 0, rootCauses_1 = rootCauses; _i < rootCauses_1.length; _i++) {
        var cause = rootCauses_1[_i];
        var score = cause.impact * cause.confidence;
        if (score > highestScore) {
            highestScore = score;
            primaryRootCause = cause;
        }
    }
    // Identify contributing factors from all elements
    var contributingFactors = [];
    // From macro context
    for (var _a = 0, macroElements_1 = macroElements; _a < macroElements_1.length; _a++) {
        var element = macroElements_1[_a];
        for (var _b = 0, _c = element.factors; _b < _c.length; _b++) {
            var factor = _c[_b];
            if (factor.directionality === 'negative' && factor.impact >= 5) {
                contributingFactors.push({
                    description: "".concat(factor.name, " (").concat(element.level, ")"),
                    sourceType: 'macro',
                    sourceId: element.id,
                    impact: factor.impact
                });
            }
        }
    }
    // From micro details
    for (var _d = 0, microElements_1 = microElements; _d < microElements_1.length; _d++) {
        var element = microElements_1[_d];
        for (var _e = 0, _f = element.anomalies; _e < _f.length; _e++) {
            var anomaly = _f[_e];
            if (anomaly.severity >= 5) {
                contributingFactors.push({
                    description: "".concat(anomaly.description, " (").concat(element.scope, ")"),
                    sourceType: 'micro',
                    sourceId: element.id,
                    impact: anomaly.severity
                });
            }
        }
    }
    // From void elements
    for (var _g = 0, voidElements_1 = voidElements; _g < voidElements_1.length; _g++) {
        var element = voidElements_1[_g];
        if (element.potentialImpact >= 5) {
            contributingFactors.push({
                description: "".concat(element.name, " (").concat(element.confidenceLevel, ")"),
                sourceType: 'void',
                sourceId: element.id,
                impact: element.potentialImpact
            });
        }
    }
    // Sort by impact descending
    contributingFactors.sort(function (a, b) { return b.impact - a.impact; });
    // Generate key insights
    var keyInsights = generateKeyInsights(macroElements, microElements, rootCauses, voidElements, primaryRootCause);
    // Calculate confidence level
    var confidenceLevel = calculateConfidenceLevel(rootCauses, voidElements);
    // Calculate stability score
    var stabilityScore = calculateStabilityScore(macroElements, voidElements, contributingFactors);
    return {
        primaryRootCause: primaryRootCause,
        contributingFactors: contributingFactors,
        keyInsights: keyInsights,
        confidenceLevel: confidenceLevel,
        stabilityScore: stabilityScore
    };
}
/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(rootCauses, voidElements, synthesis) {
    var recommendations = [];
    // For each root cause, create at least one recommendation
    for (var _i = 0, rootCauses_2 = rootCauses; _i < rootCauses_2.length; _i++) {
        var cause = rootCauses_2[_i];
        // Skip low-impact causes
        if (cause.impact < 5)
            continue;
        // Use any resolution approaches already identified
        if (cause.resolutionApproaches && cause.resolutionApproaches.length > 0) {
            for (var _a = 0, _b = cause.resolutionApproaches; _a < _b.length; _a++) {
                var approach = _b[_a];
                recommendations.push({
                    description: approach,
                    addressedCauseIds: [cause.id],
                    implementationComplexity: calculateImplementationComplexity(approach, cause),
                    expectedImpact: Math.round(cause.impact * cause.confidence),
                    timeframe: determineTimeframe(approach, cause)
                });
            }
        }
        else {
            // Generate a generic recommendation
            recommendations.push({
                description: "Address ".concat(cause.name, " through ").concat(cause.category, " improvements"),
                addressedCauseIds: [cause.id],
                implementationComplexity: 5, // Medium complexity
                expectedImpact: Math.round(cause.impact * cause.confidence),
                timeframe: 'medium-term'
            });
        }
    }
    // For void elements with high potential impact, add monitoring recommendations
    for (var _c = 0, voidElements_2 = voidElements; _c < voidElements_2.length; _c++) {
        var element = voidElements_2[_c];
        if (element.potentialImpact >= 7) {
            recommendations.push({
                description: "Establish monitoring for potential ".concat(element.name),
                addressedCauseIds: [],
                implementationComplexity: 4,
                expectedImpact: Math.round(element.potentialImpact * (1 - element.unknownDegree)),
                timeframe: 'short-term'
            });
        }
    }
    // If a primary root cause exists, add a focused recommendation
    if (synthesis.primaryRootCause) {
        var cause = synthesis.primaryRootCause;
        recommendations.push({
            description: "Prioritize resolution of ".concat(cause.name, " as the primary root cause"),
            addressedCauseIds: [cause.id],
            implementationComplexity: 7, // Likely complex due to being primary
            expectedImpact: Math.round(cause.impact * 1.2), // Higher impact due to being primary
            timeframe: 'immediate'
        });
    }
    // Sort by expected impact descending
    recommendations.sort(function (a, b) { return b.expectedImpact - a.expectedImpact; });
    return recommendations;
}
/**
 * Helper function to calculate implementation complexity
 */
function calculateImplementationComplexity(approach, cause) {
    // Simple heuristic
    var complexity = 5; // Start at medium
    // Adjust based on category
    switch (cause.category) {
        case RootCauseCategory.STRUCTURAL:
            complexity += 2; // Structural changes are complex
            break;
        case RootCauseCategory.TECHNICAL:
            complexity += 1; // Technical changes are somewhat complex
            break;
        case RootCauseCategory.PROCEDURAL:
            complexity -= 1; // Procedural changes can be easier
            break;
    }
    // Adjust based on impact (higher impact issues are often more complex)
    complexity += Math.floor((cause.impact - 5) / 2);
    // Adjust based on keywords in approach
    if (approach.toLowerCase().includes('redesign') ||
        approach.toLowerCase().includes('rebuild')) {
        complexity += 2;
    }
    if (approach.toLowerCase().includes('adjust') ||
        approach.toLowerCase().includes('tune')) {
        complexity -= 1;
    }
    // Ensure within 1-10 range
    return Math.max(1, Math.min(10, complexity));
}
/**
 * Helper function to determine recommendation timeframe
 */
function determineTimeframe(approach, cause) {
    // High impact, high confidence causes should be addressed quickly
    if (cause.impact >= 8 && cause.confidence >= 0.8) {
        return 'immediate';
    }
    // Structural changes often take longer
    if (cause.category === RootCauseCategory.STRUCTURAL) {
        return 'long-term';
    }
    // Keywords suggesting urgency
    if (approach.toLowerCase().includes('urgent') ||
        approach.toLowerCase().includes('critical') ||
        approach.toLowerCase().includes('immediate')) {
        return 'immediate';
    }
    // Default based on impact
    if (cause.impact >= 7) {
        return 'short-term';
    }
    else if (cause.impact >= 5) {
        return 'medium-term';
    }
    else {
        return 'long-term';
    }
}
/**
 * Generate key insights from the analysis
 */
function generateKeyInsights(macroElements, microElements, rootCauses, voidElements, primaryRootCause) {
    var insights = [];
    // Insight about primary root cause
    if (primaryRootCause) {
        insights.push("The primary root cause is ".concat(primaryRootCause.name, " (").concat(primaryRootCause.category, "), with impact rating ").concat(primaryRootCause.impact, "/10 and confidence level of ").concat(Math.round(primaryRootCause.confidence * 100), "%."));
    }
    // Insight about top contributing macro factors
    var topMacroFactors = macroElements
        .flatMap(function (element) { return element.factors
        .filter(function (factor) { return factor.directionality === 'negative'; })
        .map(function (factor) { return ({
        factor: factor,
        element: element
    }); }); })
        .sort(function (a, b) { return b.factor.impact - a.factor.impact; })
        .slice(0, 2);
    if (topMacroFactors.length > 0) {
        var factorsList = topMacroFactors
            .map(function (_a) {
            var factor = _a.factor, element = _a.element;
            return "".concat(factor.name, " (").concat(element.level, ", impact: ").concat(factor.impact, "/10)");
        })
            .join(' and ');
        insights.push("Key macro-level factors affecting the situation: ".concat(factorsList, "."));
    }
    // Insight about significant micro anomalies
    var significantAnomalies = microElements
        .flatMap(function (element) { return element.anomalies
        .filter(function (anomaly) { return anomaly.severity >= 7; })
        .map(function (anomaly) { return ({
        anomaly: anomaly,
        element: element
    }); }); })
        .sort(function (a, b) { return b.anomaly.severity - a.anomaly.severity; })
        .slice(0, 2);
    if (significantAnomalies.length > 0) {
        var anomaliesList = significantAnomalies
            .map(function (_a) {
            var anomaly = _a.anomaly, element = _a.element;
            return "".concat(anomaly.description, " (").concat(element.scope, ", severity: ").concat(anomaly.severity, "/10)");
        })
            .join(' and ');
        insights.push("Critical anomalies detected at micro level: ".concat(anomaliesList, "."));
    }
    // Insight about void elements
    if (voidElements.length > 0) {
        var highImpactVoids = voidElements
            .filter(function (element) { return element.potentialImpact >= 7; })
            .sort(function (a, b) { return b.potentialImpact - a.potentialImpact; });
        if (highImpactVoids.length > 0) {
            var voidsList = highImpactVoids
                .slice(0, 2)
                .map(function (element) { return "".concat(element.name, " (impact: ").concat(element.potentialImpact, "/10)"); })
                .join(' and ');
            insights.push("High-impact unseen variables that require attention: ".concat(voidsList, "."));
        }
    }
    // Insight about interplay between different levels
    if (rootCauses.length >= 2 &&
        rootCauses.some(function (cause) { return cause.category === RootCauseCategory.STRUCTURAL; }) &&
        rootCauses.some(function (cause) { return cause.category === RootCauseCategory.TECHNICAL; })) {
        insights.push("There is significant interplay between structural and technical issues, suggesting a systemic pattern rather than isolated problems.");
    }
    return insights;
}
/**
 * Calculate confidence level for the overall analysis
 */
function calculateConfidenceLevel(rootCauses, voidElements) {
    if (rootCauses.length === 0)
        return 0.3; // Low confidence if no root causes identified
    // Average confidence of root causes, weighted by impact
    var totalImpactWeight = rootCauses.reduce(function (sum, cause) { return sum + cause.impact; }, 0);
    var weightedConfidence = rootCauses.reduce(function (sum, cause) { return sum + (cause.impact * cause.confidence); }, 0);
    var confidenceLevel = totalImpactWeight > 0
        ? weightedConfidence / totalImpactWeight
        : 0.5;
    // Adjust based on void elements (more void elements with high impact reduce confidence)
    var highImpactVoids = voidElements.filter(function (element) { return element.potentialImpact >= 7; });
    var voidPenalty = highImpactVoids.length * 0.05;
    confidenceLevel = Math.max(0.1, confidenceLevel - voidPenalty);
    return confidenceLevel;
}
/**
 * Calculate stability score for the analysis
 */
function calculateStabilityScore(macroElements, voidElements, contributingFactors) {
    // Start with moderate stability
    var stabilityScore = 0.6;
    // More macro context elements increases stability (better understanding)
    stabilityScore += Math.min(0.1, macroElements.length * 0.02);
    // More void elements decreases stability (more unknowns)
    stabilityScore -= Math.min(0.2, voidElements.length * 0.03);
    // Higher impact contributing factors decrease stability
    var highImpactFactorCount = contributingFactors.filter(function (factor) { return factor.impact >= 8; }).length;
    stabilityScore -= Math.min(0.15, highImpactFactorCount * 0.03);
    // Ensure within 0-1 range
    return Math.max(0, Math.min(1, stabilityScore));
}
/**
 * Remove duplicate or highly similar void elements
 */
function removeDuplicateVoidElements(voidElements) {
    if (voidElements.length <= 1)
        return voidElements;
    var uniqueElements = [];
    var _loop_1 = function (element) {
        // Check if this element is similar to any already in the unique list
        var isSimilarToExisting = uniqueElements.some(function (unique) {
            // Similar name
            var nameSimilarity = stringSimilarity(element.name.toLowerCase(), unique.name.toLowerCase());
            // Similar description
            var descSimilarity = stringSimilarity(element.description.toLowerCase(), unique.description.toLowerCase());
            // Consider similar if both name and description are similar
            return nameSimilarity > 0.7 && descSimilarity > 0.6;
        });
        if (!isSimilarToExisting) {
            uniqueElements.push(element);
        }
    };
    for (var _i = 0, voidElements_3 = voidElements; _i < voidElements_3.length; _i++) {
        var element = voidElements_3[_i];
        _loop_1(element);
    }
    return uniqueElements;
}
/**
 * Calculate simple string similarity (0-1)
 */
function stringSimilarity(a, b) {
    if (a === b)
        return 1;
    if (a.length === 0 || b.length === 0)
        return 0;
    // Count matching words
    var wordsA = a.split(/\s+/);
    var wordsB = b.split(/\s+/);
    var matchCount = 0;
    for (var _i = 0, wordsA_1 = wordsA; _i < wordsA_1.length; _i++) {
        var word = wordsA_1[_i];
        if (wordsB.includes(word)) {
            matchCount++;
        }
    }
    // Return similarity as proportion of matching words to total unique words
    var uniqueWords = new Set(__spreadArray(__spreadArray([], wordsA, true), wordsB, true));
    return matchCount / uniqueWords.size;
}
// *******************************************************************************
// Helper functions for analyzing system factors, ecosystem factors, etc.
// These would normally be more complex and include data-driven analysis
// *******************************************************************************
function analyzeSystemFactors(subject, data) {
    // This is a simplified implementation
    // In a real implementation, this would analyze data to extract actual factors
    return {
        factors: [
            {
                name: "System Complexity",
                impact: 7,
                directionality: 'negative',
                certainty: 0.8
            },
            {
                name: "Integration Points",
                impact: 6,
                directionality: 'negative',
                certainty: 0.7
            },
            {
                name: "Modularity",
                impact: 8,
                directionality: 'positive',
                certainty: 0.9
            }
        ]
    };
}
function analyzeEcosystemFactors(environmentalFactors) {
    // This is a simplified implementation
    // In a real implementation, this would analyze data to extract actual factors
    return {
        factors: [
            {
                name: "External Dependencies",
                impact: 6,
                directionality: 'negative',
                certainty: 0.7
            },
            {
                name: "User Ecosystem",
                impact: 8,
                directionality: 'positive',
                certainty: 0.8
            }
        ],
        patterns: ["Dependency Coupling", "Ecosystem Feedback Loops"]
    };
}
function analyzeDomainFactors(domainSpecifics, subject) {
    // This is a simplified implementation
    // In a real implementation, this would analyze domain data
    return {
        factors: [
            {
                name: "Domain Complexity",
                impact: 7,
                directionality: 'negative',
                certainty: 0.8
            },
            {
                name: "Domain Expertise",
                impact: 8,
                directionality: 'positive',
                certainty: 0.9
            }
        ],
        patterns: ["Domain Model Alignment", "Domain-Specific Constraints"]
    };
}
function analyzeOrganizationalFactors(orgContext) {
    // This is a simplified implementation
    // In a real implementation, this would analyze organizational context
    return {
        factors: [
            {
                name: "Communication Channels",
                impact: 6,
                directionality: 'negative',
                certainty: 0.7
            },
            {
                name: "Resource Allocation",
                impact: 7,
                directionality: 'negative',
                certainty: 0.8
            }
        ],
        patterns: ["Organizational Silos", "Resource Constraints"]
    };
}
function extractProjectFactors(data, subject) {
    // This is a simplified implementation
    // In a real implementation, this would extract project-specific factors
    return {
        factors: [
            {
                name: "Project Timeline",
                impact: 6,
                directionality: 'negative',
                certainty: 0.7
            },
            {
                name: "Technical Debt",
                impact: 8,
                directionality: 'negative',
                certainty: 0.9
            }
        ],
        patterns: ["Timeline Pressure", "Technical Debt Accumulation"]
    };
}
// *******************************************************************************
// Helper functions for analyzing component details, interaction details, etc.
// These would normally be more complex and include data-driven analysis
// *******************************************************************************
function analyzeComponentDetails(componentData, anomalyThreshold) {
    // This is a simplified implementation
    // In a real implementation, this would analyze component data
    return {
        metrics: [
            {
                metric: "Component Responsiveness",
                value: 250,
                unit: "ms",
                reliability: 0.9
            },
            {
                metric: "Component Error Rate",
                value: 2.5,
                unit: "%",
                reliability: 0.8
            }
        ],
        anomalies: [
            {
                description: "Intermittent component timeout",
                severity: 7,
                frequency: 'occasional'
            }
        ]
    };
}
function analyzeInteractionDetails(interactionData, anomalyThreshold) {
    // This is a simplified implementation
    // In a real implementation, this would analyze interaction data
    return {
        metrics: [
            {
                metric: "Communication Latency",
                value: 120,
                unit: "ms",
                reliability: 0.85
            },
            {
                metric: "Message Success Rate",
                value: 98.5,
                unit: "%",
                reliability: 0.9
            }
        ],
        anomalies: [
            {
                description: "Data synchronization failures",
                severity: 8,
                frequency: 'occasional',
                pattern: "Rate limiting pattern"
            }
        ]
    };
}
function analyzePerformanceDetails(performanceMetrics, anomalyThreshold) {
    // This is a simplified implementation
    // In a real implementation, this would analyze performance metrics
    return {
        metrics: [
            {
                metric: "Average Response Time",
                value: 320,
                unit: "ms",
                reliability: 0.95
            },
            {
                metric: "Throughput",
                value: 250,
                unit: "req/s",
                reliability: 0.9
            }
        ],
        anomalies: [
            {
                description: "Performance degradation under load",
                severity: 6,
                frequency: 'frequent',
                pattern: "Resource exhaustion"
            }
        ]
    };
}
function analyzeResourceDetails(resourceUtilization, anomalyThreshold) {
    // This is a simplified implementation
    // In a real implementation, this would analyze resource utilization
    return {
        metrics: [
            {
                metric: "CPU Utilization",
                value: 75,
                unit: "%",
                reliability: 0.95
            },
            {
                metric: "Memory Usage",
                value: 85,
                unit: "%",
                reliability: 0.95
            }
        ],
        anomalies: [
            {
                description: "Memory leak pattern",
                severity: 8,
                frequency: 'frequent',
                pattern: "Gradual increase"
            }
        ]
    };
}
function analyzeProcessDetails(processExecutionData, anomalyThreshold) {
    // This is a simplified implementation
    // In a real implementation, this would analyze process execution data
    return {
        metrics: [
            {
                metric: "Process Completion Rate",
                value: 92,
                unit: "%",
                reliability: 0.9
            },
            {
                metric: "Average Process Duration",
                value: 450,
                unit: "ms",
                reliability: 0.85
            }
        ],
        anomalies: [
            {
                description: "Process deadlock condition",
                severity: 9,
                frequency: 'rare',
                pattern: "Resource contention"
            }
        ]
    };
}
// *******************************************************************************
// Helper functions for identifying root causes
// These would normally be more complex and include data-driven analysis
// *******************************************************************************
function identifyStructuralCauses(macroElements, microElements, allAnomalies, allNegativeFactors) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true causes
    return [
        {
            id: uuidv4(),
            category: RootCauseCategory.STRUCTURAL,
            name: "Component Coupling",
            description: "High coupling between components leading to cascading failures",
            confidence: 0.75,
            impact: 8,
            evidenceBasis: [
                {
                    source: 'macro',
                    description: "System complexity factor",
                    strength: 0.8
                },
                {
                    source: 'micro',
                    description: "Interaction patterns",
                    strength: 0.7
                }
            ],
            contributingFactors: [
                {
                    description: "Monolithic architecture",
                    weight: 0.6
                },
                {
                    description: "Lack of component isolation",
                    weight: 0.7
                }
            ],
            resolutionApproaches: [
                "Refactor toward microservices architecture",
                "Implement clearer service boundaries"
            ]
        }
    ];
}
function identifyProceduralCauses(macroElements, microElements, allAnomalies, allNegativeFactors) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true causes
    return [
        {
            id: uuidv4(),
            category: RootCauseCategory.PROCEDURAL,
            name: "Inadequate Error Handling",
            description: "Insufficient error handling procedures across system components",
            confidence: 0.8,
            impact: 7,
            evidenceBasis: [
                {
                    source: 'micro',
                    description: "Error propagation patterns",
                    strength: 0.9
                }
            ],
            contributingFactors: [
                {
                    description: "Inconsistent error handling approaches",
                    weight: 0.8
                },
                {
                    description: "Lack of error recovery mechanisms",
                    weight: 0.7
                }
            ],
            resolutionApproaches: [
                "Implement uniform error handling strategy",
                "Add circuit breaker patterns for fault tolerance"
            ]
        }
    ];
}
function identifyTechnicalCauses(macroElements, microElements, allAnomalies, allNegativeFactors) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true causes
    return [
        {
            id: uuidv4(),
            category: RootCauseCategory.TECHNICAL,
            name: "Resource Contention",
            description: "Multiple components competing for limited resources",
            confidence: 0.85,
            impact: 8,
            evidenceBasis: [
                {
                    source: 'micro',
                    description: "Resource utilization patterns",
                    strength: 0.9
                },
                {
                    source: 'micro',
                    description: "Performance degradation under load",
                    strength: 0.8
                }
            ],
            contributingFactors: [
                {
                    description: "Unoptimized resource allocation",
                    weight: 0.7
                },
                {
                    description: "Lack of resource prioritization",
                    weight: 0.6
                }
            ],
            resolutionApproaches: [
                "Implement resource pooling and prioritization",
                "Optimize high-consumption operations"
            ]
        }
    ];
}
function identifyInformationalCauses(macroElements, microElements, allAnomalies, allNegativeFactors) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true causes
    return [
        {
            id: uuidv4(),
            category: RootCauseCategory.INFORMATIONAL,
            name: "Data Inconsistency",
            description: "Inconsistent data representations across system components",
            confidence: 0.7,
            impact: 6,
            evidenceBasis: [
                {
                    source: 'micro',
                    description: "Data synchronization failures",
                    strength: 0.8
                }
            ],
            contributingFactors: [
                {
                    description: "Multiple data representations",
                    weight: 0.6
                },
                {
                    description: "Lack of data validation",
                    weight: 0.5
                }
            ],
            resolutionApproaches: [
                "Implement consistent data schema",
                "Add data validation layer"
            ]
        }
    ];
}
function identifyHumanCauses(macroElements, microElements, allAnomalies, allNegativeFactors, externalKnowledge) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true causes
    return [
        {
            id: uuidv4(),
            category: RootCauseCategory.HUMAN,
            name: "Knowledge Gaps",
            description: "Critical gaps in system understanding among team members",
            confidence: 0.65,
            impact: 7,
            evidenceBasis: [
                {
                    source: 'macro',
                    description: "Communication inefficiencies",
                    strength: 0.7
                }
            ],
            contributingFactors: [
                {
                    description: "Specialized knowledge silos",
                    weight: 0.7
                },
                {
                    description: "Documentation gaps",
                    weight: 0.6
                }
            ],
            resolutionApproaches: [
                "Develop comprehensive knowledge sharing program",
                "Improve system documentation"
            ]
        }
    ];
}
function identifyEnvironmentalCauses(macroElements, microElements, allAnomalies, allNegativeFactors) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true causes
    return [
        {
            id: uuidv4(),
            category: RootCauseCategory.ENVIRONMENTAL,
            name: "External Service Reliability",
            description: "Dependence on external services with variable reliability",
            confidence: 0.75,
            impact: 7,
            evidenceBasis: [
                {
                    source: 'macro',
                    description: "External dependencies factor",
                    strength: 0.8
                }
            ],
            contributingFactors: [
                {
                    description: "Limited control over external services",
                    weight: 0.8
                },
                {
                    description: "Insufficient fallback mechanisms",
                    weight: 0.7
                }
            ],
            resolutionApproaches: [
                "Implement robust fallback mechanisms",
                "Develop service-level agreements with providers"
            ]
        }
    ];
}
// *******************************************************************************
// Helper functions for void analysis
// These would normally be more complex and include data-driven analysis
// *******************************************************************************
function identifyCausalGaps(macroElements, microElements, rootCauses) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true void elements
    return [
        {
            id: uuidv4(),
            name: "Hidden Dependency Chain",
            description: "Potential unidentified dependencies between critical components",
            confidenceLevel: VoidConfidenceLevel.INFERRED,
            detectionMethod: 'pattern-analysis',
            potentialImpact: 8,
            unknownDegree: 0.7,
            indicativeSignals: [
                {
                    description: "Unexplained correlation in component failures",
                    reliability: 0.65
                }
            ],
            mitigationStrategies: [
                "Conduct comprehensive dependency mapping",
                "Implement isolation testing"
            ]
        }
    ];
}
function identifyUnexplainedVariance(microElements, rootCauses) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true void elements
    return [
        {
            id: uuidv4(),
            name: "Unattributed Performance Variance",
            description: "Unexplained variance in performance metrics not addressed by identified causes",
            confidenceLevel: VoidConfidenceLevel.PARTIAL,
            detectionMethod: 'statistical-inference',
            potentialImpact: 6,
            unknownDegree: 0.6,
            indicativeSignals: [
                {
                    description: "Periodic performance spikes without clear trigger",
                    reliability: 0.7
                }
            ],
            mitigationStrategies: [
                "Implement enhanced telemetry",
                "Conduct controlled variance testing"
            ]
        }
    ];
}
function identifyHiddenDependencies(macroElements, microElements) {
    // This is a simplified implementation
    // In a real implementation, this would use data analysis to identify true void elements
    return [
        {
            id: uuidv4(),
            name: "Unmonitored Resource Consumption",
            description: "Potential hidden resource consumption not captured in current metrics",
            confidenceLevel: VoidConfidenceLevel.HYPOTHETICAL,
            detectionMethod: 'gap-identification',
            potentialImpact: 7,
            unknownDegree: 0.8,
            indicativeSignals: [
                {
                    description: "System slowdowns without corresponding monitored resource spikes",
                    reliability: 0.6
                }
            ],
            mitigationStrategies: [
                "Expand resource monitoring coverage",
                "Implement resource profiling"
            ]
        }
    ];
}
