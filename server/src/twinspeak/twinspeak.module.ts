import { AssemblyAiService } from './assemblyai.service';
import { HumeService } from './hume.service';
import { Module } from '@nestjs/common';
import { TwinspeakController } from './twinspeak.controller';
import { TwinspeakService } from './twinspeak.service';

@Module({
  controllers: [TwinspeakController],
  providers: [AssemblyAiService, TwinspeakService, HumeService]
})
export class TwinspeakModule {}
