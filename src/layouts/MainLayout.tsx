import React, { useState } from 'react';
import { Plus, ArrowLeft, LayoutGrid, Store, CreditCard, Building2 } from 'lucide-react';
import BoardIcon from '../components/updated/BoardIcon';
import CreateBoardModal from '../components/updated/CreateBoardModal';
import Layout from '../components/updated/Layout';
import { useEffect } from 'react';
import { Notes } from '../components/Notes';
import { Calculator as CalculatorComponent } from '../components/Calculator/Calculator';
import { HabitTracker } from '../components/HabitTracker';
import { Board } from '../components/Board';
import { BoardManager } from '../components/BoardManager';
import { useProductStore } from '../store';
import { useGobalValuesStore } from '@/store/globalValues';
import MyStores from '@/components/myStore/myStore';
import { MonthlyChargesModal } from '@/components/MonthlyChargesModal';
import { ServiceProviderModal } from '@/components/ServiceProviderSettings/ServiceProviderModal';

interface BoardsProps {
  onBack: () => void;
}

interface Board {
  id: string;
  name: string;
  createdAt: Date;
}

const BoardCard: React.FC<{ board: Board }> = ({ board }) => (
  <div
    className="group relative bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8 rounded-2xl 
    transition-all duration-300 hover:shadow-[0_0_40px_rgba(167,139,250,0.2)]
    backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20
    hover:scale-[1.02]
    border border-white/10 hover:border-purple-500/30 cursor-pointer"
  >
    <div className="flex flex-col items-center gap-4">
      <div
        className="text-white/90 transform transition-transform duration-700 
        group-hover:text-white bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl
        group-hover:bg-gradient-to-br group-hover:from-purple-500/20 group-hover:to-pink-500/20
        border border-white/10 group-hover:border-purple-500/30"
      >
        <BoardIcon size={32} />
      </div>
      <h3
        className="text-white/90 font-medium text-lg sm:text-xl text-center tracking-wide
        transform transition-all duration-500 group-hover:text-white"
      >
        {board.name}
      </h3>
      <div className="text-white/40 text-sm">{new Date(board.createdAt).toLocaleDateString()}</div>
    </div>
  </div>
);

