import React, { useState, useEffect } from 'react';
import { X, Settings, Globe } from 'lucide-react';
import { CategoryTabs } from './components/CategoryTabs';
import { HabitList } from './components/HabitList';
import { ViewModeSelector } from './components/ViewModeSelector';
import { ProgressSummary } from './components/ProgressSummary';
import { AddHabitModal } from './components/AddHabitModal';
import { SettingsModal } from './components/SettingsModal';
import { useHabitStore } from '../../store/habitStore';
import { ViewMode } from './types';

interface HabitTrackerProps {
  onClose: () => void;
}

export function HabitTracker({ onClose }: HabitTrackerProps) {
  const {
    habits,
    categories,
    language,
    toggleHabit,
    deleteHabit,
    addCategory,
    deleteCategory,
    setLanguage,
    initialize,
  } = useHabitStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div
      className="fixed inset-0  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-purple-900 via-slate-900 to-black z-[100] flex items-center justify-center"
    >
      <div className="bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-900">Habit Tracker</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Change Language"
            >
              <Globe size={20} />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-73px)] overflow-y-auto">
          {/* View Mode Selector */}
          <ViewModeSelector
            selectedMode={viewMode}
            onViewModeChange={setViewMode}
            language={language}
          />

          {/* Progress Summary */}
          <ProgressSummary
            habits={habits}
            // to resolve build issue please check this comment
            // selectedCategory={selectedCategory}
            viewMode={viewMode}
            language={language}
          />

          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddCategory={() => setShowAddHabit(true)}
            onDeleteCategory={deleteCategory}
            language={language}
          />

          {/* Habits List */}
          <HabitList
            habits={habits}
            selectedCategory={selectedCategory}
            language={language}
            onToggleHabit={toggleHabit}
            onDeleteHabit={deleteHabit}
          />
        </div>
      </div>

      {/* Modals */}
      {showAddHabit && (
        <AddHabitModal
          categories={categories}
          language={language}
          onClose={() => setShowAddHabit(false)}
          // to resolve build issue please check this added
          onAdd={() => {}}
        />
      )}

      {showSettings && (
        <SettingsModal
          language={language}
          onLanguageChange={setLanguage}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
