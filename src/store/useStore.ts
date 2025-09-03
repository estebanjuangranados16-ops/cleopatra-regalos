import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';
import { ToastType } from '../components/Toast';

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Favorites
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string | number) => void;
  isFavorite: (productId: string | number) => boolean;

  // Filters
  searchTerm: string;
  selectedCategory: 'all' | 'gifts' | 'tech';
  priceRange: [number, number];
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: 'all' | 'gifts' | 'tech') => void;
  setPriceRange: (range: [number, number]) => void;

  // Modal
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Toasts
  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;

  // Admin
  products: Product[];
  loading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>()(persist((set, get) => ({
  // Cart
  cart: [],
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.id === product.id);
    
    // Add toast notification
    const toast = {
      type: 'success' as const,
      title: 'Producto agregado',
      message: `${product.name} se agregó al carrito`,
      icon: 'cart' as const
    };
    
    setTimeout(() => {
      get().addToast(toast);
    }, 100);
    
    if (existingItem) {
      return {
        cart: state.cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: quantity <= 0
      ? state.cart.filter(item => item.id !== productId)
      : state.cart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
  })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },
  getCartItemsCount: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Favorites
  favorites: [],
  addToFavorites: (product) => set((state) => {
    // Add toast notification
    const toast = {
      type: 'success' as const,
      title: 'Agregado a favoritos',
      message: `${product.name} se agregó a tus favoritos`,
      icon: 'heart' as const
    };
    
    setTimeout(() => {
      get().addToast(toast);
    }, 100);
    
    return { favorites: [...state.favorites, product] };
  }),
  removeFromFavorites: (productId) => set((state) => {
    const product = state.favorites.find(item => item.id === productId);
    
    if (product) {
      const toast = {
        type: 'info' as const,
        title: 'Removido de favoritos',
        message: `${product.name} se removió de favoritos`,
        icon: 'heart' as const
      };
      
      setTimeout(() => {
        get().addToast(toast);
      }, 100);
    }
    
    return { favorites: state.favorites.filter(item => item.id !== productId) };
  }),
  isFavorite: (productId) => {
    const { favorites } = get();
    return favorites.some(item => item.id === productId);
  },

  // Filters
  searchTerm: '',
  selectedCategory: 'all',
  priceRange: [0, 3000000],
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setPriceRange: (range) => set({ priceRange: range }),

  // Modal
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  // Admin
  products: [],
  loading: false,
  loadProducts: async () => {
    set({ loading: true });
    try {
      const { productService } = await import('../services/productService');
      const products = await productService.getProducts();
      set({ products, loading: false });
    } catch (error) {
      console.error('Error loading products:', error);
      set({ loading: false });
    }
  },
  addProduct: async (product) => {
    try {
      const { productService } = await import('../services/productService');
      await productService.addProduct(product);
      get().loadProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  },
  updateProduct: async (id, product) => {
    try {
      const { productService } = await import('../services/productService');
      await productService.updateProduct(id, product);
      get().loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },
  deleteProduct: async (id) => {
    try {
      const { productService } = await import('../services/productService');
      await productService.deleteProduct(id);
      get().loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  },
}), {
  name: 'cleopatra-store',
  partialize: (state) => ({
    cart: state.cart,
    favorites: state.favorites,
  }),
}));