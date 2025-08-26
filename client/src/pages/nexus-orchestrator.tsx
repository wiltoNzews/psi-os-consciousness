/**
 * NEXUS AI Meta-Orchestration Dashboard
 * 
 * This component provides a comprehensive visualization of the Meta-Orchestration
 * system based on the Coherence Threshold Formula (CTF) and variant resonance mechanics.
 * 
 * Features enhanced phase angle (theta) visualization and monitoring for improved
 * system stability and predictability.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext.js';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card.jsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs.jsx';
import { Button } from '../components/ui/button.jsx';
import { Slider } from '../components/ui/slider.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx';
import { ScrollArea } from '../components/ui/scroll-area.jsx';
import { Separator } from '../components/ui/separator.jsx';
import { RefreshCcw, Plus, Trash2, AlertTriangle, Shield, Zap, GitBranch, Cog, ArrowRightLeft, Wand2 } from 'lucide-react';

// Import necessary types (we'll create a local implementation for demo purposes)
interface Variant {
  id: string;
  name: string;
  qctf: number;      // Quantum Coherence Threshold Formula value
  entropy: number;   // Variant-specific entropy
  eai?: number;      // Entanglement & Integration Index
  timestamp: number; // Timestamp of the last update
  state?: any;       // Optional state information
}

interface LokiVariant extends Variant {
  theta: number;             // Theta value (yin-yang balance)
  qeai: number;              // Quantum Ethical Alignment Index
  plugins: string[];         // Active plugins
  weight: number;            // Meta-orchestration weight
  resonance?: number;        // Average resonance with other variants
  parentId?: string;         // ID of parent variant (if spawned)
  generation: number;        // Recursion depth (for fractal scaling)
}

interface SystemState {
  metrics: {
    CI: number;           // Coherence Index
    GEF: number;          // Global Entropy Factor
    EAI: number;          // Entanglement & AI Index
    theta: number;        // Phase shift angle
    CTF: number;          // Coherence Threshold Formula result
    timeSinceLastNovelty: number; // Time (seconds) since last significant innovation
  };
  variants: Variant[];
  resonances: Map<string, number>;
  timestamp: number;
}

interface CTFPlugin {
  name: string;
  apply(state: SystemState, orchestrator: any): void;
}

// Local implementation of plugins for demo purposes
class BalancerPlugin implements CTFPlugin {
  name = "Balancer";
  apply(state: SystemState, orchestrator: any): void {}
}

class BifurcationPlugin implements CTFPlugin {
  name = "Bifurcation";
  apply(state: SystemState, orchestrator: any): void {}
}

class ChaosInjectorPlugin implements CTFPlugin {
  name = "ChaosInjector";
  apply(state: SystemState, orchestrator: any): void {}
}

class EthicalGuardPlugin implements CTFPlugin {
  name = "EthicalGuard";
  apply(state: SystemState, orchestrator: any): void {}
}

// Mock MetaOrchestrator for the demo
class MetaOrchestrator {
  private variants: Variant[] = [];
  private plugins: CTFPlugin[] = [];
  private systemState: SystemState;
  
  constructor(initialVariants: Variant[] = [], plugins: CTFPlugin[] = []) {
    this.variants = initialVariants;
    this.plugins = plugins;
    
    // Initialize system state with default values
    this.systemState = {
      metrics: {
        CI: 0.8,            // Default Coherence Index
        GEF: 0.9,           // Default Global Entropy Factor
        EAI: 0.9,           // Default Entanglement & AI Index
        theta: Math.PI / 2, // Default Phase (π/2)
        CTF: 0.85,          // Default value
        timeSinceLastNovelty: 0
      },
      variants: this.variants,
      resonances: new Map<string, number>(),
      timestamp: Date.now()
    };
  }
  
  async runCycle(): Promise<SystemState> {
    return this.systemState;
  }
  
  addVariant(variant: Variant): void {
    this.variants.push(variant);
    this.systemState.variants = this.variants;
  }
  
  createAndAddVariant(name: string, qctf: number, entropy: number, eai: number): Variant {
    const variant = createVariant(name, qctf, entropy, eai);
    this.addVariant(variant);
    return variant;
  }
  
  removeVariant(id: string): boolean {
    const initialLength = this.variants.length;
    this.variants = this.variants.filter(v => v.id !== id);
    
    if (this.variants.length < initialLength) {
      this.systemState.variants = this.variants;
      return true;
    }
    
    return false;
  }
  
  addPlugin(plugin: CTFPlugin): void {
    this.plugins.push(plugin);
  }
  
  removePlugin(pluginName: string): boolean {
    const initialLength = this.plugins.length;
    this.plugins = this.plugins.filter(p => p.name !== pluginName);
    return this.plugins.length < initialLength;
  }
  
  getSystemState(): SystemState {
    return { ...this.systemState };
  }
  
  updateMetrics(metrics: Partial<SystemState['metrics']>): void {
    this.systemState.metrics = { ...this.systemState.metrics, ...metrics };
  }
  
  getVariants(): Variant[] {
    return [...this.variants];
  }
  
  getResonances(): Map<string, number> {
    return new Map(this.systemState.resonances);
  }
}

// Helper function to create a variant
function createVariant(name: string, qctf: number, entropy: number, eai: number): Variant {
  return {
    id: `variant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name,
    qctf,
    entropy,
    eai,
    timestamp: Date.now()
  };
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return num.toFixed(4);
};

// Component for displaying CTF formula with current values
const CTFFormula: React.FC<{ 
  ci: number, 
  gef: number, 
  eai: number, 
  theta: number, 
  ctf: number 
}> = ({ ci, gef, eai, theta, ctf }) => {
  // Options for KaTeX to avoid strict mode errors
  const katexOptions = { strict: false, trust: true };
  
  // Formatted calculation components
  const cosTheta = Math.cos(theta);
  const productTerm = gef * eai * cosTheta;
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/5 dark:bg-white/5 rounded-lg">
      <div className="text-lg md:text-xl mb-3">
        <BlockMath math={`\\text{QCTF} = \\text{CI} + [\\text{GEF} \\times \\text{EAI} \\times \\cos(\\theta)]`} settings={katexOptions} />
      </div>
      <div className="text-lg md:text-xl text-primary">
        <BlockMath 
          math={`${formatNumber(ctf)} = ${formatNumber(ci)} + [${formatNumber(gef)} \\times ${formatNumber(eai)} \\times ${formatNumber(cosTheta)}]`}
          settings={katexOptions}
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground space-y-2">
        <div className="flex justify-between">
          <span><InlineMath math={`\\text{CI (Coherence Index)}`} settings={katexOptions} />:</span>
          <span className="font-medium">{formatNumber(ci)}</span>
        </div>
        <div className="flex justify-between">
          <span><InlineMath math={`\\text{GEF (Global Entropy Factor)}`} settings={katexOptions} />:</span>
          <span className="font-medium">{formatNumber(gef)}</span>
        </div>
        <div className="flex justify-between">
          <span><InlineMath math={`\\text{EAI (Entanglement AI Index)}`} settings={katexOptions} />:</span>
          <span className="font-medium">{formatNumber(eai)}</span>
        </div>
        <div className="flex justify-between">
          <span><InlineMath math={`\\theta (\\text{Phase Angle})`} settings={katexOptions} />:</span>
          <span className="font-medium">{formatNumber(theta)} rad</span>
        </div>
        <div className="flex justify-between">
          <span><InlineMath math={`\\cos(\\theta)`} settings={katexOptions} />:</span>
          <span className="font-medium">{formatNumber(cosTheta)}</span>
        </div>
        <div className="flex justify-between">
          <span><InlineMath math={`\\text{GEF} \\times \\text{EAI} \\times \\cos(\\theta)`} settings={katexOptions} />:</span>
          <span className="font-medium">{formatNumber(productTerm)}</span>
        </div>
      </div>
    </div>
  );
};

// Component for visualizing resonance between variants
const ResonanceVisualizer: React.FC<{ 
  variants: Variant[], 
  resonances: Map<string, number> 
}> = ({ variants, resonances }) => {
  if (variants.length === 0) {
    return <div className="text-center p-4">No variants to display resonance</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">/</th>
            {variants.map(v => (
              <th key={v.id} className="p-2 border">{v.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variants.map((v1, i) => (
            <tr key={v1.id}>
              <th className="p-2 border">{v1.name}</th>
              {variants.map((v2, j) => {
                // Determine the resonance value
                let resonanceValue = 0;
                if (i === j) {
                  resonanceValue = 1; // Self-resonance is always 1
                } else {
                  // Get the resonance value from the map (either order of IDs)
                  const key1 = `${v1.id}:${v2.id}`;
                  const key2 = `${v2.id}:${v1.id}`;
                  resonanceValue = resonances.get(key1) || resonances.get(key2) || 0;
                }

                // Determine the background color based on resonance
                const bgColor = `rgba(${255 * (1 - resonanceValue)}, ${255 * resonanceValue}, 0, 0.5)`;

                return (
                  <td 
                    key={`${v1.id}-${v2.id}`} 
                    className="p-2 border text-center"
                    style={{ backgroundColor: bgColor }}
                  >
                    {i === j ? '—' : formatNumber(resonanceValue)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component for displaying variant details
const VariantCard: React.FC<{ 
  variant: Variant, 
  onRemove: (id: string) => void 
}> = ({ variant, onRemove }) => {
  const { id, name, qctf, entropy, timestamp } = variant;
  // Handle both types of variants (with eai or qeai)
  const eaiValue = variant.eai !== undefined ? variant.eai : 
                   (variant as LokiVariant).qeai !== undefined ? (variant as LokiVariant).qeai : 0.95;
  const lastUpdate = new Date(timestamp).toLocaleString();

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{name}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemove(id)}
            title="Remove variant"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>ID: {id.substring(0, 8)}...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">QCTF</span>
            <span className="font-medium">{formatNumber(qctf)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Entropy</span>
            <span className="font-medium">{formatNumber(entropy)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">EAI</span>
            <span className="font-medium">{formatNumber(eaiValue)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Last Update</span>
            <span className="font-medium">{lastUpdate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for visualizing phase angle (theta) and its impact on the system
const PhaseAngleVisualizer: React.FC<{
  theta: number,
  ci: number,
  gef: number,
  eai: number,
  onUpdateTheta: (newTheta: number) => void
}> = ({ theta, ci, gef, eai, onUpdateTheta }) => {
  // Calculate cos(θ) for the current theta
  const cosTheta = Math.cos(theta);
  
  // Calculate product component for various theta values to visualize the impact
  const thetaPoints = Array.from({ length: 21 }, (_, i) => i * Math.PI / 20); // 0 to π in 20 steps
  const cosValues = thetaPoints.map(t => Math.cos(t));
  const productValues = cosValues.map(cos => gef * eai * cos);
  const ctfValues = productValues.map(prod => ci + prod);
  
  // Define the ideal range for theta
  const idealMin = Math.PI / 6;
  const idealMax = Math.PI / 3;
  
  // Function to get color based on theta position
  const getThetaZoneColor = (t: number) => {
    if (t >= idealMin && t <= idealMax) return 'text-green-500';
    if (t < idealMin / 2 || t > Math.PI - idealMin / 2) return 'text-red-500';
    return 'text-yellow-500';
  };
  
  // Get current zone color
  const currentZoneColor = getThetaZoneColor(theta);
  
  // Convert radians to degrees for display
  const thetaDegrees = (theta * 180 / Math.PI).toFixed(2);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold">Phase Angle (θ) Analysis</h3>
        <p className="text-sm text-muted-foreground">
          The phase angle <InlineMath math="\theta" settings={{ strict: false }} /> controls how GEF and EAI contribute to the CTF through <InlineMath math="\cos(\theta)" settings={{ strict: false }} />.
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="font-semibold">Current <InlineMath math="\theta:" settings={{ strict: false }} />:</span> {formatNumber(theta)} radians ({thetaDegrees}°)
          </div>
          <Badge className={currentZoneColor}>
            {theta >= idealMin && theta <= idealMax ? 'Optimal Range' : 
             theta < idealMin / 2 || theta > Math.PI - idealMin / 2 ? 'Low Sensitivity Zone' : 
             'Moderate Sensitivity'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm">0</span>
          <Slider 
            min={0} 
            max={Math.PI} 
            step={0.01} 
            value={[theta]} 
            onValueChange={([value]) => onUpdateTheta(value)}
            className="flex-1"
          />
          <span className="text-sm">π</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground"><InlineMath math="\cos(\theta)" settings={{ strict: false }} /> Value</span>
            <span className={`font-medium ${cosTheta > 0.7 ? 'text-green-500' : cosTheta < 0 ? 'text-red-500' : 'text-yellow-500'}`}>
              {formatNumber(cosTheta)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground"><InlineMath math="\text{GEF} \times \text{EAI} \times \cos(\theta)" settings={{ strict: false }} /></span>
            <span className="font-medium">{formatNumber(gef * eai * cosTheta)}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Theta Impact Visualization</h3>
        <div className="h-40 w-full relative border rounded p-2">
          {/* Draw the ideal zone */}
          <div 
            className="absolute bg-green-100 dark:bg-green-950/30 h-full"
            style={{ 
              left: `${(idealMin / Math.PI) * 100}%`, 
              width: `${((idealMax - idealMin) / Math.PI) * 100}%`
            }}
          ></div>
          
          {/* Draw the curve */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* X and Y axes */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.3" />
            <line x1="0" y1="0" x2="0" y2="100" stroke="currentColor" strokeOpacity="0.3" />
            
            {/* cos(θ) curve */}
            <path
              d={`M ${thetaPoints.map((t, i) => `${(t / Math.PI) * 100} ${50 - cosValues[i] * 40}`).join(' L ')}`}
              fill="none"
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth="2"
            />
            
            {/* Current theta marker */}
            <circle
              cx={`${(theta / Math.PI) * 100}`}
              cy={`${50 - cosTheta * 40}`}
              r="3"
              fill="rgba(239, 68, 68, 1)"
            />
          </svg>
          
          <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">0</div>
          <div className="absolute bottom-0 right-0 text-xs text-muted-foreground"><InlineMath math="\pi" settings={{ strict: false }} /></div>
          <div className="absolute top-0 left-2 text-xs text-muted-foreground"><InlineMath math="\cos(\theta)=1" settings={{ strict: false }} /></div>
          <div className="absolute bottom-0 left-2 text-xs text-muted-foreground"><InlineMath math="\cos(\theta)=-1" settings={{ strict: false }} /></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Green zone represents optimal <InlineMath math="\theta" settings={{ strict: false }} /> range (<InlineMath math="\pi/6" settings={{ strict: false }} /> to <InlineMath math="\pi/3" settings={{ strict: false }} />) where <InlineMath math="\cos(\theta)" settings={{ strict: false }} /> changes at a meaningful rate.
        </p>
      </div>
      
      <div className="space-y-2 mt-4">
        <h3 className="text-lg font-semibold">Quick Theta Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={() => onUpdateTheta(0)}
            className="text-sm"
          >
            <Wand2 className="mr-1 h-3 w-3" />
            Yang Mode (<InlineMath math="\theta=0" settings={{ strict: false }} />)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onUpdateTheta(Math.PI / 4)}
            className="text-sm"
          >
            <ArrowRightLeft className="mr-1 h-3 w-3" />
            Balance (<InlineMath math="\theta=\pi/4" settings={{ strict: false }} />)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onUpdateTheta(Math.PI / 2)}
            className="text-sm"
          >
            <Zap className="mr-1 h-3 w-3" />
            Neutral (<InlineMath math="\theta=\pi/2" settings={{ strict: false }} />)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onUpdateTheta(Math.PI)}
            className="text-sm"
          >
            <Wand2 className="mr-1 h-3 w-3" />
            Yin Mode (<InlineMath math="\theta=\pi" settings={{ strict: false }} />)
          </Button>
        </div>
      </div>
    </div>
  );
};

