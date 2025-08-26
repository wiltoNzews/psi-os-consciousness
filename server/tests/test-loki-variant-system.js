/**
 * Loki Variant System Test
 * 
 * This script tests the Loki Variant System by creating a Quantum Agent Manager and
 * executing various agent interactions to verify functionality.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { createQuantumAgentManager } from '../services/qrn/quantum-agent-manager.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Run a test of the Loki Variant System
 */
async function testLokiVariantSystem() {
  console.log('🧪 Starting Loki Variant System Test');
  
  try {
    // Create a quantum agent manager with eager initialization
    const agentManager = createQuantumAgentManager({
      agentInitialization: 'eager',
      maxHistoryEntries: 50
    });
    
    console.log('✅ Created Quantum Agent Manager');
    
    // Get all initialized agents
    const agents = agentManager.getAgents();
    console.log(`✅ Loaded ${Object.keys(agents).length} agents:`);
    Object.values(agents).forEach(agent => {
      console.log(`   ${agent.symbol} ${agent.name} (${agent.id}): ${agent.status}`);
    });
    
    // Create a test quantum chunk
    const testChunk = {
      id: `chunk-${uuidv4().slice(0, 8)}`,
      content: 'This is a test chunk for the Loki Variant System. It will be processed by multiple specialized agents to demonstrate the system\'s capabilities.',
      domain: '📝',
      timeline: 'α',
      metadata: {
        importance: 'high',
        requiresCreativity: true,
        requiresValidation: true,
        timeSensitive: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log(`\n🧪 Created test chunk: ${testChunk.id}`);
    
    // Test 1: Process chunk with Dream-State Wilton AI
    console.log('\n🧪 Test 1: Processing chunk with Dream-State Wilton AI');
    const dreamStateResult = agentManager.sendMessage('dream-state-wilton-ai', {
      type: 'process_chunk',
      data: {
        chunk: testChunk,
        options: {
          alternativeCount: 3,
          divergenceFactor: 0.8,
          depth: 'moderate'
        }
      }
    });
    
    console.log(`✅ Dream-State Wilton AI generated ${dreamStateResult.chunk.children.length} alternative approaches`);
    dreamStateResult.chunk.children.forEach((child, index) => {
      console.log(`   Alternative ${index + 1}: ${child.metadata.approachName} (strength: ${child.metadata.strengthScore.toFixed(2)})`);
    });
    
    // Keep track of the processed chunk for the next test
    const processedChunk = dreamStateResult.chunk;
    
    // Test 2: Analyze quality with Loki Reflective Mirror AI
    console.log('\n🧪 Test 2: Analyzing quality with Loki Reflective Mirror AI');
    const qualityResult = agentManager.sendMessage('loki-reflective-mirror-ai', {
      type: 'analyze_quality',
      data: {
        output: processedChunk,
        context: {
          sourceAgent: 'dream-state-wilton-ai',
          contentType: 'alternatives',
          expectedDetailLevel: 'high'
        }
      }
    });
    
    console.log(`✅ Loki Reflective Mirror AI quality score: ${qualityResult.qualityScore}`);
    console.log(`   Found ${qualityResult.issues.length} issues and ${qualityResult.strengths.length} strengths`);
    
    if (qualityResult.issues.length > 0) {
      console.log('   Issues:');
      qualityResult.issues.forEach(issue => {
        console.log(`     - ${issue.type} (${issue.severity}): ${issue.description}`);
      });
    }
    
    // Test 3: Schedule processing with Chronos/Kairos Temporal Agent
    console.log('\n🧪 Test 3: Scheduling processing with Chronos/Kairos Temporal Agent');
    
    // Create a simple processing pipeline
    const pipeline = [
      { 
        stepId: 0, 
        agentId: 'dream-state-wilton-ai', 
        agentName: 'Dream-State Wilton AI', 
        operation: 'process_chunk'
      },
      { 
        stepId: 1, 
        agentId: 'loki-reflective-mirror-ai', 
        agentName: 'Loki Reflective Mirror AI', 
        operation: 'analyze_quality'
      },
      { 
        stepId: 2, 
        agentId: 'symbolic-interpreter', 
        agentName: 'Symbolic Interpreter', 
        operation: 'interpret_symbols'
      }
    ];
    
    const scheduleResult = agentManager.sendMessage('chronos-kairos-agent', {
      type: 'schedule_processing',
      data: {
        chunk: testChunk,
        pipeline,
        options: {
          priority: 'high'
        }
      }
    });
    
    console.log(`✅ Chronos/Kairos Temporal Agent scheduled processing: ${scheduleResult.totalEstimatedTime}ms total estimated time`);
    console.log('   Scheduled steps:');
    scheduleResult.schedule.forEach(step => {
      console.log(`     - Step ${step.stepId}: ${step.agentName} (${step.operation}) - ${step.estimatedDuration}ms`);
    });
    
    // Test 4: Agent assignment with Quantum Coordinator
    console.log('\n🧪 Test 4: Assigning agents with Quantum Coordinator');
    const assignmentResult = agentManager.sendMessage('quantum-coordinator', {
      type: 'assign_agents',
      data: {
        chunk: testChunk,
        availableAgents: Object.values(agents),
        options: {
          maxAgents: 3,
          assignmentStrategy: 'specialized'
        }
      }
    });
    
    console.log(`✅ Quantum Coordinator assigned ${assignmentResult.assignedAgents.length} agents:`);
    assignmentResult.assignedAgents.forEach(agentId => {
      console.log(`   - ${agents[agentId].name} (${agentId})`);
    });
    
    // Test 5: Symbol interpretation with Symbolic Interpreter
    console.log('\n🧪 Test 5: Interpreting symbols with Symbolic Interpreter');
    const symbolContent = 'This test contains symbols: ✨ ⚛️ 🧐 ⏳ 📈 to be interpreted';
    
    const interpretationResult = agentManager.sendMessage('symbolic-interpreter', {
      type: 'interpret_symbols',
      data: {
        content: symbolContent,
        options: {
          symbolTypes: ['emoji', 'special']
        }
      }
    });
    
    console.log(`✅ Symbolic Interpreter extracted ${interpretationResult.extractedSymbols} symbols`);
    console.log('   Interpretations:');
    interpretationResult.interpretations.forEach(interpretation => {
      console.log(`     - ${interpretation.symbol}: ${interpretation.interpretation.substring(0, 50)}... (confidence: ${interpretation.confidence.toFixed(2)})`);
    });
    
    // Test 6: Pattern analysis with True-Index Analyst
    console.log('\n🧪 Test 6: Analyzing patterns with True-Index Analyst');
    
    // Create sample data for pattern analysis
    const sampleData = [
      { timestamp: new Date(Date.now() - 86400000 * 5), value: 10, category: 'A' },
      { timestamp: new Date(Date.now() - 86400000 * 4), value: 15, category: 'A' },
      { timestamp: new Date(Date.now() - 86400000 * 3), value: 25, category: 'A' },
      { timestamp: new Date(Date.now() - 86400000 * 2), value: 22, category: 'A' },
      { timestamp: new Date(Date.now() - 86400000 * 1), value: 35, category: 'A' },
      { timestamp: new Date(), value: 40, category: 'A' }
    ];
    
    const patternResult = agentManager.sendMessage('true-index-analyst', {
      type: 'analyze_patterns',
      data: {
        data: sampleData,
        options: {
          patternTypes: ['trends', 'cycles'],
          trendField: 'value',
          timeField: 'timestamp'
        }
      }
    });
    
    console.log(`✅ True-Index Analyst analyzed patterns: ${Object.keys(patternResult.patterns).length} pattern types found`);
    
    if (patternResult.patterns.trends) {
      console.log(`   Trend analysis: ${patternResult.patterns.trends.direction} (change: ${patternResult.patterns.trends.changePercent}%)`);
    }
    
    if (patternResult.recommendations.length > 0) {
      console.log('   Recommendations:');
      patternResult.recommendations.forEach(rec => {
        console.log(`     - ${rec.description} (priority: ${rec.priority})`);
      });
    }
    
    // Test 7: Full chunk processing through Quantum Agent Manager
    console.log('\n🧪 Test 7: Full chunk processing through Quantum Agent Manager');
    
    const processingResult = agentManager.processChunk(testChunk, {
      strategy: 'coordinator',
      targetQuality: 0.8
    });
    
    console.log(`✅ Full chunk processing complete: ${processingResult.processingState.status}`);
    console.log(`   Processing steps: ${processingResult.processingState.steps.length}`);
    processingResult.processingState.steps.forEach(step => {
      console.log(`     - Step ${step.stepIndex}: ${step.agentId} (${step.status})`);
    });
    
    console.log('\n✅ All Loki Variant System tests completed successfully');
    
    // Get some statistics from the agent manager
    const dreamStateHistory = agentManager.getMessageHistory('dream-state-wilton-ai', 10);
    console.log(`\n📊 Dream-State Wilton AI processed ${dreamStateHistory.length} messages`);
    
    return true;
  } catch (error) {
    console.error('❌ Error during Loki Variant System test:', error);
    return false;
  }
}

// Run the test
testLokiVariantSystem().then(success => {
  if (success) {
    console.log('\n🎉 Loki Variant System is functioning correctly');
  } else {
    console.log('\n⚠️ Loki Variant System test failed');
  }
});