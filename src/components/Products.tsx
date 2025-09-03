import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Settings, Eye, Heart, Search, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { products as fallbackProducts } from '../utils/constants';
import ProductsPage from './ProductsPage';
import AdminPanel from './AdminPanel';

const Products: React.FC = () => {
  const { colors } = useTheme();
  const { isAdmin } = useAuth();
  const { addToCart } = useStore();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(false);
  const [showProductsPage, setShowProductsPage] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tecnologia' | 'regalos'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { productService } = await import('../services/productService');
      
      // Verificar conexión primero
      const isConnected = await productService.testConnection();
      if (!isConnected) {
        console.log('Firebase not available, using fallback products');
        setProducts(fallbackProducts);
        setLoading(false);
        return;
      }
      
      const data = await productService.getProducts();
      
      if (data.length === 0) {
        console.log('No products found, adding initial products...');
        try {
          // Agregar productos uno por uno con manejo de errores
          for (const product of fallbackProducts) {
            try {
              await productService.addProduct(product);
              console.log(`Added product: ${product.name}`);
            } catch (error) {
              console.error(`Failed to add product ${product.name}:`, error);
            }
          }
          
          // Recargar después de agregar
          const newData = await productService.getProducts();
          setProducts(newData.length > 0 ? newData : fallbackProducts);
        } catch (error) {
          console.error('Error adding initial products:', error);
          setProducts(fallbackProducts);
        }
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products, using fallback:', error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from Firebase, but use fallback if it fails
    loadProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  const displayProducts = filteredProducts.slice(0, 6);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
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
    <section id="products" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 tracking-tight" style={{ color: colors.secondary }}>
            Descubre Nuestros Tecnología
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Explora nuestra colección cuidadosamente seleccionada de productos premium
          </p>
          
          {/* Category Navigation */}
          <div className="bg-gray-100 rounded-full p-2 inline-flex mb-8">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === 'all' 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={selectedCategory === 'all' ? { backgroundColor: colors.primary } : {}}
            >
              Todos
            </button>
            <button 
              onClick={() => setSelectedCategory('tecnologia')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === 'tecnologia' 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={selectedCategory === 'tecnologia' ? { backgroundColor: colors.primary } : {}}
            >
              Tecnología
            </button>
            <button 
              onClick={() => setSelectedCategory('regalos')}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === 'regalos' 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              style={selectedCategory === 'regalos' ? { backgroundColor: colors.primary } : {}}
            >
              Regalos
            </button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-80"
              />
            </div>
            <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none">
              <option>Ordenar por</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
              <option>Popularidad</option>
            </select>
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowAdmin(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              <Settings className="w-4 h-4" />
              Gestionar
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {displayProducts.map((product, index) => (
            <div key={product.id} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-72 object-cover"
                />
                {/* Badge */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">MÁS</span>
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                  <span className="text-white text-2xl font-bold mb-4">
                    {formatPrice(product.price)}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.secondary }}>
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-400">
                    Desde {formatPrice(product.price)}
                  </span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ver Más Button */}
        <div className="text-center">
          <button
            onClick={() => setShowProductsPage(true)}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            Ver todos ({filteredProducts.length})
          </button>
        </div>

        {/* Admin Button */}
        {isAdmin && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAdmin(true)}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg"
            >
              Gestionar Productos
            </button>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => {
            setSelectedProduct(null);
            setCurrentImageIndex(0);
          }}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setCurrentImageIndex(0);
                  }}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  <div>
                    <div className="relative">
                      <img
                        src={selectedProduct.images[currentImageIndex]}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover rounded-lg mb-4"
                      />
                      {selectedProduct.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex(prev => 
                              prev === 0 ? selectedProduct.images.length - 1 : prev - 1
                            )}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex(prev => 
                              prev === selectedProduct.images.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                          >
                            ›
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {selectedProduct.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {selectedProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-full h-20 object-cover rounded cursor-pointer transition-all ${
                              index === currentImageIndex 
                                ? 'ring-2 ring-blue-500 opacity-100' 
                                : 'opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
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
                        {formatPrice(selectedProduct.price)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                          setCurrentImageIndex(0);
                        }}
                        className="w-full py-4 text-white font-semibold text-lg rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colors.primary }}
                      >
                        Agregar al Carrito
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          setCurrentImageIndex(0);
                        }}
                        className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Seguir Comprando
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <ProductsPage 
          isOpen={showProductsPage} 
          onClose={() => setShowProductsPage(false)}
          products={filteredProducts}
          onProductsChange={loadProducts}
        />
        <AdminPanel 
          isOpen={showAdmin} 
          onClose={() => setShowAdmin(false)}
          onProductsChange={loadProducts}
        />
      </div>
    </section>
  );
};

export default Products;