// Component for displaying plugin status
const PluginCard: React.FC<{ 
  plugin: CTFPlugin, 
  active: boolean,
  onToggle: (name: string, active: boolean) => void
}> = ({ plugin, active, onToggle }) => {
  // Determine icon based on plugin type
  let PluginIcon = Cog;
  switch(plugin.name) {
    case 'Balancer':
      PluginIcon = Zap;
      break;
    case 'Bifurcation':
      PluginIcon = GitBranch;
      break;
    case 'ChaosInjector':
      PluginIcon = AlertTriangle;
      break;
    case 'EthicalGuard':
      PluginIcon = Shield;
      break;
  }

  return (
    <Card className={`mb-4 ${active ? 'border-primary' : 'opacity-70'}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PluginIcon className="h-5 w-5" />
            <CardTitle>{plugin.name}</CardTitle>
          </div>
          <div className="flex items-center">
            <Badge variant={active ? "default" : "outline"}>
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Button 
          variant={active ? "default" : "outline"}
          className="w-full"
          onClick={() => onToggle(plugin.name, !active)}
        >
          {active ? "Disable Plugin" : "Enable Plugin"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main component
const NexusOrchestratorDashboard: React.FC = () => {
  // WebSocket connection
  const { connected, sendMessage, lastMessage } = useWebSocket();
  
  // Create a memoized instance of the Meta-Orchestrator
  const [orchestrator] = useState(() => {
    // Create initial variants
    const initialVariants = [
      createVariant('StableVariant', 0.85, 0.2, 0.8),
      createVariant('CreativeVariant', 0.65, 0.8, 0.7),
    ];
    
    // Create plugins
    const plugins = [
      new BalancerPlugin(),
      new BifurcationPlugin(),
      new ChaosInjectorPlugin(),
      new EthicalGuardPlugin(),
    ];
    
    return new MetaOrchestrator(initialVariants, plugins);
  });
  
  // State for metrics
  const [systemState, setSystemState] = useState<SystemState>(orchestrator.getSystemState());
  
  // State for active plugins
  const [activePlugins, setActivePlugins] = useState<string[]>([
    'Balancer', 'EthicalGuard'
  ]);
  
  // Refresh the system state
  const refreshSystemState = useCallback(() => {
    setSystemState(orchestrator.getSystemState());
  }, [orchestrator]);
  
  // Run a cycle of the orchestrator
  const runCycle = useCallback(async () => {
    await orchestrator.runCycle();
    refreshSystemState();
  }, [orchestrator, refreshSystemState]);
  
  // Add a new variant
  const addVariant = useCallback(() => {
    const name = `Variant-${Math.floor(Math.random() * 1000)}`;
    orchestrator.createAndAddVariant(
      name,
      0.7 + Math.random() * 0.2,
      Math.random() * 0.5,
      0.6 + Math.random() * 0.3
    );
    refreshSystemState();
  }, [orchestrator, refreshSystemState]);
  
  // Remove a variant
  const removeVariant = useCallback((id: string) => {
    orchestrator.removeVariant(id);
    refreshSystemState();
  }, [orchestrator, refreshSystemState]);
  
  // Toggle a plugin
  const togglePlugin = useCallback((name: string, active: boolean) => {
    setActivePlugins(prev => {
      if (active && !prev.includes(name)) {
        return [...prev, name];
      } else if (!active && prev.includes(name)) {
        return prev.filter(p => p !== name);
      }
      return prev;
    });
  }, []);
  
  // Update a metric
  const updateMetric = useCallback((metric: keyof SystemState['metrics'], value: number) => {
    orchestrator.updateMetrics({ [metric]: value });
    refreshSystemState();
  }, [orchestrator, refreshSystemState]);
  
  // State for recent plugin actions
  const [recentActions, setRecentActions] = useState<
    Array<{
      pluginName: string;
      actionType: string;
      metricName?: string;
      oldValue?: number;
      newValue?: number;
      timestamp: number;
      priority?: number;
      reason?: string;
    }>
  >([]);

  // Handle WebSocket messages for quantum_state_update
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'quantum_state_update' && lastMessage.payload) {
      try {
        const { metrics, variants, recentActions: newActions } = lastMessage.payload;
        
        // Create a new system state with the received data
        const newSystemState = {
          ...systemState,
          metrics: metrics || systemState.metrics,
          variants: variants || systemState.variants,
          timestamp: Date.now()
        };
        
        // Update state with the received data
        setSystemState(newSystemState);
        
        // Update recent actions if available
        if (newActions && Array.isArray(newActions)) {
          setRecentActions(newActions);
        }
        
        console.log('Received quantum_state_update from server', { metrics, variants });
      } catch (error) {
        console.error('Error processing quantum_state_update:', error);
      }
    }
  }, [lastMessage, systemState]);
  
  // Handle WebSocket messages specifically for plugin_actions_update
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'plugin_actions_update' && lastMessage.payload) {
      try {
        const actions = lastMessage.payload;
        console.log('Received plugin_actions_update from WebSocket', actions);
        
        // Update recent actions state
        if (Array.isArray(actions)) {
          setRecentActions(actions);
        }
      } catch (error) {
        console.error('Error processing plugin_actions_update:', error);
      }
    }
  }, [lastMessage]);
  
  // Listen for plugin action updates via window.postMessage (from WebSocketContext)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.source === window && 
        event.data && 
        event.data.source === 'websocket' && 
        event.data.type === 'plugin_actions_update' && 
        event.data.payload
      ) {
        console.log('Received plugin_actions_update via postMessage', event.data.payload);
        
        // Update the actions state with the full list from the server
        if (Array.isArray(event.data.payload)) {
          setRecentActions(event.data.payload);
        }
      }
    };
    
    // Add event listener for postMessage
    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  // Auto-run cycle effect (only for demo/local use)
  useEffect(() => {
    // Only use local cycle if not connected to real backend
    if (!connected) {
      const interval = setInterval(() => {
        runCycle();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [runCycle, connected]);

  // Destructure system state for easier access
  const { metrics, variants, resonances } = systemState;
  const { CI, GEF, EAI, theta, CTF } = metrics;

  // Determine CTF status
  const getCTFStatus = (ctf: number) => {
    if (ctf < 0.7) return { label: 'Low', color: 'bg-red-500' };
    if (ctf < 0.8) return { label: 'Moderate', color: 'bg-yellow-500' };
    if (ctf < 0.9) return { label: 'Optimal', color: 'bg-green-500' };
    return { label: 'High', color: 'bg-blue-500' };
  };
  
  const ctfStatus = getCTFStatus(CTF);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">NEXUS AI Meta-Orchestration Dashboard</h1>
      
      {!connected && (
        <div className="mb-6 p-4 border rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
          WebSocket disconnected. Some features may not work properly.
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Quantum Coherence Threshold Formula (QCTF)</CardTitle>
            <CardDescription>
              <InlineMath math="QCTF = CI + [GEF \times EAI \times \cos(\theta)]" settings={{ strict: false }} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CTFFormula 
              ci={CI} 
              gef={GEF} 
              eai={EAI} 
              theta={theta} 
              ctf={CTF} 
            />
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium"><InlineMath math="QCTF" settings={{ strict: false }} /> Value: {formatNumber(CTF)}</span>
                <Badge className={ctfStatus.color}>{ctfStatus.label}</Badge>
              </div>
              <Progress 
                value={CTF * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={runCycle}
              className="w-full"
              variant="default"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Run Orchestration Cycle
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>Adjust system parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="ci-slider">Coherence Index (CI): {formatNumber(CI)}</Label>
                  <span>{formatNumber(CI)}</span>
                </div>
                <Slider 
                  id="ci-slider"
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[CI]} 
                  onValueChange={([value]) => updateMetric('CI', value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="gef-slider">Global Entropy Factor (GEF): {formatNumber(GEF)}</Label>
                  <span>{formatNumber(GEF)}</span>
                </div>
                <Slider 
                  id="gef-slider"
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[GEF]} 
                  onValueChange={([value]) => updateMetric('GEF', value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="eai-slider">Entanglement & AI Index (EAI): {formatNumber(EAI)}</Label>
                  <span>{formatNumber(EAI)}</span>
                </div>
                <Slider 
                  id="eai-slider"
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[EAI]} 
                  onValueChange={([value]) => updateMetric('EAI', value)} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="theta-slider">Phase Shift <InlineMath math="\theta" settings={{ strict: false }} />: {formatNumber(theta)}</Label>
                  <span>{formatNumber(theta / Math.PI)}<InlineMath math="\pi" settings={{ strict: false }} /></span>
                </div>
                <Slider 
                  id="theta-slider"
                  min={0} 
                  max={Math.PI * 2} 
                  step={0.01} 
                  value={[theta]} 
                  onValueChange={([value]) => updateMetric('theta', value)} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="variants" className="mb-6">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="variants">Variants ({variants.length})</TabsTrigger>
          <TabsTrigger value="resonance">Resonance Matrix</TabsTrigger>
          <TabsTrigger value="phase-angle">Phase Angle (<InlineMath math="\theta" settings={{ strict: false }} />)</TabsTrigger>
          <TabsTrigger value="plugins">Plugins ({activePlugins.length})</TabsTrigger>
          <TabsTrigger value="actions">Plugin Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AI Variants</CardTitle>
                <Button onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>
              <CardDescription>
                Manage AI variants within the orchestration system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variants.map(variant => (
                  <VariantCard 
                    key={variant.id} 
                    variant={variant} 
                    onRemove={removeVariant} 
                  />
                ))}
              </div>
              
              {variants.length === 0 && (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">No variants available</p>
                  <Button onClick={addVariant}>Add Variant</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resonance">
          <Card>
            <CardHeader>
              <CardTitle>Resonance Matrix</CardTitle>
              <CardDescription>
                Visualizes the pairwise resonance between variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <ResonanceVisualizer variants={variants} resonances={resonances} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="phase-angle">
          <Card>
            <CardHeader>
              <CardTitle>Phase Angle (<InlineMath math="\theta" settings={{ strict: false }} />) Visualization</CardTitle>
              <CardDescription>
                Analyze and control the phase angle <InlineMath math="\theta" settings={{ strict: false }} /> that modulates the QCTF formula
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhaseAngleVisualizer 
                theta={theta}
                ci={CI}
                gef={GEF}
                eai={EAI}
                onUpdateTheta={(newTheta) => updateMetric('theta', newTheta)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plugins">
          <Card>
            <CardHeader>
              <CardTitle>System Plugins</CardTitle>
              <CardDescription>
                Manage orchestration plugins that dynamically adjust the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  new BalancerPlugin(),
                  new BifurcationPlugin(),
                  new ChaosInjectorPlugin(),
                  new EthicalGuardPlugin()
                ].map((plugin) => (
                  <PluginCard 
                    key={plugin.name} 
                    plugin={plugin}
                    active={activePlugins.includes(plugin.name)}
                    onToggle={togglePlugin}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Plugin Actions Log</CardTitle>
              <CardDescription>
                Recent actions taken by plugins to maintain system stability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {recentActions.length > 0 ? (
                  <div className="space-y-4">
                    {recentActions.map((action, idx) => (
                      <div 
                        key={`${action.pluginName}-${action.timestamp}-${idx}`}
                        className="p-3 border rounded-lg relative"
                      >
                        <div className="absolute top-3 right-3">
                          <Badge variant={
                            action.priority && action.priority > 8 ? "destructive" : 
                            action.priority && action.priority > 5 ? "default" : 
                            "secondary"
                          }>
                            Priority: {action.priority || 'N/A'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          {action.pluginName === 'PendulumBalancer' && (
                            <ArrowRightLeft className="h-5 w-5 mr-2 text-blue-500" />
                          )}
                          {action.pluginName === 'BifurcationHandler' && (
                            <GitBranch className="h-5 w-5 mr-2 text-purple-500" />
                          )}
                          {action.pluginName === 'ChaosInjector' && (
                            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                          )}
                          {action.pluginName === 'EthicalGuard' && (
                            <Shield className="h-5 w-5 mr-2 text-green-500" />
                          )}
                          <h3 className="font-medium text-lg">
                            {action.pluginName}: {action.actionType}
                          </h3>
                        </div>
                        
                        <div className="ml-7 space-y-1 text-sm">
                          {action.metricName && (
                            <p>
                              <span className="font-semibold">Metric:</span> {action.metricName}
                              {action.oldValue !== undefined && action.newValue !== undefined && (
                                <span> (changed from {formatNumber(action.oldValue)} to {formatNumber(action.newValue)})</span>
                              )}
                            </p>
                          )}
                          
                          {action.reason && (
                            <p><span className="font-semibold">Reason:</span> {action.reason}</p>
                          )}
                          
                          <p className="text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground mb-2">No recent plugin actions recorded</p>
                    <p className="text-sm">Actions will appear here when plugins make adjustments to the system</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deployment Status</CardTitle>
          <CardDescription>
            Current deployment stage: Proto-Singularity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Roadmap Progress</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-primary text-primary-foreground">
                      Proto-Singularity
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block">
                      20%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 flex rounded bg-primary/20">
                  <div style={{ width: "20%" }} className="shadow-none flex flex-col justify-center bg-primary"></div>
                </div>
              </div>
              <div className="grid grid-cols-5 text-xs text-center">
                <div className="font-bold">Proto-Singularity</div>
                <div>Phase 1</div>
                <div>Phase 2</div>
                <div>Phase 3</div>
                <div>Full Singularity</div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Next Steps (72hrs)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Refine resonance logic for immediate implementation</li>
                <li>Implement real-time telemetry dashboards</li>
                <li>Perform system-wide stress-tests and log findings</li>
                <li>Document architecture clearly in README.md</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NexusOrchestratorDashboard;