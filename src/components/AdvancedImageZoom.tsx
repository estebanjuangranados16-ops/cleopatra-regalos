import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize } from 'lucide-react';

interface AdvancedImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const AdvancedImageZoom: React.FC<AdvancedImageZoomProps> = ({ src, alt, className = '' }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomLevel(prev => Math.max(1, Math.min(5, prev + delta)));
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    link.click();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      
      switch (e.key) {
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          handleRotate();
          break;
        case 'Escape':
          handleReset();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  return (
    <div className={`relative group ${className}`}>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <motion.img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
            cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          draggable={false}
        />
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRotate();
            }}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            title="Rotate (R)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadImage();
            }}
            className="p-2 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Level Indicator */}
        {zoomLevel > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
            {Math.round(zoomLevel * 100)}%
          </div>
        )}

        {/* Instructions */}
        {isZoomed && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
            Scroll to zoom • Drag to pan • ESC to reset
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedImageZoom;