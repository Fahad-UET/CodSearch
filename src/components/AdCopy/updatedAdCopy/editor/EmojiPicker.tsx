import React, { useState } from 'react';
import {
  Smile,
  Search,
  Clock,
  ShoppingBag,
  Tags,
  Package,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

// Emoji categories with e-commerce focus
const EMOJI_CATEGORIES = [
  {
    id: 'shopping',
    icon: ShoppingBag,
    label: 'Shopping',
    emojis: [
      '🛍️',
      '🛒',
      '🏪',
      '🏬',
      '💳',
      '💰',
      '💵',
      '🏷️',
      '🔖',
      '📦',
      '🎁',
      '🛕',
      '🏢',
      '🏣',
      '🏤',
      '🏥',
      '🏦',
      '🏨',
      '🏪',
      '🏫',
    ],
  },
  {
    id: 'products',
    icon: Package,
    label: 'Products',
    emojis: [
      '👕',
      '👗',
      '👟',
      '👜',
      '👝',
      '💄',
      '⌚',
      '📱',
      '💻',
      '📸',
      '👔',
      '👖',
      '🧥',
      '👘',
      '👙',
      '👚',
      '👛',
      '👞',
      '👠',
      '🥾',
    ],
  },
  {
    id: 'sales',
    icon: Tags,
    label: 'Sales',
    emojis: [
      '🏷️',
      '💯',
      '🆕',
      '🔥',
      '⭐',
      '💫',
      '✨',
      '🎉',
      '🎊',
      '🎁',
      '🌟',
      '💥',
      '🌈',
      '🎯',
      '🎪',
      '🎨',
      '🎭',
      '🎪',
      '🎟️',
      '🎫',
    ],
  },
  {
    id: 'payment',
    icon: CreditCard,
    label: 'Payment',
    emojis: [
      '💳',
      '💰',
      '💵',
      '💸',
      '💱',
      '💲',
      '🏦',
      '📈',
      '💹',
      '🤑',
      '💴',
      '💶',
      '💷',
      '🪙',
      '💎',
      '📊',
      '📉',
      '🧾',
      '📑',
      '📋',
    ],
  },
  {
    id: 'trending',
    icon: TrendingUp,
    label: 'Trending',
    emojis: [
      '📈',
      '🔝',
      '⚡',
      '💫',
      '🌟',
      '🏆',
      '🥇',
      '💎',
      '👑',
      '🎯',
      '🔥',
      '✨',
      '💡',
      '🌠',
      '⭐',
      '🌟',
      '💫',
      '⚡',
      '🎆',
      '🎇',
    ],
  },
  {
    id: 'delivery',
    icon: Package,
    label: 'Delivery',
    emojis: [
      '📦',
      '🚚',
      '✈️',
      '🚀',
      '🛵',
      '🏃',
      '🚲',
      '🛺',
      '🚗',
      '🚢',
      '📬',
      '📭',
      '📮',
      '🗳️',
      '📪',
      '📫',
      '📨',
      '📩',
      '📤',
      '📥',
    ],
  },
  {
    id: 'recent',
    icon: Clock,
    label: 'Recent',
    emojis: [],
  },
];

interface Props {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    // Add to recent emojis
    setRecentEmojis(prev => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 10);
      localStorage.setItem('recentEmojis', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  // Load recent emojis on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('recentEmojis');
    if (saved) {
      setRecentEmojis(JSON.parse(saved));
    }
  }, []);

  const currentEmojis = React.useMemo(() => {
    if (searchQuery) {
      return EMOJI_CATEGORIES.flatMap(cat => cat.emojis).filter(emoji =>
        emoji.includes(searchQuery)
      );
    }

    if (activeCategory === 'recent') {
      return recentEmojis;
    }

    return EMOJI_CATEGORIES.find(cat => cat.id === activeCategory)?.emojis || [];
  }, [activeCategory, searchQuery, recentEmojis]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200 hover:from-purple-50 hover:to-white text-gray-700 hover:text-[#5D1C83] shadow-sm hover:shadow-md transition-all"
        title="Ajouter un emoji"
      >
        <Smile className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed top-auto left-auto mt-1 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[9999]">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un emoji..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5D1C83] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
            {EMOJI_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-2 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? 'bg-white text-[#5D1C83] shadow-md'
                    : 'text-gray-500 hover:bg-white/50 hover:text-[#5D1C83]'
                }`}
              >
                <category.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Emojis grid */}
          <div className="p-2 h-48 overflow-y-auto">
            <div className="grid grid-cols-10 gap-1">
              {currentEmojis.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => handleSelect(emoji)}
                  className="w-7 h-7 flex items-center justify-center text-lg hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110 transform hover:shadow-md"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
