/**
 * Emoji Quantum Mapper
 * 
 * This utility provides functions for mapping emojis to quantum concepts,
 * calculating resonance, and determining Quantum Coherence Transfer Function (QCTF) metrics.
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

// Define the dimensional markers and their weights
export enum DimensionalMarker {
  REALITY = 'REALITY',
  META = 'META',
  QUANTUM = 'QUANTUM',
  DIAGONAL = 'DIAGONAL'
}

// Mapping of dimensional markers to their coherence contributions
export const DimensionalCoherence: Record<DimensionalMarker, number> = {
  [DimensionalMarker.REALITY]: 0.15, // 15% of coherence
  [DimensionalMarker.META]: 0.15,    // 15% of coherence
  [DimensionalMarker.QUANTUM]: 0.35, // 35% of coherence
  [DimensionalMarker.DIAGONAL]: 0.35 // 35% of coherence
};

// Emoji categories and their quantum significance
export enum EmojiCategory {
  PORTAL = 'PORTAL',
  SPAGHETTI = 'SPAGHETTI',
  ENERGY = 'ENERGY',
  CIRCLE = 'CIRCLE',
  DIRECTIONAL = 'DIRECTIONAL',
  COLOR = 'COLOR'
}

// Emoji mapping to categories
export const emojiMap: Record<string, EmojiCategory> = {
  '🌀': EmojiCategory.PORTAL,      // Quantum Portal
  '🕸️': EmojiCategory.SPAGHETTI,   // Quantum Spaghetti
  '⚡': EmojiCategory.ENERGY,       // Quantum Energy
  '⭕': EmojiCategory.CIRCLE,       // Quantum Circle
  '→': EmojiCategory.DIRECTIONAL,  // Right direction
  '←': EmojiCategory.DIRECTIONAL,  // Left direction
  '↑': EmojiCategory.DIRECTIONAL,  // Up direction
  '↓': EmojiCategory.DIRECTIONAL,  // Down direction
  '↗️': EmojiCategory.DIRECTIONAL, // Up-right direction
  '↘️': EmojiCategory.DIRECTIONAL, // Down-right direction
  '↙️': EmojiCategory.DIRECTIONAL, // Down-left direction
  '↖️': EmojiCategory.DIRECTIONAL, // Up-left direction
  '🔴': EmojiCategory.COLOR,       // Red (high energy)
  '🟠': EmojiCategory.COLOR,       // Orange (medium-high energy)
  '🟡': EmojiCategory.COLOR,       // Yellow (medium energy)
  '🟢': EmojiCategory.COLOR,       // Green (balanced energy)
  '🔵': EmojiCategory.COLOR,       // Blue (calm energy)
  '🟣': EmojiCategory.COLOR        // Purple (transformative energy)
};

// Emoji resonance values
export const emojiResonance: Record<EmojiCategory, number> = {
  [EmojiCategory.PORTAL]: 0.25,     // Creates dimensional transitions
  [EmojiCategory.SPAGHETTI]: 0.25,  // Represents complex, interconnected thought patterns
  [EmojiCategory.ENERGY]: 0.20,     // Signifies high-impact information
  [EmojiCategory.CIRCLE]: 0.15,     // Represents complete, self-contained concepts
  [EmojiCategory.DIRECTIONAL]: 0.10, // Shows flow and direction
  [EmojiCategory.COLOR]: 0.05       // Adds emotional or energy-state context
};

/**
 * Represents a message with dimensional markers and emojis
 */
export interface QuantumMessage {
  reality: string[];     // Reality dimension segments
  meta: string[];        // Meta dimension segments
  quantum: string[];     // Quantum dimension segments
  diagonal: string[];    // Diagonal dimension segments
  emojis: string[];      // Emojis used in the message
}

/**
 * Extracts dimensional segments from a message with dimensional markers
 * @param message The full message text
 * @returns A QuantumMessage object with extracted segments
 */
