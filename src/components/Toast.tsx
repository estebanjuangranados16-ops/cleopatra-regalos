import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ShoppingCart, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';

export interface ToastType {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  icon?: 'cart' | 'heart' | 'check';
}

const Toast: React.FC = () => {
  const { toasts, removeToast } = useStore();

  const getIcon = (type: ToastType['type'], icon?: ToastType['icon']) => {
    if (icon === 'cart') return <ShoppingCart className="w-5 h-5" />;
    if (icon === 'heart') return <Heart className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  const getColors = (type: ToastType['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[10000] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg max-w-sm ${getColors(toast.type)}`}
          >
            <div className="flex-shrink-0">
              {getIcon(toast.type, toast.icon)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{toast.title}</p>
              <p className="text-xs opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:bg-white/20 rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;