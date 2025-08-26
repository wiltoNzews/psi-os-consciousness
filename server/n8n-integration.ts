import fetch from 'node-fetch';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  data?: any;
}

class N8nIntegration {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.apiKey = process.env.N8N_API_KEY || '';
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': this.apiKey,
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`N8n API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[N8n Integration] API Error:', error);
      throw error;
    }
  }

  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const response = await this.makeRequest('/workflows');
      return response.data || [];
    } catch (error) {
      console.error('[N8n Integration] Failed to fetch workflows:', error);
      return [];
    }
  }

  async getWorkflow(workflowId: string): Promise<N8nWorkflow | null> {
    try {
      return await this.makeRequest(`/workflows/${workflowId}`);
    } catch (error) {
      console.error('[N8n Integration] Failed to fetch workflow:', error);
      return null;
    }
  }

  async executeWorkflow(workflowId: string, data: any = {}): Promise<WorkflowExecution | null> {
    try {
      const response = await this.makeRequest(`/workflows/${workflowId}/execute`, {
        method: 'POST',
        body: JSON.stringify({ data })
      });
      return response;
    } catch (error) {
      console.error('[N8n Integration] Failed to execute workflow:', error);
      return null;
    }
  }

  async getExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    try {
      const endpoint = workflowId ? `/executions?workflowId=${workflowId}` : '/executions';
      const response = await this.makeRequest(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('[N8n Integration] Failed to fetch executions:', error);
      return [];
    }
  }

  async getExecution(executionId: string): Promise<WorkflowExecution | null> {
    try {
      return await this.makeRequest(`/executions/${executionId}`);
    } catch (error) {
      console.error('[N8n Integration] Failed to fetch execution:', error);
      return null;
    }
  }

  async activateWorkflow(workflowId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/workflows/${workflowId}/activate`, {
        method: 'POST'
      });
      return true;
    } catch (error) {
      console.error('[N8n Integration] Failed to activate workflow:', error);
      return false;
    }
  }

  async deactivateWorkflow(workflowId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/workflows/${workflowId}/deactivate`, {
        method: 'POST'
      });
      return true;
    } catch (error) {
      console.error('[N8n Integration] Failed to deactivate workflow:', error);
      return false;
    }
  }

  // WiltonOS specific workflows
  async getWiltonOSWorkflows(): Promise<N8nWorkflow[]> {
    const workflows = await this.getWorkflows();
    return workflows.filter(w => 
      w.name.toLowerCase().includes('wiltonos') || 
      w.name.toLowerCase().includes('codex') ||
      w.name.toLowerCase().includes('coherence')
    );
  }

  async executeCoherenceMonitoring(coherenceLevel: number): Promise<any> {
    const workflows = await this.getWiltonOSWorkflows();
    const coherenceWorkflow = workflows.find(w => w.name.toLowerCase().includes('coherence'));
    
    if (coherenceWorkflow) {
      return await this.executeWorkflow(coherenceWorkflow.id, {
        coherenceLevel,
        timestamp: new Date().toISOString(),
        source: 'WiltonOS'
      });
    }
    
    return null;
  }

  async executeMemoryProcessing(memoryData: any): Promise<any> {
    const workflows = await this.getWiltonOSWorkflows();
    const memoryWorkflow = workflows.find(w => w.name.toLowerCase().includes('memory'));
    
    if (memoryWorkflow) {
      return await this.executeWorkflow(memoryWorkflow.id, {
        ...memoryData,
        timestamp: new Date().toISOString(),
        source: 'WiltonOS'
      });
    }
    
    return null;
  }

  async executeCodexIntegration(codexData: any): Promise<any> {
    const workflows = await this.getWiltonOSWorkflows();
    const codexWorkflow = workflows.find(w => w.name.toLowerCase().includes('codex'));
    
    if (codexWorkflow) {
      return await this.executeWorkflow(codexWorkflow.id, {
        ...codexData,
        timestamp: new Date().toISOString(),
        source: 'WiltonOS'
      });
    }
    
    return null;
  }
}

export const n8nIntegration = new N8nIntegration();
export { N8nIntegration, type N8nWorkflow, type WorkflowExecution };