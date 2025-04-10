import axios from 'axios';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerationPrompt {
  content: string;
  context?: string;
  tone?: string;
  language?: string;
}

export function formatGenerationPrompt(prompt: GenerationPrompt): string {
  let formattedPrompt = prompt.content;

  if (prompt.context) {
    formattedPrompt = `Context: ${prompt.context}\n\n${formattedPrompt}`;
  }

  if (prompt.tone) {
    formattedPrompt += `\n\nPlease use a ${prompt.tone} tone.`;
  }

  if (prompt.language) {
    formattedPrompt += `\n\nPlease respond in ${prompt.language}.`;
  }

  return formattedPrompt;
}

interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface OpenAIConfig {
  apiKey: string;
  model: string;
}

const defaultDeepSeekConfig: DeepSeekConfig = {
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat'
};

export class TextGenerationService {
  private useOpenAI: boolean;
  private openAIConfig?: OpenAIConfig;
  private deepSeekConfig: DeepSeekConfig;

  constructor(useOpenAI = false, openAIConfig?: OpenAIConfig) {
    this.useOpenAI = useOpenAI;
    this.openAIConfig = openAIConfig;
    this.deepSeekConfig = defaultDeepSeekConfig;
  }

  async generateText(prompt: string, systemPrompt = 'You are a helpful assistant.'): Promise<string> {
    if (this.useOpenAI && !this.openAIConfig?.apiKey) {
      throw new Error('OpenAI API key is required when using OpenAI');
    }

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    try {
      if (this.useOpenAI) {
        return await this.generateWithOpenAI(messages);
      }
      return await this.generateWithDeepSeek(messages);
    } catch (error) {
      console.error('Text generation failed:', error);
      throw error;
    }
  }

  private async generateWithDeepSeek(messages: Message[]): Promise<string> {
    const response = await axios.post(
      `${this.deepSeekConfig.baseUrl}/chat/completions`,
      {
        model: this.deepSeekConfig.model,
        messages,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepSeekConfig.apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  private async generateWithOpenAI(messages: Message[]): Promise<string> {
    if (!this.openAIConfig) {
      throw new Error('OpenAI configuration is required');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.openAIConfig.model,
        messages,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIConfig.apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  setUseOpenAI(useOpenAI: boolean, config?: OpenAIConfig) {
    this.useOpenAI = useOpenAI;
    if (useOpenAI && config) {
      this.openAIConfig = config;
    }
  }
}