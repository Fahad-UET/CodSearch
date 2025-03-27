import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Template } from '../../../types/templates';
import { useVariableStore } from '../../../store/variableStore';

interface TemplatePreviewProps {
  template: Template;
  onClose: () => void;
}

export function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  const [copied, setCopied] = useState(false);
  const { replaceVariables } = useVariableStore();

  const previewContent = replaceVariables(template.content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Template Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Original Template</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-600">
                {template.content}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview with Variables</h4>
            <div className="p-4 bg-purple-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-purple-900">
                {previewContent}
              </pre>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copy Preview
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}