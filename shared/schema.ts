import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table kept for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Detection type enum
export const detectionTypeEnum = z.enum(["voice", "deepfake", "phishing"]);
export type DetectionType = z.infer<typeof detectionTypeEnum>;

// Result status enum
export const resultStatusEnum = z.enum(["real", "fake", "suspicious", "safe"]);
export type ResultStatus = z.infer<typeof resultStatusEnum>;

// Analysis results table
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  contentText: text("content_text"),
  score: integer("score").notNull(),
  status: text("status").notNull(),
  factors: json("factors").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

// Voice detection schema
export const voiceDetectionSchema = z.object({
  audioFile: z.instanceof(File).refine((file) => {
    const validTypes = ["audio/mp3", "audio/wav", "audio/mpeg", "audio/x-m4a"];
    return validTypes.includes(file.type);
  }, "File must be MP3, WAV, or M4A"),
});

// Deepfake detection schema
export const deepfakeDetectionSchema = z.object({
  videoFile: z.instanceof(File).refine((file) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    return validTypes.includes(file.type);
  }, "File must be MP4, MOV, or AVI"),
});

// Phishing detection schema
export const phishingTypeEnum = z.enum(["url", "email", "message"]);
export type PhishingType = z.infer<typeof phishingTypeEnum>;

export const phishingDetectionSchema = z.object({
  type: phishingTypeEnum,
  content: z.string().min(1, "Content is required"),
});

// Analysis response schema
export const analysisResponseSchema = z.object({
  score: z.number().min(0).max(100),
  status: resultStatusEnum,
  factors: z.array(z.string()),
  visualData: z.string().optional(),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
