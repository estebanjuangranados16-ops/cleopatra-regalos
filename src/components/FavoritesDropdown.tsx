import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MessageCircle, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFavoritesStore } from '../store/favoritesStore';

const FavoritesDropdown: React.FC = () => {
  const { colors } = useTheme();
  const { items, removeItem, clearFavorites } = useFavoritesStore();
  const [isOpen, setIsOpen] = useState(false);

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';
    
    let message = '¡Hola! Me interesan estos productos de mi lista de favoritos:\n\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Precio: ${typeof item.price === 'string' ? item.price : `$${item.price.toLocaleString()}`}\n`;
      message += `   Categoría: ${item.category === 'tech' ? 'Tecnología' : 'Regalos'}\n\n`;
    });
    
    message += 'Me gustaría recibir más información sobre estos productos. ¡Gracias!';
    
    return encodeURIComponent(message);
  };

  const handleConsult = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/573024547679?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full text-white shadow-lg"
        style={{ backgroundColor: colors.primary }}
      >
        <Heart className="w-6 h-6" fill={items.length > 0 ? "currentColor" : "none"} />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border z-50"
            style={{ borderColor: colors.primary }}
          >
            <div className="p-4 border-b" style={{ borderColor: colors.primary }}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg" style={{ color: colors.secondary }}>
                  Mis Favoritos
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="max-h-60 sm:max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No tienes favoritos aún</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate" style={{ color: colors.secondary }}>
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category === 'tech' ? 'Tecnología' : 'Regalos'}
                          </p>
                          <p className="font-semibold text-sm" style={{ color: colors.primary }}>
                            {typeof item.price === 'string' ? item.price : `$${item.price.toLocaleString()}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const message = `Hola! Me interesa este producto:\n\n• ${item.name}\n• Precio: ${typeof item.price === 'string' ? item.price : `$${item.price.toLocaleString()}`}\n\n¿Podrías darme más información?`;
                            const whatsappUrl = `https://wa.me/573024547679?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                            setIsOpen(false);
                          }}
                          className="flex-1 py-2 px-3 text-xs font-medium text-white rounded-lg"
                          style={{ backgroundColor: colors.primary }}
                        >
                          Consultar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConsult}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold text-sm"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Consultar por WhatsApp</span>
                    <span className="sm:hidden">Consultar Todos</span>
                  </motion.button>
                  <button
                    onClick={clearFavorites}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {items.length} producto{items.length !== 1 ? 's' : ''} en favoritos
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesDropdown;