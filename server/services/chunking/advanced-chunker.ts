/**
 * Advanced Chunking System for Large Text Files
 * Implements multi-level chunking with semantic analysis and hierarchical organization
 */

import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { 
  ChunkOptions, 
  ChunkResult, 
  SemanticNode,
  ChunkMetadata,
  ChunkingStrategy,
  ChunkRelation
} from './chunking-types';

/**
 * 3:1 ↔ 1:3 Ratio-based chunking system
 * Based on the golden ratio principle (0.75/0.25) applied recursively
 */
export class AdvancedChunker {
  private readonly options: ChunkOptions;
  private readonly outputDir: string;
  private chunkCounter: number = 0;
  
  constructor(options: ChunkOptions) {
    this.options = {
      minChunkSize: options.minChunkSize || 1000,
      maxChunkSize: options.maxChunkSize || 10000,
      overlapPercentage: options.overlapPercentage || 15,
      semanticThreshold: options.semanticThreshold || 0.75,
      strategy: options.strategy || ChunkingStrategy.SEMANTIC,
      outputDir: options.outputDir || path.join(process.cwd(), 'chunked-output'),
      hierarchyLevels: options.hierarchyLevels || 3,
      metadataExtraction: options.metadataExtraction || true,
      preserveFormatting: options.preserveFormatting || true,
    };
    
    this.outputDir = this.options.outputDir;
  }
  
