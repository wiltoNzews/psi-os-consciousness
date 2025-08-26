import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { DomainProvider, useDomain } from '@/contexts/DomainContext';
import { 
  BrainCog, 
  Menu, 
  X, 
  Layers, 
  BarChart3, 
  Settings, 
  User, 
  LineChart,
  Activity,
  Zap,
  Gauge,
  Lightbulb,
  Sparkles,
  UserPlus,
  Lock
} from 'lucide-react';

interface SymbiosisLayoutProps {
  children: React.ReactNode;
}

export function SymbiosisLayout({ children }: SymbiosisLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed on desktop, sliding on mobile */}
      <motion.aside
        className={`fixed inset-y-0 left-0 w-64 bg-black/40 backdrop-blur-xl border-r border-zinc-800/40 z-40 lg:relative transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar header with logo */}
        <div className="h-16 flex items-center px-4 border-b border-zinc-800/40">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <BrainCog className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-semibold tracking-wide">SYMBIOSIS<span className="text-blue-400">AI</span></div>
              <div className="text-[10px] text-blue-500/70">Human-AI Augmentation Platform</div>
            </div>
          </div>
          
          <button 
            className="ml-auto lg:hidden text-zinc-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation links */}
        <nav className="p-4 space-y-6">
          <div className="space-y-1">
            <Link href="/">
              <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                location === '/' ? 'bg-zinc-800/60 text-white' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
              }`}>
                <Activity className="h-4 w-4 mr-3" />
                Symbiosis Dashboard
              </a>
            </Link>
            
            <Link href="/neural-network">
              <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                location === '/neural-network' ? 'bg-zinc-800/60 text-white' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
              }`}>
                <BrainCog className="h-4 w-4 mr-3" />
                Neural Network
              </a>
            </Link>
            
            <Link href="/augmentation">
              <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                location === '/augmentation' ? 'bg-zinc-800/60 text-white' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
              }`}>
                <Zap className="h-4 w-4 mr-3" />
                Human Augmentation
              </a>
            </Link>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-zinc-500 uppercase px-3 mb-2">Domain Networks</h3>
            <div className="space-y-1">
              <Link href="/domain/finance">
                <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  location === '/domain/finance' ? 'bg-green-900/20 text-green-400 border border-green-900/30' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                }`}>
                  <LineChart className="h-4 w-4 mr-3" />
                  Finance Network
                </a>
              </Link>
              
              <Link href="/domain/crypto">
                <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  location === '/domain/crypto' ? 'bg-orange-900/20 text-orange-400 border border-orange-900/30' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                }`}>
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Crypto Network
                </a>
              </Link>
              
              <Link href="/domain/sports">
                <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  location === '/domain/sports' ? 'bg-blue-900/20 text-blue-400 border border-blue-900/30' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                }`}>
                  <Activity className="h-4 w-4 mr-3" />
                  Sports Network
                </a>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-zinc-500 uppercase px-3 mb-2">Platform</h3>
            <div className="space-y-1">
              <Link href="/insights">
                <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  location === '/insights' ? 'bg-zinc-800/60 text-white' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                }`}>
                  <Lightbulb className="h-4 w-4 mr-3" />
                  Insights & Analytics
                </a>
              </Link>
              
              <Link href="/api-management">
                <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  location === '/api-management' ? 'bg-zinc-800/60 text-white' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                }`}>
                  <Sparkles className="h-4 w-4 mr-3" />
                  API Management
                </a>
              </Link>
              
              <Link href="/settings">
                <a className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                  location === '/settings' ? 'bg-zinc-800/60 text-white' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                }`}>
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </a>
              </Link>
            </div>
          </div>
        </nav>
        
        {/* User profile at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800/40">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="ml-3">
              <div className="text-white text-sm font-medium">John Anderson</div>
              <div className="text-zinc-500 text-xs">Symbiosis Level 4</div>
            </div>
            <button className="ml-auto text-zinc-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="h-16 border-b border-zinc-800/40 bg-black/40 backdrop-blur-xl flex items-center px-4 lg:px-6">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden mr-4 text-zinc-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-medium">Symbiosis Platform</h1>
            <div className="hidden md:flex items-center px-2 py-1 bg-blue-900/20 border border-blue-500/20 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse mr-1.5"></div>
              <span className="text-xs text-blue-400">Neural Connection Active</span>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <div className="h-8 px-3 flex items-center border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-400 mr-2">
                <UserPlus className="h-3.5 w-3.5 mr-2" />
                <span className="text-xs">Invite</span>
              </div>
              
              <div className="h-8 px-3 flex items-center border border-zinc-800 rounded-lg bg-zinc-900/50 text-zinc-400">
                <Lock className="h-3.5 w-3.5 mr-2" />
                <span className="text-xs">Security</span>
              </div>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </header>
        
        {/* Page content with scrolling */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto py-6 px-4 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}