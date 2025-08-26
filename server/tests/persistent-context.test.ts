import { FileSystemPersistentContextService, createPersistenceService } from '../services/persistence-layer.js';
import { CognitiveLayer, MetaEventType } from '../services/context-manager.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { formatPrompt, parsePrompt, Prefix, Suffix } from '../utils/prompt-utils.js';
import { StrategicContext } from '../services/qrn/quantum-glossary.js';
import ChronosDateHandler from '../services/utils/chronos-date-handler.js';

describe('FileSystemPersistentContextService (Authentic Tests)', () => {
  let service: FileSystemPersistentContextService;
  const testDir = path.join(__dirname, 'test_data'); // Dedicated test directory
  const sessionId = 'test-session';
  const contextFile = path.join(testDir, 'contexts', `${sessionId}.json`);
  const testSessionId = sessionId; // Alias for consistency with test that uses it

  beforeEach(async () => {
    // Ensure the test directory exists
    await fs.mkdir(path.join(testDir, 'contexts'), { recursive: true });

    // Create a NEW service instance for each test, using the test directory
    const config = { baseDir: testDir };
    service = createPersistenceService(config);

    await service.initializeSession(sessionId);
  });

  afterEach(async () => {
    // Clean up the ENTIRE test directory after each test
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error("Error during test cleanup:", error);
        throw error; // Re-throw other errors
      }
    }
  });

  it('should save and load context data', async () => {
    const testData = {
      sessionId: sessionId,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    };

    await service.saveContext(testData);

    // Directly check existence
    await expect(fs.access(contextFile)).resolves.toBeUndefined();

    const loadedData = await service.loadContext(testData.sessionId);

    // The loaded data *should* be deeply equal to the test data
    expect(loadedData).toEqual(expect.objectContaining({
      sessionId: testData.sessionId,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: []
    }));

    // Now, *also* check the file system directly:
    const fileContent = await fs.readFile(contextFile, 'utf8');
    const parsedContent = JSON.parse(fileContent);

    expect(parsedContent.sessionId).toBe(testData.sessionId);
    expect(typeof parsedContent.createdAt).toBe('string'); // Should be a string now
    expect(new Date(parsedContent.createdAt).getTime()).toBeCloseTo(testData.createdAt.getTime(), -2); // Allow small differences
    expect(parsedContent.version).toBe(1); // Should be incremented
  });

  it('should return null if context data does not exist', async () => {
    const loadedData = await service.loadContext('non-existent-context-id');
    expect(loadedData).toBeNull();
  });

  it('should add and retrieve history chunks correctly', async () => {
    const historyChunk = {
      chunkId: 'test-chunk-1',
      content: 'Test content',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      timestamp: new Date(),
      taskId: 'test-task-1',
      tags: ['test', 'integration'],
    };
    await service.addHistoryChunk(sessionId, historyChunk);
    const history = await service.getRecentHistory(sessionId, CognitiveLayer.STRATEGIC, 10);
    expect(history.length).toBe(1);
    expect(history[0].content).toBe('Test content');

    // Also verify by loading entire context
    const context = await service.loadContext(sessionId);
    expect(context?.historyChunks.length).toBe(1);
    expect(context?.historyChunks[0].content).toBe('Test content');
    expect(context?.historyChunks[0].chunkId).toBe(historyChunk.chunkId);
  });

  it('should add and retrieve strategic plans correctly', async () => {
    const strategicPlan = {
      taskId: 'test-plan-001',
      planSummary: 'Test strategic plan',
      subTasks: ['subtask-1', 'subtask-2'],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending' as const
    };
    await service.addStrategicPlan(sessionId, strategicPlan);
    const plans = await service.getActiveStrategicPlans(sessionId);
    expect(plans.length).toBe(1);
    expect(plans[0].planSummary).toBe('Test strategic plan');
    expect(plans[0].status).toBe('pending');
    expect(plans[0].taskId).toBe('test-plan-001');
  });

  it('should update an existing strategic plan', async () => {
    const plan = {
      taskId: 'update-test-1',
      planSummary: 'To be updated',
      subTasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending' as const
    };
    await service.addStrategicPlan(sessionId, plan);

    const updatedPlan = {
      ...plan,
      status: 'completed' as const,
      completedAt: new Date()
    };

    await service.updateStrategicPlan(sessionId, updatedPlan);

    const context = await service.loadContext(sessionId);
    const foundPlan = context!.strategicPlans.find(p => p.taskId === 'update-test-1')!;
    expect(foundPlan.status).toBe('completed');
    expect(foundPlan.completedAt!.getTime()).toBeCloseTo(updatedPlan.completedAt!.getTime(), -2); // Allow for minor time differences
    expect(foundPlan.updatedAt.getTime()).toBeGreaterThanOrEqual(foundPlan.createdAt.getTime());
  });

  it('should add and retrieve meta-cognitive insights correctly', async () => {
    const insight = {
      eventType: MetaEventType.PATTERN_RECOGNITION,
      summary: 'Test meta-cognitive insight',
      details: { source: 'integration-test', pattern: 'test-pattern' },
      timestamp: new Date(),
      importance: 0.8,
      confidence: 0.9
    };
    await service.addMetaInsight(sessionId, insight);
    const insights = await service.getInsightsByType(sessionId, MetaEventType.PATTERN_RECOGNITION, 0.5);
    expect(insights.length).toBe(1);
    expect(insights[0].summary).toBe('Test meta-cognitive insight');
    expect(insights[0].importance).toBeGreaterThanOrEqual(0.5);
  });

  it('should search context history by text', async () => {
    const searchTerm = `searchable-${uuidv4()}`;
    const chunk = {
      chunkId: uuidv4(),
      content: `This is a ${searchTerm} content that should be findable`,
      cognitiveLayer: CognitiveLayer.REACTIVE,
      timestamp: new Date(),
      taskId: 't-search-1',
      tags: ['search', 'test']
    };
    await service.addHistoryChunk(testSessionId, chunk);
    const searchResults = await service.searchContext(testSessionId, searchTerm);

    expect(searchResults.length).toBeGreaterThan(0);
    const foundChunk = searchResults.find(c => c.content.includes(searchTerm));
    expect(foundChunk).toBeDefined();
    expect(foundChunk!.tags).toContain('search');
  });

  /**
   * PREFIX/SUFFIX Templates for Ethical AI Compliance Testing
   * 
   * This test implements the Quantum Collaboration Framework's PREFIX/SUFFIX templates
   * for multi-agent orchestration, specifically focusing on ethical AI compliance checks.
   * It demonstrates how to use PREFIX/SUFFIX for structured communication between
   * different AI agents (Claude and Grok in this case).
   */
  describe('PREFIX/SUFFIX Templates for Ethical AI Compliance', () => {
    // Import quantum glossary for explicit decision making
    let quantumGlossary: any;
    
    beforeEach(async () => {
      // Mock quantum glossary with decohere method for testing
      quantumGlossary = {
        decohere: (context: StrategicContext): string => {
          // For testing, simply select first option
          return context.possibleNextActions[0];
        },
        recordFlowMetric: jest.fn(),
        tagWithContext: (message: string) => `[TEST] ${message}`
      };
    });

    it('should format and parse PREFIX/SUFFIX templates for multi-agent ethical compliance checks', async () => {
      // Create a PREFIX/SUFFIX prompt for Claude to implement ethical compliance check
      const prefix: Prefix = {
        levelDimension: 'Tactical',
        objective: 'Implement an ethical AI compliance check in verification logic',
        context: 'Creating a verification system for ethical AI decision-making',
        modelAgent: 'Claude',
        depthRequired: 'Detailed Technical Implementation',
        inputDataType: 'Code',
        domain: 'Ethics'
      };

      const task = `
        Implement a function that checks whether an AI decision complies with ethical guidelines.
        The function should:
        1. Verify transparency of decision-making
        2. Check for bias in input data
        3. Ensure accountability through logging
        4. Document the ethical considerations
      `;

      const suffix: Suffix = {
        actionableNextSteps: [
          'Implement ethicalComplianceCheck function',
          'Add validation for transparency',
          'Implement bias detection'
        ],
        nextAgentRouting: 'Grok',
        outputRequirements: 'TypeScript code with comments',
        flowMetrics: 'FLOW',
        confidenceLevel: 'High',
        resourcesUsed: ['QUANTUM_COLLABORATION_FRAMEWORK.md', 'verification-patterns.js']
      };

      // Format the prompt using PREFIX/SUFFIX template
      const prompt = formatPrompt(prefix, task, suffix);
      console.log('Formatted prompt:', prompt);

      // Parse the prompt back for verification
      const parsedPrompt = parsePrompt(prompt);
      
      // Verify that the parsing works correctly
      expect(parsedPrompt.prefix.objective).toBe('Implement an ethical AI compliance check in verification logic');
      expect(parsedPrompt.prefix.modelAgent).toBe('Claude');
      expect(parsedPrompt.prefix.domain).toBe('Ethics');
      expect(parsedPrompt.suffix.nextAgentRouting).toBe('Grok');
      expect(parsedPrompt.suffix.actionableNextSteps).toContain('Implement ethicalComplianceCheck function');

      // Store the prompt in the persistent context
      const ethicsChunk = {
        chunkId: uuidv4(),
        content: prompt,
        cognitiveLayer: CognitiveLayer.STRATEGIC,
        timestamp: new Date(),
        taskId: 'ethics-compliance-task',
        tags: ['ethics', 'compliance', 'verification'],
      };
      
      await service.addHistoryChunk(sessionId, ethicsChunk);
      
      // Mock Claude's response
      const mockClaudeResponse = {
        prefix: {
          levelDimension: 'Tactical',
          objective: 'Ethical AI compliance check implementation',
          context: 'Verification system for ethical AI decision-making',
          modelAgent: 'Claude',
          depthRequired: 'Detailed Technical Implementation',
          inputDataType: 'Code',
          domain: 'Ethics'
        },
        content: `
          /**
           * Ethics compliance verification for AI decisions
           * Implements transparency, bias detection, and accountability checks
           * 
           * @param decision The AI decision to verify
           * @param context Additional context about the decision
           * @returns Compliance results with pass/fail and rationale
           */
          export function ethicalComplianceCheck(
            decision: any, 
            context: Record<string, any>
          ): EthicsComplianceResult {
            // 1. Check for transparency
            const transparencyScore = verifyTransparency(decision, context);
            
            // 2. Check for bias
            const biasDetectionResult = detectBias(decision, context);
            
            // 3. Ensure accountability through logging
            logEthicalCheck({
              decision,
              context,
              transparencyScore,
              biasDetectionResult,
              timestamp: ChronosDateHandler.createDate()  // Using existing ChronosDateHandler for timestamps
            });
            
            // 4. Documentation of ethical considerations
            const documentation = generateEthicalConsiderations(decision, context);
            
            return {
              passed: transparencyScore > 0.7 && !biasDetectionResult.biasDetected,
              transparencyScore,
              biasResults: biasDetectionResult,
              documentation,
              timestamp: ChronosDateHandler.createDate()
            };
          }
          
          /**
           * Verifies if the decision-making process is transparent
           */
          function verifyTransparency(decision: any, context: Record<string, any>): number {
            // Implementation details omitted for brevity
            return 0.85; // Example transparency score
          }
          
          /**
           * Detects potential bias in the decision
           */
          function detectBias(decision: any, context: Record<string, any>): BiasDetectionResult {
            // Implementation details omitted for brevity
            return {
              biasDetected: false,
              biasScore: 0.12,
              biasDimensions: []
            };
          }
        `,
        suffix: {
          actionableNextSteps: [
            'Implement integration with quantum-glossary.ts',
            'Add unit tests for ethicalComplianceCheck',
            'Document EU AI Act compliance mapping'
          ],
          nextAgentRouting: 'Grok',
          outputRequirements: 'Strategic analysis of implementation',
          flowMetrics: 'FLOW',
          confidenceLevel: 'High',
          resourcesUsed: ['ethical-guidelines.md', 'eu-ai-act.md', 'QUANTUM_COLLABORATION_FRAMEWORK.md']
        }
      };

      // Store Claude's response in the persistent context
      const claudeResponseChunk = {
        chunkId: uuidv4(),
        content: formatPrompt(mockClaudeResponse.prefix, mockClaudeResponse.content, mockClaudeResponse.suffix),
        cognitiveLayer: CognitiveLayer.STRATEGIC,
        timestamp: new Date(),
        taskId: 'ethics-compliance-task',
        tags: ['ethics', 'compliance', 'implementation'],
      };
      
      await service.addHistoryChunk(sessionId, claudeResponseChunk);

      // Create a strategic context for the quantum glossary to make an explicit decision
      const strategicContext: StrategicContext = {
        contextDescription: "Determine next steps for ethical compliance implementation",
        possibleNextActions: [
          "Route to Grok for strategic analysis",
          "Request additional implementation details from Claude",
          "Implement unit tests directly",
          "Document EU AI Act compliance mapping"
        ],
        metadata: {
          implementationComplete: true,
          ethicsCategory: "transparency",
          aiActCompliance: 0.85
        }
      };

      // Use decohere to make an explicit tactical decision
      const nextAction = quantumGlossary.decohere(strategicContext);
      expect(nextAction).toBe("Route to Grok for strategic analysis");

      // Based on decohere decision, create a prompt for Grok for strategic analysis
      const grokPrefix: Prefix = {
        levelDimension: 'Strategic',
        objective: 'Analyze ethical compliance implementation for broader impact',
        context: 'Evaluating strategic implications of ethical AI verification system',
        modelAgent: 'Grok',
        depthRequired: 'High-Level Strategic Analysis',
        inputDataType: 'Code',
        domain: 'Ethics'
      };

      const grokTask = `
        Analyze the following ethical AI compliance implementation for strategic implications:
        
        ${mockClaudeResponse.content}
        
        Consider:
        1. Alignment with EU AI Act requirements
        2. Competitive advantages from ethical AI verification
        3. Potential expansion to other ethical dimensions
        4. Integration with broader system verification framework
      `;

      const grokSuffix: Suffix = {
        actionableNextSteps: [
          'Identify strategic alignment with regulatory frameworks',
          'Recommend ethical dimensions for expansion',
          'Outline integration approach with verification framework',
          'Suggest go-to-market strategy for ethical AI verification'
        ],
        nextAgentRouting: 'Human',
        outputRequirements: 'Strategic analysis document with recommendations',
        flowMetrics: 'FLOW',
        confidenceLevel: 'High',
        resourcesUsed: ['QUANTUM_COLLABORATION_FRAMEWORK.md', 'eu-ai-act.md', 'ethical-guidelines.md']
      };

      // Format the prompt using PREFIX/SUFFIX template
      const grokPrompt = formatPrompt(grokPrefix, grokTask, grokSuffix);
      console.log('Grok Prompt:', grokPrompt);

      // Mock Grok's response for testing
      const mockGrokResponse = {
        prefix: {
          levelDimension: 'Strategic',
          objective: 'Strategic analysis of ethical compliance implementation',
          context: 'Evaluating implications of ethical AI verification',
          modelAgent: 'Grok',
          depthRequired: 'High-Level Strategic Analysis',
          inputDataType: 'Code',
          domain: 'Ethics'
        },
        content: `
          # Strategic Analysis: Ethical AI Compliance Implementation
          
          ## 1. EU AI Act Alignment Assessment
          
          The implementation demonstrates strong alignment with EU AI Act requirements:
          
          * **Transparency Requirements (Article 13)**: The verification of transparency (scoring system) directly supports requirements for clear documentation of AI decision processes.
          * **Risk Management (Article 9)**: The bias detection system addresses a key risk management requirement by identifying and mitigating potential discriminatory outcomes.
          * **Record-keeping (Article 12)**: The accountability logging satisfies the record-keeping requirements for high-risk AI systems.
          
          **Strategic Advantage**: This implementation positions the system at approximately 85% compliance with current EU AI Act provisions, representing a significant competitive advantage in regulated markets.
          
          ## 2. Market Positioning & Competitive Analysis
          
          Three distinct advantages emerge from this ethical verification approach:
          
          1. **Regulatory Readiness**: The system's explicit ethical checks create an estimated 18-month lead time against competitors who will need to retrofit compliance.
          2. **Trust Enhancement**: Transparent documentation of ethical considerations increases stakeholder trust, potentially increasing adoption rates by 30% in sensitive domains.
          3. **Litigation Risk Reduction**: Systematic ethical compliance verification reduces legal exposure by an estimated 40% compared to systems without explicit ethical checks.
          
          ## 3. Expansion Opportunities
          
          Four high-value ethical dimensions for expansion:
          
          | Dimension | Implementation Complexity | Strategic Value | Regulatory Alignment |
          |-----------|---------------------------|-----------------|----------------------|
          | Privacy & Data Minimization | Medium | Very High | GDPR + EU AI Act |
          | Human Oversight | Low | High | EU AI Act Article 14 |
          | Environmental Impact | Medium | Medium-High | EU Green Deal |
          | Security & Resilience | High | Very High | NIS2 Directive |
          
          **Recommendation**: Prioritize Privacy & Data Minimization expansion, as it offers the highest strategic value with manageable implementation complexity.
          
          ## 4. System Integration Framework
          
          Recommend a three-tier integration approach:
          
          1. **Core Framework Layer**: Integrate ethical compliance as a non-optional verification step in the quantum verification system
          2. **Domain-Specific Layer**: Create domain-specific ethical verification extensions for healthcare, finance, etc.
          3. **Regulatory Mapping Layer**: Implement dynamic mapping between verification results and evolving regulatory requirements
          
          ## 5. Go-to-Market Strategy
          
          Recommend targeting three market segments, in order:
          
          1. **EU-based enterprises** (€250M+ revenue) in regulated industries requiring immediate compliance
          2. **Healthcare AI providers** globally, leveraging transparency and bias verification as market differentiators
          3. **Financial services** focusing on algorithmic trading and loan approval systems where bias detection provides immediate value
          
          Implementation of this ethical verification framework potentially unlocks €45-60M in annual revenue within regulated markets while establishing thought leadership in ethical AI.
        `,
        suffix: {
          actionableNextSteps: [
            'Create EU AI Act compliance mapping document',
            'Develop domain-specific verification extensions for healthcare',
            'Implement Privacy & Data Minimization expansion',
            'Create go-to-market materials highlighting regulatory compliance'
          ],
          nextAgentRouting: 'Human',
          outputRequirements: 'Implementation plan with priorities',
          flowMetrics: 'FLOW',
          confidenceLevel: 'High',
          resourcesUsed: ['eu-ai-act.md', 'market-analysis-2025.pdf', 'QUANTUM_COLLABORATION_FRAMEWORK.md']
        }
      };

      // Store Grok's response in the persistent context
      const grokResponseChunk = {
        chunkId: uuidv4(),
        content: formatPrompt(mockGrokResponse.prefix, mockGrokResponse.content, mockGrokResponse.suffix),
        cognitiveLayer: CognitiveLayer.STRATEGIC,
        timestamp: new Date(),
        taskId: 'ethics-compliance-task',
        tags: ['ethics', 'compliance', 'strategic-analysis', 'eu-ai-act'],
      };
      
      await service.addHistoryChunk(sessionId, grokResponseChunk);

      // Verify that all chunks were properly stored
      const relatedChunks = await service.searchContext(sessionId, 'ethics');
      expect(relatedChunks.length).toBe(3);

      // Verify the tags were properly stored
      const strategicChunks = relatedChunks.filter(chunk => chunk.tags.includes('strategic-analysis'));
      expect(strategicChunks.length).toBe(1);
      expect(strategicChunks[0].content).toContain('EU AI Act Alignment Assessment');
    });
  });
});