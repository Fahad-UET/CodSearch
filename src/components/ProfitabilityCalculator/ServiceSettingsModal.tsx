import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle } from 'lucide-react';

interface ServiceSettingsModalProps {
  onClose: () => void;
}

export function ServiceSettingsModal({ onClose }: ServiceSettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[300]">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Service Provider Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settings Content</h3>
          <p className="text-gray-600">Service provider settings will be displayed here.</p>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}