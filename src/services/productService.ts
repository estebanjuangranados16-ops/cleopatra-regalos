import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';

const COLLECTION_NAME = 'products';
const STORAGE_KEY = 'cleopatra_products';

// Productos de ejemplo para desarrollo
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Collar Dorado Elegante',
    price: 89000,
    originalPrice: 120000,
    image: '/images/placeholder.svg',
    category: 'regalos',
    description: 'Hermoso collar dorado con detalles únicos',
    stock: 15,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Auriculares Bluetooth Pro',
    price: 150000,
    originalPrice: 200000,
    image: '/images/placeholder.svg',
    category: 'tecnologia',
    description: 'Auriculares de alta calidad con cancelación de ruido',
    stock: 8,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Pulsera de Plata',
    price: 65000,
    image: '/images/placeholder.svg',
    category: 'regalos',
    description: 'Elegante pulsera de plata con grabado personalizado',
    stock: 12,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

export const productService = {
  async getProducts(): Promise<Product[]> {
    // Usar localStorage como fuente principal para desarrollo
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        console.log(`✅ ${products.length} productos cargados desde localStorage`);
        return products;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    // Intentar Firebase solo si localStorage está vacío
    if (db) {
      try {
        let q;
        try {
          q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        } catch {
          q = collection(db, COLLECTION_NAME);
        }
        
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        if (products.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
          console.log(`✅ ${products.length} productos cargados desde Firebase`);
          return products;
        }
      } catch (error) {
        console.log('Firebase no disponible, usando datos locales');
      }
    }
    
    // Usar localStorage como fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        // Products loaded from localStorage
        return products;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    // Usar productos de ejemplo como último recurso
    // Using fallback products
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProducts));
    return fallbackProducts;
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const productData = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Usar localStorage como fuente principal
    const products = await this.getProducts();
    const newId = Date.now().toString();
    const newProduct = { ...productData, id: newId };
    const updatedProducts = [...products, newProduct];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      console.log(`✅ Producto agregado: ${newProduct.name}`);
      return newId;
    } catch (error) {
      console.error('Error saving product:', error);
      throw new Error('No se pudo guardar el producto');
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const updateData = {
      ...product,
      updatedAt: new Date().toISOString()
    };
    
    const products = await this.getProducts();
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ...updateData } : p
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    console.log(`✅ Producto actualizado: ${id}`);
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
    console.log(`✅ Producto eliminado: ${id}`);
  },

  async testConnection(): Promise<boolean> {
    if (!db) return false;
    
    try {
      const testCollection = collection(db, COLLECTION_NAME);
      await getDocs(testCollection);
      console.log('Firebase connection successful');
      return true;
    } catch (error) {
      console.error('Firebase connection failed:', error);
      return false;
    }
  }
};