import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Eye, Heart, Search, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import { Product } from '../types';

interface ProductsPageProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsChange: () => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ isOpen, onClose, products }) => {
  const { colors } = useTheme();
  const { addToCart, addToFavorites, isFavorite } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tecnologia' | 'regalos'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-[9998] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
                >
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-200" />
                </button>
                <h1 className="text-4xl font-bold" style={{ color: colors.secondary }}>
                  Catálogo Completo
                </h1>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-all duration-200"
                  style={{ '--tw-ring-color': colors.primary } as any}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'tecnologia' | 'regalos')}
                className="px-6 py-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-all duration-200 min-w-[200px]"
                style={{ '--tw-ring-color': colors.primary } as any}
              >
                <option value="all">Todas las categorías</option>
                <option value="tecnologia">Tecnología</option>
                <option value="regalos">Regalos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        +{product.images.length - 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToFavorites(product)}
                        className={`w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 ${
                          isFavorite(product.id) ? 'text-red-500' : 'text-gray-800'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2" style={{ color: colors.secondary }}>
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold" style={{ color: colors.primary }}>
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1.5 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colors.accent }}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: colors.primaryLight }}>
                <ShoppingCart className="w-12 h-12" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
                No se encontraron productos
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          )}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
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
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div className="space-y-4">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    {selectedProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.images.slice(1).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedProduct.name} ${index + 2}`}
                            className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold mb-4" style={{ color: colors.secondary }}>
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: colors.primary }}>
                        {formatPrice(selectedProduct.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full py-4 rounded-lg text-white font-semibold text-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductsPage;