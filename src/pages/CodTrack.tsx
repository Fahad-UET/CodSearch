import React from 'react';
import {
  ArrowLeft,
  Download,
  Save,
  FileText,
  Video,
  Image,
  Star,
  Layers,
  Zap,
  Clock,
  Target,
  Database,
} from 'lucide-react';
import Layout from '../components/updated/Layout';
import { useState } from 'react';

interface CodTrackProps {
  onBack: () => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div
    className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6
    border border-white/10 hover:border-purple-500/30 transition-all duration-300
    hover:shadow-[0_0_40px_rgba(167,139,250,0.2)] group backdrop-blur-xl
    hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20"
  >
    <div className="flex items-start gap-4">
      <div
        className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10
        group-hover:border-purple-500/30 group-hover:from-purple-500/20 group-hover:to-pink-500/20
        text-purple-400 transition-colors duration-300"
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-white/90 mb-2 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const SupportedSite: React.FC<{
  name: string;
  icon: React.ReactNode;
}> = ({ name, icon }) => (
  <div
    className="group relative bg-white/5 hover:bg-white/10 px-4 py-3 rounded-lg
    border border-white/10 hover:border-purple-500/30 transition-all duration-300
    hover:shadow-[0_0_20px_rgba(167,139,250,0.1)]"
  >
    <div className="flex items-center gap-3 text-white/60 group-hover:text-white/90 transition-colors">
      {icon}
      <span className="font-medium">{name}</span>
    </div>
  </div>
);

const CodTrack: React.FC<CodTrackProps> = ({ onBack }) => {
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.open('https://chrome.google.com/webstore/category/extensions', '_blank');
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <Layout>
      <div
        className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-purple-900 via-slate-900 to-black"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h1v1H0z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.03)%22%2F%3E%3C%2Fsvg%3E')] opacity-20"></div>

        {/* Navigation */}
        <div className="relative border-b border-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white flex items-center gap-2
                transition-colors duration-300 hover:bg-white/5 rounded-lg p-2"
            >
              <ArrowLeft size={20} />
            </button>
            <h1
              className="text-2xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-400 to-pink-400"
            >
              COD Track Extension
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Video Preview Section */}
          <div
            className="relative aspect-video w-full max-w-5xl mx-auto mb-8 rounded-2xl overflow-hidden
            bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10
            shadow-[0_0_40px_rgba(167,139,250,0.2)]"
          >
            <iframe
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              src="https://www.youtube.com/embed/II3j-dj-bWU?rel=0&controls=1"
              title="COD Track Extension Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Hero Text */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
              Track & Save Content <span className="text-purple-400">Effortlessly</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Streamline your content collection with our powerful Chrome extension. Save videos,
              images, and marketing content directly to your product boards.
            </p>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mb-16">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="group bg-purple-500/20 hover:bg-purple-500/30 text-purple-300
                px-10 py-5 rounded-2xl transition-all duration-500 flex items-center gap-4
                border border-purple-500/30 hover:border-purple-500/50
                hover:shadow-[0_0_60px_rgba(167,139,250,0.4)]
                hover:scale-110 transform disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100"
            >
              {isInstalling ? (
                <>
                  <div
                    className="w-7 h-7 border-3 border-purple-500/30 border-t-purple-500 
                    rounded-full animate-spin"
                  ></div>
                  <span className="text-xl font-medium">Installing...</span>
                </>
              ) : (
                <>
                  <Download
                    size={28}
                    className="transform transition-all duration-500 
                    group-hover:rotate-12 group-hover:scale-110"
                  />
                  <span className="text-xl font-medium">Install Extension</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Start Guide */}
          <div
            className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-8
            border border-white/10 backdrop-blur-xl mb-16"
          >
            <h3 className="text-2xl font-semibold text-white/90 mb-6 flex items-center gap-3">
              <Clock size={24} className="text-purple-400" />
              Quick Start Guide
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30
                  flex items-center justify-center text-purple-400 font-medium"
                >
                  1
                </div>
                <div>
                  <h4 className="text-white/90 font-medium mb-2">Install & Connect</h4>
                  <p className="text-white/60 text-sm">
                    Install the extension from Chrome Web Store and connect it to your COD Analytics
                    account.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30
                  flex items-center justify-center text-purple-400 font-medium"
                >
                  2
                </div>
                <div>
                  <h4 className="text-white/90 font-medium mb-2">Select Default Board</h4>
                  <p className="text-white/60 text-sm">
                    Choose your default working board where content will be saved automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30
                  flex items-center justify-center text-purple-400 font-medium"
                >
                  3
                </div>
                <div>
                  <h4 className="text-white/90 font-medium mb-2">Start Collecting</h4>
                  <p className="text-white/60 text-sm">
                    Browse supported sites and use the extension button to save content directly to
                    your boards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Sites */}
          <div
            className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl p-8
            border border-white/10 backdrop-blur-xl mb-16"
          >
            <h3 className="text-2xl font-semibold text-white/90 mb-6 flex items-center gap-3">
              <Target size={24} className="text-purple-400" />
              Supported Platforms
            </h3>
            <p className="text-white/60 mb-6">
              With a single click, instantly extract all product content:
              <span className="text-purple-400">
                videos, images, description, reviews, pricing, and product links.
              </span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div
                className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10
                hover:border-purple-500/30 transition-all duration-300 col-span-2"
              >
                <h4 className="text-white/90 font-medium mb-3 flex items-center gap-2">
                  <Database size={18} className="text-purple-400" />
                  Marketplace Scraping
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <SupportedSite
                    name="Alibaba"
                    icon={<Database size={18} className="text-purple-400" />}
                  />
                  <SupportedSite
                    name="AliExpress"
                    icon={<Database size={18} className="text-purple-400" />}
                  />
                  <SupportedSite
                    name="1688.com"
                    icon={<Database size={18} className="text-purple-400" />}
                  />
                  <SupportedSite
                    name="Amazon"
                    icon={<Database size={18} className="text-purple-400" />}
                  />
                </div>
              </div>
              <div
                className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10
                hover:border-purple-500/30 transition-all duration-300 col-span-2"
              >
                <h4 className="text-white/90 font-medium mb-3 flex items-center gap-2">
                  <Video size={18} className="text-purple-400" />
                  Video Download
                </h4>
                <div className="space-y-4">
                  {/* TikTok Platform Group */}
                  <div>
                    <h5 className="text-white/60 text-xs mb-2 uppercase tracking-wider">TikTok</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <SupportedSite name="TikTok" icon={<Video size={16} />} />
                      <SupportedSite name="TikTok Ads" icon={<Video size={16} />} />
                      <SupportedSite name="TikTok Ads Library" icon={<Video size={16} />} />
                      <SupportedSite name="TikTok Creative Center" icon={<Video size={16} />} />
                    </div>
                  </div>
                  {/* YouTube Platform Group */}
                  <div>
                    <h5 className="text-white/60 text-xs mb-2 uppercase tracking-wider">YouTube</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <SupportedSite name="YouTube" icon={<Video size={16} />} />
                      <SupportedSite name="YouTube Shorts" icon={<Video size={16} />} />
                    </div>
                  </div>
                  {/* Meta Platform Group */}
                  <div>
                    <h5 className="text-white/60 text-xs mb-2 uppercase tracking-wider">Meta</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <SupportedSite name="Instagram Reels" icon={<Video size={16} />} />
                      <SupportedSite name="Facebook Ads" icon={<Video size={16} />} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Save size={24} />}
              title="Smart Saving"
              description="Automatically detect and save content with a single click. Our AI categorizes content by type and organizes it in your boards."
            />
            <FeatureCard
              icon={<Video size={24} />}
              title="Video Download"
              description="Download videos from multiple platforms including TikTok, Facebook, Instagram, and YouTube with just one click."
            />
            <FeatureCard
              icon={<FileText size={24} />}
              title="Page Capture"
              description="Capture entire landing pages, extract marketing copy, and save page structures for inspiration."
            />
            <FeatureCard
              icon={<Star size={24} />}
              title="Review Collection"
              description="Automatically collect and organize customer reviews from various marketplaces to build social proof."
            />
            <FeatureCard
              icon={<Layers size={24} />}
              title="Smart Organization"
              description="Content is automatically categorized and organized in your boards for easy access and reference."
            />
            <FeatureCard
              icon={<Zap size={24} />}
              title="Instant Sync"
              description="All saved content instantly syncs with your COD Analytics boards for seamless workflow integration."
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-1/4 -left-48 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[128px]"></div>
        <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-pink-500/30 rounded-full filter blur-[128px]"></div>
      </div>
    </Layout>
  );
};

export default CodTrack;
