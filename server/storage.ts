import { users, type User, type InsertUser, analysisResults, type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analysis Results methods
  createAnalysisResult(result: Omit<InsertAnalysisResult, "createdAt">): Promise<AnalysisResult>;
  getAnalysisResult(id: number): Promise<AnalysisResult | undefined>;
  getRecentAnalysisResults(limit?: number): Promise<AnalysisResult[]>;
  getAnalysisResultsByType(type: string): Promise<AnalysisResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analysisResults: Map<number, AnalysisResult>;
  currentUserId: number;
  currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.analysisResults = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAnalysisResult(insertResult: Omit<InsertAnalysisResult, "createdAt">): Promise<AnalysisResult> {
    const id = this.currentAnalysisId++;
    const createdAt = new Date();
    
    const result: AnalysisResult = {
      ...insertResult,
      id,
      createdAt,
    };
    
    this.analysisResults.set(id, result);
    return result;
  }

  async getAnalysisResult(id: number): Promise<AnalysisResult | undefined> {
    return this.analysisResults.get(id);
  }

  async getRecentAnalysisResults(limit: number = 10): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getAnalysisResultsByType(type: string): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values())
      .filter(result => result.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
