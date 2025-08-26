import { Router } from "express";
import { z } from "zod";
import * as openaiService from "../services/openai";

const router = Router();

// Text analysis endpoint
const textAnalysisSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

router.post("/analyze-text", async (req, res) => {
  try {
    const validatedData = textAnalysisSchema.parse(req.body);
    const result = await openaiService.analyzeText(validatedData.text);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error in /analyze-text:", error);
    res.status(500).json({ error: "Failed to analyze text" });
  }
});

// Image analysis endpoint
const imageAnalysisSchema = z.object({
  image: z.string().min(1, "Base64 image is required"),
});

router.post("/analyze-image", async (req, res) => {
  try {
    const validatedData = imageAnalysisSchema.parse(req.body);
    const result = await openaiService.analyzeImage(validatedData.image);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error in /analyze-image:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Augmentation recommendations endpoint
const augmentationSchema = z.object({
  domain: z.enum(["finance", "crypto", "sports", "general"]),
  humanContext: z.string().min(1, "Human context is required"),
});

router.post("/augmentation-recommendations", async (req, res) => {
  try {
    const validatedData = augmentationSchema.parse(req.body);
    const result = await openaiService.generateAugmentationRecommendations(
      validatedData.domain,
      validatedData.humanContext
    );
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error in /augmentation-recommendations:", error);
    res.status(500).json({ error: "Failed to generate augmentation recommendations" });
  }
});

// Symbiotic response endpoint
const symbioticResponseSchema = z.object({
  humanInput: z.string().min(1, "Human input is required"),
  domain: z.enum(["finance", "crypto", "sports", "general"]),
});

router.post("/symbiotic-response", async (req, res) => {
  try {
    const validatedData = symbioticResponseSchema.parse(req.body);
    const result = await openaiService.generateSymbioticResponse(
      validatedData.humanInput,
      validatedData.domain
    );
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error in /symbiotic-response:", error);
    res.status(500).json({ error: "Failed to generate symbiotic response" });
  }
});

// Conceptual connections mapping endpoint
const conceptualConnectionsSchema = z.object({
  domain: z.enum(["finance", "crypto", "sports", "general"]),
  concepts: z.array(z.string()).min(2, "At least two concepts are required"),
});

router.post("/conceptual-connections", async (req, res) => {
  try {
    const validatedData = conceptualConnectionsSchema.parse(req.body);
    const result = await openaiService.mapConceptualConnections(
      validatedData.domain,
      validatedData.concepts
    );
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error in /conceptual-connections:", error);
    res.status(500).json({ error: "Failed to map conceptual connections" });
  }
});

export default router;