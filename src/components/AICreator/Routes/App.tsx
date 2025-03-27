import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import LandingPage from '@/pages/LandingPage';
import VideoGenerator from '@/pages/VideoGenerator';
import VideoBackgroundRemover from '@/pages/VideoBackgroundRemover';
import AudioTranscription from '@/pages/AudioTranscription';
import LipSync from '@/pages/LipSync';
import SpeechToVideo from '@/pages/SpeechToVideo';
import PromptGenerator from '@/pages/PromptGenerator';
import TextToImage from '@/pages/TextToImage';
import ImageGenerator from '@/pages/ImageGenerator';
import TextGenerator from '@/pages/TextGenerator';
import Veo2Generator from '@/pages/Veo2Generator';
import TextToSpeech from '@/pages/TextToSpeech';
import ImageWatermarkRemover from '@/pages/ImageWatermarkRemover';
import VideoWatermarkRemover from '@/pages/VideoWatermarkRemover';
import VideoToAudio from '@/pages/VideoToAudio';
import ChangeImageBackground from '@/pages/ChangeImageBackground';
import RemoveImageBackground from '@/pages/RemoveImageBackground';
import FaceRetoucher from '@/pages/FaceRetoucher';
import FaceSwapImageToVideo from '@/pages/FaceSwapImageToVideo';
import ImageToText from '@/pages/ImageToText';
import OutfitsImageToImage from '@/pages/OutfitsImageToImage';
import OutfitsImageToVideo from '@/pages/OutfitsImageToVideo';
import ProductImageToImage from '@/pages/ProductImageToImage';
import ProductImageVariations from '@/pages/ProductImageVariations';
import ProductImageToVideo from '@/pages/ProductImageToVideo';
import ProductObjectReplacer from '@/pages/ProductObjectReplacer';
import ImageUpscaler from '@/pages/ImageUpscaler';
import VideoUpscaler from '@/pages/VideoUpscaler';
import BackgroundTasks from '../BackgroundTasks';
import { useHistory } from '@/store/history';
import { useEffect, useState } from 'react';
import { useProductStore } from '@/store';
import { getAllAiGenerations } from '@/services/firebase/aiGenerations';
import TopBar from '@/components/updated/TopBar';

type AIProps = {
  onNavigateHome?: () => void;
  setShowNotes: (val: boolean) => void;
  setShowCalculator: (val: boolean) => void;
  setshowHabitTracker: (val: boolean) => void;
  onBack: () => void;
};
function App({
  onBack,
  onNavigateHome,
  setShowNotes,
  setShowCalculator,
  setshowHabitTracker,
}: AIProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useProductStore();
  const { items, setItems } = useHistory(state => ({
    items: state.items,
    setItems: state.setItems,
  }));
  useEffect(() => {
    if (items.length === 0) {
      const fetchData = async () => {
        const historyItems = await getAllAiGenerations(user?.uid);
        setItems(historyItems);
      };
      fetchData();
    }
  }, []);

  const route = location.pathname;
  return (
    <>
      <TopBar
        onNavigateHome={onNavigateHome}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      />
      <div className="min-h-screen bg-[#050510] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A1030] via-[#0F0820] to-[#050510] text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-[10px] opacity-60">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#6A3ABA] to-[#4A2A7A] blur-[120px] animate-pulse"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-[#9A6ACA] to-[#7A4AAA] blur-[120px] animate-pulse delay-700"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#3A2A6A] to-[#2A1A5A] blur-[120px] animate-pulse delay-1000"></div>
          </div>
        </div>
        <Sidebar
          onBack={onBack}
          isCollapsed={isCollapsed}
          setIsCollapsed={() => setIsCollapsed(prev => !prev)}
        />

        <main
          className={`${
            isCollapsed ? 'pl-20' : 'pl-56'
          } pr-2 pb-6 pt-16 relative max-w-[2000px] mx-auto transform-style-3d perspective-1000`}
        >
          {route === '/' && <LandingPage />}
          <Routes>
            <Route path="/video" element={<VideoGenerator />} />
            <Route path="/video-background-remover" element={<VideoBackgroundRemover />} />
            <Route path="/transcribe" element={<AudioTranscription />} />
            <Route path="/speech-to-video" element={<SpeechToVideo />} />
            <Route path="/prompt" element={<PromptGenerator />} />
            <Route path="/lipsync" element={<LipSync />} />
            <Route path="/text-to-image" element={<TextToImage />} />
            <Route path="/image" element={<ImageGenerator />} />
            <Route path="/text" element={<TextGenerator />} />
            <Route path="/veo2" element={<Veo2Generator />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
            <Route path="/image-watermark-remover" element={<ImageWatermarkRemover />} />
            <Route path="/video-watermark-remover" element={<VideoWatermarkRemover />} />
            <Route path="/video-to-audio" element={<VideoToAudio />} />
            <Route path="/change-image-background" element={<ChangeImageBackground />} />
            <Route path="/remove-image-background" element={<RemoveImageBackground />} />
            <Route path="/face-retoucher" element={<FaceRetoucher />} />
            <Route path="/face-swap" element={<FaceSwapImageToVideo />} />
            <Route path="/image-to-text" element={<ImageToText />} />
            <Route path="/outfits-image" element={<OutfitsImageToImage />} />
            <Route path="/outfits-video" element={<OutfitsImageToVideo />} />
            <Route path="/product-image" element={<ProductImageToImage />} />
            <Route path="/product-variations" element={<ProductImageVariations />} />
            <Route path="/product-video" element={<ProductImageToVideo />} />
            <Route path="/product-replace" element={<ProductObjectReplacer />} />
            <Route path="/image-upscaler" element={<ImageUpscaler />} />
            <Route path="/video-upscaler" element={<VideoUpscaler />} />
          </Routes>
        </main>
        <BackgroundTasks />
      </div>
    </>
  );
}

export default App;
