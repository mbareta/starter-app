<template>
  <div class="audio-streamer">
    <div class="audio-controls">
      <div class="status-indicator" :class="{ active: isRecording, error: hasError }">
        <div class="status-dot"></div>
        <span class="status-text">{{ statusText }}</span>
      </div>

      <div class="controls">
        <button
          @click="toggleRecording"
          :disabled="!isSupported || isProcessing"
          class="record-button"
          :class="{ recording: isRecording, disabled: !isSupported || isProcessing }"
        >
          <div class="button-content">
            <div class="icon">
              <svg v-if="!isRecording" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
              </svg>
            </div>
            <span>{{ isRecording ? 'Stop Recording' : 'Start Recording' }}</span>
          </div>
        </button>

        <button
          v-if="isRecording"
          @click="pauseRecording"
          :disabled="isPaused"
          class="pause-button"
          :class="{ paused: isPaused }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect v-if="!isPaused" x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect v-if="!isPaused" x="14" y="4" width="4" height="16" fill="currentColor"/>
            <polygon v-else points="5,3 19,12 5,21" fill="currentColor"/>
          </svg>
          {{ isPaused ? 'Resume' : 'Pause' }}
        </button>
      </div>
    </div>

    <div class="audio-visualization" v-if="isRecording">
      <canvas ref="visualizationCanvas" width="400" height="100"></canvas>
      <div class="audio-levels">
        <div
          v-for="(level, index) in audioLevels"
          :key="index"
          class="level-bar"
          :style="{ height: `${level}%` }"
        ></div>
      </div>
    </div>

    <div class="stream-info" v-if="isRecording">
      <div class="info-item">
        <span class="label">Session ID:</span>
        <span class="value">{{ sessionId }}</span>
      </div>
      <div class="info-item">
        <span class="label">Duration:</span>
        <span class="value">{{ formatDuration(recordingDuration) }}</span>
      </div>
      <div class="info-item">
        <span class="label">Chunks Sent:</span>
        <span class="value">{{ chunksSent }}</span>
      </div>
      <div class="info-item">
        <span class="label">Sample Rate:</span>
        <span class="value">{{ sampleRate }} Hz</span>
      </div>
    </div>

    <div class="error-message" v-if="hasError">
      <div class="error-icon">⚠️</div>
      <div class="error-text">{{ errorMessage }}</div>
      <button @click="clearError" class="error-dismiss">Dismiss</button>
    </div>

    <div class="not-supported" v-if="!isSupported">
      <div class="not-supported-icon">🎤</div>
      <div class="not-supported-text">
        Audio recording is not supported in your browser.
        <br>Please use a modern browser with microphone access.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import axios from '../helpers/request';


// Props
interface Props {
  apiUrl?: string;
  chunkSize?: number;
  sampleRate?: number;
  channels?: number;
}

const props = withDefaults(defineProps<Props>(), {
  apiUrl: '/api/audio-streaming',
  chunkSize: 4096,
  sampleRate: 44100,
  channels: 1
});

// Emits
const emit = defineEmits<{
  recordingStarted: [sessionId: string];
  recordingStopped: [sessionId: string, duration: number];
  error: [error: string];
  chunkSent: [chunkId: string];
}>();

// Reactive state
const isRecording = ref(false);
const isPaused = ref(false);
const isProcessing = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const isSupported = ref(false);

const sessionId = ref('');
const recordingDuration = ref(0);
const chunksSent = ref(0);
const sampleRate = ref(props.sampleRate);

const audioLevels = reactive<number[]>([]);
const visualizationCanvas = ref<HTMLCanvasElement>();

// Audio context and stream
let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let processorNode: ScriptProcessorNode | null = null;
let durationTimer: number | null = null;
let levelUpdateTimer: number | null = null;

// Computed
const statusText = computed(() => {
  if (hasError.value) return 'Error';
  if (isProcessing.value) return 'Processing...';
  if (isRecording.value) {
    return isPaused.value ? 'Paused' : 'Recording';
  }
  return 'Ready';
});

// Methods
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const clearError = () => {
  hasError.value = false;
  errorMessage.value = '';
};

const setError = (message: string) => {
  hasError.value = true;
  errorMessage.value = message;
  emit('error', message);
};

