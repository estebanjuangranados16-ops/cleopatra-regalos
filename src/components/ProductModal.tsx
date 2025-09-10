import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';

const ProductModal: React.FC = () => {
  const { colors } = useTheme();
  const { selectedProduct, setSelectedProduct, addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore();

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    setSelectedProduct(null);
  };

  const handleToggleFavorite = () => {
    if (isFavorite(selectedProduct.id)) {
      removeFromFavorites(selectedProduct.id);
    } else {
      addToFavorites(selectedProduct);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
        onClick={() => setSelectedProduct(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.secondary }}>
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(4.8)</span>
                </div>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorite(selectedProduct.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite(selectedProduct.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {selectedProduct.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris.
            </p>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold" style={{ color: colors.primary }}>
                  ${selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-gray-500 line-through ml-2">
                  ${(parseFloat(selectedProduct.price.replace(/[$.,]/g, '')) * 1.2).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                En stock
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-4 rounded-lg text-white font-semibold flex items-center justify-center space-x-2"
                style={{ backgroundColor: colors.primary }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Agregar al Carrito</span>
              </motion.button>
              
              <button className="w-full py-3 border-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                Comprar Ahora
              </button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Categoría:</span>
                  <span className="ml-2 font-medium capitalize">{selectedProduct.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Envío:</span>
                  <span className="ml-2 font-medium text-green-600">Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;