import React from 'react';
import { cn } from '@/lib/utils';
import { Stage, STAGE_INFO, NexusStageToNumber, NumberToNexusStage } from './FlowStageIcons';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Hourglass,
  Loader2
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Define component props
interface StageVizProps {
  // Accept either numeric stages or string-based NexusStage values
  stages: number[] | string[];
  currentStage: number | string;
  completedStages: (number | string)[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  stageMetrics?: {
    costs: Record<number | string, number>;
    times: Record<number | string, number>; // in seconds
  };
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

export function StageViz({
  stages,
  currentStage,
  completedStages,
  status,
  stageMetrics,
  variant = 'default',
  className
}: StageVizProps) {
  // Convert string-based NexusStage values to numeric Stage values if needed
  const normalizedStages = React.useMemo(() => {
    return stages.map(stage => typeof stage === 'string' ? NexusStageToNumber[stage] || 0 : stage);
  }, [stages]);
  
  const normalizedCurrentStage = React.useMemo(() => {
    return typeof currentStage === 'string' ? NexusStageToNumber[currentStage] || 0 : currentStage;
  }, [currentStage]);
  
  const normalizedCompletedStages = React.useMemo(() => {
    return completedStages.map(stage => typeof stage === 'string' ? NexusStageToNumber[stage] || 0 : stage);
  }, [completedStages]);
  
  // The status should already be normalized since we removed 'processing' from the type
  const normalizedStatus = status;
  // Format cost to human-readable format
  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return `$${cost.toFixed(5)}`;
    }
    if (cost < 0.1) {
      return `$${cost.toFixed(3)}`;
    }
    return `$${cost.toFixed(2)}`;
  };

  // Format duration to human-readable format
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSec = Math.round(seconds % 60);
    
