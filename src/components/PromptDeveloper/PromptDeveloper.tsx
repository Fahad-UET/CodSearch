import React, { useState, useEffect } from 'react';
import { Code2, Copy, Check, Save, Edit, X } from 'lucide-react';
import { storePromptCategories, updatePromptCategories } from '@/services/firebase/Prompt';

interface Prompt {
  id: string;
  content: string;
  category: string;
  name: string;
  lastModified: Date;
}
interface PromptCategory {
  description: string;
  prompts: Record<string, string>;
}

interface Props {
  onClose: () => void;
}

export default function PromptDeveloper({ onClose }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([] as Prompt[]);
  const [promptCategories, setPromptCategories] = useState<Record<string, PromptCategory>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (selectedPrompt) {
      setEditedContent(selectedPrompt.content);
    }
  }, [selectedPrompt]);

  const getPromptCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await storePromptCategories();
      setPrompts(() => {
        return Object.entries(data).flatMap(([category, { prompts }]) =>
          Object.entries(prompts).map(([name, content]) => ({
            id: crypto.randomUUID(),
            category,
            name,
            content: String(content),
            lastModified: new Date(),
          }))
        );
      });
      setPromptCategories(data);
    } catch {
      console.log('There is some error while getting the prompts from db.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPromptCategories();
  }, []);

  const handleSave = async () => {
    if (!selectedPrompt) return;
    setUpdating(true);
    let editedPrompts = prompts.map(p =>
      p.id === selectedPrompt.id ? { ...p, content: editedContent, lastModified: new Date() } : p
    );

    try {
      const { success, message, data } = await updatePromptCategories(editedPrompts);
      if (success) {
        setPrompts(editedPrompts);
        setPromptCategories(data);
        let updateSelectedPrompt = editedPrompts.filter(p => p.id === selectedPrompt.id);
        setSelectedPrompt(updateSelectedPrompt[0]);
        setIsEditing(false);
      }
      setNotification({
        show: true,
        message,
        type: success ? 'success' : 'error',
      });
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      console.log('There is some issue while updating the prompt');
      setNotification({
        show: true,
        message: error.message,
        type: 'error',
      });
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (selectedPrompt) {
      setEditedContent(selectedPrompt.content);
    }
    setIsEditing(false);
  };
  return isLoading ? (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-70">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <p>Loading...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1333] via-[#2d1854] to-[#341d66] p-8 m-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="flex w-full justify-between items-center cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">System Prompts</h1>
          </div>
          <div onClick={onClose}>
            <X className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Prompts List */}
          {promptCategories && (
            <div className="col-span-4 space-y-4">
              {Object.entries(promptCategories).map(
                ([category, { description, prompts: categoryPrompts }]) => (
                  <div key={category} className="space-y-2">
                    <div className="space-y-1">
                      <h2 className="text-white/80 text-sm font-medium px-2">{category}</h2>
                      <p className="text-white/50 text-xs px-2">{description}</p>
                    </div>
                    {prompts
                      .filter(p => p.category === category)
                      .map(prompt => (
                        <div
                          key={prompt.id}
                          onClick={() => {
                            setSelectedPrompt(() => prompt);
                          }}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                            selectedPrompt?.id === prompt.id
                              ? 'bg-white shadow-lg'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-medium ${
                                selectedPrompt?.id === prompt.id ? 'text-[#5D1C83]' : 'text-white'
                              }`}
                            >
                              {prompt.name}
                            </h3>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(prompt.content);
                                setCopiedId(prompt.id);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                copiedId === prompt.id
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : 'hover:bg-white/10 text-white/70 hover:text-white'
                              }`}
                            >
                              {copiedId === prompt.id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>
          )}
          {/* Editor */}
          <div className="col-span-8 bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedPrompt?.name || 'Select a prompt'}
                </h2>
                {selectedPrompt && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Prompt
                  </button>
                )}
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    {updating ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] transition-all">
                        Updating...
                      </div>
                    ) : (
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] transition-all"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    )}
                  </div>
                )}
              </div>
              {selectedPrompt ? (
                <textarea
                  value={isEditing ? editedContent : selectedPrompt.content}
                  onChange={e => setEditedContent(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full h-[calc(100vh-280px)] px-4 py-3 font-mono text-sm border rounded-lg resize-none transition-all ${
                    isEditing
                      ? 'bg-white border-[#5D1C83] focus:ring-2 focus:ring-[#5D1C83]'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                />
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-280px)] bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
                  Select a prompt to view or edit
                </div>
              )}
              {selectedPrompt && (
                <div className="mt-4 text-sm text-gray-500">
                  Last modified: {new Date(selectedPrompt.lastModified).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg border transition-all transform duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
}
