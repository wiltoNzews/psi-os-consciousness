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
import { Router } from 'express';
import { storage } from '../storage.js';
import { importDataFromFile } from '../services/data-importer.js';
import { analyzeDataset } from '../services/openai-analyzer.js';
import { z } from 'zod';
import { insertDatasetSchema } from '../../shared/schema-minimal.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
// Setup multer for file uploads
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            var uploadDir = path.join(process.cwd(), 'uploads');
            // Create directory if it doesn't exist
            fs.mkdir(uploadDir, { recursive: true })
                .then(function () { return cb(null, uploadDir); })
                .catch(function (err) { return cb(err, uploadDir); });
        },
        filename: function (req, file, cb) {
            var filename = "".concat(uuidv4(), "-").concat(file.originalname);
            cb(null, filename);
        }
    }),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB file size limit
    }
});
// Create router
var router = Router();
// Get all datasets with optional filtering
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, filter, datasets, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                filter = {};
                if (req.query.createdBy) {
                    filter.createdBy = parseInt(req.query.createdBy);
                }
                if (req.query.isPublic === 'true') {
                    filter.isPublic = true;
                }
                else if (req.query.isPublic === 'false') {
                    filter.isPublic = false;
                }
                return [4 /*yield*/, storage.getAllDatasets(limit, filter)];
            case 1:
                datasets = _a.sent();
                res.json(datasets);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching datasets:', error_1);
                res.status(500).json({ error: 'Failed to fetch datasets' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get a specific dataset by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, dataset, columns, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getDataset(id)];
            case 1:
                dataset = _a.sent();
                if (!dataset) {
                    return [2 /*return*/, res.status(404).json({ error: 'Dataset not found' })];
                }
                return [4 /*yield*/, storage.getDatasetColumns(id)];
            case 2:
                columns = _a.sent();
                res.json(__assign(__assign({}, dataset), { columns: columns }));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Error fetching dataset:', error_2);
                res.status(500).json({ error: 'Failed to fetch dataset' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create a new dataset
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validationResult, dataset, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validationResult = insertDatasetSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid dataset data',
                            details: validationResult.error.errors
                        })];
                }
                return [4 /*yield*/, storage.createDataset(validationResult.data)];
            case 1:
                dataset = _a.sent();
                res.status(201).json(dataset);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error creating dataset:', error_3);
                res.status(500).json({ error: 'Failed to create dataset' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update a dataset
router.patch('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingDataset, updateSchema, validationResult, updatedDataset, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getDataset(id)];
            case 1:
                existingDataset = _a.sent();
                if (!existingDataset) {
                    return [2 /*return*/, res.status(404).json({ error: 'Dataset not found' })];
                }
                updateSchema = insertDatasetSchema.partial();
                validationResult = updateSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid dataset data',
                            details: validationResult.error.errors
                        })];
                }
                return [4 /*yield*/, storage.updateDataset(id, validationResult.data)];
            case 2:
                updatedDataset = _a.sent();
                res.json(updatedDataset);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating dataset:', error_4);
                res.status(500).json({ error: 'Failed to update dataset' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete a dataset
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingDataset, deleted, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                return [4 /*yield*/, storage.getDataset(id)];
            case 1:
                existingDataset = _a.sent();
                if (!existingDataset) {
                    return [2 /*return*/, res.status(404).json({ error: 'Dataset not found' })];
                }
                return [4 /*yield*/, storage.deleteDataset(id)];
            case 2:
                deleted = _a.sent();
                if (deleted) {
                    res.status(204).send();
                }
                else {
                    res.status(500).json({ error: 'Failed to delete dataset' });
                }
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Error deleting dataset:', error_5);
                res.status(500).json({ error: 'Failed to delete dataset' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Import a file as a dataset
router.post('/import', upload.single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var importOptionsSchema, validationResult, options, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: 'No file uploaded' })];
                }
                importOptionsSchema = z.object({
                    datasetName: z.string().optional(),
                    datasetDescription: z.string().optional(),
                    format: z.string().default('csv'),
                    hasHeader: z.boolean().default(true),
                    delimiter: z.string().default(','),
                    isPublic: z.boolean().default(false),
                    tags: z.array(z.string()).optional(),
                    userId: z.number().default(1), // Default to user 1 for now
                });
                validationResult = importOptionsSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid import options',
                            details: validationResult.error.errors
                        })];
                }
                options = validationResult.data;
                return [4 /*yield*/, importDataFromFile({
                        userId: options.userId,
                        filename: req.file.originalname,
                        filePath: req.file.path,
                        format: options.format,
                        hasHeader: options.hasHeader,
                        delimiter: options.delimiter,
                        datasetName: options.datasetName,
                        datasetDescription: options.datasetDescription,
                        isPublic: options.isPublic,
                        tags: options.tags,
                    })];
            case 1:
                result = _a.sent();
                res.status(201).json(result);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error importing dataset:', error_6);
                res.status(500).json({ error: 'Failed to import dataset', details: error_6 instanceof Error ? error_6.message : String(error_6) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Analyze a dataset
router.post('/:id/analyze', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var datasetId, dataset, analysisOptionsSchema, validationResult, options, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                datasetId = parseInt(req.params.id);
                return [4 /*yield*/, storage.getDataset(datasetId)];
            case 1:
                dataset = _a.sent();
                if (!dataset) {
                    return [2 /*return*/, res.status(404).json({ error: 'Dataset not found' })];
                }
                analysisOptionsSchema = z.object({
                    analysisType: z.enum(['summary', 'trends', 'anomalies', 'correlations', 'clustering', 'comprehensive']),
                    userId: z.number().default(1), // Default to user 1 for now
                    options: z.object({
                        confidenceThreshold: z.number().min(0).max(1).optional(),
                        maxInsights: z.number().positive().optional(),
                        includeVisualizations: z.boolean().optional(),
                        focusColumns: z.array(z.string()).optional(),
                        timeRange: z.object({
                            start: z.string(),
                            end: z.string()
                        }).optional(),
                    }).optional(),
                });
                validationResult = analysisOptionsSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid analysis options',
                            details: validationResult.error.errors
                        })];
                }
                options = validationResult.data;
                return [4 /*yield*/, analyzeDataset({
                        datasetId: datasetId,
                        userId: options.userId,
                        analysisType: options.analysisType,
                        options: options.options,
                    })];
            case 2:
                result = _a.sent();
                res.status(200).json(result);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error('Error analyzing dataset:', error_7);
                res.status(500).json({ error: 'Failed to analyze dataset', details: error_7 instanceof Error ? error_7.message : String(error_7) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
export default router;
