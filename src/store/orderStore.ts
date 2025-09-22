import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  zipCode: string;
  identification: {
    type: 'CC' | 'CE' | 'NIT' | 'PP';
    number: string;
  };
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  shippingInfo: ShippingInfo;
  paymentMethod: 'mercadopago' | 'whatsapp' | 'wompi';
  paymentStatus: PaymentStatus | 'pending_payment';
  mercadoPagoId?: string;
  preferenceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

interface OrderActions {
  createOrder: (items: OrderItem[], shippingInfo: ShippingInfo, paymentMethod: 'mercadopago' | 'whatsapp' | 'wompi') => string;
  updateOrderPayment: (orderId: string, paymentStatus: PaymentStatus, mercadoPagoId?: string) => void;
  getOrder: (orderId: string) => Order | undefined;
  setCurrentOrder: (order: Order | null) => void;
  clearOrders: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOrderStore = create<OrderState & OrderActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      // Crear nueva orden
      createOrder: (items, shippingInfo, paymentMethod) => {
        const orderId = `CLO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 100000 ? 0 : 15000; // Envío gratis por compras > $100k
        const tax = subtotal * 0.19; // IVA 19%
        const total = subtotal + shipping + tax;

        const newOrder: Order = {
          id: orderId,
          items,
          total,
          subtotal,
          shipping,
          tax,
          shippingInfo,
          paymentMethod,
          paymentStatus: 'pending_payment',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => ({
          orders: [...state.orders, newOrder],
          currentOrder: newOrder
        }));

        return orderId;
      },

      // Actualizar estado de pago
      updateOrderPayment: (orderId, paymentStatus, mercadoPagoId) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  paymentStatus,
                  mercadoPagoId,
                  updatedAt: new Date()
                }
              : order
          ),
          currentOrder: state.currentOrder?.id === orderId
            ? {
                ...state.currentOrder,
                paymentStatus,
                mercadoPagoId,
                updatedAt: new Date()
              }
            : state.currentOrder
        }));
      },

      // Obtener orden por ID
      getOrder: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },

      // Establecer orden actual
      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      // Limpiar órdenes
      clearOrders: () => {
        set({ orders: [], currentOrder: null });
      },

      // Establecer loading
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Establecer error
      setError: (error) => {
        set({ error });
      }
    }),
    {
      name: 'cleopatra-orders',
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder
      })
    }
  )
);