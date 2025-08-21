import { Module } from '@nestjs/common';
import { AssemblyAiService } from './assemblyai.service';
import { TwinspeakController } from './twinspeak.controller';
import { TwinspeakService } from './twinspeak.service';

@Module({
  controllers: [TwinspeakController],
  providers: [TwinspeakService, AssemblyAiService]
})
export class TwinspeakModule {}
