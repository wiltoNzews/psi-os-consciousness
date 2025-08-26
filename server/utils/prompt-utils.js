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
 * Format a prompt using the PREFIX/SUFFIX system
 *
 * @param prefix The PREFIX structure
 * @param task The main task/message content
 * @param suffix The SUFFIX structure
 * @returns Formatted prompt string
 */
export function formatPrompt(prefix, task, suffix) {
    var timestamp = new Date().toISOString();
    // Format PREFIX
    var prefixStr = [
        "[LEVEL/DIMENSION: ".concat(prefix.levelDimension, "]"),
        "[OBJECTIVE: ".concat(prefix.objective, "]"),
        "[CONTEXT: ".concat(prefix.context, "]"),
        "[MODEL/AGENT: ".concat(prefix.modelAgent, "]"),
        "[DEPTH REQUIRED: ".concat(prefix.depthRequired, "]"),
        "[INPUT DATA TYPE: ".concat(prefix.inputDataType, "]"),
        "[DOMAIN: ".concat(prefix.domain, "]")
    ].join('\n');
    // Format SUFFIX
    var suffixStr = [
        "[ACTIONABLE NEXT STEPS: ".concat(suffix.actionableNextSteps.map(function (step, i) { return "".concat(i + 1, ". ").concat(step); }).join(', '), "]"),
        "[NEXT AGENT ROUTING: ".concat(suffix.nextAgentRouting, "]"),
        "[OUTPUT REQUIREMENTS: ".concat(suffix.outputRequirements, "]"),
        "[FLOW METRICS: ".concat(suffix.flowMetrics, "]"),
        "[TIMESTAMP/CHECKPOINT: ".concat(suffix.timestampCheckpoint || timestamp, "]"),
        "[CONFIDENCE LEVEL: ".concat(suffix.confidenceLevel, "]"),
        "[RESOURCES USED: ".concat(suffix.resourcesUsed.join(', '), "]")
    ].join('\n');
    return "".concat(prefixStr, "\n\n").concat(task, "\n\n").concat(suffixStr);
}
/**
 * Parse a formatted prompt into its components
 *
 * @param prompt The formatted prompt string
 * @returns Object containing prefix, task, and suffix
 */
