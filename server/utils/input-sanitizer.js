/**
 * Input Sanitizer Utility
 * 
 * Provides robust input sanitization and error correction for quantum chunking operations.
 * Handles unexpected inputs, typos, and edge cases to make the system more resilient.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { systemLogger, DomainEmoji, LogLevel } from './symbolic-logger.js';
import { ChunkSignalType, ChunkDomainEmoji } from './quantum-chunking.js';

/**
 * Sanitize and potentially correct user input for chunk content
 * 
 * @param {any} content - The input content to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized content
 */
export function sanitizeChunkContent(content, options = {}) {
  const {
    autoCorrect = true,
    truncate = true,
    maxLength = 10000
  } = options;

  // Handle null or undefined input
  if (content == null) {
    systemLogger.debug('Received null or undefined chunk content, returning empty string', DomainEmoji.SYSTEM);
    return '';
  }

  // Convert non-string inputs to strings
  if (typeof content !== 'string') {
    systemLogger.debug(`Converting non-string chunk content of type ${typeof content} to string`, DomainEmoji.SYSTEM);
    try {
      content = String(content);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      systemLogger.error(`Failed to convert content to string: ${error}`, DomainEmoji.SYSTEM);
      return '';
    }
  }

  // Truncate extremely long inputs if enabled
  if (truncate && content.length > maxLength) {
    const originalLength = content.length;
    content = content.substring(0, maxLength);
    systemLogger.debug(`Truncated chunk content from ${originalLength} to ${maxLength} characters`, DomainEmoji.SYSTEM);
  }

  // Detect and fix common input issues if auto-correction is enabled
  if (autoCorrect) {
    // Fix repeated punctuation (e.g., "!!!!!" -> "!")
    content = content.replace(/([.!?]){4,}/g, '$1$1$1');
    
    // Fix repeated whitespace
    content = content.replace(/\s{3,}/g, '  ');
    
    // Fix common typos (expandable list)
    const commonTypos = {
      'teh': 'the',
      'adn': 'and',
      'waht': 'what',
      'taht': 'that',
      'hte': 'the',
      'wiht': 'with',
      'thsi': 'this'
    };
    
    for (const [typo, correction] of Object.entries(commonTypos)) {
      // Only fix isolated instances of typos (with word boundaries)
      const typoRegex = new RegExp(`\\b${typo}\\b`, 'gi');
      if (typoRegex.test(content)) {
        const originalContent = content;
        content = content.replace(typoRegex, correction);
        if (content !== originalContent) {
          systemLogger.debug(`Auto-corrected typo: "${typo}" -> "${correction}"`, DomainEmoji.AGENT);
        }
      }
    }
  }

  return content;
}

/**
 * Sanitize task profile object to ensure all required fields have valid values
 * 
 * @param {Object} taskProfile - The task profile to sanitize
 * @returns {Object} Sanitized task profile
 */
export function sanitizeTaskProfile(taskProfile) {
  if (!taskProfile || typeof taskProfile !== 'object') {
    systemLogger.debug('Invalid task profile, creating default profile', DomainEmoji.SYSTEM);
    return createDefaultTaskProfile();
  }

  const sanitized = { ...taskProfile };

  // Ensure depth has a valid value
  if (!['shallow', 'moderate', 'deep'].includes(sanitized.depth)) {
    sanitized.depth = 'moderate';
    systemLogger.debug(`Corrected invalid task depth to "moderate"`, DomainEmoji.AGENT);
  }

  // Ensure urgency has a valid value
  if (!['low', 'medium', 'high'].includes(sanitized.urgency)) {
    sanitized.urgency = 'medium';
    systemLogger.debug(`Corrected invalid task urgency to "medium"`, DomainEmoji.AGENT);
  }

  // Ensure complexity has a valid value
  if (!['simple', 'moderate', 'complex'].includes(sanitized.complexity)) {
    sanitized.complexity = 'moderate';
    systemLogger.debug(`Corrected invalid task complexity to "moderate"`, DomainEmoji.AGENT);
  }

  // Ensure domain has a value
  if (!sanitized.domain || typeof sanitized.domain !== 'string') {
    sanitized.domain = 'general';
    systemLogger.debug(`Corrected missing task domain to "general"`, DomainEmoji.AGENT);
  }

  // Ensure boolean fields are actually booleans
  sanitized.creativityNeeded = Boolean(sanitized.creativityNeeded);
  sanitized.ethicalConsiderations = Boolean(sanitized.ethicalConsiderations);

  // Ensure cost sensitivity has a valid value
  if (!['low', 'medium', 'high'].includes(sanitized.costSensitivity)) {
    sanitized.costSensitivity = 'medium';
    systemLogger.debug(`Corrected invalid cost sensitivity to "medium"`, DomainEmoji.AGENT);
  }

  // Ensure main requirement has a valid value
  const validRequirements = ['speed', 'accuracy', 'balance', 'creativity', 'ethics'];
  if (!validRequirements.includes(sanitized.mainRequirement)) {
    sanitized.mainRequirement = 'balance';
    systemLogger.debug(`Corrected invalid main requirement to "balance"`, DomainEmoji.AGENT);
  }

  return sanitized;
}