export function extractDimensionalSegments(message: string): QuantumMessage {
  const realityRegex = /\[REALITY\](.*?)(?=\[(META|QUANTUM|DIAGONAL)\]|$)/gs;
  const metaRegex = /\[META\](.*?)(?=\[(REALITY|QUANTUM|DIAGONAL)\]|$)/gs;
  const quantumRegex = /\[QUANTUM\](.*?)(?=\[(REALITY|META|DIAGONAL)\]|$)/gs;
  const diagonalRegex = /\[DIAGONAL\](.*?)(?=\[(REALITY|META|QUANTUM)\]|$)/gs;
  const emojiRegex = /[→←↑↓↗️↘️↙️↖️⭕🌀🕸️⚡🔴🟠🟡🟢🔵🟣]/gu;

  const reality = [...message.matchAll(realityRegex)].map(match => match[1].trim());
  const meta = [...message.matchAll(metaRegex)].map(match => match[1].trim());
  const quantum = [...message.matchAll(quantumRegex)].map(match => match[1].trim());
  const diagonal = [...message.matchAll(diagonalRegex)].map(match => match[1].trim());
  const emojis = [...message.matchAll(emojiRegex)].map(match => match[0]);

  return {
    reality,
    meta,
    quantum,
    diagonal,
    emojis
  };
}

/**
 * Calculates the dimensional balance score for a quantum message
 * A score of 1.0 means all dimensions are present and balanced according to the
 * optimal 70/30 chaos/structure ratio
 * @param message The quantum message
 * @returns A score between 0 and 1
 */
export function calculateDimensionalBalance(message: QuantumMessage): number {
  // Check if all dimensions have at least one segment
  const allDimensionsPresent = (
    message.reality.length > 0 &&
    message.meta.length > 0 &&
    message.quantum.length > 0 &&
    message.diagonal.length > 0
  );

  if (!allDimensionsPresent) {
    // Penalize missing dimensions
    const presentDimensions = [
      message.reality.length > 0,
      message.meta.length > 0,
      message.quantum.length > 0,
      message.diagonal.length > 0
    ].filter(Boolean).length;
    
    return presentDimensions / 4;
  }

  // Count segments in each dimension
  const realitySegments = message.reality.length;
  const metaSegments = message.meta.length;
  const quantumSegments = message.quantum.length;
  const diagonalSegments = message.diagonal.length;
  
  // Calculate total segments
  const totalSegments = realitySegments + metaSegments + quantumSegments + diagonalSegments;
  
  // Calculate actual ratios
  const structureRatio = (realitySegments + metaSegments) / totalSegments;
  const chaosRatio = (quantumSegments + diagonalSegments) / totalSegments;
  
  // Ideal ratios according to 70/30 principle
  const idealStructureRatio = 0.3;
  const idealChaosRatio = 0.7;
  
  // Calculate how close the actual ratios are to the ideal ratios
  const structureProximity = 1 - Math.abs(structureRatio - idealStructureRatio) / idealStructureRatio;
  const chaosProximity = 1 - Math.abs(chaosRatio - idealChaosRatio) / idealChaosRatio;
  
  // Average the two proximity scores
  return (structureProximity + chaosProximity) / 2;
}

/**
 * Calculates the emoji resonance score for a quantum message
 * @param message The quantum message
 * @returns A score between 0 and 1
 */
export function calculateEmojiResonance(message: QuantumMessage): number {
  if (message.emojis.length === 0) {
    return 0;
  }

  // Calculate total potential resonance from the emojis used
  let totalResonance = 0;
  
  for (const emoji of message.emojis) {
    const category = emojiMap[emoji];
    if (category) {
      totalResonance += emojiResonance[category];
    }
  }
  
  // Normalize to a 0-1 scale - if there are too many emojis, cap at 1
  return Math.min(totalResonance, 1);
}

/**
 * Calculates the Cross-Context Quantum Coherence (CCQC) score,
 * which measures how well the dimensional segments connect across dimensions
 * @param message The quantum message
 * @returns A score between 0 and 1
 */
