import React, { useState } from 'react';
import { Trash2, Maximize2, Minimize2, Edit2 } from 'lucide-react';
import { Note } from './types';

interface NotesListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export function NotesList({ notes, onDelete, onEdit }: NotesListProps) {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const handleExpandNote = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {notes.map(note => {
        const isExpanded = expandedNoteId === note.id;
        const isLongNote = note.content.length > 150;

        return (
          <div
            key={note.id}
            className={`rounded-lg p-3 group transition-all hover:shadow-lg ${
              isExpanded ? 'col-span-2' : ''
            } bg-gradient-to-br from-white/10 to-white/5 border border-gray-200`}
          >
            <div className="flex justify-between items-start gap-2">
              <p className={`text-black text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
                {note.content}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(note)}
                  className="p-1.5 text-gray-600 hover:text-gray-600 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Edit note"
                >
                  <Edit2 size={16} />
                </button>
                {isLongNote && (
                  <button
                    onClick={() => handleExpandNote(note.id)}
                    className="p-1.5 text-gray-600 hover:text-gray-600 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title={isExpanded ? 'Collapse note' : 'Expand note'}
                  >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                )}
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-black">
                {new Date(note.createdAt).toLocaleString()}
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <span className="ml-2">(edited)</span>
                )}
              </p>
              {isLongNote && !isExpanded && (
                <button
                  onClick={() => handleExpandNote(note.id)}
                  className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
                >
                  Read more
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
