import { useStore } from '../store/useStore';
import { ToastType } from '../components/Toast';

export const useNotification = () => {
  const { addToast } = useStore();

  const showSuccess = (title: string, message: string, icon?: ToastType['icon']) => {
    addToast({
      type: 'success',
      title,
      message,
      icon: icon || 'check'
    });
  };

  const showError = (title: string, message: string) => {
    addToast({
      type: 'error',
      title,
      message
    });
  };

  const showWarning = (title: string, message: string) => {
    addToast({
      type: 'warning',
      title,
      message
    });
  };

  const showInfo = (title: string, message: string) => {
    addToast({
      type: 'info',
      title,
      message,
      icon: 'info'
    });
  };

  // Notificaciones específicas para productos
  const showProductSaved = (productName: string, isUpdate = false) => {
    showSuccess(
      isUpdate ? 'Producto actualizado' : 'Producto creado',
      `${productName} se guardó correctamente`,
      'save'
    );
  };

  const showProductDeleted = (productName: string) => {
    showSuccess(
      'Producto eliminado',
      `${productName} se eliminó correctamente`,
      'delete'
    );
  };

  const showAddedToCart = (productName: string) => {
    showSuccess(
      'Agregado al carrito',
      `${productName} se agregó al carrito`,
      'cart'
    );
  };

  const showAddedToFavorites = (productName: string) => {
    showSuccess(
      'Agregado a favoritos',
      `${productName} se agregó a favoritos`,
      'heart'
    );
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showProductSaved,
    showProductDeleted,
    showAddedToCart,
    showAddedToFavorites
  };
};