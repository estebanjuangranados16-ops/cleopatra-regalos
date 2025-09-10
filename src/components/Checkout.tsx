import React, { useState, useEffect } from 'react';
import { parsePrice, formatPrice } from '../utils/priceHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Truck, MapPin, Phone, Mail, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { ShippingInfo } from '../types/order';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart, addToast } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    department: '',
    zipCode: ''
  });
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        id: item.id.toString(),
        name: item.name,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[$.,]/g, '')) : item.price,
        quantity: item.quantity,
        image: item.image || '/placeholder-image.jpg'
      }));

      const shipping: ShippingInfo = {
        name: shippingData.name,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        department: shippingData.department,
        postalCode: shippingData.zipCode
      };

      const order = await orderService.createOrder(orderItems, shipping, paymentData.method as any);
      
      // Enviar por WhatsApp
      const phoneNumber = '573024547679';
      const message = encodeURIComponent(
        `🛍️ *NUEVO PEDIDO - ${order.trackingNumber}*\n\n` +
        `👤 *Cliente:* ${shipping.name}\n` +
        `📱 *Teléfono:* ${shipping.phone}\n` +
        `📍 *Dirección:* ${shipping.address}, ${shipping.city}\n\n` +
        `🛒 *Productos:*\n` +
        orderItems.map(item => `• ${item.name} x${item.quantity} - $${item.price.toLocaleString()}`).join('\n') +
        `\n\n💰 *Total:* $${order.total.toLocaleString()}\n` +
        `💳 *Pago:* ${paymentData.method === 'card' ? 'Tarjeta' : 'PSE'}\n\n` +
        `🔗 Seguimiento: CLE-${order.trackingNumber}`
      );
      
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      
      clearCart();
      addToast({
        type: 'success',
        title: '¡Pedido confirmado!',
        message: `Tu pedido ${order.trackingNumber} ha sido procesado exitosamente`
      });
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error en el pedido',
        message: 'Hubo un problema procesando tu pedido'
      });
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
    'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
    'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
    'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
    'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

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
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col modal-content shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                  Finalizar Compra
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

                {/* Steps */}
                <div className="flex items-center justify-center p-4 border-b bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        1
                      </div>
                      <span className="font-medium">Envío</span>
                    </div>
                    <div className="w-8 h-px bg-gray-300"></div>
                    <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        2
                      </div>
                      <span className="font-medium">Pago</span>
                    </div>
                    <div className="w-8 h-px bg-gray-300"></div>
                    <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                        3
                      </div>
                      <span className="font-medium">Confirmación</span>
                    </div>
                  </div>
                </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin">
                  {/* Step 1: Shipping */}
                  {step === 1 && (
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <Truck className="w-5 h-5" style={{ color: colors.primary }} />
                        <h3 className="text-xl font-semibold">Información de Envío</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="name"
                              value={shippingData.name}
                              onChange={handleShippingChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Tu nombre completo"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={shippingData.email}
                              onChange={handleShippingChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="tu@email.com"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Teléfono</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={shippingData.phone}
                              onChange={handleShippingChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="300 123 4567"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Departamento</label>
                          <select
                            name="department"
                            value={shippingData.department}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar departamento</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Ciudad</label>
                          <input
                            type="text"
                            name="city"
                            value={shippingData.city}
                            onChange={handleShippingChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tu ciudad"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Código Postal</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={shippingData.zipCode}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="110111"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Dirección Completa</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="address"
                              value={shippingData.address}
                              onChange={handleShippingChange}
                              required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Calle 123 #45-67, Apartamento 8B"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <CreditCard className="w-5 h-5" style={{ color: colors.primary }} />
                        <h3 className="text-xl font-semibold">Método de Pago</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-3">Seleccionar método</label>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentData.method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                              <input
                                type="radio"
                                name="method"
                                value="card"
                                checked={paymentData.method === 'card'}
                                onChange={handlePaymentChange}
                                className="sr-only"
                              />
                              <div className="text-center">
                                <CreditCard className="w-8 h-8 mx-auto mb-2" />
                                <span className="font-medium">Tarjeta</span>
                              </div>
                            </label>
                            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentData.method === 'pse' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                              <input
                                type="radio"
                                name="method"
                                value="pse"
                                checked={paymentData.method === 'pse'}
                                onChange={handlePaymentChange}
                                className="sr-only"
                              />
                              <div className="text-center">
                                <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">PSE</div>
                                <span className="font-medium">PSE</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        {paymentData.method === 'card' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Número de Tarjeta</label>
                              <input
                                type="text"
                                name="cardNumber"
                                value={paymentData.cardNumber}
                                onChange={handlePaymentChange}
                                required
                                maxLength={19}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Fecha de Vencimiento</label>
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={paymentData.expiryDate}
                                  onChange={handlePaymentChange}
                                  required
                                  maxLength={5}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="MM/YY"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">CVV</label>
                                <input
                                  type="text"
                                  name="cvv"
                                  value={paymentData.cvv}
                                  onChange={handlePaymentChange}
                                  required
                                  maxLength={4}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="123"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Nombre en la Tarjeta</label>
                              <input
                                type="text"
                                name="cardName"
                                value={paymentData.cardName}
                                onChange={handlePaymentChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nombre como aparece en la tarjeta"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 3 && (
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-6">Resumen del Pedido</h3>
                      
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Productos ({cart.length})</h4>
                          <div className="space-y-2">
                            {cart.map((item) => (
                              <div key={item.id} className="flex justify-between">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{formatPrice(parsePrice(item.price) * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Envío</h4>
                          <p>{shippingData.name}</p>
                          <p>{shippingData.address}</p>
                          <p>{shippingData.city}, {shippingData.department}</p>
                          <p>{shippingData.phone}</p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span style={{ color: colors.primary }}>{formatPrice(getCartTotal())}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="border-t p-6 bg-gray-50">
                <div className="flex justify-between">
                  <button
                    onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {step === 1 ? 'Cancelar' : 'Anterior'}
                  </button>
                  
                  {step < 3 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={step === 1 && (!shippingData.name || !shippingData.email || !shippingData.phone || !shippingData.address)}
                      className="px-8 py-3 text-white rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                      <span>{loading ? 'Procesando...' : 'Confirmar Pedido'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Checkout;