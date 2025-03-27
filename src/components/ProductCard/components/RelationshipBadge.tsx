import React from 'react';
import { GitBranch } from 'lucide-react';
import { Link2 } from 'lucide-react';
import { useCardRelationshipStore } from '@/store/cardRelationshipStore';

interface RelationshipBadgeProps {
  productId: string;
  className?: string;
}
  
export const RelationshipBadge: React.FC<RelationshipBadgeProps> = ({ 
  productId,
  className = ''
}) => {
  const getParentCard = useCardRelationshipStore(state => state.getParentCard);
  const getChildCards = useCardRelationshipStore(state => state.getChildCards);

  const parentId = getParentCard(productId);

  if (!parentId) return null;
  const childIds = getChildCards(productId);

  if (!parentId && childIds.length === 0) return null;

  return (
    <div className={`px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm flex items-center gap-1 ${className}`}>
      <Link2 size={14} className="text-purple-600" />
      <span className="text-xs font-medium text-purple-700">
        Linked Card
      </span>
    <div 
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${parentId ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'} ${className}`}
    >
      <GitBranch className="w-3 h-3" />
      {parentId ? (
        <span>Carte fille</span>
      ) : (
        <span>{childIds.length} copie{childIds.length > 1 ? 's' : ''}</span>
      )}
    </div>
    </div>
  );
}