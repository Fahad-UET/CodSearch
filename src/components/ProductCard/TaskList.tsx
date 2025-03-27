import React, { useState } from 'react';
import { Trash2, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskWithLanguage } from '../../utils/defaultTasks';
import { useLanguageStore } from '../../store/languageStore';

interface TaskListProps {
  tasks: TaskWithLanguage[];
  onAddTask?: (text: string, textAr: string) => Promise<void>;
  onToggleTask?: (taskId: string) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

export function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskListProps) {
  const [newTask, setNewTask] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { language, setLanguage } = useLanguageStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    // For now, we'll use a placeholder Arabic translation
    // In production, this would use a translation service
    const textAr = "يرجى الترجمة"; // "Please translate" in Arabic
    await onAddTask(newTask, textAr);
    setNewTask('');
  };

  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, task) => {
    const category = language === 'en' ? task.category : task.categoryAr;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, TaskWithLanguage[]>);

  // Sort categories to maintain order
  const sortedCategories = Object.keys(groupedTasks).sort((a, b) => {
    const aNum = parseInt(a.split('.')[0]);
    const bNum = parseInt(b.split('.')[0]);
    return aNum - bNum;
  });

  return (
    <div className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          {language === 'en' ? 'Tasks' : 'المهام'}
        </h3>
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="p-2 text-gray-400 hover:text-purple-600 rounded-lg transition-colors flex items-center gap-1.5"
          title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        >
          <Globe size={16} />
          <span className="text-sm">
            {language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>
      </div>

      {/* Task Categories */}
      <div className="space-y-3">
        {sortedCategories.map(category => {
          const categoryTasks = groupedTasks[category];
          const completedCount = categoryTasks.filter(t => t.completed).length;

          return (
            <div key={category} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedCategory(prev => prev === category ? null : category)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {completedCount}/{categoryTasks.length}
                  </span>
                  {expandedCategory === category ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>
              </button>

              {expandedCategory === category && (
                <div className="border-t border-gray-100">
                  {categoryTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className={`flex-1 text-sm ${
                        task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}>
                        {language === 'en' ? task.text : task.textAr}
                      </span>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Task Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={language === 'en' ? 'Add new task...' : 'إضافة مهمة جديدة...'}
          className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200"
        />
      </form>
    </div>
  );
}