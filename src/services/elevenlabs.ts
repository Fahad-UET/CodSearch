import { ElevenLabsError } from '../types';
import type { ElevenLabsVoice, VoiceSettings } from '../types';

const API_BASE_URL = 'https://api.elevenlabs.io/v1';
let apiKey: string | null = null;

export function initializeElevenLabs(key: string) {
  apiKey = key;
}

async function makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  if (!apiKey) {
    throw new ElevenLabsError('Please set your ElevenLabs API key first');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new ElevenLabsError(
        errorData.detail || `Request failed with status ${response.status}`
      );
    }

    return response;
  } catch (error) {
    if (error instanceof ElevenLabsError) throw error;
    throw new ElevenLabsError(error instanceof Error ? error.message : 'Network request failed');
  }
}

export async function fetchVoices(): Promise<ElevenLabsVoice[]> {
  if (!apiKey) {
    throw new ElevenLabsError('Please set your ElevenLabs API key first');
  }

  try {
    const response = await makeRequest('/voices', {
      headers: { Accept: 'application/json' },
    });

    const data = await response.json();
    if (!data.voices || !Array.isArray(data.voices)) {
      throw new ElevenLabsError('Invalid response format from API');
    }

    return data.voices;
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      throw error;
    }
    throw new ElevenLabsError('Failed to fetch voices');
  }
}

export async function generateVoiceOver(
  apiKey: string,
  text: string,
  voiceId: string,
  settings: any
): Promise<ArrayBuffer> {
  if (!apiKey) {
    throw new ElevenLabsError('Please set your ElevenLabs API key first');
  }

  try {
    // Input validation
    if (!text.trim()) {
      throw new ElevenLabsError('Text cannot be empty');
    }
    if (!voiceId.trim()) {
      throw new ElevenLabsError('Voice ID is required');
    }
    if (!settings) {
      throw new ElevenLabsError('Voice settings are required');
    }

    const response = await makeRequest(`/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: settings,
      }),
    });

    const buffer = await response.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      throw new ElevenLabsError('Generated audio is empty');
    }

    return buffer;
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      throw error;
    }
    throw new ElevenLabsError(
      error instanceof Error
        ? `Voice generation failed: ${error.message}`
        : 'Voice generation failed'
    );
  }
}
