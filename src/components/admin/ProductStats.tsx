import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, ShoppingCart, Star, Calendar, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string | number;
  category: 'gifts' | 'tech';
  image: string;
  description: string;
  createdAt?: string;
}

interface ProductStatsProps {
  products: Product[];
}

const ProductStats: React.FC<ProductStatsProps> = ({ products }) => {
  const totalProducts = products.length;
  const techProducts = products.filter(p => p.category === 'tech').length;
  const giftProducts = products.filter(p => p.category === 'gifts').length;
  
  // Calcular valor total del inventario
  const totalValue = products.reduce((sum, product) => {
    let price = 0;
    if (typeof product.price === 'string') {
      price = parseFloat(product.price.replace(/[$.,]/g, ''));
    } else if (typeof product.price === 'number') {
      price = product.price;
    }
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  // Productos recientes (últimos 7 días)
  const recentProducts = products.filter(product => {
    if (!product.createdAt) return false;
    const productDate = new Date(product.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return productDate > weekAgo;
  }).length;

  const stats = [
    {
      title: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Tecnología',
      value: techProducts,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Regalos',
      value: giftProducts,
      icon: Star,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Valor Total',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Agregados (7 días)',
      value: recentProducts,
      icon: Calendar,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Promedio Precio',
      value: totalProducts > 0 ? `$${Math.round(totalValue / totalProducts).toLocaleString()}` : '$0',
      icon: TrendingUp,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ];

  const getTopProducts = () => {
    return products
      .sort((a, b) => {
        let priceA = 0;
        let priceB = 0;
        
        if (typeof a.price === 'string') {
          priceA = parseFloat(a.price.replace(/[$.,]/g, ''));
        } else if (typeof a.price === 'number') {
          priceA = a.price;
        }
        
        if (typeof b.price === 'string') {
          priceB = parseFloat(b.price.replace(/[$.,]/g, ''));
        } else if (typeof b.price === 'number') {
          priceB = b.price;
        }
        
        return priceB - priceA;
      })
      .slice(0, 5);
  };

  const getRecentProducts = () => {
    return products
      .filter(p => p.createdAt)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución por Categoría</h3>
          
          {totalProducts > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Tecnología</span>
                </div>
                <span className="text-sm text-gray-600">{techProducts} ({Math.round((techProducts / totalProducts) * 100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(techProducts / totalProducts) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Regalos</span>
                </div>
                <span className="text-sm text-gray-600">{giftProducts} ({Math.round((giftProducts / totalProducts) * 100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(giftProducts / totalProducts) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay productos para mostrar</p>
            </div>
          )}
        </motion.div>

        {/* Top Products by Price */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Productos Más Caros</h3>
          
          {totalProducts > 0 ? (
            <div className="space-y-4">
              {getTopProducts().map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{product.category === 'tech' ? 'Tecnología' : 'Regalos'}</p>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    {typeof product.price === 'string' ? product.price : `$${product.price.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay productos para mostrar</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Productos Recientes</h3>
        
        {getRecentProducts().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecentProducts().map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold">
                    {typeof product.price === 'string' ? product.price : `$${product.price.toLocaleString()}`}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {product.category === 'tech' ? 'Tecnología' : 'Regalos'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay productos recientes</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductStats;