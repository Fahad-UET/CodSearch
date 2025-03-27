import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface Image {
  url: string;
  alt?: string;
}

export function useImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const imagesRef = collection(db, 'images');
        const q = query(imagesRef);
        const querySnapshot = await getDocs(q);
        
        const fetchedImages = querySnapshot.docs.map(doc => ({
          url: doc.data().url,
          alt: doc.data().alt,
        }));
        
        setImages(fetchedImages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch images'));
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return { images, loading, error };
}