export interface TextGenerationProps {
  apiKey: string;
  model: string;
  onGenerated?: (text: string) => void;
}

export interface GenerateTextParams {
  apiKey: string;
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}