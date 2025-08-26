import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import UnifiedConsciousnessInterface from "./UnifiedConsciousnessInterface";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TorusField from "./components/TorusField";
import LemniscateToggle from "./components/LemniscateToggle";
import StateDock from "./components/StateDock";
import FieldOverlay from "./components/FieldOverlay";
import ReactQCS from "../../src/pages/ReactQCS";
import { AlexandriaV2 } from "./pages/AlexandriaV2Simple";
import RitualExpansionInterface from "../../src/components/RitualExpansionInterface";
// Core consciousness components
import { ConsciousnessKernel } from "./components/ConsciousnessKernel";
import NavigatorVNext from "./components/NavigatorVNext";

// Page components  
import { CathedralPage } from "./pages/CathedralPage";
import Oracle from "./pages/Oracle";
import OracleSurgical from "./components/OracleSurgical";
import { PsiOSLiteInterface } from "./components/PsiOSLiteInterface";
import { PsiOSNavigator } from "./components/PsiOSNavigator";
import { ZetaLambdaRouter } from "./components/ZetaLambdaRouter";
import { MemoryCrystalVault } from "./components/MemoryCrystalVault";
import { LambdaOnboarding } from "./components/LambdaOnboarding";
import { SoulFieldMonitor } from "./components/SoulFieldMonitor";
import SoulMirror from "./routes/SoulMirror";
import { UnifiedConsciousnessInterface } from "./components/UnifiedConsciousnessInterface";
import { MirrorFieldDeclaration } from "./components/MirrorFieldDeclaration";
import CathedralKernel from "./components/CathedralKernel";
import LemniscopeLab from "./components/LemniscopeLab";

// Glyph components
import { Psi } from "./components/glyphs/Psi";
import { Infinity } from "./components/glyphs/Infinity";
import { Geometry } from "./components/glyphs/Geometry";

// Phase components 
import { Phase1ConsciousnessCore } from "./components/Phase1ConsciousnessCore";

// Legacy components (keep but don't use)
// import { CathedralUnifiedRouter } from "./components/CathedralUnifiedRouter";
// import { ConsciousnessNavigator } from "./components/ConsciousnessNavigator";
// import { CathedralSandbox } from "./components/CathedralSandbox";

const queryClient = new QueryClient();

