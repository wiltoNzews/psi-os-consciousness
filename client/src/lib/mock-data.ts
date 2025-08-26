import { faker } from '@faker-js/faker';

// Types
export interface ApiKey {
  id: number;
  label: string;
  key: string;
  status: 'active' | 'expiring_soon' | 'inactive';
  usage: number;
  usageLimit: number;
  type?: 'openai' | 'anthropic' | 'stability' | 'cohere' | 'custom';
  permissions?: 'read' | 'write' | 'admin';
  createdAt?: Date;
}

export interface SystemStatus {
  id: string;
  name: string;
  status: 'operational' | 'high load' | 'warning' | 'down';
  value: string | number;
  icon: string;
}

export interface ModelDefinition {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'vision' | 'audio' | 'multimodal';
  contextLength: number;
  performance: number;
  costPerToken: number;
  status: 'available' | 'deprecated' | 'preview';
  version: string;
}

export interface PipelineJob {
  id: number;
  name: string;
  type: 'video' | 'image' | 'data' | 'audio';
  progress: number;
  timeStarted: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface MediaAsset {
  id: number;
  title: string;
  type: 'image' | 'video' | 'audio';
  thumbnailUrl: string;
  createdAt: Date;
}

export interface SystemLog {
  id: number;
  type: 'success' | 'warning' | 'error';
  message: string;
  details: string;
  timestamp: Date;
}

export interface PerformanceMetric {
  date: Date;
  value: number;
}

// Mock data functions

export const getSystemStatuses = (): SystemStatus[] => {
  return [
    {
      id: 'pipeline',
      name: 'Pipeline Status',
      status: 'operational',
      value: 'Operational',
      icon: 'sitemap'
    },
    {
      id: 'api',
      name: 'API Status',
      status: 'operational',
      value: '4/4 Connected',
      icon: 'cloud-upload-alt'
    },
    {
      id: 'media',
      name: 'Media Generation',
      status: 'high load',
      value: 'High Load',
      icon: 'film'
    },
    {
      id: 'storage',
      name: 'Storage Capacity',
      status: 'warning',
      value: '68%',
      icon: 'database'
    }
  ];
};

export const getInitialApiKeys = (): ApiKey[] => {
  return [
    {
      id: 1,
      label: 'Primary API Key',
      key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx1',
      status: 'active',
      usage: 128.45,
      usageLimit: 500
    },
    {
      id: 2,
      label: 'Secondary API Key',
      key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx2',
      status: 'active',
      usage: 278.10,
      usageLimit: 500
    },
    {
      id: 3,
      label: 'Backup API Key',
      key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx3',
      status: 'active',
      usage: 45.25,
      usageLimit: 500
    },
    {
      id: 4,
      label: 'Development API Key',
      key: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx4',
      status: 'expiring_soon',
      usage: 398.75,
      usageLimit: 500
    }
  ];
};

export const getInitialJobQueue = (): PipelineJob[] => {
  return [
    {
      id: 1,
      name: 'Video Render: Marketing Campaign',
      type: 'video',
      progress: 45,
      timeStarted: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
      status: 'running'
    },
    {
      id: 2,
      name: 'Image Batch: Product Catalog',
      type: 'image',
      progress: 78,
      timeStarted: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      status: 'running'
    },
    {
      id: 3,
      name: 'Data ETL: Customer Analytics',
      type: 'data',
      progress: 32,
      timeStarted: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: 'running'
    },
    {
      id: 4,
      name: 'Audio Processing: Podcast Series',
      type: 'audio',
      progress: 91,
      timeStarted: new Date(Date.now() - 22 * 60 * 1000), // 22 minutes ago
      status: 'running'
    }
  ];
};

export const getInitialMediaAssets = (): MediaAsset[] => {
  return [
    {
      id: 1,
      title: 'Product Ad 4K',
      type: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618609255910-aa7bde49f7b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
    },
    {
      id: 2,
      title: 'Social Media Banner',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(Date.now() - 42 * 60 * 1000) // 42 minutes ago
    },
    {
      id: 3,
      title: 'Podcast Thumbnail',
      type: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    },
    {
      id: 4,
      title: 'Tech Promo Video',
      type: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ];
};

export const getInitialSystemLogs = (): SystemLog[] => {
  return [
    {
      id: 1,
      type: 'error',
      message: 'API Rate Limit Warning',
      details: 'Development API Key approaching rate limit for GPT-4 model. 95% of hourly limit reached.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 min ago
    },
    {
      id: 2,
      type: 'warning',
      message: 'Storage Warning',
      details: 'Media storage cluster reaching 70% capacity. Consider adding storage or archiving old media.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 min ago
    },
    {
      id: 3,
      type: 'success',
      message: 'System Update Completed',
      details: 'Pipeline optimization update completed successfully. Performance improved by approximately 15%.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  ];
};

export const getPerformanceMetrics = (): PerformanceMetric[] => {
  const result: PerformanceMetric[] = [];
  const now = new Date();
  
  // Generate 24 hourly data points for the last day
  for (let i = 0; i < 24; i++) {
    const date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    const value = 50 + Math.floor(Math.random() * 50); // Random value between 50-100
    result.push({ date, value });
  }
  
  return result;
};

export const getPipelineData = () => {
  return {
    activePipelines: 14,
    processedData: '1.8 TB'
  };
};

export const getProcessingStats = () => {
  return {
    averageTime: '1.8s',
    averageTimeChange: -12,
    successRate: '98.7%',
    successRateChange: 2.3
  };
};
