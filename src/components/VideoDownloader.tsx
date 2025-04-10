import React, { useState } from 'react';
import { Download, AlertCircle, Link, FileVideo } from 'lucide-react';
import { downloadVideo, DownloadResponse } from '../services/videoDownloader';

interface VideoDownloaderProps {
  onError: (message: string) => void;
}

export function VideoDownloader({ onError }: VideoDownloaderProps) {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<DownloadResponse['data'] | null>(null);

  const handleDownload = async () => {
    if (!downloadUrl.trim()) {
      onError('Please enter a video URL');
      return;
    }

    setIsLoading(true);
    setDownloadInfo(null);
    try {
      const result = await downloadVideo(downloadUrl);
      if (result.data) {
        setDownloadInfo(result.data);
        
        // Create a temporary anchor element for download
        const link = document.createElement('a');
        link.href = result.data.url;
        link.download = `${result.data.title || `video-${Date.now()}`}${result.data.quality ? `-${result.data.quality}` : ''}.mp4`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clear input after successful download
        setDownloadUrl('');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to download video');
      setDownloadInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <FileVideo size={20} className="text-purple-600" />
        <h3 className="text-sm font-semibold text-purple-900">Video Downloader</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Link size={16} className="text-purple-400" />
            </div>
            <input
              type="url"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="Enter video URL to download"
              className="w-full pl-10 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download size={20} />
            )}
            Download
          </button>
        </div>

        {downloadInfo && (
          <div className="text-sm bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileVideo size={20} className="text-purple-600" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="font-medium text-purple-900">{downloadInfo.title}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {downloadInfo.quality && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                      {downloadInfo.quality}
                    </span>
                  )}
                  {downloadInfo.size && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                      {downloadInfo.size}
                    </span>
                  )}
                  {downloadInfo.duration && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                      {downloadInfo.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}