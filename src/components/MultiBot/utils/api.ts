const API_KEY = import.meta.env.VITE_OPENAI_KEY;
const API_URL = import.meta.env.VITE_OPENAI_URL;

import { AVAILABLE_MODELS, ModelOption } from './Types';

function isSearchModel(model: ModelOption): boolean {
  return model.series === 'Mistral' || 
         model.id.includes('search') || 
         model.id.includes('research');
}

export async function sendMessage(
  messages: { role: string; content: string; image?: string }[],
  selectedModels: string[],
  language: string = 'en'
) {
  try {
    const responses = await Promise.all(selectedModels.map(model => {
      const modelConfig = AVAILABLE_MODELS.find(m => m.id === model);
      if (!modelConfig) throw new Error(`Model ${model} not found`);
      
      const lastMessage = messages[messages.length - 1];
      const hasImage = Boolean(lastMessage.image);
      
      // Check if model supports images when image is present
      if (hasImage && !modelConfig.supportsImages) {
        throw new Error(`Model ${modelConfig.name} does not support images`);
      }
      
      // Additional instructions for search-enabled models
      const searchInstructions = isSearchModel(modelConfig) 
        ? `You MUST include references and links to source websites for any factual claims or information. Format your response with clear citations and links to sources.`
        : '';

      // Enhanced language instructions for Arabic
      const languageInstructions = language === 'ar' 
        ? `You MUST respond in proper Modern Standard Arabic (فصحى). Use correct Arabic grammar, proper sentence structure, and full diacritical marks where appropriate. Ensure the text is properly encoded and flows right-to-left. Do not mix Latin characters unless absolutely necessary for technical terms.`
        : `You must respond in ${language} language only. Do not use any other language, regardless of the input language.`;
      
      // System message with language and formatting instructions
      const systemMessage = {
        role: 'system',
        content: `${languageInstructions} Format your response as a clear, well-structured answer. ${searchInstructions}`
      };
      
      // Format messages for the API
      const formattedMessages = messages.map((msg, index) => {
        const isLastMessage = msg === lastMessage;
        const isImageMessage = Boolean(msg.image);

        if (isLastMessage && isImageMessage && modelConfig.supportsImages) {
          // For the last message with an image, use the new format
          return {
            role: msg.role,
            content: [
              { 
                type: "text", 
                text: msg.content || "Please analyze this image"
              },
              {
                type: "image_url",
                image_url: {
                  url: msg.image,
                  detail: model.includes("gemini") ? "low" : "high" // Gemini requires "low" detail
                }
              }
            ]
          };
        } else {
          // For regular messages or non-image-supporting models
          return {
            role: msg.role,
            content: msg.content
          };
        }
      });

      return fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MultiBot AI',
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, ...formattedMessages].filter(Boolean),
          response_format: { type: "text" },
          max_tokens: 4096
        }),
      });
    }));

    const results = await Promise.all(responses.map(async (response, index) => {
      if (!response.ok) {
        const errorData = await response.json();
        const modelName = AVAILABLE_MODELS.find(m => m.id === selectedModels[index])?.name;
        let errorMessage;
        
        if (errorData.error?.metadata?.provider_name) {
          errorMessage = `${modelName}: Provider ${errorData.error.metadata.provider_name} returned an error. Please try again or select a different model.`;
        } else {
          errorMessage = errorData.error?.message || errorData.error || errorData.message || `Failed to get response from ${modelName}`;
        }
        
        throw new Error(`API request failed for ${selectedModels[index]}: ${errorMessage}`);
      }
      const data = await response.json();
      
      // Parse structured response
      let parsedContent, inputTokens, outputTokens;
      try {
        const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.content;
        inputTokens = data.usage?.prompt_tokens;
        outputTokens = data.usage?.completion_tokens;
        if (!content) throw new Error(`No content received from ${AVAILABLE_MODELS.find(m => m.id === selectedModels[index])?.name}`);

        // Ensure proper handling of Arabic text
        parsedContent = content.trim()
          .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, match => match)
          .replace(/[^\S\r\n]+/g, ' ')
          .trim();
      } catch (error) {
        console.error(`Invalid response data from ${selectedModels[index]}:`, data);
        const modelName = AVAILABLE_MODELS.find(m => m.id === selectedModels[index])?.name;
        throw new Error(`Failed to parse response from ${modelName}. The model may be temporarily unavailable.`);
      }
      
      return {
        model: selectedModels[index],
        content: parsedContent,
        metadata: { 
          language_used: language,
          input_tokens: inputTokens,
          output_tokens: outputTokens
        }
      };
    }));

    return results;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}