import React from 'react';
import { GanttChart } from '../components/GanttChart';
import { Task } from '../components/GanttChart/types';
import { Calendar, List } from 'lucide-react';

export default function ProjectGantt() {
  const [view, setView] = React.useState<'gantt' | 'list'>('gantt');
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskCreate = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Project Timeline</h1>
          
          <button
            onClick={() => setView(v => v === 'gantt' ? 'list' : 'gantt')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors duration-200"
          >
            {view === 'gantt' ? (
              <>
                <List className="w-5 h-5 mr-2" />
                List View
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Gantt View
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <GanttChart
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskSelect={(taskId: string) => {}}
            // onTaskCreate={handleTaskCreate}
            // onTaskDelete={handleTaskDelete}
          />
        </div>
      </div>
    </div>
  );
}