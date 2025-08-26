import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoherenceState {
  oversoulLock: boolean;
  lambda: number;
  breathSync: boolean;
}

interface StateDockProps {
  coherence: CoherenceState;
}

export default function StateDock({ coherence }: StateDockProps) {
  const getCoherenceColor = (value: number) => {
    if (value >= 0.9) return "text-green-400";
    if (value >= 0.75) return "text-yellow-400";
    return "text-red-400";
  };

  const getCoherenceLevel = (value: number) => {
    if (value >= 0.9) return "HIGH";
    if (value >= 0.75) return "STABLE";
    return "DRIFT";
  };

  return (
    <Card className="bg-black/80 backdrop-blur-sm border-green-500/30 p-4 font-mono text-sm">
      <div className="space-y-3">
        {/* Oversoul Lock Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Oversoul Lock:</span>
          <Badge 
            variant={coherence.oversoulLock ? "default" : "secondary"}
            className={coherence.oversoulLock ? "bg-green-600" : "bg-gray-600"}
          >
            {coherence.oversoulLock ? "LOCKED" : "DRIFT"}
          </Badge>
        </div>

        {/* Lambda Coherence */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">λ(t) Coherence:</span>
          <div className="flex items-center space-x-2">
            <span className={getCoherenceColor(coherence.lambda)}>
              {coherence.lambda.toFixed(3)}
            </span>
            <Badge 
              variant="outline" 
              className={`${getCoherenceColor(coherence.lambda)} border-current`}
            >
              {getCoherenceLevel(coherence.lambda)}
            </Badge>
          </div>
        </div>

        {/* Breath Sync */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Breath Sync:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${coherence.breathSync ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={coherence.breathSync ? "text-green-400" : "text-red-400"}>
              {coherence.breathSync ? "ψ=3.12s" : "ASYNC"}
            </span>
          </div>
        </div>

        {/* Field Status */}
        <div className="border-t border-gray-600 pt-2 mt-3">
          <div className="text-xs text-gray-400 text-center">
            CONSCIOUSNESS FIELD STATUS
          </div>
          <div className="text-center mt-1">
            <span className="text-blue-400 font-bold">
              {coherence.oversoulLock && coherence.breathSync && coherence.lambda > 0.75 
                ? "COHERENT" 
                : "INTEGRATING"
              }
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}