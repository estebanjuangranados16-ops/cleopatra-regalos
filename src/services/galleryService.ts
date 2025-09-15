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

const STORAGE_KEY = 'cleopatra_gallery_items';

export const galleryService = {
  // Obtener todos los items
  getItems: (): MediaItem[] => {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error loading gallery items:', error);
      return [];
    }
  },

  // Agregar nuevo item
  addItem: (item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem => {
    const newItem: MediaItem = {
      ...item,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    try {
      const items = galleryService.getItems();
      const updatedItems = [...items, newItem];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error('Error saving item:', error);
      // Si falla, intentar limpiar items antiguos
      try {
        const items = galleryService.getItems();
        if (items.length > 5) {
          const recentItems = items.slice(-5);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...recentItems, newItem]));
          return newItem;
        }
      } catch {
        // Si todo falla, limpiar completamente
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newItem]));
        return newItem;
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
  }
};