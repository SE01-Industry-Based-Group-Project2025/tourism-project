import React, { createContext, useContext, useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    resolve: null,
  });

  const confirm = (message) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (confirmState.resolve) {
      confirmState.resolve(true);
    }
    setConfirmState({
      isOpen: false,
      message: '',
      resolve: null,
    });
  };

  const handleCancel = () => {
    if (confirmState.resolve) {
      confirmState.resolve(false);
    }
    setConfirmState({
      isOpen: false,
      message: '',
      resolve: null,
    });
  };

  const value = {
    confirm,
    confirmState,
    handleConfirm,
    handleCancel,
  };

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog />
    </ConfirmContext.Provider>
  );
};

export const useConfirmContext = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirmContext must be used within a ConfirmProvider');
  }
  return context;
};
