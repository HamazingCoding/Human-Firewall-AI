package com.humanfirewall.aidetector;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

/**
 * Manages alerts when AI-generated voices are detected.
 * Provides audio, visual, and vibration feedback.
 */
public class AlertManager {
    private static final String TAG = "AlertManager";
    private static final String CHANNEL_ID = "AIDetectorAlertsChannel";
    private static final int ALERT_NOTIFICATION_ID = 2001;
    
    private Context context;
    private Handler mainHandler;
    private AudioTrack audioTrack;
    private short[] alertAudioData;
    private long lastAlertTime = 0;
    private static final long MIN_ALERT_INTERVAL_MS = 3000; // Minimum 3 seconds between alerts
    
    public AlertManager(Context context) {
        this.context = context;
        this.mainHandler = new Handler(Looper.getMainLooper());
        
        // Initialize audio playback
        initializeAudioTrack();
        
        // Load the alert audio data
        loadAlertAudio();
    }
    
    /**
     * Triggers an alert when AI voice is detected
     */
    public void triggerAIDetectedAlert() {
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastAlertTime < MIN_ALERT_INTERVAL_MS) {
            // Skip alert if triggered too soon after previous alert
            return;
        }
        
        lastAlertTime = currentTime;
        
        // Play audio alert
        playAlertSound();
        
        // Show visual notification
        showAlertNotification();
        
        // Vibrate device
        vibrateDevice();
        
        // Show toast message on main thread
        mainHandler.post(() -> {
            Toast.makeText(context, "⚠️ AI VOICE DETECTED ⚠️", Toast.LENGTH_LONG).show();
        });
    }
    
    /**
     * Initializes the audio track for playing alert sounds
     */
    private void initializeAudioTrack() {
        try {
            int sampleRate = 44100;
            int channelConfig = AudioFormat.CHANNEL_OUT_MONO;
            int audioFormat = AudioFormat.ENCODING_PCM_16BIT;
            
            // Calculate buffer size
            int minBufferSize = AudioTrack.getMinBufferSize(
                    sampleRate, channelConfig, audioFormat);
            
            // Create AudioTrack
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build();
                
                AudioFormat format = new AudioFormat.Builder()
                        .setSampleRate(sampleRate)
                        .setEncoding(audioFormat)
                        .setChannelMask(channelConfig)
                        .build();
                
                audioTrack = new AudioTrack.Builder()
                        .setAudioAttributes(audioAttributes)
                        .setAudioFormat(format)
                        .setBufferSizeInBytes(minBufferSize)
                        .setTransferMode(AudioTrack.MODE_STATIC)
                        .build();
                
            } else {
                audioTrack = new AudioTrack(
                        AudioManager.STREAM_ALARM,
                        sampleRate,
                        channelConfig,
                        audioFormat,
                        minBufferSize,
                        AudioTrack.MODE_STATIC);
            }
            
        } catch (Exception e) {
            Log.e(TAG, "Error initializing audio track", e);
        }
    }
    
    /**
     * Loads the alert audio data
     * In a real implementation, this would load from a resource file
     */
    private void loadAlertAudio() {
        // In a real app, this would load the audio file from resources
        // For this example, we generate a simple alert tone
        
        // Generate a simple alert tone - 1kHz sine wave for 1 second
        int sampleRate = 44100;
        int numSamples = sampleRate;
        alertAudioData = new short[numSamples];
        
        double frequency = 1000; // 1kHz
        
        for (int i = 0; i < numSamples; i++) {
            // "AI Voice Detected" would be pre-recorded in a real app
            // This is just a placeholder tone
            alertAudioData[i] = (short) (32767 * Math.sin(2 * Math.PI * i * frequency / sampleRate));
        }
        
        try {
            // Write audio data to track
            audioTrack.write(alertAudioData, 0, alertAudioData.length);
        } catch (Exception e) {
            Log.e(TAG, "Error writing alert audio data", e);
        }
    }
    
    /**
     * Plays the alert sound
     */
    private void playAlertSound() {
        try {
            if (audioTrack != null && audioTrack.getState() == AudioTrack.STATE_INITIALIZED) {
                // Stop if currently playing
                if (audioTrack.getPlayState() == AudioTrack.PLAYSTATE_PLAYING) {
                    audioTrack.stop();
                }
                
                // Rewind and play
                audioTrack.reloadStaticData();
                audioTrack.play();
                
                Log.d(TAG, "Playing alert sound");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error playing alert sound", e);
        }
    }
    
    /**
     * Shows a visual notification for the alert
     */
    private void showAlertNotification() {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_warning)
                .setContentTitle("⚠️ AI Voice Detected ⚠️")
                .setContentText("Possible AI-generated voice detected in this call")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setAutoCancel(true);
        
        try {
            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            notificationManager.notify(ALERT_NOTIFICATION_ID, builder.build());
        } catch (Exception e) {
            Log.e(TAG, "Error showing notification", e);
        }
    }
    
    /**
     * Vibrates the device to alert the user
     */
    private void vibrateDevice() {
        try {
            Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
            
            // Check if device has vibrator
            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    // Pattern: 0ms delay, 500ms vibrate, 200ms pause, 500ms vibrate
                    long[] pattern = {0, 500, 200, 500};
                    
                    vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
                } else {
                    // For older devices
                    long[] pattern = {0, 500, 200, 500};
                    vibrator.vibrate(pattern, -1);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error vibrating device", e);
        }
    }
    
    /**
     * Cleans up resources
     */
    public void release() {
        if (audioTrack != null) {
            audioTrack.release();
            audioTrack = null;
        }
    }
}