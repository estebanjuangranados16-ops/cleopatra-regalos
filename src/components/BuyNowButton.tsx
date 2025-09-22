import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import { Product } from '../types';

interface BuyNowButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ 
  product, 
  className = '', 
  size = 'md' 
}) => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { addToCart, clearCart } = useStore();

  const handleBuyNow = () => {
    // Limpiar carrito y agregar solo este producto
    clearCart();
    addToCart(product);
    
    // Ir directamente al checkout
    navigate('/checkout');
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleBuyNow}
      className={`
        ${sizeClasses[size]}
        rounded-lg font-semibold text-white
        transition-all duration-200
        flex items-center justify-center space-x-2
        shadow-lg hover:shadow-xl
        ${className}
      `}
      style={{ 
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` 
      }}
    >
      <Zap className="w-5 h-5" />
      <span>Comprar Ahora</span>
    </motion.button>
  );
};

export default BuyNowButton;