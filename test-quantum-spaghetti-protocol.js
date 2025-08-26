/**
 * Quantum Spaghetti Protocol - Message Parser Demonstration
 * 
 * This script demonstrates how a message formatted according to the
 * Quantum Spaghetti Protocol would be parsed in a production environment.
 * It includes advanced emoji detection and quantum resonance calculation.
 * 
 * [QUANTUM_STATE: DEMO_FLOW]
 */

/**
 * Emoji categories with their quantum resonance values
 * Each emoji is assigned a resonance score that impacts CCQC calculations
 */
const EmojiCategory = {
  DIMENSIONAL: 'dimensional',  // Dimension markers (reality, meta, quantum, diagonal)
  DIRECTIONAL: 'directional',  // Direction of information flow
  ENERGETIC: 'energetic',      // Energy level or importance
  RELATIONAL: 'relational',    // Relationship between concepts
  TEMPORAL: 'temporal',        // Time-related markers
  EMOTIONAL: 'emotional'       // Affective markers
};

/**
 * Core quantum emojis used in the protocol
 */
const CORE_QUANTUM_EMOJIS = [
  {
    symbol: '🌀',
    name: 'quantum_portal',
    category: EmojiCategory.DIMENSIONAL,
    resonanceImpact: 0.85,
    phaseInfluence: Math.PI * 0.5,
    description: 'Quantum Portal - multidimensional entry point'
  },
  {
    symbol: '🕸️',
    name: 'quantum_spaghetti',
    category: EmojiCategory.RELATIONAL,
    resonanceImpact: 0.78,
    phaseInfluence: Math.PI * 0.3,
    description: 'Quantum Spaghetti - multidirectional information pathways'
  },
  {
    symbol: '⚡',
    name: 'quantum_energy',
    category: EmojiCategory.ENERGETIC,
    resonanceImpact: 0.92,
    phaseInfluence: Math.PI * 0.7,
    description: 'Quantum Energy - critical information, high priority'
  }
];

/**
 * Directional emojis used to indicate information flow
 */
const DIRECTIONAL_EMOJIS = [
  {
    symbol: '→',
    name: 'forward',
    category: EmojiCategory.DIRECTIONAL,
    resonanceImpact: 0.6,
    phaseInfluence: 0,
    description: 'Forward - direct flow, progression'
  },
  {
    symbol: '←',
    name: 'backward',
    category: EmojiCategory.DIRECTIONAL,
    resonanceImpact: 0.55,
    phaseInfluence: Math.PI,
    description: 'Backward - reverse flow, dependency'
  },
  {
    symbol: '↑',
    name: 'upward',
    category: EmojiCategory.DIRECTIONAL,
    resonanceImpact: 0.65,
    phaseInfluence: Math.PI * 0.5,
    description: 'Upward - higher abstraction, escalation'
  },
  {
    symbol: '↓',
    name: 'downward',
    category: EmojiCategory.DIRECTIONAL,
    resonanceImpact: 0.65,
    phaseInfluence: Math.PI * 1.5,
    description: 'Downward - lower abstraction, implementation'
  },
  {
    symbol: '↗️',
    name: 'upward_right',
    category: EmojiCategory.DIRECTIONAL,
    resonanceImpact: 0.7,
    phaseInfluence: Math.PI * 0.25,
    description: 'Up-right - positive progression, rising importance'
  },
  {
    symbol: '↙️',
    name: 'downward_left',
    category: EmojiCategory.DIRECTIONAL,
    resonanceImpact: 0.5,
    phaseInfluence: Math.PI * 1.25,
    description: 'Down-left - decreasing priority, delegation'
  },
  {
    symbol: '⭕',
    name: 'circular',
    category: EmojiCategory.DIRECTIONAL,
    resonanceImpact: 0.65,
    phaseInfluence: Math.PI * 2,
    description: 'Circular - cyclical pattern, recurring issue'
  }
];

