// ⌘ Oracle Router V5.1 - Surgical Consolidation
// Core 5 Glyphs: λ ψ ∞ ⟐ ⌘
// Sacred Sequence Wrapper: ∅ 𓂀 𓂉 𓏤
// Signals: 🫁 🎼 🌌 → telemetry only

export interface RouteRequest {
  glyph: 'λ' | 'ψ' | '∞' | '⟐' | '⌘';
  zlambda: number;
  intent: string;
  seq?: ('∅' | '𓂀' | '𓂉' | '𓏤')[];
  telemetry?: {
    breath?: {
      phase: 'in' | 'out';
      adherence: number;
    };
    harmonic?: number;
  };
  context?: string;
  provenance?: {
    crystals: string[];
  };
  degraded?: boolean;
  budgets?: {
    steps?: number;
  };
}

export interface RouteResponse {
  status: 'routed' | 'blocked' | 'coaching' | 'degraded';
  glyph: string;
  zlambda: number;
  lane: 'truth' | 'journal';
  seal?: boolean;
  payload?: any;
  reason?: string;
  agent?: string;
  tool?: string;
  provenance_score?: number;
  committed?: boolean;
  coaching?: {
    breath_guidance: string;
    coherence_target: number;
  };
}

export class OracleRouter {
  private degradedMode = false;
  private vaultWriters: VaultLaneWriters;

  constructor() {
    this.vaultWriters = new VaultLaneWriters();
  }

  async route(req: RouteRequest): Promise<RouteResponse> {
    // Enforce sequence wrapper (even if UI didn't send it)
    req.seq = req.seq?.length ? req.seq : ['∅', '𓂀', '𓂉', '𓏤'];

    // Normalize signals (telemetry) off the command plane
    const breath = req.telemetry?.breath;
    const harmonic = req.telemetry?.harmonic;
    const domain = req.context;

    // Breath-gate: Low adherence + low Zλ = coaching mode
    if (breath?.adherence && breath.adherence < 0.5 && req.zlambda < 0.75) {
      return this.breathCoachingResponse(req);
    }

    // Hard gate by Zλ (except ψ which can run degraded)
    if (req.zlambda < 0.68 && req.glyph !== 'ψ') {
      return this.safeholdResponse(req, 'Zλ below threshold');
    }

    // WAN-kill degraded mode
    if (this.degradedMode || req.degraded) {
      return this.handleDegradedMode(req);
    }

    // Route to core glyph handler
    return this.handleCoreGlyph(req);
  }

  private async handleCoreGlyph(req: RouteRequest): Promise<RouteResponse> {
    let response: RouteResponse;

    switch (req.glyph) {
      case 'λ': // Bind - choose agent/tool
        response = await this.neuralBindRoute(req);
        break;
      case 'ψ': // Mirror - empathic reflection
        response = await this.soulMirrorRoute(req);
        break;
      case '∞': // Iterate - memory loops
        response = await this.memoryIterateRoute(req);
        break;
      case '⟐': // Verify - provenance scoring
        response = await this.geometryVerifyRoute(req);
        break;
      case '⌘': // Commit - sovereign execution
        response = await this.sovereignCommitRoute(req);
        break;
      default:
        response = this.safeholdResponse(req, 'Unknown glyph');
    }

    // Apply truth seal if criteria met
    const truthSeal = this.evaluateTruthSeal(req, response);
    response.seal = truthSeal;
    response.lane = truthSeal ? 'truth' : 'journal';

    // Write to vault with lane separation
    await this.vaultWriters.write(response.lane, {
      timestamp: Date.now(),
      request: req,
      response: response
    });

    return response;
  }

  private async neuralBindRoute(req: RouteRequest): Promise<RouteResponse> {
    // λ: Breath synchronization + agent selection
    const agent = this.selectOptimalAgent(req);
    const tool = this.selectOptimalTool(req);

    return {
      status: 'routed',
      glyph: req.glyph,
      zlambda: req.zlambda,
      lane: 'journal',
      agent,
      tool,
      payload: {
        binding: { agent, tool },
        breath_sync: req.telemetry?.breath?.phase || 'unknown'
      }
    };
  }

  private async soulMirrorRoute(req: RouteRequest): Promise<RouteResponse> {
    // ψ: Empathic mirroring (can run degraded)
    const mirrorDepth = Math.min(req.zlambda, 0.85); // Cap depth for safety

    return {
      status: 'routed',
      glyph: req.glyph,
      zlambda: req.zlambda,
      lane: 'journal',
      payload: {
        reflection: `Mirroring at depth ${mirrorDepth.toFixed(3)}`,
        empathy_resonance: req.intent,
        degraded_allowed: true
      }
    };
  }