export function calculateCCQC(message: QuantumMessage): number {
  // If missing any dimension, CCQC is reduced
  if (
    message.reality.length === 0 ||
    message.meta.length === 0 ||
    message.quantum.length === 0 ||
    message.diagonal.length === 0
  ) {
    return 0.5; // Baseline coherence when dimensions are missing
  }

  // Count directional emojis that connect dimensions
  const directionalEmojis = message.emojis.filter(emoji => 
    emojiMap[emoji] === EmojiCategory.DIRECTIONAL
  ).length;

  // Count transition emojis (portal, energy)
  const transitionEmojis = message.emojis.filter(emoji => 
    emojiMap[emoji] === EmojiCategory.PORTAL || 
    emojiMap[emoji] === EmojiCategory.ENERGY
  ).length;

  // Base coherence from having all dimensions
  const baseCCQC = 0.7;
  
  // Bonus for directional emojis - max bonus of 0.2
  const directionalBonus = Math.min(directionalEmojis * 0.05, 0.2);
  
  // Bonus for transition emojis - max bonus of 0.1
  const transitionBonus = Math.min(transitionEmojis * 0.05, 0.1);
  
  return Math.min(baseCCQC + directionalBonus + transitionBonus, 1);
}

/**
 * Calculates the chaos balance score based on the 70/30 principle
 * @param message The quantum message
 * @returns A score between 0 and 1
 */
export function calculateChaosBalanceScore(message: QuantumMessage): number {
  // Count segments in each dimension
  const realitySegments = message.reality.length;
  const metaSegments = message.meta.length;
  const quantumSegments = message.quantum.length;
  const diagonalSegments = message.diagonal.length;
  
  // Calculate total segments
  const totalSegments = realitySegments + metaSegments + quantumSegments + diagonalSegments;
  
  if (totalSegments === 0) {
    return 0;
  }
  
  // Calculate structure (reality + meta) and chaos (quantum + diagonal) ratios
  const structureRatio = (realitySegments + metaSegments) / totalSegments;
  const chaosRatio = (quantumSegments + diagonalSegments) / totalSegments;
  
  // Calculate proximity to ideal 70/30 ratio
  const idealChaosRatio = 0.7;
  const chaosProximity = 1 - Math.abs(chaosRatio - idealChaosRatio);
  
  return chaosProximity;
}

/**
 * Calculates the Quantum Coherence Transfer Function (QCTF) score
 * for a quantum message. This is the overall effectiveness of a message
 * within the protocol framework.
 * 
 * QCTF = (dimensionalBalance * 0.4) + (emojiResonance * 0.2) + 
 *        (ccqcImpact * 0.2) + (chaosBalanceScore * 0.2)
 * 
 * @param message The quantum message
 * @returns A score between 0 and 1
 */
export function calculateQCTF(message: QuantumMessage): number {
  const dimensionalBalance = calculateDimensionalBalance(message);
  const emojiResonance = calculateEmojiResonance(message);
  const ccqcImpact = calculateCCQC(message);
  const chaosBalanceScore = calculateChaosBalanceScore(message);
  
  return (
    (dimensionalBalance * 0.4) + 
    (emojiResonance * 0.2) + 
    (ccqcImpact * 0.2) + 
    (chaosBalanceScore * 0.2)
  );
}

/**
 * Generates a message analysis report
 * @param message The quantum message
 * @returns An object with analysis metrics
 */
