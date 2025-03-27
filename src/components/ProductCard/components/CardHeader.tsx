import React from 'react';
import { useLanguageStore } from '../../../store/languageStore';

interface CardHeaderProps {
  category: string;
  icon: React.ElementType;
  title: string;
}

export function CardHeader({ category, icon: Icon, title }: CardHeaderProps) {
  const { t } = useLanguageStore();
  
  return (
    <div className="absolute top-2 left-2 z-20 flex items-center gap-2 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
      <Icon size={14} className="flex-shrink-0" />
      <span className="text-xs font-medium">
        {t(category?.toLowerCase() || 'productSeller')}
      </span>
      <span className="text-xs text-gray-600 truncate max-w-[120px]">
        {title}
      </span>
    </div>
  );
}