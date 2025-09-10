import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Settings, Eye, Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { products as fallbackProducts } from '../utils/constants';
import AdminPanel from './admin/AdminPanel';

const ProductsComplete: React.FC = () => {
  const { colors } = useTheme();
  const { isAdmin } = useAuth();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite, setSelectedProduct } = useStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedProduct, setSelectedProductLocal] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { productService } = await import('../services/productService');
      const data = await productService.getProducts();
      
      if (data.length === 0) {
        // Si no hay productos en Firebase, usar los de fallback
        setProducts(fallbackProducts);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const displayProducts = products.slice(0, 6);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.secondary }}
          >
            Nuestros Productos
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Descubre nuestra selección cuidadosamente curada de productos premium
          </motion.p>
          
          {isAdmin && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAdmin(true)}
              className="p-3 rounded-full shadow-lg hover:shadow-xl transition-all mb-8"
              style={{ backgroundColor: colors.primary }}
              title="Panel de Administración"
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <div className="relative">
                    <motion.img
                      src={(product.images && product.images[0]) || product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.images && product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        +{product.images.length - 1}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedProductLocal(product)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleFavorite(product)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isFavorite(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.secondary }}>
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {product.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: colors.accent }}
                    >
                      Agregar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16 mb-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primaryLight }}>
                <ShoppingCart className="w-12 h-12" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
                Próximamente nuevos productos
              </h3>
              <p className="text-gray-600 mb-6">
                Estamos preparando una increíble selección de productos para ti. 
                ¡Mantente atento a las novedades!
              </p>
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAdmin(true)}
                  className="px-6 py-3 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  Agregar Productos
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: colors.primary }}
          >
            {products.length > 0 ? `Ver Todos los Productos (${products.length})` : 'Explorar Catálogo'}
          </motion.button>
        </motion.div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedProductLocal(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button
                  onClick={() => setSelectedProductLocal(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  <div>
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <div className="space-y-4">
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                        {selectedProduct.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedProduct.images.slice(1).map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${selectedProduct.name} ${index + 2}`}
                                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  // Intercambiar imagen principal
                                  const newImages = [...selectedProduct.images!];
                                  [newImages[0], newImages[index + 1]] = [newImages[index + 1], newImages[0]];
                                  setSelectedProductLocal({ ...selectedProduct, images: newImages });
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover rounded-lg mb-4"
                      />
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold mb-4" style={{ color: colors.secondary }}>
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {selectedProduct.description}
                    </p>
                    <div className="mb-8">
                      <span className="text-4xl font-bold" style={{ color: colors.primary }}>
                        {selectedProduct.price}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {!isAdmin ? (
                        <>
                          <button
                            onClick={() => {
                              handleAddToCart(selectedProduct);
                              setSelectedProductLocal(null);
                            }}
                            className="w-full py-4 text-white font-semibold text-lg rounded-lg hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: colors.primary }}
                          >
                            Agregar al Carrito
                          </button>
                          <button
                            onClick={() => setSelectedProductLocal(null)}
                            className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Seguir Comprando
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedProductLocal(null)}
                          className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cerrar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        <AdminPanel 
          isOpen={showAdmin} 
          onClose={() => {
            setShowAdmin(false);
            loadProducts(); // Recargar productos después de cerrar admin
          }} 
        />
      </div>
    </section>
  );
};

export default ProductsComplete;