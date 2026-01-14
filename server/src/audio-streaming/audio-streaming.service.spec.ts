import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AudioStreamingService, AudioChunk } from './audio-streaming.service';

describe('AudioStreamingService', () => {
  let service: AudioStreamingService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioStreamingService,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AudioStreamingService>(AudioStreamingService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processAudioChunk', () => {
    it('should process audio chunk successfully', async () => {
      const mockChunk: AudioChunk = {
        id: 'test-chunk-1',
        timestamp: Date.now(),
        data: Buffer.from('test audio data'),
        sampleRate: 44100,
        channels: 1,
      };

      await expect(service.processAudioChunk(mockChunk)).resolves.not.toThrow();
      expect(eventEmitter.emit).toHaveBeenCalledWith('audio.chunk.received', mockChunk);
    });

    it('should handle processing errors gracefully', async () => {
      const mockChunk: AudioChunk = {
        id: 'test-chunk-2',
        timestamp: Date.now(),
        data: Buffer.from('test audio data'),
        sampleRate: 44100,
        channels: 1,
      };

      // Mock a processing error
      jest.spyOn(service as any, 'saveAudioChunk').mockRejectedValue(new Error('Save failed'));

      await expect(service.processAudioChunk(mockChunk)).rejects.toThrow('Save failed');
    });
  });

  describe('startStream', () => {
    it('should start a stream successfully', async () => {
      const sessionId = 'test-session-1';

      await expect(service.startStream(sessionId)).resolves.not.toThrow();
      expect(eventEmitter.emit).toHaveBeenCalledWith('audio.stream.started', { sessionId });
      expect(service.isStreamActive(sessionId)).toBe(true);
    });

    it('should handle multiple streams', async () => {
      const session1 = 'session-1';
      const session2 = 'session-2';

      await service.startStream(session1);
      await service.startStream(session2);

      expect(service.isStreamActive(session1)).toBe(true);
      expect(service.isStreamActive(session2)).toBe(true);
      expect(service.getActiveStreams()).toContain(session1);
      expect(service.getActiveStreams()).toContain(session2);
    });
  });

  describe('stopStream', () => {
    it('should stop a stream successfully', async () => {
      const sessionId = 'test-session-2';

      await service.startStream(sessionId);
      expect(service.isStreamActive(sessionId)).toBe(true);

      await expect(service.stopStream(sessionId)).resolves.not.toThrow();
      expect(eventEmitter.emit).toHaveBeenCalledWith('audio.stream.stopped', { sessionId });
      expect(service.isStreamActive(sessionId)).toBe(false);
    });

    it('should handle stopping non-existent stream', async () => {
      const sessionId = 'non-existent-session';

      await expect(service.stopStream(sessionId)).resolves.not.toThrow();
      expect(service.isStreamActive(sessionId)).toBe(false);
    });
  });

  describe('getActiveStreams', () => {
    it('should return empty array when no streams are active', () => {
      expect(service.getActiveStreams()).toEqual([]);
    });

    it('should return all active stream IDs', async () => {
      const sessions = ['session-1', 'session-2', 'session-3'];

      for (const session of sessions) {
        await service.startStream(session);
      }

      const activeStreams = service.getActiveStreams();
      expect(activeStreams).toHaveLength(3);
      sessions.forEach(session => {
        expect(activeStreams).toContain(session);
      });
    });
  });

  describe('isStreamActive', () => {
    it('should return false for non-existent stream', () => {
      expect(service.isStreamActive('non-existent')).toBe(false);
    });

    it('should return true for active stream', async () => {
      const sessionId = 'active-session';
      await service.startStream(sessionId);
      expect(service.isStreamActive(sessionId)).toBe(true);
    });

    it('should return false for stopped stream', async () => {
      const sessionId = 'stopped-session';
      await service.startStream(sessionId);
      await service.stopStream(sessionId);
      expect(service.isStreamActive(sessionId)).toBe(false);
    });
  });
});
