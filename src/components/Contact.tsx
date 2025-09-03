import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Contact: React.FC = () => {
  const { theme, colors } = useTheme();
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+57 (1) 234-5678',
      description: 'Lun - Sáb: 9:00 AM - 7:00 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@cleopatraregalos.com',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      value: 'Madrid, Cundinamarca',
      description: 'Colombia'
    },
    {
      icon: Clock,
      title: 'Horarios',
      value: '9:00 AM - 7:00 PM',
      description: 'Lunes a Sábado'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: colors.secondary }}
          >
            Contáctanos
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Estamos aquí para ayudarte. Ponte en contacto con nosotros
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={isIntersecting ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ y: 50, opacity: 0 }}
                  animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gray-50 rounded-xl p-6 text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: colors.primaryLight }}
                  >
                    <info.icon className="w-6 h-6" style={{ color: colors.primary }} />
                  </motion.div>
                  <h3 className="font-bold mb-2" style={{ color: colors.secondary }}>
                    {info.title}
                  </h3>
                  <p className="font-semibold mb-1" style={{ color: colors.primary }}>
                    {info.value}
                  </p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-gray-200 rounded-xl h-64 flex items-center justify-center"
            >
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <p className="text-gray-600">Mapa de ubicación</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={isIntersecting ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.secondary }}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Tu nombre completo"
                />
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.secondary }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.secondary }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+57 (1) 234-5678"
                />
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.secondary }}>
                  Mensaje
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                />
              </motion.div>

              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={isIntersecting ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                style={{ backgroundColor: colors.primary }}
              >
                <Send className="w-5 h-5" />
                <span>Enviar Mensaje</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;