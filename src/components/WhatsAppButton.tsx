import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '573024547679'; // Primer número sin espacios ni guiones
  
  const openWhatsApp = () => {
    const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre los productos de Cleopatra Regalos 👑');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <motion.button
      onClick={openWhatsApp}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
    </motion.button>
  );
};

export default WhatsAppButton;