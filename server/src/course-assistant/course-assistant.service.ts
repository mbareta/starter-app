import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class CourseAssistantService {
  client: OpenAI;

  constructor(protected configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY')
    });
  }

  async respond(content: any, res): Promise<any> {
    const stream = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content }],
      stream: true
    });
    res.header('Content-Type', 'text/event-stream');
    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || '');
    }
    res.end();
  }
}
