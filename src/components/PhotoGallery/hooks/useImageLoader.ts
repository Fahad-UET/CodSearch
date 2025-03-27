import { useState, useEffect } from 'react';

interface UseImageLoaderResult {
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
}

export function useImageLoader(src: string): UseImageLoaderResult {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const img = new Image();
    
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, retryCount]);

  const retry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(count => count + 1);
  };

  return { isLoading, hasError, retry };
}