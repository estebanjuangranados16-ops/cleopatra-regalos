import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, Sparkles, Play, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import GalleryManager from './GalleryManager';
import VideoModal from './VideoModal';
import { hybridGalleryService, HybridMediaItem } from '../services/hybridGalleryService';
import { MediaItem } from '../services/galleryService';

// Componente ImageWithFallback
const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}> = ({ src, alt, className = '', fallback = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80' }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
};

// Datos de la galería
const galleryItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    title: 'Smartwatch Collection 2024',
    description: 'Los mejores smartwatches del mercado con tecnología de punta para estar siempre conectado.',
    category: 'Tecnología',
    badge: 'Nuevo'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    title: 'Canasta Desayuno Sorpresa',
    description: 'Sorprende a esa persona especial con nuestras canastas gourmet llenas de amor y detalles únicos.',
    category: 'Regalos',
    badge: 'Popular'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    title: 'Peluches Gigantes',
    description: 'Los peluches más tiernos y suaves, perfectos para regalar amor y ternura en cualquier ocasión.',
    category: 'Regalos',
    badge: 'Favorito'
  },
  {
    id: 4,
    image: 'https://images.unseller.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    title: 'Auriculares Premium',
    description: 'Sonido de alta calidad con tecnología inalámbrica avanzada para una experiencia auditiva única.',
    category: 'Tecnología',
    badge: 'Premium'
  }
];

// Carrusel Hero
const HeroCarousel: React.FC<{ colors: any; items: MediaItem[] }> = ({ colors, items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible && items[currentSlide]?.type === 'video') {
        videoRef.current.play();
        videoRef.current.muted = false;
      } else {
        videoRef.current.pause();
        videoRef.current.muted = true;
      }
    }
  }, [isVisible, currentSlide, items]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % items.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div ref={carouselRef} className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl mb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {items[currentSlide]?.type === 'video' ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={items[currentSlide].src}
                className="h-full w-auto max-w-full object-contain"
                controls
                loop
                playsInline
                poster={items[currentSlide].thumbnail}
                muted={!isVisible}
                onClick={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.muted = !video.muted;
                }}
              />
            </div>
          ) : (
            <ImageWithFallback
              src={items[currentSlide]?.src}
              alt={items[currentSlide]?.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: colors.primary }}
                >
                  {items[currentSlide]?.badge}
                </motion.span>
                <span className="text-sm opacity-80">{items[currentSlide]?.category}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">{items[currentSlide]?.title}</h3>
              <p className="text-lg opacity-90 max-w-2xl">{items[currentSlide]?.description}</p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Partículas interactivas
const InteractiveParticles: React.FC<{ colors: any }> = ({ colors }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => {
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - (window.innerWidth * (0.2 + i * 0.2)), 2) +
          Math.pow(mousePosition.y - (window.innerHeight * (0.3 + i * 0.15)), 2)
        );
        const scale = Math.max(0.5, 1 - distance / 500);
        
        return (
          <motion.div
            key={`interactive-${i}`}
            className="absolute rounded-full"
            style={{
              width: '40px',
              height: '40px',
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
              background: `radial-gradient(circle, ${colors.primary}70, ${colors.primary}20 50%, transparent)`,
              boxShadow: `0 0 30px ${colors.primary}60`,
              transform: `scale(${scale})`,
              transition: 'transform 0.3s ease-out'
            }}
            animate={{
              scale: [scale * 0.8, scale * 1.2, scale * 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        );
      })}
    </div>
  );
};

