import React from 'react';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  className?: string;
}

export function CurrencyInput({ value, onChange, currency, className = '' }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="0.00"
      className={className}
      aria-label={`Amount in ${currency}`}
    />
  );
}