export function parsePrompt(prompt) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var lines = prompt.split('\n');
    var prefix = {};
    var suffix = {};
    var task = '';
    var currentSection = 'prefix';
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.trim() === '') {
            if (currentSection === 'prefix') {
                currentSection = 'task';
                continue;
            }
            else if (currentSection === 'task') {
                currentSection = 'suffix';
                continue;
            }
        }
        if (currentSection === 'prefix') {
            if (line.startsWith('[LEVEL/DIMENSION:')) {
                prefix.levelDimension = (_a = line.match(/\[LEVEL\/DIMENSION: (.*?)\]/)) === null || _a === void 0 ? void 0 : _a[1];
            }
            else if (line.startsWith('[OBJECTIVE:')) {
                prefix.objective = ((_b = line.match(/\[OBJECTIVE: (.*?)\]/)) === null || _b === void 0 ? void 0 : _b[1]) || '';
            }
            else if (line.startsWith('[CONTEXT:')) {
                prefix.context = ((_c = line.match(/\[CONTEXT: (.*?)\]/)) === null || _c === void 0 ? void 0 : _c[1]) || '';
            }
            else if (line.startsWith('[MODEL/AGENT:')) {
                prefix.modelAgent = (_d = line.match(/\[MODEL\/AGENT: (.*?)\]/)) === null || _d === void 0 ? void 0 : _d[1];
            }
            else if (line.startsWith('[DEPTH REQUIRED:')) {
                prefix.depthRequired = ((_e = line.match(/\[DEPTH REQUIRED: (.*?)\]/)) === null || _e === void 0 ? void 0 : _e[1]) || '';
            }
            else if (line.startsWith('[INPUT DATA TYPE:')) {
                prefix.inputDataType = (_f = line.match(/\[INPUT DATA TYPE: (.*?)\]/)) === null || _f === void 0 ? void 0 : _f[1];
            }
            else if (line.startsWith('[DOMAIN:')) {
                prefix.domain = ((_g = line.match(/\[DOMAIN: (.*?)\]/)) === null || _g === void 0 ? void 0 : _g[1]) || '';
            }
        }
        else if (currentSection === 'task') {
            task += line + '\n';
        }
        else if (currentSection === 'suffix') {
            if (line.startsWith('[ACTIONABLE NEXT STEPS:')) {
                var steps = ((_h = line.match(/\[ACTIONABLE NEXT STEPS: (.*?)\]/)) === null || _h === void 0 ? void 0 : _h[1]) || '';
                suffix.actionableNextSteps = steps.split(', ').map(function (step) {
                    // Remove numbering prefix if present
                    return step.replace(/^\d+\.\s*/, '');
                });
            }
            else if (line.startsWith('[NEXT AGENT ROUTING:')) {
                suffix.nextAgentRouting = (_j = line.match(/\[NEXT AGENT ROUTING: (.*?)\]/)) === null || _j === void 0 ? void 0 : _j[1];
            }
            else if (line.startsWith('[OUTPUT REQUIREMENTS:')) {
                suffix.outputRequirements = ((_k = line.match(/\[OUTPUT REQUIREMENTS: (.*?)\]/)) === null || _k === void 0 ? void 0 : _k[1]) || '';
            }
            else if (line.startsWith('[FLOW METRICS:')) {
                suffix.flowMetrics = (_l = line.match(/\[FLOW METRICS: (.*?)\]/)) === null || _l === void 0 ? void 0 : _l[1];
            }
            else if (line.startsWith('[TIMESTAMP/CHECKPOINT:')) {
                suffix.timestampCheckpoint = ((_m = line.match(/\[TIMESTAMP\/CHECKPOINT: (.*?)\]/)) === null || _m === void 0 ? void 0 : _m[1]) || '';
            }
            else if (line.startsWith('[CONFIDENCE LEVEL:')) {
                suffix.confidenceLevel = (_o = line.match(/\[CONFIDENCE LEVEL: (.*?)\]/)) === null || _o === void 0 ? void 0 : _o[1];
            }
            else if (line.startsWith('[RESOURCES USED:')) {
                var resources = ((_p = line.match(/\[RESOURCES USED: (.*?)\]/)) === null || _p === void 0 ? void 0 : _p[1]) || '';
                suffix.resourcesUsed = resources.split(', ').filter(function (r) { return r.trim(); });
            }
        }
    }
    return {
        prefix: prefix,
        task: task.trim(),
        suffix: suffix
    };
}
/**
 * Format a Thought Transfer Protocol (TTP) message
 *
 * @param ttpMessage The TTP message to format
 * @returns Formatted TTP message string
 */
