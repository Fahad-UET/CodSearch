import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GanttChart } from '../components/GanttChart/GanttChart';
import { Task } from '../components/GanttChart/types';

export default function GanttView() {
  const navigate = useNavigate();

  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Research Phase',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 15),
      progress: 100,
    },
    {
      id: '2',
      title: 'Design Phase',
      startDate: new Date(2024, 0, 16),
      endDate: new Date(2024, 1, 1),
      progress: 70,
    },
    {
      id: '3',
      title: 'Development',
      startDate: new Date(2024, 1, 2),
      endDate: new Date(2024, 2, 15),
      progress: 30,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Board
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Project Timeline</h1>
        <GanttChart
          tasks={sampleTasks}
          onTaskSelect={(taskId) => console.log('Selected task:', taskId)}
        />
      </div>
    </div>
  );
}