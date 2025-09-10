import { useState, useEffect } from 'react';

interface UseOptimizedImagesProps {
  images: string[];
  placeholder?: string;
}

export const useOptimizedImages = ({ images, placeholder = '/placeholder-image.jpg' }: UseOptimizedImagesProps) => {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const [errorImages, setErrorImages] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    images.forEach((src) => {
      if (!loadedImages[src] && !errorImages[src]) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [src]: true }));
        };
        img.onerror = () => {
          setErrorImages(prev => ({ ...prev, [src]: true }));
        };
        img.src = src;
      }
    });
  }, [images, loadedImages, errorImages]);

  const getImageSrc = (src: string) => {
    if (errorImages[src]) return placeholder;
    if (loadedImages[src]) return src;
    return placeholder;
  };

  const isImageLoaded = (src: string) => loadedImages[src] || false;
  const hasImageError = (src: string) => errorImages[src] || false;

  return { getImageSrc, isImageLoaded, hasImageError };
};