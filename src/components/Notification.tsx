import React, { useState, useEffect } from 'react';
import { Code2, Copy, Check, Save, Edit, X } from 'lucide-react';
import { storePromptCategories, updatePromptCategories } from '@/services/firebase/Prompt';

interface Prompt {
  id: string;
  content: string;
  category: string;
  name: string;
  lastModified: Date;
}
interface PromptCategory {
  description: string;
  prompts: Record<string, string>;
}

interface Props {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  setNotification: () => void;
}

export default function Notification({ show, type, message, setNotification }: Props) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setNotification();
      }, 3000);
      //  Cleanup function
      return () => clearTimeout(timer);
    }
  }, [show]);
  return (
    show && (
      <div
        className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg border transition-all transform duration-300 ${
          type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}
      >
        <div className="flex items-center gap-2">
          {type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {message}
        </div>
      </div>
    )
  );
}
