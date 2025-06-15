import os
import sys
import json
import librosa
import numpy as np
import joblib

def extract_mfcc_features(audio_path, n_mfcc=13, n_fft=2048, hop_length=512):
    try:
        audio_data, sr = librosa.load(audio_path, sr=None)
        mfccs = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=n_mfcc, n_fft=n_fft, hop_length=hop_length)
        return np.mean(mfccs.T, axis=0)
    except Exception as e:
        print(json.dumps({"error": f"Error processing audio file: {str(e)}"}))
        return None

def analyze_audio(input_audio_path, model_path, scaler_path):
    try:
        # Load the model and scaler
        svm_classifier = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # Extract features
        mfcc_features = extract_mfcc_features(input_audio_path)
        if mfcc_features is None:
            return

        # Scale features and make prediction
        mfcc_features_scaled = scaler.transform(mfcc_features.reshape(1, -1))
        prediction = svm_classifier.predict(mfcc_features_scaled)
        confidence = svm_classifier.predict_proba(mfcc_features_scaled)[0]

        # Prepare result
        result = {
            "is_ai_generated": bool(prediction[0]),
            "confidence": float(max(confidence)),
            "message": "The audio appears to be AI-generated." if prediction[0] else "The audio appears to be authentic."
        }

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"Error during analysis: {str(e)}"}))

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python voice_detection.py <audio_file> <model_file> <scaler_file>"}))
        sys.exit(1)

    audio_file = sys.argv[1]
    model_file = sys.argv[2]
    scaler_file = sys.argv[3]

    analyze_audio(audio_file, model_file, scaler_file) 