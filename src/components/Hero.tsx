import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { testimonials } from '../utils/constants';

const Hero: React.FC = () => {
  const { theme, colors } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentMedia, setCurrentMedia] = useState(0);
  
  // Media content for carousel
  const mediaContent = {
    gifts: [
      {
        type: 'image',
        src: '/assets/brand/hero/gifts/flores1.png',
        alt: 'Hermosas flores y arreglos florales'
      },
      {
        type: 'image', 
        src: '/assets/brand/hero/gifts/regalos1.png',
        alt: 'Regalos especiales Cleopatra'
      },
      {
        type: 'image',
        src: '/assets/brand/hero/gifts/regalos2.png',
        alt: 'Detalles únicos y personalizados'
      },
      {
        type: 'image',
        src: '/assets/brand/hero/gifts/regalos4.webp',
        alt: 'Colección premium de regalos'
      }
    ],
    tech: [
      {
        type: 'image',
        src: '/assets/brand/hero/tech/Cliente-con-producto.png',
        alt: 'Cliente satisfecho con productos tech'
      },
      {
        type: 'image',
        src: '/assets/brand/hero/tech/Cliente-con-producto2.png',
        alt: 'Experiencia premium en tecnología'
      },
      {
        type: 'image',
        src: '/assets/brand/hero/tech/LOCAL-1.png.jpg',
        alt: 'Nuestro local de tecnología'
      },
      {
        type: 'image',
        src: '/assets/brand/hero/tech/LOCAL-2.png',
        alt: 'Showroom de productos tecnológicos'
      },
      {
        type: 'image',
        src: '/assets/brand/hero/tech/devices-innovative.jpg',
        alt: 'Dispositivos innovadores'
      }
    ]
  };
  
  const currentMediaArray = mediaContent[theme];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const mediaTimer = setInterval(() => {
      setCurrentMedia((prev) => (prev + 1) % currentMediaArray.length);
    }, 4000);
    return () => clearInterval(mediaTimer);
  }, [currentMediaArray.length]);
  
  const nextMedia = () => {
    setCurrentMedia((prev) => (prev + 1) % currentMediaArray.length);
  };
  
  const prevMedia = () => {
    setCurrentMedia((prev) => (prev - 1 + currentMediaArray.length) % currentMediaArray.length);
  };

  const heroContent = {
    gifts: {
      title: 'Elegancia Atemporal',
      subtitle: 'Regalos únicos que expresan sofisticación',
      description: 'Descubre nuestra colección exclusiva de regalos elegantes, perfectos para ocasiones especiales y momentos únicos.'
    },
    tech: {
      title: 'Innovación Tecnológica',
      subtitle: 'El futuro en tus manos',
      description: 'Explora la última tecnología con productos innovadores que transforman tu estilo de vida digital.'
    }
  };

  const content = heroContent[theme];

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{
          background: theme === 'gifts' 
            ? 'linear-gradient(135deg, #FFD300, #FFA500, #FF8C00)'
            : 'linear-gradient(135deg, #2563EB, #1D4ED8, #1E40AF)'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              {content.title}
            </motion.h1>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-4 font-light"
            >
              {content.subtitle}
            </motion.p>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg mb-8 opacity-90 max-w-lg"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Explorar Catálogo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all"
              >
                Conocer Más
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image & Testimonials */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Media Carousel */}
              <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl shadow-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMedia}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                  >
                    {currentMediaArray[currentMedia]?.type === 'video' ? (
                      <video
                        src={currentMediaArray[currentMedia].src}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={currentMediaArray[currentMedia]?.src}
                        alt={currentMediaArray[currentMedia]?.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient background if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-bg');
                          if (fallback) {
                            (fallback as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    )}
                    
                    {/* Fallback background */}
                    <div className="fallback-bg hidden w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-6xl mb-4">{theme === 'gifts' ? '🎁' : '📱'}</div>
                        <p className="text-lg font-medium">{currentMediaArray[currentMedia]?.alt}</p>
                      </div>
                    </div>
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    
                    {/* Media info */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        {currentMediaArray[currentMedia]?.alt}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation arrows */}
                <button
                  onClick={prevMedia}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={nextMedia}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-3 right-4 flex gap-2">
                  {currentMediaArray.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMedia(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentMedia ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating Testimonial */}
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl max-w-xs"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full mr-3 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {testimonials[currentTestimonial].content}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;