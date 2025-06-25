// src/components/ui/DeleteConfirmModal.jsx
import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, item, type = 'destination' }) => {
  if (!isOpen) return null;

  const isDestination = type === 'destination';
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md transform transition-all border border-white/20">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gradient-to-r from-red-100 to-orange-100">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Confirm Deletion</h2>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
              <p className="text-gray-700 leading-relaxed">
                Are you sure you want to delete the {isDestination ? 'destination' : 'activity'}{' '}
                <span className="font-bold text-gray-900">"{item?.name}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This will permanently remove it from the {item?.region} region.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50 hover:shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(item)}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 hover:shadow-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
