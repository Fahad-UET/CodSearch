export type LLMModel =
  | 'anthropic/claude-3.5-sonnet'
  | 'anthropic/claude-3-5-haiku'
  | 'anthropic/claude-3-haiku'
  | 'google/gemini-pro-1.5'
  | 'google/gemini-flash-1.5'
  | 'google/gemini-flash-1.5-8b'
  | 'meta-llama/llama-3.2-1b-instruct'
  | 'meta-llama/llama-3.2-3b-instruct'
  | 'meta-llama/llama-3.1-8b-instruct'
  | 'meta-llama/llama-3.1-70b-instruct'
  | 'openai/gpt-4o-mini'
  | 'openai/gpt-4o'
  | 'deepseek/deepseek-r1';

export interface LLMRequestOptions {
  model?: LLMModel;
  prompt: string;
  system_prompt?: string;
  reasoning?: boolean;
}

export interface LLMResponse {
  output: string;
  reasoning?: string;
  partial?: boolean;
  error?: string;
}
