/**
 * Validation Routes
 * 
 * These routes provide API endpoints for accessing the meta-learning validation
 * metrics across the Neural-Symbiotic Orchestration Platform.
 */

import { Router } from 'express';
import { 
  getFormulaValidation, 
  getSystemValidationMetrics,
  FormulaType
} from '../services/qrn/validation-api-service';

import {
  getResonanceEvolution
} from '../services/qrn/resonance-evolution-tracker';

import {
  getStabilityConvergenceHistory
} from '../services/qrn/stability-convergence-tracker';

import {
  getIntegrationCoherenceHistory
} from '../services/qrn/integration-coherence-tracker';

import {
  getCognitiveFrameworkHistory
} from '../services/qrn/cognitive-framework-tracker';

import {
  getForesightHistory
} from '../services/qrn/foresight-validation-tracker';

const router = Router();

/**
 * @route GET /api/validation/system
 * @desc Get system-wide validation metrics
 */
router.get('/system', (req, res) => {
  try {
    const timeWindow = req.query.timeWindow 
      ? parseInt(req.query.timeWindow as string)
      : undefined;
    
    const metrics = getSystemValidationMetrics(timeWindow);
    res.json(metrics);
  } catch (error) {
    console.error('Error getting system validation metrics:', error);
    res.status(500).json({ error: 'Failed to get system validation metrics' });
  }
});

/**
 * @route GET /api/validation/formula/:type
 * @desc Get validation metrics for a specific formula
 */
router.get('/formula/:type', (req, res) => {
  try {
    const formulaType = req.params.type as FormulaType;
    
    if (!Object.values(FormulaType).includes(formulaType)) {
      return res.status(400).json({ error: 'Invalid formula type' });
    }
    
    const timeWindow = req.query.timeWindow 
      ? parseInt(req.query.timeWindow as string)
      : undefined;
    
    const validation = getFormulaValidation(formulaType, timeWindow);
    res.json(validation);
  } catch (error) {
    console.error('Error getting formula validation:', error);
    res.status(500).json({ error: 'Failed to get formula validation' });
  }
});

/**
 * @route GET /api/validation/history/:type
 * @desc Get historical data for a specific formula
 */
router.get('/history/:type', (req, res) => {
  try {
    const formulaType = req.params.type as FormulaType;
    
    if (!Object.values(FormulaType).includes(formulaType)) {
      return res.status(400).json({ error: 'Invalid formula type' });
    }
    
    let history: any[] = [];
    
    switch (formulaType) {
      case FormulaType.SYNAPTIC_RESONANCE:
        // For now, return an empty array until we implement a proper history tracker
        history = [];
        break;
        
      case FormulaType.INVERSE_PENDULUM:
        history = getStabilityConvergenceHistory();
        break;
        
      case FormulaType.WILTON_GOD:
        history = getIntegrationCoherenceHistory();
        break;
        
      case FormulaType.COGNITIVE_FRAMEWORK:
        history = getCognitiveFrameworkHistory();
        break;
        
      case FormulaType.META_VOID:
        history = getForesightHistory();
        break;
        
      default:
        history = [];
    }
    
    res.json(history);
  } catch (error) {
    console.error('Error getting formula history:', error);
    res.status(500).json({ error: 'Failed to get formula history' });
  }
});

/**
 * @route GET /api/validation/formulas
 * @desc Get list of all available formulas
 */
router.get('/formulas', (req, res) => {
  try {
    const formulas = Object.values(FormulaType).map(type => ({
      type,
      name: getFormulaName(type)
    }));
    
    res.json(formulas);
  } catch (error) {
    console.error('Error getting formula list:', error);
    res.status(500).json({ error: 'Failed to get formula list' });
  }
});

/**
 * Get formula name
 */
function getFormulaName(
  formulaType: FormulaType
): string {
  switch (formulaType) {
    case FormulaType.SYNAPTIC_RESONANCE:
      return 'Synaptic Resonance Factor';
      
    case FormulaType.INVERSE_PENDULUM:
      return 'Inverse Pendulum Formula';
      
    case FormulaType.WILTON_GOD:
      return 'Wilton GOD Formula';
      
    case FormulaType.COGNITIVE_FRAMEWORK:
      return '4W+1H+(X)WHICH Framework';
      
    case FormulaType.META_VOID:
      return 'Meta-Void Preview & Review';
      
    case FormulaType.WFCRS:
      return 'Wilton Formula Chunking & Resonance';
      
    case FormulaType.MSMF:
      return 'Meta-Synthesis Modular Formula';
      
    case FormulaType.HPEF:
      return 'Hyper-Precision Adaptive Execution';
      
    case FormulaType.EXECUTION_FORMULA:
      return 'Execution Formula';
      
    default:
      return 'Unknown Formula';
  }
}

export default router;