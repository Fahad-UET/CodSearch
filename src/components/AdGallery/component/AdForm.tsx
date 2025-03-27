import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { AdFormData } from '../../../types';
import { useProductStore } from '../../../store';

interface Props {
  onSubmit: (data: AdFormData) => void;
  error: string | null;
}

export default function AdForm({ onSubmit, error }: Props) {
  const [formData, setFormData] = useState<AdFormData>({
    url: '',
    platform: 'direct',
    rating: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!error) {
      setFormData({ ...formData, url: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Ad URL
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
            placeholder="https://"
            required
          />
          <select
            id="platform"
            value={formData.platform}
            onChange={e => setFormData({ ...formData, platform: e.target.value as any })}
            className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          >
            <option value="media">Photo/GIF</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook Ads</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-2 bg-[#5D1C83] text-white rounded-md hover:bg-[#6D2C93] focus:outline-none focus:ring-2 focus:ring-[#5D1C83] focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </button>
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    </form>
  );
}
