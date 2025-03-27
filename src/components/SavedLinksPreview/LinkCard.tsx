import React from 'react';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { SavedLink } from './types';

export const LinkCard = ({ link }: { link: SavedLink }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <LinkIcon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-gray-900 truncate">
          {link.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 truncate">
          {new URL(link.url).hostname}
        </p>
      </div>
      {link.category && (
        <span className="flex-shrink-0 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
          {link.category}
        </span>
      )}
    </div>
    <div className="mt-2 flex items-center justify-between text-sm">
      <time className="text-gray-500" dateTime={link.createdAt.toISOString()}>
        {formatDistanceToNow(link.createdAt, { locale: fr, addSuffix: true })}
      </time>
      <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
      >
        Visiter
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  </div>
);