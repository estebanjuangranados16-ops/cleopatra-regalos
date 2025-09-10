import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';

interface FavoritesProps {
  isOpen: boolean;
  onClose: () => void;
}

const Favorites: React.FC<FavoritesProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { favorites, removeFromFavorites, addToCart } = useStore();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    removeFromFavorites(product.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[10000] modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl z-[10001] flex flex-col modal-content"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                  Favoritos
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No tienes productos favoritos</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Agrega productos a favoritos para verlos aquí
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          <p className="font-bold" style={{ color: colors.primary }}>
                            {item.price}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium flex items-center justify-center space-x-1"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Agregar</span>
                        </motion.button>
                        <button
                          onClick={() => removeFromFavorites(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="border-t p-6">
                <p className="text-center text-gray-600 text-sm">
                  {favorites.length} producto{favorites.length !== 1 ? 's' : ''} en favoritos
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Favorites;