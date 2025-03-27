import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useProductStore } from '@/store';

interface ApiKeys {
  openai: string;
  apify: string;
  rapidapi: string;
  facebook: string;
  codnetwork: string;
}

export const useApiKeys = () => {
  const { user } = useProductStore();
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: '',
    apify: '',
    rapidapi: '',
    facebook: '',
    codnetwork: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadApiKeys = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid, 'settings', 'api-keys');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApiKeys(docSnap.data() as ApiKeys);
        }
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    };

    loadApiKeys();
  }, [user]);

  const updateApiKey = async (key: keyof ApiKeys, value: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'users', user.uid, 'settings', 'api-keys');
      await setDoc(docRef, { ...apiKeys, [key]: value }, { merge: true });
      setApiKeys(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  return { apiKeys, updateApiKey, loading };
};