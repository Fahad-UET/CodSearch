import { useState, useCallback, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export function useGoogleAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load token from storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: response => {
      setToken(response.access_token);
      localStorage.setItem('google_access_token', response.access_token);
      setError(null);
    },
    onError: error => {
      console.error('Google login failed:', error);
      setError('Failed to sign in with Google');
      setToken(null);
      localStorage.removeItem('google_access_token');
    },
    scope: 'https://www.googleapis.com/auth/drive.file'
  });

  const signIn = useCallback(async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to initialize Google login:', error);
      setError('Failed to initialize Google sign in');
    }
  }, [login]);

  const signOut = useCallback(() => {
    setToken(null);
    localStorage.removeItem('google_access_token');
  }, []);

  return {
    token,
    error,
    signIn,
    signOut,
    isAuthenticated: !!token
  };
}