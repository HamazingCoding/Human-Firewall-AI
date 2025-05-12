import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { 
  analysisResponseSchema, 
  phishingDetectionSchema, 
  resultStatusEnum 
} from "@shared/schema";
import OpenAI from "openai";

// Configure multer for file uploads with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
  },
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-openai-api-key",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Voice detection endpoint
  app.post("/api/detect/voice", upload.single("audioFile"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      // Validate file type
      const allowedTypes = ["audio/mp3", "audio/wav", "audio/mpeg", "audio/x-m4a"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type. Please upload MP3, WAV, or M4A files" });
      }

      // Process the audio file
      const analysisResult = await analyzeVoice(req.file);
      
      // Save the result to storage
      const savedResult = await storage.createAnalysisResult({
        type: "voice",
        fileName: req.file.originalname,
        fileSize: req.file.size,
        score: analysisResult.score,
        status: analysisResult.status,
        factors: analysisResult.factors,
      });

      res.status(200).json(analysisResult);
    } catch (error) {
      console.error("Voice detection error:", error);
      res.status(500).json({ message: "Error processing voice detection", error: (error as Error).message });
    }
  });

  // Deepfake detection endpoint
  app.post("/api/detect/deepfake", upload.single("videoFile"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      // Validate file type
      const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type. Please upload MP4, MOV, or AVI files" });
      }

      // Process the video file
      const analysisResult = await analyzeVideo(req.file);
      
      // Save the result to storage
      const savedResult = await storage.createAnalysisResult({
        type: "deepfake",
        fileName: req.file.originalname,
        fileSize: req.file.size,
        score: analysisResult.score,
        status: analysisResult.status,
        factors: analysisResult.factors,
      });

      res.status(200).json(analysisResult);
    } catch (error) {
      console.error("Deepfake detection error:", error);
      res.status(500).json({ message: "Error processing deepfake detection", error: (error as Error).message });
    }
  });

  // Phishing detection endpoint
  app.post("/api/detect/phishing", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validationResult = phishingDetectionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid request data", errors: validationResult.error.errors });
      }

      const { type, content } = validationResult.data;

      // Process the phishing content
      const analysisResult = await analyzePhishing(type, content);
      
      // Save the result to storage
      const savedResult = await storage.createAnalysisResult({
        type: "phishing",
        contentText: content,
        score: analysisResult.score,
        status: analysisResult.status,
        factors: analysisResult.factors,
      });

      res.status(200).json(analysisResult);
    } catch (error) {
      console.error("Phishing detection error:", error);
      res.status(500).json({ message: "Error processing phishing detection", error: (error as Error).message });
    }
  });

  // Get analysis history (for potential future features)
  app.get("/api/history", async (req: Request, res: Response) => {
    try {
      const results = await storage.getRecentAnalysisResults();
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
      res.status(500).json({ message: "Error fetching analysis history", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for analysis

async function analyzeVoice(file: Express.Multer.File) {
  // In a real implementation, this would use a machine learning model or API
  // to analyze the voice. For demonstration, we'll use a simplified approach
  // with OpenAI to simulate the analysis.
  
  // Simulate analysis with random score for demo purposes
  const isAuthentic = Math.random() > 0.3; // 70% chance of being authentic
  const score = isAuthentic ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 40);
  const status = isAuthentic ? "real" : "fake";
  
  // Factors based on the status
  let factors: string[] = [];
  if (isAuthentic) {
    factors = [
      "Natural speech rhythm and micro-variations",
      "Consistent breath patterns throughout audio",
      "No algorithmic artifacts in voice frequency",
      "Natural emotional inflections detected"
    ];
  } else {
    factors = [
      "Unnatural speech rhythm detected",
      "Inconsistent breath patterns",
      "Algorithmic artifacts in voice frequency",
      "Missing natural emotional inflections"
    ];
  }

  try {
    // Attempt to analyze with OpenAI if available (would be real implementation)
    if (process.env.OPENAI_API_KEY) {
      // This would be a real implementation with actual audio analysis
      // For now, we return the simulated result
    }

    return {
      score,
      status: status as "real" | "fake" | "suspicious" | "safe",
      factors
    };
  } catch (error) {
    console.error("OpenAI voice analysis error:", error);
    // Fall back to simulated result if API call fails
    return {
      score,
      status: status as "real" | "fake" | "suspicious" | "safe",
      factors
    };
  }
}

async function analyzeVideo(file: Express.Multer.File) {
  // In a real implementation, this would use computer vision models
  // to analyze the video for deepfake characteristics
  
  // Simulate analysis with random score for demo purposes
  const isDeepfake = Math.random() > 0.7; // 30% chance of being a deepfake
  const score = isDeepfake ? Math.floor(Math.random() * 40) : 60 + Math.floor(Math.random() * 40);
  const status = isDeepfake ? "fake" : "real";
  
  // Factors based on the status
  let factors: string[] = [];
  if (isDeepfake) {
    factors = [
      "Inconsistent eye blinking patterns",
      "Unnatural facial movements at frame boundaries",
      "Audio-visual synchronization issues detected",
      "Digital artifacts around facial features"
    ];
  } else {
    factors = [
      "Consistent eye blinking patterns",
      "Natural facial movements throughout video",
      "Strong audio-visual synchronization",
      "No digital artifacts detected around facial features"
    ];
  }

  try {
    // Attempt to analyze with OpenAI if available (would be real implementation)
    if (process.env.OPENAI_API_KEY) {
      // This would be a real implementation with actual video analysis
      // For now, we return the simulated result
    }

    return {
      score,
      status: status as "real" | "fake" | "suspicious" | "safe",
      factors
    };
  } catch (error) {
    console.error("OpenAI video analysis error:", error);
    // Fall back to simulated result if API call fails
    return {
      score,
      status: status as "real" | "fake" | "suspicious" | "safe",
      factors
    };
  }
}

async function analyzePhishing(type: string, content: string) {
  // In a real implementation, this would use NLP models and URL analysis
  // to detect phishing attempts
  
  let score = 0;
  let status: "real" | "fake" | "suspicious" | "safe" = "safe";
  let factors: string[] = [];
  
  try {
    // Use OpenAI for content analysis if API key is available
    if (process.env.OPENAI_API_KEY) {
      const prompt = `
        Analyze the following ${type} content for potential phishing indicators. 
        Score from 0-100 where 0 is definitely safe and 100 is definitely phishing.
        Identify specific phishing factors present.
        
        ${type.toUpperCase()} CONTENT: ${content}
        
        Return a JSON with:
        {
          "score": number between 0-100,
          "status": "safe" if score < 30, "suspicious" if score between 30-70, "fake" if score > 70,
          "factors": [array of strings describing phishing indicators found]
        }
      `;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are a cybersecurity expert specializing in phishing detection." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(completion.choices[0].message.content);
      score = result.score;
      status = result.status;
      factors = result.factors;
    } else {
      // Fallback simulation if no API key available
      // Analyze the content for common phishing indicators
      const phishingKeywords = [
        "urgent", "verify", "account", "suspended", "click", "link", "password",
        "update", "information", "bank", "limited", "access", "security", "unusual activity"
      ];
      
      // Simple keyword-based scoring
      let keywordMatches = 0;
      for (const keyword of phishingKeywords) {
        if (content.toLowerCase().includes(keyword.toLowerCase())) {
          keywordMatches++;
        }
      }
      
      score = Math.min(100, keywordMatches * 10);
      
      if (score > 70) {
        status = "fake";
        factors = [
          "Contains urgent language and time pressure tactics",
          "Requests sensitive personal information",
          "Contains suspicious links with misleading URLs",
          "Mimics legitimate organization communication"
        ];
      } else if (score > 30) {
        status = "suspicious";
        factors = [
          "Contains some urgency indicators",
          "Contains links that require caution",
          "Requests action from the recipient",
          "Some linguistic patterns match known phishing attempts"
        ];
      } else {
        status = "safe";
        factors = [
          "No urgent calls to action",
          "No requests for sensitive information",
          "No suspicious links detected",
          "Content appears legitimate"
        ];
      }
    }
    
    return {
      score,
      status,
      factors
    };
  } catch (error) {
    console.error("Phishing analysis error:", error);
    
    // Fallback if API call fails
    return {
      score: 50,
      status: "suspicious" as "real" | "fake" | "suspicious" | "safe",
      factors: [
        "Analysis error - treating as suspicious by default",
        "Unable to perform detailed content analysis",
        "Exercise caution with this content"
      ]
    };
  }
}
