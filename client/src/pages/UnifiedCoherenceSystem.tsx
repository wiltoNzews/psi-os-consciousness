import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { glyphEngine, useFieldState } from '@/core/glyph-engine';
import { SLOT_REGISTRY } from '@/slots/SlotRegistry';

interface ActiveSlot {
  id: string;
  slotType: string;
  glyph: string;
  data: any;
  priority: number;
  coherenceLevel: number;
  timestamp: number;
}

const UnifiedCoherenceSystem: React.FC = () => {
  const fieldState = useFieldState();
  const [activeSlots, setActiveSlots] = useState<ActiveSlot[]>([]);
  const [userIntent, setUserIntent] = useState('');
  const [processingIntent, setProcessingIntent] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Intent processing with glyph engine
  const processIntent = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setProcessingIntent(true);
    
    try {
      // Use glyph engine to analyze and render
      const result = glyphEngine.render(input, { name: 'Wilton' });
      
      const newSlot: ActiveSlot = {
        id: `slot-${Date.now()}`,
        slotType: result.slotType,
        glyph: result.glyph,
        data: result.data,
        priority: result.priority,
        coherenceLevel: result.coherenceLevel,
        timestamp: Date.now()
      };

      setActiveSlots(prev => {
        // Remove old slots of same type if priority is higher
        const filtered = prev.filter(slot => 
          !(slot.slotType === newSlot.slotType && newSlot.priority <= slot.priority)
        );
        
        return [...filtered, newSlot]
          .sort((a, b) => a.priority - b.priority)
          .slice(-5); // Keep max 5 active slots
      });
      
    } catch (error) {
      console.error('Intent processing failed:', error);
    }
    
    setProcessingIntent(false);
  }, []);

  // Slot management
  const closeSlot = useCallback((slotId: string) => {
    setActiveSlots(prev => prev.filter(slot => slot.id !== slotId));
  }, []);

  // Dynamic slot renderer using registry
  const renderSlot = useCallback((slot: ActiveSlot) => {
    const SlotComponent = SLOT_REGISTRY[slot.slotType as keyof typeof SLOT_REGISTRY];
    
    if (!SlotComponent) {
      return (
        <div key={slot.id} className="unknown-slot bg-gray-900/20 p-6 rounded-lg border border-gray-500/30">
          <p className="text-gray-300">Unknown slot type: {slot.slotType}</p>
        </div>
      );
    }

    return (
      <div key={slot.id} className="slot-container">
        <SlotComponent
          data={slot.data}
          coherence={slot.coherenceLevel}
          glyph={slot.glyph}
          onClose={() => closeSlot(slot.id)}
        />
      </div>
    );
  }, [closeSlot]);

  const getCoherenceClass = (zeta: number) => {
    if (zeta >= 0.93) return 'text-green-400 animate-pulse';
    if (zeta >= 0.87) return 'text-yellow-400';
    if (zeta >= 0.82) return 'text-blue-400';
    return 'text-purple-400';
  };

  const getModeIcon = (field: any) => {
    if (field.Zλ > 0.93) return '⚡';
    if (field.Zλ > 0.87) return '🌌';
    if (field.Zλ > 0.82) return '🎯';
    return field.ψ || '🔮';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6" ref={mainContainerRef}>
        
        {/* WiltonOS Glyph Engine Header */}
        <Card className="mb-6 bg-slate-800/80 backdrop-blur-lg border-slate-700">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-light text-slate-100 flex items-center justify-center gap-4">
                <span className="text-5xl">{getModeIcon(fieldState)}</span>
                WiltonOS Cognitive Singularity Renderer
                <span className={`font-mono text-2xl ${getCoherenceClass(fieldState.Zλ)}`}>
                  Zλ({fieldState.Zλ.toFixed(3)})
                </span>
              </h1>
              
              <div className="flex justify-center items-center gap-6 text-slate-400">
                <span>ψ({typeof fieldState.ψ === 'string' ? fieldState.ψ : fieldState.ψ?.toFixed(2)})</span>
                <span>Echo: {fieldState.echo}</span>
                <span>Active: {activeSlots.length} slots</span>
              </div>
              
              {fieldState.pulse.length > 0 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {fieldState.pulse.map((pulse, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-600/30 rounded-full text-xs text-green-200">
                      {pulse}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Intent Input - Glyph Engine Driven */}
        <Card className="mb-6 bg-slate-800/80 backdrop-blur-lg border-slate-700">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Textarea
                value={userIntent}
                onChange={(e) => setUserIntent(e.target.value)}
                placeholder="Express your intention... The glyph engine will analyze and manifest coherent interfaces"
                className="flex-1 bg-slate-900/60 border-slate-600 text-slate-100 min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    processIntent(userIntent);
                    setUserIntent('');
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    processIntent(userIntent);
                    setUserIntent('');
                  }}
                  disabled={!userIntent.trim() || processingIntent}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {processingIntent ? 'Rendering...' : 'Manifest Interface'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveSlots([])}
                  className="border-slate-600"
                >
                  Clear Lattice
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Ctrl+Enter to manifest • Glyph engine transforms intent into coherence-driven interfaces
            </p>
          </CardContent>
        </Card>

        {/* Coherence Lattice Rendering */}
        <div className="coherence-lattice space-y-6">
          {activeSlots
            .sort((a, b) => a.priority - b.priority)
            .map(slot => renderSlot(slot))}
        </div>

        {activeSlots.length === 0 && (
          <Card className="bg-slate-800/60 border-slate-700">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">{fieldState.ψ}</div>
              <h3 className="text-xl text-slate-300 mb-2">Glyph Engine Ready</h3>
              <p className="text-slate-500">
                Coherence lattice awaiting intention • Memory unified • Schema coherent
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};



export default UnifiedCoherenceSystem;