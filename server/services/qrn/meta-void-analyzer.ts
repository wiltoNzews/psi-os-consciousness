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

import { v4 as uuidv4 } from 'uuid';

/**
 * Shared structure between Preview and Review
 */
export interface MetaVoidBase {
  id: string;
  timestamp: Date;
  subject: string; // Decision or action being analyzed
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  };
  quantumReadiness: number; // 0-1 scale of readiness for quantum-level analysis
}

/**
 * Meta-Void Preview result structure
 */
export interface MetaVoidPreviewResult extends MetaVoidBase {
  previewType: 'anticipatory' | 'exploratory' | 'probabilistic' | 'scenario-based';
  timeHorizon: number; // Time units into future
  chaosFactors: Array<{
    name: string;
    unpredictability: number; // 0-1 scale
    potentialImpact: number; // 1-10 scale
    mitigationOptions: string[];
  }>;
  structureElements: Array<{
    name: string;
    stability: number; // 0-1 scale
    adaptability: number; // 0-1 scale
    relevance: number; // 0-1 scale
  }>;
  scenarios: Array<{
    id: string;
    name: string;
    probability: number; // 0-1 scale
    description: string;
    outcomes: string[];
    strategicImplications: string[];
  }>;
  decisionPathways: Array<{
    id: string;
    description: string;
    alignment: number; // 0-1 scale with objectives
    risk: number; // 0-1 scale
    opportunity: number; // 0-1 scale
  }>;
  insights: string[];
  recommendations: string[];
}

/**
 * Meta-Void Review result structure
 */
export interface MetaVoidReviewResult extends MetaVoidBase {
  reviewType: 'evaluative' | 'reflective' | 'comparative' | 'systemic';
  actualOutcomes: Array<{
    description: string;
    valence: 'positive' | 'negative' | 'neutral' | 'mixed';
    magnitude: number; // 1-10 scale
    alignment: number; // 0-1 scale with expected outcomes
  }>;
  decisionEffectiveness: {
    overall: number; // 0-1 scale
    byObjective: Record<string, number>; // Objective -> effectiveness (0-1)
    opportunity: number; // Opportunity captured (0-1)
    resourceUse: number; // Efficiency (0-1)
  };
  lessonsLearned: Array<{
    insight: string;
    confidence: number; // 0-1 scale
    applicability: 'specific' | 'generalizable' | 'universal';
    actionableSteps: string[];
  }>;
  systemicPatterns: Array<{
    pattern: string;
    frequency: number; // 0-1 scale (how often observed)
    impact: number; // 1-10 scale
    intervention: string;
  }>;
  recalibrationGuidance: {
    mentalModels: string[];
    processAdjustments: string[];
    structuralChanges: string[];
  };
  insights: string[];
  recommendations: string[];
}

/**
 * Parameters for Meta-Void Preview
 */
export interface PreviewParameters {
  subject: string;
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  };
  timeHorizon: number;
  knownChaosFactors?: Array<{
    name: string;
    unpredictability?: number;
    potentialImpact?: number;
  }>;
  previewType?: 'anticipatory' | 'exploratory' | 'probabilistic' | 'scenario-based';
  existingStructures?: Array<{
    name: string;
    stability?: number;
    adaptability?: number;
  }>;
}

/**
 * Parameters for Meta-Void Review
 */
export interface ReviewParameters {
  subject: string;
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  };
  originalDecision: {
    description: string;
    expectedOutcomes: string[];
    assumptions: string[];
    alternatives: string[];
  };
  actualOutcomes: Array<{
    description: string;
    valence?: 'positive' | 'negative' | 'neutral' | 'mixed';
    magnitude?: number;
  }>;
  reviewType?: 'evaluative' | 'reflective' | 'comparative' | 'systemic';
  observedPatterns?: string[];
}

/**
 * Generate a Meta-Void Preview
 * 
 * Implements MetaVoidPreview(t) = ForeSight(Chaos, Structure, t+1)
 * 
 * @param params - Preview parameters
 * @returns Meta-Void Preview result
 */
export function generateMetaVoidPreview(params: PreviewParameters): MetaVoidPreviewResult {
  // 1. Set up base structure
  const baseStructure: MetaVoidBase = {
    id: uuidv4(),
    timestamp: new Date(),
    subject: params.subject,
    context: params.context,
    quantumReadiness: calculateQuantumReadiness(params.context.domain, params.timeHorizon)
  };
  
  // 2. Set preview type (default to anticipatory if not specified)
  const previewType = params.previewType || 'anticipatory';
  
  // 3. Generate chaos factors
  const chaosFactors = generateChaosFactors(
    params.context.domain,
    params.timeHorizon,
    params.knownChaosFactors || []
  );
  
  // 4. Generate structure elements
  const structureElements = generateStructureElements(
    params.context.domain,
    params.existingStructures || []
  );
  
  // 5. Generate scenarios
  const scenarios = generateScenarios(
    params.subject,
    params.context,
    chaosFactors,
    structureElements,
    params.timeHorizon
  );
  
  // 6. Generate decision pathways
  const decisionPathways = generateDecisionPathways(
    params.subject,
    params.context.objectives,
    scenarios
  );
  
  // 7. Generate insights
  const insights = generatePreviewInsights(
    params.subject,
    params.context,
    chaosFactors,
    scenarios,
    decisionPathways
  );
  
  // 8. Generate recommendations
  const recommendations = generatePreviewRecommendations(
    chaosFactors,
    scenarios,
    decisionPathways,
    params.context.objectives
  );
  
  // 9. Construct complete preview result
  return {
    ...baseStructure,
    previewType,
    timeHorizon: params.timeHorizon,
    chaosFactors,
    structureElements,
    scenarios,
    decisionPathways,
    insights,
    recommendations
  };
}

/**
 * Generate a Meta-Void Review
 * 
 * Implements MetaVoidReview(t) = ReflectiveInsight(Decisions(t), Outcomes(t))
 * 
 * @param params - Review parameters
 * @returns Meta-Void Review result
 */