export function analyzeQuantumMessage(message: QuantumMessage): {
  dimensionalBalance: number;
  emojiResonance: number;
  ccqc: number;
  chaosBalanceScore: number;
  qctf: number;
  chaosRatio: number;
  structureRatio: number;
} {
  const dimensionalBalance = calculateDimensionalBalance(message);
  const emojiResonance = calculateEmojiResonance(message);
  const ccqc = calculateCCQC(message);
  const chaosBalanceScore = calculateChaosBalanceScore(message);
  const qctf = calculateQCTF(message);
  
  // Calculate chaos and structure ratios
  const realitySegments = message.reality.length;
  const metaSegments = message.meta.length;
  const quantumSegments = message.quantum.length;
  const diagonalSegments = message.diagonal.length;
  const totalSegments = realitySegments + metaSegments + quantumSegments + diagonalSegments;
  
  const chaosRatio = totalSegments === 0 ? 0 : (quantumSegments + diagonalSegments) / totalSegments;
  const structureRatio = totalSegments === 0 ? 0 : (realitySegments + metaSegments) / totalSegments;
  
  return {
    dimensionalBalance,
    emojiResonance,
    ccqc,
    chaosBalanceScore,
    qctf,
    chaosRatio,
    structureRatio
  };
}

/**
 * Creates example dimensional messages for testing and demonstration
 */
export const quantumMessageExamples = {
  basic: `[REALITY] A simple example message
[META] Using all four dimensions
[QUANTUM] To demonstrate the structure
[DIAGONAL] And show cross-dimensional connections`,

  withEmojis: `[REALITY] A concrete implementation detail ⚡
[META] Using methodological approach →
[QUANTUM] Exploring creative possibilities 🌀
[DIAGONAL] Finding cross-domain patterns ⭕`,

  complex: `[REALITY] We need to implement WebSockets ⚡
[REALITY] The connection must be secure and reliable

[META] Using a state machine approach →
[META] With proper error handling 🕸️

[QUANTUM] What if we used quantum entanglement? 🌀
[QUANTUM] Or perhaps a neural network approach? 🟣

[DIAGONAL] Similar to how biological systems communicate ⭕
[DIAGONAL] Reminds me of axon-dendrite connections in neurons 🔵`
};

/**
 * Gets θ (theta) - the generative singularity point at the center of
 * the fractal matrix structure
 * @returns 0.5, the optimal equilibrium point
 */
export function getTheta(): number {
  return 0.5; // The perfect chaos/structure balance point
}

/**
 * QuantumEmoji interface representing quantum emoji properties
 */
export interface QuantumEmoji {
  symbol: string;
  name: string;
  category: string;
  description: string;
  resonanceImpact: number;
  phaseImpact: number;
  ccqcImpact: number;
}

/**
 * All quantum emojis used in the protocol
 */
