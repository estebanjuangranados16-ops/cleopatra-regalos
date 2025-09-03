import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, MapPin, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const About: React.FC = () => {
  const { theme, colors } = useTheme();
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

  const stats = [
    { icon: Users, value: '5000+', label: 'Clientes Satisfechos' },
    { icon: Award, value: '15+', label: 'Años de Experiencia' },
    { icon: MapPin, value: '3', label: 'Ubicaciones' },
    { icon: Clock, value: '24/7', label: 'Atención al Cliente' }
  ];

  const aboutContent = {
    gifts: {
      title: 'Elegancia que Perdura',
      description: 'Desde 2008, Cleopatra Regalos ha sido sinónimo de elegancia y sofisticación en Madrid, Cundinamarca. Nos especializamos en crear experiencias únicas a través de regalos cuidadosamente seleccionados.'
    },
    tech: {
      title: 'Innovación Tecnológica',
      description: 'Pioneros en tecnología desde 2008, ofrecemos las últimas innovaciones para transformar tu vida digital. Nuestra pasión por la tecnología nos impulsa a estar siempre a la vanguardia.'
    }
  };

  const content = aboutContent[theme];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isIntersecting ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: colors.secondary }}
            >
              {content.title}
            </motion.h2>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              {content.description}
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isIntersecting ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: colors.primaryLight }}
                  >
                    <stat.icon 
                      className="w-6 h-6" 
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isIntersecting ? { scale: 1 } : {}}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5, type: 'spring' }}
                    className="text-2xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isIntersecting ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">{theme === 'gifts' ? '🏆' : '🚀'}</div>
                  <p className="text-lg font-medium">Sobre Nosotros</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isIntersecting ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
              style={{ backgroundColor: colors.primary }}
            >
              <Award className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={isIntersecting ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 1.4, duration: 0.8, type: 'spring' }}
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl"
            >
              <div className="text-center">
                <div 
                  className="text-lg font-bold"
                  style={{ color: colors.primary }}
                >
                  15+
                </div>
                <div className="text-xs text-gray-600">Años</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;