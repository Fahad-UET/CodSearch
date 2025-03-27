import { useState } from 'react';

export function useAutoRefresh(defaultInterval: number = 10) {
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [interval, setInterval] = useState(defaultInterval);

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(prev => !prev);
  };

  return {
    isAutoRefresh,
    interval,
    toggleAutoRefresh,
    setInterval
  };
}