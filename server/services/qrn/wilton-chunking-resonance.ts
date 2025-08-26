/**
 * Wilton Formula Chunking & Cognitive Resonance (WF-CRS)
 * 
 * Implementation of:
 * Chunk (300 bytes-300KB) → Semantic Tagging → Resonance Embedding (AI+Human Contextual Relevance)
 * 
 * This module provides a comprehensive implementation of the WF-CRS framework, which
 * enables effective chunking of data and content while maintaining semantic coherence 
 * and establishing resonance between related elements.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Chunk size ranges in bytes
 */
export enum ChunkSizeCategory {
  MICRO = 'micro',     // 300-1000 bytes
  SMALL = 'small',     // 1-10 KB
  MEDIUM = 'medium',   // 10-100 KB
  LARGE = 'large'      // 100-300 KB
}

/**
 * Semantic tag types
 */
export enum SemanticTagType {
  CONCEPT = 'concept',
  ENTITY = 'entity',
  ACTION = 'action',
  PROPERTY = 'property',
  RELATION = 'relation',
  CONTEXT = 'context',
  META = 'meta'
}

/**
 * Resonance levels
 */
export enum ResonanceLevel {
  NONE = 'none',           // 0.0-0.2
  LOW = 'low',             // 0.2-0.4
  MODERATE = 'moderate',   // 0.4-0.6
  HIGH = 'high',           // 0.6-0.8
  PERFECT = 'perfect'      // 0.8-1.0
}

/**
 * Semantic tag structure
 */
export interface SemanticTag {
  id: string;
  type: SemanticTagType;
  name: string;
  confidence: number;  // 0.0-1.0
  source: 'ai' | 'human' | 'hybrid';
  parentTags?: string[];  // IDs of parent/broader tags
  relatedTags?: string[];  // IDs of related tags
  metadata?: Record<string, any>;
}

/**
 * Content chunk structure
 */
export interface ContentChunk {
  id: string;
  content: string;
  byteSize: number;
  sizeCategory: ChunkSizeCategory;
  tags: SemanticTag[];
  sourceId?: string;  // ID of source content/document
  sourceName?: string;
  sourcePosition?: {
    startIndex: number;
    endIndex: number;
  };
  createdAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Resonance link between chunks
 */
export interface ResonanceLink {
  id: string;
  sourceChunkId: string;
  targetChunkId: string;
  resonanceScore: number;  // 0.0-1.0
  resonanceLevel: ResonanceLevel;
  resonanceFactors: {
    semanticSimilarity: number;  // 0.0-1.0
    contextualRelevance: number;  // 0.0-1.0
    humanFeedback?: number;  // 0.0-1.0
    aiConfidence: number;  // 0.0-1.0
  };
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * WF-CRS processing result
 */
export interface WFCRSResult {
  chunks: ContentChunk[];
  tags: SemanticTag[];
  resonanceLinks: ResonanceLink[];
  metrics: {
    totalChunks: number;
    averageChunkSize: number;
    uniqueTags: number;
    averageTagsPerChunk: number;
    resonanceGraphDensity: number;  // 0.0-1.0
    highResonanceLinks: number;
    processingTimeMs: number;
  };
  recommendations?: string[];
}

/**
 * Chunk a content string based on optimal semantic boundaries.
 * 
 * Part of the Wilton Formula Chunking phase.
 * 
 * @param content Content to chunk
 * @param options Chunking options
 * @returns Array of content chunks
 */
export function chunkContent(
  content: string,
  options?: {
    preferredSizeCategory?: ChunkSizeCategory,
    minChunks?: number,
    maxChunks?: number,
    respectParagraphs?: boolean,
    respectSentences?: boolean,
    sourceId?: string,
    sourceName?: string
  }
): ContentChunk[] {
  const startTime = Date.now();
  
  // Default options
  const opts = {
    preferredSizeCategory: ChunkSizeCategory.MEDIUM,
    minChunks: 1,
    maxChunks: 20,
    respectParagraphs: true,
    respectSentences: true,
    ...options
  };
  
  // Calculate target byte size based on preferred category
  let targetByteSize = 50 * 1024; // Default 50KB (MEDIUM)
  switch (opts.preferredSizeCategory) {
    case ChunkSizeCategory.MICRO:
      targetByteSize = 500; // 500 bytes
      break;
    case ChunkSizeCategory.SMALL:
      targetByteSize = 5 * 1024; // 5KB
      break;
    case ChunkSizeCategory.LARGE:
      targetByteSize = 200 * 1024; // 200KB
      break;
  }
  
  // Calculate total content size
  const contentByteSize = new TextEncoder().encode(content).length;
  
  // Determine how many chunks to create
  let numChunks = Math.ceil(contentByteSize / targetByteSize);
  numChunks = Math.min(Math.max(numChunks, opts.minChunks), opts.maxChunks);
  
  // Initialize chunks array
  const chunks: ContentChunk[] = [];
  
  // Respect structural elements when chunking
  if (opts.respectParagraphs) {
    // Split by paragraphs first (preserving line breaks in the chunks)
    const paragraphs = content.split(/(\r?\n\r?\n)/);
    
    let currentChunkContent = '';
    let currentByteSize = 0;
    const targetChunkSize = Math.ceil(contentByteSize / numChunks);
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const paragraphByteSize = new TextEncoder().encode(paragraph).length;
      
      // If adding this paragraph would exceed target and we already have content,
      // create a new chunk and start over
      if (currentByteSize > 0 && 
          currentByteSize + paragraphByteSize > targetChunkSize &&
          chunks.length < numChunks - 1) {
        
        chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
        currentChunkContent = paragraph;
        currentByteSize = paragraphByteSize;
      } else {
        // Add to current chunk
        currentChunkContent += paragraph;
        currentByteSize += paragraphByteSize;
      }
    }
    
    // Add the final chunk if not empty
    if (currentChunkContent.length > 0) {
      chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
    }
  } else if (opts.respectSentences) {
    // Split by sentences
    const sentenceRegex = /([.!?])\s+(?=[A-Z])/g;
    const sentences = content.split(sentenceRegex);
    
    let currentChunkContent = '';
    let currentByteSize = 0;
    const targetChunkSize = Math.ceil(contentByteSize / numChunks);
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const sentenceByteSize = new TextEncoder().encode(sentence).length;
      
      // Similar logic as paragraphs
      if (currentByteSize > 0 && 
          currentByteSize + sentenceByteSize > targetChunkSize &&
          chunks.length < numChunks - 1) {
        
        chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
        currentChunkContent = sentence;
        currentByteSize = sentenceByteSize;
      } else {
        currentChunkContent += sentence;
        currentByteSize += sentenceByteSize;
      }
    }
    
