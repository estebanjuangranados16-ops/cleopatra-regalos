import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onBackToLogin 
}) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Formato de email inválido');
      return;
    }

    setLoading(true);
    setError('');

    // Simular envío de email
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 2000);
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSent(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop bg-black/60 modal-overlay"
          onClick={handleBackdropClick}
        >
          <div className="modal-container">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl w-full max-w-md modal-content overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={onBackToLogin}
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="text-center mt-8">
                {sent ? (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h2 className="text-2xl font-bold mb-2" style={{ color: colors.secondary }}>
                      Email enviado
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Revisa tu bandeja de entrada para restablecer tu contraseña
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: colors.secondary }}>
                      ¿Olvidaste tu contraseña?
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Ingresa tu email y te enviaremos un enlace para restablecerla
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {sent ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-700 text-sm">
                      Se ha enviado un enlace de recuperación a <strong>{email}</strong>
                    </p>
                  </div>
                  
                  <button
                    onClick={onBackToLogin}
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-200 border-2 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ 
                      borderColor: colors.primary, 
                      color: colors.primary 
                    }}
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                          error 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="tu@email.com"
                        disabled={loading}
                      />
                    </div>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 font-medium"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      'Enviar enlace de recuperación'
                    )}
                  </button>
                </form>
              )}
            </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ForgotPasswordModal;