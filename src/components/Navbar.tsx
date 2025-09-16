import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Crown, ShoppingCart, Heart, LogIn, Plus, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import Favorites from './Favorites';
import FavoritesDropdown from './FavoritesDropdown';
import UserProfile from './UserProfile';
import NotificationSystem from './NotificationSystem';
import { AuthModal } from './auth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();
  const { getCartItemsCount } = useStore();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Productos', href: '#products' },
    { name: 'Contacto', href: '#contact' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Crown 
              className="w-8 h-8" 
              style={{ color: colors.primary }}
            />
            <span 
              className="text-xl font-bold"
              style={{ color: scrolled ? colors.secondary : 'white' }}
            >
              Cleopatra
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isHomePage && navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                className={`font-medium transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-gray-200'
                }`}
              >
                {item.name}
              </motion.a>
            ))}
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2"
                >
                  <Bell className={`w-5 h-5 ${
                    scrolled ? 'text-gray-700' : 'text-white'
                  }`} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    3
                  </span>
                </motion.button>
              )}
              
              {!isAdmin && (
                <>
                  <FavoritesDropdown />
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/cart')}
                    className="relative p-2"
                  >
                    <ShoppingCart className={`w-5 h-5 ${
                      scrolled ? 'text-gray-700' : 'text-white'
                    }`} />
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {getCartItemsCount()}
                      </span>
                    )}
                  </motion.button>
                </>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full border-2 transition-all"
                    style={{ 
                      backgroundColor: scrolled ? colors.primary : 'rgba(255,255,255,0.1)',
                      borderColor: scrolled ? colors.primary : 'rgba(255,255,255,0.3)'
                    }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {user?.name.split(' ')[0]}
                    </span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-3 py-2 text-sm font-medium transition-colors"
                    style={{ color: scrolled ? colors.secondary : 'white' }}
                  >
                    Iniciar Sesión
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Registrarse</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowProfile(true)}
                className="p-1"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name.charAt(0)}
                </div>
              </motion.button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={scrolled ? 'text-gray-700' : 'text-white'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-4"
          >
            {isHomePage && navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </a>
            ))}
            
            <div className="border-t mt-2 pt-2">
              {!isAdmin && (
                <>
                  <div className="px-4 py-2">
                    <FavoritesDropdown />
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/cart');
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Carrito ({getCartItemsCount()})</span>
                  </button>
                </>
              )}
              
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setShowNotifications(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notificaciones (3)</span>
                </button>
              )}
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setShowProfile(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {user?.name.charAt(0)}
                    </div>
                    <span>Mi Perfil</span>
                  </button>

                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-blue-600 hover:bg-blue-50"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrarse</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
        
        <Favorites isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
        <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
        <NotificationSystem isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;