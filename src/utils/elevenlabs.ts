import { ElevenLabsClient } from 'elevenlabs';
import type { AddVoiceResponse, TranscriptionResponse } from '@/types/elevenlabs';
import { useVoice } from '../store/voice';
import { audioUrl, audioUrlProps } from '@/services/firebase/aiGenerations';

const API_KEY =
  import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_060daf1571fe015fbad9f5f86d5dea78106efc8cafaade2d';

if (!API_KEY) {
  console.warn('Missing ELEVENLABS_API_KEY in environment variables');
}

// Initialize client only if API key is available
const client = API_KEY
  ? new ElevenLabsClient({
      apiKey: API_KEY,
    })
  : null;

export const createAudioStreamFromText = async (
  text: string,
  voiceId: string,
  options: {
    speed?: number;
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  } = {}
): Promise<Uint8Array> => {
  if (!client) {
    throw new Error('ElevenLabs client not initialized. Please check your API key.');
  }

  const audioStream = await client.textToSpeech.convertAsStream(voiceId, {
    model_id: 'eleven_multilingual_v2',
    optimize_streaming_latency: 0,
    text,
    output_format: 'mp3_44100_128',
    voice_settings: {
      stability: options.stability ?? 0.5,
      similarity_boost: options.similarity_boost ?? 0.75,
      style: options.style ?? 0,
      use_speaker_boost: options.use_speaker_boost ?? true,
      speed: options.speed ?? 1,
      ...options,
    },
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  // Concatenate Uint8Arrays
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
};

export const createAudioUrlFromText = async (
  text: string,
  voiceId: string,
  userId: string,
  id: string,
  options = {}
): Promise<string> => {
  const buffer = await createAudioStreamFromText(text, voiceId, options);
  const url = await audioUrl({userId, id, buffer})
  return url;
};

export const cloneVoice = async (
  name: string,
  files: File[],
  description?: string,
  labels?: Record<string, string>
): Promise<AddVoiceResponse> => {
  if (!API_KEY) {
    throw new Error('Missing ELEVENLABS_API_KEY in environment variables');
  }

  try {
    // Validate file types
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp3'];
    const invalidFile = files.find(file => !validTypes.includes(file.type));
    if (invalidFile) {
      throw new Error(`Invalid file type: ${invalidFile.type}. Supported formats: mp3, wav, m4a`);
    }

    // Convert files to Blobs
    const fileBlobs = await Promise.all(
      files.map(async file => {
        const buffer = await file.arrayBuffer();
        return new Blob([buffer], { type: file.type });
      })
    );

    const response = await client.voices.add({
      name,
      files: fileBlobs,
      description,
      labels: labels ? JSON.stringify(labels) : undefined,
      remove_background_noise: false, // Keep original audio characteristics
    });

    // Add voice to store for tracking and cleanup
    useVoice.getState().addCustomVoice(response.voice_id);

    return response;
  } catch (error) {
    console.error('Failed to clone voice:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('413')) {
        throw new Error('File size too large. Each file should be between 2-10 minutes long.');
      }
      if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your ElevenLabs API key.');
      }
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.message.includes('invalid_content') || error.message.includes('corrupted')) {
        throw new Error(
          'Invalid audio file. Please ensure files are valid audio in mp3, wav, or m4a format.'
        );
      }
      throw error;
    }

    throw new Error('Failed to clone voice. Please try again.');
  }
};

export const createVoicePreview = async (description: string, name?: string, language?: string) => {
  if (!API_KEY) {
    throw new Error('Missing ELEVENLABS_API_KEY in environment variables');
  }

  try {
    const response = await client.textToVoice.createPreviews({
      // model_id: 'eleven_multilingual_v2',
      // optimize_streaming_latency: 0,
      voice_description: description,
      // name: name,
      // language: language,
      // text_input_model: 'eleven_multilingual_v2',
      text: 'Every act of kindness, no matter how small, carries value and can make a difference, as no gesture of goodwill is ever wasted.',
    });

    return response;
  } catch (error) {
    console.error('Failed to create voice preview:', error);
    throw error;
  }
};

export const getVoices = async () => {
  if (!API_KEY) return [];

  const defaultVoices = [
    {
      voice_id: 'JBFqnCBsd6RMkjVDRZzb',
      name: 'Rachel',
      preview_url:
        'https://storage.googleapis.com/eleven-public-prod/premade/voices/rachel/en-US/premade-rachel.mp3',
      category: 'premade',
      labels: {
        accent: 'american',
        description: 'soft',
        age: 'young',
        gender: 'female',
      },
    },
    {
      voice_id: 'pNInz6obpgDQGcFmaJgB',
      name: 'Adam',
      preview_url:
        'https://storage.googleapis.com/eleven-public-prod/premade/voices/adam/en-US/premade-adam.mp3',
      category: 'premade',
      labels: {
        accent: 'american',
        description: 'expressive',
        age: 'middle aged',
        gender: 'male',
      },
    },
  ];

  try {
    const response = await client.voices.getAll();
    const apiVoices = response.voices.map(voice => ({
      voice_id: voice.voice_id,
      name: voice.name || 'Unnamed Voice',
      preview_url: voice.preview_url,
      category: voice.category === 'cloned' ? 'cloned' : 'premade',
      labels: voice.labels,
    }));

    // If API returns voices, use them. Otherwise, use default voices
    return apiVoices.length > 0 ? apiVoices : defaultVoices;
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return defaultVoices; // Return default voices if API fails
  }
};

export const transcribeAudio = async (
  file: File | Blob,
  options: {
    modelId?: string;
    languageCode?: string;
    tagAudioEvents?: boolean;
    numSpeakers?: number;
    timestampsGranularity?: 'none' | 'word' | 'character';
    diarize?: boolean;
  } = {}
): Promise<any> => {
  if (!API_KEY) {
    throw new Error('Missing ELEVENLABS_API_KEY in environment variables');
  }

  try {
    const response = await client.speechToText.convert({
      file,
      model_id: options.modelId || 'scribe_v1',
      language_code: options.languageCode,
      tag_audio_events: options.tagAudioEvents ?? true,
      num_speakers: options.numSpeakers,
      timestamps_granularity: options.timestampsGranularity || 'word',
      diarize: options.diarize ?? false,
    });

    return response;
  } catch (error) {
    console.error('Failed to transcribe audio:', error);
    throw error;
  }
};
