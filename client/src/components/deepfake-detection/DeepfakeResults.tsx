import { FileText, Download } from "lucide-react";
import { ConfidenceMeter } from "@/components/ui/confidence-meter";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { AnalysisResponse } from "@shared/schema";

interface DeepfakeResultsProps {
  results: AnalysisResponse;
}

export default function DeepfakeResults({ results }: DeepfakeResultsProps) {
  const { score, status, factors } = results;
  
  // Determine result status visual elements
  const getStatusConfig = () => {
    switch (status) {
      case "real":
        return {
          icon: <CheckCircle className="text-status-success w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Authentic Video Detected",
          titleColor: "text-status-success",
          bgColor: "bg-green-900 bg-opacity-20",
          borderColor: "border-green-800",
          meterStatus: "success" as const,
          description: "Our AI has determined that this video appears to be authentic with high confidence."
        };
      case "fake":
        return {
          icon: <XCircle className="text-status-danger w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Potential Deepfake Detected",
          titleColor: "text-status-danger",
          bgColor: "bg-red-900 bg-opacity-20",
          borderColor: "border-red-800",
          meterStatus: "danger" as const,
          description: "Our AI has detected several indicators suggesting this video may be manipulated or generated."
        };
      case "suspicious":
        return {
          icon: <XCircle className="text-status-warning w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Suspicious Video Detected",
          titleColor: "text-status-warning",
          bgColor: "bg-amber-900 bg-opacity-20",
          borderColor: "border-amber-800",
          meterStatus: "warning" as const,
          description: "Our AI has detected some unusual patterns that may indicate manipulation."
        };
      default:
        return {
          icon: <CheckCircle className="text-status-success w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Analysis Complete",
          titleColor: "text-white",
          bgColor: "bg-blue-900 bg-opacity-20",
          borderColor: "border-blue-800",
          meterStatus: "neutral" as const,
          description: "Our AI has analyzed the video sample."
        };
    }
  };
  
  const statusConfig = getStatusConfig();

  // SVG heatmap for deepfake visualization (simplified representation)
  const createHeatmapSVG = () => {
    return (
      <svg 
        width="100%" 
        height="200" 
        viewBox="0 0 400 200" 
        className="rounded-lg bg-gray-900"
      >
        {/* Face outline */}
        <ellipse cx="200" cy="100" rx="80" ry="90" fill="none" stroke="#666" strokeWidth="1" />
        
        {/* Eyes */}
        <ellipse cx="165" cy="80" rx="15" ry="10" fill="none" stroke="#666" strokeWidth="1" />
        <ellipse cx="235" cy="80" rx="15" ry="10" fill="none" stroke="#666" strokeWidth="1" />
        
        {/* Nose and mouth */}
        <path d="M190 100 L200 120 L210 100" fill="none" stroke="#666" strokeWidth="1" />
        <path d="M170 140 Q200 160 230 140" fill="none" stroke="#666" strokeWidth="1" />
        
        {/* Highlighted areas - only show for deepfakes */}
        {status === "fake" && (
          <>
            <ellipse cx="165" cy="80" rx="20" ry="15" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1" />
            <ellipse cx="235" cy="80" rx="20" ry="15" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1" />
            <path d="M160 140 Q200 170 240 140" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1" />
          </>
        )}
        
        {status === "suspicious" && (
          <>
            <ellipse cx="165" cy="80" rx="20" ry="15" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="1" />
            <path d="M160 140 Q200 170 240 140" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="1" />
          </>
        )}
        
        {/* Legend */}
        <text x="20" y="20" fill="#ccc" fontSize="12">Facial Analysis Heatmap</text>
        {(status === "fake" || status === "suspicious") && (
          <text x="20" y="180" fill="#ccc" fontSize="10">Red areas indicate potential manipulation markers</text>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-primary-light rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Analysis Results
      </h3>
      
      <div className="mb-6">
        <ConfidenceMeter 
          value={score} 
          status={statusConfig.meterStatus}
          label="Authenticity Score"
        />
      </div>
      
      <div className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-start">
          {statusConfig.icon}
          <div>
            <h4 className={`font-semibold ${statusConfig.titleColor}`}>{statusConfig.title}</h4>
            <p className="text-gray-300 text-sm mt-1">{statusConfig.description}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Detection Factors</h4>
        <ul className="space-y-2 text-sm">
          {factors.map((factor, index) => (
            <li key={index} className="flex items-center">
              <span className={`w-2 h-2 ${status === "real" ? "bg-status-success" : status === "fake" ? "bg-status-danger" : "bg-status-warning"} rounded-full mr-2`}></span>
              {factor}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Visual Analysis</h4>
        {createHeatmapSVG()}
        <p className="text-xs text-gray-400 mt-1">Suspicious areas are highlighted in red</p>
      </div>
      
      <div className="text-right">
        <Button variant="link" className="text-accent-teal hover:text-accent-blue ml-auto">
          <Download className="w-5 h-5 mr-1" />
          Download Full Report
        </Button>
      </div>
    </div>
  );
}
