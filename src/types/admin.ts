export interface AdminProduct {
  id: string | number;
  name: string;
  price: string;
  image?: string;
  images?: string[];
  category: 'gifts' | 'tech';
  description: string;
  createdAt?: string;
}

export interface SimpleProduct {
  id: string;
  name: string;
  price: string;
  category: 'gifts' | 'tech';
  image?: string;
  description: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}