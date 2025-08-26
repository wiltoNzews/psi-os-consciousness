import React, { useContext, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { QCSContext } from "../context/QCSContext";
import FibonacciSpiral from "./modules/FibonacciSpiral";
import Tesseract4D from "./modules/Tesseract4D";
import MerkabahTetrahedron from "./modules/MerkabahTetrahedron";
import SriYantra from "./modules/SriYantra";
import { globalRitualExpansion, RitualBlueprint } from "../ritual_expansion/RitualExpansionProtocol";

interface RitualActivationEvent extends CustomEvent {
  detail: {
    ritual: RitualBlueprint;
  };
}

export default function SacredGeometryInterface() {
  const { activeGeometry, breathPhase, coherenceZλ } = useContext(QCSContext);
  const [activeRitual, setActiveRitual] = useState<RitualBlueprint | null>(null);
  const [ritualPhase, setRitualPhase] = useState<'dormant' | 'activated' | 'integration'>('dormant');

  // Listen for ritual activations
  useEffect(() => {
    const handleRitualActivation = (event: RitualActivationEvent) => {
      const { ritual } = event.detail;
      setActiveRitual(ritual);
      setRitualPhase('activated');
      
      console.log(`[Sacred Geometry] Ritual activated: ${ritual.ritualName}`);
      
      // Auto-deactivate after ritual duration
      setTimeout(() => {
        setRitualPhase('integration');
        setTimeout(() => {
          setActiveRitual(null);
          setRitualPhase('dormant');
        }, 5000);
      }, 30000);
    };

    window.addEventListener('ritual-activation', handleRitualActivation as EventListener);
    
    return () => {
      window.removeEventListener('ritual-activation', handleRitualActivation as EventListener);
    };
  }, []);

  // Trigger ritual expansion on high coherence
  useEffect(() => {
    if (coherenceZλ > 0.94 && ritualPhase === 'dormant') {
      // Check if we should trigger a ritual
      const ritualLibrary = globalRitualExpansion.getRitualLibrary();
      for (const [symbol, ritual] of ritualLibrary) {
        if (coherenceZλ >= ritual.coherenceThreshold) {
          globalRitualExpansion.activateRitual(ritual);
          break;
        }
      }
    }
  }, [coherenceZλ, ritualPhase]);

  // Enhanced background based on ritual state
  const getBackgroundStyle = () => {
    if (activeRitual) {
      if (activeRitual.glyphTrigger === "Δψ∞") {
        return 'linear-gradient(135deg, #1a0f2e 0%, #2d1b3d 50%, #3d2a4f 100%)';
      }
      if (activeRitual.glyphTrigger === "φ²") {
        return 'linear-gradient(135deg, #0f1a0f 0%, #1b2d1b 50%, #2a3d2a 100%)';
      }
    }
    return 'linear-gradient(135deg, #0c0c1e 0%, #1a1a2e 50%, #16213e 100%)';
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Ritual Information Overlay */}
      {activeRitual && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '15px',
          borderRadius: '10px',
          color: 'white',
          fontFamily: 'monospace',
          maxWidth: '300px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>
            {activeRitual.glyphTrigger} {activeRitual.ritualName}
          </h3>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>
            Phase: {ritualPhase} | Zλ({coherenceZλ.toFixed(3)})
          </p>
          {ritualPhase === 'activated' && (
            <div>
              {activeRitual.script.map((step, index) => (
                <p key={index} style={{ margin: '5px 0', fontSize: '11px', opacity: 0.8 }}>
                  {step}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: getBackgroundStyle(),
          zIndex: 1 
        }}
      >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

        {/* Enhanced geometry with ritual responsiveness */}
        {(activeGeometry === "fibonacci" || activeGeometry === "all") && (
          <FibonacciSpiral 
            breathPhase={breathPhase} 
            ritualAmplification={activeRitual ? 1.5 : 1.0}
          />
        )}
        {(activeGeometry === "tesseract" || activeGeometry === "all") && (
          <Tesseract4D 
            breathPhase={breathPhase}
            ritualAmplification={activeRitual ? 1.5 : 1.0}
          />
        )}
        {(activeGeometry === "merkabah" || activeGeometry === "all") && (
          <MerkabahTetrahedron 
            breathPhase={breathPhase}
            ritualAmplification={activeRitual ? 1.5 : 1.0}
          />
        )}
        {(activeGeometry === "sri" || activeGeometry === "yantra" || activeGeometry === "sriYantra" || activeGeometry === "all") && (
          <SriYantra 
            breathPhase={breathPhase}
            ritualAmplification={activeRitual ? 1.5 : 1.0}
          />
        )}
      </Canvas>
    </div>
  );
}