  /**
   * Process a file using advanced chunking algorithm
   * @param filePath Path to the file to process
   * @returns Promise<ChunkResult> Result of chunking operation
   */
  public async processFile(filePath: string): Promise<ChunkResult> {
    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });
      
      // Read the file
      const content = await fs.readFile(filePath, 'utf8');
      
      // Extract the file extension to determine processing approach
      const fileExt = path.extname(filePath).toLowerCase();
      
      let chunks: SemanticNode[];
      
      // Process based on file type
      switch (fileExt) {
        case '.json':
          chunks = await this.processJsonContent(content);
          break;
        case '.html':
          chunks = await this.processHtmlContent(content);
          break;
        case '.md':
          chunks = await this.processMarkdownContent(content);
          break;
        case '.txt':
        default:
          chunks = await this.processPlainTextContent(content);
          break;
      }
      
      // Generate relationships between chunks
      const chunkRelations = this.generateChunkRelations(chunks);
      
      // Create the index
      const indexPath = await this.createChunkIndex(chunks, path.basename(filePath, fileExt));
      
      return {
        chunkCount: chunks.length,
        totalSourceSize: content.length,
        totalProcessedSize: chunks.reduce((sum, chunk) => sum + chunk.content.length, 0),
        chunks: chunks,
        relations: chunkRelations,
        indexPath: indexPath
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw new Error(`Failed to process file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Process JSON content into semantic chunks
   * @param content JSON content as string
   * @returns Promise<SemanticNode[]> Semantic nodes extracted from content
   */
  private async processJsonContent(content: string): Promise<SemanticNode[]> {
    try {
      // Parse JSON content
      const jsonData = JSON.parse(content);
      
      // For chat history, we might have a structure like:
      // { messages: [ { role: "user", content: "..." }, { role: "assistant", content: "..." } ] }
      
      let chunks: SemanticNode[] = [];
      
      // Handle different JSON structures
      if (Array.isArray(jsonData)) {
        // If it's an array, process each item
        chunks = await this.processJsonArray(jsonData);
      } else if (jsonData.messages && Array.isArray(jsonData.messages)) {
        // If it has a messages array, process that
        chunks = await this.processJsonArray(jsonData.messages);
      } else {
        // Otherwise, treat each top-level property as a potential chunk
        chunks = await this.processJsonObject(jsonData);
      }
      
      return chunks;
    } catch (error) {
      console.error('Error processing JSON content:', error);
      
      // If JSON parsing fails, try to process as plain text
      return this.processPlainTextContent(content);
    }
  }
  
  /**
   * Process a JSON array into semantic chunks
   * @param jsonArray Array of JSON objects
   * @returns Promise<SemanticNode[]> Array of semantic nodes
   */
  private async processJsonArray(jsonArray: any[]): Promise<SemanticNode[]> {
    const chunks: SemanticNode[] = [];
    
    // Group related items using the 3:1 ratio principle
    // Each group should ideally contain 3 conceptually related items followed by 1 transition item
    
    let currentGroup: any[] = [];
    let currentSize = 0;
    
    for (let i = 0; i < jsonArray.length; i++) {
      const item = jsonArray[i];
      
      // Estimate the size of this item
      const itemSize = JSON.stringify(item).length;
      
      // If adding this item would exceed max chunk size, create a new chunk
      if (currentSize + itemSize > this.options.maxChunkSize && currentGroup.length > 0) {
        chunks.push(this.createSemanticNodeFromGroup(currentGroup));
        currentGroup = [];
        currentSize = 0;
      }
      
      // Add item to current group
      currentGroup.push(item);
      currentSize += itemSize;
      
      // Check if we've reached a natural breakpoint using 3:1 ratio
      // Every 4 items, if we have enough content, create a chunk
      if (currentGroup.length >= 4 && currentSize >= this.options.minChunkSize) {
        chunks.push(this.createSemanticNodeFromGroup(currentGroup));
        currentGroup = [];
        currentSize = 0;
      }
    }
    
    // Add any remaining items
    if (currentGroup.length > 0) {
      chunks.push(this.createSemanticNodeFromGroup(currentGroup));
    }
    
    return chunks;
  }
  
  /**
   * Create a semantic node from a group of JSON items
   * @param group Array of related JSON items
   * @returns SemanticNode representing the group
   */
  private createSemanticNodeFromGroup(group: any[]): SemanticNode {
    // Extract topic and summary from the group
    const title = this.extractTitle(group);
    const summary = this.generateSummary(group);
    
    // Create content by stringifying the group with formatting
    const content = JSON.stringify(group, null, 2);
    
    // Create metadata
    const metadata: ChunkMetadata = {
      timestamp: new Date(),
      itemCount: group.length,
      concepts: this.extractConcepts(group),
      namedEntities: this.extractNamedEntities(group),
      keywords: this.extractKeywords(group),
      sentimentScore: this.calculateSentiment(group)
    };
    
    return {
      id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
      title: title,
      summary: summary,
      content: content,
      metadata: metadata,
      level: 0,  // Will be updated during hierarchy construction
      children: []
    };
  }
  
  /**
   * Process a JSON object into semantic chunks
   * @param jsonObject JSON object with key-value pairs
   * @returns Promise<SemanticNode[]> Array of semantic nodes
   */
  private async processJsonObject(jsonObject: Record<string, any>): Promise<SemanticNode[]> {
    const chunks: SemanticNode[] = [];
    
    // Group related properties
    const propertyGroups = this.groupRelatedProperties(jsonObject);
    
    // Process each property group
    for (const group of propertyGroups) {
      const groupObject: Record<string, any> = {};
      
      // Build a sub-object with the grouped properties
      for (const prop of group) {
        groupObject[prop] = jsonObject[prop];
      }
      
      // Create a semantic node for this group
      chunks.push({
        id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
        title: this.generateGroupTitle(group),
        summary: this.generateGroupSummary(groupObject),
        content: JSON.stringify(groupObject, null, 2),
        metadata: {
          timestamp: new Date(),
          itemCount: group.length,
          concepts: this.extractConceptsFromObject(groupObject),
          namedEntities: this.extractNamedEntitiesFromObject(groupObject),
          keywords: group,
          sentimentScore: 0 // Neutral for object properties
        },
        level: 0,
        children: []
      });
    }
    
    return chunks;
  }
  
  /**
   * Group related properties of a JSON object using semantic relationship analysis
   * @param jsonObject Object to analyze
   * @returns Array of property name groups
   */
  private groupRelatedProperties(jsonObject: Record<string, any>): string[][] {
    const properties = Object.keys(jsonObject);
    const groups: string[][] = [];
    
    // Simple implementation: group by prefix or by type
    const prefixGroups: Record<string, string[]> = {};
    const typeGroups: Record<string, string[]> = {};
    
    // Group by prefix (first 3 chars)
    for (const prop of properties) {
      const prefix = prop.substring(0, 3);
      
      if (!prefixGroups[prefix]) {
        prefixGroups[prefix] = [];
      }
      
      prefixGroups[prefix].push(prop);
    }
    
    // Group by value type
    for (const prop of properties) {
      const type = typeof jsonObject[prop];
      
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      
      typeGroups[type].push(prop);
    }
    
    // Use prefix groups if any has more than 1 item, otherwise use type groups
    const prefixGroupsWithMultiple = Object.values(prefixGroups).filter(g => g.length > 1);
    
    if (prefixGroupsWithMultiple.length > 0) {
      // Add multi-item prefix groups
      for (const group of prefixGroupsWithMultiple) {
        groups.push(group);
      }
      
      // Add remaining properties as individual groups
      const groupedProps = new Set(prefixGroupsWithMultiple.flat());
      for (const prop of properties) {
        if (!groupedProps.has(prop)) {
          groups.push([prop]);
        }
      }
    } else {
      // Add type groups
      for (const type of Object.keys(typeGroups)) {
        // Split large type groups into smaller ones based on 3:1 ratio
        const typeGroup = typeGroups[type];
        if (typeGroup.length > 4) {
          for (let i = 0; i < typeGroup.length; i += 4) {
            groups.push(typeGroup.slice(i, i + 4));
          }
        } else {
          groups.push(typeGroup);
        }
      }
    }
    
    return groups;
  }
  
  /**
   * Process HTML content into semantic chunks
   * @param content HTML content as string
   * @returns Promise<SemanticNode[]> Semantic nodes extracted from HTML
   */
  private async processHtmlContent(content: string): Promise<SemanticNode[]> {
    // Simple HTML processing based on headings and sections
    const chunks: SemanticNode[] = [];
    
    // Extract title from <title> tag
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1] : "HTML Document";
    
    // Try to identify sections using headings (h1, h2, h3)
    const headingRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
    let lastIndex = 0;
    let match;
    
    // Create a chunk for content before the first heading if needed
    const startBodyMatch = content.match(/<body[^>]*>/i);
    if (startBodyMatch) {
      const bodyStartIndex = startBodyMatch.index + startBodyMatch[0].length;
      const headingMatch = content.substring(bodyStartIndex).match(headingRegex);
      
      if (!headingMatch || headingMatch.index > 500) {
        // There's substantial content before the first heading
        const preamble = content.substring(bodyStartIndex, 
            headingMatch ? bodyStartIndex + headingMatch.index : undefined);
        
        if (this.stripHtmlTags(preamble).trim().length > 0) {
          chunks.push({
            id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
            title: "Introduction",
            summary: this.generateSummaryFromText(this.stripHtmlTags(preamble).substring(0, 500)),
            content: preamble,
            metadata: {
              timestamp: new Date(),
              itemCount: 1,
              concepts: this.extractConceptsFromText(this.stripHtmlTags(preamble)),
              namedEntities: this.extractNamedEntitiesFromText(this.stripHtmlTags(preamble)),
              keywords: this.extractKeywordsFromText(this.stripHtmlTags(preamble)),
              sentimentScore: this.calculateSentimentFromText(this.stripHtmlTags(preamble))
            },
            level: 0,
            children: []
          });
        }
      }
    }
    
    // Reset the regex
    headingRegex.lastIndex = 0;
    
    // Process sections based on headings
    let lastHeading = "Introduction";
    let lastHeadingLevel = 1;
    let lastMatchEnd = 0;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const headingLevel = parseInt(match[1], 10);
      const headingTitle = this.stripHtmlTags(match[2]).trim();
      const startIndex = match.index + match[0].length;
      
      // Process the content between the last heading and this one
      if (match.index > lastMatchEnd && lastMatchEnd > 0) {
        const sectionContent = content.substring(lastMatchEnd, match.index);
        if (this.stripHtmlTags(sectionContent).trim().length > 0) {
          chunks.push({
            id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
            title: lastHeading,
            summary: this.generateSummaryFromText(this.stripHtmlTags(sectionContent).substring(0, 500)),
            content: sectionContent,
            metadata: {
              timestamp: new Date(),
              itemCount: 1,
              concepts: this.extractConceptsFromText(this.stripHtmlTags(sectionContent)),
              namedEntities: this.extractNamedEntitiesFromText(this.stripHtmlTags(sectionContent)),
              keywords: this.extractKeywordsFromText(this.stripHtmlTags(sectionContent)),
              sentimentScore: this.calculateSentimentFromText(this.stripHtmlTags(sectionContent))
            },
            level: lastHeadingLevel - 1, // Use 0-based level
            children: []
          });
        }
      }
      
      lastHeading = headingTitle;
      lastHeadingLevel = headingLevel;
      lastMatchEnd = startIndex;
    }
    
    // Handle content after the last heading
    if (lastMatchEnd > 0 && lastMatchEnd < content.length) {
      const endBodyMatch = content.match(/<\/body>/i);
      const endIndex = endBodyMatch ? endBodyMatch.index : content.length;
      
      const lastSection = content.substring(lastMatchEnd, endIndex);
      if (this.stripHtmlTags(lastSection).trim().length > 0) {
        chunks.push({
          id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
          title: lastHeading,
          summary: this.generateSummaryFromText(this.stripHtmlTags(lastSection).substring(0, 500)),
          content: lastSection,
          metadata: {
            timestamp: new Date(),
            itemCount: 1,
            concepts: this.extractConceptsFromText(this.stripHtmlTags(lastSection)),
            namedEntities: this.extractNamedEntitiesFromText(this.stripHtmlTags(lastSection)),
            keywords: this.extractKeywordsFromText(this.stripHtmlTags(lastSection)),
            sentimentScore: this.calculateSentimentFromText(this.stripHtmlTags(lastSection))
          },
          level: lastHeadingLevel - 1,
          children: []
        });
      }
    }
    
    // If we didn't find any headings, break content into chunks by paragraphs
    if (chunks.length === 0) {
      // Fall back to processing as plain text
      return this.processPlainTextContent(this.stripHtmlTags(content));
    }
    
    // Build hierarchy based on heading levels
    return this.buildHtmlHierarchy(chunks);
  }
  
  /**
   * Strip HTML tags from text
   * @param html HTML content
   * @returns Plain text
   */
  private stripHtmlTags(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Build HTML hierarchy based on heading levels
   * @param chunks Array of semantic nodes from HTML
   * @returns Array of hierarchical semantic nodes
   */
  private buildHtmlHierarchy(chunks: SemanticNode[]): SemanticNode[] {
    if (chunks.length <= 1) {
      return chunks;
    }
    
    // Sort chunks by their position in the document (using chunk ID which includes counter)
    chunks.sort((a, b) => {
      const idA = parseInt(a.id.split('_')[1], 10);
      const idB = parseInt(b.id.split('_')[1], 10);
      return idA - idB;
    });
    
    // Map to store all nodes by ID
    const nodeMap = new Map<string, SemanticNode>();
    chunks.forEach(chunk => nodeMap.set(chunk.id, chunk));
    
    // Find root nodes (level 0)
    const rootNodes: SemanticNode[] = chunks.filter(chunk => chunk.level === 0);
    
    // For each chunk with level > 0, find its parent
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk.level === 0) continue;
      
      // Look backwards for a chunk with a lower level
      let parent = null;
      for (let j = i - 1; j >= 0; j--) {
        if (chunks[j].level < chunk.level) {
          parent = chunks[j];
          break;
        }
      }
      
      if (parent) {
        parent.children.push(chunk);
      } else {
        // If no parent found, make it a root node
        chunk.level = 0;
        rootNodes.push(chunk);
      }
    }
    
    return rootNodes;
  }
  
  /**
   * Process Markdown content into semantic chunks
   * @param content Markdown content as string
   * @returns Promise<SemanticNode[]> Semantic nodes extracted from Markdown
   */
  private async processMarkdownContent(content: string): Promise<SemanticNode[]> {
    const chunks: SemanticNode[] = [];
    
    // Split by headers to get natural document sections
    const headerRegex = /^\s*(#{1,6})\s+(.+)$/gm;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let lastLevel = 1;
    let lastTitle = "Introduction";
    
    // Create a chunk for content before the first header
    const firstHeaderMatch = content.match(headerRegex);
    const preambleEndIndex = firstHeaderMatch ? firstHeaderMatch.index : content.length;
    const preamble = content.substring(0, preambleEndIndex);
    
    if (preamble.trim().length > 0) {
      chunks.push({
        id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
        title: "Introduction",
        summary: this.generateSummaryFromText(preamble.substring(0, 500)),
        content: preamble,
        metadata: {
          timestamp: new Date(),
          itemCount: 1,
          concepts: this.extractConceptsFromText(preamble),
          namedEntities: this.extractNamedEntitiesFromText(preamble),
          keywords: this.extractKeywordsFromText(preamble),
          sentimentScore: this.calculateSentimentFromText(preamble)
        },
        level: 0,
        children: []
      });
      lastIndex = preambleEndIndex;
    }
    
    // Reset the regex
    headerRegex.lastIndex = 0;
    
    // Process each section
    while ((match = headerRegex.exec(content)) !== null) {
      const headerLevel = match[1].length; // Number of # symbols
      const headerTitle = match[2].trim();
      const startPos = match.index;
      
      // Create a chunk for content between the last header and this one
      if (startPos > lastIndex) {
        const sectionContent = content.substring(lastIndex, startPos);
        if (sectionContent.trim().length > 0) {
          chunks.push({
            id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
            title: lastTitle,
            summary: this.generateSummaryFromText(sectionContent.substring(0, 500)),
            content: sectionContent,
            metadata: {
              timestamp: new Date(),
              itemCount: 1,
              concepts: this.extractConceptsFromText(sectionContent),
              namedEntities: this.extractNamedEntitiesFromText(sectionContent),
              keywords: this.extractKeywordsFromText(sectionContent),
              sentimentScore: this.calculateSentimentFromText(sectionContent)
            },
            level: lastLevel - 1, // 0-based level
            children: []
          });
        }
      }
      
      lastIndex = startPos + match[0].length;
      lastLevel = headerLevel;
      lastTitle = headerTitle;
    }
    
    // Create a chunk for content after the last header
    if (lastIndex < content.length) {
      const remainingContent = content.substring(lastIndex);
      if (remainingContent.trim().length > 0) {
        chunks.push({
          id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
          title: lastTitle,
          summary: this.generateSummaryFromText(remainingContent.substring(0, 500)),
          content: remainingContent,
          metadata: {
            timestamp: new Date(),
            itemCount: 1,
            concepts: this.extractConceptsFromText(remainingContent),
            namedEntities: this.extractNamedEntitiesFromText(remainingContent),
            keywords: this.extractKeywordsFromText(remainingContent),
            sentimentScore: this.calculateSentimentFromText(remainingContent)
          },
          level: lastLevel - 1,
          children: []
        });
      }
    }
    
    // Build the hierarchy (similar to HTML hierarchy)
    return this.buildMarkdownHierarchy(chunks);
  }
  
  /**
   * Build Markdown hierarchy based on header levels
   * @param chunks Array of semantic nodes from Markdown
   * @returns Array of hierarchical semantic nodes
   */
  private buildMarkdownHierarchy(chunks: SemanticNode[]): SemanticNode[] {
    if (chunks.length <= 1) {
      return chunks;
    }
    
    // Sort chunks by their position in the document (using chunk ID which includes counter)
    chunks.sort((a, b) => {
      const idA = parseInt(a.id.split('_')[1], 10);
      const idB = parseInt(b.id.split('_')[1], 10);
      return idA - idB;
    });
    
    // Find root nodes (level 0)
    const rootNodes: SemanticNode[] = chunks.filter(chunk => chunk.level === 0);
    
    // For each chunk with level > 0, find its parent
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk.level === 0) continue;
      
      // Look backwards for a chunk with a lower level
      let parent = null;
      for (let j = i - 1; j >= 0; j--) {
        if (chunks[j].level < chunk.level) {
          parent = chunks[j];
          break;
        }
      }
      
      if (parent) {
        parent.children.push(chunk);
      } else {
        // If no parent found, make it a root node
        chunk.level = 0;
        rootNodes.push(chunk);
      }
    }
    
    return rootNodes;
  }
  
  /**
   * Process plain text content into semantic chunks
   * @param content Plain text content
   * @returns Promise<SemanticNode[]> Semantic nodes extracted from text
   */
  private async processPlainTextContent(content: string): Promise<SemanticNode[]> {
    const chunks: SemanticNode[] = [];
    
    // Split by paragraphs first
    const paragraphs = content.split(/\n\s*\n/);
    
    // Group paragraphs using 3:1 ratio
    let currentGroup: string[] = [];
    let currentSize = 0;
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (trimmed.length === 0) continue;
      
      // If adding this paragraph would exceed max chunk size, create a new chunk
      if (currentSize + trimmed.length > this.options.maxChunkSize && currentGroup.length > 0) {
        const groupText = currentGroup.join('\n\n');
        chunks.push(this.createSemanticNodeFromText(groupText));
        currentGroup = [];
        currentSize = 0;
      }
      
      // Add paragraph to current group
      currentGroup.push(trimmed);
      currentSize += trimmed.length;
      
      // Check if we have enough content for a chunk using 3:1 ratio pattern
      // After 3 conceptually related paragraphs + 1 transition paragraph
      if (currentGroup.length >= 4 && currentSize >= this.options.minChunkSize) {
        const groupText = currentGroup.join('\n\n');
        chunks.push(this.createSemanticNodeFromText(groupText));
        currentGroup = [];
        currentSize = 0;
      }
    }
    
    // Add any remaining paragraphs
    if (currentGroup.length > 0) {
      const groupText = currentGroup.join('\n\n');
      chunks.push(this.createSemanticNodeFromText(groupText));
    }
    
    return chunks;
  }
  
  /**
   * Create a semantic node from text content
   * @param text Text content for the chunk
   * @returns SemanticNode representing the text
   */
  private createSemanticNodeFromText(text: string): SemanticNode {
    // Extract first line as potential title, or generate one
    const lines = text.split('\n');
    let title = lines[0].trim();
    
    // If the first line is too long, generate a title
    if (title.length > 100) {
      title = this.generateTitleFromText(text);
    }
    
    return {
      id: `chunk_${this.chunkCounter++}_${uuidv4().substring(0, 8)}`,
      title: title,
      summary: this.generateSummaryFromText(text.substring(0, 500)),
      content: text,
      metadata: {
        timestamp: new Date(),
        itemCount: lines.length,
        concepts: this.extractConceptsFromText(text),
        namedEntities: this.extractNamedEntitiesFromText(text),
        keywords: this.extractKeywordsFromText(text),
        sentimentScore: this.calculateSentimentFromText(text)
      },
      level: 0,
      children: []
    };
  }
  
  /**
   * Build hierarchical structure from flat chunks based on semantic relationships
   * @param chunks Array of semantic nodes
   * @returns Array of top-level semantic nodes with children
   */
  private buildHierarchy(chunks: SemanticNode[]): SemanticNode[] {
    if (chunks.length <= 1) {
      return chunks;
    }
    
    // Sort chunks by level
    chunks.sort((a, b) => a.level - b.level);
    
    // Map to store all nodes by ID
    const nodeMap = new Map<string, SemanticNode>();
    chunks.forEach(chunk => nodeMap.set(chunk.id, chunk));
    
    // Find root nodes (level 0)
    const rootNodes: SemanticNode[] = chunks.filter(chunk => chunk.level === 0);
    
    // Process each level
    for (let level = 1; level < this.options.hierarchyLevels; level++) {
      const nodesAtLevel = chunks.filter(chunk => chunk.level === level);
      
      for (const node of nodesAtLevel) {
        // Find the best parent at the previous level
        let bestParent: SemanticNode | null = null;
        let bestScore = -1;
        
        for (const potentialParent of chunks.filter(c => c.level === level - 1)) {
          const score = this.calculateSemanticSimilarity(node, potentialParent);
          if (score > bestScore) {
            bestScore = score;
            bestParent = potentialParent;
          }
        }
        
        // If we found a good parent, add as child
        if (bestParent && bestScore > this.options.semanticThreshold) {
          bestParent.children.push(node);
        } else {
          // Otherwise, make it a top-level node
          node.level = 0;
          rootNodes.push(node);
        }
      }
    }
    
    return rootNodes;
  }
  
  /**
   * Generate relationships between chunks
   * @param chunks Array of semantic nodes
   * @returns Array of relationships between chunks
   */
  private generateChunkRelations(chunks: SemanticNode[]): ChunkRelation[] {
    const relations: ChunkRelation[] = [];
    
    // Compare each chunk with every other chunk
    for (let i = 0; i < chunks.length; i++) {
      for (let j = i + 1; j < chunks.length; j++) {
        const similarity = this.calculateSemanticSimilarity(chunks[i], chunks[j]);
        
        // Only create relations for chunks with significant similarity
        if (similarity > this.options.semanticThreshold) {
          relations.push({
            sourceId: chunks[i].id,
            targetId: chunks[j].id,
            relationStrength: similarity,
            relationType: this.determineRelationType(chunks[i], chunks[j], similarity)
          });
        }
      }
    }
    
    return relations;
  }
  
  /**
   * Create an index of all chunks to facilitate search and navigation
   * @param chunks Array of semantic nodes
   * @param baseName Base name for the index file
   * @returns Path to the created index file
   */
  private async createChunkIndex(chunks: SemanticNode[], baseName: string): Promise<string> {
    // Create index structure
    const index = {
      processingDate: new Date(),
      sourceFile: baseName,
      chunkCount: chunks.length,
      keywords: this.extractTopKeywords(chunks),
      concepts: this.extractTopConcepts(chunks),
      namedEntities: this.extractTopNamedEntities(chunks),
      chunks: chunks.map(chunk => ({
        id: chunk.id,
        title: chunk.title,
        summary: chunk.summary,
        metadata: chunk.metadata,
        children: chunk.children.map(child => child.id)
      }))
    };
    
    // Write index to file
    const indexPath = path.join(this.outputDir, `${baseName}-index.json`);
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
    
    // Write each chunk to its own file
    for (const chunk of chunks) {
      const chunkPath = path.join(this.outputDir, `${chunk.id}.json`);
      await fs.writeFile(chunkPath, JSON.stringify(chunk, null, 2), 'utf8');
    }
    
    return indexPath;
  }
  
  /*** Utility methods for metadata extraction ***/
  
  /**
   * Extract a title from a group of items
   * @param group Array of items
   * @returns Generated title
   */
  private extractTitle(group: any[]): string {
    // Simple implementation: Look for title in first item or generate one
    
    // Check if first item has a title, subject, or similar field
    if (group.length > 0) {
      const firstItem = group[0];
      
      // Try to find a title field
      for (const field of ['title', 'subject', 'topic', 'name', 'heading']) {
        if (typeof firstItem === 'object' && firstItem !== null && field in firstItem) {
          const value = firstItem[field];
          if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
          }
        }
      }
      
      // If it's a chat message, use the first few words
      if (typeof firstItem === 'object' && firstItem !== null && 'content' in firstItem) {
        const content = firstItem.content;
        if (typeof content === 'string' && content.trim().length > 0) {
          return content.split(/\s+/).slice(0, 7).join(' ') + '...';
        }
      }
    }
    
    // Fallback: Generic title with chunk number
    return `Chunk ${this.chunkCounter}`;
  }
  
  /**
   * Generate a summary from a group of items
   * @param group Array of items
   * @returns Generated summary
   */
  private generateSummary(group: any[]): string {
    // Simple implementation: Concatenate snippets from each item
    let summary = '';
    
    // Try to extract content or meaningful snippets from each item
    for (let i = 0; i < Math.min(3, group.length); i++) {
      const item = group[i];
      
      if (typeof item === 'object' && item !== null) {
        // For chat messages
        if ('role' in item && 'content' in item) {
          summary += `${item.role.toUpperCase()}: ${item.content.substring(0, 100)}...\n`;
          continue;
        }
        
        // For objects with content
        if ('content' in item && typeof item.content === 'string') {
          summary += `${item.content.substring(0, 100)}...\n`;
          continue;
        }
        
        // For other objects, find the first string property
        for (const key of Object.keys(item)) {
          if (typeof item[key] === 'string' && item[key].length > 20) {
            summary += `${item[key].substring(0, 100)}...\n`;
            break;
          }
        }
      } else if (typeof item === 'string') {
        summary += `${item.substring(0, 100)}...\n`;
      }
    }
    
    return summary.trim() || `Contains ${group.length} items`;
  }
  
  /**
   * Generate a title for a group of property names
   * @param properties Array of property names
   * @returns Generated title
   */
  private generateGroupTitle(properties: string[]): string {
    if (properties.length === 0) return "Empty Group";
    if (properties.length === 1) return properties[0];
    
    // Look for common prefixes
    const commonPrefix = this.findCommonPrefix(properties);
    if (commonPrefix.length > 3) {
      return `${commonPrefix}... (${properties.length} properties)`;
    }
    
    // Just list the first few properties
    return properties.slice(0, 3).join(', ') + 
      (properties.length > 3 ? ` + ${properties.length - 3} more` : '');
  }
  
  /**
   * Find the longest common prefix among strings
   * @param strings Array of strings
   * @returns Common prefix
   */
  private findCommonPrefix(strings: string[]): string {
    if (strings.length === 0) return '';
    if (strings.length === 1) return strings[0];
    
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
      }
    }
    
    return prefix;
  }
  
  /**
   * Generate a summary for a group of object properties
   * @param obj Object with properties
   * @returns Generated summary
   */
  private generateGroupSummary(obj: Record<string, any>): string {
    const props = Object.keys(obj);
    let summary = `Contains ${props.length} properties: `;
    
    // Add a sample of values
    for (let i = 0; i < Math.min(3, props.length); i++) {
      const prop = props[i];
      const value = obj[prop];
      
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          summary += `${prop}[${value.length} items], `;
        } else {
          summary += `${prop}{object}, `;
        }
      } else if (typeof value === 'string') {
        summary += `${prop}="${value.substring(0, 30)}${value.length > 30 ? '...' : ''}", `;
      } else {
        summary += `${prop}=${value}, `;
      }
    }
    
    if (props.length > 3) {
      summary += `and ${props.length - 3} more properties.`;
    }
    
    return summary;
  }
  
  /**
   * Generate a title from text content
   * @param text Text content
   * @returns Generated title
   */
  private generateTitleFromText(text: string): string {
    // Find the first sentence
    const firstSentenceMatch = text.match(/^[^.!?]*[.!?]/);
    if (firstSentenceMatch && firstSentenceMatch[0].length < 100) {
      return firstSentenceMatch[0].trim();
    }
    
    // Otherwise, take the first N words
    return text.split(/\s+/).slice(0, 8).join(' ') + '...';
  }
  
  /**
   * Generate a summary from text content
   * @param text Text content
   * @returns Generated summary
   */
  private generateSummaryFromText(text: string): string {
    // Extract first few sentences
    const sentences = text.match(/[^.!?]*[.!?]/g) || [];
    
    // Return first 2-3 sentences
    return sentences.slice(0, 3).join(' ');
  }
  
  /**
   * Extract concepts from a group of items
   * @param group Array of items
   * @returns Array of concepts
   */
  private extractConcepts(group: any[]): string[] {
    const concepts = new Set<string>();
    
    // Extract concepts from each item
    for (const item of group) {
      if (typeof item === 'object' && item !== null) {
        if ('content' in item && typeof item.content === 'string') {
          this.extractConceptsFromText(item.content).forEach(c => concepts.add(c));
        }
        
        // Look for concept-related fields
        for (const field of ['concepts', 'topics', 'categories', 'tags', 'keywords']) {
          if (field in item) {
            const value = item[field];
            if (Array.isArray(value)) {
              value.forEach(v => {
                if (typeof v === 'string') concepts.add(v);
              });
            }
          }
        }
      }
    }
    
    return Array.from(concepts);
  }
  
  /**
   * Extract concepts from a text
   * @param text Text to analyze
   * @returns Array of concepts
   */
  private extractConceptsFromText(text: string): string[] {
    // This would ideally use NLP to extract concepts
    // For demo, we'll use a simple approach
    
    // Split into words and filter for potential concepts (capitalized words, etc.)
    const words = text.split(/\s+/);
    const concepts = new Set<string>();
    
    // Find repeated phrases (potential concepts)
    const phrases: Record<string, number> = {};
    
    // Extract 2-3 word phrases
    for (let i = 0; i < words.length - 2; i++) {
      // Skip phrases with stop words as first word
      if (this.isStopWord(words[i])) continue;
      
      const twoWordPhrase = words[i] + ' ' + words[i+1];
      const threeWordPhrase = twoWordPhrase + ' ' + words[i+2];
      
      phrases[twoWordPhrase] = (phrases[twoWordPhrase] || 0) + 1;
      phrases[threeWordPhrase] = (phrases[threeWordPhrase] || 0) + 1;
    }
    
    // Find frequent phrases
    for (const [phrase, count] of Object.entries(phrases)) {
      if (count >= 2) { // Appears at least twice
        concepts.add(phrase);
      }
    }
    
    // Look for capitalized terms (potential proper nouns/concepts)
    for (const word of words) {
      if (word.length > 1 && 
          word[0] === word[0].toUpperCase() && 
          word[1] === word[1].toLowerCase() &&
          !this.isStopWord(word)) {
        concepts.add(word);
      }
    }
    
    return Array.from(concepts).slice(0, 10); // Limit to top 10
  }
  
  /**
   * Extract concepts from an object
   * @param obj Object to analyze
   * @returns Array of concepts
   */
  private extractConceptsFromObject(obj: Record<string, any>): string[] {
    const concepts = new Set<string>();
    
    // Look for concept-related fields
    for (const field of ['concepts', 'topics', 'categories', 'tags', 'keywords']) {
      if (field in obj) {
        const value = obj[field];
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (typeof v === 'string') concepts.add(v);
          });
        }
      }
    }
    
    // Extract concepts from string values
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.length > 50) {
        this.extractConceptsFromText(value).forEach(c => concepts.add(c));
      }
    }
    
    return Array.from(concepts);
  }
  
  /**
   * Extract named entities from a group of items
   * @param group Array of items
   * @returns Array of named entities
   */
  private extractNamedEntities(group: any[]): string[] {
    const entities = new Set<string>();
    
    // Extract named entities from each item
    for (const item of group) {
      if (typeof item === 'object' && item !== null) {
        if ('content' in item && typeof item.content === 'string') {
          this.extractNamedEntitiesFromText(item.content).forEach(e => entities.add(e));
        }
        
        // Look for entity-related fields
        for (const field of ['entities', 'names', 'people', 'organizations', 'locations']) {
          if (field in item) {
            const value = item[field];
            if (Array.isArray(value)) {
              value.forEach(v => {
                if (typeof v === 'string') entities.add(v);
              });
            }
          }
        }
      }
    }
    
    return Array.from(entities);
  }
  
  /**
   * Extract named entities from text
   * @param text Text to analyze
   * @returns Array of named entities
   */
  private extractNamedEntitiesFromText(text: string): string[] {
    // This would ideally use NLP to extract named entities
    // For demo, we'll use a simpler approach
    
    // Look for patterns like "Person Name", "Company, Inc.", etc.
    const entities = new Set<string>();
    
    // Pattern for proper names: two capitalized words in sequence
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const names = text.match(namePattern) || [];
    names.forEach(name => entities.add(name));
    
    // Pattern for organizations: word ending with Inc, Corp, LLC, etc.
    const orgPattern = /\b[A-Za-z]+(, Inc\.?| Corp\.?| LLC\.?| Ltd\.?)\b/g;
    const orgs = text.match(orgPattern) || [];
    orgs.forEach(org => entities.add(org));
    
    return Array.from(entities);
  }
  
  /**
   * Extract named entities from an object
   * @param obj Object to analyze
   * @returns Array of named entities
   */
  private extractNamedEntitiesFromObject(obj: Record<string, any>): string[] {
    const entities = new Set<string>();
    
    // Look for entity-related fields
    for (const field of ['entities', 'names', 'people', 'organizations', 'locations']) {
      if (field in obj) {
        const value = obj[field];
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (typeof v === 'string') entities.add(v);
          });
        }
      }
    }
    
    // Extract entities from string values
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.length > 50) {
        this.extractNamedEntitiesFromText(value).forEach(e => entities.add(e));
      }
    }
    
    return Array.from(entities);
  }
  
  /**
   * Extract keywords from a group of items
   * @param group Array of items
   * @returns Array of keywords
   */
  private extractKeywords(group: any[]): string[] {
    const keywords = new Set<string>();
    
    // Extract keywords from each item
    for (const item of group) {
      if (typeof item === 'object' && item !== null) {
        if ('content' in item && typeof item.content === 'string') {
          this.extractKeywordsFromText(item.content).forEach(k => keywords.add(k));
        }
        
        // Look for keyword-related fields
        for (const field of ['keywords', 'tags', 'topics']) {
          if (field in item) {
            const value = item[field];
            if (Array.isArray(value)) {
              value.forEach(v => {
                if (typeof v === 'string') keywords.add(v);
              });
            }
          }
        }
      }
    }
    
    return Array.from(keywords);
  }
  
  /**
   * Extract keywords from text
   * @param text Text to analyze
   * @returns Array of keywords
   */
  private extractKeywordsFromText(text: string): string[] {
    // This would ideally use NLP/TF-IDF to extract keywords
    // For demo, we'll use a simpler approach
    
    // Split into words and filter out stop words
    const words = text.toLowerCase().split(/\s+/)
      .filter(w => w.length > 3) // Only words with 4+ chars
      .filter(w => !this.isStopWord(w))
      .map(w => w.replace(/[.,;:!?()]/g, '')); // Remove punctuation
    
    // Count word frequencies
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Get top keywords by frequency
    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }
  
  /**
   * Calculate sentiment score from a group of items
   * @param group Array of items
   * @returns Sentiment score (-1 to 1)
   */
  private calculateSentiment(group: any[]): number {
    // Calculate average sentiment
    let totalSentiment = 0;
    let count = 0;
    
    for (const item of group) {
      if (typeof item === 'object' && item !== null) {
        if ('content' in item && typeof item.content === 'string') {
          totalSentiment += this.calculateSentimentFromText(item.content);
          count++;
        }
      }
    }
    
    return count > 0 ? totalSentiment / count : 0;
  }
  
  /**
   * Calculate sentiment score from text
   * @param text Text to analyze
   * @returns Sentiment score (-1 to 1)
   */
  private calculateSentimentFromText(text: string): number {
    // This would ideally use a proper sentiment analysis library
    // For demo, using a very simplistic approach with positive/negative word lists
    
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
      'happy', 'joy', 'love', 'like', 'best', 'better', 'success', 'successful',
      'positive', 'beautiful', 'perfect', 'right', 'yes'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'worst', 'worse',
      'sad', 'unhappy', 'hate', 'dislike', 'fail', 'failure',
      'negative', 'ugly', 'wrong', 'no', 'never', 'problem'
    ];
    
    // Normalize and split text
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);
    
    // Count positive and negative words
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const word of words) {
      const cleanWord = word.replace(/[.,;:!?()]/g, '');
      if (positiveWords.includes(cleanWord)) positiveCount++;
      if (negativeWords.includes(cleanWord)) negativeCount++;
    }
    
    // Calculate sentiment score (-1 to 1)
    const totalWords = words.length;
    if (totalWords === 0) return 0;
    
    const positiveScore = positiveCount / totalWords;
    const negativeScore = negativeCount / totalWords;
    
    return positiveScore - negativeScore;
  }
  
  /**
   * Extract top keywords across all chunks
   * @param chunks Array of semantic nodes
   * @returns Array of most frequent keywords
   */
  private extractTopKeywords(chunks: SemanticNode[]): string[] {
    // Count keyword frequencies across all chunks
    const keywordCounts: Record<string, number> = {};
    
    for (const chunk of chunks) {
      for (const keyword of chunk.metadata.keywords || []) {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      }
    }
    
    // Get top keywords by frequency
    return Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword]) => keyword);
  }
  
  /**
   * Extract top concepts across all chunks
   * @param chunks Array of semantic nodes
   * @returns Array of most frequent concepts
   */
  private extractTopConcepts(chunks: SemanticNode[]): string[] {
    // Count concept frequencies across all chunks
    const conceptCounts: Record<string, number> = {};
    
    for (const chunk of chunks) {
      for (const concept of chunk.metadata.concepts || []) {
        conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
      }
    }
    
    // Get top concepts by frequency
    return Object.entries(conceptCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([concept]) => concept);
  }
  
  /**
   * Extract top named entities across all chunks
   * @param chunks Array of semantic nodes
   * @returns Array of most frequent named entities
   */
  private extractTopNamedEntities(chunks: SemanticNode[]): string[] {
    // Count entity frequencies across all chunks
    const entityCounts: Record<string, number> = {};
    
    for (const chunk of chunks) {
      for (const entity of chunk.metadata.namedEntities || []) {
        entityCounts[entity] = (entityCounts[entity] || 0) + 1;
      }
    }
    
    // Get top entities by frequency
    return Object.entries(entityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([entity]) => entity);
  }
  
  /**
   * Calculate semantic similarity between two chunks
   * @param chunk1 First semantic node
   * @param chunk2 Second semantic node
   * @returns Similarity score (0-1)
   */
  private calculateSemanticSimilarity(chunk1: SemanticNode, chunk2: SemanticNode): number {
    // This would ideally use vector embeddings to calculate semantic similarity
    // For demo, we'll use a simpler approach based on shared keywords and concepts
    
    // Compare keywords
    const keywords1 = new Set(chunk1.metadata.keywords || []);
    const keywords2 = new Set(chunk2.metadata.keywords || []);
    
    // Compare concepts
    const concepts1 = new Set(chunk1.metadata.concepts || []);
    const concepts2 = new Set(chunk2.metadata.concepts || []);
    
    // Compare named entities
    const entities1 = new Set(chunk1.metadata.namedEntities || []);
    const entities2 = new Set(chunk2.metadata.namedEntities || []);
    
    // Calculate overlap for each feature
    const keywordOverlap = this.calculateSetOverlap(keywords1, keywords2);
    const conceptOverlap = this.calculateSetOverlap(concepts1, concepts2);
    const entityOverlap = this.calculateSetOverlap(entities1, entities2);
    
    // Use 3:1 ratio weighting for similarity score
    return (0.75 * conceptOverlap) + (0.25 * ((keywordOverlap + entityOverlap) / 2));
  }
  
  /**
   * Calculate overlap between two sets
   * @param set1 First set
   * @param set2 Second set
   * @returns Overlap score (0-1)
   */
  private calculateSetOverlap(set1: Set<string>, set2: Set<string>): number {
    if (set1.size === 0 && set2.size === 0) return 0;
    
    // Calculate Jaccard similarity: |A ∩ B| / |A ∪ B|
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
  
  /**
   * Determine relation type between two chunks
   * @param chunk1 First semantic node
   * @param chunk2 Second semantic node
   * @param similarity Similarity score
   * @returns Relation type description
   */
  private determineRelationType(chunk1: SemanticNode, chunk2: SemanticNode, similarity: number): string {
    // Determine relationship based on similarity and other factors
    if (similarity > 0.8) {
      return "Strongly Related";
    } else if (similarity > 0.6) {
      return "Related";
    } else if (similarity > 0.4) {
      return "Somewhat Related";
    } else if (similarity > 0.2) {
      return "Weakly Related";
    } else {
      return "Contextually Related";
    }
  }
  
  /**
   * Check if a word is a common stop word
   * @param word Word to check
   * @returns True if it's a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when',
      'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
      'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
      'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
      'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
      'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
      'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
      'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'
    ]);
    
    return stopWords.has(word.toLowerCase());
  }
}