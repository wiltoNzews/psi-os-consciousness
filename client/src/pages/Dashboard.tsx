/**
 * Loki Variant System Dashboard
 * 
 * This page integrates all dashboard components to provide a comprehensive
 * view of the Loki Variant System, including agent status, quantum chunk flow,
 * symbolic communication, and performance metrics.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { StatusCardsGrid } from '@/components/dashboard/status-cards';
import { ApiKeyManagementSection } from '@/components/dashboard/api-key-section';
import { PipelineVisualizationCard } from '@/components/dashboard/pipeline-visualization';
import { PerformanceMetricsCard } from '@/components/dashboard/performance-metrics';
import { JobQueuePanel } from '@/components/dashboard/job-queue';
import { MediaPreviewPanel } from '@/components/dashboard/media-preview';
import { SystemHealthSection } from '@/components/dashboard/system-health';
import { ModelRegistrySection, LangChainIntegrationExample } from '@/components/multimodal/model-registry';
import { 
  SymbiosisSection, 
  NeuroSynapse, 
  MultimodalInsights, 
  HumanAugmentation 
} from '@/components/symbiosis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, Menu, Plus, RefreshCw, Search, 
  UserCircle2, LayoutDashboard, Settings, Command,
  BrainCog, Activity, Code, Zap, Layers, FileIcon, Sparkles
} from 'lucide-react';
import { getSystemStatuses } from '@/lib/mock-data';
import { motion } from 'framer-motion';

// For Loki Variant Dashboard
import { LokiSystemOverview } from "@/components/dashboard/LokiSystemOverview";
import { AgentStatusPanel } from "@/components/dashboard/AgentStatusPanel";
import { QuantumChunkFlow } from "@/components/dashboard/QuantumChunkFlow";
import { SymbolicCommunicationGraph } from "@/components/dashboard/SymbolicCommunicationGraph";
import { PerformanceMetricsPanel } from "@/components/dashboard/PerformanceMetricsPanel";

/**
 * Simplified Loki Variant Dashboard View
 */
export function LokiVariantDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Loki Variant System Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <LokiSystemOverview />
        <AgentStatusPanel />
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <QuantumChunkFlow />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SymbolicCommunicationGraph />
        <PerformanceMetricsPanel />
      </div>
    </div>
  );
}

/**
 * Main Dashboard component with Symbiosis UI
 */