    if (minutes < 60) {
      return `${minutes}m${remainingSec > 0 ? ` ${remainingSec}s` : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMin = Math.floor(minutes % 60);
    
    return `${hours}h${remainingMin > 0 ? ` ${remainingMin}m` : ''}`;
  };

  // Calculate total metrics if stageMetrics is provided
  const totalMetrics = React.useMemo(() => {
    if (!stageMetrics) return { totalCost: 0, totalTime: 0 };
    
    const totalCost = Object.values(stageMetrics.costs || {}).reduce((sum, cost) => sum + cost, 0);
    const totalTime = Object.values(stageMetrics.times || {}).reduce((sum, time) => sum + time, 0);
    
    return { totalCost, totalTime };
  }, [stageMetrics]);

  // Determine if this is the 0-8 Flow (standard pattern)
  const isStandard08Flow = normalizedStages.length === 9 && 
    normalizedStages[0] === 0 && normalizedStages[normalizedStages.length - 1] === 8;

  return (
    <div className={cn("w-full", className)}>
      {/* Flow visualization */}
      <div className="relative">
        {/* Render progress track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2" />
        
        {/* Render completed progress */}
        {normalizedCompletedStages.length > 0 && (
          <div 
            className={cn(
              "absolute top-1/2 left-0 h-1 -translate-y-1/2 transition-all duration-500",
              "bg-green-500 dark:bg-green-600"
            )}
            style={{ 
              width: `${Math.min(100, (normalizedCompletedStages.length / normalizedStages.length) * 100)}%` 
            }}
          />
        )}
        
        {/* Current stage progress (only if in_progress) */}
        {normalizedStatus === 'in_progress' && typeof normalizedCurrentStage === 'number' && normalizedCurrentStage > 0 && (
          <div 
            className={cn(
              "absolute top-1/2 h-1 -translate-y-1/2 transition-all duration-500",
              "bg-amber-500 dark:bg-amber-600"
            )}
            style={{
              left: `${((normalizedCompletedStages.length) / normalizedStages.length) * 100}%`,
              width: `${(1 / normalizedStages.length) * 100}%`
            }}
          />
        )}

        {/* Render stage nodes */}
        <div className="flex justify-between relative py-8">
          {normalizedStages.map((normalizedStage, index) => {
            // Get original stage value (for display purposes)
            const originalStage = stages[index];
            
            // Get stage info based on normalized numeric value
            const stageInfo = STAGE_INFO[normalizedStage as Stage];
            const isCompleted = normalizedCompletedStages.includes(normalizedStage);
            const isCurrent = normalizedCurrentStage === normalizedStage;
            const isFailed = normalizedStatus === 'failed' && isCurrent;
            const isPending = !isCompleted && !isCurrent;
            
            // Get stage metrics if available - use original stage key for lookup
            const stageCost = stageMetrics?.costs ? stageMetrics.costs[originalStage] || 0 : 0;
            const stageTime = stageMetrics?.times ? stageMetrics.times[originalStage] || 0 : 0;
            const hasMetrics = stageCost > 0 || stageTime > 0;
            
            // Determine node variants
            const bgColorClass = 
              isCompleted ? "bg-green-500 dark:bg-green-600" : 
              isFailed ? "bg-red-500 dark:bg-red-600" : 
              isCurrent && status === 'in_progress' ? "bg-amber-500 dark:bg-amber-600" : 
              "bg-slate-200 dark:bg-slate-700";
            
            const borderColorClass = 
              isCompleted ? "border-green-500 dark:border-green-600" : 
              isFailed ? "border-red-500 dark:border-red-600" : 
              isCurrent && status === 'in_progress' ? "border-amber-500 dark:border-amber-600" : 
              "border-slate-200 dark:border-slate-700";
            
            // Stage status icon
            const StatusIcon = isFailed ? AlertCircle :
                               isCompleted ? CheckCircle2 :
                               isCurrent && status === 'in_progress' ? Loader2 :
                               isPending ? (normalizedStage <= normalizedCurrentStage ? Clock : Hourglass) :
                               undefined;
            
            return (
              <TooltipProvider key={normalizedStage}>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center relative">
                      <div className={cn(
                        "rounded-full h-10 w-10 flex items-center justify-center z-10",
                        bgColorClass,
                        "transition-all duration-300"
                      )}>
                        {variant !== 'minimal' ? (
                          <span className="text-white font-semibold">{normalizedStage}</span>
                        ) : StatusIcon ? (
                          <StatusIcon className={cn(
                            "h-5 w-5 text-white",
                            isCurrent && status === 'in_progress' && "animate-spin"
                          )} />
                        ) : (
                          <span className="text-white font-semibold">{normalizedStage}</span>
                        )}
                      </div>
                      
                      {/* Stage name */}
                      {variant === 'detailed' ? (
                        <div className="mt-2 text-center">
                          <div className="text-xs font-medium">{stageInfo.name}</div>
                          <div className="flex flex-col items-center mt-1">
                            {hasMetrics && (
                              <div className="flex flex-col gap-0.5 items-center">
                                {stageCost > 0 && (
                                  <span className="text-[10px] text-muted-foreground font-mono">{formatCost(stageCost)}</span>
                                )}
                                {stageTime > 0 && (
                                  <span className="text-[10px] text-muted-foreground font-mono">{formatDuration(stageTime)}</span>
                                )}
                              </div>
                            )}
                            <div className="mt-1">
                              <Badge 
                                variant={
                                  isCompleted ? 'secondary' : 
                                  isFailed ? 'destructive' : 
                                  isCurrent && status === 'in_progress' ? 'default' : 
                                  'secondary'
                                }
                                className="text-[10px] px-1.5 py-0"
                              >
                                {isCompleted ? 'Completed' : 
                                 isFailed ? 'Failed' : 
                                 isCurrent && status === 'in_progress' ? 'Active' : 
                                 'Pending'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ) : variant === 'default' && (
                        <div className="mt-2 text-xs font-medium">
                          {stageInfo.name}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        Stage {normalizedStage}: {stageInfo.name}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-[200px]">
                        {stageInfo.description}
                      </p>
                      
                      {hasMetrics && (
                        <div className="pt-1 mt-1 border-t">
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs">
                            {stageCost > 0 && (
                              <>
                                <span className="text-muted-foreground">Cost:</span>
                                <span className="font-mono">{formatCost(stageCost)}</span>
                              </>
                            )}
                            {stageTime > 0 && (
                              <>
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-mono">{formatDuration(stageTime)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-1 mt-1 border-t text-xs flex items-center">
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-1.5",
                          isCompleted ? "bg-green-500" : 
                          isFailed ? "bg-red-500" : 
                          isCurrent && status === 'in_progress' ? "bg-amber-500" : 
                          "bg-slate-300 dark:bg-slate-600"
                        )} />
                        <span>
                          {isCompleted ? "Completed" : 
                           isFailed ? "Failed" : 
                           isCurrent && status === 'in_progress' ? "In Progress" : 
                           isPending ? "Pending" : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
      
      {/* Show total metrics if available and visualization is detailed */}
      {variant === 'detailed' && stageMetrics && (totalMetrics.totalCost > 0 || totalMetrics.totalTime > 0) && (
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <div>
            {isStandard08Flow && (
              <span>OROBORO NEXUS 0-8 Flow</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {totalMetrics.totalCost > 0 && (
              <div className="flex items-center gap-1">
                <span>Total Cost:</span>
                <span className="font-mono">{formatCost(totalMetrics.totalCost)}</span>
              </div>
            )}
            {totalMetrics.totalTime > 0 && (
              <div className="flex items-center gap-1">
                <span>Total Time:</span>
                <span className="font-mono">{formatDuration(totalMetrics.totalTime)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}