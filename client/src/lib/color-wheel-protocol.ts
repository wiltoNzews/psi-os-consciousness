/**
 * Color Wheel Protocol
 * 
 * Provides utilities for working with the Color Wheel Communication Protocol.
 * This protocol uses color to represent different communication states,
 * helping to standardize communication across the system.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

// Define all possible communication states
export type CommunicationState = 
  | 'convergent'  // Narrowing possibilities, reaching conclusions
  | 'divergent'   // Exploring possibilities, generating alternatives
  | 'clarity'     // Clear understanding, aligned communication
  | 'confusion'   // Ambiguity or misalignment in communication
  | 'overflow';   // Too much information, overwhelmed

// Array of all communication states
export const states: CommunicationState[] = [
  'convergent',
  'divergent',
  'clarity',
  'confusion',
  'overflow'
];

/**
 * Get the color for a specified communication state
 */
export function getColorForState(state: CommunicationState): string {
  switch (state) {
    case 'convergent': return '#10b981'; // Emerald 500
    case 'divergent': return '#8b5cf6';  // Violet 500
    case 'clarity': return '#3b82f6';    // Blue 500
    case 'confusion': return '#f97316';  // Orange 500
    case 'overflow': return '#ef4444';   // Red 500
    default: return '#6b7280';           // Gray 500
  }
}

/**
 * Get the background color for a specified communication state
 */
export function getBackgroundColorForState(state: CommunicationState): string {
  switch (state) {
    case 'convergent': return '#d1fae5'; // Emerald 100
    case 'divergent': return '#ede9fe';  // Violet 100
    case 'clarity': return '#dbeafe';    // Blue 100
    case 'confusion': return '#ffedd5';  // Orange 100
    case 'overflow': return '#fee2e2';   // Red 100
    default: return '#f3f4f6';           // Gray 100
  }
}

/**
 * Get the text color for a specified communication state
 */
export function getTextColorForState(state: CommunicationState): string {
  switch (state) {
    case 'convergent': return '#065f46'; // Emerald 800
    case 'divergent': return '#5b21b6';  // Violet 800
    case 'clarity': return '#1e40af';    // Blue 800
    case 'confusion': return '#9a3412';  // Orange 800
    case 'overflow': return '#b91c1c';   // Red 800
    default: return '#1f2937';           // Gray 800
  }
}

/**
 * Get the border color for a specified communication state
 */
export function getBorderColorForState(state: CommunicationState): string {
  switch (state) {
    case 'convergent': return '#34d399'; // Emerald 400
    case 'divergent': return '#a78bfa';  // Violet 400
    case 'clarity': return '#60a5fa';    // Blue 400
    case 'confusion': return '#fb923c';  // Orange 400
    case 'overflow': return '#f87171';   // Red 400
    default: return '#9ca3af';           // Gray 400
  }
}

/**
 * Determine the current communication state based on various metrics
 */
export function determineCommunicationState(
  messageCount: number,
  complexityScore: number,
  alignmentScore: number,
  contextualRelevance: number
): CommunicationState {
  // Overflow detection
  if (messageCount > 15 || complexityScore > 0.85) {
    return 'overflow';
  }
  
  // Confusion detection
  if (alignmentScore < 0.4 || contextualRelevance < 0.5) {
    return 'confusion';
  }
  
  // Clarity detection
  if (alignmentScore > 0.8 && contextualRelevance > 0.75) {
    return 'clarity';
  }
  
  // Convergent vs Divergent
  if (complexityScore < 0.4 && messageCount < 5) {
    return 'convergent';
  }
  
  return 'divergent';
}

/**
 * Get emoji for communication state
 */
export function getEmojiForState(state: CommunicationState): string {
  switch (state) {
    case 'convergent': return '✓';
    case 'divergent': return '↔';
    case 'clarity': return '💡';
    case 'confusion': return '❓';
    case 'overflow': return '⚠️';
    default: return '•';
  }
}

/**
 * Get description for communication state
 */
export function getDescriptionForState(state: CommunicationState): string {
  switch (state) {
    case 'convergent':
      return 'Communication is focused and productive';
    case 'divergent':
      return 'Exploring multiple possibilities';
    case 'clarity':
      return 'Clear understanding and alignment';
    case 'confusion':
      return 'Some misunderstandings present';
    case 'overflow':
      return 'Too much information, clarity lost';
    default:
      return 'System awaiting input';
  }
}

/**
 * Get the appropriate response strategy for a given communication state
 */
export function getResponseStrategyForState(state: CommunicationState): string {
  switch (state) {
    case 'convergent':
      return 'Focus on synthesis and concrete conclusions';
    case 'divergent':
      return 'Continue exploring alternatives and creative solutions';
    case 'clarity':
      return 'Maintain clear communication and build upon established understanding';
    case 'confusion':
      return 'Seek clarification, simplify explanations, and validate understanding';
    case 'overflow':
      return 'Slow down, prioritize information, and focus on key points only';
    default:
      return 'Maintain balanced communication';
  }
}

