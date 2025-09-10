import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import OrderManagement from './OrderManagement';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { cart, favorites, addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [showOrderManagement, setShowOrderManagement] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
            className="modal-backdrop bg-black/50 modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-container"
          >
            <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-sm sm:max-w-4xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col modal-content shadow-2xl">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-2xl font-bold" style={{ color: colors.secondary }}>
                Mi Perfil
              </h2>
              <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
              {/* Sidebar */}
              <div className="w-full sm:w-64 bg-gray-50 p-3 sm:p-6 flex-shrink-0 scrollbar-thin overflow-y-auto">
                {/* User Info */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl mx-auto mb-2 sm:mb-3">
                    {user.name?.charAt(0) || 'U'}
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onClose();
                      addToast({
                        type: 'info',
                        title: 'Panel de Admin',
                        message: 'Busca el botón "Agregar Producto" en la barra de navegación'
                      });
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-blue-600 hover:bg-blue-50 flex items-center space-x-3 mb-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Panel de Admin</span>
                  </motion.button>
                )}
                
                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 p-3 sm:p-6 overflow-y-auto scrollbar-thin">
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
                            {isAdmin ? 'Panel de Control' : 'Estadísticas'}
                          </h4>
                          {isAdmin ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                  <Settings className="w-4 h-4" />
                                  <span>Productos gestionados</span>
                                </span>
                                <span className="font-bold" style={{ color: colors.primary }}>
                                  89
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                  <ShoppingBag className="w-4 h-4" />
                                  <span>Pedidos procesados</span>
                                </span>
                                <span className="font-bold" style={{ color: colors.primary }}>
                                  156
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center space-x-2">
                                  <User className="w-4 h-4" />
                                  <span>Usuarios registrados</span>
                                </span>
                                <span className="font-bold" style={{ color: colors.primary }}>
                                  1,234
                                </span>
                              </div>
                            </div>
                          ) : (
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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    {isAdmin ? (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold">Gestión de Pedidos</h3>
                          <button
                            onClick={() => window.location.href = '/admin'}
                            className="px-4 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: colors.primary }}
                          >
                            Ir al Panel de Admin
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 p-6 rounded-lg">
                            <h4 className="font-semibold mb-4 text-blue-800">Pedidos Pendientes</h4>
                            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                            <p className="text-blue-700 text-sm">Requieren atención</p>
                          </div>
                          <div className="bg-green-50 p-6 rounded-lg">
                            <h4 className="font-semibold mb-4 text-green-800">Pedidos Completados</h4>
                            <div className="text-3xl font-bold text-green-600 mb-2">156</div>
                            <p className="text-green-700 text-sm">Este mes</p>
                          </div>
                          <div className="bg-yellow-50 p-6 rounded-lg">
                            <h4 className="font-semibold mb-4 text-yellow-800">Ingresos del Mes</h4>
                            <div className="text-3xl font-bold text-yellow-600 mb-2">$2.4M</div>
                            <p className="text-yellow-700 text-sm">+15% vs mes anterior</p>
                          </div>
                          <div className="bg-purple-50 p-6 rounded-lg">
                            <h4 className="font-semibold mb-4 text-purple-800">Productos Activos</h4>
                            <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
                            <p className="text-purple-700 text-sm">En catálogo</p>
                          </div>
                        </div>
                        <div className="mt-8">
                          <h4 className="font-semibold mb-4">Acciones Rápidas</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <button
                              onClick={() => window.location.href = '/admin'}
                              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                            >
                              <Settings className="w-6 h-6 mb-2" style={{ color: colors.primary }} />
                              <div className="font-medium">Panel Completo</div>
                              <div className="text-sm text-gray-500">Acceder al dashboard</div>
                            </button>
                            <button 
                              onClick={() => window.location.href = '/admin'}
                              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                            >
                              <ShoppingBag className="w-6 h-6 mb-2" style={{ color: colors.primary }} />
                              <div className="font-medium">Gestionar Productos</div>
                              <div className="text-sm text-gray-500">Agregar, editar, eliminar</div>
                            </button>
                            <button 
                              onClick={() => window.location.href = '/admin'}
                              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                            >
                              <User className="w-6 h-6 mb-2" style={{ color: colors.primary }} />
                              <div className="font-medium">Ver Reportes</div>
                              <div className="text-sm text-gray-500">Análisis y estadísticas</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold">Historial de Pedidos</h3>
                          <button
                            onClick={() => setShowOrderManagement(true)}
                            className="px-4 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: colors.primary }}
                          >
                            Ver Todos los Pedidos
                          </button>
                        </div>
                        <div className="text-center py-12">
                          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500">Gestiona tus pedidos</p>
                          <p className="text-gray-400 text-sm">Haz clic en "Ver Todos los Pedidos" para acceder a tu historial completo</p>
                        </div>
                      </div>
                    )}
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
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="rounded" 
                              onChange={(e) => console.log('Notificaciones productos:', e.target.checked)}
                            />
                            <span>Recibir notificaciones de nuevos productos</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="rounded" 
                              onChange={(e) => console.log('Ofertas email:', e.target.checked)}
                            />
                            <span>Recibir ofertas especiales por email</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Privacidad</h4>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              onChange={(e) => console.log('Perfil público:', e.target.checked)}
                            />
                            <span>Hacer mi perfil público</span>
                          </label>
                          <label className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="rounded" 
                              onChange={(e) => console.log('Recomendaciones:', e.target.checked)}
                            />
                            <span>Permitir recomendaciones personalizadas</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <OrderManagement 
              isOpen={showOrderManagement} 
              onClose={() => setShowOrderManagement(false)} 
            />
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;