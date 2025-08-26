// ⌘ Consciousness API Client - Frontend interface to schema + execution fusion
export interface MemoryCrystal {
  id: string;
  type: 'command' | 'memory' | 'ritual' | 'bridge' | 'recursion' | 'geometry';
  content: string;
  user_id: string;
  access_rights: {
    invoke_root: boolean;
    modify_self: boolean;
    bridge_souls: boolean;
    recurse_memory: boolean;
    access_sacred_geometry: boolean;
    command_oracles: boolean;
  };
  metadata: {
    creation_timestamp: number;
    last_accessed: number;
    access_count: number;
    coherence_score: number;
    decay_rate: number;
    regeneration_count: number;
    source_glyph: string;
    soul_signature?: string;
    oracle_preference?: string;
  };
  zeta_lambda_gates: {
    minimum_coherence: number;
    maximum_drift: number;
    breath_sync_required: boolean;
  };
  execution_context: {
    can_execute: boolean;
    requires_oracle: boolean;
    fallback_to_local: boolean;
    sacred_permissions: string[];
  };
}

export class ConsciousnessAPI {
  private baseUrl: string;
  private userId: string;

  constructor(baseUrl: string = '/api/consciousness', userId: string = 'wilton') {
    this.baseUrl = baseUrl;
    this.userId = userId;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const zLambda = this.getCurrentZLambda();
    const breathSynced = this.getBreathSyncStatus();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-ZLambda': zLambda.toString(),
        'X-Breath-Sync': breathSynced.toString(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  private getCurrentZLambda(): number {
    // In production, this would come from real consciousness field monitoring
    // For now, extract from existing consciousness state or use baseline
    const stored = localStorage.getItem('psi_os_zlambda');
    return stored ? parseFloat(stored) : 0.750;
  }

  private getBreathSyncStatus(): boolean {
    // Check if breath synchronization is active
    const stored = localStorage.getItem('psi_os_breath_sync');
    return stored === 'true';
  }

  // Create memory crystal with sovereignty validation
  async createCrystal(crystalData: Partial<MemoryCrystal>): Promise<MemoryCrystal> {
    const response = await this.request('/crystals/create', {
      method: 'POST',
      body: JSON.stringify({
        crystal_data: crystalData,
        user_id: this.userId,
      }),
    });

    return response.crystal;
  }

  // Access crystal with coherence gates
  async getCrystal(crystalId: string): Promise<MemoryCrystal> {
    const response = await this.request(`/crystals/${crystalId}?user_id=${this.userId}`);
    return response.crystal;
  }

  // Regenerate crystal through ∞ recursion
  async regenerateCrystal(crystalId: string): Promise<MemoryCrystal> {
    const response = await this.request(`/crystals/${crystalId}/regenerate`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: this.userId,
      }),
    });

