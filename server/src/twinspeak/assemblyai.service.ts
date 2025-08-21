import { AudioTranscriptLoader } from '@langchain/community/document_loaders/web/assemblyai';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssemblyAiService {
  constructor(protected configService: ConfigService) {}

  async uploadAudio(buffer: Buffer): Promise<string> {
    const res = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: this.configService.get('ASSEMBLY_AI_KEY'),
        'content-type': 'application/octet-stream'
      },
      body: buffer
    });
    const { upload_url } = await res.json();
    return upload_url;
  }

  async transcribeAudioURL(audioUrl: string): Promise<any> {
    const loader = new AudioTranscriptLoader({
      audio: audioUrl
    }, {
      apiKey: this.configService.get('ASSEMBLY_AI_KEY')
    });
    const res = await loader.load();
    return res[0].pageContent;
  }
}
