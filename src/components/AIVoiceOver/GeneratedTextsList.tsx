import React from 'react';
import { Copy, Download } from 'lucide-react';

interface Props {
  texts: string[];
  onSelect: (text: string) => void;
  selectedText: string | null;
}

export default function GeneratedTextsList({ texts, onSelect, selectedText }: Props) {
  if (texts.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">
          No generated texts yet. Generate some texts in the AI Text Generator.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {texts.map((text, index) => (
        <div
          key={index}
          data-selected={text === selectedText}
          onClick={() => onSelect(text)}
          className={`p-3 rounded-lg border transition-all group cursor-pointer ${
            text === selectedText
              ? 'bg-gray-50/30 border-gray-100/30 text-gray-400'
              : 'bg-gray-50 border-gray-200 hover:border-[#2980B9]/20 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${text === selectedText ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Text #{texts.length - index}
              {text === selectedText && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  Generated
                </span>
              )}
            </span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(text);
                }}
                className="p-1 text-gray-500 hover:text-[#2980B9] hover:bg-white rounded-lg transition-all"
                title="Copy text"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `text-${index + 1}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="p-1 text-gray-500 hover:text-[#2980B9] hover:bg-white rounded-lg transition-all"
                title="Download text"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-700 text-sm line-clamp-4">{text}</p>
        </div>
      ))}
    </div>
  );
}
