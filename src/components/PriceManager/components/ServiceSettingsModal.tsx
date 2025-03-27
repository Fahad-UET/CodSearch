import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, AlertCircle } from 'lucide-react';

interface ServiceSettingsModalProps {
  onClose: () => void;
}

export function ServiceSettingsModal({ onClose }: ServiceSettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetToDefaults = () => {
    setShowResetConfirm(false);
    // Reset logic here
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[300]">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Service Provider Settings</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset to Defaults
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Settings content here */}
          <p className="text-gray-600">Service provider settings will be displayed here.</p>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[400]">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle size={24} className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Reset to Defaults?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    This will reset all service provider settings to their default values. This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResetToDefaults}
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}