export function generateMetaVoidReview(params: ReviewParameters): MetaVoidReviewResult {
  // 1. Set up base structure
  const baseStructure: MetaVoidBase = {
    id: uuidv4(),
    timestamp: new Date(),
    subject: params.subject,
    context: params.context,
    quantumReadiness: calculateQuantumReadiness(params.context.domain, 0) // Present-focused
  };
  
  // 2. Set review type (default to evaluative if not specified)
  const reviewType = params.reviewType || 'evaluative';
  
  // 3. Process actual outcomes
  const actualOutcomes = analyzeActualOutcomes(
    params.actualOutcomes,
    params.originalDecision.expectedOutcomes
  );
  
  // 4. Evaluate decision effectiveness
  const decisionEffectiveness = evaluateDecisionEffectiveness(
    params.originalDecision,
    actualOutcomes,
    params.context.objectives
  );
  
  // 5. Extract lessons learned
  const lessonsLearned = extractLessonsLearned(
    params.originalDecision,
    actualOutcomes,
    params.context
  );
  
  // 6. Identify systemic patterns
  const systemicPatterns = identifySystemicPatterns(
    actualOutcomes,
    params.observedPatterns || []
  );
  
  // 7. Generate recalibration guidance
  const recalibrationGuidance = generateRecalibrationGuidance(
    lessonsLearned,
    systemicPatterns,
    decisionEffectiveness
  );
  
  // 8. Generate insights
  const insights = generateReviewInsights(
    params.subject,
    params.originalDecision,
    actualOutcomes,
    lessonsLearned,
    systemicPatterns
  );
  
  // 9. Generate recommendations
  const recommendations = generateReviewRecommendations(
    decisionEffectiveness,
    lessonsLearned,
    recalibrationGuidance
  );
  
  // 10. Construct complete review result
  return {
    ...baseStructure,
    reviewType,
    actualOutcomes,
    decisionEffectiveness,
    lessonsLearned,
    systemicPatterns,
    recalibrationGuidance,
    insights,
    recommendations
  };
}

/**
 * Calculate quantum readiness based on domain and time horizon
 * @returns Score between 0-1
 */
function calculateQuantumReadiness(domain: string, timeHorizon: number): number {
  // Base readiness - moderately high for comprehensive framework
  let readiness = 0.65;
  
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
  } else {
    // Past analysis is more classical (fixed outcomes)
    readiness -= 0.1;
  }
  
  // Ensure readiness stays within 0-1 range
  return Math.max(0, Math.min(1, readiness));
}

/**
 * Generate chaos factors for preview
 */
