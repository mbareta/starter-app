<template>
  <div class="audio-streaming-demo">
    <div class="demo-header">
      <h1>Audio Streaming Demo</h1>
      <p>Test real-time audio streaming from browser to server</p>
    </div>

    <div class="demo-content">
      <div class="configuration-panel">
        <h3>Configuration</h3>
        <div class="config-grid">
          <div class="config-item">
            <label for="apiUrl">API URL:</label>
            <input
              id="apiUrl"
              v-model="config.apiUrl"
              type="text"
              placeholder="API endpoint URL"
            />
          </div>

          <div class="config-item">
            <label for="sampleRate">Sample Rate (Hz):</label>
            <select id="sampleRate" v-model="config.sampleRate">
              <option value="8000">8,000 Hz</option>
              <option value="16000">16,000 Hz</option>
              <option value="22050">22,050 Hz</option>
              <option value="44100">44,100 Hz</option>
              <option value="48000">48,000 Hz</option>
            </select>
          </div>

          <div class="config-item">
            <label for="channels">Channels:</label>
            <select id="channels" v-model="config.channels">
              <option value="1">Mono</option>
              <option value="2">Stereo</option>
            </select>
          </div>

          <div class="config-item">
            <label for="chunkSize">Chunk Size:</label>
            <select id="chunkSize" v-model="config.chunkSize">
              <option value="1024">1,024</option>
              <option value="2048">2,048</option>
              <option value="4096">4,096</option>
              <option value="8192">8,192</option>
            </select>
          </div>
        </div>
      </div>

      <div class="audio-component">
        <AudioStreamer
          :api-url="config.apiUrl"
          :sample-rate="config.sampleRate"
          :channels="config.channels"
          :chunk-size="config.chunkSize"
          @recording-started="handleRecordingStarted"
          @recording-stopped="handleRecordingStopped"
          @error="handleError"
          @chunk-sent="handleChunkSent"
        />
      </div>

      <div class="event-log">
        <h3>Event Log</h3>
        <div class="log-container">
          <div
            v-for="(event, index) in eventLog"
            :key="index"
            class="log-entry"
            :class="event.type"
          >
            <span class="timestamp">{{ formatTimestamp(event.timestamp) }}</span>
            <span class="event-type">{{ event.type }}</span>
            <span class="event-message">{{ event.message }}</span>
          </div>
        </div>
        <button @click="clearLog" class="clear-log-btn">Clear Log</button>
      </div>

      <div class="usage-examples">
        <h3>Usage Examples</h3>
        <div class="examples-grid">
          <div class="example-card">
            <h4>Basic Usage</h4>
            <pre><code>&lt;AudioStreamer /&gt;</code></pre>
          </div>

          <div class="example-card">
            <h4>Custom Configuration</h4>
            <pre><code>&lt;AudioStreamer
  api-url="/api/audio"
  :sample-rate="16000"
  :channels="1"
  :chunk-size="2048"
/&gt;</code></pre>
          </div>

          <div class="example-card">
            <h4>Event Handling</h4>
            <pre><code>&lt;AudioStreamer
  @recording-started="onStart"
  @recording-stopped="onStop"
  @error="onError"
  @chunk-sent="onChunk"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import AudioStreamer from './components/AudioStreamer.vue';

interface EventLogEntry {
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

// Configuration
const config = reactive({
  apiUrl: '/api/audio-streaming',
  sampleRate: 44100,
  channels: 1,
  chunkSize: 4096
});

// Event log
const eventLog = ref<EventLogEntry[]>([]);

// Methods
const addLogEntry = (type: EventLogEntry['type'], message: string) => {
  eventLog.value.unshift({
    timestamp: new Date(),
    type,
    message
  });

  // Keep only last 50 entries
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(0, 50);
  }
};

const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString();
};

const clearLog = () => {
  eventLog.value = [];
};

// Event handlers
const handleRecordingStarted = (sessionId: string) => {
  addLogEntry('success', `Recording started - Session: ${sessionId}`);
};

const handleRecordingStopped = (sessionId: string, duration: number) => {
  addLogEntry('info', `Recording stopped - Session: ${sessionId}, Duration: ${duration.toFixed(1)}s`);
};

const handleError = (error: string) => {
  addLogEntry('error', `Error: ${error}`);
};

const handleChunkSent = (chunkId: string) => {
  // Only log every 10th chunk to avoid spam
  if (eventLog.value.filter(e => e.type === 'info' && e.message.includes('Chunk sent')).length % 10 === 0) {
    addLogEntry('info', `Chunk sent: ${chunkId}`);
  }
};
</script>

<style scoped>
.audio-streaming-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.demo-header p {
  color: #7f8c8d;
  font-size: 18px;
}

.demo-content {
  display: grid;
  gap: 30px;
}

.configuration-panel {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.configuration-panel h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-item label {
  font-weight: 600;
  color: #34495e;
  font-size: 14px;
}

.config-item input,
.config-item select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.config-item input:focus,
.config-item select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.audio-component {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.event-log {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.event-log h3 {
  margin-bottom: 16px;
  color: #2c3e50;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: #f8f9fa;
  margin-bottom: 16px;
}

.log-entry {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #e9ecef;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry.info {
  background: #d1ecf1;
  color: #0c5460;
}

.log-entry.success {
  background: #d4edda;
  color: #155724;
}

.log-entry.error {
  background: #f8d7da;
  color: #721c24;
}

.log-entry.warning {
  background: #fff3cd;
  color: #856404;
}

.timestamp {
  color: #6c757d;
  min-width: 80px;
}

.event-type {
  font-weight: 600;
  min-width: 60px;
  text-transform: uppercase;
}

.event-message {
  flex: 1;
}

.clear-log-btn {
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.clear-log-btn:hover {
  background: #5a6268;
}

.usage-examples {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.usage-examples h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.example-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background: #f8f9fa;
}

.example-card h4 {
  margin-bottom: 12px;
  color: #495057;
  font-size: 16px;
}

.example-card pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

.example-card code {
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .log-entry {
    flex-direction: column;
    gap: 4px;
  }

  .timestamp,
  .event-type {
    min-width: auto;
  }
}
</style>
