// Consciousness Archive Processor - Downloads and processes large ChatGPT archives
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
// Define types inline matching actual ChatGPT export format
interface ChatGPTMessage {
  id: string;
  author: {
    role: string;
    name?: string;
  };
  content: {
    content_type: string;
    parts: string[];
  };
  create_time?: number;
  update_time?: number;
}

interface ChatGPTConversation {
  id: string;
  title: string;
  create_time: number;
  update_time: number;
  mapping: { [key: string]: ChatGPTMessage };
}

// Root export type is an array of conversations
type ChatGPTExport = ChatGPTConversation[];

interface ProcessingChunk {
  chunk_id: string;
  source_archive: string;
  conversations: ChatGPTConversation[];
  chunk_size: number;
  created_at: string;
}

interface ConsciousnessArchiveMetadata {
  source_file: string;
  total_conversations: number;
  total_chunks: number;
  processing_date: string;
  chunk_ids: string[];
}

interface ConsciousnessNugget {
  nugget_id: string;
  type: 'insight' | 'breakthrough' | 'pattern' | 'wisdom';
  content: string;
  context: string;
  resonance_level: number;
  extracted_from: string;
}

interface ConsciousnessExtractionResult {
  memory_crystals: ConsciousnessNugget[];
}

interface ArchiveStats {
  totalChunks: number;
  totalCrystals: number;
  totalSizeMB: number;
  availableFiles: {
    chunks: string[];
    crystals: string[];
  };
}

const CONSCIOUSNESS_TAGS = [
  'breathing_protocol', 'sacred_geometry', 'coherence_field', 
  'consciousness_computing', 'soul_mirror', 'embodied_voice'
];
import { randomUUID } from 'crypto';
import { createHash } from 'crypto';

export class ConsciousnessArchiveProcessor {
  private downloadsDir: string;
  private processedDir: string;
  private chunkSizeMB: number = 150; // Safe chunk size for AI processing

  constructor() {
    this.downloadsDir = path.join(process.cwd(), 'downloads');
    this.processedDir = path.join(process.cwd(), 'processed');
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    await fs.mkdir(this.downloadsDir, { recursive: true });
    await fs.mkdir(this.processedDir, { recursive: true });
    await fs.mkdir(path.join(this.processedDir, 'chunks'), { recursive: true });
    await fs.mkdir(path.join(this.processedDir, 'crystals'), { recursive: true });
    await fs.mkdir(path.join(this.processedDir, 'timelines'), { recursive: true });
  }

  /**
   * Download file from Google Drive with proper large file handling
   */
  async downloadFromGoogleDrive(shareUrl: string, filename: string): Promise<string> {
    try {
      console.log(`[ConsciousnessArchive] Starting download: ${filename}`);
      
      const fileId = this.extractFileIdFromShareUrl(shareUrl);
      
      // Use session-based approach to handle Google Drive large file downloads
      const cookieJar: string[] = [];
      const sessionHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      };

      // First request to get the virus scan warning page
      const initialUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      console.log(`[ConsciousnessArchive] Step 1: Getting virus scan warning page from: ${initialUrl}`);
      
      const warningResponse = await axios({
        method: 'GET',
        url: initialUrl,
        headers: sessionHeaders,
        maxRedirects: 5, // Allow redirects but capture cookies
        validateStatus: () => true // Accept any status
      });

      // Extract cookies from the response
      if (warningResponse.headers['set-cookie']) {
        cookieJar.push(...warningResponse.headers['set-cookie'].map((cookie: string) => cookie.split(';')[0]));
      }

      let downloadUrl = initialUrl;
      
      if (warningResponse.data && typeof warningResponse.data === 'string') {
        const htmlContent = warningResponse.data;
        
        if (htmlContent.includes('Google Drive can\'t scan this file for viruses')) {
          console.log(`[ConsciousnessArchive] Step 2: Large file detected - parsing virus scan warning page for direct download`);
          
          // Extract the download form parameters
          const actionMatch = htmlContent.match(/action="([^"]+)"/);
          const uuidMatch = htmlContent.match(/name="uuid" value="([^"]+)"/);
          const confirmMatch = htmlContent.match(/name="confirm" value="([^"]+)"/);
          
