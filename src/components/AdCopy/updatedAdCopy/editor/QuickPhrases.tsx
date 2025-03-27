import React, { useState } from 'react';
import { LightbulbIcon, Search, Plus } from 'lucide-react';
import { quickPhrases, type QuickPhrase } from '../data/quickPhrases';
import AddPhraseModal from './AddPhraseModal';

interface Props {
  onSelect: (phrase: string) => void;
  activeLanguage: 'ar' | 'es' | 'fr' | 'en';
}

export default function QuickPhrases({ onSelect, activeLanguage }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customPhrases, setCustomPhrases] = useState<QuickPhrase[]>([]);

  const categories = Object.keys(quickPhrases[activeLanguage]);

  const filteredPhrases = React.useMemo(() => {
    const defaultPhrases = Object.values(quickPhrases[activeLanguage]).flat();
    const allPhrases = [...defaultPhrases, ...customPhrases];

    if (searchQuery) {
      return allPhrases.filter(
        phrase =>
          phrase.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          phrase.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      return allPhrases.filter(phrase => phrase.category === selectedCategory);
    }

    return allPhrases;
  }, [activeLanguage, searchQuery, selectedCategory, customPhrases]);

  const handleAddPhrase = (phrase: QuickPhrase) => {
    setCustomPhrases(prev => [...prev, phrase]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm text-[#5D1C83] bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 hover:from-purple-50 hover:to-white shadow-sm hover:shadow-md transition-all flex items-center gap-2"
      >
        <LightbulbIcon className="w-4 h-4" />
        Quick Phrases
      </button>

      {isOpen && (
        <div className="fixed top-auto left-auto mt-1 w-[48rem] bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[9999]">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSelectedCategory(null);
                }}
                placeholder="Search phrases..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D1C83] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 p-3 border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap bg-[#5D1C83] text-white hover:bg-[#6D2C93] shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Phrase
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(selectedCategory === category ? null : category);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#5D1C83] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:text-[#5D1C83] hover:bg-purple-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Phrases list */}
          <div className="max-h-[32rem] overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {filteredPhrases.map((phrase, index) => (
                <button
                  key={`${phrase.text}-${index}`}
                  onClick={() => {
                    onSelect(`${phrase.emoji || ''} ${phrase.text}`);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-purple-50 rounded-lg transition-colors group flex items-center gap-3 border border-gray-100 hover:border-[#5D1C83]/20"
                >
                  <span className="text-2xl">{phrase.emoji || '💬'}</span>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="group-hover:text-[#5D1C83] text-base">{phrase.text}</span>
                    <span className="text-xs text-gray-400 group-hover:text-[#5D1C83]">
                      {phrase.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AddPhraseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPhrase}
        categories={categories}
      />
    </div>
  );
}
