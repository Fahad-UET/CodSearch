import React, { useState } from 'react';
import { X, Plus, Save, AlertCircle } from 'lucide-react';
import { useProductStore } from '../../store';

interface CustomQuestionnaireModalProps {
  onClose: () => void;
}

interface Question {
  id: string;
  en: string;
  ar: string;
  weight: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  weight: number;
}

export function CustomQuestionnaireModal({ onClose }: CustomQuestionnaireModalProps) {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user, updateProduct } = useProductStore();

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: '',
      weight: 0
    };
    setCategories([...categories, newCategory]);
  };

  const handleUpdateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map(category =>
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    setQuestions(questions.filter(question => question.categoryId !== id));
  };

  const handleAddQuestion = (categoryId: string) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      en: '',
      ar: '',
      weight: 0,
      categoryId
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(question =>
      question.id === id ? { ...question, ...updates } : question
    ));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(question => question.id !== id));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Questionnaire name is required');
      return;
    }

    if (categories.length === 0) {
      setError('At least one category is required');
      return;
    }

    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    if (totalWeight !== 100) {
      setError('Total category weights must equal 100%');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const questionnaire = {
        id: `questionnaire-${Date.now()}`,
        name,
        categories,
        questions,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save questionnaire to user profile
      // This would typically be saved to Firebase or your backend
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save questionnaire');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create Custom Analysis</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Questionnaire Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Questionnaire Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="Enter questionnaire name"
            />
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
              <button
                onClick={handleAddCategory}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                      className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                      placeholder="Category name"
                    />
                    <div className="w-32">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={category.weight}
                        onChange={(e) => handleUpdateCategory(category.id, { weight: Number(e.target.value) })}
                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                        placeholder="Weight %"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Questions for this category */}
                  <div className="mt-4 space-y-4">
                    {questions
                      .filter(q => q.categoryId === category.id)
                      .map((question) => (
                        <div key={question.id} className="flex gap-4">
                          <input
                            type="text"
                            value={question.en}
                            onChange={(e) => handleUpdateQuestion(question.id, { en: e.target.value })}
                            className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                            placeholder="Question (English)"
                          />
                          <input
                            type="text"
                            value={question.ar}
                            onChange={(e) => handleUpdateQuestion(question.id, { ar: e.target.value })}
                            className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                            placeholder="Question (Arabic)"
                            dir="rtl"
                          />
                          <div className="w-24">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={question.weight}
                              onChange={(e) => handleUpdateQuestion(question.id, { weight: Number(e.target.value) })}
                              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                              placeholder="Weight"
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    
                    <button
                      onClick={() => handleAddQuestion(category.id)}
                      className="w-full px-4 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Question
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Questionnaire
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}