export function formatTTPMessage(ttpMessage) {
    var message = "FROM: ".concat(ttpMessage.from, "\n");
    message += "TO: ".concat(ttpMessage.to, "\n\n");
    message += "CONTEXT DESCRIPTION: ".concat(ttpMessage.contextDescription, "\n\n");
    message += 'DECISIONS MADE:\n';
    ttpMessage.decisionsMade.forEach(function (decision) {
        message += "- Selected \"".concat(decision.decision, "\" over alternatives: ").concat(decision.alternatives.join(', '), "\n");
        message += "  Reasoning: ".concat(decision.reasoning, "\n");
    });
    message += '\n';
    message += 'METRICS:\n';
    ttpMessage.metrics.forEach(function (metric) {
        message += "- ".concat(metric.type, ": ").concat(metric.source, " = ").concat(metric.value, "\n");
    });
    message += '\n';
    message += 'METADATA:\n';
    Object.entries(ttpMessage.metadata).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        message += "- ".concat(key, ": ").concat(typeof value === 'object' ? JSON.stringify(value) : value, "\n");
    });
    message += '\n';
    message += "NEXT DECOHERE NEEDED: ".concat(ttpMessage.nextDecohere.description, "\n");
    message += 'Options:\n';
    ttpMessage.nextDecohere.options.forEach(function (option) {
        message += "- \"".concat(option, "\"\n");
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
export function parseTTPMessage(message) {
    var _a, _b;
    var result = {
        decisionsMade: [],
        metrics: [],
        metadata: {}
    };
    var lines = message.split('\n');
    var currentSection = '';
    var content = '';
    var contentStarted = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (contentStarted) {
            content += line + '\n';
            continue;
        }
        if (line.startsWith('FROM:')) {
            result.from = line.replace('FROM:', '').trim();
        }
        else if (line.startsWith('TO:')) {
            result.to = line.replace('TO:', '').trim();
        }
        else if (line.startsWith('CONTEXT DESCRIPTION:')) {
            result.contextDescription = line.replace('CONTEXT DESCRIPTION:', '').trim();
        }
        else if (line.startsWith('DECISIONS MADE:')) {
            currentSection = 'decisions';
        }
        else if (line.startsWith('METRICS:')) {
            currentSection = 'metrics';
        }
        else if (line.startsWith('METADATA:')) {
            currentSection = 'metadata';
        }
        else if (line.startsWith('NEXT DECOHERE NEEDED:')) {
            result.nextDecohere = {
                description: line.replace('NEXT DECOHERE NEEDED:', '').trim(),
                options: []
            };
            currentSection = 'decohere';
        }
        else if (line.trim() === '' && currentSection === 'decohere' && i < lines.length - 1) {
            contentStarted = true;
        }
        else if (currentSection === 'decisions' && line.trim().startsWith('-')) {
            var decision = line.replace('-', '').trim();
            var decisionMatch = decision.match(/Selected "([^"]+)" over alternatives: (.*)/);
            if (decisionMatch) {
                var alternatives = decisionMatch[2].split(',').map(function (a) { return a.trim(); });
                // Look ahead for reasoning on the next line
                var reasoningLine = lines[i + 1] || '';
                var reasoning = reasoningLine.trim().startsWith('Reasoning:')
                    ? reasoningLine.replace('Reasoning:', '').trim()
                    : '';
                (_a = result.decisionsMade) === null || _a === void 0 ? void 0 : _a.push({
                    decision: decisionMatch[1],
                    alternatives: alternatives,
                    reasoning: reasoning
                });
                if (reasoning)
                    i++; // Skip reasoning line
            }
        }
        else if (currentSection === 'metrics' && line.trim().startsWith('-')) {
            var metricMatch = line.match(/- (FLOW|ANTIFLOW|PARTIAL_FLOW): (\w+) = (\d+)/);
            if (metricMatch) {
                (_b = result.metrics) === null || _b === void 0 ? void 0 : _b.push({
                    type: metricMatch[1],
                    source: metricMatch[2],
                    value: parseInt(metricMatch[3]),
                    metadata: {}
                });
            }
        }
        else if (currentSection === 'metadata' && line.trim().startsWith('-')) {
            var metadataMatch = line.match(/- ([^:]+): (.*)/);
            if (metadataMatch && result.metadata) {
                result.metadata[metadataMatch[1]] = metadataMatch[2];
            }
        }
        else if (currentSection === 'decohere' && line.trim().startsWith('-')) {
            var optionMatch = line.match(/- "([^"]+)"/);
            if (optionMatch && result.nextDecohere) {
                result.nextDecohere.options.push(optionMatch[1]);
            }
        }
    }
    result.content = content.trim();
    return result;
}
/**
 * Create a standardized prompt for a specific use case (helper function)
 *
 * @param useCase The specific use case ('implementation', 'review', 'analysis', etc.)
 * @param params Custom parameters for the prompt
 * @returns Formatted prompt string
 */
export function createPromptForUseCase(useCase, params) {
    // Define default values based on use case
    var defaults = {
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
    var prefix = {
        levelDimension: defaults[useCase].levelDimension,
        objective: params.objective,
        context: params.context,
        modelAgent: params.agent,
        depthRequired: defaults[useCase].depthRequired,
        inputDataType: defaults[useCase].inputDataType,
        domain: params.domain
    };
    var suffix = {
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
export function createTTPMessage(fromAgent, toAgent, contextDescription, content, decisionsMade, nextDecohere, metadata) {
    if (metadata === void 0) { metadata = {}; }
    var ttpMessage = {
        from: fromAgent,
        to: toAgent,
        contextDescription: contextDescription,
        decisionsMade: decisionsMade,
        metrics: [
            {
                type: 'FLOW',
                source: 'agent_handoff',
                value: 100,
                metadata: { from: fromAgent, to: toAgent }
            }
        ],
        metadata: metadata,
        nextDecohere: nextDecohere,
        content: content
    };
    return formatTTPMessage(ttpMessage);
}
