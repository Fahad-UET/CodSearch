import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { RatingQuestionnaire } from './RatingQuestionnaire';
import { createPortal } from 'react-dom';
import { useRatingStore } from '../store/ratingStore';

interface ProductRatingProps {
  productId: string;
  rating: number;
  onRate: (rating: number) => void;
}

export function ProductRating({ productId, rating, onRate }: ProductRatingProps) {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const { getProductRatingAnswers, updateProductRatingAnswers } = useRatingStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuestionnaire(true);
  };

  const handleSubmit = (answers: Record<string, number>) => {
    const newRating = updateProductRatingAnswers(productId, answers);
    onRate(newRating);
    setShowQuestionnaire(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 px-3 py-1.5 bg-white/90 rounded-lg shadow-sm backdrop-blur-sm hover:bg-white transition-colors"
      >
        <Star
          size={16}
          className={rating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
        />
        <span className={`text-sm font-medium ${
          rating > 0 ? 'text-yellow-700' : 'text-gray-600'
        }`}>
          {rating > 0 ? rating.toFixed(1) : 'Rate'}
        </span>
      </button>

      {showQuestionnaire && createPortal(
        <RatingQuestionnaire
          productId={productId}
          initialAnswers={getProductRatingAnswers(productId)}
          onClose={() => setShowQuestionnaire(false)}
          onSubmit={handleSubmit}
        />,
        document.body
      )}
    </>
  );
}