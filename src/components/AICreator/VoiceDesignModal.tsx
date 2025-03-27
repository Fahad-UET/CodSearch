import React from 'react';
import { X, Sparkles, Loader2, Upload, Table as Tabs } from 'lucide-react';
import InputWithPaste from './InputWithPaste';
import { useVoice } from '@/store/voice';
import { extractAudio } from '@/utils/ffmpeg';
import { createVoicePreview, cloneVoice } from '@/utils/elevenlabs';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'cmn', name: 'Chinese (Mandarin)' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
];

interface VoiceDesignModalProps {
  onClose: () => void;
  onVoiceCreated: (voiceId: string) => void;
}

function VoiceDesignModal({ onClose, onVoiceCreated }: VoiceDesignModalProps) {
  const [activeTab, setActiveTab] = React.useState<'design' | 'clone'>('design');
  const [voiceName, setVoiceName] = React.useState('');
  const [voiceDescription, setVoiceDescription] = React.useState('');
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const [previewText, setPreviewText] = React.useState('');
  const [audioFiles, setAudioFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [processingVideo, setProcessingVideo] = React.useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = React.useState<string | null>(null);
  const [generatedVoiceId, setGeneratedVoiceId] = React.useState<string | null>(null);
  const [createdVoiceName, setCreatedVoiceName] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<{
    description?: string;
    text?: string;
    files?: string;
    name?: string;
  }>({});
  const [progress, setProgress] = React.useState<string>('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const validTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/x-m4a',
      'audio/mp3',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];
    const invalidFiles = files.filter(
      file => !validTypes.some(type => file.type.startsWith(type.split('/')[0]))
    );
    if (invalidFiles.length > 0) {
      setError(
        `Invalid file type(s): ${invalidFiles
          .map(f => f.type)
          .join(', ')}. Supported formats: mp3, wav, m4a, mp4, webm`
      );
      return;
    }

    // Validate file sizes
    const maxSize = 100 * 1024 * 1024; // 100MB max per file for videos
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(
        `Files too large: ${oversizedFiles
          .map(f => f.name)
          .join(', ')}. Maximum size: 100MB per file`
      );
      return;
    }

    // Process each file
    setProcessingVideo(true);
    const processedFiles: File[] = [];
    setError(null);

    for (const file of files) {
      try {
        if (file.type.startsWith('video/')) {
          // Extract audio from video
          const audioBlob = await extractAudio(file, 'mp3', 'high', progress => {
            setProgress(`Extracting audio from ${file.name}: ${progress}%`);
          });

          // Create audio file from blob
          const audioFile = new File([audioBlob], file.name.replace(/\.[^/.]+$/, '.mp3'), {
            type: 'audio/mp3',
          });

          // Ensure the audio file is valid before adding
          const isValidAudio = audioFile.size > 0 && audioFile.type === 'audio/mp3';
          if (!isValidAudio) {
            throw new Error('Failed to extract valid audio from video');
          }
          processedFiles.push(audioFile);
        } else {
          processedFiles.push(file);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process video file');
        setProcessingVideo(false);
        return;
      }
    }

    setAudioFiles(prev => [...prev, ...processedFiles]);
    setProcessingVideo(false);
  };

  const removeFile = (index: number) => {
    setAudioFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCloneVoice = async () => {
    // Reset validation errors
    setValidationErrors({});
    setError(null);
    setLoading(true);

    // Validate voice name
    if (!voiceName) {
      setValidationErrors(prev => ({
        ...prev,
        name: 'Voice name is required',
      }));
      return;
    }

    // Validate files
    if (audioFiles.length === 0) {
      setValidationErrors(prev => ({
        ...prev,
        files: 'Please upload at least one audio file',
      }));
      return;
    }

    if (audioFiles.length > 10) {
      setValidationErrors(prev => ({
        ...prev,
        files: 'Maximum 10 audio files allowed',
      }));
      return;
    }

    setError(null);

    try {
      // Validate audio files before cloning
      const validAudioFiles = audioFiles.filter(
        file => file.type.startsWith('audio/') && file.size > 0
      );

      if (validAudioFiles.length === 0) {
        throw new Error(
          'No valid audio files found. Please ensure your files are properly converted.'
        );
      }

      const result = await cloneVoice(voiceName, validAudioFiles, voiceDescription || undefined);

      setGeneratedVoiceId(result.voice_id);
      setCreatedVoiceName(voiceName);
      setSuccess(true);

      // Add warning about 5-minute automatic removal
      setTimeout(() => {
        setSuccess(false);
        setError('Note: This voice will be automatically removed after 15 minutes of inactivity.');
      }, 2000);
      // Notify parent component
      onVoiceCreated(result.voice_id);

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clone voice');
    } finally {
      setLoading(false);
      setProcessingVideo(false);
    }
  };

  const handleCreateVoice = async () => {
    // Reset validation errors
    setValidationErrors({});
    setError(null);

    // Validate voice description (20-1000 characters)
    if (!voiceDescription || voiceDescription.length < 20 || voiceDescription.length > 1000) {
      setValidationErrors(prev => ({
        ...prev,
        description: `Voice description must be between 20 and 1000 characters (currently ${
          voiceDescription.length || 0
        } characters)`,
      }));
    }

    // Validate preview text (100-1000 characters)
    if (!previewText || previewText.length < 100 || previewText.length > 1000) {
      setValidationErrors(prev => ({
        ...prev,
        text: `Preview text must be between 100 and 1000 characters (currently ${
          previewText.length || 0
        } characters)`,
      }));
    }

    // If any validation errors, stop here
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError(null);
    setPreviewAudioUrl(null);
    setGeneratedVoiceId(null);

    try {
      const result = await createVoicePreview(voiceDescription, voiceName, selectedLanguage);

      // Convert base64 audio to URL
      const audioBuffer = Uint8Array.from(atob(result.previews[0].audio_base_64), c =>
        c.charCodeAt(0)
      );
      const blob = new Blob([audioBuffer], { type: result.previews[0].media_type });
      const audioUrl = URL.createObjectURL(blob);

      setCreatedVoiceName(voiceName);
      setPreviewAudioUrl(audioUrl);
      setGeneratedVoiceId(result.previews[0].generated_voice_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create voice preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVoice = () => {
    if (generatedVoiceId) {
      onVoiceCreated(generatedVoiceId);
      setSuccess(true);
      // Keep modal open for 2 seconds to show success message
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center z-50">
      <div className="bg-[#1A1030] border border-white/20 rounded-xl shadow-lg w-full max-w-2xl p-6 m-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Custom Voice
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 p-1 bg-white/5 rounded-lg">
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
              activeTab === 'design'
                ? 'bg-[#4A2A7A] text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Design Voice
          </button>
          <button
            onClick={() => setActiveTab('clone')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
              activeTab === 'clone'
                ? 'bg-[#4A2A7A] text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4" />
            Clone Voice
          </button>
        </div>

        <div className="space-y-6">
          {/* Voice Name - Common for both tabs */}
          <div className="space-y-2 animate-fade-in">
            <label className="block text-sm font-medium">Voice Name</label>
            <InputWithPaste
              value={voiceName}
              onChange={e => setVoiceName(e.target.value)}
              onPasteText={text => setVoiceName(text)}
              className="input-area"
              placeholder="Give your voice a name (e.g., 'British Emma')"
            />
          </div>

          {activeTab === 'design' ? (
            <>
              <div className="space-y-2 animate-fade-in">
                <label className="block text-sm font-medium">Voice Description</label>
                <div className="relative">
                  <InputWithPaste
                    value={voiceDescription}
                    onChange={e => setVoiceDescription(e.target.value)}
                    onPasteText={text => setVoiceDescription(text)}
                    multiline
                    className={`input-area ${validationErrors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe the voice characteristics (e.g., 'A warm and friendly female voice with a slight British accent')"
                    rows={3}
                  />
                  <div className="absolute right-2 bottom-2 text-xs text-white/60">
                    {voiceDescription.length}/1000
                  </div>
                </div>
                {validationErrors.description ? (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.description}</p>
                ) : (
                  <p className="text-xs text-white/60">
                    Minimum 20 characters required. Be specific about the voice characteristics.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Voice Language</label>
                <select
                  value={selectedLanguage}
                  onChange={e => setSelectedLanguage(e.target.value)}
                  className="input-area text-black bg-white/90 font-medium"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-white/60">
                  Select the primary language for your multilingual voice. The voice will still be
                  able to speak other languages.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Preview Text</label>
                <div className="relative">
                  <InputWithPaste
                    value={previewText}
                    onChange={e => setPreviewText(e.target.value)}
                    onPasteText={text => setPreviewText(text)}
                    multiline
                    className={`input-area ${validationErrors.text ? 'border-red-500' : ''}`}
                    placeholder="Enter text to test the voice..."
                    rows={3}
                  />
                  <div className="absolute right-2 bottom-2 text-xs text-white/60">
                    {previewText.length}/1000
                  </div>
                </div>
                {validationErrors.text ? (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.text}</p>
                ) : (
                  <p className="text-xs text-white/60">
                    Minimum 100 characters required. The text should be long enough to demonstrate
                    voice characteristics.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Voice Samples</label>
                {processingVideo && (
                  <div className="text-amber-400 text-sm flex items-center gap-2 mb-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {progress || 'Extracting audio from video...'}
                  </div>
                )}
                {validationErrors.files && (
                  <p className="text-red-400 text-sm">{validationErrors.files}</p>
                )}
                <div className="p-6 border-2 border-dashed border-white/20 rounded-lg text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".mp3,.wav,.m4a,.mp4,.webm,.mov,audio/*,video/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="font-medium">Click to upload audio samples</span>
                    <span className="text-sm">or drag and drop audio/video files here</span>
                  </button>
                </div>
                <p className="text-xs text-white/60">
                  Upload 1-10 audio/video samples. Supported formats: mp3, wav, m4a, mp4, webm. Each
                  file should be 2-10 minutes long.
                </p>

                {/* File List */}
                {audioFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {audioFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#4A2A7A] rounded-lg flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-white/60">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {previewAudioUrl && (
            <div className="p-4 bg-white/5 rounded-lg space-y-2">
              <p className="text-sm font-medium">Preview:</p>
              <audio src={previewAudioUrl} controls className="w-full h-8">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
              <p className="font-medium">✨ Voice "{createdVoiceName}" created successfully!</p>
              <p className="text-sm mt-1 text-green-300/80">
                ⚠️ This voice will be automatically removed after 15 minutes
              </p>
              <p className="text-sm mt-2">
                You can find your new voice in the "My Custom Voices" section.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={activeTab === 'design' ? handleCreateVoice : handleCloneVoice}
              disabled={
                loading ||
                (activeTab === 'design'
                  ? !voiceDescription || !previewText
                  : audioFiles.length === 0)
              }
              className="flex-1 btn-primary py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Preview...
                </>
              ) : (
                <>
                  {activeTab === 'design' ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Preview
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Clone Voice
                    </>
                  )}
                </>
              )}
            </button>
            {previewAudioUrl && activeTab === 'design' && (
              <button
                onClick={handleSaveVoice}
                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
              >
                Save Voice
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceDesignModal;
