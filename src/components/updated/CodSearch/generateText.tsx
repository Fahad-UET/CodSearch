import type { GptModel } from '../CodSearch/GptModel';

const DEEPSEEK_API_KEY = 'sk-c727de8143e347bfb802cf62adbeb41f';

const API_ENDPOINTS = ['https://api.deepseek.com/v1/chat/completions'];

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const TIMEOUT = 30000; // 30 seconds

export interface GenerationResponse {
  text: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  reasoning_content?: string;
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(prompt: string, retryCount = 0): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(API_ENDPOINTS[0], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert AI assistant specializing in generating high-quality marketing content.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await delay(RETRY_DELAY);
      return makeRequest(prompt, retryCount + 1);
    }
    throw error;
  }
}

export async function generateText(
  prompt: string,
  model: any = 'deepseek-chat',
  // model: GptModel = 'deepseek-chat',
  useReasoning: boolean = false
): Promise<GenerationResponse> {
  try {
    const response = await makeRequest(prompt);
    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    const content = data.choices[0].message.content;
    const totalTokens = data.usage?.total_tokens || 0;
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = totalTokens - promptTokens;

    return {
      text: content,
      promptTokens,
      completionTokens,
      totalTokens,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Text generation failed';
    throw new Error(errorMessage);
  }
}
