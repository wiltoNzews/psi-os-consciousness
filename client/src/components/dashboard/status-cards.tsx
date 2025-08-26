import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SystemStatus } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { BarChart, BarChart2, Database, Cpu, Cloud, Server, Activity, Zap, 
         HardDrive, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusCardProps {
  data: SystemStatus;
  index: number;
}

export function StatusCard({ data, index }: StatusCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-500';
      case 'high load':
      case 'warning':
        return 'text-amber-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };
  
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-emerald-500';
      case 'high load':
      case 'warning':
        return 'bg-amber-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  const getBorderGlow = (status: string) => {
    switch (status) {
      case 'operational':
        return 'group-hover:ring-emerald-500/30';
      case 'high load':
      case 'warning':
        return 'group-hover:ring-amber-500/30';
      case 'down':
        return 'group-hover:ring-red-500/30';
      default:
        return 'group-hover:ring-primary/30';
    }
  };
  
  const getIconGradient = (status: string, id: string) => {
    if (id === 'pipeline' && status === 'operational') 
      return 'from-indigo-500 to-violet-600';
    if (id === 'api' && status === 'operational') 
      return 'from-blue-500 to-cyan-500';
    if (id === 'storage' && status === 'warning') 
      return 'from-amber-500 to-orange-600';
    if (id === 'media' && status === 'high load') 
      return 'from-orange-500 to-pink-600';
    
    switch (status) {
      case 'operational':
        return 'from-emerald-500 to-teal-600';
      case 'high load':
      case 'warning':
        return 'from-amber-500 to-yellow-600';
      case 'down':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-primary to-violet-600';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
            <span className="text-xs font-medium text-emerald-500">Operational</span>
          </div>
        );
      case 'high load':
        return (
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse mr-1.5"></span>
            <span className="text-xs font-medium text-orange-500">High Load</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5"></span>
            <span className="text-xs font-medium text-amber-500">Warning</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5"></span>
            <span className="text-xs font-medium text-red-500">Offline</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
            <span className="text-xs font-medium text-gray-500">Unknown</span>
          </div>
        );
    }
  };
  
  const getStatusIcon = (id: string) => {
    switch (id) {
      case 'pipeline':
        return <Zap className="h-6 w-6" />;
      case 'api':
        return <Cloud className="h-6 w-6" />;
      case 'media':
        return <BarChart2 className="h-6 w-6" />;
      case 'storage':
        return <Database className="h-6 w-6" />;
      case 'compute':
        return <Cpu className="h-6 w-6" />;
      case 'inference':
        return <Activity className="h-6 w-6" />;
      case 'network':
        return <Globe className="h-6 w-6" />;
      default:
        return <Server className="h-6 w-6" />;
    }
  };
  
  // Special handling for storage capacity which shows a progress bar
  const isStorageCard = data.id === 'storage';
  const storagePercentage = isStorageCard ? parseInt(data.value as string) : 0;
  
  // Animation delay for staggered entry
  const animationDelay = `${index * 0.1}s`;

  return (
    <Card 
      className={cn(
        "bg-gray-900/70 border-gray-800 overflow-hidden group transition-all duration-200",
        "hover:ring-2 hover:ring-opacity-50 hover:scale-[1.02] backdrop-blur-sm",
        "hover:shadow-xl hover:shadow-black/5",
        getBorderGlow(data.status),
        "animate-fade-in"
      )}
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-5">
        <div className="mb-3 flex justify-between items-center">
          {getStatusBadge(data.status)}
          
          <Badge 
            variant="outline" 
            className="text-[10px] px-2 py-0 h-4 border-gray-700 text-gray-400"
          >
            Cluster {Math.floor(Math.random() * 9) + 1}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{data.name}</h3>
          
          <div 
            className={cn(
              "p-2.5 rounded-full bg-gradient-to-br", 
              getIconGradient(data.status, data.id)
            )}
          >
            {getStatusIcon(data.id)}
          </div>
        </div>
        
        <div className="mt-3">
          {isStorageCard ? (
            <div>
              <div className="flex justify-between items-center text-sm mb-1.5">
                <div className="font-medium text-white">{data.value} Used</div>
                <div className="text-gray-400">of 100TB</div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full relative overflow-hidden",
                    storagePercentage > 75 ? "bg-amber-500" : "bg-primary"
                  )} 
                  style={{ width: `${storagePercentage}%` }}
                >
                  {isHovering && (
                    <span className="absolute inset-0 bg-white/20 animate-pulse-slow"></span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2">
              <div className={cn("text-lg font-bold flex items-center", getStatusColor(data.status))}>
                {data.value}
              </div>
              
              {data.id === 'api' && (
                <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  10ms latency
                </div>
              )}
              
              {data.id === 'pipeline' && (
                <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  3 active chains
                </div>
              )}
              
              {data.id === 'media' && (
                <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  8 queued jobs
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-950/70 px-5 py-3 flex justify-between items-center border-t border-gray-800">
        <div className="text-sm">
          <a href="#" className="font-medium text-primary hover:text-indigo-300">View details</a>
        </div>
        
        {data.status === 'operational' ? (
          <div className="text-xs text-emerald-500 flex items-center">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            <span>Healthy</span>
          </div>
        ) : data.status === 'down' ? (
          <div className="text-xs text-red-500 flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            <span>Attention needed</span>
          </div>
        ) : (
          <div className="text-xs text-amber-500 flex items-center">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            <span>Monitor</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

interface StatusCardsGridProps {
  statuses: SystemStatus[];
}

export function StatusCardsGrid({ statuses }: StatusCardsGridProps) {
  const expandedStatuses = [
    ...statuses,
    {
      id: 'compute',
      name: 'Compute Capacity',
      status: 'operational' as 'operational',
      value: '73% Available',
      icon: 'microchip'
    },
    {
      id: 'inference',
      name: 'Inference Engine',
      status: 'operational' as 'operational',
      value: '234ms avg',
      icon: 'brain'
    },
    {
      id: 'network',
      name: 'Network Traffic',
      status: 'warning' as 'warning',
      value: '872 GB/day',
      icon: 'network-wired'
    },
    {
      id: 'security',
      name: 'Security Status',
      status: 'operational' as 'operational',
      value: 'Protected',
      icon: 'shield-alt'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="flex-grow h-px bg-gray-800"></div>
        <div className="mx-4 flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
          <span className="text-xs font-semibold tracking-wide text-primary">ENTERPRISE INFRASTRUCTURE STATUS</span>
        </div>
        <div className="flex-grow h-px bg-gray-800"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {expandedStatuses.map((status, i) => (
          <StatusCard key={status.id} data={status} index={i} />
        ))}
      </div>
    </div>
  );
}
