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

const KEYBOARD_ROWS = {
  numbers: [
    { en: '1', fn: '!', qwerty: '1' },
    { en: '2', fn: '@', qwerty: '2' },
    { en: '3', fn: '#', qwerty: '3' },
    { en: '4', fn: '$', qwerty: '4' },
    { en: '5', fn: '%', qwerty: '5' },
    { en: '6', fn: '^', qwerty: '6' },
    { en: '7', fn: '&', qwerty: '7' },
    { en: '8', fn: '*', qwerty: '8' },
    { en: '9', fn: '(', qwerty: '9' },
    { en: '0', fn: ')', qwerty: '0' },
  ],
  first: [
    { en: 'q', fn: 'Q', qwerty: 'q' },
    { en: 'w', fn: 'W', qwerty: 'w' },
    { en: 'e', fn: 'E', qwerty: 'e' },
    { en: 'r', fn: 'R', qwerty: 'r' },
    { en: 't', fn: 'T', qwerty: 't' },
    { en: 'y', fn: 'Y', qwerty: 'y' },
    { en: 'u', fn: 'U', qwerty: 'u' },
    { en: 'i', fn: 'I', qwerty: 'i' },
    { en: 'o', fn: 'O', qwerty: 'o' },
    { en: 'p', fn: 'P', qwerty: 'p' },
  ],
  second: [
    { en: 'a', fn: 'A', qwerty: 'a' },
    { en: 's', fn: 'S', qwerty: 's' },
    { en: 'd', fn: 'D', qwerty: 'd' },
    { en: 'f', fn: 'F', qwerty: 'f' },
    { en: 'g', fn: 'G', qwerty: 'g' },
    { en: 'h', fn: 'H', qwerty: 'h' },
    { en: 'j', fn: 'J', qwerty: 'j' },
    { en: 'k', fn: 'K', qwerty: 'k' },
    { en: 'l', fn: 'L', qwerty: 'l' },
  ],
  third: [
    { en: 'z', fn: 'Z', qwerty: 'z' },
    { en: 'x', fn: 'X', qwerty: 'x' },
    { en: 'c', fn: 'C', qwerty: 'c' },
    { en: 'v', fn: 'V', qwerty: 'v' },
    { en: 'b', fn: 'B', qwerty: 'b' },
    { en: 'n', fn: 'N', qwerty: 'n' },
    { en: 'm', fn: 'M', qwerty: 'm' },
    { en: ',', fn: '<', qwerty: ',' },
    { en: '.', fn: '>', qwerty: '.' },
    { en: '/', fn: '?', qwerty: '/' },
  ],
};

const SpecialKey = ({
  icon: Icon,
  label,
  onClick,
  className = '',
  active = false,
}: {
  icon?: React.ElementType;
  label: string;
  onClick: () => void;
  className?: string;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center bg-white rounded-lg text-gray-700 
               hover:bg-gradient-to-b hover:from-purple-50 hover:to-white hover:text-[#5D1C83] 
               transition-all duration-200 transform hover:-translate-y-1
               shadow-[0_2px_0_0_#e5e7eb,0_4px_6px_-1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff]
               hover:shadow-[0_4px_0_0_#5D1C83,0_8px_8px_-4px_rgba(93,28,131,0.2),inset_0_1px_0_0_#ffffff]
               active:translate-y-1 active:shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff]
               ${active ? 'bg-[#5D1C83] text-white' : ''}
               ${className}`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span className="text-sm font-medium ml-1">{label}</span>
  </button>
);

export default function EnglishKeyboard({
  onKeyPress,
  pressedKey,
  fnMode = false,
  shiftMode = false,
  onFnToggle,
  onShiftToggle,
}: Props) {
  const renderKey = (key: { en: string; fn: string; qwerty: string }) => {
    const displayValue = shiftMode ? key.en.toUpperCase() : key.en;
    return (
      <button
        key={key.en}
        onClick={() => onKeyPress(fnMode ? key.fn : shiftMode ? key.en.toUpperCase() : key.en)}
        className={`w-20 h-16 flex flex-col items-center justify-center bg-white rounded-lg text-gray-700 
                 hover:bg-gradient-to-b hover:from-purple-50 hover:to-white hover:text-[#5D1C83] 
                 transition-all duration-200 transform hover:-translate-y-1
                 shadow-[0_2px_0_0_#e5e7eb,0_4px_6px_-1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff]
                 hover:shadow-[0_4px_0_0_#5D1C83,0_8px_8px_-4px_rgba(93,28,131,0.2),inset_0_1px_0_0_#ffffff]
                 active:translate-y-1 active:shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff]
                 ${
                   pressedKey === key.en
                     ? 'translate-y-1 shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff] text-[#5D1C83] bg-purple-50'
                     : ''
                 }`}
      >
        <span className="text-2xl font-medium">
          {fnMode ? key.fn : shiftMode ? key.en.toUpperCase() : key.en}
        </span>
        <span className="text-xs text-gray-400 mt-0.5">{key.qwerty}</span>
      </button>
    );
  };

  return (
    <div className="flex gap-4">
      <div
        className={`w-[80%] bg-gradient-to-br ${keyboardThemes.en.bg} backdrop-blur-md rounded-xl p-4 space-y-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${keyboardThemes.en.metallic} opacity-50`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10 space-y-3">
          {/* Numbers row */}
          <div className="flex gap-1.5">
            <SpecialKey
              icon={Settings}
              label="fn"
              onClick={onFnToggle}
              active={fnMode}
              className={`w-16 h-16 ${fnMode ? `bg-${keyboardThemes.en.accent} text-white` : ''}`}
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
          </div>

          {/* Second letter row */}
          <div className="flex gap-1.5 ml-8">
            {KEYBOARD_ROWS.second.map(renderKey)}
            <SpecialKey
              icon={ArrowLeft}
              label="⏎"
              onClick={() => onKeyPress('enter')}
              className="w-24 h-16"
            />
          </div>

          {/* Third letter row */}
          <div className="flex gap-1.5">
            <SpecialKey
              icon={ArrowRight}
              label="⇧"
              onClick={onShiftToggle}
              active={shiftMode}
              className={`w-24 h-16 ${shiftMode ? 'bg-[#5D1C83] text-white' : ''}`}
            />
            {KEYBOARD_ROWS.third.map(renderKey)}
          </div>

          {/* Space bar */}
          <div className="flex gap-1.5">
            {/* <SpecialKey label="Ctrl" onClick={() => onKeyPress('ctrl')} className="w-16 h-16" />
            <SpecialKey label="Alt" onClick={() => onKeyPress('alt')} className="w-16 h-16" /> */}
            <button
              onClick={() => onKeyPress(' ')}
              className="flex-1 h-16 flex items-center justify-center bg-white rounded-lg text-gray-700 hover:bg-purple-50 hover:text-[#5D1C83] transition-all text-lg font-medium"
            >
              space
            </button>
            <SpecialKey label="Alt" onClick={() => onKeyPress('alt')} className="w-16 h-16" />
            <SpecialKey label="Ctrl" onClick={() => onKeyPress('ctrl')} className="w-16 h-16" />
          </div>
        </div>
      </div>
      <div className="w-[20%]">
        <EmojiPanel onSelect={onKeyPress} />
      </div>
    </div>
  );
}
