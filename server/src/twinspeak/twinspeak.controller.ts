import { Body, Controller, HttpCode, Post, Response } from '@nestjs/common';
import { Role, Roles } from '../auth/roles.decorator';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { AssemblyAiService } from './assemblyai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { HumeService } from './hume.service';
import { memoryStorage } from 'multer';
import { TwinspeakService } from './twinspeak.service';

@Controller('twinspeak')
export class TwinspeakController {
  constructor(
    private readonly twinspeakService: TwinspeakService,
    private readonly assemblyAiService: AssemblyAiService,
    private readonly humeService: HumeService
  ) {}

  @Roles(Role.Admin)
  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Response() res: Response
  ) {
    // const url = await this.assemblyAiService.uploadAudio(file.buffer);
    // return this.assemblyAiService.transcribeAudioURL(url);
    const jobId = await this.humeService.upload(file.buffer);
    console.log(jobId);
    const job = await this.humeService.getJobPredictions(jobId);
    console.log(job);
    return job;
  }
}
