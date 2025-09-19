import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Gift, Search, ShoppingCart, Star, HelpCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import { Theme } from '../types';
import AnimatedParticles from './AnimatedParticles';

interface CategorySelectorProps {
  onSelect: (category: Theme) => void;
}

const CategorySelectorFixed: React.FC<CategorySelectorProps> = ({ onSelect }) => {
  const { setTheme, colors } = useTheme();
  const { cart } = useStore();
  const navigate = useNavigate();

  const handleSelect = (category: Theme) => {
    setTheme(category);
    // Animación de salida más suave
    setTimeout(() => {
      onSelect(category);
    }, 800); // Dar tiempo para que se vea la animación de selección
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-[#001F3F] to-[#1E293B] relative overflow-hidden"
      exit={{ 
        opacity: 0,
        scale: 0.95,
        y: -50,
        transition: { 
          duration: 0.8,
          ease: "easeInOut"
        }
      }}
    >
      {/* Animated Particles Background */}
      <AnimatedParticles />
      
      {/* Background circles with animation */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gray-500 opacity-10 rounded-full blur-xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-gray-500 opacity-15 rounded-full blur-lg"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-gray-500 opacity-8 rounded-full blur-2xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, -15, 0],
            y: [0, 25, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-gray-500 opacity-12 rounded-full blur-xl"
        ></motion.div>
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
        className="bg-white shadow-md relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.3,
                duration: 0.8,
                type: "spring",
                stiffness: 200
              }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <motion.div 
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.accent }}
              >
                <span className="text-white font-bold text-lg">C</span>
              </motion.div>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-black font-semibold text-lg"
              >
                Cleopatra Regalos
              </motion.span>
            </motion.div>

            {/* Menu */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="hidden md:flex items-center space-x-8"
            >
              {[
                { name: 'Inicio', path: '/' },
                { name: 'Productos', path: '/shop' },
                { name: 'Galería', path: '/#gallery' },
                { name: 'Nosotros', path: '/#about' },
                { name: 'Contacto', path: '/#contact' }
              ].map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => handleNavigation(item.path)}
                  className="text-gray-600 transition-colors cursor-pointer font-medium hover:opacity-80"
                  style={{ color: '#6B7280' }}
                >
                  {item.name}
                </motion.button>
              ))}
            </motion.div>

            {/* Icons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex items-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigation('/shop')}
                className="p-1 text-gray-600 hover:opacity-80 transition-opacity"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigation('/login')}
                className="p-1 text-gray-600 hover:opacity-80 transition-opacity"
              >
                <User className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigation('/cart')}
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 hover:opacity-80 transition-opacity" />
                {cart.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, type: "spring", stiffness: 500 }}
                    className="absolute -top-2 -right-2 text-xs rounded-full w-4 h-4 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {cart.length}
                  </motion.span>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4" style={{ zIndex: 10 }}>
        {/* Hero Section */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="text-center mb-12"
        >
          {/* Logo with gradient */}
          <motion.div 
            initial={{ scale: 0, rotate: -360 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3,
              duration: 1.2,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 10, -10, 0],
              transition: { duration: 0.6 }
            }}
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center cursor-pointer"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` 
            }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Star className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.6,
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 font-sans"
          >
            <motion.span
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(251, 191, 36, 0.5)",
                  "0 0 20px rgba(251, 191, 36, 0.8)",
                  "0 0 10px rgba(251, 191, 36, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ¡Hola! Soy Cleopatra
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-gray-300 text-lg mb-6"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Para ofrecerte la mejor experiencia, cuéntame:
            </motion.span>
          </motion.p>

          <motion.h2 
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              delay: 1.1,
              duration: 0.8,
              type: "spring",
              stiffness: 120
            }}
            className="text-2xl md:text-3xl font-medium italic mb-12"
            style={{ color: colors.accent }}
          >
            <motion.span
              animate={{ 
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ¿Qué estás buscando hoy?
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl w-full px-4 sm:px-0">
          {/* Technology Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: 0.1,
              duration: 0.2
            }}
            whileHover={{ 
              scale: 1.005
            }}
            whileTap={{ scale: 0.99 }}
            className="relative rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 cursor-pointer transition-all duration-200 hover:shadow-3xl transform-gpu overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 50%, #F0F9FF 100%)`,
              border: '2px solid rgba(37, 99, 235, 0.1)'
            }}
            onClick={() => handleSelect('tech')}
          >
            {/* Gradient overlay */}
            <motion.div 
              className="absolute inset-0 opacity-0"
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
              style={{ 
                background: `linear-gradient(135deg, #2563EB, #3B82F6)` 
              }}
            />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Logo y icono combinados */}
              <div className="flex items-center justify-center mb-4 space-x-4">
                {/* Logo de marca */}
                <img
                  src="/assets/brand/logos/cleopatra-logo-blue.png"
                  alt="Cleopatra Tech"
                  className="w-16 h-16 object-contain"
                  width="64"
                  height="64"
                />
                
                {/* Icono temático */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.2, type: "spring", stiffness: 200 }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Smartphone className="w-12 h-12" style={{ color: '#2563EB' }} />
                </motion.div>
              </div>
              {/* Contenido central */}
              <div className="flex-1 flex flex-col justify-center text-center">
                <motion.h3 
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: '#1E40AF' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.2 }}
                >
                  Tecnología
                </motion.h3>
                <motion.p 
                  className="text-blue-600 mb-3 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.2 }}
                >
                  Innovación y modernidad
                </motion.p>
                <motion.p 
                  className="text-gray-600 text-sm mb-4 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.2 }}
                >
                  Descubre los últimos gadgets, smartphones, accesorios tech y más
                </motion.p>
                
                {/* List */}
                <motion.ul 
                  className="text-left space-y-2 mb-4 mx-auto max-w-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.2 }}
                >
                  {['Smartphones', 'Smartwatches', 'Auriculares', 'Accesorios Tech'].map((item, index) => (
                    <motion.li 
                      key={item}
                      className="flex items-center text-gray-700 font-medium text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 + index * 0.02, duration: 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#2563EB' }} />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Botón en la parte inferior */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg mt-auto"
                style={{ 
                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)'
                }}
              >
                Explorar Tecnología
              </motion.button>
            </div>
          </motion.div>

          {/* Gifts Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              delay: 0.15,
              duration: 0.2
            }}
            whileHover={{ 
              scale: 1.005
            }}
            whileTap={{ scale: 0.99 }}
            className="relative rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 cursor-pointer transition-all duration-200 hover:shadow-3xl transform-gpu overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 50%, #FEFCE8 100%)`,
              border: '2px solid rgba(245, 158, 11, 0.1)'
            }}
            onClick={() => handleSelect('gifts')}
          >
            {/* Gradient overlay */}
            <motion.div 
              className="absolute inset-0 opacity-0"
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.3 }}
              style={{ 
                background: `linear-gradient(135deg, #F59E0B, #FBBF24)` 
              }}
            />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Logo y icono combinados */}
              <div className="flex items-center justify-center mb-4 space-x-4">
                {/* Logo de marca */}
                <img
                  src="/assets/brand/logos/cleopatra-logo-gold.png"
                  alt="Cleopatra Regalos"
                  className="w-16 h-16 object-contain"
                  width="64"
                  height="64"
                />
                
                {/* Icono temático */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.2, type: "spring", stiffness: 200 }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Gift className="w-12 h-12" style={{ color: '#F59E0B' }} />
                </motion.div>
              </div>
              {/* Contenido central */}
              <div className="flex-1 flex flex-col justify-center text-center">
                <motion.h3 
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ color: '#D97706' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.2 }}
                >
                  Regalos
                </motion.h3>
                <motion.p 
                  className="text-amber-600 mb-3 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.2 }}
                >
                  Momentos especiales
                </motion.p>
                <motion.p 
                  className="text-gray-600 text-sm mb-4 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.2 }}
                >
                  Encuentra el regalo perfecto para esa persona especial
                </motion.p>
                
                {/* List */}
                <motion.ul 
                  className="text-left space-y-2 mb-4 mx-auto max-w-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.2 }}
                >
                  {['Peluches', 'Canastas', 'Desayunos', 'Detalles Únicos'].map((item, index) => (
                    <motion.li 
                      key={item}
                      className="flex items-center text-gray-700 font-medium text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 + index * 0.02, duration: 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#F59E0B' }} />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Botón en la parte inferior */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg mt-auto"
                style={{ 
                  background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)'
                }}
              >
                Explorar Regalos
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Help Icon */}
      <motion.div 
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.8, type: "spring" }}
        whileHover={{ 
          scale: 1.2,
          rotate: 360,
          transition: { duration: 0.6 }
        }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-20"
      >
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <HelpCircle className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CategorySelectorFixed;