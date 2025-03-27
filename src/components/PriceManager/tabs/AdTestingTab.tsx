import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { DaySection } from '@/components/PriceManager/AdTestingTab/DaySection';
import { MetricsSummary } from '@/components/PriceManager/AdTestingTab/MetricsSummary';
import { useAdTestingStore } from '../../../store/adTestingStore';
import { calculateAverageMetrics } from '@/utils/calculations';

export function AdTestingTab() {
  const { days, addDay, updateDay } = useAdTestingStore();
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(['1']));
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (dayId: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  const handleAddDay = () => {
    try {
      addDay();
      const newDayId = (days.length + 1).toString();
      setExpandedDays(new Set([newDayId]));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add test day');
    }
  };

  const averageMetrics = calculateAverageMetrics(days);

  return (
    <div className="space-y-6">
      <MetricsSummary metrics={averageMetrics} />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddDay}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Test Day
        </button>
      </div>

      <div className="space-y-4">
        {days.map(day => (
          <DaySection
            key={day.id}
            day={day}
            isExpanded={expandedDays.has(day.id)}
            onToggle={() => toggleDay(day.id)}
            onChange={updates => updateDay(day.id, updates)}
          />
        ))}
      </div>
    </div>
  );
}
