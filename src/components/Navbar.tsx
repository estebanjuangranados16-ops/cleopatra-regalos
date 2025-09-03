import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Crown, ShoppingCart, Heart, LogIn, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';
import Cart from './Cart';
import Favorites from './Favorites';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import AdminPanel from './AdminPanel';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { colors } = useTheme();
  const { getCartItemsCount, favorites } = useStore();
  const { user, isAuthenticated, isAdmin } = useAuth();

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
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
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
            {navItems.map((item) => (
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFavorites(true)}
                className="relative p-2"
              >
                <Heart className={`w-5 h-5 ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {favorites.length}
                  </span>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCart(true)}
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
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAdmin(true)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full font-medium text-sm"
                      style={{ backgroundColor: colors.primary, color: 'white' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Producto</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full"
                    style={{ backgroundColor: scrolled ? colors.primary : 'rgba(255,255,255,0.2)' }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {user?.name.charAt(0)}
                    </div>
                    <span className={`text-sm font-medium ${
                      scrolled ? 'text-white' : 'text-white'
                    }`}>
                      {user?.name.split(' ')[0]}
                    </span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuth(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
        
        <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
        <Favorites isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
        <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} onProductsChange={() => window.location.reload()} />
      </div>
    </motion.nav>
  );
};

export default Navbar;