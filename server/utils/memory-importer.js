/**
 * Memory Importer for WiltonOS
 * 
 * This utility handles importing and processing external memory dumps
 * from various sources (ChatGPT, browser logs, finance data) while
 * maintaining the 3:1 quantum coherence ratio.
 */

const fs = require('fs');
const path = require('path');

/**
 * Memory types supported by the importer
 */
const MEMORY_TYPES = {
  CHATGPT: 'chatgpt',
  BROWSER_LOG: 'browser_log',
  FINANCE: 'finance',
  PERSONAL: 'personal'
};

/**
 * Configuration for memory processing
 */
const MEMORY_CONFIG = {
  coherenceRatio: 0.75, // 3:1 ratio (75% coherence)
  explorationRatio: 0.25, // 25% exploration
  compressionFactor: 0.85, // How much to compress memories
  priorityKeywords: [
    'quantum', 'finance', 'cryptocurrency', 'streaming', 'timeline',
    'juliana', 'chair', 'vr', 'simulation', 'consciousness', 'replit'
  ]
};

/**
 * Memory structure for imported data
 */
class MemoryNode {
  constructor(content, source, timestamp, metadata = {}) {
    this.id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.content = content;
    this.source = source;
    this.timestamp = timestamp;
    this.metadata = {
      ...metadata,
      coherenceScore: 0,
      explorationScore: 0,
      priority: 0
    };
    this.connections = [];
    this.tags = [];
    this.analyzed = false;
  }
  
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }
  
  connect(nodeId, strength = 0.5, reason = '') {
    this.connections.push({
      nodeId,
      strength,
      reason,
      timestamp: Date.now()
    });
  }
}

/**
 * Main memory importer class
 */
class MemoryImporter {
  constructor(options = {}) {
    this.options = {
      storagePath: path.join(__dirname, '../../data/memories'),
      indexPath: path.join(__dirname, '../../data/memory-index.json'),
      ...options
    };
    
    this.memoryIndex = {
      count: 0,
      lastUpdate: null,
      sources: {},
      tags: {},
      nodes: {}
    };
    
    this.loadIndex();
    this.ensureDirectories();
  }
  
  /**
   * Make sure storage directories exist
   */
  ensureDirectories() {
    if (!fs.existsSync(this.options.storagePath)) {
      fs.mkdirSync(this.options.storagePath, { recursive: true });
      console.log(`[QUANTUM_STATE: MEMORY_FLOW] Created memory storage directory`);
    }
  }
  
