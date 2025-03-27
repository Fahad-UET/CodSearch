import React, { useState, useEffect } from 'react';
import { X, Save, StickyNote, Plus, Edit2 } from 'lucide-react';
import { NoteTabs } from './NoteTabs';
import { NotesList } from './NotesList';
import { Note, NoteCategory } from './types';

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'All Notes', color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
  { id: 'personal', name: 'Personal', color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  { id: 'work', name: 'Work', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  { id: 'ideas', name: 'Ideas', color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
  { id: 'tasks', name: 'Tasks', color: 'bg-gradient-to-r from-amber-500 to-orange-500' }
];

export function Notes({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [currentNote, setCurrentNote] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const categories: NoteCategory[] = DEFAULT_CATEGORIES.map(cat => ({
    ...cat,
    count:
      cat.id === 'all' ? notes.length : notes.filter(note => note.categoryId === cat.id).length,
  }));

  const filteredNotes = notes.filter(
    note => activeCategory === 'all' || note.categoryId === activeCategory
  );

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
        categoryId: activeCategory === 'all' ? 'personal' : activeCategory,
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setCurrentNote('');
    setEditingNote(null);
    setIsWriting(false);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note.content);
    setEditingNote(note);
    setIsWriting(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleCancelEdit = () => {
    setCurrentNote('');
    setEditingNote(null);
    setIsWriting(false);
  };

  return (
    <div className="absolute inset-0 flex items-start justify-center z-[100000] bg-black/75 pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <StickyNote size={20} />
            <h2 className="text-lg font-semibold">Quick Notes</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWriting(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} />
              New Note
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isWriting ? (
            <div className="mb-6">
              <textarea
                value={currentNote}
                onChange={e => setCurrentNote(e.target.value)}
                placeholder="Write your note here..."
                className="w-full h-36 p-4 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring focus:ring-purple-200 resize-none text-base"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!currentNote.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </div>
          ) : (
            <NoteTabs
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          )}

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredNotes.length > 0 ? (
              <NotesList
                notes={filteredNotes}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <StickyNote size={32} className="mx-auto mb-3 text-gray-400" />
                <p>No notes in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
