import React, { useState } from 'react';
import { X, Save, Lock } from 'lucide-react';
import { Video } from '@/types';
import VideoManager from '../components/VideoManager';
// import { useVideos } from '../context/VideoContext';
import { Calculator as CalculatorComponent } from '../components/Calculator/Calculator';

import Layout from '../components/updated/Layout';
import { Notes } from '@/components/Notes';
import { HabitTracker } from '@/components/HabitTracker';

interface ManageVideosProps {
  onBack: () => void;
}

const ADMIN_PASSWORD = '1612';

const ManageVideos: React.FC<ManageVideosProps> = ({ onBack }) => {
  //   const { videos, setVideos } = useVideos();
  const [currentPage, setCurrentPage] = useState<
    | 'home'
    | 'boards'
    | 'cod-track'
    | 'manage'
    | 'MyAdLibrary'
    | 'cod-search'
    | 'my-page'
    | 'my-library'
  >('home');

  const [showNotes, setShowNotes] = React.useState(false);
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [showHabitTracker, setshowHabitTracker] = useState(false);

  const [tempVideos, setTempVideos] = useState<Video[]>();
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleSave = () => {
    try {
      //   setVideos(tempVideos);
      setSaveStatus('Videos saved successfully!');
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error) {
      setSaveStatus('Error saving videos. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout
        onNavigateHome={() => setCurrentPage('home')}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center text-white/90 mb-8">
                Admin Access Required
              </h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/90 placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors duration-300"
                />
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 rounded-lg transition-colors duration-300 border border-purple-500/30 hover:border-purple-500/50"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      onNavigateHome={() => setCurrentPage('home')}
      setShowNotes={setShowNotes}
      setShowCalculator={setShowCalculator}
      setshowHabitTracker={setshowHabitTracker}
    >
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center">
            Manage Tutorial Videos
          </h1>
          {saveStatus && (
            <div
              className={`text-center mb-4 ${
                saveStatus.includes('Error') ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {saveStatus}
            </div>
          )}
          <VideoManager videos={tempVideos} onVideosChange={setTempVideos} />
        </div>
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
          <button
            onClick={handleSave}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-6 py-3 rounded-xl 
              transition-all duration-300 flex items-center gap-2 border border-green-500/30 
              hover:border-green-500/50 hover:scale-105 shadow-lg backdrop-blur-sm"
          >
            <Save size={20} />
            Save Changes
          </button>
          <button
            onClick={onBack}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-6 py-3 rounded-xl
              transition-all duration-300 flex items-center gap-2 border border-purple-500/30 
              hover:border-purple-500/50 hover:scale-105 shadow-lg backdrop-blur-sm"
          >
            <X size={20} />
            Close Editor
          </button>
        </div>
      </div>
      {showNotes && <Notes onClose={() => setShowNotes(false)} />}
      {showCalculator && <CalculatorComponent onClose={() => setShowCalculator(false)} />}
      {showHabitTracker && <HabitTracker onClose={() => setshowHabitTracker(false)} />}
    </Layout>
  );
};

export default ManageVideos;
