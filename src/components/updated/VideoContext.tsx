import React, { createContext, useContext, useState } from 'react';
import { Video } from '../../types';

const STORAGE_KEY = 'tutorial_videos';

const getStoredVideos = (): Video[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialVideos;
  } catch (error) {
    console.error('Error loading videos from storage:', error);
    return initialVideos;
  }
};

const storeVideos = (videos: Video[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (error) {
    console.error('Error saving videos to storage:', error);
  }
};

interface VideoContextType {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};

const initialVideos: Video[] = [
  {
    id: '1',
    title: 'Tutoriel 1 - Créer une extension Chrome - Manifest V2',
    videoId: 'CZsCg48ouYQ',
    order: 0,
  },
  {
    id: '2',
    title: 'Tutoriel 2 - Créer une extension Chrome - Manifest V2',
    videoId: 'YBIigdoPpLc',
    order: 1,
  },
];

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideosState] = useState<Video[]>(getStoredVideos());

  const setVideos = (newVideos: Video[]) => {
    setVideosState(newVideos);
    storeVideos(newVideos);
  };

  return <VideoContext.Provider value={{ videos, setVideos }}>{children}</VideoContext.Provider>;
};
