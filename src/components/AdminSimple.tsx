import React, { useState, useEffect } from 'react';
import { X, Plus, Package, Save, Trash2 } from 'lucide-react';

interface SimpleProduct {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
}

interface AdminSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSimple: React.FC<AdminSimpleProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'tech',
    image: '',
    description: ''
  });

  const loadProducts = async () => {
    try {
      const { productService } = await import('../services/productService');
      const data = await productService.getProducts();
      setProducts(data.map(p => ({
        id: p.id.toString(),
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        description: p.description
      })));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (!isOpen) return null;

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.image) return;

    try {
      const { productService } = await import('../services/productService');
      
      const newProduct = {
        name: form.name,
        price: `$${parseFloat(form.price).toLocaleString()}`,
        category: form.category as 'gifts' | 'tech',
        image: form.image,
        description: form.description
      };

      await productService.addProduct(newProduct);
      await loadProducts();
      
      setForm({
        name: '',
        price: '',
        category: 'tech',
        image: '',
        description: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { productService } = await import('../services/productService');
      await productService.deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex overflow-hidden">
        <div className="w-64 bg-gray-100 p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'add' ? 'bg-yellow-200 text-yellow-800' : 'text-gray-600 hover:bg-blue-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              Agregar Producto
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'view' ? 'bg-yellow-200 text-yellow-800' : 'text-gray-600 hover:bg-blue-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Ver Productos ({products.length})
            </button>
          </nav>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'add' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Agregar Producto</h2>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Nombre del producto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Precio *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="tech">Tecnología</option>
                    <option value="gifts">Regalos</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">URL Imagen *</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({...form, image: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="https://..."
                  />
                  {form.image && (
                    <img src={form.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Descripción del producto"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveProduct}
                  className="px-6 py-3 bg-green-700 text-white rounded-lg flex items-center gap-2 hover:bg-green-800"
                >
                  <Save className="w-4 h-4" />
                  Guardar en Firebase
                </button>
              </div>
            </div>
          )}

          {activeTab === 'view' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Productos en Firebase ({products.length})</h2>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No hay productos en la base de datos</p>
                  <p className="text-gray-400 text-sm">Agrega productos usando el formulario</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map(product => (
                    <div key={product.id} className="border border-gray-300 rounded-lg p-4 flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-semibold text-green-600">{product.price}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSimple;