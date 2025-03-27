import React from 'react';
import { FileSearch } from 'lucide-react';
import { OcrButton } from './OcrButton';
import type { OcrResult } from '@/services/ocr/types';

interface PageCaptureCardProps {
  imageUrl: string;
  title: string;
  onOcrComplete?: (text: string) => void;
}

export function PageCaptureCard({ imageUrl, title, onOcrComplete }: PageCaptureCardProps) {
  // to resolve build issue please check this
  // const handleOcrSuccess = (result: OcrResult) => {
  //   onOcrComplete?.(result.text);
  // };
  const handleOcrSuccess = (result: string) => {
    onOcrComplete?.(result);
  };

  const handleOcrError = (error: string) => {
    console.error('OCR Error:', error);
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-3 right-3">
        <OcrButton
          imageUrl={imageUrl}
          // to resolve build issue please check this
          // onSuccess={handleOcrSuccess}
          // onError={handleOcrError}
          onResult={handleOcrSuccess}
        />
      </div>
    </div>
  );
}