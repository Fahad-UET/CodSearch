// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp, Copy, FileDown } from 'lucide-react';
// import { TABS } from '../ui/constant';

// interface Props {
//   text: string;
//   index: number;
//   total: number;
//   tabId: string;
// }

// export default function GeneratedTextPreview({ text, index, total, tabId }: Props) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const previewLength = 150;

//   const preview = text.length > previewLength ? text.slice(0, previewLength) + '...' : text;
// // to resolve build issue please check this
//   const tab: any = TABS.find(t => t.id === tabId);
//   const gradientClass = tab?.bgGradient || 'from-purple-500/5 to-purple-50/50';

  
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/20 transition-all duration-300 group">
//       {/* Header */}
//       <div
//         onClick={() => setIsExpanded(!isExpanded)}
//         className={`flex items-center justify-between p-4 cursor-pointer rounded-lg
//           bg-gradient-to-r ${gradientClass}
//           transform transition-all duration-300
//           hover:shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.1)]
//           hover:translate-y-[-2px]
//           ${isExpanded ? 'shadow-[0_4px_12px_rgba(0,0,0,0.1)]' : 'shadow-sm'}`}
//       >
//         <div className="flex items-center gap-4 flex-1 min-w-0">
//           <span className="text-sm font-medium text-gray-600 bg-white/80 px-2 py-1 rounded-full shadow-sm">
//             Generation #{total - index}
//           </span>
//           {!isExpanded && <p className="text-gray-700 line-clamp-1 flex-1 min-w-0">{preview}</p>}
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
//             <button
//               onClick={e => {
//                 e.stopPropagation();
//                 navigator.clipboard.writeText(text);
//               }}
//               className="p-1.5 text-[#5D1C83]/70 hover:text-[#5D1C83] bg-white/90 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-110 duration-200"
//               title="Copy text"
//             >
//               <Copy className="w-4 h-4" />
//             </button>
//             <button
//               onClick={e => {
//                 e.stopPropagation();
//                 const blob = new Blob([text], { type: 'text/plain' });
//                 const url = URL.createObjectURL(blob);
//                 const a = document.createElement('a');
//                 a.href = url;
//                 a.download = `generated-text-${index + 1}.txt`;
//                 document.body.appendChild(a);
//                 a.click();
//                 document.body.removeChild(a);
//                 URL.revokeObjectURL(url);
//               }}
//               className="p-1.5 text-[#5D1C83]/70 hover:text-[#5D1C83] bg-white/90 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-110 duration-200"
//               title="Download text"
//             >
//               <FileDown className="w-4 h-4" />
//             </button>
//           </div>
//           <button className="p-1.5 bg-white/90 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-110 duration-200 text-[#5D1C83]/70 hover:text-[#5D1C83]">
//             {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>

//       {/* Expanded content */}
//       {isExpanded && (
//         <div className="px-4 py-4 bg-white border-t border-gray-100 rounded-b-lg">
//           <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, FileDown, Mic } from 'lucide-react';
import { TABS } from '../ui/constant';

interface Props {
  text: string;
  index: number;
  total: number;
  tabId: string;
}

export default function GeneratedTextPreview({ text, index, total, tabId }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewLength = 150;

  const preview = text.length > previewLength ? text.slice(0, previewLength) + '...' : text;

  const tab: any = TABS.find(t => t.id === tabId);
  const gradientClass = tab?.bgGradient || 'from-purple-500/5 to-purple-50/50';

  const handleTextToSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/20 transition-all duration-300 group">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between p-4 cursor-pointer rounded-lg
          bg-gradient-to-r ${gradientClass}
          transform transition-all duration-300
          hover:shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.1)]
          hover:translate-y-[-2px]
          ${isExpanded ? 'shadow-[0_4px_12px_rgba(0,0,0,0.1)]' : 'shadow-sm'}`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Generation Label */}
          <span className="text-sm font-medium text-gray-600 bg-white/80 px-2 py-1 rounded-full shadow-sm">
            Generation #{total - index}
          </span>

          {!isExpanded && (
            <p className="text-gray-700 line-clamp-1 flex-1 min-w-0">{preview}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Action Buttons (Mic, Copy, Download) */}
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
            {/* Mic Button */}
            <button
              onClick={handleTextToSpeech}
              className="p-1.5 text-[#5D1C83]/70 hover:text-[#5D1C83] bg-white/90 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-110 duration-200"
              title="Read text aloud"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Copy Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                navigator.clipboard.writeText(text);
              }}
              className="p-1.5 text-[#5D1C83]/70 hover:text-[#5D1C83] bg-white/90 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-110 duration-200"
              title="Copy text"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Download Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `generated-text-${index + 1}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="p-1.5 text-[#5D1C83]/70 hover:text-[#5D1C83] bg-white/90 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-110 duration-200"
              title="Download text"
            >
              <FileDown className="w-4 h-4" />
            </button>
          </div>

          {/* Expand/Collapse Button */}
          <button className="p-1.5 bg-white/90 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md hover:scale-110 duration-200 text-[#5D1C83]/70 hover:text-[#5D1C83]">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 py-4 bg-white border-t border-gray-100 rounded-b-lg">
          <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
        </div>
      )}
    </div>
  );
}
