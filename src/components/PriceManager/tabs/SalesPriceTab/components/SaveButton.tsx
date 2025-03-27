import React from 'react';
import { Save, Edit2, AlertCircle } from 'lucide-react';

interface SaveButtonProps {
  isEditing: boolean;
  isSaving: boolean;
  error: string | null;
  onEdit: () => void;
  onSave: () => void;
}

export function SaveButton({ isEditing, isSaving, error, onEdit, onSave }: SaveButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-lg">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      <button
        onClick={isEditing ? onSave : onEdit}
        disabled={isSaving}
        className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 ${
          isEditing
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {isSaving ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : isEditing ? (
          <>
            <Save size={20} />
            Save Changes
          </>
        ) : (
          <>
            <Edit2 size={20} />
            Edit Price
          </>
        )}
      </button>
    </div>
  );
}