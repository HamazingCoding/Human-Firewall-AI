import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeVoice } from "@/lib/api";
import type { AnalysisResponse } from "@shared/schema";
import VoiceResults from "./VoiceResults";

export default function VoiceDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Reset results when a new file is selected
    setAnalysisResults(null);
  };

  const handleAnalyzeVoice = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const results = await analyzeVoice(selectedFile);
      setAnalysisResults(results);
    } catch (error) {
      console.error("Error analyzing voice:", error);
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
        <h3 className="text-xl font-semibold mb-4 text-white">AI Voice Analysis</h3>
        <p className="text-gray-300 mb-6">
          Upload an audio file to determine if the voice is authentic or generated/manipulated by AI.
        </p>
        
        <FileUpload
          accept="audio/mp3,audio/wav,audio/mpeg,audio/x-m4a"
          maxSize={20}
          onFileSelect={handleFileSelect}
          supportedFormats="MP3, WAV, M4A"
          className="mb-6"
        />
        
        <div className="flex justify-center">
          <Button
            className="bg-accent-teal text-white hover:bg-accent-teal/90"
            onClick={handleAnalyzeVoice}
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
                Analyze Voice
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center bg-primary-light rounded-lg p-6">
          <div className="w-12 h-12 border-4 border-t-accent-teal border-primary-dark rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-semibold mb-2 text-white">Analyzing Voice...</h3>
          <p className="text-gray-300 text-center">
            Our AI is examining vocal patterns, frequency distributions, and other markers.
          </p>
        </div>
      ) : analysisResults ? (
        <VoiceResults results={analysisResults} />
      ) : (
        <div className="hidden lg:flex flex-col items-center justify-center bg-primary-light rounded-lg p-6">
          <p className="text-gray-400 text-center">
            Upload and analyze a voice recording to see the results here.
          </p>
        </div>
      )}
    </div>
  );
}
