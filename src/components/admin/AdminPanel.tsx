import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Search, 
  Filter,
  Save,
  Upload,
  Eye,
  Settings
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

import ProductForm from './ProductForm';
import ProductList from './ProductList';
import ProductStats from './ProductStats';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'dashboard' | 'products' | 'add' | 'edit';

interface Product {
  id: string;
  name: string;
  price: string;
  category: 'gifts' | 'tech';
  image: string;
  images?: string[];
  description: string;
  createdAt?: string;
}



const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'gifts' | 'tech'>('all');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { productService } = await import('../../services/productService');
      const data = await productService.getProducts();
      setProducts(data.map(p => ({
        id: p.id.toString(),
        name: p.name,
        price: typeof p.price === 'string' ? p.price : String(p.price),
        category: p.category === 'regalos' ? 'gifts' : p.category === 'tecnologia' ? 'tech' : 'gifts',
        image: p.image,
        images: p.images,
        description: p.description,
        createdAt: p.createdAt
      })) as any);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const handleProductSaved = () => {
    loadProducts();
    setActiveTab('products');
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('edit');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
      const { productService } = await import('../../services/productService');
      await productService.deleteProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Settings },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'add', label: 'Agregar', icon: Plus }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex overflow-hidden shadow-2xl"
      >
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Gestión de productos</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white/10 text-white border-l-4 border-yellow-400' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.id === 'products' && (
                    <span className="ml-auto bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded-full">
                      {products.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold mb-2">Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total productos:</span>
                <span className="text-white">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tecnología:</span>
                <span className="text-white">{products.filter(p => p.category === 'tech').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Regalos:</span>
                <span className="text-white">{products.filter(p => p.category === 'gifts').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'products' && 'Gestión de Productos'}
                  {activeTab === 'add' && 'Agregar Producto'}
                  {activeTab === 'edit' && 'Editar Producto'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'dashboard' && 'Resumen general del sistema'}
                  {activeTab === 'products' && 'Administra tu catálogo de productos'}
                  {activeTab === 'add' && 'Crear un nuevo producto'}
                  {activeTab === 'edit' && 'Modificar producto existente'}
                </p>
              </div>
              
              {activeTab === 'products' && (
                <button
                  onClick={() => setActiveTab('add')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Producto
                </button>
              )}
            </div>

            {/* Search and Filters for Products Tab */}
            {activeTab === 'products' && (
              <div className="flex items-center gap-4 mt-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'gifts' | 'tech')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="tech">Tecnología</option>
                  <option value="gifts">Regalos</option>
                </select>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProductStats products={products} />
                </motion.div>
              )}

              {activeTab === 'products' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProductList
                    products={filteredProducts}
                    loading={loading}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                </motion.div>
              )}

              {(activeTab === 'add' || activeTab === 'edit') && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProductForm
                    product={selectedProduct}
                    onSave={handleProductSaved}
                    onCancel={() => {
                      setActiveTab('products');
                      setSelectedProduct(null);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;