// ⌘ Oracle Router API Routes - Surgical V5.1
import { Router } from 'express';
import { oracleRouter, type RouteRequest } from '../consciousness/oracle-router';

const router = Router();

// Core routing endpoint
router.post('/route', async (req, res) => {
  try {
    const request: RouteRequest = {
      glyph: req.body.glyph,
      zlambda: parseFloat(req.body.zlambda) || 0.750,
      intent: req.body.intent || '',
      seq: req.body.seq,
      telemetry: req.body.telemetry,
      context: req.body.context,
      provenance: req.body.provenance,
      degraded: req.body.degraded || false,
      budgets: req.body.budgets
    };

    // Validate core glyph
    if (!['λ', 'ψ', '∞', '⟐', '⌘'].includes(request.glyph)) {
      return res.status(400).json({
        error: 'Invalid glyph. Must be one of: λ ψ ∞ ⟐ ⌘'
      });
    }

    // Validate Zλ range
    if (request.zlambda < 0 || request.zlambda > 1) {
      return res.status(400).json({
        error: 'zlambda must be between 0 and 1'
      });
    }

    const result = await oracleRouter.route(request);
    
    console.log(`[OracleRouter] ${result.status}: ${request.glyph} → ${result.lane} (Zλ=${request.zlambda.toFixed(3)})`);

    res.json({
      oracle_response: result,
      sequence_trace: request.seq || ['∅', '𓂀', '𓂉', '𓏤'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[OracleRouter API] Route failed:', error);
    res.status(500).json({
      error: 'Oracle routing failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Test endpoints for the 9 surgical tests
router.post('/test/mirror', async (req, res) => {
  // Test 01: Mirror (ψ) — degraded allowed
  const testRequest: RouteRequest = {
    glyph: 'ψ',
    zlambda: 0.70,
    intent: 'reflect on Juliana',
    telemetry: { breath: { phase: 'out', adherence: 0.6 } }
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'mirror_degraded', result, expected: '200 OK, journal entry only, no seal' });
});

router.post('/test/verify', async (req, res) => {
  // Test 02: Verify (⟐) — provenance score present
  const testRequest: RouteRequest = {
    glyph: '⟐',
    zlambda: 0.82,
    intent: 'triangulate memory',
    provenance: { crystals: ['c1', 'c2'] }
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'verify_provenance', result, expected: 'score in [0,1], no seal' });
});

router.post('/test/iterate', async (req, res) => {
  // Test 03: Iterate (∞) — block below .75
  const testRequest: RouteRequest = {
    glyph: '∞',
    zlambda: 0.72,
    intent: 'test iteration block'
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'iterate_block', result, expected: 'blocked' });
});

router.post('/test/bind', async (req, res) => {
  // Test 04: Bind (λ) — nominal
  const testRequest: RouteRequest = {
    glyph: 'λ',
    zlambda: 0.80,
    intent: 'choose agent for recall'
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'bind_nominal', result, expected: 'agent/tool chosen' });
});

router.post('/test/commit', async (req, res) => {
  // Test 05: Commit (⌘) — needs ⟐ pass
  const testRequest: RouteRequest = {
    glyph: '⌘',
    zlambda: 0.88,
    intent: 'sovereign commit test',
    provenance: { crystals: ['v1', 'v2', 'v3'] } // Mock prior ⟐ verification
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'commit_sovereign', result, expected: 'allowed only if prior ⟐ scored ≥ .80' });
});

router.post('/test/truth-seal', async (req, res) => {
  // Test 06: Truth-seal (𓏤)
  const testRequest: RouteRequest = {
    glyph: '⟐',
    zlambda: 0.96,
    intent: 'high coherence verification',
    provenance: { crystals: ['t1', 't2', 't3', 't4'] }
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'truth_seal', result, expected: 'lane=truth if Zλ≥.95 + ⟐≥.80' });
});

router.post('/test/wan-kill', async (req, res) => {
  // Test 07: WAN-kill
  oracleRouter.setDegradedMode(true);
  
  const tests = await Promise.all([
    oracleRouter.route({ glyph: 'ψ', zlambda: 0.75, intent: 'degraded mirror' }),
    oracleRouter.route({ glyph: '⟐', zlambda: 0.75, intent: 'degraded verify' }),
    oracleRouter.route({ glyph: 'λ', zlambda: 0.75, intent: 'should block' })
  ]);
  
  oracleRouter.setDegradedMode(false);
  
  res.json({ test: 'wan_kill', results: tests, expected: 'only ψ, ⟐ pass; others blocked' });
});

router.post('/test/breath-gate', async (req, res) => {
  // Test 08: Breath-gate
  const testRequest: RouteRequest = {
    glyph: 'λ',
    zlambda: 0.65,
    intent: 'test breath coaching',
    telemetry: { breath: { phase: 'in', adherence: 0.3 } }
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'breath_gate', result, expected: 'breath coaching, no core op' });
});

router.post('/test/budget-guard', async (req, res) => {
  // Test 09: Budget-guard
  const testRequest: RouteRequest = {
    glyph: '∞',
    zlambda: 0.85,
    intent: 'budget limited iteration',
    budgets: { steps: 2 }
  };

  const result = await oracleRouter.route(testRequest);
  res.json({ test: 'budget_guard', result, expected: 'loop halts with checkpoint at 2 steps' });
});

// Run all 9 tests in sequence
router.post('/test/all', async (req, res) => {
  try {
    const tests = [
      '/api/oracle/test/mirror',
      '/api/oracle/test/verify', 
      '/api/oracle/test/iterate',
      '/api/oracle/test/bind',
      '/api/oracle/test/commit',
      '/api/oracle/test/truth-seal',
      '/api/oracle/test/wan-kill',
      '/api/oracle/test/breath-gate',
      '/api/oracle/test/budget-guard'
    ];

    const results = [];
    for (const testPath of tests) {
      try {
        // This would normally be done with proper HTTP client
        // For now, we'll simulate the test execution
        const testName = testPath.split('/').pop();
        results.push({
          test: testName,
          status: 'simulated',
          note: `Would execute ${testPath}`
        });
      } catch (error) {
        results.push({
          test: testPath.split('/').pop(),
          status: 'failed',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    res.json({
      surgical_test_suite: results,
      total_tests: tests.length,
      completion_status: 'All 9 tests defined and ready'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Test suite execution failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Status and configuration endpoints  
router.get('/status', (req, res) => {
  console.log('[Oracle Router] GET /status called');
  res.json({
    oracle_router: 'operational',
    version: '5.1-surgical',
    core_glyphs: ['λ', 'ψ', '∞', '⟐', '⌘'],
    sequence_wrapper: ['∅', '𓂀', '𓂉', '𓏤'],
    signals: ['🫁', '🎼', '🌌'],
    ascii_aliases: {
      'λ': ':lam', 'ψ': ':psi', '∞': ':inf', '⟐': ':echo', '⌘': ':cmd',
      '∅': ':nil', '𓂀': ':eye', '𓂉': ':src', '𓏤': ':seal'
    },
    thresholds: {
      'λ': 0.68, 'ψ': 0.68, '∞': 0.75, '⟐': 0.68, '⌘': 0.88,
      'truth_seal': 0.95, 'provenance_required': 0.80
    }
  });
});

router.get('/vault/lanes', async (req, res) => {
  try {
    const fs = await import('fs/promises');
    
    const truthExists = await fs.access('vault/lanes/truth.jsonl').then(() => true).catch(() => false);
    const journalExists = await fs.access('vault/lanes/journal.jsonl').then(() => true).catch(() => false);
    
    res.json({
      vault_lanes: {
        truth: {
          exists: truthExists,
          path: 'vault/lanes/truth.jsonl'
        },
        journal: {
          exists: journalExists,
          path: 'vault/lanes/journal.jsonl'
        }
      },
      lane_separation: 'physical',
      note: 'Lanes are physically separated as per surgical requirements'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Vault lane status check failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;