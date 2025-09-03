import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { features } from '../utils/constants';

const Features: React.FC = () => {
  const { theme, colors } = useTheme();
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  const iconMap = {
    Shield,
    Truck,
    Clock,
    Star
  };

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
            ¿Por Qué Elegirnos?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Ventajas que nos distinguen en el mercado
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            
            return (
              <motion.div
                key={feature.id}
                initial={{ y: 50, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative mb-6"
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow"
                    style={{ backgroundColor: colors.primaryLight }}
                  >
                    <IconComponent 
                      className="w-10 h-10" 
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isIntersecting ? { scale: 1 } : {}}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5, type: 'spring' }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                  />
                </motion.div>

                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.secondary }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                  className="text-gray-600"
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-block p-8 rounded-2xl shadow-xl"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Únete a miles de clientes satisfechos que confían en nosotros
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: colors.primary }}
            >
              Explorar Productos
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;