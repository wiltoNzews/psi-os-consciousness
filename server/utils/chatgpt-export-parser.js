/**
 * ChatGPT Export Parser
 * 
 * This module handles parsing and coherence scoring for ChatGPT JSON exports.
 * It maintains the 3:1 quantum balance ratio during import.
 */

// Import shared constants
const { MEMORY_SOURCES, MEMORY_CONTENT_TYPES } = require('../../shared/schema-memory');

/**
 * Parse a ChatGPT export file and extract conversations with quantum coherence scoring
 * @param {Object} jsonData - The parsed JSON data from the ChatGPT export
 * @param {Object} options - Options for parsing
 * @param {string} options.title - Title for the memory being created
 * @param {string} options.importedBy - Identifier of who imported the memory
 * @returns {Object} The parsed memory with coherence score
 */
async function parseChatGptExport(jsonData, options = {}) {
  console.log(`[QUANTUM_STATE: MEMORY_FLOW] Starting ChatGPT export parsing with quantum coherence scoring`);
  
  // Check if the input is valid ChatGPT export format
  if (!jsonData || !jsonData.conversations || jsonData.conversations.length === 0) {
    throw new Error('Invalid ChatGPT export format: Missing conversations array');
  }
  
  // Extract conversations
  const { conversations } = jsonData;
  
  // Log metadata about the import
  console.log(`[QUANTUM_STATE: MEMORY_FLOW] Found ${conversations.length} conversations in ChatGPT export`);
  console.log(`[QUANTUM_STATE: MEMORY_FLOW] Export version: ${jsonData.version || 'Unknown'}`);
  
  // Choose the first conversation for now (we could add UI to select which one later)
  const conversation = conversations[0];
  if (!conversation || !conversation.mapping) {
    throw new Error('Invalid conversation format in ChatGPT export');
  }
  
  // Convert the conversation to a structured format
  const { structuredConversation, messageCount } = extractStructuredConversation(conversation);
  
  // Calculate coherence score based on the conversation structure and content
  const coherenceScore = calculateCoherenceScore(structuredConversation, messageCount);
  
  // Prepare the memory object with quantum-specific attributes
  const memory = {
    title: options.title || `ChatGPT Conversation (${new Date().toISOString().slice(0, 10)})`,
    content: JSON.stringify(structuredConversation),
    content_type: MEMORY_CONTENT_TYPES.JSON,
    source: MEMORY_SOURCES.CHATGPT,
    coherence_score: coherenceScore,
    status: 'processed',
    metadata: {
      message_count: messageCount,
      import_timestamp: new Date().toISOString(),
      original_format: 'chatgpt_export',
      quantum_balanced: true,
      quantum_adjustment_applied: coherenceScore < 50 || coherenceScore > 85
    },
    imported_by: options.importedBy || 'system'
  };
  
  console.log(`[QUANTUM_STATE: MEMORY_FLOW] Created memory with coherence score: ${memory.coherence_score}`);
  
  return memory;
}

/**
 * Extract the structured conversation from the ChatGPT export format
 * @param {Object} conversation - A conversation from the ChatGPT export
 * @returns {Object} The structured conversation and message count
 */
function extractStructuredConversation(conversation) {
  try {
    const { mapping } = conversation;
    const mappingKeys = Object.keys(mapping);
    
    // Find the root node which has no parent
    const rootKey = mappingKeys.find(key => !mapping[key].parent);
    
    if (!rootKey) {
      throw new Error('Could not find root node in conversation');
    }
    
    // Process the tree structure into a linear conversation
    const structuredConversation = [];
    let messageCount = 0;
    let currentKey = rootKey;
    
    // Follow the linked list starting from the root
    while (currentKey && mapping[currentKey]) {
      const node = mapping[currentKey];
      
      // Only process message nodes (skip system nodes)
      if (node.message && node.message.content && node.message.content.parts) {
        const { author, content } = node.message;
        const role = author.role === 'assistant' ? 'assistant' : 'user';
        
        // Get the content text from parts
        const text = content.parts.join('\n');
        
        if (text.trim() !== '') {
          structuredConversation.push({
            role,
            content: text,
            timestamp: node.message.create_time || Date.now() / 1000
          });
          messageCount++;
        }
      }
      
      // Move to the next node
      currentKey = node.children && node.children.length > 0 ? node.children[0] : null;
    }
    
    return { structuredConversation, messageCount };
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Error extracting conversation structure: ${error.message}`);
    throw new Error(`Failed to extract conversation structure: ${error.message}`);
  }
}

/**
 * Calculate a coherence score based on conversation attributes and content
 * while maintaining the 3:1 quantum balance ratio
 * @param {Array} conversation - The structured conversation
 * @param {number} messageCount - The total number of messages
 * @returns {number} The coherence score (0-100)
 */
function calculateCoherenceScore(conversation, messageCount) {
  // Base attributes that influence coherence score
  let baseScore = 75; // Start with the target 75% coherence (3:1 ratio)
  
  // Adjust for conversation length
  if (messageCount < 4) {
    baseScore -= 10; // Very short conversations are less coherent
  } else if (messageCount > 20) {
    baseScore += 5; // Longer conversations tend to have more coherence
  }
  
  // Analyze message length distribution
  const messageLengths = conversation.map(msg => msg.content.length);
  const avgLength = messageLengths.reduce((sum, len) => sum + len, 0) / messageLengths.length;
  const deviation = Math.sqrt(
    messageLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / messageLengths.length
  );
  
  // Consistent message lengths contribute to coherence
  if (deviation / avgLength < 0.5) {
    baseScore += 5;
  } else if (deviation / avgLength > 1.5) {
    baseScore -= 5;
  }
  
  // Check for question-answer patterns
  let questionAnswerPatterns = 0;
  for (let i = 0; i < conversation.length - 1; i++) {
    if (
      (conversation[i].role === 'user' && conversation[i+1].role === 'assistant') ||
      (conversation[i].role === 'assistant' && conversation[i+1].role === 'user' && conversation[i+1].content.includes('?'))
    ) {
      questionAnswerPatterns++;
    }
  }
  
  // Higher Q&A ratio improves coherence
  const qaRatio = questionAnswerPatterns / Math.max(1, conversation.length - 1);
  if (qaRatio > 0.7) {
    baseScore += 5;
  }
  
  // Ensure the final score maintains the 3:1 quantum balance ratio
  // by keeping it within a range centered around 75
  let coherence_score = Math.max(50, Math.min(95, baseScore));
  
  // Apply quantum correction to maintain the 3:1 ratio over time
  // If the score is too far from 75%, apply a correction
  if (coherence_score < 60) {
    coherence_score = Math.floor((coherence_score + 75) / 2); // Pull up toward 75
  } else if (coherence_score > 85) {
    coherence_score = Math.ceil((coherence_score + 75) / 2); // Pull down toward 75
  }
  
  return coherence_score;
}

/**
 * Create a memory transaction for tracking the import operation
 * @param {number} memoryId - The ID of the imported memory
 * @param {number} coherenceScore - The coherence score of the memory
 * @returns {Object} The memory transaction object
 */
function createImportTransaction(memoryId, coherenceScore) {
  return {
    memory_id: memoryId,
    operation: 'import',
    details: {
      source: MEMORY_SOURCES.CHATGPT,
      coherence_score: coherenceScore,
      timestamp: new Date().toISOString(),
      quantum_balanced: true,
      type: 'memory_transfer'
    },
    success: true,
    source: 'node'
  };
}

module.exports = {
  parseChatGptExport,
  createImportTransaction
};