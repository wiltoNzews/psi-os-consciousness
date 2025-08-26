/**
 * Meta-Cognitive Insights Dashboard Component
 * 
 * This component provides a real-time dashboard for displaying meta-cognitive insights and patterns
 * from the system's self-reflective analysis capabilities.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from '@/lib/utils';

// Types for meta-cognitive insights
interface CognitiveInsight {
  id: string;
  nodeId?: string;
  timestamp: string;
  createdAt: string;
  description: string;
  severity: string;
  impact: number;
  strategicLayer: number;
  relatedPatternIds: string[];
  recommendations: string[];
}

// Types for meta-cognitive patterns
interface CognitivePattern {
  id: string;
  nodeIds: string[];
  type: string;
  description: string;
  confidence: number;
  strategicLayer: number;
  firstObserved: string;
  lastObserved: string;
  occurrences: number;
  relatedPatternIds: string[];
}

// Types for meta-cognitive service stats
interface ServiceStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  patternRequestsCount: number;
  insightRequestsCount: number;
  lastUpdated: string;
  totalPatterns: number;
  totalInsights: number;
  patternsByType: Record<string, number>;
  insightsBySeverity: Record<string, number>;
}

const MetaCognitiveInsights: React.FC = () => {
  const { connected, sendMessage } = useWebSocket();
  const [subscriptionId, setSubscriptionId] = useState<string>('');
  const [insights, setInsights] = useState<CognitiveInsight[]>([]);
  const [patterns, setPatterns] = useState<CognitivePattern[]>([]);
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [activeTab, setActiveTab] = useState('insights');
  
  // Filters
  const [nodeIdFilter, setNodeIdFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [patternTypeFilter, setPatternTypeFilter] = useState<string>('');
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(0);
  
  // Handle WebSocket messages using window event listener
  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      // Only process messages from our WebSocket
      if (event.origin !== window.location.origin || !event.data || event.data.source !== 'websocket') {
        return;
      }
      
      const message = event.data.data;
      if (!message || !message.type) return;
      
      // Only process meta-cognitive messages
      if (!message.type.startsWith('metacognitive_')) {
        return;
      }
      
      console.log('Received meta-cognitive message:', message.type);
      
      switch (message.type) {
        case 'metacognitive_subscribed':
          setSubscriptionId(message.payload.subscriptionId);
          console.log('Subscribed to meta-cognitive updates:', message.payload.subscriptionId);
          break;
          
        case 'metacognitive_insights_update':
        case 'metacognitive_insights_result':
          setInsights(prevInsights => {
            // Merge new insights with existing ones, avoiding duplicates
            const newInsightsMap = new Map<string, CognitiveInsight>([
              ...prevInsights.map(insight => [insight.id, insight]),
              ...message.payload.map((insight: CognitiveInsight) => [insight.id, insight])
            ]);
            return Array.from(newInsightsMap.values());
          });
          break;
          
        case 'metacognitive_patterns_update':
        case 'metacognitive_patterns_result':
          setPatterns(prevPatterns => {
            // Merge new patterns with existing ones, avoiding duplicates
            const newPatternsMap = new Map<string, CognitivePattern>([
              ...prevPatterns.map(pattern => [pattern.id, pattern]),
              ...message.payload.map((pattern: CognitivePattern) => [pattern.id, pattern])
            ]);
            return Array.from(newPatternsMap.values());
          });
          break;
          
        case 'metacognitive_stats_result':
          setStats(message.payload);
          break;
          
        case 'metacognitive_error':
          console.error('Meta-cognitive error:', message.payload.message);
          break;
      }
    };
    
    // Add event listener for WebSocket messages
    window.addEventListener('message', handleWebSocketMessage);
    
    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
    };
  }, []);
  
  // Subscribe to meta-cognitive updates when WebSocket is connected
  useEffect(() => {
    if (connected && !subscriptionId) {
      // Subscribe to meta-cognitive updates
      sendMessage('metacognitive_subscribe', {
        patternFilters: {
          minConfidence: 0.5,
        },
        insightFilters: {
          minImpact: 0.3,
        }
      });
      
      // Request stats
      sendMessage('metacognitive_get_stats', {});
      
      console.log('Sent meta-cognitive subscription request');
    }
  }, [connected, subscriptionId, sendMessage]);
  
  // Update filters
  const updateFilters = () => {
    if (!connected || !subscriptionId) return;
    
    // Build filter objects
    const insightFilters: Record<string, any> = {};
    if (nodeIdFilter) insightFilters.nodeId = nodeIdFilter;
    if (severityFilter) insightFilters.severity = severityFilter;
    
    const patternFilters: Record<string, any> = {};
    if (nodeIdFilter) patternFilters.nodeId = nodeIdFilter;
    if (patternTypeFilter) patternFilters.patternType = patternTypeFilter;
    if (minConfidenceFilter > 0) patternFilters.minConfidence = minConfidenceFilter / 100;
    
    // Send filter update
    sendMessage('metacognitive_update_filters', {
      subscriptionId,
      insightFilters,
      patternFilters
    });
    
    console.log('Updated meta-cognitive filters', { insightFilters, patternFilters });
  };
  
  // Request fresh data
  const refreshData = () => {
    if (!connected) return;
    
    // Build filter objects
    const insightFilters: Record<string, any> = {};
    if (nodeIdFilter) insightFilters.nodeId = nodeIdFilter;
    if (severityFilter) insightFilters.severity = severityFilter;
    
    const patternFilters: Record<string, any> = {};
    if (nodeIdFilter) patternFilters.nodeId = nodeIdFilter;
    if (patternTypeFilter) patternFilters.patternType = patternTypeFilter;
    if (minConfidenceFilter > 0) patternFilters.minConfidence = minConfidenceFilter / 100;
    
    // Request fresh data
    sendMessage('metacognitive_get_insights', { filters: insightFilters });
    sendMessage('metacognitive_get_patterns', { filters: patternFilters });
    sendMessage('metacognitive_get_stats', {});
    
    console.log('Requested fresh meta-cognitive data');
  };
  
  // Get severity color
  const getSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'info': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get pattern type color
  const getPatternTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'cyclical': return 'bg-purple-500';
      case 'causal': return 'bg-blue-500';
      case 'sequential': return 'bg-green-500';
      case 'anomaly': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get impact label
  const getImpactLabel = (impact: number): string => {
    if (impact >= 0.8) return 'Very High';
    if (impact >= 0.6) return 'High';
    if (impact >= 0.4) return 'Medium';
    if (impact >= 0.2) return 'Low';
    return 'Very Low';
  };
  
  return (
    <div className="space-y-6">
      {/* Simple Apple-like header with status and refresh */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">
            {connected 
              ? `System connected` 
              : 'System disconnected'}
          </span>
        </div>
        <Button onClick={refreshData} size="sm" variant="ghost" className="text-gray-500 hover:text-gray-900">
          Refresh
        </Button>
      </div>
      
      {/* Stats summary */}
      <div className="flex justify-between gap-4 mb-8">
        <div className="flex-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
          <div className="text-3xl font-semibold">{stats?.totalInsights || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Insights</div>
        </div>
        <div className="flex-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
          <div className="text-3xl font-semibold">{stats?.totalPatterns || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Patterns</div>
        </div>
        <div className="flex-1 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
          <div className="text-3xl font-semibold">{stats?.activeSubscriptions || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Subscribers</div>
        </div>
      </div>
      
      {/* Simplified filters */}
      <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <Label htmlFor="severityFilter" className="text-xs text-gray-500 mb-1 block">Severity</Label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger id="severityFilter" className="w-[180px]">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto">
            <Label htmlFor="patternTypeFilter" className="text-xs text-gray-500 mb-1 block">Pattern Type</Label>
            <Select value={patternTypeFilter} onValueChange={setPatternTypeFilter}>
              <SelectTrigger id="patternTypeFilter" className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="cyclical">Cyclical</SelectItem>
                <SelectItem value="causal">Causal</SelectItem>
                <SelectItem value="sequential">Sequential</SelectItem>
                <SelectItem value="anomaly">Anomaly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 flex items-end">
            <Button onClick={updateFilters} className="ml-auto">Apply</Button>
          </div>
        </div>
      </div>
      
      {/* Clean tabbed interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="insights" className="text-sm">Insights ({insights.length})</TabsTrigger>
          <TabsTrigger value="patterns" className="text-sm">Patterns ({patterns.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights">
          <div className="overflow-auto max-h-[500px] pr-2">
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight) => (
                  <div key={insight.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="flex border-l-4 p-4" style={{ borderColor: getSeverityColor(insight.severity).replace('bg-', 'border-') }}>
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-1">{insight.description}</h3>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          {insight.nodeId && <span>Node: {insight.nodeId}</span>}
                          {insight.nodeId && <span className="text-gray-300">•</span>}
                          <span>Impact: {getImpactLabel(insight.impact)}</span>
                        </div>
                        
                        {insight.recommendations.length > 0 && (
                          <div className="mt-3 text-sm">
                            <div className="font-medium mb-1">Recommendations</div>
                            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                              {insight.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-400 mt-3">
                          Created {formatDistanceToNow(new Date(insight.createdAt))} ago
                        </div>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                              style={{ backgroundColor: getSeverityColor(insight.severity).replace('bg-', 'bg-'), color: 'white' }}>
                          {insight.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12 text-gray-400 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  No insights found matching the current filters.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="patterns">
          <div className="overflow-auto max-h-[500px] pr-2">
            <div className="space-y-4">
              {patterns.length > 0 ? (
                patterns.map((pattern) => (
                  <div key={pattern.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="flex border-l-4 p-4" style={{ borderColor: getPatternTypeColor(pattern.type).replace('bg-', 'border-') }}>
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-1">{pattern.description}</h3>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>Nodes: {pattern.nodeIds.length > 0 ? pattern.nodeIds.join(', ') : 'System-wide'}</span>
                          <span className="text-gray-300">•</span>
                          <span>Occurrences: {pattern.occurrences}</span>
                        </div>
                        
                        <div className="flex items-center mt-3">
                          <div className="text-xs font-medium mr-2">Confidence:</div>
                          <div className="w-full max-w-[200px] bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${pattern.confidence * 100}%` }}
                            ></div>
                          </div>
                          <div className="ml-2 text-xs">{Math.round(pattern.confidence * 100)}%</div>
                        </div>
                        
                        <div className="text-xs text-gray-400 mt-3">
                          First observed {formatDistanceToNow(new Date(pattern.firstObserved))} ago
                          <span className="text-gray-300 mx-2">•</span>
                          Last observed {formatDistanceToNow(new Date(pattern.lastObserved))} ago
                        </div>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                              style={{ backgroundColor: getPatternTypeColor(pattern.type).replace('bg-', 'bg-'), color: 'white' }}>
                          {pattern.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12 text-gray-400 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  No patterns found matching the current filters.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Distribution summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium mb-4">Insight Distribution</h3>
            <div className="space-y-3">
              {Object.entries(stats.insightsBySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center">
                  <div className="w-20 text-xs font-medium">{severity}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mx-2">
                    <div 
                      style={{ 
                        width: `${(count / stats.totalInsights) * 100}%`,
                        backgroundColor: getSeverityColor(severity).replace('bg-', ''),
                        height: '8px',
                        borderRadius: '4px' 
                      }}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium mb-4">Pattern Distribution</h3>
            <div className="space-y-3">
              {Object.entries(stats.patternsByType).map(([type, count]) => (
                <div key={type} className="flex items-center">
                  <div className="w-20 text-xs font-medium">{type}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mx-2">
                    <div 
                      style={{ 
                        width: `${(count / stats.totalPatterns) * 100}%`,
                        backgroundColor: getPatternTypeColor(type).replace('bg-', ''),
                        height: '8px',
                        borderRadius: '4px' 
                      }}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaCognitiveInsights;