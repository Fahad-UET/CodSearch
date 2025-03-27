import { ElevenLabsConfig, TextToSpeechRequest } from './types';

const API_BASE_URL = 'https://api.elevenlabs.io/v1';

export async function generateSpeech(text: string, apiKey: string, voiceId: string = 'default') {
  if (!apiKey) {
    throw new Error('No ElevenLabs API key found');
  }

  const response = await fetch(`${API_BASE_URL}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    } as TextToSpeechRequest),
  });

  if (!response.ok) {
    return {error: `ElevenLabs API error: ${response.statusText}`}
    // throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  const audioBuffer: any = await response.blob();
  return {audioBuffer, success: true};
}