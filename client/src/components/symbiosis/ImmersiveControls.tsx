import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDomain } from '@/contexts/DomainContext';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Tag, 
  LayoutGrid,
  RefreshCw,
  Mic,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface ImmersiveControlsProps {
  onToggleFullscreen: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleLabels: () => void;
  onToggleDataFlow: () => void;
  onReset: () => void;
  onActivateVoice?: () => void;
  isFullscreen: boolean;
  showLabels: boolean;
  showDataFlow: boolean;
  className?: string;
}

/**
 * Premium, minimalist control interface for the NeuroSynapse visualization
 * Inspired by high-end brands like Supreme, Apple, and Nike
 */
export function ImmersiveControls({
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onToggleLabels,
  onToggleDataFlow,
  onReset,
  onActivateVoice,
  isFullscreen,
  showLabels,
  showDataFlow,
  className
}: ImmersiveControlsProps) {
  const { domainConfig } = useDomain();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-collapse after a period of inactivity in fullscreen mode
  useEffect(() => {
    if (isFullscreen && !isHovered) {
      const timer = setTimeout(() => {
        setIsCollapsed(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, isHovered]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex items-center",
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsCollapsed(false);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* Collapse/Expand Button (only in fullscreen) */}
      {isFullscreen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isCollapsed ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsCollapsed(false)}
          className={cn(
            "absolute left-0 top-0 z-10 p-1.5 rounded-md bg-black/50 backdrop-blur-md",
            "border border-white/10 shadow-lg hover:border-white/30 transition-all",
            isCollapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          style={{ 
            boxShadow: `0 0 20px 0 rgba(0, 0, 0, 0.25), 0 0 5px 0 ${domainConfig.accentColor}30` 
          }}
        >
          <ChevronRight className="h-5 w-5 text-white/80" />
        </motion.button>
      )}
      
      {/* Main Controls Panel */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center gap-2 p-1.5 rounded-lg bg-black/70 backdrop-blur-md",
              "border border-white/10 shadow-lg"
            )}
            style={{ 
              boxShadow: `0 0 20px 0 rgba(0, 0, 0, 0.5), 0 0 10px 0 ${domainConfig.accentColor}20` 
            }}
          >
            {/* Collapse button (only in fullscreen) */}
            {isFullscreen && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 mr-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-white/70" />
              </button>
            )}
          
            {/* Fullscreen toggle */}
            <ControlButton
              onClick={onToggleFullscreen}
              icon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              tooltip={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              isActive={isFullscreen}
              accentColor={domainConfig.accentColor}
            />
            
            {/* Zoom controls */}
            <ControlButton
              onClick={onZoomIn}
              icon={<ZoomIn className="h-4 w-4" />}
              tooltip="Zoom In"
              accentColor={domainConfig.accentColor}
            />
            
            <ControlButton
              onClick={onZoomOut}
              icon={<ZoomOut className="h-4 w-4" />}
              tooltip="Zoom Out"
              accentColor={domainConfig.accentColor}
            />
            
            {/* Visual toggles */}
            <div className="w-px h-6 bg-white/10 mx-1" />
            
            <ControlButton
              onClick={onToggleLabels}
              icon={<Tag className="h-4 w-4" />}
              tooltip="Toggle Labels"
              isActive={showLabels}
              accentColor={domainConfig.accentColor}
            />
            
            <ControlButton
              onClick={onToggleDataFlow}
              icon={<LayoutGrid className="h-4 w-4" />}
              tooltip="Toggle Data Flow"
              isActive={showDataFlow}
              accentColor={domainConfig.accentColor}
            />
            
            {/* Reset */}
            <div className="w-px h-6 bg-white/10 mx-1" />
            
            <ControlButton
              onClick={onReset}
              icon={<RefreshCw className="h-4 w-4" />}
              tooltip="Reset View"
              accentColor={domainConfig.accentColor}
            />
            
            {/* Voice control (if available) */}
            {onActivateVoice && (
              <ControlButton
                onClick={onActivateVoice}
                icon={<Mic className="h-4 w-4" />}
                tooltip="Voice Control"
                isPulsing={true}
                accentColor={domainConfig.accentColor}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          "p-2 rounded-md transition-all flex items-center justify-center relative",
          isActive 
            ? "bg-gradient-to-b from-white/20 to-white/5 text-white" 
            : "hover:bg-white/10 text-white/70 hover:text-white",
          isPulsing && "animate-pulse",
          className
        )}
        style={isActive ? { boxShadow: `0 0 10px 0 ${accentColor}70` } : {}}
      >
        {icon}
        
        {/* Active indicator dot */}
        {isActive && (
          <span 
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </button>
      
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white/90 text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltip}
      </span>
    </div>
  );
}