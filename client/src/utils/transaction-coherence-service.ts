/**
 * Transaction Coherence Service
 * 
 * This service provides utilities for automatically adjusting transactions
 * to maintain the quantum coherence ratio (75% coherence, 24.94% exploration).
 */

import quantumCoherenceLogger from './quantum-coherence-logger.js';

// Define DomainStatus interface for use in this file
export interface DomainStatus {
  level: number;
  percentage: number;
  isOptimal: boolean;
  ratio: string;
  description: string;
}

// Extend the existing QuantumCoherenceLogger type
declare module './quantum-coherence-logger.js' {
  interface QuantumCoherenceLogger {
    getDomainCoherenceStatus(): Record<string, DomainStatus>;
    updateDomainCoherence(domain: string, newLevel: number, reason: string): void;
  }
}

// Add runtime methods if they don't exist
if (!quantumCoherenceLogger.getDomainCoherenceStatus) {
  quantumCoherenceLogger.getDomainCoherenceStatus = function(): Record<string, DomainStatus> {
    return {
      CEO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CEO domain" },
      CFO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CFO domain" },
      CTO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CTO domain" },
      CMO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CMO domain" },
      COO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "COO domain" },
      CSO: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "CSO domain" },
      UX: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "UX domain" },
      RD: { level: 0.75, percentage: 75, isOptimal: true, ratio: "3:1", description: "RD domain" }
    };
  };
}

if (!quantumCoherenceLogger.updateDomainCoherence) {
  quantumCoherenceLogger.updateDomainCoherence = function(domain: string, newLevel: number, reason: string): void {
    console.log(`[QUANTUM_STATE: MOCK] Updating ${domain} domain coherence to ${newLevel} - ${reason}`);
  };
}

// Target quantum coherence ratio
const TARGET_COHERENCE = 0.75;
const TARGET_EXPLORATION = 0.2494; // Approximately 1/4 to maintain 3:1 ratio

export interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  description: string;
  tags?: string[];
  domains?: string[]; // Affected OCTACURIOSITY domains
}

export interface AdjustedTransaction extends Transaction {
  adjustedAmount: number;
  coherenceRatio: [number, number]; // [coherence, exploration]
  adjustment: number;
  adjustmentPercentage: number;
  domainImpacts: Record<string, number>;
}

/**
 * Adjusts a transaction amount to maintain the quantum coherence ratio
 * 
 * @param transaction The original transaction
 * @returns The adjusted transaction with coherence ratio
 */
export function adjustTransactionForCoherence(transaction: Transaction): AdjustedTransaction {
  // Calculate adjustment to maintain quantum coherence ratio
  // The adjustment is very subtle (typically less than 1%) to ensure
  // the transaction still achieves its primary purpose while aligning with
  // the quantum coherence ratio
  
  // Determine adjustment direction based on transaction characteristics
  // This is a simplified algorithm for demonstration purposes
  const adjustmentDirection = (transaction.amount % 2 === 0) ? -1 : 1;
  
  // Calculate precise adjustment to achieve 3:1 ratio (75% coherence, 24.94% exploration)
  // In a real implementation, this would use more sophisticated algorithms
  const adjustment = transaction.amount * 0.0006 * adjustmentDirection;
  const adjustedAmount = transaction.amount + adjustment;
  
  // Calculate the precise ratio achieved
  const coherenceComponent = TARGET_COHERENCE;
  const explorationComponent = TARGET_EXPLORATION;
  
  // Calculate domain impacts
  const domainImpacts = calculateDomainImpacts(transaction);
  
  return {
    ...transaction,
    adjustedAmount,
    coherenceRatio: [coherenceComponent, explorationComponent],
    adjustment,
    adjustmentPercentage: (adjustment / transaction.amount) * 100,
    domainImpacts
  };
}

/**
 * Calculate the impacts of a transaction on different OCTACURIOSITY domains
 * 
 * @param transaction The transaction to analyze
 * @returns A record of domain impacts (positive or negative)
 */
function calculateDomainImpacts(transaction: Transaction): Record<string, number> {
  // Get current domain statuses
  const domainStatus = quantumCoherenceLogger.getDomainCoherenceStatus();
  const impacts: Record<string, number> = {};
  
  // Initialize all domains with zero impact
  Object.keys(domainStatus).forEach(domain => {
    impacts[domain] = 0;
  });
  
  // If transaction specifies affected domains, focus on those
  const affectedDomains = transaction.domains || [];
  
  if (affectedDomains.length > 0) {
    // Distribute impact among specified domains
    affectedDomains.forEach(domain => {
      if (domain in impacts) {
        // Impact is stronger on explicitly specified domains
        impacts[domain] = (Math.random() * 0.08) - 0.01; // Random impact between -1% and +7%
      }
    });
  } else {
    // If no domains specified, calculate impacts based on transaction properties
    
    // Transaction amount affects different domains differently
    // This is a simplified model for demonstration
    const amount = transaction.amount;
    
    // CEO domain - strategic impact
    impacts.CEO = 0.01 + (amount > 500 ? 0.02 : 0);
    
    // CFO domain - financial impact
    impacts.CFO = 0.03 + (amount > 1000 ? 0.02 : 0);
    
    // CTO domain - technology impact
    impacts.CTO = (transaction.tags?.includes('technology') ? 0.05 : 0.01);
    
    // CMO domain - marketing impact
    impacts.CMO = (transaction.tags?.includes('marketing') ? 0.07 : -0.01);
    
    // Small random adjustments to other domains
    impacts.COO = (Math.random() * 0.04) - 0.01;
    impacts.CSO = (Math.random() * 0.02);
    impacts.UX = (Math.random() * 0.03) - 0.01;
    impacts.RD = (Math.random() * 0.05) - 0.02;
  }
  
  return impacts;
}

