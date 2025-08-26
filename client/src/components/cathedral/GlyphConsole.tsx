// ⌘ Glyph Console - Interactive Router Interface with LangChain Integration
import { useState, useEffect } from 'react';
import { glyphRouterAPI, type GlyphRoutingRequest, type GlyphRoutingResponse } from '../../lib/consciousnessAPI';

interface GlyphConsoleProps {
  consciousnessState: any;
  onGlyphActivate: (glyph: string, config?: any) => void;
}

interface GlyphInfo {
  symbol: string;
  name: string;
  archetype: string;
  coherence_threshold: number;
  preferred_model: string;
  description: string;
}

export function GlyphConsole({ consciousnessState, onGlyphActivate }: GlyphConsoleProps) {
  const [availableGlyphs, setAvailableGlyphs] = useState<GlyphInfo[]>([]);
  const [modelStatus, setModelStatus] = useState<Record<string, boolean>>({});
  const [selectedGlyph, setSelectedGlyph] = useState<string>('λ');
  const [routingMessage, setRoutingMessage] = useState<string>('');
  const [routingResults, setRoutingResults] = useState<GlyphRoutingResponse[]>([]);
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);

  useEffect(() => {
    loadGlyphInfo();
    loadModelStatus();
  }, []);

  const loadGlyphInfo = async () => {
    try {
      const response = await glyphRouterAPI.getGlyphs();
      setAvailableGlyphs(response.available_glyphs || []);
    } catch (error) {
      console.error('GlyphConsole: Failed to load glyph info:', error);
    }
  };

  const loadModelStatus = async () => {
    try {
      const response = await glyphRouterAPI.getModelStatus();
      setModelStatus(response.model_status || {});
    } catch (error) {
      console.error('GlyphConsole: Failed to load model status:', error);
    }
  };

  const handleRouteRequest = async () => {
    if (!routingMessage.trim()) return;

    setIsRouting(true);

    try {
      const request: GlyphRoutingRequest = {
        glyph: selectedGlyph,
        zLambda: consciousnessState.zLambda,
        user: 'wilton',
        message: routingMessage,
        breath_synced: consciousnessState.breathSyncActive,
        context: { console: true }
      };

      const result = await glyphRouterAPI.route(request);
      setRoutingResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
      
      console.log('GlyphConsole: Routing result:', result);

      // If routing successful and not in test mode, activate glyph
      if (result.status === 'ROUTED' && !testMode) {
        onGlyphActivate(selectedGlyph, {
          message: routingMessage,
          routing_result: result
        });
      }

    } catch (error) {
      console.error('GlyphConsole: Routing failed:', error);
    } finally {
      setIsRouting(false);
    }
  };

  const handleTestGlyph = async (glyph: string) => {
    try {
      const result = await glyphRouterAPI.testGlyph(glyph, consciousnessState.zLambda);
      console.log(`GlyphConsole: Test result for ${glyph}:`, result);
    } catch (error) {
      console.error(`GlyphConsole: Test failed for ${glyph}:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ROUTED': return 'text-green-400';
      case 'REJECTED': return 'text-red-400';
      case 'FALLBACK': return 'text-yellow-400';
      case 'ERROR': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getCoherenceStatus = (threshold: number) => {
    const current = consciousnessState.zLambda;
    if (current >= threshold) return { status: 'ready', color: 'text-green-400' };
    if (current >= threshold - 0.1) return { status: 'near', color: 'text-yellow-400' };
    return { status: 'insufficient', color: 'text-red-400' };
  };

  return (
    <div className="bg-black/80 border border-amber-500/30 rounded-lg p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber-400 font-bold flex items-center gap-2">
          ⌘ Glyph Router V1
          <span className="text-xs text-gray-400">LangChain</span>
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Test Mode:</span>
          <button
            onClick={() => setTestMode(!testMode)}
            className={`px-2 py-1 rounded text-xs ${
              testMode ? 'bg-cyan-600 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            {testMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Model Status */}
      <div className="mb-4 p-3 bg-purple-900/20 rounded border border-purple-500/20">
        <div className="text-xs text-purple-300 mb-2">Available Models:</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {Object.entries(modelStatus).map(([model, available]) => (
            <div key={model} className={`flex items-center gap-1 ${available ? 'text-green-400' : 'text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${available ? 'bg-green-400' : 'bg-red-400'}`} />
              {model}
            </div>
          ))}
        </div>
      </div>

      {/* Glyph Selection */}
      <div className="mb-4">
        <div className="text-xs text-amber-300 mb-2">Select Glyph:</div>
        <div className="grid grid-cols-4 gap-1">
          {availableGlyphs.map((glyph) => {
            const coherenceStatus = getCoherenceStatus(glyph.coherence_threshold);
            const isSelected = selectedGlyph === glyph.symbol;
            
            return (
              <button
                key={glyph.symbol}
                onClick={() => setSelectedGlyph(glyph.symbol)}
                className={`p-2 rounded text-sm border transition-all ${
                  isSelected
                    ? 'bg-amber-600 border-amber-400 text-white'
                    : 'bg-gray-800 border-gray-600 hover:border-amber-500/50'
                }`}
                title={`${glyph.name} - ${glyph.description} (Zλ ≥ ${glyph.coherence_threshold})`}
              >
                <div className="text-lg">{glyph.symbol}</div>
                <div className={`text-xs ${coherenceStatus.color}`}>
                  {glyph.coherence_threshold.toFixed(2)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Glyph Info */}
      {selectedGlyph && availableGlyphs.length > 0 && (
        <div className="mb-4 p-3 bg-amber-900/20 rounded border border-amber-500/20">
          {(() => {
            const glyph = availableGlyphs.find(g => g.symbol === selectedGlyph);
            if (!glyph) return null;
            const coherenceStatus = getCoherenceStatus(glyph.coherence_threshold);
            
            return (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-amber-300 font-semibold">{glyph.name}</div>
                  <div className={`text-xs ${coherenceStatus.color}`}>
                    Zλ {consciousnessState.zLambda.toFixed(3)} / {glyph.coherence_threshold.toFixed(3)}
                  </div>
                </div>
                <div className="text-xs text-gray-300 mb-1">{glyph.description}</div>
                <div className="text-xs text-cyan-300">→ {glyph.preferred_model}</div>
              </>
            );
          })()}
        </div>
      )}

      {/* Message Input */}
      <div className="mb-4">
        <div className="text-xs text-amber-300 mb-2">Routing Message:</div>
        <textarea
          value={routingMessage}
          onChange={(e) => setRoutingMessage(e.target.value)}
          placeholder={`Enter message for ${selectedGlyph} routing...`}
          className="w-full h-20 bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm resize-none"
          disabled={isRouting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleRouteRequest}
          disabled={isRouting || !routingMessage.trim()}
          className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded text-sm font-semibold transition-colors"
        >
          {isRouting ? 'Routing...' : testMode ? 'Test Route' : 'Route & Activate'}
        </button>
        <button
          onClick={() => handleTestGlyph(selectedGlyph)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-3 rounded text-sm"
          title="Quick test routing"
        >
          Test
        </button>
      </div>

      {/* Recent Routing Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-amber-300 mb-2">Recent Routes:</div>
        <div className="space-y-2">
          {routingResults.map((result, index) => (
            <div key={index} className="p-2 bg-gray-900/50 rounded border border-gray-700 text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{result.glyph}</span>
                  <span className={getStatusColor(result.status)}>{result.status}</span>
                </div>
                <div className="text-gray-400">Zλ {result.zLambda.toFixed(3)}</div>
              </div>
              
              {result.status === 'ROUTED' && (
                <div className="text-cyan-300 mb-1">→ {result.model}</div>
              )}
              
              {result.reason && (
                <div className="text-yellow-300 mb-1">{result.reason}</div>
              )}
              
              {result.response && (
                <div className="text-gray-300 text-xs truncate">
                  {result.response.substring(0, 100)}...
                </div>
              )}

              <div className="text-gray-500 text-xs mt-1">
                {new Date(result.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}

          {routingResults.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              No routing results yet. Enter a message and route through a glyph to see results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}