import React from 'react';
import { Plus } from 'lucide-react';
import { GanttViewButton } from './GanttViewButton';

export const BoardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Board</h1>
      <div className="flex gap-3">
        <GanttViewButton />
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>
    </div>
  );
};