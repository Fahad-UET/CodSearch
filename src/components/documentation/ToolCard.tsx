import React from 'react';
import { ChevronRight, Clock, BookOpen, CheckCircle } from 'lucide-react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onClick: () => void;
}

export default function ToolCard({
  id,
  title,
  description,
  category,
  readTime,
  isCompleted,
  onToggleComplete,
  onClick,
}: ToolCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(id);
                }}
                className="ml-3 text-gray-400 hover:text-primary-500 transition"
              >
                <CheckCircle 
                  className={`h-5 w-5 ${isCompleted ? 'text-primary-500 fill-current' : ''}`}
                />
              </button>
            </div>
            <span className="inline-block px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full mt-2">
              {category}
            </span>
          </div>
        </div>

        <p className="mt-3 text-gray-600 text-sm">{description}</p>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onClick}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Voir le guide
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{readTime} min</span>
            </div>
            <div className="flex items-center text-gray-500">
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="text-sm">Guide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}