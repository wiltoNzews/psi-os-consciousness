var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import OpenAI from "openai";
import { storage } from "../storage.js";
// Initialize OpenAI client
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
var MODEL = "gpt-4o";
/**
 * Analyze a dataset using OpenAI
 *
 * This function sends dataset information to OpenAI and returns
 * structured insights and analysis results.
 */
export function analyzeDataset(request) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, dataset, columns, prompt_1, response, content, parsedContent, analysisResult, insights, _i, _a, insightData, insight, executionTime, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startTime = Date.now();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 11, , 13]);
                    return [4 /*yield*/, storage.getDataset(request.datasetId)];
                case 2:
                    dataset = _b.sent();
                    if (!dataset) {
                        throw new Error("Dataset with ID ".concat(request.datasetId, " not found"));
                    }
                    return [4 /*yield*/, storage.getDatasetColumns(request.datasetId)];
                case 3:
                    columns = _b.sent();
                    prompt_1 = createAnalysisPrompt(dataset, columns, request);
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: MODEL,
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an expert data analyst who provides concise, actionable insights from data. Your insights should be clear, specific, and high-impact. Focus on statistical validity and practical business value. Format your response as JSON."
                                },
                                {
                                    role: "user",
                                    content: prompt_1
                                }
                            ],
                            response_format: { type: "json_object" },
                            temperature: 0.2,
                        })];
                case 4:
                    response = _b.sent();
                    content = response.choices[0].message.content;
                    parsedContent = JSON.parse(content);
                    return [4 /*yield*/, storage.createAnalysisResult({
                            name: "".concat(request.analysisType.charAt(0).toUpperCase() + request.analysisType.slice(1), " Analysis of ").concat(dataset.name),
                            description: "Automated ".concat(request.analysisType, " analysis of dataset ").concat(dataset.name),
                            datasetId: dataset.id,
                            createdBy: request.userId,
                            results: parsedContent.rawResults || {},
                            metrics: parsedContent.metrics || {},
                            status: "completed",
                            visualizationConfig: parsedContent.visualizationConfig || {}
                        })];
                case 5:
                    analysisResult = _b.sent();
                    insights = [];
                    _i = 0, _a = parsedContent.insights;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    insightData = _a[_i];
                    return [4 /*yield*/, storage.createInsight({
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
                        })];
                case 7:
                    insight = _b.sent();
                    insights.push(insight);
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    executionTime = Date.now() - startTime;
                    // Log successful analysis
                    return [4 /*yield*/, storage.createSystemLog({
                            type: "success",
                            message: "Dataset Analysis Completed: ".concat(dataset.name),
                            details: "Successfully analyzed dataset ".concat(dataset.name, " (ID: ").concat(dataset.id, ") using ").concat(request.analysisType, " analysis. Generated ").concat(insights.length, " insights."),
                            severity: 1,
                            component: "OpenAI Analyzer"
                        })];
                case 10:
                    // Log successful analysis
                    _b.sent();
                    return [2 /*return*/, {
                            insights: insights,
                            analysisResult: analysisResult,
                            visualizationConfig: parsedContent.visualizationConfig,
                            executionTime: executionTime
                        }];
                case 11:
                    error_1 = _b.sent();
                    // Log error
                    return [4 /*yield*/, storage.createSystemLog({
                            type: "error",
                            message: "Dataset Analysis Failed",
                            details: error_1 instanceof Error ? error_1.message : String(error_1),
                            severity: 3,
                            component: "OpenAI Analyzer"
                        })];
                case 12:
                    // Log error
                    _b.sent();
                    throw error_1;
                case 13: return [2 /*return*/];
            }
        });
    });
}
/**
 * Analyze a specific analysis result to generate more insights
 */