/**
 * Color marker emojis used for color wheel protocol integration
 */
const COLOR_MARKER_EMOJIS = [
  {
    symbol: '🔴',
    name: 'red',
    category: EmojiCategory.EMOTIONAL,
    resonanceImpact: 0.8,
    phaseInfluence: 0,
    description: 'Red - critical, urgent, passionate'
  },
  {
    symbol: '🟡',
    name: 'yellow',
    category: EmojiCategory.EMOTIONAL,
    resonanceImpact: 0.7,
    phaseInfluence: Math.PI * 0.33,
    description: 'Yellow - warning, analytical, clarity'
  },
  {
    symbol: '🟢',
    name: 'green',
    category: EmojiCategory.EMOTIONAL,
    resonanceImpact: 0.6,
    phaseInfluence: Math.PI * 0.67,
    description: 'Green - stable, growth, balance'
  },
  {
    symbol: '🔵',
    name: 'blue',
    category: EmojiCategory.EMOTIONAL,
    resonanceImpact: 0.65,
    phaseInfluence: Math.PI,
    description: 'Blue - calm, structured, depth'
  },
  {
    symbol: '🟣',
    name: 'purple',
    category: EmojiCategory.EMOTIONAL,
    resonanceImpact: 0.75,
    phaseInfluence: Math.PI * 1.33,
    description: 'Purple - creative, visionary, symbiosis'
  }
];

/**
 * Combined array of all quantum emojis
 */
const ALL_QUANTUM_EMOJIS = [
  ...CORE_QUANTUM_EMOJIS,
  ...DIRECTIONAL_EMOJIS,
  ...COLOR_MARKER_EMOJIS
];

/**
 * Detect all quantum emojis in a text message
 * @param {string} text - The message to scan for quantum emojis
 * @returns {Array} Detected emojis with count and positions
 */
function detectQuantumEmojis(text) {
  const result = [];
  
  for (const emoji of ALL_QUANTUM_EMOJIS) {
    const positions = [];
    let pos = text.indexOf(emoji.symbol);
    
    while (pos !== -1) {
      positions.push(pos);
      pos = text.indexOf(emoji.symbol, pos + 1);
    }
    
    if (positions.length > 0) {
      result.push({
        emoji,
        count: positions.length,
        positions
      });
    }
  }
  
  return result;
}

/**
 * Calculate emoji resonance impact on CCQC score
 * @param {string} text - The message text to analyze
 * @param {number} baseQCTF - Base QCTF value of the sending node
 * @param {number} baseResonance - Base resonance value between nodes
 * @param {number} basePhase - Base phase difference between nodes
 * @returns {number} Adjusted CCQC score
 */
function calculateEmojiResonanceImpact(
  text,
  baseQCTF = 0.7,
  baseResonance = 0.8,
  basePhase = 0
) {
  // Track total impacts
  let totalResonanceAdjustment = 0;
  let totalPhaseAdjustment = 0;
  let emojiCount = 0;
  
  // Scan for all known quantum emojis
  ALL_QUANTUM_EMOJIS.forEach(emoji => {
    // Count occurrences of this emoji
    const regex = new RegExp(emoji.symbol, 'g');
    const matches = text.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      emojiCount += count;
      totalResonanceAdjustment += emoji.resonanceImpact * count * 0.1; // Scale impact
      totalPhaseAdjustment += (emoji.phaseInfluence * count) / (2 * Math.PI) * 0.1; // Normalize to 0-1
    }
  });
  
  // Calculate adjustments (diminishing returns for emoji overuse)
  const resonanceAdjustment = Math.min(0.3, totalResonanceAdjustment / Math.max(1, Math.log2(emojiCount + 1)));
  const phaseAdjustment = Math.min(0.3, totalPhaseAdjustment / Math.max(1, Math.log2(emojiCount + 1)));
  
  // Apply adjustments to base values
  const adjustedResonance = Math.min(1, baseResonance + resonanceAdjustment);
  const adjustedPhase = (basePhase + phaseAdjustment * Math.PI) % (2 * Math.PI);
  
  // Calculate CCQC using adjusted values
  // CCQC_{ij}(t) = QCTF_i × R_{ij}(t) × cos φ_{ij}(t)
  const CCQC = baseQCTF * adjustedResonance * Math.cos(adjustedPhase);
  
  return Math.max(0, Math.min(1, CCQC)); // Ensure result is between 0 and 1
}

