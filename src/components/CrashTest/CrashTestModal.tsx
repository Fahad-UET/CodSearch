import React, { useEffect, useState } from 'react';
import { X, FileText, Save, AlertCircle, Plus } from 'lucide-react';
import { Product } from '../../types';
import { SwotTab } from './SwotTab';
import { AidaTab } from './AidaTab';
import { CustomQuestionnaireModal } from '../CustomQuestionnaire/CustomQuestionnaireModal';
import { useProductStore } from '../../store';
import { RatingAnswers } from '../../types';

interface CrashTestModalProps {
  product: Product;
  onClose: () => void;
  // to resolve build issue please check this added
  crashTab: any
}

type TabType = 'swot' | 'aida' | 'custom';

export function CrashTestModal({ product, onClose, crashTab }: CrashTestModalProps) {
  // to resolve build issue please check this
  // const { updateProduct, userProfile } = useProductStore();
  const { updateProduct } = useProductStore();
    // create userProfile in useProductStore;
    // to resolve build issue please check this added
  const userProfile: any = {customQuestionnaires: []};
  const [activeTab, setActiveTab] = useState<TabType>('swot');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showCustomQuestionnaire, setShowCustomQuestionnaire] = useState(false);

  const handleScoreUpdate = async (score: number, answers: RatingAnswers) => {
    try {
      setIsSaving(true);
      setError(null);

      await updateProduct(product.id, {
        metrics: {
          ...product.metrics,
          [activeTab === 'swot' ? 'swotScore' : 'aidaScore']: score,
          [activeTab === 'swot' ? 'swotAnswers' : 'aidaAnswers']: answers,
          lastUpdated: new Date().toISOString(),
        },
      });

      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setActiveTab(crashTab.tab);
  }, [crashTab]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md flex items-center justify-center z-[100]">
      <div className="bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-purple-900">Product Analysis</h2>
              <p className="text-sm text-purple-600">{product.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isSaving && (
              <div className="flex items-center gap-2 text-purple-600">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Saving...</span>
              </div>
            )}
            {showSaveSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <Save size={20} />
                <span className="text-sm">Saved!</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        {!crashTab.status && (
          <div className="flex border-b border-purple-100">
            <button
              onClick={() => setActiveTab('swot')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'swot'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              SWOT Analysis
            </button>
            <button
              onClick={() => setActiveTab('aida')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'aida'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              AIDA Analysis
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'custom'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              Custom Analysis
            </button>
          </div>
        )}

        {crashTab.tab === 'swot' && (
          <>
            <button
              onClick={() => setActiveTab('swot')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'swot'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              SWOT Analysis
            </button>
            <SwotTab
              onScoreUpdate={handleScoreUpdate}
              initialAnswers={product.metrics?.swotAnswers}
            />
          </>
        )}

        {error && (
          <div className="mx-6 mt-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-136px)]">
          {activeTab === 'swot' ? (
            <SwotTab
              onScoreUpdate={handleScoreUpdate}
              initialAnswers={product.metrics?.swotAnswers}
            />
          ) : activeTab === 'aida' ? (
            <AidaTab
              onScoreUpdate={handleScoreUpdate}
              initialAnswers={product.metrics?.aidaAnswers}
            />
          ) : (
            <div className="text-center py-12">
              {userProfile?.customQuestionnaires?.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Questionnaires</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {userProfile.customQuestionnaires.map(questionnaire => (
                      <div
                        key={questionnaire.id}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900">{questionnaire.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {questionnaire.questions.length} questions in{' '}
                          {questionnaire.categories.length} categories
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">No custom questionnaires yet</p>
                  <button
                    onClick={() => setShowCustomQuestionnaire(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Create Custom Questionnaire
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCustomQuestionnaire && (
        <CustomQuestionnaireModal onClose={() => setShowCustomQuestionnaire(false)} />
      )}
    </div>
  );
}
