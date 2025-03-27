import React from 'react';
// to resolve build issue please check this
// import { KeyboardLayout } from './components/KeyboardLayout';
import  KeyboardLayout  from './components/KeyboardLayout';
import { QuickPhrases } from './components/QuickPhrases';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  language: 'en' | 'fr' | 'es' | 'ar';
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  language
}) => {
  const handlePhraseSelect = (phrase: string) => {
    phrase.split('').forEach(char => onKeyPress(char));
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <QuickPhrases
        language={language}
        onPhraseSelect={handlePhraseSelect}
      />
      <KeyboardLayout
      // to resolve build issue please check this
        // language={language}
        // onKeyPress={onKeyPress}
      />
    </div>
  );
};