import React, { RefObject } from 'react';
import { Send, ImageIcon, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useCallback, useState } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  selectedImage: string | null;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageRemove: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  // to resolve build issue please check this
  // inputRef: RefObject<HTMLInputElement>;
  inputRef: any;
  fileInputRef: RefObject<HTMLInputElement>;
}

function autoResizeTextarea(element: HTMLTextAreaElement) {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
}

export function ChatInput({
  input,
  setInput,
  isLoading,
  selectedImage,
  handleImageSelect,
  handleImageRemove,
  handleSubmit,
  inputRef,
  fileInputRef
}: ChatInputProps) {
  const lastCursorPosition = useRef<number | null>(null);
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [isVisible, setIsVisible] = useState(true);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setSelectionRange({
      start: target.selectionStart || 0,
      end: target.selectionEnd || 0
    });
    setInput(e.target.value);
    autoResizeTextarea(target);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionRange({
      start: target.selectionStart || 0,
      end: target.selectionEnd || 0
    });
  };

  const insertTextAtCursor = useCallback((newText: string) => {
    if (!inputRef.current) return;
    
    const textarea = inputRef.current as unknown as HTMLTextAreaElement;
    const { start, end } = selectionRange;
    const textBeforeCursor = input.slice(0, start);
    const textAfterCursor = input.slice(end);
    
    const newValue = textBeforeCursor + newText + textAfterCursor;
    setInput(newValue);
    
    const newCursorPosition = start + newText.length;
    setSelectionRange({ start: newCursorPosition, end: newCursorPosition });
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = newCursorPosition;
      textarea.selectionEnd = newCursorPosition;
      autoResizeTextarea(textarea);
    }, 0);
  }, [input, inputRef, selectionRange]);

  useEffect(() => {
    if (inputRef.current) {
      autoResizeTextarea(inputRef.current as unknown as HTMLTextAreaElement);
      const textarea = inputRef.current as unknown as HTMLTextAreaElement;
      textarea.selectionStart = selectionRange.start;
      textarea.selectionEnd = selectionRange.end;
    }
  }, [input, selectionRange]);

  return (
    <div className={`transition-all duration-300 ${
      isVisible ? 'h-auto opacity-100' : 'h-12 opacity-80 hover:opacity-100'
    }`}>
      <div className={`p-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg transition-all duration-300 ${
        isVisible ? '' : 'transform translate-y-8'
      }`}>
      {/* <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-6 text-white/80 hover:text-white z-10"
      >
        <ChevronDown className={`w-8 h-8 text-white transition-transform duration-200 ${isVisible ? '' : 'rotate-180'}`} />
      </button> */}
      <form
        onSubmit={handleSubmit}
        className={`max-w-7xl mx-auto glass-effect rounded-xl shadow-lg p-4 transition-all duration-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {selectedImage && (
          <div className="mb-4 relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-32 rounded-lg"
            />
            <button
              onClick={handleImageRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            // type="text"
            value={input}
            ref={inputRef as unknown as RefObject<HTMLTextAreaElement>}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-white/10 text-white border border-white/20 p-3 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 resize-y min-h-[48px] max-h-[500px] overflow-y-auto"
            disabled={isLoading}
            rows={1}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            ref={fileInputRef}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="glass-effect text-white/80 rounded-lg px-4 h-12 w-12 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg px-4 h-12 w-12 flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}