import React from 'react';
import { createPortal } from 'react-dom';

type InsightsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  insight: string;
  isLoading: boolean;
};

const InsightsModal: React.FC<InsightsModalProps> = ({ isOpen, onClose, insight, isLoading }) => {
  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 bg-gray-800 rounded-lg shadow-lg flex flex-col" // Added flex flex-col
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 4rem)' }} // Give some margin from viewport edges
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-start justify-between">
            <h3 id="insights-title" className="text-lg font-semibold text-gray-100">
              Song Insight
            </h3>
            <button
              onClick={onClose}
              aria-label="Close insights"
              className="text-gray-300 hover:text-white ml-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body - This will now scroll */}
        <div
          className="px-6 pt-4 pb-2 text-gray-200 whitespace-pre-line overflow-y-auto flex-1" // Added flex-1 and removed inline styles
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-3 text-sm text-gray-300">Generating insight...</p>
            </div>
          ) : (
            <p>{insight || 'No insight available.'}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default InsightsModal;