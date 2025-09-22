import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, MapPin, Phone, Mail, User, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { OrderItem, ShippingInfo } from '../store/orderStore';
import SimpleNavbar from '../components/SimpleNavbar';
import WompiCheckout from '../components/WompiCheckout';

const CheckoutPage: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, addToast } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    department: '',
    zipCode: '',
    identification: {
      type: 'CC' as 'CC' | 'CE' | 'NIT' | 'PP',
      number: ''
    }
  });
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'whatsapp'>('mercadopago');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'identificationType') {
      setShippingData({
        ...shippingData,
        identification: {
          ...shippingData.identification,
          type: value as 'CC' | 'CE' | 'NIT' | 'PP'
        }
      });
    } else if (name === 'identificationNumber') {
      setShippingData({
        ...shippingData,
        identification: {
          ...shippingData.identification,
          number: value
        }
      });
    } else {
      setShippingData({
        ...shippingData,
        [name]: value
      });
    }
  };

  const getOrderItems = (): OrderItem[] => {
    return cart.map(item => ({
      id: String(item.id),
      name: item.name,
      price: parseFloat(item.price.toString().replace(/[$.,]/g, '')),
      quantity: item.quantity,
      image: item.image || '',
      category: item.category || 'general'
    }));
  };

  const handleMercadoPagoSuccess = (orderId: string) => {
    clearCart();
    addToast({
      type: 'success',
      title: '¡Pago exitoso!',
      message: `Tu pedido #${orderId.slice(-6)} ha sido procesado`
    });
    navigate('/');
  };

  const handleMercadoPagoError = (error: string) => {
    addToast({
      type: 'error',
      title: 'Error en el pago',
      message: error
    });
  };

  const handleWhatsAppOrder = () => {
    const orderItems = getOrderItems();
    const total = getCartTotal();
    
    let message = `🛍️ *NUEVO PEDIDO - CLEOPATRA REGALOS*\\n\\n`;
    message += `👤 *Cliente:* ${shippingData.fullName}\\n`;
    message += `📧 *Email:* ${shippingData.email}\\n`;
    message += `📱 *Teléfono:* ${shippingData.phone}\\n`;
    message += `📍 *Dirección:* ${shippingData.address}, ${shippingData.city}, ${shippingData.department}\\n\\n`;
    
    message += `🛒 *PRODUCTOS:*\\n`;
    orderItems.forEach(item => {
      message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\\n`;
    });
    
    message += `\\n💰 *TOTAL: ${formatPrice(total)}*\\n\\n`;
    message += `💳 *Método de pago:* Pago contra entrega\\n`;
    message += `📅 *Fecha:* ${new Date().toLocaleDateString('es-CO')}\\n\\n`;
    message += `¡Gracias por tu preferencia! 👑`;
    
    const whatsappUrl = `https://wa.me/57${process.env.REACT_APP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    clearCart();
    addToast({
      type: 'success',
      title: '¡Pedido enviado!',
      message: 'Tu pedido ha sido enviado por WhatsApp'
    });
    navigate('/');
  };

  const departments = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
    'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare',
    'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
    'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
    'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleNavbar />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
              No hay productos en el carrito
            </h1>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.primary }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Ir a comprar
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al carrito
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
              Finalizar Compra
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Steps */}
            <div className="flex items-center justify-center p-6 border-b bg-gray-50">
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

            <div className="p-8">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div>
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
                          name="fullName"
                          value={shippingData.fullName}
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
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Tipo de Identificación</label>
                      <select
                        name="identificationType"
                        value={shippingData.identification.type}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="NIT">NIT</option>
                        <option value="PP">Pasaporte</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de Identificación</label>
                      <input
                        type="text"
                        name="identificationNumber"
                        value={shippingData.identification.number}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Número de documento"
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
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <CreditCard className="w-5 h-5" style={{ color: colors.primary }} />
                    <h3 className="text-xl font-semibold">Método de Pago</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">Seleccionar método de pago</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentMethod('mercadopago')}
                          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                            paymentMethod === 'mercadopago'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600">
                              <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">Wompi</div>
                              <div className="text-sm text-gray-500">Tarjetas, Nequi, PSE</div>
                              <div className="text-xs text-green-600 font-medium">Pago seguro online</div>
                            </div>
                          </div>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentMethod('whatsapp')}
                          className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                            paymentMethod === 'whatsapp'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600">
                              <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">WhatsApp</div>
                              <div className="text-sm text-gray-500">Pago contra entrega</div>
                              <div className="text-xs text-blue-600 font-medium">Coordinación directa</div>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </div>

                    {paymentMethod === 'mercadopago' && (
                      <WompiCheckout
                        items={getOrderItems()}
                        shippingInfo={shippingData as ShippingInfo}
                        onSuccess={handleMercadoPagoSuccess}
                        onError={handleMercadoPagoError}
                      />
                    )}

                    {paymentMethod === 'whatsapp' && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-start space-x-3">
                          <MessageCircle className="w-6 h-6 text-green-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">Pago por WhatsApp</h4>
                            <p className="text-green-700 text-sm mb-3">
                              Tu pedido será enviado por WhatsApp para coordinar la entrega y el pago.
                              Puedes pagar contra entrega o coordinar otro método de pago directamente.
                            </p>
                            <div className="text-xs text-green-600">
                              ✓ Sin comisiones adicionales<br/>
                              ✓ Pago contra entrega disponible<br/>
                              ✓ Atención personalizada
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Resumen del Pedido</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Productos ({cart.length})</h4>
                      <div className="space-y-2">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{formatPrice(parseFloat(item.price.toString().replace(/[$.,]/g, '')) * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Envío</h4>
                      <p>{shippingData.fullName}</p>
                      <p>{shippingData.address}</p>
                      <p>{shippingData.city}, {shippingData.department}</p>
                      <p>{shippingData.phone}</p>
                      <p className="text-sm text-gray-600">
                        {shippingData.identification.type}: {shippingData.identification.number}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Método de Pago</h4>
                      <p className="capitalize">
                        {paymentMethod === 'mercadopago' ? 'Wompi (Tarjetas, Nequi, PSE)' : 'WhatsApp (Pago contra entrega)'}
                      </p>
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
                  onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {step === 1 ? 'Volver al carrito' : 'Anterior'}
                </button>
                
                {step < 3 ? (
                  <button
                    onClick={() => {
                      if (step === 2 && paymentMethod === 'whatsapp') {
                        setStep(3);
                      } else if (step === 1) {
                        if (shippingData.fullName && shippingData.email && shippingData.phone && shippingData.address && shippingData.identification.number) {
                          setStep(step + 1);
                        }
                      } else {
                        setStep(step + 1);
                      }
                    }}
                    disabled={step === 1 && (!shippingData.fullName || !shippingData.email || !shippingData.phone || !shippingData.address || !shippingData.identification.number)}
                    className="px-8 py-3 text-white rounded-lg transition-colors disabled:opacity-50"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {step === 2 && paymentMethod === 'mercadopago' ? 'Revisar Pedido' : 'Siguiente'}
                  </button>
                ) : (
                  <button
                    onClick={paymentMethod === 'whatsapp' ? handleWhatsAppOrder : () => {}}
                    disabled={loading}
                    className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    <span>
                      {loading 
                        ? 'Procesando...' 
                        : paymentMethod === 'whatsapp' 
                          ? 'Enviar por WhatsApp' 
                          : 'Confirmar Pedido'
                      }
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;