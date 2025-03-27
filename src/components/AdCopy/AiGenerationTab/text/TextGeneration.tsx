import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { generateText } from '@/services/openai';
import { useToast } from '@/hooks/useToast';

interface TextGenerationProps {
  apiKey: string;
}

export function TextGeneration({ apiKey }: TextGenerationProps) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const { showToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt', 'error');
      return;
    }

    if (!apiKey) {
      showToast('Please enter your OpenAI API key', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await generateText(prompt, apiKey);
      // to resolve build issue please check this
      // setResult(response);
      setResult(response.text);
    } catch (error) {
      showToast('Failed to generate text. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        className="w-full h-32 p-2 border rounded-md"
      />
      <Button
        onClick={handleGenerate}
        disabled={loading || !apiKey}
        className="w-full"
      >
        {loading ? 'Generating...' : 'Generate'}
      </Button>
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}