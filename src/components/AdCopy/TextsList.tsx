import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';

interface SavedText {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

interface TextsListProps {
  // to resolve build issue please check this
  selectedType?: string;
  onTextSelect?: (text: string) => void;
}

export const TextsList: React.FC<TextsListProps> = ({ selectedType, onTextSelect }) => {
  const [texts, setTexts] = useState<SavedText[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTexts = async () => {
      if (!selectedType) return;
      
      setIsLoading(true);
      try {
        const textsRef = collection(db, 'texts');
        const q = query(textsRef, where('type', '==', selectedType));
        const snapshot = await getDocs(q);
        
        const loadedTexts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as SavedText[];
        
        setTexts(loadedTexts);
      } catch (error) {
        console.error('Error loading texts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTexts();
  }, [selectedType]);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!texts.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No saved texts found for this type
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {texts.map(text => (
        <div
          key={text.id}
          onClick={() => onTextSelect(text.content)}
          className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
        >
          <div className="text-sm line-clamp-2">{text.content}</div>
          <div className="text-xs text-gray-500 mt-1">
            {text.createdAt?.toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};