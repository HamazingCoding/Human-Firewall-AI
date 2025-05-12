import { Check, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EnterpriseFeatures() {
  return (
    <section className="mb-12">
      <div className="bg-primary rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Enterprise security SVG illustration instead of an image */}
          <div className="flex items-center justify-center p-8 bg-gradient-to-br from-primary-dark to-primary">
            <svg
              width="100%"
              height="300"
              viewBox="0 0 800 600"
              className="max-w-full"
            >
              {/* Security dashboard background */}
              <rect x="100" y="100" width="600" height="400" rx="15" fill="#1e293b" />
              
              {/* Screen elements */}
              <rect x="130" y="140" width="260" height="160" rx="5" fill="#334155" />
              <rect x="130" y="320" width="260" height="140" rx="5" fill="#334155" />
              <rect x="410" y="140" width="260" height="320" rx="5" fill="#334155" />
              
              {/* Graph elements */}
              <path d="M150 250 L180 230 L210 270 L240 210 L270 240 L300 190 L330 220 L360 200" 
                stroke="#0d9488" strokeWidth="3" fill="none" />
              
              {/* Pie chart */}
              <circle cx="240" cy="390" r="60" fill="transparent" stroke="#475569" strokeWidth="30" />
              <path d="M240 390 L240 330 A60 60 0 0 1 293 420 Z" fill="#0d9488" />
              <path d="M240 390 L293 420 A60 60 0 0 1 187 420 Z" fill="#3b82f6" />
              <path d="M240 390 L187 420 A60 60 0 0 1 240 330 Z" fill="#f59e0b" />
              
              {/* Bar chart */}
              <rect x="440" y="380" width="30" height="60" fill="#0d9488" />
              <rect x="480" y="340" width="30" height="100" fill="#3b82f6" />
              <rect x="520" y="290" width="30" height="150" fill="#0d9488" />
              <rect x="560" y="320" width="30" height="120" fill="#3b82f6" />
              <rect x="600" y="260" width="30" height="180" fill="#0d9488" />
              
              {/* Shield icon */}
              <path d="M540 200 L540 230 Q540 260 510 270 Q480 260 480 230 L480 200 Z" 
                fill="none" stroke="#0d9488" strokeWidth="3" />
              <path d="M500 215 L520 235 L560 195" 
                fill="none" stroke="#0d9488" strokeWidth="3" />
              
              {/* Network connection lines */}
              <circle cx="180" cy="180" r="15" fill="#3b82f6" />
              <circle cx="340" cy="180" r="15" fill="#0d9488" />
              <line x1="195" y1="180" x2="325" y2="180" stroke="#94a3b8" strokeDasharray="5,5" />
              
              <circle cx="440" cy="180" r="15" fill="#3b82f6" />
              <circle cx="600" cy="180" r="15" fill="#0d9488" />
              <line x1="455" y1="180" x2="585" y2="180" stroke="#94a3b8" strokeDasharray="5,5" />
            </svg>
          </div>
          
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">Enterprise-Grade Protection</h2>
            <p className="text-gray-300 mb-6">Deploy Human Firewall AI across your organization to protect all employees from social engineering attacks.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="text-accent-teal w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">Seamless Integration</h3>
                  <p className="text-gray-300 text-sm">Connect with existing email systems, collaboration tools, and security infrastructure.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="text-accent-teal w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">Advanced Reporting</h3>
                  <p className="text-gray-300 text-sm">Comprehensive analytics dashboard with threat intelligence and employee vulnerability metrics.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="text-accent-teal w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">Continuous Learning</h3>
                  <p className="text-gray-300 text-sm">AI models that improve over time as they analyze more organization-specific threats.</p>
                </div>
              </li>
            </ul>
            
            <Button className="bg-accent-blue text-white hover:bg-accent-blue/90 w-fit">
              <Building className="w-5 h-5 mr-2" />
              Request Enterprise Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
