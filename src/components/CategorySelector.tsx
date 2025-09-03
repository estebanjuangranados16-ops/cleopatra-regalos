import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Smartphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';

interface CategorySelectorProps {
  onSelect: (category: Theme) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect }) => {
  const { setTheme } = useTheme();

  const handleSelect = (category: Theme) => {
    setTheme(category);
    onSelect(category);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      <div className="text-center px-6">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          Cleopatra
        </motion.h1>
        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12"
        >
          ¿Qué estás buscando hoy?
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('gifts')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-white shadow-2xl"
          >
            <div className="relative z-10">
              <Gift className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Regalos</h3>
              <p className="text-yellow-100">Elegancia y sofisticación para ocasiones especiales</p>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('tech')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-2xl"
          >
            <div className="relative z-10">
              <Smartphone className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Tecnología</h3>
              <p className="text-blue-100">Innovación y vanguardia tecnológica</p>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySelector;