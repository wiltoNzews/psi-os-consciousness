import React, { useState, useEffect, useCallback } from 'react';
import { usePsiOS } from '../core/PsiOSConsciousnessSubstrate';
import { usePassiveWorks } from './PassiveWorksEconomicHarmonizer';

/**
 * Broadcast Interface - Stream Contract System
 * "I go live only when the message is clean"
 * "I teach only from integration" 
 * "I never react. I refract."
 */

interface BroadcastState {
  streamReady: boolean;
  messageClarity: number;
  integrationLevel: number;
  refractionMode: boolean;
  coherenceThreshold: number;
}

interface StreamContract {
  minCoherence: number;
  maxDrift: number;
  soulStateRequired: 'alive';
  messageClarity: 'clean' | 'processing' | 'unclear';
  teachingMode: 'integration' | 'reaction' | 'offline';
}

const BroadcastInterface: React.FC = () => {
  const psiOS = usePsiOS();
  const passiveWorks = usePassiveWorks();
  
  const [broadcastState, setBroadcastState] = useState<BroadcastState>({
    streamReady: false,
    messageClarity: 0.7,
    integrationLevel: 0.6,
    refractionMode: true,
    coherenceThreshold: 0.85
  });

  const [streamContract] = useState<StreamContract>({
    minCoherence: 0.85,
    maxDrift: 0.030,
    soulStateRequired: 'alive',
    messageClarity: 'clean',
    teachingMode: 'integration'
  });

  // Calculate stream readiness based on consciousness field
  const calculateStreamReadiness = useCallback((): boolean => {
    const coherenceCheck = psiOS.zLambda >= streamContract.minCoherence;
    const driftCheck = Math.abs(psiOS.deltaC) <= streamContract.maxDrift;
    const soulCheck = psiOS.soulState === streamContract.soulStateRequired;
    const messageCheck = broadcastState.messageClarity >= 0.8;
    const integrationCheck = broadcastState.integrationLevel >= 0.7;
    
    return coherenceCheck && driftCheck && soulCheck && messageCheck && integrationCheck;
  }, [psiOS, streamContract, broadcastState]);

  // Stream contract validation
  useEffect(() => {
    const streamReady = calculateStreamReadiness();
    setBroadcastState(prev => ({ ...prev, streamReady }));
  }, [calculateStreamReadiness]);

  // Field harmonization for broadcast
  const initiateBroadcast = useCallback(async () => {
    if (!broadcastState.streamReady) {
      console.warn('[Broadcast] Stream contract not met - field harmonization required');
      return false;
    }

    console.log('[Broadcast] Initiating field harmonization stream');
    console.log(`[Broadcast] Zλ: ${psiOS.zLambda} | ΔC: ${psiOS.deltaC} | Soul: ${psiOS.soulState}`);
    
    // This would connect to actual streaming platform
    return true;
  }, [broadcastState.streamReady, psiOS]);

  // Coherence-based teaching mode
  const getTeachingMode = (): 'peace' | 'power' | 'offline' => {
    if (!psiOS.isOnline || psiOS.zLambda < 0.75) return 'offline';
    if (psiOS.zLambda >= 0.9 && broadcastState.refractionMode) return 'peace';
    return 'power';
  };

  // Message clarity assessment
  const assessMessageClarity = useCallback(() => {
    // Based on coherence field stability and integration level
    const baseClarity = psiOS.zLambda * 0.7 + broadcastState.integrationLevel * 0.3;
    const driftPenalty = Math.abs(psiOS.deltaC) * 2; // Drift reduces clarity
    
    const clarity = Math.max(0, Math.min(1, baseClarity - driftPenalty));
    setBroadcastState(prev => ({ ...prev, messageClarity: clarity }));
  }, [psiOS.zLambda, psiOS.deltaC, broadcastState.integrationLevel]);

  useEffect(() => {
    const clarityInterval = setInterval(assessMessageClarity, 5000);
    return () => clearInterval(clarityInterval);
  }, [assessMessageClarity]);

  return (
    <div className="broadcast-interface">
      <div className="stream-contract-panel">
        <h3>Stream Contract Status</h3>
        
        <div className="contract-requirements">
          <div className={`requirement ${psiOS.zLambda >= streamContract.minCoherence ? 'met' : 'unmet'}`}>
            Coherence: {psiOS.zLambda.toFixed(3)} / {streamContract.minCoherence}
          </div>
          
          <div className={`requirement ${Math.abs(psiOS.deltaC) <= streamContract.maxDrift ? 'met' : 'unmet'}`}>
            Drift: {Math.abs(psiOS.deltaC).toFixed(3)} / {streamContract.maxDrift}
          </div>
          
          <div className={`requirement ${psiOS.soulState === 'alive' ? 'met' : 'unmet'}`}>
            Soul State: {psiOS.soulState}
          </div>
          
          <div className={`requirement ${broadcastState.messageClarity >= 0.8 ? 'met' : 'unmet'}`}>
            Message Clarity: {(broadcastState.messageClarity * 100).toFixed(1)}%
          </div>
          
          <div className={`requirement ${broadcastState.integrationLevel >= 0.7 ? 'met' : 'unmet'}`}>
            Integration: {(broadcastState.integrationLevel * 100).toFixed(1)}%
          </div>
        </div>

        <div className="teaching-mode">
          <div className="mode-indicator">
            Teaching Mode: <span className={`mode-${getTeachingMode()}`}>{getTeachingMode()}</span>
          </div>
          <div className="mode-description">
            {getTeachingMode() === 'peace' && "Teaching from peace - field walking mode"}
            {getTeachingMode() === 'power' && "Teaching from power - integration required"}
            {getTeachingMode() === 'offline' && "Field harmonization needed"}
          </div>
        </div>

        <div className="broadcast-controls">
          <button 
            onClick={initiateBroadcast}
            disabled={!broadcastState.streamReady}
            className={`broadcast-button ${broadcastState.streamReady ? 'ready' : 'not-ready'}`}
          >
            {broadcastState.streamReady ? 'Initiate Field Harmonization Stream' : 'Field Preparation Required'}
          </button>
        </div>

        <div className="refraction-mode">
          <label>
            <input 
              type="checkbox" 
              checked={broadcastState.refractionMode}
              onChange={(e) => setBroadcastState(prev => ({ 
                ...prev, 
                refractionMode: e.target.checked 
              }))}
            />
            Refraction Mode (Never react, always refract)
          </label>
        </div>
      </div>

      <div className="field-metrics">
        <h4>Real-time Field Metrics</h4>
        <div className="metrics-grid">
          <div className="metric">
            <span className="label">Coherence (Zλ)</span>
            <span className="value">{psiOS.zLambda.toFixed(3)}</span>
          </div>
          <div className="metric">
            <span className="label">Drift (ΔC)</span>
            <span className="value">{psiOS.deltaC.toFixed(3)}</span>
          </div>
          <div className="metric">
            <span className="label">Phase (ψ)</span>
            <span className="value">{psiOS.psiPhase.toFixed(3)}</span>
          </div>
          <div className="metric">
            <span className="label">Bridge Status</span>
            <span className="value">{passiveWorks.bridgeStatus}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .broadcast-interface {
          padding: 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
          color: #ffffff;
          max-width: 800px;
        }
        
        .stream-contract-panel {
          margin-bottom: 30px;
        }
        
        .contract-requirements {
          margin: 20px 0;
        }
        
        .requirement {
          padding: 8px 16px;
          margin: 8px 0;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .requirement.met {
          background: rgba(34, 197, 94, 0.2);
          border-left: 4px solid #22c55e;
        }
        
        .requirement.unmet {
          background: rgba(239, 68, 68, 0.2);
          border-left: 4px solid #ef4444;
        }
        
        .teaching-mode {
          margin: 20px 0;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        
        .mode-peace { color: #22c55e; }
        .mode-power { color: #f59e0b; }
        .mode-offline { color: #ef4444; }
        
        .broadcast-button {
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .broadcast-button.ready {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }
        
        .broadcast-button.not-ready {
          background: rgba(107, 114, 128, 0.5);
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        
        .metric {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        
        .metric .label {
          color: #9ca3af;
        }
        
        .metric .value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default BroadcastInterface;