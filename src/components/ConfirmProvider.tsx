import React from 'react';
import { useConfirm } from '../hooks/useConfirm';
import ConfirmDialog from './ConfirmDialog';

const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { confirmState, handleConfirm, handleCancel } = useConfirm();

  return (
    <>
      {children}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default ConfirmProvider;