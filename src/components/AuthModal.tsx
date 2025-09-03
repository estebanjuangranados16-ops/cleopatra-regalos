import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { login, register } = useAuth();
  const { addToast } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (success) {
          addToast({
            type: 'success',
            title: '¡Bienvenido!',
            message: 'Has iniciado sesión correctamente'
          });
          onClose();
        } else {
          addToast({
            type: 'error',
            title: 'Error de autenticación',
            message: 'Email o contraseña incorrectos'
          });
        }
      } else {
        success = await register(formData.email, formData.password, formData.name);
        if (success) {
          addToast({
            type: 'success',
            title: '¡Cuenta creada!',
            message: 'Tu cuenta se ha creado exitosamente'
          });
          onClose();
        } else {
          addToast({
            type: 'error',
            title: 'Error de registro',
            message: 'El email ya está registrado'
          });
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Ocurrió un error inesperado'
      });
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'admin@cleopatra.com', password: 'admin123', role: 'Admin' },
    { email: 'cliente@test.com', password: '123456', role: 'Cliente' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-4 bg-white rounded-2xl z-[9999] flex max-w-4xl mx-auto"
          >
            <div className="flex-1 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-lg text-white font-semibold text-lg disabled:opacity-50"
                  style={{ backgroundColor: colors.primary }}
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 font-semibold hover:underline"
                    style={{ color: colors.primary }}
                  >
                    {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                  </button>
                </p>
              </div>
            </div>

            {/* Demo Credentials Panel */}
            <div className="w-80 bg-gray-50 p-6 rounded-r-2xl">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.secondary }}>
                Credenciales de Prueba
              </h3>
              <div className="space-y-4">
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{cred.role}</span>
                      <button
                        onClick={() => setFormData({ ...formData, email: cred.email, password: cred.password })}
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: colors.primary, color: 'white' }}
                      >
                        Usar
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Email: {cred.email}</p>
                    <p className="text-xs text-gray-600">Contraseña: {cred.password}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Usa las credenciales de Admin para acceder al panel de administración.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;