import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import DetectionTabs from "@/components/DetectionTabs";
import HowItWorks from "@/components/HowItWorks";
import EnterpriseFeatures from "@/components/EnterpriseFeatures";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <Helmet>
        <title>Human Firewall AI - Social Engineering Defense System</title>
        <meta name="description" content="Protect against social engineering threats with advanced AI detection for voice, video, and phishing attacks. Human Firewall AI delivers real-time threat analysis and prevention." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        
        <DetectionTabs />
        
        <HowItWorks />
        
        <EnterpriseFeatures />
      </div>
    </div>
  );
}