// Elementos flotantes de fondo mejorados
const FloatingElements: React.FC<{ colors: any }> = ({ colors }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Círculos grandes de fondo */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${200 + i * 50}px`,
            height: `${200 + i * 50}px`,
            left: `${20 + i * 25}%`,
            top: `${10 + i * 20}%`,
            background: `radial-gradient(circle, ${colors.primary}25, transparent 70%)`,
            border: `2px solid ${colors.primary}40`
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
        />
      ))}
      
      {/* Círculos medianos flotantes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`medium-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            background: `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}25)`,
            backdropFilter: 'blur(1px)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5
          }}
        />
      ))}
      
      {/* Partículas pequeñas brillantes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 360],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8
          }}
        >
          {i % 4 === 0 && (
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ 
                background: `radial-gradient(circle, ${colors.primary}, transparent)`,
                boxShadow: `0 0 20px ${colors.primary}80`
              }} 
            />
          )}
          {i % 4 === 1 && <Star className="w-4 h-4 opacity-60" style={{ color: colors.primary }} />}
          {i % 4 === 2 && <Heart className="w-3 h-3 opacity-50" style={{ color: colors.accent }} />}
          {i % 4 === 3 && <Sparkles className="w-5 h-5 opacity-45" style={{ color: colors.primaryDark }} />}
        </motion.div>
      ))}
      
      {/* Ondas de fondo */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 20% 80%, ${colors.primary}15 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${colors.accent}15 0%, transparent 50%)`
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};



// Componente principal Gallery
const Gallery: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showManager, setShowManager] = useState(false);
  const isAdmin = user?.role === 'admin';
  const [galleryItems, setGalleryItems] = useState<HybridMediaItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Cargar items al montar el componente
  useEffect(() => {
    const items = hybridGalleryService.getItems();
    setGalleryItems(items);
  }, []);

  const addItem = async (file: File, metadata: {
    title: string;
    description: string;
    category: string;
    badge: string;
    isInstagramPost?: boolean;
  }) => {
    try {
      const newItem = await hybridGalleryService.addItem(file, metadata);
      setGalleryItems(prev => [...prev, newItem]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al guardar el archivo');
    }
  };

  const removeItem = async (id: number) => {
    try {
      await hybridGalleryService.removeItem(id);
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al eliminar el archivo');
    }
  };

  const handleVideoClick = (video: MediaItem) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  return (
    <section id="gallery" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-100 via-white to-blue-50">
      <FloatingElements colors={colors} />
      <InteractiveParticles colors={colors} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.secondary }}>
                Galería de Momentos Especiales
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Descubre la magia de Cleopatra a través de nuestros productos únicos y momentos inolvidables
              </p>
            </div>
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowManager(!showManager)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <Settings className="w-4 h-4" />
                Gestionar
              </motion.button>
            )}
          </div>
        </motion.div>

        {showManager && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="mb-16 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))`,
              boxShadow: `0 25px 50px -12px ${colors.primary}20`
            }}
          >
            <GalleryManager
              items={galleryItems}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onVideoClick={handleVideoClick}
            />
          </motion.div>
        )}

        {galleryItems.length > 0 ? (
          <HeroCarousel colors={colors} items={galleryItems} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl mb-16 border border-white/20"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))`,
              boxShadow: `0 25px 50px -12px ${colors.primary}15`
            }}
          >
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
              Aún no hay contenido en la galería
            </h3>
            <p className="text-gray-600 mb-6">
              Sube tus primeras imágenes y videos para comenzar a mostrar tu contenido
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowManager(true)}
              className="px-8 py-4 rounded-full text-white font-semibold shadow-lg"
              style={{ backgroundColor: colors.primary }}
            >
              Subir Primer Contenido
            </motion.button>
          </motion.div>
        )}

        {galleryItems.length > 0 && (
          <div className="space-y-12">
            {galleryItems.map((item, index) => {
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:grid-flow-col-dense"
              >
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 60 : -60, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className={`group relative ${isReversed ? 'lg:col-start-2' : ''}`}
                >
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    {item.type === 'video' ? (
                      <div 
                        className="relative w-full max-w-md mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
                        onClick={() => handleVideoClick(item)}
                        style={{ aspectRatio: '9/16', height: '600px' }}
                      >
                        <video
                          src={item.src}
                          className="w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                          poster={item.thumbnail}
                          ref={(video) => {
                            if (video) {
                              const observer = new IntersectionObserver(
                                ([entry]) => {
                                  if (entry.isIntersecting) {
                                    video.play();
                                    video.muted = false;
                                  } else {
                                    video.pause();
                                    video.muted = true;
                                  }
                                },
                                { threshold: 0.5 }
                              );
                              observer.observe(video);
                            }
                          }}
                          onError={(e) => {
                            const video = e.target as HTMLVideoElement;
                            video.style.display = 'none';
                            const img = document.createElement('img');
                            img.src = item.thumbnail || '/placeholder-image.jpg';
                            img.className = 'w-full h-full object-cover';
                            video.parentNode?.appendChild(img);
                          }}
                        />
                        
                        {/* Overlay gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Badges superiores */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                            {item.isInstagramPost ? 'REEL' : 'VIDEO'}
                          </span>
                          <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                            {item.badge}
                          </span>
                        </div>
                        
                        {/* Información inferior - solo visible en hover */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <h4 className="text-white font-bold text-sm mb-1 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-white/80 text-xs line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        
                        {/* Indicador de click para expandir */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ImageWithFallback
                        src={item.src}
                        alt={item.title}
                        className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-6 right-6 px-4 py-2 rounded-full text-white font-semibold shadow-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {item.badge}
                    </motion.div>

                    <div 
                      className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ borderColor: colors.primary }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: isReversed ? -60 : 60, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 80 }}
                  viewport={{ once: true }}
                  className={`space-y-6 ${isReversed ? 'lg:col-start-1' : ''}`}
                >
                  <div className="space-y-4">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: colors.accent }}
                    >
                      {item.category}
                    </motion.span>
                    
                    <h3 className="text-3xl md:text-4xl font-bold" style={{ color: colors.secondary }}>
                      {item.title}
                    </h3>
                    
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (item.type === 'video') {
                        handleVideoClick(item);
                      }
                    }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                      boxShadow: `0 10px 30px ${colors.primary}30`
                    }}
                  >
                    <span>{item.type === 'video' ? 'Reproducir Video' : 'Ver Detalles'}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {item.type === 'video' ? <Play className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>
            );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20 p-12 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-xl border border-white/30"
          style={{ 
            background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))`,
            boxShadow: `0 25px 50px -12px ${colors.primary}20, inset 0 1px 0 rgba(255,255,255,0.6)`
          }}
        >
          <h3 className="text-3xl font-bold mb-6" style={{ color: colors.secondary }}>
            ¿Listo para crear momentos especiales?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explora nuestra colección completa y encuentra el regalo perfecto para cada ocasión
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${colors.primary}40` }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-full text-white font-bold text-lg shadow-xl transition-all duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` 
            }}
          >
            Explorar Productos
          </motion.button>
        </motion.div>
        
        <VideoModal
          isOpen={showVideoModal}
          onClose={closeVideoModal}
          video={selectedVideo}
        />
      </div>
    </section>
  );
};

export default Gallery;