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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { createReadStream } from 'fs';
import { parse as csvParse } from 'csv-parse';
import * as fs from 'fs/promises';
import { storage } from '../storage.js';
/**
 * Import data from a file
 */
export function importDataFromFile(options) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, job, stats, fileSize, result, datasetInsert, dataset, position, _i, _a, colName, colType, mappedName, columnInsert, executionTime, error_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    startTime = Date.now();
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 20, , 22]);
                    return [4 /*yield*/, storage.createPipelineJob({
                            name: "Import: ".concat(options.datasetName || options.filename),
                            description: "Importing ".concat(options.format.toUpperCase(), " data from ").concat(options.filename),
                            type: 'dataset_import',
                            status: 'running',
                            progress: 0,
                            createdBy: options.userId,
                        })];
                case 2:
                    job = _d.sent();
                    // Log the start of the import
                    return [4 /*yield*/, storage.createSystemLog({
                            type: 'info',
                            message: "Dataset Import Started: ".concat(options.filename),
                            details: "Starting import of ".concat(options.format.toUpperCase(), " file ").concat(options.filename),
                            component: 'Data Importer',
                            severity: 1,
                            userId: options.userId,
                        })];
                case 3:
                    // Log the start of the import
                    _d.sent();
                    // Update job progress
                    return [4 /*yield*/, storage.updatePipelineJobProgress(job.id, 10)];
                case 4:
                    // Update job progress
                    _d.sent();
                    return [4 /*yield*/, fs.stat(options.filePath)];
                case 5:
                    stats = _d.sent();
                    fileSize = stats.size;
                    result = void 0;
                    if (!(options.format.toLowerCase() === 'csv')) return [3 /*break*/, 7];
                    return [4 /*yield*/, importCsv(options.filePath, options)];
                case 6:
                    result = _d.sent();
                    return [3 /*break*/, 10];
                case 7:
                    if (!(options.format.toLowerCase() === 'json')) return [3 /*break*/, 9];
                    return [4 /*yield*/, importJson(options.filePath, options)];
                case 8:
                    result = _d.sent();
                    return [3 /*break*/, 10];
                case 9: throw new Error("Unsupported file format: ".concat(options.format));
                case 10: 
                // Update job progress
                return [4 /*yield*/, storage.updatePipelineJobProgress(job.id, 50)];
                case 11:
                    // Update job progress
                    _d.sent();
                    datasetInsert = {
                        name: options.datasetName || options.filename.replace(/\\.[^/.]+$/, ''),
                        description: options.datasetDescription || "Imported from ".concat(options.filename),
                        source: 'file-import',
                        format: options.format.toLowerCase(),
                        status: 'active',
                        size: fileSize,
                        rowCount: result.rowCount,
                        columnCount: result.columnNames.length,
                        createdBy: options.userId,
                        filePath: options.filePath,
                        isPublic: options.isPublic || false,
                        tags: options.tags || [],
                        metadata: {
                            originalFilename: options.filename,
                            importDate: new Date().toISOString(),
                            hasHeader: options.hasHeader,
                            delimiter: options.delimiter,
                        },
                    };
                    return [4 /*yield*/, storage.createDataset(datasetInsert)];
                case 12:
                    dataset = _d.sent();
                    // Update job progress
                    return [4 /*yield*/, storage.updatePipelineJobProgress(job.id, 70)];
                case 13:
                    // Update job progress
                    _d.sent();
                    position = 0;
                    _i = 0, _a = result.columnNames;
                    _d.label = 14;
                case 14:
                    if (!(_i < _a.length)) return [3 /*break*/, 17];
                    colName = _a[_i];
                    colType = result.columnTypes[colName] || 'string';
                    mappedName = ((_b = options.columnMappings) === null || _b === void 0 ? void 0 : _b[colName]) || colName;
                    columnInsert = {
                        datasetId: dataset.id,
                        name: mappedName,
                        dataType: ((_c = options.columnTypes) === null || _c === void 0 ? void 0 : _c[colName]) || colType,
                        description: '',
                        ordinalPosition: position++,
                        isNullable: true,
                        isPrimaryKey: false,
                        isForeignKey: false,
                        statistics: calculateColumnStatistics(result.data, colName, colType),
                    };
                    return [4 /*yield*/, storage.createDataColumn(columnInsert)];
                case 15:
                    _d.sent();
                    _d.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17: 
                // Update job progress
                return [4 /*yield*/, storage.updatePipelineJobProgress(job.id, 100)];
                case 18:
                    // Update job progress
                    _d.sent();
                    // Log the completion of the import
                    return [4 /*yield*/, storage.createSystemLog({
                            type: 'success',
                            message: "Dataset Import Completed: ".concat(options.filename),
                            details: "Successfully imported ".concat(result.rowCount, " rows and ").concat(result.columnNames.length, " columns from ").concat(options.filename),
                            component: 'Data Importer',
                            severity: 1,
                            userId: options.userId,
                        })];
                case 19:
                    // Log the completion of the import
                    _d.sent();
                    executionTime = Date.now() - startTime;
                    return [2 /*return*/, {
                            datasetId: dataset.id,
                            jobId: job.id,
                            columnCount: result.columnNames.length,
                            rowCount: result.rowCount,
                            previewData: result.data.slice(0, 10), // First 10 rows for preview
                            columnNames: result.columnNames,
                            columnTypes: result.columnTypes,
                            executionTime: executionTime,
                        }];
                case 20:
                    error_1 = _d.sent();
                    // Log the error
                    return [4 /*yield*/, storage.createSystemLog({
                            type: 'error',
                            message: "Dataset Import Failed: ".concat(options.filename),
                            details: error_1 instanceof Error ? error_1.message : String(error_1),
                            component: 'Data Importer',
                            severity: 3,
                            userId: options.userId,
                        })];
                case 21:
                    // Log the error
                    _d.sent();
                    throw error_1;
                case 22: return [2 /*return*/];
            }
        });
    });
}
/**
 * Import data from a CSV file
 */
