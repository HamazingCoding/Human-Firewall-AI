import { Cpu, BarChart2, Shield } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">How Human Firewall AI Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-primary rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-accent-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cpu className="text-accent-blue w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-white">Advanced AI Models</h3>
          <p className="text-gray-300">Our system uses specialized neural networks trained on millions of legitimate and fraudulent samples to accurately identify threats.</p>
        </div>
        
        <div className="bg-primary rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-accent-teal bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="text-accent-teal w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-white">Multi-Modal Analysis</h3>
          <p className="text-gray-300">We combine audio, visual, and textual analysis to detect sophisticated attacks across different communication channels.</p>
        </div>
        
        <div className="bg-primary rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-status-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-status-success w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-white">Real-Time Protection</h3>
          <p className="text-gray-300">Get immediate results with detailed explanations of detection factors to help you make informed security decisions.</p>
        </div>
      </div>
    </section>
  );
}
