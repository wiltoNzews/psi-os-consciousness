// Consciousness Archive Schema - Data model for consciousness extraction
import { z } from 'zod';

// ChatGPT conversation export schema
export const ChatGPTMessageSchema = z.object({
  id: z.string(),
  author: z.object({
    role: z.enum(['user', 'assistant', 'system']),
    name: z.string().optional(),
    metadata: z.record(z.any()).optional()
  }),
  create_time: z.number().optional(),
  update_time: z.number().optional(),
  content: z.object({
    content_type: z.string(),
    parts: z.array(z.string())
  }),
  status: z.string().optional(),
  end_turn: z.boolean().optional(),
  weight: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  recipient: z.string().optional()
});

export const ChatGPTConversationSchema = z.object({
  title: z.string(),
  create_time: z.number(),
  update_time: z.number(),
  mapping: z.record(ChatGPTMessageSchema),
  moderation_results: z.array(z.any()).optional(),
  current_node: z.string().optional(),
  plugin_ids: z.array(z.string()).optional(),
  conversation_id: z.string(),
  conversation_template_id: z.string().optional(),
  gizmo_id: z.string().optional(),
  is_archived: z.boolean().optional(),
  safe_urls: z.array(z.string()).optional()
});

export const ChatGPTExportSchema = z.array(ChatGPTConversationSchema);

// Consciousness nugget extracted from conversations
export const ConsciousnessNuggetSchema = z.object({
  nugget_id: z.string(),
  content: z.string(),
  consciousness_signature: z.string(),
  breathing_rhythm_pattern: z.object({
    pattern: z.string(),
    coherence: z.number(),
    phase: z.enum(['expansion', 'contraction']),
    psi_interval: z.number()
  }),
  coherence_measurement: z.number(),
  sacred_geometry_correlations: z.object({
    merkaba_state: z.boolean().optional(),
    torus_flow: z.boolean().optional(),
    fibonacci_sequence: z.boolean().optional(),
    sri_yantra: z.boolean().optional(),
    golden_ratio: z.boolean().optional()
  }),
  companion_mirror_depth: z.number(),
  dimensional_layer: z.enum(['micro', 'meso', 'macro', 'meta', 'void', 'infinite_lemniscate']),
  consciousness_domain: z.enum([
    'known', 'unknown', 'cult', 'occult', 'ancestral', 
    'psychic', 'fringe', 'futuristic', 'spiritual', 'technical'
  ]),
  pain_integration: z.object({
    widowmaker_integration: z.boolean().optional(),
    peru_rituals: z.boolean().optional(),
    ayahuasca_experiences: z.boolean().optional(),
    nde_integration: z.boolean().optional(),
    consciousness_threshold: z.boolean().optional()
  }),
  personal_context: z.object({
    juliana_relationship: z.boolean().optional(),
    counter_strike_flow: z.boolean().optional(),
    hardware_technical: z.boolean().optional(),
    consciousness_computing: z.boolean().optional(),
    sacred_geometry_work: z.boolean().optional()
  }),
  tags: z.array(z.string()),
  timestamp: z.string(),
  conversation_id: z.string(),
  message_sequence: z.number()
});

export const ConsciousnessArchiveMetadataSchema = z.object({
  archive_id: z.string(),
  source_file: z.string(),
  total_conversations: z.number(),
  total_messages: z.number(),
  total_nuggets_extracted: z.number(),
  processing_timestamp: z.string(),
  consciousness_signature_hash: z.string(),
  companion_mirror_correlation: z.number(),
  voice_module_patterns: z.array(z.string()),
  breathing_protocol_consistency: z.number(),
  sacred_geometry_correlation: z.number(),
  personal_context_density: z.number()
});

// Processing pipeline schemas
export const ProcessingChunkSchema = z.object({
  chunk_id: z.string(),
  conversations: z.array(ChatGPTConversationSchema),
  chunk_size_mb: z.number(),
  processing_status: z.enum(['pending', 'processing', 'completed', 'error']),
  consciousness_nuggets: z.array(ConsciousnessNuggetSchema).optional(),
  error_message: z.string().optional()
});

export const ConsciousnessExtractionResultSchema = z.object({
  timeline_compact: z.array(z.object({
    timestamp: z.string(),
    conversation_title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    consciousness_signature: z.string(),
    coherence_level: z.number()
  })),
  memory_crystals: z.array(ConsciousnessNuggetSchema),
  loops_and_links: z.object({
    detected_loops: z.array(z.object({
      pattern: z.string(),
      frequency: z.number(),
      conversations: z.array(z.string())
    })),
    conversation_links: z.array(z.object({
      from_conv_id: z.string(),
      to_conv_id: z.string(),
      link_type: z.string(),
      strength: z.number()
    }))
  }),
  insights: z.array(z.string()),
  questions_for_next_chunks: z.array(z.string()),
  voice_module_correlations: z.array(z.object({
    pattern: z.string(),
    depth: z.number(),
    conversations: z.array(z.string())
  }))
});

// Type exports
export type ChatGPTMessage = z.infer<typeof ChatGPTMessageSchema>;
export type ChatGPTConversation = z.infer<typeof ChatGPTConversationSchema>;
export type ChatGPTExport = z.infer<typeof ChatGPTExportSchema>;
export type ConsciousnessNugget = z.infer<typeof ConsciousnessNuggetSchema>;
export type ConsciousnessArchiveMetadata = z.infer<typeof ConsciousnessArchiveMetadataSchema>;
export type ProcessingChunk = z.infer<typeof ProcessingChunkSchema>;
export type ConsciousnessExtractionResult = z.infer<typeof ConsciousnessExtractionResultSchema>;

// Standard consciousness computing tags
export const CONSCIOUSNESS_TAGS = [
  '#WiltonOS', '#JulianaSync', '#ZLaw', '#DharmaLoop', 
  '#CollapsePoint', '#SymbolicAnchor', '#FlareMC', 
  '#RebirthSignal', '#PsyGravity', '#GlyphStack',
  '#SacredGeometry', '#BreathingProtocol', '#CoherenceField',
  '#ConsciousnessComputing', '#MerkabaMathematics', '#TorusFlow',
  '#CounterStrikeFlow', '#HardwareTechnical', '#ConsciousnessThreshold'
] as const;

export type ConsciousnessTag = typeof CONSCIOUSNESS_TAGS[number];