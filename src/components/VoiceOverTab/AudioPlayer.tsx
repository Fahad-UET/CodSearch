import React from 'react';
import { Download } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  onDownload?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onDownload }) => {
  if (!audioUrl) return null;

  return (
    <div className="space-y-4">
      <audio controls className="w-full">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Download size={16} />
        Download MP3
      </button>
    </div>
  );
};