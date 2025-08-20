import { Module } from '@nestjs/common';
import { TwinspeakService } from './twinspeak.service';
import { TwinspeakController } from './twinspeak.controller';

@Module({
  controllers: [TwinspeakController],
  providers: [TwinspeakService],
})
export class TwinspeakModule {}
