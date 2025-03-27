import React from 'react';
import { Save, AlertCircle, Check } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: Error | null;
}

export function AutoSaveIndicator({ 
  isSaving, 
  lastSaved, 
  hasUnsavedChanges,
  error 
}: AutoSaveIndicatorProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle size={16} />
        <span className="text-sm">Save failed: {error.message}</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-purple-600">
        <Save size={16} className="animate-pulse" />
        <span className="text-sm">Saving changes...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center gap-2 text-yellow-600">
        <Save size={16} />
        <span className="text-sm">Unsaved changes</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Check size={16} />
        <span className="text-sm">
          Saved {lastSaved.toLocaleTimeString()}
        </span>
      </div>
    );
  }

  return null;
}