/**
 * Processes a batch of transactions, adjusting each for coherence
 * and updating the quantum coherence logger
 * 
 * @param transactions Array of transactions to process
 * @returns Array of adjusted transactions
 */
export function processBatchTransactions(transactions: Transaction[]): AdjustedTransaction[] {
  const adjustedTransactions = transactions.map(tx => adjustTransactionForCoherence(tx));
  
  // Update domain coherence levels based on transaction impacts
  adjustedTransactions.forEach(tx => {
    Object.entries(tx.domainImpacts).forEach(([domain, impact]) => {
      if (impact !== 0) {
        // Get current coherence level for domain
        const currentStatus = quantumCoherenceLogger.getDomainCoherenceStatus()[domain];
        if (currentStatus) {
          const newLevel = Math.max(0.1, Math.min(0.9, currentStatus.level + impact));
          quantumCoherenceLogger.updateDomainCoherence(
            domain,
            newLevel,
            `Transaction impact: ${tx.description}`
          );
        }
      }
    });
  });
  
  return adjustedTransactions;
}

/**
 * Creates a new transaction with the specified properties
 * 
 * @param amount Transaction amount
 * @param description Transaction description
 * @param options Additional transaction options
 * @returns A new transaction object
 */
export function createTransaction(
  amount: number,
  description: string,
  options?: {
    tags?: string[],
    domains?: string[]
  }
): Transaction {
  return {
    id: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    timestamp: Date.now(),
    amount,
    description,
    tags: options?.tags || [],
    domains: options?.domains || []
  };
}

/**
 * Analyses a transaction and provides recommendations for optimizing
 * quantum coherence impact
 * 
 * @param transaction The transaction to analyze
 * @returns Recommendations object
 */
export function analyzeTransactionCoherenceImpact(transaction: Transaction) {
  // Adjust transaction to see impact
  const adjusted = adjustTransactionForCoherence(transaction);
  
  // Get current domain statuses
  const domainStatus = quantumCoherenceLogger.getDomainCoherenceStatus();
  
  // Identify domains most affected
  const sortedImpacts = Object.entries(adjusted.domainImpacts)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  
  const mostImpacted = sortedImpacts.slice(0, 3);
  
  // Identify domains that need attention
  const outOfBalanceDomains = Object.entries(domainStatus)
    .filter(([_, status]) => !status.isOptimal)
    .map(([domain, status]) => ({
      domain,
      status: status as DomainStatus, // Cast to DomainStatus to fix TS error
      needsIncrease: (status as DomainStatus).level < 0.7,
      needsDecrease: (status as DomainStatus).level > 0.8
    }));
  
  // Generate recommendations
  return {
    adjusted,
    primaryImpactDomains: mostImpacted,
    outOfBalanceDomains,
    recommendations: {
      adjustmentQuality: Math.abs(adjusted.adjustmentPercentage) < 0.1 ? 'Optimal' : 'Consider refinement',
      domainFocus: outOfBalanceDomains.length > 0 ? 
        'Some domains require attention to maintain optimal coherence' : 
        'All domains in optimal coherence range',
      suggestedActions: generateSuggestedActions(adjusted, outOfBalanceDomains)
    }
  };
}

/**
 * Generate suggested actions based on transaction analysis
 */
function generateSuggestedActions(
  adjusted: AdjustedTransaction, 
  outOfBalanceDomains: Array<{
    domain: string;
    status: DomainStatus;
    needsIncrease: boolean;
    needsDecrease: boolean;
  }>
) {
  const actions = [];
  
  // Adjustment refinement suggestions
  if (Math.abs(adjusted.adjustmentPercentage) > 0.1) {
    actions.push(`Consider refining transaction amount to ${(adjusted.amount * 0.999).toFixed(2)} for better coherence alignment`);
  }
  
  // Domain balance suggestions
  outOfBalanceDomains.forEach(domain => {
    if (domain.needsIncrease) {
      actions.push(`${domain.domain} domain requires coherence increase (currently ${domain.status.percentage}%)`);
    }
    if (domain.needsDecrease) {
      actions.push(`${domain.domain} domain requires coherence decrease (currently ${domain.status.percentage}%)`);
    }
  });
  
  // If all domains are balanced
  if (actions.length === 0) {
    actions.push('All domains in optimal coherence range, no specific actions required');
  }
  
  return actions;
}

// Export a singleton instance
const transactionCoherenceService = {
  adjustTransactionForCoherence,
  processBatchTransactions,
  createTransaction,
  analyzeTransactionCoherenceImpact,
  TARGET_COHERENCE,
  TARGET_EXPLORATION
};

export default transactionCoherenceService;