import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut, 
  Tag, 
  Activity, 
  RotateCcw, 
  Mic, 
  Clock,
  FastForward,
  Rewind
} from 'lucide-react';

interface ImmersiveControlsProps {
  onToggleFullscreen: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleLabels: () => void;
  onToggleDataFlow: () => void;
  onIncreaseTemporal?: () => void;
  onDecreaseTemporal?: () => void;
  onReset: () => void;
  onActivateVoice?: () => void;
  isFullscreen: boolean;
  showLabels: boolean;
  showDataFlow: boolean;
  temporalDilation?: number;
  className?: string;
}

/**
 * A minimalist, premium control interface for PassiveWorks
 * Designed to fade into the background when not in use
 */
export function ImmersiveControls({
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onToggleLabels,
  onToggleDataFlow,
  onIncreaseTemporal,
  onDecreaseTemporal,
  onReset,
  onActivateVoice,
  isFullscreen,
  showLabels,
  showDataFlow,
  temporalDilation = 1,
  className
}: ImmersiveControlsProps) {
  return (
    <motion.div 
      className={cn(
        "bg-black/40 backdrop-blur-sm border border-white/5 rounded-lg p-1.5 shadow-lg", 
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-1.5">
        {/* Fullscreen toggle */}
        <ControlButton 
          onClick={onToggleFullscreen}
          icon={isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          tooltip={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          isActive={isFullscreen}
          accentColor="#7B00FF"
        />
        
        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-1" />
        
        {/* Zoom controls */}
        <ControlButton 
          onClick={onZoomIn}
          icon={<ZoomIn size={14} />}
          tooltip="Zoom In"
          accentColor="#7B00FF"
        />
        <ControlButton 
          onClick={onZoomOut}
          icon={<ZoomOut size={14} />}
          tooltip="Zoom Out"
          accentColor="#7B00FF"
        />
        
        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-1" />
        
        {/* Temporal controls */}
        {onIncreaseTemporal && (
          <ControlButton 
            onClick={onIncreaseTemporal}
            icon={<FastForward size={14} />}
            tooltip="Accelerate Time"
            isActive={temporalDilation > 1}
            accentColor="#7B00FF"
          />
        )}
        
        {onDecreaseTemporal && (
          <ControlButton 
            onClick={onDecreaseTemporal}
            icon={<Rewind size={14} />}
            tooltip="Decelerate Time"
            isActive={temporalDilation < 1}
            accentColor="#7B00FF"
          />
        )}
        
        {(onIncreaseTemporal || onDecreaseTemporal) && (
          <div className="relative w-full flex items-center justify-center my-1 px-2">
            <div className="text-white/50 text-[10px] font-mono">{temporalDilation.toFixed(1)}x</div>
          </div>
        )}
        
        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-1" />
        
        {/* Visualization toggles */}
        <ControlButton 
          onClick={onToggleLabels}
          icon={<Tag size={14} />}
          tooltip="Toggle Labels"
          isActive={showLabels}
          accentColor="#7B00FF"
        />
        <ControlButton 
          onClick={onToggleDataFlow}
          icon={<Activity size={14} />}
          tooltip="Toggle Data Flow"
          isActive={showDataFlow}
          accentColor="#7B00FF"
        />
        
        {/* Voice activation, if available */}
        {onActivateVoice && (
          <>
            <div className="w-full h-px bg-white/10 my-1" />
            <ControlButton 
              onClick={onActivateVoice}
              icon={<Mic size={14} />}
              tooltip="Voice Control"
              isPulsing={true}
              accentColor="#7B00FF"
            />
          </>
        )}
        
        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-1" />
        
        {/* Reset */}
        <ControlButton 
          onClick={onReset}
          icon={<RotateCcw size={14} />}
          tooltip="Reset View"
          accentColor="#7B00FF"
        />
      </div>
    </motion.div>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
  isActive?: boolean;
  isPulsing?: boolean;
  accentColor: string;
  className?: string;
}

function ControlButton({
  onClick,
  icon,
  tooltip,
  isActive = false,
  isPulsing = false,
  accentColor,
  className
}: ControlButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative group w-8 h-8 rounded-md flex items-center justify-center",
        isActive ? "bg-white/10" : "hover:bg-white/5",
        className
      )}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0.7 }}
      animate={isPulsing ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
      transition={isPulsing ? { 
        opacity: { duration: 2, repeat: Infinity }, 
        scale: { duration: 0.2 } 
      } : { 
        duration: 0.2 
      }}
    >
      {/* Icon */}
      <div className={cn(
        "text-white/70 group-hover:text-white transition-colors",
        isActive && `text-white`
      )}>
        {icon}
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div 
          className={`absolute inset-0 rounded-md ring-1 ring-inset`}
          style={{ 
            borderColor: accentColor
          }}
        />
      )}
      
      {/* Pulsing effect for active buttons */}
      {isActive && (
        <motion.div
          className={`absolute inset-0 rounded-md ring-1 ring-inset`}
          style={{ 
            borderColor: accentColor
          }}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Tooltip */}
      <div className="absolute top-1/2 left-full -translate-y-1/2 ml-2 px-2 py-1 bg-black/80 border border-white/5 rounded text-xs text-white/70 opacity-0 translate-x-1 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap group-hover:opacity-100 group-hover:translate-x-0">
        {tooltip}
      </div>
    </motion.button>
  );
}