/**
 * Create a default task profile for fallback purposes
 * 
 * @returns {Object} Default task profile
 */
function createDefaultTaskProfile() {
  return {
    depth: 'moderate',
    urgency: 'medium',
    domain: 'general',
    complexity: 'moderate',
    creativityNeeded: false,
    costSensitivity: 'medium',
    ethicalConsiderations: false,
    mainRequirement: 'balance'
  };
}

/**
 * Detect potential input errors and apply quantum signals as needed
 * 
 * @param {string} content - Input content to analyze
 * @param {Object} taskProfile - Task profile for context
 * @returns {string} Appropriate quantum signal type
 */
export function detectInputErrorSignals(content, taskProfile) {
  // Default: no signal
  let signalType = ChunkSignalType.NONE;
  
  // Short content with complex tasks may need refinement
  if (content.length < 30 && taskProfile.complexity === 'complex') {
    signalType = ChunkSignalType.REFRESH_SIGNAL;
    systemLogger.debug(`Applied REFRESH_SIGNAL to short content (${content.length} chars) for complex task`, DomainEmoji.AGENT);
  }
  
  // Content with ambiguous instructions may need logic lockdown
  const ambiguousPatterns = [
    /\b(something|somehow|whatever|anything)\b/gi,
    /\b(not sure|confused|unclear)\b/gi,
    /\?{2,}/g
  ];
  
  const hasAmbiguity = ambiguousPatterns.some(pattern => pattern.test(content));
  
  if (hasAmbiguity) {
    signalType = ChunkSignalType.LOGIC_LOCKDOWN;
    systemLogger.debug(`Applied LOGIC_LOCKDOWN due to ambiguous input patterns`, DomainEmoji.AGENT);
  }
  
  // Content with typos or errors in critical tasks may need attention
  if (taskProfile.mainRequirement === 'accuracy') {
    const typoIndicators = /\b(fat finger|typo|mistake|error|incorrect)\b/gi;
    if (typoIndicators.test(content)) {
      signalType = ChunkSignalType.REFRESH_SIGNAL;
      systemLogger.debug(`Applied REFRESH_SIGNAL due to potential typos in accuracy-focused task`, DomainEmoji.AGENT);
    }
  }
  
  return signalType;
}

/**
 * Get appropriate domain emoji based on sanitized input content
 * 
 * @param {string} content - The input content to analyze
 * @param {Object} taskProfile - The task profile for context
 * @returns {string} Appropriate domain emoji
 */
export function detectContentDomain(content, taskProfile) {
  // Start with default domain from task profile
  let domainEmoji = ChunkDomainEmoji.AGENT;
  
  // Domain detection patterns
  const domainPatterns = {
    [ChunkDomainEmoji.CODE]: /\b(code|function|class|var|const|let|import|export|javascript|python|typescript)\b/i,
    '🔍': /\b(ethic|moral|right|wrong|fair|unfair|equality|justice|privacy)\b/i, // Ethics
    '✨': /\b(creat|innovat|imagin|brainstorm|design|invent|novel|unique)\b/i, // Creativity
    '📊': /\b(data|statistic|chart|graph|analys|metrics|numbers|quantitative)\b/i, // Data
    '⚡': /\b(speed|quick|fast|rapid|immediate|urgent|asap|now)\b/i, // Speed/urgency
    '🧠': /\b(thinking|concept|idea|philosophy|theory|framework|cognitive)\b/i // Conceptual
  };
  
  // Check content against domain patterns
  for (const [emoji, pattern] of Object.entries(domainPatterns)) {
    if (pattern.test(content)) {
      domainEmoji = emoji;
      break;
    }
  }
  
  // Override with task profile domains if applicable
  if (taskProfile.ethicalConsiderations) domainEmoji = '🔍';
  if (taskProfile.creativityNeeded) domainEmoji = '✨';
  if (taskProfile.mainRequirement === 'accuracy') domainEmoji = ChunkDomainEmoji.LOGIC;
  if (taskProfile.mainRequirement === 'speed') domainEmoji = '⚡';
  
  return domainEmoji;
}

/**
 * Comprehensive input processing to handle typos, errors, and generate appropriate signals
 * 
 * @param {string} content - Original input content
 * @param {Object} taskProfile - Original task profile
 * @returns {Object} Processed input with sanitized content, profile, and suggested signals
 */
export function processInput(content, taskProfile) {
  // Sanitize the content
  const sanitizedContent = sanitizeChunkContent(content);
  
  // Sanitize the task profile
  const sanitizedProfile = sanitizeTaskProfile(taskProfile);
  
  // Detect appropriate signals based on content and profile
  const suggestedSignal = detectInputErrorSignals(sanitizedContent, sanitizedProfile);
  
  // Determine appropriate domain
  const suggestedDomain = detectContentDomain(sanitizedContent, sanitizedProfile);
  
  // Return comprehensive processed input
  return {
    content: sanitizedContent,
    taskProfile: sanitizedProfile,
    signalType: suggestedSignal,
    domain: suggestedDomain,
    corrections: {
      contentModified: content !== sanitizedContent,
      profileModified: JSON.stringify(taskProfile) !== JSON.stringify(sanitizedProfile)
    }
  };
}