// src/components/ui/PaginationControls.jsx
import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
        >
          <div className="p-1 bg-white/50 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          Previous
        </button>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <span className="text-sm text-blue-800 font-semibold">
              Page <span className="text-blue-900 font-bold">{currentPage}</span> of{' '}
              <span className="text-blue-900 font-bold">{totalPages}</span>
            </span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      if (pageNum < currentPage) {
                        for (let j = 0; j < currentPage - pageNum; j++) onPrevious();
                      } else if (pageNum > currentPage) {
                        for (let j = 0; j < pageNum - currentPage; j++) onNext();
                      }
                    }}
                    className={`w-10 h-10 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm hover:shadow-md transform hover:scale-110 ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
        >
          Next
          <div className="p-1 bg-white/50 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
