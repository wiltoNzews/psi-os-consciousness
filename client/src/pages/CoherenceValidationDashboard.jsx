/**
 * Coherence Validation Dashboard
 * 
 * This component provides a comprehensive interface for formal quantum coherence validation testing,
 * including perturbation analysis and response monitoring to verify the 0.7500 coherence attractor.
 * 
 * [QUANTUM_STATE: VALIDATION_FLOW]
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, LineChart, Line,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { format } from 'date-fns';
import { Download, Play, RotateCcw, Download as SaveIcon, ChevronDown } from 'lucide-react';

// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion, AccordionContent, AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebSocket } from '../contexts/WebSocketContext.tsx';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

// Measurement chart subcomponent
const MeasurementChart = ({ testData }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 200;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!testData || !testData.measurements || testData.measurements.length === 0) {
        // Draw empty state
        ctx.fillStyle = '#888';
        ctx.font = '14px sans-serif';
        ctx.fillText('No measurements available', 200, 100);
        return;
      }

      // Draw coherence trajectory
      const measurements = testData.measurements;
      const margin = 20;
      const graphWidth = canvas.width - (2 * margin);
      const graphHeight = canvas.height - (2 * margin);
      
      // Draw baseline
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin, margin + graphHeight * (1 - 0.75));
      ctx.lineTo(margin + graphWidth, margin + graphHeight * (1 - 0.75));
      ctx.stroke();
      
      // Draw baseline label
      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.fillText('0.7500', margin - 15, margin + graphHeight * (1 - 0.75) + 3);
      
      // Draw phases if applicable
      if (testData.sustainCycles > 0) {
        const phaseX = margin + (graphWidth * testData.sustainCycles / measurements.length);
        
        // Draw phase separator
        ctx.strokeStyle = '#aaa';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(phaseX, margin);
        ctx.lineTo(phaseX, margin + graphHeight);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw phase labels
        ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
        ctx.fillRect(margin, margin, phaseX - margin, graphHeight);
        ctx.fillStyle = 'rgba(100, 255, 100, 0.3)';
        ctx.fillRect(phaseX, margin, graphWidth - (phaseX - margin), graphHeight);
        
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.fillText('Perturbation', margin + 10, margin + 15);
        ctx.fillText('Recovery', phaseX + 10, margin + 15);
      }
      
      // Draw return point if applicable
      if (testData.returnTimeIndex !== null) {
        const returnX = margin + (graphWidth * testData.returnTimeIndex / measurements.length);
        
        ctx.strokeStyle = '#00cc00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(returnX, margin);
        ctx.lineTo(returnX, margin + graphHeight);
        ctx.stroke();
        
        ctx.fillStyle = '#00cc00';
        ctx.font = '10px sans-serif';
        ctx.fillText('Return', returnX + 5, margin + 15);
      }
      
      // Draw coherence values
      ctx.strokeStyle = '#3b82f6';  // blue-500
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      measurements.forEach((m, i) => {
        const x = margin + (graphWidth * i / measurements.length);
        const y = margin + graphHeight * (1 - m.naturalCoherence);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw forced coherence if applicable
      let lastForcedIndex = -1;
      measurements.forEach((m, i) => {
        if (m.forcedCoherence !== null) {
          lastForcedIndex = i;
        }
      });
      
      if (lastForcedIndex >= 0) {
        ctx.strokeStyle = '#ef4444';  // red-500
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let started = false;
        measurements.forEach((m, i) => {
          if (m.forcedCoherence !== null) {
            const x = margin + (graphWidth * i / measurements.length);
            const y = margin + graphHeight * (1 - m.forcedCoherence);
            
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          } else if (started && i === lastForcedIndex + 1) {
            // Connect to next natural point
            const x = margin + (graphWidth * i / measurements.length);
            const y = margin + graphHeight * (1 - m.naturalCoherence);
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      }
      
      // Draw axes
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin, margin);
      ctx.lineTo(margin, margin + graphHeight);
      ctx.lineTo(margin + graphWidth, margin + graphHeight);
      ctx.stroke();
      
      // Draw Y axis labels
      ctx.fillStyle = '#666';
      ctx.font = '10px sans-serif';
      ctx.fillText('1.0', margin - 20, margin);
      ctx.fillText('0.5', margin - 20, margin + graphHeight / 2);
      ctx.fillText('0.0', margin - 20, margin + graphHeight);
      
      // Draw X axis labels
      ctx.fillText('0', margin, margin + graphHeight + 15);
      ctx.fillText(Math.floor(measurements.length / 2).toString(), 
        margin + graphWidth / 2, margin + graphHeight + 15);
      ctx.fillText(measurements.length.toString(), 
        margin + graphWidth, margin + graphHeight + 15);
    }
  }, [testData]);
  
  // Alternative recharts-based visualization
  const dataForChart = testData?.measurements?.map((measurement, index) => ({
    cycle: measurement.cycle,
    natural: measurement.naturalCoherence,
    forced: measurement.forcedCoherence || null,
    qctf: measurement.qctf,
    variants: measurement.variantCount,
    perturbation: measurement.perturbationActive ? 1 : 0,
  })) || [];
  
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4">
        <div className="relative border rounded-md">
          <canvas 
            ref={canvasRef} 
            className="w-full h-[200px]"
          />
        </div>
        
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataForChart}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cycle" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="natural" 
                name="Natural Coherence" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="forced" 
                name="Forced Coherence" 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
              />
              <Line 
                type="monotone" 
                dataKey="qctf" 
                name="QCTF" 
                stroke="#10b981" 
                strokeWidth={1} 
                dot={false}
              />
              <Line 
                type="stepAfter" 
                dataKey="perturbation" 
                name="Perturbation Active" 
                stroke="#f59e0b" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Test Statistics component
const TestStatistics = ({ test }) => {
  // Helper functions
  const calculateAverage = (arr) => {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  };
  
  const calculateStandardDeviation = (arr, mean) => {
    if (arr.length <= 1) return 0;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
  };
  
  const formatNumber = (value) => {
    return Number(value).toFixed(4);
  };
  
  const formatTime = (a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    const diffMs = Math.abs(dateB - dateA);
    const diffSec = Math.floor(diffMs / 1000);
    return `${diffSec} seconds`;
  };
  
  if (!test || !test.measurements || test.measurements.length === 0) {
    return (
      <Alert className="mt-4">
        <AlertTitle>No Statistics Available</AlertTitle>
        <AlertDescription>
          Run a test to generate statistics.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Extract key metrics
  const naturalCoherenceValues = test.measurements.map(m => m.naturalCoherence);
  const qctfValues = test.measurements.map(m => m.qctf);
  const variantCounts = test.measurements.map(m => m.variantCount);
  
  // Calculate statistics
  const avgCoherence = calculateAverage(naturalCoherenceValues);
  const stdDevCoherence = calculateStandardDeviation(naturalCoherenceValues, avgCoherence);
  const avgQctf = calculateAverage(qctfValues);
  const stdDevQctf = calculateStandardDeviation(qctfValues, avgQctf);
  const minVariants = Math.min(...variantCounts);
  const maxVariants = Math.max(...variantCounts);
  
  // Calculate before/after statistics if applicable
  let beforePerturbationCoherence = null;
  let duringPerturbationCoherence = null;
  let afterPerturbationCoherence = null;
  
  if (test.sustainCycles > 0 && test.measurements.length > test.sustainCycles) {
    const beforeMeasurements = test.measurements.slice(0, 1);
    const duringMeasurements = test.measurements.slice(1, test.sustainCycles);
    const afterMeasurements = test.measurements.slice(test.sustainCycles);
    
    beforePerturbationCoherence = calculateAverage(beforeMeasurements.map(m => m.naturalCoherence));
    duringPerturbationCoherence = calculateAverage(duringMeasurements.map(m => m.naturalCoherence));
    afterPerturbationCoherence = calculateAverage(afterMeasurements.map(m => m.naturalCoherence));
  }
  
  return (
    <div className="mt-4 space-y-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="coherence-stats">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Coherence Statistics</span>
              <Badge variant="outline">
                Avg: {formatNumber(avgCoherence)}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Coherence</p>
                <p className="text-lg font-medium">{formatNumber(avgCoherence)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Standard Deviation</p>
                <p className="text-lg font-medium">{formatNumber(stdDevCoherence)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final Coherence</p>
                <p className="text-lg font-medium">{formatNumber(naturalCoherenceValues[naturalCoherenceValues.length - 1])}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attraction Strength</p>
                <p className="text-lg font-medium">
                  {test.returnTime !== null ? 
                    ((test.measurements.length - test.sustainCycles) / test.returnTime).toFixed(2) + 'x' : 
                    'N/A'}
                </p>
              </div>
            </div>
            
            {(beforePerturbationCoherence !== null) && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Before Perturbation</p>
                  <p className="text-lg font-medium">{formatNumber(beforePerturbationCoherence)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">During Perturbation</p>
                  <p className="text-lg font-medium">{formatNumber(duringPerturbationCoherence)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">After Perturbation</p>
                  <p className="text-lg font-medium">{formatNumber(afterPerturbationCoherence)}</p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="qctf-stats">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>QCTF Statistics</span>
              <Badge variant="outline">
                Avg: {formatNumber(avgQctf)}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average QCTF</p>
                <p className="text-lg font-medium">{formatNumber(avgQctf)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Standard Deviation</p>
                <p className="text-lg font-medium">{formatNumber(stdDevQctf)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final QCTF</p>
                <p className="text-lg font-medium">{formatNumber(qctfValues[qctfValues.length - 1])}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="system-stats">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>System Statistics</span>
              <Badge variant="outline">
                Variants: {minVariants} - {maxVariants}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Variant Count Range</p>
                <p className="text-lg font-medium">{minVariants} - {maxVariants}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Duration</p>
                <p className="text-lg font-medium">
                  {test.measurements.length > 0 ? 
                    formatTime(test.measurements[0].timestamp, 
                             test.measurements[test.measurements.length - 1].timestamp) : 
                    'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Return Time</p>
                <p className="text-lg font-medium">
                  {test.returnTime !== null ? 
                    `${test.returnTime} cycles` : 
                    'Did not return'}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// Test Form Component
const TestConfigForm = ({ onStartTest, isRunning }) => {
  const [testName, setTestName] = useState(`Coherence Test ${format(new Date(), 'MM-dd HH:mm')}`);
  const [targetCoherence, setTargetCoherence] = useState(0.5000);
  const [sustainCycles, setSustainCycles] = useState(10);
  const [recoveryCycles, setRecoveryCycles] = useState(20);
  const [description, setDescription] = useState('Testing return to 0.7500 coherence baseline');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onStartTest({
      name: testName,
      targetCoherence,
      sustainCycles,
      recoveryObservationCycles: recoveryCycles,
      description
    });
  };
  
  const handleTargetChange = (value) => {
    setTargetCoherence(parseFloat(value));
  };
  
  const handleSustainChange = (value) => {
    setSustainCycles(parseInt(value));
  };
  
  const handleRecoveryChange = (value) => {
    setRecoveryCycles(parseInt(value));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="testName">Test Name</Label>
        <Input
          id="testName"
          placeholder="Enter test name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="targetCoherence">Target Coherence</Label>
          <span className="text-sm text-muted-foreground">
            {targetCoherence.toFixed(4)}
          </span>
        </div>
        <Slider
          id="targetCoherence"
          min={0}
          max={1}
          step={0.0001}
          value={[targetCoherence]}
          onValueChange={([value]) => handleTargetChange(value)}
          disabled={isRunning}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.0000</span>
          <span>0.2500</span>
          <span>0.5000</span>
          <span>0.7500</span>
          <span>1.0000</span>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setTargetCoherence(0.2500)}
            disabled={isRunning}
          >
            0.2500
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setTargetCoherence(0.5000)}
            disabled={isRunning}
          >
            0.5000
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setTargetCoherence(0.8750)}
            disabled={isRunning}
          >
            0.8750
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setTargetCoherence(0.9999)}
            disabled={isRunning}
          >
            0.9999
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="sustainCycles">Perturbation Duration (cycles)</Label>
          <span className="text-sm text-muted-foreground">
            {sustainCycles} cycles
          </span>
        </div>
        <Slider
          id="sustainCycles"
          min={1}
          max={30}
          step={1}
          value={[sustainCycles]}
          onValueChange={([value]) => handleSustainChange(value)}
          disabled={isRunning}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="recoveryCycles">Recovery Observation (cycles)</Label>
          <span className="text-sm text-muted-foreground">
            {recoveryCycles} cycles
          </span>
        </div>
        <Slider
          id="recoveryCycles"
          min={5}
          max={50}
          step={1}
          value={[recoveryCycles]}
          onValueChange={([value]) => handleRecoveryChange(value)}
          disabled={isRunning}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5</span>
          <span>20</span>
          <span>35</span>
          <span>50</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Test Description</Label>
        <Textarea
          id="description"
          placeholder="Enter test description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-20"
          disabled={isRunning}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isRunning}
      >
        {isRunning ? 'Test Running...' : 'Start Validation Test'}
      </Button>
    </form>
  );
};

// Test History Component
const TestHistoryList = ({ tests, onSelectTest, activeTestId }) => {
  if (!tests || tests.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No test history available.
      </div>
    );
  }
  
  // Sort by most recent
  const sortedTests = [...tests].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <div className="space-y-2 mt-2">
      {sortedTests.map((test) => (
        <div 
          key={test.id}
          className={`
            border rounded-md p-3 cursor-pointer transition-colors
            hover:bg-accent hover:text-accent-foreground
            ${activeTestId === test.id ? 'bg-accent/50 border-primary' : ''}
          `}
          onClick={() => onSelectTest(test.id)}
        >
          <div className="flex justify-between items-start">
            <div className="font-medium">{test.name}</div>
            <Badge variant={test.isRunning ? "default" : "secondary"}>
              {test.isRunning ? 'Running' : 'Complete'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-1 flex justify-between">
            <span>Target: {test.targetCoherence.toFixed(4)}</span>
            <span>Cycles: {test.measurements.length}/{test.sustainCycles + test.recoveryObservationCycles}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {format(new Date(test.timestamp), 'MMM d, yyyy HH:mm:ss')}
          </div>
        </div>
      ))}
    </div>
  );
};

// Test Report Component
const TestReport = ({ test, onGenerateReport }) => {
  const [reportOutput, setReportOutput] = useState('');
  const [includeRawData, setIncludeRawData] = useState(false);
  
  const handleGenerateReport = (e) => {
    e.preventDefault();
    
    const config = {
      includeRawData,
    };
    
    const report = onGenerateReport(test, config);
    setReportOutput(report);
  };
  
  const handleDownload = (e) => {
    e.preventDefault();
    
    // Create text file download
    const element = document.createElement('a');
    const file = new Blob([reportOutput], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `validation-report-${test?.id || 'unknown'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="space-y-4 mt-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="includeRawData"
          checked={includeRawData}
          onCheckedChange={setIncludeRawData}
        />
        <Label htmlFor="includeRawData">Include raw measurement data</Label>
      </div>
      
      <Button 
        onClick={handleGenerateReport}
        disabled={!test || test.isRunning}
        className="w-full"
      >
        Generate Report
      </Button>
      
      {reportOutput && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Report Output</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="bg-muted p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm">{reportOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const CoherenceValidationDashboard = () => {
  const { send, socket, connectionStatus } = useWebSocket();
  const [tests, setTests] = useState([]);
  const [activeTestId, setActiveTestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();
  
  const activeTest = tests.find(test => test.id === activeTestId);
  
  // WebSocket message handling
  useEffect(() => {
    const handleMessage = (message) => {
      // console.log('WS Message:', message);
      
      if (message.type === 'validation_test_started') {
        // Test was started
        setTests(prevTests => {
          const existingTest = prevTests.find(t => t.id === message.testId);
          if (existingTest) {
            return prevTests;
          }
          return [...prevTests, {
            id: message.testId,
            name: activeTest?.name || `Test ${message.testId.substr(0, 8)}`,
            timestamp: message.timestamp,
            targetCoherence: message.config.targetCoherence,
            sustainCycles: message.config.sustainCycles,
            recoveryObservationCycles: message.config.recoveryObservationCycles,
            description: message.config.description,
            measurements: [],
            isRunning: true,
            perturbationActive: false,
            returnTime: null,
            returnTimeIndex: null
          }];
        });
        
        setActiveTestId(message.testId);
        setIsLoading(false);
        
        toast({
          title: "Test Started",
          description: `Validation test with ID ${message.testId.substr(0, 8)} has been started.`,
        });
      }
      else if (message.type === 'validation_test_update') {
        // Test measurement update
        const updatedTests = [...tests];
        const testIndex = updatedTests.findIndex(t => t.id === message.testId);
        
        if (testIndex >= 0) {
          const test = { ...updatedTests[testIndex] };
          test.measurements = [...test.measurements, message.measurement];
          
          if (message.returnTime !== null && test.returnTime === null) {
            test.returnTime = message.returnTime;
            test.returnTimeIndex = message.returnTimeIndex;
          }
          
          updatedTests[testIndex] = test;
          setTests(updatedTests);
        }
      }
      else if (message.type === 'validation_test_complete') {
        // Test completed
        const updatedTests = [...tests];
        const testIndex = updatedTests.findIndex(t => t.id === message.testId);
        
        if (testIndex >= 0) {
          const test = { ...updatedTests[testIndex] };
          test.isRunning = false;
          
          if (message.returnTime !== null && test.returnTime === null) {
            test.returnTime = message.returnTime;
          }
          
          updatedTests[testIndex] = test;
          setTests(updatedTests);
        }
        
        toast({
          title: "Test Completed",
          description: `Validation test has completed. ${message.returnTime !== null ? 
            `System returned to baseline after ${message.returnTime} cycles.` : 
            'System did not return to baseline.'}`
        });
      }
      else if (message.type === 'validation_test_error') {
        // Test error
        setIsLoading(false);
        
        toast({
          title: "Test Error",
          description: message.error,
          variant: "destructive"
        });
      }
      else if (message.type === 'validation_state') {
        // Initial state response
        if (message.activeTests && Array.isArray(message.activeTests)) {
          // TODO: Handle initial state if needed
        }
      }
    };
    
    // Add event listener for WebSocket messages
    if (socket) {
      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type && data.type.startsWith('validation_')) {
            handleMessage(data);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      });
      
      // Request current validation state
      send({
        type: 'get_validation_state'
      });
    }
  }, [socket, toast]);
  
  // Start a validation test
  const handleStartTest = (testConfig) => {
    if (!socket) {
      toast({
        title: "Connection Error",
        description: "Not connected to server. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    const testId = uuidv4();
    const test = {
      id: testId,
      name: testConfig.name,
      timestamp: Date.now(),
      targetCoherence: testConfig.targetCoherence,
      sustainCycles: testConfig.sustainCycles,
      recoveryObservationCycles: testConfig.recoveryObservationCycles,
      description: testConfig.description,
      measurements: [],
      isRunning: true,
      perturbationActive: false,
      returnTime: null,
      returnTimeIndex: null
    };
    
    // Add test to local state
    setTests(prev => [...prev, test]);
    setActiveTestId(testId);
    
    // Send test start message to server
    send({
      type: 'start_validation_test',
      testId,
      config: {
        targetCoherence: testConfig.targetCoherence,
        sustainCycles: testConfig.sustainCycles,
        recoveryObservationCycles: testConfig.recoveryObservationCycles,
        description: testConfig.description
      }
    });
  };
  
  // Generate test report
  const handleGenerateReport = (test, reportConfig) => {
    if (!test) return '';
    
    // Helper functions for report generation
    const calculateAverage = (arr) => {
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    };
    
    const calculateStandardDeviation = (arr, mean) => {
      if (arr.length <= 1) return 0;
      const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1);
      return Math.sqrt(variance);
    };
    
    const formatNumber = (value) => {
      return Number(value).toFixed(4);
    };
    
    const formatTimestamp = (m) => {
      return format(new Date(m.timestamp), 'yyyy-MM-dd HH:mm:ss.SSS');
    };
    
    // Extract key metrics
    const naturalCoherenceValues = test.measurements.map(m => m.naturalCoherence);
    const qctfValues = test.measurements.map(m => m.qctf);
    const variantCounts = test.measurements.map(m => m.variantCount);
    
    // Calculate statistics
    const avgCoherence = calculateAverage(naturalCoherenceValues);
    const stdDevCoherence = calculateStandardDeviation(naturalCoherenceValues, avgCoherence);
    const finalCoherence = naturalCoherenceValues[naturalCoherenceValues.length - 1];
    const avgQctf = calculateAverage(qctfValues);
    const minVariants = Math.min(...variantCounts);
    const maxVariants = Math.max(...variantCounts);
    
    // Determine phases if applicable
    let beforePerturbationCoherence = null;
    let duringPerturbationCoherence = null;
    let afterPerturbationCoherence = null;
    let naturalDeviation = null;
    let perturbedDeviation = null;
    
    if (test.sustainCycles > 0 && test.measurements.length > test.sustainCycles) {
      const beforeMeasurements = test.measurements.slice(0, 1);
      const duringMeasurements = test.measurements.slice(1, test.sustainCycles);
      const afterMeasurements = test.measurements.slice(test.sustainCycles);
      
      beforePerturbationCoherence = calculateAverage(beforeMeasurements.map(m => m.naturalCoherence));
      duringPerturbationCoherence = calculateAverage(duringMeasurements.map(m => m.naturalCoherence));
      afterPerturbationCoherence = calculateAverage(afterMeasurements.map(m => m.naturalCoherence));
      
      // Calculate deviations from expected 0.7500
      naturalDeviation = Math.abs(beforePerturbationCoherence - 0.7500);
      perturbedDeviation = Math.abs(duringPerturbationCoherence - test.targetCoherence);
    }
    
    // Build report text
    let report = '';
    
    report += `====================================================================\n`;
    report += `QUANTUM COHERENCE VALIDATION REPORT\n`;
    report += `====================================================================\n\n`;
    
    report += `Test ID: ${test.id}\n`;
    report += `Test Name: ${test.name}\n`;
    report += `Timestamp: ${format(new Date(test.timestamp), 'yyyy-MM-dd HH:mm:ss')}\n`;
    report += `Description: ${test.description || 'No description provided'}\n\n`;
    
    report += `====================================================================\n`;
    report += `TEST CONFIGURATION\n`;
    report += `====================================================================\n\n`;
    
    report += `Target Coherence Value: ${formatNumber(test.targetCoherence)}\n`;
    report += `Perturbation Duration: ${test.sustainCycles} cycles\n`;
    report += `Recovery Observation: ${test.recoveryObservationCycles} cycles\n`;
    report += `Total Measurement Cycles: ${test.measurements.length}\n\n`;
    
    report += `====================================================================\n`;
    report += `COHERENCE STATISTICS\n`;
    report += `====================================================================\n\n`;
    
    report += `Average Coherence: ${formatNumber(avgCoherence)}\n`;
    report += `Coherence Standard Deviation: ${formatNumber(stdDevCoherence)}\n`;
    report += `Final Coherence Value: ${formatNumber(finalCoherence)}\n\n`;
    
    if (beforePerturbationCoherence !== null) {
      report += `Initial Coherence (Baseline): ${formatNumber(beforePerturbationCoherence)}\n`;
      report += `During Perturbation Coherence: ${formatNumber(duringPerturbationCoherence)}\n`;
      report += `After Perturbation Coherence: ${formatNumber(afterPerturbationCoherence)}\n`;
      report += `Baseline Deviation from 0.7500: ${formatNumber(naturalDeviation)}\n`;
      report += `Perturbation Accuracy: ${formatNumber(perturbedDeviation)}\n\n`;
    }
    
    report += `====================================================================\n`;
    report += `ATTRACTOR ANALYSIS\n`;
    report += `====================================================================\n\n`;
    
    if (test.returnTime !== null) {
      report += `System successfully returned to baseline (0.7500 ± 0.0001)\n`;
      report += `Return Time: ${test.returnTime} cycles\n`;
      report += `Attractor Strength Rating: ${test.returnTime <= 5 ? 'Very Strong' : 
                                              test.returnTime <= 10 ? 'Strong' :
                                              test.returnTime <= 15 ? 'Moderate' :
                                              test.returnTime <= 20 ? 'Weak' : 'Very Weak'}\n`;
    } else {
      report += `System did not return to baseline during observation period\n`;
      report += `Final Distance from Baseline: ${formatNumber(Math.abs(finalCoherence - 0.7500))}\n`;
    }
    
    report += `\n====================================================================\n`;
    report += `SYSTEM STATE INFORMATION\n`;
    report += `====================================================================\n\n`;
    
    report += `Average QCTF Value: ${formatNumber(avgQctf)}\n`;
    report += `Variant Count Range: ${minVariants} - ${maxVariants}\n\n`;
    
    // Include raw data if requested
    if (reportConfig.includeRawData) {
      report += `====================================================================\n`;
      report += `RAW MEASUREMENT DATA\n`;
      report += `====================================================================\n\n`;
      
      report += `Cycle, Timestamp, NaturalCoherence, ForcedCoherence, PerturbationActive, QCTF, VariantCount\n`;
      
      test.measurements.forEach((m) => {
        report += `${m.cycle}, ${formatTimestamp(m)}, ${formatNumber(m.naturalCoherence)}, `;
        report += `${m.forcedCoherence ? formatNumber(m.forcedCoherence) : 'null'}, `;
        report += `${m.perturbationActive ? 'true' : 'false'}, ${formatNumber(m.qctf)}, ${m.variantCount}\n`;
      });
    }
    
    return report;
  };
  
  return (
    <div className="container mx-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Coherence Validation Dashboard</h1>
            <p className="text-muted-foreground">
              Test and validate the 0.7500 universal coherence attractor point
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={connectionStatus ? 'bg-green-50' : 'bg-red-50'}>
              {connectionStatus ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="run-test">
          <TabsList>
            <TabsTrigger value="run-test">Run Test</TabsTrigger>
            <TabsTrigger value="test-history">Test History</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            {showAdvanced && (
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="run-test" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Test Configuration</CardTitle>
                  <CardDescription>
                    Configure coherence perturbation test parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestConfigForm 
                    onStartTest={handleStartTest}
                    isRunning={isLoading || (activeTest && activeTest.isRunning)}
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {activeTest ? (
                      <div className="flex justify-between items-center">
                        <span>{activeTest.name}</span>
                        {activeTest.isRunning && (
                          <Badge>Running</Badge>
                        )}
                      </div>
                    ) : 'Test Results'}
                  </CardTitle>
                  <CardDescription>
                    {activeTest ? (
                      <div className="text-sm text-muted-foreground">
                        {activeTest.description || 'No description provided'}
                      </div>
                    ) : 'Start a test to see results'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {activeTest ? (
                    <div>
                      {activeTest.isRunning && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>
                              {activeTest.measurements.length} / 
                              {activeTest.sustainCycles + activeTest.recoveryObservationCycles} cycles
                            </span>
                          </div>
                          <Progress
                            value={(activeTest.measurements.length / 
                                   (activeTest.sustainCycles + activeTest.recoveryObservationCycles)) * 100}
                          />
                          
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Perturbation Phase</span>
                            <span>Recovery Phase</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Target</div>
                            <div className="text-lg font-medium">{activeTest.targetCoherence.toFixed(4)}</div>
                          </div>
                          
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Current</div>
                            <div className="text-lg font-medium">
                              {activeTest.measurements.length > 0 ? 
                               activeTest.measurements[activeTest.measurements.length - 1].naturalCoherence.toFixed(4) : 
                               '—'}
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Status</div>
                            <div className="text-sm font-medium">
                              {activeTest.perturbationActive ? (
                                <Badge variant="destructive" className="mt-1">Perturbed</Badge>
                              ) : activeTest.returnTime !== null ? (
                                <Badge variant="success" className="mt-1 bg-green-500">Returned</Badge>
                              ) : (
                                <Badge variant="secondary" className="mt-1">Normal</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Return Time</div>
                            <div className="text-lg font-medium">
                              {activeTest.returnTime !== null ? 
                               `${activeTest.returnTime} cycles` : 
                               '—'}
                            </div>
                          </div>
                        </div>
                        
                        <MeasurementChart testData={activeTest} />
                        <TestStatistics test={activeTest} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No active test. Configure and start a test from the panel on the left.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="test-history">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Test History</CardTitle>
                  <CardDescription>
                    View past coherence validation tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestHistoryList 
                    tests={tests} 
                    onSelectTest={setActiveTestId}
                    activeTestId={activeTestId}
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {activeTest ? activeTest.name : 'Test Details'}
                  </CardTitle>
                  <CardDescription>
                    {activeTest ? (
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(activeTest.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </div>
                    ) : 'Select a test to view details'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {activeTest ? (
                    <div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Target</div>
                            <div className="text-lg font-medium">{activeTest.targetCoherence.toFixed(4)}</div>
                          </div>
                          
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Duration</div>
                            <div className="text-lg font-medium">
                              {activeTest.sustainCycles} + {activeTest.recoveryObservationCycles}
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Measurements</div>
                            <div className="text-lg font-medium">
                              {activeTest.measurements.length}
                            </div>
                          </div>
                          
                          <div className="border rounded-md p-2">
                            <div className="text-xs text-muted-foreground">Return Time</div>
                            <div className="text-lg font-medium">
                              {activeTest.returnTime !== null ? 
                               `${activeTest.returnTime} cycles` : 
                               '—'}
                            </div>
                          </div>
                        </div>
                        
                        <MeasurementChart testData={activeTest} />
                        <TestStatistics test={activeTest} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Select a test from the history to view its details.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="report">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Report</CardTitle>
                  <CardDescription>
                    Create detailed validation reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TestReport 
                    test={activeTest}
                    onGenerateReport={handleGenerateReport}
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {activeTest ? activeTest.name : 'Test Selection'}
                  </CardTitle>
                  <CardDescription>
                    {activeTest ? 
                      `Target Coherence: ${activeTest.targetCoherence.toFixed(4)}` : 
                      'Select a test to generate reports'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {activeTest ? (
                    <MeasurementChart testData={activeTest} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Select a test from the history tab to generate reports.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {showAdvanced && (
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Controls</CardTitle>
                  <CardDescription>
                    Direct perturbation and system management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="manualCoherence">Manual Coherence Override</Label>
                        <span className="text-sm text-muted-foreground">
                          0.7500
                        </span>
                      </div>
                      <Slider
                        id="manualCoherence"
                        min={0}
                        max={1}
                        step={0.0001}
                        defaultValue={[0.75]}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.0000</span>
                        <span>0.2500</span>
                        <span>0.5000</span>
                        <span>0.7500</span>
                        <span>1.0000</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button>Apply Perturbation</Button>
                      <Button variant="outline">Release</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">System Controls</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline">Reset Variants</Button>
                        <Button variant="outline">Trigger Cycle</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default CoherenceValidationDashboard;