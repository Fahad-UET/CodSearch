import { ImageOff } from 'lucide-react';

interface ImageFallbackProps {
  className?: string;
  onRetry?: () => void;
}

export function ImageFallback({ className = '', onRetry }: ImageFallbackProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 ${className}`}>
      <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-sm text-gray-500">Image unavailable</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-primary-600 hover:text-primary-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}