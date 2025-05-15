import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Video, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import VoiceDetection from "@/components/voice-detection/VoiceDetection";
import DeepfakeDetection from "@/components/deepfake-detection/DeepfakeDetection";
import PhishingDetection from "@/components/phishing-detection/PhishingDetection";

export default function DetectionTabs() {
  const [activeTab, setActiveTab] = useState("voice");

  return (
    <section className="bg-primary rounded-xl shadow-xl p-6 mb-12" id="detection">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Social Engineering Detection Suite</h2>
        <p className="text-gray-300">Upload files or input text to analyze for potential threats.</p>
      </div>

      <Tabs 
        defaultValue="voice" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6 bg-primary-light">
          <TabsTrigger value="voice" className="data-[state=active]:border-b-2 data-[state=active]:border-accent-teal">
            <Mic className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Voice Detection</span>
          </TabsTrigger>
          <TabsTrigger value="deepfake" className="data-[state=active]:border-b-2 data-[state=active]:border-accent-teal">
            <Video className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Deepfake Detection</span>
          </TabsTrigger>
          <TabsTrigger value="phishing" className="data-[state=active]:border-b-2 data-[state=active]:border-accent-teal">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Phishing Detection</span>
          </TabsTrigger>
        </TabsList>
        
        <Card className="border-none bg-transparent shadow-none">
          <CardContent className="p-0">
            <TabsContent value="voice">
              <VoiceDetection />
            </TabsContent>
            
            <TabsContent value="deepfake">
              <DeepfakeDetection />
            </TabsContent>
            
            <TabsContent value="phishing">
              <PhishingDetection />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </section>
  );
}
