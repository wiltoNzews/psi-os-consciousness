import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Zap,
  BarChart2,
  Pause,
  Play,
  Copy,
  X
} from 'lucide-react';
import { StageViz } from './StageViz';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FlowStageIcons } from './FlowStageIcons';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { STAGE_INFO, Stage } from './FlowStageIcons';
// Import the full NexusJob interface
import { NexusJob } from './JobsTable';

interface JobDetailProps {
  job: NexusJob;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onDuplicate?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function JobDetail({
  job,
  onPause,
  onResume,
  onCancel,
  onDuplicate,
  onRefresh,
  isRefreshing = false,
  className
}: JobDetailProps) {
  // Format dates
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Format relative time
  const getRelativeTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  // Format cost to human-readable string
  const formatCost = (cost: number | undefined) => {
    if (!cost) return '$0.00';
    if (cost < 0.01) {
      return `$${cost.toFixed(4)}`;
    }
    return `$${cost.toFixed(2)}`;
  };

  // Get status badge color
  const getStatusColor = (status: NexusJob['status']): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600';
      case 'in_progress':
        return 'bg-amber-500 hover:bg-amber-600 animate-pulse';
      case 'pending':
      default:
        return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  // Get status badge icon and text
  const getStatusInfo = (status: NexusJob['status']): { icon: React.ReactNode; text: string } => {
    switch (status) {
      case 'completed':
        return { 
          icon: <CheckCircle className="w-4 h-4" />, 
          text: 'Completed' 
        };
      case 'failed':
        return { 
          icon: <AlertCircle className="w-4 h-4" />, 
          text: 'Failed' 
        };
      case 'in_progress':
        return { 
          icon: <RefreshCw className="w-4 h-4 animate-spin" />, 
          text: 'In Progress' 
        };
      case 'pending':
      default:
        return { 
          icon: <Clock className="w-4 h-4" />, 
          text: 'Pending' 
        };
    }
  };

  // Calculate total tokens used
  const totalTokens = job.modelUsage?.reduce((acc, usage) => acc + usage.tokens, 0) || 0;

  // Get stage metrics if available, or generate placeholder
  const getStageMetrics = () => {
    // If job has completed stages already, return metrics
    const stageData = Array.from({ length: 9 }, (_, i) => {
      const stageInfo = STAGE_INFO[i as Stage];
      const isCurrentStage = job.currentStage === i;
      const isCompleted = job.completedStages ? job.completedStages.includes(i) : false;

      // Generate some placeholder processing time
      const processingTime = isCompleted ? 
        // Simulate longer times for more complex stages (3, 4) and shorter for others
        Math.floor(Math.random() * (i === 3 || i === 4 ? 8000 : 3000) + 500) : 
        null;

      return {
        stage: i,
        name: stageInfo.name,
        status: isCompleted ? 'completed' : isCurrentStage ? job.status : 'pending',
        processingTime,
        icon: stageInfo.icon,
        description: stageInfo.description
      };
    });

    return stageData;
  };

  // Get model usage with formatted costs
  const getModelUsage = () => {
    if (!job.modelUsage || job.modelUsage.length === 0) {
      return [];
    }

    // Group by model and calculate total tokens and costs
    const modelMap = new Map<string, { model: string, tokens: number, cost: number }>();
    
    job.modelUsage.forEach(usage => {
      if (modelMap.has(usage.model)) {
        const existing = modelMap.get(usage.model)!;
        existing.tokens += usage.tokens;
        existing.cost += usage.cost;
      } else {
        modelMap.set(usage.model, { ...usage });
      }
    });

    return Array.from(modelMap.values()).sort((a, b) => b.tokens - a.tokens);
  };

  const statusInfo = getStatusInfo(job.status);
  const modelUsage = getModelUsage();
  const stageMetrics = getStageMetrics();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{job.name}</h1>
          {job.description && (
            <p className="text-muted-foreground mt-1">{job.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge 
              className={cn(
                "text-white flex items-center gap-1",
                getStatusColor(job.status)
              )}
            >
              {statusInfo.icon}
              {statusInfo.text}
            </Badge>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {totalTokens.toLocaleString()} tokens
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Total tokens consumed across all models
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3" />
                    {formatCost(job.totalCost)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Total cost for this job
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn(
                "mr-2 h-4 w-4",
                isRefreshing && "animate-spin"
              )} />
              Refresh
            </Button>
          )}
          
          {job.status === 'in_progress' && onPause && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPause}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          
          {job.status === 'pending' && onResume && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResume}
            >
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          )}
          