function generateChaosFactors(
  domain: string,
  timeHorizon: number,
  knownFactors: Array<{
    name: string;
    unpredictability?: number;
    potentialImpact?: number;
  }>
): Array<{
  name: string;
  unpredictability: number;
  potentialImpact: number;
  mitigationOptions: string[];
}> {
  // Initialize with known factors
  const factors = knownFactors.map(factor => ({
    name: factor.name,
    unpredictability: factor.unpredictability || 0.7, // Default high unpredictability
    potentialImpact: factor.potentialImpact || 7, // Default high impact
    mitigationOptions: [] as string[]
  }));
  
  // Add standard domain-specific factors if not already included
  const domainFactors = getDomainSpecificChaosFactors(domain);
  
  for (const domainFactor of domainFactors) {
    if (!factors.some(f => f.name.toLowerCase() === domainFactor.name.toLowerCase())) {
      factors.push(domainFactor);
    }
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
  for (const factor of factors) {
    if (factor.mitigationOptions.length === 0) {
      factor.mitigationOptions = generateMitigationOptions(factor.name, factor.unpredictability);
    }
  }
  
  return factors;
}

/**
 * Get domain-specific chaos factors
 */
function getDomainSpecificChaosFactors(domain: string): Array<{
  name: string;
  unpredictability: number;
  potentialImpact: number;
  mitigationOptions: string[];
}> {
  // Common chaos factors by domain
  const domainFactors: Record<string, Array<{
    name: string;
    unpredictability: number;
    potentialImpact: number;
    mitigationOptions: string[];
  }>> = {
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
  const defaultFactors = [
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
  for (const [key, factors] of Object.entries(domainFactors)) {
    if (domain.toLowerCase().includes(key)) {
      return factors;
    }
  }
  
  return defaultFactors;
}

/**
 * Generate mitigation options for a chaos factor
 */
function generateMitigationOptions(
  factorName: string,
  unpredictability: number
): string[] {
  const options: string[] = [];
  
  // General mitigation approaches based on unpredictability
  if (unpredictability > 0.8) {
    // Highly unpredictable - focus on resilience and adaptability
    options.push("Develop resilience capabilities");
    options.push("Create adaptive response frameworks");
    options.push("Establish early warning systems");
  } else if (unpredictability > 0.5) {
    // Moderately unpredictable - focus on forecasting and preparation
    options.push("Enhance forecasting capabilities");
    options.push("Prepare contingency plans");
    options.push("Develop scenario-based strategies");
  } else {
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
function generateStructureElements(
  domain: string,
  existingStructures: Array<{
    name: string;
    stability?: number;
    adaptability?: number;
  }>
): Array<{
  name: string;
  stability: number;
  adaptability: number;
  relevance: number;
}> {
  // Initialize with existing structures
  const elements = existingStructures.map(structure => ({
    name: structure.name,
    stability: structure.stability || 0.7, // Default high stability
    adaptability: structure.adaptability || 0.5, // Default moderate adaptability
    relevance: 0.8 // Default high relevance
  }));
  
  // Add standard domain-specific structures if not already included
  const domainStructures = getDomainSpecificStructures(domain);
  
  for (const domainStructure of domainStructures) {
    if (!elements.some(e => e.name.toLowerCase() === domainStructure.name.toLowerCase())) {
      elements.push(domainStructure);
    }
  }
  
  // Calculate relevance for elements that don't have it
  for (const element of elements) {
    if (element.relevance === undefined) {
      element.relevance = calculateStructureRelevance(element.name, domain);
    }
  }
  
  return elements;
}

/**
 * Get domain-specific structure elements
 */
function getDomainSpecificStructures(domain: string): Array<{
  name: string;
  stability: number;
  adaptability: number;
  relevance: number;
}> {
  // Common structure elements by domain
  const domainStructures: Record<string, Array<{
    name: string;
    stability: number;
    adaptability: number;
    relevance: number;
  }>> = {
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
  const defaultStructures = [
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
  for (const [key, structures] of Object.entries(domainStructures)) {
    if (domain.toLowerCase().includes(key)) {
      return structures;
    }
  }
  
  return defaultStructures;
}

/**
 * Calculate relevance of a structure element to a domain
 */
function calculateStructureRelevance(structureName: string, domain: string): number {
  // Default moderate relevance
  let relevance = 0.6;
  
  // Check if structure name contains domain keywords
  if (domain.split(' ').some(word => 
      structureName.toLowerCase().includes(word.toLowerCase()))) {
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
function generateScenarios(
  subject: string,
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  },
  chaosFactors: Array<{
    name: string;
    unpredictability: number;
    potentialImpact: number;
    mitigationOptions: string[];
  }>,
  structureElements: Array<{
    name: string;
    stability: number;
    adaptability: number;
    relevance: number;
  }>,
  timeHorizon: number
): Array<{
  id: string;
  name: string;
  probability: number;
  description: string;
  outcomes: string[];
  strategicImplications: string[];
}> {
  const scenarios: Array<{
    id: string;
    name: string;
    probability: number;
    description: string;
    outcomes: string[];
    strategicImplications: string[];
  }> = [];
  
  // 1. Generate baseline expected scenario
  scenarios.push(generateBaselineScenario(
    subject,
    context,
    structureElements,
    timeHorizon
  ));
  
  // 2. Generate chaos-factor driven scenarios
  // Focus on high-impact, high-unpredictability factors
  const disruptiveFactors = chaosFactors
    .filter(f => f.potentialImpact >= 7 && f.unpredictability >= 0.6)
    .slice(0, 2); // Limit to top 2 disruptive factors
  
  for (const factor of disruptiveFactors) {
    scenarios.push(generateChaosFactorScenario(
      subject,
      context,
      factor,
      structureElements,
      timeHorizon
    ));
  }
  
  // 3. Generate combined factors scenario (if multiple disruptive factors)
  if (disruptiveFactors.length >= 2) {
    scenarios.push(generateCombinedFactorsScenario(
      subject,
      context,
      disruptiveFactors,
      structureElements,
      timeHorizon
    ));
  }
  
  // 4. Generate optimistic scenario
  scenarios.push(generateOptimisticScenario(
    subject,
    context,
    structureElements,
    timeHorizon
  ));
  
  // 5. Normalize scenario probabilities to sum to 1.0
  const totalProbability = scenarios.reduce((sum, s) => sum + s.probability, 0);
  scenarios.forEach(s => {
    s.probability = s.probability / totalProbability;
  });
  
  return scenarios;
}

/**
 * Generate baseline expected scenario
 */
function generateBaselineScenario(
  subject: string,
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  },
  structureElements: Array<{
    name: string;
    stability: number;
    adaptability: number;
    relevance: number;
  }>,
  timeHorizon: number
): {
  id: string;
  name: string;
  probability: number;
  description: string;
  outcomes: string[];
  strategicImplications: string[];
} {
  // Calculate average structure stability as baseline stability indicator
  const avgStability = structureElements.reduce(
    (sum, element) => sum + element.stability, 
    0
  ) / Math.max(1, structureElements.length);
  
  // Higher stability increases baseline scenario probability
  let baselineProbability = 0.4 + (avgStability * 0.2);
  
  // Longer time horizons reduce baseline probability
  baselineProbability -= Math.min(0.2, timeHorizon * 0.01);
  
  // Generate outcomes based on objectives
  const outcomes = context.objectives.map(objective => 
    `Achievement of "${objective}" within expected parameters`
  );
  
  // Generate strategic implications
  const strategicImplications = [
    "Reinforces current strategic direction",
    "Validates existing resource allocation approach",
    "Supports current stakeholder engagement model"
  ];
  
  // Add domain-specific implication
  strategicImplications.push(`Maintains established position in ${context.domain} domain`);
  
  return {
    id: uuidv4(),
    name: "Expected Progression",
    probability: baselineProbability,
    description: `${subject} unfolds as anticipated, with expected challenges addressed through established mechanisms. Existing structures provide adequate support, and stakeholders respond in line with historical patterns.`,
    outcomes,
    strategicImplications
  };
}

/**
 * Generate scenario driven by a specific chaos factor
 */
function generateChaosFactorScenario(
  subject: string,
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  },
  chaosFactor: {
    name: string;
    unpredictability: number;
    potentialImpact: number;
    mitigationOptions: string[];
  },
  structureElements: Array<{
    name: string;
    stability: number;
    adaptability: number;
    relevance: number;
  }>,
  timeHorizon: number
): {
  id: string;
  name: string;
  probability: number;
  description: string;
  outcomes: string[];
  strategicImplications: string[];
} {
  // Higher unpredictability and longer time horizons increase this scenario's probability
  let scenarioProbability = chaosFactor.unpredictability * 0.3;
  
  // Longer time horizons increase disruption probability
  scenarioProbability += Math.min(0.2, timeHorizon * 0.01);
  
  // Factor name drives scenario name
  const scenarioName = `${chaosFactor.name} Disruption`;
  
  // Build description
  const description = `${subject} encounters significant challenges due to ${chaosFactor.name.toLowerCase()} becoming a dominant factor. Existing structures are tested, requiring adaptation and potentially new approaches to maintain progress toward objectives.`;
  
  // Generate impacted outcomes
  const outcomes: string[] = [];
  
  // For each objective, consider how this factor affects it
  for (const objective of context.objectives) {
    if (Math.random() < 0.7) { // 70% chance of objective being impacted
      outcomes.push(`${objective} achievement delayed or compromised due to ${chaosFactor.name.toLowerCase()} impact`);
    } else {
      outcomes.push(`${objective} achievement maintained despite ${chaosFactor.name.toLowerCase()} challenges`);
    }
  }
  
  // Generate strategic implications based on factor and structures
  const strategicImplications: string[] = [];
  
  // Mitigation options become strategic implications
  if (chaosFactor.mitigationOptions.length > 0) {
    strategicImplications.push(...chaosFactor.mitigationOptions.map(option => 
      `Need to implement ${option.toLowerCase()} becomes critical`
    ));
  }
  
  // Structure adaptation implications
  const lowAdaptabilityStructures = structureElements
    .filter(element => element.adaptability < 0.5)
    .slice(0, 2);
    
  if (lowAdaptabilityStructures.length > 0) {
    strategicImplications.push(
      `${lowAdaptabilityStructures.map(s => s.name).join(' and ')} require significant adaptation`
    );
  }
  
  return {
    id: uuidv4(),
    name: scenarioName,
    probability: scenarioProbability,
    description,
    outcomes,
    strategicImplications
  };
}

/**
 * Generate scenario driven by multiple chaos factors
 */
function generateCombinedFactorsScenario(
  subject: string,
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  },
  chaosFactors: Array<{
    name: string;
    unpredictability: number;
    potentialImpact: number;
    mitigationOptions: string[];
  }>,
  structureElements: Array<{
    name: string;
    stability: number;
    adaptability: number;
    relevance: number;
  }>,
  timeHorizon: number
): {
  id: string;
  name: string;
  probability: number;
  description: string;
  outcomes: string[];
  strategicImplications: string[];
} {
  // Probability based on combined factors, but lower than sum of individual probabilities
  const combinedUnpredictability = chaosFactors.reduce(
    (product, factor) => product * factor.unpredictability, 
    1
  );
  
  let scenarioProbability = Math.sqrt(combinedUnpredictability) * 0.2;
  
  // Longer time horizons increase complexity scenario probability
  scenarioProbability += Math.min(0.1, timeHorizon * 0.005);
  
  // Factor names drive scenario name
  const factorNames = chaosFactors.map(f => f.name);
  const scenarioName = "Compounding Complexity";
  
  // Build description
  const description = `${subject} faces a perfect storm scenario where ${factorNames.join(' and ')} interact in complex ways, creating amplified challenges. Traditional approaches may prove insufficient, requiring innovative responses and potential recalibration of objectives.`;
  
  // Generate severely impacted outcomes
  const outcomes: string[] = [];
  
  // For each objective, consider the compounding impact
  for (const objective of context.objectives) {
    if (Math.random() < 0.8) { // 80% chance of objective being severely impacted
      outcomes.push(`${objective} significantly challenged by compounding factors`);
    } else {
      outcomes.push(`${objective} maintained but requires resource reallocation`);
    }
  }
  
  // Generate strategic implications based on compounding factors
  const strategicImplications: string[] = [
    "Need for integrated rather than siloed response approaches",
    "Potential requirement for strategic pivot or reframing",
    "Critical test of organizational adaptability and resilience"
  ];
  
  // Add structure overhaul implication
  const criticalStructures = structureElements
    .filter(element => element.relevance > 0.7)
    .slice(0, 2);
    
  if (criticalStructures.length > 0) {
    strategicImplications.push(
      `Fundamental reassessment of ${criticalStructures.map(s => s.name).join(' and ')} required`
    );
  }
  
  return {
    id: uuidv4(),
    name: scenarioName,
    probability: scenarioProbability,
    description,
    outcomes,
    strategicImplications
  };
}

/**
 * Generate optimistic breakthrough scenario
 */
function generateOptimisticScenario(
  subject: string,
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  },
  structureElements: Array<{
    name: string;
    stability: number;
    adaptability: number;
    relevance: number;
  }>,
  timeHorizon: number
): {
  id: string;
  name: string;
  probability: number;
  description: string;
  outcomes: string[];
  strategicImplications: string[];
} {
  // Calculate average structure adaptability as opportunity indicator
  const avgAdaptability = structureElements.reduce(
    (sum, element) => sum + element.adaptability, 
    0
  ) / Math.max(1, structureElements.length);
  
  // Higher adaptability increases breakthrough scenario probability
  let breakthroughProbability = 0.1 + (avgAdaptability * 0.2);
  
  // Moderate time horizons (not too short, not too long) maximize breakthrough probability
  const timeHorizonFactor = Math.min(timeHorizon, 10) / 10; // 0-1 scale capped at 10 units
  breakthroughProbability += timeHorizonFactor * (1 - timeHorizonFactor) * 0.2; // Parabolic curve
  
  // Generate enhanced outcomes based on objectives
  const outcomes = context.objectives.map(objective => 
    `${objective} exceeded, with additional unanticipated benefits`
  );
  
  // Add breakthrough outcome
  outcomes.push(`Emergence of new opportunities beyond original scope`);
  
  // Generate strategic implications
  const strategicImplications = [
    "Potential to establish leadership position in emerging area",
    "Opportunity to redefine success metrics and ambition level",
    "Case study for strategic agility and opportunity capitalization"
  ];
  
  // Add domain-specific implication
  strategicImplications.push(`Position to influence future direction of ${context.domain} domain`);
  
  return {
    id: uuidv4(),
    name: "Breakthrough Emergence",
    probability: breakthroughProbability,
    description: `${subject} not only achieves expected outcomes but creates unexpected positive emergent properties. Stakeholders find alignment in previously unforeseen ways, and structural elements demonstrate exceptional synergy, opening new strategic horizons.`,
    outcomes,
    strategicImplications
  };
}

/**
 * Generate decision pathways based on scenarios
 */
function generateDecisionPathways(
  subject: string,
  objectives: string[],
  scenarios: Array<{
    id: string;
    name: string;
    probability: number;
    description: string;
    outcomes: string[];
    strategicImplications: string[];
  }>
): Array<{
  id: string;
  description: string;
  alignment: number;
  risk: number;
  opportunity: number;
}> {
  const pathways: Array<{
    id: string;
    description: string;
    alignment: number;
    risk: number;
    opportunity: number;
  }> = [];
  
  // 1. Generate standard pathway (addressing most probable scenario)
  const mostProbableScenario = [...scenarios].sort((a, b) => b.probability - a.probability)[0];
  
  pathways.push({
    id: uuidv4(),
    description: `Optimize for "${mostProbableScenario.name}" scenario, focusing resources on highest probability outcome`,
    alignment: 0.8, // High alignment with objectives
    risk: 0.3, // Low risk (following most probable path)
    opportunity: 0.6 // Moderate opportunity (limited breakthrough potential)
  });
  
  // 2. Generate hedging pathway (balancing multiple scenarios)
  pathways.push({
    id: uuidv4(),
    description: `Balance preparation across multiple scenarios, maintaining flexibility to pivot as emergence becomes clearer`,
    alignment: 0.7, // Good alignment with objectives
    risk: 0.5, // Moderate risk (potential resource dilution)
    opportunity: 0.7 // Good opportunity (prepared for different outcomes)
  });
  
  // 3. Generate opportunity-focused pathway (emphasizing highest impact positive scenario)
  const positiveScenarios = scenarios.filter(s => 
    s.outcomes.some(o => o.includes("exceeded") || o.includes("beyond"))
  );
  
  if (positiveScenarios.length > 0) {
    const topPositiveScenario = positiveScenarios[0];
    
    pathways.push({
      id: uuidv4(),
      description: `Optimize for upside potential in "${topPositiveScenario.name}" scenario, emphasizing breakthrough possibilities`,
      alignment: 0.6, // Moderate alignment with stated objectives
      risk: 0.8, // High risk (betting on lower probability outcome)
      opportunity: 0.9 // High opportunity (focused on breakthrough)
    });
  }
  
  // 4. Generate resilience-focused pathway (emphasizing protection against negative scenarios)
  const negativeScenarios = scenarios.filter(s => 
    s.outcomes.some(o => o.includes("compromised") || o.includes("challenged"))
  );
  
  if (negativeScenarios.length > 0) {
    const topNegativeScenario = negativeScenarios[0];
    
    pathways.push({
      id: uuidv4(),
      description: `Prioritize resilience against "${topNegativeScenario.name}" scenario, implementing robust mitigations`,
      alignment: 0.7, // Good alignment with objectives (protective)
      risk: 0.4, // Lower risk (protected downside)
      opportunity: 0.5 // Moderate opportunity (focus on protection vs upside)
    });
  }
  
  // 5. Generate objective-focused pathway (emphasizing core objectives regardless of scenario)
  pathways.push({
    id: uuidv4(),
    description: `Maintain strict focus on core objectives: ${objectives.slice(0, 2).join(", ")}${objectives.length > 2 ? "..." : ""}`,
    alignment: 0.9, // Very high alignment with stated objectives
    risk: 0.6, // Moderate risk (potential inflexibility)
    opportunity: 0.6 // Moderate opportunity (focused but potentially missing emergence)
  });
  
  return pathways;
}

/**
 * Generate insights for Meta-Void Preview
 */
function generatePreviewInsights(
  subject: string,
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  },
  chaosFactors: Array<{
    name: string;
    unpredictability: number;
    potentialImpact: number;
    mitigationOptions: string[];
  }>,
  scenarios: Array<{
    id: string;
    name: string;
    probability: number;
    description: string;
    outcomes: string[];
    strategicImplications: string[];
  }>,
  decisionPathways: Array<{
    id: string;
    description: string;
    alignment: number;
    risk: number;
    opportunity: number;
  }>
): string[] {
  const insights: string[] = [];
  
  // Insight about probability distribution
  const concentratedProbability = scenarios.some(s => s.probability > 0.6);
  if (concentratedProbability) {
    insights.push(`Future probability is heavily concentrated in a single scenario, suggesting lower overall uncertainty despite specific chaos factors.`);
  } else {
    insights.push(`Future probability is distributed across multiple scenarios, indicating high situational uncertainty requiring flexible response capabilities.`);
  }
  
  // Insight about highest impact chaos factors
  const highImpactFactors = chaosFactors
    .filter(f => f.potentialImpact >= 8)
    .map(f => f.name);
    
  if (highImpactFactors.length > 0) {
    insights.push(`${highImpactFactors.join(' and ')} represent critical uncertainties that could fundamentally reshape outcomes.`);
  }
  
  // Insight about stakeholder dynamics
  if (context.stakeholders.length > 2) {
    insights.push(`Complex stakeholder dynamics among ${context.stakeholders.length} key parties creates additional uncertainty not captured in individual chaos factors.`);
  }
  
  // Insight about constraint impact
  if (context.constraints.length > 0) {
    insights.push(`Existing constraints (${context.constraints.map(c => `"${c}"`).join(', ')}) may limit responsiveness to emerging scenarios.`);
  }
  
  // Insight about pathway trade-offs
  const highAlignmentPathway = decisionPathways.find(p => p.alignment > 0.8);
  const highOpportunityPathway = decisionPathways.find(p => p.opportunity > 0.8);
  
  if (highAlignmentPathway && highOpportunityPathway && highAlignmentPathway.id !== highOpportunityPathway.id) {
    insights.push(`Clear trade-off exists between highest alignment pathway and highest opportunity pathway, requiring explicit prioritization choice.`);
  }
  
  return insights;
}

/**
 * Generate recommendations for Meta-Void Preview
 */
function generatePreviewRecommendations(
  chaosFactors: Array<{
    name: string;
    unpredictability: number;
    potentialImpact: number;
    mitigationOptions: string[];
  }>,
  scenarios: Array<{
    id: string;
    name: string;
    probability: number;
    description: string;
    outcomes: string[];
    strategicImplications: string[];
  }>,
  decisionPathways: Array<{
    id: string;
    description: string;
    alignment: number;
    risk: number;
    opportunity: number;
  }>,
  objectives: string[]
): string[] {
  const recommendations: string[] = [];
  
  // Recommendation based on highest impact chaos factor
  const topChaosFactor = [...chaosFactors].sort((a, b) => b.potentialImpact - a.potentialImpact)[0];
  if (topChaosFactor) {
    recommendations.push(`Develop explicit mitigation strategies for ${topChaosFactor.name}, the highest impact uncertainty factor.`);
  }
  
  // Recommendation based on probability distribution
  const probabilities = scenarios.map(s => s.probability);
  const maxProbability = Math.max(...probabilities);
  const minProbability = Math.min(...probabilities);
  
  if (maxProbability - minProbability > 0.5) {
    // Wide probability spread
    recommendations.push(`Focus resources on the ${scenarios.find(s => s.probability === maxProbability)?.name} scenario while maintaining minimal viable preparation for others.`);
  } else {
    // Narrow probability spread
    recommendations.push(`Develop balanced preparation across multiple scenarios given their comparable probabilities.`);
  }
  
  // Recommendation based on objective alignment
  recommendations.push(`Ensure ongoing measurement of progress toward core objectives: ${objectives.slice(0, 2).join(", ")}${objectives.length > 2 ? "..." : ""} with explicit trigger points for strategy adjustment.`);
  
  // Recommendation based on optimal pathway
  const optimalPathway = [...decisionPathways].sort((a, b) => {
    // Balance formula: (alignment * 0.4) + (opportunity * 0.4) + ((1 - risk) * 0.2)
    const scoreA = (a.alignment * 0.4) + (a.opportunity * 0.4) + ((1 - a.risk) * 0.2);
    const scoreB = (b.alignment * 0.4) + (b.opportunity * 0.4) + ((1 - b.risk) * 0.2);
    return scoreB - scoreA;
  })[0];
  
  if (optimalPathway) {
    recommendations.push(`Consider adopting the balanced-optimal approach: "${optimalPathway.description}"`);
  }
  
  // General recommendation for ongoing recalibration
  recommendations.push(`Establish explicit points for Meta-Void Review to recalibrate preview assumptions based on emergent patterns.`);
  
  return recommendations;
}

/**
 * Analyze actual outcomes relative to expected outcomes
 */
function analyzeActualOutcomes(
  actualOutcomes: Array<{
    description: string;
    valence?: 'positive' | 'negative' | 'neutral' | 'mixed';
    magnitude?: number;
  }>,
  expectedOutcomes: string[]
): Array<{
  description: string;
  valence: 'positive' | 'negative' | 'neutral' | 'mixed';
  magnitude: number;
  alignment: number;
}> {
  return actualOutcomes.map(outcome => {
    // Determine valence if not specified
    const valence = outcome.valence || determineOutcomeValence(outcome.description);
    
    // Determine magnitude if not specified (1-10 scale)
    const magnitude = outcome.magnitude || determineOutcomeMagnitude(outcome.description, valence);
    
    // Calculate alignment with expected outcomes
    const alignment = calculateOutcomeAlignment(outcome.description, expectedOutcomes);
    
    return {
      description: outcome.description,
      valence,
      magnitude,
      alignment
    };
  });
}

/**
 * Determine valence of outcome based on description
 */
function determineOutcomeValence(description: string): 'positive' | 'negative' | 'neutral' | 'mixed' {
  // Count positive and negative signal words
  const positiveSignals = [
    'success', 'improve', 'exceed', 'achieve', 'benefit', 
    'gain', 'advantage', 'progress', 'growth', 'positive'
  ];
  
  const negativeSignals = [
    'fail', 'decline', 'below', 'miss', 'challenge', 
    'problem', 'issue', 'negative', 'loss', 'decrease'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  const descriptionLower = description.toLowerCase();
  
  for (const signal of positiveSignals) {
    if (descriptionLower.includes(signal)) {
      positiveCount++;
    }
  }
  
  for (const signal of negativeSignals) {
    if (descriptionLower.includes(signal)) {
      negativeCount++;
    }
  }
  
  // Determine valence based on signal counts
  if (positiveCount > 0 && negativeCount > 0) {
    return 'mixed';
  } else if (positiveCount > 0) {
    return 'positive';
  } else if (negativeCount > 0) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

/**
 * Determine magnitude of outcome based on description and valence
 */
function determineOutcomeMagnitude(
  description: string, 
  valence: 'positive' | 'negative' | 'neutral' | 'mixed'
): number {
  // Default moderate magnitude
  let magnitude = 5;
  
  // Intensity signal words
  const highIntensitySignals = [
    'significant', 'dramatic', 'substantial', 'major', 'critical',
    'exceptional', 'extraordinary', 'remarkable', 'tremendous', 'extreme'
  ];
  
  const moderateIntensitySignals = [
    'moderate', 'modest', 'reasonable', 'adequate', 'fair',
    'partial', 'limited', 'some', 'certain', 'several'
  ];
  
  const lowIntensitySignals = [
    'minor', 'minimal', 'slight', 'small', 'marginal',
    'negligible', 'trivial', 'insignificant', 'inconsequential', 'little'
  ];
  
  const descriptionLower = description.toLowerCase();
  
  // Check for intensity signals
  for (const signal of highIntensitySignals) {
    if (descriptionLower.includes(signal)) {
      magnitude += 3;
      break;
    }
  }
  
  for (const signal of moderateIntensitySignals) {
    if (descriptionLower.includes(signal)) {
      magnitude += 0; // No change for moderate
      break;
    }
  }
  
  for (const signal of lowIntensitySignals) {
    if (descriptionLower.includes(signal)) {
      magnitude -= 3;
      break;
    }
  }
  
  // Adjust magnitude based on valence
  if (valence === 'mixed') {
    magnitude = 5; // Reset to moderate for mixed
  } else if (valence === 'neutral') {
    magnitude = 3; // Lower for neutral
  }
  
  // Ensure magnitude stays within 1-10 range
  return Math.max(1, Math.min(10, magnitude));
}

/**
 * Calculate alignment between actual outcome and expected outcomes
 */
function calculateOutcomeAlignment(
  actualOutcomeDescription: string,
  expectedOutcomes: string[]
): number {
  if (!expectedOutcomes || expectedOutcomes.length === 0) {
    return 0.5; // Default moderate alignment if no expected outcomes
  }
  
  // Calculate similarity scores with each expected outcome
  const similarityScores = expectedOutcomes.map(expected => {
    return calculateTextSimilarity(actualOutcomeDescription, expected);
  });
  
  // Use highest similarity as alignment score
  return Math.max(...similarityScores);
}

/**
 * Calculate simple text similarity score
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  // Convert to lowercase for comparison
  const t1 = text1.toLowerCase();
  const t2 = text2.toLowerCase();
  
  // Split into words
  const words1 = t1.split(/\s+/);
  const words2 = t2.split(/\s+/);
  
  // Count matching words
  let matchCount = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) { // Only count substantial words
      matchCount++;
    }
  }
  
  // Calculate similarity as proportion of matching words
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  return totalUniqueWords > 0 ? matchCount / totalUniqueWords : 0;
}

/**
 * Evaluate overall decision effectiveness
 */
function evaluateDecisionEffectiveness(
  originalDecision: {
    description: string;
    expectedOutcomes: string[];
    assumptions: string[];
    alternatives: string[];
  },
  actualOutcomes: Array<{
    description: string;
    valence: 'positive' | 'negative' | 'neutral' | 'mixed';
    magnitude: number;
    alignment: number;
  }>,
  objectives: string[]
): {
  overall: number;
  byObjective: Record<string, number>;
  opportunity: number;
  resourceUse: number;
} {
  // Calculate overall effectiveness based on outcome alignment and valence
  let overallScore = 0;
  let totalWeight = 0;
  
  for (const outcome of actualOutcomes) {
    let outcomeValue = outcome.alignment;
    
    // Adjust for valence (positive outcomes contribute more to effectiveness)
    if (outcome.valence === 'positive') {
      outcomeValue *= 1.2;
    } else if (outcome.valence === 'negative') {
      outcomeValue *= 0.8;
    }
    
    // Weight by magnitude
    const weight = outcome.magnitude / 10;
    overallScore += outcomeValue * weight;
    totalWeight += weight;
  }
  
  // Normalize overall score
  const overall = totalWeight > 0 ? Math.min(1, overallScore / totalWeight) : 0.5;
  
  // Effectiveness by objective (simplified)
  const byObjective: Record<string, number> = {};
  
  for (const objective of objectives) {
    // Find outcomes related to this objective
    const relatedOutcomes = actualOutcomes.filter(outcome => 
      calculateTextSimilarity(outcome.description, objective) > 0.3
    );
    
    if (relatedOutcomes.length > 0) {
      // Calculate average effectiveness for this objective
      const objectiveScore = relatedOutcomes.reduce(
        (sum, outcome) => sum + (outcome.alignment * (outcome.valence === 'positive' ? 1.2 : 
                                                    outcome.valence === 'negative' ? 0.8 : 1.0)),
        0
      ) / relatedOutcomes.length;
      
      byObjective[objective] = Math.min(1, objectiveScore);
    } else {
      byObjective[objective] = 0.5; // Default if no related outcomes
    }
  }
  
  // Opportunity utilization (how well positive opportunities were leveraged)
  // Higher for positive outcomes with high magnitude and low expected alignment
  let opportunityScore = 0;
  const positiveOutcomes = actualOutcomes.filter(o => o.valence === 'positive');
  
  if (positiveOutcomes.length > 0) {
    opportunityScore = positiveOutcomes.reduce(
      (sum, outcome) => sum + (outcome.magnitude / 10) * (1 - outcome.alignment),
      0
    ) / positiveOutcomes.length;
    
    // Normalize opportunity score
    opportunityScore = Math.min(1, opportunityScore * 2);
  } else {
    opportunityScore = 0.3; // Low opportunity utilization if no positive outcomes
  }
  
  // Resource use efficiency (simplified)
  // Higher if more positive outcomes achieved than alternatives would likely provide
  const resourceUse = 0.7; // Default moderate efficiency
  
  return {
    overall,
    byObjective,
    opportunity: opportunityScore,
    resourceUse
  };
}

/**
 * Extract lessons learned from review
 */
function extractLessonsLearned(
  originalDecision: {
    description: string;
    expectedOutcomes: string[];
    assumptions: string[];
    alternatives: string[];
  },
  actualOutcomes: Array<{
    description: string;
    valence: 'positive' | 'negative' | 'neutral' | 'mixed';
    magnitude: number;
    alignment: number;
  }>,
  context: {
    domain: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
  }
): Array<{
  insight: string;
  confidence: number;
  applicability: 'specific' | 'generalizable' | 'universal';
  actionableSteps: string[];
}> {
  const lessons: Array<{
    insight: string;
    confidence: number;
    applicability: 'specific' | 'generalizable' | 'universal';
    actionableSteps: string[];
  }> = [];
  
  // 1. Lesson from expectations vs. reality gap
  const lowAlignmentOutcomes = actualOutcomes.filter(o => o.alignment < 0.5);
  if (lowAlignmentOutcomes.length > 0) {
    const exampleOutcome = lowAlignmentOutcomes[0];
    
    lessons.push({
      insight: `Expectation-reality gap evident in "${exampleOutcome.description}" suggests need for improved forecasting models`,
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
      insight: `Critical assumptions about ${originalDecision.assumptions[0]} required testing earlier in process`,
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
  const unexpectedPositives = actualOutcomes.filter(o => 
    o.valence === 'positive' && o.alignment < 0.4
  );
  
  if (unexpectedPositives.length > 0) {
    lessons.push({
      insight: `Unexpected positive outcomes reveal opportunity blind spots in planning process`,
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
      insight: `Impact of "${context.constraints[0]}" constraint was greater than anticipated`,
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
    insight: `${context.domain} domain requires more specialized approach than was utilized`,
    confidence: 0.6,
    applicability: 'specific',
    actionableSteps: [
      `Engage deeper domain expertise in ${context.domain}`,
      "Develop domain-specific decision frameworks",
      "Create knowledge repository of domain patterns"
    ]
  });
  
  return lessons;
}

/**
 * Identify systemic patterns from review
 */
function identifySystemicPatterns(
  actualOutcomes: Array<{
    description: string;
    valence: 'positive' | 'negative' | 'neutral' | 'mixed';
    magnitude: number;
    alignment: number;
  }>,
  observedPatterns: string[]
): Array<{
  pattern: string;
  frequency: number;
  impact: number;
  intervention: string;
}> {
  const patterns: Array<{
    pattern: string;
    frequency: number;
    impact: number;
    intervention: string;
  }> = [];
  
  // 1. Add explicitly observed patterns
  for (const pattern of observedPatterns) {
    patterns.push({
      pattern,
      frequency: 0.7, // Default high frequency for explicitly observed
      impact: 7, // Default high impact
      intervention: generateInterventionForPattern(pattern)
    });
  }
  
  // 2. Pattern from outcome alignment
  const alignmentScores = actualOutcomes.map(o => o.alignment);
  const avgAlignment = alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length;
  
  if (avgAlignment < 0.5) {
    patterns.push({
      pattern: "Chronic expectation-reality gap in outcomes",
      frequency: 0.8,
      impact: 8,
      intervention: "Implement systematic expectation calibration process with explicit feedback loops"
    });
  }
  
  // 3. Pattern from outcome valence distribution
  const valences = actualOutcomes.map(o => o.valence);
  const negativeCount = valences.filter(v => v === 'negative').length;
  const positiveCount = valences.filter(v => v === 'positive').length;
  
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
  const magnitudes = actualOutcomes.map(o => o.magnitude);
  const highMagnitudeCount = magnitudes.filter(m => m >= 8).length;
  
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
function generateInterventionForPattern(pattern: string): string {
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
function generateRecalibrationGuidance(
  lessonsLearned: Array<{
    insight: string;
    confidence: number;
    applicability: 'specific' | 'generalizable' | 'universal';
    actionableSteps: string[];
  }>,
  systemicPatterns: Array<{
    pattern: string;
    frequency: number;
    impact: number;
    intervention: string;
  }>,
  decisionEffectiveness: {
    overall: number;
    byObjective: Record<string, number>;
    opportunity: number;
    resourceUse: number;
  }
): {
  mentalModels: string[];
  processAdjustments: string[];
  structuralChanges: string[];
} {
  const mentalModels: string[] = [];
  const processAdjustments: string[] = [];
  const structuralChanges: string[] = [];
  
  // 1. Mental model adjustments from lessons and patterns
  
  // From high confidence lessons
  const highConfidenceLessons = lessonsLearned.filter(l => l.confidence > 0.7);
  for (const lesson of highConfidenceLessons) {
    mentalModels.push(`Recalibrate thinking: ${lesson.insight}`);
  }
  
  // From high impact patterns
  const highImpactPatterns = systemicPatterns.filter(p => p.impact > 7);
  for (const pattern of highImpactPatterns) {
    mentalModels.push(`Shift mental model to recognize "${pattern.pattern}" as systemic rather than situational`);
  }
  
  // 2. Process adjustments
  
  // From lessons
  for (const lesson of lessonsLearned) {
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
  for (const pattern of systemicPatterns) {
    processAdjustments.push(pattern.intervention);
  }
  
  // 3. Structural changes
  
  // Based on overall effectiveness
  if (decisionEffectiveness.overall < 0.6) {
    structuralChanges.push("Restructure decision authority framework to improve outcome alignment");
  }
  
  // Based on objective effectiveness
  const lowPerformingObjectives = Object.entries(decisionEffectiveness.byObjective)
    .filter(([_, score]) => score < 0.5)
    .map(([objective, _]) => objective);
    
  if (lowPerformingObjectives.length > 0) {
    structuralChanges.push(`Redesign objective management approach for: ${lowPerformingObjectives.join(', ')}`);
  }
  
  // Based on systemic patterns
  const criticalPatterns = systemicPatterns.filter(p => p.impact * p.frequency > 0.5);
  if (criticalPatterns.length > 1) {
    structuralChanges.push("Implement pattern recognition and response system into organizational structure");
  }
  
  return {
    mentalModels,
    processAdjustments,
    structuralChanges
  };
}

/**
 * Generate insights for Meta-Void Review
 */
function generateReviewInsights(
  subject: string,
  originalDecision: {
    description: string;
    expectedOutcomes: string[];
    assumptions: string[];
    alternatives: string[];
  },
  actualOutcomes: Array<{
    description: string;
    valence: 'positive' | 'negative' | 'neutral' | 'mixed';
    magnitude: number;
    alignment: number;
  }>,
  lessonsLearned: Array<{
    insight: string;
    confidence: number;
    applicability: 'specific' | 'generalizable' | 'universal';
    actionableSteps: string[];
  }>,
  systemicPatterns: Array<{
    pattern: string;
    frequency: number;
    impact: number;
    intervention: string;
  }>
): string[] {
  const insights: string[] = [];
  
  // Calculate key metrics for insights
  const avgAlignment = actualOutcomes.reduce((sum, o) => sum + o.alignment, 0) / actualOutcomes.length;
  const positiveOutcomes = actualOutcomes.filter(o => o.valence === 'positive');
  const negativeOutcomes = actualOutcomes.filter(o => o.valence === 'negative');
  const positiveRatio = positiveOutcomes.length / actualOutcomes.length;
  
  // 1. Outcome alignment insight
  if (avgAlignment > 0.7) {
    insights.push(`High outcome alignment (${(avgAlignment * 100).toFixed(0)}%) indicates effective prediction capacity despite complexity.`);
  } else if (avgAlignment > 0.4) {
    insights.push(`Moderate outcome alignment (${(avgAlignment * 100).toFixed(0)}%) suggests reasonable prediction capacity with specific blind spots.`);
  } else {
    insights.push(`Low outcome alignment (${(avgAlignment * 100).toFixed(0)}%) reveals significant expectation-reality gaps requiring fundamental recalibration.`);
  }
  
  // 2. Outcome valence insight
  if (positiveRatio > 0.7) {
    insights.push(`Strong positive outcome bias (${(positiveRatio * 100).toFixed(0)}%) suggests either exceptional execution or evaluation criteria issues.`);
  } else if (positiveRatio < 0.3) {
    insights.push(`Negative outcome dominance (${((1-positiveRatio) * 100).toFixed(0)}%) indicates execution challenges or overly optimistic initial expectations.`);
  } else {
    insights.push(`Balanced outcome distribution suggests realistic assessment approach capturing both successes and challenges.`);
  }
  
  // 3. Systemic pattern insight
  if (systemicPatterns.length > 2) {
    insights.push(`Multiple systemic patterns (${systemicPatterns.length}) identified, suggesting opportunity for structural rather than incremental improvement.`);
  }
  
  // 4. Lesson applicability insight
  const generalizableLessons = lessonsLearned.filter(l => l.applicability === 'generalizable' || l.applicability === 'universal');
  if (generalizableLessons.length > 0) {
    insights.push(`${generalizableLessons.length} generalizable lessons identified, creating potential value beyond this specific decision context.`);
  }
  
  // 5. Assumption insight
  if (originalDecision.assumptions && originalDecision.assumptions.length > 0) {
    insights.push(`Key assumptions about ${originalDecision.assumptions[0]} influenced outcome trajectory, demonstrating the critical role of assumption validation.`);
  }
  
  return insights;
}

/**
 * Generate recommendations for Meta-Void Review
 */
function generateReviewRecommendations(
  decisionEffectiveness: {
    overall: number;
    byObjective: Record<string, number>;
    opportunity: number;
    resourceUse: number;
  },
  lessonsLearned: Array<{
    insight: string;
    confidence: number;
    applicability: 'specific' | 'generalizable' | 'universal';
    actionableSteps: string[];
  }>,
  recalibrationGuidance: {
    mentalModels: string[];
    processAdjustments: string[];
    structuralChanges: string[];
  }
): string[] {
  const recommendations: string[] = [];
  
  // 1. Effectiveness-based recommendation
  if (decisionEffectiveness.overall < 0.5) {
    recommendations.push(`Conduct comprehensive decision process review to address significant effectiveness gap (${(decisionEffectiveness.overall * 100).toFixed(0)}%).`);
  } else if (decisionEffectiveness.overall < 0.7) {
    recommendations.push(`Implement targeted improvements to decision process to increase overall effectiveness (currently ${(decisionEffectiveness.overall * 100).toFixed(0)}%).`);
  } else {
    recommendations.push(`Document successful decision patterns to replicate high effectiveness (${(decisionEffectiveness.overall * 100).toFixed(0)}%) in future scenarios.`);
  }
  
  // 2. Opportunity-based recommendation
  if (decisionEffectiveness.opportunity < 0.4) {
    recommendations.push(`Develop opportunity identification capability to address low opportunity utilization (${(decisionEffectiveness.opportunity * 100).toFixed(0)}%).`);
  }
  
  // 3. Resource-based recommendation
  if (decisionEffectiveness.resourceUse < 0.6) {
    recommendations.push(`Optimize resource allocation processes to improve efficiency (currently ${(decisionEffectiveness.resourceUse * 100).toFixed(0)}%).`);
  }
  
  // 4. Lesson-based recommendations
  const highConfidenceLessons = lessonsLearned
    .filter(l => l.confidence > 0.7)
    .sort((a, b) => b.confidence - a.confidence);
    
  if (highConfidenceLessons.length > 0) {
    // Add actionable steps from highest confidence lesson
    const topLesson = highConfidenceLessons[0];
    if (topLesson.actionableSteps.length > 0) {
      recommendations.push(`Implement key lesson: ${topLesson.actionableSteps[0]}`);
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