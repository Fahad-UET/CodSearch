// Regular expression to match URLs
const URL_REGEX = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;

// Regular expression to match markdown symbols
const MARKDOWN_REGEX = /(?:\*\*|###+|__)(.*?)(?:\*\*|###+|__)/g;
const HTML_REGEX = /<[^>]*>/g;

function cleanMarkdown(text: string): string {
  // Don't clean HTML tags that are part of error messages
  if (text.includes('class="text-red-600"')) {
    return text.replace(MARKDOWN_REGEX, '$1');
  }
  return text.replace(MARKDOWN_REGEX, '$1').replace(HTML_REGEX, '');
}

export function linkify(text: string): string {
  const cleanedText = cleanMarkdown(text);
  return cleanedText.replace(URL_REGEX, (url) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:text-purple-800 underline">${url}</a>`
  );
}