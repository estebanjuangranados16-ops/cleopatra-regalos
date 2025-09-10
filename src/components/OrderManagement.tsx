import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Clock, CheckCircle, Truck, Eye, Search, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  items: any[];
  total: number;
  shipping: any;
  payment: any;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  userId?: string;
}

interface OrderManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadOrders();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('cleopatra-orders') || '[]');
    
    if (isAdmin) {
      setOrders(savedOrders);
    } else {
      // Solo mostrar pedidos del usuario actual
      const userOrders = savedOrders.filter((order: Order) => 
        order.shipping?.email === user?.email
      );
      setOrders(userOrders);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('cleopatra-orders', JSON.stringify(updatedOrders));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shipping?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <Package className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop bg-black/50 modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-container"
          >
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col modal-content shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                  {isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por ID o nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.secondary }}>
                      No hay pedidos
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'No se encontraron pedidos con esos criterios' : 'Aún no tienes pedidos realizados'}
                    </p>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="font-semibold text-lg">Pedido #{order.id.slice(-6)}</h3>
                                <p className="text-gray-600 text-sm">{formatDate(order.date)}</p>
                              </div>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span>{getStatusText(order.status)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                                {formatPrice(order.total)}
                              </p>
                              <p className="text-gray-600 text-sm">{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">Información de Envío</h4>
                              <p className="text-sm text-gray-600">{order.shipping?.name}</p>
                              <p className="text-sm text-gray-600">{order.shipping?.address}</p>
                              <p className="text-sm text-gray-600">{order.shipping?.city}, {order.shipping?.department}</p>
                              <p className="text-sm text-gray-600">{order.shipping?.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Productos</h4>
                              <div className="space-y-1">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <p key={index} className="text-sm text-gray-600">
                                    {item.name} x{item.quantity}
                                  </p>
                                ))}
                                {order.items.length > 3 && (
                                  <p className="text-sm text-gray-500">
                                    +{order.items.length - 3} producto{order.items.length - 3 !== 1 ? 's' : ''} más
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Ver Detalles</span>
                            </button>
                            
                            {isAdmin && (
                              <div className="flex space-x-2">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    Confirmar
                                  </button>
                                )}
                                {order.status === 'confirmed' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                  >
                                    Marcar Enviado
                                  </button>
                                )}
                                {order.status === 'shipped' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                  >
                                    Marcar Entregado
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-[10002] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Pedido #{selectedOrder.id.slice(-6)}</h3>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Estado del Pedido</h4>
                        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="font-medium">{getStatusText(selectedOrder.status)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Productos</h4>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.images?.[0] || '/placeholder-image.jpg'}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Información de Envío</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p><strong>Nombre:</strong> {selectedOrder.shipping?.name}</p>
                          <p><strong>Email:</strong> {selectedOrder.shipping?.email}</p>
                          <p><strong>Teléfono:</strong> {selectedOrder.shipping?.phone}</p>
                          <p><strong>Dirección:</strong> {selectedOrder.shipping?.address}</p>
                          <p><strong>Ciudad:</strong> {selectedOrder.shipping?.city}, {selectedOrder.shipping?.department}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Información de Pago</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p><strong>Método:</strong> {selectedOrder.payment?.method === 'card' ? 'Tarjeta de Crédito' : 'PSE'}</p>
                          {selectedOrder.payment?.cardNumber && (
                            <p><strong>Tarjeta:</strong> {selectedOrder.payment.cardNumber}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span style={{ color: colors.primary }}>{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderManagement;