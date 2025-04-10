import React from 'react';
import { Scissors, Upload, Loader2, Download, ExternalLink, Link2, X, Plus, Divide, FolderDown, SplitSquareVertical as SplitSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import FFmpeg from '@ffmpeg/ffmpeg';
const { createFFmpeg, fetchFile } = FFmpeg;
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ToolLayout from '@/components/AICreator/ToolLayout';
import { useHistory } from '../store/history';

const ffmpeg = createFFmpeg({ 
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
});

interface TrimSegment {
  id: string;
  startTime: string;
  endTime: string;
  outputUrl?: string;
  
}

function VideoTrimmer() {
  const [mode, setMode] = React.useState<'trim' | 'divide'>('trim');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [segments, setSegments] = React.useState<TrimSegment[]>([
    { id: crypto.randomUUID(), startTime: '00:00.000', endTime: '' }
  ]);
  const [divisionCount, setDivisionCount] = React.useState(2);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [startTime, setStartTime] = React.useState('00:00.000');
  const [endTime, setEndTime] = React.useState('');
  const [videoDuration, setVideoDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState('00:00.000');
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [startTimeTooltip, setStartTimeTooltip] = React.useState(false);
  const [endTimeTooltip, setEndTimeTooltip] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoPlayerRef = React.useRef<HTMLVideoElement>(null);
  const controlsRef = React.useRef<HTMLDivElement>(null);
  const { addItem } = useHistory();

  // Handle fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Load video duration when URL changes
  React.useEffect(() => {
    if (videoUrl) {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
      };
    }
  }, [videoUrl]);

  const addSegment = () => {
    // Get the current video time for the new segment
    const currentVideoTime = videoPlayerRef.current?.currentTime || 0;
    const formattedTime = secondsToTime(currentVideoTime);
    
    setSegments(prev => [
      ...prev,
      { id: crypto.randomUUID(), startTime: formattedTime, endTime: '' }
    ]);
    
    // Set the end time of the previous segment to the current time
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      updateSegment(lastSegment.id, { endTime: formattedTime });
    }
  };

  const removeSegment = (id: string) => {
    setSegments(prev => prev.filter(segment => segment.id !== id));
  };

  const updateSegment = (id: string, updates: Partial<TrimSegment>) => {
    setSegments(prev => prev.map(segment => 
      segment.id === id ? { ...segment, ...updates } : segment
    ));
  };

  const divideVideo = () => {
    if (!videoDuration) return;
    
    const segmentDuration = videoDuration / divisionCount;
    const newSegments: TrimSegment[] = [];
    
    for (let i = 0; i < divisionCount; i++) {
      const startSeconds = i * segmentDuration;
      const endSeconds = (i + 1) * segmentDuration;
      
      newSegments.push({
        id: crypto.randomUUID(),
        startTime: secondsToTime(startSeconds),
        endTime: secondsToTime(endSeconds)
      });
    }
    
    setSegments(newSegments);
  };

  const downloadAllSegments = () => {
    // Create a temporary link element
    const downloadSegment = (segment: TrimSegment, index: number) => {
      const a = document.createElement('a');
      a.href = segment.outputUrl!;
      a.download = `trimmed-video-${index + 1}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    // Download each segment with a small delay to prevent browser issues
    segments.forEach((segment, index) => {
      if (segment.outputUrl) {
        setTimeout(() => downloadSegment(segment, index), index * 500);
      }
    });
  };

  // Format time input (mm:ss)
  const formatTimeInput = (value: string): string => {
    // Remove non-digit characters except colon and period
    const digits = value.replace(/[^\d:.]/g, '');
    
    // Handle empty input
    if (!digits) return '00:00.000';
    
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

  // Convert seconds to mm:ss format
  const secondsToTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setIsBase64(false);
    setShowVideoModal(true);
    setVideoLoaded(false);
    setError(null);
  };

  const handleTimeClick = (type: 'start' | 'end') => {
    if (videoPlayerRef.current) {
      const time = secondsToTime(videoPlayerRef.current.currentTime);
      // Get the last segment that doesn't have an end time, or the last segment
      const targetSegment = segments.find(s => !s.endTime) || segments[segments.length - 1];

      // Show tooltip for 2 seconds
      if (type === 'start') {
        setStartTime(time);
        updateSegment(targetSegment.id, { startTime: time });
        setStartTimeTooltip(true);
        setTimeout(() => setStartTimeTooltip(false), 2000);
      } else {
        setEndTime(time);
        updateSegment(targetSegment.id, { endTime: time });
        setEndTimeTooltip(true);
        setTimeout(() => setEndTimeTooltip(false), 2000);
      }
    }
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

  const trimVideo = async (segment: TrimSegment) => {
    try {
      // Verify video durations are valid
      if (!videoDuration) {
        throw new Error('Unable to determine video duration. Please ensure the video is valid.');
      }

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
      
      // Parse timestamps
      let startSeconds = 0;
      let endSeconds = videoDuration;
      
      if (segment.startTime.includes('.')) {
        // Format: mm:ss.xxx
        const [timeStr, msStr = '000'] = segment.startTime.split('.');
        const [minutes, seconds] = timeStr.split(':').map(Number);
        const milliseconds = parseInt(msStr.padEnd(3, '0'));
        startSeconds = minutes * 60 + seconds + milliseconds / 1000;
      } else {
        // Format: mm:ss
        const [minutes, seconds] = segment.startTime.split(':').map(Number);
        startSeconds = minutes * 60 + seconds;
      }
      
      if (segment.endTime) {
        if (segment.endTime.includes('.')) {
          const [timeStr, msStr = '000'] = segment.endTime.split('.');
          const [minutes, seconds] = timeStr.split(':').map(Number);
          const milliseconds = parseInt(msStr.padEnd(3, '0'));
          endSeconds = minutes * 60 + seconds + milliseconds / 1000;
        } else {
          const [minutes, seconds] = segment.endTime.split(':').map(Number);
          endSeconds = minutes * 60 + seconds;
        }
      }
      
      // Verify timestamps are valid
      if (startSeconds >= endSeconds) {
        throw new Error('End time must be after start time');
      }
      
      if (startSeconds > videoDuration || endSeconds > videoDuration) {
        throw new Error(`Timestamp(s) beyond video duration (${secondsToTime(videoDuration)})`);
      }

      // Build FFmpeg command
      await ffmpeg.run(
        '-i', 'input.mp4',
        '-ss', startSeconds.toFixed(3),
        '-to', endSeconds.toFixed(3),
        '-c', 'copy', // Copy streams without re-encoding
        '-avoid_negative_ts', '1',
        '-y', // Overwrite output files
        'output.mp4'
      );

      setProgress('Trimming video...');
      setPercentage(80);

      // Verify output file exists before reading
      const files = ffmpeg.FS('readdir', '/');
      if (!files.includes('output.mp4')) {
        throw new Error('Failed to create output file');
      }

      // Read output file
      const data = ffmpeg.FS('readFile', 'output.mp4');
      
      // Verify output data
      if (!data || data.length === 0) {
        throw new Error('Generated video is empty');
      }

      const blob = new Blob([data.buffer as ArrayBuffer], { type: 'video/mp4' });
      
      // Verify blob
      if (blob.size === 0) {
        throw new Error('Generated video has no content');
      }

      const url = URL.createObjectURL(blob);

      // Clean up files
      try {
        ffmpeg.FS('unlink', 'input.mp4');
        ffmpeg.FS('unlink', 'output.mp4');
      } catch (err) {
        console.warn('Failed to clean up some files:', err);
      }

      updateSegment(segment.id, { outputUrl: url });
      setPercentage(100);

      // Add to history
      addItem({
          type: 'video',
          content: {
              videoUrl: url,
              sourceVideo: videoUrl,
              details: `Trimmed video (${segment.startTime} to ${segment.endTime || 'end'})`
          },
          timestamp: Date.now(),
          id: ''
      });

    } catch (err) {
      console.error('FFmpeg error:', err);
      setError('Failed to trim video: ' + (err instanceof Error ? err.message : String(err)));
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
    
    // Reset all output URLs
    setSegments(prev => prev.map(segment => ({ ...segment, outputUrl: undefined })));
    
    // Process each segment sequentially
    for (const segment of segments) {
      await trimVideo(segment);
    }
    
    setLoading(false);
  };

  return (
    <ToolLayout
      title="Video Trimmer"
      description="Extract segments or divide videos into equal parts"
    //   modelId="fal-ai/sync-lipsync/video-trimmer"
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
            </div>
          )}

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setMode('trim')}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${
                mode === 'trim'
                  ? 'bg-[#4A2A7A] border-white/20 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Scissors className="w-8 h-8" />
              <span className="text-sm font-medium">Extract Segments</span>
              <span className="text-xs text-white/60 text-center">
                Extract specific portions of the video
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode('divide')}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${
                mode === 'divide'
                  ? 'bg-[#4A2A7A] border-white/20 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <SplitSquare className="w-8 h-8" />
              <span className="text-sm font-medium">Divide Video</span>
              <span className="text-xs text-white/60 text-center">
                Split video into equal parts
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-medium">
              Video File or URL
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="videoUrl"
                type="text"
                value={videoUrl}
                onChange={(e: any) => handleUrlChange(e)}
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

          {mode === 'divide' && videoDuration > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Divide Video into Equal Parts
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={divisionCount}
                  onChange={(e) => setDivisionCount(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)))}
                  min="2"
                  max="10"
                  className="input-area w-24"
                />
                <button
                  type="button"
                  onClick={divideVideo}
                  className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200 flex items-center gap-2"
                >
                  <Divide className="w-5 h-5" />
                  Divide
                </button>
              </div>
              <p className="text-sm text-white/60">
                Split video into {divisionCount} equal segments of {secondsToTime(videoDuration / divisionCount)} each
              </p>
            </div>
          )}

          {mode === 'trim' && segments.map((segment, index) => (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Segment {index + 1} Start Time
              </label>
              <InputWithPaste
                type="text"
                value={segment.startTime}
                onChange={(e) => {
                  const formatted = formatTimeInput(e.target.value);
                  updateSegment(segment.id, { startTime: formatted });
                }}
                onPaste={(text: any) => updateSegment(segment.id, { startTime: formatTimeInput(text) })}
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
                Segment {index + 1} End Time
              </label>
              <div className="flex gap-2">
                <InputWithPaste
                  type="text"
                  value={segment.endTime}
                  onChange={(e) => {
                    const formatted = formatTimeInput(e.target.value);
                    updateSegment(segment.id, { endTime: formatted || '' });
                  }}
                  onPaste={(text: any) => updateSegment(segment.id, { endTime: formatTimeInput(text) })}
                  className="input-area"
                  placeholder="00:00.000"
                  maxLength={9}
                />
                {segments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSegment(segment.id)}
                    className="px-3 bg-red-900/30 hover:bg-red-800/40 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-white/60">
                Format: mm:ss.xxx (leave empty for end)
              </p>
            </div>
          </div>
          ))}

          {mode === 'trim' && <button
            type="button"
            onClick={addSegment}
            className="w-full px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Segment
          </button>}

          <button
            type="submit"
            disabled={loading || !videoUrl}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing...'}
              </>
            ) : (
              <>
                <Scissors className="w-5 h-5" />
                {mode === 'trim' ? 'Extract Segments' : 'Divide Video'}
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

          {loading && !segments.some(segment => segment.outputUrl) && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress || 'Trimming video...'}
              title="Processing Video"
            />
          )}

          {segments.some(segment => segment.outputUrl) && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-end mb-4">
                <button
                  onClick={downloadAllSegments}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                >
                  <FolderDown className="w-4 h-4" />
                  Download All Segments
                </button>
              </div>
              {segments.map((segment, index) => segment.outputUrl && (
                <div key={segment.id} className="card overflow-hidden">
                  <div className="aspect-video bg-white/5">
                    <video
                      src={segment.outputUrl}
                      className="w-full h-full"
                      controls
                      autoPlay
                      loop
                      muted
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <h3 className="text-lg font-medium mb-4">Segment {index + 1}</h3>
                    <div className="flex justify-center gap-4">
                      <a
                        href={segment.outputUrl}
                        download={`trimmed-video-${index + 1}.mp4`}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                      <a
                        href={segment.outputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(segment.outputUrl!)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                      >
                        <Link2 className="w-4 h-4" />
                        Copy URL
                      </button>
                    </div>
                    <p className="text-center text-sm text-white/60 mt-2">
                      Trimmed from {segment.startTime} to {segment.endTime || 'end'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      }
    >
      {showVideoModal && <VideoPreviewModal />}
    </ToolLayout>
  );
}

export default VideoTrimmer;