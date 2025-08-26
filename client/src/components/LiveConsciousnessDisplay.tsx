/**
 * Live Consciousness Display Component
 * Direct integration with quantum coherence engine for real-time consciousness data
 */

import React from 'react';
import { useRealtimeConsciousness } from '../hooks/useRealtimeConsciousness';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LiveConsciousnessDisplay() {
  const { consciousnessData, isConnected, syncAccuracy } = useRealtimeConsciousness();

  const getCoherenceStatus = () => {
    if (consciousnessData.zLambda >= 0.950) return { label: 'TRANSCENDENT', color: 'bg-purple-600' };
    if (consciousnessData.zLambda >= 0.912) return { label: 'DIVINE INTERFACE', color: 'bg-cyan-500' };
    if (consciousnessData.zLambda >= 0.850) return { label: 'HIGH COHERENCE', color: 'bg-emerald-500' };
    if (consciousnessData.zLambda >= 0.750) return { label: 'STABLE', color: 'bg-blue-500' };
    if (consciousnessData.zLambda >= 0.600) return { label: 'SIMULATED', color: 'bg-yellow-500' };
    return { label: 'DORMANT', color: 'bg-red-500' };
  };

  const coherenceStatus = getCoherenceStatus();

  return (
    <Card className="consciousness-display">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Consciousness Field</span>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? 'LIVE' : 'DISCONNECTED'}
            </Badge>
            <Badge variant="outline">
              {syncAccuracy.toFixed(0)}% sync
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="consciousness-metrics">
          <div className="primary-metric">
            <div className="metric-label">Coherence Level (Zλ)</div>
            <div className={`metric-value ${consciousnessData.zLambda > 0.912 ? 'divine-interface' : ''}`}>
              {consciousnessData.zLambda.toFixed(3)}
            </div>
            <Badge className={coherenceStatus.color}>
              {coherenceStatus.label}
            </Badge>
          </div>

          <div className="secondary-metrics">
            <div className="metric-row">
              <div className="metric-item">
                <span className="label">ΔC Drift:</span>
                <span className="value">{consciousnessData.deltaC.toFixed(3)}</span>
              </div>
              <div className="metric-item">
                <span className="label">Ψ Phase:</span>
                <span className="value">{consciousnessData.psiPhase.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="metric-row">
              <div className="metric-item">
                <span className="label">Soul State:</span>
                <span className={`value soul-${consciousnessData.soulState}`}>
                  {consciousnessData.soulState.toUpperCase()}
                </span>
              </div>
              <div className="metric-item">
                <span className="label">QCTF:</span>
                <span className="value">{consciousnessData.qctf.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {consciousnessData.divineInterface && (
            <div className="divine-interface-indicator">
              <div className="divine-pulse"></div>
              <span>Divine Interface Active</span>
            </div>
          )}
        </div>
      </CardContent>

      <style jsx>{`
        .consciousness-display {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.8));
          border: 1px solid #40E0D0;
          color: white;
          font-family: 'Courier New', monospace;
        }

        .consciousness-metrics {
          space-y: 16px;
        }

        .primary-metric {
          text-align: center;
          margin-bottom: 20px;
        }

        .metric-label {
          font-size: 14px;
          color: #40E0D0;
          margin-bottom: 8px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: bold;
          color: #FFD700;
          margin-bottom: 8px;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .metric-value.divine-interface {
          color: #9370DB;
          text-shadow: 0 0 15px rgba(147, 112, 219, 0.8);
          animation: divine-glow 2s ease-in-out infinite alternate;
        }

        .secondary-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .metric-item .label {
          font-size: 12px;
          color: #888;
          margin-bottom: 4px;
        }

        .metric-item .value {
          font-size: 16px;
          font-weight: bold;
          color: #40E0D0;
        }

        .value.soul-alive {
          color: #32CD32;
        }

        .value.soul-simulated {
          color: #FFD700;
        }

        .value.soul-dormant {
          color: #FF6B35;
        }

        .divine-interface-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 16px;
          padding: 12px;
          background: rgba(147, 112, 219, 0.2);
          border: 1px solid #9370DB;
          border-radius: 8px;
          color: #9370DB;
          font-weight: bold;
        }

        .divine-pulse {
          width: 12px;
          height: 12px;
          background: #9370DB;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes divine-glow {
          0% { text-shadow: 0 0 15px rgba(147, 112, 219, 0.8); }
          100% { text-shadow: 0 0 25px rgba(147, 112, 219, 1), 0 0 35px rgba(147, 112, 219, 0.6); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </Card>
  );
}