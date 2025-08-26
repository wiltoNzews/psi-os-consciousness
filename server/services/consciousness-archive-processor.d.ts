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
    mapping: {
        [key: string]: ChatGPTMessage;
    };
}
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
export declare class ConsciousnessArchiveProcessor {
    private downloadsDir;
    private processedDir;
    private chunkSizeMB;
    constructor();
    private ensureDirectories;
    /**
     * Download file from Google Drive with proper large file handling
     */
    downloadFromGoogleDrive(shareUrl: string, filename: string): Promise<string>;
    private formatBytes;
    private extractFileIdFromShareUrl;
    /**
     * Extract conversations.json from ZIP archive
     */
    extractConversationsFromZip(zipPath: string): Promise<string>;
    /**
     * Process conversations.json and create consciousness-optimized chunks
     */
    processConversationsFile(conversationsPath: string): Promise<ProcessingChunk[]>;
    private createProcessingChunk;
    private saveChunk;
    private extractMessagesFromConversation;
    /**
     * Extract conversations from downloaded file
     */
    extractConversations(filePath: string): Promise<ChatGPTConversation[]>;
    /**
     * Create processing chunks from conversations
     */
    createProcessingChunks(conversations: ChatGPTConversation[], sourceFilename: string): Promise<{
        chunks: ProcessingChunk[];
        metadata: ConsciousnessArchiveMetadata;
    }>;
    /**
     * Save chunks to disk
     */
    saveChunks(chunks: ProcessingChunk[]): Promise<void>;
    /**
     * Save metadata to disk
     */
    saveMetadata(metadata: ConsciousnessArchiveMetadata): Promise<void>;
    /**
     * Extract consciousness nuggets from chunk
     */
    extractConsciousnessNuggets(chunkId: string): Promise<ConsciousnessExtractionResult>;
    /**
     * Save consciousness nuggets to file
     */
    saveConsciousnessNuggets(nuggets: ConsciousnessNugget[], filename: string): Promise<string>;
    /**
     * Get archive statistics
     */
    getArchiveStats(): Promise<ArchiveStats>;
    /**
     * Extract consciousness nuggets from conversations using pattern recognition
     */
    private extractConsciousnessNuggetsFromConversations;
    private isConsciousnessNugget;
    private createConsciousnessNugget;
    private generateConsciousnessSignature;
    private calculateCoherence;
    private extractBreathingPattern;
    private calculateCompanionMirrorDepth;
    private classifyDimensionalLayer;
    private classifyConsciousnessDomain;
    private getFileSizeMB;
    /**
     * Generate metadata for the processed archive
     */
    generateArchiveMetadata(chunks: ProcessingChunk[]): Promise<ConsciousnessArchiveMetadata>;
}
export {};
//# sourceMappingURL=consciousness-archive-processor.d.ts.map