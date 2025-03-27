import React from 'react';
import { Download, Pause, Play } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  fileName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, fileName }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      <button
        onClick={togglePlay}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1">
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="w-full"
          controls
        />
      </div>

      <button
        onClick={handleDownload}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Download audio"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};