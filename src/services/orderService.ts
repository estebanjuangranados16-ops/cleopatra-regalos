import { Order, OrderItem, ShippingInfo } from '../types/order';

class OrderService {
  private orders: Order[] = [];

  async createOrder(items: OrderItem[], shipping: ShippingInfo, paymentMethod: Order['paymentMethod']): Promise<Order> {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order: Order = {
      id: Date.now().toString(),
      userId: 'current-user',
      items,
      shipping,
      total,
      status: 'pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber: this.generateTrackingNumber()
    };

    this.orders.push(order);
    this.saveToStorage();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    this.loadFromStorage();
    return this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrder(id: string): Promise<Order | null> {
    this.loadFromStorage();
    return this.orders.find(order => order.id === id) || null;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    this.loadFromStorage();
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.saveToStorage();
    }
    return order || null;
  }

  private generateTrackingNumber(): string {
    return 'CLE' + Date.now().toString().slice(-8);
  }

  private saveToStorage(): void {
    localStorage.setItem('cleopatra_orders', JSON.stringify(this.orders));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('cleopatra_orders');
    if (stored) {
      this.orders = JSON.parse(stored);
    }
  }
}

export const orderService = new OrderService();