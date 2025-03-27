import React, { useState } from 'react';
import { Board } from '../components/Board';
import { BoardManager } from '../components/BoardManager';
import { AddProductModal } from '../components/AddProductModal';
import { ProfileSection } from '../components/ProfileSection';
import { MonthlyChargesModal } from '../components/MonthlyChargesModal';
import { Orders } from '../pages/Orders';
import { KpiSettingsModal } from '../components/KpiSettings/KpiSettingsModal';
import { ServiceProviderModal } from '../components/ServiceProviderSettings/ServiceProviderModal';
import { CustomQuestionnaireModal } from '../components/CustomQuestionnaire/CustomQuestionnaireModal';
import { FormulaBuilder } from '../pages/FormulaBuilder';
import { DefaultSettingsBar } from '../components/DefaultSettingsBar';
import { MainHeader } from '../components/MainHeader';
import { LanguageSelector } from '../components/LanguageSelector';
import { useProductStore } from '../store';
import { HabitTracker } from '../components/HabitTracker';
import PomodoroTimer from '../components/PomodoroTimer';
import { Calculator as CalculatorComponent } from '../components/Calculator/Calculator';
import { ProfitCalculator } from '../pages/ProfitCalculator';
import { Notes } from '../components/Notes/Notes';
import AdGallery from '../components/AdGallery/AdGallery';
import AdGalleryView from '../components/AdGallery/AdGalleryView';
import { val } from 'node_modules/cheerio/lib/esm/api/attributes';
import MyStores from '@/components/myStore/myStore';
import { useGobalValuesStore } from '@/store/globalValues';

export function MainLayoutDashboard() {
  const { monthlyCharge, setMonthlyCharge } = useGobalValuesStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showKpiSettings, setShowKpiSettings] = useState(false);
  const [showProfitCalculator, setShowProfitCalculator] = useState(false);
  const [showServiceProviderSettings, setShowServiceProviderSettings] = useState(false);
  const [showCustomQuestionnaire, setShowCustomQuestionnaire] = useState(false);
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showHabitTracker, setshowHabitTracker] = useState(false);
  const [showPomodoroTimer, setshowPomodoroTimer] = useState(false);
  const [showAdGallery, setShowAdGallery] = useState(false);
  const [showStore, setShowStore] = useState(false);

  const showCalculatorFunction = val => {
    setShowCalculator(val);
  };
  const showNotesFunction = val => {
    setShowNotes(val);
  };
  const showHabitFunction = val => {
    setshowHabitTracker(val);
  };
  const showPomodoroTimerFunction = val => {
    setshowPomodoroTimer(val);
  };

  const { board, products, lists } = useProductStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <DefaultSettingsBar
      onOpenSettings={() => {}}
        // showCalculatorFunction={showCalculatorFunction}
        // showNotesFunction={showNotesFunction}
        // showHabitFunction={showHabitFunction}
        // showPomodoroTimerFunction={showPomodoroTimerFunction}
      />

      <MainHeader
        onShowProfile={() => setShowProfileModal(true)}
        onShowCharges={() => setMonthlyCharge(true)}
        onShowOrders={() => setShowOrders(true)}
        onShowQuestionnaire={() => setShowCustomQuestionnaire(true)}
        onShowFormulaBuilder={() => setShowFormulaBuilder(true)}
        onShowProfitCalculator={() => setShowProfitCalculator(true)}
        onShowKpiSettings={() => setShowKpiSettings(true)}
        onShowServiceSettings={() => setShowServiceProviderSettings(true)}
        onShowAdGallery={val => setShowAdGallery(val)}
        setShowStore={val => setShowStore(val)}
      />

      {/* Modals */}
      {showAddModal && <AddProductModal boardId={board?.id} onClose={() => setShowAddModal(false)} />}
      {showProfileModal && <ProfileSection onClose={() => setShowProfileModal(false)} />}
      {monthlyCharge && <MonthlyChargesModal onClose={() => setMonthlyCharge(false)} />}
      {showOrders && <Orders onClose={() => setShowOrders(false)} />}
      {showKpiSettings && <KpiSettingsModal onClose={() => setShowKpiSettings(false)} />}
      {showServiceProviderSettings && (
        <ServiceProviderModal onClose={() => setShowServiceProviderSettings(false)} />
      )}
      {showCustomQuestionnaire && (
        <CustomQuestionnaireModal onClose={() => setShowCustomQuestionnaire(false)} />
      )}
      {showFormulaBuilder && <FormulaBuilder onClose={() => setShowFormulaBuilder(false)} />}
      {showCalculator && <CalculatorComponent onClose={() => setShowCalculator(false)} />}
      {showNotes && <Notes onClose={() => setShowNotes(false)} />}
      {showProfitCalculator && <ProfitCalculator product={products} onClose={() => setShowProfitCalculator(false)} />}
      {showHabitTracker && <HabitTracker onClose={() => setshowHabitTracker(false)} />}
      {showPomodoroTimer && <PomodoroTimer />}
      {showAdGallery && <AdGalleryView onBack={() => setShowAdGallery(false)} />}
      {showStore && <MyStores onClose={() => setShowStore(false)} />}
    </div>
  );
}
