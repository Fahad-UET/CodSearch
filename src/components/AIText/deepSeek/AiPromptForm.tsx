import React, { useState } from 'react';
import { Wand2, AlertCircle, Plus } from 'lucide-react';
import { formatGenerationPrompt } from '@/services/textGeneration';
import CustomInstructionsManager from './CustomInstructionsManager';
import { useCustomInstructionsStore } from '@/store/CustomInstructionsStore';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import { useProductStore } from '@/store';
import Notification from '@/components/Notification';
import CreditsInformation from '@/components/credits/CreditsInformation';

interface Props {
  onSubmit: (prompt: string) => Promise<boolean>;
  value: string;
  activeTab: string;
  customPrompt: string;
  onChange: (value: string) => void;
  onCustomPromptChange: (value: string) => void;
  isLoading: boolean;
  isChecked?: boolean;
  product?: any;
}

export default function AiPromptForm({
  onSubmit,
  isLoading,
  value,
  customPrompt,
  onChange,
  onCustomPromptChange,
  activeTab,
  isChecked,
  product,
}: Props) {
  const [showInstructions, setShowInstructions] = useState(false);
  const { instructions } = useCustomInstructionsStore();
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  // Load default instruction for current tab on mount
  React.useEffect(() => {
    const defaultInstruction = instructions.find(i => i.isDefault && i.tabId === activeTab);

    if (defaultInstruction) {
      onCustomPromptChange(defaultInstruction.content);
    } else {
      onCustomPromptChange(''); // Clear custom prompt if no default exists
    }
  }, [activeTab, instructions, onCustomPromptChange]);

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!value.trim() && !customPrompt.trim() && isChecked) return;
    const credits = await getCredits(user?.uid, 'generateAiText');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    // Get admin prompt from context/storage
    const adminPrompt = localStorage.getItem(`admin_prompt_${activeTab}`) || '';

    // Create generation context
    const context = {
      adminPrompt,
      customInstructions: customPrompt || '',
      selectedText: {
        id: 'selected',
        content: value,
        language: 'en',
        tags: [],
        createdAt: new Date(),
        usedInPrompt: false,
      },
    };
    // @ts-ignore
    const result = await onSubmit(formatGenerationPrompt(context));
    if (result) {
      const result = await updateCredits(user?.uid, 'generateAiText');
      setPackage(userPackage.plan, result.toString());
    }
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
              className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 transform
              ${
                showInstructions
                  ? 'bg-[#5D1C83] text-white shadow-lg rotate-45 hover:bg-[#4D0C73]'
                  : 'bg-white text-[#5D1C83]/70 hover:text-[#5D1C83] hover:scale-110 shadow-sm hover:shadow-md'
              }`}
            >
              <Plus className="w-6 h-6" />
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
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Wand2 className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Generate Text'}
          </button>
        </div>
      </div>
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </form>
  );
}