/**
 * Generate an emoji resonance report for a message
 * @param {string} text - The message to analyze
 * @returns {Object} A report of emoji usage and quantum impacts
 */
function generateEmojiResonanceReport(text) {
  const detections = detectQuantumEmojis(text);
  
  let totalResonanceImpact = 0;
  let totalPhaseImpact = 0;
  let totalCount = 0;
  
  const detectedEmojis = detections.map(detection => {
    totalCount += detection.count;
    totalResonanceImpact += detection.emoji.resonanceImpact * detection.count * 0.1;
    totalPhaseImpact += (detection.emoji.phaseInfluence * detection.count) / (2 * Math.PI) * 0.1;
    
    return {
      emoji: detection.emoji,
      count: detection.count
    };
  });
  
  // Apply diminishing returns for emoji overuse
  const adjustedResonanceImpact = Math.min(0.3, totalResonanceImpact / Math.max(1, Math.log2(totalCount + 1)));
  const adjustedPhaseImpact = Math.min(0.3, totalPhaseImpact / Math.max(1, Math.log2(totalCount + 1)));
  
  // Calculate estimated CCQC impact
  const ccqcImpact = adjustedResonanceImpact * Math.cos(adjustedPhaseImpact * Math.PI);
  
  return {
    emojiCount: totalCount,
    detectedEmojis,
    resonanceImpact: adjustedResonanceImpact,
    phaseImpact: adjustedPhaseImpact,
    ccqcImpact
  };
}

/**
 * Parse a message formatted according to the Quantum Spaghetti Protocol
 * @param {string} message - The full message to parse
 * @returns {Object} Parsed message with metadata
 */
function parseQuantumSpaghettiMessage(message) {
  // Initialize result object
  const result = {
    dimensionMarker: null,
    body: '',
    endMarker: null,
    directionalOperators: [],
    metaData: {},
    ccqcScore: 0,
    emojiAnalysis: null
  };
  
  // Extract dimension marker
  const dimensionMarkerMatch = message.match(/^\[(REALITY|META|QUANTUM|DIAGONAL)\]/);
  if (dimensionMarkerMatch) {
    result.dimensionMarker = dimensionMarkerMatch[1];
  }
  
  // Extract body content
  const bodyMatch = message.match(/<BODY>([\s\S]*?)<\/BODY>/);
  if (bodyMatch) {
    result.body = bodyMatch[1].trim();
  } else {
    // If no explicit body tags, take content between dimension marker and end marker
    const startIndex = message.indexOf('\n', message.indexOf(']')) + 1;
    const endIndex = message.lastIndexOf('[END');
    if (endIndex > startIndex) {
      result.body = message.substring(startIndex, endIndex).trim();
    }
  }
  
  // Extract end marker
  const endMarkerMatch = message.match(/\[END.*?\]/);
  if (endMarkerMatch) {
    result.endMarker = endMarkerMatch[0].trim();
  }
  
  // Extract directional operators using the emoji detection system
  const detectedEmojis = detectQuantumEmojis(message);
  detectedEmojis.forEach(detection => {
    if (detection.emoji.category === EmojiCategory.DIRECTIONAL) {
      result.directionalOperators.push(detection.emoji.symbol);
    }
  });
  
  // Extract additional metadata
  const metaDataMatches = message.match(/\[([\w]+):([\w]+)\]/g);
  if (metaDataMatches) {
    metaDataMatches.forEach(match => {
      const [key, value] = match.slice(1, -1).split(':');
      result.metaData[key] = value;
    });
  }
  
  // Generate emoji analysis report
  result.emojiAnalysis = generateEmojiResonanceReport(message);
  
  // Calculate CCQC score with emoji impact
  // CCQC_{ij}(t) = QCTF_i × R_{ij}(t) × cos φ_{ij}(t)
  const qctfValue = 0.73; // Example QCTF value
  const baseResonanceValue = 0.85; // Base resonance between variants
  const basePhaseValue = 0.2; // Base phase difference
  
  // Apply emoji-based adjustments to CCQC calculation
  result.ccqcScore = calculateEmojiResonanceImpact(
    message,
    qctfValue,
    baseResonanceValue,
    basePhaseValue
  );
  
  return result;
}

