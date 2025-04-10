import React from 'react';
import {
  Calculator,
  FileText,
  Activity,
  Timer,
  DollarSign,
  User,
  ChevronDown,
  LogOut,
  LayoutGrid,
  Megaphone,
  Search,
  Brain,
  Eye,
  Image,
  Contact,
  Mail,
  Group,
  Book,
  Currency,
  Newspaper,
  Tag,
  CreditCard,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AnalyticsIcon from '../../components/icon/AnalyticsIcon';
import CurrencyConverter  from '../../components/CurrencyConverter';
import PomodoroTimer from '../../components/PomodoroTimer';
import { Settings, Clock } from 'lucide-react';
import { useDefaultSettingsStore } from '@/store/defaultSettingsStore';
import { useLocalTime } from '@/hooks/useLocalTime';
import { COUNTRIES } from '../../services/codNetwork/constants';
import { CurrencyConverterNew } from '../CurrencyConverterNew';
import { ProfileSection } from '../ProfileSection';
import { logoutUser } from '@/services/firebase';
import CountryTimeSelector from '../CountrySelector/CountrySelector';
import { useProductStore } from '@/store';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onNavigateHome?: () => void;
  setShowNotes: (show: boolean) => void;
  setShowCalculator: (show: boolean) => void;
  setshowHabitTracker: (show: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  onNavigateHome,
  setShowNotes,
  setShowCalculator,
  setshowHabitTracker,

}) => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [showPomodoroTimer, setShowPomodoroTimer] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showTimeCoountryList, setshowTimeCoountryList] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const settings = useDefaultSettingsStore(state => state.settings);
  const updateSettings = useDefaultSettingsStore(state => state.updateSettings);
  const { time, date, timeZone } = useLocalTime(settings.country);
  const { userPackage, setCurrentPage } = useProductStore();
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  


  const handleCountryChange = (code: string) => {
    updateSettings({ country: code });
    setShowOptions(false);
  };

  const handleClose = () => {
    setShowPomodoroTimer(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group countries by continent
  const groupedCountries = Object.entries(COUNTRIES).reduce((acc, [code, country]) => {
    if (!acc[country.continent]) {
      acc[country.continent] = [];
    }
    acc[country.continent].push({ code, ...country });
    return acc;
  }, {} as Record<string, Array<{ code: string; name: string; continent: string }>>);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const handleButtonClick = () => {
    const toolPages = {
      creditsHistory: '/credits',
    };

    const tool = 'creditsHistory'; // You can dynamically set this based on some condition
    const selectedPage = toolPages[tool];

    if (selectedPage) {
      setCurrentPage('ai-creator');
      navigate(selectedPage);
    }
  };

  return (
    <div>
      <div
        className="fixed top-0 left-0 right-0 h-12 bg-black border-b border-[#2d2d2d] z-50
      flex items-center justify-between px-4"
      >
        <div className="flex items-center gap-4">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <AnalyticsIcon size={20} className="text-purple-400" />
            <span className="text-white/90 text-base font-medium">COD Analytics</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={() => {
              setShowCalculator(true);
            }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Calculator size={18} />
          </button>
          <button
            onClick={() => {
              setShowNotes(true);
            }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <FileText size={18} />
          </button>
          <button
            onClick={() => setshowHabitTracker(true)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Activity size={18} />
          </button>
          <button
            onClick={() => setShowPomodoroTimer(!showPomodoroTimer)}
            className={`text-white/60 hover:text-white transition-colors
            ${showPomodoroTimer ? 'text-purple-400' : ''}`}
          >
            <Timer size={18} />
          </button>
          <button
            onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
            className={`text-white/60 hover:text-white transition-colors
            ${showCurrencyConverter ? 'text-purple-400' : ''}`}
          >
            <DollarSign size={18} />
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-3">
            {/* {showCurrencyConverter && <CurrencyConverter />} */}
            {showCurrencyConverter && <CurrencyConverterNew />}
            {showPomodoroTimer && (
              <div
                className={`transition-all duration-300 ${showCurrencyConverter ? 'scale-90' : ''}`}
              >
                <PomodoroTimer />
              </div>
            )}
            {isProfileViewOpen && <ProfileSection onClose={() => setIsProfileViewOpen(false)} />}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <CountryTimeSelector />
          <div className="h-4 w-px bg-white/10" />
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1 text-white/60 hover:text-white transition-colors
              hover:bg-white/5 rounded px-3 py-2 border border-white/10 bg-white/5"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover bg-gradient-to-br from-purple-500 to-pink-500"
                />
              </div>
              <ChevronDown
                size={16}
                className={`transform transition-transform duration-200 
              ${isProfileMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 top-[calc(100%+4px)] w-48 bg-black border border-[#2d2d2d] 
              rounded-lg shadow-lg py-1 z-50"
              >
                <button
                  onClick={() => setIsProfileViewOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 
                  hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <a
                  href="https://www.cod-as.com/subscription-plan-2/"
                  target="_blank"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 
                  hover:text-white hover:bg-white/5 transition-colors"
                >
                  <CreditCard size={16} />
                  <span>Pricing</span>
                </a>
                <a
                  href="https://www.cod-as.com/blog/"
                  target="_blank"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 
                  hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Newspaper size={16} />
                  <span>Blog</span>
                </a>
                <a
                  href="https://www.cod-as.com/community/"
                  target="_blank"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 
                  hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Group size={16} />
                  <span>Forum</span>
                </a>
                <a
                  href="https://www.cod-as.com/docs/"
                  target="_blank"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 
                  hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Book size={16} />
                  <span>Docs</span>
                </a>
                <a
                  href="https://www.cod-as.com/contact/"
                  target="_blank"
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 
                  hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Mail size={16} />
                  <span>Contact</span>
                </a>
                <div className="h-[1px] bg-[#2d2d2d] my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 
                  hover:text-red-300 hover:bg-white/5 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
                <div
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 
                  hover:text-white hover:bg-white/5
                 transition-colors"
                >
                  Remaining Credits:{userPackage?.credits || 0}          
                </div>
                <div
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={handleButtonClick}
                >
                  <DollarSign size={16} />
                  <span>Credits History</span>
                </div>
  
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="fixed top-12 left-0 right-0 h-14 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-40
        flex items-center justify-center px-4 transform -translate-y-full transition-transform duration-300
        hover:translate-y-0 group/nav"
      >
        {/* Hover Indicator */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-b-lg
          bg-slate-900/95 backdrop-blur-sm border-x border-b border-slate-800 
          text-white/40 flex items-center
          group-hover/nav:opacity-0 transition-opacity duration-300"
        >
          <ChevronDown size={14} />
        </div>
        <div className="flex items-center gap-6 relative">
          {/* Left Side Navigation */}
          <button
            onClick={() => setCurrentPage('boards')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-400 
              transition-colors group"
            title="My Boards"
          >
            <LayoutGrid
              size={24}
              className="transform transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs font-medium">Boards</span>
          </button>
          <button
            onClick={() => setCurrentPage('MyAdLibrary')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-400 
              transition-colors group"
            title="My Ad Library"
          >
            <Megaphone
              size={24}
              className="transform transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs font-medium">Ad Library</span>
          </button>
          <button
            onClick={() => setCurrentPage('my-page')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-400 
              transition-colors group"
            title="My Pages Library"
          >
            <FileText
              size={24}
              className="transform transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs font-medium">Pages</span>
          </button>
          <button
            onClick={() => setCurrentPage('my-library')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-400 
              transition-colors group"
            title="My Photos Library"
          >
            <Image
              size={24}
              className="transform transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs font-medium">Photos</span>
          </button>
          <button
            onClick={() => setCurrentPage('cod-search')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-400 
              transition-colors group"
            title="COD Search"
          >
            <Search
              size={24}
              className="transform transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs font-medium">Search</span>
          </button>

          {/* AI Buttons */}
          <button
            onClick={() => setCurrentPage('ai-creator')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-400 
              transition-colors group"
            title="AI Creator"
          >
            <Brain
              size={24}
              className="transform transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs font-medium">AI Creator</span>
          </button>
          <button
            // onClick={() => setCurrentPage('AI-Analytics')}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-purple-400 
              transition-colors group"
            title="AI Analytics"
          >
            <Eye
              size={24}
              className="transform transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xs font-medium">AI Analytics</span>
          </button>
        </div>
        <div
          className="absolute right-4 flex flex-col justify-center items-center text-xs text-white/60 hover:text-purple-400 
    transition-colors"
        >
          <span>{userPackage?.credits || 0}</span>
          Remaining Credits
        </div>
      </div>
    </div>
  );
};

export default TopBar;
