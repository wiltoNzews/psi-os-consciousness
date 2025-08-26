/**
 * Orchestrate - Advanced Code Transformation Utility
 * 
 * This module provides a comprehensive codebase-wide transformation utility
 * using jscodeshift to standardize and fix structural patterns throughout the codebase.
 * It implements the TSAR BOMBA approach for system-wide sweeps.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * code transformation rules and the codebase, acting as the "Level 1" orchestrator
 * in the fractal architecture.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { API, FileInfo } from 'jscodeshift';
import { MetaCognitiveEventBuilder } from '../services/utils/MetaCognitiveEventBuilder.js';
import { DateTransformer } from '../services/utils/DateTransformer.js';
import { MetaCognitiveEventUtility } from '../services/utils/MetaCognitiveEventUtility.js';
import fs from 'fs';
import path from 'path';

// Event logging for traceability
const logEvent = (message: string): void => {
  const timestamp = DateTransformer.formatForDisplay(new Date());
  const logMessage = `[${timestamp}] 🔗 ${message}`;
  console.log(logMessage);
  
  // Append to events.txt log
  const eventsLogPath = path.join(process.cwd(), 'events.txt');
  fs.appendFileSync(eventsLogPath, logMessage + '\n');
};

/**
 * Transform metaCognitiveEngine.processEvent calls
 * 
 * This transform standardizes all calls to processEvent, ensuring they use 
 * the MetaCognitiveEventBuilder to create properly formatted events.
 */
export function transformProcessEventCalls(fileInfo: FileInfo, api: API) {
  logEvent('🚏 LEVEL 1: Sweep Initiated - Transforming processEvent calls');
  
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let modified = false;
  
  // Find all processEvent calls on metaCognitiveEngine
  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { name: 'metaCognitiveEngine' },
      property: { name: 'processEvent' }
    }
  }).forEach(path => {
    const args = path.node.arguments;
    if (args.length === 0) return;
    
    modified = true;
    
    // Determine the event type and details based on the argument pattern
    let eventCreation;
    const arg = args[0];
    
    if (j.ArrayExpression.check(arg)) {
      // Handle array arguments [source, operation]
      const elements = arg.elements.map(e => 
        j.isLiteral(e) ? e.value : 'unknown'
      );
      
      const source = elements[0] || 'unknown';
      const operation = elements[1] || 'unknown';
      
      eventCreation = j.callExpression(
        j.memberExpression(
          j.identifier('MetaCognitiveEventBuilder'),
          j.identifier('fromSourceOperation')
        ),
        [
          j.literal(source),
          j.literal(operation),
          j.objectExpression([])
        ]
      );
    } else if (j.ObjectExpression.check(arg)) {
      // Handle object arguments {source, operation, ...}
      const props = {};
      let source = 'unknown';
      let operation = 'unknown';
      
      arg.properties.forEach(prop => {
        if (j.isProperty(prop) && j.isIdentifier(prop.key)) {
          if (prop.key.name === 'source' && j.isLiteral(prop.value)) {
            source = prop.value.value;
          } else if (prop.key.name === 'operation' && j.isLiteral(prop.value)) {
            operation = prop.value.value;
          }
        }
      });
      
      eventCreation = j.callExpression(
        j.memberExpression(
          j.identifier('MetaCognitiveEventBuilder'),
          j.identifier('fromSourceOperation')
        ),
        [
          j.literal(source),
          j.literal(operation),
          j.objectExpression([])
        ]
      );
    } else if (j.StringLiteral.check(arg) || j.Literal.check(arg)) {
      // Handle direct string arguments
      const eventType = arg.value;
      
      eventCreation = j.callExpression(
        j.memberExpression(
          j.identifier('MetaCognitiveEventBuilder'),
          j.identifier('create')
        ),
        [
          j.objectExpression([
            j.property('init', j.identifier('type'), j.literal(eventType)),
            j.property('init', j.identifier('description'), j.literal(`Event: ${eventType}`)),
          ])
        ]
      );
    } else {
      // For complex expressions or variables, import and use MetaCognitiveEventUtility
      eventCreation = j.callExpression(
        j.memberExpression(
          j.identifier('MetaCognitiveEventUtility'),
          j.identifier('normalizeEvent')
        ),
        [arg]
      );
    }
    
    // Replace the processEvent call with standardized version
    j(path).replaceWith(
      j.callExpression(
        j.memberExpression(
          j.identifier('metaCognitiveEngine'),
          j.identifier('processEvent')
        ),
        [eventCreation]
      )
    );
  });
  
  // Add necessary imports if file was modified
  if (modified) {
    const importDeclarations = root.find(j.ImportDeclaration);
    const hasMetaCognitiveEventBuilder = root.find(j.ImportDeclaration, {
      source: { value: '../services/utils/MetaCognitiveEventBuilder.js' }
    }).size() > 0;
    
    const hasMetaCognitiveEventUtility = root.find(j.ImportDeclaration, {
      source: { value: '../services/utils/MetaCognitiveEventUtility.js' }
    }).size() > 0;
    
    if (!hasMetaCognitiveEventBuilder) {
      const importStatement = j.importDeclaration(
        [j.importSpecifier(j.identifier('MetaCognitiveEventBuilder'))],
        j.literal('../services/utils/MetaCognitiveEventBuilder.js')
      );
      
      if (importDeclarations.size() > 0) {
        j(importDeclarations.at(importDeclarations.size() - 1).get()).insertAfter(importStatement);
      } else {
        root.get().node.program.body.unshift(importStatement);
      }
    }
    
    if (!hasMetaCognitiveEventUtility) {
      const importStatement = j.importDeclaration(
        [j.importSpecifier(j.identifier('MetaCognitiveEventUtility'))],
        j.literal('../services/utils/MetaCognitiveEventUtility.js')
      );
      
      if (importDeclarations.size() > 0) {
        j(importDeclarations.at(importDeclarations.size() - 1).get()).insertAfter(importStatement);
      } else {
        root.get().node.program.body.unshift(importStatement);
      }
    }
    
    logEvent('🚏 LEVEL 2: Fixes Applied - Standardized processEvent calls in ' + fileInfo.path);
  }
  
  return modified ? root.toSource() : fileInfo.source;
}

