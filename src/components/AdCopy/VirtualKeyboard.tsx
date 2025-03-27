import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  DollarSign,
  Star,
  Heart,
  ThumbsUp,
  Sparkles,
  Clock,
  Percent,
  Zap,
  Crown,
  Gift,
  ChevronDown,
  ChevronUp,
  Globe,
  Phone,
  Mail,
  Link as LinkIcon,
  Store,
  Variable,
  Plus,
  X,
  Settings,
  Package2,
  Edit2,
  Trash2,
  Save,
  LucideIcon,
} from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  layout: 'ar' | 'fr' | 'en' | 'es' | 'ma';
  onLayoutChange: (layout: 'ar' | 'fr' | 'en' | 'es' | 'ma') => void;
}

interface TextVariable {
  id: string;
  name: string;
  value: string;
  // to resolve build issue please check this
  // icon: React.ComponentType<{ size?: number }>;
  icon: LucideIcon;
}

const DEFAULT_VARIABLES: TextVariable[] = [
  { id: 'product_name', name: 'Product Name', value: '', icon: Package2 },
  { id: 'sale_price', name: 'Sale Price', value: '', icon: DollarSign },
  { id: 'site_name', name: 'Site Name', value: '', icon: Globe },
  { id: 'site_url', name: 'Site URL', value: '', icon: LinkIcon },
  { id: 'whatsapp', name: 'WhatsApp', value: '', icon: Phone },
  { id: 'email', name: 'Email', value: '', icon: Mail },
  { id: 'landing_page', name: 'Landing Page', value: '', icon: LinkIcon },
  { id: 'store_url', name: 'Store URL', value: '', icon: Store },
];

const QUICK_PHRASES = [
  '🔥 Limited Time Offer!',
  '⭐ Best Seller',
  '🎁 Free Shipping',
  '💥 Flash Sale',
  '✨ New Arrival',
  '🏆 Top Rated',
  '💰 Save Now',
  '⚡ Act Fast',
  '🎯 Just For You',
  '💎 Premium Quality',
];

const LAYOUTS = {
  ar: [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  ],
  en: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ],
  fr: [
    ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
    ['w', 'x', 'c', 'v', 'b', 'n', 'é', 'è', 'à', 'ç'],
  ],
  es: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'á', 'é', 'í'],
  ],
  ma: [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك'],
    ['ظ', 'ط', 'ذ', 'د', 'ز', 'ر', 'و', 'ة', 'ث', 'ج'],
  ],
};

export function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onSpace,
  layout,
  onLayoutChange,
}: VirtualKeyboardProps) {
  const [showQuickPhrases, setShowQuickPhrases] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [customVariables, setCustomVariables] = useState<TextVariable[]>(DEFAULT_VARIABLES);
  const [newVariable, setNewVariable] = useState({ name: '', value: '' });
  const [showQuickText, setShowQuickText] = useState(false);
  const [editingVariable, setEditingVariable] = useState<TextVariable | null>(null);

  const handleAddVariable = () => {
    if (!newVariable.name || !newVariable.value) return;
    
    setCustomVariables(prev => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        name: newVariable.name,
        value: newVariable.value,
        icon: Variable
      }
    ]);
    setNewVariable({ name: '', value: '' });
  };

  const handleEditVariable = (variable: TextVariable) => {
    setEditingVariable(variable);
    setNewVariable({ name: variable.name, value: variable.value });
  };

  const handleSaveEdit = () => {
    if (!editingVariable || !newVariable.name || !newVariable.value) return;

    setCustomVariables(prev => prev.map(v =>
      v.id === editingVariable.id
        ? { ...v, name: newVariable.name, value: newVariable.value }
        : v
    ));
    setEditingVariable(null);
    setNewVariable({ name: '', value: '' });
  };

  const handleDeleteVariable = (variableId: string) => {
    setCustomVariables(prev => prev.filter(v => v.id !== variableId));
  };

  return (
    <div className="space-y-4">
      {/* Layout Selector and Quick Access */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setShowQuickPhrases(!showQuickPhrases)}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
        >
          {showQuickPhrases ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          Quick Phrases
        </button>
        <button
          onClick={() => setShowQuickText(!showQuickText)}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
        >
          {showQuickText ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          Quick Text
        </button>
        <button
          onClick={() => setShowVariables(!showVariables)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          {showVariables ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          Variables
        </button>
        <select
          value={layout}
          onChange={(e) => onLayoutChange(e.target.value as typeof layout)}
          className="px-4 py-2 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
        >
          <option value="ar">Arabic</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="ma">Moroccan</option>
        </select>
      </div>

      {/* Quick Phrases */}
      {showQuickPhrases && (
        <div className="grid grid-cols-3 gap-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
          {QUICK_PHRASES.map((phrase, index) => (
            <button
              key={index}
              onClick={() => onKeyPress(phrase)}
              className="p-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              {phrase}
            </button>
          ))}
        </div>
      )}

      {/* Quick Text */}
      {showQuickText && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {customVariables.map((variable) => (
              <div
                key={variable.id}
                className="flex items-center justify-between p-2 bg-white rounded-lg group"
              >
                <button
                  onClick={() => onKeyPress(variable.value)}
                  className="flex items-center gap-2 flex-1 hover:bg-green-50 p-2 rounded-lg transition-colors"
                >
                  <variable.icon size={16} />
                  {/* // to resolve build issue please check this */}
                  {/* <variable.icon size={16} className="text-green-600" /> */}
                  <span className="text-sm font-medium">{variable.name}</span>
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditVariable(variable)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteVariable(variable.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={editingVariable ? "Edit text name" : "Text name"}
              value={newVariable.name}
              onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200"
            />
            <input
              type="text"
              placeholder={editingVariable ? "Edit text content" : "Text content"}
              value={newVariable.value}
              onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1 rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200"
            />
            {editingVariable ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => {
                    setEditingVariable(null);
                    setNewVariable({ name: '', value: '' });
                  }}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={handleAddVariable}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Variables */}
      {showVariables && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {customVariables.map((variable) => (
              <div
                key={variable.id}
                className="flex items-center justify-between p-2 bg-white rounded-lg group"
              >
                <button
                  onClick={() => onKeyPress(`{{${variable.name}}}`)}
                  className="flex items-center gap-2 flex-1 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                >
                  <variable.icon size={16} />
                  {/* // to resolve build issue please check this */}
                  {/* <variable.icon size={16} className="text-blue-600" /> */}
                  <span className="text-sm font-medium">{variable.name}</span>
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditVariable(variable)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteVariable(variable.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={editingVariable ? "Edit variable name" : "Variable name"}
              value={newVariable.name}
              onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder={editingVariable ? "Edit default value" : "Default value"}
              value={newVariable.value}
              onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {editingVariable ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => {
                    setEditingVariable(null);
                    setNewVariable({ name: '', value: '' });
                  }}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={handleAddVariable}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Layout */}
      <div className="space-y-2">
        {LAYOUTS[layout].map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="w-12 h-12 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center text-lg"
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        {/* Control Keys */}
        <div className="flex justify-center gap-2">
          <button
            onClick={onBackspace}
            className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={onSpace}
            className="px-12 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Space
          </button>
        </div>
      </div>
    </div>
  );
}