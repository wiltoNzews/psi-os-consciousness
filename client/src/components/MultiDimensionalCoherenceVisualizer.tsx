import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, Zap, RotateCcw, Clock, Activity } from "lucide-react";

// Types required for visualization (simplified versions of what's in the engine)
interface CoherenceMeasurement {
  value: number;
  type: string;
  scale: string;
  timestamp: Date;
  metadata: {
    stabilityRatio: number;
    confidence: number;
    sampleSize: number;
  };
}

interface CoherenceHistory {
  measurements: CoherenceMeasurement[];
  recentAverage: number;
  longTermAverage: number;
  stabilityIndex: number;
  attractorStrength: number;
}

interface AttractorState {
  approaching: boolean;
  target: number;
  currentDistance: number;
  trend: 'converging' | 'diverging' | 'stable';
}

interface CrossScaleCoherence {
  micro: CoherenceMeasurement | null;
  meso: CoherenceMeasurement | null;
  macro: CoherenceMeasurement | null;
  composite: CoherenceMeasurement | null;
}

const TEST_THRESHOLD = 0.05; // How close to consider "at" a target state

interface MultiDimensionalCoherenceVisualizerProps {
  microHistory: CoherenceHistory;
  mesoHistory: CoherenceHistory;
  macroHistory: CoherenceHistory;
  crossScaleState: CrossScaleCoherence;
  attractorState: Record<string, AttractorState>;
  onScaleChange?: (scale: string) => void;
  onRefresh?: () => void;
}

