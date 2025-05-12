import { apiRequest } from "./queryClient";
import type { AnalysisResponse, PhishingType } from "@shared/schema";

// Voice Detection API
export async function analyzeVoice(audioFile: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("audioFile", audioFile);
  
  const response = await fetch("/api/detect/voice", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Voice analysis failed: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

// Deepfake Detection API
export async function analyzeDeepfake(videoFile: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("videoFile", videoFile);
  
  const response = await fetch("/api/detect/deepfake", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Deepfake analysis failed: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

// Phishing Detection API
export async function analyzePhishing(type: PhishingType, content: string): Promise<AnalysisResponse> {
  const response = await apiRequest("POST", "/api/detect/phishing", {
    type,
    content,
  });
  
  return response.json();
}

// Get analysis history
export async function getAnalysisHistory(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/history");
  return response.json();
}
