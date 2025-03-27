import React from 'react';
import { Settings, Delete, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import EmojiPanel from './EmojiPanel';
import { keyboardThemes } from '../../../../utils/keyboardThemes';

interface Props {
  onKeyPress: (key: string) => void;
  pressedKey: string | null;
  fnMode?: boolean;
  shiftMode?: boolean;
  onFnToggle: () => void;
  onShiftToggle: () => void;
}

// Keyboard layout configuration
const KEYBOARD_ROWS = {
  numbers: [
    { ar: '١', fn: '!', en: '1', latin: '1' },
    { ar: '٢', fn: '@', en: '2', latin: '2' },
    { ar: '٣', fn: '#', en: '3', latin: '3' },
    { ar: '٤', fn: '$', en: '4', latin: '4' },
    { ar: '٥', fn: '%', en: '5', latin: '5' },
    { ar: '٦', fn: '^', en: '6', latin: '6' },
    { ar: '٧', fn: '&', en: '7', latin: '7' },
    { ar: '٨', fn: '*', en: '8', latin: '8' },
    { ar: '٩', fn: '(', en: '9', latin: '9' },
    { ar: '٠', fn: ')', en: '0', latin: '0' },
  ],
  first: [
    { ar: 'ش', fn: '~', en: 'Shift + s' },
    { ar: 'س', fn: '`', en: 's' },
    { ar: 'ز', fn: '|', en: 'z' },
    { ar: 'ر', fn: '\\', en: 'r' },
    { ar: 'ذ', fn: '{', en: 'Shift + d' },
    { ar: 'د', fn: '}', en: 'd' },
    { ar: 'خ', fn: '[', en: 'Shift + H' },
    { ar: 'ح', fn: ']', en: 'H' },
    { ar: 'ج', fn: '<', en: 'j' },
    { ar: 'ث', fn: '>', en: 'Shift + t' },
    { ar: 'ت', fn: '=', en: 't' },
    { ar: 'ب', fn: '+', en: 'b' },
    { ar: 'ا', fn: '_', en: 'a' },
  ],
  second: [
    { ar: 'ي', fn: '€', en: 'y' },
    { ar: 'و', fn: '£', en: 'w' },
    { ar: 'ه', fn: '¥', en: 'h' },
    { ar: 'ن', fn: '₹', en: 'n' },
    { ar: 'م', fn: '©', en: 'm' },
    { ar: 'ل', fn: '®', en: 'l' },
    { ar: 'ك', fn: '™', en: 'k' },
    { ar: 'ق', fn: '°', en: 'q' },
    { ar: 'ف', fn: '±', en: 'f' },
    { ar: 'غ', fn: '÷', en: "g'" },
    { ar: 'ع', fn: '×', en: 'g' },
    { ar: 'ظ', fn: '¶', en: 'Z' },
    { ar: 'ط', fn: '§', en: 'T' },
    { ar: 'ض', fn: '¤', en: 'D' },
    { ar: 'ص', fn: '¢', en: 'S' },
  ],
  special: ['}', '{', ']', '[', ')', '(', '_', '-', '\\', '/', '%', '$', '#', '@'],
};

const SpecialKey = ({
  icon: Icon,
  label,
  onClick,
  className = '',
}: {
  icon?: React.ElementType;
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center bg-white rounded-lg text-gray-700 
               hover:bg-gradient-to-b hover:from-purple-50 hover:to-white hover:text-[#5D1C83] 
               transition-all duration-200 transform hover:-translate-y-1
               shadow-[0_2px_0_0_#e5e7eb,0_4px_6px_-1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff]
               hover:shadow-[0_4px_0_0_#5D1C83,0_8px_8px_-4px_rgba(93,28,131,0.2),inset_0_1px_0_0_#ffffff]
               active:translate-y-1 active:shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff]
               ${className}`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span className="text-sm font-medium ml-1">{label}</span>
  </button>
);

export default function ArabicKeyboard({
  onKeyPress,
  pressedKey,
  fnMode = false,
  shiftMode = false,
  onFnToggle,
  onShiftToggle,
}: Props) {
  const renderKey = (key: { ar: string; fn: string; en: string }) => {
    const displayValue = shiftMode ? key.ar.toUpperCase() : key.ar;
    return (
      <button
        key={key.ar}
        onClick={() => onKeyPress(fnMode ? key.fn : shiftMode ? key.ar.toUpperCase() : key.ar)}
        className={`w-20 h-16 flex flex-col items-center justify-center bg-white rounded-lg text-gray-700 
                 hover:bg-gradient-to-b hover:from-purple-50 hover:to-white hover:text-[#5D1C83] 
                 transition-all duration-200 transform hover:-translate-y-1
                 shadow-[0_2px_0_0_#e5e7eb,0_4px_6px_-1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff]
                 hover:shadow-[0_4px_0_0_#5D1C83,0_8px_8px_-4px_rgba(93,28,131,0.2),inset_0_1px_0_0_#ffffff]
                 active:translate-y-1 active:shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff]
                 ${
                   pressedKey === key.ar
                     ? 'translate-y-1 shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff] text-[#5D1C83] bg-purple-50'
                     : ''
                 }`}
      >
        <span className="text-2xl font-medium">{fnMode ? key.fn || key.ar : displayValue}</span>
        <span className="text-xs text-gray-400 mt-0.5">{key.en}</span>
      </button>
    );
  };

  return (
    <div className="flex gap-4">
      <div
        className={`w-[80%] bg-gradient-to-br ${keyboardThemes.ar.bg} backdrop-blur-md rounded-xl p-4 space-y-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${keyboardThemes.ar.metallic} opacity-50`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10 space-y-3">
          {/* Numbers row */}
          <div className="flex gap-1.5">
            <SpecialKey
              icon={Settings}
              label="fn"
              onClick={onFnToggle}
              // to resolve build issue please check this
              // active={fnMode}
              className={`w-16 h-16 ${fnMode ? `bg-${keyboardThemes.ar.accent} text-white` : ''}`}
            />
            {KEYBOARD_ROWS.numbers.map(renderKey)}
            <SpecialKey
              icon={Delete}
              label="⌫"
              onClick={() => onKeyPress('delete')}
              className="w-20 h-16"
            />
          </div>

          {/* First letter row */}
          <div className="flex gap-1.5">
            <SpecialKey
              icon={ChevronRight}
              label="⇥"
              onClick={() => onKeyPress('tab')}
              className="w-20 h-16"
            />
            {KEYBOARD_ROWS.first.map(renderKey)}
            <SpecialKey
              icon={ArrowLeft}
              label="⏎"
              onClick={() => onKeyPress('enter')}
              className="w-24 h-16"
            />
          </div>

          {/* Second letter row */}
          <div className="flex gap-1.5">
            <SpecialKey
              icon={ArrowRight}
              label="⇧"
              onClick={() => onKeyPress('shift')}
              className="w-24 h-16"
            />
            {KEYBOARD_ROWS.second.map(renderKey)}
            <SpecialKey
              icon={ArrowRight}
              label="⇧"
              onClick={() => onKeyPress('shift')}
              className="w-24 h-16"
            />
          </div>

          {/* Third letter row */}
          <div className="flex gap-1.5">
            <SpecialKey
              icon={ArrowRight}
              label="⇧"
              onClick={onShiftToggle}
              // to resolve build issue please check this
              // active={shiftMode}
              className={`w-24 h-16 ${shiftMode ? 'bg-[#5D1C83] text-white' : ''}`}
            />
            {KEYBOARD_ROWS.special.reverse().map(char => (
              <button
                key={char}
                onClick={() => onKeyPress(char)}
                className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-[#5D1C83] transition-all shadow-[0_2px_0_0_#e5e7eb,0_4px_6px_-1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff] hover:shadow-[0_4px_0_0_#5D1C83,0_8px_8px_-4px_rgba(93,28,131,0.2),inset_0_1px_0_0_#ffffff] active:translate-y-1 active:shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff]"
              >
                <span className="text-xl">{char}</span>
              </button>
            ))}
            {/* <SpecialKey label="Alt" onClick={() => onKeyPress('alt')} className="w-16 h-16" /> */}
            {/* <SpecialKey label="Ctrl" onClick={() => onKeyPress('ctrl')} className="w-16 h-16" /> */}
          </div>

          {/* Space bar */}
          <div className="flex gap-1.5">
            <button
              onClick={() => onKeyPress(' ')}
              className="w-full h-16 flex items-center justify-center bg-white rounded-lg text-gray-700 hover:bg-purple-50 hover:text-[#5D1C83] transition-all text-lg font-medium"
            >
              Space
            </button>
          </div>
        </div>
      </div>
      <div className="w-[20%]">
        <EmojiPanel onSelect={onKeyPress} />
      </div>
    </div>
  );
}
