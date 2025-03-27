import React from 'react';
import { Loader2, AlertCircle, CheckCircle2, X, XCircle } from 'lucide-react';
import { useBackground } from '@/store/background';

function BackgroundTasks() {
  const { tasks, removeTask, clearCompletedTasks } = useBackground();
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status !== 'pending');

  if (tasks.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-48 space-y-1.5 z-50">
      {pendingTasks.map(task => (
        <div
          key={task.id}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-1.5 shadow-lg animate-fade-in"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-white/80 flex-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <div>
                <p className="text-xs font-medium truncate">Processing {task.type}</p>
                <p className="text-[10px] text-white/60 mt-0.5 truncate">{task.progress}</p>
              </div>
            </div>
            <button
              onClick={() => removeTask(task.id)}
              className="text-white/40 hover:text-white/60 transition-colors ml-0.5"
              title="Cancel task"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {completedTasks.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg">
          <div className="px-1.5 py-1 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-xs font-medium">Recent Tasks</h3>
            <button
              onClick={clearCompletedTasks}
              className="text-white/60 hover:text-white/80 transition-colors text-[10px] px-1 py-0.5"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-28 overflow-y-auto">
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="p-1 border-b border-white/10 last:border-0 flex items-start justify-between"
              >
                <div className="flex items-center gap-2">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <div>
                    <p className="text-[10px] font-medium truncate">{task.type} Generation</p>
                    {task.error ? (
                      <p className="text-[10px] text-red-400 mt-0.5 truncate">{task.error}</p>
                    ) : (
                      <p className="text-[10px] text-white/60 mt-0.5">Completed</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-white/40 hover:text-white/60 transition-colors ml-0.5"
                  title="Remove from history"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BackgroundTasks;
