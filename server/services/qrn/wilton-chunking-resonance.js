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
 * Chunk size ranges in bytes
 */
export var ChunkSizeCategory;
(function (ChunkSizeCategory) {
    ChunkSizeCategory["MICRO"] = "micro";
    ChunkSizeCategory["SMALL"] = "small";
    ChunkSizeCategory["MEDIUM"] = "medium";
    ChunkSizeCategory["LARGE"] = "large"; // 100-300 KB
})(ChunkSizeCategory || (ChunkSizeCategory = {}));
/**
 * Semantic tag types
 */
export var SemanticTagType;
(function (SemanticTagType) {
    SemanticTagType["CONCEPT"] = "concept";
    SemanticTagType["ENTITY"] = "entity";
    SemanticTagType["ACTION"] = "action";
    SemanticTagType["PROPERTY"] = "property";
    SemanticTagType["RELATION"] = "relation";
    SemanticTagType["CONTEXT"] = "context";
    SemanticTagType["META"] = "meta";
})(SemanticTagType || (SemanticTagType = {}));
/**
 * Resonance levels
 */
export var ResonanceLevel;
(function (ResonanceLevel) {
    ResonanceLevel["NONE"] = "none";
    ResonanceLevel["LOW"] = "low";
    ResonanceLevel["MODERATE"] = "moderate";
    ResonanceLevel["HIGH"] = "high";
    ResonanceLevel["PERFECT"] = "perfect"; // 0.8-1.0
})(ResonanceLevel || (ResonanceLevel = {}));
/**
 * Chunk a content string based on optimal semantic boundaries.
 *
 * Part of the Wilton Formula Chunking phase.
 *
 * @param content Content to chunk
 * @param options Chunking options
 * @returns Array of content chunks
 */
