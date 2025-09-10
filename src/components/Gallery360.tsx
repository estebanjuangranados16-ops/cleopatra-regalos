import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Play, Pause, RotateCcw, Maximize } from 'lucide-react';

interface Gallery360Props {
  images: string[];
  autoRotate?: boolean;
  rotationSpeed?: number;
  className?: string;
}

const Gallery360: React.FC<Gallery360Props> = ({ 
  images, 
  autoRotate = false, 
  rotationSpeed = 2000,
  className = '' 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [dragStart, setDragStart] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<NodeJS.Timeout>();

  const totalImages = images.length;
  const anglePerImage = 360 / totalImages;

  // Preload all images
  useEffect(() => {
    setLoadedImages(0);
    setIsLoading(true);
    
    images.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => {
          const newCount = prev + 1;
          if (newCount === images.length) {
            setIsLoading(false);
          }
          return newCount;
        });
      };
      img.src = src;
    });
  }, [images]);

  const updateImageFromAngle = useCallback((angle: number) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const imageIndex = Math.round(normalizedAngle / anglePerImage) % totalImages;
    setCurrentImageIndex(imageIndex);
  }, [anglePerImage, totalImages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStart(e.clientX);
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart;
    const rotationDelta = (deltaX / window.innerWidth) * 360;
    const newRotation = rotation + rotationDelta;
    
    setRotation(newRotation);
    updateImageFromAngle(newRotation);
    setDragStart(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStart(e.touches[0].clientX);
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStart;
    const rotationDelta = (deltaX / window.innerWidth) * 360;
    const newRotation = rotation + rotationDelta;
    
    setRotation(newRotation);
    updateImageFromAngle(newRotation);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  const rotateLeft = () => {
    const newRotation = rotation - anglePerImage;
    setRotation(newRotation);
    updateImageFromAngle(newRotation);
  };

  const rotateRight = () => {
    const newRotation = rotation + anglePerImage;
    setRotation(newRotation);
    updateImageFromAngle(newRotation);
  };

  const resetRotation = () => {
    setRotation(0);
    setCurrentImageIndex(0);
    setIsAutoRotating(false);
  };

  // Auto rotation effect
  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      autoRotateRef.current = setInterval(() => {
        setRotation(prev => {
          const newRotation = prev + anglePerImage;
          updateImageFromAngle(newRotation);
          return newRotation;
        });
      }, rotationSpeed);
    } else if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isAutoRotating, isDragging, anglePerImage, rotationSpeed, updateImageFromAngle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`relative bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 360° view...</p>
          <p className="text-sm text-gray-500">{loadedImages}/{totalImages} images loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentImageIndex]}
          alt={`360° view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-150"
          draggable={false}
        />

        {/* 360° Indicator */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full flex items-center gap-2">
          <RotateCw className="w-4 h-4" />
          360°
        </div>

        {/* Frame Counter */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
          {currentImageIndex + 1} / {totalImages}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={rotateLeft}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            title="Rotate Left"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleAutoRotate}
            className={`p-2 rounded-full transition-colors ${
              isAutoRotating 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-black/70 text-white hover:bg-black/90'
            }`}
            title={isAutoRotating ? 'Stop Auto Rotate' : 'Start Auto Rotate'}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={rotateRight}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            title="Rotate Right"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={resetRotation}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            title="Reset View"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-150"
              style={{ width: `${((currentImageIndex + 1) / totalImages) * 100}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Drag to rotate • Click controls
        </div>
      </div>
    </div>
  );
};

export default Gallery360;