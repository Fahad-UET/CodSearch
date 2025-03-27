import React, { useState } from 'react';
import { formatGenerationPrompt } from '../.././../services/TextGeneration/textGeneration';
import { Wand2, AlertCircle, Plus } from 'lucide-react';
import CustomInstructionsManager from './CustomInstructionsManager';
import { useCustomInstructionsStore } from '@/store/CustomInstructionsStore';

interface Props {
  onSubmit: (prompt: string) => void;
  value: string;
  activeTab: string;
  customPrompt: string;
  onChange: (value: string) => void;
  onCustomPromptChange: (value: string) => void;
  isLoading: boolean;
  generationCount: number;
  maxGenerations: number;
  isChecked: boolean;
  product: any;
}

export default function AiPromptForm({
  onSubmit,
  isLoading,
  value,
  customPrompt,
  onChange,
  onCustomPromptChange,
  activeTab,
  generationCount,
  maxGenerations,
  isChecked,
  product,
}: Props) {
  const [showInstructions, setShowInstructions] = useState(false);
  const { instructions } = useCustomInstructionsStore();

  // Load default instruction for current tab on mount
  React.useEffect(() => {
    const defaultInstruction = instructions.find(i => i.isDefault && i.tabId === activeTab);

    if (defaultInstruction) {
      onCustomPromptChange(defaultInstruction.content);
    } else {
      onCustomPromptChange(''); // Clear custom prompt if no default exists
    }
  }, [activeTab, instructions, onCustomPromptChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    // Get admin prompt from context/storage
    const adminPrompt = localStorage.getItem(`admin_prompt_${activeTab}`) || '';

    // Create generation context
    // const context = {
    //   adminPrompt,
    //   customInstructions: customPrompt || '',
    //   selectedText: {
    //     id: 'selected',
    //     content: value,
    //     language: 'en',
    //     tags: [],
    //     createdAt: new Date(),
    //     usedInPrompt: false,
    //   },
    // };
    const context = {
      content: value,
      language: 'en',
    };

    onSubmit(formatGenerationPrompt(context));
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'ad-copy':
        return 'Generate compelling ad copy that drives engagement and conversions...';
      case 'customer-reviews':
        return "Generate authentic customer reviews about the product's benefits and experience...";
      case 'landing-page':
        return 'Create compelling landing page copy that highlights key features and benefits...';
      case 'review-voice':
        return 'Generate a natural voice-over script for product reviews and testimonials...';
      case 'creative-voice':
        return 'Create an engaging voice-over script for creative video ads...';
      default:
        return 'Describe the text you want to generate...';
    }
  };

  const getCustomPlaceholder = () => {
    switch (activeTab) {
      case 'ad-copy':
        return 'Add your specific requirements for the ad copy (tone, style, key points to emphasize...)';
      case 'customer-reviews':
        return 'Customize the review style (specific features to mention, customer pain points...)';
      case 'landing-page':
        return 'Add specific requirements for the landing page (target audience, unique value propositions...)';
      case 'review-voice':
        return 'Customize the voice-over style (tone, pacing, emotional emphasis...)';
      case 'creative-voice':
        return 'Add creative direction (storytelling style, mood, specific phrases to include...)';
      default:
        return 'Add your custom instructions...';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid ${isChecked ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        {!isChecked && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Selected Text</label>
            <textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full h-32 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] transition-all resize-none"
              placeholder={getPlaceholder()}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Custom Instructions</label>
          <div className="relative">
            <textarea
              value={customPrompt}
              onChange={e => onCustomPromptChange(e.target.value)}
              className="w-full h-32 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] transition-all resize-none"
              placeholder={getCustomPlaceholder()}
            />
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
            >
              <Plus
                className={`w-6 h-6 transform transition-transform ${showInstructions ? 'rotate-45' : ''
                  }`}
              />
            </button>
          </div>

          {showInstructions && (
            <CustomInstructionsManager
              product={product}
              onSelect={onCustomPromptChange}
              activeTab={activeTab}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isLoading || !value?.trim() || generationCount >= maxGenerations}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Wand2 className="w-4 h-4" />
          {isLoading ? 'Generating...' : 'Generate Text'}
        </button>

        <div className="flex items-center gap-2">
          {generationCount >= maxGenerations ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Generation limit reached</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-[#5D1C83] rounded-lg">
              <span className="text-sm font-medium">
                {maxGenerations - generationCount} generations remaining
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
