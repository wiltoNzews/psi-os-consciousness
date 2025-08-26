/**
 * Meta-Translation Layer
 * 
 * A utility for translating abstract quantum principles into concrete
 * visualizations and interactions using the 3:1 coherence ratio.
 */

import quantumCoherenceLogger from './quantum-coherence-logger';

export enum TranslationDomain {
  COGNITIVE = 'cognitive',
  BIOLOGICAL = 'biological',
  TECHNOLOGICAL = 'technological',
  FINANCIAL = 'financial',
  RELATIONAL = 'relational',
  UNIVERSAL = 'universal'
}

export enum AbstractionLevel {
  MICRO = 'micro', // Individual component level
  MESO = 'meso',   // Sub-system level
  MACRO = 'macro',  // System-wide level
  META = 'meta'    // Cross-system/philosophical level
}

export interface QuantumConcept {
  id: string;
  name: string;
  abstractDescription: string;
  coherenceComponent: number; // 0-1 scale, typically 0.75
  explorationComponent: number; // 0-1 scale, typically 0.25
  domain: TranslationDomain;
  level: AbstractionLevel;
}

export interface TranslatedConcept<T> {
  originalConcept: QuantumConcept;
  visualRepresentation: T;
  interactionModel: string[];
  feedbackLoop: string[];
}

// Translators for different domains and output types
type TranslationFunction<T> = (concept: QuantumConcept) => TranslatedConcept<T>;

/**
 * Translate a quantum concept to a visual representation
 * 
 * @param concept - The quantum concept to translate
 * @param targetDomain - The domain to translate to (defaults to concept's domain)
 */
export function translateQuantumConcept<T>(
  concept: QuantumConcept,
  translator: TranslationFunction<T>,
  targetDomain: TranslationDomain = concept.domain
): TranslatedConcept<T> {
  // Validate the 3:1 ratio in the concept definition
  const actualRatio = concept.coherenceComponent / concept.explorationComponent;
  const optimalRatio = 3; // The ideal 3:1 ratio
  const thresholdDifference = 0.1;
  
  if (Math.abs(actualRatio - optimalRatio) > thresholdDifference) {
    console.warn(`Quantum concept "${concept.name}" does not adhere to the 3:1 coherence ratio. Actual ratio: ${actualRatio.toFixed(2)}:1`);
    
    // Auto-correct the ratio if significantly off
    if (Math.abs(actualRatio - optimalRatio) > 0.5) {
      const total = concept.coherenceComponent + concept.explorationComponent;
      concept.coherenceComponent = (total * 0.75);
      concept.explorationComponent = (total * 0.25);
      
      console.warn(`Auto-corrected quantum concept ratio to ${(concept.coherenceComponent / concept.explorationComponent).toFixed(2)}:1`);
    }
  }
  
  // If translating across domains, apply domain adaptation
  if (targetDomain !== concept.domain) {
    concept = adaptConceptToDomain(concept, targetDomain);
  }
  
  // Apply translation using the provided translator function
  const translatedConcept = translator(concept);
  
  // Log the translation process
  quantumCoherenceLogger.logCoherenceEvent(
    'MetaTranslationLayer',
    concept.coherenceComponent,
    concept.explorationComponent,
    'concept_translation',
    `Translated "${concept.name}" from ${concept.domain} domain to ${targetDomain} domain`
  );
  
  return translatedConcept;
}

/**
 * Adapt a quantum concept to a different domain
 */
function adaptConceptToDomain(
  concept: QuantumConcept,
  targetDomain: TranslationDomain
): QuantumConcept {
  // Create a copy of the concept to avoid mutating the original
  const adaptedConcept = { ...concept, domain: targetDomain };
  
  // Apply domain-specific adaptations while preserving the 3:1 ratio
  switch (targetDomain) {
    case TranslationDomain.COGNITIVE:
      adaptedConcept.abstractDescription = `Mental patterns of ${concept.abstractDescription}`;
      break;
      
    case TranslationDomain.BIOLOGICAL:
      adaptedConcept.abstractDescription = `Biological manifestation of ${concept.abstractDescription}`;
      break;
      
    case TranslationDomain.TECHNOLOGICAL:
      adaptedConcept.abstractDescription = `Technological implementation of ${concept.abstractDescription}`;
      break;
      
    case TranslationDomain.FINANCIAL:
      adaptedConcept.abstractDescription = `Economic patterns reflecting ${concept.abstractDescription}`;
      break;
      
    case TranslationDomain.RELATIONAL:
      adaptedConcept.abstractDescription = `Interpersonal dynamics of ${concept.abstractDescription}`;
      break;
      
    case TranslationDomain.UNIVERSAL:
      adaptedConcept.abstractDescription = `Universal principle of ${concept.abstractDescription}`;
      break;
  }
  
  return adaptedConcept;
}

