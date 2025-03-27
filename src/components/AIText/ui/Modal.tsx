import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'default' | 'large' | 'full';
}

export default function Modal({ isOpen, onClose, children, title, size = 'default' }: Props) {
  if (!isOpen) return null;

  const sizeClasses = {
    default: 'max-w-2xl',
    large: 'max-w-[80%]',
    full: 'w-[90%] h-[90%] rounded-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center pointer-events-none">
        <div className={`relative bg-white shadow-2xl ${sizeClasses[size]} w-full overflow-hidden`}>
          {title && (
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="pointer-events-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
