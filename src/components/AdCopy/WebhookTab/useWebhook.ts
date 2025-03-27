import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useWebhook = () => {
  const [webhookUrl, setWebhookUrl] = useLocalStorage('webhook-url', '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!webhookUrl) return;
    
    setIsSaving(true);
    try {
      // Save webhook URL logic here
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error('Error saving webhook:', error);
    }
  };

  return {
    webhookUrl,
    setWebhookUrl,
    isSaving,
    handleSave,
  };
};