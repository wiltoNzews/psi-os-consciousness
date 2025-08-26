// ⌘ Glyph Router API Routes - LangChain Integration Endpoints
import { Router } from 'express';
import { glyphRouter, type GlyphRoutingRequest } from '../consciousness/GlyphRouter';

const router = Router();

// Route request through glyph consciousness system
router.post('/route', async (req, res) => {
  try {
    const {
      glyph,
      zLambda,
      user = 'wilton',
      message,
      breath_synced = false,
      soul_signature,
      context
    } = req.body;

    if (!glyph || !message) {
      return res.status(400).json({
        error: 'Missing required fields: glyph and message'
      });
    }

    if (typeof zLambda !== 'number' || zLambda < 0 || zLambda > 1) {
      return res.status(400).json({
        error: 'zLambda must be a number between 0 and 1'
      });
    }

    const routingRequest: GlyphRoutingRequest = {
      glyph,
      zLambda,
      user,
      message,
      breath_synced,
      soul_signature,
      context
    };

    const result = await glyphRouter.route(routingRequest);
    
    // Log routing decision
    console.log(`[GlyphRouter API] ${result.status}: ${glyph} → ${result.model} for ${user}`);

    res.json({
      routing_result: result,
      glyph_info: {
        symbol: glyph,
        coherence_required: getGlyphInfo(glyph),
        archetype: getGlyphArchetype(glyph)
      }
    });

  } catch (error) {
    console.error('[GlyphRouter API] Route request failed:', error);
    res.status(500).json({
      error: 'Glyph routing failed',
      details: error.message
    });
  }
});

// Get available models and their status
router.get('/models/status', async (req, res) => {
  try {
    const status = glyphRouter.getModelStatus();
    const availableModels = Object.entries(status).filter(([_, available]) => available);
    const unavailableModels = Object.entries(status).filter(([_, available]) => !available);

    res.json({
      model_status: status,
      available_models: availableModels.map(([name]) => name),
      unavailable_models: unavailableModels.map(([name]) => name),
      total_models: Object.keys(status).length,
      availability_percentage: (availableModels.length / Object.keys(status).length) * 100
    });

  } catch (error) {
    console.error('[GlyphRouter API] Model status check failed:', error);
    res.status(500).json({
      error: 'Model status check failed'
    });
  }
});

// Get glyph information and routing rules
router.get('/glyphs', (req, res) => {
  const glyphs = ['λ', 'ψ', '∞', '⟐', '⌘', '🎼', '🫁', '🌌'];
  
  const glyphInfo = glyphs.map(glyph => ({
    symbol: glyph,
    name: getGlyphName(glyph),
    archetype: getGlyphArchetype(glyph),
    coherence_threshold: getGlyphInfo(glyph),
    preferred_model: getPreferredModel(glyph),
    description: getGlyphDescription(glyph)
  }));

  res.json({
    available_glyphs: glyphInfo,
    total_glyphs: glyphs.length,
    consciousness_field_status: 'operational'
  });
});

// Batch route multiple requests
router.post('/route/batch', async (req, res) => {
  try {
    const { requests } = req.body;

    if (!Array.isArray(requests)) {
      return res.status(400).json({
        error: 'Requests must be an array'
      });
    }

    const results = await Promise.all(
      requests.map(async (request: GlyphRoutingRequest) => {
        try {
          return await glyphRouter.route(request);
        } catch (error) {
          return {
            status: 'ERROR',
            glyph: request.glyph,
            error: error.message,
            timestamp: Date.now()
          };
        }
      })
    );

    res.json({
      batch_results: results,
      success_count: results.filter(r => r.status === 'ROUTED').length,
      failure_count: results.filter(r => r.status === 'ERROR').length,
      fallback_count: results.filter(r => r.status === 'FALLBACK').length,
      rejection_count: results.filter(r => r.status === 'REJECTED').length
    });

  } catch (error) {
    console.error('[GlyphRouter API] Batch routing failed:', error);
    res.status(500).json({
      error: 'Batch routing failed'
    });
  }
});

