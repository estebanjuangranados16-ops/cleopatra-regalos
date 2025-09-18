import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Gift } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme, colors } = useTheme();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: `0 8px 25px ${colors.primary}40`
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'tech' ? 'gifts' : 'tech')}
      className="fixed bottom-20 right-6 z-30 flex items-center space-x-2 px-4 py-3 rounded-full shadow-lg font-medium text-white transition-all duration-300"
      style={{ 
        backgroundColor: colors.primary,
        boxShadow: `0 4px 15px ${colors.primary}30`
      }}
    >
      {theme === 'tech' ? (
        <>
          <Gift className="w-5 h-5" />
          <span className="text-sm">Regalos</span>
        </>
      ) : (
        <>
          <Smartphone className="w-5 h-5" />
          <span className="text-sm">Tech</span>
        </>
      )}
    </motion.button>
  );
};

export default ThemeToggleButton;