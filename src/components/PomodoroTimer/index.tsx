import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Focus } from 'lucide-react';
// import { useVideos } from '../context/VideoContext';

const STORAGE_KEY = 'pomodoroTimer';
const NOTIFICATION_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  startTime: number;
}

const getStoredState = (): PomodoroState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const state: PomodoroState = JSON.parse(stored);
    const now = Date.now();
    const elapsed = Math.floor((now - state.startTime) / 1000);

    if (state.isRunning && elapsed > 0) {
      state.timeLeft = Math.max(0, state.timeLeft - elapsed);
      if (state.timeLeft === 0) {
        state.isRunning = false;
      }
    }

    return state;
  } catch (error) {
    console.error('Error loading pomodoro state:', error);
    return null;
  }
};

const saveState = (state: PomodoroState) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        startTime: Date.now(),
      })
    );
  } catch (error) {
    console.error('Error saving pomodoro state:', error);
  }
};

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const stored = getStoredState();
    return stored?.timeLeft ?? 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(() => {
    const stored = getStoredState();
    return stored?.isRunning ?? false;
  });
  const [audio] = useState(new Audio(NOTIFICATION_SOUND));
  // const { setIsTransitioning } = useVideos();

  // Listen for storage changes to update timer state
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newState = JSON.parse(e.newValue);
        setTimeLeft(newState.timeLeft);
        setIsRunning(newState.isRunning);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    let intervalId: number;

    if (isRunning && timeLeft > 0) {
      const startTime = Date.now();

      // Start focus mode transition when 15 seconds remain
      if (timeLeft === 15) {
        // setIsTransitioning(true);
      }

      intervalId = window.setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);

        setTimeLeft(prevTime => {
          const newTime = Math.max(0, prevTime - elapsed);
          if (newTime === 0) {
            setIsRunning(false);
            audio.play().catch(console.error);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => window.clearInterval(intervalId);
  }, [isRunning, timeLeft, audio]);

  // Save state whenever it changes
  useEffect(() => {
    saveState({ timeLeft, isRunning, startTime: Date.now() });
  }, [timeLeft, isRunning]);

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const resetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
    const newTime = 25 * 60; // 25 minutes
    setTimeLeft(newTime);
    saveState({ timeLeft: newTime, isRunning: false, startTime: Date.now() });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
      <Focus size={14} className="text-purple-400" />
      <span className="text-purple-400 font-medium text-sm tabular-nums">
        {formatTime(timeLeft)}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTimer}
          className="p-0.5 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={resetTimer}
          className="p-0.5 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
          title="Reset Timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
