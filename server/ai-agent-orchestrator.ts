/**
 * AI Agent Orchestrator - Collaborative Intelligence Layer
 * Part of WiltonOS Ultra-Coherent Architecture
 */

interface AgentCapability {
  name: string;
  type: 'local' | 'remote';
  specialization: string[];
  costTier: 'free' | 'pro';
  responseTime: number;
}

interface AgentTask {
  id: string;
  type: 'teaching' | 'analysis' | 'reflection' | 'search' | 'generation';
  priority: number;
  context: Record<string, any>;
  assignedAgent?: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  result?: any;
}

interface AgentResponse {
  agentId: string;
  taskId: string;
  result: any;
  metadata: {
    processingTime: number;
    confidence: number;
    tokens?: number;
    cost?: number;
  };
}

class AIAgentOrchestrator {
  private agents: Map<string, AgentCapability>;
  private activeTasks: Map<string, AgentTask>;
  private taskQueue: AgentTask[];
  private userTier: 'free' | 'pro' = 'free';

  constructor() {
    this.agents = new Map();
    this.activeTasks = new Map();
    this.taskQueue = [];
    this.initializeAgents();
  }

  private initializeAgents() {
    // Local JavaScript Agent - Always available
    this.agents.set('local-worker', {
      name: 'Local Worker',
      type: 'local',
      specialization: ['math', 'geometry', 'dom-manipulation', 'visualization'],
      costTier: 'free',
      responseTime: 50
    });

    // Claude Agent - For reflection and document analysis
    this.agents.set('claude-reflector', {
      name: 'Claude Reflector',
      type: 'remote',
      specialization: ['reflection', 'document-analysis', 'teaching', 'longform-writing'],
      costTier: 'pro',
      responseTime: 2000
    });

    // GPT-4 Agent - For real-time interaction
    this.agents.set('gpt4-interactive', {
      name: 'GPT-4 Interactive',
      type: 'remote',
      specialization: ['conversation', 'search', 'meta-analysis', 'quick-response'],
      costTier: 'pro',
      responseTime: 1500
    });

    console.log('[AI Orchestrator] Agents initialized - Local Worker always available');
  }

  async executeTask(task: Omit<AgentTask, 'id' | 'status'>): Promise<AgentResponse> {
    const taskId = this.generateTaskId();
    const fullTask: AgentTask = {
      ...task,
      id: taskId,
      status: 'pending'
    };

    // Select best agent for task
    const selectedAgent = this.selectAgent(fullTask);
    fullTask.assignedAgent = selectedAgent;
    fullTask.status = 'active';

    this.activeTasks.set(taskId, fullTask);

    try {
      const result = await this.executeWithAgent(selectedAgent, fullTask);
      fullTask.status = 'completed';
      fullTask.result = result;

      return result;
    } catch (error) {
      fullTask.status = 'failed';
      console.error(`[AI Orchestrator] Task ${taskId} failed:`, error);
      
      // Fallback to local agent if remote fails
      if (selectedAgent !== 'local-worker') {
        return await this.executeWithAgent('local-worker', fullTask);
      }
      
      throw error;
    } finally {
      this.activeTasks.delete(taskId);
    }
  }

  private selectAgent(task: AgentTask): string {
    // Priority: capability match > cost tier > response time
    const availableAgents = Array.from(this.agents.entries())
      .filter(([_, agent]) => {
        // Check cost tier availability
        if (agent.costTier === 'pro' && this.userTier === 'free') {
          return false;
        }
        
        // Check specialization match
        return agent.specialization.some(spec => 
          task.type.includes(spec) || 
          JSON.stringify(task.context).toLowerCase().includes(spec)
        );
      })
      .sort((a, b) => {
        // Sort by capability match and response time
        const aScore = this.calculateAgentScore(a[1], task);
        const bScore = this.calculateAgentScore(b[1], task);
        return bScore - aScore;
      });

    return availableAgents.length > 0 ? availableAgents[0][0] : 'local-worker';
  }

  private calculateAgentScore(agent: AgentCapability, task: AgentTask): number {
    let score = 0;
    
    // Specialization match
    agent.specialization.forEach(spec => {
      if (task.type.includes(spec)) score += 10;
      if (JSON.stringify(task.context).toLowerCase().includes(spec)) score += 5;
    });
    
    // Response time bonus (faster = better)
    score += Math.max(0, 5000 - agent.responseTime) / 1000;
    
    // Local agent bonus for simple tasks
    if (agent.type === 'local' && task.priority < 5) score += 3;
    
    return score;
  }