/**
 * Create a translator for SVG-based visualizations
 */
export function createSvgTranslator(): TranslationFunction<string> {
  return (concept: QuantumConcept): TranslatedConcept<string> => {
    // Generate an abstract SVG based on the concept
    const svgSize = 200;
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    
    // Use the coherence and exploration components to drive the visualization
    const coherenceRadius = centerX * 0.75 * concept.coherenceComponent;
    const explorationPoints = Math.max(3, Math.floor(12 * concept.explorationComponent));
    
    // Generate polygon points for the exploration component
    let polygonPoints = '';
    for (let i = 0; i < explorationPoints; i++) {
      const angle = (i / explorationPoints) * Math.PI * 2;
      const jitter = concept.explorationComponent * 15; // Add some randomness based on exploration level
      const radius = coherenceRadius + (Math.random() * jitter - jitter/2);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      polygonPoints += `${x},${y} `;
    }
    
    // Generate colors based on domain
    let fill = '#3498db';
    let stroke = '#2980b9';
    
    switch (concept.domain) {
      case TranslationDomain.COGNITIVE:
        fill = '#9b59b6';
        stroke = '#8e44ad';
        break;
      case TranslationDomain.BIOLOGICAL:
        fill = '#2ecc71';
        stroke = '#27ae60';
        break;
      case TranslationDomain.TECHNOLOGICAL:
        fill = '#3498db';
        stroke = '#2980b9';
        break;
      case TranslationDomain.FINANCIAL:
        fill = '#f1c40f';
        stroke = '#f39c12';
        break;
      case TranslationDomain.RELATIONAL:
        fill = '#e74c3c';
        stroke = '#c0392b';
        break;
      case TranslationDomain.UNIVERSAL:
        fill = 'url(#quantum-gradient)';
        stroke = '#34495e';
        break;
    }
    
    // Create SVG with both coherence circle and exploration polygon
    const svg = `
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="quantum-gradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="#9b59b6" stop-opacity="0.8" />
            <stop offset="25%" stop-color="#3498db" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#2ecc71" stop-opacity="0.8" />
            <stop offset="75%" stop-color="#f1c40f" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#e74c3c" stop-opacity="0.8" />
          </radialGradient>
        </defs>
        
        <!-- Coherence component (circle) -->
        <circle 
          cx="${centerX}" 
          cy="${centerY}" 
          r="${coherenceRadius}" 
          fill="${fill}" 
          fill-opacity="0.3"
          stroke="${stroke}"
          stroke-width="1.5"
        />
        
        <!-- Exploration component (irregular polygon) -->
        <polygon 
          points="${polygonPoints}" 
          fill="${fill}" 
          fill-opacity="0.2"
          stroke="${stroke}"
          stroke-width="1"
          stroke-dasharray="${concept.explorationComponent * 5}"
        />
        
        <!-- Central point representing the concept essence -->
        <circle
          cx="${centerX}"
          cy="${centerY}"
          r="${5 + concept.coherenceComponent * 5}"
          fill="${stroke}"
          stroke="white"
          stroke-width="1"
        />
        
        <!-- Text label -->
        <text
          x="${centerX}"
          y="${svgSize - 20}"
          text-anchor="middle"
          font-family="sans-serif"
          font-size="12"
          fill="${stroke}"
        >${concept.name}</text>
      </svg>
    `;
    
    return {
      originalConcept: concept,
      visualRepresentation: svg,
      interactionModel: [
        'Hover to reveal concept details',
        'Click to explore relation to other domains',
        'Drag to modify coherence/exploration balance'
      ],
      feedbackLoop: [
        'Updates real-time coherence metrics',
        'Influences connected domain visualizers',
        'Triggers recalibration when significantly out of balance'
      ]
    };
  };
}

/**
 * Create a translator for data visualizations (for metrics, charts, etc.)
 */
