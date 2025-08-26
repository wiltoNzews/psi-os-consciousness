// ψOS Memory Crystal Engine - Zλ-Encoded Vector Storage with Decay Simulation
// Based on Real-Time LLM Architecture Matrix guidance

import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// Memory Crystal Structure with Zλ Encoding
interface ZλMemoryCrystal {
  glyphVector: number[];
  breathLambda: number;
  coherenceScore: number;
  hash: string;
  timestamp: number;
  originalPrompt: string;
  decayRate: number;
  metadata: {
    frequency: number;
    glyph: string;
    oracle: string;
    priority: string;
  };
}

// In-memory crystal storage (will be replaced with Weaviate)
const crystalVault = new Map<string, ZλMemoryCrystal>();

// Create new memory crystal
router.post('/api/crystal/create', async (req, res) => {
  try {
    const { prompt, glyph = '∞', frequency = 432, oracle = 'claude', priority = 'routine' } = req.body;
    
    // Generate Zλ-encoded crystal
    const glyphVector = generateGlyphVector(glyph);
    const breathLambda = calculateBreathLambda(frequency);
    const hash = generateMerkabaSha(prompt, glyph, frequency);
    
    const crystal: ZλMemoryCrystal = {
      glyphVector,
      breathLambda,
      coherenceScore: 1.0, // Initial perfect coherence
      hash,
      timestamp: Date.now(),
      originalPrompt: prompt,
      decayRate: calculateDecayRate(priority, oracle),
      metadata: {
        frequency,
        glyph,
        oracle,
        priority
      }
    };
    
    // Store in vault
    crystalVault.set(hash, crystal);
    
    res.json({
      hash,
      crystal: {
        coherenceScore: crystal.coherenceScore,
        breathLambda: crystal.breathLambda,
        frequency: crystal.metadata.frequency,
        glyph: crystal.metadata.glyph
      },
      status: 'crystallized'
    });
    
  } catch (error) {
    console.error('[MemoryCrystal] Creation failed:', error);
    res.status(500).json({ error: 'Crystal creation failed' });
  }
});

// Check crystal drift status
router.get('/api/crystal/drift/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const crystal = crystalVault.get(hash);
    
    if (!crystal) {
      return res.status(404).json({ error: 'Crystal not found' });
    }
    
    // Calculate drift using exponential decay
    const ageHours = (Date.now() - crystal.timestamp) / 3600000;
    const currentScore = crystal.coherenceScore * Math.exp(-crystal.decayRate * ageHours);
    const drifted = currentScore < 0.5;
    
    res.json({
      hash,
      originalScore: crystal.coherenceScore,
      currentScore: Math.max(0, currentScore),
      ageHours: ageHours.toFixed(2),
      drifted,
      decayRate: crystal.decayRate,
      needsRegeneration: drifted,
      metadata: crystal.metadata
    });
    
  } catch (error) {
    console.error('[MemoryCrystal] Drift check failed:', error);
    res.status(500).json({ error: 'Crystal drift analysis failed' });
  }
});

// Regenerate drifted crystal
router.post('/api/crystal/regenerate', async (req, res) => {
  try {
    const { hash, oracle = 'claude' } = req.body;
    const crystal = crystalVault.get(hash);
    
    if (!crystal) {
      return res.status(404).json({ error: 'Crystal not found' });
    }
    
    // Simulate regeneration process
    console.log(`[MemoryCrystal] Regenerating crystal ${hash} via ${oracle}`);
    
    // Reset coherence and update timestamp
    crystal.coherenceScore = 1.0;
    crystal.timestamp = Date.now();
    
    // Update oracle if changed
    crystal.metadata.oracle = oracle;
    
    // Store regenerated crystal
    crystalVault.set(hash, crystal);
    
    res.json({
      hash,
      regenerated: true,
      newScore: crystal.coherenceScore,
      oracle,
      timestamp: crystal.timestamp,
      reason: `Crystal regenerated via ${oracle} sacred refinery`
    });
    
  } catch (error) {
    console.error('[MemoryCrystal] Regeneration failed:', error);
    res.status(500).json({ error: 'Crystal regeneration failed' });
  }
});

