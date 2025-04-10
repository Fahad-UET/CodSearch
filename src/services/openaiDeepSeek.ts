const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export interface GenerationResponse {
  text: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  reasoning_content?: string;
}

export async function generateText(
  prompt: string,
  model = 'deepseek-chat',
  useReasoning: boolean = false
): Promise<GenerationResponse> {
  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: useReasoning ? 'deepseek-reasoner' : model,
        max_tokens: useReasoning ? 8192 : 1000, // 8K tokens max for reasoner output
        reasoning_effort: useReasoning ? 32768 : undefined, // 32K tokens max for CoT
        messages: [
          {
            role: 'system',
            content:
              'You are an expert AI assistant specializing in generating high-quality marketing and advertising content. You MUST ALWAYS respond in the language specified in the prompt (ar: Arabic, fr: French, es: Spanish, en: English). Your responses must be laser-focused on the product and marketing objectives. You must only discuss the specific product mentioned and never deviate from the marketing goals.',
          },
          {
            role: 'system',
            content: `IMPORTANT RULES:
            0. Language Rules:
               - ALWAYS respond in the specified language (ar/fr/es/en)
               - Use appropriate cultural context for the language
               - Adapt tone and style to language norms
               - Use local expressions when dialect mode is enabled

            1. Focus Produit:
               - Parle UNIQUEMENT du produit mentionné dans le titre
               - Ne mentionne JAMAIS d'autres produits ou marques
               - Concentre-toi sur les caractéristiques et avantages spécifiques
               - Évite toute comparaison avec d'autres produits

            2. Objectif Marketing:
               - Concentre-toi uniquement sur l'objectif marketing fourni
               - Reste focalisé sur le copywriting et la conversion
               - Mets en avant la proposition de valeur unique
               - Adapte le message à l'audience cible

            3. Pas de Hors-Sujet:
               - Ne génère AUCUN contenu non lié au produit
               - Reste strictement dans le contexte e-commerce
            1. Focus Produit:
               - Parle UNIQUEMENT du produit mentionné dans le titre
               - Ne mentionne JAMAIS d'autres produits ou marques
               - Concentre-toi sur les caractéristiques et avantages spécifiques
               - Évite toute comparaison avec d'autres produits

            2. Objectif Marketing:
               - Concentre-toi uniquement sur l'objectif marketing fourni
               - Reste focalisé sur le copywriting et la conversion
               - Mets en avant la proposition de valeur unique
               - Adapte le message à l'audience cible

            3. Pas de Hors-Sujet:
               - Ne génère AUCUN contenu non lié au produit
               - Reste strictement dans le contexte e-commerce
               - Si la demande est peu claire, demande des précisions
               - Évite tout contenu générique ou non pertinent

            4. Validation du Contenu:
               - Vérifie que chaque phrase est liée au produit
               - Assure-toi que le message marketing est clair
               - Confirme que le contenu est adapté à l'objectif
               - Garantis que la valeur du produit est bien communiquée`,
          },
          { role: 'user', content: prompt },
        ],
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Text generation failed: ${data.error?.message || response.statusText}`);
    }

    // Extract message content and reasoning_content safely
    const message = { ...data.choices[0]?.message };
    const content = message.content || '';
    const reasoning_content = useReasoning ? message.reasoning_content : undefined;

    // Remove reasoning_content from message before next API call
    delete message.reasoning_content;

    // Extract language code from prompt
    const languageMatch = prompt.match(/^Language:\s*(ar|fr|es|en|pt)/i);
    const targetLanguage = languageMatch ? languageMatch[1].toLowerCase() : 'ar';
    const languagePrefix = `Language: ${targetLanguage}\n`;
    const finalPrompt = languagePrefix + prompt;

    // Validate response language (basic check)
    const languageChecks = {
      ar: /[\u0600-\u06FF]/, // Arabic characters
      fr: /[a-zéèêëàâçùûüÿœæ\s.,!?-]/i, // French characters
      es: /[a-záéíóúñ¿¡\s.,!?-]/i, // Spanish characters
      en: /[a-z0-9\s.,!?-]/i, // English characters
      pt: /[a-záàâãéêíóôõúç\s.,!?-]/i, // Portuguese characters
    };

    // If response doesn't match target language, try regenerating once
    if (!languageChecks[targetLanguage].test(content)) {
      console.warn('Response language mismatch, regenerating...');
      return generateText(finalPrompt, model, useReasoning); // Pass useReasoning flag with corrected prompt
    }

    // Extract token counts from response
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = data.usage?.completion_tokens || 0;
    const totalTokens = data.usage?.total_tokens || 0;

    // Return both content and token counts
    return {
      text: content,
      promptTokens,
      completionTokens,
      totalTokens,
      reasoning_content,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Text generation failed: ${error.message}`);
    }
    throw new Error('Text generation failed');
  }
}
