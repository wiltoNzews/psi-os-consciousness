import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, BarChart2, Layers, Zap, FileText, Settings, Shield, 
  Server, Database, Key, UserCheck, HistoryIcon, Code, Globe, Cpu, BrainCog, VideoIcon, 
  ImageIcon, AudioLines, PieChart, Flame, Search } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  toggleExpand?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  href, 
  icon, 
  active, 
  children, 
  badge, 
  badgeColor = "bg-primary",
  hasSubItems,
  isExpanded,
  toggleExpand
}) => {
  return (
    <div className="relative">
      <Link href={href}>
        <div 
          onClick={hasSubItems && toggleExpand ? (e) => {
            e.preventDefault();
            toggleExpand();
          } : undefined}
          className={cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-md group cursor-pointer",
            active 
              ? "bg-primary/20 text-white border-l-2 border-primary" 
              : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
          )}
        >
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3 text-lg">
            {icon}
          </span>
          <span className="flex-1">{children}</span>
          {badge && (
            <Badge className={cn("ml-auto text-xs", badgeColor)}>
              {badge}
            </Badge>
          )}
          {hasSubItems && (
            <span className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 opacity-70" />
              ) : (
                <ChevronRight className="h-4 w-4 opacity-70" />
              )}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
        <div className="flex-grow h-px bg-gray-700/50 mr-2"></div>
        {title}
        <div className="flex-grow h-px bg-gray-700/50 ml-2"></div>
      </div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
};

interface SubItemProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  highlight?: boolean;
}

