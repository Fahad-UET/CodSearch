import { create } from 'zustand';

// Define the store type
interface VideoStore {
  currentVideo: HTMLVideoElement | null;
  setCurrentVideo: (video: HTMLVideoElement | null) => void;
}

// Create the Zustand store
export const useVideoStore = create<VideoStore>(set => ({
  currentVideo: null,
  setCurrentVideo: (video: HTMLVideoElement | null) =>
    set(state => {
      if (state.currentVideo && state.currentVideo !== video) {
        state.currentVideo.pause(); // Pause the previous video if it's not the same
      }
      return { currentVideo: video };
    }),
}));
