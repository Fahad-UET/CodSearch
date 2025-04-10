import React from 'react';
import { Upload, Loader2, Download, X, Plus, Clock, Video, ChevronLeft, ChevronRight, Ratio as AspectRatio } from 'lucide-react';

import InputWithPaste from '@/components/AICreator/InputWithPaste';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ToolLayout from '@/components/AICreator/ToolLayout';
import { useHistory } from '../store/history';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

const loadFFmpeg = async () => {
  await ffmpeg.load(); // Loads the FFmpeg WebAssembly module
  console.log('FFmpeg Loaded');
};

loadFFmpeg();



function VideoToGif() {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [gifUrl, setGifUrl] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState('00:00.000');
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [enableTargetSize, setEnableTargetSize] = React.useState(false);
  const [fps, setFps] = React.useState(10);
  const [width, setWidth] = React.useState(480);
  const [progress, setProgress] = React.useState<string>('');
  const [startTime, setStartTime] = React.useState<string>('00:00.000');
  const [endTime, setEndTime] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [targetSize, setTargetSize] = React.useState<number>(10);
  const [qualityMode, setQualityMode] = React.useState<'auto' | 'fps' | 'width' | 'both'>('auto');
  const [fileSize, setFileSize] = React.useState<number>(0);
  const [aspectRatio, setAspectRatio] = React.useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [startTimeTooltip, setStartTimeTooltip] = React.useState(false);
  const [endTimeTooltip, setEndTimeTooltip] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoPlayerRef = React.useRef<HTMLVideoElement>(null);
  const controlsRef = React.useRef<HTMLDivElement>(null);
  const { addItem } = useHistory();

  // Add helper function for crop filter
  const getCropFilter = (ratio: '16:9' | '9:16' | '1:1'): string => {
    switch (ratio) {
      case '16:9':
        return 'crop=iw:iw*9/16:(iw-ow)/2:(ih-oh)/2';
      case '9:16':
        return 'crop=ih*9/16:ih:(iw-ow)/2:0';
      case '1:1':
        return 'crop=min(iw\\,ih):min(iw\\,ih):(iw-min(iw\\,ih))/2:(ih-min(iw\\,ih))/2';
      default:
        return 'crop=iw:ih:0:0';
    }
  };

  // Handle fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Convert mm:ss to seconds
  const timeToSeconds = (time: string): number => {
    if (!time) return 0;
    const [timeStr, msStr = '000'] = time.split('.');
    const [minutes, seconds] = timeStr.split(':').map(Number);
    const milliseconds = parseInt(msStr);
    return (minutes * 60) + seconds + (milliseconds / 1000);
  };

  // Convert seconds to mm:ss
  const secondsToTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  // Validate and format time input
  const formatTimeInput = (value: string): string => {
    // Remove non-digit characters except colon and period
    const digits = value.replace(/[^\d:.]/g, '');
    
    // Handle empty input
    if (!digits) {
      return '00:00.000';
    }
    
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
    
    if (isNaN(minutes)) minutes = 0;
    if (isNaN(seconds)) seconds = 0;
    if (isNaN(milliseconds)) milliseconds = 0;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const handleTimeClick = (type: 'start' | 'end') => {
    if (videoPlayerRef.current) {
      const time = secondsToTime(videoPlayerRef.current.currentTime);
      // Show tooltip for 2 seconds
      if (type === 'start') {
        setStartTime(time);
        setStartTimeTooltip(true);
        setTimeout(() => setStartTimeTooltip(false), 2000);
      } else {
        setEndTime(time);
        setEndTimeTooltip(true);
        setTimeout(() => setEndTimeTooltip(false), 2000);
      }
      if (type === 'start') {
        setStartTime(time);
      } else {
        setEndTime(time);
      }
    }
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
        setShowVideoModal(true);
        setVideoLoaded(false);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setVideoUrl(e.target.value);
      setIsBase64(false);
      setShowVideoModal(true);
      setVideoLoaded(false);
      setError(null);
    };

  const convertToGif = async () => {
    try {
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
      
      // Build FFmpeg command with time range
      const inputArgs = [];
      if (startTime) {
        inputArgs.push('-ss', timeToSeconds(startTime).toString());
      }
      if (endTime) {
        inputArgs.push('-to', timeToSeconds(endTime).toString());
      }

      // Convert to GIF using FFmpeg with palette generation for better quality
      setProgress('Generating palette...');
      
      // Calculate optimal parameters based on target size
      let targetFps = fps;
      let targetWidth = width;
      
      if (qualityMode !== 'auto') {
        const targetBytes = targetSize * 1024 * 1024; // Convert MB to bytes
        const estimatedBytesPerFrame = targetBytes / (fps * 10); // Rough estimate for 10 seconds
        
        if (qualityMode === 'fps' || qualityMode === 'both') {
          targetFps = Math.max(5, Math.min(30, Math.floor(targetBytes / (width * width * 10))));
        }
        
        if (qualityMode === 'width' || qualityMode === 'both') {
          targetWidth = Math.max(100, Math.min(1920, Math.floor(Math.sqrt(estimatedBytesPerFrame))));
        }
      }
      
      await ffmpeg.run(
        ...inputArgs,
        '-i', 'input.mp4',
        '-vf', `fps=${targetFps},${getCropFilter(aspectRatio)},scale=${targetWidth}:-1:flags=lanczos,palettegen`,
        'palette.png'
      );
      setPercentage(60);

      setProgress('Creating GIF...');
      // Create GIF with error checking
      await ffmpeg.run(
        ...inputArgs,
        '-i', 'input.mp4',
        '-i', 'palette.png',
        '-lavfi', `fps=${targetFps},${getCropFilter(aspectRatio)},scale=${targetWidth}:-1:flags=lanczos[x];[x][1:v]paletteuse`,
        '-y', // Overwrite output file if it exists
        '-gifflags', '+transdiff',
        '-gifflags', '+offsetting',
        'output.gif'
      );
      setPercentage(80);

      // Verify files exist
      const files = ffmpeg.FS('readdir', '/');
      const requiredFiles = ['palette.png'];
      const missingFiles = requiredFiles.filter(file => !files.includes(file));
      
      if (!files.includes('output.gif')) {
        missingFiles.push('output.gif');
      }
      
      if (missingFiles.length > 0) {
        throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
      }

      // Get file stats to verify size
      const data = ffmpeg.FS('readFile', 'output.gif');
      const stats = { size: data.length }; // Simulate file size using readFile
      if (!stats || stats.size === 0) {
        throw new Error('Generated GIF file is empty');
      }

      // Read output file
      const gifData = ffmpeg.FS('readFile', 'output.gif');
      const blob = new Blob([new Uint8Array(gifData.buffer)], { type: 'image/gif' });
      if (blob.size === 0) {
        throw new Error('Generated GIF has no content');
      }

      const url = URL.createObjectURL(blob);
      setFileSize(blob.size);

      // Clean up files
      try {
        const filesToClean = ['input.mp4', 'palette.png', 'output.gif'];
        filesToClean.forEach(file => {
          if (files.includes(file)) {
            ffmpeg.FS('unlink', file);
          }
        });
      } catch (err) {
        console.warn('Failed to clean up some files:', err);
      }

      setGifUrl(url);
      setPercentage(100);

      // Add to history
      addItem({
        type: 'image',
        content: {
          imageUrl: url,
          sourceVideo: videoUrl,
          details: `GIF (${width}px, ${fps}fps)`
        },
        timestamp: Date.now(),
        id: ''
      });

    } catch (err) {
      console.error('FFmpeg error:', err);
      setError('Failed to convert video: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
      setProgress('');
      setPercentage(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGifUrl(null);
    await convertToGif();
  };

  const VideoPreviewModal = () => (
    <>
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
              className={`w-full h-full bg-black object-contain ${isFullscreen ? 'fullscreen-video' : ''}`}
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
            <div className={`${isFullscreen ? 'absolute bottom-20 left-1/2 -translate-x-1/2 z-50' : 'mt-4'} flex justify-center gap-8`}>
              <div className="relative">
                <button
                  onClick={() => handleTimeClick('start')}
                  className="p-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                  title="Set Start Time"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {startTimeTooltip && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-sm whitespace-nowrap">
                    Start time set: {startTime}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => handleTimeClick('end')}
                  className="p-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                  title="Set End Time"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {endTimeTooltip && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-sm whitespace-nowrap">
                    End time set: {endTime}
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
        .fullscreen-video::-webkit-media-controls-panel {
          padding-bottom: 90px !important;
        }
        `}
      </style>
    </>
  );

  return (
    <ToolLayout
      title="Video to GIF"
      description="Convert videos to animated GIFs with customizable settings"
      controls={
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="mt-4 flex justify-center gap-8">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleTimeClick('start')}
                    className="p-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                    title="Set Start Time"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {startTimeTooltip && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-sm whitespace-nowrap">
                      Start time set: {startTime}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleTimeClick('end')}
                    className="p-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                    title="Set End Time"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {endTimeTooltip && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-sm whitespace-nowrap">
                      End time set: {endTime}
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-medium">
              Video File or URL
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="videoUrl"
                type="text"
                value={videoUrl}
                onChange={(e) => handleUrlChange(e)}
                onPaste={(text) => handleUrlChange({ target: { value: text } } as any)}
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

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enableTargetSize}
                onChange={(e) => {
                  setEnableTargetSize(e.target.checked);
                  setQualityMode(e.target.checked ? 'both' : 'auto');
                }}
                className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
              />
              <span className="text-sm font-medium">Set target file size</span>
            </label>
            <p className="text-sm text-white/60">
              Enable to specify desired output file size
            </p>
          </div>

          {enableTargetSize && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Target File Size (MO)
            </label>
            <input
              type="number"
              value={targetSize}
              onChange={(e) => setTargetSize(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              min="1"
              max="50"
              className="input-area"
            />
            <p className="text-sm text-white/60">
              Desired output file size in megaoctets
            </p>
          </div>
          )}

          {enableTargetSize && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Quality Optimization
            </label>
            <p className="text-sm text-white/60">
              Quality settings will be automatically optimized to meet your target file size
            </p>
          </div>
          )}

          {!enableTargetSize && (
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Frame Rate (FPS)
              </label>
              <input
                type="number"
                value={fps}
                onChange={(e) => setFps(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                min="1"
                max="30"
                className="input-area" 
              />
              <p className="text-sm text-white/60">
                Higher FPS = smoother animation but larger file
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Width (pixels)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Math.max(100, Math.min(1920, parseInt(e.target.value) || 480)))}
                min="100"
                max="1920"
                step="10"
                className="input-area"
              />
              <p className="text-sm text-white/60">
                Height will adjust automatically
              </p>
            </div>
          </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Start Time
              </label>
              <InputWithPaste
                type="text"
                value={startTime}
                onChange={(e) => {
                  const formatted = formatTimeInput(e.target.value);
                  setStartTime(formatted);
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  setStartTime(formatTimeInput(text));
                }}
                className="input-area"
                placeholder="00:00.000"
                maxLength={9}
              />
              <p className="text-sm text-white/60">
                Format: mm:ss.xxx (e.g., 01:30.500)
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                End Time
              </label>
              <InputWithPaste
                type="text"
                value={endTime}
                onChange={(e) => {
                  const formatted = formatTimeInput(e.target.value);
                  setEndTime(formatted || '');
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  setEndTime(formatTimeInput(text));
                }}
                className="input-area"
                placeholder="00:00.000"
                maxLength={9}
              />
              <p className="text-sm text-white/60">
                Optional: Leave empty for full duration
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Aspect Ratio
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  aspectRatio === '16:9'
                    ? 'bg-[#4A2A7A] border-white/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <AspectRatio className="w-4 h-4" />
                <span>16:9</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  aspectRatio === '9:16'
                    ? 'bg-[#4A2A7A] border-white/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <AspectRatio className="w-4 h-4 rotate-90" />
                <span>9:16</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  aspectRatio === '1:1'
                    ? 'bg-[#4A2A7A] border-white/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <AspectRatio className="w-4 h-4" />
                <span>1:1</span>
              </button>
            </div>
            <p className="text-sm text-white/60">
              Choose output aspect ratio (crops from center)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !videoUrl}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Converting...'}
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Convert to GIF
              </>
            )}
          </button>
        </form>
      }
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

          {loading && !gifUrl && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress || 'Converting video to GIF...'}
              title="Processing Video"
            />
          )}

          {gifUrl && (
            <div className="mt-8 space-y-4">
              <div className="card overflow-hidden">
                <img
                  src={gifUrl}
                  alt="Generated GIF"
                  className="w-full h-auto"
                />
                <div className="p-4 border-t border-white/10">
                  <div className="flex justify-center gap-4">
                    <a
                      href={gifUrl}
                      download="animated.gif"
                      className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download GIF
                    </a>
                  </div>
                  <p className="text-center text-sm text-white/60 mt-2">
                    {width}px width • {fps} FPS • {startTime} to {endTime || 'end'} • {(fileSize / (1024 * 1024)).toFixed(2)} MO 
                    {qualityMode !== 'auto' && ` (Target: ${targetSize} MO)`} • {aspectRatio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      }
      onHistoryItemClick={(item) => {
        if (item.type === 'image'&& item.content.imageUrl) {
          window.open(item.content.imageUrl, '_blank');
        }
      }}
    >
      {showVideoModal && <VideoPreviewModal />}
    </ToolLayout>
  );
}

export default VideoToGif

