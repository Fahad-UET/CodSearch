import React from 'react';
import { Clipboard } from 'lucide-react';

interface InputWithPasteProps
extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  onPasteText?: (text: string) => void; // Custom handler
  multiline?: boolean;
  rows?: number;
}

function InputWithPaste({
  onPasteText,
  multiline = false,
  className = '',
  rows = 4,
  ...props
}: InputWithPasteProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onPasteText(text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const inputClasses = `w-full pr-12 ${className}`;
  const Component = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      <Component {...props} className={inputClasses} rows={multiline ? rows : undefined} />
      <button
        type="button"
        onClick={handlePaste}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white/60 transition-colors rounded-md hover:bg-white/5"
        title="Paste from clipboard"
      >
        <Clipboard className="w-5 h-5" />
      </button>
    </div>
  );
}

export default InputWithPaste;
