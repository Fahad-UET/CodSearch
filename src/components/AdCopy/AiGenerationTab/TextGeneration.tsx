import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { TextArea } from './TextArea';
import { SavedPrompts } from './SavedPrompts';
import { ModelSelector } from './ModelSelector';

export const TextGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Implement AI text generation logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    } catch (error) {
      console.error('Error generating text:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <ModelSelector />
      
      <TextArea
        value={prompt}
        onChange={setPrompt}
        placeholder="Enter your prompt here..."
        rows={5}
      />

      <div className="flex justify-between items-center">
        <SavedPrompts onSelect={setPrompt} />
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                   rounded-md hover:bg-blue-700 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
};