/**
 * Transform date creation to use DateTransformer
 */
export function transformDateCreation(fileInfo: FileInfo, api: API) {
  logEvent('🚏 LEVEL 1: Sweep Initiated - Transforming date creation');
  
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let modified = false;
  
  // Find all direct new Date() calls
  root.find(j.NewExpression, {
    callee: { name: 'Date' },
    arguments: args => args.length === 0
  }).forEach(path => {
    modified = true;
    
    // Replace with DateTransformer.createDate()
    j(path).replaceWith(
      j.callExpression(
        j.memberExpression(
          j.identifier('DateTransformer'),
          j.identifier('createDate')
        ),
        []
      )
    );
  });
  
  // Add necessary imports if file was modified
  if (modified) {
    const importDeclarations = root.find(j.ImportDeclaration);
    const hasDateTransformer = root.find(j.ImportDeclaration, {
      source: { value: '../services/utils/DateTransformer.js' }
    }).size() > 0;
    
    if (!hasDateTransformer) {
      const importStatement = j.importDeclaration(
        [j.importSpecifier(j.identifier('DateTransformer'))],
        j.literal('../services/utils/DateTransformer.js')
      );
      
      if (importDeclarations.size() > 0) {
        j(importDeclarations.at(importDeclarations.size() - 1).get()).insertAfter(importStatement);
      } else {
        root.get().node.program.body.unshift(importStatement);
      }
    }
    
    logEvent('🚏 LEVEL 2: Fixes Applied - Standardized date creation in ' + fileInfo.path);
  }
  
  return modified ? root.toSource() : fileInfo.source;
}

/**
 * Transform property naming (eventType → type, timestamp → createdAt, confidenceLevel → confidence)
 */
export function transformPropertyNaming(fileInfo: FileInfo, api: API) {
  logEvent('🚏 LEVEL 1: Sweep Initiated - Transforming property naming');
  
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let modified = false;
  
  // Property name mappings
  const propertyMappings = {
    'eventType': 'type',
    'timestamp': 'createdAt',
    'confidenceLevel': 'confidence'
  };
  
  // Transform property accesses (obj.oldName → obj.newName)
  Object.entries(propertyMappings).forEach(([oldName, newName]) => {
    root.find(j.MemberExpression, {
      property: { name: oldName }
    }).forEach(path => {
      modified = true;
      j(path.get('property')).replaceWith(j.identifier(newName));
    });
    
    // Transform object literals ({ oldName: value } → { newName: value })
    root.find(j.Property, {
      key: { name: oldName }
    }).forEach(path => {
      modified = true;
      j(path.get('key')).replaceWith(j.identifier(newName));
    });
  });
  
  if (modified) {
    // Add boundary awareness comment
    const comments = root.find(j.Comment);
    if (comments.size() > 0) {
      const boundaryComment = j.commentBlock(
        `* BOUNDARY AWARENESS: This file has been standardized with property naming conventions
 * - eventType → type
 * - timestamp → createdAt
 * - confidenceLevel → confidence
 */`
      );
      j(comments.at(0).get()).insertBefore(boundaryComment);
    }
    
    logEvent('🚏 LEVEL 2: Fixes Applied - Standardized property naming in ' + fileInfo.path);
  }
  
  return modified ? root.toSource() : fileInfo.source;
}

