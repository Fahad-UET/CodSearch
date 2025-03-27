import React from 'react';
import { Grid, User, Menu, BookOpen } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { LanguageSelector } from './LanguageSelector';
import { useLanguageStore } from '../store/languageStore';
import { useProductStore } from '../store';
import { logoutUser } from '../services/firebase';
import AdGallery from './AdGallery/AdGallery';
import { Link } from 'react-router-dom';
import { Home, Settings, LogOut, FileText } from 'lucide-react';

interface MainHeaderProps {
  onShowProfile: () => void;
  onShowCharges: () => void;
  onShowOrders: () => void;
  onShowQuestionnaire: () => void;
  onShowFormulaBuilder: () => void;
  onShowKpiSettings: () => void;
  onShowProfitCalculator: () => void;
  onShowServiceSettings: () => void;
    // Make all the four optional as it causes ts issues remove this is it cause any problem
  showCalculatorFunction?: () => void;
  showNotesFunction?: () => void;
  showHabitFunction?: () => void;
  showPomodoroTimerFunction?: () => void;
  onShowAdGallery: (val: boolean) => void;
  setShowStore: (val: boolean) => void;
}

export function MainHeader({
  onShowProfile,
  onShowCharges,
  onShowOrders,
  onShowQuestionnaire,
  onShowFormulaBuilder,
  onShowKpiSettings,
  onShowProfitCalculator,
  onShowServiceSettings,
  onShowAdGallery,
  setShowStore,
}: MainHeaderProps) {
  const { board, setBoard } = useProductStore();
  const [logoutError, setLogoutError] = React.useState<string | null>(null);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = React.useState(false);
  const { t } = useLanguageStore();

  const handleLogout = async () => {
    try {
      setLogoutError(null);
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
      setLogoutError(error instanceof Error ? error.message : 'Failed to sign out');
    }
  };

  const handleCloseBoard = () => {
    setBoard(null);
  };

  return (
    <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl x2lg:max-w-[88%] x4lg:max-w-[97%]  mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div></div>

          <div className="flex items-center gap-3">
            <AdGallery onShowAdGallery={onShowAdGallery} />
            <LanguageSelector />
            <div className="relative group">
              <button
                onClick={onShowProfile}
                className="h-9 px-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5 relative z-[9999]"
              >
                <User size={16} />
                <span className="text-sm">{t('profile')}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[99999999]">
                <button
                  onClick={onShowProfile}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('myProfile')}
                </button>
                <button
                  onClick={() => setShowStore(true)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('Store')}
                </button>
                <button
                  onClick={() => (window.location.href = '/pricing')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('pricing')}
                </button>
                <button
                  onClick={onShowCharges}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('monthlyCharges')}
                </button>
                <button
                  onClick={onShowOrders}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('orders')}
                </button>
                <button
                  onClick={onShowQuestionnaire}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('customAnalysis')}
                </button>
                <button
                  onClick={onShowFormulaBuilder}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('formulaBuilder')}
                </button>
                {/* <button
                  onClick={onShowProfitCalculator}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('profitCalculator')}
                </button>
                <button
                  onClick={onShowKpiSettings}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('kpiSettings')}
                </button> */}
                <button
                  onClick={onShowServiceSettings}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t('serviceProviders')}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  {t('logout')}
                </button>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2 ml-6 pl-6 border-l border-white/20">
              {board && (
                <button
                  onClick={handleCloseBoard}
                  className="h-9 px-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <Grid size={16} />
                  <span className="text-sm">{t('boards')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {logoutError && (
          <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">
            {logoutError}
          </div>
        )}
      </div>
      {showVirtualKeyboard && <VirtualKeyboard onKeyPress={() => setShowVirtualKeyboard(false)} />}
    </header>
  );
}
