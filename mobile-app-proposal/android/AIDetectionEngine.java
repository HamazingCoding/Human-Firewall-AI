package com.humanfirewall.aidetector;

import android.content.Context;
import android.util.Log;

import org.tensorflow.lite.Interpreter;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.HashMap;
import java.util.Map;

/**
 * AI Detection Engine for processing audio and identifying AI-generated voices.
 * This class implements TensorFlow Lite for on-device machine learning.
 */
public class AIDetectionEngine {
    private static final String TAG = "AIDetectionEngine";
    
    private static final int FEATURE_VECTOR_SIZE = 40; // MFCC features size
    private static final int SLIDING_WINDOW_MS = 500; // 500ms window
    private static final float DETECTION_THRESHOLD = 0.75f; // Confidence threshold
    
    private Context context;
    private Interpreter tflite;
    private FeatureExtractor featureExtractor;
    private CircularBuffer<Float> confidenceHistory;
    
    // AudioBuffer for accumulating sound before processing
    private short[] audioBufferWindow;
    private int audioBufferIndex = 0;
    private boolean bufferFilled = false;
    
    public AIDetectionEngine(Context context) {
        this.context = context;
        featureExtractor = new FeatureExtractor();
        confidenceHistory = new CircularBuffer<>(10); // Store last 10 confidence scores
        
        // Size of window buffer based on sample rate and window size
        int sampleRate = 16000; // must match the AudioRecord sample rate
        int windowSamples = (sampleRate * SLIDING_WINDOW_MS) / 1000;
        audioBufferWindow = new short[windowSamples];
        
        try {
            // Load TFLite model
            tflite = new Interpreter(loadModelFile());
        } catch (IOException e) {
            Log.e(TAG, "Error loading AI detection model", e);
        }
    }
    
    /**
     * Analyzes a chunk of audio data for AI voice detection
     * 
     * @param buffer Audio buffer containing raw PCM data
     * @param size Size of valid data in the buffer
     * @return true if AI voice is detected, false otherwise
     */
    public boolean analyzeAudioChunk(short[] buffer, int size) {
        // Add incoming audio to sliding window buffer
        for (int i = 0; i < size; i++) {
            if (audioBufferIndex >= audioBufferWindow.length) {
                // If buffer is full, process it and reset
                bufferFilled = true;
                float[] features = extractFeatures(audioBufferWindow);
                float aiConfidence = runInference(features);
                
                // Add to history and check if detection threshold is met
                confidenceHistory.add(aiConfidence);
                boolean detected = isAIDetected();
                
                // Reset buffer index to start filling again
                audioBufferIndex = 0;
                
                // If AI detected, return immediately
                if (detected) {
                    return true;
                }
            }
            
            // Add sample to buffer
            audioBufferWindow[audioBufferIndex++] = buffer[i];
        }
        
        // Check if buffer filled and needs processing
        if (bufferFilled && audioBufferIndex >= audioBufferWindow.length * 0.75) {
            // Process buffer when 75% full for overlapping windows
            float[] features = extractFeatures(audioBufferWindow);
            float aiConfidence = runInference(features);
            confidenceHistory.add(aiConfidence);
            return isAIDetected();
        }
        
        return false;
    }
    
    /**
     * Extracts audio features (MFCC) from raw PCM data
     */
    private float[] extractFeatures(short[] buffer) {
        return featureExtractor.computeMFCC(buffer);
    }
    
