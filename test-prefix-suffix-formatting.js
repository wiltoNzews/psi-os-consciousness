/**
 * Simple test for PREFIX/SUFFIX template formatting
 * 
 * This script tests a simplified version of the formatVerificationResults function 
 * that doesn't rely on external dependencies, to ensure the PREFIX/SUFFIX formatting
 * pattern works correctly.
 */
import * as fs from 'fs';
import * as path from 'path';

// Mock verification results
const mockResults = [
  {
    modulePath: '/test/path/chronos-date-handler.ts',
    overallPassed: true,
    checks: {
      chronosUsage: { passed: true, message: 'Uses chronos for date handling', score: 100 },
      boundaryDefinition: { passed: true, message: 'Clear boundary definitions', score: 95 },
      responsibility: { passed: true, message: 'Single responsibility principle applied', score: 90 },
      interfaceImplementation: { passed: true, message: 'Correctly implements interface', score: 100 }
    }
  },
  {
    modulePath: '/test/path/storage.ts',
    overallPassed: false,
    checks: {
      chronosUsage: { passed: false, message: 'Does not use chronos for date handling', score: 0 },
      boundaryDefinition: { passed: true, message: 'Clear boundary definitions', score: 85 },
      responsibility: { passed: true, message: 'Single responsibility principle applied', score: 80 },
      interfaceImplementation: { passed: true, message: 'Correctly implements interface', score: 95 }
    }
  },
  {
    modulePath: '/test/path/quantum-glossary.ts',
    overallPassed: true,
    checks: {
      chronosUsage: { passed: true, message: 'Uses chronos for date handling', score: 100 },
      boundaryDefinition: { passed: true, message: 'Clear boundary definitions', score: 100 },
      responsibility: { passed: true, message: 'Single responsibility principle applied', score: 95 },
      interfaceImplementation: { passed: true, message: 'Correctly implements interface', score: 100 }
    }
  }
];

