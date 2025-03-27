import React from 'react';
import { Clipboard } from 'lucide-react';

interface PasteButtonProps {
  onPaste: (text: string) => void;
  className?: string;
}

function PasteButton({ onPaste, className = '' }: PasteButtonProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onPaste(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePaste}
      className={`px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200 ${className}`}
      title="Paste from clipboard"
    >
      <Clipboard className="w-5 h-5" />
    </button>
  );
}

export default PasteButton;