const checkBrowserSupport = async (): Promise<boolean> => {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }

    // Check if AudioContext is supported
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      return false;
    }

    // Check if ScriptProcessorNode is supported (required for audio processing)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const testContext = new AudioContextClass();
    if (!testContext.createScriptProcessor) {
      testContext.close();
      return false;
    }
    testContext.close();

    // Try to get microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());

    return true;
  } catch (error) {
    console.error('Browser support check failed:', error);
    return false;
  }
};

const startRecording = async () => {
  try {
    isProcessing.value = true;
    clearError();

    // Generate session ID
    sessionId.value = generateSessionId();

    // Create audio context first to get the actual sample rate
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
    sampleRate.value = audioContext.sampleRate;

    // Resume audio context if it's suspended (required in some browsers)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Get microphone access with the actual sample rate from the audio context
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: sampleRate.value,
          channelCount: props.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    } catch (error) {
      // Fallback: try without specifying sample rate if the requested rate is not supported
      console.warn(`Requested sample rate ${sampleRate.value} not supported, trying with default`);
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: props.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    }

    // Create source node
    sourceNode = audioContext.createMediaStreamSource(mediaStream);

    // Create processor node for audio processing
    processorNode = audioContext.createScriptProcessor(props.chunkSize, props.channels, props.channels);

    // Log audio context and stream information for debugging
    console.log('Audio Context Sample Rate:', audioContext.sampleRate);
    console.log('Audio Context State:', audioContext.state);
    console.log('Media Stream Tracks:', mediaStream.getAudioTracks().map(track => ({
      label: track.label,
      enabled: track.enabled,
      muted: track.muted,
      readyState: track.readyState
    })));

    // Set up audio processing
    processorNode.onaudioprocess = (event) => {
      if (!isRecording.value || isPaused.value) return;

      const inputBuffer = event.inputBuffer;
      const inputData = inputBuffer.getChannelData(0);

      // Convert Float32Array to Int16Array for transmission
      const int16Data = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
      }

      // Create audio chunk
      const chunk = {
        id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        data: new Uint8Array(int16Data.buffer),
        sampleRate: sampleRate.value,
        channels: props.channels
      };

      // Send chunk to server
      sendAudioChunk(chunk);

      // Update audio levels for visualization
      updateAudioLevels(inputData);
    };

    // Connect nodes
    sourceNode.connect(processorNode);
    processorNode.connect(audioContext.destination);

    // Start stream on server
    await startStreamOnServer();

    // Start duration timer
    durationTimer = window.setInterval(() => {
      if (isRecording.value && !isPaused.value) {
        recordingDuration.value += 0.1;
      }
    }, 100);

    // Start level update timer
    levelUpdateTimer = window.setInterval(() => {
      if (isRecording.value && !isPaused.value) {
        updateVisualization();
      }
    }, 50);

    isRecording.value = true;
    isPaused.value = false;
    emit('recordingStarted', sessionId.value);

  } catch (error) {
    console.error('Failed to start recording:', error);

    // Provide more specific error messages for common issues
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      if (error.message.includes('sample-rate')) {
        errorMessage = 'Sample rate mismatch. Please try a different sample rate setting.';
      } else if (error.message.includes('Permission')) {
        errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
      } else if (error.message.includes('NotSupportedError')) {
        errorMessage = 'Audio recording is not supported in this browser. Please use a modern browser.';
      } else {
        errorMessage = error.message;
      }
    }

    setError(`Failed to start recording: ${errorMessage}`);
  } finally {
    isProcessing.value = false;
  }
};