function importCsv(filePath, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var data = [];
                    var columnNames = [];
                    var rowCount = 0;
                    var parser = csvParse({
                        delimiter: options.delimiter || ',',
                        columns: options.hasHeader !== false, // Default to true
                        skip_empty_lines: true,
                        trim: true,
                    });
                    createReadStream(filePath)
                        .pipe(parser)
                        .on('readable', function () {
                        var record;
                        while ((record = parser.read()) !== null) {
                            data.push(record);
                            rowCount++;
                        }
                    })
                        .on('error', function (err) {
                        reject(err);
                    })
                        .on('end', function () {
                        if (data.length === 0) {
                            return reject(new Error('CSV file is empty or could not be parsed'));
                        }
                        // Get column names
                        columnNames = Object.keys(data[0]);
                        // Detect column types
                        var columnTypes = inferColumnTypes(data);
                        resolve({
                            data: data,
                            columnNames: columnNames,
                            columnTypes: columnTypes,
                            rowCount: rowCount,
                        });
                    });
                })];
        });
    });
}
/**
 * Import data from a JSON file
 */
function importJson(filePath, options) {
    return __awaiter(this, void 0, void 0, function () {
        var content, parsed_1, data, arrayProp, columnNames, columnTypes, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(filePath, 'utf-8')];
                case 1:
                    content = _a.sent();
                    parsed_1 = JSON.parse(content);
                    data = void 0;
                    if (Array.isArray(parsed_1)) {
                        data = parsed_1;
                    }
                    else {
                        arrayProp = Object.keys(parsed_1).find(function (key) { return Array.isArray(parsed_1[key]); });
                        if (!arrayProp) {
                            throw new Error('JSON file does not contain an array of data');
                        }
                        data = parsed_1[arrayProp];
                    }
                    if (data.length === 0) {
                        throw new Error('JSON data is empty');
                    }
                    columnNames = Object.keys(data[0]);
                    columnTypes = inferColumnTypes(data);
                    return [2 /*return*/, {
                            data: data,
                            columnNames: columnNames,
                            columnTypes: columnTypes,
                            rowCount: data.length,
                        }];
                case 2:
                    error_2 = _a.sent();
                    throw new Error("Failed to parse JSON file: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Infer column types from data
 */
function inferColumnTypes(data) {
    if (data.length === 0)
        return {};
    var columnNames = Object.keys(data[0]);
    var columnTypes = {};
    var sampleSize = Math.min(data.length, 100); // Use up to 100 rows for type inference
    for (var _i = 0, columnNames_1 = columnNames; _i < columnNames_1.length; _i++) {
        var column = columnNames_1[_i];
        // Check first non-null value
        var type = 'string';
        for (var i = 0; i < sampleSize; i++) {
            var value = data[i][column];
            if (value === null || value === undefined || value === '')
                continue;
            if (typeof value === 'number') {
                type = Number.isInteger(value) ? 'integer' : 'number';
            }
            else if (typeof value === 'boolean') {
                type = 'boolean';
            }
            else if (typeof value === 'string') {
                // Try to parse as date
                if (/^\d{4}-\d{2}-\d{2}/.test(value) || /^\d{2}\/\d{2}\/\d{4}/.test(value)) {
                    var date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        type = 'date';
                        break;
                    }
                }
                // Try to parse as number
                if (/^-?\d+(\.\d+)?$/.test(value)) {
                    type = value.includes('.') ? 'number' : 'integer';
                    break;
                }
                type = 'string';
            }
            else if (Array.isArray(value)) {
                type = 'array';
            }
            else if (typeof value === 'object') {
                type = 'object';
            }
            break;
        }
        columnTypes[column] = type;
    }
    return columnTypes;
}
/**
 * Calculate statistics for a column
 */
function calculateColumnStatistics(data, columnName, columnType) {
    var stats = {};
    // Count null values
    var values = data.map(function (row) { return row[columnName]; });
    var nullCount = values.filter(function (val) { return val === null || val === undefined || val === ''; }).length;
    stats.nullCount = nullCount;
    stats.nullPercentage = parseFloat(((nullCount / data.length) * 100).toFixed(2));
    // Only calculate numeric statistics for number/integer columns
    if (columnType === 'number' || columnType === 'integer') {
        var numericValues = values
            .filter(function (val) { return val !== null && val !== undefined && val !== ''; })
            .map(function (val) { return typeof val === 'string' ? parseFloat(val) : val; });
        if (numericValues.length > 0) {
            stats.min = Math.min.apply(Math, numericValues);
            stats.max = Math.max.apply(Math, numericValues);
            stats.sum = numericValues.reduce(function (sum, val) { return sum + val; }, 0);
            stats.avg = stats.sum / numericValues.length;
            stats.median = calculateMedian(numericValues);
        }
    }
    // Calculate distinct values for categorical data
    if (columnType === 'string' || columnType === 'boolean') {
        var distinctValues = new Set(values.filter(function (val) { return val !== null && val !== undefined && val !== ''; }));
        stats.distinctCount = distinctValues.size;
        // Get frequency distribution for top values
        var valueFrequency = {};
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var val = values_1[_i];
            if (val === null || val === undefined || val === '')
                continue;
            var strVal = String(val);
            valueFrequency[strVal] = (valueFrequency[strVal] || 0) + 1;
        }
        // Get top 10 most frequent values
        stats.topValues = Object.entries(valueFrequency)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })
            .slice(0, 10)
            .map(function (_a) {
            var value = _a[0], count = _a[1];
            return ({ value: value, count: count, percentage: parseFloat(((count / data.length) * 100).toFixed(2)) });
        });
    }
    // Calculate date statistics
    if (columnType === 'date') {
        var dateValues = values
            .filter(function (val) { return val !== null && val !== undefined && val !== ''; })
            .map(function (val) { return new Date(val); });
        if (dateValues.length > 0) {
            stats.minDate = new Date(Math.min.apply(Math, dateValues.map(function (d) { return d.getTime(); }))).toISOString();
            stats.maxDate = new Date(Math.max.apply(Math, dateValues.map(function (d) { return d.getTime(); }))).toISOString();
            stats.dateRange = Math.ceil((new Date(stats.maxDate).getTime() - new Date(stats.minDate).getTime()) / (1000 * 60 * 60 * 24)); // in days
        }
    }
    return stats;
}
/**
 * Calculate median of an array of numbers
 */
function calculateMedian(values) {
    if (values.length === 0)
        return 0;
    var sorted = __spreadArray([], values, true).sort(function (a, b) { return a - b; });
    var middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    else {
        return sorted[middle];
    }
}
