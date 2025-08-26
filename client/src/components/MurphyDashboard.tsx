import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext.jsx';
import { QuantumMessageType } from '../shared/message-types.js';
import * as d3 from 'd3';

// Define the critical thresholds for visualization - matching server values
const CRITICAL_THRESHOLDS = {
  STABILITY_IDEAL: 0.7500,
  STABILITY_MIN: 0.6500,
  STABILITY_MAX: 0.8500,
  EXPLORATION_IDEAL: 0.2494,
  EXPLORATION_MIN: 0.1500,
  EXPLORATION_MAX: 0.3500,
  STABILITY_NUCLEAR_MIN: 0.5000,
  EXPLORATION_NUCLEAR_MAX: 0.5000,
};

// Interface for Murphy Protocol status updates
interface MurphySystemStatus {
  state: string;
  metrics: {
    stabilityRatio: number;
    explorationRatio: number;
    coherenceIndex: number;
    lastUpdated: string;
  };
  recoveryHistory: Array<{
    timestamp: string;
    previousState: string;
    strategyApplied: string;
    successful: boolean;
    recoveryTimeMs: number;
  }>;
}

// Interface for state changes
interface StateChangeEvent {
  previousState: string;
  newState: string;
  metrics: {
    stabilityRatio: number;
    explorationRatio: number;
    coherenceIndex: number;
  };
  reason?: string;
}

// Recovery events
interface RecoveryEvent {
  timestamp: string;
  strategy: string;
  successful: boolean;
  recoveryTimeMs: number;
  newMetrics?: any;
  reason?: string;
}

/**
 * Murphy Dashboard Component
 * Visualizes the current system stability according to Murphy's Law
 * 
 * This component implements the "Murphy Dashboard" concept described in the
 * Murphy Protocol documentation, providing real-time monitoring of stability metrics
 * and resilience testing controls as part of the QCTF system.
 */
