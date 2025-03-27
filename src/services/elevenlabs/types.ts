export interface ElevenLabsConfig {
  apiKey: string;
  voiceId?: string;
}

export interface TextToSpeechRequest {
  text: string;
  model_id: string;
  voice_settings: {
    stability: number;
    similarity_boost: number;
  };
}