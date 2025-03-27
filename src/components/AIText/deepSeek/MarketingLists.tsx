import React, { useState } from 'react';
import { ChevronDown, Wand2, Plus } from 'lucide-react';
import { LANGUAGES } from '../ui/constant';
import { useProductStore } from '@/store';
import { updateCredits, getCredits } from '@/services/firebase/credits';
import Notification from '@/components/Notification';
import CreditsInformation from '@/components/credits/CreditsInformation';

interface MarketingData {
  marketingAngles: string[];
  problems: string[];
  painPoints: string[];
  brandNames: string[];
}

interface Props {
  productName: string;
  onGenerated: () => void;
  onSelectionsChange: (selections: {
    angle: string;
    problem: string;
    painPoint: string;
    brandName: string;
  }) => void;
  selectedLanguage: string;
}

export default function MarketingLists({
  productName,
  onGenerated,
  onSelectionsChange,
  selectedLanguage,
}: Props) {
  const [data, setData] = useState<MarketingData>({
    marketingAngles: [],
    problems: [],
    painPoints: [],
    brandNames: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [selectedPainPoint, setSelectedPainPoint] = useState<string>('');
  const [selectedBrandName, setSelectedBrandName] = useState<string>('');
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  // Notify parent of selection changes
  React.useEffect(() => {
    onSelectionsChange({
      angle: selectedAngle,
      problem: selectedProblem,
      painPoint: selectedPainPoint,
      brandName: selectedBrandName,
    });
  }, [selectedAngle, selectedProblem, selectedPainPoint, selectedBrandName, onSelectionsChange]);
  const generateLists = async () => {
    if (!productName.trim()) {
      setError('Please enter a product name first');
      return;
    }
    const credits = await getCredits(user?.uid, 'generateMarketingLists');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const LanguageName = LANGUAGES.find(lang => lang.code === selectedLanguage).name;
      const prompt = `Give me:
      • 10 different marketing angles for the following product: ${productName} in ${LanguageName} language. Each angle should be a short, compelling hook that highlights a unique selling point, such as quality, affordability, durability, convenience, innovation, or customer satisfaction. The angles should be engaging, persuasive, and create a sense of urgency or desire, making the product stand out and appealing to potential buyers.
      • 10 problems this product solves. These should be real-life issues or inconveniences that the product helps to eliminate or improve, emphasizing the product's practical benefits.
      • 10 pain points that potential customers experience before using this product. These should focus on frustrations, challenges, or inefficiencies that make customers seek a solution like this.
      • 10 brand name ideas for this product. The names should be catchy, relevant, and aligned with the product's purpose and audience.

      Format the response in clear sections with one item per line. No numbering or bullet points.`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk-c727de8143e347bfb802cf62adbeb41f',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content:
                'You are a marketing expert specializing in product positioning and branding.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate marketing lists');
      }

      const result = await response.json();
      if (!result.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      const content = result.choices[0].message.content;

      // Parse the response into sections
      const sections = content.split('\n\n');
      const newData: MarketingData = {
        marketingAngles: [],
        problems: [],
        painPoints: [],
        brandNames: [],
      };

      sections.forEach(section => {
        if (!section) return;

        const lines = section
          .split('\n')
          .map(line =>
            line
              .trim()
              .replace(/^[•\-\d]+\.\s*/, '')
              .replace(/^(Marketing Angles|Problems|Pain Points|Brand Names):?\s*/i, '')
          )
          .filter(Boolean);

        if (section.toLowerCase().includes('marketing angles')) {
          newData.marketingAngles = lines;
        } else if (section.toLowerCase().includes('problems')) {
          newData.problems = lines;
        } else if (section.toLowerCase().includes('pain points')) {
          newData.painPoints = lines;
        } else if (section.toLowerCase().includes('brand name')) {
          newData.brandNames = lines;
        }
      });

      // Validate that we have at least some data
      if (!Object.values(newData).some(arr => arr.length > 0)) {
        throw new Error('No valid data was generated. Please try again.');
      }

      setData(newData);
      const creditResult = await updateCredits(user?.uid, 'generateMarketingLists');
      setPackage(userPackage.plan, creditResult.toString());
      // Save to localStorage
      localStorage.setItem(
        `marketing_lists_${productName}_${selectedLanguage}`,
        JSON.stringify(newData)
      );

      // Signal that lists have been generated
      onGenerated();
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate lists');
      // Reset data on error
      setData({
        marketingAngles: [],
        problems: [],
        painPoints: [],
        brandNames: [],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Load saved data if available
  React.useEffect(() => {
    if (productName) {
      const saved = localStorage.getItem(`marketing_lists_${productName}_${selectedLanguage}`);
      if (saved) {
        setData(JSON.parse(saved));
        onGenerated(); // Also trigger if we load saved data
      } else {
        setData({
          marketingAngles: [],
          problems: [],
          painPoints: [],
          brandNames: [],
        });
      }
    }
  }, [productName, selectedLanguage]);

  return (
    <div className="space-y-6 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Marketing Lists</h2>
        <button
          onClick={generateLists}
          disabled={isGenerating || !productName}
          className="flex items-center gap-2 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate Lists
            </>
          )}
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-6">
        {/* Marketing Angles */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5D1C83]" />
            Marketing Angles
          </label>
          <select
            value={selectedAngle}
            onChange={e => setSelectedAngle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          >
            <option value="" disabled>
              Select an angle...
            </option>
            {data.marketingAngles.map((angle, index) => (
              <option key={index} value={angle}>
                {angle}
              </option>
            ))}
          </select>
        </div>

        {/* Problems */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5D1C83]" />
            Problems Solved
          </label>
          <select
            value={selectedProblem}
            onChange={e => setSelectedProblem(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          >
            <option value="" disabled>
              Select a problem...
            </option>
            {data.problems.map((problem, index) => (
              <option key={index} value={problem}>
                {problem}
              </option>
            ))}
          </select>
        </div>

        {/* Pain Points */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5D1C83]" />
            Pain Points
          </label>
          <select
            value={selectedPainPoint}
            onChange={e => setSelectedPainPoint(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          >
            <option value="" disabled>
              Select a pain point...
            </option>
            {data.painPoints.map((point, index) => (
              <option key={index} value={point}>
                {point}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Names */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5D1C83]" />
            Brand Names
          </label>
          <select
            value={selectedBrandName}
            onChange={e => setSelectedBrandName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          >
            <option value="" disabled>
              Select a brand name...
            </option>
            {data.brandNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
