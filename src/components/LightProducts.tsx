import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import { products } from '../utils/constants';
import { formatPrice } from '../utils/priceHelpers';

const LightProducts: React.FC = () => {
  const { colors } = useTheme();
  const { addToCart } = useStore();
  const navigate = useNavigate();



  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6" style={{ color: colors.secondary }}>
            Nuestros Productos
          </h2>
          <p className="text-xl text-gray-600">
            Descubre nuestra selección de productos premium
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  {index === 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      HOT
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.secondary }}>
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {formatPrice(product.price)}
                    </span>
                    <div className="text-sm text-gray-500">Envío gratis</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Agregar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            Ver Todos los Productos
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LightProducts;