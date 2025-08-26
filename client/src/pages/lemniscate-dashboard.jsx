/**
 * Lemniscate Dashboard
 * 
 * Main dashboard for visualizing and interacting with the 
 * Brazilian Wave Protocol and Quantum Coherence Threshold Formula.
 */

import React, { useState, useEffect } from 'react';
import LemniscateVisualization from '../components/LemniscateVisualization';
import CoherenceRatioIndicator from '../components/CoherenceRatioIndicator';
import CoreRatioExplanation from '../components/CoreRatioExplanation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Constants from shared module (direct import to avoid issues)
const STABILITY_COHERENCE = 0.7500;
const EXPLORATION_COHERENCE = 0.2494;
const COHERENCE_PRODUCT = STABILITY_COHERENCE * (1 / EXPLORATION_COHERENCE);

// Tabs for the dashboard
const DASHBOARD_TABS = [
  {
    id: 'visualization',
    label: 'Coherence Visualization',
  },
  {
    id: 'explanation',
    label: 'Formula Explanation',
  },
  {
    id: 'insights',
    label: 'Quantum Insights',
  },
];

const LemniscateDashboard = () => {
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS[0].id);
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        // API call placeholder - in real implementation, fetch from backend
        // const response = await api.fetch('/api/lemniscate/metrics');
        
        // Mock data for initial development until API routes are connected
        const mockData = generateMockMetrics();
        setMetricsData(mockData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Refresh data at intervals
    const intervalId = setInterval(fetchMetrics, 5000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Generate placeholder metrics data
  const generateMockMetrics = () => {
    const getRandomValue = (min, max) => {
      return Math.random() * (max - min) + min;
    };
    
    return {
      currentCoherence: Math.random() < 0.5 ? getRandomValue(0.24, 0.26) : getRandomValue(0.74, 0.76),
      stability: {
        score: getRandomValue(0.65, 0.85),
        trend: getRandomValue(-0.1, 0.1),
        threshold: STABILITY_COHERENCE
      },
      exploration: {
        score: getRandomValue(0.15, 0.35), 
        trend: getRandomValue(-0.1, 0.1),
        threshold: EXPLORATION_COHERENCE
      },
      temporalScales: {
        micro: { value: getRandomValue(0.2, 0.8), active: true },
        meso: { value: getRandomValue(0.2, 0.8), active: true },
        macro: { value: getRandomValue(0.2, 0.8), active: true }
      },
      productRatio: getRandomValue(2.9, 3.1),
      recentInsights: [
        {
          id: 1,
          type: 'creativity',
          value: getRandomValue(0.7, 0.9),
          timestamp: new Date(Date.now() - 1000 * 60 * 5)
        },
        {
          id: 2, 
          type: 'stability',
          value: getRandomValue(0.7, 0.9),
          timestamp: new Date(Date.now() - 1000 * 60 * 10)
        },
        {
          id: 3,
          type: 'exploration',
          value: getRandomValue(0.2, 0.3),
          timestamp: new Date(Date.now() - 1000 * 60 * 15)
        }
      ],
      insightCount: Math.floor(getRandomValue(30, 100)),
      timestamp: new Date()
    };
  };
  
  // Create metric cards for dashboard
  const renderMetricCard = (title, value, description, type) => {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quantum Coherence Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLastUpdated(new Date())}
            >
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Metrics Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderMetricCard(
            "Stability Threshold",
            metricsData?.stability?.threshold.toFixed(4) || "0.7500",
            "Target stability coherence (3:1 ratio)",
            "stability"
          )}
          {renderMetricCard(
            "Current Stability",
            metricsData?.stability?.score.toFixed(4) || "Loading...",
            `${metricsData?.stability?.trend > 0 ? '+' : ''}${metricsData?.stability?.trend?.toFixed(4) || '0.0000'} in last hour`,
            "stability"
          )}
          {renderMetricCard(
            "Exploration Threshold",
            metricsData?.exploration?.threshold.toFixed(4) || "0.2494",
            "Target exploration coherence (1:3 ratio)",
            "exploration"
          )}
          {renderMetricCard(
            "Current Exploration",
            metricsData?.exploration?.score.toFixed(4) || "Loading...",
            `${metricsData?.exploration?.trend > 0 ? '+' : ''}${metricsData?.exploration?.trend?.toFixed(4) || '0.0000'} in last hour`,
            "exploration"
          )}
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {DASHBOARD_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Brazilian Wave Protocol</CardTitle>
                <CardDescription>
                  Interactive visualization of the 3:1 ↔ 1:3 coherence ratio across temporal scales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LemniscateVisualization />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="explanation" className="space-y-4">
            <CoreRatioExplanation />
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quantum Coherence Insights</CardTitle>
                <CardDescription>
                  Recent insights generated by the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metricsData?.recentInsights?.map((insight, idx) => (
                      <Card key={idx}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium capitalize">{insight.type} Insight</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{insight.value.toFixed(4)}</div>
                          <p className="text-xs text-muted-foreground">
                            Generated {insight.timestamp.toLocaleTimeString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Insight Statistics</h3>
                    <span className="text-sm text-muted-foreground">
                      Total: {metricsData?.insightCount || 0} insights
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Latest timestamp: {metricsData?.timestamp?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LemniscateDashboard;