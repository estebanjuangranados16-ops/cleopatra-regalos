export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'transfer' | 'card';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

export type OrderStatus = Order['status'];