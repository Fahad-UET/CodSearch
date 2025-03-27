import React, { useEffect } from 'react';
import {
  LayoutGrid,
  Image,
  FileText,
  Megaphone,
  Search,
  Palette,
  Chrome,
  Video,
  Eye,
  Brain,
  Bot,
} from 'lucide-react';
import BinocularsIcon from './components/icon/BinocularsIcon';
import GoogleSearchIcon from './components/icon/GoogleSearchIcon';
import VideoModal from './components/updated/VideoModal';
import { useVideos } from './components/updated/VideoContext';
import ThumbnailImage from './components/updated/ThumbnailImage';
import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import CodTrack from './pages/CodTrack';
// import ManageVideos from './pages/ManageVideos';
import Layout from './components/updated/Layout';
import { ProfileSection } from './components/ProfileSection';
import { Notes } from './components/Notes';
import { Calculator as CalculatorComponent } from './components/Calculator/Calculator';
import { HabitTracker } from './components/HabitTracker';
import { AuthLayout } from './layouts/AuthLayout';
import { auth, isInitialized } from './services/firebase/config';
import { useProductStore } from './store';
import { useAuthState } from './hooks/useAuthState';
import AdGalleryView from './components/AdGallery/AdGalleryView';
import CodSearch from './components/updated/CodSearch/CodSearch';
import Mypages from './components/updated/MyPages/Mypages';
import MyLibrary from './components/updated/MyLibrary/MyLibrary';
import ManageVideos from './pages/ManageVideos';
import { getAllYouTubeVideos } from '@/services/firebase/YoutubeVideos';
import { getCredits, getCurrentCredits } from './services/firebase/credits';
import AICreator from '@/components/AICreator/Routes/App';
import { useLocation, useNavigate } from 'react-router-dom';

interface TutorialCardProps {
  title: string;
  videoId: string;
  onVideoClick: (videoId: string) => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ title, videoId, onVideoClick }) => (
  <div
    onClick={() => onVideoClick(videoId)}
    className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 w-full sm:w-64
    hover:shadow-[0_0_40px_rgba(167,139,250,0.2)] border border-white/10 hover:border-purple-500/30
    bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20"
  >
    <div className="aspect-video w-full">
      <ThumbnailImage videoId={videoId} title={title} />
    </div>
    <div
      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
      opacity-0 group-hover:opacity-100 transition-opacity duration-300
      flex items-end p-6 sm:p-8"
    >
      <h3
        className="text-white/90 font-medium text-lg sm:text-xl text-center tracking-wide line-clamp-2
        transform transition-all duration-500 group-hover:text-white w-full"
      >
        {title}
      </h3>
    </div>
  </div>
);

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  disabled?: boolean;
  comingSoon?: string;
  bottomIcon?: React.ReactNode;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  disabled,
  comingSoon,
  description,
  bottomIcon,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`relative bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8 rounded-2xl 
    transition-all duration-300 ease-in-out group hover:shadow-[0_0_40px_rgba(167,139,250,0.2)]
   flex flex-col items-center gap-3 sm:gap-4 w-full sm:w-64 backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20
    border border-white/10 hover:border-purple-500/30
    ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-none' : 'cursor-pointer'}`}
  >
    <div
      className="text-white/90 transform transition-transform duration-700 
     group-hover:text-white"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9">{icon}</div>
    </div>
    <h3
      className="text-white/90 font-medium text-lg sm:text-xl text-center tracking-wide
     transform transition-all duration-500 group-hover:text-white"
    >
      {title}
    </h3>
    {(bottomIcon || description) && (
      <div className="flex items-center justify-center text-white/60 mt-2">
        <div className="flex items-center gap-2">
          {bottomIcon && <div className="w-5 h-5">{bottomIcon}</div>}
          <span className="text-xs">{description}</span>
        </div>
      </div>
    )}
    {comingSoon && (
      <div className="mt-2 text-white/90 text-xs font-medium px-2 py-0.5 rounded-full border border-white/20 bg-white/10 text-center w-full whitespace-nowrap overflow-hidden text-ellipsis">
        {comingSoon}
      </div>
    )}
  </div>
);