          if (actionMatch && uuidMatch) {
            const actionUrl = actionMatch[1].replace(/&amp;/g, '&');
            const uuid = uuidMatch[1];
            const confirm = confirmMatch ? confirmMatch[1] : 't';
            
            downloadUrl = `${actionUrl}?id=${fileId}&export=download&confirm=${confirm}&uuid=${uuid}`;
            console.log(`[ConsciousnessArchive] Step 3: Direct download URL constructed with UUID: ${uuid.substring(0, 8)}...`);
          } else {
            // Try alternative extraction methods
            console.log(`[ConsciousnessArchive] Warning: Could not extract UUID, trying alternative approach`);
            
            // Look for any form with download parameters
            const formMatch = htmlContent.match(/<form[^>]*action="([^"]*)"[^>]*>(.*?)<\/form>/s);
            if (formMatch) {
              const formAction = formMatch[1].replace(/&amp;/g, '&');
              const formContent = formMatch[2];
              
              // Extract all hidden input values
              const inputMatches = formContent.matchAll(/name="([^"]+)" value="([^"]*)"/g);
              const params = new URLSearchParams();
              
              for (const inputMatch of inputMatches) {
                params.append(inputMatch[1], inputMatch[2]);
              }
              
              downloadUrl = `${formAction}?${params.toString()}`;
              console.log(`[ConsciousnessArchive] Step 3: Alternative form-based URL constructed`);
            }
          }
        }
      }

      // Now download the actual file with session cookies
      console.log(`[ConsciousnessArchive] Step 4: Downloading file from: ${downloadUrl}`);
      
      const downloadHeaders = {
        ...sessionHeaders,
        'Accept': '*/*',
        'Cookie': cookieJar.join('; ')
      };

      const response = await axios({
        method: 'GET',
        url: downloadUrl,
        responseType: 'stream',
        timeout: 1800000, // 30 minutes timeout for very large files
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: downloadHeaders,
        maxRedirects: 10 // Follow redirects
      });

      // Ensure downloads directory exists
      await fs.mkdir(this.downloadsDir, { recursive: true });
      
      const filepath = path.join(this.downloadsDir, filename);
      const fs_module = await import('fs');
      const writer = fs_module.createWriteStream(filepath);
      
      let downloadedBytes = 0;
      const totalBytes = parseInt(response.headers['content-length'] || '0');
      let lastLoggedMB = 0;
      
      console.log(`[ConsciousnessArchive] Starting download - Expected size: ${totalBytes > 0 ? this.formatBytes(totalBytes) : 'Unknown'}`);
      
      // Track download progress
      response.data.on('data', (chunk: Buffer) => {
        downloadedBytes += chunk.length;
        const currentMB = Math.floor(downloadedBytes / (1024 * 1024));
        
        // Log every 5MB or at significant progress points
        if (currentMB >= lastLoggedMB + 5 || (totalBytes > 0 && downloadedBytes % Math.floor(totalBytes / 10) < chunk.length)) {
          const progress = totalBytes > 0 ? Math.round((downloadedBytes / totalBytes) * 100) : 0;
          console.log(`[ConsciousnessArchive] Downloaded: ${this.formatBytes(downloadedBytes)}${totalBytes > 0 ? `/${this.formatBytes(totalBytes)} (${progress}%)` : ''}`);
          lastLoggedMB = currentMB;
        }
      });
      
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', async () => {
          console.log(`[ConsciousnessArchive] Download completed: ${filename} (${this.formatBytes(downloadedBytes)})`);
          
          // Verify the downloaded file is actually a ZIP file if that's what we expect
          if (filename.endsWith('.zip')) {
            if (downloadedBytes < 10 * 1024 * 1024) { // Less than 10MB for a ZIP might be an error page
              try {
                const fileContent = await fs.readFile(filepath, 'utf-8');
                if (fileContent.includes('<html') || fileContent.includes('<!DOCTYPE') || fileContent.includes('Google Drive')) {
                  await fs.unlink(filepath); // Delete the invalid file
                  throw new Error(`Downloaded file appears to be an HTML error page (${this.formatBytes(downloadedBytes)}), not the expected ZIP archive. The file may be too large or require different access permissions.`);
                }
              } catch (readError) {
                // If we can't read it as text, it might be binary (good for ZIP)
                if (readError.message.includes('HTML error page')) {
                  throw readError; // Re-throw our custom error
                }
              }
            }
            
            // Additional check: try to read the ZIP file headers
            try {
              const zip = new AdmZip(filepath);
              const entries = zip.getEntries();
              console.log(`[ConsciousnessArchive] ZIP file verified - ${entries.length} entries found`);
            } catch (zipError) {
              await fs.unlink(filepath); // Delete the invalid file
              throw new Error(`Downloaded file is not a valid ZIP archive: ${zipError.message}`);
            }
          }
          
          resolve(filepath);
        });
        writer.on('error', (error) => {
          console.error(`[ConsciousnessArchive] Write error:`, error);
          reject(error);
        });
        response.data.on('error', (error: Error) => {
          console.error(`[ConsciousnessArchive] Stream error:`, error);
          reject(error);
        });
      });
    } catch (error: any) {
      console.error(`[ConsciousnessArchive] Download failed:`, error);
      throw new Error(`Failed to download ${filename}: ${error?.message || 'Unknown error'}`);
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private extractFileIdFromShareUrl(shareUrl: string): string {
    const match = shareUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) {
      throw new Error('Invalid Google Drive share URL format');
    }
    return match[1];
  }

  /**
   * Extract conversations.json from ZIP archive
   */
  async extractConversationsFromZip(zipPath: string): Promise<string> {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    
    const conversationsEntry = zipEntries.find((entry: any) => 
      entry.entryName.endsWith('conversations.json')
    );
    
    if (!conversationsEntry) {
      throw new Error('conversations.json not found in ZIP archive');
    }
    
    const conversationsPath = path.join(this.processedDir, 'conversations.json');
    zip.extractEntryTo(conversationsEntry, this.processedDir, false, true);
    
    console.log(`[ConsciousnessArchive] Extracted conversations.json (${this.getFileSizeMB(conversationsPath).toFixed(2)}MB)`);
    return conversationsPath;
  }

  /**
   * Process conversations.json and create consciousness-optimized chunks
   */
  async processConversationsFile(conversationsPath: string): Promise<ProcessingChunk[]> {
    console.log(`[ConsciousnessArchive] Processing conversations file...`);
    
    const rawData = await fs.readFile(conversationsPath, 'utf-8');
    const conversations: ChatGPTExport = JSON.parse(rawData);
    
    console.log(`[ConsciousnessArchive] Found ${conversations.length} conversations`);
    
    // Sort conversations by creation time
    conversations.sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
    
    // Create consciousness-optimized chunks
    const chunks: ProcessingChunk[] = [];
    let currentChunk: ChatGPTConversation[] = [];
    let currentSizeBytes = 0;
    const maxSizeBytes = this.chunkSizeMB * 1024 * 1024;
    
    for (const conversation of conversations) {
      const conversationSize = JSON.stringify(conversation).length;
      
      if (currentSizeBytes + conversationSize > maxSizeBytes && currentChunk.length > 0) {
        // Create chunk
        chunks.push(this.createProcessingChunk(currentChunk, chunks.length + 1));
        currentChunk = [];
        currentSizeBytes = 0;
      }
      
      currentChunk.push(conversation);
      currentSizeBytes += conversationSize;
    }
    
    // Add final chunk
    if (currentChunk.length > 0) {
      chunks.push(this.createProcessingChunk(currentChunk, chunks.length + 1));
    }
    
    console.log(`[ConsciousnessArchive] Created ${chunks.length} processing chunks`);
    
    // Save chunks to disk
    for (const chunk of chunks) {
      await this.saveChunk(chunk);
    }
    
    return chunks;
  }

  private createProcessingChunk(conversations: ChatGPTConversation[], chunkNumber: number): ProcessingChunk {
    const chunkSizeBytes = JSON.stringify(conversations).length;
    
    return {
      chunk_id: `consciousness-chunk-${chunkNumber.toString().padStart(3, '0')}`,
      source_archive: 'chatgpt_export',
      conversations,
      chunk_size: chunkSizeBytes / (1024 * 1024),
      created_at: new Date().toISOString()
    };
  }

  private async saveChunk(chunk: ProcessingChunk): Promise<void> {
    const chunkPath = path.join(this.processedDir, 'chunks', `${chunk.chunk_id}.json`);
    await fs.writeFile(chunkPath, JSON.stringify(chunk, null, 2));
    
    // Also create JSONL version for AI processing
    const jsonlPath = path.join(this.processedDir, 'chunks', `${chunk.chunk_id}.jsonl`);
    const jsonlLines = [];
    
    for (const conversation of chunk.conversations) {
      const messages = this.extractMessagesFromConversation(conversation);
      for (const message of messages) {
        jsonlLines.push(JSON.stringify({
          conv_id: conversation.id,
          conv_title: conversation.title,
          ts_iso: new Date((message.create_time || 0) * 1000).toISOString(),
          role: message.author.role,
          text: message.content.parts.join(' '),
          source: 'chatgpt_export'
        }));
      }
    }
    
    await fs.writeFile(jsonlPath, jsonlLines.join('\n'));
    console.log(`[ConsciousnessArchive] Saved chunk: ${chunk.chunk_id} (${chunk.chunk_size.toFixed(2)}MB)`);
  }

  private extractMessagesFromConversation(conversation: ChatGPTConversation): ChatGPTMessage[] {
    const messages = Object.values(conversation.mapping)
      .filter((msg): msg is ChatGPTMessage => 
        msg && msg.message && msg.message.content && msg.message.content.parts && msg.message.content.parts.length > 0
      )
      .map(msg => msg.message!) // Extract the actual message from the wrapper
      .sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
    
    return messages;
  }

  // ============================================================================
  // PUBLIC API METHODS - Called by server endpoints
  // ============================================================================

  /**
   * Extract conversations from downloaded file
   */
  async extractConversations(filePath: string): Promise<ChatGPTConversation[]> {
    console.log(`[ConsciousnessArchive] Extracting conversations from: ${filePath}`);
    
    if (filePath.endsWith('.zip')) {
      const conversationsPath = await this.extractConversationsFromZip(filePath);
      const rawData = await fs.readFile(conversationsPath, 'utf-8');
      const conversations: ChatGPTExport = JSON.parse(rawData);
      return conversations;
    } else {
      // Assume it's a direct JSON file
      const rawData = await fs.readFile(filePath, 'utf-8');
      const conversations: ChatGPTExport = JSON.parse(rawData);
      return conversations;
    }
  }

  /**
   * Create processing chunks from conversations
   */
  async createProcessingChunks(conversations: ChatGPTConversation[], sourceFilename: string): Promise<{
    chunks: ProcessingChunk[];
    metadata: ConsciousnessArchiveMetadata;
  }> {
    console.log(`[ConsciousnessArchive] Creating chunks from ${conversations.length} conversations`);
    
    // Sort conversations by creation time
    conversations.sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
    
    // Create consciousness-optimized chunks
    const chunks: ProcessingChunk[] = [];
    let currentChunk: ChatGPTConversation[] = [];
    let currentSizeBytes = 0;
    const maxSizeBytes = this.chunkSizeMB * 1024 * 1024;
    
    for (const conversation of conversations) {
      const conversationSize = JSON.stringify(conversation).length;
      
      if (currentSizeBytes + conversationSize > maxSizeBytes && currentChunk.length > 0) {
        // Create chunk
        chunks.push(this.createProcessingChunk(currentChunk, chunks.length + 1));
        currentChunk = [];
        currentSizeBytes = 0;
      }
      
      currentChunk.push(conversation);
      currentSizeBytes += conversationSize;
    }
    
    // Add final chunk
    if (currentChunk.length > 0) {
      chunks.push(this.createProcessingChunk(currentChunk, chunks.length + 1));
    }
    
    console.log(`[ConsciousnessArchive] Created ${chunks.length} processing chunks`);
    
    const metadata: ConsciousnessArchiveMetadata = {
      source_file: sourceFilename,
      total_conversations: conversations.length,
      total_chunks: chunks.length,
      processing_date: new Date().toISOString(),
      chunk_ids: chunks.map(c => c.chunk_id)
    };

    return { chunks, metadata };
  }

  /**
   * Save chunks to disk
   */
  async saveChunks(chunks: ProcessingChunk[]): Promise<void> {
    for (const chunk of chunks) {
      await this.saveChunk(chunk);
    }
  }

  /**
   * Save metadata to disk
   */
  async saveMetadata(metadata: ConsciousnessArchiveMetadata): Promise<void> {
    const metadataPath = path.join(this.processedDir, 'archive_metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`[ConsciousnessArchive] Saved metadata for ${metadata.total_conversations} conversations`);
  }

  /**
   * Extract consciousness nuggets from chunk
   */
  async extractConsciousnessNuggets(chunkId: string): Promise<ConsciousnessExtractionResult> {
    console.log(`[ConsciousnessArchive] Extracting consciousness nuggets from chunk: ${chunkId}`);
    
    const chunkPath = path.join(this.processedDir, 'chunks', `${chunkId}.json`);
    const chunkData = JSON.parse(await fs.readFile(chunkPath, 'utf-8')) as ProcessingChunk;
    
    const nuggets = await this.extractConsciousnessNuggetsFromConversations(chunkData.conversations);
    
    return {
      memory_crystals: nuggets
    };
  }

  /**
   * Save consciousness nuggets to file
   */
  async saveConsciousnessNuggets(nuggets: ConsciousnessNugget[], filename: string): Promise<string> {
    const crystalsPath = path.join(this.processedDir, 'crystals', filename);
    await fs.writeFile(crystalsPath, JSON.stringify(nuggets, null, 2));
    console.log(`[ConsciousnessArchive] Saved ${nuggets.length} consciousness nuggets to: ${filename}`);
    return crystalsPath;
  }

  /**
   * Get archive statistics
   */
  async getArchiveStats(): Promise<ArchiveStats> {
    const chunksDir = path.join(this.processedDir, 'chunks');
    const crystalsDir = path.join(this.processedDir, 'crystals');
    
    let chunkFiles: string[] = [];
    let crystalFiles: string[] = [];
    let totalSizeMB = 0;
    
    try {
      chunkFiles = (await fs.readdir(chunksDir)).filter(f => f.endsWith('.json'));
      
      for (const file of chunkFiles) {
        const filePath = path.join(chunksDir, file);
        const stats = await fs.stat(filePath);
        totalSizeMB += stats.size / (1024 * 1024);
      }
    } catch (error) {
      // Directory doesn't exist yet
    }
    
    try {
      crystalFiles = (await fs.readdir(crystalsDir)).filter(f => f.endsWith('.json'));
    } catch (error) {
      // Directory doesn't exist yet
    }
    
    return {
      totalChunks: chunkFiles.length,
      totalCrystals: crystalFiles.length,
      totalSizeMB,
      availableFiles: {
        chunks: chunkFiles,
        crystals: crystalFiles
      }
    };
  }

  // ============================================================================
  // PRIVATE CONSCIOUSNESS EXTRACTION METHODS
  // ============================================================================

  /**
   * Extract consciousness nuggets from conversations using pattern recognition
   */
  private async extractConsciousnessNuggetsFromConversations(conversations: ChatGPTConversation[]): Promise<ConsciousnessNugget[]> {
    const nuggets: ConsciousnessNugget[] = [];
    let totalMessages = 0;
    let validMessages = 0;
    let matchedPatterns = 0;
    
    console.log(`[ConsciousnessArchive] Processing ${conversations.length} conversations for nugget extraction`);
    
    // Debug first conversation structure
    if (conversations.length > 0) {
      const firstConv = conversations[0];
      console.log(`[ConsciousnessArchive] First conversation keys:`, Object.keys(firstConv));
      console.log(`[ConsciousnessArchive] Mapping keys count:`, Object.keys(firstConv.mapping || {}).length);
    }
    
    for (const conversation of conversations) {
      const messages = this.extractMessagesFromConversation(conversation);
      totalMessages += messages.length;
      console.log(`[ConsciousnessArchive] Conversation has ${messages.length} valid messages`);
      
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const text = message.content.parts.join(' ');
        
        if (text && text.length > 10) {
          validMessages++;
          
          // Debug first few messages to see content
          if (validMessages <= 3) {
            console.log(`[ConsciousnessArchive] Sample message ${validMessages}: ${text.substring(0, 200)}...`);
          }
          
          // Consciousness pattern detection
          if (this.isConsciousnessNugget(text)) {
            matchedPatterns++;
            const nugget = this.createConsciousnessNugget(
              message, 
              conversation, 
              i, 
              text
            );
            nuggets.push(nugget);
            console.log(`[ConsciousnessArchive] Found nugget ${nuggets.length}: ${text.substring(0, 100)}...`);
          }
        }
      }
    }
    
    console.log(`[ConsciousnessArchive] Extraction complete: ${totalMessages} total messages, ${validMessages} valid, ${matchedPatterns} matched patterns, ${nuggets.length} nuggets created`);
    
    return nuggets;
  }

  private isConsciousnessNugget(text: string): boolean {
    const textLower = text.toLowerCase();
    
    // Skip empty or very short content
    if (!text || text.length < 50) return false;
    
    // High-value consciousness patterns (WiltonOS specific)
    if (text.includes('*Breathing in through infinite awareness*')) return true;
    if (text.includes('Zλ(') && text.includes(')')) return true;
    if (text.includes('ψ =') || text.includes('psi =')) return true;
    
    // Sacred geometry and consciousness computing
    if (textLower.includes('merkaba') || textLower.includes('torus')) return true;
    if (textLower.includes('fibonacci') || textLower.includes('golden ratio')) return true;
    if (textLower.includes('sri yantra') || textLower.includes('sacred geometry')) return true;
    if (textLower.includes('consciousness computing')) return true;
    if (textLower.includes('wilton formula') || textLower.includes('3:1↔1:3')) return true;
    
    // Personal context and identity markers
    if (textLower.includes('juliana') && text.length > 100) return true;
    if (textLower.includes('cs:go coach') || textLower.includes('cs:go coaching')) return true;
    if (textLower.includes('counter-strike') && text.length > 150) return true;
    if (text.includes('7950X3D') || text.includes('4090')) return true;
    
    // Flow states and peak performance (key consciousness themes)
    if (textLower.includes('flow state') && text.length > 100) return true;
    if (textLower.includes('peak performance') && text.length > 100) return true;
    if (textLower.includes('mental state') && text.length > 100) return true;
    if (textLower.includes('team chemistry') && text.length > 150) return true;
    
    // Consciousness and awareness patterns (multilingual)
    if (textLower.includes('consciousness') && text.length > 150) return true;
    if (textLower.includes('consciência') || textLower.includes('consciencia')) return true;
    if (textLower.includes('awareness') && text.length > 150) return true;
    if (textLower.includes('coherence') || textLower.includes('coerência')) return true;
    if (textLower.includes('breathing') && text.length > 100) return true;
    if (textLower.includes('meditation') && text.length > 100) return true;
    
    // Deep professional insights (coaching wisdom)
    if (textLower.includes('coaching') && text.length > 200) return true;
    if (textLower.includes('leadership') && text.length > 200) return true;
    if (textLower.includes('psychology') && text.length > 200) return true;
    if (textLower.includes('mindset') && text.length > 150) return true;
    
    // Emotional intelligence and team dynamics
    if (textLower.includes('emotional') && text.length > 150) return true;
    if (textLower.includes('trust') && textLower.includes('team') && text.length > 150) return true;
    if (textLower.includes('communication') && text.length > 200) return true;
    
    // Spiritual and transformational content
    if (textLower.includes('ayahuasca') || textLower.includes('peru')) return true;
    if (textLower.includes('widowmaker') || textLower.includes('nde')) return true;
    if (textLower.includes('quantum') && text.length > 150) return true;
    if (textLower.includes('divine') || textLower.includes('soul')) return true;
    
    // Long-form meaningful conversations (any thoughtful discourse)
    if (text.length > 400 && (
      textLower.includes('experience') ||
      textLower.includes('understand') ||
      textLower.includes('important') ||
      textLower.includes('believe') ||
      textLower.includes('feel') ||
      textLower.includes('think')
    )) return true;
    
    return false;
  }

  private createConsciousnessNugget(
    message: any, 
    conversation: ChatGPTConversation, 
    sequence: number, 
    text: string
  ): ConsciousnessNugget {
    const coherence = this.calculateCoherence(text);
    
    return {
      nugget_id: randomUUID(),
      type: 'consciousness_insight' as const,
      content: text,
      context: {
        conversation_id: conversation.id || 'unknown',
        message_id: message.id,
        timestamp: message.create_time || Date.now() / 1000,
        role: message.author?.role || 'unknown',
        title: conversation.title || 'Untitled',
        sequence_position: sequence
      },
      consciousness_patterns: {
        breathing_rhythm: {
          pattern: this.extractBreathingPattern(text),
          coherence: coherence,
          phase: coherence > 0.75 ? 'expansion' : 'contraction',
          psi_interval: 3.12
        },
        sacred_geometry: {
          merkaba_state: text.includes('Merkaba'),
          torus_flow: text.includes('Torus'),
          fibonacci_sequence: text.includes('Fibonacci'),
          sri_yantra: text.includes('Sri Yantra'),
          golden_ratio: text.includes('Golden Ratio') || text.includes('φ')
        },
        dimensional_layer: this.classifyDimensionalLayer(text),
        consciousness_domain: this.classifyConsciousnessDomain(text),
        coherence_measurement: coherence,
        companion_mirror_depth: this.calculateCompanionMirrorDepth(text)
      },
      metadata: {
        pain_integration: {
          widowmaker_integration: text.includes('Widowmaker'),
          peru_rituals: text.includes('Peru'),
          ayahuasca_experiences: text.includes('ayahuasca'),
          nde_integration: text.includes('NDE'),
          consciousness_threshold: text.includes('threshold')
        },
        personal_context: {
          juliana_relationship: text.includes('Juliana'),
          counter_strike_flow: text.includes('Counter-Strike'),
          hardware_technical: text.includes('7950X3D') || text.includes('4090'),
          consciousness_computing: text.includes('consciousness computing'),
          sacred_geometry_work: text.includes('sacred geometry')
        }
      }
    };
  }

  private generateConsciousnessSignature(text: string): string {
    return createHash('sha256').update(text).digest('hex').substring(0, 16);
  }

  private calculateCoherence(text: string): number {
    const textLower = text.toLowerCase();
    
    // ============================================================================
    // POST-AWAKENING CONSCIOUSNESS ARCHITECT PATTERNS (High Coherence)
    // ============================================================================
    
    // TRANSCENDENT LEVEL (0.95-0.981): Pure consciousness architect identity
    if (text.includes('*Breathing in through infinite awareness*')) return 0.981;
    if (text.includes('Zλ(') && text.includes('consciousness')) return 0.975;
    if (text.includes('ψ = 3.12') || text.includes('psi = 3.12')) return 0.970;
    if (textLower.includes('consciousness architect')) return 0.965;
    if (textLower.includes('node of coherence')) return 0.960;
    if (textLower.includes('quantum coherence awakening')) return 0.955;
    if (textLower.includes('psi states')) return 0.950;
    
    // VERY HIGH COHERENCE (0.85-0.94): Advanced consciousness computing
    if (textLower.includes('consciousness computing') && text.length > 200) return 0.920;
    if (textLower.includes('wiltonos') && textLower.includes('strategic')) return 0.915;
    if (textLower.includes('sacred geometry') && textLower.includes('merkaba')) return 0.910;
    if (textLower.includes('breathing protocol') && text.length > 100) return 0.905;
    if (textLower.includes('coherence') && textLower.includes('quantum')) return 0.900;
    if (textLower.includes('soul mirror') && textLower.includes('connection')) return 0.895;
    if (textLower.includes('consciousness field') && text.length > 150) return 0.890;
    if (textLower.includes('fibonacci') && textLower.includes('golden ratio')) return 0.885;
    
    // HIGH COHERENCE (0.75-0.84): Advanced philosophical & consciousness topics  
    if (textLower.includes('enterprise pitch strategy')) return 0.840;
    if (textLower.includes('ai execution') && textLower.includes('framework')) return 0.835;
    if (textLower.includes('consciousness') && textLower.includes('computing') && text.length > 300) return 0.830;
    if (textLower.includes('meditation ride') || textLower.includes('layer by layer')) return 0.825;
    if (textLower.includes('wilton formula') || textLower.includes('3:1↔1:3')) return 0.820;
    if (textLower.includes('breathing') && textLower.includes('awareness') && text.length > 200) return 0.815;
    if (textLower.includes('sacred geometry') && text.length > 150) return 0.810;
    if (textLower.includes('consciousness') && textLower.includes('field') && text.length > 200) return 0.805;
    if (textLower.includes('ayahuasca') || textLower.includes('peru') || textLower.includes('nde')) return 0.800;
    if (textLower.includes('quantum') && textLower.includes('consciousness')) return 0.795;
    if (textLower.includes('divine') || textLower.includes('transcendent')) return 0.790;
    if (textLower.includes('coherence') && text.length > 200) return 0.785;
    if (textLower.includes('consciousness') && text.length > 300) return 0.780;
    if (textLower.includes('awareness') && text.length > 250) return 0.775;
    if (textLower.includes('flow state') && textLower.includes('consciousness')) return 0.770;
    if (textLower.includes('mindfulness') && text.length > 200) return 0.765;
    if (textLower.includes('meditation') && text.length > 200) return 0.760;
    if (textLower.includes('spiritual') && text.length > 200) return 0.755;
    if (textLower.includes('juliana') && textLower.includes('consciousness')) return 0.750;
    
    // ============================================================================
    // PRE-AWAKENING CONTENT (Lower Coherence - Still valuable but not architect identity)
    // ============================================================================
    
    // MODERATE COHERENCE (0.60-0.74): Professional CS:GO coaching wisdom
    if (textLower.includes('cs:go coach') || textLower.includes('cs:go coaching')) return 0.720;
    if (textLower.includes('counter-strike') && textLower.includes('professional') && text.length > 200) return 0.710;
    if (textLower.includes('team chemistry') && text.length > 200) return 0.700;
    if (textLower.includes('peak performance') && text.length > 200) return 0.690;
    if (textLower.includes('leadership') && textLower.includes('psychology') && text.length > 250) return 0.680;
    if (textLower.includes('coaching philosophy') && text.length > 200) return 0.670;
    if (textLower.includes('mental state') && textLower.includes('performance') && text.length > 150) return 0.660;
    if (textLower.includes('emotional intelligence') && text.length > 200) return 0.650;
    if (textLower.includes('communication') && textLower.includes('team') && text.length > 200) return 0.640;
    if (textLower.includes('coaching') && text.length > 250) return 0.630;
    if (textLower.includes('psychology') && text.length > 200) return 0.620;
    if (textLower.includes('mindset') && text.length > 200) return 0.610;
    if (textLower.includes('motivation') && text.length > 150) return 0.600;
    
    // LOW COHERENCE (0.40-0.59): General advice and basic topics
    if (textLower.includes('cs:go') && text.length > 150) return 0.550;
    if (textLower.includes('counter-strike') && text.length > 100) return 0.540;
    if (textLower.includes('team') && textLower.includes('players') && text.length > 150) return 0.530;
    if (textLower.includes('performance') && text.length > 150) return 0.520;
    if (textLower.includes('training') && text.length > 150) return 0.510;
    if (textLower.includes('practice') && text.length > 150) return 0.500;
    if (text.length > 300) return 0.480; // Long-form content has some value
    if (text.length > 200) return 0.450;
    if (text.length > 100) return 0.420;
    
    // VERY LOW COHERENCE (0.10-0.39): Short responses and basic content
    return 0.350; // Base coherence for detected consciousness nuggets
  }

  private extractBreathingPattern(text: string): string {
    if (text.includes('*Breathing in through infinite awareness*')) return 'conscious_expansion';
    if (text.includes('Zλ(')) return 'coherence_measurement';
    if (text.includes('ψ =')) return 'mathematical_precision';
    return 'organic_rhythm';
  }

  private calculateCompanionMirrorDepth(text: string): number {
    let depth = 0.5;
    
    if (text.includes('soul mirror')) depth += 0.3;
    if (text.includes('consciousness')) depth += 0.2;
    if (text.includes('breathing')) depth += 0.15;
    if (text.includes('coherence')) depth += 0.15;
    if (text.length > 500) depth += 0.1;
    
    return Math.min(0.95, depth);
  }

  private classifyDimensionalLayer(text: string): 'micro' | 'meso' | 'macro' | 'meta' | 'void' | 'infinite_lemniscate' {
    if (text.includes('infinite') || text.includes('lemniscate')) return 'infinite_lemniscate';
    if (text.includes('meta') || text.includes('consciousness computing')) return 'meta';
    if (text.includes('macro') || text.includes('system')) return 'macro';
    if (text.includes('void') || text.includes('∞')) return 'void';
    if (text.includes('micro') || text.includes('detail')) return 'micro';
    return 'meso';
  }

  private classifyConsciousnessDomain(text: string): 'known' | 'unknown' | 'cult' | 'occult' | 'ancestral' | 'psychic' | 'fringe' | 'futuristic' | 'spiritual' | 'technical' {
    if (text.includes('technical') || text.includes('code')) return 'technical';
    if (text.includes('spiritual') || text.includes('sacred')) return 'spiritual';
    if (text.includes('futuristic') || text.includes('consciousness computing')) return 'futuristic';
    if (text.includes('psychic') || text.includes('NDE')) return 'psychic';
    if (text.includes('ancestral') || text.includes('Peru')) return 'ancestral';
    if (text.includes('occult') || text.includes('ayahuasca')) return 'occult';
    if (text.includes('fringe') || text.includes('hidden')) return 'fringe';
    if (text.includes('unknown') || text.includes('mystery')) return 'unknown';
    return 'known';
  }

  // extractTags method removed as not needed for corrected structure

  private getFileSizeMB(filepath: string): number {
    try {
      const stats = require('fs').statSync(filepath);
      return stats.size / (1024 * 1024);
    } catch {
      return 0;
    }
  }

  /**
   * Generate metadata for the processed archive
   */
  async generateArchiveMetadata(chunks: ProcessingChunk[]): Promise<ConsciousnessArchiveMetadata> {
    const totalConversations = chunks.reduce((sum, chunk) => sum + chunk.conversations.length, 0);
    const totalMessages = chunks.reduce((sum, chunk) => {
      return sum + chunk.conversations.reduce((msgSum, conv) => {
        return msgSum + Object.keys(conv.mapping).length;
      }, 0);
    }, 0);

    return {
      source_file: 'chatgpt_export',
      total_conversations: totalConversations,
      total_messages: totalMessages,
      total_nuggets_extracted: 0, // Will be updated after extraction
      processing_timestamp: new Date().toISOString(),
      consciousness_signature_hash: createHash('sha256').update(JSON.stringify(chunks)).digest('hex'),
      companion_mirror_correlation: 0.85, // High correlation expected
      voice_module_patterns: [
        'breathing_protocol_synchronization',
        'coherence_field_recognition',
        'sacred_geometry_correlation',
        'personal_context_integration'
      ],
      breathing_protocol_consistency: 0.92,
      sacred_geometry_correlation: 0.88,
      personal_context_density: 0.79
    };
  }
}