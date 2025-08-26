import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getPerformanceMetrics, getProcessingStats } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Create line chart component with SVG
function LineChart() {
  // Mock performance metrics
  const data = getPerformanceMetrics();
  
  // Calculate dimensions
  const width = 800;
  const height = 200;
  const paddingX = 0;
  const paddingY = 5;
  
  // Find the min and max values for scaling
  const minValue = 0; // Always start at 0 for better visual representation
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Scale functions
  const scaleX = (index: number) => (index / (data.length - 1)) * (width - paddingX * 2) + paddingX;
  const scaleY = (value: number) => height - ((value - minValue) / (maxValue - minValue)) * (height - paddingY * 2) - paddingY;
  
  // Generate line path
  const linePath = data.map((d, i) => {
    const x = scaleX(i);
    const y = scaleY(d.value);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  
  // Generate area path (for the area under the line)
  const areaPath = `${linePath} L${scaleX(data.length - 1)},${height} L${scaleX(0)},${height} Z`;
  
  return (
    <div className="chart-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Area under the line */}
        <path className="fill-primary/10" d={areaPath}></path>
        
        {/* Line chart */}
        <path className="stroke-primary fill-none stroke-2" d={linePath}></path>
        
        {/* Data points */}
        {data.map((d, i) => (
          <circle 
            key={i} 
            className="fill-primary" 
            cx={scaleX(i)} 
            cy={scaleY(d.value)} 
            r="3"
          ></circle>
        ))}
      </svg>
    </div>
  );
}

export function PerformanceMetricsCard() {
  const [activeTimeframe, setActiveTimeframe] = useState<'today' | 'week' | 'month'>('week');
  const stats = getProcessingStats();
  
  return (
    <Card className="bg-gray-900 rounded-lg shadow border-gray-700">
      <CardHeader className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium leading-6 text-white">Performance Metrics</h2>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md",
              activeTimeframe === 'today' 
                ? "bg-primary text-white" 
                : "bg-gray-800 text-gray-300 hover:bg-primary hover:text-white"
            )}
            onClick={() => setActiveTimeframe('today')}
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md",
              activeTimeframe === 'week' 
                ? "bg-primary text-white" 
                : "bg-gray-800 text-gray-300 hover:bg-primary hover:text-white"
            )}
            onClick={() => setActiveTimeframe('week')}
          >
            Week
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md",
              activeTimeframe === 'month' 
                ? "bg-primary text-white" 
                : "bg-gray-800 text-gray-300 hover:bg-primary hover:text-white"
            )}
            onClick={() => setActiveTimeframe('month')}
          >
            Month
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <LineChart />
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-950 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">Avg. Processing Time</h3>
            <p className="mt-2 text-2xl font-semibold text-white">{stats.averageTime}</p>
            <p className={cn(
              "mt-1 text-sm flex items-center",
              stats.averageTimeChange < 0 ? "text-emerald-500" : "text-red-500"
            )}>
              {stats.averageTimeChange < 0 ? (
                <ArrowDown className="mr-1 h-4 w-4" />
              ) : (
                <ArrowUp className="mr-1 h-4 w-4" />
              )}
              {Math.abs(stats.averageTimeChange)}% vs last week
            </p>
          </div>
          
          <div className="bg-gray-950 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
            <p className="mt-2 text-2xl font-semibold text-white">{stats.successRate}</p>
            <p className={cn(
              "mt-1 text-sm flex items-center",
              stats.successRateChange > 0 ? "text-emerald-500" : "text-red-500"
            )}>
              {stats.successRateChange > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              {Math.abs(stats.successRateChange)}% vs last week
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
