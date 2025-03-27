import React from 'react';
import { Link2 } from 'lucide-react';

interface RelationshipBadgeProps {
  type: 'parent' | 'child';
  syncedFields: string[];
}

export function RelationshipBadge({ type, syncedFields }: RelationshipBadgeProps) {
  return (
    <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
      <Link2 
        size={14} 
        className={type === 'parent' ? 'text-purple-600' : 'text-blue-600'} 
      />
      <span className={`text-xs font-medium ${type === 'parent' ? 'text-purple-700' : 'text-blue-700'}`}>
        {type === 'parent' ? 'Parent Card' : 'Child Card'}
      </span>
      <div className="text-xs text-gray-500">
        ({syncedFields.length} synced)
      </div>
    </div>
  );
}