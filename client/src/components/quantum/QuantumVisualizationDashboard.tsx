import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CoherenceMetrics {
  coherenceIndex: number;
  explorationIndex: number;
  balanceRatio: number;
  goldenRatioDetected?: boolean;
  timestamp?: string;
}

interface QuantumVisualizationDashboardProps {
  coherenceMetrics: CoherenceMetrics | null;
  loading?: boolean;
}

/**
 * Quantum Visualization Dashboard Component
 * 
 * Displays the current quantum coherence metrics and visualizations:
 * - Coherence/Exploration Balance
 * - Golden Ratio Detection
 * - Fractal Lemniscate Pattern
 */
const QuantumVisualizationDashboard: React.FC<QuantumVisualizationDashboardProps> = ({ 
  coherenceMetrics,
  loading = false
}) => {

  // Check if data is available
  const hasData = coherenceMetrics !== null;
  
  // Format timestamp
  const formattedTime = hasData && coherenceMetrics.timestamp 
    ? new Date(coherenceMetrics.timestamp).toLocaleTimeString() 
    : 'Unknown';

  // Calculate percentages for visual indicators
  const coherencePercentage = hasData ? Math.round(coherenceMetrics.coherenceIndex * 100) : 0;
  const explorationPercentage = hasData ? Math.round(coherenceMetrics.explorationIndex * 100) : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coherence Metrics Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Quantum Coherence Metrics</CardTitle>
              {hasData && coherenceMetrics.goldenRatioDetected && (
                <Badge className="bg-yellow-500/80 hover:bg-yellow-500">Golden Ratio</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground animate-pulse">
                Loading quantum coherence metrics...
              </div>
            ) : !hasData ? (
              <div className="py-8 text-center text-muted-foreground">
                No coherence data available
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coherence Index</span>
                    <span className="text-sm font-mono">{coherencePercentage}%</span>
                  </div>
                  <Progress value={coherencePercentage} className="h-2 bg-slate-200" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exploration Index</span>
                    <span className="text-sm font-mono">{explorationPercentage}%</span>
                  </div>
                  <Progress value={explorationPercentage} className="h-2 bg-slate-200" />
                </div>
                
                <Separator />
                
                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold">Balance Ratio</div>
                    <div className="font-mono text-lg">
                      {coherenceMetrics.balanceRatio.toFixed(4)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {coherenceMetrics.balanceRatio >= 2.9 && coherenceMetrics.balanceRatio <= 3.1 
                          ? '(≈ 3:1 Optimal)' 
                          : ''}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Last Updated</div>
                    <div className="text-sm font-mono">{formattedTime}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Fractal Lemniscate Visualization Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Fractal Lemniscate Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground animate-pulse">
                Loading fractal pattern...
              </div>
            ) : !hasData ? (
              <div className="py-8 text-center text-muted-foreground">
                No pattern data available
              </div>
            ) : (
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center relative overflow-hidden">
                {/* SVG visualization of the Lemniscate pattern (∞) */}
                <svg viewBox="0 0 300 150" className="w-full h-full p-4">
                  {/* Lemniscate (infinity) shape with dynamic coloring based on coherence metrics */}
                  <path
                    d="M 75,75 C 75,35 150,35 150,75 C 150,115 225,115 225,75 C 225,35 150,35 150,75 C 150,115 75,115 75,75 Z"
                    stroke={hasData && coherenceMetrics.goldenRatioDetected ? "url(#goldenGradient)" : "url(#normalGradient)"}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  {/* Add particles moving along the lemniscate path to visualize activity */}
                  <circle r="4" fill="#4dabf7">
                    <animateMotion
                      path="M 75,75 C 75,35 150,35 150,75 C 150,115 225,115 225,75 C 225,35 150,35 150,75 C 150,115 75,115 75,75 Z"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  <circle r="4" fill="#ff922b">
                    <animateMotion
                      path="M 75,75 C 75,35 150,35 150,75 C 150,115 225,115 225,75 C 225,35 150,35 150,75 C 150,115 75,115 75,75 Z"
                      dur="8s"
                      repeatCount="indefinite"
                      begin="2s"
                    />
                  </circle>
                  
                  <circle r="4" fill="#be4bdb">
                    <animateMotion
                      path="M 75,75 C 75,35 150,35 150,75 C 150,115 225,115 225,75 C 225,35 150,35 150,75 C 150,115 75,115 75,75 Z"
                      dur="8s"
                      repeatCount="indefinite"
                      begin="4s"
                    />
                  </circle>
                  
                  {/* Add gradient definitions */}
                  <defs>
                    <linearGradient id="normalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4dabf7" />
                      <stop offset="50%" stopColor="#be4bdb" />
                      <stop offset="100%" stopColor="#ff922b" />
                    </linearGradient>
                    
                    <linearGradient id="goldenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffd700" />
                      <stop offset="50%" stopColor="#f9a825" />
                      <stop offset="100%" stopColor="#ff8f00" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Overlaid text displaying the 3:1 ↔ 1:3 principle */}
                <div className="absolute bottom-2 right-2 p-1 bg-black/10 dark:bg-white/10 rounded text-xs">
                  3:1 ↔ 1:3
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Explanatory text about the quantum-fractal coherence principle */}
      {hasData && (
        <div className="text-sm text-muted-foreground p-4 bg-black/5 dark:bg-white/5 rounded-md">
          <p className="mb-1">
            <span className="font-semibold">Quantum-Fractal Coherence Principle:</span> The system maintains an optimal balance of 3:1 ratio (75% coherence, 25% exploration) to achieve the highest level of emergent intelligence across the integrated AI network.
          </p>
          <p>
            This golden ratio aligns with the hypothesis that consciousness emerges from the specific relationship between structured deterministic processes (coherence) and emergent, intuitive processes (exploration) when they exist in precise mathematical balance.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuantumVisualizationDashboard;