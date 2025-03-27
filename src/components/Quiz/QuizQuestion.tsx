import React from 'react';
import { Star } from 'lucide-react';

interface QuizQuestionProps {
  id: string;
  englishText: string;
  arabicText: string;
  score: number;
  onScore: (score: number) => void;
}

export function QuizQuestion({ id, englishText, arabicText, score, onScore }: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-start">
        {/* English Text - Left Aligned */}
        <div className="text-left">
          <p className="text-gray-900 font-medium">{englishText}</p>
        </div>

        {/* Score - Center */}
        <div className="flex items-center justify-center">
          <span className="text-lg font-bold text-purple-600">
            {score > 0 ? score : '-'}
          </span>
        </div>

        {/* Arabic Text - Right Aligned */}
        <div className="text-right" dir="rtl">
          <p className="text-gray-900 font-medium">{arabicText}</p>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex justify-center gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={`${id}-star-${value}`}
            onClick={() => onScore(value * 2)}
            className={`p-2 rounded-lg transition-colors ${
              score === value * 2
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-gray-100 text-gray-400'
            }`}
          >
            <Star
              size={24}
              className={score >= value * 2 ? 'fill-current' : ''}
            />
          </button>
        ))}
      </div>
    </div>
  );
}