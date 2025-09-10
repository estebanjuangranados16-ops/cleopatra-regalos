import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Product } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  products: Product[];
  onFilteredProducts: (products: Product[]) => void;
  onSearchChange?: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ products, onFilteredProducts, onSearchChange }) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'name'
  });
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    filterProducts();
  }, [debouncedSearchTerm, filters, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Búsqueda por texto
    if (debouncedSearchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filtro por rango de precio
    if (filters.priceRange !== 'all') {
      const ranges = {
        'low': [0, 50000],
        'medium': [50000, 200000],
        'high': [200000, Infinity]
      };
      const [min, max] = ranges[filters.priceRange as keyof typeof ranges];
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace(/[$.,]/g, ''));
        return price >= min && price < max;
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace(/[$.,]/g, '')) - parseFloat(b.price.replace(/[$.,]/g, ''));
        case 'price-high':
          return parseFloat(b.price.replace(/[$.,]/g, '')) - parseFloat(a.price.replace(/[$.,]/g, ''));
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    onFilteredProducts(filtered);
    onSearchChange?.(debouncedSearchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilters({
      category: 'all',
      priceRange: 'all',
      sortBy: 'name'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar productos..."
            className="w-full pl-12 pr-20 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4" style={{ color: colors.primary }} />
                <h3 className="font-semibold">Filtros</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="regalos">Regalos</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Rango de Precio</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los precios</option>
                    <option value="low">Hasta {formatPrice(50000)}</option>
                    <option value="medium">{formatPrice(50000)} - {formatPrice(200000)}</option>
                    <option value="high">Más de {formatPrice(200000)}</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Ordenar por</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Nombre (A-Z)</option>
                    <option value="price-low">Precio (Menor a Mayor)</option>
                    <option value="price-high">Precio (Mayor a Menor)</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {filters.category !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {filters.category === 'tecnologia' ? 'Tecnología' : 'Regalos'}
                    <button
                      onClick={() => handleFilterChange('category', 'all')}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.priceRange !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {filters.priceRange === 'low' && 'Hasta $50,000'}
                    {filters.priceRange === 'medium' && '$50,000 - $200,000'}
                    {filters.priceRange === 'high' && 'Más de $200,000'}
                    <button
                      onClick={() => handleFilterChange('priceRange', 'all')}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filters.category !== 'all' || filters.priceRange !== 'all') && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;