const stopRecording = async () => {
  try {
    isProcessing.value = true;

    // Stop timers
    if (durationTimer) {
      clearInterval(durationTimer);
      durationTimer = null;
    }
    if (levelUpdateTimer) {
      clearInterval(levelUpdateTimer);
      levelUpdateTimer = null;
    }

    // Stop stream on server
    await stopStreamOnServer();

    // Clean up audio nodes
    if (processorNode) {
      processorNode.disconnect();
      processorNode = null;
    }
    if (sourceNode) {
      sourceNode.disconnect();
      sourceNode = null;
    }
    if (audioContext) {
      await audioContext.close();
      audioContext = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }

    const finalDuration = recordingDuration.value;
    isRecording.value = false;
    isPaused.value = false;
    recordingDuration.value = 0;
    chunksSent.value = 0;
    audioLevels.length = 0;

    emit('recordingStopped', sessionId.value, finalDuration);

  } catch (error) {
    console.error('Failed to stop recording:', error);
    setError(`Failed to stop recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    isProcessing.value = false;
  }
};

const pauseRecording = () => {
  isPaused.value = !isPaused.value;
};

const toggleRecording = async () => {
  if (isRecording.value) {
    await stopRecording();
  } else {
    await startRecording();
  }
};

const startStreamOnServer = async () => {
  try {
    const response = await axios.post(`${props.apiUrl}/start`, {
      sessionId: sessionId.value,
      sampleRate: sampleRate.value,
      channels: props.channels
    });

    if (!response.data.success) {
      throw new Error('Server failed to start stream');
    }
  } catch (error) {
    console.error('Failed to start stream on server:', error);
    throw error;
  }
};

const stopStreamOnServer = async () => {
  try {
    const response = await axios.post(`${props.apiUrl}/stop/${sessionId.value}`);

    if (!response.data.success) {
      throw new Error('Server failed to stop stream');
    }
  } catch (error) {
    console.error('Failed to stop stream on server:', error);
    throw error;
  }
};

const sendAudioChunk = async (chunk: any) => {
  try {
    const response = await axios.post(`${props.apiUrl}/chunk`, {
      sessionId: sessionId.value,
      chunk
    });

    if (response.data.success) {
      chunksSent.value++;
      emit('chunkSent', chunk.id);
    }
  } catch (error) {
    console.error('Failed to send audio chunk:', error);
    // Don't throw here to avoid stopping the recording
  }
};

const updateAudioLevels = (audioData: Float32Array) => {
  // Calculate RMS (Root Mean Square) for audio level
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += audioData[i] * audioData[i];
  }
  const rms = Math.sqrt(sum / audioData.length);
  const level = Math.min(100, rms * 1000); // Scale and cap at 100

  // Update levels array (keep last 20 levels)
  audioLevels.push(level);
  if (audioLevels.length > 20) {
    audioLevels.shift();
  }
};

const updateVisualization = () => {
  if (!visualizationCanvas.value) return;

  const canvas = visualizationCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw waveform
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 2;
  ctx.beginPath();

  const barWidth = canvas.width / audioLevels.length;
  audioLevels.forEach((level, index) => {
    const x = index * barWidth;
    const height = (level / 100) * canvas.height;
    const y = (canvas.height - height) / 2;

    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
  });

  ctx.stroke();
};

// Lifecycle
onMounted(async () => {
  isSupported.value = await checkBrowserSupport();
});

onUnmounted(() => {
  if (isRecording.value) {
    stopRecording();
  }
});
</script>

<style scoped>
.audio-streamer {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.audio-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  background: #e9ecef;
  font-size: 14px;
  font-weight: 500;
}

.status-indicator.active {
  background: #d4edda;
  color: #155724;
}

.status-indicator.error {
  background: #f8d7da;
  color: #721c24;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6c757d;
  animation: pulse 2s infinite;
}

.status-indicator.active .status-dot {
  background: #28a745;
  animation: pulse 1s infinite;
}

.status-indicator.error .status-dot {
  background: #dc3545;
  animation: none;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.controls {
  display: flex;
  gap: 12px;
}

.record-button, .pause-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.record-button {
  background: #007bff;
  color: white;
}

.record-button:hover:not(.disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.record-button.recording {
  background: #dc3545;
}

.record-button.recording:hover {
  background: #c82333;
}

.record-button.disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.pause-button {
  background: #ffc107;
  color: #212529;
}

.pause-button:hover:not(:disabled) {
  background: #e0a800;
}

.pause-button.paused {
  background: #28a745;
  color: white;
}

.pause-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.audio-visualization {
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.audio-levels {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 60px;
  margin-top: 10px;
}

.level-bar {
  flex: 1;
  background: linear-gradient(to top, #4CAF50, #8BC34A);
  border-radius: 2px;
  min-height: 2px;
  transition: height 0.1s ease;
}

.stream-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-weight: 600;
  color: #6c757d;
}

.value {
  font-family: 'Courier New', monospace;
  color: #495057;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
}

.error-icon {
  font-size: 20px;
}

.error-text {
  flex: 1;
  font-weight: 500;
}

.error-dismiss {
  padding: 4px 8px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.error-dismiss:hover {
  background: #c82333;
}

.not-supported {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.not-supported-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.not-supported-text {
  line-height: 1.5;
}

canvas {
  width: 100%;
  height: 100px;
  border-radius: 4px;
  background: #f8f9fa;
}
</style>