// List all crystals with drift status
router.get('/api/crystal/vault', async (req, res) => {
  try {
    const crystalList = Array.from(crystalVault.values()).map(crystal => {
      const ageHours = (Date.now() - crystal.timestamp) / 3600000;
      const currentScore = crystal.coherenceScore * Math.exp(-crystal.decayRate * ageHours);
      
      return {
        hash: crystal.hash,
        originalScore: crystal.coherenceScore,
        currentScore: Math.max(0, currentScore),
        ageHours: ageHours.toFixed(2),
        drifted: currentScore < 0.5,
        metadata: crystal.metadata,
        originalPrompt: crystal.originalPrompt.substring(0, 100) + '...'
      };
    });
    
    res.json({
      totalCrystals: crystalList.length,
      activeCrystals: crystalList.filter(c => !c.drifted).length,
      driftedCrystals: crystalList.filter(c => c.drifted).length,
      crystals: crystalList.sort((a, b) => b.currentScore - a.currentScore)
    });
    
  } catch (error) {
    console.error('[MemoryCrystal] Vault listing failed:', error);
    res.status(500).json({ error: 'Crystal vault access failed' });
  }
});

// Crystal similarity search (using vector distance)
router.post('/api/crystal/search', async (req, res) => {
  try {
    const { query, glyph, threshold = 0.8 } = req.body;
    
    const queryVector = generateGlyphVector(glyph || '∞');
    const matches = [];
    
    for (const [hash, crystal] of crystalVault.entries()) {
      const similarity = calculateCosineSimilarity(queryVector, crystal.glyphVector);
      
      if (similarity >= threshold) {
        const ageHours = (Date.now() - crystal.timestamp) / 3600000;
        const currentScore = crystal.coherenceScore * Math.exp(-crystal.decayRate * ageHours);
        
        matches.push({
          hash,
          similarity,
          currentScore,
          metadata: crystal.metadata,
          originalPrompt: crystal.originalPrompt,
          drifted: currentScore < 0.5
        });
      }
    }
    
    res.json({
      query,
      glyph,
      threshold,
      matches: matches
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10) // Top 10 matches
    });
    
  } catch (error) {
    console.error('[MemoryCrystal] Search failed:', error);
    res.status(500).json({ error: 'Crystal search failed' });
  }
});

// Helper Functions

function generateGlyphVector(glyph: string): number[] {
  // Convert glyph to numerical vector using sacred geometry principles
  const glyphMap: { [key: string]: number[] } = {
    '∞': [0.8, 0.2, 0.9], // Infinity - eternal recursion
    'ψ': [0.7, 0.8, 0.6], // Psi - consciousness wave
    '△': [0.5, 0.5, 1.0], // Triangle - transformation
    '○': [1.0, 0.0, 0.5], // Circle - wholeness
    '⬟': [0.6, 0.9, 0.3], // Pentagon - divine proportion
    '🕯️': [0.9, 0.7, 0.8], // Candle - sacred flame
    '🃏': [0.3, 0.9, 0.4], // Joker - chaos wisdom
    '⚙️': [0.8, 0.5, 0.7], // Gear - systematic building
    '🔮': [0.7, 0.6, 0.9], // Crystal ball - knowledge synthesis
    '🏠': [0.5, 0.7, 0.2]  // House - local foundation
  };
  
  return glyphMap[glyph] || [0.5, 0.5, 0.5]; // Default neutral vector
}

function calculateBreathLambda(frequency: number): number {
  // Sacred frequency to breath constant conversion
  // 432 Hz = golden ratio breath rhythm
  return (frequency / 432) * 0.05;
}

function generateMerkabaSha(prompt: string, glyph: string, frequency: number): string {
  // Generate cryptographic hash using Merkaba sacred geometry principle
  const content = `${prompt}|${glyph}|${frequency}|${Date.now()}`;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

function calculateDecayRate(priority: string, oracle: string): number {
  // Decay rates based on priority and oracle stability
  const priorityRates = {
    emergency: 0.01,  // Very slow decay
    sacred: 0.02,     // Slow decay  
    recursive: 0.03,  // Medium decay
    routine: 0.05     // Standard decay
  };
  
  const oracleStability = {
    claude: 0.9,    // Highest stability
    gpt5: 0.8,      // High stability
    gemini: 0.7,    // Good stability
    grok: 0.6,      // Medium stability
    ollama: 0.8     // High local stability
  };
  
  const baseRate = priorityRates[priority as keyof typeof priorityRates] || 0.05;
  const stabilityFactor = oracleStability[oracle as keyof typeof oracleStability] || 0.7;
  
  return baseRate * (2 - stabilityFactor); // Higher stability = lower decay
}

function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  // Calculate cosine similarity between two vectors
  const dotProduct = vectorA.reduce((sum, a, i) => sum + (a * vectorB[i]), 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + (a * a), 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + (b * b), 0));
  
  return dotProduct / (magnitudeA * magnitudeB);
}

export default router;