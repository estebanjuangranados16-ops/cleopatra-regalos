import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { cart, getCartTotal, clearCart } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Shipping
    address: '',
    city: '',
    postalCode: '',
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process order
      alert('¡Pedido procesado exitosamente!');
      clearCart();
      onClose();
      setStep(1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const steps = [
    { number: 1, title: 'Información Personal', icon: User },
    { number: 2, title: 'Dirección de Envío', icon: MapPin },
    { number: 3, title: 'Método de Pago', icon: CreditCard }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-4 bg-white rounded-2xl z-[9999] flex flex-col max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
                Finalizar Compra
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-3 gap-8 p-6">
                {/* Steps and Form */}
                <div className="lg:col-span-2">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {steps.map((stepItem, index) => (
                      <div key={stepItem.number} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          step >= stepItem.number ? 'text-white' : 'text-gray-400 bg-gray-200'
                        }`} style={{ backgroundColor: step >= stepItem.number ? colors.primary : undefined }}>
                          <stepItem.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{stepItem.title}</p>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-16 h-0.5 mx-4 ${
                            step > stepItem.number ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="Nombre"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Apellido"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Correo electrónico"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Teléfono"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Dirección de Envío</h3>
                        <input
                          type="text"
                          name="address"
                          placeholder="Dirección completa"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="city"
                            placeholder="Ciudad"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            name="postalCode"
                            placeholder="Código postal"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Nombre en la tarjeta"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Número de tarjeta"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/AA"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Anterior
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-lg text-white font-semibold ml-auto"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {step === 3 ? 'Finalizar Compra' : 'Siguiente'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span style={{ color: colors.primary }}>{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
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