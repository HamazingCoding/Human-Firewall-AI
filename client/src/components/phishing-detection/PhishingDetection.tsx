import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzePhishing } from "@/lib/api";
import { PhishingType, type AnalysisResponse } from "@shared/schema";
import PhishingResults from "./PhishingResults";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PhishingDetection() {
  const [phishingType, setPhishingType] = useState<PhishingType>("url");
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleTypeChange = (value: string) => {
    setPhishingType(value as PhishingType);
    // Reset results when type changes
    setAnalysisResults(null);
  };

  const getPlaceholderText = () => {
    switch (phishingType) {
      case "url":
        return "Enter suspicious URL (e.g., http://example.com/login)";
      case "email":
        return "Paste the entire email content including headers...";
      case "message":
        return "Paste the suspicious message text...";
      default:
        return "Enter content to analyze...";
    }
  };

  const handleAnalyzePhishing = async () => {
    if (!content.trim()) {
      toast({
        title: "No content provided",
        description: "Please enter content to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const results = await analyzePhishing(phishingType, content);
      setAnalysisResults(results);
    } catch (error) {
      console.error("Error analyzing phishing content:", error);
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
        <h3 className="text-xl font-semibold mb-4 text-white">Phishing Link & Email Analysis</h3>
        <p className="text-gray-300 mb-6">
          Paste a suspicious URL, email content, or message to scan for phishing attempts.
        </p>
        
        <div className="mb-6">
          <Label htmlFor="phishing-type" className="mb-2 text-sm font-medium text-gray-300">
            What would you like to analyze?
          </Label>
          <Select 
            value={phishingType} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger id="phishing-type" className="w-full">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="url">URL / Website Link</SelectItem>
              <SelectItem value="email">Email Content</SelectItem>
              <SelectItem value="message">Message / Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="phishing-input" className="mb-2 text-sm font-medium text-gray-300">
            Paste suspicious content
          </Label>
          <Textarea 
            id="phishing-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getPlaceholderText()}
            rows={6}
            className="bg-primary-dark border-gray-700 text-black placeholder:text-gray-500 resize-none"
          />
        </div>
        
        <div className="flex justify-center">
          <Button
            className="bg-accent-teal text-white hover:bg-accent-teal/90"
            onClick={handleAnalyzePhishing}
            disabled={!content || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Analyze Content
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center bg-primary-light rounded-lg p-6">
          <div className="w-12 h-12 border-4 border-t-accent-teal border-primary-dark rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-semibold mb-2 text-white">Analyzing Content...</h3>
          <p className="text-gray-300 text-center">
            Our AI is examining language patterns, URLs, and other phishing indicators.
          </p>
        </div>
      ) : analysisResults ? (
        <PhishingResults results={analysisResults} content={content} type={phishingType} />
      ) : (
        <div className="hidden lg:flex flex-col items-center justify-center bg-primary-light rounded-lg p-6">
          <p className="text-gray-400 text-center">
            Enter and analyze content to see the results here.
          </p>
        </div>
      )}
    </div>
  );
}
