import { TextGenerationService, formatGenerationPrompt, type GenerationPrompt } from '@/services/TextGeneration/textGeneration';
import { ApiKeyInput } from '../ui/ApiKeyInput';
import { useState } from 'react';

const textGenerationService = new TextGenerationService();

export const AiGenerationTab = () => {
  const [useOpenAI, setUseOpenAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleApiKeyChange = (apiKey: string) => {
    textGenerationService.setUseOpenAI(true, {
      apiKey,
      model: 'gpt-3.5-turbo'
    });
  };

  const handleUseOpenAIChange = (value: boolean) => {
    setUseOpenAI(value);
    textGenerationService.setUseOpenAI(value);
  };

  const handleGenerate = async (promptData: GenerationPrompt) => {
    setLoading(true);
    try {
      const prompt = formatGenerationPrompt(promptData);
      if (!prompt) {
        throw new Error('Invalid prompt data');
      }

      const result = await textGenerationService.generateText(prompt);
      setOutput(result);
    } catch (error) {
      console.error('Generation failed:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <ApiKeyInput
        onApiKeyChange={handleApiKeyChange}
        onUseOpenAIChange={handleUseOpenAIChange}
        useOpenAI={useOpenAI}
      />
      {/* Rest of your component */}
    </div>
  );
};