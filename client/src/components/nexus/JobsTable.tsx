import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Zap,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { FlowStageIcons } from './FlowStageIcons';

// Define the NexusJob interface that maps to the schema in shared/schema-minimal.ts
export interface NexusJob {
  id: string;
  input: Record<string, any>;
  options: {
    profile: string;
    batchable: boolean;
    priority: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: {
    currentStage: string;
    completedStages: string[];
    percentage: number;
  };
  result?: Record<string, any>;
  error?: string;
  metrics?: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    cost?: number;
    modelUsed?: string;
    tokensUsed?: {
      input: number;
      output: number;
      total: number;
    };
  };
  stageMetrics?: {
    costs: Record<number, number>;
    times: Record<number, number>;
  };
  startTime: Date;
  estimatedCompletion?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // For UI compatibility
  name?: string;
  description?: string;
  currentStage?: number;
  completedStages?: number[];
  totalCost?: number;
  modelUsage?: {
    model: string;
    tokens: number;
    cost: number;
  }[];
}

export interface JobsTableProps {
  jobs: NexusJob[];
  onViewJob?: (job: NexusJob) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
  showPagination?: boolean;
}

export function JobsTable({
  jobs,
  onViewJob,
  onRefresh,
  isLoading = false,
  className,
  showPagination = true
}: JobsTableProps) {
  // Get relative time (e.g., "2 hours ago")
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

  // Get status badge
  const getStatusBadge = (status: NexusJob['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            In Progress
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  // Calculate total tokens used
  const getTotalTokens = (job: NexusJob) => {
    return job.modelUsage?.reduce((acc, usage) => acc + usage.tokens, 0) || 0;
  };

  const handleViewJob = (job: NexusJob) => {
    if (onViewJob) {
      onViewJob(job);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">OROBORO NEXUS Jobs</h2>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn(
              "mr-2 h-4 w-4",
              isLoading && "animate-spin"
            )} />
            Refresh
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>{jobs.length === 0 ? 'No jobs found' : 'List of all OROBORO NEXUS jobs'}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Flow Stage</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} className="group">
                <TableCell>
                  <div className="font-medium">{job.name}</div>
                  {job.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {job.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FlowStageIcons
                      currentStage={job.currentStage ?? 0}
                      completedStages={job.completedStages ?? []}
                      status={job.status}
                      size="sm"
                      maxVisible={3}
                    />
                    <span className="text-sm text-muted-foreground ml-1">
                      {job.completedStages?.length ?? 0}/9
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <span>{getRelativeTime(job.createdAt)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <BarChart2 className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono">{formatCost(job.totalCost)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Zap className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono">{getTotalTokens(job).toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewJob(job)}
                    className="visibility-hidden group-hover:opacity-100 transition-opacity opacity-0 md:opacity-100"
                  >
                    <span className="sr-only">View</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
                      Loading jobs...
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No jobs found. Create a new job to get started.</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}