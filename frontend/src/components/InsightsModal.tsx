import React from 'react';

type InsightsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  insight: string;
  isLoading: boolean;
};

const InsightsModal: React.FC<InsightsModalProps> = ({ isOpen, onClose, insight, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="insights-title"
        onClick={(e) => e.stopPropagation()} // Prevent overlay from closing when clicking inside
      >
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <h3 id="insights-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Song Insight
            </h3>
            <button
              onClick={onClose}
              aria-label="Close insights"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white ml-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Generating insight...</p>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{insight || 'No insight available.'}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsModal;
