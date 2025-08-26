import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LemniscateToggleProps {
  active: boolean;
  onToggle: () => void;
}

export default function LemniscateToggle({ active, onToggle }: LemniscateToggleProps) {
  return (
    <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="lemniscate-mode"
          checked={active}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-purple-600"
        />
        <Label 
          htmlFor="lemniscate-mode" 
          className={`font-mono text-sm ${active ? 'text-purple-400' : 'text-gray-400'}`}
        >
          {active ? '∞' : '○'} {active ? 'Lemniscate Mode' : 'Coherence Mode'}
        </Label>
      </div>
      
      {active && (
        <div className="text-xs text-purple-300 font-mono animate-pulse">
          ψ-field active
        </div>
      )}
    </div>
  );
}