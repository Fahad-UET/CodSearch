import React from 'react';
// to resolve build issue please check this
// import { ARABIC_LAYOUT } from './constants';
import { ARABIC_LAYOUT } from '../constants';

const KeyboardLayout = () => {
  return (
    <div className="keyboard-container">
      {ARABIC_LAYOUT.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <button key={`key-${rowIndex}-${keyIndex}`} className="keyboard-key">
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KeyboardLayout;
