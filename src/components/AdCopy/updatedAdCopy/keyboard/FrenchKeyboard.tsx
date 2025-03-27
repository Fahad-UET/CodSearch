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
    { fr: '1', fn: '&', en: '1' },
    { fr: '2', fn: 'é', en: '2' },
    { fr: '3', fn: '"', en: '3' },
    { fr: '4', fn: "'", en: '4' },
    { fr: '5', fn: '(', en: '5' },
    { fr: '6', fn: '-', en: '6' },
    { fr: '7', fn: 'è', en: '7' },
    { fr: '8', fn: '_', en: '8' },
    { fr: '9', fn: 'ç', en: '9' },
    { fr: '0', fn: 'à', en: '0' },
  ],
  first: [
    { fr: 'a', fn: 'â', en: 'q' },
    { fr: 'z', fn: 'ä', en: 'w' },
    { fr: 'e', fn: 'ê', en: 'e' },
    { fr: 'r', fn: 'R', en: 'r' },
    { fr: 't', fn: 'T', en: 't' },
    { fr: 'y', fn: 'ÿ', en: 'y' },
    { fr: 'u', fn: 'û', en: 'u' },
    { fr: 'i', fn: 'î', en: 'i' },
    { fr: 'o', fn: 'ô', en: 'o' },
    { fr: 'p', fn: 'P', en: 'p' },
  ],
  second: [
    { fr: 'q', fn: 'Q', en: 'a' },
    { fr: 's', fn: 'S', en: 's' },
    { fr: 'd', fn: 'D', en: 'd' },
    { fr: 'f', fn: 'F', en: 'f' },
    { fr: 'g', fn: 'G', en: 'g' },
    { fr: 'h', fn: 'H', en: 'h' },
    { fr: 'j', fn: 'J', en: 'j' },
    { fr: 'k', fn: 'K', en: 'k' },
    { fr: 'l', fn: 'L', en: 'l' },
    { fr: 'm', fn: 'M', en: 'm' },
  ],
  third: [
    { fr: 'w', fn: 'W', en: 'z' },
    { fr: 'x', fn: 'X', en: 'x' },
    { fr: 'c', fn: 'C', en: 'c' },
    { fr: 'v', fn: 'V', en: 'v' },
    { fr: 'b', fn: 'B', en: 'b' },
    { fr: 'n', fn: 'N', en: 'n' },
    { fr: ',', fn: '?', en: 'm' },
    { fr: ';', fn: '.', en: ',' },
    { fr: ':', fn: '/', en: '.' },
    { fr: '!', fn: '§', en: '/' },
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

export default function FrenchKeyboard({
  onKeyPress,
  pressedKey,
  fnMode = false,
  shiftMode = false,
  onFnToggle,
  onShiftToggle,
}: Props) {
  const renderKey = (key: { fr: string; fn: string; en: string }) => {
    const displayValue = shiftMode ? key.fr.toUpperCase() : key.fr;
    return (
      <button
        key={key.fr}
        onClick={() => onKeyPress(fnMode ? key.fn : shiftMode ? key.fr.toUpperCase() : key.fr)}
        className={`w-20 h-16 flex flex-col items-center justify-center bg-white rounded-lg text-gray-700 
                 hover:bg-gradient-to-b hover:from-purple-50 hover:to-white hover:text-[#5D1C83] 
                 transition-all duration-200 transform hover:-translate-y-1
                 shadow-[0_2px_0_0_#e5e7eb,0_4px_6px_-1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff]
                 hover:shadow-[0_4px_0_0_#5D1C83,0_8px_8px_-4px_rgba(93,28,131,0.2),inset_0_1px_0_0_#ffffff]
                 active:translate-y-1 active:shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff]
                 ${
                   pressedKey === key.fr
                     ? 'translate-y-1 shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff] text-[#5D1C83] bg-purple-50'
                     : ''
                 }`}
      >
        <span className="text-2xl font-medium">{fnMode ? key.fn : displayValue}</span>
        <span className="text-xs text-gray-400 mt-0.5">{key.en}</span>
      </button>
    );
  };

  return (
    <div className="flex gap-4">
      <div
        className={`w-[80%] bg-gradient-to-br ${keyboardThemes.fr.bg} backdrop-blur-md rounded-xl p-4 space-y-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${keyboardThemes.fr.metallic} opacity-50`}
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
              className={`w-16 h-16 ${fnMode ? `bg-${keyboardThemes.fr.accent} text-white` : ''}`}
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
            <SpecialKey label="Alt Gr" onClick={() => onKeyPress('altgr')} className="w-16 h-16" />
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
