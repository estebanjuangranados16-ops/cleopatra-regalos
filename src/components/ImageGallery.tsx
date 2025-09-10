import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
  isOpen,
  onClose,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/50 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Zoom Toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
            >
              <img
                src={images[currentIndex]}
                alt={`${productName} - Imagen ${currentIndex + 1}`}
                className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                draggable={false}
              />
            </motion.div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                      setIsZoomed(false);
                    }}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-white opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageGallery;