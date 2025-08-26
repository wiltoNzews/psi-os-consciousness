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
import { Router } from "express";
import { z } from "zod";
import * as openaiService from "../services/openai";
var router = Router();
// Text analysis endpoint
var textAnalysisSchema = z.object({
    text: z.string().min(1, "Text is required"),
});
router.post("/analyze-text", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = textAnalysisSchema.parse(req.body);
                return [4 /*yield*/, openaiService.analyzeText(validatedData.text)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1 instanceof z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ error: error_1.errors })];
                }
                console.error("Error in /analyze-text:", error_1);
                res.status(500).json({ error: "Failed to analyze text" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Image analysis endpoint
var imageAnalysisSchema = z.object({
    image: z.string().min(1, "Base64 image is required"),
});
router.post("/analyze-image", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = imageAnalysisSchema.parse(req.body);
                return [4 /*yield*/, openaiService.analyzeImage(validatedData.image)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                if (error_2 instanceof z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ error: error_2.errors })];
                }
                console.error("Error in /analyze-image:", error_2);
                res.status(500).json({ error: "Failed to analyze image" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Augmentation recommendations endpoint
var augmentationSchema = z.object({
    domain: z.enum(["finance", "crypto", "sports", "general"]),
    humanContext: z.string().min(1, "Human context is required"),
});
router.post("/augmentation-recommendations", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = augmentationSchema.parse(req.body);
                return [4 /*yield*/, openaiService.generateAugmentationRecommendations(validatedData.domain, validatedData.humanContext)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                if (error_3 instanceof z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ error: error_3.errors })];
                }
                console.error("Error in /augmentation-recommendations:", error_3);
                res.status(500).json({ error: "Failed to generate augmentation recommendations" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Symbiotic response endpoint
var symbioticResponseSchema = z.object({
    humanInput: z.string().min(1, "Human input is required"),
    domain: z.enum(["finance", "crypto", "sports", "general"]),
});
router.post("/symbiotic-response", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = symbioticResponseSchema.parse(req.body);
                return [4 /*yield*/, openaiService.generateSymbioticResponse(validatedData.humanInput, validatedData.domain)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4 instanceof z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ error: error_4.errors })];
                }
                console.error("Error in /symbiotic-response:", error_4);
                res.status(500).json({ error: "Failed to generate symbiotic response" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Conceptual connections mapping endpoint
var conceptualConnectionsSchema = z.object({
    domain: z.enum(["finance", "crypto", "sports", "general"]),
    concepts: z.array(z.string()).min(2, "At least two concepts are required"),
});
router.post("/conceptual-connections", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validatedData, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                validatedData = conceptualConnectionsSchema.parse(req.body);
                return [4 /*yield*/, openaiService.mapConceptualConnections(validatedData.domain, validatedData.concepts)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                if (error_5 instanceof z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ error: error_5.errors })];
                }
                console.error("Error in /conceptual-connections:", error_5);
                res.status(500).json({ error: "Failed to map conceptual connections" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
export default router;