    /**
     * Runs the TensorFlow Lite model inference
     */
    private float runInference(float[] features) {
        if (tflite == null) return 0.0f;
        
        try {
            // Prepare input
            ByteBuffer inputBuffer = ByteBuffer.allocateDirect(4 * features.length);
            inputBuffer.order(ByteOrder.nativeOrder());
            for (float feature : features) {
                inputBuffer.putFloat(feature);
            }
            inputBuffer.rewind();
            
            // Prepare output
            ByteBuffer outputBuffer = ByteBuffer.allocateDirect(4); // 1 float for confidence
            outputBuffer.order(ByteOrder.nativeOrder());
            
            // Run inference
            tflite.run(inputBuffer, outputBuffer);
            
            // Get result
            outputBuffer.rewind();
            float confidence = outputBuffer.getFloat();
            
            Log.d(TAG, "AI voice confidence: " + confidence);
            return confidence;
            
        } catch (Exception e) {
            Log.e(TAG, "Error during TFLite inference", e);
            return 0.0f;
        }
    }
    
    /**
     * Determines if AI voice is detected based on confidence history
     */
    private boolean isAIDetected() {
        if (confidenceHistory.size() < 3) {
            return false; // Need at least 3 samples for reliable detection
        }
        
        // Calculate average of recent confidence scores
        float sum = 0.0f;
        for (Float confidence : confidenceHistory.getItems()) {
            sum += confidence;
        }
        float averageConfidence = sum / confidenceHistory.size();
        
        // Check if confidence exceeds threshold
        boolean detected = averageConfidence > DETECTION_THRESHOLD;
        
        if (detected) {
            Log.w(TAG, "AI voice detected with confidence: " + averageConfidence);
        }
        
        return detected;
    }
    
    /**
     * Loads the TFLite model from assets
     */
    private MappedByteBuffer loadModelFile() throws IOException {
        String MODEL_PATH = "ai_voice_detector.tflite";
        File modelFile = new File(context.getFilesDir(), MODEL_PATH);
        
        // In production, we'd check if model exists and download if needed
        if (!modelFile.exists()) {
            Log.w(TAG, "Model file not found! Using demo mode");
            // In real implementation, we would download model here
            
            // For demo purposes, use a placeholder
            modelFile = new File(context.getExternalFilesDir(null), "demo_model.tflite");
        }
        
        FileInputStream inputStream = new FileInputStream(modelFile);
        FileChannel fileChannel = inputStream.getChannel();
        long startOffset = 0;
        long declaredLength = fileChannel.size();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
    }
    
    /**
     * Utility class to extract audio features
     */
    private static class FeatureExtractor {
        // In a real implementation, this would compute MFCC features
        
        public float[] computeMFCC(short[] buffer) {
            // Simplified MFCC computation for example purposes
            float[] features = new float[FEATURE_VECTOR_SIZE];
            
            // In a real implementation, this would:
            // 1. Apply pre-emphasis
            // 2. Apply windowing function (e.g., Hamming)
            // 3. Compute FFT
            // 4. Apply mel filterbank
            // 5. Take log of filterbank energies
            // 6. Apply DCT to get MFCCs
            
            // For demo, generate simple features based on audio
            float energy = 0;
            for (short sample : buffer) {
                energy += Math.abs(sample) / 32768.0f;
            }
            energy /= buffer.length;
            
            // Fill feature vector with placeholder values
            for (int i = 0; i < features.length; i++) {
                features[i] = energy * (i + 1) / features.length;
            }
            
            return features;
        }
    }
    
    /**
     * Circular buffer for tracking history
     */
    private static class CircularBuffer<T> {
        private final T[] buffer;
        private int head = 0;
        private int tail = 0;
        private int size = 0;
        
        @SuppressWarnings("unchecked")
        public CircularBuffer(int capacity) {
            buffer = (T[]) new Object[capacity];
        }
        
        public void add(T item) {
            buffer[head] = item;
            head = (head + 1) % buffer.length;
            
            if (size < buffer.length) {
                size++;
            } else {
                tail = (tail + 1) % buffer.length;
            }
        }
        
        public int size() {
            return size;
        }
        
        public T[] getItems() {
            @SuppressWarnings("unchecked")
            T[] result = (T[]) new Object[size];
            
            for (int i = 0; i < size; i++) {
                result[i] = buffer[(tail + i) % buffer.length];
            }
            
            return result;
        }
    }
}