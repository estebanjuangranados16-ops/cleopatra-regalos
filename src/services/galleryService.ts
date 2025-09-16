export interface MediaItem {
  id: number;
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

import { sanitizeForLog } from '../utils/security';

const STORAGE_KEY = 'cleopatra_gallery_items';

export const galleryService = {
  // Obtener todos los items
  getItems: (): MediaItem[] => {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error loading gallery items:', sanitizeForLog(String(error)));
      return [];
    }
  },

  // Agregar nuevo item
  addItem: (item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem => {
    const items = galleryService.getItems();
    
    // Límite de 25 items máximo
    if (items.length >= 25) {
      throw new Error('Máximo 25 archivos permitidos. Elimina algunos para agregar más.');
    }
    
    const newItem: MediaItem = {
      ...item,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
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
      if (error instanceof Error && (error.message.includes('Máximo') || error.message.includes('Espacio'))) {
        throw error;
      }
      
      // Si falla por quota, intentar limpiar items antiguos
      try {
        if (items.length > 10) {
          const recentItems = items.slice(-10);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...recentItems, newItem]));
          throw new Error('Espacio limitado. Se eliminaron archivos antiguos para hacer espacio.');
        }
      } catch {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newItem]));
        throw new Error('Espacio muy limitado. Se eliminaron todos los archivos anteriores.');
      }
      throw new Error('No se pudo guardar el archivo.');
    }
  },

  // Eliminar item
  removeItem: (id: number): void => {
    const items = galleryService.getItems();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
  },

  // Actualizar item
  updateItem: (id: number, updates: Partial<MediaItem>): void => {
    const items = galleryService.getItems();
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  },

  // Limpiar todos los items
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Obtener información de almacenamiento
  getStorageInfo: (): { used: number; limit: number; items: number; percentage: number } => {
    try {
      const items = galleryService.getItems();
      const dataSize = JSON.stringify(items).length;
      const limit = 8 * 1024 * 1024; // 8MB
      return {
        used: dataSize,
        limit,
        items: items.length,
        percentage: Math.round((dataSize / limit) * 100)
      };
    } catch (error) {
      return { used: 0, limit: 3 * 1024 * 1024, items: 0, percentage: 0 };
    }
  }
};