import React, { useState } from 'react';

interface ThumbnailImageProps {
  videoId: string;
  title: string;
}

const ThumbnailImage: React.FC<ThumbnailImageProps> = ({ videoId, title }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Try different thumbnail qualities
  const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];

  const [qualityIndex, setQualityIndex] = useState(0);

  const handleError = () => {
    if (qualityIndex < qualities.length - 1) {
      setQualityIndex(prev => prev + 1);
    } else {
      setError(true);
    }
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  if (error) {
    return (
      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
        <span className="text-white/60">Thumbnail unavailable</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`absolute inset-0 bg-slate-800 ${
          loaded ? 'hidden' : 'flex items-center justify-center'
        }`}
      >
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 mix-blend-overlay pointer-events-none" />
      <img
        src={`https://img.youtube.com/vi/${videoId}/${qualities[qualityIndex]}.jpg`}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } 
          filter brightness-[0.9] contrast-[1.1]`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
};

export default ThumbnailImage;
