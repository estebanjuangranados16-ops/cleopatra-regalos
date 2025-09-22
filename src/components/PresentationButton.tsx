import React from 'react';
import { motion } from 'framer-motion';
import { Presentation, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const PresentationButton: React.FC = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-20 left-4 z-40"
    >
      <Link
        to="/presentation"
        className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center space-x-2 hover:scale-110"
      >
        <Presentation className="w-6 h-6" />
        <span className="hidden group-hover:block whitespace-nowrap bg-black/80 text-white px-3 py-1 rounded-lg text-sm absolute left-full ml-2">
          Ver Presentación de Ventas
        </span>
      </Link>
    </motion.div>
  );
};

export default PresentationButton;