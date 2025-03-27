import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Equal, Divide, Minus, Plus, Percent, Copy, History, ClipboardPaste } from 'lucide-react';
import { CalculatorButton } from './CalculatorButton';
import { CalculatorDisplay } from './CalculatorDisplay';

interface HistoryEntry {
  formula: string;
  result: string;
}

export function Calculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState<string>('');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 400, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 400, height: 600 });
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartPosition({ x: position.x, y: position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPosition({
        x: startPosition.x + deltaX,
        y: startPosition.y + deltaY
      });
    }
    if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setSize({
        width: Math.max(300, startSize.width + deltaX),
        height: Math.max(400, startSize.height + deltaY)
      });
    }
  }, [isDragging, isResizing, dragStart, startPosition, startSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Center calculator initially
  useEffect(() => {
    if (calculatorRef.current) {
      const rect = calculatorRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - rect.width) / 2,
        y: (window.innerHeight - rect.height) / 2
      });
    }
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp, dragStart, startPosition]);

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for calculator keys
      if (
        /[\d\.\+\-\*\/\(\)=]/.test(e.key) ||
        e.key === 'Enter' ||
        e.key === 'Backspace' ||
        e.key === 'Escape'
      ) {
        e.preventDefault();
      }

      // Handle numeric input
      if (/\d/.test(e.key)) {
        inputDigit(e.key);
      }
      // Handle operators
      else if (e.key === '+') performOperation('+');
      else if (e.key === '-') performOperation('-');
      else if (e.key === '*') performOperation('×');
      else if (e.key === '/') performOperation('÷');
      else if (e.key === '.') inputDot();
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Escape') clearAll();
      else if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        setFormula(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, formula, operator, previousValue]);

  const clearAll = () => {
    setDisplay('0');
    setFormula('');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(display);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const number = parseFloat(text);
      if (!isNaN(number)) {
        setDisplay(String(number));
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
    setFormula(prev => prev + digit);
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setFormula(prev => prev + '.');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
      setFormula(display + ' ' + nextOperator + ' ');
    } else if (operator) {
      const currentValue = parseFloat(previousValue);
      let newValue: number;

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        case '%':
          newValue = currentValue % inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setPreviousValue(String(newValue));
      setDisplay(String(newValue));
      setFormula(prev => prev + nextOperator + ' ');
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (operator && previousValue) {
      performOperation('=');
      const result = display;
      setHistory(prev => [...prev, { formula: formula + ' = ' + result, result }]);
      setFormula('');
      setOperator(null);
      setPreviousValue(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999999] bg-black/75 backdrop-blur-sm p-4">
      <div 
        ref={calculatorRef}
        onMouseDown={handleMouseDown}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] relative"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          cursor: isDragging ? 'grabbing' : 'default',
          transition: 'none'
        }}
      >
        <div 
          className="flex-none flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-10 cursor-grab relative group"
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown(e);
          }}
        >
          {/* Drag Handle Indicator */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-purple-300/50 to-indigo-300/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-purple-300/50 to-indigo-300/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Calculator</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Copy result"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={handlePaste}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Paste number"
              >
                <ClipboardPaste size={18} />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="History"
              >
                <History size={18} />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-none">
          <CalculatorDisplay value={display} formula={formula} />
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-100 min-h-[300px] max-h-[400px]">
            {history.length > 0 ? (
              <div className="p-4 space-y-2">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/80 rounded-lg shadow-sm hover:bg-white transition-colors cursor-pointer border border-purple-100/50 hover:border-purple-200"
                    onClick={() => setDisplay(entry.result)}
                  >
                    <div className="text-sm text-gray-500 font-mono">{entry.formula}</div>
                    <div className="text-xl font-medium text-purple-600 mt-1">{entry.result}</div>
                  </div>
                ))}
                <button
                  onClick={() => setHistory([])}
                  className="w-full mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear History
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No calculation history</div>
            )}
          </div>
        )}

        <div className="flex-none grid grid-cols-4 gap-2 p-4 bg-gradient-to-br from-gray-50 to-purple-50">
          {/* First Row */}
          <CalculatorButton onClick={clearAll} variant="secondary">
            AC
          </CalculatorButton>
          <CalculatorButton
            onClick={() => setDisplay(String(parseFloat(display) * -1))}
            variant="secondary" 
          >
            +/-
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation('%')} variant="secondary">
            <Percent size={18} />
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation('÷')} variant="operator">
            <Divide size={18} />
          </CalculatorButton>

          {/* Second Row */}
          <CalculatorButton onClick={() => inputDigit('7')}>7</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('8')}>8</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('9')}>9</CalculatorButton>
          <CalculatorButton onClick={() => performOperation('×')} variant="operator">
            ×
          </CalculatorButton>

          {/* Third Row */}
          <CalculatorButton onClick={() => inputDigit('4')}>4</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('5')}>5</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('6')}>6</CalculatorButton>
          <CalculatorButton onClick={() => performOperation('-')} variant="operator">
            <Minus size={18} />
          </CalculatorButton>

          {/* Fourth Row */}
          <CalculatorButton onClick={() => inputDigit('1')}>1</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('2')}>2</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('3')}>3</CalculatorButton>
          <CalculatorButton onClick={() => performOperation('+')} variant="operator">
            <Plus size={18} />
          </CalculatorButton>

          {/* Fifth Row */}
          <div className="col-span-3">
            <CalculatorButton onClick={() => inputDigit('0')}>0</CalculatorButton>
          </div>
          <CalculatorButton onClick={inputDot}>.</CalculatorButton>
          
          {/* Equals Button */}
          <div className="col-span-4">
            <CalculatorButton 
              onClick={handleEquals} 
              variant="operator"
              className="w-full text-2xl"
            >
              <Equal size={24} />
            </CalculatorButton>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-10 h-10 cursor-se-resize group"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            setStartSize({ width: size.width, height: size.height });
          }}
        >
          {/* Resize Handle Lines */}
          <div className="absolute bottom-2 right-2 w-6 h-6 flex flex-col items-end justify-end gap-1 opacity-75 group-hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 bg-purple-600 rounded-full" />
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
            </div>
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full right-full mb-2 mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Drag to resize
          </div>
        </div>
      </div>
    </div>
  );
}