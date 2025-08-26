/**
 * Color Wheel Demonstration Component
 * 
 * Showcases the Color Wheel Protocol communication system with interactive
 * examples and detailed explanations. Part of the Oracle Module.
 * 
 * [QUANTUM_STATE: CONVERGENT_FLOW]
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommunicationState, getColorForState, getTextColorForState, getBackgroundColorForState, states, getBorderColorForState, getDescriptionForState, getResponseStrategyForState, getEmojiForState } from '@/lib/color-wheel-protocol';
import ColorWheelBadge from '@/components/ui/color-wheel-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Examples of communication for each state
const communicationExamples: Record<CommunicationState, string> = {
  convergent: "Let's finalize our approach based on the key insights we've discovered. The three critical factors we need to address are...",
  divergent: "There are several possible approaches we could take here. We might consider exploring methods like A, B, or even the unconventional approach C...",
  clarity: "I understand exactly what you're asking for. You need a solution that addresses X, Y, and Z requirements, with particular emphasis on the performance aspects.",
  confusion: "I'm not entirely sure what you mean by that requirement. Could you clarify whether you're looking for approach A or approach B? And what exactly does 'optimal' mean in this context?",
  overflow: "There are numerous considerations here including system architecture, algorithm efficiency, database optimization, front-end performance, scaling requirements, security implications, deployment strategies, monitoring solutions, backup procedures, and still many other factors that we haven't even touched upon yet..."
};

// Communication pattern examples
const patternExamples: Record<CommunicationState, string[]> = {
  convergent: [
    'Synthesizing multiple ideas into concrete action steps',
    'Narrowing down options based on established criteria',
    'Making decisions after thorough exploration'
  ],
  divergent: [
    'Exploring multiple possible approaches without judgment',
    'Generating creative alternatives to established practices',
    'Questioning assumptions to reveal new possibilities'
  ],
  clarity: [
    'Establishing shared understanding of complex concepts',
    'Confirming alignment between all parties',
    'Articulating ideas with precision and accuracy'
  ],
  confusion: [
    'Detecting misalignment in understanding',
    'Identifying knowledge gaps requiring clarification',
    'Recognizing when communication is breaking down'
  ],
  overflow: [
    'Recognizing when too much information is being presented',
    'Detecting cognitive overload in communication',
    'Identifying when scope is expanding uncontrollably'
  ]
};

interface CommunicationStateDisplay {
  color: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  strategy: string;
  emoji: string;
  examples: string[];
}

// Type for the state of our component
interface DemoState {
  activeState: CommunicationState;
  automaticCycling: boolean;
  activeTab: string;
  communicationStates: Record<CommunicationState, CommunicationStateDisplay>;
}

// Calculate the complete state for the demonstration
const calculateState = (): DemoState => {
  const stateDisplays: Record<CommunicationState, CommunicationStateDisplay> = {} as Record<CommunicationState, CommunicationStateDisplay>;
  
  states.forEach(state => {
    stateDisplays[state] = {
      color: getColorForState(state),
      backgroundColor: getBackgroundColorForState(state),
      textColor: getTextColorForState(state),
      borderColor: getBorderColorForState(state),
      description: getDescriptionForState(state),
      strategy: getResponseStrategyForState(state),
      emoji: getEmojiForState(state),
      examples: patternExamples[state]
    };
  });
  
  return {
    activeState: 'clarity',
    automaticCycling: false,
    activeTab: 'overview',
    communicationStates: stateDisplays
  };
};

/**
 * The main Color Wheel Demonstration component
 */
