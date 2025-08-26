"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyModule = verifyModule;
// server/verification/module-verifier.ts
var fs = require("fs/promises");
var ts = require("typescript");
/**
 * The Modularity God Formula checker.
 * @param modulePath - Path to the file to check
 */
function verifyModule(modulePath) {
    return __awaiter(this, void 0, void 0, function () {
        var result, content, lines, newDateRegex, chronosUsageRegex, newDateMatches, chronosMatches, i, match, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    result = {
                        modulePath: modulePath,
                        checks: {
                            interfaceImplementation: { passed: false, message: "Not yet implemented" },
                            chronosUsage: { passed: false, message: "Not yet implemented" },
                            boundaryDefinition: { passed: false, message: "Not yet implemented" },
                            responsibility: { passed: false, message: "Not yet implemented" },
                        },
                        overallPassed: false,
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fs.readFile(modulePath, 'utf-8')];
                case 2:
                    content = _b.sent();
                    lines = content.split('\n');
                    newDateRegex = /\bnew Date\(/g;
                    chronosUsageRegex = /\bChronosDateHandler\.createDate\(/g;
                    newDateMatches = [];
                    chronosMatches = [];
                    for (i = 0; i < lines.length; i++) {
                        match = void 0;
                        while ((match = newDateRegex.exec(lines[i])) !== null) {
                            newDateMatches.push(i + 1); // Line Number
                        }
                        while ((match = chronosUsageRegex.exec(lines[i])) !== null) {
                            chronosMatches.push(i + 1);
                        }
                    }
                    // Special exception for the ChronosDateHandler itself
                    console.log("DEBUG Path Check: ".concat(modulePath));
                    console.log("DEBUG Contains 'chronos-date-handler.ts': ".concat(modulePath.includes('chronos-date-handler.ts')));
                    if (modulePath.endsWith('chronos-date-handler.ts')) {
                        console.log('DEBUG: ChronosDateHandler exception applied');
                        result.checks.chronosUsage = {
                            passed: true,
                            message: "ChronosDateHandler is exempt from Chronos usage checks (would cause circular reference)."
                        };
                    }
                    else if (newDateMatches.length > 0) {
                        result.checks.chronosUsage = {
                            passed: false,
                            message: "Inconsistent use of ChronosDateHandler. new Date() found.",
                            lineNumbers: newDateMatches
                        };
                    }
                    else {
                        result.checks.chronosUsage = { passed: true, message: "ChronosDateHandler used consistently." };
                    }
                    // Interface implementation check
                    _a = result.checks;
                    return [4 /*yield*/, checkInterfaceImplementation(modulePath)];
                case 3:
                    // Interface implementation check
                    _a.interfaceImplementation = _b.sent();
                    // Boundary definition check
                    result.checks.boundaryDefinition = checkBoundaryDefinition(content, lines);
                    // Responsibility check
                    result.checks.responsibility = checkResponsibility(content, lines);
                    result.overallPassed = Object.values(result.checks).every(function (check) { return check.passed; });
                    return [2 /*return*/, result];
                case 4:
                    error_1 = _b.sent();
                    // If file can't be read or other error occurs
                    return [2 /*return*/, {
                            modulePath: modulePath,
                            checks: {
                                interfaceImplementation: { passed: false, message: "Error reading file: ".concat(error_1.message) },
                                chronosUsage: { passed: false, message: "Error reading file: ".concat(error_1.message) },
                                boundaryDefinition: { passed: false, message: "Error reading file: ".concat(error_1.message) },
                                responsibility: { passed: false, message: "Error reading file: ".concat(error_1.message) },
                            },
                            overallPassed: false,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks if classes in the given file correctly implement their interfaces.
 * @param filePath - Path to the file to check
 */
function checkInterfaceImplementation(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var program, checker_1, sourceFile_1, errors_1, errorLineNumbers_1;
        return __generator(this, function (_a) {
            try {
                program = ts.createProgram([filePath], {
                    allowJs: true,
                    target: ts.ScriptTarget.ES2020,
                    module: ts.ModuleKind.ESNext,
                    moduleResolution: ts.ModuleResolutionKind.NodeNext
                });
                checker_1 = program.getTypeChecker();
                sourceFile_1 = program.getSourceFile(filePath);
                if (!sourceFile_1) {
                    return [2 /*return*/, { passed: false, message: "Could not find source file: ".concat(filePath) }];
                }
                errors_1 = [];
                errorLineNumbers_1 = [];
                // Visit each node in the source file to find class declarations
                ts.forEachChild(sourceFile_1, function visit(node) {
                    if (ts.isClassDeclaration(node) && node.heritageClauses) {
                        var className = node.name ? node.name.text : 'Unnamed Class';
                        // Look for 'implements' clauses
                        for (var _i = 0, _a = node.heritageClauses; _i < _a.length; _i++) {
                            var clause = _a[_i];
                            if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
                                var _loop_1 = function (type) {
                                    // Get the interface type
                                    var interfaceType = checker_1.getTypeAtLocation(type.expression);
                                    if (!interfaceType || !interfaceType.symbol || !interfaceType.symbol.declarations) {
                                        errors_1.push("Interface not found or has no declarations.");
                                        return "continue";
                                    }
                                    // Get the interface declaration
                                    var interfaceDecl = interfaceType.symbol.declarations[0];
                                    if (!ts.isInterfaceDeclaration(interfaceDecl)) {
                                        errors_1.push("'".concat(type.expression.getText(), "' is not an interface."));
                                        return "continue";
                                    }
                                    var interfaceName = interfaceDecl.name.text;
                                    // Extract interface members
                                    var interfaceMembers = interfaceDecl.members.map(function (member) {
                                        if ((ts.isMethodSignature(member) || ts.isPropertySignature(member)) &&
                                            member.name && ts.isIdentifier(member.name)) {
                                            return member.name.text;
                                        }
                                        return null;
                                    }).filter(function (name) { return name !== null; });
                                    // Extract class members
                                    var classMembers = node.members.map(function (member) {
                                        if ((ts.isMethodDeclaration(member) || ts.isPropertyDeclaration(member)) &&
                                            member.name && ts.isIdentifier(member.name)) {
                                            return member.name.text;
                                        }
                                        return null;
                                    }).filter(function (name) { return name !== null; });
                                    // Check for missing members
                                    var missingMembers = interfaceMembers.filter(function (member) { return !classMembers.includes(member); });
                                    if (missingMembers.length > 0) {
                                        errors_1.push("Class '".concat(className, "' does not implement all members of interface '").concat(interfaceName, "'. Missing: ").concat(missingMembers.join(', ')));
                                        if (node.name) {
                                            var lineAndChar = sourceFile_1.getLineAndCharacterOfPosition(node.name.getStart());
                                            errorLineNumbers_1.push(lineAndChar.line + 1); // Lines are 0-indexed in TS
                                        }
                                    }
                                };
                                for (var _b = 0, _c = clause.types; _b < _c.length; _b++) {
                                    var type = _c[_b];
                                    _loop_1(type);
                                }
                            }
                        }
                    }
                    // Continue visiting child nodes
                    ts.forEachChild(node, visit);
                });
                if (errors_1.length > 0) {
                    return [2 /*return*/, {
                            passed: false,
                            message: errors_1.join(' '),
                            lineNumbers: errorLineNumbers_1
                        }];
                }
                return [2 /*return*/, { passed: true, message: 'All interface checks passed.' }];
            }
            catch (error) {
                return [2 /*return*/, {
                        passed: false,
                        message: "Error checking interface implementation: ".concat(error.message)
                    }];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Checks if the file properly defines and manages boundaries using Void-Centered Design principles.
 * @param content - The content of the file
 * @param lines - The lines of the file
 */
function checkBoundaryDefinition(content, lines) {
    // Patterns that indicate proper boundary management
    var boundaryPatterns = [
        { regex: /BOUNDARY\s+AWARENESS/i, description: "Boundary awareness comment" },
        { regex: /BOUNDARY\s+DEFINITION/i, description: "Boundary definition comment" },
        { regex: /BOUNDARY\s+HANDLING/i, description: "Boundary handling comment" },
        { regex: /BOUNDARY\s+MANAGEMENT/i, description: "Boundary management comment" },
        { regex: /EXPLICIT\s+BOUNDARY/i, description: "Explicit boundary comment" },
        { regex: /VOID-CENTERED/i, description: "Void-Centered Design pattern" },
        { regex: /interface\s+[A-Za-z0-9_]+/i, description: "Interface definition" }
    ];
    // Look for boundary-related comments and code patterns
    var found = 0;
    var matchedLines = [];
    var matchedPatterns = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        for (var _i = 0, boundaryPatterns_1 = boundaryPatterns; _i < boundaryPatterns_1.length; _i++) {
            var pattern = boundaryPatterns_1[_i];
            if (pattern.regex.test(line)) {
                found++;
                matchedLines.push(i + 1); // Convert to 1-based line numbers
                matchedPatterns.push(pattern.description);
                break;
            }
        }
    }
    // Check for void-centered design implementation
    var voidCenteredDesign = /void-centered design/i.test(content);
    var moduleSeparation = /module exports|export\s+class|export\s+interface|export\s+function/i.test(content);
    var explicitTypeDefinitions = /interface|type\s+[A-Za-z0-9_]+\s+=\s+{/i.test(content);
    if (found >= 2 || (found >= 1 && (voidCenteredDesign || moduleSeparation || explicitTypeDefinitions))) {
        return {
            passed: true,
            message: "Found proper boundary definitions: ".concat(matchedPatterns.join(', ')),
            lineNumbers: matchedLines
        };
    }
    else {
        return {
            passed: false,
            message: "Insufficient boundary definitions found. Consider adding explicit boundary management comments and implementing Void-Centered Design principles.",
            lineNumbers: matchedLines
        };
    }
}
/**
 * Checks if the file properly implements the Single Responsibility Principle.
 * @param content - The content of the file
 * @param lines - The lines of the file
 */
function checkResponsibility(content, lines) {
    // Patterns that indicate proper responsibility handling
    var responsibilityPatterns = [
        { regex: /RESPONSIBILITY/i, description: "Responsibility comment" },
        { regex: /SINGLE\s+RESPONSIBILITY/i, description: "Single Responsibility Principle comment" },
        { regex: /PURPOSE:/i, description: "Purpose specification" },
        { regex: /^\s*\/\*\*[\s\S]*?\*\/\s*$/m, description: "JSDoc comment block" },
        { regex: /^\s*\/\/\s*[A-Z].*$/m, description: "Single-line comment with capitalized first letter" }
    ];
    // Look for responsibility-related comments and patterns
    var found = 0;
    var matchedLines = [];
    var matchedPatterns = [];
    // First check for explicit responsibility documentation
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        for (var _i = 0, responsibilityPatterns_1 = responsibilityPatterns; _i < responsibilityPatterns_1.length; _i++) {
            var pattern = responsibilityPatterns_1[_i];
            if (pattern.regex.test(line)) {
                found++;
                matchedLines.push(i + 1); // Convert to 1-based line numbers
                matchedPatterns.push(pattern.description);
                break;
            }
        }
    }
    // Analyze code structure for single responsibility principle
    var classCount = (content.match(/class\s+[A-Za-z0-9_]+/g) || []).length;
    var interfaceCount = (content.match(/interface\s+[A-Za-z0-9_]+/g) || []).length;
    var methodCount = (content.match(/function\s+[A-Za-z0-9_]+|[A-Za-z0-9_]+\s*\([^)]*\)\s*{/g) || []).length;
    // Check if the file follows cohesion patterns
    var hasCohesiveNaming = /^(.*?)(?:Repository|Service|Controller|Handler|Manager|Factory|Provider|Adapter|Util)\.ts$/i.test(content);
    // Check for common SRP violations
    var godObjectPattern = /(class|interface)\s+[A-Za-z0-9_]+[\s\S]{1000,}/; // Large class/interface (>1000 chars)
    var hasPotentialGodObject = godObjectPattern.test(content) && methodCount > 15;
    // Determine if responsibility principle is followed
    var isSingleResponsibility = false;
    var srMessage = "";
    if (found >= 2) {
        // Explicit documentation about responsibility
        isSingleResponsibility = true;
        srMessage = "Well-documented responsibility: ".concat(matchedPatterns.join(', '));
    }
    else if (hasCohesiveNaming && !hasPotentialGodObject && (classCount <= 2 && methodCount < 15)) {
        // Cohesive naming and reasonable size
        isSingleResponsibility = true;
        srMessage = "Follows Single Responsibility Principle through cohesive naming and reasonable size";
    }
    else if (hasPotentialGodObject) {
        isSingleResponsibility = false;
        srMessage = "Potential violation of Single Responsibility Principle: file contains large classes with many methods";
    }
    else if (classCount > 3) {
        isSingleResponsibility = false;
        srMessage = "Potential violation of Single Responsibility Principle: file contains multiple classes (>3)";
    }
    else if (methodCount > 15 && found < 2) {
        isSingleResponsibility = false;
        srMessage = "Potential violation of Single Responsibility Principle: file contains many methods (>15) without explicit responsibility documentation";
    }
    else {
        // Default case - if we can't determine clearly, we pass but with a warning
        isSingleResponsibility = true;
        srMessage = "Follows Single Responsibility Principle, but could benefit from more explicit documentation";
    }
    return {
        passed: isSingleResponsibility,
        message: srMessage,
        lineNumbers: matchedLines
    };
}
