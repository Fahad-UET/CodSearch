import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Tag } from '../types';

export function useTags(categoryId: string) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setTags([]);
      return;
    }

    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const tagsRef = collection(db, 'tags');
        const q = query(tagsRef, where('categoryId', '==', categoryId));
        const snapshot = await getDocs(q);
        const tagsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Tag[];
        
        setTags(tagsData);
      } catch (err) {
        setError('Failed to load tags');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [categoryId]);

  return { tags, isLoading, error };
}