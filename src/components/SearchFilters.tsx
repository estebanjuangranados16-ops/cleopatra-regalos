import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';

const SearchFilters: React.FC = () => {
  const { colors } = useTheme();
  const { 
    searchTerm, 
    selectedCategory, 
    priceRange, 
    setSearchTerm, 
    setSelectedCategory, 
    setPriceRange 
  } = useStore();

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'gifts', label: 'Regalos' },
    { id: 'tech', label: 'Tecnología' }
  ];

  const priceRanges = [
    { label: 'Todos los precios', min: 0, max: 3000000 },
    { label: 'Menos de $500.000', min: 0, max: 500000 },
    { label: '$500.000 - $1.000.000', min: 500000, max: 1000000 },
    { label: '$1.000.000 - $2.000.000', min: 1000000, max: 2000000 },
    { label: 'Más de $2.000.000', min: 2000000, max: 3000000 }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 3000000]);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 3000000;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5" style={{ color: colors.primary }} />
          <h3 className="text-lg font-semibold" style={{ color: colors.secondary }}>
            Filtros de Búsqueda
          </h3>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
          >
            <X className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </motion.button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.secondary }}>
            Buscar productos
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.secondary }}>
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.secondary }}>
            Rango de precio
          </label>
          <select
            value={`${priceRange[0]}-${priceRange[1]}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              setPriceRange([min, max]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priceRanges.map((range) => (
              <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Búsqueda: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              {categories.find(c => c.id === selectedCategory)?.label}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-2 hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchFilters;