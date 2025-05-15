package com.humanfirewall.aidetector;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Service to monitor phone calls for AI-generated voices.
 * This service runs in the foreground while calls are active.
 */
public class CallMonitorService extends Service {
    private static final String TAG = "CallMonitorService";
    private static final String CHANNEL_ID = "AIDetectorChannel";
    private static final int NOTIFICATION_ID = 1001;
    
    // Audio configuration
    private static final int SAMPLE_RATE = 16000; // Hz
    private static final int BUFFER_SIZE = 1024;
    private static final int RECORDING_BUFFER_SECONDS = 5;
    
    private AudioRecord audioRecord;
    private boolean isRecording = false;
    private AIDetectionEngine aiDetector;
    private ExecutorService executor;
    private AlertManager alertManager;
    
    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Service created");
        
        // Initialize components
        aiDetector = new AIDetectionEngine(this);
        executor = Executors.newSingleThreadExecutor();
        alertManager = new AlertManager(this);
        
        createNotificationChannel();
    }
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "Service started");
        
        // Start as a foreground service with notification
        Notification notification = createNotification();
        startForeground(NOTIFICATION_ID, notification);
        
        // Begin monitoring phone call audio
        startAudioMonitoring();
        
        return START_STICKY;
    }
    
    @Override
    public IBinder onBind(Intent intent) {
        return null; // Not used for binding
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        stopAudioMonitoring();
        executor.shutdown();
        Log.d(TAG, "Service destroyed");
    }
    
    /**
     * Starts monitoring the call audio for AI voice detection
     */
    private void startAudioMonitoring() {
        if (isRecording) return;
        
        try {
            // Configure audio recorder for voice call audio
            int minBufferSize = AudioRecord.getMinBufferSize(
                    SAMPLE_RATE,
                    AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT);
            
            // Use VOICE_DOWNLINK to capture incoming call audio only
            audioRecord = new AudioRecord(
                    MediaRecorder.AudioSource.VOICE_DOWNLINK,
                    SAMPLE_RATE,
                    AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT,
                    Math.max(minBufferSize, SAMPLE_RATE * 2));
            
            // Check if audio recorder was successfully initialized
            if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
                Log.e(TAG, "AudioRecord initialization failed");
                return;
            }
            
            // Begin recording
            audioRecord.startRecording();
            isRecording = true;
            
            // Process audio in background thread
            executor.execute(this::processAudioForAIDetection);
            
        } catch (Exception e) {
            Log.e(TAG, "Error starting audio monitoring", e);
        }
    }
    
    /**
     * Stops audio monitoring
     */
    private void stopAudioMonitoring() {
        isRecording = false;
        if (audioRecord != null) {
            audioRecord.stop();
            audioRecord.release();
            audioRecord = null;
        }
    }
    
    /**
     * Continuously processes audio buffers to detect AI-generated voices
     */
    private void processAudioForAIDetection() {
        // Buffer to hold audio data
        short[] audioBuffer = new short[BUFFER_SIZE];
        
        while (isRecording) {
            // Read audio data from call
            int readResult = audioRecord.read(audioBuffer, 0, BUFFER_SIZE);
            
            if (readResult > 0) {
                // Process the audio buffer for AI detection
                boolean isAIDetected = aiDetector.analyzeAudioChunk(audioBuffer, readResult);
                
                if (isAIDetected) {
                    Log.w(TAG, "AI voice detected in call!");
                    // Trigger alert
                    alertManager.triggerAIDetectedAlert();
                    
                    // Pause briefly after an alert to avoid repetitive alerts
                    try {
                        Thread.sleep(5000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }
    }
    
    /**
     * Creates notification channel for foreground service
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "AI Voice Detector",
                    NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Monitors active calls for AI-generated voices");
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
    
    /**
     * Creates notification for foreground service
     */
    private Notification createNotification() {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("AI Voice Protection Active")
                .setContentText("Monitoring call for AI-generated voices")
                .setSmallIcon(R.drawable.ic_shield)
                .setPriority(NotificationCompat.PRIORITY_LOW);
                
        return builder.build();
    }
}