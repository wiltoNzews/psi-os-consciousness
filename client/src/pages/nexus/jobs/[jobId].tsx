import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  Calendar, 
  Users, 
  Cpu, 
  Tag,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StageViz } from '@/components/nexus/StageViz';
import { JobDetail } from '@/components/nexus/JobDetail';
import { FlowStageIcons } from '@/components/nexus/FlowStageIcons';

export default function JobDetailPage() {
  const [, params] = useRoute('/nexus/jobs/:jobId');
  const jobId = params?.jobId;
  const [activeTab, setActiveTab] = useState('details');
  
  // Fetch job data
  const { 
    data: jobData, 
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ['/api/nexus/jobs', jobId],
    enabled: !!jobId,
    refetchInterval: 5000, // Auto-refresh every 5 seconds for active jobs
  });
  
  // Stop auto-refresh once job is completed or failed
  useEffect(() => {
    if (jobData?.job?.status === 'completed' || jobData?.job?.status === 'failed') {
      // Stop refetching
      return () => {};
    }
  }, [jobData?.job?.status]);
  
  const handleRefresh = () => {
    refetch();
  };
  
  const job = jobData?.job;
  
  // Format date in a human-readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Calculate elapsed time or duration
  const calculateDuration = (startDate: string, endDate?: string) => {
    if (!startDate) return 'Unknown';
    
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : Date.now();
    const durationMs = end - start;
    
    if (durationMs < 1000) return `${durationMs}ms`;
    if (durationMs < 60000) return `${Math.floor(durationMs / 1000)}s`;
    if (durationMs < 3600000) return `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;
    return `${Math.floor(durationMs / 3600000)}h ${Math.floor((durationMs % 3600000) / 60000)}m`;
  };
  
  // Get status-specific UI elements
  const getStatusIndicator = (status: string) => {
    switch(status) {
      case 'pending':
        return { 
          color: 'bg-blue-500', 
          icon: <Clock3 className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="border-blue-500 text-blue-500">Pending</Badge>
        };
      case 'in_progress':
        return { 
          color: 'bg-amber-500', 
          icon: <Clock className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="border-amber-500 text-amber-500">In Progress</Badge>
        };
      case 'completed':
        return { 
          color: 'bg-green-500', 
          icon: <CheckCircle2 className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>
        };
      case 'failed':
        return { 
          color: 'bg-red-500', 
          icon: <XCircle className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline" className="border-red-500 text-red-500">Failed</Badge>
        };
      default:
        return { 
          color: 'bg-gray-500', 
          icon: <AlertCircle className="h-4 w-4 mr-2" />,
          badge: <Badge variant="outline">Unknown</Badge>
        };
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading Job Details...</h2>
            <p className="text-muted-foreground">Retrieving information for job {jobId}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-500 mb-2">Error Loading Job</h2>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Could not load job details'}
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Link href="/nexus/jobs">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The job with ID {jobId} could not be found.
            </p>
            <Link href="/nexus/jobs">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const statusIndicator = getStatusIndicator(job.status);
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Link href="/nexus/jobs">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 mb-2 w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{job.name}</h1>
              {statusIndicator.badge}
            </div>
            <p className="text-muted-foreground">{job.description || 'No description provided'}</p>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Created At
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{formatDate(job.createdAt)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {calculateDuration(job.createdAt, job.completedAt)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              Models Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex flex-wrap gap-1">
              {job.modelsUsed && job.modelsUsed.length > 0 ? (
                job.modelsUsed.map((model: string, index: number) => (
                  <Badge key={index} variant="secondary" className="mr-1 mb-1">{model}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground">No models recorded</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm flex flex-wrap gap-1">
              {job.tags && job.tags.length > 0 ? (
                job.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1">{tag}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground">No tags</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Flow Progress</CardTitle>
          <CardDescription>
            Current state in the 0-8 NEXUS Flow process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between">
            <div className="flex items-center">
              {statusIndicator.icon}
              <span className="font-medium">
                {job.currentStage || 'Initializing'} 
                {job.status === 'in_progress' && ' - Processing'}
              </span>
            </div>
            <span className="text-sm font-medium">
              {job.progress || 0}%
            </span>
          </div>
          <Progress 
            value={job.progress || 0} 
            className="h-2" 
            indicatorClassName={statusIndicator.color} 
          />
          
          <div className="mt-6">
            <FlowStageIcons 
              currentStage={job.currentStageIndex || 0}
              status={job.status}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Different Views */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="visualization">Flow Visualization</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <JobDetail job={job} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="visualization" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flow Visualization</CardTitle>
              <CardDescription>
                Visual representation of the 0-8 Flow stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <StageViz 
                  stages={job.stages || []}
                  currentStage={job.currentStageIndex || 0}
                  status={job.status}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                Detailed record of job processing events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {job.logs && job.logs.length > 0 ? (
                <div className="space-y-4">
                  {job.logs.map((log: any, index: number) => (
                    <div key={index} className="border-b pb-3 last:border-0">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-medium">{log.message}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-sm text-muted-foreground">
                          {typeof log.details === 'string' 
                            ? log.details 
                            : JSON.stringify(log.details, null, 2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No activity logs available for this job
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}