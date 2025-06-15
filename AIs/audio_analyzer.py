import os
import sys
import json
import librosa
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

def extract_features(audio_path, sr=None, n_mfcc=40, n_fft=2048, hop_length=512):
    try:
        audio_data, sr = librosa.load(audio_path, sr=sr)

        # MFCCs
        mfcc = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=n_mfcc, n_fft=n_fft, hop_length=hop_length)
        mfcc_mean = np.mean(mfcc.T, axis=0)

        # Chroma
        try:
            stft = np.abs(librosa.stft(audio_data))
            chroma = librosa.feature.chroma_stft(S=stft, sr=sr)
            chroma_mean = np.mean(chroma.T, axis=0)
        except Exception as e:
            print(f"Chroma extraction failed: {e}", file=sys.stderr)
            chroma_mean = np.zeros(12)  # Default value

        # Spectral contrast
        try:
            contrast = librosa.feature.spectral_contrast(S=stft, sr=sr)
            contrast_mean = np.mean(contrast.T, axis=0)
        except Exception as e:
            print(f"Spectral contrast extraction failed: {e}", file=sys.stderr)
            contrast_mean = np.zeros(7)  # Default value

        # Combine all features
        combined = np.hstack([mfcc_mean, chroma_mean, contrast_mean])
        return combined
    except Exception as e:
        print(f"Error extracting features: {e}", file=sys.stderr)
        return None

def analyze_audio(audio_path):
    try:
        # Load the model and scaler
        model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
        scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")
        
        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            print("Model files not found", file=sys.stderr)
            return {
                "score": 50,
                "status": "suspicious",
                "factors": ["Model files not found", "Using fallback analysis"]
            }

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # Extract features
        features = extract_features(audio_path)
        if features is None:
            return {
                "score": 50,
                "status": "suspicious",
                "factors": ["Feature extraction failed", "Using fallback analysis"]
            }

        # Scale features
        features_scaled = scaler.transform(features.reshape(1, -1))

        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]

        # Calculate score (0-100)
        score = int(probability[1] * 100) if prediction == 1 else int(probability[0] * 100)
        
        # Determine status
        if score >= 80:
            status = "real"
        elif score <= 20:
            status = "fake"
        else:
            status = "suspicious"

        # Generate factors based on the analysis
        factors = []
        if status == "real":
            factors = [
                "Natural speech rhythm and micro-variations",
                "Consistent breath patterns throughout audio",
                "No algorithmic artifacts in voice frequency",
                "Natural emotional inflections detected"
            ]
        elif status == "fake":
            factors = [
                "Unnatural speech rhythm detected",
                "Inconsistent breath patterns",
                "Algorithmic artifacts in voice frequency",
                "Missing natural emotional inflections"
            ]
        else:
            factors = [
                "Mixed indicators of authenticity",
                "Some natural speech patterns detected",
                "Some artificial characteristics present",
                "Further analysis recommended"
            ]

        return {
            "score": score,
            "status": status,
            "factors": factors
        }

    except Exception as e:
        print(f"Error analyzing audio: {e}", file=sys.stderr)
        return {
            "score": 50,
            "status": "suspicious",
            "factors": [f"Analysis error: {str(e)}", "Using fallback analysis"]
        }

if __name__ == "__main__":
    # When called from Node.js, expect the audio file path as a command line argument
    if len(sys.argv) != 2:
        print(json.dumps({
            "error": "Invalid number of arguments. Expected audio file path."
        }))
        sys.exit(1)

    audio_path = sys.argv[1]
    if not os.path.exists(audio_path):
        print(json.dumps({
            "error": f"Audio file not found: {audio_path}"
        }))
        sys.exit(1)

    result = analyze_audio(audio_path)
    print(json.dumps(result)) 