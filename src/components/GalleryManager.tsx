import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, Image, X, Play, Instagram } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MediaItem } from '../services/galleryService';

interface GalleryManagerProps {
  items: MediaItem[];
  onAddItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  onRemoveItem: (id: number) => void;
  onVideoClick?: (video: MediaItem) => void;
}

const GalleryManager: React.FC<GalleryManagerProps> = ({ items, onAddItem, onRemoveItem, onVideoClick }) => {
  const { colors } = useTheme();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Marketing',
    badge: 'Nuevo',
    isInstagramPost: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar tamaño del archivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      
      // Para videos, crear un thumbnail simple
      let thumbnail = src;
      if (uploadType === 'video') {
        // Usar una imagen por defecto para videos
        thumbnail = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTExODI3Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE4NSAxMzVMMjE1IDE1MEwxODUgMTY1VjEzNVoiIGZpbGw9IiMxMTE4MjciLz4KPC9zdmc+';
      }
      
      try {
        onAddItem({
          type: uploadType,
          src,
          thumbnail,
          title: formData.title || `${uploadType === 'video' ? 'Video' : 'Imagen'} ${Date.now()}`,
          description: formData.description || 'Contenido subido desde la galería',
          category: formData.category,
          badge: formData.badge,
          isInstagramPost: formData.isInstagramPost
        });

        // Limpiar formulario
        setFormData({
          title: '',
          description: '',
          category: 'Marketing',
          badge: 'Nuevo',
          isInstagramPost: false
        });
        setShowUploadForm(false);
        
        // Limpiar input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        alert('Error al subir el archivo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    };
    
    reader.onerror = () => {
      alert('Error al leer el archivo');
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Botón para agregar contenido */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowUploadForm(true)}
        className="flex items-center gap-3 px-6 py-3 rounded-full text-white font-semibold shadow-lg"
        style={{ backgroundColor: colors.primary }}
      >
        <Upload className="w-5 h-5" />
        Agregar Contenido
      </motion.button>

      {/* Formulario de subida */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border"
          style={{ borderColor: colors.primary }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: colors.secondary }}>
              Subir Contenido
            </h3>
            <button
              onClick={() => setShowUploadForm(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Tipo de contenido */}
            <div className="flex gap-4">
              <button
                onClick={() => setUploadType('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                  uploadType === 'image' ? 'text-white' : 'text-gray-600 bg-gray-100'
                }`}
                style={{ backgroundColor: uploadType === 'image' ? colors.primary : undefined }}
              >
                <Image className="w-4 h-4" />
                Imagen
              </button>
              <button
                onClick={() => setUploadType('video')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                  uploadType === 'video' ? 'text-white' : 'text-gray-600 bg-gray-100'
                }`}
                style={{ backgroundColor: uploadType === 'video' ? colors.primary : undefined }}
              >
                <Video className="w-4 h-4" />
                Video
              </button>
            </div>

            {/* Campos del formulario */}
            <input
              type="text"
              placeholder="Título (opcional)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: colors.primary }}
            />

            <textarea
              placeholder="Descripción (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg h-24 resize-none focus:outline-none focus:ring-2"
              style={{ borderColor: colors.primary }}
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
            >
              <option value="Marketing">Marketing</option>
              <option value="Productos">Productos</option>
              <option value="Eventos">Eventos</option>
              <option value="Testimonios">Testimonios</option>
            </select>

            <select
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Popular">Popular</option>
              <option value="Favorito">Favorito</option>
              <option value="Premium">Premium</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isInstagramPost}
                onChange={(e) => setFormData({ ...formData, isInstagramPost: e.target.checked })}
                className="w-4 h-4"
              />
              <Instagram className="w-4 h-4" style={{ color: colors.accent }} />
              <span>Es un post de Instagram</span>
            </label>

            {/* Input de archivo */}
            <input
              ref={fileInputRef}
              type="file"
              accept={uploadType === 'video' ? 'video/*' : 'image/*'}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed rounded-lg text-center hover:bg-gray-50 transition-colors"
              style={{ borderColor: colors.primary }}
            >
              <div className="flex flex-col items-center gap-2">
                {uploadType === 'video' ? (
                  <Video className="w-8 h-8" style={{ color: colors.primary }} />
                ) : (
                  <Image className="w-8 h-8" style={{ color: colors.primary }} />
                )}
                <span>Seleccionar {uploadType === 'video' ? 'video' : 'imagen'}</span>
                <span className="text-sm text-gray-500">Máximo 10MB</span>
              </div>
            </button>
          </div>
        </motion.div>
      )}

      {/* Lista de contenido */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative group"
          >
            <div className="relative h-48">
              {item.type === 'video' ? (
                <div 
                  className="w-full h-full bg-black flex items-center justify-center relative group cursor-pointer"
                  onClick={() => onVideoClick?.(item)}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <Play className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute top-2 left-2 flex gap-2">
                <span
                  className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  {item.badge}
                </span>
                {item.isInstagramPost && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500">
                    IG
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-sm mb-1" style={{ color: colors.secondary }}>
                {item.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {item.description}
              </p>
              <span
                className="text-xs font-semibold"
                style={{ color: colors.accent }}
              >
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;