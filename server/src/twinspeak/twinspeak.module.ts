import { Module } from '@nestjs/common';
import { TwinspeakController } from './twinspeak.controller';
import { TwinspeakService } from './twinspeak.service';

@Module({
  controllers: [TwinspeakController],
  providers: [TwinspeakService]
})
export class TwinspeakModule {}
