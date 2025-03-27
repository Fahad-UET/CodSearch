import React, { useState } from 'react';
import { StickyNote, Plus, Trash2, Save, X } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  created: string;
  updatedAt: string;
}

interface ProductNotesProps {
  productId: string;
  notes: Note[];
  // to resolve build issue please check this
  //onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddNote: (note: any) => void;
  onDeleteNote: (noteId: string) => void;
  onClose: () => void;
}

export function ProductNotes({
  productId,
  notes,
  onAddNote,
  onDeleteNote,
  onClose,
}: ProductNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    onAddNote({
      content: newNote.trim(),
    });

    setNewNote('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <StickyNote size={20} className="text-purple-600" />
            <h2 className="text-xl font-semibold">Product Notes</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Add Note Button */}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-purple-200 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Note
            </button>
          )}

          {/* New Note Form */}
          {isAdding && (
            <div className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                className="w-full h-32 p-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200 whitespace-pre-wrap"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === ' ' && !e.shiftKey) {
                    e.preventDefault();
                    const cursorPosition = e.currentTarget.selectionStart;
                    const textBeforeCursor = newNote.slice(0, cursorPosition);
                    const textAfterCursor = newNote.slice(cursorPosition);
                    setNewNote(textBeforeCursor + ' ' + textAfterCursor);
                    // Set cursor position after the space
                    setTimeout(() => {
                      e.currentTarget.selectionStart = cursorPosition + 1;
                      e.currentTarget.selectionEnd = cursorPosition + 1;
                    }, 0);
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Note
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-3">
            {notes.map(note => (
              <div
                key={note.id}
                className="p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="text-gray-900 whitespace-pre-wrap">{note.content}</div>
                    <div className="text-sm text-gray-500 mt-2">{note.created}</div>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {notes.length === 0 && !isAdding && (
              <div className="text-center py-12 text-gray-500">
                <StickyNote size={32} className="mx-auto mb-3 text-gray-400" />
                <div>No notes yet. Click "Add Note" to create one.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}