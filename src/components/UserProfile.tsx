import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { cart, favorites, addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');

  const handleLogout = () => {
    logout();
    addToast({
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Has cerrado sesión correctamente'
    });
    onClose();
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'settings', label: 'Configuración', icon: Settings }
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
            className="fixed inset-4 bg-white rounded-2xl z-[9999] flex flex-col max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                Mi Perfil
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 p-6">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold" style={{ color: colors.secondary }}>
                    {user.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 mt-2">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrador
                    </span>
                  )}
                </div>

                {/* Navigation */}
                <nav className="space-y-2 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-3 ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      style={{ backgroundColor: activeTab === tab.id ? colors.primary : undefined }}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Admin Panel Access */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      // You can add admin panel opening logic here
                      addToast({
                        type: 'info',
                        title: 'Panel de Admin',
                        message: 'Accede desde la sección de productos'
                      });
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-blue-600 hover:bg-blue-50 flex items-center space-x-3 mb-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Panel de Admin</span>
                  </button>
                )}
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 flex items-center space-x-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'profile' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Información del Perfil</h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <span>{user.name}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Rol</label>
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <span className="capitalize">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h4 className="font-semibold mb-4" style={{ color: colors.secondary }}>
                            Estadísticas
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center space-x-2">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Productos en carrito</span>
                              </span>
                              <span className="font-bold" style={{ color: colors.primary }}>
                                {cart.length}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center space-x-2">
                                <Heart className="w-4 h-4" />
                                <span>Productos favoritos</span>
                              </span>
                              <span className="font-bold" style={{ color: colors.primary }}>
                                {favorites.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Historial de Pedidos</h3>
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No tienes pedidos aún</p>
                      <p className="text-gray-400 text-sm">Tus pedidos aparecerán aquí una vez que realices una compra</p>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Configuración</h3>
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Notificaciones</h4>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span>Recibir notificaciones de nuevos productos</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span>Recibir ofertas especiales por email</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Privacidad</h4>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" className="rounded" />
                            <span>Hacer mi perfil público</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span>Permitir recomendaciones personalizadas</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;