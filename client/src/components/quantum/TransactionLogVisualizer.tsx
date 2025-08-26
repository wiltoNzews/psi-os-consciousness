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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.jsx";
import quantumCoherenceLogger from '../../utils/quantum-coherence-logger.js';

/**
 * TransactionLogVisualizer - A component for visualizing transactions and their impact on coherence
 * 
 * This component tracks real-world transactions and shows how they align with the
 * quantum coherence ratio (75% coherence, ~24.94% exploration).
 */
interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  adjustedAmount: number;
  description: string;
  coherenceRatio: [number, number];
  domainImpacts: Record<string, number>;
}

const TransactionLogVisualizer: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>('recent');
  const [systemCoherence, setSystemCoherence] = useState<number>(75);
  
  // Sample transaction data (would be replaced with actual API calls in production)
  useEffect(() => {
    // Mock data for demonstration
    const mockTransactions: Transaction[] = [
      {
        id: 'tx-001',
        timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
        amount: 900.00,
        adjustedAmount: 899.46,
        description: 'Strategic partnership payment',
        coherenceRatio: [0.75, 0.2494],
        domainImpacts: {
          CEO: 0.02, // +2% coherence impact
          CFO: 0.05, // +5% coherence impact
          CTO: -0.01, // -1% coherence impact
          CMO: 0.03, // +3% coherence impact
          COO: 0.00, // No impact
          CSO: 0.01, // +1% coherence impact
          UX: 0.00, // No impact
          RD: -0.02, // -2% coherence impact
        }
      },
      {
        id: 'tx-002',
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
        amount: 450.00,
        adjustedAmount: 449.73,
        description: 'Technology infrastructure upgrade',
        coherenceRatio: [0.75, 0.2494],
        domainImpacts: {
          CEO: 0.01,
          CFO: 0.02,
          CTO: 0.07,
          CMO: -0.01,
          COO: 0.03,
          CSO: 0.01,
          UX: 0.02,
          RD: 0.04,
        }
      },
      {
        id: 'tx-003',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
        amount: 1200.00,
        adjustedAmount: 1199.28,
        description: 'Marketing campaign launch',
        coherenceRatio: [0.75, 0.2494],
        domainImpacts: {
          CEO: 0.03,
          CFO: 0.02,
          CTO: 0.01,
          CMO: 0.08,
          COO: 0.02,
          CSO: 0.00,
          UX: 0.03,
          RD: 0.01,
        }
      }
    ];
    
    setTransactions(mockTransactions);
    
    // Fetch system coherence
    const coherenceScore = quantumCoherenceLogger.calculateSystemCoherence();
    setSystemCoherence(coherenceScore);
    
    // Update the system coherence level periodically
    const interval = setInterval(() => {
      const score = quantumCoherenceLogger.calculateSystemCoherence();
      setSystemCoherence(score);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate adjustment percentage
  const calculateAdjustmentPercentage = (original: number, adjusted: number): number => {
    return ((adjusted - original) / original) * 100;
  };
  
  // Format date for display
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Format domain impact for display
  const formatDomainImpact = (impact: number): string => {
    if (impact === 0) return '±0%';
    return `${impact > 0 ? '+' : ''}${(impact * 100).toFixed(1)}%`;
  };
  
  // Add a new transaction (would handle form submission in production)
  const handleAddTransaction = () => {
    // This would open a modal in a real implementation
    alert('In a production environment, this would open a form to add a new transaction.');
  };
  
  // Calculate overall impact on system coherence
  const calculateOverallImpact = (transaction: Transaction): number => {
    return Object.values(transaction.domainImpacts).reduce((sum, val) => sum + val, 0);
  };
  
  return (
    <Card className="w-full bg-black/30 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl leading-tight">Transaction Log Visualizer</CardTitle>
            <CardDescription>
              Real-world transactions aligned with 3:1 quantum coherence ratio
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={systemCoherence >= 70 ? "default" : "outline"} className="text-sm">
              System Coherence: {systemCoherence.toFixed(0)}%
            </Badge>
            <Button size="sm" onClick={handleAddTransaction}>
              Add Transaction
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
          <TabsTrigger value="domain">Domain Impact</TabsTrigger>
          <TabsTrigger value="analytics">Coherence Analytics</TabsTrigger>
        </TabsList>
        
        {/* Recent Transactions Tab */}
        <TabsContent value="recent" className="space-y-4 px-2 py-4">
          {transactions.map(transaction => (
            <Card key={transaction.id} className="mb-4 overflow-hidden border border-slate-800/50">
              <CardHeader className="py-3 bg-slate-900/30">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">{transaction.description}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatDate(transaction.timestamp)}
                    </CardDescription>
                  </div>
                  <Badge className="text-xs">
                    ID: {transaction.id}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Transaction Details</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Original Amount:</span>
                        <span className="font-mono">${transaction.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Adjusted Amount:</span>
                        <span className="font-mono">${transaction.adjustedAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Adjustment:</span>
                        <span className="font-mono">
                          {calculateAdjustmentPercentage(transaction.amount, transaction.adjustedAmount).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Coherence Ratio:</span>
                        <span className="font-mono">
                          {(transaction.coherenceRatio[0] * 100).toFixed(2)}% / {(transaction.coherenceRatio[1] * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Coherence Impact</h4>
                    <div className="space-y-1">
                      {Object.entries(transaction.domainImpacts).map(([domain, impact]) => (
                        <div key={domain} className="grid grid-cols-5 text-xs items-center">
                          <span className="col-span-1 text-muted-foreground">{domain}:</span>
                          <div className="col-span-3">
                            <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${impact > 0 ? 'bg-green-600/70' : impact < 0 ? 'bg-red-600/70' : 'bg-slate-600/40'}`}
                                style={{ 
                                  width: `${Math.abs(impact * 100)}%`, 
                                  marginLeft: impact < 0 ? 'auto' : '0' 
                                }}
                              />
                            </div>
                          </div>
                          <span className={`col-span-1 text-right font-mono ${
                            impact > 0 ? 'text-green-400' : impact < 0 ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            {formatDomainImpact(impact)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-1 mt-1 border-t border-slate-800/30 grid grid-cols-5 text-xs items-center">
                        <span className="col-span-1 font-medium">Total:</span>
                        <div className="col-span-3">
                          <div className="h-2 w-full bg-slate-700/30 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${calculateOverallImpact(transaction) > 0 ? 'bg-blue-600/70' : 'bg-orange-600/70'}`}
                              style={{ width: `${Math.abs(calculateOverallImpact(transaction) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="col-span-1 text-right font-mono">
                          {formatDomainImpact(calculateOverallImpact(transaction))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="py-2 bg-slate-900/20 flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Applied coherence correction: {(transaction.amount - transaction.adjustedAmount).toFixed(2)}
                </span>
                <Button variant="link" className="h-auto p-0 text-xs">
                  View details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        {/* Domain Impact Tab */}
        <TabsContent value="domain" className="space-y-4 px-2 py-4">
          <div className="grid grid-cols-1 gap-4">
            {Object.keys(transactions[0]?.domainImpacts || {}).map(domain => {
              // Calculate cumulative impact across all transactions
              const cumulativeImpact = transactions.reduce((sum, tx) => 
                sum + (tx.domainImpacts[domain] || 0), 0
              );
              
              return (
                <Card key={domain} className={`border ${
                  cumulativeImpact > 0 ? 'border-green-800/30' : 
                  cumulativeImpact < 0 ? 'border-red-800/30' : 'border-slate-800/30'
                }`}>
                  <CardHeader className={`py-3 ${
                    cumulativeImpact > 0 ? 'bg-green-950/20' : 
                    cumulativeImpact < 0 ? 'bg-red-950/20' : 'bg-slate-900/20'
                  }`}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{domain} Domain</CardTitle>
                      <Badge variant={cumulativeImpact !== 0 ? "default" : "outline"} className="text-xs">
                        Net Impact: {formatDomainImpact(cumulativeImpact)}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {domain} domain impact analysis
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="py-3">
                    <h4 className="text-sm font-medium mb-2">Transaction Impacts</h4>
                    <div className="space-y-2">
                      {transactions.map(tx => (
                        <div key={`${domain}-${tx.id}`} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{tx.description}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  tx.domainImpacts[domain] > 0 ? 'bg-green-600/70' : 
                                  tx.domainImpacts[domain] < 0 ? 'bg-red-600/70' : 'bg-slate-600/40'
                                }`}
                                style={{ 
                                  width: `${Math.abs(tx.domainImpacts[domain] * 100)}%`, 
                                  marginLeft: tx.domainImpacts[domain] < 0 ? 'auto' : '0' 
                                }}
                              />
                            </div>
                            <span className={`font-mono ${
                              tx.domainImpacts[domain] > 0 ? 'text-green-400' : 
                              tx.domainImpacts[domain] < 0 ? 'text-red-400' : 'text-slate-400'
                            }`}>
                              {formatDomainImpact(tx.domainImpacts[domain])}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="py-2 bg-slate-900/10 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Current Domain Coherence: 75%
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Domain Details
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Coherence Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 px-2 py-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Coherence Ratio Analysis</CardTitle>
              <CardDescription className="text-xs">
                Analyzing transaction adjustments to maintain the 3:1 quantum coherence ratio
              </CardDescription>
            </CardHeader>
            
            <CardContent className="py-3">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Transaction Adjustment Summary</h4>
                  <div className="bg-slate-900/30 rounded-lg p-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <span className="text-muted-foreground">Total Transaction Value:</span>
                        <div className="font-mono text-base mt-1">
                          ${transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Adjusted Value:</span>
                        <div className="font-mono text-base mt-1">
                          ${transactions.reduce((sum, tx) => sum + tx.adjustedAmount, 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Total Adjustment:</span>
                        <div className="font-mono text-base mt-1">
                          ${(
                            transactions.reduce((sum, tx) => sum + tx.adjustedAmount, 0) - 
                            transactions.reduce((sum, tx) => sum + tx.amount, 0)
                          ).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Adjustment Percentage:</span>
                        <div className="font-mono text-base mt-1">
                          {(
                            (transactions.reduce((sum, tx) => sum + tx.adjustedAmount, 0) / 
                            transactions.reduce((sum, tx) => sum + tx.amount, 0) - 1) * 100
                          ).toFixed(4)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Coherence Ratio Maintenance</h4>
                  <div className="bg-slate-900/30 rounded-lg p-3">
                    <div className="grid grid-cols-5 gap-1 mb-2">
                      <div className="col-span-3 h-8 bg-blue-900/30 rounded flex items-center justify-center text-xs font-medium">
                        Coherence (75.00%)
                      </div>
                      <div className="col-span-2 h-8 bg-purple-900/30 rounded flex items-center justify-center text-xs font-medium">
                        Exploration (24.94%)
                      </div>
                    </div>
                    <div className="text-xs">
                      <div className="grid grid-cols-5 gap-1 mb-3">
                        <div className="col-span-3 flex justify-center text-blue-400">
                          ${(transactions.reduce((sum, tx) => sum + tx.adjustedAmount, 0) * 0.75).toFixed(2)}
                        </div>
                        <div className="col-span-2 flex justify-center text-purple-400">
                          ${(transactions.reduce((sum, tx) => sum + tx.adjustedAmount, 0) * 0.2494).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center text-muted-foreground">
                        Ratio: {(0.75 / 0.2494).toFixed(2)}:1
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Overall System Coherence Impact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-full h-2.5 bg-slate-800/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                          style={{ width: `${systemCoherence}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{systemCoherence.toFixed(0)}%</span>
                    </div>
                    <div className="bg-slate-900/20 rounded-lg p-2 text-xs">
                      <p className="text-muted-foreground">
                        System coherence level maintained at optimal range (70-80%) through automated 
                        transaction adjustments following the 3:1 quantum ratio principle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="py-2 bg-slate-900/10 flex justify-between">
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Export Analytics
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TransactionLogVisualizer;