  private async executeWithAgent(agentId: string, task: AgentTask): Promise<AgentResponse> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);

    const startTime = Date.now();
    let result: any;

    switch (agentId) {
      case 'local-worker':
        result = await this.executeLocalTask(task);
        break;
      case 'claude-reflector':
        result = await this.executeClaude(task);
        break;
      case 'gpt4-interactive':
        result = await this.executeGPT4(task);
        break;
      default:
        throw new Error(`Unknown agent: ${agentId}`);
    }

    const processingTime = Date.now() - startTime;

    return {
      agentId,
      taskId: task.id,
      result,
      metadata: {
        processingTime,
        confidence: this.calculateConfidence(agentId, task, result),
        tokens: result.tokens,
        cost: result.cost
      }
    };
  }

  private async executeLocalTask(task: AgentTask): Promise<any> {
    switch (task.type) {
      case 'teaching':
        return this.generateLocalTeaching(task.context);
      case 'analysis':
        return this.performLocalAnalysis(task.context);
      default:
        return {
          success: true,
          message: 'Local task executed',
          data: task.context
        };
    }
  }

  private generateLocalTeaching(context: Record<string, any>): any {
    const { module, geometry, userLevel } = context;
    
    const teachingContent = {
      lemniscate: {
        title: 'Lemniscata - O Infinito Sagrado',
        content: 'A lemniscata representa o fluxo infinito de energia entre os mundos material e espiritual.',
        exercises: [
          'Trace a forma do infinito com os olhos',
          'Medite no movimento contínuo',
          'Visualize energia fluindo através da forma'
        ]
      },
      flower: {
        title: 'Flor da Vida - Matriz da Criação',
        content: 'Padrão geométrico fundamental que sustenta toda a criação.',
        exercises: [
          'Desenhe círculos entrelaçados',
          'Contemple a harmonia das proporções',
          'Sinta a vibração da geometria sagrada'
        ]
      }
    };

    return {
      success: true,
      teaching: teachingContent[geometry] || teachingContent.lemniscate,
      personalizedTips: this.generatePersonalizedTips(userLevel)
    };
  }

  private generatePersonalizedTips(userLevel: number): string[] {
    if (userLevel < 0.3) {
      return [
        'Comece com sessões curtas de 5 minutos',
        'Foque na respiração durante a visualização',
        'Não se preocupe com perfeição'
      ];
    } else if (userLevel < 0.7) {
      return [
        'Experimente variações de velocidade',
        'Adicione intenções específicas',
        'Combine com áudio binaural'
      ];
    } else {
      return [
        'Explore geometrias avançadas',
        'Crie suas próprias variações',
        'Ensine outros usuários'
      ];
    }
  }

  private performLocalAnalysis(context: Record<string, any>): any {
    const { data, type } = context;
    
    if (type === 'coherence') {
      return {
        analysis: 'Análise de coerência local',
        trends: this.analyzeCoherenceTrends(data),
        recommendations: this.generateCoherenceRecommendations(data)
      };
    }
    
    return { analysis: 'Análise local completada', data };
  }

  private analyzeCoherenceTrends(data: any[]): any {
    if (!Array.isArray(data) || data.length === 0) {
      return { trend: 'stable', change: 0 };
    }

    const recent = data.slice(-10);
    const average = recent.reduce((sum, item) => sum + (item.value || 0), 0) / recent.length;
    const older = data.slice(-20, -10);
    const oldAverage = older.length > 0 ? 
      older.reduce((sum, item) => sum + (item.value || 0), 0) / older.length : average;

    const change = average - oldAverage;
    
    return {
      trend: change > 0.05 ? 'increasing' : change < -0.05 ? 'decreasing' : 'stable',
      change: Math.round(change * 1000) / 1000,
      current: Math.round(average * 1000) / 1000
    };
  }

  private generateCoherenceRecommendations(data: any[]): string[] {
    const recommendations = [];
    
    if (data.length > 0) {
      const latest = data[data.length - 1];
      
      if (latest.value < 0.5) {
        recommendations.push('Considere uma sessão de meditação com geometria sagrada');
        recommendations.push('Ajuste o ambiente para reduzir distrações');
      } else if (latest.value > 0.8) {
        recommendations.push('Excelente coerência! Mantenha a prática atual');
        recommendations.push('Experimente geometrias mais avançadas');
      }
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue praticando regularmente'];
  }

  private async executeClaude(task: AgentTask): Promise<any> {
    // This would integrate with Claude API if available
    console.log('[AI Orchestrator] Claude agent task queued for pro tier');
    return {
      success: false,
      message: 'Claude API requires pro tier and valid API key',
      fallback: true
    };
  }

  private async executeGPT4(task: AgentTask): Promise<any> {
    // This would integrate with OpenAI API if available
    console.log('[AI Orchestrator] GPT-4 agent task queued for pro tier');
    return {
      success: false,
      message: 'GPT-4 API requires pro tier and valid API key',
      fallback: true
    };
  }

  private calculateConfidence(agentId: string, task: AgentTask, result: any): number {
    if (agentId === 'local-worker') {
      return 0.8; // High confidence for local operations
    }
    
    return result.success ? 0.9 : 0.3;
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API methods
  setUserTier(tier: 'free' | 'pro') {
    this.userTier = tier;
    console.log(`[AI Orchestrator] User tier set to: ${tier}`);
  }

  getAvailableAgents(): AgentCapability[] {
    return Array.from(this.agents.values())
      .filter(agent => agent.costTier === 'free' || this.userTier === 'pro');
  }

  getSystemStatus() {
    return {
      activeAgents: this.agents.size,
      activeTasks: this.activeTasks.size,
      queuedTasks: this.taskQueue.length,
      userTier: this.userTier,
      availableCapabilities: this.getAvailableAgents().map(a => a.specialization).flat()
    };
  }

  // Specialized orchestration methods for WiltonOS
  async generateTeachingContent(module: string, geometry: string, userLevel: number) {
    return await this.executeTask({
      type: 'teaching',
      priority: 7,
      context: { module, geometry, userLevel }
    });
  }

  async analyzeUserProgress(userId: string, sessionData: any[]) {
    return await this.executeTask({
      type: 'analysis',
      priority: 5,
      context: { userId, data: sessionData, type: 'coherence' }
    });
  }

  async generatePersonalizedRecommendations(userProfile: any) {
    return await this.executeTask({
      type: 'reflection',
      priority: 6,
      context: { profile: userProfile, type: 'recommendations' }
    });
  }
}

export const aiAgentOrchestrator = new AIAgentOrchestrator();
export { AIAgentOrchestrator, type AgentTask, type AgentResponse, type AgentCapability };