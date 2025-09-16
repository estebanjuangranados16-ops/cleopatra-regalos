import { MediaItem } from './galleryService';
import { cloudinaryService } from './cloudinaryService';
import { sanitizeForLog } from '../utils/security';

// Servicio híbrido que combina localStorage y Cloudinary
export interface HybridMediaItem extends MediaItem {
  cloudinaryId?: string;
  isCloudinary?: boolean;
}

const STORAGE_KEY = 'cleopatra_gallery_hybrid';
const USE_CLOUDINARY = true; // Always use Cloudinary to avoid localStorage limits

export class HybridGalleryService {
  // Obtener todos los items
  getItems(): HybridMediaItem[] {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : this.getDefaultItems();
    } catch (error) {
      console.error('Error loading gallery items:', sanitizeForLog(String(error)));
      return this.getDefaultItems();
    }
  }

  // Items por defecto para mostrar contenido inicial
  private getDefaultItems(): HybridMediaItem[] {
    return [
      {
        id: 1,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
        title: 'Smartwatch Collection 2024',
        description: 'Los mejores smartwatches del mercado con tecnología de punta.',
        category: 'Tecnología',
        badge: 'Nuevo',
        createdAt: new Date().toISOString(),
        isCloudinary: false
      },
      {
        id: 2,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        title: 'Canasta Desayuno Sorpresa',
        description: 'Sorprende con nuestras canastas gourmet llenas de amor.',
        category: 'Regalos',
        badge: 'Popular',
        createdAt: new Date().toISOString(),
        isCloudinary: false
      }
    ];
  }

  // Agregar nuevo item
  async addItem(file: File, metadata: {
    title: string;
    description: string;
    category: string;
    badge: string;
    isInstagramPost?: boolean;
  }): Promise<HybridMediaItem> {
    const items = this.getItems();
    
    // Sin límite de archivos - solo limitado por Cloudinary
    const maxItems = 999999; // Prácticamente ilimitado

    try {
      let src: string;
      let thumbnail: string | undefined;
      let cloudinaryId: string | undefined;
      let isCloudinary = false;

      try {
        if (USE_CLOUDINARY) {
          // Intentar Cloudinary primero
          const uploadResult = await cloudinaryService.uploadFile(file);
          src = uploadResult.url;
          thumbnail = uploadResult.thumbnail;
          cloudinaryId = uploadResult.publicId;
          isCloudinary = true;
        } else {
          throw new Error('Cloudinary disabled');
        }
      } catch (cloudinaryError) {
        console.warn('Cloudinary failed, using localStorage:', cloudinaryError);
        // Fallback a localStorage (solo para archivos pequeños)
        const maxSize = 10 * 1024 * 1024; // 10MB máximo para localStorage
        if (file.size > maxSize) {
          throw new Error('Archivo muy grande para localStorage. Cloudinary no disponible.');
        }
        src = await this.fileToBase64(file);
        thumbnail = file.type.startsWith('video/') ? undefined : src;
        isCloudinary = false;
      }

      const newItem: HybridMediaItem = {
        id: Date.now(),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        src,
        thumbnail,
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        badge: metadata.badge,
        isInstagramPost: metadata.isInstagramPost,
        createdAt: new Date().toISOString(),
        cloudinaryId,
        isCloudinary
      };

      const updatedItems = [...items, newItem];
      
      // Intentar guardar con manejo de errores
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      } catch (error) {
        if (error instanceof DOMException && error.code === 22) {
          // Quota exceeded - limpiar items antiguos
          const recentItems = items.slice(-10); // Mantener solo los 10 más recientes
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...recentItems, newItem]));
        } else {
          throw error;
        }
      }
      
      return newItem;
    } catch (error) {
      console.error('Error adding item:', sanitizeForLog(String(error)));
      throw error;
    }
  }

  // Eliminar item
  async removeItem(id: number): Promise<void> {
    try {
      const items = this.getItems();
      const itemToRemove = items.find(item => item.id === id);
      
      // Si es de Cloudinary, intentar eliminarlo
      if (itemToRemove?.isCloudinary && itemToRemove.cloudinaryId) {
        await cloudinaryService.deleteFile(
          itemToRemove.cloudinaryId,
          itemToRemove.type
        );
      }

      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error removing item:', sanitizeForLog(String(error)));
      throw new Error('No se pudo eliminar el archivo.');
    }
  }

  // Limpiar todo
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Información de almacenamiento
  getStorageInfo(): { used: number; limit: number; items: number; percentage: number; isProduction: boolean } {
    const items = this.getItems();
    const maxItems = 999999;
    
    return {
      used: items.length,
      limit: maxItems,
      items: items.length,
      percentage: Math.min(Math.round((items.length / 1000) * 100), 100), // Basado en 1000 archivos para el %
      isProduction: USE_CLOUDINARY
    };
  }

  // Convertir archivo a base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Optimizar imagen si es de Cloudinary
  optimizeImage(item: HybridMediaItem, options?: { width?: number; height?: number }): string {
    if (item.isCloudinary && item.src) {
      return cloudinaryService.optimizeImageUrl(item.src, options);
    }
    return item.src;
  }
}

export const hybridGalleryService = new HybridGalleryService();