    // Add the final chunk if not empty
    if (currentChunkContent.length > 0) {
      chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
    }
  } else {
    // Simple byte-size based chunking without respecting structural elements
    const chunkSize = Math.ceil(content.length / numChunks);
    
    for (let i = 0; i < numChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, content.length);
      const chunkContent = content.substring(start, end);
      
      chunks.push(createChunk(chunkContent, opts.sourceId, opts.sourceName, {
        startIndex: start,
        endIndex: end
      }));
    }
  }
  
  return chunks;
}

/**
 * Create a new content chunk with basic metadata
 */
function createChunk(
  content: string, 
  sourceId?: string, 
  sourceName?: string,
  sourcePosition?: { startIndex: number, endIndex: number }
): ContentChunk {
  const byteSize = new TextEncoder().encode(content).length;
  let sizeCategory = ChunkSizeCategory.MEDIUM;
  
  // Determine size category based on byte size
  if (byteSize < 1000) {
    sizeCategory = ChunkSizeCategory.MICRO;
  } else if (byteSize < 10 * 1024) {
    sizeCategory = ChunkSizeCategory.SMALL;
  } else if (byteSize > 100 * 1024) {
    sizeCategory = ChunkSizeCategory.LARGE;
  }
  
  return {
    id: uuidv4(),
    content,
    byteSize,
    sizeCategory,
    tags: [],
    sourceId,
    sourceName,
    sourcePosition,
    createdAt: new Date()
  };
}

/**
 * Extract semantic tags from a content chunk
 * 
 * Part of the Wilton Formula Semantic Tagging phase.
 * 
 * @param chunk Content chunk to tag
 * @param options Tagging options
 * @returns Updated chunk with semantic tags
 */
