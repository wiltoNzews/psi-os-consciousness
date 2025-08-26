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
import transactionCoherenceService, { 
  Transaction, 
  AdjustedTransaction 
} from '../../utils/transaction-coherence-service.js';

/**
 * DomainImpactAnalyzer - A detailed breakdown of how transactions affect domain coherence
 * 
 * This component visualizes the specific impact of transactions on each OCTACURIOSITY
 * domain and provides recommendations for maintaining optimal coherence.
 */
interface DomainAnalysisProps {
  transaction?: Transaction;
  transactions?: Transaction[];
  onActionRequired?: (action: string) => void;
}

const DomainImpactAnalyzer: React.FC<DomainAnalysisProps> = ({ 
  transaction,
  transactions = [],
  onActionRequired 
}) => {
  const [analyzedTransaction, setAnalyzedTransaction] = useState<any>(null);
  const [allTransactions, setAllTransactions] = useState<AdjustedTransaction[]>([]);
  const [domainStatus, setDomainStatus] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('single');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  
  // Process transactions when component loads or transactions change
  useEffect(() => {
    // Initialize with mock domain status
    const mockStatus = {
      CEO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CEO domain" },
      CFO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CFO domain" },
      CTO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CTO domain" },
      CMO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CMO domain" },
      COO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "COO domain" },
      CSO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CSO domain" },
      UX: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "UX domain" },
      RD: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "RD domain" }
    };
    setDomainStatus(mockStatus);
    
    // Process all transactions
    const processedTransactions = transactionCoherenceService.processBatchTransactions(
      transaction ? [transaction, ...transactions] : transactions
    );
    setAllTransactions(processedTransactions);
    
    // If a single transaction is provided, analyze it
    if (transaction) {
      const analysis = transactionCoherenceService.analyzeTransactionCoherenceImpact(transaction);
      setAnalyzedTransaction(analysis);
      setActiveTab('single');
      
      // Check if any actions are required
      if (analysis.recommendations.suggestedActions.length > 0 && onActionRequired) {
        onActionRequired(analysis.recommendations.suggestedActions[0]);
      }
    } else {
      setActiveTab('cumulative');
    }
    
    return () => {};
  }, [transaction, transactions]);
  
  // Calculate cumulative impact of all transactions on each domain
  const calculateCumulativeImpact = () => {
    const impacts: Record<string, number> = {};
    
    // Initialize all domains with zero impact
    Object.keys(domainStatus).forEach(domain => {
      impacts[domain] = 0;
    });
    
    // Sum impacts across all transactions
    allTransactions.forEach(tx => {
      Object.entries(tx.domainImpacts || {}).forEach(([domain, impact]) => {
        impacts[domain] = (impacts[domain] || 0) + impact;
      });
    });
    
    return impacts;
  };
  
  // Format impact value for display
  const formatImpact = (impact: number): string => {
    if (impact === 0) return '±0%';
    return `${impact > 0 ? '+' : ''}${(impact * 100).toFixed(1)}%`;
  };
  
  // Determine color based on impact
  const getImpactColor = (impact: number): string => {
    if (impact > 0.05) return 'text-green-400';
    if (impact > 0) return 'text-green-300';
    if (impact < -0.05) return 'text-red-400';
    if (impact < 0) return 'text-red-300';
    return 'text-slate-400';
  };
  
  // Determine background color based on impact
  const getImpactBackgroundColor = (impact: number): string => {
    if (impact > 0.05) return 'bg-green-600/70';
    if (impact > 0) return 'bg-green-500/50';
    if (impact < -0.05) return 'bg-red-600/70';
    if (impact < 0) return 'bg-red-500/50';
    return 'bg-slate-600/40';
  };
  
  const getDomainStatusBadge = (domain: string) => {
    const status = domainStatus[domain];
    if (!status) return null;
    
    return (
      <Badge variant={status.isOptimal ? "default" : "outline"} className="text-xs">
        {status.isOptimal ? 'Optimal' : status.level < 0.7 ? 'Low' : 'High'}
      </Badge>
    );
  };
  
  const cumulativeImpacts = calculateCumulativeImpact();
  
  return (
    <Card className="w-full bg-black/30 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl leading-tight">Domain Impact Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of transaction impacts across OCTACURIOSITY domains
            </CardDescription>
          </div>
          
          {analyzedTransaction && (
            <Badge variant="outline" className="text-sm">
              Analysis Quality: {analyzedTransaction.recommendations.adjustmentQuality}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" disabled={!analyzedTransaction}>
            Single Transaction Analysis
          </TabsTrigger>
          <TabsTrigger value="cumulative">
            Cumulative Domain Impact
          </TabsTrigger>
        </TabsList>
        
        {/* Single Transaction Analysis Tab */}
        <TabsContent value="single" className="space-y-4 px-2 py-4">
          {analyzedTransaction ? (
            <>
              <div className="bg-slate-900/30 rounded-lg p-3 mb-4">
                <h3 className="text-sm font-medium mb-2">Transaction Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Original Amount:</span>
                    <div className="font-mono text-base mt-1">
                      ${analyzedTransaction.adjusted.amount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Adjusted Amount:</span>
                    <div className="font-mono text-base mt-1">
                      ${analyzedTransaction.adjusted.adjustedAmount.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Adjustment:</span>
                    <div className="font-mono text-base mt-1">
                      ${analyzedTransaction.adjusted.adjustment.toFixed(2)} 
                      ({analyzedTransaction.adjusted.adjustmentPercentage.toFixed(4)}%)
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coherence Ratio:</span>
                    <div className="font-mono text-base mt-1">
                      {(analyzedTransaction.adjusted.coherenceRatio[0] * 100).toFixed(2)}% / 
                      {(analyzedTransaction.adjusted.coherenceRatio[1] * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Domain Impact Analysis</h3>
                <div className="space-y-3">
                  {analyzedTransaction.primaryImpactDomains.map(([domain, impact]: [string, number]) => (
                    <div 
                      key={domain}
                      className={`p-3 rounded-lg border ${
                        impact > 0 ? 'border-green-800/30 bg-green-900/10' : 
                        impact < 0 ? 'border-red-800/30 bg-red-900/10' : 
                        'border-slate-800/30 bg-slate-900/10'
                      }`}
                      onClick={() => setSelectedDomain(domain)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="text-sm font-medium">{domain} Domain</h4>
                          <p className="text-xs text-muted-foreground">
                            {domain} domain impact analysis
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getDomainStatusBadge(domain)}
                          <Badge variant={impact !== 0 ? "default" : "outline"} className={`text-xs ${
                            impact > 0 ? 'bg-green-600/70' : impact < 0 ? 'bg-red-600/70' : ''
                          }`}>
                            {formatImpact(impact)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800/30 h-2 rounded-full overflow-hidden">
                          <div
                            className={getImpactBackgroundColor(impact)}
                            style={{ 
                              width: `${Math.abs(impact * 100) * 2}%`, 
                              marginLeft: impact < 0 ? 'auto' : '0' 
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">New Level:</span>
                          <span className="font-mono">
                            {domainStatus[domain]?.percentage || 75}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                <div className="bg-slate-900/20 rounded-lg p-3">
                  <div className="space-y-2">
                    {analyzedTransaction.recommendations.suggestedActions.map((action: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 bg-blue-600/30 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-[10px]">{idx + 1}</span>
                        </div>
                        <p className="flex-1">{action}</p>
                      </div>
                    ))}
                  </div>
                  
                  {analyzedTransaction.outOfBalanceDomains.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/30">
                      <h4 className="text-xs font-medium mb-1">Domains Requiring Attention</h4>
                      <div className="space-y-1">
                        {analyzedTransaction.outOfBalanceDomains.map((domain: any) => (
                          <div key={domain.domain} className="flex justify-between text-xs">
                            <span>{domain.domain}</span>
                            <span className={domain.needsIncrease ? 'text-yellow-400' : 'text-red-400'}>
                              {domain.needsIncrease ? 'Increase Needed' : 'Decrease Needed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">No transaction selected for analysis</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setActiveTab('cumulative')}
              >
                View Cumulative Impact
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Cumulative Domain Impact Tab */}
        <TabsContent value="cumulative" className="space-y-4 px-2 py-4">
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(domainStatus).map(([domain, status]: [string, any]) => {
              const impact = cumulativeImpacts[domain] || 0;
              
              return (
                <div
                  key={domain}
                  className={`p-3 rounded-lg border ${
                    status.isOptimal ? 'border-blue-800/30 bg-blue-900/10' : 
                    status.level < 0.7 ? 'border-yellow-800/30 bg-yellow-900/10' : 
                    'border-orange-800/30 bg-orange-900/10'
                  }`}
                  onClick={() => setSelectedDomain(domain)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-sm font-medium">{domain} Domain</h4>
                      <p className="text-xs text-muted-foreground">
                        {status.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={status.isOptimal ? "default" : "outline"} className="text-xs">
                        {status.ratio} Ratio
                      </Badge>
                      <Badge variant={impact !== 0 ? "default" : "outline"} className={`text-xs ${
                        impact > 0 ? 'bg-green-600/70' : impact < 0 ? 'bg-red-600/70' : ''
                      }`}>
                        Net: {formatImpact(impact)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">Coherence:</span>
                      <Progress 
                        value={status.percentage} 
                        max={100}
                        className={`h-2 ${status.isOptimal ? 'bg-blue-950/30' : 'bg-slate-800/30'}`}
                      />
                      <span className="text-xs font-mono w-9">{status.percentage}%</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">Net Impact:</span>
                      <div className="flex-1 bg-slate-800/30 h-2 rounded-full overflow-hidden">
                        <div
                          className={getImpactBackgroundColor(impact)}
                          style={{ 
                            width: `${Math.min(Math.abs(impact * 100) * 2, 100)}%`, 
                            marginLeft: impact < 0 ? 'auto' : '0' 
                          }}
                        />
                      </div>
                      <span className={`text-xs font-mono w-9 ${getImpactColor(impact)}`}>
                        {formatImpact(impact)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Transaction breakdown (visible when domain is selected) */}
                  {selectedDomain === domain && allTransactions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/20">
                      <h5 className="text-xs font-medium mb-2">Transaction Breakdown</h5>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {allTransactions.map(tx => (
                          <div key={tx.id} className="flex justify-between items-center text-xs">
                            <span className="truncate max-w-[200px]">{tx.description}</span>
                            <span className={getImpactColor(tx.domainImpacts?.[domain] || 0)}>
                              {formatImpact(tx.domainImpacts?.[domain] || 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">System Coherence Summary</h3>
            <div className="bg-slate-900/20 rounded-lg p-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-muted-foreground">Overall Coherence Level:</span>
                <span className="text-sm font-medium">
                  75%
                </span>
              </div>
              
              <Progress 
                value={75} 
                max={100}
                className="h-2.5 mb-3"
              />
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Domains in Optimal Range:</span>
                  <div className="font-medium mt-1">
                    {Object.values(domainStatus).filter(status => status.isOptimal).length} / {Object.keys(domainStatus).length}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Overall Impact Trend:</span>
                  <div className="font-medium mt-1">
                    {Object.values(cumulativeImpacts).reduce((sum, val) => sum + val, 0) > 0 ? 
                      'Positive Increase' : 'Coherence Adjustment Needed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <div className="text-xs text-muted-foreground">
          Updated: {new Date().toLocaleTimeString()}
        </div>
        {selectedDomain && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => setSelectedDomain(null)}
          >
            Clear Selection
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DomainImpactAnalyzer;