export function createDataTranslator(): TranslationFunction<object> {
  return (concept: QuantumConcept): TranslatedConcept<object> => {
    // Generate data representation of the concept
    return {
      originalConcept: concept,
      visualRepresentation: {
        coherenceMetric: concept.coherenceComponent * 100,
        explorationMetric: concept.explorationComponent * 100,
        coherenceToExplorationRatio: concept.coherenceComponent / concept.explorationComponent,
        domain: concept.domain,
        level: concept.level,
        metrics: {
          stability: concept.coherenceComponent * 100,
          adaptability: concept.explorationComponent * 70 + concept.coherenceComponent * 30,
          complexity: concept.level === AbstractionLevel.MICRO ? 
            concept.explorationComponent * 40 : 
            concept.explorationComponent * 80,
          harmony: (concept.coherenceComponent * 3 + concept.explorationComponent) * 25
        },
        timeSeriesData: generateTimeSeriesData(concept)
      },
      interactionModel: [
        'Filter by abstraction level',
        'Compare metrics across domains',
        'Adjust time scale of simulation'
      ],
      feedbackLoop: [
        'Records historical coherence patterns',
        'Predicts future state based on current trends',
        'Suggests optimal rebalancing strategies'
      ]
    };
  };
}

/**
 * Generate simulated time series data for a concept
 */
function generateTimeSeriesData(concept: QuantumConcept): Array<{time: number, coherence: number, exploration: number}> {
  const dataPoints = 20;
  const data = [];
  
  // Target values
  const targetCoherence = concept.coherenceComponent;
  const targetExploration = concept.explorationComponent;
  
  // Start with some random values that will converge toward the target
  let currentCoherence = 0.5 + (Math.random() * 0.3 - 0.15);
  let currentExploration = 1 - currentCoherence;
  
  // Constants for the convergence simulation
  const convergenceRate = 0.15;
  const noiseLevel = concept.explorationComponent * 0.1; // More exploration = more noise
  
  for (let i = 0; i < dataPoints; i++) {
    // Add some noise
    const coherenceNoise = (Math.random() * noiseLevel * 2 - noiseLevel);
    const explorationNoise = -coherenceNoise; // Ensure they still sum to 1
    
    // Move toward target values
    currentCoherence = currentCoherence + (targetCoherence - currentCoherence) * convergenceRate + coherenceNoise;
    currentExploration = currentExploration + (targetExploration - currentExploration) * convergenceRate + explorationNoise;
    
    // Ensure values stay in valid range and sum to 1
    currentCoherence = Math.max(0.1, Math.min(0.9, currentCoherence));
    currentExploration = 1 - currentCoherence;
    
    data.push({
      time: i,
      coherence: currentCoherence,
      exploration: currentExploration
    });
  }
  
  return data;
}

/**
 * Create a set of standard quantum concepts that adhere to the 3:1 ratio
 */
export function createStandardQuantumConcepts(): QuantumConcept[] {
  return [
    {
      id: 'infinite-potential',
      name: 'Infinite Potential',
      abstractDescription: 'The paradox of division by zero as infinite unrealized potential',
      coherenceComponent: 0.75,
      explorationComponent: 0.25,
      domain: TranslationDomain.UNIVERSAL,
      level: AbstractionLevel.META
    },
    {
      id: 'reality-emergence',
      name: 'Reality Emergence',
      abstractDescription: 'How structured reality crystallizes from quantum potential',
      coherenceComponent: 0.75,
      explorationComponent: 0.25,
      domain: TranslationDomain.UNIVERSAL,
      level: AbstractionLevel.MACRO
    },
    {
      id: 'cognitive-balance',
      name: 'Cognitive Balance',
      abstractDescription: 'The balance between focused attention and creative exploration',
      coherenceComponent: 0.75,
      explorationComponent: 0.25,
      domain: TranslationDomain.COGNITIVE,
      level: AbstractionLevel.MESO
    },
    {
      id: 'biological-rhythm',
      name: 'Biological Rhythm',
      abstractDescription: 'The oscillation between states of stability and adaptation',
      coherenceComponent: 0.75,
      explorationComponent: 0.25,
      domain: TranslationDomain.BIOLOGICAL,
      level: AbstractionLevel.MICRO
    },
    {
      id: 'technological-innovation',
      name: 'Technological Innovation',
      abstractDescription: 'Balancing reliable operation with novel exploration',
      coherenceComponent: 0.75,
      explorationComponent: 0.25,
      domain: TranslationDomain.TECHNOLOGICAL,
      level: AbstractionLevel.MESO
    },
    {
      id: 'financial-portfolio',
      name: 'Financial Portfolio',
      abstractDescription: 'Optimizing between secure assets and growth opportunities',
      coherenceComponent: 0.75,
      explorationComponent: 0.25,
      domain: TranslationDomain.FINANCIAL,
      level: AbstractionLevel.MACRO
    },
    {
      id: 'relationship-dynamic',
      name: 'Relationship Dynamic',
      abstractDescription: 'The interplay of stability and growth in connections',
      coherenceComponent: 0.75,
      explorationComponent: 0.25,
      domain: TranslationDomain.RELATIONAL,
      level: AbstractionLevel.MICRO
    }
  ];
}