export function analyzeResult(analysisResultId, userId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var analysisResult, dataset, prompt_2, response, content, parsedContent, insights, _i, _a, insightData, insight, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 11]);
                    return [4 /*yield*/, storage.getAnalysisResult(analysisResultId)];
                case 1:
                    analysisResult = _b.sent();
                    if (!analysisResult) {
                        throw new Error("Analysis result with ID ".concat(analysisResultId, " not found"));
                    }
                    return [4 /*yield*/, storage.getDataset(analysisResult.datasetId)];
                case 2:
                    dataset = _b.sent();
                    if (!dataset) {
                        throw new Error("Dataset with ID ".concat(analysisResult.datasetId, " not found"));
                    }
                    prompt_2 = "\nI have an analysis result that I'd like you to examine more deeply.\nAnalysis name: ".concat(analysisResult.name, "\nDescription: ").concat(analysisResult.description, "\nDataset: ").concat(dataset.name, " (").concat(dataset.description || 'No description', ")\n\nThe raw analysis results are: ").concat(JSON.stringify(analysisResult.results), "\n").concat((options === null || options === void 0 ? void 0 : options.focusArea) ? "Please focus specifically on: ".concat(options.focusArea) : '', "\n").concat((options === null || options === void 0 ? void 0 : options.deepDive) ? 'Please provide a deep dive analysis with detailed statistical reasoning.' : 'Please provide concise, actionable insights.', "\n\nPlease generate 3-5 additional insights beyond what might be obvious from the initial analysis.\nFor each insight provide:\n1. A brief title (under 100 characters)\n2. A detailed description (under 500 characters)\n3. A confidence score (0.0-1.0)\n4. An impact score (1-10)\n5. A business category\n6. Relevant tags (2-5 keywords)\n\nFormat your response as JSON with this structure:\n{\n  \"insights\": [\n    {\n      \"title\": \"string\",\n      \"description\": \"string\", \n      \"confidence\": number,\n      \"impact\": number,\n      \"category\": \"string\",\n      \"tags\": [\"string\"]\n    }\n  ]\n}\n");
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: MODEL,
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an expert data analyst who provides concise, actionable insights from data. Your insights should be clear, specific, and high-impact. Focus on statistical validity and practical business value. Format your response as JSON."
                                },
                                {
                                    role: "user",
                                    content: prompt_2
                                }
                            ],
                            response_format: { type: "json_object" },
                            temperature: 0.3,
                        })];
                case 3:
                    response = _b.sent();
                    content = response.choices[0].message.content;
                    parsedContent = JSON.parse(content);
                    insights = [];
                    _i = 0, _a = parsedContent.insights;
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    insightData = _a[_i];
                    // Apply confidence threshold if specified
                    if ((options === null || options === void 0 ? void 0 : options.confidenceThreshold) && insightData.confidence < options.confidenceThreshold) {
                        return [3 /*break*/, 6];
                    }
                    return [4 /*yield*/, storage.createInsight({
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
                        })];
                case 5:
                    insight = _b.sent();
                    insights.push(insight);
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: 
                // Log success
                return [4 /*yield*/, storage.createSystemLog({
                        type: "success",
                        message: "Analysis Deep Dive Completed",
                        details: "Generated ".concat(insights.length, " additional insights for analysis result ").concat(analysisResult.name, " (ID: ").concat(analysisResult.id, ")."),
                        severity: 1,
                        component: "OpenAI Analyzer"
                    })];
                case 8:
                    // Log success
                    _b.sent();
                    return [2 /*return*/, insights];
                case 9:
                    error_2 = _b.sent();
                    // Log error
                    return [4 /*yield*/, storage.createSystemLog({
                            type: "error",
                            message: "Analysis Deep Dive Failed",
                            details: error_2 instanceof Error ? error_2.message : String(error_2),
                            severity: 3,
                            component: "OpenAI Analyzer"
                        })];
                case 10:
                    // Log error
                    _b.sent();
                    throw error_2;
                case 11: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create a natural language summary of insights
 */