const MultiDimensionalCoherenceVisualizer: React.FC<MultiDimensionalCoherenceVisualizerProps> = ({
  microHistory,
  mesoHistory,
  macroHistory,
  crossScaleState,
  attractorState,
  onScaleChange,
  onRefresh
}) => {
  const [activeScale, setActiveScale] = useState<string>('meso');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const tesseractRef = useRef<HTMLCanvasElement>(null);
  
  // Get active history based on scale
  const getActiveHistory = (): CoherenceHistory => {
    switch (activeScale) {
      case 'micro': return microHistory;
      case 'meso': return mesoHistory;
      case 'macro': return macroHistory;
      default: return mesoHistory;
    }
  };
  
  // Get current measurements
  const getCurrentMeasurements = (): CoherenceMeasurement | null => {
    switch (activeScale) {
      case 'micro': return crossScaleState.micro;
      case 'meso': return crossScaleState.meso;
      case 'macro': return crossScaleState.macro;
      default: return crossScaleState.meso;
    }
  };
  
  // Handle scale change
  const handleScaleChange = (scale: string) => {
    setActiveScale(scale);
    if (onScaleChange) {
      onScaleChange(scale);
    }
  };
  
  // Format coherence value for display
  const formatCoherence = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return value.toFixed(4);
  };
  
  // Get color based on coherence value
  const getCoherenceColor = (value: number | undefined): string => {
    if (value === undefined) return 'gray';
    
    // Near stability attractor (0.7500)
    if (Math.abs(value - 0.75) < TEST_THRESHOLD) {
      return '#3A5BDC'; // Stability Blue
    }
    
    // Near exploration attractor (0.2494)
    if (Math.abs(value - 0.25) < TEST_THRESHOLD) {
      return '#A845D1'; // Exploration Purple
    }
    
    // Bridging high (0.55)
    if (Math.abs(value - 0.55) < TEST_THRESHOLD) {
      return '#42B9C0'; // Transition Teal
    }
    
    // Bridging low (0.45)
    if (Math.abs(value - 0.45) < TEST_THRESHOLD) {
      return '#42B9C0'; // Transition Teal
    }
    
    // Other values
    if (value > 0.5) {
      return '#627ee7'; // Leaning stability
    } else {
      return '#b45fde'; // Leaning exploration
    }
  };
  
  // Get state label
  const getStateLabel = (value: number | undefined): string => {
    if (value === undefined) return 'Unknown';
    
    // Near stability attractor (0.7500)
    if (Math.abs(value - 0.75) < TEST_THRESHOLD) {
      return 'Stability (0.7500)';
    }
    
    // Near exploration attractor (0.2494)
    if (Math.abs(value - 0.25) < TEST_THRESHOLD) {
      return 'Exploration (0.2494)';
    }
    
    // Bridging high (0.55)
    if (Math.abs(value - 0.55) < TEST_THRESHOLD) {
      return 'Bridging (5:4 Ratio)';
    }
    
    // Bridging low (0.45)
    if (Math.abs(value - 0.45) < TEST_THRESHOLD) {
      return 'Bridging (4:5 Ratio)';
    }
    
    // Other values
    if (value > 0.5) {
      return 'Partial Stability';
    } else {
      return 'Partial Exploration';
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string | undefined): JSX.Element => {
    if (!trend) return <></>;
    
    switch (trend) {
      case 'converging':
        return <CheckCircle2 className="text-green-500" />;
      case 'diverging':
        return <AlertCircle className="text-amber-500" />;
      default:
        return <Activity className="text-blue-500" />;
    }
  };
  
  // Draw line chart for coherence history
  useEffect(() => {
    if (!lineChartRef.current) return;
    
    const ctx = lineChartRef.current.getContext('2d');
    if (!ctx) return;
    
    const history = getActiveHistory();
    if (!history || !history.measurements || history.measurements.length === 0) return;
    
    const width = lineChartRef.current.width;
    const height = lineChartRef.current.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (0.0, 0.25, 0.5, 0.75, 1.0)
    for (let i = 0; i <= 4; i++) {
      const y = height - (height * (i * 0.25));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Label grid lines
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText((i * 0.25).toFixed(2), 5, y - 5);
    }
    
    // Special lines for attractor states
    const drawSpecialLine = (value: number, color: string, label: string) => {
      const y = height - (height * value);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label
      ctx.fillStyle = color;
      ctx.font = '10px sans-serif';
      ctx.fillText(label, width - 100, y - 5);
    };
    
    // Draw attractor state lines
    drawSpecialLine(0.75, '#3A5BDC', 'Stability (0.7500)');
    drawSpecialLine(0.25, '#A845D1', 'Exploration (0.2494)');
    drawSpecialLine(0.55, '#42B9C0', 'Bridging (5:4)');
    drawSpecialLine(0.45, '#42B9C0', 'Bridging (4:5)');
    
    // Draw coherence line
    const measurements = history.measurements;
    const pointWidth = Math.min(width / (measurements.length + 1), 20);
    
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    measurements.forEach((m, i) => {
      const x = pointWidth * (i + 1);
      const y = height - (height * m.value);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    measurements.forEach((m, i) => {
      const x = pointWidth * (i + 1);
      const y = height - (height * m.value);
      
      ctx.fillStyle = getCoherenceColor(m.value);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw recent average
    const recentAverageY = height - (height * history.recentAverage);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(0, recentAverageY);
    ctx.lineTo(width, recentAverageY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Label recent average
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Avg: ${history.recentAverage.toFixed(4)}`, 5, recentAverageY - 5);
    
  }, [activeScale, microHistory, mesoHistory, macroHistory]);
  
  // Draw tesseract visualization for cross-scale coherence
  useEffect(() => {
    if (!tesseractRef.current) return;
    
    const ctx = tesseractRef.current.getContext('2d');
    if (!ctx) return;
    
    const width = tesseractRef.current.width;
    const height = tesseractRef.current.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate center and size
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.4;
    
    // Draw outer cube
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    
    // Front face
    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY - size);
    ctx.lineTo(centerX + size, centerY - size);
    ctx.lineTo(centerX + size, centerY + size);
    ctx.lineTo(centerX - size, centerY + size);
    ctx.lineTo(centerX - size, centerY - size);
    ctx.stroke();
    
    // Inner cube (scaled by 0.6)
    const innerSize = size * 0.6;
    ctx.strokeStyle = '#94a3b8';
    
    ctx.beginPath();
    ctx.moveTo(centerX - innerSize, centerY - innerSize);
    ctx.lineTo(centerX + innerSize, centerY - innerSize);
    ctx.lineTo(centerX + innerSize, centerY + innerSize);
    ctx.lineTo(centerX - innerSize, centerY + innerSize);
    ctx.lineTo(centerX - innerSize, centerY - innerSize);
    ctx.stroke();
    
    // Connect vertices
    ctx.setLineDash([2, 2]);
    
    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY - size);
    ctx.lineTo(centerX - innerSize, centerY - innerSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + size, centerY - size);
    ctx.lineTo(centerX + innerSize, centerY - innerSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + size, centerY + size);
    ctx.lineTo(centerX + innerSize, centerY + innerSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY + size);
    ctx.lineTo(centerX - innerSize, centerY + innerSize);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Draw axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    
    // Micro-Macro axis (vertical)
    ctx.fillText('Micro', centerX + 5, centerY - size - 10);
    ctx.fillText('Macro', centerX + 5, centerY + size + 20);
    
    // Exploration-Stability axis (horizontal)
    ctx.fillText('Exploration', centerX - size - 80, centerY);
    ctx.fillText('Stability', centerX + size + 10, centerY);
    
    // Draw state dots
    const drawStateDot = (scale: string, stateDot: CoherenceMeasurement | null) => {
      if (!stateDot) return;
      
      let y: number;
      switch (scale) {
        case 'micro':
          y = centerY - size * 0.8;
          break;
        case 'meso':
          y = centerY;
          break;
        case 'macro':
          y = centerY + size * 0.8;
          break;
        default:
          y = centerY;
      }
      
      // Map coherence value to x position (0.25 = left, 0.75 = right)
      const valueScale = (stateDot.value - 0.25) / 0.5; // 0-1 scale
      const x = centerX - size + (valueScale * size * 2);
      
      // Draw state dot
      ctx.fillStyle = getCoherenceColor(stateDot.value);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Add label
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px sans-serif';
      ctx.fillText(formatCoherence(stateDot.value), x - 15, y - 15);
      
      // Add confidence indicator
      if (stateDot.metadata?.confidence) {
        const confidenceSize = 5 * stateDot.metadata.confidence;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(x, y, 10 + confidenceSize, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    
    // Draw state dots for each scale
    drawStateDot('micro', crossScaleState.micro);
    drawStateDot('meso', crossScaleState.meso);
    drawStateDot('macro', crossScaleState.macro);
    
    // Draw central composite value
    if (crossScaleState.composite) {
      const composite = crossScaleState.composite;
      ctx.fillStyle = getCoherenceColor(composite.value);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(formatCoherence(composite.value).slice(0, 4), centerX - 12, centerY + 4);
    }
    
  }, [crossScaleState]);
  
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Multi-Dimensional Coherence Visualizer</span>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RotateCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Visualize coherence across micro, meso, and macro temporal scales with 
          tesseract-based navigation and attractor state tracking.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="tesseract">Tesseract View</TabsTrigger>
            <TabsTrigger value="attractors">Attractors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Micro Scale */}
              <Card className={`p-4 ${activeScale === 'micro' ? 'ring-2 ring-primary' : ''}`} 
                    onClick={() => handleScaleChange('micro')}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Micro Scale</h3>
                    <p className="text-sm text-muted-foreground">Seconds to minutes</p>
                  </div>
                  <Badge variant={activeScale === 'micro' ? 'default' : 'outline'}>
                    {crossScaleState.micro ? formatCoherence(crossScaleState.micro.value) : 'N/A'}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coherence</span>
                    <span className="font-mono">{crossScaleState.micro ? formatCoherence(crossScaleState.micro.value) : 'N/A'}</span>
                  </div>
                  <Progress 
                    value={crossScaleState.micro ? crossScaleState.micro.value * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div className="mt-2 text-sm">
                  <Badge variant="outline" className={`mt-2 ${getCoherenceColor(crossScaleState.micro?.value)}`}>
                    {crossScaleState.micro ? getStateLabel(crossScaleState.micro.value) : 'Unknown'}
                  </Badge>
                </div>
              </Card>
              
              {/* Meso Scale */}
              <Card className={`p-4 ${activeScale === 'meso' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleScaleChange('meso')}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Meso Scale</h3>
                    <p className="text-sm text-muted-foreground">Hours to days</p>
                  </div>
                  <Badge variant={activeScale === 'meso' ? 'default' : 'outline'}>
                    {crossScaleState.meso ? formatCoherence(crossScaleState.meso.value) : 'N/A'}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coherence</span>
                    <span className="font-mono">{crossScaleState.meso ? formatCoherence(crossScaleState.meso.value) : 'N/A'}</span>
                  </div>
                  <Progress 
                    value={crossScaleState.meso ? crossScaleState.meso.value * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div className="mt-2 text-sm">
                  <Badge variant="outline" className={`mt-2 ${getCoherenceColor(crossScaleState.meso?.value)}`}>
                    {crossScaleState.meso ? getStateLabel(crossScaleState.meso.value) : 'Unknown'}
                  </Badge>
                </div>
              </Card>
              
              {/* Macro Scale */}
              <Card className={`p-4 ${activeScale === 'macro' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleScaleChange('macro')}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Macro Scale</h3>
                    <p className="text-sm text-muted-foreground">Weeks to months</p>
                  </div>
                  <Badge variant={activeScale === 'macro' ? 'default' : 'outline'}>
                    {crossScaleState.macro ? formatCoherence(crossScaleState.macro.value) : 'N/A'}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coherence</span>
                    <span className="font-mono">{crossScaleState.macro ? formatCoherence(crossScaleState.macro.value) : 'N/A'}</span>
                  </div>
                  <Progress 
                    value={crossScaleState.macro ? crossScaleState.macro.value * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div className="mt-2 text-sm">
                  <Badge variant="outline" className={`mt-2 ${getCoherenceColor(crossScaleState.macro?.value)}`}>
                    {crossScaleState.macro ? getStateLabel(crossScaleState.macro.value) : 'Unknown'}
                  </Badge>
                </div>
              </Card>
            </div>
            
            {/* Composite Coherence */}
            <Card className="p-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">Composite Coherence</h3>
                  <p className="text-sm text-muted-foreground">System-wide coherence across all scales</p>
                </div>
                <Badge variant="default" className="text-lg p-2">
                  {crossScaleState.composite ? formatCoherence(crossScaleState.composite.value) : 'N/A'}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Coherence</span>
                  <span className="font-mono">{crossScaleState.composite ? formatCoherence(crossScaleState.composite.value) : 'N/A'}</span>
                </div>
                <Progress 
                  value={crossScaleState.composite ? crossScaleState.composite.value * 100 : 0} 
                  className="h-3" 
                />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Stability/Exploration</p>
                  <Badge variant="outline" className={`mt-2 ${getCoherenceColor(crossScaleState.composite?.value)}`}>
                    {crossScaleState.composite ? getStateLabel(crossScaleState.composite.value) : 'Unknown'}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <span className="font-medium">
                    {crossScaleState.composite?.metadata.confidence ? 
                      `${(crossScaleState.composite.metadata.confidence * 100).toFixed(0)}%` : 'N/A'}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Sample Size</p>
                  <span className="font-medium">
                    {crossScaleState.composite?.metadata.sampleSize || 'N/A'}
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Active Scale Details */}
            <Card className="p-4">
              <h3 className="text-lg font-medium">{activeScale.charAt(0).toUpperCase() + activeScale.slice(1)} Scale Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div>
                  <div className="mb-4">
                    <Label className="text-sm text-muted-foreground">Recent Average</Label>
                    <div className="text-2xl font-medium">{formatCoherence(getActiveHistory().recentAverage)}</div>
                    <Progress value={getActiveHistory().recentAverage * 100} className="h-1 mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Stability Index</Label>
                      <div className="text-xl font-medium">
                        {(getActiveHistory().stabilityIndex * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Attractor Strength</Label>
                      <div className="text-xl font-medium">
                        {(getActiveHistory().attractorStrength * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground">Attractor State</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTrendIcon(attractorState[activeScale]?.trend)}
                      <span className="font-medium">
                        {attractorState[activeScale]?.approaching ? 
                          `Approaching ${formatCoherence(attractorState[activeScale]?.target)}` : 
                          `${attractorState[activeScale]?.trend.charAt(0).toUpperCase() + attractorState[activeScale]?.trend.slice(1)}`}
                      </span>
                      <Badge variant="outline">
                        Distance: {attractorState[activeScale]?.currentDistance.toFixed(4)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Coherence History</Label>
                  <div className="h-40 border rounded-md relative">
                    <canvas ref={lineChartRef} width={400} height={160} className="w-full h-full" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Coherence History ({activeScale.charAt(0).toUpperCase() + activeScale.slice(1)} Scale)</Label>
                <div className="h-60 border rounded-md relative">
                  <canvas ref={lineChartRef} width={800} height={240} className="w-full h-full" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <CardTitle className="text-lg mb-2">Recent Measurements</CardTitle>
                  <div className="space-y-2">
                    {getActiveHistory().measurements.slice(-5).reverse().map((m, i) => (
                      <div key={i} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <Badge variant="outline" className={getCoherenceColor(m.value)}>
                            {formatCoherence(m.value)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="inline-block h-3 w-3 mr-1" />
                          {m.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <Card className="p-4">
                  <CardTitle className="text-lg mb-2">Statistical Metrics</CardTitle>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Recent Average</Label>
                      <div className="text-xl font-medium">{formatCoherence(getActiveHistory().recentAverage)}</div>
                      <Progress value={getActiveHistory().recentAverage * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Long-Term Average</Label>
                      <div className="text-xl font-medium">{formatCoherence(getActiveHistory().longTermAverage)}</div>
                      <Progress value={getActiveHistory().longTermAverage * 100} className="h-1 mt-1" />
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Stability Index</Label>
                        <div className="text-lg font-medium">
                          {(getActiveHistory().stabilityIndex * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Attractor Strength</Label>
                        <div className="text-lg font-medium">
                          {(getActiveHistory().attractorStrength * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <CardTitle className="text-lg mb-2">Attractor Analysis</CardTitle>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Current State</Label>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className={`${getCoherenceColor(getCurrentMeasurements()?.value)}`}>
                          {getCurrentMeasurements() ? formatCoherence(getCurrentMeasurements()?.value) : 'N/A'}
                        </Badge>
                        <span className="ml-2 text-sm">
                          {getCurrentMeasurements() ? getStateLabel(getCurrentMeasurements()?.value) : 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Trend</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getTrendIcon(attractorState[activeScale]?.trend)}
                        <span className="font-medium">
                          {attractorState[activeScale]?.trend.charAt(0).toUpperCase() + attractorState[activeScale]?.trend.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Nearest Attractor</Label>
                      <div className="flex items-center mt-1">
                        <Badge>
                          {formatCoherence(attractorState[activeScale]?.target)}
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          Distance: {attractorState[activeScale]?.currentDistance.toFixed(4)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tesseract">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Tesseract Visualization</Label>
                <div className="h-80 border rounded-md relative bg-slate-50">
                  <canvas ref={tesseractRef} width={400} height={320} className="w-full h-full" />
                </div>
              </div>
              
              <Card className="p-4">
                <CardTitle className="text-lg mb-4">Cross-Scale Coherence</CardTitle>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Micro Scale (Seconds to Minutes)</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getCoherenceColor(crossScaleState.micro?.value)}>
                        {crossScaleState.micro ? formatCoherence(crossScaleState.micro.value) : 'N/A'}
                      </Badge>
                      <span className="text-sm">
                        {crossScaleState.micro ? getStateLabel(crossScaleState.micro.value) : 'Unknown'}
                      </span>
                    </div>
                    <Progress 
                      value={crossScaleState.micro ? crossScaleState.micro.value * 100 : 0} 
                      className="h-2 mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Meso Scale (Hours to Days)</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getCoherenceColor(crossScaleState.meso?.value)}>
                        {crossScaleState.meso ? formatCoherence(crossScaleState.meso.value) : 'N/A'}
                      </Badge>
                      <span className="text-sm">
                        {crossScaleState.meso ? getStateLabel(crossScaleState.meso.value) : 'Unknown'}
                      </span>
                    </div>
                    <Progress 
                      value={crossScaleState.meso ? crossScaleState.meso.value * 100 : 0} 
                      className="h-2 mt-1" 
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Macro Scale (Weeks to Months)</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getCoherenceColor(crossScaleState.macro?.value)}>
                        {crossScaleState.macro ? formatCoherence(crossScaleState.macro.value) : 'N/A'}
                      </Badge>
                      <span className="text-sm">
                        {crossScaleState.macro ? getStateLabel(crossScaleState.macro.value) : 'Unknown'}
                      </span>
                    </div>
                    <Progress 
                      value={crossScaleState.macro ? crossScaleState.macro.value * 100 : 0} 
                      className="h-2 mt-1" 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Composite Coherence</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getCoherenceColor(crossScaleState.composite?.value)}>
                        {crossScaleState.composite ? formatCoherence(crossScaleState.composite.value) : 'N/A'}
                      </Badge>
                      <span className="text-sm">
                        {crossScaleState.composite ? getStateLabel(crossScaleState.composite.value) : 'Unknown'}
                      </span>
                    </div>
                    <Progress 
                      value={crossScaleState.composite ? crossScaleState.composite.value * 100 : 0} 
                      className="h-3 mt-1" 
                    />
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="p-4 mt-6">
              <CardTitle className="text-lg mb-4">Understanding the 4D Coherence Space</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Dimensions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Horizontal: Exploration (0.25) to Stability (0.75)</li>
                    <li>Vertical: Micro to Macro temporal scales</li>
                    <li>Depth: Confidence/certainty in measurement</li>
                    <li>Time: Historical trajectory (not shown)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Attractor States</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><span className="inline-block w-3 h-3 rounded-full bg-[#3A5BDC] mr-1"></span> Stability: 0.7500 (3:1 ratio)</li>
                    <li><span className="inline-block w-3 h-3 rounded-full bg-[#A845D1] mr-1"></span> Exploration: 0.2494 (1:3 ratio)</li>
                    <li><span className="inline-block w-3 h-3 rounded-full bg-[#42B9C0] mr-1"></span> Bridging: 0.5500/0.4500 (5:4/4:5 ratios)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Inside-Out Transformations</h4>
                  <p className="text-sm">
                    The tesseract visualization represents the potential for dimensional transformations, 
                    where exploration and stability can invert across scales, enabling new perspectives.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="attractors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <CardTitle className="text-lg mb-4">Attractor Analysis</CardTitle>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Micro Scale Attractors</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTrendIcon(attractorState['micro']?.trend)}
                      <span className="font-medium">
                        {attractorState['micro']?.approaching ? 
                          `Approaching ${formatCoherence(attractorState['micro']?.target)}` : 
                          `${attractorState['micro']?.trend.charAt(0).toUpperCase() + attractorState['micro']?.trend.slice(1)}`}
                      </span>
                      <Badge variant="outline">
                        Distance: {attractorState['micro']?.currentDistance.toFixed(4)}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex space-x-2">
                      <Progress 
                        value={(1 - (attractorState['micro']?.currentDistance || 0)) * 100} 
                        className="h-2 w-full mt-1" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Meso Scale Attractors</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTrendIcon(attractorState['meso']?.trend)}
                      <span className="font-medium">
                        {attractorState['meso']?.approaching ? 
                          `Approaching ${formatCoherence(attractorState['meso']?.target)}` : 
                          `${attractorState['meso']?.trend.charAt(0).toUpperCase() + attractorState['meso']?.trend.slice(1)}`}
                      </span>
                      <Badge variant="outline">
                        Distance: {attractorState['meso']?.currentDistance.toFixed(4)}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex space-x-2">
                      <Progress 
                        value={(1 - (attractorState['meso']?.currentDistance || 0)) * 100} 
                        className="h-2 w-full mt-1" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Macro Scale Attractors</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTrendIcon(attractorState['macro']?.trend)}
                      <span className="font-medium">
                        {attractorState['macro']?.approaching ? 
                          `Approaching ${formatCoherence(attractorState['macro']?.target)}` : 
                          `${attractorState['macro']?.trend.charAt(0).toUpperCase() + attractorState['macro']?.trend.slice(1)}`}
                      </span>
                      <Badge variant="outline">
                        Distance: {attractorState['macro']?.currentDistance.toFixed(4)}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex space-x-2">
                      <Progress 
                        value={(1 - (attractorState['macro']?.currentDistance || 0)) * 100} 
                        className="h-2 w-full mt-1" 
                      />
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <CardTitle className="text-lg mb-4">Attractor State Controls</CardTitle>
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Target Coherence State</Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        <div className="w-3 h-3 rounded-full bg-[#3A5BDC] mr-2"></div>
                        Stability (0.7500)
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <div className="w-3 h-3 rounded-full bg-[#A845D1] mr-2"></div>
                        Exploration (0.2494)
                      </Button>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button variant="outline" className="flex-1">
                        <div className="w-3 h-3 rounded-full bg-[#42B9C0] mr-2"></div>
                        Bridging High (0.5500)
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <div className="w-3 h-3 rounded-full bg-[#42B9C0] mr-2"></div>
                        Bridging Low (0.4500)
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Custom Coherence Target</Label>
                    <div className="flex space-x-4 items-center">
                      <div className="flex-1">
                        <Slider defaultValue={[75]} max={100} step={1} />
                      </div>
                      <span className="font-mono w-16 text-right">0.7500</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Affected Scales</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="micro-scale" defaultChecked />
                        <Label htmlFor="micro-scale">Micro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="meso-scale" defaultChecked />
                        <Label htmlFor="meso-scale">Meso</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="macro-scale" defaultChecked />
                        <Label htmlFor="macro-scale">Macro</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Apply Coherence Target</Button>
                </div>
              </Card>
            </div>
            
            <Card className="p-4 mt-6">
              <CardTitle className="text-lg mb-4">Dark Matter & Anti-Matter Visualization</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Dark Matter Scaffolding (Stability)</Label>
                  <div className="h-40 border rounded-md relative bg-slate-50 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600 bg-opacity-30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          0.75
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 text-xs text-slate-500">Invisible Stability Structure</div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Anti-Matter Energy (Exploration)</Label>
                  <div className="h-40 border rounded-md relative bg-slate-50 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-purple-600 bg-opacity-20 flex items-center justify-center relative">
                      <div className="w-12 h-12 rounded-full bg-purple-600 bg-opacity-30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          0.25
                        </div>
                      </div>
                      {/* Energy bursts */}
                      <div className="absolute w-4 h-4 bg-purple-500 rounded-full animate-ping" style={{ top: '-10px', right: '-5px' }}></div>
                      <div className="absolute w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{ bottom: '-5px', left: '-10px' }}></div>
                      <div className="absolute w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ top: '50%', right: '-15px' }}></div>
                    </div>
                    <div className="absolute top-2 left-2 text-xs text-slate-500">Creative Bursts of Exploration</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Displaying coherence data across {Object.keys(crossScaleState).filter(k => k !== 'composite' && crossScaleState[k]).length} scales
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-[#3A5BDC] text-white">Stability: 0.7500</Badge>
          <Badge variant="outline" className="bg-[#A845D1] text-white">Exploration: 0.2494</Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MultiDimensionalCoherenceVisualizer;