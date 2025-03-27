import React from 'react';

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'secondary';
  className?: string;
}

export function CalculatorButton({ 
  children, 
  onClick, 
  variant = 'default',
  className = ''
}: CalculatorButtonProps) {
  const baseClasses = 'h-14 md:h-16 font-medium rounded-xl transition-all hover:scale-[0.98] active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg flex items-center justify-center w-full';
  
  const variantClasses = {
    default: 'bg-white hover:bg-gray-50 text-gray-900 hover:shadow text-xl',
    operator: 'bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:shadow-xl text-xl font-semibold',
    secondary: 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:shadow text-xl'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}