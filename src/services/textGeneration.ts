export interface GenerationContext {
  adminPrompt: string;
  customInstructions: string;
  useReasoning: boolean;
  selectedText: any;
}

export function formatGenerationPrompt(context: GenerationContext): string {
  const { adminPrompt, customInstructions, useReasoning, selectedText } = context;

  const sections = [
    {
      title: '# Prompt Template',
      content: adminPrompt,
    },
    {
      title: '# Custom Instructions',
      content: customInstructions || 'No custom instructions provided.',
    },
    {
      title: '# Reasoning Mode',
      content: useReasoning ? 'Enabled - Use step-by-step reasoning' : 'Disabled',
    },
    {
      title: '# Selected Text',
      content: selectedText.content,
    },
  ];

  return sections
    .map(section => `${section.title}\n${'-'.repeat(section.title.length)}\n\n${section.content}`)
    .join('\n\n\n');
}
