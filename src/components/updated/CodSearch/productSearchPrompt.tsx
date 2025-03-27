import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../CodSearch/translations';
import LanguageSelector from '../CodSearch/languageSelector';
import SearchTypeSelector from '../CodSearch/searchTypeSelector';
import KeywordsForm from '../CodSearch/keywordForms';
import WinningProductsForm from '../CodSearch/winningProductsForms';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import { useProductStore } from '@/store';
import Notification from '@/components/Notification';
import CreditsInformation from '@/components/credits/CreditsInformation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (prompt: string) => Promise<void>;
}

export default function ProductSearchPrompt({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}: Props) {
  const [searchType, setSearchType] = useState<'keywords' | 'winning' | null>(null);
  const [productName, setProductName] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const handleSubmit = async () => {
    const credits = await getCredits(user?.uid, 'productSearchAssistant');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    let prompt = '';

    if (searchType === 'keywords') {
      prompt = `Generate search keywords for the product: ${productName}. Focus on keywords that will help find potential customers and market the product effectively.`;
    } else if (searchType === 'winning') {
      prompt = `Act as an expert in market analysis and consumer trends...`; // Rest of the prompt
    }

    await onSubmit(prompt);
    const result = await updateCredits(user?.uid, 'productSearchAssistant');
    setPackage(userPackage.plan, result.toString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden overflow-y-auto border border-purple-100">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-[#4B2A85] to-[#8A1C66] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-semibold text-white">{TRANSLATIONS[language].title}</h2>
          </div>
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>

        {/* Content */}
        <div
          className={`p-6 overflow-y-auto max-h-[calc(90vh-100px)] ${
            language === 'ar' ? 'rtl' : 'ltr'
          }`}
        >
          {searchType ? (
            <SearchTypeSelector language={language} onSelect={setSearchType} />
          ) : searchType === 'keywords' ? (
            <KeywordsForm
              language={language}
              productName={productName}
              onProductNameChange={setProductName}
            />
          ) : (
            <WinningProductsForm
              language={language}
              formData={formData}
              onChange={newData => setFormData(prev => ({ ...prev, ...newData }))}
            />
          )}
        </div>
        {/* Footer */}
        <div
          className={`p-6 bg-gray-50 border-t border-gray-100 flex justify-between ${
            language === 'ar' ? 'rtl' : 'ltr'
          }`}
        >
          <button
            onClick={() => (searchType ? setSearchType(null) : onClose())}
            className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {searchType
              ? TRANSLATIONS[language].buttons.back
              : TRANSLATIONS[language].buttons.cancel}
          </button>
          {!searchType && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {TRANSLATIONS[language].buttons.generate}
            </button>
          )}
        </div>
        <CreditsInformation
          creditType={'productSearchAssistant'}
          requiredCredits={'Credits required to generate keywords'}
          classes="flex justify-center gap-2"
        />
      </div>
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
