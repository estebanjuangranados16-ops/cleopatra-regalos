import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { MediaItem } from './hybridGalleryService';

// Productos de ejemplo para la base de datos
const sampleProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Collar Dorado Elegante',
    price: 89000,
    originalPrice: 120000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&q=80'
    ],
    category: 'regalos',
    description: 'Hermoso collar dorado con detalles únicos, perfecto para ocasiones especiales. Fabricado con materiales de alta calidad.',
    stock: 15,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Auriculares Bluetooth Pro',
    price: 150000,
    originalPrice: 200000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80'
    ],
    category: 'tecnologia',
    description: 'Auriculares de alta calidad con cancelación de ruido activa. Perfectos para música, llamadas y entretenimiento.',
    stock: 8,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Pulsera de Plata Elegante',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=80'
    ],
    category: 'regalos',
    description: 'Elegante pulsera de plata con grabado personalizado. Un regalo perfecto para personas especiales.',
    stock: 12,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Smartwatch Deportivo',
    price: 280000,
    originalPrice: 350000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80'
    ],
    category: 'tecnologia',
    description: 'Smartwatch con múltiples funciones deportivas, monitor de salud y conectividad avanzada.',
    stock: 5,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Anillo de Compromiso',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80'
    ],
    category: 'regalos',
    description: 'Hermoso anillo de compromiso con diamante central. Símbolo perfecto de amor eterno.',
    stock: 3,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Tablet Pro 11"',
    price: 890000,
    originalPrice: 1200000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80'
    ],
    category: 'tecnologia',
    description: 'Tablet profesional de 11 pulgadas con pantalla de alta resolución y procesador potente.',
    stock: 6,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

// Items de galería de ejemplo
const sampleGalleryItems: Omit<MediaItem, 'id'>[] = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    title: 'Collar Dorado Premium',
    description: 'Hermoso collar con detalles únicos que refleja elegancia y sofisticación.',
    category: 'Productos',
    badge: 'Nuevo',
    createdAt: new Date().toISOString()
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    title: 'Auriculares Bluetooth',
    description: 'Tecnología de última generación para una experiencia auditiva excepcional.',
    category: 'Tecnología',
    badge: 'Popular',
    createdAt: new Date().toISOString()
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    title: 'Pulsera Elegante',
    description: 'Diseño exclusivo y moderno que complementa cualquier outfit.',
    category: 'Regalos',
    badge: 'Oferta',
    createdAt: new Date().toISOString()
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    title: 'Smartwatch Deportivo',
    description: 'El compañero perfecto para tu estilo de vida activo y saludable.',
    category: 'Tecnología',
    badge: 'Premium',
    createdAt: new Date().toISOString()
  }
];

export const seedService = {
  // Inicializar productos en Firebase
  async seedProducts(): Promise<void> {
    if (!db) {
      console.log('Firebase no disponible - usando datos locales');
      return;
    }

    try {
      console.log('Verificando productos existentes...');
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      
      if (snapshot.empty) {
        console.log('No hay productos - creando productos de ejemplo...');
        
        for (const product of sampleProducts) {
          await addDoc(productsRef, product);
          console.log(`Producto creado: ${product.name}`);
        }
        
        console.log(`✅ ${sampleProducts.length} productos creados exitosamente`);
      } else {
        console.log(`✅ Ya existen ${snapshot.size} productos en la base de datos`);
      }
    } catch (error) {
      console.error('Error al crear productos:', error);
      throw error;
    }
  },

  // Inicializar galería en Firebase
  async seedGallery(): Promise<void> {
    if (!db) {
      console.log('Firebase no disponible - usando datos locales');
      return;
    }

    try {
      console.log('Verificando galería existente...');
      const galleryRef = collection(db, 'gallery');
      const snapshot = await getDocs(galleryRef);
      
      if (snapshot.empty) {
        console.log('No hay items en galería - creando contenido de ejemplo...');
        
        for (const item of sampleGalleryItems) {
          await addDoc(galleryRef, item);
          console.log(`Item de galería creado: ${item.title}`);
        }
        
        console.log(`✅ ${sampleGalleryItems.length} items de galería creados exitosamente`);
      } else {
        console.log(`✅ Ya existen ${snapshot.size} items en la galería`);
      }
    } catch (error) {
      console.error('Error al crear items de galería:', error);
      throw error;
    }
  },

  // Inicializar todo
  async initializeData(): Promise<void> {
    console.log('🚀 Inicializando datos de Cleopatra Regalos...');
    
    try {
      await this.seedProducts();
      await this.seedGallery();
      console.log('✅ Inicialización completada exitosamente');
    } catch (error) {
      console.error('❌ Error durante la inicialización:', error);
      console.log('📱 La aplicación funcionará con datos locales');
    }
  },

  // Verificar conexión a Firebase
  async testConnection(): Promise<boolean> {
    if (!db) {
      console.log('Firebase no configurado');
      return false;
    }

    try {
      const testRef = collection(db, 'products');
      await getDocs(testRef);
      console.log('✅ Conexión a Firebase exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión a Firebase:', error);
      return false;
    }
  }
};