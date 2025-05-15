import { FileText, Download } from "lucide-react";
import { ConfidenceMeter } from "@/components/ui/confidence-meter";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { AnalysisResponse, PhishingType } from "@shared/schema";

interface PhishingResultsProps {
  results: AnalysisResponse;
  content: string;
  type: PhishingType;
}

export default function PhishingResults({ results, content, type }: PhishingResultsProps) {
  const { score, status, factors } = results;
  
  // Determine result status visual elements
  const getStatusConfig = () => {
    switch (status) {
      case "safe":
        return {
          icon: <CheckCircle className="text-status-success w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Safe Content Detected",
          titleColor: "text-status-success",
          bgColor: "bg-green-900 bg-opacity-20",
          borderColor: "border-green-800",
          meterStatus: "success" as const,
          description: "Our analysis indicates this content appears to be legitimate and safe."
        };
      case "fake":
        return {
          icon: <XCircle className="text-status-danger w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Phishing Attempt Detected",
          titleColor: "text-status-danger",
          bgColor: "bg-red-900 bg-opacity-20",
          borderColor: "border-red-800",
          meterStatus: "danger" as const,
          description: "Our analysis indicates this is likely a phishing attempt. Do not interact with this content."
        };
      case "suspicious":
        return {
          icon: <AlertTriangle className="text-status-warning w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Suspicious Content Detected",
          titleColor: "text-status-warning",
          bgColor: "bg-amber-900 bg-opacity-20",
          borderColor: "border-amber-800",
          meterStatus: "warning" as const,
          description: "Our analysis indicates this content contains several phishing indicators. Exercise caution."
        };
      default:
        return {
          icon: <CheckCircle className="text-status-success w-6 h-6 mr-2 flex-shrink-0 mt-0.5" />,
          title: "Analysis Complete",
          titleColor: "text-white",
          bgColor: "bg-blue-900 bg-opacity-20",
          borderColor: "border-blue-800",
          meterStatus: "neutral" as const,
          description: "Our AI has analyzed the content."
        };
    }
  };
  
  const statusConfig = getStatusConfig();

  // Helper to highlight suspicious elements in content
  const highlightContent = () => {
    const suspiciousWords = [
      'urgent', 'verify', 'confirm', 'account', 'suspended', 'limited',
      'security', 'password', 'click', 'link', 'update', 'information',
      'suspicious activity', '24 hours', 'immediately'
    ];
    
    let highlightedContent = content;
    
    // For URLs, try to highlight suspicious domains or paths
    if (type === 'url') {
      try {
        const url = new URL(content);
        const domain = url.hostname;
        
        // Check for lookalike domains
        const commonSpoofedDomains = ['paypal', 'apple', 'microsoft', 'amazon', 'google', 'facebook'];
        
        for (const spoofed of commonSpoofedDomains) {
          if (domain.includes(spoofed) && !domain.endsWith(`.${spoofed}.com`)) {
            return content.replace(domain, `<span class="text-status-warning">${domain}</span>`);
          }
        }
        
        // Highlight suspicious paths
        const suspiciousPaths = ['account', 'login', 'verify', 'secure', 'update'];
        for (const path of suspiciousPaths) {
          if (url.pathname.includes(path)) {
            return content.replace(url.pathname, `<span class="text-status-warning">${url.pathname}</span>`);
          }
        }
      } catch (e) {
        // Not a valid URL, fall back to word highlighting
      }
    }
    
    // For emails and messages, highlight suspicious words
    for (const word of suspiciousWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedContent = highlightedContent.replace(
        regex, 
        match => `<span class="text-status-warning">${match}</span>`
      );
    }
    
    return highlightedContent;
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
          label="Threat Level"
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
              <span className={`w-2 h-2 ${status === "safe" ? "bg-status-success" : status === "fake" ? "bg-status-danger" : "bg-status-warning"} rounded-full mr-2`}></span>
              {factor}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-primary-dark rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-3 text-sm text-gray-300">Content Analysis</h4>
        <div className="text-sm text-gray-400">
          <p 
            dangerouslySetInnerHTML={{ __html: highlightContent() }} 
            className="break-words"
          ></p>
          {status !== "safe" && (
            <p className="mt-2 text-xs">Suspicious elements highlighted</p>
          )}
        </div>
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