/**
 * Transform JSON.stringify and JSON.parse to use DateTransformer
 */
export function transformJsonHandling(fileInfo: FileInfo, api: API) {
  logEvent('🚏 LEVEL 1: Sweep Initiated - Transforming JSON handling');
  
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let modified = false;
  
  // Find and transform JSON.stringify calls
  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { name: 'JSON' },
      property: { name: 'stringify' }
    }
  }).forEach(path => {
    modified = true;
    
    // Replace with DateTransformer.stringifyWithDates()
    j(path).replaceWith(
      j.callExpression(
        j.memberExpression(
          j.identifier('DateTransformer'),
          j.identifier('stringifyWithDates')
        ),
        path.node.arguments
      )
    );
  });
  
  // Find and transform JSON.parse calls
  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { name: 'JSON' },
      property: { name: 'parse' }
    }
  }).forEach(path => {
    modified = true;
    
    // Replace with DateTransformer.parseWithDates()
    j(path).replaceWith(
      j.callExpression(
        j.memberExpression(
          j.identifier('DateTransformer'),
          j.identifier('parseWithDates')
        ),
        path.node.arguments
      )
    );
  });
  
  // Add necessary imports if file was modified
  if (modified) {
    const importDeclarations = root.find(j.ImportDeclaration);
    const hasDateTransformer = root.find(j.ImportDeclaration, {
      source: { value: '../services/utils/DateTransformer.js' }
    }).size() > 0;
    
    if (!hasDateTransformer) {
      const importStatement = j.importDeclaration(
        [j.importSpecifier(j.identifier('DateTransformer'))],
        j.literal('../services/utils/DateTransformer.js')
      );
      
      if (importDeclarations.size() > 0) {
        j(importDeclarations.at(importDeclarations.size() - 1).get()).insertAfter(importStatement);
      } else {
        root.get().node.program.body.unshift(importStatement);
      }
    }
    
    logEvent('🚏 LEVEL 2: Fixes Applied - Standardized JSON handling in ' + fileInfo.path);
  }
  
  return modified ? root.toSource() : fileInfo.source;
}

/**
 * Add boundary comments to files
 */
export function addBoundaryComments(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  // Only add boundary comments to files that don't already have them
  const hasBoundaryComment = root.find(j.Comment, {
    value: comment => comment.includes('BOUNDARY AWARENESS')
  }).size() > 0;
  
  if (!hasBoundaryComment) {
    const fileName = path.basename(fileInfo.path);
    const comments = root.find(j.Comment);
    
    const boundaryComment = j.commentBlock(
      `* BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * its functionality and the rest of the system, following the
 * Explicit-Implicit Quantum Balance principle.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */`
    );
    
    if (comments.size() > 0) {
      j(comments.at(0).get()).insertBefore(boundaryComment);
      
      logEvent('🚏 LEVEL 2: Documentation - Added boundary comments to ' + fileInfo.path);
      return root.toSource();
    } else {
      // For files with no comments at all, add at the beginning
      root.get().node.program.body.unshift(boundaryComment);
      
      logEvent('🚏 LEVEL 2: Documentation - Added boundary comments to ' + fileInfo.path);
      return root.toSource();
    }
  }
  
  return fileInfo.source;
}

/**
 * Main transform function that orchestrates all transformations
 */
export default function transform(fileInfo: FileInfo, api: API) {
  // Initialize events log if it doesn't exist
  const eventsLogPath = path.join(process.cwd(), 'events.txt');
  if (!fs.existsSync(eventsLogPath)) {
    fs.writeFileSync(eventsLogPath, `[${new Date().toISOString()}] 🔗 TSAR BOMBA DETONATION - System-wide sweep initiated\n`);
  }
  
  logEvent(`🚏 LEVEL 1: Processing file ${fileInfo.path}`);
  
  // Apply transformations sequentially
  let source = fileInfo.source;
  
  // First transform property naming (most pervasive)
  source = transformPropertyNaming({ ...fileInfo, source }, api);
  
  // Then transform processEvent calls
  source = transformProcessEventCalls({ ...fileInfo, source }, api);
  
  // Then transform date creation
  source = transformDateCreation({ ...fileInfo, source }, api);
  
  // Then transform JSON handling
  source = transformJsonHandling({ ...fileInfo, source }, api);
  
  // Finally add boundary comments
  source = addBoundaryComments({ ...fileInfo, source }, api);
  
  // Log system resonance
  if (source !== fileInfo.source) {
    logEvent(`🚏 LEVEL 8: Operations - Transformed ${fileInfo.path}`);
  }
  
  return source;
}