import { useState, useCallback } from 'react';

interface UseElevenLabsApiReturn {
  isVerifying: boolean;
  isConnected: boolean;
  verifyApiKey: (apiKey: string) => Promise<boolean>;
}

export const useElevenLabsApi = (): UseElevenLabsApiReturn => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const verifyApiKey = useCallback(async (apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    
    setIsVerifying(true);
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey,
        },
      });

      const isValid = response.ok;
      setIsConnected(isValid);
      return isValid;
    } catch (error) {
      console.error('Error verifying ElevenLabs API key:', error);
      setIsConnected(false);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return { isVerifying, isConnected, verifyApiKey };
};