/**
 * Lemniscate Visualization Component
 * 
 * This component visualizes the Brazilian Wave Protocol using D3.js,
 * showing the oscillation between stability and exploration thresholds
 * across multiple temporal scales.
 */

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  STABILITY_COHERENCE, 
  EXPLORATION_COHERENCE,
  generatePreviewWaveData,
  brazilianWaveApi
} from '../lib/lemniscate/brazilian-wave-protocol.js';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Helper function to format numbers
const formatNumber = (value) => {
  return parseFloat(value.toFixed(4));
};

const LemniscateVisualization = () => {
  // State for real-time data
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [waveMode, setWaveMode] = useState('harmonic');
  const [variability, setVariability] = useState(0.12);
  const [baseCoherence, setBaseCoherence] = useState(STABILITY_COHERENCE);
  const [activeTab, setActiveTab] = useState('wave');
  const [historicalData, setHistoricalData] = useState([]);
  
  // References for SVG elements
  const svgRef = useRef(null);
  const historyChartRef = useRef(null);
  const scaleRefs = {
    micro: useRef(null),
    meso: useRef(null),
    macro: useRef(null)
  };
  
  // Fetch real-time data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await brazilianWaveApi.getVisualizationData();
        setState(response);
      } catch (err) {
        console.error("Failed to fetch visualization data:", err);
        setError("Failed to fetch visualization data");
        // Generate preview data if API fails
        const previewConfig = {
          mode: waveMode,
          baseCoherence: baseCoherence,
          variability: variability,
          useQuantumThresholds: true
        };
        const previewData = generatePreviewWaveData(100, 0, previewConfig);
        setState({ waveData: previewData });
      }
    };
    
    fetchData();
    // Fetch data at intervals
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [waveMode, variability, baseCoherence]);
  
  // Fetch historical data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await brazilianWaveApi.getHistory(50);
        setHistoricalData(history);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        // Generate fake history if API fails
        const previewConfig = {
          mode: waveMode,
          baseCoherence: baseCoherence,
          variability: variability,
          useQuantumThresholds: true
        };
        setHistoricalData(generatePreviewWaveData(50, 0, previewConfig).reverse());
      }
    };
    
    fetchHistory();
    const intervalId = setInterval(fetchHistory, 5000);
    return () => clearInterval(intervalId);
  }, [waveMode, variability, baseCoherence]);
  
  // Toggle temporal scale
  const toggleScale = async (scale) => {
    try {
      const response = await brazilianWaveApi.toggleScale(scale);
      setState({
        ...state,
        scales: {
          ...state.scales,
          [scale]: response.scales[scale]
        }
      });
    } catch (err) {
      console.error(`Failed to toggle scale ${scale}:`, err);
    }
  };
  
  // Update wave configuration
  const updateWaveConfig = async (value) => {
    setVariability(value);
    try {
      const config = {
        mode: waveMode,
        baseCoherence: baseCoherence,
        variability: value,
        useQuantumThresholds: true
      };
      await brazilianWaveApi.updateConfig(config);
    } catch (err) {
      console.error("Failed to update wave config:", err);
    }
  };
  
  // Submit feedback
  const submitFeedback = async (insightType) => {
    try {
      const feedback = {
        insightValue: Math.random() * 5,
        insightType
      };
      const response = await brazilianWaveApi.submitFeedback(feedback);
      setState({
        ...state,
        insights: [
          ...(state.insights || []),
          {
            type: insightType,
            value: feedback.insightValue,
            timestamp: new Date()
          }
        ]
      });
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };
  
  // Render wave visualization
  useEffect(() => {
    if (!state || !svgRef.current) return;
    
    // Generate visualization data if needed
    if (!state.waveData) {
      const config = {
        mode: waveMode,
        baseCoherence: baseCoherence,
        variability: variability,
        useQuantumThresholds: true
      };
      state.generateVisualizationData = generatePreviewWaveData(100, 0, config);
    }
    
    const data = state.waveData || state.generateVisualizationData;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Clear SVG
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.time)])
      .range([0, width]);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
    
    // Create axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));
    
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));
    
    // Draw stability threshold line
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", y(STABILITY_COHERENCE))
      .attr("x2", width)
      .attr("y2", y(STABILITY_COHERENCE))
      .attr("stroke", "#0a84ff")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    
    // Draw exploration threshold line
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", y(EXPLORATION_COHERENCE))
      .attr("x2", width)
      .attr("y2", y(EXPLORATION_COHERENCE))
      .attr("stroke", "#ff375f")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    
    // Add threshold labels
    svg.append("text")
      .attr("x", 5)
      .attr("y", y(STABILITY_COHERENCE) - 5)
      .attr("fill", "#0a84ff")
      .attr("font-size", "10px")
      .text(`Stability (${STABILITY_COHERENCE})`);
    
    svg.append("text")
      .attr("x", 5)
      .attr("y", y(EXPLORATION_COHERENCE) - 5)
      .attr("fill", "#ff375f")
      .attr("font-size", "10px")
      .text(`Exploration (${EXPLORATION_COHERENCE})`);
    
    // Draw combined line
    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.combined))
      .curve(d3.curveCardinal);
    
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#5e5ce6")
      .attr("stroke-width", 2.5)
      .attr("d", line);
    
    // Draw each temporal scale in its own mini chart
    drawScaleChart("micro", data, "#ff375f");
    drawScaleChart("meso", data, "#30d158");
    drawScaleChart("macro", data, "#0a84ff");
    
    // Draw historical chart
    if (historicalData.length > 0) {
      drawHistoryChart(historicalData);
    }
  }, [state, historicalData, waveMode, variability, baseCoherence]);
  
  // Draw individual temporal scale chart
  const drawScaleChart = (scale, data, color) => {
    if (!scaleRefs[scale].current) return;
    
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const width = scaleRefs[scale].current.clientWidth - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;
    
    // Clear SVG
    d3.select(scaleRefs[scale].current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(scaleRefs[scale].current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.time)])
      .range([0, width]);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
    
    // Create axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(3).tickFormat(d => d.toFixed(0)));
    
    svg.append("g")
      .call(d3.axisLeft(y).ticks(3).tickFormat(d => d.toFixed(1)));
    
    // Draw line
    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d[scale]))
      .curve(d3.curveCardinal);
    
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);
    
    // Draw stability and exploration thresholds
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", y(STABILITY_COHERENCE))
      .attr("x2", width)
      .attr("y2", y(STABILITY_COHERENCE))
      .attr("stroke", "#0a84ff")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2");
    
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", y(EXPLORATION_COHERENCE))
      .attr("x2", width)
      .attr("y2", y(EXPLORATION_COHERENCE))
      .attr("stroke", "#ff375f")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2");
  };
  
  // Draw historical chart
  const drawHistoryChart = (historyData) => {
    if (!historyChartRef.current) return;
    
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = historyChartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Clear SVG
    d3.select(historyChartRef.current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(historyChartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // X scale (index based for equal spacing)
    const x = d3.scaleLinear()
      .domain([0, historyData.length - 1])
      .range([0, width]);
    
    // Y scale for coherence values
    const yCoherence = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);
    
    // Y scale for product values
    const yProduct = d3.scaleLinear()
      .domain([0, 4])
      .range([height, 0]);
    
    // Create axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));
    
    svg.append("g")
      .call(d3.axisLeft(yCoherence).ticks(5));
    
    svg.append("g")
      .attr("transform", `translate(${width},0)`)
      .call(d3.axisRight(yProduct).ticks(5));
    
    // Draw stability threshold line
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", yCoherence(STABILITY_COHERENCE))
      .attr("x2", width)
      .attr("y2", yCoherence(STABILITY_COHERENCE))
      .attr("stroke", "#0a84ff")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    
    // Draw exploration threshold line
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", yCoherence(EXPLORATION_COHERENCE))
      .attr("x2", width)
      .attr("y2", yCoherence(EXPLORATION_COHERENCE))
      .attr("stroke", "#ff375f")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    
    // Draw QCTF product threshold line (should be ~3.0)
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", yProduct(3.0))
      .attr("x2", width)
      .attr("y2", yProduct(3.0))
      .attr("stroke", "#30d158")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");
    
    // Draw combined coherence line
    const coherenceLine = d3.line()
      .x((d, i) => x(i))
      .y(d => yCoherence(d.combined))
      .curve(d3.curveMonotoneX);
    
    svg.append("path")
      .datum(historyData)
      .attr("fill", "none")
      .attr("stroke", "#5e5ce6")
      .attr("stroke-width", 2)
      .attr("d", coherenceLine);
    
    // Draw coherence product line
    const productLine = d3.line()
      .x((d, i) => x(i))
      .y(d => yProduct(d.coherenceProduct))
      .curve(d3.curveMonotoneX);
    
    svg.append("path")
      .datum(historyData)
      .attr("fill", "none")
      .attr("stroke", "#30d158")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "2,2")
      .attr("d", productLine);
    
    // Add labels for each line
    svg.append("text")
      .attr("x", 5)
      .attr("y", 15)
      .attr("fill", "#5e5ce6")
      .attr("font-size", "10px")
      .text("Combined Coherence");
    
    svg.append("text")
      .attr("x", width - 120)
      .attr("y", 15)
      .attr("fill", "#30d158")
      .attr("font-size", "10px")
      .text("Coherence Product");
    
    // Draw data points for coherence 
    svg.selectAll(".dot")
      .data(historyData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d, i) => x(i))
      .attr("cy", d => yCoherence(d.combined))
      .attr("r", 3)
      .attr("fill", "#5e5ce6");
    
    // Draw data points for product with interactive tooltip
    svg.selectAll(".product-dot")
      .data(historyData)
      .enter()
      .append("circle")
      .attr("class", "product-dot")
      .attr("cx", (d, i) => x(i))
      .attr("cy", d => yProduct(d.coherenceProduct))
      .attr("r", 3)
      .attr("fill", "#30d158")
      .on("mouseover", function(d, i, hd) {
        d3.select(this)
          .attr("r", 5);
        
        // Add tooltip
        svg.append("text")
          .attr("id", `tooltip-${i}`)
          .attr("x", x(i) + 5)
          .attr("y", yProduct(hd[i].coherenceProduct) - 10)
          .attr("font-size", "10px")
          .text(`Product: ${formatNumber(hd[i].coherenceProduct)}`);
      })
      .on("mouseout", function(d, i) {
        d3.select(this)
          .attr("r", 3);
        
        svg.select(`#tooltip-${i}`).remove();
      });
  };
  
  // React UI rendering
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantum Coherence Visualization</CardTitle>
        <CardDescription>
          Brazilian Wave Protocol implementing the 3:1 ↔ 1:3 ratio
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wave">Wave Visualization</TabsTrigger>
            <TabsTrigger value="scales">Temporal Scales</TabsTrigger>
            <TabsTrigger value="history">Historical Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wave" className="mt-4">
            <div className="flex flex-col gap-4">
              <div className="visualization-container">
                <svg ref={svgRef} width="100%" height="300"></svg>
              </div>
              
              <div className="controls flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="wave-mode">Wave Mode:</Label>
                  <div className="flex gap-2">
                    {['harmonic', 'chaotic', 'resonant', 'quantum'].map((mode) => (
                      <Button 
                        key={mode}
                        size="sm"
                        variant={waveMode === mode ? "default" : "outline"}
                        onClick={() => setWaveMode(mode)}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Label htmlFor="variability" className="w-36">Variability:</Label>
                  <Slider
                    id="variability"
                    min={0.05}
                    max={0.5}
                    step={0.01}
                    value={[variability]}
                    onValueChange={(value) => updateWaveConfig(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{variability.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span>Current Coherence:</span>
                  {state && (
                    <Badge 
                      variant={
                        state.currentCoherence >= STABILITY_COHERENCE 
                          ? "default"
                          : state.currentCoherence <= EXPLORATION_COHERENCE
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {state.currentCoherence 
                        ? formatNumber(state.currentCoherence)
                        : "N/A"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scales" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["micro", "meso", "macro"].map((scale, index) => {
                const label = {
                  micro: "Micro Scale (Fast)",
                  meso: "Meso Scale (Medium)",
                  macro: "Macro Scale (Slow)"
                }[scale];
                
                return (
                  <Card key={scale}>
                    <CardHeader className="p-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">{label}</CardTitle>
                        <Badge 
                          variant={state?.temporalScales?.[scale]?.active ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleScale(scale)}
                        >
                          {state?.temporalScales?.[scale]?.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <svg ref={scaleRefs[scale]} width="100%" height="100"></svg>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="visualization-container">
              <svg ref={historyChartRef} width="100%" height="300"></svg>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Recent Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {state?.insights?.slice(0, 8).map((insight, idx) => (
                  <Badge 
                    key={idx} 
                    variant={insight.type === 'creative' ? 'destructive' : 'default'}
                    className="justify-between"
                  >
                    {insight.type} <span>{formatNumber(insight.value)}</span>
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-center mt-4 gap-2">
                <Button onClick={() => submitFeedback('creative')}>Add Creative Insight</Button>
                <Button onClick={() => submitFeedback('structured')}>Add Structured Insight</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Stability Threshold: {STABILITY_COHERENCE} (3:1 ratio)
          </p>
          <p className="text-sm text-muted-foreground">
            Exploration Threshold: {EXPLORATION_COHERENCE} (1:3 ratio)
          </p>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline">
                  {state?.insights?.length || 0} insights
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total insights generated</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {state?.timestamp ? new Date(state.timestamp).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </CardFooter>
      
      <style jsx>{`
        .visualization-container {
          width: 100%;
          height: 300px;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `}</style>
    </Card>
  );
};

export default LemniscateVisualization;