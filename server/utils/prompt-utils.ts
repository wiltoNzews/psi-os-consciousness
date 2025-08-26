/**
 * Prompt Utils - Standardized PREFIX/SUFFIX Communication System
 * 
 * This module implements the PREFIX/SUFFIX communication system as defined in the
 * Quantum Collaboration Framework. It provides utilities for formatting and parsing
 * standardized prompts for human-AI and AI-AI communication.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * unformatted instructions and structured communication patterns.
 */

/**
 * Prefix structure for communication
 */
export interface Prefix {
  levelDimension: 'Strategic' | 'Tactical' | 'Operational' | 'Technical' | 'Meta-Cognitive';
  objective: string;
  context: string;
  modelAgent: string;
  depthRequired: string;
  inputDataType: 'Code' | 'Text' | 'URL' | 'Image' | 'File Path';
  domain: string;
}

/**
 * Suffix structure for communication
 */
export interface Suffix {
  actionableNextSteps: string[];
  nextAgentRouting: string;
  outputRequirements: string;
  flowMetrics: 'FLOW' | 'ANTIFLOW' | 'PARTIAL_FLOW';
  timestampCheckpoint?: string;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  resourcesUsed: string[];
}

/**
 * TTP Message structure for thought transfer between agents
 */
export interface TTPMessage {
  from: string;
  to: string;
  contextDescription: string;
  decisionsMade: Array<{
    decision: string;
    alternatives: string[];
    reasoning: string;
  }>;
  metrics: Array<{
    type: 'FLOW' | 'ANTIFLOW' | 'PARTIAL_FLOW';
    source: string;
    value: number;
    metadata: Record<string, any>;
  }>;
  metadata: Record<string, any>;
  nextDecohere: {
    description: string;
    options: string[];
    context?: Record<string, any>;
  };
  content: string;
}

/**
 * Format a prompt using the PREFIX/SUFFIX system
 * 
 * @param prefix The PREFIX structure
 * @param task The main task/message content
 * @param suffix The SUFFIX structure
 * @returns Formatted prompt string
 */
export function formatPrompt(prefix: Prefix, task: string, suffix: Suffix): string {
  const timestamp = new Date().toISOString();
  
  // Format PREFIX
  const prefixStr = [
    `[LEVEL/DIMENSION: ${prefix.levelDimension}]`,
    `[OBJECTIVE: ${prefix.objective}]`,
    `[CONTEXT: ${prefix.context}]`,
    `[MODEL/AGENT: ${prefix.modelAgent}]`,
    `[DEPTH REQUIRED: ${prefix.depthRequired}]`,
    `[INPUT DATA TYPE: ${prefix.inputDataType}]`,
    `[DOMAIN: ${prefix.domain}]`
  ].join('\n');

  // Format SUFFIX
  const suffixStr = [
    `[ACTIONABLE NEXT STEPS: ${suffix.actionableNextSteps.map((step, i) => `${i + 1}. ${step}`).join(', ')}]`,
    `[NEXT AGENT ROUTING: ${suffix.nextAgentRouting}]`,
    `[OUTPUT REQUIREMENTS: ${suffix.outputRequirements}]`,
    `[FLOW METRICS: ${suffix.flowMetrics}]`,
    `[TIMESTAMP/CHECKPOINT: ${suffix.timestampCheckpoint || timestamp}]`,
    `[CONFIDENCE LEVEL: ${suffix.confidenceLevel}]`,
    `[RESOURCES USED: ${suffix.resourcesUsed.join(', ')}]`
  ].join('\n');

  return `${prefixStr}\n\n${task}\n\n${suffixStr}`;
}

/**
 * Parse a formatted prompt into its components
 * 
 * @param prompt The formatted prompt string
 * @returns Object containing prefix, task, and suffix
 */
