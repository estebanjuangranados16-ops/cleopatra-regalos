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
    console.log('🔍 Cargando productos...');
    
    // Intentar Firebase primero
    if (db) {
      try {
        console.log('📡 Conectando a Firebase...');
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
        
        console.log(`✅ ${products.length} productos cargados desde Firebase`);
        
        // Guardar en localStorage como caché
        if (products.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
          return products;
        }
      } catch (error) {
        console.log('⚠️ Firebase no disponible, usando almacenamiento local');
      }
    }
    
    // Usar localStorage como fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        console.log(`📱 ${products.length} productos cargados desde localStorage`);
        return products;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    // Usar productos de ejemplo como último recurso
    console.log('🎯 Usando productos de ejemplo');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackProducts));
    return fallbackProducts;
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const productData = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Intentar Firebase primero
    if (db) {
      try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), productData);
        console.log('Product added to Firebase:', docRef.id);
        return docRef.id;
      } catch (error) {
        console.log('Firebase not available, using localStorage');
      }
    }
    
    // Usar localStorage como fallback
    const products = await this.getProducts();
    const newId = Date.now().toString();
    const newProduct = { ...productData, id: newId };
    const updatedProducts = [...products, newProduct];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    return newId;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const updateData = {
      ...product,
      updatedAt: new Date().toISOString()
    };
    
    // Intentar Firebase primero
    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updateData);
        console.log('Product updated in Firebase:', id);
        return;
      } catch (error) {
        console.log('Firebase not available, using localStorage');
      }
    }
    
    // Usar localStorage como fallback
    const products = await this.getProducts();
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ...updateData } : p
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
  },

  async deleteProduct(id: string): Promise<void> {
    // Intentar Firebase primero
    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        console.log('Product deleted from Firebase:', id);
        return;
      } catch (error) {
        console.log('Firebase not available, using localStorage');
      }
    }
    
    // Usar localStorage como fallback
    const products = await this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
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