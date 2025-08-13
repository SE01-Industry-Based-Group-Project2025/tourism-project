import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useConfirmContext } from './ConfirmProvider';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = () => {
  const { confirmState, handleConfirm, handleCancel } = useConfirmContext();
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (confirmState.isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [confirmState.isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCancel();
      }
    };

    if (confirmState.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [confirmState.isOpen, handleCancel]);

  if (!confirmState.isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 id="confirm-title" className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Action
            </h3>
            <p id="confirm-message" className="text-gray-600 mb-6">
              {confirmState.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                ref={confirmButtonRef}
                onClick={handleConfirm}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
