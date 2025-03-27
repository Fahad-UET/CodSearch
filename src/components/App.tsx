import { LogOut, Grid, Calculator, Settings, UserCircle, BarChart2, TestTube } from 'lucide-react';
// import { SubscriptionDisplay } from './SubscriptionDisplay';
import CurrencyConverter from './CurrencyConverter';
import { DefaultSettingsBar } from './DefaultSettingsBar';
import HoverMenu from './ui/HoverMenu';
import { useState } from 'react';
import { logoutUser } from '@/services/firebase';

export default function App() {
  // ... existing state declarations ...
  const [showServiceProviderSettings, setShowServiceProviderSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);


  const handleLogout = async () => {
      try {
        setLogoutError(null);
        await logoutUser();
      } catch (error) {
        console.error('Logout failed:', error);
        setLogoutError(error instanceof Error ? error.message : 'Failed to sign out');
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* comment this code because SubscriptionDisplay file is empty */}
      {/* <SubscriptionDisplay /> */}
      <DefaultSettingsBar onOpenSettings={() => setShowServiceProviderSettings(true)} />
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">CoD-Track.com</h1>
              <CurrencyConverter />
            </div>
            <div className="flex items-center gap-3">
              {/* Profile Menu */}
              <HoverMenu
                trigger={
                  <button className="h-9 px-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5">
                    <UserCircle size={16} />
                    <span className="text-sm">Profile</span>
                  </button>
                }
                content={
                  <div className="py-1">
                    <button
                      onClick={() => {}}
                      // comment this code because the state doesn't exist
                      // onClick={() => setShowProfileModal(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {}}
                      // comment this code because the state doesn't exist
                      // onClick={() => setShowChargesModal(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Monthly Charges
                    </button>
                    <button
                      onClick={() => {}}
                      // comment this code because the state doesn't exist
                      // onClick={() => setShowOrders(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => {}}
                      // comment this code because the state doesn't exist
                      // onClick={() => setShowCustomQuestionnaire(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Custom Analysis
                    </button>
                    <button
                      onClick={() => {}}
                      // comment this code because the state doesn't exist
                      // onClick={() => setShowFormulaBuilder(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Formula Builder
                    </button>
                    <button
                      onClick={() => {}}
                      // comment this code because the state doesn't exist
                      // onClick={() => setShowKpiSettings(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      KPI Settings
                    </button>
                    <button
                      onClick={() => setShowServiceProviderSettings(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Service Providers
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Log Out
                    </button>
                  </div>
                }
              />

              {/* Navigation Actions commented because board doesn't exist in this file in future if you need the uncomment this code */}
              {/* <div className="flex items-center gap-2 ml-6 pl-6 border-l border-white/20">
                {board && (
                  <button
                    onClick={handleCloseBoard}
                    className="h-9 px-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Grid size={16} />
                    <span className="text-sm">Boards</span>
                  </button>
                )}
              </div> */}
            </div>
          </div>
          {logoutError && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">
              {logoutError}
            </div>
          )}
        </div>
      </header>

      {/* Rest of the component remains the same... */}
    </div>
  );
}
