import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Video, RotateCw, X } from 'lucide-react';
import AdvancedImageZoom from './AdvancedImageZoom';
import ProductVideoPlayer from './ProductVideoPlayer';
import Gallery360 from './Gallery360';
import { Product } from '../types';

interface ProductMediaViewerProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

type MediaType = 'images' | 'videos' | '360';

const ProductMediaViewer: React.FC<ProductMediaViewerProps> = ({ product, isOpen, onClose }) => {
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('images');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasImages = product.images && product.images.length > 0;
  const hasVideos = product.videos && product.videos.length > 0;
  const has360 = product.images360 && product.images360.length > 0;

  const mediaTypes = [
    { type: 'images' as MediaType, icon: Image, label: 'Photos', available: hasImages },
    { type: 'videos' as MediaType, icon: Video, label: 'Videos', available: hasVideos },
    { type: '360' as MediaType, icon: RotateCw, label: '360°', available: has360 }
  ].filter(media => media.available);

  const renderMediaContent = () => {
    switch (activeMediaType) {
      case 'images':
        if (!hasImages) return null;
        return (
          <div className="space-y-4">
            <AdvancedImageZoom
              src={product.images![currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="h-96"
            />
            {product.images!.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {product.images!.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-blue-500 opacity-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
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
        );

      case 'videos':
        if (!hasVideos) return null;
        return (
          <ProductVideoPlayer
            videos={product.videos!}
            poster={product.image}
            className="h-96"
          />
        );

      case '360':
        if (!has360) return null;
        return (
          <Gallery360
            images={product.images360!}
            autoRotate={false}
            rotationSpeed={3000}
            className="h-96"
          />
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-gray-600">Media Gallery</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Media Type Tabs */}
            {mediaTypes.length > 1 && (
              <div className="flex border-b">
                {mediaTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setActiveMediaType(type)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeMediaType === type
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Media Content */}
            <div className="p-6">
              {renderMediaContent()}
            </div>

            {/* Media Info */}
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Media Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {hasImages && (
                    <div>
                      <span className="text-gray-600">Photos:</span>
                      <span className="ml-2 font-medium">{product.images!.length}</span>
                    </div>
                  )}
                  {hasVideos && (
                    <div>
                      <span className="text-gray-600">Videos:</span>
                      <span className="ml-2 font-medium">{product.videos!.length}</span>
                    </div>
                  )}
                  {has360 && (
                    <div>
                      <span className="text-gray-600">360° Frames:</span>
                      <span className="ml-2 font-medium">{product.images360!.length}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium capitalize">{product.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductMediaViewer;