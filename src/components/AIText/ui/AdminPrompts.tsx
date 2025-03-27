import React from 'react';
import { Settings, Save, PenLine, MessageSquare, Layout, Mic, Video, X } from 'lucide-react';
import { TABS } from './constant';
import { useAdminPromptsStore } from '@/store/adminPromptStore';

interface Props {
  onClose: () => void;
  product: any;
  tab: string;
}

export default function AdminPrompts({ onClose, product, tab }: Props) {
  const [prompts, setPrompts] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState(TABS[0].id);
  const { adminPrompts, setAdminPrompts } = useAdminPromptsStore();

  const handleSave = (tabId: string, prompt: string) => {
    const uniqueId = `text-${crypto.randomUUID()}`;

    const existingPromptIndex = adminPrompts.findIndex(
      (item: any) => item.productId === product.id && item?.type === tabId
    );

    if (existingPromptIndex !== -1) {
      const updatedPrompts = [...adminPrompts];
      updatedPrompts[existingPromptIndex] = {
        ...updatedPrompts[existingPromptIndex],
        prompt: prompts,
      };

      setAdminPrompts(updatedPrompts);
    } else {
      const updatedArr = [
        ...adminPrompts,
        {
          id: uniqueId,
          productId: product.id,
          prompt: prompts,
          type: tabId,
        },
      ];

      setAdminPrompts(updatedArr);
    }

    setPrompts(prompt);
  };

  // Load saved prompts on mount
  React.useEffect(() => {
    const adminPrompt = adminPrompts.filter(
      (item: any) => item.productId === product.id && item?.type === tab
    );
// to resolve build issue please check this
    // setPrompts(adminPrompt?.[0]?.prompt);
    setPrompts(adminPrompt[0]?.prompt);
  }, [adminPrompts, tab]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg relative">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-white" />
            <h1 className="text-lg font-semibold text-white">Admin Prompts</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-900' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4 opacity-80" />
              {tab.label} Instructions
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {TABS.map(tab => (
          <div key={tab.id} className={`space-y-4 ${activeTab === tab.id ? 'block' : 'hidden'}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  {tab.label} Prompt Template
                </h2>
                <button
                  onClick={() => handleSave(tab.id, prompts[tab.id] || '')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Template
                </button>
              </div>

              <textarea
                value={prompts || ''}
                onChange={e => setPrompts(e.target.value)}
                placeholder={`Enter the admin prompt template for ${tab.label}...`}
                className="w-full h-[calc(100vh-300px)] p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none"
              />

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Template Variables:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>
                    <code>{'{{text}}'}</code> - The selected text content
                  </li>
                  <li>
                    <code>{'{{language}}'}</code> - The text language
                  </li>
                  <li>
                    <code>{'{{style}}'}</code> - Custom style instructions
                  </li>
                  <li>
                    <code>{'{{tone}}'}</code> - Desired tone of voice
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
