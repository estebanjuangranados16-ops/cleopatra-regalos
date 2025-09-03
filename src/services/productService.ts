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

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      // Intentar con ordenamiento primero
      let q;
      try {
        q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      } catch {
        // Si falla el ordenamiento, usar consulta simple
        q = collection(db, COLLECTION_NAME);
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const productData = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), productData);
      console.log('Product added successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateData = {
        ...product,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(docRef, updateData);
      console.log('Product updated successfully:', id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      console.log('Product deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Método para verificar la conexión
  async testConnection(): Promise<boolean> {
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