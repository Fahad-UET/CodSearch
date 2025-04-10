import React from 'react';
import { Upload, Image as ImageIcon, Loader2, Download, X, Plus, Clock, Video, Maximize2 } from 'lucide-react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import LoadingAnimation from '../components/AICreator/LoadingAnimation';
import ToolLayout from '../components/AICreator/ToolLayout';
import { useHistory } from '../store/history';

interface FrameExtraction {
  id: string;
  timestamp: string;
  outputUrl?: string;
}

const ffmpeg = createFFmpeg({ 
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
});

function VideoToFrames() {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [frames, setFrames] = React.useState<string[]>([]);
  const [interval, setInterval] = React.useState(5);
  const [progress, setProgress] = React.useState<string>('');
  const [startTime, setStartTime] = React.useState('00:00');
  const [endTime, setEndTime] = React.useState('');
  const [percentage, setPercentage] = React.useState(0);
  const [extractionMode, setExtractionMode] = React.useState<'interval' | 'specific'>('specific');
  const [frameExtractions, setFrameExtractions] = React.useState<FrameExtraction[]>([
    // Start with no timestamps
  ]);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [showTimestamps, setShowTimestamps] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState('00:00');
  const [videoLoaded, setVideoLoaded] = React.useState(false);

  // Convert seconds to mm:ss format
  const secondsToTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const videoPlayerRef = React.useRef<HTMLVideoElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addItem } = useHistory();

  // Format time input (mm:ss)
  const formatTimeInput = (value: string): string => {
    // Remove non-digit characters except colon and period
    const digits = value.replace(/[^\d:.]/g, '');
    
    // Handle empty input
    if (!digits) return '';
    
    // Split on colon and period
    const [timeStr, msStr = '000'] = digits.split('.');
    const parts = timeStr.split(':');
    let minutes, seconds, milliseconds;
    
    if (parts.length > 1) {
      // User entered with colon
      minutes = Math.min(59, parseInt(parts[0]) || 0);
      seconds = Math.min(59, parseInt(parts[1]) || 0);
    } else {
      minutes = Math.floor(parseInt(timeStr) / 100);
      seconds = parseInt(timeStr) % 100;
      if (seconds >= 60) seconds = 59;
    }
    milliseconds = Math.min(999, parseInt(msStr) || 0);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 100 * 1024 * 1024; // 100MB max
      if (file.size > maxSize) {
        setError('File size must be less than 100MB. Please compress your video or use a smaller file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoUrl(reader.result as string);
        setIsBase64(true);
        setError(null);
        setShowVideoModal(true);
        setVideoLoaded(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setIsBase64(false);
    setError(null);
    setShowVideoModal(true);
    setVideoLoaded(false);
  };

  const handleTimeClick = () => {
    if (videoPlayerRef.current) {
      const currentTime = videoPlayerRef.current.currentTime;
      const formattedTime = secondsToTime(currentTime);
      
      // Add new timestamp to segments
      setFrameExtractions(prev => [
        ...prev,
        { id: crypto.randomUUID(), timestamp: formattedTime }
      ]);
      setShowTimestamps(true);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // Allow direct input without immediate formatting
    const value = e.target.value.replace(/[^\d:]/g, '');
    
    setFrameExtractions(prev => prev.map((ext, i) => 
      i === index ? { ...ext, timestamp: value } : ext
    ));
  };

  // Format time when input loses focus
  const handleTimeBlur = (index: number) => {
    setFrameExtractions(prev => prev.map((ext, i) => 
      i === index ? { ...ext, timestamp: formatTimeInput(ext.timestamp) } : ext
    ));
  };

  const extractFrames = async () => {
    try {
      setLoading(true);
      // Load FFmpeg
      if (!ffmpeg.isLoaded()) {
        setProgress('Loading FFmpeg...');
        setPercentage(10);
        await ffmpeg.load();
      }

      setProgress('Processing video...');
      setPercentage(20);

      // Handle input file
      let inputData;
      if (isBase64) {
        const response = await fetch(videoUrl);
        const buffer = await response.arrayBuffer();
        inputData = new Uint8Array(buffer);
      } else {
        const response = await fetch(videoUrl);
        const buffer = await response.arrayBuffer();
        inputData = new Uint8Array(buffer);
      }

      // Write input file
      ffmpeg.FS('writeFile', 'input.mp4', inputData);
      setPercentage(40);

      // Extract frames using FFmpeg
      setProgress('Extracting frames...');
      await ffmpeg.run(
        '-i', 'input.mp4',
        '-vf', `fps=1/${interval}`,
        '-frame_pts', '1',
        '-f', 'image2',
        'frame-%d.jpg'
      );
      setPercentage(80);

      // Read output files
      const files = ffmpeg.FS('readdir', '/');
      const frameFiles = files.filter(file => file.startsWith('frame-'));
      const frameUrls = await Promise.all(
        frameFiles.map(async (file) => {
          const data = ffmpeg.FS('readFile', file);
          const blob = new Blob([new Uint8Array(data.buffer)], { type: 'image/jpeg' });
          return URL.createObjectURL(blob);
        })
      );

      // Clean up files
      ffmpeg.FS('unlink', 'input.mp4');
      frameFiles.forEach(file => {
        ffmpeg.FS('unlink', file);
      });

      setFrames(frameUrls);
      setPercentage(100);

      // Only store the first 4 frames in history to avoid storage quota issues
      frameUrls.slice(0, 4).forEach(url => {
        addItem({
            type: 'image',
            content: {
                imageUrl: url,
                sourceVideo: videoUrl,
                details: `Frame from video (${frames.length} total frames extracted)`
            },
            timestamp: Date.now(),
            id: ''
        });
      });

    } catch (err) {
      console.error('FFmpeg error:', err);
      let errorMessage = err instanceof Error ? err.message : String(err);
      
      // Handle storage quota error specifically
      if (errorMessage.includes('exceeded the quota') || errorMessage.includes('storage full')) {
        errorMessage = 'Storage quota exceeded. Try extracting fewer frames or downloading them directly.';
      }
      
      setError('Failed to extract frames: ' + errorMessage);
    } finally {
      setLoading(false);
      setProgress('');
      setPercentage(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFrames([]);
    
    if (extractionMode === 'interval') {
      await extractFrames();
    } else {
      await extractSpecificFrames();
    }
  };

  const extractSpecificFrames = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!ffmpeg.isLoaded()) {
        setProgress('Loading FFmpeg...');
        setPercentage(10);
        await ffmpeg.load();
      }

      setProgress('Processing video...');
      setPercentage(20);

      let inputData;
      if (isBase64) {
        const response = await fetch(videoUrl);
        inputData = new Uint8Array(await response.arrayBuffer());
      } else {
        const response = await fetch(videoUrl);
        inputData = new Uint8Array(await response.arrayBuffer());
      }

      // Write input file
      ffmpeg.FS('writeFile', 'input.mp4', inputData);
      setPercentage(40);

      const frameUrls: string[] = [];
      const totalExtractions = frameExtractions.length;

      // Extract each specific frame
      for (let i = 0; i < frameExtractions.length; i++) {
        const extraction = frameExtractions[i];
        setProgress(`Extracting frame ${i + 1} of ${totalExtractions}...`);

        // Parse timestamp
        let totalSeconds: number;
        if (extraction.timestamp.includes('.')) {
          // Format: mm:ss.xxx
          const [timeStr, msStr = '000'] = extraction.timestamp.split('.');
          const [minutes, seconds] = timeStr.split(':').map(Number);
          const milliseconds = parseInt(msStr.padEnd(3, '0'));
          totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
        } else {
          // Format: mm:ss
          const [minutes, seconds] = extraction.timestamp.split(':').map(Number);
          totalSeconds = minutes * 60 + seconds;
        }

        // Verify video duration
        const video = document.createElement('video');
        video.src = videoUrl;
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = resolve;
          video.onerror = reject;
        });
        
        if (totalSeconds > video.duration) {
          throw new Error(`Timestamp ${extraction.timestamp} is beyond video duration (${secondsToTime(video.duration)})`);
        }

        // Extract frame with precise timing
        await ffmpeg.run(
          '-accurate_seek',
          '-ss', totalSeconds.toFixed(3),
          '-i', 'input.mp4',
          '-frames:v', '1',
          '-q:v', '2',
          '-avoid_negative_ts', '1',
          '-update', '1',
          '-vsync', '0',
          '-frames:v', '1',
          `frame-${i}.jpg`
        );

        // Verify file exists before reading
        const files = ffmpeg.FS('readdir', '/');
        const filename = `frame-${i}.jpg`;
        if (!files.includes(filename)) {
          throw new Error(`Failed to extract frame at ${extraction.timestamp}. Please verify the timestamp and try again.`);
        }

        // Read the output file
        const data = ffmpeg.FS('readFile', filename);
        const blob = new Blob([new Uint8Array(data.buffer)], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        frameUrls.push(url);

        // Update extraction with URL
        setFrameExtractions(prev => prev.map((ext, index) => 
          index === i ? { ...ext, outputUrl: url } : ext
        ));

        // Clean up frame file if it exists
        try {
          ffmpeg.FS('unlink', filename);
        } catch (err) {
          console.warn(`Failed to clean up ${filename}:`, err);
        }

        setPercentage(40 + ((i + 1) / totalExtractions) * 60);
      }

      // Clean up input file
      ffmpeg.FS('unlink', 'input.mp4');

      setFrames(frameUrls);
      setPercentage(100);

      // Add to history (first 4 frames)
      frameUrls.slice(0, 4).forEach((url, index) => {
        addItem({
            type: 'image',
            content: {
                imageUrl: url,
                sourceVideo: videoUrl,
                details: `Frame at ${frameExtractions[index].timestamp}`
            },
            timestamp: Date.now(),
            id: ''
        });
      });

    } catch (err) {
      console.error('FFmpeg error:', err);
      setError('Failed to extract frames: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
      setProgress('');
      setPercentage(0);
    }
  };

  const addFrameExtraction = () => {
    setFrameExtractions(prev => [
      ...prev,
      { id: crypto.randomUUID(), timestamp: '00:00' }
    ]);
  };

  const removeFrameExtraction = (id: string) => {
    setFrameExtractions(prev => prev.filter(ext => ext.id !== id));
  };

  const updateFrameExtraction = (id: string, timestamp: string) => {
    setFrameExtractions(prev => prev.map(ext =>
      ext.id === id ? { ...ext, timestamp: formatTimeInput(timestamp) } : ext
    ));
  };

  const downloadAllFrames = () => {
    frames.forEach((url, index) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `frame-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const VideoPreviewModal = () => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full max-w-7xl mx-auto p-4">
        <button
          onClick={() => setShowVideoModal(false)}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="relative aspect-video bg-black/20 rounded-lg overflow-hidden">
          <video
            ref={videoPlayerRef}
            src={videoUrl}
            className="w-full h-full bg-black object-contain"
            controls
            preload="auto"
            controlsList="nodownload"
            playsInline
            onLoadedData={(e) => {
              const video = e.currentTarget;
              setVideoLoaded(true);
              setCurrentTime(secondsToTime(0));
              video.currentTime = 0;
            }}
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              if (video.duration === Infinity) {
                video.currentTime = 1e101;
                video.currentTime = 0;
              }
            }}
            onError={(e) => {
              console.error('Video error:', e);
              setError('Failed to load video. Please check the URL or file format.');
              setShowVideoModal(false);
            }}
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.duration && !isNaN(video.duration)) {
                setCurrentTime(secondsToTime(video.currentTime));
              }
            }}
          />
          {videoLoaded && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white/90 font-mono text-sm">
            {currentTime}
          </div>
          )}
          {videoLoaded && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleTimeClick}
              className="px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Time ({currentTime})
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Extract Frames"
      description="Extract frames from video files at specified intervals"
      modelId="fal-ai/sync-lipsync/video-to-images"
      controls={<>
        {/* Video Preview */}
        {videoUrl && !loading && (
          <div className="mb-6 bg-black rounded-xl overflow-hidden">
            <div className="relative aspect-video">
              <video
                ref={videoPlayerRef}
                src={videoUrl}
                className="w-full h-full bg-black object-contain"
                controls
                preload="auto"
                controlsList="nodownload"
                playsInline
                onLoadedData={(e) => {
                  const video = e.currentTarget;
                  setVideoLoaded(true);
                  setCurrentTime(secondsToTime(0));
                  video.currentTime = 0;
                }}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  if (video.duration === Infinity) {
                    video.currentTime = 1e101;
                    video.currentTime = 0;
                  }
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                  setError('Failed to load video. Please check the URL or file format.');
                }}
                onTimeUpdate={(e) => {
                  const video = e.currentTarget;
                  if (video.duration && !isNaN(video.duration)) {
                    setCurrentTime(secondsToTime(video.currentTime));
                  }
                }}
              />
              {videoLoaded && (
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white/90 font-mono text-sm">
                  {currentTime}
                </div>
              )}
            </div>
            {videoLoaded && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleTimeClick}
                className="px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Time ({currentTime})
              </button>
            </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-medium">
              Video File or URL
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="videoUrl"
                type="text"
                value={videoUrl}
                onChange={handleUrlChange}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  setVideoUrl(text);
                }}
                className="input-area flex-1"
                placeholder="https://example.com/video.mp4"
                disabled={isBase64}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                title="Upload Video"
              >
                <Upload className="w-5 h-5" />
              </button>
              {isBase64 && (
                <button
                  type="button"
                  onClick={() => { setVideoUrl(''); setIsBase64(false); }}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-white/60">
              Supported formats: mp4, webm, mov. Max size: 100MB
            </p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setExtractionMode('interval')}
              className={`p-4 rounded-lg border transition-colors ${
                extractionMode === 'interval'
                  ? 'bg-[#4A2A7A] border-white/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Time Intervals</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setExtractionMode('specific')}
              className={`p-4 rounded-lg border transition-colors ${
                extractionMode === 'specific'
                  ? 'bg-[#4A2A7A] border-white/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Specific Times</span>
              </div>
            </button>
          </div>

          {extractionMode === 'interval' ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Frame Interval (seconds)
            </label>
            <div className="flex gap-2">
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="input-area flex-1"
            />
            <div className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white/60">
              ~{Math.ceil(600 / interval)} frames ({secondsToTime(600)}.000 total)
            </div>
            </div>
            <p className="text-sm text-white/60">
              Extract one frame every {interval} seconds ({secondsToTime(interval)}.000)
            </p>
          </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Frame Timestamps</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowTimestamps(true);
                    if (frameExtractions.length === 0) {
                      addFrameExtraction();
                    }
                  }}
                  className="text-sm text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Time
                </button>
              </div>
              
              {showTimestamps && <div className="space-y-3">
                {frameExtractions.map((extraction, index) => (
                  <div key={extraction.id} className="flex gap-2">
                    <InputWithPaste
                      type="text"
                      value={extraction.timestamp}
                      onChange={(e) => handleTimeChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                      onBlur={() => handleTimeBlur(index)}
                      onPaste={(text) => handleTimeChange({ target: { value: text } } as any, index)}
                      className="input-area"
                      placeholder="00:00"
                      maxLength={5}
                    />
                    {frameExtractions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFrameExtraction(extraction.id)}
                        className="p-3 bg-red-900/30 hover:bg-red-800/40 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>}
              <p className="text-sm text-white/60">
                Format: mm:ss.xxx (e.g., 01:30.500)
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !videoUrl}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Extracting frames...'}
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                {extractionMode === 'interval' ? 'Extract Frames' : 'Extract Specific Frames'}
              </>
            )}
          </button>
        </form>
      </>}
      result={
        <>
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="font-medium mb-1">Error:</p>
                  <p className="whitespace-pre-wrap">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && !frames.length && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress || 'Extracting frames...'}
              title="Processing Video"
            />
          )}

          {frames.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Extracted Frames ({frames.length})
                </h2>
                <button
                  onClick={downloadAllFrames}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {frames.map((url, index) => (
                  <div key={index} className="card overflow-hidden">
                    <img
                      src={url}
                      alt={`Frame ${index + 1}`}
                      className="w-full h-auto aspect-video object-cover"
                    />
                    <div className="p-4 border-t border-white/10">
                      <p className="text-sm text-white/60 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {extractionMode === 'interval' ? (
                          <>Frame {index + 1} ({secondsToTime(index * interval)}.000)</>
                        ) : (
                          <>Frame {index + 1} ({frameExtractions[index]?.timestamp || '00:00.000'})</>
                        )}
                      </p>
                      <a
                        href={url}
                        download={`frame-${index + 1}.jpg`}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white text-sm transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      }
      onHistoryItemClick={(item) => {
        if (item.type === 'image' && item.content.imageUrl) {
          window.open(item.content.imageUrl, '_blank');
        }
      }}
    >
      {showVideoModal && <VideoPreviewModal />}
    </ToolLayout>
  );
}

export default VideoToFrames;