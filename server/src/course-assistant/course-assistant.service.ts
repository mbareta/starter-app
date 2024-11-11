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

  async respond(content: any): Promise<string> {
    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'gpt-3.5-turbo'
    });
    return response.choices[0].message.content;
  }
}