const MurphyDashboard: React.FC = () => {
  const { sendMessage, lastMessage } = useWebSocket();
  const [systemStatus, setSystemStatus] = useState<MurphySystemStatus | null>(null);
  const [stateChanges, setStateChanges] = useState<StateChangeEvent[]>([]);
  const [recoveryEvents, setRecoveryEvents] = useState<RecoveryEvent[]>([]);
  const [nuclearEvents, setNuclearEvents] = useState<{count: number, lastEvent?: Date}>({ count: 0 });
  const [metrics, setMetrics] = useState({
    stabilityRatio: CRITICAL_THRESHOLDS.STABILITY_IDEAL,
    explorationRatio: CRITICAL_THRESHOLDS.EXPLORATION_IDEAL,
    coherenceIndex: 1.0
  });
  
  // Flag to track if system has been in deviation for an extended period
  const [extendedDeviation, setExtendedDeviation] = useState<{active: boolean, duration: number}>({
    active: false,
    duration: 0
  });
  
  // Refs for D3 visualizations
  const stabilityGaugeRef = useRef<SVGSVGElement>(null);
  const explorationGaugeRef = useRef<SVGSVGElement>(null);
  const historyChartRef = useRef<SVGSVGElement>(null);
  
  // Request status updates
  useEffect(() => {
    const interval = setInterval(() => {
      sendMessage('murphyGetStatus', { requestId: `murphy_${Date.now()}` });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [sendMessage]);
  
  // Handle incoming messages
  useEffect(() => {
    if (!lastMessage) return;
    
    try {
      if (lastMessage.type === 'murphyStatus') {
        setSystemStatus(lastMessage.payload);
        setMetrics({
          stabilityRatio: lastMessage.payload.metrics.stabilityRatio,
          explorationRatio: lastMessage.payload.metrics.explorationRatio,
          coherenceIndex: lastMessage.payload.metrics.coherenceIndex
        });
      } else if (lastMessage.type === 'murphyStateChange') {
        const stateChange = lastMessage.payload as StateChangeEvent;
        setStateChanges(prev => [stateChange, ...prev].slice(0, 10));
        
        // Special handling for nuclear events
        if (stateChange.newState === 'nuclear') {
          setNuclearEvents(prev => ({
            count: prev.count + 1,
            lastEvent: new Date()
          }));
        }
      } else if (lastMessage.type === 'murphyRecoveryCompleted') {
        const recoveryEvent = lastMessage.payload as RecoveryEvent;
        setRecoveryEvents(prev => [recoveryEvent, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('Error processing Murphy Protocol message:', error);
    }
  }, [lastMessage]);
  
  // Render stability gauge using D3
  useEffect(() => {
    if (!stabilityGaugeRef.current || !metrics) return;
    
    const svg = d3.select(stabilityGaugeRef.current);
    svg.selectAll('*').remove();
    
    const width = 200;
    const height = 120;
    const radius = Math.min(width, height) / 2;
    
    // Create gauge arc
    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
    
    const g = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height-20})`);
    
    // Background arc
    g.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#ddd')
      .attr('d', arc as any);
    
    // Create color scale for the gauge
    const colorScale = d3.scaleLinear()
      .domain([0, CRITICAL_THRESHOLDS.STABILITY_NUCLEAR_MIN, CRITICAL_THRESHOLDS.STABILITY_MIN, CRITICAL_THRESHOLDS.STABILITY_IDEAL, CRITICAL_THRESHOLDS.STABILITY_MAX, 1])
      .range(['#ff0000', '#ff6600', '#ffcc00', '#00cc00', '#ffcc00', '#ff0000']);
    
    // Value arc
    const valueArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .startAngle(-Math.PI / 2)
      .endAngle((metrics.stabilityRatio * Math.PI) - (Math.PI / 2));
    
    g.append('path')
      .style('fill', colorScale(metrics.stabilityRatio))
      .attr('d', valueArc as any);
    
    // Ideal marker
    const idealMarker = d3.arc()
      .innerRadius(radius * 0.55)
      .outerRadius(radius * 0.85)
      .startAngle((CRITICAL_THRESHOLDS.STABILITY_IDEAL * Math.PI) - (Math.PI / 2) - 0.02)
      .endAngle((CRITICAL_THRESHOLDS.STABILITY_IDEAL * Math.PI) - (Math.PI / 2) + 0.02);
    
    g.append('path')
      .style('fill', '#00cc00')
      .attr('d', idealMarker as any);
    
    // Add text labels
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -radius/2)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Stability Ratio');
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -radius/4)
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .text(metrics.stabilityRatio.toFixed(4));
    
    // Add min/max markers
    g.append('text')
      .attr('text-anchor', 'start')
      .attr('x', -radius * 0.9)
      .attr('y', 5)
      .style('font-size', '10px')
      .text('0.0');
    
    g.append('text')
      .attr('text-anchor', 'end')
      .attr('x', radius * 0.9)
      .attr('y', 5)
      .style('font-size', '10px')
      .text('1.0');
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', 5)
      .style('font-size', '10px')
      .text('0.75');
      
  }, [metrics.stabilityRatio]);
  
  // Render exploration gauge using D3
  useEffect(() => {
    if (!explorationGaugeRef.current || !metrics) return;
    
    const svg = d3.select(explorationGaugeRef.current);
    svg.selectAll('*').remove();
    
    const width = 200;
    const height = 120;
    const radius = Math.min(width, height) / 2;
    
    // Create gauge arc
    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
    
    const g = svg.append('g')
      .attr('transform', `translate(${width/2}, ${height-20})`);
    
    // Background arc
    g.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#ddd')
      .attr('d', arc as any);
    
    // Create color scale for the gauge
    const colorScale = d3.scaleLinear()
      .domain([0, CRITICAL_THRESHOLDS.EXPLORATION_MIN, CRITICAL_THRESHOLDS.EXPLORATION_IDEAL, CRITICAL_THRESHOLDS.EXPLORATION_MAX, CRITICAL_THRESHOLDS.EXPLORATION_NUCLEAR_MAX, 1])
      .range(['#ff6600', '#ffcc00', '#00cc00', '#ffcc00', '#ff0000', '#ff0000']);
    
    // Value arc
    const valueArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8)
      .startAngle(-Math.PI / 2)
      .endAngle((metrics.explorationRatio * Math.PI) - (Math.PI / 2));
    
    g.append('path')
      .style('fill', colorScale(metrics.explorationRatio))
      .attr('d', valueArc as any);
    
    // Ideal marker
    const idealMarker = d3.arc()
      .innerRadius(radius * 0.55)
      .outerRadius(radius * 0.85)
      .startAngle((CRITICAL_THRESHOLDS.EXPLORATION_IDEAL * Math.PI) - (Math.PI / 2) - 0.02)
      .endAngle((CRITICAL_THRESHOLDS.EXPLORATION_IDEAL * Math.PI) - (Math.PI / 2) + 0.02);
    
    g.append('path')
      .style('fill', '#00cc00')
      .attr('d', idealMarker as any);
    
    // Add text labels
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -radius/2)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Exploration Ratio');
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -radius/4)
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .text(metrics.explorationRatio.toFixed(4));
    
    // Add min/max markers
    g.append('text')
      .attr('text-anchor', 'start')
      .attr('x', -radius * 0.9)
      .attr('y', 5)
      .style('font-size', '10px')
      .text('0.0');
    
    g.append('text')
      .attr('text-anchor', 'end')
      .attr('x', radius * 0.9)
      .attr('y', 5)
      .style('font-size', '10px')
      .text('1.0');
    
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', 5)
      .style('font-size', '10px')
      .text('0.25');
      
  }, [metrics.explorationRatio]);
  
  // Helper function to get state color
  const getStateColor = (state: string): string => {
    switch (state) {
      case 'optimal': return '#00cc00';
      case 'warning': return '#ffcc00';
      case 'critical': return '#ff6600';
      case 'recovery': return '#6666ff';
      case 'nuclear': return '#ff0000';
      default: return '#999999';
    }
  };
  
  return (
    <div className="murphy-dashboard">
      <h2 className="text-2xl font-bold mb-4">MURPHY PROTOCOL DASHBOARD</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status Card */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">System Status</h3>
          <div className="flex items-center mb-4">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: systemStatus ? getStateColor(systemStatus.state) : '#999' }}
            />
            <div className="text-lg font-bold uppercase text-gray-900 dark:text-white">
              {systemStatus?.state || 'Unknown'}
            </div>
          </div>
          
          <div className="mb-4 text-gray-900 dark:text-white">
            <p>Last Updated: {systemStatus ? new Date(systemStatus.metrics.lastUpdated).toLocaleTimeString() : 'N/A'}</p>
            <p>Coherence Index: {metrics.coherenceIndex.toFixed(4)}</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between">
            <svg ref={stabilityGaugeRef} width="200" height="120" />
            <svg ref={explorationGaugeRef} width="200" height="120" />
          </div>
        </div>
        
        {/* Recent Events Card */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Recent Events</h3>
          
          {nuclearEvents.count > 0 && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4">
              <p className="font-bold">☢️ Nuclear Recovery Events: {nuclearEvents.count}</p>
              {nuclearEvents.lastEvent && (
                <p>Last Nuclear Event: {nuclearEvents.lastEvent.toLocaleTimeString()}</p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">State Changes</h4>
            <div className="max-h-40 overflow-y-auto">
              {stateChanges.length > 0 ? (
                <ul className="space-y-2">
                  {stateChanges.map((change, index) => (
                    <li key={index} className="text-sm border-l-4 pl-2 text-gray-900 dark:text-white" style={{ borderColor: getStateColor(change.newState) }}>
                      <span className="font-semibold">{change.previousState} → {change.newState}</span>
                      {change.reason && <span className="block italic text-xs text-gray-700 dark:text-gray-300">{change.reason}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No state changes recorded</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Recovery Actions</h4>
            <div className="max-h-40 overflow-y-auto">
              {recoveryEvents.length > 0 ? (
                <ul className="space-y-2">
                  {recoveryEvents.map((event, index) => (
                    <li key={index} className={`text-sm border-l-4 pl-2 text-gray-900 dark:text-white ${event.successful ? 'border-green-500' : 'border-red-500'}`}>
                      <span className="font-semibold">{event.strategy}</span>
                      <span className="block">
                        {event.successful ? 'Success' : 'Failed'} - {event.recoveryTimeMs}ms
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No recovery events recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Murphy Protocol Control Panel */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Murphy Control Panel</h3>
        
        <div className="p-4 mb-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h4 className="font-semibold mb-2">QCTF Threshold Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Stability Thresholds:</p>
              <ul className="list-disc pl-5">
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.STABILITY_IDEAL}</span> - Ideal stability ratio (75%)</li>
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.STABILITY_MIN}</span> - Minimum safe stability</li>
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.STABILITY_MAX}</span> - Maximum safe stability</li>
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.STABILITY_NUCLEAR_MIN}</span> - Critical threshold (nuclear)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Exploration Thresholds:</p>
              <ul className="list-disc pl-5">
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.EXPLORATION_IDEAL}</span> - Ideal exploration ratio (25%)</li>
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.EXPLORATION_MIN}</span> - Minimum safe exploration</li>
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.EXPLORATION_MAX}</span> - Maximum safe exploration</li>
                <li><span className="font-mono">{CRITICAL_THRESHOLDS.EXPLORATION_NUCLEAR_MAX}</span> - Critical threshold (nuclear)</li>
              </ul>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">These thresholds implement the 3:1 ↔ 1:3 ratio (0.7500/0.2494) creating mathematical balance between stability (75%) and exploration (25%)</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
            onClick={() => sendMessage('murphyRunChaosTest', { severity: 'warning' })}
          >
            Trigger Warning Test
          </button>
          
          <button 
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
            onClick={() => sendMessage('murphyRunChaosTest', { severity: 'critical' })}
          >
            Trigger Critical Test
          </button>
          
          <button 
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            onClick={() => sendMessage('murphyRunChaosTest', { severity: 'nuclear' })}
          >
            ☢️ Trigger Nuclear Test
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            These controls let you manually test system resilience by triggering Murphy Protocol test scenarios.
            Similar to Netflix's Chaos Monkey, this helps verify the system's ability to recover from failures.
            Use with caution - Nuclear tests will force a complete system reset!
          </p>
        </div>
      </div>
      
      {/* Murphy Protocol Information */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">About Murphy Protocol</h3>
        <p className="text-sm mb-2">
          <span className="font-semibold">Murphy's Law:</span> "Anything that can go wrong, will go wrong."
        </p>
        <p className="text-sm mb-4">
          The Murphy Protocol implements preventive and reactive measures to maintain system coherence at the ideal 
          3:1 ↔ 1:3 ratio (0.7500/0.2494) even when faced with unexpected failures or adverse conditions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border p-3 rounded-md">
            <h4 className="font-semibold mb-1">Proactive Testing</h4>
            <p>Periodically injects controlled chaos into the system to verify resilience mechanisms.</p>
          </div>
          <div className="border p-3 rounded-md">
            <h4 className="font-semibold mb-1">Auto-Recovery</h4>
            <p>Multi-tiered recovery strategies automatically restore system balance when deviations occur.</p>
          </div>
          <div className="border p-3 rounded-md">
            <h4 className="font-semibold mb-1">Persistent Memory</h4>
            <p>Maintains snapshots of optimal system states for rapid restoration after failures.</p>
          </div>
          <div className="border p-3 rounded-md">
            <h4 className="font-semibold mb-1">Nuclear Reset</h4>
            <p>Last-resort mechanism that completely resets the system to its ideal state when all else fails.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MurphyDashboard;