import React from 'react';
// to resolve build issue please check this
// import { AdCopyVariant } from './index';
import {AdCopyVariant}  from '@/types';

interface AdCopyPreviewProps {
  variant: AdCopyVariant | null;
}

export function AdCopyPreview({ variant }: AdCopyPreviewProps) {
  if (!variant) {
    return (
      <div className="bg-white rounded-xl border border-purple-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Preview</h3>
        <div className="text-center py-12 text-gray-500">
          Generate ad copy to see a preview
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-purple-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Preview</h3>

      <div className="space-y-6">
        {/* Platform & Tone */}
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm">
            {variant.platform}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm capitalize">
            {variant.tone}
          </span>
        </div>

        {/* Ad Content */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Headline</h4>
            <p className="text-lg font-semibold text-gray-900">{variant.headline}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p className="text-gray-700">{variant.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Call to Action</h4>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              {variant.callToAction}
            </button>
          </div>
        </div>

        {/* Created At */}
        <div className="text-sm text-gray-500">
          Created {variant.createdAt.toLocaleString()}
        </div>
      </div>
    </div>
  );
}