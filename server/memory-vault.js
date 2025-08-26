/**
 * WiltonOS Memory Vault - Echo Shell Memory Persistence
 * Implements authentic memory bridging across Browser ↔ Replit ↔ Local
 */

const fs = require('fs').promises;
const path = require('path');

class MemoryVault {
  constructor() {
    this.vaultPath = path.join(__dirname, '../memory-vault');
    this.shellPath = path.join(this.vaultPath, 'shells');
    this.codexPath = path.join(this.vaultPath, 'codex');
    this.bridgePath = path.join(this.vaultPath, 'bridge-sync');
    
    this.initializeVault();
  }

  async initializeVault() {
    try {
      await fs.mkdir(this.vaultPath, { recursive: true });
      await fs.mkdir(this.shellPath, { recursive: true });
      await fs.mkdir(this.codexPath, { recursive: true });
      await fs.mkdir(this.bridgePath, { recursive: true });
      
      console.log('[Memory Vault] Echo shell storage initialized');
    } catch (error) {
      console.error('[Memory Vault] Initialization error:', error);
    }
  }

  // Generate πτ phase-coded filename
  generatePhaseFilename(threadName, coherenceLevel) {
    const piTau = 3.1446; // πτ = 4/φ breath-seeded resonance constant
    const phi = 1.618;
    const timestamp = Date.now();
    const phaseCode = `πτ_${piTau}_φ_${coherenceLevel || 0.750}`;
    const sanitized = threadName.replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${phaseCode}_${sanitized}_${timestamp}.json`;
  }

  // Create coherence snapshot
  async createCoherenceSnapshot(sessionData) {
    try {
      const {
        threadName,
        coherenceLevel,
        contextSignature,
        echoNotes,
        codexTags,
        phaseMemory,
        visualAnchors,
        breathLoops
      } = sessionData;

      const snapshot = {
        metadata: {
          threadName: threadName || 'Echo_Shell_Session',
          coherenceLevel: coherenceLevel || 0.750,
          timestamp: Date.now(),
          phaseCode: `πτ_3.1446_φ_${coherenceLevel || 0.750}`,
          contextSignature: contextSignature || ''
        },
        memory: {
          echoNotes: echoNotes || [],
          codexTags: codexTags || [],
          phaseMemory: phaseMemory || { C1: '', T2: '', Q1: '', F1: '' },
          visualAnchors: visualAnchors || [],
          breathLoops: breathLoops || []
        },
        bridge: {
          browserSync: true,
          replitSync: true,
          localSync: false,
          lastSync: Date.now()
        },
        recursion: {
          shellDepth: 1,
          echoIntensity: coherenceLevel || 0.750,
          narrativeLoop: 'active',
          fractalOntology: 'engaged'
        }
      };

      const filename = this.generatePhaseFilename(threadName, coherenceLevel);
      const filepath = path.join(this.shellPath, filename);
      
      await fs.writeFile(filepath, JSON.stringify(snapshot, null, 2));
      
      console.log('[Memory Vault] Coherence snapshot created:', filename);
      
      return {
        success: true,
        filename: filename,
        snapshot: snapshot,
        path: filepath
      };
      
    } catch (error) {
      console.error('[Memory Vault] Snapshot creation error:', error);
      throw error;
    }
  }

  // Load echo shell memory
  async loadEchoShell(filename) {
    try {
      const filepath = path.join(this.shellPath, filename);
      const data = await fs.readFile(filepath, 'utf8');
      const shell = JSON.parse(data);
      
      console.log('[Memory Vault] Echo shell loaded:', shell.metadata.threadName);
      
      return shell;
    } catch (error) {
      console.error('[Memory Vault] Echo shell load error:', error);
      throw error;
    }
  }

  // Search memory shells by codex tags
  async searchByCodexTags(tags, threshold = 0.8) {
    try {
      const files = await fs.readdir(this.shellPath);
      const results = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const shell = await this.loadEchoShell(file);
          const shellTags = shell.memory.codexTags || [];
          
          // Check tag overlap
          const overlap = tags.filter(tag => 
            shellTags.some(shellTag => 
              shellTag.toLowerCase().includes(tag.toLowerCase())
            )
          );
          
          const similarity = overlap.length / tags.length;
          
          if (similarity >= threshold) {
            results.push({
              filename: file,
              shell: shell,
              similarity: similarity,
              matchedTags: overlap
            });
          }
        }
      }
      
      return results.sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      console.error('[Memory Vault] Search error:', error);
      return [];
    }
  }

  // Export to bridge sync (for local AI training)
  async exportToBridgeSync(shells) {
    try {
      const exportData = {
        exportTimestamp: Date.now(),
        shellCount: shells.length,
        totalCoherence: shells.reduce((sum, shell) => sum + shell.metadata.coherenceLevel, 0),
        avgCoherence: shells.reduce((sum, shell) => sum + shell.metadata.coherenceLevel, 0) / shells.length,
        shells: shells.map(shell => ({
          metadata: shell.metadata,
          memory: shell.memory,
          recursion: shell.recursion
        }))
      };
      
      const filename = `bridge_sync_${Date.now()}.json`;
      const filepath = path.join(this.bridgePath, filename);
      
      await fs.writeFile(filepath, JSON.stringify(exportData, null, 2));
      
      console.log('[Memory Vault] Bridge sync export created:', filename);
      
      return {
        success: true,
        filename: filename,
        exportData: exportData
      };
    } catch (error) {
      console.error('[Memory Vault] Bridge sync export error:', error);
      throw error;
    }
  }

  // Get memory vault status
  async getVaultStatus() {
    try {
      const shellFiles = await fs.readdir(this.shellPath);
      const codexFiles = await fs.readdir(this.codexPath);
      const bridgeFiles = await fs.readdir(this.bridgePath);
      
      const shells = shellFiles.filter(f => f.endsWith('.json'));
      let totalCoherence = 0;
      let shellCount = 0;
      
      for (const file of shells) {
        try {
          const shell = await this.loadEchoShell(file);
          totalCoherence += shell.metadata.coherenceLevel || 0;
          shellCount++;
        } catch (e) {
          // Skip corrupted files
        }
      }
      
      return {
        shellCount: shellCount,
        codexCount: codexFiles.length,
        bridgeCount: bridgeFiles.length,
        avgCoherence: shellCount > 0 ? totalCoherence / shellCount : 0,
        totalCoherence: totalCoherence,
        lastActivity: Date.now(),
        vaultHealth: 'operational'
      };
    } catch (error) {
      console.error('[Memory Vault] Status error:', error);
      return { error: 'Failed to get vault status' };
    }
  }
}

module.exports = MemoryVault;