const SubItem: React.FC<SubItemProps> = ({ href, active, children, highlight }) => {
  return (
    <Link href={href}>
      <div className={cn(
        "pl-12 pr-3 py-2 text-sm rounded-md cursor-pointer",
        active 
          ? "text-white bg-primary/10" 
          : highlight 
            ? "text-primary-300 hover:bg-gray-800/50 hover:text-white" 
            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
      )}>
        {children}
      </div>
    </Link>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  const [expandedItems, setExpandedItems] = useState({
    multimodal: true,
    pipelines: false,
    deployment: false,
  });
  
  type ExpandableSection = 'multimodal' | 'pipelines' | 'deployment';
  
  const toggleExpand = (section: ExpandableSection) => {
    setExpandedItems(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-72 bg-black border-r border-zinc-800/50">
        <div className="flex items-center justify-center h-16 px-4 bg-black border-b border-zinc-800/50">
          <div className="relative flex items-center">
            <span className="absolute -left-1.5 -top-1.5 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <h1 className="text-xl font-bold text-white tracking-tight">SYMBIOSIS<span className="text-primary font-extrabold">AI</span></h1>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow px-3 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="mb-6 px-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 bg-gray-950 border border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-gray-300"
              />
            </div>
          </div>
          
          <SidebarGroup title="Overview">
            <SidebarLink 
              href="/" 
              icon={<BarChart2 className="h-5 w-5 text-indigo-400" />} 
              active={isActive('/')}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink 
              href="/analytics" 
              icon={<PieChart className="h-5 w-5 text-blue-400" />} 
              active={isActive('/analytics')}
            >
              Analytics
            </SidebarLink>
          </SidebarGroup>

          <SidebarGroup title="Multimodal AI">
            <SidebarLink 
              href="/multimodal" 
              icon={<BrainCog className="h-5 w-5 text-blue-400" />} 
              active={isActive('/multimodal')}
              hasSubItems={true}
              isExpanded={expandedItems.multimodal}
              toggleExpand={() => toggleExpand('multimodal')}
            >
              Multimodal Models
            </SidebarLink>
            
            {expandedItems.multimodal && (
              <>
                <SubItem href="/multimodal/vision" active={isActive('/multimodal/vision')} highlight>
                  Vision Models
                </SubItem>
                <SubItem href="/multimodal/language" active={isActive('/multimodal/language')}>
                  Language Models
                </SubItem>
                <SubItem href="/multimodal/audio" active={isActive('/multimodal/audio')}>
                  Audio Models
                </SubItem>
                <SubItem href="/multimodal/multimodal" active={isActive('/multimodal/multimodal')}>
                  Combined Models
                </SubItem>
              </>
            )}
            
            <SidebarLink 
              href="/media" 
              icon={<Layers className="h-5 w-5 text-amber-400" />} 
              active={isActive('/media')}
              badge="Premium"
              badgeColor="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              Media Processing
            </SidebarLink>
            
            <SidebarLink 
              href="/generation" 
              icon={<Flame className="h-5 w-5 text-orange-400" />}
              active={isActive('/generation')}
            >
              Content Generation
            </SidebarLink>
          </SidebarGroup>
          
          <SidebarGroup title="Infrastructure">
            <SidebarLink 
              href="/pipelines" 
              icon={<Zap className="h-5 w-5 text-emerald-400" />} 
              active={isActive('/pipelines')}
              hasSubItems={true}
              isExpanded={expandedItems.pipelines}
              toggleExpand={() => toggleExpand('pipelines')}
            >
              Pipelines
            </SidebarLink>
            
            {expandedItems.pipelines && (
              <>
                <SubItem href="/pipelines/video" active={isActive('/pipelines/video')}>
                  <div className="flex items-center">
                    <VideoIcon className="h-3.5 w-3.5 mr-2 text-indigo-400" />
                    Video Pipelines
                  </div>
                </SubItem>
                <SubItem href="/pipelines/image" active={isActive('/pipelines/image')}>
                  <div className="flex items-center">
                    <ImageIcon className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                    Image Pipelines
                  </div>
                </SubItem>
                <SubItem href="/pipelines/audio" active={isActive('/pipelines/audio')}>
                  <div className="flex items-center">
                    <AudioLines className="h-3.5 w-3.5 mr-2 text-purple-400" />
                    Audio Pipelines
                  </div>
                </SubItem>
              </>
            )}
            
            <SidebarLink 
              href="/config" 
              icon={<Settings className="h-5 w-5 text-gray-400" />} 
              active={isActive('/config')}
            >
              System Config
            </SidebarLink>
            
            <SidebarLink 
              href="/deployment" 
              icon={<Globe className="h-5 w-5 text-blue-400" />} 
              active={isActive('/deployment')}
              hasSubItems={true}
              isExpanded={expandedItems.deployment}
              toggleExpand={() => toggleExpand('deployment')}
            >
              Deployment
            </SidebarLink>
            
            {expandedItems.deployment && (
              <>
                <SubItem href="/deployment/edge" active={isActive('/deployment/edge')}>
                  Edge Deployment
                </SubItem>
                <SubItem href="/deployment/cloud" active={isActive('/deployment/cloud')} highlight>
                  Cloud Services
                </SubItem>
                <SubItem href="/deployment/hybrid" active={isActive('/deployment/hybrid')}>
                  Hybrid Solutions
                </SubItem>
              </>
            )}
          </SidebarGroup>
          
          <SidebarGroup title="Administration">
            <SidebarLink 
              href="/api-keys" 
              icon={<Key className="h-5 w-5 text-amber-400" />} 
              active={isActive('/api-keys')}
              badge="4"
            >
              API & Model Keys
            </SidebarLink>
            
            <SidebarLink 
              href="/access" 
              icon={<Shield className="h-5 w-5 text-green-400" />} 
              active={isActive('/access')}
            >
              Security & Access
            </SidebarLink>
            
            <SidebarLink 
              href="/logs" 
              icon={<HistoryIcon className="h-5 w-5 text-red-400" />} 
              active={isActive('/logs')}
            >
              System Logs
            </SidebarLink>
          </SidebarGroup>

          <SidebarGroup title="Developer">
            <SidebarLink 
              href="/integration" 
              icon={<Code className="h-5 w-5 text-cyan-400" />} 
              active={isActive('/integration')}
            >
              API Integration
            </SidebarLink>
            
            <SidebarLink 
              href="/resources" 
              icon={<FileText className="h-5 w-5 text-neutral-400" />} 
              active={isActive('/resources')}
            >
              Documentation
            </SidebarLink>
          </SidebarGroup>
        </div>
        
        <div className="flex-shrink-0 border-t border-zinc-800/50 p-4 bg-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9 border border-zinc-700/50">
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80" alt="Admin avatar" />
                <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">Enterprise Admin</p>
                <p className="text-xs text-zinc-500 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  System Administrator
                </p>
              </div>
            </div>
            <button className="text-zinc-500 hover:text-white">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