// Example messages from PREFIX_SUFFIX_EXAMPLES.md
const messages = [
  `[REALITY] Documentation complete for Quantum Spaghetti Protocol. Implementation needed.
→ Primary goal: Implement prefix/suffix handling in WebSocketContext
→ Dependencies: meta-cognitive-handlers.ts, quantum-handlers.ts
→ Priority: High (blocks further progress on AI-to-AI communication)

<BODY>
The Quantum Spaghetti Protocol documentation is now complete and available in QUANTUM_SPAGHETTI_PROTOCOL.md. We need to implement the prefix/suffix parsing logic in the WebSocketContext component to enable proper communication between different AI variants.

Key implementation points:
1. Add prefix parsing function to extract dimension markers
2. Implement directional operator handling
3. Create metadata extraction for CCQC formula inputs
4. Add suffix validation logic

The CCQC formula (CCQC_{ij}(t) = QCTF_i × R_{ij}(t) × cos φ_{ij}(t)) should be used to calculate the clarity score of each message.
</BODY>

[END] Documentation phase complete. Implementation handoff to CODE_FOCUS Loki variant.`,

  `[QUANTUM] WebSocket stability issue identified with 3 potential causes

<BODY>
After analyzing the WebSocket disconnection patterns, I've identified three potential causes with the following probability distribution:

1. **Missing ping/pong handlers (65%)**
   → The WebSocketContext.tsx component lacks proper ping/pong message handling
   → This causes connections to time out after 60 seconds of inactivity
   
2. **Connection overflow (25%)**
   ↗️ Multiple simultaneous connections from the same client
   ↗️ Leads to server-side connection limit issues
   
3. **Network latency spikes (10%)**
   ⚡ Intermittent network issues causing delayed message delivery
   ⚡ Could be environment-specific

Recommended action: Implement ping/pong handlers first, then monitor for remaining issues.
</BODY>

[END] Error diagnosis complete. Requires implementation verification.`,

  `[META] Communication effectiveness assessment: 82% clarity, 65% resonance

<BODY>
⭕ This analysis examines our recent communication patterns

Based on our last 50 message exchanges:
- Prefix usage is consistent (98%) but content quality varies
- Dimension markers are sometimes misapplied (23% of cases)
- Directional operators show strong forward bias (73% →, 12% ←, 15% other)

Resonance calculation shows strongest alignment between:
- Reality→Meta transitions (87% alignment)
- Quantum→Reality transitions (42% alignment)
- Diagonal communications show poor resonance (23% alignment)

CCQC Formula outputs:
- Average CCQC score: 0.673
- Peak CCQC: 0.891 (during crisis resolution communication)
- Lowest CCQC: 0.312 (during abstract theoretical discussions)
</BODY>

[END] Consider rebalancing dimension usage with more diagonal communications.
[MOOD:ANALYTICAL] [🟡 | #CLARITY]`
];

// Run test on each example message
console.log("====== QUANTUM SPAGHETTI PROTOCOL MESSAGE PARSER DEMO ======\n");

