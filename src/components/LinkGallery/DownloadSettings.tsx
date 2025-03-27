import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw } from 'lucide-react';

interface DownloadService {
  category: string;
  url: string;
}

const DEFAULT_DOWNLOAD_SERVICES = [
  {
    category: 'snapchat',
    url: 'https://socialmediafetch.com/?url={url}',
  },
  {
    category: 'tiktok',
    url: 'https://snaptik.app/fr2?url={url}',
  },
  {
    category: 'youtube',
    url: 'https://notube.lol/fr/youtube-app-46?url={url}',
  },
  {
    category: 'shorts',
    url: 'https://notube.lol/fr/youtube-app-46?url={url}',
  },
  {
    category: 'facebook',
    url: 'https://fdown.net/fr/index.php?url={url}',
  },
  {
    category: 'other',
    url: 'https://notube.lol/fr/youtube-app-46?url={url}',
  },
];

interface DownloadSettingsProps {
  services: DownloadService[];
  onSave: (services: DownloadService[]) => void;
  onClose: () => void;
}

export function DownloadSettings({ services, onSave, onClose }: DownloadSettingsProps) {
  const [localServices, setLocalServices] = useState<DownloadService[]>(services);
  const [newService, setNewService] = useState<DownloadService>({
    category: 'all',
    url: '',
  });

  const platforms = [
    { value: 'all', label: 'All Links' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'shorts', label: 'YouTube Shorts' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'vimeo', label: 'Vimeo' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'dailymotion', label: 'Dailymotion' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'soundcloud', label: 'SoundCloud' },
    { value: 'spotify', label: 'Spotify' },
    { value: 'other', label: 'Other Links' },
  ];

  const handleAddService = () => {
    if (!newService.url.trim()) return;

    setLocalServices(prev => [...prev, { ...newService }]);
    setNewService({ category: 'all', url: '' });
  };

  const handleRemoveService = (index: number) => {
    setLocalServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localServices);
    onClose();
  };

  const handleResetToDefaults = () => {
    setLocalServices(DEFAULT_DOWNLOAD_SERVICES);
  };

  return (
    <div className="fixed  inset-0 bg-black/50 flex items-center justify-center p-4 z-[3453535354353]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Download Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Service */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Add Download Service</h3>
              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
                Reset to Defaults
              </button>
            </div>
            <div className="flex gap-3">
              <select
                value={newService.category}
                onChange={e => setNewService(prev => ({ ...prev, category: e.target.value }))}
                className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              >
                {platforms.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={newService.url}
                onChange={e => setNewService(prev => ({ ...prev, url: e.target.value }))}
                placeholder="Enter download service URL"
                className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Current Services</h3>
            {localServices.length > 0 ? (
              <div className="space-y-3">
                {localServices.map((service, index) => (
                  <div
                    key={`${service.category}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {platforms.find(p => p.value === service.category)?.label ||
                          service.category}
                      </p>
                      <p className="text-sm text-gray-500 break-all">{service.url}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveService(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No download services configured yet.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