// Simplified implementation of the formatPrompt function
function formatPrompt(prefix, task, suffix) {
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

// Simplified implementation of the createTTPMessage function
function createTTPMessage(from, to, contextDescription, content, decisionsMade, nextDecohere, metadata = {}) {
  let message = `FROM: ${from}\n`;
  message += `TO: ${to}\n\n`;
  message += `CONTEXT DESCRIPTION: ${contextDescription}\n\n`;
  
  message += 'DECISIONS MADE:\n';
  decisionsMade.forEach(decision => {
    message += `- Selected "${decision.decision}" over alternatives: ${decision.alternatives.join(', ')}\n`;
    message += `  Reasoning: ${decision.reasoning}\n`;
  });
  message += '\n';
  
  message += 'METRICS:\n';
  message += `- FLOW: verification_completion = ${metadata.passRate * 100}\n`;
  message += '\n';
  
  message += 'METADATA:\n';
  Object.entries(metadata).forEach(([key, value]) => {
    message += `- ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
  });
  message += '\n';
  
  message += `NEXT DECOHERE NEEDED: ${nextDecohere.description}\n`;
  message += 'Options:\n';
  nextDecohere.options.forEach(option => {
    message += `- "${option}"\n`;
  });
  message += '\n';
  
  message += content;
  
  return message;
}

// Simplified version of the formatVerificationResults function
function formatVerificationResults(results, targetAgent = 'Human') {
  // Get pass/fail counts
  const totalModules = results.length;
  const passedModules = results.filter(r => r.overallPassed).length;
  const failedModules = results.filter(r => !r.overallPassed).length;
  const passRate = totalModules > 0 ? Math.round((passedModules / totalModules) * 100) : 0;
  
  // Collect module data
  const moduleData = results.map(result => {
      const moduleBaseName = path.basename(result.modulePath);
      const checkSummary = Object.entries(result.checks || {})
          .map(([name, check]) => `${name}: ${check.passed ? '✓' : '✗'} ${check.passed ? '' : check.message || ''}`)
          .join('\n');
      
      return `Module: ${moduleBaseName}\nStatus: ${result.overallPassed ? 'PASSED' : 'FAILED'}\n${checkSummary}`;
  }).join('\n\n');
  
  // Generate actionable next steps
  const actionableNextSteps = results.filter(r => !r.overallPassed)
      .map(m => `Fix ${path.basename(m.modulePath)}: ${Object.entries(m.checks).find(([_, c]) => !c.passed)?.[0] || 'issues'}`);
  
  // Create PREFIX/SUFFIX structure
  const prefix = {
      levelDimension: 'Strategic',
      objective: 'Assess codebase verification results',
      context: 'Analysis of Modularity God Formula compliance',
      modelAgent: targetAgent,
      depthRequired: 'Comprehensive Verification Analysis',
      inputDataType: 'Code',
      domain: 'Software Architecture'
  };
  
  const resultsSummary = `# Codebase Verification Summary

## Overview
- Total modules verified: ${totalModules}
- Passed: ${passedModules} (${passRate}%)
- Failed: ${failedModules}
- Verification timestamp: ${new Date().toISOString()}

## Module Results
${moduleData}

## Analysis
${passRate >= 90 ? 'The codebase demonstrates excellent compliance with the Modularity God Formula.' :
  passRate >= 70 ? 'The codebase shows good compliance with the Modularity God Formula, with some areas needing improvement.' :
  passRate >= 50 ? 'The codebase has moderate compliance with the Modularity God Formula, with significant improvements needed.' :
  'The codebase needs substantial work to comply with the Modularity God Formula.'}

${failedModules > 0 ? 
  `The primary issues relate to ${results.filter(r => !r.overallPassed)
    .flatMap(r => Object.entries(r.checks).filter(([_, c]) => !c.passed).map(([name]) => name))
    .join(', ')
  }` : 
  'No compliance issues were found in the verified modules.'
}`;
  
  const suffix = {
      actionableNextSteps: actionableNextSteps.length > 0 ? actionableNextSteps : ['Document verification results'],
      nextAgentRouting: 'Human',
      outputRequirements: 'Verification analysis with recommendations',
      flowMetrics: 'FLOW',
      confidenceLevel: 'High',
      resourcesUsed: [
          'verify-module.js',
          'module-verifier.ts',
          'MODULARITY_GOD_FORMULA.md',
          'verification-patterns.js'
      ]
  };
  
  return formatPrompt(prefix, resultsSummary, suffix);
}

// Run the test
async function runTest() {
  console.log('Running PREFIX/SUFFIX formatting test...');
  
  // Format the mock results using PREFIX/SUFFIX template
  const formattedReport = formatVerificationResults(mockResults);
  
  // Save the output to a file for inspection
  try {
    fs.writeFileSync('test-prefix-suffix-output.txt', formattedReport);
    console.log('Test output saved to test-prefix-suffix-output.txt');
  } catch (error) {
    console.error('Error saving test output:', error);
  }
  
  // Create a TTP message for the same mock results
  const ttpMessage = {
    from: 'TestVerifier',
    to: 'Human',
    contextDescription: 'Verification Results Analysis',
    decisionsMade: [
      {
        decision: `Verified ${mockResults.length} modules with ${mockResults.filter(r => r.overallPassed).length} passing`,
        alternatives: ["Skip verification", "Verify only high-priority modules"],
        reasoning: "Comprehensive verification provides the most accurate assessment of codebase health"
      }
    ],
    metrics: [
      {
        type: 'FLOW',
        source: 'verification_completion',
        value: mockResults.filter(r => r.overallPassed).length / mockResults.length * 100,
        metadata: { totalModules: mockResults.length, passedModules: mockResults.filter(r => r.overallPassed).length }
      }
    ],
    metadata: {
      verificationTimestamp: new Date().toISOString(),
      moduleCount: mockResults.length,
      passRate: mockResults.filter(r => r.overallPassed).length / mockResults.length
    },
    nextDecohere: {
      description: "Determine action based on verification results",
      options: [
        "Fix failed modules",
        "Expand verification",
        "Document compliance status"
      ]
    },
    content: `# Verification Results Summary

Total modules verified: ${mockResults.length}
Passing: ${mockResults.filter(r => r.overallPassed).length} (${Math.round((mockResults.filter(r => r.overallPassed).length/mockResults.length)*100)}%)
Failing: ${mockResults.filter(r => !r.overallPassed).length}

## Module Status
${mockResults.map(r => `- ${path.basename(r.modulePath)}: ${r.overallPassed ? '✓ PASSED' : '✗ FAILED'}`).join('\n')}

## Recommended Actions
${mockResults.filter(r => !r.overallPassed).length > 0 ? 
  `1. Address issues in failing modules:
${mockResults.filter(r => !r.overallPassed)
    .map(r => `   - Fix ${path.basename(r.modulePath)}`)
    .join('\n')
}` :
  '1. Document successful verification compliance'
}`
  };
  
  // Format the TTP message
  const formattedTTPMessage = createTTPMessage(
    ttpMessage.from,
    ttpMessage.to,
    ttpMessage.contextDescription,
    ttpMessage.content,
    ttpMessage.decisionsMade,
    ttpMessage.nextDecohere,
    ttpMessage.metadata
  );
  
  // Save the TTP message to a file for inspection
  try {
    fs.writeFileSync('test-ttp-output.txt', formattedTTPMessage);
    console.log('TTP test output saved to test-ttp-output.txt');
  } catch (error) {
    console.error('Error saving TTP test output:', error);
  }
  
  console.log('Test completed successfully!');
}

runTest().catch(err => console.error('Test failed:', err));