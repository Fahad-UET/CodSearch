import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Save, Check, Languages, Variable } from 'lucide-react';
import { KeyboardLayout } from '../VirtualKeyboard/components/KeyboardLayout';
import { Language } from '../VirtualKeyboard/types';
import { ARABIC_MAPPING, LANGUAGE_OPTIONS } from '../VirtualKeyboard/constants';
import { useVariableStore } from '../../store/variableStore';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
}

export function TextEditor({ value, onChange, onSave }: TextEditorProps) {
  const [language, setLanguage] = useState<Language>('ar');
  const [copied, setCopied] = useState(false);
  const [buffer, setBuffer] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showVariables, setShowVariables] = useState(false);
  const { variables, replaceVariables } = useVariableStore();
  const [displayValue, setDisplayValue] = useState('');
  const [showVariableDropdown, setShowVariableDropdown] = useState(false);

  // Update display value whenever the actual value changes
  useEffect(() => {
    setDisplayValue(replaceVariables(value));
  }, [value, replaceVariables]);

  const handleInsertVariable = useCallback(
    (variableName: string) => {
      const textArea = document.querySelector('textarea');
      if (!textArea) return;

      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const newValue = value.substring(0, start) + `{{${variableName}}}` + value.substring(end);
      onChange(newValue);

      // Set cursor position after inserted variable
      setTimeout(() => {
        textArea.focus();
        const newPosition = start + variableName.length + 4; // 4 for {{ and }}
        textArea.setSelectionRange(newPosition, newPosition);
      }, 0);
    },
    [value, onChange]
  );

  // Handle physical keyboard input for Arabic
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (language !== 'ar' || e.ctrlKey || e.altKey || e.metaKey) return;

      // Handle special keys
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter' || e.key === 'Tab') {
        return;
      }

      e.preventDefault();
      const key = e.key.toLowerCase();

      // Handle space
      if (e.key === ' ') {
        onChange(value + ' ');
        return;
      }

      // Handle multi-character combinations
      if (['k', 'g', 't', 's', 'd'].includes(key)) {
        setBuffer(prev => {
          const newBuffer = prev + key;
          if (newBuffer.length === 2) {
            const arabicChar = ARABIC_MAPPING[newBuffer];
            if (arabicChar) {
              onChange(value + arabicChar);
              return '';
            }
          }
          return newBuffer;
        });
        return;
      }

      // Handle 'h' for combinations
      if (key === 'h' && buffer) {
        const combo = buffer + key;
        const arabicChar = ARABIC_MAPPING[combo];
        if (arabicChar) {
          onChange(value + arabicChar);
          setBuffer('');
          return;
        }
      }

      // Clear buffer after timeout
      setTimeout(() => {
        if (buffer) {
          const singleChar = ARABIC_MAPPING[buffer];
          if (singleChar) {
            onChange(value + singleChar);
          }
          setBuffer('');
        }
      }, 250);

      // Handle single character
      const arabicChar = ARABIC_MAPPING[key];
      if (arabicChar) {
        onChange(value + arabicChar);
      }
    },
    [language, value, onChange, buffer]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleKeyPress = (key: any) => {
    // Handle language switch
    if (LANGUAGE_OPTIONS.map(l => l.code).includes(key)) {
      setLanguage(key as Language);
      return;
    }

    // Handle normal key press
    if (language === 'ar') {
      const arabicChar = ARABIC_MAPPING[key.toLowerCase()];
      onChange(value + (arabicChar || key));
    } else {
      onChange(value + key);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleSpace = () => {
    onChange(value + ' ');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
      {/* Header Actions */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowVariableDropdown(!showVariableDropdown)}
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
            >
              <Variable size={16} />
              Insert Variable
            </button>

            {showVariableDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                {variables.map(variable => (
                  <button
                    key={variable.id}
                    onClick={() => {
                      handleInsertVariable(variable.name);
                      setShowVariableDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                  >
                    <Variable size={14} className="text-purple-500" />
                    {variable.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowVariables(!showVariables)}
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
            >
              <Variable size={16} />
              Insert Variable
            </button>

            {showVariables && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                {variables.map(variable => (
                  <button
                    key={variable.id}
                    onClick={() => {
                      handleInsertVariable(variable.name);
                      setShowVariables(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                  >
                    <Variable size={14} className="text-purple-500" />
                    {variable.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Save
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Languages size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {language === 'ar' ? 'العربية' : language === 'fr' ? 'Français' : 'English'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Languages size={16} className="text-gray-400" />
          <div className="flex gap-2">
            {LANGUAGE_OPTIONS.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as Language)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  language === lang.code
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text Area */}
      <div className="p-4 flex-1">
        {/* Original textarea for editing */}
        <textarea value={value} onChange={e => onChange(e.target.value)} className="hidden" />
        {/* Display textarea showing replaced variables */}
        <textarea
          value={displayValue}
          readOnly
          className={`w-full h-full p-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 resize-none ${
            language === 'ar' ? 'font-arabic text-right' : ''
          }`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          placeholder={language === 'ar' ? 'ابدأ الكتابة...' : 'Start typing...'}
        />
      </div>

      {/* Virtual Keyboard */}
      <div className="p-4 border-t bg-gray-50 w-full">
        <KeyboardLayout
          language={language}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          className="w-full"
        />
      </div>
    </div>
  );
}
