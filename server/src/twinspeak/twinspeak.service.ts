import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Injectable } from '@nestjs/common';
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwinspeakService {
  chatModel: ChatOpenAI;

  constructor(protected configService: ConfigService) {
    const apiKey: string = this.configService.get('OPENAI_API_KEY');
    if (!apiKey) return;
    this.chatModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1000
    });
  }

  async create() {
    const messages = [
      new SystemMessage("You are a helpful assistant that explains complex topics simply."),
      new HumanMessage("Explain quantum computing in simple terms.")
    ];
    const res = await this.chatModel.invoke(messages);
    return res.content;
  }
}
