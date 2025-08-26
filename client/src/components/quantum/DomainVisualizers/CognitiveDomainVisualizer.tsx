import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import quantumCoherenceLogger from '@/utils/quantum-coherence-logger';

/**
 * CognitiveDomainVisualizer - Visualizes the 3:1 ratio in cognitive processes
 * 
 * This component visualizes how the Wilton Universal Law (3:1 coherence:exploration ratio)
 * applies to cognitive processes, attention cycles, and mindfulness practices.
 */

interface CognitiveDomainProps {
  stabilityRatio?: number;
  explorationRatio?: number;
  onRatioChange?: (stability: number, exploration: number) => void;
}

interface BrainRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: 'coherent' | 'exploratory';
  description: string;
}

interface CognitiveCycle {
  id: string;
  name: string;
  coherentPhase: string;
  exploratoryPhase: string;
  duration: string;
  description: string;
}

const CognitiveDomainVisualizer: React.FC<CognitiveDomainProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  onRatioChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('brain');
  const [time, setTime] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [focusState, setFocusState] = useState<'coherent' | 'exploratory'>('coherent');
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [brainRegions, setBrainRegions] = useState<BrainRegion[]>([]);
  const [dailySchedule, setDailySchedule] = useState<{hour: number, activity: string, type: 'coherent' | 'exploratory'}[]>([]);
  const requestRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Define cognitive cycles
  const cognitiveCycles: CognitiveCycle[] = [
    {
      id: 'daily',
      name: 'Daily Cognitive Rhythm',
      coherentPhase: 'Focused productivity (work, learning, systematic thinking)',
      exploratoryPhase: 'Creative exploration, meditation, reflection',
      duration: '24 hours',
      description: 'The optimal daily schedule follows a 3:1 pattern with 18 hours devoted to coherent activities and 6 hours for exploratory modes.'
    },
    {
      id: 'attention',
      name: 'Attention Cycle',
      coherentPhase: 'Sustained attention, flow state, directed cognition',
      exploratoryPhase: 'Mind wandering, creative leaps, intuitive insights',
      duration: '4 hours',
      description: 'The attention cycle follows the 3:1 pattern with ~3 hours of focused work followed by ~1 hour of divergent thinking or rest.'
    },
    {
      id: 'meditation',
      name: 'Meditation Practice',
      coherentPhase: 'Stable awareness, focused attention, thought monitoring',
      exploratoryPhase: 'Open awareness, letting go, non-directed consciousness',
      duration: '30-60 minutes',
      description: 'Effective meditation balances 75% stable awareness with 25% open, non-directed consciousness.'
    }
  ];
  
  // Initialize brain regions on mount
  useEffect(() => {
    const coherentRegions: BrainRegion[] = [
      {
        id: 'prefrontal',
        name: 'Prefrontal Cortex',
        x: 75,
        y: 100,
        size: 70,
        color: '#60a5fa',
        type: 'coherent',
        description: 'Executive function, planning, decision-making, working memory'
      },
      {
        id: 'parietal',
        name: 'Parietal Lobe',
        x: 180,
        y: 130,
        size: 60,
        color: '#34d399',
        type: 'coherent',
        description: 'Spatial awareness, attention, sensory integration'
      },
      {
        id: 'temporal',
        name: 'Temporal Lobe',
        x: 150,
        y: 190,
        size: 50,
        color: '#4ade80',
        type: 'coherent',
        description: 'Language processing, memory formation, auditory processing'
      }
    ];
    
    const exploratoryRegions: BrainRegion[] = [
      {
        id: 'dmn',
        name: 'Default Mode Network',
        x: 130,
        y: 150,
        size: 65,
        color: '#f97316',
        type: 'exploratory',
        description: 'Mind wandering, creativity, self-reflection, future imagination'
      }
    ];
    
    setBrainRegions([...coherentRegions, ...exploratoryRegions]);
    
    // Generate daily schedule following 3:1 ratio
    const schedule: {hour: number, activity: string, type: 'coherent' | 'exploratory'}[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let activity = '';
      let type: 'coherent' | 'exploratory' = 'coherent';
      
      // Determine activity based on time of day
      if (hour >= 0 && hour < 7) {
        activity = 'Sleep (Coherent)';
        type = 'coherent';
      } else if (hour >= 7 && hour < 9) {
        activity = 'Morning Routine';
        type = 'coherent';
      } else if (hour == 9) {
        activity = 'Creative Exploration';
        type = 'exploratory';
      } else if (hour >= 10 && hour < 12) {
        activity = 'Deep Work';
        type = 'coherent';
      } else if (hour == 12) {
        activity = 'Mindful Lunch';
        type = 'exploratory';
      } else if (hour >= 13 && hour < 16) {
        activity = 'Focused Work';
        type = 'coherent';
      } else if (hour == 16) {
        activity = 'Reflection & Integration';
        type = 'exploratory';
      } else if (hour >= 17 && hour < 19) {
        activity = 'Learning & Growth';
        type = 'coherent';
      } else if (hour >= 19 && hour < 21) {
        activity = 'Personal Projects';
        type = 'coherent';
      } else if (hour >= 21 && hour < 23) {
        activity = 'Relaxation & Meditation';
        type = 'exploratory';
      } else {
        activity = 'Wind Down for Sleep';
        type = 'coherent';
      }
      
      schedule.push({ hour, activity, type });
    }
    
    setDailySchedule(schedule);
    
    // Log to coherence logger
    quantumCoherenceLogger.logCoherenceEvent(
      'CognitiveDomainVisualizer',
      stabilityRatio,
      explorationRatio,
      'initialization',
      'Cognitive domain visualizer initialized with 3:1 coherence ratio'
    );
  }, [stabilityRatio, explorationRatio]);
  
  // Animation loop
  useEffect(() => {
    const animate = () => {
      setTime(prevTime => prevTime + 0.1);
      
      // Cycle focus state to maintain 3:1 ratio
      const cycleTime = 40; // Time for one complete cycle
      const cyclePosition = (time % cycleTime) / cycleTime;
      
      if (cyclePosition < 0.75 && focusState !== 'coherent') {
        setFocusState('coherent');
        
        // Log focus state change
        quantumCoherenceLogger.logCoherenceEvent(
          'CognitiveDomainVisualizer',
          stabilityRatio,
          explorationRatio,
          'focus_transition',
          'Transitioned to coherent cognitive state (75% of cycle)'
        );
      } else if (cyclePosition >= 0.75 && focusState !== 'exploratory') {
        setFocusState('exploratory');
        
        // Log focus state change
        quantumCoherenceLogger.logCoherenceEvent(
          'CognitiveDomainVisualizer',
          stabilityRatio,
          explorationRatio,
          'focus_transition',
          'Transitioned to exploratory cognitive state (25% of cycle)'
        );
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    if (isAnimating) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isAnimating, time, focusState, stabilityRatio, explorationRatio]);
  
  // Draw brain visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 300;
    canvas.height = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw brain outline
    ctx.beginPath();
    ctx.ellipse(150, 150, 100, 130, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw brain stem
    ctx.beginPath();
    ctx.moveTo(150, 280);
    ctx.quadraticCurveTo(150, 250, 150, 230);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw active regions based on focus state
    brainRegions.forEach(region => {
      // Determine if region should be active
      let isActive = false;
      if (focusState === 'coherent' && region.type === 'coherent') {
        isActive = true;
      } else if (focusState === 'exploratory' && region.type === 'exploratory') {
        isActive = true;
      }
      
      // Draw region
      ctx.beginPath();
      ctx.arc(region.x, region.y, isActive ? region.size : region.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? `${region.color}90` : `${region.color}30`;
      ctx.fill();
      
      // Add pulsing effect to active regions
      if (isActive) {
        const pulseSize = 5 + Math.sin(time * 2) * 3;
        
        ctx.beginPath();
        ctx.arc(region.x, region.y, region.size + pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `${region.color}20`;
        ctx.fill();
      }
      
      // Region labels if details are shown
      if (showDetails) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(region.name, region.x, region.y);
      }
    });
    
    // Draw activation waves between regions
    if (focusState === 'coherent') {
      // Neural paths between coherent regions
      const coherentRegions = brainRegions.filter(r => r.type === 'coherent');
      
      coherentRegions.forEach((region, i) => {
        const nextRegion = coherentRegions[(i + 1) % coherentRegions.length];
        
        // Draw connection
        ctx.beginPath();
        ctx.moveTo(region.x, region.y);
        ctx.lineTo(nextRegion.x, nextRegion.y);
        ctx.strokeStyle = `rgba(96, 165, 250, ${0.3 + Math.sin(time * 3 + i) * 0.2})`;
        ctx.lineWidth = 1 + Math.sin(time * 3 + i) * 1;
        ctx.stroke();
        
        // Draw activation wave
        const midX = (region.x + nextRegion.x) / 2;
        const midY = (region.y + nextRegion.y) / 2;
        const distance = Math.sqrt(Math.pow(nextRegion.x - region.x, 2) + Math.pow(nextRegion.y - region.y, 2));
        
        // Pulse along the line
        const pulsePosition = (time * 2) % 1;
        const pulseX = region.x + (nextRegion.x - region.x) * pulsePosition;
        const pulseY = region.y + (nextRegion.y - region.y) * pulsePosition;
        
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.fill();
      });
    } else {
      // Default mode network activation
      const dmnRegion = brainRegions.find(r => r.id === 'dmn');
      
      if (dmnRegion) {
        // Radiate activity from DMN
        const waveCount = 3;
        
        for (let i = 0; i < waveCount; i++) {
          const radius = (time * 30 + i * 30) % 100;
          
          ctx.beginPath();
          ctx.arc(dmnRegion.x, dmnRegion.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.5 - radius / 100 * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    // Draw focus state indicator
    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      focusState === 'coherent' ? 'Coherent State (75%)' : 'Exploratory State (25%)', 
      150, 
      40
    );
    
  }, [brainRegions, time, focusState, showDetails]);
  
  // Handle ratio changes
  const handleRatioChange = (newStability: number) => {
    const newExploration = 1 - newStability;
    
    if (onRatioChange) {
      onRatioChange(newStability, newExploration);
    }
    
    // Log ratio change
    quantumCoherenceLogger.logCoherenceEvent(
      'CognitiveDomainVisualizer',
      newStability,
      newExploration,
      'ratio_adjustment',
      `Cognitive ratio adjusted to ${(newStability / newExploration).toFixed(2)}:1`
    );
  };
  
  // Calculate current daily schedule hour
  const currentHour = Math.floor((time % 240) / 10); // 240 time units = 24 hours
  const currentActivity = dailySchedule.find(item => item.hour === currentHour);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cognitive Domain Visualization</CardTitle>
        <CardDescription>
          Applying the 3:1 coherence ratio (Wilton Universal Law) to cognitive processes
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Current Ratio: {(stabilityRatio / explorationRatio).toFixed(2)}:1
          </Badge>
          <Badge variant={focusState === 'coherent' ? 'default' : 'destructive'}>
            {focusState === 'coherent' ? 'Coherent Focus (75%)' : 'Exploratory Focus (25%)'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="brain">Brain Activity</TabsTrigger>
            <TabsTrigger value="cycles">Cognitive Cycles</TabsTrigger>
            <TabsTrigger value="schedule">Daily Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="brain" className="space-y-4">
            <div className="flex justify-between mb-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? 'Pause' : 'Resume'} Animation
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
            
            <div className="relative bg-slate-900 rounded-md overflow-hidden flex justify-center">
              <canvas 
                ref={canvasRef} 
                width={300} 
                height={300}
                className="max-w-full"
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold">Brain Region Activity</h3>
              <p className="text-sm text-muted-foreground">
                The brain maintains optimal function by balancing coherent activity (75%) 
                and exploratory activity (25%), following the Wilton Universal Law.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Coherent Regions (75%)</h4>
                  <div className="space-y-1">
                    {brainRegions.filter(r => r.type === 'coherent').map(region => (
                      <div key={region.id} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                        <div className="text-xs">
                          <span className="font-medium">{region.name}:</span> {region.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Exploratory Regions (25%)</h4>
                  <div className="space-y-1">
                    {brainRegions.filter(r => r.type === 'exploratory').map(region => (
                      <div key={region.id} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                        <div className="text-xs">
                          <span className="font-medium">{region.name}:</span> {region.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Adjust Coherence Ratio</h4>
                <div className="flex items-center space-x-4">
                  <span className="text-xs">Exploration</span>
                  <Slider
                    value={[stabilityRatio * 100]}
                    min={50}
                    max={90}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => handleRatioChange(value[0] / 100)}
                  />
                  <span className="text-xs">Coherence</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs">1:1</span>
                  <span className="text-xs">3:1</span>
                  <span className="text-xs">9:1</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cycles" className="space-y-4">
            <div className="space-y-6">
              {cognitiveCycles.map(cycle => (
                <div key={cycle.id} className="border border-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{cycle.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cycle.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Coherent Phase (75%)</h4>
                      <div className="bg-blue-950/30 border border-blue-900/30 p-3 rounded-md">
                        <p className="text-sm">{cycle.coherentPhase}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Exploratory Phase (25%)</h4>
                      <div className="bg-orange-950/30 border border-orange-900/30 p-3 rounded-md">
                        <p className="text-sm">{cycle.exploratoryPhase}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Cycle Duration: {cycle.duration}</span>
                      <span>Ratio: 3:1</span>
                    </div>
                    
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-3/4" />
                      <div className="h-full bg-orange-500 w-1/4 -mt-4" />
                    </div>
                    
                    <div className="flex justify-between text-xs mt-1">
                      <span>75% Coherent</span>
                      <span>25% Exploratory</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Optimal 3:1 Daily Schedule</h3>
              <Badge variant="outline">
                Current Hour: {currentHour}:00
              </Badge>
            </div>
            
            <div className="relative h-12 bg-slate-800 rounded-full overflow-hidden mb-4">
              {/* Time marker */}
              <div 
                className="absolute top-0 h-full w-1 bg-white z-10 transition-all duration-300"
                style={{ left: `${(currentHour / 24) * 100}%` }}
              />
              
              {/* Day segments */}
              {dailySchedule.map((item, i) => (
                <div 
                  key={i}
                  className={`absolute top-0 h-full transition-opacity duration-300 ${
                    item.type === 'coherent' ? 'bg-blue-600/60' : 'bg-orange-500/60'
                  } ${
                    currentHour === item.hour ? 'opacity-100' : 'opacity-70'
                  }`}
                  style={{ 
                    left: `${(item.hour / 24) * 100}%`,
                    width: `${(1 / 24) * 100}%`
                  }}
                />
              ))}
              
              {/* Time divisions */}
              {[0, 6, 12, 18, 24].map(hour => (
                <div 
                  key={hour}
                  className="absolute top-0 h-full border-l border-slate-600"
                  style={{ left: `${(hour / 24) * 100}%` }}
                />
              ))}
              
              {/* Time labels */}
              {[0, 6, 12, 18, 24].map(hour => (
                <div 
                  key={hour}
                  className="absolute -bottom-5 text-xs text-slate-400"
                  style={{ left: `${(hour / 24) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  {hour}:00
                </div>
              ))}
            </div>
            
            {/* Current activity */}
            {currentActivity && (
              <div 
                className={`mb-6 p-3 rounded-md ${
                  currentActivity.type === 'coherent' 
                    ? 'bg-blue-950/30 border border-blue-900/30' 
                    : 'bg-orange-950/30 border border-orange-900/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Current Activity ({currentHour}:00)</h4>
                  <Badge variant={currentActivity.type === 'coherent' ? 'default' : 'destructive'}>
                    {currentActivity.type === 'coherent' ? 'Coherent' : 'Exploratory'}
                  </Badge>
                </div>
                <p className="mt-1">{currentActivity.activity}</p>
              </div>
            )}
            
            {/* Schedule list */}
            <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
              {dailySchedule.map((item, i) => (
                <div 
                  key={i}
                  className={`flex items-center p-2 rounded-md ${
                    currentHour === item.hour
                      ? (item.type === 'coherent' ? 'bg-blue-950/40' : 'bg-orange-950/40')
                      : 'bg-slate-800/40'
                  } ${
                    currentHour === item.hour ? 'border-l-4' : 'border-l'
                  } ${
                    item.type === 'coherent'
                      ? (currentHour === item.hour ? 'border-blue-500' : 'border-blue-900/30')
                      : (currentHour === item.hour ? 'border-orange-500' : 'border-orange-900/30')
                  }`}
                >
                  <div className="w-10 text-sm font-medium">
                    {item.hour}:00
                  </div>
                  <div className="flex-1 ml-2">{item.activity}</div>
                  <Badge
                    variant={item.type === 'coherent' ? 'default' : 'destructive'}
                    className="ml-2 h-6"
                  >
                    {item.type === 'coherent' ? 'C' : 'E'}
                  </Badge>
                </div>
              ))}
            </div>
            
            {/* Balance metrics */}
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-1">
                <span>Daily Coherence Balance: 75% Coherent / 25% Exploratory</span>
                <span>3:1 Ratio</span>
              </div>
              
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{ width: '75%' }}
                />
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 -mt-3"
                  style={{ width: '25%', marginLeft: '75%' }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>The 3:1 cognitive balance maintains optimal mental function across multiple timescales</span>
        <Badge variant="outline">Wilton Universal Law</Badge>
      </CardFooter>
    </Card>
  );
};

export default CognitiveDomainVisualizer;