/**
 * Get the Flow Level category based on communication state
 */
export function getFlowLevelCategory(state: CommunicationState): string {
  switch (state) {
    case 'convergent':
    case 'clarity':
      return 'Stability';
    case 'divergent':
      return 'Adaptation';
    case 'confusion':
    case 'overflow':
      return 'Breakthrough';
    default:
      return 'Adaptation';
  }
}

/**
 * Get a rough Flow Level estimate based on communication state
 * Flow Level ranges from 0-8
 */
export function getFlowLevelEstimate(state: CommunicationState): number {
  switch (state) {
    case 'clarity': return 2;
    case 'convergent': return 1;
    case 'divergent': return 4;
    case 'confusion': return 6;
    case 'overflow': return 7;
    default: return 3;
  }
}

/**
 * Analyze the communication state of content based on text analysis
 * @param content The content to analyze
 * @returns The determined communication state and description
 */
export function analyzeContentState(content: string): { 
  state: CommunicationState, 
  description: string,
  recommendation?: string 
} {
  if (!content || content.trim().length === 0) {
    return { 
      state: 'clarity', 
      description: 'No content to analyze'
    };
  }

  // Count exclamation marks and question marks
  const exclamationCount = (content.match(/!/g) || []).length;
  const questionCount = (content.match(/\?/g) || []).length;
  
  // Check for special keywords that might indicate confusion
  const confusionKeywords = [
    'unclear', 'confused', 'confusing', 'ambiguous', 
    'misunderstanding', 'unsure', 'don\'t understand'
  ];
  const hasConfusionKeywords = confusionKeywords.some(
    keyword => content.toLowerCase().includes(keyword)
  );
  
  // Check for keywords that might indicate overwhelming information
  const overflowKeywords = [
    'too much', 'overwhelm', 'excessive', 'overloaded',
    'complicated', 'complex', 'difficult to follow'
  ];
  const hasOverflowKeywords = overflowKeywords.some(
    keyword => content.toLowerCase().includes(keyword)
  );
  
  // Check for clarity keywords
  const clarityKeywords = [
    'understand', 'clear', 'clarity', 'got it', 
    'makes sense', 'I see', 'straightforward'
  ];
  const hasClarityKeywords = clarityKeywords.some(
    keyword => content.toLowerCase().includes(keyword)
  );
  
  // Check for convergence keywords
  const convergenceKeywords = [
    'therefore', 'conclude', 'conclusion', 'finally',
    'in summary', 'to summarize', 'thus', 'result'
  ];
  const hasConvergenceKeywords = convergenceKeywords.some(
    keyword => content.toLowerCase().includes(keyword)
  );
  
  // Check for divergence keywords
  const divergenceKeywords = [
    'however', 'alternatively', 'on the other hand',
    'different approach', 'explore', 'possibility', 'consider'
  ];
  const hasDivergenceKeywords = divergenceKeywords.some(
    keyword => content.toLowerCase().includes(keyword)
  );

  // Determine state based on keyword analysis
  let state: CommunicationState = 'clarity'; // Default
  
  if (hasOverflowKeywords || (exclamationCount > 3 && content.length > 500)) {
    state = 'overflow';
  } else if (hasConfusionKeywords || questionCount > 3) {
    state = 'confusion';
  } else if (hasClarityKeywords && !hasConfusionKeywords) {
    state = 'clarity';
  } else if (hasConvergenceKeywords && !hasDivergenceKeywords) {
    state = 'convergent';
  } else if (hasDivergenceKeywords) {
    state = 'divergent';
  }
  
  return {
    state,
    description: getDescriptionForState(state),
    recommendation: getResponseStrategyForState(state)
  };
}

/**
 * Analyze the flow level of content based on text analysis
 * @param content The content to analyze
 * @returns The determined flow level, category and description
 */
export function analyzeContentFlowLevel(content: string): { 
  flowLevel: number, 
  category: string,
  description: string,
  recommendation?: string 
} {
  if (!content || content.trim().length === 0) {
    return { 
      flowLevel: 3, 
      category: 'Adaptation',
      description: 'No content to analyze'
    };
  }

  // First get the communication state
  const { state } = analyzeContentState(content);
  
  // Get the basic flow level from the state
  const flowLevel = getFlowLevelEstimate(state);
  const category = getFlowLevelCategory(state);
  
  // Additional flow level modifiers based on content analysis
  // These could be refined based on more sophisticated text analysis
  const recommendations = [
    'Consider the balance between structure and chaos',
    'Focus on clarity and coherence',
    'Explore more divergent thinking',
    'Address points of confusion',
    'Simplify and reorganize information'
  ];
  
  return {
    flowLevel,
    category,
    description: `Flow level ${flowLevel}/8 (${category})`,
    recommendation: recommendations[Math.floor(Math.random() * recommendations.length)]
  };
}