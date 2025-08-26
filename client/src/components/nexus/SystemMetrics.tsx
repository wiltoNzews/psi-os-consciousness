import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Activity, 
  Activity as StabilityIcon, 
  Braces as SynergyIcon, 
  Globe as CoherenceIcon 
} from "lucide-react";

interface SystemMetricsProps {
  metrics: {
    systemStability: number;
    nodeSynergy: number;
    globalCoherence: number;
    activeJobs?: number;
    batchSize?: number;
  };
  systemStatus?: any;
  isLoading?: boolean;
}

export function SystemMetrics({ metrics, systemStatus, isLoading = false }: SystemMetricsProps) {
  return (
    <>
      <MetricCard
        title="System Stability"
        value={metrics.systemStability}
        icon={<StabilityIcon className="h-5 w-5" />}
        color="primary"
        isLoading={isLoading}
      />
      <MetricCard
        title="Node Synergy"
        value={metrics.nodeSynergy}
        icon={<SynergyIcon className="h-5 w-5" />}
        color="secondary"
        isLoading={isLoading}
      />
      <MetricCard
        title="Global Coherence"
        value={metrics.globalCoherence}
        icon={<CoherenceIcon className="h-5 w-5" />}
        color="accent"
        isLoading={isLoading}
      />
    </>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "accent";
  isLoading?: boolean;
}

function MetricCard({ title, value, icon, color, isLoading }: MetricCardProps) {
  // Calculate the percentage value for the circular progress
  const percentage = Math.round(value * 100);
  
  // Determine colors based on the specified color prop
  const colorClasses = {
    primary: {
      bg: "bg-primary",
      text: "text-primary",
      light: "bg-primary/10",
    },
    secondary: {
      bg: "bg-secondary",
      text: "text-secondary-foreground",
      light: "bg-secondary/30",
    },
    accent: {
      bg: "bg-accent",
      text: "text-accent-foreground",
      light: "bg-accent/30",
    },
  }[color];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${colorClasses.light}`}>
              {icon}
            </div>
            <span className="font-medium text-sm">{title}</span>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-16 w-16 rounded-full" />
          ) : (
            <div className="relative h-16 w-16">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-secondary/20"></div>
              
              {/* SVG for circular progress */}
              <svg className="absolute inset-0" width="64" height="64" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${percentage * 1.76} 176`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className={colorClasses.text}
                  transform="rotate(-90 32 32)"
                />
              </svg>
              
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{percentage}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}