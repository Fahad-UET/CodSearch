import { useEffect, useState } from 'react';
import { creditsDeduction } from '../services/firebase/credits';
import { X } from 'lucide-react';

const creditsSection = [
  {
    name: 'Add New Product',
    type: 'addBoardProduct',
  },
  {
    name: 'Save Price',
    type: 'priceChanges',
  },
  {
    name: 'Import Image',
    type: 'addImage',
  },
  {
    name: 'Download Image',
    type: 'imageDownload',
  },
  {
    name: 'Import Video',
    type: 'addVideo',
  },
  {
    name: 'Download Video',
    type: 'videoDownload',
  },
  {
    name: 'Landing Page',
    type: 'addLandingPage',
  },
  {
    name: 'Scraping',
    type: 'scraping',
  },
  {
    name: 'Generate Marketing Lists Ai',
    type: 'generateMarketingLists',
  },
  {
    name: 'Generate Ai Text',
    type: 'generateAiText',
  },
  {
    name: 'Generate Keyword ai research',
    type: 'productSearchAssistant',
  },
  {
    name: 'Research Google',
    type: 'generateKeyword',
  },
  {
    name: 'Add My page Library',
    type: 'saveKeyword',
  },
  {
    name: 'Add My Photos Library',
    type: 'saveKeyword',
  },
  {
    name: 'Add My Add Library',
    type: 'saveKeyword',
  },
  {
    name: 'Download Videos My Ad Library',
    type: 'videoDownload',
  },
];

type props = {
  showCredits: boolean;
  setShowCredits: () => void;
};

const CreditsModal = ({ showCredits, setShowCredits }: props) => {
  return (
    <>
      {showCredits ? (
        <div
          className={`sidebar absolute top-1/4 right-1 w-[20vw]  bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-xl h-[80vh] overflow-y-auto ${
            showCredits ? 'flex flex-col' : 'hidden'
          }`}
          style={{ zIndex: '999999999999999999999999999 !important' }}
          onMouseLeave={setShowCredits}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Credits Needed</h2>
            </div>
            <button onClick={setShowCredits} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2 p-2">
            {creditsSection?.map((item, index) => (
              <p className="flex justify-between gap-1">
                <span>{item.name}</span>
                <span className=""> {creditsDeduction[item.type]}</span>
              </p>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CreditsModal;
