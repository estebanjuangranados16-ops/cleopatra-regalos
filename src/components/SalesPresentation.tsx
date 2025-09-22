import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  Smartphone, 
  Shield, 
  Zap, 
  TrendingUp,
  CheckCircle,
  Star,
  Users,
  Clock,
  Award
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
  bgColor: string;
}

const SalesPresentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    // Slide 1: Portada
    {
      id: 1,
      title: "Cleopatra Regalos - E-commerce Premium",
      bgColor: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
      content: (
        <div className="text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="text-8xl mb-4">👑</div>
            <h1 className="text-6xl font-bold mb-4">Cleopatra Regalos</h1>
            <p className="text-2xl opacity-90">E-commerce de Nueva Generación</p>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto"
          >
            <p className="text-xl font-semibold">Desarrollado por:</p>
            <p className="text-lg">Desarrollador Full Stack Junior</p>
            <p className="text-sm opacity-80">4 años de experiencia • Técnico y Tecnólogo ADSO</p>
          </motion.div>
        </div>
      )
    },

    // Slide 2: El Problema
    {
      id: 2,
      title: "El Problema Actual",
      bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
      content: (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">¿Qué está pasando ahora?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4">📱 Sin Presencia Digital</h3>
                <p className="text-lg">Solo WhatsApp y redes sociales básicas</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4">💸 Ventas Limitadas</h3>
                <p className="text-lg">Dependencia total de contacto directo</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4">⏰ Horarios Restringidos</h3>
                <p className="text-lg">Solo vendes cuando estás disponible</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-4">📊 Sin Datos</h3>
                <p className="text-lg">No sabes qué productos funcionan mejor</p>
              </div>
            </motion.div>
          </div>
        </div>
      )
    },

    // Slide 3: La Solución
    {
      id: 3,
      title: "Nuestra Solución",
      bgColor: "bg-gradient-to-br from-green-500 to-blue-600",
      content: (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">E-commerce Completo + PWA</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <Smartphone className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">PWA Móvil</h3>
              <p>App instalable que funciona offline</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <DollarSign className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Pagos Reales</h3>
              <p>Nequi, PSE, Tarjetas con Wompi</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <TrendingUp className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p>Datos reales de ventas y clientes</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="bg-yellow-400 text-black rounded-2xl p-6 inline-block">
              <p className="text-2xl font-bold">Vende 24/7 sin estar presente</p>
            </div>
          </motion.div>
        </div>
      )
    },

    // Slide 4: Funcionalidades
    {
      id: 4,
      title: "Funcionalidades Incluidas",
      bgColor: "bg-gradient-to-br from-purple-600 to-blue-800",
      content: (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">¿Qué Incluye?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Catálogo de productos ilimitado</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Carrito de compras persistente</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Sistema de favoritos</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Búsqueda y filtros avanzados</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Gestión de inventario automática</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Panel de administración completo</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Pagos con Nequi, PSE, Tarjetas</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Notificaciones por email</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">App móvil instalable (PWA)</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">60+ animaciones profesionales</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">SEO optimizado para Google</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">Google Analytics integrado</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Precio y Valor
    {
      id: 5,
      title: "Inversión y ROI",
      bgColor: "bg-gradient-to-br from-green-600 to-teal-700",
      content: (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">Inversión Inteligente</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8"
            >
              <h3 className="text-3xl font-bold mb-6 text-center">Nuestra Propuesta</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-yellow-300">$2,800,000</div>
                <p className="text-lg opacity-80">Pago único</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Desarrollo completo</span>
                  <span>✅</span>
                </div>
                <div className="flex justify-between">
                  <span>3 meses soporte</span>
                  <span>✅</span>
                </div>
                <div className="flex justify-between">
                  <span>Código fuente</span>
                  <span>✅</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacitación</span>
                  <span>✅</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8"
            >
              <h3 className="text-3xl font-bold mb-6 text-center">Competencia</h3>
              <div className="space-y-4">
                <div className="border-b border-white/20 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Shopify</span>
                    <span className="text-red-300">$290k/mes</span>
                  </div>
                  <p className="text-sm opacity-70">+ Comisiones + Limitaciones</p>
                </div>
                <div className="border-b border-white/20 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Agencia Premium</span>
                    <span className="text-red-300">$4-6M</span>
                  </div>
                  <p className="text-sm opacity-70">+ Mantenimiento mensual</p>
                </div>
                <div className="bg-green-500/30 rounded-lg p-4 mt-4">
                  <p className="text-center font-bold">Ahorras $2.6M al año</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )
    },

    // Slide 6: Tecnología
    {
      id: 6,
      title: "Stack Tecnológico",
      bgColor: "bg-gradient-to-br from-blue-600 to-purple-700",
      content: (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">Tecnología de Vanguardia</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-bold mb-2">React 18</h3>
              <p className="text-sm">Framework moderno y escalable</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4">🔷</div>
              <h3 className="text-xl font-bold mb-2">TypeScript</h3>
              <p className="text-sm">Código más seguro y mantenible</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={ { y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Tailwind CSS</h3>
              <p className="text-sm">Diseño responsive y moderno</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">PWA</h3>
              <p className="text-sm">App nativa en el navegador</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Wompi API</h3>
              <p className="text-sm">Pagos seguros y confiables</p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-sm">Métricas y datos en tiempo real</p>
            </motion.div>
          </div>
        </div>
      )
    },

    // Slide 7: Cronograma
    {
      id: 7,
      title: "Plan de Implementación",
      bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
      content: (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">Entrega en 4 Semanas</h2>
          
          <div className="space-y-6">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-6"
            >
              <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">1</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1">
                <h3 className="text-xl font-bold">Semana 1: Setup Inicial</h3>
                <p>Hosting, dominio, SSL, configuración base</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-6"
            >
              <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">2</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1">
                <h3 className="text-xl font-bold">Semana 2: Pagos y Funcionalidades</h3>
                <p>Wompi, carrito, checkout, autenticación</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-6"
            >
              <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">3</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1">
                <h3 className="text-xl font-bold">Semana 3: Contenido y Productos</h3>
                <p>Migración de productos, imágenes, configuración</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-6"
            >
              <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">4</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1">
                <h3 className="text-xl font-bold">Semana 4: Lanzamiento</h3>
                <p>Pruebas finales, capacitación, go live</p>
              </div>
            </motion.div>
          </div>
        </div>
      )
    },

    // Slide 8: Garantías
    {
      id: 8,
      title: "Garantías y Soporte",
      bgColor: "bg-gradient-to-br from-teal-600 to-green-700",
      content: (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">Respaldo Total</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center"
            >
              <Shield className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Garantías</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>3 meses soporte gratuito</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Garantía de funcionamiento 1 año</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Código fuente entregado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>3 rondas de revisiones</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center"
            >
              <Users className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Soporte</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>WhatsApp directo conmigo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Capacitación personalizada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Videos tutoriales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Documentación completa</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )
    },

    // Slide 9: Call to Action
    {
      id: 9,
      title: "¡Empecemos Hoy!",
      bgColor: "bg-gradient-to-br from-purple-600 via-pink-600 to-red-600",
      content: (
        <div className="text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-8">¿Listo para Crecer?</h2>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto mb-8">
              <h3 className="text-3xl font-bold mb-6">Próximo Paso</h3>
              <p className="text-xl mb-6">Demostración en vivo de 30 minutos</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">30 minutos</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Demo en vivo</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Sin compromiso</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-yellow-400 text-black rounded-2xl p-6 inline-block">
                <p className="text-2xl font-bold">¡Primera venta = Precio especial!</p>
                <p className="text-lg">$2.8M en lugar de $4-6M de mercado</p>
              </div>
              
              <div className="text-xl">
                <p className="mb-2">📱 WhatsApp: [Tu número]</p>
                <p className="mb-2">📧 Email: [Tu email]</p>
                <p>💼 LinkedIn: [Tu perfil]</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`${slides[currentSlide].bgColor} min-h-screen flex flex-col`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 bg-black/20">
            <h1 className="text-white text-2xl font-bold">{slides[currentSlide].title}</h1>
            <div className="text-white text-lg">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-6xl">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 bg-black/20">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            {/* Dots */}
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Keyboard navigation */}
      <div className="fixed bottom-4 right-4 text-white/60 text-sm">
        Usa ← → para navegar
      </div>
    </div>
  );
};

export default SalesPresentation;