import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AudioStreamingService, AudioChunk } from './audio-streaming.service';
import { Public } from '../auth/public.decorator';

interface AudioStreamRequest {
  sessionId: string;
  sampleRate: number;
  channels: number;
}

interface AudioChunkRequest {
  sessionId: string;
  chunk: AudioChunk;
}

@Controller('api/audio-streaming')
export class AudioStreamingController {
  constructor(private readonly audioStreamingService: AudioStreamingService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  async startStream(@Body() request: AudioStreamRequest): Promise<{ success: boolean; sessionId: string }> {
    try {
      await this.audioStreamingService.startStream(request.sessionId);
      return { success: true, sessionId: request.sessionId };
    } catch (error) {
      throw new BadRequestException(`Failed to start audio stream: ${error.message}`);
    }
  }

  @Post('stop/:sessionId')
  @HttpCode(HttpStatus.OK)
  async stopStream(@Param('sessionId') sessionId: string): Promise<{ success: boolean; sessionId: string }> {
    try {
      await this.audioStreamingService.stopStream(sessionId);
      return { success: true, sessionId };
    } catch (error) {
      throw new BadRequestException(`Failed to stop audio stream: ${error.message}`);
    }
  }

  @Post('chunk')
  @HttpCode(HttpStatus.OK)
  async processAudioChunk(@Body() request: AudioChunkRequest): Promise<{ success: boolean; chunkId: string }> {
    try {
      await this.audioStreamingService.processAudioChunk(request.chunk);
      return { success: true, chunkId: request.chunk.id };
    } catch (error) {
      throw new BadRequestException(`Failed to process audio chunk: ${error.message}`);
    }
  }

  @Post('chunks/batch')
  @HttpCode(HttpStatus.OK)
  async processAudioChunks(@Body() request: { sessionId: string; chunks: AudioChunk[] }): Promise<{ success: boolean; processedCount: number }> {
    try {
      const promises = request.chunks.map(chunk =>
        this.audioStreamingService.processAudioChunk(chunk)
      );
      await Promise.all(promises);
      return { success: true, processedCount: request.chunks.length };
    } catch (error) {
      throw new BadRequestException(`Failed to process audio chunks: ${error.message}`);
    }
  }

  @Post('status/:sessionId')
  @HttpCode(HttpStatus.OK)
  async getStreamStatus(@Param('sessionId') sessionId: string): Promise<{ active: boolean; sessionId: string }> {
    const isActive = this.audioStreamingService.isStreamActive(sessionId);
    return { active: isActive, sessionId };
  }

  @Post('active-streams')
  @HttpCode(HttpStatus.OK)
  async getActiveStreams(): Promise<{ streams: string[] }> {
    const streams = this.audioStreamingService.getActiveStreams();
    return { streams };
  }

  // Additional endpoints for WebSocket/real-time communication can be added here
  // These would typically use @WebSocketGateway() and @SubscribeMessage() decorators
}
