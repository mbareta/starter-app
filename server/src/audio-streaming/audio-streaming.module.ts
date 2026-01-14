import { Module } from '@nestjs/common';
import { AudioStreamingController } from './audio-streaming.controller';
import { AudioStreamingService } from './audio-streaming.service';

@Module({
  controllers: [AudioStreamingController],
  providers: [AudioStreamingService],
  exports: [AudioStreamingService],
})
export class AudioStreamingModule {}
