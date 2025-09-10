import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Star, DollarSign, Tag, Calendar } from 'lucide-react';

interface FilterOptions {
  category: 'all' | 'regalos' | 'tecnologia';
  priceRange: [number, number];
  rating: number;
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
  inStock: boolean;
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      category: 'all',
      priceRange: [0, 5000000],
      rating: 0,
      sortBy: 'name',
      inStock: false
    };
    setLocalFilters(defaultFilters);
    onReset();
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="w-6 h-6" />
                  Filtros Avanzados
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Categoría
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'Todas las categorías', icon: '🔥' },
                    { id: 'regalos', label: 'Regalos', icon: '🎁' },
                    { id: 'tecnologia', label: 'Tecnología', icon: '📱' }
                  ].map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={localFilters.category === category.id}
                        onChange={(e) => setLocalFilters(prev => ({ 
                          ...prev, 
                          category: e.target.value as any 
                        }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Rango de Precio
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio mínimo: {formatPrice(localFilters.priceRange[0])}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="50000"
                      value={localFilters.priceRange[0]}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                      }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio máximo: {formatPrice(localFilters.priceRange[1])}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="50000"
                      value={localFilters.priceRange[1]}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                      }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Calificación Mínima
                </h3>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={localFilters.rating === rating}
                        onChange={(e) => setLocalFilters(prev => ({ 
                          ...prev, 
                          rating: parseInt(e.target.value) 
                        }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex items-center gap-1">
                        {rating === 0 ? (
                          <span className="text-gray-600">Cualquier calificación</span>
                        ) : (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">y más</span>
                          </>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Ordenar por
                </h3>
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => setLocalFilters(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as any 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Nombre A-Z</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Calificados</option>
                  <option value="newest">Más Recientes</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div className="mb-8">
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock}
                    onChange={(e) => setLocalFilters(prev => ({ 
                      ...prev, 
                      inStock: e.target.checked 
                    }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-medium">Solo productos en stock</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdvancedFilters;