import { useState, useEffect } from 'react';
import { auth } from '../services/firebase/config';

export function useAuthState() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isLoading };
}