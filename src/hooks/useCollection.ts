import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, QueryConstraint, OrderByDirection } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface UseCollectionOptions {
  limit?: number;
  orderBy?: [string, OrderByDirection];
}

export function useCollection<T>(
  collectionName: string,
  options: UseCollectionOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const constraints: QueryConstraint[] = [];
        
        if (options.orderBy) {
          constraints.push(orderBy(options.orderBy[0], options.orderBy[1]));
        }
        
        if (options.limit) {
          constraints.push(limit(options.limit));
        }

        const q = query(collection(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(documents);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  return { data, loading, error };
}