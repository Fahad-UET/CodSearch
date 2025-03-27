import React from 'react';
import { Star } from 'lucide-react';

interface Props {
  value: number;
  onChange?: (rating: number) => void;
}

export default function Rating({ value, onChange }: Props) {
  const [hoverRating, setHoverRating] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (rating: number) => {
    if (!onChange) return;
    // Si on clique sur l'étoile déjà sélectionnée, on réinitialise à 0
    onChange(rating === value ? 0 : rating);
  };

  return (
    <div
      className="flex items-center gap-0.5 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoverRating(0);
      }}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHoverRating(star)}
          className={`p-0.5 transition-all duration-200 ${isHovered ? 'hover:scale-110' : ''}`}
        >
          <Star
            className={`w-4 h-4 transition-colors ${
              (hoverRating ? star <= hoverRating : star <= value)
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                : isHovered
                ? 'text-yellow-400'
                : 'text-white/80'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
