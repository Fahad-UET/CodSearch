import React from 'react';
import { Upload, Video, Loader2, Download, X, Shuffle, Plus, FolderDown } from 'lucide-react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import LoadingAnimation from '../components/AICreator/LoadingAnimation';
import ToolLayout from '../components/AICreator/ToolLayout';
import { useHistory } from '../store/history';

const ffmpeg = createFFmpeg({ 
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
});

interface VideoSegment {
  id: string;
  startTime: string;
  endTime: string;
  source: 'video1' | 'video2' | 'video3';
}

interface MixedVideo {
  id: string;
  segments: VideoSegment[];
  outputUrl?: string;
}

function VideoMixer() {
  const [video1Url, setVideo1Url] = React.useState('');
  const [video2Url, setVideo2Url] = React.useState('');
  const [video3Url, setVideo3Url] = React.useState('');
  const [showVideo3, setShowVideo3] = React.useState(false);
  const [isVideo1Base64, setIsVideo1Base64] = React.useState(false);
  const [isVideo2Base64, setIsVideo2Base64] = React.useState(false);
  const [isVideo3Base64, setIsVideo3Base64] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [segmentCount, setSegmentCount] = React.useState(3);
  const [segments, setSegments] = React.useState<VideoSegment[]>([]);
  const [mixedVideos, setMixedVideos] = React.useState<MixedVideo[]>([]);
  const [video1Duration, setVideo1Duration] = React.useState(0);
  const [video2Duration, setVideo2Duration] = React.useState(0);
  const [video3Duration, setVideo3Duration] = React.useState(0);

  const video1InputRef = React.useRef<HTMLInputElement>(null);
  const video2InputRef = React.useRef<HTMLInputElement>(null);
  const video3InputRef = React.useRef<HTMLInputElement>(null);
  const { addItem } = useHistory();

  // Format time input (mm:ss)
  const formatTimeInput = (value: string): string => {
    const digits = value.replace(/[^\d:]/g, '');
    if (!digits) return '';
    
    const parts = digits.split(':');
    let minutes, seconds;
    
    if (parts.length > 1) {
      minutes = Math.min(59, parseInt(parts[0]) || 0);
      seconds = Math.min(59, parseInt(parts[1]) || 0);
    } else {
      const num = parseInt(digits);
      minutes = Math.floor(num / 100);
      seconds = num % 100;
      if (seconds >= 60) seconds = 59;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Convert seconds to mm:ss format
  const secondsToTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert mm:ss to seconds
  const timeToSeconds = (time: string): number => {
    const [minutes, seconds] = time.split(':').map(Number);
    return (minutes * 60) + seconds;
  };

  const handleFileUpload = (videoNum: 1 | 2 | 3) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 100 * 1024 * 1024; // 100MB max
      if (file.size > maxSize) {
        setError('File size must be less than 100MB. Please compress your video or use a smaller file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (videoNum === 1) {
          setVideo1Url(reader.result as string);
          setIsVideo1Base64(true);
        } else if (videoNum === 2) {
          setVideo2Url(reader.result as string);
          setIsVideo2Base64(true);
        } else {
          setVideo3Url(reader.result as string);
          setIsVideo3Base64(true);
        }
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (videoNum: 1 | 2 | 3) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoNum === 1) {
      setVideo1Url(e.target.value);
      setIsVideo1Base64(false);
    } else if (videoNum === 2) {
      setVideo2Url(e.target.value);
      setIsVideo2Base64(false);
    } else {
      setVideo3Url(e.target.value);
      setIsVideo3Base64(false);
    }
    setError(null);
  };

  // Load video durations when URLs change
  React.useEffect(() => {
    if (video1Url) {
      const video = document.createElement('video');
      video.src = video1Url;
      video.onloadedmetadata = () => {
        setVideo1Duration(video.duration);
      };
    }
  }, [video1Url]);

  React.useEffect(() => {
    if (video2Url) {
      const video = document.createElement('video');
      video.src = video2Url;
      video.onloadedmetadata = () => {
        setVideo2Duration(video.duration);
      };
    }
  }, [video2Url]);

  React.useEffect(() => {
    if (video3Url) {
      const video = document.createElement('video');
      video.src = video3Url;
      video.onloadedmetadata = () => {
        setVideo3Duration(video.duration);
      };
    }
  }, [video3Url]);

  const generateSegments = () => {
    if (!video1Duration || !video2Duration) return;

    const newSegments: VideoSegment[] = [];
    const totalDuration = Math.min(
      video1Duration,
      video2Duration,
      showVideo3 && video3Duration ? video3Duration : Infinity
    );
    const defaultSegmentDuration = totalDuration / segmentCount;

    for (let i = 0; i < segmentCount; i++) {
      const startSeconds = i * defaultSegmentDuration;
      const endSeconds = (i + 1) * defaultSegmentDuration;
      
      newSegments.push({
        id: crypto.randomUUID(),
        startTime: secondsToTime(startSeconds),
        endTime: secondsToTime(endSeconds),
        source: 'video1' // Default to video1 for initial segments
      });
    }

    setSegments(newSegments);
    generateAllCombinations(newSegments);
  };

  const generateAllCombinations = (segments: VideoSegment[]) => {
    const combinations: MixedVideo[] = [];
    const n = segments.length;
    const numVideos = showVideo3 ? 3 : 2;
    const totalPossibleCombinations = Math.pow(numVideos, n);
    let validCombinationsCount = 0;

    // Generate combinations while maintaining segment order
    for (let i = 0; i < totalPossibleCombinations; i++) {
      const combination = segments.map((segment, index) => ({
        ...segment,
        source: ['video1', 'video2', 'video3'][Math.floor(i / Math.pow(numVideos, index)) % numVideos] as 'video1' | 'video2' | 'video3'
      }));
      
      // Check if combination uses at least two different videos
      const hasVideo1 = combination.some(seg => seg.source === 'video1');
      const hasVideo2 = combination.some(seg => seg.source === 'video2');
      const hasVideo3 = combination.some(seg => seg.source === 'video3');
      const uniqueVideos = [hasVideo1, hasVideo2, hasVideo3].filter(Boolean).length;
      
      // Only add combination if it uses at least two different videos
      if (uniqueVideos >= 2) {
        validCombinationsCount++;
        combinations.push({
          id: crypto.randomUUID(),
          segments: combination
        });
      }
    }

    setMixedVideos(combinations);
  };

  const concatSegments = async (segments: VideoSegment[]): Promise<string> => {
    try {
      // Verify all input files exist before starting
      const files = ffmpeg.FS('readdir', '/');
      const requiredFiles = new Set(segments.map(s => `input${s.source.slice(-1)}.mp4`));
      for (const file of requiredFiles) {
        if (!files.includes(file)) {
          throw new Error(`Required input file ${file} is missing`);
        }
      }

      // Create a list file for concatenation
      let listContent = '';
      let segmentIndex = 0;

      for (const segment of segments) {
        // Verify segment times are valid
        if (!segment.startTime.match(/^\d{2}:\d{2}$/) || !segment.endTime.match(/^\d{2}:\d{2}$/)) {
          throw new Error(`Invalid time format for segment ${segmentIndex + 1}`);
        }

        const inputFile = `input${segment.source.slice(-1)}.mp4`;
        const outputFile = `segment_${segmentIndex}.mp4`;
        const startTime = segment.startTime;
        const endTime = segment.endTime;

        try {
          // Extract segment with proper encoding and error checking
          await ffmpeg.run(
            '-i', inputFile,
            '-ss', startTime,
            ...(endTime ? ['-to', endTime] : []),
            '-c:v', 'libx264',     // Use H.264 codec
            '-preset', 'medium',    // Balance between speed and quality
            '-crf', '23',          // Constant Rate Factor for quality
            '-c:a', 'aac',         // Use AAC for audio
            '-b:a', '128k',        // Audio bitrate
            '-strict', 'experimental',
            '-movflags', '+faststart',
            '-y',                  // Overwrite output files
            outputFile
          );

          // Verify segment was created and has content
          const segmentFiles = ffmpeg.FS('readdir', '/');
          if (!segmentFiles.includes(outputFile)) {
            throw new Error(`Failed to create segment ${segmentIndex}`);
          }
          
          const segmentData: any = ffmpeg.FS('readFile', outputFile);
          if (segmentData.size === 0) {
            throw new Error(`Segment ${segmentIndex} is empty`);
          }

        } catch (err) {
          console.error(`Error processing segment ${segmentIndex}:`, err);
          throw new Error(`Failed to process segment ${segmentIndex}: ${err instanceof Error ? err.message : String(err)}`);
        }

        listContent += `file '${outputFile}'\n`;
        segmentIndex++;
      }

      // Verify we have at least one segment
      if (segmentIndex === 0) {
        throw new Error('No valid segments to process');
      }

      // Write concat list
      ffmpeg.FS('writeFile', 'list.txt', listContent);

      // Verify list file exists and has content
      const listFileExists = ffmpeg.FS('readdir', '/').includes('list.txt');
      if (!listFileExists) {
        throw new Error('Failed to create list file');
      }

      // Concatenate segments with proper encoding
      await ffmpeg.run(
        '-f', 'concat',
        '-safe', '0',
        '-i', 'list.txt',
        '-c:v', 'libx264', // Use H.264 codec
        '-c:a', 'aac',     // Use AAC for audio
        '-strict', 'experimental',
        '-movflags', '+faststart',
        'output.mp4'
      );

      // Verify output file exists before reading
      const finalFiles = ffmpeg.FS('readdir', '/');
      if (!finalFiles.includes('output.mp4')) {
        throw new Error('Failed to create output file');
      }

      // Read the output file
      const data: any = ffmpeg.FS('readFile', 'output.mp4');

      // Clean up temporary files
      segments.forEach((_, index) => {
        try {
          ffmpeg.FS('unlink', `segment_${index}.mp4`);
        } catch (err) {
          console.warn(`Failed to clean up segment_${index}.mp4:`, err);
        }
      });
      try {
        ffmpeg.FS('unlink', 'list.txt');
        ffmpeg.FS('unlink', 'output.mp4');
      } catch (err) {
        console.warn('Failed to clean up some files:', err);
      }

      // Create URL from final output with proper MIME type
      const blob = new Blob([data.buffer], { type: 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"' });
      
      // Verify the blob is valid
      if (blob.size === 0) {
        throw new Error('Generated video is empty');
      }

      return URL.createObjectURL(blob);

    } catch (error) {
      console.error('Segment processing error:', error);
      throw new Error(`Failed to process video segments: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const processVideos = async () => {
    try {
      // Verify video durations are valid
      const requiredVideos = [
        { url: video1Url, duration: video1Duration, name: 'Video 1' },
        { url: video2Url, duration: video2Duration, name: 'Video 2' },
        ...(showVideo3 ? [{ url: video3Url, duration: video3Duration, name: 'Video 3' }] : [])
      ];

      const invalidVideo = requiredVideos.find(v => !v.duration);
      if (invalidVideo) {
        throw new Error(`Unable to determine duration for ${invalidVideo.name}. Please ensure the video is valid.`);
      }

      // Reset all output URLs
      setMixedVideos(prev => prev.map(video => ({ ...video, outputUrl: undefined })));

      // Create a queue of combinations to process
      const combinationsToProcess = [...mixedVideos];
      const processedCombinations: MixedVideo[] = [];

      // Load FFmpeg
      setProgress('Loading FFmpeg...');
      setPercentage(10);
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      // Write input videos to FFmpeg filesystem
      setProgress('Processing input videos...');
      setPercentage(20);

      // Process input videos with proper error handling
      let inputData1;
      try {
        if (isVideo1Base64) {
          const response = await fetch(video1Url);
          inputData1 = new Uint8Array(await response.arrayBuffer());
        } else {
          const response = await fetch(video1Url);
          if (!response.ok) throw new Error(`Failed to fetch video 1: ${response.status}`);
          inputData1 = new Uint8Array(await response.arrayBuffer());
        }
      } catch (error) {
        throw new Error(`Failed to load first video: ${error instanceof Error ? error.message : String(error)}`);
      }
      ffmpeg.FS('writeFile', 'input1.mp4', inputData1);

      let inputData2;
      try {
        if (isVideo2Base64) {
          const response = await fetch(video2Url);
          inputData2 = new Uint8Array(await response.arrayBuffer());
        } else {
          const response = await fetch(video2Url);
          if (!response.ok) throw new Error(`Failed to fetch video 2: ${response.status}`);
          inputData2 = new Uint8Array(await response.arrayBuffer());
        }
      } catch (error) {
        throw new Error(`Failed to load second video: ${error instanceof Error ? error.message : String(error)}`);
      }
      ffmpeg.FS('writeFile', 'input2.mp4', inputData2);

      // Load video 3 if needed
      if (showVideo3 && video3Url) {
        let inputData3;
        try {
          if (isVideo3Base64) {
            const response = await fetch(video3Url);
            inputData3 = new Uint8Array(await response.arrayBuffer());
          } else {
            const response = await fetch(video3Url);
            if (!response.ok) throw new Error(`Failed to fetch video 3: ${response.status}`);
            inputData3 = new Uint8Array(await response.arrayBuffer());
          }
          ffmpeg.FS('writeFile', 'input3.mp4', inputData3);
        } catch (error) {
          throw new Error(`Failed to load third video: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Process combinations sequentially
      for (let i = 0; i < combinationsToProcess.length; i++) {
        const combination = combinationsToProcess[i];
        setProgress(`Processing combination ${i + 1} of ${combinationsToProcess.length}...`);
        setPercentage(40 + Math.floor((i / combinationsToProcess.length) * 40));
        
        // Wait for previous video to be fully processed
        await new Promise(resolve => setTimeout(resolve, 1000));

        let outputUrl;
        try {
          outputUrl = await concatSegments(combination.segments);
          
          // Verify the video was created successfully
          const video: any = document.createElement('video');
          video.src = outputUrl;
          
          await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = resolve;
            video.onerror = () => reject(new Error('Failed to verify video output'));
            
            // Set timeout in case video loading hangs
            setTimeout(() => reject(new Error('Video verification timed out')), 10000);
          });

          // Additional verification of video duration
          if (video.duration === 0) {
            throw new Error('Generated video has no duration');
          }

          // Add to processed combinations
          processedCombinations.push({
            ...combination,
            outputUrl
          });

          // Update state with all processed combinations so far
          setMixedVideos(prev => {
            const updated = [...prev];
            processedCombinations.forEach(processed => {
              const index = updated.findIndex(v => v.id === processed.id);
              if (index !== -1) {
                updated[index] = processed;
              }
            });
            return updated;
          });

          // Add to history only after verification
          addItem({
              type: 'video',
              content: {
                  videoUrl: outputUrl,
                  sourceVideo: video1Url,
                  details: `Mixed video combination ${i + 1} of ${combinationsToProcess.length}`
              },
              timestamp: Date.now(),
              id: ''
          });

        } catch (error) {
          console.error(`Failed to process combination ${i + 1}:`, error);
          // Don't stop processing, just log the error and continue
          console.warn(`Skipping failed combination ${i + 1}:`, error);
          continue; // Skip failed combination but continue with others
        }
      }

      // Verify we have processed all combinations
      if (processedCombinations.length === 0) {
        throw new Error('No video combinations were successfully generated');
      }

      // Clean up input files
      try {
        ffmpeg.FS('unlink', 'input1.mp4');
        ffmpeg.FS('unlink', 'input2.mp4');
        if (showVideo3 && video3Url) {
          ffmpeg.FS('unlink', 'input3.mp4');
        }
      } catch (err) {
        console.warn('Failed to clean up input files:', err);
      }

    } catch (err) {
      console.error('FFmpeg error:', err);
      let errorMessage = err instanceof Error ? err.message : String(err);
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('memory')) {
        errorMessage = 'Not enough memory to process videos. Try using shorter segments or smaller files.';
      } else if (errorMessage.includes('format')) {
        errorMessage = 'Invalid video format. Please ensure both videos are in a supported format (MP4, WebM).';
      }
      
      setError('Failed to process videos: ' + errorMessage);
    } finally {
      setLoading(false);
      setProgress('');
      setPercentage(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video1Url || !video2Url || (showVideo3 && !video3Url)) {
      setError(`Please provide ${showVideo3 ? 'all three' : 'both'} videos`);
      return;
    }
    setLoading(true);
    setError(null);
    await processVideos();
  };

  const downloadAllVideos = () => {
    mixedVideos.forEach((video, index) => {
      if (video.outputUrl) {
        const a = document.createElement('a');
        a.href = video.outputUrl;
        a.download = `mixed-video-${index + 1}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };

  return (
    <ToolLayout
      title="Video Mixer"
      description="Mix segments from two videos in different combinations"
    //   modelId="fal-ai/sync-lipsync/video-mixer"
      controls={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Video 1 Input */}
            <div className="space-y-2">
              <label htmlFor="video1Url" className="block text-sm font-medium">
                Video 1
              </label>
              <div className="flex gap-2">
                <InputWithPaste
                  id="video1Url"
                  type="text"
                  value={video1Url}
                  onChange={(e: any) => handleUrlChange(1)(e)}
                  onPaste={(text) => handleUrlChange(1)({ target: { value: text } } as any)}
                  className="input-area flex-1"
                  placeholder="https://example.com/video1.mp4"
                  disabled={isVideo1Base64}
                />
                <input
                  type="file"
                  ref={video1InputRef}
                  onChange={handleFileUpload(1)}
                  accept="video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => video1InputRef.current?.click()}
                  className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                  title="Upload Video 1"
                >
                  <Upload className="w-5 h-5" />
                </button>
                {isVideo1Base64 && (
                  <button
                    type="button"
                    onClick={() => { setVideo1Url(''); setIsVideo1Base64(false); }}
                    className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Video 2 Input */}
            <div className="space-y-2">
              <label htmlFor="video2Url" className="block text-sm font-medium">
                Video 2
              </label>
              <div className="flex gap-2">
                <InputWithPaste
                  id="video2Url"
                  type="text"
                  value={video2Url}
                  onChange={(e: any) => handleUrlChange(2)(e)}
                  onPaste={(text) => handleUrlChange(2)({ target: { value: text } } as any)}
                  className="input-area flex-1"
                  placeholder="https://example.com/video2.mp4"
                  disabled={isVideo2Base64}
                />
                <input
                  type="file"
                  ref={video2InputRef}
                  onChange={handleFileUpload(2)}
                  accept="video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => video2InputRef.current?.click()}
                  className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                  title="Upload Video 2"
                >
                  <Upload className="w-5 h-5" />
                </button>
                {isVideo2Base64 && (
                  <button
                    type="button"
                    onClick={() => { setVideo2Url(''); setIsVideo2Base64(false); }}
                    className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add Video 3 Button */}
          {!showVideo3 ? (
            <button
              type="button"
              onClick={() => setShowVideo3(true)}
              className="w-full px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Third Video
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="video3Url" className="block text-sm font-medium">
                  Video 3
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowVideo3(false);
                    setVideo3Url('');
                    setIsVideo3Base64(false);
                  }}
                  className="text-white/60 hover:text-white/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <InputWithPaste
                  id="video3Url"
                  type="text"
                  value={video3Url}
                  onChange={(e: any) => handleUrlChange(3)(e)}
                  onPaste={(text) => handleUrlChange(3)({ target: { value: text } } as any)}
                  className="input-area flex-1"
                  placeholder="https://example.com/video3.mp4"
                  disabled={isVideo3Base64}
                />
                <input
                  type="file"
                  ref={video3InputRef}
                  onChange={handleFileUpload(3)}
                  accept="video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => video3InputRef.current?.click()}
                  className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                  title="Upload Video 3"
                >
                  <Upload className="w-5 h-5" />
                </button>
                {isVideo3Base64 && (
                  <button
                    type="button"
                    onClick={() => { setVideo3Url(''); setIsVideo3Base64(false); }}
                    className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Number of Segments
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={segmentCount}
                onChange={(e) => setSegmentCount(Math.max(2, Math.min(5, parseInt(e.target.value) || 2)))}
                min="2"
                max="5"
                className="input-area w-24"
              />
              <button
                type="button"
                onClick={generateSegments}
                disabled={!video1Url || !video2Url}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle className="w-5 h-5" />
                Generate Combinations
              </button>
            </div>
            <p className="text-sm text-white/60">
              Will generate {Math.pow(showVideo3 ? 3 : 2, segmentCount)} total combinations ({Math.pow(showVideo3 ? 3 : 2, segmentCount) - segmentCount} valid combinations using at least 2 different videos)
            </p>
          </div>

          {segments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Segment Times</h3>
              <div className="grid gap-4">
                {segments.map((segment, index) => (
                  <div key={segment.id} className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Segment {index + 1} Start Time
                      </label>
                      <InputWithPaste
                        type="text"
                        value={segment.startTime}
                        onChange={(e) => {
                          const newSegments = [...segments];
                          newSegments[index].startTime = formatTimeInput(e.target.value);
                          setSegments(newSegments);
                        }}
                        onPaste={(text: any) => {
                          const newSegments = [...segments];
                          newSegments[index].startTime = formatTimeInput(text);
                          setSegments(newSegments);
                        }}
                        className="input-area"
                        placeholder="00:00"
                        maxLength={5}
                      />
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
                            const newSegments = [...segments];
                            newSegments[index].endTime = formatTimeInput(e.target.value);
                            setSegments(newSegments);
                          }}
                          onPaste={(text: any) => {
                            const newSegments = [...segments];
                            newSegments[index].endTime = formatTimeInput(text);
                            setSegments(newSegments);
                          }}
                          className="input-area"
                          placeholder="00:00"
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60">
                Format: mm:ss (e.g., 01:30). Maximum duration: {secondsToTime(Math.min(video1Duration, video2Duration))}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !video1Url || !video2Url || (showVideo3 && !video3Url) || segments.length === 0}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing...'}
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Generate Mixed Videos
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

          {loading && !mixedVideos.some(video => video.outputUrl) && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress || 'Processing videos...'}
              title="Generating Combinations"
            />
          )}

          {mixedVideos.some(video => video.outputUrl) && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-end mb-4">
                <button
                  onClick={downloadAllVideos}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                >
                  <FolderDown className="w-4 h-4" />
                  Download All Videos
                </button>
              </div>

              <div className="grid gap-6">
                {mixedVideos.map((video, index) => video.outputUrl && (
                  <div key={video.id} className="card overflow-hidden">
                    <div className="aspect-video bg-white/5">
                      <video
                        src={video.outputUrl}
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
                      <h3 className="text-lg font-medium mb-2">Combination {index + 1}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {video.segments.map((segment, segIndex) => (
                          <span
                            key={segment.id}
                            className={`px-2 py-1 rounded text-xs ${
                              segment.source === 'video1'
                                ? 'bg-blue-900/50 text-blue-200'
                                : segment.source === 'video2'
                                ? 'bg-purple-900/50 text-purple-200'
                                : 'bg-green-900/50 text-green-200'
                            }`}
                          >
                            Segment {segIndex + 1}: Video {segment.source.slice(-1)}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-center gap-4">
                        <a
                          href={video.outputUrl}
                          download={`mixed-video-${index + 1}.mp4`}
                          className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      }
      onHistoryItemClick={(item) => {
        if (item.type === 'video' && item.content.videoUrl) {
          window.open(item.content.videoUrl, '_blank');
        }
      }}
    />
  );
}

export default VideoMixer;