export function summarizeInsights(insightIds, options) {
    return __awaiter(this, void 0, void 0, function () {
        var insights, _i, insightIds_1, id, insight, datasetName, dataset, audience, format, maxLength, prompt_3, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 10]);
                    insights = [];
                    _i = 0, insightIds_1 = insightIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < insightIds_1.length)) return [3 /*break*/, 4];
                    id = insightIds_1[_i];
                    return [4 /*yield*/, storage.getInsight(id)];
                case 2:
                    insight = _a.sent();
                    if (insight) {
                        insights.push(insight);
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (insights.length === 0) {
                        throw new Error("No valid insights found with the provided IDs");
                    }
                    datasetName = "dataset";
                    if (!insights[0].datasetId) return [3 /*break*/, 6];
                    return [4 /*yield*/, storage.getDataset(insights[0].datasetId)];
                case 5:
                    dataset = _a.sent();
                    if (dataset) {
                        datasetName = dataset.name;
                    }
                    _a.label = 6;
                case 6:
                    audience = (options === null || options === void 0 ? void 0 : options.audience) || 'executive';
                    format = (options === null || options === void 0 ? void 0 : options.format) || 'narrative';
                    maxLength = (options === null || options === void 0 ? void 0 : options.maxLength) || 1500;
                    prompt_3 = "\nI have a set of data insights that I'd like you to summarize in a coherent way.\nDataset: ".concat(datasetName, "\nAudience: ").concat(audience, "\nFormat: ").concat(format, "\nMaximum length: ").concat(maxLength, " characters\n\nHere are the insights:\n").concat(insights.map(function (insight, i) {
                        var _a;
                        return "\nInsight ".concat(i + 1, ":\nTitle: ").concat(insight.title, "\nDescription: ").concat(insight.description, "\nConfidence: ").concat(insight.confidence, "\nImpact: ").concat(insight.impact, "\nCategory: ").concat(insight.category, "\nTags: ").concat(((_a = insight.tags) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'none', "\n");
                    }).join('\n'), "\n\nPlease create a summary that:\n1. Highlights the most important findings (prioritize by impact and confidence)\n2. Groups related insights together thematically\n3. Presents the information in a way that's appropriate for the ").concat(audience, " audience\n4. Uses the ").concat(format, " format\n5. Stays under ").concat(maxLength, " characters\n6. Includes actionable recommendations based on the insights\n");
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: MODEL,
                            messages: [
                                {
                                    role: "system",
                                    content: "You are an expert at communicating data insights to ".concat(audience, " audiences. Your summaries are clear, concise, and actionable.")
                                },
                                {
                                    role: "user",
                                    content: prompt_3
                                }
                            ],
                            temperature: 0.5,
                            max_tokens: Math.min(Math.ceil(maxLength / 3), 1500),
                        })];
                case 7:
                    response = _a.sent();
                    return [2 /*return*/, response.choices[0].message.content];
                case 8:
                    error_3 = _a.sent();
                    // Log error
                    return [4 /*yield*/, storage.createSystemLog({
                            type: "error",
                            message: "Insight Summarization Failed",
                            details: error_3 instanceof Error ? error_3.message : String(error_3),
                            severity: 2,
                            component: "OpenAI Analyzer"
                        })];
                case 9:
                    // Log error
                    _a.sent();
                    throw error_3;
                case 10: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create a prompt for dataset analysis based on the request
 */
function createAnalysisPrompt(dataset, columns, request) {
    var options = request.options || {};
    var prompt = "\nI'd like you to analyze this dataset: \"".concat(dataset.name, "\"\nDescription: ").concat(dataset.description || 'No description provided', "\nFormat: ").concat(dataset.format, "\nSize: ").concat(formatBytes(dataset.size || 0), "\nRow count: ").concat(dataset.rowCount || 'Unknown', "\nColumn count: ").concat(dataset.columnCount || columns.length, "\n\nColumns:\n").concat(columns.map(function (col) { return "- ".concat(col.name, " (").concat(col.dataType, ")").concat(col.description ? ": ".concat(col.description) : ''); }).join('\n'), "\n\nAnalysis type: ").concat(request.analysisType, "\n");
    if (options.focusColumns && options.focusColumns.length > 0) {
        prompt += "\nFocus on these columns: ".concat(options.focusColumns.join(', '));
    }
    if (options.timeRange) {
        prompt += "\nTime range: from ".concat(options.timeRange.start, " to ").concat(options.timeRange.end);
    }
    prompt += "\nPlease provide:\n1. 3-8 key insights from the data\n2. Statistical metrics that support your insights\n3. Suggestions for visualizations to represent these insights\n".concat(options.includeVisualizations ? '4. Configuration data for the visualizations' : '', "\n\nFormat your response as JSON with this structure:\n{\n  \"insights\": [\n    {\n      \"title\": \"string\",\n      \"description\": \"string\", \n      \"confidence\": number,\n      \"impact\": number,\n      \"category\": \"string\",\n      \"tags\": [\"string\"]\n    }\n  ],\n  \"metrics\": {\n    // Key statistical metrics\n  },\n  \"visualizationConfig\": {\n    // Visualization configuration\n  },\n  \"rawResults\": {\n    // Raw analysis results\n  }\n}\n\nThe confidence score should be between 0 and 1, indicating your confidence in the insight.\nThe impact score should be between 1 and 10, indicating the potential business impact.\n");
    if (request.analysisType === 'trends') {
        prompt += "\nFor trend analysis, focus on patterns over time and seasonality.";
    }
    else if (request.analysisType === 'anomalies') {
        prompt += "\nFor anomaly analysis, identify outliers and unusual patterns in the data.";
    }
    else if (request.analysisType === 'correlations') {
        prompt += "\nFor correlation analysis, identify relationships between different variables.";
    }
    else if (request.analysisType === 'clustering') {
        prompt += "\nFor clustering analysis, identify natural groupings in the data.";
    }
    else if (request.analysisType === 'comprehensive') {
        prompt += "\nFor comprehensive analysis, provide a holistic view including trends, anomalies, correlations, and segments.";
    }
    return prompt;
}
/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes, decimals) {
    if (decimals === void 0) { decimals = 2; }
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var dm = decimals < 0 ? 0 : decimals;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
