import React from 'react';
import { X } from 'lucide-react';
import { Sparkles, Loader2, Upload, X as XIcon } from 'lucide-react';
import InputWithPaste from './InputWithPaste';
import { submitToQueue } from '@/utils/api';

interface PromptGeneratorModalProps {
  onClose: () => void;
  onPromptGenerated: (prompt: string) => void;
}

type StyleEnum =
  | 'Minimalist'
  | 'Simple'
  | 'Detailed'
  | 'Descriptive'
  | 'Dynamic'
  | 'Cinematic'
  | 'Documentary'
  | 'Animation'
  | 'Action'
  | 'Experimental';
type CameraStyleEnum =
  | 'None'
  | 'Steadicam flow'
  | 'Drone aerials'
  | 'Handheld urgency'
  | 'Crane elegance'
  | 'Dolly precision'
  | 'VR 360'
  | 'Multi-angle rig'
  | 'Static tripod'
  | 'Gimbal smoothness'
  | 'Slider motion'
  | 'Jib sweep'
  | 'POV immersion'
  | 'Time-slice array'
  | 'Macro extreme'
  | 'Tilt-shift miniature'
  | 'Snorricam character'
  | 'Whip pan dynamics'
  | 'Dutch angle tension'
  | 'Underwater housing'
  | 'Periscope lens';
type CameraDirectionEnum =
  | 'None'
  | 'Zoom in'
  | 'Zoom out'
  | 'Pan left'
  | 'Pan right'
  | 'Tilt up'
  | 'Tilt down'
  | 'Orbital rotation'
  | 'Push in'
  | 'Pull out'
  | 'Track forward'
  | 'Track backward'
  | 'Spiral in'
  | 'Spiral out'
  | 'Arc movement'
  | 'Diagonal traverse'
  | 'Vertical rise'
  | 'Vertical descent';
type PacingEnum =
  | 'None'
  | 'Slow burn'
  | 'Rhythmic pulse'
  | 'Frantic energy'
  | 'Ebb and flow'
  | 'Hypnotic drift'
  | 'Time-lapse rush'
  | 'Stop-motion staccato'
  | 'Gradual build'
  | 'Quick cut rhythm'
  | 'Long take meditation'
  | 'Jump cut energy'
  | 'Match cut flow'
  | 'Cross-dissolve dreamscape'
  | 'Parallel action'
  | 'Slow motion impact'
  | 'Ramping dynamics'
  | 'Montage tempo'
  | 'Continuous flow'
  | 'Episodic breaks';
type SpecialEffectsEnum =
  | 'None'
  | 'Practical effects'
  | 'CGI enhancement'
  | 'Analog glitches'
  | 'Light painting'
  | 'Projection mapping'
  | 'Nanosecond exposures'
  | 'Double exposure'
  | 'Smoke diffusion'
  | 'Lens flare artistry'
  | 'Particle systems'
  | 'Holographic overlay'
  | 'Chromatic aberration'
  | 'Digital distortion'
  | 'Wire removal'
  | 'Motion capture'
  | 'Miniature integration'
  | 'Weather simulation'
  | 'Color grading'
  | 'Mixed media composite'
  | 'Neural style transfer';
type ModelEnum =
  | 'anthropic/claude-3.5-sonnet'
  | 'anthropic/claude-3-5-haiku'
  | 'anthropic/claude-3-haiku'
  | 'google/gemini-pro-1.5'
  | 'google/gemini-flash-1.5'
  | 'google/gemini-flash-1.5-8b'
  | 'meta-llama/llama-3.2-1b-instruct'
  | 'meta-llama/llama-3.2-3b-instruct'
  | 'meta-llama/llama-3.1-8b-instruct'
  | 'meta-llama/llama-3.1-70b-instruct'
  | 'openai/gpt-4o-mini'
  | 'openai/gpt-4o'
  | 'deepseek/deepseek-r1';
type PromptLengthEnum = 'Short' | 'Medium' | 'Long';

