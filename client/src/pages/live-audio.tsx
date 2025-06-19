import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function LiveAudioDetection() {
  useEffect(() => {
    // Redirect to the Flask app's live audio detection page
    window.location.href = "http://localhost:5001";
  }, []);

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center">
      <Helmet>
        <title>Live Audio Detection - Human Firewall AI</title>
        <meta name="description" content="Real-time AI voice detection for live calls and audio streams" />
      </Helmet>
      
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-accent-teal border-primary-dark mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Redirecting to Live Audio Detection...</h2>
        <p className="text-gray-400">If you are not redirected automatically, please click the button below.</p>
        <button
          onClick={() => window.location.href = "http://localhost:5001"}
          className="mt-4 px-6 py-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90"
        >
          Open Live Audio Detection
        </button>
      </div>
    </div>
  );
} 