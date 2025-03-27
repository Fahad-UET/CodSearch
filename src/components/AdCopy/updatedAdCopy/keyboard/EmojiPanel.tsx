import React, { useState } from 'react';
import { emojiCategories } from '../data/emojis';

interface Props {
  onSelect: (emoji: string) => void;
}

export default function EmojiPanel({ onSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setRecentEmojis(prev => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 8);
      return newRecent;
    });
  };

  return (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
      {/* Category selector */}
      <div className="p-2 border-b border-white/10">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(Number(e.target.value))}
          className="w-full px-2 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-sm text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5D1C83]"
        >
          {emojiCategories.map((category, index) => (
            <option key={category.name} value={index}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Emoji grid with horizontal scroll */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {recentEmojis.length > 0 && (
          <div>
            <div className="text-xs text-white/70 mb-1">Recent</div>
            <div className="grid grid-cols-4 gap-1">
              {recentEmojis.map((emoji, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => handleSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-sm bg-white/80 rounded-lg hover:bg-purple-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-xs text-white/70 mb-1">{emojiCategories[selectedCategory].name}</div>
          <div className="grid grid-cols-4 gap-1">
            {emojiCategories[selectedCategory].emojis.map((emoji, index) => (
              <button
                key={`${selectedCategory}-${index}`}
                onClick={() => handleSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center text-sm bg-white/80 rounded-lg hover:bg-purple-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