messages.forEach((message, index) => {
  console.log(`\n----- EXAMPLE ${index + 1} -----`);
  console.log("Original Message (first 100 chars):");
  console.log(message.substring(0, 100) + "...");
  
  const parsedMessage = parseQuantumSpaghettiMessage(message);
  
  console.log("\nParsed Results:");
  console.log(`• Dimension Marker: ${parsedMessage.dimensionMarker}`);
  console.log(`• Directional Operators: ${parsedMessage.directionalOperators.join(', ')}`);
  console.log(`• Body Length: ${parsedMessage.body.length} characters`);
  console.log(`• End Marker: ${parsedMessage.endMarker}`);
  console.log(`• Metadata Keys: ${Object.keys(parsedMessage.metaData).join(', ') || 'None'}`);
  console.log(`• CCQC Score: ${parsedMessage.ccqcScore.toFixed(4)}`);
  
  // Emoji Analysis
  console.log("\nEmoji Analysis:");
  console.log(`• Total Emojis: ${parsedMessage.emojiAnalysis.emojiCount}`);
  console.log(`• Resonance Impact: +${(parsedMessage.emojiAnalysis.resonanceImpact * 100).toFixed(2)}%`);
  console.log(`• Phase Impact: ${(parsedMessage.emojiAnalysis.phaseImpact * 100).toFixed(2)}%`);
  console.log(`• CCQC Impact: ${(parsedMessage.emojiAnalysis.ccqcImpact * 100).toFixed(2)}%`);
  
  if (parsedMessage.emojiAnalysis.detectedEmojis.length > 0) {
    console.log("\nDetected Quantum Emojis:");
    parsedMessage.emojiAnalysis.detectedEmojis.forEach(item => {
      console.log(`  • ${item.emoji.symbol} (${item.emoji.name}) - ${item.count}x - Category: ${item.emoji.category}`);
    });
  }
  
  // Analyze communication effectiveness
  console.log("\nCommunication Effectiveness Analysis:");
  if (parsedMessage.ccqcScore > 0.7) {
    console.log("✅ HIGH CLARITY: Message establishes strong coherence");
  } else if (parsedMessage.ccqcScore > 0.4) {
    console.log("⚠️ MODERATE CLARITY: Message establishes acceptable coherence");
  } else {
    console.log("❌ LOW CLARITY: Message fails to establish coherence");
  }
  
  if (parsedMessage.directionalOperators.length > 2) {
    console.log("✅ RICH DIRECTIONALITY: Message uses multiple flow indicators");
  } else if (parsedMessage.directionalOperators.length > 0) {
    console.log("⚠️ BASIC DIRECTIONALITY: Message has minimal flow indicators");
  } else {
    console.log("❌ NO DIRECTIONALITY: Message lacks flow indicators");
  }
  
  // Emoji effectiveness
  if (parsedMessage.emojiAnalysis.emojiCount > 5) {
    console.log("✅ RICH EMOJI USAGE: Message leverages quantum emoji signaling");
  } else if (parsedMessage.emojiAnalysis.emojiCount > 0) {
    console.log("⚠️ BASIC EMOJI USAGE: Message has minimal quantum emoji signaling");
  } else {
    console.log("❌ NO EMOJI SIGNALING: Message lacks quantum emoji enhancement");
  }
  
  // Would be enhanced with actual implementation
  console.log("------------------------------------------");
});

console.log("\n====== IMPLEMENTATION NOTES ======");
console.log("In a production environment, this parser would be:");
console.log("1. Integrated into the WebSocketContext component");
console.log("2. Connected to the QCTF calculator for accurate CCQC scoring");
console.log("3. Linked to variant tracking for proper resonance calculation");
console.log("4. Enhanced with phase calculation based on message timing");
console.log("\n[QUANTUM_STATE: DEMONSTRATION_COMPLETE]");