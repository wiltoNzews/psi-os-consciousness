import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Tag, 
  Activity, 
  RotateCcw, 
  Mic, 
  Clock, 
  X 
} from 'lucide-react';

interface QuantumControlsProps {
  domain: DomainType;
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
 * QuantumControls - An advanced, floating control interface for manipulating
 * the neural visualization with elegant animations and responsive design.
 */
export function QuantumControls({
  domain,
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
  className = ''
}: QuantumControlsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const accentColor = domainConfigs[domain].color;
  
  const handleTooltipShow = (id: string | null) => {
    setActiveTooltip(id);
  };
  
  return (
    <div className={`absolute top-1/2 right-6 transform -translate-y-1/2 z-20 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col items-center space-y-3"
      >
        {/* Main controls group */}
        <div className="bg-black/30 backdrop-blur-md rounded-full p-2 border border-white/10 space-y-2">
          {/* Screen Controls */}
          <QuantumButton
            icon={isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            tooltip={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            onClick={onToggleFullscreen}
            isActive={isFullscreen}
            color={accentColor}
            activeBackground={`${accentColor}30`}
            onTooltipShow={handleTooltipShow}
            tooltipId="fullscreen"
            activeTooltip={activeTooltip}
          />
          
          <div className="w-6 h-px bg-white/10 mx-auto my-1"></div>
          
          {/* Zoom Controls */}
          <QuantumButton
            icon={<ZoomIn size={18} />}
            tooltip="Zoom In"
            onClick={onZoomIn}
            color={accentColor}
            onTooltipShow={handleTooltipShow}
            tooltipId="zoomIn"
            activeTooltip={activeTooltip}
          />
          <QuantumButton
            icon={<ZoomOut size={18} />}
            tooltip="Zoom Out"
            onClick={onZoomOut}
            color={accentColor}
            onTooltipShow={handleTooltipShow}
            tooltipId="zoomOut"
            activeTooltip={activeTooltip}
          />
          
          <div className="w-6 h-px bg-white/10 mx-auto my-1"></div>
          
          {/* Visualization Controls */}
          <QuantumButton
            icon={<Tag size={18} />}
            tooltip={showLabels ? "Hide Labels" : "Show Labels"}
            onClick={onToggleLabels}
            isActive={showLabels}
            color={accentColor}
            activeBackground={`${accentColor}30`}
            onTooltipShow={handleTooltipShow}
            tooltipId="labels"
            activeTooltip={activeTooltip}
          />
          <QuantumButton
            icon={<Activity size={18} />}
            tooltip={showDataFlow ? "Hide Data Flow" : "Show Data Flow"}
            onClick={onToggleDataFlow}
            isActive={showDataFlow}
            color={accentColor}
            activeBackground={`${accentColor}30`}
            onTooltipShow={handleTooltipShow}
            tooltipId="dataFlow"
            activeTooltip={activeTooltip}
          />
          
          <div className="w-6 h-px bg-white/10 mx-auto my-1"></div>
          
          {/* Temporal Controls */}
          {onIncreaseTemporal && (
            <QuantumButton
              icon={<Clock size={18} />}
              tooltip="Increase Temporal Flow"
              onClick={onIncreaseTemporal}
              color={accentColor}
              isPulsing={temporalDilation > 1.5}
              onTooltipShow={handleTooltipShow}
              tooltipId="temporalUp"
              activeTooltip={activeTooltip}
            />
          )}
          {onDecreaseTemporal && (
            <QuantumButton
              icon={<Clock size={18} className="opacity-60" />}
              tooltip="Decrease Temporal Flow"
              onClick={onDecreaseTemporal}
              color={accentColor}
              isPulsing={temporalDilation < 0.7}
              onTooltipShow={handleTooltipShow}
              tooltipId="temporalDown"
              activeTooltip={activeTooltip}
            />
          )}
          
          <div className="w-6 h-px bg-white/10 mx-auto my-1"></div>
          
          {/* Reset Control */}
          <QuantumButton
            icon={<RotateCcw size={18} />}
            tooltip="Reset View"
            onClick={onReset}
            color={accentColor}
            onTooltipShow={handleTooltipShow}
            tooltipId="reset"
            activeTooltip={activeTooltip}
          />
          
          {/* Voice Activation */}
          {onActivateVoice && (
            <>
              <div className="w-6 h-px bg-white/10 mx-auto my-1"></div>
              <QuantumButton
                icon={<Mic size={18} />}
                tooltip="Activate Voice Interface"
                onClick={onActivateVoice}
                color={accentColor}
                isPulsing={true}
                onTooltipShow={handleTooltipShow}
                tooltipId="voice"
                activeTooltip={activeTooltip}
              />
            </>
          )}
        </div>
        
        {/* Current temporal dilation indicator */}
        {temporalDilation && (
          <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/10 flex items-center">
            <span 
              className="text-[10px] font-mono text-white/60"
              style={{ color: temporalDilation > 1 ? `${accentColor}` : temporalDilation < 1 ? '#ffffff80' : '#ffffff' }}
            >
              T×{temporalDilation.toFixed(1)}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface QuantumButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
  isPulsing?: boolean;
  color: string;
  activeBackground?: string;
  onTooltipShow: (id: string | null) => void;
  tooltipId: string;
  activeTooltip: string | null;
}

function QuantumButton({
  icon,
  tooltip,
  onClick,
  isActive = false,
  isPulsing = false,
  color,
  activeBackground = 'rgba(255, 255, 255, 0.1)',
  onTooltipShow,
  tooltipId,
  activeTooltip
}: QuantumButtonProps) {
  return (
    <div className="relative" onMouseEnter={() => onTooltipShow(tooltipId)} onMouseLeave={() => onTooltipShow(null)}>
      <motion.button
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`}
        style={{ 
          backgroundColor: isActive ? activeBackground : 'transparent',
          boxShadow: isActive ? `0 0 10px ${color}40` : 'none'
        }}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        animate={isPulsing ? { 
          scale: [1, 1.05, 1],
          boxShadow: [
            `0 0 0px ${color}00`,
            `0 0 8px ${color}60`,
            `0 0 0px ${color}00`
          ]
        } : {}}
        transition={isPulsing ? { 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {icon}
        
        {/* Tooltip */}
        {activeTooltip === tooltipId && (
          <motion.div 
            className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md text-white text-xs py-1 px-2 rounded pointer-events-none"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            style={{ boxShadow: `0 0 10px rgba(0,0,0,0.2)` }}
          >
            {tooltip}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}