const Boards: React.FC<BoardsProps> = ({ onBack }) => {
  const [boards, setBoards] = useState<Board[]>([
    { id: '1', name: 'Workflow Manager', createdAt: new Date() },
    { id: '2', name: 'Content Calendar', createdAt: new Date() },
    { id: '3', name: 'Project Tasks', createdAt: new Date() },
  ]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading boards from an API
    const loadBoards = async () => {
      try {
        // In a real implementation, this would be an API call
        const mockBoards = [
          { id: '1', name: 'Workflow Manager', createdAt: new Date() },
          { id: '2', name: 'Content Calendar', createdAt: new Date() },
          { id: '3', name: 'Project Tasks', createdAt: new Date() },
        ];
        setBoards(mockBoards);
      } catch (error) {
        console.error('Error loading boards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBoards();
  }, []);

  const handleCreateBoard = (name: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      name: name,
      createdAt: new Date(),
    };

    // In a real implementation, this would be an API call
    setBoards([...boards, newBoard]);
  };

  const [showNotes, setShowNotes] = React.useState(false);
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [showHabitTracker, setshowHabitTracker] = useState(false);
  const [displayStore, setDisplayStore] = useState(false);
  const [showServiceProviderSettings, setShowServiceProviderSettings] = useState(false);
  const { monthlyCharge, setMonthlyCharge } = useGobalValuesStore();

  const { board } = useProductStore();

  if (isLoading) {
    return (
      <Layout
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <div
          className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
          from-purple-900 via-slate-900 to-black flex items-center justify-center"
        >
          <div
            className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 
            rounded-full animate-spin"
          ></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      >
        <div
          className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
      from-purple-900 via-slate-900 to-black"
        >
          {/* Background Effects */}
          <div className="absolute -z-10 inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h1v1H0z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.03)%22%2F%3E%3C%2Fsvg%3E')] opacity-20"></div>

          {/* Top Navigation Bar */}
          <div className="relative border-b border-white/10 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="text-white/80 hover:text-white flex items-center gap-2
                transition-colors duration-300 hover:bg-white/5 rounded-lg p-2"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  <LayoutGrid size={24} className="text-purple-400" />
                  <h1
                    className="text-2xl font-semibold text-transparent bg-clip-text 
                bg-gradient-to-r from-purple-400 to-pink-400"
                  >
                    My Boards
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDisplayStore(true)}
                  className="text-white/60 hover:text-white flex items-center gap-2 px-4 py-2
                transition-all duration-300 hover:bg-white/5 rounded-lg group
                border border-white/10 hover:border-purple-500/30 bg-white/5"
                >
                  <Store
                    size={20}
                    className="transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>My Stores</span>
                </button>
                <button
                  onClick={() => setMonthlyCharge(true)}
                  className="text-white/60 hover:text-white flex items-center gap-2 px-4 py-2
                transition-all duration-300 hover:bg-white/5 rounded-lg group
                border border-white/10 hover:border-purple-500/30 bg-white/5"
                >
                  <CreditCard
                    size={20}
                    className="transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>Monthly Charges</span>
                </button>
                <button
                  onClick={() => setShowServiceProviderSettings(true)}
                  className="text-white/60 hover:text-white flex items-center gap-2 px-4 py-2
                transition-all duration-300 hover:bg-white/5 rounded-lg group
                border border-white/10 hover:border-purple-500/30 bg-white/5"
                >
                  <Building2
                    size={20}
                    className="transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>Service Providers</span>
                </button>
              </div>
            </div>
          </div>
          <main className="max-w-7xl x2lg:max-w-[88%] x4lg:max-w-[97%]  mx-auto py-6 px-4 space-y-6">
            {board ? <Board /> : <BoardManager />}
          </main>
          {/* Boards Grid */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))} */}
              {/* Add New Board Card */}
            </div>
          </div>

          {/* Decorative Elements */}
          {/* <div className="fixed top-1/4 -left-48 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[128px]"></div> */}
          <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-pink-500/30 rounded-full filter blur-[128px]"></div>

          <CreateBoardModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateBoard={handleCreateBoard}
          />
          {showNotes && <Notes onClose={() => setShowNotes(false)} />}
          {showCalculator && <CalculatorComponent onClose={() => setShowCalculator(false)} />}
          {showHabitTracker && <HabitTracker onClose={() => setshowHabitTracker(false)} />}
        </div>
      </Layout>
      {displayStore && <MyStores onClose={() => setDisplayStore(false)} />}
      {monthlyCharge && <MonthlyChargesModal onClose={() => setMonthlyCharge(false)} />}
      {showServiceProviderSettings && (
        <ServiceProviderModal onClose={() => setShowServiceProviderSettings(false)} />
      )}
    </>
  );
};

export default Boards;

// import React, { useState } from 'react';
// import { Board } from '../components/Board';
// import { BoardManager } from '../components/BoardManager';
// import { AddProductModal } from '../components/AddProductModal';
// import { ProfileSection } from '../components/ProfileSection';
// import { MonthlyChargesModal } from '../components/MonthlyChargesModal';
// import { Orders } from '../pages/Orders';
// import { KpiSettingsModal } from '../components/KpiSettings/KpiSettingsModal';
// import { ServiceProviderModal } from '../components/ServiceProviderSettings/ServiceProviderModal';
// import { CustomQuestionnaireModal } from '../components/CustomQuestionnaire/CustomQuestionnaireModal';
// import { FormulaBuilder } from '../pages/FormulaBuilder';
// import { DefaultSettingsBar } from '../components/DefaultSettingsBar';
// import { MainHeader } from '../components/MainHeader';
// import { LanguageSelector } from '../components/LanguageSelector';
// import { useProductStore } from '../store';
// import { HabitTracker } from '../components/HabitTracker';
// import  PomodoroTimer  from '../components/PomodoroTimer';
// import { Calculator as CalculatorComponent } from '../components/Calculator/Calculator';
// import { ProfitCalculator } from '../pages/ProfitCalculator';
// import { Notes } from '../components/Notes/Notes';
// import AdGallery from '../components/AdGallery/AdGallery';
// import AdGalleryView from '../components/AdGallery/AdGalleryView';
// import { val } from 'node_modules/cheerio/lib/esm/api/attributes';
// import MyStores from '@/components/myStore/myStore';
// import { useGobalValuesStore } from '@/store/globalValues';