export function parsePrompt(prompt: string): { prefix: Prefix, task: string, suffix: Suffix } {
  const lines = prompt.split('\n');
  const prefix: Partial<Prefix> = {};
  const suffix: Partial<Suffix> = {};
  let task = '';
  let currentSection = 'prefix';

  for (const line of lines) {
    if (line.trim() === '') {
      if (currentSection === 'prefix') {
        currentSection = 'task';
        continue;
      } else if (currentSection === 'task') {
        currentSection = 'suffix';
        continue;
      }
    }

    if (currentSection === 'prefix') {
      if (line.startsWith('[LEVEL/DIMENSION:')) {
        prefix.levelDimension = line.match(/\[LEVEL\/DIMENSION: (.*?)\]/)?.[1] as Prefix['levelDimension'];
      } else if (line.startsWith('[OBJECTIVE:')) {
        prefix.objective = line.match(/\[OBJECTIVE: (.*?)\]/)?.[1] || '';
      } else if (line.startsWith('[CONTEXT:')) {
        prefix.context = line.match(/\[CONTEXT: (.*?)\]/)?.[1] || '';
      } else if (line.startsWith('[MODEL/AGENT:')) {
        prefix.modelAgent = line.match(/\[MODEL\/AGENT: (.*?)\]/)?.[1] as Prefix['modelAgent'];
      } else if (line.startsWith('[DEPTH REQUIRED:')) {
        prefix.depthRequired = line.match(/\[DEPTH REQUIRED: (.*?)\]/)?.[1] || '';
      } else if (line.startsWith('[INPUT DATA TYPE:')) {
        prefix.inputDataType = line.match(/\[INPUT DATA TYPE: (.*?)\]/)?.[1] as Prefix['inputDataType'];
      } else if (line.startsWith('[DOMAIN:')) {
        prefix.domain = line.match(/\[DOMAIN: (.*?)\]/)?.[1] || '';
      }
    } else if (currentSection === 'task') {
      task += line + '\n';
    } else if (currentSection === 'suffix') {
      if (line.startsWith('[ACTIONABLE NEXT STEPS:')) {
        const steps = line.match(/\[ACTIONABLE NEXT STEPS: (.*?)\]/)?.[1] || '';
        suffix.actionableNextSteps = steps.split(', ').map(step => {
          // Remove numbering prefix if present
          return step.replace(/^\d+\.\s*/, '');
        });
      } else if (line.startsWith('[NEXT AGENT ROUTING:')) {
        suffix.nextAgentRouting = line.match(/\[NEXT AGENT ROUTING: (.*?)\]/)?.[1] as Suffix['nextAgentRouting'];
      } else if (line.startsWith('[OUTPUT REQUIREMENTS:')) {
        suffix.outputRequirements = line.match(/\[OUTPUT REQUIREMENTS: (.*?)\]/)?.[1] || '';
      } else if (line.startsWith('[FLOW METRICS:')) {
        suffix.flowMetrics = line.match(/\[FLOW METRICS: (.*?)\]/)?.[1] as Suffix['flowMetrics'];
      } else if (line.startsWith('[TIMESTAMP/CHECKPOINT:')) {
        suffix.timestampCheckpoint = line.match(/\[TIMESTAMP\/CHECKPOINT: (.*?)\]/)?.[1] || '';
      } else if (line.startsWith('[CONFIDENCE LEVEL:')) {
        suffix.confidenceLevel = line.match(/\[CONFIDENCE LEVEL: (.*?)\]/)?.[1] as Suffix['confidenceLevel'];
      } else if (line.startsWith('[RESOURCES USED:')) {
        const resources = line.match(/\[RESOURCES USED: (.*?)\]/)?.[1] || '';
        suffix.resourcesUsed = resources.split(', ').filter(r => r.trim());
      }
    }
  }

  return {
    prefix: prefix as Prefix,
    task: task.trim(),
    suffix: suffix as Suffix
  };
}

/**
 * Format a Thought Transfer Protocol (TTP) message
 * 
 * @param ttpMessage The TTP message to format
 * @returns Formatted TTP message string
 */
