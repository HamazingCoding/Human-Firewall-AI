import { Shield, BadgeCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  // Scroll to detection section when button is clicked
  const scrollToDetection = () => {
    const element = document.getElementById('detection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        Defend Against Social Engineering
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Protect yourself and your organization from sophisticated social engineering attacks with our AI-powered detection system.
      </p>
      
      <Button 
        className="bg-accent-teal text-white hover:bg-accent-teal/90 px-8 py-6 text-lg mb-12"
        onClick={scrollToDetection}
      >
        Try It Now
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-primary rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
          <div className="h-48 bg-gradient-to-br from-blue-900 to-accent-teal flex items-center justify-center">
            <Shield className="w-20 h-20 text-white/80" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-white">AI Voice Detection</h3>
            <p className="text-gray-300">Identify synthetic or manipulated voice content in audio recordings and calls.</p>
          </div>
        </div>
        
        <div className="bg-primary rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
          <div className="h-48 bg-gradient-to-br from-purple-900 to-accent-blue flex items-center justify-center">
            <Eye className="w-20 h-20 text-white/80" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-white">Deepfake Detection</h3>
            <p className="text-gray-300">Verify the authenticity of video calls and recordings to prevent impersonation.</p>
          </div>
        </div>
        
        <div className="bg-primary rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
          <div className="h-48 bg-gradient-to-br from-teal-900 to-emerald-600 flex items-center justify-center">
            <BadgeCheck className="w-20 h-20 text-white/80" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-white">Phishing Analysis</h3>
            <p className="text-gray-300">Detect malicious links, emails, and messages designed to steal information.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
