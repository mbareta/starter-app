# Audio Streaming Feature

This project includes a complete real-time audio streaming solution that allows users to record audio from their browser and stream it to the server in real-time.

## 🎯 Overview

The audio streaming feature consists of:

1. **Frontend Vue Component** (`AudioStreamer.vue`) - Handles browser audio recording and streaming
2. **Backend NestJS Service** (`AudioStreamingService`) - Processes and manages audio streams
3. **Backend Controller** (`AudioStreamingController`) - Provides REST API endpoints
4. **Demo Page** (`AudioStreamingDemo.vue`) - Showcases the feature with configuration options

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Modern browser with microphone support
- HTTPS enabled (required for microphone access)

### Installation

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Start the server:**
   ```bash
   cd server
   npm run start:dev
   ```

4. **Start the client:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the demo:**
   Navigate to `http://localhost:5173/audio-streaming` in your browser

## 📁 File Structure

```
├── server/
│   └── src/
│       └── audio-streaming/
│           ├── audio-streaming.module.ts      # NestJS module
│           ├── audio-streaming.service.ts     # Business logic
│           ├── audio-streaming.controller.ts  # REST API endpoints
│           └── audio-streaming.service.spec.ts # Unit tests
├── client/
│   └── src/
│       └── pages/
│           └── user/
│               ├── components/
│               │   ├── AudioStreamer.vue      # Main component
│               │   └── AudioStreamer.md       # Component docs
│               ├── AudioStreamingDemo.vue     # Demo page
│               └── router.ts                  # Route configuration
└── AUDIO_STREAMING_README.md                  # This file
```

## 🎤 Frontend Component

### AudioStreamer.vue

A Vue 3 component that provides:

- **Real-time audio recording** from microphone
- **Live streaming** to server via HTTP requests
- **Visual feedback** with audio level meters
- **Pause/resume** functionality
- **Error handling** and browser compatibility checks
- **Configurable** audio quality settings

#### Key Features:

- **Audio Visualization**: Real-time waveform display
- **Status Indicators**: Clear visual feedback for recording state
- **Error Handling**: Comprehensive error messages and recovery
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Keyboard navigation and screen reader support

#### Props:

```typescript
interface Props {
  apiUrl?: string;        // API endpoint (default: '/api/audio-streaming')
  sampleRate?: number;    // Audio sample rate (default: 44100)
  channels?: number;      // Audio channels (default: 1)
  chunkSize?: number;     // Chunk size (default: 4096)
}
```

#### Events:

```typescript
interface Emits {
  recordingStarted: [sessionId: string];
  recordingStopped: [sessionId: string, duration: number];
  error: [error: string];
  chunkSent: [chunkId: string];
}
```

## 🔧 Backend Service

### AudioStreamingService

Handles the server-side audio processing:

- **Session Management**: Tracks active audio streams
- **Audio Processing**: Processes incoming audio chunks
- **Event Emission**: Emits events for real-time processing
- **Error Handling**: Graceful error handling and logging

#### Key Methods:

- `startStream(sessionId)`: Initialize a new audio stream
- `stopStream(sessionId)`: Terminate an audio stream
- `processAudioChunk(chunk)`: Process incoming audio data
- `getActiveStreams()`: Get list of active streams
- `isStreamActive(sessionId)`: Check if stream is active

### AudioStreamingController

Provides REST API endpoints:

- `POST /api/audio-streaming/start` - Start audio stream
- `POST /api/audio-streaming/stop/:sessionId` - Stop audio stream
- `POST /api/audio-streaming/chunk` - Send audio chunk
- `POST /api/audio-streaming/chunks/batch` - Send multiple chunks
- `POST /api/audio-streaming/status/:sessionId` - Get stream status
- `POST /api/audio-streaming/active-streams` - Get active streams

## 🎨 Demo Page

### AudioStreamingDemo.vue

A comprehensive demo page that showcases:

- **Configuration Panel**: Adjust audio settings in real-time
- **Live Component**: Interactive audio streaming component
- **Event Log**: Real-time event logging and debugging
- **Usage Examples**: Code examples and documentation

## 🔌 API Reference

### Start Stream

```http
POST /api/audio-streaming/start
Content-Type: application/json

{
  "sessionId": "session_1234567890_abc123",
  "sampleRate": 44100,
  "channels": 1
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123"
}
```

### Send Audio Chunk

```http
POST /api/audio-streaming/chunk
Content-Type: application/json

{
  "sessionId": "session_1234567890_abc123",
  "chunk": {
    "id": "chunk_1234567890_xyz789",
    "timestamp": 1640995200000,
    "data": "base64_encoded_audio_data",
    "sampleRate": 44100,
    "channels": 1
  }
}
```

**Response:**
```json
{
  "success": true,
  "chunkId": "chunk_1234567890_xyz789"
}
```

### Stop Stream

```http
POST /api/audio-streaming/stop/session_1234567890_abc123
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123"
}
```

## 🧪 Testing

### Unit Tests

Run the audio streaming service tests:

```bash
cd server
npm test -- audio-streaming.service.spec.ts
```

### Manual Testing

1. **Browser Compatibility**: Test in Chrome, Firefox, Safari, Edge
2. **Audio Quality**: Test different sample rates and chunk sizes
3. **Network Conditions**: Test with slow/fast connections
4. **Error Scenarios**: Test microphone access denial, network errors

## 🔒 Security Considerations

- **HTTPS Required**: Microphone access requires secure context
- **Session Management**: Unique session IDs prevent conflicts
- **Input Validation**: All inputs are validated server-side
- **Rate Limiting**: Consider implementing rate limiting for production
- **Data Privacy**: Audio data is not stored by default

## 🚀 Production Deployment

### Environment Variables

```bash
# Server configuration
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url

# Audio processing
AUDIO_CHUNK_SIZE=4096
AUDIO_SAMPLE_RATE=44100
AUDIO_CHANNELS=1
```

### Performance Optimization

1. **Chunk Size**: Adjust based on network conditions
2. **Sample Rate**: Use lower rates for voice, higher for music
3. **Compression**: Consider audio compression for bandwidth
4. **Caching**: Implement caching for frequently accessed data
5. **Load Balancing**: Use load balancers for high traffic

### Monitoring

- **Audio Quality Metrics**: Monitor sample rates and chunk sizes
- **Network Performance**: Track upload speeds and latency
- **Error Rates**: Monitor failed chunks and connection errors
- **Resource Usage**: Monitor CPU and memory usage

## 🐛 Troubleshooting

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

## 📚 Additional Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