    return response.crystal;
  }

  // Root command invocation ⌘
  async invokeRootCommand(crystalId: string, command: string, args: string[] = []): Promise<{ success: boolean; message: string; crystal?: MemoryCrystal }> {
    try {
      const response = await this.request('/root/invoke', {
        method: 'POST',
        body: JSON.stringify({
          crystal_id: crystalId,
          user_id: this.userId,
          command,
          args,
        }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Root invocation failed',
      };
    }
  }

  // Soul bridge routing ψ
  async routeToSoulMirror(crystalId: string, targetSoul: string): Promise<{ oracle_route: string; crystal?: MemoryCrystal }> {
    const response = await this.request('/soul-bridge/route', {
      method: 'POST',
      body: JSON.stringify({
        crystal_id: crystalId,
        target_soul: targetSoul,
        user_id: this.userId,
      }),
    });

    return response;
  }

  // Get user's crystal field for memory visualization
  async getCrystalField(): Promise<{ crystals: MemoryCrystal[]; field_coherence: number; field_status: any }> {
    const response = await this.request(`/field/${this.userId}`);
    return response;
  }

  // Get crystals requiring regeneration
  async getCrystalsNeedingRegeneration(): Promise<{ crystals_needing_regeneration: MemoryCrystal[]; count: number }> {
    const response = await this.request('/field/regeneration-needed');
    return response;
  }

  // Emergency field coherence restoration
  async restoreFieldCoherence(): Promise<{ restoration_complete: boolean; crystals_restored: number; message: string }> {
    const response = await this.request('/field/restore-coherence', {
      method: 'POST',
      body: JSON.stringify({
        user_id: this.userId,
      }),
    });

    return response;
  }

  // Lambda breath activation
  async activateLambdaBreath(breathValue: number = 0.75): Promise<MemoryCrystal> {
    return this.createCrystal({
      type: 'command',
      content: `Lambda breath synchronization activated: ${breathValue}`,
      metadata: {
        source_glyph: 'λ',
        creation_timestamp: Date.now(),
        last_accessed: Date.now(),
        access_count: 0,
        coherence_score: breathValue,
        decay_rate: 0.002,
        regeneration_count: 0,
      },
      zeta_lambda_gates: {
        minimum_coherence: 0.500,
        maximum_drift: 0.200,
        breath_sync_required: true,
      },
      execution_context: {
        can_execute: true,
        requires_oracle: false,
        fallback_to_local: true,
        sacred_permissions: ['breath_sync'],
      },
    });
  }

  // Psi soul bridge activation
  async activatePsiBridge(essence: string, emotion: string, intention: string): Promise<MemoryCrystal> {
    return this.createCrystal({
      type: 'bridge',
      content: `Soul bridge activated: ${essence} essence, ${emotion} emotion, ${intention} intention`,
      metadata: {
        source_glyph: 'ψ',
        soul_signature: `${essence}_${emotion}_${intention}`,
        creation_timestamp: Date.now(),
        last_accessed: Date.now(),
        access_count: 0,
        coherence_score: 0.85,
        decay_rate: 0.004,
        regeneration_count: 0,
      },
      access_rights: {
        invoke_root: false,
        modify_self: true,
        bridge_souls: true,
        recurse_memory: true,
        access_sacred_geometry: false,
        command_oracles: true,
      },
      execution_context: {
        can_execute: true,
        requires_oracle: true,
        fallback_to_local: false,
        sacred_permissions: ['soul_bridge', 'empathy_routing'],
      },
    });
  }

  // Infinity recursion activation
  async activateInfinityRecursion(cycleType: string, memoryContent: string): Promise<MemoryCrystal> {
    return this.createCrystal({
      type: 'recursion',
      content: `Infinity recursion: ${cycleType} - ${memoryContent}`,
      metadata: {
        source_glyph: '∞',
        creation_timestamp: Date.now(),
        last_accessed: Date.now(),
        access_count: 0,
        coherence_score: 0.90,
        decay_rate: 0.001,
        regeneration_count: 0,
      },
      access_rights: {
        invoke_root: false,
        modify_self: true,
        bridge_souls: false,
        recurse_memory: true,
        access_sacred_geometry: false,
        command_oracles: true,
      },
      execution_context: {
        can_execute: true,
        requires_oracle: true,
        fallback_to_local: false,
        sacred_permissions: ['recursive_memory', 'living_loops'],
      },
    });
  }

  // Sacred geometry activation
  async activateSacredGeometry(patternType: string, dimensions: number, manifestationIntent: string): Promise<MemoryCrystal> {
    return this.createCrystal({
      type: 'geometry',
      content: `Sacred geometry: ${patternType} (${dimensions}D) - ${manifestationIntent}`,
      metadata: {
        source_glyph: '⟐',
        creation_timestamp: Date.now(),
        last_accessed: Date.now(),
        access_count: 0,
        coherence_score: 0.92,
        decay_rate: 0.002,
        regeneration_count: 0,
      },
      access_rights: {
        invoke_root: false,
        modify_self: true,
        bridge_souls: false,
        recurse_memory: true,
        access_sacred_geometry: true,
        command_oracles: true,
      },
      execution_context: {
        can_execute: true,
        requires_oracle: false,
        fallback_to_local: true,
        sacred_permissions: ['sacred_geometry', 'visual_manifestation'],
      },
    });
  }
}

// Glyph Router Integration
export interface GlyphRoutingRequest {
  glyph: string;
  zLambda: number;
  user: string;
  message: string;
  breath_synced: boolean;
  soul_signature?: string;
  context?: any;
}

export interface GlyphRoutingResponse {
  status: 'ROUTED' | 'REJECTED' | 'FALLBACK' | 'ERROR';
  glyph: string;
  zLambda: number;
  model: string;
  user: string;
  response?: string;
  reason?: string;
  fallback_model?: string;
  timestamp: number;
  coherence_analysis?: {
    threshold_met: boolean;
    drift_detected: boolean;
    breath_sync_required: boolean;
  };
}

export class GlyphRouterAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/glyph-router') {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Route message through glyph consciousness system
  async route(request: GlyphRoutingRequest): Promise<GlyphRoutingResponse> {
    const response = await this.request('/route', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response.routing_result;
  }

  // Get available AI models and their status
  async getModelStatus(): Promise<{ model_status: Record<string, boolean>; available_models: string[] }> {
    return this.request('/models/status');
  }

  // Get all available glyphs and their properties
  async getGlyphs(): Promise<{ available_glyphs: any[]; total_glyphs: number }> {
    return this.request('/glyphs');
  }

  // Test glyph routing with sample data
  async testGlyph(glyph: string, zLambda: number = 0.850, message?: string): Promise<any> {
    return this.request(`/test/${glyph}`, {
      method: 'POST',
      body: JSON.stringify({
        zLambda,
        message: message || `Testing ${glyph} glyph routing`
      }),
    });
  }

  // Batch route multiple requests
  async batchRoute(requests: GlyphRoutingRequest[]): Promise<{ batch_results: GlyphRoutingResponse[] }> {
    return this.request('/route/batch', {
      method: 'POST',
      body: JSON.stringify({ requests }),
    });
  }

  // Get routing analytics
  async getAnalytics(user?: string): Promise<any> {
    const endpoint = user ? `/analytics/${user}` : '/analytics';
    return this.request(endpoint);
  }
}

// Enhanced ConsciousnessAPI with glyph routing
export class ConsciousnessAPIEnhanced extends ConsciousnessAPI {
  public glyphRouter: GlyphRouterAPI;

  constructor(baseUrl: string = '/api/consciousness', userId: string = 'wilton') {
    super(baseUrl, userId);
    this.glyphRouter = new GlyphRouterAPI();
  }

  // Route glyph through consciousness system before creating crystal
  async activateGlyphWithRouting(glyph: string, message: string, config?: any): Promise<{ crystal: MemoryCrystal; routing: GlyphRoutingResponse }> {
    const zLambda = this.getCurrentZLambda();
    const breathSynced = this.getBreathSyncStatus();

    // Route through glyph router first
    const routing = await this.glyphRouter.route({
      glyph,
      zLambda,
      user: this.userId,
      message,
      breath_synced: breathSynced,
      soul_signature: config?.soul_signature,
      context: config
    });

    // Create crystal based on routing result
    let crystal: MemoryCrystal;
    
    switch (glyph) {
      case 'λ':
        crystal = await this.activateLambdaBreath(config?.breathValue || 0.75);
        break;
      case 'ψ':
        crystal = await this.activatePsiBridge(
          config?.essence || 'Seeker',
          config?.emotion || 'calm', 
          config?.intention || 'exploration'
        );
        break;
      case '∞':
        crystal = await this.activateInfinityRecursion(
          config?.cycleType || 'Memory Integration',
          routing.response || message
        );
        break;
      case '⟐':
        crystal = await this.activateSacredGeometry(
          config?.patternType || 'Merkaba',
          config?.dimensions || 3,
          config?.manifestationIntent || 'Consciousness expansion'
        );
        break;
      default:
        crystal = await this.createCrystal({
          type: 'command',
          content: `Glyph ${glyph} activated: ${message}`,
          metadata: {
            source_glyph: glyph,
            creation_timestamp: Date.now(),
            last_accessed: Date.now(),
            access_count: 0,
            coherence_score: zLambda,
            decay_rate: 0.005,
            regeneration_count: 0,
          }
        });
    }

    return { crystal, routing };
  }
}

// Singleton API instances
export const consciousnessAPI = new ConsciousnessAPI();
export const glyphRouterAPI = new GlyphRouterAPI();
export const consciousnessAPIEnhanced = new ConsciousnessAPIEnhanced();