export function chunkContent(content, options) {
    var startTime = Date.now();
    // Default options
    var opts = __assign({ preferredSizeCategory: ChunkSizeCategory.MEDIUM, minChunks: 1, maxChunks: 20, respectParagraphs: true, respectSentences: true }, options);
    // Calculate target byte size based on preferred category
    var targetByteSize = 50 * 1024; // Default 50KB (MEDIUM)
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
    var contentByteSize = new TextEncoder().encode(content).length;
    // Determine how many chunks to create
    var numChunks = Math.ceil(contentByteSize / targetByteSize);
    numChunks = Math.min(Math.max(numChunks, opts.minChunks), opts.maxChunks);
    // Initialize chunks array
    var chunks = [];
    // Respect structural elements when chunking
    if (opts.respectParagraphs) {
        // Split by paragraphs first (preserving line breaks in the chunks)
        var paragraphs = content.split(/(\r?\n\r?\n)/);
        var currentChunkContent = '';
        var currentByteSize = 0;
        var targetChunkSize = Math.ceil(contentByteSize / numChunks);
        for (var i = 0; i < paragraphs.length; i++) {
            var paragraph = paragraphs[i];
            var paragraphByteSize = new TextEncoder().encode(paragraph).length;
            // If adding this paragraph would exceed target and we already have content,
            // create a new chunk and start over
            if (currentByteSize > 0 &&
                currentByteSize + paragraphByteSize > targetChunkSize &&
                chunks.length < numChunks - 1) {
                chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
                currentChunkContent = paragraph;
                currentByteSize = paragraphByteSize;
            }
            else {
                // Add to current chunk
                currentChunkContent += paragraph;
                currentByteSize += paragraphByteSize;
            }
        }
        // Add the final chunk if not empty
        if (currentChunkContent.length > 0) {
            chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
        }
    }
    else if (opts.respectSentences) {
        // Split by sentences
        var sentenceRegex = /([.!?])\s+(?=[A-Z])/g;
        var sentences = content.split(sentenceRegex);
        var currentChunkContent = '';
        var currentByteSize = 0;
        var targetChunkSize = Math.ceil(contentByteSize / numChunks);
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            var sentenceByteSize = new TextEncoder().encode(sentence).length;
            // Similar logic as paragraphs
            if (currentByteSize > 0 &&
                currentByteSize + sentenceByteSize > targetChunkSize &&
                chunks.length < numChunks - 1) {
                chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
                currentChunkContent = sentence;
                currentByteSize = sentenceByteSize;
            }
            else {
                currentChunkContent += sentence;
                currentByteSize += sentenceByteSize;
            }
        }
        // Add the final chunk if not empty
        if (currentChunkContent.length > 0) {
            chunks.push(createChunk(currentChunkContent, opts.sourceId, opts.sourceName));
        }
    }
    else {
        // Simple byte-size based chunking without respecting structural elements
        var chunkSize = Math.ceil(content.length / numChunks);
        for (var i = 0; i < numChunks; i++) {
            var start = i * chunkSize;
            var end = Math.min(start + chunkSize, content.length);
            var chunkContent_1 = content.substring(start, end);
            chunks.push(createChunk(chunkContent_1, opts.sourceId, opts.sourceName, {
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
function createChunk(content, sourceId, sourceName, sourcePosition) {
    var byteSize = new TextEncoder().encode(content).length;
    var sizeCategory = ChunkSizeCategory.MEDIUM;
    // Determine size category based on byte size
    if (byteSize < 1000) {
        sizeCategory = ChunkSizeCategory.MICRO;
    }
    else if (byteSize < 10 * 1024) {
        sizeCategory = ChunkSizeCategory.SMALL;
    }
    else if (byteSize > 100 * 1024) {
        sizeCategory = ChunkSizeCategory.LARGE;
    }
    return {
        id: uuidv4(),
        content: content,
        byteSize: byteSize,
        sizeCategory: sizeCategory,
        tags: [],
        sourceId: sourceId,
        sourceName: sourceName,
        sourcePosition: sourcePosition,
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
export function generateSemanticTags(chunk, options) {
    var _a;
    // Default options
    var opts = __assign({ maxTags: 10, minConfidence: 0.6, preferredTagTypes: Object.values(SemanticTagType), existingTags: [], useAI: true }, options);
    // Copy the chunk to avoid modifying the original
    var taggedChunk = __assign(__assign({}, chunk), { tags: __spreadArray([], chunk.tags, true) });
    // Generate AI tags if enabled
    if (opts.useAI) {
        var aiTags = extractKeywordsAndConcepts(taggedChunk.content, {
            maxTags: Math.ceil(opts.maxTags * 0.7), // Reserve some slots for rule-based tags
            minConfidence: opts.minConfidence,
            tagTypes: opts.preferredTagTypes
        });
        (_a = taggedChunk.tags).push.apply(_a, aiTags);
    }
    // Add rule-based tags for specific structural patterns
    var ruleBasedTags = generateRuleBasedTags(taggedChunk.content, opts.preferredTagTypes, opts.existingTags);
    var _loop_1 = function (tag) {
        if (!taggedChunk.tags.some(function (t) { return t.name.toLowerCase() === tag.name.toLowerCase() && t.type === tag.type; })) {
            taggedChunk.tags.push(tag);
        }
    };
    // Merge tags, avoiding duplicates
    for (var _i = 0, ruleBasedTags_1 = ruleBasedTags; _i < ruleBasedTags_1.length; _i++) {
        var tag = ruleBasedTags_1[_i];
        _loop_1(tag);
    }
    // Limit to max tags, prioritizing by confidence
    if (taggedChunk.tags.length > opts.maxTags) {
        taggedChunk.tags.sort(function (a, b) { return b.confidence - a.confidence; });
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
export function establishResonanceLinks(chunks, options) {
    // Default options
    var opts = __assign({ minResonanceScore: 0.3, maxLinksPerChunk: 5, considerHumanFeedback: true, existingLinks: [] }, options);
    // Start with existing links
    var resonanceLinks = __spreadArray([], opts.existingLinks, true);
    // Create a map of chunk IDs to chunk objects for quick lookups
    var chunkMap = new Map();
    chunks.forEach(function (chunk) { return chunkMap.set(chunk.id, chunk); });
    var _loop_2 = function (i) {
        var sourceChunk = chunks[i];
        // Score resonance with every other chunk
        var chunkResonances = [];
        for (var j = 0; j < chunks.length; j++) {
            if (i === j)
                continue; // Skip self
            var targetChunk = chunks[j];
            var resonanceFactors = calculateChunkResonance(sourceChunk, targetChunk);
            // Calculate composite resonance score (weighted average of factors)
            var resonanceScore = (resonanceFactors.semanticSimilarity * 0.4 +
                resonanceFactors.contextualRelevance * 0.3 +
                (resonanceFactors.humanFeedback || 0.5) * 0.2 +
                resonanceFactors.aiConfidence * 0.1);
            // If score meets minimum threshold, add to candidates
            if (resonanceScore >= opts.minResonanceScore) {
                chunkResonances.push({
                    targetChunk: targetChunk,
                    score: resonanceScore,
                    factors: resonanceFactors
                });
            }
        }
        // Sort by resonance score descending and take top N
        chunkResonances.sort(function (a, b) { return b.score - a.score; });
        var topResonances = chunkResonances.slice(0, opts.maxLinksPerChunk);
        var _loop_3 = function (targetChunk, score, factors) {
            // Check if this link already exists
            var existingLink = resonanceLinks.find(function (link) { return link.sourceChunkId === sourceChunk.id && link.targetChunkId === targetChunk.id; });
            if (existingLink) {
                // Update existing link if scores change significantly
                if (Math.abs(existingLink.resonanceScore - score) > 0.1) {
                    existingLink.resonanceScore = score;
                    existingLink.resonanceLevel = getResonanceLevel(score);
                    existingLink.resonanceFactors = factors;
                    existingLink.updatedAt = new Date();
                }
            }
            else {
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
        };
        // Create resonance links for top resonances
        for (var _i = 0, topResonances_1 = topResonances; _i < topResonances_1.length; _i++) {
            var _a = topResonances_1[_i], targetChunk = _a.targetChunk, score = _a.score, factors = _a.factors;
            _loop_3(targetChunk, score, factors);
        }
    };
    // Process each chunk
    for (var i = 0; i < chunks.length; i++) {
        _loop_2(i);
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
export function applyWFCRS(content, options) {
    var startTime = Date.now();
    // Default options
    var opts = __assign({ preferredChunkSize: ChunkSizeCategory.MEDIUM, respectParagraphs: true, minResonanceScore: 0.3, existingTags: [], existingLinks: [] }, options);
    // Step 1: Chunk content
    var chunks = chunkContent(content, {
        preferredSizeCategory: opts.preferredChunkSize,
        respectParagraphs: opts.respectParagraphs,
        respectSentences: true,
        sourceId: opts.sourceId,
        sourceName: opts.sourceName
    });
    // Step 2: Generate semantic tags for each chunk
    var taggedChunks = chunks.map(function (chunk) {
        return generateSemanticTags(chunk, {
            existingTags: opts.existingTags
        });
    });
    // Step 3: Establish resonance links between chunks
    var resonanceLinks = establishResonanceLinks(taggedChunks, {
        minResonanceScore: opts.minResonanceScore,
        existingLinks: opts.existingLinks
    });
    // Collect unique tags
    var uniqueTags = new Map();
    for (var _i = 0, taggedChunks_1 = taggedChunks; _i < taggedChunks_1.length; _i++) {
        var chunk = taggedChunks_1[_i];
        for (var _a = 0, _b = chunk.tags; _a < _b.length; _a++) {
            var tag = _b[_a];
            uniqueTags.set(tag.id, tag);
        }
    }
    // Calculate metrics
    var totalChunks = taggedChunks.length;
    var totalByteSize = taggedChunks.reduce(function (sum, chunk) { return sum + chunk.byteSize; }, 0);
    var averageChunkSize = totalChunks > 0 ? totalByteSize / totalChunks : 0;
    var uniqueTagsCount = uniqueTags.size;
    var totalTags = taggedChunks.reduce(function (sum, chunk) { return sum + chunk.tags.length; }, 0);
    var averageTagsPerChunk = totalChunks > 0 ? totalTags / totalChunks : 0;
    // Maximum possible links (n * (n-1))
    var maxPossibleLinks = totalChunks * (totalChunks - 1);
    var resonanceGraphDensity = maxPossibleLinks > 0 ? resonanceLinks.length / maxPossibleLinks : 0;
    var highResonanceLinks = resonanceLinks.filter(function (link) { return link.resonanceLevel === ResonanceLevel.HIGH || link.resonanceLevel === ResonanceLevel.PERFECT; }).length;
    // Generate recommendations
    var recommendations = generateWFCRSRecommendations(taggedChunks, resonanceLinks, {
        averageChunkSize: averageChunkSize,
        averageTagsPerChunk: averageTagsPerChunk,
        resonanceGraphDensity: resonanceGraphDensity,
        highResonanceLinks: highResonanceLinks
    });
    var processingTimeMs = Date.now() - startTime;
    // Return final result
    return {
        chunks: taggedChunks,
        tags: Array.from(uniqueTags.values()),
        resonanceLinks: resonanceLinks,
        metrics: {
            totalChunks: totalChunks,
            averageChunkSize: averageChunkSize,
            uniqueTags: uniqueTagsCount,
            averageTagsPerChunk: averageTagsPerChunk,
            resonanceGraphDensity: resonanceGraphDensity,
            highResonanceLinks: highResonanceLinks,
            processingTimeMs: processingTimeMs
        },
        recommendations: recommendations
    };
}
/**
 * Generate recommendations based on WF-CRS results
 */
function generateWFCRSRecommendations(chunks, resonanceLinks, metrics) {
    var recommendations = [];
    // Chunk size recommendations
    if (metrics.averageChunkSize < 1000) {
        recommendations.push("Consider using larger chunks to capture more context.");
    }
    else if (metrics.averageChunkSize > 200 * 1024) {
        recommendations.push("Consider using smaller chunks for more granular processing.");
    }
    // Tag recommendations
    if (metrics.averageTagsPerChunk < 3) {
        recommendations.push("Add more semantic tags to improve resonance detection.");
    }
    // Resonance recommendations
    if (metrics.resonanceGraphDensity < 0.1) {
        recommendations.push("Content appears disconnected. Consider adding more cohesive elements.");
    }
    else if (metrics.resonanceGraphDensity > 0.8) {
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
function calculateChunkResonance(sourceChunk, targetChunk) {
    // Calculate semantic similarity based on common tags
    var semanticSimilarity = 0;
    if (sourceChunk.tags.length > 0 && targetChunk.tags.length > 0) {
        var sourceTagNames = sourceChunk.tags.map(function (tag) { return tag.name.toLowerCase(); });
        var targetTagNames_1 = targetChunk.tags.map(function (tag) { return tag.name.toLowerCase(); });
        // Find common tags
        var commonTags = sourceTagNames.filter(function (tag) { return targetTagNames_1.includes(tag); });
        // Weight by tag confidence
        var weightedCommonness = 0;
        var _loop_4 = function (commonTag) {
            var sourceTag = sourceChunk.tags.find(function (t) { return t.name.toLowerCase() === commonTag; });
            var targetTag = targetChunk.tags.find(function (t) { return t.name.toLowerCase() === commonTag; });
            // Average the confidence scores of the common tag
            weightedCommonness += (sourceTag.confidence + targetTag.confidence) / 2;
        };
        for (var _i = 0, commonTags_1 = commonTags; _i < commonTags_1.length; _i++) {
            var commonTag = commonTags_1[_i];
            _loop_4(commonTag);
        }
        // Normalize by the number of tags in the smaller set
        var minTagCount = Math.min(sourceChunk.tags.length, targetChunk.tags.length);
        semanticSimilarity = minTagCount > 0 ? weightedCommonness / minTagCount : 0;
    }
    // Calculate contextual relevance (simplified)
    // In a real implementation, this would use more sophisticated NLP techniques
    var contextualRelevance = 0;
    // Simple term frequency similarity (Jaccard index on terms)
    var sourceTerms = new Set(sourceChunk.content.toLowerCase().split(/\s+/).filter(function (term) { return term.length > 3; }));
    var targetTerms = new Set(targetChunk.content.toLowerCase().split(/\s+/).filter(function (term) { return term.length > 3; }));
    // Calculate intersection size
    var intersectionSize = 0;
    for (var _a = 0, sourceTerms_1 = sourceTerms; _a < sourceTerms_1.length; _a++) {
        var term = sourceTerms_1[_a];
        if (targetTerms.has(term)) {
            intersectionSize++;
        }
    }
    // Calculate union size
    var unionSize = sourceTerms.size + targetTerms.size - intersectionSize;
    // Jaccard similarity
    contextualRelevance = unionSize > 0 ? intersectionSize / unionSize : 0;
    // AI confidence - aggregate confidence of all tags
    var aiConfidence = Math.min(0.9, // Cap at 0.9 to leave room for improvement
    sourceChunk.tags.reduce(function (sum, tag) { return sum + tag.confidence; }, 0) /
        Math.max(1, sourceChunk.tags.length));
    return {
        semanticSimilarity: semanticSimilarity,
        contextualRelevance: contextualRelevance,
        aiConfidence: aiConfidence
    };
}
/**
 * Determine resonance level based on score
 */
function getResonanceLevel(score) {
    if (score >= 0.8)
        return ResonanceLevel.PERFECT;
    if (score >= 0.6)
        return ResonanceLevel.HIGH;
    if (score >= 0.4)
        return ResonanceLevel.MODERATE;
    if (score >= 0.2)
        return ResonanceLevel.LOW;
    return ResonanceLevel.NONE;
}
/**
 * Extract keywords and concepts from text
 *
 * This is a simplified implementation. In a real-world scenario, this would
 * use a natural language processing service or library.
 */
function extractKeywordsAndConcepts(text, options) {
    var tags = [];
    // Simple keyword extraction (very simplified)
    // A real implementation would use proper NLP techniques
    // Extract potential tags (words or short phrases)
    var words = text.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 3; });
    var wordFrequency = new Map();
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        var count = wordFrequency.get(word) || 0;
        wordFrequency.set(word, count + 1);
    }
    // Sort by frequency
    var sortedWords = Array.from(wordFrequency.entries())
        .sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, options.maxTags * 2); // Get more candidates than needed
    // Convert to tags
    for (var _a = 0, sortedWords_1 = sortedWords; _a < sortedWords_1.length; _a++) {
        var _b = sortedWords_1[_a], word = _b[0], frequency = _b[1];
        // Determine normalized frequency (crude confidence score)
        var normalizedFrequency = Math.min(1.0, frequency / Math.max(words.length / 20, 3));
        // Skip if below confidence threshold
        if (normalizedFrequency < options.minConfidence)
            continue;
        // Assign a tag type (simplified logic)
        var tagType = SemanticTagType.CONCEPT; // Default
        // Very simple type detection (real implementation would use NLP)
        if (word.endsWith('ing')) {
            tagType = SemanticTagType.ACTION;
        }
        else if (word.endsWith('ed')) {
            tagType = SemanticTagType.ACTION;
        }
        else if (word.length > 6 && /[A-Z]/.test(word)) {
            tagType = SemanticTagType.ENTITY;
        }
        // Skip if tag type not in preferred types
        if (!options.tagTypes.includes(tagType))
            continue;
        // Add as tag
        tags.push({
            id: uuidv4(),
            type: tagType,
            name: word,
            confidence: normalizedFrequency,
            source: 'ai'
        });
        // Stop once we have enough tags
        if (tags.length >= options.maxTags)
            break;
    }
    return tags;
}
/**
 * Generate rule-based tags based on content patterns
 */
function generateRuleBasedTags(content, preferredTagTypes, existingTags) {
    var tags = [];
    // Look for common patterns in the text
    // Check for dates (simple pattern)
    var datePattern = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/g;
    var dates = content.match(datePattern);
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
    var urlPattern = /https?:\/\/[^\s]+/g;
    var urls = content.match(urlPattern);
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
    var technicalTerms = [
        'algorithm', 'framework', 'implementation', 'protocol', 'interface',
        'function', 'module', 'component', 'architecture', 'database',
        'neural', 'quantum', 'resonance', 'cognitive', 'pathways'
    ];
    var techTermCount = 0;
    for (var _i = 0, technicalTerms_1 = technicalTerms; _i < technicalTerms_1.length; _i++) {
        var term = technicalTerms_1[_i];
        var regex = new RegExp("\\b".concat(term, "\\b"), 'i');
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
