import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeDeepfake } from "@/lib/api";
import type { AnalysisResponse } from "@shared/schema";
import DeepfakeResults from "./DeepfakeResults";

export default function DeepfakeDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Reset results when a new file is selected
    setAnalysisResults(null);
  };

  const handleAnalyzeVideo = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const results = await analyzeDeepfake(selectedFile);
      setAnalysisResults(results);
    } catch (error) {
      console.error("Error analyzing video:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Deepfake Video Analysis</h3>
        <p className="text-gray-300 mb-6">
          Upload a video file to detect potential deepfake manipulation or AI-generated content.
        </p>
        
        <FileUpload
          accept="video/mp4,video/quicktime,video/x-msvideo"
          maxSize={50}
          onFileSelect={handleFileSelect}
          supportedFormats="MP4, MOV, AVI"
          className="mb-6"
        />
        
        <div className="flex justify-center">
          <Button
            className="bg-accent-teal text-white hover:bg-accent-teal/90"
            onClick={handleAnalyzeVideo}
            disabled={!selectedFile || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Analyze Video
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center bg-primary-light rounded-lg p-6">
          <div className="w-12 h-12 border-4 border-t-accent-teal border-primary-dark rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-semibold mb-2 text-white">Analyzing Video...</h3>
          <p className="text-gray-300 text-center">
            Our AI is examining facial movements, synchronization, and frame consistency.
          </p>
        </div>
      ) : analysisResults ? (
        <DeepfakeResults results={analysisResults} />
      ) : (
        <div className="hidden lg:flex flex-col items-center justify-center bg-primary-light rounded-lg p-6">
          <p className="text-gray-400 text-center">
            Upload and analyze a video file to see the results here.
          </p>
        </div>
      )}
    </div>
  );
}