export function generateSemanticTags(
  chunk: ContentChunk,
  options?: {
    maxTags?: number,
    minConfidence?: number,
    preferredTagTypes?: SemanticTagType[],
    existingTags?: SemanticTag[],
    useAI?: boolean
  }
): ContentChunk {
  // Default options
  const opts = {
    maxTags: 10,
    minConfidence: 0.6,
    preferredTagTypes: Object.values(SemanticTagType),
    existingTags: [] as SemanticTag[],
    useAI: true,
    ...options
  };
  
  // Copy the chunk to avoid modifying the original
  const taggedChunk = { ...chunk, tags: [...chunk.tags] };
  
  // Generate AI tags if enabled
  if (opts.useAI) {
    const aiTags = extractKeywordsAndConcepts(taggedChunk.content, {
      maxTags: Math.ceil(opts.maxTags * 0.7), // Reserve some slots for rule-based tags
      minConfidence: opts.minConfidence,
      tagTypes: opts.preferredTagTypes
    });
    
    taggedChunk.tags.push(...aiTags);
  }
  
  // Add rule-based tags for specific structural patterns
  const ruleBasedTags = generateRuleBasedTags(
    taggedChunk.content, 
    opts.preferredTagTypes,
    opts.existingTags
  );
  
  // Merge tags, avoiding duplicates
  for (const tag of ruleBasedTags) {
    if (!taggedChunk.tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase() && t.type === tag.type)) {
      taggedChunk.tags.push(tag);
    }
  }
  
  // Limit to max tags, prioritizing by confidence
  if (taggedChunk.tags.length > opts.maxTags) {
    taggedChunk.tags.sort((a, b) => b.confidence - a.confidence);
    taggedChunk.tags = taggedChunk.tags.slice(0, opts.maxTags);
  }
  
  return taggedChunk;
}

/**
 * Establish resonance links between chunks based on their semantic tags
 * 
 * Part of the Wilton Formula Resonance Embedding phase.
 * 
 * @param chunks Array of content chunks with tags
 * @param options Resonance options
 * @returns Array of resonance links
 */
