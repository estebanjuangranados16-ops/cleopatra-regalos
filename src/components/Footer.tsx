import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme, colors } = useTheme();

  const footerLinks = {
    company: [
      { name: 'Sobre Nosotros', href: '#about' },
      { name: 'Productos', href: '#products' },
      { name: 'Servicios', href: '#services' },
      { name: 'Contacto', href: '#contact' }
    ],
    support: [
      { name: 'Centro de Ayuda', href: '#' },
      { name: 'Garantías', href: '#' },
      { name: 'Devoluciones', href: '#' },
      { name: 'Envíos', href: '#' }
    ],
    legal: [
      { name: 'Términos y Condiciones', href: '#' },
      { name: 'Política de Privacidad', href: '#' },
      { name: 'Cookies', href: '#' },
      { name: 'PQRS', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Mail, href: 'mailto:info@cleopatraregalos.com', name: 'Email' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Crown className="w-8 h-8" style={{ color: colors.primary }} />
              <span className="text-2xl font-bold">Cleopatra</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Elegancia y tecnología se encuentran en Cleopatra Regalos. 
              Más de 15 años creando experiencias únicas en Madrid, Cundinamarca.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-gray-400">+57 (1) 234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-gray-400">info@cleopatraregalos.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-gray-400">Madrid, Cundinamarca, Colombia</span>
              </div>
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6" style={{ color: colors.primary }}>
              Empresa
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5, color: colors.primary }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-6" style={{ color: colors.primary }}>
              Soporte
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5, color: colors.primary }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-6" style={{ color: colors.primary }}>
              Legal
            </h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5, color: colors.primary }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-gray-300">Síguenos</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: colors.primaryLight }}
                  >
                    <social.icon className="w-5 h-5" style={{ color: colors.primary }} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="border-t border-gray-800 pt-8 mt-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
              Mantente Actualizado
            </h3>
            <p className="text-gray-400 mb-6">
              Suscríbete para recibir ofertas exclusivas y novedades
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  alert('¡Gracias por suscribirte!');
                  (e.target as HTMLFormElement).reset();
                } else {
                  alert('Por favor ingresa un email válido');
                }
              }}
              className="flex max-w-md mx-auto"
            >
              <input
                name="email"
                type="email"
                placeholder="Tu email"
                required
                className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-r-lg text-white font-semibold"
                style={{ backgroundColor: colors.primary }}
              >
                Suscribirse
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 Cleopatra Regalos. Todos los derechos reservados. 
              Hecho con ❤️ en Madrid, Cundinamarca.
            </p>
            
            {/* Admin Button */}
            <motion.button
              onClick={() => window.location.href = '/admin'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;