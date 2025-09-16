import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Plus, Edit, Trash2, Play, X, Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { hybridGalleryService, HybridMediaItem } from '../../services/hybridGalleryService';
import InstagramVideoUploader from '../InstagramVideoUploader';

interface VideoManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoManager: React.FC<VideoManagerProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const [videos, setVideos] = useState<HybridMediaItem[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [editingVideo, setEditingVideo] = useState<HybridMediaItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    badge: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadVideos();
    }
  }, [isOpen]);

  const loadVideos = () => {
    const allItems = hybridGalleryService.getItems();
    const videoItems = allItems.filter(item => item.type === 'video');
    setVideos(videoItems);
  };

  const handleEdit = (video: HybridMediaItem) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description,
      category: video.category,
      badge: video.badge
    });
  };

  const handleSaveEdit = async () => {
    if (!editingVideo) return;
    
    try {
      const allItems = hybridGalleryService.getItems();
      const updatedItems = allItems.map(item => 
        item.id === editingVideo.id 
          ? { ...item, ...editForm }
          : item
      );
      
      localStorage.setItem('cleopatra_gallery_hybrid', JSON.stringify(updatedItems));
      setEditingVideo(null);
      loadVideos();
    } catch (error) {
      alert('Error al actualizar el video');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este video?')) return;
    
    try {
      await hybridGalleryService.removeItem(id);
      loadVideos();
    } catch (error) {
      alert('Error al eliminar el video');
    }
  };

  const handleVideoUploaded = async (videoData: any) => {
    try {
      const response = await fetch(videoData.url);
      const blob = await response.blob();
      const file = new File([blob], 'admin-video.mp4', { type: 'video/mp4' });
      
      await hybridGalleryService.addItem(file, {
        title: videoData.title,
        description: videoData.description,
        category: 'Admin',
        badge: 'Nuevo',
        isInstagramPost: false
      });
      
      loadVideos();
      setShowUploader(false);
    } catch (error) {
      alert('Error al subir el video');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Video className="w-6 h-6" style={{ color: colors.primary }} />
            <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
              Gestión de Videos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {videos.length} video{videos.length !== 1 ? 's' : ''} en la galería
            </p>
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.primary }}
            >
              <Plus className="w-4 h-4" />
              Agregar Video
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="relative">
                  <video
                    src={video.src}
                    className="w-full h-32 object-cover"
                    poster={video.thumbnail}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  {video.isInstagramPost && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                      IG
                    </span>
                  )}
                </div>
                
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 truncate">{video.title}</h4>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                      {video.badge}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No hay videos en la galería</p>
              <button
                onClick={() => setShowUploader(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: colors.primary }}
              >
                Subir Primer Video
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.secondary }}>
              Editar Video
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              
              <textarea
                placeholder="Descripción"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full p-3 border rounded-lg h-24 resize-none"
              />
              
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="Marketing">Marketing</option>
                <option value="Productos">Productos</option>
                <option value="Eventos">Eventos</option>
                <option value="Instagram">Instagram</option>
                <option value="Admin">Admin</option>
              </select>
              
              <select
                value={editForm.badge}
                onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Popular">Popular</option>
                <option value="Favorito">Favorito</option>
                <option value="Premium">Premium</option>
                <option value="Reel">Reel</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingVideo(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2 text-white rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Uploader */}
      {showUploader && (
        <InstagramVideoUploader
          onVideoUploaded={handleVideoUploaded}
          onClose={() => setShowUploader(false)}
        />
      )}
    </div>
  );
};

export default VideoManager;