import os
import sys
import json
import wave
import array
import math

def extract_audio_features(audio_path):
    try:
        with wave.open(audio_path, 'rb') as wav_file:
            # Get audio parameters
            n_channels = wav_file.getnchannels()
            sample_width = wav_file.getsampwidth()
            frame_rate = wav_file.getframerate()
            n_frames = wav_file.getnframes()
            
            # Read audio data
            frames = wav_file.readframes(n_frames)
            
            # Convert to array of integers
            if sample_width == 2:
                audio_data = array.array('h', frames)
            else:
                audio_data = array.array('B', frames)
            
            # Convert to mono if stereo
            if n_channels == 2:
                audio_data = [sum(audio_data[i:i+2])/2 for i in range(0, len(audio_data), 2)]
            
            # Normalize audio data
            max_value = max(abs(min(audio_data)), abs(max(audio_data)))
            audio_data = [x/max_value for x in audio_data]
            
            # Extract basic features
            features = []
            
            # Mean amplitude
            features.append(sum(abs(x) for x in audio_data) / len(audio_data))
            
            # Standard deviation of amplitude
            mean = sum(audio_data) / len(audio_data)
            variance = sum((x - mean) ** 2 for x in audio_data) / len(audio_data)
            features.append(math.sqrt(variance))
            
            # Zero crossing rate
            zero_crossings = sum(1 for i in range(1, len(audio_data)) if audio_data[i-1] * audio_data[i] < 0)
            features.append(zero_crossings / len(audio_data))
            
            # Energy
            features.append(sum(x * x for x in audio_data) / len(audio_data))
            
            # Spectral centroid (approximation)
            fft_size = min(2048, len(audio_data))
            fft_data = [0] * fft_size
            for i in range(fft_size):
                for j in range(len(audio_data)):
                    fft_data[i] += audio_data[j] * math.cos(2 * math.pi * i * j / fft_size)
            
            magnitude = [abs(x) for x in fft_data]
            total_magnitude = sum(magnitude)
            if total_magnitude > 0:
                centroid = sum(i * m for i, m in enumerate(magnitude)) / total_magnitude
                features.append(centroid / fft_size)
            else:
                features.append(0)
            
            return features
            
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

def analyze_voice(audio_path):
    try:
        # Extract features
        features = extract_audio_features(audio_path)
        if features is None:
            return {
                "score": 0,
                "status": "error",
                "factors": ["Failed to extract audio features"]
            }
        
        # Simple rule-based analysis
        mean_amplitude, std_dev, zero_crossing_rate, energy, spectral_centroid = features
        
        # Calculate a score based on feature analysis
        score = 0
        
        # Check for natural speech characteristics
        if 0.1 <= mean_amplitude <= 0.9:
            score += 20
        if 0.05 <= std_dev <= 0.5:
            score += 20
        if 0.1 <= zero_crossing_rate <= 0.4:
            score += 20
        if 0.01 <= energy <= 0.5:
            score += 20
        if 0.1 <= spectral_centroid <= 0.5:
            score += 20
        
        # Determine if the voice is real or fake
        is_real = score >= 60
        status = "real" if is_real else "fake"
        
        # Generate factors based on the analysis
        factors = []
        if is_real:
            if 0.1 <= mean_amplitude <= 0.9:
                factors.append("Natural amplitude variations detected")
            if 0.05 <= std_dev <= 0.5:
                factors.append("Consistent speech patterns observed")
            if 0.1 <= zero_crossing_rate <= 0.4:
                factors.append("Natural speech rhythm detected")
            if 0.01 <= energy <= 0.5:
                factors.append("Balanced audio energy levels")
            if 0.1 <= spectral_centroid <= 0.5:
                factors.append("Natural frequency distribution")
        else:
            if mean_amplitude < 0.1 or mean_amplitude > 0.9:
                factors.append("Unnatural amplitude variations")
            if std_dev < 0.05 or std_dev > 0.5:
                factors.append("Inconsistent speech patterns")
            if zero_crossing_rate < 0.1 or zero_crossing_rate > 0.4:
                factors.append("Artificial speech rhythm")
            if energy < 0.01 or energy > 0.5:
                factors.append("Abnormal audio energy levels")
            if spectral_centroid < 0.1 or spectral_centroid > 0.5:
                factors.append("Unnatural frequency distribution")
        
        return {
            "score": score,
            "status": status,
            "factors": factors
        }
        
    except Exception as e:
        print(f"Error in voice analysis: {e}")
        return {
            "score": 0,
            "status": "error",
            "factors": [f"Analysis failed: {str(e)}"]
        }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({
            "score": 0,
            "status": "error",
            "factors": ["Invalid number of arguments"]
        }))
        sys.exit(1)
        
    audio_path = sys.argv[1]
    result = analyze_voice(audio_path)
    print(json.dumps(result))