import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GanttChart } from 'lucide-react';

export const GanttViewButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/gantt');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <GanttChart className="w-4 h-4 mr-2" />
      Gantt View
    </button>
  );
};