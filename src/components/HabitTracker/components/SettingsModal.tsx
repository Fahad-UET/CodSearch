import React from 'react';
import { X, Globe, RotateCcw, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  // to resolve build issue please check this optional
  onReset?: () => void;
}

export function SettingsModal({ onClose, language, onLanguageChange, onReset }: SettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {language === 'en' ? 'Settings' : 'الإعدادات'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Language Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              {language === 'en' ? 'Language' : 'اللغة'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onLanguageChange('en')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  language === 'en'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <Globe size={20} />
                <span>English</span>
              </button>

              <button
                onClick={() => onLanguageChange('ar')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  language === 'ar'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <Globe size={20} />
                <span>العربية</span>
              </button>
            </div>
          </div>

          {/* Reset Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              {language === 'en' ? 'Reset Data' : 'إعادة تعيين البيانات'}
            </h3>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              {language === 'en' ? 'Reset to Defaults' : 'إعادة التعيين إلى الافتراضي'}
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Reset to Defaults?' : 'إعادة التعيين؟'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {language === 'en'
                    ? 'This will reset all habits and categories to their default values. This action cannot be undone.'
                    : 'سيؤدي هذا إلى إعادة تعيين جميع العادات والفئات إلى قيمها الافتراضية. لا يمكن التراجع عن هذا الإجراء.'}
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {language === 'en' ? 'Cancel' : 'إلغاء'}
                  </button>
                  <button
                    onClick={() => {
                      onReset();
                      setShowResetConfirm(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    {language === 'en' ? 'Reset' : 'إعادة تعيين'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}