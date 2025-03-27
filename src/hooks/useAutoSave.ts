import { useState, useEffect, useRef } from 'react';
import { updateProduct } from '../services/firebase';

interface AutoSaveOptions {
  interval?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave(productId: string, initialData: any, options: AutoSaveOptions = {}) {
  const [data, setData] = useState(initialData);
  const [lastSavedData, setLastSavedData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<number>();

  const { interval = 30000, onSave, onError } = options;

  // Function to validate data before saving
  const validateData = (data: any) => {
    if (!data) throw new Error('No data to save');
    if (typeof data !== 'object') throw new Error('Invalid data format');
    return true;
  };

  // Function to check if data has changed
  const hasDataChanged = () => {
    return JSON.stringify(data) !== JSON.stringify(lastSavedData);
  };

  // Save function
  const save = async (force = false) => {
    try {
      if (!force && !hasDataChanged()) return;
      
      validateData(data);
      setIsSaving(true);
      setError(null);

      const updatedProduct = await updateProduct(productId, data);
      
      setLastSavedData(data);
      setLastSaved(new Date());
      onSave?.();

      return updatedProduct;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Set up auto-save interval
  useEffect(() => {
    const autoSave = async () => {
      if (hasDataChanged()) {
        try {
          await save();
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    };

    timeoutRef.current = window.setInterval(autoSave, interval);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [data, interval]);

  // Save on unmount if there are changes
  useEffect(() => {
    return () => {
      if (hasDataChanged()) {
        save(true).catch(console.error);
      }
    };
  }, [data]);

  return {
    data,
    setData,
    isSaving,
    error,
    lastSaved,
    save: () => save(true),
    hasUnsavedChanges: hasDataChanged()
  };
}