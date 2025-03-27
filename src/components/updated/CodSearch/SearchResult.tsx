import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader } from 'lucide-react';
import { SearchStyles } from '../CodSearch/SearchStyles';

interface Props {
  showResults: boolean;
  setShowResults: (show: boolean) => void;
}

export default function SearchResults({ showResults, setShowResults }: Props) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchInitialized = useRef(false);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
      {/* Results Content */}
      {showResults && (
        <div className="p-6">
          {/* <SearchStyles /> */}
          <div
            ref={resultsRef}
            className="gcse-searchresults-only"
            data-gname="storesearch"
            data-num="10" // Ensure this is set to 10
            data-enableorderby="true"
            data-pagingsize="10" // Set pagination size to 10
            data-pagingtype="google"
            data-enableimagesearch="true"
            data-defaulttoimagesearch="true"
            data-imagesearchlayout="column"
            data-mobilelayout="true"
            data-enablehistory="true"
            data-linktarget="_blank"
          ></div>
        </div>
      )}
    </div>
  );
}
