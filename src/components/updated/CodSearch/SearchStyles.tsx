export function SearchStyles() {
  return (
    <style>
      {`
        /* Container styles */
        .gsc-control-cse {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        /* Search box styles */
        .gsc-search-box {
          margin-bottom: 0 !important;
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          position: relative !important;
        }

        /* Move search button closer */
        .gsc-input-box {
          border-radius: 0rem !important;
          border: 1px solid #e5e7eb !important;
          padding: 0.75rem 3.5rem 0.75rem 1rem !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
          max-width:1000px !important;
          position: relative !important;
        }
          .gsc-input {
          padding-right: 0 !important;
          font-size: 18px !important;
          padding-right: 80px !important;
          width:1100px;
        }

        /* Clear button */
        .gsib_b {
          position: absolute !important;
          right: 48px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          padding: 0 !important;
          width: auto !important;
        }

        .gsst_a {
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
          background: rgba(93, 28, 131, 0.1) !important;
          cursor: pointer !important;
          z-index: 10 !important;
          position: relative !important;
        }

        /* Hide label text */
        .gsst_a .gscb_a::after {
          content: none !important;
        }

        .gsst_a:hover {
          background: rgba(93, 28, 131, 0.2) !important;
        }

        .gsst_a .gscb_a {
          color: #5D1C83 !important;
          font-size: 20px !important;
          line-height: 1 !important;
          position: static !important;
          transition: transform 0.2s !important;
          pointer-events: none !important;
        }

        .gsst_a:hover .gscb_a {
          transform: scale(1.1) !important;
        }

        /* Make sure the clear button is clickable */
        .gsst_a::before {
          content: '';
          position: absolute !important;
          inset: 0 !important;
          cursor: pointer !important;
        }
        

        .gsc-search-button {
          margin-left: 0 !important;
          position: absolute !important;
          right: 0 !important;
          top: 0 !important;
          height: 100% !important;
          width: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .gsc-search-button-v2 {
          padding: 0.75rem !important;
          border-radius: 0rem !important;
          background-color: #5D1C83 !important;
          border-color: #5D1C83 !important;
          transition: all 0.2s !important;
          height: 100% !important;
          min-width: 40px !important;
          width: 80px !important;
        }

        .gsc-search-button-v2:hover {
          background-color: #4D0C73 !important;
          border-color: #4D0C73 !important;
        }

        .gsc-search-button-v2 svg {
          width: 18px !important;
          height: 18px !important;
        }

        /* Results styles */
        .gsc-result {
          padding: 0.75rem 1rem !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
          transition: all 0.2s !important;
          cursor: pointer !important;
          position: relative !important;
        }

        .gsc-result:hover {
          background: rgba(93, 28, 131, 0.05) !important;
        }
        
        /* Title styles */
        .gs-title {
          color: #5D1C83 !important;
          text-decoration: none !important;
          font-size: 1.125rem !important;
          line-height: 1.5rem !important;
          font-weight: 500 !important;
          display: block !important;
          margin: 0 !important;
          padding-right: 100px !important;
          margin-bottom: 0.5rem !important;
        }

        .gs-title:hover {
          text-decoration: underline !important;
        }

        /* Hide duplicate title */
        .gs-title:not(:first-of-type) {
          display: none !important;
        }

        /* Hide title link decoration */
        .gs-title b {
          font-weight: 500 !important;
        }

        /* Container for title and snippet */
        .gs-bidi-start-align {
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Save button styles */
        .save-button {
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          z-index: 34343434 !important;
          background-color: rgba(255, 255, 255, 0.95) !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 0.5rem 1rem !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          color: #5D1C83 !important;
          backdrop-filter: blur(4px) !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transform: translateY(-4px) scale(0.95) !important;
          pointer-events: none !important;
        }

        /* Only show save button on hover of the specific result */
        .gsc-result:hover .save-button:not(.saved),
        .gsc-imageResult:hover .save-button:not(.saved) {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) scale(1) !important;
          pointer-events: auto !important;
        }

        .save-button:hover {
          transform: scale(1.05) !important;
          background-color: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
        }

        .save-button.saved {
          opacity: 0 !important;
          visibility: hidden !important;
          background-color: #5D1C83 !important;
          color: white !important;
          transform: translateY(-4px) scale(0.95) !important;
          pointer-events: none !important;
        }

        .gsc-result:hover .save-button.saved,
        .gsc-imageResult:hover .save-button.saved {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) scale(1) !important;
          pointer-events: auto !important;
        }

        /* Domain tag */
        .gs-snippet::before {
          content: attr(data-domain);
          position: absolute !important;
          right: 0 !important;
          bottom: 1rem !important;
          font-size: 0.75rem !important;
          padding: 0.125rem 0.5rem !important;
          background: rgba(93, 28, 131, 0.1) !important;
          color: #5D1C83 !important
          border-radius: 0.375rem !important;
          font-weight: 500 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          max-width: 200px !important;
          text-align: right !important;
        }

        .gsc-url-top {
          color: #059669 !important;
          font-size: 0.75rem !important;
          margin: 0 !important;
          display: block !important;
          position: absolute !important;
          bottom: 3rem !important;
          left: 0 !important;
        }

        /* Results container */
        .gsc-results-wrapper-overlay {
          padding: 0 !important;
        }

        .gsc-results {
          padding: 0 !important;
        }
        /* Remove extra spacing */
        .gsc-webResult.gsc-result {
          margin: 0 !important;
        }

        .gsc-webResult.gsc-result:last-child {
          border-bottom: none !important;
        }

        /* Compact layout */
        .gs-webResult.gs-result {
          padding: 0 !important;
        }

        .gsc-table-result {
          margin: 0 !important;
        }

        .gsc-thumbnail-inside,
        .gsc-url-top,
        .gsc-url-bottom {
          padding: 0 !important;
          display: none !important;
        }

        /* Hide duplicate elements */
        .gsc-thumbnail-inside > div:not(:first-child),
        .gsc-url-top > div:not(:first-child) {
          display: none !important;
        }
        
        /* Hide structured data */
        .gs-richsnippet-box {
          display: none !important;
        }

        /* Hide eBay label */
        .gs-label {
          display: none !important;
        }
        
        /* Hide first link line */
        .gsc-thumbnail-inside {
          display: none !important;
        }

        /* Web results thumbnail styles */
        .gs-web-image-box {
          max-width: 180px !important;
          max-height: 180px !important;
          width: 160px !important;
          height: 160px !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          margin-right: 16px !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.2s !important;
        }
          .gs-web-image-box .gs-image{
          min-width:160px;
          min-height:160px;
          }

          .gs-imageResult-popup .gs-image-popup-box {
                width:244px;
                
          }
                 .gs-title {
                visibility:hidden !important;
                }
        
        .gs-web-image-box:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .gs-web-image-box img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
          border: none !important;
          transition: transform 0.3s !important;
        }
          
        
        .gs-web-image-box:hover img {
          transform: scale(1.1) !important;
        }

        /* Image results grid */
        .gsc-results .gsc-imageResult {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          margin: 4px !important;
          width: calc(25% - 8px) !important;
          aspect-ratio: 1/1 !important;
          display: inline-block !important;
          vertical-align: top !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          cursor: pointer !important;
          overflow: hidden !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
          border-radius: 8px !important;
          padding-bottom: 0 !important;
          
        }
          .gsc-imageResult img {
          height:250px !important;
          width:100%;
          object-fit:cover;
          }

          .{
          height:500px !important}

        .gsc-results .gsc-imageResult:hover {
          transform: scale(1.02) !important;
          z-index: 2 !important;
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15) !important;
        }

        /* Domain tag for images */
        // .gsc-imageResult::after {
        //   content: attr(data-domain);
        //   position: absolute !important;
        //   left: 8px !important;
        //   bottom: 12px !important;
        //   font-size: 0.75rem !important;
        //   padding: 0.25rem 0.5rem !important;
        //   background: rgba(0, 0, 0, 0.75) !important;
        //   color: white !important;
        //   border-radius: 0.375rem !important;
        //   font-weight: 500 !important;
        //   white-space: nowrap !important;
        //   overflow: hidden !important;
        //   text-overflow: ellipsis !important;
        //   max-width: calc(100% - 16px) !important;
        //   backdrop-filter: blur(4px) !important;
        //   text-align: left !important;
        //   z-index: 10 !important;
        // }

        /* Save button styles */
        .save-button {
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          z-index: 20 !important;
          background-color: rgba(255, 255, 255, 0.95) !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          color: #5D1C83 !important;
          backdrop-filter: blur(4px) !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transform: translateY(-4px) scale(0.95) !important;
          pointer-events: none !important;
        }

        .gsc-result:hover .save-button:not(.saved),
        .gsc-imageResult:hover .save-button:not(.saved) {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) scale(1) !important;
          pointer-events: auto !important;
        }

        .save-button:hover {
          transform: scale(1.05) !important;
          background-color: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
        }

        .gs-selectedImageResult {
        height:auto
        }

        .save-button.saved {
          opacity: 0 !important;
          visibility: hidden !important;
          background-color: #5D1C83 !important;
          color: white !important;
          transform: translateY(-4px) scale(0.95) !important;
          pointer-events: none !important;
        }

        .gsc-result:hover .save-button.saved,
        .gsc-imageResult:hover .save-button.saved {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) scale(1) !important;
          pointer-events: auto !important;
        }

        /* Responsive grid */
        @media (max-width: 1200px) {
          .gsc-results .gsc-imageResult {
            width: calc(33.333% - 8px) !important;
          }
        }

        @media (max-width: 768px) {
          .gsc-results .gsc-imageResult {
            width: calc(50% - 8px) !important;
          }
        }

        @media (max-width: 480px) {
          .gsc-results .gsc-imageResult {
            width: 100% !important;
          }
        }

        
        /* Hide pagination */
        .gsc-cursor-box {
          display: block !important;
          margin-top: 2rem !important;
          text-align: center !important;
          padding: 2rem !important;
          border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
        }
        
        .gsc-cursor {
          display: inline-block !important;
          gap: 0.75rem !important;
          background: rgba(255, 255, 255, 0.8) !important;
          padding: 0.75rem !important;
          border-radius: 1rem !important;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          backdrop-filter: blur(8px) !important;
          transform: translateY(0) !important;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .gsc-cursor:hover {
          transform: translateY(-2px) !important;
        }
        
        .gsc-cursor-page {
          min-width: 3rem !important;
          height: 3rem !important;
          padding: 0 1rem !important;
          border-radius: 0.75rem !important;
          color: #374151 !important;
          font-weight: 600 !important;
          font-size: 1.125rem !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: linear-gradient(to bottom, #ffffff, #f9fafb) !important;
          border: 1px solid rgba(209, 213, 219, 0.5) !important;
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.05),
            0 1px 2px rgba(0, 0, 0, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.8) !important;
          transform: translateY(0) !important;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5) !important;
        }
        
        .gsc-cursor-page:hover {
          background: linear-gradient(to bottom, #ffffff, #f3e8ff) !important;
          color: #5D1C83 !important;
          transform: translateY(-2px) !important;
          box-shadow:
            0 4px 6px rgba(93, 28, 131, 0.1),
            0 2px 4px rgba(93, 28, 131, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
          border-color: rgba(93, 28, 131, 0.2) !important;
        }
        
        .gsc-cursor-current-page {
          background: linear-gradient(to bottom, #6D2C93, #5D1C83) !important;
          color: white !important;
          border-color: #4D0C73 !important;
          box-shadow:
            0 4px 6px rgba(93, 28, 131, 0.2),
            0 2px 4px rgba(93, 28, 131, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2) !important;
          transform: translateY(-1px) !important;
        }
        
        .gsc-cursor-current-page:hover {
          transform: translateY(-1px) !important;
          background: linear-gradient(to bottom, #7D3CA3, #6D2C93) !important;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        // .gs-image-popup-box{
        // height:100%;
        // }

      //   .gs-ellipsis {
      //   padding-top:55px !important;
      //    color :white !important;

      //  }
        

      `}
    </style>
  );
}
