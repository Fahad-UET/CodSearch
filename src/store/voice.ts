import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ElevenLabsClient } from 'elevenlabs';
import { useHistory } from './history';

export interface VoiceState {
  customVoices: {
    id: string;
    createdAt: number;
  }[];
  addCustomVoice: (id: string) => void;
  updateVoiceTimestamp: (id: string) => void;
  removeCustomVoice: (id: string) => void;
  cleanupExpiredVoices: () => void;
}

export const useVoice = create<VoiceState>()(
  persist(
    (set, get) => ({
      customVoices: [],
      addCustomVoice: (id: string) => {
        // Remove any existing custom voices first
        const { customVoices } = get();
        customVoices.forEach(async voice => {
          await get().removeCustomVoice(voice.id);
        });

        set(state => ({
          customVoices: [{ id, createdAt: Date.now() }],
        }));

        // Schedule cleanup after 15 minutes
        setTimeout(() => {
          get().cleanupExpiredVoices();
        }, 15 * 60 * 1000);
      },
      updateVoiceTimestamp: (id: string) => {
        set(state => ({
          customVoices: state.customVoices.map(voice =>
            voice.id === id ? { ...voice, createdAt: Date.now() } : voice
          ),
        }));
      },
      removeCustomVoice: async (id: string) => {
        // Try to remove from API first
        try {
          // Only attempt API removal if we have an API key
          if (
            !import.meta.env.VITE_ELEVENLABS_API_KEY ||
            ''
          ) {
            console.warn('No API key found, skipping API voice removal');
            return;
          }

          const client = new ElevenLabsClient({
            apiKey:
              import.meta.env.VITE_ELEVENLABS_API_KEY ||
              '',
          });
          await client.voices.delete(id);
        } catch (err) {
          // Ignore 400 errors (voice doesn't exist) as this is expected sometimes
          if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === 400) {
          } else {
            console.error(`Failed to remove voice ${id} from API:`, err);
          }
        }

        // Always remove from local store regardless of API result
        set(state => ({
          customVoices: state.customVoices.filter(voice => voice.id !== id),
        }));
      },
      cleanupExpiredVoices: async () => {
        const FIFTEEN_MINUTES = 15 * 60 * 1000;
        const now = Date.now();

        // Get expired voices
        const expiredVoices = get().customVoices.filter(
          voice => now - voice.createdAt >= FIFTEEN_MINUTES
        );

        // Remove each expired voice from API and store
        for (const voice of expiredVoices) {
          try {
            // Use the existing removeCustomVoice function
            await get().removeCustomVoice(voice.id);
          } catch (err) {
            console.error(`Failed to remove voice ${voice.id}:`, err);
          }
        }

        // Update store
        set(state => ({
          customVoices: state.customVoices.filter(voice => now - voice.createdAt < FIFTEEN_MINUTES),
        }));
      },
    }),
    {
      name: 'voice-store',
    }
  )
);
