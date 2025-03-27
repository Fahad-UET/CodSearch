import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard, Check, X } from 'lucide-react';
import { VirtualKeyboardProps, Language } from './types';
import { LANGUAGE_OPTIONS, ARABIC_MAPPING, KEYBOARD_LAYOUTS } from './constants';
import { KeyboardLayout } from './components/KeyboardLayout';
import { usePhysicalKeyboard } from './hooks/usePhysicalKeyboard';
type props = {
onKeyPress: any;
onLanguageChange?: (value: string) => void;
}

export const VirtualKeyboard = ({ onKeyPress, onLanguageChange }: props) => {
  return (
    <div className="w-full bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <select 
          onChange={e => onLanguageChange(e.target.value)}
          className="px-3 py-1.5 rounded border border-gray-300"
        >
          <option value="arabic">العربية</option>
          <option value="french">Français</option>
          <option value="english">English</option>
          <option value="spanish">Español</option>
        </select>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50">
            Copier
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50">
            Coller
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50">
            Enregistrer
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        {KEYBOARD_LAYOUTS['arabic'].main.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map((key, j) => (
              <button 
                key={`${i}-${j}`}
                className={`
                  ${key === 'Enter' || key === 'Suppr' ? 'w-16' : 'w-10'} 
                  h-10 bg-white rounded border border-gray-300 hover:bg-gray-50
                  flex items-center justify-center
                `}
                onClick={() => onKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-1 justify-center">
          <button 
            className="w-16 h-10 bg-white rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => onKeyPress('Suppr')}
          >
            Suppr
          </button>
          <button
            className="flex-1 h-10 bg-white rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => onKeyPress(' ')}
          >
            Espace
          </button>
          <button
            className="w-16 h-10 bg-white rounded border border-gray-300 hover:bg-gray-50"
            onClick={() => onKeyPress('Enter')}
          >
            Entrée
          </button>
        </div>
      </div>
    </div>
  );
};