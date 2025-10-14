import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { sanitizeForLog } from '../utils/security';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  badge: string;
  isInstagramPost?: boolean;
  createdAt: string;
}

const COLLECTION_NAME = 'gallery';
const STORAGE_KEY = 'cleopatra_gallery_items';

// Items de ejemplo para desarrollo
const fallbackGalleryItems: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    src: '/images/placeholder.svg',
    title: 'Collar Dorado Premium',
    description: 'Hermoso collar con detalles únicos',
    category: 'regalos',
    badge: 'Nuevo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'image',
    src: '/images/placeholder.svg',
    title: 'Auriculares Bluetooth',
    description: 'Tecnología de última generación',
    category: 'tecnologia',
    badge: 'Popular',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'image',
    src: '/images/placeholder.svg',
    title: 'Pulsera Elegante',
    description: 'Diseño exclusivo y moderno',
    category: 'regalos',
    badge: 'Oferta',
    createdAt: new Date().toISOString()
  }
];

export const hybridGalleryService = {
  // Obtener todos los items
  async getItems(): Promise<MediaItem[]> {
    console.log('🇫️ Cargando galería...');
    
    // Intentar Firebase primero
    if (db) {
      try {
        console.log('📡 Conectando a Firebase para galería...');
        let q;
        try {
          q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        } catch {
          q = collection(db, COLLECTION_NAME);
        }
        
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MediaItem[];
        
        console.log(`✅ ${items.length} items de galería cargados desde Firebase`);
        
        // Guardar en localStorage como caché
        if (items.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          return items;
        }
      } catch (error) {
        console.log('⚠️ Firebase no disponible para galería, usando almacenamiento local');
      }
    }
    
    // Usar localStorage como fallback
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        console.log(`📱 ${items.length} items de galería cargados desde localStorage`);
        return items;
      }
    } catch (error) {
      console.error('Error loading gallery from localStorage:', sanitizeForLog(String(error)));
    }
    
    // Usar items de ejemplo como último recurso
    console.log('🎯 Usando items de galería de ejemplo');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackGalleryItems));
    return fallbackGalleryItems;
  },

  // Agregar nuevo item
  async addItem(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem> {
    const itemData = {
      ...item,
      createdAt: new Date().toISOString()
    };
    
    // Intentar Firebase primero
    if (db) {
      try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), itemData);
        const newItem = { ...itemData, id: docRef.id };
        console.log('Gallery item added to Firebase:', docRef.id);
        return newItem;
      } catch (error) {
        console.log('Firebase not available, using localStorage');
      }
    }
    
    // Usar localStorage como fallback
    const items = await this.getItems();
    
    // Límite de 25 items máximo
    if (items.length >= 25) {
      throw new Error('Máximo 25 archivos permitidos. Elimina algunos para agregar más.');
    }
    
    const newId = Date.now().toString();
    const newItem: MediaItem = { ...itemData, id: newId };
    
    try {
      const updatedItems = [...items, newItem];
      
      // Verificar tamaño antes de guardar
      const dataSize = JSON.stringify(updatedItems).length;
      if (dataSize > 8 * 1024 * 1024) { // 8MB límite
        throw new Error('Espacio de almacenamiento lleno. Elimina algunos archivos.');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error('Error saving item:', sanitizeForLog(String(error)));
      throw new Error('No se pudo guardar el archivo.');
    }
  },

  // Eliminar item
  async removeItem(id: string): Promise<void> {
    // Intentar Firebase primero
    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        console.log('Gallery item deleted from Firebase:', id);
        return;
      } catch (error) {
        console.log('Firebase not available, using localStorage');
      }
    }
    
    // Usar localStorage como fallback
    const items = await this.getItems();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
  },

  // Limpiar todos los items
  async clearAll(): Promise<void> {
    // Intentar Firebase primero
    if (db) {
      try {
        const items = await this.getItems();
        const deletePromises = items.map(item => 
          deleteDoc(doc(db, COLLECTION_NAME, item.id))
        );
        await Promise.all(deletePromises);
        console.log('All gallery items deleted from Firebase');
        return;
      } catch (error) {
        console.log('Firebase not available, using localStorage');
      }
    }
    
    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEY);
  },

  // Obtener información de almacenamiento
  getStorageInfo(): { used: number; limit: number; items: number; percentage: number } {
    try {
      const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const dataSize = JSON.stringify(items).length;
      const limit = 8 * 1024 * 1024; // 8MB
      return {
        used: dataSize,
        limit,
        items: items.length,
        percentage: Math.round((dataSize / limit) * 100)
      };
    } catch (error) {
      return { used: 0, limit: 8 * 1024 * 1024, items: 0, percentage: 0 };
    }
  },

  // Verificar conexión
  async testConnection(): Promise<boolean> {
    if (!db) return false;
    
    try {
      const testCollection = collection(db, COLLECTION_NAME);
      await getDocs(testCollection);
      console.log('Firebase gallery connection successful');
      return true;
    } catch (error) {
      console.error('Firebase gallery connection failed:', error);
      return false;
    }
  }
};