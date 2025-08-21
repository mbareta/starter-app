import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TwinspeakService {
  constructor(protected configService: ConfigService) {}

  async create(res) {
    const chatModel: ChatOpenAI = new ChatOpenAI({
      openAIApiKey: this.configService.get('OPENAI_API_KEY'),
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000
    });
    const messages = [
      new SystemMessage(
        'You are a helpful assistant that explains complex topics simply.'
      ),
      new HumanMessage('Test.')
    ];
    const stream = await chatModel.stream(messages);
    res.header('Content-Type', 'text/event-stream');
    for await (const chunk of stream) {
      res.write(chunk.content);
    }
    res.end();
  }
}
