# AudioStreamer Component

A Vue 3 component for real-time audio streaming from browser to server with visual feedback and comprehensive error handling.

## Features

- 🎤 **Real-time Audio Recording**: Capture audio from microphone with configurable quality settings
- 📡 **Live Streaming**: Stream audio chunks to server in real-time
- 📊 **Visual Feedback**: Audio level visualization and recording status indicators
- ⏸️ **Pause/Resume**: Pause and resume recording without losing the stream
- 🔧 **Configurable**: Customizable sample rate, channels, and chunk size
- 🛡️ **Error Handling**: Comprehensive error handling with user-friendly messages
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, accessible interface with smooth animations

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | `string` | `'/api/audio-streaming'` | API endpoint for audio streaming |
| `sampleRate` | `number` | `44100` | Audio sample rate in Hz |
| `channels` | `number` | `1` | Number of audio channels (1 = mono, 2 = stereo) |
| `chunkSize` | `number` | `4096` | Size of audio chunks to process |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `recording-started` | `sessionId: string` | Fired when recording starts |
| `recording-stopped` | `sessionId: string, duration: number` | Fired when recording stops |
| `error` | `error: string` | Fired when an error occurs |
| `chunk-sent` | `chunkId: string` | Fired when an audio chunk is sent to server |

## Basic Usage

```vue
<template>
  <AudioStreamer />
</template>

<script setup>
import AudioStreamer from './components/AudioStreamer.vue';
</script>
```

## Advanced Usage

```vue
<template>
  <AudioStreamer
    api-url="/api/custom-audio-endpoint"
    :sample-rate="16000"
    :channels="1"
    :chunk-size="2048"
    @recording-started="handleRecordingStart"
    @recording-stopped="handleRecordingStop"
    @error="handleError"
    @chunk-sent="handleChunkSent"
  />
</template>

<script setup>
import AudioStreamer from './components/AudioStreamer.vue';

const handleRecordingStart = (sessionId) => {
  console.log('Recording started:', sessionId);
};

const handleRecordingStop = (sessionId, duration) => {
  console.log('Recording stopped:', sessionId, 'Duration:', duration);
};

const handleError = (error) => {
  console.error('Audio error:', error);
};

const handleChunkSent = (chunkId) => {
  console.log('Chunk sent:', chunkId);
};
</script>
```

## Server API Endpoints

The component expects the following server endpoints:

### POST `/api/audio-streaming/start`
Start a new audio stream session.

**Request Body:**
```json
{
  "sessionId": "string",
  "sampleRate": "number",
  "channels": "number"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "string"
}
```

### POST `/api/audio-streaming/chunk`
Send an audio chunk to the server.

**Request Body:**
```json
{
  "sessionId": "string",
  "chunk": {
    "id": "string",
    "timestamp": "number",
    "data": "Buffer",
    "sampleRate": "number",
    "channels": "number"
  }
}
```

**Response:**
```json
{
  "success": true,
  "chunkId": "string"
}
```

### POST `/api/audio-streaming/stop/:sessionId`
Stop an audio stream session.

**Response:**
```json
{
  "success": true,
  "sessionId": "string"
}
```

## Browser Compatibility

The component requires the following browser APIs:
- `navigator.mediaDevices.getUserMedia`
- `AudioContext` or `webkitAudioContext`
- `ScriptProcessorNode` (for audio processing)

**Supported Browsers:**
- Chrome 66+
- Firefox 60+
- Safari 11+
- Edge 79+

## Audio Quality Settings

### Sample Rates
- **8,000 Hz**: Low quality, suitable for voice calls
- **16,000 Hz**: Standard quality for speech recognition
- **22,050 Hz**: CD quality for voice
- **44,100 Hz**: CD quality (default)
- **48,000 Hz**: Professional audio quality

### Chunk Sizes
- **1,024**: Low latency, high CPU usage
- **2,048**: Balanced latency and performance
- **4,096**: Good balance (default)
- **8,192**: Lower CPU usage, higher latency

## Error Handling

The component handles various error scenarios:
- Microphone access denied
- Browser not supported
- Network connectivity issues
- Server errors
- Audio processing errors

Errors are displayed to the user with clear messages and suggestions for resolution.

## Styling

The component uses scoped CSS with CSS custom properties for easy theming. You can override styles by targeting the component's CSS classes:

```css
.audio-streamer {
  /* Custom styles */
}

.record-button {
  /* Custom button styles */
}

.audio-visualization {
  /* Custom visualization styles */
}
```

## Performance Considerations

- **Chunk Size**: Smaller chunks provide lower latency but higher CPU usage
- **Sample Rate**: Higher sample rates provide better quality but more data
- **Channels**: Stereo doubles the data transfer compared to mono
- **Network**: Ensure stable network connection for real-time streaming

## Security

- Requires HTTPS in production for microphone access
- Audio data is sent as binary buffers
- Session IDs are generated client-side for security
- No audio data is stored in browser storage

## Troubleshooting

### Common Issues

1. **"Audio recording is not supported"**
   - Check browser compatibility
   - Ensure HTTPS is enabled
   - Check microphone permissions

2. **"Failed to start recording"**
   - Check microphone access permissions
   - Verify browser supports required APIs
   - Check console for detailed error messages

3. **"Failed to send audio chunk"**
   - Check network connectivity
   - Verify server endpoints are accessible
   - Check server logs for errors

4. **Poor audio quality**
   - Increase sample rate
   - Check microphone quality
   - Reduce background noise

### Debug Mode

Enable browser developer tools to see detailed logs:
- Audio processing events
- Network requests
- Error messages
- Performance metrics
