import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  BarChart3, 
  Search,
  Upload,
  X,
  Save,
  RefreshCw
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  minStock: number;
  status: 'active' | 'inactive';
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsChange: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onProductsChange }) => {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState('add');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'tech',
    image: '',
    description: '',
    stock: '',
    minStock: '',
    status: 'active' as 'active' | 'inactive'
  });

  const menuItems = [
    { id: 'add', label: 'Agregar Producto', icon: Plus },
    { id: 'edit', label: 'Editar Producto', icon: Edit },
    { id: 'delete', label: 'Eliminar Producto', icon: Trash2 },
    { id: 'view', label: 'Ver Productos', icon: Eye },
    { id: 'stock', label: 'Gestionar Stock', icon: Package },
    { id: 'reports', label: 'Reportes', icon: BarChart3 }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const saved = localStorage.getItem('cleopatra-products');
    if (saved) {
      const parsedProducts = JSON.parse(saved).map((p: any) => ({
        ...p,
        minStock: p.minStock || 5,
        status: p.status || 'active'
      }));
      setProducts(parsedProducts);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: boolean} = {};
    if (!productForm.name.trim()) newErrors.name = true;
    if (!productForm.price || parseFloat(productForm.price) <= 0) newErrors.price = true;
    if (!productForm.image.trim()) newErrors.image = true;
    if (!productForm.description.trim()) newErrors.description = true;
    if (!productForm.stock || parseInt(productForm.stock) < 0) newErrors.stock = true;
    if (!productForm.minStock || parseInt(productForm.minStock) < 0) newErrors.minStock = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    const productData: Product = {
      id: selectedProduct?.id || Date.now().toString(),
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
      image: productForm.image,
      description: productForm.description,
      stock: parseInt(productForm.stock),
      minStock: parseInt(productForm.minStock),
      status: productForm.status
    };

    let updatedProducts;
    if (selectedProduct) {
      updatedProducts = products.map(p => p.id === selectedProduct.id ? productData : p);
    } else {
      updatedProducts = [...products, productData];
    }

    setProducts(updatedProducts);
    localStorage.setItem('cleopatra-products', JSON.stringify(updatedProducts));
    onProductsChange();
    resetForm();
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: 'tech',
      image: '',
      description: '',
      stock: '',
      minStock: '',
      status: 'active'
    });
    setSelectedProduct(null);
    setErrors({});
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      status: product.status
    });
    setActiveSection('edit');
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Confirmar eliminación?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('cleopatra-products', JSON.stringify(updated));
      onProductsChange();
    }
  };

  const updateStock = (id: string, newStock: number) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, stock: newStock } : p
    );
    setProducts(updated);
    localStorage.setItem('cleopatra-products', JSON.stringify(updated));
    onProductsChange();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  const renderAddProduct = () => (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Agregar Producto</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre *</label>
          <input
            type="text"
            value={productForm.name}
            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Precio *</label>
          <input
            type="number"
            value={productForm.price}
            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Categoría</label>
          <select
            value={productForm.category}
            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="tech">Tecnología</option>
            <option value="gifts">Regalos</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Stock *</label>
          <input
            type="number"
            value={productForm.stock}
            onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Stock Mínimo *</label>
          <input
            type="number"
            value={productForm.minStock}
            onChange={(e) => setProductForm({...productForm, minStock: e.target.value})}
            className={`w-full p-3 border rounded-lg ${errors.minStock ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <select
            value={productForm.status}
            onChange={(e) => setProductForm({...productForm, status: e.target.value as 'active' | 'inactive'})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">URL Imagen *</label>
          <div className="flex gap-3">
            <input
              type="url"
              value={productForm.image}
              onChange={(e) => setProductForm({...productForm, image: e.target.value})}
              className={`flex-1 p-3 border rounded-lg ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button className="px-4 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Subir
            </button>
          </div>
          {productForm.image && (
            <img src={productForm.image} alt="Preview" className="mt-3 w-20 h-20 object-cover rounded" />
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Descripción *</label>
          <textarea
            value={productForm.description}
            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
            rows={3}
            className={`w-full p-3 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSaveProduct}
          className="px-6 py-3 bg-green-700 text-white rounded-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar
        </button>
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  const renderEditProduct = () => (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Editar Producto</h2>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
          />
        </div>
        {searchTerm && (
          <div className="mt-3 max-h-40 overflow-y-auto border rounded-lg">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => {
                  handleEditProduct(product);
                  setSearchTerm('');
                }}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{formatPrice(product.price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedProduct && renderAddProduct()}
    </div>
  );

  const renderTable = (showActions = false, showDelete = false, showStock = false) => (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              {showStock && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Min</th>}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              {(showActions || showDelete || showStock) && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 capitalize">{product.category}</td>
                <td className="px-4 py-3">
                  {showStock ? (
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                      className="w-20 p-1 border border-gray-300 rounded text-center"
                    />
                  ) : (
                    <span className={product.stock < product.minStock ? 'text-red-600 font-medium' : ''}>
                      {product.stock}
                    </span>
                  )}
                </td>
                {showStock && <td className="px-4 py-3">{product.minStock}</td>}
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {(showActions || showDelete || showStock) && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {showActions && (
                        <>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {showDelete && (
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      )}
                      {showStock && (
                        <button
                          onClick={() => updateStock(product.id, product.stock)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Actualizar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => {
    const techProducts = products.filter(p => p.category === 'tech').length;
    const giftProducts = products.filter(p => p.category === 'gifts').length;
    const lowStock = products.filter(p => p.stock < p.minStock).length;
    
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Reportes</h2>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{techProducts}</div>
            <div className="text-sm text-gray-600">Productos Tecnología</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{giftProducts}</div>
            <div className="text-sm text-gray-600">Productos Regalos</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{lowStock}</div>
            <div className="text-sm text-gray-600">Stock Bajo</div>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <div>Gráfico de ventas por categoría</div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'add': return renderAddProduct();
      case 'edit': return renderEditProduct();
      case 'delete': return <div className="bg-white rounded-lg p-6"><h2 className="text-xl font-bold mb-6">Eliminar Productos</h2>{renderTable(false, true)}</div>;
      case 'view': return <div className="bg-white rounded-lg p-6"><h2 className="text-xl font-bold mb-6">Ver Productos</h2>{renderTable(true)}</div>;
      case 'stock': return <div className="bg-white rounded-lg p-6"><h2 className="text-xl font-bold mb-6">Gestionar Stock</h2>{renderTable(false, false, true)}</div>;
      case 'reports': return renderReports();
      default: return renderAddProduct();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-7xl mx-auto my-4 rounded-lg flex overflow-hidden" style={{ maxHeight: '80vh' }}>
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;