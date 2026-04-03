import React, { useState, useEffect, useCallback } from 'react';
import { useOSStore } from '../../store';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);
  const { activeWindowId } = useOSStore();

  const handleNumber = useCallback((num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  }, [display, shouldReset]);

  const handleOperator = useCallback((op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  }, [display]);

  const calculate = useCallback(() => {
    if (!equation) return;
    try {
      const fullEquation = equation + display;
      // Replace symbols for eval
      const mathEquation = fullEquation.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(mathEquation);
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setShouldReset(true);
    }
  }, [display, equation]);

  const clear = useCallback(() => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
  }, [display]);

  const handleToggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  const handleDecimal = useCallback(() => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display]);

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  useEffect(() => {
    if (activeWindowId !== 'calculator') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('×');
      if (e.key === '/') handleOperator('÷');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clear();
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === '%') handlePercent();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, handleNumber, handleOperator, calculate, clear, handleBackspace, handleDecimal, handlePercent]);

  const buttons = [
    { label: 'C', action: clear, type: 'function' },
    { label: '±', action: handleToggleSign, type: 'function' },
    { label: '%', action: handlePercent, type: 'function' },
    { label: '÷', action: () => handleOperator('÷'), type: 'operator' },
    { label: '7', action: () => handleNumber('7'), type: 'number' },
    { label: '8', action: () => handleNumber('8'), type: 'number' },
    { label: '9', action: () => handleNumber('9'), type: 'number' },
    { label: '×', action: () => handleOperator('×'), type: 'operator' },
    { label: '4', action: () => handleNumber('4'), type: 'number' },
    { label: '5', action: () => handleNumber('5'), type: 'number' },
    { label: '6', action: () => handleNumber('6'), type: 'number' },
    { label: '-', action: () => handleOperator('-'), type: 'operator' },
    { label: '1', action: () => handleNumber('1'), type: 'number' },
    { label: '2', action: () => handleNumber('2'), type: 'number' },
    { label: '3', action: () => handleNumber('3'), type: 'number' },
    { label: '+', action: () => handleOperator('+'), type: 'operator' },
    { label: '0', action: () => handleNumber('0'), type: 'number', wide: true },
    { label: '.', action: handleDecimal, type: 'number' },
    { label: '=', action: calculate, type: 'operator' },
  ];

  return (
    <div className="h-full bg-[#0a0a0a] p-6 flex flex-col">
      <div className="flex-1 flex flex-col justify-end p-4 mb-4 bg-white/5 rounded-2xl text-right overflow-hidden">
        <p className="text-gray-500 text-xs mb-1 truncate h-4">{equation}</p>
        <h3 className="text-4xl font-mono font-bold text-white truncate">{display}</h3>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all 
              ${btn.type === 'operator' ? 'bg-blue-600 text-white hover:bg-blue-500' : 
                btn.type === 'function' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 
                'bg-white/5 text-gray-300 hover:bg-white/10'} 
              ${btn.wide ? 'col-span-2 aspect-auto' : ''}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
