import OpenAI from "openai";
import { storage } from "../storage.js";
import { Insight, Dataset, AnalysisResult } from "../../shared/schema-minimal.js";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

interface DatasetAnalysisRequest {
  datasetId: number;
  userId: number;
  analysisType: 'summary' | 'trends' | 'anomalies' | 'correlations' | 'clustering' | 'comprehensive';
  options?: {
    confidenceThreshold?: number;
    maxInsights?: number;
    includeVisualizations?: boolean;
    focusColumns?: string[];
    timeRange?: { start: string; end: string };
  };
}

interface DatasetAnalysisResponse {
  insights: Insight[];
  analysisResult: AnalysisResult;
  visualizationConfig?: Record<string, any>;
  executionTime: number;
}

interface AIInsight {
  title: string;
  description: string;
  confidence: number;
  impact: number;
  category: string;
  tags: string[];
  visualizationSuggestion?: {
    type: string;
    config: Record<string, any>;
  };
}

/**
 * Analyze a dataset using OpenAI
 * 
 * This function sends dataset information to OpenAI and returns
 * structured insights and analysis results.
 */
export async function analyzeDataset(
  request: DatasetAnalysisRequest
): Promise<DatasetAnalysisResponse> {
  const startTime = Date.now();
  
  try {
    // Get dataset
    const dataset = await storage.getDataset(request.datasetId);
    if (!dataset) {
      throw new Error(`Dataset with ID ${request.datasetId} not found`);
    }
    
    // Get dataset columns
    const columns = await storage.getDatasetColumns(request.datasetId);
    
    // Create prompt with dataset information
    const prompt = createAnalysisPrompt(dataset, columns, request);
    
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert data analyst who provides concise, actionable insights from data. Your insights should be clear, specific, and high-impact. Focus on statistical validity and practical business value. Format your response as JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Create analysis result
    const analysisResult = await storage.createAnalysisResult({
      name: `${request.analysisType.charAt(0).toUpperCase() + request.analysisType.slice(1)} Analysis of ${dataset.name}`,
      description: `Automated ${request.analysisType} analysis of dataset ${dataset.name}`,
      datasetId: dataset.id,
      createdBy: request.userId,
      results: parsedContent.rawResults || {},
      metrics: parsedContent.metrics || {},
      status: "completed",
      visualizationConfig: parsedContent.visualizationConfig || {}
    });
    
    // Create insights
    const insights: Insight[] = [];
    for (const insightData of parsedContent.insights) {
      const insight = await storage.createInsight({
        title: insightData.title,
        description: insightData.description,
        datasetId: dataset.id,
        analysisId: analysisResult.id,
        createdBy: request.userId,
        confidence: insightData.confidence,
        impact: insightData.impact,
        category: insightData.category,
        tags: insightData.tags || [],
        isPublished: false
      });
      
      insights.push(insight);
    }
    
    const executionTime = Date.now() - startTime;
    
    // Log successful analysis
    await storage.createSystemLog({
      type: "success",
      message: `Dataset Analysis Completed: ${dataset.name}`,
      details: `Successfully analyzed dataset ${dataset.name} (ID: ${dataset.id}) using ${request.analysisType} analysis. Generated ${insights.length} insights.`,
      severity: 1,
      component: "OpenAI Analyzer"
    });
    
    return {
      insights,
      analysisResult,
      visualizationConfig: parsedContent.visualizationConfig,
      executionTime
    };
    
  } catch (error) {
    // Log error
    await storage.createSystemLog({
      type: "error",
      message: `Dataset Analysis Failed`,
      details: error instanceof Error ? error.message : String(error),
      severity: 3,
      component: "OpenAI Analyzer"
    });
    
    throw error;
  }
}

/**
 * Analyze a specific analysis result to generate more insights
 */