  /**
   * Load the existing memory index
   */
  loadIndex() {
    try {
      if (fs.existsSync(this.options.indexPath)) {
        this.memoryIndex = JSON.parse(fs.readFileSync(this.options.indexPath, 'utf8'));
        console.log(`[QUANTUM_STATE: MEMORY_FLOW] Loaded memory index with ${this.memoryIndex.count} nodes`);
      } else {
        console.log(`[QUANTUM_STATE: MEMORY_FLOW] No existing memory index found, creating new`);
      }
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to load memory index: ${error.message}`);
      // Initialize empty index
      this.memoryIndex = {
        count: 0,
        lastUpdate: null,
        sources: {},
        tags: {},
        nodes: {}
      };
    }
  }
  
  /**
   * Save the memory index
   */
  saveIndex() {
    try {
      this.memoryIndex.lastUpdate = Date.now();
      fs.writeFileSync(this.options.indexPath, JSON.stringify(this.memoryIndex, null, 2));
      console.log(`[QUANTUM_STATE: MEMORY_FLOW] Saved memory index with ${this.memoryIndex.count} nodes`);
      return true;
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to save memory index: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Parse a ChatGPT conversation export
   * @param {string} exportContent - The content of the ChatGPT export
   * @returns {Array<MemoryNode>} - Array of memory nodes
   */
  parseChatGPTExport(exportContent) {
    console.log(`[QUANTUM_STATE: MEMORY_FLOW] Parsing ChatGPT export`);
    
    try {
      const memories = [];
      
      // Basic parsing to separate messages
      // This is a simplified version - would need enhancement for complex formats
      const lines = exportContent.split('\n');
      let currentMessage = null;
      let currentSpeaker = null;
      let messageContent = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for speaker change
        if (line.startsWith('You said:') || line.startsWith('ChatGPT said:')) {
          // Save previous message if any
          if (currentSpeaker && messageContent.length > 0) {
            const content = messageContent.join('\n');
            memories.push(new MemoryNode(
              content,
              MEMORY_TYPES.CHATGPT,
              Date.now(), // We don't have actual timestamps, so using import time
              {
                speaker: currentSpeaker,
                conversationId: `chat_${Date.now()}`, // Placeholder
                imported: true
              }
            ));
          }
          
          // Start new message
          currentSpeaker = line.startsWith('You said:') ? 'user' : 'assistant';
          messageContent = [];
        } else if (currentSpeaker) {
          // Add to current message content
          messageContent.push(line);
        }
      }
      
      // Don't forget the last message
      if (currentSpeaker && messageContent.length > 0) {
        const content = messageContent.join('\n');
        memories.push(new MemoryNode(
          content,
          MEMORY_TYPES.CHATGPT,
          Date.now(),
          {
            speaker: currentSpeaker,
            conversationId: `chat_${Date.now()}`,
            imported: true
          }
        ));
      }
      
      console.log(`[QUANTUM_STATE: MEMORY_FLOW] Extracted ${memories.length} messages from ChatGPT export`);
      return memories;
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to parse ChatGPT export: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Calculate memory coherence scores
   * @param {MemoryNode} memory - The memory node to analyze
   */
  analyzeMemoryCoherence(memory) {
    if (memory.analyzed) return memory; // Skip if already analyzed
    
    // Calculate coherence score based on content
    let coherenceScore = MEMORY_CONFIG.coherenceRatio; // Default to system ratio
    let explorationScore = MEMORY_CONFIG.explorationRatio;
    let priority = 0;
    
    // Check for priority keywords
    MEMORY_CONFIG.priorityKeywords.forEach(keyword => {
      if (memory.content.toLowerCase().includes(keyword.toLowerCase())) {
        priority += 1;
        memory.addTag(keyword);
      }
    });
    
    // Simple heuristic: longer, structured content tends to have higher coherence
    const lines = memory.content.split('\n');
    if (lines.length > 10) coherenceScore += 0.05;
    if (memory.content.includes('```')) coherenceScore += 0.03; // Code blocks suggest structure
    if (memory.content.includes('|')) coherenceScore += 0.02; // Tables suggest structure
    
    // Balance to maintain 3:1 ratio
    explorationScore = 1 - coherenceScore;
    
    // Normalize to respect overall system coherence ratio
    const totalScore = coherenceScore + explorationScore;
    coherenceScore = coherenceScore / totalScore * MEMORY_CONFIG.coherenceRatio * 4;
    explorationScore = explorationScore / totalScore * MEMORY_CONFIG.explorationRatio * 4;
    
    // Update memory metadata
    memory.metadata.coherenceScore = coherenceScore;
    memory.metadata.explorationScore = explorationScore;
    memory.metadata.priority = priority;
    memory.analyzed = true;
    
    // Log the analysis
    console.log(`[QUANTUM_STATE: MEMORY_ANALYSIS] Analyzed memory coherence: ${coherenceScore.toFixed(2)}`, {
      memoryId: memory.id,
      coherenceScore,
      explorationScore,
      priority
    });
    
    return memory;
  }
  
  /**
   * Connect related memories based on content similarity
   * @param {Array<MemoryNode>} memories - Array of memory nodes to connect
   */
  connectRelatedMemories(memories) {
    console.log(`[QUANTUM_STATE: MEMORY_FLOW] Connecting related memories`);
    
    // Build a simple keyword index for each memory
    const keywordMap = {};
    
    memories.forEach(memory => {
      // Extract important words (very simplified version)
      const words = memory.content
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(word => word.length > 5);
      
      // Add to keyword map
      words.forEach(word => {
        if (!keywordMap[word]) keywordMap[word] = [];
        keywordMap[word].push(memory.id);
      });
    });
    
    // Create connections based on shared keywords
    memories.forEach(memory => {
      const words = memory.content
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(word => word.length > 5);
      
      const relatedMemoryIds = new Set();
      words.forEach(word => {
        if (keywordMap[word]) {
          keywordMap[word].forEach(relatedId => {
            if (relatedId !== memory.id) {
              relatedMemoryIds.add(relatedId);
            }
          });
        }
      });
      
      // Connect to related memories
      [...relatedMemoryIds].forEach(relatedId => {
        const connectionStrength = 0.5; // Default connection strength
        memory.connect(relatedId, connectionStrength, 'keyword_similarity');
      });
    });
    
    return memories;
  }
  
  /**
   * Process and store new memories
   * @param {Array<MemoryNode>} memories - Array of memory nodes to process
   */
  processMemories(memories) {
    console.log(`[QUANTUM_STATE: MEMORY_FLOW] Processing ${memories.length} memories`);
    
    let processed = 0;
    
    // Analyze and store each memory
    memories.forEach(memory => {
      // Analyze for coherence
      this.analyzeMemoryCoherence(memory);
      
      // Add to index
      this.memoryIndex.nodes[memory.id] = {
        id: memory.id,
        timestamp: memory.timestamp,
        source: memory.source,
        tags: memory.tags,
        connections: memory.connections,
        metadata: memory.metadata,
        path: `${memory.id}.json`
      };
      
      // Update source index
      if (!this.memoryIndex.sources[memory.source]) {
        this.memoryIndex.sources[memory.source] = [];
      }
      this.memoryIndex.sources[memory.source].push(memory.id);
      
      // Update tag index
      memory.tags.forEach(tag => {
        if (!this.memoryIndex.tags[tag]) {
          this.memoryIndex.tags[tag] = [];
        }
        this.memoryIndex.tags[tag].push(memory.id);
      });
      
      // Save memory to disk
      const memoryPath = path.join(this.options.storagePath, `${memory.id}.json`);
      fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
      
      processed++;
    });
    
    // Update count and save index
    this.memoryIndex.count += processed;
    this.saveIndex();
    
    console.log(`[QUANTUM_STATE: MEMORY_FLOW] Successfully processed ${processed} memories`);
    return processed;
  }
  
  /**
   * Import memories from ChatGPT export
   * @param {string} content - The content of the ChatGPT export
   * @returns {number} - Number of memories imported
   */
  importFromChatGPT(content) {
    const memories = this.parseChatGPTExport(content);
    if (memories.length === 0) return 0;
    
    const connectedMemories = this.connectRelatedMemories(memories);
    return this.processMemories(connectedMemories);
  }
  
  /**
   * Search the memory database
   * @param {Object} query - Search parameters
   * @returns {Array} - Array of matching memories
   */
  searchMemories(query = {}) {
    console.log(`[QUANTUM_STATE: MEMORY_FLOW] Searching memories`);
    
    const { text, tags, source, limit = 10 } = query;
    let results = [];
    
    // If searching by tags
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagMatches = new Set();
      tags.forEach(tag => {
        if (this.memoryIndex.tags[tag]) {
          this.memoryIndex.tags[tag].forEach(id => tagMatches.add(id));
        }
      });
      results = [...tagMatches].map(id => this.memoryIndex.nodes[id]);
    }
    // If searching by source
    else if (source && this.memoryIndex.sources[source]) {
      results = this.memoryIndex.sources[source].map(id => this.memoryIndex.nodes[id]);
    }
    // Default to all memories
    else {
      results = Object.values(this.memoryIndex.nodes);
    }
    
    // Text search (very basic implementation)
    if (text && typeof text === 'string' && text.trim().length > 0) {
      results = results.filter(node => {
        // Load the full memory to search content
        try {
          const memoryPath = path.join(this.options.storagePath, node.path);
          const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
          return memory.content.toLowerCase().includes(text.toLowerCase());
        } catch (error) {
          console.error(`[QUANTUM_STATE: ERROR_FLOW] Error reading memory: ${error.message}`);
          return false;
        }
      });
    }
    
    // Sort by priority and timestamp
    results.sort((a, b) => {
      // First by priority (descending)
      if (b.metadata.priority !== a.metadata.priority) {
        return b.metadata.priority - a.metadata.priority;
      }
      // Then by timestamp (most recent first)
      return b.timestamp - a.timestamp;
    });
    
    // Apply limit
    if (limit > 0 && results.length > limit) {
      results = results.slice(0, limit);
    }
    
    console.log(`[QUANTUM_STATE: MEMORY_FLOW] Found ${results.length} matching memories`);
    return results;
  }
  
