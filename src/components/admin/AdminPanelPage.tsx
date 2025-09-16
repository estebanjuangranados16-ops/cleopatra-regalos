import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Package, 
  Search, 
  Settings,
  BarChart3,
  Users,
  ShoppingBag,
  ArrowLeft,
  Home,
  LogOut,
  Video
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import ProductForm from './ProductForm';
import ProductList from './ProductList';
import ProductStats from './ProductStats';
import VideoManager from './VideoManager';

type AdminTab = 'dashboard' | 'products' | 'add' | 'edit' | 'videos';

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



const AdminPanelPage: React.FC = () => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'gifts' | 'tech'>('all');
  const [showVideoManager, setShowVideoManager] = useState(false);

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
    loadProducts();
  }, []);

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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Resumen y estadísticas' },
    { id: 'products', label: 'Productos', icon: Package, description: 'Gestionar catálogo', count: products.length },
    { id: 'videos', label: 'Videos', icon: Video, description: 'Gestionar galería' },
    { id: 'add', label: 'Agregar', icon: Plus, description: 'Nuevo producto' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-lg lg:min-h-screen">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                  <Settings className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-base lg:text-lg font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs lg:text-sm text-gray-500">Cleopatra Regalos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 lg:gap-2">
                <button
                  onClick={() => navigate('/')}
                  className="p-1.5 lg:p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Volver al inicio"
                >
                  <Home className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-1.5 lg:p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>
            
            {user && (
              <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 text-xs lg:text-sm text-gray-600">
                <span>Bienvenido, <strong>{user.name}</strong></span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs w-fit">
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
            )}
          </div>

          <nav className="p-2 lg:p-4 space-y-1 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
            <div className="flex lg:flex-col gap-2 lg:gap-0 lg:space-y-1 min-w-max lg:min-w-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full lg:w-auto flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={activeTab === tab.id ? { backgroundColor: colors.primary } : {}}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm lg:text-base">{tab.label}</div>
                    <div className={`text-xs hidden lg:block ${activeTab === tab.id ? 'text-white/80' : 'text-gray-400'}`}>
                      {tab.description}
                    </div>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
            </div>
          </nav>

          <div className="p-2 lg:p-4 mt-4 lg:mt-8 hidden lg:block">
            <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
              <h3 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">Estadísticas Rápidas</h3>
              <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total productos:</span>
                  <span className="font-semibold text-gray-900">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tecnología:</span>
                  <span className="font-semibold text-blue-600">{products.filter(p => p.category === 'tech').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Regalos:</span>
                  <span className="font-semibold text-yellow-600">{products.filter(p => p.category === 'gifts').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0 mb-3 lg:mb-4">
              <div className="flex items-center gap-2 lg:gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
                >
                  <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden sm:inline">Volver al Sitio</span>
                  <span className="sm:hidden">Volver</span>
                </button>
                
                <div className="border-l border-gray-300 pl-2 lg:pl-4">
                  <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
                    {activeTab === 'dashboard' && 'Dashboard'}
                    {activeTab === 'products' && 'Productos'}
                    {activeTab === 'videos' && 'Videos'}
                    {activeTab === 'add' && 'Agregar'}
                    {activeTab === 'edit' && 'Editar'}
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm lg:text-base hidden lg:block">
                    {activeTab === 'dashboard' && 'Resumen general del sistema'}
                    {activeTab === 'products' && 'Administra tu catálogo de productos'}
                    {activeTab === 'videos' && 'Gestiona la galería de videos'}
                    {activeTab === 'add' && 'Crear un nuevo producto'}
                    {activeTab === 'edit' && 'Modificar producto existente'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {activeTab === 'products' && (
                  <button
                    onClick={() => setActiveTab('add')}
                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-sm lg:text-base"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Nuevo Producto</span>
                    <span className="sm:hidden">Nuevo</span>
                  </button>
                )}
                {activeTab === 'videos' && (
                  <button
                    onClick={() => setShowVideoManager(true)}
                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-sm lg:text-base"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Video className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Gestionar Videos</span>
                    <span className="sm:hidden">Videos</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search and Filters for Products Tab */}
            {activeTab === 'products' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 mt-4 lg:mt-6">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'gifts' | 'tech')}
                  className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                >
                  <option value="all">Todas</option>
                  <option value="tech">Tecnología</option>
                  <option value="gifts">Regalos</option>
                </select>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-4 lg:p-8">
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

              {activeTab === 'videos' && (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.secondary }}>
                    Gestión de Videos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Administra los videos de la galería desde aquí
                  </p>
                  <button
                    onClick={() => setShowVideoManager(true)}
                    className="px-6 py-3 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Abrir Gestor de Videos
                  </button>
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
      </div>
      
      <VideoManager 
        isOpen={showVideoManager} 
        onClose={() => setShowVideoManager(false)} 
      />
    </div>
  );
};

export default AdminPanelPage;