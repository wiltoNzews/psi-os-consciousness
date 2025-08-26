import React from 'react';
import { cn } from '@/lib/utils';
import {
  Brain,
  BookOpen,
  Database,
  GitBranch,
  Cpu,
  Puzzle,
  CheckCircle,
  Zap,
  ArrowUp,
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Define all possible flow stages - matching shared/schema-minimal.ts NexusStage enum
export enum Stage {
  START = 0,
  DEFINE = 1,
  STORE = 2,
  SPLIT = 3,
  PROCESS = 4,
  ENGAGE = 5,
  VERIFY = 6,
  TUNE = 7,
  ASCEND = 8
}

// Define mapping from NexusStage strings to numeric stage values
export const NexusStageToNumber: Record<string, number> = {
  "0-Start": 0,
  "1-Define": 1,
  "2-Store": 2,
  "3-Split": 3,
  "4-Process": 4,
  "5-Engage": 5,
  "6-Verify": 6,
  "7-Tune": 7,
  "8-Ascend": 8
}

// Define mapping from numeric stage values to NexusStage strings
export const NumberToNexusStage: Record<number, string> = {
  0: "0-Start",
  1: "1-Define",
  2: "2-Store",
  3: "3-Split",
  4: "4-Process",
  5: "5-Engage",
  6: "6-Verify",
  7: "7-Tune",
  8: "8-Ascend"
}

// Define information about each stage
export const STAGE_INFO: Record<Stage, { name: string; description: string; icon: React.ElementType }> = {
  [Stage.START]: {
    name: 'Start',
    description: 'Initiates the OROBORO NEXUS flow process with a new job or task',
    icon: Brain
  },
  [Stage.DEFINE]: {
    name: 'Define',
    description: 'Defines the precise parameters and scope of the task',
    icon: BookOpen
  },
  [Stage.STORE]: {
    name: 'Store',
    description: 'Stores all relevant task data in the persistence layer',
    icon: Database
  },
  [Stage.SPLIT]: {
    name: 'Split',
    description: 'Decomposes complex tasks into optimal subtasks using quantum chunking',
    icon: GitBranch
  },
  [Stage.PROCESS]: {
    name: 'Process',
    description: 'Processes individual tasks with the most appropriate AI models',
    icon: Cpu
  },
  [Stage.ENGAGE]: {
    name: 'Engage',
    description: 'Engages with results, integrates responses, and forms coherent output',
    icon: Puzzle
  },
  [Stage.VERIFY]: {
    name: 'Verify',
    description: 'Verifies results against acceptance criteria using meta-cognitive validation',
    icon: CheckCircle
  },
  [Stage.TUNE]: {
    name: 'Tune',
    description: 'Tunes responses based on feedback and performance metrics',
    icon: Zap
  },
  [Stage.ASCEND]: {
    name: 'Ascend',
    description: 'Completes the cycle, returning enhanced results and insights for system learning',
    icon: ArrowUp
  }
};

// Component props
interface FlowStageIconsProps {
  currentStage: number;
  completedStages: number[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  maxVisible?: number;
  className?: string;
  iconClassName?: string;
}

export function FlowStageIcons({
  currentStage,
  completedStages,
  status,
  size = 'md',
  showLabels = false,
  maxVisible = 9, // Default to showing all 9 stages (0-8)
  className,
  iconClassName
}: FlowStageIconsProps) {
  // Determine which stages to show
  const allStages = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  
  // If we need to limit stages, prioritize currentStage, then completed, then show evenly distributed stages
  const visibleStages = allStages.length <= maxVisible
    ? allStages
    : calculateVisibleStages(allStages, currentStage, maxVisible);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  // Container size classes
  const containerSizeClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };
  
  // Label size classes
  const labelSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm'
  };

  return (
    <div className={cn(
      "flex items-center",
      containerSizeClasses[size],
      className
    )}>
      {visibleStages.map(stage => {
        const stageInfo = STAGE_INFO[stage as Stage];
        const isCompleted = completedStages.includes(stage);
        const isCurrent = currentStage === stage;
        const isPending = !isCompleted && !isCurrent;
        const isFailed = status === 'failed' && isCurrent;
        
        // Get the appropriate icon
        const StageIcon = stageInfo.icon;
        
        // Status icon overlay (if needed)
        const StatusIcon = isFailed ? AlertCircle :
                            status === 'in_progress' && isCurrent ? Loader2 :
                            isPending ? Clock :
                            undefined;
        
        // Determine icon color
        const iconColor = isCompleted ? 'text-green-500' : 
                           isFailed ? 'text-red-500' : 
                           isCurrent && status === 'in_progress' ? 'text-amber-500' : 
                           'text-muted-foreground';

        return (
          <TooltipProvider key={stage}>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <StageIcon className={cn(
                      sizeClasses[size],
                      iconColor,
                      iconClassName
                    )} />
                    
                    {/* Status indicator */}
                    {StatusIcon && (
                      <div className={cn(
                        "absolute -bottom-1 -right-1 rounded-full bg-background",
                        isFailed ? "text-red-500" :
                        isCurrent && status === 'in_progress' ? "text-amber-500" :
                        "text-muted-foreground"
                      )}>
                        <StatusIcon className={cn(
                          size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5',
                          isCurrent && status === 'in_progress' && "animate-spin"
                        )} />
                      </div>
                    )}
                    
                    {/* Stage number indicator */}
                    <div className="absolute -top-1 -left-1 rounded-full bg-background flex items-center justify-center 
                                   border border-muted text-muted-foreground text-[9px] font-mono w-3.5 h-3.5 p-0">
                      {stage}
                    </div>
                  </div>
                  
                  {/* Optional label */}
                  {showLabels && (
                    <span className={cn(
                      "mt-1 font-medium",
                      labelSizeClasses[size],
                      iconColor
                    )}>
                      {stageInfo.name}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <div className="space-y-1">
                  <p className="font-medium">
                    Stage {stage}: {stageInfo.name}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[200px]">
                    {stageInfo.description}
                  </p>
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
  );
}

// Helper function to calculate which stages should be visible when limited
function calculateVisibleStages(
  allStages: number[],
  currentStage: number,
  maxVisible: number
): number[] {
  // Always include the current stage
  const result = [currentStage];
  
  // Calculate how many stages we can show on each side of current
  const remainingSlots = maxVisible - 1;
  const slotsPerSide = Math.floor(remainingSlots / 2);
  
  // Add stages before current
  const stagesBefore = allStages.filter(s => s < currentStage).slice(-slotsPerSide);
  
  // Add stages after current
  const stagesAfter = allStages.filter(s => s > currentStage).slice(0, slotsPerSide + (remainingSlots % 2));
  
  // If we have leftover slots because we're at the beginning or end, add more from the other side
  if (stagesBefore.length < slotsPerSide) {
    const extraAfter = allStages.filter(s => s > currentStage && !stagesAfter.includes(s)).slice(0, slotsPerSide - stagesBefore.length);
    stagesAfter.push(...extraAfter);
  } else if (stagesAfter.length < slotsPerSide + (remainingSlots % 2)) {
    const extraBefore = allStages.filter(s => s < currentStage && !stagesBefore.includes(s)).slice(-(slotsPerSide + (remainingSlots % 2) - stagesAfter.length));
    stagesBefore.unshift(...extraBefore);
  }
  
  // Combine and sort
  return [...stagesBefore, currentStage, ...stagesAfter].sort((a, b) => a - b);
}