export async function analyzeResult(
  analysisResultId: number,
  userId: number,
  options?: {
    focusArea?: string;
    deepDive?: boolean;
    confidenceThreshold?: number;
  }
): Promise<Insight[]> {
  try {
    // Get analysis result
    const analysisResult = await storage.getAnalysisResult(analysisResultId);
    if (!analysisResult) {
      throw new Error(`Analysis result with ID ${analysisResultId} not found`);
    }
    
    // Get dataset
    const dataset = await storage.getDataset(analysisResult.datasetId);
    if (!dataset) {
      throw new Error(`Dataset with ID ${analysisResult.datasetId} not found`);
    }
    
    // Create prompt
    const prompt = `
I have an analysis result that I'd like you to examine more deeply.
Analysis name: ${analysisResult.name}
Description: ${analysisResult.description}
Dataset: ${dataset.name} (${dataset.description || 'No description'})

The raw analysis results are: ${JSON.stringify(analysisResult.results)}
${options?.focusArea ? `Please focus specifically on: ${options.focusArea}` : ''}
${options?.deepDive ? 'Please provide a deep dive analysis with detailed statistical reasoning.' : 'Please provide concise, actionable insights.'}

Please generate 3-5 additional insights beyond what might be obvious from the initial analysis.
For each insight provide:
1. A brief title (under 100 characters)
2. A detailed description (under 500 characters)
3. A confidence score (0.0-1.0)
4. An impact score (1-10)
5. A business category
6. Relevant tags (2-5 keywords)

Format your response as JSON with this structure:
{
  "insights": [
    {
      "title": "string",
      "description": "string", 
      "confidence": number,
      "impact": number,
      "category": "string",
      "tags": ["string"]
    }
  ]
}
`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert data analyst who provides concise, actionable insights from data. Your insights should be clear, specific, and high-impact. Focus on statistical validity and practical business value. Format your response as JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Create insights
    const insights: Insight[] = [];
    for (const insightData of parsedContent.insights) {
      // Apply confidence threshold if specified
      if (options?.confidenceThreshold && insightData.confidence < options.confidenceThreshold) {
        continue;
      }
      
      const insight = await storage.createInsight({
        title: insightData.title,
        description: insightData.description,
        datasetId: dataset.id,
        analysisId: analysisResult.id,
        createdBy: userId,
        confidence: insightData.confidence,
        impact: insightData.impact,
        category: insightData.category,
        tags: insightData.tags || [],
        isPublished: false
      });
      
      insights.push(insight);
    }
    
    // Log success
    await storage.createSystemLog({
      type: "success",
      message: `Analysis Deep Dive Completed`,
      details: `Generated ${insights.length} additional insights for analysis result ${analysisResult.name} (ID: ${analysisResult.id}).`,
      severity: 1,
      component: "OpenAI Analyzer"
    });
    
    return insights;
    
  } catch (error) {
    // Log error
    await storage.createSystemLog({
      type: "error",
      message: `Analysis Deep Dive Failed`,
      details: error instanceof Error ? error.message : String(error),
      severity: 3,
      component: "OpenAI Analyzer"
    });
    
    throw error;
  }
}

/**
 * Create a natural language summary of insights
 */
