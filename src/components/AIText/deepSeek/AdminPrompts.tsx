import React from 'react';
import {
  Settings,
  Save,
  PenLine,
  MessageSquare,
  Layout,
  Mic,
  Video,
  X,
  RotateCcw,
} from 'lucide-react';
import { TABS } from '../ui/constant';
import { createAiText, updateAiText } from '@/services/firebase/AiText';

interface Props {
  onClose: () => void;
  generatedTexts?: any;
  product?: any;
}

export default function AdminPrompts({ onClose, generatedTexts, product }: Props) {
  const [prompts, setPrompts] = React.useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = React.useState(TABS[0].id);

  // Default prompts for each tab
  const DEFAULT_PROMPTS: Record<string, string> = {
    'creative-voice': `Create five separate 30-second UGC voiceover scripts in [Language] with an [Accent]. Each script must use a unique marketing angle, reflecting a real person sharing their experience naturally, as if talking to a friend.

Guidelines:
Avoid Latin letters: If the language is Arabic, use Arabic script for all product names, store names, or phrases (e.g., [اسم المنتج], [المشكلة]). For other languages, use the appropriate script.

Call to Action (CTA):

Do NOT directly mention store URLs. Instead, say:
"ابحثوا عن المنتج بالاسم الدقيق '[اسم المنتج]' والتغليف اللي موضح هنا. أنا شخصيًا طلبته من [اسم المتجر]، السعر كان مناسب والتوصيل سريع، والدفع عند الاستلام."
(For non-Arabic languages, adapt this structure accordingly.)

Keep the CTA natural, non-aggressive, and focused on guiding users to search for the exact product name and packaging.

Marketing Angles (1 per script):
Emotional Storytelling (Personal struggle → Transformation).

Humor (Funny/relatable anecdote).

Benevolent Sarcasm (e.g., "Why did I wait so long?!").

Shocking Comparison (vs. traditional methods).

Micro-Influencer Vibe (e.g., "I've tried 10 products before this, but...").

Script Structure for All:
Hook: Engage with a relatable problem or emotion.

Benefits: Mention 1-2 practical + emotional benefits.

Key Benefit: Highlight the top advantage in one sentence.

CTA: Use the exact natural recommendation format above.

Deliverables:
Provide five separate scripts, each with a distinct marketing angle, following the structure and guidelines above. The language and script used will depend on the user's choice of [Language].

Example Scripts:
Script 1 – Emotional Storytelling:
"I was skeptical at first... After years of struggling with [problem], I tried [product name]. The result? No more [specific pain], and I feel so much better! The packaging is unique—you'll recognize it right away. Look for it by the exact name '[product name]' and this packaging. I got mine from [store name], the price was fair, and delivery was super fast."

Script 2 – Humor:
"I used to laugh at myself... Trying all these weird methods to fix [problem]. Then I tried [product name]! Seriously, the results were quick and effective. The packaging is so distinctive—you can't miss it. Search for it by the exact name '[product name]'. I ordered mine from [store name], and it was a great deal with fast delivery."

Script 3 – Benevolent Sarcasm:
"Why did I wait so long?! I struggled with [problem] until I tried [product name]. The difference was huge! The packaging is unique—you'll spot it easily. Look for it by the exact name '[product name]'. I got mine from [store name], and it was affordable with quick delivery."

Script 4 – Shocking Comparison:
"I tried all the traditional solutions... Nothing worked. Then I tried [product name]! The difference was night and day, and the packaging is so distinctive. Search for it by the exact name '[product name]'. I ordered mine from [store name], and it was worth every penny with fast delivery."

Script 5 – Micro-Influencer Vibe:
"I've tried so many products before... But [product name] was different. The results were quick and effective, and the packaging is unique. Look for it by the exact name '[product name]'. I got mine from [store name], and it was a great deal with fast delivery."

Note: Adapt the language and script based on the user's choice of [Language]. Avoid aggressive CTAs or formal tones.`,
  };

  const handleSave = async (tabId: string, prompt: string) => {
    // Save to localStorage
    localStorage.setItem(`admin_prompt_${tabId}`, prompt);
    const updatedTabPrompt = prompt;
    const updatedPrompts = {
      ...prompts,
      [tabId]: updatedTabPrompt,
    };

    if (!generatedTexts && generatedTexts.length > 0) {
      await createAiText(product.id, {
        type: 'deepSeek',
        adminPrompts: updatedPrompts,
      });
    } else {
      await updateAiText(product.id, {
        text: [],
        type: 'deepSeek',
        adminPrompts: updatedPrompts,
      });
    }

    setPrompts(updatedPrompts);
  };

  // Load saved prompts on mount
  React.useEffect(() => {
    const savedPrompts = TABS.reduce((acc, tab) => {
      // Try to get saved prompt, fallback to default if available
      const savedPrompt = localStorage.getItem(`admin_prompt_${tab.id}`) || DEFAULT_PROMPTS[tab.id];
      if (savedPrompt) {
        acc[tab.id] = savedPrompt;
        // Save default prompt to localStorage if no saved prompt exists
        if (!localStorage.getItem(`admin_prompt_${tab.id}`) && DEFAULT_PROMPTS[tab.id]) {
          localStorage.setItem(`admin_prompt_${tab.id}`, DEFAULT_PROMPTS[tab.id]);
        }
      }
      return acc;
    }, {} as Record<string, string>);

    setPrompts(savedPrompts);
  }, []);

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
            <div key={tab.id} className="relative">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    activeTab === tab.id ? 'bg-gray-100' : 'bg-white/10'
                  }`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${
                      activeTab === tab.id ? 'text-gray-900' : 'text-white/90'
                    }`}
                  />
                </div>
                {tab.label} Instructions
              </button>
            </div>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (DEFAULT_PROMPTS[tab.id]) {
                        if (
                          confirm(
                            'Are you sure you want to reset to the default prompt? This will overwrite your current changes.'
                          )
                        ) {
                          handleSave(tab.id, DEFAULT_PROMPTS[tab.id]);
                        }
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      DEFAULT_PROMPTS[tab.id]
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-300 cursor-not-allowed'
                    } text-white rounded-lg transition-all`}
                    disabled={!DEFAULT_PROMPTS[tab.id]}
                    title={
                      DEFAULT_PROMPTS[tab.id]
                        ? 'Reset to default prompt'
                        : 'No default prompt available'
                    }
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                  </button>
                  <button
                    onClick={() => handleSave(tab.id, prompts[tab.id] || '')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Template
                  </button>
                </div>
              </div>

              <textarea
                value={prompts[tab.id] || ''}
                onChange={e => handleSave(tab.id, e.target.value)}
                placeholder={`Enter the admin prompt template for ${tab.label}...`}
                className="w-full h-[calc(100vh-200px)] p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
