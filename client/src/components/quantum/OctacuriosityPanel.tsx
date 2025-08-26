import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";
import { Progress } from "../ui/progress.jsx";
import quantumCoherenceLogger from '../../utils/quantum-coherence-logger.js';

/**
 * OctacuriosityPanel - A visualization of coherence levels across OCTACURIOSITY domains
 * 
 * This component displays the quantum coherence status for each domain in the
 * OCTACURIOSITY Framework, showing the balance between stability (75%) and
 * exploration (25%) in each area.
 */
const OctacuriosityPanel: React.FC = () => {
  const [domainStatus, setDomainStatus] = useState<Record<string, any>>({});
  const [updateCounter, setUpdateCounter] = useState<number>(0);
  const [systemCoherence, setSystemCoherence] = useState<number>(75);
  
  // Update domain status every 5 seconds
  useEffect(() => {
    const fetchStatus = () => {
      const status = quantumCoherenceLogger.getDomainCoherenceStatus();
      setDomainStatus(status);
      setSystemCoherence(quantumCoherenceLogger.calculateSystemCoherence());
    };
    
    // Initial fetch
    fetchStatus();
    
    // Set up interval for updates
    const interval = setInterval(() => {
      fetchStatus();
      setUpdateCounter(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle realignment button click
  const handleRealignment = () => {
    quantumCoherenceLogger.realignAllDomains();
    setUpdateCounter(prev => prev + 1);
    
    // Immediately update status after realignment
    const status = quantumCoherenceLogger.getDomainCoherenceStatus();
    setDomainStatus(status);
    setSystemCoherence(quantumCoherenceLogger.calculateSystemCoherence());
  };
  
  // Handle random perturbation across domains
  const handlePerturbation = () => {
    // Randomly adjust coherence in 3 domains
    const domains = Object.keys(domainStatus);
    const selectedDomains = [...domains].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    selectedDomains.forEach(domain => {
      // Random adjustment between -0.2 and +0.2
      const adjustment = (Math.random() * 0.4 - 0.2);
      const currentLevel = domainStatus[domain].level;
      const newLevel = Math.max(0.1, Math.min(0.9, currentLevel + adjustment));
      
      quantumCoherenceLogger.updateDomainCoherence(
        domain,
        newLevel,
        "Random quantum perturbation"
      );
    });
    
    // Immediately update status after perturbation
    const status = quantumCoherenceLogger.getDomainCoherenceStatus();
    setDomainStatus(status);
    setSystemCoherence(quantumCoherenceLogger.calculateSystemCoherence());
    setUpdateCounter(prev => prev + 1);
  };
  
  // Calculate how many domains are in optimal ratio
  const optimalDomainCount = Object.values(domainStatus).filter(
    (domain: any) => domain.isOptimal
  ).length;
  
  const totalDomains = Object.keys(domainStatus).length;
  const systemHealth = totalDomains ? (optimalDomainCount / totalDomains) * 100 : 0;
  
  return (
    <Card className="w-full bg-black/30 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl leading-tight">OCTACURIOSITY Framework</CardTitle>
            <CardDescription>
              C-Suite AI modules with 3:1 coherence ratio across domains
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={systemCoherence >= 70 ? "default" : "outline"} className="text-sm">
              System Coherence: {systemCoherence.toFixed(0)}%
            </Badge>
            <Badge variant={systemHealth >= 75 ? "default" : "outline"} className="text-sm">
              Domains in Balance: {optimalDomainCount}/{totalDomains}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(domainStatus).map(([domain, status]: [string, any]) => (
            <div 
              key={domain}
              className={`p-3 rounded-lg border ${
                status.isOptimal ? 'bg-green-950/20 border-green-800/30' : 'bg-gray-900/30 border-gray-800/30'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">{domain}</h4>
                <Badge variant={status.isOptimal ? "default" : "outline"} className="text-xs">
                  {status.ratio} Ratio
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {status.description}
              </p>
              
              <div className="flex items-center gap-2">
                <Progress 
                  value={status.percentage} 
                  max={100}
                  className={`h-2 ${status.isOptimal ? 'bg-green-950/30' : 'bg-gray-900/50'}`}
                />
                <span className="text-xs font-mono">{status.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePerturbation}
            className="text-xs"
          >
            Simulate Quantum Perturbation
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleRealignment}
            className="text-xs"
          >
            Realign All Domains to 3:1
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OctacuriosityPanel;