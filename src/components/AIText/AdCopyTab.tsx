import React, { useState } from 'react';
import AiText from './AdCopyAi';
import AiTextDeepSeek from './deepSeek/AiText';

export default function AdCopyTab({
  activeTabParent,
  product,
}: {
  activeTabParent: any;
  product: any;
}) {
  const [activeTabModal, setActiveTabModal] = useState('deepSeek');
  return (
    <div>
      <div className="bg-gradient-to-r from-[#6E3FC3] to-[#B070FF] shadow-lg">
        <div className="flex">
          <button
            onClick={() => setActiveTabModal('deepSeek')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
              activeTabModal === 'deepSeek'
                ? 'bg-white text-[#6E3FC3]'
                : 'text-white/90 hover:bg-white/10 relative'
            }`}
          >
            {/* Optional Icon Rendering */}
            {/* <tab.icon className="w-4 h-4" /> */}

            <span className="flex items-center gap-2">
              Deep Seek
              {/* <span
                className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.value ? 'bg-[#6E3FC3] text-white' : 'bg-white/20 text-white'
                }`}
              >
                {getTabCount(tab.value)}
              </span> */}
            </span>
          </button>
          <button
            onClick={() => setActiveTabModal('chatgpt')}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-medium rounded-t-lg transition-all ${
              activeTabModal === 'chatgpt'
                ? 'bg-white text-[#6E3FC3]'
                : 'text-white/90 hover:bg-white/10 relative'
            }`}
          >
            {/* Optional Icon Rendering */}
            {/* <tab.icon className="w-4 h-4" /> */}

            <span className="flex items-center gap-2">
              Chat Gpt
              {/* <span
                className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.value ? 'bg-[#6E3FC3] text-white' : 'bg-white/20 text-white'
                }`}
              >
                {getTabCount(tab.value)}
              </span> */}
            </span>
          </button>
        </div>
      </div>
      {activeTabModal === 'chatgpt' && (
        <AiText product={product} activeTabParent={activeTabParent} />
      )}
      {activeTabModal === 'deepSeek' && (
        <AiTextDeepSeek product={product} activeTabParent={activeTabParent} />
      )}
    </div>
  );
}