export default function Dashboard() {
  const [systemStatuses, setSystemStatuses] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDomain, setActiveDomain] = useState<'finance' | 'crypto' | 'sports' | 'general'>('finance');
  const [showLokiVariant, setShowLokiVariant] = useState(false);
  
  // Initialize with mock data
  useEffect(() => {
    setSystemStatuses(getSystemStatuses());
  }, []);
  
  const handleRefresh = () => {
    // Simulate refreshing dashboard data
    setSystemStatuses(getSystemStatuses());
  };
  
  // Toggle between dashboard views
  const toggleDashboardView = () => {
    setShowLokiVariant(!showLokiVariant);
  };
  
  // If showing the Loki Variant Dashboard
  if (showLokiVariant) {
    return (
      <div>
        <Button 
          onClick={toggleDashboardView}
          className="m-4 button-primary text-xs h-8"
        >
          Switch to Symbiosis Dashboard
        </Button>
        <LokiVariantDashboard />
      </div>
    );
  }
  
  // Otherwise show the main Symbiosis Dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="flex-shrink-0 bg-black/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-20">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Mobile menu button */}
            <button type="button" className="md:hidden text-zinc-400 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center">
              <span className="font-semibold text-white tracking-tight">Symbiosis<span className="text-primary">AI</span></span>
              <Badge className="ml-2 bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] px-1.5 py-0 h-4">
                Pro
              </Badge>
            </div>
            
            <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative text-zinc-400 focus-within:text-zinc-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input 
                    id="search" 
                    name="search" 
                    className={`block w-full bg-zinc-950/70 border border-zinc-800 rounded-md py-1.5 pl-9 pr-3 text-sm placeholder-zinc-500 focus:outline-none focus:text-white focus:ring-1 focus:ring-primary/30 ${isSearchFocused ? 'ring-primary/50 ring-1' : ''}`}
                    placeholder="Search..." 
                    type="search"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={toggleDashboardView}
                className="text-xs h-8"
              >
                <BrainCog className="mr-1.5 h-3 w-3" />
                Switch to Loki
              </Button>
              
              <div className="hidden md:flex items-center space-x-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-400">
                <Command className="h-3 w-3 mr-1" />
                <span>K</span>
              </div>
              
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white w-8 h-8">
                  <Bell className="h-4 w-4" />
                </Button>
                <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
              </div>
              
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white w-8 h-8">
                <Settings className="h-4 w-4" />
              </Button>
              
              <div className="bg-zinc-800/50 h-6 w-px mx-1"></div>
              
              <div className="flex items-center border border-zinc-800 bg-zinc-900/50 rounded-full py-1 pl-1 pr-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                  <UserCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-medium text-zinc-300">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Page header */}
            <div className="relative rounded-lg p-6 mb-6 bg-black border border-zinc-800/50">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center bg-primary/10 rounded-sm px-2 py-1 border border-primary/20">
                      <LayoutDashboard className="h-3 w-3 text-primary mr-1.5" />
                      <span className="text-xs font-medium text-primary">Dashboard</span>
                    </div>
                    <span className="ml-3 text-xs text-zinc-500">
                      Last updated: March 26, 2025
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold text-white mb-1">Symbiosis<span className="text-primary">AI</span> Platform</h1>
                  <p className="text-blue-300/80 text-sm max-w-2xl">
                    AI-Human symbiosis platform with integrated data pipelines for finance, crypto, sports analytics, and multimodal AI orchestration.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 flex space-x-3">
                  <Button variant="outline" className="button-outline text-xs h-8" onClick={handleRefresh}>
                    <RefreshCw className="mr-1.5 h-3 w-3" />
                    Refresh Data
                  </Button>
                  <Button className="button-primary text-xs h-8">
                    <Plus className="mr-1.5 h-3 w-3" />
                    Create Pipeline
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="symbiosis-data-tile data-ai border-l-4 p-3 flex items-center space-x-3 rounded-md">
                  <div className="text-xs text-blue-200 font-medium">AI Models</div>
                  <div className="ml-auto text-sm font-semibold text-white">12</div>
                </div>
                <div className="symbiosis-data-tile data-finance border-l-4 p-3 flex items-center space-x-3 rounded-md">
                  <div className="text-xs text-green-200 font-medium">Finance Pipelines</div>
                  <div className="ml-auto text-sm font-semibold text-white">8</div>
                </div>
                <div className="symbiosis-data-tile data-crypto border-l-4 p-3 flex items-center space-x-3 rounded-md">
                  <div className="text-xs text-orange-200 font-medium">Crypto Streams</div>
                  <div className="ml-auto text-sm font-semibold text-white">5</div>
                </div>
                <div className="symbiosis-data-tile data-sports border-l-4 p-3 flex items-center space-x-3 rounded-md">
                  <div className="text-xs text-blue-200 font-medium">Sports Data</div>
                  <div className="ml-auto text-sm font-semibold text-white">143</div>
                </div>
                <div className="symbiosis-data-tile border-l-4 border-l-gray-500/70 p-3 flex items-center space-x-3 rounded-md">
                  <div className="text-xs text-white font-medium">Active Users</div>
                  <div className="ml-auto text-sm font-semibold text-white">3</div>
                </div>
              </div>
            </div>

            {/* Human-AI Symbiosis Section - MAIN FOCUS */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <BrainCog className="h-6 w-6 text-primary mr-3" />
                <span>Human-AI Symbiosis Platform</span>
              </h2>
              <div className="mb-6 max-w-3xl">
                <p className="text-blue-300/80 text-sm">
                  The SymbiosisAI platform creates a seamless integration between human intelligence and AI capabilities,
                  enabling enhanced decision-making and performance across finance, crypto, and sports analytics.
                </p>
              </div>
              <SymbiosisSection 
                domain={activeDomain}
                onDomainChange={(domain) => setActiveDomain(domain as 'finance' | 'crypto' | 'sports' | 'general')}
              />
            </div>

            {/* Expanded Symbiosis Components - Core Additional Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="h-96">
                <h2 className="symbiosis-header mb-4">
                  <div className="symbiosis-icon">
                    <BrainCog size={16} />
                  </div>
                  <span>Neural Network Visualization</span>
                </h2>
                <NeuroSynapse domain={activeDomain} className="h-full" />
              </div>
              
              <div className="h-96">
                <h2 className="symbiosis-header mb-4">
                  <div className="symbiosis-icon">
                    <Zap size={16} />
                  </div>
                  <span>Human Augmentation Interface</span>
                </h2>
                <HumanAugmentation domain={activeDomain} />
              </div>
            </div>
            
            {/* Multimodal Insights Row */}
            <div className="mb-8">
              <h2 className="symbiosis-header mb-4">
                <div className="symbiosis-icon">
                  <Sparkles size={16} />
                </div>
                <span>Multimodal Insights</span>
              </h2>
              <div className="h-96">
                <MultimodalInsights domain={activeDomain} />
              </div>
            </div>

            {/* Pipeline Visualization and Analytics Section (2-column layout) */}
            <div className="mb-8">
              <h2 className="symbiosis-header">
                <div className="symbiosis-icon">
                  <Layers size={16} />
                </div>
                <span>Analytics & Pipelines</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="symbiosis-panel rounded-lg p-6 data-finance border-l-4">
                  <PipelineVisualizationCard />
                </div>
                <div className="symbiosis-panel rounded-lg p-6 data-crypto border-l-4">
                  <PerformanceMetricsCard />
                </div>
              </div>
            </div>

            {/* Two-panel layout for Job Queue and Media Preview */}
            <div className="mb-8">
              <h2 className="symbiosis-header">
                <div className="symbiosis-icon">
                  <FileIcon size={16} />
                </div>
                <span>Jobs & Media</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="symbiosis-panel rounded-lg p-6 data-sports border-l-4">
                  <JobQueuePanel />
                </div>
                <div className="symbiosis-panel rounded-lg p-6 data-ai border-l-4">
                  <MediaPreviewPanel />
                </div>
              </div>
            </div>

            {/* System Health & Error Logs */}
            <div className="mb-8">
              <h2 className="symbiosis-header">
                <div className="symbiosis-icon">
                  <Activity size={16} />
                </div>
                <span>System Health & Diagnostics</span>
              </h2>
              <div className="symbiosis-panel rounded-lg p-6">
                <SystemHealthSection />
              </div>
            </div>
            
            {/* Footer */}
            <footer className="mt-16 mb-4 py-6 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="w-px h-10 bg-zinc-800"></div>
                <div className="mx-4 flex flex-col items-center">
                  <div className="flex items-center mb-1">
                    <BrainCog className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-semibold text-white tracking-wide">SYMBIOSIS<span className="text-primary">AI</span></span>
                  </div>
                  <div className="text-xs text-blue-500/70">Human Intelligence • AI Augmentation • Seamless Integration</div>
                </div>
                <div className="w-px h-10 bg-zinc-800"></div>
              </div>
              <p className="text-xs text-blue-600/70">
                AI-Human Symbiosis Platform • v3.2.1 • © 2025 SymbiosisAI Inc.
              </p>
            </footer>
          </motion.div>
        </main>
      </div>
    </div>
  );
}