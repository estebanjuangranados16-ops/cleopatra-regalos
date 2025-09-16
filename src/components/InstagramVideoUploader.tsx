import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Instagram, Video, X, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cloudinaryService } from '../services/cloudinaryService';

interface InstagramVideoUploaderProps {
  onVideoUploaded: (videoData: {
    url: string;
    thumbnail: string;
    title: string;
    description: string;
    publicId: string;
  }) => void;
  onClose: () => void;
}

const InstagramVideoUploader: React.FC<InstagramVideoUploaderProps> = ({ onVideoUploaded, onClose }) => {
  const { colors } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea un video
    if (!file.type.startsWith('video/')) {
      alert('Por favor selecciona un archivo de video válido');
      return;
    }

    // Validar tamaño (máximo 500MB para videos grandes)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      alert('El video es muy grande. Máximo 500MB permitido.');
      return;
    }

    setVideoFile(file);
    
    // Crear preview
    const url = URL.createObjectURL(file);
    setVideoPreview(url);

    // Auto-generar título si está vacío
    if (!formData.title) {
      setFormData(prev => ({
        ...prev,
        title: `Video Instagram ${new Date().toLocaleDateString()}`
      }));
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Subir a Cloudinary
      const result = await cloudinaryService.uploadFile(videoFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Esperar un momento para mostrar el 100%
      setTimeout(() => {
        onVideoUploaded({
          url: result.url,
          thumbnail: result.thumbnail || result.url,
          title: formData.title,
          description: formData.description,
          publicId: result.publicId
        });
        
        // Limpiar y cerrar
        setVideoFile(null);
        setVideoPreview(null);
        setFormData({ title: '', description: '' });
        setIsUploading(false);
        setUploadProgress(0);
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error al subir el video. Intenta de nuevo.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: colors.secondary }}>
                Subir Video de Instagram
              </h3>
              <p className="text-sm text-gray-500">Máximo 500MB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Área de subida */}
          {!videoFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: colors.primary }}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: colors.secondary }}>
                    Seleccionar Video
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Haz clic para seleccionar un video de Instagram
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos: MP4, MOV, AVI • Máximo 500MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Preview del video */
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  src={videoPreview!}
                  className="w-full h-48 object-contain"
                  controls
                  muted
                />
                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                    if (videoPreview) URL.revokeObjectURL(videoPreview);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p><strong>Archivo:</strong> {videoFile.name}</p>
                <p><strong>Tamaño:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p><strong>Tipo:</strong> {videoFile.type}</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Formulario */}
          {videoFile && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.secondary }}>
                  Título del Video
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Nuevo producto en acción"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.primary }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.secondary }}>
                  Descripción (Opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el contenido del video..."
                  rows={3}
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2"
                  style={{ borderColor: colors.primary }}
                />
              </div>
            </div>
          )}

          {/* Progreso de subida */}
          {isUploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: colors.secondary }}>Subiendo video...</span>
                <span style={{ color: colors.primary }}>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              </div>
              {uploadProgress === 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>¡Video subido exitosamente!</span>
                </div>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-3 border rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={!videoFile || !formData.title.trim() || isUploading}
              className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.primary }}
            >
              {isUploading ? 'Subiendo...' : 'Subir Video'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InstagramVideoUploader;