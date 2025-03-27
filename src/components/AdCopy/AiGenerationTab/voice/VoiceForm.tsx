import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
}

interface VoiceFormProps {
  onAdd: (voice: Voice) => void;
}

export const VoiceForm: React.FC<VoiceFormProps> = ({ onAdd }) => {
  const [voiceId, setVoiceId] = useState('');
  const [voiceName, setVoiceName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (voiceId && voiceName) {
      onAdd({ id: voiceId, name: voiceName });
      setVoiceId('');
      setVoiceName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Voice ID
        </label>
        <input
          type="text"
          value={voiceId}
          onChange={e => setVoiceId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter voice ID"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Voice Name
        </label>
        <input
          type="text"
          value={voiceName}
          onChange={e => setVoiceName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter voice name"
          required
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Voice
      </button>
    </form>
  );
};