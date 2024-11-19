import OpenAI, { toFile } from 'openai';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseAssistantService {
  client: OpenAI;

  constructor(protected configService: ConfigService) {
    const apiKey = this.configService.get('OPENAI_API_KEY');
    if (!apiKey) return;
    this.client = new OpenAI({ apiKey });
  }

  async respond(content: any, res): Promise<any> {
    const thread = await this.client.beta.threads.create();
    await this.client.beta.threads.messages.create(thread.id, {
      role: 'user',
      content
    });
    const stream = await this.client.beta.threads.runs.stream(thread.id, {
      assistant_id: this.configService.get('OPENAI_ASSISTANT_ID')
    });
    res.header('Content-Type', 'text/event-stream');
    for await (const chunk of stream) {
      if (chunk.event === 'thread.message.delta') {
        res.write((chunk.data.delta.content[0] as any).text.value);
      } else if (chunk.event === 'thread.run.completed') {
        res.end();
      }
    }
  }

  async uploadFile(text: string, filename: string): Promise<any> {
    return this.client.beta.vectorStores.files.upload(
      this.configService.get('OPENAI_VECTOR_STORE_ID'),
      await toFile(Buffer.from(text), filename)
    );
  }

  async deleteFile(course): Promise<any> {
    if (!course.vectorStoreFileId) return;
    return this.client.beta.vectorStores.files.del(
      this.configService.get('OPENAI_VECTOR_STORE_ID'),
      course.vectorStoreFileId
    );
  }
}