export function establishResonanceLinks(
  chunks: ContentChunk[],
  options?: {
    minResonanceScore?: number,
    maxLinksPerChunk?: number,
    considerHumanFeedback?: boolean,
    existingLinks?: ResonanceLink[]
  }
): ResonanceLink[] {
  // Default options
  const opts = {
    minResonanceScore: 0.3,
    maxLinksPerChunk: 5,
    considerHumanFeedback: true,
    existingLinks: [] as ResonanceLink[],
    ...options
  };
  
  // Start with existing links
  const resonanceLinks = [...opts.existingLinks];
  
  // Create a map of chunk IDs to chunk objects for quick lookups
  const chunkMap = new Map<string, ContentChunk>();
  chunks.forEach(chunk => chunkMap.set(chunk.id, chunk));
  
  // Process each chunk
  for (let i = 0; i < chunks.length; i++) {
    const sourceChunk = chunks[i];
    
    // Score resonance with every other chunk
    const chunkResonances: {targetChunk: ContentChunk, score: number, factors: any}[] = [];
    
    for (let j = 0; j < chunks.length; j++) {
      if (i === j) continue; // Skip self
      
      const targetChunk = chunks[j];
      const resonanceFactors = calculateChunkResonance(sourceChunk, targetChunk);
      
      // Calculate composite resonance score (weighted average of factors)
      const resonanceScore = (
        resonanceFactors.semanticSimilarity * 0.4 +
        resonanceFactors.contextualRelevance * 0.3 +
        (resonanceFactors.humanFeedback || 0.5) * 0.2 +
        resonanceFactors.aiConfidence * 0.1
      );
      
      // If score meets minimum threshold, add to candidates
      if (resonanceScore >= opts.minResonanceScore) {
        chunkResonances.push({
          targetChunk,
          score: resonanceScore,
          factors: resonanceFactors
        });
      }
    }
    
    // Sort by resonance score descending and take top N
    chunkResonances.sort((a, b) => b.score - a.score);
    const topResonances = chunkResonances.slice(0, opts.maxLinksPerChunk);
    
    // Create resonance links for top resonances
    for (const { targetChunk, score, factors } of topResonances) {
      // Check if this link already exists
      const existingLink = resonanceLinks.find(
        link => link.sourceChunkId === sourceChunk.id && link.targetChunkId === targetChunk.id
      );
      
      if (existingLink) {
        // Update existing link if scores change significantly
        if (Math.abs(existingLink.resonanceScore - score) > 0.1) {
          existingLink.resonanceScore = score;
          existingLink.resonanceLevel = getResonanceLevel(score);
          existingLink.resonanceFactors = factors;
          existingLink.updatedAt = new Date();
        }
      } else {
        // Create new resonance link
        resonanceLinks.push({
          id: uuidv4(),
          sourceChunkId: sourceChunk.id,
          targetChunkId: targetChunk.id,
          resonanceScore: score,
          resonanceLevel: getResonanceLevel(score),
          resonanceFactors: factors,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  }
  
  return resonanceLinks;
}

/**
 * Apply the complete Wilton Formula Chunking & Cognitive Resonance process
 * 
 * Chunk → Semantic Tagging → Resonance Embedding
 * 
 * @param content Content to process
 * @param options Processing options
 * @returns WF-CRS processing result
 */
export function applyWFCRS(
  content: string,
  options?: {
    preferredChunkSize?: ChunkSizeCategory,
    respectParagraphs?: boolean,
    minResonanceScore?: number,
    existingTags?: SemanticTag[],
    existingLinks?: ResonanceLink[],
    sourceId?: string,
    sourceName?: string
  }
): WFCRSResult {
  const startTime = Date.now();
  
  // Default options
  const opts = {
    preferredChunkSize: ChunkSizeCategory.MEDIUM,
    respectParagraphs: true,
    minResonanceScore: 0.3,
    existingTags: [] as SemanticTag[],
    existingLinks: [] as ResonanceLink[],
    ...options
  };
  
  // Step 1: Chunk content
  const chunks = chunkContent(content, {
    preferredSizeCategory: opts.preferredChunkSize,
    respectParagraphs: opts.respectParagraphs,
    respectSentences: true,
    sourceId: opts.sourceId,
    sourceName: opts.sourceName
  });
  
  // Step 2: Generate semantic tags for each chunk
  const taggedChunks = chunks.map(chunk => 
    generateSemanticTags(chunk, {
      existingTags: opts.existingTags
    })
  );
  
  // Step 3: Establish resonance links between chunks
  const resonanceLinks = establishResonanceLinks(taggedChunks, {
    minResonanceScore: opts.minResonanceScore,
    existingLinks: opts.existingLinks
  });
  
  // Collect unique tags
  const uniqueTags = new Map<string, SemanticTag>();
  for (const chunk of taggedChunks) {
    for (const tag of chunk.tags) {
      uniqueTags.set(tag.id, tag);
    }
  }
  
  // Calculate metrics
  const totalChunks = taggedChunks.length;
  const totalByteSize = taggedChunks.reduce((sum, chunk) => sum + chunk.byteSize, 0);
  const averageChunkSize = totalChunks > 0 ? totalByteSize / totalChunks : 0;
  
  const uniqueTagsCount = uniqueTags.size;
  const totalTags = taggedChunks.reduce((sum, chunk) => sum + chunk.tags.length, 0);
  const averageTagsPerChunk = totalChunks > 0 ? totalTags / totalChunks : 0;
  
  // Maximum possible links (n * (n-1))
  const maxPossibleLinks = totalChunks * (totalChunks - 1);
  const resonanceGraphDensity = maxPossibleLinks > 0 ? resonanceLinks.length / maxPossibleLinks : 0;
  
  const highResonanceLinks = resonanceLinks.filter(
    link => link.resonanceLevel === ResonanceLevel.HIGH || link.resonanceLevel === ResonanceLevel.PERFECT
  ).length;
  
  // Generate recommendations
  const recommendations = generateWFCRSRecommendations(
    taggedChunks,
    resonanceLinks,
    {
      averageChunkSize,
      averageTagsPerChunk,
      resonanceGraphDensity,
      highResonanceLinks
    }
  );
  
  const processingTimeMs = Date.now() - startTime;
  
  // Return final result
  return {
    chunks: taggedChunks,
    tags: Array.from(uniqueTags.values()),
    resonanceLinks,
    metrics: {
      totalChunks,
      averageChunkSize,
      uniqueTags: uniqueTagsCount,
      averageTagsPerChunk,
      resonanceGraphDensity,
      highResonanceLinks,
      processingTimeMs
    },
    recommendations
  };
}

/**
 * Generate recommendations based on WF-CRS results
 */
function generateWFCRSRecommendations(
  chunks: ContentChunk[],
  resonanceLinks: ResonanceLink[],
  metrics: {
    averageChunkSize: number,
    averageTagsPerChunk: number,
    resonanceGraphDensity: number,
    highResonanceLinks: number
  }
): string[] {
  const recommendations: string[] = [];
  
  // Chunk size recommendations
  if (metrics.averageChunkSize < 1000) {
    recommendations.push("Consider using larger chunks to capture more context.");
  } else if (metrics.averageChunkSize > 200 * 1024) {
    recommendations.push("Consider using smaller chunks for more granular processing.");
  }
  
  // Tag recommendations
  if (metrics.averageTagsPerChunk < 3) {
    recommendations.push("Add more semantic tags to improve resonance detection.");
  }
  
  // Resonance recommendations
  if (metrics.resonanceGraphDensity < 0.1) {
    recommendations.push("Content appears disconnected. Consider adding more cohesive elements.");
  } else if (metrics.resonanceGraphDensity > 0.8) {
    recommendations.push("Content appears highly interconnected. Consider more focused chunks.");
  }
  
  // High resonance links
  if (metrics.highResonanceLinks === 0 && chunks.length > 1) {
    recommendations.push("No high-resonance connections found. Content may lack cohesive themes.");
  }
  
  // If no issues found
  if (recommendations.length === 0) {
    recommendations.push("Optimal chunking and resonance achieved. No changes recommended.");
  }
  
  return recommendations;
}

/**
 * Calculate resonance between two chunks based on their tags and content
 */
function calculateChunkResonance(
  sourceChunk: ContentChunk,
  targetChunk: ContentChunk
): {
  semanticSimilarity: number;
  contextualRelevance: number;
  humanFeedback?: number;
  aiConfidence: number;
} {
  // Calculate semantic similarity based on common tags
  let semanticSimilarity = 0;
  if (sourceChunk.tags.length > 0 && targetChunk.tags.length > 0) {
    const sourceTagNames = sourceChunk.tags.map(tag => tag.name.toLowerCase());
    const targetTagNames = targetChunk.tags.map(tag => tag.name.toLowerCase());
    
    // Find common tags
    const commonTags = sourceTagNames.filter(tag => targetTagNames.includes(tag));
    
    // Weight by tag confidence
    let weightedCommonness = 0;
    for (const commonTag of commonTags) {
      const sourceTag = sourceChunk.tags.find(t => t.name.toLowerCase() === commonTag)!;
      const targetTag = targetChunk.tags.find(t => t.name.toLowerCase() === commonTag)!;
      
      // Average the confidence scores of the common tag
      weightedCommonness += (sourceTag.confidence + targetTag.confidence) / 2;
    }
    
    // Normalize by the number of tags in the smaller set
    const minTagCount = Math.min(sourceChunk.tags.length, targetChunk.tags.length);
    semanticSimilarity = minTagCount > 0 ? weightedCommonness / minTagCount : 0;
  }
  
  // Calculate contextual relevance (simplified)
  // In a real implementation, this would use more sophisticated NLP techniques
  let contextualRelevance = 0;
  
  // Simple term frequency similarity (Jaccard index on terms)
  const sourceTerms = new Set(sourceChunk.content.toLowerCase().split(/\s+/).filter(term => term.length > 3));
  const targetTerms = new Set(targetChunk.content.toLowerCase().split(/\s+/).filter(term => term.length > 3));
  
  // Calculate intersection size
  let intersectionSize = 0;
  for (const term of sourceTerms) {
    if (targetTerms.has(term)) {
      intersectionSize++;
    }
  }
  
  // Calculate union size
  const unionSize = sourceTerms.size + targetTerms.size - intersectionSize;
  
  // Jaccard similarity
  contextualRelevance = unionSize > 0 ? intersectionSize / unionSize : 0;
  
  // AI confidence - aggregate confidence of all tags
  const aiConfidence = Math.min(
    0.9,  // Cap at 0.9 to leave room for improvement
    sourceChunk.tags.reduce((sum, tag) => sum + tag.confidence, 0) / 
      Math.max(1, sourceChunk.tags.length)
  );
  
  return {
    semanticSimilarity,
    contextualRelevance,
    aiConfidence
  };
}

/**
 * Determine resonance level based on score
 */
function getResonanceLevel(score: number): ResonanceLevel {
  if (score >= 0.8) return ResonanceLevel.PERFECT;
  if (score >= 0.6) return ResonanceLevel.HIGH;
  if (score >= 0.4) return ResonanceLevel.MODERATE;
  if (score >= 0.2) return ResonanceLevel.LOW;
  return ResonanceLevel.NONE;
}

/**
 * Extract keywords and concepts from text
 * 
 * This is a simplified implementation. In a real-world scenario, this would
 * use a natural language processing service or library.
 */
function extractKeywordsAndConcepts(
  text: string, 
  options: {
    maxTags: number,
    minConfidence: number,
    tagTypes: SemanticTagType[]
  }
): SemanticTag[] {
  const tags: SemanticTag[] = [];
  
  // Simple keyword extraction (very simplified)
  // A real implementation would use proper NLP techniques
  
  // Extract potential tags (words or short phrases)
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const wordFrequency = new Map<string, number>();
  
  for (const word of words) {
    const count = wordFrequency.get(word) || 0;
    wordFrequency.set(word, count + 1);
  }
  
  // Sort by frequency
  const sortedWords = Array.from(wordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, options.maxTags * 2);  // Get more candidates than needed
  
  // Convert to tags
  for (const [word, frequency] of sortedWords) {
    // Determine normalized frequency (crude confidence score)
    const normalizedFrequency = Math.min(1.0, frequency / Math.max(words.length / 20, 3));
    
    // Skip if below confidence threshold
    if (normalizedFrequency < options.minConfidence) continue;
    
    // Assign a tag type (simplified logic)
    let tagType = SemanticTagType.CONCEPT;  // Default
    
    // Very simple type detection (real implementation would use NLP)
    if (word.endsWith('ing')) {
      tagType = SemanticTagType.ACTION;
    } else if (word.endsWith('ed')) {
      tagType = SemanticTagType.ACTION;
    } else if (word.length > 6 && /[A-Z]/.test(word)) {
      tagType = SemanticTagType.ENTITY;
    }
    
    // Skip if tag type not in preferred types
    if (!options.tagTypes.includes(tagType)) continue;
    
    // Add as tag
    tags.push({
      id: uuidv4(),
      type: tagType,
      name: word,
      confidence: normalizedFrequency,
      source: 'ai'
    });
    
    // Stop once we have enough tags
    if (tags.length >= options.maxTags) break;
  }
  
  return tags;
}

/**
 * Generate rule-based tags based on content patterns
 */
function generateRuleBasedTags(
  content: string,
  preferredTagTypes: SemanticTagType[],
  existingTags: SemanticTag[]
): SemanticTag[] {
  const tags: SemanticTag[] = [];
  
  // Look for common patterns in the text
  
  // Check for dates (simple pattern)
  const datePattern = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/g;
  const dates = content.match(datePattern);
  
  if (dates && dates.length > 0 && preferredTagTypes.includes(SemanticTagType.CONTEXT)) {
    tags.push({
      id: uuidv4(),
      type: SemanticTagType.CONTEXT,
      name: 'temporal_reference',
      confidence: 0.9,
      source: 'hybrid'
    });
  }
  
  // Check for URLs
  const urlPattern = /https?:\/\/[^\s]+/g;
  const urls = content.match(urlPattern);
  
  if (urls && urls.length > 0 && preferredTagTypes.includes(SemanticTagType.ENTITY)) {
    tags.push({
      id: uuidv4(),
      type: SemanticTagType.ENTITY,
      name: 'web_reference',
      confidence: 0.95,
      source: 'hybrid'
    });
  }
  
  // Check for technical terminology (simplified)
  const technicalTerms = [
    'algorithm', 'framework', 'implementation', 'protocol', 'interface',
    'function', 'module', 'component', 'architecture', 'database',
    'neural', 'quantum', 'resonance', 'cognitive', 'pathways'
  ];
  
  let techTermCount = 0;
  for (const term of technicalTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(content)) {
      techTermCount++;
    }
  }
  
  if (techTermCount >= 2 && preferredTagTypes.includes(SemanticTagType.CONCEPT)) {
    tags.push({
      id: uuidv4(),
      type: SemanticTagType.CONCEPT,
      name: 'technical_content',
      confidence: Math.min(0.7 + (techTermCount * 0.05), 0.95),
      source: 'hybrid'
    });
  }
  
  return tags;
}