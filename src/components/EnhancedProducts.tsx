import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Eye, 
  Star, 
  Filter, 
  Grid, 
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
  Share2,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { products as fallbackProducts } from '../utils/constants';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price-low' | 'price-high' | 'newest';

const EnhancedProducts: React.FC = () => {
  const { colors, theme } = useTheme();
  const { isAdmin } = useAuth();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'regalos' | 'tecnologia'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [cardImageIndexes, setCardImageIndexes] = useState<{[key: string]: number}>({});

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { productService } = await import('../services/productService');
      const data = await productService.getProducts();
      setProducts(data.length > 0 ? data : fallbackProducts);
    } catch (error) {
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredAndSortedProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (typeof a.price === 'number' ? a.price : parseFloat(a.price.toString())) - 
                 (typeof b.price === 'number' ? b.price : parseFloat(b.price.toString()));
        case 'price-high':
          return (typeof b.price === 'number' ? b.price : parseFloat(b.price.toString())) - 
                 (typeof a.price === 'number' ? a.price : parseFloat(a.price.toString()));
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price.toString());
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numPrice);
  };

  const handleAddToCart = (product: Product, qty = 1) => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const nextCardImage = (productId: string, totalImages: number) => {
    setCardImageIndexes(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevCardImage = (productId: string, totalImages: number) => {
    setCardImageIndexes(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setQuantity(1);
  };

  const nextModalImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevModalImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images!.length - 1 : prev - 1
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedProduct) return;
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextModalImage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevModalImage();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedProduct, currentImageIndex]);



  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.secondary }}
          >
            {theme === 'gifts' ? '🎁 Regalos Exclusivos' : '📱 Tecnología Avanzada'}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Descubre nuestra colección premium de {theme === 'gifts' ? 'regalos únicos' : 'tecnología innovadora'}
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <div className="flex bg-white rounded-full p-1 shadow-md">
              {[
                { id: 'all', label: 'Todos', icon: '🔥' },
                { id: 'regalos', label: 'Regalos', icon: '🎁' },
                { id: 'tecnologia', label: 'Tech', icon: '📱' }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as 'all' | 'regalos' | 'tecnologia')}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? colors.primary : 'transparent'
                  }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>

            {/* Product Count */}
            <div className="text-sm text-gray-500">
              {filteredAndSortedProducts.length} productos
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="name">Nombre A-Z</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="newest">Más Recientes</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-white rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAndSortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden group ${
                viewMode === 'list' ? 'w-48 flex-shrink-0' : ''
              }`}>
                <motion.img
                  src={product.images?.[cardImageIndexes[String(product.id)] || 0] || '/placeholder-image.jpg'}
                  alt={product.name}
                  className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
                
                {/* Navigation Arrows for Multiple Images */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevCardImage(String(product.id), product.images!.length);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextCardImage(String(product.id), product.images!.length);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openProductModal(product)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleFavorite(product)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                        isFavorite(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {index === 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      HOT
                    </span>
                  )}
                  {product.images && product.images.length > 1 && (
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                      {(cardImageIndexes[String(product.id)] || 0) + 1}/{product.images.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold line-clamp-2" style={{ color: colors.secondary }}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {formatPrice(product.price)}
                    </span>
                    <div className="text-sm text-gray-500">Envío gratis</div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    className="px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Agregar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.secondary }}>
              No se encontraron productos
            </h3>
            <p className="text-gray-600">Intenta cambiar los filtros o la categoría</p>
          </motion.div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
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
                  <X className="w-5 h-5" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Images */}
                  <div>
                    <div className="relative mb-4">
                      <img
                        src={selectedProduct.images?.[currentImageIndex] || '/placeholder-image.jpg'}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                      
                      {/* Image Counter */}
                      {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                          {currentImageIndex + 1} / {selectedProduct.images.length}
                        </div>
                      )}
                      
                      {selectedProduct.images && selectedProduct.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevModalImage();
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextModalImage();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                            className={`w-full h-20 rounded overflow-hidden transition-all ${
                              index === currentImageIndex
                                ? 'ring-2 opacity-100'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{
                              borderColor: index === currentImageIndex ? colors.primary : 'transparent',
                              borderWidth: index === currentImageIndex ? '2px' : '0px'
                            }}
                          >
                            <img
                              src={image}
                              alt={`${selectedProduct.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                        {selectedProduct.name}
                      </h2>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(4.8) • 124 reseñas</span>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {selectedProduct.description}
                    </p>
                    
                    <div className="mb-8">
                      <span className="text-4xl font-bold" style={{ color: colors.primary }}>
                        {formatPrice(selectedProduct.price)}
                      </span>
                      <div className="text-sm text-green-600 mt-1">✓ Envío gratis • ✓ Garantía incluida</div>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-medium">Cantidad:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          handleAddToCart(selectedProduct, quantity);
                          setSelectedProduct(null);
                        }}
                        className="w-full py-4 text-white font-semibold text-lg rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colors.primary }}
                      >
                        Agregar al Carrito ({quantity})
                      </button>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleToggleFavorite(selectedProduct)}
                          className={`flex-1 py-3 border-2 font-semibold rounded-lg transition-colors ${
                            isFavorite(selectedProduct.id)
                              ? 'border-red-500 text-red-500 bg-red-50'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Heart className={`w-5 h-5 inline mr-2 ${isFavorite(selectedProduct.id) ? 'fill-current' : ''}`} />
                          {isFavorite(selectedProduct.id) ? 'En Favoritos' : 'Agregar a Favoritos'}
                        </button>
                        
                        <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                          Comprar Ahora
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EnhancedProducts;