export function formatTTPMessage(ttpMessage: TTPMessage): string {
  let message = `FROM: ${ttpMessage.from}\n`;
  message += `TO: ${ttpMessage.to}\n\n`;
  message += `CONTEXT DESCRIPTION: ${ttpMessage.contextDescription}\n\n`;
  
  message += 'DECISIONS MADE:\n';
  ttpMessage.decisionsMade.forEach(decision => {
    message += `- Selected "${decision.decision}" over alternatives: ${decision.alternatives.join(', ')}\n`;
    message += `  Reasoning: ${decision.reasoning}\n`;
  });
  message += '\n';
  
  message += 'METRICS:\n';
  ttpMessage.metrics.forEach(metric => {
    message += `- ${metric.type}: ${metric.source} = ${metric.value}\n`;
  });
  message += '\n';
  
  message += 'METADATA:\n';
  Object.entries(ttpMessage.metadata).forEach(([key, value]) => {
    message += `- ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
  });
  message += '\n';
  
  message += `NEXT DECOHERE NEEDED: ${ttpMessage.nextDecohere.description}\n`;
  message += 'Options:\n';
  ttpMessage.nextDecohere.options.forEach(option => {
    message += `- "${option}"\n`;
  });
  message += '\n';
  
  message += ttpMessage.content;
  
  return message;
}

/**
 * Parse a formatted TTP message string into its components
 * 
 * @param message The formatted TTP message string
 * @returns Parsed TTP message object
 */
export function parseTTPMessage(message: string): TTPMessage {
  const result: Partial<TTPMessage> = {
    decisionsMade: [],
    metrics: [],
    metadata: {}
  };
  
  const lines = message.split('\n');
  let currentSection = '';
  let content = '';
  let contentStarted = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (contentStarted) {
      content += line + '\n';
      continue;
    }
    
    if (line.startsWith('FROM:')) {
      result.from = line.replace('FROM:', '').trim();
    } else if (line.startsWith('TO:')) {
      result.to = line.replace('TO:', '').trim();
    } else if (line.startsWith('CONTEXT DESCRIPTION:')) {
      result.contextDescription = line.replace('CONTEXT DESCRIPTION:', '').trim();
    } else if (line.startsWith('DECISIONS MADE:')) {
      currentSection = 'decisions';
    } else if (line.startsWith('METRICS:')) {
      currentSection = 'metrics';
    } else if (line.startsWith('METADATA:')) {
      currentSection = 'metadata';
    } else if (line.startsWith('NEXT DECOHERE NEEDED:')) {
      result.nextDecohere = {
        description: line.replace('NEXT DECOHERE NEEDED:', '').trim(),
        options: []
      };
      currentSection = 'decohere';
    } else if (line.trim() === '' && currentSection === 'decohere' && i < lines.length - 1) {
      contentStarted = true;
    } else if (currentSection === 'decisions' && line.trim().startsWith('-')) {
      const decision = line.replace('-', '').trim();
      const decisionMatch = decision.match(/Selected "([^"]+)" over alternatives: (.*)/);
      
      if (decisionMatch) {
        const alternatives = decisionMatch[2].split(',').map(a => a.trim());
        // Look ahead for reasoning on the next line
        const reasoningLine = lines[i + 1] || '';
        const reasoning = reasoningLine.trim().startsWith('Reasoning:') 
          ? reasoningLine.replace('Reasoning:', '').trim()
          : '';
          
        result.decisionsMade?.push({
          decision: decisionMatch[1],
          alternatives,
          reasoning
        });
        
        if (reasoning) i++; // Skip reasoning line
      }
    } else if (currentSection === 'metrics' && line.trim().startsWith('-')) {
      const metricMatch = line.match(/- (FLOW|ANTIFLOW|PARTIAL_FLOW): (\w+) = (\d+)/);
      if (metricMatch) {
        result.metrics?.push({
          type: metricMatch[1] as 'FLOW' | 'ANTIFLOW' | 'PARTIAL_FLOW',
          source: metricMatch[2],
          value: parseInt(metricMatch[3]),
          metadata: {}
        });
      }
    } else if (currentSection === 'metadata' && line.trim().startsWith('-')) {
      const metadataMatch = line.match(/- ([^:]+): (.*)/);
      if (metadataMatch && result.metadata) {
        result.metadata[metadataMatch[1]] = metadataMatch[2];
      }
    } else if (currentSection === 'decohere' && line.trim().startsWith('-')) {
      const optionMatch = line.match(/- "([^"]+)"/);
      if (optionMatch && result.nextDecohere) {
        result.nextDecohere.options.push(optionMatch[1]);
      }
    }
  }
  
  result.content = content.trim();
  
  return result as TTPMessage;
}

/**
 * Create a standardized prompt for a specific use case (helper function)
 * 
 * @param useCase The specific use case ('implementation', 'review', 'analysis', etc.)
 * @param params Custom parameters for the prompt
 * @returns Formatted prompt string
 */
export function createPromptForUseCase(
  useCase: 'implementation' | 'review' | 'analysis' | 'testing' | 'documentation',
  params: {
    objective: string;
    context: string;
    agent: Prefix['modelAgent'];
    task: string;
    nextSteps: string[];
    nextAgent: Suffix['nextAgentRouting'];
    resources: string[];
    domain: string;
  }
): string {
  // Define default values based on use case
  const defaults: Record<string, any> = {
    implementation: {
      levelDimension: 'Tactical',
      depthRequired: 'Detailed Technical Implementation',
      inputDataType: 'Code',
      outputRequirements: 'TypeScript code with comments',
      flowMetrics: 'FLOW',
      confidenceLevel: 'High'
    },
    review: {
      levelDimension: 'Strategic',
      depthRequired: 'High-Level Overview with Analysis',
      inputDataType: 'Code',
      outputRequirements: 'Markdown summary with recommendations',
      flowMetrics: 'FLOW',
      confidenceLevel: 'High'
    },
    analysis: {
      levelDimension: 'Meta-Cognitive',
      depthRequired: 'Deep Analysis with Connections',
      inputDataType: 'Text',
      outputRequirements: 'Structured analysis with insights',
      flowMetrics: 'FLOW',
      confidenceLevel: 'Medium'
    },
    testing: {
      levelDimension: 'Technical',
      depthRequired: 'Comprehensive Test Cases',
      inputDataType: 'Code',
      outputRequirements: 'Test cases with expected outcomes',
      flowMetrics: 'FLOW',
      confidenceLevel: 'High'
    },
    documentation: {
      levelDimension: 'Strategic',
      depthRequired: 'Clear Documentation with Examples',
      inputDataType: 'Text',
      outputRequirements: 'Markdown documentation',
      flowMetrics: 'FLOW',
      confidenceLevel: 'High'
    }
  };
  
  const prefix: Prefix = {
    levelDimension: defaults[useCase].levelDimension,
    objective: params.objective,
    context: params.context,
    modelAgent: params.agent,
    depthRequired: defaults[useCase].depthRequired,
    inputDataType: defaults[useCase].inputDataType,
    domain: params.domain
  };
  
  const suffix: Suffix = {
    actionableNextSteps: params.nextSteps,
    nextAgentRouting: params.nextAgent,
    outputRequirements: defaults[useCase].outputRequirements,
    flowMetrics: defaults[useCase].flowMetrics,
    confidenceLevel: defaults[useCase].confidenceLevel,
    resourcesUsed: params.resources
  };
  
  return formatPrompt(prefix, params.task, suffix);
}

/**
 * Create a standardized TTP message for agent handoff (helper function)
 * 
 * @param fromAgent Source agent
 * @param toAgent Target agent
 * @param contextDescription Context description
 * @param content Main content
 * @param decisionsMade Decisions made
 * @param nextDecohere Next decision point
 * @param metadata Additional metadata
 * @returns Formatted TTP message
 */
export function createTTPMessage(
  fromAgent: string,
  toAgent: string,
  contextDescription: string,
  content: string,
  decisionsMade: Array<{
    decision: string;
    alternatives: string[];
    reasoning: string;
  }>,
  nextDecohere: {
    description: string;
    options: string[];
  },
  metadata: Record<string, any> = {}
): string {
  const ttpMessage: TTPMessage = {
    from: fromAgent,
    to: toAgent,
    contextDescription,
    decisionsMade,
    metrics: [
      {
        type: 'FLOW',
        source: 'agent_handoff',
        value: 100,
        metadata: { from: fromAgent, to: toAgent }
      }
    ],
    metadata,
    nextDecohere,
    content
  };
  
  return formatTTPMessage(ttpMessage);
}