import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Truck, Heart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const HowItWorks: React.FC = () => {
  const { theme, colors } = useTheme();
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  const steps = [
    {
      icon: Search,
      title: 'Explora',
      description: 'Navega por nuestra cuidada selección de productos'
    },
    {
      icon: ShoppingCart,
      title: 'Selecciona',
      description: 'Elige el producto perfecto para tu ocasión especial'
    },
    {
      icon: Truck,
      title: 'Recibe',
      description: 'Entrega rápida y segura en tu ubicación'
    },
    {
      icon: Heart,
      title: 'Disfruta',
      description: 'Experimenta la satisfacción de la calidad premium'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.secondary }}
          >
            ¿Cómo Funciona?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Un proceso simple y elegante para encontrar exactamente lo que buscas
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ y: 50, opacity: 0 }}
              animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4 + index * 0.2, duration: 0.8 }}
              className="relative text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative mb-6"
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isIntersecting ? { scale: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: colors.accent }}
                >
                  {index + 1}
                </motion.div>
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                className="text-xl font-bold mb-3"
                style={{ color: colors.secondary }}
              >
                {step.title}
              </motion.h3>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                className="text-gray-600"
              >
                {step.description}
              </motion.p>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isIntersecting ? { scaleX: 1 } : {}}
                  transition={{ delay: 1.2 + index * 0.2, duration: 0.8 }}
                  className="hidden lg:block absolute top-10 left-full w-full h-0.5 origin-left"
                  style={{ backgroundColor: colors.primaryLight }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;