import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onAddImage: () => void;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  error: string | null;
}

export function ImageUploader({
  onAddImage,
  newImageUrl,
  setNewImageUrl,
  error
}: ImageUploaderProps) {
  return (
    <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
      <div className="flex gap-2">
        <input
          type="url"
          value={newImageUrl}
          onChange={e => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200"
        />
        <button
          onClick={onAddImage}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Image
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
    </div>
  );
}