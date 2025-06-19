import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function LiveDeepfakeDetection() {
  useEffect(() => {
    // Redirect to the DeepfakeShield app's live deepfake detection page
    window.location.href = "http://localhost:5002";
  }, []);

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center">
      <Helmet>
        <title>Live Deepfake Detection - Human Firewall AI</title>
        <meta name="description" content="Real-time AI deepfake detection for live video streams" />
      </Helmet>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-accent-blue border-primary-dark mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Redirecting to Live Deepfake Detection...</h2>
        <p className="text-gray-400">If you are not redirected automatically, please click the button below.</p>
        <button
          onClick={() => window.location.href = "http://localhost:5002"}
          className="mt-4 px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90"
        >
          Open Live Deepfake Detection
        </button>
      </div>
    </div>
  );
} 