function PromptGeneratorModal({ onClose, onPromptGenerated }: PromptGeneratorModalProps) {
  const [concept, setConcept] = React.useState('');
  const [style, setStyle] = React.useState<StyleEnum>('Simple');
  const [cameraStyle, setCameraStyle] = React.useState<CameraStyleEnum>('None');
  const [cameraDirection, setCameraDirection] = React.useState<CameraDirectionEnum>('None');
  const [pacing, setPacing] = React.useState<PacingEnum>('None');
  const [specialEffects, setSpecialEffects] = React.useState<SpecialEffectsEnum>('None');
  const [customElements, setCustomElements] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [model, setModel] = React.useState<ModelEnum>('google/gemini-flash-1.5');
  const [promptLength, setPromptLength] = React.useState<PromptLengthEnum>('Medium');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const API_KEY =
    import.meta.env.VITE_FAL_KEY || '';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      if (file.size > maxSize) {
        setError(
          'File size must be less than 10MB. Please compress your image or use a smaller file.'
        );
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const maxDimension = 1024;
        if (img.width > maxDimension || img.height > maxDimension) {
          setError(
            `Image dimensions too large. Maximum allowed is ${maxDimension}x${maxDimension} pixels.`
          );
          return;
        }

        // If dimensions are ok, proceed with base64 conversion
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
          setIsBase64(true);
          setError(null);
        };
        reader.readAsDataURL(file);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        setError('Invalid image file. Please use a supported format (jpg, jpeg, png, webp).');
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setIsBase64(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!concept) {
      setError('Please provide a concept');
      setLoading(false);
      return;
    }

    try {
      const requestOptions = {
        input_concept: concept,
        style,
        camera_style: cameraStyle,
        camera_direction: cameraDirection,
        pacing,
        special_effects: specialEffects,
        model,
        prompt_length: promptLength,
        ...(customElements && { custom_elements: customElements }),
        ...(imageUrl && { image_url: imageUrl }),
      };

      const result: any = await submitToQueue(
        'fal-ai/video-prompt-generator',
        API_KEY,
        requestOptions,
        status => {
          console.log('Status:', status);
        }
      );

      onPromptGenerated(result?.prompt);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050510] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A1030] via-[#0F0820] to-[#050510] z-50 animate-fade-in">
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Video Prompt Generator</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Close</span>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium">
                Reference Image
              </label>
              <div className="flex gap-2">
                <InputWithPaste
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e)}
                  onPasteText={text => handleUrlChange({ target: { value: text } } as any)}
                  className="input-area flex-1"
                  placeholder="https://example.com/image.jpg"
                  disabled={isBase64}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                  title="Upload Image"
                >
                  <Upload className="w-5 h-5" />
                </button>
                {isBase64 && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setIsBase64(false);
                    }}
                    className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="concept" className="block text-sm font-medium">
                Core Concept
              </label>
              <InputWithPaste
                id="concept"
                value={concept}
                onChange={e => setConcept(e.target.value)}
                onPasteText={text => setConcept(text)}
                multiline
                className="input-area"
                placeholder="Describe your core video concept..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Style</label>
                <select
                  value={style}
                  onChange={e => setStyle(e.target.value as StyleEnum)}
                  className="input-area"
                >
                  <option value="Minimalist">Minimalist</option>
                  <option value="Simple">Simple</option>
                  <option value="Detailed">Detailed</option>
                  <option value="Descriptive">Descriptive</option>
                  <option value="Dynamic">Dynamic</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Animation">Animation</option>
                  <option value="Action">Action</option>
                  <option value="Experimental">Experimental</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Camera Style</label>
                <select
                  value={cameraStyle}
                  onChange={e => setCameraStyle(e.target.value as CameraStyleEnum)}
                  className="input-area"
                >
                  <option value="None">None</option>
                  <option value="Steadicam flow">Steadicam Flow</option>
                  <option value="Drone aerials">Drone Aerials</option>
                  <option value="Handheld urgency">Handheld Urgency</option>
                  <option value="Crane elegance">Crane Elegance</option>
                  <option value="Dolly precision">Dolly Precision</option>
                  <option value="VR 360">VR 360</option>
                  <option value="Multi-angle rig">Multi-angle Rig</option>
                  <option value="Static tripod">Static Tripod</option>
                  <option value="Gimbal smoothness">Gimbal Smoothness</option>
                  <option value="Slider motion">Slider Motion</option>
                  <option value="Jib sweep">Jib Sweep</option>
                  <option value="POV immersion">POV Immersion</option>
                  <option value="Time-slice array">Time-slice Array</option>
                  <option value="Macro extreme">Macro Extreme</option>
                  <option value="Tilt-shift miniature">Tilt-shift Miniature</option>
                  <option value="Snorricam character">Snorricam Character</option>
                  <option value="Whip pan dynamics">Whip Pan Dynamics</option>
                  <option value="Dutch angle tension">Dutch Angle Tension</option>
                  <option value="Underwater housing">Underwater Housing</option>
                  <option value="Periscope lens">Periscope Lens</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Camera Direction</label>
                <select
                  value={cameraDirection}
                  onChange={e => setCameraDirection(e.target.value as CameraDirectionEnum)}
                  className="input-area"
                >
                  <option value="None">None</option>
                  <option value="Zoom in">Zoom In</option>
                  <option value="Zoom out">Zoom Out</option>
                  <option value="Pan left">Pan Left</option>
                  <option value="Pan right">Pan Right</option>
                  <option value="Tilt up">Tilt Up</option>
                  <option value="Tilt down">Tilt Down</option>
                  <option value="Orbital rotation">Orbital Rotation</option>
                  <option value="Push in">Push In</option>
                  <option value="Pull out">Pull Out</option>
                  <option value="Track forward">Track Forward</option>
                  <option value="Track backward">Track Backward</option>
                  <option value="Spiral in">Spiral In</option>
                  <option value="Spiral out">Spiral Out</option>
                  <option value="Arc movement">Arc Movement</option>
                  <option value="Diagonal traverse">Diagonal Traverse</option>
                  <option value="Vertical rise">Vertical Rise</option>
                  <option value="Vertical descent">Vertical Descent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Pacing</label>
                <select
                  value={pacing}
                  onChange={e => setPacing(e.target.value as PacingEnum)}
                  className="input-area"
                >
                  <option value="None">None</option>
                  <option value="Slow burn">Slow Burn</option>
                  <option value="Rhythmic pulse">Rhythmic Pulse</option>
                  <option value="Frantic energy">Frantic Energy</option>
                  <option value="Ebb and flow">Ebb and Flow</option>
                  <option value="Hypnotic drift">Hypnotic Drift</option>
                  <option value="Time-lapse rush">Time-lapse Rush</option>
                  <option value="Stop-motion staccato">Stop-motion Staccato</option>
                  <option value="Gradual build">Gradual Build</option>
                  <option value="Quick cut rhythm">Quick Cut Rhythm</option>
                  <option value="Long take meditation">Long Take Meditation</option>
                  <option value="Jump cut energy">Jump Cut Energy</option>
                  <option value="Match cut flow">Match Cut Flow</option>
                  <option value="Cross-dissolve dreamscape">Cross-dissolve Dreamscape</option>
                  <option value="Parallel action">Parallel Action</option>
                  <option value="Slow motion impact">Slow Motion Impact</option>
                  <option value="Ramping dynamics">Ramping Dynamics</option>
                  <option value="Montage tempo">Montage Tempo</option>
                  <option value="Continuous flow">Continuous Flow</option>
                  <option value="Episodic breaks">Episodic Breaks</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Special Effects</label>
                <select
                  value={specialEffects}
                  onChange={e => setSpecialEffects(e.target.value as SpecialEffectsEnum)}
                  className="input-area"
                >
                  <option value="None">None</option>
                  <option value="Practical effects">Practical Effects</option>
                  <option value="CGI enhancement">CGI Enhancement</option>
                  <option value="Analog glitches">Analog Glitches</option>
                  <option value="Light painting">Light Painting</option>
                  <option value="Projection mapping">Projection Mapping</option>
                  <option value="Nanosecond exposures">Nanosecond Exposures</option>
                  <option value="Double exposure">Double Exposure</option>
                  <option value="Smoke diffusion">Smoke Diffusion</option>
                  <option value="Lens flare artistry">Lens Flare Artistry</option>
                  <option value="Particle systems">Particle Systems</option>
                  <option value="Holographic overlay">Holographic Overlay</option>
                  <option value="Chromatic aberration">Chromatic Aberration</option>
                  <option value="Digital distortion">Digital Distortion</option>
                  <option value="Wire removal">Wire Removal</option>
                  <option value="Motion capture">Motion Capture</option>
                  <option value="Miniature integration">Miniature Integration</option>
                  <option value="Weather simulation">Weather Simulation</option>
                  <option value="Color grading">Color Grading</option>
                  <option value="Mixed media composite">Mixed Media Composite</option>
                  <option value="Neural style transfer">Neural Style Transfer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Model</label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value as ModelEnum)}
                  className="input-area"
                >
                  <optgroup label="Fast Models">
                    <option value="google/gemini-flash-1.5">Gemini Flash 1.5</option>
                    <option value="google/gemini-flash-1.5-8b">Gemini Flash 1.5 8B</option>
                    <option value="meta-llama/llama-3.2-1b-instruct">Llama 3.2 1B</option>
                    <option value="meta-llama/llama-3.2-3b-instruct">Llama 3.2 3B</option>
                  </optgroup>
                  <optgroup label="Standard Models">
                    <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                    <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</option>
                    <option value="deepseek/deepseek-r1">DeepSeek R1</option>
                  </optgroup>
                  <optgroup label="Premium Models">
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="anthropic/claude-3-5-haiku">Claude 3.5 Haiku</option>
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                    <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
                    <option value="openai/gpt-4o-mini">GPT-4 Mini</option>
                    <option value="openai/gpt-4o">GPT-4</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Prompt Length</label>
                <select
                  value={promptLength}
                  onChange={e => setPromptLength(e.target.value as PromptLengthEnum)}
                  className="input-area"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>

              <div className="space-y-2"></div>
            </div>

            <div className="space-y-2">
              <label htmlFor="customElements" className="block text-sm font-medium">
                Custom Technical Elements (Optional)
              </label>
              <InputWithPaste
                id="customElements"
                value={customElements}
                onChange={e => setCustomElements(e.target.value)}
                onPasteText={text => setCustomElements(text)}
                multiline
                className="input-area"
                placeholder="Add any custom technical elements..."
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !concept}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#4A2A7A] to-[#7A4AAA] hover:from-[#5A3A8A] hover:to-[#8A5ABA] disabled:from-[#2A1A5A] disabled:to-[#4A2A7A] disabled:cursor-not-allowed rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-[#2A1A5A]/20 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Prompt
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PromptGeneratorModal;
