import cv2
import numpy as np
import json
import sys
import os
from typing import List, Dict, Any

def extract_frames(video_path: str, max_frames: int = 30) -> List[np.ndarray]:
    """Extract frames from video for analysis."""
    frames = []
    cap = cv2.VideoCapture(video_path)
    
    # Get video properties
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_interval = max(1, total_frames // max_frames)
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % frame_interval == 0:
            frames.append(frame)
            
        frame_count += 1
        if len(frames) >= max_frames:
            break
    
    cap.release()
    return frames

def analyze_frame(frame: np.ndarray) -> Dict[str, Any]:
    """Analyze a single frame for potential deepfake indicators."""
    # Convert to grayscale for analysis
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect faces
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    if len(faces) == 0:
        return {
            "face_detected": False,
            "artifacts": 0,
            "blur_score": 0,
            "noise_level": 0
        }
    
    # Analyze the first detected face
    x, y, w, h = faces[0]
    face_roi = gray[y:y+h, x:x+w]
    
    # Calculate blur score using Laplacian variance
    blur_score = cv2.Laplacian(face_roi, cv2.CV_64F).var()
    
    # Calculate noise level
    noise_level = np.std(face_roi)
    
    # Look for compression artifacts
    artifacts = 0
    if w > 0 and h > 0:
        # Check for blocky patterns that might indicate compression artifacts
        blocks = cv2.resize(face_roi, (w//8, h//8))
        blocks = cv2.resize(blocks, (w, h))
        diff = cv2.absdiff(face_roi, blocks)
        artifacts = np.mean(diff)
    
    return {
        "face_detected": True,
        "artifacts": float(artifacts),
        "blur_score": float(blur_score),
        "noise_level": float(noise_level)
    }

def analyze_video(video_path: str) -> Dict[str, Any]:
    """Analyze video for deepfake characteristics."""
    try:
        # Extract frames
        frames = extract_frames(video_path)
        if not frames:
            return {
                "score": 0,
                "status": "error",
                "factors": ["No frames could be extracted from the video"]
            }
        
        # Analyze each frame
        frame_analyses = [analyze_frame(frame) for frame in frames]
        
        # Calculate aggregate metrics
        face_detection_rate = sum(1 for f in frame_analyses if f["face_detected"]) / len(frame_analyses)
        avg_artifacts = np.mean([f["artifacts"] for f in frame_analyses])
        avg_blur = np.mean([f["blur_score"] for f in frame_analyses])
        avg_noise = np.mean([f["noise_level"] for f in frame_analyses])
        
        # Calculate deepfake probability score
        score = 0
        factors = []
        
        # Face detection consistency
        if face_detection_rate < 0.5:
            score += 30
            factors.append("Inconsistent face detection throughout video")
        else:
            score += 20
        
        # Artifact analysis
        if avg_artifacts > 10:
            score += 25
            factors.append("High level of compression artifacts detected")
        elif avg_artifacts > 5:
            score += 15
            factors.append("Moderate compression artifacts present")
        else:
            score += 10
        
        # Blur analysis
        if avg_blur < 100:
            score += 25
            factors.append("Unnaturally low blur levels detected")
        elif avg_blur > 500:
            score += 15
            factors.append("Excessive blur detected")
        else:
            score += 10
        
        # Noise analysis
        if avg_noise < 20:
            score += 20
            factors.append("Unnaturally low noise levels")
        elif avg_noise > 50:
            score += 15
            factors.append("Abnormal noise patterns detected")
        else:
            score += 10
        
        # Determine status
        if score >= 70:
            status = "fake"
        elif score >= 40:
            status = "suspicious"
        else:
            status = "real"
            factors = ["No significant deepfake indicators detected"]
        
        return {
            "score": score,
            "status": status,
            "factors": factors
        }
        
    except Exception as e:
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
        
    video_path = sys.argv[1]
    result = analyze_video(video_path)
    print(json.dumps(result)) 