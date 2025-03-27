import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, AlertCircle, Building, Save } from 'lucide-react';
import { useServiceProviderStore } from '../../store/serviceProviderStore';
import { ServiceProviderData } from '@/services/serviceProviders/types';
import { ServiceProviderForm } from './ServiceProviderForm';

interface ServiceProviderModalProps {
  onClose: () => void;
}

export function ServiceProviderModal({ onClose }: ServiceProviderModalProps) {
  const { providers, addProvider, updateProvider, deleteProvider, resetToDefaults } = useServiceProviderStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ServiceProviderData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (provider: ServiceProviderData) => {
    try {
      setError(null);
      if (editingProvider) {
        await updateProvider(provider.id, provider);
        setSuccess('Provider updated successfully');
      } else {
        await addProvider(provider);
        setSuccess('Provider added successfully');
      }
      setEditingProvider(null);
      setShowAddForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save provider');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (id === 'cod-network') {
        throw new Error('Cannot delete default provider');
      }
      await deleteProvider(id);
      setSuccess('Provider deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete provider');
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    setSuccess('Settings reset to defaults');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Service Providers</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Provider
            </button>
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
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
              <Save size={20} />
              {success}
            </div>
          )}

          {(showAddForm || editingProvider) ? (
            <ServiceProviderForm
              provider={editingProvider}
              onSave={handleSave}
              onCancel={() => {
                setEditingProvider(null);
                setShowAddForm(false);
              }}
            />
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{provider.name}</h3>
                      {provider.isDefault && (
                        <span className="text-sm text-purple-600">Default Provider</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProvider(provider)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        Edit Settings
                      </button>
                      {!provider.isDefault && (
                        <button
                          onClick={() => handleDelete(provider.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle size={24} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reset to Defaults?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    This will reset all service providers to their default settings. This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
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