  /**
   * Get statistics about the memory database
   * @returns {Object} - Memory statistics
   */
  getMemoryStats() {
    const stats = {
      totalMemories: this.memoryIndex.count,
      lastUpdate: this.memoryIndex.lastUpdate,
      sourceBreakdown: {},
      topTags: [],
      coherenceStats: {
        averageCoherence: 0,
        averageExploration: 0
      }
    };
    
    // Source breakdown
    for (const source in this.memoryIndex.sources) {
      stats.sourceBreakdown[source] = this.memoryIndex.sources[source].length;
    }
    
    // Top tags
    const tagCounts = {};
    for (const tag in this.memoryIndex.tags) {
      tagCounts[tag] = this.memoryIndex.tags[tag].length;
    }
    stats.topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    
    // Coherence stats
    let totalCoherence = 0;
    let totalExploration = 0;
    let count = 0;
    
    Object.values(this.memoryIndex.nodes).forEach(node => {
      totalCoherence += node.metadata.coherenceScore || 0;
      totalExploration += node.metadata.explorationScore || 0;
      count++;
    });
    
    if (count > 0) {
      stats.coherenceStats.averageCoherence = totalCoherence / count;
      stats.coherenceStats.averageExploration = totalExploration / count;
    }
    
    console.log(`[QUANTUM_STATE: MEMORY_FLOW] Generated memory statistics`);
    return stats;
  }
}

module.exports = {
  MemoryImporter,
  MEMORY_TYPES,
  MEMORY_CONFIG
};