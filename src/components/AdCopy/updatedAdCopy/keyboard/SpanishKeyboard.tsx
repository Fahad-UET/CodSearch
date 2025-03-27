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

// Configuration du clavier espagnol
const KEYBOARD_ROWS = {
  numbers: [
    { es: '1', fn: '¡', en: '1' },
    { es: '2', fn: '€', en: '2' },
    { es: '3', fn: '#', en: '3' },
    { es: '4', fn: '$', en: '4' },
    { es: '5', fn: '%', en: '5' },
    { es: '6', fn: '&', en: '6' },
    { es: '7', fn: '/', en: '7' },
    { es: '8', fn: '(', en: '8' },
    { es: '9', fn: ')', en: '9' },
    { es: '0', fn: '=', en: '0' },
  ],
  first: [
    { es: 'q', fn: 'Q', en: 'q' },
    { es: 'w', fn: 'W', en: 'w' },
    { es: 'e', fn: 'é', en: 'e' },
    { es: 'r', fn: 'R', en: 'r' },
    { es: 't', fn: 'T', en: 't' },
    { es: 'y', fn: 'Y', en: 'y' },
    { es: 'u', fn: 'ú', en: 'u' },
    { es: 'i', fn: 'í', en: 'i' },
    { es: 'o', fn: 'ó', en: 'o' },
    { es: 'p', fn: 'P', en: 'p' },
  ],
  second: [
    { es: 'a', fn: 'á', en: 'a' },
    { es: 's', fn: 'S', en: 's' },
    { es: 'd', fn: 'D', en: 'd' },
    { es: 'f', fn: 'F', en: 'f' },
    { es: 'g', fn: 'G', en: 'g' },
    { es: 'h', fn: 'H', en: 'h' },
    { es: 'j', fn: 'J', en: 'j' },
    { es: 'k', fn: 'K', en: 'k' },
    { es: 'l', fn: 'L', en: 'l' },
    { es: 'ñ', fn: 'Ñ', en: 'n' },
  ],
  third: [
    { es: 'z', fn: 'Z', en: 'z' },
    { es: 'x', fn: 'X', en: 'x' },
    { es: 'c', fn: 'C', en: 'c' },
    { es: 'v', fn: 'V', en: 'v' },
    { es: 'b', fn: 'B', en: 'b' },
    { es: 'n', fn: 'N', en: 'n' },
    { es: 'm', fn: 'M', en: 'm' },
    { es: ',', fn: ';', en: ',' },
    { es: '.', fn: ':', en: '.' },
    { es: '¿', fn: '?', en: '?' },
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

export default function SpanishKeyboard({
  onKeyPress,
  pressedKey,
  fnMode = false,
  shiftMode = false,
  onFnToggle,
  onShiftToggle,
}: Props) {
  const renderKey = (key: { es: string; fn: string; en: string }) => {
    const displayValue = shiftMode ? key.es.toUpperCase() : key.es;
    return (
      <button
        key={key.es}
        onClick={() => onKeyPress(fnMode ? key.fn : shiftMode ? key.es.toUpperCase() : key.es)}
        className={`w-20 h-16 flex flex-col items-center justify-center bg-white rounded-lg text-gray-700 
                 hover:bg-gradient-to-b hover:from-purple-50 hover:to-white hover:text-[#5D1C83] 
                 transition-all duration-200 transform hover:-translate-y-1
                 shadow-[0_2px_0_0_#e5e7eb,0_4px_6px_-1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff]
                 hover:shadow-[0_4px_0_0_#5D1C83,0_8px_8px_-4px_rgba(93,28,131,0.2),inset_0_1px_0_0_#ffffff]
                 active:translate-y-1 active:shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff]
                 ${
                   pressedKey === key.es
                     ? 'translate-y-1 shadow-[0_1px_0_0_#5D1C83,inset_0_1px_0_0_#ffffff] text-[#5D1C83] bg-purple-50'
                     : ''
                 }`}
      >
        <span className="text-2xl font-medium">
          {fnMode ? key.fn : shiftMode ? key.es.toUpperCase() : key.es}
        </span>
        <span className="text-xs text-gray-400 mt-0.5">{key.en}</span>
      </button>
    );
  };

  return (
    <div className="flex gap-4">
      <div
        className={`w-[80%] bg-gradient-to-br ${keyboardThemes.es.bg} backdrop-blur-md rounded-xl p-4 space-y-3 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${keyboardThemes.es.metallic} opacity-50`}
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
              className={`w-16 h-16 ${fnMode ? `bg-${keyboardThemes.es.accent} text-white` : ''}`}
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

          {/* Space bar and special characters */}
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
