import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { StageViz } from '@/components/nexus/StageViz';

// Define props interface for the JobDetailPage component
interface JobDetailPageProps {
  id: string;
}
import { 
  ArrowLeft,
  Clock,
  Activity,
  Brain,
  Database,
  SplitSquareVertical,
  Calculator,
  GitBranch,
  Shield,
  Settings,
  Rocket,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { setupJobSocket } from '@/lib/nexusWebsocket';

// Flow Stage Icons
const stageIcons = {
  '0-Start': <Activity className="h-5 w-5" />,
  '1-Define': <Brain className="h-5 w-5" />,
  '2-Store': <Database className="h-5 w-5" />,
  '3-Split': <SplitSquareVertical className="h-5 w-5" />,
  '4-Process': <Calculator className="h-5 w-5" />,
  '5-Engage': <GitBranch className="h-5 w-5" />,
  '6-Verify': <Shield className="h-5 w-5" />,
  '7-Tune': <Settings className="h-5 w-5" />,
  '8-Ascend': <Rocket className="h-5 w-5" />
};

// Status Badge Components
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'processing':
      return (
        <Badge className="bg-blue-500">
          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
          Processing
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Completed
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge>
          {status}
        </Badge>
      );
  }
};

export default function JobDetail({ id }: JobDetailPageProps) {
  const jobId = id;
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [jobState, setJobState] = useState<any>(null);

  // Fetch job data
  const { data: jobData, isLoading, error } = useQuery({
    queryKey: ['/api/nexus/jobs', jobId],
    enabled: !!jobId,
    refetchInterval: (data) => {
      // Poll every 2 seconds if still processing, otherwise stop polling
      return data?.status === 'processing' ? 2000 : false;
    }
  });

  // Setup WebSocket for real-time updates
  useEffect(() => {
    if (!jobId) return;
    
    const newSocket = setupJobSocket({
      jobId,
      onUpdate: (update) => {
        setJobState(prev => ({
          ...prev,
          ...update
        }));
        if (update.status === 'completed') {
          toast({
            title: "Job Completed",
            description: "Your job has been successfully processed",
          });
        } else if (update.status === 'failed') {
          toast({
            title: "Job Failed",
            description: "Your job processing encountered an error",
            variant: "destructive"
          });
        }
      },
      onConnect: () => {
        console.log("Connected to job updates");
      },
      onDisconnect: () => {
        console.log("Disconnected from job updates");
      }
    });
    
    setSocket(newSocket);
    
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [jobId, toast]);

  // Combine server data with websocket updates
  const job = jobState || jobData;

  if (isLoading) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-5xl flex justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mb-4 mx-auto animate-spin text-primary" />
          <p className="text-lg font-medium">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-5xl">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mb-4 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Job</h2>
          <p className="text-muted-foreground mb-6">
            Unable to load job details for ID: {jobId}
          </p>
          <Link href="/nexus">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 mx-auto max-w-5xl">
      <header className="mb-8">
        <div className="flex items-center">
          <Link href="/nexus">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                Job Details
              </h1>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-muted-foreground">
              {jobId}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Job Progress
            </CardTitle>
            <CardDescription>
              Current stage: {job.progress?.currentStage || 'Not started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={job.progress?.percentage || 0} className="h-2" />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">0%</span>
                <span className="text-sm font-medium">{job.progress?.percentage || 0}%</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
            </div>
            
            <div className="mt-6">
              <StageViz 
                stageIcons={stageIcons} 
                completedStages={job.progress?.completedStages || []} 
                currentStage={job.progress?.currentStage || null} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Input Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Input Data
            </CardTitle>
            <CardDescription>
              The data submitted for processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-secondary/50 rounded-md p-4 overflow-auto text-sm">
              {JSON.stringify(job.input, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Results (if completed) */}
        {job.status === 'completed' && job.result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Processing Results
              </CardTitle>
              <CardDescription>
                The results from OROBORO NEXUS processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary/50 rounded-md p-4 overflow-auto text-sm mb-4">
                {JSON.stringify(job.result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Error (if failed) */}
        {job.status === 'failed' && job.error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Error Information
              </CardTitle>
              <CardDescription>
                Details about the processing failure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-destructive/10 text-destructive rounded-md p-4 text-sm">
                {job.error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Job Details
            </CardTitle>
            <CardDescription>
              Technical details and configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Job Options</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profile:</span>
                      <span className="text-sm font-medium">{job.options?.profile || 'balanced'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Priority:</span>
                      <span className="text-sm font-medium">{job.options?.priority || 'normal'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Batchable:</span>
                      <span className="text-sm font-medium">{job.options?.batchable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Timing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Started:</span>
                      <span className="text-sm font-medium">
                        {job.startTime ? new Date(job.startTime).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    {job.status === 'completed' && job.metrics?.endTime && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completed:</span>
                        <span className="text-sm font-medium">
                          {new Date(job.metrics.endTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {job.status === 'processing' && job.estimatedCompletion && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Est. Completion:</span>
                        <span className="text-sm font-medium">
                          {new Date(job.estimatedCompletion).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {job.metrics?.duration && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <span className="text-sm font-medium">
                          {(job.metrics.duration / 1000).toFixed(2)}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {job.metrics && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Performance Metrics</h4>
                    <div className="space-y-2">
                      {job.metrics.modelUsed && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Model Used:</span>
                          <span className="text-sm font-medium">{job.metrics.modelUsed}</span>
                        </div>
                      )}
                      
                      {job.metrics.cost !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Cost:</span>
                          <span className="text-sm font-medium">${job.metrics.cost.toFixed(6)}</span>
                        </div>
                      )}
                      
                      {job.metrics.tokensUsed && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Input Tokens:</span>
                            <span className="text-sm font-medium">{job.metrics.tokensUsed.input}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Output Tokens:</span>
                            <span className="text-sm font-medium">{job.metrics.tokensUsed.output}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Tokens:</span>
                            <span className="text-sm font-medium">{job.metrics.tokensUsed.total}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Link href="/nexus/jobs">
          <Button variant="outline">
            View All Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
}