import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Upload, Image as ImageIcon, AlertCircle, Camera, Folder } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';




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

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'tech' as 'gifts' | 'tech',
    images: [] as string[],
    description: ''
  });

  useEffect(() => {
    if (product) {
      let priceValue = '';
      if (typeof product.price === 'string') {
        priceValue = product.price.replace(/[$.,]/g, '');
      } else if (typeof product.price === 'number') {
        priceValue = String(product.price);
      }
      
      setFormData({
        name: product.name,
        price: priceValue,
        category: product.category,
        images: product.images || [product.image],
        description: product.description
      });
      setImagePreviews(product.images || [product.image]);
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'tech',
        images: [],
        description: ''
      });
      setImagePreviews([]);
    }
    setErrors({});
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número válido mayor a 0';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'Al menos una imagen es requerida';
    } else {
      const invalidUrls = formData.images.filter(url => !isValidUrl(url));
      if (invalidUrls.length > 0) {
        newErrors.images = 'Todas las URLs deben ser válidas';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    if (string.startsWith('data:image/')) {
      return true; // Data URLs from uploaded files
    }
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const addImage = () => {
    if (newImageUrl && isValidUrl(newImageUrl) && !formData.images.includes(newImageUrl)) {
      const updatedImages = [...formData.images, newImageUrl];
      setFormData({ ...formData, images: updatedImages });
      setImagePreviews(updatedImages);
      setNewImageUrl('');
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl && !formData.images.includes(compressedDataUrl)) {
        const updatedImages = [...formData.images, compressedDataUrl];
        setFormData({ ...formData, images: updatedImages });
        setImagePreviews(updatedImages);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      files.forEach(file => handleFileUpload(file));
    };
    input.click();
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
    setImagePreviews(updatedImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { productService } = await import('../../services/productService');
      
      const productData = {
        name: formData.name.trim(),
        price: `$${Number(formData.price).toLocaleString()}`,
        category: formData.category === 'gifts' ? 'regalos' : 'tecnologia',
        image: formData.images[0] || 'https://via.placeholder.com/300x200',
        images: formData.images,
        description: formData.description.trim()
      } as any;

      if (product) {
        await productService.updateProduct(product.id.toString(), productData);
      } else {
        await productService.addProduct(productData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Error al guardar el producto. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const suggestedImages = {
    tech: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400'
    ],
    gifts: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-0">
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            {product ? 'Modifica los datos del producto' : 'Completa la información del nuevo producto'}
          </p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-4 lg:space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: iPhone 15 Pro Max"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'gifts' | 'tech' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tech">Tecnología</option>
                  <option value="gifts">Regalos</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe las características principales del producto..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="space-y-6">
            {/* Image URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes del Producto *
              </label>
              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleFileSelect}
                    disabled={uploading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    <Folder className="w-5 h-5" />
                    {uploading ? 'Subiendo...' : 'Subir Archivos'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Usar Cámara
                  </button>
                </div>
              </div>
              
              {/* Lista de imágenes agregadas */}
              {formData.images.length > 0 && (
                <div className="space-y-2 mb-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <img src={url} alt={`Imagen ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                      <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 text-red-600 hover:text-red-800 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
            </div>

            {/* Images Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vista Previa ({imagePreviews.length} imágenes)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <p className="text-sm">Las imágenes aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes Sugeridas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {suggestedImages[formData.category].map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (!formData.images.includes(url)) {
                        const updatedImages = [...formData.images, url];
                        setFormData({ ...formData, images: updatedImages });
                        setImagePreviews(updatedImages);
                      }
                    }}
                    className="relative group overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-500 transition-colors"
                  >
                    <img
                      src={url}
                      alt={`Sugerencia ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {formData.images.includes(url) && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 lg:pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
          >
            {loading ? (
              <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3 h-3 lg:w-4 lg:h-4" />
            )}
            <span className="hidden sm:inline">{loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear Producto')}</span>
            <span className="sm:hidden">{loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;