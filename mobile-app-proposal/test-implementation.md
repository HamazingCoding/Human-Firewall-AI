# Testing the Real-Time AI Voice Detection Feature

This guide explains how to test the AI voice detection feature in development and production environments.

## Development Testing Environment

### Option 1: Simulated Call Testing

1. **Setup Test Environment**

```java
// TestActivity.java
public class TestActivity extends AppCompatActivity {
    private Button startTestButton;
    private Button playAIVoiceButton;
    private Button playRealVoiceButton;
    private TextView resultTextView;
    
    private AIDetectionEngine aiDetector;
    private AlertManager alertManager;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test);
        
        // Initialize components
        startTestButton = findViewById(R.id.start_test_button);
        playAIVoiceButton = findViewById(R.id.play_ai_voice_button);
        playRealVoiceButton = findViewById(R.id.play_real_voice_button);
        resultTextView = findViewById(R.id.result_text_view);
        
        aiDetector = new AIDetectionEngine(this);
        alertManager = new AlertManager(this);
        
        setupListeners();
    }
    
    private void setupListeners() {
        startTestButton.setOnClickListener(v -> {
            // Start test mode
            startService(new Intent(this, CallMonitorService.class));
            resultTextView.setText("Test mode active. Play AI or real voice to test detection.");
        });
        
        playAIVoiceButton.setOnClickListener(v -> {
            // Play pre-recorded AI voice sample
            playAudioSample("ai_voice_sample.mp3");
        });
        
        playRealVoiceButton.setOnClickListener(v -> {
            // Play pre-recorded human voice sample
            playAudioSample("human_voice_sample.mp3");
        });
    }
    
    private void playAudioSample(String filename) {
        // Play audio file through device speaker
        MediaPlayer mediaPlayer = new MediaPlayer();
        try {
            AssetFileDescriptor descriptor = getAssets().openFd(filename);
            mediaPlayer.setDataSource(
                    descriptor.getFileDescriptor(),
                    descriptor.getStartOffset(),
                    descriptor.getLength());
            descriptor.close();
            
            mediaPlayer.prepare();
            mediaPlayer.setOnCompletionListener(mp -> {
                mp.release();
            });
            mediaPlayer.start();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

2. **Test with Voice Samples**

Prepare various voice samples for testing:
- Known AI-generated voices from different models
- Human voice recordings with various accents and qualities
- Mixed samples with both human and AI content

3. **Analyze Results**

Track detection accuracy by logging:
- True positives: AI voice correctly detected
- False positives: Human voice incorrectly flagged as AI
- True negatives: Human voice correctly passed
- False negatives: AI voice missed

### Option 2: Automated Test Suite

```java
public class AIDetectionUnitTest {
    @Test
    public void testDetection_AIVoiceSamples() {
        Context context = ApplicationProvider.getApplicationContext();
        AIDetectionEngine detector = new AIDetectionEngine(context);
        
        // Load and process test samples
        List<AudioSample> aiSamples = TestUtils.loadAIVoiceSamples();
        
        int correctDetections = 0;
        for (AudioSample sample : aiSamples) {
            boolean detected = processSampleWithDetector(detector, sample);
            if (detected) correctDetections++;
        }
        
        // Assert detection rate above threshold
        float detectionRate = (float) correctDetections / aiSamples.size();
        assertTrue("AI detection rate should be above 0.9 but was " + detectionRate, 
                detectionRate > 0.9);
    }
    
    @Test
    public void testDetection_HumanVoiceSamples() {
        Context context = ApplicationProvider.getApplicationContext();
        AIDetectionEngine detector = new AIDetectionEngine(context);
        
        // Load and process test samples
        List<AudioSample> humanSamples = TestUtils.loadHumanVoiceSamples();
        
        int falsePositives = 0;
        for (AudioSample sample : humanSamples) {
            boolean detected = processSampleWithDetector(detector, sample);
            if (detected) falsePositives++;
        }
        
        // Assert false positive rate below threshold
        float falsePositiveRate = (float) falsePositives / humanSamples.size();
        assertTrue("False positive rate should be below 0.05 but was " + falsePositiveRate, 
                falsePositiveRate < 0.05);
    }
    
    private boolean processSampleWithDetector(AIDetectionEngine detector, AudioSample sample) {
        // Process the audio sample through detector
        short[] audioData = sample.getAudioData();
        return detector.analyzeAudioChunk(audioData, audioData.length);
    }
}
```

## Production Testing

### User-Accessible Tests

1. **Demo Mode in App**

Add a demo mode to the app that can be triggered by the user:

```java
public void startDemoMode() {
    // Load pre-recorded AI voice
    AssetFileDescriptor descriptor = getAssets().openFd("demo_ai_voice.mp3");
    MediaPlayer mediaPlayer = new MediaPlayer();
    mediaPlayer.setDataSource(descriptor.getFileDescriptor());
    mediaPlayer.prepare();
    
    // Start detection service
    startService(new Intent(this, CallMonitorService.class));
    
    // Show demo call UI
    showDemoCallUI();
    
    // Play pre-recorded AI voice after 3 seconds
    new Handler().postDelayed(() -> {
        mediaPlayer.start();
    }, 3000);
}
```

2. **Test Phone Number**

Provide users with a test phone number they can call:

```
Test our AI detection by calling: 1-555-AI-DETECT
This number will play AI-generated voice samples to test the app.
```

3. **Self-Test Mode**

```java
public void startSelfTest() {
    // Enable self-test mode
    PreferenceManager.getDefaultSharedPreferences(this)
            .edit()
            .putBoolean("self_test_mode", true)
            .apply();
    
    // Start monitoring service
    startService(new Intent(this, CallMonitorService.class));
    
    // Show instructions
    AlertDialog.Builder builder = new AlertDialog.Builder(this);
    builder.setTitle("Self-Test Mode Active")
           .setMessage("Make or receive a call and use an AI voice generator app on another device " +
                       "to create synthetic speech. Our detector should trigger an alert.")
           .setPositiveButton("OK", null)
           .show();
}
```

### Performance Monitoring

Track performance metrics in production:

1. **Detection Events Logging**
   - Log detection events to help analyze performance
   - Track detection latency and confidence scores

2. **Battery Usage Monitoring**
   - Monitor impact on device battery
   - Optimize detection algorithms for efficiency

3. **User Feedback System**
   - Allow users to report false positives/negatives
   - Use feedback to improve detection model