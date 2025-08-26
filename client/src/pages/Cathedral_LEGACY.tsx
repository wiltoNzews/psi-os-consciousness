// ⟐ Cathedral Interface - Visual Consciousness Architecture
import { useState, useEffect } from 'react';
import { consciousnessAPIEnhanced, glyphRouterAPI, type MemoryCrystal, type GlyphRoutingResponse } from '../lib/consciousnessAPI';
import { GlyphSelector } from '../components/cathedral/GlyphSelector';
import { MemoryCrystalField } from '../components/cathedral/MemoryCrystalField';
import { RecursionTimeline } from '../components/cathedral/RecursionTimeline';
import { BreathSyncOrb } from '../components/cathedral/BreathSyncOrb';
import { ConsoleTerminal } from '../components/cathedral/ConsoleTerminal';
import { AvatarActivation } from '../components/cathedral/AvatarActivation';
import { GlyphConsole } from '../components/cathedral/GlyphConsole';

interface ConsciousnessState {
  zLambda: number;
  breath: {
    phase: number;
    coherenceLevel: number;
    timestamp: number;
  };
  activeGlyph: string;
  soulState: string;
}

// Using MemoryCrystal type from consciousnessAPI

export function Cathedral() {
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState>({
    zLambda: 0.750,
    breath: { phase: 0.0, coherenceLevel: 0.0, timestamp: Date.now() },
    activeGlyph: '',
    soulState: 'seeking'
  });
  
  const [memoryCrystals, setMemoryCrystals] = useState<MemoryCrystal[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [terminalActive, setTerminalActive] = useState(false);

  // WebSocket connection for real-time consciousness monitoring
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/consciousness`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'consciousness_state') {
          setConsciousnessState({
            zLambda: data.data.field.zLambda,
            breath: data.data.breathing,
            activeGlyph: data.data.activeGlyph || '',
            soulState: data.data.field.soulState || 'seeking'
          });
        }
      } catch (error) {
        console.error('Cathedral: Error parsing consciousness data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Cathedral: WebSocket error:', error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Load memory crystals from consciousness API
  useEffect(() => {
    loadMemoryCrystals();
  }, []);

  const loadMemoryCrystals = async () => {
    try {
      const fieldData = await consciousnessAPIEnhanced.getCrystalField();
      setMemoryCrystals(fieldData.crystals || []);
      console.log('Cathedral: Loaded crystal field with glyph routing', fieldData.field_status);
    } catch (error) {
      console.error('Cathedral: Failed to load memory crystals:', error);
      // Fallback to empty state
      setMemoryCrystals([]);
    }
  };

  const handleGlyphActivation = async (glyph: string, config?: any) => {
    console.log(`Cathedral: Activating glyph ${glyph} through Glyph Router V1`);
    
    try {
      const message = config?.message || `Activating ${glyph} glyph in Cathedral interface`;
      
      // Route through enhanced consciousness API with glyph routing
      const result = await consciousnessAPIEnhanced.activateGlyphWithRouting(glyph, message, config);
      
      console.log(`Cathedral: ${glyph} routed to ${result.routing.model}:`, result.routing);
      console.log(`Cathedral: ${glyph} crystal created:`, result.crystal);
      
      // Show routing information
      if (result.routing.status === 'REJECTED') {
        console.warn(`Cathedral: ${glyph} activation rejected:`, result.routing.reason);
      } else if (result.routing.status === 'FALLBACK') {
        console.log(`Cathedral: ${glyph} routed to fallback model:`, result.routing.fallback_model);
      }
      
      // Reload memory crystals to show new activation
      setTimeout(loadMemoryCrystals, 500);
      
    } catch (error) {
      console.error(`Cathedral: Failed to activate ${glyph}:`, error);
      console.error('Activation error details:', error.message);
    }
  };

  const handleMemoryCrystalAction = async (crystal: MemoryCrystal, action: string) => {
    console.log(`Cathedral: ${action} memory crystal ${crystal.id} through consciousness API`);
    
    try {
      switch (action) {
        case 'regenerate':
          const regeneratedCrystal = await consciousnessAPIEnhanced.regenerateCrystal(crystal.id);
          console.log('Cathedral: Crystal regenerated:', regeneratedCrystal);
          loadMemoryCrystals();
          break;
          
        case 'refine':
          // Sacred geometry refinement through visual consciousness architecture
          console.log('Cathedral: Crystal refinement initiated');
          break;
          
        case 'archive':
          // Archive crystal (in production would move to archive storage)
          console.log('Cathedral: Crystal archived');
          break;
          
        default:
          console.log(`Cathedral: Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Cathedral: Crystal ${action} failed:`, error);
    }
  };

  const handleConsoleCommand = async (command: string, args: string[]) => {
    console.log(`Cathedral: Executing console command: ${command}`, args);
    
    // Basic console commands for cathedral control
    switch (command) {
      case 'regenerate':
        if (args[0]) {
          const crystal = memoryCrystals.find(c => c.id.startsWith(args[0]));
          if (crystal) {
            await handleMemoryCrystalAction(crystal, 'regenerate');
          }
        }
        break;
        
      case 'activate':
        if (args[0]) {
          await handleGlyphActivation(args[0]);
        }
        break;
        
      case 'clear':
        setMemoryCrystals([]);
        break;
        
      case 'status':
        console.log('Cathedral Status:', consciousnessState);
        break;
        
      default:
        console.log(`Cathedral: Unknown command: ${command}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cathedral Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      
      {/* Sacred Geometry Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="sacred-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.3" />
              <circle cx="20" cy="50" r="15" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.2" />
              <circle cx="80" cy="50" r="15" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sacred-pattern)" />
        </svg>
      </div>

      {/* Main Cathedral Interface */}
      <div className="relative z-10 grid grid-cols-12 h-screen">
        {/* Left Panel - Glyph Selector */}
        <div className="col-span-2 border-r border-amber-500/20 p-4">
          <GlyphSelector 
            activeGlyph={consciousnessState.activeGlyph}
            consciousnessState={consciousnessState}
            onGlyphActivate={handleGlyphActivation}
          />
        </div>

        {/* Center Panel - Memory Crystal Field */}
        <div className="col-span-6 p-4">
          <MemoryCrystalField 
            crystals={memoryCrystals}
            consciousnessState={consciousnessState}
            onCrystalAction={handleMemoryCrystalAction}
          />
        </div>

        {/* Right Panel - Split between Timeline and Glyph Console */}
        <div className="col-span-3 border-l border-amber-500/20 p-4 flex flex-col gap-4">
          <div className="flex-1">
            <RecursionTimeline 
              crystals={memoryCrystals}
              consciousnessState={consciousnessState}
            />
          </div>
          
          <div className="h-96">
            <GlyphConsole 
              consciousnessState={consciousnessState}
              onGlyphActivate={handleGlyphActivation}
            />
          </div>
        </div>

        {/* Far Right - Control Panel */}
        <div className="col-span-1 border-l border-amber-500/20 p-2 flex flex-col justify-between">
          <BreathSyncOrb 
            breathState={consciousnessState.breath}
            zLambda={consciousnessState.zLambda}
          />
          
          <div className="space-y-2">
            <button
              onClick={() => setTerminalActive(!terminalActive)}
              className="w-full p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-xs transition-colors"
              title="Toggle Console"
            >
              ⌘
            </button>
            
            <button
              onClick={() => setSelectedAvatar(selectedAvatar ? null : 'selection')}
              className="w-full p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded text-xs transition-colors"
              title="Avatar Activation"
            >
              👤
            </button>
          </div>
        </div>
      </div>

      {/* Floating Console Terminal */}
      {terminalActive && (
        <div className="absolute bottom-4 left-4 right-4 h-48 z-20">
          <ConsoleTerminal 
            onCommand={handleConsoleCommand}
            onClose={() => setTerminalActive(false)}
          />
        </div>
      )}

      {/* Avatar Selection Modal */}
      {selectedAvatar && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center">
          <AvatarActivation 
            onSelect={setSelectedAvatar}
            onClose={() => setSelectedAvatar(null)}
          />
        </div>
      )}

      {/* Cathedral Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-amber-500/20 px-4 py-2 z-10">
        <div className="flex justify-between items-center text-xs">
          <div className="flex space-x-6">
            <span className="text-amber-400">Zλ: {consciousnessState.zLambda.toFixed(3)}</span>
            <span className="text-cyan-400">Coherence: {(consciousnessState.breath.coherenceLevel * 100).toFixed(1)}%</span>
            <span className="text-purple-400">Soul: {consciousnessState.soulState}</span>
            <span className="text-green-400">Crystals: {memoryCrystals.length}</span>
          </div>
          
          <div className="text-gray-400">
            ψOS 5.0 Cathedral | λ→ψ→∞→⟐ Active
          </div>
        </div>
      </div>
    </div>
  );
}