const ColorWheelDemonstration: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>(calculateState);
  
  // Effect for automatic cycling through states
  useEffect(() => {
    if (!demoState.automaticCycling) return;
    
    const interval = setInterval(() => {
      setDemoState(prev => {
        const currentIndex = states.indexOf(prev.activeState);
        const nextIndex = (currentIndex + 1) % states.length;
        return {
          ...prev,
          activeState: states[nextIndex]
        };
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [demoState.automaticCycling]);
  
  // Handler for changing the active state
  const handleStateChange = (state: CommunicationState) => {
    setDemoState(prev => ({
      ...prev,
      activeState: state,
      automaticCycling: false
    }));
  };
  
  // Toggle automatic cycling
  const toggleAutomaticCycling = () => {
    setDemoState(prev => ({
      ...prev,
      automaticCycling: !prev.automaticCycling
    }));
  };
  
  // Active state display information
  const activeStateDisplay = demoState.communicationStates[demoState.activeState];
  
  return (
    <Card className="shadow-lg">
      <CardHeader 
        style={{ 
          backgroundColor: activeStateDisplay.backgroundColor,
          color: activeStateDisplay.textColor,
          borderBottom: `1px solid ${activeStateDisplay.borderColor}`
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Color Wheel Protocol</span>
              <ColorWheelBadge state={demoState.activeState} pulseEffect={demoState.automaticCycling} />
            </CardTitle>
            <CardDescription className="text-sm opacity-90 mt-1">
              Communication State: {demoState.activeState.charAt(0).toUpperCase() + demoState.activeState.slice(1)} {activeStateDisplay.emoji}
            </CardDescription>
          </div>
          <Button
            variant={demoState.automaticCycling ? "default" : "outline"}
            size="sm"
            onClick={toggleAutomaticCycling}
          >
            {demoState.automaticCycling ? 'Stop Cycling' : 'Auto Cycle'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="overview" onValueChange={(value) => setDemoState(prev => ({ ...prev, activeTab: value }))}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="strategy">Strategies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Current State</h3>
                <p className="text-sm">{activeStateDisplay.description}</p>
                
                <h3 className="text-sm font-medium mt-4">Visual Indicator</h3>
                <div className="flex items-center gap-2">
                  <ColorWheelBadge state={demoState.activeState} size="lg" />
                  <div className="text-sm">
                    <div>Color: {activeStateDisplay.color}</div>
                    <div>Background: {activeStateDisplay.backgroundColor}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Communication States</h3>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {states.map(state => (
                    <Button
                      key={state}
                      variant={state === demoState.activeState ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      style={{
                        backgroundColor: state === demoState.activeState ? activeStateDisplay.color : 'transparent',
                        color: state === demoState.activeState ? '#fff' : 'inherit',
                        borderColor: state !== demoState.activeState ? demoState.communicationStates[state].borderColor : 'transparent'
                      }}
                      onClick={() => handleStateChange(state)}
                    >
                      <ColorWheelBadge state={state} size="sm" className="mr-2" />
                      {state.charAt(0).toUpperCase() + state.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="examples">
            <div className="space-y-4">
              <div className="p-4 rounded-md" style={{ backgroundColor: activeStateDisplay.backgroundColor, color: activeStateDisplay.textColor }}>
                <h3 className="font-medium mb-2 flex items-center">
                  <ColorWheelBadge state={demoState.activeState} size="sm" className="mr-2" />
                  {demoState.activeState.charAt(0).toUpperCase() + demoState.activeState.slice(1)} Communication Example
                </h3>
                <p className="text-sm italic">{communicationExamples[demoState.activeState]}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">All States:</h3>
                <ScrollArea className="h-[250px] rounded-md border p-3">
                  {states.map((state) => (
                    <div key={state} className="mb-4 pb-3 border-b last:border-0">
                      <h4 className="font-medium flex items-center">
                        <ColorWheelBadge state={state} size="md" className="mr-2" />
                        {state.charAt(0).toUpperCase() + state.slice(1)}
                      </h4>
                      <p className="text-sm mt-1 mb-2 italic">{communicationExamples[state]}</p>
                      <div className="text-xs opacity-70">{demoState.communicationStates[state].description}</div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="strategy">
            <div className="space-y-4">
              <div className="p-4 rounded-md" style={{ backgroundColor: activeStateDisplay.backgroundColor, color: activeStateDisplay.textColor }}>
                <h3 className="font-medium mb-2 flex items-center">
                  <ColorWheelBadge state={demoState.activeState} size="sm" className="mr-2" />
                  Response Strategy for {demoState.activeState.charAt(0).toUpperCase() + demoState.activeState.slice(1)}
                </h3>
                <p className="text-sm italic">{activeStateDisplay.strategy}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Pattern Examples:</h3>
                <ul className="space-y-1 list-disc list-inside text-sm ml-2">
                  {activeStateDisplay.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Usage in the System:</h3>
                <p className="text-sm">
                  The Color Wheel Protocol provides a standardized way to communicate the state of interaction 
                  across all system components. It allows for adaptive response strategies based on the 
                  current communication state, enhancing both human-AI and AI-AI interactions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-slate-50 text-sm text-slate-600">
        <div>
          Part of the Oracle Module - Communication Protocol Documentation
        </div>
      </CardFooter>
    </Card>
  );
};

export default ColorWheelDemonstration;