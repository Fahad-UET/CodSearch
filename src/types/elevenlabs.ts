export interface TranscriptionResponse {
  language_code: string;
  language_probability: number;
  text: string;
  words: Array<{
    text: string;
    type: 'word' | 'spacing';
    start: number;
    end: number;
    speaker_id?: string;
    characters?: Array<{
      text: string;
      start: number;
      end: number;
    }>;
  }>;
}

export interface VoicePreviewResponse {
  previews: Array<{
    audio_base_64: string;
    media_type: string;
    generated_voice_id: string;
  }>;
}

export interface AddVoiceResponse {
  voice_id: string;
  name?: string;
  category?: 'cloned' | 'premade';
  preview_url?: string;
  labels?: Record<string, string>;
}
