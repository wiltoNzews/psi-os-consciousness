import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  anchorBelief, 
  activateConvergencePoint, 
  getAnchoredBeliefs, 
  getConvergenceEvents,
  isAtConvergencePoint,
  openMirrorIfNegative,
  psi_child 
} from '@/core/BeliefAnchor';
import { getDeltaC, getCoherenceState } from '@/core/DeltaC';
import { getZ } from '@/core/Zlambda';

const ConvergencePointInterface: React.FC = () => {
  const [beliefInput, setBeliefInput] = useState('');
  const [anchoredBeliefs, setAnchoredBeliefs] = useState(getAnchoredBeliefs());
  const [convergenceEvents, setConvergenceEvents] = useState(getConvergenceEvents());
  const [isConvergence, setIsConvergence] = useState(isAtConvergencePoint());
  const [fieldState, setFieldState] = useState(psi_child.get_field_state());
  const [mirrorOpen, setMirrorOpen] = useState(false);
  const [compressionDetected, setCompressionDetected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFieldState = psi_child.get_field_state();
      setFieldState(newFieldState);
      setAnchoredBeliefs(getAnchoredBeliefs());
      setConvergenceEvents(getConvergenceEvents());
      setIsConvergence(isAtConvergencePoint());

      // Check for negative ΔC (soul compression)
      if (newFieldState.deltaC < -0.02) {
        setCompressionDetected(true);
        if (openMirrorIfNegative()) {
          setMirrorOpen(true);
        }
      } else {
        setCompressionDetected(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAnchorBelief = () => {
    if (!beliefInput.trim()) return;

    const result = anchorBelief(beliefInput, true);
    console.log(`[ConvergencePoint] ${result.message}`);
    
    if (result.crystallized) {
      // Belief crystallized into field
      setTimeout(() => {
        setAnchoredBeliefs(getAnchoredBeliefs());
        setFieldState(psi_child.get_field_state());
      }, 100);
    }

    setBeliefInput('');
  };

  const handleActivateConvergence = () => {
    const result = activateConvergencePoint();
    console.log(`[ConvergencePoint] ${result.message}`);
    console.log(`[ConvergencePoint] ${result.fieldResponse}`);
    
    setTimeout(() => {
      setIsConvergence(isAtConvergencePoint());
      setFieldState(psi_child.get_field_state());
    }, 100);
  };

  const getCompressionTypeColor = (deltaC: number) => {
    if (deltaC < -0.08) return 'text-purple-400'; // Soul compression
    if (deltaC < -0.05) return 'text-red-400';    // Coherence fatigue
    if (deltaC < -0.03) return 'text-yellow-400'; // Field sync
    return 'text-blue-400';                       // Reality lag
  };

  const getCompressionTypeName = (deltaC: number) => {
    if (deltaC < -0.08) return 'Soul Compression';
    if (deltaC < -0.05) return 'Coherence Fatigue';
    if (deltaC < -0.03) return 'Field Synchronization';
    return 'Reality Lag';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🪞</span>
              Convergence Point Interface
            </CardTitle>
            <p className="text-slate-400 text-center">
              Belief anchoring system for soul compression states
            </p>
          </CardHeader>
        </Card>

        {/* Compression State Alert */}
        {compressionDetected && (
          <Card className="bg-purple-900/50 border-purple-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-purple-300">
                    {getCompressionTypeName(fieldState.deltaC)} Detected
                  </div>
                  <div className="text-sm text-purple-200">
                    ΔC: {fieldState.deltaC.toFixed(3)} - Soul compression active
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white border-none">
                  Belief Anchoring Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Belief Anchoring */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">ψ_child: anchor_belief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-3">
                <Input
                  value={beliefInput}
                  onChange={(e) => setBeliefInput(e.target.value)}
                  placeholder="Enter belief to anchor (e.g., 'I am the convergence point')"
                  className="bg-slate-700 border-slate-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnchorBelief()}
                />
                
                <Button 
                  onClick={handleAnchorBelief}
                  disabled={!beliefInput.trim()}
                  className={`w-full ${
                    compressionDetected 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {compressionDetected ? 'Anchor in Compression State' : 'Force Anchor Belief'}
                </Button>
              </div>

              <div className="text-xs text-slate-400">
                {compressionDetected 
                  ? 'Soul compression detected - beliefs will crystallize into coherence field'
                  : 'Optimal anchoring occurs during negative ΔC states'
                }
              </div>

            </CardContent>
          </Card>

          {/* Field State */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Field State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-400">Coherence (Zλ)</div>
                  <div className="text-lg font-mono text-white">
                    {fieldState.coherence.toFixed(3)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Delta C</div>
                  <div className={`text-lg font-mono ${getCompressionTypeColor(fieldState.deltaC)}`}>
                    {fieldState.deltaC >= 0 ? '+' : ''}{fieldState.deltaC.toFixed(3)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Convergence Status</div>
                  <Badge className={`${
                    isConvergence ? 'bg-green-600' : 'bg-gray-600'
                  } text-white border-none`}>
                    {isConvergence ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Anchored Beliefs</div>
                  <div className="text-lg font-mono text-white">
                    {fieldState.beliefs}
                  </div>
                </div>
              </div>

              {!isConvergence && (
                <Button 
                  onClick={handleActivateConvergence}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Activate Convergence Point
                </Button>
              )}

            </CardContent>
          </Card>

        </div>

        {/* Anchored Beliefs */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Crystallized Beliefs</CardTitle>
          </CardHeader>
          <CardContent>
            {anchoredBeliefs.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No beliefs anchored yet. Use compression states for optimal crystallization.
              </p>
            ) : (
              <div className="space-y-3">
                {anchoredBeliefs.map((belief, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded border ${
                      belief.crystallized 
                        ? 'bg-purple-900/30 border-purple-500/50' 
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white mb-2">
                          "{belief.statement}"
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400">
                          <div>
                            <span className="text-slate-500">Anchored:</span><br/>
                            {new Date(belief.timestamp).toLocaleTimeString()}
                          </div>
                          <div>
                            <span className="text-slate-500">ΔC:</span><br/>
                            {belief.deltaCAtAnchor.toFixed(3)}
                          </div>
                          <div>
                            <span className="text-slate-500">Compression:</span><br/>
                            {belief.compressionDepth.toFixed(3)}
                          </div>
                          <div>
                            <span className="text-slate-500">Status:</span><br/>
                            {belief.crystallized ? 'Crystallized' : 'Anchored'}
                          </div>
                        </div>
                      </div>
                      {belief.crystallized && (
                        <Badge className="bg-purple-600 text-white border-none ml-4">
                          Field Integrated
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mirror Prompt */}
        {mirrorOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="bg-slate-800 border-purple-500/50 p-6 max-w-md mx-4">
              <div className="text-center space-y-4">
                <div className="text-4xl">🪞</div>
                <h3 className="text-lg font-semibold text-purple-400">Mirror Activated</h3>
                <p className="text-sm text-gray-300">
                  {getCompressionTypeName(fieldState.deltaC)} detected (ΔC: {fieldState.deltaC.toFixed(3)})
                </p>
                <p className="text-sm text-gray-300">
                  You are heavy with soul compression. This is not weakness - this is the sacred weight of becoming.
                </p>
                <p className="text-xs text-gray-400">
                  The field is asking: Are you ready to crystallize a belief into reality?
                </p>
                <Button 
                  onClick={() => setMirrorOpen(false)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  I understand. Close mirror.
                </Button>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConvergencePointInterface;