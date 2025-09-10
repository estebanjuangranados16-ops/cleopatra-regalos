import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Grid, List, ArrowLeft, Eye, Heart, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { products as fallbackProducts } from '../utils/constants';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ShopPage: React.FC = () => {
  const { colors, theme } = useTheme();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardImageIndexes, setCardImageIndexes] = useState<{[key: string]: number}>({});
  const itemsPerPage = 12;

  // Keyboard navigation for modal
  useEffect(() => {
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

    if (selectedProduct) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedProduct, currentImageIndex]);

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const { productService } = await import('../services/productService');
        const data = await productService.getProducts();
        
        console.log('Products loaded from Firebase:', data);
        if (data.length === 0) {
          // Si no hay productos en Firebase, usar los de fallback
          console.log('Using fallback products:', fallbackProducts);
          setProducts(fallbackProducts);
        } else {
          console.log('Using Firebase products:', data);
          setProducts(data);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        console.log('Using fallback products due to error:', fallbackProducts);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category || 'Sin categoría').filter(Boolean)));
    return ['all', ...cats];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const productCategory = product.category || 'Sin categoría';
      const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const price = typeof product.price === 'number' ? product.price : parseInt(product.price.replace(/[^0-9]/g, ''));
        switch (priceRange) {
          case 'low':
            matchesPrice = price < 50000;
            break;
          case 'medium':
            matchesPrice = price >= 50000 && price < 200000;
            break;
          case 'high':
            matchesPrice = price >= 200000;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low': {
          const priceA = typeof a.price === 'number' ? a.price : parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = typeof b.price === 'number' ? b.price : parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        }
        case 'price-high': {
          const priceA = typeof a.price === 'number' ? a.price : parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = typeof b.price === 'number' ? b.price : parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(price);
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 pb-8" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {theme === 'gifts' ? '🎁 Tienda de Regalos' : '📱 Tienda de Tecnología'}
          </h1>
          <p className="text-white/90 text-lg">
            Explora nuestra colección completa de productos premium
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Debug Info */}
        {!loading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">
              Debug: {products.length} productos cargados, {filteredProducts.length} después de filtros
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Cargando productos...</p>
          </div>
        )}

        {!loading && (
          <>
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los precios</option>
              <option value="low">Menos de $50,000</option>
              <option value="medium">$50,000 - $200,000</option>
              <option value="high">Más de $200,000</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Ordenar por nombre</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Mostrando {paginatedProducts.length} de {filteredProducts.length} productos</span>
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {paginatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={viewMode === 'grid' 
                ? 'bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group'
                : 'bg-white rounded-2xl shadow-lg overflow-hidden flex gap-4 p-4 hover:shadow-xl transition-all group'
              }
            >
              <div className={`${viewMode === 'grid' ? 'relative overflow-hidden group' : 'relative flex-shrink-0'}`}>
                <img
                  src={(product.images && product.images[cardImageIndexes[String(product.id)] || 0]) || product.image}
                  alt={product.name}
                  className={viewMode === 'grid' 
                    ? 'w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500'
                    : 'w-32 h-32 object-cover rounded-lg'
                  }
                  loading="lazy"
                />
                
                {/* Navigation Arrows for Multiple Images */}
                {viewMode === 'grid' && product.images && product.images.length > 1 && (
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
                
                {viewMode === 'grid' && (
                  <>
                    {product.images && product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {(cardImageIndexes[String(product.id)] || 0) + 1}/{product.images.length}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedProduct(product);
                          setCurrentImageIndex(0);
                        }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => isFavorite(product.id) ? removeFromFavorites(product.id) : addToFavorites(product)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isFavorite(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                        title={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: colors.primary }}
                        title="Agregar al carrito"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
              
              <div className={viewMode === 'grid' ? 'p-6' : 'flex-1'}>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.secondary }}>
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {formatPrice(product.price)}
                  </span>
                  
                  {viewMode === 'list' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setCurrentImageIndex(0);
                        }}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => isFavorite(product.id) ? removeFromFavorites(product.id) : addToFavorites(product)}
                        className={`p-2 rounded-lg transition-colors ${
                          isFavorite(product.id) ? 'bg-red-500 text-white' : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                        title={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
                        style={{ backgroundColor: colors.accent }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page 
                      ? 'text-white' 
                      : 'bg-white border border-gray-300'
                  }`}
                  style={currentPage === page ? { backgroundColor: colors.primary } : {}}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* No results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
        {/* Product Detail Modal */}
        <AnimatePresence>
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
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Images */}
                    <div>
                      {selectedProduct.images && selectedProduct.images.length > 0 ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={selectedProduct.images[currentImageIndex]}
                              alt={selectedProduct.name}
                              className="w-full h-96 object-cover rounded-lg"
                            />
                            
                            {/* Image Counter */}
                            {selectedProduct.images.length > 1 && (
                              <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                                {currentImageIndex + 1} / {selectedProduct.images.length}
                              </div>
                            )}
                            
                            {/* Navigation Arrows */}
                            {selectedProduct.images.length > 1 && (
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
                          
                          {selectedProduct.images.length > 1 && (
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
                      ) : (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div>
                      <h2 className="text-3xl font-bold mb-4" style={{ color: colors.secondary }}>
                        {selectedProduct.name}
                      </h2>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-gray-600 ml-2">(4.0) • 23 reseñas</span>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {selectedProduct.description}
                      </p>
                      
                      {/* Category */}
                      {selectedProduct.category && (
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {selectedProduct.category}
                          </span>
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="mb-8">
                        <span className="text-4xl font-bold" style={{ color: colors.primary }}>
                          {formatPrice(selectedProduct.price)}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              addToCart(selectedProduct);
                              setSelectedProduct(null);
                            }}
                            className="flex-1 py-4 text-white font-semibold text-lg rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Agregar al Carrito
                          </button>
                          <button
                            onClick={() => isFavorite(selectedProduct.id) ? removeFromFavorites(selectedProduct.id) : addToFavorites(selectedProduct)}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              isFavorite(selectedProduct.id) 
                                ? 'bg-red-500 border-red-500 text-white' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Heart className={`w-6 h-6 ${isFavorite(selectedProduct.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Seguir Comprando
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;