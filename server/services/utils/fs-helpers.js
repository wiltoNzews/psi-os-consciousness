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
/**
 * Filesystem helper functions for persistent context operations
 */
import { promises as fsPromises } from 'node:fs';
import * as fs from 'node:fs';
import * as path from 'node:path';
/**
 * Ensures a directory exists, creating it if necessary (async version)
 * @param dirPath Path to the directory
 */
export function ensureDirectoryExistsAsync(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, mkdirError_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 7]);
                    return [4 /*yield*/, fsPromises.access(dirPath)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2:
                    error_1 = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fsPromises.mkdir(dirPath, { recursive: true })];
                case 4:
                    _a.sent();
                    console.log("Created directory: ".concat(dirPath));
                    return [3 /*break*/, 6];
                case 5:
                    mkdirError_1 = _a.sent();
                    console.error("Error creating directory ".concat(dirPath, ":"), mkdirError_1);
                    throw mkdirError_1;
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Ensures a directory exists, creating it if necessary (sync version)
 * @param dirPath Directory path to ensure
 */
export function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.statSync(dirPath).isDirectory()) {
        throw new Error("Path is not a directory: ".concat(dirPath));
    }
}
/**
 * Checks if a file exists
 * @param filePath Path to the file
 * @returns true if file exists, false otherwise
 */
export function fileExists(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fsPromises.access(filePath)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Gets all JSON files in a directory
 * @param dirPath Directory path
 * @returns Array of file paths
 */
export function getJsonFilesInDirectory(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var files, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, ensureDirectoryExistsAsync(dirPath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fsPromises.readdir(dirPath)];
                case 2:
                    files = _a.sent();
                    return [2 /*return*/, files
                            .filter(function (file) { return file.endsWith('.json'); })
                            .map(function (file) { return path.join(dirPath, file); })];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error reading directory ".concat(dirPath, ":"), error_2);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Validates that a path is writable by creating and deleting a test file
 * @param dirPath Directory path to validate
 */
export function validateDirectoryWritable(dirPath) {
    try {
        var testFilePath = path.join(dirPath, '.permission_test');
        fs.writeFileSync(testFilePath, 'test');
        fs.unlinkSync(testFilePath);
    }
    catch (error) {
        throw new Error("Directory is not writable: ".concat(dirPath));
    }
}
/**
 * Safely writes data to a file atomically
 * @param filePath File path to write to
 * @param data Data to write
 */
export function safeWriteFile(filePath, data) {
    var tempPath = "".concat(filePath, ".tmp");
    fs.writeFileSync(tempPath, data, 'utf8');
    fs.renameSync(tempPath, filePath);
}
