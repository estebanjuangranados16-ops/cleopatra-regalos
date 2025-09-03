import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Upload, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsChange: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onProductsChange }) => {
  const { colors } = useTheme();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'delete'>('add');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'tecnologia' as 'tecnologia' | 'regalos',
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const loadAllProducts = async () => {
    try {
      const { productService } = await import('../services/productService');
      const products = await productService.getProducts();
      setAllProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadAllProducts();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()]
      });
      setImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result && !formData.images.includes(result)) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, result]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const formatPrice = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('es-CO').format(parseInt(number) || 0);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setFormData({
      ...formData,
      price: value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'tecnologia',
      images: []
    });
    setEditingProduct(null);
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || formData.images.length === 0) return;

    setLoading(true);
    try {
      const { productService } = await import('../services/productService');
      
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, {
          name: formData.name,
          price: parseInt(formData.price) || 0,
          description: formData.description,
          category: formData.category,
          images: formData.images
        });
        alert('Producto actualizado exitosamente');
      } else {
        await productService.addProduct({
          name: formData.name,
          price: parseInt(formData.price) || 0,
          description: formData.description,
          category: formData.category,
          images: formData.images
        });
        alert('Producto agregado exitosamente');
      }

      resetForm();
      onProductsChange();
      loadAllProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      images: product.images
    });
    setActiveTab('edit');
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const { productService } = await import('../services/productService');
      await productService.deleteProduct(productId);
      alert('Producto eliminado exitosamente');
      onProductsChange();
      loadAllProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar producto');
    }
  };

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-4 bg-white rounded-2xl z-[9999] flex max-w-7xl mx-auto shadow-2xl"
          >
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 rounded-l-2xl p-6 border-r border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold" style={{ color: colors.secondary }}>
                  Panel Admin
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('add'); resetForm(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'add' 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Agregar Producto
                </button>
                <button
                  onClick={() => { setActiveTab('edit'); resetForm(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'edit' 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Editar Producto
                </button>
                <button
                  onClick={() => setActiveTab('delete')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'delete' 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar Producto
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Add Product */}
              {activeTab === 'add' && (
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.secondary }}>
                    Agregar Nuevo Producto
                  </h3>
                  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Nombre</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            !formData.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Nombre del producto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Precio</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">$</span>
                          <input
                            type="text"
                            value={formatPrice(formData.price)}
                            onChange={handlePriceChange}
                            required
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                              !formData.price ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Categoría</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        >
                          <option value="tecnologia">Tecnología</option>
                          <option value="regalos">Regalos</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Imágenes</label>
                        
                        {/* File Upload Options */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <Upload className="w-6 h-6 text-gray-400 mb-1" />
                              <span className="text-sm text-gray-500">Subir desde dispositivo</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div>
                            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <Upload className="w-6 h-6 text-gray-400 mb-1" />
                              <span className="text-sm text-gray-500">Tomar foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                        
                        {/* URL Input */}
                        <div className="flex gap-3 mb-4">
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                            placeholder="O pegar URL de imagen"
                          />
                          <button
                            type="button"
                            onClick={addImage}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img src={image} alt={`${index + 1}`} className="w-full h-16 object-cover rounded" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Descripción</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                          !formData.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Descripción del producto"
                      />
                    </div>
                    <div className="col-span-2 flex gap-4 justify-end pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => { onClose(); resetForm(); }}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !formData.name || !formData.description || formData.images.length === 0}
                        className="flex items-center gap-2 px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Product */}
              {activeTab === 'edit' && (
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.secondary }}>
                    Editar Producto
                  </h3>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Buscar Producto</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      placeholder="Buscar por nombre..."
                    />
                  </div>
                  {!editingProduct && (
                    <div className="grid gap-4 mb-6 max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Editar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {editingProduct && (
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Nombre</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Precio</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <input
                              type="text"
                              value={formatPrice(formData.price)}
                              onChange={handlePriceChange}
                              required
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Categoría</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                          >
                            <option value="tecnologia">Tecnología</option>
                            <option value="regalos">Regalos</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Imágenes</label>
                          
                          {/* File Upload Options */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-sm text-gray-500">Subir desde dispositivo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <div>
                              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-sm text-gray-500">Tomar foto</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                          
                          {/* URL Input */}
                          <div className="flex gap-3 mb-4">
                            <input
                              type="url"
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                              placeholder="O pegar URL de imagen"
                            />
                            <button
                              type="button"
                              onClick={addImage}
                              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {formData.images.map((image, index) => (
                                <div key={index} className="relative">
                                  <img src={image} alt={`${index + 1}`} className="w-full h-16 object-cover rounded" />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Descripción</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                        />
                      </div>
                      <div className="col-span-2 flex gap-4 justify-end pt-6 border-t">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          {loading ? 'Actualizando...' : 'Actualizar'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Delete Product */}
              {activeTab === 'delete' && (
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.secondary }}>
                    Eliminar Productos
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Imagen</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Nombre</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Precio</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Categoría</th>
                          <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-3">
                              <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            </td>
                            <td className="border border-gray-200 px-4 py-3 font-medium">{product.name}</td>
                            <td className="border border-gray-200 px-4 py-3">{formatPrice(product.price.toString())}</td>
                            <td className="border border-gray-200 px-4 py-3 capitalize">{product.category}</td>
                            <td className="border border-gray-200 px-4 py-3 text-center">
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;