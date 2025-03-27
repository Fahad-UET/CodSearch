import { useState, useEffect } from 'react';
import { validateApiKey } from '@/utils/api-validation';
import { encryptApiKey, decryptApiKey } from '@/utils/encryption';

export function useApiKey() {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const loadStoredKey = async () => {
      const encryptedKey = localStorage.getItem('openai_api_key');
      if (encryptedKey) {
        const decryptedKey = await decryptApiKey(encryptedKey);
        setApiKey(decryptedKey);
        setIsValid(true);
      }
    };

    loadStoredKey();
  }, []);

  const validate = async (key: string): Promise<boolean> => {
    try {
      const isKeyValid = validateApiKey(key);
      setIsValid(isKeyValid);
      
      if (isKeyValid) {
        const encryptedKey = await encryptApiKey(key);
        localStorage.setItem('openai_api_key', encryptedKey);
      }

      return isKeyValid;
    } catch (error) {
      setIsValid(false);
      return false;
    }
  };

  return {
    apiKey,
    setApiKey,
    isValid,
    validate,
  };
}