import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, X, Settings } from 'lucide-react';
import { Note, NoteCategory, NOTE_COLORS } from './types';
import { NoteTabs } from './NoteTabs';
import { NotesList } from './NotesList';
import { CategoryManager } from './CategoryManager';

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'All Notes', color: NOTE_COLORS.purple },
  { id: 'personal', name: 'Personal', color: NOTE_COLORS.pink },
  { id: 'work', name: 'Work', color: NOTE_COLORS.blue },
  { id: 'ideas', name: 'Ideas', color: NOTE_COLORS.green },
  { id: 'tasks', name: 'Tasks', color: NOTE_COLORS.amber }
];

export function Notes({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [categories, setCategories] = useState<NoteCategory[]>(() => {
    const savedCategories = localStorage.getItem('noteCategories');
    return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
  });

  const [currentNote, setCurrentNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('noteCategories', JSON.stringify(categories));
  }, [categories]);

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    if (editingNote) {
      setNotes(prev =>
        prev.map(note =>
          note.id === editingNote.id
            ? { ...note, content: currentNote.trim(), updatedAt: new Date() }
            : note
        )
      );
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote.trim(),
        createdAt: new Date(),
        categoryId: selectedCategory === 'all' ? 'personal' : selectedCategory,
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setCurrentNote('');
    setEditingNote(null);
    setIsWriting(false);
  };

  const handleAddCategory = (name: string, color: string) => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name,
      color,
      count: 0
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    // Move notes from deleted category to 'personal'
    setNotes(prev =>
      prev.map(note =>
        note.categoryId === categoryId ? { ...note, categoryId: 'personal' } : note
      )
    );
  };

  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: category.id === 'all' 
      ? notes.length 
      : notes.filter(note => note.categoryId === category.id).length
  }));

  const filteredNotes = notes.filter(
    note => selectedCategory === 'all' || note.categoryId === selectedCategory
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <StickyNote size={24} className="text-purple-600" />
            <h2 className="text-xl font-semibold">Quick Notes</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1.5"
            >
              <Settings size={16} />
              Categories
            </button>
            <button
              onClick={() => setIsWriting(true)}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} />
              New Note
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isWriting ? (
            <div className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                >
                  {categories.filter(c => c.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={currentNote}
                onChange={e => setCurrentNote(e.target.value)}
                placeholder="Write your note here..."
                className="w-full h-36 p-4 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring focus:ring-purple-200 resize-none text-base"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setIsWriting(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!currentNote.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </div>
          ) : (
            <NoteTabs
              categories={categoriesWithCounts}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <NotesList
              notes={filteredNotes}
              onDelete={(id) => setNotes(prev => prev.filter(note => note.id !== id))}
              onEdit={(note) => {
                setCurrentNote(note.content);
                setEditingNote(note);
                setIsWriting(true);
              }}
            />
          </div>
        </div>
      </div>

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  );
}