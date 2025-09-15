import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause } from 'lucide-react';
import { MediaItem } from '../services/galleryService';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: MediaItem | null;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && video && videoRef.current) {
      setIsLoading(true);
      setIsPlaying(false);
      
      const videoElement = videoRef.current;
      videoElement.currentTime = 0;
      
      const handleCanPlay = () => {
        setIsLoading(false);
        // Intentar autoplay
        videoElement.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      };

      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.load(); // Forzar recarga del video

      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [isOpen, video?.src]);

  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-xs mx-auto h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Loading */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            {/* Video */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadStart={() => setIsLoading(true)}
              onLoadedData={() => setIsLoading(false)}
              onError={(e) => {
                console.error('Video error:', e);
                setIsLoading(false);
              }}
              style={{ aspectRatio: '9/16' }}
            >
              <source src={video.src} type="video/mp4" />
              <source src={video.src} type="video/webm" />
              <source src={video.src} type="video/ogg" />
              Tu navegador no soporta este video.
            </video>

            {/* Overlay clickeable para play/pause */}
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              {!isPlaying && !isLoading && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-20 h-20 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>
              )}
            </div>

            {/* Información del video */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                  {video.isInstagramPost ? 'REEL' : 'VIDEO'}
                </span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  {video.badge}
                </span>
              </div>
              
              <h3 className="text-white text-lg font-bold mb-1 leading-tight">
                {video.title}
              </h3>
              
              <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                {video.description}
              </p>
              
              <div className="mt-2 text-white/60 text-xs">
                #{video.category.toLowerCase()} #cleopatraregalos
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;