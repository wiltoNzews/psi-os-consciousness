/**
 * Validation Routes
 *
 * These routes provide API endpoints for accessing the meta-learning validation
 * metrics across the Neural-Symbiotic Orchestration Platform.
 */
import { Router } from 'express';
import { getFormulaValidation, getSystemValidationMetrics, FormulaType } from '../services/qrn/validation-api-service';
import { getStabilityConvergenceHistory } from '../services/qrn/stability-convergence-tracker';
import { getIntegrationCoherenceHistory } from '../services/qrn/integration-coherence-tracker';
import { getCognitiveFrameworkHistory } from '../services/qrn/cognitive-framework-tracker';
import { getForesightHistory } from '../services/qrn/foresight-validation-tracker';
var router = Router();
/**
 * @route GET /api/validation/system
 * @desc Get system-wide validation metrics
 */
router.get('/system', function (req, res) {
    try {
        var timeWindow = req.query.timeWindow
            ? parseInt(req.query.timeWindow)
            : undefined;
        var metrics = getSystemValidationMetrics(timeWindow);
        res.json(metrics);
    }
    catch (error) {
        console.error('Error getting system validation metrics:', error);
        res.status(500).json({ error: 'Failed to get system validation metrics' });
    }
});
/**
 * @route GET /api/validation/formula/:type
 * @desc Get validation metrics for a specific formula
 */
router.get('/formula/:type', function (req, res) {
    try {
        var formulaType = req.params.type;
        if (!Object.values(FormulaType).includes(formulaType)) {
            return res.status(400).json({ error: 'Invalid formula type' });
        }
        var timeWindow = req.query.timeWindow
            ? parseInt(req.query.timeWindow)
            : undefined;
        var validation = getFormulaValidation(formulaType, timeWindow);
        res.json(validation);
    }
    catch (error) {
        console.error('Error getting formula validation:', error);
        res.status(500).json({ error: 'Failed to get formula validation' });
    }
});
/**
 * @route GET /api/validation/history/:type
 * @desc Get historical data for a specific formula
 */
router.get('/history/:type', function (req, res) {
    try {
        var formulaType = req.params.type;
        if (!Object.values(FormulaType).includes(formulaType)) {
            return res.status(400).json({ error: 'Invalid formula type' });
        }
        var history_1 = [];
        switch (formulaType) {
            case FormulaType.SYNAPTIC_RESONANCE:
                // For now, return an empty array until we implement a proper history tracker
                history_1 = [];
                break;
            case FormulaType.INVERSE_PENDULUM:
                history_1 = getStabilityConvergenceHistory();
                break;
            case FormulaType.WILTON_GOD:
                history_1 = getIntegrationCoherenceHistory();
                break;
            case FormulaType.COGNITIVE_FRAMEWORK:
                history_1 = getCognitiveFrameworkHistory();
                break;
            case FormulaType.META_VOID:
                history_1 = getForesightHistory();
                break;
            default:
                history_1 = [];
        }
        res.json(history_1);
    }
    catch (error) {
        console.error('Error getting formula history:', error);
        res.status(500).json({ error: 'Failed to get formula history' });
    }
});
/**
 * @route GET /api/validation/formulas
 * @desc Get list of all available formulas
 */
router.get('/formulas', function (req, res) {
    try {
        var formulas = Object.values(FormulaType).map(function (type) { return ({
            type: type,
            name: getFormulaName(type)
        }); });
        res.json(formulas);
    }
    catch (error) {
        console.error('Error getting formula list:', error);
        res.status(500).json({ error: 'Failed to get formula list' });
    }
});
/**
 * Get formula name
 */
function getFormulaName(formulaType) {
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