export const ALL_QUANTUM_EMOJIS: QuantumEmoji[] = [
  // Core quantum emojis
  {
    symbol: '🌀',
    name: 'Quantum Vortex',
    category: 'core',
    description: 'Represents the quantum entanglement and non-linear flow of thought',
    resonanceImpact: 0.8,
    phaseImpact: 0.7,
    ccqcImpact: 0.9
  },
  {
    symbol: '⭕',
    name: 'Quantum Circle',
    category: 'core',
    description: 'Represents wholeness and unity in quantum thought patterns',
    resonanceImpact: 0.7,
    phaseImpact: 0.6,
    ccqcImpact: 0.7
  },
  {
    symbol: '⚡',
    name: 'Quantum Energy',
    category: 'core',
    description: 'Represents energy transfer between dimensional states',
    resonanceImpact: 0.9,
    phaseImpact: 0.8,
    ccqcImpact: 0.7
  },
  {
    symbol: '🕸️',
    name: 'Quantum Web',
    category: 'core',
    description: 'Represents interconnected networks of quantum probability',
    resonanceImpact: 0.75,
    phaseImpact: 0.65,
    ccqcImpact: 0.85
  },
  
  // Directional emojis
  {
    symbol: '→',
    name: 'Right Flow',
    category: 'directional',
    description: 'Linear progression along the x-axis of thought',
    resonanceImpact: 0.6,
    phaseImpact: 0.4,
    ccqcImpact: 0.5
  },
  {
    symbol: '←',
    name: 'Left Flow',
    category: 'directional',
    description: 'Reverse flow along the x-axis, often indicating retrospection',
    resonanceImpact: 0.6,
    phaseImpact: 0.4,
    ccqcImpact: 0.5
  },
  {
    symbol: '↑',
    name: 'Upward Flow',
    category: 'directional',
    description: 'Ascension along the y-axis, often signifying abstraction',
    resonanceImpact: 0.65,
    phaseImpact: 0.5,
    ccqcImpact: 0.55
  },
  {
    symbol: '↓',
    name: 'Downward Flow',
    category: 'directional',
    description: 'Descent along the y-axis, often signifying concretization',
    resonanceImpact: 0.65,
    phaseImpact: 0.5,
    ccqcImpact: 0.55
  },
  {
    symbol: '↗️',
    name: 'NE Diagonal',
    category: 'directional',
    description: 'Combined progression and abstraction',
    resonanceImpact: 0.7,
    phaseImpact: 0.6,
    ccqcImpact: 0.6
  },
  {
    symbol: '↘️',
    name: 'SE Diagonal',
    category: 'directional',
    description: 'Combined progression and concretization',
    resonanceImpact: 0.7,
    phaseImpact: 0.6,
    ccqcImpact: 0.6
  },
  {
    symbol: '↙️',
    name: 'SW Diagonal',
    category: 'directional',
    description: 'Combined retrospection and concretization',
    resonanceImpact: 0.7,
    phaseImpact: 0.6,
    ccqcImpact: 0.6
  },
  {
    symbol: '↖️',
    name: 'NW Diagonal',
    category: 'directional',
    description: 'Combined retrospection and abstraction',
    resonanceImpact: 0.7,
    phaseImpact: 0.6,
    ccqcImpact: 0.6
  },
  
  // Color markers
  {
    symbol: '🔴',
    name: 'Red Marker',
    category: 'color',
    description: 'Denotes high energy, warning, or critical importance',
    resonanceImpact: 0.8,
    phaseImpact: 0.7,
    ccqcImpact: 0.5
  },
  {
    symbol: '🟠',
    name: 'Orange Marker',
    category: 'color',
    description: 'Denotes creativity, transition, or moderate importance',
    resonanceImpact: 0.7,
    phaseImpact: 0.65,
    ccqcImpact: 0.55
  },
  {
    symbol: '🟡',
    name: 'Yellow Marker',
    category: 'color',
    description: 'Denotes insight, illumination, or mental clarity',
    resonanceImpact: 0.65,
    phaseImpact: 0.6,
    ccqcImpact: 0.6
  },
  {
    symbol: '🟢',
    name: 'Green Marker',
    category: 'color',
    description: 'Denotes growth, harmony, or positive development',
    resonanceImpact: 0.6,
    phaseImpact: 0.55,
    ccqcImpact: 0.65
  },
  {
    symbol: '🔵',
    name: 'Blue Marker',
    category: 'color',
    description: 'Denotes depth, calm, or logical thinking',
    resonanceImpact: 0.55,
    phaseImpact: 0.5,
    ccqcImpact: 0.7
  },
  {
    symbol: '🟣',
    name: 'Purple Marker',
    category: 'color',
    description: 'Denotes transformation, mystery, or quantum leaps',
    resonanceImpact: 0.75,
    phaseImpact: 0.8,
    ccqcImpact: 0.75
  }
];

/**
 * A static calculator utility for emoji resonance and message analysis
 */
export const EmojiResonanceCalculator = {
  /**
   * Calculate coherence score for a message
   */
  calculateMessageCoherence(messageText: string): number {
    const message = extractDimensionalSegments(messageText);
    return calculateDimensionalBalance(message);
  },
  
  /**
   * Evaluate chaos/structure balance for a message
   */
  evaluateChaosStructureBalance(messageText: string): number {
    const message = extractDimensionalSegments(messageText);
    return calculateChaosBalanceScore(message);
  },
  
  /**
   * Calculate QCTF for a message
   */
  calculateQCTF(messageText: string): number {
    const message = extractDimensionalSegments(messageText);
    return calculateQCTF(message);
  }
};