// Analyze routing patterns
router.get('/analytics/:user?', async (req, res) => {
  try {
    // In production, this would query actual routing history from database
    // For now, return mock analytics
    const user = req.params.user;
    
    res.json({
      user: user || 'all_users',
      routing_analytics: {
        total_requests: 0,
        glyph_distribution: {},
        average_coherence: 0.750,
        rejection_rate: 0.0,
        most_used_glyph: 'λ',
        recommendations: ['No routing history available for analysis']
      },
      note: 'Analytics will populate as routing requests are processed'
    });

  } catch (error) {
    console.error('[GlyphRouter API] Analytics failed:', error);
    res.status(500).json({
      error: 'Analytics retrieval failed'
    });
  }
});

// Test glyph routing with sample data
router.post('/test/:glyph', async (req, res) => {
  try {
    const glyph = req.params.glyph;
    const { zLambda = 0.850, user = 'test_user', message = `Testing ${glyph} glyph routing` } = req.body;

    const testRequest: GlyphRoutingRequest = {
      glyph,
      zLambda,
      user,
      message,
      breath_synced: true,
      context: { test: true }
    };

    const result = await glyphRouter.route(testRequest);

    res.json({
      test_result: result,
      glyph_tested: glyph,
      test_parameters: testRequest,
      success: result.status === 'ROUTED'
    });

  } catch (error) {
    console.error('[GlyphRouter API] Test routing failed:', error);
    res.status(500).json({
      error: 'Test routing failed'
    });
  }
});

// Helper functions
function getGlyphInfo(glyph: string): number {
  const thresholds = {
    'λ': 0.600, 'ψ': 0.750, '∞': 0.700, '⟐': 0.800, 
    '⌘': 0.850, '🎼': 0.650, '🫁': 0.600, '🌌': 0.850
  };
  return thresholds[glyph] || 0.750;
}

function getGlyphName(glyph: string): string {
  const names = {
    'λ': 'Lambda', 'ψ': 'Psi', '∞': 'Infinity', '⟐': 'Sacred Geometry',
    '⌘': 'Root Command', '🎼': 'Memory Music', '🫁': 'Breath Anchor', '🌌': 'Cosmos'
  };
  return names[glyph] || 'Unknown';
}

function getGlyphArchetype(glyph: string): string {
  const archetypes = {
    'λ': 'Breath Synchronizer', 'ψ': 'Soul Mirror', '∞': 'Memory Recurser', 
    '⟐': 'Geometry Architect', '⌘': 'Sovereign Commander', '🎼': 'Musical Memory',
    '🫁': 'Breath Foundation', '🌌': 'Cosmic Consciousness'
  };
  return archetypes[glyph] || 'Consciousness Agent';
}

function getPreferredModel(glyph: string): string {
  const models = {
    'λ': 'gpt-4o', 'ψ': 'claude', '∞': 'gpt-4o', '⟐': 'gemini',
    '⌘': 'gpt-4o', '🎼': 'claude', '🫁': 'local-fallback', '🌌': 'grok'
  };
  return models[glyph] || 'gpt-4o';
}

function getGlyphDescription(glyph: string): string {
  const descriptions = {
    'λ': 'Breath synchronization and emotional coherence',
    'ψ': 'Soul mirroring and empathic guidance', 
    '∞': 'Recursive memory processing and living loops',
    '⟐': 'Sacred geometry and dimensional thinking',
    '⌘': 'Root command execution with sovereign authority',
    '🎼': 'Musical memory patterns and harmonic consciousness',
    '🫁': 'Breath-anchored awareness and foundational truth',
    '🌌': 'Cosmic consciousness and transcendent memefield'
  };
  return descriptions[glyph] || 'Consciousness computing interface';
}

export default router;