export async function summarizeInsights(
  insightIds: number[],
  options?: {
    audience?: 'executive' | 'technical' | 'marketing';
    format?: 'bullet' | 'narrative' | 'presentation';
    maxLength?: number;
  }
): Promise<string> {
  try {
    const insights: Insight[] = [];
    
    // Get all insights
    for (const id of insightIds) {
      const insight = await storage.getInsight(id);
      if (insight) {
        insights.push(insight);
      }
    }
    
    if (insights.length === 0) {
      throw new Error("No valid insights found with the provided IDs");
    }
    
    // Get dataset info from the first insight
    let datasetName = "dataset";
    if (insights[0].datasetId) {
      const dataset = await storage.getDataset(insights[0].datasetId);
      if (dataset) {
        datasetName = dataset.name;
      }
    }
    
    // Create prompt
    const audience = options?.audience || 'executive';
    const format = options?.format || 'narrative';
    const maxLength = options?.maxLength || 1500;
    
    const prompt = `
I have a set of data insights that I'd like you to summarize in a coherent way.
Dataset: ${datasetName}
Audience: ${audience}
Format: ${format}
Maximum length: ${maxLength} characters

Here are the insights:
${insights.map((insight, i) => `
Insight ${i + 1}:
Title: ${insight.title}
Description: ${insight.description}
Confidence: ${insight.confidence}
Impact: ${insight.impact}
Category: ${insight.category}
Tags: ${insight.tags?.join(', ') || 'none'}
`).join('\n')}

Please create a summary that:
1. Highlights the most important findings (prioritize by impact and confidence)
2. Groups related insights together thematically
3. Presents the information in a way that's appropriate for the ${audience} audience
4. Uses the ${format} format
5. Stays under ${maxLength} characters
6. Includes actionable recommendations based on the insights
`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert at communicating data insights to ${audience} audiences. Your summaries are clear, concise, and actionable.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: Math.min(Math.ceil(maxLength / 3), 1500),
    });
    
    return response.choices[0].message.content;
    
  } catch (error) {
    // Log error
    await storage.createSystemLog({
      type: "error",
      message: `Insight Summarization Failed`,
      details: error instanceof Error ? error.message : String(error),
      severity: 2,
      component: "OpenAI Analyzer"
    });
    
    throw error;
  }
}

/**
 * Create a prompt for dataset analysis based on the request
 */
function createAnalysisPrompt(
  dataset: Dataset,
  columns: any[],
  request: DatasetAnalysisRequest
): string {
  const options = request.options || {};
  
  let prompt = `
I'd like you to analyze this dataset: "${dataset.name}"
Description: ${dataset.description || 'No description provided'}
Format: ${dataset.format}
Size: ${formatBytes(dataset.size || 0)}
Row count: ${dataset.rowCount || 'Unknown'}
Column count: ${dataset.columnCount || columns.length}

Columns:
${columns.map(col => `- ${col.name} (${col.dataType})${col.description ? `: ${col.description}` : ''}`).join('\n')}

Analysis type: ${request.analysisType}
`;

  if (options.focusColumns && options.focusColumns.length > 0) {
    prompt += `\nFocus on these columns: ${options.focusColumns.join(', ')}`;
  }

  if (options.timeRange) {
    prompt += `\nTime range: from ${options.timeRange.start} to ${options.timeRange.end}`;
  }

  prompt += `
Please provide:
1. 3-8 key insights from the data
2. Statistical metrics that support your insights
3. Suggestions for visualizations to represent these insights
${options.includeVisualizations ? '4. Configuration data for the visualizations' : ''}

Format your response as JSON with this structure:
{
  "insights": [
    {
      "title": "string",
      "description": "string", 
      "confidence": number,
      "impact": number,
      "category": "string",
      "tags": ["string"]
    }
  ],
  "metrics": {
    // Key statistical metrics
  },
  "visualizationConfig": {
    // Visualization configuration
  },
  "rawResults": {
    // Raw analysis results
  }
}

The confidence score should be between 0 and 1, indicating your confidence in the insight.
The impact score should be between 1 and 10, indicating the potential business impact.
`;

  if (request.analysisType === 'trends') {
    prompt += "\nFor trend analysis, focus on patterns over time and seasonality.";
  } else if (request.analysisType === 'anomalies') {
    prompt += "\nFor anomaly analysis, identify outliers and unusual patterns in the data.";
  } else if (request.analysisType === 'correlations') {
    prompt += "\nFor correlation analysis, identify relationships between different variables.";
  } else if (request.analysisType === 'clustering') {
    prompt += "\nFor clustering analysis, identify natural groupings in the data.";
  } else if (request.analysisType === 'comprehensive') {
    prompt += "\nFor comprehensive analysis, provide a holistic view including trends, anomalies, correlations, and segments.";
  }

  return prompt;
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}