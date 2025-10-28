import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        ...options,
        isOpen: true,
        resolve
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    confirmState.resolve?.(true);
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  }, [confirmState.resolve]);

  const handleCancel = useCallback(() => {
    confirmState.resolve?.(false);
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  }, [confirmState.resolve]);

  // Métodos de conveniencia
  const confirmDelete = useCallback((itemName: string) => {
    return confirm({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });
  }, [confirm]);

  const confirmSave = useCallback((message = '¿Guardar los cambios?') => {
    return confirm({
      title: 'Confirmar cambios',
      message,
      type: 'info',
      confirmText: 'Guardar',
      cancelText: 'Cancelar'
    });
  }, [confirm]);

  const confirmDiscard = useCallback(() => {
    return confirm({
      title: 'Descartar cambios',
      message: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir sin guardar?',
      type: 'warning',
      confirmText: 'Descartar',
      cancelText: 'Continuar editando'
    });
  }, [confirm]);

  return {
    confirmState,
    confirm,
    confirmDelete,
    confirmSave,
    confirmDiscard,
    handleConfirm,
    handleCancel
  };
};