// export function MainLayout() {
//   const { monthlyCharge, setMonthlyCharge } = useGobalValuesStore();

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showChargesModal, setShowChargesModal] = useState(false);
//   const [showOrders, setShowOrders] = useState(false);
//   const [showKpiSettings, setShowKpiSettings] = useState(false);
//   const [showProfitCalculator, setShowProfitCalculator] = useState(false);
//   const [showServiceProviderSettings, setShowServiceProviderSettings] = useState(false);
//   const [showCustomQuestionnaire, setShowCustomQuestionnaire] = useState(false);
//   const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
//   const [showCalculator, setShowCalculator] = useState(false);
//   const [showNotes, setShowNotes] = useState(false);
//   const [showHabitTracker, setshowHabitTracker] = useState(false);
//   const [showPomodoroTimer, setshowPomodoroTimer] = useState(false);
//   const [showAdGallery, setShowAdGallery] = useState(false);
//   const [showStore, setShowStore] = useState(false);

//   const showCalculatorFunction = val => {
//     setShowCalculator(val);
//   };
//   const showNotesFunction = val => {
//     setShowNotes(val);
//   };
//   const showHabitFunction = val => {
//     setshowHabitTracker(val);
//   };
//   const showPomodoroTimerFunction = val => {
//     setshowPomodoroTimer(val);
//   };

//   const { board } = useProductStore();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
//       <DefaultSettingsBar
//         showCalculatorFunction={showCalculatorFunction}
//         showNotesFunction={showNotesFunction}
//         showHabitFunction={showHabitFunction}
//         showPomodoroTimerFunction={showPomodoroTimerFunction}
//       />

//       <MainHeader
//         onShowProfile={() => setShowProfileModal(true)}
//         onShowCharges={() => setMonthlyCharge(true)}
//         onShowOrders={() => setShowOrders(true)}
//         onShowQuestionnaire={() => setShowCustomQ / estionnaire(true)}
//         onShowFormulaBuilder={() => setShowFormulaBuilder(true)}
//         onShowProfitCalculator={() => setShowProfitCalculator(true)}
//         onShowKpiSettings={() => setShowKpiSettings(true)}
//         onShowServiceSettings={() => setShowServiceProviderSettings(true)}
//         onShowAdGallery={val => setShowAdGallery(val)}
//         setShowStore={val => setShowStore(val)}
//       />

//       <main className="max-w-7xl x2lg:max-w-[88%] x4lg:max-w-[97%]  mx-auto py-6 px-4 space-y-6">
//         {board ? <Board /> : <BoardManager />}
//       </main>

//       {/* Modals */}
//       {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
//       {showProfileModal && <ProfileSection onClose={() => setShowProfileModal(false)} />}
//       {monthlyCharge && <MonthlyChargesModal onClose={() => setMonthlyCharge(false)} />}
//       {showOrders && <Orders onClose={() => setShowOrders(false)} />}
//       {showKpiSettings && <KpiSettingsModal onClose={() => setShowKpiSettings(false)} />}
//       {showServiceProviderSettings && (
//         <ServiceProviderModal onClose={() => setShowServiceProviderSettings(false)} />
//       )}
//       {showCustomQuestionnaire && (
//         <CustomQuestionnaireModal onClose={() => setShowCustomQuestionnaire(false)} />
//       )}
//       {showFormulaBuilder && <FormulaBuilder onClose={() => setShowFormulaBuilder(false)} />}
//       {showCalculator && <CalculatorComponent onClose={() => setShowCalculator(false)} />}
//       {showNotes && <Notes onClose={() => setShowNotes(false)} />}
//       {showProfitCalculator && <ProfitCalculator onClose={() => setShowProfitCalculator(false)} />}
//       {showHabitTracker && <HabitTracker onClose={() => setshowHabitTracker(false)} />}
//       {showPomodoroTimer && <PomodoroTimer  />}
//       {showAdGallery && <AdGalleryView onClose={() => setShowAdGallery(false)} />}
//       {showStore && <MyStores onClose={() => setShowStore(false)} />}
//     </div>
//   );
// }
