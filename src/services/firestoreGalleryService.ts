import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { cloudinaryService } from './cloudinaryService';
import { sanitizeForLog } from '../utils/security';

export interface FirestoreMediaItem {
  id?: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  badge: string;
  isInstagramPost?: boolean;
  cloudinaryId?: string;
  createdAt: Timestamp | Date;
}

const COLLECTION_NAME = 'gallery';

export class FirestoreGalleryService {
  // Obtener todos los items desde Firestore
  async getItems(): Promise<FirestoreMediaItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreMediaItem[];
      
      console.log('Loaded items from Firestore:', items.length);
      return items;
    } catch (error) {
      console.error('Error loading gallery items from Firestore:', sanitizeForLog(String(error)));
      return [];
    }
  }

  // Agregar nuevo item a Firestore
  async addItem(file: File, metadata: {
    title: string;
    description: string;
    category: string;
    badge: string;
    isInstagramPost?: boolean;
  }): Promise<FirestoreMediaItem> {
    try {
      // Subir archivo a Cloudinary
      const uploadResult = await cloudinaryService.uploadFile(file);
      
      // Crear documento para Firestore
      const newItem = {
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        src: uploadResult.url,
        thumbnail: uploadResult.thumbnail,
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        badge: metadata.badge,
        isInstagramPost: metadata.isInstagramPost || false,
        cloudinaryId: uploadResult.publicId,
        createdAt: serverTimestamp()
      };

      // Guardar en Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newItem);
      
      return {
        id: docRef.id,
        ...newItem,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error adding item to Firestore:', sanitizeForLog(String(error)));
      throw new Error('No se pudo subir el archivo. Verifica tu conexión.');
    }
  }

  // Eliminar item de Firestore y Cloudinary
  async removeItem(id: string, cloudinaryId?: string): Promise<void> {
    try {
      // Eliminar de Cloudinary si existe
      if (cloudinaryId) {
        await cloudinaryService.deleteFile(cloudinaryId, 'image');
      }

      // Eliminar de Firestore
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error removing item:', sanitizeForLog(String(error)));
      throw new Error('No se pudo eliminar el archivo.');
    }
  }

  // Optimizar imagen
  optimizeImage(item: FirestoreMediaItem, options?: { width?: number; height?: number }): string {
    if (item.cloudinaryId && item.src) {
      return cloudinaryService.optimizeImageUrl(item.src, options);
    }
    return item.src;
  }
}

export const firestoreGalleryService = new FirestoreGalleryService();