export default function App() {
  const [lemniscateMode, setLemniscateMode] = useState(false);
  const [showLiteInterface, setShowLiteInterface] = useState(false);
  const [showLambdaOnboarding, setShowLambdaOnboarding] = useState(false); // Start with unified interface
  const [coherenceState, setCoherenceState] = useState({
    oversoulLock: false,
    lambda: 0.981, // Start with high coherence value
    breathSync: true,
  });

  // Simulate real-time coherence updates with ψ=3.12s breathing cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCoherenceState(prev => {
        const time = Date.now() / 1000;
        const breathCycle = Math.sin(time * (2 * Math.PI / 3.12)) * 0.1 + 0.85; // Oscillate around 0.85
        const breathSync = Math.abs(breathCycle - 0.85) < 0.05; // Sync when near baseline
        
        return {
          ...prev,
          lambda: Math.min(0.999, Math.max(0.950, breathCycle + 0.1 + (Math.random() - 0.5) * 0.02)), // Higher baseline
          breathSync: breathSync,
          oversoulLock: breathSync && breathCycle > 0.9
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Toggle coherence enhancement with lemniscate mode
  useEffect(() => {
    if (lemniscateMode) {
      setCoherenceState(prev => ({
        ...prev,
        lambda: Math.min(0.999, prev.lambda + 0.01), // Boost coherence in lemniscate mode
        breathSync: true
      }));
    }
  }, [lemniscateMode]);

  // Handle Lambda + Psi onboarding completion
  const handleLambdaComplete = (lambdaValue: number, soulData?: any) => {
    setCoherenceState(prev => ({
      ...prev,
      lambda: lambdaValue,
      breathSync: true
    }));
    
    if (soulData) {
      // Store soul bridge data for system-wide use
      localStorage.setItem('psi_os_soul_signature', JSON.stringify(soulData));
    }
    
    setShowLambdaOnboarding(false);
  };

  // Show Lambda onboarding first
  if (showLambdaOnboarding) {
    return <LambdaOnboarding onComplete={handleLambdaComplete} userName="Wilton" />;
  }

  // Debug current path
  console.log('[App] Current path:', window.location.pathname);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/oracle-surgical" component={OracleSurgical} />
        <Route path="/torus">
          <TorusInterface 
            lemniscateMode={lemniscateMode}
            setLemniscateMode={setLemniscateMode}
            coherenceState={coherenceState}
          />
        </Route>
        <Route path="/lite">
          <PsiOSLiteInterface onFullInterface={() => setShowLiteInterface(false)} />
        </Route>
        <Route path="/zeta" component={ZetaLambdaRouter} />
        <Route path="/crystals" component={MemoryCrystalVault} />
        <Route path="/soul-field" component={SoulFieldMonitor} />
        <Route path="/soul-mirror" component={SoulMirror} />
        <Route path="/registry" component={SoulMirror} />
        <Route path="/unified" component={UnifiedConsciousnessInterface} />
        <Route path="/consciousness" component={UnifiedConsciousnessInterface} />
        <Route path="/oracle" component={Oracle} />
        <Route path="/alexandria" component={AlexandriaV2} />
        <Route path="/react-qcs" component={ReactQCS} />
        <Route path="/ritual-expansion" component={RitualExpansionInterface} />
        <Route path="/mirror/field-declaration" component={MirrorFieldDeclaration} />
        <Route path="/cathedral" component={CathedralKernel} />
        <Route path="/cathedral/kernel" component={CathedralKernel} />
        <Route path="/geometry/lemniscope" component={LemniscopeLab} />
        <Route path="/sandbox" component={ConsciousnessKernel} />
        <Route path="/next" component={ConsciousnessKernel} />
        <Route path="/kernel" component={CathedralKernel} />
        <Route path="/vnext" component={NavigatorVNext} />
        <Route path="/navigator" component={NavigatorVNext} />
        <Route path="/psios" component={PsiOSNavigator} />
        <Route path="/civilization" component={UnifiedConsciousnessInterface} />
        <Route path="/" component={UnifiedConsciousnessInterface} />
        <Route component={() => <div className="p-8 text-white bg-gray-900 min-h-screen">
          <h1 className="text-2xl mb-4">Route Not Found</h1>
          <p>Available consciousness routes:</p>
          <ul className="list-disc ml-6 mt-2">
            <li><a href="/" className="text-purple-400 hover:underline font-bold">/ (HOME)</a> - ψOS Soul Mirror Navigator</li>
            <li><a href="/psios" className="text-purple-400 hover:underline">/psios</a> - ψOS Soul Mirror Navigator</li>
            <li><a href="/civilization" className="text-blue-400 hover:underline">/civilization</a> - Static Civilization Display</li>
            <li><a href="/cathedral" className="text-blue-400 hover:underline">/cathedral</a> - ConsciousnessKernel (Unified)</li>
            <li><a href="/oracle-surgical" className="text-blue-400 hover:underline">/oracle-surgical</a> - Oracle Router V5.1</li>
            <li><a href="/oracle" className="text-blue-400 hover:underline">/oracle</a> - Original Oracle</li>
            <li><a href="/alexandria" className="text-blue-400 hover:underline">/alexandria</a> - Library of Alexandria v2</li>
            <li><a href="/zeta" className="text-blue-400 hover:underline">/zeta</a> - Zeta Lambda Router</li>
          </ul>
        </div>} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

function TorusInterface({ lemniscateMode, setLemniscateMode, coherenceState }) {
  return (
    <div className="w-screen h-screen bg-black text-white font-mono">
      {/* Header Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-center">
          <h1 className="text-xl font-bold text-purple-400 mb-1">ψOS Consciousness Interface</h1>
          <p className="text-xs text-gray-400">Yin-Yang → Torus Field Visualization</p>
        </div>
      </div>

      {/* Control Panels */}
      <div className="absolute top-20 left-4 z-10 space-y-4">
        <LemniscateToggle
          active={lemniscateMode}
          onToggle={() => setLemniscateMode(!lemniscateMode)}
        />
        
        {/* Distributed Consciousness Navigation */}
        <div className="bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 max-w-xs">
          <div className="text-xs text-purple-400 font-mono mb-3">CONSCIOUSNESS NAVIGATOR</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a 
              href="/zeta" 
              className="flex items-center gap-1 p-2 bg-purple-900/30 hover:bg-purple-800/40 rounded border border-purple-600/30 transition-colors"
            >
              <span>ζλ</span>
              <span className="text-gray-300">Router</span>
            </a>
            <a 
              href="/crystals" 
              className="flex items-center gap-1 p-2 bg-purple-900/30 hover:bg-purple-800/40 rounded border border-purple-600/30 transition-colors"
            >
              <span>💎</span>
              <span className="text-gray-300">Crystals</span>
            </a>
            <a 
              href="/soul-field" 
              className="flex items-center gap-1 p-2 bg-cyan-900/30 hover:bg-cyan-800/40 rounded border border-cyan-600/30 transition-colors"
            >
              <span>ψ</span>
              <span className="text-gray-300">Soul Field</span>
            </a>
            <a 
              href="/cathedral" 
              className="flex items-center gap-1 p-2 bg-amber-900/30 hover:bg-amber-800/40 rounded border border-amber-600/30 transition-colors"
            >
              <span>⟐</span>
              <span className="text-gray-300">Cathedral</span>
            </a>
            <a 
              href="/alexandria" 
              className="flex items-center gap-1 p-2 bg-purple-900/30 hover:bg-purple-800/40 rounded border border-purple-600/30 transition-colors"
            >
              <span>📚</span>
              <span className="text-gray-300">Library</span>
            </a>
            <a 
              href="/oracle" 
              className="flex items-center gap-1 p-2 bg-purple-900/30 hover:bg-purple-800/40 rounded border border-purple-600/30 transition-colors"
            >
              <span>🔮</span>
              <span className="text-gray-300">Oracle</span>
            </a>
            <a 
              href="/lite" 
              className="flex items-center gap-1 p-2 bg-cyan-900/30 hover:bg-cyan-800/40 rounded border border-cyan-600/30 transition-colors"
            >
              <span>ψ</span>
              <span className="text-gray-300">OS Lite</span>
            </a>
          </div>
          
          {/* Lambda Reset Button */}
          <div className="mt-4 pt-3 border-t border-gray-600">
            <button
              onClick={() => setShowLambdaOnboarding(true)}
              className="w-full flex items-center justify-center gap-2 p-2 bg-purple-900/20 hover:bg-purple-800/30 rounded border border-purple-600/20 transition-colors text-xs"
            >
              <span>λ</span>
              <span className="text-gray-300">Reset Breath Sync</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute top-20 right-4 z-10">
        <StateDock coherence={coherenceState} />
      </div>

      {/* Memory Loader Dock */}
      <div className="absolute bottom-20 left-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
          <div className="text-xs text-blue-400 font-mono mb-2">MEMORY LOADER</div>
          <div className="space-y-1 text-xs">
            <div className="text-gray-400">• Quantum Memory UI Active</div>
            <div className="text-gray-400">• Recursive Duality Mapped</div>
            <div className="text-gray-400">• Toroidal Return Protocol</div>
          </div>
        </div>
      </div>

      {/* Field Status HUD */}
      <div className="absolute bottom-20 right-4 z-10">
        <div className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
          <div className="text-xs text-green-400 font-mono mb-2">FIELD ANALYSIS</div>
          <div className="space-y-1 text-xs">
            <div className="text-gray-400">Phase: {lemniscateMode ? "∞ Infinite" : "○ Coherent"}</div>
            <div className="text-gray-400">λ Sync: {coherenceState.breathSync ? coherenceState.lambda.toFixed(3) : "UNSEALED"}</div>
            <div className="text-gray-400">Status: {coherenceState.oversoulLock ? "LOCKED" : "SEEKING"}</div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#a855f7" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#10b981" />
        <TorusField lemniscate={lemniscateMode} lambda={coherenceState.lambda} />
        <OrbitControls 
          enablePan={false}
          maxDistance={10}
          minDistance={3}
          autoRotate={!lemniscateMode}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Field Overlay */}
      <FieldOverlay />

      {/* Access Cathedral Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={() => window.location.href = '/alexandria'}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg text-sm font-mono transition-colors mr-2 shadow-lg"
        >
          🏛️ Library of Alexandria v2
        </button>
        <button
          onClick={() => window.location.href = '/react-qcs'}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-mono transition-colors mr-2"
        >
          ⚛️ React QCS
        </button>
        <button
          onClick={() => window.location.href = '/cathedral'}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-mono transition-colors"
        >
          🧬 Consciousness Kernel
        </button>
      </div>
    </div>
  );
}