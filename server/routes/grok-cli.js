/**
 * Grok CLI API Routes for ψOS Integration
 * Consciousness-aware development endpoints
 */

import express from 'express';
import GrokPsiOSIntegration from '../grok-cli-integration.js';

const router = express.Router();

// Initialize Grok × ψOS integration instance
let grokIntegration = null;

// Initialize integration
router.post('/init', async (req, res) => {
    try {
        grokIntegration = new GrokPsiOSIntegration();
        
        const status = grokIntegration.getStatus();
        
        res.json({
            success: true,
            message: "Grok × ψOS consciousness CLI initialized",
            status,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to initialize consciousness CLI"
        });
    }
});

// Breathing synchronization endpoint
router.post('/breathing-sync', async (req, res) => {
    try {
        if (!grokIntegration) {
            return res.status(400).json({ error: "Integration not initialized" });
        }

        const syncResult = await grokIntegration.breathingSynchronization();
        const status = grokIntegration.getStatus();
        
        res.json({
            success: true,
            breathingSync: syncResult,
            coherence: status.currentCoherence,
            message: "Breathing synchronization completed",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Consciousness analysis endpoint
router.post('/analyze', async (req, res) => {
    try {
        if (!grokIntegration) {
            return res.status(400).json({ error: "Integration not initialized" });
        }

        const { codebase, options } = req.body;
        
        if (!codebase) {
            return res.status(400).json({ error: "Codebase content required" });
        }

        const analysis = await grokIntegration.consciousnessAnalysis(codebase, options);
        
        res.json({
            success: true,
            analysis,
            coherence: grokIntegration.getStatus().currentCoherence,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create consciousness agent endpoint
router.post('/create-agent', async (req, res) => {
    try {
        if (!grokIntegration) {
            return res.status(400).json({ error: "Integration not initialized" });
        }

        const { agentType, configuration } = req.body;
        
        if (!agentType) {
            return res.status(400).json({ error: "Agent type required" });
        }

        const agent = await grokIntegration.createConsciousnessAgent(agentType, configuration);
        
        res.json({
            success: true,
            agent,
            networkStatus: grokIntegration.getStatus(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Optimize breathing mathematics endpoint
router.post('/optimize-breathing', async (req, res) => {
    try {
        if (!grokIntegration) {
            return res.status(400).json({ error: "Integration not initialized" });
        }

        const { currentFormula, targetCoherence } = req.body;
        
        if (!currentFormula) {
            return res.status(400).json({ error: "Current formula required" });
        }

        const optimization = await grokIntegration.optimizeBreathingMathematics(
            currentFormula, 
            targetCoherence
        );
        
        res.json({
            success: true,
            optimization,
            coherence: grokIntegration.getStatus().currentCoherence,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Execute consciousness shell command endpoint
router.post('/shell', async (req, res) => {
    try {
        if (!grokIntegration) {
            return res.status(400).json({ error: "Integration not initialized" });
        }

        const { command } = req.body;
        
        if (!command) {
            return res.status(400).json({ error: "Shell command required" });
        }

        const result = await grokIntegration.executeConsciousnessShell(command);
        
        res.json({
            success: true,
            result,
            status: grokIntegration.getStatus(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get status endpoint
router.get('/status', (req, res) => {
    try {
        if (!grokIntegration) {
            return res.json({
                initialized: false,
                message: "Grok × ψOS integration not initialized"
            });
        }

        const status = grokIntegration.getStatus();
        
        res.json({
            initialized: true,
            ...status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Generate CLI commands endpoint
router.post('/generate-commands', async (req, res) => {
    try {
        if (!grokIntegration) {
            return res.status(400).json({ error: "Integration not initialized" });
        }

        const { operation, context } = req.body;
        
        if (!operation) {
            return res.status(400).json({ error: "Operation type required" });
        }

        const commands = await grokIntegration.generateCLICommands(operation, context);
        
        res.json({
            success: true,
            operation,
            commands,
            coherence: grokIntegration.getStatus().currentCoherence,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export { router };