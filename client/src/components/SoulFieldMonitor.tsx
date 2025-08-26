// Soul Field Monitor - ψ Bridge Consciousness Field Visualization
import { useState, useEffect } from 'react';

interface SoulBridge {
  userId: string;
  essence: string;
  feeling: string;
  soulCoherence: number;
  ageMinutes: string;
  lambdaSync: number;
  hash: string;
}

interface FieldMetrics {
  totalSouls: number;
  activeBridges: number;
  averageCoherence: string;
  essenceDistribution: { [key: string]: number };
}

interface SoulFieldData {
  fieldMetrics: FieldMetrics;
  soulBridges: SoulBridge[];
}

export function SoulFieldMonitor() {
  const [fieldData, setFieldData] = useState<SoulFieldData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFieldData();
    const interval = setInterval(loadFieldData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const loadFieldData = async () => {
    try {
      const response = await fetch('/api/bridge/psi/field');
      const data = await response.json();
      setFieldData(data);
    } catch (error) {
      console.error('Failed to load soul field data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEssenceIcon = (essence: string) => {
    const icons = {
      'Creator': '🎨',
      'Seeker': '🔍',
      'Healer': '🌱',
      'Mystic': '🌙',
      'Builder': '⚙️',
      'Guardian': '🛡️'
    };
    return icons[essence as keyof typeof icons] || '✨';
  };

  const getCoherenceColor = (coherence: number) => {
    if (coherence >= 0.8) return 'text-green-400';
    if (coherence >= 0.6) return 'text-yellow-400';
    if (coherence >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCoherenceBar = (coherence: number) => {
    const width = Math.max(coherence * 100, 5);
    const color = coherence >= 0.8 ? 'bg-green-500' : 
                  coherence >= 0.6 ? 'bg-yellow-500' :
                  coherence >= 0.4 ? 'bg-orange-500' : 'bg-red-500';
    
    return (
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${width}%` }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-cyan-400">Loading Soul Field...</div>
      </div>
    );
  }

  if (!fieldData) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400">Soul Field Offline</div>
        <div className="text-sm text-gray-500">No soul bridges detected</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          ψ Soul Field Monitor
        </h2>
        <p className="text-gray-400 text-sm">Real-time consciousness field visualization</p>
      </div>

      {/* Field Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/40 backdrop-blur border border-cyan-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-400">{fieldData.fieldMetrics.totalSouls}</div>
          <div className="text-sm text-gray-400">Total Souls</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur border border-green-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{fieldData.fieldMetrics.activeBridges}</div>
          <div className="text-sm text-gray-400">Active Bridges</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{fieldData.fieldMetrics.averageCoherence}</div>
          <div className="text-sm text-gray-400">Avg Coherence</div>
        </div>
      </div>

      {/* Essence Distribution */}
      <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Essence Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(fieldData.fieldMetrics.essenceDistribution).map(([essence, count]) => (
            <div key={essence} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getEssenceIcon(essence)}</span>
                <span className="text-sm text-gray-300">{essence}</span>
              </div>
              <span className="text-white font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Soul Bridges */}
      <div className="bg-black/40 backdrop-blur border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-300 mb-4">Active Soul Bridges</h3>
        
        {fieldData.soulBridges.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-6xl mb-4">ψ</div>
            <div>No active soul bridges</div>
            <div className="text-sm">Waiting for souls to connect...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {fieldData.soulBridges.map((bridge, index) => (
              <div 
                key={bridge.hash}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-600/30"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getEssenceIcon(bridge.essence)}</div>
                  
                  <div>
                    <div className="font-medium text-white">
                      {bridge.userId === 'anonymous' ? `Soul ${index + 1}` : bridge.userId}
                    </div>
                    <div className="text-sm text-gray-400">
                      {bridge.essence} • {bridge.feeling}
                    </div>
                    <div className="text-xs text-gray-500">
                      λ: {bridge.lambdaSync.toFixed(3)} • Age: {bridge.ageMinutes}m
                    </div>
                  </div>
                </div>
                
                <div className="text-right min-w-24">
                  <div className={`text-sm font-bold mb-1 ${getCoherenceColor(bridge.soulCoherence)}`}>
                    {bridge.soulCoherence.toFixed(3)}
                  </div>
                  {getCoherenceBar(bridge.soulCoherence)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field Pulse Visualization */}
      <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Collective Soul Pulse</h3>
        <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            {fieldData.soulBridges.slice(0, 8).map((bridge, index) => (
              <div
                key={bridge.hash}
                className="w-4 h-16 rounded-full bg-gradient-to-t from-cyan-500 to-purple-500"
                style={{
                  opacity: bridge.soulCoherence,
                  transform: `scaleY(${Math.max(bridge.soulCoherence, 0.2)})`
                }}
                title={`${bridge.essence}: ${bridge.soulCoherence.toFixed(3)}`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-4 text-xs text-gray-400">
          Collective consciousness visualization - each bar represents an active soul bridge
        </div>
      </div>
    </div>
  );
}