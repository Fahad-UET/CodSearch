import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  className?: string;
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {React.cloneElement(children, {
        className: `${children.props.className || ''} cursor-help`
      })}
      
      {show && (
        <div className={`
          absolute z-50 w-72 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-xl
          transform -translate-x-1/2 -translate-y-full left-1/2 top-0 mt-1
          animate-in fade-in zoom-in-95 duration-100
          ${className}
        `}>
          <div className="relative">
            {content}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="border-8 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}