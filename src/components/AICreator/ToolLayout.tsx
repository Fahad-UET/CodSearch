import React, { useState } from 'react';
import { History, Video, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBackground } from '@/store/background';
import HistoryTabs from './HistoryTabs';
import type { HistoryItem } from '@/store/history';

interface ToolLayoutProps {
  title: string;
  description: string;
  controls: React.ReactNode;
  result: React.ReactNode;
  history?: React.ReactNode;
  onHistoryItemClick?: (item: HistoryItem) => void;
  setPrompt?: (prompt: string) => void;
}

function ToolLayout({
  title,
  description,
  controls,
  result,
  history,
  onHistoryItemClick,
  setPrompt
}: ToolLayoutProps) {
  // Determine the default tab based on the current route
  const location = useLocation();
  const { tasks } = useBackground();
  const pendingTask = tasks.find(task => task.status === 'pending');

  const getDefaultTab = () => { 
    const videoRoutes = [
      '/video',
      '/veo2',
      '/lipsync',
      '/video-watermark-remover',
      '/video-to-audio',
      '/face-swap',
      '/outfits-video',
      '/product-video',
      '/video-upscaler',
    ];
    const imageRoutes = [
      '/text-to-image',
      '/image',
      '/image-watermark-remover',
      '/change-image-background',
      '/remove-image-background',
      '/image-to-text',
      '/outfits-image',
      '/product-image',
      '/image-upscaler',
    ];
    const audioRoutes = ['/text-to-speech', '/video-to-audio'];
    const textRoutes = ['/text', '/transcribe', '/text-to-speech', '/prompt'];
    if (videoRoutes.includes(location.pathname)) return 'video';
    if (imageRoutes.includes(location.pathname)) return 'image';
    if (audioRoutes.includes(location.pathname)) return 'audio';
    if (textRoutes.includes(location.pathname)) return 'text';
    return 'image';
  };

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        {pendingTask && (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A2A7A] via-[#7A4AAA] to-[#9A6ACA] animate-[progress_2s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_linear_infinite]" />
          </div>
        )}
        {!pendingTask && tasks.length > 0 && tasks[0].status === 'completed' && (
          <div className="w-full h-full bg-gradient-to-r from-[#4A2A7A] via-[#7A4AAA] to-[#9A6ACA] animate-fade-in" />
        )}
      </div>
      <div className="grid grid-cols-12 gap-2 min-h-[calc(100vh-8rem)] relative z-10">
        {/* Left Column - Controls */}
        <div className="col-span-4 bg-gradient-to-br from-white/[0.08] to-white/[0.05] backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_0_30px_-10px_rgba(154,106,202,0.3)] p-6 overflow-y-auto sticky top-6 transform-style-3d hover:translate-z-12 transition-transform duration-300">
          {controls}
        </div>

        {/* Middle Column - Results */}
        <div className="col-span-5 bg-gradient-to-br from-white/[0.08] to-white/[0.05] backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_0_30px_-10px_rgba(154,106,202,0.3)] p-6 transform-style-3d hover:translate-z-12 transition-transform duration-300">
          <div className="space-y-6">
            <header className="text-center">
              <h1 className="text-2xl font-semibold mb-3">{title}</h1>
              <p className="text-gray-400 text-sm">{description}</p>
            </header>
            <hr className="border-white/10" />
            {result}
          </div>
        </div>

        {/* Right Column - History */}
        <div className="col-span-3">
          <div className="sidebar bg-gradient-to-br from-white/[0.08] to-white/[0.05] backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_0_30px_-10px_rgba(154,106,202,0.3)] p-2 sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto transform-style-3d hover:translate-z-12 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <History className="w-5 h-5" />
                History
              </h2>
            </div>
            {history ? (
              <div className="animate-fade-in">{history}</div>
            ) : (
              <HistoryTabs onItemClick={onHistoryItemClick} defaultTab={getDefaultTab()} setPrompt={setPrompt} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolLayout;
