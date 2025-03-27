import React, { useState } from 'react';
import { DollarSign, Save } from 'lucide-react';

interface MarketplacePriceInputProps {
  currentPrice?: number;
  onSave: (price: number) => Promise<void>;
  marketplace: string;
}

export function MarketplacePriceInput({ currentPrice = 0, onSave, marketplace }: MarketplacePriceInputProps) {
  const [price, setPrice] = useState(currentPrice);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(price);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save price:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
      >
        {marketplace} Price: ${currentPrice.toFixed(2)}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={e => setPrice(parseFloat(e.target.value) || 0)}
          className="w-32 pl-7 pr-2 py-1.5 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm"
          placeholder="Enter price"
        />
        <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
      >
        <Save size={16} />
      </button>
    </div>
  );
}