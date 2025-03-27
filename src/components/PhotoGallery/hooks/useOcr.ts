import { useState } from 'react';
import { performOcr } from '@/services/ocr/api';

export function useOcr() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const result = await performOcr(imageUrl);
      return result;
    } catch (error) {
      console.error('OCR processing failed:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processImage,
    isProcessing,
  };
}