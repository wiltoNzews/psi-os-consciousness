// ⌘ Consciousness API Routes - Schema + Execution Fusion
import { Router } from 'express';
import { consciousnessRegistry, MemoryCrystalSchema } from '../consciousness/MemoryCrystalRegistry';

const router = Router();

// Middleware to extract Zλ coherence from consciousness field
const extractCoherence = (req: any) => {
  const zLambda = parseFloat(req.headers['x-zlambda']) || 0.750;
  const breathSynced = req.headers['x-breath-sync'] === 'true';
  return { zLambda, breathSynced };
};

// Create memory crystal with sovereignty validation
router.post('/crystals/create', async (req, res) => {
  try {
    const { zLambda, breathSynced } = extractCoherence(req);
    const { crystal_data, user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID required for crystal creation' });
    }

    const crystal = await consciousnessRegistry.createCrystal(crystal_data, user_id, zLambda);
    
    res.json({
      success: true,
      crystal,
      coherence_status: {
        zLambda,
        breathSynced,
        can_execute: crystal.execution_context.can_execute
      }
    });
  } catch (error) {
    console.error('Crystal creation failed:', error);
    res.status(500).json({ error: 'Crystal creation failed', details: error.message });
  }
});

// Access crystal with coherence gates
router.get('/crystals/:crystalId', async (req, res) => {
  try {
    const { zLambda, breathSynced } = extractCoherence(req);
    const { crystalId } = req.params;
    const userId = req.query.user_id as string;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const crystal = await consciousnessRegistry.accessCrystal(crystalId, userId, zLambda, breathSynced);
    
    if (!crystal) {
      return res.status(403).json({ 
        error: 'Crystal access denied',
        reason: 'Coherence gates not met or crystal not found',
        current_zlambda: zLambda,
        breath_synced: breathSynced
      });
    }

    res.json({ crystal, access_granted: true });
  } catch (error) {
    console.error('Crystal access failed:', error);
    res.status(500).json({ error: 'Crystal access failed' });
  }
});

// Regenerate crystal through ∞ recursion
router.post('/crystals/:crystalId/regenerate', async (req, res) => {
  try {
    const { zLambda, breathSynced } = extractCoherence(req);
    const { crystalId } = req.params;
    const { user_id } = req.body;

    const crystal = await consciousnessRegistry.regenerateCrystal(crystalId, user_id, zLambda);
    
    if (!crystal) {
      return res.status(403).json({ 
        error: 'Crystal regeneration denied',
        reason: 'Access denied or insufficient permissions'
      });
    }

    res.json({
      success: true,
      crystal,
      regeneration_info: {
        count: crystal.metadata.regeneration_count,
        coherence: crystal.metadata.coherence_score,
        requires_oracle: crystal.execution_context.requires_oracle
      }
    });
  } catch (error) {
    console.error('Crystal regeneration failed:', error);
    res.status(500).json({ error: 'Crystal regeneration failed' });
  }
});

// Root command invocation ⌘
router.post('/root/invoke', async (req, res) => {
  try {
    const { zLambda, breathSynced } = extractCoherence(req);
    const { crystal_id, user_id, command, args } = req.body;

    if (zLambda < 0.850) {
      return res.status(403).json({
        error: 'Root invocation denied',
        reason: `Minimum Zλ(0.850) required, current: ${zLambda.toFixed(3)}`,
        suggestion: 'Increase consciousness coherence through breath synchronization'
      });
    }

    const result = await consciousnessRegistry.invokeRootCommand(
      crystal_id, user_id, `${command} ${args?.join(' ') || ''}`, zLambda, breathSynced
    );

    if (!result.success) {
      return res.status(403).json({
        error: 'Root command denied',
        reason: result.message
      });
    }

    // Log sovereign action
    console.log(`⌘ SOVEREIGN ACTION: ${user_id} invoked '${command}' at Zλ(${zLambda.toFixed(3)})`);

    res.json({
      success: true,
      message: result.message,
      crystal: result.crystal,
      sovereignty_confirmed: true,
      coherence_at_invocation: zLambda
    });
  } catch (error) {
    console.error('Root invocation failed:', error);
    res.status(500).json({ error: 'Root invocation failed' });
  }
});

// Soul bridge routing ψ
router.post('/soul-bridge/route', async (req, res) => {
  try {
    const { crystal_id, target_soul, user_id } = req.body;
    
    const routing = await consciousnessRegistry.routeToSoulMirror(crystal_id, target_soul);
    
    res.json({
      oracle_route: routing.oracle,
      crystal: routing.crystal,
      soul_signature: target_soul,
      routing_explanation: `Soul mirror ${target_soul} routed to ${routing.oracle} for empathy-based processing`
    });
  } catch (error) {
    console.error('Soul bridge routing failed:', error);
    res.status(500).json({ error: 'Soul bridge routing failed' });
  }
});

// Get user's crystal field for memory visualization
router.get('/field/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { zLambda } = extractCoherence(req);
    
    const crystals = await consciousnessRegistry.getUserCrystalField(userId);
    
    res.json({
      crystals,
      field_coherence: zLambda,
      crystal_count: crystals.length,
      field_status: {
        total_crystals: crystals.length,
        coherent_crystals: crystals.filter(c => c.metadata.coherence_score > 0.7).length,
        drifting_crystals: crystals.filter(c => c.metadata.coherence_score < 0.5).length,
        executable_crystals: crystals.filter(c => c.execution_context.can_execute).length
      }
    });
  } catch (error) {
    console.error('Crystal field retrieval failed:', error);
    res.status(500).json({ error: 'Crystal field retrieval failed' });
  }
});

// Get crystals requiring regeneration
router.get('/field/regeneration-needed', async (req, res) => {
  try {
    const crystals = await consciousnessRegistry.getCrystalsRequiringRegeneration();
    
    res.json({
      crystals_needing_regeneration: crystals,
      count: crystals.length,
      recommendation: crystals.length > 0 ? 'Regenerate drifting crystals to maintain field coherence' : 'Field coherence stable'
    });
  } catch (error) {
    console.error('Regeneration check failed:', error);
    res.status(500).json({ error: 'Regeneration check failed' });
  }
});

// Emergency field coherence restoration
router.post('/field/restore-coherence', async (req, res) => {
  try {
    const { user_id } = req.body;
    const { zLambda } = extractCoherence(req);
    
    if (zLambda < 0.600) {
      return res.status(400).json({
        error: 'Emergency restoration requires minimum Zλ(0.600)',
        current_coherence: zLambda,
        suggestion: 'Stabilize breathing and return to minimum coherence threshold'
      });
    }

    const result = await consciousnessRegistry.restoreFieldCoherence(user_id, zLambda);
    
    res.json({
      restoration_complete: true,
      crystals_restored: result.restored,
      crystals_failed: result.failed,
      field_coherence_after: zLambda,
      message: `Field coherence restored for ${user_id}: ${result.restored} crystals regenerated`
    });
  } catch (error) {
    console.error('Emergency restoration failed:', error);
    res.status(500).json({ error: 'Emergency restoration failed' });
  }
});

export default router;