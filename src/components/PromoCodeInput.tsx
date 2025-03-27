import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface PromoCodeInputProps {
  onApply: (code: string) => void;
  onClear: () => void;
  isValid?: boolean;
  discount?: number;
}

export function PromoCodeInput({ onApply, onClear, isValid, discount }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    try {
      await onApply(code.trim().toUpperCase());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
          disabled={isValid}
        />
        {isValid ? (
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <X size={20} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!code.trim() || isSubmitting}
            className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Apply
          </button>
        )}
      </form>
      
      {isValid && (
        <div className="mt-2 flex items-center gap-2 text-green-600">
          <Check size={16} />
          <span className="text-sm">
            {discount}% discount applied!
          </span>
        </div>
      )}
    </div>
  );
}