          {onDuplicate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDuplicate}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
          )}
          
          {(job.status === 'pending' || job.status === 'in_progress') && onCancel && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onCancel}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Main content section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - timeline and flow visualization */}
        <div className="md:col-span-2 space-y-6">
          {/* 0-8 Flow visualization */}
          <Card>
            <CardHeader>
              <CardTitle>0-8 Flow Pattern</CardTitle>
              <CardDescription>
                Visualization of the 9-stage OROBORO NEXUS flow process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StageViz
                stages={[0, 1, 2, 3, 4, 5, 6, 7, 8]} // 0-8 Flow stages
                currentStage={job.currentStage ?? 0}
                completedStages={job.completedStages ?? []}
                status={job.status}
                variant="detailed"
                stageMetrics={job.stageMetrics || {
                  costs: {},
                  times: {}
                }}
                className="w-full h-[300px]"
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-0">
              <div className="mt-4 w-full">
                <FlowStageIcons
                  currentStage={job.currentStage ?? 0}
                  completedStages={job.completedStages ?? []}
                  status={job.status}
                  size="md"
                  showLabels
                  className="justify-between"
                />
              </div>
            </CardFooter>
          </Card>
          
          {/* Stage metrics table */}
          <Card>
            <CardHeader>
              <CardTitle>Stage Metrics</CardTitle>
              <CardDescription>
                Detailed performance metrics for each flow stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 w-16">Stage</th>
                      <th className="text-left py-2 px-2">Name</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageMetrics.map((stage) => (
                      <tr key={stage.stage} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 font-mono">{stage.stage}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {React.createElement(stage.icon, { className: "h-4 w-4" })}
                                </TooltipTrigger>
                                <TooltipContent>
                                  {stage.description}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span>{stage.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <Badge variant={
                            stage.status === 'completed' ? 'default' :
                            stage.status === 'failed' ? 'destructive' :
                            stage.status === 'in_progress' ? 'secondary' :
                            'outline'
                          }>
                            {stage.status === 'completed' ? 'Completed' : 
                             stage.status === 'failed' ? 'Failed' :
                             stage.status === 'in_progress' ? 'In Progress' :
                             'Pending'}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 font-mono">
                          {stage.processingTime ? `${(stage.processingTime / 1000).toFixed(2)}s` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - details and stats */}
        <div className="space-y-6">
          {/* Job details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-[1fr_2fr] gap-2">
                <div className="text-sm font-medium text-muted-foreground">Job ID</div>
                <div className="text-sm font-mono">{job.id}</div>
                
                <div className="text-sm font-medium text-muted-foreground">Created</div>
                <div className="text-sm">
                  <div>{formatDate(job.createdAt)}</div>
                  <div className="text-xs text-muted-foreground">{getRelativeTime(job.createdAt)}</div>
                </div>
                
                <div className="text-sm font-medium text-muted-foreground">Updated</div>
                <div className="text-sm">
                  <div>{formatDate(job.updatedAt)}</div>
                  <div className="text-xs text-muted-foreground">{getRelativeTime(job.updatedAt)}</div>
                </div>
                
                {('completedAt' in job && job.completedAt) ? (
                  <>
                    <div className="text-sm font-medium text-muted-foreground">Completed</div>
                    <div className="text-sm">
                      <div>{formatDate(job.completedAt as Date)}</div>
                      <div className="text-xs text-muted-foreground">{getRelativeTime(job.completedAt as Date)}</div>
                    </div>
                  </>
                ) : null}
                
                <div className="text-sm font-medium text-muted-foreground">Current Stage</div>
                <div className="text-sm">
                  {job.currentStage !== undefined ? `${job.currentStage}: ${STAGE_INFO[job.currentStage as Stage].name}` : 'Not started'}
                </div>
                
                <div className="text-sm font-medium text-muted-foreground">Total Stages Complete</div>
                <div className="text-sm">{job.completedStages ? job.completedStages.length : 0} of 9</div>
                
                <div className="text-sm font-medium text-muted-foreground">Total Cost</div>
                <div className="text-sm font-mono">{formatCost(job.totalCost)}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Model usage */}
          <Card>
            <CardHeader>
              <CardTitle>Model Usage</CardTitle>
              <CardDescription>
                AI model usage and cost breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              {modelUsage.length > 0 ? (
                <div className="space-y-4">
                  {modelUsage.map((usage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="font-medium">{usage.model}</div>
                        <div className="font-mono">{formatCost(usage.cost)}</div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>{usage.tokens.toLocaleString()} tokens</div>
                        <div>{((usage.cost / (job.totalCost || 1)) * 100).toFixed(1)}% of total</div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${((usage.tokens / totalTokens) * 100).toFixed(1)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No model usage data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Error message if job failed */}
          {job.status === 'failed' && job.error && (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Error Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md text-sm text-red-800 dark:text-red-200 font-mono whitespace-pre-wrap">
                  {job.error}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}