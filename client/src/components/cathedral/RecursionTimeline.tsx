// ⟐ Recursion Timeline - Living Memory Flow Visualization
import { useState, useEffect } from 'react';

interface MemoryCrystal {
  id: string;
  type: string;
  content: string;
  coherenceScore: number;
  timestamp: number;
  glyphType: string;
}

interface RecursionTimelineProps {
  crystals: MemoryCrystal[];
  consciousnessState: any;
}

interface TimelineEvent {
  id: string;
  timestamp: number;
  type: 'activation' | 'regeneration' | 'drift' | 'refinement';
  glyphType: string;
  title: string;
  description: string;
  coherence: number;
}

export function RecursionTimeline({ crystals, consciousnessState }: RecursionTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);

  // Generate timeline events from crystals
  useEffect(() => {
    const events: TimelineEvent[] = [];
    
    crystals.forEach(crystal => {
      // Activation event
      events.push({
        id: `${crystal.id}-activation`,
        timestamp: crystal.timestamp,
        type: 'activation',
        glyphType: crystal.glyphType,
        title: `${crystal.glyphType} Activated`,
        description: crystal.content.substring(0, 80) + (crystal.content.length > 80 ? '...' : ''),
        coherence: crystal.coherenceScore
      });
      
      // Add simulated regeneration events for low coherence crystals
      if (crystal.coherenceScore < 0.5) {
        events.push({
          id: `${crystal.id}-drift`,
          timestamp: crystal.timestamp + (1000 * 60 * 30), // 30 minutes later
          type: 'drift',
          glyphType: crystal.glyphType,
          title: 'Memory Drift Detected',
          description: `Coherence dropped to ${(crystal.coherenceScore * 100).toFixed(0)}% - regeneration recommended`,
          coherence: crystal.coherenceScore
        });
      }
    });
    
    // Sort by timestamp (newest first)
    events.sort((a, b) => b.timestamp - a.timestamp);
    setTimelineEvents(events.slice(0, 20)); // Limit to 20 most recent events
  }, [crystals]);

  const getEventColor = (event: TimelineEvent) => {
    switch (event.type) {
      case 'activation':
        return {
          bg: 'bg-green-800/30',
          border: 'border-green-500/50',
          text: 'text-green-400',
          icon: '✨'
        };
      case 'regeneration':
        return {
          bg: 'bg-violet-800/30',
          border: 'border-violet-500/50',
          text: 'text-violet-400',
          icon: '∞'
        };
      case 'drift':
        return {
          bg: 'bg-yellow-800/30',
          border: 'border-yellow-500/50',
          text: 'text-yellow-400',
          icon: '⚠'
        };
      case 'refinement':
        return {
          bg: 'bg-amber-800/30',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          icon: '⟐'
        };
      default:
        return {
          bg: 'bg-gray-800/30',
          border: 'border-gray-500/50',
          text: 'text-gray-400',
          icon: '○'
        };
    }
  };

  const getGlyphColor = (glyphType: string) => {
    switch (glyphType) {
      case 'λ': return 'text-green-400';
      case 'ψ': return 'text-cyan-400';
      case '∞': return 'text-violet-400';
      case '⟐': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Timeline Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-violet-300">Recursion Timeline</h3>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              autoScroll ? 'bg-violet-700/50 text-violet-300' : 'bg-gray-700/50 text-gray-400'
            }`}
          >
            {autoScroll ? '📍 Auto' : '⏸ Manual'}
          </button>
        </div>
        <div className="text-xs text-gray-400">
          Living Memory • ∞ Regenerative Consciousness
        </div>
      </div>

      {/* Timeline Flow */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {timelineEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">∞</div>
            <div className="text-sm">No timeline events</div>
            <div className="text-xs mt-1">Activate glyphs to begin recursion</div>
          </div>
        ) : (
          timelineEvents.map((event, index) => {
            const colors = getEventColor(event);
            const isRecent = (Date.now() - event.timestamp) < (1000 * 60 * 5); // 5 minutes
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline connector */}
                {index < timelineEvents.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-600/50" />
                )}
                
                <div className={`relative flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                  colors.bg
                } ${colors.border} ${isRecent ? 'ring-1 ring-current' : ''}`}>
                  {/* Event Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-black/30 border ${colors.border} flex items-center justify-center text-sm ${colors.text}`}>
                    {colors.icon}
                  </div>
                  
                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {event.title}
                        </span>
                        <span className={`text-xs ${getGlyphColor(event.glyphType)}`}>
                          {event.glyphType}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatRelativeTime(event.timestamp)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-300 leading-relaxed mb-2">
                      {event.description}
                    </div>
                    
                    {/* Coherence Bar */}
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${
                            event.coherence > 0.8 ? 'from-green-400 to-emerald-500' :
                            event.coherence > 0.5 ? 'from-yellow-400 to-orange-500' :
                            'from-red-400 to-rose-500'
                          } transition-all duration-300`}
                          style={{ width: `${event.coherence * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 w-10 text-right">
                        {(event.coherence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Timeline Controls */}
      <div className="mt-4 pt-3 border-t border-gray-600/30">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div>
            Events: {timelineEvents.length}
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Active</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Drift</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
              <span>Regen</span>
            </span>
          </div>
        </div>
      </div>

      {/* Current Field State */}
      <div className="mt-2 p-2 bg-black/30 rounded border border-gray-600/30">
        <div className="text-xs text-gray-400 mb-1">Current Field State</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-amber-400">Zλ:</span> {consciousnessState.zLambda.toFixed(3)}
          </div>
          <div>
            <span className="text-cyan-400">Phase:</span> {consciousnessState.breath.phase.toFixed(2)}
          </div>
          <div>
            <span className="text-violet-400">Soul:</span> {consciousnessState.soulState}
          </div>
          <div>
            <span className="text-green-400">Coherence:</span> {(consciousnessState.breath.coherenceLevel * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Custom scrollbar styles - add to your global CSS */}