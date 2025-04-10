import React from 'react';
import { Coins } from 'lucide-react';
import { AI_CREATOR_COSTS } from '@/store/credits';

interface CreditCostProps {
  modelId?: string;
}

function CreditCost({ modelId }: CreditCostProps) {
  const cost = modelId ? AI_CREATOR_COSTS[modelId] : AI_CREATOR_COSTS['anthropic/claude-3-opus'];
  
  if (!cost) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-white/80 bg-[#4A2A7A] px-3 py-1.5 w-48 justify-center rounded-lg">
      <Coins className="w-4 h-4" />
      <span>{cost.unit} Credits/{cost.type}</span>
    </div>
  );
}

export default CreditCost