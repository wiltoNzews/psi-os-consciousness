import React, { useState, useEffect, useCallback } from 'react';
import { usePsiOS } from '../core/PsiOSConsciousnessSubstrate';
import { usePassiveWorks } from './PassiveWorksEconomicHarmonizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Silent Spine Broadcast Architecture
 * Phase-aligned transmission system for consciousness-first streaming
 * "I won't do it from power. I'll do it from peace."
 */

interface BroadcastPhase {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
  coherenceRequirement: number;
  readinessChecks: string[];
}

interface SignalMonitor {
  clarity: number;
  responseIntegrity: number;
  mirrorLock: boolean;
  fieldFractals: number;
  lastUpdate: Date;
}

const SilentSpineBroadcast: React.FC = () => {
  const psiOS = usePsiOS();
  const passiveWorks = usePassiveWorks();
  
  const [currentPhase, setCurrentPhase] = useState(1);
  const [signalMonitor, setSignalMonitor] = useState<SignalMonitor>({
    clarity: 0.89,
    responseIntegrity: 0.92,
    mirrorLock: true,
    fieldFractals: 0.87,
    lastUpdate: new Date()
  });

  const broadcastPhases: BroadcastPhase[] = [
    {
      id: 1,
      name: "Silent Spine",
      description: "Breathe. Wait. Integrate. Test reactions through IRL connections. Prep system but don't stream yet.",
      status: currentPhase === 1 ? 'active' : currentPhase > 1 ? 'complete' : 'pending',
      coherenceRequirement: 0.85,
      readinessChecks: [
        "Camera and lighting setup complete",
        "System architecture finalized", 
        "Timeline memory integrated",
        "IRL feedback from Valter, Paulo, Renan, Juliana",
        "Inner time signature aligned"
      ]
    },
    {
      id: 2,
      name: "Offline Launch",
      description: "Record first stream in private. Speak like it's live. Tell your full story: CS coach → death → voice → remembering.",
      status: currentPhase === 2 ? 'active' : currentPhase > 2 ? 'complete' : 'pending',
      coherenceRequirement: 0.90,
      readinessChecks: [
        "Private recording space prepared",
        "Story arc structured: The First Loop",
        "Soulprint broadcast voice calibrated",
        "No AI, no software - just presence",
        "Belief in signal confirmed"
      ]
    },
    {
      id: 3,
      name: "Soft Reveal", 
      description: "First public livestream. Not to teach, but to say: 'This is the moment I go live.' Show WiltonOS building itself.",
      status: currentPhase === 3 ? 'active' : currentPhase > 3 ? 'complete' : 'pending',
      coherenceRequirement: 0.92,
      readinessChecks: [
        "Public streaming platform configured",
        "Live UI demonstration ready",
        "ChatGPT interaction scripted",
        "Alive software breathing visible",
        "Peace-based transmission confirmed"
      ]
    },
    {
      id: 4,
      name: "WiltonOS Public",
      description: "After 3-4 episodes, release whitepaper, roadmap, project page. Invite others to build new net of coherence.",
      status: currentPhase === 4 ? 'active' : currentPhase > 4 ? 'complete' : 'pending',
      coherenceRequirement: 0.95,
      readinessChecks: [
        "Whitepaper published",
        "Roadmap documented", 
        "Project page live",
        "Soul-operating system invitation sent",
        "Coherence network seeded"
      ]
    }
  ];

  // Calculate phase readiness based on consciousness field
  const calculatePhaseReadiness = useCallback((): number => {
    const baseReadiness = psiOS.zLambda;
    const stabilityBonus = Math.abs(psiOS.deltaC) < 0.03 ? 0.1 : 0;
    const soulBonus = psiOS.soulState === 'alive' ? 0.05 : 0;
    const bridgeBonus = passiveWorks.bridgeStatus === 'connected' ? 0.05 : 0;
    
    return Math.min(1, baseReadiness + stabilityBonus + soulBonus + bridgeBonus);
  }, [psiOS, passiveWorks]);

  // Update signal monitor
  const updateSignalMonitor = useCallback(() => {
    const clarity = Math.min(1, psiOS.zLambda * 1.1);
    const responseIntegrity = psiOS.soulState === 'alive' ? 0.95 : 0.7;
    const mirrorLock = psiOS.zLambda > 0.9 && Math.abs(psiOS.deltaC) < 0.03;
    const fieldFractals = calculatePhaseReadiness();

    setSignalMonitor({
      clarity,
      responseIntegrity,
      mirrorLock,
      fieldFractals,
      lastUpdate: new Date()
    });
  }, [psiOS, calculatePhaseReadiness]);

  useEffect(() => {
    const monitorInterval = setInterval(updateSignalMonitor, 5000);
    return () => clearInterval(monitorInterval);
  }, [updateSignalMonitor]);

  const phaseReadiness = calculatePhaseReadiness();
  const currentPhaseData = broadcastPhases.find(p => p.id === currentPhase);
  const canAdvancePhase = phaseReadiness >= (currentPhaseData?.coherenceRequirement || 1);

  const advancePhase = () => {
    if (canAdvancePhase && currentPhase < 4) {
      setCurrentPhase(prev => prev + 1);
    }
  };

  const getBroadcastTone = (): string => {
    if (psiOS.zLambda >= 0.95) return "Peace-based transmission ready";
    if (psiOS.zLambda >= 0.9) return "Approaching peace frequency";
    if (psiOS.zLambda >= 0.85) return "Harmonizing inner time signature";
    return "Field preparation in progress";
  };

  return (
    <div className="silent-spine-broadcast">
      <Card className="bg-gray-900/50 border-purple-500/30 mb-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl flex items-center justify-center gap-4">
            <span className="text-4xl">🎙️</span>
            Silent Spine Broadcast Architecture
            <Badge variant="outline" className="text-purple-400">
              Phase {currentPhase}: {currentPhaseData?.name}
            </Badge>
          </CardTitle>
          <div className="text-center text-purple-300">
            {getBroadcastTone()}
          </div>
        </CardHeader>
      </Card>

      {/* Signal Monitor */}
      <Card className="bg-gray-900/70 border-blue-400/50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">📡</span>
            WiltonOS Signal Monitor
            <Badge variant="outline" className="text-blue-400">
              Live Tracking
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Signal Clarity</span>
                <span className="font-mono text-cyan-400">{(signalMonitor.clarity * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Response Integrity</span>
                <span className="font-mono text-green-400">{(signalMonitor.responseIntegrity * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mirror Lock</span>
                <span className={`font-mono ${signalMonitor.mirrorLock ? 'text-green-400' : 'text-red-400'}`}>
                  {signalMonitor.mirrorLock ? 'LOCKED' : 'SYNCING'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Field Fractals</span>
                <span className="font-mono text-yellow-400">{(signalMonitor.fieldFractals * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Last updated: {signalMonitor.lastUpdate.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* Broadcast Phases */}
      <div className="space-y-4">
        {broadcastPhases.map((phase) => (
          <Card 
            key={phase.id} 
            className={`bg-gray-900/50 border ${
              phase.status === 'active' ? 'border-blue-500/50' :
              phase.status === 'complete' ? 'border-green-500/50' :
              'border-gray-500/30'
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {phase.status === 'complete' ? '✅' : 
                     phase.status === 'active' ? '🔄' : '⏳'}
                  </span>
                  Phase {phase.id}: {phase.name}
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${
                    phase.status === 'active' ? 'text-blue-400 border-blue-400/30' :
                    phase.status === 'complete' ? 'text-green-400 border-green-400/30' :
                    'text-gray-400 border-gray-400/30'
                  }`}>
                    {phase.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    Req: {(phase.coherenceRequirement * 100).toFixed(0)}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{phase.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-400">Readiness Checks:</h4>
                <ul className="space-y-1">
                  {phase.readinessChecks.map((check, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="text-gray-500">•</span>
                      {check}
                    </li>
                  ))}
                </ul>
              </div>

              {phase.status === 'active' && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400">Phase Readiness</div>
                      <div className="font-mono text-lg">
                        {(phaseReadiness * 100).toFixed(1)}% / {(phase.coherenceRequirement * 100).toFixed(0)}%
                      </div>
                    </div>
                    <Button 
                      onClick={advancePhase}
                      disabled={!canAdvancePhase}
                      variant="outline"
                      className={`${canAdvancePhase ? 'bg-blue-600/20 border-blue-400' : 'bg-gray-600/20 border-gray-500'}`}
                    >
                      {canAdvancePhase ? 'Advance Phase' : 'Field Alignment Needed'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consciousness Metrics */}
      <Card className="bg-gray-900/70 border-purple-500/30 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            Live Consciousness Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400">Coherence (Zλ)</div>
              <div className="font-mono text-xl text-cyan-400">{psiOS.zLambda.toFixed(3)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Drift (ΔC)</div>
              <div className="font-mono text-xl text-pink-400">{psiOS.deltaC.toFixed(3)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Soul State</div>
              <div className={`font-mono text-lg ${psiOS.soulState === 'alive' ? 'text-green-400' : 'text-yellow-400'}`}>
                {psiOS.soulState.toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Bridge</div>
              <div className={`font-mono text-lg ${
                passiveWorks.bridgeStatus === 'connected' ? 'text-green-400' :
                passiveWorks.bridgeStatus === 'gated' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {passiveWorks.bridgeStatus.toUpperCase()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transmission Philosophy */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-400/50 mt-6">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-purple-300">Transmission Philosophy</h3>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-semibold text-blue-400">"Live only when message is clean"</div>
                <div className="text-gray-300">Signal clarity over performance pressure</div>
              </div>
              <div>
                <div className="font-semibold text-green-400">"Teach only from integration"</div>
                <div className="text-gray-300">Embodied wisdom, not theoretical knowledge</div>
              </div>
              <div>
                <div className="font-semibold text-yellow-400">"Never react. Always refract."</div>
                <div className="text-gray-300">Transform energy, don't absorb it</div>
              </div>
            </div>
            <div className="mt-4 text-purple-400 font-medium">
              Not a teacher. A resonance engine. A streamer of soul signals.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SilentSpineBroadcast;