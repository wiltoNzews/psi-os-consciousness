/**
 * File System Storage Implementation
 *
 * This module provides a file-based implementation of the storage interface for persisting
 * system metrics, stability data, and other critical system components.
 *
 * IMPORTANT: This system uses pure file-based storage with NO Drizzle ORM dependencies.
 * (See DRIZZLE_REMOVAL_DOCUMENTATION.md for details on the complete removal of Drizzle)
 *
 * All persistence is handled through direct file system operations for maximum reliability
 * and simplicity, following TSAR BOMBA verification principles with explicit boundary handling.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import ChronosDateHandler from './utils/chronos-date-handler.js';
/**
 * File System Storage
 *
 * A file-based implementation of the storage interface that persists data to the file system
 * in JSON format. This provides reliable persistence without the complexity of an ORM or
 * database system.
 */
var FileSystemStorage = /** @class */ (function () {
    /**
     * Constructor
     * @param baseDir Base directory for file storage
     */
    function FileSystemStorage(baseDir) {
        this.baseDir = baseDir;
        this.metricsDir = path.join(this.baseDir, 'metrics');
        this.stabilityDir = path.join(this.baseDir, 'stability');
        this.qrnMetricsDir = path.join(this.baseDir, 'qrn_metrics');
        this.systemMetricsDir = path.join(this.baseDir, 'system_metrics');
        this.tasksDir = path.join(this.baseDir, 'tasks');
        this.chunksDir = path.join(this.baseDir, 'chunks');
        this.chunkDependenciesDir = path.join(this.baseDir, 'chunk_dependencies');
        this.usersDir = path.join(this.baseDir, 'users');
        this.temporalInstancesDir = path.join(this.baseDir, 'temporal_instances');
        this.adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
        this.metaCognitiveEventsDir = path.join(this.baseDir, 'meta_cognitive_events');
        this.neuralPathwaysDir = path.join(this.baseDir, 'neural_pathways');
        this.datasetsDir = path.join(this.baseDir, 'datasets');
        this.transformationsDir = path.join(this.baseDir, 'transformations');
        this.analysisModelsDir = path.join(this.baseDir, 'analysis_models');
    }
    /**
     * Ensure required directories exist
     */
    FileSystemStorage.prototype.ensureDirectories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.mkdir(this.baseDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.metricsDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.stabilityDir, { recursive: true })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.qrnMetricsDir, { recursive: true })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.systemMetricsDir, { recursive: true })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.tasksDir, { recursive: true })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.chunksDir, { recursive: true })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.chunkDependenciesDir, { recursive: true })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.usersDir, { recursive: true })];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.temporalInstancesDir, { recursive: true })];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.adaptiveResonancesDir, { recursive: true })];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.metaCognitiveEventsDir, { recursive: true })];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.neuralPathwaysDir, { recursive: true })];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.datasetsDir, { recursive: true })];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.transformationsDir, { recursive: true })];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.analysisModelsDir, { recursive: true })];
                    case 16:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Date reviver function for JSON.parse
     * Converts ISO strings to Date objects
     *
     * Now using unified ChronosDateHandler for consistent date handling across the system
     */
    FileSystemStorage.prototype.dateReviver = function (key, value) {
        return ChronosDateHandler.dateReviver(key, value);
    };
    /**
     * Date replacer function for JSON.stringify
     * Converts Date objects to ISO strings
     *
     * Now using unified ChronosDateHandler for consistent date handling across the system
     */
    FileSystemStorage.prototype.dateReplacer = function (key, value) {
        return ChronosDateHandler.dateReplacer(key, value);
    };
    /**
     * Ensure dates in an object are properly instantiated
     *
     * @param obj Object to process
     * @returns Object with all date strings converted to Date objects
     */
    FileSystemStorage.prototype.ensureDatesInObject = function (obj) {
        return ChronosDateHandler.ensureDatesInObject(obj);
    };
    /**
     * Save metrics to storage
     * @param metrics Metrics object to save
     */
    FileSystemStorage.prototype.saveMetrics = function (metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, filename, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        filename = "metrics_".concat(timestamp, ".json");
                        filePath = path.join(this.metricsDir, filename);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(metrics, this.dateReplacer, 2))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get latest metrics from storage
     * @param limit Maximum number of metrics to retrieve
     */
    FileSystemStorage.prototype.getLatestMetrics = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var files, jsonFiles, sortedFiles, metrics, _i, sortedFiles_1, file, filePath, data, metric, error_1;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, fs.readdir(this.metricsDir)];
                    case 3:
                        files = _a.sent();
                        jsonFiles = files.filter(function (file) { return file.endsWith('.json'); });
                        sortedFiles = jsonFiles.sort().reverse().slice(0, limit);
                        metrics = [];
                        _i = 0, sortedFiles_1 = sortedFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < sortedFiles_1.length)) return [3 /*break*/, 7];
                        file = sortedFiles_1[_i];
                        filePath = path.join(this.metricsDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 5:
                        data = _a.sent();
                        metric = JSON.parse(data, this.dateReviver);
                        metrics.push(metric);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, metrics];
                    case 8:
                        error_1 = _a.sent();
                        if (error_1.code === 'ENOENT') {
                            return [2 /*return*/, []]; // Directory doesn't exist yet
                        }
                        throw error_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get metrics by time range
     * @param startTime Start of time range
     * @param endTime End of time range
     */
    FileSystemStorage.prototype.getMetricsByTimeRange = function (startTime, endTime) {
        return __awaiter(this, void 0, void 0, function () {
            var allMetrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLatestMetrics(1000)];
                    case 1:
                        allMetrics = _a.sent();
                        return [2 /*return*/, allMetrics.filter(function (metric) {
                                var metricTime = metric.timestamp instanceof Date
                                    ? metric.timestamp
                                    : new Date(metric.timestamp);
                                return metricTime >= startTime && metricTime <= endTime;
                            })];
                }
            });
        });
    };
    /**
     * Record system stability data
     * @param stabilityData Stability data to record
     */
    FileSystemStorage.prototype.recordSystemStability = function (stabilityData) {
        return __awaiter(this, void 0, void 0, function () {
            var dataToSave, timestamp, filename, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        dataToSave = __assign(__assign({}, stabilityData), { timestamp: stabilityData.timestamp || new Date() });
                        timestamp = dataToSave.timestamp.toISOString().replace(/[:.]/g, '-');
                        filename = "stability_".concat(timestamp, ".json");
                        filePath = path.join(this.stabilityDir, filename);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(dataToSave, this.dateReplacer, 2))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get system stability history
     * @param limit Maximum number of records to retrieve
     */
    FileSystemStorage.prototype.getSystemStabilityHistory = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var files, jsonFiles, sortedFiles, records, _i, sortedFiles_2, file, filePath, data, record, error_2;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, fs.readdir(this.stabilityDir)];
                    case 3:
                        files = _a.sent();
                        jsonFiles = files.filter(function (file) { return file.endsWith('.json'); });
                        sortedFiles = jsonFiles.sort().reverse().slice(0, limit);
                        records = [];
                        _i = 0, sortedFiles_2 = sortedFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < sortedFiles_2.length)) return [3 /*break*/, 7];
                        file = sortedFiles_2[_i];
                        filePath = path.join(this.stabilityDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 5:
                        data = _a.sent();
                        record = JSON.parse(data, this.dateReviver);
                        records.push(record);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, records];
                    case 8:
                        error_2 = _a.sent();
                        if (error_2.code === 'ENOENT') {
                            return [2 /*return*/, []]; // Directory doesn't exist yet
                        }
                        throw error_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save QRN metrics
     * @param metrics QRN metrics to save
     */
    FileSystemStorage.prototype.saveQRNMetrics = function (metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var dataToSave, timestamp, filename, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        dataToSave = __assign(__assign({}, metrics), { timestamp: metrics.timestamp || new Date() });
                        timestamp = dataToSave.timestamp.toISOString().replace(/[:.]/g, '-');
                        filename = "qrn_metrics_".concat(timestamp, ".json");
                        filePath = path.join(this.qrnMetricsDir, filename);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(dataToSave, this.dateReplacer, 2))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get latest QRN metrics
     */
    FileSystemStorage.prototype.getLatestQRNMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, jsonFiles, latestFile, filePath, data, metrics, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readdir(this.qrnMetricsDir)];
                    case 3:
                        files = _a.sent();
                        jsonFiles = files.filter(function (file) { return file.endsWith('.json'); });
                        if (jsonFiles.length === 0) {
                            // If no QRN metrics exist yet, return default values
                            return [2 /*return*/, {
                                    stability: 0.75,
                                    efficiency: 0.65,
                                    coherence: 0.5
                                }];
                        }
                        latestFile = jsonFiles.sort().pop();
                        if (!latestFile) {
                            return [2 /*return*/, null];
                        }
                        filePath = path.join(this.qrnMetricsDir, latestFile);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 4:
                        data = _a.sent();
                        metrics = JSON.parse(data, this.dateReviver);
                        return [2 /*return*/, {
                                stability: typeof metrics.stability === 'number' ? metrics.stability : null,
                                efficiency: typeof metrics.efficiency === 'number' ? metrics.efficiency : null,
                                coherence: typeof metrics.coherence === 'number' ? metrics.coherence : null
                            }];
                    case 5:
                        error_3 = _a.sent();
                        if (error_3.code === 'ENOENT') {
                            return [2 /*return*/, null]; // Directory doesn't exist yet
                        }
                        console.error('FileSystemStorage.getLatestQRNMetrics: Error reading latest QRN metrics:', error_3);
                        return [2 /*return*/, null]; // Consistent error handling
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Dataset Methods
    FileSystemStorage.prototype.getAllDatasets = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var datasets, files, _i, files_1, file, filePath, data, dataset, error_4, filteredDatasets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.getAllDatasets: Start', filter, limit);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        datasets = [];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, fs.readdir(this.datasetsDir)];
                    case 3:
                        files = _a.sent();
                        _i = 0, files_1 = files;
                        _a.label = 4;
                    case 4:
                        if (!(_i < files_1.length)) return [3 /*break*/, 7];
                        file = files_1[_i];
                        if (!(file.startsWith('dataset_') && file.endsWith('.json'))) return [3 /*break*/, 6];
                        filePath = path.join(this.datasetsDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 5:
                        data = _a.sent();
                        dataset = JSON.parse(data, this.dateReviver);
                        datasets.push(dataset);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_4 = _a.sent();
                        console.error('FileSystemStorage.getAllDatasets: Error reading datasets directory:', error_4);
                        return [2 /*return*/, []]; // Return an empty array on error.
                    case 9:
                        filteredDatasets = datasets;
                        if (filter) {
                            if (filter.createdBy !== undefined) {
                                filteredDatasets = filteredDatasets.filter(function (dataset) { return dataset.createdBy === filter.createdBy; });
                            }
                            if (filter.isPublic !== undefined) {
                                filteredDatasets = filteredDatasets.filter(function (dataset) { return dataset.isPublic === filter.isPublic; });
                            }
                        }
                        if (limit !== undefined) {
                            filteredDatasets = filteredDatasets.slice(0, limit);
                        }
                        console.log('FileSystemStorage.getAllDatasets: Complete', filteredDatasets);
                        return [2 /*return*/, filteredDatasets];
                }
            });
        });
    };
    FileSystemStorage.prototype.getDataset = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, dataset, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.getDataset: Start', id);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.datasetsDir, "dataset_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        dataset = JSON.parse(data, this.dateReviver);
                        console.log('FileSystemStorage.getDataset: Complete', dataset);
                        return [2 /*return*/, dataset];
                    case 4:
                        error_5 = _a.sent();
                        if (error_5.code === 'ENOENT') {
                            console.log("FileSystemStorage.getDataset: Dataset ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // Return undefined if not found
                        }
                        console.error("FileSystemStorage.getDataset: Error loading dataset ".concat(id, ":"), error_5);
                        return [2 /*return*/, undefined]; // Consistent error handling
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.createDataset = function (dataset) {
        return __awaiter(this, void 0, void 0, function () {
            var newDataset, filePath, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.createDataset: Start', dataset);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        newDataset = __assign(__assign({}, dataset), { id: Date.now(), createdAt: new Date(), updatedAt: new Date() });
                        filePath = path.join(this.datasetsDir, "dataset_".concat(newDataset.id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(newDataset, this.dateReplacer, 2), 'utf8')];
                    case 3:
                        _a.sent();
                        console.log('FileSystemStorage.createDataset: Complete', newDataset);
                        return [2 /*return*/, newDataset];
                    case 4:
                        error_6 = _a.sent();
                        console.error('FileSystemStorage.createDataset: Error creating dataset:', error_6);
                        throw error_6; // Re-throw for caller handling
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.updateDataset = function (id, dataset) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingDataset, updatedDataset, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.updateDataset: Start', id, dataset);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.datasetsDir, "dataset_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingDataset = JSON.parse(data, this.dateReviver);
                        updatedDataset = __assign(__assign(__assign({}, existingDataset), dataset), { updatedAt: new Date() // Always update updatedAt
                         });
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedDataset, this.dateReplacer, 2), 'utf8')];
                    case 4:
                        _a.sent();
                        console.log('FileSystemStorage.updateDataset: Complete', updatedDataset);
                        return [2 /*return*/, updatedDataset];
                    case 5:
                        error_7 = _a.sent();
                        if (error_7.code === 'ENOENT') {
                            console.log("FileSystemStorage.updateDataset: Dataset ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // Not found
                        }
                        console.error("FileSystemStorage.updateDataset: Error updating dataset ".concat(id, ":"), error_7);
                        return [2 /*return*/, undefined]; // Consistent error handling
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.deleteDataset = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.deleteDataset: Start', id);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.datasetsDir, "dataset_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        _a.sent(); // Check if file exists
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        _a.sent(); // Delete the file
                        console.log("FileSystemStorage.deleteDataset: Dataset ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_8 = _a.sent();
                        if (error_8.code === 'ENOENT') {
                            console.log("FileSystemStorage.deleteDataset: Dataset ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage.deleteDataset: Error deleting dataset ".concat(id, ":"), error_8);
                        return [2 /*return*/, false]; // Error occurred, return false
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.getDatasetColumns = function (datasetId) {
        return __awaiter(this, void 0, void 0, function () {
            var columnsDir, files, columns, _i, files_2, file, filePath, data, column, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.getDatasetColumns: Start', datasetId);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        columnsDir = path.join(this.datasetsDir, "columns_".concat(datasetId));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        return [4 /*yield*/, fs.mkdir(columnsDir, { recursive: true })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, fs.readdir(columnsDir)];
                    case 4:
                        files = _a.sent();
                        columns = [];
                        _i = 0, files_2 = files;
                        _a.label = 5;
                    case 5:
                        if (!(_i < files_2.length)) return [3 /*break*/, 8];
                        file = files_2[_i];
                        if (!file.endsWith('.json')) return [3 /*break*/, 7];
                        filePath = path.join(columnsDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        column = JSON.parse(data, this.dateReviver);
                        columns.push(column);
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        console.log('FileSystemStorage.getDatasetColumns: Complete', columns);
                        return [2 /*return*/, columns];
                    case 9:
                        error_9 = _a.sent();
                        console.error("FileSystemStorage.getDatasetColumns: Error getting columns for dataset ".concat(datasetId, ":"), error_9);
                        return [2 /*return*/, []]; // Return empty array on error
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.createDataColumn = function (column) {
        return __awaiter(this, void 0, void 0, function () {
            var columnsDir, newColumn, filePath, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.createDataColumn: Start', column);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        columnsDir = path.join(this.datasetsDir, "columns_".concat(column.datasetId));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.mkdir(columnsDir, { recursive: true })];
                    case 3:
                        _a.sent();
                        newColumn = __assign(__assign({}, column), { id: Date.now(), createdAt: new Date(), updatedAt: new Date() });
                        filePath = path.join(columnsDir, "column_".concat(newColumn.id, ".json"));
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(newColumn, this.dateReplacer, 2), 'utf8')];
                    case 4:
                        _a.sent();
                        console.log('FileSystemStorage.createDataColumn: Complete', newColumn);
                        return [2 /*return*/, newColumn];
                    case 5:
                        error_10 = _a.sent();
                        console.error('FileSystemStorage.createDataColumn: Error creating column:', error_10);
                        throw error_10;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.updateDataColumn = function (id, column) {
        return __awaiter(this, void 0, void 0, function () {
            var columnsDir, filePath, data, existingColumn, updatedColumn, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.updateDataColumn: Start', id, column);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        // We need to find which dataset this column belongs to
                        // For simplicity, let's assume the column object contains the datasetId
                        if (!column.datasetId) {
                            console.error('FileSystemStorage.updateDataColumn: DatasetId is required to update a column');
                            return [2 /*return*/, undefined];
                        }
                        columnsDir = path.join(this.datasetsDir, "columns_".concat(column.datasetId));
                        filePath = path.join(columnsDir, "column_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingColumn = JSON.parse(data, this.dateReviver);
                        updatedColumn = __assign(__assign(__assign({}, existingColumn), column), { updatedAt: new Date() });
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedColumn, this.dateReplacer, 2), 'utf8')];
                    case 4:
                        _a.sent();
                        console.log('FileSystemStorage.updateDataColumn: Complete', updatedColumn);
                        return [2 /*return*/, updatedColumn];
                    case 5:
                        error_11 = _a.sent();
                        console.error("FileSystemStorage.updateDataColumn: Error updating column ".concat(id, ":"), error_11);
                        return [2 /*return*/, undefined];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.deleteDataColumn = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('FileSystemStorage.deleteDataColumn: Start', id);
                // Without knowing which dataset this column belongs to, we'd need to search all datasets
                // This is a simplified implementation assuming we know the datasetId
                try {
                    // This is a placeholder - in a real implementation, we would search for the column
                    // across all datasets or require a datasetId parameter
                    console.error('FileSystemStorage.deleteDataColumn: Cannot delete column without knowing datasetId');
                    return [2 /*return*/, false];
                }
                catch (error) {
                    console.error("FileSystemStorage.deleteDataColumn: Error deleting column ".concat(id, ":"), error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    FileSystemStorage.prototype.getDataColumnById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('FileSystemStorage.getDataColumnById: Start', id);
                // Similar to deleteDataColumn, without knowing which dataset this column belongs to, 
                // we'd need to search all datasets
                try {
                    // This is a placeholder - in a real implementation, we would search for the column
                    // across all datasets or require a datasetId parameter
                    console.error('FileSystemStorage.getDataColumnById: Cannot get column without knowing datasetId');
                    return [2 /*return*/, undefined];
                }
                catch (error) {
                    console.error("FileSystemStorage.getDataColumnById: Error getting column ".concat(id, ":"), error);
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    // Transformation Methods
    FileSystemStorage.prototype.getAllTransformations = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var transformations, files, _i, files_3, file, filePath, data, transformation, error_12, filteredTransformations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.getAllTransformations: Start', filter, limit);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        transformations = [];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, fs.readdir(this.transformationsDir)];
                    case 3:
                        files = _a.sent();
                        _i = 0, files_3 = files;
                        _a.label = 4;
                    case 4:
                        if (!(_i < files_3.length)) return [3 /*break*/, 7];
                        file = files_3[_i];
                        if (!(file.startsWith('transformation_') && file.endsWith('.json'))) return [3 /*break*/, 6];
                        filePath = path.join(this.transformationsDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 5:
                        data = _a.sent();
                        transformation = JSON.parse(data, this.dateReviver);
                        transformations.push(transformation);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_12 = _a.sent();
                        console.error('FileSystemStorage.getAllTransformations: Error reading transformations directory:', error_12);
                        return [2 /*return*/, []];
                    case 9:
                        filteredTransformations = transformations;
                        if (filter) {
                            if (filter.datasetId !== undefined) {
                                filteredTransformations = filteredTransformations.filter(function (t) { return t.datasetId === filter.datasetId; });
                            }
                        }
                        if (limit !== undefined) {
                            filteredTransformations = filteredTransformations.slice(0, limit);
                        }
                        console.log('FileSystemStorage.getAllTransformations: Complete', filteredTransformations);
                        return [2 /*return*/, filteredTransformations];
                }
            });
        });
    };
    FileSystemStorage.prototype.getTransformation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, transformation, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.getTransformation: Start', id);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.transformationsDir, "transformation_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        transformation = JSON.parse(data, this.dateReviver);
                        console.log('FileSystemStorage.getTransformation: Complete', transformation);
                        return [2 /*return*/, transformation];
                    case 4:
                        error_13 = _a.sent();
                        if (error_13.code === 'ENOENT') {
                            console.log("FileSystemStorage.getTransformation: Transformation ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // Transformation not found
                        }
                        console.error("FileSystemStorage.getTransformation: Error loading transformation ".concat(id, ":"), error_13);
                        return [2 /*return*/, undefined]; // Consistent error handling
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.createTransformation = function (transformation) {
        return __awaiter(this, void 0, void 0, function () {
            var newTransformation, filePath, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.createTransformation: Start', transformation);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        newTransformation = __assign(__assign({}, transformation), { id: Date.now(), createdAt: new Date(), updatedAt: new Date() });
                        filePath = path.join(this.transformationsDir, "transformation_".concat(newTransformation.id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(newTransformation, this.dateReplacer, 2), 'utf8')];
                    case 3:
                        _a.sent();
                        console.log('FileSystemStorage.createTransformation: Complete', newTransformation);
                        return [2 /*return*/, newTransformation];
                    case 4:
                        error_14 = _a.sent();
                        console.error('FileSystemStorage.createTransformation: Error creating transformation:', error_14);
                        throw error_14; // Re-throw for caller handling
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.updateTransformation = function (id, transformation) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingTransformation, updatedTransformation, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.updateTransformation: Start', id, transformation);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.transformationsDir, "transformation_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingTransformation = JSON.parse(data, this.dateReviver);
                        updatedTransformation = __assign(__assign(__assign({}, existingTransformation), transformation), { updatedAt: new Date() // Always update updatedAt
                         });
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedTransformation, this.dateReplacer, 2), 'utf8')];
                    case 4:
                        _a.sent();
                        console.log('FileSystemStorage.updateTransformation: Complete', updatedTransformation);
                        return [2 /*return*/, updatedTransformation];
                    case 5:
                        error_15 = _a.sent();
                        if (error_15.code === 'ENOENT') {
                            console.log("FileSystemStorage.updateTransformation: Transformation ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // Not found
                        }
                        console.error("FileSystemStorage.updateTransformation: Error updating transformation ".concat(id, ":"), error_15);
                        return [2 /*return*/, undefined]; // Consistent error handling
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.deleteTransformation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.deleteTransformation: Start', id);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.transformationsDir, "transformation_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        _a.sent(); // Check if file exists
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        _a.sent(); // Delete the file
                        console.log("FileSystemStorage.deleteTransformation: Transformation ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_16 = _a.sent();
                        if (error_16.code === 'ENOENT') {
                            console.log("FileSystemStorage.deleteTransformation: Transformation ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage.deleteTransformation: Error deleting transformation ".concat(id, ":"), error_16);
                        return [2 /*return*/, false]; // Error occurred, return false
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Analysis Model Methods
    FileSystemStorage.prototype.getAllAnalysisModels = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var models, files, _i, files_4, file, filePath, data, model, error_17, filteredModels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.getAllAnalysisModels: Start', filter, limit);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        models = [];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, fs.readdir(this.analysisModelsDir)];
                    case 3:
                        files = _a.sent();
                        _i = 0, files_4 = files;
                        _a.label = 4;
                    case 4:
                        if (!(_i < files_4.length)) return [3 /*break*/, 7];
                        file = files_4[_i];
                        if (!(file.startsWith('analysis_model_') && file.endsWith('.json'))) return [3 /*break*/, 6];
                        filePath = path.join(this.analysisModelsDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 5:
                        data = _a.sent();
                        model = JSON.parse(data, this.dateReviver);
                        models.push(model);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_17 = _a.sent();
                        console.error('FileSystemStorage.getAllAnalysisModels: Error reading analysis models directory:', error_17);
                        return [2 /*return*/, []]; // Return empty array on error
                    case 9:
                        filteredModels = models;
                        if (filter) {
                            if (filter.createdBy !== undefined) {
                                filteredModels = filteredModels.filter(function (model) { return model.createdBy === filter.createdBy; });
                            }
                            if (filter.isPublic !== undefined) {
                                filteredModels = filteredModels.filter(function (model) { return model.isPublic === filter.isPublic; });
                            }
                        }
                        if (limit !== undefined) {
                            filteredModels = filteredModels.slice(0, limit);
                        }
                        console.log('FileSystemStorage.getAllAnalysisModels: Complete', filteredModels);
                        return [2 /*return*/, filteredModels];
                }
            });
        });
    };
    FileSystemStorage.prototype.getAnalysisModel = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, model, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.getAnalysisModel: Start', id);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.analysisModelsDir, "analysis_model_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        model = JSON.parse(data, this.dateReviver);
                        console.log('FileSystemStorage.getAnalysisModel: Complete', model);
                        return [2 /*return*/, model];
                    case 4:
                        error_18 = _a.sent();
                        if (error_18.code === 'ENOENT') {
                            console.log("FileSystemStorage.getAnalysisModel: Analysis model ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // Model not found
                        }
                        console.error("FileSystemStorage.getAnalysisModel: Error loading analysis model ".concat(id, ":"), error_18);
                        return [2 /*return*/, undefined]; // Consistent error handling
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.createAnalysisModel = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var newModel, filePath, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.createAnalysisModel: Start', model);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        newModel = __assign(__assign({}, model), { id: Date.now(), createdAt: new Date(), updatedAt: new Date() });
                        filePath = path.join(this.analysisModelsDir, "analysis_model_".concat(newModel.id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(newModel, this.dateReplacer, 2), 'utf8')];
                    case 3:
                        _a.sent();
                        console.log('FileSystemStorage.createAnalysisModel: Complete', newModel);
                        return [2 /*return*/, newModel];
                    case 4:
                        error_19 = _a.sent();
                        console.error('FileSystemStorage.createAnalysisModel: Error creating analysis model:', error_19);
                        throw error_19; // Re-throw for caller handling
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.updateAnalysisModel = function (id, model) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingModel, updatedModel, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.updateAnalysisModel: Start', id, model);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.analysisModelsDir, "analysis_model_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingModel = JSON.parse(data, this.dateReviver);
                        updatedModel = __assign(__assign(__assign({}, existingModel), model), { updatedAt: new Date() // Always update updatedAt
                         });
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedModel, this.dateReplacer, 2), 'utf8')];
                    case 4:
                        _a.sent();
                        console.log('FileSystemStorage.updateAnalysisModel: Complete', updatedModel);
                        return [2 /*return*/, updatedModel];
                    case 5:
                        error_20 = _a.sent();
                        if (error_20.code === 'ENOENT') {
                            console.log("FileSystemStorage.updateAnalysisModel: Analysis model ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // Not found
                        }
                        console.error("FileSystemStorage.updateAnalysisModel: Error updating analysis model ".concat(id, ":"), error_20);
                        return [2 /*return*/, undefined]; // Consistent error handling
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.deleteAnalysisModel = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage.deleteAnalysisModel: Start', id);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.analysisModelsDir, "analysis_model_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        _a.sent(); // Check if file exists
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        _a.sent(); // Delete the file
                        console.log("FileSystemStorage.deleteAnalysisModel: Analysis model ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_21 = _a.sent();
                        if (error_21.code === 'ENOENT') {
                            console.log("FileSystemStorage.deleteAnalysisModel: Analysis model ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage.deleteAnalysisModel: Error deleting analysis model ".concat(id, ":"), error_21);
                        return [2 /*return*/, false]; // Error occurred, return false
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // The following methods would be implemented in a full implementation
    // but are left as stubs here to demonstrate what's needed
    /**
     * Save a task to file storage
     * @param task Task to save
     * @returns Promise that resolves when the task is saved
     */
    FileSystemStorage.prototype.saveTask = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var originalId, taskId, fullTask, filePath, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        originalId = task.id;
                        console.log("FileSystemStorage: Saving task with name: ".concat(task.name, ", original ID: ").concat(originalId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        taskId = originalId || uuidv4();
                        console.log("FileSystemStorage: Using taskId: ".concat(taskId, " for the file WITHOUT ANY MODIFICATION"));
                        fullTask = __assign(__assign({}, task), { 
                            // CRITICAL FIX: Make absolutely sure we keep the original ID
                            id: taskId, createdAt: ChronosDateHandler.createDate(), updatedAt: ChronosDateHandler.createDate() });
                        filePath = path.join(this.tasksDir, "".concat(taskId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Save the task to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullTask, this.dateReplacer, 2))];
                    case 3:
                        // Save the task to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Task ".concat(taskId, " saved successfully"));
                        return [3 /*break*/, 5];
                    case 4:
                        error_22 = _a.sent();
                        console.error("FileSystemStorage: Error saving task ".concat(taskId, ":"), error_22.message);
                        throw error_22;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load a task from storage by its ID
     * @param taskId The ID of the task to load
     * @returns The task object if found, null otherwise
     */
    FileSystemStorage.prototype.loadTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var directFilePath, data, task, directError_1, files, _i, files_5, file, filePath, fileData, possibleTask, fileReadError_1, dirReadError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Loading task with ID: ".concat(taskId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        directFilePath = path.join(this.tasksDir, "".concat(taskId, ".json"));
                        console.log("FileSystemStorage: First attempting direct path: ".concat(directFilePath));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 17]);
                        return [4 /*yield*/, fs.readFile(directFilePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        task = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Task ".concat(taskId, " loaded successfully via direct path"));
                        return [2 /*return*/, this.ensureDatesInObject(task)];
                    case 4:
                        directError_1 = _a.sent();
                        if (!(directError_1.code === 'ENOENT')) return [3 /*break*/, 15];
                        console.log("FileSystemStorage: Task not found at direct path, will scan directory");
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 13, , 14]);
                        return [4 /*yield*/, fs.readdir(this.tasksDir)];
                    case 6:
                        files = _a.sent();
                        console.log("FileSystemStorage: Found ".concat(files.length, " files in tasks directory"));
                        _i = 0, files_5 = files;
                        _a.label = 7;
                    case 7:
                        if (!(_i < files_5.length)) return [3 /*break*/, 12];
                        file = files_5[_i];
                        if (!file.endsWith('.json') || file.startsWith('subtasks_') || file.startsWith('chunk_')) {
                            return [3 /*break*/, 11]; // Skip non-task files
                        }
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        filePath = path.join(this.tasksDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 9:
                        fileData = _a.sent();
                        possibleTask = JSON.parse(fileData, this.dateReviver);
                        // Check if this file contains our task
                        if (possibleTask.id === taskId) {
                            console.log("FileSystemStorage: Found task ".concat(taskId, " in file ").concat(file));
                            return [2 /*return*/, this.ensureDatesInObject(possibleTask)];
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        fileReadError_1 = _a.sent();
                        console.error("FileSystemStorage: Error reading file ".concat(file, ":"), fileReadError_1);
                        return [3 /*break*/, 11];
                    case 11:
                        _i++;
                        return [3 /*break*/, 7];
                    case 12:
                        // If we get here, we couldn't find the task in any file
                        console.log("FileSystemStorage: Task ".concat(taskId, " not found in any file"));
                        return [2 /*return*/, null];
                    case 13:
                        dirReadError_1 = _a.sent();
                        console.error("FileSystemStorage: Error reading tasks directory:", dirReadError_1);
                        throw dirReadError_1;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        console.error("FileSystemStorage: Error loading task ".concat(taskId, ":"), directError_1.message);
                        throw directError_1;
                    case 16: return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a task by ID
     * @param taskId ID of the task to get
     * @returns Promise that resolves with the task or null if not found
     */
    FileSystemStorage.prototype.getTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("FileSystemStorage: Getting task with ID: ".concat(taskId));
                // This is just a wrapper for loadTask to maintain interface consistency
                return [2 /*return*/, this.loadTask(taskId)];
            });
        });
    };
    /**
     * Save subtasks for a task
     * @param taskId Parent task ID
     * @param subTasks Subtasks to save
     * @returns Promise that resolves when subtasks are saved
     */
    FileSystemStorage.prototype.saveSubTasks = function (taskId, subTasks) {
        return __awaiter(this, void 0, void 0, function () {
            var processedSubTasks, filePath, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Saving ".concat(subTasks.length, " subtasks for task ").concat(taskId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        processedSubTasks = subTasks.map(function (subTask) { return (__assign(__assign({}, subTask), { id: subTask.id || uuidv4(), taskId: taskId, createdAt: new Date(), updatedAt: new Date() })); });
                        filePath = path.join(this.tasksDir, "subtasks_".concat(taskId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Save the subtasks to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(processedSubTasks, this.dateReplacer, 2))];
                    case 3:
                        // Save the subtasks to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Subtasks for task ".concat(taskId, " saved successfully"));
                        return [3 /*break*/, 5];
                    case 4:
                        error_23 = _a.sent();
                        console.error("FileSystemStorage: Error saving subtasks for task ".concat(taskId, ":"), error_23.message);
                        throw error_23;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get subtasks for a task
     * @param taskId Parent task ID
     * @returns Promise that resolves with the subtasks or an empty array if none found
     */
    FileSystemStorage.prototype.getSubTasks = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, subTasks, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting subtasks for task ".concat(taskId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.tasksDir, "subtasks_".concat(taskId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        subTasks = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Retrieved ".concat(subTasks.length, " subtasks for task ").concat(taskId));
                        return [2 /*return*/, subTasks];
                    case 4:
                        error_24 = _a.sent();
                        if (error_24.code === 'ENOENT') {
                            console.log("FileSystemStorage: No subtasks found for task ".concat(taskId));
                            return [2 /*return*/, []]; // File not found, return empty array
                        }
                        console.error("FileSystemStorage: Error getting subtasks for task ".concat(taskId, ":"), error_24.message);
                        throw error_24;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a task and its subtasks
     * @param taskId ID of the task to delete
     * @returns Promise that resolves with true if the task was deleted, false if it wasn't found
     */
    FileSystemStorage.prototype.deleteTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var taskFilePath, subTasksFilePath, subTasksError_1, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting task ".concat(taskId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        taskFilePath = path.join(this.tasksDir, "".concat(taskId, ".json"));
                        subTasksFilePath = path.join(this.tasksDir, "subtasks_".concat(taskId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        // Check if task exists
                        return [4 /*yield*/, fs.access(taskFilePath)];
                    case 3:
                        // Check if task exists
                        _a.sent();
                        // Delete the task file
                        return [4 /*yield*/, fs.unlink(taskFilePath)];
                    case 4:
                        // Delete the task file
                        _a.sent();
                        console.log("FileSystemStorage: Task ".concat(taskId, " deleted successfully"));
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 8, , 9]);
                        return [4 /*yield*/, fs.access(subTasksFilePath)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, fs.unlink(subTasksFilePath)];
                    case 7:
                        _a.sent();
                        console.log("FileSystemStorage: Subtasks for task ".concat(taskId, " deleted successfully"));
                        return [3 /*break*/, 9];
                    case 8:
                        subTasksError_1 = _a.sent();
                        if (subTasksError_1.code !== 'ENOENT') {
                            console.error("FileSystemStorage: Error deleting subtasks for task ".concat(taskId, ":"), subTasksError_1.message);
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, true];
                    case 10:
                        error_25 = _a.sent();
                        if (error_25.code === 'ENOENT') {
                            console.log("FileSystemStorage: Task ".concat(taskId, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage: Error deleting task ".concat(taskId, ":"), error_25.message);
                        throw error_25;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all tasks
     * @param limit Maximum number of tasks to return
     * @returns Promise that resolves with an array of tasks
     */
    FileSystemStorage.prototype.getAllTasks = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var files, taskFiles, tasks, _i, taskFiles_1, file, filePath, data, task, fileError_1, limitedTasks, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting all tasks".concat(limit ? " (limit: ".concat(limit, ")") : ''));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.tasksDir)];
                    case 3:
                        files = _a.sent();
                        taskFiles = files.filter(function (file) {
                            return file.endsWith('.json') &&
                                !file.startsWith('subtasks_') &&
                                !file.startsWith('chunk_');
                        });
                        tasks = [];
                        _i = 0, taskFiles_1 = taskFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < taskFiles_1.length)) return [3 /*break*/, 9];
                        file = taskFiles_1[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.tasksDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        task = JSON.parse(data, this.dateReviver);
                        tasks.push(task);
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_1 = _a.sent();
                        console.error("FileSystemStorage: Error reading task file ".concat(file, ":"), fileError_1.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        // Sort tasks by creation date (newest first)
                        tasks.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); });
                        limitedTasks = limit ? tasks.slice(0, limit) : tasks;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedTasks.length, " tasks"));
                        return [2 /*return*/, limitedTasks];
                    case 10:
                        error_26 = _a.sent();
                        if (error_26.code === 'ENOENT') {
                            console.log("FileSystemStorage: Tasks directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting all tasks:", error_26.message);
                        throw error_26;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new chunk
     * @param chunk Chunk data to save
     * @returns Promise that resolves with the created Chunk object
     */
    FileSystemStorage.prototype.createChunk = function (chunk) {
        return __awaiter(this, void 0, void 0, function () {
            var chunkId, fullChunk, filePath, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating chunk with index: ".concat(chunk.chunkIndex));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        chunkId = chunk.id || uuidv4();
                        fullChunk = __assign(__assign({}, chunk), { id: chunkId, createdAt: new Date(), updatedAt: new Date() });
                        filePath = path.join(this.chunksDir, "chunk_".concat(chunkId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Save the chunk to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullChunk, this.dateReplacer, 2))];
                    case 3:
                        // Save the chunk to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Chunk ".concat(chunkId, " created successfully"));
                        return [2 /*return*/, fullChunk];
                    case 4:
                        error_27 = _a.sent();
                        console.error("FileSystemStorage: Error creating chunk ".concat(chunkId, ":"), error_27.message);
                        throw error_27;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a chunk by ID
     * @param id ID of the chunk to retrieve
     * @returns Promise that resolves with the chunk or null if not found
     */
    FileSystemStorage.prototype.getChunk = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, chunk, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting chunk with ID: ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.chunksDir, "chunk_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        chunk = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Chunk ".concat(id, " retrieved successfully"));
                        return [2 /*return*/, chunk];
                    case 4:
                        error_28 = _a.sent();
                        if (error_28.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunk ".concat(id, " not found"));
                            return [2 /*return*/, null]; // File not found, return null (not undefined) to match interface
                        }
                        console.error("FileSystemStorage: Error getting chunk ".concat(id, ":"), error_28.message);
                        throw error_28;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all chunks based on filter criteria
     * @param limit Maximum number of chunks to return
     * @param filter Optional filter criteria
     * @returns Promise that resolves with an array of chunks
     */
    FileSystemStorage.prototype.getAllChunks = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var files, chunkFiles, chunks, _i, chunkFiles_1, file, filePath, data, chunk, include, stateFilter, fileError_2, limitedChunks, error_29;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting chunks with filter: ".concat(filter ? JSON.stringify(filter) : 'none'));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.chunksDir)];
                    case 3:
                        files = _a.sent();
                        chunkFiles = files.filter(function (file) { return file.startsWith('chunk_') && file.endsWith('.json'); });
                        chunks = [];
                        _i = 0, chunkFiles_1 = chunkFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < chunkFiles_1.length)) return [3 /*break*/, 9];
                        file = chunkFiles_1[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.chunksDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        chunk = JSON.parse(data, this.dateReviver);
                        // Apply filter if provided
                        if (filter) {
                            include = true;
                            // Filter by taskId if provided
                            if (filter.taskId && chunk.parentTaskId !== filter.taskId) {
                                include = false;
                            }
                            // Filter by parentId if provided
                            if (include && filter.parentId && chunk.parentChunkId !== filter.parentId) {
                                include = false;
                            }
                            // Filter by state if provided (support both state and chunkState properties)
                            if (include && (filter.state || filter.chunkState)) {
                                stateFilter = filter.chunkState || filter.state;
                                if (chunk.chunkState !== stateFilter) {
                                    include = false;
                                }
                            }
                            // Filter by qrnId if provided
                            if (include && filter.qrnId && chunk.qrnId !== filter.qrnId) {
                                include = false;
                            }
                            if (!include)
                                return [3 /*break*/, 8];
                        }
                        chunks.push(chunk);
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_2 = _a.sent();
                        console.error("FileSystemStorage: Error reading chunk file ".concat(file, ":"), fileError_2.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        // Sort chunks by creation date (newest first)
                        chunks.sort(function (a, b) {
                            // Handle both Date objects and ISO strings by ensuring both are converted to numbers
                            var dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
                            var dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
                            return dateB - dateA;
                        });
                        limitedChunks = limit ? chunks.slice(0, limit) : chunks;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedChunks.length, " chunks"));
                        return [2 /*return*/, limitedChunks];
                    case 10:
                        error_29 = _a.sent();
                        if (error_29.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunks directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting chunks:", error_29.message);
                        throw error_29;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * For backward compatibility - redirects to getAllChunks
     * @deprecated Use getAllChunks instead
     */
    FileSystemStorage.prototype.getChunks = function (filter, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getAllChunks(limit, filter)];
            });
        });
    };
    /**
     * Update a chunk
     * @param id ID of the chunk to update
     * @param updates Partial chunk data to update
     * @returns Promise that resolves with the updated chunk or null if not found
     */
    FileSystemStorage.prototype.updateChunk = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingChunk, updatedChunk, error_30;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating chunk with ID: ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.chunksDir, "chunk_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingChunk = JSON.parse(data, this.dateReviver);
                        updatedChunk = __assign(__assign(__assign({}, existingChunk), updates), { id: id, updatedAt: new Date() // Update modification time
                         });
                        // Save the updated chunk
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedChunk, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated chunk
                        _a.sent();
                        console.log("FileSystemStorage: Chunk ".concat(id, " updated successfully"));
                        return [2 /*return*/, updatedChunk];
                    case 5:
                        error_30 = _a.sent();
                        if (error_30.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunk ".concat(id, " not found for update"));
                            return [2 /*return*/, null]; // File not found, return null
                        }
                        console.error("FileSystemStorage: Error updating chunk ".concat(id, ":"), error_30.message);
                        throw error_30;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a chunk
     * @param id ID of the chunk to delete
     * @returns Promise that resolves with true if the chunk was deleted, false if it wasn't found
     */
    FileSystemStorage.prototype.deleteChunk = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_31;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting chunk ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.chunksDir, "chunk_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        // Check if chunk exists
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        // Check if chunk exists
                        _a.sent();
                        // Delete the chunk file
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        // Delete the chunk file
                        _a.sent();
                        console.log("FileSystemStorage: Chunk ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_31 = _a.sent();
                        if (error_31.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunk ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage: Error deleting chunk ".concat(id, ":"), error_31.message);
                        throw error_31;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update the state of a chunk
     * @param id ID of the chunk to update
     * @param state New state for the chunk
     * @returns Promise that resolves with the updated chunk or undefined if not found
     */
    FileSystemStorage.prototype.updateChunkState = function (id, state) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingChunk, updatedChunk, error_32;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating chunk ".concat(id, " state to ").concat(state));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.chunksDir, "chunk_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingChunk = JSON.parse(data, this.dateReviver);
                        updatedChunk = __assign(__assign({}, existingChunk), { chunkState: state, updatedAt: new Date() // Update modification time
                         });
                        // Save the updated chunk
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedChunk, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated chunk
                        _a.sent();
                        console.log("FileSystemStorage: Chunk ".concat(id, " state updated to ").concat(state, " successfully"));
                        return [2 /*return*/, updatedChunk];
                    case 5:
                        error_32 = _a.sent();
                        if (error_32.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunk ".concat(id, " not found for state update"));
                            return [2 /*return*/, null]; // File not found, return null to match interface expectations
                        }
                        console.error("FileSystemStorage: Error updating chunk ".concat(id, " state:"), error_32.message);
                        throw error_32;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a user by ID
     * @param id User ID
     * @returns Promise that resolves with the user or undefined if not found
     */
    FileSystemStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, user, error_33;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting user with ID: ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.usersDir, "user_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        user = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: User ".concat(id, " retrieved successfully"));
                        return [2 /*return*/, user];
                    case 4:
                        error_33 = _a.sent();
                        if (error_33.code === 'ENOENT') {
                            console.log("FileSystemStorage: User ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error getting user ".concat(id, ":"), error_33.message);
                        throw error_33;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a user by username
     * @param username Username to search for
     * @returns Promise that resolves with the user or undefined if not found
     */
    FileSystemStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var files, userFiles, _i, userFiles_1, file, filePath, data, user, fileError_3, error_34;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting user with username: ".concat(username));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.usersDir)];
                    case 3:
                        files = _a.sent();
                        userFiles = files.filter(function (file) { return file.startsWith('user_') && file.endsWith('.json'); });
                        _i = 0, userFiles_1 = userFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < userFiles_1.length)) return [3 /*break*/, 9];
                        file = userFiles_1[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.usersDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        user = JSON.parse(data, this.dateReviver);
                        if (user.username === username) {
                            console.log("FileSystemStorage: User with username ".concat(username, " found with ID ").concat(user.id));
                            return [2 /*return*/, user];
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_3 = _a.sent();
                        console.error("FileSystemStorage: Error reading user file ".concat(file, ":"), fileError_3.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        console.log("FileSystemStorage: User with username ".concat(username, " not found"));
                        return [2 /*return*/, undefined]; // No matching user found
                    case 10:
                        error_34 = _a.sent();
                        if (error_34.code === 'ENOENT') {
                            console.log("FileSystemStorage: Users directory not found, returning undefined");
                            return [2 /*return*/, undefined]; // Directory doesn't exist yet, return undefined
                        }
                        console.error("FileSystemStorage: Error finding user by username ".concat(username, ":"), error_34.message);
                        throw error_34;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new user
     * @param user User data to save
     * @returns Promise that resolves with the created User object
     */
    FileSystemStorage.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, nextId, files, userFiles, _i, userFiles_2, file, match, id, error_35, fullUser, filePath, error_36;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating user with username: ".concat(user.username));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getUserByUsername(user.username)];
                    case 2:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error("User with username ".concat(user.username, " already exists"));
                        }
                        nextId = 1;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.readdir(this.usersDir)];
                    case 4:
                        files = _a.sent();
                        userFiles = files.filter(function (file) { return file.startsWith('user_') && file.endsWith('.json'); });
                        for (_i = 0, userFiles_2 = userFiles; _i < userFiles_2.length; _i++) {
                            file = userFiles_2[_i];
                            match = file.match(/user_(\d+)\.json/);
                            if (match) {
                                id = parseInt(match[1], 10);
                                if (id >= nextId) {
                                    nextId = id + 1;
                                }
                            }
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_35 = _a.sent();
                        if (error_35.code !== 'ENOENT') {
                            throw error_35;
                        }
                        return [3 /*break*/, 6];
                    case 6:
                        fullUser = __assign(__assign({}, user), { id: nextId, role: user.role || 'user', createdAt: new Date() });
                        filePath = path.join(this.usersDir, "user_".concat(nextId, ".json"));
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        // Save the user to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullUser, this.dateReplacer, 2))];
                    case 8:
                        // Save the user to the file system
                        _a.sent();
                        console.log("FileSystemStorage: User ".concat(nextId, " created successfully"));
                        return [2 /*return*/, fullUser];
                    case 9:
                        error_36 = _a.sent();
                        console.error("FileSystemStorage: Error creating user:", error_36.message);
                        throw error_36;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a user
     * @param id User ID
     * @param user Partial user data to update
     * @returns Promise that resolves with the updated user or undefined if not found
     */
    FileSystemStorage.prototype.updateUser = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingUser, userWithSameUsername, updatedUser, error_37;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating user with ID: ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.usersDir, "user_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingUser = JSON.parse(data, this.dateReviver);
                        if (!(user.username && user.username !== existingUser.username)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getUserByUsername(user.username)];
                    case 4:
                        userWithSameUsername = _a.sent();
                        if (userWithSameUsername && userWithSameUsername.id !== id) {
                            throw new Error("User with username ".concat(user.username, " already exists"));
                        }
                        _a.label = 5;
                    case 5:
                        updatedUser = __assign(__assign(__assign({}, existingUser), user), { id: id // Ensure ID stays the same
                         });
                        // Save the updated user
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedUser, this.dateReplacer, 2))];
                    case 6:
                        // Save the updated user
                        _a.sent();
                        console.log("FileSystemStorage: User ".concat(id, " updated successfully"));
                        return [2 /*return*/, updatedUser];
                    case 7:
                        error_37 = _a.sent();
                        if (error_37.code === 'ENOENT') {
                            console.log("FileSystemStorage: User ".concat(id, " not found for update"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error updating user ".concat(id, ":"), error_37.message);
                        throw error_37;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all users
     * @param limit Maximum number of users to return
     * @returns Promise that resolves with an array of users
     */
    FileSystemStorage.prototype.getAllUsers = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            var files, userFiles, users, _i, userFiles_3, file, filePath, data, user, fileError_4, limitedUsers, error_38;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting all users".concat(limit ? " (limit: ".concat(limit, ")") : ''));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.usersDir)];
                    case 3:
                        files = _a.sent();
                        userFiles = files.filter(function (file) { return file.startsWith('user_') && file.endsWith('.json'); });
                        users = [];
                        _i = 0, userFiles_3 = userFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < userFiles_3.length)) return [3 /*break*/, 9];
                        file = userFiles_3[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.usersDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        user = JSON.parse(data, this.dateReviver);
                        users.push(user);
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_4 = _a.sent();
                        console.error("FileSystemStorage: Error reading user file ".concat(file, ":"), fileError_4.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        // Sort users by ID
                        users.sort(function (a, b) { return a.id - b.id; });
                        limitedUsers = limit ? users.slice(0, limit) : users;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedUsers.length, " users"));
                        return [2 /*return*/, limitedUsers];
                    case 10:
                        error_38 = _a.sent();
                        if (error_38.code === 'ENOENT') {
                            console.log("FileSystemStorage: Users directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting all users:", error_38.message);
                        throw error_38;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all API keys
     * @returns Promise that resolves with an array of API keys
     */
    FileSystemStorage.prototype.getAllApiKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiKeysDir, files, apiKeyFiles, apiKeys, _i, apiKeyFiles_1, file, filePath, data, apiKey, fileError_5, error_39;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage: Getting all API keys');
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        apiKeysDir = path.join(this.baseDir, 'apikeys');
                        return [4 /*yield*/, fs.mkdir(apiKeysDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 11, , 12]);
                        return [4 /*yield*/, fs.readdir(apiKeysDir)];
                    case 4:
                        files = _a.sent();
                        apiKeyFiles = files.filter(function (file) { return file.startsWith('apikey_') && file.endsWith('.json'); });
                        apiKeys = [];
                        _i = 0, apiKeyFiles_1 = apiKeyFiles;
                        _a.label = 5;
                    case 5:
                        if (!(_i < apiKeyFiles_1.length)) return [3 /*break*/, 10];
                        file = apiKeyFiles_1[_i];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        filePath = path.join(apiKeysDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 7:
                        data = _a.sent();
                        apiKey = JSON.parse(data, this.dateReviver);
                        apiKeys.push(apiKey);
                        return [3 /*break*/, 9];
                    case 8:
                        fileError_5 = _a.sent();
                        console.error("FileSystemStorage: Error reading API key file ".concat(file, ":"), fileError_5.message);
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 5];
                    case 10:
                        // Sort API keys by ID
                        apiKeys.sort(function (a, b) { return a.id - b.id; });
                        console.log("FileSystemStorage: Retrieved ".concat(apiKeys.length, " API keys"));
                        return [2 /*return*/, apiKeys];
                    case 11:
                        error_39 = _a.sent();
                        if (error_39.code === 'ENOENT') {
                            console.log('FileSystemStorage: API keys directory not found, returning empty array');
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error('FileSystemStorage: Error getting all API keys:', error_39.message);
                        throw error_39;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get an API key by ID
     * @param id API key ID
     * @returns Promise that resolves with the API key or undefined if not found
     */
    FileSystemStorage.prototype.getApiKey = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKeysDir, filePath, data, apiKey, error_40;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting API key with ID: ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        apiKeysDir = path.join(this.baseDir, 'apikeys');
                        return [4 /*yield*/, fs.mkdir(apiKeysDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        filePath = path.join(apiKeysDir, "apikey_".concat(id, ".json"));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 4:
                        data = _a.sent();
                        apiKey = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: API key ".concat(id, " retrieved successfully"));
                        return [2 /*return*/, apiKey];
                    case 5:
                        error_40 = _a.sent();
                        if (error_40.code === 'ENOENT') {
                            console.log("FileSystemStorage: API key ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error getting API key ".concat(id, ":"), error_40.message);
                        throw error_40;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new API key
     * @param apiKey API key data to save
     * @returns Promise that resolves with the created API key
     */
    FileSystemStorage.prototype.createApiKey = function (apiKey) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKeysDir, nextId, files, apiKeyFiles, _i, apiKeyFiles_2, file, match, id, error_41, fullApiKey, filePath, error_42;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating API key with label: ".concat(apiKey.label));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        apiKeysDir = path.join(this.baseDir, 'apikeys');
                        return [4 /*yield*/, fs.mkdir(apiKeysDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        nextId = 1;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.readdir(apiKeysDir)];
                    case 4:
                        files = _a.sent();
                        apiKeyFiles = files.filter(function (file) { return file.startsWith('apikey_') && file.endsWith('.json'); });
                        for (_i = 0, apiKeyFiles_2 = apiKeyFiles; _i < apiKeyFiles_2.length; _i++) {
                            file = apiKeyFiles_2[_i];
                            match = file.match(/apikey_(\d+)\.json/);
                            if (match) {
                                id = parseInt(match[1], 10);
                                if (id >= nextId) {
                                    nextId = id + 1;
                                }
                            }
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_41 = _a.sent();
                        if (error_41.code !== 'ENOENT') {
                            throw error_41;
                        }
                        return [3 /*break*/, 6];
                    case 6:
                        fullApiKey = __assign(__assign({}, apiKey), { id: nextId, status: apiKey.status || 'active', usage: apiKey.usage || 0, usageLimit: apiKey.usageLimit || 1000, createdAt: new Date(), expiresAt: apiKey.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Default expiry: 1 year
                         });
                        filePath = path.join(apiKeysDir, "apikey_".concat(nextId, ".json"));
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        // Save the API key to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullApiKey, this.dateReplacer, 2))];
                    case 8:
                        // Save the API key to the file system
                        _a.sent();
                        console.log("FileSystemStorage: API key ".concat(nextId, " created successfully"));
                        return [2 /*return*/, fullApiKey];
                    case 9:
                        error_42 = _a.sent();
                        console.error('FileSystemStorage: Error creating API key:', error_42.message);
                        throw error_42;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update an API key
     * @param id API key ID
     * @param apiKey Partial API key data to update
     * @returns Promise that resolves with the updated API key or undefined if not found
     */
    FileSystemStorage.prototype.updateApiKey = function (id, apiKey) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKeysDir, filePath, data, existingApiKey, updatedApiKey, error_43;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating API key with ID: ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        apiKeysDir = path.join(this.baseDir, 'apikeys');
                        return [4 /*yield*/, fs.mkdir(apiKeysDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        filePath = path.join(apiKeysDir, "apikey_".concat(id, ".json"));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 4:
                        data = _a.sent();
                        existingApiKey = JSON.parse(data, this.dateReviver);
                        updatedApiKey = __assign(__assign(__assign({}, existingApiKey), apiKey), { id: id // Ensure ID stays the same
                         });
                        // Save the updated API key
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedApiKey, this.dateReplacer, 2))];
                    case 5:
                        // Save the updated API key
                        _a.sent();
                        console.log("FileSystemStorage: API key ".concat(id, " updated successfully"));
                        return [2 /*return*/, updatedApiKey];
                    case 6:
                        error_43 = _a.sent();
                        if (error_43.code === 'ENOENT') {
                            console.log("FileSystemStorage: API key ".concat(id, " not found for update"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error updating API key ".concat(id, ":"), error_43.message);
                        throw error_43;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete an API key
     * @param id ID of the API key to delete
     * @returns Promise that resolves with true if the API key was deleted, false if it wasn't found
     */
    FileSystemStorage.prototype.deleteApiKey = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKeysDir, filePath, error_44;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting API key ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        apiKeysDir = path.join(this.baseDir, 'apikeys');
                        return [4 /*yield*/, fs.mkdir(apiKeysDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        filePath = path.join(apiKeysDir, "apikey_".concat(id, ".json"));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        // Check if API key exists
                        return [4 /*yield*/, fs.access(filePath)];
                    case 4:
                        // Check if API key exists
                        _a.sent();
                        // Delete the API key file
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 5:
                        // Delete the API key file
                        _a.sent();
                        console.log("FileSystemStorage: API key ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 6:
                        error_44 = _a.sent();
                        if (error_44.code === 'ENOENT') {
                            console.log("FileSystemStorage: API key ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage: Error deleting API key ".concat(id, ":"), error_44.message);
                        throw error_44;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // System Log operations (stubs)
    FileSystemStorage.prototype.getAllSystemLogs = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.createSystemLog = function (log) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    // Media Asset operations (stubs)
    FileSystemStorage.prototype.getAllMediaAssets = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.getMediaAsset = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.createMediaAsset = function (asset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.deleteMediaAsset = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    // Pipeline Job operations (stubs)
    FileSystemStorage.prototype.getAllPipelineJobs = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.getPipelineJob = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.createPipelineJob = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.updatePipelineJobProgress = function (id, progress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    FileSystemStorage.prototype.updatePipelineJobStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Not implemented');
            });
        });
    };
    /**
     * Get all chunk dependencies with optional filtering
     * @param filter Optional filter criteria
     * @returns Promise that resolves with an array of chunk dependencies
     */
    FileSystemStorage.prototype.getAllChunkDependencies = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var files, dependencyPromises, dependencies, filteredDependencies, error_45;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('FileSystemStorage: Getting all chunk dependencies with filter:', filter);
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readdir(this.chunkDependenciesDir)];
                    case 3:
                        files = _a.sent();
                        dependencyPromises = files
                            .filter(function (file) { return file.startsWith('dependency_') && file.endsWith('.json'); })
                            .map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var filePath, data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        filePath = path.join(this.chunkDependenciesDir, file);
                                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                                    case 1:
                                        data = _a.sent();
                                        return [2 /*return*/, JSON.parse(data, this.dateReviver)];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(dependencyPromises)];
                    case 4:
                        dependencies = _a.sent();
                        filteredDependencies = dependencies;
                        if (filter) {
                            if (filter.sourceId) {
                                filteredDependencies = filteredDependencies.filter(function (dependency) { return dependency.sourceChunkId === filter.sourceId; });
                            }
                            if (filter.targetId) {
                                filteredDependencies = filteredDependencies.filter(function (dependency) { return dependency.targetChunkId === filter.targetId; });
                            }
                        }
                        console.log("FileSystemStorage: Found ".concat(filteredDependencies.length, " chunk dependencies"));
                        return [2 /*return*/, filteredDependencies];
                    case 5:
                        error_45 = _a.sent();
                        if (error_45.code === 'ENOENT') {
                            console.log('FileSystemStorage: Chunk dependencies directory not found');
                            return [2 /*return*/, []];
                        }
                        console.error('FileSystemStorage: Error getting chunk dependencies:', error_45.message);
                        throw error_45;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a chunk dependency by ID
     * @param id Chunk dependency ID
     * @returns Promise that resolves with the chunk dependency or undefined if not found
     */
    FileSystemStorage.prototype.getChunkDependency = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, dependency, error_46;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting chunk dependency ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.chunkDependenciesDir, "dependency_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        dependency = JSON.parse(data, this.dateReviver);
                        return [2 /*return*/, dependency];
                    case 4:
                        error_46 = _a.sent();
                        if (error_46.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunk dependency ".concat(id, " not found"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error getting chunk dependency ".concat(id, ":"), error_46.message);
                        throw error_46;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new chunk dependency
     * @param insertDependency Chunk dependency data to insert
     * @returns Promise that resolves with the created chunk dependency
     */
    FileSystemStorage.prototype.createChunkDependency = function (insertDependency) {
        return __awaiter(this, void 0, void 0, function () {
            var id, now, dependency, filePath, error_47;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating chunk dependency between ".concat(insertDependency.sourceChunkId, " and ").concat(insertDependency.targetChunkId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        id = insertDependency.id || uuidv4();
                        now = new Date();
                        dependency = {
                            id: id,
                            sourceChunkId: insertDependency.sourceChunkId,
                            targetChunkId: insertDependency.targetChunkId,
                            type: insertDependency.type,
                            strength: insertDependency.strength,
                            metadata: insertDependency.metadata || {},
                            createdAt: now,
                            updatedAt: now
                        };
                        filePath = path.join(this.chunkDependenciesDir, "dependency_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(dependency, this.dateReplacer, 2))];
                    case 3:
                        _a.sent();
                        console.log("FileSystemStorage: Chunk dependency ".concat(id, " created successfully"));
                        return [2 /*return*/, dependency];
                    case 4:
                        error_47 = _a.sent();
                        console.error("FileSystemStorage: Error creating chunk dependency:", error_47.message);
                        throw error_47;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a chunk dependency
     * @param id Chunk dependency ID
     * @param dependencyUpdate Partial chunk dependency data for update
     * @returns Promise that resolves with the updated chunk dependency or undefined if not found
     */
    FileSystemStorage.prototype.updateChunkDependency = function (id, dependencyUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingDependency, updatedDependency, error_48;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating chunk dependency ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.chunkDependenciesDir, "dependency_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingDependency = JSON.parse(data, this.dateReviver);
                        updatedDependency = __assign(__assign(__assign({}, existingDependency), dependencyUpdate), { id: id, updatedAt: new Date() // Update modification time
                         });
                        // Save the updated dependency
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedDependency, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated dependency
                        _a.sent();
                        console.log("FileSystemStorage: Chunk dependency ".concat(id, " updated successfully"));
                        return [2 /*return*/, updatedDependency];
                    case 5:
                        error_48 = _a.sent();
                        if (error_48.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunk dependency ".concat(id, " not found for update"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error updating chunk dependency ".concat(id, ":"), error_48.message);
                        throw error_48;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a chunk dependency
     * @param id Chunk dependency ID
     * @returns Promise that resolves with true if dependency was deleted, false if not found
     */
    FileSystemStorage.prototype.deleteChunkDependency = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_49;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting chunk dependency ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.chunkDependenciesDir, "dependency_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 3:
                        _a.sent();
                        console.log("FileSystemStorage: Chunk dependency ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 4:
                        error_49 = _a.sent();
                        if (error_49.code === 'ENOENT') {
                            console.log("FileSystemStorage: Chunk dependency ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false];
                        }
                        console.error("FileSystemStorage: Error deleting chunk dependency ".concat(id, ":"), error_49.message);
                        throw error_49;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all temporal instances with optional filtering
     * @param limit Maximum number of instances to return
     * @param filter Filter criteria for instances
     * @returns Promise that resolves with an array of TemporalInstance objects
     */
    FileSystemStorage.prototype.getAllTemporalInstances = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var files, instanceFiles, instances, _i, instanceFiles_1, file, filePath, data, instance, fileError_6, filteredInstances, limitedInstances, error_50;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting all temporal instances".concat(limit ? " (limit: ".concat(limit, ")") : '').concat(filter ? " with filter" : ''));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.temporalInstancesDir)];
                    case 3:
                        files = _a.sent();
                        instanceFiles = files.filter(function (file) { return file.startsWith('temporal_') && file.endsWith('.json'); });
                        instances = [];
                        _i = 0, instanceFiles_1 = instanceFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < instanceFiles_1.length)) return [3 /*break*/, 9];
                        file = instanceFiles_1[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.temporalInstancesDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        instance = JSON.parse(data, this.dateReviver);
                        instances.push(instance);
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_6 = _a.sent();
                        console.error("FileSystemStorage: Error reading temporal instance file ".concat(file, ":"), fileError_6.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        filteredInstances = instances;
                        if (filter) {
                            if (filter.nodeId !== undefined) {
                                filteredInstances = filteredInstances.filter(function (instance) { return instance.nodeId === filter.nodeId; });
                            }
                            if (filter.dimensionType !== undefined) {
                                filteredInstances = filteredInstances.filter(function (instance) { return instance.dimensionType === filter.dimensionType; });
                            }
                        }
                        // Sort instances by timestamp (newest first)
                        filteredInstances.sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); });
                        limitedInstances = limit ? filteredInstances.slice(0, limit) : filteredInstances;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedInstances.length, " temporal instances"));
                        return [2 /*return*/, limitedInstances];
                    case 10:
                        error_50 = _a.sent();
                        if (error_50.code === 'ENOENT') {
                            console.log("FileSystemStorage: Temporal instances directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting all temporal instances:", error_50.message);
                        throw error_50;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a temporal instance by ID
     * @param id ID of the temporal instance to retrieve
     * @returns Promise that resolves with the TemporalInstance or undefined if not found
     */
    FileSystemStorage.prototype.getTemporalInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, instance, error_51;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting temporal instance ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.temporalInstancesDir, "temporal_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        instance = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Temporal instance ".concat(id, " retrieved successfully"));
                        return [2 /*return*/, instance];
                    case 4:
                        error_51 = _a.sent();
                        if (error_51.code === 'ENOENT') {
                            console.log("FileSystemStorage: Temporal instance ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error getting temporal instance ".concat(id, ":"), error_51.message);
                        throw error_51;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Original implementation of updateTemporalInstance, accessTemporalInstance, and deleteTemporalInstance removed 
    // to avoid duplication with the implementation below
    /**
     * Create a new temporal instance
     * @param instance Temporal instance data to save
     * @returns Promise that resolves with the created TemporalInstance
     */
    FileSystemStorage.prototype.createTemporalInstance = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var instanceId, now, fullInstance, filePath, error_52;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating temporal instance for node ".concat(instance.nodeId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        instanceId = instance.id || uuidv4();
                        now = new Date();
                        fullInstance = __assign(__assign({}, instance), { id: instanceId, timestamp: instance.timestamp || now, createdAt: now, updatedAt: now });
                        filePath = path.join(this.temporalInstancesDir, "temporal_".concat(instanceId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Save the temporal instance to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullInstance, this.dateReplacer, 2))];
                    case 3:
                        // Save the temporal instance to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Temporal instance ".concat(instanceId, " created successfully"));
                        return [2 /*return*/, fullInstance];
                    case 4:
                        error_52 = _a.sent();
                        console.error("FileSystemStorage: Error creating temporal instance ".concat(instanceId, ":"), error_52.message);
                        throw error_52;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a temporal instance
     * @param id ID of the temporal instance to update
     * @param instanceUpdate Partial instance data to update
     * @returns Promise that resolves with the updated TemporalInstance or undefined if not found
     */
    FileSystemStorage.prototype.updateTemporalInstance = function (id, instanceUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingInstance, updatedInstance, error_53;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating temporal instance ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.temporalInstancesDir, "temporal_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingInstance = JSON.parse(data, this.dateReviver);
                        updatedInstance = __assign(__assign(__assign({}, existingInstance), instanceUpdate), { id: id, updatedAt: new Date() // Always update the updatedAt timestamp
                         });
                        // Save the updated instance
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedInstance, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated instance
                        _a.sent();
                        console.log("FileSystemStorage: Temporal instance ".concat(id, " updated successfully"));
                        return [2 /*return*/, updatedInstance];
                    case 5:
                        error_53 = _a.sent();
                        if (error_53.code === 'ENOENT') {
                            console.log("FileSystemStorage: Temporal instance ".concat(id, " not found for update"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error updating temporal instance ".concat(id, ":"), error_53.message);
                        throw error_53;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a temporal instance
     * @param id ID of the temporal instance to delete
     * @returns Promise that resolves with true if the instance was deleted, false if it wasn't found
     */
    FileSystemStorage.prototype.deleteTemporalInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_54;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting temporal instance ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.temporalInstancesDir, "temporal_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 3:
                        _a.sent();
                        console.log("FileSystemStorage: Temporal instance ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 4:
                        error_54 = _a.sent();
                        if (error_54.code === 'ENOENT') {
                            console.log("FileSystemStorage: Temporal instance ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage: Error deleting temporal instance ".concat(id, ":"), error_54.message);
                        throw error_54;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Access a temporal instance (records the access)
     * @param id ID of the temporal instance to access
     * @returns Promise that resolves with the accessed TemporalInstance or undefined if not found
     */
    FileSystemStorage.prototype.accessTemporalInstance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingInstance, accessedInstance, error_55;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Accessing temporal instance ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.temporalInstancesDir, "temporal_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingInstance = JSON.parse(data, this.dateReviver);
                        accessedInstance = __assign(__assign({}, existingInstance), { updatedAt: new Date() // Update the updatedAt timestamp
                         });
                        // Save the updated instance with access information
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(accessedInstance, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated instance with access information
                        _a.sent();
                        console.log("FileSystemStorage: Temporal instance ".concat(id, " accessed successfully"));
                        return [2 /*return*/, accessedInstance];
                    case 5:
                        error_55 = _a.sent();
                        if (error_55.code === 'ENOENT') {
                            console.log("FileSystemStorage: Temporal instance ".concat(id, " not found for access"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error accessing temporal instance ".concat(id, ":"), error_55.message);
                        throw error_55;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all adaptive resonances with optional filtering
     * @param limit Maximum number of adaptive resonances to return
     * @param filter Filter criteria for adaptive resonances
     * @returns Promise that resolves with an array of AdaptiveResonance objects
     */
    FileSystemStorage.prototype.getAllAdaptiveResonances = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var adaptiveResonancesDir, files, resonanceFiles, resonances, _i, resonanceFiles_1, file, filePath, data, resonance, fileError_7, filteredResonances, limitedResonances, error_56;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting all adaptive resonances".concat(limit ? " (limit: ".concat(limit, ")") : '').concat(filter ? " with filter" : ''));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
                        return [4 /*yield*/, fs.mkdir(adaptiveResonancesDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 11, , 12]);
                        return [4 /*yield*/, fs.readdir(adaptiveResonancesDir)];
                    case 4:
                        files = _a.sent();
                        resonanceFiles = files.filter(function (file) { return file.startsWith('resonance_') && file.endsWith('.json'); });
                        resonances = [];
                        _i = 0, resonanceFiles_1 = resonanceFiles;
                        _a.label = 5;
                    case 5:
                        if (!(_i < resonanceFiles_1.length)) return [3 /*break*/, 10];
                        file = resonanceFiles_1[_i];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        filePath = path.join(adaptiveResonancesDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 7:
                        data = _a.sent();
                        resonance = JSON.parse(data, this.dateReviver);
                        resonances.push(resonance);
                        return [3 /*break*/, 9];
                    case 8:
                        fileError_7 = _a.sent();
                        console.error("FileSystemStorage: Error reading adaptive resonance file ".concat(file, ":"), fileError_7.message);
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 5];
                    case 10:
                        filteredResonances = resonances;
                        if (filter) {
                            if (filter.chunkId !== undefined) {
                                filteredResonances = filteredResonances.filter(function (resonance) { return resonance.chunkId === filter.chunkId; });
                            }
                            if (filter.modelType !== undefined) {
                                filteredResonances = filteredResonances.filter(function (resonance) { return resonance.modelType === filter.modelType; });
                            }
                        }
                        // Sort resonances by strength (highest first)
                        filteredResonances.sort(function (a, b) { return b.strength - a.strength; });
                        limitedResonances = limit ? filteredResonances.slice(0, limit) : filteredResonances;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedResonances.length, " adaptive resonances"));
                        return [2 /*return*/, limitedResonances];
                    case 11:
                        error_56 = _a.sent();
                        if (error_56.code === 'ENOENT') {
                            console.log("FileSystemStorage: Adaptive resonances directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting all adaptive resonances:", error_56.message);
                        throw error_56;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get an adaptive resonance by ID
     * @param id ID of the adaptive resonance to retrieve
     * @returns Promise that resolves with the AdaptiveResonance or undefined if not found
     */
    FileSystemStorage.prototype.getAdaptiveResonance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var adaptiveResonancesDir, filePath, data, resonance, error_57;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting adaptive resonance ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
                        return [4 /*yield*/, fs.mkdir(adaptiveResonancesDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        filePath = path.join(adaptiveResonancesDir, "resonance_".concat(id, ".json"));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 4:
                        data = _a.sent();
                        resonance = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Adaptive resonance ".concat(id, " retrieved successfully"));
                        return [2 /*return*/, resonance];
                    case 5:
                        error_57 = _a.sent();
                        if (error_57.code === 'ENOENT') {
                            console.log("FileSystemStorage: Adaptive resonance ".concat(id, " not found"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error getting adaptive resonance ".concat(id, ":"), error_57.message);
                        throw error_57;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new adaptive resonance
     * @param resonance Adaptive resonance data to save
     * @returns Promise that resolves with the created AdaptiveResonance
     */
    FileSystemStorage.prototype.createAdaptiveResonance = function (resonance) {
        return __awaiter(this, void 0, void 0, function () {
            var adaptiveResonancesDir, resonanceId, now, fullResonance, filePath, error_58;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating adaptive resonance for chunk ".concat(resonance.chunkId, " and model type ").concat(resonance.modelType));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
                        return [4 /*yield*/, fs.mkdir(adaptiveResonancesDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        resonanceId = resonance.id || uuidv4();
                        now = new Date();
                        fullResonance = __assign(__assign({}, resonance), { id: resonanceId, createdAt: now, updatedAt: now });
                        filePath = path.join(adaptiveResonancesDir, "resonance_".concat(resonanceId, ".json"));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        // Save the adaptive resonance to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullResonance, this.dateReplacer, 2))];
                    case 4:
                        // Save the adaptive resonance to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Adaptive resonance ".concat(resonanceId, " created successfully"));
                        return [2 /*return*/, fullResonance];
                    case 5:
                        error_58 = _a.sent();
                        console.error("FileSystemStorage: Error creating adaptive resonance ".concat(resonanceId, ":"), error_58.message);
                        throw error_58;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update an adaptive resonance
     * @param id ID of the adaptive resonance to update
     * @param resonanceUpdate Partial resonance data to update
     * @returns Promise that resolves with the updated AdaptiveResonance or undefined if not found
     */
    FileSystemStorage.prototype.updateAdaptiveResonance = function (id, resonanceUpdate) {
        return __awaiter(this, void 0, void 0, function () {
            var adaptiveResonancesDir, filePath, data, existingResonance, updatedResonance, error_59;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating adaptive resonance ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
                        return [4 /*yield*/, fs.mkdir(adaptiveResonancesDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        filePath = path.join(adaptiveResonancesDir, "resonance_".concat(id, ".json"));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 4:
                        data = _a.sent();
                        existingResonance = JSON.parse(data, this.dateReviver);
                        updatedResonance = __assign(__assign(__assign({}, existingResonance), resonanceUpdate), { id: id, updatedAt: new Date() // Always update the updatedAt timestamp
                         });
                        // Save the updated resonance
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedResonance, this.dateReplacer, 2))];
                    case 5:
                        // Save the updated resonance
                        _a.sent();
                        console.log("FileSystemStorage: Adaptive resonance ".concat(id, " updated successfully"));
                        return [2 /*return*/, updatedResonance];
                    case 6:
                        error_59 = _a.sent();
                        if (error_59.code === 'ENOENT') {
                            console.log("FileSystemStorage: Adaptive resonance ".concat(id, " not found for update"));
                            return [2 /*return*/, undefined]; // File not found, return undefined
                        }
                        console.error("FileSystemStorage: Error updating adaptive resonance ".concat(id, ":"), error_59.message);
                        throw error_59;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete an adaptive resonance
     * @param id ID of the adaptive resonance to delete
     * @returns Promise that resolves with true if the resonance was deleted, false if it wasn't found
     */
    FileSystemStorage.prototype.deleteAdaptiveResonance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var adaptiveResonancesDir, filePath, error_60;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting adaptive resonance ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
                        return [4 /*yield*/, fs.mkdir(adaptiveResonancesDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        filePath = path.join(adaptiveResonancesDir, "resonance_".concat(id, ".json"));
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        _a.sent();
                        console.log("FileSystemStorage: Adaptive resonance ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_60 = _a.sent();
                        if (error_60.code === 'ENOENT') {
                            console.log("FileSystemStorage: Adaptive resonance ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // File not found, return false
                        }
                        console.error("FileSystemStorage: Error deleting adaptive resonance ".concat(id, ":"), error_60.message);
                        throw error_60;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new meta-cognitive event
     * @param event Event data to create
     * @returns The created event
     */
    FileSystemStorage.prototype.createMetaCognitiveEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var eventId, fullEvent, filePath, error_61;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating meta-cognitive event with type: ".concat(event.type));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        eventId = event.id || uuidv4();
                        fullEvent = __assign(__assign({}, event), { id: eventId, createdAt: new Date() });
                        filePath = path.join(this.metaCognitiveEventsDir, "event_".concat(eventId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Save the event to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullEvent, this.dateReplacer, 2))];
                    case 3:
                        // Save the event to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Meta-cognitive event ".concat(eventId, " created successfully"));
                        return [2 /*return*/, fullEvent];
                    case 4:
                        error_61 = _a.sent();
                        console.error("FileSystemStorage: Error creating meta-cognitive event ".concat(eventId, ":"), error_61.message);
                        throw error_61;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a meta-cognitive event by ID
     * @param eventId ID of the event to get
     * @returns The event or undefined if not found
     */
    FileSystemStorage.prototype.getMetaCognitiveEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, event_1, error_62;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting meta-cognitive event with ID: ".concat(eventId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.metaCognitiveEventsDir, "event_".concat(eventId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        event_1 = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Meta-cognitive event ".concat(eventId, " retrieved successfully"));
                        return [2 /*return*/, event_1];
                    case 4:
                        error_62 = _a.sent();
                        if (error_62.code === 'ENOENT') {
                            console.log("FileSystemStorage: Meta-cognitive event ".concat(eventId, " not found"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error getting meta-cognitive event ".concat(eventId, ":"), error_62.message);
                        throw error_62;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a meta-cognitive event
     * @param eventId ID of the event to update
     * @param eventData Updated event data
     * @returns The updated event or undefined if not found
     */
    FileSystemStorage.prototype.updateMetaCognitiveEvent = function (eventId, eventData) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingEvent, updatedEvent, error_63;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating meta-cognitive event ".concat(eventId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.metaCognitiveEventsDir, "event_".concat(eventId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingEvent = JSON.parse(data, this.dateReviver);
                        updatedEvent = __assign(__assign(__assign({}, existingEvent), eventData), { id: eventId, createdAt: existingEvent.createdAt // Preserve original creation date
                         });
                        // Save the updated event
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedEvent, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated event
                        _a.sent();
                        console.log("FileSystemStorage: Meta-cognitive event ".concat(eventId, " updated successfully"));
                        return [2 /*return*/, updatedEvent];
                    case 5:
                        error_63 = _a.sent();
                        if (error_63.code === 'ENOENT') {
                            console.log("FileSystemStorage: Meta-cognitive event ".concat(eventId, " not found for update"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error updating meta-cognitive event ".concat(eventId, ":"), error_63.message);
                        throw error_63;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a meta-cognitive event
     * @param eventId ID of the event to delete
     * @returns true if deleted, false if not found
     */
    FileSystemStorage.prototype.deleteMetaCognitiveEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting meta-cognitive event ".concat(eventId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.metaCognitiveEventsDir, "event_".concat(eventId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        // Check if the file exists
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        // Check if the file exists
                        _a.sent();
                        // Delete the file
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        // Delete the file
                        _a.sent();
                        console.log("FileSystemStorage: Meta-cognitive event ".concat(eventId, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_64 = _a.sent();
                        if (error_64.code === 'ENOENT') {
                            console.log("FileSystemStorage: Meta-cognitive event ".concat(eventId, " not found for deletion"));
                            return [2 /*return*/, false];
                        }
                        console.error("FileSystemStorage: Error deleting meta-cognitive event ".concat(eventId, ":"), error_64.message);
                        throw error_64;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all meta-cognitive events matching filter criteria
     * @param filter Optional filter criteria
     * @param limit Maximum number of events to return
     * @returns Array of meta-cognitive events
     */
    FileSystemStorage.prototype.getAllMetaCognitiveEvents = function (filter, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var files, jsonFiles, events, _i, jsonFiles_1, file, filePath, data, event_2, matchesNodeId, matchesType, fileError_8, limitedEvents, error_65;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting all meta-cognitive events".concat(limit ? " (limit: ".concat(limit, ")") : ''));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.metaCognitiveEventsDir)];
                    case 3:
                        files = _a.sent();
                        jsonFiles = files.filter(function (file) { return file.endsWith('.json'); });
                        events = [];
                        _i = 0, jsonFiles_1 = jsonFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < jsonFiles_1.length)) return [3 /*break*/, 9];
                        file = jsonFiles_1[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.metaCognitiveEventsDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        event_2 = JSON.parse(data, this.dateReviver);
                        // Apply filters if provided
                        if (filter) {
                            matchesNodeId = !filter.nodeId || event_2.nodeId === filter.nodeId;
                            matchesType = !filter.type || event_2.type === filter.type;
                            // Skip this event if it doesn't match ANY of the filter conditions
                            if (!matchesNodeId || !matchesType) {
                                return [3 /*break*/, 8];
                            }
                        }
                        events.push(event_2);
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_8 = _a.sent();
                        console.error("FileSystemStorage: Error reading meta-cognitive event file ".concat(file, ":"), fileError_8.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        // Sort events by creation date (newest first)
                        events.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); });
                        limitedEvents = limit ? events.slice(0, limit) : events;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedEvents.length, " meta-cognitive events"));
                        return [2 /*return*/, limitedEvents];
                    case 10:
                        error_65 = _a.sent();
                        if (error_65.code === 'ENOENT') {
                            console.log("FileSystemStorage: Meta-cognitive events directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting meta-cognitive events:", error_65.message);
                        throw error_65;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new quantum root node
     * @param node Node data to create
     * @returns The created quantum root node
     */
    FileSystemStorage.prototype.createQuantumRootNode = function (node) {
        return __awaiter(this, void 0, void 0, function () {
            var nodeId, fullNode, filePath, error_66;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating quantum root node with name: ".concat(node.name));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        nodeId = node.id || uuidv4();
                        fullNode = __assign(__assign({}, node), { id: nodeId, createdAt: new Date(), updatedAt: new Date(), state: node.state || {}, capabilities: node.capabilities || [], connections: node.connections || {}, coherenceScore: node.coherenceScore || 0.5 });
                        filePath = path.join(this.qrnMetricsDir, "node_".concat(nodeId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Save the node to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullNode, this.dateReplacer, 2))];
                    case 3:
                        // Save the node to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " created successfully"));
                        return [2 /*return*/, fullNode];
                    case 4:
                        error_66 = _a.sent();
                        console.error("FileSystemStorage: Error creating quantum root node ".concat(nodeId, ":"), error_66.message);
                        throw error_66;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a quantum root node by ID
     * @param nodeId ID of the node to get
     * @returns The node or undefined if not found
     */
    FileSystemStorage.prototype.getQuantumRootNode = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, node, error_67;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting quantum root node with ID: ".concat(nodeId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.qrnMetricsDir, "node_".concat(nodeId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        node = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " retrieved successfully"));
                        return [2 /*return*/, node];
                    case 4:
                        error_67 = _a.sent();
                        if (error_67.code === 'ENOENT') {
                            console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " not found"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error getting quantum root node ".concat(nodeId, ":"), error_67.message);
                        throw error_67;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a quantum root node
     * @param nodeId ID of the node to update
     * @param nodeData Updated node data
     * @returns The updated node or undefined if not found
     */
    FileSystemStorage.prototype.updateQuantumRootNode = function (nodeId, nodeData) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingNode, updatedNode, error_68;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating quantum root node ".concat(nodeId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.qrnMetricsDir, "node_".concat(nodeId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingNode = JSON.parse(data, this.dateReviver);
                        updatedNode = __assign(__assign(__assign({}, existingNode), nodeData), { id: nodeId, createdAt: existingNode.createdAt, updatedAt: new Date() // Update the modification date
                         });
                        // Save the updated node
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedNode, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated node
                        _a.sent();
                        console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " updated successfully"));
                        return [2 /*return*/, updatedNode];
                    case 5:
                        error_68 = _a.sent();
                        if (error_68.code === 'ENOENT') {
                            console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " not found for update"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error updating quantum root node ".concat(nodeId, ":"), error_68.message);
                        throw error_68;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a quantum root node's state
     * @param nodeId ID of the node to update
     * @param state New state data
     * @returns The updated node or undefined if not found
     */
    FileSystemStorage.prototype.updateQuantumRootNodeState = function (nodeId, state) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingNode, mergedState, updatedNode, error_69;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating quantum root node ".concat(nodeId, " state"));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.qrnMetricsDir, "node_".concat(nodeId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingNode = JSON.parse(data, this.dateReviver);
                        mergedState = __assign(__assign({}, existingNode.state), state);
                        updatedNode = __assign(__assign({}, existingNode), { state: mergedState, updatedAt: new Date(), lastActivity: new Date() });
                        // Save the updated node
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedNode, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated node
                        _a.sent();
                        console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " state updated successfully"));
                        return [2 /*return*/, updatedNode];
                    case 5:
                        error_69 = _a.sent();
                        if (error_69.code === 'ENOENT') {
                            console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " not found for state update"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error updating quantum root node ".concat(nodeId, " state:"), error_69.message);
                        throw error_69;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a quantum root node
     * @param nodeId ID of the node to delete
     * @returns true if deleted, false if not found
     */
    FileSystemStorage.prototype.deleteQuantumRootNode = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_70;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting quantum root node ".concat(nodeId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.qrnMetricsDir, "node_".concat(nodeId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        // Check if the file exists
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        // Check if the file exists
                        _a.sent();
                        // Delete the file
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        // Delete the file
                        _a.sent();
                        console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_70 = _a.sent();
                        if (error_70.code === 'ENOENT') {
                            console.log("FileSystemStorage: Quantum root node ".concat(nodeId, " not found for deletion"));
                            return [2 /*return*/, false];
                        }
                        console.error("FileSystemStorage: Error deleting quantum root node ".concat(nodeId, ":"), error_70.message);
                        throw error_70;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all quantum root nodes matching filter criteria
     * @param filter Optional filter criteria
     * @param limit Maximum number of nodes to return
     * @returns Array of quantum root nodes
     */
    FileSystemStorage.prototype.getAllQuantumRootNodes = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var files, jsonFiles, nodes, _i, jsonFiles_2, file, filePath, data, node, fileError_9, limitedNodes, error_71;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting all quantum root nodes".concat(limit ? " (limit: ".concat(limit, ")") : ''));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.qrnMetricsDir)];
                    case 3:
                        files = _a.sent();
                        jsonFiles = files.filter(function (file) { return file.endsWith('.json'); });
                        nodes = [];
                        _i = 0, jsonFiles_2 = jsonFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < jsonFiles_2.length)) return [3 /*break*/, 9];
                        file = jsonFiles_2[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.qrnMetricsDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        node = JSON.parse(data, this.dateReviver);
                        // Apply filters if provided - note that userId, type, and status fields
                        // are not defined in the core schema but might be implemented in extended versions
                        if (filter) {
                            // Skip adding to results if any filter doesn't match
                            // Use type-safe hasOwnProperty checks for potentially undefined fields
                            if (filter.userId !== undefined && (!node.hasOwnProperty('userId') || node.userId !== filter.userId)) {
                                return [3 /*break*/, 8];
                            }
                            if (filter.type !== undefined && (!node.hasOwnProperty('type') || node.type !== filter.type)) {
                                return [3 /*break*/, 8];
                            }
                            if (filter.status !== undefined && (!node.hasOwnProperty('status') || node.status !== filter.status)) {
                                return [3 /*break*/, 8];
                            }
                        }
                        nodes.push(node);
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_9 = _a.sent();
                        console.error("FileSystemStorage: Error reading quantum root node file ".concat(file, ":"), fileError_9.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        // Sort nodes by creation date (newest first)
                        nodes.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); });
                        limitedNodes = limit ? nodes.slice(0, limit) : nodes;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedNodes.length, " quantum root nodes"));
                        return [2 /*return*/, limitedNodes];
                    case 10:
                        error_71 = _a.sent();
                        if (error_71.code === 'ENOENT') {
                            console.log("FileSystemStorage: Quantum root nodes directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting quantum root nodes:", error_71.message);
                        throw error_71;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new neural pathway
     * @param pathway Pathway data to create
     * @returns The created neural pathway
     */
    FileSystemStorage.prototype.createNeuralPathway = function (pathway) {
        return __awaiter(this, void 0, void 0, function () {
            var pathwayId, fullPathway, filePath, error_72;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Creating neural pathway from ".concat(pathway.sourceId, " to ").concat(pathway.targetId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        pathwayId = pathway.id || uuidv4();
                        fullPathway = __assign(__assign({}, pathway), { id: pathwayId, createdAt: new Date(), updatedAt: new Date() });
                        filePath = path.join(this.neuralPathwaysDir, "pathway_".concat(pathwayId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Save the pathway to the file system
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(fullPathway, this.dateReplacer, 2))];
                    case 3:
                        // Save the pathway to the file system
                        _a.sent();
                        console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " created successfully"));
                        return [2 /*return*/, fullPathway];
                    case 4:
                        error_72 = _a.sent();
                        console.error("FileSystemStorage: Error creating neural pathway ".concat(pathwayId, ":"), error_72.message);
                        throw error_72;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a neural pathway by ID
     * @param pathwayId ID of the pathway to get
     * @returns The pathway or undefined if not found
     */
    FileSystemStorage.prototype.getNeuralPathway = function (pathwayId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, pathway, error_73;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting neural pathway with ID: ".concat(pathwayId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.neuralPathwaysDir, "pathway_".concat(pathwayId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        pathway = JSON.parse(data, this.dateReviver);
                        console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " retrieved successfully"));
                        return [2 /*return*/, pathway];
                    case 4:
                        error_73 = _a.sent();
                        if (error_73.code === 'ENOENT') {
                            console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " not found"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error getting neural pathway ".concat(pathwayId, ":"), error_73.message);
                        throw error_73;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a neural pathway
     * @param pathwayId ID of the pathway to update
     * @param pathwayData Updated pathway data
     * @returns The updated pathway or undefined if not found
     */
    FileSystemStorage.prototype.updateNeuralPathway = function (pathwayId, pathwayData) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, existingPathway, updatedPathway, error_74;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating neural pathway ".concat(pathwayId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.neuralPathwaysDir, "pathway_".concat(pathwayId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        data = _a.sent();
                        existingPathway = JSON.parse(data, this.dateReviver);
                        updatedPathway = __assign(__assign(__assign({}, existingPathway), pathwayData), { id: pathwayId, createdAt: existingPathway.createdAt, updatedAt: new Date() // Update the modification date
                         });
                        // Save the updated pathway
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedPathway, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated pathway
                        _a.sent();
                        console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " updated successfully"));
                        return [2 /*return*/, updatedPathway];
                    case 5:
                        error_74 = _a.sent();
                        if (error_74.code === 'ENOENT') {
                            console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " not found for update"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error updating neural pathway ".concat(pathwayId, ":"), error_74.message);
                        throw error_74;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a neural pathway
     * @param pathwayId ID of the pathway to delete
     * @returns true if deleted, false if not found
     */
    FileSystemStorage.prototype.deleteNeuralPathway = function (pathwayId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_75;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting neural pathway ".concat(pathwayId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.neuralPathwaysDir, "pathway_".concat(pathwayId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        // Check if the file exists
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        // Check if the file exists
                        _a.sent();
                        // Delete the file
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        // Delete the file
                        _a.sent();
                        console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_75 = _a.sent();
                        if (error_75.code === 'ENOENT') {
                            console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " not found for deletion"));
                            return [2 /*return*/, false];
                        }
                        console.error("FileSystemStorage: Error deleting neural pathway ".concat(pathwayId, ":"), error_75.message);
                        throw error_75;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all neural pathways matching filter criteria
     * @param filter Optional filter criteria
     * @param limit Maximum number of pathways to return
     * @returns Array of neural pathways
     */
    FileSystemStorage.prototype.getAllNeuralPathways = function (limit, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var files, jsonFiles, pathways, _i, jsonFiles_3, file, filePath, data, pathway, matchesSourceId, matchesTargetId, matchesPathType, fileError_10, limitedPathways, error_76;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Getting all neural pathways".concat(limit ? " (limit: ".concat(limit, ")") : ''));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, fs.readdir(this.neuralPathwaysDir)];
                    case 3:
                        files = _a.sent();
                        jsonFiles = files.filter(function (file) { return file.endsWith('.json'); });
                        pathways = [];
                        _i = 0, jsonFiles_3 = jsonFiles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < jsonFiles_3.length)) return [3 /*break*/, 9];
                        file = jsonFiles_3[_i];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        filePath = path.join(this.neuralPathwaysDir, file);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 6:
                        data = _a.sent();
                        pathway = JSON.parse(data, this.dateReviver);
                        // Apply filters if provided
                        if (filter) {
                            matchesSourceId = !filter.sourceId || pathway.sourceId === filter.sourceId;
                            matchesTargetId = !filter.targetId || pathway.targetId === filter.targetId;
                            matchesPathType = !filter.pathType || pathway.pathType === filter.pathType;
                            if (!matchesSourceId || !matchesTargetId || !matchesPathType) {
                                return [3 /*break*/, 8]; // Skip this pathway if it doesn't match the filter
                            }
                        }
                        pathways.push(pathway);
                        return [3 /*break*/, 8];
                    case 7:
                        fileError_10 = _a.sent();
                        console.error("FileSystemStorage: Error reading neural pathway file ".concat(file, ":"), fileError_10.message);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        // Sort pathways by creation date (newest first)
                        pathways.sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); });
                        limitedPathways = limit ? pathways.slice(0, limit) : pathways;
                        console.log("FileSystemStorage: Retrieved ".concat(limitedPathways.length, " neural pathways"));
                        return [2 /*return*/, limitedPathways];
                    case 10:
                        error_76 = _a.sent();
                        if (error_76.code === 'ENOENT') {
                            console.log("FileSystemStorage: Neural pathways directory not found, returning empty array");
                            return [2 /*return*/, []]; // Directory doesn't exist yet, return empty array
                        }
                        console.error("FileSystemStorage: Error getting neural pathways:", error_76.message);
                        throw error_76;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Record a transmission along a neural pathway
     * @param pathwayId ID of the pathway
     * @param data Optional data transmitted
     * @returns The updated pathway or undefined if not found
     */
    /**
     * Update an existing neural pathway
     * @param id ID of the pathway to update
     * @param pathway Partial pathway data to update
     * @returns The updated pathway or undefined if not found
     */
    FileSystemStorage.prototype.updateNeuralPathway = function (id, pathway) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, fileData, existingPathway, updatedPathway, error_77;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Updating neural pathway ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.neuralPathwaysDir, "pathway_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        fileData = _a.sent();
                        existingPathway = JSON.parse(fileData, this.dateReviver);
                        updatedPathway = __assign(__assign(__assign({}, existingPathway), pathway), { id: existingPathway.id, updatedAt: new Date() // Always update the timestamp
                         });
                        // Save the updated pathway
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedPathway, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated pathway
                        _a.sent();
                        console.log("FileSystemStorage: Neural pathway ".concat(id, " updated successfully"));
                        return [2 /*return*/, updatedPathway];
                    case 5:
                        error_77 = _a.sent();
                        if (error_77.code === 'ENOENT') {
                            console.log("FileSystemStorage: Neural pathway ".concat(id, " not found for update"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error updating neural pathway ".concat(id, ":"), error_77.message);
                        throw error_77;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a neural pathway
     * @param id ID of the pathway to delete
     * @returns true if deleted, false if not found
     */
    FileSystemStorage.prototype.deleteNeuralPathway = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_78;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Deleting neural pathway ".concat(id));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.neuralPathwaysDir, "pathway_".concat(id, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        // Check if file exists before attempting to delete
                        return [4 /*yield*/, fs.access(filePath)];
                    case 3:
                        // Check if file exists before attempting to delete
                        _a.sent();
                        // Delete the file
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 4:
                        // Delete the file
                        _a.sent();
                        console.log("FileSystemStorage: Neural pathway ".concat(id, " deleted successfully"));
                        return [2 /*return*/, true];
                    case 5:
                        error_78 = _a.sent();
                        if (error_78.code === 'ENOENT') {
                            console.log("FileSystemStorage: Neural pathway ".concat(id, " not found for deletion"));
                            return [2 /*return*/, false]; // Not found, return false
                        }
                        console.error("FileSystemStorage: Error deleting neural pathway ".concat(id, ":"), error_78.message);
                        throw error_78;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FileSystemStorage.prototype.recordTransmission = function (pathwayId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, fileData, existingPathway, transmissionTimestamp, currentMetadata, updatedPathway, error_79;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("FileSystemStorage: Recording transmission for neural pathway ".concat(pathwayId));
                        return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _a.sent();
                        filePath = path.join(this.neuralPathwaysDir, "pathway_".concat(pathwayId, ".json"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(filePath, 'utf8')];
                    case 3:
                        fileData = _a.sent();
                        existingPathway = JSON.parse(fileData, this.dateReviver);
                        transmissionTimestamp = new Date();
                        currentMetadata = existingPathway.metadata || {};
                        // Initialize transmissions array if it doesn't exist
                        if (!currentMetadata.transmissions) {
                            currentMetadata.transmissions = [];
                        }
                        // Add the new transmission
                        currentMetadata.transmissions.push({
                            timestamp: transmissionTimestamp,
                            data: data || {}
                        });
                        // Keep only the most recent 100 transmissions to avoid unbounded growth
                        if (currentMetadata.transmissions.length > 100) {
                            currentMetadata.transmissions = currentMetadata.transmissions.slice(-100);
                        }
                        // Update transmission statistics
                        currentMetadata.transmissionCount = (currentMetadata.transmissionCount || 0) + 1;
                        currentMetadata.lastTransmissionTime = transmissionTimestamp;
                        updatedPathway = __assign(__assign({}, existingPathway), { metadata: currentMetadata, updatedAt: transmissionTimestamp });
                        // Save the updated pathway
                        return [4 /*yield*/, fs.writeFile(filePath, JSON.stringify(updatedPathway, this.dateReplacer, 2))];
                    case 4:
                        // Save the updated pathway
                        _a.sent();
                        console.log("FileSystemStorage: Transmission recorded for neural pathway ".concat(pathwayId));
                        return [2 /*return*/, updatedPathway];
                    case 5:
                        error_79 = _a.sent();
                        if (error_79.code === 'ENOENT') {
                            console.log("FileSystemStorage: Neural pathway ".concat(pathwayId, " not found for recording transmission"));
                            return [2 /*return*/, undefined];
                        }
                        console.error("FileSystemStorage: Error recording transmission for neural pathway ".concat(pathwayId, ":"), error_79.message);
                        throw error_79;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return FileSystemStorage;
}());
export { FileSystemStorage };
