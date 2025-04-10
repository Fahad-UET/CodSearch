import React from 'react';
import { Download, DollarSign, BarChart3, Clock, Tag, ChevronDown, MessageSquare, Music, Image as ImageIcon, Video, Shirt, Package } from 'lucide-react';
import { useCredits, type CreditEntry, AI_CREATOR_COSTS } from '@/store/credits';

interface Category {
  id: string;
  name: string;
  subcategories?: {
    name: string;
    models: Array<{
      id: string;
      name: string;
    }>;
  }[];
  models?: string[];
}

const CATEGORIES: Category[] = [
  {
    id: 'ai-creator',
    name: 'AI Creator', 
    subcategories: [
      { name: 'Text Tools', models: [
        { id: 'google/gemini-flash-1.5', name: 'Text to Video Prompt' },
        { id: 'fal-ai/any-llm/vision', name: 'Text to Text' }, 
        { id: 'fal-ai/imagen3', name: 'Text to Image' },
        { id: 'fal-ai/veo2', name: 'Text to Video' }
      ]},
      { name: 'Audio Tools', models: [
        { id: 'elevenlabs/text-to-speech', name: 'Text to Speech' },
        { id: 'elevenlabs/voice-clone', name: 'Audio to Text' },
        { id: 'fal-ai/sync-lipsync', name: 'Speech to Video' },
        { id: 'fal-ai/sync-lipsync', name: 'Lip Sync' },
        { id: 'fal-ai/sync-lipsync', name: 'Video to Audio' }
      ]},
      { name: 'Image Tools', models: [
        { id: 'fal-ai/imagen3', name: 'Text to Image' }, 
        { id: 'fal-ai/veo2', name: 'Text to Video' },
        { id: 'fal-ai/retoucher', name: 'Face Retoucher' }, 
        { id: 'fal-ai/fooocus/inpaint', name: 'Watermark Remover' },
        { id: 'fal-ai/bria/background/replace', name: 'Background Changer' },
        { id: 'fal-ai/ben/v2/image', name: 'Background Remover' },
        { id: 'fal-ai/any-llm/vision', name: 'Text Extractor' },
        { id: 'fal-ai/drct-super-resolution', name: 'Upscaler' },
        { id: 'fashn/tryon', name: 'Outfits to Image' },
        { id: 'fal-ai/iclight-v2', name: 'Product to Image' }
      ]},
      { name: 'Video Tools', models: [
        { id: 'fal-ai/veo2', name: 'Text to Video' }, 
        { id: 'fal-ai/ben/v2/video', name: 'Background Remover' },
        { id: 'fal-ai/fooocus/inpaint', name: 'Watermark Remover' },
        { id: 'fal-ai/sync-lipsync', name: 'Video to Audio' },
        { id: 'fal-ai/sync-lipsync', name: 'Video to Images' },
        { id: 'fal-ai/sync-lipsync', name: 'Video to GIF' },
        { id: 'fal-ai/sync-lipsync', name: 'Video Trimmer' },
        { id: 'fal-ai/sync-lipsync', name: 'Video Mixer' },
        { id: 'fal-ai/sync-lipsync', name: 'Upscaler' },
        { id: 'fal-ai/veo2', name: 'Text to Video Generator' },
        { id: 'fashn/tryon', name: 'Outfits to Video' },
        { id: 'fal-ai/iclight-v2', name: 'Product to Video' },
        { id: 'fal-ai/sync-lipsync', name: 'Lip Sync' },
        { id: 'fal-ai/sync-lipsync', name: 'Video to Audio' },
        { id: 'fal-ai/sync-lipsync', name: 'Video to Images' },
        { id: 'fal-ai/sync-lipsync', name: 'Video to GIF' },
        { id: 'fal-ai/sync-lipsync', name: 'Video Trimmer' },
        { id: 'fal-ai/sync-lipsync', name: 'Video Mixer' },
        { id: 'fal-ai/sync-lipsync', name: 'Upscaler' }
      ]},
      { name: 'Fashion Tools', models: [
        { id: 'fashn/tryon', name: 'Outfits Image' },
        { id: 'fashn/tryon', name: 'Outfits Video' }
      ]},
      { name: 'Product Tools', models: [
        { id: 'fal-ai/iclight-v2', name: 'Product Shot' },
        { id: 'fal-ai/iclight-v2', name: 'Variations' },
        { id: 'fal-ai/iclight-v2', name: 'Product Video' },
        { id: 'fal-ai/iclight-v2', name: 'Replace Objects' }
      ]}
    ]
  },
  {
    id: 'multibot',
    name: 'MultiBot',
    subcategories: [
      { name: 'Claude (Anthropic)', models: [
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
        { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet' },
        { id: 'anthropic/claude-3.7-sonnet-thinking', name: 'Claude 3.7 Sonnet Thinking' },
        { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
        { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' }
      ]},
      { name: 'GPT (OpenAI)', models: [
        { id: 'openai/o1-mini', name: 'O1 Mini' },
        { id: 'openai/o1', name: 'O1' },
        { id: 'openai/o3-mini', name: 'O3 Mini' },
        { id: 'openai/o3-mini-high', name: 'O3 Mini High' },
        { id: 'openai/gpt-4.5-preview', name: 'GPT-4.5 Preview' },
        { id: 'openai/gpt-4o-mini', name: 'GPT-4O Mini' },
        { id: 'openai/gpt-4o', name: 'GPT-4O' },
        { id: 'openai/gpt-4o-mini-search', name: 'GPT-4O Mini Search' },
        { id: 'openai/gpt-4o-search', name: 'GPT-4O Search' }
      ]},
      { name: 'Gemini (Google)', models: [
        { id: 'google/gemini-pro', name: 'Gemini Pro' },
        { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5' },
        { id: 'google/gemini-pro-vision', name: 'Gemini Pro Vision' },
        { id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
        { id: 'google/gemma-3-27b-it', name: 'Gemma 3 27B IT' }
      ]},
      { name: 'Grok (X-AI)', models: [
        { id: 'xai/grok-vision-beta', name: 'Grok Vision Beta' },
        { id: 'xai/grok-beta', name: 'Grok Beta' },
        { id: 'xai/grok-2-vision', name: 'Grok 2 Vision' },
        { id: 'xai/grok-2', name: 'Grok 2' },
        { id: 'xai/grok-2-mini', name: 'Grok 2 Mini' }
      ]},
      { name: 'Qwen', models: [
        { id: 'qwen/qwen-2.5-32b', name: 'Qwen 2.5 32B' },
        { id: 'qwen/qwen-2.5-vl-72b', name: 'Qwen 2.5 VL 72B' },
        { id: 'qwen/qwen-max', name: 'Qwen Max' },
        { id: 'qwen/eva-qwen-2.5-32b', name: 'Eva Qwen 2.5 32B' }
      ]},
      { name: 'DeepSeek', models: [
        { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1' },
        { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
      ]},
      { name: 'Amazon', models: [
        { id: 'amazon/nova-pro', name: 'Nova Pro' },
        { id: 'amazon/nova-lite', name: 'Nova Lite' },
        { id: 'amazon/nova-micro', name: 'Nova Micro' }
      ]},
      { name: 'Meta', models: [
        { id: 'meta/llama-3.1-405b', name: 'Llama 3.1 405B' },
        { id: 'meta/llama-3.2-90b-vision', name: 'Llama 3.2 90B Vision' },
        { id: 'meta/llama-3.1-405b-instruct', name: 'Llama 3.1 405B Instruct' },
        { id: 'meta/hermes-3-llama', name: 'Hermes 3 Llama' },
        { id: 'meta/euryale-70b', name: 'Euryale 70B' },
        { id: 'meta/tulu-3-405b', name: 'Tulu 3 405B' },
        { id: 'meta/anthracite', name: 'Anthracite' },
        { id: 'meta/magnum-v2-72b', name: 'Magnum V2 72B' },
        { id: 'meta/magnum-v4-72b', name: 'Magnum V4 72B' }
      ]},
      { name: 'Others', models: [
        { id: 'microsoft/phi-3-medium-128k', name: 'Microsoft Phi-3 Medium 128K' },
        { id: 'google/palm-2-chat-bison-32k', name: 'Google PaLM 2 Chat Bison 32K' },
        { id: 'rocinante/rocinante-12b', name: 'Rocinante 12B' },
        { id: 'perplexity/sonar-reasoning', name: 'Sonar Reasoning' },
        { id: 'perplexity/sonar', name: 'Sonar' },
        { id: 'perplexity/sonar-pro', name: 'Sonar Pro' },
        { id: 'perplexity/sonar-deep-research', name: 'Sonar Deep Research' },
        { id: 'perplexity/r1-1776', name: 'R1 1776' }
      ]}
    ]
  },
  {
    id: 'cod-analytics',
    name: 'COD Analytics',
    subcategories: [
      { name: 'Product Management', models: [
        { id: 'cod/add-product', name: 'Add a new product' },
        { id: 'cod/save-price', name: 'Save a price' }
      ]},
      { name: 'Media Management', models: [
        { id: 'cod/import-image', name: 'Import an image' },
        { id: 'cod/download-image', name: 'Download an image' },
        { id: 'cod/import-video', name: 'Import a video' },
        { id: 'cod/download-video', name: 'Download a video' }
      ]},
      { name: 'Landing Pages', models: [
        { id: 'cod/scrape-landing', name: 'Landing Page Scraping' },
        { id: 'cod/create-landing', name: 'Add landing page' }
      ]},
      { name: 'Marketing Tools', models: [
        { id: 'cod/marketing-list', name: 'Generate a marketing list (AI)' },
        { id: 'cod/generate-text', name: 'Generate text (AI)' },
        { id: 'cod/keyword-research', name: 'Keyword research (AI)' }
      ]}
    ]
  },
  {
    id: 'cod-search',
    name: 'COD Search',
    models: []
  },
  {
    id: 'my-library',
    name: 'My Library',
    models: []
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    models: []
  }
];

function CreditsHistory() {
  const { entries, clearHistory, removeEntry, getTotalCost } = useCredits();
  const [selectedPeriod, setSelectedPeriod] = React.useState<'all' | 'day' | 'week' | 'month'>('all');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<'all' | CreditEntry['type']>('all');
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = React.useState<string[]>([]);

  // Calculate stats for different time periods
  const getStatsForPeriod = (entries: CreditEntry[], hours: number) => {
    const now = Date.now();
    const periodEntries = entries.filter(entry => 
      now - entry.timestamp < hours * 60 * 60 * 1000
    );
    return {
      operations: periodEntries.length,
      credits: periodEntries.reduce((sum, entry) => {
        const modelUnit = AI_CREATOR_COSTS[entry.model]?.unit || 0;
        const quantity = entry.details?.quantity || 1;
        return sum + (modelUnit * quantity);
      }, 0)
    };
  };

  const stats = React.useMemo(() => ({
    day: getStatsForPeriod(entries, 24),
    week: getStatsForPeriod(entries, 24 * 7),
    month: getStatsForPeriod(entries, 24 * 30),
    year: getStatsForPeriod(entries, 24 * 365)
  }), [entries]);

  const filteredEntries = React.useMemo(() => {
    let filtered = [...entries];
    
    if (startDate || endDate) {
      // Use custom date range if either date is set
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() + (24 * 60 * 60 * 1000 - 1) : Date.now(); // End of selected day
      filtered = filtered.filter(entry => entry.timestamp >= start && entry.timestamp <= end);
    } else {
      // Use predefined period if no custom range is set
      const now = Date.now();
      switch (selectedPeriod) {
        case 'day':
          filtered = filtered.filter(entry => now - entry.timestamp < 24 * 60 * 60 * 1000);
          break;
        case 'week':
          filtered = filtered.filter(entry => now - entry.timestamp < 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          filtered = filtered.filter(entry => now - entry.timestamp < 30 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(entry => entry.type === selectedType);
    }

    return filtered;
  }, [entries, selectedPeriod, selectedType, startDate, endDate]);

  const totalCost = React.useMemo(() => {
    return filteredEntries.reduce((total, entry) => total + entry.cost, 0);
  }, [filteredEntries]);

  const downloadHistory = () => {
    const csv = [
      ['Date', 'Type', 'Model', 'Cost', 'Status', 'Details'].join(','),
      ...filteredEntries.map(entry => [
        new Date(entry.timestamp).toLocaleString(),
        entry.type,
        entry.model,
        entry.cost.toFixed(2),
        entry.status,
        JSON.stringify(entry.details || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-credits-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
    // Close all subcategories when toggling categories
    setExpandedSubcategories([]);
  };

  const toggleSubcategory = (subcategoryName: string, categoryId: string) => {
    if (expandedCategory !== categoryId) {
      // If category is not expanded, expand it first
      setExpandedCategory(categoryId);
    }
    
    setExpandedSubcategories(prev => {
      if (prev.includes(subcategoryName)) {
        return prev.filter(name => name !== subcategoryName);
      } else {
        // Close other subcategories and open this one
        return [subcategoryName];
      }
    });
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategory === categoryId;
  };

  const isSubcategoryExpanded = (subcategoryName: string) => {
    return expandedSubcategories.includes(subcategoryName);
  };

  const getCategoryEntries = (category: Category) => {
    if (category.subcategories) {
      return filteredEntries.filter(entry => 
        category.subcategories?.some(sub => 
          sub.models.some(model => model.id === entry.model)
        )
      );
    }
    return filteredEntries.filter(entry => 
      category.models?.includes(entry.model)
    );
  };

  const getSubcategoryEntries = (subcategory: Category['subcategories'][0]) => {
    return filteredEntries.filter(entry =>
      subcategory.models.some(model => model.id === entry.model)
    );
  };

  const getSubcategoryCost = (subcategory: Category['subcategories'][0]) => {
    return getSubcategoryEntries(subcategory)
      .reduce((total, entry) => {
        const modelUnit = AI_CREATOR_COSTS[entry.model]?.unit || 0;
        const quantity = entry.details?.quantity || 1;
        return total + (modelUnit * quantity);
      }, 0);
  };

  const getCategoryCost = (category: Category) => {
    if (category.subcategories) {
      return category.subcategories.reduce((total, sub) => 
        total + getSubcategoryCost(sub), 0
      );
    } else {
      return getCategoryEntries(category)
        .reduce((total, entry) => {
          const modelUnit = AI_CREATOR_COSTS[entry.model]?.unit || 0;
          const quantity = entry.details?.quantity || 1;
          return total + (modelUnit * quantity);
        }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 text-transparent bg-clip-text">
            Credits History
          </h1>
          <div>
            <button
              onClick={downloadHistory}
              className="px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-white" />
              <h3 className="text-sm font-medium text-white/80">Last 24 Hours</h3>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.day.credits.toFixed(2)} credits</p>
              <p className="text-sm text-white/60">{stats.day.operations} operations</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-white" />
              <h3 className="text-sm font-medium text-white/80">Last 7 Days</h3>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.week.credits.toFixed(2)} credits</p>
              <p className="text-sm text-white/60">{stats.week.operations} operations</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-white" />
              <h3 className="text-sm font-medium text-white/80">Last 30 Days</h3>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.month.credits.toFixed(2)} credits</p>
              <p className="text-sm text-white/60">{stats.month.operations} operations</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-white" />
              <h3 className="text-sm font-medium text-white/80">Last 365 Days</h3>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stats.year.credits.toFixed(2)} credits</p>
              <p className="text-sm text-white/60">{stats.year.operations} operations</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            disabled={!!(startDate || endDate)}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
            className={`px-4 py-2 bg-[#1A1030] text-white rounded-lg border border-white/10 ${
              (startDate || endDate) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="all">All Time</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (selectedPeriod !== 'all') setSelectedPeriod('all');
              }}
              className="px-4 py-2 bg-[#1A1030] text-white rounded-lg border border-white/10"
            />
            <span className="text-white/60">to</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (selectedPeriod !== 'all') setSelectedPeriod('all');
              }}
              className="px-4 py-2 bg-[#1A1030] text-white rounded-lg border border-white/10"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-3 py-2 text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            className="px-4 py-2 bg-[#1A1030] text-white rounded-lg border border-white/10"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="voice">Voice</option>
            <option value="text">Text</option>
          </select>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {CATEGORIES.map(category => {
            const categoryEntries = getCategoryEntries(category);
            const categoryCost = getCategoryCost(category);
            const isExpanded = isCategoryExpanded(category.id);
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;

            return (
              <div key={category.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-medium">{category.name}</h2>
                    <button 
                      className="text-sm text-white/60 bg-[#4A2A7A]/30 px-3 py-1 rounded-lg hover:bg-[#4A2A7A]/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add any click handler functionality here
                      }}
                    >
                      {categoryEntries.length || 0} operations
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium">{categoryCost ? categoryCost.toFixed(2) : '0.00'} credits</span>
                    {hasSubcategories && (
                      <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </button>
                
                {isExpanded && hasSubcategories && (
                  <div>
                    {category.subcategories?.map(subcategory => {
                      const subcategoryEntries = filteredEntries.filter(entry =>
                        subcategory.models.some(model => model.id === entry.model));
                      const isSubExpanded = isSubcategoryExpanded(subcategory.name);
                      
                      return (
                        <div key={subcategory.name} className="border-b border-white/5 last:border-b-0">
                          <button
                            onClick={() => toggleSubcategory(subcategory.name, category.id)}
                            className="w-full px-6 py-4 text-sm font-medium text-white/80 bg-[#4A2A7A] hover:bg-[#5A3A8A] transition-colors flex items-center justify-between relative"
                          >
                            <div className="flex items-center gap-4">
                              <span>{subcategory.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <button 
                              className="text-white/40 bg-[#4A2A7A]/30 px-3 py-1 rounded-lg hover:bg-[#4A2A7A]/50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add any click handler functionality here
                              }}
                            >
                              ({subcategoryEntries.length} operations)
                            </button>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isSubExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>
                          {isSubExpanded && subcategory.models.map((model) => {
                                  const entry = subcategoryEntries.find(e => e.model === model.id);
                                 const modelEntries = subcategoryEntries.filter(e => e.model === model.id);
                                 const totalCredits = modelEntries.reduce((sum, e) => sum + e.cost, 0);
                                 const totalRequests = modelEntries.length;
                                 
                                 // Sort models by total credits
                                 const sortedModels = [...subcategory.models].sort((a, b) => {
                                   const aCredits = subcategoryEntries.filter(e => e.model === a.id).reduce((sum, e) => sum + e.cost, 0);
                                   const bCredits = subcategoryEntries.filter(e => e.model === b.id).reduce((sum, e) => sum + e.cost, 0);
                                   return bCredits - aCredits; // Sort descending (most expensive first)
                                 });

                                  return (
                                  <div key={model.id} className="px-6 py-4 bg-[#1A1030] hover:bg-[#2A1A4A] border-t border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-4">
                                        <h3 className="font-medium">{model.name}</h3>
                                        <span className="text-sm text-white/60 bg-[#4A2A7A] px-2 py-0.5 rounded">
                                          {AI_CREATOR_COSTS[model.id]?.unit || 0} Credits/{AI_CREATOR_COSTS[model.id]?.type || 'request'}
                                        </span>
                                        <span className="text-sm text-white/60">
                                          {totalRequests || 0} operations
                                        </span>
                                      </div>
                                      <span className="font-medium">{totalCredits ? totalCredits.toFixed(2) : '0.00'} credits</span>
                                    </div>
                                      <div className="overflow-x-auto mt-2">
                                        <table className="w-full">
                                          <thead>
                                            <tr className="border-y border-white/10 bg-[#4A2A7A]/50">
                                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Date</th>
                                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Quantity</th>
                                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Unit</th>
                                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Credits</th>
                                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-white/10">
                                             {modelEntries.length > 0 ? (
                                              modelEntries.sort((a, b) => b.cost - a.cost).map((e) => (
                                              <tr key={e.id} className="text-white/60 bg-[#2A1A4A] hover:bg-[#3A2A5A]">
                                                 <td className="px-6 py-2 text-xs">
                                                   {new Date(e.timestamp).toLocaleString()}
                                                 </td>
                                                 <td className="px-6 py-2 text-xs">{e.details?.quantity || 1}</td>
                                                 <td className="px-6 py-2 text-xs">{AI_CREATOR_COSTS[model.id]?.unit || '-'}</td>
                                                <td className="px-6 py-2 text-xs">{((e.details?.quantity || 1) * (AI_CREATOR_COSTS[model.id]?.unit || 0)).toFixed(2)}</td>
                                                 <td className="px-6 py-2">
                                                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                     e.status === 'completed' ? 'bg-green-900/30 text-green-200/80' : 'bg-red-900/30 text-red-200/80'
                                                   }`}>
                                                     {e.status}
                                                   </span>
                                                 </td>
                                               </tr>
                                             ))) : (
                                             <tr className="text-white/40 bg-[#2A1A4A]">
                                               <td className="px-6 py-2 text-xs">-</td>
                                               <td className="px-6 py-2 text-xs">-</td>
                                               <td className="px-6 py-2 text-xs">-</td>
                                               <td className="px-6 py-2 text-xs">0.00</td>
                                               <td className="px-6 py-2 text-xs">-</td>
                                             </tr>
                                             )}
                                           </tbody>
                                         </table>
                                       </div>
                                    </div>
                                  );
                                })}
                        </div>
                      );
                    })}
                  </div>
                )}
                {isExpanded && !category.subcategories && categoryEntries.length === 0 && (
                  <div className="px-6 py-8 text-center text-white/40 border-t border-white/10">
                    No credit history in this category
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CreditsHistory;