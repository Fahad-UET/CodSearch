import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import { LinkCard } from './LinkCard';
import type { SavedLink } from './types';

export const SavedLinksPreview: React.FC<SavedLink> = ({ links }: any) => {
  return (
    <div className="saved-links-grid">
      {links.map(link => (
        <LinkCard
          key={link.id}
          link={link}
        />
      ))}
    </div>
  );
};