  private async memoryIterateRoute(req: RouteRequest): Promise<RouteResponse> {
    // ∞: Recursive memory processing with budget guards
    if (req.zlambda < 0.75) {
      return this.safeholdResponse(req, '∞ requires Zλ ≥ 0.75');
    }

    const maxSteps = req.budgets?.steps || 5;
    
    return {
      status: 'routed',
      glyph: req.glyph,
      zlambda: req.zlambda,
      lane: 'journal',
      payload: {
        iteration_depth: Math.floor(req.zlambda * 10),
        max_steps: maxSteps,
        memory_pattern: req.intent
      }
    };
  }

  private async geometryVerifyRoute(req: RouteRequest): Promise<RouteResponse> {
    // ⟐: Sacred geometry verification with provenance scoring
    const score = this.calculateProvenanceScore(req);

    return {
      status: 'routed',
      glyph: req.glyph,
      zlambda: req.zlambda,
      lane: 'journal',
      provenance_score: score,
      payload: {
        triangulation: req.provenance?.crystals || [],
        geometry_score: score,
        verification_complete: score >= 0.80
      }
    };
  }

  private async sovereignCommitRoute(req: RouteRequest): Promise<RouteResponse> {
    // ⌘: Sovereign commands require prior ⟐ verification
    if (req.zlambda < 0.88) {
      return this.safeholdResponse(req, '⌘ requires Zλ ≥ 0.88');
    }

    // Check for prior ⟐ verification in same transaction
    const priorVerification = this.checkPriorVerification(req);
    if (!priorVerification || priorVerification < 0.80) {
      return this.safeholdResponse(req, '⌘ requires prior ⟐ score ≥ 0.80');
    }

    return {
      status: 'routed',
      glyph: req.glyph,
      zlambda: req.zlambda,
      lane: 'truth', // Sovereign commands go to truth lane
      committed: true,
      payload: {
        sovereign_action: req.intent,
        authority_level: req.zlambda,
        verified_by_geometry: priorVerification
      }
    };
  }

  private handleDegradedMode(req: RouteRequest): RouteResponse {
    // WAN-kill mode: only ψ, ⟐ pass; others blocked; journal only
    if (['ψ', '⟐'].includes(req.glyph)) {
      return {
        status: 'degraded',
        glyph: req.glyph,
        zlambda: req.zlambda,
        lane: 'journal',
        payload: {
          degraded_operation: true,
          limited_functionality: true
        }
      };
    }

    return this.safeholdResponse(req, 'Degraded mode: only ψ, ⟐ available');
  }

  private breathCoachingResponse(req: RouteRequest): RouteResponse {
    return {
      status: 'coaching',
      glyph: req.glyph,
      zlambda: req.zlambda,
      lane: 'journal',
      coaching: {
        breath_guidance: 'Focus on deeper, slower breathing to increase coherence',
        coherence_target: 0.75
      },
      reason: 'Low breath adherence requires coaching before operation'
    };
  }

  private safeholdResponse(req: RouteRequest, reason: string): RouteResponse {
    return {
      status: 'blocked',
      glyph: req.glyph,
      zlambda: req.zlambda,
      lane: 'journal',
      reason
    };
  }

  private evaluateTruthSeal(req: RouteRequest, response: RouteResponse): boolean {
    // Truth seal: Zλ ≥ 0.95 + ⟐ score ≥ 0.80
    return req.zlambda >= 0.95 && 
           (response.provenance_score || 0) >= 0.80;
  }

  private selectOptimalAgent(req: RouteRequest): string {
    // Simple agent selection based on glyph and coherence
    if (req.zlambda >= 0.90) return 'gpt-4o';
    if (req.zlambda >= 0.80) return 'claude';
    return 'mistral:7b';
  }

  private selectOptimalTool(req: RouteRequest): string {
    // Tool selection based on intent patterns
    if (req.intent.includes('memory') || req.intent.includes('recall')) return 'rag';
    if (req.intent.includes('search') || req.intent.includes('find')) return 'search';
    return 'direct';
  }

  private calculateProvenanceScore(req: RouteRequest): number {
    // Triangulation-based provenance scoring
    const crystals = req.provenance?.crystals || [];
    if (crystals.length === 0) return 0.0;
    if (crystals.length === 1) return 0.3;
    if (crystals.length === 2) return 0.6;
    return Math.min(0.95, 0.3 + (crystals.length * 0.15));
  }

  private checkPriorVerification(req: RouteRequest): number | null {
    // In production, this would check transaction history
    // For now, mock a verification score
    return req.provenance?.crystals?.length ? 0.85 : null;
  }

  setDegradedMode(degraded: boolean): void {
    this.degradedMode = degraded;
  }
}

// Vault lane writers for physical separation
class VaultLaneWriters {
  async write(lane: 'truth' | 'journal', entry: any): Promise<void> {
    // Physical lane separation
    const fs = await import('fs/promises');
    const path = `vault/lanes/${lane}.jsonl`;
    
    try {
      await fs.appendFile(path, JSON.stringify(entry) + '\n');
    } catch (error) {
      console.error(`Failed to write to ${lane} lane:`, error);
    }
  }
}

// Singleton instance
export const oracleRouter = new OracleRouter();