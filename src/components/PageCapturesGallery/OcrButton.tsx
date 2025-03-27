import { useState } from 'react';
import { FileSearch } from 'lucide-react';
import { performOcr } from '@/services/ocr/api';

interface OcrButtonProps {
  imageUrl: string;
  onResult?: (text: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function OcrButton({ imageUrl, onResult, className = '', children }: OcrButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result: any = await performOcr(imageUrl);
      onResult?.(result.text);
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
      disabled={isLoading}
      title="Extract text from image"
    >
      {children || <FileSearch className="w-5 h-5" />}
      {isLoading && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}