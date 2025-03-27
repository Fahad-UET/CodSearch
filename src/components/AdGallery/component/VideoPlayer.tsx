import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { useVideoStore } from '../../../store/videoStore';

interface Props {
  src: string;
  poster?: string;
  onError: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

export default function VideoPlayer({ src, poster, onError }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCurrentVideo } = useVideoStore();

  React.useEffect(() => {
    if (!videoRef.current) return;

    const handlePlay = () => {
      videoRef.current.muted = false;
      setIsPlaying(true);
      setCurrentVideo(videoRef.current);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setCurrentVideo(null);
    };

    videoRef.current.addEventListener('play', handlePlay);
    videoRef.current.addEventListener('pause', handlePause);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', handlePlay);
        videoRef.current.removeEventListener('pause', handlePause);
      }
    };
  }, [setCurrentVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };
  return (
    <div
      className={`relative w-full h-full ${
        isPlaying ? 'ring-4 ring-[#5D1C83]/50 shadow-2xl scale-[1.02] z-10' : ''
      } transition-all duration-300`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        muted
        loop
        className="w-full h-full object-cover bg-gray-100"
        onError={onError}
        onEnded={() => setIsPlaying(false)}
      />

      <div
        className={`absolute inset-0 flex items-center justify-center ${
          isPlaying ? 'opacity-0 hover:opacity-100' : 'group-hover:opacity-100 opacity-0'
        } transition-opacity duration-300`}
      >
        <button
          onClick={togglePlay}
          className="p-6 bg-black/40 hover:bg-[#5D1C83]/75 rounded-full transform hover:scale-110 transition-all duration-300 shadow-xl backdrop-blur-sm"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