function App() {
  const location = useLocation();
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);
  const [showAllVideos, setShowAllVideos] = React.useState(false);
  const [showNotes, setShowNotes] = React.useState(false);
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [showHabitTracker, setshowHabitTracker] = useState(false);
  const { user, setUser } = useProductStore();
  const { currentPage, setCurrentPage } = useProductStore();
  const [videos, setVideos] = useState([]);
  const { isLoading } = useAuthState();
  const navigate = useNavigate();
  const { setPackage } = useProductStore();
  useEffect(() => {
    const getUserCredits = async () => {
      try {
        const result: any = await getCurrentCredits(user?.uid);
        if (!result) return;
        setPackage(result.plan, result.credits);
      } catch (error) {
        console.log(error);
      }
    };
    if (user?.uid) {
      getUserCredits();
    }
  }, [user]);

  useEffect(() => {
    getYouTubeVideos();
  }, [currentPage]);

  const getYouTubeVideos = async () => {
    try {
      const result = await getAllYouTubeVideos();
      result ? setVideos(result) : setVideos([]);
    } catch (error) {
      console.log('There is some error while fetching the videos.');
    }
  };
  useEffect(() => {
    if (!isInitialized) {
      console.error('Firebase not initialized');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser, isInitialized]);

  useEffect(() => {
    navigate('/');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleCardClick = (title: string) => {
    if (title === 'My Boards') {
      setCurrentPage('boards');
    } else if (title === 'COD Track') {
      setCurrentPage('cod-track');
    } else if (title === 'MyAdLibrary') {
      setCurrentPage('MyAdLibrary');
    } else if (title === 'cod-search') {
      setCurrentPage('cod-search');
    } else if (title === 'my-page') {
      setCurrentPage('my-page');
    } else if (title === 'my-library') {
      setCurrentPage('my-library');
    } else if (title === 'AI Creator') {
      setCurrentPage('ai-creator');
    }
  };

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const displayedVideos = showAllVideos ? videos : videos.slice(0, 4);

  if (currentPage === 'boards') {
    return <MainLayout onBack={() => setCurrentPage('home')} />;
  }
  if (currentPage === 'cod-track') {
    return (
      <Layout
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <CodTrack onBack={() => setCurrentPage('home')} />
      </Layout>
    );
  }

  if (currentPage === 'MyAdLibrary') {
    return (
      <Layout
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <AdGalleryView onBack={() => setCurrentPage('home')} />
      </Layout>
    );
  }
  if (currentPage === 'cod-search') {
    return (
      <Layout
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <CodSearch onBack={() => setCurrentPage('home')} />
      </Layout>
    );
  }
  if (currentPage === 'my-page') {
    return (
      <Layout
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <Mypages onBack={() => setCurrentPage('home')} />
      </Layout>
    );
  }
  if (currentPage === 'my-library') {
    return (
      <Layout
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <MyLibrary onBack={() => setCurrentPage('home')} />
      </Layout>
    );
  }

  if (currentPage === 'manage') {
    return (
      <Layout
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <ManageVideos onBack={() => setCurrentPage('home')} />
      </Layout>
    );
  }
  if (currentPage === 'ai-creator') {
    return (
      <AICreator
        onBack={() => setCurrentPage('home')}
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      />
    );
  }

  return (
    <>
      {user ? (
        <Layout
          onNavigateHome={() => setCurrentPage('home')}
          setShowNotes={setShowNotes}
          setShowCalculator={setShowCalculator}
          setshowHabitTracker={setshowHabitTracker}
        >
          <div
            className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-purple-900 via-slate-900 to-black flex flex-col items-center py-4 sm:py-6 px-4 sm:px-8
        relative"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h1v1H0z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.03)%22%2F%3E%3C%2Fsvg%3E')] opacity-20"></div>

            <div className="flex flex-col gap-8 max-w-[1400px] w-full relative z-10">
              {/* Libraries and Applications Row */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Libraries Section */}
                <section className="relative group flex-1">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
            rounded-3xl
            border border-white/10 backdrop-blur-sm -z-10"
                  ></div>
                  <div className="p-3 sm:p-4 rounded-3xl">
                    <h2
                      className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-300/90 to-pink-300/90 mb-3 sm:mb-4 
            text-center
            after:content-[''] after:block after:w-full after:h-[2px] after:mt-2
            after:bg-gradient-to-r after:from-purple-500/50 after:to-pink-500/50"
                    >
                      My Libraries
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 place-items-center">
                      <Card
                        icon={<LayoutGrid size={32} />}
                        title="My Boards"
                        description="Find winning products"
                        onClick={() => handleCardClick('My Boards')}
                      />
                      <Card
                        icon={<Megaphone size={32} />}
                        title="My Ad Library"
                        description="Ad creatives"
                        onClick={() => handleCardClick('MyAdLibrary')}
                      />
                      <Card
                        icon={<FileText size={32} />}
                        title="My Pages Library"
                        description="Product pages"
                        onClick={() => handleCardClick('my-page')}
                      />
                      <Card
                        icon={<Image size={32} />}
                        title="My Photos Library"
                        description="Product images"
                        onClick={() => handleCardClick('my-library')}
                      />
                    </div>
                  </div>
                </section>

                {/* Applications Section */}
                <section className="relative group flex-1">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 
            rounded-3xl
            border border-white/10 backdrop-blur-sm -z-10"
                  ></div>
                  <div className="p-3 sm:p-4 rounded-3xl">
                    <h2
                      className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent 
            bg-gradient-to-r from-pink-300/90 to-purple-300/90 mb-3 sm:mb-4
            text-center
            after:content-[''] after:block after:w-full after:h-[2px] after:mt-2
            after:bg-gradient-to-r after:from-pink-500/50 after:to-purple-500/50"
                    >
                      Applications
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 place-items-center">
                      <Card
                        icon={<Search size={32} />}
                        title="COD Search"
                        bottomIcon={<GoogleSearchIcon size={20} />}
                        description="Powered by Google Search"
                        onClick={() => handleCardClick('cod-search')}
                      />
                      <Card
                        icon={<BinocularsIcon size={32} />}
                        title="COD Track"
                        bottomIcon={<Chrome size={20} className="mr-2" />}
                        description="Chrome Extension"
                        onClick={() => handleCardClick('COD Track')}
                      />
                      <Card
                        icon={<Brain size={32} />}
                        title="AI Creator"
                        description="Generate videos, images, voice & text"
                        onClick={() => handleCardClick('AI Creator')}
                      />
                      <Card
                        icon={<Eye size={32} />}
                        title="AI Analytics"
                        description="AI ads & landing page analysis"
                        onClick={() => handleCardClick('AI Analytics')}
                      />
                    </div>
                  </div>
                </section>
              </div>

              <section className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-slate-500/10 to-slate-400/10 
            rounded-3xl border border-white/10 backdrop-blur-sm -z-10"
                ></div>
                <div className="p-3 sm:p-4 rounded-3xl">
                  <h2
                    className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent 
              bg-gradient-to-r from-slate-300/90 to-zinc-300/90 mb-3 sm:mb-4
              text-center
              after:content-[''] after:block after:w-full after:h-[2px] after:mt-2
              after:bg-gradient-to-r after:from-slate-500/50 after:to-zinc-500/50"
                  >
                    Coming Soon
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
                    <Card
                      icon={<Palette size={32} />}
                      title="COD Design"
                      disabled={true}
                      comingSoon="Coming Soon: Landing page image creation -80% time 🚀"
                      onClick={() => handleCardClick('COD Design')}
                    />
                    <Card
                      icon={<Video size={32} />}
                      title="COD Video"
                      disabled={true}
                      comingSoon="Coming Soon: Video editing -80% time 🚀"
                      onClick={() => handleCardClick('COD Video')}
                    />
                    <Card
                      icon={<Bot size={32} />}
                      title="AI Agent"
                      disabled={true}
                      comingSoon="Coming Soon: AI agent for repetitive tasks automation 🤖"
                      onClick={() => handleCardClick('AI Agent')}
                    />
                  </div>
                </div>
              </section>

              {/* YouTube Tutorials Section */}
              <section className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 
            rounded-3xl
            border border-white/10 backdrop-blur-sm -z-10"
                ></div>
                <div className="p-3 sm:p-4 rounded-3xl">
                  <h2
                    className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent relative
              bg-gradient-to-r from-purple-300/90 to-pink-300/90 mb-3 sm:mb-4
              after:content-[''] after:block after:w-full after:h-[2px] after:mt-2
              after:bg-gradient-to-r after:from-purple-500/50 after:to-pink-500/50"
                  >
                    <span className="flex items-center gap-2">
                      Tutorial Videos
                      <button
                        onClick={() => setCurrentPage('manage')}
                        className="text-white/20 hover:text-purple-400
                    transition-colors duration-300 p-1 rounded-full
                    hover:bg-purple-500/10 group"
                        title="Manage Videos"
                      >
                        <Video
                          size={16}
                          className="transform transition-transform duration-300 group-hover:scale-110"
                        />
                      </button>
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {displayedVideos.map(video => (
                      <TutorialCard
                        key={video.id}
                        title={video.title}
                        videoId={video.videoId}
                        onVideoClick={handleVideoClick}
                      />
                    ))}
                  </div>
                  {videos.length > 4 && (
                    <div className="flex justify-center mt-3">
                      <button
                        onClick={() => setShowAllVideos(!showAllVideos)}
                        className="group bg-gradient-to-br from-white/10 to-white/5 hover:from-purple-500/20 hover:to-pink-500/20
                    text-white/90 px-4 py-1.5 rounded-lg transition-all duration-300
                    border border-white/10 hover:border-purple-500/30 flex items-center gap-1.5 text-sm"
                      >
                        <span>{showAllVideos ? 'Show Less' : 'Show More'}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            showAllVideos ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -left-48 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/30 rounded-full filter blur-[96px] sm:blur-[128px]"></div>
            <div className="absolute bottom-1/4 -right-48 w-72 sm:w-96 h-72 sm:h-96 bg-pink-500/30 rounded-full filter blur-[96px] sm:blur-[128px]"></div>

            <VideoModal
              videoId={selectedVideo || ''}
              isOpen={selectedVideo !== null}
              onClose={handleCloseVideo}
            />
            {showNotes && <Notes onClose={() => setShowNotes(false)} />}
            {showCalculator && <CalculatorComponent onClose={() => setShowCalculator(false)} />}
            {showHabitTracker && <HabitTracker onClose={() => setshowHabitTracker(false)} />}
          </div>
        </Layout>
      ) : (
        <AuthLayout />
      )}
    </>
  );
}

export default App;

// import React, { useEffect } from 'react';
// import { useProductStore } from './store';
// import { auth, isInitialized } from './services/firebase/config';
// import { logoutUser } from './services/firebase';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { MainLayout } from './layouts/MainLayout';
// import { AuthLayout } from './layouts/AuthLayout';
// // import { PricingPage } from '';
// import { useAuthState } from './hooks/useAuthState';
// import Home from './pages/Home';
// import Auth from './pages/Auth';
// import GanttView from './pages/GanttView';
// import Contact from './pages/Contact';
// import Terms from './pages/Terms';
// import EditProfile from './pages/EditProfile';
// import ApiKeys from './pages/ApiKeys';

// export default function App() {
//   const { user, setUser } = useProductStore();
//   const { isLoading } = useAuthState();

//   useEffect(() => {
//     if (!isInitialized) {
//       console.error('Firebase not initialized');
//       return;
//     }

//     const unsubscribe = auth.onAuthStateChanged(user => {
//       setUser(user);
//     });

//     return () => unsubscribe();
//   }, [setUser, isInitialized]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* <Route path="/pricing" element={<PricingPage />} /> */}
//         <Route path="/*" element={!user ? <AuthLayout /> : <MainLayout />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/terms" element={<Terms />} />
//         <Route path="/edit-profile" element={<EditProfile />} />
//         <Route path="/api-keys" element={<ApiKeys />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
