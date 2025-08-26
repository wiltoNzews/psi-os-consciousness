import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  CircleUser, 
  AreaChart, 
  Terminal, 
  Settings, 
  Plus, 
  RefreshCw,
  Goal,
  Brain,
  FlaskConical,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SystemMetrics } from '@/components/nexus/SystemMetrics';
import { JobsTable } from '@/components/nexus/JobsTable';
import { ModelComparison } from '@/components/nexus/ModelComparison';
import { useWebSocket } from '@/contexts/WebSocketContext';

export default function NexusDashboard() {
  // Access WebSocket context
  const { connected, lastError } = useWebSocket();
  
  // Fetch system metrics
  const { 
    data: metricsData, 
    isLoading: metricsLoading, 
    refetch: refetchMetrics 
  } = useQuery({
    queryKey: ['/api/nexus/metrics'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Fetch recent jobs
  const { 
    data: jobsData, 
    isLoading: jobsLoading, 
    refetch: refetchJobs 
  } = useQuery({
    queryKey: ['/api/nexus/jobs'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });
  
  // Fetch model comparison data
  const {
    data: modelData,
    isLoading: modelsLoading,
    refetch: refetchModels
  } = useQuery({
    queryKey: ['/api/nexus/models'],
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Handle refresh action
  const handleRefresh = () => {
    refetchMetrics();
    refetchJobs();
    refetchModels();
  };
  
  // Format the system chaos/structure balance
  const formatChaosStructure = () => {
    const chaosValue = 70; // Fixed at 70/30 per requirements
    return `${chaosValue}/${100 - chaosValue}`;
  };
  
  // Get the most recent jobs (up to 5)
  const getRecentJobs = () => {
    if (!jobsData?.jobs || jobsData.jobs.length === 0) return [];
    
    // Sort by creation date (newest first)
    return [...jobsData.jobs]
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 5);
  };
  
  return (
    <div className="container py-6 space-y-8">
      {/* WebSocket connection status */}
      {!connected && (
        <Alert variant="destructive" className="mb-4">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {lastError || "Could not connect to OROBORO NEXUS server. Real-time updates are disabled."}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">OROBORO NEXUS</h1>
          <p className="text-muted-foreground">
            Quantum Cognitive Framework with 0-8 Flow Processing
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {connected ? (
            <div className="flex items-center text-green-500 mr-2">
              <Wifi className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500 mr-2" title={lastError || "WebSocket disconnected"}>
              <WifiOff className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Disconnected</span>
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Link href="/nexus/new-job">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </Link>
        </div>
      </div>
      
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Balance
            </CardTitle>
            <AreaChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatChaosStructure()}</div>
            <p className="text-xs text-muted-foreground">
              Chaos/Structure Ratio
            </p>
            <Progress 
              value={70} 
              className="h-2 mt-4" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Semantic Cache Hit Rate
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "Loading..." : `${(metricsData?.cacheHitRate || 0) * 100}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              LLM Request Cache Efficiency
            </p>
            <Progress 
              value={metricsData?.cacheHitRate ? metricsData.cacheHitRate * 100 : 0} 
              className="h-2 mt-4" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Utilization
            </CardTitle>
            <Goal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "Loading..." : `$${metricsData?.budgetUsed || 0} / $690`}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly Budget in Balanced Mode
            </p>
            <Progress 
              value={metricsData?.budgetUsed ? (metricsData.budgetUsed / 690) * 100 : 0} 
              className="h-2 mt-4" 
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="md:col-span-2 space-y-6">
          {/* System Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>
                Real-time performance analytics of the NEXUS 0-8 Flow system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemMetrics 
                metrics={metricsData || {
                  systemStability: 0.75,
                  nodeSynergy: 0.68,
                  globalCoherence: 0.82
                }} 
                isLoading={metricsLoading}
              />
            </CardContent>
          </Card>
          
          {/* Recent Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>
                  Latest NEXUS processing jobs and their status
                </CardDescription>
              </div>
              <Link href="/nexus/jobs">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <JobsTable 
                jobs={getRecentJobs()} 
                isLoading={jobsLoading}
                showPagination={false}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common operations and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link href="/nexus/new-job">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Job
                </Button>
              </Link>
              
              <Link href="/nexus/jobs">
                <Button className="w-full justify-start" variant="outline">
                  <Terminal className="mr-2 h-4 w-4" />
                  Manage Jobs
                </Button>
              </Link>
              
              <Link href="/nexus/settings">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              </Link>
              
              <Link href="/nexus/models">
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  Model Selection
                </Button>
              </Link>
              
              <Link href="/nexus/experiments">
                <Button className="w-full justify-start" variant="outline">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Experiments
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Model Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>
                Relative performance metrics for LLMs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModelComparison models={modelData?.models} />
            </CardContent>
          </Card>
          
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current system operational metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System Load</span>
                  <span className={metricsData?.systemLoad === 'High' ? 'text-amber-500 font-medium' : 'font-medium'}>
                    {metricsLoading ? "Loading..." : metricsData?.systemLoad || "Normal"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch Processing</span>
                  <span className="font-medium">
                    {metricsLoading ? "Loading..." : metricsData?.batchProcessingActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Instances</span>
                  <span className="font-medium">
                    {metricsLoading ? "Loading..." : metricsData?.activeInstances || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operation Mode</span>
                  <span className="font-medium">
                    {metricsLoading ? "Loading..." : metricsData?.operationMode || "Balanced"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}